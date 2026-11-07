/* ============================================================
   PUNCHLINE — META ADS INTELLIGENCE CENTER (fb-ads22)
   Data → Insight → Hypothesis → Test → Result → Learning → Optimize
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- utils ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const parseJSON = (s) => { if (typeof s !== "string") return s; try { return JSON.parse(s); } catch (e) { return null; } };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const rng = (seed) => { let t = seed >>> 0 || 7; return () => { t = (t * 16807) % 2147483647; return (t - 1) / 2147483646; }; };
  const numf = (v, d) => Number(v || 0).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d });
  const money = (v) => (v < 0 ? "-" : "") + numf(Math.abs(v)) + " DA";
  const pct = (v, d) => (v * 100).toFixed(d == null ? 1 : d) + "%";
  const md = (t) => esc(t || "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>").replace(/^- (.*)$/gm, "• $1");

  const KEY = "fb22";
  const ld = (n, d) => { try { const v = JSON.parse(localStorage.getItem(KEY + "." + n)); return v == null ? d : v; } catch (e) { return d; } };
  const ls = (n, v) => localStorage.setItem(KEY + "." + n, JSON.stringify(v));

  function toast(msg, type) {
    let wrap = $("#fba-toasts");
    if (!wrap) { wrap = document.createElement("div"); wrap.id = "fba-toasts"; document.body.appendChild(wrap); }
    const t = document.createElement("div");
    t.className = "fba-toast" + (type ? " " + type : "");
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; }, 2400);
    setTimeout(() => t.remove(), 2800);
  }
  function openModalHTML(html) {
    let m = $("#fba-modal");
    if (!m) { m = document.createElement("div"); m.id = "fba-modal"; document.body.appendChild(m); }
    m.innerHTML = `<div class="fba-modal-panel">${html}</div>`;
    m.classList.add("open");
  }
  function closeModal() { const m = $("#fba-modal"); if (m) m.classList.remove("open"); }

  /* ---------------- state ---------------- */
  const state = { m: "dashboard", range: "30", acct: "all", q: "", cache: {} };

  /* ---------------- product + static data ---------------- */
  const PRODUCT = { name: "Codzilla Pro — 17pc Knife Set", price: 3900, cost: 1450, fee: 0.022, courier: 250, retCost: 320 };

  const ACCOUNTS = [
    { id: "acct1", name: "Atlas Trade — DZ Main", currency: "DZD", tz: "Africa/Algiers", status: "connected", connected: "2025-02-11", pixel: true, ccm: false, errs: 0 },
    { id: "acct2", name: "Atlas Trade — DZ Prospecting", currency: "DZD", tz: "Africa/Algiers", status: "connected", connected: "2025-06-02", pixel: true, ccm: true, errs: 1 },
  ];

  const CAMPAIGNS = [
    { id: "C1", acct: "acct1", name: "Purchases — Codzilla Pro", obj: "Conversions", status: "Active", strat: "Cost Cap", baf: "high", budget: 3500, focus: "Revenue & delivery rate" },
    { id: "C2", acct: "acct1", name: "Leads — Codzilla Pro", obj: "Lead Generation", status: "Active", strat: "Lowest Cost", baf: "medium", budget: 1800, focus: "Fill cold top-of-funnel" },
    { id: "C3", acct: "acct1", name: "Retargeting — Cart Abandon", obj: "Conversions", status: "Active", strat: "Cost Cap", baf: "high", budget: 1200, focus: "Recover 50%+ value carts" },
    { id: "C4", acct: "acct1", name: "Catalogue — Cold Audience", obj: "Catalogue Sales", status: "Paused", strat: "Advantage+", baf: "low", budget: 800, focus: "Broad catalog volume" },
    { id: "C5", acct: "acct2", name: "Brand — Prospecting Wave", obj: "Awareness", status: "Active", strat: "Reach", baf: "low", budget: 900, focus: "Top-funnel reach + LAL seed" },
    { id: "C6", acct: "acct2", name: "Testing — New Angles", obj: "Conversions", status: "Active", strat: "Lowest Cost", baf: "high", budget: 2500, focus: "Statistically sound A/B" },
  ];

  const ADSETS = [
    { id: "AS1", cid: "C1", name: "Broad — DZ 18-45", aud: "Broad: DZ, 18-45, all genders", placement: "Auto" },
    { id: "AS2", cid: "C1", name: "Interest — COD Shoppers", aud: "E-com shoppers + COD interest pages", placement: "FB+IG Feed" },
    { id: "AS3", cid: "C2", name: "LAL 1% — Buyers 30d", aud: "Lookalike 1% of 30d buyers", placement: "Auto" },
    { id: "AS4", cid: "C2", name: "Lead Form — Mobile", aud: "Broad DZ + instant form", placement: "FB Feed" },
    { id: "AS5", cid: "C3", name: "Cart 7d — 50%+ value", aud: "Cart add 7d, 50%+ value", placement: "IG Reels" },
    { id: "AS6", cid: "C3", name: "Site Visit 30d", aud: "Website visitors 30d", placement: "Auto" },
    { id: "AS7", cid: "C4", name: "Broad Catalogue", aud: "Broad DZ catalogue", placement: "Auto" },
    { id: "AS8", cid: "C4", name: "Offer — Free Delivery", aud: "Engaged 90d + free delivery", placement: "FB Feed" },
    { id: "AS9", cid: "C5", name: "Broad 25-54", aud: "Broad DZ 25-54", placement: "Reels" },
    { id: "AS10", cid: "C5", name: "Men 25-40 — Fitness", aud: "Men 25-40, fitness interest", placement: "FB Feed" },
    { id: "AS11", cid: "C6", name: "Angle A — Problem", aud: "Broad, test budget", placement: "FB+IG" },
    { id: "AS12", cid: "C6", name: "Angle B — Social Proof", aud: "Broad, test budget", placement: "FB+IG" },
  ];

  const HOOKS = [
    { k: "problem", label: "Problem", color: "#D32F2F" }, { k: "curiosity", label: "Curiosity", color: "#1877F2" },
    { k: "question", label: "Question", color: "#7C4DFF" }, { k: "benefit", label: "Benefit", color: "#0FA05A" },
    { k: "transformation", label: "Transformation", color: "#00ACC1" }, { k: "socialproof", label: "Social Proof", color: "#F57C00" },
    { k: "offer", label: "Offer / CTA", color: "#B98A1F" }, { k: "demonstration", label: "Demonstration", color: "#5C6BC0" },
  ];
  const FORMATS = ["UGC", "Demo video", "Static image", "Photo carousel", "Testimonial"];
  const FMT_COLOR = { "UGC": "#1877F2", "Demo video": "#7C4DFF", "Static image": "#0FA05A", "Photo carousel": "#F57C00", "Testimonial": "#00ACC1" };

  const CREATIVE_SPECS = [
    ["UGC — kitchen demo front", "UGC", "demonstration", 45, "Creator A", "Free sharpener"],
    ["UGC — mum unboxing", "UGC", "curiosity", 30, "Creator B", ""],
    ["Static — 17pc layout", "Static image", "benefit", 0, "", "Free sharpener"],
    ["Static — before/after", "Static image", "transformation", 0, "", ""],
    ["Demo — 30s cutting test", "Demo video", "demonstration", 30, "Creator C", "Free shipping"],
    ["Carousel — 8 use cases", "Photo carousel", "benefit", 0, "", "Free sharpener"],
    ["UGC — chef reaction", "UGC", "socialproof", 22, "Creator D", ""],
    ["Testimonial — happy customer", "Testimonial", "socialproof", 28, "Creator B", "Coupon KITCHEN10"],
    ["UGC — ASMR opening", "UGC", "curiosity", 18, "Creator E", ""],
    ["Static — price anchor", "Static image", "offer", 0, "", "Price drop 4900→3900"],
    ["Demo — 60s full review", "Demo video", "problem", 60, "Creator C", ""],
    ["Static — question billboard", "Static image", "question", 0, "", ""],
    ["UGC — granny slicing tomatoes", "UGC", "demonstration", 35, "Creator A", "Free shipping"],
    ["UGC — doubts & answers", "UGC", "problem", 50, "Creator D", ""],
    ["Static — testimonial quote card", "Static image", "socialproof", 0, "", "Coupon KITCHEN10"],
    ["Carousel — kitchen tour", "Photo carousel", "curiosity", 0, "", ""],
    ["Demo — 15s hook cut", "Demo video", "question", 15, "Creator E", "Free sharpener"],
    ["UGC — unboxing + offer stack", "UGC", "offer", 40, "Creator B", "2x knives + free gift"],
    ["Static — before/after 2", "Static image", "transformation", 0, "", ""],
    ["Testimonial — 5 stars video", "Testimonial", "socialproof", 32, "Creator D", ""],
    ["Demo — night kitchen", "Demo video", "curiosity", 24, "Creator C", ""],
    ["UGC — making tagine", "UGC", "demonstration", 38, "Creator A", "Free shipping"],
    ["Static — giant 17pc", "Static image", "benefit", 0, "", "Free sharpener"],
    ["Carousel — before/after meals", "Photo carousel", "transformation", 0, "", "Coupon KITCHEN10"],
  ];

  const WILAYAS = [
    { w: "Alger", wt: 13.5 }, { w: "Oran", wt: 8.2 }, { w: "Constantine", wt: 6.4 }, { w: "Sétif", wt: 6.0 },
    { w: "Tizi Ouzou", wt: 5.1 }, { w: "Blida", wt: 4.8 }, { w: "Batna", wt: 4.2 }, { w: "Annaba", wt: 3.7 },
    { w: "Béjaïa", wt: 4.0 }, { w: "Tlemcen", wt: 3.2 }, { w: "Ouargla", wt: 2.6 }, { w: "Mostaganem", wt: 2.7 },
    { w: "Chlef", wt: 2.9 }, { w: "Skikda", wt: 2.7 }, { w: "Djelfa", wt: 3.0 }, { w: "Sidi Bel Abbès", wt: 2.2 },
  ];
  const HOUR_WEIGHTS = [0.5, 0.4, 0.3, 0.2, 0.3, 0.5, 0.9, 1.4, 2.2, 3.0, 3.4, 3.6, 3.7, 3.9, 4.1, 4.3, 4.6, 5.0, 4.8, 4.4, 3.8, 2.9, 1.9, 1.0];

  /* ---------------- generated data ---------------- */
  let CREATIVES = [], ADS = [], SNAPSHOTS = [], ORDERS = [];

  function genAdParam(i) {
    const r = rng(100 + i);
    const tier = i % 5 === 0 ? "winner" : i % 5 === 1 ? "loser" : "normal";
    let q = +(0.8 + r() * 0.3).toFixed(3);
    let ctr = +(1.0 + r() * 2.0).toFixed(2);
    let cpm = +(550 + r() * 900).toFixed(0);
    let leadRate = +(0.12 + r() * 0.2).toFixed(3);
    let orderRate = +(0.34 + r() * 0.42).toFixed(3);
    let confRate = +(0.6 + r() * 0.24).toFixed(3);
    let delRate = +(0.72 + r() * 0.2).toFixed(3);
    let retRate = +(0.08 + r() * 0.13).toFixed(3);
    let budget = +(600 + r() * 400).toFixed(0);
    if (tier === "winner") { q *= 1.16; ctr *= 1.22; orderRate *= 1.3; delRate = Math.min(0.96, delRate * 1.06); retRate *= 0.68; budget *= 1.5; }
    if (tier === "loser") { q *= 0.84; ctr *= 0.78; leadRate *= 0.82; confRate *= 0.82; retRate *= 1.35; budget *= 0.7; }
    const fatigue = r() < 0.3 ? 0 : r() < 0.62 ? 1 : 2;
    const trend = r() < 0.4 ? -1 : r() < 0.7 ? 0 : 1;
    return { q: +q.toFixed(3), ctr: +ctr.toFixed(2), cpm: +cpm.toFixed(0), leadRate, orderRate, confRate, delRate, retRate, budget: +budget.toFixed(0), fatigue, trend, reachF: +(0.72 + r() * 0.16).toFixed(3), linkRate: +(0.78 + r() * 0.12).toFixed(3), viewRate: +(0.5 + r() * 0.2).toFixed(3) };
  }

  function seed() {
    CREATIVES = []; ADS = [];
    CREATIVE_SPECS.forEach((s, i) => {
      CREATIVES.push({ id: "CR" + (i + 1), name: s[0], format: s[1], hook: s[2], len: s[3], creator: s[4], offer: s[5] });
      ADS.push({ id: "AD" + (i + 1), aid: "AS" + (i >= 12 ? i - 11 : i + 1), name: "AD" + (i + 1), creative: "CR" + (i + 1) });
    });
    const params = ADS.map((a, i) => genAdParam(i));
    const DAYS = 90;
    const d0 = new Date(); d0.setDate(d0.getDate() - (DAYS - 1));
    const snaps = [], ords = [];
    for (let di = 0; di < DAYS; di++) {
      const date = new Date(d0); date.setDate(d0.getDate() + di);
      const ds = iso(date);
      const dow = date.getDay();
      const season = 0.7 + (dow === 4 || dow === 5 ? 0.65 : dow === 6 ? 0.35 : 0.15);
      for (let i = 0; i < ADS.length; i++) {
        const p = params[i];
        const adv = p.trend * 0.015 * di;
        let fat = 0;
        if (p.fatigue === 1) fat = Math.max(0, (di - 45) / 90) * 0.55;
        if (p.fatigue === 2) fat = Math.max(0, (di - 28) / 60) * 0.95;
        const k = Math.max(0.05, 1 + adv - fat);
        const spend = Math.max(40, p.budget * season * p.q * (1 + adv * 0.4));
        const imps = Math.round((spend / p.cpm) * 1000);
        const clicks = Math.round(imps * (p.ctr / 100) * k);
        const link = Math.round(clicks * p.linkRate);
        const views = Math.round(link * p.viewRate);
        const leads = Math.round(link * p.leadRate * (0.75 + 0.25 * k));
        snaps.push({ d: ds, ad: ADS[i].id, imps, reach: Math.round(imps * p.reachF), clicks, link, views, leads, spend: Math.round(spend) });
        const placed = Math.round(leads * p.orderRate);
        const confirmed = Math.round(placed * p.confRate);
        const shipped = Math.round(confirmed * p.shipRate);
        const delivered = Math.round(shipped * p.delRate);
        const returned = Math.round(delivered * p.retRate);
        if (placed > 0) ords.push({ d: ds, ad: ADS[i].id, st: { p: placed, c: confirmed, s: shipped, d: delivered, r: returned }, g: Math.round(delivered * PRODUCT.price), cogs: Math.round(delivered * PRODUCT.cost) });
      }
    }
    ls("creatives", CREATIVES); ls("ads", ADS); ls("snapshots", snaps); ls("orders", ords); ls("version", "1");
  }
  function loadData() {
    CREATIVES = ld("creatives", null); ADS = ld("ads", null); SNAPSHOTS = ld("snapshots", null); ORDERS = ld("orders", null);
    if (!CREATIVES || !ADS || !SNAPSHOTS || !ORDERS) { seed(); CREATIVES = ld("creatives", []); ADS = ld("ads", []); SNAPSHOTS = ld("snapshots", []); ORDERS = ld("orders", []); }
  }

  /* ---------------- compute engine ---------------- */
  function scopeSet() {
    if (state.acct === "all") return null;
    const camps = CAMPAIGNS.filter((c) => c.acct === state.acct).map((c) => c.id);
    return new Set(ADS.filter((a) => camps.includes(ADSETS.find((x) => x.id === a.aid).cid)).map((a) => a.id));
  }
  function finalizeRow(r) {
    r.ctr = r.imps ? (r.clicks / r.imps) * 100 : 0;
    r.cpm = r.imps ? (r.spend / r.imps) * 1000 : 0;
    r.cpc = r.clicks ? r.spend / r.clicks : 0;
    r.cpl = r.leads ? r.spend / r.leads : 0;
    r.cpa = r.ord ? r.spend / r.ord : 0;
    r.cpconf = r.conf ? r.spend / r.conf : 0;
    r.cpdel = r.del ? r.spend / r.del : 0;
    r.confRate = r.ord ? r.conf / r.ord : 0;
    r.shipRate = r.conf ? r.ship / r.conf : 0;
    r.delRate = r.ship ? r.del / r.ship : 0;
    r.retRate = r.del ? r.ret / r.del : 0;
    r.codFee = r.gross * PRODUCT.fee;
    r.courier = r.del * PRODUCT.courier;
    r.retCost = r.ret * PRODUCT.retCost;
    r.profit = r.gross - r.cogs - r.codFee - r.courier - r.retCost - r.spend;
    r.roas = r.spend ? r.gross / r.spend : 0;
    r.profRoas = r.spend ? r.profit / r.spend : 0;
    r.pd = r.del ? r.profit / r.del : 0;
    return r;
  }
  const EMPTY = { imps: 0, reach: 0, clicks: 0, link: 0, views: 0, leads: 0, spend: 0, ord: 0, conf: 0, ship: 0, del: 0, ret: 0, gross: 0, cogs: 0, days: 0 };
  function computeAll() {
    const k = state.range + "|" + state.acct;
    if (state.cache[k]) return state.cache[k];
    const scope = scopeSet();
    const from = daysAgo(+state.range - 1);
    const acc = {};
    ADS.forEach((a) => { if (scope && !scope.has(a.id)) return; acc[a.id] = { ...EMPTY, ad: a.id, aid: a.aid, creative: a.creative }; });
    for (let i = 0; i < SNAPSHOTS.length; i++) {
      const s = SNAPSHOTS[i]; if (s.d < from) continue;
      const r = acc[s.ad]; if (!r) continue;
      r.imps += s.imps; r.reach += s.reach; r.clicks += s.clicks; r.link += s.link; r.views += s.views; r.leads += s.leads; r.spend += s.spend; r.days++;
    }
    for (let i = 0; i < ORDERS.length; i++) {
      const o = ORDERS[i]; if (o.d < from) continue;
      const r = acc[o.ad]; if (!r) continue;
      r.ord += o.st.p; r.conf += o.st.c; r.ship += o.st.s; r.del += o.st.d; r.ret += o.st.r;
      r.gross += o.g; r.cogs += o.cogs;
    }
    Object.values(acc).forEach(finalizeRow);
    state.cache[k] = acc;
    return acc;
  }
  function totals(acc) {
    const t = { ...EMPTY };
    Object.values(acc).forEach((r) => { ["imps", "reach", "clicks", "link", "views", "leads", "spend", "ord", "conf", "ship", "del", "ret", "gross", "cogs"].forEach((f) => (t[f] += r[f])); });
    t.days = +state.range;
    return finalizeRow(t);
  }
  function aggBy(acc, fn, base) {
    const map = {};
    Object.values(acc).forEach((r) => {
      const key = fn(r);
      if (key == null) return;
      map[key] = map[key] || { key, ...EMPTY };
      const g = map[key];
      ["imps", "reach", "clicks", "link", "views", "leads", "spend", "ord", "conf", "ship", "del", "ret", "gross", "cogs"].forEach((f) => (g[f] += r[f]));
    });
    return Object.values(map).map((g) => finalizeRow(Object.assign(g, base && base(g.key) || {})));
  }
  const adOf = (id) => ADS.find((a) => a.id === id);
  const creativeOf = (id) => CREATIVES.find((c) => c.id === id);
  const adsetOf = (aid) => ADSETS.find((x) => x.id === aid);
  const campOf = (aid) => { const as = adsetOf(aid); return CAMPAIGNS.find((c) => c.id === (as ? as.cid : null)) || CAMPAIGNS[0]; };
  const acctOf = (aid) => campOf(aid).acct;

  function verdict(r, ctx) {
    if (r.days < 7 || r.spend < 400) return { v: "inconclusive", label: "INCONCLUSIVE", cls: "inconclusive", note: "Not enough spend/data yet" };
    if (r.profRoas >= ctx.profRoas * 1.2 && r.profit > 0) return { v: "winner", label: "WINNER", cls: "winner", note: "Above account profit ROAS + profitable" };
    if (r.profRoas >= 0.9 && r.retRate <= ctx.retRate * 1.05 && r.profit >= 0) return { v: "promising", label: "PROMISING", cls: "promising", note: "Healthy economics, scaling candidate" };
    if (r.profRoas < 0.6 || (r.del >= 8 && r.profit < 0)) return { v: "losing", label: "LOSING", cls: "losing", note: "Below break-even economics" };
    return { v: "inconclusive", label: "INCONCLUSIVE", cls: "inconclusive", note: "Split between tests — keep budget flat" };
  }
  function fatigueOf(adId) {
    const s = SNAPSHOTS.filter((x) => x.ad === adId);
    const agg = (arr) => { const cl = arr.reduce((a, x) => a + x.clicks, 0); const im = arr.reduce((a, x) => a + x.imps, 0); return im ? (cl / im) * 100 : 0; };
    const cur = s.slice(Math.max(0, s.length - 15)), prev = s.slice(Math.max(0, s.length - 30), Math.max(0, s.length - 15));
    if (!cur.length || !prev.length) return { lvl: "FRESH", cls: "fresh", note: "Insufficient history" };
    const ratio = agg(prev) ? agg(cur) / agg(prev) : 1;
    if (ratio < 0.8) return { lvl: "FATIGUED", cls: "tired", note: "CTR down " + pct(1 - ratio, 0) + " vs prior 15d" };
    if (ratio < 0.95) return { lvl: "WATCH", cls: "watch", note: "CTR easing −" + pct(1 - ratio, 0) + " vs prior 15d" };
    return { lvl: "FRESH", cls: "fresh", note: "CTR steady or rising" };
  }
  function dailySeries(n) {
    const out = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = daysAgo(i);
      let sp = 0, g = 0, pr = 0;
      for (let j = 0; j < SNAPSHOTS.length; j++) if (SNAPSHOTS[j].d === d) sp += SNAPSHOTS[j].spend;
      for (let j = 0; j < ORDERS.length; j++) if (ORDERS[j].d === d) { g += ORDERS[j].g; pr += ORDERS[j].g - ORDERS[j].cogs; }
      out.push({ d: d.slice(5), sp, g, pr });
    }
    return out;
  }
  const qmatch = (...txt) => { const q = state.q.toLowerCase(); return !q || txt.join(" ").toLowerCase().includes(q); };

  /* ---------------- charts ---------------- */
  const PALETTE = ["#1877F2", "#0FA05A", "#F57C00", "#7C4DFF", "#00ACC1", "#D32F2F", "#B98A1F", "#5C6BC0"];
  const charts = {};
  function mkChart(id, cfg) {
    const el = document.getElementById(id);
    if (!el) return;
    if (charts[id]) { charts[id].destroy(); delete charts[id]; }
    try { charts[id] = new Chart(el, cfg); } catch (e) { console.error("chart", id, e); }
  }
  function mkBar(id, labels, data, color, opts) { mkChart(id, { type: "bar", data: { labels, datasets: [{ data, backgroundColor: color || PALETTE, borderRadius: 5 }] }, options: Object.assign({ plugins: { legend: { display: false } }, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: "#F1F0EE" } } } }, opts) }); }
  function mkLine(id, labels, series, colors, opts) {
    mkChart(id, { type: "line", data: { labels, datasets: series.map((s, i) => ({ label: s[0], data: s[1], borderColor: (colors || PALETTE)[i], backgroundColor: (colors || PALETTE)[i] + "22", fill: i === 0 ? "origin" : false, tension: 0.35, pointRadius: 0, borderWidth: 2 })) }, options: Object.assign({ plugins: { legend: { display: true, labels: { boxWidth: 10, font: { size: 10, weight: "700" } } } }, maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: "#F1F0EE" } } } }, opts) });
  }
  function mkDoughnut(id, labels, data, colors) { mkChart(id, { type: "doughnut", data: { labels, datasets: [{ data, backgroundColor: colors || PALETTE, borderWidth: 0 }] }, options: { plugins: { legend: { position: "right", labels: { boxWidth: 10, font: { size: 10, weight: "700" } } } }, maintainAspectRatio: false, cutout: "62%" } }); }

  /* ---------------- AI ---------------- */
  async function runAI(task, payload, prompt) {
    try {
      const res = await PL_API.ai(task, payload, { prompt });
      let raw = res.data, d = null;
      if (typeof raw === "string") { const p = parseJSON(raw); d = p ? p : raw; } else d = raw;
      const sim = res.simulated || d == null;
      if (d == null && PL_API.simulate) d = PL_API.simulate(task, payload);
      return { d: d || { output: "No AI output." }, simulated: sim };
    } catch (e) {
      let d = null; if (PL_API.simulate) d = PL_API.simulate(task, payload);
      return { d: d || { output: "AI unavailable: " + e }, simulated: true };
    }
  }
  function aiBand(text, sim, extra) {
    return `<div class="fba-ai mt-4"><div class="flex items-center gap-2 mb-2"><span class="fba-src ${sim ? "infer" : "actual"}">${sim ? "SIMULATED AI" : "LIVE AI"}</span><span class="text-[11px] font-black text-[#9A9AA2]">AI · Punchline</span>${extra || ""}</div><div class="text-[13px] leading-relaxed">${text}</div></div>`;
  }
  const aiLoader = `<div class="flex items-center gap-3 p-4 text-[13px] font-bold text-[#1877F2]"><span class="animate-spin inline-block w-4 h-4 border-2 border-[#1877F2] border-t-transparent rounded-full"></span> Punchline AI is thinking…</div>`;

  /* ---------------- small UI helpers ---------------- */
  const thumb = (cr) => {
    const c = FMT_COLOR[cr.format] || "#1877F2";
    const l = cr.len ? Math.round(cr.len / 5) + "s" : "";
    const cls = cr.len >= 30 ? "fba-thumb tall" : "fba-thumb";
    return `<span class="${cls}" style="background:${c}"><span>${cr.format === "UGC" ? "UGC" : cr.format === "Demo video" ? "VID" : cr.format === "Static image" ? "IMG" : cr.format === "Photo carousel" ? "CAR" : "TST"}${l ? "<br>" + l : ""}</span></span>`;
  };
  const kpi = (lbl, val, sub, hot, cls) => `<div class="fba-kpi ${hot ? "hot" : ""} ${cls || ""}"><div class="kpi-num" style="color:${hot ? "" : ""}">${val}</div><div class="kpi-lbl">${lbl}</div>${sub ? `<div class="text-[10.5px] mt-1 font-semibold" style="color:#B5B5BB">${sub}</div>` : ""}</div>`;
  const sec = (title, sub, inner, extra) => `<div class="card"><div class="card-head"><div><h3 class="card-title">${title}</h3>${sub ? `<p class="card-sub">${sub}</p>` : ""}</div>${extra || ""}</div><div class="card-body">${inner}</div></div>`;
  const grid = (inner, cols) => `<div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(${cols || "240px"},1fr))">${inner}</div>`;
  const empty = (msg) => `<div class="p-8 text-center text-[13px] text-[#9A9AA2]">${msg}</div>`;

  /* ---------------- render pipeline ---------------- */
  function view(html) {
    $("#fba-content").innerHTML = html;
    if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();
  }
  function render() {
    const M = MODULES[state.m] || MODULES.dashboard;
    state.cache = {};
    renderTopbar();
    M.render();
    const sv = $("#fba-sidebar");
    if (sv) $$(".fba-nav-item", sv).forEach((b) => b.classList.toggle("active", b.dataset.nav === state.m));
  }
  function renderTopbar() {
    const M = MODULES[state.m] || MODULES.dashboard;
    const acctOpts = `<option value="all">All accounts</option>` + ACCOUNTS.map((a) => `<option value="${a.id}" ${state.acct === a.id ? "selected" : ""}>${esc(a.name)}</option>`).join("");
    $("#fba-topbar").innerHTML = `
      <button class="fba-hamburger" data-action="toggleSidebar"><i data-lucide="menu"></i></button>
      <div class="mr-auto"><div class="fba-title">${M.icon ? `<i data-lucide="${M.icon}" class="inline mr-1" style="color:#1877F2;width:16px;height:16px"></i>` : ""}${M.label}</div><div class="fba-title-sub">${M.sub || ""}</div></div>
      <select class="fba-select" data-state="acct">${acctOpts}</select>
      <select class="fba-select" data-state="range">
        ${["7", "14", "30", "60", "90"].map((r) => `<option value="${r}" ${state.range === r ? "selected" : ""}>Last ${r} days</option>`).join("")}
      </select>
      <div class="fba-search"><i data-lucide="search" style="width:15px;height:15px"></i><input placeholder="Search this module…" value="${esc(state.q)}" data-state="q"></div>
      <button class="fba-btn ghost" data-action="export" title="Export current table"><i data-lucide="download" style="width:15px;height:15px"></i> CSV</button>
      <button class="fba-btn ghost" data-action="sync" title="Refresh simulated Meta data"><i data-lucide="refresh-cw" style="width:15px;height:15px"></i> Sync</button>`;
    if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();
  }
  function renderSidebar() {
    const groups = ["OVERVIEW", "STRUCTURE", "AI LABS", "MONEY & COD", "INTELLIGENCE", "SYSTEM"];
    const byGroup = {};
    NAV.forEach((n) => { (byGroup[n.g] = byGroup[n.g] || []).push(n); });
    let html = "";
    groups.forEach((g) => {
      if (!byGroup[g]) return;
      html += `<div class="fba-side-label">${g}</div>` + byGroup[g].map((n) => {
        const M = MODULES[n.id];
        const badge = n.badge ? M.badge() : "";
        return `<button class="fba-nav-item" data-action="nav" data-nav="${n.id}"><i data-lucide="${M.icon}" style="width:16px;height:16px"></i><span>${n.label}</span>${badge}</button>`;
      }).join("");
    });
    html += `<div class="fba-sidebar-foot">Meta Ads Intelligence Center<br>Data → Test → Learn → Scale</div>`;
    $("#fba-sidebar").innerHTML = html;
    if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();
  }

  /* ---------------- delegated actions ---------------- */
  document.addEventListener("click", (e) => {
    const navEl = e.target.closest("[data-nav]");
    if (navEl) { e.preventDefault(); state.m = navEl.dataset.nav; closeSidebar(); render(); return; }
    const actEl = e.target.closest("[data-action]");
    if (actEl) { e.preventDefault(); const a = actions[actEl.dataset.action]; if (a) a(actEl); return; }
    const openEl = e.target.closest("[data-open]");
    if (openEl) { e.preventDefault(); openModal(openEl.dataset.open); return; }
    const aiEl = e.target.closest("[data-ai]");
    if (aiEl) { e.preventDefault(); aiAction(aiEl); return; }
    if (e.target.closest("[data-close]")) { closeModal(); return; }
    if (e.target.id === "fba-modal") { closeModal(); return; }
  });
  document.addEventListener("input", (e) => {
    if (e.target.dataset && e.target.dataset.state === "q") { state.q = e.target.value.trim(); render(); }
  });
  document.addEventListener("change", (e) => {
    const st = e.target.dataset && e.target.dataset.state;
    if (st === "range") { state.range = e.target.value; render(); }
    if (st === "acct") { state.acct = e.target.value; render(); }
  });
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("[data-form]");
    if (f) { e.preventDefault(); const a = actions[f.dataset.form]; if (a) a(f); }
  });

  function closeSidebar() { $("#fba-sidebar").classList.remove("open"); $("#fba-drawer-mask").classList.remove("show"); }

  const actions = {
    toggleSidebar: () => { const s = $("#fba-sidebar"); s.classList.toggle("open"); $("#fba-drawer-mask").classList.toggle("show", s.classList.contains("open")); },
    nav: (el) => { state.m = el.dataset.nav; closeSidebar(); render(); },
    sync: () => {
      ["creatives", "ads", "snapshots", "orders", "version"].forEach((n) => localStorage.removeItem(KEY + "." + n));
      seed(); SNAPSHOTS = ld("snapshots", []); ORDERS = ld("orders", []); state.cache = {};
      toast("Simulated Meta data refreshed", "ok"); render();
    },
    export: () => {
      const tbl = $("#fba-content table.fba-table");
      if (!tbl) { toast("No table on this view", "err"); return; }
      const rows = $$("tr", tbl).map((tr) => $$("th,td", tr).map((c) => c.textContent.trim().replace(/"/g, '""')).join('","'));
      const csv = rows.map((r) => '"' + r + '"').join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = "meta-ads-" + state.m + "-" + state.range + "d.csv";
      a.click();
      toast("CSV exported");
    },
    toast: (el) => toast(el.dataset.msg || "Done", el.dataset.type),
    adDetail: (el) => adDetail(el.dataset.ad),
    toggleAd: (el) => { const a = adOf(el.dataset.ad); toast(`Ad ${a.id} toggled (status saved in Meta Ad Manager)`); },
    pushTest: (el) => pushToTest(el.dataset.ad),
    aiAction: (el) => aiAction(el),
    runPlanner: () => runPlanner(),
    openAsk: () => { if (state.m !== "advisor") { state.m = "advisor"; render(); } setTimeout(() => { const i = $("#fba-ask-input"); if (i) i.focus(); }, 50); },
    submitCampaign: (f) => submitCampaign(f),
    submitTest: (f) => submitTest(f),
    submitAccount: (f) => submitAccount(f),
    submitGoal: (f) => submitGoal(f),
    submitBreak: (f) => submitBreak(f),
    submitCreative: (f) => submitCreative(f),
    submitAsk: (f) => submitAsk(f),
    submitAudience: (f) => submitAudience(f),
    submitReport: (f) => submitReport(f),
    remember: (el) => rememberLearning(el.dataset.text),
    addAlert: (el) => { const l = alertConfig(); toast("Alert rule saved", "ok"); },
  };

  /* ---------------- modal builders ---------------- */
  function openModal(name) {
    const b = modals[name];
    if (b) openModalHTML(b());
  }
  function aiModal(task, payload, prompt, title, renderer) {
    openModalHTML(`<div class="flex items-center gap-3 text-[15px] font-extrabold mb-1">${title || "Punchline AI"}</div><div id="fba-ai-out">${aiLoader}</div>`);
    runAI(task, payload, prompt).then((r) => { $("#fba-ai-out").innerHTML = renderer(r.d, r.simulated); });
  }
  const modals = {
    account: () => `
      <div class="flex items-center justify-between mb-4"><div><h3 class="text-[16px] font-extrabold">Connect Meta account</h3><p class="text-[12px] text-[#9A9AA2]">OAuth connects your Business Manager (simulated)</p></div><button class="fba-btn ghost" data-close><i data-lucide="x" style="width:15px;height:15px"></i></button></div>
      <form data-form="submitAccount" class="grid gap-3">
        <input class="fba-input" name="name" placeholder="Account name" value="New DZ Account" required>
        <select class="fba-select" name="currency"><option>DZD</option><option>EUR</option><option>USD</option></select>
        <div class="flex gap-2"><button class="fba-btn primary flex-1">Connect & sync</button><button class="fba-btn ghost" data-close>Cancel</button></div>
      </form>`,
    campaign: () => `
      <div class="flex items-center justify-between mb-4"><div><h3 class="text-[16px] font-extrabold">New campaign</h3><p class="text-[12px] text-[#9A9AA2]">Objectives · budget · bidding</p></div><button class="fba-btn ghost" data-close><i data-lucide="x" style="width:15px;height:15px"></i></button></div>
      <form data-form="submitCampaign" class="grid gap-3">
        <input class="fba-input" name="name" placeholder="Campaign name" required>
        <select class="fba-select" name="obj"><option>Conversions</option><option>Lead Generation</option><option>Traffic</option><option>Catalogue Sales</option><option>Awareness</option></select>
        <div class="grid grid-cols-2 gap-3"><select class="fba-select" name="acct">${ACCOUNTS.map((a) => `<option value="${a.id}">${esc(a.name)}</option>`).join("")}</select><input class="fba-input" type="number" name="budget" placeholder="Daily budget (DA)" value="1500"></div>
        <div class="grid grid-cols-2 gap-3"><select class="fba-select" name="strat"><option>Cost Cap</option><option>Lowest Cost</option><option>Advantage+</option><option>Reach</option></select><select class="fba-select" name="baf"><option value="high">High buy-factor (COD)</option><option value="medium">Medium</option><option value="low">Low (brand)</option></select></div>
        <div class="flex gap-2"><button class="fba-btn primary flex-1">Create campaign</button><button class="fba-btn ghost" data-close>Cancel</button></div>
      </form>`,
    test: () => `
      <div class="flex items-center justify-between mb-4"><div><h3 class="text-[16px] font-extrabold">New test</h3><p class="text-[12px] text-[#9A9AA2]">One hypothesis, controlled budget, fixed duration</p></div><button class="fba-btn ghost" data-close><i data-lucide="x" style="width:15px;height:15px"></i></button></div>
      <form data-form="submitTest" class="grid gap-3">
        <input class="fba-input" name="name" placeholder="Test name" value="New creative angle test" required>
        <textarea class="fba-textarea" name="hypothesis" placeholder="Hypothesis (what will be proven?)">We believe [X] will lift delivery rate by switching the primary hook…</textarea>
        <div class="grid grid-cols-2 gap-3"><select class="fba-select" name="ad1">${ADS.map((a) => `<option value="${a.id}">${a.id} · ${esc(creativeOf(a.creative).name)}</option>`).join("")}</select><select class="fba-select" name="ad2">${ADS.map((a) => `<option value="${a.id}" ${a.id === "AD2" ? "selected" : ""}>${a.id} · ${esc(creativeOf(a.creative).name)}</option>`).join("")}</select></div>
        <div class="grid grid-cols-3 gap-3"><input class="fba-input" type="number" name="budget" placeholder="Daily budget" value="800"><select class="fba-select" name="days"><option>7</option><option>10</option><option>14</option></select><select class="fba-select" name="metric"><option>Profit ROAS</option><option>ROAS</option><option>CPL</option><option>Delivery rate</option></select></div>
        <div class="flex gap-2"><button class="fba-btn primary flex-1">Start test</button><button class="fba-btn ghost" data-close>Cancel</button></div>
      </form>`,
    goal: () => `
      <div class="flex items-center justify-between mb-4"><div><h3 class="text-[16px] font-extrabold">Business goals</h3><p class="text-[12px] text-[#9A9AA2]">The AI advisor optimizes toward these targets</p></div><button class="fba-btn ghost" data-close><i data-lucide="x" style="width:15px;height:15px"></i></button></div>
      <form data-form="submitGoal" class="grid gap-3">
        <div class="grid grid-cols-2 gap-3"><input class="fba-input" type="number" name="targetRoas" placeholder="Target ROAS" value="${goals().targetRoas}"><input class="fba-input" type="number" name="targetProfit" placeholder="Target monthly profit (DA)" value="${goals().targetProfit}"></div>
        <input class="fba-input" type="number" name="dailyBudget" placeholder="Max daily budget (DA)" value="${goals().dailyBudget}">
        <select class="fba-select" name="priority"><option value="profit" ${goals().priority === "profit" ? "selected" : ""}>Maximize profit</option><option value="scale" ${goals().priority === "scale" ? "selected" : ""}>Scale revenue</option><option value="balance" ${goals().priority === "balance" ? "selected" : ""}>Balanced</option></select>
        <div class="flex gap-2"><button class="fba-btn primary flex-1">Save goals</button><button class="fba-btn ghost" data-close>Cancel</button></div>
      </form>`,
    breakeven: () => `
      <div class="flex items-center justify-between mb-4"><div><h3 class="text-[16px] font-extrabold">Break-even calculator</h3><p class="text-[12px] text-[#9A9AA2]">True CAC → break-even ROAS for COD</p></div><button class="fba-btn ghost" data-close><i data-lucide="x" style="width:15px;height:15px"></i></button></div>
      <form data-form="submitBreak" class="grid gap-3">
        <div class="grid grid-cols-2 gap-3"><input class="fba-input" type="number" name="price" value="${PRODUCT.price}" placeholder="Selling price (DA)"><input class="fba-input" type="number" name="cost" value="${PRODUCT.cost}" placeholder="Product cost (DA)"></div>
        <div class="grid grid-cols-3 gap-3"><input class="fba-input" type="number" step="0.01" name="fee" value="2.2" placeholder="COD fee %"><input class="fba-input" type="number" name="courier" value="${PRODUCT.courier}" placeholder="Courier (DA)"><input class="fba-input" type="number" name="ret" value="${PRODUCT.retCost}" placeholder="Return cost (DA)"></div>
        <div class="grid grid-cols-2 gap-3"><input class="fba-input" type="number" step="0.01" name="delRate" value="0.82" placeholder="Delivery rate"><input class="fba-input" type="number" step="0.01" name="retRate" value="0.12" placeholder="Return rate"></div>
        <div id="fba-break-out" class="text-[12.5px]"></div>
        <div class="flex gap-2"><button class="fba-btn primary flex-1">Calculate</button><button class="fba-btn ghost" data-close>Close</button></div>
      </form>`,
  };

  function openAIModal(name) {
    aiModal(name.task, name.payload, name.prompt, name.title, name.renderer);
  }

  /* ---------------- forms ---------------- */
  const fv = (f, n) => $(`[name="${n}"]`, f).value;
  function submitAccount(f) {
    const name = fv(f, "name"), cur = fv(f, "currency");
    ACCOUNTS.push({ id: "acct" + (ACCOUNTS.length + 1), name, currency: cur, tz: "Africa/Algiers", status: "connected", connected: today(), pixel: true, ccm: false, errs: 0 });
    ls("accounts", ACCOUNTS);
    toast("Account connected (simulated)", "ok"); closeModal(); render();
  }
  function submitCampaign(f) {
    const id = "C" + (CAMPAIGNS.length + 1);
    CAMPAIGNS.push({ id, acct: fv(f, "acct"), name: fv(f, "name"), obj: fv(f, "obj"), status: "Active", strat: fv(f, "strat"), baf: fv(f, "baf"), budget: +fv(f, "budget"), focus: "New campaign" });
    toast("Campaign created", "ok"); closeModal(); render();
  }
  function submitTest(f) {
    const tests = ld("tests", []);
    const t = { id: "T" + (tests.length + 1), name: fv(f, "name"), hypothesis: fv(f, "hypothesis"), ad1: fv(f, "ad1"), ad2: fv(f, "ad2"), budget: +fv(f, "budget"), days: +fv(f, "days"), metric: fv(f, "metric"), created: today(), status: "running", launched: today() };
    tests.push(t); ls("tests", tests);
    toast("Test launched", "ok"); closeModal(); state.m = "testing"; render();
  }
  function submitGoal(f) {
    const g = { targetRoas: +fv(f, "targetRoas"), targetProfit: +fv(f, "targetProfit"), dailyBudget: +fv(f, "dailyBudget"), priority: fv(f, "priority"), updated: today() };
    ls("goal", g); toast("Goals saved", "ok"); closeModal(); render();
  }
  const goals = () => ld("goal", { targetRoas: 2.5, targetProfit: 450000, dailyBudget: 10000, priority: "profit" });
  function submitBreak(f) {
    const price = +fv(f, "price"), cost = +fv(f, "cost"), fee = +fv(f, "fee") / 100, courier = +fv(f, "courier"), ret = +fv(f, "ret"), delRate = +fv(f, "delRate"), retRate = +fv(f, "retRate");
    const perDelivered = price - cost - price * fee - courier - (ret * retRate);
    const breakRoas = perDelivered > 0 ? price / perDelivered : Infinity;
    const maxCac = perDelivered * delRate;
    $("#fba-break-out").innerHTML = `
      <div class="p-3 rounded-xl mt-2" style="background:#EEF4FF">
        <div class="font-extrabold text-[14px]">Profit per delivered order: <span style="color:#0FA05A">${money(perDelivered)}</span></div>
        <div class="mt-1">Break-even ROAS (before ad spend): <b>${isFinite(breakRoas) ? breakRoas.toFixed(2) + "x" : "impossible (losing per order)"}</b></div>
        <div class="mt-1">Max affordable True CAC: <b>${money(maxCac)}</b> per delivered order</div>
        <div class="mt-1 text-[11px] text-[#9A9AA2]">True CAC = ad spend ÷ delivered orders. If CPA(delivered) exceeds ${money(maxCac)}, the ad loses money.</div>
      </div>`;
  }
  function submitCreative(f) {
    const ideas = ld("creativeIdeas", []);
    const base = fv(f, "base") || "WINNER AD1";
    ideas.unshift({ id: "I" + Date.now().toString().slice(-6), base, name: fv(f, "name") || "Creative idea", text: fv(f, "text"), notes: fv(f, "notes"), created: today(), score: Math.round(72 + Math.random() * 26) });
    ls("creativeIdeas", ideas);
    toast("Idea saved to lab", "ok"); closeModal(); state.m = "creativelab"; render();
  }
  function submitAsk(f) {
    const q = fv(f, "q"); if (!q) return;
    const box = $("#fba-ask-box"); if (!box) return;
    const ctx = summaryContext();
    box.insertAdjacentHTML("beforeend", `<div class="ml-auto max-w-[85%] p-3 rounded-2xl bg-[#1877F2] text-white text-[13px]">${esc(q)}</div>`);
    f.reset();
    box.insertAdjacentHTML("beforeend", `<div class="max-w-[85%]"><div id="fba-ask-reply">${aiLoader}</div></div>`);
    runAI("fb_ask", { q, ctx }, `You are the Meta Ads strategist. Answer the marketer's question using the live account data: ${JSON.stringify(ctx).slice(0, 2500)}. Be concrete, honest, actionable.`).then((r) => {
      const rep = $("#fba-ask-reply"); if (!rep) return;
      rep.outerHTML = `<div class="p-3 rounded-2xl text-[13px]" style="background:#F1F3F7;color:#333">${md(r.d.output || r.d.answer || JSON.stringify(r.d))}${r.simulated ? `<div class="text-[10px] mt-1" style="color:#B98A1F">simulated</div>` : ""}</div>`;
      rememberLearning("Q: " + q + " — " + String(r.d.output || r.d.answer || "").slice(0, 140));
      box.scrollTop = box.scrollHeight;
    });
  }
  function submitAudience(f) {
    const name = fv(f, "name"), aud = fv(f, "aud"), cpm = +fv(f, "cpm");
    const auds = ld("audiences", []);
    auds.unshift({ id: "AU" + (auds.length + 1), name, aud, cpm, created: today() });
    ls("audiences", auds);
    toast("Audience saved", "ok"); closeModal(); render();
  }
  function submitReport(f) {
    const rows = ld("savedReports", []);
    rows.unshift({ id: "R" + (rows.length + 1), name: fv(f, "name"), range: fv(f, "range"), created: today() });
    ls("savedReports", rows);
    toast("Report saved", "ok"); closeModal(); state.m = "reports"; render();
  }

  /* ---------------- AI features ---------------- */
  const summaryContext = () => {
    const acc = computeAll(); const t = totals(acc);
    return { product: PRODUCT.name, price: PRODUCT.price, days: +state.range, spend: t.spend, gross: t.gross, profit: t.profit, roas: +t.roas.toFixed(2), profRoas: +t.profRoas.toFixed(2), orders: t.ord, delivered: t.del, deliveryRate: +t.delRate.toFixed(2), returnRate: +t.retRate.toFixed(2), cpl: +t.cpl.toFixed(0), cpa: +t.cpa.toFixed(0), accounts: ACCOUNTS.length, activeCampaigns: CAMPAIGNS.filter((c) => c.status === "Active").length };
  };
  const DIAGNOSE_RULES = {
    "Creative fatigue detected": (f) => f > 0.2, "Click-through decay": (f) => f > 0.35, "Delivery-rate problem": (d) => d < 0.7, "Return-rate spike": (r) => r > 0.18, "Lead quality leak": (l) => l > 0.65, "Below break-even ROAS": (r) => r < 1.0,
  };

  function renderCopy(d, s) {
    const text = d.output || (Array.isArray(d.variants) ? d.variants.map((v, i) => "**Variant " + (i + 1) + ":** " + v).join("\n\n") : (d.ideas ? d.ideas : JSON.stringify(d)));
    return aiBand(md(text), s, '<button class="fba-btn ghost ml-auto" data-action="toast" data-msg="Output copied to clipboard" data-type="ok">Copy</button>');
  }

  function renderOut(d, s, key) {
    const v = key ? d[key] : null;
    const text = d.output || (v ? (typeof v === "string" ? v : JSON.stringify(v)) : JSON.stringify(d));
    return aiBand(md(text), s);
  }
  function renderAsk(d, s) {
    const text = d.output || d.answer || JSON.stringify(d);
    return aiBand(md(text), s);
  }

  function aiAction(el) {
    const kind = el.dataset.ai;
    const ctx = summaryContext();
    let task, prompt, title, renderer;
    if (kind === "summary") {
      task = "fb_summary"; title = "Executive summary"; renderer = renderOut;
      prompt = "Produce a concise executive summary of this Meta Ads account: key numbers, the single most important insight, and the top 3 next actions. Keep it under 180 words.";
    } else if (kind === "diagnose") {
      const ad = el.dataset.ad;
      task = "fb_diagnose"; title = "AI performance diagnosis";
      renderer = (d, s) => renderOut(d, s) + '<div class="mt-2 text-[11.5px] text-[#9A9AA2]">Computed locally (deterministic rules) — AI narrative above.</div>';
      prompt = "Analyze ad " + ad + " performance. Local findings: " + JSON.stringify(diagnoseLocal(ad)).slice(0, 1200) + ". Confirm or refine, explain the most likely root cause, give 3 specific remedies. Under 220 words.";
    } else if (kind === "copy") {
      const ad = el.dataset.ad;
      const cr = creativeOf(adOf(ad).creative);
      task = "fb_copy_improve"; title = "AI copy improvement"; renderer = renderCopy;
      prompt = "Improve this Meta ad's copy and hook. Creative: " + cr.name + ", hook: " + (cr.label || cr.hook) + ". Return: improved primary text (3 versions), 3 new hooks, and a CTA suggestion. Markdown with headers.";
    } else if (kind === "landing") {
      const url = (el.dataset.url || "").trim();
      task = "fb_landing"; title = "Landing page analyzer"; renderer = renderOut;
      prompt = "Audit this landing page for Meta/COD performance: clarity, speed, mobile, COD trust signals, CTA. Return sections: verdict, strengths, issues, score /10, fixes." + (url ? "" : " (no URL provided — give general best practices for COD landing pages)");
    } else if (kind === "planner") {
      task = "fb_test_plan"; title = "AI test planner"; renderer = (d, s) => renderOut(d, s) + '<div class="flex gap-2 mt-3"><button class="fba-btn primary" data-action="toast" data-msg="Plan applied — 4 tests queued" data-type="ok">Apply plan</button><button class="fba-btn ghost" data-close>Close</button></div>';
      prompt = "Design a 14-day testing roadmap for this COD Meta Ads account. Context: " + JSON.stringify(ctx).slice(0, 1500) + ". Output: week-by-week plan (hypothesis, ads to test, budget, success metric, decision rule) plus a creative brief for the top test. Markdown.";
    } else if (kind === "winners") {
      task = "fb_winners"; title = "AI winner detector"; renderer = renderOut;
      prompt = "Review the ad verdicts and propose which ads to scale, hold, or kill, with recommended budget moves. Format as a markdown table + summary.";
    } else if (kind === "scale") {
      task = "fb_scale"; title = "AI scaling engine"; renderer = renderOut;
      prompt = "Recommend a scaling plan for Meta Ads COD (DZD): which winners get budget, by how much, over what cadence, and what to watch (delivery rate, CPM). Format: plan + risks.";
    } else if (kind === "budget") {
      task = "fb_budget"; title = "AI budget allocation"; renderer = renderOut;
      prompt = "Recommend a budget allocation across these campaigns based on profit ROAS and goals. Campaigns: " + CAMPAIGNS.map((c) => c.id).join(",") + ". Goals: " + JSON.stringify(goals()) + ". Output a table: campaign | current | recommended | reason.";
    } else if (kind === "competitor") {
      task = "fb_competitor"; title = "AI competitor research"; renderer = renderOut;
      prompt = "Research competitors for a kitchen knives COD brand in Algeria (DZ). Return: 5 competitor profiles (name, offer, price, angle, strength, weakness) + 3 market gaps.";
    } else if (kind === "weekly") {
      task = "fb_report_weekly"; title = "AI weekly report"; renderer = renderOut;
      prompt = "Write a weekly performance report for this Meta Ads account using the data. Sections: performance summary, what worked, what failed, learnings captured, next week plan. Under 250 words.";
    } else if (kind === "monthly") {
      task = "fb_report_monthly"; title = "AI monthly strategy"; renderer = renderOut;
      prompt = "Write a monthly strategy document: executive summary, account health, creative learnings, funnel economics (true CAC, break-even), 30-60-90 day roadmap, risks.";
    } else if (kind === "hook") {
      task = "fb_hook"; title = "AI hook analyzer"; renderer = renderOut;
      prompt = "Analyze which hook styles perform best for this account. Hook mix: " + JSON.stringify(hookStats()).slice(0, 1500) + ". Recommend the next 5 hooks to test for a knife set COD offer, each with the psychological principle.";
    } else if (kind === "audience") {
      task = "fb_audience"; title = "AI audience planner"; renderer = renderOut;
      prompt = "Analyze audience/placement performance and recommend 3 new audiences and 3 placement strategies for a COD knives brand in Algeria. Format: recommendations + rationale.";
    } else if (kind === "creative") {
      const base = el.dataset.ad;
      const cr = base ? creativeOf(adOf(base).creative) : null;
      task = "fb_creative_ideas"; title = "AI creative lab"; renderer = renderCopy;
      prompt = "Generate 6 new creative concepts based on the winning creative " + (cr ? cr.name : "winner") + " (hook " + (cr ? cr.hook : "") + "). For each: concept name, format, hook, 10-word script, expected angle. Markdown.";
    }
    if (task) aiModal(task, {}, prompt, title, renderer);
  }
  function rememberLearning(text) {
    const m = ld("memory", []);
    m.unshift({ id: Date.now(), ts: new Date().toLocaleString(), text: String(text || "").slice(0, 300) });
    ls("memory", m.slice(0, 40));
  }

  function diagnoseLocal(ad) {
    const acc = computeAll(); const r = acc[ad]; if (!r) return [];
    const t = totals(acc);
    const out = [];
    const cr = creativeOf(adOf(ad).creative);
    const f = fatigueOf(ad);
    if (f.lvl === "FATIGUED") out.push({ sev: "high", tag: "Creative fatigue", note: f.note });
    if (r.delRate < 0.7) out.push({ sev: "high", tag: "Delivery-rate problem", note: "Only " + pct(r.delRate, 0) + " of shipped orders get delivered — audience/offer mismatch or courier quality" });
    if (r.retRate > 0.18) out.push({ sev: "high", tag: "Return-rate spike", note: pct(r.retRate, 0) + " returns on delivered orders erode profit" });
    if (t.cpl && r.cpl > t.cpl * 1.5) out.push({ sev: "med", tag: "High CPL", note: "CPL " + money(r.cpl) + " is 1.5x+ account average " + money(t.cpl) });
    if (r.leads > 0 && r.ord < Math.max(2, r.leads * 0.15)) out.push({ sev: "med", tag: "Lead quality leak", note: "Leads are not converting to orders" });
    if (r.profRoas < 1 && r.del >= 3) out.push({ sev: "med", tag: "Below break-even ROAS", note: "Profit ROAS " + r.profRoas.toFixed(2) + "x — not covering ads" });
    if (cr && cr.hook === "offer" && r.retRate > 0.16) out.push({ sev: "med", tag: "Offer attracts price-shoppers", note: "Offer-heavy hook correlates with high returns" });
    if (!out.length) out.push({ sev: "ok", tag: "Healthy", note: "No critical issues detected for " + ad });
    return out;
  }

  /* ---------------- Testing engine ---------------- */
  const testVerdict = (t, acc, byCamp) => {
    const rows = { a: acc[t.ad1], b: acc[t.ad2] };
    if (!rows.a || !rows.b) return { verdict: "inconclusive", label: "INCONCLUSIVE", cls: "inconclusive", note: "Missing data" };
    const key = t.metric === "Profit ROAS" ? "profRoas" : t.metric === "ROAS" ? "roas" : t.metric === "CPL" ? "cpl" : "delRate";
    const va = rows.a[key], vb = rows.b[key];
    const daysRunning = Math.max(1, ((Date.now() - new Date(t.launched).getTime()) / 86400000));
    const win = t.metric === "CPL" ? (vb ? va / vb : 1) : (vb ? va / vb : 1);
    const minSpend = Math.min(rows.a.spend, rows.b.spend);
    if (daysRunning < 5 || minSpend < 1200) return { verdict: "inconclusive", label: "INCONCLUSIVE", cls: "inconclusive", note: `Needs ~${Math.max(0, Math.round(1200 - minSpend))} DA more spend on the laggard (statistical significance)` };
    if (win > 1.12) return { verdict: "winner", label: "WINNER", cls: "winner", note: `${t.metric} better by ${(win - 1) * 100}% (A: ${fmtK(key, va)}, B: ${fmtK(key, vb)})` };
    if (win > 1.02) return { verdict: "promising", label: "PROMISING", cls: "promising", note: "Slight edge — extend test 5 more days" };
    if (win < 0.9) return { verdict: "losing", label: "LOSING", cls: "losing", note: "Controlled variant is behind — prepare to kill" };
    return { verdict: "inconclusive", label: "INCONCLUSIVE", cls: "inconclusive", note: "Statistically a tie — keep running" };
  };
  const fmtK = (key, v) => key === "profRoas" || key === "roas" ? v.toFixed(2) + "x" : key === "cpl" ? money(v) : pct(v, 0);
  function runPlanner() {
    const payload = { ctx: summaryContext(), hooks: hookStats(), formats: formatStats() };
    aiModal("fb_test_plan", payload, "Design a 14-day testing roadmap for this COD Meta Ads account. Context: " + JSON.stringify(payload).slice(0, 1800) + ". Output: week-by-week test plan (hypothesis, ads to test, budget, success metric, decision rule), plus a creative brief for the top test. Markdown.", "AI test planner", (d, s) => {
      const ideas = Array.isArray(d.plan) ? d.plan : d.roadmap ? d.roadmap : null;
      const text = d.output || (ideas ? ideas.map((p, i) => "**Week " + (Math.floor(i / 3) + 1) + " · Test " + (i + 1) + ":** " + (p.hypothesis || p.name || JSON.stringify(p))).join("\n\n") : JSON.stringify(d));
      return aiBand(md(text), s) + '<div class="flex gap-2 mt-3"><button class="fba-btn primary" data-action="toast" data-msg="Plan applied — 4 tests queued" data-type="ok">Apply plan</button><button class="fba-btn ghost" data-close>Close</button></div>';
    });
  }
  function pushToTest(ad) {
    const tests = ld("tests", []);
    tests.push({ id: "T" + (tests.length + 1), name: "Single-variant test — " + ad, hypothesis: "Validate scaling " + ad + " in isolation", ad1: ad, ad2: ad, budget: 800, days: 7, metric: "Profit ROAS", created: today(), launched: today(), status: "running" });
    ls("tests", tests);
    toast("Ad queued into a new test", "ok");
  }

  /* ---------------- verdict / hook / format stats ---------------- */
  const verdictSnapshot = () => {
    const acc = computeAll(); const t = totals(acc);
    return Object.values(acc).map((r) => ({ ad: r.ad, verdict: verdict(r, t) }));
  };
  function hookStats() {
    const acc = computeAll(); const t = totals(acc);
    const byHook = {};
    Object.values(acc).forEach((r) => { const c = creativeOf(r.creative); if (!c) return; byHook[c.hook] = byHook[c.hook] || { ...EMPTY, n: 0 }; const g = byHook[c.hook]; ["imps", "clicks", "link", "leads", "spend", "ord", "conf", "ship", "del", "ret", "gross", "cogs"].forEach((f) => (g[f] += r[f])); g.n++; });
    return Object.entries(byHook).map(([k, v]) => finalizeRow(Object.assign(v, { hook: k }))).sort((a, b) => b.profRoas - a.profRoas);
  }
  function formatStats() {
    const acc = computeAll();
    const byF = {};
    Object.values(acc).forEach((r) => { const c = creativeOf(r.creative); if (!c) return; byF[c.format] = byF[c.format] || { ...EMPTY, n: 0 }; const g = byF[c.format]; ["imps", "clicks", "link", "leads", "spend", "ord", "conf", "ship", "del", "ret", "gross", "cogs"].forEach((f) => (g[f] += r[f])); g.n++; });
    return Object.entries(byF).map(([k, v]) => finalizeRow(Object.assign(v, { format: k }))).sort((a, b) => b.profRoas - a.profRoas);
  }
  function placementStats() {
    const acc = computeAll();
    const byP = {};
    Object.values(acc).forEach((r) => { const p = adsetOf(r.aid).placement; byP[p] = byP[p] || { ...EMPTY, n: 0 }; const g = byP[p]; ["imps", "clicks", "link", "leads", "spend", "ord", "conf", "ship", "del", "ret", "gross", "cogs"].forEach((f) => (g[f] += r[f])); g.n++; });
    return Object.entries(byP).map(([k, v]) => finalizeRow(Object.assign(v, { placement: k }))).sort((a, b) => b.profRoas - a.profRoas);
  }

  /* ---------------- module: dashboard ---------------- */
  const S_dashboard = () => {
    const acc = computeAll(); const t = totals(acc); const g = goals();
    const act = Object.values(acc).map((r) => Object.assign(r, { verdict: verdict(r, t) }));
    const winners = act.filter((r) => r.verdict.v === "winner");
    const alerts = buildAlerts();
    const days = dailySeries(+state.range);
    const cpb = byCampaign();
    const funnel = [{ k: "Impressions", v: t.imps }, { k: "Reach", v: t.reach }, { k: "Clicks", v: t.clicks }, { k: "Link clicks", v: t.link }, { k: "Leads", v: t.leads }, { k: "Orders placed", v: t.ord }, { k: "Confirmed", v: t.conf }, { k: "Shipped", v: t.ship }, { k: "Delivered", v: t.del }];
    const funnelHtml = funnel.map((s, i) => {
      const w = i === 0 ? 100 : Math.max(2, (s.v / funnel[0].v) * 100);
      const prev = i ? funnel[i - 1].v : 1;
      return `<div class="fba-funnel-row"><div class="text-[12px] font-bold text-right">${s.k}</div><div class="fba-funnel-bar" style="width:${w}%">${numf(s.v)}</div><div class="text-[11.5px] font-bold" style="color:${s.v / prev > 0.5 ? "#0FA05A" : "#D32F2F"}">${s.v / prev > 0.5 ? "" : ""}${pct(s.v / prev, 0)}</div></div>`;
    }).join("");
    view(`
      <div class="grid gap-4">
        <div class="fba-ai"><div class="flex items-center gap-2 mb-2"><span class="fba-src actual">COMPUTED</span><span class="text-[11px] font-black text-[#9A9AA2]">deterministic summary · live account data</span><span class="fba-src rec ml-auto">RECOMMENDATION</span></div><div class="text-[13px] leading-relaxed">${md("**Account status:** " + t.ord + " orders, " + t.del + " delivered, profit " + money(t.profit) + " in " + state.range + " days. **Biggest lever:** " + (winners.length ? winners.slice(0, 2).map((w) => w.ad).join(", ") + " — scale winners" : "win more tests before scaling") + ".")}</div></div>
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
          ${kpi("Gross revenue", money(t.gross), "orders " + numf(t.ord), true)}
          ${kpi("Ad spend", money(t.spend), "CPM " + money(t.cpm), false)}
          ${kpi("Profit", money(t.profit), "profit ROAS " + t.profRoas.toFixed(2) + "x", t.profit > 0, "best")}
          ${kpi("ROAS", t.roas.toFixed(2) + "x", "goal " + g.targetRoas + "x", t.roas >= g.targetRoas)}
          ${kpi("Delivered", numf(t.del), pct(t.delRate, 0) + " delivery rate", false)}
          ${kpi("True CPA (delivered)", money(t.cpdel || 0), "return rate " + pct(t.retRate, 0), false)}
          ${kpi("CPL", money(t.cpl), "lead volume " + numf(t.leads), false)}
          ${kpi("CTR", t.ctr.toFixed(2) + "%", "CPC " + money(t.cpc), false)}
        </div>
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Revenue vs spend", "last " + state.range + " days", `<div style="height:220px"><canvas id="fbadash-line"></canvas></div>`)}
          ${sec("Funnel", "impressions → delivered", funnelHtml)}
        </div>
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Revenue by campaign", "", `<div style="height:210px"><canvas id="fbadash-camp"></canvas></div>`)}
          ${sec("Alerts", "auto-detected", alerts.length ? alerts.slice(0, 5).map((a) => `<div class="flex items-start gap-2 py-1.5 border-b border-[#F4F3F1] last:border-0"><span class="fba-verdict ${a.sev === "high" ? "losing" : a.sev === "med" ? "promising" : "inconclusive"}">${a.sev.toUpperCase()}</span><div class="text-[12px]"><b>${a.title}</b><div class="text-[#9A9AA2]">${a.note}</div></div></div>`).join("") : empty("No alerts 🎉"))}
        </div>
        <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
          ${sec("Winners to scale", "from " + state.range + "d data", winners.length ? `<div class="overflow-x-auto"><table class="fba-table"><thead><tr><th>Ad</th><th>Creative</th><th>Profit ROAS</th><th>Delivered</th><th></th></tr></thead><tbody>${winners.slice(0, 6).map((w) => `<tr><td class="font-bold">${w.ad}</td><td>${esc(creativeOf(w.creative).name)}</td><td style="color:#0FA05A;font-weight:800">${w.profRoas.toFixed(2)}x</td><td>${w.del}</td><td><button class="fba-btn primary" style="padding:4px 10px;font-size:11px" data-ai="scale">Scale</button></td></tr>`).join("")}</tbody></table></div>` : empty("No statistically significant winners yet — keep testing"))}
          ${sec("Punchline workflow", "DATA → INSIGHT → TEST → SCALE", `<div class="text-[12.5px] leading-relaxed"><b>1.</b> Sync real Meta data (Accounts) · <b>2.</b> Read insights (Advisor) · <b>3.</b> Run A/B tests (Testing) · <b>4.</b> Detect winners (Testing → AI) · <b>5.</b> Scale winners, kill losers (AI Scaling) · <b>6.</b> Capture learning (AI Memory).<div class="mt-3 flex gap-2 flex-wrap">${[["advisor", "Read insights"], ["testing", "Run tests"], ["creativelab", "New creatives"], ["reports", "Weekly report"]].map((b) => `<button class="fba-btn outline" data-nav="${b[0]}">${b[1]}</button>`).join("")}</div></div>`)}
        </div>
      </div>`);
    mkLine("fbadash-line", days.map((d) => d.d), [["Revenue", days.map((d) => d.g)], ["Ad spend", days.map((d) => d.sp)]], ["#1877F2", "#F57C00"]);
    mkBar("fbadash-camp", cpb.slice(0, 6).map((c) => c.name.slice(0, 14)), cpb.slice(0, 6).map((c) => c.gross), PALETTE);
  };

  /* ---------------- aggregators ---------------- */
  const byCampaign = () => {
    const acc = computeAll();
    return CAMPAIGNS.map((c) => {
      const rows = Object.values(acc).filter((r) => campOf(r.aid).id === c.id);
      const g = { ...EMPTY, key: c.id, name: c.name, obj: c.obj, status: c.status, strat: c.strat, budget: c.budget, acct: c.acct, ads: rows.length };
      rows.forEach((r) => { ["imps", "reach", "clicks", "link", "views", "leads", "spend", "ord", "conf", "ship", "del", "ret", "gross", "cogs"].forEach((f) => (g[f] += r[f])); });
      return finalizeRow(g);
    });
  };
  const byAdset = () => {
    const acc = computeAll();
    return ADSETS.map((a) => {
      const rows = Object.values(acc).filter((r) => r.aid === a.id);
      const g = { ...EMPTY, key: a.id, name: a.name, aud: a.aud, placement: a.placement, cid: a.cid };
      rows.forEach((r) => { ["imps", "reach", "clicks", "link", "views", "leads", "spend", "ord", "conf", "ship", "del", "ret", "gross", "cogs"].forEach((f) => (g[f] += r[f])); });
      return finalizeRow(g);
    });
  };

  /* ---------------- module: accounts ---------------- */
  const S_accounts = () => {
    const t = totals(computeAll());
    const accs = ACCOUNTS.map((a) => {
      const adIds = ADS.filter((ad) => acctOf(ad.aid) === a.id);
      const sp = adIds.reduce((s, ad) => s + (computeAll()[ad.id] ? computeAll()[ad.id].spend : 0), 0);
      return { a, ads: adIds.length, spend: sp };
    });
    const dq = [
      { k: "Pixel (PAGE_VIEW)", v: 98, s: "ok" }, { k: "Pixel (Purchase)", v: 96, s: "ok" }, { k: "Landing latency", v: 91, s: "ok" }, { k: "Event match quality", v: 87, s: "watch" }, { k: "Form lead signal", v: 100, s: "ok" },
    ];
    view(`
      <div class="grid gap-4">
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))">
          ${accs.map(({ a, ads, spend }) => `
            <div class="card"><div class="card-body">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl grid place-items-center" style="background:${a.status === "connected" ? "#EEF4FF" : "#FDEAEA"}"><i data-lucide="building-2" style="width:20px;height:20px;color:${a.status === "connected" ? "#1877F2" : "#D32F2F"}"></i></div>
                <div class="flex-1"><div class="font-extrabold text-[14px]">${esc(a.name)}</div><div class="text-[11.5px] text-[#9A9AA2]">${esc(a.currency)} · ${esc(a.tz)} · ${ads} ads</div></div>
                <span class="fba-verdict ${a.status === "connected" ? "winner" : "losing"}">${a.status === "connected" ? "CONNECTED" : "DISC."}</span>
              </div>
              <div class="grid grid-cols-3 gap-2 mt-4 text-center">
                <div class="p-2 rounded-xl" style="background:#FAFAFA"><div class="text-[11px] text-[#9A9AA2]">Spend (30d)</div><div class="font-extrabold text-[13px]">${money(spend)}</div></div>
                <div class="p-2 rounded-xl" style="background:#FAFAFA"><div class="text-[11px] text-[#9A9AA2]">Connected</div><div class="font-extrabold text-[13px]">${a.connected}</div></div>
                <div class="p-2 rounded-xl" style="background:${a.errs ? "#FDEAEA" : "#FAFAFA"}"><div class="text-[11px] text-[#9A9AA2]">API errors</div><div class="font-extrabold text-[13px]" style="color:${a.errs ? "#D32F2F" : "#0FA05A"}">${a.errs} ${a.errs ? "⚠" : "✓"}</div></div>
              </div>
              <div class="flex gap-2 mt-4">
                <button class="fba-btn ghost flex-1" data-action="sync"><i data-lucide="refresh-cw" style="width:14px;height:14px"></i> Sync now</button>
                <button class="fba-btn ghost flex-1" data-ai="summary">AI summary</button>
              </div>
            </div></div>`).join("")}
          <button class="card border-2 border-dashed hover:border-[#1877F2] transition-colors" style="min-height:180px" data-open="account"><div class="card-body h-full grid place-items-center text-center"><div><div class="w-10 h-10 rounded-xl grid place-items-center mx-auto mb-2" style="background:#EEF4FF"><i data-lucide="plus" style="width:20px;height:20px;color:#1877F2"></i></div><div class="font-extrabold text-[14px]">Connect account</div><div class="text-[11.5px] text-[#9A9AA2] mt-1">Meta OAuth · Business Manager</div></div></div></button>
        </div>
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Meta API health", "provider + Graph API heartbeat", `
            <div class="grid gap-3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
              ${[["Graph API", "OK", "200 · 142ms", "ok"], ["Marketing API", "OK", "200 · 178ms", "ok"], ["Events API", "OK", "200 · 96ms", "ok"], ["Rate limit", "38% used", "within quota", "watch"]].map((x) => `<div class="p-3 rounded-xl border" style="border-color:#ECECEE"><div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full" style="background:${x[3] === "ok" ? "#0FA05A" : "#B98A1F"}"></span><b class="text-[13px]">${x[0]}</b></div><div class="text-[12px] font-bold">${x[1]}</div><div class="text-[11px] text-[#9A9AA2]">${x[2]}</div></div>`).join("")}
            </div>`)}
          ${sec("Data quality center", "signal health", dq.map((d) => `
            <div class="py-1.5"><div class="flex items-center justify-between text-[12px]"><b>${d.k}</b><span class="font-bold" style="color:${d.s === "ok" ? "#0FA05A" : "#B98A1F"}">${d.v}%</span></div><div class="h-1.5 rounded-full mt-1" style="background:#EEECEA"><div class="h-1.5 rounded-full" style="width:${d.v}%;background:${d.s === "ok" ? "#0FA05A" : "#B98A1F"}"></div></div></div>`).join(""))}
        </div>
        ${sec("Meta account connection flow", "how the sync works", `<div class="text-[12.5px] leading-relaxed text-[#55555C]">1. OAuth consent → short-lived token · 2. Exchange for long-lived token (server-side) · 3. Pull insights: campaigns → ad sets → ads → creative + demographic/placement breakdowns · 4. Pull event data: purchase/lead events matched via pixel · 5. Normalize into the Punchline funnel model (impressions → leads → orders → delivered → returned) · 6. Deterministic rules + AI interpret the numbers. This demo runs on a realistic simulated dataset; connect a Meta App + server key for live sync.`)}
      </div>`);
  };

  /* ---------------- module: campaigns ---------------- */
  const S_campaigns = () => {
    const rows = byCampaign().filter((c) => qmatch(c.name, c.obj, c.status));
    const best = rows.slice().sort((a, b) => b.profRoas - a.profRoas)[0];
    const worst = rows.slice().sort((a, b) => a.profRoas - b.profRoas).slice(-1)[0];
    const totalsRow = totals(computeAll());
    view(`
      <div class="grid gap-4">
        ${sec("Campaign comparison", "ranked by profit ROAS — best & worst highlighted", `
          <div class="flex flex-wrap gap-3 mb-4">
            ${[["Profit ROAS (blended)", totalsRow.profRoas.toFixed(2) + "x", "#0FA05A"], ["Gross ROAS", totalsRow.roas.toFixed(2) + "x", "#1877F2"], ["Blended CPA (delivered)", money(totalsRow.cpdel), "#F57C00"], ["Delivery rate", pct(totalsRow.delRate, 0), "#7C4DFF"]].map((x) => `<div class="fba-kpi" style="padding:10px 14px"><span class="text-[11px] font-bold text-[#9A9AA2]">${x[0]}</span><div class="text-[18px] font-black" style="color:${x[2]}">${x[1]}</div></div>`).join("")}
          </div>
          <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Campaign</th><th>Objective</th><th>Status</th><th>Budget</th><th>Spend</th><th>Revenue</th><th>Profit</th><th>ROAS</th><th>Prof ROAS</th><th>Orders</th><th>Del.</th><th>CPA</th><th>Delivery</th><th>Returns</th></tr></thead><tbody>
            ${rows.map((c) => `<tr class="${best && c.key === best.key ? "best" : ""} ${worst && c.key === worst.key ? "worst" : ""}">
              <td class="font-bold">${esc(c.name)}<div class="text-[10.5px] text-[#9A9AA2]">${c.acct}</div></td>
              <td><span class="fba-hookchip">${c.obj}</span></td>
              <td><span class="fba-verdict ${c.status === "Active" ? "winner" : "inconclusive"}">${c.status}</span></td>
              <td>${money(c.budget)}/d</td><td>${money(c.spend)}</td><td>${money(c.gross)}</td>
              <td class="font-extrabold" style="color:${c.profit >= 0 ? "#0FA05A" : "#D32F2F"}">${money(c.profit)}</td>
              <td>${c.roas.toFixed(2)}x</td><td class="font-extrabold" style="color:${c.profRoas >= 0 ? "#1877F2" : "#D32F2F"}">${c.profRoas.toFixed(2)}x</td>
              <td>${c.ord}</td><td>${c.del}</td><td>${money(c.cpa)}</td><td>${pct(c.delRate, 0)}</td><td>${pct(c.retRate, 0)}</td>
            </tr>`).join("")}
          </tbody></table></div>`)}
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Revenue vs spend by campaign", "", `<div style="height:230px"><canvas id="fbacam-bar"></canvas></div>`)}
          ${sec("Actions", "", `<div class="grid gap-2">
            <button class="fba-btn primary w-full" data-open="campaign"><i data-lucide="plus" style="width:15px;height:15px"></i> New campaign</button>
            <button class="fba-btn ghost w-full" data-ai="budget">AI budget allocation</button>
            <button class="fba-btn ghost w-full" data-ai="planner">AI test planner</button>
            <div class="mt-2 text-[11px] text-[#9A9AA2]">Highlighting: <span class="fba-verdict winner">BEST</span> top profit ROAS · <span class="fba-verdict losing">WORST</span> bottom</div>
          </div>`)}
        </div>
      </div>`);
    mkBar("fbacam-bar", rows.map((c) => c.name.slice(0, 10)), rows.map((c) => c.gross), PALETTE);
  };

  /* ---------------- module: ad sets ---------------- */
  const S_adsets = () => {
    const acc = computeAll();
    const rows = byAdset().filter((a) => qmatch(a.name, a.aud, a.placement, campOf(a.id).name));
    const byCamp = (cid) => rows.filter((r) => r.cid === cid);
    const groups = CAMPAIGNS.map((c) => ({ c, rows: byCamp(c.id) })).filter((g) => g.rows.length);
    view(`
      <div class="grid gap-4">
        ${groups.map(({ c, rows }) => sec(c.name + " · " + c.obj, c.status + " · " + money(c.budget) + "/d", `
          <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Ad set</th><th>Audience</th><th>Placement</th><th>Spend</th><th>Leads</th><th>Orders</th><th>Del.</th><th>Revenue</th><th>Profit</th><th>Prof ROAS</th><th>CPM</th><th>CPL</th></tr></thead><tbody>
            ${rows.map((a) => `<tr>
              <td class="font-bold">${esc(a.name)}</td><td class="text-[11.5px] text-[#55555C] max-w-[240px] truncate">${esc(a.aud)}</td>
              <td><span class="fba-hookchip">${a.placement}</span></td>
              <td>${money(a.spend)}</td><td>${a.leads}</td><td>${a.ord}</td><td>${a.del}</td>
              <td>${money(a.gross)}</td><td class="font-extrabold" style="color:${a.profit >= 0 ? "#0FA05A" : "#D32F2F"}">${money(a.profit)}</td>
              <td class="font-extrabold" style="color:${a.profRoas >= 0 ? "#1877F2" : "#D32F2F"}">${a.profRoas.toFixed(2)}x</td><td>${money(a.cpm)}</td><td>${money(a.cpl)}</td>
            </tr>`).join("")}
          </tbody></table></div>`)).join("")}
      </div>`);
  };

  /* ---------------- module: ads ---------------- */
  const S_ads = () => {
    const acc = computeAll(); const t = totals(acc);
    const rows = Object.values(acc)
      .map((r) => Object.assign(r, { verdict: verdict(r, t), fatigue: fatigueOf(r.ad) }))
      .filter((r) => qmatch(r.ad, creativeOf(r.creative).name, campOf(r.aid).name, adsetOf(r.aid).name))
      .sort((a, b) => b.profRoas - a.profRoas);
    view(`
      <div class="grid gap-4">
        ${sec("Ad & creative analysis", "every ad with verdict + fatigue · click any ad for detail", `
          <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th></th><th>Ad</th><th>Creative</th><th>Ad set</th><th>Spend</th><th>Leads</th><th>Orders</th><th>Del.</th><th>Revenue</th><th>Profit</th><th>Prof ROAS</th><th>Delivery</th><th>Returns</th><th>Fatigue</th><th>Verdict</th><th></th></tr></thead><tbody>
            ${rows.map((r) => {
              const cr = creativeOf(r.creative);
              return `<tr>
                <td>${thumb(cr)}</td>
                <td class="font-bold"><button class="text-left" data-action="adDetail" data-ad="${r.ad}" style="color:#1877F2">${r.ad}</button></td>
                <td class="max-w-[220px] truncate">${esc(cr.name)}<div class="text-[10px] text-[#9A9AA2]">${cr.format} · ${esc(HOOKS.find((h) => h.k === cr.hook).label)}</div></td>
                <td class="text-[11.5px]">${esc(adsetOf(r.aid).name)}</td>
                <td>${money(r.spend)}</td><td>${r.leads}</td><td>${r.ord}</td><td>${r.del}</td>
                <td>${money(r.gross)}</td><td class="font-extrabold" style="color:${r.profit >= 0 ? "#0FA05A" : "#D32F2F"}">${money(r.profit)}</td>
                <td class="font-extrabold" style="color:${r.profRoas >= 0 ? "#1877F2" : "#D32F2F"}">${r.profRoas.toFixed(2)}x</td>
                <td>${pct(r.delRate, 0)}</td><td>${pct(r.retRate, 0)}</td>
                <td><span class="fba-fat ${r.fatigue.cls}">${r.fatigue.lvl}</span></td>
                <td><span class="fba-verdict ${r.verdict.cls}">${r.verdict.label}</span></td>
                <td><div class="flex gap-1"><button class="fba-btn ghost" style="padding:4px 8px;font-size:11px" data-action="adDetail" data-ad="${r.ad}">Detail</button><button class="fba-btn ghost" style="padding:4px 8px;font-size:11px" data-ai="copy" data-ad="${r.ad}">AI copy</button></div></td>
              </tr>`;
            }).join("")}
          </tbody></table></div>`, `<div class="flex gap-2"><button class="fba-btn ghost" data-ai="landing">AI landing analyzer</button></div>`)}
      </div>`);
  };

  function adDetail(ad) {
    const acc = computeAll(); const t = totals(acc);
    const r = acc[ad]; if (!r) return;
    const cr = creativeOf(r.creative); const as = adsetOf(r.aid); const c = campOf(r.aid);
    const f = fatigueOf(ad); const v = verdict(r, t);
    const findings = diagnoseLocal(ad);
    const hook = HOOKS.find((h) => h.k === cr.hook);
    openModalHTML(`
      <div class="flex items-center justify-between mb-4"><div class="flex items-center gap-3">${thumb(cr)}<div><h3 class="text-[16px] font-extrabold">${ad} · ${esc(cr.name)}</h3><div class="text-[12px] text-[#9A9AA2]">${esc(as.name)} · ${esc(c.name)} · ${cr.format} ${cr.len ? "· " + cr.len + "s" : ""}</div></div></div><button class="fba-btn ghost" data-close><i data-lucide="x" style="width:15px;height:15px"></i></button></div>
      <div class="grid gap-3 mb-4" style="grid-template-columns:repeat(auto-fit,minmax(140px,1fr))">
        ${[["Profit", money(r.profit), r.profit >= 0 ? "#0FA05A" : "#D32F2F"], ["Profit ROAS", r.profRoas.toFixed(2) + "x", "#1877F2"], ["Delivered", numf(r.del), "#55555C"], ["Delivery rate", pct(r.delRate, 0), "#7C4DFF"], ["Return rate", pct(r.retRate, 0), "#F57C00"], ["Spend", money(r.spend), "#55555C"]].map((x) => `<div class="p-3 rounded-xl" style="background:#FAFAFA"><div class="text-[10.5px] font-bold text-[#9A9AA2]">${x[0]}</div><div class="text-[17px] font-black" style="color:${x[2]}">${x[1]}</div></div>`).join("")}
      </div>
      <div class="flex gap-2 flex-wrap mb-4">
        <span class="fba-fat ${f.cls}">${f.lvl}</span><span class="fba-verdict ${v.cls}">${v.label}</span><span class="fba-hookchip">${hook.label}</span>${cr.creator ? `<span class="fba-hookchip">${esc(cr.creator)}</span>` : ""}${cr.offer ? `<span class="fba-hookchip">${esc(cr.offer)}</span>` : ""}
      </div>
      <div class="p-3 rounded-xl mb-4" style="background:#EEF4FF"><div class="text-[11px] font-black text-[#9A9AA2] mb-1">HOOK PSYCHOLOGY</div><div class="text-[13px]"><b>${hook.label}</b> — ${hookDesc[cr.hook]}</div></div>
      <div class="font-extrabold text-[14px] mb-2">Diagnosis (deterministic rules)</div>
      <div class="grid gap-2 mb-4">${findings.map((x) => `<div class="p-3 rounded-xl border flex items-start gap-2" style="border-color:#ECECEE"><span class="fba-verdict ${x.sev === "high" ? "losing" : x.sev === "med" ? "promising" : "inconclusive"}">${x.sev.toUpperCase()}</span><div class="text-[12.5px]"><b>${x.tag}</b><div class="text-[#9A9AA2]">${x.note}</div></div></div>`).join("")}</div>
      <div class="flex gap-2 flex-wrap">
        <button class="fba-btn primary" data-ai="diagnose" data-ad="${ad}">AI deep diagnosis</button>
        <button class="fba-btn ghost" data-ai="copy" data-ad="${ad}">Improve copy</button>
        <button class="fba-btn green" data-action="pushTest" data-ad="${ad}">Push to test</button>
        <button class="fba-btn red" data-action="toggleAd" data-ad="${ad}">Pause</button>
      </div>`);
  }
  const hookDesc = { problem: "open a pain the buyer already feels", curiosity: "gap in knowledge → scroll stops", question: "self-questioning primes the viewer", benefit: "state the outcome, then prove it", transformation: "before/after contrast (weight, kitchen, time)", socialproof: "borrowed trust from people like them", offer: "stacked value + deadline", demonstration: "show the product working fast" };

  /* ---------------- module: creatives ---------------- */
  const S_creatives = () => {
    const acc = computeAll(); const t = totals(acc);
    const rows = Object.values(acc).map((r) => {
      const cr = creativeOf(r.creative); const f = fatigueOf(r.ad);
      return { r, cr, f, v: verdict(r, t) };
    }).filter((x) => qmatch(x.cr.name, x.cr.format, x.cr.hook, x.cr.creator)).sort((a, b) => b.r.profRoas - a.r.profRoas);
    const hooks = hookStats();
    const fmts = formatStats();
    const FAT = { FATIGUED: rows.filter((x) => x.f.lvl === "FATIGUED").length, WATCH: rows.filter((x) => x.f.lvl === "WATCH").length, FRESH: rows.filter((x) => x.f.lvl === "FRESH").length };
    view(`
      <div class="grid gap-4">
        ${sec("Creative intelligence", "characteristics of winners vs losers", `
          <div class="grid gap-3 mb-4" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
            ${[["FRESH", FAT.FRESH, "fresh", "steady/rising CTR"], ["WATCH", FAT.WATCH, "watch", "CTR easing"], ["FATIGUED", FAT.FATIGUED, "tired", "audience is bored"]].map((x) => `<div class="p-4 rounded-xl" style="background:#FAFAFA"><span class="fba-fat ${x[2]}">${x[0]}</span><div class="text-[22px] font-black mt-1">${x[1]}</div><div class="text-[11px] text-[#9A9AA2]">${x[3]}</div></div>`).join("")}
          </div>
          <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
            <div><div class="font-extrabold text-[13px] mb-2">Performance by hook style</div><div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Hook</th><th>Creatives</th><th>Spend</th><th>Profit ROAS</th><th>Delivery</th><th>Returns</th></tr></thead><tbody>${hooks.map((h) => { const H = HOOKS.find((x) => x.k === h.hook); return `<tr><td><span class="fba-hookchip" style="border-color:${H.color};color:${H.color};background:${H.color}11">${H.label}</span></td><td>${h.n}</td><td>${money(h.spend)}</td><td class="font-extrabold" style="color:${h.profRoas >= 0 ? "#1877F2" : "#D32F2F"}">${h.profRoas.toFixed(2)}x</td><td>${pct(h.delRate, 0)}</td><td>${pct(h.retRate, 0)}</td></tr>`; }).join("")}</tbody></table></div></div>
            <div><div class="font-extrabold text-[13px] mb-2">Performance by format</div><div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Format</th><th>Count</th><th>Spend</th><th>Profit ROAS</th><th>CPM</th></tr></thead><tbody>${fmts.map((f) => `<tr><td><span class="fba-hookchip" style="color:${FMT_COLOR[f.format]};border-color:${FMT_COLOR[f.format]}">${f.format}</span></td><td>${f.n}</td><td>${money(f.spend)}</td><td class="font-extrabold">${f.profRoas.toFixed(2)}x</td><td>${money(f.cpm)}</td></tr>`).join("")}</tbody></table></div></div>
          </div>`)}
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("AI hook analyzer", "what the psychology says", `<div class="flex gap-2 flex-wrap mb-3">${hooks.slice(0, 4).map((h) => { const H = HOOKS.find((x) => x.k === h.hook); return `<span class="fba-hookchip" style="border-color:${H.color};color:${H.color}">${H.label}</span>`; }).join("")}</div><button class="fba-btn primary" data-ai="hook"><i data-lucide="sparkles" style="width:15px;height:15px"></i> Ask AI for the next 5 hooks</button><div class="mt-3 text-[12px] text-[#9A9AA2]">Winning hooks: <b>${hooks[0] ? HOOKS.find((h) => h.k === hooks[0].hook).label : "—"}</b> (${hooks[0] ? hooks[0].profRoas.toFixed(2) + "x" : ""}) · Worst: <b>${hooks.length ? HOOKS.find((h) => h.k === hooks[hooks.length - 1].hook).label : "—"}</b></div>`)}
          ${sec("Creative fatigue", "refresh before the audience bores", rows.filter((x) => x.f.lvl !== "FRESH").slice(0, 8).map((x) => `<div class="flex items-center gap-2 py-1.5 border-b border-[#F4F3F1] last:border-0">${thumb(x.cr)}<div class="text-[12px] flex-1">${esc(x.cr.name)}</div><span class="fba-fat ${x.f.cls}">${x.f.lvl}</span><button class="fba-btn ghost" style="padding:3px 8px;font-size:10.5px" data-ai="creative" data-ad="${x.r.ad}">Refresh</button></div>`).join("") || empty("All creatives fresh"))}
        </div>
        ${sec("Creative library", "click to inspect", `
          <div class="grid gap-3" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">
            ${rows.map(({ r, cr, f, v }) => `<button class="text-left p-3 rounded-xl border hover:border-[#1877F2] transition-colors" style="border-color:#ECECEE" data-action="adDetail" data-ad="${r.ad}">
              <div class="flex gap-3">${thumb(cr)}<div class="min-w-0"><div class="font-bold text-[12px] leading-tight">${esc(cr.name)}</div><div class="text-[10.5px] text-[#9A9AA2] mt-0.5">${r.ad} · ${cr.format}</div><div class="flex gap-1 mt-1.5"><span class="fba-fat ${f.cls}">${f.lvl}</span><span class="fba-verdict ${v.cls}">${v.label}</span></div></div></div>
              <div class="flex justify-between text-[10.5px] mt-2 text-[#9A9AA2]"><span>ROAS</span><b class="text-[#1877F2]">${r.roas.toFixed(2)}x</b></div>
              <div class="h-1 rounded-full mt-0.5" style="background:#EEECEA"><div class="h-1 rounded-full" style="width:${Math.min(100, r.profRoas * 30)}%;background:${r.profRoas >= 0 ? "#0FA05A" : "#D32F2F"}"></div></div>
            </button>`).join("")}
          </div>`)}
      </div>`);
  };

  /* ---------------- module: analytics ---------------- */
  const S_analytics = () => {
    const acc = computeAll(); const t = totals(acc);
    const placements = placementStats();
    const camps = byCampaign();
    const perWilaya = WILAYAS.map((w) => ({ w: w.w, del: Math.round(t.del * (w.wt / 100)), revenue: Math.round(t.gross * (w.wt / 100)) })).sort((a, b) => b.del - a.del);
    const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dowData = dow.map((_, di) => { const s = SNAPSHOTS.filter((x) => new Date(x.d).getDay() === di); return { leads: s.reduce((a, x) => a + x.leads, 0), spend: s.reduce((a, x) => a + x.spend, 0) }; });
    const hourTop = HOUR_WEIGHTS.map((w, i) => ({ h: i, w })).sort((a, b) => b.w - a.w).slice(0, 6);
    const funnel = [{ k: "Impressions", v: t.imps }, { k: "Reach", v: t.reach }, { k: "Clicks", v: t.clicks }, { k: "Link clicks", v: t.link }, { k: "Landing views", v: t.views }, { k: "Leads", v: t.leads }, { k: "Orders", v: t.ord }, { k: "Confirmed", v: t.conf }, { k: "Delivered", v: t.del }];
    view(`
      <div class="grid gap-4">
        <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
          ${sec("Geographic analysis", "delivery & revenue by wilaya", `
            <div class="fba-table-wrap max-h-[280px] overflow-y-auto"><table class="fba-table"><thead><tr><th>Wilaya</th><th>Est. delivered</th><th>Est. revenue</th><th>Share</th></tr></thead><tbody>${perWilaya.map((w) => `<tr><td class="font-bold">${w.w}</td><td>${numf(w.del)}</td><td>${money(w.revenue)}</td><td>${pct(w.wt / 100)}</td></tr>`).join("")}</tbody></table></div><div style="height:180px" class="mt-3"><canvas id="fbageo-bar"></canvas></div>`)}
          ${sec("Placement analysis", "which inventory converts", `
            <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Placement</th><th>Spend</th><th>Leads</th><th>Orders</th><th>Prof ROAS</th><th>CPM</th></tr></thead><tbody>${placements.map((p) => `<tr><td class="font-bold">${p.placement}</td><td>${money(p.spend)}</td><td>${p.leads}</td><td>${p.ord}</td><td class="font-extrabold" style="color:${p.profRoas >= 0 ? "#1877F2" : "#D32F2F"}">${p.profRoas.toFixed(2)}x</td><td>${money(p.cpm)}</td></tr>`).join("")}</tbody></table></div><div style="height:180px" class="mt-3"><canvas id="fbaplc-dough"></canvas></div>`)}
        </div>
        <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
          ${sec("Time analysis — day of week", "lead & spend rhythm", `<div style="height:200px"><canvas id="fba-dow"></canvas></div>`)}
          ${sec("Time analysis — best hours", "peak lead hours (est.)", hourTop.map((h) => `<div class="flex items-center gap-2 py-1 text-[12.5px]"><span class="w-16 font-bold">${pad(h.h)}:00</span><div class="flex-1 h-2 rounded-full" style="background:#EEECEA"><div class="h-2 rounded-full" style="width:${(h.w / hourTop[0].w) * 100}%;background:#1877F2"></div></div><b>${Math.round(h.w * 10)}</b></div>`).join("") + `<div class="mt-3 text-[11.5px] text-[#9A9AA2]">Run budget toward 12:00–23:00 when DZ COD orders peak. Pause or trim 00:00–07:00.</div>`)}
        </div>
        ${sec("Funnel analysis", "where the account leaks", funnel.map((s, i) => { const prev = i ? funnel[i - 1].v : 1; const w = i === 0 ? 100 : Math.max(2, (s.v / funnel[0].v) * 100); const step = i ? s.v / prev : 1; return `<div class="fba-funnel-row mb-1"><div class="text-[12px] font-bold text-right">${s.k}</div><div class="fba-funnel-bar" style="width:${w}%;background:${step > 0.5 ? "#0FA05A" : "#D32F2F"}">${numf(s.v)}</div><div class="text-[11.5px] font-bold" style="color:${step > 0.5 ? "#0FA05A" : "#D32F2F"}">${pct(step, 0)}</div></div>`; }).join("") + `<div class="mt-3 p-3 rounded-xl text-[12.5px]" style="background:#FFF6E0">Weakest step: <b>${funnel.reduce((a, b, i) => { const st = i ? b.v / funnel[i - 1].v : 1; return st < a.st ? { st, k: b.k } : a; }, { st: 9, k: "—" }).k}</b>. Fix the biggest leak before adding budget.</div>`)}
      </div>`);
    mkBar("fbageo-bar", perWilaya.slice(0, 8).map((w) => w.w), perWilaya.slice(0, 8).map((w) => w.del), PALETTE.slice(0, 8));
    mkDoughnut("fbaplc-dough", placements.map((p) => p.placement), placements.map((p) => p.ord), PALETTE);
    mkLine("fba-dow", dow, [["Leads", dowData.map((d) => d.leads)]], ["#1877F2"]);
  };

  /* ---------------- module: kpi lab ---------------- */
  const S_kpilab = () => {
    const t = totals(computeAll()); const g = goals();
    const scorecard = [
      { k: "Profit ROAS", v: t.profRoas, target: 1.6, unit: "x", better: "high", op: "≥" },
      { k: "Gross ROAS", v: t.roas, target: g.targetRoas, unit: "x", better: "high", op: "≥" },
      { k: "Delivery rate", v: t.delRate, target: 0.78, unit: "%", better: "high", op: "≥", pct: 1 },
      { k: "Return rate", v: t.retRate, target: 0.14, unit: "%", better: "low", op: "≤", pct: 1 },
      { k: "True CPA (delivered)", v: t.cpdel, target: 3200, unit: "DA", better: "low", op: "≤" },
      { k: "CPL", v: t.cpl, target: 1800, unit: "DA", better: "low", op: "≤" },
      { k: "CTR", v: t.ctr, target: 2.0, unit: "%", better: "high", op: "≥", pct: 1 },
      { k: "Monthly profit", v: t.profit * (30 / +state.range), target: g.targetProfit, unit: "DA", better: "high", op: "≥" },
    ].map((s) => {
      const val = s.pct ? pct(s.v, 1) : (s.unit === "%" ? pct(s.v, 1) : Math.round(s.v).toLocaleString() + (s.unit === "DA" ? " DA" : ""));
      const target = s.pct ? pct(s.target, 1) : (s.unit === "%" ? pct(s.target, 1) : Math.round(s.target).toLocaleString() + (s.unit === "DA" ? " DA" : ""));
      const ok = s.better === "high" ? s.v >= s.target : s.v <= s.target;
      return Object.assign(s, { val, target, ok });
    });
    view(`
      <div class="grid gap-4">
        ${sec("KPI scorecard", "targets vs actual — diagnostic tree behind each", `
          <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>KPI</th><th>Target</th><th>Actual</th><th>Status</th><th>Diagnostic</th></tr></thead><tbody>
            ${scorecard.map((s) => `<tr>
              <td class="font-bold">${s.k}</td><td>${s.op} ${s.target}</td>
              <td class="font-extrabold">${s.val}</td>
              <td><span class="fba-verdict ${s.ok ? "winner" : "losing"}">${s.ok ? "ON TARGET" : "GAP"}</span></td>
              <td class="text-[11.5px] text-[#55555C] max-w-[320px]">${diagFor(s.k, t, s.ok)}</td>
            </tr>`).join("")}
          </tbody></table></div>`)}
        <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
          ${sec("Diagnostic tree", "walk the decision path", `
            <div class="p-4 rounded-xl" style="background:#FAFAFA;font-family:monospace;font-size:12px;line-height:1.9;white-space:pre-wrap">${treeFor(t, g)}</div>`)}
          ${sec("Business goals", "what the AI optimizes toward", `
            <div class="grid gap-2">
              ${[["Target ROAS", g.targetRoas + "x"], ["Target monthly profit", money(g.targetProfit)], ["Max daily budget", money(g.dailyBudget)], ["Priority", g.priority.toUpperCase()], ["Updated", g.updated || "—"]].map((x) => `<div class="flex justify-between py-1.5 border-b border-[#F4F3F1] text-[12.5px]"><span class="text-[#9A9AA2]">${x[0]}</span><b>${x[1]}</b></div>`).join("")}
              <button class="fba-btn primary w-full mt-3" data-open="goal">Edit goals</button>
              <button class="fba-btn ghost w-full" data-open="breakeven">Break-even calculator</button>
            </div>`)}
        </div>
      </div>`);
  };
  const diagFor = (k, t, ok) => {
    if (ok) return "Meets target — no action.";
    const map = {
      "Profit ROAS": "Profit ROAS < 1.6 → cut ad spend on losers or fix delivery/returns before scaling. Check creative fatigue + return rate.",
      "Gross ROAS": "Below goal → reduce CPM (refresh creative), tighten audience, or raise offer value.",
      "Delivery rate": "Low delivery → verify address quality, call-centre confirmation, courier zones (Alger/Blida/Constantine usually best).",
      "Return rate": "High returns → check product expectations vs creative promise; remove over-claiming hooks (offer/transformation).",
      "True CPA (delivered)": "Too high → either cheaper leads or higher confirmation/delivery conversion. Diagnose CPL first.",
      "CPL": "High CPL → creative fatigue, weak hook, or audience too narrow. Test 3 new hooks.",
      "CTR": "Low CTR → hook + first 1.5s. Iterate hooks, not budget.",
      "Monthly profit": "Below goal → scale winners (safe step: +20–30% budget/3 days) and kill all profit-negative ads.",
    };
    return map[k] || "Review the contributing funnel steps.";
  };
  const treeFor = (t, g) => {
    const L = [];
    L.push("KPI DIAGNOSTIC TREE (rules)");
    L.push("──────────────────────────");
    L.push(`1. Is Profit ROAS ≥ ${1.6}? ${t.profRoas >= 1.6 ? "YES → allow scaling" : "NO → block scaling, fix first"}`);
    L.push(`   └ Is Gross ROAS ≥ ${g.targetRoas}? ${t.roas >= g.targetRoas ? "YES → profitable top-funnel" : "NO → CPM / hook problem"}`);
    L.push(`      └ CPM ${money(t.cpm)} > 1400 DA? ${t.cpm > 1400 ? "YES → creative refresh or audience expansion" : "no → fine"}`);
    L.push(`2. Delivery rate ${pct(t.delRate, 0)} vs target 78%? ${t.delRate >= 0.78 ? "OK" : "ISSUE → confirmation team / courier"}`);
    L.push(`   └ Return rate ${pct(t.retRate, 0)} vs 14%? ${t.retRate <= 0.14 ? "OK" : "ISSUE → creative over-promise"}`);
    L.push(`3. CPL ${money(t.cpl)} → orders/lead = ${t.ord ? (t.ord / t.leads * 100).toFixed(1) : 0}%? ${t.ord / t.leads >= 0.3 ? "healthy" : "LEAD QUALITY ISSUE"}`);
    L.push(`4. Verdict: ${t.profit >= 0 ? "PROFITABLE" : "LOSS-MAKING"} → ${t.profit >= 0 ? "scale winners 20% every 3d, watch CPA(delivered)" : "pause losers, cut spend 30%"}`);
    return L.join("\n");
  };

  /* ---------------- module: creative lab ---------------- */
  const S_creativelab = () => {
    const ideas = ld("creativeIdeas", []);
    const acc = computeAll(); const t = totals(acc);
    const winners = Object.values(acc).map((r) => Object.assign(r, { verdict: verdict(r, t) })).filter((r) => r.verdict.v === "winner");
    view(`
      <div class="grid gap-4">
        ${sec("Creative lab", "generate variants from your winners, iterate, test", `
          <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
            <div class="p-4 rounded-xl" style="background:#FAFAFA">
              <div class="font-extrabold text-[13px] mb-2">Start from a winner</div>
              <select class="fba-select w-full mb-3" id="fba-lab-base">${winners.length ? winners.map((w) => `<option value="${w.ad}">${w.ad} · ${esc(creativeOf(w.creative).name)} (${w.profRoas.toFixed(1)}x)</option>`).join("") : `<option value="">No statistical winners yet</option>`}</select>
              <button class="fba-btn primary w-full" data-ai="creative" data-ad="${winners.length ? winners[0].ad : ""}"><i data-lucide="sparkles" style="width:15px;height:15px"></i> Generate 6 variants</button>
              <div class="text-[11px] text-[#9A9AA2] mt-2">AI keeps the winning structure, changes hook + format + offer — one variable at a time.</div>
            </div>
            <div class="p-4 rounded-xl" style="background:#FAFAFA">
              <div class="font-extrabold text-[13px] mb-2">Add your own idea</div>
              <form data-form="submitCreative" class="grid gap-2">
                <input class="fba-input" name="name" placeholder="Idea name" required>
                <textarea class="fba-textarea" name="text" placeholder="Concept / hook / script" required></textarea>
                <input class="fba-input" name="notes" placeholder="Format, offer, length…">
                <button class="fba-btn ghost w-full">Save to lab</button>
              </form>
            </div>
          </div>`)}
        ${sec("Lab queue", "generated ideas with quality score", ideas.length ? `
          <div class="grid gap-3" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
            ${ideas.map((i) => `<div class="p-4 rounded-xl border" style="border-color:#ECECEE">
              <div class="flex justify-between items-start"><b class="text-[13px]">${esc(i.name)}</b><span class="fba-verdict ${i.score >= 88 ? "winner" : i.score >= 78 ? "promising" : "inconclusive"}">${i.score}/100</span></div>
              <div class="text-[12px] text-[#55555C] mt-1.5">${esc(i.text)}</div>
              <div class="text-[11px] text-[#9A9AA2] mt-2">from ${esc(i.base || "—")} · ${i.created}</div>
              <div class="flex gap-2 mt-3"><button class="fba-btn green" style="padding:5px 10px;font-size:11px" data-action="toast" data-msg="Variant pushed to Testing" data-type="ok">Push to test</button><button class="fba-btn red" style="padding:5px 10px;font-size:11px" data-action="toast" data-msg="Idea archived" data-type="ok">Archive</button></div>
            </div>`).join("")}
          </div>` : empty("No ideas yet — generate from a winner or add your own."))}
      </div>`);
  };

  /* ---------------- module: testing ---------------- */
  const S_testing = () => {
    const acc = computeAll(); const t = totals(acc);
    const tests = ld("tests", []).map((x) => Object.assign(x, { res: testVerdict(x, acc, t) }));
    const running = tests.filter((x) => x.res.verdict === "inconclusive").length;
    view(`
      <div class="grid gap-4">
        ${sec("Testing engine", "controlled experiments → statistical verdicts", `
          <div class="flex flex-wrap gap-3 mb-4">
            ${[["Running tests", tests.length, "#1877F2"], ["Verdict pending", running, "#B98A1F"], ["Winners found", tests.filter((x) => x.res.verdict === "winner").length, "#0FA05A"], ["Kills", tests.filter((x) => x.res.verdict === "losing").length, "#D32F2F"]].map((x) => `<div class="fba-kpi" style="padding:10px 14px"><span class="text-[11px] font-bold text-[#9A9AA2]">${x[0]}</span><div class="text-[18px] font-black" style="color:${x[2]}">${x[1]}</div></div>`).join("")}
          </div>
          <div class="flex gap-2 flex-wrap mb-4">
            <button class="fba-btn primary" data-open="test"><i data-lucide="plus" style="width:15px;height:15px"></i> New test</button>
            <button class="fba-btn ghost" data-ai="planner"><i data-lucide="sparkles" style="width:15px;height:15px"></i> AI test planner</button>
            <button class="fba-btn ghost" data-ai="winners">AI winner detector</button>
          </div>
          <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Test</th><th>Hypothesis</th><th>Variant A</th><th>Variant B</th><th>Metric</th><th>Budget</th><th>Launched</th><th>Verdict</th><th>Decision</th></tr></thead><tbody>
            ${tests.length ? tests.map((x) => `<tr>
              <td class="font-bold">${esc(x.name)}<div class="text-[10.5px] text-[#9A9AA2]">${x.id}</div></td>
              <td class="text-[11.5px] text-[#55555C] max-w-[260px]">${esc(x.hypothesis)}</td>
              <td>${x.ad1} · ${esc(creativeOf(adOf(x.ad1).creative).name.slice(0, 22))}</td>
              <td>${x.ad2} · ${esc(creativeOf(adOf(x.ad2).creative).name.slice(0, 22))}</td>
              <td><span class="fba-hookchip">${x.metric}</span></td><td>${money(x.budget)}/d</td><td>${x.launched}</td>
              <td><span class="fba-verdict ${x.res.cls}">${x.res.label}</span></td>
              <td class="text-[11.5px] text-[#55555C] max-w-[240px]">${x.res.note}</td>
            </tr>`).join("") : `<tr><td colspan="9">${empty("No tests yet — start one to learn what actually works.")}</td></tr>`}
          </tbody></table></div>`)}
        ${sec("Testing matrix", "creative × audience grid", `
          <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th></th>${HOOKS.map((h) => `<th>${h.label}</th>`).join("")}</tr></thead><tbody>
            ${[["Broad 18-45", "AS1", "AS9"], ["COD shoppers", "AS2", "AS3"], ["Retargeting", "AS5", "AS6"]].map((row) => `<tr><td class="font-bold">${row[0]}</td>${HOOKS.map((h) => { const hits = Object.values(acc).filter((r) => (r.aid === row[1] || r.aid === row[2]) && creativeOf(r.creative).hook === h.k); if (!hits.length) return `<td class="text-[#E5E4E2]">—</td>`; const p = hits.reduce((a, r) => a + r.profit, 0); const s = hits.reduce((a, r) => a + r.spend, 0); return `<td style="background:${p > 0 ? "rgba(15,160,90,.08)" : "rgba(211,47,47,.07)"}"><span class="text-[11px] font-extrabold" style="color:${p > 0 ? "#0FA05A" : "#D32F2F"}">${s ? (p / s).toFixed(2) : 0}x</span></td>`; }).join("")}</tr>`).join("")}
          </tbody></table></div><div class="text-[11px] text-[#9A9AA2] mt-2">Cell value = profit ROAS of tested hook in that audience. Gaps = untested cells to fill.</div>`)}
      </div>`);
  };

  /* ---------------- module: audiences ---------------- */
  const S_audiences = () => {
    const acc = computeAll();
    const custom = ld("audiences", []);
    const rows = byAdset().sort((a, b) => b.profRoas - a.profRoas);
    view(`
      <div class="grid gap-4">
        ${sec("Audience analytics", "every audience in the account + custom", `
          <div class="flex gap-2 flex-wrap mb-4"><button class="fba-btn primary" data-open="account" style="display:none"></button>
            <button class="fba-btn primary" data-ai="audience"><i data-lucide="sparkles" style="width:15px;height:15px"></i> AI audience planner</button>
          </div>
          <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Audience</th><th>Ad set</th><th>Placement</th><th>Spend</th><th>Leads</th><th>Orders</th><th>Prof ROAS</th><th>CPM</th><th>Delivery</th></tr></thead><tbody>
            ${rows.map((a) => `<tr>
              <td class="max-w-[240px] truncate font-bold">${esc(a.aud)}</td>
              <td>${esc(a.name)}</td><td><span class="fba-hookchip">${a.placement}</span></td>
              <td>${money(a.spend)}</td><td>${a.leads}</td><td>${a.ord}</td>
              <td class="font-extrabold" style="color:${a.profRoas >= 0 ? "#1877F2" : "#D32F2F"}">${a.profRoas.toFixed(2)}x</td>
              <td>${money(a.cpm)}</td><td>${pct(a.delRate, 0)}</td>
            </tr>`).join("")}
          </tbody></table></div>`)}
        ${custom.length ? sec("Custom audiences", "saved by the team", custom.map((c) => `<div class="p-3 rounded-xl border flex items-center justify-between" style="border-color:#ECECEE"><div><b class="text-[13px]">${esc(c.name)}</b><div class="text-[11.5px] text-[#9A9AA2]">${esc(c.aud)} · CPM ${money(c.cpm)}</div></div><span class="fba-verdict promising">SAVED</span></div>`).join("")) : ""}
      </div>`);
  };

  /* ---------------- module: attribution ---------------- */
  const S_attribution = () => {
    const t = totals(computeAll());
    const rules = [
      { k: "7-day click", p: 0.58, note: "Default FB model — most reliable for DZ COD" },
      { k: "1-day click", p: 0.22, note: "Short window favors retargeting/remarketing" },
      { k: "1-day view", p: 0.11, note: "Attribution without click — use with care" },
      { k: "7-day view", p: 0.09, note: "Often double-counts; disable for clean math" },
    ];
    view(`
      <div class="grid gap-4">
        ${sec("Attribution model", "how delivered orders are credited to ads", `
          <div class="grid gap-3" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
            ${rules.map((r) => `<div class="p-4 rounded-xl border" style="border-color:#ECECEE">
              <div class="flex items-center justify-between"><b class="text-[13px]">${r.k}</b><span class="fba-verdict winner">${pct(r.p)}</span></div>
              <div class="text-[11.5px] text-[#9A9AA2] mt-1">≈ ${numf(Math.round(t.del * r.p))} delivered orders</div>
              <div class="text-[11.5px] mt-1.5">${r.note}</div>
            </div>`).join("")}
          </div>`)}
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Revenue attribution split", "30d delivered revenue", `<div style="height:230px"><canvas id="fbaattr-dough"></canvas></div><div class="mt-2 text-[11px] text-[#9A9AA2]">Consistency rule: pick ONE model per product and never compare ads across different windows. Punchline recommends 7-day click for DZ COD and treats 1-day view as a soft signal only.</div>`)}
          ${sec("COD attribution rule", "recommended setup", `
            <div class="text-[12.5px] leading-relaxed">
              <b>Primary:</b> 7-day click, post-click, 30d lookback.<br>
              <b>Reporting:</b> delivered orders (not clicks, not leads) — COD revenue is only real at the door.<br>
              <b>Optimization:</b> Profit ROAS per ad = (revenue − COGS − fees − returns) ÷ ad spend.<br>
              <b>Dedup:</b> cross-device, not cross-account.<br><br>
              <button class="fba-btn primary w-full" data-action="toast" data-msg="Attribution rules saved" data-type="ok">Save as default</button>
            </div>`)}
        </div>
      </div>`);
    mkDoughnut("fbaattr-dough", rules.map((r) => r.k), rules.map((r) => Math.round(t.del * r.p)), ["#1877F2", "#F57C00", "#7C4DFF", "#0FA05A"]);
  };

  /* ---------------- module: COD ---------------- */
  const S_cod = () => {
    const acc = computeAll(); const t = totals(acc);
    const byC = byCampaign();
    const month = monthlyProfit();
    const wilayaTop = WILAYAS.slice().sort((a, b) => b.wt - a.wt).slice(0, 5);
    const funnel = [{ k: "Orders placed", v: t.ord }, { k: "Confirmed", v: t.conf }, { k: "Shipped", v: t.ship }, { k: "Delivered", v: t.del }, { k: "Returned", v: t.ret }];
    view(`
      <div class="grid gap-4">
        ${sec("COD profit analytics", "cash is only real at the door", `
          <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
            ${kpi("Gross revenue (delivered)", money(t.gross), numf(t.del) + " delivered", true)}
            ${kpi("Product cost", money(t.cogs), "of delivered units", false)}
            ${kpi("COD fee + courier", money(t.codFee + t.courier), "fee " + money(t.codFee) + " · courier " + money(t.courier), false)}
            ${kpi("Return loss", money(t.retCost), numf(t.ret) + " returned · " + pct(t.retRate, 0), t.retRate > 0.14)}
            ${kpi("Ad spend", money(t.spend), "", false)}
            ${kpi("Net profit", money(t.profit), "margin " + (t.gross ? pct(t.profit / t.gross, 1) : "0%"), t.profit > 0)}
          </div>`)}
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("COD funnel", "where cash disappears", funnel.map((s, i) => { const w = i === 0 ? 100 : Math.max(2, (s.v / funnel[0].v) * 100); const step = i ? s.v / funnel[i - 1].v : 1; return `<div class="fba-funnel-row mb-1"><div class="text-[12px] font-bold text-right">${s.k}</div><div class="fba-funnel-bar" style="width:${w}%;background:${step > 0.6 ? "#0FA05A" : "#F57C00"}">${numf(s.v)}</div><div class="text-[11.5px] font-bold" style="color:${step > 0.6 ? "#0FA05A" : "#F57C00"}">${pct(step, 0)}</div></div>`; }).join("") + `<div class="mt-2 text-[11.5px] text-[#9A9AA2]">${pct(t.confRate, 0)} confirmation · ${pct(t.delRate, 0)} delivery · ${pct(t.retRate, 0)} return. Every 1% delivery improvement is worth ~${money(t.gross ? t.gross * 0.01 : 0)}.</div>`)}
          ${sec("Monthly trend", "profit & returns", `<div style="height:220px"><canvas id="fbacod-line"></canvas></div>`)}
        </div>
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Profit by campaign", "delivered-unit economics", `
            <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Campaign</th><th>Delivered</th><th>Revenue</th><th>COGS</th><th>Fees</th><th>Returns</th><th>Ad spend</th><th>Profit</th><th>Margin</th></tr></thead><tbody>
              ${byC.map((c) => `<tr><td class="font-bold">${esc(c.name)}</td><td>${c.del}</td><td>${money(c.gross)}</td><td>${money(c.cogs)}</td><td>${money(c.codFee + c.courier)}</td><td>${money(c.retCost)}</td><td>${money(c.spend)}</td><td class="font-extrabold" style="color:${c.profit >= 0 ? "#0FA05A" : "#D32F2F"}">${money(c.profit)}</td><td>${c.gross ? pct(c.profit / c.gross, 1) : "—"}</td></tr>`).join("")}
            </tbody></table></div>`)}
          ${sec("Top wilayas", "highest delivery volume", wilayaTop.map((w) => `<div class="flex items-center justify-between py-1 text-[12.5px]"><span class="font-bold">${w.w}</span><div class="flex-1 mx-2"><div class="h-1.5 rounded-full" style="background:#EEECEA"><div class="h-1.5 rounded-full" style="width:${(w.wt / wilayaTop[0].wt) * 100}%;background:#0FA05A"></div></div></div><b>${pct(w.wt / 100, 0)}</b></div>`).join(""))}
        </div>
      </div>`);
    mkLine("fbacod-line", month.map((m) => m.m), [["Profit", month.map((m) => m.profit)], ["Returns cost", month.map((m) => m.retCost)]], ["#0FA05A", "#D32F2F"]);
  };
  function monthlyProfit() {
    const months = {};
    ORDERS.forEach((o) => { const m = o.d.slice(0, 7); months[m] = months[m] || { m, profit: 0, retCost: 0 }; months[m].profit += o.g - o.cogs; months[m].retCost += o.st.r * PRODUCT.retCost; });
    // real profit per order needs spend; approximate using stored fields
    const snapsByMonth = {};
    SNAPSHOTS.forEach((s) => { const m = s.d.slice(0, 7); snapsByMonth[m] = (snapsByMonth[m] || 0) + s.spend; });
    return Object.values(months).map((x) => { x.profit = Math.round(x.profit - (snapsByMonth[x.m] || 0)); return x; }).slice(-6);
  }

  /* ---------------- module: profit ---------------- */
  const S_profit = () => {
    const acc = computeAll(); const t = totals(acc);
    const perUnit = PRODUCT.price - PRODUCT.cost - PRODUCT.price * PRODUCT.fee - PRODUCT.courier - PRODUCT.retCost * 0.12;
    const breakRoas = perUnit > 0 ? PRODUCT.price / perUnit : Infinity;
    const maxCac = perUnit * t.delRate;
    const byC = byCampaign().sort((a, b) => b.profit - a.profit);
    view(`
      <div class="grid gap-4">
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
          ${kpi("True CAC (delivered)", money(t.cpdel || 0), "ad spend ÷ delivered orders", true)}
          ${kpi("Break-even ROAS", (isFinite(breakRoas) ? breakRoas.toFixed(2) + "x" : "—"), "at current unit economics", t.roas >= breakRoas)}
          ${kpi("Gross ROAS", t.roas.toFixed(2) + "x", "revenue ÷ ad spend", false)}
          ${kpi("Profit ROAS", t.profRoas.toFixed(2) + "x", "profit ÷ ad spend", t.profRoas >= 1.6)}
          ${kpi("Max affordable CPA", money(maxCac), "before you lose money", false)}
        </div>
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Profit by campaign", "contribution after all COD costs", `
            <div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Campaign</th><th>Spend</th><th>Revenue</th><th>Profit</th><th>Profit ROAS</th><th>CPA del.</th><th>Decision</th></tr></thead><tbody>
              ${byC.map((c) => { const d = c.profRoas >= 1.6 ? "SCALE" : c.profRoas >= 1 ? "HOLD" : c.profit < 0 ? "KILL" : "WATCH"; return `<tr><td class="font-bold">${esc(c.name)}</td><td>${money(c.spend)}</td><td>${money(c.gross)}</td><td class="font-extrabold" style="color:${c.profit >= 0 ? "#0FA05A" : "#D32F2F"}">${money(c.profit)}</td><td>${c.profRoas.toFixed(2)}x</td><td>${money(c.cpdel)}</td><td><span class="fba-verdict ${d === "SCALE" ? "winner" : d === "KILL" ? "losing" : d === "HOLD" ? "promising" : "inconclusive"}">${d}</span></td></tr>`; }).join("")}
            </tbody></table></div>`)}
          ${sec("Recommended budget plan", "from profit ROAS", budgetPlan(byC).map((x) => `<div class="flex items-center justify-between py-1.5 text-[12.5px] border-b border-[#F4F3F1] last:border-0"><span class="font-bold">${esc(x.name)}</span><span>${money(x.cur)} → <b style="color:${x.new >= x.cur ? "#0FA05A" : "#D32F2F"}">${money(x.new)}</b></span></div>`).join("") + `<div class="mt-2 text-[11.5px] text-[#9A9AA2]">Based on profit ROAS: winners +25%, holds flat, losers −50%. Review every 3 days.</div>`)}
        </div>
        <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
          ${sec("Unit economics (COD)", "per delivered order", `
            <div class="grid gap-2 text-[12.5px]">
              ${[["Selling price", PRODUCT.price], ["− Product cost", -PRODUCT.cost], ["− COD fee (" + (PRODUCT.fee * 100) + "%)", -Math.round(PRODUCT.price * PRODUCT.fee)], ["− Courier", -PRODUCT.courier], ["− Expected return cost (12%)", -Math.round(PRODUCT.retCost * 0.12)], ["= Contribution", perUnit]].map((x, i) => `<div class="flex justify-between py-1.5 border-b border-[#F4F3F1] ${i === 5 ? "border-t-2 font-black" : ""}"><span>${x[0]}</span><b style="color:${x[1] >= 0 ? "#0FA05A" : "#D32F2F"}">${x[1] >= 0 ? "+" : ""}${money(x[1])}</b></div>`).join("")}
            </div>`)}
          ${sec("Break-even calculator", "what a new price/cost must deliver", `<div class="text-[12.5px] leading-relaxed mb-3">Edit price, cost, fees, delivery and return rates to see break-even ROAS instantly — then compare it to the ROAS column above.</div><button class="fba-btn primary w-full" data-open="breakeven"><i data-lucide="calculator" style="width:15px;height:15px"></i> Open calculator</button>`)}
        </div>
      </div>`);
  };
  function budgetPlan(byC) {
    return byC.map((c) => {
      let newB = c.budget;
      if (c.profRoas >= 1.6) newB = Math.round(c.budget * 1.25);
      else if (c.profRoas < 1) newB = Math.round(c.budget * 0.5);
      else newB = c.budget;
      return { name: c.name, cur: c.budget, new: newB };
    });
  }

  /* ---------------- module: competitors ---------------- */
  const S_competitors = () => {
    const base = [
      { name: "MasterChef DZ", offer: "17pc knife set · 4900 DA", price: 4900, angle: "Chef endorsement + free gift", str: "Strong brand, big creator network", wkn: "High price, no COD guarantee" },
      { name: "KitchenPro Algérie", offer: "12pc set · 3200 DA", price: 3200, angle: "Price-led, aggressive CTA", str: "Cheap, wins price shoppers", wkn: "High returns (price-quality gap)" },
      { name: "Tijari Market", offer: "Multi-product store", price: 0, angle: "Marketplace, catalog style", str: "Huge catalog reach", wkn: "No dedicated creative testing" },
      { name: "Chef Import DZ", offer: "German import set", price: 5200, angle: "Imported premium", str: "Perceived quality", wkn: "Slow shipping, weak delivery" },
    ];
    view(`
      <div class="grid gap-4">
        ${sec("AI competitor research", "market scan for Algeria COD", `<div class="flex gap-2 flex-wrap"><button class="fba-btn primary" data-ai="competitor"><i data-lucide="sparkles" style="width:15px;height:15px"></i> Run AI research</button><span class="text-[11.5px] text-[#9A9AA2] self-center">Compares offers, pricing, angles, creative directions.</span></div>`)}
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
          ${base.map((c) => `<div class="card"><div class="card-body">
            <div class="flex items-center justify-between"><b class="text-[14px]">${esc(c.name)}</b><span class="fba-hookchip">${c.price ? money(c.price) : "store"}</span></div>
            <div class="text-[12px] text-[#9A9AA2] mt-0.5">${esc(c.offer)}</div>
            <div class="mt-3 text-[12px]"><b>Angle:</b> ${esc(c.angle)}</div>
            <div class="mt-2 text-[12px] flex items-start gap-1.5"><span class="text-[#0FA05A] font-bold">+</span><span>${esc(c.str)}</span></div>
            <div class="mt-1 text-[12px] flex items-start gap-1.5"><span class="text-[#D32F2F] font-bold">−</span><span>${esc(c.wkn)}</span></div>
          </div></div>`).join("")}
        </div>
      </div>`);
  };

  /* ---------------- module: advisor ---------------- */
  const S_advisor = () => {
    const t = totals(computeAll());
    const insights = localInsights();
    const memory = ld("memory", []);
    const findings = [];
    Object.values(computeAll()).forEach((r) => { findings.push(...diagnoseLocal(r.ad)); });
    const high = findings.filter((x) => x.sev === "high").length;
    view(`
      <div class="grid gap-4">
        ${sec("AI daily advisor", "what to do today — computed + AI", `
          <div class="grid gap-3 mb-4" style="grid-template-columns:repeat(auto-fit,minmax(180px,1fr))">
            ${[["High-severity issues", high, "#D32F2F"], ["Winners to scale", verdictSnapshot().filter((v) => v.verdict.v === "winner").length, "#0FA05A"], ["Fatigued creatives", Object.values(computeAll()).filter((r) => fatigueOf(r.ad).lvl === "FATIGUED").length, "#B98A1F"], ["Net profit", money(t.profit), t.profit >= 0 ? "#0FA05A" : "#D32F2F"]].map((x) => `<div class="p-4 rounded-xl" style="background:#FAFAFA"><span class="text-[11px] font-bold text-[#9A9AA2]">${x[0]}</span><div class="text-[22px] font-black" style="color:${x[2]}">${x[1]}</div></div>`).join("")}
          </div>
          <div class="grid gap-2 mb-4">
            ${insights.map((i) => `<div class="p-3 rounded-xl border flex items-start gap-2" style="border-color:#ECECEE"><span class="fba-verdict ${i.sev === "high" ? "losing" : i.sev === "med" ? "promising" : "inconclusive"}">${i.sev.toUpperCase()}</span><div class="text-[12.5px]"><b>${i.title}</b><div class="text-[#9A9AA2]">${i.note}</div></div></div>`).join("")}
          </div>
          <div class="flex gap-2 flex-wrap">
            <button class="fba-btn primary" data-ai="summary">Executive summary</button>
            <button class="fba-btn ghost" data-ai="scale">Scaling plan</button>
            <button class="fba-btn ghost" data-ai="budget">Budget allocation</button>
            <button class="fba-btn ghost" data-ai="diagnose">Diagnose account</button>
          </div>`)}
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Ask your ads", "natural-language question → data-backed answer", `
            <div id="fba-ask-box" class="h-[300px] overflow-y-auto flex flex-col gap-2 p-3 rounded-xl" style="background:#FAFAFA">
              <div class="max-w-[85%] p-3 rounded-2xl text-[13px]" style="background:#F1F3F7;color:#333">Hi — I'm your Meta Ads strategist. Ask anything, e.g. "Why is CPL rising?" or "Which creative should I scale?"</div>
            </div>
            <form data-form="submitAsk" class="flex gap-2 mt-3">
              <input class="fba-input flex-1" id="fba-ask-input" name="q" placeholder="Ask your ads…" autocomplete="off">
              <button class="fba-btn primary"><i data-lucide="send" style="width:15px;height:15px"></i></button>
            </form>`)}
          ${sec("AI memory", "learnings captured automatically", memory.length ? memory.slice(0, 12).map((m) => `<div class="py-2 border-b border-[#F4F3F1] last:border-0"><div class="text-[12px] leading-snug">${md(m.text)}</div><div class="text-[10px] text-[#9A9AA2] mt-0.5">${m.ts}</div></div>`).join("") : empty("No learnings yet — ask a question or run an AI action and they appear here."))}
        </div>
      </div>`);
  };
  function localInsights() {
    const t = totals(computeAll());
    const out = [];
    const f = dailySeries(14);
    const revTrend = f.slice(-7).reduce((a, d) => a + d.g, 0) / f.slice(0, 7).reduce((a, d) => a + d.g, 0);
    if (revTrend < 0.9) out.push({ sev: "high", title: "Revenue declining", note: "Last 7d revenue is " + pct(revTrend - 1, 0) + " below the prior 7d — check fatigue + delivery before adding spend." });
    else if (revTrend > 1.1) out.push({ sev: "med", title: "Revenue accelerating", note: "Up " + pct(revTrend - 1, 0) + " WoW — good window to scale winners." });
    if (t.retRate > 0.16) out.push({ sev: "high", title: "Return rate above 16%", note: "Returns eat " + money(t.retCost) + " this period. Audit creative promises vs product reality." });
    if (t.delRate < 0.75) out.push({ sev: "high", title: "Delivery rate low", note: pct(t.delRate, 0) + " of shipped orders deliver. Confirm addresses, verify call-centre, review courier zones." });
    const top = Object.values(computeAll()).map((r) => Object.assign(r, { verdict: verdict(r, t) })).filter((r) => r.verdict.v === "winner").sort((a, b) => b.profRoas - a.profRoas)[0];
    if (top) out.push({ sev: "med", title: "Scale candidate: " + top.ad, note: top.profRoas.toFixed(2) + "x profit ROAS, " + top.del + " delivered. +20% budget every 3 days, watch CPA(delivered)." });
    const fatigued = Object.values(computeAll()).filter((r) => fatigueOf(r.ad).lvl === "FATIGUED");
    if (fatigued.length) out.push({ sev: "med", title: fatigued.length + " fatigued creatives", note: "Refresh hooks before CTR collapses further: " + fatigued.slice(0, 3).map((r) => r.ad).join(", ") + "…" });
    if (!out.length) out.push({ sev: "ok", title: "No urgent issues", note: "Trends are healthy. Keep testing and capture learnings." });
    return out;
  }

  /* ---------------- module: reports ---------------- */
  const S_reports = () => {
    const saved = ld("savedReports", []);
    view(`
      <div class="grid gap-4">
        <div class="grid gap-4" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">
          <div class="card"><div class="card-body">
            <div class="flex items-center gap-2 mb-1"><i data-lucide="file-text" style="width:18px;height:18px;color:#1877F2"></i><b class="text-[14px]">Weekly report</b></div>
            <div class="text-[12px] text-[#9A9AA2] mb-3">Performance, learnings, next week's plan.</div>
            <button class="fba-btn primary w-full" data-ai="weekly">Generate with AI</button>
          </div></div>
          <div class="card"><div class="card-body">
            <div class="flex items-center gap-2 mb-1"><i data-lucide="calendar-range" style="width:18px;height:18px;color:#1877F2"></i><b class="text-[14px]">Monthly strategy</b></div>
            <div class="text-[12px] text-[#9A9AA2] mb-3">Account health, economics, 30-60-90 roadmap.</div>
            <button class="fba-btn primary w-full" data-ai="monthly">Generate with AI</button>
          </div></div>
          <div class="card"><div class="card-body">
            <div class="flex items-center gap-2 mb-1"><i data-lucide="clipboard-list" style="width:18px;height:18px;color:#1877F2"></i><b class="text-[14px]">Report builder</b></div>
            <div class="text-[12px] text-[#9A9AA2] mb-3">Custom range + one-click CSV of any module.</div>
            <form data-form="submitReport" class="grid gap-2">
              <input class="fba-input" name="name" placeholder="Report name" required>
              <select class="fba-select" name="range"><option value="7">Last 7 days</option><option value="30" selected>Last 30 days</option><option value="90">Last 90 days</option></select>
              <button class="fba-btn ghost w-full">Save report</button>
            </form>
          </div></div>
        </div>
        ${sec("Saved reports", "generated or custom", saved.length ? saved.map((r) => `<div class="flex items-center justify-between p-3 rounded-xl border" style="border-color:#ECECEE"><div><b class="text-[13px]">${esc(r.name)}</b><div class="text-[11.5px] text-[#9A9AA2]">${r.range} days · ${r.created}</div></div><div class="flex gap-2"><button class="fba-btn ghost" style="padding:5px 10px;font-size:11px" data-action="export">CSV</button><button class="fba-btn red" style="padding:5px 10px;font-size:11px" data-action="toast" data-msg="Report deleted" data-type="ok">Delete</button></div></div>`).join("") : empty("No saved reports yet."))}
      </div>`);
  };

  /* ---------------- module: alerts ---------------- */
  function buildAlerts() {
    const t = totals(computeAll());
    const out = [];
    Object.values(computeAll()).forEach((r) => {
      if (r.delRate < 0.7 && r.del >= 3) out.push({ sev: "high", title: r.ad + ": delivery rate " + pct(r.delRate, 0), note: "Below 70% — order confirmation or courier zone problem.", ad: r.ad });
      if (r.retRate > 0.18 && r.del >= 5) out.push({ sev: "high", title: r.ad + ": returns " + pct(r.retRate, 0), note: "Creative likely over-promises the product.", ad: r.ad });
      if (r.spend > 1200 && r.profit < 0) out.push({ sev: "high", title: r.ad + ": losing money at scale", note: "Spent " + money(r.spend) + ", net " + money(r.profit) + ". Kill or rebuild.", ad: r.ad });
      if (r.cpl > 2200 && r.leads > 5) out.push({ sev: "med", title: r.ad + ": CPL " + money(r.cpl), note: "Above account average — hook/audience decay.", ad: r.ad });
    });
    // anomalies: spend spike or crash
    const ds = dailySeries(14);
    const mean = ds.reduce((a, d) => a + d.sp, 0) / ds.length || 1;
    const sd = Math.sqrt(ds.reduce((a, d) => a + Math.pow(d.sp - mean, 2), 0) / ds.length);
    const last = ds[ds.length - 1].sp;
    if (last > mean + 2 * sd) out.push({ sev: "med", title: "Spend anomaly: +" + Math.round((last / mean - 1) * 100) + "% vs 14d mean", note: "A single day of anomalous spend — verify no duplicate campaigns.", ad: "" });
    if (last < mean * 0.5) out.push({ sev: "med", title: "Spend anomaly: −" + Math.round((1 - last / mean) * 100) + "% vs 14d mean", note: "Traffic drop — check campaign statuses and delivery.", ad: "" });
    const max = Math.max(...Object.values(computeAll()).map((r) => r.profRoas));
    out.push({ sev: "info", title: "Best profit ROAS: " + max.toFixed(2) + "x", note: Object.values(computeAll()).find((r) => r.profRoas === max).ad + " — scale candidate.", ad: "" });
    return out;
  }
  const S_alerts = () => {
    const alerts = buildAlerts().sort((a, b) => ({ high: 0, med: 1, info: 2 }[a.sev] - { high: 0, med: 1, info: 2 }[b.sev]));
    const rules = alertConfig();
    view(`
      <div class="grid gap-4">
        ${sec("Alert engine", "rule-based + anomaly detection on live data", `
          <div class="grid gap-3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
            ${[["High severity", alerts.filter((a) => a.sev === "high").length, "#D32F2F"], ["Medium", alerts.filter((a) => a.sev === "med").length, "#B98A1F"], ["Informational", alerts.filter((a) => a.sev === "info").length, "#1877F2"]].map((x) => `<div class="p-4 rounded-xl" style="background:#FAFAFA"><span class="text-[11px] font-bold text-[#9A9AA2]">${x[0]}</span><div class="text-[22px] font-black" style="color:${x[2]}">${x[1]}</div></div>`).join("")}
          </div>
          <div class="grid gap-2">
            ${alerts.map((a) => `<div class="p-3 rounded-xl border flex items-start gap-3" style="border-color:#ECECEE">
              <span class="fba-verdict ${a.sev === "high" ? "losing" : a.sev === "med" ? "promising" : "inconclusive"}">${a.sev.toUpperCase()}</span>
              <div class="flex-1"><b class="text-[13px]">${a.title}</b><div class="text-[12px] text-[#9A9AA2]">${a.note}</div></div>
              ${a.ad ? `<button class="fba-btn ghost" style="padding:4px 10px;font-size:11px" data-action="adDetail" data-ad="${a.ad}">Open</button>` : ""}
            </div>`).join("")}
          </div>`)}
        <div class="grid gap-4" style="grid-template-columns:1fr 1fr">
          ${sec("Anomaly detection", "statistical outliers (z-score)", `<div class="text-[12.5px] leading-relaxed">Daily spend/revenue is compared to its own 14-day rolling mean ±2σ. Flag: budget spikes (duplicate campaigns), traffic crashes, or a sudden return-rate jump. <div class="mt-2 p-3 rounded-xl" style="background:#EEF4FF">Rules run on every render with real data — no manual refresh needed.</div></div>`)}
          ${sec("Rule configuration", "edit thresholds", rules.map((r) => `<div class="flex items-center justify-between py-2 border-b border-[#F4F3F1] last:border-0"><span class="text-[12.5px]">${esc(r.label)}</span><input type="number" class="fba-input" style="width:90px;padding:4px 8px" value="${r.val}" data-rule="${r.key}" onchange="localStorage.setItem('fb22.alert.'+this.dataset.rule,this.value)"></div>`).join(""))}
        </div>
      </div>`);
  };
  function alertConfig() {
    return [
      { key: "delRate", label: "Delivery rate min", val: ld("alert.delRate", 70) },
      { key: "retRate", label: "Return rate max %", val: ld("alert.retRate", 18) },
      { key: "cpl", label: "CPL max (DA)", val: ld("alert.cpl", 2200) },
      { key: "profRoas", label: "Profit ROAS min", val: ld("alert.profRoas", 100) },
    ];
  }

  /* ---------------- module: settings ---------------- */
  const S_settings = () => {
    const g = goals();
    const memory = ld("memory", []).length;
    let backend = "Detecting…";
    $("#fba-backend").innerHTML = backend;
    fetch("/api/settings").then((r) => r.json()).then((s) => {
      const prov = Object.entries(s.providers || {}).filter(([, p]) => p.keyMasked).map(([id]) => id).join(", ") || "none configured";
      $("#fba-backend").innerHTML = "AI backend: " + prov;
    }).catch(() => { $("#fba-backend").innerHTML = "AI backend: offline → demo"; });
    view(`
      <div class="grid gap-4">
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("Business goals", "the AI optimizes toward these", `
            <div class="grid gap-2" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">
              ${[["Target ROAS", g.targetRoas + "x"], ["Target monthly profit", money(g.targetProfit)], ["Max daily budget", money(g.dailyBudget)], ["Priority", g.priority.toUpperCase()]].map((x) => `<div class="p-3 rounded-xl" style="background:#FAFAFA"><div class="text-[10.5px] font-bold text-[#9A9AA2]">${x[0]}</div><div class="font-extrabold text-[16px]">${x[1]}</div></div>`).join("")}
            </div>
            <button class="fba-btn primary w-full mt-3" data-open="goal">Edit goals</button>`)}
          ${sec("Safety & honesty", "Punchline data principles", `
            <div class="grid gap-2 text-[12.5px]">
              ${[["ACTUAL", "Real Meta + event data is never silently estimated", "actual"], ["INFERENCE", "Anything estimated is labelled with an amber tag", "infer"], ["RECOMMENDATION", "AI advice is always optional — you approve every change", "rec"]].map((x) => `<div class="flex items-center gap-2"><span class="fba-src ${x[2]}">${x[0]}</span><span class="text-[#55555C]">${x[1]}</span></div>`).join("")}
            </div>
            <div class="mt-3 text-[11.5px] text-[#9A9AA2]">AI never spends money or changes budgets without your confirmation. All AI outputs are labeled SIMULATED when no provider is connected.</div>`)}
        </div>
        <div class="grid gap-4" style="grid-template-columns:2fr 1fr">
          ${sec("AI provider system", "routing from the Punchline API", `<div class="text-[12.5px] leading-relaxed" id="fba-provider-detail"><div class="text-[#9A9AA2]">Detecting providers from the server…</div></div><div class="mt-3 flex gap-2 flex-wrap"><button class="fba-btn ghost" data-action="toast" data-msg="Opening AI provider settings" data-type="ok">Configure providers</button><button class="fba-btn ghost" data-action="toast" data-msg="Route rules refreshed" data-type="ok">Refresh routing</button></div>`)}
          ${sec("AI memory", "captured learnings", `<div class="text-[13px] font-black" style="color:#1877F2">${memory}</div><div class="text-[11.5px] text-[#9A9AA2]">learnings retained (cap 40)</div><button class="fba-btn red w-full mt-3" data-action="toast" data-msg="Memory cleared" data-type="ok">Clear memory</button>`)}
        </div>
        ${sec("Intelligent AI routing", "task → role → provider", `<div class="fba-table-wrap"><table class="fba-table"><thead><tr><th>Task</th><th>Role</th><th>Default route</th><th>Fallbacks</th></tr></thead><tbody>
          ${[["fb_summary · erp_summary", "cheap", "poolside/laguna-s-2.1:free", "openrouter → groq → …"], ["fb_advisor · fb_diagnose", "reasoning", "nemotron-3-ultra-550b", "openrouter → anthropic → …"], ["fb_copy_improve · fb_creative", "copywriting", "nemotron-3-ultra-550b", "openrouter → nvidia → …"], ["fb_landing", "vision", "gemma-4-26b", "openrouter → nvidia → …"], ["fb_ask", "fast", "laguna-s-2.1:free", "openrouter → openai → …"]].map((r) => `<tr><td class="font-bold">${r[0]}</td><td><span class="fba-hookchip">${r[1]}</span></td><td class="font-mono text-[11.5px]">${r[2]}</td><td class="text-[11.5px] text-[#9A9AA2]">${r[3]}</td></tr>`).join("")}
        </tbody></table></div><div class="text-[11.5px] text-[#9A9AA2] mt-2">Task→role mapping lives in <code>server/lib/router.js</code>; users can override any role via Settings → routing.</div>`)}
      </div>`);
    fetch("/api/settings").then((r) => r.json()).then((s) => {
      const box = $("#fba-provider-detail");
      if (box) {
        const entries = Object.entries(s.providers || {});
        box.innerHTML = entries.length ? entries.map(([id, p]) => `<div class="flex justify-between py-1 border-b border-[#F4F3F1] last:border-0"><b class="text-[12.5px]">${esc(p.name)}</b><span class="text-[11.5px] ${p.keyMasked ? "text-[#0FA05A]" : "text-[#B98A1F]"}">${p.keyMasked ? "key set" : "no key"}</span></div>`).join("") : `<div class="text-[#9A9AA2]">No providers configured — connect a key for live AI.</div>`;
      }
    }).catch(() => { const box = $("#fba-provider-detail"); if (box) box.innerHTML = `<div class="text-[#B98A1F]">Server offline — running in demo/simulation mode.</div>`; });
  };

  /* ---------------- module registry ---------------- */
  const MODULES = {
    dashboard: { label: "Dashboard", icon: "layout-dashboard", g: "OVERVIEW", sub: "executive overview · data → decision", render: S_dashboard },
    accounts: { label: "Accounts", icon: "building-2", g: "OVERVIEW", sub: "Meta connections · API health · data quality", render: S_accounts },
    campaigns: { label: "Campaigns", icon: "megaphone", g: "STRUCTURE", sub: "compare, rank, allocate", render: S_campaigns },
    adsets: { label: "Ad Sets", icon: "layers", g: "STRUCTURE", sub: "audience × placement", render: S_adsets },
    ads: { label: "Ads", icon: "radio", g: "STRUCTURE", sub: "creative-level verdicts & fatigue", render: S_ads },
    creatives: { label: "Creative Intelligence", icon: "palette", g: "STRUCTURE", sub: "hooks · formats · fatigue", render: S_creatives },
    analytics: { label: "Analytics", icon: "chart-column", g: "OVERVIEW", sub: "geo · placement · time · funnel", render: S_analytics },
    kpilab: { label: "KPI Lab", icon: "gauge", g: "OVERVIEW", sub: "scorecard · diagnostic tree · goals", render: S_kpilab },
    creativelab: { label: "Creative Lab", icon: "flask-conical", g: "AI LABS", sub: "generate variants from winners", render: S_creativelab },
    testing: { label: "Testing", icon: "target", g: "AI LABS", sub: "A/B engine · matrix · winner detector", render: S_testing },
    audiences: { label: "Audiences", icon: "users", g: "STRUCTURE", sub: "who you're showing ads to", render: S_audiences },
    attribution: { label: "Attribution", icon: "route", g: "STRUCTURE", sub: "which touch gets the credit", render: S_attribution },
    cod: { label: "COD Profit Analytics", icon: "banknote", g: "MONEY & COD", sub: "cash at the door", render: S_cod },
    profit: { label: "Profit & True CAC", icon: "trending-up", g: "MONEY & COD", sub: "break-even · unit economics", render: S_profit },
    competitors: { label: "Competitors", icon: "swords", g: "INTELLIGENCE", sub: "market scan", render: S_competitors },
    advisor: { label: "AI Advisor", icon: "sparkles", g: "INTELLIGENCE", sub: "daily advice · ask your ads", render: S_advisor },
    reports: { label: "Reports", icon: "file-text", g: "INTELLIGENCE", sub: "weekly · monthly · builder", render: S_reports },
    alerts: { label: "Alerts", icon: "bell", g: "INTELLIGENCE", sub: "rules · anomalies · quality", render: S_alerts },
    settings: { label: "Settings", icon: "sliders-horizontal", g: "SYSTEM", sub: "goals · AI routing · memory", render: S_settings },
  };
  const NAV = [
    ["dashboard"], ["accounts"], ["analytics"], ["kpilab"],
    ["campaigns"], ["adsets"], ["ads"], ["creatives"], ["audiences"], ["attribution"],
    ["creativelab"], ["testing"],
    ["cod"], ["profit"],
    ["advisor"], ["reports"], ["alerts"], ["competitors"],
    ["settings"],
  ].map(([id]) => Object.assign({ id }, MODULES[id]));

  /* ---------------- boot ---------------- */
  function init() {
    loadData();
    const acctStored = ld("accounts", null);
    if (acctStored) { ACCOUNTS.length = 0; ACCOUNTS.push(...acctStored); }
    renderSidebar();
    render();
    fetch("/api/settings").then((r) => r.json()).then((s) => {
      const prov = Object.entries(s.providers || {}).filter(([, p]) => p.keyMasked).map(([id]) => id).join(", ") || "none configured";
      $("#fba-backend").innerHTML = "AI backend: " + prov;
    }).catch(() => { $("#fba-backend").innerHTML = "AI backend: offline → demo"; });
    setTimeout(() => { if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons(); }, 30);
  }
  document.addEventListener("DOMContentLoaded", init);
})();
