/* ============================================================
   PUNCHLINE — NOTE · Sidebar Dock Canvas
   Google-Keep-style note dock + infinite Miro-style canvas.
   Persistence: localStorage "nt.state.v1"
   ============================================================ */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
  const ICON = (n, s, c) => `<span class="nt-ico" style="display:grid;place-items:center;color:${c || "currentColor"}">${window.PL && PL.icon ? PL.icon(n, s || 16) : ""}</span>`;
  const toast = (m, t) => { if (window.PL && PL.toast) PL.toast(m, t); };

  const CARD_BG = { white: "#FDFCF7", yellow: "#FEF8C5", green: "#E3F6E5", blue: "#DFE9FF", red: "#FBDCDC", purple: "#F1E8FF" };
  const CARD_ORDER = ["white", "yellow", "green", "blue", "red", "purple"];
  const STICKY_BG = { yellow: "#FEF8C4", green: "#CCF2D4", red: "#FCCBC4", blue: "#CBDBFB", orange: "#FDE0A3" };
  const BOARD_COLORS = ["yellow", "blue", "green", "red", "purple"];
  const TINY_SVG = (bg, fg, txt) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="320" height="150"><rect width="320" height="150" fill="${bg}"/><rect x="10" y="10" width="300" height="130" rx="10" fill="none" stroke="${fg}" stroke-width="2"/><text x="20" y="80" font-family="Arial" font-size="16" fill="${fg}">${txt}</text></svg>`)}`;
  const SKETCH_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="160"><rect width="300" height="160" fill="#fff"/><path d="M30 120 C 90 30, 130 150, 200 60 S 270 40, 280 90" stroke="#202124" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M60 30 C 120 90, 180 20, 250 70" stroke="#C5221F" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`)}`;

  function seed() {
    const n1 = { id: uid(), type: "checklist", title: "Launch checklist", items: [{ id: uid(), text: "Finalize landing copy", checked: true }, { id: uid(), text: "Confirm supplier stock", checked: false }, { id: uid(), text: "Schedule ad launch", checked: false }], color: "white", pinned: true, labels: ["Launch"], createdAt: Date.now() };
    const n2 = { id: uid(), type: "text", title: "Q4 campaign idea", body: "UGC hook: 17 knives, one price. Pay at the door — 48h delivery Algeria-wide.", color: "yellow", pinned: false, labels: [], createdAt: Date.now() - 1000 };
    const n3 = { id: uid(), type: "image", title: "Homepage hero mock", images: [TINY_SVG("#131C2E", "#3EE8A6", "HERO MOCK")], color: "white", pinned: true, createdAt: Date.now() - 2000 };
    const n4 = { id: uid(), type: "sketch", title: "Logo direction", images: [SKETCH_SVG], color: "white", pinned: false, createdAt: Date.now() - 3000 };
    const b1 = { id: uid(), title: "Q4 Campaign Board", color: "yellow", x: 150, y: 140, w: 520, h: 340 };
    const nodeA = { id: uid(), kind: "note", noteId: n1.id, boardId: b1.id, rx: 20, ry: 40, w: 170, h: 120 };
    const nodeB = { id: uid(), kind: "note", noteId: n2.id, boardId: b1.id, rx: 250, ry: 40, w: 180, h: 120 };
    const stk = { id: uid(), kind: "sticky", boardId: b1.id, rx: 150, ry: 200, content: "Key insight: proof sells", color: "yellow", w: 150, h: 70 };
    const b2 = { id: uid(), title: "Home Renovation", color: "blue", x: 820, y: 140, w: 360, h: 260 };
    const img1 = { id: uid(), kind: "image", noteId: n3.id, x: 860, y: 200, w: 260, h: 130 };
    const e1 = { id: uid(), from: nodeA.id, to: nodeB.id };
    const e2 = { id: uid(), from: nodeB.id, to: stk.id };
    return {
      notes: [n1, n2, n3, n4],
      boards: [b1, b2],
      nodes: [nodeA, nodeB, stk, img1],
      edges: [e1, e2],
      cam: { x: 40, y: 30, z: 1 },
    };
  }

  const K = "nt.state.v1";
  let S;
  try { S = JSON.parse(localStorage.getItem(K)); } catch (e) { S = null; }
  if (!S || !S.notes) S = seed();
  S.notes = S.notes || []; S.boards = S.boards || []; S.nodes = S.nodes || []; S.edges = S.edges || []; S.cam = S.cam || { x: 0, y: 0, z: 1 };
  let { notes, boards, nodes, edges } = S;
  let cam = S.cam;

  let saveT = null;
  let syncT = null;
  function persist() {
    S.cam = cam;
    S.notes = notes; S.boards = boards; S.nodes = nodes; S.edges = edges;
    clearTimeout(saveT);
    saveT = setTimeout(() => {
      try { localStorage.setItem(K, JSON.stringify(S)); } catch (e) { toast("Storage full — save failed", "alert"); }
      const p = $("nt-state"); if (p) p.textContent = "Saved " + new Date().toLocaleTimeString();
    }, 250);
  }

  const note = (id) => notes.find((n) => n.id === id);
  const board = (id) => boards.find((b) => b.id === id);
  const nodeById = (id) => nodes.find((n) => n.id === id);
  const nodeEl = (id) => document.querySelector(`[data-nid="${id}"]`);

  /* world <-> screen */
  function stw(sx, sy) { return { x: (sx - cam.x) / cam.z, y: (sy - cam.y) / cam.z }; }
  function nodeWorld(n) {
    const b = n.boardId ? board(n.boardId) : null;
    return { x: b ? b.x + n.rx : n.x, y: b ? b.y + n.ry : n.y, w: n.w || 150, h: n.h || 80 };
  }
  function anchor(id, side) {
    const n = nodeById(id); if (!n) return null;
    const w = nodeWorld(n);
    if (side === "left") return { x: w.x, y: w.y + w.h / 2 };
    return { x: w.x + w.w, y: w.y + w.h / 2 };
  }

  /* ---------------- render ---------------- */
  function render() { renderSidebar(); renderCanvas(); renderMinimap(); }

  function cardHTML(n) {
    const bg = CARD_BG[n.color] || "#FDFCF7";
    let body = "";
    if (n.type === "checklist") {
      body += `<div class="nt-c-title" contenteditable="true" spellcheck="false">${esc(n.title)}</div><ul class="nt-cl">${(n.items || []).map((it) => `<li class="${it.checked ? "done" : ""}"><input type="checkbox" ${it.checked ? "checked" : ""}><span contenteditable="true" spellcheck="false">${esc(it.text)}</span></li>`).join("")}</ul>`;
    } else {
      if (n.title) body += `<div class="nt-c-title" contenteditable="true" spellcheck="false">${esc(n.title)}</div>`;
      if (n.type === "text" && n.body) body += `<div class="nt-c-text" contenteditable="true" spellcheck="false">${esc(n.body)}</div>`;
      if (n.type === "image" || n.type === "sketch") {
        const imgs = n.images || [];
        if (imgs.length > 1) body += `<div class="nt-c-pile">${imgs.slice(0, 4).map((u) => `<img src="${u}" alt="">`).join("")}</div>`;
        else if (imgs[0]) body += `<img class="nt-c-img" src="${imgs[0]}" alt="">`;
        if ((n.items || []).length) body += `<ul class="nt-cl">${n.items.map((it) => `<li class="${it.checked ? "done" : ""}"><input type="checkbox" ${it.checked ? "checked" : ""}><span contenteditable="true" spellcheck="false">${esc(it.text)}</span></li>`).join("")}</ul>`;
      }
      if (n.type === "link") body += `<a class="nt-c-url" href="${esc(n.url)}" target="_blank" rel="noopener">${ICON("link", 13)}${esc(n.url)}</a>`;
    }
    if ((n.labels || []).length) body += `<div class="nt-c-labels">${n.labels.map((l) => `<span class="nt-label" data-c="${esc(l.color || "")}">${esc(l.text)}</span>`).join("")}</div>`;
    if (n.reminder) body += `<div class="nt-c-labels"><span class="nt-label" data-c="red">${ICON("bell", 11)} ${esc(n.reminder)}</span></div>`;
    return `<div class="nt-c-body" style="background:${bg}">${body}</div>
      <div class="nt-c-foot" style="background:${bg}">
        <button class="nt-icon-btn" data-cact="tag" title="Label">${ICON("tag", 14)}</button>
        <button class="nt-icon-btn" data-cact="rem" title="Reminder">${ICON("clock", 14)}</button>
        <button class="nt-icon-btn" data-cact="img" title="Add image">${ICON("image", 14)}</button>
        <button class="nt-icon-btn" data-cact="send" title="Send to canvas">${ICON("grid-2x2", 14)}</button>
        <button class="nt-icon-btn pin ${n.pinned ? "on" : ""}" data-cact="pin" title="Pin">${ICON("pin", 14)}</button>
      </div>
      <div class="nt-card-menu">
        <button class="nt-icon-btn" data-cmenu="open" title="More">${ICON("ellipsis-vertical", 16)}</button>
      </div>`;
  }

  function renderSidebar() {
    const list = $("nt-list"); if (!list) return;
    const pinned = notes.filter((n) => n.pinned).sort((a, b) => b.createdAt - a.createdAt);
    const other = notes.filter((n) => !n.pinned).sort((a, b) => b.createdAt - a.createdAt);
    const section = (label, arr) => arr.length ? `<div class="nt-sec">${esc(label)} <span class="cnt">${arr.length}</span></div><div class="nt-grid">${arr.map((n) => `<div class="nt-card" draggable="true" data-id="${n.id}" data-type="${n.type}" style="--cc:${CARD_BG[n.color] || "#FDFCF7"}">${cardHTML(n)}</div>`).join("")}</div>` : "";
    list.innerHTML = section("Pinned", pinned) + section("Others", other);
  }

  function nodeInner(n) {
    if (n.kind === "sticky") return `<div class="nt-sticky" data-nid="${n.id}" data-c="${n.color}" style="left:${n.rx !== undefined ? n.rx : n.x}px;top:${n.ry !== undefined ? n.ry : n.y}px"><div contenteditable="true" spellcheck="false">${esc(n.content || "Sticky note")}</div></div>`;
    const nte = note(n.noteId) || {};
    let body = "";
    if (nte.type === "checklist") body = `<div class="nt-n-title" contenteditable="true" spellcheck="false">${esc(nte.title)}</div><ul class="nt-cl">${(nte.items || []).map((it) => `<li class="${it.checked ? "done" : ""}"><input type="checkbox" ${it.checked ? "checked" : ""}><span contenteditable="true" spellcheck="false">${esc(it.text)}</span></li>`).join("")}</ul>`;
    else {
      if (nte.title) body += `<div class="nt-n-title" contenteditable="true" spellcheck="false">${esc(nte.title)}</div>`;
      if (nte.type === "text" && nte.body) body += `<div class="nt-n-text" contenteditable="true" spellcheck="false">${esc(nte.body)}</div>`;
      if (nte.type === "image" || nte.type === "sketch") {
        const imgs = nte.images || [];
        if (imgs[0]) body += `<img class="nt-n-img" src="${imgs[0]}" alt="">`;
      }
      if (nte.type === "link" && nte.url) body += `<div class="nt-n-text" style="color:#1a73e8">${esc(nte.url)}</div>`;
    }
    return `<div class="nt-node" data-nid="${n.id}" style="left:${n.rx !== undefined ? n.rx : n.x}px;top:${n.ry !== undefined ? n.ry : n.y}px">
      <div class="nt-n-head">
        <div class="nt-n-drag"></div>
        <span style="opacity:.45;display:grid;place-items:center">${ICON(nte.type === "sketch" ? "pen-tool" : nte.type === "image" ? "image" : nte.type === "link" ? "link" : nte.type === "checklist" ? "list-checks" : "sticky-note", 13)}</span>
        <div class="nt-n-del" title="Remove from canvas">${ICON("x", 13)}</div>
      </div>
      <div class="nt-n-body">${body}</div>
      <div class="nt-n-resize"></div>
      <div class="nt-handle" title="Drag to connect"></div>
    </div>`;
  }

  function renderCanvas() {
    const inner = $("nt-inner"); if (!inner) return;
    inner.querySelectorAll(".nt-board, .nt-node, .nt-sticky").forEach((el) => el.remove());
    let html = "";
    for (const b of boards) {
      const kids = nodes.filter((n) => n.boardId === b.id).map((n) => nodeInner(n)).join("");
      html += `<div class="nt-board" data-bid="${b.id}" data-c="${b.color}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">
        <div class="nt-board-head">
          <span class="nt-board-title" contenteditable="true" spellcheck="false">${esc(b.title)}</span>
          <span class="nt-board-menu"><button class="nt-icon-btn" data-bmenu="open" title="Board menu">${ICON("ellipsis-vertical", 14)}</button></span>
        </div>
        <div class="nt-board-body">${kids}</div>
        <div class="nt-board-resize"></div>
        <div class="nt-board-add-sticky"><button data-bmenu="sticky">+ sticky</button></div>
      </div>`;
    }
    const standalone = nodes.filter((n) => !n.boardId).map((n) => nodeInner(n)).join("");
    inner.insertAdjacentHTML("beforeend", html + standalone);
    inner.querySelectorAll(".nt-node, .nt-sticky").forEach((el) => {
      const n = nodeById(el.dataset.nid); if (!n) return;
      n.w = el.offsetWidth; n.h = el.offsetHeight;
    });
    drawEdges();
  }

  function edgePathStr(a, b) {
    const dx = Math.abs(b.x - a.x);
    const c = Math.max(40, Math.min(160, dx * 0.5));
    return `M ${a.x} ${a.y} C ${a.x + c} ${a.y}, ${b.x - c} ${b.y}, ${b.x} ${b.y}`;
  }

  function drawEdges() {
    const svg = $("nt-edges"); if (!svg) return;
    let defs = `<defs><marker id="nt-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 Z" fill="#3EE8A6"/></marker></defs>`;
    for (const e of edges) {
      let a = anchor(e.from, "right"), b = anchor(e.to, "left");
      if (!a || !b) continue;
      if (a.x > b.x) { const t = a; a = b; b = t; }
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      defs += `<path d="${edgePathStr(a, b)}" fill="none" stroke="#3EE8A6" stroke-width="2.5" marker-end="url(#nt-arrow)" data-edge="${e.id}"></path>
        <circle class="e-x" data-edge="${e.id}" cx="${mx}" cy="${my}" r="8" fill="#0B1220" stroke="#3EE8A6" stroke-width="1.5"></circle>
        <text class="e-x" data-edge="${e.id}" x="${mx}" y="${my + 3}" text-anchor="middle" font-size="10" font-weight="700" fill="#3EE8A6" style="pointer-events:none">×</text>`;
    }
    if (tempEdge) defs += `<path id="nt-temp" d="${tempEdge.d}" fill="none" stroke="#A78BFA" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#nt-arrow)" style="pointer-events:none"></path>`;
    svg.innerHTML = defs;
  }

  /* ---------------- minimap ---------------- */
  function bounds() {
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const b of boards) { minX = Math.min(minX, b.x); minY = Math.min(minY, b.y); maxX = Math.max(maxX, b.x + b.w); maxY = Math.max(maxY, b.y + b.h); }
    for (const n of nodes) { const w = nodeWorld(n); minX = Math.min(minX, w.x); minY = Math.min(minY, w.y); maxX = Math.max(maxX, w.x + w.w); maxY = Math.max(maxY, w.y + w.h); }
    if (minX === 1e9) { minX = 0; minY = 0; maxX = 1200; maxY = 800; }
    const pad = 60;
    return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
  }
  let mini = null;
  function renderMinimap() {
    const box = $("nt-mini-in"); if (!box) return;
    const v = $("nt-view"); if (!v) return;
    const b = bounds();
    const bw = b.maxX - b.minX, bh = b.maxY - b.minY;
    const scale = Math.min(box.clientWidth / bw, box.clientHeight / bh) || 0.1;
    const ox = (box.clientWidth - bw * scale) / 2, oy = (box.clientHeight - bh * scale) / 2;
    const W = (x) => ox + (x - b.minX) * scale, H = (y) => oy + (y - b.minY) * scale;
    let html = "";
    for (const bd of boards) html += `<div class="m-item" style="left:${W(bd.x)}px;top:${H(bd.y)}px;width:${bd.w * scale}px;height:${bd.h * scale}px;background:${bd.color};opacity:.55"></div>`;
    for (const n of nodes) { const w = nodeWorld(n); html += `<div class="m-item" style="left:${W(w.x)}px;top:${H(w.y)}px;width:${Math.max(3, w.w * scale)}px;height:${Math.max(3, w.h * scale)}px;background:#E8EDF8;opacity:.85"></div>`; }
    const vx = -cam.x / cam.z, vy = -cam.y / cam.z, vw = v.clientWidth / cam.z, vh = v.clientHeight / cam.z;
    html += `<div class="m-view" style="left:${W(vx)}px;top:${H(vy)}px;width:${vw * scale}px;height:${vh * scale}px"></div>`;
    box.innerHTML = html;
    mini = { b, scale, W, H };
  }

  function applyCam() {
    const inner = $("nt-inner"); if (!inner) return;
    inner.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`;
    const p = $("nt-zoom-pct"); if (p) p.textContent = Math.round(cam.z * 100) + "%";
    renderMinimap();
  }

  function zoomAt(f, cx, cy) {
    const z = Math.max(0.15, Math.min(3, cam.z * f));
    const r = z / cam.z;
    cam.x = cx - (cx - cam.x) * r;
    cam.y = cy - (cy - cam.y) * r;
    cam.z = z;
    applyCam();
    persist();
  }

  /* ---------------- temp edge ---------------- */
  let tempEdge = null;

  /* ---------------- interactions ---------------- */
  let I = null;
  let spaceDown = false;
  let drawBoardMode = false;
  let selNode = null, selEdge = null;

  function elByWorld(x, y) {
    const sx = x * cam.z + cam.x, sy = y * cam.z + cam.y;
    return document.elementFromPoint(sx, sy);
  }

  function startDrag(kind, payload, e) {
    I = { kind, ...payload, sx: e.clientX, sy: e.clientY };
    e.preventDefault();
  }

  function onViewDown(e) {
    if (e.button === 2) return;
    const view = $("nt-view");
    const t = e.target;

    if (spaceDown || e.button === 1) { startDrag("pan", {}, e); view.classList.add("panning"); return; }

    const handle = t.closest(".nt-handle");
    if (handle) {
      const id = handle.closest("[data-nid]").dataset.nid;
      const a = anchor(id, "right") || anchor(id, "left");
      tempEdge = { from: id, to: null, d: `M ${a.x} ${a.y} L ${a.x} ${a.y}` };
      startDrag("edge", { id }, e);
      drawEdges();
      return;
    }
    const eX = t.closest(".e-x");
    if (eX) { removeEdge(eX.dataset.edge); return; }

    const mView = t.closest(".nt-mini-in");
    if (mView) return;

    const bResize = t.closest(".nt-board-resize");
    if (bResize) { const b = board(bResize.closest("[data-bid]").dataset.bid); startDrag("resize-b", { bid: b.id, w: b.w, h: b.h }, e); return; }
    const nResize = t.closest(".nt-n-resize");
    if (nResize) { const n = nodeById(nResize.closest("[data-nid]").dataset.nid); startDrag("resize-n", { nid: n.id, w: n.w, h: n.h }, e); return; }

    const bHead = t.closest(".nt-board-head");
    if (bHead && !t.closest("[contenteditable]") && !t.closest(".nt-board-menu")) { const b = board(bHead.closest("[data-bid]").dataset.bid); startDrag("move-b", { bid: b.id }, e); return; }

    const nHead = t.closest(".nt-node .nt-n-head");
    if (nHead && !t.closest(".nt-n-del")) { const n = nodeById(nHead.closest("[data-nid]").dataset.nid); selNode = n.id; selEdge = null; renderCanvas(); startDrag("move-n", { nid: n.id }, e); return; }

    const sticky = t.closest(".nt-sticky");
    if (sticky && !t.closest("[contenteditable]")) { const n = nodeById(sticky.dataset.nid); selNode = n.id; selEdge = null; renderCanvas(); startDrag("move-n", { nid: n.id }, e); return; }

    const nodeBody = t.closest(".nt-node");
    if (nodeBody && !t.closest(".nt-n-head")) { selNode = nodeById(nodeBody.dataset.nid).id; selEdge = null; renderCanvas(); return; }
    const edgeP = t.closest("path[data-edge]");
    if (edgeP) { selEdge = edgeP.dataset.edge; selNode = null; renderCanvas(); return; }

    if (drawBoardMode) {
      const w = stw(e.clientX - view.getBoundingClientRect().left, e.clientY - view.getBoundingClientRect().top);
      const b = { id: uid(), title: "New board", color: "yellow", x: w.x, y: w.y, w: 0, h: 0 };
      boards.push(b);
      startDrag("draw-b", { bid: b.id, wx0: w.x, wy0: w.y }, e);
      return;
    }

    if (t.closest(".nt-board-add-sticky") || t.closest("[contenteditable]")) return;
    if (t === view || t.classList.contains("grid-bg") || t.closest(".nt-inner") === null || t === $("nt-inner") || t.closest(".nt-board-body")) {
      selNode = null; selEdge = null; renderCanvas();
      startDrag("pan", {}, e);
      view.classList.add("panning");
    }
  }

  function onMove(e) {
    if (!I) return;
    const view = $("nt-view");
    if (I.kind === "pan") {
      cam.x += e.clientX - I.sx; cam.y += e.clientY - I.sy;
      I.sx = e.clientX; I.sy = e.clientY;
      applyCam();
      return;
    }
    if (I.kind === "mini") {
      const r = view.getBoundingClientRect();
      const w = stw(e.clientX - r.left, e.clientY - r.top);
      cam.x = view.clientWidth / 2 - w.x * cam.z;
      cam.y = view.clientHeight / 2 - w.y * cam.z;
      applyCam(); persist();
      return;
    }
    if (I.kind === "edge") {
      const r = view.getBoundingClientRect();
      const w = stw(e.clientX - r.left, e.clientY - r.top);
      const a = anchor(I.id, "right") || anchor(I.id, "left");
      tempEdge.d = edgePathStr(a, w);
      drawEdges();
      return;
    }
    if (I.kind === "draw-b") {
      const r = view.getBoundingClientRect();
      const w = stw(e.clientX - r.left, e.clientY - r.top);
      const b = board(I.bid);
      b.x = Math.min(I.wx0, w.x); b.y = Math.min(I.wy0, w.y);
      b.w = Math.abs(w.x - I.wx0); b.h = Math.abs(w.y - I.wy0);
      const el = document.querySelector(`[data-bid="${b.id}"]`);
      if (el) { el.style.left = b.x + "px"; el.style.top = b.y + "px"; el.style.width = Math.max(b.w, 10) + "px"; el.style.height = Math.max(b.h, 10) + "px"; }
      renderMinimap();
      return;
    }
    if (I.kind === "move-n") {
      const n = nodeById(I.nid); if (!n) return;
      const dx = (e.clientX - I.sx) / cam.z, dy = (e.clientY - I.sy) / cam.z;
      I.sx = e.clientX; I.sy = e.clientY;
      if (n.boardId) {
        const b = board(n.boardId);
        n.rx = Math.max(4, Math.min(b.w - 30, (n.rx || 0) + dx));
        n.ry = Math.max(4, Math.min(b.h - 30, (n.ry || 0) + dy));
      } else { n.x += dx; n.y += dy; }
      const el = nodeEl(n.id); if (el) { el.style.left = (n.rx !== undefined ? n.rx : n.x) + "px"; el.style.top = (n.ry !== undefined ? n.ry : n.y) + "px"; }
      drawEdges(); renderMinimap();
      return;
    }
    if (I.kind === "move-b") {
      const b = board(I.bid); if (!b) return;
      b.x += (e.clientX - I.sx) / cam.z; b.y += (e.clientY - I.sy) / cam.z;
      I.sx = e.clientX; I.sy = e.clientY;
      const el = document.querySelector(`[data-bid="${b.id}"]`);
      if (el) { el.style.left = b.x + "px"; el.style.top = b.y + "px"; }
      drawEdges(); renderMinimap();
      return;
    }
    if (I.kind === "resize-b") {
      const b = board(I.bid); if (!b) return;
      b.w = Math.max(240, I.w + (e.clientX - I.sx) / cam.z);
      b.h = Math.max(160, I.h + (e.clientY - I.sy) / cam.z);
      const el = document.querySelector(`[data-bid="${b.id}"]`);
      if (el) { el.style.width = b.w + "px"; el.style.height = b.h + "px"; }
      drawEdges(); renderMinimap();
      return;
    }
    if (I.kind === "resize-n") {
      const n = nodeById(I.nid); if (!n) return;
      n.w = Math.max(120, I.w + (e.clientX - I.sx) / cam.z);
      n.h = Math.max(60, I.h + (e.clientY - I.sy) / cam.z);
      const el = nodeEl(n.id); if (el) { el.style.width = n.w + "px"; el.style.height = n.h + "px"; }
      drawEdges(); renderMinimap();
      return;
    }
  }

  function onUp(e) {
    const view = $("nt-view");
    if (I && I.kind === "edge") {
      const r = view.getBoundingClientRect();
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const tn = target ? target.closest(".nt-node, .nt-sticky") : null;
      if (tn && tn.dataset.nid && tn.dataset.nid !== I.id) {
        edges.push({ id: uid(), from: I.id, to: tn.dataset.nid });
        toast("Connected", "ok");
      }
      tempEdge = null;
      drawEdges(); persist();
    }
    if (I && I.kind === "draw-b") {
      const b = board(I.bid);
      if (b && (b.w < 60 || b.h < 60)) boards.splice(boards.indexOf(b), 1);
      drawBoardMode = false;
      view.classList.remove("drawing-board");
      renderCanvas(); renderMinimap(); persist();
      toast(b && b.w >= 60 ? "Board created" : "Board too small", b && b.w >= 60 ? "ok" : "warn");
    }
    if (I) {
      if (I.kind === "pan" || I.kind === "move-n" || I.kind === "move-b" || I.kind === "resize-b" || I.kind === "resize-n") persist();
      I = null;
    }
    view.classList.remove("panning");
  }

  function removeEdge(id) { edges.splice(edges.indexOf(edges.find((e) => e.id === id)), 1); drawEdges(); persist(); }

  /* ---------------- node / note mutation helpers ---------------- */
  function sendNoteToCanvas(noteId, world) {
    const n = note(noteId); if (!n) return;
    let boardId = null, rx, ry;
    if (world) {
      for (const b of boards) {
        if (world.x >= b.x && world.x <= b.x + b.w && world.y >= b.y && world.y <= b.y + b.h) {
          boardId = b.id; rx = Math.max(4, Math.min(b.w - 120, world.x - b.x)); ry = Math.max(4, Math.min(b.h - 40, world.y - b.y)); break;
        }
      }
    }
    const c = { id: uid(), kind: "note", noteId, boardId, rx, ry, x: world ? world.x : 0, y: world ? world.y : 0, w: 160, h: 90 };
    nodes.push(c);
    renderCanvas(); renderMinimap(); persist();
    toast(boardId ? "Placed in board" : "Added to canvas", "ok");
  }

  function addStickyToBoard(bid) {
    const b = board(bid); if (!b) return;
    nodes.push({ id: uid(), kind: "sticky", boardId: bid, rx: Math.max(10, Math.min(b.w - 150, (b.w - 150) / 2)), ry: 60, content: "Sticky note", color: "yellow", w: 140, h: 70 });
    renderCanvas(); renderMinimap(); persist();
    toast("Sticky added", "ok");
  }

  function dupBoard(bid) {
    const b = board(bid); if (!b) return;
    const nb = { ...b, id: uid(), x: b.x + 40, y: b.y + 40, title: b.title + " (copy)" };
    boards.push(nb);
    const kids = nodes.filter((n) => n.boardId === bid);
    for (const k of kids) nodes.push({ ...k, id: uid(), boardId: nb.id, rx: (k.rx || 0) + 14, ry: (k.ry || 0) + 14 });
    renderCanvas(); persist(); toast("Board duplicated", "ok");
  }

  function removeNode(nid) {
    const n = nodeById(nid); if (!n) return;
    nodes.splice(nodes.indexOf(n), 1);
    edges = edges.filter((e) => e.from !== nid && e.to !== nid);
    if (selNode === nid) selNode = null;
    renderCanvas(); renderMinimap(); persist();
  }

  /* ---------------- sidebar events ---------------- */
  let capture = { text: "", reminder: null, color: "white", images: [] };

  function saveCapture() {
    const q = $("nt-q");
    const text = (q.value || "").trim();
    if (!text) return;
    const lines = text.split("\n");
    const n = { id: uid(), type: "text", title: lines[0].slice(0, 60), body: lines.length > 1 ? lines.slice(1).join("\n") : "", color: capture.color, pinned: false, labels: [], images: capture.images, reminder: capture.reminder, createdAt: Date.now() };
    if (capture.images.length) n.type = "image";
    notes.push(n);
    q.value = ""; capture = { text: "", reminder: null, color: "white", images: [] };
    const cap = $("nt-cap"); if (cap) cap.classList.remove("open");
    const save = $("nt-q-save"); if (save) save.classList.add("off");
    syncQbar();
    renderSidebar(); persist();
    toast("Note saved", "ok");
  }

  function syncQbar() {
    const save = $("nt-q-save"); if (!save) return;
    const q = $("nt-q");
    save.classList.toggle("off", !(q.value || "").trim());
    save.textContent = (capture.images.length ? "Save " + capture.images.length + " img · " : "") + "Save";
  }

  function openModal(html) { const m = $("nt-modal"); $("nt-modal-box").innerHTML = html; m.classList.add("open"); }
  function closeModal() { $("nt-modal").classList.remove("open"); $("nt-modal-box").innerHTML = ""; }

  function modalLink() {
    openModal(`<h3>${ICON("link", 15)} Quick Link</h3>
      <input class="input" id="m-url" placeholder="https://…">
      <input class="input" id="m-title" placeholder="Title (optional)">
      <div class="row"><button class="btn" data-close>Cancel</button><button class="btn primary" id="m-save">Save</button></div>`);
    $("m-save").onclick = () => {
      const url = $("m-url").value.trim();
      if (!url) { toast("Enter a URL", "warn"); return; }
      notes.push({ id: uid(), type: "link", title: $("m-title").value.trim() || url, url, color: "white", pinned: false, labels: [], createdAt: Date.now() });
      closeModal(); renderSidebar(); persist(); toast("Link note saved", "ok");
    };
  }

  function modalImage(cb) {
    openModal(`<h3>${ICON("image", 15)} Add image</h3>
      <div class="file-row"><input type="file" id="m-file" accept="image/*" multiple></div>
      <input class="input" id="m-urlimg" placeholder="…or paste an image URL">
      <input class="input" id="m-title" placeholder="Title (optional)">
      <div class="row"><button class="btn" data-close>Cancel</button><button class="btn primary" id="m-save">Save</button></div>`);
    const files = [];
    $("m-file").onchange = (e) => {
      [...e.target.files].forEach((f) => {
        const rd = new FileReader();
        rd.onload = () => { files.push(rd.result); syncQbar(); };
        rd.readAsDataURL(f);
      });
    };
    $("m-save").onclick = () => {
      const url = $("m-urlimg").value.trim();
      const imgs = files.slice();
      if (url) imgs.push(url);
      if (!imgs.length) { toast("Add a file or URL", "warn"); return; }
      cb(imgs, $("m-title").value.trim());
      closeModal();
    };
  }

  function modalDraw() {
    openModal(`<h3>${ICON("pen-tool", 15)} Quick drawing</h3>
      <canvas class="nt-draw-canvas" id="m-canvas"></canvas>
      <div class="row">
        <button class="btn" id="m-clear">Clear</button>
        <span style="flex:1"></span>
        <button class="btn" data-close>Cancel</button>
        <button class="btn primary" id="m-save">Save</button>
      </div>`);
    const cv = $("m-canvas"); const cx = cv.getContext("2d");
    cv.width = cv.clientWidth * 2; cv.height = cv.clientHeight * 2;
    cx.fillStyle = "#FDFCF7"; cx.fillRect(0, 0, cv.width, cv.height);
    cx.lineWidth = 5; cx.lineCap = "round"; cx.strokeStyle = "#202124";
    let drawing = false;
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * 2, y: (e.clientY - r.top) * 2 }; };
    cv.addEventListener("pointerdown", (e) => { drawing = true; cx.beginPath(); const p = pos(e); cx.moveTo(p.x, p.y); try { cv.setPointerCapture(e.pointerId); } catch (err) {} });
    cv.addEventListener("pointermove", (e) => { if (!drawing) return; const p = pos(e); cx.lineTo(p.x, p.y); cx.stroke(); });
    cv.addEventListener("pointerup", () => { drawing = false; });
    $("m-clear").onclick = () => { cx.fillStyle = "#FDFCF7"; cx.fillRect(0, 0, cv.width, cv.height); };
    $("m-save").onclick = () => {
      notes.push({ id: uid(), type: "sketch", title: "Sketch", images: [cv.toDataURL()], color: "white", pinned: false, labels: [], createdAt: Date.now() });
      closeModal(); renderSidebar(); persist(); toast("Sketch saved", "ok");
    };
  }

  function labelPop(nid) {
    const n = note(nid); if (!n) return;
    openModal(`<h3>${ICON("tag", 15)} Label</h3>
      <input class="input" id="m-label" placeholder="e.g. Ideas, Q4, Research" value="">
      <div class="row"><button class="btn" data-close>Done</button><button class="btn primary" id="m-save">Add</button></div>`);
    $("m-save").onclick = () => {
      const v = $("m-label").value.trim(); if (!v) return;
      n.labels = n.labels || []; n.labels.push({ text: v, color: n.color === "yellow" ? "yellow" : "" });
      closeModal(); renderSidebar(); persist();
    };
  }

  function cycleReminder(nid) {
    const n = note(nid); if (!n) return;
    const seq = [null, "Today 18:00", "Tomorrow 09:00"];
    n.reminder = seq[(seq.indexOf(n.reminder) + 1) % seq.length];
    renderSidebar(); persist();
  }

  function onSideClick(e) {
    const t = e.target;
    const menuBtn = t.closest("[data-cmenu='open']");
    if (menuBtn) {
      e.stopPropagation();
      closeAllPops();
      popTrigger = menuBtn;
      const card = menuBtn.closest(".nt-card");
      const pop = document.createElement("div");
      pop.className = "nt-pop";
      pop.innerHTML = `
        <button data-dup>${ICON("copy", 14)} Duplicate</button>
        <button data-del class="danger">${ICON("trash-2", 14)} Delete</button>
        <div class="nt-pop-colors">${CARD_ORDER.map((c) => `<span class="swatch" data-c="${c}" style="background:${CARD_BG[c]}" title="${c}"></span>`).join("")}</div>`;
      card.appendChild(pop);
      card.querySelector(".nt-card-menu").style.zIndex = 30;
      pop.querySelector("[data-dup]").onclick = () => { const n = note(card.dataset.id); notes.push({ ...n, id: uid(), title: n.title + " (copy)", pinned: false, createdAt: Date.now() }); closeAllPops(); renderSidebar(); persist(); toast("Duplicated", "ok"); };
      pop.querySelector("[data-del]").onclick = () => { notes.splice(notes.indexOf(note(card.dataset.id)), 1); nodes = nodes.filter((x) => x.noteId !== card.dataset.id); edges = edges.filter((x) => !nodes.find((nn) => nn.id === x.from || nn.id === x.to)); closeAllPops(); renderSidebar(); renderCanvas(); persist(); toast("Note deleted", "ok"); };
      pop.querySelectorAll(".nt-pop-colors .swatch").forEach((sw) => sw.onclick = () => { const n = note(card.dataset.id); n.color = sw.dataset.c; closeAllPops(); renderSidebar(); persist(); });
      return;
    }
    const foot = t.closest("[data-cact]");
    if (foot) {
      const card = foot.closest(".nt-card"); const nid = card.dataset.id;
      const act = foot.dataset.cact;
      if (act === "tag") labelPop(nid);
      else if (act === "rem") cycleReminder(nid);
      else if (act === "img") modalImage((imgs, title) => { const n = note(nid); n.images = (n.images || []).concat(imgs); if (title) n.title = title; if (imgs.length && n.type === "text") n.type = "image"; renderSidebar(); persist(); toast("Image added", "ok"); });
      else if (act === "send") {
        const v = $("nt-view");
        sendNoteToCanvas(nid, stw(v.clientWidth / 2, v.clientHeight / 2));
      } else if (act === "pin") { const n = note(nid); n.pinned = !n.pinned; renderSidebar(); persist(); }
      return;
    }
  }

  function closeAllPops() { document.querySelectorAll(".nt-pop, .nt-board-pop, #nt-c-menu .pop").forEach((p) => p.remove()); }
  let popTrigger = null;

  /* sidebar inline editing */
  function onSideInput(e) {
    const t = e.target;
    if (t.classList.contains("nt-c-title")) { const n = note(t.closest(".nt-card").dataset.id); n.title = t.textContent; persist(); return; }
    if (t.classList.contains("nt-c-text")) { const n = note(t.closest(".nt-card").dataset.id); n.body = t.textContent; persist(); return; }
    if (t.closest(".nt-cl")) {
      const card = t.closest(".nt-card"); const n = note(card.dataset.id);
      const li = t.closest("li"); const idx = [...card.querySelectorAll(".nt-cl li")].indexOf(li);
      if (t.matches("input")) { n.items[idx].checked = t.checked; li.classList.toggle("done", t.checked); persist(); return; }
      if (t.matches("span")) { n.items[idx].text = t.textContent; persist(); return; }
    }
  }

  function onSideChange(e) {
    const t = e.target;
    if (t.matches(".nt-card input[type=checkbox]")) {
      const card = t.closest(".nt-card"); const n = note(card.dataset.id);
      const li = t.closest("li"); const idx = [...card.querySelectorAll(".nt-cl li")].indexOf(li);
      n.items[idx].checked = t.checked; li.classList.toggle("done", t.checked); persist();
    }
  }

  /* ---------------- canvas inline editing (synced to note) ---------------- */
  function onCanvasInput(e) {
    const t = e.target;
    if (!t.matches("[contenteditable]")) return;
    const el = t.closest(".nt-node, .nt-sticky");
    if (!el) return;
    const n = nodeById(el.dataset.nid); if (!n) return;
    if (n.kind === "sticky") { n.content = t.textContent; persist(); return; }
    const nte = note(n.noteId); if (!nte) return;
    if (t.classList.contains("nt-n-title")) nte.title = t.textContent;
    else if (t.classList.contains("nt-n-text")) nte.body = t.textContent;
    else if (t.closest(".nt-cl")) {
      const li = t.closest("li"); const idx = [...el.querySelectorAll(".nt-cl li")].indexOf(li);
      if (t.matches("input")) { nte.items[idx].checked = t.checked; li.classList.toggle("done", t.checked); }
      else nte.items[idx].text = t.textContent;
    }
    clearTimeout(syncT);
    syncT = setTimeout(() => { renderSidebar(); }, 150);
    persist();
  }

  function onCanvasChange(e) {
    const t = e.target;
    if (t.matches(".nt-node input[type=checkbox], .nt-sticky input[type=checkbox]")) {
      const el = t.closest(".nt-node, .nt-sticky"); const n = nodeById(el.dataset.nid); if (!n) return;
      const nte = note(n.noteId); if (!nte) return;
      const li = t.closest("li"); const idx = [...el.querySelectorAll(".nt-cl li")].indexOf(li);
      nte.items[idx].checked = t.checked; li.classList.toggle("done", t.checked); persist();
    }
  }

  /* ---------------- board / node / menu events on canvas ---------------- */
  function onCanvasClick(e) {
    const t = e.target;
    const bMenu = t.closest("[data-bmenu]");
    if (bMenu) {
      e.stopPropagation();
      closeAllPops();
      popTrigger = bMenu;
      if (bMenu.dataset.bmenu === "sticky") { const bd = bMenu.closest(".nt-board"); addStickyToBoard(bd.dataset.bid); return; }
      const bd = bMenu.closest(".nt-board"); const b = board(bd.dataset.bid);
      const pop = document.createElement("div");
      pop.className = "nt-board-pop";
      pop.innerHTML = `
        <button data-bb="sticky">${ICON("sticky-note", 14)} Add sticky</button>
        <button data-bb="dup">${ICON("copy", 14)} Duplicate board</button>
        <button data-bb="del" class="danger">${ICON("trash-2", 14)} Delete board</button>
        <div class="colors">${BOARD_COLORS.map((c) => `<span class="swatch" data-bc="${c}" style="background:${c === "yellow" ? "#F5B83C" : c === "blue" ? "#5B8DFF" : c === "green" ? "#3EE8A6" : c === "red" ? "#FF6B6B" : "#A78BFA"}" title="${c}"></span>`).join("")}</div>`;
      pop.style.position = "absolute";
      bMenu.closest(".nt-board-menu").appendChild(pop);
      pop.querySelector('[data-bb="sticky"]').onclick = () => { addStickyToBoard(b.id); closeAllPops(); };
      pop.querySelector('[data-bb="dup"]').onclick = () => { dupBoard(b.id); closeAllPops(); };
      pop.querySelector('[data-bb="del"]').onclick = () => { boards.splice(boards.indexOf(b), 1); nodes = nodes.filter((x) => x.boardId !== b.id); edges = edges.filter((x) => !nodes.find((nn) => nn.id === x.from || nn.id === x.to)); closeAllPops(); renderCanvas(); renderMinimap(); persist(); toast("Board deleted", "ok"); };
      pop.querySelectorAll("[data-bc]").forEach((sw) => sw.onclick = () => { b.color = sw.dataset.bc; closeAllPops(); renderCanvas(); persist(); });
      return;
    }
    const nDel = t.closest(".nt-n-del");
    if (nDel) { removeNode(nDel.closest("[data-nid]").dataset.nid); return; }
    const cMenu = t.closest("#nt-c-menu");
    if (cMenu) {
      e.stopPropagation();
      closeAllPops();
      popTrigger = cMenu;
      const pop = document.createElement("div");
      pop.className = "pop";
      pop.innerHTML = `
        <div class="lbl">Canvas</div>
        <button data-ca="board">${ICON("square-dashed", 14)} Draw new board</button>
        <button data-ca="grid">${ICON("grid-3x3", 14)} Toggle dot grid</button>
        <button data-ca="clear" class="danger" style="color:var(--red)">${ICON("trash-2", 14)} Clear canvas</button>`;
      cMenu.appendChild(pop);
      pop.querySelector('[data-ca="board"]').onclick = () => { drawBoardMode = true; $("nt-view").classList.add("drawing-board"); closeAllPops(); toast("Drag on canvas to draw a board", "ok"); };
      pop.querySelector('[data-ca="grid"]').onclick = () => { const g = document.querySelector(".grid-bg"); g.style.display = g.style.display === "none" ? "" : "none"; closeAllPops(); };
      pop.querySelector('[data-ca="clear"]').onclick = () => { boards.length = 0; nodes.length = 0; edges.length = 0; closeAllPops(); renderCanvas(); renderMinimap(); persist(); toast("Canvas cleared", "ok"); };
      return;
    }
  }

  /* ---------------- drag from sidebar -> canvas ---------------- */
  function onCardDragStart(e) {
    const card = e.target.closest(".nt-card");
    if (!card || e.target.closest("[contenteditable]")) return;
    card.classList.add("dragging");
    e.dataTransfer.setData("text/plain", card.dataset.id);
    e.dataTransfer.effectAllowed = "copy";
  }
  function onCardDragEnd(e) { const c = e.target.closest(".nt-card"); if (c) c.classList.remove("dragging"); }
  function onCanvasDragOver(e) { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }
  function onCanvasDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    const r = $("nt-view").getBoundingClientRect();
    const w = stw(e.clientX - r.left, e.clientY - r.top);
    sendNoteToCanvas(id, w);
  }

  /* ---------------- keyboard ---------------- */
  function onKey(e) {
    if (e.key === " " && !e.target.matches("input, textarea, [contenteditable]")) { spaceDown = true; e.preventDefault(); }
    if (e.key === "Escape") { closeAllPops(); closeModal(); drawBoardMode = false; $("nt-view").classList.remove("drawing-board"); if (selNode || selEdge) { selNode = null; selEdge = null; renderCanvas(); } }
    if ((e.key === "Delete" || e.key === "Backspace") && !e.target.matches("input, textarea, [contenteditable]")) {
      if (selEdge) { removeEdge(selEdge); selEdge = null; }
      else if (selNode) { removeNode(selNode); selNode = null; }
    }
  }
  document.addEventListener("keyup", (e) => { if (e.key === " ") spaceDown = false; });

  /* ---------------- wire everything ---------------- */
  function boot() {
    $("nt-app").innerHTML = `
      <div class="nt-side" id="nt-side">
        <header class="nt-side-head">
          <div class="nt-brand-tile">N</div>
          <div class="nt-brand">Notes Canvas</div>
          <button class="nt-icon-btn" id="nt-collapse" title="Collapse sidebar">${ICON("chevrons-left", 16)}</button>
        </header>
        <div class="nt-cap" id="nt-cap">
          <input class="nt-cap-input" id="nt-q" placeholder="Take a note…">
          <div class="nt-qbar" id="nt-qbar">
            <button class="nt-icon-btn" data-c="rem" title="Reminder">${ICON("bell", 14)}</button>
            <button class="nt-icon-btn" data-c="share" title="Share">${ICON("share-2", 14)}</button>
            <button class="nt-icon-btn" data-c="color" title="Color">${ICON("palette", 14)}</button>
            <button class="nt-icon-btn" data-c="img" title="Image">${ICON("image", 14)}</button>
            <span class="spacer"></span>
            <button class="save off" id="nt-q-save">Save</button>
          </div>
          <div class="nt-cap-color" id="nt-cap-color">${CARD_ORDER.map((c) => `<span class="swatch" data-cc="${c}" style="background:${CARD_BG[c]}" title="${c}"></span>`).join("")}</div>
        </div>
        <div class="nt-quick">
          <button data-quick="link">${ICON("link", 13)} Link</button>
          <button data-quick="image">${ICON("image", 13)} Image</button>
          <button data-quick="draw">${ICON("pen-tool", 13)} Draw</button>
        </div>
        <div class="nt-list" id="nt-list"></div>
      </div>
      <div class="nt-canvas" id="nt-canvas">
        <div class="nt-view" id="nt-view">
          <div class="nt-inner" id="nt-inner"><div class="grid-bg"></div><svg class="nt-edges" id="nt-edges"></svg></div>
        </div>
        <div class="nt-c-top">
          <button class="nt-c-btn" id="nt-c-grid" title="Toggle dot grid">${ICON("grid-3x3", 15)}</button>
          <button class="nt-c-btn" id="nt-c-menu" title="Canvas menu">${ICON("ellipsis-vertical", 15)}</button>
        </div>
        <div class="nt-zoom">
          <button id="nt-zoom-out" title="Zoom out">${ICON("minus", 14)}</button>
          <span class="pct" id="nt-zoom-pct">100%</span>
          <button id="nt-zoom-in" title="Zoom in">${ICON("plus", 14)}</button>
        </div>
        <div class="nt-mini" id="nt-mini"><div class="nt-mini-in" id="nt-mini-in"></div></div>
        <div class="nt-tip">space + drag / middle mouse · wheel zoom · drag cards onto canvas</div>
      </div>`;

    /* sidebar */
    $("nt-collapse").onclick = () => { const a = $("nt-app"); a.classList.toggle("collapsed"); const b = $("nt-collapse"); b.innerHTML = ICON(a.classList.contains("collapsed") ? "chevrons-right" : "chevrons-left", 16); };
    $("nt-q").addEventListener("focus", () => $("nt-cap").classList.add("open"));
    $("nt-q").addEventListener("input", syncQbar);
    $("nt-q").addEventListener("blur", () => { setTimeout(() => { if (!$("nt-cap").contains(document.activeElement)) $("nt-cap").classList.remove("open"); }, 150); });
    $("nt-q-save").onclick = saveCapture;
    document.querySelector('[data-c="rem"]').onclick = () => { capture.reminder = capture.reminder ? null : "Today 18:00"; toast(capture.reminder ? "Reminder set for today 18:00" : "Reminder removed", "ok"); };
    document.querySelector('[data-c="share"]').onclick = () => toast("Share link copied (simulated)", "ok");
    document.querySelector('[data-c="color"]').onclick = () => $("nt-cap-color").classList.toggle("open");
    document.querySelector('[data-c="img"]').onclick = () => modalImage((imgs, title) => { capture.images = capture.images.concat(imgs); if (title) capture.text = title; syncQbar(); toast(imgs.length + " image(s) attached", "ok"); });
    $("nt-cap-color").querySelectorAll(".swatch").forEach((s) => s.onclick = () => { capture.color = s.dataset.cc; $("nt-cap-color").querySelectorAll(".swatch").forEach((x) => x.classList.toggle("sel", x === s)); $("nt-cap-color").classList.remove("open"); });

    document.querySelector('[data-quick="link"]').onclick = modalLink;
    document.querySelector('[data-quick="image"]').onclick = () => modalImage((imgs, title) => { notes.push({ id: uid(), type: "image", title: title || "Image note", images: imgs, color: "white", pinned: false, labels: [], createdAt: Date.now() }); renderSidebar(); persist(); toast("Image note saved", "ok"); });
    document.querySelector('[data-quick="draw"]').onclick = modalDraw;

    $("nt-list").addEventListener("click", onSideClick);
    $("nt-list").addEventListener("input", onSideInput);
    $("nt-list").addEventListener("change", onSideChange);

    /* canvas */
    $("nt-view").addEventListener("pointerdown", onViewDown);
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    $("nt-canvas").addEventListener("click", onCanvasClick);
    $("nt-view").addEventListener("dragover", onCanvasDragOver);
    $("nt-view").addEventListener("drop", onCanvasDrop);
    $("nt-view").addEventListener("input", onCanvasInput);
    $("nt-view").addEventListener("change", onCanvasChange);
    $("nt-view").addEventListener("wheel", (e) => { e.preventDefault(); const r = $("nt-view").getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.12 : 0.89, e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    $("nt-mini-in").addEventListener("pointerdown", (e) => {
      const v = $("nt-view"); const r = v.getBoundingClientRect();
      const w = stw(e.clientX - r.left, e.clientY - r.top);
      cam.x = v.clientWidth / 2 - w.x * cam.z;
      cam.y = v.clientHeight / 2 - w.y * cam.z;
      applyCam(); persist();
      I = { kind: "mini" };
      e.preventDefault();
    });
    $("nt-zoom-in").onclick = () => { const v = $("nt-view"); zoomAt(1.25, v.clientWidth / 2, v.clientHeight / 2); };
    $("nt-zoom-out").onclick = () => { const v = $("nt-view"); zoomAt(0.8, v.clientWidth / 2, v.clientHeight / 2); };
    $("nt-c-grid").onclick = () => { const g = document.querySelector(".grid-bg"); g.style.display = g.style.display === "none" ? "" : "none"; };
    $("nt-app").addEventListener("dragstart", onCardDragStart);
    $("nt-app").addEventListener("dragend", onCardDragEnd);

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", (e) => { const m = $("nt-modal"); if (m && m.classList.contains("open") && !e.target.closest(".nt-modal-box") && !e.target.closest("[data-quick], [data-cact]")) closeModal(); if (!e.target.closest(".nt-pop, .nt-board-pop") && e.target !== popTrigger) closeAllPops(); });
    document.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });

    render();
    if (window.lucide) lucide.createIcons();
    applyCam();
    persist();
  }

  PL.on(boot);
  window.NT = { S, notes, boards, nodes, edges, render, renderCanvas, renderSidebar, renderMinimap, applyCam, setCam: (x, y, z) => { cam.x = x; cam.y = y; cam.z = z; applyCam(); persist(); }, persist, addStickyToBoard, sendNoteToCanvas, zoomAt };
})();
