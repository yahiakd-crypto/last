/* ============================================================
   PUNCHLINE — shared shell + UI kit (vanilla JS, no frameworks)
   Injects the top navigation into every page's <header class="site-nav">
   <div id="app-nav"></div>, and exposes a small window.PL kit the
   page scripts use. Loaded after data.js / charts.js / api.js.
   ============================================================ */
(function () {
  "use strict";

  const NAV = [
    { id: "index", path: "/", icon: "layout-dashboard", label: "Dashboard (Board OS)" },
    { id: "products", path: "products.html", icon: "package", label: "Products" },
    { id: "brand", path: "brand.html", icon: "badge-check", label: "Brand" },
    { id: "personas", path: "personas.html", icon: "users", label: "Personas" },
    { id: "strategy", path: "strategy.html", icon: "target", label: "Strategy" },
    { id: "fbads", path: "fb-ads.html", icon: "flag", label: "FB Ads Strategy" },
    { id: "creative", path: "creative-lab.html", icon: "palette", label: "Creative Lab" },
    { id: "adideas", path: "ad-ideas.html", icon: "lightbulb", label: "Ad Creative Ideas" },
    { id: "campaigns", path: "campaigns.html", icon: "megaphone", label: "Campaigns" },
    { id: "landings", path: "landing.html", icon: "layout-template", label: "Landing Pages" },
    { id: "marketworld", path: "market-world.html", icon: "globe", label: "Market in the World" },
    { id: "adcritic", path: "ad-critic.html", icon: "scan-eye", label: "Ad Critic" },
    { id: "reports", path: "reports.html", icon: "file-text", label: "Reports" },
    { id: "settings", path: "settings.html", icon: "sliders-horizontal", label: "Settings" },
  ];

  function current() {
    return (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  function icon(name, size) {
    return `<i data-lucide="${name}" style="width:${size || 18}px;height:${size || 18}px"></i>`;
  }

  /* ---------- Nav ---------- */
  function injectNav() {
    const host = document.getElementById("app-nav");
    if (!host) return;
    const here = current();

    const brand = `<div class="logo-wrap">
        <button class="logo" id="btn-logo" type="button" aria-haspopup="true" aria-expanded="false" title="Open services menu">
          <span class="brand-tile">P</span>
          <span class="logo-word">Punch<em>line</em></span>
          <span class="logo-caret">${icon("chevron-down", 15)}</span>
        </button>
        <div class="logo-menu" id="logo-menu" role="menu" aria-label="Services"></div>
      </div>`;

    const center = `<nav class="nav-group" aria-label="Main">
        ${NAV.map((n) => `<a href="${n.path}" class="nav-btn${here === n.path ? " active" : ""}" title="${n.label}">${icon(n.icon, 19)}</a>`).join("")}
        <button class="nav-btn chat" id="btn-chat" title="Talk to the AI assistant">${icon("bot-message-square", 19)}</button>
      </nav>`;

    const right = `<div class="nav-right">
        <div class="direct-mode-pill" style="display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border-radius:10px;background:#EAFBF1;border:1px solid #BCEFD0;color:#0E7A43;font-size:11.5px;font-weight:700" title="This page is loaded directly as a top-level document with zero iframes. Google AI Studio's native Edit button targets individual elements directly.">
          <span style="width:7px;height:7px;border-radius:50%;background:#22C55E;box-shadow:0 0 6px #22C55E"></span>
          <span>Direct Page (Studio Edit Mode)</span>
        </div>
        <a href="/?view=cloned-app&url=${encodeURIComponent(here)}" class="nav-preview-switch" style="font-size:11.5px;font-weight:600;color:#64748B;text-decoration:none;padding:5px 10px;border-radius:9px;border:1px solid #E2E8F0;background:#fff;display:inline-flex;align-items:center;gap:4px;transition:all .15s" title="Switch back to Normal Preview in React shell">
          Normal Preview
        </a>
        <button class="icon-btn edit-mode-btn" id="btn-inspect-edit" title="Select & Edit Any Element (for Google AI Studio)" style="color:#0FA05A;background:#EDFBF2;border:1px solid #BCEFD0;width:auto;padding:0 10px;border-radius:12px;display:flex;align-items:center;gap:5px;font-weight:700;font-size:12px;cursor:pointer">
          ${icon("crosshair", 15)} <span class="hidden md:inline">Edit</span>
        </button>
        <button class="icon-btn" id="btn-refresh" title="Refresh data">${icon("refresh-cw", 17)}</button>
        <button class="icon-btn" id="btn-notify" title="Notifications">${icon("bell", 17)}
          <span class="dot-status on" style="position:absolute;transform:translate(10px,-12px)"></span>
        </button>
        <div class="avatar-wrap">
          <button class="avatar" id="btn-avatar" title="Account">${avatarInner()}</button>
        </div>
      </div>`;

    host.innerHTML = brand + center + right;

    const editBtn = document.getElementById("btn-inspect-edit");
    if (editBtn) editBtn.addEventListener("click", () => toggleElementInspector());
    document.getElementById("btn-chat").addEventListener("click", openChat);

    document.getElementById("btn-refresh").addEventListener("click", function () {
      this.classList.add("spinning");
      setTimeout(() => this.classList.remove("spinning"), 900);
      toast("Data refreshed", "refresh-cw");
    });

    document.getElementById("btn-notify").addEventListener("click", () => {
      modal({
        title: "Notifications",
        body: `
          <div class="flex flex-col gap-3">
            <div class="flex items-start gap-3"><span class="dot-status on" style="margin-top:7px"></span>
              <div><div class="font-semibold text-[13.5px]">Creative test #4 reached significance</div>
              <div class="muted">Hook A (problem) won at 95% confidence · 6 min ago</div></div></div>
            <div class="flex items-start gap-3"><span class="dot-status warn" style="margin-top:7px"></span>
              <div><div class="font-semibold text-[13.5px]">CPA budget alert</div>
              <div class="muted">Campaign 2 (Audience Testing) spent 80% of daily cap · 1 hr ago</div></div></div>
            <div class="flex items-start gap-3"><span class="dot-status on" style="margin-top:7px"></span>
              <div><div class="font-semibold text-[13.5px]">Analysis completed</div>
              <div class="muted">EmberFlow product analysis finished · 2 hrs ago</div></div></div>
          </div>`,
      });
    });
  }

  /* ---------- Profile / account menu ---------- */
  const PROFILE_STORE = "pl.profile";

  function loadProfile() {
    try { return JSON.parse(localStorage.getItem(PROFILE_STORE) || "{}") || {}; } catch (e) { return {}; }
  }

  function saveProfile(p) {
    localStorage.setItem(PROFILE_STORE, JSON.stringify(p));
  }

  function avatarInner() {
    const p = loadProfile();
    if (p.image) return `<img src="${esc(p.image)}" alt="profile">`;
    return esc(p.name ? initials(p.name) : "YA");
  }

  function renderAccountMenu() {
    const p = loadProfile();
    const menu = document.getElementById("profile-menu");
    if (!menu) return;
    menu.innerHTML = `
      <div class="profile-head">
        <div class="profile-avatar" id="menu-avatar">${avatarInner()}</div>
        <div>
          <div class="profile-name" id="menu-name">${esc(p.name || "Guest User")}</div>
          <div class="profile-email" id="menu-email">${esc(p.email || "guest@punchline.app")}</div>
        </div>
      </div>
      <div class="profile-row">
        <label>Name</label>
        <input id="pf-name" value="${esc(p.name || "")}" placeholder="Your name">
      </div>
      <div class="profile-row">
        <label>Email</label>
        <input id="pf-email" value="${esc(p.email || "")}" placeholder="you@email.com">
      </div>
      <button class="menu-btn" id="pf-change-image">${icon("camera", 14)} Change profile image</button>
      <button class="menu-btn" id="pf-save">${icon("save", 14)} Save account</button>
      <button class="menu-btn red" id="pf-signout">${icon("log-out", 14)} Sign out</button>`;
  }

  function buildAccountMenu() {
    const wrap = document.querySelector("#app-nav .avatar-wrap");
    if (!wrap) return;

    const menu = document.createElement("div");
    menu.className = "profile-menu";
    menu.id = "profile-menu";
    wrap.appendChild(menu);

    const file = document.createElement("input");
    file.type = "file";
    file.id = "profile-file";
    file.className = "hidden";
    file.accept = "image/*";
    document.body.appendChild(file);

    const av = document.getElementById("btn-avatar");
    if (av) {
      av.addEventListener("click", (e) => {
        e.stopPropagation();
        renderAccountMenu();
        menu.classList.toggle("open");
      });
    }

    menu.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", (e) => {
      const wrapEl = document.querySelector("#app-nav .avatar-wrap");
      if (wrapEl && !wrapEl.contains(e.target)) menu.classList.remove("open");
    });

    menu.addEventListener("click", (e) => {
      const btn = e.target.closest(".menu-btn");
      if (!btn) return;
      if (btn.id === "pf-change-image") {
        file.click();
      } else if (btn.id === "pf-save") {
        const p = loadProfile();
        p.name = document.getElementById("pf-name").value.trim();
        p.email = document.getElementById("pf-email").value.trim();
        saveProfile(p);
        renderAccountMenu();
        syncAvatar();
        menu.classList.remove("open");
        toast("Account saved", "check-circle");
      } else if (btn.id === "pf-signout") {
        menu.classList.remove("open");
        toast("Signed out (demo)", "log-out");
      }
    });

    file.addEventListener("change", () => {
      const f = file.files[0];
      if (!f) return;
      if (!/^image\/(png|jpe?g|gif|webp)/.test(f.type)) {
        toast("Please choose a PNG or JPEG image", "alert-triangle");
        return;
      }
      if (f.size > 2 * 1024 * 1024) {
        toast("Image is too large — keep it under 2 MB", "alert-triangle");
        return;
      }
      const rd = new FileReader();
      rd.onload = () => {
        const p = loadProfile();
        p.image = rd.result;
        saveProfile(p);
        syncAvatar();
        toast("Profile picture updated", "check-circle");
      };
      rd.readAsDataURL(f);
      file.value = "";
    });
  }

  function syncAvatar() {
    const av = document.getElementById("btn-avatar");
    if (av) av.innerHTML = avatarInner();
    const mv = document.getElementById("menu-avatar");
    if (mv) mv.innerHTML = avatarInner();
  }

  /* ---------- Logo services menu ---------- */
  const FB_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z"/></svg>';

  const LOGO_MENU = [
    { label: "COD", desc: "Cash on Delivery", icon: "package", href: "cod.html" },
    { label: "FACEBOOK", desc: "Facebook Ads & Marketing", icon: "facebook", href: "fb-ads.html" },
    { label: "ERP", desc: "ERP & Business Management", icon: "layout-dashboard", href: "erp.html" },
    { label: "PRODUCTS", desc: "AI Winning Product Intelligence Center", icon: "shopping-bag", href: "product22.html" },
    { label: "BREAKDOWN", desc: "COD Margin & CPA Calculator", icon: "calculator", href: "breakdown.html" },
    { label: "ANALYTICS", desc: "Analytics & Performance", icon: "chart-column", href: "reports.html" },
    { label: "AI TOOLS", desc: "AI Tools & Automation", icon: "sparkles", href: "ai-tools.html" },
    { label: "BUILDER LP", desc: "Image Sections → Landing Page → PNG/WebP", icon: "layout-template", href: "builder-lp.html" },
    { label: "GLOBALE SOURCING", desc: "Worldwide Sourcing, Wholesale & Fulfillment Intelligence", icon: "globe-2", href: "global-sourcing.html" },
    { label: "MARKET IN THE WORLD", desc: "Idea Preview Platform · Marketplaces, B2B, Auctions, Fulfillment, Dropshipping, China Sourcing & Discovery", icon: "globe", href: "market-world.html" },
    { label: "STRATEGY MARKETING", desc: "Ecommerce Buyer Persona & Marketing Strategy Guide", icon: "target", href: "strategy-marketing.html" },
    { label: "LP", desc: "AI Landing Page Builder · Chat + Live Preview", icon: "layout", href: "lp.html" },
    { label: "DATA BASE", desc: "Customer Data AI · Database, 360, Segments & Audiences", icon: "database", href: "customer-data.html" },
    { label: "NOTE", desc: "Note Dock · Sidebar Notes + Infinite Mind-Map Canvas", icon: "sticky-note", href: "notes.html" },
    { label: "LARKTAB", desc: "Saved Websites Hub · all your platforms as idea cards", icon: "bookmark", href: "larktab.html" },
    { label: "AD LIBRARY", desc: "Facebook Ads & Product Intelligence", icon: "megaphone", href: "ad-library.html" },
    { label: "CHAT AI PRO", desc: "Ecom AI Command Center · Chat + Live Workspace", icon: "bot", href: "chat-ai-pro.html" },
    { label: "BOARD OS", desc: "Main Interactive Canvas & Product Intelligence OS", icon: "layout-grid", href: "/" },
  ];

  function buildLogoMenu() {
    const wrap = document.querySelector("#app-nav .logo-wrap");
    const btn = wrap ? wrap.querySelector("#btn-logo") : null;
    const menu = wrap ? wrap.querySelector("#logo-menu") : null;
    if (!wrap || !btn || !menu) return;

    menu.innerHTML = LOGO_MENU.map((m) => `
      <a class="logo-menu-item" href="${m.href}" role="menuitem">
        <span class="logo-menu-icon">${m.icon === "facebook" ? FB_SVG : icon(m.icon, 18)}</span>
        <span class="logo-menu-copy">
          <span class="logo-menu-title">${m.label}</span>
          <span class="logo-menu-desc">${m.desc}</span>
        </span>
      </a>`).join("");
    if (window.lucide) lucide.createIcons();

    const close = () => {
      menu.classList.remove("open");
      wrap.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle("open");
      wrap.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      const anyWrap = document.querySelector("#app-nav .logo-wrap");
      if (anyWrap && !anyWrap.contains(e.target)) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Chat assistant panel ---------- */
  const chatThread = [];

  function openChat() {
    let panel = document.getElementById("pl-chat");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "chat-panel";
      panel.id = "pl-chat";
      panel.innerHTML = `
        <div class="chat-head">
          <div class="chat-head-brand">
            <span class="brand-tile" style="width:30px;height:30px;font-size:14px">P</span>
            <div>
              <div class="chat-title">Punchline AI Assistant</div>
              <div class="chat-sub" id="chat-status">Ask anything about the product, ads, or strategy</div>
            </div>
          </div>
          <div class="chat-head-right">
            <select class="chat-model" id="chat-model" title="Choose the AI model to talk to"><option value="">Auto · pick per task</option></select>
            <button class="icon-btn" id="btn-chat-close" title="Close">${icon("x", 17)}</button>
          </div>
        </div>
        <div class="chat-body" id="chat-body">
          <div class="chat-msg bot"><div class="bubble">Hi! I'm the Punchline assistant. Ask me about EmberFlow, your campaigns, ad copy or strategy — or paste any product and I'll dig in.</div></div>
        </div>
        <div class="chat-foot">
          <textarea id="chat-input" rows="1" placeholder="Message the assistant…"></textarea>
          <button class="btn btn-primary btn-sm flex-none" id="btn-chat-send">${icon("send", 15)}</button>
        </div>`;
      document.body.appendChild(panel);
      panel.querySelector("#btn-chat-close").addEventListener("click", closeChat);
      panel.querySelector("#btn-chat-send").addEventListener("click", sendChat);
      const input = panel.querySelector("#chat-input");
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); }
      });
      input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 160) + "px"; });
      panel.querySelector("#chat-model").addEventListener("change", (e) => {
        localStorage.setItem("pl-chat-model", e.target.value);
      });
    }
    panel.classList.add("open");
    loadChatModels();
    setTimeout(() => panel.querySelector("#chat-input").focus(), 80);
  }

  /* Load the model picker from the APIs added in Settings. */
  async function loadChatModels() {
    const sel = document.getElementById("chat-model");
    if (!sel) return;
    const prev = sel.dataset.loaded;
    if (prev) return; // already loaded once per page
    const s = await PL_API.settings();
    const saved = s.providers ? Object.entries(s.providers).filter(([, v]) => v.keyMasked) : [];
    let opts = [`<option value="">Auto · pick per task</option>`];
    for (const [id] of saved) {
      const res = await PL_API.models(id);
      if (!res.ok) continue;
      const label = res.provider || id;
      opts.push(`<option value="${id}::">${PL.esc(label)} · default model</option>`);
      const shown = res.models.slice(0, 40);
      for (const m of shown) {
        opts.push(`<option value="${id}::${PL.esc(m)}">${PL.esc(label)} · ${PL.esc(m)}</option>`);
      }
      if (res.models.length > 40) {
        opts.push(`<option value="${id}::">… ${res.models.length - 40} more on ${PL.esc(label)} — pick default</option>`);
      }
    }
    sel.innerHTML = opts.join("");
    const savedVal = localStorage.getItem("pl-chat-model");
    if (savedVal && Array.from(sel.options).some((o) => o.value === savedVal)) sel.value = savedVal;
    sel.dataset.loaded = "1";
  }

  function closeChat() {
    const p = document.getElementById("pl-chat");
    if (p) p.classList.remove("open");
  }

  function addChatMsg(role, html) {
    const body = document.getElementById("chat-body");
    if (!body) return null;
    const div = document.createElement("div");
    div.className = "chat-msg " + role;
    div.innerHTML = `<div class="bubble">${html}</div>`;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
    return div;
  }

  async function sendChat() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    input.style.height = "auto";
    addChatMsg("user", esc(text));
    chatThread.push({ role: "user", content: text });

    const sel = document.getElementById("chat-model");
    const selVal = sel ? sel.value : "";
    const [provider, model] = selVal.split("::");
    const status = document.getElementById("chat-status");
    const typing = addChatMsg("bot", `<span class="typing"><i></i><i></i><i></i></span> Thinking…`);
    status.textContent = provider && provider !== "" ? `Talking to ${provider}…` : "Thinking…";

    const res = await PL_API.chat(chatThread, provider ? { provider, model: model || undefined } : {});
    if (typing) typing.remove();
    if (res && res.ok) {
      chatThread.push({ role: "assistant", content: res.reply });
      const meta = res.meta || {};
      addChatMsg("bot", esc(res.reply).replace(/\n/g, "<br>")
        + `<div class="chat-meta">${meta.provider === "demo" ? "demo · no working key" : `via ${esc(meta.provider)} · ${esc(meta.model)} · ${meta.latency}`}</div>`);
      status.textContent = meta.provider === "demo" ? "Demo mode — no working API key" : `Answered via ${meta.provider} · ${meta.model}`;
    } else {
      const err = (res && res.error) || "Couldn't reach the server — is it running on port 3000?";
      addChatMsg("bot", `<span style="color:#C93A3F">${esc(err)}</span>`);
      status.textContent = provider ? `Model failed — pick another one` : "Connection failed";
    }
    if (window.lucide) lucide.createIcons();
  }

  /* ---------- Small UI kit ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function fmt(n) {
    if (n == null || isNaN(n)) return "—";
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
  }

  function money(n) {
    if (n == null || isNaN(n)) return "—";
    const v = Math.round(Number(n) * 100) / 100;
    return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: v < 100 ? 2 : 0 });
  }

  function pct(n, d) {
    if (n == null || isNaN(n)) return "—";
    return Number(n).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d }) + "%";
  }

  function initials(name) {
    return (name || "?").split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  }

  function toast(msg, iconName) {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `${iconName ? icon(iconName) : ""}<span>${msg}</span>`;
    document.body.appendChild(el);
    if (window.lucide) lucide.createIcons();
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 2800);
  }

  function modal({ title, body, footer, wide }) {
    let box = document.getElementById("pl-modal");
    if (!box) {
      box = document.createElement("div");
      box.className = "modal";
      box.id = "pl-modal";
      document.body.appendChild(box);
    }
    box.innerHTML = `
      <div class="modal-box relative${wide ? "" : ""}" style="${wide ? "max-width:860px" : ""}">
        <button class="icon-btn close-x" onclick="document.getElementById('pl-modal').classList.remove('open')">
          <i data-lucide="x" style="width:16px;height:16px"></i>
        </button>
        ${title ? `<h3 class="text-[17px] font-bold text-[#1C1C1E] mb-1">${title}</h3>` : ""}
        <div class="mt-3">${body}</div>
        ${footer ? `<div class="flex justify-end gap-2 mt-5">${footer}</div>` : ""}
      </div>`;
    box.classList.add("open");
    box.addEventListener("click", (e) => { if (e.target === box) box.classList.remove("open"); });
    if (window.lucide) lucide.createIcons();
    return box;
  }

  function closeModal() {
    const box = document.getElementById("pl-modal");
    if (box) box.classList.remove("open");
  }

  function notify(title, bodyHtml) {
    return modal({ title, body: bodyHtml });
  }

  function pageHeader(title, subtitle, actionsHtml) {
    return `
      <div class="flex flex-wrap items-end justify-between gap-4 mb-5">
        <div>
          <h1 class="text-[24px] font-extrabold tracking-tight text-[#1C1C1E]">${title}</h1>
          ${subtitle ? `<p class="text-[13.5px] text-[#8A8A92] mt-1 max-w-[680px]">${subtitle}</p>` : ""}
        </div>
        ${actionsHtml ? `<div class="flex items-center gap-2 flex-wrap">${actionsHtml}</div>` : ""}
      </div>`;
  }

  function card({ title, icon, sub, action, body, className }) {
    return `
      <div class="card ${className || ""}">
        <div class="card-head">
          ${icon ? `<span class="icon-tile ${(icon.tone || "green-soft")}">${iconSvg2(icon.name, 17)}</span>` : ""}
          <div class="flex-1 min-w-0">
            <div class="card-title">${title}</div>
            ${sub ? `<div class="card-sub">${sub}</div>` : ""}
          </div>
          ${action ? `<div class="flex items-center gap-2 flex-none">${action}</div>` : ""}
        </div>
        ${body || ""}
      </div>`;
  }

  function iconSvg2(name, size) { return icon(name, size); }

  function scoreRow(label, score, color) {
    const p = Math.max(0, Math.min(100, Math.round((score / 10) * 100)));
    return `
      <div class="flex items-center gap-3 py-1.5">
        <span class="text-[13px] text-[#3F3F46] w-[40%] flex-none">${label}</span>
        <div class="bar thin">${score != null ? `<i style="width:${p}%;${color ? `background:${color}` : ""}"></i>` : ""}</div>
        <span class="text-[13px] font-bold text-[#1C1C1E] w-9 text-right flex-none">${score != null ? score + "/10" : "—"}</span>
      </div>`;
  }

  function pill(text, tone, withDot) {
    return `<span class="pill ${tone || "gray"}">${withDot ? `<span class="dot"></span>` : ""}${esc(text)}</span>`;
  }

  function tag(text) {
    return `<span class="tag">${esc(text)}</span>`;
  }

  function barRow(label, pctVal, color) {
    return `
      <div class="flex items-center gap-3 py-1.5">
        <span class="text-[13px] text-[#3F3F46] w-[40%] flex-none truncate">${label}</span>
        <div class="bar thin">${pctVal != null ? `<i style="width:${Math.max(0, Math.min(100, pctVal))}%;${color ? `background:${color}` : ""}"></i>` : ""}</div>
        <span class="text-[13px] font-bold text-[#1C1C1E] w-11 text-right flex-none">${pctVal != null ? pctVal + "%" : "—"}</span>
      </div>`;
  }

  function thumb(label, hue, tall) {
    const c = hue || "#3DDC72";
    return `<div class="rounded-xl overflow-hidden flex items-center justify-center font-bold text-white text-[11px] tracking-wide" style="background:linear-gradient(140deg,#1C1C1E,#2F2F33);${tall ? "min-height:96px" : "min-height:72px"}">
      <span class="px-2 text-center leading-tight">${esc(label)}</span><span style="width:5px;height:5px;border-radius:50%;background:${c};display:inline-block;margin-left:5px"></span>
    </div>`;
  }

  /* Swap a broken <img> back to the initials thumb. */
  function fallbackThumb(el) {
    if (!el) return;
    const d = document.createElement("div");
    d.className = "rounded-xl w-14 h-14 overflow-hidden flex items-center justify-center font-bold text-white text-[11px] tracking-wide";
    d.style.background = "linear-gradient(140deg,#1C1C1E,#2F2F33)";
    d.textContent = ((el.getAttribute("alt") || "P").slice(0, 2) || "P").toUpperCase();
    el.replaceWith(d);
  }

  /* Parse AI JSON output (tolerates ```json fences and trailing prose). */
  function parseJSON(str) {
    if (!str) return null;
    if (typeof str === "object") return str;
    try {
      const cleaned = String(str).replace(/```json/gi, "").replace(/```/g, "").trim();
      const start = cleaned.indexOf("{");
      return start >= 0 ? JSON.parse(cleaned.slice(start)) : null;
    } catch (e) { return null; }
  }

  /* Carry the analyzed product across workflow pages (Products -> Brand -> ...). */
  const PRODUCT_STORE = "pl.product";
  function saveProduct(data) {
    if (!data) return;
    try {
      localStorage.setItem(PRODUCT_STORE, JSON.stringify({
        savedAt: Date.now(),
        product: data.product || {},
        facts: data.facts || [],
        solves: data.solves || [],
        unknowns: data.unknowns || [],
      }));
    } catch (e) { /* ignore */ }
  }
  function loadProduct() {
    try {
      const s = localStorage.getItem(PRODUCT_STORE);
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  }

  function wireTabs() {
    document.querySelectorAll("[data-tabgroup]").forEach((group) => {
      group.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-tab]");
        if (!btn) return;
        const name = group.getAttribute("data-tabgroup");
        const target = btn.getAttribute("data-tab");
        group.querySelectorAll("[data-tab]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(`[data-tabpanel="${name}"]`).forEach((panel) => {
          if (panel.getAttribute("data-panel") === target) panel.classList.remove("hidden");
          else panel.classList.add("hidden");
        });
        if (window.dispatchPageEvent) window.dispatchPageEvent("tab", target);
      });
    });
  }

  function wireReveal() {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      const btn = el.querySelector("[data-reveal-btn]");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const target = document.querySelector(el.getAttribute("data-reveal"));
        if (target) target.classList.remove("hidden");
      });
    });
  }

  /* Skeleton → real swap for demo async feel */
  function reveal() {
    document.querySelectorAll(".skeleton").forEach((s) => s.classList.remove("skeleton"));
  }

  function simulate(label) {
    toast(`[Simulated] ${label || "Demo output"} — add an API key in Settings`, "flask-conical");
    document.body.setAttribute("data-sim", "1");
    return true;
  }

  function on(cb) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", cb);
    else cb();
  }

  /* ============================================================
     VISUAL ELEMENT INSPECTOR & GOOGLE AI STUDIO SELECTOR
     Allows clicking and selecting ANY element on the screen,
     copying its exact CSS selector, generating prompt instructions,
     and live-styling properties directly in the page.
     ============================================================ */
  let isInspectorActive = false;
  let inspectorHighlight = null;
  let inspectorBadge = null;
  let inspectorPanel = null;
  let selectedElement = null;

  function getCssSelector(el) {
    if (!el || el === document.body || el === document.documentElement) return "body";
    if (el.id) return `#${el.id}`;

    const validClasses = Array.from(el.classList || []).filter(
      (c) => !c.startsWith("pl-inspector") && !c.includes("hover") && !c.includes("active")
    );
    let tag = el.tagName.toLowerCase();
    if (validClasses.length > 0) {
      const classSelector = `${tag}.${validClasses.slice(0, 2).join(".")}`;
      try {
        if (document.querySelectorAll(classSelector).length === 1) return classSelector;
      } catch (e) {}
    }

    const path = [];
    let curr = el;
    while (curr && curr !== document.body && curr !== document.documentElement && path.length < 5) {
      if (curr.id) {
        path.unshift(`#${curr.id}`);
        break;
      }
      let part = curr.tagName.toLowerCase();
      const parent = curr.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter((c) => c.tagName === curr.tagName);
        if (siblings.length > 1) {
          const index = siblings.indexOf(curr) + 1;
          part += `:nth-of-type(${index})`;
        }
      }
      path.unshift(part);
      curr = curr.parentElement;
    }
    return path.join(" > ") || el.tagName.toLowerCase();
  }

  function toggleElementInspector(forceState) {
    isInspectorActive = typeof forceState === "boolean" ? forceState : !isInspectorActive;
    const btn = document.getElementById("btn-inspect-edit");
    const banner = document.getElementById("pl-inspector-banner");

    if (isInspectorActive) {
      if (btn) {
        btn.style.background = "#0FA05A";
        btn.style.color = "#ffffff";
        btn.style.borderColor = "#0FA05A";
        btn.style.boxShadow = "0 0 14px rgba(15, 160, 90, 0.4)";
        btn.innerHTML = `${icon("check", 15)} <span class="hidden md:inline">Selecting...</span>`;
      }
      if (!banner) {
        const b = document.createElement("div");
        b.id = "pl-inspector-banner";
        b.style.cssText =
          "position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:999999;background:#1C1C1E;color:#fff;padding:8px 18px;border-radius:99px;box-shadow:0 10px 30px rgba(0,0,0,0.35);display:flex;align-items:center;gap:12px;font-size:12.5px;font-weight:700;border:1.5px solid #0FA05A;";
        b.innerHTML = `
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#0FA05A"></span>
          <span>🎯 Click ANY element to select & edit</span>
          <button id="pl-close-banner" style="background:#333;color:#fff;border:none;border-radius:99px;padding:3px 10px;font-size:11px;font-weight:700;cursor:pointer">Exit</button>
        `;
        document.body.appendChild(b);
        document.getElementById("pl-close-banner").addEventListener("click", () => toggleElementInspector(false));
      }
      toast("🎯 Select Mode Active — Click any element to inspect & edit!", "crosshair");
    } else {
      if (btn) {
        btn.style.background = "#EDFBF2";
        btn.style.color = "#0FA05A";
        btn.style.borderColor = "#BCEFD0";
        btn.style.boxShadow = "none";
        btn.innerHTML = `${icon("crosshair", 15)} <span class="hidden md:inline">Edit</span>`;
      }
      if (banner) banner.remove();
      if (inspectorHighlight) inspectorHighlight.style.display = "none";
      if (inspectorBadge) inspectorBadge.style.display = "none";
    }

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "INSPECTOR_STATE_CHANGED", active: isInspectorActive }, "*");
    }
  }

  function setupElementInspector() {
    inspectorHighlight = document.createElement("div");
    inspectorHighlight.id = "pl-inspector-highlight";
    inspectorHighlight.style.cssText =
      "position:fixed;display:none;pointer-events:none;z-index:999990;border:2px dashed #0FA05A;background:rgba(15,160,90,0.08);border-radius:6px;transition:all 0.05s ease;";
    document.body.appendChild(inspectorHighlight);

    inspectorBadge = document.createElement("div");
    inspectorBadge.id = "pl-inspector-badge";
    inspectorBadge.style.cssText =
      "position:fixed;display:none;pointer-events:none;z-index:999995;background:#0FA05A;color:#fff;font-family:ui-monospace,Menlo,monospace;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.25);";
    document.body.appendChild(inspectorBadge);

    document.addEventListener("mouseover", (e) => {
      if (!isInspectorActive) return;
      const target = e.target;
      if (!target || target === inspectorHighlight || target === inspectorBadge || target.closest("#pl-inspector-panel") || target.closest("#pl-inspector-banner")) return;
      const rect = target.getBoundingClientRect();
      inspectorHighlight.style.display = "block";
      inspectorHighlight.style.top = rect.top + "px";
      inspectorHighlight.style.left = rect.left + "px";
      inspectorHighlight.style.width = rect.width + "px";
      inspectorHighlight.style.height = rect.height + "px";

      inspectorBadge.style.display = "block";
      inspectorBadge.textContent = getCssSelector(target);
      inspectorBadge.style.top = Math.max(4, rect.top - 24) + "px";
      inspectorBadge.style.left = Math.max(4, rect.left) + "px";
    }, true);

    document.addEventListener("click", (e) => {
      if (!isInspectorActive) return;
      const target = e.target;
      if (!target || target.closest("#pl-inspector-panel") || target.closest("#pl-inspector-banner")) return;

      e.preventDefault();
      e.stopPropagation();

      selectedElement = target;
      const selector = getCssSelector(target);
      const textPreview = (target.innerText || target.textContent || "").trim().slice(0, 80);
      const computed = window.getComputedStyle(target);

      showInspectorPanel(target, selector, textPreview, computed);

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: "AI_STUDIO_ELEMENT_SELECTED",
          selector: selector,
          tagName: target.tagName.toLowerCase(),
          id: target.id || "",
          className: target.className || "",
          text: textPreview,
          computed: {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize,
          }
        }, "*");
      }
    }, true);

    window.addEventListener("message", (e) => {
      if (e.data && e.data.type === "TOGGLE_INSPECTOR_MODE") {
        toggleElementInspector(e.data.enabled);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isInspectorActive) {
        toggleElementInspector(false);
      }
    });
  }

  function showInspectorPanel(el, selector, textPreview, computed) {
    if (inspectorPanel) inspectorPanel.remove();

    inspectorPanel = document.createElement("div");
    inspectorPanel.id = "pl-inspector-panel";
    inspectorPanel.style.cssText =
      "position:fixed;bottom:20px;right:20px;z-index:999999;width:380px;max-width:calc(100vw - 40px);background:#ffffff;border:1.5px solid #0FA05A;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,0.3);font-family:Inter,sans-serif;color:#1C1C1E;overflow:hidden;";

    inspectorPanel.innerHTML = `
      <div style="background:#F4FAF6;padding:12px 16px;border-bottom:1px solid #D1EADE;display:flex;align-items:center;justify-content:space-between">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:24px;height:24px;border-radius:8px;background:#0FA05A;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:800">🎯</span>
          <div>
            <div style="font-size:13px;font-weight:800;color:#0B6B38">Element Selected</div>
            <div style="font-size:11px;color:#6B6B72">&lt;${el.tagName.toLowerCase()}&gt;</div>
          </div>
        </div>
        <button id="pl-panel-close" style="background:none;border:none;font-size:18px;color:#8A8A92;cursor:pointer;padding:2px 6px">✕</button>
      </div>

      <div style="padding:16px;max-height:480px;overflow-y:auto;display:flex;flex-direction:column;gap:12px">
        <div>
          <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;color:#8A8A92;letter-spacing:0.04em;margin-bottom:4px">CSS Selector</div>
          <div style="display:flex;align-items:center;gap:6px">
            <input type="text" id="pl-selector-input" readonly value="${selector}" style="flex:1;background:#F7F8F7;border:1px solid #ECECEE;border-radius:8px;padding:6px 10px;font-family:ui-monospace,Menlo,monospace;font-size:11.5px;color:#0B6B38;font-weight:600" />
            <button id="pl-copy-selector" style="background:#EDFBF2;border:1px solid #BCEFD0;color:#0FA05A;padding:6px 10px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer">Copy</button>
          </div>
        </div>

        <div style="background:#FAFBF9;border:1px solid #E4E8E5;border-radius:12px;padding:12px">
          <div style="font-size:11.5px;font-weight:800;color:#1C1C1E;margin-bottom:4px">Tell AI Studio what to change:</div>
          <input type="text" id="pl-custom-instruction" placeholder="e.g. make width bigger, change color, update text..." style="width:100%;box-sizing:border-box;background:#fff;border:1px solid #D5DAD6;border-radius:8px;padding:8px 10px;font-size:12px;margin-bottom:8px" />
          <button id="pl-copy-prompt" style="width:100%;background:#0FA05A;color:#fff;border:none;border-radius:10px;padding:9px;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>📋 Copy Prompt for AI Studio</span>
          </button>
        </div>

        <div style="border-top:1px solid #ECECEE;padding-top:10px">
          <div style="font-size:11px;font-weight:800;color:#8A8A92;text-transform:uppercase;margin-bottom:8px">Quick Live Tweak</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <label style="font-size:10px;font-weight:700;color:#6B6B72;display:block;margin-bottom:3px">Background</label>
              <input type="color" id="pl-live-bg" value="#ffffff" style="width:100%;height:30px;border-radius:6px;border:1px solid #ECECEE;cursor:pointer" />
            </div>
            <div>
              <label style="font-size:10px;font-weight:700;color:#6B6B72;display:block;margin-bottom:3px">Text Color</label>
              <input type="color" id="pl-live-color" value="#1C1C1E" style="width:100%;height:30px;border-radius:6px;border:1px solid #ECECEE;cursor:pointer" />
            </div>
          </div>
          <div style="margin-top:8px">
            <label style="font-size:10px;font-weight:700;color:#6B6B72;display:block;margin-bottom:3px">Edit Text Live</label>
            <input type="text" id="pl-live-text" value="${textPreview.replace(/"/g, '&quot;')}" style="width:100%;box-sizing:border-box;background:#fff;border:1px solid #ECECEE;border-radius:6px;padding:6px 8px;font-size:12px" />
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(inspectorPanel);

    document.getElementById("pl-panel-close").addEventListener("click", () => {
      inspectorPanel.remove();
      inspectorPanel = null;
    });

    document.getElementById("pl-copy-selector").addEventListener("click", () => {
      navigator.clipboard.writeText(selector);
      toast("Copied CSS selector: " + selector, "check");
    });

    document.getElementById("pl-copy-prompt").addEventListener("click", () => {
      const instruction = document.getElementById("pl-custom-instruction").value.trim() || "Please update this element.";
      const prompt = `[AIS_METADATA_SECTION_START]\nCSS selector 1: ${selector}\nCSS 1: {}\n[AIS_METADATA_SECTION_END]\n${instruction}`;
      navigator.clipboard.writeText(prompt);
      toast("Copied instruction for Google AI Studio! Paste it directly into the chat.", "check-circle");
    });

    document.getElementById("pl-live-bg").addEventListener("input", (e) => {
      el.style.backgroundColor = e.target.value;
    });
    document.getElementById("pl-live-color").addEventListener("input", (e) => {
      el.style.color = e.target.value;
    });
    document.getElementById("pl-live-text").addEventListener("input", (e) => {
      el.innerText = e.target.value;
    });
  }

  function boot() {
    injectNav();
    buildLogoMenu();
    buildAccountMenu();
    wireTabs();
    wireReveal();
    setupElementInspector();
    if (window.lucide) lucide.createIcons();
    if (window.PL_API && window.PL_API.detect) PL_API.detect();
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeChat();
    });
  }

  window.PL = {
    NAV, current, icon, esc, fmt, money, pct, initials,
    injectNav, pageHeader, card, scoreRow, pill, tag, barRow, thumb, fallbackThumb,
    saveProduct, loadProduct, parseJSON,
    toast, modal, closeModal, notify, wireTabs, reveal, simulate, on,
    loadProfile, saveProfile, syncAvatar,
    toggleInspector: toggleElementInspector,
    chat: { open: openChat, close: closeChat },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
