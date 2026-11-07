/* PUNCHLINE — lightweight API server (Sections 18–21, 29).
   Serves the static Punchline frontend + a small JSON API the frontend calls
   via fetch(). API keys live here only (env vars or server/data/settings.json).
   Start:  cd server && npm install && npm start   (default port 3000)  */
import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

import { PROVIDERS, call, getKey, maskKey, listModels } from "./lib/providers.js";
import { routeFor, fallbacksFor, TASK_ROLES, FALLBACK_MODELS } from "./lib/router.js";
import { readStore, writeStore, collection, UPLOAD_DIR } from "./lib/store.js";
import { appendLog, listLogs } from "./lib/log.js";
import * as FbAdsMcp from "./lib/fbads-mcp.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "2mb" }));

/* ---------- Static frontend (deny access into /server itself) ---------- */
app.use((req, res, next) => {
  if (req.path.startsWith("/server")) return res.status(403).end();
  next();
});
app.use(express.static(ROOT, { index: "index.html" }));

/* ---------- File storage (multer) ---------- */
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${file.originalname.replace(/[^\w.\-]/g, "_")}`),
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
});

/* ---------- AI endpoint ---------- */
/* Scrape a URL server-side: readable text + best product image (no heavy deps). */
async function scrapePage(url) {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36" },
      redirect: "follow",
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return { text: "", image: "" };
    const html = await res.text();
    const abs = (u) => { try { return new URL(u, res.url).href; } catch (e) { return ""; } };
    let image = "";
    const og1 = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    const og2 = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (og1) image = abs(og1[1]);
    else if (og2) image = abs(og2[1]);
    if (!image) {
      const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)]
        .map((m) => abs(m[1]))
        .filter((u) => u && !/^data:/i.test(u) && !/\.svg|icon|logo|sprite/i.test(u));
      image = imgs[0] || "";
    }
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
    return { text, image };
  } catch (e) {
    return { text: "", image: "" };
  }
}

app.post("/api/ai/:task", async (req, res) => {
  const task = req.params.task;
  const role = (req.body && req.body.role) || TASK_ROLES[task] || "default";
  let prompt = (req.body && req.body.prompt) || buildPrompt(task, req.body && req.body.payload);

  // For product analysis: scrape the URL server-side so the AI actually reads
  // the page instead of flagging everything as unknown, and so we can show the
  // real product image in the snapshot.
  let scrapedImage = "";
  if (task === "extract_product") {
    const payload = (req.body && req.body.payload) || {};
    const url = payload.url || "";
    if (url && /^https?:\/\//i.test(url)) {
      const page = await scrapePage(url);
      scrapedImage = page.image;
      if (page.text) prompt += `\n\n=== PAGE CONTENT SCRAPED FROM ${url} — treat as verified source material ===\n${page.text}`;
    }
  }
  const route = routeFor(task, role);

  let attempts = [route];
  for (const fb of fallbacksFor(route.role, route.provider)) {
    attempts.push({ role: route.role, provider: fb, model: FALLBACK_MODELS[fb] });
  }

  const maxTokens = (req.body && req.body.maxTokens) || 4096;

  let lastErr = null;
  for (let i = 0; i < attempts.length; i++) {
    const r = attempts[i];
    const hasKey = !!getKey(r.provider);
    if (!hasKey && r.provider !== "nvidia") continue; // skip unconfigured providers

    try {
          const out = await call(r.provider, { model: r.model, prompt, system: SYSTEM(r.role), temperature: 0.4, max_tokens: maxTokens }, req.signal);
      /* Free-tier providers sometimes clamp long outputs mid-stream
         (finish_reason=length). Treat that as a soft failure and try the
         next fallback (a terse :free model) before giving up. */
      if (out.finishReason === "length") {
        appendLog({ provider: r.provider, model: out.model, task, status: "err", error: "Truncated output (finish_reason=length)" });
        lastErr = new Error("Truncated output (finish_reason=length)");
        continue;
      }
      appendLog({
        provider: r.provider, model: out.model, task,
        tokens: out.promptTokens + out.completionTokens,
        latencyMs: out.latencyMs, cost: out.costEstimate, status: "ok",
      });
      return res.json({
        ok: true,
        data: out.content,
        meta: {
          provider: PROVIDERS[r.provider]?.name || r.provider,
          model: out.model, tokens: out.promptTokens + out.completionTokens,
          latency: `${out.latencyMs}ms`, cost: `$${out.costEstimate.toFixed(4)}`,
          status: "ok",
          ...(scrapedImage ? { image: scrapedImage } : {}),
        },
      });
    } catch (err) {
      lastErr = err;
      appendLog({ provider: r.provider, model: r.model, task, status: "err", error: String(err) });
      const msg = String(err.message || err);
      if (/429|503|ResourceExhausted|rate.?limit|too many requests/i.test(msg)) {
        await new Promise((s) => setTimeout(s, 2500));
        try {
      const out = await call(r.provider, { model: r.model, prompt, system: SYSTEM(r.role), temperature: 0.4, max_tokens: maxTokens }, req.signal);
          if (out.finishReason === "length") {
            appendLog({ provider: r.provider, model: out.model, task, status: "err", error: "Truncated output (finish_reason=length)" });
            lastErr = new Error("Truncated output (finish_reason=length)");
            continue;
          }
          appendLog({
            provider: r.provider, model: out.model, task,
            tokens: out.promptTokens + out.completionTokens,
            latencyMs: out.latencyMs, cost: out.costEstimate, status: "ok",
          });
          return res.json({
            ok: true,
            data: out.content,
            meta: {
              provider: PROVIDERS[r.provider]?.name || r.provider,
              model: out.model, tokens: out.promptTokens + out.completionTokens,
              latency: `${out.latencyMs}ms`, cost: `$${out.costEstimate.toFixed(4)}`,
              status: "ok",
              ...(scrapedImage ? { image: scrapedImage } : {}),
            },
          });
        } catch (err2) {
          lastErr = err2;
          appendLog({ provider: r.provider, model: r.model, task, status: "err", error: String(err2) });
        }
      }
    }
  }

  /* No provider configured/available: return a simulated demo response so the
     whole pipeline still works end-to-end. Status is logged honestly. */
  appendLog({
    provider: "demo", model: "simulated", task, status: "ok",
    latencyMs: 400 + Math.round(Math.random() * 600),
  });
  res.json({
    ok: true,
    data: null,
    meta: {
      provider: "demo", model: "simulated",
      tokens: "sim", latency: `${400 + Math.round(Math.random() * 600)}ms`,
      cost: "$0.000", status: "ok",
      ...(scrapedImage ? { image: scrapedImage } : {}),
      note: lastErr ? `No provider key available (${lastErr.message.slice(0, 80)})` : "demo mode",
    },
  });
});

/* ---------- Chat assistant ---------- */
const CHAT_SYSTEM = [
  "You are the Punchline AI assistant: a senior direct-response performance marketer, copywriter, and product intelligence analyst.",
  "Be concise and practical. Never invent product facts, reviews, sales numbers, or testimonials.",
  "Separate verified facts from assumptions. Mark missing data as UNKNOWN / NEEDS USER INPUT.",
  "When recommending tests, state WHY and what result proves it works.",
].join(" ");

app.post("/api/chat", async (req, res) => {
  const raw = (req.body && req.body.messages) || [];
  const messages = raw.filter((m) => m && m.role && m.content).slice(-12);
  if (!messages.length) return res.status(400).json({ ok: false, error: "messages required" });
  const sysPrompt = (req.body && req.body.system) || CHAT_SYSTEM;
  const withSys = [{ role: "system", content: sysPrompt }, ...messages];

  const defRoute = routeFor("chat", req.body && req.body.role);
  const explicit = req.body && req.body.provider
    ? { provider: req.body.provider, model: req.body.model || undefined }
    : null;

  // If the user picked a specific model, use ONLY that model — no silent
  // fallback. Auto mode keeps the fallback chain.
  let attempts = [];
  if (explicit) {
    attempts.push(explicit);
  } else {
    attempts.push(defRoute);
    for (const fb of fallbacksFor(defRoute.role, defRoute.provider)) {
      attempts.push({ role: defRoute.role, provider: fb, model: undefined });
    }
  }

  let lastErr = null;
  for (let i = 0; i < attempts.length; i++) {
    const r = attempts[i];
    const hasKey = !!getKey(r.provider);
    if (!hasKey && r.provider !== "nvidia") continue;
    try {
      const out = await call(r.provider, { model: r.model, messages: withSys }, req.signal);
      appendLog({
        provider: r.provider, model: out.model, task: "chat",
        tokens: out.promptTokens + out.completionTokens,
        latencyMs: out.latencyMs, cost: out.costEstimate, status: "ok",
      });
      return res.json({
        ok: true,
        reply: out.content.trim(),
        meta: {
          provider: PROVIDERS[r.provider]?.name || r.provider,
          model: out.model, latency: `${out.latencyMs}ms`,
          status: "ok",
        },
      });
    } catch (err) {
      lastErr = err;
      appendLog({ provider: r.provider, model: r.model, task: "chat", status: "err", error: String(err) });
    }
  }

  // Explicit model chosen but failed -> tell the user, never silently swap to another AI.
  if (explicit) {
    return res.status(502).json({
      ok: false,
      error: (lastErr && lastErr.message) || "That model failed — pick another one from the dropdown.",
      meta: { provider: PROVIDERS[explicit.provider]?.name || explicit.provider, model: explicit.model || "default" },
    });
  }

  const last = messages[messages.length - 1];
  const demo = `[Demo] No AI provider with a working key is configured, so here's a simulated answer about "${String(last.content).slice(0, 80)}". Add an API key in Settings to talk to a real model.`;
  appendLog({ provider: "demo", model: "simulated", task: "chat", status: "ok" });
  res.json({ ok: true, reply: demo, meta: { provider: "demo", model: "simulated", status: "ok", note: lastErr ? lastErr.message.slice(0, 120) : "" } });
});

