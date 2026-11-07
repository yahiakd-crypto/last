/* ============================================================
   GLOBAL SOURCING AI (global-sourcing.html)
   Discover → Verify → Source → Fulfill → Track.
   Platform directory (56 sources / 7 regions / 16 types),
   generic connector architecture, supplier risk engine, landed
   cost + currency engine, trends & seasonality, inventory,
   fulfillment routing, watchlist, alerts, AI agent.
   All output is simulated and labeled VERIFIED / ESTIMATED /
   INFERRED — never an unverified "fact".
   ============================================================ */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (v) => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const fmt = (v) => Math.round(Number(v) || 0).toLocaleString("en-US").replace(/,/g, " ");
  const fmtN = (v, d) => { const x = Number(v); return isNaN(x) ? "0" : x.toFixed(d == null ? 1 : d); };
  const pct = (v, d) => fmtN(Number(v) * 100, d == null ? 1 : d) + "%";
  const ic = (n, s) => `<i data-lucide="${n}" style="width:${s || 15}px;height:${s || 15}px"></i>`;
  const icons = () => { if (window.lucide) lucide.createIcons(); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const uid = () => "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  function hsh(s) { let h = 0; const str = String(s == null ? "" : s); for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; } return Math.abs(h); }
  function rng(seedN) { let s = seedN || 1; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  const daysTo = (iso) => Math.max(0, Math.round((new Date(iso) - Date.now()) / 86400000));

  function toast(msg, type) {
    const stack = $("toast-stack");
    if (!stack) return;
    const t = document.createElement("div");
    t.className = "toast " + (type || "ok");
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 320); }, 2400);
  }

  const store = {
    get(k, fb) { try { const r = localStorage.getItem("gs." + k); return r == null ? fb : JSON.parse(r); } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem("gs." + k, JSON.stringify(v)); } catch (e) {} },
  };

  const DEFAULT_CTX = {
    market: "MENA / COD",
    region: "Middle East",
    currency: "USD",
    brand: "Atlas Trade",
    monthlyBudget: 5000,
    targetPrice: 0,
    freightPerKg: 6.5,
    dutyPct: 17,
    vatPct: 19,
  };

  let ctx = Object.assign({}, DEFAULT_CTX, store.get("ctx", {}));
  let history = store.get("history", []);
  let watchlist = store.get("watchlist", []);
  let alertRules = store.get("alerts", []);
  let inventory = store.get("inventory", [
    { id: uid(), name: "Mini electric scrubber", sku: "ME-1001", stock: 240, reorderPoint: 200, cost: 6.5, region: "Middle East" },
    { id: uid(), name: "Magnetic car phone holder", sku: "MP-2002", stock: 90, reorderPoint: 150, cost: 3.2, region: "Middle East" },
    { id: uid(), name: "LED grow light strip", sku: "LG-3003", stock: 410, reorderPoint: 120, cost: 7.2, region: "Middle East" },
    { id: uid(), name: "Portable mini blender", sku: "PB-4004", stock: 60, reorderPoint: 100, cost: 9.0, region: "Middle East" },
  ]);
  let orders = store.get("orders", []);
  let chatLog = store.get("chat", []);
  let reports = store.get("reports", []);
  let usage = store.get("usage", { runs: 0, saved: 0 });

  function saveCtx() { store.set("ctx", ctx); }
  function logRun(toolId, toolName, conf, summary) {
    history.unshift({ id: uid(), ts: Date.now(), tool: toolName, toolId, conf, summary });
    store.set("history", history.slice(0, 60));
    usage.runs += 1; store.set("usage", usage);
  }

  /* ---------- dataset ---------- */
  const D = window.GS_DATA || {};
  const PLATFORMS = D.PLATFORMS || [];
  const SUPPLIERS = D.SUPPLIERS || [];
  const WAREHOUSES = D.WAREHOUSES || [];
  const TRENDS = D.TRENDS || [];
  const SEASONAL = D.SEASONAL || [];
  const REGION_PROFILE = D.REGION_PROFILE || {};
  const CUR = {};
  (D.CURRENCIES || []).forEach((c) => { CUR[c[0]] = { name: c[1], symbol: c[2], perUSD: c[3] }; });

  function rate(code) { const c = CUR[code]; if (!c) return 1; const ov = (ctx.rates || {})[code]; return ov != null && ov > 0 ? ov : c.perUSD; }
  function toUSD(amt, from) { return amt / rate(from); }
  function conv(amt, from, to) { return toUSD(amt, from) * rate(to); }
  function sym(code) { const c = CUR[code]; return c ? c.symbol : code; }
  function money2(v, cur) { return fmt(v) + " " + (sym(cur || ctx.currency)); }

  function regionCounts() {
    return (D.REGIONS || []).map((r) => {
      const list = PLATFORMS.filter((p) => p.region === r);
      const index = Math.round(list.reduce((s, p) => s + p.rating, 0) / Math.max(1, list.length));
      return { region: r, count: list.length, index, lead: (REGION_PROFILE[r] || {}).lead || "—" };
    });
  }

  /* ---------- navigation ---------- */
  const GROUPS = [
    { id: "dashboard", label: "Command Center", icon: "layout-dashboard" },
    { id: "discover", label: "Find Products AI", icon: "compass" },
    { id: "products", label: "Product Search", icon: "search" },
    { id: "platforms", label: "Platform Directory", icon: "layers" },
    { id: "connectors", label: "Connectors", icon: "cable" },
    { id: "suppliers", label: "Suppliers", icon: "factory" },
    { id: "verify", label: "Verification", icon: "shield-check" },
    { id: "wholesale", label: "Wholesale", icon: "shopping-basket" },
    { id: "privatelabel", label: "Private Label", icon: "tag" },
    { id: "dropship", label: "Dropshipping", icon: "package-open" },
    { id: "fulfillment", label: "Fulfillment", icon: "warehouse" },
    { id: "warehouses", label: "Warehouses", icon: "boxes" },
    { id: "inventory", label: "Inventory", icon: "package" },
    { id: "shipping", label: "Shipping", icon: "truck" },
    { id: "orders", label: "Orders", icon: "shopping-cart" },
    { id: "landedcost", label: "Landed Cost", icon: "calculator" },
    { id: "market", label: "Market Intel", icon: "globe" },
    { id: "trends", label: "Trend Radar", icon: "trending-up" },
    { id: "seasonality", label: "Seasonality", icon: "calendar" },
    { id: "compare", label: "Compare", icon: "git-compare" },
    { id: "negotiate", label: "Negotiation", icon: "handshake" },
    { id: "agent", label: "AI Agent", icon: "bot" },
    { id: "watchlist", label: "Watchlist", icon: "star" },
    { id: "alerts", label: "Alerts", icon: "bell" },
    { id: "reports", label: "Reports", icon: "file-text" },
    { id: "history", label: "History", icon: "history" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const INTERACTIVE = ["dashboard", "platforms", "connectors", "suppliers", "warehouses", "inventory", "orders", "watchlist", "alerts", "agent", "reports", "history", "settings"];
  let activeGroup = "dashboard";
  let activeTool = null;
  let platformFilter = { region: "All", type: "All", q: "", api: false };

  function navigate(groupId, toolId) {
    activeGroup = groupId;
    activeTool = toolId || null;
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
          <div class="eat-title">GLOBAL <em>SOURCING</em> AI</div>
          <div class="eat-sub">Worldwide sourcing &amp; fulfillment intelligence — discover, verify, source, fulfill and track from 50+ platforms across 7 regions. A connector-first architecture: one generic interface, no hard-coded supplier logic.</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="pill green"><i data-lucide="badge-check" style="width:13px;height:13px"></i> Simulated AI</span>
          <span class="pill gray"><i data-lucide="globe" style="width:13px;height:13px"></i> ${esc(ctx.market || "Global")}</span>
          <span class="pill gray"><i data-lucide="layers" style="width:13px;height:13px"></i> ${PLATFORMS.length} platforms</span>
        </div>
      </div>
      <div class="eat-layout">
        <aside class="eat-side">
          <div class="eat-side-lbl">Sourcing workspace</div>
          ${sidebar}
          <div class="eat-side-foot">Every result is a hypothesis. Evidence is labeled VERIFIED / ESTIMATED / INFERRED. No API keys are stored in this frontend.</div>
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
        return `<div class="tbl-wrap"><table class="eat-tbl"><thead><tr>${(b.head || []).map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${(b.rows || []).map((r) => `<tr class="${b.rowClass || ""}">${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
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
        return `<div class="chw${b.lg ? "-lg" : ""}"><canvas id="chart-${b.id}" ${b.lg ? "" : `height="220"`}></canvas></div>`;
      default:
        return "";
    }
  }

  function confBox(conf) {
    const lvl = (conf && conf.level) || "low";
    const rows = [
      ["Evidence level", (conf && conf.evidence) || "Simulation — no live connection"],
      ["Data used", (conf && conf.data) || "Local snapshot dataset"],
      ["Assumptions", (conf && conf.assumptions) || "Inputs reflect what you provided"],
      ["Limitations", (conf && conf.limitations) || "Not verified against a live supplier feed"],
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
      meta = `<div class="ai-run-meta"><span class="pill ${tone}"><span class="dot"></span>${lvl.toUpperCase()} confidence</span><span class="pill gray">${esc((out.provider || "sourcing-sim"))}</span><span class="pill gray">evidence-tracked</span></div>`;
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
        plugins: { legend: spec.legend === false ? { display: false } : { labels: { color: "#8A9AB6", font: { size: 10 } } } },
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
    (blocks || []).forEach((b) => { if (b.t === "chart") pendingCharts[b.id] = b.spec; });
  }

  /* ---------- evidence tags ---------- */
  const evTag = (lvl) => `<span class="tag ${lvl === "verified" ? "ev-verified" : lvl === "estimated" ? "ev-estimated" : "ev-inferred"}">${lvl.toUpperCase()}</span>`;

  /* ---------- tool registry ---------- */
  const TOOLS = {};
  function register(id, t) { t.id = id; TOOLS[id] = t; }

  /* ============ DISCOVER — 4 AI find modes ============ */
  register("findBestSource", {
    name: "Find Best Source", icon: "target", group: "discover",
    desc: "For one product, find the strongest platform + supplier match across regions. Ranked by platform health, supplier evidence and shipping fit.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Mini electric scrubber", ph: "What are you sourcing?" },
      { key: "region", label: "Region", type: "select", opts: ["All"].concat(D.REGIONS), def: "All" },
      { key: "type", label: "Platform type", type: "select", opts: ["B2B Marketplace", "Manufacturer", "Wholesale", "Dropshipping", "Private Label"], def: "B2B Marketplace" },
      { key: "qty", label: "Planned quantity", type: "number", def: 200 },
    ],
    run(v) {
      const region = v.region === "All" ? null : v.region;
      let pool = PLATFORMS.filter((p) => (p.type === v.type || (v.type === "Private Label" && p.type === "Manufacturer")) && (!region || p.region === region));
      if (!pool.length) pool = PLATFORMS.filter((p) => p.type === v.type || p.type === "Manufacturer");
      const ranked = pool.slice().sort((a, b) => b.rating - a.rating).slice(0, 4);
      const supplier = SUPPLIERS.filter((s) => !region || s.region === region).sort((a, b) => b.rating - a.rating)[0] || SUPPLIERS[0];
      const seedN = hsh(v.product);
      const rows = ranked.map((p, i) => {
        const r = rng(seedN + i);
        const price = Math.round((3 + r() * 7) * 100) / 100;
        return `<b>${esc(p.name)}</b> <span class="tag gray">${p.region}</span> ${evTag(p.trusted ? "verified" : "estimated")}<br><small>${esc(p.focus)}</small><br>est. unit ${money2(price, "USD")} · MOQ ${esc(p.moq)} · ship ${esc(p.ship)}`;
      });
      return {
        title: "Best source — " + v.product,
        conf: { level: "medium", data: "Local platform snapshot + product name", evidence: "Platform health verified for trusted sources; unit prices estimated", assumptions: ["Unit price is a category estimate, not a live quote", "MOQ applies at the listed threshold"], limitations: ["No live quotes pulled — request RFQs to confirm"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Top platform", v: ranked[0] ? ranked[0].name : "—", s: ranked[0] ? "rating " + ranked[0].rating + "/10" : "", tone: "grn" },
            { l: "Lead supplier", v: supplier.name, s: supplier.country, tone: "blu" },
            { l: "Planned qty", v: fmt(v.qty) + " u", s: "MOQ " + esc((ranked[0] || {}).moq || "—"), tone: "gold" },
            { l: "Ship time", v: ranked[0] ? ranked[0].ship : "—", s: "origin → target", tone: "pur" },
          ] },
          { t: "table", head: ["Platform", "Region", "Evidence", "Est. economics"], rows: ranked.map((p, i) => {
            const r = rng(seedN + i);
            return [esc(p.name), `<span class="tag gray">${p.region}</span> ${evTag(p.trusted ? "verified" : "estimated")}`, `${evTag("verified")}`, `${esc(p.focus)}<br><small>MOQ ${esc(p.moq)} · ship ${esc(p.ship)} · rating ${p.rating}/10</small>`];
          }) },
          { t: "decision", choice: "START WITH: " + (ranked[0] ? ranked[0].name : "Alibaba.com"), why: "Highest platform health in the pool. Confirm real quotes with an RFQ — every price here is <b>estimated</b> until a supplier responds." },
          { t: "tip", tone: "info", html: "<b>Never present an estimate as a fact.</b> Use the Negotiation tab to send an RFQ and turn estimated prices into quoted prices." },
        ],
      };
    },
  });

  register("findForMarket", {
    name: "Products for My Market", icon: "map-pin", group: "discover",
    desc: "Scores products by fit for your target market: demand, margin potential, competition and logistics.",
    fields: [
      { key: "market", label: "Market", type: "text", def: "MENA / COD", ph: "e.g. Algeria COD, Saudi, EU" },
      { key: "category", label: "Category", type: "select", opts: ["All", "Home", "Kitchen", "Health", "Beauty", "Automotive", "Pets", "Smart Home", "Outdoor", "Office"], def: "All" },
      { key: "budget", label: "Test budget (USD)", type: "number", def: 5000 },
    ],
    run(v) {
      const pool = TRENDS.filter((t) => v.category === "All" || t.category === v.category);
      const ranked = pool.slice().sort((a, b) => b.momentum - a.momentum).slice(0, 5);
      const rows = ranked.map((t) => {
        const margin = Math.round(((t.avgSell - t.avgCost * 1.4) / t.avgSell) * 100);
        const score = clamp(Math.round(t.momentum * .5 + margin * .3 + (t.evidence === "verified" ? 10 : 5)), 30, 96);
        return `<b>${esc(t.name)}</b> <span class="tag ${t.evidence === "verified" ? "green" : "amber"}">${t.evidence.toUpperCase()}</span> score ${score}/100<br><small>est. cost ${money2(t.avgCost, "USD")} · sell ${money2(t.avgSell, "USD")} · ${esc(t.note)}</small>`;
      });
      return {
        title: "Product candidates — " + v.market,
        conf: { level: "low", data: "Market name + category + budget", evidence: "Trend signals mixed verified/estimated/inferred", assumptions: ["Scores are directional, not measurements", "Costs exclude landed cost — run Landed Cost to confirm"], limitations: ["No live search-volume data connected"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Candidates", v: ranked.length, s: "scored", tone: "blu" },
            { l: "Top score", v: Math.max(30, ...ranked.map((t) => clamp(Math.round(t.momentum * .5 + Math.round(((t.avgSell - t.avgCost * 1.4) / t.avgSell) * 100) * .3 + (t.evidence === "verified" ? 10 : 5)), 30, 96))) + "/100", s: "best fit", tone: "grn" },
            { l: "Budget", v: money2(v.budget, "USD"), s: "test pool", tone: "gold" },
            { l: "Top trend", v: ranked[0] ? ranked[0].name.slice(0, 16) : "—", s: "momentum " + (ranked[0] ? ranked[0].momentum : 0), tone: "pur" },
          ] },
          { t: "list", items: ranked.map((t, i) => ({ ic: i === 0 ? "trophy" : "package", tone: i === 0 ? "" : "blue", t: esc(t.name) + " " + evTag(t.evidence), d: "est. cost " + money2(t.avgCost, "USD") + " → sell " + money2(t.avgSell, "USD") + " · " + esc(t.note) })) },
          { t: "hl", title: "Top pick", html: ranked[0] ? esc(ranked[0].name) + " — highest momentum with verified evidence. Still a hypothesis: test demand with a small order before scale." : "Narrow your category." },
          { t: "tip", tone: "warn", html: "<b>No guaranteed winners.</b> These are research directions. Landed cost and a sample order decide reality." },
        ],
      };
    },
  });

  register("findForSeason", {
    name: "Products for a Season", icon: "calendar-days", group: "discover",
    desc: "Suggests products for an upcoming season/event with an order-by date based on shipping lead time.",
    fields: [
      { key: "season", label: "Season / event", type: "select", opts: SEASONAL.map((s) => s.name), def: SEASONAL[0].name },
      { key: "region", label: "Region", type: "select", opts: D.REGIONS, def: "Middle East" },
      { key: "lead", label: "Lead time days", type: "number", def: 45, unit: "d" },
    ],
    run(v) {
      const se = SEASONAL.find((s) => s.name === v.season);
      const days = se ? daysTo(se.start) : 0;
      const orderBy = days - (v.lead || 45);
      const cats = se ? se.categories : [];
      const pool = TRENDS.filter((t) => cats.length && cats.includes(t.category)).slice(0, 4);
      const picks = pool.length ? pool : TRENDS.slice(0, 3);
      const cdClass = days <= 30 ? "hot" : days <= 60 ? "warm" : "ok";
      const orderClass = orderBy <= 0 ? "hot" : orderBy <= 30 ? "warm" : "ok";
      return {
        title: "Season plan — " + se.name,
        conf: { level: "medium", data: "Season calendar snapshot + your lead time", evidence: "Season dates are calendar events; demand mapping estimated", assumptions: ["Order-by = lead time before season start", "Categories map to trending products"], limitations: ["Dates are reference approximations — confirm religious/lunar dates" ] },
        blocks: [
          { t: "kpis", items: [
            { l: "Starts in", v: days + " days", s: se.start, tone: days <= 30 ? "red" : "gold" },
            { l: "Order by", v: orderBy > 0 ? orderBy + " days" : "NOW", s: "given lead " + v.lead + "d", tone: orderBy <= 0 ? "red" : "grn" },
            { l: "Regions", v: se.regions.length, s: se.regions.slice(0, 2).join(", "), tone: "blu" },
            { l: "Categories", v: cats.slice(0, 2).join(" + "), s: "affected", tone: "pur" },
          ] },
          { t: "list", items: picks.map((t) => ({ ic: "package", tone: "blue", t: esc(t.name) + " " + evTag(t.evidence), d: "category " + esc(t.category) + " · fits " + esc(se.name) + " buying patterns" })) },
          { t: "hl", tone: orderBy <= 0 ? "danger" : "", title: orderBy <= 0 ? "Order window closed — move to air freight" : "Order deadline", html: orderBy > 0 ? "Place orders by <b>" + orderBy + " days from now</b> to arrive before " + se.name + "." : "Standard sea freight will not arrive in time. Use air freight or pre-negotiated stock." },
          { t: "tip", tone: "info", html: "<b>Ramadan / Eid note:</b> factories in Asia close 2-4 weeks around Chinese New Year (Feb). Order gift-able categories early." },
        ],
      };
    },
  });

  register("findLikeWinner", {
    name: "Like My Winner", icon: "trophy", group: "discover",
    desc: "Paste a winning product (yours or a competitor's). Returns similar sourcing directions — never copies, always alternatives with differentiators.",
    fields: [
      { key: "winner", label: "Winning product", type: "text", def: "Massage gun — sold 200 units/day in MENA", ph: "Describe the winning product and its angle" },
      { key: "angle", label: "Why it wins (optional)", type: "text", ph: "e.g. demo video, price point, problem-led" },
    ],
    run(v) {
      const seedN = hsh(v.winner);
      const tokens = v.winner.toLowerCase();
      const cat = ["Home", "Health", "Kitchen", "Automotive", "Pets", "Beauty", "Outdoor"].find((c) => tokens.includes(c.toLowerCase())) || "Health";
      const pool = TRENDS.filter((t) => t.category === cat).slice(0, 3);
      const picks = pool.length ? pool : TRENDS.slice(1, 4);
      const r = rng(seedN);
      const leads = picks.map((t) => ({
        name: t.name, diff: r() > .5 ? "higher perceived value + bundle" : "cleaner demo + proof angle",
      }));
      return {
        title: "Similar sourcing directions",
        conf: { level: "low", data: "Winner description + category guess", evidence: "Trend entries have evidence labels; similarity is inferred", assumptions: ["Category inferred from your text", "Differentiators are suggestions, not market facts"], limitations: ["No competitor sales data connected"] },
        blocks: [
          { t: "list", items: leads.map((l) => ({ ic: "lightbulb", tone: "pur", t: esc(l.name) + " " + evTag("estimated"), d: "Differentiator: " + esc(l.diff) + " · find it on Alibaba/1688 via the Search tab." })) },
          { t: "hl", title: "Why alternatives", html: "Copying a winner rarely works — buying the same product at a worse cost is the fastest way to lose margin. Source a variation and differentiate." },
          { t: "tip", tone: "warn", html: "<b>Reverse search:</b> to find where a specific winning product is sold, use Reverse Search under Product Search — every match stays labeled." },
        ],
      };
    },
  });

  /* ============ PRODUCT SEARCH ============ */
  register("universalSearch", {
    name: "Universal Search", icon: "search", group: "products",
    desc: "One query, grouped results across many platforms. Prices are ESTIMATED until quoted — labels are shown on every row.",
    fields: [
      { key: "query", label: "Search term", type: "text", def: "electric scrubber", ph: "Product, keyword or reference" },
      { key: "region", label: "Region filter", type: "select", opts: ["All"].concat(D.REGIONS), def: "All" },
      { key: "max", label: "Results per platform", type: "number", def: 4 },
    ],
    run(v) {
      const seedN = hsh(v.query);
      const types = ["B2B Marketplace", "Wholesale", "Manufacturer", "Dropshipping"];
      const pool = PLATFORMS.filter((p) => types.includes(p.type) && (v.region === "All" || p.region === v.region)).slice(0, 6);
      const r = rng(seedN);
      const rows = pool.map((p) => {
        const low = Math.round((2 + r() * 10) * 100) / 100;
        const n = 1 + Math.floor(r() * 3);
        const moq = p.moq === "1" ? "1" : (p.moq === "Varies" ? "Varies" : n * 10 + "+");
        return [`<b>${esc(p.name)}</b> <span class="tag gray">${p.region}</span>`, `${evTag(p.trusted ? "verified" : "estimated")}`, `${money2(low, "USD")} <small>(est.)</small>`, esc(moq), esc(p.ship), `${p.api === "yes" ? "yes" : p.api === "partial" ? "partial" : "no"}`];
      });
      return {
        title: "Universal search — " + v.query,
        conf: { level: "low", data: "Query + local platform snapshot", evidence: "Platform identity verified where trusted; prices estimated", assumptions: ["Prices are category estimates, not scraped listings", "Availability is not confirmed"], limitations: ["Run RFQs to convert estimates into quotes"] },
        blocks: [
          { t: "table", head: ["Platform", "Evidence", "Est. price", "MOQ", "Ship", "API"], rows },
          { t: "tip", tone: "info", html: "Grouped across platforms, same interface. Send one RFQ to the 2 best rows and let suppliers quote you." },
        ],
      };
    },
  });

  register("reverseSearch", {
    name: "Reverse Search", icon: "image-search", group: "products",
    desc: "Find where a product you already see on the market is actually sold — and at what price gap. Evidence-tracked, competitor prices are estimates.",
    fields: [
      { key: "product", label: "Product / reference", type: "text", def: "Massage gun 4-speed", ph: "Product name, image description or SKU" },
      { key: "market", label: "Market", type: "text", def: "MENA / COD", ph: "Where is it sold?" },
    ],
    run(v) {
      const seedN = hsh(v.product);
      const r = rng(seedN);
      const retail = Math.round(30 + r() * 80);
      const gap = Math.round(1.2 + r() * 1.5);
      const rows = [
        ["China (Alibaba/1688)", evTag("estimated"), money2(Math.round(retail / gap), "USD") + " <small>(est.)</small>", "5-20", "2-4 wks"],
        ["China (AliExpress)", evTag("verified"), money2(Math.round(retail / gap * 1.25), "USD") + " <small>(est.)</small>", "1", "1-3 wks"],
        ["Turkey (Europages)", evTag("estimated"), money2(Math.round(retail / gap * 1.7), "USD") + " <small>(est.)</small>", "50+", "2-3 wks"],
        ["Your retail price", evTag("inferred"), money2(retail, ctx.currency) + " <small>(target)</small>", "—", "—"],
      ];
      return {
        title: "Reverse sourcing — " + v.product,
        conf: { level: "low", data: "Product reference + market", evidence: "Price gaps are estimates from typical retail/wholesale ratios", assumptions: ["Wholesale ≈ retail ÷ 2-3", "Regional differences apply"], limitations: ["No scraped listings — verify visually before ordering"] },
        blocks: [
          { t: "table", head: ["Origin", "Evidence", "Est. price", "MOQ", "ETA"], rows },
          { t: "hl", title: "Price gap", html: "Retail target " + money2(retail, ctx.currency) + " against an estimated wholesale of " + money2(Math.round(retail / gap), "USD") + " — a plausible margin, but only a real quote confirms it." },
          { t: "tip", tone: "warn", html: "<b>Reverse image search</b> the exact listing before ordering — product variations (versions/quality tiers) change everything." },
        ],
      };
    },
  });

  /* ============ LANDED COST ============ */
  register("landedCost", {
    name: "Landed Cost Calculator", icon: "calculator", group: "landedcost",
    desc: "The real cost per unit: price → fees → freight → insurance → duty → VAT → local delivery. Multi-currency via the reference rate engine.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Mini electric scrubber" },
      { key: "sourcePrice", label: "Source price", type: "number", def: 6.5 },
      { key: "srcCur", label: "Source currency", type: "select", opts: Object.keys(CUR), def: "USD" },
      { key: "qty", label: "Quantity", type: "number", def: 300 },
      { key: "weightKg", label: "Weight per unit (kg)", type: "number", def: 0.6 },
      { key: "freightPerKg", label: "Freight per kg", type: "number", def: 6.5, unit: "USD" },
      { key: "insPct", label: "Insurance %", type: "number", def: 1, unit: "%" },
      { key: "dutyPct", label: "Import duty %", type: "number", def: 17, unit: "%" },
      { key: "vatPct", label: "VAT %", type: "number", def: 19, unit: "%" },
      { key: "localDelivery", label: "Local delivery per unit", type: "number", def: 1.1, unit: ctx.currency },
      { key: "targetCur", label: "Target currency", type: "select", opts: Object.keys(CUR), def: ctx.currency },
      { key: "sellPrice", label: "Target sell price", type: "number", def: 0, unit: ctx.currency },
    ],
    run(v) {
      const u = v.targetCur || ctx.currency;
      const src = conv(v.sourcePrice, v.srcCur, u);
      const fee = src * 0.02;
      const freight = v.weightKg * v.freightPerKg;
      const sub = src + fee + freight;
      const ins = sub * (v.insPct / 100);
      const duty = (src + freight + ins) * (v.dutyPct / 100);
      const vat = (src + freight + ins + duty) * (v.vatPct / 100);
      const landed = src + fee + freight + ins + duty + vat + v.localDelivery;
      const total = landed * v.qty;
      const sell = v.sellPrice > 0 ? v.sellPrice : landed * 3;
      const margin = ((sell - landed) / sell) * 100;
      const curSym = sym(u);
      const line = (l, x, cls, subTxt) => `<div class="fr"><span class="frl">${l}${subTxt ? `<div class="sub">${subTxt}</div>` : ""}</span><span class="frv ${cls || ""}">${fmt(x)} ${curSym}</span></div>`;
      return {
        title: "Landed cost — " + v.product,
        conf: { level: "medium", data: "All inputs you provided + reference rates", evidence: "Math is exact; rates are reference snapshots", assumptions: ["Freight, duty and VAT are your inputs or defaults", "No hidden port/clearing charges included"], limitations: ["Final charges depend on the carrier and customs valuation"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Landed / unit", v: fmt(landed) + " " + curSym, s: "all-in", tone: "blu" },
            { l: "Total order", v: fmt(total) + " " + curSym, s: fmt(v.qty) + " units", tone: "gold" },
            { l: "Margin @ " + fmt(sell), v: pct(margin, 1), s: "target price", tone: margin >= 40 ? "grn" : margin >= 25 ? "gold" : "red" },
            { l: "Source", v: fmt(v.sourcePrice) + " " + v.srcCur, s: "converted at " + fmtN(rate(v.srcCur), 3) + " ref rate", tone: "pur" },
          ] },
          { t: "html", html: `<div class="fmla">${line("Source price (" + v.srcCur + " → " + u + ")", src, "", "converted at reference rate " + fmtN(rate(v.srcCur), 3))}${line("Platform fee (2%)", fee)}${line("Freight (" + fmtN(v.weightKg, 1) + " kg × " + fmtN(v.freightPerKg, 2) + "/kg)", freight)}${line("Insurance (" + v.insPct + "%)", ins)}${line("Import duty (" + v.dutyPct + "%)", duty)}${line("VAT (" + v.vatPct + "%)", vat)}${line("Local delivery", v.localDelivery)}<div class="fr" style="border-top:1px solid var(--line)"><span class="frl"><b>Landed per unit</b></span><span class="frv g" style="font-size:13px">${fmt(landed)} ${curSym}</span></div></div>` },
          { t: "hl", tone: margin >= 40 ? "" : "warn", title: "Margin read", html: "At a sell price of " + fmt(sell) + " " + curSym + ", gross margin is <b>" + pct(margin, 1) + "</b>" + (margin >= 40 ? " — healthy for paid-traffic COD." : " — thin. Recheck freight, duty or sell price.") },
          { t: "tip", tone: "info", html: "<b>Currency engine:</b> rates are reference snapshots you can edit in Settings. Converting at the wrong rate silently kills margin — always recheck." },
        ],
      };
    },
  });

  /* ============ COMPARE ============ */
  register("compareSuppliers", {
    name: "Compare Suppliers", icon: "git-compare", group: "compare",
    desc: "Three suppliers side by side: MOQ, unit cost, rating, on-time %, risk class and verification evidence.",
    fields: [
      { key: "a", label: "Supplier A", type: "select", opts: SUPPLIERS.map((s) => s.name), def: SUPPLIERS[0].name },
      { key: "b", label: "Supplier B", type: "select", opts: SUPPLIERS.map((s) => s.name), def: SUPPLIERS[1].name },
      { key: "c", label: "Supplier C", type: "select", opts: SUPPLIERS.map((s) => s.name), def: SUPPLIERS[2].name },
      { key: "qty", label: "Order quantity", type: "number", def: 200 },
    ],
    run(v) {
      const pick3 = (name) => SUPPLIERS.find((s) => s.name === name) || SUPPLIERS[0];
      const list = [pick3(v.a), pick3(v.b), pick3(v.c)];
      const rows = list.map((s) => {
        const cost = conv(s.cost, "USD", ctx.currency);
        return [`<b>${esc(s.name)}</b><br><small>${esc(s.country)} · ${esc(s.focus)}</small>`, `<span class="tag gray">${s.region}</span>`, s.moq + "+", fmt(cost) + " " + sym(ctx.currency), s.rating + "/10 · " + s.yrs + "y", s.ontime + "%", s.verified ? `${evTag("verified")}` : `<span class="tag red">NOT VERIFIED</span>`, `<span class="risk ${s.risk.toLowerCase() === "low" ? "low" : s.risk.toLowerCase() === "medium" ? "medium" : "high"}">${s.risk}</span>`];
      });
      const ranked = list.slice().sort((x, y) => (x.risk === "LOW" ? 0 : 1) - (y.risk === "LOW" ? 0 : 1) || y.ontime - x.ontime);
      const best = ranked[0];
      return {
        title: "Supplier comparison",
        conf: { level: "medium", data: "Local supplier snapshot (ratings, years, on-time)", evidence: "Verified suppliers have documented samples; others are not verified", assumptions: ["Unit costs are catalog references, not quotes", "On-time % is supplier-reported"], limitations: ["A sample order + QC is the only real verification"] },
        blocks: [
          { t: "table", head: ["Supplier", "Region", "MOQ", "Unit (conv)", "Rating", "On-time", "Evidence", "Risk"], rows },
          { t: "decision", choice: "PREFER: " + best.name, why: best.risk === "LOW" ? "Low risk class with the best on-time record in the set. Still send an RFQ and a sample order." : "Best available in the set — but risk is not LOW. Complete verification before a large order." },
          { t: "tip", tone: "info", html: "<b>Risk classes:</b> LOW / MEDIUM / HIGH / INSUFFICIENT DATA. We never label a supplier verified without evidence." },
        ],
      };
    },
  });

  register("profitLoop", {
    name: "Sourcing Profit Loop", icon: "refresh-cw", group: "compare",
    desc: "The integration loop: winning product → cheaper supplier → new landed cost → recalculate margin → sync to ERP.",
    fields: [
      { key: "product", label: "Winning product", type: "text", def: "Mini electric scrubber" },
      { key: "currentCost", label: "Current landed cost", type: "number", def: 14.2, unit: "USD" },
      { key: "newCost", label: "New supplier landed cost", type: "number", def: 9.8, unit: "USD" },
      { key: "sellPrice", label: "Sell price", type: "number", def: 24, unit: "USD" },
      { key: "unitsMonth", label: "Units / month", type: "number", def: 300 },
    ],
    run(v) {
      const oldM = ((v.sellPrice - v.currentCost) / v.sellPrice) * 100;
      const newM = ((v.sellPrice - v.newCost) / v.sellPrice) * 100;
      const savedPer = v.currentCost - v.newCost;
      const savedMonth = savedPer * v.unitsMonth;
      const loop = oldM >= 0 && newM > oldM && savedPer > 0;
      return {
        title: "Sourcing profit loop — " + v.product,
        conf: { level: "medium", data: "Your costs and sell price", evidence: "Math exact; supplier cost from your quote", assumptions: ["Volume steady at " + fmt(v.unitsMonth) + "/mo", "No extra freight at higher volume"], limitations: ["ERP sync is simulated — real sync needs an ERP connector"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Old margin", v: pct(oldM, 1), s: "before", tone: oldM >= 40 ? "grn" : "gold" },
            { l: "New margin", v: pct(newM, 1), s: "after", tone: newM >= 40 ? "grn" : "gold" },
            { l: "Saved / unit", v: money2(savedPer, "USD"), s: "from sourcing", tone: "blu" },
            { l: "Saved / month", v: money2(savedMonth, "USD"), s: "at current volume", tone: "pur" },
          ] },
          { t: "flow", steps: [
            { ic: "trophy", label: "Winning product", sub: "validated by sales" },
            { ic: "factory", label: "Cheaper supplier", sub: "same spec + QC" },
            { ic: "calculator", label: "New landed cost", sub: "recalculated" },
            { ic: "layout-dashboard", label: "ERP update", sub: "margin corrected" },
            { ic: "trending-up", label: "Reinvest", sub: "in ads / stock" },
          ] },
          { t: "decision", choice: loop ? "RE-SOURCE AND REINVEST THE DIFFERENCE" : "DO NOT SWITCH SUPPLIER YET", why: loop ? "Margin improves by " + pct(newM - oldM, 1) + " and frees " + money2(savedMonth, "USD") + "/mo. Validate one sample batch before the big order." : "The numbers don't improve after costs — keep the current supplier." },
          { t: "tip", tone: "info", html: "<b>ERP integration:</b> PRODUCT AI (winning products) → SOURCING (cheaper source) → ERP (updated landed cost) → re-run FACEBOOK ADS AI with the corrected margin." },
        ],
      };
    },
  });

  /* ============ NEGOTIATION ============ */
  register("negotiationAI", {
    name: "Negotiation AI", icon: "handshake", group: "negotiate",
    desc: "A counter-offer ladder and script from your price, MOQ and target. Never invents supplier facts — it works with what you tell it.",
    fields: [
      { key: "supplier", label: "Supplier", type: "text", def: "Shenzhen Tech Mfg", ph: "Who are you negotiating with?" },
      { key: "current", label: "Quoted unit price", type: "number", def: 8.2, unit: "USD" },
      { key: "target", label: "Target unit price", type: "number", def: 6.5, unit: "USD" },
      { key: "moq", label: "Quoted MOQ", type: "number", def: 300 },
      { key: "qty", label: "Your planned qty", type: "number", def: 800 },
    ],
    run(v) {
      const step = (v.current - v.target) / 3;
      const ladder = [0, 1, 2, 3].map((i) => {
        const price = Math.round((v.current - step * i) * 100) / 100;
        return [`Offer ${i + 1}`, money2(price, "USD"), i === 0 ? "opening" : i === 3 ? "walk-away floor" : "step"];
      });
      const qtyLever = v.qty >= v.moq ? "quantity leverage available (" + fmt(v.qty) + " vs MOQ " + fmt(v.moq) + ")" : "quantity below MOQ — expect resistance";
      return {
        title: "Negotiation plan — " + v.supplier,
        conf: { level: "low", data: "Your price, MOQ and target only", evidence: "No supplier data attached — the ladder is strategy, not fact", assumptions: ["Supplier negotiates on volume", "Costs are in USD at reference rates"], limitations: ["Real results depend on the supplier's actual cost structure"] },
        blocks: [
          { t: "table", head: ["Round", "Price", "Role"], rows: ladder },
          { t: "list", items: [
            { ic: "package-plus", tone: "", t: "Lever: " + qtyLever, d: "Commit to a repeat order schedule for a better rate — one-shot orders rarely get the floor price." },
            { ic: "package-check", tone: "blue", t: "Offer a term", d: "Prepay or shorter lead time in exchange for a discount. Suppliers price terms as much as volume." },
            { ic: "scale", tone: "pur", t: "Compare 2 quotes", d: "Get a second quote from a different platform for the same spec — the gap is your negotiation fuel." },
            { ic: "alert-triangle", tone: "amber", t: "Watch for bait prices", d: "A suspiciously low quote usually means a spec difference or hidden fee. Verify the exact spec in writing." },
          ] },
          { t: "tip", tone: "warn", html: "<b>Script:</b> \"Your quoted rate is higher than the comparable market range for this spec and quantity. Can you reach <i>" + money2(v.target, "USD") + "</i> with a committed 3-month order?\" — state specifics, never bluff a price you can't prove." },
        ],
      };
    },
  });

  register("translator", {
    name: "Sourcing Translator", icon: "languages", group: "negotiate",
    desc: "Common sourcing phrases in supplier languages. INFERRED — machine-style, confirm with a native speaker before sending.",
    fields: [
      { key: "language", label: "Language", type: "select", opts: ["Chinese (Mandarin)", "Turkish", "Arabic", "Hindi", "Spanish", "Portuguese", "French"], def: "Chinese (Mandarin)" },
      { key: "phrase", label: "Phrase to translate", type: "textarea", def: "Please send your best price for 500 units with the exact specification sheet attached.", rows: 2 },
    ],
    run(v) {
      const samples = {
        "Chinese (Mandarin)": "请按附件规格单为500件报价，并附上准确的规格书。",
        "Turkish": "500 adet için en iyi fiyatınızı ve teknik şartnameyi gönderir misiniz?",
        "Arabic": "يرجى إرسال أفضل سعر لـ 500 قطعة مع ورقة المواصفات الدقيقة.",
        "Hindi": "कृपया 500 इकाइयों के लिए अपनी सर्वोत्तम कीमत और सटीक विनिर्देश पत्रक भेजें।",
        "Spanish": "Por favor envíe su mejor precio para 500 unidades con la ficha técnica exacta.",
        "Portuguese": "Envie seu melhor preço para 500 unidades com a ficha técnica exata.",
        "French": "Merci d'envoyer votre meilleur prix pour 500 unités avec la fiche technique exacte.",
      };
      return {
        title: "Sourcing phrase — " + v.language,
        conf: { level: "low", data: "Your phrase + target language", evidence: "Sample is a fixed demo string", assumptions: ["Machine-style, context-free", "Politeness conventions vary by market"], limitations: ["Not a verified professional translation"] },
        blocks: [
          { t: "hl", title: v.language, html: esc(samples[v.language] || "—") },
          { t: "hl", tone: "warn", title: "Literal English", html: esc(v.phrase) },
          { t: "tip", tone: "info", html: "<b>Better practice:</b> send RFQs in English with numbers and spec sheets (industry standard), and keep the local-language line short and simple." },
        ],
      };
    },
  });

  register("rfqBuilder", {
    name: "RFQ Builder", icon: "file-text", group: "negotiate",
    desc: "A complete Request For Quotation you can copy to any platform. The more spec you give, the more comparable the quotes.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Mini electric scrubber" },
      { key: "spec", label: "Spec / requirements", type: "textarea", def: "USB-C rechargeable, IPX6 waterproof, 4 brush heads, white + green.", rows: 2 },
      { key: "qty", label: "Quantity", type: "number", def: 500 },
      { key: "priceTarget", label: "Target price / unit", type: "number", def: 6.5, unit: "USD" },
      { key: "needBy", label: "Need by date", type: "text", def: "2026-12-01", ph: "YYYY-MM-DD" },
      { key: "terms", label: "Terms", type: "select", opts: ["EXW (best for brokers)", "FOB (recommended)", "CIF", "DDP"], def: "FOB (recommended)" },
    ],
    run(v) {
      const body = `RFQ — ${v.product}

1. PRODUCT
${v.product}
Spec: ${v.spec}

2. QUANTITY & PRICING
Quantity: ${fmt(v.qty)} units
Target unit price: ${money2(v.priceTarget, "USD")} (please quote your best rate at this volume)
Please quote price breaks at 100 / 250 / 500 / 1000 units.

3. INCOTERM: ${v.terms}

4. TIMELINE
Need by: ${v.needBy}
Please confirm production lead time and shipping ETA.

5. QUALITY
Please confirm: (a) inspection report, (b) sample availability and cost, (c) packaging per unit, (d) certification (CE/FCC/ROHS if applicable).

6. PAYMENT
Please state your payment terms (deposit % and balance).`;
      return {
        title: "RFQ ready to copy — " + v.product,
        conf: { level: "high", data: "All fields you provided", evidence: "Document generated from your inputs", assumptions: ["Terms apply if the supplier accepts them"], limitations: ["Supplier response decides reality"] },
        blocks: [
          { t: "html", html: `<div class="fmla" style="white-space:pre-wrap;font-family:var(--mono);font-size:11px;color:var(--muted);line-height:1.7">${esc(body)}</div>` },
          { t: "tip", tone: "ok", html: "Copy this RFQ and send it to 2-3 platforms for the same spec — comparable quotes are the only honest basis for a sourcing decision." },
        ],
      };
    },
  });

  register("qcChecklist", {
    name: "QC Checklist", icon: "clipboard-check", group: "negotiate",
    desc: "Pre-shipment inspection checklist per category. Reduce surprises before the container sails.",
    fields: [
      { key: "category", label: "Category", type: "select", opts: ["Electronics / Gadgets", "Home & Kitchen", "Fashion / Textiles", "Beauty & Personal Care", "Pets & Outdoor"], def: "Electronics / Gadgets" },
    ],
    run(v) {
      const maps = {
        "Electronics / Gadgets": ["Unit powers on / charges correctly", "Match color/version to spec sheet", "Check input voltage for target market", "Certification marks (CE/FCC) present", "Battery & cables in box as listed"],
        "Home & Kitchen": ["No cracks, stains or smells", "Fit/lids/mechanisms work", "Food-contact material safe", "Packaging survives transit"],
        "Fashion / Textiles": ["Fabric weight matches spec", "Stitching & seams consistent", "Color fastness to spec", "Sizing chart accuracy"],
        "Beauty & Personal Care": ["Seals intact, no leaks", "Label compliance for market", "Batch numbers present", "Expiry far enough out"],
        "Pets & Outdoor": ["No sharp edges", "Material non-toxic", "Parts complete per listing", "Weather-resistance claims hold"],
      };
      return {
        title: "QC checklist — " + v.category,
        conf: { level: "medium", data: "Category checklist (static, general)", evidence: "General best practice, not a supplier commitment", assumptions: ["Inspection happens before payment of balance"], limitations: ["Hire a third-party inspector for critical orders"] },
        blocks: [
          { t: "list", items: (maps[v.category] || []).map((x, i) => ({ ic: "check-circle-2", tone: i < 2 ? "" : "blue", t: x, d: "verify visually + photo evidence" })) },
          { t: "hl", title: "Rule", html: "Photo/video evidence for every checklist item — never accept verbal confirmation." },
        ],
      };
    },
  });

  register("samplePlan", {
    name: "Sample Plan", icon: "flask-conical", group: "negotiate",
    desc: "A staged sample strategy: what to order, from whom, in what order, and how to evaluate.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Mini electric scrubber" },
      { key: "budget", label: "Sample budget (USD)", type: "number", def: 300 },
      { key: "count", label: "Number of suppliers to sample", type: "number", def: 3 },
    ],
    run(v) {
      const per = Math.round(v.budget / Math.max(1, v.count));
      return {
        title: "Sample plan — " + v.product,
        conf: { level: "medium", data: "Product + budget + sample count", evidence: "Cost split estimated", assumptions: ["Samples include domestic + international shipping", "3 suppliers is a minimum for comparison"], limitations: ["Sample quality ≠ batch quality — still QC the batch"] },
        blocks: [
          { t: "table", head: ["Stage", "Action", "Budget"], rows: [
            ["1", "Order samples from " + v.count + " suppliers of the same spec", money2(v.budget, "USD")],
            ["2", "Evaluate: feel, function, packaging, smell, color match", money2(Math.round(per), "USD") + " <small>per supplier</small>"],
            ["3", "Run a 20-50 unit trial order with the winner", "reinvest"],
            ["4", "Scale to full MOQ with QC inspection", "—"],
          ] },
          { t: "hl", title: "Golden rule", html: "Never skip the trial batch between sample and full MOQ — samples and production batches are not the same thing." },
          { t: "tip", tone: "info", html: "Ask the supplier to ship samples of 2 different quality tiers if the product has known variations." },
        ],
      };
    },
  });

  /* ============ WHOLESALE / PRIVATE LABEL / DROPSHIP ============ */
  register("wholesalePlan", {
    name: "Wholesale Plan", icon: "shopping-basket", group: "wholesale",
    desc: "Build the math for a wholesale purchase: tiers, MOQ economics and margin per tier.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "LED grow light strip" },
      { key: "unitSell", label: "Your retail price", type: "number", def: 22, unit: "USD" },
      { key: "tier1", label: "Tier 1 unit cost (100u)", type: "number", def: 7.2, unit: "USD" },
      { key: "tier2", label: "Tier 2 unit cost (500u)", type: "number", def: 6.4, unit: "USD" },
      { key: "tier3", label: "Tier 3 unit cost (1000u)", type: "number", def: 5.9, unit: "USD" },
    ],
    run(v) {
      const tiers = [["100", v.tier1], ["500", v.tier2], ["1000", v.tier3]].map(([q, c]) => {
        const landed = c * 1.35;
        return [q + " units", money2(c, "USD"), money2(landed, "USD") + " <small>(est. landed ×1.35)</small>", pct((v.unitSell - landed) / v.unitSell * 100, 1)];
      });
      const best = [["100", v.tier1], ["500", v.tier2], ["1000", v.tier3]].map(([q, c]) => c)[2];
      return {
        title: "Wholesale economics — " + v.product,
        conf: { level: "medium", data: "Your tier prices + retail price", evidence: "Landed multiplier (1.35) is an estimate", assumptions: ["1.35 landed multiplier includes freight/duty/VAT", "No price breaks below tier 1"], limitations: ["Confirm landed costs with the Landed Cost tool"] },
        blocks: [
          { t: "table", head: ["Tier", "Unit cost", "Est. landed", "Margin"], rows: tiers },
          { t: "decision", choice: (v.tier2 - best) > 0.3 ? "BUY TIER 3 (1000u)" : "BUY TIER 2 (500u)", why: "The tier discount is " + money2(Math.round((v.tier2 - best) * 100) / 100, "USD") + "/unit vs the midpoint — cover the extra cash only if sell-through supports it." },
          { t: "tip", tone: "info", html: "<b>Cash vs discount:</b> a bigger tier is only better if you don't pay 2 months of warehousing to save a few cents/unit." },
        ],
      };
    },
  });

  register("privateLabel", {
    name: "Private Label Plan", icon: "tag", group: "privatelabel",
    desc: "Take a blank product to your brand: OEM/ODM steps, branding requirements and minimum volumes.",
    fields: [
      { key: "product", label: "Base product", type: "text", def: "Electric scrubber (unbranded)" },
      { key: "brand", label: "Your brand name", type: "text", def: "Atlas Home" },
      { key: "mode", label: "Mode", type: "select", opts: ["OEM (your spec)", "ODM (their design, your brand)", "White label (ready-made)"], def: "ODM (their design, your brand)" },
      { key: "qty", label: "Planned first order", type: "number", def: 500 },
    ],
    run(v) {
      return {
        title: "Private label — " + v.brand + " × " + v.product,
        conf: { level: "medium", data: "Product, brand, mode, quantity", evidence: "General workflow, not a supplier commitment", assumptions: ["MOQs scale with customization depth", "Branding costs (molds/artwork) are one-time"], limitations: ["Get a branding quote per supplier"] },
        blocks: [
          { t: "flow", steps: [
            { ic: "package", label: "Base product", sub: "unbranded source" },
            { ic: "palette", label: "Brand assets", sub: "logo, colors, artwork" },
            { ic: "tag", label: "Private label", sub: "printed packaging + logo" },
            { ic: "badge-check", label: "Compliance", sub: "labels, certifications" },
            { ic: "rocket", label: "Launch", sub: "own listing/brand" },
          ] },
          { t: "list", items: [
            { ic: "package-search", tone: "", t: "MOQ reality", d: "ODM with your spec usually demands higher MOQ than white label. " + fmt(v.qty) + " units is a white-label-friendly volume." },
            { ic: "palette", tone: "pur", t: "Branding needs", d: "Logo printing, custom packaging, barcode, and product-insert cards — budget for one-time artwork costs." },
            { ic: "shield-alert", tone: "amber", t: "Compliance", d: "Market-specific labeling (CE/FCC/health warnings) is on YOU as the brand owner." },
          ] },
          { t: "hl", title: "Move", html: "Ask 2 factories (via MFG.com RFQ or Alibaba) for a private-label quote with artwork setup included. Compare to white-label cost." },
        ],
      };
    },
  });

  register("dropshipCheck", {
    name: "Dropship Check", icon: "package-open", group: "dropship",
    desc: "Is this product dropship-friendly? Fulfillment time, branding, cost per order and return risk.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Cat water fountain" },
      { key: "cost", label: "Cost / order", type: "number", def: 12, unit: "USD" },
      { key: "sell", label: "Sell price", type: "number", def: 28, unit: "USD" },
      { key: "eta", label: "Supplier ETA (days)", type: "number", def: 14 },
      { key: "branded", label: "Branded packaging available", type: "select", opts: ["Yes", "No"], def: "No" },
    ],
    run(v) {
      const margin = ((v.sell - v.cost) / v.sell) * 100;
      const etaOk = v.eta <= 10;
      const fit = clamp(Math.round(margin * 0.5 + (etaOk ? 30 : 10) + (v.branded === "Yes" ? 15 : 5)), 20, 96);
      return {
        title: "Dropship check — " + v.product,
        conf: { level: "low", data: "Cost, sell, ETA, branding", evidence: "Scoring is a heuristic, not a measure", assumptions: ["Return risk scales with ETA", "Branded packaging protects the brand"], limitations: ["Real fulfillment varies by supplier"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Margin", v: pct(margin, 0), s: "per order", tone: margin >= 40 ? "grn" : margin >= 25 ? "gold" : "red" },
            { l: "ETA", v: v.eta + " days", s: etaOk ? "within tolerance" : "too slow for impulse", tone: etaOk ? "grn" : "red" },
            { l: "Dropship fit", v: fit + "/100", s: "directional", tone: fit >= 60 ? "grn" : "gold" },
            { l: "Branding", v: v.branded, s: "packaging", tone: v.branded === "Yes" ? "blu" : "gray" },
          ] },
          { t: "list", items: [
            { ic: "truck", tone: "blue", t: "Shipping reality", d: etaOk ? "ETA is competitive for this product." : "Long ETA kills impulse COD conversion — use a local warehouse instead." },
            { ic: "package", tone: "", t: "Order handling", d: "Dropship = zero inventory risk, but no QC control and slower issue resolution." },
            { ic: "shield-alert", tone: "amber", t: "Brand risk", d: v.branded === "Yes" ? "Branded packaging protects your brand image." : "Customer sees the generic box — brand trust leaks." },
          ] },
          { t: "tip", tone: "info", html: "<b>Hybrid:</b> test with dropship; if the product wins, move to bulk + local fulfillment for speed and margin." },
        ],
      };
    },
  });

  /* ============ FULFILLMENT / SHIPPING / ORDERS ============ */
  register("fulfillmentRoute", {
    name: "Fulfillment Routing", icon: "warehouse", group: "fulfillment",
    desc: "Pick the right fulfillment warehouse for your target region — by cost, capacity and transit time.",
    fields: [
      { key: "destRegion", label: "Target region", type: "select", opts: D.REGIONS, def: "Middle East" },
      { key: "weightKg", label: "Avg order weight (kg)", type: "number", def: 0.6 },
      { key: "ordersMo", label: "Orders / month", type: "number", def: 500 },
    ],
    run(v) {
      const candidates = WAREHOUSES.filter((w) => w.region === v.destRegion);
      const pool = candidates.length ? candidates : WAREHOUSES;
      const rows = pool.map((w) => {
        const per = w.costPerKg * v.weightKg;
        const mo = per * v.ordersMo;
        const pctFill = Math.round((w.used / w.capacity) * 100);
        return [`<b>${esc(w.name)}</b><br><small>${esc(w.city)}</small>`, w.region, pctFill + "%", fmtN(w.costPerKg, 2) + "/kg", money2(per, "USD"), money2(mo, "USD"), esc(w.transit), w.services.join(", ")];
      });
      const best = pool.slice().sort((a, b) => a.costPerKg - b.costPerKg)[0];
      const pctFillBest = Math.round((best.used / best.capacity) * 100);
      return {
        title: "Fulfillment routing — " + v.destRegion,
        conf: { level: "medium", data: "Warehouse snapshot (cost, capacity, transit)", evidence: "Local dataset; costs are reference rates", assumptions: ["Cost per kg is an average for typical parcels", "Capacity data is a snapshot"], limitations: ["Confirm rates with the warehouse for your volume"] },
        blocks: [
          { t: "table", head: ["Warehouse", "Region", "Fill", "Rate", "Per order", "Per month", "Transit", "Services"], rows },
          { t: "decision", choice: "ROUTE VIA: " + best.name, why: "Lowest cost per kg in the set (" + fmtN(best.costPerKg, 2) + "/kg → " + money2(Math.round(best.costPerKg * v.weightKg * 100) / 100, "USD") + "/order). Fill level " + pctFillBest + "% — check capacity before committing." },
          { t: "tip", tone: "info", html: "<b>Multi-warehouse:</b> keep stock in the region that serves your buyers to cut ETA from weeks to days." },
        ],
      };
    },
  });

  register("shippingQuote", {
    name: "Shipping Quote", icon: "truck", group: "shipping",
    desc: "Compare courier, air and sea LCL for a shipment. Costs are estimates from a local reference table.",
    fields: [
      { key: "weightKg", label: "Total weight (kg)", type: "number", def: 150 },
      { key: "from", label: "From", type: "select", opts: ["China", "Turkey", "USA", "UAE"], def: "China" },
      { key: "to", label: "To", type: "select", opts: ["MENA", "North Africa", "Europe", "North America"], def: "MENA" },
      { key: "volume", label: "Volume (cbm)", type: "number", def: 0.8 },
    ],
    run(v) {
      const r = rng(hsh(v.from + v.to));
      const rows = [
        ["Courier (DHL/FedEx)", money2(Math.round(v.weightKg * (4.8 + r() * 1.2)), "USD"), "3-6 days", "small parcels / samples", "premium"],
        ["Air freight (cargo)", money2(Math.round(v.weightKg * (3.2 + r() * 0.8)), "USD"), "7-12 days", "mid-size rush stock", "recommended for launches"],
        ["Sea LCL", money2(Math.round(v.volume * (95 + r() * 40)), "USD"), "25-45 days", "bulk / container", "cheapest per kg"],
      ];
      const best = rows[1];
      return {
        title: "Shipping quote — " + v.from + " → " + v.to,
        conf: { level: "low", data: "Weight, volume, lanes", evidence: "Reference rate table, not a carrier quote", assumptions: ["Rates are per kg / per cbm averages", "No fuel surcharges or customs fees included"], limitations: ["Get real quotes from Freightos / Flexport for commitments"] },
        blocks: [
          { t: "table", head: ["Method", "Est. cost", "ETA", "Best for", "Note"], rows },
          { t: "decision", choice: best[0], why: "Air freight balances speed and cost for " + fmt(v.weightKg) + " kg. Choose sea LCL only if you can wait " + rows[2][2] + "." },
          { t: "tip", tone: "warn", html: "Add 10-15% buffer for surcharges. Never approve a quote without confirming what's included (fuel, destination fees)." },
        ],
      };
    },
  });

  register("orderRoute", {
    name: "Order Routing", icon: "shopping-cart", group: "orders",
    desc: "Route an incoming order to the best warehouse + supplier combination automatically.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Mini electric scrubber" },
      { key: "qty", label: "Quantity", type: "number", def: 20 },
      { key: "weightKg", label: "Total weight (kg)", type: "number", def: 12 },
      { key: "destRegion", label: "Delivery region", type: "select", opts: D.REGIONS, def: "Middle East" },
      { key: "urgent", label: "Urgency", type: "select", opts: ["Standard", "Express"], def: "Standard" },
    ],
    run(v) {
      const wh = WAREHOUSES.filter((w) => w.region === v.destRegion).sort((a, b) => a.costPerKg - b.costPerKg)[0] || WAREHOUSES[0];
      const fill = Math.round((wh.used / wh.capacity) * 100);
      const cost = Math.round(wh.costPerKg * v.weightKg * 100) / 100;
      const eta = v.urgent === "Express" ? "24-48h" : wh.transit;
      const origin = v.destRegion === "Middle East" ? "Dubai Gateway" : "Shenzhen Hub";
      const item = { id: uid(), product: v.product, qty: v.qty, weightKg: v.weightKg, dest: v.destRegion, urgent: v.urgent, wh: wh.name, eta, ts: Date.now(), status: "routed" };
      orders.unshift(item);
      store.set("orders", orders);
      logRun("orderRoute", "Order Routing", "high", v.product + " → " + wh.name);
      return {
        title: "Routed order — " + v.product,
        conf: { level: "high", data: "Order inputs + warehouse snapshot", evidence: "Routing from local warehouse table; order saved to state", assumptions: ["Warehouse has stock or receives from " + origin, "Transit per local table"], limitations: ["Live tracking needs a carrier connector"] },
        blocks: [
          { t: "flow", steps: [
            { ic: "shopping-cart", label: "Order in", sub: v.qty + " u · " + v.weightKg + " kg" },
            { ic: "boxes", label: "Warehouse", sub: wh.name },
            { ic: "package-check", label: "Pick + pack", sub: fill + "% capacity" },
            { ic: "truck", label: "Last mile", sub: eta },
            { ic: "check-check", label: "Delivered", sub: v.destRegion },
          ] },
          { t: "kpis", items: [
            { l: "Warehouse", v: wh.name.split(" ")[0], s: wh.city, tone: "grn" },
            { l: "Fulfill cost", v: money2(cost, "USD"), s: "est. fulfillment", tone: "gold" },
            { l: "ETA", v: eta, s: v.urgent + " priority", tone: "blu" },
            { l: "Refill from", v: origin, s: "upstream", tone: "pur" },
          ] },
          { t: "tip", tone: "ok", html: "Order <b>" + item.id + "</b> routed to " + esc(wh.name) + ". See it under Orders → History." },
        ],
      };
    },
  });

  /* ============ INVENTORY ============ */
  register("stockForecast", {
    name: "Stock Forecast", icon: "line-chart", group: "inventory",
    desc: "Reorder point, safety stock and economic order quantity from your sales rate and supplier lead time.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Mini electric scrubber" },
      { key: "dailySales", label: "Daily sales (units)", type: "number", def: 12 },
      { key: "leadDays", label: "Supplier lead time (days)", type: "number", def: 35 },
      { key: "safetyDays", label: "Safety stock (days)", type: "number", def: 10 },
      { key: "unitCost", label: "Unit landed cost", type: "number", def: 9.8, unit: "USD" },
      { key: "orderCost", label: "Order cost (USD)", type: "number", def: 60 },
      { key: "holdPct", label: "Holding cost % / yr", type: "number", def: 25, unit: "%" },
    ],
    run(v) {
      const demandDuringLead = v.dailySales * v.leadDays;
      const safety = v.dailySales * v.safetyDays;
      const reorder = Math.ceil(demandDuringLead + safety);
      const eoq = Math.round(Math.sqrt((2 * v.dailySales * 365 * v.orderCost) / (v.unitCost * v.holdPct / 100)));
      const max = reorder + eoq;
      const costPerMonth = v.dailySales * 30 * v.unitCost;
      return {
        title: "Stock forecast — " + v.product,
        conf: { level: "medium", data: "Sales rate + lead time + cost inputs", evidence: "Standard inventory formulas", assumptions: ["Sales rate is constant", "Lead time is reliable"], limitations: ["Seasonal spikes break the model — adjust inputs"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Reorder point", v: reorder + " u", s: "demand-lead " + demandDuringLead + " + safety " + safety, tone: "blu" },
            { l: "EOQ", v: fmt(eoq) + " u", s: "economic order qty", tone: "pur" },
            { l: "Max stock", v: fmt(max) + " u", s: "reorder + EOQ", tone: "gold" },
            { l: "Monthly value", v: money2(costPerMonth, "USD"), s: "at landed cost", tone: "grn" },
          ] },
          { t: "hl", title: "Rule to automate", html: "When stock ≤ <b>" + reorder + "</b> units, trigger a purchase order for <b>" + fmt(eoq) + "</b> units. This keeps you covered for " + (v.leadDays + v.safetyDays) + " days of sales." },
          { t: "tip", tone: "warn", html: "Watch the seasonality calendar — order earlier for Ramadan/Eid or Black Friday peaks or the model under-forecasts." },
        ],
      };
    },
  });

  /* ============ MARKET / TRENDS / SEASON ============ */
  register("marketReport", {
    name: "Market Intel Report", icon: "globe", group: "market",
    desc: "Region-level demand, competition, margin and logistics profile. Directional, not sourced statistics.",
    fields: [
      { key: "region", label: "Region", type: "select", opts: D.REGIONS, def: "Middle East" },
      { key: "category", label: "Category", type: "select", opts: ["All", "Home", "Kitchen", "Health", "Beauty", "Automotive", "Pets", "Smart Home", "Outdoor", "Office"], def: "All" },
    ],
    run(v) {
      const prof = REGION_PROFILE[v.region] || {};
      const cats = TRENDS.filter((t) => v.category === "All" || t.category === v.category);
      const top = cats.slice().sort((a, b) => b.momentum - a.momentum)[0];
      const charts = [{ t: "chart", id: "market", spec: { type: "bar", labels: cats.slice(0, 8).map((t) => t.name.slice(0, 12)), datasets: [{ label: "Momentum", data: cats.slice(0, 8).map((t) => t.momentum), color: "#3EE8A6" }] } }];
      return {
        chartBlocks: charts,
        title: "Market intelligence — " + v.region,
        conf: { level: "low", data: "Region profile + trend snapshot", evidence: "Profiles are directional, not sourced statistics", assumptions: ["Regional traits generalize across the region", "Momentum is a snapshot"], limitations: ["No official market stats connected"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Demand", v: prof.demand || "—", s: "directional", tone: "grn" },
            { l: "Competition", v: prof.competition || "—", s: "higher = harder", tone: prof.competition === "High" ? "red" : "gold" },
            { l: "Margin", v: prof.margin || "—", s: "typical", tone: "pur" },
            { l: "Lead time", v: prof.lead || "—", s: "typical", tone: "blu" },
          ] },
          { t: "chart", id: "market", spec: { type: "bar", labels: cats.slice(0, 8).map((t) => t.name.slice(0, 12)), datasets: [{ label: "Momentum", data: cats.slice(0, 8).map((t) => t.momentum), color: "#3EE8A6" }] } },
          { t: "hl", title: "Regional read", html: esc(prof.note || "") + (top ? " Top category signal: " + esc(top.category) + " (" + esc(top.name) + ")." : "") },
          { t: "tip", tone: "info", html: "Use Trend Radar for product-level signals and Seasonality for the calendar." },
        ],
      };
    },
  });

  register("trendRadar", {
    name: "Trend Radar", icon: "trending-up", group: "trends",
    desc: "Ranked trending products with evidence labels. Momentum is a snapshot signal, not a promise.",
    fields: [
      { key: "category", label: "Category", type: "select", opts: ["All", "Home", "Kitchen", "Health", "Beauty", "Automotive", "Pets", "Smart Home", "Outdoor", "Office"], def: "All" },
      { key: "top", label: "Show top", type: "number", def: 8 },
    ],
    run(v) {
      const pool = TRENDS.filter((t) => v.category === "All" || t.category === v.category);
      const ranked = pool.slice().sort((a, b) => b.momentum - a.momentum).slice(0, Math.min(v.top || 8, 12));
      return {
        chartBlocks: [{ t: "chart", id: "trend", spec: { type: "bar", labels: ranked.map((t) => t.name.slice(0, 14)), datasets: [{ label: "Momentum", data: ranked.map((t) => t.momentum), color: "#2DD4BF" }] } }],
        title: "Trend radar",
        conf: { level: "medium", data: "Trend snapshot dataset", evidence: "Each trend carries an evidence label", assumptions: ["Momentum is relative, not absolute", "Cost/sell ranges are category estimates"], limitations: ["No live trend feed connected"] },
        blocks: [
          { t: "chart", id: "trend", spec: { type: "bar", labels: ranked.map((t) => t.name.slice(0, 14)), datasets: [{ label: "Momentum", data: ranked.map((t) => t.momentum), color: "#2DD4BF" }] } },
          { t: "list", items: ranked.map((t) => ({ ic: t.momentum >= 80 ? "trending-up" : "activity", tone: t.momentum >= 80 ? "" : "blue", t: esc(t.name) + " " + evTag(t.evidence), d: "momentum " + t.momentum + "/100 · est. cost " + money2(t.avgCost, "USD") + " → sell " + money2(t.avgSell, "USD") + " · " + esc(t.note) })) },
          { t: "hl", title: "Read", html: "High momentum + verified evidence is the strongest starting point. Everything still needs a landed-cost check." },
        ],
      };
    },
  });

  register("seasonPlan", {
    name: "Seasonality Calendar", icon: "calendar", group: "seasonality",
    desc: "The full events calendar with countdowns, affected categories and order deadlines.",
    fields: [
      { key: "season", label: "Event", type: "select", opts: SEASONAL.map((s) => s.name), def: SEASONAL[0].name },
    ],
    run(v) {
      const se = SEASONAL.find((s) => s.name === v.season);
      const days = se ? daysTo(se.start) : 0;
      const cdClass = days <= 30 ? "hot" : days <= 60 ? "warm" : "ok";
      return {
        title: "Season calendar — " + se.name,
        conf: { level: "medium", data: "Calendar snapshot", evidence: "Religious/lunar dates are approximations — confirm annually", assumptions: ["Regions listed are the main affected markets"], limitations: ["Local holidays vary by country"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Starts in", v: days + " days", s: se.start, tone: days <= 30 ? "red" : "gold" },
            { l: "Ends", v: se.end, s: "window", tone: "blu" },
            { l: "Regions", v: se.regions.length, s: se.regions.slice(0, 3).join(", "), tone: "pur" },
            { l: "Categories", v: se.categories.join(" + "), s: "affected", tone: "grn" },
          ] },
          { t: "html", html: `<div class="eat-list">${SEASONAL.map((s) => {
            const d = daysTo(s.start);
            const cls = d <= 30 ? "hot" : d <= 60 ? "warm" : "ok";
            return `<div class="eat-li"><span class="li-ic ${d <= 30 ? "amber" : ""}">${ic("calendar-days", 14)}</span>
              <div style="flex:1"><div class="li-t">${esc(s.name)} ${d <= 30 ? `<span class="tag amber">${d} days</span>` : ""}</div>
              <div class="li-d">${s.start} → ${s.end} · ${esc(s.note)}</div></div>
              <span class="cd ${cls}">T-${d}</span></div>`; }).join("")}</div>` },
          { t: "hl", tone: days <= 30 ? "warn" : "", title: "Action", html: days <= 30 ? "This event is under a month away — negotiate stock now, use air freight, and pre-position in a regional warehouse." : "Plan orders so stock arrives " + (days - 30) + " days before the event start." },
          { t: "tip", tone: "info", html: "<b>Ramadan/Eid:</b> gift-able categories and kitchen tools peak. Chinese New Year factory closures (Feb) mean order even earlier." },
        ],
      };
    },
  });

  /* ============ VERIFY ============ */
  register("verifyReport", {
    name: "Supplier Verification", icon: "shield-check", group: "verify",
    desc: "Risk assessment for a supplier. Never claims verified without evidence — INSUFFICIENT DATA is a valid result.",
    fields: [
      { key: "supplier", label: "Supplier", type: "select", opts: SUPPLIERS.map((s) => s.name), def: SUPPLIERS[0].name },
    ],
    run(v) {
      const s = SUPPLIERS.find((x) => x.name === v.supplier) || SUPPLIERS[0];
      const cls = s.risk.toLowerCase();
      const items = [
        { ic: "building-2", tone: s.verified ? "" : "amber", t: "Business registration", d: s.verified ? "Registration documented" : "Not independently verified" },
        { ic: "flask-conical", tone: "blue", t: "Samples", d: s.verified ? "Sample process documented" : "Request samples before any commitment" },
        { ic: "badge-check", tone: s.certs.length ? "" : "amber", t: "Certifications", d: s.certs.length ? s.certs.join(", ") : "None listed" },
        { ic: "clock", tone: s.ontime >= 85 ? "" : "amber", t: "On-time record", d: s.ontime + "% (supplier-reported — not audited)" },
      ];
      return {
        title: "Verification — " + s.name,
        conf: { level: s.verified ? "medium" : "low", data: "Local supplier snapshot", evidence: s.verified ? "Verified: documented samples + registration" : "INSUFFICIENT DATA for independent confirmation", assumptions: ["Ratings and on-time % are self-reported", "Risk class is our assessment, not a fact"], limitations: ["Only a real audit verifies a supplier — this is a risk screen"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Risk class", v: s.risk, s: "assessment", tone: cls === "low" ? "grn" : cls === "medium" ? "gold" : "red" },
            { l: "Rating", v: s.rating + "/5", s: s.yrs + " years active", tone: "blu" },
            { l: "On-time", v: s.ontime + "%", s: "reported", tone: s.ontime >= 85 ? "grn" : "gold" },
            { l: "Status", v: s.verified ? "VERIFIED" : "NOT VERIFIED", s: "evidence-based", tone: s.verified ? "grn" : "red" },
          ] },
          { t: "list", items },
          { t: "decision", choice: s.risk === "LOW" ? "PROCEED WITH SAMPLE ORDER" : s.risk === "MEDIUM" ? "SAMPLE + EXTRA CHECKS FIRST" : "DO NOT COMMIT — VERIFY FIRST", why: s.risk === "LOW" ? "Low risk class with documented evidence. Order samples, then a trial batch." : s.risk === "MEDIUM" ? "Medium risk — samples and a small trial batch before any volume." : "High risk / insufficient data. Third-party inspection and escrow terms before any real money moves." },
          { t: "tip", tone: "danger", html: "<b>We never mark a supplier VERIFIED without evidence.</b> Labels are only as strong as the document behind them." },
        ],
      };
    },
  });

  /* ============ WATCHLIST / REPORTS ============ */
  register("priceWatch", {
    name: "Price Watch", icon: "star", group: "watchlist",
    desc: "Track a product/platform pair and get alerted when price drops below your threshold.",
    fields: [
      { key: "product", label: "Product", type: "text", def: "Mini electric scrubber" },
      { key: "platform", label: "Platform", type: "select", opts: PLATFORMS.map((p) => p.name).slice(0, 20), def: "Alibaba.com" },
      { key: "price", label: "Current price", type: "number", def: 6.5, unit: "USD" },
      { key: "threshold", label: "Alert if below", type: "number", def: 5.5, unit: "USD" },
    ],
    run(v) {
      const item = { id: uid(), product: v.product, platform: v.platform, price: v.price, threshold: v.threshold, ts: Date.now(), alerted: v.price <= v.threshold };
      watchlist.unshift(item);
      store.set("watchlist", watchlist);
      logRun("priceWatch", "Price Watch", "medium", v.product + " @ " + v.platform);
      return {
        title: "Watched — " + v.product,
        conf: { level: "medium", data: "Your price + threshold", evidence: "Price is what you entered — not a live feed", assumptions: ["Price refreshes need manual/sim refresh", "Same spec across suppliers"], limitations: ["No live price crawler connected"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Current", v: money2(v.price, "USD"), s: "entered price", tone: "blu" },
            { l: "Threshold", v: money2(v.threshold, "USD"), s: "alert trigger", tone: "gold" },
            { l: "Status", v: v.price <= v.threshold ? "ALERT" : "OK", s: "threshold check", tone: v.price <= v.threshold ? "red" : "grn" },
            { l: "Platform", v: v.platform.split(" ")[0], s: "watch target", tone: "pur" },
          ] },
          { t: "decision", choice: v.price <= v.threshold ? "PRICE IS ALREADY AT/UNDER THRESHOLD — CHECK IT" : "WATCHING — RE-CHECK ON PRICE DROP", why: v.price <= v.threshold ? "The entered price is already below your trigger. Verify the spec before jumping in." : "Alert will fire when price drops below " + money2(v.threshold, "USD") + "." },
          { t: "tip", tone: "info", html: "Use the Watchlist tab to see all tracked items and refresh simulated prices." },
        ],
      };
    },
  });

  register("dailyBriefing", {
    name: "Daily Briefing", icon: "sunrise", group: "reports",
    desc: "Today's top sourcing actions from your current state: alerts, low stock, trends and watchlist.",
    fields: [
      { key: "focus", label: "Focus today", type: "select", opts: ["Everything", "Stock risk", "Price drops", "Trends", "Season"], def: "Everything" },
    ],
    run(v) {
      const lowStock = inventory.filter((i) => i.stock <= i.reorderPoint);
      const priceAlerts = watchlist.filter((w) => w.alerted);
      const alertsOn = alertRules.filter((a) => a.triggered);
      const topTrend = TRENDS.slice().sort((a, b) => b.momentum - a.momentum)[0];
      const seSoon = SEASONAL.slice().sort((a, b) => daysTo(a.start) - daysTo(b.start)).slice(0, 3);
      const actions = [];
      if (lowStock.length) actions.push({ ic: "package", tone: "red", t: lowStock.length + " item(s) at/below reorder point", d: lowStock.slice(0, 3).map((i) => esc(i.name) + " (" + i.stock + " ≤ " + i.reorderPoint + ")").join(" · ") + " — trigger PO today." });
      if (priceAlerts.length) actions.push({ ic: "trending-down", tone: "amber", t: priceAlerts.length + " price alert(s) firing", d: priceAlerts.slice(0, 3).map((w) => esc(w.product) + " @" + w.platform).join(" · ") + " — verify spec before buying." });
      if (alertsOn.length) actions.push({ ic: "bell", tone: "amber", t: alertsOn.length + " alert rule(s) triggered", d: alertsOn.slice(0, 3).map((a) => esc(a.name)).join(" · ") });
      actions.push({ ic: "trending-up", tone: "", t: "Top trend to check", d: esc(topTrend.name) + " (momentum " + topTrend.momentum + ") — is it worth a landed-cost run?" });
      actions.push({ ic: "calendar", tone: "blue", t: "Next events", d: seSoon.map((s) => esc(s.name) + " in " + daysTo(s.start) + "d").join(" · ") });
      return {
        title: "Daily sourcing briefing",
        conf: { level: "medium", data: "Your watchlist, alerts, inventory, trend + season snapshots", evidence: "All items derive from local state you created", assumptions: ["Priorities are heuristic", "Prices are last-entered values"], limitations: ["No live market feed"] },
        blocks: [
          { t: "kpis", items: [
            { l: "Stock alerts", v: lowStock.length, s: "reorder needed", tone: lowStock.length ? "red" : "grn" },
            { l: "Price alerts", v: priceAlerts.length, s: "watchlist", tone: priceAlerts.length ? "amber" : "grn" },
            { l: "Rule alerts", v: alertsOn.length, s: "active rules", tone: alertsOn.length ? "amber" : "grn" },
            { l: "Watched items", v: watchlist.length, s: "tracked", tone: "blu" },
          ] },
          { t: "list", items: actions },
          { t: "decision", choice: lowStock.length ? "REORDER LOW STOCK FIRST" : alertsOn.length ? "RESOLVE TRIGGERED ALERTS" : "REVIEW TOP TREND", why: "Stock outs silently kill revenue — fix availability before chasing new products." },
        ],
      };
    },
  });

  register("reportGenerate", {
    name: "Sourcing Report", icon: "file-text", group: "reports",
    desc: "Generate a saved summary report of the current sourcing state.",
    fields: [
      { key: "type", label: "Report type", type: "select", opts: ["Sourcing overview", "Supplier risk", "Stock & inventory", "Season readiness"], def: "Sourcing overview" },
    ],
    run(v) {
      const lowStock = inventory.filter((i) => i.stock <= i.reorderPoint);
      const priceAlerts = watchlist.filter((w) => w.alerted);
      const verifiedSup = SUPPLIERS.filter((s) => s.verified).length;
      let body = "";
      if (v.type === "Sourcing overview") body = `Platforms indexed: ${PLATFORMS.length} · Regions: 7 · Suppliers in registry: ${SUPPLIERS.length} (${verifiedSup} verified) · Watched items: ${watchlist.length} (${priceAlerts.length} price alerts) · Inventory lines: ${inventory.length} (${lowStock.length} low).`;
      if (v.type === "Supplier risk") body = `LOW risk: ${SUPPLIERS.filter((s) => s.risk === "LOW").length} · MEDIUM: ${SUPPLIERS.filter((s) => s.risk === "MEDIUM").length} · HIGH: ${SUPPLIERS.filter((s) => s.risk === "HIGH").length} · Verified with evidence: ${verifiedSup}.`;
      if (v.type === "Stock & inventory") body = `Lines tracked: ${inventory.length} · Below reorder: ${lowStock.length} · Total units: ${inventory.reduce((s, i) => s + i.stock, 0)}. Reorder ${lowStock.map((i) => i.name).join(", ") || "none"} immediately.`;
      if (v.type === "Season readiness") { const s = SEASONAL.slice().sort((a, b) => daysTo(a.start) - daysTo(b.start))[0]; body = `Next event: ${s.name} in ${daysTo(s.start)}d (${s.start}). Affected: ${s.categories.join(", ")}. Prepare stock now.`; }
      const rep = { id: uid(), type: v.type, text: body, ts: Date.now() };
      reports.unshift(rep);
      store.set("reports", reports);
      usage.saved += 1; store.set("usage", usage);
      return {
        title: v.type + " — report generated",
        conf: { level: "medium", data: "Current local state", evidence: "Counts derived from your data", assumptions: ["Overview is structural, not analytical", "Saved to the Reports tab"], limitations: ["Static snapshot at generation time"] },
        blocks: [
          { t: "hl", title: v.type, html: esc(body) },
          { t: "tip", tone: "ok", html: "Saved to Reports → Generated reports. Generate a Market Intel Report or Daily Briefing for deeper reads." },
        ],
      };
    },
  });

  /* ============ AGENT CHAT ============ */
  function agentReply(t) {
    const q = (t || "").toLowerCase();
    if (/hello|hi|salam|help/.test(q)) return "I'm your sourcing agent. Ask me to find sources, check a supplier, plan a season, calculate landed cost, or route an order.";
    if (/best source|source this|find source/.test(q)) return "Use Find Best Source (Discover) with the product name, or send an RFQ via Negotiation. Prices stay ESTIMATED until a supplier quotes.";
    if (/landed cost|margin|profit/.test(q)) return "Run Landed Cost with your freight, duty and VAT — it returns the true per-unit cost and margin. Rates are reference snapshots you can edit in Settings.";
    if (/season|ramadan|eid|holiday/.test(q)) return "Seasonality covers Ramadan, Eid, Black Friday and more, with order-by dates. Ramadan orders should have been placed early — check the countdown.";
    if (/verify|risk|trust|safe/.test(q)) return "Open Verification and pick a supplier. Risk classes: LOW / MEDIUM / HIGH / INSUFFICIENT DATA — nothing is called verified without evidence.";
    if (/stock|inventory|reorder|forecast/.test(q)) return "Inventory shows your items and Stock Forecast computes reorder point, EOQ and max stock from your sales rate and lead time.";
    if (/ship|freight|delivery|eta/.test(q)) return "Shipping Quote compares courier, air and sea for a lane; Fulfillment Routing picks the best warehouse for your target region.";
    if (/watch|price|alert/.test(q)) return "Add items to Price Watch and set thresholds. Alerts fire when price drops below threshold — refresh the watchlist to re-evaluate.";
    if (/drop|dropship/.test(q)) return "Dropship Check scores a product's dropship-fit: margin, ETA and branding. Then Compare suppliers for the best unit cost.";
    if (/report|brief|summary/.test(q)) return "Daily Briefing ranks today's actions (stock, alerts, trends, season). Sourcing Report saves a structured snapshot to the Reports tab.";
    return "I can help with: Find Best Source, Universal Search, Landed Cost, Supplier Verification, Negotiation/RFQ, Stock Forecast, Fulfillment Routing, Price Watch, Trend Radar and Seasonality. Ask in plain language.";
  }

  /* ============ interactive views ============ */
  function renderDashboard() {
    const counts = regionCounts();
    const lowStock = inventory.filter((i) => i.stock <= i.reorderPoint).length;
    const priceAlerts = watchlist.filter((w) => w.alerted).length;
    const trusted = PLATFORMS.filter((p) => p.trusted).length;
    const verifiedSup = SUPPLIERS.filter((s) => s.verified).length;
    const commands = [
      ["Find best source for this product", "Find best source for a mini electric scrubber"],
      ["Products for my market", "Find products for my market in MENA COD"],
      ["Products for an upcoming season", "Find products for Ramadan"],
      ["Like my winning product", "Find products like my massage gun winner"],
      ["Search across platforms", "Universal search for electric scrubber"],
      ["Calculate landed cost", "Calculate landed cost for 300 units"],
      ["Compare 3 suppliers", "Compare suppliers side by side"],
      ["Negotiate a better price", "Negotiate with my supplier"],
      ["Check a supplier", "Verify supplier Yiwu Wholesale"],
      ["Stock forecast", "Forecast stock and reorder point"],
      ["Route my orders", "Route orders to the best warehouse"],
      ["Daily briefing", "Give me my daily sourcing briefing"],
    ];
    return `
      <div class="tool-head"><span class="tool-ic">${ic("command", 19)}</span><div><div class="tool-title">Sourcing Command Center</div><div class="tool-sub">What do you want to source today? Route any request to the right intelligence tool.</div></div></div>
      <div class="bd-card cmd-wrap">
        <div class="cmd-box">
          <span class="cmd-ico">${ic("sparkles", 18)}</span>
          <input id="cmd-input" placeholder="e.g. 'Find best source for a mini electric scrubber' or 'Calculate landed cost'">
          <button class="btn btn-p" id="cmd-go">${ic("arrow-right", 14)} Run</button>
        </div>
        <div class="cmd-chips">${commands.map(([label, h]) => `<button class="cmd-chip" data-cmd="${esc(h)}">${ic("corner-down-right", 11)} ${esc(label)}</button>`).join("")}</div>
      </div>
      <div class="g4" style="margin-bottom:16px">
        <div class="kpi blu"><div class="kpi-l">Platforms indexed</div><div class="kpi-v">${PLATFORMS.length}</div><div class="kpi-s">${trusted} verified · 7 regions · 16 types</div></div>
        <div class="kpi grn"><div class="kpi-l">Suppliers in registry</div><div class="kpi-v">${SUPPLIERS.length}</div><div class="kpi-s">${verifiedSup} with evidence</div></div>
        <div class="kpi gold"><div class="kpi-l">Watched items</div><div class="kpi-v">${watchlist.length}</div><div class="kpi-s">${priceAlerts} price alerts</div></div>
        <div class="kpi red"><div class="kpi-l">Low stock</div><div class="kpi-v">${lowStock}</div><div class="kpi-s">at/below reorder point</div></div>
      </div>
      <div class="eat-grid cols3" style="margin-bottom:0">
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("globe", 18)}</span><div><div class="card-title">World Coverage</div><div class="card-sub">Platform density + health per region.</div></div></div>
          <div class="world-grid">${counts.map((c) => `
            <div class="reg-card">
              <div class="rc-top"><span class="rc-name">${esc(c.region)}</span><span class="rc-count">${c.count} platforms</span></div>
              <div class="rc-bar"><i style="width:${Math.min(100, c.index * 12)}%"></i></div>
              <div class="rc-meta">Health index <b>${c.index}</b>/10 · lead <b>${esc(c.lead)}</b></div>
            </div>`).join("")}</div>
        </div>
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("radar", 18)}</span><div><div class="card-title">Opportunity Radar</div><div class="card-sub">Signals worth acting on this week.</div></div></div>
          <div class="eat-list">
            <div class="eat-li"><span class="li-ic green">${ic("trending-up", 14)}</span><div><div class="li-t">Top trend: ${esc(TRENDS.slice().sort((a, b) => b.momentum - a.momentum)[0].name)}</div><div class="li-d">Momentum ${TRENDS.slice().sort((a, b) => b.momentum - a.momentum)[0].momentum}/100 — run a landed-cost check.</div></div></div>
            <div class="eat-li"><span class="li-ic blue">${ic("calendar", 14)}</span><div><div class="li-t">Next season: ${esc(SEASONAL.slice().sort((a, b) => daysTo(a.start) - daysTo(b.start))[0].name)}</div><div class="li-d">In ${daysTo(SEASONAL.slice().sort((a, b) => daysTo(a.start) - daysTo(b.start))[0].start)} days — plan orders.</div></div></div>
            ${priceAlerts ? `<div class="eat-li"><span class="li-ic amber">${ic("trending-down", 14)}</span><div><div class="li-t">${priceAlerts} price alert(s) firing</div><div class="li-d">Check the Watchlist and verify specs.</div></div></div>` : `<div class="eat-li"><span class="li-ic">${ic("star", 14)}</span><div><div class="li-t">No price alerts</div><div class="li-d">Add products to the Watchlist to track price drops.</div></div></div>`}
          </div>
        </div>
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("refresh-cw", 18)}</span><div><div class="card-title">Business Integration Loop</div><div class="card-sub">PRODUCT AI → SOURCING → ERP → ADS AI.</div></div></div>
          <div class="flow">${["Winning product", "Cheaper source", "Landed cost", "ERP update", "Ads margin"].map((s, i) => `<div class="flow-step"><span class="fs-ic">${ic(["trophy", "factory", "calculator", "layout-dashboard", "megaphone"][i], 16)}</span>${s}</div>`).join("")}</div>
          <button class="btn btn-o btn-sm" id="dash-profit">${ic("refresh-cw", 13)} Run the Sourcing Profit Loop</button>
          <div class="div"></div>
          <div class="tip info"><span class="ti">${ic("lightbulb", 15)}</span><div>Every AI output is a hypothesis with a confidence + evidence label. Connect API keys in Settings when a real backend is available — never in this frontend.</div></div>
        </div>
      </div>`;
  }

  function renderPlatforms() {
    const regions = ["All"].concat(D.REGIONS);
    const types = ["All"].concat(D.TYPES);
    let pool = PLATFORMS.filter((p) => {
      if (platformFilter.region !== "All" && p.region !== platformFilter.region) return false;
      if (platformFilter.type !== "All" && p.type !== platformFilter.type) return false;
      if (platformFilter.api && p.api !== "yes") return false;
      if (platformFilter.q && !(p.name + p.focus + p.country).toLowerCase().includes(platformFilter.q)) return false;
      return true;
    });
    const max = pool.length;
    return `
      <div class="tool-head"><span class="tool-ic">${ic("layers", 19)}</span><div><div class="tool-title">Platform Directory</div><div class="tool-sub">${PLATFORMS.length} platforms across 7 regions and 16 types. One generic connector interface drives all of them — nothing is hard-coded per supplier.</div></div></div>
      <div class="bd-card">
        <div class="pf-filters">
          <input class="input" id="pf-q" placeholder="Search name / focus / country…" value="${esc(platformFilter.q)}">
          <select class="select" id="pf-region" style="min-width:150px">${regions.map((r) => `<option ${platformFilter.region === r ? "selected" : ""}>${esc(r)}</option>`).join("")}</select>
          <select class="select" id="pf-type" style="min-width:170px">${types.map((t) => `<option ${platformFilter.type === t ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>
          <label class="sw" style="gap:6px;font-size:11px;color:var(--muted)"><input type="checkbox" id="pf-api" ${platformFilter.api ? "checked" : ""}> API only</label>
          <button class="btn btn-g btn-sm" id="pf-reset">${ic("rotate-ccw", 13)} Reset</button>
          <span class="pill gray" style="margin-left:auto">${max} shown</span>
        </div>
        <div class="pf-grid" id="pf-grid">
          ${pool.map((p) => `
            <div class="pf-card">
              <div class="pf-top">
                <div class="pf-name">${esc(p.name)}</div>
                <span class="pf-flag">${ic(p.type === "Dropshipping" ? "package-open" : p.type === "Wholesale" ? "shopping-basket" : p.type === "Manufacturer" ? "factory" : p.type === "Liquidation" ? "hammer" : p.type === "Print on Demand" ? "shirt" : "globe", 15)}</span>
              </div>
              <div class="pf-focus">${esc(p.focus)}</div>
              <div class="pf-meta">
                <span class="tag gray">${p.region}</span><span class="tag ${p.trusted ? "green" : "amber"}">${p.trusted ? "VERIFIED" : "ESTIMATED"}</span><span class="tag blue">${esc(p.type)}</span>
              </div>
              <div class="pf-cap">${(p.cap || []).map((c) => `<span class="tag gray">${c}</span>`).join("")}</div>
              <div class="pf-foot">
                <div style="font-size:10px;color:var(--muted2)">MOQ ${esc(p.moq)} · ${esc(p.ship)}<br>rating ${p.rating}/10 · API ${p.api}</div>
                <button class="btn btn-o btn-sm" data-watch-pf="${p.id}">${ic("star", 12)} Watch</button>
              </div>
            </div>`).join("") || `<div class="empty">${ic("search-x", 26)} No platforms match the filters.</div>`}
        </div>
      </div>`;
  }

  function renderConnectors() {
    const statuses = ["connected", "needs-key", "manual"];
    const rows = PLATFORMS.map((p, i) => {
      const st = p.api === "yes" ? "connected" : p.api === "partial" ? "needs-key" : "manual";
      return [`
        <b>${esc(p.name)}</b><br><small>${esc(p.type)} · ${esc(p.region)}</small>`,
        `<span class="con-intf">GenericConnector::${esc(p.id)}</span>`,
        (p.cap || []).map((c) => `<span class="tag gray">${c}</span>`).join(" "),
        `<span class="pill ${st === "connected" ? "green" : st === "needs-key" ? "amber" : "gray"}">${st}</span>`,
        `<small>${st === "connected" ? "synced 5m ago" : st === "needs-key" ? "paste key in Settings" : "CSV / manual upload"}</small>`,
        `<span class="tag ${p.trusted ? "green" : "amber"}">${p.trusted ? "verified" : "estimated"}</span>`];
    });
    return `
      <div class="tool-head"><span class="tool-ic">${ic("cable", 19)}</span><div><div class="tool-title">Connector Architecture</div><div class="tool-sub">One interface contract — search, price, inventory, orders, supplier — implemented by every platform. No per-platform business logic lives in the UI.</div></div></div>
      <div class="bd-card">
        <div class="tbl-wrap"><table class="eat-tbl">
          <thead><tr><th>Platform</th><th>Connector instance</th><th>Capabilities</th><th>Sync status</th><th>Last sync</th><th>Data evidence</th></tr></thead>
          <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
        </table></div>
        <div class="div"></div>
        <div class="g2" style="gap:10px">
          <div class="tip info"><span class="ti">${ic("terminal", 15)}</span><div><b>Interface contract</b> — every connector exposes: <span style="font-family:var(--mono)">search(q) · quote(spec) · stock(sku) · order(items) · sync()</span>. The app talks to the interface, never to a platform's private API.</div></div>
          <div class="tip warn"><span class="ti">${ic("key", 15)}</span><div><b>No keys in the frontend.</b> API keys live server-side or in Settings as placeholders for a future backend. This demo never stores real credentials.</div></div>
        </div>
        <div class="sec-h">${ic("server", 15)} Provider routing (future backend)</div>
        <div class="tbl-wrap"><table class="eat-tbl"><thead><tr><th>Role</th><th>Provider</th><th>Fallback</th></tr></thead><tbody>
          ${[["Search / catalog", "OpenRouter → Alibaba/Made-in-China open APIs", "Manual CSV"], ["Supplier data", "Global Sources / ThomasNet feeds", "Portal export"], ["Market intel", "Trend providers", "Inferred from snapshots"], ["Translation / negotiation", "Language model", "Fast model"]].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}
        </tbody></table></div>
      </div>`;
  }

  function renderSuppliers() {
    return `
      <div class="tool-head"><span class="tool-ic">${ic("factory", 19)}</span><div><div class="tool-title">Supplier Registry</div><div class="tool-sub">Every supplier carries a risk class and an evidence label. Verification lives in the Verification tab.</div></div></div>
      <div class="sup-grid">
        ${SUPPLIERS.map((s) => `
          <div class="sup-card">
            <div class="sc-head">
              <div class="sc-name">${esc(s.name)}</div>
              <span class="risk ${s.risk.toLowerCase() === "low" ? "low" : s.risk.toLowerCase() === "medium" ? "medium" : "high"}">${s.risk}</span>
            </div>
            <div class="sc-detail"><b>${esc(s.country)}</b> · ${esc(s.region)}<br>${esc(s.focus)}</div>
            <div class="sc-stats">
              <span>MOQ <b>${s.moq}+</b></span><span>Unit <b>$${fmtN(s.cost, 1)}</b></span><span>Rating <b>${s.rating}/5</b></span><span>On-time <b>${s.ontime}%</b></span>
            </div>
            <div class="sc-meta" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px">
              ${(s.certs || []).map((c) => `<span class="tag blue">${esc(c)}</span>`).join("")}
              ${s.verified ? `<span class="tag green">EVIDENCE: samples documented</span>` : `<span class="tag red">NOT VERIFIED</span>`}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              ${(s.platforms || []).map((p) => `<span class="tag gray">${esc(p)}</span>`).join("")}
            </div>
            <div class="div" style="margin:10px 0 8px"></div>
            <button class="btn btn-g btn-sm" data-verify-sup="${s.id}">${ic("shield-check", 12)} Verify</button>
          </div>`).join("")}
      </div>`;
  }

  function renderWarehouses() {
    return `
      <div class="tool-head"><span class="tool-ic">${ic("boxes", 19)}</span><div><div class="tool-title">Warehouse Network</div><div class="tool-sub">Global fulfillment network — capacity, cost and transit per region. Snapshot, not live telemetry.</div></div></div>
      <div class="bd-card">
        ${WAREHOUSES.map((w) => {
          const fill = Math.round((w.used / w.capacity) * 100);
          return `
          <div class="wh-row">
            <div>
              <div class="wh-name">${esc(w.name)} <span class="tag gray">${w.region}</span></div>
              <div class="wh-sub">${esc(w.city)} · ${esc(w.services.join(" · "))}</div>
              <div class="pbw"><div class="pbbg"><div class="pbf" style="width:${fill}%;background:${fill >= 85 ? "var(--red)" : fill >= 60 ? "var(--amber)" : "var(--green)"}"></div></div></div>
              <div class="pbh" style="margin:0"><span>capacity ${fmt(w.used)} / ${fmt(w.capacity)} kg</span><span style="color:${fill >= 85 ? "var(--red)" : "var(--muted2)"}">${fill}%</span></div>
            </div>
            <div class="wh-right">
              <div class="wh-price">$${fmtN(w.costPerKg, 2)}/kg</div>
              <div class="wh-cost">transit ${esc(w.transit)}</div>
            </div>
          </div>`;
        }).join("")}
        <div class="tip info"><span class="ti">${ic("lightbulb", 15)}</span><div>Use <b>Fulfillment Routing</b> to let the AI pick the best warehouse per order. The Shenzhen Hub consolidates sourcing; regional hubs handle last mile.</div></div>
      </div>`;
  }

  function renderInventory() {
    const rows = inventory.map((i) => {
      const low = i.stock <= i.reorderPoint;
      return [`<b>${esc(i.name)}</b><br><small>${esc(i.sku)}</small>`, i.region, `${fmt(i.stock)} u`, `${fmt(i.reorderPoint)} u`, `${money2(i.cost, "USD")}`, low ? `<span class="tag red">REORDER</span>` : `<span class="tag green">OK</span>`, `<button class="btn btn-g btn-sm" data-inv-del="${i.id}">${ic("trash-2", 12)}</button>`];
    });
    return `
      <div class="tool-head"><span class="tool-ic">${ic("package", 19)}</span><div><div class="tool-title">Inventory</div><div class="tool-sub">Stock levels, reorder points and low-stock flags. Use Stock Forecast to compute the right numbers.</div></div></div>
      <div class="bd-card">
        <div class="tbl-wrap"><table class="eat-tbl"><thead><tr><th>Product</th><th>Region</th><th>Stock</th><th>Reorder</th><th>Landed cost</th><th>Status</th><th></th></tr></thead><tbody>
          ${rows.map((r) => `<tr class="${r[5].includes("REORDER") ? "danger" : ""}">${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="7"><div class="empty">No inventory items.</div></td></tr>`}
        </tbody></table></div>
        <div class="div"></div>
        <div class="g2">
          <div class="fld"><label class="flbl">Product name</label><input class="input" id="inv-name" placeholder="e.g. Electric scrubber v2"></div>
          <div class="fld"><label class="flbl">SKU</label><input class="input" id="inv-sku" placeholder="e.g. ES-5001"></div>
          <div class="fld"><label class="flbl">Stock units</label><input class="input" id="inv-stock" type="number" value="100"></div>
          <div class="fld"><label class="flbl">Reorder point</label><input class="input" id="inv-rp" type="number" value="50"></div>
          <div class="fld"><label class="flbl">Landed cost (USD)</label><input class="input" id="inv-cost" type="number" value="5"></div>
          <div class="fld"><label class="flbl">Region</label><select class="select" id="inv-region" style="width:100%">${D.REGIONS.map((r) => `<option>${esc(r)}</option>`).join("")}</select></div>
        </div>
        <button class="btn btn-p btn-sm" id="inv-add">${ic("plus", 13)} Add item</button>
        <div class="tip warn" style="margin-top:12px"><span class="ti">${ic("alert-triangle", 15)}</span><div><b>Stock outs kill revenue.</b> The moment an item hits its reorder point, place the purchase order — do not wait for the stock to run out.</div></div>
      </div>`;
  }

  function renderOrders() {
    const rows = orders.slice(0, 12).map((o) => [`<b>${esc(o.id)}</b>`, esc(o.product), `${fmt(o.qty)} u`, `${fmtN(o.weightKg, 1)} kg`, esc(o.dest), `<span class="tag blue">${esc(o.wh)}</span>`, esc(o.eta), o.urgent, new Date(o.ts).toLocaleString()]);
    return `
      <div class="tool-head"><span class="tool-ic">${ic("shopping-cart", 19)}</span><div><div class="tool-title">Orders</div><div class="tool-sub">Incoming orders routed automatically to the best warehouse + carrier. Route one below.</div></div></div>
      <div class="bd-card">
        <div class="g2">
          <div class="fld"><label class="flbl">Product</label><input class="input" id="or-product" placeholder="e.g. Mini electric scrubber"></div>
          <div class="fld"><label class="flbl">Quantity</label><input class="input" id="or-qty" type="number" value="10"></div>
          <div class="fld"><label class="flbl">Total weight (kg)</label><input class="input" id="or-weight" type="number" value="6"></div>
          <div class="fld"><label class="flbl">Delivery region</label><select class="select" id="or-region" style="width:100%">${D.REGIONS.map((r) => `<option>${esc(r)}</option>`).join("")}</select></div>
        </div>
        <button class="btn btn-p btn-sm" id="or-route">${ic("git-compare-arrows", 13)} Route order</button>
        <div id="or-out" style="margin-top:12px"></div>
        <div class="sec-h" style="margin-top:18px">${ic("history", 15)} Recent routed orders</div>
        <div class="tbl-wrap"><table class="eat-tbl"><thead><tr><th>ID</th><th>Product</th><th>Qty</th><th>Weight</th><th>Dest</th><th>Warehouse</th><th>ETA</th><th>Priority</th><th>Time</th></tr></thead><tbody>
          ${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="9"><div class="empty">No orders yet — route one above.</div></td></tr>`}
        </tbody></table></div>
      </div>`;
  }

  function renderWatchlist() {
    const rows = watchlist.map((w) => `
      <div class="wl-row ${w.alerted ? "alerted" : ""}">
        <span class="tool-ic" style="width:32px;height:32px">${ic(w.alerted ? "bell-ring" : "star", 14)}</span>
        <div style="flex:1">
          <div class="wl-name">${esc(w.product)} <span class="tag gray">${esc(w.platform)}</span></div>
          <div class="wl-sub">current ${money2(w.price, "USD")} · alert if below ${money2(w.threshold, "USD")}</div>
        </div>
        <div class="wl-price" style="color:${w.alerted ? "var(--amber)" : "var(--green)"}">${w.alerted ? "ALERT" : "OK"}</div>
        <button class="btn btn-g btn-sm" data-wl-del="${w.id}">${ic("trash-2", 12)}</button>
      </div>`).join("") || `<div class="empty">${ic("star", 26)} Nothing watched yet. Use Price Watch to add items.</div>`;
    return `
      <div class="tool-head"><span class="tool-ic">${ic("star", 19)}</span><div><div class="tool-title">Watchlist</div><div class="tool-sub">Track products and get price alerts. Refresh simulates a price update to re-evaluate thresholds.</div></div></div>
      <div class="bd-card">
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          <button class="btn btn-g btn-sm" id="wl-refresh">${ic("refresh-cw", 13)} Simulate price refresh</button>
          <span class="fhint" style="align-self:center">${watchlist.length} item(s) · ${watchlist.filter((w) => w.alerted).length} alert(s) firing</span>
        </div>
        ${rows}
      </div>`;
  }

  function renderAlerts() {
    const rows = alertRules.map((a) => [`<b>${esc(a.name)}</b>`, esc(a.type), `${esc(a.condition)} ${a.value}`, a.active ? `<span class="tag green">active</span>` : `<span class="tag gray">paused</span>`, a.triggered ? `<span class="tag amber">TRIGGERED</span>` : `<span class="tag blue">waiting</span>`, `<button class="btn btn-g btn-sm" data-al-del="${a.id}">${ic("trash-2", 12)}</button>`]);
    return `
      <div class="tool-head"><span class="tool-ic">${ic("bell", 19)}</span><div><div class="tool-title">Alerts</div><div class="tool-sub">Automatic conditions evaluated against your watchlist and inventory.</div></div></div>
      <div class="bd-card">
        <div class="g2">
          <div class="fld"><label class="flbl">Rule name</label><input class="input" id="al-name" placeholder="e.g. Reorder scrubber"></div>
          <div class="fld"><label class="flbl">Type</label><select class="select" id="al-type" style="width:100%"><option>Price drop</option><option>Stock low</option><option>Season near</option></select></div>
          <div class="fld"><label class="flbl">Condition</label><select class="select" id="al-cond" style="width:100%"><option>below</option><option>equals</option><option>above</option></select></div>
          <div class="fld"><label class="flbl">Value</label><input class="input" id="al-value" type="number" value="5"></div>
        </div>
        <button class="btn btn-p btn-sm" id="al-add">${ic("plus", 13)} Add rule</button>
        <div class="sec-h" style="margin-top:18px">${ic("bell", 15)} Alert rules</div>
        <div class="tbl-wrap"><table class="eat-tbl"><thead><tr><th>Rule</th><th>Type</th><th>Condition</th><th>State</th><th>Status</th><th></th></tr></thead><tbody>
          ${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="6"><div class="empty">No alert rules yet.</div></td></tr>`}
        </tbody></table></div>
      </div>`;
  }

  function renderAgent() {
    const bubbles = chatLog.slice(-30).map((m) => `<div class="chat-bub ${m.role === "me" ? "me" : "ai"}">${esc(m.text)}</div>`).join("") || `<div class="chat-bub ai">I'm your sourcing agent. Ask about finding sources, checking suppliers, landed costs, seasons, stock, shipping or price watches.</div>`;
    return `
      <div class="tool-head"><span class="tool-ic">${ic("bot", 19)}</span><div><div class="tool-title">AI Sourcing Agent</div><div class="tool-sub">Routes questions to the right tool and explains what is estimated vs verified.</div></div></div>
      <div class="bd-card">
        <div class="chat-log" id="chat-log">${bubbles}</div>
        <div class="chat-input">
          <input class="input" id="chat-input" placeholder="e.g. What should I source for Ramadan?" style="flex:1">
          <button class="btn btn-p" id="chat-send">${ic("send", 14)} Send</button>
        </div>
      </div>`;
  }

  function renderReports() {
    const repRows = reports.slice(0, 10).map((r) => [`<b>${esc(r.type)}</b>`, esc(r.text), new Date(r.ts).toLocaleString()]);
    return `
      <div class="tool-head"><span class="tool-ic">${ic("file-text", 19)}</span><div><div class="tool-title">Reports</div><div class="tool-sub">Daily briefing, structured snapshots and generated reports.</div></div></div>
      <div class="eat-grid cols3" style="margin-bottom:0">
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("sunrise", 18)}</span><div><div class="card-title">Daily Briefing</div><div class="card-sub">Today's top sourcing actions.</div></div></div>
          <div class="fld"><label class="flbl">Focus</label><select class="select" data-f="focus" style="width:100%"><option>Everything</option><option>Stock risk</option><option>Price drops</option><option>Trends</option><option>Season</option></select></div>
          <button class="btn btn-p btn-sm" data-run="dailyBriefing">${ic("sunrise", 13)} Run briefing</button>
          <div id="out-dailyBriefing" style="margin-top:10px"></div>
        </div>
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("file-text", 18)}</span><div><div class="card-title">Sourcing Report</div><div class="card-sub">Structured snapshot, saved below.</div></div></div>
          <div class="fld"><label class="flbl">Type</label><select class="select" data-f="type" style="width:100%"><option>Sourcing overview</option><option>Supplier risk</option><option>Stock & inventory</option><option>Season readiness</option></select></div>
          <button class="btn btn-p btn-sm" data-run="reportGenerate">${ic("file-plus", 13)} Generate & save</button>
          <div id="out-reportGenerate" style="margin-top:10px"></div>
        </div>
        <div class="bd-card">
          <div class="card-head"><span class="tool-ic">${ic("layout-grid", 18)}</span><div><div class="card-title">Generated reports</div><div class="card-sub">${reports.length} saved · ${usage.saved} total.</div></div></div>
          <div class="tbl-wrap"><table class="eat-tbl"><thead><tr><th>Type</th><th>Content</th><th>Time</th></tr></thead><tbody>
            ${repRows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("") || `<tr><td colspan="3"><div class="empty">No reports yet — generate one.</div></td></tr>`}
          </tbody></table></div>
        </div>
      </div>`;
  }

  function renderHistory() {
    const rows = history.map((h) => `
      <div class="hist-item"><span class="h-ic">${ic("sparkles", 14)}</span>
        <div style="flex:1"><div class="h-t">${esc(h.tool)} <span class="tag ${h.conf === "high" ? "green" : h.conf === "medium" ? "amber" : "red"}">${esc(h.conf || "low")}</span></div>
        <div class="h-d">${esc(h.summary || "")}</div></div>
        <span class="h-time">${new Date(h.ts).toLocaleString()}</span>
      </div>`).join("") || `<div class="empty">${ic("history", 26)} No runs yet — run a tool or a command.</div>`;
    return `
      <div class="tool-head"><span class="tool-ic">${ic("history", 19)}</span><div><div class="tool-title">Sourcing History</div><div class="tool-sub">Every run with tool, confidence and summary.</div></div></div>
      <div class="bd-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span class="pill gray">${history.length} runs · ${usage.runs} total</span>
          <button class="btn btn-g btn-sm" id="hist-clear">${ic("trash-2", 12)} Clear</button>
        </div>
        ${rows}
      </div>`;
  }

  function renderSettings() {
    const curRows = Object.keys(CUR).map((c) => {
      const cur = CUR[c];
      return [`<b>${c}</b> <small>${cur.name}</small>`, cur.symbol, `<input class="input" style="width:110px;padding:4px 8px" data-rate="${c}" type="number" step="0.0001" value="${fmtN(ctx.rates && ctx.rates[c] ? ctx.rates[c] : cur.perUSD, 4)}">`];
    });
    return `
      <div class="tool-head"><span class="tool-ic">${ic("settings", 19)}</span><div><div class="tool-title">Settings</div><div class="tool-sub">Reference rates, business context, AI provider routing and connector keys. Keys are placeholders — never stored in the frontend.</div></div></div>
      <div class="bd-card">
        <div class="sec-h">${ic("globe", 15)} Business context</div>
        <div class="g2">
          ${[["market", "Target market"], ["region", "Home region"], ["currency", "Base currency"], ["brand", "Business / brand"]].map(([k, l]) => `<div class="fld"><label class="flbl">${l}</label><input class="input" data-ctx="${k}" value="${esc(ctx[k] || "")}"></div>`).join("")}
        </div>
        <div class="sec-h">${ic("coins", 15)} Currency reference engine</div>
        <p class="fhint">Rates per 1 USD — reference snapshot, editable. Converting at a stale rate silently kills margin. Marked <span class="tag amber">REFERENCE</span> in every output.</p>
        <div class="tbl-wrap" style="max-height:320px;overflow:auto"><table class="eat-tbl"><thead><tr><th>Currency</th><th>Symbol</th><th>Per 1 USD</th></tr></thead><tbody>
          ${curRows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}
        </tbody></table></div>
        <button class="btn btn-p btn-sm" id="ctx-save">${ic("save", 13)} Save context + rates</button>
        <div class="sec-h">${ic("server", 15)} AI provider routing (future)</div>
        <div class="tbl-wrap"><table class="eat-tbl"><thead><tr><th>Task</th><th>Provider</th><th>Fallback</th></tr></thead><tbody>
          ${[["Catalog search", "OpenRouter", "Manual CSV"], ["Supplier intelligence", "Reasoning model", "Snapshot data"], ["Translation / negotiation", "Language model", "Fast model"], ["Vision (product images)", "Gemini", "OpenAI"]].map((r) => `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}
        </tbody></table></div>
        <div class="sec-h">${ic("key", 15)} Connector keys</div>
        <div class="tip warn"><span class="ti">${ic("shield-alert", 15)}</span><div><b>Security:</b> this frontend never stores real API keys. When a backend exists, keys live server-side and this page calls a secure endpoint.</div></div>
        <div class="g2">
          <div class="fld"><label class="flbl">Connector placeholder (not saved)</label><input class="input" type="password" placeholder="sk-…" disabled></div>
          <div class="fld"><label class="flbl">Region default</label><select class="select" data-ctx="region" style="width:100%">${D.REGIONS.map((r) => `<option ${ctx.region === r ? "selected" : ""}>${esc(r)}</option>`).join("")}</select></div>
        </div>
      </div>`;
  }

  function renderGroup() {
    const g = GROUPS.find((x) => x.id === activeGroup);
    if (!g) return "<div class='empty'>Unknown view</div>";
    if (activeGroup === "dashboard") return renderDashboard();
    if (activeGroup === "platforms") return renderPlatforms();
    if (activeGroup === "connectors") return renderConnectors();
    if (activeGroup === "suppliers") return renderSuppliers();
    if (activeGroup === "warehouses") return renderWarehouses();
    if (activeGroup === "inventory") return renderInventory();
    if (activeGroup === "orders") return renderOrders();
    if (activeGroup === "watchlist") return renderWatchlist();
    if (activeGroup === "alerts") return renderAlerts();
    if (activeGroup === "agent") return renderAgent();
    if (activeGroup === "reports") return renderReports();
    if (activeGroup === "history") return renderHistory();
    if (activeGroup === "settings") return renderSettings();

    const tools = Object.values(TOOLS).filter((t) => t.group === activeGroup);
    if (!tools.length) return "<div class='empty'>No tools in this group yet</div>";
    const tabs = tools.map((t) => `<button class="eat-secbtn${activeTool === t.id ? " active" : ""}" data-tooltab="${t.id}">${ic(t.icon, 12)} ${t.name}</button>`).join("");
    const current = activeTool && tools.find((t) => t.id === activeTool) ? TOOLS[activeTool] : tools[0];
    return `<div class="eat-secnav">${tabs}</div>` + toolPage(current.id);
  }

  function toolPage(toolId) {
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
      const unit = f.unit ? `<div class="unit">${esc(f.unit)}</div>` : "";
      const cls = f.unit ? " input iu" : " input";
      return `<div class="fld"><label class="flbl">${esc(f.label)}</label><div class="iw">${unit}<input class="${cls}" data-f="${f.key}" value="${val}" placeholder="${esc(f.ph || "")}"></div></div>`;
    }).join("");
    return `
      <div class="tool-head"><span class="tool-ic">${ic(t.icon, 19)}</span><div><div class="tool-title">${esc(t.name)}</div><div class="tool-sub">${esc(t.desc)}</div></div></div>
      <div class="bd-card">
        <div class="eat-grid" style="gap:14px">
          <div>${fields}
            <button class="btn btn-p btn-sm" data-run="${toolId}" data-group="${t.group}">${ic("sparkles", 14)} Run AI</button>
            <span class="fhint" style="display:inline-block;margin-left:8px">Every run shows confidence + evidence.</span>
          </div>
          <div id="out-${toolId}"></div>
        </div>
      </div>`;
  }

  /* ---------- run / events ---------- */
  function collectFields(toolId) {
    const t = TOOLS[toolId];
    const v = {};
    document.querySelectorAll(`[data-f]`).forEach((el) => {
      const key = el.dataset.f;
      const field = (t.fields || []).find((f) => f.key === key);
      if (!field) return;
      const raw = el.value;
      v[key] = field.type === "number" ? Number(raw) : raw;
      if (field.type === "number" && isNaN(v[key])) v[key] = 0;
    });
    return v;
  }

  function runTool(toolId, hostId) {
    const t = TOOLS[toolId];
    if (!t) return;
    const host = $(hostId || "out-" + toolId);
    if (!host) return;
    const v = collectFields(toolId);
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

  function routeCommand(text) {
    const t = text.toLowerCase();
    const map = [
      { re: /best source|source this|find source/i, g: "discover", t: "findBestSource" },
      { re: /like my winner|similar.*winner|like my product/i, g: "discover", t: "findLikeWinner" },
      { re: /products for (my )?market|for my market|find products.*market/i, g: "discover", t: "findForMarket" },
      { re: /ramadan|eid|season|holiday/i, g: "discover", t: "findForSeason" },
      { re: /reverse|where.*sold|competitor source/i, g: "products", t: "reverseSearch" },
      { re: /universal|search|find (it |the )?product|find .*platform/i, g: "products", t: "universalSearch" },
      { re: /landed cost|landed|true cost/i, g: "landedcost", t: "landedCost" },
      { re: /compare supplier|compare.*supplier/i, g: "compare", t: "compareSuppliers" },
      { re: /profit loop|cheaper supplier|re-source|reinvest/i, g: "compare", t: "profitLoop" },
      { re: /negotiate|negotiator/i, g: "negotiate", t: "negotiationAI" },
      { re: /translate|language/i, g: "negotiate", t: "translator" },
      { re: /rfq|quote request/i, g: "negotiate", t: "rfqBuilder" },
      { re: /qc|quality/i, g: "negotiate", t: "qcChecklist" },
      { re: /sample/i, g: "negotiate", t: "samplePlan" },
      { re: /wholesale/i, g: "wholesale", t: "wholesalePlan" },
      { re: /private label|oem|odm|white label/i, g: "privatelabel", t: "privateLabel" },
      { re: /dropship/i, g: "dropship", t: "dropshipCheck" },
      { re: /fulfillment|warehouse.*route|route.*warehouse/i, g: "fulfillment", t: "fulfillmentRoute" },
      { re: /shipping|freight|courier|sea|air/i, g: "shipping", t: "shippingQuote" },
      { re: /route.*order|order.*route|route.*order/i, g: "orders", t: "orderRoute" },
      { re: /stock|forecast|reorder|inventory.*(forecast|plan)/i, g: "inventory", t: "stockForecast" },
      { re: /market.*report|market intel|region.*report/i, g: "market", t: "marketReport" },
      { re: /trend/i, g: "trends", t: "trendRadar" },
      { re: /season.*(plan|calendar)|calendar/i, g: "seasonality", t: "seasonPlan" },
      { re: /verify|risk|safe|trust.*supplier/i, g: "verify", t: "verifyReport" },
      { re: /watch|price.*(track|alert|drop)/i, g: "watchlist", t: "priceWatch" },
      { re: /brief|today|what.*do.*today/i, g: "reports", t: "dailyBriefing" },
      { re: /report/i, g: "reports", t: "reportGenerate" },
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
        if (btn) { btn.click(); return; }
        runTool(r.t);
      }, 120);
      toast("Routed to " + TOOLS[r.t].name, "info");
    } else {
      navigate("agent");
      setTimeout(() => {
        const inp = $("chat-input");
        if (inp) { inp.value = text; $("chat-send").click(); }
      }, 120);
    }
  }

  function refreshPrices() {
    let changed = 0;
    watchlist.forEach((w) => {
      const drift = (rng(hsh(w.product + w.ts))() * 2 - 1) * 0.4;
      w.price = Math.max(0.5, Math.round((w.price + drift) * 100) / 100);
      if (w.price <= w.threshold) { w.alerted = true; changed++; } else w.alerted = false;
    });
    store.set("watchlist", watchlist);
    return changed;
  }

  function evaluateAlerts() {
    alertRules.forEach((a) => {
      let triggered = false;
      if (a.type === "Price drop") triggered = watchlist.some((w) => w.price <= a.value);
      if (a.type === "Stock low") triggered = inventory.some((i) => i.stock <= a.value);
      if (a.type === "Season near") triggered = SEASONAL.some((s) => daysTo(s.start) <= a.value);
      a.triggered = triggered;
    });
    store.set("alerts", alertRules);
  }

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
    if (e.target.closest("#cmd-input") && e.key === "Enter") { const v = $("cmd-input"); if (v) runCommand(v.value); return; }

    if (e.target.closest("#dash-profit")) { navigate("compare", "profitLoop"); setTimeout(() => runTool("profitLoop"), 120); return; }

    const watchPf = e.target.closest("[data-watch-pf]");
    if (watchPf) {
      const p = PLATFORMS.find((x) => x.id === watchPf.dataset.watchPf);
      if (p) {
        const item = { id: uid(), product: p.name, platform: p.name, price: Math.round((3 + Math.random() * 8) * 100) / 100, threshold: 0, ts: Date.now(), alerted: false, fromPf: true };
        watchlist.unshift(item); store.set("watchlist", watchlist);
        toast(p.name + " added to watchlist", "ok");
      }
      return;
    }
    const verifySup = e.target.closest("[data-verify-sup]");
    if (verifySup) {
      const s = SUPPLIERS.find((x) => x.id === verifySup.dataset.verifySup);
      if (s) {
        navigate("verify", "verifyReport");
        setTimeout(() => {
          const sel = document.querySelector(`[data-f="supplier"]`);
          if (sel) { sel.value = s.name; runTool("verifyReport"); }
        }, 120);
      }
      return;
    }

    const invDel = e.target.closest("[data-inv-del]");
    if (invDel) { inventory = inventory.filter((i) => i.id !== invDel.dataset.invDel); store.set("inventory", inventory); render(); icons(); return; }
    if (e.target.closest("#inv-add")) {
      const name = $("inv-name"), sku = $("inv-sku"), stock = $("inv-stock"), rp = $("inv-rp"), cost = $("inv-cost"), region = $("inv-region");
      if (!name || !name.value.trim()) return toast("Product name required", "warn");
      inventory.unshift({ id: uid(), name: name.value.trim(), sku: (sku && sku.value.trim()) || "SKU", stock: Number(stock && stock.value) || 0, reorderPoint: Number(rp && rp.value) || 0, cost: Number(cost && cost.value) || 0, region: (region && region.value) || "Middle East" });
      store.set("inventory", inventory);
      render(); icons(); toast("Inventory item added", "ok");
      return;
    }

    if (e.target.closest("#or-route")) {
      const product = $("or-product"), qty = $("or-qty"), weight = $("or-weight"), region = $("or-region");
      const wh = WAREHOUSES.filter((w) => w.region === (region && region.value)).sort((a, b) => a.costPerKg - b.costPerKg)[0] || WAREHOUSES[0];
      const cost = Math.round(wh.costPerKg * (Number(weight && weight.value) || 0) * 100) / 100;
      const item = { id: uid(), product: (product && product.value) || "Product", qty: Number(qty && qty.value) || 0, weightKg: Number(weight && weight.value) || 0, dest: (region && region.value) || "Middle East", urgent: "Standard", wh: wh.name, eta: wh.transit, ts: Date.now(), status: "routed" };
      orders.unshift(item); store.set("orders", orders);
      const host = $("or-out");
      host.innerHTML = `<div class="tip ok"><span class="ti">${ic("check-circle", 15)}</span><div>Order <b>${item.id}</b> routed to <b>${esc(wh.name)}</b> ($${fmtN(cost, 2)} · ETA ${esc(wh.transit)}).</div></div>`;
      const tbl = document.querySelector("#or-out");
      toast("Order routed to " + wh.name, "ok");
      renderOrdersFill();
      return;
    }

    if (e.target.closest("#wl-refresh")) {
      const changed = refreshPrices();
      evaluateAlerts();
      render(); icons();
      toast(changed ? changed + " alert(s) firing after price refresh" : "Prices refreshed — no new alerts", changed ? "warn" : "info");
      return;
    }
    const wlDel = e.target.closest("[data-wl-del]");
    if (wlDel) { watchlist = watchlist.filter((w) => w.id !== wlDel.dataset.wlDel); store.set("watchlist", watchlist); render(); icons(); return; }

    const alDel = e.target.closest("[data-al-del]");
    if (alDel) { alertRules = alertRules.filter((a) => a.id !== alDel.dataset.alDel); store.set("alerts", alertRules); render(); icons(); return; }
    if (e.target.closest("#al-add")) {
      const name = $("al-name"), type = $("al-type"), cond = $("al-cond"), value = $("al-value");
      if (!name || !name.value.trim()) return toast("Rule name required", "warn");
      alertRules.unshift({ id: uid(), name: name.value.trim(), type: type.value, condition: cond.value, value: Number(value && value.value) || 0, active: true, triggered: false });
      store.set("alerts", alertRules);
      evaluateAlerts();
      render(); icons(); toast("Alert rule added", "ok");
      return;
    }

    if (e.target.closest("#chat-send") || (e.target.id === "chat-input" && e.key === "Enter")) {
      const inp = $("chat-input");
      const v = inp ? inp.value.trim() : "";
      if (!v) return;
      chatLog.push({ role: "me", text: v, ts: Date.now() });
      store.set("chat", chatLog.slice(-60));
      renderChatFill();
      const reply = agentReply(v);
      setTimeout(() => {
        chatLog.push({ role: "ai", text: reply, ts: Date.now() });
        store.set("chat", chatLog.slice(-60));
        renderChatFill();
      }, 500);
      return;
    }

    if (e.target.closest("#ctx-save")) {
      document.querySelectorAll("[data-ctx]").forEach((el) => { ctx[el.dataset.ctx] = el.value.trim(); });
      ctx.rates = ctx.rates || {};
      document.querySelectorAll("[data-rate]").forEach((el) => { ctx.rates[el.dataset.rate] = Number(el.value); });
      saveCtx();
      toast("Context + reference rates saved", "ok");
      render(); icons();
      return;
    }

    if (e.target.closest("#hist-clear")) { history = []; store.set("history", history); render(); icons(); toast("History cleared", "info"); return; }

    if (e.target.closest("#pf-reset")) { platformFilter = { region: "All", type: "All", q: "", api: false }; render(); icons(); return; }
    const pfq = e.target.closest("#pf-q"); if (pfq) { platformFilter.q = pfq.value.toLowerCase(); renderPlatformsFill(); return; }
    const pfRegion = e.target.closest("#pf-region"); if (pfRegion) { platformFilter.region = pfRegion.value; renderPlatformsFill(); return; }
    const pfType = e.target.closest("#pf-type"); if (pfType) { platformFilter.type = pfType.value; renderPlatformsFill(); return; }
    const pfApi = e.target.closest("#pf-api"); if (pfApi) { platformFilter.api = pfApi.checked; renderPlatformsFill(); return; }
  }

  function renderPlatformsFill() {
    const grid = $("pf-grid");
    if (!grid) return;
    let pool = PLATFORMS.filter((p) => {
      if (platformFilter.region !== "All" && p.region !== platformFilter.region) return false;
      if (platformFilter.type !== "All" && p.type !== platformFilter.type) return false;
      if (platformFilter.api && p.api !== "yes") return false;
      if (platformFilter.q && !(p.name + p.focus + p.country).toLowerCase().includes(platformFilter.q)) return false;
      return true;
    });
    const count = pool.length;
    const pill = document.querySelector(".pf-filters .pill");
    if (pill) pill.textContent = count + " shown";
    grid.innerHTML = pool.map((p) => `
      <div class="pf-card">
        <div class="pf-top">
          <div class="pf-name">${esc(p.name)}</div>
          <span class="pf-flag">${ic(p.type === "Dropshipping" ? "package-open" : p.type === "Wholesale" ? "shopping-basket" : p.type === "Manufacturer" ? "factory" : p.type === "Liquidation" ? "hammer" : p.type === "Print on Demand" ? "shirt" : "globe", 15)}</span>
        </div>
        <div class="pf-focus">${esc(p.focus)}</div>
        <div class="pf-meta">
          <span class="tag gray">${p.region}</span><span class="tag ${p.trusted ? "green" : "amber"}">${p.trusted ? "VERIFIED" : "ESTIMATED"}</span><span class="tag blue">${esc(p.type)}</span>
        </div>
        <div class="pf-cap">${(p.cap || []).map((c) => `<span class="tag gray">${c}</span>`).join("")}</div>
        <div class="pf-foot">
          <div style="font-size:10px;color:var(--muted2)">MOQ ${esc(p.moq)} · ${esc(p.ship)}<br>rating ${p.rating}/10 · API ${p.api}</div>
          <button class="btn btn-o btn-sm" data-watch-pf="${p.id}">${ic("star", 12)} Watch</button>
        </div>
      </div>`).join("") || `<div class="empty">${ic("search-x", 26)} No platforms match the filters.</div>`;
    icons();
  }

  function renderChatFill() {
    const log = $("chat-log");
    if (!log) return;
    log.innerHTML = chatLog.slice(-30).map((m) => `<div class="chat-bub ${m.role === "me" ? "me" : "ai"}">${esc(m.text)}</div>`).join("");
    log.scrollTop = log.scrollHeight;
  }

  function renderOrdersFill() {
    const body = $("or-out");
    if (!body) return;
    const rows = orders.slice(0, 12).map((o) => [`<b>${esc(o.id)}</b>`, esc(o.product), `${fmt(o.qty)} u`, `${fmtN(o.weightKg, 1)} kg`, esc(o.dest), `<span class="tag blue">${esc(o.wh)}</span>`, esc(o.eta), o.urgent, new Date(o.ts).toLocaleString()]);
    const tbl = body.parentElement.querySelector(".tbl-wrap tbody");
    if (tbl) tbl.innerHTML = rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  }

  function render() {
    renderShell();
    $("eat-main").innerHTML = renderGroup();
    icons();
  }

  PL.on(() => {
    evaluateAlerts();
    render();
    document.addEventListener("click", wire);
    document.addEventListener("keydown", wire);
    document.addEventListener("change", wire);
  });
})();
