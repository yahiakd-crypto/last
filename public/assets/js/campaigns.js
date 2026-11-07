/* PUNCHLINE — Campaigns logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  const KILL_RULES = [
    "CPA > $30 for 3 consecutive days on a conversion campaign → pause ad set",
    "CTR < 1.5% after $200 on a hook test → kill the hook, rotate next",
    "ROAS < 1.0 after $400 on any campaign → cut objective or pause",
    "Any ad with > 30% spend share and 0 purchases → pause immediately",
    "Creative fatigue: same creative > 25% decline 3 days running → refresh",
  ];

  const BUDGET = [
    { label: "Testing cap", value: "$1,200 / week", note: "Never exceed while unit economics are UNKNOWN" },
    { label: "Split", value: "60 / 30 / 10", note: "Conversions · Traffic · Awareness" },
    { label: "Scale gate", value: "CPA ≤ $30", note: "14 consecutive days, then +25% every 48h" },
    { label: "Pause trigger", value: "ROAS < 1.0", note: "Reallocate to winning audience" },
  ];

  const ROADMAP = [
    { w: "Week 1", focus: "Creative matrix: H1 + H5", gate: "Find hook with CTR ≥ 2.5%" },
    { w: "Week 2", focus: "PDP CRO + offer A/B", gate: "Add-to-cart ≥ 4%" },
    { w: "Week 3", focus: "LAL 1–3% splits", gate: "CPA ≤ $30 on conversions" },
    { w: "Week 4", focus: "Retargeting + creator launch", gate: "ROAS ≥ 2.0" },
    { w: "Week 5", focus: "Pricing/bundle test", gate: "AOV lift ≥ 10%" },
  ];

  const TIMELINE = [
    { phase: "Weeks 1–2", title: "Creative Validation", tasks: ["Run 3-hook-style UGC matrix (Problem vs Contrast vs How-to)", "Split budgets 60/30/10 across conversions / traffic / awareness", "Kill any ad with 0 purchases at 30% spend share"], goal: "Hook with CTR ≥ 2.5%", status: "now" },
    { phase: "Weeks 3–4", title: "Audience & Offer Testing", tasks: ["LAL 1% / 2% / 3% audience splits on the winning hook", "A/B honest-objection PDP section vs social-proof layout", "Offer A/B: free shipping over $59 vs bundle"], goal: "CPA ≤ $30 · add-to-cart ≥ 4%", status: "next" },
    { phase: "Weeks 5–6", title: "Retargeting & Creators", tasks: ["1-view vs 3-view vs cart retargeting stacks", "Wholesale creator launch with the winning UGC scripts", "Landing page translation if entering a new market"], goal: "ROAS ≥ 2.0 on retargeting", status: "next" },
    { phase: "Weeks 7–8", title: "Pricing & Scale", tasks: ["Price anchor test $59 vs $69 with bundle", "Subscription/refill offer if consumables exist", "Scale winner +25% every 48h while CPA holds"], goal: "AOV lift ≥ 10%", status: "next" },
    { phase: "Weeks 9–12", title: "Full-Funnel Build", tasks: ["Dynamic creative variations from the winning ad", "Consolidate budget toward best ROAS objective", "Refresh creatives before fatigue sets in"], goal: "Creative fatigue < 25% at week 12", status: "next" },
  ];

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Campaigns",
      "A clean campaign architecture, hard kill rules, and a budget that only scales on evidence."
    );
  }

  function avg(k) {
    const vals = D.campaigns.map((c) => Number(c.kpis && c.kpis[k]) || 0).filter((x) => x > 0);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : "—";
  }

  function renderKpis() {
    const tiles = [
      { label: "Avg CTR", value: avg("ctr") + "%", note: "hook pass ≥ 2.5%" },
      { label: "Avg CPM", value: "$" + avg("cpm"), note: "US benchmark $8–14" },
      { label: "Avg CPC", value: "$" + avg("cpc"), note: "watch > $0.70" },
      { label: "Median CPA", value: "$31.40", note: "target ≤ $30" },
      { label: "Best ROAS", value: "1.71x", note: "retargeting" },
    ];
    $("kpi-tiles").innerHTML = tiles.map((t) => `
      <div class="card">
        <div class="card-sub">${t.label}</div>
        <div class="kpi-sm mt-0.5">${t.value}</div>
        <div class="muted mt-1 text-[12px]">${t.note}</div>
      </div>`).join("");
  }

  function statusPill(s) {
    if (s === "active") return PL.pill("Active", "green", true);
    if (s === "paused") return PL.pill("Paused", "amber", true);
    return PL.pill("Planned", "gray", true);
  }

  function renderCampaigns() {
    $("campaign-body").innerHTML = D.campaigns.map((c) => {
      const roas = Number(c.roas) || 0;
      const ctr = c.kpis ? Number(c.kpis.ctr) || 0 : 0;
      const cpc = c.kpis ? Number(c.kpis.cpc) || 0 : 0;
      return `
      <tr>
        <td class="font-semibold text-[#1C1C1E] max-w-[220px]">${PL.esc(c.name)}</td>
        <td class="muted">${PL.esc(c.objective)}</td>
        <td>$${c.budget}</td>
        <td>${PL.money(c.spent)}</td>
        <td>${PL.money(c.revenue)}</td>
        <td class="font-bold ${roas >= 2 ? "text-[#0FA05A]" : "text-[#D98A12]"}">${roas ? roas.toFixed(2) + "x" : "—"}</td>
        <td>${ctr ? ctr.toFixed(1) + "%" : "—"}</td>
        <td>${cpc ? "$" + cpc.toFixed(2) : "—"}</td>
        <td>${statusPill(c.status)}</td>
      </tr>`;
    }).join("");
  }

  function renderDiagnostics() {
    $("diagnostics").innerHTML = (D.diagnostics || []).map((d) => `
      <div class="flex items-start gap-2.5">
        <span class="dot-status ${d.severity === "high" ? "warn" : "on"}" style="margin-top:6px"></span>
        <div><div class="text-[13px] font-semibold text-[#1C1C1E]">${PL.esc(d.issue)}</div>
        <div class="muted text-[12px] mt-0.5">${PL.esc(d.fix)}</div></div>
      </div>`).join("");
  }

  function renderKillRules() {
    $("kill-rules").innerHTML = KILL_RULES.map((r) => `
      <div class="flex items-start gap-2.5">
        <span class="unknown-tag" style="margin-top:2px">KILL IF</span>
        <span class="text-[13px] text-[#3F3F46] leading-snug">${PL.esc(r)}</span>
      </div>`).join("");
  }

  function renderBudget() {
    $("budget").innerHTML = BUDGET.map((b) => `
      <div class="rounded-xl p-3.5" style="background:#fff;border:1px solid var(--line)">
        <div class="flex items-center justify-between">
          <span class="text-[12.5px] font-semibold text-[#6B6B72]">${b.label}</span>
          <span class="font-extrabold text-[14px] text-[#1C1C1E]">${b.value}</span>
        </div>
        <div class="muted text-[12px] mt-1">${b.note}</div>
      </div>`).join("");
  }

  function renderRoadmap() {
    const rows = D.roadmap && D.roadmap.length ? D.roadmap : ROADMAP;
    $("roadmap").innerHTML = rows.map((r, i) => `
      <div class="flex items-start gap-3">
        <div class="step-dot ${i === 0 ? "run" : "done"}" style="flex:none">${i + 1}</div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div class="font-semibold text-[13.5px] text-[#1C1C1E]">${PL.esc(r.w)}</div>
            <span class="pill gray">${PL.esc(r.focus)}</span>
          </div>
          <div class="muted text-[12.5px] mt-1">Gate: ${PL.esc(r.gate)}</div>
        </div>
      </div>`).join("");
  }

  function renderTimeline() {
    const rows = D.timeline && D.timeline.length ? D.timeline : TIMELINE;
    $("timeline").innerHTML = `
      <div class="relative">
        <div class="absolute left-[11px] top-2 bottom-2 w-[2px]" style="background:linear-gradient(180deg,var(--green) 0%,#DFE2DF 100%)"></div>
        <div class="flex flex-col gap-5">
          ${rows.map((t, i) => `
            <div class="relative pl-10">
              <span class="absolute left-0 top-1 w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px] font-extrabold ${t.status === "now" ? "run" : "done"}" style="${t.status === "now" ? "background:var(--green);color:#fff;box-shadow:0 0 0 5px rgba(61,220,114,.18);" : "background:#fff;color:var(--green);border:2px solid var(--green);"}">${i + 1}</span>
              <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="pill green"><span class="dot"></span>${PL.esc(t.phase)}</span>
                    <div class="font-bold text-[14px] text-[#1C1C1E]">${PL.esc(t.title)}</div>
                  </div>
                  <span class="pill gray">Pass: ${PL.esc(t.goal)}</span>
                </div>
                <div class="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                  ${(t.tasks || []).map((tk) => `
                    <div class="flex items-start gap-2">
                      <i data-lucide="check" style="width:13px;height:13px;color:#0FA05A;margin-top:2px;flex:none"></i>
                      <span class="text-[12.5px] text-[#3F3F46] leading-snug">${PL.esc(tk)}</span>
                    </div>`).join("")}
                </div>
              </div>
            </div>`).join("")}
        </div>
      </div>`;
    if (window.lucide) lucide.createIcons();
  }

  function parseCsv() {
    const raw = $("csv-input").value.trim();
    if (!raw) return PL.toast("Paste CSV rows first", "info");
    const rows = raw.split(/\n/).map((l) => l.trim()).filter(Boolean).map((l) => l.split(",").map((c) => c.trim()));
    if (rows.length < 2) return PL.toast("Need a header + at least 1 data row", "info");
    const header = rows[0].map((h) => h.toLowerCase());
    const ci = header.indexOf("campaign"), si = header.indexOf("spend"), ri = header.indexOf("revenue");
    if (ci < 0 || si < 0 || ri < 0) return PL.toast("Header must include campaign, spend, revenue", "info");

    const data = rows.slice(1).map((r) => ({ name: r[ci] || "?", spend: parseFloat(r[si]) || 0, revenue: parseFloat(r[ri]) || 0 }));
    const totalSpend = data.reduce((a, b) => a + b.spend, 0);
    const totalRev = data.reduce((a, b) => a + b.revenue, 0);

    $("csv-results").innerHTML = `
      <table class="table">
        <thead><tr><th>Campaign</th><th class="text-right">Spend</th><th class="text-right">Revenue</th><th class="text-right">ROAS</th></tr></thead>
        <tbody>${data.map((d) => `
          <tr><td class="font-semibold text-[#1C1C1E]">${PL.esc(d.name)}</td>
          <td class="text-right">${PL.money(d.spend)}</td><td class="text-right">${PL.money(d.revenue)}</td>
          <td class="text-right font-bold ${d.revenue / d.spend >= 2 ? "text-[#0FA05A]" : "text-[#D98A12]"}">${d.spend ? (d.revenue / d.spend).toFixed(2) + "x" : "—"}</td></tr>`).join("")}
        </tbody>
        <tfoot><tr><td class="font-bold text-[#1C1C1E]">Total</td>
          <td class="text-right font-bold">${PL.money(totalSpend)}</td><td class="text-right font-bold">${PL.money(totalRev)}</td>
          <td class="text-right font-bold">${totalSpend ? (totalRev / totalSpend).toFixed(2) + "x" : "—"}</td></tr></tfoot>
      </table>`;
    PL.toast(`CSV analyzed — ${data.length} rows`, "check-circle");
  }

  function applySavedProduct() {
    const saved = PL.loadProduct();
    if (!saved || !saved.product || !saved.product.name) return;
    D.product = Object.assign({}, D.product, saved.product);
    D.product.facts = saved.facts && saved.facts.length ? saved.facts : D.product.facts;
    D.product.unknowns = saved.unknowns && saved.unknowns.length ? saved.unknowns : D.product.unknowns;
    const ctx = $("product-ctx");
    if (ctx) {
      ctx.classList.remove("hidden");
      ctx.innerHTML = `Planning campaigns for <b>${PL.esc(D.product.name)}</b>${D.product.price ? " · " + PL.money(D.product.price) : ""}`;
    }
  }

  async function generate() {
    const btn = $("btn-generate");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Building campaigns…`;
    try {
      applySavedProduct();

      const res = await PL_API.ai("campaigns", {
        name: D.product.name,
        facts: D.product.facts,
        unknowns: D.product.unknowns,
        price: D.product.price,
        market: D.product.market,
      }, {
        prompt: `Build a campaign strategy for the product below. Respond with ONLY a single JSON object and NOTHING else — no markdown fences, no text before or after. The JSON must have EXACTLY these four top-level keys (no wrapper object, no other keys):

"campaigns": array of 5 objects {"id":"C1","name":"campaign name","objective":"Awareness or Traffic or Conversions","budget":25,"spent":0,"revenue":0,"roas":0,"cpa":"-","status":"planned or active or paused","learn":"lesson from this campaign","kpis":{"ctr":2.5,"cpm":11,"cpc":0.6,"vtr":30}}
"diagnostics": array of 3 objects {"issue":"problem","severity":"high or medium","fix":"fix"}
"roadmap": array of 5 objects {"w":"Week 1","focus":"weekly focus","gate":"pass metric"}
"timeline": array of 5 objects {"phase":"Weeks 1-2","title":"phase title","tasks":["2-4 concrete tasks"],"goal":"pass metric","status":"now or next"}

Rules: base everything on the provided facts; never invent reviews or sales numbers; keep daily budgets small while unit economics are UNKNOWN.
Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, market: D.product.market, facts: D.product.facts, unknowns: D.product.unknowns })}`,
      });

      if (res.simulated) {
        const reason = res.reason || "[Simulated] Campaigns from demo dataset";
        PL.toast(reason, "flask-conical");
        return;
      }

      const parsed = PL.parseJSON(res.data);
      let merged = false;
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.campaigns) && parsed.campaigns.length) { D.campaigns = parsed.campaigns; merged = true; }
        if (Array.isArray(parsed.diagnostics) && parsed.diagnostics.length) { D.diagnostics = parsed.diagnostics; merged = true; }
        if (Array.isArray(parsed.roadmap) && parsed.roadmap.length) { D.roadmap = parsed.roadmap; merged = true; }
        if (Array.isArray(parsed.timeline) && parsed.timeline.length) { D.timeline = parsed.timeline; merged = true; }
        if (merged) {
          renderKpis();
          renderCampaigns();
          renderDiagnostics();
          renderRoadmap();
          renderTimeline();
          if (window.lucide) lucide.createIcons();
          const next = $("btn-next");
          if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
          PL.toast("Campaign strategy built", "check-circle");
        } else {
          PL.toast("Model returned an unexpected format — showing demo dataset", "info");
        }
      } else {
        PL.toast("No campaign output — using demo dataset", "info");
      }
    } catch (err) {
      console.error(err);
      PL.toast("Build failed — check the server / API key", "info");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 16)} Generate campaigns`;
    }
  }

  PL.on(() => {
    renderHead();
    applySavedProduct();
    renderKpis();
    renderCampaigns();
    renderDiagnostics();
    renderKillRules();
    renderBudget();
    renderRoadmap();
    renderTimeline();
    $("btn-parse-csv").addEventListener("click", parseCsv);
    $("btn-generate").addEventListener("click", generate);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "ad-critic.html"; });
  });
})();