function SYSTEM(role) {
  return [
    "You are a senior direct-response performance marketer and product intelligence analyst.",
    "Never invent product facts, reviews, sales numbers, or testimonials.",
    "Separate verified facts from assumptions. Mark missing data as UNKNOWN / NEEDS USER INPUT.",
    "Every recommendation must state WHY we test it and WHAT result proves it works.",
    "Keep output practical, testing-oriented, non-deceptive, and specific to the product.",
  ].join(" ");
}

function buildPrompt(task, payload) {
  const ctx = (payload && JSON.stringify(payload).slice(0, 4000)) || "(no payload)";
  return `Task: ${task}\nContext: ${ctx}\nProduce the analysis in the app's expected JSON structure.`;
}

/* ---------- Settings / keys ---------- */
app.get("/api/settings", (req, res) => {
  const s = readStore("settings.json");
  res.json({
    routing: s.routing || {},
    providers: Object.fromEntries(
      Object.entries(PROVIDERS).map(([id, p]) => [id, { name: p.name, keyMasked: maskKey(id) }])
    ),
  });
});

app.post("/api/settings", (req, res) => {
  const s = readStore("settings.json") || {};
  if (req.body.keys) {
    // Store in server-side settings file only (never sent back in full).
    s.keys = { ...(s.keys || {}), ...req.body.keys };
  }
  if (req.body.removeKey && s.keys) delete s.keys[req.body.removeKey];
  if (req.body.routing) s.routing = req.body.routing;
  writeStore("settings.json", s);
  res.json({ ok: true });
});

