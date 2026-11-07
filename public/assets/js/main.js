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
        <button class="icon-btn" id="btn-refresh" title="Refresh data">${icon("refresh-cw", 17)}</button>
        <button class="icon-btn" id="btn-notify" title="Notifications">${icon("bell", 17)}
          <span class="dot-status on" style="position:absolute;transform:translate(10px,-12px)"></span>
        </button>
        <div class="avatar-wrap">
          <button class="avatar" id="btn-avatar" title="Account">${avatarInner()}</button>
        </div>
      </div>`;

    host.innerHTML = brand + center + right;

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

  function boot() {
    injectNav();
    buildLogoMenu();
    buildAccountMenu();
    wireTabs();
    wireReveal();
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
    chat: { open: openChat, close: closeChat },
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
