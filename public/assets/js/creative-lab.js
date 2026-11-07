/* PUNCHLINE — Creative Lab logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Creative Lab",
      "Hooks, a test matrix, and UGC scripts — each scored against personas and each carrying a falsifiable test plan."
    );
  }

  function renderAxes() {
    $("axes").innerHTML = D.matrix.axes.map((a) => `
      <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
        <div class="label">${PL.esc(a.axis || "Axis")}</div>
        <div class="flex flex-wrap gap-1.5 mt-1.5">${(a.options || []).map((o) => PL.tag(o)).join("")}</div>
      </div>`).join("");
  }

  function renderMatrix() {
    $("matrix-body").innerHTML = D.matrix.cells.map((c) => `
      <tr>
        <td class="font-semibold text-[#1C1C1E]">${PL.esc(c.a || "—")}</td>
        <td class="muted">${PL.esc(c.b || "—")}</td>
        <td class="muted">${PL.esc(c.c || "—")}</td>
        <td class="muted">${PL.esc(c.notes || "—")}</td>
      </tr>`).join("");
  }

  function hookColor(score) {
    return score >= 8 ? "#2ECC71" : score >= 6 ? "#F5A623" : "#C9CCC9";
  }

  function renderHooks() {
    const sorted = [...D.hooks].sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    $("hooks").innerHTML = sorted.map((h) => `
      <div class="rounded-xl p-3.5" style="background:#fff;border:1px solid var(--line)">
        <div class="flex items-start justify-between gap-3">
          <div class="text-[13.5px] font-medium text-[#1C1C1E] leading-snug">${PL.esc(h.hook || "Hook")}</div>
          <div class="text-[16px] font-extrabold flex-none" style="color:${hookColor(Number(h.score) || 0)}">${h.score != null ? h.score : "–"}</div>
        </div>
        <div class="flex items-center gap-2 mt-2 flex-wrap">
          <span class="pill gray">${PL.esc(h.style || "—")}</span>
          <span class="pill ${String(h.verdict || "").indexOf("TEST FIRST") === 0 ? "green" : String(h.verdict || "").indexOf("TEST") === 0 ? "amber" : "gray"}"><span class="dot"></span>${PL.esc(h.verdict || "TEST")}</span>
        </div>
        <div class="muted text-[12px] mt-2">${PL.esc(h.why || "")}</div>
      </div>`).join("");
  }

  function renderScripts() {
    $("scripts").innerHTML = D.ugcScripts.map((s) => `
      <div class="rounded-xl overflow-hidden" style="background:#fff;border:1px solid var(--line)">
        <button class="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-[#FAFAFA] transition" data-toggle="${s.id}">
          <span class="flex items-center gap-2.5">
            <span class="icon-tile green-soft" style="width:30px;height:30px;border-radius:9px">${PL.icon("clapperboard", 15)}</span>
            <span class="font-bold text-[13.5px] text-[#1C1C1E]">${PL.esc(s.name || "Script")}</span>
          </span>
          <span class="flex items-center gap-2">
            <span class="pill gray">${s.seconds != null ? s.seconds + "s" : "—"}</span>
            <span class="tag">${PL.esc(s.hook || "")}</span>
            <i data-lucide="chevron-down" style="width:15px;height:15px;color:#8A8A92"></i>
          </span>
        </button>
        <div class="px-4 pb-4 hidden" data-panel-id="${s.id}">
          <div class="rounded-xl p-3" style="background:var(--card)">
            ${(s.structure || []).map((line, i) => `<div class="flex items-start gap-2.5 py-1">
              <span class="step-dot done" style="width:22px;height:22px;font-size:10px">${i + 1}</span>
              <span class="text-[12.5px] text-[#3F3F46] leading-snug pt-0.5">${PL.esc(line)}</span>
            </div>`).join("")}
            <div class="mt-2 pt-2 border-t border-[#ECECEE]"><span class="label" style="margin:0">CTA</span> <span class="muted text-[12.5px]">${PL.esc(s.cta || "")}</span></div>
          </div>
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

  function renderPlan() {
    $("plan-body").innerHTML = D.testPlan.map((p) => `
      <tr>
        <td class="font-bold text-[#1C1C1E]">${PL.esc(p.w || "—")}</td>
        <td class="muted">${PL.esc(p.tests || "—")}</td>
        <td><span class="pill green"><span class="dot"></span>${PL.esc(p.goal || "—")}</span></td>
        <td class="muted">${PL.esc(p.decision || "—")}</td>
      </tr>`).join("");
  }

  function applySavedProduct() {
    const saved = PL.loadProduct();
    if (!saved || !saved.product || !saved.product.name) return;
    D.product = Object.assign({}, D.product, saved.product);
    D.product.facts = saved.facts && saved.facts.length ? saved.facts : D.product.facts;
    D.product.unknowns = saved.unknowns && saved.unknowns.length ? saved.unknowns : D.product.unknowns;
  }

  async function buildMatrix() {
    const btn = $("btn-matrix");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Building…`;
    try {
      applySavedProduct();

      const res = await PL_API.ai("creative_matrix", {
        name: D.product.name,
        facts: D.product.facts,
        unknowns: D.product.unknowns,
        price: D.product.price,
        market: D.product.market,
      }, {
        prompt: `Build a creative test matrix for this product. Return ONLY valid JSON, no prose, with this exact structure:
{"axes":[{"axis":"axis name","options":["4-6 variants"]}],"cells":[{"a":"hook style","b":"proof type","c":"format","notes":"why this combo"}],"hooks":[{"id":"h1","hook":"full hook line","score":7,"style":"curiosity/benefit/…","verdict":"TEST FIRST / TEST","why":"reason tied to personas"}],"ugcScripts":[{"id":"s1","name":"script name","seconds":30,"hook":"hook line","structure":["3-5 beat lines"],"cta":"call to action"}],"testPlan":[{"w":"W1-2","tests":"what we test","goal":"pass metric","decision":"decision on win"}]}

Rules:
- 3 axes × 3-4 cells, 10 hooks scored 1-10, 5 UGC scripts, 6-week test plan rows.
- Base everything on the provided facts and UNKNOWNs. Never invent reviews or sales numbers.
Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, market: D.product.market, facts: D.product.facts, unknowns: D.product.unknowns })}`,
      });

      if (res.simulated) {
        const reason = res.reason || "[Simulated] Matrix from demo dataset";
        PL.toast(reason, "flask-conical");
        return;
      }

      const parsed = PL.parseJSON(res.data);
      if (parsed && typeof parsed === "object") {
        if (Array.isArray(parsed.axes) && parsed.axes.length) D.matrix.axes = parsed.axes;
        if (Array.isArray(parsed.cells) && parsed.cells.length) D.matrix.cells = parsed.cells;
        if (Array.isArray(parsed.hooks) && parsed.hooks.length) D.hooks = parsed.hooks;
        if (Array.isArray(parsed.ugcScripts) && parsed.ugcScripts.length) D.ugcScripts = parsed.ugcScripts;
        if (Array.isArray(parsed.testPlan) && parsed.testPlan.length) D.testPlan = parsed.testPlan;
        renderAxes();
        renderMatrix();
        renderHooks();
        renderScripts();
        renderPlan();
        if (window.lucide) lucide.createIcons();
        const next = $("btn-next");
        if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
        PL.toast("Creative matrix built", "check-circle");
      } else {
        PL.toast("No matrix output — using demo dataset", "info");
      }
    } catch (err) {
      console.error(err);
      PL.toast("Build failed — check the server / API key", "info");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 16)} Build matrix`;
    }
  }

  PL.on(() => {
    renderHead();
    applySavedProduct();
    renderAxes();
    renderMatrix();
    renderHooks();
    renderScripts();
    renderPlan();
    $("btn-matrix").addEventListener("click", buildMatrix);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "campaigns.html"; });
  });
})();
