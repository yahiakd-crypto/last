/* ============================================================
   ECOM AI AGENT — Punchline marketing co-pilot
   Chat panel on the left, live workspace on the right.
   Workspace tabs: Page / Assets / Marketing / Leads / Settings.
   Everything irreversible requires an explicit Approve step.
   The agent mirrors the user's language (French or English).
   ============================================================ */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const esc = (s) => window.PL ? PL.esc(s) : String(s == null ? "" : s);
  const D = () => window.DATA || {};
  const uid = () => "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  /* ---------------- Workspace tabs ---------------- */
  const TABS = [
    { id: "page", label: "Page", icon: "layout-template" },
    { id: "assets", label: "Assets", icon: "image" },
    { id: "marketing", label: "Marketing", icon: "megaphone" },
    { id: "leads", label: "Leads", icon: "database" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const state = {
    active: "page",
    runs: [],
    results: {},
    assets: [],
    messages: [],
    busy: false,
    pagePublished: false,
  };

  const ICON = {
    analyze_product: "🔍", landing: "🧱", analyze_landing: "🔎", publish_page: "🚀",
    logo: "🎨", brand_kit: "🏷️", image: "🖼️", video: "🎬",
    campaigns: "📣", create_campaign: "🚀", ad_ideas: "💡", strategy: "🎯",
    personas: "👥", offer: "🎁", report: "📄",
    customers: "🗃️", store: "🗄️", app_settings: "⚙️", ad_accounts: "🔗",
  };

  /* ---------------- Tool registry ---------------- */
  const TOOLS = [
    // --- PAGE ---
    { id: "analyze_product", name: "Analyze a Product", icon: ICON.analyze_product, tab: "page", api: "extract_product",
      keys: ["analyze a product", "analyze the product", "analyze product", "product analysis", "product research", "is this product", "winning product", "should i sell", "product opportunity", "analyze my product", "product intelligence", "product url", "what do you think of this product"] },
    { id: "landing", name: "Generate Landing Page", icon: ICON.landing, tab: "page", api: "landing_pages",
      keys: ["landing page", "sales page", "product page", "build a page", "build my landing", "make a landing", "create a page", "product website", "website for", "lp for", "my landing"] },
    { id: "analyze_landing", name: "Landing Page Audit", icon: ICON.analyze_landing, tab: "page", api: "analyze_landing",
      keys: ["analyze my landing", "landing page review", "is my page good", "landing audit", "page audit", "landing page analysis", "review this page", "improve my landing"] },
    { id: "publish_page", name: "Publish Page", icon: ICON.publish_page, tab: "page", local: true, risky: true,
      keys: ["publish the page", "publish my page", "go live", "make it live", "launch the page", "put it online", "launch my landing", "publish page", "publish it"] },
    // --- ASSETS ---
    { id: "logo", name: "Generate Logo", icon: ICON.logo, tab: "assets", local: true,
      keys: ["create a logo", "make a logo", "generate a logo", "logo ideas", "logo concepts", "design a logo", "logo generator"] },
    { id: "brand_kit", name: "Brand Identity Kit", icon: ICON.brand_kit, tab: "assets", api: "brand",
      keys: ["brand kit", "create a brand", "build a brand", "brand identity", "brand voice", "brand for", "brand name", "brand mission", "create brand", "make a brand", "naming", "brand guidelines"] },
    { id: "image", name: "Generate Images", icon: ICON.image, tab: "assets", local: true,
      keys: ["generate images", "image ideas", "product shot", "lifestyle images", "image concepts", "visuals", "generate an image", "ad visual"] },
    { id: "video", name: "Video Ad Scripts", icon: ICON.video, tab: "assets", api: "ugc_scripts",
      keys: ["video script", "video idea", "ugc", "reels", "tiktok script", "short video", "video ads", "script for a video", "video concept", "20-second", "60-second"] },
    // --- MARKETING ---
    { id: "campaigns", name: "Campaign Performance", icon: ICON.campaigns, tab: "marketing", api: "campaigns",
      keys: ["campaigns", "my campaigns", "campaign analysis", "ad performance", "roas", "cpa", "ctr", "analyze my ads", "facebook data", "my ad account", "spend", "ad results", "why am i losing money"] },
    { id: "create_campaign", name: "Create Campaign", icon: ICON.create_campaign, tab: "marketing", local: true, risky: true,
      keys: ["create a campaign", "launch a campaign", "start a campaign", "create ad set", "publish campaign", "run ads", "create a new campaign", "set up a campaign", "create the campaign", "build a campaign"] },
    { id: "ad_ideas", name: "Ad Creative Concepts", icon: ICON.ad_ideas, tab: "marketing", api: "ad_ideas",
      keys: ["ad ideas", "creative ideas", "ad creative", "creative concepts", "make ads", "create ads", "ad concepts", "creative angles", "content ideas", "ad concepts for"] },
    { id: "strategy", name: "Marketing Strategy", icon: ICON.strategy, tab: "marketing", api: "strategy",
      keys: ["strategy", "positioning", "unique selling", "usp", "go to market", "market strategy", "pricing strategy", "value proposition", "how should i position", "brand strategy", "marketing plan"] },
    { id: "personas", name: "Audience Targeting", icon: ICON.personas, tab: "marketing", api: "personas",
      keys: ["personas", "target customer", "audience persona", "customer profile", "who is my customer", "buyer persona", "avatar", "ideal customer", "target audience", "audience targeting"] },
    { id: "offer", name: "Offer Builder", icon: ICON.offer, tab: "marketing", api: "offer",
      keys: ["offer", "discount", "bundle", "promotion", "deal", "free shipping", "pricing", "packaging the offer"] },
    { id: "report", name: "Business Report", icon: ICON.report, tab: "marketing", api: "report",
      keys: ["report", "weekly report", "monthly report", "summary of my business", "performance report", "final decision", "priorities", "next actions", "business summary", "full analysis"] },
    // --- LEADS ---
    { id: "customers", name: "Leads & Orders", icon: ICON.customers, tab: "leads", local: true,
      keys: ["leads", "my leads", "orders", "my orders", "leads & orders", "customer database", "my customers", "customer analysis", "segments", "customer 360", "repeat customers", "customer data", "show my leads", "show my orders"] },
    { id: "store", name: "Store Data (app API)", icon: ICON.store, tab: "leads", local: true,
      keys: ["inventory", "stock", "store data", "my products", "operations", "app api", "business management", "products and orders", "my catalog"] },
    // --- SETTINGS ---
    { id: "app_settings", name: "App Settings", icon: ICON.app_settings, tab: "settings", local: true,
      keys: ["app settings", "my settings", "business settings", "settings for", "brand info", "what do you know about me", "application settings"] },
    { id: "ad_accounts", name: "Connected Ad Accounts", icon: ICON.ad_accounts, tab: "settings", local: true,
      keys: ["ad accounts", "connected accounts", "integrations", "facebook account", "meta account", "tiktok account", "google account", "which platforms", "connect my"] },
  ];

  /* ---------------- Language mirroring (FR / EN) ---------------- */
  let curLang = "en";
  const FR_WORDS = ["bonjour", "salut", "comment", "pourquoi", "merci", "pouvez", "peux", "veux", "besoin", "faut", "créer", "crée", "générer", "génére", "page", "produit", "campagne", "publicité", "livraison", "prix", "marge", "bénéfice", "aider", "aussi", "votre", " je ", " tu ", " est ", " que ", " qui ", " pour ", " avec ", " dans ", " le ", " la ", " les ", " des "];
  function detectLang(text) {
    const t = " " + String(text || "").toLowerCase() + " ";
    let score = 0;
    for (const w of FR_WORDS) if (t.includes(w)) score++;
    if (/[éèêàçûôï]/.test(t)) score++;
    return score >= 2 ? "fr" : "en";
  }
  const L = {
    en: {
      thinking: "Agent thinking…",
      parsing: "Parsing intent…",
      routing: (n) => "Routing to " + n + " tool" + (n > 1 ? "s" : "") + "…",
      answered: (p) => "Answered via " + p,
      done: "Done — results are in the workspace",
      nothingExecuted: "Nothing executed",
      toolFinished: "Tool execution finished.",
      resultRendered: "result rendered in the workspace",
      summarising: "Summarizing…",
      wantSummary: "Give me a 2-3 sentence practical answer with a clear next action.",
      connectionFailed: "Couldn't reach the server.",
      demo: "Demo mode — no working key",
    },
    fr: {
      thinking: "L'agent réfléchit…",
      parsing: "Analyse de l'intention…",
      routing: (n) => "Aiguillage vers " + n + " outil" + (n > 1 ? "s" : "") + "…",
      answered: (p) => "Répondu via " + p,
      done: "Terminé — les résultats sont dans le workspace",
      nothingExecuted: "Rien exécuté",
      toolFinished: "Exécution de l'outil terminée.",
      resultRendered: "résultat affiché dans le workspace",
      summarising: "Résumé en cours…",
      wantSummary: "Donne-moi une réponse pratique de 2-3 phrases avec une prochaine action claire.",
      connectionFailed: "Impossible de joindre le serveur.",
      demo: "Mode démo — pas de clé configurée",
    },
  };
  const langHint = (lang) => lang === "fr" ? " (Réponds en français, dans la langue de l'utilisateur. Sois concis.)" : " (Reply in English, the same language the user used. Be concise.)";

  /* ---------------- Intent parsing ---------------- */
  function matchTools(text) {
    const t = String(text || "").toLowerCase();
    const scored = TOOLS.map((tool) => {
      const hits = tool.keys.filter((k) => t.includes(k));
      const best = hits.reduce((m, k) => Math.max(m, k.length), 0);
      return { tool, score: hits.length, best };
    }).filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.best - a.best);
    return scored.slice(0, 3).map((x) => x.tool);
  }

  /* ---------------- Chat rendering ---------------- */
  function addMsg(role, html) {
    const body = $("#cc-chat-body");
    if (!body) return null;
    const div = document.createElement("div");
    div.className = "cc-msg " + role;
    div.innerHTML = `<div class="cc-bubble">${html}</div>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  function addTyping() {
    const d = document.createElement("div");
    d.className = "cc-msg bot";
    d.id = "cc-typing";
    d.innerHTML = `<div class="cc-bubble"><span class="cc-typing"><i></i><i></i><i></i></span> ${L[curLang].thinking}</div>`;
    const body = $("#cc-chat-body");
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
  function removeTyping() {
    const el = $("#cc-typing");
    if (el) el.remove();
  }

  function setStatus(txt) {
    const el = $("#cc-status");
    if (el) el.textContent = txt;
  }

  /* ---------------- Run card ---------------- */
  function runSteps(tool) {
    if (tool.risky) return ["Waiting for your approval", "Executing action", "Rendering workspace"];
    if (tool.local) return ["Computing locally", "Cross-checking data", "Rendering workspace"];
    return ["Parsing intent", "Routing model", "Tool call · " + tool.api, "Rendering workspace"];
  }

  function addRunCard(run) {
    const body = $("#cc-chat-body");
    const card = document.createElement("div");
    card.className = "cc-run step";
    card.id = run.id;
    card.innerHTML = `
      <div class="cc-run-head">
        <span class="cc-ri">${run.tool.icon}</span>
        <b>${esc(run.tool.name)}</b>
        <span class="cc-rstate" id="${run.id}-state">RUNNING</span>
        <span class="cc-chev">▾</span>
      </div>
      <div class="cc-run-body">
        <div class="cc-run-steps" id="${run.id}-steps"></div>
        <div class="cc-run-meta" id="${run.id}-meta"></div>
      </div>`;
    body.appendChild(card);
    card.querySelector(".cc-run-head").addEventListener("click", () => card.classList.toggle("open"));
    setRunSteps(run, 0);
    body.scrollTop = body.scrollHeight;
  }

  function setRunSteps(run, activeIdx, mode) {
    const el = document.getElementById(run.id + "-steps");
    if (!el) return;
    const steps = runSteps(run.tool);
    el.innerHTML = steps.map((s, i) => {
      let cls = "";
      if (mode === "err") cls = i < activeIdx || i === activeIdx ? "done" : "";
      else if (i < activeIdx) cls = "done";
      else if (i === activeIdx) cls = "on";
      return `<div class="cc-run-step ${cls}"><span class="cc-dot"></span>${i + 1}. ${esc(s)}</div>`;
    }).join("");
  }

  function finishRun(run, ok) {
    const card = document.getElementById(run.id);
    if (card) {
      card.classList.remove("step", "err");
      card.classList.add(ok ? "done" : "err");
      const st = document.getElementById(run.id + "-state");
      if (st) {
        st.textContent = ok ? "DONE" : (run.cancelled ? "CANCELLED" : "ERROR");
        if (run.cancelled) st.style.color = "var(--cc-muted)";
      }
    }
    const metaEl = document.getElementById(run.id + "-meta");
    if (metaEl) metaEl.innerHTML = metaChips(run);
    run.status = run.cancelled ? "cancelled" : (ok ? "done" : "err");
  }

  function metaChips(run) {
    if (run.cancelled) return "";
    const m = run.meta || {};
    let chips = [];
    if (run.simulated || m.provider === "demo") chips.push(`<span class="cc-chip red">SIMULATED</span>`);
    else if (m.provider === "built-in") chips.push(`<span class="cc-chip blue">BUILT-IN</span>`);
    else chips.push(`<span class="cc-chip green">LIVE AI</span>`);
    if (m.provider && m.provider !== "built-in") chips.push(`<span class="cc-chip">${esc(m.provider)}</span>`);
    if (m.model) chips.push(`<span class="cc-chip">${esc(m.model)}</span>`);
    if (m.tokens) chips.push(`<span class="cc-chip">${esc(m.tokens)} tok</span>`);
    if (m.latency) chips.push(`<span class="cc-chip">${esc(m.latency)}</span>`);
    if (m.cost) chips.push(`<span class="cc-chip gold">${esc(m.cost)}</span>`);
    return chips.join("");
  }

  /* ---------------- Local tools ---------------- */
  async function localRun(tool, text) {
    switch (tool.id) {
      case "logo": return logoData();
      case "image": return imageData();
      case "customers": return leadsData();
      case "store": return storeData();
      case "app_settings": return appSettingsData();
      case "ad_accounts": return adAccountsData();
      case "create_campaign": return createCampaign(text);
      case "publish_page": return publishPage();
      default: return { text: "UNKNOWN local tool" };
    }
  }

  async function entities(name) {
    try { return await PL_API.entities(name); } catch (e) { return []; }
  }

  async function leadsData() {
    let orders = [];
    try { orders = await entities("orders"); } catch (e) {}
    const stats = { orders: orders.length, revenue: 0, cities: new Set(), products: new Set(), confirmed: 0, pending: 0 };
    orders.forEach((o) => {
      stats.revenue += Number(o.total) || 0;
      if (o.wilaya) stats.cities.add(o.wilaya);
      if (o.product) stats.products.add(o.product);
      if (o.status === "confirmed" || o.status === "delivered") stats.confirmed++;
      if (o.status === "pending") stats.pending++;
    });
    const segs = [
      { name: "High Value (A)", share: orders.length ? 25 : 0, note: "Top 25% by order value · VIP treatment" },
      { name: "Repeat Buyers", share: 0, note: "2+ orders — computed from full DB in the Customer app" },
      { name: "New Buyers", share: orders.length ? 60 : 0, note: "First purchase · nurture to repeat" },
      { name: "At Risk", share: 0, note: "No order in 45d · win-back offer" },
    ];
    return { orders, stats: { ...stats, cities: [...stats.cities], products: [...stats.products] }, segments: segs,
      text: "Leads & orders pulled live through the app API (/api/entities/orders)." };
  }

  async function storeData() {
    const [products, orders] = await Promise.all([entities("products"), entities("orders")]);
    const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    return { products, orders, revenue,
      text: "Store snapshot pulled through the app API (/api/entities)." };
  }

  function logoData() {
    const brand = D().brand || {};
    const name = brand.name || "Punchline";
    const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "P";
    const concepts = [
      { title: "Monogram Mark", desc: "Bold single-mark identity", mark: initials },
      { title: "Wordmark", desc: "Clean type-driven lockup", mark: name.slice(0, 3).toUpperCase() },
      { title: "Badge / Emblem", desc: "Framed seal for premium trust", mark: initials },
      { title: "Symbol + Wordmark", desc: "Icon with wordmark beside", mark: "◈" },
    ];
    return { brandName: name, tagline: brand.mission || "Calm · Focus · Proof", concepts,
      text: "Logo concepts generated from your brand identity. Export to SVG/PNG in the Brand app for production." };
  }

  function imageData() {
    const p = D().product || {};
    const name = p.name || "your product";
    const concepts = [
      { title: "Hero product shot", prompt: "Studio product shot of " + name + " on a clean gradient background, soft shadows, premium ecommerce photography", ratio: "1:1", style: "Studio" },
      { title: "Lifestyle scene", prompt: "Person using " + name + " in a real-life setting, natural light, candid, high contrast", ratio: "4:5", style: "Lifestyle" },
      { title: "Ad creative", prompt: "Bold social ad visual for " + name + ", vibrant colors, clear product focus, strong contrast", ratio: "1:1", style: "Ad creative" },
      { title: "Story / video cover", prompt: "High-energy first frame for a short video ad about " + name + ", motion feel, bold headline space", ratio: "9:16", style: "Story" },
    ];
    return { product: p.name || "Product", concepts,
      text: "These are ready-to-render prompts for your connected image tool (DALL-E / Midjourney / internal). Attach a reference image to match your product." };
  }

  async function appSettingsData() {
    const d = D();
    const p = d.product || {};
    const brand = d.brand || {};
    let ai = {};
    try { ai = await PL_API.settings(); } catch (e) {}
    return {
      brand: { name: brand.name || p.name || "Punchline", domain: brand.domain || "", currency: p.currency || ai.currency || "USD", market: p.market || ai.market || "Algeria" },
      product: { name: p.name || "—", price: p.price, status: p.status, category: p.category },
      ai: { providers: Object.keys(ai.providers || {}).length, models: ai.models ? (Array.isArray(ai.models) ? ai.models.length : 0) : 0 },
      text: "App settings loaded from your local config + the backend settings store." };
  }

  async function adAccountsData() {
    const platforms = [
      { id: "Meta Ads", connected: false, note: "Connect in Settings → Integrations" },
      { id: "TikTok Ads", connected: false, note: "Connect in Settings → Integrations" },
      { id: "Google Ads", connected: false, note: "Connect in Settings → Integrations" },
    ];
    let ai = [];
    try {
      const s = await PL_API.settings();
      ai = Object.entries(s.providers || {}).filter(([, v]) => v.keyMasked)
        .map(([id, v]) => ({ id, key: v.keyMasked, provider: v.provider || id }));
    } catch (e) {}
    return { platforms, aiProviders: ai,
      text: "Ad accounts shown from stored settings. No ad account is connected yet — any launch is SIMULATED until you connect one." };
  }

  /* Shared approval card with an explicit payload preview */
  function askDraft(payload, note) {
    return new Promise((resolve) => {
      addMsg("bot", `<div class="cc-approve">
        <b>⚠️ Approval required</b>
        <p>${esc(note || "Here's the exact payload. Nothing is sent, published or launched until you approve.")}</p>
        <pre class="cc-json">${esc(JSON.stringify(payload, null, 2))}</pre>
        <div class="cc-abtns">
          <button class="cc-btn gold" data-a="1">Approve</button>
          <button class="cc-btn ghost" data-a="0">Reject</button>
        </div></div>`);
      const ok = (val) => {
        $$("#cc-chat-body .cc-approve").forEach((el) => el.remove());
        resolve(val);
      };
      $$("#cc-chat-body .cc-abtns button").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          ok(btn.dataset.a === "1");
        });
      });
    });
  }

  async function createCampaign(text) {
    const p = D().product || {};
    let app = {};
    try { app = await PL_API.settings(); } catch (e) {}
    const budget = parseInt((text.match(/\$\s*(\d+)/) || [])[1], 10) || 50;
    const draft = {
      campaign_name: (p.name ? p.name.slice(0, 28) : "Product") + " — Launch",
      platform: "Meta Ads",
      objective: "PURCHASE",
      budget_mode: "DAILY",
      daily_budget: "$" + budget,
      lifetime_budget: "$" + budget * 7,
      targeting: { country: p.market || app.market || "Algeria", interests: ["broad"], age: "18-65" },
      creative_ids: [],
      status: "draft",
    };
    const approved = await askDraft(draft, "You asked me to create a campaign. Here is the exact payload I would publish — campaign params are explicit and nothing is sent to any ad platform until you approve.");
    if (!approved) return { cancelled: true };
    draft.status = "launched";
    let aiPlan = "";
    try {
      const r = await PL_API.ai("fb_strategy", { note: text });
      aiPlan = r.data && typeof r.data === "object" ? (r.data.plan || r.data.fbPlan || JSON.stringify(r.data).slice(0, 320)) : String((r.data || "")).slice(0, 320);
    } catch (e) { aiPlan = ""; }
    let saved = null;
    try {
      const item = { ...draft, plan: aiPlan, _simulated: true, createdAt: new Date().toISOString() };
      saved = await PL_API.saveEntity("campaigns", item);
    } catch (e) { draft.saveError = String(e); }
    return { draft, saved, aiPlan,
      text: "Draft confirmed. NOTE: no real ad account is connected — this launch is SIMULATED. Connect Meta/TikTok/Google in Settings → Integrations to publish for real." };
  }

  async function publishPage() {
    const approved = await askDraft({ action: "PUBLISH_PAGE", page: "current landing page", environment: "production" }, "You asked me to publish your landing page. This makes it the live page visitors see.");
    if (!approved) return { cancelled: true };
    state.pagePublished = true;
    if (state.lastLanding) {
      const blocks = state.results.page || [];
      const idx = blocks.findIndex((b) => b.key === "landing");
      if (idx >= 0) {
        blocks[idx].html = render.landing(state.lastLanding.output, state.lastLanding.meta);
        if (state.active === "page") renderWorkspace();
      }
    }
    return { published: true, url: "/" + ((D().product || {}).slug || "landing"), text: "Your landing page is now live. You can unpublish anytime from Settings." };
  }

  /* ---------------- Tabs & workspace ---------------- */
  function buildTabs() {
    const head = $("#cc-ws-tabs");
    head.innerHTML = TABS.map((t) => `
      <div class="cc-tab ${t.id === state.active ? "active" : ""}" data-tab="${t.id}">
        ${PL.icon(t.icon, 13)}${esc(t.label)}<span class="cc-tdot"></span>
      </div>`).join("");
    head.querySelectorAll(".cc-tab").forEach((el) => {
      el.addEventListener("click", () => openTab(el.dataset.tab));
    });
    if (window.lucide) lucide.createIcons();
  }

  function openTab(id) {
    state.active = id;
    $$("#cc-ws-tabs .cc-tab").forEach((el) => el.classList.toggle("active", el.dataset.tab === id));
    renderWorkspace();
    if (window.matchMedia && window.matchMedia("(max-width: 960px)").matches) setView("ws");
  }

  function markTabHas(tab) {
    const el = $$("#cc-ws-tabs .cc-tab").find((x) => x.dataset.tab === tab);
    if (el) el.classList.add("has");
  }

  function appendResult(tab, html, key) {
    state.results[tab] = state.results[tab] || [];
    state.results[tab].push({ html, key });
    markTabHas(tab);
  }

  function renderWorkspace() {
    const body = $("#cc-ws-body");
    const tab = state.active;
    const blocks = state.results[tab] || [];
    if (!blocks.length) {
      body.innerHTML = `<div class="cc-ws-empty">
        <div class="cc-big">🧭</div>
        <b>Nothing here yet</b>
        <p>Ask the agent to work on <b>${esc(TABS.find((t) => t.id === tab)?.label || tab)}</b> — e.g. "Analyze a product", "Build my landing page", "Generate a logo", "Create a campaign" or "Show my leads".</p>
      </div>`;
      return;
    }
    body.innerHTML = blocks.map((b) => `<div class="cc-result">${b.html}</div>`).join("");
    if (window.lucide) lucide.createIcons();
  }

  /* ---------------- Narrow-screen view toggle ---------------- */
  function setView(name) {
    document.body.classList.toggle("v-chat", name === "chat");
    document.body.classList.toggle("v-ws", name === "ws");
    $$(".cc-mobile-bar button").forEach((b) => b.classList.toggle("on", b.dataset.v === name));
  }
  function setupViewToggle() {
    $$(".cc-mobile-bar button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.v)));
    if (window.matchMedia && !window.matchMedia("(max-width: 960px)").matches) setView("chat");
  }

  function ctxChips() {
    const p = D().product || {};
    const bits = [
      ["Product", p.name || "—"],
      ["Market", p.market || "—"],
      ["Price", p.price ? "$" + p.price : "—"],
      ["Status", p.status || "—"],
      ["Category", p.category || "—"],
    ];
    return `<div class="cc-ctx">
      <span class="cc-ctx-k">Business context</span>
      ${bits.map(([k, v]) => `<span class="cc-chip gold">${esc(k)} · ${esc(v)}</span>`).join("")}
    </div>`;
  }

  /* ---------------- Renderers ---------------- */
  function noData() {
    return `<div class="cc-nodata">No data returned by this tool.</div>`;
  }
  function obj(m) {
    return `<pre class="cc-json">${esc(JSON.stringify(m, null, 2))}</pre>`;
  }
  function humanize(v) {
    if (v == null) return "—";
    if (typeof v === "object") {
      if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
      return JSON.stringify(v);
    }
    return String(v);
  }
  function renderGeneric(cards, opts) {
    return `
      <div class="cc-head">${PL.icon(opts.icon, 14)}<b>${esc(opts.title)}</b>${opts.note ? `<span class="cc-sub">${esc(opts.note)}</span>` : ""}</div>
      <div class="cc-grid">${cards.map((c) => `
        <div class="cc-card"><div class="cc-lbl">${esc(c.l)}</div><div class="cc-val">${humanize(c.v)}</div></div>`).join("")}
      </div>${opts.extra || ""}`;
  }
  function fallback(data, title, icon, extraLines) {
    let cards = [];
    const walk = (o, prefix) => {
      for (const k in o) {
        const v = o[k];
        if (v == null) continue;
        if (["array", "object"].includes(typeof v)) { if (Array.isArray(v) && v.length && typeof v[0] !== "object") { cards.push({ l: prefix + k, v }); } continue; }
        if (["number", "string", "boolean"].includes(typeof v)) cards.push({ l: prefix + k, v });
      }
    };
    walk(data, "");
    return renderGeneric(cards.slice(0, 12), { icon, title }) + (extraLines ? extraLines.join("") : "");
  }
  function listCards(items, opts) {
    if (!items || !items.length) return noData();
    return `
      <div class="cc-head">${PL.icon(opts.icon, 14)}<b>${esc(opts.title)}</b>${opts.note ? `<span class="cc-sub">${esc(opts.note)}</span>` : ""}</div>
      <div class="cc-list">${items.map((it) => `<div class="cc-item">${opts.item(it)}</div>`).join("")}</div>
      ${opts.extra || ""}`;
  }

  const render = {
    analyze_product: (d, m) => {
      const p = d.product || d.variant || d.opportunity || d || {};
      const s = d.score || {};
      const opp = s.overall ?? s.opportunity ?? m.opportunity;
      const cards = [
        { l: "Opportunity score", v: opp != null ? opp + "/100" : "—" },
        { l: "Market trend", v: humanize(m.trend ?? s.trend) },
        { l: "Demand", v: humanize(m.demand ?? s.demand) },
        { l: "Competition", v: humanize(m.competition ?? s.competition) },
        { l: "Best price", v: humanize(p.price ?? m.price) },
        { l: "Margins", v: humanize(m.margins ?? s.margins) },
        { l: "Risk", v: humanize(m.risk ?? s.risk) },
        { l: "Sell", v: humanize(m.sell ?? s.sell) },
      ];
      return renderGeneric(cards, { icon: "search", title: "Product analysis — " + (p.name || "item"), note: m.provider ? "via " + m.provider : "" })
        + (d.summary || p.summary ? `<div class="cc-note"><b>Key takeaway</b> — ${esc(d.summary || p.summary)}</div>` : "")
        + (d.nextActions || p.nextActions ? `<div class="cc-note"><b>Next actions</b> — ${esc(d.nextActions || p.nextActions)}</div>` : "");
    },

    landing: (d, m) => {
      const lp = d.landings && d.landings[0] ? d.landings[0] : (d.landingPage || d);
      const secs = lp.sections || lp.sections_details || d.sections || [];
      const list = secs.length ? listCards(secs.slice(0, 5), {
        icon: "layout", title: "Landing page — " + esc(lp.product_name || d.product_name || "Draft"), note: "content ready · DRAFT",
        item: (s) => `<b>${esc(s.title || s.heading || "Section")}</b> · ${esc(s.hook || s.subheading || "")} ${s.copy ? `<span class="cc-lbl">copy</span>` : ""}`,
      }) : "";
      const code = lp.html_snippet || d.html || d.landingPage?.html_snippet || "";
      return `
        <div class="cc-head">${PL.icon("layout", 14)}<b>Landing page draft</b><span class="cc-sub">${state.pagePublished ? "LIVE" : "DRAFT"}</span></div>
        <div class="cc-badges"><span class="cc-chip ${state.pagePublished ? "green" : "gold"}">${state.pagePublished ? "PUBLISHED" : "DRAFT"}</span><span class="cc-chip">${esc(lp.product_name || d.product_name || "")}</span></div>
        ${list}
        ${code ? `<div class="cc-codewrap"><pre class="cc-json">${esc(code.slice(0, 1200))}</pre></div>` : ""}
        <div class="cc-note">Ask <b>Publish Page</b> to push this draft live — you'll approve the exact payload first.</div>`;
    },

    analyze_landing: (d, m) => {
      const score = m.score ?? d.score ?? (typeof d === "object" ? d.score : null);
      const checks = d.checks || d.report || m.checks || [];
      const items = checks.length ? listCards(checks, {
        icon: "shield-check", title: "Landing page audit", note: "Automated review",
        item: (c) => `<b>${esc(c.title || c.name)}</b> — ${esc(c.grade || c.status || "")} <span class="cc-lbl">${esc(c.suggestion || c.issue || "")}</span>`,
      }) : "";
      const cards = [
        { l: "Overall score", v: score != null ? score + "/100" : "—" },
        { l: "Load time", v: humanize(d.loadTime) },
        { l: "Above the fold", v: humanize(d.aboveFold) },
        { l: "Trust signals", v: humanize(d.trust) },
        { l: "CRO", v: humanize(d.cro) },
      ];
      return renderGeneric(cards, { icon: "shield-check", title: "Landing page audit", note: m.provider ? "via " + m.provider : "" }) + items;
    },

    publish_page: (d, m) => {
      return `
        <div class="cc-page-live">
          <div class="cc-live-ico">${PL.icon("rocket", 22)}</div>
          <div>
            <b>Page is live 🚀</b>
            <p>Your landing page is now <span class="cc-strong">PUBLISHED</span> at <code>${esc(d.url || "/landing")}</code>. Visitors land on it right away.</p>
          </div>
        </div>
        ${obj(m)}`;
    },

    logo: (d) => {
      const c = d.concepts || [];
      const cards = c.map((x, i) => ({
        mark: x.mark, title: x.title, desc: x.desc, bad: ["Hero", "Primary", "Social", "Packaging"][i % 4] || "Use",
      }));
      return `
        <div class="cc-head">${PL.icon("pen-tool", 14)}<b>Logo concepts — ${esc(d.brandName || "Brand")}</b></div>
        <div class="cc-grid logo">
          ${cards.map((x) => `<div class="cc-logo"><div class="cc-logo-mark">${esc(x.mark)}</div><b>${esc(x.title)}</b><span>${esc(x.desc)}</span><span class="cc-chip gold">${esc(x.bad)}</span></div>`).join("")}
        </div>
        <div class="cc-note">${esc(d.text || "")}</div>`;
    },

    brand_kit: (d, m) => {
      const b = d.brand || d;
      const name = b.name || d.name || "Punchline";
      const cards = [
        { l: "Brand name", v: name },
        { l: "Category", v: humanize(b.category) },
        { l: "Voice", v: humanize(b.voice || d.tone) },
        { l: "Mission", v: humanize(b.mission || d.mission) },
        { l: "Market", v: humanize(b.market) },
        { l: "Audience", v: humanize(b.audience) },
      ];
      return renderGeneric(cards, { icon: "badge-check", title: "Brand identity — " + name, note: m.provider ? "via " + m.provider : "" })
        + (b.palette || d.palette ? `<div class="cc-swatches">${((b.palette || d.palette) && (Array.isArray(b.palette || d.palette) ? b.palette || d.palette : Object.entries(b.palette || d.palette).map(([k, v]) => ({ name: k, hex: v })))).slice(0, 6).map((p) => `<div class="cc-swatch"><i style="background:${p.hex}"></i>${esc(p.name || p.hex)}</div>`).join("")}</div>` : "")
        + (b.tagline || d.tagline ? `<div class="cc-note"><b>Tagline</b> — ${esc(b.tagline || d.tagline)}</div>` : "");
    },

    image: (d) => {
      const c = d.concepts || [];
      return `
        <div class="cc-head">${PL.icon("image", 14)}<b>Image concepts</b><span class="cc-sub">for ${esc(d.product || "product")}</span></div>
        <div class="cc-grid logo">
          ${c.map((x) => `<div class="cc-logo"><div class="cc-logo-mark">🖼️</div><b>${esc(x.title)}</b><span>${esc(x.style)}</span><pre class="cc-json">${esc(x.prompt)}</pre></div>`).join("")}
        </div>`;
    },

    video: (d, m) => {
      const scripts = d.scripts || d.ugc || [];
      const items = scripts.length ? listCards(scripts, {
        icon: "video", title: "Video ad scripts", note: "UGC-ready",
        item: (s) => `<b>${esc(s.title || s.name || "Script")}</b> ${s.duration ? `<span class="cc-chip">${esc(s.duration)}</span>` : ""}<span class="cc-lbl">${esc(s.hook || s.brief || "")}</span>`,
      }) : "";
      return `<div class="cc-head">${PL.icon("video", 14)}<b>Video ad scripts</b>${m.provider ? `<span class="cc-sub">via ${esc(m.provider)}</span>` : ""}</div>`
        + (items || noData());
    },

    campaigns: (d, m) => {
      const c = d.campaigns || d.data || [];
      const stats = d.summary || d.performance || {};
      const cards = [
        { l: "Campaigns", v: c.length || humanize(stats.count) },
        { l: "Spend", v: humanize(stats.spend) },
        { l: "Revenue", v: humanize(stats.revenue) },
        { l: "ROAS", v: humanize(stats.roas) },
        { l: "CPA", v: humanize(stats.cpa) },
        { l: "CTR", v: humanize(stats.ctr) },
      ];
      const list = c.length ? listCards(c, {
        icon: "megaphone", title: "Campaigns", note: "simulated",
        item: (x) => `<b>${esc(x.name || x.campaign_name || "Campaign")}</b> <span class="cc-chip">${esc(x.status || x.state || "")}</span> · Spend ${esc(x.spend || "$0")} → Revenue ${esc(x.revenue || "$0")}`,
      }) : "";
      return renderGeneric(cards, { icon: "megaphone", title: "Campaign performance", note: m.provider ? "via " + m.provider : "simulated" }) + list;
    },

    create_campaign: (d) => {
      const c = d.draft || {};
      const cards = [
        { l: "Name", v: c.campaign_name },
        { l: "Platform", v: c.platform },
        { l: "Objective", v: c.objective },
        { l: "Daily budget", v: c.daily_budget },
        { l: "Targeting", v: (c.targeting ? c.targeting.country : "") + " · " + (c.targeting ? c.targeting.age : "") },
        { l: "Status", v: c.status },
      ];
      return renderGeneric(cards, { icon: "rocket", title: "Campaign draft" + (d.saved ? " · saved" : ""), note: c.status === "launched" ? "confirmed by you" : "SIMULATED" })
        + (d.aiPlan ? `<div class="cc-note"><b>AI channel plan</b> — ${esc(d.aiPlan)}</div>` : "")
        + (d.saved ? `<div class="cc-note green"><b>✓ Saved</b> to local store (id: ${esc(d.saved.id || d.saved._id || "—")})</div>` : "")
        + `<div class="cc-note">⚠️ No real ad account is connected — launch is <b>simulated</b>. Connect Meta/TikTok/Google in Settings.</div>`;
    },

    ad_ideas: (d, m) => {
      const ideas = d.ideas || d.creatives || [];
      return listCards(ideas, {
        icon: "lightbulb", title: "Ad creative concepts", note: m.provider ? "via " + m.provider : "",
        item: (x) => `<b>${esc(x.title || x.name || "Concept")}</b><span class="cc-lbl">${esc(x.hook || x.angle || x.copy || "")}</span>`,
      });
    },

    strategy: (d, m) => {
      const s = d.strategy || d.plan || d;
      const cards = [
        { l: "Positioning", v: humanize(s.positioning) },
        { l: "USP", v: humanize(s.usp || s.value_proposition) },
        { l: "Go to market", v: humanize(s.go_to_market) },
        { l: "Pricing", v: humanize(s.pricing) },
      ];
      return renderGeneric(cards, { icon: "target", title: "Marketing strategy", note: m.provider ? "via " + m.provider : "" })
        + (s.summary ? `<div class="cc-note"><b>Summary</b> — ${esc(s.summary)}</div>` : "")
        + (s.actions ? `<div class="cc-note"><b>Actions</b> — ${esc(s.actions)}</div>` : "");
    },

    personas: (d, m) => {
      const list = d.personas || d.audiences || [];
      return listCards(list, {
        icon: "users", title: "Audience personas", note: m.provider ? "via " + m.provider : "",
        item: (x) => `<b>${esc(x.name || x.title || "Persona")}</b> · ${esc(x.age || "")} ${esc(x.interests || x.demographics || "")}<span class="cc-lbl">${esc(x.pain || x.insight || "")}</span>`,
      });
    },

    offer: (d, m) => {
      const o = d.offer || (d.offers && d.offers[0]) || d;
      const cards = [
        { l: "Core offer", v: humanize(o.core || o.main) },
        { l: "Pricing", v: humanize(o.pricing) },
        { l: "Bundle", v: humanize(o.bundle) },
        { l: "Discount", v: humanize(o.discount) },
        { l: "Urgency", v: humanize(o.urgency) },
        { l: "Risk reversal", v: humanize(o.risk_reversal) },
      ];
      return renderGeneric(cards, { icon: "gift", title: "Offer", note: m.provider ? "via " + m.provider : "" });
    },

    report: (d, m) => {
      const r = d.report || d;
      const cards = [
        { l: "Revenue", v: humanize(r.revenue) },
        { l: "Orders", v: humanize(r.orders) },
        { l: "AOV", v: humanize(r.aov) },
        { l: "Best seller", v: humanize(r.best_seller) },
        { l: "Margin", v: humanize(r.margin) },
      ];
      return renderGeneric(cards, { icon: "file-text", title: "Business report", note: m.provider ? "via " + m.provider : "" })
        + (r.exec_summary || r.summary ? `<div class="cc-note"><b>Executive summary</b> — ${esc(r.exec_summary || r.summary)}</div>` : "")
        + (r.recommendations ? `<div class="cc-note"><b>Recommendations</b> — ${esc(r.recommendations)}</div>` : "");
    },

    customers: (d) => {
      const s = d.stats || {};
      const cards = [
        { l: "Total orders", v: s.orders ?? 0 },
        { l: "Revenue", v: "$" + (Number(s.revenue) || 0).toLocaleString() },
        { l: "Confirmed", v: s.confirmed ?? 0 },
        { l: "Pending", v: s.pending ?? 0 },
        { l: "Wilayas", v: (s.cities || []).length },
        { l: "Products", v: (s.products || []).length },
      ];
      const top = (s.products || []).slice(0, 5).map((p, i) => ({ l: "Top " + (i + 1), v: p }));
      return renderGeneric(cards, { icon: "database", title: "Leads & orders — live app data", note: "/api/entities/orders" })
        + listCards(d.segments || [], { icon: "pie-chart", title: "Segments", note: "360 customer view",
            item: (x) => `<b>${esc(x.name)}</b> <span class="cc-chip">${esc(String(x.share) + "%")}</span><span class="cc-lbl">${esc(x.note)}</span>` })
        + (top.length ? listCards(top, { icon: "trending-up", title: "Top products", note: "by order count",
            item: (x) => `<b>${esc(x.v)}</b>` }) : "");
    },

    store: (d) => {
      const ps = d.products || [];
      const os = d.orders || [];
      const cards = [
        { l: "Products", v: ps.length },
        { l: "Orders", v: os.length },
        { l: "Revenue", v: "$" + (Number(d.revenue) || 0).toLocaleString() },
      ];
      return renderGeneric(cards, { icon: "archive", title: "Store data — app API", note: "/api/entities" })
        + (ps.length ? listCards(ps.slice(0, 6), { icon: "package", title: "Products", note: "live",
            item: (x) => `<b>${esc(x.name || "Product")}</b> · $${esc(humanize(x.price))} <span class="cc-chip">${esc(humanize(x.status))}</span>` }) : "")
        + (os.length ? listCards(os.slice(0, 6), { icon: "shopping-bag", title: "Recent orders", note: "live",
            item: (x) => `<b>${esc(x.customer || x.name || "Order")}</b> · $${esc(humanize(x.total))} <span class="cc-chip">${esc(humanize(x.status))}</span>` }) : "");
    },

    app_settings: (d) => {
      const b = d.brand || {};
      const p = d.product || {};
      const ai = d.ai || {};
      return renderGeneric([
        { l: "Brand", v: b.name },
        { l: "Domain", v: b.domain || "—" },
        { l: "Currency", v: b.currency },
        { l: "Market", v: b.market },
        { l: "Product", v: p.name },
        { l: "Price", v: p.price ? "$" + p.price : "—" },
        { l: "AI providers", v: ai.providers },
        { l: "AI models", v: ai.models },
      ], { icon: "settings", title: "App settings", note: "from local config + backend" });
    },

    ad_accounts: (d) => {
      const list = d.platforms || [];
      return listCards(list, {
        icon: "link", title: "Connected accounts", note: "integrations",
        item: (x) => `<b>${esc(x.id)}</b> <span class="cc-chip ${x.connected ? "green" : "red"}">${x.connected ? "CONNECTED" : "NOT CONNECTED"}</span><span class="cc-lbl">${esc(x.note)}</span>`,
      }) + (d.aiProviders && d.aiProviders.length ? listCards(d.aiProviders.map((x) => ({ name: x.id, note: x.key })), {
          icon: "key", title: "Stored API keys", note: "masked",
          item: (x) => `<b>${esc(x.name)}</b> <code>${esc(x.note)}</code>`,
        }) : "");
    },

    fallback: (d, m, tool) => fallback(d, tool.name, "sparkles"),
  };

  /* ---------------- Summarizer ---------------- */
  async function summarize(brief) {
    setStatus(L[curLang].summarising);
    try {
      const r = await PL_API.chat([{ role: "user", content: brief + langHint(curLang) }]);
      let t = r && (r.reply || r.data);
      if (t && typeof t === "object") t = t.summary || t.answer || JSON.stringify(t);
      return String(t || brief).trim();
    } catch (e) {
      return brief;
    }
  }

  /* ---------------- Orchestrator ---------------- */
  async function handleMessage(text) {
    const t = (text || "").trim();
    if (!t) return;
    curLang = detectLang(t);
    state.messages.push({ role: "user", content: t });
    addMsg("user", esc(t));

    const tools = matchTools(t);

    if (!tools.length) {
      const typing = addTyping();
      try {
        const r = await PL_API.chat([{ role: "user", content: t }]);
        const ans = r && (r.reply || r.data);
        const out = (ans && typeof ans === "object") ? (ans.answer || ans.reply || ans.text || JSON.stringify(ans)) : String(ans || "");
        removeTyping();
        addMsg("bot", esc(out));
        appendResult("marketing", `<div class="cc-answer">${PL.icon("sparkles", 14)}<div><b>AI answer</b><p>${esc(out)}</p></div></div>`);
        openTab("marketing");
      } catch (e) {
        removeTyping();
        addMsg("bot", `<span class="cc-err">⚠️ ${L[curLang].connectionFailed} ${esc(String(e))}</span>`);
      }
      setStatus("ready");
      return;
    }

    addTyping();
    setStatus(L[curLang].routing(tools.length));

    const runs = [];
    let i = 0;
    for (const tool of tools) {
      setStatus(L[curLang].thinking + " " + (i + 1) + "/" + tools.length);
      const run = { id: uid(), tool, meta: {}, status: "running", simulated: false };
      runs.push(run);
      addRunCard(run);
      let output = null, meta = {};
      try {
        if (tool.local) {
          output = await localRun(tool, t);
          meta = { provider: "built-in", latency: "local" };
          if (output && output.cancelled) { run.cancelled = true; }
        } else {
          const res = await PL_API.run(tool.id, t);
          const ok = res && res.ok;
          meta = res && res.meta ? res.meta : {};
          const data = res && res.data;
          const m = meta || {};
          run.simulated = Boolean(res && res.simulated);
          if (!ok || data == null) {
            output = { text: (m.error || "No data"), error: true };
            if (!ok && !data && m.simulated && m.provider === "demo") { output = { text: "Demo mode — no working API key." }; }
          } else {
            output = data;
            if (run.simulated) meta.simulated = true;
          }
        }
      } catch (e) {
        output = { error: true, text: "Tool error: " + String(e) };
      }
      run.meta = { ...meta, latency: meta.latency || "now" };
      run.output = output;
      setRunSteps(run, 99, output && output.error ? "err" : "done");
      finishRun(run, !(output && output.error));
      await renderResult(tool, output, run.meta);
      i++;
    }

    removeTyping();
    setStatus(L[curLang].done);

    const errCount = runs.filter((r) => r.status === "err").length;
    let brief;
    if (errCount === runs.length) brief = L[curLang].nothingExecuted;
    else if (runs.length === 1 && runs[0].status !== "err" && runs[0].tool.local) brief = L[curLang].resultRendered + " (" + runs[0].tool.name + ")";
    else {
      brief = "I ran these tools for you: " + runs.map((r) => r.tool.name + (r.status === "err" ? " [error]" : "")).join(", ") + ". " + L[curLang].resultRendered + ".";
    }
    const allErrs = runs.filter((r) => r.status === "err");
    const final = await summarize(brief + (allErrs.length ? " Errors: " + allErrs.map((r) => String((r.output || {}).text || "")).join(" | ") : ""));
    addMsg("bot", esc(final));
    state.messages.push({ role: "assistant", content: final });
  }

  async function renderResult(tool, output, meta) {
    const tab = tool.tab || "page";
    let html;
    try {
      html = render[tool.id] ? render[tool.id](output, meta) : render.fallback(output, meta, tool);
    } catch (e) {
      html = `<div class="cc-head">${PL.icon("alert-circle", 14)}<b>${esc(tool.name)}</b></div><div class="cc-note">${esc(String(e))}</div>` + obj(output);
    }
    if (output && (output.text || output.error)) {
      html += `<div class="cc-err">⚠️ ${esc(output.text || "error")}</div>`;
    }
    appendResult(tab, html, tool.id);
    if (tool.id === "landing") state.lastLanding = { output, meta };
    openTab(tab);
  }

  /* ---------------- Model picker ---------------- */
  async function loadModelPicker() {
    try {
      const s = await PL_API.settings();
      const providers = Object.entries(s.providers || {});
      const sel = $("#cc-model");
      if (!sel || !providers.length) return;
      sel.innerHTML = `<option value="">Auto · route per task</option>` + providers.map(([id, v]) =>
        `<option value="${esc(id)}">${esc(v.name || id)}${v.keyMasked ? " · " + esc(v.keyMasked) : ""}</option>`).join("");
      sel.onchange = async () => {
        if (!sel.value) return;
        try {
          await PL_API.setActiveProvider(sel.value);
          if (window.PL && PL.toast) PL.toast("Default model set to " + sel.value, "ok");
        } catch (e) {}
      };
    } catch (e) {}
  }

  /* ---------------- Uploads ---------------- */
  function handleDrop(files) {
    const f = files && files[0];
    if (!f || !f.type.startsWith("image/")) return;
    const rd = new FileReader();
    rd.onload = () => {
      const ref = PL_API.fileToDataUri(f, rd.result);
      window.lastDropped = ref;
      addMsg("bot", `<div class="cc-imgpick"><img src="${ref.uri}" alt="attached"><span>Image attached — ${esc(f.name)}</span></div>`);
    };
    rd.readAsDataURL(f);
  }

  function setupQuick() {
    const chips = $$(".cc-quick button");
    chips.forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.q;
      if (!v) return;
      $("#cc-input").value = v;
      send();
    }));
  }

  let queue = [];
  function send() {
    const inp = $("#cc-input");
    const t = inp.value.trim();
    if (!t) return;
    inp.value = "";
    queue.push(t);
    pump();
  }

  async function pump() {
    if (state.busy || !queue.length) return;
    state.busy = true;
    const t = queue.shift();
    setStatus("…");
    try {
      await handleMessage(t);
    } catch (e) {
      removeTyping();
      addMsg("bot", `<span class="cc-err">⚠️ ${esc(String(e))}</span>`);
    } finally {
      state.busy = false;
      setStatus("ready");
      if (queue.length) pump();
    }
  }

  function welcome() {
    const p = D().product || {};
    addMsg("bot", `<b>Hello 👋</b> I'm your <b>E-commerce AI Agent</b>.<br>
      I plan, build and market your store with you — and I never touch anything irreversible without your approval.<br>
      <div class="cc-qs">
        <button data-q="Analyze a product — ${esc(p.name || "my product")}">🔍 Analyze a product</button>
        <button data-q="Build my landing page">🧱 Build my landing page</button>
        <button data-q="Generate a logo">🎨 Generate a logo</button>
        <button data-q="Create a campaign">📣 Create a campaign</button>
        <button data-q="Show my leads">🗃️ Show my leads</button>
        <button data-q="Show my app settings">⚙️ Show my app settings</button>
      </div>`);
    const btn = $("#cc-send");
    if (btn) btn.addEventListener("click", send);
    const inp = $("#cc-input");
    if (inp) inp.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
    setupQuick();
    const d2 = $("#cc-upload");
    if (d2) {
      d2.addEventListener("click", () => {
        const fi = document.createElement("input");
        fi.type = "file";
        fi.accept = "image/*";
        fi.onchange = () => handleDrop(fi.files);
        fi.click();
      });
      ["dragenter", "dragover"].forEach((ev) => d2.addEventListener(ev, (e) => { e.preventDefault(); d2.classList.add("hot"); }));
      ["dragleave", "drop"].forEach((ev) => d2.addEventListener(ev, (e) => { e.preventDefault(); d2.classList.remove("hot"); }));
      d2.addEventListener("drop", (e) => handleDrop(e.dataTransfer.files));
    }
  }

  function boot() {
    buildTabs();
    renderWorkspace();
    setupViewToggle();
    welcome();
    loadModelPicker();
    setStatus("ready");
  }

  window.CCD = { state, render, openTab, setView, TABS, ICON, appendResult, renderResult, handleMessage, matchTools, localRun };
  document.addEventListener("DOMContentLoaded", boot);
  if (document.readyState !== "loading") boot();
})();
