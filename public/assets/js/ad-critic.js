/* PUNCHLINE — Ad Critic + Landing Page analyzer */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Ad Critic",
      "A ruthless, honest review of your ads and landing pages. If we can't see the source, we say so — never pretend."
    );
  }

  function scorePanel(r, kind) {
    const s = r.score || { overall: 5, hook: 5, clarity: 5, trust: 5, cta: 5 };
    const labels = kind === "lp"
      ? [["overall", "Overall"], ["value", "Value clarity"], ["clarity", "Message clarity"], ["trust", "Trust signals"], ["friction", "Friction level"]]
      : [["overall", "Overall"], ["hook", "Hook"], ["clarity", "Clarity"], ["trust", "Trust/claims"], ["cta", "CTA strength"]];
    return `
      <div class="flex items-center justify-between mb-1">
        <div class="font-extrabold text-[16px] text-[#1C1C1E]">${kind === "lp" ? "Landing page verdict" : "Ad verdict"}</div>
        <span class="pill ${(s.overall || 5) >= 7 ? "green" : (s.overall || 5) >= 5 ? "amber" : "red"}"><span class="dot"></span>${PL.esc(r.verdict || "Review")}</span>
      </div>
      <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
        ${labels.map(([k, l]) => PL.scoreRow(l, s[k] != null ? s[k] : 5)).join("")}
      </div>`;
  }

  function listCard(title, items, tone) {
    return `
      <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
        <div class="label" style="color:${tone === "good" ? "#0FA05A" : "#D98A12"}">${title}</div>
        <div class="flex flex-col gap-2.5 mt-1">${items.map((x) => `
          <div class="flex items-start gap-2.5"><span class="dot-status ${tone === "good" ? "on" : "warn"}" style="margin-top:6px"></span>
          <span class="text-[13px] text-[#3F3F46] leading-snug">${PL.esc(x)}</span></div>`).join("")}
        </div>
      </div>`;
  }

  async function criticize() {
    const copy = $("ad-text").value.trim();
    if (!copy) return PL.toast("Paste ad copy or a transcript first", "info");
    const res = await PL_API.ai("analyze_ad", { copy, name: window.DATA.product.name });
    const r = res.data || {};
    $("ad-result").innerHTML = `
      ${scorePanel(r, "ad")}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        ${listCard("Strengths", (r.strengths || ["Needs the actual ad file to confirm"]), "good")}
        ${listCard("Risks", (r.risks || ["Cannot verify claims without source material"]), "bad")}
      </div>
      <div class="muted mt-3 text-[12px]">${res.simulated ? "Local simulation — connect a provider for a real critique." : "Live analysis via " + (res.meta ? res.meta.provider : "") + "."}</div>`;
    PL.toast(res.simulated ? "[Simulated] Ad critique" : "Critique complete", "check-circle");
  }

  async function analyzeLp() {
    const url = $("lp-url").value.trim();
    if (!url) return PL.toast("Enter a landing page URL", "info");
    const res = await PL_API.ai("analyze_landing", { url });
    const r = res.data || {};
    $("lp-result").innerHTML = `
      ${scorePanel(r, "lp")}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        ${listCard("Layout checkpoints", (r.layout || ["Provide a URL or screenshot"]), "good")}
        ${listCard("Issues", (r.issues || ["—"]), "bad")}
      </div>
      <div class="muted mt-3 text-[12px]">${res.simulated ? "Local simulation — connect a vision/URL-capable provider for a real analysis." : "Live analysis via " + (res.meta ? res.meta.provider : "") + "."}</div>`;
    PL.toast(res.simulated ? "[Simulated] Landing page analysis" : "Analysis complete", "check-circle");
  }

  PL.on(() => {
    renderHead();
    $("btn-criticize").addEventListener("click", criticize);
    $("btn-lp").addEventListener("click", analyzeLp);
    $("ad-file").addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) PL.toast("File selected — will be analyzed by a vision provider", "file-up");
    });
  });
})();
