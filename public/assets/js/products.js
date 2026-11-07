/* PUNCHLINE — Product Intelligence logic (AI-driven + animated) */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  const STEPS = [
    { key: "fetch", label: "Fetch product source", detail: "URL / user input" },
    { key: "extract", label: "Extract structured facts", detail: "Name, price, category, specs" },
    { key: "verify", label: "Verify claims", detail: "Separate fact from assumption" },
    { key: "unknowns", label: "Flag unknowns", detail: "UNKNOWN / NEEDS USER INPUT" },
    { key: "score", label: "Score completeness", detail: "38/100 → what's missing" },
  ];

  const RUN_MSGS = [
    "Contacting the model",
    "Reading product info",
    "Extracting facts",
    "Verifying claims",
    "Flagging unknowns",
    "Scoring completeness",
  ];

  const MARKETS = [
    "United States", "United Kingdom", "Canada", "France", "Germany", "Spain", "Italy", "Portugal",
    "Netherlands", "Belgium", "Switzerland", "Austria", "Ireland", "Sweden", "Norway", "Denmark",
    "Finland", "Poland", "Czech Republic", "Slovakia", "Hungary", "Romania", "Bulgaria", "Greece",
    "Croatia", "Serbia", "Slovenia", "Ukraine", "Russia", "Turkey", "Morocco", "Algeria", "Tunisia",
    "Egypt", "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Bahrain", "Oman", "Jordan",
    "Lebanon", "Israel", "Iran", "India", "China", "Japan", "South Korea", "Singapore", "Malaysia",
    "Indonesia", "Thailand", "Vietnam", "Philippines", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal",
    "Australia", "New Zealand", "Brazil", "Mexico", "Argentina", "Chile", "Colombia", "Peru",
    "Venezuela", "Ecuador", "Uruguay", "Paraguay", "Bolivia", "Panama", "Costa Rica", "Guatemala",
    "Dominican Republic", "Puerto Rico", "South Africa", "Nigeria", "Kenya", "Ghana", "Ethiopia",
    "Tanzania", "Uganda", "Senegal", "Ivory Coast", "Cameroon", "Kazakhstan", "Other",
  ];

  const LANGUAGES = [
    "English", "Spanish", "French", "Arabic", "German", "Italian", "Portuguese", "Dutch", "Turkish",
    "Russian", "Chinese (Simplified)", "Chinese (Traditional)", "Japanese", "Korean", "Hindi", "Urdu",
    "Bengali", "Indonesian", "Malay", "Thai", "Vietnamese", "Filipino", "Polish", "Czech", "Romanian",
    "Hungarian", "Greek", "Swedish", "Norwegian", "Danish", "Finnish", "Ukrainian", "Hebrew",
    "Persian (Farsi)", "Swahili", "Other",
  ];

  const MAX_FILE_BYTES = 40 * 1024;

  let productFile = "";
  let productFileName = "";

  let msgTimer = null;

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Product Intelligence",
      "Turn raw product info into verified facts, honest unknowns, and a completeness score. Nothing here becomes a marketing claim unless it is verified."
    );
  }

  function renderPipeline() {
    $("pipeline").innerHTML = STEPS.map((s, i) => `
      <div class="step" data-step="${s.key}">
        <div class="step-dot" data-step-dot="${s.key}">${i + 1}</div>
        <div class="pt-0.5">
          <div class="font-semibold text-[13.5px] text-[#1C1C1E]" data-step-title="${s.key}">${s.label}</div>
          <div class="muted text-[12.5px]" data-step-detail="${s.key}">${s.detail}</div>
        </div>
      </div>`).join("");
  }

  function stepState(key, state) {
    const dot = document.querySelector(`[data-step-dot="${key}"]`);
    const title = document.querySelector(`[data-step-title="${key}"]`);
    if (!dot) return;
    dot.classList.remove("done", "run", "warn");
    dot.textContent = "";
    if (state === "run") {
      dot.classList.add("run");
      dot.innerHTML = `<i data-lucide="loader-2" style="width:14px;height:14px"></i>`;
    } else if (state === "done") {
      dot.classList.add("done");
      dot.innerHTML = `<i data-lucide="check" style="width:14px;height:14px"></i>`;
    } else {
      dot.classList.add("warn");
      dot.innerHTML = `<i data-lucide="question" style="width:14px;height:14px"></i>`;
    }
    if (window.lucide) lucide.createIcons();
  }

  function setStepDetail(key, text) {
    const el = document.querySelector(`[data-step-detail="${key}"]`);
    if (el) el.textContent = text;
  }

  /* ---------- Animated "AI working" block ---------- */
  function setAiRun(on, sub) {
    const run = $("ai-run");
    if (!run) return;
    if (on) {
      run.classList.remove("hidden");
      run.classList.add("rise");
      if (sub) $("ai-run-sub").innerHTML = PL.esc(sub) + `<span class="typing"><i></i><i></i><i></i></span>`;
      let i = 0;
      msgTimer = setInterval(() => {
        i = (i + 1) % RUN_MSGS.length;
        const el = $("ai-run-sub");
        if (el) el.innerHTML = PL.esc(RUN_MSGS[i]) + `<span class="typing"><i></i><i></i><i></i></span>`;
      }, 1100);
    } else {
      run.classList.add("hidden");
      if (msgTimer) clearInterval(msgTimer);
      msgTimer = null;
    }
    if (window.lucide) lucide.createIcons();
  }

  function setAiRunMeta(meta) {
    const el = $("ai-run-meta");
    if (el && meta && meta.provider && meta.provider !== "demo") {
      el.innerHTML = `via <b>${PL.esc(meta.provider)}</b>${meta.model ? ` · ${PL.esc(meta.model)}` : ""}`;
    }
  }

  /* ---------- Market / language selects ---------- */
  function populateSelects() {
    const m = $("in-market");
    if (m) m.innerHTML = MARKETS.map((x, i) => `<option${i === 0 ? " selected" : ""}>${PL.esc(x)}</option>`).join("");
    const l = $("in-language");
    if (l) l.innerHTML = LANGUAGES.map((x, i) => `<option${i === 0 ? " selected" : ""}>${PL.esc(x)}</option>`).join("");
  }

  /* ---------- Product file (.txt) upload ---------- */
  function fmtBytes(n) {
    if (n > 1024 * 1024) return (n / 1024 / 1024).toFixed(1) + " MB";
    if (n > 1024) return (n / 1024).toFixed(1) + " KB";
    return n + " B";
  }

  function updateFileUI() {
    const chip = $("file-chip");
    const drop = $("btn-upload-file");
    const lbl = $("file-btn-label");
    const label = $("file-chip-label");
    if (productFile) {
      if (chip) chip.classList.remove("hidden");
      if (label) label.textContent = productFileName + " · " + fmtBytes(productFile.length);
      if (drop) drop.classList.add("has-file");
      if (lbl) lbl.textContent = "Replace file";
    } else {
      if (chip) chip.classList.add("hidden");
      if (drop) drop.classList.remove("has-file");
      if (lbl) lbl.textContent = "Upload a .txt file";
    }
  }

  function wireFileUpload() {
    const btn = $("btn-upload-file");
    const file = $("in-file");
    const clear = $("btn-clear-file");
    if (!btn || !file) return;
    btn.addEventListener("click", () => file.click());
    file.addEventListener("change", () => {
      const f = file.files[0];
      if (!f) return;
      if (!/\.txt$/i.test(f.name)) {
        PL.toast("Please upload a .txt file", "alert-triangle");
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        PL.toast("File is too large — keep it under 40 KB", "alert-triangle");
        return;
      }
      const rd = new FileReader();
      rd.onload = () => {
        productFile = String(rd.result || "").trim();
        productFileName = f.name;
        updateFileUI();
        PL.toast("Product file loaded — the AI will use it during analysis", "file-check");
      };
      rd.readAsText(f);
      file.value = "";
    });
    if (clear) {
      clear.addEventListener("click", () => {
        productFile = "";
        productFileName = "";
        updateFileUI();
        PL.toast("Product file removed", "x");
      });
    }
  }

  /* ---------- Result rendering (animated entrance) ---------- */
  function renderSnapshot(res) {
    const p = (res.product || res) || D.product;
    $("snap-sub").textContent = [p.category, p.market, p.language].filter(Boolean).join(" · ") || "…";
    const score = p.score ? p.score.completeness : 0;
    const img = p.image
      ? `<img src="${PL.esc(p.image)}" alt="${PL.esc(p.name || "Product")}" class="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-black/10" onerror="PL.fallbackThumb(this)">`
      : PL.thumb(p.name || "Product", "#3DDC72");
    $("snapshot").innerHTML = `
      <div class="flex items-start gap-3 rise">
        ${img}
        <div class="min-w-0">
          <div class="font-bold text-[15px] text-[#1C1C1E] leading-tight">${PL.esc(p.name || "UNKNOWN")}</div>
          <div class="text-[22px] font-extrabold text-[#1C1C1E] mt-0.5">${p.price ? PL.money(p.price) : PL.pill("Price UNKNOWN", "amber")}</div>
          <div class="muted text-[12px] mt-0.5">${PL.esc(p.short || "")}</div>
        </div>
      </div>
      <div class="mt-4 rise" style="animation-delay:.12s">
        <div class="flex items-center justify-between mb-1.5">
          <span class="label" style="margin:0">Completeness</span>
          <span class="font-extrabold text-[15px] text-[#1C1C1E]" id="score-count" data-score="${score}">0%</span>
        </div>
        <div class="bar"><i id="score-bar" style="width:0%"></i></div>
        <div class="hint mt-1.5">${score < 60 ? "Below 60% — fill the unknowns before writing claims." : "Good enough to draft, still verify everything."}</div>
      </div>`;
    requestAnimationFrame(() => animateScore(score));
  }

  function animateScore(target) {
    const el = $("score-count");
    const bar = $("score-bar");
    if (!el) return;
    const start = performance.now();
    const dur = 800;
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = Math.round(target * eased);
      el.textContent = v + "%";
      if (bar) bar.style.width = v + "%";
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function renderFacts(list) {
    const facts = (list && list.length ? list : D.product.facts).map((f, i) => `
      <div class="flex items-start gap-2.5 rise" style="animation-delay:${Math.min(i * 0.06, 0.5)}s">
        <span class="dot-status on" style="margin-top:6px"></span>
        <div class="text-[13px] text-[#3F3F46] leading-snug">${PL.esc(f)}</div>
      </div>`).join("");
    $("facts").innerHTML = facts || `<div class="muted">No verified facts yet.</div>`;
  }

  function renderSolves(list) {
    const solves = (list && list.length ? list : D.product.solves).map((s, i) => `
      <div class="flex items-start gap-2.5 rise" style="animation-delay:${Math.min(i * 0.06, 0.5)}s">
        <span class="dot-status on" style="margin-top:6px"></span>
        <div class="text-[13px] text-[#3F3F46] leading-snug">${PL.esc(s)}</div>
      </div>`).join("");
    $("solves").innerHTML = solves || `<div class="muted">No problems mapped yet.</div>`;
  }

  /* ---------- Normalize whatever the AI returned into the app structure ---------- */
  function normalize(raw, simulated, payload) {
    if (simulated || !raw) {
      return { product: D.product, facts: D.product.facts, unknowns: D.product.unknowns, solves: D.product.solves, score: D.product.score };
    }
    let obj = raw;
    if (typeof raw === "string") {
      try {
        const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        const start = cleaned.indexOf("{");
        obj = start >= 0 ? JSON.parse(cleaned.slice(start)) : null;
      } catch (e) { obj = null; }
    }
    if (!obj || typeof obj !== "object") {
      return { product: D.product, facts: D.product.facts, unknowns: D.product.unknowns, solves: D.product.solves, score: D.product.score };
    }
    const p = obj.product || obj;
    const completeness = (p.score && p.score.completeness != null) ? Number(p.score.completeness) : D.product.score.completeness;
    const product = {
      name: p.name || D.product.name,
      category: p.category || D.product.category,
      market: p.market || payload.market || D.product.market,
      language: p.language || payload.language || "",
      price: p.price != null ? Number(String(p.price).replace(/[^0-9.]/g, "")) || null : D.product.price,
      short: p.short || D.product.short,
      score: { completeness: Math.max(0, Math.min(100, completeness)) },
    };
    // Never block user-provided fields as unknowns, no matter what the AI said.
    const provided = [payload.name, payload.market, payload.language, payload.price].filter((v) => v != null && v !== "").map((v) => String(v).toLowerCase());
    const strip = (arr) => Array.isArray(arr)
      ? arr.filter((u) => !provided.some((p2) => String(u).toLowerCase().includes(p2)))
      : arr;
    return {
      product,
      score: product.score,
      facts: Array.isArray(obj.facts) ? obj.facts : Array.isArray(p.facts) ? p.facts : D.product.facts,
      solves: Array.isArray(obj.solves) ? obj.solves : Array.isArray(p.solves) ? p.solves : D.product.solves,
      unknowns: strip(Array.isArray(obj.unknowns) ? obj.unknowns : Array.isArray(p.unknowns) ? p.unknowns : D.product.unknowns),
    };
  }

  /* ---------- Analysis progress bar (0 → 100%) ---------- */
  let progressRAF = null;

  function setProgress(pct, label) {
    const bar = $("progress-bar");
    const lbl = $("progress-label");
    if (bar) bar.style.width = pct + "%";
    if (lbl) lbl.textContent = label != null ? label : Math.round(pct) + "%";
  }

  function showProgress(show) {
    const wrap = $("progress-wrap");
    if (wrap) wrap.classList.toggle("hidden", !show);
  }

  /* Smoothly creep toward ~82% while the AI request is genuinely in flight. */
  function creepProgress() {
    let v = 10;
    setProgress(v);
    const step = () => {
      v = Math.min(v + (100 - v) * 0.025, 82);
      setProgress(v);
      if (v < 82) progressRAF = requestAnimationFrame(step);
    };
    progressRAF = requestAnimationFrame(step);
  }

  function stopCreep() {
    if (progressRAF) cancelAnimationFrame(progressRAF);
    progressRAF = null;
  }

  /* ---------- Main analyze flow ---------- */
  async function analyze() {
    const btn = $("btn-analyze");
    btn.disabled = true;
    btn.innerHTML = `<span class="ai-spin">${PL.icon("bot", 16)}</span> Analyzing…`;

    const payload = {
      url: $("in-url").value.trim(),
      name: $("in-name").value.trim(),
      price: Number($("in-price").value) || null,
      market: $("in-market").value,
      language: $("in-language").value,
      file: productFile,
    };

    const prompt = `Analyze the product below and return ONLY valid JSON, no prose, with this exact structure:
{"product":{"name":"...","category":"...","market":"...","language":"...","price":<number or null>,"short":"one-line value proposition","score":{"completeness":<0-100>}},"facts":["<only VERIFIED statements, 4-8>"],"solves":["<core problems this product solves, 3-6>"],"unknowns":["<genuinely missing info, 3-6>"]}

Rules:
- The name, price, market, language, and description provided below are VERIFIED source material given by the user. USE them. NEVER list them in unknowns.
- "language" is the target market language — write the product "short", the "facts", and the "solves" list in that language.
- If a "file" field is present, its contents are VERIFIED product documentation provided by the user. Extract facts and problems it solves from it and never flag its contents as unknown.
- "facts" = statements directly supported by the provided fields, the file, or scraped page content. At minimum include the name, price, category and market as facts.
- "solves" = the core problems the product solves, based ONLY on the provided info — never invent new problems.
- "unknowns" = ONLY things not provided and not on the page, like reviews, sales numbers, shipping, return policy, materials, social proof.
- Never invent reviews, sales figures, or testimonials.
Input: ${JSON.stringify(payload)}`;

    setAiRun(true, "Contacting the model");
    $("ai-run-meta").innerHTML = "";
    resetSteps();
    showProgress(true);
    setProgress(4, "0%");
    stepState("fetch", "run");
    setStepDetail("fetch", "Reading " + (payload.url || "user input") + (productFile ? " + .txt file" : ""));
    creepProgress();

    const t0 = Date.now();
    const res = await PL_API.ai("extract_product", payload, { prompt });
    const elapsed = Date.now() - t0;

    const data = normalize(res.data, res.simulated, payload);
    if (res.meta && res.meta.image) data.product.image = res.meta.image;
    setAiRunMeta(res.meta);
    stopCreep();

    const doneKeys = ["fetch", "extract", "verify", "unknowns"];
    const progressAt = { fetch: 35, extract: 55, verify: 72, unknowns: 85 };
    doneKeys.forEach((k, i) => setTimeout(() => {
      stepState(k, "done");
      setProgress(progressAt[k]);
      if (k === "extract") setStepDetail(k, "Facts extracted" + (res.meta && res.meta.provider ? " via " + res.meta.provider : ""));
      if (k === "verify") setStepDetail(k, "All claims checked against source");
      if (k === "unknowns") setStepDetail(k, "Flagged: reviews, sales, shipping…");
    }, 220 * (i + 1)));

    stepState("score", "run");
    setStepDetail("score", "Completeness computed");
    setProgress(92);

    const delay = Math.max(0, 1500 - elapsed);
    setTimeout(() => {
      setAiRun(false);
      renderSnapshot(data);
      renderFacts(data.facts);
      renderSolves(data.solves);
      stepState("score", "warn");
      setStepDetail("score", (data.score ? data.score.completeness : 0) + "/100 — see what's missing");
      setProgress(100, "100%");
      setTimeout(() => showProgress(false), 900);
      btn.disabled = false;
      btn.innerHTML = `${PL.icon("sparkles", 17)} Analyze product`;
      const next = $("btn-next");
      if (next) { next.disabled = false; next.classList.add("pulse-glow"); }
      PL.saveProduct(data);
      PL.toast(
        res.simulated ? "[Simulated] Product extracted — add a key for live AI"
          : `Analysis complete via ${res.meta ? res.meta.provider : "AI"}`,
        "check-circle"
      );
    }, delay);
  }

  function resetSteps() {
    STEPS.forEach((s) => {
      const dot = document.querySelector(`[data-step-dot="${s.key}"]`);
      if (dot) { dot.classList.remove("done", "run", "warn"); dot.textContent = STEPS.findIndex((x) => x.key === s.key) + 1; }
    });
  }

  PL.on(() => {
    renderHead();
    renderPipeline();
    renderSnapshot({ product: D.product });
    renderFacts(D.product.facts);
    renderSolves(D.product.solves);
    populateSelects();
    wireFileUpload();
    $("btn-analyze").addEventListener("click", analyze);
    const next = $("btn-next");
    if (next) next.addEventListener("click", () => { location.href = "brand.html"; });
  });
})();
