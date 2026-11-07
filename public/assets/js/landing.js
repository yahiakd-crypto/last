/* PUNCHLINE — Landing Pages generator logic (text-format section specs) */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  const NOTES = [
    { icon: "search-check", title: "One idea per page", body: "The headline and the CTA must promise the same outcome. If they diverge, the page leaks." },
    { icon: "shield-alert", title: "Only verified claims", body: "Every benefit must trace to a fact in Products. Never invent reviews or social proof." },
    { icon: "target", title: "A/B before you scale", body: "Ship the highest-scoring concept, then A/B one element (headline, CTA, proof) per week." },
  ];

  const FIELD_MAP = [
    ["Purpose", "purpose"],
    ["Psychological Goal", "psychologicalGoal"],
    ["Visual Direction", "visualDirection"],
    ["Copywriting Goal", "copywritingGoal"],
    ["CTA", "cta"],
    ["Suggested Icons", "icons"],
    ["Suggested Images", "images"],
    ["Layout Description", "layout"],
    ["Animation Ideas", "animation"],
    ["Color Recommendation", "colors"],
    ["Mobile UX Notes", "mobile"],
    ["Trust Elements", "trust"],
    ["Conversion Tips", "tips"],
  ];

  const PAGES = [
    { n: "A", angle: "Problem-First: lead with the pain, then the one-tap fix" },
    { n: "B", angle: "Curiosity: tease the outcome before naming the product" },
    { n: "C", angle: "Social Proof / Gift: show belonging, or sell it as a gift for someone else" },
  ];

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Landing Pages",
      "Three full landing page concepts — every section specced with purpose, psychology, copy, CTA, visuals, animation, colors, mobile UX, trust and conversion tips."
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
      ctx.innerHTML = `Landing pages for <b>${PL.esc(D.product.name)}</b>${D.product.price ? " · " + PL.money(D.product.price) : ""} · ${PL.esc(D.product.market || "")}`;
    }
  }

  /* Normalize a landing entry (live text doc OR demo JSON object) into a text doc. */
  function toDoc(l) {
    if (typeof l === "string") return l;
    if (l && l.sections) {
      const title = l.name || "LANDING PAGE";
      let out = "--- " + title + " ---\n";
      l.sections.forEach((s, i) => {
        out += "\nSection " + (i + 1) + ": " + (s.name || "Section") + "\n";
        FIELD_MAP.forEach(([label, key]) => { if (s[key]) out += label + ": " + s[key] + "\n"; });
      });
      return out;
    }
    return String(l || "");
  }

  function docTitle(text) {
    const m = /^---\s*(.+?)\s*---/.exec(text || "");
    return m ? m[1] : "LANDING PAGE";
  }

  function renderDoc(text) {
    const html = PL.esc(text)
      .replace(/^(---[^-]*---)$/gm, '<b class="doc-title">$1</b>')
      .replace(/^(Section \d+[^:\n]*)$/gm, '<span class="sec-line">$1</span>')
      .replace(/^([A-Za-z ]+):/gm, '<span class="lbl">$1:</span>');
    return `<div class="lp-pre">${html}</div>`;
  }

  function renderLandings() {
    const list = (D.landings && D.landings.length) ? D.landings : [];
    $("landing-grid").innerHTML = list.length ? list.map((l, i) => {
      const text = toDoc(l);
      return `
      <div class="card rise" style="animation-delay:${Math.min(i * 0.08, 0.3)}s">
        <div class="card-head">
          <span class="icon-tile ${i === 0 ? "green" : "green-soft"}"><i data-lucide="layout-template" style="width:17px;height:17px"></i></span>
          <div class="flex-1 min-w-0">
            <div class="card-title">${PL.esc(docTitle(text))}</div>
            <div class="card-sub">${PL.esc(D.product.name || "Product")} landing spec · ${PL.esc(D.product.market || "")}</div>
          </div>
          <span class="pill ${i === 0 ? "green" : "gray"}">${["A", "B", "C"][i] ? "Concept " + ["A", "B", "C"][i] : ""}</span>
        </div>
        <div class="mt-2">${renderDoc(text)}</div>
      </div>`;
    }).join("") : `<div class="card muted">Generate 3 landing pages to see specs here.</div>`;
    if (window.lucide) lucide.createIcons();
  }

  function renderNotes() {
    $("landing-notes").innerHTML = NOTES.map((n) => `
      <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
        <div class="flex items-center gap-2"><span class="icon-tile green-soft"><i data-lucide="${n.icon}" style="width:15px;height:15px"></i></span>
        <div class="font-bold text-[13px] text-[#1C1C1E]">${n.title}</div></div>
        <div class="muted text-[12.5px] mt-1.5 leading-relaxed">${n.body}</div>
      </div>`).join("");
    if (window.lucide) lucide.createIcons();
  }

  function pagePrompt(letter, angle, market) {
    return `Write ONE landing page spec (page ${letter}) as PLAIN TEXT. No JSON, no markdown fences, no intro or outro text. IMITATE this exact format — every field label below must appear for every section:

--- LANDING PAGE ${letter}: <a short concept title> ---
Section 1: Hero — <section title>
Purpose: ...
Psychological Goal: ...
Visual Direction: ...
Copywriting Goal: ...
CTA: ...
Suggested Icons: ...
Suggested Images: ...
Layout Description: ...
Animation Ideas: ...
Color Recommendation: ...
Mobile UX Notes: ...
Trust Elements: ...
Conversion Tips: ...

Then repeat the SAME 13 labels for Section 2 (Problem Agitation), Section 3 (Solution Intro), Section 4 (Features Grid), Section 5 (Social Proof), Section 6 (FAQ), Section 7 (Final CTA). Keep every value to ONE concise line.

Concept angle for this page: ${angle}.
Write ALL section content in the market's language: English for US, French for France, Darija/Arabic for Morocco. Market: ${market}.
Rules: only use claims traceable to the facts; where reviews or sales numbers are missing write NEEDS REAL DATA; the CTA and headline must promise the same outcome.
Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, market, facts: D.product.facts, unknowns: D.product.unknowns })}`;
  }

  async function genPage(p, market) {
    const res = await PL_API.ai("landing_pages", {
      name: D.product.name,
      facts: D.product.facts,
      unknowns: D.product.unknowns,
      price: D.product.price,
      market,
    }, { prompt: pagePrompt(p.n, p.angle, market), maxTokens: 4096 });
    if (res.simulated) return { simulated: true, reason: res.reason };
    const t = String(res.data || "");
    if (t.indexOf("Section 1") < 0 || t.indexOf("Purpose:") < 0) return { bad: true };
    return { text: t };
  }

  async function generate() {
    const btn = $("btn-generate");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Writing landing A…`;
    try {
      applySavedProduct();
      const market = D.product.market || "United States";

      const pages = [];
      for (const p of PAGES) {
        btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Writing landing ${p.n}/3…`;
        const r = await genPage(p, market);
        if (r.simulated) {
          PL.toast(r.reason || "[Simulated] Landings from demo dataset", "flask-conical");
          renderLandings();
          return;
        }
        if (r.bad) {
          PL.toast("Model output didn't match the spec format — showing demo dataset", "info");
          renderLandings();
          return;
        }
        pages.push(r.text);
      }

      D.landings = pages;
      renderLandings();
      if (window.lucide) lucide.createIcons();
      const next = $("btn-next");
      if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
      PL.toast("3 landing page specs generated", "check-circle");
    } catch (err) {
      console.error(err);
      PL.toast("Generate failed — check the server / API key", "info");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 16)} Generate 3 landings`;
    }
  }

  PL.on(() => {
    renderHead();
    applySavedProduct();
    renderLandings();
    renderNotes();
    $("btn-generate").addEventListener("click", generate);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "ad-critic.html"; });
  });
})();
