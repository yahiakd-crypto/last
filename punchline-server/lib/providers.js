/* ============================================================
   PUNCHLINE — Provider abstraction layer (Section 18)
   Supports: OpenRouter, NVIDIA NIM, OpenAI, Anthropic,
   Google Gemini, Mistral, Groq, DeepSeek.
   Keys come from the store / env — never from the client.
   ============================================================ */
import { readStore, writeStore } from "./store.js";

const PROVIDERS = {
  openrouter: {
    name: "OpenRouter",
    base: "https://openrouter.ai/api/v1",
    env: "PUNCHLINE_OPENROUTER_KEY",
    chatPath: "/chat/completions",
    auth: "Bearer",
    models: ["openrouter/auto"],
  },
  openai: {
    name: "OpenAI",
    base: "https://api.openai.com/v1",
    env: "PUNCHLINE_OPENAI_KEY",
    chatPath: "/chat/completions",
    auth: "Bearer",
    models: ["gpt-4o", "gpt-4.1", "o3-mini"],
  },
  anthropic: {
    name: "Anthropic",
    base: "https://api.anthropic.com/v1",
    env: "PUNCHLINE_ANTHROPIC_KEY",
    chatPath: "/messages",
    auth: "x-api-key",
    models: ["claude-opus-4-5", "claude-sonnet-4-5"],
    anthropicVersion: "2023-06-01",
  },
  gemini: {
    name: "Google Gemini",
    base: "https://generativelanguage.googleapis.com/v1beta",
    env: "PUNCHLINE_GEMINI_KEY",
    chatPath: "", // built dynamically: /models/{model}:generateContent?key=...
    auth: "query",
    models: ["gemini-2.5-pro", "gemini-2.5-flash"],
  },
  mistral: {
    name: "Mistral",
    base: "https://api.mistral.ai/v1",
    env: "PUNCHLINE_MISTRAL_KEY",
    chatPath: "/chat/completions",
    auth: "Bearer",
    models: ["mistral-large-latest", "mistral-small-latest"],
  },
  groq: {
    name: "Groq",
    base: "https://api.groq.com/openai/v1",
    env: "PUNCHLINE_GROQ_KEY",
    chatPath: "/chat/completions",
    auth: "Bearer",
    models: ["llama-3.3-70b-versatile"],
  },
  deepseek: {
    name: "DeepSeek",
    base: "https://api.deepseek.com",
    env: "PUNCHLINE_DEEPSEEK_KEY",
    chatPath: "/chat/completions",
    auth: "Bearer",
    models: ["deepseek-v4-flash", "deepseek-v4-pro"],
  },
  nvidia: {
    name: "NVIDIA NIM",
    base: process.env.PUNCHLINE_NIM_BASE || "https://integrate.api.nvidia.com/v1",
    env: "PUNCHLINE_NVIDIA_KEY",
    chatPath: "/chat/completions",
    auth: "Bearer",
    models: ["meta/llama-3.3-70b-instruct"],
    // may run self-hosted without a key
  },
};

function getKey(id) {
  const store = readStore("settings.json");
  const fromStore = store.keys && store.keys[id];
  if (fromStore) return fromStore;
  const envVar = PROVIDERS[id] && PROVIDERS[id].env;
  return (envVar && process.env[envVar]) || "";
}

function estimateCost(providerId, promptTokens, completionTokens) {
  const perMillion = {
    openrouter: 1.2, openai: 3, anthropic: 4, gemini: 2,
    mistral: 1, groq: 0.6, deepseek: 0.3, nvidia: 0,
  };
  const rate = perMillion[providerId] ?? 1;
  return ((promptTokens + completionTokens) / 1_000_000) * rate;
}

function maskKey(id) {
  const k = getKey(id);
  if (!k) return "";
  if (k.length <= 8) return "••••";
  return k.slice(0, 4) + "••••••••" + k.slice(-4);
}

