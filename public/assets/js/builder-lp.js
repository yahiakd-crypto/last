/* BUILDER LP — build a landing page from image sections, export to PNG / WebP */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const store = {
    get(k, fb) { try { const r = localStorage.getItem("lpb." + k); return r == null ? fb : JSON.parse(r); } catch (e) { return fb; } },
    set(k, v) { try { localStorage.setItem("lpb." + k, JSON.stringify(v)); } catch (e) {} },
  };

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const PRESETS = [
    { id: "hero", label: "Hero", icon: "landmark", ratio: "16/9", pos: "center", title: "", sub: "", cta: "" },
    { id: "offer", label: "Offer", icon: "gift", ratio: "4/5", pos: "center", title: "", sub: "", cta: "" },
    { id: "features", label: "Features", icon: "layout-grid", ratio: "16/9", pos: "bottom", title: "", sub: "", cta: "" },
    { id: "gallery", label: "Gallery", icon: "images", ratio: "16/9", pos: "bottom", title: "", sub: "", cta: "" },
    { id: "testimonial", label: "Testimonial", icon: "message-square-quote", ratio: "4/5", pos: "bottom", title: "", sub: "", cta: "" },
    { id: "pricing", label: "Pricing", icon: "tags", ratio: "16/9", pos: "bottom", title: "", sub: "", cta: "" },
    { id: "guarantee", label: "Guarantee", icon: "shield-check", ratio: "21/9", pos: "center", title: "", sub: "", cta: "" },
    { id: "banner", label: "Banner", icon: "megaphone", ratio: "21/9", pos: "center", title: "", sub: "", cta: "" },
    { id: "faq", label: "FAQ", icon: "circle-help", ratio: "16/9", pos: "bottom", title: "", sub: "", cta: "" },
    { id: "footer", label: "Footer", icon: "flag", ratio: "21/9", pos: "center", title: "", sub: "", cta: "" },
  ];
  const RATIOS = { "4/5": 0.8, "1/1": 1, "16/9": 16 / 9, "21/9": 21 / 9, "3/1": 3 };
  const POS = ["top", "center", "bottom"];
  const FITS = ["cover", "contain", "natural"];
  const FIT_LABEL = { cover: "Cover (crop to fill)", contain: "Contain (whole image)", natural: "Natural (image size)" };

  let pageName = store.get("name", "My Landing Page");
  let device = store.get("device", "mobile");
  let sections = store.get("sections", []);
  const imgCache = new Map();

  function preset(id) { return PRESETS.find((p) => p.id === id) || PRESETS[0]; }
  function save() {
    store.set("sections", sections);
    store.set("name", pageName);
    store.set("device", device);
  }

  function toast(msg, type) {
    const stack = $("toast-stack");
    if (!stack) return;
    const t = document.createElement("div");
    t.className = "toast " + (type || "ok");
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(() => { t.style.transition = "opacity .35s"; t.style.opacity = "0"; setTimeout(() => t.remove(), 360); }, 2600);
  }

  function icons() { if (window.lucide) lucide.createIcons(); }

  /* ---------- render: left editor ---------- */
  function renderLeft() {
    const list = $("lpb-list");
    if (!list) return;
    list.innerHTML = sections.map((s, i) => {
      const p = preset(s.type);
      const canUp = i > 0, canDown = i < sections.length - 1;
      const ratioOpts = Object.keys(RATIOS).map((r) => `<option ${s.ratio === r ? "selected" : ""}>${r}</option>`).join("");
      const posOpts = POS.map((p) => `<option ${s.pos === p ? "selected" : ""}>${p}</option>`).join("");
      const fitOpts = FITS.map((f) => `<option ${s.fit === f ? "selected" : ""} value="${f}">${FIT_LABEL[f]}</option>`).join("");
      const ratioTag = (s.fit === "natural" && s.iw && s.ih) ? "natural" : s.ratio;
      return `
      <div class="lps-card" data-i="${i}">
        <div class="lps-top">
          <div class="lps-thumb" data-upload="${i}" title="Upload image for this section">
            ${s.img ? `<img src="${s.img}" alt="">` : `<div class="noimg">${esc(p.label)}<br>no image</div>`}
            <span class="ov"><i data-lucide="image-plus" style="width:12px;height:12px"></i> upload</span>
          </div>
          <div class="lps-mid">
            <div class="lps-type"><span class="t-ic"><i data-lucide="${p.icon}" style="width:14px;height:14px"></i></span> ${esc(p.label)}
              <span class="lps-ratio-tag">· ${ratioTag}</span></div>
            <div class="lps-acts">
              <button class="lps-act" data-act="up" data-i="${i}" title="Move up" ${canUp ? "" : "disabled style=opacity:.3;cursor:default"}><i data-lucide="arrow-up" style="width:13px;height:13px"></i></button>
              <button class="lps-act" data-act="down" data-i="${i}" title="Move down" ${canDown ? "" : "disabled style=opacity:.3;cursor:default"}><i data-lucide="arrow-down" style="width:13px;height:13px"></i></button>
              <button class="lps-act" data-act="dup" data-i="${i}" title="Duplicate"><i data-lucide="copy" style="width:13px;height:13px"></i></button>
              <button class="lps-act del" data-act="del" data-i="${i}" title="Delete"><i data-lucide="trash-2" style="width:13px;height:13px"></i></button>
            </div>
          </div>
        </div>
        <div class="lps-fields">
          <div class="lpb-fld"><label>Title (overlay)</label><input class="input" data-f="title" data-i="${i}" value="${esc(s.title)}" placeholder="Big headline"></div>
          <div class="lpb-fld"><label>Subtitle</label><input class="input" data-f="sub" data-i="${i}" value="${esc(s.sub)}" placeholder="Supporting line"></div>
          <div class="lpb-grid2">
            <div class="lpb-fld"><label>CTA button</label><input class="input" data-f="cta" data-i="${i}" value="${esc(s.cta)}" placeholder="Order now"></div>
            <div class="lpb-fld"><label>Ratio</label><select class="select" data-f="ratio" data-i="${i}" ${s.fit === "natural" && s.iw ? "disabled title=Fit=Natural overrides ratio" : ""}>${ratioOpts}</select></div>
          </div>
          <div class="lpb-fld"><label>Image fit</label><select class="select" data-f="fit" data-i="${i}">${fitOpts}</select></div>
          <div class="lpb-grid3">
            <div class="lpb-fld"><label>Text position</label><select class="select" data-f="pos" data-i="${i}">${posOpts}</select></div>
            <div class="lpb-fld"><label>Darken</label><div class="lpb-range"><input type="range" min="0" max="90" step="5" data-f="overlay" data-i="${i}" value="${s.overlay}"><span class="rv">${s.overlay}%</span></div></div>
            <div class="lpb-fld" style="text-align:right"><button class="lpb-btn g sm" data-act="noimg" data-i="${i}" title="Remove image">${ic("image-off", 12)}</button></div>
          </div>
        </div>
        <input type="file" id="file-${i}" accept="image/*" style="display:none">
      </div>`;
    }).join("");
    icons();
  }

  function ic(name, size) {
    return `<i data-lucide="${name}" style="width:${size || 13}px;height:${size || 13}px"></i>`;
  }

  /* ---------- render: preview ---------- */
  function sectionHTML(s, i) {
    const p = preset(s.type);
    const ratio = (s.fit === "natural" && s.iw && s.ih) ? s.iw / s.ih : (RATIOS[s.ratio] || 1.78);
    const fit = s.fit || "cover";
    const mask = (s.title || s.sub || s.cta) && s.overlay > 0
      ? `<div class="lpv-mask" style="opacity:${(s.overlay || 0) / 100}"></div>` : "";
    const txt = (s.title || s.sub || s.cta) ? `
      <div class="lpv-txt ${s.pos || "center"}">
        ${s.title ? `<div class="lpv-title">${esc(s.title)}</div>` : ""}
        ${s.sub ? `<div class="lpv-sub">${esc(s.sub)}</div>` : ""}
        ${s.cta ? `<span class="lpv-cta">${esc(s.cta)} ${ic("arrow-right", 12)}</span>` : ""}
      </div>` : "";
    const inner = s.img
      ? `<img src="${s.img}" alt="" class="fit-${fit}">`
      : `<div class="lpv-ph"><span class="ph-ic"><i data-lucide="${p.icon}" style="width:18px;height:18px"></i></span><span class="ph-lbl">${esc(p.label)} · ${s.ratio}</span></div>`;
    return `<div class="lpv-sec" style="aspect-ratio:${ratio};" data-i="${i}">${inner}${mask}${txt}</div>`;
  }

  function renderPreview() {
    const frame = $("lpv-frame");
    const empty = $("lpb-empty");
    if (!frame) return;
    frame.className = "lpv-frame " + device;
    if (!sections.length) {
      frame.innerHTML = `<div class="lpb-empty"><div class="big"><i data-lucide="layout-template" style="width:28px;height:28px"></i></div><b style="color:var(--ink)">No sections yet</b><div style="margin-top:6px;font-size:12px">Add sections on the left — every section takes an image,<br>then export the whole page as PNG or WebP.</div></div>`;
    } else {
      frame.innerHTML = sections.map((s, i) => sectionHTML(s, i)).join("");
    }
    const cnt = $("lpb-count");
    if (cnt) cnt.textContent = sections.length ? sections.length + (sections.length === 1 ? " section" : " sections") : "empty page";
    icons();
  }

  function renderAll() {
    renderLeft();
    renderPreview();
  }

  /* ---------- add / sample / clear ---------- */
  function addSection(type) {
    const p = preset(type);
    sections.push({ id: uid(), type, ratio: p.ratio, pos: p.pos, overlay: 45, title: p.title, sub: p.sub, cta: p.cta, img: "", fit: "cover", iw: 0, ih: 0 });
    save();
    renderAll();
    toast(p.label + " section added", "info");
  }

  const SAMPLE = [
    { type: "hero", title: "Upgrade your kitchen in one order", sub: "17-piece chef knife set — delivered to your door, pay on delivery", cta: "Order now", ratio: "16/9", pos: "center", overlay: 55 },
    { type: "features", title: "Everything you need, in one set", sub: "Forged blades · ergonomic handles · storage block included", cta: "", ratio: "16/9", pos: "bottom", overlay: 55 },
    { type: "testimonial", title: "\"Best knives I've bought in Algeria\"", sub: "Verified buyer — Annaba", cta: "", ratio: "4/5", pos: "bottom", overlay: 50 },
    { type: "offer", title: "2 900 DA — today only", sub: "Free delivery on orders above 5 000 DA", cta: "Order on delivery", ratio: "4/5", pos: "center", overlay: 60 },
    { type: "footer", title: "Ready when you are", sub: "Cash on delivery · 48h delivery · real photos, honest product", cta: "Order now", ratio: "21/9", pos: "center", overlay: 60 },
  ];

  function loadSample() {
    sections = SAMPLE.map((s) => ({ id: uid(), type: s.type, ratio: s.ratio, pos: s.pos, overlay: s.overlay, title: s.title, sub: s.sub, cta: s.cta, img: "", fit: "cover", iw: 0, ih: 0 }));
    save();
    renderAll();
    toast("Sample landing page loaded — add your own images per section", "check-circle");
  }

  function clearAll() {
    if (!sections.length) return toast("Nothing to clear", "info");
    sections = [];
    save();
    renderAll();
    toast("Page cleared", "info");
  }

  /* ---------- actions ---------- */
  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    const t = sections[i]; sections[i] = sections[j]; sections[j] = t;
    save(); renderAll();
  }
  function del(i) { sections.splice(i, 1); save(); renderAll(); toast("Section removed", "info"); }
  function dup(i) {
    const c = Object.assign({}, sections[i], { id: uid() });
    sections.splice(i + 1, 0, c);
    save(); renderAll();
    toast("Section duplicated", "info");
  }

  /* ---------- upload ---------- */
  function uploadFor(i) {
    const input = $("file-" + i);
    if (input) input.click();
  }
  function handleFiles(i, files) {
    const f = files && files[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) return toast("Please choose an image file", "warn");
    const rd = new FileReader();
    rd.onload = () => {
      if (!sections[i]) return;
      const img = new Image();
      img.onload = () => {
        sections[i].img = rd.result;
        sections[i].iw = img.naturalWidth;
        sections[i].ih = img.naturalHeight;
        sections[i].fit = "natural";
        save(); renderAll();
        toast("Image added — shown at its real size (fit = Natural)", "check-circle");
      };
      img.onerror = () => {
        sections[i].img = rd.result;
        save(); renderAll();
        toast("Image added", "check-circle");
      };
      img.src = rd.result;
    };
    rd.readAsDataURL(f);
  }

  /* ---------- export ---------- */
  function loadImg(src) {
    if (imgCache.has(src)) return Promise.resolve(imgCache.get(src));
    return new Promise((res) => {
      const im = new Image();
      im.onload = () => { imgCache.set(src, im); res(im); };
      im.onerror = () => res(null);
      im.src = src;
    });
  }

  function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    for (const wd of words) {
      const t = line ? line + " " + wd : wd;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = wd; }
      else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }

  function drawImageCover(ctx, img, x, y, w, h) {
    if (!img) { ctx.fillStyle = "#0E1626"; ctx.fillRect(x, y, w, h); return; }
    const scale = Math.max(w / img.width, h / img.height);
    const sw = w / scale, sh = h / scale;
    const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  function drawImageContain(ctx, img, x, y, w, h) {
    if (!img) { ctx.fillStyle = "#0E1626"; ctx.fillRect(x, y, w, h); return; }
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    const dx = x + (w - dw) / 2, dy = y + (h - dh) / 2;
    ctx.fillStyle = "#0B1220"; ctx.fillRect(x, y, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function drawSectionImage(ctx, s, img, x, y, w, h) {
    const fit = s.fit || "cover";
    if (fit === "contain") drawImageContain(ctx, img, x, y, w, h);
    else drawImageCover(ctx, img, x, y, w, h);
  }

  function drawPlaceholder(ctx, s, x, y, w, h) {
    const p = preset(s.type);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, "#131C2E"); g.addColorStop(1, "#0B1220");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = "#3EE8A6";
    ctx.font = "900 " + Math.round(w * 0.028) + "px Inter, system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(p.label.toUpperCase(), x + w / 2, y + h / 2 - 4);
    ctx.restore();
  }

  function drawOverlay(ctx, s, x, y, w, h) {
    const hasTxt = s.title || s.sub || s.cta;
    if (!hasTxt) return;
    const dark = Math.max(0, Math.min(90, Number(s.overlay) || 0)) / 100;
    ctx.fillStyle = "rgba(0,0,0," + dark + ")";
    ctx.fillRect(x, y, w, h);

    let tx;
    if (s.pos === "top") tx = y + h * 0.1;
    else if (s.pos === "bottom") tx = y + h - h * 0.1;
    else tx = y + h / 2;

    const maxW = w * 0.84;
    let cursor = tx;
    const titleSize = Math.max(22, Math.round(w * 0.052));
    const subSize = Math.max(15, Math.round(w * 0.028));
    const ctaH = Math.max(40, Math.round(w * 0.06));
    const padX = Math.round(ctaH * 0.9);
    const font = (size, weight) => weight + " " + size + "px Inter, system-ui, sans-serif";

    ctx.save();
    ctx.textBaseline = "top";

    if (s.title) {
      ctx.font = font(titleSize, "900");
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 2;
      const lines = wrap(ctx, s.title, maxW);
      ctx.textAlign = s.pos === "center" ? "center" : "left";
      for (const l of lines) { ctx.fillText(l, s.pos === "center" ? x + w / 2 : x + w * 0.08, cursor); cursor += titleSize * 1.16; }
      ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      cursor += titleSize * 0.28;
    }
    if (s.sub) {
      ctx.font = font(subSize, "600");
      ctx.fillStyle = "#E8EDF8";
      ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 12;
      const lines = wrap(ctx, s.sub, maxW * 0.94);
      ctx.textAlign = s.pos === "center" ? "center" : "left";
      for (const l of lines) { ctx.fillText(l, s.pos === "center" ? x + w / 2 : x + w * 0.08, cursor); cursor += subSize * 1.28; }
      ctx.shadowBlur = 0;
      cursor += subSize * 0.25;
    }
    if (s.cta) {
      ctx.font = font(Math.max(16, Math.round(w * 0.03)), "800");
      const tw = ctx.measureText(s.cta).width;
      const bw = tw + padX * 2;
      const bx = s.pos === "center" ? x + (w - bw) / 2 : x + w * 0.08;
      const by = cursor;
      const r = ctaH / 2;
      ctx.fillStyle = "#3EE8A6";
      ctx.shadowColor = "rgba(62,232,166,.4)"; ctx.shadowBlur = 26;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, ctaH, r);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#06120C";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(s.cta, bx + bw / 2, by + ctaH / 2 + 1);
    }
    ctx.restore();
  }

  async function exportPage(fmt) {
    if (!sections.length) return toast("Add at least one section first", "warn");
    const w = device === "mobile" ? 720 : 1200;
    const secs = [];
    for (const s of sections) {
      const ratio = (s.fit === "natural" && s.iw && s.ih) ? s.iw / s.ih : (RATIOS[s.ratio] || 1.78);
      secs.push({ s, h: Math.round(w / ratio), img: s.img ? await loadImg(s.img) : null });
    }
    const H = secs.reduce((a, b) => a + b.h, 0);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = H;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0B1220";
    ctx.fillRect(0, 0, w, H);
    let y = 0;
    for (const it of secs) {
      if (it.img) drawSectionImage(ctx, it.s, it.img, 0, y, w, it.h);
      else drawPlaceholder(ctx, it.s, 0, y, w, it.h);
      drawOverlay(ctx, it.s, 0, y, w, it.h);
      y += it.h;
    }

    const name = (pageName || "landing-page").replace(/[\\/:*?"<>|]+/g, "-").trim() || "landing-page";
    const doDownload = (type) => {
      canvas.toBlob((blob) => {
        if (!blob) { toast("Your browser can't export " + fmt.toUpperCase(), "warn"); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = name + "." + fmt;
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
        toast("Exported " + name + "." + fmt + " (" + w + "×" + H + ")", "check-circle");
      }, type, 0.92);
    };
    doDownload("image/" + fmt);
  }

  /* ---------- events ---------- */
  function wire(e) {
    const t = e.target;

    const presetBtn = t.closest("[data-addtype]");
    if (presetBtn) { addSection(presetBtn.dataset.addtype); return; }
    if (t.closest("#btn-sample")) { loadSample(); return; }
    if (t.closest("#btn-clear")) { clearAll(); return; }

    if (t.closest("#btn-export-png")) { exportPage("png"); return; }
    if (t.closest("#btn-export-webp")) { exportPage("webp"); return; }
    const devBtn = t.closest(".lpb-dev-btn");
    if (devBtn) {
      device = devBtn.dataset.device;
      $$("#dev-seg .lpb-dev-btn").forEach((b) => b.classList.toggle("active", b === devBtn));
      save(); renderPreview(); return;
    }

    const up = t.closest("[data-upload]");
    if (up) { uploadFor(Number(up.dataset.upload)); return; }

    const act = t.closest("[data-act]");
    if (act) {
      const i = Number(act.dataset.i);
      switch (act.dataset.act) {
        case "up": move(i, -1); break;
        case "down": move(i, 1); break;
        case "dup": dup(i); break;
        case "del": del(i); break;
        case "noimg": if (sections[i]) { sections[i].img = ""; save(); renderAll(); } break;
      }
      return;
    }
  }

  function wireChange(e) {
    const t = e.target;
    if (t.id && t.id.indexOf("file-") === 0) {
      handleFiles(Number(t.id.slice(5)), t.files);
      t.value = "";
      return;
    }
    const f = t.dataset && t.dataset.f;
    if (f && t.dataset.i != null) {
      const i = Number(t.dataset.i);
      if (!sections[i]) return;
      if (f === "ratio" || f === "pos" || f === "fit") {
        sections[i][f] = t.value;
        save(); renderAll();
      } else if (f === "overlay") {
        sections[i].overlay = Number(t.value);
        const rv = t.parentElement.querySelector(".rv");
        if (rv) rv.textContent = t.value + "%";
        save(); renderPreview();
      } else {
        sections[i][f] = t.value;
        save(); renderPreview();
      }
    }
  }

  function wireInput(e) {
    const t = e.target;
    if (t.id === "lpb-name") {
      pageName = t.value;
      save();
      return;
    }
    const f = t.dataset && t.dataset.f;
    if (f && t.dataset.i != null) {
      const i = Number(t.dataset.i);
      if (!sections[i]) return;
      sections[i][f] = t.value;
      if (f === "overlay") {
        const rv = t.parentElement.querySelector(".rv");
        if (rv) rv.textContent = t.value + "%";
      }
      save();
      renderPreview();
    }
  }

  /* ---------- init ---------- */
  function renderShell() {
    const v = $("builder-view");
    v.innerHTML = `
      <div class="lpb-bar">
        <div>
          <div class="lpb-bar-title">Landing Page <span style="color:var(--green)">Builder</span></div>
          <div class="lpb-bar-sub">Add sections, drop an image into each, arrange them, export the whole page.</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <input class="lpb-name-input" id="lpb-name" value="${esc(pageName)}" placeholder="Page name">
          <div class="lpb-seg" id="dev-seg">
            <button class="lpb-dev-btn ${device === "mobile" ? "active" : ""}" data-device="mobile"><i data-lucide="smartphone" style="width:13px;height:13px"></i> Mobile</button>
            <button class="lpb-dev-btn ${device === "desktop" ? "active" : ""}" data-device="desktop"><i data-lucide="monitor" style="width:13px;height:13px"></i> Desktop</button>
          </div>
          <button class="lpb-btn p" id="btn-export-png"><i data-lucide="download" style="width:14px;height:14px"></i> PNG</button>
          <button class="lpb-btn p" id="btn-export-webp"><i data-lucide="image-down" style="width:14px;height:14px"></i> WebP</button>
          <button class="lpb-btn g sm" id="btn-sample"><i data-lucide="wand-sparkles" style="width:12px;height:12px"></i> Sample</button>
          <button class="lpb-btn d sm" id="btn-clear"><i data-lucide="trash-2" style="width:12px;height:12px"></i> Clear</button>
        </div>
      </div>

      <div class="lpb-wrap">
        <div class="lpb-left">
          <div class="lpb-add">
            <div class="lpb-add-lbl">Add a section</div>
            <div class="lpb-presets">
              ${PRESETS.map((p) => `<button class="lpb-preset" data-addtype="${p.id}"><i data-lucide="${p.icon}" style="width:12px;height:12px"></i> ${p.label}</button>`).join("")}
            </div>
          </div>
          <div class="lpb-list" id="lpb-list"></div>
        </div>

        <div class="lpb-right">
          <div class="lpb-preview-head">
            <div><div class="h">Live preview</div><div class="muted"><span id="lpb-count">0 sections</span> · text & darken apply on export too</div></div>
          </div>
          <div class="lpb-stage">
            <div class="lpv-frame ${device}" id="lpv-frame"></div>
          </div>
        </div>
      </div>`;
    renderAll();
  }

  function boot() {
    renderShell();
    document.addEventListener("click", wire);
    document.addEventListener("change", wireChange);
    document.addEventListener("input", wireInput);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
