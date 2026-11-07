/* PUNCHLINE — Model routing (Section 19).
   Maps each AI task to a role, then to a provider + model.
   Auto-retry: caller re-invokes with the next fallback route. */
import { readStore } from "./store.js";

const DEFAULT_ROUTES = {
  vision: { provider: "openrouter", model: "google/gemma-4-26b-a4b-it:free" },
  deep: { provider: "openrouter", model: "nvidia/nemotron-3-ultra-550b-a55b:free" },
  fast: { provider: "openrouter", model: "poolside/laguna-s-2.1:free" },
  cheap: { provider: "openrouter", model: "poolside/laguna-s-2.1:free" },
  copywriting: { provider: "openrouter", model: "nvidia/nemotron-3-ultra-550b-a55b:free" },
  reasoning: { provider: "openrouter", model: "nvidia/nemotron-3-ultra-550b-a55b:free" },
  default: { provider: "openrouter", model: "poolside/laguna-s-2.1:free" },
};

/* Task -> role. Image analysis uses vision; long documents use a long-context
   model via the `deep`/`cheap` route; competitor research is marked for a
   web-enabled model when the caller supplies `web: true`. */
const TASK_ROLES = {
  extract_product: "fast",
  analyze_images: "vision",
  brand: "deep",
  personas: "deep",
  usp: "reasoning",
  offer: "reasoning",
  competitors: "deep",
  strategy: "reasoning",
  fb_strategy: "reasoning",
  landing_pages: "copywriting",
  ad_ideas: "copywriting",
  creative_matrix: "copywriting",
  hook_generator: "copywriting",
  ugc_scripts: "copywriting",
  test_plan: "reasoning",
  campaigns: "reasoning",
  kpi: "fast",
  analyze_ad: "vision",
  analyze_landing: "vision",
  report: "reasoning",
  priority: "reasoning",
  final_decision: "reasoning",
  keyword_pull: "cheap",
  web_research: "reasoning",
  cod_advisor: "reasoning",
  cod_creative: "copywriting",
  erp_summary: "cheap",
  erp_advisor: "reasoning",
  erp_analyst: "cheap",
  erp_report: "reasoning",
  erp_suppliers: "cheap",
  chat: "fast",
  default: "default",
};

const FALLBACK_CHAIN = {
  vision: ["gemini", "openrouter", "nvidia", "openai"],
  deep: ["openrouter", "openrouter", "nvidia", "anthropic", "openai"],
  fast: ["groq", "openrouter", "openai", "nvidia"],
  cheap: ["deepseek", "openrouter", "groq", "openai", "nvidia"],
  copywriting: ["openrouter", "openrouter", "nvidia", "openai"],
  reasoning: ["openrouter", "openrouter", "nvidia", "anthropic", "openai"],
  default: ["openai", "openrouter", "nvidia", "anthropic"],
};

/* Model to use when a provider is reached as a FALLBACK (its own default may
   be paid — e.g. OpenRouter's "openrouter/auto" returns HTTP 402 when the
   account has no credits). Using a *:free model keeps the pipeline alive at $0. */
const FALLBACK_MODELS = {
  openrouter: "poolside/laguna-s-2.1:free",
};

function userRoutes() {
  const s = readStore("settings.json");
  return (s && s.routing) || {};
}

function routeFor(task, requestedRole) {
  const role = requestedRole || TASK_ROLES[task] || TASK_ROLES.default;
  const user = userRoutes()[role];
  const base = user || DEFAULT_ROUTES[role] || DEFAULT_ROUTES.default;
  return { role, provider: base.provider, model: base.model };
}

function fallbacksFor(role, providerId) {
  const chain = FALLBACK_CHAIN[role] || FALLBACK_CHAIN.default;
  const idx = chain.indexOf(providerId);
  return chain.slice(idx + 1);
}

export { routeFor, fallbacksFor, TASK_ROLES, DEFAULT_ROUTES, FALLBACK_MODELS };
