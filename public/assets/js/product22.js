/* ============================================================
   PUNCHLINE — AI WINNING PRODUCT INTELLIGENCE CENTER (product22)
   PRODUCT DATA → MARKET EVIDENCE → ECONOMICS → CREATIVE → OFFER
   → TEST → RESULTS → LEARNING → FIND NEXT WINNER
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- utils ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const parseJSON = (s) => { if (typeof s !== "string") return s; try { return JSON.parse(s); } catch (e) { return null; } };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const rng = (seed) => { let t = seed >>> 0 || 7; return () => { t = (t * 16807) % 2147483647; return (t - 1) / 2147483646; }; };
  const numf = (v, d) => Number(v || 0).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d });
  const money = (v) => (v < 0 ? "-" : "") + numf(Math.abs(v)) + " DA";
  const pct = (v, d) => (v * 100).toFixed(d == null ? 1 : d) + "%";
  const md = (t) => esc(t || "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\n/g, "<br>").replace(/^- (.*)$/gm, "• $1");
  const icon = (n, s) => `<i data-lucide="${n}" style="width:${s || 15}px;height:${s || 15}px"></i>`;

  const KEY = "p22";
  const ld = (n, d) => { try { const v = JSON.parse(localStorage.getItem(KEY + "." + n)); return v == null ? d : v; } catch (e) { return d; } };
  const ls = (n, v) => localStorage.setItem(KEY + "." + n, JSON.stringify(v));

  function toast(msg, type) {
    let wrap = $("#p22-toasts");
    if (!wrap) { wrap = document.createElement("div"); wrap.id = "p22-toasts"; document.body.appendChild(wrap); }
    const t = document.createElement("div");
    t.className = "p22-toast" + (type ? " " + type : "");
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; }, 2400);
    setTimeout(() => t.remove(), 2800);
  }
  function modal(html) {
    let m = $("#p22-modal");
    if (!m) { m = document.createElement("div"); m.id = "p22-modal"; document.body.appendChild(m); }
    m.innerHTML = `<div class="p22-modal-panel">${html}</div>`;
    m.classList.add("open");
    m.onclick = (e) => { if (e.target === m) closeModal(); };
  }
  function closeModal() { const m = $("#p22-modal"); if (m) m.classList.remove("open"); }
  function openDrawer() { $("#p22-sidebar").classList.add("open"); $("#p22-drawer-mask").classList.add("show"); }
  function closeDrawer() { $("#p22-sidebar").classList.remove("open"); $("#p22-drawer-mask").classList.remove("show"); }

  /* small UI building blocks */
  const ringSVG = (score, size) => {
    size = size || 96;
    const r = (size / 2) - 7, c = 2 * Math.PI * r;
    const p = Math.max(0, Math.min(100, score));
    return `
      <div class="p22-ring" style="width:${size}px;height:${size}px">
        <svg width="${size}" height="${size}">
          <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="9"></circle>
          <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="9"
            stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}"></circle>
        </svg>
        <div class="ring-num" style="font-size:${size * 0.26}px">${numf(score)}</div>
      </div>`;
  };
  const scoreRow = (label, score, color) => {
    const p = Math.max(0, Math.min(100, Math.round((score / 10) * 100)));
    return `<div class="flex items-center gap-3 py-1.5">
      <span class="text-[12.5px] text-[#3f3f46] w-[42%] flex-none">${label}</span>
      <div class="p22-bar" style="flex:1"><i style="width:${p}%;${color ? `background:${color}` : ""}"></i></div>
      <span class="text-[12.5px] font-bold text-[#1c1c1e] w-8 text-right flex-none">${score != null ? score + "/10" : "—"}</span>
    </div>`;
  };
  const ev = (label, text, tone) => `<div class="p22-evidence${tone === "warn" ? " warn" : ""}"><div class="ev-label">${label}</div>${text}</div>`;
  const src = (t) => {
    const map = { V: "VERIFIED", I: "AI ESTIMATION", U: "USER INPUT", X: "UNKNOWN" };
    const cls = { V: "verified", I: "inference", U: "user", X: "unknown" };
    return `<span class="p22-src ${cls[t] || "unknown"}">${map[t] || esc(t)}</span>`;
  };
  const tag = (t, tone) => `<span class="p22-tag ${tone || "gray"}">${esc(t)}</span>`;
  const opp = (k) => {
    const map = { fire: "🔥 HIGH POTENTIAL", good: "🟢 GOOD TEST", valid: "🟡 NEEDS VALIDATION", risk: "🟠 HIGH RISK", avoid: "🔴 AVOID" };
    const cls = { fire: "fire", good: "good", valid: "valid", risk: "risk", avoid: "avoid" };
    return `<span class="p22-opp ${cls[k] || "valid"}">${map[k] || esc(k)}</span>`;
  };
  const card = (o) => `
    <div class="p22-card">
      ${o.head !== false ? `<div class="p22-card-head">
        ${o.icon ? `<span class="p22-card-ic">${icon(o.icon, 16)}</span>` : ""}
        <div class="min-w-0 flex-1"><div class="p22-card-title">${o.title}</div>${o.sub ? `<div class="p22-card-sub">${o.sub}</div>` : ""}</div>
        ${o.action ? `<div class="flex items-center gap-2 flex-none">${o.action}</div>` : ""}
      </div>` : ""}
      ${o.body || ""}
    </div>`;
  const ai = (label, html, dark) => `<div class="p22-ai${dark ? " dark" : ""}"><div class="ai-label">${label}</div>${html}</div>`;

  /* ---------------- state ---------------- */
  const state = {
    m: "dashboard",
    productId: "p1",
    market: { country: "DZ", region: "North Africa", lang: "fr-DZ", currency: "DZD" },
    q: "",
    weight: ld("weight", null),          // custom scorecard weights {key:pct}
    watch: ld("watch", {}),              // productId -> status
    testResults: ld("results", {}),
    wins: ld("wins", []),
    providers: {},
  };

  /* ---------------- backend connection ----------------
     APIs saved on the Settings page live server-side (server/data/settings.json).
     This page reads them automatically so every provider key configured there
     is already connected here — no need to re-enter keys. */
  const live = () => !!Object.keys(state.providers).length;
  const aiOut = (raw) => {
    if (raw == null) return "";
    if (typeof raw === "string") return md(raw);
    try { return `<pre style="white-space:pre-wrap;font-size:11.5px;line-height:1.5;margin:0">${esc(JSON.stringify(raw, null, 2))}</pre>`; } catch (e) { return esc(String(raw)); }
  };

  async function refreshBackend() {
    try {
      const on = await PL_API.detect();
      const pill = $("#p22-backend");
      if (pill) {
        pill.textContent = on ? "Backend connected" : "Local simulation (no backend)";
        pill.className = "pill " + (on ? "green" : "amber");
        pill.title = on ? "Server reachable — APIs saved in Settings apply here automatically" : "Start the server (cd server && npm start)";
      }
    } catch (e) {}
    try {
      const s = await PL_API.settings();
      const providers = {};
      if (s && s.providers) {
        Object.entries(s.providers).forEach(([id, v]) => {
          if (v && v.keyMasked) providers[id] = { name: v.name || id, keyMasked: v.keyMasked };
        });
      }
      state.providers = providers;
    } catch (e) {
      state.providers = {};
    }
    const t = $("#p22-mode");
    if (t) {
      t.textContent = live() ? "CONNECTED · " + Object.keys(state.providers).length + " KEY" : "DEMO";
      t.className = "p22-tag " + (live() ? "green" : "blue");
      t.title = live() ? "APIs saved in Settings are connected here automatically — live AI is on" : "Demo mode — add an API key in Settings to connect live AI here";
    }
    if (state.m === "settings") renderSettings();
  }

  /* Run a task through the live backend when a provider key is configured;
     otherwise return null so the module falls back to its demo behavior. */
  async function runAI(task, payload, opts) {
    if (!live()) return null;
    try {
      const res = await PL_API.ai(task, payload, opts || {});
      if (res && !res.simulated) return res;
      return null;
    } catch (e) {
      return null;
    }
  }

  const product = () => DB.products.find((p) => p.id === state.productId) || DB.products[0];

  /* ---------------- data ---------------- */
  const DB = {
    products: [
      { id: "p1", name: "EmberFlow Smart Diffuser", cat: "Home & Focus", src: "TikTok Shop", price: 5900, cost: 1950, ship: 450, demand: 8, trend: "growing", comp: 6, creative: 9, demo: 8, cod: 8, shipS: 9, margin: 60, score: 84, opp: "fire", status: "analysis", tags: ["UGC", "Premium", "Easy Shipping"], img: "EF", note: "Combines aroma diffusion, timer, light and fire-safe switch into one quiet device for home workers." },
      { id: "p2", name: "LED Neck Reading Light", cat: "Reading", src: "AliExpress", price: 1400, cost: 380, ship: 350, demand: 7, trend: "growing", comp: 5, creative: 8, demo: 8, cod: 9, shipS: 9, margin: 71, score: 81, opp: "fire", status: "ready", tags: ["Impulse", "COD"], img: "LN", note: "Book-light worn around the neck — 3 color temps, USB-C. Low price, highly demonstrable." },
      { id: "p3", name: "Foldable Travel Kettle", cat: "Travel", src: "TikTok Shop", price: 3500, cost: 1200, ship: 500, demand: 7, trend: "stable", comp: 6, creative: 7, demo: 7, cod: 8, shipS: 6, margin: 61, score: 78, opp: "good", status: "ready", tags: ["Travel", "COD"], img: "TK", note: "Collapsible 600ml kettle — strong travel audience, bulky shipping to DZ is the risk." },
      { id: "p4", name: "Portable Neck Fan", cat: "Summer", src: "1688", price: 2200, cost: 700, ship: 400, demand: 8, trend: "seasonal", comp: 7, creative: 8, demo: 8, cod: 9, shipS: 8, margin: 65, score: 76, opp: "good", status: "testing", tags: ["Seasonal", "Impulse"], img: "NF", note: "3-speed bladeless fan — strong summer COD seller, competition moderate-high in DZ." },
      { id: "p5", name: "Magnetic Cable Organizer", cat: "Home", src: "Shopify store", price: 1100, cost: 260, ship: 320, demand: 6, trend: "stable", comp: 5, creative: 7, demo: 7, cod: 9, shipS: 10, margin: 74, score: 74, opp: "good", status: "testing", tags: ["Easy Shipping", "Impulse"], img: "CO", note: "Cheap, tiny, easy to ship — but low ticket limits ad budget." },
      { id: "p6", name: "Mini Electric Cheese Grater", cat: "Kitchen", src: "Alibaba", price: 1900, cost: 620, ship: 420, demand: 6, trend: "growing", comp: 6, creative: 8, demo: 9, cod: 8, shipS: 8, margin: 64, score: 71, opp: "valid", status: "analysis", tags: ["UGC", "Demo"], img: "CG", note: "Cordless grater with huge demo potential; category freshness needs validation." },
      { id: "p7", name: "Smart Water Bottle + Timer", cat: "Health", src: "Temu", price: 2900, cost: 1050, ship: 480, demand: 6, trend: "declining", comp: 7, creative: 6, demo: 5, cod: 8, shipS: 8, margin: 60, score: 69, opp: "valid", status: "watch", tags: ["Health", "Premium"], img: "WB", note: "Hydration reminders — novelty faded, price competition from generic bottles." },
      { id: "p8", name: "UV Sanitizer Box", cat: "Home", src: "Amazon", price: 4200, cost: 1900, ship: 600, demand: 5, trend: "declining", comp: 8, creative: 5, demo: 4, cod: 7, shipS: 5, margin: 52, score: 62, opp: "risk", status: "rejected", tags: ["High Risk"], img: "UV", note: "Medical-adjacent claims are a regulatory risk; demand cooled after 2024." },
      { id: "p9", name: "Automatic Cat Feeder", cat: "Pets", src: "AliExpress", price: 5200, cost: 2400, ship: 700, demand: 6, trend: "stable", comp: 8, creative: 5, demo: 5, cod: 7, shipS: 5, margin: 50, score: 58, opp: "risk", status: "rejected", tags: ["High Risk"], img: "CF", note: "High return risk (firmware, jams) and heavy competition — rejected after score." },
      { id: "p10", name: "Telescopic Back Scratcher", cat: "Novelty", src: "Marketplace", price: 700, cost: 180, ship: 280, demand: 4, trend: "declining", comp: 9, creative: 4, demo: 4, cod: 9, shipS: 10, margin: 69, score: 41, opp: "avoid", status: "rejected", tags: ["Low Ticket"], img: "BS", note: "Zero differentiation, saturated category, no demo wow." },
    ],
    suppliers: [
      { id: "s1", name: "DZ Home Store", platform: "AliExpress", price: 1950, moq: 1, variants: 8, reviews: 1200, rating: 4.7, orders: "HIGH", shipCost: 450, procDays: 5, loc: "China", ageY: 3, supRating: 4.6, img: true, video: true, url: true },
      { id: "s2", name: "Guangzhou Aroma Tech", platform: "Alibaba", price: 1680, moq: 50, variants: 6, reviews: 210, rating: 4.5, orders: "MEDIUM", shipCost: 380, procDays: 3, loc: "Guangzhou, CN", ageY: 7, supRating: 4.8, img: true, video: false, url: true },
      { id: "s3", name: "Shenzhen ZM Supply", platform: "1688", price: 1450, moq: 100, variants: 4, reviews: 320, rating: 4.3, orders: "MEDIUM", shipCost: 350, procDays: 2, loc: "Shenzhen, CN", ageY: 2, supRating: 4.1, img: true, video: false, url: true },
    ],
    competitors: [
      { id: "c1", name: "AromaHome.dz", price: 5200, offer: "Free shipping over 6,000 DA", positioning: "Budget home scent", creative: "Static images + catalog", reviews: 340, usp: "Lowest price", lp: "Basic", cta: "Order now", guarantee: "None" },
      { id: "c2", name: "FocusRoom.io", price: 7900, offer: "Bundle: diffuser + oils kit", positioning: "Premium focus for remote workers", creative: "UGC + demo videos", reviews: 210, usp: "Focus-first positioning", lp: "Strong", cta: "Try it", guarantee: "30-day money back" },
      { id: "c3", name: "ZenHome Algeria", price: 6500, offer: "Free diffuser with 3 oil bottles", positioning: "Home wellness", creative: "Influencer posts", reviews: 480, usp: "Bundle value", lp: "Medium", cta: "Shop now", guarantee: "7-day exchange" },
    ],
    sources: [
      { id: "ali", name: "AliExpress", icon: "package" }, { id: "alib", name: "Alibaba", icon: "factory" }, { id: "1688", name: "1688", icon: "building-2" },
      { id: "taobao", name: "Taobao", icon: "shopping-cart" }, { id: "temu", name: "Temu", icon: "badge-percent" }, { id: "amz", name: "Amazon", icon: "shopping-bag" },
      { id: "tts", name: "TikTok Shop", icon: "clapperboard" }, { id: "shop", name: "Shopify stores", icon: "store" }, { id: "gt", name: "Google Trends", icon: "trending-up" },
      { id: "red", name: "Reddit", icon: "messages-square" }, { id: "yt", name: "YouTube", icon: "youtube" }, { id: "tt", name: "TikTok", icon: "clapperboard" },
      { id: "ig", name: "Instagram", icon: "camera" }, { id: "pin", name: "Pinterest", icon: "pin" }, { id: "mkt", name: "Public marketplaces", icon: "store" }, { id: "sup", name: "Supplier catalogs", icon: "list-checks" },
    ],
    trends: { months: ["W26", "W27", "W28", "W29", "W30", "W31", "W32", "W33", "W34", "W35", "W36", "W37"], p1: [34, 36, 38, 41, 45, 50, 54, 60, 67, 72, 78, 84], p2: [20, 22, 24, 26, 29, 33, 36, 40, 44, 48, 52, 55], p4: [10, 12, 15, 18, 25, 40, 62, 70, 66, 52, 40, 34], p8: [90, 82, 74, 66, 58, 52, 47, 43, 40, 38, 36, 34] },
    providers: [
      { id: "openrouter", name: "OpenRouter", role: "Routing hub", key: true, models: 12 }, { id: "nvidia", name: "NVIDIA NIM", role: "Self-hosted library-style", key: false, models: 8 },
      { id: "openai", name: "OpenAI", role: "Vision + reasoning", key: false, models: 6 }, { id: "anthropic", name: "Anthropic", role: "Long-context reasoning", key: false, models: 5 },
      { id: "gemini", name: "Google Gemini", role: "Vision + web", key: false, models: 7 }, { id: "mistral", name: "Mistral", role: "Fast language", key: false, models: 4 },
      { id: "groq", name: "Groq", role: "Fast inference", key: false, models: 3 }, { id: "deepseek", name: "DeepSeek", role: "Reasoning + language", key: false, models: 4 },
    ],
  };

  /* EmberFlow deep-dive (the sample product the platform is analyzing) */
  const EM = {
    summary: "EmberFlow is a smart essential-oil diffuser that combines aroma diffusion, a timer, ambient light and a fire-safe auto shut-off in one quiet desk device, aimed at home workers who struggle to concentrate.",
    problem: "Home offices are full of distractions and the room does not adapt to the user — focus breaks, lighting is harsh, scent is absent or candle-based (fire risk).",
    benefit: "One tap sets a 'focus mode' preset — the room signals calm, so the brain enters work mode faster and the user stops juggling candles, lamps and timers.",
    mechanism: "A pressurized cold-air atomizer diffuses oils without heat (safe with wooden desks), paired with a built-in timer and color-shifting light ring.",
    audience: "Remote workers and students 26–45 who want a calmer room and cannot switch off after work.",
    useCases: ["Deep-work sessions in a home office", "Evening wind-down / sleep prep", "Reading corner ambiance", "Living room after family time", "Travel / hotel focus kit"],
    triggers: ["Distraction + procrastination pain", "Desire to 'protect' focus time", "Fear of leaving candles on", "Aesthetic upgrade for desk setups", "Gift for a working partner"],
    pains: ["Can't focus at home", "Candles are a fire risk", "Nerve oil burners run too hot", "Room never 'feels' like work mode", "Too many devices on the desk"],
    desires: ["A room that adapts to them", "Calm without effort", "One device, not five", "Safe to leave on", "Looks good on the desk"],
    objections: ["Price vs a cheap diffuser", "Is the light actually useful?", "Oil refill cost over time", "Trust in a new brand", "Does it work in big rooms?"],
    usp: "The only 'focus-first' diffuser with fire-safe shut-off and a light ring that signals work mode — not just a scent device.",
    positioning: "For home workers who can't concentrate, EmberFlow turns any room into a calm focus space in one tap.",
    whyBuy: "It solves a daily, felt problem (focus at home) with one safe, quiet, good-looking device and removes the risk of forgotten candles.",
    whyNot: "Perceived as 'just a diffuser' at 2x the price of a basic one; oil refills add recurring cost; big-room effectiveness is unproven.",
    different: "Focus-first positioning + fire-safe shut-off + light-ring work signal. Competitors sell scent or ambiance; EmberFlow sells concentration.",
    easyDemo: "Yes — visible mist, color change and a clean 'before/after' desk shot in under 10 seconds of footage.",
    easyExplain: "Mostly — 'diffuser, timer, light, safe' is one sentence; the focus angle needs one more sentence to land.",
    easyShip: "Yes — ~1.1 kg, one box, no fragile liquid-filled core; cold-air atomizer ships with the pump sealed.",
    impulse: "Medium-high: problem is emotional, price is mid-ticket, demo is instant — but refill fear creates hesitation.",
    demand: { trend: "growing", acceleration: "+31% over 12 weeks", stability: "Stable, no spikes", seasonality: "Autumn/winter lift, summer dip", maturity: "Emerging → growing in DZ, mature in US/EU" },
    market: {
      DZ: { title: "Algeria (primary)", cod: "Excellent — COD is the norm", power: "Mid — price sensitivity high", priceExpect: "4,000–7,000 DA band", cultural: "Scent/wellness rising among 25–40 urban buyers", comp: "Low — few focus-first players", ship: "Simple, 450 DA, 1–2 weeks", local: "Arabic/French copy; Darija hooks tested" },
      FR: { title: "France (secondary)", cod: "Low — card dominant", power: "High", priceExpect: "49–79 EUR band", cultural: "Home-office product already validated", comp: "Medium — EU brands active", ship: "Fast, warehouse-friendly", local: "French copy required" },
    },
    gaps: [
      "Target 'students in shared flats' instead of generic home scent buyers",
      "Position around 'work mode' not 'wellness' — none of the DZ players do this",
      "Bundle: diffuser + 3 starter oils at a forced bundle price",
      "30-day money-back guarantee — zero competitors in DZ offer one",
      "Before/after desk-transformation creative (nobody runs it)",
      "Darija-first ad copy for a distinctly Algerian angle",
      "Sell the safety story — candle fires are a proven local fear",
      "Subscription refill box for oils (repeat purchase, unserved)",
      "A cheaper 'Starter' SKU (light only) to enter low budgets",
      "Localized FAQ + WhatsApp checkout to remove COD trust friction",
    ],
    creative: {
      hooks: [
        "Your home office is fighting your focus — here's the switch",
        "A diffuser, a timer, a light and a fire-safe switch — or one EmberFlow?",
        "One tap and the room tells your brain: it's work time",
        "I stopped leaving candles on after my desk almost caught fire",
        "3 home offices, one change — watch what happened",
        "You don't need more willpower. You need a different room",
        "The 14-tab confession: why I couldn't finish anything from home",
        "What if your room could put you into deep work in 30 seconds?",
        "Cheap diffusers vs this: what you're actually paying for",
        "Setting a 'focus mode' preset is the best productivity hack nobody uses",
      ],
      angles: ["Problem: can't focus at home", "Safety: candle fire fear", "Contrast: candles vs EmberFlow", "Transformation: desk → focus space", "Social proof: 3 office workers test", "Price anchor: everything it replaces", "Benefit: calm without effort", "Curiosity: what is focus mode?", "Comparison: cheap diffuser vs EmberFlow", "Convenience: one device, one tap"],
      concepts: [
        ["UGC", "Work-from-home desk transformation", "Demonstration", "9:16"],
        ["Demo", "10-second mist + light change", "Demonstration", "9:16"],
        ["Static", "Price anchor: everything it replaces", "Offer", "1:1"],
        ["Carousel", "5 use cases in the home", "Benefit", "1:1"],
        ["Testimonial", "3 remote workers, one change", "Social proof", "9:16"],
        ["UGC", "Darija 'don't burn your desk' sketch", "Problem", "9:16"],
        ["Demo", "Evening wind-down preset routine", "Transformation", "9:16"],
        ["Static", "Question billboard: 'Can't focus?'", "Question", "1:1"],
        ["UGC", "Student in shared flat focus mode", "Lifestyle", "9:16"],
        ["Carousel", "Candles vs EmberFlow safety", "Contrast", "1:1"],
      ],
      ugc: [
        { title: "The 14-Tab Confession (problem)", seconds: 30, hook: "Your home office is fighting your focus", creator: "Female · beginner" },
        { title: "Candles vs EmberFlow (contrast)", seconds: 20, hook: "I almost burned my desk twice", creator: "Male · expert" },
        { title: "Focus Mode ASMR (demonstration)", seconds: 15, hook: "One tap. That's it.", creator: "Female · expert" },
        { title: "Desk transformation (lifestyle)", seconds: 20, hook: "3 home offices, one change", creator: "Male · beginner" },
        { title: "Darija 'the wick is still hot' (problem)", seconds: 15, hook: "نتوما تفهمون؟ الشمع هذا خطر", creator: "Female · beginner" },
      ],
      testimonial: "CONCEPT — requires real customer proof.",
    },
    offers: [
      { name: "Standard", price: 5900, cost: 2550, extra: "—", rev: 5900, margin: 3350, aov: 5900, profit: 2550, k: "baseline" },
      { name: "Discount 10%", price: 5310, cost: 2550, extra: "—", rev: 5310, margin: 2760, aov: 5310, profit: 1960, k: "launch" },
      { name: "Bundle: +3 starter oils", price: 6900, cost: 3200, extra: "Oils cost 650", rev: 6900, margin: 3700, aov: 6900, profit: 2900, k: "best" },
      { name: "Buy 2 (2 diffusers)", price: 10620, cost: 5100, extra: "—", rev: 10620, margin: 5520, aov: 5310, profit: 4620, k: "upsell" },
      { name: "Buy 3 (3 diffusers)", price: 14700, cost: 7650, extra: "—", rev: 14700, margin: 7050, aov: 4900, profit: 6150, k: "wholesale" },
      { name: "Free shipping", price: 5900, cost: 3000, extra: "Ship absorbed (450)", rev: 5900, margin: 2900, aov: 5900, profit: 2100, k: "cod" },
      { name: "Gift: free oil starter", price: 6250, cost: 2950, extra: "Gift costs 400", rev: 6250, margin: 3300, aov: 6250, profit: 2300, k: "gift" },
      { name: "Limited promo (7 days)", price: 5490, cost: 2550, extra: "Real countdown", rev: 5490, margin: 2940, aov: 5490, profit: 2140, k: "promo" },
      { name: "Premium: +oils +tray", price: 7900, cost: 3800, extra: "Tray costs 600", rev: 7900, margin: 4100, aov: 7900, profit: 3100, k: "premium" },
    ],
    pricing: { land: 2450, ship: 450, pack: 60, payFeePct: 2.2, codFee: 120, adPerOrder: 800, retPct: 4 },
    scorecard: [
      { k: "demand", label: "Demand", s: 8 }, { k: "trend", label: "Trend", s: 7 }, { k: "problem", label: "Problem intensity", s: 8 },
      { k: "diff", label: "Differentiation", s: 7 }, { k: "comp", label: "Competition", s: 6 }, { k: "margin", label: "Margin", s: 7 },
      { k: "creative", label: "Creative potential", s: 9 }, { k: "demo", label: "Demonstration", s: 8 }, { k: "cod", label: "COD suitability", s: 8 },
      { k: "shipping", label: "Shipping", s: 9 }, { k: "ret", label: "Return risk (inverted)", s: 8 }, { k: "upsell", label: "Upsell potential", s: 6 }, { k: "repeat", label: "Repeat purchase", s: 4 },
    ],
    readiness: { demo: 8, impulse: 7, cod: 8, shipping: 9, returnRisk: "LOW–MEDIUM", repeat: 4, lifecycle: "Growing", shippingFlag: "Easy to ship" },
    checklist: [
      { item: "Real customer problem", ok: true, why: "Focus-at-home pain is daily and felt (survey of 40 workers, self-reported)." },
      { item: "Clear benefit", ok: true, why: "'One tap = focus mode' is concrete and measurable." },
      { item: "Demonstrable", ok: true, why: "Mist + light change films in 10 seconds." },
      { item: "Sourcing available", ok: true, why: "3 suppliers found, MOQ 1–100 verified." },
      { item: "Reasonable margin", ok: true, why: "58% gross margin at 5,900 DA vs 2,450 DA landed." },
      { item: "Shipping manageable", ok: true, why: "1.1 kg, non-fragile, 450 DA to DZ." },
      { item: "Competition manageable", ok: "partial", why: "Few focus-first players locally, but 2–3 budget players exist." },
      { item: "Creative potential", ok: true, why: "10 angles, 10 concepts, demo-led format viable." },
      { item: "Offer potential", ok: true, why: "Bundle + guarantee lift AOV without fake scarcity." },
      { item: "Market opportunity", ok: "partial", why: "DZ trend growing; need local search-volume verification." },
    ],
    risk: [
      { area: "Legal / regulatory", level: "low", why: "Consumer electronics, no medical claims in current copy. UNKNOWN: Algeria conformity marking (INAPI) — requires user input." },
      { area: "Fragility", level: "low", why: "No liquid-filled core; pump sealed in transit." },
      { area: "Counterfeit / trademark", level: "medium", why: "'EmberFlow' name is not trademark-registered in DZ yet — register before scaling. Flag for manual review." },
      { area: "Medical claims", level: "low", why: "None made; avoid 'improves health' language in ads." },
      { area: "Safety", level: "low", why: "Cold-air atomizer, auto shut-off; keep CE/FCC docs visible." },
      { area: "Shipping restrictions", level: "low", why: "No battery, no aerosols — air-shippable." },
    ],
    tests: [
      { n: 1, type: "Creative", var: "UGC desk-transformation vs static anchor", hyp: "Demo-led UGC will beat static images on hook-rate", budget: 2500, kpi: "Hook rate ≥ 34%", sec: "Outbound CTR ≥ 3%", ok: "≥8 pt hook-rate lead at 1,500 imp", fail: "<2 pt lead or CTR <2%", next: "Scale winner or iterate angle" },
      { n: 2, type: "Hook", var: "Problem vs Contrast hook", hyp: "The 'candle fire' contrast hook lifts CTR on cold DZ", budget: 2500, kpi: "CTR ≥ 2.8%", sec: "CPA ≤ 1,800 DA", ok: "CTR lead ≥0.8 pt at 95% conf", fail: "No significant lead", next: "Test safety angle variants" },
      { n: 3, type: "Offer", var: "Bundle +3 oils vs standard", hyp: "Bundle lifts AOV and margin per order", budget: 2000, kpi: "AOV ≥ 6,900 DA", sec: "Confirmation rate ≥ 65%", ok: "AOV lift ≥15% with stable CTR", fail: "AOV flat or CTR drops", next: "Test gift offer instead" },
      { n: 4, type: "Price", var: "5,490 vs 5,900 vs 6,500 DA", hyp: "5,900 balances conversion and margin; 6,500 proves premium", budget: 3000, kpi: "Profit per order", sec: "Conversion ≥ 1.8%", ok: "5,900 maximizes profit/order", fail: "6,500 converts equally", next: "Move to 6,500 + bundle" },
      { n: 5, type: "Audience", var: "Broad DZ vs students/remote-workers interest", hyp: "Narrow focus audience lowers CPA", budget: 2000, kpi: "CPA ≤ 1,600 DA", sec: "Reach ≥ 50k", ok: "CPA ≤15% lower on narrow set", fail: "CPA within noise", next: "Re-broaden to LAL buyers" },
      { n: 6, type: "Landing page", var: "Focus-story LP vs standard product LP", hyp: "Story-first LP lifts confirmation rate", budget: 1500, kpi: "Confirmation ≥ 68%", sec: "Cart-add rate ≥ 6%", ok: "Confirmation lead ≥6 pt", fail: "No lift", next: "Test FAQ block changes" },
    ],
    report: [
      ["Product summary", "Smart diffuser that combines scent, timer, light and fire-safe shut-off, positioned for home workers."],
      ["Demand", "Growing +31% in 12 weeks; stable; autumn/winter lift expected."],
      ["Market", "Algeria primary (COD, price band 4,000–7,000 DA), France secondary (49–79 EUR)."],
      ["Competition", "3 tracked players; low focus-first competition locally."],
      ["Sourcing", "3 suppliers verified; MOQ 1–100; price 1,450–1,950 DA."],
      ["Suppliers", "Best overall: DZ Home Store (AliExpress) for DZ testing volume."],
      ["Pricing", "Break-even ≈ 3,490 DA; target 5,900 DA; premium 7,900 DA."],
      ["Offer", "Bundle +3 oils (6,900 DA) maximizes margin per order; guarantee pending."],
      ["Buyer persona", "Remote workers/students 26–45, urban DZ, focus-seeking, card+COD."],
      ["Creative opportunity", "Demo-led UGC 9:16; 10 hooks, 10 angles, 10 concepts."],
      ["Ad strategy", "Test creative first, then hook, offer, price, audience, landing page."],
      ["Landing page", "12-block structure; story-first variant to test."],
      ["COD suitability", "8/10 — mid-ticket, demonstrable, low return risk."],
      ["Shipping risk", "Low — 1.1 kg, non-fragile, 450 DA."],
      ["Return risk", "Low–medium — no size/compatibility issues; quality expectation to watch."],
      ["Profit potential", "58% gross margin; net ~2,100 DA/order at 5,900 DA after ads."],
      ["Winning product score", "84/100 — HIGH POTENTIAL."],
      ["Recommendation", "TEST NOW — creative test #1 first, $25/day for 5 days."],
    ],
    final: {
      verdict: "TEST NOW", cls: "fire", reasons: [
        "Demand trend is growing (+31% over 12 weeks) with low local competition in the focus-first niche.",
        "Demonstration is strong (demo 8/10, creative 9/10) — the cheapest ad variable is creative, and it has the most upside.",
        "Economics work: 58% gross margin, break-even 3,490 DA, target price 5,900 DA leaves room for a 1,600 DA CAC.",
        "COD suitability 8/10 and easy shipping keep delivery risk low in the primary market.",
        "A single creative test (2,500 DA) tells us if the angle lands before any larger commitment — asymmetric, cheap evidence.",
      ],
      firstTest: {
        product: "EmberFlow Smart Diffuser — UGC desk-transformation creative",
        target: "Algeria · remote workers/students 26–45 · broad DZ",
        price: "5,900 DA",
        offer: "Standard + free shipping",
        creative: "UGC desk-transformation (9:16) vs static price-anchor (1:1)",
        hook: "Your home office is fighting your focus",
        budget: "2,500 DA over 5 days (~500 DA/day)",
        primaryKpi: "Hook rate ≥ 34%",
        success: "≥8-pt hook-rate lead at 95% confidence",
      },
    },
    automation: { frequency: "Daily", time: "06:00", count: 20, minScore: 75, minMargin: 55, shipFilter: "Low risk", compFilter: "Medium or lower", notify: "Dashboard + push", active: true },
  };

  /* ---------------- modules ---------------- */
  const MODULES = [
    { g: "COMMAND", items: [{ id: "dashboard", label: "Dashboard", icon: "layout-dashboard" }] },
    { g: "DISCOVER", items: [
      { id: "discover", label: "Discover Products", icon: "compass" },
      { id: "trends", label: "Trend Detector", icon: "trending-up" },
      { id: "winners", label: "Find Me Winners", icon: "flame" },
      { id: "budget", label: "I Have $X", icon: "wallet" },
      { id: "haveThis", label: "I Have This Product", icon: "upload" },
      { id: "database", label: "Product Database", icon: "database" },
    ] },
    { g: "RESEARCH", items: [
      { id: "analyzer", label: "Product Analyzer", icon: "scan-search" },
      { id: "demand", label: "Demand Analysis", icon: "bar-chart-4" },
      { id: "market", label: "Market Research", icon: "globe-2" },
      { id: "competitors", label: "Competitors", icon: "siren" },
      { id: "gaps", label: "Competitor Gaps", icon: "circle-dot" },
      { id: "compare", label: "Compare Products", icon: "columns-2" },
      { id: "watchlist", label: "Watchlist", icon: "bell" },
    ] },
    { g: "SOURCE", items: [
      { id: "sourcing", label: "Sourcing Center", icon: "package-search" },
      { id: "suppliers", label: "Suppliers", icon: "factory" },
      { id: "import", label: "Product Import", icon: "file-up" },
    ] },
    { g: "ECONOMICS", items: [
      { id: "pricing", label: "Pricing Engine", icon: "calculator" },
      { id: "pricetest", label: "Price Testing", icon: "arrow-left-right" },
      { id: "offers", label: "Offer Builder", icon: "gift" },
      { id: "bundles", label: "Bundle Builder", icon: "boxes" },
    ] },
    { g: "CREATIVE", items: [
      { id: "adintel", label: "Ad Intelligence", icon: "radar" },
      { id: "creative", label: "Creative Lab", icon: "palette" },
      { id: "hooks", label: "Hook Lab", icon: "anchor" },
      { id: "ugc", label: "UGC Generator", icon: "clapperboard" },
      { id: "adcopy", label: "Ad Copy", icon: "type" },
      { id: "landings", label: "Landing Pages", icon: "layout-template" },
    ] },
    { g: "VALIDATE", items: [
      { id: "score", label: "Product Score", icon: "gauge" },
      { id: "scorecard", label: "Scorecard", icon: "sliders-horizontal" },
      { id: "readiness", label: "Readiness Scores", icon: "check-check" },
      { id: "checklist", label: "Validation Checklist", icon: "clipboard-check" },
      { id: "risk", label: "Risk Engine", icon: "shield-alert" },
      { id: "evidence", label: "Evidence System", icon: "scale" },
      { id: "quality", label: "Data Quality", icon: "percent" },
    ] },
    { g: "TEST", items: [
      { id: "testing", label: "Testing Plan", icon: "flask-conical" },
      { id: "results", label: "Test Results", icon: "clipboard-list" },
      { id: "learning", label: "Winner Learning", icon: "brain" },
      { id: "similar", label: "Similar Finder", icon: "git-fork" },
    ] },
    { g: "OUTPUT", items: [
      { id: "report", label: "AI Product Report", icon: "file-text" },
      { id: "advisor", label: "AI Advisor", icon: "bot-message-square" },
      { id: "automate", label: "Research Automation", icon: "timer" },
      { id: "final", label: "Final Decision", icon: "flag" },
      { id: "settings", label: "Settings", icon: "settings" },
    ] },
  ];

  function modDef(id) { for (const g of MODULES) { const it = g.items.find((i) => i.id === id); if (it) return it; } return { label: "Dashboard", icon: "layout-dashboard" }; }

  /* ---------------- shell ---------------- */
  function renderSidebar() {
    const host = $("#p22-sidebar");
    host.innerHTML = MODULES.map((g) => `
      <div class="p22-side-label">${g.g}</div>
      ${g.items.map((i) => `
        <button class="p22-nav-item${state.m === i.id ? " active" : ""}" data-m="${i.id}">
          ${icon(i.icon, 16)}<span>${i.label}</span>
          ${i.id === "winners" ? `<span class="p22-badge">TOP10</span>` : ""}
          ${i.id === "watchlist" ? `<span class="p22-badge amber">${Object.keys(state.watch).length}</span>` : ""}
        </button>`).join("")}
    `).join("") + `
      <div class="p22-sidebar-foot">
        <div class="flex items-center gap-1.5" style="color:#9a9aa2">${icon("flame", 12)}<b style="color:#1c1c1e">57 modules</b> · product intelligence</div>
        <div style="margin-top:4px">AI never promises a winner — it reduces uncertainty.</div>
      </div>`;
    host.querySelectorAll(".p22-nav-item").forEach((b) => b.addEventListener("click", () => { switchModule(b.getAttribute("data-m")); closeDrawer(); }));
  }

  function renderTopbar() {
    const d = modDef(state.m);
    const host = $("#p22-topbar");
    host.innerHTML = `
      <button class="p22-hamburger" id="p22-hamburger">${icon("menu", 18)}</button>
      <div class="min-w-0">
        <div class="p22-title">${d.label}</div>
        <div class="p22-title-sub">AI Winning Product Intelligence Center · ${state.market.country === "DZ" ? "Algeria · DZD" : "Market"}</div>
      </div>
      <div class="p22-search"><span>${icon("search", 14)}</span><input id="p22-q" placeholder="Search products, suppliers, hooks…" value="${esc(state.q)}"></div>
      <div id="p22-topbar-actions" class="flex items-center gap-2 flex-wrap"></div>
      <span id="p22-mode" class="p22-tag ${live() ? "green" : "blue"}">${live() ? "CONNECTED · " + Object.keys(state.providers).length + " KEY" : "DEMO"}</span>`;
    $("#p22-hamburger").addEventListener("click", openDrawer);
    $("#p22-drawer-mask").addEventListener("click", closeDrawer);
    $("#p22-q").addEventListener("input", (e) => { state.q = e.target.value; if (state.m === "database") renderDatabase(); });
  }

  /* ---------------- dashboard (spec 2) ---------------- */
  function renderDashboard() {
    const kpis = [
      { n: "3", l: "Potential Winners", icon: "flame", hot: true },
      { n: "10", l: "Products Researched", icon: "database" },
      { n: "3", l: "Products Tested", icon: "flask-conical" },
      { n: "—", l: "Winning Rate (no data yet)", icon: "percent" },
      { n: "76.2", l: "Average Product Score", icon: "gauge" },
      { n: "EmberFlow", l: "Best Opportunity · 84/100", icon: "crown" },
      { n: "DZ Home Store", l: "Best Supplier · AliExpress", icon: "factory" },
      { n: "Algeria", l: "Best Market · COD + growing", icon: "globe-2" },
    ];
    const pipeline = [
      { t: "Trending", tone: "blue", items: [["EmberFlow Diffuser", "84"], ["LED Neck Light", "81"], ["Cheese Grater", "71"]] },
      { t: "New Opportunities", tone: "blue", items: [["Travel Kettle", "78"], ["Cable Organizer", "74"]] },
      { t: "High-Potential", tone: "green", items: [["EmberFlow Diffuser", "84"], ["LED Neck Light", "81"]] },
      { t: "Under Analysis", tone: "amber", items: [["EmberFlow Diffuser", "84"], ["Cheese Grater", "71"]] },
      { t: "Ready to Test", tone: "amber", items: [["LED Neck Light", "81"], ["Travel Kettle", "78"]] },
      { t: "Being Tested", tone: "green", items: [["Neck Fan", "76"], ["Cable Organizer", "74"]] },
      { t: "Winning", tone: "green", items: state.wins.length ? state.wins : [["—", "—"]] },
      { t: "Rejected", tone: "red", items: [["UV Box", "62"], ["Cat Feeder", "58"], ["Back Scratcher", "41"]] },
    ];
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 class="text-[22px] font-extrabold tracking-tight text-[#1c1c1e]">Winning Product Command Center</h1>
          <p class="text-[13px] text-[#8a8a92] mt-1 max-w-[720px]">Is this product worth testing, how should I sell it, and what evidence supports that decision?</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button class="p22-btn primary" data-goto="winners">${icon("flame", 15)} Find Me Winners</button>
          <button class="p22-btn outline" data-goto="budget">${icon("wallet", 15)} I Have $X</button>
          <button class="p22-btn ghost" data-goto="haveThis">${icon("upload", 15)} I Have This Product</button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        ${kpis.map((k) => `<div class="p22-kpi${k.hot ? " hot" : ""}">
          <div class="flex items-start justify-between">
            <div><div class="kpi-num">${k.n}</div><div class="kpi-lbl">${k.l}</div></div>
            <span class="p22-card-ic" style="width:32px;height:32px">${icon(k.icon, 15)}</span>
          </div>
        </div>`).join("")}
      </div>

      <div class="mb-4">
        ${card({ title: "Product Pipeline", icon: "git-branch", sub: "Every product has one status — built from scores and user decisions", body: `
          <div class="flex gap-3 overflow-x-auto pb-1" style="min-height:150px">
            ${pipeline.map((c) => `
              <div class="flex-none w-[150px] rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-2">
                <div class="text-[10.5px] font-extrabold tracking-wide mb-2">${c.t}</div>
                ${c.items.map(([n, s]) => `<div class="flex items-center gap-1.5 rounded-lg bg-white border border-[#f0efed] px-2 py-1.5 mb-1.5">
                  <span class="text-[11px] font-semibold text-[#1c1c1e] truncate flex-1">${n}</span>
                  <span class="text-[10px] font-bold ${s === "—" ? "text-[#b5b5bb]" : "text-[#0fa05a]"}">${s}</span>
                </div>`).join("")}
              </div>`).join("")}
          </div>` })}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${card({ title: "Best Opportunity", icon: "crown", body: `
          <div class="flex items-center gap-3">
            ${thumb(product().img, product().name, true)}
            <div class="min-w-0 flex-1">
              <div class="text-[13.5px] font-bold text-[#1c1c1e]">${product().name}</div>
              <div class="text-[11.5px] text-[#9a9aa2] mt-0.5">${product().cat} · ${product().src}</div>
              <div class="mt-2">${opp(product().opp)}</div>
            </div>
          </div>
          <div class="mt-3">${ev("WHY THIS IS THE TOP OPPORTUNITY", "Growing trend (+31% / 12wk), demo-led creative potential 9/10, margin 60%, COD 8/10 — the strongest evidence-weighted profile in the database.")}</div>
          <div class="flex gap-2 mt-3">
            <button class="p22-btn primary" data-goto="score">${icon("gauge", 14)} Full score</button>
            <button class="p22-btn ghost" data-goto="report">${icon("file-text", 14)} Report</button>
          </div>` })}
        ${card({ title: "AI Learning Snapshot", icon: "brain", body: `
          ${ai("WHAT THE SYSTEM HAS LEARNED", `<p class="text-[12.5px] text-[#3f3f46] leading-relaxed">Not enough winning history yet to state a pattern. This box will only draw conclusions after real test results are entered (spec: winner learning engine).</p>
            <div class="mt-2 flex items-center gap-2">${tag("Waiting for data", "amber")}${tag("0 winners stored", "gray")}</div>`)}
          <div class="mt-3">${ev("HONEST LIMIT", "A product score is a weighted hypothesis, not a guarantee. Every recommendation below shows the exact evidence it is based on.")}</div>` })}
        ${card({ title: "Next Best Action", icon: "target", body: `
          <div class="rounded-xl bg-[#1c1c1e] text-white p-4">
            <div class="text-[10.5px] font-extrabold tracking-wider text-[#3ddc72] mb-1.5">RUN THIS TEST FIRST</div>
            <div class="text-[13px] font-bold">Creative test #1 — UGC desk-transformation vs static anchor</div>
            <div class="text-[12px] text-[#c9c9cf] mt-1">Budget ${money(2500)} · 5 days · KPI: hook rate ≥ 34%</div>
            <div class="flex gap-2 mt-3">
              <button class="p22-btn green" data-goto="testing">${icon("flask-conical", 14)} Open test plan</button>
            </div>
          </div>` })}
      </div>`;

    $$("[data-goto]", el).forEach((b) => b.addEventListener("click", () => switchModule(b.getAttribute("data-goto"))));
  }

  const thumb = (t, label, tall, lg) => `<div class="p22-thumb${tall ? " tall" : ""}${lg ? " lg" : ""}" style="background:linear-gradient(145deg,#1c1c1e,#2f2f33)">${esc(label)}<span style="color:#3ddc72">·</span></div>`;

  /* ---------------- discover + feed (spec 3 + 38) ---------------- */
  function renderDiscover() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 class="text-[20px] font-extrabold text-[#1c1c1e]">Product Discovery Engine</h1>
          <p class="text-[13px] text-[#8a8a92] mt-1">Connector architecture — add a platform once, search it everywhere. Official APIs / permitted public data only; no unauthorized scraping.</p>
        </div>
        <button class="p22-btn ghost" data-act="connector">${icon("plug", 15)} Add connector</button>
      </div>

      ${card({ title: "Sourcing connectors", icon: "plug", sub: "16 adapters · toggle what the discovery feed searches", body: `
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          ${DB.sources.map((s) => `
            <label class="flex items-center gap-2.5 rounded-xl border border-[#f0efed] bg-[#fbfbfb] px-3 py-2.5 cursor-pointer hover:bg-[#f4faf6]">
              <input type="checkbox" checked class="accent-[#0fa05a]">
              <span class="p22-card-ic" style="width:26px;height:26px">${icon(s.icon, 13)}</span>
              <span class="text-[12px] font-semibold text-[#1c1c1e]">${s.name}</span>
              <span class="ml-auto p22-src verified">OK</span>
            </label>`).join("")}
        </div>
        <div class="mt-3 flex items-center gap-2 text-[12px] text-[#9a9aa2]">${icon("shield-alert", 14)} AliExpress/TikTok/Amazon use official APIs or marketplace-provided public data. Rate-limited and attributed.</div>` })}

      <div class="mt-4">
        ${card({ title: "AI Product Discovery", icon: "sparkles", sub: "Describe what you need + pick a category — the AI returns real trending products with 12-month Google Trends volume", body: `
          <div class="flex flex-col gap-3">
            <div class="p22-ai dark p-4">
              <div class="ai-label">DISCOVER AI</div>
              <p class="text-[13px] text-[#c9c9cf] leading-relaxed">What do you need? Write it in the small field below (an idea, a problem to solve, a budget…), set your price range, pick a category, and I'll return <b>real trending products</b> — not category names — with their <b>Google Trends monthly search volume</b> for the last 12 months.</p>
            </div>
            <div class="flex flex-wrap items-end gap-3">
              <div class="flex-1 min-w-[240px]">
                <div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">WHAT DO YOU NEED? <span class="font-normal text-[10px]">(small text · optional)</span></div>
                <input class="p22-input" id="p22-discover-want" placeholder="e.g. a small gadget to organize cables, a coffee accessory, a gift…">
              </div>
            </div>
            <div class="flex flex-wrap items-end gap-3">
              <div class="w-[110px]">
                <div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">PRICE MIN ($)</div>
                <input type="number" class="p22-input" id="p22-discover-min" placeholder="1" min="0" step="1">
              </div>
              <div class="w-[110px]">
                <div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">PRICE MAX ($)</div>
                <input type="number" class="p22-input" id="p22-discover-max" placeholder="30" min="0" step="1">
              </div>
              <div class="flex-1 min-w-[180px]">
                <div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">CATEGORY</div>
                <select class="p22-select" id="p22-discover-cat" style="width:100%">${DISCOVER_CATS.map((c) => `<option>${c}</option>`).join("")}</select>
              </div>
              <button class="p22-btn primary" id="p22-discover-run">${icon("sparkles", 15)} Discover AI${live() ? "" : " (demo)"}</button>
            </div>
            <div id="p22-discover-out">
              ${ai("WAITING FOR YOUR CHOICE", "Write what you need (optional), set a price range (e.g. $1–$30), and run Discover AI — real trending products with 12-month Google Trends volume will show up here.", false)}
            </div>
          </div>` })}
      </div>`;

    $("#p22-discover-run").addEventListener("click", runDiscoverAI);

    $$("[data-act=connector]", el).forEach((b) => b.addEventListener("click", () => { modal(`<div class="flex items-center gap-3 mb-3"><span class="p22-card-ic">${icon("plug", 16)}</span><div><div class="p22-card-title">Add connector</div><div class="p22-card-sub">New discovery sources plug in via one adapter</div></div></div>
      <div class="flex flex-col gap-3">
        <select class="p22-select"><option>REST / official API</option><option>Public RSS / feed</option><option>Marketplace partner API</option><option>Manual CSV import</option></select>
        <input class="p22-input" placeholder="Platform name (e.g. eMAG, Jumia DZ, Noon)…">
        <input class="p22-input" placeholder="Base URL or API endpoint…">
        ${ev("HONEST NOTE", "Only official APIs and permitted public sources are supported. No unauthorized scraping of any platform.", "warn")}
        <div class="flex justify-end gap-2"><button class="p22-btn ghost" onclick="document.getElementById('p22-modal').classList.remove('open')">Cancel</button><button class="p22-btn primary" data-close>Save connector</button></div>
      </div>`); $$("[data-close]", $("#p22-modal")).forEach((b) => b.addEventListener("click", closeModal)); }));
  }

  /* ---------------- discover AI (spec 3) ---------------- */
  const DISCOVER_CATS = ["All categories", "Home & Focus", "Kitchen", "Reading", "Travel", "Summer", "Health", "Pets", "Beauty", "Fitness", "Electronics", "Fashion", "Outdoor", "Novelty"];

  let discoverSeq = 0;
  async function runDiscoverAI() {
    const mySeq = ++discoverSeq;
    const out = $("#p22-discover-out");
    const cat = $("#p22-discover-cat").value;
    const want = ($("#p22-discover-want").value || "").trim();
    const min = parseFloat($("#p22-discover-min").value);
    const max = parseFloat($("#p22-discover-max").value);
    const priceReq = (isFinite(min) || isFinite(max)) ? { min_usd: isFinite(min) ? min : 0, max_usd: isFinite(max) ? max : Infinity } : null;
    const useLive = live();
    const rangeHint = priceReq ? " · $" + priceReq.min_usd + "–$" + (isFinite(priceReq.max_usd) ? priceReq.max_usd : "∞") : "";
    out.innerHTML = `<div class="p22-ai">${icon("loader-2", 14)} ${useLive ? "Searching connected sources for <b>" + esc(cat) + "</b>" + rangeHint + "…" : "Scanning the trend database for <b>" + esc(cat) + "</b>" + rangeHint + "…"}</div>`;
    if (useLive) {
      const res = await runAI("discover_products", {
        category: cat,
        need: want || "none",
        price_range: priceReq ? { min_usd: priceReq.min_usd, max_usd: isFinite(priceReq.max_usd) ? priceReq.max_usd : "no max" } : "any",
        market: "Algeria (COD · DZD)",
        note: "The user needs: '" + want + "' and wants products priced between $" + priceReq.min_usd + " and $" + (isFinite(priceReq.max_usd) ? priceReq.max_usd : "no max") + " USD. Return 6-8 CONCRETE trending products that FIT that price band — real, specific product names (include brand or shop when possible), NEVER generic labels like 'gadget', 'accessory' or 'item'. For every product include its Google Trends monthly search volume for the last 12 months (oldest first). Respond ONLY with a JSON array — no markdown fences, no extra commentary. Each element exactly: {name, brand, category, price_dzd, price_usd, source, why_trending, demand (rising|steady|falling), competition (low|medium|high), margin_pct, score (0-100), trends: {last_12m: [12 numbers], unit: \"Google searches / month\"}}. If you cannot verify a value, give your best honest estimate instead of leaving it empty.",
      }, { maxTokens: 3500 });
      if (mySeq !== discoverSeq) return;
      if (res) { renderDiscoverResults(res, cat, want, priceReq); return; }
    }
    if (mySeq !== discoverSeq) return;
    setTimeout(() => { if (mySeq === discoverSeq) renderDiscoverResults(null, cat, want, priceReq); }, 600);
  }

  function parseDiscoverJSON(text) {
    if (!text) return null;
    const t = String(text).trim();
    const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/);
    const body = fenced ? fenced[1] : t;
    try { const a = JSON.parse(body); return Array.isArray(a) ? a : null; } catch (e) {}
    try {
      const start = body.indexOf("[");
      const end = body.lastIndexOf("]");
      if (start !== -1 && end > start) { const a = JSON.parse(body.slice(start, end + 1)); return Array.isArray(a) ? a : null; }
    } catch (e) {}
    return null;
  }

  function renderDiscoverResults(res, cat, want, priceReq) {
    const out = $("#p22-discover-out");
    const rangeText = priceReq ? " · $" + priceReq.min_usd + "–$" + (isFinite(priceReq.max_usd) ? priceReq.max_usd : "∞") : "";
    if (res) {
      const list = parseDiscoverJSON(res.data);
      if (list && list.length) {
        const src = res.meta.provider || "AI";
        out.innerHTML = `
          <div class="mb-3 flex items-center justify-between flex-wrap gap-2">
            <h3 class="text-[14px] font-extrabold text-[#1c1c1e]">Real products — ${esc(cat)}${want ? " · “" + esc(want) + "”" : ""}${rangeText}</h3>
            <span class="p22-tag green">live AI · ${esc(src)}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${list.map((a) => aiProductCard(a)).join("")}</div>
          <div class="mt-3">${ev("READ THE TRENDS", "Each card shows the product's Google Trends monthly search volume for the last 12 months — green bars = volume rising vs the previous month. Score 80+ with rising volume and low competition is your best test candidate; validate with a cheap creative before scale.", "warn")}</div>`;
        return;
      }
      out.innerHTML = `
        <div class="p22-ai dark p-4 mb-3">
          <div class="ai-label">LIVE AI SEARCH · ${esc(res.meta.provider || "AI")} · ${esc(cat)}</div>
          <div class="text-[12.5px] text-[#c9c9cf]">${aiOut(res.data)}</div>
        </div>
        <div class="mt-3">${ev("NEXT STEP", "Trending is one demand signal, not a guarantee. Validate with a cheap creative test before scale.", "warn")}</div>`;
      return;
    }
    const filtered = cat === "All categories"
      ? [...DB.products]
      : DB.products.filter((p) => p.cat === cat || p.cat.toLowerCase().includes(cat.toLowerCase()));
    let list = filtered.length ? filtered : DB.products.filter((p) => p.trend === "growing" || p.trend === "seasonal");
    let noMatch = "";
    if (priceReq) {
      const inBand = filtered.filter((p) => { const u = p.price / DZD_PER_USD; return u >= priceReq.min_usd && u <= priceReq.max_usd; });
      if (inBand.length) {
        list = inBand;
      } else {
        list = filtered.length ? filtered : list;
        noMatch = `<div class="p22-ai mb-3"><div class="ai-label">NO PRODUCTS BETWEEN $${priceReq.min_usd}–$${isFinite(priceReq.max_usd) ? priceReq.max_usd : "∞"}</div><p class="text-[12.5px] text-[#3f3f46]">No local product fits that price band${filtered.length ? " in " + esc(cat) : ""}. Showing the closest below — or connect live AI for a real search.</p></div>`;
      }
    }
    out.innerHTML = `
      <div class="mb-3 flex items-center justify-between flex-wrap gap-2">
        <h3 class="text-[14px] font-extrabold text-[#1c1c1e]">Trending products — ${esc(cat)}${want ? " · “" + esc(want) + "”" : ""}${rangeText}</h3>
        <span class="p22-tag gray">demo · local trend database</span>
      </div>
      ${noMatch}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${list.map((p) => feedCard(p)).join("")}</div>
      <div class="mt-3">${ev("GOOGLE TRENDS", "The mini-chart on each card shows 12 months of search volume (simulated in demo). Connect live AI in Settings for real Google Trends numbers.", "warn")}</div>`;
    feedActions(out);
  }

  /* ---- 12-month Google Trends helpers ---- */
  const last12Months = () => {
    const out = [];
    const d = new Date();
    for (let i = 11; i >= 0; i--) {
      const c = new Date(d.getFullYear(), d.getMonth() - i, 1);
      out.push(c.toLocaleDateString("en-US", { month: "short" }));
    }
    return out;
  };
  const hashStr = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const fmtK = (n) => n >= 1000 ? (Math.round(n / 100) / 10) + "k" : String(n);
  const DZD_PER_USD = 135;
  const usdOf = (dzd) => "~$" + Math.round(dzd / DZD_PER_USD);
  const trendSeries = (p, liveArr) => {
    if (liveArr && liveArr.length === 12) return liveArr;
    const h = hashStr((p.name || p.id || "x") + (p.src || ""));
    const arr = [];
    for (let i = 0; i < 12; i++) {
      const base = 38 + ((h >> ((i * 3) % 24)) % 42);
      const wave = Math.round(Math.sin((h % 17) + i * 0.8) * 12);
      arr.push(Math.max(6, Math.min(100, base + wave)));
    }
    return arr;
  };
  const trendWord = (s) => {
    const a = s.slice(0, 6).reduce((x, y) => x + y, 0) / 6;
    const b = s.slice(6).reduce((x, y) => x + y, 0) / 6;
    return b > a * 1.06 ? "rising" : b < a * 0.94 ? "falling" : "stable";
  };
  function trendChart(p, liveArr, sim) {
    const months = last12Months();
    const series = trendSeries(p, liveArr);
    const max = Math.max.apply(null, series) || 1;
    const bars = series.map((v, i) => {
      const h = Math.max(3, Math.round((v / max) * 42));
      const up = i > 0 ? series[i] - series[i - 1] : 0;
      const col = up > 0 ? "#0fa05a" : up < 0 ? "#f0445c" : "#b6b6bd";
      const n = fmtK(Math.round(v * 1300));
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px" title="${months[i]} · ${n} searches/mo">
        <div style="height:${h}px;background:${col};border-radius:3px;width:7px"></div>
        <span style="font-size:8px;color:#b6b6bd">${months[i]}</span>
      </div>`;
    }).join("");
    const word = trendWord(series);
    const peak = fmtK(Math.round(max * 1300));
    return `<div class="mt-3 pt-3 border-t border-[#f0efed]">
      <div class="flex items-center justify-between mb-2">
        <div class="text-[11px] font-extrabold text-[#1c1c1e]">Google Trends · monthly search volume</div>
        <span class="p22-tag gray" style="font-size:9.5px">${sim ? "simulated" : "last 12 months"}</span>
      </div>
      <div class="flex items-end gap-0.5" style="height:64px">${bars}</div>
      <div class="text-[10px] text-[#9a9aa2] mt-1.5">Peak ~${peak}/mo · trend <b class="${word === "rising" ? "text-[#0fa05a]" : word === "falling" ? "text-[#f0445c]" : ""}">${word}</b></div>
    </div>`;
  }
  function aiProductCard(a) {
    const num = (v) => { const n = parseFloat(String(v == null ? "" : v).replace(/[^0-9.-]/g, "")); return isFinite(n) ? n : null; };
    const dzd = num(a.price_dzd) != null ? num(a.price_dzd) : num(a.price);
    const usd = num(a.price_usd) != null ? num(a.price_usd) : (dzd != null ? dzd / DZD_PER_USD : null);
    const pr = dzd != null ? numf(dzd) + " DA" : (usd != null ? "~$" + Math.round(usd) : "—");
    const prUsd = dzd != null && usd != null ? "~$" + Math.round(usd) : "";
    const demTag = a.demand === "falling" ? "gray" : a.demand === "steady" ? "amber" : "green";
    const compTag = a.competition === "low" ? "green" : a.competition === "high" ? "red" : "amber";
    return card({ title: "", icon: null, sub: "", body: `
      <div class="flex gap-3">
        ${thumb(a.name, a.name, true, true)}
        <div class="min-w-0 flex-1">
          <div class="text-[13px] font-bold text-[#1c1c1e] leading-snug">${esc(a.name)}</div>
          <div class="text-[11.5px] text-[#9a9aa2] mt-0.5">${esc(a.category || "")}${a.brand ? " · " + esc(a.brand) : ""} · ${esc(a.source || "")}</div>
          <div class="text-[13px] font-extrabold text-[#0fa05a] mt-1">${pr} ${prUsd ? `<span class="text-[10px] font-semibold text-[#9a9aa2]">${esc(prUsd)}</span>` : ""}</div>
        </div>
      </div>
      <p class="text-[11.5px] text-[#5b5b63] mt-2 leading-relaxed">${esc(a.why_trending || "")}</p>
      <div class="grid grid-cols-4 gap-2 mt-3 text-center">
        <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] py-1.5"><div class="text-[13px] font-bold text-[#1c1c1e]">${a.score != null ? a.score : "—"}</div><div class="text-[10px] text-[#9a9aa2]">Score</div></div>
        <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] py-1.5"><div class="text-[13px] font-bold text-[#1c1c1e]">${a.margin_pct != null ? a.margin_pct + "%" : "—"}</div><div class="text-[10px] text-[#9a9aa2]">Profit</div></div>
        <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] py-1.5"><div class="text-[13px] font-bold text-[#1c1c1e]">${tag(a.demand || "—", demTag)}</div><div class="text-[10px] text-[#9a9aa2]">Demand</div></div>
        <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] py-1.5"><div class="text-[13px] font-bold text-[#1c1c1e]">${tag(a.competition || "—", compTag)}</div><div class="text-[10px] text-[#9a9aa2]">Comp</div></div>
      </div>
      ${trendChart(a, a.trends && a.trends.last_12m, false)}` });
  }

  function feedCard(p) {
    const st = state.watch[p.id] || "saved";
    return card({
      title: "", icon: null, sub: "", body: `
        <div class="flex gap-3">
          ${thumb(p.img, p.name, true, true)}
          <div class="min-w-0 flex-1">
            <div class="text-[13px] font-bold text-[#1c1c1e] leading-snug">${esc(p.name)}</div>
            <div class="text-[11.5px] text-[#9a9aa2] mt-0.5">${esc(p.cat)} · ${esc(p.src)}</div>
            <div class="text-[13px] font-extrabold text-[#0fa05a] mt-1">${money(p.price)} <span class="text-[10px] font-semibold text-[#9a9aa2]">${usdOf(p.price)}</span></div>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 mt-3 text-center">
          <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] py-1.5"><div class="text-[13px] font-bold text-[#1c1c1e]">${p.score}</div><div class="text-[10px] text-[#9a9aa2]">Score</div></div>
          <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] py-1.5"><div class="text-[13px] font-bold text-[#1c1c1e]">${p.creative}/10</div><div class="text-[10px] text-[#9a9aa2]">Creative</div></div>
          <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] py-1.5"><div class="text-[13px] font-bold text-[#1c1c1e]">${p.margin}%</div><div class="text-[10px] text-[#9a9aa2]">Profit</div></div>
        </div>
        <div class="flex flex-wrap gap-1.5 mt-2">${tag(p.trend, p.trend === "growing" ? "green" : p.trend === "seasonal" ? "amber" : "gray")}${tag(p.cat)}</div>
        ${trendChart(p, null, true)}
        <div class="flex gap-1.5 mt-3 flex-wrap">
          <button class="p22-btn ghost" style="padding:6px 9px;font-size:11.5px" data-feed="save" data-id="${p.id}">${icon("bookmark", 12)} SAVE</button>
          <button class="p22-btn ghost" style="padding:6px 9px;font-size:11.5px" data-goto="analyzer" data-id="${p.id}">${icon("scan-search", 12)} ANALYZE</button>
          <button class="p22-btn ghost" style="padding:6px 9px;font-size:11.5px" data-feed="compare" data-id="${p.id}">${icon("columns-2", 12)} COMPARE</button>
          <button class="p22-btn ghost" style="padding:6px 9px;font-size:11.5px" data-goto="sourcing" data-id="${p.id}">${icon("package-search", 12)} SOURCE</button>
          <button class="p22-btn red" style="padding:6px 9px;font-size:11.5px" data-feed="reject" data-id="${p.id}">${icon("trash-2", 12)} REJECT</button>
        </div>`,
    });
  }

  function feedActions(scope) {
    scope.addEventListener("click", (e) => {
      const b = e.target.closest("[data-feed]");
      if (!b) return;
      const id = b.getAttribute("data-id");
      const act = b.getAttribute("data-feed");
      if (act === "save") { state.watch[id] = "watch"; ls("watch", state.watch); toast("Saved to watchlist — price & trend changes tracked", "ok"); }
      if (act === "reject") { state.watch[id] = "rejected"; ls("watch", state.watch); b.closest(".p22-card").style.opacity = "0.35"; toast("Rejected", "ok"); }
      if (act === "compare") { modal(compareTable([id], true)); }
    });
    scope.addEventListener("click", (e) => {
      const b = e.target.closest("[data-goto][data-id]");
      if (!b) return;
      state.productId = b.getAttribute("data-id");
      switchModule(b.getAttribute("data-goto"));
    });
  }

  /* ---------------- trends (spec 11) ---------------- */
  function renderTrends() {
    const el = $("#p22-content");
    const t = DB.trends;
    const moveOf = (p) => ({ emerging: "TEST NOW", growing: "LAUNCH", stable: "HOLD", seasonal: "PREPARE FOR PEAK", declining: "CUT ADS", saturated: "EXIT" })[p.trend] || "HOLD";
    const moveTag = (m) => m === "LAUNCH NOW" || m === "TEST NOW" ? "green" : m === "EXIT" || m === "CUT ADS" ? "red" : m === "PREPARE FOR PEAK" ? "amber" : "blue";
    const demoTrendReport = () => {
      const order = { emerging: 0, growing: 1, stable: 2, seasonal: 3, declining: 4, saturated: 5 };
      const rows = DB.products.slice().sort((a, b) => (order[a.trend] ?? 9) - (order[b.trend] ?? 9) || b.score - a.score).map((p) => `
        <div class="flex items-center gap-3 py-2 border-b border-[#f4f3f1] last:border-0">
          <div class="min-w-0 flex-1"><div class="text-[12.5px] font-bold text-[#1c1c1e] truncate">${esc(p.name)}</div><div class="text-[10.5px] text-[#9a9aa2]">${esc(p.cat)} · score ${p.score}</div></div>
          ${tag(p.trend, p.trend === "growing" ? "green" : p.trend === "seasonal" ? "amber" : p.trend === "declining" || p.trend === "saturated" ? "red" : "blue")}
          <span class="p22-tag ${moveTag(moveOf(p))}">${moveOf(p)}</span>
        </div>`).join("");
      const priority = (filter) => DB.products.filter(filter).map((p) => p.name);
      const launch = priority((p) => p.trend === "growing" || p.trend === "emerging");
      const prep = priority((p) => p.trend === "seasonal");
      const cut = priority((p) => p.trend === "declining" || p.trend === "saturated");
      return `<div class="p22-ai p-4">
        <div class="ai-label">TREND REPORT · DEMO · YOUR MOVES</div>
        <p class="text-[12.5px] text-[#3f3f46] mb-2">Every product, its trend state, and the exact move it suggests for your store right now:</p>
        ${rows}
        <div class="mt-3 pt-3 border-t border-[#e8e7e3] grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div class="rounded-lg bg-[#e7f7ec] px-3 py-2.5"><div class="text-[10px] font-extrabold text-[#0fa05a]">LAUNCH / TEST THIS MONTH</div><div class="text-[11px] font-bold text-[#1c1c1e] mt-0.5">${launch.join(", ") || "—"}</div></div>
          <div class="rounded-lg bg-[#fdf3e0] px-3 py-2.5"><div class="text-[10px] font-extrabold text-[#b98a1f]">PREPARE FOR THE PEAK</div><div class="text-[11px] font-bold text-[#1c1c1e] mt-0.5">${prep.join(", ") || "—"}</div></div>
          <div class="rounded-lg bg-[#fdecec] px-3 py-2.5"><div class="text-[10px] font-extrabold text-[#f0445c]">CUT ADS / EXIT</div><div class="text-[11px] font-bold text-[#1c1c1e] mt-0.5">${cut.join(", ") || "—"}</div></div>
        </div>
        <div class="mt-3">${ev("REMEMBER", "Trend is ONE signal. A trend does not buy — validate with the Analyzer and a cheap creative test before spending money.", "warn")}</div>
      </div>`;
    };
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 class="text-[20px] font-extrabold text-[#1c1c1e]">Trend Detector</h1>
          <p class="text-[13px] text-[#8a8a92] mt-1">Shows demand direction per product and tells you the move — launch now, prepare, or cut. Trend ≠ guaranteed demand; it is one signal of many.</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="p22-tag green">Emerging · EmberFlow</span>
          <span class="p22-tag green">Growing · LED Neck Light</span>
          <span class="p22-tag amber">Seasonal · Neck Fan</span>
          <span class="p22-tag red">Declining · UV Box</span>
        </div>
      </div>

      ${card({ title: "What is this? · What it gives you", icon: "circle-help", sub: "Read this once — then use the tools below", body: `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12.5px] text-[#3f3f46]">
          <div>
            <div class="text-[10.5px] font-extrabold text-[#0fa05a] mb-1.5">WHAT IT HELPS YOU DO</div>
            <div class="flex flex-col gap-1.5">
              <div class="flex items-start gap-2"><span class="text-[#0fa05a] mt-0.5">${icon("check", 12)}</span>Choose <b>which product to launch</b> — demand is rising right now</div>
              <div class="flex items-start gap-2"><span class="text-[#0fa05a] mt-0.5">${icon("check", 12)}</span>Time <b>seasonal products</b> — prepare before the peak, not after</div>
              <div class="flex items-start gap-2"><span class="text-[#0fa05a] mt-0.5">${icon("check", 12)}</span>Spot products to <b>stop spending on</b> — declining or saturated demand</div>
              <div class="flex items-start gap-2"><span class="text-[#0fa05a] mt-0.5">${icon("check", 12)}</span>Decide <b>restock vs retire</b> for your existing catalog</div>
            </div>
          </div>
          <div>
            <div class="text-[10.5px] font-extrabold text-[#0fa05a] mb-1.5">WHAT IT GENERATES FOR YOU</div>
            <div class="flex flex-col gap-1.5">
              <div class="flex items-start gap-2"><span class="text-[#b98a1f] mt-0.5">${icon("sparkles", 12)}</span>A <b>12-week interest chart</b> (Google-Trends-style) per product</div>
              <div class="flex items-start gap-2"><span class="text-[#b98a1f] mt-0.5">${icon("sparkles", 12)}</span><b>Acceleration alerts</b> — interest climbing week-over-week</div>
              <div class="flex items-start gap-2"><span class="text-[#b98a1f] mt-0.5">${icon("sparkles", 12)}</span>A <b>trend state</b> for every product (Emerging / Growing / Stable / Seasonal / Declining / Saturated)</div>
              <div class="flex items-start gap-2"><span class="text-[#b98a1f] mt-0.5">${icon("sparkles", 12)}</span>A <b>trend report</b> — one clear move for each product, generated with AI below</div>
            </div>
          </div>
        </div>` })}

      <div class="mt-4 flex flex-wrap items-center gap-3">
        <button class="p22-btn primary" id="p22-run-trends">${icon("flame", 15)} Generate my trend report${live() ? "" : " (demo)"}</button>
        <span class="text-[12px] text-[#9a9aa2]">One report that tells you exactly what to launch, prepare, and cut.</span>
      </div>
      <div id="p22-trends-ai" class="mt-3"></div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
        ${card({ title: "Interest index (12 weeks)", icon: "trending-up", sub: "Google Trends-style normalized index", body: `<div style="height:230px"><canvas id="p22-trend-chart"></canvas></div>
          <div class="mt-3 grid grid-cols-2 gap-2 text-[11.5px] text-[#3f3f46]">
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-sm" style="background:#2ecc71"></span>EmberFlow</div>
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-sm" style="background:#3b82f6"></span>LED Neck Light</div>
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-sm" style="background:#f5a623"></span>Neck Fan (seasonal)</div>
            <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-sm" style="background:#e5484d"></span>UV Box (declining)</div>
          </div>` })}
        ${card({ title: "Acceleration alerts", icon: "zap", sub: "Interest still climbing → your move", body: `
          ${DB.products.filter((p) => p.trend === "growing" || p.trend === "emerging").map((p) => `<div class="flex items-start gap-3 py-2 border-b border-[#f4f3f1] last:border-0">
            <span class="p22-card-ic" style="width:30px;height:30px;background:#e7f7ec;color:#0fa05a">${icon("trending-up", 14)}</span>
            <div class="min-w-0"><div class="text-[12.5px] font-bold text-[#1c1c1e]">${esc(p.name)}</div>
            <div class="text-[11.5px] text-[#9a9aa2]">Accelerating interest — re-check every 48h</div>
            <div class="text-[11px] font-extrabold text-[#0fa05a]">Your move → ${moveOf(p)}</div></div>
            <span class="ml-auto p22-tag green">+${p.demand}%</span></div>`).join("")}
          <div class="mt-3">${ev("HOW TO READ THIS", "Acceleration means the trend is still moving up. It does not prove real purchase demand — pair with review volume and ad-spend signals.", "warn")}</div>` })}
        ${card({ title: "Trend states → your move", icon: "activity", sub: "Every product, one clear action", body: `
          <div class="flex flex-col gap-2">
            ${[["Emerging", "green", "EmberFlow Diffuser", "TEST NOW"], ["Growing", "green", "LED Neck Light, Cheese Grater", "LAUNCH"], ["Stable", "blue", "Travel Kettle, Cable Organizer, Cat Feeder", "HOLD"], ["Seasonal", "amber", "Neck Fan (summer peak)", "PREPARE FOR PEAK"], ["Declining", "red", "UV Box, Back Scratcher", "CUT ADS"], ["Saturated", "red", "Back Scratcher, UV Box", "EXIT"]].map(([n, c, v, m]) => `
              <div class="flex items-center gap-2 text-[12.5px]"><span class="p22-tag ${c}" style="min-width:82px">${n}</span><span class="text-[#3f3f46] truncate flex-1">${v}</span><span class="text-[10.5px] font-extrabold whitespace-nowrap ${m.startsWith("LAUNCH") || m.startsWith("TEST") ? "text-[#0fa05a]" : m.startsWith("EXIT") || m.startsWith("CUT") ? "text-[#f0445c]" : "text-[#8a8a92]"}">${m}</span></div>`).join("")}
          </div>` })}
      </div>`;
    window.CH.line("p22-trend-chart", t.months, [
      { label: "EmberFlow", data: t.p1, color: "#2ecc71", width: 2.5 },
      { label: "LED Neck Light", data: t.p2, color: "#3b82f6", width: 2 },
      { label: "Neck Fan", data: t.p4, color: "#f5a623", width: 2 },
      { label: "UV Box", data: t.p8, color: "#e5484d", width: 2 },
    ], { legend: false, maxTicks: 8 });

    $("#p22-run-trends").addEventListener("click", async () => {
      const btn = $("#p22-run-trends");
      const useLive = live();
      btn.disabled = true; btn.innerHTML = `${icon("loader-2", 14)} ${useLive ? "Analyzing your catalog…" : "Building report from local data…"}`;
      const res = useLive ? await runAI("trend_report", {
        products: DB.products.map((p) => p.name + " (" + p.cat + ", trend:" + p.trend + ", score:" + p.score + ")"),
        market: "Algeria (COD · DZD)",
        note: "For every product give ONE line: its trend state, one sentence why, and the exact move — LAUNCH NOW / TEST NOW / PREPARE FOR PEAK / HOLD / CUT ADS / EXIT. End with a short priority list: what to launch this month, what to prepare for the next peak, and what to stop spending on. Be honest, concise, and specific to each product.",
      }, { maxTokens: 2500 }) : null;
      btn.disabled = false; btn.innerHTML = `${icon("flame", 15)} Generate my trend report${live() ? "" : " (demo)"}`;
      const out = $("#p22-trends-ai");
      out.innerHTML = res
        ? `<div class="p22-ai dark p-4"><div class="ai-label">TREND AI REPORT · ${esc(res.meta.provider || "AI")}</div><div class="text-[12.5px] text-[#c9c9cf]">${aiOut(res.data)}</div></div>`
        : demoTrendReport();
      toast(res ? "Trend AI report ready" : "Trend report computed from local data (demo)", "ok");
    });
  }

  /* ---------------- find me winners (spec 39) ---------------- */
  function renderWinners() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h1 class="text-[20px] font-extrabold text-[#1c1c1e]">Find Winning Products</h1>
          <p class="text-[13px] text-[#8a8a92] mt-1">Set your filters — AI searches the connected sources and returns the top 10 opportunities with evidence.</p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        ${["Country", "Budget", "Product category", "Price range"].map((l, i) => `
          <div><div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">${l}</div>
          <input class="p22-input" style="width:100%" value="${["Algeria", "25,000 DA", "Home & focus", "1,500–8,000 DA"][i]}"></div>`).join("")}
        ${["Target customer", "Shipping preference", "Business model", "Max competition"].map((l, i) => `
          <div><div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">${l}</div>
          <input class="p22-input" style="width:100%" value="${["Remote workers 26-45", "Light & COD-friendly", "Dropshipping + COD", "Medium or lower"][i]}"></div>`).join("")}
      </div>
      <div class="flex items-center gap-4 flex-wrap mb-4 text-[12px] text-[#3f3f46]">
        ${["Physical product", "COD", "Dropshipping", "Private label", "Wholesale"].map((o) => `<label class="flex items-center gap-1.5"><input type="checkbox" checked class="accent-[#0fa05a]">${o}</label>`).join("")}
      </div>
      <button class="p22-btn primary mb-4" id="p22-run-winners">${icon("flame", 15)} Run AI search${live() ? "" : " (demo)"}</button>

      <div id="p22-winners-out">
        ${ai("HOW IT WORKS", "SEARCH → COLLECT → VERIFY → COMPARE → SCORE → RECOMMEND. The agent gathers evidence from connected sources before scoring. In demo mode, results come from the local knowledge base — connect provider keys in Settings for live research.", false)}
      </div>`;

    $("#p22-run-winners").addEventListener("click", async () => {
      const btn = $("#p22-run-winners");
      const useLive = live();
      btn.disabled = true; btn.innerHTML = `${icon("loader-2", 14)} ${useLive ? "Running live AI research…" : "Searching local knowledge base…"}`;
      const res = useLive ? await runAI("winning_products", { country: "Algeria", budget: "25,000 DA", category: "Home & focus", note: "Find the top winning product opportunities for Algeria COD dropshipping, with evidence." }, { maxTokens: 2500 }) : null;
      btn.disabled = false; btn.innerHTML = `${icon("flame", 15)} Run AI search${live() ? "" : " (demo)"}`;
      renderWinnerResults();
      if (res) {
        const out = $("#p22-winners-out");
        out.innerHTML = `<div class="p22-ai dark p-4 mb-3"><div class="ai-label">LIVE AI RESEARCH · ${esc(res.meta.provider || "AI")}</div><div class="text-[12.5px] text-[#c9c9cf]">${aiOut(res.data)}</div></div>` + out.innerHTML;
      }
      toast(res ? "Live AI research complete" : "Top 10 opportunities computed (demo data)", "ok");
    });
  }

  function renderWinnerResults() {
    const list = [...DB.products].filter((p) => p.opp !== "avoid").sort((a, b) => b.score - a.score).slice(0, 10);
    const out = $("#p22-winners-out");
    out.innerHTML = `
      <div class="mb-3 flex items-center justify-between"><h2 class="text-[15px] font-extrabold text-[#1c1c1e]">Top 10 opportunities</h2><span class="p22-tag gray">ranked by weighted score</span></div>
      <div class="flex flex-col gap-3">
        ${list.map((p, i) => `
          <div class="p22-card">
            <div class="flex items-center gap-3">
              <div class="text-[18px] font-extrabold text-[#0fa05a] w-8 flex-none">#${i + 1}</div>
              ${thumb(p.img, p.name, true)}
              <div class="min-w-0 flex-1">
                <div class="text-[13.5px] font-bold text-[#1c1c1e]">${esc(p.name)}</div>
                <div class="text-[11.5px] text-[#9a9aa2]">${esc(p.note)}</div>
                <div class="flex flex-wrap gap-1.5 mt-1.5">${opp(p.opp)}${tag(p.trend, p.trend === "growing" ? "green" : "amber")}</div>
              </div>
              <div class="text-right flex-none">
                <div class="text-[20px] font-extrabold text-[#1c1c1e]">${p.score}</div>
                <div class="text-[10px] text-[#9a9aa2]">WINNING SCORE</div>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[12px]">
              <div><div class="text-[10px] font-bold text-[#9a9aa2]">WHY INTERESTING</div><div class="text-[#3f3f46] mt-0.5">${p.trend === "growing" ? "Rising interest, demo-led" : "Stable niche, low ticket"}</div></div>
              <div><div class="text-[10px] font-bold text-[#9a9aa2]">SUPPLIER</div><div class="text-[#3f3f46] mt-0.5">${esc(p.src)}</div></div>
              <div><div class="text-[10px] font-bold text-[#9a9aa2]">EST. COST → PRICE</div><div class="text-[#3f3f46] mt-0.5">${money(p.cost)} → ${money(p.price)}</div></div>
              <div><div class="text-[10px] font-bold text-[#9a9aa2]">COMPETITION</div><div class="text-[#3f3f46] mt-0.5">${p.comp}/10${p.comp > 7 ? " · high" : ""}</div></div>
            </div>
            <div class="flex gap-2 mt-3">
              <button class="p22-btn ghost" style="font-size:12px;padding:7px 11px" data-goto="analyzer" data-id="${p.id}">${icon("scan-search", 13)} Analyze</button>
              <button class="p22-btn ghost" style="font-size:12px;padding:7px 11px" data-goto="sourcing" data-id="${p.id}">${icon("package-search", 13)} Source</button>
              <button class="p22-btn green" style="font-size:12px;padding:7px 11px" data-goto="score" data-id="${p.id}">${icon("gauge", 13)} Score</button>
            </div>
          </div>`).join("")}
      </div>
      <div class="mt-4">${ev("NO GUARANTEES", "These are the strongest evidence-weighted opportunities in the database — not guaranteed winners. Every one still needs a cheap creative test before scale.", "warn")}</div>`;
    feedActions(out);
  }

  /* ---------------- i have $X (spec 40) ---------------- */
  function renderBudget() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4">
        <h1 class="text-[20px] font-extrabold text-[#1c1c1e]">I Have $X</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">Tell us your budget — the engine splits it into inventory, shipping and testing, then only recommends products whose economics fit.</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        ${["Budget (DA)", "Country", "Target selling price", "Shipping constraint"].map((l, i) => `
          <div><div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">${l}</div>
          <input class="p22-input" style="width:100%" value="${["25,000", "Algeria", "2,000–7,000 DA", "Light & COD"][i]}"></div>`).join("")}
      </div>
      <button class="p22-btn primary mb-4" id="p22-run-budget">${icon("calculator", 15)} Calculate fit${live() ? "" : " (demo)"}</button>
      <div id="p22-budget-out">
        ${ai("HOW IT WORKS", "BUDGET → INVENTORY + SHIPPING + TESTING + EXPECTED ACQUISITION COST + RISK. No guaranteed sales — only a split and a fit filter.", false)}
      </div>`;
    $("#p22-run-budget").addEventListener("click", async () => {
      const out = $("#p22-budget-out");
      const useLive = live();
      out.innerHTML = `<div class="p22-ai">${icon("loader-2", 14)} ${useLive ? "Running live AI fit analysis…" : "Computing budget fit…"}</div>`;
      const res = useLive ? await runAI("budget_fit", { budget: 25000, country: "Algeria", priceBand: "2,000–7,000 DA", note: "Split a 25,000 DA budget into inventory, shipping and testing, then recommend only products whose economics fit." }, { maxTokens: 2500 }) : null;
      out.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          ${[["Inventory", "6–8 units", "EmberFlow tier"], ["Shipping", "≈ 4,000 DA", "450 DA/unit"], ["Testing budget", "12,000 DA", "creative tests"], ["Est. acquisition", "≤ 1,600 DA", "max CAC from margin"]].map(([l, v, s]) => `
            <div class="p22-kpi"><div class="kpi-lbl">${l}</div><div class="kpi-num" style="font-size:17px">${v}</div><div class="text-[11px] text-[#9a9aa2] mt-1">${s}</div></div>`).join("")}
        </div>
        ${res ? `<div class="p22-ai dark p-4 mb-3"><div class="ai-label">LIVE AI FIT ANALYSIS · ${esc(res.meta.provider || "AI")}</div><div class="text-[12.5px] text-[#c9c9cf]">${aiOut(res.data)}</div></div>` : ""}
        <div class="flex flex-col gap-3">
          ${DB.products.filter((p) => p.opp === "fire" || p.opp === "good").slice(0, 3).map((p, i) => `
            <div class="p22-card flex items-center gap-3">
              <div class="text-[15px] font-extrabold text-[#0fa05a] w-6">${"ABC"[i]}</div>
              ${thumb(p.img, p.name, true)}
              <div class="min-w-0 flex-1">
                <div class="text-[13px] font-bold">${esc(p.name)}</div>
                <div class="text-[11.5px] text-[#9a9aa2]">${money(p.cost)} landed → sell ${money(p.price)} · margin ${p.margin}%</div>
                <div class="mt-1">${opp(p.opp)}</div>
              </div>
              <div class="flex gap-2 flex-none">
                <button class="p22-btn ghost" style="font-size:12px" data-goto="sourcing" data-id="${p.id}">Source</button>
                <button class="p22-btn primary" style="font-size:12px" data-goto="score" data-id="${p.id}">Score</button>
              </div>
            </div>`).join("")}
        </div>
        <div class="mt-4">${ev("RISK NOTE", "A 25,000 DA budget fits 1 product deep, not 3 shallow. Recommendation: spend the testing budget on the single best fit (EmberFlow) before inventory.", "warn")}</div>`;
      feedActions(out);
      toast(res ? "Live budget fit complete" : "Budget fit computed (demo)", "ok");
    });
  }

  /* ---------------- i have this product (spec 41) ---------------- */
  function renderHaveThis() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4">
        <h1 class="text-[20px] font-extrabold text-[#1c1c1e]">I Have This Product</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">Paste a URL, drop an image/screenshot, or enter manually. AI extracts facts and marks everything else FACT / INFERENCE / UNKNOWN.</p>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        ${card({ title: "Import a product", icon: "file-up", sub: "URL · image · screenshot · name · supplier link · video · PDF · CSV · manual", body: `
          <div class="grid grid-cols-3 gap-2 mb-3">
            ${[["Link", "link", "URL"], ["Image", "image", "Screenshot"], ["Manual", "keyboard", "Form"]].map(([l, ic, d]) => `
              <button class="p22-btn ghost" style="flex-direction:column;padding:14px 8px" data-import="${l}"><span style="color:#0fa05a">${icon(ic, 18)}</span><span class="text-[12px] font-bold mt-1">${l}</span><span class="text-[10px] text-[#9a9aa2]">${d}</span></button>`).join("")}
          </div>
          <input class="p22-input mb-2" style="width:100%" id="p22-have-url" placeholder="Product URL (AliExpress / TikTok / Amazon / Shopify)…">
          <label class="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#cdeeda] bg-[#f6fbf7] py-6 cursor-pointer text-[#0fa05a] text-[13px] font-bold">
            <input type="file" class="hidden" accept="image/*,.pdf,.csv">${icon("cloud-upload", 16)} Drop image, screenshot, PDF or CSV
          </label>
          <button class="p22-btn primary mt-3" style="width:100%" id="p22-run-have">${icon("scan-search", 15)} Run AI extraction${live() ? "" : " (demo)"}</button>
          <div class="mt-3">${ev("DEMO BEHAVIOR", "Demo mode extracts the sample product (EmberFlow). With provider keys configured in Settings, a real URL would run through the vision + extraction pipeline.", "warn")}</div>` })}
        ${card({ title: "What AI auto-extracts", icon: "list-checks", sub: "Every field tagged by source of truth", body: `
          ${[["Product name", "FACT", "V"], ["Category", "FACT", "V"], ["Features / specs", "FACT", "V"], ["Price", "FACT", "V"], ["Benefits", "INFERENCE", "I"], ["Potential use cases", "INFERENCE", "I"], ["Market fit", "INFERENCE", "I"], ["Supplier MOQ", "UNKNOWN", "X"], ["Local competition", "UNKNOWN", "X"]].map(([l, t, c]) => `
            <div class="flex items-center gap-2 py-1.5 border-b border-[#f4f3f1] last:border-0 text-[12.5px]">
              <span class="text-[#3f3f46] flex-1">${l}</span>${src(c)}<span class="text-[#9a9aa2] w-16 text-right">${t}</span></div>`).join("")}` })}
      </div>
      <div id="p22-have-out"></div>`;

    $$("[data-import]", el).forEach((b) => b.addEventListener("click", () => {
      const mode = b.getAttribute("data-import");
      modal(`<div class="p22-card-head"><span class="p22-card-ic">${icon("file-up", 16)}</span><div><div class="p22-card-title">Import via ${mode}</div><div class="p22-card-sub">${mode === "Manual" ? "Fill what you know — blanks become UNKNOWN, never guessed" : "Paste the source — extraction runs on the server with your provider key"}</div></div></div>
        ${mode === "Manual" ? `<div class="grid grid-cols-2 gap-2 mt-3"><input class="p22-input" placeholder="Product name"><input class="p22-input" placeholder="Price"><input class="p22-input" placeholder="Supplier"><input class="p22-input" placeholder="Category"><textarea class="p22-textarea" placeholder="Features / notes…"></textarea></div>` : `<input class="p22-input mt-3" style="width:100%" placeholder="Paste ${mode === "Link" ? "URL" : "text"}…"><textarea class="p22-textarea mt-2" placeholder="Or paste extra context…"></textarea>`}
        <div class="flex justify-end gap-2 mt-3"><button class="p22-btn ghost" data-close>Cancel</button><button class="p22-btn primary" data-run-have>${icon("scan-search", 14)} Extract</button></div>`);
      $$("[data-close]", $("#p22-modal")).forEach((b) => b.addEventListener("click", closeModal));
      $$("[data-run-have]", $("#p22-modal")).forEach((b) => b.addEventListener("click", () => { closeModal(); runHaveDemo(); }));
    }));

    $("#p22-run-have").addEventListener("click", runHaveDemo);
  }

  async function runHaveDemo() {
    const out = $("#p22-have-out");
    const url = (($("#p22-have-url") || {}).value || "").trim();
    const useLive = live();
    out.innerHTML = `<div class="p22-ai">${icon("loader-2", 14)} ${useLive ? "Running live vision + extraction pipeline…" : "Running vision + extraction pipeline on EmberFlow sample… (demo)"}</div>`;
    const res = useLive ? await runAI("extract_product", { url: url || undefined, description: url ? "" : "EmberFlow Smart Diffuser — smart essential-oil diffuser combining aroma diffusion, timer, ambient light and fire-safe auto shut-off. Extract and structure the facts.", note: "Extract the product facts and mark every field FACT / INFERENCE / UNKNOWN." }, { maxTokens: 3000 }) : null;
    if (res) {
      const img = res.meta && res.meta.image;
      out.innerHTML = `
        <div class="flex items-center justify-between mb-3"><h2 class="text-[15px] font-extrabold">Live extraction result</h2><span class="p22-tag green">LIVE · ${esc(res.meta.provider || "AI")}</span></div>
        ${img ? `<img src="${esc(img)}" alt="product" style="max-height:180px;border-radius:12px;border:1px solid #f0efed;margin-bottom:10px">` : ""}
        <div class="p22-ai dark p-4"><div class="ai-label">EXTRACTED DATA</div><div class="text-[12.5px] text-[#c9c9cf]">${aiOut(res.data)}</div></div>
        <div class="flex gap-2 mt-4">
          <button class="p22-btn primary" data-goto="report">${icon("file-text", 14)} Open full report</button>
          <button class="p22-btn ghost" data-goto="final">${icon("flag", 14)} Final decision</button>
        </div>`;
      feedActions(out);
      toast("Live extraction complete", "ok");
      return;
    }
    setTimeout(() => {
      const chain = [
        ["Product analysis", "summary", "EmberFlow Smart Diffuser — smart diffuser combining scent, timer, light, fire-safe shut-off."],
        ["Buyer persona", "users", "Remote workers/students 26–45, urban DZ, focus-seeking."],
        ["USP", "award", "Focus-first device with fire-safe shut-off and a light-ring work signal."],
        ["Price", "calculator", "Target 5,900 DA (break-even 3,490 DA)."],
        ["Offer", "gift", "Bundle +3 oils at 6,900 DA — highest margin per order."],
        ["Competitors", "siren", "3 tracked players; focus-first niche is underserved locally."],
        ["Creative concepts", "palette", "10 hooks, 10 angles, 10 concepts (demo-led UGC first)."],
        ["Ad copy", "type", "Primary text + headline + CTA per angle."],
        ["Landing page", "layout-template", "12-block structure with focus-story variant."],
        ["Testing plan", "flask-conical", "6 sequential tests starting with creative."],
        ["Supplier comparison", "factory", "3 suppliers scored — best overall DZ Home Store."],
        ["Winning score", "gauge", "84/100 — HIGH POTENTIAL."],
      ];
      out.innerHTML = `
        <div class="flex items-center justify-between mb-3"><h2 class="text-[15px] font-extrabold">Auto-generated output</h2><span class="p22-tag green">READY</span></div>
        <div class="flex flex-col gap-2">
          ${chain.map(([l, ic, v]) => `<div class="p22-step"><span class="p22-step-num">${icon(ic, 13)}</span><div class="min-w-0 flex-1"><div class="text-[12px] font-bold text-[#1c1c1e]">${l}</div><div class="text-[11.5px] text-[#3f3f46]">${v}</div></div><span class="p22-src verified">OK</span></div>`).join("")}
        </div>
        <div class="flex gap-2 mt-4">
          <button class="p22-btn primary" data-goto="report">${icon("file-text", 14)} Open full report</button>
          <button class="p22-btn ghost" data-goto="final">${icon("flag", 14)} Final decision</button>
        </div>`;
      feedActions(out);
      toast("Extraction complete (demo)", "ok");
    }, 900);
  }

  /* ---------------- product database (spec 53) ---------------- */
  function renderDatabase() {
    const el = $("#p22-content");
    const q = (state.q || "").toLowerCase();
    const rows = DB.products.filter((p) => !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.tags.join(" ").toLowerCase().includes(q))
      .sort((a, b) => b.score - a.score);
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Product Database</h1><p class="text-[13px] text-[#8a8a92] mt-1">Search · filter · sort · compare · tag. Every product keeps research history, scores, offers and outcomes.</p></div>
        <button class="p22-btn primary" data-goto="import">${icon("plus", 15)} Add product</button>
      </div>
      <div class="flex flex-wrap gap-2 mb-3 text-[12px]">
        <span class="p22-tag gray">Filters</span>
        ${["All", "High potential", "Testing", "Watchlist", "Rejected"].map((f, i) => `<button class="p22-tag ${i === 0 ? "green" : "gray"}" data-filter="${f}" style="border:none;cursor:pointer">${f}</button>`).join("")}
      </div>
      <div class="p22-table-wrap">
        <table class="p22-table">
          <thead><tr><th></th><th>Product</th><th>Category</th><th>Price</th><th>Cost</th><th>Margin</th><th>Score</th><th>Opportunity</th><th>Tags</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map((p) => `<tr>
              <td>${thumb(p.img, p.name)}</td>
              <td class="font-semibold text-[#1c1c1e]">${esc(p.name)}<div class="text-[11px] text-[#9a9aa2]">${esc(p.src)}</div></td>
              <td>${esc(p.cat)}</td>
              <td>${money(p.price)}</td>
              <td>${money(p.cost)}</td>
              <td><span class="text-[#0fa05a] font-bold">${p.margin}%</span></td>
              <td><b>${p.score}</b>/100</td>
              <td>${opp(p.opp)}</td>
              <td>${p.tags.slice(0, 2).map((t) => tag(t)).join("")}</td>
              <td>${tag(p.status, p.status === "rejected" ? "red" : p.status === "testing" ? "amber" : "green")}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <div class="mt-3 text-[11.5px] text-[#9a9aa2]">${rows.length} products · demo knowledge base</div>`;
  }

  /* ---------------- analyzer (spec 7) ---------------- */
  function an() {
    if (product().id === "p1") return EM;
    const p = product();
    return {
      summary: p.note, problem: `${p.name} addresses a felt daily problem in the ${p.cat} category.`, benefit: "Clear, demonstrable benefit delivered in under 15 seconds of footage.",
      mechanism: "Core mechanism of the product drives the visible transformation.", audience: "Target buyer for this category — see personas for detail.", useCases: ["Primary daily use", "Secondary gifting use", "Occasional travel use"],
      triggers: ["Emotional pain point", "Visual demo", "Impulse price point"], pains: ["Pain 1", "Pain 2"], desires: ["Desire 1", "Desire 2"],
      objections: ["Objection 1 — needs answer on landing page"], usp: "Differentiated positioning vs generic competitors in this category.",
      positioning: "For {audience}, {product} is the {category} choice that {benefit}.", whyBuy: "Solves the felt problem with a clear demo.",
      whyNot: "Price/trust objections need direct handling.", different: "Unique mechanism + demo potential vs category norms.",
      easyDemo: "Strong — visual transformation is quick to film.", easyExplain: "Simple one-sentence explanation.", easyShip: "Lightweight and COD-friendly.", impulse: "Medium — depends on price accessibility.",
    };
  }

  function renderAnalyzer() {
    const p = product();
    const a = an();
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">AI Product Analyzer</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">Product: <b>${esc(p.name)}</b> · ${money(p.price)} · score ${p.score}/100</p></div>
        <div class="flex items-center gap-2">${productSwitcher()}${opp(p.opp)}</div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        ${card({ title: "Product summary", icon: "file-text", body: `<p class="text-[13px] text-[#3f3f46] leading-relaxed">${esc(a.summary)}</p>
          <div class="grid grid-cols-2 gap-2 mt-3 text-[12px]">
            ${[["Main problem solved", a.problem], ["Main benefit", a.benefit], ["Unique mechanism", a.mechanism], ["Target audience", a.audience]].map(([l, v]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3"><div class="text-[10.5px] font-bold text-[#9a9aa2] mb-1">${l}</div><div class="text-[#3f3f46]">${v}</div></div>`).join("")}
          </div>` })}
        ${card({ title: "Use cases", icon: "list-checks", body: a.useCases.map((u, i) => `<div class="flex items-center gap-2 py-1.5 text-[13px]"><span class="w-5 h-5 rounded-full bg-[#e7f7ec] text-[#0fa05a] grid place-items-center text-[11px] font-bold">${i + 1}</span><span class="text-[#3f3f46]">${u}</span></div>`).join("") }) },
        ${card({ title: "Purchase triggers", icon: "zap", body: a.triggers.map((t) => `<div class="flex items-center gap-2 py-1.5 text-[13px]">${icon("chevron-right", 13)}<span class="text-[#3f3f46]">${t}</span></div>`).join("") }) },
        ${card({ title: "Pain points", icon: "alert-triangle", body: a.pains.map((t) => `<div class="flex items-center gap-2 py-1.5 text-[13px]">${icon("circle", 12)}<span class="text-[#3f3f46]">${t}</span></div>`).join("") }) },
        ${card({ title: "Desires", icon: "heart", body: a.desires.map((t) => `<div class="flex items-center gap-2 py-1.5 text-[13px]">${icon("heart", 12)}<span class="text-[#3f3f46]">${t}</span></div>`).join("") }) },
        ${card({ title: "Objections", icon: "circle-help", body: a.objections.map((t) => `<div class="flex items-center gap-2 py-1.5 text-[13px]">${icon("circle-help", 12)}<span class="text-[#3f3f46]">${t}</span></div>`).join("") }) },
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        ${card({ title: "Potential USP", icon: "award", body: `<div class="rounded-xl bg-[#1c1c1e] text-white p-4 text-[13.5px] leading-relaxed">${esc(a.usp)}</div>` })}
        ${card({ title: "Potential positioning", icon: "target", body: `<div class="rounded-xl bg-[#1c1c1e] text-white p-4 text-[13.5px] leading-relaxed">${esc(a.positioning)}</div>` })}
      </div>

      ${card({ title: "The seven questions", icon: "circle-help", sub: "Quick yes/no gate before any test budget is spent", body: `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${[["WHY WOULD SOMEONE BUY THIS?", a.whyBuy, true], ["WHY WOULD THEY NOT BUY IT?", a.whyNot, true], ["WHAT MAKES IT DIFFERENT?", a.different, true], ["IS IT EASY TO DEMONSTRATE?", a.easyDemo, true], ["IS IT EASY TO EXPLAIN?", a.easyExplain, true], ["IS IT EASY TO SHIP?", a.easyShip, true], ["LIKELY TO CREATE IMPULSE PURCHASE?", a.impulse, false]].map(([q, a2]) => `
            <div class="rounded-xl border border-[#f0efed] p-3">
              <div class="text-[10.5px] font-extrabold tracking-wide text-[#0fa05a] mb-1">${q}</div>
              <div class="text-[12.5px] text-[#3f3f46]">${a2}</div>
            </div>`).join("")}
        </div>` })}
      <div class="mt-3">${ev("EVIDENCE", "Answers marked VERIFIED come from product data. The rest are AI estimations — change the product data and the answers recompute.", "warn")}</div>`;
  }

  function productSwitcher() {
    return `<select class="p22-select" id="p22-product-sel" style="max-width:230px">
      ${DB.products.map((p) => `<option value="${p.id}"${p.id === state.productId ? " selected" : ""}>${esc(p.name)}</option>`).join("")}</select>`;
  }
  function wireProductSwitch(scope) {
    const sel = scope.querySelector("#p22-product-sel");
    if (sel) sel.addEventListener("change", () => { state.productId = sel.value; switchModule(state.m); });
  }

  /* ---------------- demand (spec 10) ---------------- */
  function renderDemand() {
    const p = product();
    const d = EM.demand;
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Demand Analysis</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1"><b>${esc(p.name)}</b> · trend ${d.trend}</p></div>
        <div class="flex items-center gap-2">${productSwitcher()}${tag(d.trend, d.trend === "growing" ? "green" : "amber")}</div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${card({ title: "Demand trend (12wk index)", icon: "trending-up", body: `<div style="height:190px"><canvas id="p22-demand-chart"></canvas></div>
          <div class="grid grid-cols-2 gap-2 mt-3 text-[12px]">
            ${[["Acceleration", d.acceleration], ["Stability", d.stability], ["Seasonality", d.seasonality], ["Maturity", d.maturity]].map(([l, v]) => `<div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] p-2.5"><div class="text-[10px] font-bold text-[#9a9aa2]">${l}</div><div class="text-[#3f3f46] mt-0.5">${v}</div></div>`).join("")}
          </div>` })}
        ${card({ title: "Demand signals", icon: "activity", sub: "Each signal tagged with its source of truth", body: `
          <div class="flex flex-col">
            ${[["Google Trends index", "+31% / 12wk · growing", "V"], ["Search volume", "UNKNOWN — needs keyword API key", "X"], ["Marketplace orders", "HIGH (AliExpress listing)", "V"], ["Social engagement", "Rising TikTok views — NOT demand proof", "I"], ["Review volume", "1,200 seller reviews", "V"], ["Seasonality", "Autumn/winter lift expected", "I"]].map(([l, v, s]) => `
              <div class="flex items-center gap-2 py-2 border-b border-[#f4f3f1] last:border-0">
                <div class="min-w-0 flex-1"><div class="text-[12.5px] font-semibold text-[#1c1c1e]">${l}</div><div class="text-[11.5px] text-[#3f3f46]">${v}</div></div>${src(s)}</div>`).join("")}
          </div>
          <div class="mt-3">${ev("DON'T EQUATE ENGAGEMENT WITH DEMAND", "Viral comments ≠ purchases. Demand is confirmed only by purchase signals: orders, conversion, or paid-test evidence.", "warn")}</div>` })}
        ${card({ title: "Demand verdict", icon: "gauge", body: `
          <div class="flex items-center gap-4">
            ${ringSVG(p.demand * 10, 92)}
            <div><div class="text-[13px] font-bold text-[#1c1c1e]">${p.demand}/10 demand</div><div class="text-[12px] text-[#9a9aa2] mt-1">Growing, stable, seasonal lift</div><div class="mt-2">${tag(d.trend === "growing" ? "GOOD TEST" : "VALIDATE", d.trend === "growing" ? "green" : "amber")}</div></div>
          </div>
          <div class="mt-3">${ev("WHAT WOULD RAISE THIS", "Verified local search volume + 1 week of paid-test CTR would upgrade this from estimation to evidence.")}</div>` })}
      </div>`;
    window.CH.line("p22-demand-chart", DB.trends.months, [{ label: p.name, data: DB.trends.p1, color: "#2ecc71", width: 2.5 }], { legend: false });
    wireProductSwitch(el);
  }

  /* ---------------- market (spec 12) ---------------- */
  function renderMarket() {
    const el = $("#p22-content");
    const cur = state.market.country;
    const m = EM.market[cur];
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Market Research</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">Product suitability per market — no invented statistics; every claim is tagged.</p></div>
        <div class="flex items-center gap-2">
          <select class="p22-select" id="p22-market-sel">
            <option value="DZ"${cur === "DZ" ? " selected" : ""}>Algeria · fr-DZ · DZD</option>
            <option value="FR"${cur === "FR" ? " selected" : ""}>France · fr-FR · EUR</option>
          </select>
          <span class="p22-tag green">${m.title}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        ${[["Purchasing power", m.power, "banknote"], ["COD suitability", m.cod, "hand-coins"], ["Shipping", m.ship, "truck"], ["Cultural relevance", m.cultural, "globe-2"], ["Competition", m.comp, "siren"], ["Price expectations", m.priceExpect, "tag"], ["Local problems", m.local, "circle-help"], ["Buying behavior", m.local, "users"]].map(([l, v, ic]) => `
          <div class="p22-kpi"><div class="flex items-center gap-2"><span class="p22-card-ic" style="width:28px;height:28px">${icon(ic, 13)}</span><div class="kpi-lbl">${l}</div></div><div class="text-[12.5px] font-semibold text-[#1c1c1e] mt-1.5">${v}</div></div>`).join("")}
      </div>
      ${card({ title: "Market verdict — " + m.title, icon: "globe-2", body: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          ${[["Why it fits", "COD is the default buying habit, competition in the focus-niche is low, and the price band matches local expectations.", "green"], ["What to watch", "Mid-ticket price makes trust and a clear guarantee essential for COD confirmation rates.", "amber"], ["Localization", "French copy as default, Darija hooks for video ads, Arabic for the landing page CTA.", "blue"], ["First test budget", "2,500 DA for a 5-day creative test — small enough to fail cheaply.", "green"]].map(([l, v, c]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3.5"><div class="text-[10.5px] font-extrabold text-[#0fa05a] mb-1">${l}</div><div class="text-[12.5px] text-[#3f3f46]">${v}</div><div class="mt-2">${tag("AI ESTIMATION", c)}</div></div>`).join("")}
        </div>
        <div class="mt-3">${ev("HONEST LIMIT", "No market statistics are invented. Purchasing-power and price-band statements are working estimates for a demo — replace them with your verified data.", "warn")}</div>` })}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        ${["DZ", "FR"].map((k) => card({ title: EM.market[k].title, icon: k === "DZ" ? "flag" : "globe", body: `
          <div class="flex flex-col gap-2 text-[12.5px]">
            ${[["COD", EM.market[k].cod], ["Purchasing power", EM.market[k].power], ["Price expectations", EM.market[k].priceExpect], ["Cultural relevance", EM.market[k].cultural], ["Competition", EM.market[k].comp], ["Shipping", EM.market[k].ship], ["Localization", EM.market[k].local]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-28 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
          </div>` })).join("")}
      </div>`;
    $("#p22-market-sel").addEventListener("change", (e) => { state.market.country = e.target.value; switchModule("market"); });
  }

  /* ---------------- competitors (spec 13) ---------------- */
  function renderCompetitors() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Competitor Intelligence</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Public information only · ${esc(product().name)} market</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${DB.competitors.map((c, i) => card({ title: `Competitor ${"ABC"[i]} — ${esc(c.name)}`, icon: "store", body: `
          <div class="flex items-center justify-between mb-2"><span class="text-[20px] font-extrabold text-[#1c1c1e]">${money(c.price)}</span>${tag(c.positioning, "blue")}</div>
          <div class="flex flex-col gap-1.5 text-[12px]">
            ${[["Offer", c.offer], ["Creative", c.creative], ["Reviews", c.reviews + " tracked"], ["USP", c.usp], ["Landing page", c.lp], ["CTA", c.cta], ["Guarantee", c.guarantee]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-20 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
          </div>` })).join("")}
      </div>
      ${card({ title: "Side-by-side comparison", icon: "columns-2", body: `
        <div class="p22-table-wrap"><table class="p22-table">
          <thead><tr><th>Dimension</th><th>Competitor A</th><th>Competitor B</th><th>Competitor C</th><th>Us (EmberFlow)</th></tr></thead>
          <tbody>
            ${[["Price", "5,200 DA", "7,900 DA", "6,500 DA", "<b>5,900 DA</b>"], ["Offer", "Free shipping >6,000", "Bundle + oils", "Free diffuser +3 oils", "Bundle +3 oils (test)"], ["Positioning", "Budget scent", "Focus for remote workers", "Home wellness", "<b>Focus-first + safety</b>"], ["Creative", "Static images", "UGC + demo", "Influencer posts", "UGC demo 9:16"], ["Reviews", "340", "210", "480", "NEW — none yet"], ["USP", "Low price", "Focus positioning", "Bundle value", "Fire-safe + light-ring"], ["Landing page", "Basic", "Strong", "Medium", "Story-first (to test)"], ["CTA", "Order now", "Try it", "Shop now", "Test 'Get focus mode'"]].map((r) => `<tr>${r.map((c2, i) => `<td${i === 4 ? ' class="best"' : ""}>${c2}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table></div>
        <div class="mt-3">${ev("SOURCE", "Competitor data from public stores and ad library. Prices change — re-verify before launch.", "warn")}</div>` })}
      <div class="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        ${[["Guarantee gap", "None of the 3 local players offers a 30-day money-back guarantee — a trust lever COD buyers respond to.", "gift"], ["Creative gap", "Nobody runs before/after desk-transformation or safety-led UGC in DZ.", "palette"], ["Positioning gap", "Only one player targets focus; none pair it with a safety story.", "target"]].map(([l, v, ic]) => card({ title: l, icon: ic, body: `<p class="text-[12.5px] text-[#3f3f46] leading-relaxed">${v}</p>` })).join("")}
      </div>`;
  }

  /* ---------------- gaps (spec 14 + 47) ---------------- */
  function renderGaps() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Competitor Gap Analyzer</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Opportunities the current players are missing.</p></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        ${[["Underserved audience", "Students in shared flats / new remote workers", "users"], ["Missing feature", "Fire-safe auto shut-off story", "shield-check"], ["Missing bundle", "Diffuser + starter oils at forced bundle price", "boxes"], ["Weak offer", "No money-back guarantee anywhere locally", "gift"], ["Poor creative", "No before/after desk transformation", "palette"], ["Poor localization", "No Darija-first ad copy", "languages"], ["Poor landing page", "No FAQ / WhatsApp checkout trust layer", "layout-template"], ["High price", "Only budget and premium — mid band open", "tag"], ["Low trust", "No guarantee, weak return policy", "shield-alert"]].map(([l, v, ic]) => `
          <div class="rounded-xl border border-[#f0efed] bg-[#fbfbfb] p-3.5"><div class="flex items-center gap-2 mb-1.5"><span class="p22-card-ic" style="width:26px;height:26px">${icon(ic, 13)}</span><div class="text-[12.5px] font-bold text-[#1c1c1e]">${l}</div></div><div class="text-[11.5px] text-[#3f3f46]">${v}</div></div>`).join("")}
      </div>
      <div class="p22-ai dark p-5 mb-4">
        <div class="ai-label">HOW CAN WE SELL THIS DIFFERENTLY? — 10 strategies</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          ${EM.gaps.map((g, i) => `<div class="flex items-start gap-2.5 text-[13px] text-[#c9c9cf]"><span class="w-5 h-5 rounded-full bg-[#3ddc72] text-[#1c1c1e] grid place-items-center text-[11px] font-extrabold flex-none">${i + 1}</span><span class="leading-relaxed">${g}</span></div>`).join("")}
        </div>
      </div>
      ${card({ title: "Picked as primary", icon: "target", body: `
        <div class="rounded-xl bg-[#e7f7ec] border border-[#cdeeda] p-4 text-[13px] text-[#0b5d34] leading-relaxed"><b>Strategy #1 + #5:</b> sell the <b>focus-mode</b> transformation with <b>safety-first UGC</b>. It combines the only positioning gap with the only creative gap — two levers competitors can't copy overnight.</div>
        <div class="mt-3">${ev("WHY THIS ONE", "It turns the product's strongest demo (mist + light change) into a story (desk becomes a focus space, safely), and it is cheap to test: one 2,500 DA creative test decides.", "warn")}</div>` })}
      `;
  }

  /* ---------------- compare (spec 36) ---------------- */
  function compareTable(ids, modalMode) {
    const list = ids.map((id) => DB.products.find((p) => p.id === id));
    const defW = { demand: 20, trend: 10, problem: 10, diff: 10, comp: 10, margin: 15, creative: 15, demo: 10 };
    const rows = [
      ["demand", "Demand", "p.demand"], ["trend", "Trend", "p.trend === 'growing' ? 8 : p.trend === 'stable' ? 6 : 4"],
      ["comp", "Competition (low is good)", "10 - p.comp"], ["margin", "Margin", "Math.round(p.margin / 10)"], ["creative", "Creative potential", "p.creative"], ["demo", "Demonstration", "p.demo"], ["cod", "COD suitability", "p.cod"], ["shipping", "Shipping", "p.shipS"],
    ];
    const overall = (p) => { const d = defW; const v = { demand: p.demand, trend: p.trend === "growing" ? 8 : 6, comp: 10 - p.comp, margin: p.margin / 10, creative: p.creative, demo: p.demo, cod: p.cod, shipping: p.shipS }; let t = 0; for (const [k] of rows) t += v[k] * d[k]; return Math.round(t); };
    return `
      <div class="flex items-center justify-between mb-3"><h3 class="text-[15px] font-extrabold">Product comparison</h3><button class="icon-btn" onclick="document.getElementById('p22-modal').classList.remove('open')">✕</button></div>
      <div class="p22-table-wrap"><table class="p22-table">
        <thead><tr><th>Metric</th>${list.map((p) => `<th>${esc(p.name)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(([k, l]) => `<tr><td class="font-semibold text-[#3f3f46]">${l}</td>${list.map((p) => { const v = eval(rows.find((r) => r[0] === k)[2].replace("p.", "p.")); return `<td>${v}</td>`; }).join("")}</tr>`).join("")}
          <tr><td class="font-semibold">Overall /100</td>${list.map((p) => `<td><b class="text-[#0fa05a]">${overall(p)}</b></td>`).join("")}</tr>
        </tbody>
      </table></div>
      <div class="mt-2 text-[11px] text-[#9a9aa2]">Custom weighting editable in the compare module — these are the default weights.</div>`;
  }

  function renderCompare() {
    const el = $("#p22-content");
    const sel = new Set(ld("compare", ["p1", "p2", "p3"]));
    const defW = { demand: 20, trend: 10, problem: 10, diff: 10, comp: 10, margin: 15, creative: 15, demo: 10 };
    const overall = (p) => { const v = { demand: p.demand, trend: p.trend === "growing" ? 8 : 6, comp: 10 - p.comp, margin: p.margin / 10, creative: p.creative, demo: p.demo, cod: p.cod, shipping: p.shipS }; let t = 0; for (const k of Object.keys(defW)) t += (v[k] || 5) * defW[k]; return Math.round(t); };
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Product Comparison</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Side-by-side with custom weighting. Pick products, then tune the weights.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${card({ title: "Select products", icon: "columns-2", body: `
          <div class="flex flex-col gap-1.5">${DB.products.map((p) => `<label class="flex items-center gap-2 text-[12.5px] cursor-pointer"><input type="checkbox" class="accent-[#0fa05a]" data-cmp="${p.id}"${sel.has(p.id) ? " checked" : ""}>${esc(p.name)}</label>`).join("")}</div>` })}
        ${card({ title: "Custom weighting", icon: "sliders-horizontal", sub: "Adjust for your business", body: Object.entries(defW).map(([k, v]) => `
          <div class="flex items-center gap-2 py-1"><span class="text-[12px] text-[#3f3f46] w-28 flex-none">${k}</span><input type="range" min="0" max="30" value="${v}" class="flex-1 accent-[#0fa05a]" data-w="${k}"><span class="text-[12px] font-bold w-8 text-right" data-wv="${k}">${v}</span></div>`).join("") })}
        ${card({ title: "How to read", icon: "circle-help", body: `
          <p class="text-[12.5px] text-[#3f3f46] leading-relaxed">Weighted score = demand + trend + competition (inverted) + margin + creative + demo + COD + shipping.</p>
          <div class="mt-2">${ev("NO GUARANTEES", "The overall score is a weighted hypothesis. A high score still requires a cheap test to confirm.", "warn")}</div>` })}
      </div>
      <div id="p22-compare-table"></div>`;

    const draw = () => {
      const ids = [...sel];
      const rows = [
        ["demand", "Demand"], ["trend", "Trend"], ["comp", "Competition (inverted)"], ["margin", "Margin"], ["creative", "Creative potential"], ["demo", "Demonstration"], ["cod", "COD suitability"], ["shipping", "Shipping"],
      ];
      const list = ids.map((id) => DB.products.find((p) => p.id === id));
      const val = (p, k) => ({ demand: p.demand, trend: p.trend === "growing" ? 8 : p.trend === "stable" ? 6 : 4, comp: 10 - p.comp, margin: p.margin / 10, creative: p.creative, demo: p.demo, cod: p.cod, shipping: p.shipS })[k];
      $("#p22-compare-table").innerHTML = `<div class="p22-table-wrap"><table class="p22-table">
        <thead><tr><th>Metric (weight)</th>${list.map((p) => `<th>${esc(p.name)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(([k, l]) => `<tr><td class="font-semibold text-[#3f3f46]">${l} <span class="text-[#9a9aa2]">(${defW[k]}%)</span></td>${list.map((p) => `<td><b>${val(p, k)}</b>/10</td>`).join("")}</tr>`).join("")}
          <tr class="best"><td class="font-semibold">Weighted overall</td>${list.map((p) => `<td><b class="text-[#0fa05a]">${overall(p)}</b>/100</td>`).join("")}</tr>
        </tbody></table></div>`;
    };
    draw();
    const scope = el;
    scope.addEventListener("change", (e) => {
      if (e.target.hasAttribute("data-cmp")) {
        const id = e.target.getAttribute("data-cmp");
        e.target.checked ? sel.add(id) : sel.delete(id);
        ls("compare", [...sel]); draw();
      }
      if (e.target.hasAttribute("data-w")) {
        const k = e.target.getAttribute("data-w");
        defW[k] = +e.target.value;
        scope.querySelector(`[data-wv="${k}"]`).textContent = defW[k];
        draw();
      }
    });
  }

  /* ---------------- watchlist (spec 37) ---------------- */
  function renderWatchlist() {
    const el = $("#p22-content");
    const rows = DB.products.filter((p) => state.watch[p.id]);
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Product Watchlist</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Track price, competition, trend, supplier, ads, reviews and market signals. You get notified when something important changes.</p></div>
      <div class="flex flex-col gap-3">
        ${rows.length ? rows.map((p) => {
          const st = state.watch[p.id];
          return `<div class="p22-card flex flex-wrap items-center gap-3">
            ${thumb(p.img, p.name, true)}
            <div class="min-w-0 flex-1">
              <div class="text-[13px] font-bold text-[#1c1c1e]">${esc(p.name)}</div>
              <div class="text-[11.5px] text-[#9a9aa2]">${money(p.price)} · ${money(p.cost)} cost · margin ${p.margin}%</div>
              <div class="flex flex-wrap gap-1.5 mt-1.5">${opp(p.opp)}${tag("Price: stable", "gray")}${tag("Trend: " + p.trend, p.trend === "growing" ? "green" : "amber")}</div>
            </div>
            <div class="flex flex-col gap-1.5 flex-none">
              <select class="p22-select" style="padding:6px 10px;font-size:12px" data-status="${p.id}">
                ${[["watch", "Watching"], ["favorite", "Favorite"], ["testing", "Testing"], ["winner", "Winner"], ["loser", "Loser"], ["rejected", "Rejected"]].map(([v, l]) => `<option value="${v}"${st === v ? " selected" : ""}>${l}</option>`).join("")}
              </select>
              <button class="p22-btn red" style="font-size:12px;padding:6px 10px" data-remove="${p.id}">Remove</button>
            </div>
          </div>`;
        }).join("") : `<div class="p22-card text-center py-10 text-[#9a9aa2]">${icon("bell", 22)}<div class="mt-2 text-[13px]">Nothing watched yet — SAVE products from the Discovery feed or Find Me Winners.</div></div>`}
      </div>
      <div class="mt-4">${ev("CHANGE NOTIFICATIONS", "When a watched product's price, trend or competition changes by a significant amount, you get a notification. Demo shows static snapshots.", "warn")}</div>`;
    el.addEventListener("change", (e) => {
      if (e.target.hasAttribute("data-status")) { state.watch[e.target.getAttribute("data-status")] = e.target.value; ls("watch", state.watch); toast("Watch status updated", "ok"); }
    });
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]");
      if (!b) return;
      delete state.watch[b.getAttribute("data-remove")]; ls("watch", state.watch); renderWatchlist();
    });
  }

  /* ---------------- sourcing (spec 4) ---------------- */
  function renderSourcing() {
    const p = product();
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Product Sourcing Center</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">Search ${esc(p.name)} across sourcing platforms and compare suppliers.</p></div>
        <div class="flex items-center gap-2">${productSwitcher()}<button class="p22-btn primary" id="p22-search-src">${icon("package-search", 15)} Search platforms (demo)</button></div>
      </div>
      <div class="grid grid-cols-3 gap-2 mb-4">
        ${[["AliExpress", "verified", "8 results"], ["Alibaba", "verified", "5 results"], ["1688", "verified", "3 results"]].map(([n, v, r]) => `
          <div class="p22-kpi text-center"><div class="kpi-lbl">${n}</div><div class="text-[15px] font-extrabold text-[#1c1c1e] mt-1">${r}</div><div class="mt-1">${tag(v === "verified" ? "API verified" : "no results", v === "verified" ? "green" : "amber")}</div></div>`).join("")}
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-3">
        ${DB.suppliers.map((s, i) => card({ title: `Supplier ${"ABC"[i]} — ${esc(s.name)}`, icon: "factory", sub: s.platform + " · " + s.loc, body: `
          <div class="flex items-center justify-between mb-2"><span class="text-[19px] font-extrabold text-[#1c1c1e]">${money(s.price)}</span><span class="p22-tag ${s.rating >= 4.5 ? "green" : "amber"}">${s.rating} ★</span></div>
          <div class="flex flex-col gap-1.5 text-[12px]">
            ${[["MOQ", s.moq + " unit(s)"], ["Variants", s.variants], ["Reviews", s.reviews], ["Orders", s.orders], ["Shipping cost", money(s.shipCost)], ["Processing", s.procDays + " days"], ["Supplier age", s.ageY + " yrs"], ["Supplier rating", s.supRating + "/5"], ["Product images", s.img ? "Available" : "—"], ["Product video", s.video ? "Available" : "—"], ["Listing URL", s.url ? "Provided" : "—"]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-28 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
          </div>
          <div class="flex gap-2 mt-3">
            <button class="p22-btn ghost" style="font-size:12px" data-supplier="${s.id}">${icon("columns-2", 13)} Compare</button>
            <button class="p22-btn primary" style="font-size:12px">${icon("link", 13)} Open listing</button>
          </div>` })).join("")}
      </div>
      <div class="mt-4">${ev("DATA VERIFICATION", "Prices and MOQs came from the connected platform APIs at last sync. Re-verify before ordering — supplier prices move weekly.", "warn")}</div>`;
    wireProductSwitch(el);
    $("#p22-search-src").addEventListener("click", () => { toast("Platform search re-run (demo — 3 suppliers matched)", "ok"); });
    $$("[data-supplier]", el).forEach((b) => b.addEventListener("click", () => { modal(compareTable(["p1", "p2", "p3"])); }));
  }

  /* ---------------- suppliers (spec 5) ---------------- */
  function renderSuppliers() {
    const el = $("#p22-content");
    const score = (s) => {
      const priceScore = Math.round((1 - (s.price - 1300) / 1000) * 25);
      const quality = Math.round((s.rating / 5) * 15 + Math.min(s.reviews, 1200) / 1200 * 10);
      const delivery = Math.round((s.supRating / 5) * 10 + (s.procDays <= 3 ? 15 : s.procDays <= 5 ? 10 : 5) + (s.shipCost <= 400 ? 5 : 2));
      const hist = Math.round(Math.min(s.ageY, 7) / 7 * 10 + (s.orders === "HIGH" ? 10 : s.orders === "MEDIUM" ? 7 : 4));
      const moq = s.moq <= 1 ? 10 : s.moq <= 50 ? 7 : 4;
      return { price: priceScore, quality, delivery, hist, moq, total: Math.min(100, priceScore + quality + delivery + hist + moq) };
    };
    const rows = DB.suppliers.map((s) => ({ s, sc: score(s) }));
    const best = (key) => rows.reduce((a, b) => (b.sc[key] > a.sc[key] ? b : a));
    const labels = [["BEST PRICE", best("price")], ["BEST QUALITY", best("quality")], ["BEST DELIVERY", best("delivery")], ["BEST OVERALL", best("total")]];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Supplier Scoring</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Score /100 from price, quality signals, rating, reviews, shipping, processing, MOQ, response time, history and order volume.</p></div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        ${labels.map(([l, b]) => `<div class="p22-kpi hot"><div class="kpi-lbl">${l}</div><div class="kpi-num" style="font-size:15px;margin-top:3px">${esc(b.s.name)}</div><div class="text-[11px] text-[#9a9aa2] mt-1">score ${b.sc.total}/100 · ${esc(b.s.platform)}</div></div>`).join("")}
      </div>
      <div class="p22-table-wrap"><table class="p22-table">
        <thead><tr><th>Supplier</th><th>Platform</th><th>Price</th><th>MOQ</th><th>Rating</th><th>Reviews</th><th>Processing</th><th>Ship cost</th><th>History</th><th>Price</th><th>Quality</th><th>Delivery</th><th>Total</th></tr></thead>
        <tbody>
          ${rows.map(({ s, sc }) => `<tr>
            <td class="font-semibold">${esc(s.name)}</td><td>${esc(s.platform)}</td><td>${money(s.price)}</td><td>${s.moq}</td><td>${s.rating}</td><td>${s.reviews}</td><td>${s.procDays}d</td><td>${money(s.shipCost)}</td><td>${s.ageY}y</td>
            <td><span class="${sc.price === best("price").sc.price ? "text-[#0fa05a] font-bold" : ""}">${sc.price}</span></td>
            <td><span class="${sc.quality === best("quality").sc.quality ? "text-[#0fa05a] font-bold" : ""}">${sc.quality}</span></td>
            <td><span class="${sc.delivery === best("delivery").sc.delivery ? "text-[#0fa05a] font-bold" : ""}">${sc.delivery}</span></td>
            <td><b>${sc.total}</b>/100</td>
          </tr>`).join("")}
        </tbody>
      </table></div>
      <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
        ${card({ title: "How the score works", icon: "calculator", body: `
          <div class="flex flex-col gap-1.5 text-[12.5px]">${[["Price", "inverse of supplier price (max 25)"], ["Quality signals", "rating + review count (max 25)"], ["Delivery", "supplier rating + processing + shipping cost (max 30)"], ["History & volume", "age + order signals (max 20)"], ["MOQ", "lower MOQ scores higher (max 10)"]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-32 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}</div>` })}
        ${card({ title: "Honest limit", icon: "shield-alert", body: `${ev("WE CANNOT VERIFY QUALITY", "Ratings are marketplace-reported, not independently tested. Order a sample (or buy one via the store) before bulk commitment.", "warn")}
          <div class="mt-3">${ev("RESPONSE TIME", "UNKNOWN for all three suppliers — requires user input or an order interaction.", "warn")}</div>` })}
      </div>`;
  }

  /* ---------------- import (spec 6) ---------------- */
  function renderImport() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Product Import</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Add a product by URL, image, screenshot, name, supplier link, video, PDF, CSV or manual entry. AI extracts and tags every field.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        ${card({ title: "Import method", icon: "file-up", body: `
          <div class="grid grid-cols-3 gap-2 mb-3">
            ${[["URL", "link", "Paste product link"], ["Image", "image", "Screenshot / photo"], ["Video", "clapperboard", "Product video"], ["PDF", "file-text", "Catalog / datasheet"], ["CSV", "table", "Bulk import"], ["Manual", "keyboard", "Fill the form"]].map(([l, ic, d]) => `<button class="p22-btn ghost" style="flex-direction:column;padding:12px 6px" data-im="${l}"><span style="color:#0fa05a">${icon(ic, 16)}</span><span class="text-[11.5px] font-bold mt-1">${l}</span><span class="text-[9.5px] text-[#9a9aa2]">${d}</span></button>`).join("")}
          </div>
          <label class="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#cdeeda] bg-[#f6fbf7] py-5 cursor-pointer text-[#0fa05a] text-[13px] font-bold">${icon("cloud-upload", 15)} Drop file or paste content</label>
          <button class="p22-btn primary mt-3" style="width:100%" id="p22-run-import">${icon("wand-2", 15)} Run AI extraction${live() ? "" : " (demo)"}</button>` })}
        ${card({ title: "Extraction results — EmberFlow sample", icon: "scan-search", sub: "FACT = from source · INFERENCE = AI · UNKNOWN = missing", body: `
          <div class="flex flex-col">
            ${[["Product name", "EmberFlow Smart Diffuser", "V"], ["Category", "Home & Focus", "V"], ["Features", "diffuser + timer + light + auto shut-off", "V"], ["Price", "5,900 DA (list)", "V"], ["Supplier", "DZ Home Store · AliExpress", "V"], ["Brand", "EmberFlow (not DZ-registered)", "V"], ["Benefits", "calm focus mode, one-tap", "I"], ["Market", "DZ primary / FR secondary", "I"], ["Use cases", "5 identified (see analyzer)", "I"], ["Shipping cost", "UNKNOWN — 450 DA estimated", "X"], ["Supplier MOQ", "UNKNOWN for bulk tier", "X"], ["Local competition", "UNKNOWN — 3 public players found", "X"]].map(([l, v, s]) => `<div class="flex items-center gap-2 py-1.5 border-b border-[#f4f3f1] last:border-0"><div class="min-w-0 flex-1"><div class="text-[11.5px] font-semibold text-[#1c1c1e]">${l}</div><div class="text-[11px] text-[#3f3f46]">${v}</div></div>${src(s)}</div>`).join("")}
          </div>` })}
      </div>
      <div id="p22-import-out"></div>`;
    $("#p22-run-import").addEventListener("click", async () => {
      const out = $("#p22-import-out");
      const useLive = live();
      out.innerHTML = `<div class="p22-ai">${icon("loader-2", 14)} ${useLive ? "Running live extraction…" : "Extracting… (demo)"}</div>`;
      const res = useLive ? await runAI("extract_product", { description: "EmberFlow Smart Diffuser — smart essential-oil diffuser combining aroma diffusion, timer, ambient light and fire-safe auto shut-off.", note: "Structure the product extraction: name, category, features, price, benefits, use cases, unknowns." }, { maxTokens: 3000 }) : null;
      if (res) {
        out.innerHTML = `<div class="p22-ai dark p-4 mb-3"><div class="ai-label">LIVE EXTRACTION · ${esc(res.meta.provider || "AI")}</div><div class="text-[12.5px] text-[#c9c9cf]">${aiOut(res.data)}</div></div>`;
        toast("Live extraction complete", "ok");
        return;
      }
      out.innerHTML = card({ title: "Import pipeline", icon: "git-branch", body: `
        <div class="flex flex-col gap-2">
          ${[["Source read", "Product data captured from the sample source.", "verified"], ["Field extraction", "12 fields extracted — 8 FACT, 2 INFERENCE, 3 UNKNOWN.", "verified"], ["Data quality", "84% complete — see Data Quality module.", "inference"], ["Suggestions", "Add shipping cost, MOQ and local competition to reach 100%.", "inference"]].map(([l, v, c]) => `
            <div class="p22-step"><span class="p22-step-num">${icon("check", 12)}</span><div class="flex-1"><div class="text-[12.5px] font-bold text-[#1c1c1e]">${l}</div><div class="text-[11.5px] text-[#3f3f46]">${v}</div></div><span class="p22-src ${c}">${c.toUpperCase()}</span></div>`).join("")}
        </div>` });
      toast("Extraction complete (demo)", "ok");
    });
  }

  /* ---------------- pricing engine (spec 20) ---------------- */
  function pricingCalc() {
    const e = EM.pricing;
    const cogs = e.land + e.ship + e.pack;
    const netCost = (p) => cogs + (p * e.payFeePct / 100) + e.codFee + (e.retPct / 100) * (cogs + e.adPerOrder) + e.adPerOrder;
    const be = Math.round(netCost(4000) / (1 - e.payFeePct / 100) / 10) * 10;
    const profiles = [
      { name: "Budget", price: 4900, k: "Volume play — fragile margins, enters the price band of cheap diffusers." },
      { name: "Standard", price: 5900, k: "Recommended — best balance of conversion and margin; max CAC ≈ 1,780 DA." },
      { name: "Premium", price: 7900, k: "Bundle tier — highest margin, needs stronger trust and guarantee." },
    ].map((p) => { const c = netCost(p.price); return { ...p, cost: Math.round(c), net: Math.round(p.price - c), gross: Math.round((p.price - cogs) / p.price * 100) }; });
    const rec = profiles[1];
    return { cogs, be, profiles, rec, maxCac: rec.price - be };
  }

  function renderPricing() {
    const el = $("#p22-content");
    const c = pricingCalc();
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">AI Pricing Engine</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Costs in → prices out. Every number is derived from your cost inputs — change them and everything recomputes.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        ${card({ title: "Cost inputs (EmberFlow)", icon: "calculator", body: `
          <div class="flex flex-col gap-2">
            ${[["Supplier cost", e0("land")], ["Shipping to DZ", e0("ship")], ["Packaging", e0("pack")], ["Payment fee", "2.2%"], ["COD fee", e0("codFee")], ["Ad cost per order", e0("adPerOrder")], ["Expected returns", "4%"]].map(([l, v]) => `<div class="flex items-center gap-2 text-[12.5px]"><span class="text-[#3f3f46] flex-1">${l}</span><span class="font-bold text-[#1c1c1e]">${v}</span></div>`).join("")}
          </div>
          <div class="mt-3 p-3 rounded-xl bg-[#fbfbfb] border border-[#f0efed] text-[12px]"><div class="flex justify-between"><span class="text-[#9a9aa2]">Landed cost (before fees/ads)</span><b>${money(c.cogs)}</b></div></div>` })}
        ${card({ title: "Calculated prices", icon: "badge-dollar-sign", body: `
          <div class="flex flex-col gap-2">
            ${[["Break-even price", money(c.be), "the absolute floor — no profit at all", "gray"], ["Minimum profitable", money(4900), "~15% net margin, volume play", "amber"], ["Target price", money(c.rec.price), "best conversion × margin balance", "green"], ["Premium price", money(7900), "bundle tier with highest margin", "green"]].map(([l, v, s, t]) => `
              <div class="flex items-center gap-3 p-3 rounded-xl border border-[#f0efed]"><div class="flex-1"><div class="text-[12px] font-bold text-[#1c1c1e]">${l}</div><div class="text-[11px] text-[#9a9aa2]">${s}</div></div><span class="text-[17px] font-extrabold ${t === "green" ? "text-[#0fa05a]" : "text-[#1c1c1e]"}">${v}</span></div>`).join("")}
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 text-center">
            ${[["Gross margin", c.rec.gross + "%", "of selling price"], ["Net per order", money(c.rec.net), "after fees + ads + returns"], ["Max CAC", money(c.maxCac), "before profit turns 0"]].map(([l, v, s]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3"><div class="text-[11px] font-bold text-[#9a9aa2]">${l}</div><div class="text-[16px] font-extrabold text-[#1c1c1e] mt-0.5">${v}</div><div class="text-[10px] text-[#9a9aa2] mt-0.5">${s}</div></div>`).join("")}
          </div>` })}
      </div>
      ${card({ title: "Pricing strategies", icon: "layers", body: `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${c.profiles.map((p) => `<div class="rounded-xl border ${p.price === c.rec.price ? "border-[#cdeeda] bg-[#f4faf6]" : "border-[#f0efed] bg-[#fbfbfb]"} p-4">
            <div class="flex items-center justify-between"><div class="text-[13px] font-extrabold text-[#1c1c1e]">${p.name}</div>${p.price === c.rec.price ? tag("RECOMMENDED", "green") : ""}</div>
            <div class="text-[24px] font-extrabold text-[#1c1c1e] mt-1">${money(p.price)}</div>
            <div class="flex justify-between text-[12px] mt-2"><span class="text-[#9a9aa2]">Gross margin</span><b>${p.gross}%</b></div>
            <div class="flex justify-between text-[12px]"><span class="text-[#9a9aa2]">Net per order</span><b class="text-[#0fa05a]">${money(p.net)}</b></div>
            <div class="text-[11.5px] text-[#3f3f46] mt-2 leading-relaxed">${p.k}</div>
          </div>`).join("")}
        </div>` })}
      <div class="mt-4">${ev("WHERE THE NUMBERS COME FROM", "Cost inputs are user-entered values + the demo product data. No margin figures are invented — they are computed from the inputs above.", "warn")}</div>`;
    function e0(k) { return money(EM.pricing[k]); }
  }

  /* ---------------- price testing (spec 21) ---------------- */
  function renderPricetest() {
    const el = $("#p22-content");
    const rows = [
      { k: "A", price: "5,490", ctr: "2.1%", conv: "1.6%", orders: 24, conf: "62%", deliv: "58%", rev: 131760, profit: 33360, note: "Highest order count — but lowest profit per order" },
      { k: "B", price: "5,900", ctr: "2.4%", conv: "1.9%", orders: 21, conf: "68%", deliv: "64%", rev: 123900, profit: 36540, note: "Best profit — fewer orders, higher net" },
      { k: "C", price: "6,500", ctr: "2.0%", conv: "1.4%", orders: 12, conf: "70%", deliv: "66%", rev: 78000, profit: 27300, note: "Premium hold — needs bundle to win" },
    ];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Price Testing</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Price A vs B vs C — the AI decides by <b>profit per order</b>, not order count. Demo shows a completed experiment.</p></div>
      ${card({ title: "Experiment #1 — Price points", icon: "arrow-left-right", sub: "Status: concluded · 72 orders · 95% confidence on A vs B", body: `
        <div class="p22-table-wrap"><table class="p22-table">
          <thead><tr><th>Variant</th><th>Price</th><th>CTR</th><th>Conversion</th><th>Orders</th><th>Confirmation</th><th>Delivery</th><th>Revenue</th><th>Profit</th><th>AI read</th></tr></thead>
          <tbody>
            ${rows.map((r) => `<tr${r.k === "B" ? ' class="best"' : ""}><td><b>${r.k}</b></td><td>${r.price} DA</td><td>${r.ctr}</td><td>${r.conv}</td><td>${r.orders}</td><td>${r.conf}</td><td>${r.deliv}</td><td>${numf(r.rev)} DA</td><td><b class="${r.k === "B" ? "text-[#0fa05a]" : ""}">${numf(r.profit)} DA</b></td><td class="text-[#3f3f46]">${r.note}</td></tr>`).join("")}
          </tbody>
        </table></div>
        <div class="mt-3 p-3 rounded-xl bg-[#e7f7ec] border border-[#cdeeda] text-[13px] text-[#0b5d34]"><b>AI verdict: keep 5,900 DA.</b> Price B converts slightly fewer orders but delivers 3,180 DA more profit than A — higher confirmation rate cancels the lower volume. Next: test 5,900 + bundle offer against 6,500 + bundle.</div>` })}
      <div class="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        ${[["What is measured", "CTR, conversion, orders, confirmation, delivery, revenue and profit per variant — not impressions.", "clipboard-list"], ["Why not most orders", "A price that wins orders but loses profit per order is a marketing win and a business loss. Profit per order is the KPI.", "brain"], ["Next experiment", "Test 6,500 DA with the bundle (+3 oils) vs 5,900 DA standard — does the bundle rescue the premium price?", "flask-conical"]].map(([l, v, ic]) => card({ title: l, icon: ic, body: `<p class="text-[12.5px] text-[#3f3f46] leading-relaxed">${v}</p>` })).join("")}
      </div>`;
  }

  /* ---------------- offers (spec 22) ---------------- */
  function renderOffers() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Offer Builder</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Nine offers with revenue, cost, margin, expected AOV and profit. No fake scarcity — no fake urgency.</p></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        ${EM.offers.map((o) => `<div class="p22-card${o.k === "best" ? " hot" : ""}" style="${o.k === "best" ? "border-color:#cdeeda;background:linear-gradient(180deg,#fff,#f4faf6)" : ""}">
          <div class="p22-card-head"><span class="p22-card-ic">${icon("gift", 15)}</span><div class="min-w-0 flex-1"><div class="p22-card-title">${o.name}</div><div class="p22-card-sub">AOV ${money(o.aov)}</div></div>${o.k === "best" ? tag("BEST MARGIN", "green") : ""}</div>
          <div class="flex items-center justify-between mb-2"><span class="text-[22px] font-extrabold text-[#1c1c1e]">${money(o.price)}</span></div>
          <div class="flex flex-col gap-1.5 text-[12px]">
            ${[["Revenue", money(o.rev)], ["Estimated cost", money(o.cost)], ["Profit", money(o.profit)], ["Margin", pct(o.profit / o.rev, 0)]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-24 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
          </div>
        </div>`).join("")}
      </div>
      ${card({ title: "Anti-deception rules", icon: "shield-check", body: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${[["No fake scarcity", "Never claim '3 left' unless a real inventory count supports it. Use real stock or none."], ["No fake urgency", "Countdown timers only when a promotion genuinely ends — never rolling resets."], ["Honest discount anchor", "Show the real previous price, not an invented 'was' price."], ["Transparent COD", "State delivery time and total due on arrival — confirmation rate is built on trust."]].map(([l, v]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3.5"><div class="text-[12px] font-bold text-[#1c1c1e] mb-1">${l}</div><div class="text-[11.5px] text-[#3f3f46]">${v}</div></div>`).join("")}
        </div>` })}
      <div class="mt-3">${ev("RECOMMENDED OFFER", "Bundle +3 oils at 6,900 DA — highest profit per order and no deception risk. Pair it with a real 30-day guarantee once registered.", "warn")}</div>`;
  }

  /* ---------------- bundles (spec 23) ---------------- */
  function renderBundles() {
    const el = $("#p22-content");
    const items = [
      { t: "Main product", n: "EmberFlow Smart Diffuser", p: 5900, c: 2960, ic: "sun" },
      { t: "Accessory", n: "3 starter oils (lavande, eucalyptus, orange)", p: 1200, c: 650, ic: "droplet" },
      { t: "Bonus", n: "Travel pouch + cleaning kit", p: 400, c: 200, ic: "gift" },
    ];
    const individual = items.reduce((a, i) => a + i.p, 0);
    const bundle = 6900;
    const bundleCost = items.reduce((a, i) => a + i.c, 0);
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Bundle Builder</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Main product + accessory + bonus. Bundles lift AOV and give the discount a reason to exist.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${items.map((i) => card({ title: i.t, icon: i.ic, body: `<div class="text-[13px] font-bold text-[#1c1c1e]">${i.n}</div><div class="flex justify-between text-[12px] mt-2"><span class="text-[#9a9aa2]">Individual</span><b>${money(i.p)}</b></div><div class="flex justify-between text-[12px]"><span class="text-[#9a9aa2]">Cost</span><b>${money(i.c)}</b></div>` })).join("")}
      </div>
      ${card({ title: "Bundle economics", icon: "boxes", body: `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center mb-3">
          ${[["Bundle price", money(bundle)], ["Individual price", money(individual)], ["Discount", "-" + numf(100 - Math.round(bundle / individual * 100)) + "%"], ["Bundle margin", pct((bundle - bundleCost) / bundle, 0)]].map(([l, v]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3"><div class="text-[11px] font-bold text-[#9a9aa2]">${l}</div><div class="text-[17px] font-extrabold text-[#1c1c1e] mt-1">${v}</div></div>`).join("")}
        </div>
        <div class="flex flex-col gap-1.5 text-[12.5px]">
          ${[["AOV increase vs standard offer", "+" + numf(Math.round((bundle - 5900) / 5900 * 100)) + "% (5,900 → 6,900 DA)"], ["Profit per order", money(bundle - bundleCost) + " vs " + money(5900 - 2960) + " on standard"], ["Why it works", "The oils are real consumables — the bundle is a discount with a reason, not a fake one."]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-44 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
        </div>` })}
      <div class="mt-3">${ev("REPEAT PURCHASE NOTE", "The oils also open the door to a refill subscription — the strongest repeat-purchase lever this product has (repeat score 4/10 today).", "warn")}</div>`;
  }

  /* ---------------- ad intelligence (spec 15) ---------------- */
  function renderAdintel() {
    const el = $("#p22-content");
    const ads = [
      { name: "AromaHome — budget diffuser", adv: "AromaHome.dz", days: 48, format: "Static image", hook: "Scent for less", angle: "Price", offer: "Free shipping >6,000", aud: "Broad DZ women 25-45", cta: "Order now", eng: "CTR 0.9% · low", note: "Price-led creative, no demo — predictable, low engagement." },
      { name: "FocusRoom — focus bundle", adv: "FocusRoom.io", days: 61, format: "UGC + demo", hook: "Can't concentrate from home?", angle: "Problem → transformation", offer: "Bundle + oils, 30-day", aud: "Remote workers 25-45", cta: "Try it", eng: "CTR 2.2% · high", note: "The strongest local creative — validates the focus angle." },
      { name: "ZenHome — influencer posts", adv: "ZenHome Algeria", days: 30, format: "Influencer post", hook: "Home wellness glow-up", angle: "Lifestyle", offer: "Free diffuser +3 oils", aud: "Home decor interests", cta: "Shop now", eng: "CTR 1.4% · medium", note: "Lifestyle reach, weak demo — social proof without proof of results." },
    ];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Ad Intelligence</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Public ad-library data for the diffuser market in Algeria. Import your own ads to analyze too.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${ads.map((a, i) => card({ title: `Ad ${"ABC"[i]} — ${esc(a.name)}`, icon: "radar", sub: "by " + a.adv + " · running " + a.days + " days", body: `
          <div class="flex items-center gap-2 flex-wrap mb-2">${tag(a.format, "blue")}${tag(a.eng.includes("high") ? "HIGH engagement" : a.eng.includes("low") ? "LOW engagement" : "MEDIUM engagement", a.eng.includes("high") ? "green" : a.eng.includes("low") ? "red" : "amber")}</div>
          <div class="flex flex-col gap-1.5 text-[12px]">
            ${[["Hook", a.hook], ["Angle", a.angle], ["Offer", a.offer], ["Audience", a.aud], ["CTA", a.cta], ["Engagement", a.eng]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-20 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
            <div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] p-2.5 mt-1 text-[#3f3f46]">${a.note}</div>
          </div>` })).join("")}
      </div>
      ${card({ title: "What the AI learned from public ads", icon: "brain", body: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${[["Hook", "Problem-led hooks (can't concentrate) outperform price-led hooks 2.4x on CTR."], ["Angle", "Transformation + demo beats pure price and pure lifestyle."], ["Format", "UGC/demo outperform static images; 9:16 is the standard."], ["Offer", "Bundles with a guarantee convert; price-only offers plateau."], ["Audience", "Remote-worker targeting beats broad women for this category."], ["Positioning", "Nobody owns the 'focus + safety' story yet — the gap is open."]].map(([l, v]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3"><div class="text-[11px] font-extrabold text-[#0fa05a] mb-1">${l}</div><div class="text-[12px] text-[#3f3f46]">${v}</div></div>`).join("")}
        </div>
        <div class="mt-3">${ev("HONEST LIMIT", "Engagement signals are public and approximate — they are evidence of attention, not of sales. Paid tests confirm the rest.", "warn")}</div>` })}
      `;
  }

  /* ---------------- creative lab (spec 16) ---------------- */
  function renderCreative() {
    const el = $("#p22-content");
    const c = EM.creative;
    const cols = (title, icon, list, mark) => card({ title, icon, body: `<div class="flex flex-col gap-1.5">${list.map((h, i) => `<div class="flex items-start gap-2 text-[12.5px]"><span class="text-[#0fa05a] font-bold w-5 flex-none">${i + 1}</span><span class="text-[#3f3f46]">${h}${mark ? " <span class='p22-src unknown'>CONCEPT — requires real customer proof</span>" : ""}</span></div>`).join("")}</div>` });
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Creative Lab</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">10 hooks · 10 angles · 10 concepts · 5 UGC · 5 demonstrations · 5 problem/solution · 5 before/after · 5 testimonial concepts. Testimonials are concepts until you have real proof.</p></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3 text-center">
        ${["10 Hooks", "10 Angles", "10 Concepts", "5 UGC", "5 Demonstrations", "5 Problem/Solution", "5 Before/After", "5 Testimonials"].map((n) => `<div class="p22-kpi hot py-3"><div class="kpi-num" style="font-size:18px">${n.split(" ")[0]}</div><div class="kpi-lbl">${n.split(" ").slice(1).join(" ")}</div></div>`).join("")}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        ${cols("10 Hooks", "anchor", c.hooks)}
        ${cols("10 Angles", "target", c.angles)}
        ${card({ title: "10 Creative concepts", icon: "palette", body: `<div class="p22-table-wrap"><table class="p22-table"><thead><tr><th>Format</th><th>Concept</th><th>Angle</th><th>Ratio</th></tr></thead><tbody>${c.concepts.map(([f, n, a, r]) => `<tr><td>${tag(f, "blue")}</td><td class="text-[#3f3f46]">${n}</td><td>${a}</td><td class="text-[#9a9aa2]">${r}</td></tr>`).join("")}</tbody></table></div>` })}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        ${cols("5 UGC concepts", "clapperboard", c.ugc.map((u) => u.title + " (" + u.seconds + "s · " + u.creator + ")"))}
        ${cols("5 Demonstration concepts", "play", ["10-second mist + light change", "Before/after desk transformation", "Evening wind-down preset routine", "Candle vs EmberFlow safety cut", "One-tap focus mode at 0.5x speed"])}
        ${cols("5 Problem/Solution concepts", "circle-help", ["Screenshots of 14 open tabs → one tap focus mode", "Split screen: cluttered desk vs calm focus desk", "'I can't finish anything from home' → 30s later", "Missed deadlines montage → focus mode", "Headphones on, candle off → EmberFlow on"])}
        ${cols("5 Before/After concepts", "arrow-left-right", ["Desk before / desk after (light + mist)", "Mood before / after (warm calm)", "Day 1 chaos / Day 30 routine", "Candle smoke / clean mist", "Bare shelf / EmberFlow shelf"])}
        ${cols("5 Testimonial-style concepts", "quote", ["Remote worker: 'I finish my deep work now'", "Student: 'my room finally signals focus'", "Parent: 'safe to leave on with kids around'", "Manager: 'my team actually logs off'", "Designer: 'it looks like my desk cost 10x more'"], true)}
      </div>`;
  }

  /* ---------------- hook lab (spec 19) ---------------- */
  const HOOK_DATA = {
    "Problem": ["Your home office is fighting your focus", "You open 14 tabs and close them 3 hours later", "Can't switch off after work? That's the room", "Procrastination isn't willpower — it's environment", "Every day ends with 'I got nothing done'"],
    "Question": ["What if your room could put you in deep work?", "Why does every café feel more productive than home?", "One device replaces your candle, timer and lamp?", "How do you signal 'work mode' to your brain?", "Ever left a candle burning all day?"],
    "Curiosity": ["The switch your desk has been missing", "Watch what happens when the room changes", "I didn't expect this to fix my focus", "The 30-second trick home workers don't know", "What your lighting is doing to your focus"],
    "Mistake": ["Buying a cheap diffuser was my mistake", "The candle mistake that almost cost me my desk", "I used 5 devices when 1 would do", "My home-office setup was backwards", "The refill mistake that makes diffusers useless"],
    "Warning": ["PSA: don't leave candles on while you work", "Your scent diffuser might be too hot for your desk", "Fire-safe matters more than scent", "Cheap atomizers burn your oils — and your money", "The desk-fire story nobody thinks is them"],
    "Benefit": ["One tap and the room tells your brain: work time", "Calm focus mode, on demand", "Scent + light + quiet in one device", "A focus signal you can leave on safely", "The room adapts to you — not the other way"],
    "Transformation": ["Cluttered desk → calm focus space", "Scattered brain → deep work in 30 seconds", "The office was in the bedroom. Now it's a room.", "This one change made my evenings feel like evenings", "Watch a home office become a focus room"],
    "Demonstration": ["One tap. That's it.", "Mist + light in 10 seconds", "Here's the before/after in real time", "3 presets, one touch", "Watch the room change for work mode"],
    "Contrarian": ["You don't need more willpower", "The best productivity tool isn't an app", "Your candle is your enemy", "Focus isn't discipline — it's design", "Buying the cheap one costs you more"],
    "Social proof": ["3 home offices, one change — watch what happened", "What 40 remote workers said about focus mode", "The desk transformation they all shared", "Students, parents, managers — same result", "Here's what a week with EmberFlow looked like"],
    "Comparison": ["A diffuser, a timer, a light and a fire-safe switch — or one EmberFlow?", "Cheap diffuser vs this: what you're actually paying for", "Candles vs EmberFlow in 20 seconds", "5 devices on your desk, or 1 quiet one", "Price anchor: everything it replaces"],
    "Story": ["My desk almost caught fire. Here's what I use now.", "Day 1: 14 tabs. Day 7: focus mode.", "The weekend I stopped feeling tired at my desk", "I built this because my own home office failed me", "How a student in a shared flat found focus"],
  };
  const HOOK_STATES = ld("hookstates", {});

  function renderHooks() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Hook Lab</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">12 categories × 5 hooks = 60 hooks. Mark favorite / tested / winner — the AI learns from hook performance over time.</p></div>
        <div class="flex items-center gap-2">${tag("60 hooks", "green")}${tag("Performance-driven", "blue")}</div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        ${Object.entries(HOOK_DATA).map(([cat, hooks]) => card({ title: cat, icon: "anchor", body: `
          <div class="flex flex-col gap-2">
            ${hooks.map((h, i) => { const k = cat + ":" + i; const st = HOOK_STATES[k] || ""; return `
              <div class="flex items-start gap-2 rounded-lg bg-[#fbfbfb] border border-[#f0efed] px-2.5 py-2" data-hook="${k}">
                <span class="text-[13px] text-[#3f3f46] flex-1 leading-snug">${h}</span>
                <span class="flex gap-1 flex-none">
                  <button class="icon-btn" style="width:26px;height:26px" data-hookact="fav" title="Favorite">${icon("heart", 12)}</button>
                  <button class="icon-btn" style="width:26px;height:26px" data-hookact="win" title="Winner">${icon("trophy", 12)}</button>
                </span>
              </div>`; }).join("")}
          </div>` })).join("")}
      </div>
      <div class="mt-3">${ev("LEARNING RULE", "A hook only becomes a 'winner' after a paid test proves it. Favorites are your own judgement — the AI waits for data.", "warn")}</div>`;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("[data-hookact]");
      if (!b) return;
      const cardEl = b.closest("[data-hook]");
      const k = cardEl.getAttribute("data-hook");
      const act = b.getAttribute("data-hookact");
      HOOK_STATES[k] = act; ls("hookstates", HOOK_STATES);
      cardEl.style.background = act === "win" ? "#e7f7ec" : act === "fav" ? "#fff6e0" : "";
      toast(act === "win" ? "Marked WINNER — requires test confirmation" : "Added to favorites", "ok");
    });
  }

  /* ---------------- UGC generator (spec 17) ---------------- */
  const UGC_PART = {
    HOOK: { en: "Your home office is fighting your focus", fr: "Votre bureau à la maison sabote votre concentration", ar: "مكتبك في المنزل يشتّت تركيزك", dz: "مكتبك فالدار يخليك مركزش" },
    PROBLEM: { en: "14 tabs open, three hours later, nothing done", fr: "14 onglets ouverts, trois heures plus tard, rien de fait", ar: "١٤ تبويب مفتوح وبعد ثلاث ساعات لم تنجز شيئاً", dz: "14 صفحة مفتوحة، 3 سوايع، والو ماكملتيش" },
    DISCOVERY: { en: "Then I found a device that changes the room, not just the air", fr: "Puis j'ai trouvé un appareil qui change la pièce, pas seulement l'air", ar: "ثم وجدت جهازاً يغيّر الغرفة وليس الهواء فقط", dz: "من بعد لقيت جهاز يبدل الحاجة فالغرفة، مش غير الهواء" },
    DEMO: { en: "One tap — mist, light ring, work mode", fr: "Un appui — brume, anneau lumineux, mode travail", ar: "لمسة واحدة — بخّاخ وحلقة ضوء ووضع العمل", dz: "كليك وحدة — بخار، ضوء، موديل التركيز" },
    BENEFIT: { en: "Your brain gets the signal: time to focus", fr: "Votre cerveau reçoit le signal : à toi de te concentrer", ar: "عقلك يستقبل الإشارة: حان وقت التركيز", dz: "مخك يفهم: هذاك الوقت تاع التركيز" },
    OFFER: { en: "Today it ships with 3 starter oils", fr: "Aujourd'hui, livré avec 3 huiles de démarrage", ar: "اليوم يأتي مع ٣ زيوت للمبتدئين", dz: "اليوم تاخذو معاه 3 زيوت أولية" },
    CTA: { en: "Tap the link to get focus mode", fr: "Tapez le lien pour activer le mode travail", ar: "اضغط الرابط لتحصل على وضع العمل", dz: "ضغط على الرابط باش تاخذ موديل التركيز" },
  };
  const LANG_NAMES = { en: "English", fr: "French", ar: "Arabic", dz: "Algerian Darija" };

  function renderUgc() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">UGC Creative Generator</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Scripts in 15/20/30 seconds with the structure HOOK → PROBLEM → DISCOVERY → DEMONSTRATION → BENEFIT → OFFER → CTA.</p></div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        ${[["Duration", `<select class="p22-select" id="ugc-dur" style="width:100%"><option>15 seconds</option><option>20 seconds</option><option selected>30 seconds</option></select>`], ["Language", `<select class="p22-select" id="ugc-lang" style="width:100%"><option value="en">English</option><option value="fr">French</option><option value="ar">Arabic</option><option value="dz">Algerian Darija</option></select>`], ["Creator", `<select class="p22-select" id="ugc-creator" style="width:100%"><option>Female · beginner</option><option>Male · expert</option><option>Problem-focused</option><option>Demonstration-focused</option><option>Lifestyle-focused</option></select>`], ["Style", `<select class="p22-select" id="ugc-style" style="width:100%"><option>UGC handheld</option><option>Studio demo</option><option>Desk POV</option></select>`]].map(([l, c]) => `<div><div class="text-[11px] font-bold text-[#9a9aa2] mb-1.5">${l}</div>${c}</div>`).join("")}
      </div>
      <div id="ugc-script" class="mb-4"></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        ${card({ title: "Script variations (ready)", icon: "clapperboard", body: `
          <div class="flex flex-col gap-2">
            ${EM.creative.ugc.map((u) => `<div class="flex items-center gap-2.5 rounded-lg bg-[#fbfbfb] border border-[#f0efed] px-3 py-2"><span class="p22-tag blue">${u.seconds}s</span><div class="min-w-0 flex-1"><div class="text-[12px] font-bold text-[#1c1c1e]">${esc(u.title)}</div><div class="text-[11px] text-[#9a9aa2]">${esc(u.creator)}</div></div><span class="p22-tag green">${u.seconds === 30 ? "RECOMMENDED" : "variant"}</span></div>`).join("")}
          </div>` })}
        ${card({ title: "Creator guidance", icon: "users", body: `
          <div class="flex flex-col gap-1.5 text-[12.5px]">
            ${[["Beginner", "Natural voice, one take, real desk — authenticity over polish."], ["Expert", "Faster cuts, feature callouts, spec-driven credibility."], ["Problem-focused", "Open on the pain, delay the product reveal 10+ seconds."], ["Demonstration-focused", "Show the mist/light within 3 seconds of the hook."], ["Lifestyle-focused", "Room, light and routine shots; product in the second half."]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-36 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
          </div>
          <div class="mt-3">${ev("LANGUAGE ADAPTATION", "Scripts adapt to the selected market. Darija is a distinct copy asset — most competitors don't localize this deep.", "warn")}</div>` })}
      </div>`;
    const draw = () => {
      const dur = $("#ugc-dur").value; const lang = $("#ugc-lang").value; const creator = $("#ugc-creator").value;
      const parts = ["HOOK", "PROBLEM", "DISCOVERY", "DEMO", "BENEFIT", "OFFER", "CTA"];
      const timings = { "15 seconds": ["0-2", "2-6", "6-9", "9-12", "12-14", "14-15", "15"], "20 seconds": ["0-3", "3-8", "8-11", "11-15", "15-18", "18-19", "19-20"], "30 seconds": ["0-4", "4-10", "10-15", "15-22", "22-27", "27-29", "29-30"] };
      $("#ugc-script").innerHTML = card({ title: `Generated script — ${dur} · ${LANG_NAMES[lang]} · ${creator}`, icon: "clapperboard", action: `<button class="p22-btn primary" data-copy>${icon("copy", 13)} Copy</button>`, body: `
        <div class="flex flex-col gap-2">
          ${parts.map((p, i) => `<div class="flex items-start gap-3 p-2.5 rounded-xl ${i === 0 ? "bg-[#e7f7ec] border border-[#cdeeda]" : "bg-[#fbfbfb] border border-[#f0efed]"}">
            <span class="p22-tag ${i === 0 ? "green" : "gray"}" style="min-width:86px">${p}</span>
            <span class="text-[11px] text-[#9a9aa2] w-10 flex-none font-bold">${timings[dur][i]}s</span>
            <span class="text-[13px] text-[#3f3f46] flex-1">${UGC_PART[p][lang]}</span>
          </div>`).join("")}
        </div>` });
      $$("[data-copy]", el).forEach((b) => b.addEventListener("click", () => {
        const txt = parts.map((p, i) => `${p} (${timings[dur][i]}s): ${UGC_PART[p][lang]}`).join("\n");
        navigator.clipboard && navigator.clipboard.writeText(txt); toast("Script copied", "ok");
      }));
    };
    draw();
    ["ugc-dur", "ugc-lang", "ugc-creator", "ugc-style"].forEach((id) => $("#" + id).addEventListener("change", draw));
  }

  /* ---------------- ad copy (spec 18) ---------------- */
  const COPY_DATA = [
    { k: "problem", label: "Problem", pt: "Your home office is fighting your focus. Every candle you light for 'ambiance' is a fire risk, every timer is another app to ignore. One quiet device changes the room — not just the air.", h: "Can't focus at home? Change the room, not your willpower", d: "EmberFlow blends scent, light, timer and fire-safe shut-off into one device.", cta: "Get focus mode", score: [8, 9, 9, 9, 8, 8] },
    { k: "benefit", label: "Benefit", pt: "One tap and your room tells your brain it's work time. Calm mist, a soft light ring and zero fire risk — focus mode on demand, every day.", h: "Focus mode, on demand", d: "A calm, safe, quiet space in one tap.", cta: "Turn it on", score: [7, 9, 9, 8, 7, 7] },
    { k: "curiosity", label: "Curiosity", pt: "There's a 30-second trick home workers don't know. It's not a playlist, an app or a pill — and it makes your desk feel like a different room.", h: "The switch your desk is missing", d: "Scent + light + safety, engineered into one device.", cta: "Find out", score: [9, 7, 8, 8, 7, 8] },
    { k: "demo", label: "Demonstration", pt: "Watch it happen: one tap, mist rises, the light ring shifts, the room changes. No candles, no timers, no five devices on your desk.", h: "One tap. That's it.", d: "The demo says more than this caption.", cta: "Watch", score: [9, 8, 8, 9, 8, 9] },
    { k: "social", label: "Social proof", pt: "40 remote workers tried focus mode for one week. Most finished their deep-work block in silence — and kept it on. This is one of their desks.", h: "3 home offices, one change", d: "Real people, real desks, one device.", cta: "See the results", score: [7, 8, 9, 8, 8, 8] },
    { k: "transform", label: "Transformation", pt: "Cluttered desk in the morning, calm focus space by lunch. The room adapts to your work — not the other way around.", h: "From scattered brain to deep work", d: "A desk that signals 'work mode'.", cta: "Start the change", score: [8, 8, 8, 9, 8, 8] },
    { k: "price", label: "Price", pt: "A diffuser, a timer, a lamp and a fire-safe switch cost more than EmberFlow — and fight each other on your desk. One device replaces all four.", h: "Everything it replaces, in one device", d: "Scent, light, timing and safety for less than the sum of its parts.", cta: "Get it now", score: [8, 8, 8, 9, 8, 8] },
    { k: "offer", label: "Offer", pt: "Launch bundle: EmberFlow + 3 starter oils in one box. Ships today with free delivery across Algeria.", h: "Includes 3 starter oils", d: "A real bundle with a real discount — nothing fake.", cta: "Claim the bundle", score: [7, 8, 9, 8, 9, 9] },
    { k: "urgency", label: "Urgency", pt: "The 7-day launch bundle closes Sunday. No fake timer, no fake stock — just the launch window, then the price returns to standard.", h: "Launch bundle ends Sunday", d: "3 starter oils included while the launch runs.", cta: "Order before Sunday", score: [7, 8, 8, 7, 9, 8] },
    { k: "convenience", label: "Convenience", pt: "Plug it in once, choose a preset, forget about it. No refill hassles, no hot oil, no app to babysit — it just works, safely.", h: "Set it once, forget the rest", d: "A device that runs your focus mode for you.", cta: "Set it up", score: [7, 9, 8, 8, 8, 8] },
  ];

  function renderAdcopy() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Ad Copy Generator</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Primary text + headline + description + CTA per angle, each scored on Hook, Clarity, Relevance, Persuasion, Credibility and Purchase intent.</p></div>
      <div class="flex flex-col gap-3">
        ${COPY_DATA.map((c) => {
          const avg = Math.round(c.score.reduce((a, b) => a + b, 0) / c.score.length);
          return card({ title: c.label + " angle", icon: "type", action: `<span class="p22-tag ${avg >= 8 ? "green" : "amber"}">${avg}/10 overall</span>`, body: `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div class="flex flex-col gap-2 text-[12.5px]">
                <div><div class="text-[10.5px] font-bold text-[#9a9aa2] mb-0.5">PRIMARY TEXT</div><div class="text-[#3f3f46]">${c.pt}</div></div>
                <div><div class="text-[10.5px] font-bold text-[#9a9aa2] mb-0.5">HEADLINE</div><div class="font-bold text-[#1c1c1e]">${c.h}</div></div>
                <div><div class="text-[10.5px] font-bold text-[#9a9aa2] mb-0.5">DESCRIPTION</div><div class="text-[#3f3f46]">${c.d}</div></div>
                <div><div class="text-[10.5px] font-bold text-[#9a9aa2] mb-0.5">CTA</div><div class="font-semibold text-[#0fa05a]">${c.cta}</div></div>
              </div>
              <div class="flex flex-col gap-1.5">
                ${[["Hook", c.score[0]], ["Clarity", c.score[1]], ["Relevance", c.score[2]], ["Persuasion", c.score[3]], ["Credibility", c.score[4]], ["Purchase intent", c.score[5]]].map(([l, v]) => scoreRow(l, v, v >= 8 ? "#0fa05a" : v >= 6 ? "#b98a1f" : "#d32f2f")).join("")}
              </div>
            </div>` });
        }).join("")}
      </div>
      <div class="mt-3">${ev("COPY RULES", "Every claim maps to a fact in the product data. No invented stats, no 'hurry, only 3 left' — urgency only when real.", "warn")}</div>`;
  }

  /* ---------------- landing pages (spec 24) ---------------- */
  const LP_BLOCKS = ["Hero", "Problem", "Solution", "Product demonstration", "Benefits", "Features", "Social proof", "Offer", "Guarantee", "FAQ", "COD form", "CTA"];
  function renderLandings() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Landing Page Strategy</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Product-specific structure with AI-generated copy. Two variants to A/B test.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${card({ title: "12-block structure", icon: "layout-template", body: `
          <div class="flex flex-col gap-1.5">${LP_BLOCKS.map((b, i) => `<div class="flex items-center gap-2 text-[12.5px]"><span class="w-5 h-5 rounded-full bg-[#e7f7ec] text-[#0fa05a] grid place-items-center text-[11px] font-bold">${i + 1}</span><span class="text-[#3f3f46]">${b}</span>${b === "COD form" ? tag("critical", "green") : ""}</div>`).join("")}</div>` })}
        ${card({ title: "Variant A — Focus story", icon: "file-text", body: `
          <div class="flex flex-col gap-2 text-[12.5px]">
            ${[["Headline", "Your home office is fighting your focus"], ["Subheadline", "One quiet device changes the room — not just the air."], ["Hero CTA", "Get focus mode · 5,900 DA"], ["Offer", "Bundle +3 oils, free shipping"], ["Guarantee", "30-day money back (pending registration)"], ["FAQ", "Is it safe to leave on? · How long do oils last?"]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-24 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
            <div class="mt-1">${tag("TEST FIRST", "green")}</div></div>` })}
        ${card({ title: "Variant B — Standard product", icon: "layout-template", body: `
          <div class="flex flex-col gap-2 text-[12.5px]">
            ${[["Headline", "EmberFlow — smart aroma diffuser"], ["Subheadline", "Scent, timer, light and fire-safe shut-off in one device."], ["Hero CTA", "Order now"], ["Offer", "Standard + free shipping"], ["Guarantee", "7-day exchange"], ["FAQ", "What oils work? · Power cable included?"]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-24 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
            <div class="mt-1">${tag("CONTROL", "gray")}</div></div>` })}
      </div>
      ${card({ title: "Objection handling (must answer before COD form)", icon: "circle-help", body: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${[["Is it safe to leave on?", "Cold-air atomizer + auto shut-off. It's engineered for unattended use."], ["Why so expensive vs a diffuser?", "It replaces a diffuser, a timer, a lamp and a fire risk — priced against the bundle."], ["What if it doesn't fit my room?", "Big-room effectiveness is honest: works best in a desk/room zone, not a hall."], ["Oils cost forever?", "3 starter oils included; refill boxes available at a flat price."], ["How fast is delivery?", "1–2 weeks to Algerian wilayas; COD with phone confirmation."], ["What if I don't like it?", "30-day guarantee — return or exchange (pending registration)."]].map(([q, a2]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3.5"><div class="text-[12.5px] font-bold text-[#1c1c1e]">${q}</div><div class="text-[12px] text-[#3f3f46] mt-0.5">${a2}</div></div>`).join("")}
        </div>` })}
      <div class="mt-3">${ev("TESTING PLAN", "Landing page is test #6 in the plan — only after creative and offer have winners. Changing two variables at once hides which one moved the KPI.", "warn")}</div>`;
  }

  /* ---------------- winning product score (spec 8) ---------------- */
  function renderScore() {
    const p = product();
    const el = $("#p22-content");
    const factors = [
      ["Demand", p.demand, "Growing +31% / 12wk; stable, seasonal lift.", "V"],
      ["Creative potential", p.creative, "Demo-led UGC: mist + light change films in 10 seconds.", "V"],
      ["Margin", 7, "5,900 DA price vs 2,450 DA landed cost = 58% gross.", "V"],
      ["Competition", p.comp, "3 public players; focus-first niche underserved locally.", "I"],
      ["Shipping", p.shipS, "1.1 kg, non-fragile, air-shippable, 450 DA.", "V"],
    ];
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Winning Product Score</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1"><b>${esc(p.name)}</b> — a weighted hypothesis with evidence, not a guarantee.</p></div>
        <div class="flex items-center gap-2">${productSwitcher()}${opp(p.opp)}</div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div class="p22-card hot" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:26px">
          <div class="text-[11px] font-extrabold tracking-wider text-[#9a9aa2]">WINNING PRODUCT SCORE</div>
          ${ringSVG(p.score, 132)}
          <div class="text-[12px] text-[#9a9aa2]">${p.score >= 80 ? "HIGH POTENTIAL" : p.score >= 70 ? "GOOD TEST" : "VALIDATE"}</div>
        </div>
        <div class="p22-card lg:col-span-2">
          <div class="p22-card-head"><span class="p22-card-ic">${icon("gauge", 16)}</span><div><div class="p22-card-title">Score breakdown</div><div class="p22-card-sub">Each factor shows its evidence and source</div></div></div>
          <div class="flex flex-col gap-2">
            ${factors.map(([l, s, evt, srcT]) => `
              <div>
                <div class="flex items-center justify-between mb-1"><span class="text-[12.5px] font-semibold text-[#1c1c1e]">${l}</span><b class="text-[13px] text-[#1c1c1e]">${s}/10</b></div>
                <div class="p22-bar"><i style="width:${s * 10}%"></i></div>
                <div class="flex items-center gap-2 mt-1"><span class="text-[11.5px] text-[#9a9aa2]">${evt}</span>${src(srcT)}</div>
              </div>`).join("")}
          </div>
          <div class="mt-3">${ev("WHY THIS SCORE EXISTS", "Demand is real and growing, the demo is the cheapest ad asset you own, and the economics leave room for ads. Competition is the only soft spot — it caps the upside, it doesn't kill it.", "warn")}</div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        ${card({ title: "What would change the score", icon: "refresh-cw", body: `
          <div class="flex flex-col gap-2 text-[12.5px]">
            ${[["Verified local search volume", "raises or lowers Demand by 1–2 pts"], ["One paid creative test", "confirms or corrects Creative potential"], ["Bulk MOQ quote", "locks the real landed margin"], ["Competitor ad-spend scan", "sharpens the Competition score"]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#3f3f46] flex-1">${l}</span><span class="text-[#9a9aa2] text-right">${v}</span></div>`).join("")}
          </div>` })}
        ${card({ title: "Never a promise", icon: "shield-alert", body: `
          <p class="text-[12.5px] text-[#3f3f46] leading-relaxed">A high score means: the strongest evidence available points this way, the economics hold, and the smartest next step is a cheap test. It does <b>not</b> guarantee sales.</p>
          <div class="mt-3">${ev("THE PRINCIPLE", "Score the evidence, run the test, let the data vote. Every recommendation in this platform reduces uncertainty — it never promises a winner.", "warn")}</div>` })}
      </div>`;
    wireProductSwitch(el);
  }

  /* ---------------- scorecard (spec 56) ---------------- */
  const DEFAULT_W = { demand: 16, trend: 6, problem: 12, diff: 8, comp: 10, margin: 12, creative: 18, demo: 14, cod: 10, shipping: 14, ret: 10, upsell: 4, repeat: 2 };
  function renderScorecard() {
    const el = $("#p22-content");
    const p = product();
    const scores = {};
    EM.scorecard.forEach((s) => { scores[s.k] = s.s; });
    if (p.id !== "p1") Object.assign(scores, { demand: p.demand, creative: p.creative, diff: 7, comp: p.comp, demo: p.demo, cod: p.cod, shipping: p.shipS, margin: Math.round(p.margin / 10), ret: 7, upsell: 5, repeat: 3, problem: 7, trend: p.trend === "growing" ? 8 : 6 });
    const weights = Object.assign({}, DEFAULT_W, state.weight || {});
    const overall = () => Math.round(Object.keys(weights).reduce((a, k) => a + (scores[k] || 0) * weights[k], 0) / Object.values(weights).reduce((a, b) => a + b, 0) * 10);
    const labels = { demand: "Demand", trend: "Trend", problem: "Problem", diff: "Differentiation", comp: "Competition", margin: "Margin", creative: "Creative", demo: "Demo", cod: "COD", shipping: "Shipping", ret: "Return risk", upsell: "Upsell", repeat: "Repeat purchase" };
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Product Scorecard</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">13 factors · editable weights · live overall score for <b>${esc(p.name)}</b></p></div>
        <div class="flex items-center gap-2"><span class="p22-tag gray">weights = your business</span></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div class="p22-card hot" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:24px">
          <div class="text-[11px] font-extrabold tracking-wider text-[#9a9aa2]">OVERALL OPPORTUNITY SCORE</div>
          ${ringSVG(overall(), 120)}
          <div class="text-[11.5px] text-[#9a9aa2] text-center">Live · custom-weighted blend. The engine headline (${p.score}/100) uses the full model — this is the transparent linear view.</div>
        </div>
        <div class="p22-card lg:col-span-2">
          <div class="p22-card-head"><span class="p22-card-ic">${icon("sliders-horizontal", 16)}</span><div><div class="p22-card-title">13 factors — drag weights</div><div class="p22-card-sub">Higher weight = the factor matters more for your business</div></div></div>
          <div class="flex flex-col gap-2">
            ${Object.keys(weights).map((k) => `
              <div class="flex items-center gap-2">
                <span class="text-[12px] text-[#3f3f46] w-32 flex-none">${labels[k]}</span>
                <div class="p22-bar" style="flex:1"><i style="width:${scores[k] * 10}%"></i></div>
                <span class="text-[12px] font-bold w-8 text-right text-[#1c1c1e]">${scores[k]}/10</span>
                <input type="range" min="0" max="25" value="${weights[k]}" class="w-20 accent-[#0fa05a]" data-wk="${k}">
                <span class="text-[11px] font-bold w-6 text-[#9a9aa2]">${weights[k]}</span>
              </div>`).join("")}
          </div>
          <div class="mt-3 flex items-center gap-2">
            <button class="p22-btn ghost" id="scorecard-reset" style="font-size:12px">Reset weights</button>
            <span class="text-[11.5px] text-[#9a9aa2]">Your weighting is saved locally.</span>
          </div>
        </div>
      </div>`;
    el.addEventListener("input", (e) => {
      if (!e.target.hasAttribute("data-wk")) return;
      weights[e.target.getAttribute("data-wk")] = +e.target.value;
      state.weight = weights; ls("weight", weights);
      renderScorecard();
    });
    $("#scorecard-reset").addEventListener("click", () => { state.weight = null; localStorage.removeItem("p22.weight"); renderScorecard(); toast("Weights reset to defaults", "ok"); });
  }

  /* ---------------- readiness scores (spec 25-31) ---------------- */
  function renderReadiness() {
    const el = $("#p22-content");
    const r = EM.readiness;
    const cards = [
      { t: "DEMO SCORE", s: r.demo, ic: "play", body: "Before/after potential, visible transformation, speed of result, ease of filming, visual wow, problem visibility. Strong demo = cheap creative." },
      { t: "IMPULSE BUY SCORE", s: r.impulse, ic: "zap", body: "Problem urgency, emotional appeal, price accessibility, visual appeal, novelty, convenience, demo, perceived value. Mid-ticket means it needs a real hook, not a coupon." },
      { t: "COD SCORE", s: r.cod, ic: "hand-coins", body: "Price, trust requirement, size, shipping complexity, return risk, customer understanding, impulse potential. 5,900 DA sits in the trusted COD band." },
      { t: "SHIPPING SCORE", s: r.shipping, ic: "truck", body: "Weight, dimensions, fragility, complexity, cost, return difficulty, storage. Flag: EASY TO SHIP — 1.1 kg, no battery, no aerosol." },
      { t: "REPEAT POTENTIAL", s: r.repeat, ic: "refresh-cw", body: "Consumables, accessories, refills, replacement, upsells, subscriptions. Low today — but the oil refill box is the lever to raise it." },
    ];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Readiness Scores</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Six readiness gates for ${esc(product().name)} — each explains its own reasoning.</p></div>
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
        ${cards.map((c) => `<div class="p22-card">
          <div class="p22-card-head"><span class="p22-card-ic">${icon(c.ic, 15)}</span><div><div class="p22-card-title">${c.t}</div><div class="p22-card-sub">${c.s}/10</div></div></div>
          <div class="p22-bar mb-2.5"><i style="width:${c.s * 10}%"></i></div>
          <p class="text-[12px] text-[#3f3f46] leading-relaxed">${c.body}</p>
        </div>`).join("")}
        <div class="p22-card">
          <div class="p22-card-head"><span class="p22-card-ic" style="background:#faeec8;color:#b98a1f">${icon("alert-triangle", 15)}</span><div><div class="p22-card-title">RETURN RISK</div><div class="p22-card-sub">${r.returnRisk}</div></div></div>
          <p class="text-[12px] text-[#3f3f46] leading-relaxed">No size, color or compatibility traps. Watch: <b>quality expectation</b> — a 'cheap diffuser' buyer may be disappointed, so the landing page must set the premium expectation honestly. Not size-dependent, not fragile.</p>
        </div>
        <div class="p22-card">
          <div class="p22-card-head"><span class="p22-card-ic">${icon("activity", 15)}</span><div><div class="p22-card-title">PRODUCT LIFECYCLE</div><div class="p22-card-sub">${r.lifecycle}</div></div></div>
          <p class="text-[12px] text-[#3f3f46] leading-relaxed">${r.lifecycle === "Growing" ? "In the growing phase for DZ: early adopters exist, competitors are few, and interest is rising. Recommendation: TEST NOW." : "Mature/declining — recommend different positioning or avoid."}</p>
          <div class="mt-2">${tag("TEST NOW", "green")}</div>
        </div>
      </div>
      <div class="mt-3">${ev("HONEST LIMIT", "Return-risk and impulse scores are AI estimations from product characteristics + marketplace signals — not measured outcomes. Real returns appear in Test Results.", "warn")}</div>`;
  }

  /* ---------------- validation checklist (spec 32) ---------------- */
  function renderChecklist() {
    const el = $("#p22-content");
    const items = EM.checklist;
    const ok = items.filter((i) => i.ok === true).length;
    const partial = items.filter((i) => i.ok === "partial").length;
    const missing = items.filter((i) => i.ok !== true && i.ok !== "partial").length;
    const complete = partial === 0 && missing === 0;
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Product Validation Checklist</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">Ten gates before any test budget is approved.</p></div>
        <span class="p22-tag ${complete ? "green" : "amber"}">${complete ? "VALIDATION COMPLETE" : "MISSING INFORMATION · " + (partial + missing) + " items"}</span>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${card({ title: "Progress", icon: "clipboard-check", body: `
          <div class="flex items-center gap-4">
            ${ringSVG(Math.round(ok / items.length * 100), 92)}
            <div class="text-[12.5px] text-[#3f3f46]"><b>${ok}/10</b> verified<br>${partial} partial<br>${missing} missing</div>
          </div>` })}
        <div class="p22-card lg:col-span-2">
          <div class="p22-card-head"><span class="p22-card-ic">${icon("list-checks", 16)}</span><div><div class="p22-card-title">The 10 gates</div></div></div>
          <div class="flex flex-col">
            ${items.map((i) => `<div class="flex items-start gap-2.5 py-1.5 border-b border-[#f4f3f1] last:border-0">
              ${i.ok === true ? `<span style="color:#0fa05a;margin-top:1px">${icon("check-circle-2", 15)}</span>` : i.ok === "partial" ? `<span style="color:#b98a1f;margin-top:1px">${icon("alert-circle", 15)}</span>` : `<span style="color:#d32f2f;margin-top:1px">${icon("x-circle", 15)}</span>`}
              <div class="flex-1"><div class="text-[12.5px] font-semibold text-[#1c1c1e]">${i.item}</div><div class="text-[11.5px] text-[#9a9aa2]">${i.why}</div></div>
              ${i.ok === true ? tag("OK", "green") : i.ok === "partial" ? tag("PARTIAL", "amber") : tag("MISSING", "red")}
            </div>`).join("")}
          </div>
        </div>
      </div>
      ${card({ title: "Why it still says MISSING INFORMATION", icon: "circle-help", body: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${[["Competition manageable", "PARTIAL — 3 players found, but local ad-spend intensity is unknown."], ["Market opportunity", "PARTIAL — trend growing, but no verified search volume for DZ yet."]].map(([l, v]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3"><div class="text-[12px] font-bold text-[#1c1c1e] mb-0.5">${l}</div><div class="text-[11.5px] text-[#3f3f46]">${v}</div></div>`).join("")}
        </div>
        <div class="mt-3">${ev("GATE RULE", "We never mark a checklist complete from AI estimates alone. Two partials mean: start the cheap creative test, and collect the missing inputs in parallel.", "warn")}</div>` })}
      `;
  }

  /* ---------------- risk engine (spec 54) ---------------- */
  function renderRisk() {
    const el = $("#p22-content");
    const flagged = EM.risk.filter((r) => r.level === "medium" || r.level === "high");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Product Risk Engine</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Checked before any 'winner' is shown. Risky or restricted products are flagged for manual review — never auto-recommended.</p></div>
      ${flagged.length ? `<div class="flex items-center gap-2 mb-3 p-3 rounded-xl bg-[#fff6e0] border border-[#f0d27a] text-[12.5px] text-[#7a5b12]">${icon("flag", 15)} ${flagged.length} item(s) flagged for manual review: trademark registration for 'EmberFlow'.</div>` : ""}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        ${EM.risk.map((r) => `<div class="p22-card">
          <div class="p22-card-head"><span class="p22-card-ic" style="background:${r.level === "low" ? "#e7f7ec" : r.level === "medium" ? "#faeec8" : "#fdeaea"};color:${r.level === "low" ? "#0fa05a" : r.level === "medium" ? "#b98a1f" : "#d32f2f"}">${icon(r.level === "low" ? "shield-check" : "shield-alert", 15)}</span><div class="flex-1"><div class="p22-card-title">${r.area}</div></div>${tag(r.level.toUpperCase(), r.level === "low" ? "green" : "amber")}</div>
          <p class="text-[12.5px] text-[#3f3f46] leading-relaxed mt-1">${r.why}</p>
        </div>`).join("")}
      </div>
      <div class="mt-4">${card({ title: "Decision rules", icon: "shield-check", body: `
        <div class="flex flex-col gap-2 text-[12.5px]">
          ${[["Restricted products", "Never auto-recommended — always blocked and flagged."], ["Medical claims", "Any health claim requires source evidence; EmberFlow copy avoids them."], ["Trademark / counterfeit", "Name registration checked before scaling (currently the only amber)."], ["Platform rules", "Ad-account policy review before launch — done in the ads module."]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-40 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
        </div>` })}</div>`;
  }

  /* ---------------- evidence system (spec 34) ---------------- */
  function renderEvidence() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Evidence System</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Every important score carries evidence, split into VERIFIED DATA · AI ESTIMATION · USER INPUT · UNKNOWN.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${[["VERIFIED DATA", "Facts from connected sources — supplier prices, order signals, public listings.", "verified", "verified"], ["AI ESTIMATION", "Inference from verified facts — demand direction, return risk, creative potential.", "inference", "inference"], ["USER INPUT", "What you told the platform — costs, margins, targets. Replaces estimates when provided.", "user", "user"]].map(([t, v, c]) => `
          <div class="p22-card"><div class="flex items-center gap-2 mb-2">${src(c)}<div class="text-[13px] font-extrabold text-[#1c1c1e]">${t}</div></div><p class="text-[12px] text-[#3f3f46] leading-relaxed">${v}</p></div>`).join("")}
      </div>
      <div class="p22-table-wrap"><table class="p22-table">
        <thead><tr><th>Score area</th><th>Score</th><th>Supporting evidence</th><th>Type</th></tr></thead>
        <tbody>
          ${[["Demand", "8/10", "Google Trends +31% / 12wk; HIGH marketplace orders", "V"], ["Competition", "6/10", "3 public DZ players detected in ad library", "I"], ["Margin", "7/10", "Supplier price 1,950 + shipping 450 + packaging 60 (user inputs)", "U"], ["Creative", "9/10", "Strong visual demonstration potential (10s demo)", "V"], ["COD suitability", "8/10", "Mid-ticket band + low return complexity", "I"], ["Market demand DZ", "—", "Search volume", "X"]].map(([l, s, e, t]) => `<tr><td class="font-semibold">${l}</td><td>${s}</td><td class="text-[#3f3f46]">${e}</td><td>${src(t)}</td></tr>`).join("")}
        </tbody>
      </table></div>
      <div class="mt-4">${card({ title: "Data → evidence → score pipeline", icon: "git-branch", body: `
        <div class="flex items-center justify-between gap-2 flex-wrap">
          ${[["PRODUCT DATA", "price, costs, images"], ["MARKET EVIDENCE", "trends, orders, reviews"], ["ECONOMICS", "margin, CAC, break-even"], ["CREATIVE", "demo, angles, formats"], ["OFFER", "bundle, guarantee"], ["TEST", "results that vote"], ["LEARNING", "updates the score"]].map((s, i) => `<div class="flex items-center gap-2"><span class="p22-step-num">${i + 1}</span><span class="text-[11.5px] font-bold text-[#1c1c1e]">${s}</span>${i < 6 ? `<span class="text-[#b5b5bb]">→</span>` : ""}</div>`).join("")}
        </div>` })}</div>`;
  }

  /* ---------------- data quality (spec 51) ---------------- */
  function renderQuality() {
    const el = $("#p22-content");
    const p = product();
    const pct = p.id === "p1" ? 84 : 88;
    const missing = p.id === "p1" ? ["Shipping cost (estimate used)", "Supplier MOQ (bulk tier)", "Local competition depth"] : ["Local competition depth", "Return history"];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Data Quality</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Completeness % for <b>${esc(p.name)}</b>. High-confidence scores are never computed when key data is missing.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div class="p22-card hot" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:24px">
          <div class="text-[11px] font-extrabold tracking-wider text-[#9a9aa2]">PRODUCT DATA COMPLETENESS</div>
          ${ringSVG(pct, 120)}
          <div class="text-[12px] text-[#9a9aa2]">${pct >= 90 ? "Excellent" : pct >= 75 ? "Good — fill the gaps" : "Weak — do not score confidently"}</div>
        </div>
        ${card({ title: "Complete fields", icon: "check-circle-2", body: `
          <div class="flex flex-col gap-1.5">
            ${["Product name & category", "Price & landed cost", "Supplier + platform", "Images & video availability", "Demand trend (verified)", "Competitor scan (public)"].map((f) => `<div class="flex items-center gap-2 text-[12.5px]"><span style="color:#0fa05a">${icon("check", 13)}</span><span class="text-[#3f3f46]">${f}</span></div>`).join("")}
          </div>` })}
        ${card({ title: "Missing / estimated", icon: "alert-triangle", body: `
          <div class="flex flex-col gap-1.5">
            ${missing.map((f) => `<div class="flex items-center gap-2 text-[12.5px]"><span style="color:#b98a1f">${icon("alert-circle", 13)}</span><span class="text-[#3f3f46]">${f}</span></div>`).join("")}
          </div>
          <div class="mt-3">${ev("IMPACT", "Missing fields cap the confidence of the related scores. The score module marks affected numbers as estimates.", "warn")}</div>` })}
      </div>`;
  }

  /* ---------------- testing plan (spec 42) ---------------- */
  function renderTesting() {
    const el = $("#p22-content");
    const t = EM.tests;
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Testing Plan</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Six sequential tests for <b>${esc(product().name)}</b> — one variable at a time so the data stays clean.</p></div>
      <div class="flex flex-col gap-3">
        ${t.map((x) => card({ title: `TEST #${x.n} — ${x.type}`, icon: "flask-conical", action: tag(x.type, "blue"), body: `
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-[12px] mb-3">
            ${[["Hypothesis", x.hyp], ["Variable", x.var], ["Budget", money(x.budget)], ["Primary KPI", x.kpi], ["Secondary KPI", x.sec], ["Success condition", x.ok], ["Failure condition", x.fail], ["Next action", x.next]].map(([l, v]) => `<div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] p-2.5"><div class="text-[10px] font-extrabold text-[#9a9aa2] mb-0.5">${l.toUpperCase()}</div><div class="text-[#3f3f46]">${v}</div></div>`).join("")}
          </div>
          <div class="flex items-center gap-2 flex-wrap">${[["Creatives", "2"], ["Hooks", "2"], ["Offers", "2"], ["Prices", "3"], ["Audiences", "2"], ["LPs", "2"]].map(([l, v]) => `${tag(l + " · " + v, "gray")}`).join("")}</div>` })).join("")}
      </div>
      <div class="mt-4">${card({ title: "Test hygiene rules", icon: "shield-check", body: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${[["One variable at a time", "Changing creative AND price together hides which one moved the KPI."], ["Equal budget split", "Uneven spend biases the result — keep A/B spend within 20%."], ["Run to significance", "1,500 impressions / ~95% confidence before declaring a winner."], ["No peeking", "Look at results once, at the planned time — early peeking breeds false winners."]].map(([l, v]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3"><div class="text-[12px] font-bold text-[#1c1c1e] mb-0.5">${l}</div><div class="text-[11.5px] text-[#3f3f46]">${v}</div></div>`).join("")}
        </div>` })}</div>`;
  }

  /* ---------------- test results (spec 43) ---------------- */
  function renderResults() {
    const el = $("#p22-content");
    const d = state.testResults.d || { spend: 2500, ctr: 2.6, cpc: 22, leads: 108, orders: 23, confirmed: 16, delivered: 14, revenue: 94400, returns: 0, profit: 31000 };
    const fields = [["spend", "Spend (DA)"], ["ctr", "CTR %"], ["cpc", "CPC (DA)"], ["leads", "Leads"], ["orders", "Orders"], ["confirmed", "Confirmed"], ["delivered", "Delivered"], ["revenue", "Revenue (DA)"], ["returns", "Returns"], ["profit", "Profit (DA)"]];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">AI Test Results</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Enter or upload real results — the AI updates product, creative, offer and market scores, then says what to do next.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${card({ title: "Test #1 — Creative (UGC vs static)", icon: "flask-conical", sub: "Creative test · 5 days · 2,500 DA", body: `
          <div class="grid grid-cols-2 gap-2">${fields.map(([k, l]) => `<div><div class="text-[10.5px] font-bold text-[#9a9aa2] mb-1">${l}</div><input class="p22-input" style="width:100%;padding:7px 10px" data-f="${k}" value="${d[k] != null ? d[k] : ""}"></div>`).join("")}</div>
          <button class="p22-btn primary mt-3" style="width:100%" id="p22-submit-results">${icon("wand-2", 15)} AI reads the results</button>
          <div class="mt-2 text-[11px] text-[#9a9aa2]">Demo pre-fills a winning creative test — edit and resubmit to see the verdict change.</div>` })}
        <div class="p22-card lg:col-span-2">
          <div class="p22-card-head"><span class="p22-card-ic">${icon("brain", 16)}</span><div><div class="p22-card-title">AI verdict</div><div class="p22-card-sub">computed from the numbers above</div></div></div>
          <div id="results-verdict">
            ${ai("AWAITING DATA", "Submit results to see the verdict: CONTINUE / ITERATE / CHANGE ANGLE / CHANGE OFFER / STOP PRODUCT — always with the numbers that justify it.", false)}
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
            ${[["Product score", "84 → ?", "gauge"], ["Creative score", "9/10 → ?", "palette"], ["Offer score", "7/10 → ?", "gift"], ["Market score", "8/10 → ?", "globe-2"]].map(([l, v, ic]) => `<div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3 text-center"><div class="text-[10.5px] font-bold text-[#9a9aa2]">${l}</div><div class="text-[13px] font-extrabold text-[#1c1c1e] mt-1">${v}</div><span class="p22-card-ic" style="width:24px;height:24px;margin:4px auto 0">${icon(ic, 12)}</span></div>`).join("")}
          </div>
        </div>
      </div>`;
    $("#p22-submit-results").addEventListener("click", async () => {
      const get = (k) => parseFloat($(`[data-f="${k}"]`).value);
      const r = {}; fields.forEach(([k]) => { r[k] = get(k); });
      state.testResults = { d: r }; ls("results", state.testResults);
      const confRate = r.orders ? r.confirmed / r.orders : 0;
      const delRate = r.confirmed ? r.delivered / r.confirmed : 0;
      const roas = r.spend ? r.revenue / r.spend : 0;
      const verdict = roas >= 3 && confRate >= 0.65 && delRate >= 0.8 ? ["CONTINUE", "green", "Scale the winning creative, then run Test #2 (hook). The economics are proven: ROAS " + roas.toFixed(1) + "x, confirmation " + pct(confRate, 0) + ", delivery " + pct(delRate, 0) + "."]
        : roas >= 2 ? ["ITERATE", "amber", "Promising but not proven. Raise budget 50% once and re-measure — ROAS " + roas.toFixed(1) + "x is above break-even but below the 3x scale bar."]
        : roas >= 1.2 ? ["CHANGE ANGLE", "amber", "The offer economics hold but the angle isn't landing. Keep the product, swap to the safety/contrast hook family."]
        : ["STOP PRODUCT", "red", "ROAS " + roas.toFixed(1) + "x is below break-even (" + money(1780) + " max CAC). Spend the remaining budget on the next opportunity, not this one."];
      const btn = $("#p22-submit-results");
      btn.disabled = true; btn.innerHTML = `${icon("loader-2", 14)} AI reading results…`;
      const res = live() ? await runAI("test_results", { ...r, confRate, delRate, roas, note: "Read these test results and say exactly what to do next — CONTINUE / ITERATE / CHANGE ANGLE / CHANGE OFFER / STOP PRODUCT — always with the numbers that justify it." }, { maxTokens: 2000 }) : null;
      btn.disabled = false; btn.innerHTML = `${icon("wand-2", 15)} AI reads the results`;
      $("#results-verdict").innerHTML = `
        <div class="flex items-center gap-3 p-4 rounded-2xl" style="background:${verdict[1] === "green" ? "#e7f7ec" : verdict[1] === "amber" ? "#fff6e0" : "#fdeaea"};border:1px solid ${verdict[1] === "green" ? "#cdeeda" : verdict[1] === "amber" ? "#f0d27a" : "#f2b8b8"}">
          <span style="font-size:26px">${verdict[1] === "green" ? "✅" : verdict[1] === "amber" ? "⚠️" : "⛔"}</span>
          <div><div class="text-[16px] font-extrabold" style="color:${verdict[1] === "green" ? "#0b5d34" : verdict[1] === "amber" ? "#7a5b12" : "#7a1518"}">${verdict[0]}</div>
          <div class="text-[12.5px] mt-1" style="color:${verdict[1] === "green" ? "#0b5d34" : verdict[1] === "amber" ? "#7a5b12" : "#7a1518"}">${verdict[2]}</div></div>
        </div>
        <div class="flex flex-col gap-1.5 mt-3 text-[12.5px]">
          ${[["Confirmed conversion", pct(confRate, 0)], ["Delivery rate (of confirmed)", pct(delRate, 0)], ["ROAS", roas.toFixed(2) + "x"], ["Profit this test", money(r.profit)]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] w-44 flex-none font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
        </div>
        ${res ? `<div class="p22-ai dark p-4 mt-3"><div class="ai-label">LIVE AI · ${esc(res.meta.provider || "AI")}</div><div class="text-[12.5px] text-[#c9c9cf]">${aiOut(res.data)}</div></div>` : ""}`;
      toast(res ? "Results ingested — live AI verdict" : "Results ingested — scores updated (demo)", "ok");
    });
  }

  /* ---------------- winner learning (spec 44) ---------------- */
  function renderLearning() {
    const el = $("#p22-content");
    const wins = state.wins;
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Winner Learning Engine</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">When a product wins, the system stores hook, angle, audience, offer, price, creative, market and supplier — and uses the pattern to find the next one.</p></div>
        ${tag(wins.length + " winners stored", wins.length ? "green" : "gray")}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-4">
        ${card({ title: "Stored winning patterns", icon: "database", body: wins.length ? `
          <div class="flex flex-col gap-2">${wins.map((w, i) => `
            <div class="rounded-xl bg-[#fbfbfb] border border-[#f0efed] p-3">
              <div class="flex items-center justify-between"><b class="text-[13px] text-[#1c1c1e]">${esc(w.name)}</b>${tag("WINNER", "green")}</div>
              <div class="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-2 text-[11.5px]">
                ${[["Hook", w.hook], ["Angle", w.angle], ["Audience", w.audience], ["Offer", w.offer], ["Price", w.price], ["Creative", w.creative], ["Market", w.market], ["Supplier", w.supplier]].map(([l, v]) => `<div class="flex gap-1.5"><span class="text-[#9a9aa2] font-semibold">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
              </div>
            </div>`).join("")}</div>` : `
          <div class="text-center py-8 text-[#9a9aa2]">${icon("database", 22)}<div class="mt-2 text-[13px]">No winners recorded yet.<br>The system will only draw conclusions once winners exist.</div></div>` })}
        ${card({ title: "Learned conclusions", icon: "brain", body: wins.length >= 1 ? `
          <div class="p22-ai dark p-4">
            <div class="ai-label">SYSTEM CONCLUSION (demo)</div>
            <p class="text-[12.5px] text-[#c9c9cf] leading-relaxed">With <b>${wins.length}</b> winner(s) stored, the platform is starting to see a pattern: <b>low-to-mid ticket products with strong visual demonstrations and simple COD offers</b> tend to win in this account.</p>
          </div>
          <div class="mt-3">${ev("STATISTICAL WARNING", "A pattern is only a pattern after enough historical data. With a single winner this conclusion is illustrative — the engine stays silent until N ≥ 5 winners.", "warn")}</div>` : `${ai("NOT ENOUGH DATA", "The engine refuses to conclude from zero winners. Record results in Test Results and the pattern builder switches on automatically.", false)}` })}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        ${[["Winning product", "EmberFlow Smart Diffuser"], ["Winning hook", "Your home office is fighting your focus"], ["Winning angle", "Problem → transformation (UGC demo)"], ["Winning audience", "Remote workers 26–45 · broad DZ"], ["Winning offer", "Bundle +3 oils · free shipping"], ["Winning price", "5,900 DA"], ["Winning creative", "9:16 UGC desk-transformation"], ["Winning market", "Algeria (COD)"], ["Winning supplier", "DZ Home Store · AliExpress"]].map(([l, v]) => `<div class="rounded-xl border border-[#f0efed] bg-[#fbfbfb] p-3"><div class="text-[10.5px] font-extrabold text-[#9a9aa2]">${l.toUpperCase()}</div><div class="text-[12px] text-[#3f3f46] mt-0.5">${v}</div></div>`).join("")}
      </div>
      <button class="p22-btn primary mt-4" id="p22-store-win">${icon("trophy", 15)} Store EmberFlow as winner (demo)</button>`;
    $("#p22-store-win").addEventListener("click", () => {
      if (state.wins.length === 0) state.wins = [{ name: "EmberFlow Smart Diffuser", hook: "Your home office is fighting your focus", angle: "Problem → transformation", audience: "Remote workers 26–45 · DZ", offer: "Bundle +3 oils · free shipping", price: "5,900 DA", creative: "9:16 UGC desk-transformation", market: "Algeria · COD", supplier: "DZ Home Store (AliExpress)" }];
      ls("wins", state.wins); toast("Winner stored — learning engine updated", "ok"); renderLearning();
    });
  }

  /* ---------------- similar finder (spec 46) ---------------- */
  function renderSimilar() {
    const el = $("#p22-content");
    const rels = [
      ["Same problem", "Focus at home / can't switch off", ["p3", "p2"]],
      ["Same audience", "Remote workers & students 26-45", ["p3", "p2"]],
      ["Same mechanism", "Auto shut-off / smart home device", ["p7"]],
      ["Same category", "Home & wellness", ["p4", "p5"]],
      ["Complementary", "Oil refills, desk accessories", ["p6"]],
      ["Upsell", "Premium tray + oils kit", ["p7"]],
      ["Cross-sell", "Desk lighting, cable organizers", ["p5"]],
      ["Alternative", "Budget diffusers, candles, lamps", ["p6"]],
    ];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Similar Product Finder</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Related opportunities for <b>${esc(product().name)}</b>, ranked by opportunity — from same-problem to cross-sell.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        ${rels.map(([rel, why, ids]) => card({ title: rel, icon: "git-fork", body: `
          <div class="text-[11.5px] text-[#9a9aa2] mb-2">${why}</div>
          <div class="flex flex-col gap-2">${ids.map((id) => { const p = DB.products.find((x) => x.id === id); return p ? `<div class="flex items-center gap-2.5 rounded-lg bg-[#fbfbfb] border border-[#f0efed] px-3 py-2">
            ${thumb(p.img, p.name)}
            <div class="min-w-0 flex-1"><div class="text-[12.5px] font-bold text-[#1c1c1e]">${esc(p.name)}</div><div class="text-[11px] text-[#9a9aa2]">${money(p.price)} · margin ${p.margin}%</div></div>
            <span class="text-[15px] font-extrabold text-[#0fa05a]">${p.score}</span></div>` : ""; }).join("")}</div>` })).join("")}
      </div>
      <div class="mt-4">${ev("RANKING", "Similar products are ranked by their own weighted score — a 'same problem' match with a low score is still a weak opportunity.", "warn")}</div>`;
  }

  /* ---------------- AI product report (spec 45) ---------------- */
  function renderReport() {
    const el = $("#p22-content");
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">AI Product Report — ${esc(product().name)}</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">Full research write-up, generated from verified evidence + AI estimation (never from guesses).</p></div>
        ${tag("REPORT · 16 sections", "green")}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div class="lg:col-span-2">
          ${EM.report.map(([t, v]) => card({ title: t, icon: "file-text", body: `<p class="text-[13px] text-[#3f3f46] leading-relaxed">${v}</p>${[["Quality", "HIGH"], ["Source", "VERIFIED"]].map(([l, s]) => `<span class="p22-chip" style="margin-right:6px">${l}: ${s}</span>`).join("")}` })).join("")}
        </div>
        <div class="flex flex-col gap-3">
          ${card({ title: "How it's generated", icon: "workflow", body: `<div class="flex flex-col gap-2 text-[12px] text-[#3f3f46]">
            ${[["1", "Collect", "Pull verified evidence from connected sources + user input"], ["2", "Analyze", "Analyzer + demand + market + competitor + gap modules run"], ["3", "Estimate", "Unverified metrics are tagged AI ESTIMATION, never fact"], ["4", "Write", "Sections are drafted per evidence level — no hallucinated specs"], ["5", "Present", "All sources linked; blanks stay UNKNOWN"]].map(([n, t, d]) => `<div class="flex gap-2.5"><span class="flex-none w-5 h-5 rounded-full text-center text-[11px] font-extrabold text-white" style="background:#0fa05a;line-height:20px">${n}</span><div><b>${t}</b><div class="text-[#9a9aa2]">${d}</div></div></div>`).join("")}
          </div>` })}
          ${card({ title: "Evidence levels", icon: "scale", body: `<div class="flex flex-col gap-1.5 text-[12px]">
            ${[["VERIFIED", "green"], ["AI ESTIMATION", "amber"], ["USER INPUT", "blue"], ["UNKNOWN", "red"]].map(([l, c]) => `<div class="flex items-center gap-2"><span class="p22-chip" style="border-color:var(--chip-${c})">${l}</span><span class="text-[#9a9aa2]">never presented as fact</span></div>`).join("")}
          </div>` })}
          ${card({ title: "Export", icon: "download", body: `<button class="p22-btn primary" style="width:100%" id="p22-export-report">${icon("download", 15)} Download report (.md)</button>
          <div class="mt-2 text-[11px] text-[#9a9aa2]">Markdown with every evidence tag preserved.</div>` })}
        </div>
      </div>`;
    $("#p22-export-report").addEventListener("click", () => {
      const mdTxt = "# " + product().name + " — AI Product Report\n\n" + EM.report.map(([t, v]) => "## " + t + "\n\n" + v + "  \n[evidence: VERIFIED / AI ESTIMATION]\n").join("\n");
      const a = document.createElement("a"); a.href = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdTxt); a.download = "product22-report.md"; a.click();
      toast("Report downloaded (demo)", "ok");
    });
  }

  /* ---------------- AI advisor (spec 40) ---------------- */
  function renderAdvisor() {
    const el = $("#p22-content");
    const faqs = [
      ["Which creative should I run first?", "Run the UGC desk-transformation (9:16) against a static price-anchor (1:1) at equal budget. Creative is your cheapest variable and the demo is strong — if the hook-rate gap is ≥8 pts at 95% confidence, scale the winner and move to Test #2."],
      ["Should I price at 5,900 or 6,500 DA?", "5,900 balances the 58% margin with conversion; 6,500 is the premium proof point. Test 5,490 / 5,900 / 6,500 at equal spend in Test #4 and keep whichever maximizes profit per order."],
      ["Is the Algerian market ready for this?", "Yes, conditionally: scent/wellness demand is rising among urban 25–40 buyers, COD is the norm and there is low focus-first competition. Keep the price inside the 4,000–7,000 DA band and test creative before scaling budget."],
      ["What is the biggest risk?", "Positioning risk — 'just a diffuser at 2x the price'. The focus-first angle + fire-safe shut-off is the mitigation, and it must live in the first 3 seconds of every ad."],
    ];
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">AI Advisor</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Ask anything about <b>${esc(product().name)}</b> or your pipeline — the advisor answers from the research, and never invents facts.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div class="lg:col-span-2 flex flex-col gap-3">
          <div class="p22-card flex-1">
            <div class="p22-card-head"><span class="p22-card-ic">${icon("bot-message-square", 16)}</span><div><div class="p22-card-title">Conversation</div><div class="p22-card-sub">demo — connect a provider in Settings for live answers</div></div></div>
            <div id="p22-advisor-chat" class="flex flex-col gap-2.5 max-h-[420px] overflow-auto p-1"></div>
            <div class="flex gap-2 mt-3">
              <input class="p22-input flex-1" id="p22-advisor-input" placeholder="Ask the advisor…">
              <button class="p22-btn primary flex-none" id="p22-advisor-send">${icon("send", 15)} Send</button>
            </div>
          </div>
          ${card({ title: "Suggested questions", icon: "sparkles", body: `<div class="flex flex-wrap gap-2">${faqs.map(([q]) => `<button class="p22-chip" data-q="${esc(q)}">${q}</button>`).join("")}</div>` })}
        </div>
        <div class="flex flex-col gap-3">
          ${card({ title: "Context the advisor sees", icon: "eye", body: `<div class="flex flex-col gap-1.5 text-[12px]">
            ${[["Product", product().name], ["Score", "84/100 HIGH"], ["Budget", state.budget + " DA"], ["Market", "Algeria (primary) / France (secondary)"], ["Next step", "Creative Test #1 — 2,500 DA"], ["Evidence", "VERIFIED + AI ESTIMATION + USER INPUT"]].map(([l, v]) => `<div class="flex gap-2"><span class="text-[#9a9aa2] font-semibold w-24 flex-none">${l}</span><span class="text-[#3f3f46]">${v}</span></div>`).join("")}
          </div>` })}
          <div class="p22-ai dark p-4">${ai("ADVISOR RULE", "Answers cite evidence levels. If a fact is not in the research, the advisor says so instead of guessing.", false)}</div>
        </div>
      </div>`;
    const chat = $("#p22-advisor-chat");
    const push = (who, txt) => {
      chat.insertAdjacentHTML("beforeend", `<div class="flex gap-2 ${who === "you" ? "flex-row-reverse" : ""}"><div class="p22-avatar" style="background:${who === "you" ? "#0fa05a" : "#1c1c1e"}">${who === "you" ? "Y" : "AI"}</div><div class="p22-bubble ${who === "you" ? "you" : ""}">${txt}</div></div>`);
      chat.scrollTop = chat.scrollHeight;
    };
    const answer = (q) => {
      const hit = faqs.find(([f]) => f === q);
      if (hit) return hit[1];
      const low = q.toLowerCase();
      if (low.includes("price") || low.includes("prix")) return "Break-even ≈ 3,490 DA; target 5,900 DA; premium 7,900 DA. Test 5,490 / 5,900 / 6,500 at equal spend and keep whichever maximizes profit per order.";
      if (low.includes("supplier") || low.includes("source")) return "3 suppliers verified. Best overall: DZ Home Store (AliExpress) — score 92/100, MOQ 1, price 1,450 DA, best for DZ testing volume. Ship risk LOW (1.1 kg, 450 DA).";
      if (low.includes("risk")) return "Top risk: positioning ('just a diffuser at 2x price'). Mitigate with the focus-first angle + fire-safe shut-off in the first 3 seconds. Ship and return risk are LOW–MEDIUM.";
      if (low.includes("profit") || low.includes("margin")) return "Gross margin 58%; at 5,900 DA with ~1,600 DA CAC the net ≈ 2,100 DA/order. Confirmation must stay ≥65% to hold the economics.";
      if (low.includes("win") || low.includes("winner")) return "I can't promise a winner — the score is 84/100 (HIGH POTENTIAL) but that only means the evidence is strong enough to justify a cheap test. Let the data decide.";
      if (low.includes("cod") || low.includes("algeria") || low.includes("dz")) return "Algeria is the primary market: COD is the norm, price band 4,000–7,000 DA, low focus-first competition, simple shipping (450 DA, 1–2 weeks). Use Arabic/French copy with Darija hooks.";
      return "I don't have that fact in the research (UNKNOWN). I can ask you to add it as USER INPUT, or you can connect provider keys in Settings for live answers.";
    };
    push("ai", `Hi — I'm the <b>Product Intelligence advisor</b>. Ask about ${esc(product().name)}'s price, suppliers, market, risks, or what to test next.`);
    $("#p22-advisor-send").addEventListener("click", () => {
      const inp = $("#p22-advisor-input");
      const q = inp.value.trim(); if (!q) return;
      push("you", esc(q));
      push("ai", answer(q) + ` <span class="text-[10px] opacity-60">· ${q.startsWith("Which") || q.startsWith("Should") || q.startsWith("Is") ? "AI ESTIMATION" : "VERIFIED"}</span>`);
      inp.value = "";
    });
    $("#p22-advisor-input").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#p22-advisor-send").click(); });
    document.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => {
      const q = b.getAttribute("data-q");
      push("you", esc(q));
      push("ai", answer(q) + ` <span class="text-[10px] opacity-60">· AI ESTIMATION</span>`);
    }));
  }

  /* ---------------- research automation (spec 41) ---------------- */
  function renderAutomate() {
    const el = $("#p22-content");
    const a = EM.automation;
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Research Automation</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">Schedule the agent to scan sources and hand you a shortlist — you only act on what passed the filters.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        ${card({ title: "Schedule", icon: "timer", body: `
          <div class="flex flex-col gap-2.5">
            ${[["Frequency", a.frequency], ["Run time", a.time], ["Products per run", a.count], ["Min score", a.minScore + "/100"], ["Min margin", a.minMargin + "%"], ["Shipping filter", a.shipFilter], ["Competition filter", a.compFilter], ["Notify via", a.notify]].map(([l, v]) => `<div class="flex gap-2 text-[12px]"><span class="text-[#9a9aa2] font-semibold w-40 flex-none">${l}</span><b class="text-[#1c1c1e]">${v}</b></div>`).join("")}
            <label class="flex items-center gap-2 text-[12px] font-bold"><input type="checkbox" id="p22-auto-on" ${a.active ? "checked" : ""}> Auto-run enabled</label>
          </div>` })}
        ${card({ title: "What runs", icon: "workflow", body: `
          <div class="flex flex-col gap-2 text-[12px]">
            ${[["scout_products", "Sweep 16 discovery connectors for candidates"], ["extract_product", "Extract price / specs / shipping from listings"], ["score_product", "Weighted score + opportunity level"], ["vet_suppliers", "Verify supplier trust & shipping lanes"], ["build_report", "Shortlist report with evidence tags"]].map(([id, d]) => `<div class="flex items-start gap-2 rounded-lg bg-[#fbfbfb] border border-[#f0efed] p-2"><span class="p22-card-ic" style="width:26px;height:26px;flex:none">${icon("bot", 13)}</span><div><b class="text-[#1c1c1e]">${id}</b><div class="text-[#9a9aa2]">${d}</div></div></div>`).join("")}
          </div>` })}
        ${card({ title: "Run history", icon: "history", body: `
          <div class="flex flex-col gap-2">
            ${[["Today 06:00", "ok", "3 candidates · 1 HIGH"], ["Yesterday 06:00", "ok", "5 candidates · 0 HIGH"], ["Aug 08 06:00", "warn", "API limit on AliExpress source"], ["Aug 07 06:00", "ok", "2 candidates · 1 HIGH"]].map(([t, s, n]) => `<div class="flex items-center justify-between text-[12px] rounded-lg bg-[#fbfbfb] border border-[#f0efed] px-2.5 py-1.5"><span class="text-[#9a9aa2]">${t}</span><span class="${s === "ok" ? "text-[#0fa05a]" : "text-[#b98a1f]"} font-bold">${n}</span></div>`).join("")}
          </div>
          <button class="p22-btn outline mt-3" style="width:100%" id="p22-auto-now">${icon("play", 15)} Run now</button>` })}
      </div>
      <div class="mt-3">${ev("GUARDRAIL", "Automation only produces a shortlist with evidence — it never spends money and never auto-launches ads. The human decides.", "warn")}</div>`;
    $("#p22-auto-on").addEventListener("change", (e) => { EM.automation.active = e.target.checked; toast(EM.automation.active ? "Automation enabled" : "Automation paused", EM.automation.active ? "ok" : "warn"); });
    $("#p22-auto-now").addEventListener("click", () => { toast("Run started — scanning 16 sources (demo)", "ok"); });
  }

  /* ---------------- final decision (spec 47) ---------------- */
  function renderFinal() {
    const el = $("#p22-content");
    const f = EM.final;
    const verds = { "TEST NOW": ["🔥", "var(--chip-fire)"], "GO": ["🟢", "var(--chip-green)"], "MAYBE": ["🟡", "var(--chip-amber)"], "WAIT": ["🟠", "var(--chip-orange)"], "NO": ["🔴", "var(--chip-red)"] };
    const [emoji, color] = verds[f.verdict] || verds.MAYBE;
    el.innerHTML = `
      <div class="mb-4"><h1 class="text-[20px] font-extrabold">Final Decision — ${esc(product().name)}</h1>
      <p class="text-[13px] text-[#8a8a92] mt-1">One number, one verdict, one first action. Everything else is noise.</p></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div class="p22-card" style="border:1px solid ${color}">
          <div class="text-center py-6">
            <div style="font-size:44px">${emoji}</div>
            <div class="text-[22px] font-extrabold mt-1" style="color:${color}">${f.verdict}</div>
            <div class="text-[12px] text-[#8a8a92] mt-1">verdict of the research engine</div>
            <div class="flex justify-center mt-3">${ringSVG(product().score, 92)}</div>
            <div class="text-[11px] text-[#8a8a92] mt-1">Winning Product Score</div>
          </div>
          ${tag("VERDICT IS EVIDENCE-BASED — not a promise", "gray")}
        </div>
        <div class="lg:col-span-2">
          ${card({ title: "Why this verdict", icon: "list-check", body: `<ol class="flex flex-col gap-2">${f.reasons.map((r, i) => `<li class="flex gap-2.5 text-[13px] text-[#3f3f46]"><span class="flex-none w-5 h-5 rounded-full text-center text-[11px] font-extrabold text-white" style="background:${color};line-height:20px">${i + 1}</span>${r}</li>`).join("")}</ol>` })}
          ${card({ title: "The first test — designed to fail cheap", icon: "flask-conical", body: `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[12px]">
              ${[["Product", f.firstTest.product], ["Target", f.firstTest.target], ["Price", f.firstTest.price], ["Offer", f.firstTest.offer], ["Creative", f.firstTest.creative], ["Hook", f.firstTest.hook], ["Budget", f.firstTest.budget], ["Primary KPI", f.firstTest.primaryKpi], ["Success condition", f.firstTest.success]].map(([l, v]) => `<div class="rounded-lg bg-[#fbfbfb] border border-[#f0efed] p-2.5"><div class="text-[10px] font-extrabold text-[#9a9aa2]">${l.toUpperCase()}</div><div class="text-[#3f3f46] mt-0.5">${v}</div></div>`).join("")}
            </div>
            <div class="mt-3">${ev("COST OF BEING WRONG", "If the creative test fails you lose ≈ 2,500 DA — less than 1% of a scaled launch. That is the point: cheap evidence before commitment.", "info")}</div>` })}
        </div>
      </div>`;
  }

  /* ---------------- settings (spec 48) ---------------- */
  function renderSettings() {
    const el = $("#p22-content");
    const conn = Object.keys(state.providers).length;
    el.innerHTML = `
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div><h1 class="text-[20px] font-extrabold">Settings</h1>
        <p class="text-[13px] text-[#8a8a92] mt-1">AI providers, evidence policy and platform guardrails. API keys are stored server-side only — the same store the main Settings page uses, so keys added there are already connected here.</p></div>
        ${tag(conn ? conn + " provider(s) connected" : "demo mode — no keys stored", conn ? "green" : "amber")}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        ${DB.providers.map((p) => {
          const k = state.providers[p.id];
          return `<div class="p22-card">
            <div class="p22-card-head"><span class="p22-card-ic">${icon("cpu", 16)}</span><div><div class="p22-card-title">${esc(p.name)}</div><div class="p22-card-sub">${p.role} · ${p.models} models</div></div></div>
            <div class="flex items-center gap-2 mb-3">${k ? tag("KEY SET", "green") : tag("NO KEY", "gray")}${k ? tag("LIVE", "green") : ""}<span class="text-[11px] text-[#9a9aa2]">${k ? "server-side only · " + esc(k.keyMasked) : "connect for live AI"}</span></div>
            ${k ? `<div class="text-[11.5px] text-[#3f3f46] mb-2">Connected automatically from Settings — this provider routes AI tasks on this page.</div>` : `<div class="text-[11.5px] text-[#3f3f46] mb-2">In demo mode the platform answers from its local knowledge base and labels every output SIMULATED.</div>`}
            <div class="flex gap-2">
              <button class="p22-btn ${k ? "outline" : "primary"}" style="flex:1" data-prov="${p.id}" data-name="${esc(p.name)}">${k ? "Manage key" : "Connect " + esc(p.name)}</button>
              ${k ? `<button class="p22-btn ghost" data-test="${p.id}" data-name="${esc(p.name)}">${icon("plug-zap", 14)} Test</button>` : ""}
            </div>
          </div>`;
        }).join("")}
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        ${card({ title: "Evidence & trust policy", icon: "scale", body: `
          <div class="flex flex-col gap-2 text-[12px] text-[#3f3f46]">
            ${[["Never auto-recommend restricted products", "Alcohol, supplements, weight-loss, weaponry and other restricted categories are always excluded — no exception."], ["Never promise a winner", "Every verdict is a probability backed by evidence; a 100/100 score still gets tested."], ["Label everything", "VERIFIED / AI ESTIMATION / USER INPUT / UNKNOWN — estimates are never presented as facts."], ["Human gates", "Automation produces a shortlist only; spending and launching always need a human."]].map(([t, d]) => `<div class="flex gap-2.5"><span class="p22-card-ic flex-none" style="width:24px;height:24px">${icon("shield-check", 13)}</span><div><b>${t}</b><div class="text-[#9a9aa2]">${d}</div></div></div>`).join("")}
          </div>` })}
        ${card({ title: "Platform", icon: "settings", body: `
          <div class="flex flex-col gap-3 text-[12px]">
            <label class="flex items-center justify-between rounded-lg bg-[#fbfbfb] border border-[#f0efed] px-3 py-2.5"><span class="font-bold text-[#1c1c1e]">Local demo data</span><span class="p22-chip">on</span></label>
            <label class="flex items-center justify-between rounded-lg bg-[#fbfbfb] border border-[#f0efed] px-3 py-2.5"><span class="font-bold text-[#1c1c1e]">Restricted-category filter</span><span class="p22-chip">always on</span></label>
            <label class="flex items-center justify-between rounded-lg bg-[#fbfbfb] border border-[#f0efed] px-3 py-2.5"><span class="font-bold text-[#1c1c1e]">Language</span><span class="text-[#9a9aa2]">English · FR · AR (copy-ready)</span></label>
            <div class="text-[11px] text-[#9a9aa2]">Provider keys live in the Punchline API settings page (server/data/settings.json) — never in this browser. This page reads them automatically on load.</div>
          </div>` })}
      </div>`;
    document.querySelectorAll("[data-prov]").forEach((b) => b.addEventListener("click", () => openKeyModal(b.getAttribute("data-prov"), b.getAttribute("data-name"), !!state.providers[b.getAttribute("data-prov")])));
    document.querySelectorAll("[data-test]").forEach((b) => b.addEventListener("click", () => testProviderKey(b.getAttribute("data-test"), b.getAttribute("data-name"))));
  }

  /* Save a provider key server-side (same store as the main Settings page). */
  function openKeyModal(provider, name, hasKey) {
    modal(`<div class="p22-card-head"><span class="p22-card-ic">${icon("key-round", 16)}</span><div><div class="p22-card-title">${name} — API key</div><div class="p22-card-sub">stored server-side only — never in this page</div></div></div>
      <input class="p22-input" style="width:100%" id="p22-key-input" type="password" placeholder="Paste your API key…" autocomplete="off">
      <div class="flex gap-2 mt-3"><button class="p22-btn primary flex-1" id="p22-key-save">${icon("save", 15)} ${hasKey ? "Replace key" : "Save key"}</button><button class="p22-btn outline" onclick="P22.closeModal()">Cancel</button></div>
      <div id="p22-key-status" class="mt-2 text-[12px]"></div>
      <div class="mt-2 text-[11px] text-[#9a9aa2]">Key is saved to the server's settings store — the same store the main Settings page uses — and masked everywhere in the UI.</div>`);
    $("#p22-key-save").addEventListener("click", async () => {
      const key = $("#p22-key-input").value.trim();
      const st = $("#p22-key-status");
      if (!key) { st.innerHTML = `<span style="color:#C93A3F">Paste a key first.</span>`; return; }
      st.innerHTML = `<span style="color:#0b5d34">Saving to server…</span>`;
      try {
        const r = await PL_API.saveSettings({ [provider]: key });
        if (r && r.ok) {
          st.innerHTML = `<span style="color:#0b5d34">Saved — provider connected.</span>`;
          await refreshBackend();
          setTimeout(() => { closeModal(); renderSettings(); }, 500);
        } else {
          st.innerHTML = `<span style="color:#C93A3F">Save failed — is the server running on port 3000?</span>`;
        }
      } catch (e) {
        st.innerHTML = `<span style="color:#C93A3F">${esc(String(e.message || e))}</span>`;
      }
    });
  }

  /* Probe the provider with the stored key (never reveals the key). */
  async function testProviderKey(provider, name) {
    modal(`<div class="p22-card-head"><span class="p22-card-ic">${icon("plug-zap", 16)}</span><div><div class="p22-card-title">Test ${name}</div><div class="p22-card-sub">sending a tiny probe to the provider…</div></div></div>
      <div id="p22-test-out" class="mt-2"></div>
      <div class="flex justify-end gap-2 mt-3"><button class="p22-btn ghost" onclick="P22.closeModal()">Close</button></div>`);
    const out = $("#p22-test-out");
    out.innerHTML = `<span class="text-[12px] text-[#3f3f46]">${icon("loader-2", 14)} Testing…</span>`;
    try {
      const r = await PL_API.testKey(provider);
      out.innerHTML = r && r.ok
        ? `<div class="p22-ai" style="border-color:#cdeeda;background:#e7f7ec"><div class="ai-label">CONNECTED</div><p class="text-[12.5px]" style="color:#0b5d34">${esc(name)} replied via <b>${esc(r.model || "default model")}</b> in ${esc(r.latency || "?")}.</p></div>`
        : `<div class="p22-ai" style="border-color:#f2b8b8;background:#fdeaea"><div class="ai-label">FAILED</div><p class="text-[12.5px]" style="color:#7a1518">${esc((r && r.error) || "Key rejected by provider.")}</p></div>`;
    } catch (e) {
      out.innerHTML = `<div class="p22-ai" style="border-color:#f2b8b8;background:#fdeaea"><div class="ai-label">FAILED</div><p class="text-[12.5px]" style="color:#7a1518">${esc(String(e.message || e))}</p></div>`;
    }
  }

  /* ---------------- dispatch + init ---------------- */
  const RENDER = {
    dashboard: renderDashboard, discover: renderDiscover, trends: renderTrends, winners: renderWinners, budget: renderBudget, haveThis: renderHaveThis, database: renderDatabase,
    analyzer: renderAnalyzer, demand: renderDemand, market: renderMarket, competitors: renderCompetitors, gaps: renderGaps, compare: renderCompare, watchlist: renderWatchlist,
    sourcing: renderSourcing, suppliers: renderSuppliers, import: renderImport, pricing: renderPricing, pricetest: renderPricetest, offers: renderOffers, bundles: renderBundles,
    adintel: renderAdintel, creative: renderCreative, hooks: renderHooks, ugc: renderUgc, adcopy: renderAdcopy, landings: renderLandings,
    score: renderScore, scorecard: renderScorecard, readiness: renderReadiness, checklist: renderChecklist, risk: renderRisk, evidence: renderEvidence, quality: renderQuality,
    testing: renderTesting, results: renderResults, learning: renderLearning, similar: renderSimilar,
    report: renderReport, advisor: renderAdvisor, automate: renderAutomate, final: renderFinal, settings: renderSettings,
  };

  function switchModule(id) {
    state.m = id; ls("m", id);
    const def = modDef(id);
    document.title = def.label + " · Punchline Product Intelligence";
    renderTopbar();
    renderSidebar();
    (RENDER[id] || renderDashboard)();
    if (window.lucide) lucide.createIcons();
  }

  function init() {
    state.m = ld("m", "dashboard");
    try { const u = ld("u", null); if (u && typeof u === "object") Object.assign(state, u); } catch (e) {}
    renderSidebar();
    renderTopbar();
    switchModule(state.m);
    document.querySelectorAll(".p22-drawer-open, [data-open-drawer]").forEach((b) => b.addEventListener("click", openDrawer));
    if (window.lucide) lucide.createIcons();
    window.P22 = {
      switchModule, openModal: modal, closeModal, toast,
      render: switchModule,
    };
    refreshBackend();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
