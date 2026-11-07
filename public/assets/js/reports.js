/* PUNCHLINE — Report logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  const BUDGETS = [
    { name: "Conservative", spend: "100% to tests", note: "All budget to hook validation; no scaling until CPA ≤ $30" },
    { name: "Balanced", spend: "70/30 tests vs PDP", note: "Keep 30% on retargeting of existing traffic while testing" },
    { name: "Aggressive", spend: "Scale winner early", note: "Only if ROAS ≥ 2.0 for 14 days — not before" },
  ];

  const PLAN = [
    "Enter real unit economics (COGS/shipping) — everything depends on this",
    "Set up 2 UGC test ad sets: H1 (problem) and H5 (contrast)",
    "Run PDP analysis; fix value clarity + add honest objection section",
    "Launch LAL 1%–3% splits behind the winning hook",
    "Consolidate budgets: 60/30/10 conversions/traffic/awareness",
    "Send 3 UGC scripts to 10 creators (wholesale)",
    "Test Offer B (starter bundle) if oil supply confirmed",
    "Add real reviews/social proof — from real customers only",
    "Set kill rules in the campaigns dashboard and honor them",
    "Review every Friday: which hypotheses passed, which got killed",
  ];

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Report",
      "The complete analysis — from product intelligence to a final, testable decision. Every claim stays separated from UNKNOWN data."
    );
  }

  function renderPriorities() {
    $("priorities").innerHTML = D.priorities.map((p) => `
      <div class="flex items-center gap-3 rounded-xl p-3" style="background:#fff;border:1px solid var(--line)">
        <span class="rank-ring" style="width:30px;height:30px;background:${p.p === 1 ? "var(--green)" : "#E8E8EB"};color:${p.p === 1 ? "#fff" : "#6B6B72"};font-size:13px">${p.p}</span>
        <div class="flex-1 min-w-0">
          <div class="text-[13.5px] font-semibold text-[#1C1C1E] leading-snug">${PL.esc(p.item)}</div>
          <div class="muted text-[12px] mt-0.5">${PL.esc(p.why)}</div>
        </div>
        <div class="text-right flex-none">
          <span class="pill ${p.impact === "High" ? "amber" : "gray"}"><span class="dot"></span>${p.impact}</span>
          <div class="muted text-[11px] mt-1">${p.effort} effort</div>
        </div>
      </div>`).join("");
  }

  function renderBudgets() {
    $("budgets").innerHTML = BUDGETS.map((b) => `
      <div class="rounded-xl p-3.5" style="background:#fff;border:1px solid var(--line)">
        <div class="font-bold text-[13.5px] text-[#1C1C1E]">${b.name}</div>
        <div class="muted text-[12px] mt-0.5">${b.spend}</div>
        <div class="muted text-[12px] mt-1">${b.note}</div>
      </div>`).join("");
  }

  function renderSections() {
    $("report-sections").innerHTML = D.report.map((r) => `
      <div class="rounded-xl overflow-hidden" style="background:#fff;border:1px solid var(--line)">
        <button class="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#FAFAFA] transition" data-toggle="sec-${r.id}">
          <span class="flex items-center gap-2.5">
            <span class="rank-ring" style="width:26px;height:26px;background:#E9FBF1;color:#0FA05A;font-size:11px">${String(r.id).padStart(2, "0")}</span>
            <span class="font-bold text-[13.5px] text-[#1C1C1E]">${PL.esc(r.section)}</span>
          </span>
          <i data-lucide="chevron-down" style="width:15px;height:15px;color:#8A8A92"></i>
        </button>
        <div class="px-4 pb-4 hidden" data-panel-id="sec-${r.id}">
          <div class="text-[13px] text-[#3F3F46] leading-relaxed rounded-xl p-3.5" style="background:var(--card)">${PL.esc(r.body)}</div>
        </div>
      </div>`).join("");

    document.querySelectorAll("[data-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = document.querySelector(`[data-panel-id="${btn.getAttribute("data-toggle")}"]`);
        const chev = btn.querySelector("i");
        if (panel) {
          panel.classList.toggle("hidden");
          if (chev) chev.style.transform = panel.classList.contains("hidden") ? "" : "rotate(180deg)";
        }
      });
    });
  }

  function renderDecision() {
    const final = D.report.find((r) => r.id === 20) || D.report[D.report.length - 1];
    $("final-decision").innerHTML = PL.esc(final.body) + `
      <div class="mt-3"><span class="pill green"><span class="dot"></span>Proceed — with a capped validation sprint</span></div>`;
  }

  function renderPlan() {
    $("action-plan").innerHTML = PLAN.map((a, i) => `
      <div class="flex items-start gap-3">
        <span class="step-dot ${i < 3 ? "done" : ""}" style="flex:none">${i + 1}</span>
        <span class="text-[13px] text-[#3F3F46] leading-snug pt-0.5">${PL.esc(a)}</span>
      </div>`).join("");
  }

  async function regenerate() {
    const res = await PL_API.ai("report", { name: D.product.name });
    PL.toast(res.simulated ? "[Simulated] Report regenerated from demo data" : "Report regenerated", "check-circle");
  }

  PL.on(() => {
    renderHead();
    renderPriorities();
    renderBudgets();
    renderSections();
    renderDecision();
    renderPlan();
    $("btn-report").addEventListener("click", regenerate);
  });
})();
