/* ============================================================
   PUNCHLINE — FacebookAdsMCPService (Section 27: API/MCP layer)
   Manages the real facebook-ads-library-mcp server
   (RamsesAguirre777/facebook-ads-library-mcp, FastMCP stdio):
   connection, auth, tool discovery, tool execution, errors,
   retries, timeouts and response normalization.

   Transport: MCP over stdio = JSON-RPC 2.0 messages, one JSON
   object per line on stdout of the Python process.

   Config (server/data/fbads-mcp.json + server/.env):
     { pythonPath, scriptPath, facebookToken }
   Token precedence: process.env.FB_ADS_ACCESS_TOKEN > server/.env > config file.
   The token never leaves this process — the frontend only ever
   sees the masked value returned by status().
   ============================================================ */
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readStore, writeStore } from "./store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_FILE = path.join(__dirname, "..", ".env");
const CONFIG_FILE = "fbads-mcp.json";
const PROTOCOL_VERSION = "2024-11-05";
const DEFAULT_PYTHON = process.platform === "win32" ? "python" : "python3";
const DEFAULT_SCRIPT = "facebook_ads_mcp_complete.py";
const GRAPH_API_VERSION = "v25.0"; // current stable (Feb 2026); v19.0 expired May 2026
const ADS_LIBRARY_ACCESS_URL = "https://www.facebook.com/ads/library/api";

function readEnvFile() {
  if (!existsSync(ENV_FILE)) return {};
  try {
    const out = {};
    readFileSync(ENV_FILE, "utf8").split(/\r?\n/).forEach((ln) => {
      const m = ln.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    });
    return out;
  } catch { return {}; }
}

function envToken() {
  if (process.env.FB_ADS_ACCESS_TOKEN) return process.env.FB_ADS_ACCESS_TOKEN;
  const env = readEnvFile();
  return env.FB_ADS_ACCESS_TOKEN || env.FACEBOOK_ACCESS_TOKEN || "";
}

function writeEnvToken(token) {
  try {
    const env = readEnvFile();
    env.FB_ADS_ACCESS_TOKEN = token;
    writeFileSync(ENV_FILE, Object.entries(env).map(([k, v]) => `${k}=${v}`).join("\n") + "\n", "utf8");
    return true;
  } catch { return false; }
}

let config = loadConfig();
let proc = null;
let tools = [];
let statusState = { state: "disconnected", error: null, lastCall: null, lastDuration: null, lastError: null };
let hardBlock = null; // { token, state, error, detail } — stops search retries until token changes / manual test
let rid = 0;
let buf = "";
let waiters = new Map();
let nextId = () => ++rid;

function loadConfig() {
  const c = readStore(CONFIG_FILE);
  const envTok = envToken();
  return {
    pythonPath: c.pythonPath || DEFAULT_PYTHON,
    scriptPath: c.scriptPath || DEFAULT_SCRIPT,
    facebookToken: envTok || c.facebookToken || "",
    tokenSource: envTok ? "env" : (c.facebookToken ? "config" : "none"),
  };
}

export function getConfig() {
  return { ...config };
}

export function saveConfig(next) {
  const t = (v) => String(v == null ? "" : v).trim();
  const keepUnlessBlank = (incoming, current, defaultValue) => {
    if (!incoming) return current;
    if (incoming === defaultValue && current && current !== defaultValue) return current;
    return incoming;
  };
  const tokenChanged = (next && next.facebookToken != null && t(next.facebookToken)) && t(next.facebookToken) !== config.facebookToken;
  config = {
    pythonPath: keepUnlessBlank(t(next && next.pythonPath), config.pythonPath, DEFAULT_PYTHON),
    scriptPath: keepUnlessBlank(t(next && next.scriptPath), config.scriptPath, DEFAULT_SCRIPT),
    facebookToken: (next && next.facebookToken != null && t(next.facebookToken)) ? t(next.facebookToken) : config.facebookToken,
    tokenSource: config.tokenSource,
  };
  if ((next && next.facebookToken != null && t(next.facebookToken))) {
    // UI save writes to the backend .env (single source of truth), plus the legacy config file.
    config.tokenSource = "env";
    writeEnvToken(config.facebookToken);
  }
  writeStore(CONFIG_FILE, config);
  if (tokenChanged) hardBlock = null; // new token → allow a fresh attempt
  return config;
}

