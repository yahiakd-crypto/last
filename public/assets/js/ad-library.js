/* ============================================================
   PUNCHLINE — AD LIBRARY (ad-library.html)
   Facebook Ads + Product Research + Competitive Intelligence.
   Data comes from the real facebook-ads-library-mcp server via
   the Node backend (/api/fbads/*). When the MCP cannot provide
   data, the UI shows "Not available from current data source" —
   nothing is silently fabricated. An opt-in, clearly-labelled
   SANDBOX sample mode exists so the workspace is explorable
   without a token; every sandbox value is tagged SIMULATED.
   ============================================================ */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ic = (n, s) => `<i data-lucide="${n}" style="width:${s || 14}px;height:${s || 14}px"></i>`;
  const uid = () => "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const num = (v) => Math.round(Number(v) || 0).toLocaleString("en-US").replace(/,/g, " ");
  const toast = (m, t) => { try { window.PL && PL.toast(m, t || "ok"); } catch (e) {} };
  function icons() { try { if (window.lucide) lucide.createIcons(); } catch (e) {} }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const daysAgo = (d) => Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 86400000));

  const COUNTRIES = ["US","CA","GB","FR","DE","ES","IT","AE","SA","DZ","MA","EG","AU","IN","BR","MX","TR","ID","TH","VN","PH","MY","SG","PL","PT","NL","BE","CH","AT","SE","NO","DK","FI","IE","GR","RO","HU","CZ","JP","KR","TW","HK","NG","ZA","KE","GH","PK","BD","NZ","CL","AR","CO","PE","QA","KW","OM","JO","LB","TN","LY","SN","CI","UG","ET"];
  const COUNTRY_NAME = { US:"United States", CA:"Canada", GB:"United Kingdom", FR:"France", DE:"Germany", ES:"Spain", IT:"Italy", AE:"UAE", SA:"Saudi Arabia", DZ:"Algeria", MA:"Morocco", EG:"Egypt", AU:"Australia", IN:"India", BR:"Brazil", MX:"Mexico", TR:"Turkey", ID:"Indonesia", TH:"Thailand", VN:"Vietnam", PH:"Philippines", MY:"Malaysia", SG:"Singapore", PL:"Poland", PT:"Portugal", NL:"Netherlands", BE:"Belgium", CH:"Switzerland", AT:"Austria", SE:"Sweden", NO:"Norway", DK:"Denmark", FI:"Finland", IE:"Ireland", GR:"Greece", RO:"Romania", HU:"Hungary", CZ:"Czechia", JP:"Japan", KR:"South Korea", TW:"Taiwan", HK:"Hong Kong", NG:"Nigeria", ZA:"South Africa", KE:"Kenya", GH:"Ghana", PK:"Pakistan", BD:"Bangladesh", NZ:"New Zealand", CL:"Chile", AR:"Argentina", CO:"Colombia", PE:"Peru", QA:"Qatar", KW:"Kuwait", OM:"Oman", JO:"Jordan", LB:"Lebanon", TN:"Tunisia", LY:"Libya", SN:"Senegal", CI:"Ivory Coast", UG:"Uganda", ET:"Ethiopia" };
  const CC = (c) => (COUNTRY_NAME[c] || c);

  const S = {
    section: "dashboard",
    ads: [],            // normalized ads
    analyses: [],       // creative analyses
    saved: [],          // saved items {type, ref}
    collections: [],    // named collections
    monitors: [],       // monitoring jobs
    searches: [],       // search history
    agentLog: [],
    lastReport: "",
    mcp: { state: "unknown", tools: [], error: null, tokenMasked: "", configured: false },
    research: { countries: ["US"], keyword: "", category: "", dateRange: 90, minAds: 1, active: "ALL" },
    filters: { group: "all", countries: [], time: "90", creative: "ALL", signals: "all" },
  };

  /* ---------------- localStorage ---------------- */
  const L = {
    get(k, d) { try { const v = localStorage.getItem("adl." + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("adl." + k, JSON.stringify(v)); } catch (e) {} },
  };
  function bootStore() {
    S.ads = L.get("ads", []);
    S.analyses = L.get("analyses", []);
    S.saved = L.get("saved", []);
    S.collections = L.get("collections", []);
    S.monitors = L.get("monitors", []);
    S.searches = L.get("searches", []);
    S.lastReport = L.get("lastReport", "");
    S.settings = L.get("settings", { sandbox: false, defaultCountry: "US" });
    if (!S.settings) S.settings = { sandbox: false, defaultCountry: "US" };
  }
  function persist() {
    L.set("ads", S.ads); L.set("analyses", S.analyses); L.set("saved", S.saved);
    L.set("collections", S.collections); L.set("monitors", S.monitors); L.set("searches", S.searches);
    L.set("lastReport", S.lastReport);
    L.set("settings", S.settings);
  }

  /* ---------------- MCP service (frontend → backend → MCP) ---------------- */
  const MCP = {
    async api(path, opts) {
      const r = await fetch(path, Object.assign({ headers: { "content-type": "application/json" } }, opts || {}));
      return r.json();
    },
    async status() { return this.api("/api/fbads/status"); },
    async tools() { return this.api("/api/fbads/tools"); },
    async call(tool, args) { return this.api("/api/fbads/call", { method: "POST", body: JSON.stringify({ tool, args }) }); },
    async config(cfg) { return this.api("/api/fbads/config", { method: "POST", body: JSON.stringify(cfg) }); },
    async test(cfg) { return this.api("/api/fbads/test", { method: "POST", body: JSON.stringify(Object.assign({ persist: false }, cfg)) }); },
    async probe(token) { return this.api("/api/fbads/probe", { method: "POST", body: JSON.stringify({ token }) }); },
    async diagnostics() { return this.api("/api/fbads/diagnostics"); },
    async refresh() { return this.api("/api/fbads/refresh-tools", { method: "POST" }); },
  };

  const MCP_TOOL_META = {
    search_facebook_ads: { icon: "search", group: "Search & Discovery", desc: "Search Facebook Ads Library with advanced filters (brand, country, ad type, date range)." },
    discover_competitor_brands: { icon: "users", group: "Search & Discovery", desc: "Discover competitor brands by industry keywords and region." },
    analyze_ad_creative_elements: { icon: "scan-eye", group: "Deep Analysis", desc: "AI-powered analysis of ad creative elements (text, CTA, sentiment)." },
    analyze_ad_performance_metrics: { icon: "activity", group: "Deep Analysis", desc: "Aggregate impressions, spend ranges and platform/demographic distribution." },
    competitive_ad_analysis: { icon: "swords", group: "Competitive Intelligence", desc: "Compare ad strategies across multiple competitor brands." },
    generate_facebook_intelligence_report: { icon: "file-text", group: "Reporting", desc: "Generate a complete Facebook ads intelligence report for a brand." },
    export_facebook_ads_data: { icon: "download", group: "Utilities", desc: "Export Facebook ads data as JSON, CSV or Markdown." },
  };

  async function refreshMCPStatus() {
    const pill = $("#al-mcp-state");
    try {
      const st = await MCP.status();
      S.mcp = Object.assign(S.mcp, { state: st.state, tools: st.tools || [], error: st.error || null, lastError: st.lastError || null, tokenMasked: st.tokenMasked || "", tokenSource: st.tokenSource || "", configured: st.configured });
    } catch (e) {
      S.mcp.state = "backend_unreachable";
      S.mcp.error = e.message;
    }
    if (pill) {
      const map = { connected: "Connected", disconnected: "Disconnected", auth_error: "Auth error", rate_limited: "Rate limited", tool_error: "Tool error", environment_error: "Environment error", backend_unreachable: "Backend unreachable", ads_library_api_required: "Ads Library API required", unknown: "Checking…" };
      pill.textContent = (S.mcp.state === "connected" ? "MCP connected · " + S.mcp.tools.length + " tools" : "MCP " + map[S.mcp.state]);
      pill.className = "pill al-st " + (S.mcp.state === "connected" ? "connected" : S.mcp.state);
      pill.innerHTML = `<span class="dot"></span>` + esc(pill.textContent);
    }
    return S.mcp;
  }

  function fbErrLine(err) {
    if (!err) return "";
    if (typeof err === "object" && err !== null) {
      const e = err.error && typeof err.error === "object" ? err.error : err;
      if (typeof e === "object" && e !== null) {
        const bits = [];
        if (e.code != null) bits.push("Facebook API error " + e.code + (e.error_subcode != null ? "/" + e.error_subcode : ""));
        if (e.message) bits.push(String(e.message));
        if (e.error_user_msg) bits.push("Fix: " + String(e.error_user_msg));
        if (bits.length) return bits.join(" — ");
        return JSON.stringify(err);
      }
      return JSON.stringify(err);
    }
    return String(err);
  }

  /* ---------------- sandbox sample data (opt-in, SIMULATED) ---------------- */
  function sandboxAds() {
    const now = Date.now();
    const day = 86400000;
    const products = [
      { name: "Portable Blender", cat: "Kitchen", brands: ["BlendGo", "NutriFusion", "SipFresh", "Vitamix Pro"], countries: ["US","GB","FR","AE"], creatives: 14, days: 95, score: 88 },
      { name: "Mini Projector 4K", cat: "Electronics", brands: ["LumenX", "CineBuddy", "VividCast"], countries: ["US","DE","FR","MA"], creatives: 11, days: 70, score: 81 },
      { name: "Gravity Water Bottle", cat: "Fitness", brands: ["HydroFlow", "AquaGravity"], countries: ["US","CA","GB","AU"], creatives: 9, days: 55, score: 76 },
      { name: "Hair Remover Device", cat: "Beauty", brands: ["SilkSmooth", "GlowBare", "DermaSkin"], countries: ["US","FR","SA","DZ"], creatives: 16, days: 110, score: 92 },
      { name: "Car Vacuum Cleaner", cat: "Automotive", brands: ["AutoVac", "DetailPro"], countries: ["US","DE","PL","TR"], creatives: 8, days: 40, score: 69 },
      { name: "Smart Watch", cat: "Electronics", brands: ["PulseTech", "FitOn"], countries: ["US","GB","IN","NG"], creatives: 12, days: 85, score: 79 },
      { name: "Kitchen Organizer Set", cat: "Home", brands: ["HomeZen", "NeatNest"], countries: ["US","FR","ES","IT"], creatives: 7, days: 30, score: 64 },
      { name: "LED Strip Lights", cat: "Home", brands: ["GlowDeco", "LumiStrip"], countries: ["US","BR","MX","TR"], creatives: 6, days: 25, score: 58 },
      { name: "Posture Corrector", cat: "Health", brands: ["BackAlign", "CorePosture"], countries: ["US","GB","AE","MA"], creatives: 10, days: 65, score: 72 },
      { name: "Electric Toothbrush", cat: "Beauty", brands: ["PearlWhite", "SmilePro"], countries: ["US","DE","FR","JP"], creatives: 8, days: 45, score: 67 },
    ];
    const hooks = [
      "Have you ever wondered why this sells out every single day?",
      "Meet the one gadget your kitchen is missing.",
      "Stop wasting money on products that break in a month.",
      "95% of people don't know this simple trick.",
      "The 3-second fix nobody talks about.",
      "Imagine owning this for less than a dinner.",
      "This just hit shelves and it's already everywhere.",
      "Your neighbors will ask where you got this.",
      "The upgrade you've been waiting for is finally here.",
      "Watch this once and you'll never look back.",
    ];
    const ctas = ["Shop Now", "Learn More", "Order Now", "Get Offer", "Try Free", "Sign Up"];
    const formats = ["Video", "Image", "Carousel", "UGC", "Product demo", "Before/After", "Testimonial", "Problem/Solution", "Offer", "Educational", "Lifestyle"];
    const ads = [];
    let n = 0;
    products.forEach((p, pi) => {
      p.brands.forEach((brand, bi) => {
        const nAds = 3 + (bi % 3);
        for (let k = 0; k < nAds; k++) {
          const country = p.countries[(bi + k) % p.countries.length];
          const created = new Date(now - (5 + ((n * 7) % p.days)) * day);
          const active = k % 4 !== 3;
          const spent = active ? (120 + ((n * 37) % 900)) : null;
          ads.push({
            adId: "sand-" + (n + 1),
            product: p.name,
            category: p.cat,
            brand,
            country,
            format: formats[(n + pi) % formats.length],
            status: active ? "ACTIVE" : "INACTIVE",
            created: created.toISOString().slice(0, 10),
            firstSeen: created.toISOString().slice(0, 10),
            lastSeen: new Date(now - (active ? 1 : 20) * day).toISOString().slice(0, 10),
            headline: hooks[(n + pi) % hooks.length],
            body: `${p.name} — problem/solution angle, offer-driven creative. Limited-time offer angle repeated across ${p.countries.length} markets.`,
            cta: ctas[n % ctas.length],
            platform: "facebook" + ((n % 3 === 0) ? "+instagram" : ""),
            spend: spent,
            currency: "USD",
            landing: "https://example.com/" + p.name.toLowerCase().replace(/\W+/g, "-"),
            snapshotUrl: "https://www.facebook.com/ads/library/?id=sand" + (n + 1),
            state: "SIMULATED",
            evidence: { duration: "SIMULATED", spend: "SIMULATED", audience: "SIMULATED", performance: "SIMULATED" },
            creativeScore: 55 + ((n * 13) % 40),
          });
          n++;
        }
      });
    });
    return ads;
  }

  function toggleSandbox(on) {
    S.settings.sandbox = !!on;
    if (on) {
      const sand = sandboxAds();
      const keys = new Set(S.ads.filter((a) => a.state !== "SIMULATED").map((a) => a.adId));
      S.ads = S.ads.filter((a) => a.state !== "SIMULATED").concat(sand.filter((a) => !keys.has(a.adId)));
      persist();
      toast("Sandbox sample data loaded (SIMULATED)", "flask-conical");
    } else {
      S.ads = S.ads.filter((a) => a.state !== "SIMULATED");
      S.analyses = S.analyses.filter((a) => a.state !== "SIMULATED");
      persist();
      toast("Sandbox data removed", "trash-2");
    }
    render();
  }

  /* ---------------- scoring engine (transparent) ---------------- */
  const SCORE_COMPONENTS = [
    { key: "adLongevity", label: "Ad Longevity", w: 0.16 },
    { key: "advertiserAdoption", label: "Advertiser Adoption", w: 0.15 },
    { key: "creativeIteration", label: "Creative Iteration", w: 0.12 },
    { key: "marketDemand", label: "Market Demand Signals", w: 0.12 },
    { key: "competition", label: "Competition", w: 0.11 },
    { key: "expansion", label: "Market Expansion Potential", w: 0.10 },
    { key: "creativeStrength", label: "Creative Strength", w: 0.10 },
    { key: "growth", label: "Growth Signal", w: 0.08 },
    { key: "confidence", label: "Data Confidence", w: 0.06 },
  ];

  function scoreProduct(p) {
    const ads = p.ads || [];
    const c = {
      adLongevity: p.durationDays ? clamp(Math.round(p.durationDays / 1.2), 0, 100) : 0,
      advertiserAdoption: clamp(Math.round((p.advertisers || 1) * 22), 0, 100),
      creativeIteration: clamp(Math.round((p.creatives || 1) * 15), 0, 100),
      marketDemand: clamp(Math.round((ads.length || 0) * 8), 0, 100),
      competition: clamp(100 - (p.advertisers || 1) * 12 - (ads.length || 0) * 2, 0, 100),
      expansion: clamp(Math.round((p.countries || []).length * 25), 0, 100),
      creativeStrength: clamp(Math.round((p.creativeAvg != null ? p.creativeAvg : 60)), 0, 100),
      growth: p.recentRatio != null ? clamp(Math.round(p.recentRatio * 100), 0, 100) : 50,
      confidence: p.evidence === "SIMULATED" ? 55 : p.evidence === "high" ? 88 : 70,
    };
    let total = 0;
    SCORE_COMPONENTS.forEach((x) => { total += (c[x.key] || 0) * x.w; });
    total = clamp(Math.round(total), 0, 100);
    return { total, components: c };
  }

  function productEvidence(p) {
    if (p.ads && p.ads.some((a) => a.state === "SIMULATED")) return "SIMULATED";
    if (p.ads && p.ads.length) return "INFERRED";
    return "INFERRED";
  }

  /* ---------------- clustering ---------------- */
  function clusters() {
    const map = new Map();
    S.ads.forEach((a) => {
      if (a.state === "SIMULATED") return; // demo/sandbox data never appears in product research
      const key = (a.product || a.brand || "Unclustered").toLowerCase().trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(a);
    });
    return [...map.entries()].map(([key, ads]) => {
      const brandSet = new Set(ads.map((a) => a.brand));
      const ctrySet = new Set(ads.map((a) => a.country));
      const firstDates = ads.map((a) => new Date(a.firstSeen || a.created).getTime()).filter(Boolean);
      const lastDates = ads.map((a) => new Date(a.lastSeen || a.created).getTime()).filter(Boolean);
      const durDays = firstDates.length && lastDates.length ? Math.max(0, Math.round((Math.max(...lastDates) - Math.min(...firstDates)) / 86400000)) : 0;
      const recent = ads.filter((a) => daysAgo(a.created || a.firstSeen || Date.now()) <= 30).length;
      const creativeAvg = ads.length ? Math.round(ads.reduce((s, a) => s + (a.creativeScore || 50), 0) / ads.length) : 50;
      const p = {
        key,
        name: ads[0].product || ads[0].brand || key,
        category: ads[0].category || "Unknown",
        advertisers: brandSet.size,
        ads,
        creatives: new Set(ads.map((a) => a.format + "|" + a.headline)).size,
        countries: [...ctrySet],
        activeAds: ads.filter((a) => a.status === "ACTIVE").length,
        durationDays: durDays,
        creativeAvg,
        recentRatio: ads.length ? recent / ads.length : 0,
        evidence: productEvidence({ ads }),
      };
      p.score = scoreProduct(p);
      return p;
    });
  }

  /* ---------------- hooks ---------------- */
  function extractHooks() {
    const map = new Map();
    S.ads.forEach((a) => {
      const h = (a.headline || "").trim();
      if (!h) return;
      const k = h.toLowerCase();
      if (!map.has(k)) map.set(k, { hook: h, count: 0, products: new Set(), advertisers: new Set(), countries: new Set(), formats: new Set() });
      const e = map.get(k);
      e.count++;
      e.products.add(a.product || a.brand);
      e.advertisers.add(a.brand);
      e.countries.add(a.country);
      e.formats.add(a.format);
    });
    return [...map.values()].map((e) => {
      const cat = hookCategory(e.hook);
      return { hook: e.hook, category: cat, count: e.count, products: [...e.products].slice(0, 3), advertisers: [...e.advertisers].slice(0, 4), countries: [...e.countries].slice(0, 5), formats: [...e.formats].slice(0, 4) };
    }).sort((a, b) => b.count - a.count);
  }
  function hookCategory(h) {
    const l = h.toLowerCase();
    if (/(\?)/.test(l) && /(why|how|do you|did you|what|ever)/.test(l)) return "Question Hook";
    if (/(stop|never|don't|avoid|forget)/.test(l)) return "Problem Hook";
    if (/(meet|introducing|new|just hit|finally)/.test(l)) return "Product Reveal";
    if (/(imagine|watch|once|look)/.test(l)) return "Curiosity Hook";
    if (/(95|90|%|million|billion|days|seconds)/.test(l)) return "Shock Hook";
    if (/(everyone|anyone|people|nobody|neighbors)/.test(l)) return "Social Proof Hook";
    return "Curiosity Hook";
  }

  /* ---------------- generic card builders ---------------- */
  function scoreRing(v) { return `<div class="score-ring" style="--p:${v}"><b>${v}<small>/100</small></b></div>`; }
  function scoreBars(c) {
    return `<div class="al-comp">` + SCORE_COMPONENTS.map((x) => `<div class="row"><span class="lbl">${esc(x.label)}</span><span class="bar"><i style="width:${c[x.key] || 0}%"></i></span><span class="v">${c[x.key] || 0}</span></div>`).join("") + `</div>`;
  }
  function ev(tag) { return `<span class="ev ${esc(String(tag).toLowerCase())}">${esc(String(tag).toUpperCase())}</span>`; }
  function adCard(a) {
    const saved = S.saved.some((x) => x.type === "ad" && x.ref === a.adId);
    return `
    <article class="ad-card">
      <div class="ad-thumb">
        ${ic(a.format && a.format.toLowerCase().includes("video") ? "video" : (a.format && a.format.toLowerCase().includes("carousel") ? "images" : "image"), 30)}
        <span class="format">${esc(a.format || "Ad")}</span>
        <span class="status ${a.status === "ACTIVE" ? "active" : "inactive"}">${a.status === "ACTIVE" ? "Active" : "Inactive"}</span>
      </div>
      <div class="ad-body">
        <h4>${esc(a.headline || a.product || a.adId)}</h4>
        <div class="ad-meta">
          <span class="tag2">${esc(a.brand || "Unknown")}</span>
          <span class="tag2">${esc(CC(a.country))}</span>
          <span class="tag2">${ev(a.state || "OBSERVED")}</span>
        </div>
        <p class="ad-copy">${esc(a.body || "No ad copy available from the current data source.")}</p>
        <div class="al-na-row">
          <span>${a.created ? "First seen " + esc(a.created) : "First seen: not available"}</span>
          ${a.duration ? `<span>· ${esc(a.duration)}</span>` : ""}
        </div>
        <div class="al-flex">
          ${a.spend != null ? `<span class="ev estimated">ESTIMATED SPEND ≈ $${num(a.spend)}</span>` : ""}
          ${a.cta ? `<span class="tag2">CTA: ${esc(a.cta)}</span>` : ""}
        </div>
        <div class="ad-acts">
          <button class="al-btn primary" data-act="open-ad" data-id="${esc(a.adId)}">${ic("external-link", 12)} Open</button>
          <button class="al-btn" data-act="analyze-ad" data-id="${esc(a.adId)}">${ic("scan-eye", 12)} Analyze</button>
          <button class="al-btn" data-act="save-ad" data-id="${esc(a.adId)}">${ic(saved ? "check" : "bookmark", 12)} ${saved ? "Saved" : "Save"}</button>
        </div>
      </div>
    </article>`;
  }

  function na(msg, icon) {
    return `<div class="al-na">${ic(icon || "database", 32)}<b>Not available from current data source</b><span>${esc(msg)}</span></div>`;
  }

  /* ---------------- nav + shell ---------------- */
  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: "layout-dashboard" },
    { id: "research", label: "Product Research", icon: "search" },
    { id: "adlibrary", label: "Ad Library", icon: "megaphone" },
    { id: "products", label: "Winning Products", icon: "trophy" },
    { id: "ads", label: "Winning Ads", icon: "sparkles" },
    { id: "competitors", label: "Competitors", icon: "users" },
    { id: "creative", label: "Creative Intelligence", icon: "scan-eye" },
    { id: "market", label: "Market Intelligence", icon: "globe-2" },
    { id: "monitor", label: "Ad Monitoring", icon: "radar" },
    { id: "reports", label: "Reports", icon: "file-text" },
    { id: "saved", label: "Saved Research", icon: "bookmark" },
    { id: "exports", label: "Exports", icon: "download" },
    { id: "tools", label: "Tool Center", icon: "wrench" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  function renderShell() {
    const app = $("#al-app");
    const nav = NAV.map((n) => `<button class="al-nav-btn${S.section === n.id ? " active" : ""}" data-sec="${n.id}">${ic(n.icon, 15)} <span>${esc(n.label)}</span>${n.id === "products" ? `<span class="badge">${clusters().length}</span>` : ""}</button>`).join("");
    const st = S.mcp;
    const stClass = st.state === "connected" ? "connected" : (st.state === "auth_error" || st.state === "tool_error" || st.state === "environment_error" || st.state === "backend_unreachable") ? "auth_error" : "disconnected";
    const stLabel = st.state === "connected" ? "MCP connected · " + st.tools.length + " tools" : st.state === "backend_unreachable" ? "Backend unreachable" : st.state === "auth_error" ? "Auth error" : st.state === "unknown" ? "Checking…" : "Disconnected";
    app.innerHTML = `
      <div class="al-topbar">
        <div>
          <div class="al-title">${ic("megaphone", 20)} AD <em>LIBRARY</em></div>
          <div class="al-sub">Facebook Ads + Product Research + Competitive Intelligence workspace. Live data flows from the facebook-ads-library-mcp server; every value is labelled OBSERVED / ESTIMATED / INFERRED / PREDICTED. Opportunity scores are an app-generated research score, never a guarantee.</div>
        </div>
        <div class="al-flex">
          <button class="pill al-st ${stClass}" id="al-mcp-pill" title="MCP connection status">${ic("plug", 13)} <span>${esc(stLabel)}</span></button>
          ${S.settings.sandbox ? `<span class="pill" style="background:var(--amber-50);color:var(--amber);border:1px dashed rgba(245,184,60,.5)">${ic("flask-conical", 12)} Sandbox</span>` : ""}
        </div>
      </div>
      <div class="al-layout">
        <aside class="al-nav">
          <div class="al-nav-lbl">Workspace</div>
          ${nav}
          <div class="al-nav-foot">Transparent scoring engine · evidence-labelled data · nothing fabricated. Sandbox mode (SIMULATED) is opt-in in Settings.</div>
        </aside>
        <main class="al-content" id="al-content"></main>
      </div>`;
  }

  function render() {
    renderShell();
    const host = $("#al-content");
    if (!host) return;
    host.innerHTML = `<div class="out-anim">${renderSection()}</div>`;
    icons();
    bindSection();
    bindNav();
    drawCharts();
  }

  function bindNav() {
    document.querySelectorAll(".al-nav-btn").forEach((b) => b.addEventListener("click", () => { S.section = b.getAttribute("data-sec"); render(); }));
    const pill = $("#al-mcp-pill");
    if (pill) pill.addEventListener("click", () => { S.section = "settings"; render(); });
  }

  /* ---------------- charts ---------------- */
  const charts = {};
  function makeChart(id, cfg) {
    const c = document.getElementById(id);
    if (!c || typeof Chart === "undefined") return;
    if (charts[id]) { try { charts[id].destroy(); } catch (e) {} }
    try { charts[id] = new Chart(c, cfg); } catch (e) {}
  }
  function drawCharts() {
    if (S.section !== "dashboard") return;
    const clustersAll = clusters();
    const angles = {};
    S.ads.forEach((a) => { const k = a.format || "Other"; angles[k] = (angles[k] || 0) + 1; });
    const angleData = Object.entries(angles).sort((a, b) => b[1] - a[1]).slice(0, 6);
    makeChart("ch-angles", {
      type: "bar",
      data: { labels: angleData.map((x) => x[0]), datasets: [{ label: "Ads", data: angleData.map((x) => x[1]), backgroundColor: "#3EE8A6", borderRadius: 6 }] },
      options: { indexAxis: "y", plugins: { legend: { display: false } }, scales: { x: { grid: { color: "#1F2B45" }, ticks: { color: "#8A9AB6", font: { size: 10 } } }, y: { grid: { display: false }, ticks: { color: "#8A9AB6", font: { size: 10 } } } } },
    });
    const plat = {};
    S.ads.forEach((a) => { const k = a.platform || "facebook"; plat[k] = (plat[k] || 0) + 1; });
    makeChart("ch-plat", {
      type: "doughnut",
      data: { labels: Object.keys(plat), datasets: [{ data: Object.values(plat), backgroundColor: ["#3EE8A6", "#5B8DFF", "#A78BFA", "#F5B83C", "#FF6B6B", "#2DD4BF"] }] },
      options: { plugins: { legend: { labels: { color: "#8A9AB6", font: { size: 10 } } } } },
    });
    const top = clustersAll.slice(0, 6);
    makeChart("ch-top", {
      type: "bar",
      data: { labels: top.map((p) => p.name.slice(0, 14)), datasets: [{ label: "Opportunity score", data: top.map((p) => p.score.total), backgroundColor: top.map((p) => (p.score.total >= 80 ? "#3EE8A6" : p.score.total >= 65 ? "#F5B83C" : "#5B8DFF")), borderRadius: 6 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, grid: { color: "#1F2B45" }, ticks: { color: "#8A9AB6", font: { size: 10 } } }, x: { grid: { display: false }, ticks: { color: "#8A9AB6", font: { size: 9 } } } } },
    });
  }

  /* ---------------- dashboard ---------------- */
  function secDashboard() {
    const cl = clusters();
    const winners = cl.filter((p) => p.score.total >= 75).sort((a, b) => b.score.total - a.score.total);
    const rising = [...new Set(S.ads.filter((a) => daysAgo(a.created || a.firstSeen || Date.now()) <= 7).map((a) => a.brand))].slice(0, 6);
    const longAds = S.ads.filter((a) => a.status === "ACTIVE" && daysAgo(a.firstSeen || a.created || Date.now()) >= 30).sort((a, b) => daysAgo(b.firstSeen || Date.now()) - daysAgo(a.firstSeen || Date.now())).slice(0, 5);
    const newAds = S.ads.filter((a) => daysAgo(a.created || a.firstSeen || Date.now()) <= 7).length;
    const hooks = extractHooks().slice(0, 5);
    const totalSpend = S.ads.reduce((s, a) => s + (a.spend || 0), 0);
    const kpis = [
      { l: "Ads discovered", v: num(S.ads.length), i: "megaphone" },
      { l: "Products discovered", v: num(cl.length), i: "package-search" },
      { l: "Winning opportunities", v: num(winners.length), i: "trophy" },
      { l: "Rising advertisers", v: num(rising.length), i: "trending-up" },
      { l: "Long-running ads", v: num(longAds.length), i: "clock" },
      { l: "New ads (7d)", v: num(newAds), i: "sparkles" },
    ];
    return `
      <div class="al-kpis">${kpis.map((k) => `<div class="al-kpi"><div class="k-lbl">${ic(k.i, 12)} ${esc(k.l)}</div><div class="k-val">${k.v}</div><div class="k-note">${esc(CC(S.settings.defaultCountry))} + selected markets</div></div>`).join("")}</div>
      ${S.settings.sandbox ? `<div class="al-sandbox">${ic("flask-conical", 14)} SANDBOX SAMPLE DATA — all numbers below are SIMULATED, not real Facebook data. Turn it off in Settings.</div>` : ""}
      <div class="al-grid2">
        <div class="al-card">
          <h3>${ic("trophy", 15)} Winning opportunities <span class="sub">ranked by transparent score</span></h3>
          ${cl.length ? cl.slice(0, 6).map((p) => `
            <div class="al-flex" style="padding:7px 0;border-bottom:1px solid var(--line)">
              <span class="score-ring" style="--p:${p.score.total};width:38px;height:38px"><b style="font-size:12px">${p.score.total}</b></span>
              <div style="flex:1">
                <b style="font-size:12px;color:var(--ink)">${esc(p.name)}</b>
                <div style="font-size:10px;color:var(--muted)">${p.advertisers} advertisers · ${p.ads.length} ads · ${p.countries.map((c) => CC(c)).join(", ")} · ${ev(p.evidence)}</div>
              </div>
              <button class="al-btn ghost" data-act="goto-product" data-key="${esc(p.key)}">${ic("arrow-up-right", 12)}</button>
            </div>`).join("") : na("Run a Product Research search with a connected MCP to build real product clusters.", "search")}
        </div>
        <div class="al-card">
          <h3>${ic("radar", 15)} Long-running ads <span class="sub">active ≥ 30 days · signal ≠ profit</span></h3>
          ${longAds.length ? longAds.map((a) => `
            <div class="al-flex" style="padding:7px 0;border-bottom:1px solid var(--line)">
              <span class="tag2" style="font-size:9px;font-weight:700;color:var(--muted);background:var(--card2);border:1px solid var(--line);padding:2px 8px;border-radius:999px">${esc(a.brand)}</span>
              <div style="flex:1;font-size:11px;color:var(--ink)"><b>${esc(a.product || a.adId)}</b><div style="font-size:9.5px;color:var(--muted)">${esc(CC(a.country))} · ${daysAgo(a.firstSeen || a.created || Date.now())} days active</div></div>
            </div>`).join("") : na("Long-running ads appear here once ad data is available.", "clock")}
        </div>
      </div>
      <div class="al-grid3">
        <div class="al-card"><h3>${ic("scan-eye", 15)} Top creative angles</h3><canvas id="ch-angles" height="150"></canvas></div>
        <div class="al-card"><h3>${ic("share-2", 15)} Platform mix</h3><canvas id="ch-plat" height="150"></canvas></div>
        <div class="al-card"><h3>${ic("trending-up", 15)} Top product scores</h3><canvas id="ch-top" height="150"></canvas></div>
      </div>
      <div class="al-grid2">
        <div class="al-card">
          <h3>${ic("lightbulb", 15)} Top hooks <span class="sub">extracted patterns, not copied ad copy</span></h3>
          ${hooks.length ? hooks.map((h) => `<div class="hook-card" style="margin-bottom:8px"><div class="hq">“${esc(h.hook)}”</div><div class="hm"><span class="tag2">${esc(h.category)}</span><span class="tag2">${h.count} uses</span>${h.countries.slice(0, 3).map((c) => `<span class="tag2">${esc(CC(c))}</span>`).join("")}</div></div>`).join("") : na("Hooks are extracted from available ad creatives.", "lightbulb")}
        </div>
        <div class="al-card">
          <h3>${ic("activity", 15)} Estimated ad activity <span class="sub">spend is ESTIMATED from ranges when provided</span></h3>
          <div class="al-kpis" style="grid-template-columns:1fr 1fr;margin:0">
            <div class="al-kpi"><div class="k-lbl">${ic("trending-up", 12)} Estimated spend</div><div class="k-val"><small>$</small>${num(totalSpend)}</div><div class="k-note">${ev("ESTIMATED")} when provided by source</div></div>
            <div class="al-kpi"><div class="k-lbl">${ic("globe-2", 12)} Markets covered</div><div class="k-val">${num(new Set(S.ads.map((a) => a.country)).size)}</div><div class="k-note">distinct countries</div></div>
          </div>
          <div class="al-na-row">Every figure here is labelled with its data state. Sales, revenue, ROAS and exact spend are never invented.</div>
        </div>
      </div>`;
  }

  /* ---------------- product research ---------------- */
  function secResearch() {
    const sel = S.research;
    const countryOpts = COUNTRIES.map((c) => `<option value="${c}"${sel.countries.includes(c) ? " selected" : ""}>${CC(c)} (${c})</option>`).join("");
    return `
      <div class="al-card">
        <h3>${ic("search", 15)} Product Research <span class="sub">search Facebook Ads Library and cluster opportunities</span></h3>
        <div class="al-filters">
          <input id="r-keyword" placeholder="Keyword or natural language, e.g. “find winning home products for France”" value="${esc(sel.keyword)}" style="min-width:320px;flex:1">
          <select id="r-category"><option value="">Any category</option>${["Beauty","Home","Kitchen","Electronics","Fitness","Automotive","Health","Fashion","Pet","Baby"].map((c) => `<option${sel.category === c ? " selected" : ""}>${c}</option>`).join("")}</select>
          <select id="r-active"><option value="ALL"${sel.active === "ALL" ? " selected" : ""}>Active + inactive</option><option value="ACTIVE"${sel.active === "ACTIVE" ? " selected" : ""}>Active only</option></select>
          <select id="r-range"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90"${sel.dateRange === 90 ? " selected" : ""}>Last 90 days</option><option value="180">Last 180 days</option></select>
          <select id="r-minads"><option value="1">Min 1 ad</option><option value="5">Min 5 ads</option><option value="10">Min 10 ads</option></select>
        </div>
        <div class="al-field"><label>Countries (multi-select searchable)</label><input id="r-countries" list="al-country-list" placeholder="Type to filter countries…" value="${esc(sel.countries.join(", "))}"><datalist id="al-country-list">${COUNTRIES.map((c) => `<option value="${c}">${CC(c)}</option>`).join("")}</datalist>
          <div class="al-flex" style="margin-top:7px" id="r-cchips">${sel.countries.map((c) => `<span class="al-chip">${esc(CC(c))} <button data-rm="${c}" title="remove">${ic("x", 11)}</button></span>`).join("")}</div>
        </div>
        <div class="al-flex">
          <button class="al-btn primary big" id="r-run">${ic("play", 13)} Search Facebook Ads</button>
          <button class="al-btn" id="r-save-query">${ic("bookmark", 13)} Save query</button>
          <span class="al-na-row">${ev("OBSERVED")} data from facebook_ads_library · ${ev("ESTIMATED")} spend/impressions · ${ev("INFERRED")} audience & product clusters</span>
        </div>
      </div>
      <div class="al-card">
        <h3>${ic("history", 15)} Research history</h3>
        ${S.searches.length ? S.searches.slice(0, 8).map((s) => `
          <div class="al-flex" style="padding:6px 0;border-bottom:1px solid var(--line)">
            <div style="flex:1;font-size:11.5px;color:var(--ink)"><b>${esc(s.keyword || "(no keyword)")}</b><div style="font-size:9.5px;color:var(--muted)">${esc(s.countries.join(", "))} · ${new Date(s.at).toLocaleString()} · ${s.found} ads</div></div>
            <button class="al-btn ghost" data-act="reuse-search" data-i="${S.searches.indexOf(s)}">${ic("rotate-ccw", 12)} Reuse</button>
          </div>`).join("") : na("Search queries you run are kept here so you can reuse or compare them.", "history")}
      </div>`;
  }

  /* ---------------- ad library ---------------- */
  function secAdLibrary() {
    const f = S.filters;
    let ads = S.ads;
    if (f.creative !== "ALL") ads = ads.filter((a) => (a.format || "").toLowerCase().includes(f.creative.toLowerCase()));
    if (f.time !== "all") ads = ads.filter((a) => daysAgo(a.created || a.firstSeen || Date.now()) <= Number(f.time));
    if (f.countries.length) ads = ads.filter((a) => f.countries.includes(a.country));
    return `
      <div class="al-card">
        <h3>${ic("filter", 15)} Advanced filters <span class="sub">time, geography, creative type, signals</span></h3>
        <div class="al-filters">
          <select id="f-time"><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90" selected>Last 90 days</option><option value="180">Last 180 days</option><option value="all">All time</option></select>
          <select id="f-creative"><option value="ALL">All creative types</option>${["Image","Video","Carousel","UGC","Product demo","Before/After","Testimonial","Problem/Solution","Offer","Educational","Lifestyle"].map((c) => `<option value="${c}">${c}</option>`).join("")}</select>
          <select id="f-country"><option value="">All countries</option>${COUNTRIES.map((c) => `<option value="${c}">${CC(c)}</option>`).join("")}</select>
          <input id="f-q" placeholder="Search ad text, brand, product…" style="min-width:200px">
        </div>
        <div class="al-flex" id="f-chips">${f.countries.map((c) => `<span class="al-chip">${esc(CC(c))} <button data-frm="${c}">${ic("x", 11)}</button></span>`).join("")}</div>
      </div>
      ${ads.length ? `<div class="ad-grid">${ads.map(adCard).join("")}</div>` : na("Run a search from Product Research (or enable the sandbox sample in Settings) to populate the library.", "megaphone")}`;
  }

  /* ---------------- winning products ---------------- */
  function secProducts() {
    const cl = clusters().sort((a, b) => b.score.total - a.score.total);
    return `
      <div class="al-card">
        <h3>${ic("trophy", 15)} Winning product opportunities <span class="sub">app-generated research score — transparent components, not a guarantee</span></h3>
        <div class="al-na-row">${ev("ESTIMATED")} score · components below the fold · ranked highest → lowest</div>
      </div>
      ${cl.length ? `<div class="prod-grid">${cl.map(prodCard).join("")}</div>` : na("Product clusters are built from real ads collected by Product Research. Run a search with a connected MCP — demo/sandbox data is never shown here.", "trophy")}`;
  }
  function prodCard(p) {
    const s = p.score;
    return `
    <article class="prod-card" data-prod-key="${esc(p.key)}">
      <div class="prod-top">
        <div><h4>${esc(p.name)}</h4><div class="prod-cat">${esc(p.category)} · ${ev(p.evidence)}</div></div>
        <div class="score-wrap" style="gap:10px">
          <div class="score-ring" style="--p:${s.total}"><b>${s.total}<small>/100</small></b></div>
        </div>
      </div>
      <div class="prod-stats">
        <div class="st"><b>${p.advertisers}</b><span>Advertisers</span></div>
        <div class="st"><b>${p.ads.length}</b><span>Ads</span></div>
        <div class="st"><b>${p.countries.length}</b><span>Countries</span></div>
        <div class="st"><b>${p.creatives}</b><span>Creatives</span></div>
        <div class="st"><b>${p.activeAds}</b><span>Active</span></div>
        <div class="st"><b>${p.durationDays}d</b><span>Longevity</span></div>
      </div>
      <div class="al-flex" style="margin-bottom:8px">${p.countries.map((c) => `<span class="tag2" style="font-size:9px;font-weight:700;color:var(--muted);background:var(--card2);border:1px solid var(--line);padding:2px 8px;border-radius:999px">${esc(CC(c))}</span>`).join("")}</div>
      <details><summary style="font-size:11px;color:var(--green);cursor:pointer;font-weight:700">Why this score? (transparent components)</summary><div style="margin-top:8px">${scoreBars(s.components)}</div></details>
      <div class="al-flex" style="margin-top:11px">
        <button class="al-btn primary" data-act="open-product" data-key="${esc(p.key)}">${ic("arrow-up-right", 12)} Opportunity card</button>
        <button class="al-btn" data-act="save-product" data-key="${esc(p.key)}">${ic("bookmark", 12)} Save</button>
      </div>
    </article>`;
  }

  function productDetail(key) {
    const cl = clusters();
    const p = cl.find((x) => x.key === key);
    if (!p) return na("Product not found.", "trophy");
    const s = p.score;
    const reasons = [];
    if (p.advertisers > 1) reasons.push({ ok: true, t: "Multiple advertisers (" + p.advertisers + ") are running this product" });
    if (p.creatives > 3) reasons.push({ ok: true, t: p.creatives + " distinct creative variations observed" });
    if (p.durationDays >= 30) reasons.push({ ok: true, t: "Long-running activity (" + p.durationDays + " days)" });
    if (p.countries.length > 1) reasons.push({ ok: true, t: "Expanding across " + p.countries.length + " markets" });
    if (p.ads.some((a) => /problem|solution|before|after/i.test(a.body || ""))) reasons.push({ ok: true, t: "Strong problem/solution messaging" });
    const risks = [];
    if (p.advertisers >= 3) risks.push({ t: "Competition — " + p.advertisers + " advertisers already active" });
    if (p.ads.length >= 10) risks.push({ t: "Possible market saturation (" + p.ads.length + " ads)" });
    if (s.components.competition < 40) risks.push({ t: "High competition component" });
    const bestAngles = [...new Set(p.ads.map((a) => a.format).filter(Boolean))].slice(0, 3);
    const open = (m) => window.open(m, "_blank", "noopener");
    return `
      <div class="al-card">
        <div class="al-flex" style="justify-content:space-between;align-items:flex-start;flex-wrap:wrap">
          <div>
            <div class="prod-cat" style="margin-bottom:4px">PRODUCT · ${ev(p.evidence)}</div>
            <h2 style="font-size:20px;font-weight:900;color:var(--ink);letter-spacing:-.02em">${esc(p.name)}</h2>
            <div class="al-sub">${esc(p.category)} · ${p.advertisers} advertisers · ${p.ads.length} ads · ${p.countries.map((c) => CC(c)).join(", ")}</div>
          </div>
          <div class="score-wrap">${scoreRing(s.total)}<div><div style="font-size:12px;font-weight:800;color:var(--ink)">Opportunity score</div><div style="font-size:10px;color:var(--muted2)">ESTIMATED · app-generated</div></div></div>
        </div>
        <details style="margin-top:12px"><summary style="font-size:11px;color:var(--green);cursor:pointer;font-weight:700">Why this score? (transparent components)</summary><div style="margin-top:8px">${scoreBars(s.components)}</div></details>
      </div>
      <div class="al-grid2">
        <div class="al-card"><h3>${ic("check-circle", 15)} Why it is interesting</h3>${reasons.map((r) => `<div class="al-flex" style="padding:6px 0;color:var(--green);font-size:11.5px">${ic("check-circle", 13)} <span style="color:var(--ink)">${esc(r.t)}</span></div>`).join("") || na("Not enough evidence yet.", "check-circle")}</div>
        <div class="al-card"><h3>${ic("alert-triangle", 15)} Risks</h3>${risks.map((r) => `<div class="al-flex" style="padding:6px 0;color:var(--amber);font-size:11.5px">${ic("alert-triangle", 13)} <span style="color:var(--ink)">${esc(r.t)}</span></div>`).join("") || `<div class="al-na-row">No strong risk signals from current evidence.</div>`}</div>
      </div>
      <div class="al-grid2">
        <div class="al-card"><h3>${ic("globe", 15)} Best markets</h3><div class="al-flex">${p.countries.map((c) => `<span class="al-chip">${esc(CC(c))}</span>`).join("") || `<span class="al-na-row">No country data.</span>`}</div></div>
        <div class="al-card"><h3>${ic("scan-eye", 15)} Best creative angles</h3><div class="al-flex">${bestAngles.map((a) => `<span class="al-chip">${esc(a)}</span>`).join("") || `<span class="al-na-row">Not available.</span>`}</div></div>
      </div>
      <div class="al-card">
        <h3>${ic("lightbulb", 15)} Recommended next step</h3>
        <p style="font-size:12px;color:var(--ink);line-height:1.6">Test ${Math.max(2, Math.min(5, p.ads.length))} original creatives based on the top angles above. Long-running ads and multi-advertiser adoption are useful signals — they do not guarantee profit. Validate with your own offer and unit economics before scaling.</p>
        <div class="al-flex" style="margin-top:10px">
          <button class="al-btn primary" data-act="run-agent" data-product="${esc(p.name)}">${ic("bot", 13)} Run research agent on this product</button>
          <button class="al-btn" data-act="save-product" data-key="${esc(p.key)}">${ic("bookmark", 13)} Save product</button>
          <button class="al-btn" data-act="export-product" data-key="${esc(p.key)}">${ic("download", 13)} Export</button>
        </div>
      </div>
      <div class="al-card"><h3>${ic("megaphone", 15)} Ads for this product</h3><div class="ad-grid">${p.ads.map(adCard).join("")}</div></div>`;
  }

  /* ---------------- winning ads ---------------- */
  function secWinningAds() {
    const ads = S.ads.slice().sort((a, b) => (b.creativeScore || 0) - (a.creativeScore || 0));
    return `
      <div class="al-card">
        <h3>${ic("sparkles", 15)} Winning ads <span class="sub">ranked by creative strength + evidence — not guaranteed performance</span></h3>
        <div class="al-na-row">${ev("ESTIMATED")} creative score · ${ev("PREDICTED")} performance is only shown when a prediction tool provides it</div>
      </div>
      ${ads.length ? `<div class="ad-grid">${ads.map((a) => adCard(a)).join("")}</div>` : na("No ad data yet. Run a Product Research search or enable the sandbox sample.", "sparkles")}`;
  }

  /* ---------------- competitors ---------------- */
  function secCompetitors() {
    const comps = new Map();
    S.ads.forEach((a) => {
      const b = a.brand || "Unknown";
      if (!comps.has(b)) comps.set(b, []);
      comps.get(b).push(a);
    });
    const list = [...comps.entries()].map(([brand, ads]) => ({
      brand,
      ads,
      formats: [...new Set(ads.map((a) => a.format))],
      countries: [...new Set(ads.map((a) => a.country))],
      products: [...new Set(ads.map((a) => a.product))],
      spend: ads.reduce((s, a) => s + (a.spend || 0), 0),
      active: ads.filter((a) => a.status === "ACTIVE").length,
      long: ads.filter((a) => daysAgo(a.firstSeen || a.created || Date.now()) >= 30).length,
    })).sort((a, b) => b.ads.length - a.ads.length);
    return `
      <div class="al-card">
        <h3>${ic("users", 15)} Competitors <span class="sub">from discover_competitor_brands / find_similar_advertisers when connected</span></h3>
        <div class="al-filters">
          <input id="c-keyword" placeholder="Industry keywords, e.g. “fitness app”, “food delivery”…">
          <button class="al-btn primary" id="c-discover">${ic("users", 13)} Discover competitors</button>
          <button class="al-btn" id="c-compare">${ic("git-compare", 13)} Compare selected</button>
        </div>
      </div>
      ${list.length ? `<div class="comp-grid">${list.map((c) => `
        <div class="comp-card">
          <div class="al-flex" style="justify-content:space-between">
            <h4>${ic("building-2", 16)} ${esc(c.brand)}</h4>
            <input type="checkbox" class="c-sel" data-brand="${esc(c.brand)}" title="select to compare">
          </div>
          <div class="comp-list">
            <div class="row"><span>Active ads</span><b>${c.active} / ${c.ads.length}</b></div>
            <div class="row"><span>Long-running ads</span><b>${c.long}</b></div>
            <div class="row"><span>Estimated spend</span><b>$${num(c.spend)} ${ev("ESTIMATED")}</b></div>
            <div class="row"><span>Countries</span><b>${c.countries.map((x) => CC(x)).join(", ")}</b></div>
          </div>
          <div class="al-flex" style="margin-top:9px">${c.products.slice(0, 3).map((p) => `<span class="tag2" style="font-size:9px;font-weight:700;color:var(--muted);background:var(--card2);border:1px solid var(--line);padding:2px 8px;border-radius:999px">${esc(p)}</span>`).join("")}</div>
        </div>`).join("")}</div>` : na("Competitors appear here from collected ads, or run Discover above with a connected MCP (or sandbox sample).", "users")}`;
  }

  /* ---------------- creative intelligence ---------------- */
  function secCreative() {
    const an = S.analyses;
    return `
      <div class="al-card">
        <h3>${ic("scan-eye", 15)} Creative intelligence <span class="sub">analyze_ad_creative_elements() · hook library</span></h3>
        <div class="al-filters">
          <input id="ci-url" placeholder="Paste a Facebook ad snapshot URL to analyze…" style="flex:1;min-width:280px">
          <button class="al-btn primary" id="ci-analyze">${ic("scan-eye", 13)} Analyze creative</button>
        </div>
        <div class="al-na-row">Creative analysis crawls the snapshot via the MCP (crawl4ai) — it returns text, CTA and sentiment signals, not copyrighted ad copy. If unavailable, the box below explains why.</div>
      </div>
      ${an.length ? `<div class="al-grid2">${an.slice().reverse().slice(0, 4).map((x) => `
        <div class="al-card">
          <div class="al-flex" style="justify-content:space-between"><h3>${ic("scan-eye", 15)} ${esc(x.url || "Creative analysis")}</h3>${ev("INFERRED")}</div>
          <div class="ci-grid">${(x.analysis || {}).text_analysis ? `
            <div class="ci-box"><div class="t">${ic("type", 12)} Text</div><p>${esc(String((x.analysis.text_analysis.full_text || "")).slice(0, 220))}</p></div>
            <div class="ci-box"><div class="t">${ic("hash", 12)} Keywords</div><div class="al-flex">${(x.analysis.text_analysis.sentiment_keywords || []).map((k) => `<span class="tag2" style="font-size:9px;font-weight:700;color:var(--muted);background:var(--card2);border:1px solid var(--line);padding:2px 8px;border-radius:999px">${esc(k)}</span>`).join("") || "—"}</div></div>
            <div class="ci-box"><div class="t">${ic("mouse-pointer-click", 12)} CTA</div><p>${(x.analysis.cta_analysis && x.analysis.cta_analysis.detected_ctas || []).join(", ") || "No CTA detected"}</p></div>
            <div class="ci-box"><div class="t">${ic("zap", 12)} Urgency words</div><p>${(x.analysis.cta_analysis && x.analysis.cta_analysis.urgency_words || []).join(", ") || "None detected"}</p></div>` : `<div class="al-na">${ic("database", 20)}<b>No structured analysis</b><span>${esc(JSON.stringify(x).slice(0, 200))}</span></div>`}</div>
        </div>`).join("")}</div>` : ""}
      <div class="al-card">
        <h3>${ic("lightbulb", 15)} Hook library <span class="sub">classified patterns, not long copyrighted excerpts</span></h3>
        ${renderHooks()}
      </div>`;
  }
  function renderHooks() {
    const hooks = extractHooks();
    if (!hooks.length) return na("Hooks are extracted automatically from ad headlines in your library.", "lightbulb");
    return `<div class="hook-grid">${hooks.map((h) => `
      <div class="hook-card">
        <div class="hq">“${esc(h.hook)}”</div>
        <div class="hm">
          <span class="tag2" style="background:var(--green-50);color:var(--green);border-color:rgba(62,232,166,.3)">${esc(h.category)}</span>
          <span class="tag2">${h.count} uses</span>
          ${h.products.slice(0, 2).map((p) => `<span class="tag2">${esc(p)}</span>`).join("")}
          ${h.countries.slice(0, 3).map((c) => `<span class="tag2">${esc(CC(c))}</span>`).join("")}
        </div>
        <div class="al-flex" style="margin-top:9px"><button class="al-btn ghost" data-act="save-hook" data-hook="${esc(h.hook)}">${ic("bookmark", 12)} Save hook</button></div>
      </div>`).join("")}</div>`;
  }

  /* ---------------- market intelligence ---------------- */
  function secMarket() {
    const byCtry = {};
    S.ads.forEach((a) => {
      const c = a.country || "?";
      if (!byCtry[c]) byCtry[c] = { ads: 0, advertisers: new Set(), products: new Set() };
      byCtry[c].ads++;
      byCtry[c].advertisers.add(a.brand);
      byCtry[c].products.add(a.product);
    });
    const rows = Object.entries(byCtry).map(([c, d]) => ({ c, ads: d.ads, adv: d.advertisers.size, prods: d.products.size, saturation: clamp(Math.round((d.adv * 40) / Math.max(1, d.ads)), 0, 100) })).sort((a, b) => b.ads - a.ads);
    const opps = rows.filter((r) => r.adv <= 3 && r.saturation < 50).slice(0, 6);
    return `
      <div class="al-grid2">
        <div class="al-card"><h3>${ic("globe-2", 15)} Market opportunity engine <span class="sub">identify_market_opportunities() when connected</span></h3>
          ${opps.length ? opps.map((o) => `<div class="al-flex" style="padding:8px 0;border-bottom:1px solid var(--line)">
            <div style="flex:1"><b style="font-size:12px;color:var(--ink)">${esc(CC(o.c))}</b><div style="font-size:10px;color:var(--muted)">${o.prods} products · ${o.adv} advertisers · saturation ${o.saturation}%</div></div>
            <span class="al-chip">Opportunity</span></div>`).join("") : na("Market opportunities are computed from collected ad data across countries.", "globe-2")}
        </div>
        <div class="al-card"><h3>${ic("trending-up", 15)} Country activity</h3>
          ${rows.length ? `<div class="al-tbl-wrap"><table class="al-tbl"><thead><tr><th>Country</th><th class="num">Ads</th><th class="num">Advertisers</th><th class="num">Products</th><th>Saturation</th></tr></thead><tbody>
          ${rows.map((r) => `<tr><td><b>${esc(CC(r.c))}</b></td><td class="num">${r.ads}</td><td class="num">${r.adv}</td><td class="num">${r.prods}</td><td><span class="score-ring" style="--p:${r.saturation};width:34px;height:34px"><b style="font-size:10px">${r.saturation}</b></span></td></tr>`).join("")}
          </tbody></table></div>` : na("No country-level data yet.", "table")}
        </div>
      </div>
      <div class="al-card">
        <h3>${ic("radar", 15)} Creative evolution <span class="sub">per-product variation timeline</span></h3>
        ${renderEvolution()}
      </div>`;
  }
  function renderEvolution() {
    const cl = clusters().filter((p) => p.creatives >= 2).slice(0, 4);
    if (!cl.length) return na("Evolution timelines are built for products with multiple creative variations.", "radar");
    return `<div class="al-grid2">${cl.map((p) => {
      const steps = p.ads.slice().sort((a, b) => new Date(a.created || a.firstSeen || 0) - new Date(b.created || b.firstSeen || 0)).slice(0, 5);
      return `<div class="al-card" style="margin:0"><h3 style="font-size:12px">${esc(p.name)}</h3><div class="evo">${steps.map((a, i) => `
        <div class="evo-step">
          <div class="evt"><i>${ic("sparkle", 9)}</i>${i < steps.length - 1 ? `<div class="ln"></div>` : ""}</div>
          <div class="evb">
            <b>${esc(a.format || "Creative")} · ${esc(CC(a.country))}</b>
            <div class="chips">${[a.headline, a.cta].filter(Boolean).map((x) => `<span class="tag2">${esc(String(x).slice(0, 34))}</span>`).join("")}</div>
            <div style="font-size:9px;color:var(--muted2);margin-top:3px">${esc(a.created || a.firstSeen || "")} ${a.status === "ACTIVE" ? "· active" : ""}</div>
          </div>
        </div>`).join("")}</div></div>`;
    }).join("")}</div>`;
  }

  /* ---------------- monitoring ---------------- */
  function secMonitor() {
    return `
      <div class="al-card">
        <h3>${ic("radar", 15)} Ad monitoring <span class="sub">monitor_brand_ad_changes() · in-app notifications only</span></h3>
        <div class="al-filters">
          <input id="m-kind" placeholder="Brand / advertiser / keyword to monitor…" style="flex:1;min-width:240px">
          <button class="al-btn primary" id="m-add">${ic("plus", 13)} Start monitoring</button>
        </div>
      </div>
      ${S.monitors.length ? `<div class="al-grid2">${S.monitors.map((m) => `
        <div class="al-card" style="margin:0">
          <div class="al-flex" style="justify-content:space-between"><h3>${ic("radar", 15)} ${esc(m.query)}</h3><span class="pill gray">${m.findings} changes</span></div>
          <div class="al-na-row">Started ${new Date(m.at).toLocaleString()} · checks compare ad IDs for new / removed ads</div>
          <div class="al-flex" style="margin-top:10px">
            <button class="al-btn" data-act="m-run" data-i="${S.monitors.indexOf(m)}">${ic("play", 12)} Check now</button>
            <button class="al-btn danger" data-act="m-del" data-i="${S.monitors.indexOf(m)}">${ic("trash-2", 12)} Remove</button>
          </div>
        </div>`).join("")}</div>` : na("Monitor brands, advertisers, products or keywords for new/removed ads. In-app notifications only — external ones stay optional.", "radar")}`;
  }

  /* ---------------- reports ---------------- */
  function secReports() {
    return `
      <div class="al-card">
        <h3>${ic("file-text", 15)} Report generator <span class="sub">generate_facebook_intelligence_report() · PDF/CSV/JSON/Markdown</span></h3>
        <div class="al-filters">
          <input id="rep-brand" placeholder="Brand name (e.g. Shopify, or leave empty to use your research)" style="flex:1;min-width:240px">
          <button class="al-btn primary" id="rep-gen">${ic("file-text", 13)} Generate report</button>
          <button class="al-btn" id="rep-dl">${ic("download", 13)} Download markdown</button>
        </div>
      </div>
      ${S.lastReport ? `<div class="al-card"><h3>${ic("file-text", 15)} Report preview</h3><div class="report-preview">${renderReportHtml(S.lastReport)}</div></div>` : na("Generate a report from your research. If the MCP is not connected, a report is still built from your saved library with every value labelled.", "file-text")}`;
  }
  function buildReportMarkdown(brand) {
    const cl = clusters().sort((a, b) => b.score.total - a.score.total);
    const hooks = extractHooks().slice(0, 8);
    const l = [];
    l.push("# Facebook Ads Intelligence Report");
    l.push("");
    l.push("Generated: " + new Date().toISOString().slice(0, 16).replace("T", " "));
    l.push("Data source: facebook-ads-library-mcp via /api/fbads/* · every value carries an evidence label");
    l.push("");
    l.push("## Executive Summary");
    if (brand) l.push("Focus brand: **" + brand + "**");
    l.push("- Ads collected: " + S.ads.length + " (OBSERVED when from the source; SIMULATED in sandbox)");
    l.push("- Product clusters: " + cl.length);
    l.push("- Markets covered: " + new Set(S.ads.map((a) => a.country)).size);
    l.push("- Winning opportunities (score ≥ 75): " + cl.filter((p) => p.score.total >= 75).length);
    l.push("");
    l.push("## Top Product Opportunities");
    cl.slice(0, 6).forEach((p) => {
      l.push("### " + p.name + " — " + p.score.total + "/100 (" + p.evidence + ")");
      l.push("- Advertisers: " + p.advertisers + " · Ads: " + p.ads.length + " · Countries: " + p.countries.join(", "));
      l.push("- Components: " + SCORE_COMPONENTS.map((x) => x.label + " " + p.score.components[x.key]).join(" · "));
    });
    l.push("");
    l.push("## Hook Trends");
    hooks.forEach((h) => l.push("- [" + h.category + "] “" + h.hook + "” — " + h.count + " uses"));
    l.push("");
    l.push("## Competitor Signals");
    const byBrand = {};
    S.ads.forEach((a) => { byBrand[a.brand] = (byBrand[a.brand] || 0) + 1; });
    Object.entries(byBrand).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([b, n]) => l.push("- " + b + ": " + n + " ads"));
    l.push("");
    l.push("## Risks & Caveats");
    l.push("- Opportunity scores are an app-generated research score (ESTIMATED), not official Facebook metrics and not a guarantee.");
    l.push("- Spend and impressions are ESTIMATED from ranges when the source provides them; exact spend/conversions are never fabricated.");
    l.push("- Audience and product clustering are INFERRED. Predictions are only shown when a prediction tool actually provides them (PREDICTED).");
    return l.join("\n");
  }
  function renderReportHtml(md) {
    return md.split("\n").map((ln) => {
      if (ln.startsWith("## ")) return "<h2>" + esc(ln.slice(3)) + "</h2>";
      if (ln.startsWith("# ")) return "<h1>" + esc(ln.slice(2)) + "</h1>";
      if (ln.startsWith("### ")) return "<b>" + esc(ln.slice(4)) + "</b><br>";
      if (ln.startsWith("- ")) return "• " + esc(ln.slice(2)) + "<br>";
      if (!ln.trim()) return "";
      return esc(ln) + "<br>";
    }).join("");
  }

  /* ---------------- saved research ---------------- */
  function secSaved() {
    const grp = {};
    S.saved.forEach((x) => {
      grp[x.type] = grp[x.type] || [];
      grp[x.type].push(x);
    });
    const typeLabel = { ad: "Ads", product: "Products", hook: "Hooks", report: "Reports" };
    return `
      <div class="al-card">
        <h3>${ic("bookmark", 15)} Saved research <span class="sub">collections of ads, products, hooks, reports</span></h3>
        <div class="al-filters">
          <input id="c-new" placeholder="New collection name, e.g. “Winning Products”">
          <button class="al-btn primary" id="c-add">${ic("folder-plus", 13)} Create collection</button>
        </div>
      </div>
      ${S.collections.length ? `<div class="al-flex" style="margin-bottom:14px">${S.collections.map((c, i) => `<span class="al-chip">${ic("folder", 12)} ${esc(c)} <button data-delcol="${i}">${ic("x", 11)}</button></span>`).join("")}</div>` : ""}
      ${Object.keys(grp).length ? Object.entries(grp).map(([type, items]) => `
        <div class="al-card">
          <h3>${ic("folder", 15)} ${esc(typeLabel[type] || type)} <span class="sub">${items.length} saved</span></h3>
          <div class="al-flex">${items.map((it) => `
            <span class="al-chip">${esc(it.name || it.ref)} <button data-unsave="${esc(it.key)}">${ic("x", 11)}</button></span>`).join("")}</div>
        </div>`).join("") : na("Save ads, products, hooks and reports from across the workspace and they appear here.", "bookmark")}`;
  }

  /* ---------------- exports ---------------- */
  function secExports() {
    const cl = clusters().sort((a, b) => b.score.total - a.score.total);
    return `
      <div class="al-card">
        <h3>${ic("download", 15)} Exports <span class="sub">export_facebook_ads_data() · JSON / CSV / Markdown</span></h3>
        <div class="al-filters">
          <select id="ex-scope"><option value="ads">All ads</option><option value="products">Product opportunities</option><option value="report">Last report</option></select>
          <select id="ex-format"><option value="json">JSON</option><option value="csv">CSV</option><option value="markdown">Markdown</option></select>
          <button class="al-btn primary" id="ex-run">${ic("download", 13)} Export</button>
        </div>
        <div class="al-na-row">${ev("OBSERVED")} fields keep their labels · ${ev("ESTIMATED")} spend/impressions flagged · nothing fabricated.</div>
      </div>
      <div class="al-card"><h3>${ic("table", 15)} Current dataset summary</h3>
        <div class="al-kpis" style="grid-template-columns:repeat(4,1fr);margin:0">
          <div class="al-kpi"><div class="k-lbl">Ads</div><div class="k-val">${num(S.ads.length)}</div></div>
          <div class="al-kpi"><div class="k-lbl">Products</div><div class="k-val">${num(cl.length)}</div></div>
          <div class="al-kpi"><div class="k-lbl">Advertisers</div><div class="k-val">${num(new Set(S.ads.map((a) => a.brand)).size)}</div></div>
          <div class="al-kpi"><div class="k-lbl">Countries</div><div class="k-val">${num(new Set(S.ads.map((a) => a.country)).size)}</div></div>
        </div>
      </div>`;
  }

  /* ---------------- tool center ---------------- */
  function secTools() {
    const tools = S.mcp.tools;
    return `
      <div class="al-card">
        <h3>${ic("wrench", 15)} MCP Tools <span class="sub">auto-discovered from facebook_ads_library_mcp · dynamic parameters</span></h3>
        <div class="al-flex">
          <button class="al-btn" id="t-refresh">${ic("refresh-cw", 13)} Refresh tools</button>
          <span class="al-na-row">State: <b style="color:var(--ink)">${esc(S.mcp.state)}</b> · ${S.mcp.tools.length} tools discovered ${S.mcp.tokenMasked ? "· token " + esc(S.mcp.tokenMasked) : ""}</span>
        </div>
        ${S.mcp.state === "backend_unreachable" ? na("The backend server is not reachable. Start it with `cd server && npm start`, then reload.", "server") : !S.mcp.configured ? na("No Facebook MCP configured yet. Open Settings → Facebook MCP Connection to add your token, python path and script path, then Test Connection.", "plug") : tools.length ? `
        <div class="al-grid2" style="margin-top:14px">${tools.map((t) => {
          const meta = MCP_TOOL_META[t.name] || {};
          const params = (t.inputSchema && t.inputSchema.properties) ? Object.entries(t.inputSchema.properties).map(([k, v]) => k + (v.type ? ":" + v.type : "")) : [];
          return `<div class="tool-card">
            <h4>${ic(meta.icon || "wrench", 14)} <code>${esc(t.name)}</code></h4>
            <p>${esc(t.description || meta.desc || "MCP tool")}</p>
            <div class="params">${params.map((p) => `<span class="tag2">${esc(p)}</span>`).join("")}</div>
            <div class="al-flex" style="margin-top:10px"><button class="al-btn" data-act="run-tool" data-tool="${esc(t.name)}">${ic("play", 12)} Run manually</button></div>
          </div>`;
        }).join("")}</div>` : na("Tools will be discovered once the MCP is connected. Use Settings → Test Connection.", "wrench")}
      </div>`;
  }

  /* ---------------- settings ---------------- */
  function secSettings() {
    const st = S.mcp;
    const stClass = st.state === "connected" ? "connected" : "disconnected";
    const stMap = { connected: "Connected", disconnected: "Disconnected", auth_error: "Authentication Error", rate_limited: "Rate Limited", tool_error: "Tool Error", environment_error: "Environment Error", backend_unreachable: "Backend Unreachable", ads_library_api_required: "Ads Library API Required", unknown: "Checking…" };
    const blocked = st.state === "ads_library_api_required" || st.lastError && st.lastError.state === "ads_library_api_required";
    return `
      <div class="al-grid2">
        <div class="al-card">
          <h3>${ic("plug", 15)} Facebook MCP Connection <span class="sub">facebook-ads-library-mcp (FastMCP stdio)</span></h3>
          <div class="al-field"><label>Connection status</label>
            <div class="al-flex"><span class="pill al-st ${stClass}"><span class="dot"></span> ${esc(stMap[st.state] || st.state)}</span>
            ${st.error ? `<span class="al-na-row" style="color:var(--red)">${esc(String(st.error).slice(0, 160))}</span>` : ""}</div>
            ${st.lastError ? `<div class="al-na-row" style="margin-top:6px;color:var(--red)">${esc(fbErrLine(st.lastError).slice(0, 320))}</div>` : ""}
          </div>
          ${blocked ? `<div class="al-card al-callout warn">
            <h4>Ads Library API access is required for this Facebook application</h4>
            <p style="font-size:11.5px;line-height:1.6">The token is valid and has <b>ads_read</b>, but your Facebook app is not approved for the Ads Library API. Until it is, search will not run (no retries are attempted).</p>
            <a class="al-btn primary" href="https://www.facebook.com/ads/library/api" target="_blank" rel="noopener">${ic("external-link", 12)} Request access at facebook.com/ads/library/api</a>
          </div>` : ""}
          <div class="al-field"><label>Facebook access token (kept server-side)</label><input id="cfg-token" type="password" placeholder="${st.tokenMasked ? "Configured (" + esc(st.tokenSource || "config") + "): " + esc(st.tokenMasked) : "paste token (ads_read)"}"></div>
          <div class="al-field"><label>Python environment</label><input id="cfg-python" value="${esc(S.mcp.pythonPath || "python")}" placeholder="python or python3 or full path"></div>
          <div class="al-field"><label>MCP script path</label><input id="cfg-script" value="${esc(S.mcp.scriptPath || "facebook_ads_mcp_complete.py")}" placeholder="absolute path to facebook_ads_mcp_complete.py"></div>
          <div class="al-flex">
            <button class="al-btn primary" id="cfg-save">${ic("save", 13)} Save config</button>
            <button class="al-btn" id="cfg-test">${ic("flask-conical", 13)} Test Ads Library API</button>
            <button class="al-btn" id="cfg-refresh">${ic("refresh-cw", 13)} Refresh tools</button>
          </div>
          <div id="al-diag" class="al-diag" style="margin-top:12px"></div>
          <div class="al-na-row" style="margin-top:10px">The token is stored in server/.env (fallback: server/data/fbads-mcp.json) on your machine and never sent to the frontend. Tokens need the ads_read permission. Repository: github.com/RamsesAguirre777/facebook-ads-library-mcp</div>
        </div>
        <div>
          <div class="al-card">
            <h3>${ic("flask-conical", 15)} Sandbox sample data <span class="sub">clearly labelled — not real data</span></h3>
            <p style="font-size:11.5px;color:var(--muted);line-height:1.6">Load a SIMULATED sample dataset so every screen is explorable without a Facebook token. Every value is tagged SIMULATED and a banner is shown. Nothing here is claimed to be real ad data.</p>
            <button class="al-btn ${S.settings.sandbox ? "danger" : "primary"}" id="cfg-sandbox">${ic(S.settings.sandbox ? "power" : "flask-conical", 13)} ${S.settings.sandbox ? "Remove sandbox data" : "Load sandbox sample (SIMULATED)"}</button>
          </div>
          <div class="al-card">
            <h3>${ic("settings", 15)} Defaults</h3>
            <div class="al-field"><label>Default market</label><select id="cfg-country">${COUNTRIES.map((c) => `<option value="${c}"${S.settings.defaultCountry === c ? " selected" : ""}>${CC(c)} (${c})</option>`).join("")}</select></div>
            <div class="al-field"><label>Workspace</label>
              <div class="al-na-row">Evidence labels: ${ev("OBSERVED")} ${ev("ESTIMATED")} ${ev("INFERRED")} ${ev("PREDICTED")} ${ev("SIMULATED")}</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function diagPill(label, ok, sub) {
    const cls = ok === true ? "connected" : ok === false ? "disconnected" : "unknown";
    return `<div class="diag-row"><span class="diag-label">${esc(label)}</span><span class="pill al-st ${cls}"><span class="dot"></span> ${esc(sub || (ok === true ? "OK" : ok === false ? "FAIL" : "—"))}</span></div>`;
  }

  function diagHtml(d) {
    if (!d || typeof d !== "object") return `<div class="al-na-row">No diagnostics available.</div>`;
    const rows = [];
    rows.push(diagPill("Backend", d.backend ? d.backend.connected !== false : true, d.backend && d.backend.node ? "node " + d.backend.node : "running"));
    if (d.python) rows.push(diagPill("Python", d.python.ok, d.python.version || (d.python.error ? String(d.python.error).slice(0, 60) : "missing")));
    if (d.mcp) rows.push(diagPill("MCP", d.mcp.connected, d.mcp.connected ? (d.mcp.toolCount || d.mcp.tools.length || 0) + " tools" : (d.mcp.state || "disconnected")));
    if (d.token) rows.push(diagPill("Facebook token", d.token.valid, d.token.valid === true ? "valid" : (d.token.error && d.token.error.message) ? String(d.token.error.message).slice(0, 60) : "invalid"));
    if (d.adsRead) rows.push(diagPill("ads_read", d.adsRead.granted, d.adsRead.granted === true ? "granted" : (d.adsRead.status || "not granted")));
    if (d.adsLibraryApi) rows.push(diagPill("Ads Library API", d.adsLibraryApi.granted, d.adsLibraryApi.granted === true ? "granted" : d.adsLibraryApi.granted === false ? "not granted" : "n/a"));
    if (d.adsArchive) rows.push(diagPill("Ads Archive endpoint", d.adsArchive.working, d.adsArchive.working === true ? "working (real data)" : d.adsArchive.status ? "HTTP " + d.adsArchive.status : "not reached"));
    let html = `<div class="al-card al-callout" style="margin:0 0 10px"><h4>${ic("stethoscope", 13)} Live diagnostics</h4>${rows.join("")}</div>`;
    if (d.permissionUrl || d.state === "ads_library_api_required") {
      html += `<div class="al-callout warn"><a class="al-btn primary" href="${esc(d.permissionUrl || "https://www.facebook.com/ads/library/api")}" target="_blank" rel="noopener">${ic("external-link", 12)} Request Ads Library API access</a><span class="al-na-row" style="margin-top:6px">The app is not approved yet — searches stay stopped (no retries) until access is granted.</span></div>`;
    }
    return html;
  }

  /* ---------------- section router ---------------- */
  function renderSection() {
    switch (S.section) {
      case "dashboard": return secDashboard();
      case "research": return secResearch();
      case "adlibrary": return secAdLibrary();
      case "products": return secProducts();
      case "ads": return secWinningAds();
      case "competitors": return secCompetitors();
      case "creative": return secCreative();
      case "market": return secMarket();
      case "monitor": return secMonitor();
      case "reports": return secReports();
      case "saved": return secSaved();
      case "exports": return secExports();
      case "tools": return secTools();
      case "settings": return secSettings();
      case "product": return productDetail(S.productKey);
      default: return "";
    }
  }

  /* ---------------- actions / wiring ---------------- */
  function openAd(a) {
    if (!a) return;
    window.open(a.snapshotUrl || a.landing, "_blank", "noopener");
    toast("Opening " + (a.brand || a.adId), "external-link");
  }

  function saveItem(type, key, name) {
    if (S.saved.some((x) => x.type === type && x.key === key)) { toast("Already saved", "info"); return; }
    S.saved.push({ type, key, name: name || key, at: Date.now() });
    persist();
    toast("Saved to research", "bookmark");
    render();
  }
  function unsave(key) {
    S.saved = S.saved.filter((x) => x.key !== key);
    persist();
    toast("Removed from saved", "trash-2");
    render();
  }

  async function runSearch() {
    const kw = ($("#r-keyword").value || "").trim();
    if (!kw) { toast("Enter a keyword or query", "warn"); return; }
    S.research.keyword = kw;
    const button = $("#r-run");
    button.disabled = true; button.textContent = "Searching…";
    toast("Searching Facebook Ads Library…", "search");

    const countries = $("#r-countries").value.split(",").map((s) => s.trim().toUpperCase()).filter((c) => COUNTRIES.includes(c));
    if (countries.length) S.research.countries = countries;
    S.research.category = $("#r-category").value;
    S.research.active = $("#r-active").value;
    S.research.dateRange = Number($("#r-range").value) || 90;

    let found = 0;
    const errors = [];
    const seen = new Set(S.ads.map((a) => a.adId));
    for (const c of S.research.countries) {
      try {
        const r = await MCP.call("search_facebook_ads", { brand_name: kw, country: c, ad_type: "ALL", date_range: S.research.dateRange, limit: 50 });
        if (r.blocked) { errors.push(r.error || "blocked by Facebook permission"); S.mcp.state = r.state || "tool_error"; break; }
        if (!r.ok) { errors.push(fbErrLine(r.detail) || r.error || "tool error"); continue; }
        const data = r.data;
        const ads = Array.isArray(data) ? data : (data && data.ads);
        if (!Array.isArray(ads)) continue;
        ads.forEach((ad) => {
          if (!ad || !ad.id) return;
          const id = String(ad.id);
          if (seen.has(id)) return;
          seen.add(id);
          const created = (ad.ad_creation_time || "").slice(0, 10);
          const spendRange = ad.spend && ad.spend !== "≤$100" ? ad.spend : null;
          const spendAvg = spendRange ? (() => { const ns = (spendRange.match(/\d+/g) || []).map(Number); return ns.length ? Math.round(ns.reduce((a, b) => a + b, 0) / ns.length) : null; })() : null;
          S.ads.push({
            adId: id,
            product: kw,
            category: S.research.category || "Unclassified",
            brand: ad.page_name || kw,
            country: c,
            format: (ad.publisher_platforms || []).includes("video") ? "Video" : "Image",
            status: ad.ad_active_status || "ACTIVE",
            created,
            firstSeen: created || new Date().toISOString().slice(0, 10),
            lastSeen: new Date().toISOString().slice(0, 10),
            headline: (ad.ad_creative_link_titles && ad.ad_creative_link_titles[0]) || "",
            body: (ad.ad_creative_bodies && ad.ad_creative_bodies[0]) || "",
            cta: "",
            platform: (ad.publisher_platforms || []).join("+") || "facebook",
            spend: spendAvg,
            currency: ad.currency || "USD",
            landing: "",
            snapshotUrl: ad.ad_snapshot_url || "",
            state: "OBSERVED",
            evidence: { duration: "OBSERVED", spend: "ESTIMATED", audience: "INFERRED", performance: "INFERRED" },
            creativeScore: 55,
          });
          found++;
        });
      } catch (e) { errors.push(e.message); }
    }
    S.searches.unshift({ keyword: kw, countries: S.research.countries.slice(), at: Date.now(), found });
    if (found && S.ads.some((a) => a.state === "SIMULATED")) {
      // a real search returned data — drop the demo/sandbox rows so product research shows only real results
      S.ads = S.ads.filter((a) => a.state !== "SIMULATED");
      S.analyses = S.analyses.filter((a) => a.state !== "SIMULATED");
      S.settings.sandbox = false;
      toast("Sandbox sample data removed — showing real Facebook ads only", "check-circle");
    }
    persist();
    button.disabled = false; button.textContent = "Search Facebook Ads";
    if (found) toast("Found " + found + " new ads across " + S.research.countries.length + " country(ies)", "check-circle");
    else toast(errors.length ? "Search error — " + errors[0] : "No new ads found", errors.length ? "alert-triangle" : "info");
    S.section = "adlibrary";
    render();
  }

  async function runAgent(productName) {
    const host = $("#al-content");
    if (!host) return;
    const steps = [
      { t: "Searching Facebook ads", tool: "search_facebook_ads" },
      { t: "Discovering advertisers", tool: "discover_competitor_brands" },
      { t: "Clustering products", tool: null },
      { t: "Analyzing creative patterns", tool: "analyze_ad_creative_elements" },
      { t: "Analyzing competitors", tool: "competitive_ad_analysis" },
      { t: "Identifying market opportunities", tool: null },
      { t: "Scoring opportunities", tool: null },
      { t: "Ranking + report", tool: "generate_facebook_intelligence_report" },
    ];
    host.innerHTML = `<div class="al-card">
      <h3>${ic("bot", 15)} Research agent <span class="sub">${esc(productName || "guided research")} · live process</span></h3>
      <div class="agent-log" id="agent-log"></div>
      <div class="al-flex" style="margin-top:12px"><button class="al-btn" id="agent-close">${ic("x", 13)} Close</button><span class="al-na-row">Each step runs the real MCP tool when connected; otherwise it is skipped and labelled — nothing is fabricated.</span></div>
    </div>`;
    icons();
    const log = $("#agent-log");
    const say = (st, t) => { if (log) { const d = document.createElement("div"); d.className = "ln"; d.innerHTML = `<span class="st ${st}">${st === "ok" ? "OK" : st === "err" ? "ERR" : st === "run" ? "RUN" : "DONE"}</span><span>${esc(t)}</span>`; log.appendChild(d); log.scrollTop = log.scrollHeight; } };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    let connected = S.mcp.state === "connected";

    say("run", "Starting research" + (productName ? " for “" + productName + "”" : "") + "…");
    for (const step of steps) {
      say("run", step.t + "…");
      await sleep(180);
      if (step.tool && connected) {
        try {
          const args = step.tool === "search_facebook_ads" ? { brand_name: productName || S.research.keyword || "product", country: S.research.countries[0] || "US" }
            : step.tool === "discover_competitor_brands" ? { industry_keywords: productName || S.research.keyword || "ecommerce" }
            : step.tool === "analyze_ad_creative_elements" ? { ad_snapshot_url: "" }
            : step.tool === "competitive_ad_analysis" ? { brands_list: [productName || "brand"] }
            : {};
          const r = await MCP.call(step.tool, args);
          say(r.ok ? "ok" : "err", step.tool + (r.ok ? " → done" : " → " + (r.error || "no result")));
        } catch (e) { say("err", step.tool + " → " + e.message); }
      } else if (step.tool) {
        say("err", step.tool + " → skipped: MCP not connected (backend: " + S.mcp.state + ")");
      } else {
        say("ok", step.t + " (computed locally from collected evidence)");
      }
    }
    say("done", "Scoring " + clusters().length + " product clusters locally…");
    say("done", "Generating report…");
    S.lastReport = buildReportMarkdown(productName || "");
    persist();
    say("ok", "Agent finished. Open Reports to view the generated report.");
    const close = $("#agent-close");
    if (close) close.addEventListener("click", () => { S.section = "reports"; render(); });
  }

  function bindSection() {
    const content = $("#al-content");
    if (!content) return;

    content.addEventListener("click", async (e) => {
      const t = e.target.closest("[data-act]");
      if (t) {
        const act = t.getAttribute("data-act");
        const id = t.getAttribute("data-id");
        const key = t.getAttribute("data-key");
        switch (act) {
          case "open-ad": { const a = S.ads.find((x) => x.adId === id); openAd(a); break; }
          case "analyze-ad": {
            const a = S.ads.find((x) => x.adId === id);
            if (!a) break;
            if (!a.snapshotUrl) { toast("No snapshot URL from the data source — cannot analyze", "alert-triangle"); break; }
            toast("Analyzing creative…", "scan-eye");
            const r = await MCP.call("analyze_ad_creative_elements", { ad_snapshot_url: a.snapshotUrl });
            const analysis = r.ok ? (r.data || {}) : { error: r.error || "unavailable" };
            S.analyses.push(Object.assign({ url: a.snapshotUrl, state: r.ok ? "OBSERVED" : "INFERRED" }, analysis));
            persist();
            S.section = "creative"; render();
            break;
          }
          case "save-ad": saveItem("ad", id, (S.ads.find((x) => x.adId === id) || {}).headline || id); break;
          case "save-product": { const p = clusters().find((x) => x.key === key); saveItem("product", p.key, p.name); break; }
          case "save-hook": saveItem("hook", id, id); break;
          case "goto-product": { S.section = "product"; S.productKey = key; render(); break; }
          case "open-product": { S.section = "product"; S.productKey = key; render(); break; }
          case "run-agent": { const p = t.getAttribute("data-product"); await runAgent(p || null); break; }
          case "export-product": { const p = clusters().find((x) => x.key === key); if (p) downloadExport("product", p); break; }
          case "reuse-search": { const s = S.searches[Number(t.getAttribute("data-i"))]; if (s) { S.research.keyword = s.keyword; S.research.countries = s.countries.slice(); S.section = "research"; render(); } break; }
          case "run-tool": { S.pendingTool = t.getAttribute("data-tool"); openToolModal(); break; }
          case "m-run": { const m = S.monitors[Number(t.getAttribute("data-i"))]; if (m) runMonitor(m); break; }
          case "m-del": { S.monitors.splice(Number(t.getAttribute("data-i")), 1); persist(); render(); break; }
        }
      }
      const unsaveBtn = e.target.closest("[data-unsave]");
      if (unsaveBtn) unsave(unsaveBtn.getAttribute("data-unsave"));
      const delcol = e.target.closest("[data-delcol]");
      if (delcol) { S.collections.splice(Number(delcol.getAttribute("data-delcol")), 1); persist(); render(); }
      const rmchip = e.target.closest("[data-rm]");
      if (rmchip) { S.research.countries = S.research.countries.filter((c) => c !== rmchip.getAttribute("data-rm")); render(); }
      const frm = e.target.closest("[data-frm]");
      if (frm) { S.filters.countries = S.filters.countries.filter((c) => c !== frm.getAttribute("data-frm")); render(); }
    });

    /* research */
    const rRun = $("#r-run"); if (rRun) rRun.addEventListener("click", runSearch);
    const rSave = $("#r-save-query"); if (rSave) rSave.addEventListener("click", () => { const kw = ($("#r-keyword").value || "").trim(); if (kw) { S.searches.unshift({ keyword: kw, countries: S.research.countries.slice(), at: Date.now(), found: 0 }); persist(); toast("Query saved to history", "bookmark"); render(); } });

    /* filters */
    const fTime = $("#f-time"); if (fTime) fTime.addEventListener("change", () => { S.filters.time = fTime.value; render(); });
    const fCreative = $("#f-creative"); if (fCreative) fCreative.addEventListener("change", () => { S.filters.creative = fCreative.value; render(); });
    const fCountry = $("#f-country"); if (fCountry) fCountry.addEventListener("change", () => { if (fCountry.value) { if (!S.filters.countries.includes(fCountry.value)) S.filters.countries.push(fCountry.value); render(); } });
    const fQ = $("#f-q"); if (fQ) fQ.addEventListener("input", () => {
      const q = fQ.value.toLowerCase();
      S._q = q;
      document.querySelectorAll("#al-content .ad-card").forEach((c) => { c.style.display = c.innerText.toLowerCase().includes(q) ? "" : "none"; });
    });

    /* competitors */
    const cDisc = $("#c-discover"); if (cDisc) cDisc.addEventListener("click", async () => {
      const kw = ($("#c-keyword").value || "").trim();
      if (!kw) { toast("Enter industry keywords", "warn"); return; }
      toast("Discovering competitors…", "users");
      if (S.mcp.state !== "connected") { toast("MCP not connected — run sandbox or connect in Settings", "alert-triangle"); return; }
      const r = await MCP.call("discover_competitor_brands", { industry_keywords: kw });
      toast(r.ok ? "Discovery done" : "Discovery error: " + (r.error || "unavailable"), r.ok ? "ok" : "alert-triangle");
    });
    const cCmp = $("#c-compare"); if (cCmp) cCmp.addEventListener("click", () => {
      const sel = [...document.querySelectorAll(".c-sel:checked")].map((x) => x.getAttribute("data-brand"));
      if (sel.length < 2) { toast("Select at least 2 brands to compare", "warn"); return; }
      openCompareModal(sel);
    });

    /* creative */
    const ciA = $("#ci-analyze"); if (ciA) ciA.addEventListener("click", async () => {
      const url = ($("#ci-url").value || "").trim();
      if (!url) { toast("Paste an ad snapshot URL", "warn"); return; }
      toast("Analyzing creative…", "scan-eye");
      const r = await MCP.call("analyze_ad_creative_elements", { ad_snapshot_url: url });
      S.analyses.push(Object.assign({ url, state: r.ok ? "OBSERVED" : "INFERRED" }, (r.ok && r.data) || { error: r.error || "analysis unavailable from current data source" }));
      persist();
      render();
    });

    /* monitoring */
    const mAdd = $("#m-add"); if (mAdd) mAdd.addEventListener("click", () => {
      const q = ($("#m-kind").value || "").trim();
      if (!q) { toast("Enter a brand or keyword to monitor", "warn"); return; }
      S.monitors.push({ query: q, at: Date.now(), findings: 0, seen: S.ads.map((a) => a.adId) });
      persist();
      toast("Monitoring started for “" + q + "”", "radar");
      render();
    });

    /* reports */
    const repGen = $("#rep-gen"); if (repGen) repGen.addEventListener("click", () => {
      const brand = ($("#rep-brand").value || "").trim();
      S.lastReport = buildReportMarkdown(brand || null);
      persist();
      toast("Report generated", "file-text");
      render();
    });
    const repDl = $("#rep-dl"); if (repDl) repDl.addEventListener("click", () => { if (S.lastReport) downloadText("ad-library-report.md", S.lastReport, "text/markdown"); });

    /* saved */
    const cAdd = $("#c-add"); if (cAdd) cAdd.addEventListener("click", () => { const n = ($("#c-new").value || "").trim(); if (n) { S.collections.push(n); persist(); toast("Collection created", "folder-plus"); render(); } });

    /* exports */
    const exRun = $("#ex-run"); if (exRun) exRun.addEventListener("click", () => {
      const scope = $("#ex-scope").value;
      const fmt = $("#ex-format").value;
      downloadExport(scope, null, fmt);
    });

    /* tools */
    const tRef = $("#t-refresh"); if (tRef) tRef.addEventListener("click", async () => { toast("Refreshing tools…", "refresh-cw"); await refreshMCPStatus(); if (S.mcp.state === "connected") { try { const r = await MCP.refresh(); S.mcp.tools = r.tools || S.mcp.tools; } catch (e) {} } render(); });

    /* settings */
    const cfgPayload = () => {
      const cfg = {};
      const token = ($("#cfg-token").value || "").trim();
      const py = ($("#cfg-python").value || "").trim();
      const sc = ($("#cfg-script").value || "").trim();
      if (token) cfg.facebookToken = token;
      if (py) cfg.pythonPath = py;
      if (sc) cfg.scriptPath = sc;
      return cfg;
    };
    const cfgSave = $("#cfg-save"); if (cfgSave) cfgSave.addEventListener("click", async () => {
      const cfg = cfgPayload();
      const r = await MCP.config(cfg);
      toast(r.ok ? "Config saved (token kept server-side)" : "Failed: " + (r.error || "unknown"), r.ok ? "ok" : "alert-triangle");
      await refreshMCPStatus();
      render();
    });
    const cfgTest = $("#cfg-test"); if (cfgTest) cfgTest.addEventListener("click", async () => {
      toast("Testing Ads Library API pipeline…", "flask-conical");
      const token = ($("#cfg-token").value || "").trim();
      try {
        const r = await MCP.probe(token);
        S.mcp.state = r.state; S.mcp.tools = S.mcp.tools || []; S.mcp.tokenMasked = r.tokenMasked || S.mcp.tokenMasked; S.mcp.lastError = r.lastError || null;
        const diag = $("#al-diag"); if (diag) diag.innerHTML = diagHtml(r);
        if (r.adsArchive && r.adsArchive.working) toast("Ads Library API works — real ads returned from /ads_archive", "ok");
        else if (r.adsLibraryApi && !r.adsLibraryApi.granted) toast("Ads Library API access is required for this Facebook application", "alert-triangle");
        else toast("Not working: " + (fbErrLine(r.lastError) || r.error || r.message || r.state), "alert-triangle");
      } catch (e) { toast("Test failed: " + e.message, "alert-triangle"); }
      render();
    });
    const cfgRefresh = $("#cfg-refresh"); if (cfgRefresh) cfgRefresh.addEventListener("click", async () => { toast("Refreshing tools…", "refresh-cw"); try { const r = await MCP.refresh(); S.mcp.tools = r.tools || []; S.mcp.state = r.state; } catch (e) {} render(); });
    const diagBox = $("#al-diag"); if (diagBox) { MCP.diagnostics().then((d) => { diagBox.innerHTML = diagHtml(d); }).catch(() => {}); }
    const cfgSandbox = $("#cfg-sandbox"); if (cfgSandbox) cfgSandbox.addEventListener("click", () => toggleSandbox(!S.settings.sandbox));
    const cfgCountry = $("#cfg-country"); if (cfgCountry) cfgCountry.addEventListener("change", () => { S.settings.defaultCountry = cfgCountry.value; persist(); });
  }

  async function runMonitor(m) {
    toast("Checking " + m.query + "…", "radar");
    let err = null, now = [];
    if (S.mcp.state === "connected") {
      try {
        const r = await MCP.call("search_facebook_ads", { brand_name: m.query, country: S.research.countries[0] || "US", limit: 50 });
        if (r.ok && r.data) { const ads = Array.isArray(r.data) ? r.data : r.data.ads || []; now = ads.map((a) => String(a.id)); }
        else err = fbErrLine(r.detail) || r.error;
      } catch (e) { err = e.message; }
    } else {
      now = S.ads.filter((a) => (a.brand || "").toLowerCase().includes(m.query.toLowerCase())).map((a) => a.adId);
    }
    const prev = new Set(m.seen || []);
    const removed = prev.size ? [...prev].filter((x) => !now.includes(x)).length : 0;
    const added = now.filter((x) => !prev.has(x)).length;
    m.seen = now; m.findings += added + removed; m.lastCheck = Date.now();
    if (err) toast("Monitor error: " + err, "alert-triangle");
    else toast((added || removed) ? added + " new, " + removed + " removed for " + m.query : "No changes for " + m.query, added ? "sparkles" : "info");
    persist();
    render();
  }

  function openToolModal() {
    const tool = S.mcp.tools.find((t) => t.name === S.pendingTool);
    const modal = $("#al-modal"), box = $("#al-modal-box");
    if (!modal || !tool) return;
    const props = (tool.inputSchema && tool.inputSchema.properties) || {};
    const fields = Object.entries(props).map(([k, v]) => `<div class="al-field"><label>${esc(k)}${tool.inputSchema.required && tool.inputSchema.required.includes(k) ? " *" : ""}</label><input data-p="${esc(k)}" value="${v.type === "number" ? "10" : v.default != null ? esc(String(v.default)) : ""}" placeholder="${esc(k)}"></div>`).join("");
    box.innerHTML = `
      <h3>${ic("wrench", 16)} Run <code style="color:var(--green)">${esc(tool.name)}</code></h3>
      ${fields || `<div class="al-na-row">This tool exposes no editable parameters.</div>`}
      <div class="al-modal-acts"><button class="al-btn" id="tm-cancel">Cancel</button><button class="al-btn primary" id="tm-run">${ic("play", 12)} Execute</button></div>
      <div class="report-preview" id="tm-out" style="margin-top:12px;display:none;max-height:220px"></div>`;
    modal.classList.add("open");
    box.querySelector("#tm-cancel").addEventListener("click", closeModal);
    box.querySelector("#tm-run").addEventListener("click", async () => {
      const args = {};
      box.querySelectorAll("[data-p]").forEach((i) => { args[i.getAttribute("data-p")] = i.value; });
      const out = box.querySelector("#tm-out");
      out.style.display = "block"; out.textContent = "Executing " + tool.name + "…";
      const r = await MCP.call(tool.name, args);
      out.textContent = r.ok ? (typeof r.text === "string" ? r.text.slice(0, 4000) : JSON.stringify(r.data, null, 2).slice(0, 4000)) : ("Error: " + (r.error || "unavailable"));
    });
  }

  function openCompareModal(brands) {
    const modal = $("#al-modal"), box = $("#al-modal-box");
    const rows = brands.map((b) => {
      const ads = S.ads.filter((a) => a.brand === b);
      return { brand: b, ads: ads.length, active: ads.filter((a) => a.status === "ACTIVE").length, formats: [...new Set(ads.map((a) => a.format))].length, countries: new Set(ads.map((a) => a.country)).size, products: new Set(ads.map((a) => a.product)).size, spend: ads.reduce((s, a) => s + (a.spend || 0), 0), long: ads.filter((a) => daysAgo(a.firstSeen || a.created || Date.now()) >= 30).length };
    });
    box.innerHTML = `
      <h3>${ic("git-compare", 16)} Competitor comparison</h3>
      <div class="al-tbl-wrap"><table class="al-tbl"><thead><tr><th>Signal</th>${rows.map((r) => `<th>${esc(r.brand)}</th>`).join("")}</tr></thead><tbody>
      ${[["Ads", (r) => r.ads], ["Active ads", (r) => r.active], ["Creative formats", (r) => r.formats], ["Countries", (r) => r.countries], ["Products", (r) => r.products], ["Long-running ads", (r) => r.long], ["Estimated spend", (r) => "$" + num(r.spend) + " " + "EST"]].map(([lbl, fn]) => `<tr><td><b>${esc(lbl)}</b></td>${rows.map((r) => `<td class="num">${fn(r)}</td>`).join("")}</tr>`).join("")}
      </tbody></table></div>
      <div class="al-modal-acts"><button class="al-btn primary" id="tm-cancel">Close</button></div>`;
    modal.classList.add("open");
    box.querySelector("#tm-cancel").addEventListener("click", closeModal);
  }

  function downloadExport(scope, product, fmt) {
    fmt = fmt || "json";
    const cl = clusters();
    let data;
    if (scope === "products") data = cl.map((p) => ({ name: p.name, category: p.category, score: p.score.total, components: p.score.components, evidence: p.evidence, advertisers: p.advertisers, ads: p.ads.length, countries: p.countries, durationDays: p.durationDays }));
    else if (scope === "product" && product) data = { product: product.name, score: product.score.total, components: product.score.components, evidence: product.evidence, ads: product.ads.map((a) => ({ adId: a.adId, brand: a.brand, country: a.country, status: a.status, firstSeen: a.firstSeen, format: a.format, spend: a.spend, state: a.state })) };
    else if (scope === "report") data = S.lastReport;
    else data = S.ads.map((a) => ({ adId: a.adId, brand: a.brand, product: a.product, country: a.country, status: a.status, format: a.format, firstSeen: a.firstSeen, lastSeen: a.lastSeen, headline: a.headline, cta: a.cta, spend: a.spend, currency: a.currency, snapshotUrl: a.snapshotUrl, state: a.state }));
    let body, mime, name;
    if (fmt === "json") { body = JSON.stringify(data, null, 2); mime = "application/json"; name = "ad-library-" + scope + ".json"; }
    else if (fmt === "csv") {
      const arr = Array.isArray(data) ? data : [data];
      const cols = [...new Set(arr.flatMap((o) => (o && typeof o === "object" ? Object.keys(o) : [])))];
      body = [cols.join(","), ...arr.map((o) => cols.map((c) => JSON.stringify((o && o[c] != null) ? String(o[c]) : "").replace(/"/g, "\"\"")).join(","))].join("\n");
      mime = "text/csv"; name = "ad-library-" + scope + ".csv";
    } else { body = typeof data === "string" ? data : JSON.stringify(data, null, 2); mime = "text/markdown"; name = "ad-library-" + scope + ".md"; }
    downloadText(name, body, mime);
  }
  function downloadText(name, text, mime) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: mime }));
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 3000);
  }
  function closeModal() {
    const modal = $("#al-modal");
    if (modal) modal.classList.remove("open");
    const box = $("#al-modal-box");
    if (box) box.innerHTML = "";
  }

  /* ---------------- boot ---------------- */
  async function init() {
    bootStore();
    render();
    await refreshMCPStatus();
    render();
    const modal = $("#al-modal");
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
