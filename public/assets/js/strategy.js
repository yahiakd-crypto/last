/* PUNCHLINE — Strategy logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Strategy",
      "USP, positioning, offer architecture, and the competitive gap. Every strategic claim here is a hypothesis to validate in market."
    );
  }

  function render() {
    const s = D.strategy;
    $("usp").textContent = s.usp;
    $("funnel-stage").textContent = s.funnelStage;
    $("positioning").textContent = s.positioning;
    $("pillars").innerHTML = (s.pillars || []).map((p) => PL.tag(p)).join("");

    $("offers").innerHTML = D.offers.map((o) => `
      <div class="rounded-xl p-4 ${o.id === "A" ? "" : ""}" style="background:#fff;border:1px solid var(--line)">
        <div class="flex items-center justify-between">
          <div class="font-bold text-[14px] text-[#1C1C1E]">${PL.esc(o.name || "Offer")}</div>
          <div class="text-[18px] font-extrabold text-[#1C1C1E]">${o.price != null ? PL.money(o.price) : "—"}</div>
        </div>
        <div class="muted text-[12.5px] mt-1">${PL.esc(o.detail || "")}</div>
        <div class="mt-2"><span class="pill ${String(o.verdict || "").indexOf("TEST") === 0 ? "amber" : "gray"}"><span class="dot"></span>${PL.esc(o.verdict || "TEST")}</span></div>
      </div>`).join("");

    $("comp-body").innerHTML = D.competitors.map((c) => `
      <tr>
        <td class="font-semibold text-[#1C1C1E]">${PL.esc(c.name)}</td>
        <td>${PL.money(c.price)}</td>
        <td class="muted">${PL.esc(c.claims)}</td>
        <td class="muted">${PL.esc(c.gap)}</td>
      </tr>`).join("");

    $("gaps").innerHTML = D.gaps.map((g) => `
      <div class="flex items-start gap-2.5">
        <span class="dot-status on" style="margin-top:6px"></span>
        <span class="text-[13px] text-[#3F3F46] leading-snug">${PL.esc(g)}</span>
      </div>`).join("");
  }

  function renderMap() {
    CH.bar("pos-map", ["Commodity", "Mid", "Premium"], [
      { label: "Price", data: [25, 75, 129], color: "#DFE2DF" },
    ]);
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
      ctx.innerHTML = `Strategizing for <b>${PL.esc(D.product.name)}</b>${D.product.price ? " · " + PL.money(D.product.price) : ""}`;
    }
  }

  async function generate() {
    const btn = $("btn-generate");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Strategizing…`;
    try {
      applySavedProduct();

      const res = await PL_API.ai("strategy", {
        name: D.product.name,
        facts: D.product.facts,
        unknowns: D.product.unknowns,
        price: D.product.price,
        market: D.product.market,
      }, {
        prompt: `Build the go-to-market strategy for this product. Return ONLY valid JSON, no prose, with this exact structure:
{"usp":"one strong sentence","funnelStage":"Awareness / Consideration / Conversion","positioning":"for [who] that [need], [product] is [category] that [key benefit] — unlike [alt], it [difference]","pillars":["4-6 strategic pillars"],"offers":[{"id":"A","name":"offer name","price":59,"detail":"what's included","verdict":"TEST — hypothesis to validate"}],"competitors":[{"name":"segment","price":99,"claims":"claim territory","gap":"our gap vs them"}],"gaps":["3-5 uncontested gaps"]}

Rules:
- Base everything on the provided facts. Never invent reviews or sales numbers.
- Offers: 3 options (A/B/C) at different price points, each with a falsifiable test verdict.
Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, market: D.product.market, facts: D.product.facts, unknowns: D.product.unknowns })}`,
      });

      const parsed = PL.parseJSON(res.data);
      if (parsed && typeof parsed === "object") {
        if (parsed.usp || parsed.positioning || parsed.pillars) {
          D.strategy = Object.assign({}, D.strategy, parsed);
        }
        if (Array.isArray(parsed.offers) && parsed.offers.length) D.offers = parsed.offers;
        if (Array.isArray(parsed.competitors) && parsed.competitors.length) D.competitors = parsed.competitors;
        if (Array.isArray(parsed.gaps) && parsed.gaps.length) D.gaps = parsed.gaps;
        render();
        const next = $("btn-next");
        if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
        PL.toast("Strategy generated", "check-circle");
      } else {
        PL.toast(res.simulated ? "[Simulated] Strategy from demo dataset" : "No strategy output — using demo dataset", "info");
      }
    } catch (err) {
      console.error(err);
      PL.toast("Generate failed — check the server / API key", "info");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 16)} Generate strategy`;
    }
  }

  PL.on(() => {
    renderHead();
    applySavedProduct();
    render();
    renderMap();
    $("btn-generate").addEventListener("click", generate);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "fb-ads.html"; });
  });
})();
