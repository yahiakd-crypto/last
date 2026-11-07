/* ============================================================
   ECOM AI TOOLS (ai-tools.html)
   The all-in-one AI workspace for e-commerce. Full SPA:
   command center, business context, 30+ connected tools across
   products / brand / creative / ads / offers / COD / customers /
   strategy / automation — with a confidence + evidence system.
   All AI output is clearly-labeled simulation (no backend needed).
   ============================================================ */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const fmt = (v) => Math.round(Number(v) || 0).toLocaleString("en-US").replace(/,/g, " ");
  const fmtN = (v, d) => { const x = Number(v); return isNaN(x) ? "0" : x.toFixed(d == null ? 1 : d); };
  const pct = (v, d) => fmtN(Number(v) * 100, d == null ? 1 : d) + "%";
  const money = (v, cur) => fmt(v) + " " + (cur || ctx.currency || "DA");
  const ic = (n, s) => `<i data-lucide="${n}" style="width:${s || 15}px;height:${s || 15}px"></i>`;
  const icons = () => { if (window.lucide) lucide.createIcons(); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const uid = () => "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function toast(msg, type) {
    const stack = $("toast-stack");
    if (!stack) return;
    const t = document.createElement("div");
    t.className = "toast " + (type || "ok");
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 320); }, 2400);
  }

  /* ---------- persistence ---------- */
  const store = {
    get(k, fb) { try { const r = localStorage.getItem("eai." + k); return r == null ? fb : JSON.parse(r); } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem("eai." + k, JSON.stringify(v)); } catch (e) {} },
  };

  const DEFAULT_CTX = {
    business: "Atlas Trade",
    brand: "Codzilla",
    country: "Algeria",
    market: "COD Algeria",
    currency: "DA",
    voice: "Direct response, friendly, local",
    product: "17-piece chef knife set",
    price: 3900,
    cost: 1450,
    shipping: 160,
    cr: 62,
    dr: 64,
    cpa: 1.2,
    budget: 300000,
  };

  let ctx = Object.assign({}, DEFAULT_CTX, store.get("ctx", {}));
  let history = store.get("history", []);
  let projects = store.get("projects", []);
  let templates = store.get("templates", []);
  let chatLog = store.get("chat", []);
  let usage = store.get("usage", { runs: 0, tokens: 0, cost: 0, perTool: {} });
  let memory = store.get("memory", { winners: [], creatives: [], hooks: [], offers: [] });

  function saveCtx() { store.set("ctx", ctx); }
  function saveHistory() { store.set("history", history.slice(0, 60)); }

  function logRun(toolId, toolName, conf, summary) {
    history.unshift({ id: uid(), ts: Date.now(), tool: toolName, toolId, conf, summary });
    saveHistory();
    usage.runs += 1;
    usage.tokens += 380 + Math.round(Math.random() * 900);
    usage.cost += 0.004 + Math.random() * 0.012;
    usage.perTool[toolId] = (usage.perTool[toolId] || 0) + 1;
    store.set("usage", usage);
  }

  /* ---------- navigation ---------- */
  const GROUPS = [
    { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { id: "chat", label: "AI Chat", icon: "bot-message-square" },
    { id: "product", label: "Product AI", icon: "package" },
    { id: "research", label: "Research AI", icon: "radar" },
    { id: "brand", label: "Brand AI", icon: "badge-check" },
    { id: "creative", label: "Creative AI", icon: "palette" },
    { id: "ad", label: "Ad AI", icon: "megaphone" },
    { id: "landing", label: "Landing Page AI", icon: "layout-template" },
    { id: "offer", label: "Offer AI", icon: "gift" },
    { id: "sales", label: "Sales AI", icon: "trending-up" },
    { id: "cod", label: "COD AI", icon: "truck" },
    { id: "customer", label: "Customer AI", icon: "headset" },
    { id: "business", label: "Business AI", icon: "building-2" },
    { id: "projects", label: "My Projects", icon: "folder-kanban" },
    { id: "templates", label: "Templates", icon: "layout-grid" },
    { id: "history", label: "AI History", icon: "history" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  let activeGroup = "dashboard";
  let activeTool = null;
  let pendingRoute = null;

  function navigate(groupId, toolId) {
    activeGroup = groupId;
    activeTool = toolId || null;
    pendingRoute = null;
    render();
    icons();
  }

  /* ---------- UI shell ---------- */
  function renderShell() {
    const view = $("eat-view");
    const sidebar = GROUPS.map((g) => `
      <button class="eat-nav-btn${activeGroup === g.id ? " active" : ""}" data-nav="${g.id}">
        ${ic(g.icon, 15)} <span>${g.label}</span>
      </button>`).join("");
    view.innerHTML = `
      <div class="eat-head">
        <div>
          <div class="eat-title">ECOM <em>AI</em> TOOLS</div>
          <div class="eat-sub">The AI operating system for e-commerce. Connected workspace — products, brand, creatives, ads, offers, COD, customers, strategy. Input your business data, let AI analyze, create, test, measure, learn, improve.</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="pill green"><i data-lucide="badge-check" style="width:13px;height:13px"></i> Simulated AI</span>
          <span class="pill gray"><i data-lucide="database" style="width:13px;height:13px"></i> ${esc(ctx.market || "No market set")}</span>
        </div>
      </div>
      <div class="eat-layout">
        <aside class="eat-side">
          <div class="eat-side-lbl">Workspace</div>
          ${sidebar}
          <div class="eat-side-foot">Every AI result is a hypothesis — never a fact. Results show confidence, data used, assumptions and limitations.</div>
        </aside>
        <main class="eat-main" id="eat-main"></main>
      </div>`;
  }

  /* ---------- shared output renderer ---------- */
  function blockHTML(b) {
    switch (b.t) {
      case "kpis":
        return `<div class="g4">${(b.items || []).map((k) => `
          <div class="kpi ${k.tone || "blu"}"><div class="kpi-l">${esc(k.l)}</div><div class="kpi-v">${k.v}</div><div class="kpi-s">${esc(k.s || "")}</div></div>`).join("")}</div>`;
      case "scores":
        return `<div class="score-grid">${(b.items || []).map((s) => `
          <div class="score-cell ${s.tone || "info"}"><div class="sc-l">${esc(s.label)}</div><div class="sc-v">${s.v}</div><div class="sc-s">${esc(s.note || "")}</div></div>`).join("")}</div>`;
      case "table":
        return `<div class="tbl-wrap"><table class="eat-tbl"><thead><tr>${(b.head || []).map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${(b.rows || []).map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      case "list":
        return `<div class="eat-list">${(b.items || []).map((i) => `
          <div class="eat-li"><span class="li-ic ${i.tone || ""}">${ic(i.ic || "chevron-right", 14)}</span>
            <div><div class="li-t">${i.t}</div>${i.d ? `<div class="li-d">${i.d}</div>` : ""}</div></div>`).join("")}</div>`;
      case "flow":
        return `<div class="flow">${(b.steps || []).map((s) => `
          <div class="flow-step"><span class="fs-ic">${ic(s.ic || "circle", 16)}</span>${s.label}<b>${esc(s.sub || "")}</b></div>`).join("")}</div>`;
      case "tip":
        return `<div class="tip ${b.tone || "info"}"><span class="ti">${ic(b.ic || (b.tone === "warn" ? "alert-triangle" : b.tone === "danger" ? "x-circle" : b.tone === "ok" ? "check-circle" : "lightbulb"), 15)}</span><div>${b.html}</div></div>`;
      case "hl":
        return `<div class="hl ${b.tone || ""}"><b>${esc(b.title || "")}</b>${b.html ? " — " + b.html : ""}</div>`;
      case "decision":
        return `<div class="decision"><div class="d-top">${ic("corner-down-right", 13)} What should I do next?</div><div class="d-choice">${ic("zap", 16)} ${esc(b.choice)}</div>${b.why ? `<div class="d-why">${b.why}</div>` : ""}</div>`;
      case "html":
        return b.html;
      case "chart":
        return `<div class="chw${b.lg ? "-lg" : ""}"><canvas id="${b.id}" ${b.lg ? "" : `height="220"`}></canvas></div>`;
      default:
        return "";
    }
  }

  function confBox(conf) {
    const lvl = (conf && conf.level) || "low";
    const rows = [
      ["Data used", (conf && conf.data) || "No connected data — simulation only"],
      ["Assumptions", (conf && conf.assumptions) || "Inputs reflect what you provided"],
      ["Limitations", (conf && conf.limitations) || "Not verified against live business data"],
    ];
    return `<div class="conf-box ${lvl}">
      <div class="conf-top"><span class="dot"></span>CONFIDENCE: ${lvl.toUpperCase()}</div>
      <div class="conf-rows">${rows.map((r) => `<div class="cr"><b>${r[0]}</b> ${esc(r[1])}</div>`).join("")}</div>
    </div>`;
  }

  const pendingCharts = {};

  function renderOutput(container, out) {
    if (!out) return;
    let meta = "";
    if (out.conf) {
      const lvl = out.conf.level || "low";
      const tone = lvl === "high" ? "green" : lvl === "medium" ? "amber" : "red";
      meta = `<div class="ai-run-meta"><span class="pill ${tone}"><span class="dot"></span>${lvl.toUpperCase()} confidence</span><span class="pill gray">${esc((out.provider || "simulation"))}</span><span class="pill gray">${esc((out.model || "ecom-demo"))}</span></div>`;
    }
    let body = (out.blocks || []).map(blockHTML).join("");
    if (out.decision) {
      body += `<div class="decision">
        <div class="d-top">${ic("corner-down-right", 13)} What should I do next?</div>
        <div class="d-choice">${ic("zap", 16)} ${esc(out.decision.choice)}</div>
        <div class="d-why">${out.decision.why || ""}</div>
      </div>`;
    }
    container.innerHTML = `
      <div class="out-anim">
        <div class="out-head">${ic("sparkles", 15)} ${esc(out.title || "AI Output")}</div>
        ${meta}
        ${body}
        ${confBox(out.conf)}
      </div>`;
    icons();
    (Object.keys(pendingCharts)).forEach((cid) => { if (cid && $("chart-" + cid)) buildChart(cid); });
  }

  function buildChart(cid) {
    const spec = pendingCharts[cid];
    const el = document.getElementById("chart-" + cid);
    if (!el || !spec) return;
    const cfg = {
      type: spec.type || "bar",
      data: {
        labels: spec.labels || [],
        datasets: (spec.datasets || []).map((d, i) => ({
          label: d.label || "",
          data: d.data || [],
          backgroundColor: d.color || (i === 0 ? "#3EE8A6" : "#3A4E77"),
          borderColor: d.color || "#3EE8A6",
          borderWidth: 2,
          tension: 0.38,
          fill: d.fill === true,
          borderRadius: 5,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: spec.legend === false ? { display: false } : { labels: { color: "#8A9AB6", font: { size: 10 } } },
        },
        scales: spec.type === "pie" || spec.type === "doughnut" ? {} : {
          x: { grid: { color: "#1F2B45" }, ticks: { color: "#8A9AB6", font: { size: 9 } } },
          y: { grid: { color: "#1F2B45" }, ticks: { color: "#8A9AB6", font: { size: 9 } } },
        },
      },
    };
    try { new Chart(el.getContext("2d"), cfg); } catch (e) { console.error(e); }
  }

  function charts(blocks) {
    Object.keys(pendingCharts).forEach((k) => delete pendingCharts[k]);
    (blocks || []).forEach((b) => {
      if (b.t === "chart") pendingCharts[b.id] = b.spec;
    });
  }

  /* ---------- tool registry ---------- */
  const TOOLS = {};

  function register(id, t) {
    t.id = id;
    TOOLS[id] = t;
  }

  /* ============ PRODUCT AI ============ */
  register("productAnalyzer", {
    name: "Product Analyzer", icon: "search", group: "product",
    desc: "Extract the facts, the unknowns and the opportunity of any product. Verified information is separated from AI assumptions.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product, ph: "Name or paste a product URL / description" },
      { key: "price", label: "Selling price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "cost", label: "Product cost (COGS)", type: "number", def: ctx.cost, unit: ctx.currency },
      { key: "market", label: "Target market", type: "text", def: ctx.market, ph: "e.g. COD Algeria" },
    ],
    run(v) {
      const margin = (v.price - v.cost) / v.price * 100;
      const demand = clamp(Math.round(45 + v.price / 90 - v.cost / 30), 30, 96);
      const creative = clamp(Math.round(58 + (110 - v.price / 40) / 2), 40, 95);
      const codScore = clamp(Math.round(52 + v.cost / 22), 30, 94);
      const competition = clamp(Math.round(50 + v.price / 120), 20, 92);
      const shipping = clamp(Math.round(80 - v.price / 200), 20, 95);
      const opp = Math.round(margin * 0.45 + demand * 0.2 + creative * 0.15 + codScore * 0.1 + (100 - competition) * 0.1);
      return {
        title: "Product Analysis — " + v.product,
        conf: { level: "medium", data: "Your inputs (price, cost, market) — no live marketplace data connected", assumptions: ["COGS covers landed cost, not delivery/returns", "Demand is inferred from price band, not real search volume"], limitations: ["Scores are directional, not verified facts", "No competitor data attached yet"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Margin", v: pct(margin, 0), s: "gross margin", tone: margin >= 40 ? "grn" : margin >= 25 ? "gold" : "red" },
            { l: "Opportunity", v: opp + "/100", s: "overall", tone: opp >= 70 ? "grn" : opp >= 50 ? "gold" : "red" },
            { l: "Demand", v: demand + "/100", s: "estimated", tone: demand >= 65 ? "grn" : "blu" },
            { l: "Creative", v: creative + "/100", s: "potential", tone: creative >= 60 ? "grn" : "blu" },
            { l: "COD fit", v: codScore + "/100", s: "market", tone: codScore >= 60 ? "grn" : "gold" },
            { l: "Competition", v: competition + "/100", s: "higher = harder", tone: competition >= 70 ? "red" : "grn" },
            { l: "Shipping", v: shipping + "/100", s: "fit", tone: shipping >= 60 ? "grn" : "gold" },
          ] },
          { t: "hl", title: "One-line read", html: opp >= 70 ? "Strong candidate — good margin and creative angle. Build a test." : opp >= 50 ? "Testable, but fix one weak score before scaling." : "Weak on paper — research before investing." },
          { t: "list", title: "Estimated profile", items: [
            { ic: "users", tone: "", t: "Target audience", d: "Price-sensitive buyers in " + esc(v.market) + " who shop on impulse and pay on delivery." },
            { ic: "lightbulb", tone: "", t: "USP angle", d: "Lead with the transformation/proof, then the offer. Benefit-first beats feature-first here." },
            { ic: "shield-alert", tone: "amber", t: "Objections to pre-empt", d: "Quality doubts, delivery time, and 'is it worth it' — answer all three on the landing page." },
            { ic: "tags", tone: "", t: "Pricing opportunity", d: "You have " + pct(margin, 0) + " margin — room for a bundle or free-shipping offer." },
          ] },
          { t: "tip", tone: "info", html: "<b>Verified vs assumption:</b> only your price/cost/market are verified. Everything else is an AI estimate and must be marked as such." },
        ],
      };
    },
  });

  register("winnerFinder", {
    name: "Product Winner Finder", icon: "trophy", group: "product",
    desc: "Search directions for test-worthy products. Never a guaranteed winner — every pick is a hypothesis.",
    fields: [
      { key: "market", label: "Country / market", type: "text", def: ctx.market, ph: "e.g. Algeria COD" },
      { key: "budget", label: "Test budget (monthly)", type: "number", def: ctx.budget, unit: ctx.currency },
      { key: "price", label: "Target price", type: "number", def: 3500, unit: ctx.currency },
      { key: "niche", label: "Category preference", type: "text", ph: "kitchen, beauty, gadgets…" },
    ],
    run(v) {
      const cands = [
        { n: "Magnetic phone holder (car)", c: "≈900", p: 2800, why: "High demo potential, unboxing-friendly, low shipping weight", r: "Medium — crowded but angle space exists", sc: 74 },
        { n: "Kitchen gadget bundle (3-in-1)", c: "≈1600", p: 4900, why: "Bundle raises AOV, strong margin, easy UGC demos", r: "Low-Medium — needs sharp creative", sc: 81 },
        { n: "Sleep/anti-snore device", c: "≈1300", p: 4200, why: "Problem-led demand, emotional angle, repeat appeal", r: "Medium — claims must be legal & honest", sc: 78 },
        { n: "Home organization set", c: "≈700", p: 2600, why: "Lifestyle content, broad audience, cheap to test", r: "Low — competitive", sc: 69 },
      ];
      const pickN = cands.slice(0, 3);
      return {
        title: "Potential products to test (" + v.market + ")",
        conf: { level: "low", data: "Your market, budget and price band", assumptions: ["Candidate pool is simulated — not scraped supplier data", "Costs are rough category estimates"], limitations: ["No live search/supplier data connected", "Never treat these as guaranteed winners"] },
        blocks: [
          ...pickN.map((c) => ({
            t: "html",
            html: `<div class="eat-li" style="margin-bottom:7px"><span class="li-ic ${c.sc >= 75 ? "green" : "blue"}">${ic("package", 14)}</span>
              <div style="flex:1">
                <div class="li-t">${esc(c.n)} <span class="tag ${c.sc >= 75 ? "green" : "amber"}">score ${c.sc}/100</span></div>
                <div class="li-d">Cost ${c.c} · suggested price ${fmt(c.p)} DA · ${esc(c.why)}<br>Risk: ${esc(c.r)}</div>
              </div></div>`,
          })),
          { t: "tip", tone: "warn", html: "<b>No guaranteed winners.</b> Each candidate is a test hypothesis. Validate demand with a small spend before any scale decision." },
          { t: "hl", title: "Top pick", html: pickN[0].n + " — highest combined demo + margin + low shipping weight." },
        ],
      };
    },
  });

  register("productCompare", {
    name: "Product Comparison", icon: "git-compare", group: "product",
    desc: "Compare up to 3 products on the factors that decide winners: demand, competition, cost, margin, shipping, creative, COD fit.",
    fields: [
      { key: "a_name", label: "Product A", type: "text", def: "A" },
      { key: "a_m", label: "A — margin %", type: "number", def: 42 },
      { key: "a_c", label: "A — competition (0-100)", type: "number", def: 55 },
      { key: "a_cod", label: "A — COD fit (0-100)", type: "number", def: 70 },
      { key: "b_name", label: "Product B", type: "text", def: "B" },
      { key: "b_m", label: "B — margin %", type: "number", def: 30 },
      { key: "b_c", label: "B — competition (0-100)", type: "number", def: 70 },
      { key: "b_cod", label: "B — COD fit (0-100)", type: "number", def: 50 },
      { key: "c_name", label: "Product C", type: "text", def: "C" },
      { key: "c_m", label: "C — margin %", type: "number", def: 55 },
      { key: "c_c", label: "C — competition (0-100)", type: "number", def: 40 },
      { key: "c_cod", label: "C — COD fit (0-100)", type: "number", def: 80 },
    ],
    run(v) {
      const rows = ["A", "B", "C"].map((x) => {
        const m = Number(v[x + "_m"]) || 0, c = Number(v[x + "_c"]) || 0, cod = Number(v[x + "_cod"]) || 0;
        return { name: v[x + "_name"] || x, m, c, cod, score: Math.round(m * 0.5 + (100 - c) * 0.3 + cod * 0.2) };
      });
      rows.sort((a, b) => b.score - a.score);
      const best = rows[0];
      return {
        title: "Comparison verdict",
        conf: { level: "medium", data: "The scores you entered", assumptions: ["Scores are your own estimates — we just weight them", "Margin is weighted highest (50%)"], limitations: ["No real performance data attached"] },
        blocks: [
          { t: "table", head: ["Product", "Margin", "Competition", "COD fit", "Weighted score"], rows: rows.map((r) => [`<b>${esc(r.name)}</b>`, pct(r.m, 0), r.c + "/100", r.cod + "/100", `<b>${r.score}/100</b>`]) },
          { t: "decision", choice: "BEST TO TEST: " + best.name, why: `${esc(best.name)} leads because margin is weighted 50%, and it balances competition (${best.c}/100) with a COD fit of ${best.cod}/100.` },
          { t: "tip", tone: "info", html: "Test the winner on a small budget before scaling — comparison only ranks hypotheses." },
        ],
      };
    },
  });

  register("buyerPersona", {
    name: "Buyer Persona Builder", icon: "users", group: "product",
    desc: "Build a persona from product + market + customer signals. Output is a hypothesis until you feed real reviews.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "market", label: "Market", type: "text", def: ctx.market },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "age", label: "Typical age range", type: "text", def: "25-45", ph: "e.g. 25-45" },
    ],
    run(v) {
      return {
        title: "Persona — " + v.product,
        conf: { level: "low", data: "Product, market, price, age band", assumptions: ["Persona is modeled, not measured", "Replace with review-miner output when available"], limitations: ["No customer data connected"] },
        blocks: [
          { t: "list", items: [
            { ic: "user", t: esc(v.age) + " · " + esc(v.market), d: "The core buyer: budget-aware, smartphone-first, pays cash on delivery." },
            { ic: "flame", tone: "", t: "Desires", d: "Visible result, speed, and a 'fair price' feeling — the deal must feel smart." },
            { ic: "shield-alert", tone: "amber", t: "Fears & objections", d: "Getting a fake/cheap version, slow delivery, being able to return it." },
            { ic: "zap", tone: "", t: "Buying triggers", d: "Social proof, a clear demonstration, an offer with low perceived risk (COD)." },
            { ic: "message-circle", tone: "", t: "Language & content", d: "Short, local, direct. Video/visual over long text." },
          ] },
          { t: "hl", title: "What they want to hear", html: '"This solves the exact problem, here\'s proof, it arrives fast, and you pay when it\'s in your hands."' },
          { t: "hl", tone: "warn", title: "What they do NOT want to hear", html: "Vague hype, fake urgency, unverifiable claims, or any hint that you don't know their market." },
        ],
      };
    },
  });

  register("reviewMiner", {
    name: "Customer Review Miner", icon: "file-text", group: "product",
    desc: "Paste reviews, comments or support chats — AI extracts the voice of the customer.",
    fields: [
      { key: "reviews", label: "Reviews / comments / chats", type: "textarea", def: "", ph: "Paste multiple reviews, one per line…", rows: 5 },
    ],
    run(v) {
      const src = (v.reviews || "").trim();
      const n = src ? src.split(/\n+/).length : 0;
      const items = src ? [
        { ic: "alert-triangle", tone: "amber", t: "Pain points", d: "Delivery delays and quality uncertainty appear most — pre-empt both on the page." },
        { ic: "heart", t: "Desired benefits", d: "Speed, durability, and 'worth the price' feeling." },
        { ic: "shield-alert", tone: "amber", t: "Objections", d: "'Will it work?', 'Is it original?', 'Can I return it?'" },
        { ic: "thumbs-down", tone: "red", t: "Complaints", d: "Late delivery, packaging, and after-sales response times." },
        { ic: "thumbs-up", tone: "green", t: "Positive experiences", d: "Fast delivery, good quality for price, easy COD." },
        { ic: "message-square", t: "Common language", d: "Short, direct, local phrasing — mirror it in ads." },
      ] : [
        { ic: "file-x", tone: "amber", t: "No reviews pasted", d: "Paste reviews or support conversations to extract the voice of the customer." },
      ];
      return {
        title: n ? "Voice of the customer — from " + n + " entries" : "Review miner",
        conf: { level: src ? "medium" : "low", data: src ? n + " pasted entries" : "No input", assumptions: ["Extraction is from the pasted text only"], limitations: ["Small sample — not statistically meaningful"] },
        blocks: [ { t: "list", items } ],
      };
    },
  });

  /* ============ RESEARCH AI ============ */
  register("marketResearch", {
    name: "Market Opportunity Report", icon: "globe", group: "research",
    desc: "Demand, trends, competition, customer language, seasonality and positioning. We do not invent statistics.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "market", label: "Market", type: "text", def: ctx.market },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
    ],
    run(v) {
      return {
        title: "Market Opportunity — " + v.product,
        conf: { level: "low", data: "Product + market only — no external research connected", assumptions: ["Trend notes are general knowledge, not sourced market data"], limitations: ["No web-search / verified stats included — connect a research provider for sourced facts"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Demand signal", v: "MEDIUM", s: "directional", tone: "gold" },
            { l: "Competition", v: "HIGH", s: "needs sharp angle", tone: "red" },
            { l: "Seasonality", v: "MODERATE", s: "varies by category", tone: "blu" },
          ] },
          { t: "list", items: [
            { ic: "search", t: "Demand", d: "Problem-led products with visible proof usually outperform pure novelty in COD markets." },
            { ic: "line-chart", t: "Trend", d: "Impulse + visual-demo categories trend well; heavy/non-demonstrable products underperform." },
            { ic: "users", t: "Customer language", d: "Local, short, benefit-first. Mirror the words customers already use." },
            { ic: "layers", t: "Alternatives", d: "Cheaper local copies exist — you win on proof, offer and delivery trust, not just price." },
            { ic: "calendar", t: "Seasonality", d: "Promotions, Ramadan/Eid and holiday peaks shift demand — plan stock and ads around them." },
            { ic: "target", t: "Positioning", d: "Pick ONE: best proof, best offer, or best trust — never all three weakly." },
          ] },
          { t: "tip", tone: "warn", html: "<b>No invented stats.</b> If external numbers are needed, they must come from a source you can open — never fabricated." },
        ],
      };
    },
  });

  register("competitorResearch", {
    name: "Competitor Research", icon: "swords", group: "research",
    desc: "Public competitor info: products, prices, offers, positioning, gaps. Verified vs inferred is separated.",
    fields: [
      { key: "product", label: "Your product", type: "text", def: ctx.product },
      { key: "market", label: "Market", type: "text", def: ctx.market },
      { key: "competitors", label: "Competitor names (comma)", type: "text", ph: "e.g. StoreX, StoreY" },
    ],
    run(v) {
      const comps = (v.competitors || "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);
      const list = comps.length ? comps : ["Competitor 1", "Competitor 2"];
      return {
        title: "Competitor map — " + v.product,
        conf: { level: "low", data: "Competitor names you entered", assumptions: ["Profile below is generic, not scraped from their pages", "Mark as INFERRED until you verify each store"], limitations: ["No live store data attached"] },
        blocks: [
          { t: "table", head: ["Competitor", "Positioning", "Observed price", "Evidence"], rows: list.map((c, i) => [`<b>${esc(c)}</b>`, `<span class="tag amber">INFERRED</span>`, fmt(2600 + i * 700) + " DA", `<span class="tag gray">NOT VERIFIED</span>`]) },
          { t: "list", items: [
            { ic: "git-compare", t: "Pricing gap", d: "There is usually room under the premium player and above the cheapest — middle + strong proof is often the sweet spot." },
            { ic: "gift", t: "Offer gap", d: "Few competitors run bundles or free-delivery offers — that's an opening." },
            { ic: "clapperboard", t: "Creative gap", d: "Most run static product shots. A demonstration/UGC angle stands out." },
          ] },
          { t: "tip", tone: "info", html: "<b>Verified vs inference:</b> anything you have not personally opened and confirmed must stay INFERRED / NOT VERIFIED." },
        ],
      };
    },
  });

  /* ============ BRAND AI ============ */
  register("brandBuilder", {
    name: "Brand Builder", icon: "badge-check", group: "brand",
    desc: "Positioning, mission, USP, story, personality, voice, color & type direction — a starting point, not a final brand.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "market", label: "Market", type: "text", def: ctx.market },
      { key: "audience", label: "Audience", type: "text", def: "Price-sensitive, mobile-first, COD buyers" },
      { key: "feeling", label: "Feeling you want", type: "text", def: "Trustworthy and exciting", ph: "e.g. premium, friendly, bold…" },
    ],
    run(v) {
      return {
        title: "Brand direction — " + v.product,
        conf: { level: "medium", data: "Product, market, audience, feeling", assumptions: ["Direction is a draft to refine", "Voice must be tuned to your real tone"], limitations: ["Not a trademark check — verify name availability"] },
        blocks: [
          { t: "list", items: [
            { ic: "type", t: "Positioning", d: "The trustworthy pick in " + esc(v.market) + " for " + esc(v.audience).toLowerCase() + " — proof before promises." },
            { ic: "flag", t: "Mission", d: "Make quality feel fair and risk-free for buyers who pay at the door." },
            { ic: "gem", t: "USP", d: "Demonstrated value + COD trust + fast delivery — the trinity most competitors miss." },
            { ic: "book-open", t: "Brand story", d: "From 'importing products' to 'building a store people recommend because it actually delivers'." },
            { ic: "smile", t: "Personality", d: esc(v.feeling) + " — warm, direct, never pushy." },
            { ic: "mic", t: "Voice", d: "Short sentences. Local phrases. Benefit-led. Zero hype words that can't be proven." },
            { ic: "palette", t: "Color direction", d: "Strong single accent + neutral base (e.g. deep navy + electric green) for ads that pop in a feed." },
            { ic: "pilcrow", t: "Typography", d: "Bold condensed display for hooks, clean sans for body — mobile-first." },
            { ic: "sparkles", t: "Tagline candidate", d: '"Proven. Delivered. Trusted."' },
          ] },
        ],
      };
    },
  });

  register("brandVoice", {
    name: "Brand Voice Engine", icon: "mic", group: "brand",
    desc: "Configure a tone and language. Every ad, landing page and message follows it.",
    fields: [
      { key: "tone", label: "Tone", type: "select", def: "Direct response", opts: ["Premium", "Friendly", "Professional", "Bold", "Minimal", "Luxury", "UGC", "Direct response", "Local"] },
      { key: "lang", label: "Language", type: "select", def: "Arabic / Darija", opts: ["Arabic / Darija", "Arabic (MSA)", "French", "English"] },
    ],
    run(v) {
      const rules = {
        "Direct response": "Short, benefit-first, one clear CTA. Proof beats adjectives.",
        "Friendly": "Warm, casual, speaks like a helpful local friend.",
        "Professional": "Clear, structured, credible. Facts and guarantees up front.",
        "Premium": "Restrained, elegant, price-justifying. Fewer words, more confidence.",
        "Bold": "Short punchy lines, strong statements, confident claims only when true.",
        "Minimal": "One idea per line. Whitespace does the talking.",
        "Luxury": "Exclusive tone, quality cues, no discounts-heavy framing.",
        "UGC": "Sounds like a real customer talking — imperfect, honest, specific.",
        "Local": "Colloquial, familiar, references local life and delivery reality.",
      };
      return {
        title: "Brand voice — " + v.tone + " · " + v.lang,
        conf: { level: "medium", data: "Selected tone + language", assumptions: ["Rules are templates to enforce", "Local phrasing should be reviewed by a native speaker"], limitations: ["No past content to calibrate against yet"] },
        blocks: [
          { t: "hl", title: "Voice rule", html: rules[v.tone] || "" },
          { t: "list", items: [
            { ic: "check-circle", tone: "green", t: "Always do", d: "Use " + esc(v.lang) + " naturally. Open with the benefit, close with ONE action." },
            { ic: "x-circle", tone: "red", t: "Never do", d: "Hype, fake urgency, untestable claims, or mixing tones mid-page." },
            { ic: "copy", t: "Sample line", d: "Applied to " + esc(ctx.product) + ": “" + (v.tone === "Premium" ? "Engineered to last. Delivered to your door — pay on arrival." : "Worth every DA. Pay only when it's in your hands.") + "”" },
          ] },
        ],
      };
    },
  });

  /* ============ CREATIVE AI ============ */
  register("creativeLab", {
    name: "Creative Lab", icon: "palette", group: "creative",
    desc: "Image, video, UGC, demo, lifestyle, before/after, unboxing, comparison and testimonial concepts. We never fabricate testimonials.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "market", label: "Market", type: "text", def: ctx.market },
    ],
    run(v) {
      const concepts = [
        { ic: "clapperboard", t: "Video — problem/solution", d: "Show the problem for 2s, the product fixing it, the payoff. No talking over the proof." },
        { ic: "video", t: "UGC style", d: "A real-sounding customer unboxing and using it day 1 vs day 7. Honest, imperfect, specific." },
        { ic: "image", t: "Lifestyle image", d: "Product in the real environment, natural light, one clear focal point, CTA area clean." },
        { ic: "zap", t: "Demonstration", d: "The single most convincing use-case, slow and close-up. Proof is the hook." },
        { ic: "arrow-left-right", t: "Comparison", d: "Side-by-side vs the generic option. Fair framing only — no false claims." },
        { ic: "package-open", t: "Unboxing", d: "Box → reveal → first touch. Builds delivery expectation + trust for COD." },
      ];
      return {
        title: "Creative concepts — " + v.product,
        conf: { level: "medium", data: "Product + price + market", assumptions: ["Concepts are directions, not finished assets", "No fabricated testimonials are included"], limitations: ["No performance data yet — test to learn"] },
        blocks: [
          { t: "list", items: concepts.map((c) => ({ ic: c.ic, t: c.t, d: c.d })) },
          { t: "tip", tone: "info", html: "<b>Test discipline:</b> pick 2 concepts max, run them head-to-head, keep the winner. Never fabricate customer testimonials." },
        ],
      };
    },
  });

  register("imagePrompts", {
    name: "AI Image Prompt Generator", icon: "image", group: "creative",
    desc: "Production-ready prompts for image models — scene, camera, lighting, composition, ratios.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "scene", label: "Scene", type: "text", def: "bright modern kitchen", ph: "e.g. bright modern kitchen" },
      { key: "style", label: "Style", type: "select", def: "Photorealistic", opts: ["Photorealistic", "Studio product shot", "Lifestyle", "Minimal", "UGC phone photo"] },
      { key: "ratio", label: "Aspect ratio", type: "select", def: "4:5", opts: ["1:1", "4:5", "9:16", "16:9"] },
    ],
    run(v) {
      const base = `Photorealistic product shot of a high-quality ${esc(v.product)} in a ${esc(v.scene)}. ${v.style}. Soft natural side lighting, shallow depth of field, product clearly centered, no text, clean background, 4k.`;
      return {
        title: "Image prompt pack — " + v.ratio,
        conf: { level: "medium", data: "Product, scene, style, ratio", assumptions: ["Prompt is a starting template for your image model", "Output will need brand-leveling"], limitations: ["Model output varies — iterate"] },
        blocks: [
          { t: "html", html: `<div class="eat-li" style="margin-bottom:7px"><span class="li-ic">${ic("image", 14)}</span><div style="flex:1"><div class="li-t">${esc(v.ratio)} — primary</div><div class="li-d">${esc(base)}</div></div></div>` },
          { t: "html", html: `<div class="eat-li" style="margin-bottom:7px"><span class="li-ic">${ic("image", 14)}</span><div style="flex:1"><div class="li-t">${esc(v.ratio)} — in-use close-up</div><div class="li-d">${esc(base.replace("product clearly centered", "product in active use, hands visible"))}. Space reserved on the lower third for CTA text.</div></div></div>` },
          { t: "tip", tone: "info", html: "Use the same subject across all ratios so retargeting feels consistent." },
        ],
      };
    },
  });

  register("videoScripts", {
    name: "AI Video Script Generator", icon: "clapperboard", group: "creative",
    desc: "HOOK → PROBLEM → PRODUCT → DEMO → BENEFIT → OFFER → CTA. Multiple variants, multiple durations.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "duration", label: "Duration", type: "select", def: "20 sec", opts: ["10 sec", "15 sec", "20 sec", "30 sec", "45 sec"] },
      { key: "lang", label: "Language", type: "select", def: "Arabic / Darija", opts: ["Arabic / Darija", "French", "English"] },
    ],
    run(v) {
      const secs = Number(v.duration.split(" ")[0]) || 20;
      const variants = [
        ["Problem-led", `Hook: “Your current one barely works — right?” / Show the frustration / ${esc(v.product)} appears / 2s demo of the payoff / “Only ${fmt(v.price)} DA — delivered to your door.” / Pay on delivery. Order now.`],
        ["Benefit-led", `Hook: “The easiest ${esc(v.product)} you'll ever use.” / 1s setup / demo / “${fmt(v.price)} DA, ${v.lang === "English" ? "cash on delivery" : "cash on delivery"}.” / “Order now, pay when it arrives.”`],
        ["Objection-led", `Hook: “Afraid of ordering online?” / address quality + delivery worry / show proof + return promise / “You pay only when it's in your hands.” / CTA.`],
      ];
      return {
        title: v.duration + " video scripts — " + v.product,
        conf: { level: "medium", data: "Product, price, duration, language", assumptions: ["Scripts are skeletons to localize and film", "Duration budgets lines — trim for delivery"], limitations: ["No past ad performance to learn from yet"] },
        blocks: [
          { t: "flow", steps: [{ ic: "megaphone", label: "HOOK", sub: "≤2s" }, { ic: "alert-triangle", label: "PROBLEM", sub: "short" }, { ic: "package", label: "PRODUCT", sub: "reveal" }, { ic: "zap", label: "DEMO", sub: "proof" }, { ic: "gift", label: "BENEFIT", sub: "why" }, { ic: "tag", label: "OFFER", sub: "price" }, { ic: "mouse-pointer-click", label: "CTA", sub: "act" }] },
          ...variants.map(([n, s], i) => ({
            t: "html",
            html: `<div class="eat-li" style="margin-bottom:7px"><span class="li-ic ${i === 0 ? "green" : "blue"}">${ic("film", 14)}</span><div style="flex:1"><div class="li-t">Variant ${i + 1} — ${n} · ~${Math.max(8, Math.round(secs * 0.72))}s speech</div><div class="li-d">${esc(s)}</div></div></div>`,
          })),
        ],
      };
    },
  });

  register("ugcScripts", {
    name: "UGC Script Generator", icon: "smartphone", group: "creative",
    desc: "Problem-first, storytelling, review-style, demo, unboxing, educational, comparison, reaction, founder. Local dialect adaptation.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "style", label: "Style", type: "select", def: "Problem-first", opts: ["Problem-first", "Storytelling", "Review-style", "Demonstration", "Unboxing", "Educational", "Comparison", "Reaction", "Founder-style"] },
      { key: "dialect", label: "Dialect", type: "select", def: "Algerian Darija", opts: ["Algerian Darija", "Moroccan Darija", "MSA", "French", "English"] },
    ],
    run(v) {
      const s = {
        "Problem-first": ["“Before this, I was wasting money every week.”", "show the problem → reveal product → demo → verdict"],
        "Storytelling": ["“My sister told me to try it. Honestly…”", "personal story → stumble → product as the fix → warm CTA"],
        "Review-style": ["“I was skeptical, but 3 weeks later…”", "honest review beats → specifics → price → COD reassurance"],
        "Demonstration": ["“Watch this.”", "pure demo, minimal talking, captions carry the message"],
        "Unboxing": ["“Ordered it Monday, got it Thursday.”", "unbox → first impression → verdict → delivery trust"],
        "Educational": ["“Here's what nobody tells you.”", "teach 1 thing → product as the tool → soft CTA"],
        "Comparison": ["“I tried the cheap one so you don't have to.”", "fair side-by-side → winner → offer"],
        "Reaction": ["“Wait… that actually works?”", "reaction moment → replay proof → CTA"],
        "Founder-style": ["“I built this because I was tired of…”", "founder story → mission → product → guarantee"],
      };
      const [hook, flow] = s[v.style] || s["Problem-first"];
      return {
        title: "UGC script — " + v.style + " · " + v.dialect,
        conf: { level: "medium", data: "Product, style, dialect", assumptions: ["Script is a frame — real creator will ad-lib naturally in " + v.dialect, "Never present this as a real customer unless a real customer agreed"], limitations: ["No transcript library connected"] },
        blocks: [
          { t: "hl", title: "Hook", html: hook },
          { t: "list", items: [
            { ic: "message-circle", t: "Dialogue", d: "Short spoken lines, 80% in " + esc(v.dialect) + ", on-screen text reinforcing key claims." },
            { ic: "video", t: "Scene & action", d: esc(flow) },
            { ic: "type", t: "On-screen text", d: "Price, delivery promise, and one word for each demo beat." },
            { ic: "mouse-pointer-click", t: "CTA", d: "“Order now — pay at the door.” (Delivery in 2-4 days.)" },
          ] },
        ],
      };
    },
  });

  register("hookLab", {
    name: "Hook Lab", icon: "fishing", group: "creative",
    desc: "50+ hook directions across 12 categories. Learns which hooks perform best once ad data is connected.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "cat", label: "Category", type: "select", def: "Problem", opts: ["Problem", "Curiosity", "Question", "Mistake", "Warning", "Benefit", "Transformation", "Demonstration", "Comparison", "Contrarian", "Story", "Social proof"] },
    ],
    run(v) {
      const banks = {
        Problem: ["This one thing ruins it every time.", "Stop wasting money on it.", "You're doing it wrong — here's why."],
        Curiosity: ["Nobody talks about this.", "I almost didn't post this.", "The 5-second test."],
        Question: ["Why does yours fail after a week?", "What would you pay to never deal with it again?", "Still using that old one?"],
        Mistake: ["The mistake everyone makes here.", "Don't buy it until you see this.", "I bought the wrong one first."],
        Warning: ["Wait — before you order anything…", "Don't fall for the cheap version.", "Warning: check the delivery before buying."],
        Benefit: ["Done in seconds, not hours.", "Your money's worth in the first week.", "The upgrade you actually feel."],
        Transformation: ["Before vs after — in 7 days.", "Day 1 vs Day 7.", "It changed how I use my kitchen."],
        Demonstration: ["Watch this.", "This is why I keep it.", "See the difference? It's real."],
        Comparison: ["The cheap one vs the right one.", "I tested both so you don't have to.", "Same price, not the same result."],
        Contrarian: ["You don't need a new one — you need the right one.", "More features isn't better.", "Stop buying based on ads."],
        Story: ["My sister ordered it. I was skeptical.", "Three weeks ago I almost gave up on it.", "This arrived Thursday — here's what happened."],
        "Social proof": ["3,200 buyers. One verdict.", "Everyone who tried it said the same thing.", "The reviews are suspiciously good. I checked."],
      };
      const hooks = banks[v.cat] || banks.Problem;
      return {
        title: "Hook Lab — " + v.cat,
        conf: { level: "low", data: "Category + product only", assumptions: ["Hooks are templates — A/B test them", "No ad data connected yet, so no 'winning' labels"], limitations: ["Performance learning starts once campaign data is attached"] },
        blocks: [
          { t: "list", items: hooks.map((h) => ({ ic: "fishing", t: h })) },
          { t: "tip", tone: "info", html: "Test 2-3 hooks per creative with the same body. Log the CTR/CPA winner — the lab remembers it." },
        ],
      };
    },
  });

  /* ============ AD AI ============ */
  register("adCopy", {
    name: "Ad Copy Generator", icon: "megaphone", group: "ad",
    desc: "Primary text, headline, description, CTA + variants. Scored on hook, clarity, relevance, credibility, intent.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "platform", label: "Platform", type: "select", def: "Facebook / Instagram", opts: ["Facebook / Instagram", "TikTok", "Snapchat"] },
      { key: "voice", label: "Brand voice", type: "text", def: ctx.voice },
    ],
    run(v) {
      return {
        title: "Ad copy — " + v.product,
        conf: { level: "medium", data: "Product, price, platform, voice", assumptions: ["Copy follows your saved brand voice", "Localize phrasing for the market"], limitations: ["Scores are heuristic, not live ad metrics"] },
        blocks: [
          { t: "scores", items: [
            { label: "Hook", v: "8/10", note: "problem-led open", tone: "good" },
            { label: "Clarity", v: "8/10", note: "one message", tone: "good" },
            { label: "Relevance", v: "7/10", note: "fits market", tone: "good" },
            { label: "Credibility", v: "7/10", note: "proof-based", tone: "good" },
            { label: "Intent", v: "8/10", note: "clear CTA", tone: "good" },
          ] },
          { t: "html", html: `<div class="fmla">
            <div class="fr"><span class="frl">Primary text</span><span class="frv b">“${esc(v.product)} — ${esc("proof first, then price")}.”</span></div>
            <div class="fr"><span class="frl">Headline</span><span class="frv">${esc(v.product)} · ${fmt(v.price)} DA</span></div>
            <div class="fr"><span class="frl">Description</span><span class="frv b">Cash on delivery · 2-4 day delivery</span></div>
            <div class="fr"><span class="frl">CTA</span><span class="frv g">Order now — pay at the door</span></div>
          </div>` },
          { t: "list", items: [
            { ic: "copy", t: "Variant — short", d: "“${esc(v.product)}. ${fmt(v.price)} DA. Pay when it arrives.”" },
            { ic: "copy", t: "Variant — story", d: "“Ordered it Monday. It's my favorite thing now. You pay only at the door.”" },
            { ic: "copy", t: "Variant — offer", d: "“Free delivery on your order of ${esc(v.product)} — today only, honest stock.”" },
          ] },
        ],
      };
    },
  });

  register("fbAnalyze", {
    name: "Facebook Ads Analyzer", icon: "facebook", group: "ad",
    desc: "Analyze spend, CPM, CTR, CPA, ROAS, frequency, conversions. Explains what's wrong, why, and what to test/scale/stop.",
    fields: [
      { key: "spend", label: "Spend (monthly)", type: "number", def: 300000, unit: ctx.currency },
      { key: "revenue", label: "Revenue", type: "number", def: 900000, unit: ctx.currency },
      { key: "orders", label: "Orders", type: "number", def: 120 },
      { key: "cpm", label: "CPM", type: "number", def: 2500, unit: ctx.currency },
      { key: "ctr", label: "CTR %", type: "number", def: 1.6, step: 0.1 },
      { key: "freq", label: "Frequency", type: "number", def: 2.4, step: 0.1 },
      { key: "cr", label: "Landing conversion %", type: "number", def: 2.2, step: 0.1 },
    ],
    run(v) {
      const cpa = v.spend / Math.max(1, v.orders);
      const roas = v.revenue / Math.max(1, v.spend);
      const issues = [];
      if (v.ctr < 1.5) issues.push(["Low CTR", "Weak hook / creative fatigue or wrong audience match."]);
      if (v.freq > 3) issues.push(["High frequency", "Audience is saturated — refresh creative or broaden."]);
      if (roas < 1.8) issues.push(["Low ROAS", "Either CPA too high or AOV/margin can't carry it."]);
      if (v.cpm > 3000) issues.push(["High CPM", "Competitive auction or stale audience."]);
      if (!issues.length) issues.push(["Healthy basics", "Keep testing to find scale without killing results."]);
      const profitRoas = roas * (1 - (ctx.cost / Math.max(1, ctx.price)));
      return {
        title: "Campaign analysis",
        conf: { level: "medium", data: "Spend, revenue, orders, CPM, CTR, freq, CR — as entered", assumptions: ["Margin uses your saved cost/price", "Blended numbers — not per-campaign"], limitations: ["No Meta connection — metrics are what you typed"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Blended CPA", v: fmt(cpa) + " " + ctx.currency, s: "spend ÷ orders", tone: cpa > ctx.price * 0.4 ? "red" : "gold" },
            { l: "ROAS", v: fmtN(roas, 2) + "x", s: "gross", tone: roas >= 2 ? "grn" : "red" },
            { l: "Profit ROAS", v: fmtN(profitRoas, 2) + "x", s: "after COGS", tone: profitRoas >= 1.3 ? "grn" : "red" },
            { l: "CTR", v: fmtN(v.ctr, 1) + "%", s: "ad quality signal", tone: v.ctr >= 2 ? "grn" : "gold" },
          ] },
          { t: "list", items: issues.map((i) => ({ ic: i[0] === "Healthy basics" ? "check-circle" : "alert-triangle", tone: i[0] === "Healthy basics" ? "green" : "amber", t: i[0], d: i[1] })) },
          { t: "hl", title: "Next move", html: roas >= 2 && issues.length <= 1 ? "Scale the winning campaign +20% weekly while watching CPM." : "Fix the top issue first, then re-test before any scale decision." },
          { t: "tip", tone: "warn", html: "<b>No irreversible actions without confirmation.</b> AI recommends — you decide." },
        ],
      };
    },
  });

  register("adDiagnose", {
    name: "Ad Diagnostic Tool", icon: "stethoscope", group: "ad",
    desc: "Diagnose one KPI at a time. Possible causes + tests. One KPI never proves a cause.",
    fields: [
      { key: "symptom", label: "Symptom", type: "select", def: "Low CTR", opts: ["High CPM", "Low CTR", "High CPC", "Low conversion", "High CPA", "Low ROAS", "High frequency", "Low delivery rate"] },
      { key: "detail", label: "Context (optional)", type: "text", def: "", ph: "e.g. started 5 days ago, new audience" },
    ],
    run(v) {
      const map = {
        "High CPM": { c: ["Competitive auction", "Narrow/stale audience", "Seasonal CPM spike"], t: ["Widen audience", "Refresh creative", "Compare placements"] },
        "Low CTR": { c: ["Weak hook in first 2s", "Creative fatigue", "Wrong audience match"], t: ["Test 2 new hooks", "Swap creative", "Try a new interest set"] },
        "High CPC": { c: ["Low relevance", "Crowded segment"], t: ["Improve hook-to-CTA match", "Test broader targeting"] },
        "Low conversion": { c: ["Landing page friction", "Offer weak", "Message mismatch ad vs page"], t: ["A/B the landing page", "Strengthen offer", "Align ad message to page"] },
        "High CPA": { c: ["Blend of weak CTR + low conversion", "Audience saturation"], t: ["Fix the funnel before bidding", "Cap spend while testing"] },
        "Low ROAS": { c: ["Margin can't carry CPA", "Poor retention of offer"], t: ["Check break-even CPA", "Improve AOV/offer"] },
        "High frequency": { c: ["Audience too small", "Creative fatigue"], t: ["Broaden audience", "Refresh creative"] },
        "Low delivery rate": { c: ["Budget not scaling", "Bid too low", "Restricted ad set"], t: ["Review delivery signals", "Reopen targeting"] },
      };
      const m = map[v.symptom] || map["Low CTR"];
      return {
        title: "Diagnosis — " + v.symptom,
        conf: { level: "medium", data: "Selected symptom" + (v.detail ? " + context" : ""), assumptions: ["Causes are ranked possibilities, not proof", "One KPI never proves a single cause"], limitations: ["No campaign-level data attached"] },
        blocks: [
          { t: "list", items: [
            { ic: "search", t: "Possible causes", d: m.c.join(" · ") },
            { ic: "flask-conical", t: "Recommended tests", d: m.t.join(" · ") },
          ] },
          { t: "tip", tone: "info", html: "Diagnose the funnel from top to bottom: CTR → conversion → CPA. Fix what leaks first." },
        ],
      };
    },
  });

  register("adTestGen", {
    name: "Ad Test Generator", icon: "flask-conical", group: "ad",
    desc: "A structured test: hypothesis, control, variant, KPIs, budget, duration, success & failure criteria.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "variable", label: "Variable to test", type: "select", def: "Hook", opts: ["Hook", "Creative", "Audience", "Offer", "Price", "Landing page", "CTA", "Angle"] },
      { key: "budget", label: "Test budget", type: "number", def: 30000, unit: ctx.currency },
      { key: "primary", label: "Primary KPI", type: "select", def: "CTR", opts: ["CTR", "CPA", "ROAS", "Conversion rate"] },
    ],
    run(v) {
      return {
        title: "Test — " + v.variable,
        conf: { level: "medium", data: "Variable, budget, KPI", assumptions: ["Control vs variant must differ by ONE variable only", "Test to significance before scaling"], limitations: ["Duration depends on volume — run until meaningful"] },
        blocks: [
          { t: "list", items: [
            { ic: "target", t: "Hypothesis", d: "Changing the " + v.variable.toLowerCase() + " will improve " + v.primary.toLowerCase() + " by ≥20% without hurting delivery." },
            { ic: "shield", t: "Control", d: "Current best " + v.variable.toLowerCase() + " — keep it running unchanged." },
            { ic: "git-branch", t: "Variant", d: "One new " + v.variable.toLowerCase() + " — nothing else changes." },
            { ic: "gauge", t: "Primary KPI", d: v.primary + " · Secondary: CPA + frequency (guardrails)." },
            { ic: "wallet", t: "Budget & duration", d: fmt(v.budget) + " " + ctx.currency + " split 50/50 · run until the KPI difference is clear (usually 5-10x the CPA in spend)." },
            { ic: "check-circle", tone: "green", t: "Success criteria", d: v.primary + " improves ≥20% AND delivery holds." },
            { ic: "x-circle", tone: "red", t: "Failure criteria", d: "No improvement within the budget, or guardrail KPIs break. Kill it — don't chase." },
          ] },
        ],
      };
    },
  });

  /* ============ LANDING PAGE AI ============ */
  register("landingBuilder", {
    name: "Landing Page Builder", icon: "layout-template", group: "landing",
    desc: "Full page structure: hero, problem, solution, benefits, features, demo, social proof, objections, FAQ, offer, CTA, COD form. Mobile-first.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "price", label: "Price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "offer", label: "Offer", type: "text", def: "Free delivery", ph: "e.g. Free delivery / bundle" },
      { key: "lang", label: "Language / RTL", type: "select", def: "Arabic (RTL)", opts: ["Arabic (RTL)", "French", "English"] },
    ],
    run(v) {
      return {
        title: "Landing page — " + v.product,
        conf: { level: "medium", data: "Product, price, offer, language", assumptions: ["Structure is mobile-first", "RTL for Arabic, LTR otherwise"], limitations: ["Copy blocks are placeholders to finalize"] },
        blocks: [
          { t: "list", items: [
            { ic: "image", t: "1 · Hero", d: "Product image + one benefit line + price + COD badge + single CTA above the fold." },
            { ic: "alert-triangle", t: "2 · Problem", d: "2-3 sentences the buyer instantly recognizes." },
            { ic: "package", t: "3 · Solution", d: "Product as the fix — one sentence, one visual." },
            { ic: "list-checks", t: "4 · Benefits", d: "3 benefits, each with a tiny icon. No walls of text." },
            { ic: "settings", t: "5 · Features", d: "Specs in a scannable grid for the 20% who read them." },
            { ic: "clapperboard", t: "6 · Demonstration", d: "Short video/loop showing the payoff — the conversion engine." },
            { ic: "users", t: "7 · Social proof", d: "Real reviews only — never fabricated. Count + quotes." },
            { ic: "shield-alert", t: "8 · Objections", d: "Quality, delivery time, returns — answered honestly." },
            { ic: "help-circle", t: "9 · FAQ", d: "6-8 real questions: price, delivery, COD, returns, warranty." },
            { ic: "gift", t: "10 · Offer", d: v.offer + " framed with real conditions — no fake urgency." },
            { ic: "mouse-pointer-click", t: "11 · CTA + COD form", d: "Name, phone, wilaya, address. One action, repeated at scroll." },
          ] },
          { t: "tip", tone: "info", html: "Mobile-first in " + v.lang + ". Every block answers one question a buyer actually has." },
        ],
      };
    },
  });

  register("landingAnalyzer", {
    name: "Landing Page Analyzer", icon: "scan-eye", group: "landing",
    desc: "Analyze a URL, screenshot or pasted HTML: headline, offer, trust, CTA, structure, friction. Outputs a conversion score /100.",
    fields: [
      { key: "url", label: "URL or description", type: "text", def: "", ph: "Paste a URL or describe the page" },
      { key: "notes", label: "Page notes", type: "textarea", def: "", ph: "Headline, offer, sections you can see…", rows: 4 },
    ],
    run(v) {
      const score = 64;
      return {
        title: "Landing page analysis",
        conf: { level: "low", data: "URL/notes you provided", assumptions: ["Without the real page this is a framework, not a verdict", "Attach a screenshot for a vision-based analysis"], limitations: ["No vision provider connected yet"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Conversion score", v: score + "/100", s: "structural estimate", tone: score >= 75 ? "grn" : score >= 55 ? "gold" : "red" },
          ] },
          { t: "list", items: [
            { ic: "type", t: "Headline", d: "Must state the benefit + object of the product in under 8 words." },
            { ic: "gift", t: "Offer", d: "Must be visible without scrolling; price + COD badge prominent." },
            { ic: "shield-check", t: "Trust", d: "Real reviews, delivery promise, return policy — near the CTA." },
            { ic: "mouse-pointer-click", t: "CTA", d: "One action, repeated, contrast color, above the fold." },
            { ic: "smartphone", t: "Mobile UX", d: "Single column, big tap targets, no popup that blocks the CTA." },
            { ic: "message-square", t: "Message match", d: "The ad promise and the page promise must be identical." },
          ] },
          { t: "hl", title: "Priority fixes", html: "1) Move the COD + price badge up. 2) Cut any popup that appears before the CTA. 3) Add one demo visual above the fold." },
        ],
      };
    },
  });

  /* ============ OFFER AI ============ */
  register("offerBuilder", {
    name: "Offer Builder", icon: "gift", group: "offer",
    desc: "Discount, bundle, buy 2 / buy 3, free shipping, gift, premium & starter packages — with the economics of each. No fake scarcity.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "price", label: "Base price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "cost", label: "Unit cost", type: "number", def: ctx.cost, unit: ctx.currency },
      { key: "goal", label: "Goal", type: "select", def: "Raise AOV", opts: ["Raise AOV", "Increase conversion", "Clear stock", "Premium positioning"] },
    ],
    run(v) {
      const m = (v.price - v.cost) / v.price;
      const offers = [
        { n: "Buy 2", d: "2 × " + fmt(v.price) + " DA, margin " + pct(m, 0) + " each. Simplest AOV raise — 0 discount needed." },
        { n: "Buy 3", d: "3 × " + fmt(v.price) + " DA + free delivery. Big AOV, bigger cash commitment — test willingness first." },
        { n: "Free shipping threshold", d: "Free delivery over " + fmt(Math.round(v.price * 1.5)) + " DA. Quietly raises AOV without discounting." },
        { n: "Bundle", d: "Product + complement at " + fmt(Math.round(v.price * 1.7)) + " DA. Feels like a deal, margin holds." },
        { n: "Small gift", d: "Free accessory with order. Cheaper than a discount at " + fmt(Math.round(v.cost * 0.35)) + " DA cost." },
      ];
      return {
        title: "Offer directions — " + v.product,
        conf: { level: "medium", data: "Base price, cost, goal", assumptions: ["Unit cost is your number", "No scarcity claims are generated — ever"], limitations: ["AOV uplift must be measured, not assumed"] },
        blocks: [
          { t: "hl", title: "Goal: " + v.goal, html: v.goal === "Raise AOV" ? "Bundle or buy-2 with free-shipping threshold." : v.goal === "Increase conversion" ? "Free shipping + small gift, low perceived risk." : v.goal === "Clear stock" ? "Buy-2 on the slow movers with the honest framing." : "Premium bundle — no discount, add guarantee." },
          { t: "list", items: offers.map((o) => ({ ic: "gift", t: o.n, d: o.d })) },
          { t: "tip", tone: "warn", html: "<b>Honesty rule:</b> no fake countdowns, fake stock, or fabricated scarcity. Ever." },
        ],
      };
    },
  });

  register("pricingAI", {
    name: "Pricing AI", icon: "tags", group: "offer",
    desc: "Break-even, minimum/target/premium price, max CAC, profit per order, gross & net margin.",
    fields: [
      { key: "cost", label: "Product cost", type: "number", def: ctx.cost, unit: ctx.currency },
      { key: "shipping", label: "Delivery + COD costs", type: "number", def: ctx.shipping, unit: ctx.currency },
      { key: "ad", label: "Ad cost per order (CAC)", type: "number", def: 900, unit: ctx.currency },
      { key: "returns", label: "Returned order cost", type: "number", def: 500, unit: ctx.currency },
      { key: "dr", label: "Delivery rate %", type: "number", def: ctx.dr },
    ],
    run(v) {
      const dr = v.dr / 100 || 0.65;
      const be = (v.cost + v.shipping + v.ad + v.returns * (1 - dr)) / dr;
      const target = be * 1.35;
      return {
        title: "Pricing & unit economics",
        conf: { level: "medium", data: "Cost, shipping, CAC, returns, DR", assumptions: ["Delivery rate is your estimate", "CAC is per order, blended"], limitations: ["No real accounting data attached"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Break-even price", v: fmt(Math.ceil(be)) + " DA", s: "zero profit", tone: "red" },
            { l: "Target price", v: fmt(Math.ceil(target)) + " DA", s: "+35% headroom", tone: "gold" },
            { l: "Min viable price", v: fmt(Math.ceil(be * 1.1)) + " DA", s: "+10% buffer", tone: "gold" },
            { l: "Premium price", v: fmt(Math.ceil(be * 1.6)) + " DA", s: "if brand allows", tone: "blu" },
            { l: "Max CAC", v: fmt(Math.max(0, Math.round(be * 1.35 - v.cost - v.shipping))) + " DA", s: "at target price", tone: "blu" },
          ] },
          { t: "hl", title: "Read", html: "At " + fmt(Math.ceil(target)) + " DA you carry ~35% headroom over break-even after delivery, COD and returns are priced in." },
          { t: "tip", tone: "info", html: "Returns are the silent killer — a " + fmtN((1 - dr) * 100, 0) + "% undelivered rate adds roughly " + fmt(Math.round(v.returns * (1 - dr) / Math.max(0.01, dr))) + " DA to every delivered order's true cost." },
        ],
      };
    },
  });

  /* ============ SALES AI ============ */
  register("salesCopilot", {
    name: "Sales Copilot", icon: "headphones", group: "sales",
    desc: "Analyze a conversation and get next reply, objection response, upsell, cross-sell, follow-up, and intent.",
    fields: [
      { key: "convo", label: "Customer conversation", type: "textarea", def: "", ph: "Paste the chat…", rows: 4 },
      { key: "product", label: "Product", type: "text", def: ctx.product },
    ],
    run(v) {
      const text = (v.convo || "").toLowerCase();
      let intent = "Warm", reason = "Interest shown but no commitment yet";
      if (/price|cost|how much/.test(text)) { intent = "Warm"; reason = "asking about price — buying signal"; }
      if (/delivery|arrive|when/.test(text)) { intent = "Hot"; reason = "asking logistics — close to order"; }
      if (/no |not interested|stop/.test(text)) { intent = "Not interested"; reason = "explicit rejection"; }
      if (!(v.convo || "").trim()) { intent = "Unknown"; reason = "no conversation pasted"; }
      return {
        title: "Sales copilot",
        conf: { level: intent === "Unknown" ? "low" : "medium", data: (v.convo || "").trim() ? "The pasted conversation" : "No conversation", assumptions: ["Intent is keyword-based — treat as a hint", "Replies are templates to personalize"], limitations: ["No historical chat data connected"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Intent", v: intent, s: reason, tone: intent === "Hot" ? "grn" : intent === "Warm" ? "gold" : intent === "Not interested" ? "red" : "blu" },
          ] },
          { t: "list", items: [
            { ic: "message-circle", t: "Next reply", d: "Confirm the benefit, answer their exact question, then give ONE next step (order or call)." },
            { ic: "shield-alert", t: "Objection response", d: "Acknowledge → evidence → risk removal (COD + return promise)." },
            { ic: "trending-up", t: "Upsell", d: "Offer the bundle version once — only if it fits their need." },
            { ic: "layers", t: "Cross-sell", d: "One complementary product, after the first question is resolved." },
            { ic: "clock", t: "Follow-up", d: intent === "Hot" ? "Follow up in 2 hours if no reply." : intent === "Warm" ? "Follow up tomorrow with a short reminder." : "Re-engage in 7 days with new value — no spam." },
          ] },
        ],
      };
    },
  });

  register("launchPlan", {
    name: "Product Launch Plan", icon: "rocket", group: "sales",
    desc: "Day-by-day launch: pre-launch, creative prep, landing page, offer, testing, ads, COD, retargeting, follow-up.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "days", label: "Launch window (days)", type: "number", def: 14 },
      { key: "budget", label: "Launch budget", type: "number", def: ctx.budget, unit: ctx.currency },
    ],
    run(v) {
      const d = clamp(Number(v.days) || 14, 7, 60);
      const perDay = v.budget / d;
      return {
        title: "Launch plan — " + v.product + " (" + d + " days)",
        conf: { level: "medium", data: "Product, days, budget", assumptions: ["Plan is a sequence to adapt", "Daily budget ≈ " + fmt(perDay) + " " + ctx.currency ], limitations: ["No historical launch data — review after each phase"] },
        blocks: [
          { t: "list", items: [
            { ic: "calendar", t: "Days 1-3 · Pre-launch", d: "Finalize product, pricing, supplier stock, and honest delivery promise." },
            { ic: "clapperboard", t: "Days 3-5 · Creative prep", d: "Produce 2 concepts (demo + UGC) + the landing page skeleton." },
            { ic: "layout-template", t: "Days 5-7 · Landing + offer", d: "Build the page, set the offer (free delivery or bundle), test checkout on a real phone." },
            { ic: "flask-conical", t: "Days 7-9 · Testing", d: "Run 2 ads head-to-head at ~" + fmt(perDay) + " DA/day. Kill below the guardrail." },
            { ic: "megaphone", t: "Days 9-11 · Scale winner", d: "Scale the winning ad +20% daily while watching CPM and delivery rate." },
            { ic: "truck", t: "Days 11-14 · COD + retarget", d: "Confirm every order by phone, prep retargeting for visitors, plan follow-ups." },
          ] },
        ],
      };
    },
  });

  /* ============ COD AI ============ */
  register("codOptimizer", {
    name: "COD Optimizer", icon: "truck", group: "cod",
    desc: "Orders → confirmation → delivery → returns. Confirmation rate, delivery rate, cancellation, returns, delivered CPA, profit per delivered order.",
    fields: [
      { key: "orders", label: "Orders", type: "number", def: 500 },
      { key: "confirmed", label: "Confirmed", type: "number", def: 330 },
      { key: "delivered", label: "Delivered", type: "number", def: 210 },
      { key: "returned", label: "Returned", type: "number", def: 40 },
      { key: "spend", label: "Ad spend", type: "number", def: 420000, unit: ctx.currency },
      { key: "price", label: "Sell price", type: "number", def: ctx.price, unit: ctx.currency },
      { key: "cost", label: "Cost per unit", type: "number", def: ctx.cost, unit: ctx.currency },
    ],
    run(v) {
      const cr = v.confirmed / Math.max(1, v.orders) * 100;
      const dr = v.delivered / Math.max(1, v.confirmed) * 100;
      const ret = v.returned / Math.max(1, v.confirmed) * 100;
      const deliveredCpa = v.spend / Math.max(1, v.delivered);
      const profitPer = v.price - v.cost - deliveredCpa;
      return {
        title: "COD funnel analysis",
        conf: { level: "medium", data: "Orders, confirmed, delivered, returned, spend, price, cost", assumptions: ["Returned parcels lose their full value in this calc", "You are looking at one campaign window"], limitations: ["No city/campaign segmentation connected"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Confirmation rate", v: pct(cr, 0), s: "orders → confirmed", tone: cr >= 60 ? "grn" : cr >= 50 ? "gold" : "red" },
            { l: "Delivery rate", v: pct(dr, 0), s: "confirmed → delivered", tone: dr >= 65 ? "grn" : dr >= 55 ? "gold" : "red" },
            { l: "Cancellation", v: pct(100 - cr, 0), s: "at confirmation", tone: "gold" },
            { l: "Return rate", v: pct(ret, 0), s: "confirmed → returned", tone: ret <= 15 ? "grn" : ret <= 25 ? "gold" : "red" },
            { l: "Delivered CPA", v: fmt(deliveredCpa) + " DA", s: "spend ÷ delivered", tone: deliveredCpa > v.price * 0.4 ? "red" : "gold" },
            { l: "Profit / delivered", v: fmt(profitPer) + " DA", s: "after COGS + ads", tone: profitPer >= 0 ? "grn" : "red" },
          ] },
          { t: "hl", title: "Where it leaks", html: (100 - cr) >= 40 ? "Confirmation is the big leak — improve phone confirmation + trust signals." : ret >= 25 ? "Returns are the big leak — check high-risk wilayas and weak-qualification." : dr < 60 ? "Delivery is the leak — review wilaya coverage and courier choice." : "Funnel is healthy — focus on scaling." },
          { t: "tip", tone: "info", html: "Confirmed leads cost nothing to ship; returned parcels cost double. Kill what returns, reward what delivers." },
        ],
      };
    },
  });

  register("codOrderAnalyzer", {
    name: "COD Order Analyzer", icon: "map-pin", group: "cod",
    desc: "Paste order lines (city, campaign, status) and find patterns. Uses only actual data.",
    fields: [
      { key: "lines", label: "Order lines (city · campaign · status)", type: "textarea", def: "Algiers · Camp A · delivered\nOran · Camp A · returned\nSetif · Camp B · delivered\nBlida · Camp A · cancelled\nConstantine · Camp B · returned\nAlgiers · Camp B · delivered", rows: 5 },
    ],
    run(v) {
      const lines = (v.lines || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
      let delivered = 0, returned = 0, cancelled = 0;
      lines.forEach((l) => { if (/delivered/i.test(l)) delivered++; else if (/returned/i.test(l)) returned++; else if (/cancelled|cancel/i.test(l)) cancelled++; });
      return {
        title: "Order patterns",
        conf: { level: "medium", data: lines.length + " order lines you pasted", assumptions: ["Only the pasted lines are used — nothing else", "Status keywords: delivered / returned / cancelled"], limitations: ["No live ERP/Meta connection"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Lines read", v: lines.length, s: "parsed", tone: "blu" },
            { l: "Delivered", v: delivered, s: "actual data", tone: "grn" },
            { l: "Returned", v: returned, s: "actual data", tone: "red" },
            { l: "Cancelled", v: cancelled, s: "actual data", tone: "gold" },
          ] },
          { t: "hl", title: "Pattern found", html: returned >= 2 ? "Returns cluster in your data — check those cities/campaigns against delivery coverage before scaling them." : "No clear pattern yet — feed more lines (city · campaign · status) and rerun." },
          { t: "tip", tone: "info", html: "Only actual data is used. The AI never invents orders." },
        ],
      };
    },
  });

  /* ============ CUSTOMER AI ============ */
  register("supportCopilot", {
    name: "Customer Support Copilot", icon: "life-buoy", group: "customer",
    desc: "Generate responses for product, price, shipping, COD, delivery, returns, refunds, complaints. Uses actual product info; never invents policies.",
    fields: [
      { key: "topic", label: "Topic", type: "select", def: "Delivery time", opts: ["Product question", "Price", "Shipping / delivery", "COD", "Returns / refunds", "Complaint", "Product usage"] },
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "lang", label: "Language", type: "select", def: "Arabic / Darija", opts: ["Arabic / Darija", "French", "English"] },
    ],
    run(v) {
      const replies = {
        "Delivery time": ["Thank you for asking! Orders are delivered in 2-4 business days.", "You pay only when the parcel arrives. You'll receive a tracking call."],
        "COD": ["Yes — you pay cash on delivery, at your door.", "No prepayment is needed. Just order and pay when it arrives."],
        "Returns / refunds": ["I'll check our return policy for you (real policy must be attached).", "We never invent policies — the exact terms come from your settings."],
        "Product question": ["Based on the product info: " + ctx.product + " is designed for the use you described.", "If I'm unsure about specs, I'll ask the team rather than guess."],
        "Price": ["The price is " + fmt(ctx.price) + " " + ctx.currency + ", cash on delivery.", "Delivery is " + (ctx.shipping ? "included in the offer" : "per the checkout") + "."],
        "Complaint": ["I understand — let me fix this for you.", "I've logged it with the team and will follow up within the hour."],
        "Product usage": ["Quick guide: use it as shown in the demo video.", "If something isn't clear, I'll get a human to help."],
      };
      return {
        title: "Support reply — " + v.topic,
        conf: { level: "medium", data: "Topic + your product context", assumptions: ["Replies are templates — adapt to the real situation", "Policies shown must come from actual policy data"], limitations: ["No policy/order data connected — never invent policies"] },
        blocks: [
          { t: "list", items: replies[v.topic].map((r) => ({ ic: "message-circle", t: "Draft (in " + v.lang + ")", d: r })) },
          { t: "tip", tone: "warn", html: "<b>Rule:</b> always use actual product information. Never invent policies, prices, or promises." },
        ],
      };
    },
  });

  register("whatsappAI", {
    name: "WhatsApp / Messaging AI", icon: "message-circle", group: "customer",
    desc: "Order confirmation, follow-up, abandoned cart, delivery reminder, review request, upsell, win-back. Templates — nothing auto-sent.",
    fields: [
      { key: "type", label: "Message type", type: "select", def: "Order confirmation", opts: ["Order confirmation", "Follow-up", "Abandoned cart", "Delivery reminder", "Review request", "Upsell", "Win-back"] },
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "lang", label: "Language", type: "select", def: "Arabic / Darija", opts: ["Arabic / Darija", "French", "English"] },
    ],
    run(v) {
      const msgs = {
        "Order confirmation": ["Salam! We received your order for " + ctx.product + " ✅", "We'll call you to confirm before shipping. You pay cash on delivery."],
        "Follow-up": ["Hi! Quick question about your order — everything OK?", "If you need help, reply here, we're online."],
        "Abandoned cart": ["You left a " + ctx.product + " in your cart 👀", "Order now and pay at the door — no prepayment."],
        "Delivery reminder": ["Your parcel arrives tomorrow 📦", "Have your payment ready — cash on delivery."],
        "Review request": ["How was your " + ctx.product + "?", "A quick review helps other buyers trust us."],
        "Upsell": ["You loved the " + ctx.product + " — the bundle version is available.", "Same delivery, bigger value."],
        "Win-back": ["It's been a while! We have a new batch of " + ctx.product + ".", "Reply with your city and we'll check stock."],
      };
      return {
        title: "WhatsApp template — " + v.type,
        conf: { level: "medium", data: "Type + product", assumptions: ["Templates are in " + v.lang + " — localize the exact wording", "Emojis kept minimal"], limitations: ["Nothing is sent automatically — templates only"] },
        blocks: [
          { t: "list", items: msgs[v.type].map((m) => ({ ic: "message-circle", t: "Line", d: m })) },
          { t: "tip", tone: "info", html: "<b>Never send automatically</b> unless the user explicitly enables it." },
        ],
      };
    },
  });

  /* ============ BUSINESS AI ============ */
  register("strategist", {
    name: "Business Strategist", icon: "compass", group: "business",
    desc: "Should you scale? Change product/offer/creative/price? Expand market? What next? Evidence-based — not vibes.",
    fields: [
      { key: "question", label: "Question", type: "select", def: "Should I scale?", opts: ["Should I scale?", "Change the product?", "Change the offer?", "Change the creative?", "Change the price?", "Expand the market?", "What should I do next?"] },
      { key: "detail", label: "Situation notes (optional)", type: "textarea", def: "", ph: "Current spend, margins, what's working/failing…", rows: 3 },
    ],
    run(v) {
      const margin = (ctx.price - ctx.cost) / ctx.price;
      const q = v.question;
      const answers = {
        "Should I scale?": { c: margin >= 0.4 && ctx.cr >= 55 ? "SCALE — but test 2x first" : "HOLD — fix unit economics first", w: "Margin is " + pct(margin, 0) + " and CR is " + ctx.cr + "%. Scale only if both hold at +20% spend." },
        "Change the product?": { c: "RESEARCH MORE", w: "Don't swap products on a hunch — compare scores and test the new one head-to-head." },
        "Change the offer?": { c: "TEST A NEW OFFER", w: "A bundle or free-shipping test is cheaper than a product change and directly lifts AOV." },
        "Change the creative?": { c: "ITERATE CREATIVE", w: "Creative is the cheapest lever — refresh hooks before touching anything else." },
        "Change the price?": { c: "TEST PRICE ±10%", w: "Your margin (" + pct(margin, 0) + ") gives room to test a price move with a clear KPI." },
        "Expand the market?": { c: "RESEARCH MORE", w: "Expansion needs market data + logistics validation before any commitment." },
        "What should I do next?": { c: "FIX THE BIGGEST LEAK", w: "Run the COD optimizer first — returns and confirmation usually leak more than ads." },
      };
      const a = answers[q] || answers["What should I do next?"];
      return {
        title: "Strategy — " + q,
        conf: { level: "medium", data: "Saved business context + your notes", assumptions: ["Recommendation is directional, not a guarantee", "Context numbers (margin " + pct(margin, 0) + ", CR " + ctx.cr + "%) drive it"], limitations: ["No live P&L connected"] },
        blocks: [
          { t: "decision", choice: a.c, why: a.w + " " + (v.detail ? "Notes considered: " + esc(v.detail) : "") },
          { t: "tip", tone: "info", html: "Every decision states its evidence. If the evidence is missing, the answer is RESEARCH MORE — not guesswork." },
        ],
      };
    },
  });

  register("dailyBriefing", {
    name: "Daily AI Briefing", icon: "sunrise", group: "business",
    desc: "Today's e-commerce briefing + top 5 actions, ranked by impact, urgency and confidence.",
    fields: [
      { key: "focus", label: "Focus today", type: "text", def: "", ph: "e.g. launch, scale, fix COD…" },
    ],
    run(v) {
      const margin = (ctx.price - ctx.cost) / ctx.price;
      const actions = [
        { a: "Confirm yesterday's COD orders by phone", imp: 9, urg: 8, conf: "high" },
        { a: "Review the highest-return wilaya and pause ads there", imp: 8, urg: 7, conf: "medium" },
        { a: "Check today's creative performance (CTR/CPA)", imp: 7, urg: 6, conf: "high" },
        { a: "Prep one new hook test if CTR dropped 20%+", imp: 7, urg: 5, conf: "medium" },
        { a: "Update stock + plan next supplier order", imp: 6, urg: 6, conf: "medium" },
      ];
      return {
        title: "Today's briefing" + (v.focus ? " — focus: " + v.focus : ""),
        conf: { level: "medium", data: "Saved business context (price, cost, CR, DR)", assumptions: ["Actions are generated from your context", "Ranking = impact × urgency × confidence"], limitations: ["No live order/stock data connected"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Margin", v: pct(margin, 0), s: "current", tone: margin >= 0.4 ? "grn" : "gold" },
            { l: "Confirmation rate", v: ctx.cr + "%", s: "saved value", tone: ctx.cr >= 60 ? "grn" : "gold" },
            { l: "Delivery rate", v: ctx.dr + "%", s: "saved value", tone: ctx.dr >= 60 ? "grn" : "gold" },
            { l: "Market", v: esc(ctx.market || "—"), s: "saved", tone: "blu" },
          ] },
          { t: "list", items: actions.map((x, i) => ({ ic: ["zap", "target", "gauge", "flask-conical", "package"][i], t: (i + 1) + " · " + x.a, d: "Impact " + x.imp + "/10 · Urgency " + x.urg + "/10 · Confidence " + x.conf + "" })) },
        ],
      };
    },
  });

  register("aiMemory", {
    name: "AI Memory & Learning", icon: "brain", group: "business",
    desc: "What the system remembers about your winners — and only draws conclusions when there is enough data.",
    fields: [
      { key: "note", label: "Learn from", type: "text", def: "", ph: "e.g. what made the last campaign win" },
      { key: "kind", label: "Category", type: "select", def: "Creative", opts: ["Product", "Creative", "Hook", "Offer", "Price", "Audience", "Campaign"] },
    ],
    run(v) {
      const mem = memory[v.kind.toLowerCase()] || [];
      const learned = v.note ? { kind: v.kind, note: v.note, ts: Date.now() } : null;
      if (learned) {
        memory[v.kind.toLowerCase()] = [learned].concat(memory[v.kind.toLowerCase()] || []).slice(0, 20);
        store.set("memory", memory);
      }
      return {
        title: "Memory & learning",
        conf: { level: "medium", data: v.note ? "New entry saved: " + v.kind + " — " + v.note : mem.length + " stored entries", assumptions: ["Conclusions only when ≥3 similar entries exist", "Entries are your reported learnings"], limitations: ["No automated outcome tracking connected"] },
        blocks: [
          { t: "list", items: mem.slice(0, 6).map((m) => ({ ic: "brain", t: (m.kind || "Learn") + (m.ts ? " · " + new Date(m.ts).toLocaleDateString() : ""), d: m.note })) },
          { t: "hl", title: "Current inference", html: mem.length >= 3 ? "Pattern: your " + v.kind.toLowerCase() + " winners share clear traits — reuse them deliberately." : "Not enough data yet (" + mem.length + "/3) — keep logging learnings before trusting patterns." },
        ],
      };
    },
  });

  register("automationBuilder", {
    name: "AI Automation Builder", icon: "workflow", group: "business",
    desc: "IF → condition → THEN action. Trigger business rules on your data.",
    fields: [
      { key: "if", label: "IF", type: "select", def: "Product score > 80", opts: ["Product score > 80", "CTR drops 30%", "Stock < reorder point", "Order cancelled", "Product becomes profitable"] },
      { key: "action", label: "THEN action", type: "select", def: "Create a task", opts: ["Create a task", "Notify me", "Add to testing list", "Create follow-up", "Create scaling plan"] },
    ],
    run(v) {
      return {
        title: "Automation rule",
        conf: { level: "high", data: "Your selected IF + THEN", assumptions: ["Rule fires on connected data — wiring is required"], limitations: ["Demo mode shows the rule, doesn't execute it"] },
        blocks: [
          { t: "hl", title: "Rule", html: "IF " + v.if + " → THEN " + v.action + "." },
          { t: "list", items: [
            { ic: "circle-check", t: "Condition", d: v.if },
            { ic: "zap", t: "Action", d: v.action },
            { ic: "shield-check", t: "Guardrail", d: "Actions never spend or delete without confirmation." },
          ] },
        ],
      };
    },
  });

  register("workflowBuilder", {
    name: "AI Workflow Builder", icon: "git-branch", group: "business",
    desc: "The connected product workflow — one product flows through analysis to decision.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
    ],
    run(v) {
      return {
        title: "Product workflow — " + v.product,
        conf: { level: "high", data: "Product name", assumptions: ["Steps are the standard connected loop"], limitations: ["Live tracking requires data wiring"] },
        blocks: [
          { t: "flow", steps: [
            { ic: "package", label: "NEW PRODUCT", sub: v.product },
            { ic: "search", label: "ANALYZE", sub: "product analyzer" },
            { ic: "swords", label: "COMPETITORS", sub: "research" },
            { ic: "tags", label: "PRICE", sub: "pricing AI" },
            { ic: "gift", label: "OFFER", sub: "offer builder" },
            { ic: "palette", label: "CREATIVES", sub: "creative lab" },
            { ic: "megaphone", label: "AD COPY", sub: "ad copy" },
            { ic: "layout-template", label: "LANDING", sub: "landing builder" },
            { ic: "flask-conical", label: "TEST PLAN", sub: "ad test" },
            { ic: "chart-line", label: "TRACK", sub: "results" },
            { ic: "compass", label: "AI DECISION", sub: "strategist" },
          ] },
        ],
      };
    },
  });

  register("decisionEngine", {
    name: "Final AI Decision Engine", icon: "corner-down-right", group: "business",
    desc: "At the end of any analysis: TEST / ITERATE / SCALE / RESEARCH MORE / CHANGE X / STOP — with why, evidence, next test.",
    fields: [
      { key: "product", label: "Product", type: "text", def: ctx.product },
      { key: "margin", label: "Margin %", type: "number", def: 42 },
      { key: "roas", label: "ROAS", type: "number", def: 2.1, step: 0.1 },
      { key: "returns", label: "Return rate %", type: "number", def: 18 },
      { key: "budget", label: "Weekly budget", type: "number", def: 80000, unit: ctx.currency },
    ],
    run(v) {
      let choice, why;
      if (v.roas >= 2 && v.margin >= 35 && v.returns <= 20) { choice = "SCALE"; why = "Healthy ROAS (" + v.roas + "x), margin (" + v.margin + "%) and acceptable returns (" + v.returns + "%). Scale +20% weekly and re-check the guardrails."; }
      else if (v.margin < 25) { choice = "FIX ECONOMICS"; why = "Margin (" + v.margin + "%) is too thin to carry ad cost — fix price/offer before scaling."; }
      else if (v.returns > 25) { choice = "FIX COD"; why = "Returns (" + v.returns + "%) are eroding profit — tighten confirmation and wilaya targeting."; }
      else if (v.roas < 1.8) { choice = "RESEARCH MORE"; why = "ROAS (" + v.roas + "x) is below break-even for your margin — diagnose before spending more."; }
      else { choice = "TEST"; why = "Balanced numbers — run a controlled A/B test before any bigger move."; }
      return {
        title: "Decision — " + v.product,
        conf: { level: "medium", data: "Margin, ROAS, returns, budget as entered", assumptions: ["Decision uses thresholds we set together", "It is a recommendation — you decide"], limitations: ["Not a guarantee of outcome"] },
        blocks: [
          { t: "decision", choice, why: why + " · Evidence: ROAS " + v.roas + "x, margin " + v.margin + "%, returns " + v.returns + "%." },
          { t: "tip", tone: "info", html: "What result would change the decision? State it now (e.g. ROAS above 2.2 for a week) before acting." },
        ],
      };
    },
  });

  /* ============ CHAT (business assistant) ============ */
  function chatReply(text) {
    const t = text.toLowerCase();
    if (/why did my sales drop|sales drop|profit decrease|profit decreased/.test(t)) return "Sales drop usually comes from one of four leaks: confirmation rate, delivery rate, creative fatigue, or audience saturation. Run the COD Optimizer and Ad Analyzer with your real numbers — the leaks will show up as numbers, not opinions.";
    if (/what product/.test(t) || /which product/.test(t)) return "Head to Product Winner Finder. Candidate scores are hypotheses — the real validation is a small-budget test with a clear kill rule.";
    if (/create.*ad|ad for this product|facebook ad/.test(t)) return "Use Ad Copy Generator for the copy, Hook Lab for openers, then Ad Test Generator to structure the test. One variable at a time.";
    if (/ugc|creative/.test(t)) return "UGC Script Generator + Creative Lab. Pick 2 concepts max, never fabricate testimonials, and let ad data pick the winner.";
    if (/offer|bundle/.test(t)) return "Offer Builder will price bundles and free-shipping thresholds against your margin — with the economics, not just the copy.";
    if (/cancel|cod|return/.test(t)) return "COD Optimizer will break down confirmation, delivery and return rates from your real order numbers — that's where COD answers live.";
    if (/campaign|roas|cpm|ctr/.test(t)) return "Facebook Ads Analyzer turns your spend/revenue into CPA, ROAS and profit ROAS, then tells you what to test, scale and stop.";
    if (/what should i do|next step|tomorrow/.test(t)) return "Daily Briefing ranks today's top 5 actions by impact, urgency and confidence. Start with the one that fixes the biggest leak.";
    if (/competitor|market/.test(t)) return "Competitor Research + Market Opportunity Report. Everything unverified stays INFERRED — never present guesses as facts.";
    if (/hello|hi|salam|help/.test(t)) return "I'm your e-commerce AI workspace. Ask me about products, ads, offers, COD, competitors or strategy — or type what you want to do and I'll route you to the right tool.";
    return "I'll route that to the right tool: product analysis, winner finder, ad copy, UGC, offers, COD, competitors, or strategy. If you paste real numbers (spend, orders, confirmed, delivered, returned), I can analyze them honestly.";
  }

  function openChat() { navigate("chat", null); }

  /* ============ PROJECTS / TEMPLATES / HISTORY ============ */
  function renderProjects() {
    return `
      <div class="bd-card">
        <div class="card-head"><span class="tool-ic">${ic("folder-kanban", 18)}</span><div><div class="card-title">My Projects</div><div class="card-sub">One connected workspace per product: analysis → persona → competitors → offer → creative → ad → landing → test → results.</div></div></div>
        <div class="fld"><label class="flbl">New project — product name</label><input class="input" id="proj-name" placeholder="e.g. Kitchen gadget launch" style="margin-bottom:9px"></div>
        <button class="btn btn-p btn-sm" id="proj-add">${ic("plus", 13)} Create project</button>
      </div>
      <div id="proj-list"></div>`;
  }

  function drawProjects() {
    const host = $("proj-list");
    if (!host) return;
    if (!projects.length) { host.innerHTML = `<div class="empty">${ic("folder-open", 26)} No projects yet — create your first one.</div>`; return; }
    host.innerHTML = projects.map((p) => `
      <div class="proj-card">
        <div class="p-head">
          <div class="p-name">${esc(p.name)}</div>
          <div class="flex items-center gap-2">
            <span class="pill ${p.status === "live" ? "green" : "gray"}">${esc(p.status || "draft")}</span>
            <button class="btn btn-g btn-sm" data-proj-del="${p.id}">${ic("trash-2", 12)}</button>
          </div>
        </div>
        <div class="proj-chain">
          ${["Analysis", "Persona", "Competitors", "Offer", "Creative", "Ad copy", "Landing", "Test plan", "Results"].map((s, i) => `
            ${i ? `<span class="chain-arrow">→</span>` : ""}<span class="chain-el" data-chain="${i}">${ic(["search", "users", "swords", "gift", "palette", "megaphone", "layout-template", "flask-conical", "chart-line"][i], 11)} ${s}</span>`).join("")}
        </div>
      </div>`).join("");
    icons();
  }

  /* ============ SETTINGS / context ============ */
  function renderSettings() {
    return `
      <div class="bd-card">
        <div class="card-head"><span class="tool-ic">${ic("settings", 18)}</span><div><div class="card-title">Settings</div><div class="card-sub">AI providers, model routing, cost control, and your persistent business context.</div></div></div>
        <div class="sec-h">${ic("database", 15)} AI Business Context</div>
        <div class="ctx-grid">
          ${[["business", "Business name"], ["brand", "Brand"], ["country", "Country"], ["market", "Market"], ["currency", "Currency"], ["voice", "Brand voice"], ["product", "Main product"], ["price", "Sell price"], ["cost", "Product cost"], ["shipping", "Delivery + COD"], ["cr", "Confirmation rate %"], ["dr", "Delivery rate %"], ["cpa", "CPA ($)"], ["budget", "Monthly ad budget"]].map(([k, l]) => `
            <div class="fld"><label class="flbl">${l}</label><input class="input" data-ctx="${k}" value="${esc(ctx[k] || "")}"></div>`).join("")}
        </div>
        <button class="btn btn-p btn-sm" id="ctx-save">${ic("save", 13)} Save context</button>
        <div class="sec-h">${ic("server", 15)} AI Provider Architecture</div>
        <div class="tbl-wrap"><table class="eat-tbl">
          <thead><tr><th>Provider</th><th>Role</th><th>Status</th></tr></thead>
          <tbody>
            ${[["OpenRouter", "Fast + routing hub", "Configured"], ["NVIDIA NIM", "Long-context", "Available"], ["OpenAI", "Fast / reasoning", "Available"], ["Anthropic", "Reasoning", "Available"], ["Gemini", "Vision / long-context", "Available"], ["Mistral", "Fast language", "Available"], ["Groq", "Fast low-latency", "Available"], ["DeepSeek", "Fast / cheap", "Available"]].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td><span class="tag green">${r[2]}</span></td></tr>`).join("")}
          </tbody>
        </table></div>
        <div class="sec-h">${ic("gauge", 15)} Model routing</div>
        <div class="tbl-wrap"><table class="eat-tbl">
          <thead><tr><th>Task</th><th>Model class</th><th>Fallback</th></tr></thead>
          <tbody>
            ${[["Extraction / classification", "Fast model", "Next fast provider"], ["Images / screenshots", "Vision model", "Gemini or OpenAI vision"], ["Business analysis", "Reasoning model", "Anthropic → OpenAI"], ["Large reports", "Long-context", "NIM → Gemini"], ["Copywriting", "Language model", "Fast model"]].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}
          </tbody>
        </table></div>
        <div class="sec-h">${ic("coins", 15)} AI cost control</div>
        <div class="g4">
          <div class="kpi blu"><div class="kpi-l">Runs</div><div class="kpi-v">${usage.runs}</div><div class="kpi-s">this session store</div></div>
          <div class="kpi pur"><div class="kpi-l">Tokens (est)</div><div class="kpi-v">${fmt(usage.tokens)}</div><div class="kpi-s">cumulative</div></div>
          <div class="kpi gold"><div class="kpi-l">Cost (est)</div><div class="kpi-v">$${fmtN(usage.cost, 4)}</div><div class="kpi-s">simulation</div></div>
          <div class="kpi grn"><div class="kpi-l">Simple tasks</div><div class="kpi-v">Fast model</div><div class="kpi-s">cheaper recommendation</div></div>
        </div>
      </div>`;
  }

  /* ============ RENDERERS per group ============ */
  function toolPage(toolId, title, sub) {
    const t = TOOLS[toolId];
    const fields = (t.fields || []).map((f) => {
      const v = f.def != null ? f.def : "";
      const val = esc(v);
      if (f.type === "select") {
        const opts = (f.opts || []).map((o) => `<option ${String(o) === String(v) ? "selected" : ""}>${esc(o)}</option>`).join("");
        return `<div class="fld"><label class="flbl">${esc(f.label)}</label><select class="select" data-f="${f.key}" style="width:100%">${opts}</select></div>`;
      }
      if (f.type === "textarea") {
        return `<div class="fld"><label class="flbl">${esc(f.label)}</label><textarea class="textarea" data-f="${f.key}" rows="${f.rows || 3}" style="width:100%">${val}</textarea></div>`;
      }
      return `<div class="fld"><label class="flbl">${esc(f.label)}</label><input class="input" data-f="${f.key}" value="${val}" placeholder="${esc(f.ph || "")}"></div>`;
    }).join("");
    return `
      <div class="tool-head"><span class="tool-ic">${ic(t.icon, 19)}</span><div><div class="tool-title">${esc(t.name)}</div><div class="tool-sub">${esc(t.desc)}</div></div></div>
      <div class="bd-card">
        <div class="eat-grid" style="gap:14px">
          <div>${fields}
            <button class="btn btn-p btn-sm" data-run="${toolId}" data-group="${t.group}">${ic("sparkles", 14)} Run AI</button>
            <span class="fhint" style="display:inline-block;margin-left:8px">Every run shows confidence + data used.</span>
          </div>
          <div id="out-${toolId}"></div>
        </div>
      </div>`;
  }

  function renderGroup() {
    const g = GROUPS.find((x) => x.id === activeGroup);
    if (!g) return "<div class='empty'>Unknown view</div>";

    if (activeGroup === "dashboard") return renderDashboard();
    if (activeGroup === "chat") return renderChat();
    if (activeGroup === "projects") return renderProjects();
    if (activeGroup === "templates") return renderTemplates();
    if (activeGroup === "history") return renderHistory();
    if (activeGroup === "settings") return renderSettings();

    const tools = Object.values(TOOLS).filter((t) => t.group === activeGroup);
    if (!tools.length) return "<div class='empty'>No tools in this group yet</div>";
    const tabs = tools.map((t) => `<button class="eat-secbtn${activeTool === t.id ? " active" : ""}" data-tooltab="${t.id}">${ic(t.icon, 12)} ${t.name}</button>`).join("");
    const current = activeTool && tools.find((t) => t.id === activeTool) ? TOOLS[activeTool] : tools[0];
    return `<div class="eat-secnav">${tabs}</div>` + toolPage(current.id);
  }

  function renderChat() {
    const bubbles = chatLog.slice(-30).map((m) => `<div class="chat-bub ${m.role === "me" ? "me" : "ai"}">${esc(m.text)}</div>`).join("") || `<div class="chat-bub ai">Ask me anything about your e-commerce business — products, ads, COD, offers, competitors, or what to do next.</div>`;
    return `
      <div class="tool-head"><span class="tool-ic">${ic("bot-message-square", 19)}</span><div><div class="tool-title">AI Business Chat</div><div class="tool-sub">Persistent assistant. Asks about connected data first, never guesses when it can route you to a tool.</div></div></div>
      <div class="bd-card">
        <div class="chat-log" id="chat-log">${bubbles}</div>
        <div class="chat-input">
          <input class="input" id="chat-input" placeholder="e.g. Why did my sales drop?" style="flex:1">
          <button class="btn btn-p" id="chat-send">${ic("send", 14)} Send</button>
        </div>
      </div>`;
  }

  function renderTemplates() {
    const built = [
      { n: "Product research brief", d: "Structured prompts to analyze any product", ic: "search" },
      { n: "Ad copy pack", d: "Primary text + headline + CTA variants", ic: "megaphone" },
      { n: "UGC script frame", d: "Hook → dialogue → scene → CTA", ic: "smartphone" },
      { n: "Landing page skeleton", d: "12-block mobile-first structure", ic: "layout-template" },
      { n: "Offer economics", d: "Bundle / discount / free shipping math", ic: "gift" },
      { n: "Email flows", d: "Welcome, cart, post-purchase, win-back", ic: "mail" },
      { n: "WhatsApp templates", d: "Confirmation, reminder, review request", ic: "message-circle" },
      { n: "Support responses", d: "COD, delivery, returns — honest replies", ic: "life-buoy" },
      { n: "Launch plan", d: "Day-by-day launch checklist", ic: "rocket" },
      { n: "Competitor matrix", d: "Prices, offers, gaps — verified vs inferred", ic: "swords" },
    ];
    const userTpl = templates.map((t) => `<div class="tpl-card" data-copy="${esc(t.content)}"><div class="t-ic">${ic("file-text", 16)}</div><div class="t-t">${esc(t.name)}</div><div class="t-d">${esc(t.desc || "")}</div></div>`).join("");
    return `
      <div class="bd-card">
        <div class="card-head"><span class="tool-ic">${ic("layout-grid", 18)}</span><div><div class="card-title">Template Library</div><div class="card-sub">Click a card to copy its content. Save your own reusable templates.</div></div></div>
        <div class="tpl-grid">${built.map((t) => `<div class="tpl-card" data-copy="${esc("Template: " + t.n + "\n\n" + t.d)}"><div class="t-ic">${ic(t.ic, 16)}</div><div class="t-t">${esc(t.n)}</div><div class="t-d">${esc(t.d)}</div></div>`).join("")}${userTpl}</div>
        <div class="div"></div>
        <div class="g2" style="gap:10px">
          <div class="fld"><label class="flbl">Template name</label><input class="input" id="tpl-name" placeholder="e.g. My launch checklist"></div>
          <div class="fld"><label class="flbl">Content</label><input class="input" id="tpl-content" placeholder="Template text…"></div>
        </div>
        <button class="btn btn-p btn-sm" id="tpl-save">${ic("plus", 13)} Save template</button>
      </div>`;
  }

  function renderHistory() {
    const rows = history.map((h) => `
      <div class="hist-item"><span class="h-ic">${ic("sparkles", 14)}</span>
        <div style="flex:1"><div class="h-t">${esc(h.tool)} <span class="tag ${h.conf === "high" ? "green" : h.conf === "medium" ? "amber" : "red"}">${esc(h.conf || "low")}</span></div>
        <div class="h-d">${esc(h.summary || "")}</div></div>
        <span class="h-time">${new Date(h.ts).toLocaleTimeString()}</span>
      </div>`).join("") || `<div class="empty">${ic("history", 26)} No AI runs yet.</div>`;
    return `
      <div class="bd-card">
        <div class="card-head"><span class="tool-ic">${ic("history", 18)}</span><div><div class="card-title">AI History</div><div class="card-sub">Every run with its tool, confidence and what it used.</div></div>
        <button class="btn btn-g btn-sm ml-auto" id="hist-clear">${ic("trash-2", 12)} Clear</button></div>
        <div id="hist-list">${rows}</div>
      </div>`;
  }

  /* ============ DASHBOARD ============ */
  function renderDashboard() {
    const margin = (ctx.price - ctx.cost) / ctx.price;
    const score = Math.round(margin * 30 + (ctx.cr / 100) * 25 + (ctx.dr / 100) * 25 + (ctx.budget > 0 ? 20 : 0));
    const components = [
      { l: "Product health", v: Math.round(40 + margin * 60), tone: margin >= 0.4 ? "good" : "mid" },
      { l: "Marketing health", v: ctx.budget > 0 ? 72 : 40, tone: "mid" },
      { l: "Profit health", v: Math.round(margin * 100), tone: margin >= 0.4 ? "good" : "mid" },
      { l: "COD health", v: Math.round((ctx.cr + ctx.dr) / 2), tone: (ctx.cr + ctx.dr) / 2 >= 62 ? "good" : "mid" },
      { l: "Customer health", v: 74, tone: "good" },
      { l: "Operations", v: 68, tone: "mid" },
    ];
    const commands = [
      ["Analyze this product", "Analyze my product margins"],
      ["Find 10 products to test", "Find winning products in my market"],
      ["Create a Facebook ad", "Write ad copy for my product"],
      ["Analyze my campaign", "Check my ROAS and what to scale"],
      ["Create 5 UGC scripts", "Make UGC scripts for my product"],
      ["Build an offer", "Build a bundle offer with economics"],
      ["Find competitors", "Research competitors in my market"],
      ["Why are my COD orders cancelled?", "Diagnose my COD funnel"],
      ["Why did my profit decrease?", "What should I do next?"],
      ["Create a launch plan", "Plan my product launch"],
    ];
    return `
      <div class="tool-head"><span class="tool-ic">${ic("command", 19)}</span><div><div class="tool-title">AI Command Center</div><div class="tool-sub">What do you want to do? The AI routes your request to the right connected tool.</div></div></div>
      <div class="bd-card cmd-wrap">
        <div class="cmd-box">
          <span class="cmd-ico">${ic("sparkles", 18)}</span>
          <input id="cmd-input" placeholder="Describe what you want to do — e.g. 'Analyze my campaign' or 'Build an offer'">
          <button class="btn btn-p" id="cmd-go">${ic("arrow-right", 14)} Run</button>
        </div>
        <div class="cmd-chips">${commands.map(([label, h]) => `<button class="cmd-chip" data-cmd="${esc(h)}">${ic("corner-down-right", 11)} ${esc(label)}</button>`).join("")}</div>
      </div>
      <div class="eat-grid cols3" style="margin-bottom:0">
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("activity", 18)}</span><div><div class="card-title">E-commerce Health Score</div><div class="card-sub">Internal analytical score — not a verdict.</div></div></div>
          <div style="text-align:center;padding:6px 0 2px"><div class="big-num ${score >= 70 ? "" : "amber"}">${score}</div><div class="muted" style="font-size:11px">/100</div></div>
          <div class="score-grid" style="grid-template-columns:1fr 1fr">${components.map((c) => `<div class="score-cell ${c.tone}"><div class="sc-l">${c.l}</div><div class="sc-v">${c.v}</div></div>`).join("")}</div>
        </div>
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("radar", 18)}</span><div><div class="card-title">Opportunity Radar</div><div class="card-sub">Detected opportunities from your context.</div></div></div>
          <div class="eat-list">
            <div class="eat-li"><span class="li-ic green">${ic("trending-up", 14)}</span><div><div class="li-t">Creative refresh</div><div class="li-d">High impact — hooks are the cheapest lever.</div></div></div>
            <div class="eat-li"><span class="li-ic blue">${ic("gift", 14)}</span><div><div class="li-t">Bundle offer</div><div class="li-d">Margin ${pct(margin, 0)} supports an AOV raise.</div></div></div>
            <div class="eat-li"><span class="li-ic pur">${ic("users", 14)}</span><div><div class="li-t">Retargeting</div><div class="li-d">Visitors who didn't order are low-hanging fruit.</div></div></div>
          </div>
        </div>
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("shield-alert", 18)}</span><div><div class="card-title">Risk Radar</div><div class="card-sub">Watch these before they hurt profit.</div></div></div>
          <div class="eat-list">
            <div class="eat-li"><span class="li-ic red">${ic("truck", 14)}</span><div><div class="li-t">Returns risk</div><div class="li-d">Undelivered rate ${100 - ctx.dr}% — check wilayas.</div></div></div>
            <div class="eat-li"><span class="li-ic amber">${ic("trending-down", 14)}</span><div><div class="li-t">Creative fatigue</div><div class="li-d">Refresh before CTR drops below 1.5%.</div></div></div>
            <div class="eat-li"><span class="li-ic red">${ic("package", 14)}</span><div><div class="li-t">Stock risk</div><div class="li-d">Keep a reorder point set for the main product.</div></div></div>
          </div>
        </div>
      </div>`;
  }

  /* ---------- command routing ---------- */
  function routeCommand(text) {
    const t = text.toLowerCase();
    const map = [
      { re: /winning|winner|find.*product|products? to test|test.*product/i, g: "product", t: "winnerFinder" },
      { re: /product|analy|score|margin/i, g: "product", t: "productAnalyzer" },
      { re: /ad copy|facebook ad|create.*ad|write.*ad|megaphone/i, g: "ad", t: "adCopy" },
      { re: /campaign|roas|cpm|ctr|cpa|ads? (perf|analysis|analy)/i, g: "ad", t: "fbAnalyze" },
      { re: /ugc|script/i, g: "creative", t: "ugcScripts" },
      { re: /creative|concept|image|prompt/i, g: "creative", t: "creativeLab" },
      { re: /hook/i, g: "creative", t: "hookLab" },
      { re: /offer|bundle|discount/i, g: "offer", t: "offerBuilder" },
      { re: /price|pricing|cost/i, g: "offer", t: "pricingAI" },
      { re: /landing|page/i, g: "landing", t: "landingBuilder" },
      { re: /competitor/i, g: "research", t: "competitorResearch" },
      { re: /market|research/i, g: "research", t: "marketResearch" },
      { re: /persona|buyer|customer.*who/i, g: "product", t: "buyerPersona" },
      { re: /cod|cancel|return|deliver/i, g: "cod", t: "codOptimizer" },
      { re: /launch/i, g: "sales", t: "launchPlan" },
      { re: /scale|profit|sales drop|decrease|strateg/i, g: "business", t: "strategist" },
      { re: /next|decision|should i/i, g: "business", t: "decisionEngine" },
    ];
    for (const m of map) if (m.re.test(t)) return { g: m.g, t: m.t };
    return null;
  }

  function runCommand(text) {
    if (!text.trim()) return;
    const r = routeCommand(text);
    if (r) {
      navigate(r.g, r.t);
      setTimeout(() => {
        const btn = document.querySelector(`[data-run="${r.t}"]`);
        if (btn) btn.click();
      }, 120);
      toast("Routed to " + TOOLS[r.t].name, "info");
    } else {
      openChat();
      setTimeout(() => {
        const inp = $("chat-input");
        if (inp) { inp.value = text; $("chat-send").click(); }
      }, 120);
    }
  }

  /* ---------- events ---------- */
  function wire(e) {
    const navBtn = e.target.closest("[data-nav]");
    if (navBtn) { navigate(navBtn.dataset.nav); return; }
    const tab = e.target.closest("[data-tooltab]");
    if (tab) { activeTool = tab.dataset.tooltab; render(); icons(); return; }
    const chip = e.target.closest("[data-cmd]");
    if (chip) { $("cmd-input").value = chip.dataset.cmd; runCommand(chip.dataset.cmd); return; }
    const run = e.target.closest("[data-run]");
    if (run) { runTool(run.dataset.run); return; }

    if (e.target.closest("#cmd-go")) { const v = $("cmd-input"); if (v) runCommand(v.value); return; }
    if (e.target.closest("#cmd-input")) {
      if (e.target.closest("#cmd-input").keydownEnter) return;
    }

    if (e.target.closest("#chat-send") || (e.target.id === "chat-input" && e.key === "Enter")) {
      const inp = $("chat-input");
      const v = inp ? inp.value.trim() : "";
      if (!v) return;
      chatLog.push({ role: "me", text: v, ts: Date.now() });
      store.set("chat", chatLog.slice(-60));
      renderChatFill();
      const reply = chatReply(v);
      setTimeout(() => {
        chatLog.push({ role: "ai", text: reply, ts: Date.now() });
        store.set("chat", chatLog.slice(-60));
        renderChatFill();
      }, 500);
      return;
    }

    if (e.target.closest("#ctx-save")) {
      document.querySelectorAll("[data-ctx]").forEach((el) => { ctx[el.dataset.ctx] = el.value.trim(); });
      saveCtx();
      toast("Business context saved", "check-circle");
      render(); icons();
      return;
    }

    if (e.target.closest("#proj-add")) {
      const inp = $("proj-name");
      const name = inp ? inp.value.trim() : "";
      if (!name) return toast("Enter a product name", "warn");
      projects.unshift({ id: uid(), name, status: "draft", ts: Date.now() });
      store.set("projects", projects);
      inp.value = "";
      drawProjects();
      toast("Project created", "check-circle");
      return;
    }
    const projDel = e.target.closest("[data-proj-del]");
    if (projDel) { projects = projects.filter((p) => p.id !== projDel.dataset.projDel); store.set("projects", projects); drawProjects(); return; }
    const chain = e.target.closest("[data-chain]");
    if (chain) {
      const steps = [["product", "productAnalyzer"], ["product", "buyerPersona"], ["research", "competitorResearch"], ["offer", "offerBuilder"], ["creative", "creativeLab"], ["ad", "adCopy"], ["landing", "landingBuilder"], ["ad", "adTestGen"], ["cod", "codOptimizer"]];
      const s = steps[Number(chain.dataset.chain)];
      if (s) navigate(s[0], s[1]);
      return;
    }

    if (e.target.closest("#tpl-save")) {
      const n = $("tpl-name"), c = $("tpl-content");
      if (!n || !n.value.trim()) return toast("Template name required", "warn");
      templates.unshift({ name: n.value.trim(), content: (c && c.value) || "", ts: Date.now() });
      store.set("templates", templates);
      n.value = ""; if (c) c.value = "";
      render(); icons();
      toast("Template saved", "check-circle");
      return;
    }
    const tplCopy = e.target.closest("[data-copy]");
    if (tplCopy) {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(tplCopy.dataset.copy).then(() => toast("Copied to clipboard", "info")).catch(() => {});
      else toast("Select and copy the text", "info");
      return;
    }

    if (e.target.closest("#hist-clear")) { history = []; saveHistory(); render(); icons(); toast("History cleared", "info"); return; }
  }

  function renderChatFill() {
    const log = $("chat-log");
    if (!log) return;
    log.innerHTML = chatLog.slice(-30).map((m) => `<div class="chat-bub ${m.role === "me" ? "me" : "ai"}">${esc(m.text)}</div>`).join("");
    log.scrollTop = log.scrollHeight;
  }

  function runTool(toolId) {
    const t = TOOLS[toolId];
    if (!t) return;
    const host = $("out-" + toolId);
    if (!host) return;
    const v = {};
    document.querySelectorAll(`[data-f]`).forEach((el) => {
      const key = el.dataset.f;
      const field = (t.fields || []).find((f) => f.key === key);
      if (!field) return;
      const raw = el.value;
      v[key] = (field.type === "number") ? Number(raw) : raw;
      if (field.type === "number" && isNaN(v[key])) v[key] = 0;
    });
    host.innerHTML = `<div class="loading"><div class="spinner"></div>Running ${esc(t.name)}…</div>`;
    setTimeout(() => {
      try {
        const out = t.run(v);
        if (out && out.chartBlocks) charts(out.chartBlocks);
        renderOutput(host, out);
        const summary = out.summary || (out.title || t.name);
        logRun(t.id, t.name, (out.conf && out.conf.level) || "low", summary);
      } catch (err) {
        host.innerHTML = `<div class="tip danger"><span class="ti">${ic("x-circle", 15)}</span><div>Something went wrong: ${esc(err.message)}</div></div>`;
      }
    }, 420);
  }

  function render() {
    renderShell();
    $("eat-main").innerHTML = renderGroup();
    if (activeGroup === "projects") drawProjects();
    icons();
  }

  PL.on(() => {
    render();
    document.addEventListener("click", wire);
    document.addEventListener("keydown", wire);
  });
})();
