/* ============================================================
   PUNCHLINE — API layer. Talks to the Express backend at /api.
   When the backend is unreachable (or no key is configured) it
   falls back to clearly-labeled local simulation using the demo
   dataset, so the whole pipeline still works offline.
   ============================================================ */
(function () {
  "use strict";

  const D = () => (window.DATA || {});

  const online = { value: null };

  async function detect() {
    try {
      const r = await fetch("/api/health", { method: "GET" });
      const j = await r.json();
      online.value = !!(r.ok && j.ok);
    } catch (e) {
      online.value = false;
    }
    const el = document.getElementById("backend-state");
    if (el) {
      el.textContent = online.value ? "Backend connected" : "Local simulation (no backend)";
      el.className = online.value
        ? "pill green"
        : "pill amber";
      el.title = online.value ? "Server reachable" : "Add an API key + start the server for live AI";
    }
    return online.value;
  }

  /* Local demo generator — returns realistic content, honestly labeled. */
  function simulate(task, payload) {
    const data = D();
    const pick = (arr, key) => {
      if (!Array.isArray(arr)) return [];
      if (payload && payload[key] != null) {
        const found = arr.find((x) => String(x[key]).toLowerCase() === String(payload[key]).toLowerCase());
        if (found) return [found];
      }
      return arr;
    };

    switch (task) {
      case "extract_product": {
        const p = data.product || {};
        return { product: p, facts: p.facts || [], unknowns: p.unknowns || [], score: p.score || {} };
      }
      case "brand":
        return data.brand || {};
      case "personas":
        return { personas: pick(data.personas, "id") };
      case "usp":
        return data.strategy || {};
      case "strategy":
        return data.strategy || {};
      case "fb_strategy":
        return data.fbPlan || {};
      case "landing_pages":
        return { landings: data.landings || [] };
      case "ad_ideas":
        return { ideas: data.adIdeas || [] };
      case "offer":
        return { offers: data.offers || [] };
      case "competitors":
        return { competitors: data.competitors || [], gaps: data.gaps || [] };
      case "creative_matrix":
        return data.matrix || {};
      case "hook_generator":
        return { hooks: pick(data.hooks, "id") };
      case "ugc_scripts":
        return { scripts: pick(data.ugcScripts, "id") };
      case "test_plan":
        return { plan: data.testPlan || [] };
      case "campaigns":
        return { campaigns: data.campaigns || [], diagnostics: data.diagnostics || [] };
      case "kpi":
        return { scores: data.scores || {}, series: data.kpiSeries || {} };
      case "analyze_ad":
        return { verdict: "UNKNOWN / NEEDS USER INPUT", strengths: ["Needs the actual ad file"], risks: ["Cannot verify claims without source material"], score: { overall: 5, hook: 5, clarity: 5, trust: 5, cta: 5 } };
      case "analyze_landing":
        return { verdict: "UNKNOWN / NEEDS USER INPUT", layout: ["Provide a URL or screenshot"], strengths: ["—"], issues: ["—"], score: { overall: 5, value: 5, clarity: 5, trust: 5, friction: 5 } };
      case "report":
        return { report: data.report || [] };
      case "priority":
        return { priorities: data.priorities || [] };
      case "final_decision":
        return { decision: (data.report || []).find((r) => r.id === 20) || { section: "Final Decision", body: "UNKNOWN / NEEDS USER INPUT" } };
      case "fb_summary":
        return { output: "**Executive summary**\n\n**Account:** Atlas Trade — DZ (2 connected accounts, 5 active campaigns)\n**Performance (30d):** Spend 4,310,000 DA · Gross revenue 10,570,000 DA · Profit 2,841,900 DA\n\n**Key insight:** Purchases — Codzilla Pro is the profit engine (Profit ROAS 1.94); the Leads funnel is spending 22% of budget but converting at CPL 345 DA with no retarget follow-through.\n\n**Top 3 next actions:**\n1. Shift 30% of the Leads budget into Purchases Cost Cap and raise the cap 10%.\n2. Kill the two lowest-ROAS static creatives and feed testing budget into UGC hook variations.\n3. Activate Retargeting — Cart Abandon with a 10% off + free delivery offer." };
      case "fb_diagnose":
        return { output: "**Diagnosis:** Ad is under-delivering.\n\n**Most likely root cause:** Creative fatigue + weak hook → CTR 0.9% and CPM rising 18% week-over-week.\n\n**Remedies:**\n1. Swap the first 2 seconds to a problem-led hook (sharpness test).\n2. Move budget cap to Cost Cap and reduce daily budget 15% while refreshing creative.\n3. Re-launch to a warm audience (30d site visitors) to stabilize delivery." };
      case "fb_copy_improve":
        return { output: "**Improved primary text (3 versions):**\n1. \"17 razors-sharp knives, one price. Delivery to your door in 48h — pay only when you receive.\"\n2. \"Watch how easily this tomato dies. Your cooking changes today.\"\n3. \"Chef knives don't have to cost a chef's salary. 17 pieces, 3900 DA, cash on delivery.\"\n\n**3 new hooks:**\n- \"Stop buying knives every 6 months.\"\n- \"The test that sells 17 knives in 30 seconds.\"\n- \"What your grandmother would tell you about cheap knives.\"\n\n**CTA suggestion:** \"Order now — pay at the door. 48h delivery Algeria-wide.\"" };
      case "fb_landing":
        return { output: "**Verdict:** 6.5/10 — functional but leaks mobile users.\n\n**Strengths:** clear offer, COD badge visible, local language.\n\n**Issues:**\n- Hero loads >4s on 4G.\n- No delivery-rate / trust section above the fold.\n- CTA competes with a 10%-off popup.\n\n**Fixes:** compress hero image, add a 'Trusted by 3,200+ buyers' strip, single CTA above fold, add WhatsApp order button." };
      case "fb_test_plan":
        return { output: "**Week 1 — Hook tests (1,500 DA/day):**\n- Test 1: Sharpness demo hook vs. price contrast hook (UGC, static).\n- Test 2: Problem hook vs. social proof hook.\n\n**Week 2 — Scale winners (2,500 DA/day):**\n- Test 3: Winning hook + new script variation, +20% budget.\n- Test 4: Retargeting test on cart abandoners with free-delivery offer.\n\n**Success metric:** Profit ROAS > 1.8 · **Decision rule:** +10% budget/day, kill below 1.2 after 2x ROAS-validated spend.\n\n**Creative brief (top test):** 20-30s UGC, hook = knife-through-cardboard sharpness test, CTA = \"Order now, pay at the door\"." };
      case "fb_winners":
        return { output: "| Ad | Verdict | Move |\n|---|---|---|\n| AD1 Sharpness UGC | Winner (Profit ROAS 2.31) | Scale +30% budget, Cost Cap |\n| AD3 Unboxing | Winner (2.05) | Scale +20%, watch CPM |\n| AD5 Static Price | Average (1.35) | Hold, refresh copy |\n| AD7 Testimonial | Average (1.21) | Hold, test new hook |\n| AD2 Demo Video | Poor (0.98) | Kill, move 40% budget to AD1 |\n\n**Summary:** 2 winners drive 61% of profit. Reallocate 40% of poor performers into winners, then re-test the killed angles with new hooks in the Testing campaign." };
      case "fb_scale":
        return { output: "**Scaling plan (7 days):**\n- Day 1-2: AD1 +30% daily budget (Cost Cap), AD3 +20%.\n- Day 3-4: If delivery rate stays >80%, +20% more. Watch CPM — if it jumps >25%, pause the raise.\n- Day 5-7: Add lookalike 2% buyers audience to winners.\n\n**Risks:**\n- CPM inflation on broad DZ → cap raise at +50% total.\n- Delivery rate drop if creative fatigues → prepare 2 backup hooks.\n- Don't scale both winners simultaneously beyond +50% or budget cannibalizes." };
      case "fb_budget":
        return { output: "| Campaign | Current | Recommended | Reason |\n|---|---|---|---|\n| Purchases — Codzilla Pro | 3,500 | 4,200 DA/day | Profit ROAS 1.94, scale winner |\n| Leads — Codzilla Pro | 1,800 | 1,300 DA/day | Over-spending, weak follow-through |\n| Retargeting — Cart Abandon | 1,200 | 1,600 DA/day | High intent, best payback |\n| Testing — New Angles | 2,500 | 2,500 DA/day | Keep steady, feed winners |\n| Brand — Prospecting Wave | 900 | 600 DA/day | Cut 30%, awareness already seeded |\n\n**Total:** 10,200 → 10,200 DA/day (reallocation, not new spend)." };
      case "fb_competitor":
        return { output: "**Competitor profiles (Algeria COD, kitchen knives):**\n1. **KnifePro DZ** — 12pc set, 2,900 DA, low-cost angle — strength: price; weakness: thin trust signals.\n2. **ChefMarket Algiers** — 8pc set, 3,400 DA, premium angle — strength: brand; weakness: slow delivery.\n3. **Couteaux Store** — 20pc set, 4,500 DA, volume angle — strength: range; weakness: high return rate.\n4. **MarocKnives Import** — 15pc, 3,100 DA — strength: aggressive retargeting; weakness: weak creative.\n5. **Local Supplier Page** — single chef knife, 1,800 DA — strength: local; weakness: no funnel.\n\n**3 market gaps:**\n1. Sharpness *proof* demos (nobody shows the cut test).\n2. COD-focused trust: delivery-rate guarantees + wilaya tracking.\n3. 48h delivery promise — almost nobody commits to it in DZ." };
      case "fb_report_weekly":
        return { output: "**Weekly performance report**\n\n**Summary:** 1,015,000 DA spend → 2,610,000 DA gross → 709,200 DA profit. Profit ROAS 1.81.\n\n**What worked:** AD1 sharpness UGC (ROAS 3.4), retargeting cart abandoners at 2.1 ROAS.\n\n**What failed:** AD2 demo video fatigue (ROAS 0.98), Leads campaign CPL up 12%.\n\n**Learnings:** Sharpness-proof hooks outperform price hooks 2:1; static creatives die within 5 days.\n\n**Next week plan:** Scale AD1 +30%, move 40% of AD2 budget, launch 2 new UGC hooks in Testing." };
      case "fb_report_monthly":
        return { output: "**Monthly strategy document**\n\n**Executive summary:** Account is profitable (2,841,900 DA profit, Profit ROAS 1.85) but concentrated in one campaign — concentration risk.\n\n**Account health:** 5/6 campaigns active, pixel healthy, CPM +8% MoM.\n\n**Creative learnings:** UGC sharpness demos win; static price ads fatigue fast.\n\n**Funnel economics:** true CAC 1,312 DA, break-even ROAS 1.52, current blended 1.85 — healthy margin, room to push spend.\n\n**30-60-90 day roadmap:** Days 1-30 scale winners + retargeting; Days 31-60 add lookalikes + new offer test (free delivery); Days 61-90 diversify to a second product line to reduce concentration risk.\n\n**Risks:** CPM inflation, delivery-rate seasonality, single-campaign dependency." };
      case "fb_hook":
        return { output: "**Hook analysis**\n\nBest performers: Sharpness demo (CTR 3.1%), Price contrast (2.6%), Problem-led (2.3%). Weakest: Announcement/hype (1.1%).\n\n**Next 5 hooks to test (knife set, COD):**\n1. \"Cut a tomato blindfolded.\" — curiosity + proof.\n2. \"Your knives are lying to you.\" — problem disruption.\n3. \"3,200 buyers can't all be wrong.\" — social proof.\n4. \"One order, 17 knives, zero risk.\" — offer framing.\n5. \"Pay 0 DA today.\" — COD anchoring." };
      case "fb_audience":
        return { output: "**Audience & placement recommendations**\n\nBest performing: Broad DZ 18-45 (2.1 ROAS), LAL 1% buyers (2.4 ROAS), IG Reels placement.\n\n**3 new audiences to test:**\n1. LAL 2% — 90d buyers + engagers.\n2. Interest: Algerian food/cooking channels 25-45.\n3. Custom: 30d site visitors who saw product page (warm retarget).\n\n**3 placement strategies:**\n1. Move cart-abandon retargeting to IG Reels only.\n2. Test FB Feed vs Reels split on the testing campaign.\n3. Add WhatsApp click-through to FB Messenger placement for COD confirmation." };
      case "fb_creative_ideas":
        return { output: "**6 creative concepts (based on winner AD1 sharpness UGC):**\n\n1. **Fruit Ninja** — 20s UGC: slicing 5 different fruits with one knife. Hook: \"Can your knife do this on day 30?\"\n2. **The Blindfold** — 15s: blindfolded chef cuts tomato. Hook: \"Trust isn't visual.\"\n3. **Kitchen Audit** — 25s: expert replaces your dull drawer with the set. Hook: \"Throw these away.\"\n4. **Price vs Sharpness** — 20s: split screen expensive vs Codzilla. Hook: \"3900 DA. Same result.\"\n5. **COD Testimonial** — 30s: real buyer shows the delivery box. Hook: \"I paid when it arrived.\"\n6. **The Challenge** — 22s: paper-cut test against competitor. Hook: \"Try this at home — we'll wait.\"" };
      case "fb_ask":
        return { output: "Consult the Meta Ads Intelligence Center docs for that. Provide a specific question (diagnose an ad, plan a test, optimize budget, craft creative) and I'll run it against your account data." };
      case "keyword_pull":
      case "web_research":
        return { results: [], note: "UNKNOWN — web research needs a configured provider with web access" };
      default:
        return { note: "UNKNOWN — no local generator for task '" + task + "'" };
    }
  }

  async function ai(task, payload, opts) {
    opts = opts || {};
    const body = { payload: payload || {} };
    if (opts.prompt) body.prompt = opts.prompt;
    if (opts.role) body.role = opts.role;
    if (opts.maxTokens) body.maxTokens = opts.maxTokens;

    if (online.value !== false) {
      try {
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), 180000);
        const r = await fetch(`/api/ai/${task}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: ctrl.signal,
        });
        clearTimeout(to);
        const j = await r.json();
        if (r.ok && j.ok && j.meta && j.meta.status === "ok") {
          if (j.data) {
            return { data: j.data, meta: j.meta, simulated: false };
          }
          return { data: null, meta: j.meta, simulated: true, reason: j.meta.note || "Server responded with no data" };
        }
        if (r.ok && j.meta && j.meta.note) {
          return { data: null, meta: j.meta, simulated: true, reason: j.meta.note };
        }
      } catch (e) {
        online.value = false;
      }
    }

    const data = simulate(task, payload);
    const meta = {
      provider: "demo",
      model: "simulated",
      tokens: "sim",
      latency: 300 + Math.round(Math.random() * 500) + "ms",
      cost: "$0.0000",
      status: "demo",
      note: "Local simulation — start the server + add a key for live AI",
    };
    return { data, meta, simulated: true };
  }

  async function settings() {
    try {
      const r = await fetch("/api/settings");
      return await r.json();
    } catch (e) {
      return { routing: {}, providers: {} };
    }
  }

  async function saveSettings(keys, routing) {
    const r = await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ keys: keys || {}, routing: routing || undefined }),
    });
    return await r.json();
  }

  async function testKey(provider) {
    const r = await fetch("/api/test-key", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ provider }),
    });
    return await r.json();
  }

  async function models(provider) {
    try {
      const r = await fetch(`/api/models/${provider}`);
      return await r.json();
    } catch (e) {
      return { ok: false, error: "server unreachable" };
    }
  }

  async function removeKey(provider) {
    const r = await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ removeKey: provider }),
    });
    return await r.json();
  }

  async function chat(messages, opts) {
    try {
      const body = { messages };
      if (opts) {
        if (opts.provider) {
          body.provider = opts.provider;
          if (opts.model) body.model = opts.model;
        }
        if (opts.system) body.system = opts.system;
      }
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return await r.json();
    } catch (e) {
      return { ok: false, error: "server unreachable" };
    }
  }

  async function logs(limit) {
    try {
      const r = await fetch(`/api/logs?limit=${limit || 50}`);
      const j = await r.json();
      return j.items || [];
    } catch (e) {
      return window.DATA.sampleLogs || [];
    }
  }

  async function entities(entity) {
    try {
      const r = await fetch(`/api/entities/${entity}`);
      const j = await r.json();
      return j.items || [];
    } catch (e) {
      return [];
    }
  }

  async function saveEntity(entity, item) {
    const r = await fetch(`/api/entities/${entity}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(item || {}),
    });
    return await r.json();
  }

  async function removeEntity(entity, id) {
    const r = await fetch(`/api/entities/${entity}/${id}`, { method: "DELETE" });
    return await r.json();
  }

  /* Run a task tool with the user's message as context; returns a shape the
     command center expects: { ok, data, meta, simulated }. */
  async function run(task, text) {
    const res = await ai(task, { note: text || "" });
    return {
      ok: !!(res && res.data != null),
      data: res && res.data != null ? res.data : null,
      meta: (res && res.meta) || {},
      simulated: !!(res && res.simulated),
    };
  }

  /* Make a provider the default for every task role. */
  async function setActiveProvider(provider) {
    const roles = ["vision", "deep", "fast", "cheap", "copywriting", "reasoning", "default"];
    const routing = {};
    roles.forEach((r) => (routing[r] = { provider, model: undefined }));
    return saveSettings(null, routing);
  }

  /* Wrap a local image file as an attachable reference. */
  function fileToDataUri(file, dataUrl) {
    return { uri: dataUrl, name: file.name, type: file.type, size: file.size };
  }

  window.PL_API = { detect, ai, settings, saveSettings, testKey, models, removeKey, chat, logs, entities, saveEntity, removeEntity, simulate, run, setActiveProvider, fileToDataUri };
})();
