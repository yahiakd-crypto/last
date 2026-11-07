/* PUNCHLINE — Personas logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  const AWARENESS_STAGES = ["Unaware", "Problem aware", "Solution aware", "Product aware", "Most aware"];

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Personas",
      "Who we write for, what they're really solving for, and why they'd say no. Personas are ranked by share — budget follows share."
    );
  }

  function renderTabs() {
    $("persona-tabs").innerHTML = D.personas.map((p) => `
      <button class="tab${p.id === "p1" ? " active" : ""}" data-tab="${p.id}" data-tabgroup="personas">
        <span class="rank-ring" style="width:24px;height:24px;background:#E9FBF1;color:#0FA05A;font-size:11px">${p.share != null ? p.share + "%" : "?"}</span>${PL.esc(p.name || "Persona")}
      </button>`).join("");
  }

  function list(items, tone) {
    const arr = Array.isArray(items) ? items : [];
    return arr.map((x) => `
      <div class="flex items-start gap-2.5">
        <span class="dot-status ${tone || "on"}" style="margin-top:6px"></span>
        <span class="text-[12.5px] text-[#3F3F46] leading-snug">${PL.esc(x)}</span>
      </div>`).join("");
  }

  function kv(label, value) {
    return `<div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
      <div class="label" style="margin-bottom:4px">${label}</div>
      <div class="text-[13px] text-[#3F3F46] leading-relaxed">${PL.esc(value || "—")}</div>
    </div>`;
  }

  function awarenessMeter(p) {
    const idx = AWARENESS_STAGES.indexOf(p.awareness);
    return `
      <div class="flex items-center justify-between mb-1">
        <div class="label" style="margin:0">Awareness level</div>
        <span class="pill green">${PL.esc(p.awareness || "—")}</span>
      </div>
      <div class="awareness-track">
        ${AWARENESS_STAGES.map((_, i) => `<div class="awareness-seg${i <= idx ? " on" : ""}"></div>`).join("")}
      </div>
      <div class="hint mt-1.5">Unaware → Problem aware → Solution aware → Product aware → Most aware</div>`;
  }

  function renderPanels() {
    $("persona-panels").innerHTML = D.personas.map((p) => `
      <div class="card mb-4 rise${p.id !== "p1" ? " hidden" : ""}" data-tabpanel="personas" data-panel="${p.id}">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div class="flex items-center gap-4">
            <span class="avatar" style="width:52px;height:52px;font-size:17px">${PL.esc(p.initials || "PA")}</span>
            <div>
              <div class="text-[17px] font-extrabold text-[#1C1C1E]">${PL.esc(p.name || "Persona")}</div>
              <div class="muted text-[13px]">${PL.esc(p.tagline || "")}</div>
            </div>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <span class="pill green"><span class="dot"></span>${p.share != null ? p.share + "% of audience" : "—"}</span>
            <span class="tag">Age: ${PL.esc(p.age || "—")}</span>
            <span class="tag">${PL.esc(p.gender || "—")}</span>
            <span class="tag">${PL.esc(p.location || "—")}</span>
            <span class="tag">Price: ${PL.esc(p.price || "—")}</span>
          </div>
        </div>
        <div class="w-full mb-5"><div class="bar"><i style="width:${(p.share != null ? p.share : 0) * 3}%"></i></div></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${kv("Primary buyer", p.name)}
          ${kv("Buying motivation", p.motivation)}
          ${kv("Desired outcome", p.outcome)}
          ${kv("Lifestyle", p.lifestyle)}
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
            <div class="label" style="color:#0FA05A">Interests</div><div class="flex flex-col gap-2.5">${list(p.interests, "on")}</div>
          </div>
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
            ${awarenessMeter(p)}
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
            <div class="label" style="color:#0FA05A">Main pain points</div><div class="flex flex-col gap-2.5">${list(p.pains, "on")}</div>
          </div>
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
            <div class="label" style="color:#0FA05A">Desires</div><div class="flex flex-col gap-2.5">${list(p.desires, "on")}</div>
          </div>
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
            <div class="label" style="color:#D98A12">Objections</div><div class="flex flex-col gap-2.5">${list(p.objections, "warn")}</div>
          </div>
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
            <div class="label" style="color:#D98A12">Why they might hesitate</div><div class="flex flex-col gap-2.5">${list(p.hesitate, "warn")}</div>
          </div>
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line)">
            <div class="label" style="color:#D98A12">What triggers them to buy</div><div class="flex flex-col gap-2.5">${list(p.triggers, "warn")}</div>
          </div>
          <div class="rounded-xl p-4" style="background:#E9FBF1">
            <div class="label" style="color:#0FA05A">Proof that lands</div><div class="flex flex-col gap-2.5">${list(p.proof, "on")}</div>
          </div>
        </div>
        <div class="rounded-xl p-4 mt-4" style="background:#F7F8F7">
          <div class="label">Where to reach them</div>
          <div class="text-[13px] text-[#3F3F46] leading-relaxed">${PL.esc(p.channel || "—")}</div>
        </div>
      </div>`).join("");
  }

  function count(items) {
    const map = {};
    items.forEach((x) => { map[x] = (map[x] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }

  function renderEngine() {
    const all = (k) => D.personas.flatMap((p) => (p[k] || []).filter(Boolean));
    const mk = (key) => count(all(key)).map(([text, n]) => `
      <div class="flex items-center gap-2.5 py-1">
        <span class="bar thin" style="max-width:34px">${n > 1 ? `<i style="width:${(n / 5) * 100}%"></i>` : ""}</span>
        <span class="text-[12.5px] text-[#3F3F46] leading-snug flex-1">${PL.esc(text)}</span>
        ${n > 1 ? `<span class="text-[11px] font-bold text-[#8A8A92]">×${n}</span>` : ""}
      </div>`).join("");
    $("engine-pains").innerHTML = mk("pains") || '<div class="muted">—</div>';
    $("engine-desires").innerHTML = mk("desires") || '<div class="muted">—</div>';
    $("engine-objections").innerHTML = mk("objections") || '<div class="muted">—</div>';
    $("engine-triggers").innerHTML = mk("triggers") || '<div class="muted">—</div>';
  }

  /* ---------- Persona analytics charts ---------- */
  const CHART_COLORS = ["#2ECC71", "#27AE60", "#5BD98E", "#0FA05A", "#A8F0C9"];
  let chartRefs = [];

  function ageBucket(p) {
    const m = (p.age || "").match(/(\d+)\s*[–-]\s*(\d+)/);
    const mid = m ? (Number(m[1]) + Number(m[2])) / 2 : 30;
    if (mid <= 25) return "18–25";
    if (mid <= 30) return "26–30";
    if (mid <= 35) return "31–35";
    if (mid <= 40) return "36–40";
    if (mid <= 45) return "41–45";
    return "46+";
  }

  const CH_TOOLTIP = {
    backgroundColor: "#191A1D", titleColor: "#fff", bodyColor: "#D8DAD8",
    padding: 12, cornerRadius: 10, displayColors: false,
  };

  function renderCharts() {
    if (!window.Chart) return;
    chartRefs.forEach((c) => { try { c.destroy(); } catch (e) { /* noop */ } });
    chartRefs = [];

    const names = D.personas.map((p) => p.name);
    const shares = D.personas.map((p) => p.share || 0);

    chartRefs.push(CH.bar("chart-share", names, [
      { label: "Share %", data: shares, color: CHART_COLORS[0] },
    ]));

    const buckets = ["18–25", "26–30", "31–35", "36–40", "41–45", "46+"];
    const hist = buckets.map((b) => D.personas.filter((p) => ageBucket(p) === b).length);
    chartRefs.push(CH.bar("chart-age", buckets, [
      { label: "Personas", data: hist, color: CHART_COLORS[1] },
    ]));

    const aCtx = document.getElementById("chart-awareness");
    if (aCtx) {
      chartRefs.push(new Chart(aCtx, {
        type: "bar",
        data: {
          labels: AWARENESS_STAGES,
          datasets: D.personas.map((p, i) => ({
            label: p.name,
            data: AWARENESS_STAGES.map((s) => (s === p.awareness ? 1 : 0)),
            backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
            borderRadius: 3,
            barPercentage: 0.7,
            stack: "awareness",
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 700, easing: "easeOutQuart" },
          plugins: {
            legend: { display: true, position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", padding: 14, color: "#191A1D", font: { weight: 600, size: 10.5 }, boxWidth: 8 } },
            tooltip: Object.assign({}, CH_TOOLTIP, { callbacks: { label: (c) => { const p = D.personas[c.datasetIndex]; return p ? p.name : ""; } } }),
          },
          scales: {
            x: { stacked: true, grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 } } },
            y: { stacked: true, beginAtZero: true, ticks: { stepSize: 1, maxTicksLimit: 4 }, grid: { color: "rgba(0,0,0,0.05)" }, border: { display: false } },
          },
        },
      }));
    }

    const dCtx = document.getElementById("chart-composition");
    if (dCtx) {
      chartRefs.push(new Chart(dCtx, {
        type: "doughnut",
        data: {
          labels: names,
          datasets: [{ data: shares, backgroundColor: CHART_COLORS, borderWidth: 0, hoverOffset: 4 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          animation: { duration: 700, easing: "easeOutQuart" },
          plugins: {
            legend: { display: true, position: "bottom", labels: { usePointStyle: true, pointStyle: "circle", padding: 14, color: "#191A1D", font: { weight: 600, size: 10.5 }, boxWidth: 8 } },
            tooltip: Object.assign({}, CH_TOOLTIP, { callbacks: { label: (c) => " " + c.label + " — " + c.parsed + "%" } }),
          },
        },
      }));
    }
  }

  function applySavedProduct() {
    const saved = PL.loadProduct();
    if (!saved || !saved.product || !saved.product.name) return;
    D.product = Object.assign({}, D.product, saved.product);
    D.product.facts = saved.facts && saved.facts.length ? saved.facts : D.product.facts;
    D.product.unknowns = saved.unknowns && saved.unknowns.length ? saved.unknowns : D.product.unknowns;
  }

  async function generate() {
    const btn = $("btn-generate");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Generating…`;
    try {
      applySavedProduct();

      const res = await PL_API.ai("personas", {
        name: D.product.name,
        facts: D.product.facts,
        unknowns: D.product.unknowns,
        price: D.product.price,
        market: D.product.market,
      }, {
        prompt: `Build 3 buyer personas for this product. Return ONLY valid JSON, no prose, with this exact structure:
  {"personas":[{"id":"p1","name":"display name","initials":"AB","share":34,"tagline":"one-line summary","age":"25-35","gender":"male/female/mixed","location":"market + where they live","interests":["3-5"],"lifestyle":"short description","motivation":"their buying motivation","outcome":"their desired outcome","awareness":"one of: Unaware, Problem aware, Solution aware, Product aware, Most aware","price":"price sensitivity","pains":["3-5"],"desires":["3-5"],"objections":["2-4"],"hesitate":["2-4","why they might hesitate"],"triggers":["2-4","what triggers them to buy"],"proof":["2-4"],"channel":"where to reach them"}]}

  Rules:
  - shares must sum to ~100, ranked descending.
  - awareness = the buyer's stage on the ladder: Unaware → Problem aware → Solution aware → Product aware → Most aware.
  - pains/desires/objections/triggers/hesitate are short phrases this buyer would actually say.
  - Base everything on the provided facts. Mark anything not known as UNKNOWN.
  Product: ${JSON.stringify({ name: D.product.name, price: D.product.price, market: D.product.market, facts: D.product.facts, unknowns: D.product.unknowns })}`,
      });

      const parsed = PL.parseJSON(res.data);
      const personas = parsed && Array.isArray(parsed.personas) && parsed.personas.length ? parsed.personas : null;
      if (personas) {
        // Normalize so a partial AI response can never crash rendering.
        D.personas = personas.map((p, i) => ({
          id: p.id || ("p" + (i + 1)),
          name: p.name || ("Persona " + (i + 1)),
          initials: p.initials || ((p.name || "P").slice(0, 2).toUpperCase()),
          share: Number(p.share) || 0,
          tagline: p.tagline || "",
          age: p.age || "—",
          household: p.household || "—",
          gender: p.gender || "Mixed",
          location: p.location || D.product.market || "—",
          interests: Array.isArray(p.interests) ? p.interests : [],
          lifestyle: p.lifestyle || "",
          motivation: p.motivation || "",
          outcome: p.outcome || "",
          awareness: AWARENESS_STAGES.includes(p.awareness) ? p.awareness : "Problem aware",
          price: p.price || "—",
          pains: Array.isArray(p.pains) ? p.pains : [],
          desires: Array.isArray(p.desires) ? p.desires : [],
          objections: Array.isArray(p.objections) ? p.objections : [],
          hesitate: Array.isArray(p.hesitate) ? p.hesitate : (Array.isArray(p.objections) ? p.objections : []),
          triggers: Array.isArray(p.triggers) ? p.triggers : [],
          proof: Array.isArray(p.proof) ? p.proof : [],
          channel: p.channel || "—",
        }));
        renderTabs();
        renderPanels();
        renderEngine();
        renderCharts();
        const next = $("btn-next");
        if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
        PL.toast("Personas generated", "check-circle");
      } else {
        PL.toast(res.simulated ? "[Simulated] Personas from demo dataset" : "No persona output — using demo dataset", "info");
      }
    } catch (err) {
      console.error(err);
      PL.toast("Generate failed — check the server / API key", "info");
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 16)} Generate personas`;
    }
  }

  PL.on(() => {
    renderHead();
    renderTabs();
    renderPanels();
    renderEngine();
    renderCharts();
    $("btn-generate").addEventListener("click", generate);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "strategy.html"; });
  });
})();