async function call(providerId, opts, signal) {
  const cfg = PROVIDERS[providerId];
  if (!cfg) throw new Error("Unknown provider: " + providerId);
  const key = getKey(providerId);
  if (!key && providerId !== "nvidia") throw new Error(`No API key configured for ${cfg.name}`);

  const model = opts.model || cfg.models[0];
  const started = Date.now();

  let url, headers = {}, body;
  const messages = opts.messages
    ? opts.messages
    : opts.system
      ? [{ role: "system", content: opts.system }, { role: "user", content: opts.prompt }]
      : [{ role: "user", content: opts.prompt }];
  const system = (messages.find((m) => m.role === "system") || {}).content || opts.system || "";
  const turns = messages.filter((m) => m.role !== "system");
  const prompt = turns.length ? turns : [{ role: "user", content: opts.prompt }];

  if (providerId === "anthropic") {
    url = cfg.base + cfg.chatPath;
    headers = {
      "x-api-key": key,
      "anthropic-version": cfg.anthropicVersion,
      "content-type": "application/json",
    };
    body = JSON.stringify({ model, max_tokens: opts.maxTokens || 2048, system, messages: prompt.map((m) => ({ role: m.role, content: m.content })) });
  } else if (providerId === "gemini") {
    url = `${cfg.base}/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
    headers = { "content-type": "application/json" };
    body = JSON.stringify({
      system_instruction: system ? { parts: [{ text: system }] } : undefined,
      contents: prompt.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: opts.maxTokens || 2048 },
    });
  } else {
    url = cfg.base + cfg.chatPath;
    headers = { "content-type": "application/json", authorization: `Bearer ${key}` };
    body = JSON.stringify({
      model,
      messages: prompt,
      max_tokens: opts.maxTokens || 2048,
      temperature: opts.temperature ?? 0.7,
    });
  }

/* Free-tier OpenRouter models generate slowly (large outputs can take a minute+);
   the rest (esp. NVIDIA throttling) should abort fast. */
const TIMEOUT_MS = { openrouter: 180000 };

  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS[providerId] || 40000);
  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
    signal: signal ? AbortSignal.any([signal, ctrl.signal]) : ctrl.signal,
  }).finally(() => clearTimeout(to));
  const latency = Date.now() - started;
  const text = await res.text();

  if (!res.ok) {
    throw new Error(`${cfg.name} HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  const pick = (paths) => {
    for (const p of paths) {
      if (p) return p;
    }
    return "";
  };

  const content = pick([
    data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content,
    data.content && data.content[0] && data.content[0].text,
    data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.map((p) => p.text).join(""),
    data.raw,
  ]);
  const finishReason = data.choices && data.choices[0] && data.choices[0].finish_reason || data.candidates && data.candidates[0] && data.candidates[0].finishReason || "stop";

  const usage = data.usage || {};
  const promptTokens = usage.prompt_tokens || usage.input_tokens || 0;
  const completionTokens = usage.completion_tokens || usage.output_tokens || 0;

  return {
    provider: providerId,
    providerName: cfg.name,
    model,
    content,
    latencyMs: latency,
    promptTokens,
    completionTokens,
    finishReason,
    costEstimate: estimateCost(providerId, promptTokens, completionTokens),
  };
}

const PROVIDER_IDS = Object.keys(PROVIDERS);

// Fetch the live model list available inside a provider's API.
async function listModels(providerId, signal) {
  const cfg = PROVIDERS[providerId];
  if (!cfg) throw new Error("Unknown provider: " + providerId);
  const key = getKey(providerId);

  let url, headers = {}, parse;
  switch (providerId) {
    case "openrouter":
      url = cfg.base + "/models"; // public catalog — no key needed
      parse = (d) => (d.data || []).map((m) => m.id).sort();
      break;
    case "openai":
      url = cfg.base + "/models";
      headers = { authorization: `Bearer ${key}` };
      parse = (d) => (d.data || []).filter((m) => /(gpt|o[1-9]|omni|realtime)/i.test(m.id)).map((m) => m.id).sort();
      break;
    case "anthropic":
      url = cfg.base + "/models";
      headers = { "x-api-key": key, "anthropic-version": cfg.anthropicVersion };
      parse = (d) => (d.data || []).map((m) => m.id).sort();
      break;
    case "gemini":
      url = `${cfg.base}/models?key=${encodeURIComponent(key)}`;
      parse = (d) => (d.models || []).map((m) => m.name.replace(/^models\//, "")).sort();
      break;
    default: // mistral, groq, deepseek, nvidia
      url = cfg.base + "/models";
      headers = { authorization: `Bearer ${key}` };
      parse = (d) => (d.data || []).map((m) => m.id).sort();
  }

  const res = await fetch(url, { headers, signal });
  const text = await res.text();
  if (!res.ok) throw new Error(`${cfg.name} HTTP ${res.status}: ${text.slice(0, 200)}`);
  let data;
  try { data = JSON.parse(text); } catch { throw new Error("Bad JSON from " + cfg.name); }
  return parse(data);
}

export { PROVIDERS, call, getKey, maskKey, estimateCost, PROVIDER_IDS, listModels };