export function maskedToken() {
  const t = config.facebookToken;
  if (!t) return "";
  if (t.length <= 8) return "••••";
  return t.slice(0, 4) + "••••••••" + t.slice(-4);
}

/* ---------- MCP stdio client ---------- */

function redactToken(s) {
  return String(s || "").replace(/access_token=([^&\s"}\]]+)/g, "access_token=REDACTED");
}

function describeError(err) {
  if (err && typeof err === "object") {
    const e = err.error && typeof err.error === "object" ? err.error : err;
    if (typeof e === "object" && e !== null) {
      const parts = [];
      if (e.message != null) parts.push("Facebook API: " + String(e.message));
      if (e.type != null) parts.push("type: " + e.type);
      if (e.code != null) parts.push("code: " + e.code);
      if (e.error_subcode != null) parts.push("subcode: " + e.error_subcode);
      if (e.error_user_title != null) parts.push("title: " + e.error_user_title);
      if (e.error_user_msg != null) parts.push("fix: " + e.error_user_msg);
      if (e.http_status != null) parts.push("http " + e.http_status);
      if (parts.length) return parts.join(" | ");
      try { return JSON.stringify(e); } catch { return String(e); }
    }
  }
  return String(err || "");
}

function classifyError(text) {
  const s = describeError(text).toLowerCase();
  if (s.includes("2332002") || s.includes("does not have permission") || s.includes("ads library/api")) {
    return { state: "auth_error", error: "Facebook Ads Library API access required for this app/token — request it at facebook.com/ads/library/api, then generate a fresh token (ads_read)." };
  }
  if (s.includes("access token") || s.includes("token required") || s.includes("invalid token") || s.includes("auth") || s.includes("permission")) return { state: "auth_error", error: "Authentication error — check that the Facebook token is valid and has the ads_read permission." };
  if (s.includes("429") || s.includes("rate limit") || s.includes("too many requests")) return { state: "rate_limited", error: "Rate limited by the Facebook Graph API — wait and retry." };
  if (s.includes("module") || s.includes("no module") || s.includes("traceback")) return { state: "environment_error", error: "Python/MCP environment error — check the Python and script configuration." };
  return { state: "tool_error", error: redactToken(describeError(text)).slice(0, 600) };
}

// Full Facebook access breakdown. Distinguishes:
//   token          -> /me              (is the access token valid?)
//   adsRead        -> /me/permissions  (does the token carry the ads_read scope?)
//   adsLibraryApi  -> inferred         (is the app allowed to use Ads Library API? subcode 2332002)
//   adsArchive     -> /ads_archive     (can we actually read ads?)
async function probeFacebook(token) {
  const out = {
    token: { valid: null, error: null },
    adsRead: { granted: null, status: null },
    adsLibraryApi: { granted: null, error: null },
    adsArchive: { working: null, status: null, error: null },
    blocked: false,
    blockedReason: null,
    state: null,
    message: null,
    error: null,
  };
  const parse = async (r) => { try { return await r.json(); } catch { return null; } };
  try {
    // 1) token validity
    const r1 = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/me?fields=id,name&access_token=${token}`);
    const j1 = await parse(r1);
    out.token.valid = r1.ok;
    if (!r1.ok) {
      out.token.error = j1 && j1.error;
      out.blocked = true;
      out.blockedReason = "token";
      out.state = "auth_error";
      out.message = "Invalid Facebook token — check the access token and re-enter it.";
      out.error = out.token.error || { message: "HTTP " + r1.status };
      return out;
    }
    // 2) ads_read scope
    const r2 = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/me/permissions?access_token=${token}`);
    const j2 = await parse(r2);
    if (r2.ok && Array.isArray(j2 && j2.data)) {
      const prm = j2.data.find((p) => p.permission === "ads_read");
      out.adsRead.status = prm ? prm.status : "not_present";
      out.adsRead.granted = !!prm && prm.status === "granted";
    } else {
      out.adsRead.granted = false;
      out.adsRead.status = "unknown";
      out.adsRead.error = (j2 && j2.error) || { message: "HTTP " + r2.status };
    }
    // 3+4) /ads_archive probe
    const enc = encodeURIComponent('["US"]');
    const r3 = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/ads_archive?access_token=${token}&ad_reached_countries=${enc}&search_terms=logo&ad_active_status=ALL&limit=1`);
    const j3 = await parse(r3);
    out.adsArchive.status = r3.status;
    if (r3.ok && Array.isArray(j3 && j3.data)) {
      out.adsArchive.working = true;
      out.adsLibraryApi.granted = true;
      out.state = "connected";
      out.message = "Connected — /ads_archive is working.";
      return out;
    }
    out.adsArchive.working = false;
    const e = (j3 && j3.error) || {};
    out.adsArchive.error = e;
    out.error = e;
    out.blocked = true;
    if (e.error_subcode === 2332002 || e.code === 10) {
      out.adsLibraryApi.granted = false;
      out.adsLibraryApi.error = e;
      out.blockedReason = "ads_library_api";
      out.state = "ads_library_api_required";
      out.message = "Ads Library API access is required for this Facebook application. Request access at facebook.com/ads/library/api, then paste a fresh token (ads_read).";
    } else {
      out.adsLibraryApi.granted = null;
      out.blockedReason = "ads_archive";
      out.state = "tool_error";
      out.message = "Facebook Ads Library request failed: " + describeError(e);
    }
  } catch (e) {
    out.token.valid = null;
    out.blocked = true;
    out.blockedReason = "network";
    out.state = "tool_error";
    out.message = "Network error reaching the Facebook Graph API: " + e.message;
    out.error = { message: e.message };
  }
  return out;
}

export async function probeToken(token, opts) {
  // In-memory test of a candidate token — never persists, never touches config.
  const resolved = (token && String(token).trim()) ? String(token).trim() : config.facebookToken;
  if (!resolved) return { ok: false, error: "No token to test — paste a Facebook access token (ads_read)." };
  const probe = await probeFacebook(resolved);
  return {
    ok: probe.state === "connected",
    state: probe.state,
    blocked: probe.blocked,
    blockedReason: probe.blockedReason,
    message: probe.message,
    token: probe.token,
    adsRead: probe.adsRead,
    adsLibraryApi: probe.adsLibraryApi,
    adsArchive: probe.adsArchive,
    permissionUrl: probe.blockedReason === "ads_library_api" ? ADS_LIBRARY_ACCESS_URL : null,
    detail: probe.error,
  };
}

function parseLine(line) {
  try { return JSON.parse(line); } catch { return null; }
}

function send(method, params, timeoutMs) {
  return new Promise((resolve, reject) => {
    const msg = { jsonrpc: "2.0", id: nextId(), method, params };
    const id = msg.id;
    const timer = setTimeout(() => {
      waiters.delete(id);
      reject(new Error("MCP call timed out: " + method));
    }, timeoutMs || 120000);
    waiters.set(id, { resolve, reject, timer });
    try {
      proc.stdin.write(JSON.stringify(msg) + "\n");
    } catch (e) {
      clearTimeout(timer);
      waiters.delete(id);
      reject(e);
    }
  });
}

export function isConnected() {
  return !!proc && proc.exitCode == null && statusState.state === "connected";
}

export async function connect(forceConfig) {
  if (forceConfig) saveConfig(forceConfig);
  await disconnect();
  statusState.lastError = null;
  if (!config.facebookToken) {
    statusState = { state: "auth_error", error: "Facebook access token required — set it in the AD LIBRARY settings.", lastCall: null, lastDuration: null, lastError: null };
    tools = [];
    return statusState;
  }

  return new Promise((resolve) => {
    const script = config.scriptPath;
    const args = [script, "--facebook-token", config.facebookToken];
    let stderr = "";
    let settled = false;
    const finish = (st) => { if (!settled) { settled = true; statusState = st; resolve(statusState); } };

    let child;
    try {
      child = spawn(config.pythonPath, args, {
        shell: false,
        env: Object.assign({}, process.env, { PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" }),
      });
    } catch (e) {
      statusState = { state: "environment_error", error: "Failed to launch Python: " + redactToken(e.message), lastCall: null, lastDuration: null, lastError: null };
      tools = [];
      resolve(statusState);
      return;
    }
    proc = child;

    child.on("error", (e) => {
      finish({ state: "environment_error", error: "Python launch failed — " + redactToken(e.message) + ". Check pythonPath and that FastMCP is installed.", lastCall: null, lastDuration: null, lastError: null });
    });
    child.on("exit", (code) => {
      if (!settled && code !== 0) {
        const err = redactToken(stderr || "Python exited with code " + code);
        const cls = classifyError(err);
        finish({ state: cls.state, error: cls.error || err.slice(0, 400), lastCall: null, lastDuration: null, lastError: null });
      }
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    child.stdout.on("data", (d) => {
      buf += d.toString();
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl); buf = buf.slice(nl + 1);
        const msg = parseLine(line);
        if (!msg) continue;
        if (msg.id && waiters.has(msg.id)) {
          const w = waiters.get(msg.id);
          waiters.delete(msg.id);
          clearTimeout(w.timer);
          if (msg.error) w.reject(new Error(msg.error.message || "MCP error"));
          else w.resolve(msg.result);
        }
      }
    });

    child.on("spawn", () => {
      const t0 = Date.now();
      (async () => {
        try {
          await send("initialize", { protocolVersion: PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: "punchline-ad-library", version: "1.0" } });
          proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");
          const listed = await send("tools/list", {});
          tools = Array.isArray(listed.tools) ? listed.tools : [];
          // Real Facebook validation: connected only when token valid AND ads_read AND /ads_archive work.
          const probe = await probeFacebook(config.facebookToken);
          if (probe.blocked) {
            hardBlock = { token: config.facebookToken, state: probe.state, error: probe.message, detail: redactData(probe.error) };
            statusState = { state: probe.state, error: probe.message, lastCall: "tools/list", lastDuration: Date.now() - t0, lastError: redactData(probe.error) };
            settled = true;
            try { child.kill(); } catch (e) {} // no idle Python process while blocked
            proc = null;
            tools = [];
            resolve(statusState);
            return;
          }
          hardBlock = null;
          finish({ state: "connected", error: null, lastCall: "tools/list", lastDuration: Date.now() - t0 });
        } catch (e) {
          finish({ state: "tool_error", error: e.message, lastCall: null, lastDuration: null });
        }
      })();
    });
  });
}

export async function disconnect() {
  tools = [];
  if (proc && proc.exitCode == null) {
    try { proc.kill(); } catch (e) {}
  }
  proc = null;
  buf = "";
  for (const [, w] of waiters) { clearTimeout(w.timer); w.reject(new Error("disconnected")); }
  waiters.clear();
  if (statusState.state === "connected") statusState = { state: "disconnected", error: null, lastCall: null, lastDuration: null };
}

export function listTools() {
  return tools;
}

export async function callTool(name, args, timeoutMs) {
  // Stop retrying when the app is hard-blocked (e.g. Ads Library API not granted).
  if (hardBlock && hardBlock.token === config.facebookToken && !isConnected()) {
    return { ok: false, error: hardBlock.error, detail: hardBlock.detail, state: hardBlock.state, blocked: true };
  }
  if (!isConnected()) {
    const c = await connect();
    if (c.state !== "connected") return { ok: false, error: c.error || "MCP disconnected", state: c.state, blocked: !!hardBlock };
  }
  const t0 = Date.now();
  try {
    const result = await send("tools/call", { name, arguments: args || {} }, timeoutMs);
    statusState.lastCall = name;
    statusState.lastDuration = Date.now() - t0;
    const text = Array.isArray(result.content)
      ? result.content.filter((c) => c.type === "text").map((c) => c.text).join("\n")
      : "";
    let data = null;
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }
    if (data && typeof data === "object" && data.success === false && data.error) {
      const desc = describeError(data.error);
      const cls = classifyError(desc);
      statusState.state = cls.state;
      statusState.error = cls.error;
      statusState.lastError = redactData(data.error, desc);
      return { ok: false, error: cls.error, detail: statusState.lastError, state: cls.state };
    }
    return { ok: !result.isError, data: redactData(data, text), text: redactToken(text), state: "connected" };
  } catch (e) {
    const cls = classifyError(e.message);
    statusState.state = cls.state;
    statusState.error = cls.error;
    statusState.lastError = redactToken(e.message);
    return { ok: false, error: cls.error, detail: statusState.lastError, state: cls.state };
  }
}

function redactData(data, text) {
  if (typeof data === "string") return redactToken(data);
  if (data && typeof data === "object") {
    const s = redactToken(JSON.stringify(data));
    try { return JSON.parse(s); } catch { return s; }
  }
  return data;
}

function pythonProbe() {
  return new Promise((resolve) => {
    const child = spawn(config.pythonPath, ["--version"], { shell: false, env: Object.assign({}, process.env, { PYTHONIOENCODING: "utf-8", PYTHONUTF8: "1" }) });
    let out = "";
    child.stdout.on("data", (d) => { out += d.toString(); });
    child.stderr.on("data", (d) => { out += d.toString(); });
    child.on("error", (e) => resolve({ ok: false, error: redactToken(e.message) }));
    child.on("exit", (code) => resolve({ ok: code === 0, version: out.trim().split(/\r?\n/)[0], exitCode: code }));
  });
}

export async function diagnostics() {
  const out = {
    backend: {
      connected: true,
      node: process.version,
      graphApiVersion: GRAPH_API_VERSION,
      pythonPath: config.pythonPath,
      scriptPath: config.scriptPath,
      scriptExists: existsSync(config.scriptPath),
      configFile: CONFIG_FILE,
      tokenSource: config.tokenSource,
      tokenMasked: maskedToken(),
    },
    python: await pythonProbe(),
    mcp: {
      connected: isConnected(),
      tools: tools.map((t) => t.name),
      toolCount: tools.length,
      state: statusState.state,
    },
    token: { valid: null, error: null },
    adsRead: { granted: null, status: null },
    adsLibraryApi: { granted: null, error: null },
    adsArchive: { working: null, status: null, error: null },
    permissionUrl: null,
    error: statusState.error,
    state: statusState.state,
  };
  const token = config.facebookToken;
  if (!token) {
    out.token.valid = false;
    out.token.error = { message: "no token configured" };
    return out;
  }
  const probe = await probeFacebook(token);
  out.token = probe.token;
  out.adsRead = probe.adsRead;
  out.adsLibraryApi = probe.adsLibraryApi;
  out.adsArchive = probe.adsArchive;
  out.permissionUrl = probe.blockedReason === "ads_library_api" ? ADS_LIBRARY_ACCESS_URL : null;
  out.error = probe.message || statusState.error;
  out.state = probe.state || statusState.state;
  return out;
}

export async function status() {
  if (!isConnected() && config.facebookToken) {
    // Lazy probe: report configured-but-not-connected without spawning.
    return { ...statusState, configured: !!config.facebookToken, tokenMasked: maskedToken(), tokenSource: config.tokenSource, tools: [], pythonPath: config.pythonPath, scriptPath: config.scriptPath, graphApiVersion: GRAPH_API_VERSION };
  }
  return { ...statusState, configured: !!config.facebookToken, tokenMasked: maskedToken(), tokenSource: config.tokenSource, tools, pythonPath: config.pythonPath, scriptPath: config.scriptPath, graphApiVersion: GRAPH_API_VERSION };
}
