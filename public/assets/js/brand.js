/* PUNCHLINE — Brand logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Brand",
      "Mission, voice, values, and guardrails. The brand is the filter every creative and claim passes through."
    );
  }

  function render() {
    const b = D.brand;
    $("mission").textContent = b.mission;
    $("tone-line").textContent = b.voice;

    $("values").innerHTML = b.values.map((v) => `
      <div class="flex items-center gap-2.5">
        <span class="dot-status on"></span>
        <span class="text-[13.5px] text-[#3F3F46] font-medium">${PL.esc(v)}</span>
      </div>`).join("");

    $("voice").innerHTML = `
      <div class="text-[13.5px] text-[#3F3F46] leading-relaxed">${PL.esc(b.tone)}</div>
      <div class="mt-1"><span class="tag">${PL.esc(b.voice)}</span></div>`;

    $("guardrails").innerHTML = b.guardrails.map((g) => `
      <div class="flex items-start gap-2.5">
        <span class="unknown-tag" style="margin-top:2px">RULE</span>
        <span class="text-[13px] text-[#3F3F46] leading-snug">${PL.esc(g)}</span>
      </div>`).join("");

    $("do-ex").innerHTML = `"${PL.esc(b.examples.do)}"`;
    $("dont-ex").innerHTML = `"${PL.esc(b.examples.dont)}"`;
  }

  /* Pull the analyzed product from Products page if present. */
  function applySavedProduct() {
    const saved = PL.loadProduct();
    if (!saved || !saved.product || !saved.product.name) return;
    D.product = Object.assign({}, D.product, saved.product);
    D.product.facts = saved.facts && saved.facts.length ? saved.facts : D.product.facts;
    D.product.unknowns = saved.unknowns && saved.unknowns.length ? saved.unknowns : D.product.unknowns;
    const ctx = $("product-ctx");
    if (ctx) {
      ctx.classList.remove("hidden");
      ctx.innerHTML = `Drafting for <b>${PL.esc(D.product.name)}</b>${D.product.price ? " · " + PL.money(D.product.price) : ""}`;
    }
  }

  async function regenerate() {
    const btn = $("btn-draft");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Drafting…`;

    const res = await PL_API.ai("brand", {
      name: D.product.name,
      facts: D.product.facts,
      unknowns: D.product.unknowns,
      price: D.product.price,
      market: D.product.market,
    }, {
      prompt: `Build the brand foundation for this product. Return ONLY valid JSON, no prose, with this exact structure:
{"mission":"1-2 sentences","voice":"short descriptor","tone":"writing style instructions","values":["3-5"],"guardrails":["4-6"],"examples":{"do":"on-brand copy","dont":"copy to avoid"}}

Rules:
- mission: tied to the verified product facts, benefit-first.
- guardrails: never invent reviews/sales numbers, no unverified medical claims, every claim traceable to a spec or test.
- Base everything on the provided facts. Mark anything not known as UNKNOWN.
Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, market: D.product.market, facts: D.product.facts, unknowns: D.product.unknowns })}`,
    });

    const parsed = PL.parseJSON(res.data);
    const b = parsed && typeof parsed === "object" ? parsed : D.brand;
    if (b) {
      D.brand = Object.assign({}, D.brand, b);
      D.brand.examples = Object.assign({}, D.brand.examples || {}, (b.examples || {}));
    }
    render();

    btn.disabled = false;
    btn.innerHTML = `${PL.icon("sparkles", 16)} Regenerate draft`;
    const next = $("btn-next");
    if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
    PL.toast(
      parsed ? "Brand draft regenerated" : "[Simulated] Brand draft — add a key for live AI",
      "check-circle"
    );
  }

  PL.on(() => {
    renderHead();
    applySavedProduct();
    render();
    $("btn-draft").addEventListener("click", regenerate);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "personas.html"; });
  });
})();
