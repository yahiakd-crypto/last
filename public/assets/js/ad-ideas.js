/* PUNCHLINE — Ad Creative Ideas logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  let filter = "All";

  const FORMAT_TONE = {
    UGC: "green",
    "Static": "blue",
    Video: "amber",
    Carousel: "gray",
    "Image": "blue",
    Reels: "amber",
    "Story": "amber",
  };

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Ad Creative Ideas",
      "A bank of ad creative concepts — each with a hook, angle, format, platform and why it works. Click a card to copy its hook."
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
      ctx.innerHTML = `Creative ideas for <b>${PL.esc(D.product.name)}</b>${D.product.price ? " · " + PL.money(D.product.price) : ""}`;
    }
  }

  function formats() {
    const set = ["All"];
    (D.adIdeas || []).forEach((i) => { if (i.format && set.indexOf(i.format) < 0) set.push(i.format); });
    return set;
  }

  function renderFilters() {
    $("idea-filters").innerHTML = formats().map((f) => `
      <button class="btn btn-xs ${filter === f ? "btn-primary" : "btn-ghost"}" data-filter="${PL.esc(f)}">${PL.esc(f)}</button>`).join("");
    document.querySelectorAll("[data-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        filter = b.getAttribute("data-filter");
        renderFilters();
        renderIdeas();
      });
    });
  }

  function renderIdeas() {
    const list = (D.adIdeas || []).filter((i) => filter === "All" || i.format === filter);
    $("ideas-grid").innerHTML = list.length ? list.map((i, idx) => {
      const tone = FORMAT_TONE[i.format] || "gray";
      return `
      <div class="card rise flex flex-col" style="animation-delay:${Math.min(idx * 0.05, 0.4)}s" data-copy-hook="${PL.esc(i.hook || "")}" title="Click to copy hook">
        <div class="card-head">
          <span class="icon-tile green-soft"><i data-lucide="${i.icon || "lightbulb"}" style="width:17px;height:17px"></i></span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap"><div class="card-title">${PL.esc(i.title)}</div><span class="pill ${tone}">${PL.esc(i.format)}</span></div>
            <div class="card-sub">${PL.esc(i.platform || "")} · ${PL.esc(i.angle || "")}</div>
          </div>
          <span class="pill ${i.priority === "TEST FIRST" ? "amber" : "gray"}">${PL.esc(i.priority || "TEST")}</span>
        </div>
        <div class="mt-2 rounded-xl p-3.5 flex-1" style="background:#F7F8F7;border:1px solid var(--line)">
          <div class="label" style="margin:0 0 4px;color:#0FA05A">HOOK</div>
          <div class="text-[13px] font-semibold text-[#1C1C1E] leading-snug">${PL.esc(i.hook || "")}</div>
          <div class="muted text-[12px] mt-2 leading-relaxed">${PL.esc(i.why || "")}</div>
        </div>
        <div class="flex items-center justify-between mt-3 pt-3" style="border-top:1px solid var(--line)">
          <span class="muted text-[12px]">CTA: <b class="text-[#1C1C1E]">${PL.esc(i.cta || "")}</b></span>
          <button class="btn btn-ghost btn-xs" data-copy="${PL.esc(i.hook || "")}">${PL.icon("copy", 12)} Copy</button>
        </div>
      </div>`;
    }).join("") : `<div class="lg:col-span-3 card muted">Generate creative ideas to see them here.</div>`;
    if (window.lucide) lucide.createIcons();

    document.querySelectorAll("[data-copy]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        copyHook(b.getAttribute("data-copy"));
      });
    });
    document.querySelectorAll("[data-copy-hook]").forEach((c) => {
      c.addEventListener("click", () => copyHook(c.getAttribute("data-copy-hook")));
    });
  }

  function copyHook(text) {
    if (!text) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => PL.toast("Hook copied", "copy-check"));
    } else {
      PL.toast("Clipboard not available", "info");
    }
  }

  async function generate() {
    const btn = $("btn-generate");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Generating ideas…`;
    try {
      applySavedProduct();

      const res = await PL_API.ai("ad_ideas", {
        name: D.product.name,
        facts: D.product.facts,
        unknowns: D.product.unknowns,
        price: D.product.price,
        market: D.product.market,
      }, {
        prompt: `Generate 6 ad creative ideas for the product below. Respond with ONLY a single JSON object and NOTHING else — no markdown fences, no text before or after. The JSON must have EXACTLY one top-level key "ideas" that is an array of 6 objects, each with this exact shape:

{"title":"short idea name","angle":"the persuasion angle (Problem, Contrast, Objection, How-to, Proof, Social ...)","format":"UGC or Static or Video or Carousel","platform":"Meta / TikTok / Meta+TikTok","hook":"the first 3 seconds of the ad, written to be spoken or shown","why":"2 sentences on why this works for THIS product","cta":"short call to action","priority":"TEST FIRST or TEST or LOW PRIORITY","icon":"lucide icon name (e.g. lightbulb, video, image)"}

Rules: base hooks on the provided facts; never invent reviews or sales numbers; the 6 ideas must cover at least 3 different formats and 4 different angles; no medical claims.
Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, market: D.product.market, facts: D.product.facts, unknowns: D.product.unknowns })}`,
      });

      if (res.simulated) {
        PL.toast(res.reason || "[Simulated] Creative ideas from demo dataset", "flask-conical");
        return;
      }

      const parsed = PL.parseJSON(res.data);
      let merged = false;
      if (parsed && typeof parsed === "object") {
        const list = Array.isArray(parsed.ideas) ? parsed.ideas : (Array.isArray(parsed) ? parsed : null);
        if (list && list.length && list.every((i) => i && i.hook)) {
          D.adIdeas = list;
          merged = true;
        }
        if (merged) {
          filter = "All";
          renderFilters();
          renderIdeas();
          if (window.lucide) lucide.createIcons();
          const next = $("btn-next");
          if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
          PL.toast("6 creative ideas generated", "check-circle");
        } else {
          PL.toast("Model returned an unexpected format — showing demo dataset", "info");
        }
      } else {
        PL.toast("No ideas output — using demo dataset", "info");
      }
    } catch (err) {
      console.error(err);
      PL.toast("Generate failed — check the server / API key", "info");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 16)} Generate ideas`;
    }
  }

  PL.on(() => {
    renderHead();
    applySavedProduct();
    renderFilters();
    renderIdeas();
    $("btn-generate").addEventListener("click", generate);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "campaigns.html"; });
  });
})();