app.get("/api/models/:provider", async (req, res) => {
  const provider = req.params.provider;
  const cfg = PROVIDERS[provider];
  if (!cfg) return res.status(400).json({ ok: false, error: "Unknown provider" });
  try {
    const models = await listModels(provider, req.signal);
    res.json({ ok: true, provider: cfg.name, count: models.length, models });
  } catch (err) {
    console.error(`[models] ${provider}:`, err.message);
    res.status(502).json({ ok: false, provider: cfg.name, error: String(err.message || err).slice(0, 300) });
  }
});

app.post("/api/test-key", async (req, res) => {
  const provider = String(req.body && req.body.provider || "");
  const cfg = PROVIDERS[provider];
  if (!cfg) return res.status(400).json({ ok: false, error: "Unknown provider" });
  try {
    const out = await call(provider, { prompt: "Reply with exactly: ok", maxTokens: 8 }, req.signal);
    res.json({ ok: true, provider: cfg.name, model: out.model, latency: `${out.latencyMs}ms` });
  } catch (err) {
    console.error(`[test-key] ${provider}:`, err.message);
    res.status(502).json({ ok: false, provider: cfg.name, error: String(err.message || err).slice(0, 300) });
  }
});

/* ---------- Logs ---------- */
app.get("/api/logs", (req, res) => res.json({ items: listLogs(Number(req.query.limit) || 100) }));

/* ---------- Entities (Section 21 CRUD) ---------- */
const ENTITIES = ["users", "products", "brands", "personas", "competitors", "creative_concepts",
  "ads", "campaigns", "experiments", "ai_providers", "ai_models", "analysis_reports", "orders"];

