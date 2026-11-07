/* ============================================================
   PUNCHLINE — MARKET IN THE WORLD (market-world.html)
   "Idea preview platform for any page market, all markets."
   Marketplace database → searchable idea cards, preview modal,
   add-your-own idea (saved in localStorage). Data: market-data.js
   ============================================================ */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ic = (n, s) => `<i data-lucide="${n}" style="width:${s || 14}px;height:${s || 14}px"></i>`;
  const uid = () => "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const toast = (m, t) => { try { window.PL && PL.toast(m, t || "ok"); } catch (e) { console.warn(m); } };
  function icons() { try { if (window.lucide) lucide.createIcons(); } catch (e) {} }

  const DATA = (window.MARKET_DATA || { groups: [], items: [] });
  const EVT = (window.MARKET_EVENTS || { hashtags: [], global: [], islamic: [], countries: [] });
  const STORE = "marketworld.v1";
  const IDEAS = [];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const GROUPS = DATA.groups;
  const groupOf = (id) => GROUPS.find((g) => g.id === id) || GROUPS[0];
  const regionOf = (r) => (r || "Global");

  /* ---------- domain extraction for open links ---------- */
  function domainOf(name, note) {
    const t = String(name || "") + " " + String(note || "");
    const text = t.replace(/\(.*?\)/g, " ").replace(/[^a-zA-Z0-9.\s\u0400-\u04FF\u4E00-\u9FFF\u00C0-\u017F-]/g, " ");
    const toks = text.split(/\s+/).filter((x) => {
      if (x.length < 4 || x.startsWith(".") || x.endsWith(".") || /^\d/.test(x)) return false;
      const parts = x.split(".");
      if (parts.length < 2) return false;
      return /^[a-z]{2,7}$/.test(parts[parts.length - 1].toLowerCase());
    });
    if (!toks.length) return "";
    const score = (x) => {
      const tld = x.split(".").pop().toLowerCase();
      let s = 0;
      if (["com", "net", "org", "io", "co", "app"].includes(tld)) s += 3;
      else if (/^[a-z]{2}$/.test(tld)) s += 2;
      return s + Math.min(x.length, 30) / 100;
    };
    const best = toks.slice().sort((a, b) => score(b) - score(a))[0];
    return "https://" + best.toLowerCase();
  }
  function hostOf(name, note) { try { return new URL(domainOf(name, note)).hostname.replace(/^www\./, ""); } catch (e) { return ""; } }

  /* ---------- favicon preview image (falls back to monogram) ---------- */
  function faviconHTML(it, site) {
    const letter = `<b class="mw-favletter">${esc((it.n[0] || "?").toUpperCase())}</b>`;
    if (!site) return letter;
    const host = site.replace(/^https?:\/\//, "");
    return `<img class="mw-favimg" src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128" alt="" loading="lazy" onerror="this.remove();this.parentNode.classList.add('noimg')">${letter}`;
  }

  /* ---------- small inline logo (card body / list rows) ---------- */
  function smallLogo(it, site) {
    const host = site ? site.replace(/^https?:\/\//, "") : "";
    const letter = `<b class="mw-favletter">${esc((it.n[0] || "?").toUpperCase())}</b>`;
    if (!host) return letter;
    return `<img class="mw-logo-sm-img" src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64" alt="${esc(it.n)} logo" loading="lazy" onerror="this.remove();this.parentNode.classList.add('noimg')">${letter}`;
  }

  /* ---------- large card preview hero (branded, no empty areas) ---------- */
  function previewHTML(it, g, site) {
    const host = site ? site.replace(/^https?:\/\//, "") : "";
    const bg = `radial-gradient(130% 150% at 18% 0%, rgba(255,255,255,.34) 0%, rgba(255,255,255,0) 46%), linear-gradient(158deg, ${g.color} 0%, ${g.color} 62%, rgba(11,27,51,.40) 100%)`;
    const logoImg = host
      ? `<img class="mw-media-fav" src="https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=256" alt="${esc(it.n)} logo" loading="lazy" onerror="this.remove();this.nextElementSibling.style.display='grid'">`
      : "";
    const letter = `<span class="mw-media-letter" style="color:${g.color}${host ? ";display:none" : ""}">${esc((it.n[0] || "?").toUpperCase())}</span>`;
    const status = host
      ? `<span class="mw-media-status ok">${ic("check", 9)} Live</span>`
      : `<span class="mw-media-status">${ic("sparkles", 9)} Idea</span>`;
    const chip = host
      ? `<span class="mw-media-chip">${ic("globe", 9)} ${esc(host)}</span>`
      : `<span class="mw-media-chip">${ic("map-pin", 9)} ${esc(regionOf(it.r))}</span>`;
    return `
      <div class="mw-media">
        <div class="mw-media-bg" style="background:${bg}"></div>
        <div class="mw-media-logo">${logoImg}${letter}</div>
        <div class="mw-media-overlay"></div>
        ${chip}
        ${status}
      </div>`;
  }

  /* ---------- persistence for user-added ideas ---------- */
  function loadIdeas() {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) { const d = JSON.parse(raw); if (Array.isArray(d)) return d; }
    } catch (e) {}
    return [];
  }
  function persistIdeas() {
    try { localStorage.setItem(STORE, JSON.stringify(IDEAS)); } catch (e) {}
  }

  /* ---------- persistence for removed built-in cards ---------- */
  const HIDDEN_STORE = "marketworld.hidden.v1";
  function loadHidden() {
    try {
      const raw = localStorage.getItem(HIDDEN_STORE);
      if (raw) { const d = JSON.parse(raw); if (Array.isArray(d)) return d; }
    } catch (e) {}
    return [];
  }
  function persistHidden() {
    try { localStorage.setItem(HIDDEN_STORE, JSON.stringify(Array.from(S.hidden))); } catch (e) {}
  }

  /* ---------- state ---------- */
  const S = { g: "all", r: "all", q: "", saved: new Set(), hidden: new Set(), view: "platforms", month: "all", ctry: "all" };

  function allItems() {
    return DATA.items.filter((i) => !S.hidden.has(i.id))
      .concat(IDEAS.map((i) => ({ id: i.id, g: i.g, r: i.r, n: i.n, d: i.d, custom: true })));
  }

  function filtered() {
    const q = S.q.trim().toLowerCase();
    return allItems().filter((it) => {
      if (S.g !== "all" && it.g !== S.g) return false;
      if (S.r !== "all" && it.r !== S.r) return false;
      if (q && !(it.n + " " + it.d + " " + it.r + " " + (groupOf(it.g).label)).toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function regions() {
    const set = new Set(allItems().map((it) => it.r));
    return Array.from(set).sort();
  }

  function groupCount(gid) {
    return allItems().filter((it) => it.g === gid).length;
  }

  /* ---------- shell render ---------- */
  function renderShell() {
    const view = $("#mw-app");
    if (!view) return;

    const sidebar = `
      ${S.view === "platforms" ? `
      <div class="mw-side-lbl">Market types</div>
      <button class="mw-nav-btn${S.g === "all" ? " active" : ""}" data-g="all">${ic("layout-grid", 15)}<span>All Markets</span><span class="cnt">${allItems().length}</span></button>
      ${GROUPS.map((g) => `<button class="mw-nav-btn${S.g === g.id ? " active" : ""}" data-g="${g.id}">${ic(g.icon, 15)}<span>${esc(g.label)}</span><span class="cnt">${groupCount(g.id)}</span></button>`).join("")}
      <div class="mw-side-lbl" style="margin-top:8px">Region</div>
      <select class="mw-side-region" id="mw-region">
        <option value="all">All regions</option>
        ${regions().map((r) => `<option value="${esc(r)}">${esc(r)}</option>`).join("")}
      </select>
      ` : `
      <div class="mw-side-lbl">Event views</div>
      <button class="mw-nav-btn active" data-g="all">${ic("calendar-days", 15)}<span>Events & Hashtags</span><span class="cnt">${EVT.countries.length + EVT.global.length + EVT.islamic.length + EVT.hashtags.length}</span></button>
      <div class="mw-side-lbl" style="margin-top:8px">Region</div>
      <select class="mw-side-region" id="mw-region">
        <option value="all">All regions</option>
        ${Array.from(new Set(EVT.countries.map((c) => c[0]))).sort().map((r) => `<option value="${esc(r)}">${esc(r)}</option>`).join("")}
      </select>
      `}
      <button class="mw-side-add" id="mw-add">${ic("plus", 14)} Add idea</button>
      <button class="mw-side-events" id="mw-events">${ic("calendar-days", 14)} Events & Hashtags</button>
      ${S.hidden.size ? `<button class="mw-restore" id="mw-restore">${ic("rotate-ccw", 12)} Restore removed (${S.hidden.size})</button>` : ""}
      <div class="mw-side-foot">Every card is an idea seed — preview it, then take it into a real market test. Custom ideas are saved on this device.</div>`;

    const toolbar = `
      <div class="mw-search">${ic("search", 14)}<input id="mw-q" type="search" placeholder="Search any marketplace, tool or region…" value="${esc(S.q)}"></div>
      <button class="mw-clear" id="mw-clear">${ic("refresh-cw", 13)} Clear</button>`;

    view.innerHTML = `
      <div class="mw-head">
        <div>
          <h1 class="mw-title">Market in the World <em>🌍</em></h1>
          <p class="mw-sub">Idea preview platform for any page market, all markets — marketplaces, B2B & wholesale, auctions, fulfillment, dropshipping, China sourcing and product discovery. Preview any card, or add your own idea.</p>
        </div>
        <div class="mw-stats">
          <div class="mw-stat"><b id="mw-count">0</b><span>Platforms</span></div>
          <div class="mw-stat"><b id="mw-regions">0</b><span>Regions</span></div>
          <div class="mw-stat"><b id="mw-groups">0</b><span>Categories</span></div>
        </div>
      </div>
      <div class="mw-tabs">
        <button class="mw-tab${S.view === "platforms" ? " active" : ""}" data-view="platforms">${ic("layout-grid", 14)} Platforms</button>
        <button class="mw-tab${S.view === "events" ? " active" : ""}" data-view="events">${ic("calendar-days", 14)} Events & Hashtags</button>
      </div>
      <div class="mw-layout">
        <aside class="mw-side">${sidebar}</aside>
        <main class="mw-main">
          ${toolbar}
          <div id="mw-results"></div>
        </main>
      </div>
      <button class="mw-fab" id="mw-fab" title="Add marketplace idea">${ic("plus", 20)}</button>`;

    view.querySelectorAll(".mw-tab").forEach((b) => b.addEventListener("click", () => {
      S.view = b.getAttribute("data-view");
      renderShell();
    }));

    $("#mw-q").addEventListener("input", (e) => { S.q = e.target.value; render(); });
    $("#mw-clear").addEventListener("click", () => { S.q = ""; const inp = $("#mw-q"); if (inp) inp.value = ""; render(); });
    $("#mw-region").value = S.r;
    $("#mw-region").addEventListener("change", (e) => {
      S.r = e.target.value;
      if (S.view === "events") { S.ctry = e.target.value; renderEvents(); return; }
      render();
    });
    $("#mw-add").addEventListener("click", openAddIdea);
    $("#mw-fab").addEventListener("click", openAddIdea);
    const evBtn = $("#mw-events");
    if (evBtn) evBtn.addEventListener("click", () => { S.view = "events"; renderShell(); });
    const rs = $("#mw-restore");
    if (rs) rs.addEventListener("click", () => {
      S.hidden.clear(); persistHidden(); render(); renderShell();
      toast("Removed cards restored", "rotate-ccw");
    });
    view.querySelectorAll(".mw-nav-btn").forEach((b) => b.addEventListener("click", () => {
      S.g = b.getAttribute("data-g"); render(); renderShell();
    }));

    render();
    $("#mw-count").textContent = allItems().length;
    $("#mw-regions").textContent = regions().length;
    $("#mw-groups").textContent = GROUPS.length;
  }

  /* ---------- idea text generator (preview platform) ---------- */
  function ideaFor(it) {
    const g = groupOf(it.g);
    const reg = regionOf(it.r);
    return `${it.n} — ${g.label}${reg !== "Global" ? " · " + reg : ""}. ${it.d ? it.d + ". " : ""}Try it as a ${g.label.toLowerCase()} idea: study top sellers, entry fees and local payment/shipping rules, then validate one product in a small paid test before scaling.`;
  }

  /* ---------- cards ---------- */
  function cardHTML(it) {
    const g = groupOf(it.g);
    const reg = regionOf(it.r);
    const saved = S.saved.has(it.id);
    const site = it.custom ? "" : domainOf(it.n, it.d);
    const host = it.custom ? "" : hostOf(it.n, it.d);
    const mainBtn = site
      ? `<a class="mw-preview" href="${site}" target="_blank" rel="noopener" title="Open ${esc(host)}">${ic("external-link", 12)} Open site</a>`
      : `<button class="mw-preview" data-pv="${it.id}">${ic("eye", 12)} Preview idea</button>`;
    const acts = `
      ${mainBtn}
      <button class="mw-icobtn" data-pv="${it.id}" title="Idea preview">${ic("eye", 13)}</button>
      <button class="mw-icobtn${saved ? " saved" : ""}" data-save="${it.id}" title="${saved ? "Saved idea" : "Save idea"}">${ic("lightbulb", 13)}</button>
      ${it.custom
        ? `<button class="mw-icobtn" data-edit="${it.id}" title="Edit idea">${ic("pencil", 13)}</button><button class="mw-icobtn del" data-del="${it.id}" title="Delete idea">${ic("trash-2", 13)}</button>`
        : `<button class="mw-icobtn del" data-hide="${it.id}" title="Remove from list">${ic("x", 13)}</button>`}`;
    return `
      <div class="mw-card" data-card="${it.id}">
        ${previewHTML(it, g, site)}
        <div class="mw-body">
          <div class="mw-headline">
            <div class="mw-logo-sm">${smallLogo(it, site)}</div>
            <div class="min-w-0">
              <h4>${esc(it.n)}</h4>
              <div class="mw-meta">${esc(host || g.label)}</div>
            </div>
          </div>
          <div class="mw-desc">${esc(it.d || "No note yet — preview for a ready idea.")}</div>
          <div class="mw-tags">
            <span class="mw-tag" style="background:${g.color}18;color:${g.color}">${ic(g.icon, 11)}${esc(g.label)}</span>
            <span class="mw-tag" style="background:rgba(11,27,51,.06);color:var(--mw-muted)">${ic("map-pin", 11)}${esc(reg)}</span>
          </div>
          <div class="mw-acts">${acts}</div>
        </div>
      </div>`;
  }

  function render() {
    const res = $("#mw-results");
    if (!res) return;
    if (S.view === "events") return renderEvents();
    const list = filtered();
    $("#mw-count").textContent = list.length;
    if (!list.length) {
      res.innerHTML = `<div class="mw-empty">${ic("search-x", 34)}<b>No ideas found</b><span>Try a different search or region — or add a marketplace idea of your own.</span></div>`;
      return;
    }
    res.innerHTML = `
      <div class="mw-grouphead">${ic("layers", 17)}<b>${S.g === "all" ? "All Markets" : esc(groupOf(S.g).label)}</b><span>${list.length} idea cards${S.r !== "all" ? " · " + esc(S.r) : ""}</span></div>
      <div class="mw-grid">${list.map(cardHTML).join("")}</div>`;

    res.querySelectorAll("[data-card]").forEach((el) => {
      el.addEventListener("click", (e) => {
        if (e.target.closest("button,a")) return;
        const id = el.getAttribute("data-card");
        const it = allItems().find((x) => x.id === id);
        if (it) openPreview(it);
      });
    });
    res.querySelectorAll("[data-pv]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const it = allItems().find((x) => x.id === b.getAttribute("data-pv"));
      if (it) openPreview(it);
    }));
    res.querySelectorAll("[data-save]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = b.getAttribute("data-save");
      const it = allItems().find((x) => x.id === id);
      if (!it) return;
      if (S.saved.has(id)) { S.saved.delete(id); toast("Idea removed from saved", "lightbulb-off"); }
      else { S.saved.add(id); toast(`Idea saved — ${it.n}`, "lightbulb"); }
      render();
    }));
    res.querySelectorAll("[data-del]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = b.getAttribute("data-del");
      const idx = IDEAS.findIndex((x) => x.id === id);
      if (idx >= 0) { IDEAS.splice(idx, 1); persistIdeas(); render(); renderShell(); toast("Idea deleted", "trash-2"); }
    }));
    res.querySelectorAll("[data-hide]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = b.getAttribute("data-hide");
      const it = DATA.items.find((x) => x.id === id);
      if (!it) return;
      S.hidden.add(id); persistHidden(); render(); renderShell();
      toast(`Removed "${it.n}" — restore it from the sidebar`, "x");
    }));
    res.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", (e) => {
      e.stopPropagation();
      const it = IDEAS.find((x) => x.id === b.getAttribute("data-edit"));
      if (it) openEditIdea(it);
    }));
    icons();
  }

  /* ---------- events view (calendar + hashtags) ---------- */
  function evTag(t) {
    if (!t) return "";
    const c = /MEGA/i.test(t) ? "#DC2626" : /HUGE|BIG|⭐⭐|BIG/i.test(t) ? "#EA580C" : /USA|EU|MENA|Asia|India|UK/.test(t) ? "#2563EB" : "#059669";
    return `<span class="ev-tag" style="color:${c};background:${c}1a">${esc(t)}</span>`;
  }

  function evMonthFilter() {
    return `<div class="ev-chips">
      <button class="ev-chip${S.month === "all" ? " active" : ""}" data-m="all">All months</button>
      ${MONTHS.map((m) => `<button class="ev-chip${S.month === m ? " active" : ""}" data-m="${m}">${m.slice(0, 3)}</button>`).join("")}
    </div>`;
  }

  function evCountryFilter() {
    const set = Array.from(new Set(EVT.countries.map((c) => c[0]))).sort();
    return `<div class="ev-chips ev-chips-row">
      <button class="ev-chip${S.ctry === "all" ? " active" : ""}" data-c="all">All regions</button>
      ${set.map((r) => `<button class="ev-chip${S.ctry === r ? " active" : ""}" data-c="${esc(r)}">${esc(r)}</button>`).join("")}
    </div>`;
  }

  /* ---------- events charts (glassmorphism) ---------- */
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  }

  function evCurveChart(totals) {
    const W = 360, H = 152, L = 12, R = 12, T = 18, B = 122;
    const plot = W - L - R;
    const max = Math.max.apply(null, totals) || 1;
    const pts = MONTHS.map((m, i) => {
      const x = +(L + (i * plot) / 11).toFixed(1);
      const y = +(B - (totals[i] / max) * (B - T - 10)).toFixed(1);
      return { x, y, m, v: totals[i] };
    });
    const curve = smoothPath(pts);
    const area = curve + ` L${pts[11].x},${B} L${pts[0].x},${B} Z`;
    const grid = [0.25, 0.5, 0.75, 1].map((f) => {
      const y = B - f * (B - T - 10);
      return `<line x1="${L}" y1="${y.toFixed(1)}" x2="${W - R}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,.07)" stroke-dasharray="3 5"/>`;
    }).join("");
    const dots = pts.map((p) => {
      const active = S.month === p.m;
      const halo = active ? `<circle class="ev-chart-halo" data-m="${p.m}" cx="${p.x}" cy="${p.y}" r="10" fill="rgba(56,189,248,.25)"/>` : "";
      return `${halo}<circle class="ev-chart-dot${active ? " active" : ""}" data-m="${p.m}" cx="${p.x}" cy="${p.y}" r="${active ? 5 : 3.2}" fill="#FFFFFF" stroke="${active ? "#22D3EE" : "#A5B4FC"}" stroke-width="${active ? 2.5 : 1.6}"><title>${p.m} · ${p.v} events</title></circle>`;
    }).join("");
    const labels = pts.map((p) => `<text x="${p.x}" y="141" text-anchor="middle" font-size="9" fill="rgba(255,255,255,.45)" font-weight="700">${p.m.slice(0, 1)}</text>`).join("");
    return `
      <div class="ev-chart">
        <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Event intensity by month">
          <defs>
            <linearGradient id="mwCurve" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#818CF8"/><stop offset=".5" stop-color="#38BDF8"/><stop offset="1" stop-color="#34D399"/>
            </linearGradient>
            <linearGradient id="mwArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#6366F1" stop-opacity=".45"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/>
            </linearGradient>
          </defs>
          ${grid}
          <line x1="${L}" y1="${B}" x2="${W - R}" y2="${B}" stroke="rgba(255,255,255,.12)" stroke-width="1"/>
          <path d="${area}" fill="url(#mwArea)"/>
          <path d="${curve}" fill="none" stroke="url(#mwCurve)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>
          ${dots}
          ${labels}
        </svg>
        <div class="ev-chart-hint">${ic("mouse-pointer-click", 11)} click a point to filter that month</div>
      </div>`;
  }

  function evDonutChart(g, c) {
    const buckets = { "MEGA": 0, "HUGE": 0, "BIG": 0, "Regional": 0, "Other": 0 };
    const colors = { "MEGA": "#F87171", "HUGE": "#FB923C", "BIG": "#FBBF24", "Regional": "#38BDF8", "Other": "#94A3B8" };
    const buck = (t) => /MEGA/i.test(t) ? "MEGA" : /HUGE/i.test(t) ? "HUGE" : /BIG|⭐/i.test(t) ? "BIG" : t ? "Regional" : "Other";
    g.forEach((e) => buckets[buck(e[4])]++);
    c.forEach((e) => buckets[buck(e[5])]++);
    const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1;
    const R = 52, CX = 70, CY = 70, C = 2 * Math.PI * R;
    const track = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="rgba(255,255,255,.09)" stroke-width="17"/>`;
    let off = 0;
    const segs = Object.keys(buckets).filter((k) => buckets[k]).map((k) => {
      const len = (buckets[k] / total) * C;
      const d = `stroke-dasharray="${len.toFixed(1)} ${(C - len).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}"`;
      off += len;
      return `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${colors[k]}" stroke-width="17" ${d} stroke-linecap="round"><title>${k} · ${buckets[k]}</title></circle>`;
    }).join("");
    const legend = Object.keys(buckets).filter((k) => buckets[k]).map((k) => `
      <span class="ev-legend-item"><i style="background:${colors[k]};box-shadow:0 0 8px ${colors[k]}"></i>${k}<b>${buckets[k]}</b><em>${Math.round((buckets[k] / total) * 100)}%</em></span>`).join("");
    return `
      <div class="ev-donut">
        <svg viewBox="0 0 140 140" role="img" aria-label="Event moment mix">
          ${track}
          ${segs}
          <text x="${CX}" y="${CY - 2}" text-anchor="middle" font-size="21" font-weight="900" fill="#FFFFFF">${total}</text>
          <text x="${CX}" y="${CY + 14}" text-anchor="middle" font-size="7.5" fill="rgba(255,255,255,.45)" font-weight="700" letter-spacing=".6">EVENTS</text>
        </svg>
        <div class="ev-legend">${legend}</div>
      </div>`;
  }

  function evBarChart(regions) {
    const max = regions[0] ? regions[0][1] : 1;
    return `<div class="ev-bars">
      ${regions.map(([r, n]) => `
      <div class="ev-bar-row${S.ctry === r ? " active" : ""}" data-c="${esc(r)}">
        <span class="ev-bar-lbl">${esc(r)}</span>
        <div class="ev-bar-track"><div class="ev-bar-fill" style="width:${Math.max(4, Math.round((n / max) * 100))}%"></div></div>
        <span class="ev-bar-val">${n}</span>
      </div>`).join("")}
      <div class="ev-chart-hint">${ic("mouse-pointer-click", 11)} click a bar to filter that region</div>
    </div>`;
  }

  function evDate(m, d) {
    if (!d) return m.slice(0, 3);
    if (d === "varies") return m.slice(0, 3) + " · varies";
    return m.slice(0, 3) + " " + d;
  }

  function renderEvents() {
    const res = $("#mw-results");
    if (!res) return;

    const q = S.q.trim().toLowerCase();
    const mono = (m) => MONTHS.indexOf(m);
    const gSort = (a, b) => {
      const am = mono(a[0]), bm = mono(b[0]);
      return (am === -1 ? 99 : am) - (bm === -1 ? 99 : bm) || String(a[3]).localeCompare(String(b[3]));
    };
    const cSort = (a, b) => {
      const ra = String(a[0]).localeCompare(String(b[0]));
      if (ra) return ra;
      const am = mono(a[1]), bm = mono(b[1]);
      return (am === -1 ? 99 : am) - (bm === -1 ? 99 : bm) || String(a[3]).localeCompare(String(b[3]));
    };

    let g = EVT.global.slice().sort(gSort).filter((e) => (S.month === "all" || e[0] === S.month) && (!q || (e[1] + " " + e[2] + " " + e[3] + " " + e[4] + " " + e[0]).toLowerCase().includes(q)));
    let c = EVT.countries.slice().sort(cSort).filter((e) => (S.ctry === "all" || e[0] === S.ctry) && (S.month === "all" || e[1] === S.month) && (!q || (e[0] + " " + e[1] + " " + e[2] + " " + e[3] + " " + e[4] + " " + e[5]).toLowerCase().includes(q)));
    let isl = EVT.islamic.slice().filter((e) => !q || (e[0] + " " + e[1] + " " + e[2] + " " + e[3]).toLowerCase().includes(q));
    let ht = EVT.hashtags.slice().filter((e) => !q || (e[0] + " " + e[1]).toLowerCase().includes(q));

    const monthTotals = MONTHS.map((m) => EVT.global.filter((e) => e[0] === m).length + EVT.countries.filter((e) => e[1] === m).length);
    const regionCounts = {};
    EVT.countries.forEach((e) => { regionCounts[e[0]] = (regionCounts[e[0]] || 0) + 1; });
    const topRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const dash = `
      <div class="ev-dash">
        <div class="ev-chart-card">
          <div class="ev-chart-head">${ic("trending-up", 14)}<b>Event intensity</b><span>by month · world + country calendars</span></div>
          ${evCurveChart(monthTotals)}
        </div>
        <div class="ev-chart-card">
          <div class="ev-chart-head">${ic("pie-chart", 14)}<b>Moment mix</b><span>weight of events in view</span></div>
          ${evDonutChart(g, c)}
        </div>
        <div class="ev-chart-card">
          <div class="ev-chart-head">${ic("bar-chart-3", 14)}<b>Top regions</b><span>calendar events per region</span></div>
          ${evBarChart(topRegions)}
        </div>
      </div>`;

    const hashtagBox = `
      <div class="ev-sec">
        <div class="ev-sec-head">${ic("hash", 16)}<b>Chinese Search Hashtags</b><span>Save these — use in titles, ads and product pages for the China market</span></div>
        <div class="ev-hashtags">${ht.map((h) => `<span class="ev-hashtag"><b>${esc(h[0])}</b><i>${esc(h[1])}</i></span>`).join("")}</div>
      </div>`;

    const globalBox = `
      <div class="ev-sec">
        <div class="ev-sec-head">${ic("calendar-days", 16)}<b>Global Events</b><span>Apply worldwide — plan stock, ads and content around these spikes</span></div>
        ${evMonthFilter()}
        <div class="ev-pills">
          ${g.map((e) => `<span class="ev-pill" title="${esc(e[3])}"><i>${esc(evDate(e[0], e[1]))}</i><b>${esc(e[2])}</b>${evTag(e[4])}</span>`).join("") || `<div class="ev-empty">No events for this filter.</div>`}
        </div>
      </div>`;

    const islamicBox = `
      <div class="ev-sec">
        <div class="ev-sec-head">${ic("moon", 16)}<b>Islamic / MENA Calendar</b><span>Lunar dates change yearly — verify exact dates on IslamicFinder.org. Ramadan alone can drive 30-50% of yearly revenue for some niches.</span></div>
        <div class="ev-cards">
          ${isl.map((e) => `
          <div class="ev-card">
            <div class="ev-card-t">${esc(e[0])} ${evTag(e[1].includes("30") ? "MEGA" : "HUGE")}</div>
            <div class="ev-card-w">${esc(e[1])}</div>
            <div class="ev-card-n">${esc(e[2])}</div>
            <div class="ev-card-p">${esc(e[3])}</div>
          </div>`).join("") || `<div class="ev-empty">No events for this filter.</div>`}
        </div>
      </div>`;

    const grouped = {};
    c.forEach((e) => { (grouped[e[0]] = grouped[e[0]] || []).push(e); });
    const countryBox = `
      <div class="ev-sec">
        <div class="ev-sec-head">${ic("globe", 16)}<b>Country Calendars</b><span>KSA · UAE · Egypt · Morocco · Algeria · Tunisia · Türkiye · USA · Europe · China · India · SEA · LATAM</span></div>
        ${evCountryFilter()}
        ${Object.keys(grouped).length ? Object.entries(grouped).map(([region, evs]) => `
        <div class="ev-region">
          <div class="ev-region-head">${ic("map-pin", 13)}<b>${esc(region)}</b><span>${evs.length} event${evs.length === 1 ? "" : "s"}</span></div>
          <div class="ev-pills">
            ${evs.map((e) => `<span class="ev-pill" title="${esc(e[4])}"><i>${esc(evDate(e[1], e[2]))}</i><b>${esc(e[3])}</b>${evTag(e[5])}</span>`).join("")}
          </div>
        </div>`).join("") : `<div class="ev-empty">No events for this filter.</div>`}
      </div>`;

    res.innerHTML = `${dash}${hashtagBox}${globalBox}${islamicBox}${countryBox}`;

    res.querySelectorAll("[data-m]").forEach((b) => b.addEventListener("click", () => {
      S.month = b.getAttribute("data-m"); renderEvents();
    }));
    res.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => {
      S.ctry = S.ctry === b.getAttribute("data-c") ? "all" : b.getAttribute("data-c"); renderEvents();
    }));
    icons();
    $("#mw-count").textContent = g.length + c.length + isl.length + ht.length;
    $("#mw-regions").textContent = new Set(EVT.countries.map((x) => x[0])).size;
    $("#mw-groups").textContent = EVT.countries.length + EVT.global.length + EVT.islamic.length + EVT.hashtags.length;
  }

  /* ---------- preview modal ---------- */
  function openPreview(it) {
    const g = groupOf(it.g);
    const reg = regionOf(it.r);
    const site = it.custom ? "" : domainOf(it.n, it.d);
    const host = it.custom ? "" : hostOf(it.n, it.d);
    const body = `
      <div class="mw-pv-head">
        <div class="mw-pv-fav" style="background:linear-gradient(140deg,${g.color},${g.color}cc)">${faviconHTML(it, site)}</div>
        <div class="min-w-0">
          <div class="mw-pv-name">${esc(it.n)}</div>
          <div class="mw-pv-sub">${esc(g.label)}${reg !== "Global" ? " · " + esc(reg) : ""}</div>
        </div>
      </div>
      <div class="mw-pv-desc">${esc(it.d || "No note yet.")}</div>
      <div class="mw-pv-rows">
        <div class="pr"><b>Category</b><span>${esc(g.label)}</span></div>
        <div class="pr"><b>Region</b><span>${esc(reg)}</span></div>
        ${site ? `<div class="pr"><b>Website</b><span>${esc(host)}</span></div>` : ""}
        ${it.custom ? `<div class="pr"><b>Source</b><span>Your idea</span></div>` : ""}
      </div>
      <div class="mw-pv-idea"><b>💡 Idea preview</b>${esc(ideaFor(it))}</div>`;
    const footer = `
      ${site ? `<a class="mw-btn primary" href="${site}" target="_blank" rel="noopener">${ic("external-link", 13)} Open website</a>` : ""}
      <button class="mw-btn" onclick="document.getElementById('mw-modal').classList.remove('open')">Close</button>`;
    openModal("Preview · " + it.n, body, footer);
  }

  /* ---------- add idea modal ---------- */
  function openAddIdea() {
    const body = `
      <div class="mw-field"><label>Platform name</label><input id="ai-name" placeholder="e.g. Jumia Algeria"></div>
      <div class="mw-field"><label>Category</label><select id="ai-group">${GROUPS.map((g) => `<option value="${g.id}">${esc(g.label)}</option>`).join("")}</select></div>
      <div class="mw-field"><label>Region</label><input id="ai-region" placeholder="e.g. Algeria · or Global" list="mw-region-list"><datalist id="mw-region-list">${regions().map((r) => `<option value="${esc(r)}">`).join("")}</datalist></div>
      <div class="mw-field"><label>Note / idea</label><textarea id="ai-desc" placeholder="What makes it interesting? Product angles, fees, shipping, local quirks…"></textarea></div>`;
    const footer = `
      <button class="mw-btn" onclick="document.getElementById('mw-modal').classList.remove('open')">Cancel</button>
      <button class="mw-btn primary" id="ai-save">${ic("plus", 13)} Add idea</button>`;
    openModal("Add marketplace idea", body, footer);
    const save = $("#ai-save");
    if (save) save.addEventListener("click", () => {
      const n = $("#ai-name").value.trim();
      if (!n) { toast("Platform name is required", "alert-triangle"); return; }
      const g = $("#ai-group").value;
      const r = $("#ai-region").value.trim() || "Global";
      const d = $("#ai-desc").value.trim();
      IDEAS.unshift({ id: uid(), g, r, n, d });
      persistIdeas();
      closeModal();
      render(); renderShell();
      toast("Idea added — " + n, "lightbulb");
    });
  }

  function openEditIdea(it) {
    const body = `
      <div class="mw-field"><label>Platform name</label><input id="ai-name" value="${esc(it.n)}"></div>
      <div class="mw-field"><label>Category</label><select id="ai-group">${GROUPS.map((g) => `<option value="${g.id}"${g.id === it.g ? " selected" : ""}>${esc(g.label)}</option>`).join("")}</select></div>
      <div class="mw-field"><label>Region</label><input id="ai-region" value="${esc(it.r)}" list="mw-region-list"><datalist id="mw-region-list">${regions().map((r) => `<option value="${esc(r)}">`).join("")}</datalist></div>
      <div class="mw-field"><label>Note / idea</label><textarea id="ai-desc">${esc(it.d || "")}</textarea></div>`;
    const footer = `
      <button class="mw-btn" onclick="document.getElementById('mw-modal').classList.remove('open')">Cancel</button>
      <button class="mw-btn primary" id="ai-save">${ic("check", 13)} Save changes</button>`;
    openModal("Edit idea · " + it.n, body, footer);
    const save = $("#ai-save");
    if (save) save.addEventListener("click", () => {
      const n = $("#ai-name").value.trim();
      if (!n) { toast("Platform name is required", "alert-triangle"); return; }
      const idx = IDEAS.findIndex((x) => x.id === it.id);
      if (idx < 0) return;
      IDEAS[idx].n = n;
      IDEAS[idx].g = $("#ai-group").value;
      IDEAS[idx].r = $("#ai-region").value.trim() || "Global";
      IDEAS[idx].d = $("#ai-desc").value.trim();
      persistIdeas();
      closeModal();
      render(); renderShell();
      toast("Idea updated — " + n, "check");
    });
  }

  /* ---------- modal helpers ---------- */
  function openModal(title, body, footer) {
    let box = document.getElementById("mw-modal");
    if (!box) {
      box = document.createElement("div");
      box.className = "mw-modal";
      box.id = "mw-modal";
      document.body.appendChild(box);
    }
    box.innerHTML = `
      <div class="mw-modal-box">
        <h3>${ic("sparkles", 16)} ${title}</h3>
        <div>${body}</div>
        <div class="mw-modal-acts">${footer || ""}</div>
      </div>`;
    box.classList.add("open");
    box.addEventListener("click", (e) => { if (e.target === box) closeModal(); });
    icons();
    const first = box.querySelector("input, textarea, select");
    if (first) setTimeout(() => first.focus(), 60);
    return box;
  }
  function closeModal() { const b = document.getElementById("mw-modal"); if (b) b.classList.remove("open"); }

  /* ---------- boot ---------- */
  function boot() {
    IDEAS.length = 0;
    IDEAS.push.apply(IDEAS, loadIdeas());
    loadHidden().forEach((id) => S.hidden.add(id));
    DATA.items.forEach((i) => S.saved.add(i.id));
    renderShell();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
