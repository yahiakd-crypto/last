/* PUNCHLINE — FB Ads Strategy logic (ready-to-build Meta Ads blueprint tree) */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  const LOOP = [
    { step: "Hypothesis", detail: "One variable per test — hook, audience, or offer" },
    { step: "Build", detail: "2–3 cells max per axis, keep everything else constant" },
    { step: "Launch", detail: "Enough budget to reach statistical significance" },
    { step: "Measure", detail: "Read the gate metric, not the vanity metrics" },
    { step: "Decide", detail: "Winner scales · loser killed · tie → new hypothesis" },
  ];

  const ENTITY_COLORS = {
    account: "#1C1C1E",
    campaign: "#0E7A43",
    adset: "#3DDC72",
    ad: "#2ECC71",
    creative: "#9AA49D",
    metric: "#D98A12",
  };

  const REASON_DEFAULTS = [
    "Broad audience gives Meta more room to find buyers",
    "UGC tests a strong problem/solution angle",
    "Product demo explains the unique mechanism quickly",
    "Distinct angles per ad reduce creative fatigue",
    "Ad Sets isolate audience variables during testing",
  ];

  /* ---------- helpers ---------- */

  function statusPill(st) {
    const s = String(st || "").toUpperCase();
    if (s.indexOf("PAUSE") >= 0) return `<span class="pill red"><span class="dot"></span>${PL.esc(s)}</span>`;
    if (s.indexOf("WINNER") >= 0 || s.indexOf("SCALE") >= 0 || s.indexOf("READY") >= 0) return `<span class="pill green"><span class="dot"></span>${PL.esc(s)}</span>`;
    if (s.indexOf("TESTING") >= 0) return `<span class="pill amber"><span class="dot"></span>${PL.esc(s)}</span>`;
    if (s.indexOf("AI") >= 0 || s.indexOf("RECOMMENDED") >= 0) return `<span class="pill green"><span class="dot"></span>${PL.esc(s)}</span>`;
    return `<span class="pill gray">${PL.esc(s || "—")}</span>`;
  }

  function kv(label, value, opts) {
    opts = opts || {};
    const v = value === undefined || value === null || value === "" ? "—" : value;
    return `<div class="fb-kv"><div class="k">${PL.esc(label)}</div><div class="v ${opts.small ? "small" : ""}">${v}</div></div>`;
  }

  function chips(list) {
    if (!Array.isArray(list) || !list.length) return `<span class="muted text-[11px]">Broad / none recommended</span>`;
    return list.map((i) => `<span class="fb-chip">${PL.esc(i)}</span>`).join("");
  }

  function copyText(text) {
    if (!text) return PL.toast("Nothing to copy yet", "info");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => PL.toast("Copied to clipboard", "copy-check")).catch(() => PL.toast("Copy blocked by browser", "info"));
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        PL.toast("Copied to clipboard", "copy-check");
      }
    } catch (e) {
      PL.toast("Clipboard not available", "info");
    }
  }

  /* ---------- page shell ---------- */

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Facebook Ads Strategy",
      "A ready-to-build Meta Ads blueprint — campaign, ad sets and ads generated from the product analysis, with testing rules and copy-paste build steps."
    );
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
      ctx.innerHTML = `FB blueprint for <b>${PL.esc(D.product.name)}</b>${D.product.price ? " · " + PL.money(D.product.price) : ""}`;
    }
  }

  /* ---------- text builders for copy actions ---------- */

  function campaignSettingsText(c) {
    return [
      "CAMPAIGN",
      "Name: " + (c.name || ""),
      "Objective: " + (c.objective || ""),
      "Buying Type: " + (c.buying_type || ""),
      "Budget Strategy: " + (c.budget_strategy || ""),
      "Recommended Budget: " + (c.budget || ""),
      "Optimization: " + (c.optimization || ""),
      "Testing Strategy: " + (c.testing_strategy || ""),
    ].filter(Boolean).join("\n");
  }

  function adSetSettingsText(s) {
    return [
      "AD SET: " + (s.name || ""),
      "Audience: " + (s.audience || ""),
      "Location: " + (s.location || ""),
      "Age: " + (s.age || ""),
      "Gender: " + (s.gender || ""),
      "Interests: " + ((s.interests && s.interests.length) ? s.interests.join(", ") : "Broad"),
      "Placements: " + (s.placements || ""),
      "Budget: " + (s.budget || ""),
      "Optimization: " + (s.optimization || ""),
      "Creative Angle: " + (s.creative_angle || ""),
      "Testing Purpose: " + (s.testing_purpose || ""),
    ].filter(Boolean).join("\n");
  }

  function adCopyText(a) {
    return [
      "AD: " + (a.name || ""),
      "Format: " + (a.format || ""),
      "Creative Type: " + (a.creative_type || ""),
      "Angle: " + (a.angle || ""),
      "Hook: " + (a.hook || ""),
      "Primary Text: " + (a.primary_text || ""),
      "Headline: " + (a.headline || ""),
      "CTA: " + (a.cta || ""),
      "Creative Instructions:",
      ...(Array.isArray(a.creative_instructions) ? a.creative_instructions.map((i) => "- " + i) : []),
    ].filter(Boolean).join("\n");
  }

  function campaignStructureText() {
    const p = D.fbPlan || {};
    const c = p.campaign || {};
    let t = "CAMPAIGN\n" + (c.name || "") + "\nObjective: " + (c.objective || "") + " | Buying: " + (c.buying_type || "") + " | Budget: " + (c.budget || "");
    (p.ad_sets || []).forEach((s, i) => {
      t += "\n\nAD SET " + (i + 1) + ": " + (s.name || "");
      t += "\n  " + [s.audience, s.location, s.age, s.gender].filter(Boolean).join(" · ") + " | Budget: " + (s.budget || "");
      (s.ads || []).forEach((a, j) => {
        t += "\n  AD " + (j + 1) + ": " + (a.name || "") + " [" + (a.format || "") + "] " + (a.angle || "");
      });
    });
    return t;
  }

  /* ---------- blueprint tree ---------- */

  function renderAd(ad, si, ai) {
    return `
    <div class="fb-card fb-ad ${ai === 0 ? "" : ""}" data-ad="${si}-${ai}">
      <div class="fb-head fb-toggle" data-toggle="ad-${si}-${ai}">
        <span class="icon-tile green-soft" style="width:30px;height:30px;border-radius:9px">${PL.icon("image", 15)}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[11px] font-black text-[#9AA49D] tracking-wide">AD ${ai + 1}</span>
            <span class="text-[13px] font-bold text-[#1C1C1E]">${PL.esc(ad.name || "Ad")}</span>
          </div>
          <div class="flex items-center gap-2 mt-0.5 flex-wrap">
            <span class="pill gray" style="font-size:10px">${PL.esc(ad.format || "Format")}</span>
            <span class="pill gray" style="font-size:10px">${PL.esc(ad.creative_type || "Creative")}</span>
            <span class="muted text-[11px]">${PL.esc(ad.angle || "")}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-none">${statusPill(ad.status)}<i data-lucide="chevron-down" class="fb-chev" style="width:15px;height:15px;color:#9AA49D"></i></div>
      </div>
      <div class="fb-collapse" style="padding:0 16px 14px">
        <div class="fb-kv">
          ${kv("Hook", PL.esc(ad.hook || ""))}
          ${kv("Primary Text", PL.esc(ad.primary_text || ""))}
          ${kv("Headline", PL.esc(ad.headline || ""))}
          ${kv("CTA", `<b style="color:#0FA05A">${PL.esc(ad.cta || "")}</b>`)}
          ${kv("Format", PL.esc(ad.format || ""))}
          ${kv("Creative Type", PL.esc(ad.creative_type || ""))}
        </div>
        ${Array.isArray(ad.creative_instructions) && ad.creative_instructions.length ? `
        <div class="mt-3">
          <div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298;margin-bottom:4px">Creative Instructions</div>
          <div class="rounded-xl p-3" style="background:#FAFBF9;border:1px solid var(--line)">
            ${ad.creative_instructions.map((i) => `<div class="flex items-start gap-2 text-[12px] text-[#3F3F46] leading-relaxed"><span class="fb-check" style="flex:none">${PL.icon("check-circle", 13)}</span>${PL.esc(i)}</div>`).join("")}
          </div>
        </div>` : ""}
        ${ad.ai_reasoning ? `<div class="mt-3"><div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298;margin-bottom:4px">AI Reasoning</div><div class="fb-reason">${PL.esc(ad.ai_reasoning)}</div></div>` : ""}
        <div class="fb-hr"></div>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-ghost btn-xs" data-copy="${PL.esc(adCopyText(ad))}">${PL.icon("copy", 12)} Copy Ad Copy</button>
          <button class="btn btn-ghost btn-xs" data-alt="${si}-${ai}">${PL.icon("refresh-cw", 12)} Generate Alternative</button>
        </div>
      </div>
    </div>`;
  }

  function renderAdSet(set, si) {
    const ads = Array.isArray(set.ads) ? set.ads : [];
    return `
    <div class="fb-card fb-set" data-set="${si}">
      <div class="fb-head fb-toggle" data-toggle="set-${si}">
        <span class="icon-tile green" style="width:32px;height:32px;border-radius:9px">${PL.icon("filter", 15)}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[11px] font-black text-[#3DDC72] tracking-wide">AD SET ${si + 1}</span>
            <span class="text-[13.5px] font-bold text-[#1C1C1E]">${PL.esc(set.name || "Ad Set")}</span>
          </div>
          <div class="muted text-[11.5px] mt-0.5">${PL.esc(set.testing_purpose || "")}</div>
        </div>
        <div class="flex items-center gap-2 flex-none">${statusPill(set.status)}<i data-lucide="chevron-down" class="fb-chev" style="width:15px;height:15px;color:#9AA49D"></i></div>
      </div>
      <div class="fb-collapse" style="padding:0 16px 14px">
        <div class="fb-kv">
          ${kv("Audience", PL.esc(set.audience || ""))}
          ${kv("Location", PL.esc(set.location || ""))}
          ${kv("Age", PL.esc(set.age || ""))}
          ${kv("Gender", PL.esc(set.gender || ""))}
          ${kv("Placements", PL.esc(set.placements || ""))}
          ${kv("Budget", PL.esc(set.budget || ""))}
          ${kv("Optimization", PL.esc(set.optimization || ""))}
          ${kv("Creative Angle", PL.esc(set.creative_angle || ""))}
        </div>
        <div class="mt-3">
          <div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298;margin-bottom:4px">Interests</div>
          ${chips(set.interests)}
        </div>
        <div class="fb-hr"></div>
        <button class="btn btn-ghost btn-xs" data-copy="${PL.esc(adSetSettingsText(set))}">${PL.icon("copy", 12)} Copy Ad Set Settings</button>
        ${ads.length ? `<div class="fb-hr"></div><div class="fb-ad-list">${ads.map((a, ai) => renderAd(a, si, ai)).join("")}</div>` : ""}
      </div>
    </div>`;
  }

  function renderBlueprint() {
    const p = D.fbPlan || {};
    const c = p.campaign || {};
    const sets = Array.isArray(p.ad_sets) ? p.ad_sets : [];
    if (!c.name && !sets.length) {
      $("fb-tree").innerHTML = `<div class="muted py-6 text-center">Generate the Facebook Ads Strategy to see your campaign blueprint here.</div>`;
      return;
    }
    $("fb-tree").innerHTML = `
      <div class="fb-card" style="width:100%;max-width:760px">
        <div class="fb-head">
          <span class="icon-tile" style="background:#0E7A43;border:none;color:#fff;border-radius:10px">${PL.icon("layers", 16)}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[11px] font-black text-[#0E7A43] tracking-wide">CAMPAIGN</span>
              <span class="text-[15px] font-extrabold text-[#1C1C1E]">${PL.esc(c.name || "Campaign")}</span>
            </div>
            <div class="muted text-[12px] mt-0.5">${PL.esc(c.testing_strategy || "")}</div>
          </div>
          <div class="flex items-center gap-2 flex-none flex-wrap">
            <span class="fb-alt-badge">${PL.icon("sparkles", 11)} AI Recommendation</span>
            ${statusPill(c.status)}
          </div>
        </div>
        <div class="fb-collapse" style="padding:0 16px 16px;display:block">
          <div class="fb-kv">
            ${kv("Objective", `<b style="color:#0FA05A">${PL.esc(c.objective || "")}</b>`)}
            ${kv("Buying Type", PL.esc(c.buying_type || ""))}
            ${kv("Budget Strategy", PL.esc(c.budget_strategy || ""))}
            ${kv("Recommended Budget", PL.esc(c.budget || ""))}
            ${kv("Optimization", PL.esc(c.optimization || ""))}
          </div>
          <div class="fb-hr"></div>
          <div class="flex flex-wrap gap-2">
            <button class="btn btn-ghost btn-xs" data-copy="${PL.esc(campaignSettingsText(c))}">${PL.icon("copy", 12)} Copy Settings</button>
            <button class="btn btn-ghost btn-xs" data-copy="${PL.esc(campaignStructureText())}">${PL.icon("folder-tree", 12)} Copy Campaign Structure</button>
            <button class="btn btn-primary btn-xs" data-regen>${PL.icon("refresh-cw", 12)} Regenerate Strategy</button>
          </div>
        </div>
      </div>
      <div class="fb-vline"></div>
      <div class="fb-set-grid">
        ${sets.map((s, si) => renderAdSet(s, si)).join("")}
      </div>`;
    if (window.lucide) lucide.createIcons();
  }

  /* ---------- supporting sections ---------- */

  function renderMatrix() {
    const rows = (D.fbPlan && D.fbPlan.creative_matrix) || [];
    $("creative-matrix").innerHTML = rows.length ? `
      <div class="flex flex-wrap gap-2">
        ${rows.map((r, i) => `<div class="rounded-xl px-3 py-2 flex items-center gap-2" style="background:#fff;border:1px solid var(--line)">
          <span class="step-dot done" style="flex:none;width:22px;height:22px;font-size:11px">${i + 1}</span>
          <span class="text-[12.5px] font-bold text-[#1C1C1E]">${PL.esc(r.angle || r.ad || "")}</span>
        </div>`).join("")}
      </div>` : `<div class="muted">No creative matrix yet.</div>`;
  }

  function renderWhy() {
    const rows = (D.fbPlan && D.fbPlan.why) || REASON_DEFAULTS;
    $("fb-why").innerHTML = rows.map((w) => `
      <div class="flex items-start gap-2.5 py-2">
        <span class="fb-check" style="flex:none;margin-top:1px">${PL.icon("check-circle", 16)}</span>
        <span class="text-[12.5px] text-[#3F3F46] leading-relaxed">${PL.esc(w)}</span>
      </div>`).join("") || `<div class="muted">No reasoning yet.</div>`;
  }

  function renderBudget() {
    const b = (D.fbPlan && D.fbPlan.budget) || {};
    const rows = [
      { k: "Recommended Daily Budget", v: b.daily },
      { k: "Testing Budget", v: b.testing },
      { k: "Scaling Budget", v: b.scaling },
      { k: "When to increase", v: b.when_increase },
      { k: "When to pause", v: b.when_pause },
    ];
    $("fb-budget").innerHTML = rows.map((r) => `
      <div class="rounded-xl p-3 mb-2" style="background:#fff;border:1px solid var(--line)">
        <div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298">${PL.esc(r.k)}</div>
        <div class="text-[13px] font-bold text-[#1C1C1E] mt-1 leading-snug">${PL.esc(r.v || "—")}</div>
      </div>`).join("") + `<div class="fb-note mt-2">AI estimates based on price, margins, country and test size — not guaranteed results. Start small, scale on gates only.</div>`;
  }

  function renderRules() {
    const rows = (D.fbPlan && D.fbPlan.rules) || [];
    $("fb-rules").innerHTML = rows.map((r) => `
      <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div><div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298">TEST</div><div class="text-[13px] font-bold text-[#1C1C1E] mt-1">${PL.esc(r.test || "")}</div></div>
          <div><div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298">KEEP CONSTANT</div><div class="text-[13px] font-bold text-[#1C1C1E] mt-1">${PL.esc(r.constant || "")}</div></div>
        </div>
        <div class="mb-3"><div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298;margin-bottom:4px">MONITOR</div><div class="flex flex-wrap gap-1.5">${(r.monitor || []).map((m) => `<span class="fb-chip">${PL.esc(m)}</span>`).join("")}</div></div>
        <div><div class="k" style="font-size:10px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#929298;margin-bottom:4px">DECISION</div><div class="fb-reason">${PL.esc(r.decision || "")}</div></div>
      </div>`).join("") || `<div class="muted">No testing rules yet.</div>`;
  }

  function renderSteps() {
    const steps = (D.fbPlan && D.fbPlan.steps) || [];
    $("fb-steps").innerHTML = steps.length ? `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${steps.map((s, i) => `
        <div class="fb-step">
          <div class="fb-step-head">
            <span class="icon-tile ${i === 0 ? "green" : "green-soft"}" style="width:28px;height:28px;border-radius:8px">${PL.icon(s.icon || "list", 14)}</span>
            <div class="font-bold text-[13px] text-[#1C1C1E]">${PL.esc(s.step || "")}</div>
          </div>
          ${(s.rows || []).map((r) => `
          <div class="fb-step-row">
            <span class="lab">${PL.esc(r.label)}</span>
            <span class="val">${PL.esc(r.value)}</span>
            ${r.copy ? `<button class="fb-copy" data-copy="${PL.esc(r.value)}">${PL.icon("copy", 11)}</button>` : ""}
          </div>`).join("")}
        </div>`).join("")}
      </div>
      <div class="fb-note mt-3">Paste each line straight into Meta Ads Manager. Objective, audience and creative names come from the blueprint above.</div>` : `<div class="muted">No build steps yet.</div>`;
  }

  /* ---------- existing framework sections ---------- */

  function renderER() {
    const plan = D.fbPlan || {};
    const entities = (plan.entities && plan.entities.length) ? plan.entities : [];
    if (!entities.length) { $("er-diagram").innerHTML = `<div class="muted">No account model yet.</div>`; return; }
    $("er-diagram").innerHTML = `
      <div class="er-row">
        ${entities.map((e, i) => {
          const color = ENTITY_COLORS[e.kind] || "#3DDC72";
          return `
          ${i > 0 ? `<div class="er-link"><span class="ln"></span><span class="er-card">1</span><span class="er-card">N</span></div>` : ""}
          <div class="er-entity">
            <div class="er-head" style="background:${color}">${PL.icon(e.icon || "layers", 13)} ${PL.esc(e.name)}</div>
            ${(e.attrs || []).map((a) => {
              const isKey = String(a).indexOf("(PK)") >= 0 || String(a).indexOf("(FK)") >= 0;
              const clean = String(a).replace(/\s*\((PK|FK)\)\s*/i, (m, k) => (k === "PK" ? " · PK" : " · FK"));
              return `<div class="er-attr">${isKey ? `<span class="k">${PL.esc(clean)}</span>` : PL.esc(a)}</div>`;
            }).join("")}
            <div class="er-focus"><b style="color:#1C1C1E">TEST:</b> ${PL.esc(e.focus || "—")}</div>
          </div>`;
        }).join("")}
      </div>`;
    if (window.lucide) lucide.createIcons();
  }

  function renderLoop() {
    const rows = D.fbPlan && D.fbPlan.loop && D.fbPlan.loop.length ? D.fbPlan.loop : LOOP;
    $("test-loop").innerHTML = rows.map((s, i) => `
      <div class="flex items-start gap-3">
        <div class="step-dot done" style="flex:none">${i + 1}</div>
        <div>
          <div class="font-semibold text-[13px] text-[#1C1C1E]">${PL.esc(s.step)}</div>
          <div class="muted text-[12px] mt-0.5">${PL.esc(s.detail)}</div>
        </div>
      </div>`).join("");
  }

  function renderTests() {
    const rows = (D.fbPlan && D.fbPlan.tests) || [];
    $("fb-tests-body").innerHTML = rows.map((t, i) => `
      <tr>
        <td class="font-bold text-[#1C1C1E]">${PL.esc(t.w || "W" + (i + 1))}</td>
        <td class="muted">${PL.esc(t.test)}</td>
        <td>${PL.esc(t.goal)}</td>
        <td class="muted">${PL.esc(t.decide)}</td>
      </tr>`).join("") || `<tr><td colspan="4" class="muted">No testing plan yet.</td></tr>`;
  }

  function renderScale() {
    const rows = (D.fbPlan && D.fbPlan.scale) || [];
    $("scale-ladder").innerHTML = rows.map((s, i) => `
      <div class="flex items-start gap-3">
        <div class="step-dot ${i === 0 ? "run" : "done"}" style="flex:none">${i + 1}</div>
        <div class="flex-1 rounded-xl p-3.5" style="background:#fff;border:1px solid var(--line)">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="font-bold text-[13.5px] text-[#1C1C1E]">${PL.esc(s.stage)}</div>
            <span class="pill green">${PL.esc(s.budget)}</span>
          </div>
          <div class="muted text-[12.5px] mt-1">${PL.esc(s.rule)}</div>
        </div>
      </div>`).join("") || `<div class="muted">No scaling plan yet.</div>`;
  }

  function renderGates() {
    const rows = (D.fbPlan && D.fbPlan.gates) || [];
    $("kpi-gates").innerHTML = rows.map((g) => `
      <div class="rounded-xl p-3" style="background:#fff;border:1px solid var(--line)">
        <div class="flex items-center justify-between">
          <span class="text-[12.5px] font-bold text-[#1C1C1E]">${PL.esc(g.metric)}</span>
          <span class="text-[13px] font-extrabold text-[#0FA05A]">${PL.esc(g.target)}</span>
        </div>
        <div class="muted text-[11.5px] mt-0.5">${PL.esc(g.window)}</div>
        <div class="muted text-[11.5px] mt-1">→ ${PL.esc(g.action)}</div>
      </div>`).join("") || `<div class="muted">No KPI gates yet.</div>`;
  }

  function renderNotes() {
    const rows = (D.fbPlan && D.fbPlan.notes) || [];
    $("fb-notes").innerHTML = rows.map((n) => `
      <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
        <div class="font-bold text-[13px] text-[#1C1C1E]">${PL.esc(n.title)}</div>
        <div class="muted text-[12.5px] mt-1 leading-relaxed">${PL.esc(n.body)}</div>
      </div>`).join("") || `<div class="muted">No notes yet.</div>`;
  }

  /* ---------- interactions ---------- */

  function bindEvents() {
    document.querySelectorAll(".fb-set").forEach((el) => {
      el.onclick = (e) => { if (e.target.closest("button")) return; el.classList.toggle("open"); };
    });
    document.querySelectorAll(".fb-ad").forEach((el) => {
      el.onclick = (e) => { e.stopPropagation(); if (e.target.closest("button")) return; el.classList.toggle("open"); };
    });
    document.querySelectorAll("[data-copy]").forEach((el) => {
      el.onclick = (e) => { e.stopPropagation(); copyText(el.getAttribute("data-copy")); };
    });
    document.querySelectorAll("[data-regen]").forEach((el) => {
      el.onclick = () => generate();
    });
    document.querySelectorAll("[data-alt]").forEach((el) => {
      el.onclick = (e) => { e.stopPropagation(); const [si, ai] = String(el.getAttribute("data-alt")).split("-").map(Number); generateAlt(si, ai); };
    });
  }

  function renderAll() {
    renderBlueprint();
    renderMatrix();
    renderWhy();
    renderBudget();
    renderSteps();
    renderRules();
    renderER();
    renderLoop();
    renderTests();
    renderScale();
    renderGates();
    renderNotes();
    bindEvents();
  }

  /* ---------- AI generation ---------- */

  function strategyPrompt() {
    const prod = { name: D.product.name, price: D.product.price, market: D.product.market, facts: D.product.facts, unknowns: D.product.unknowns };
    const persona = D.personas && D.personas[0];
    return `You are an expert Meta media buyer. Build a ready-to-create Facebook Ads campaign for the product below. Respond with ONLY a single JSON object and NOTHING else — no markdown fences, no text before or after. The JSON must have EXACTLY these top-level keys:

"campaign": {"name":"TEST | <Product> | Sales","objective":"Sales","buying_type":"Auction","budget_strategy":"ABO for initial audience testing","budget":"$XX/day across 3 ad sets","optimization":"Purchase","testing_strategy":"one line","status":"READY TO BUILD"}

"ad_sets": array of 3 objects, each:
{"name":"Audience | Location | Age","audience":"Broad or Interest-based","location":"country from product","age":"age range","gender":"All","interests":["only for interest-based set, else []"],"placements":"Advantage+ Placements","budget":"$XX/day","optimization":"Purchase","creative_angle":"one line","testing_purpose":"what this set tests","status":"TESTING","ads": array of 2 objects, each:
{"name":"ANGLE | Short Title","format":"9:16 Video","creative_type":"UGC / Product Demonstration / Social Proof / Lifestyle","hook":"one punchy line","angle":"Problem → Solution | Transformation | Social Proof | Lifestyle","primary_text":"3-4 sentences of ad copy, facts only, no invented reviews","headline":"short benefit line","cta":"Shop Now","creative_instructions":["5 short shot directions"],"ai_reasoning":"one line","status":"AI RECOMMENDED"}}

"creative_matrix": array of 5 {"ad":"Ad 1","angle":"angle name"} — each angle distinct
"why": array of 5 short strings explaining the structure
"budget": {"daily":"$XX/day ...","testing":"$XXX/week ...","scaling":"+25% every 48h ...","when_increase":"...","when_pause":"..."}
"steps": array of 3 {"step":"1 · Create Campaign","icon":"layers","rows":[{"label":"Objective","value":"Sales","copy":false}, {"label":"Campaign Name","value":"...","copy":true}]} — one for Campaign, one for Ad Sets, one for Ads
"rules": array of 1-2 {"test":"variable","constant":"what stays fixed","monitor":["CTR","CPC","CPM","Landing Page View","Add to Cart","Purchase","CPA","ROAS"],"decision":"one paragraph"}

Base every choice on the product analysis — do NOT return a generic strategy. Use the actual country, price, benefits and mechanism. Keep every value to one concise line. Do not invent reviews, sales volume or margins; where missing write NEEDS REAL DATA.
Product: ${JSON.stringify(prod)}
Persona: ${persona ? JSON.stringify({ name: persona.name, age: persona.age, painPoints: persona.painPoints, desires: persona.desires }) : "none available"}`;
  }

  function validStrategy(o) {
    return o && typeof o === "object" && typeof o.campaign === "object" && Array.isArray(o.ad_sets) && o.ad_sets.length && o.ad_sets.every((s) => s && s.name && Array.isArray(s.ads) && s.ads.length);
  }

  async function generate() {
    const btn = $("btn-generate");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Building blueprint…`;
    try {
      applySavedProduct();
      const res = await PL_API.ai("fb_strategy", {
        name: D.product.name,
        facts: D.product.facts,
        unknowns: D.product.unknowns,
        price: D.product.price,
        market: D.product.market,
      }, { prompt: strategyPrompt(), maxTokens: 6000 });

      if (res.simulated) {
        PL.toast(res.reason || "[Simulated] FB blueprint from demo dataset", "flask-conical");
        renderAll();
        return;
      }

      const parsed = PL.parseJSON(res.data);
      if (validStrategy(parsed)) {
        const plan = D.fbPlan;
        plan.campaign = Object.assign({}, plan.campaign, parsed.campaign);
        plan.ad_sets = parsed.ad_sets;
        if (Array.isArray(parsed.creative_matrix) && parsed.creative_matrix.length) plan.creative_matrix = parsed.creative_matrix;
        if (Array.isArray(parsed.why) && parsed.why.length) plan.why = parsed.why;
        if (parsed.budget && typeof parsed.budget === "object") plan.budget = Object.assign({}, plan.budget, parsed.budget);
        if (Array.isArray(parsed.steps) && parsed.steps.length) plan.steps = parsed.steps;
        if (Array.isArray(parsed.rules) && parsed.rules.length) plan.rules = parsed.rules;
        renderAll();
        const next = $("btn-next");
        if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
        PL.toast("FB Ads blueprint built", "check-circle");
      } else {
        PL.toast("Model returned an unexpected format — showing demo dataset", "info");
        renderAll();
      }
    } catch (err) {
      console.error(err);
      PL.toast("Build failed — check the server / API key", "info");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 16)} Generate Facebook Ads Strategy`;
    }
  }

  async function generateAlt(si, ai) {
    const plan = D.fbPlan || {};
    const set = plan.ad_sets && plan.ad_sets[si];
    const ad = set && set.ads && set.ads[ai];
    if (!set || !ad) return PL.toast("Nothing to replace", "info");
    const btn = document.querySelector(`[data-alt="${si}-${ai}"]`);
    if (btn) { btn.disabled = true; btn.innerHTML = `${PL.icon("refresh-cw", 12)} Generating…`; }
    try {
      const res = await PL_API.ai("fb_strategy", {
        name: D.product.name,
        facts: D.product.facts,
        price: D.product.price,
        market: D.product.market,
      }, {
        prompt: `Generate ONE alternative Facebook ad for ad set "${set.name}" (creative angle: ${set.creative_angle}). Return ONLY a single JSON object with keys: {"name":"ANGLE | Short Title","format":"9:16 Video","creative_type":"...","hook":"...","angle":"...","primary_text":"...","headline":"...","cta":"Shop Now","creative_instructions":["..."],"ai_reasoning":"...","status":"AI RECOMMENDED"}. Use a DIFFERENT angle than "${ad.angle}". Facts only, no invented reviews. Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, facts: D.product.facts })}`,
        maxTokens: 2000,
      });
      if (res.simulated) { PL.toast(res.reason || "[Simulated] Using a demo alternative", "flask-conical"); return; }
      const parsed = PL.parseJSON(res.data);
      if (parsed && typeof parsed === "object" && (parsed.name || parsed.hook || parsed.primary_text || parsed.headline)) {
        set.ads[ai] = Object.assign({}, ad, parsed);
        renderAll();
        PL.toast("Alternative ad generated", "check-circle");
      } else {
        PL.toast("Model returned an unexpected format — ad unchanged", "info");
      }
    } catch (err) {
      console.error(err);
      PL.toast("Alternative failed — check the server / API key", "info");
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = `${PL.icon("refresh-cw", 12)} Generate Alternative`; }
    }
  }

  PL.on(() => {
    renderHead();
    applySavedProduct();
    renderAll();
    $("btn-generate").addEventListener("click", generate);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "creative-lab.html"; });
  });
})();
