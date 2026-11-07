/* PUNCHLINE — Settings logic */
(function () {
  "use strict";
  const D = window.DATA;
  const $ = (id) => document.getElementById(id);

  function renderHead() {
    $("page-head").innerHTML = PL.pageHeader(
      "Settings",
      "AI providers, task routing, and honest request logs. Keys never touch this page — they live server-side."
    );
  }

  function fillProviderSelect(providers) {
    $("key-provider").innerHTML = D.providers.map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
  }

  function renderProviderModels() {
    const id = $("key-provider").value;
    const p = D.providers.find((x) => x.id === id);
    const el = $("provider-models");
    if (!p) return (el.innerHTML = "");
    const free = p.free || [];
    const hasFree = free.length && free[0].model !== "—";
    el.innerHTML = `
      <div class="model-preview">
        <div class="model-preview-title">${hasFree ? '<i data-lucide="badge-check" style="width:13px;height:13px"></i> Free models on this provider' : '<i data-lucide="info" style="width:13px;height:13px"></i> Pricing note'}</div>
        <div class="model-preview-body">
          ${free.map((m) => `<div class="model-chip"><span class="model-name">${PL.esc(m.model)}</span><span class="model-note">${PL.esc(m.note)}</span></div>`).join("")}
        </div>
      </div>`;
    if (window.lucide) lucide.createIcons();
  }

  function renderProviders(serverProviders) {
    $("providers").innerHTML = D.providers.map((p) => {
      const masked = serverProviders && serverProviders[p.id] && serverProviders[p.id].keyMasked;
      return `
        <div class="rounded-xl p-3 text-center" style="background:#fff;border:1px solid var(--line)">
          <div class="text-[12.5px] font-bold text-[#1C1C1E]">${p.name}</div>
          <div class="muted text-[11px] mt-0.5 truncate" title="${PL.esc(p.models)}">${PL.esc(p.models)}</div>
          <div class="mt-2">${masked ? PL.pill("Key saved", "green", true) : PL.pill("No key", "amber", true)}</div>
          ${masked ? `<div class="text-[10.5px] text-[#B5B5BB] mt-1">${PL.esc(masked)}</div>` : ""}
        </div>`;
    }).join("");
  }

  function renderRouting() {
    $("routing-body").innerHTML = D.routing.map((r) => `
      <tr>
        <td class="font-semibold text-[#1C1C1E]">${PL.esc(r.role)}</td>
        <td class="muted">${PL.esc(r.provider)}</td>
        <td class="muted">${PL.esc(r.model)}</td>
      </tr>`).join("");
  }

  function renderLogs(items) {
    $("logs-body").innerHTML = items.map((l) => `
      <tr>
        <td class="font-semibold text-[#1C1C1E]">${PL.esc(l.task)}</td>
        <td class="muted">${PL.esc(l.provider)}</td>
        <td class="muted">${PL.esc(l.model || "—")}</td>
        <td>${l.status === "ok" ? PL.pill("OK", "green", true) : PL.pill("ERR", "red", true)}</td>
      </tr>`).join("") || `<tr><td colspan="4" class="muted">No requests logged yet.</td></tr>`;
  }

  async function loadSettings() {
    const s = await PL_API.settings();
    renderProviders(s.providers);
    renderKeysModels(s.providers);
  }

  async function renderKeysModels(serverProviders) {
    const tbody = $("keys-models-body");
    const saved = serverProviders ? Object.entries(serverProviders).filter(([, v]) => v.keyMasked) : [];
    if (!saved.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="muted text-center py-6">No keys saved yet — add one above and it appears here with its available models.</td></tr>`;
      return;
    }
    tbody.innerHTML = saved.map(([id, v]) => {
      const p = D.providers.find((x) => x.id === id);
      return `
        <tr data-provider="${id}">
          <td class="font-semibold text-[#1C1C1E] whitespace-nowrap">${PL.esc(p ? p.name : id)}</td>
          <td><span class="muted text-[12px] font-mono">${PL.esc(v.keyMasked)}</span></td>
          <td><div class="flex flex-wrap items-center gap-1.5" id="models-cell-${id}"><span class="muted text-[12px]"><i data-lucide="loader" class="spin" style="width:13px;height:13px"></i> Fetching models…</span></div></td>
          <td class="text-right whitespace-nowrap">
            <div class="flex items-center justify-end gap-2">
              <button class="btn btn-ghost btn-sm" data-act="test" data-provider="${id}"><i data-lucide="plug-zap" style="width:14px;height:14px"></i> Test</button>
              <button class="btn btn-ghost btn-sm" data-act="remove" data-provider="${id}" style="color:#C93A3F"><i data-lucide="trash-2" style="width:14px;height:14px"></i> Remove</button>
            </div>
            <div id="test-cell-${id}" class="mt-1 text-left"></div>
          </td>
        </tr>`;
    }).join("");
    if (window.lucide) lucide.createIcons();
    saved.forEach(([id]) => fillModelsCell(id));
  }

  async function fillModelsCell(id) {
    const cell = $("models-cell-" + id);
    if (!cell) return;
    cell.innerHTML = `<span class="muted text-[12px]"><i data-lucide="loader" class="spin" style="width:13px;height:13px"></i> Fetching models…</span>`;
    const res = await PL_API.models(id);
    if (!res.ok) {
      cell.innerHTML = `<span class="pill red" title="${PL.esc(res.error || "error")}">${PL.esc((res.error || "Failed").slice(0, 60))}</span>`;
      return;
    }
    const shown = res.models.slice(0, 8);
    cell.innerHTML = shown.map((m) => `<span class="tag">${PL.esc(m)}</span>`).join("")
      + (res.count > shown.length ? `<span class="muted text-[11.5px]">+${res.count - shown.length} more</span>` : "")
      + `<span class="muted text-[11.5px]">· ${res.count} models</span>`;
  }

  async function testKeyFor(provider, cellEl, btn) {
    const prev = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="spin" style="width:14px;height:14px"></i> Testing…`;
    try {
      const res = await PL_API.testKey(provider);
      cellEl.innerHTML = res.ok
        ? `<div class="pill green"><i data-lucide="check-circle" style="width:13px;height:13px"></i> ${res.provider} OK · ${res.model} · ${res.latency}</div>`
        : `<div class="pill red"><i data-lucide="alert-triangle" style="width:13px;height:13px"></i> ${escapeHtml(res.error || "failed")}</div>`;
      PL.toast(res.ok ? "Key works" : "Key failed", res.ok ? "check-circle" : "alert-triangle");
    } catch (e) {
      console.error("testKeyFor failed:", e);
      cellEl.innerHTML = `<div class="pill red">Server unreachable</div>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = prev;
      if (window.lucide) lucide.createIcons();
    }
  }

  async function removeKeyFor(provider) {
    if (!window.confirm(`Remove the ${provider} key?`)) return;
    await PL_API.removeKey(provider);
    PL.toast("Key removed", "trash-2");
    loadSettings();
  }

  async function loadLogs() {
    const items = await PL_API.logs(30);
    renderLogs(items);
  }

  function showTestResult(res) {
    const el = $("test-result");
    if (!res) return;
    if (res.ok) {
      el.innerHTML = `<div class="pill green"><i data-lucide="check-circle" style="width:14px;height:14px"></i> ${res.provider} OK · ${res.model} · ${res.latency}</div>`;
    } else {
      el.innerHTML = `<div class="pill red"><i data-lucide="alert-triangle" style="width:14px;height:14px"></i> ${res.provider || ""} failed: ${escapeHtml(res.error || "unknown error")}</div>`;
    }
    if (window.lucide) lucide.createIcons();
  }

  async function testKey() {
    const provider = $("key-provider").value;
    const btn = $("btn-test-key");
    const prev = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader" class="spin" style="width:16px;height:16px"></i> Testing…`;
    try {
      const res = await PL_API.testKey(provider);
      showTestResult(res);
      if (res.ok) PL.toast("Key works", "check-circle");
      else PL.toast("Key failed", "alert-triangle");
    } catch (e) {
      console.error("testKey failed:", e);
      showTestResult({ ok: false, error: "Server unreachable — open http://localhost:3000" });
    } finally {
      btn.disabled = false;
      btn.innerHTML = prev;
    }
  }

  async function saveKey() {
    const provider = $("key-provider").value;
    const key = $("key-value").value.trim();
    if (!key) return PL.toast("Paste a key first", "info");
    if (location.protocol === "file:") {
      return PL.toast("Open the app via http://localhost:3000 — not as a local file", "link");
    }
    try {
      await PL_API.saveSettings({ [provider]: key });
      $("key-value").value = "";
      $("test-result").innerHTML = "";
      $("btn-test-key").classList.remove("hidden");
      PL.toast("Key saved on the server", "check-circle");
      loadSettings();
    } catch (e) {
      console.error("saveKey failed:", e);
      PL.toast("Save failed — server unreachable. Open http://localhost:3000 and try again", "alert-triangle");
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  PL.on(() => {
    renderHead();
    fillProviderSelect();
    renderProviderModels();
    renderRouting();
    loadSettings();
    loadLogs();
    $("key-provider").addEventListener("change", renderProviderModels);
    $("btn-save-key").addEventListener("click", saveKey);
    $("btn-test-key").addEventListener("click", testKey);
    $("btn-refresh-logs").addEventListener("click", () => { loadLogs(); PL.toast("Logs refreshed", "refresh-cw"); });
    $("keys-models-body").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const provider = btn.dataset.provider;
      if (btn.dataset.act === "test") testKeyFor(provider, $("test-cell-" + provider), btn);
      if (btn.dataset.act === "remove") removeKeyFor(provider);
    });
  });
})();
