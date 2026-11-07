/* ============================================================
   PUNCHLINE — COD MARGIN BREAKDOWN (breakdown.html)
   Full 10-section port of the manini "COD الجزائر Pro" tool:
   0 COD Margin · 1 Sensitivity · 2 CRxDR · 3 Funnel · 4 P&L
   5 Campaign budget · 6 Product compare · 7 Working capital
   8 FFF dashboard · 9 Wilayas & seasons. Pure local math.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (s) => document.querySelector(s);
  const el = (id) => document.getElementById(id);
  const n = (id) => { const v = parseFloat((el(id) || {}).value); return isNaN(v) ? 0 : v; };
  const has = (id) => !!el(id);
  const fmt = (v) => Math.round(Number(v) || 0).toLocaleString("en-US").replace(/,/g, " ");
  const fmtN = (v, d) => { const x = Number(v); return isNaN(x) ? "0" : x.toFixed(d == null ? 1 : d); };
  const money = (v) => fmt(v) + " DA";
  const usd = (v) => "$" + fmtN(v, 2);
  const pct = (v, d) => fmtN(Number(v) * 100, d == null ? 1 : d) + "%";
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* lucide icon helper + renderer */
  const ic = (name, size) => `<i data-lucide="${name}" style="width:${size || 14}px;height:${size || 14}px"></i>`;
  function icons() { try { if (window.lucide && lucide.createIcons) lucide.createIcons(); } catch (e) {} }

  function setT(id, t) { const e = el(id); if (e) e.textContent = t; }
  function setH(id, h) { const e = el(id); if (e) e.innerHTML = h; }

  function syncR(inputId, outId, unit) {
    const i = el(inputId), o = el(outId);
    if (i && o) o.textContent = i.value + unit;
  }

  /* toast */
  function toast(msg, type) {
    const stack = el("toast-stack");
    const t = document.createElement("div");
    t.className = "toast show " + (type || "ok");
    t.textContent = msg;
    if (stack) stack.appendChild(t); else document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; }, 2200);
    setTimeout(() => t.remove(), 2600);
  }

  /* charts registry + dark theme defaults */
  const charts = {};
  function makeChart(id, cfg) {
    const c = el(id);
    if (!c || typeof Chart === "undefined") return null;
    if (charts[id]) { try { charts[id].destroy(); } catch (e) {} }
    try { charts[id] = new Chart(c, cfg); } catch (e) { charts[id] = null; }
    return charts[id];
  }
  function darkCharts() {
    if (typeof Chart === "undefined") return;
    Chart.defaults.color = "#8A9AB6";
    Chart.defaults.borderColor = "#1F2B45";
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  }

  /* ---------- shared unit economics from sec 0 ---------- */
  const S = { price: 0, cogs: 0, units: 1, pack: 0, weight: 0, fixed: 0, ship: 0, retCost: 0, CR: .65, DR: .65, comm: 0, rate: 260, baseCpa: 1.2, budget: 300, delivCost: 0, gp: 0, margin: 0, deliveredPerLead: 0, returnedPerLead: 0, becpa: 0, becpaUsd: 0, crPct: 65, drPct: 65 };

  function readUE() {
    S.price = n("p_price") || 3500;
    S.cogs = n("p_cogs");
    S.units = Math.max(1, n("p_units") || 1);
    S.pack = n("p_pack");
    S.weight = n("p_weight") || 500;
    S.fixed = n("p_fixed") || 30000;
    S.ship = n("p_ship");
    S.retCost = n("p_ret_cost");
    S.crPct = has("p_cr") ? n("p_cr") : 65;
    S.drPct = has("p_dr") ? n("p_dr") : 65;
    S.CR = S.crPct / 100; S.DR = S.drPct / 100;
    S.comm = (has("p_comm") ? n("p_comm") : 0) / 100;
    S.rate = n("p_rate") || 260;
    S.baseCpa = n("cpa_base") || 1.2;
    S.budget = n("cpa_budget") || 300;
    const commCost = S.price * S.comm;
    S.delivCost = S.cogs * S.units + S.pack + S.ship + commCost;
    S.gp = S.price - S.delivCost;
    S.margin = S.price > 0 ? S.gp / S.price : 0;
    S.deliveredPerLead = S.CR * S.DR;
    S.returnedPerLead = S.CR * (1 - S.DR);
    S.becpa = S.deliveredPerLead * S.gp - S.returnedPerLead * S.retCost;
    S.becpaUsd = S.rate > 0 ? S.becpa / S.rate : 0;
  }

  /* ---------- TAB 0 : COD MARGIN ---------- */
  function calcMargin() {
    readUE();
    const { price, cogs, units, pack, ship, retCost, rate } = S;
    const commCost = price * S.comm;

    setT("r_total_cost", money(S.delivCost));
    setT("r_gp", money(S.gp));
    setT("r_cost_pct", fmtN(S.delivCost / Math.max(1, price) * 100, 1) + "%");
    setT("r_margin", pct(S.margin));
    setT("r_unit_profit", money(S.gp / units));
    setT("r_be_orders", S.gp > 0 ? fmt(Math.ceil(S.fixed / S.gp)) + " parcels" : "—");
    setT("r_mkt_ratio", fmtN(S.margin / 0.35, 2) + "× of 35% benchmark");
    const viab = clamp(40 * (S.margin / 0.55) + 30 * (S.becpaUsd / 2) + 30 * (S.deliveredPerLead / 0.6), 0, 100);
    setT("r_viability", fmt(Math.round(viab)) + "/100");

    setT("r_be_cpa", money(S.becpa));
    setT("r_be_cpa_usd", usd(S.becpaUsd));
    setT("r_cpa10", money(S.becpa - 0.10 * S.gp * S.deliveredPerLead) + " / " + usd((S.becpa - 0.10 * S.gp * S.deliveredPerLead) / rate));
    setT("r_cpa20", money(S.becpa - 0.20 * S.gp * S.deliveredPerLead) + " / " + usd((S.becpa - 0.20 * S.gp * S.deliveredPerLead) / rate));
    setT("r_cpa30", money(S.becpa - 0.30 * S.gp * S.deliveredPerLead) + " / " + usd((S.becpa - 0.30 * S.gp * S.deliveredPerLead) / rate));

    /* diagnosis */
    let d = `${ic("badge-check", 14)} <b>Excellent margin!</b> The product can carry a high CPA ($${fmtN(S.becpaUsd, 2)} break-even). You can compete hard.`;
    let dc = "";
    if (S.margin < 0.25 || S.becpaUsd < 0.8) { d = `${ic("x-circle", 14)} <b>Thin.</b> Margin ${pct(S.margin)}% and only $${fmtN(S.becpaUsd, 2)} CPA headroom — fix unit economics before scaling ads.`; dc = "danger"; }
    else if (S.margin < 0.45 || S.becpaUsd < 1.3) { d = `${ic("alert-triangle", 14)} <b>Workable.</b> Margin is decent but CPA headroom ($${fmtN(S.becpaUsd, 2)}) limits aggressive bidding — keep CR/DR high.`; dc = "warn"; }
    setH("r_diagnosis", d); const di = el("r_diagnosis"); if (di) di.className = "hl " + dc;
    icons();

    /* 3 scenarios */
    const scen = (mult) => {
      const cpa = S.baseCpa * mult;
      const leads = cpa > 0 ? S.budget / cpa : 0;
      const dv = leads * S.deliveredPerLead, rt = leads * S.returnedPerLead;
      return { cpa, leads, dv, rt, profit: dv * S.gp - rt * retCost - S.budget * rate };
    };
    const sc = [scen(1.5), scen(1.0), scen(0.65)];
    setH("scenarios3Grid", [
      { c: "down", lbl: "Conservative", v: sc[0], sub: "CPA ×1.5" },
      { c: "base", lbl: "Base", v: sc[1], sub: "CPA ×1.0" },
      { c: "up", lbl: "Optimistic", v: sc[2], sub: "CPA ×0.65" },
    ].map((s) => `<div class="s3c ${s.c}"><div class="s3c-lbl">${s.lbl}</div><div class="s3c-v">${s.v.profit >= 0 ? "+" : ""}${fmt(s.v.profit)} DA</div><div class="s3c-sub">CPA ${usd(s.v.cpa)} · ${fmt(s.v.dv)} delivered/wk</div><div class="s3c-sub">${fmt(s.v.leads)} leads · ${fmt(s.v.rt)} returned</div></div>`).join(""));

    /* funnel summary */
    const conf = 100 * S.CR, deliv = conf * S.DR, ret = conf - deliv;
    const rev = deliv * price, costs = deliv * S.delivCost + ret * retCost;
    setH("r_funnel_summary", `
      <div class="fr"><span class="frl">100 leads → confirmed</span><span class="frv">${fmt(conf)} (${fmtN(S.CR * 100, 0)}%)</span></div>
      <div class="fr"><span class="frl">Confirmed → delivered</span><span class="frv">${fmt(deliv)} (${fmtN(S.DR * 100, 0)}%)</span></div>
      <div class="fr"><span class="frl">Returned parcels</span><span class="frv" style="color:#E5484D">${fmt(ret)}</span></div>
      <div class="fr"><span class="frl">Revenue / 100 leads</span><span class="frv">${money(rev)}</span></div>
      <div class="fr"><span class="frl">Costs / 100 leads</span><span class="frv" style="color:#E5484D">${money(costs)}</span></div>
      <div class="fr" style="border-top:2px solid #1F2B45"><span class="frl" style="font-weight:800">Profit / 100 leads (no ads)</span><span class="frv" style="color:#3EE8A6;font-size:14px">${money(rev - costs)}</span></div>`);

    /* gauge */
    const ptr = el("margin_ptr");
    if (ptr) ptr.style.left = clamp(S.margin * 100, 3, 97) + "%";
    const g = el("margin_grade");
    if (g) {
      const gv = S.margin * 100;
      const grade = gv >= 70 ? ["Excellent", "#3EE8A6", "trophy"] : gv >= 55 ? ["Good", "#3EE8A6", "badge-check"] : gv >= 40 ? ["Acceptable", "#F5B83C", "alert-triangle"] : gv >= 25 ? ["Weak", "#F5B83C", "trending-down"] : ["Loss", "#FF5C61", "x-circle"];
      g.innerHTML = `${ic(grade[2], 14)} ${grade[0]} · delivered margin ${fmtN(gv, 1)}%`;
      g.style.color = grade[1];
    }

    /* weight hint */
    const wh = el("p_weight_hint");
    if (wh) {
      if (S.weight <= 800) { wh.innerHTML = `${ic("check-circle", 14)} Ideal weight — normal shipping fees`; wh.className = "fhint ok"; }
      else if (S.weight <= 1500) { wh.innerHTML = `${ic("alert-triangle", 14)} Medium weight — check carrier rates`; wh.className = "fhint warn"; }
      else { wh.innerHTML = `${ic("package", 14)} Heavy parcel — shipping may eat your margin`; wh.className = "fhint warn"; }
    }
    icons();

    /* cost chart */
    const parts = [["Product (COGS)", cogs * units, "#3EE8A6"], ["Packaging", pack, "#5B8DFF"], ["Shipping", ship, "#F5B83C"], ["Commission", commCost, "#FF8A5C"]];
    makeChart("costChart", {
      type: "bar",
      data: { labels: parts.map((p) => p[0]), datasets: [{ label: "DA", data: parts.map((p) => Math.round(p[1])), backgroundColor: parts.map((p) => p[2] + "C9"), hoverBackgroundColor: parts.map((p) => p[2]), borderRadius: 8, barThickness: 18 }] },
      options: { indexAxis: "y", maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: true, text: "Delivered parcel cost — total " + fmt(S.delivCost) + " DA", color: "#E8EDF8", font: { size: 11 } } }, scales: { x: { grid: { color: "#1F2B45" }, ticks: { font: { size: 9 } } }, y: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#8A9AB6" } } } },
    });

    /* delivery compare */
    const CARRIERS = [
      { n: "Yalidine", ship: 175, ret: 220, comm: 0, color: "#3EE8A6" },
      { n: "ZR Express", ship: 150, ret: 180, comm: 5, color: "#5B8DFF" },
      { n: "Procolis", ship: 130, ret: 160, comm: 0, color: "#F5B83C" },
      { n: "Maystro", ship: 145, ret: 190, comm: 0, color: "#A78BFA" },
    ];
    const maxM = Math.max(0.001, ...CARRIERS.map((c) => {
      const dc = cogs * units + pack + c.ship + price * c.comm / 100;
      return (price - dc) / price;
    }));
    setH("deliveryCompare", CARRIERS.map((c) => {
      const dc = cogs * units + pack + c.ship + price * c.comm / 100;
      const m = (price - dc) / price;
      const gps = price - dc;
      const bp = S.CR * S.DR * gps - S.CR * (1 - S.DR) * c.ret;
      return `<div class="bd-cost-row" style="grid-template-columns:90px 1fr 74px">
        <span class="bd-cost-lbl">${c.n}</span>
        <div class="bd-cost-bar" style="width:${Math.max(4, m / maxM * 100)}%;background:${c.color}">${pct(m, 0)}</div>
        <span class="bd-cost-v">BE-CPA ${usd(bp / rate)}</span>
      </div>`;
    }).join(""));

    /* kpi bar */
    setT("kb_margin", pct(S.margin, 0));
    setT("kb_becpa", usd(S.becpaUsd));
    setT("kb_ppl", money(S.becpa));
    setT("kb_crdr", fmtN(S.deliveredPerLead * 100, 0) + "%");
    const st = el("kb_status");
    if (st) {
      st.textContent = viab >= 70 ? "Healthy" : viab >= 45 ? "OK" : "Fix it";
      st.style.color = viab >= 70 ? "#3EE8A6" : viab >= 45 ? "#F5B83C" : "#FF5C61";
    }
    persist();
  }

  /* ---------- TAB 1 : SENSITIVITY ---------- */
  function calcSens() {
    readUE();
    const price = n("t1_price") || S.price;
    const step = Math.max(0.1, n("t1_cpa_step") || 0.4);
    const budgets = [50, 100, 150, 200, 300, 400, 600, 800, 1000];
    const cpas = [];
    for (let c = 0.4; c <= 2.4 + 1e-6; c += step) cpas.push(Math.round(c * 100) / 100);

    const rowHtml = (b) => {
      const cells = cpas.map((c) => {
        const leads = b / c;
        const dv = leads * S.deliveredPerLead, rt = leads * S.returnedPerLead;
        const profit = dv * S.gp - rt * S.retCost - b * S.rate;
        const rev = dv * price;
        const m = rev > 0 ? profit / rev : 0;
        const cls = profit < 0 ? "cell-neg" : m > 0.30 ? "cell-great" : m > 0.15 ? "cell-pos" : "cell-break";
        return `<td class="${cls}" title="CPA ${usd(c)} · budget ${fmt(b)}$">${profit >= 0 ? "+" : ""}${fmt(profit)}</td>`;
      }).join("");
      return `<tr><td class="hdr-col">$${fmt(b)}/wk</td>${cells}</tr>`;
    };
    setH("sensTbl",
      `<thead><tr><th class="hdr-col">Budget \\ CPA</th>${cpas.map((c) => `<th>$${fmtN(c, 1)}</th>`).join("")}</tr></thead>` +
      `<tbody>${budgets.map(rowHtml).join("")}</tbody>`);
  }

  /* ---------- TAB 2 : CR x DR ---------- */
  function calcScenarios() {
    readUE();
    const cr = has("t2_cr") ? n("t2_cr") : 65;
    const dr = has("t2_dr") ? n("t2_dr") : 65;
    const crs = [cr - 5, cr, cr + 5], drs = [dr - 5, dr, dr + 5];
    const cells = [];
    crs.forEach((c, i) => drs.forEach((d, j) => {
      const cv = c / 100, dv2 = d / 100;
      const bp = cv * dv2 * S.gp - cv * (1 - dv2) * S.retCost;
      const good = bp > 0;
      cells.push(`<div class="grid9-cell ${good ? "good" : "bad"}">
        <div class="grid9-lbl">CR ${c}% × DR ${d}%</div>
        <div class="grid9-v">${good ? "+" : ""}${fmt(bp)} DA</div>
        <div class="grid9-sub">BE-CPA ${usd(bp / S.rate)} per lead</div>
      </div>`);
    }));
    setH("grid9", cells.join(""));
  }

  /* ---------- TAB 3 : FUNNEL ---------- */
  function calcFunnel() {
    readUE();
    const leads = Math.max(1, n("f_leads") || 100);
    const cpa = n("f_cpa") || S.baseCpa;
    const fixed = n("f_fixed") || S.fixed;
    const mult = Math.max(1, n("f_units") || 1);
    const conf = leads * S.CR, deliv = conf * S.DR, ret = conf - deliv;
    const rev = deliv * S.price * mult;
    const costs = deliv * (S.cogs * S.units + S.pack + S.ship + S.price * S.comm) + ret * S.retCost;
    const ads = leads * cpa * S.rate;
    const profit = rev - costs - ads - fixed;
    const steps = [
      ["Leads in", leads, fmt(leads), "#5B8DFF"],
      ["Confirmed (" + pct(S.CR, 0) + ")", conf, fmt(conf), "#3EE8A6"],
      ["Delivered (" + pct(S.DR, 0) + ")", deliv, fmt(deliv), "#3EE8A6"],
      ["Returned", ret, fmt(ret), "#FF5C61"],
    ];
    setH("funnel", steps.map(([l, v, f, c]) => `<div class="fstep"><span class="fs-l" style="color:${c}">${l}</span><span class="fs-v" style="color:${c}">${f}</span></div>`).join("") +
      `<div class="fstep" style="background:#121B2E"><span class="fs-l">Revenue (${fmt(mult)}×/parcel)</span><span class="fs-v">${money(rev)}</span></div>` +
      `<div class="fstep"><span class="fs-l">Parcel costs</span><span class="fs-v" style="color:#FF5C61">${money(costs)}</span></div>` +
      `<div class="fstep"><span class="fs-l">Ad spend (${usd(cpa)} CPA)</span><span class="fs-v" style="color:#FF5C61">${money(ads)}</span></div>` +
      `<div class="fstep"><span class="fs-l">Fixed costs</span><span class="fs-v" style="color:#FF5C61">${money(fixed)}</span></div>` +
      `<div class="fstep" style="background:#0E1A2E;border:1px solid #1F2B45"><span class="fs-l">Net profit</span><span class="fs-v" style="color:${profit >= 0 ? "#3EE8A6" : "#FF5C61"}">${profit >= 0 ? "+" : ""}${money(profit)}</span></div>`);
  }

  /* ---------- TAB 4 : P&L ---------- */
  function calcPL() {
    readUE();
    const price = n("pl_price") || S.price;
    const target = n("pl_target") || 1000000;
    const cr = (n("pl_cr") || 65) / 100, dr = (n("pl_dr") || 65) / 100;
    const adsPct = (n("pl_ads") || 20) / 100;
    const delivCost = S.delivCost - S.price * S.comm + price * S.comm;
    const gp = price - delivCost;
    const orders = target / price;
    const deliv = orders * cr * dr, ret = orders * cr * (1 - dr);
    const costs = deliv * delivCost + ret * S.retCost;
    const ads = target * adsPct;
    const net = target - costs - ads - (n("pl_fixed") || S.fixed);
    const maxCpa = (gp * cr * dr - S.retCost * cr * (1 - dr)) / S.rate;

    setT("pl_ads_pct", pct(adsPct, 0));
    setT("pl_net_margin", pct(net / Math.max(1, target)));
    setT("pl_net_profit", money(net));
    setT("pl_max_cpa", usd(maxCpa));
    setT("pl_ab_test", money(ads * 0.05) + " (5%)");
    setT("pl_scale", money(ads * 0.15) + " (15%)");
    setT("pl_max_cpa2", usd(deliv > 0 ? ads / S.rate / deliv : 0) + " / delivery");
    setT("pl_stop_cpa", usd(S.becpaUsd));

    makeChart("plChart", {
      type: "doughnut",
      data: {
        labels: ["Product+packaging", "Shipping & returns", "Ad spend", "Fixed costs", "Net profit"],
        datasets: [{ data: [Math.round(deliv * (S.cogs * S.units + S.pack)), Math.round(deliv * S.ship + ret * S.retCost), Math.round(ads), Math.round(S.fixed), Math.max(0, Math.round(net))], backgroundColor: ["#5B8DFF", "#F5B83C", "#A78BFA", "#3A4E77", "#3EE8A6"], borderColor: "#0B1220", borderWidth: 3 }],
      },
      options: { maintainAspectRatio: false, cutout: "58%", plugins: { legend: { position: "bottom", labels: { font: { size: 9 }, boxWidth: 8, color: "#8A9AB6" } }, title: { display: true, text: "Where target revenue " + fmt(target) + " DA goes", color: "#E8EDF8", font: { size: 11 } } } },
    });
  }

  /* ---------- TAB 5 : CAMPAIGN BUDGET ---------- */
  function calcCampaign() {
    readUE();
    const budget = n("cb_budget") || 3000;
    const dr = (n("cb_dr") || 65) / 100;
    const plats = [
      { k: "fb", name: "Facebook & Instagram", pct: n("cb_fb_pct") || 50, cpa: n("cb_fb_cpa") || 1.2 },
      { k: "tt", name: "TikTok", pct: n("cb_tt_pct") || 25, cpa: n("cb_tt_cpa") || 1.4 },
      { k: "sc", name: "Snapchat", pct: n("cb_sc_pct") || 15, cpa: n("cb_sc_cpa") || 1.1 },
    ];
    const rvPct = n("cb_rv_pct") || 10;
    let totalLeads = 0, used = 0, leadsW = 0, adW = 0;
    plats.forEach((p) => {
      const b = budget * p.pct / 100;
      const leads = p.cpa > 0 ? b / p.cpa : 0;
      const deliv = leads * S.deliveredPerLead;
      const profit = deliv * S.gp - leads * S.returnedPerLead * S.retCost - b * S.rate;
      used += b; totalLeads += leads; leadsW += leads; adW += b * S.rate;
      setT("cb_" + p.k + "_budget", "$" + fmt(b));
      setT("cb_" + p.k + "_leads", fmt(leads));
      setT("cb_" + p.k + "_max", usd(S.becpaUsd));
      setT("cb_" + p.k + "_stop", usd(profit > 0 ? S.becpaUsd : Math.max(0.2, S.becpaUsd * 0.6)));
    });
    const rv = budget * rvPct / 100;
    const left = budget - used - rv;
    setT("cb_rv_budget", "$" + fmt(rv));
    setT("cb_left", "$" + fmt(left));
    setT("cb_total_leads", fmt(totalLeads));
    setT("cb_avg_cpa", usd(leadsW > 0 ? adW / leadsW / S.rate : 0));
  }

  /* ---------- TAB 6 : PRODUCT COMPARE ---------- */
  function calcProdComp() {
    const prods = [];
    for (let i = 0; i < 3; i++) {
      const price = n("pc" + i + "_price") || 0;
      const cost = n("pc" + i + "_cost") || 0;
      const cr = (n("pc" + i + "_cr") || 60) / 100;
      const dr = (n("pc" + i + "_dr") || 65) / 100;
      const weight = n("pc" + i + "_weight") || 500;
      const ship = weight <= 800 ? 160 : weight <= 1500 ? 200 : 260;
      const delivCost = cost + (S.pack || 120) + ship;
      const gp = price - delivCost;
      const margin = price > 0 ? gp / price : 0;
      const becpaUsd = (cr * dr * gp - cr * (1 - dr) * S.retCost) / S.rate;
      const crdr = cr * dr;
      const wScore = clamp((2000 - weight) / 1500, 0, 1);
      const score = clamp(100 * (0.35 * margin / 0.5 + 0.35 * Math.min(1, becpaUsd / 2) + 0.2 * crdr / 0.6 + 0.1 * wScore), 0, 100);
      prods.push({ i, name: (el("pc" + i + "_name") || {}).value || ("Product " + (i + 1)), price, cost, cr, dr, weight, delivCost, gp, margin, becpaUsd, crdr, wScore, score });
    }
    const best = prods.slice().sort((a, b) => b.score - a.score)[0];
    prods.forEach((p) => { const col = el("prod" + p.i); if (col) col.classList.toggle("best", p === best); });

    makeChart("radarChart", {
      type: "radar",
      data: {
        labels: ["Margin", "BE-CPA $", "CR×DR", "Weight"],
        datasets: prods.map((p, k) => ({
          label: p.name, data: [clamp(p.margin / 0.6 * 100, 0, 100), clamp(p.becpaUsd / 3 * 100, 0, 100), clamp(p.crdr / 0.7 * 100, 0, 100), clamp(p.wScore * 100, 0, 100)],
          borderColor: ["#3EE8A6", "#5B8DFF", "#A78BFA"][k], backgroundColor: ["rgba(62,232,166,.16)", "rgba(91,141,255,.16)", "rgba(167,139,250,.16)"][k], pointBackgroundColor: ["#3EE8A6", "#5B8DFF", "#A78BFA"][k], borderWidth: 2,
        })),
      },
      options: { maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { font: { size: 9 }, boxWidth: 8, color: "#8A9AB6" } } }, scales: { r: { min: 0, max: 100, ticks: { display: false }, grid: { color: "#1F2B45" }, angleLines: { color: "#1F2B45" }, pointLabels: { font: { size: 10 }, color: "#8A9AB6" } } } },
    });

    const RANK = ["trophy", "medal", "award"];
    setH("prodBest", prods.map((p, k) => `<div class="fr"><span class="frl">${ic(RANK[k], 13)} ${p.name}</span><span class="frv" style="color:${p === best ? "#3EE8A6" : "#8A9AB6"}">${fmt(Math.round(p.score))}/100 · margin ${pct(p.margin, 0)} · BE-CPA ${usd(p.becpaUsd)}</span></div>`).join("") +
      `<div class="tip ok" style="margin-top:6px"><span class="ti">${ic("trophy", 15)}</span><div><b>Winner: ${best.name}</b> — best blend of margin, CPA headroom and delivery rate.</div></div>`);
    icons();

    makeChart("prodBar", {
      type: "bar",
      data: { labels: prods.map((p) => p.name), datasets: [{ label: "Score", data: prods.map((p) => Math.round(p.score)), backgroundColor: prods.map((p) => (p === best ? "#3EE8A6" : "#3A4E77")), hoverBackgroundColor: prods.map((p) => (p === best ? "#3EE8A6" : "#5B8DFF")), borderRadius: 6, barThickness: 14 }] },
      options: { maintainAspectRatio: false, indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { min: 0, max: 100, grid: { color: "#1F2B45" }, ticks: { font: { size: 9 } } }, y: { grid: { display: false }, ticks: { font: { size: 10 }, color: "#8A9AB6" } } } },
    });
  }

  /* ---------- TAB 7 : WORKING CAPITAL ---------- */
  function calcWC() {
    readUE();
    const orders = Math.max(1, n("wc_orders") || 50);
    const price = n("wc_price") || S.price;
    const cost = n("wc_cost") || S.cogs;
    const pack = n("wc_pack") || S.pack;
    const ship = n("wc_ship") || S.ship;
    const rate = n("wc_rate") || S.rate;
    const unitCost = cost + pack + ship;
    const outflow = orders * unitCost;
    const ads = orders * 1.2 * rate;
    const cashNeed = outflow + ads;
    const capital = cashNeed * 2;
    const recovered = orders * S.CR * S.DR * price;

    setT("wc_outflow", money(outflow));
    setT("wc_cash_need", money(cashNeed) + "/wk");
    setT("wc_capital", money(capital));
    setT("wc_recovered", money(recovered) + "/wk");

    /* timeline 8 weeks */
    const weeks = [];
    for (let w = 0; w < 8; w++) {
      const cash = -capital + (w + 1) * recovered - (w + 1) * outflow;
      weeks.push(cash);
    }
    setH("wcTimeline", weeks.map((c, i) => `
      <div class="cf-event">
        <div class="cf-dot" style="background:${c >= 0 ? "#3EE8A6" : "#FF5C61"}"></div>
        <div class="cf-d">W${i + 1}</div>
        <div class="cf-l" style="color:${c >= 0 ? "#3EE8A6" : "#FF5C61"}">${c >= 0 ? "+" : ""}${fmt(c)}</div>
      </div>${i < weeks.length - 1 ? `<div class="cf-line" style="background:${weeks[i + 1] >= 0 ? "#1F6B4E" : "#5A2A33"}"></div>` : ""}`).join(""));

    /* phases */
    const breakeven = weeks.findIndex((c) => c >= 0);
    setH("wcPhases", `
      <div class="wc-phase"><span class="wc-phase-ico">${ic("mountain", 18)}</span><div><div class="wc-phase-t">Phase 1 — Fund the machine</div><div class="wc-phase-d">Hold ${money(capital)} before launch so ads + product + shipping never starve.</div></div><div class="wc-phase-days">CAP</div></div>
      <div class="wc-phase"><span class="wc-phase-ico">${ic("refresh-cw", 18)}</span><div><div class="wc-phase-t">Phase 2 — Recycle</div><div class="wc-phase-d">Courier settles in 1-2 weeks; recycle ${money(recovered)}/wk back into stock &amp; ads.</div></div><div class="wc-phase-days">W1-W2</div></div>
      <div class="wc-phase"><span class="wc-phase-ico">${ic("trending-up", 18)}</span><div><div class="wc-phase-t">Phase 3 — Self-funding</div><div class="wc-phase-d">Cash turns positive around week ${Math.max(3, breakeven + 1)} — now you can scale without new money.</div></div><div class="wc-phase-days">W${Math.max(3, breakeven + 1)}+</div></div>`);
    icons();
  }

  /* ---------- TAB 8 : FFF ---------- */
  const FFF_CHK = [
    ["credit-card", "Pricing tested with real ads (not gut feeling)"],
    ["package", "Carrier fee negotiated — at least 2 quotes"],
    ["megaphone", "3 creatives ready before launch day"],
    ["layout-template", "Landing page: price + COD logo + guarantee"],
    ["crosshair", "Tracking pixel fires on lead AND delivery events"],
    ["calculator", "Break-even CPA written on a sticky note"],
    ["octagon", "Stop rule defined: kill adset below stop-CPA"],
    ["map", "Budget split by wilaya DR (high-DR first)"],
  ];

  function renderFFF() {
    readUE();
    const budget = n("fff_budget") || 100000;
    const price = n("fff_price") || S.price;
    const adsPct = (n("fff_ads_pct") || 30) / 100;
    const orders = Math.max(1, n("fff_orders") || 50);
    const ads = budget * adsPct;
    const product = orders * S.cogs;
    const buffer = Math.max(0, budget - ads - product);
    const grow = buffer * 0.5;

    const pyramid = [
      ["megaphone", "Marketing & ads", ads, "DZ COD needs paid reach — no demand, no data", "#5B8DFF"],
      ["package", "Product + shipping", product, "Stock for the first " + fmt(orders) + " test orders", "#F5B83C"],
      ["life-buoy", "Cash buffer", buffer, "Returns + delays will hit — never go to zero", "#A78BFA"],
      ["rocket", "Growth reserve", grow, "Winner product? Reinvest fast", "#3EE8A6"],
    ];
    const maxP = Math.max(1, ads, product, buffer);
    setH("fffPyramid", pyramid.map(([icn, t, v, d, c]) => `
      <div class="pyr-row"><span class="pyr-ico" style="background:${c}1F;color:${c}">${ic(icn, 17)}</span>
        <div style="flex:1"><div class="pyr-t">${t} · <span style="color:${c}">${money(v)}</span></div><div class="pyr-d">${d}</div>
        <div class="pyr-bar"><div class="pyr-fill" style="width:${v / maxP * 100}%;background:${c}"></div></div></div>
      </div>`).join(""));
    icons();

    const crs = [58, 65, 72], drs = [58, 65, 72];
    const cells = [];
    crs.forEach((c) => drs.forEach((d) => {
      const cv = c / 100, dv2 = d / 100;
      const profit = orders * cv * dv2 * S.gp - orders * cv * (1 - dv2) * S.retCost;
      cells.push(`<div class="grid9-cell ${profit > 0 ? "good" : "bad"}"><div class="grid9-lbl">CR ${c}% · DR ${d}%</div><div class="grid9-v">${profit > 0 ? "+" : ""}${fmt(profit)}</div><div class="grid9-sub">DA on ${fmt(orders)} orders</div></div>`);
    }));
    setH("fffGrid9", cells.join(""));

    const chk = JSON.parse(localStorage.getItem("bd.fff.chk") || "{}");
    setH("fffChecklist", FFF_CHK.map(([icn, t], i) => {
      const on = !!chk[i];
      return `<label class="chk-item ${on ? "done" : ""}"><input type="checkbox" class="chk-cb" id="fffchk${i}" ${on ? "checked" : ""} onchange="toggleFFF(${i})">${ic(icn, 15)}<span class="${on ? "on" : ""}">${t}</span></label>`;
    }).join(""));
    icons();
  }

  function toggleFFF(i) {
    const chk = JSON.parse(localStorage.getItem("bd.fff.chk") || "{}");
    chk[i] = !!el("fffchk" + i).checked;
    localStorage.setItem("bd.fff.chk", JSON.stringify(chk));
    renderFFF();
    toast(chk[i] ? "Checklist saved ✓" : "Unchecked", chk[i] ? "ok" : "info");
  }

  /* ---------- TAB 9 : WILAYAS & SEASONS ---------- */
  const WILAYAS = [
    ["Algiers", 83], ["Oran", 81], ["Constantine", 79], ["Annaba", 78], ["Setif", 77],
    ["Blida", 76], ["Boumerdes", 76], ["Bejaia", 75], ["Tipaza", 75], ["Tlemcen", 74],
    ["Skikda", 74], ["Tizi Ouzou", 74], ["Sidi Bel Abbes", 74], ["El Tarf", 74], ["Ain Temouchent", 73],
    ["Guelma", 73], ["Batna", 72], ["Chlef", 72], ["Mostaganem", 72], ["Bouira", 72],
    ["Jijel", 72], ["Mila", 71], ["Medea", 71], ["Relizane", 71], ["Tebessa", 71],
    ["Oum El Bouaghi", 71], ["Bordj Bou Arreridj", 71], ["Khenchela", 70], ["Souk Ahras", 70], ["Tiaret", 70],
    ["Ain Defla", 70], ["Mascara", 70], ["Tissemsilt", 66], ["Biskra", 66], ["M'Sila", 66],
    ["Ghardaia", 66], ["Djelfa", 64], ["Laghouat", 64], ["Saida", 65], ["Ouled Djellal", 63],
    ["Ouargla", 62], ["Touggourt", 62], ["El M'Ghair", 61], ["El Oued", 60], ["El Bayadh", 60],
    ["El Meniaa", 60], ["Naama", 58], ["Bechar", 56], ["Adrar", 55], ["Tamanrasset", 55],
    ["Timimoun", 54], ["In Salah", 52], ["Bordj Badji Mokhtar", 50], ["Djanet", 50],
    ["Illizi", 48], ["In Guezzam", 48], ["Tindouf", 48], ["Timimoun S.", 54],
  ];

  const SEASONS = [
    { m: "Jan", d: 78, a: 1.1 }, { m: "Feb", d: 74, a: 1.0 }, { m: "Mar", d: 70, a: 0.95 },
    { m: "Apr", d: 66, a: 0.9 }, { m: "May", d: 60, a: 0.85 }, { m: "Jun", d: 55, a: 0.8 },
    { m: "Jul", d: 50, a: 0.8 }, { m: "Aug", d: 55, a: 0.85 }, { m: "Sep", d: 65, a: 0.95 },
    { m: "Oct", d: 75, a: 1.05 }, { m: "Nov", d: 85, a: 1.2 }, { m: "Dec", d: 90, a: 1.3 },
  ];

  function buildWilayas() {
    readUE();
    const price = n("w_price") || S.price;
    const delivW = S.delivCost * (price / Math.max(1, S.price || price));
    const gpW = price - delivW;
    const card = (nm, dr) => {
      const cls = dr >= 72 ? "high" : dr >= 64 ? "med" : "low";
      const bp = S.CR * (dr / 100) * gpW - S.CR * (1 - dr / 100) * S.retCost;
      return `<div class="wcard ${cls}"><div class="wcard-n">${nm}</div><div class="wcard-dr">${dr}%</div><div class="wcard-cr">BE-CPA ${usd(bp / S.rate)}</div></div>`;
    };
    setH("wilayaGrid", WILAYAS.map(([nm, dr]) => card(nm, dr)).join(""));

    /* best wilayas */
    const best = WILAYAS.slice().sort((a, b) => b[1] - a[1]).slice(0, 6);
    const RANK = ["trophy", "medal", "award", "badge-check", "star", "star"];
    setH("bestWilayas", best.map(([nm, dr], i) => {
      const bp = S.CR * (dr / 100) * gpW - S.CR * (1 - dr / 100) * S.retCost;
      const p100 = bp * 100;
      return `<div class="fr"><span class="frl">${ic(RANK[i], 13)} ${nm} (DR ${dr}%)</span><span class="frv" style="color:#3EE8A6">+${fmt(p100)} DA / 100 orders</span></div>`;
    }).join(""));
    icons();

    /* zone products */
    setH("zoneProducts", `
      <div class="fr"><span class="frl">${ic("compass", 13)} North coast (DR 74-83%)</span><span class="frv">Premium 4000-6000 DA wins</span></div>
      <div class="fr"><span class="frl">${ic("sun", 13)} High plateaus (DR 64-72%)</span><span class="frv">Mid 2500-4000 DA wins</span></div>
      <div class="fr"><span class="frl">${ic("tent", 13)} South (DR 48-60%)</span><span class="frv">Low 1500-2500 DA + cash-upfront</span></div>
      <div class="fr"><span class="frl">${ic("lightbulb", 13)} Rule</span><span class="frv">Spend first where DR is highest</span></div>`);
    icons();

    /* season bars: demand + ad cost line */
    const maxD = Math.max(...SEASONS.map((s) => s.d));
    setH("seasonChart", `<div class="season-bar">${SEASONS.map((s) => `
      <div class="sb-item">
        <div class="sb-val">${s.d}</div>
        <div class="sb-bar" style="height:${s.d / maxD * 60}px;background:${s.d >= 80 ? "#3EE8A6" : s.d >= 65 ? "#5B8DFF" : "#3A4E77"}"></div>
        <div class="sb-bar" style="height:${(s.a - 0.7) / 0.6 * 60}px;background:#FF5C61;opacity:.85"></div>
        <div class="sb-lbl">${s.m}</div>
      </div>`).join("")}</div>
      <div class="season-legend"><span><i style="background:#3EE8A6"></i>Demand index</span><span><i style="background:#FF5C61"></i>Ad cost</span></div>`);

    setH("monthlyTable", SEASONS.map((s) => `<div class="fr"><span class="frl">${s.m}</span><span class="frv">Demand ${s.d} · Ads ×${fmtN(s.a, 2)}</span></div>`).join(""));

    makeChart("seasonDonut", {
      type: "polarArea",
      data: {
        labels: ["Winter", "Spring", "Summer", "Autumn"],
        datasets: [{ data: [78 + 74 + 90, 70 + 66 + 60, 55 + 50 + 55, 65 + 75 + 85], backgroundColor: ["#5B8DFF", "#3EE8A6", "#F5B83C", "#A78BFA"], borderColor: "#0B1220", borderWidth: 3 }],
      },
      options: { maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { font: { size: 9 }, boxWidth: 8, color: "#8A9AB6" } }, title: { display: true, text: "Demand by season", color: "#E8EDF8", font: { size: 11 } } }, scales: { r: { ticks: { display: false }, grid: { color: "#1F2B45" } } } },
    });

    setH("seasonPlaybook", `
      <div class="fr"><span class="frl">${ic("snowflake", 13)} Nov-Dec peak</span><span class="frv">Stock 2× · ads cost +20-30% — raise price bands, expect record DR</span></div>
      <div class="fr"><span class="frl">${ic("sun", 13)} Jul-Aug trough</span><span class="frv">Demand drops — cut scale, A/B test creatives cheap</span></div>
      <div class="fr"><span class="frl">${ic("calendar", 13)} Sep-Oct build</span><span class="frv">Back-to-school + weather flip — launch new winners</span></div>
      <div class="fr"><span class="frl">${ic("moon-star", 13)} Ramadan (varies)</span><span class="frv">Family/food products spike; ads CPMs rise — plan 2 months ahead</span></div>`);
    icons();
  }

  /* ---------- navigation / presets / persistence ---------- */
  function goSec(i) {
    document.querySelectorAll(".sec").forEach((s, k) => s.classList.toggle("active", k === i));
    document.querySelectorAll(".sbtn").forEach((b, k) => b.classList.toggle("active", k === i));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const PRESETS = {
    beauty: { price: 3500, cogs: 450, pack: 120, ship: 160, ret: 200, cr: 65, dr: 65, rate: 260, name: "Beauty serum" },
    clothes: { price: 2800, cogs: 900, pack: 100, ship: 160, ret: 200, cr: 62, dr: 68, rate: 260, name: "Streetwear set" },
    electronics: { price: 6500, cogs: 3200, pack: 150, ship: 220, ret: 250, cr: 60, dr: 62, rate: 260, name: "Phone accessories" },
    health: { price: 3900, cogs: 700, pack: 110, ship: 175, ret: 200, cr: 68, dr: 70, rate: 260, name: "Wellness pack" },
    home: { price: 4500, cogs: 1500, pack: 140, ship: 200, ret: 230, cr: 63, dr: 65, rate: 260, name: "Home gadget" },
    food: { price: 3200, cogs: 1100, pack: 90, ship: 160, ret: 200, cr: 70, dr: 72, rate: 260, name: "Gourmet set" },
  };

  function loadPreset(name) {
    const p = PRESETS[name];
    if (!p) return;
    const set = (id, v) => { const e = el(id); if (e) e.value = v; };
    set("p_name", p.name); set("p_price", p.price); set("p_cogs", p.cogs); set("p_pack", p.pack);
    set("p_ship", p.ship); set("p_ret_cost", p.ret); set("p_cr", p.cr); set("p_crv", p.cr + "%");
    set("p_dr", p.dr); set("p_drv", p.dr + "%"); set("p_rate", p.rate); set("p_ratev", p.rate);
    runAll();
    toast("Preset loaded: " + p.name, "ok");
  }

  function collectState() {
    const ids = ["p_name", "p_price", "p_cogs", "p_units", "p_pack", "p_weight", "p_fixed", "p_ship", "p_ret_cost", "p_cr", "p_dr", "p_comm", "p_rate", "cpa_base", "cpa_budget"];
    const o = {};
    ids.forEach((id) => { const e = el(id); if (e) o[id] = e.value; });
    return o;
  }
  let saveTimer = null;
  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { try { localStorage.setItem("bd.state", JSON.stringify(collectState())); } catch (e) {} }, 350);
  }
  function saveAllData() { try { localStorage.setItem("bd.state", JSON.stringify(collectState())); } catch (e) {} toast("All inputs saved", "ok"); }
  function loadAllData() {
    try {
      const o = JSON.parse(localStorage.getItem("bd.state") || "{}");
      Object.keys(o).forEach((id) => { const e = el(id); if (e) e.value = o[id]; });
      runAll();
      toast("Restored from save", "ok");
    } catch (e) { toast("Nothing saved yet", "warn"); }
  }

  function copyResults() {
    const out = [
      "COD Margin Breakdown — Punchline",
      "=================================",
      "Delivered parcel cost: " + (el("r_total_cost") || {}).textContent,
      "Profit/delivered parcel: " + (el("r_gp") || {}).textContent,
      "Delivered margin: " + (el("r_margin") || {}).textContent,
      "BE-CPA: " + (el("r_be_cpa") || {}).textContent + " / " + (el("r_be_cpa_usd") || {}).textContent,
      "Viability: " + (el("r_viability") || {}).textContent,
      "Diagnosis: " + ((el("r_diagnosis") || {}).textContent || "").replace(/\s+/g, " "),
    ].join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out).then(() => toast("Results copied", "ok")).catch(() => {});
    } else {
      toast("Copy not available", "warn");
    }
  }

  function runAll() {
    if (!has("p_price")) return;
    calcMargin();
    if (has("sensTbl")) calcSens();
    if (has("grid9")) calcScenarios();
    if (has("funnel")) calcFunnel();
    if (has("plChart")) calcPL();
    if (has("cb_fb_pct")) calcCampaign();
    if (has("radarChart")) calcProdComp();
    if (has("wcTimeline")) calcWC();
    if (has("fffPyramid")) renderFFF();
    if (has("wilayaGrid")) buildWilayas();
  }

  /* ---------- init ---------- */
  function init() {
    if (!has("p_price")) return;
    try {
      const o = JSON.parse(localStorage.getItem("bd.state") || "{}");
      Object.keys(o).forEach((id) => { const e = el(id); if (e) e.value = o[id]; });
    } catch (e) {}

    /* carrier spills */
    document.querySelectorAll(".bd-spill").forEach((b) => {      b.addEventListener("click", () => {
        document.querySelectorAll(".bd-spill").forEach((x) => x.classList.remove("sel"));
        b.classList.add("sel");
        const c = b.getAttribute("data-c");
        const C = { yl: [175, 220, 0], zr: [150, 180, 5], pc: [130, 160, 0], ms: [145, 190, 0] }[c];
        if (C) { el("p_ship").value = C[0]; el("p_ret_cost").value = C[1]; el("p_comm").value = C[2]; el("p_commv").textContent = C[2] + "%"; calcMargin(); toast("Carrier set", "ok"); }
      });
    });

    darkCharts();
    runAll();
  }

  window.BD = { calcMargin, calcSens, calcScenarios, calcFunnel, calcPL, calcCampaign, calcProdComp, calcWC, renderFFF, buildWilayas, goSec, copyResults, loadPreset, saveAllData, loadAllData, syncR, runAll };
  window.toggleFFF = toggleFFF;
  window.loadPreset = loadPreset;
  window.saveAllData = saveAllData;
  window.loadAllData = loadAllData;
  window.copyResults = copyResults;
  window.goSec = goSec;
  window.syncR = syncR;
  window.calcMargin = calcMargin;
  window.calcSens = calcSens;
  window.calcScenarios = calcScenarios;
  window.calcFunnel = calcFunnel;
  window.calcPL = calcPL;
  window.calcCampaign = calcCampaign;
  window.calcProdComp = calcProdComp;
  window.calcWC = calcWC;
  window.renderFFF = renderFFF;
  window.buildWilayas = buildWilayas;

  document.addEventListener("DOMContentLoaded", init);
})();