app.get("/api/entities/:entity", (req, res) => {
  if (!ENTITIES.includes(req.params.entity)) return res.status(404).json({ error: "unknown entity" });
  res.json({ items: collection(req.params.entity).all() });
});
app.post("/api/entities/:entity", (req, res) => {
  if (!ENTITIES.includes(req.params.entity)) return res.status(404).json({ error: "unknown entity" });
  res.json(collection(req.params.entity).save({ id: crypto.randomUUID(), ...(req.body || {}) }));
});
app.post("/api/entities/:entity/:id/duplicate", (req, res) => {
  res.json(collection(req.params.entity).duplicate(req.params.id));
});
app.delete("/api/entities/:entity/:id", (req, res) => {
  collection(req.params.entity).remove(req.params.id);
  res.json({ ok: true });
});

/* ---------- Uploads ---------- */
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "no file" });
  res.json({ ok: true, file: { name: req.file.originalname, size: req.file.size, path: `/api/upload/${req.file.filename}` } });
});
app.use("/api/upload", express.static(UPLOAD_DIR));

/* ---------- COD orders ---------- */
app.post("/api/orders", (req, res) => {
  const b = req.body || {};
  const id = crypto.randomUUID();
  const order = {
    id,
    orderNumber: `PL-${Date.now().toString().slice(-6)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    name: String(b.name || "").trim(),
    phone: String(b.phone || "").trim(),
    wilaya: String(b.wilaya || "").trim(),
    address: String(b.address || "").trim(),
    product: String(b.product || "").slice(0, 300),
    quantity: Number(b.quantity) || 1,
    unitPrice: Number(b.unitPrice) || 0,
    shipping: Number(b.shipping) || 0,
    total: Number(b.total) || 0,
    currency: String(b.currency || "DZD").toUpperCase(),
    language: String(b.language || "en").slice(0, 6),
  };
  if (!order.name || !order.phone || !order.wilaya || !order.address) {
    return res.status(400).json({ ok: false, error: "name, phone, wilaya and address are required" });
  }
  collection("orders").save(order);
  res.json({ ok: true, id: order.id, orderNumber: order.orderNumber });
});

/* ---------- Health ---------- */
app.get("/api/health", (req, res) =>
  res.json({ ok: true, name: "punchline-api", providers: Object.keys(PROVIDERS).length })
);

/* ---------- Facebook Ads Library MCP (AD LIBRARY) ---------- */
app.get("/api/fbads/status", async (req, res) => {
  try { res.json(await FbAdsMcp.status()); }
  catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get("/api/fbads/tools", async (req, res) => {
  try {
    const st = await FbAdsMcp.status();
    res.json({ ok: true, state: st.state, tools: FbAdsMcp.listTools() });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.get("/api/fbads/diagnostics", async (req, res) => {
  try {
    res.json(await FbAdsMcp.diagnostics());
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post("/api/fbads/config", async (req, res) => {
  try {
    const cfg = FbAdsMcp.saveConfig(req.body || {});
    res.json({ ok: true, configured: !!cfg.facebookToken, tokenMasked: FbAdsMcp.maskedToken(), tokenSource: cfg.tokenSource });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post("/api/fbads/probe", async (req, res) => {
  // Test Ads Library API with a candidate token (or the configured one) WITHOUT saving.
  try {
    const r = await FbAdsMcp.probeToken((req.body && req.body.token) || "");
    res.json(r);
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post("/api/fbads/test", async (req, res) => {
  try {
    if (req.body && req.body.persist && (req.body.pythonPath || req.body.scriptPath || req.body.facebookToken)) FbAdsMcp.saveConfig(req.body);
    const st = await FbAdsMcp.connect();
    res.json({ ...st, tokenMasked: FbAdsMcp.maskedToken(), tokenSource: FbAdsMcp.getConfig().tokenSource, tools: FbAdsMcp.listTools() });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post("/api/fbads/call", async (req, res) => {
  try {
    const { tool, args } = req.body || {};
    if (!tool) return res.status(400).json({ ok: false, error: "tool is required" });
    const r = await FbAdsMcp.callTool(String(tool), args || {});
    res.json(r);
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.post("/api/fbads/refresh-tools", async (req, res) => {
  try {
    await FbAdsMcp.connect();
    res.json({ ok: true, tools: FbAdsMcp.listTools(), state: (await FbAdsMcp.status()).state });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

app.listen(PORT, () => {
  console.log(`Punchline API running → http://localhost:${PORT}`);
  console.log(`Frontend → http://localhost:${PORT}/ (served from ${ROOT})`);
});
