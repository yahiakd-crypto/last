/* PUNCHLINE — Dashboard logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  const TOOLS = [
    { path: "products.html", icon: "package", label: "Product Intelligence", sub: "Extract verified facts + unknowns" },
    { path: "brand.html", icon: "badge-check", label: "Brand", sub: "Voice, guardrails, tone" },
    { path: "personas.html", icon: "users", label: "Personas", sub: "5 ranked buyer profiles" },
    { path: "strategy.html", icon: "target", label: "Strategy", sub: "USP, offers, competitors" },
    { path: "creative-lab.html", icon: "palette", label: "Creative Lab", sub: "Hooks, matrix, UGC scripts" },
    { path: "campaigns.html", icon: "megaphone", label: "Campaigns", sub: "Structure + diagnostics" },
    { path: "ad-critic.html", icon: "scan-eye", label: "Ad Critic", sub: "Review ads + landing pages" },
    { path: "reports.html", icon: "file-text", label: "Report", sub: "20-section strategy report" },
    { path: "settings.html", icon: "sliders-horizontal", label: "Settings", sub: "AI providers + routing" },
  ];

  function renderHero() {
    $("hero-readiness").textContent = D.scores.readiness.overall + "/100";
    $("hero-mmf").textContent = D.scores.fit.messageMarketFit + "/10";
    $("hero-hook").textContent = "H1 · 9/10";
    $("hero-camps").textContent = D.campaigns.filter((c) => c.status === "active").length;
  }

  function renderKpis() {
    const k = D.kpiSeries;
    const rev = k.revenue[k.revenue.length - 1];
    const spend = k.adSpend[k.adSpend.length - 1];
    const roas = k.roas.filter((x) => x != null);
    const sess = k.sessions[k.sessions.length - 1];
    $("kpi-rev").textContent = PL.money(rev);
    $("kpi-spend").textContent = PL.money(spend);
    $("kpi-roas").textContent = roas.length ? PL.fmt(roas[roas.length - 1] * 100 / 100) + "x" : "—";
    $("kpi-sess").textContent = PL.fmt(sess);
    $("kpi-rev-note").textContent = "6-week demo · " + PL.money(rev - k.revenue[0]) + " growth";
    $("kpi-spend-note").textContent = "validation cap $1,200/wk";
    $("kpi-roas-note").textContent = roas.length ? "trend " + (roas[roas.length - 1] >= 2 ? "on target" : "below target") : "target ≥ 2.0";

    CH.spark("spark-rev", k.revenue);
    CH.spark("spark-spend", k.adSpend);
    CH.spark("spark-roas", k.roas.filter((x) => x != null));
    CH.spark("spark-sess", k.sessions);
  }

  function renderScores() {
    CH.doughnut("dg-mmf", D.scores.fit.messageMarketFit * 10, { color: "#2ECC71" });
    CH.doughnut("dg-opp", D.scores.fit.marketOpportunity * 10, { color: "#2ECC71" });
    CH.doughnut("dg-sig", D.scores.fit.productSignal * 10, { color: "#2ECC71" });
    CH.line("chg-rev", D.kpiSeries.days, [
      { label: "Revenue", data: D.kpiSeries.revenue, color: "#2ECC71" },
      { label: "Target ROAS", data: D.kpiSeries.targetRoas, color: "#C9CCC9", width: 1.5, points: false },
    ], { legend: true, maxTicks: 6 });
  }

  function statusPill(s) {
    if (s === "active") return PL.pill("Active", "green", true);
    if (s === "paused") return PL.pill("Paused", "amber", true);
    return PL.pill("Planned", "gray", true);
  }

  function renderCampaigns() {
    const rows = D.campaigns.map((c) => `
      <tr>
        <td><div class="font-semibold text-[#1C1C1E]">${PL.esc(c.name)}</div><div class="muted text-[12px]">${PL.esc(c.learn)}</div></td>
        <td>${statusPill(c.status)}</td>
        <td class="text-right">${PL.money(c.spent)}</td>
        <td class="text-right">${c.roas ? c.roas.toFixed(2) + "x" : "—"}</td>
      </tr>`).join("");
    $("campaigns-table").innerHTML = `
      <table class="table">
        <thead><tr><th>Campaign</th><th>Status</th><th class="text-right">Spend</th><th class="text-right">ROAS</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
  }

  function renderDiagnostics() {
    const items = D.diagnostics.map((d) => `
      <div class="flex items-start gap-2.5">
        <span class="dot-status ${d.severity === "high" ? "warn" : "on"}" style="margin-top:6px"></span>
        <div><div class="text-[13px] font-semibold text-[#1C1C1E]">${PL.esc(d.issue)}</div>
        <div class="muted text-[12px] mt-0.5">${PL.esc(d.fix)}</div></div>
      </div>`).join("");
    $("diagnostics").innerHTML = items;
  }

  function renderToolbox() {
    $("toolbox").innerHTML = TOOLS.map((t) => `
      <a href="${t.path}" class="rounded-xl p-3.5 hover:shadow-md transition" style="background:#fff;border:1px solid var(--line)">
        <div class="flex items-center gap-2"><span class="icon-tile green-soft" style="width:30px;height:30px;border-radius:9px">${PL.icon(t.icon, 15)}</span>
        <div class="font-bold text-[13px] text-[#1C1C1E]">${t.label}</div></div>
        <div class="muted text-[12px] mt-1.5 leading-snug">${t.sub}</div>
      </a>`).join("");
  }

  function wire() {
    $("btn-open-report").addEventListener("click", () => (window.location.href = "reports.html"));
    $("btn-why-test").addEventListener("click", () => {
      PL.modal({
        title: "Why we test everything",
        body: `
          <div class="flex flex-col gap-3 text-[13.5px] text-[#3F3F46] leading-relaxed">
            <p><b>AI output is a starting hypothesis, not a fact.</b> We never scale budget on an assumption — every direction gets a falsifiable test.</p>
            <div class="rounded-xl p-3.5" style="background:var(--card)">
              <div class="font-bold text-[13px] text-[#1C1C1E] mb-1.5">Every test must answer:</div>
              <div class="muted">1. WHY we test it → the specific hypothesis</div>
              <div class="muted">2. WHAT result proves it works → the pass metric (e.g. CTR ≥ 2.5%)</div>
              <div class="muted">3. WHEN we kill it → pre-committed stop rule</div>
            </div>
            <p><span class="pill amber">UNKNOWN</span>&nbsp; anything we cannot verify is marked and blocked from being used as a claim.</p>
          </div>`,
      });
    });
  }

  PL.on(() => {
    renderHero();
    renderKpis();
    renderScores();
    renderCampaigns();
    renderDiagnostics();
    renderToolbox();
    wire();
  });
})();
