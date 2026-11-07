/*
   PUNCHLINE — CUSTOMER DATA AI
   E-commerce customer database + audience intelligence platform.
   import → clean → resolve → 360 → segment → RFM → value → audience → export → privacy.
   Every number is computed from the local dataset; AI outputs are evidence-labeled
   (VERIFIED / ESTIMATED / INFERRED) and raw customer data never leaves this device.
*/
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ic = (n, s) => (window.PL && PL.icon ? PL.icon(n, s || 14) : `<i data-lucide="${n}" style="width:${s || 14}px;height:${s || 14}px"></i>`);
  const icons = () => { if (window.lucide) { try { lucide.createIcons(); } catch (e) {} } };
  const toast = (m, t) => { if (window.PL && PL.toast) PL.toast(m, t || "info"); };

  const NOW = new Date("2026-08-11T12:00:00");
  const DAY = 86400000;
  const daysAgo = (d) => Math.max(0, Math.round((NOW.getTime() - new Date(d).getTime()) / DAY));
  const dstr = (d) => new Date(d).toISOString().slice(0, 10);
  const addDays = (d, n) => new Date(new Date(d).getTime() + n * DAY);
  const money = (n) => (n < 0 ? "-" : "") + Math.abs(Math.round(n)).toLocaleString("en-US") + " DA";
  const b = (s) => "<b>" + s + "</b>";
  const num = (n, d) => Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: d == null ? 0 : d });
  const pct = (n, d) => (Number(n) * 100).toFixed(d == null ? 1 : d) + "%";
  const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pick = (a) => a[Math.floor(rand() * a.length)];
  const rint = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const rng = mulberry32(20260811);
  const rand = () => rng();
  const weigh = (pairs) => { const t = pairs.reduce((s, p) => s + p[1], 0); let r = rand() * t; for (const p of pairs) { r -= p[1]; if (r <= 0) return p[0]; } return pairs[0][0]; };
  const hash = (str) => { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return ("00000000" + (h >>> 0).toString(16)).slice(-8); };
  const normPhone = (p) => { if (!p) return ""; let s = String(p).replace(/[^\d+]/g, ""); if (s.startsWith("00213")) s = "0" + s.slice(5); if (s.startsWith("+213")) s = "0" + s.slice(4); if (s.startsWith("213") && s.length > 9) s = "0" + s.slice(3); if (s.length === 9 && s.startsWith("5")) s = "0" + s; return s; };
  const normEmail = (e) => String(e || "").trim().toLowerCase();
  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validPhone = (p) => /^0[567]\d{8}$/.test(p);
  const dateCmp = (a, b) => new Date(a).getTime() - new Date(b).getTime();

  /* ---------------- persistence ---------------- */
  const K = "cd.state.v1";
  function load() { try { const r = localStorage.getItem(K); if (r) { const p = JSON.parse(r); if (p && p.customers && p.orders) return p; } } catch (e) {} return null; }
  function persist() { try { localStorage.setItem(K, JSON.stringify(S)); } catch (e) {} }
  function log(action, detail, tone) { S.history.unshift({ id: "H" + String(S.history.length + 1).padStart(4, "0"), at: dstr(new Date()), action, detail: detail || "", tone: tone || "" }); S.history = S.history.slice(0, 300); }

  /* ---------------- catalog + seed data ---------------- */
  const PRODUCTS = [
    { id: "P01", name: "SteelChef Knife Set (12pc)", cat: "Kitchen", price: 3900 },
    { id: "P02", name: "EmberFlow Electric Kettle", cat: "Kitchen", price: 5200 },
    { id: "P03", name: "NovaGrill 6-in-1", cat: "Kitchen", price: 12900 },
    { id: "P04", name: "GlowMask LED Facial Mask", cat: "Beauty", price: 14500 },
    { id: "P05", name: "VelvetHair Keratin Kit", cat: "Beauty", price: 6800 },
    { id: "P06", name: "Bella Anti-Aging Serum Set", cat: "Beauty", price: 7300 },
    { id: "P07", name: "PulseFit Smart Watch", cat: "Gadgets", price: 5900 },
    { id: "P08", name: "SoundCore Mini Speaker", cat: "Gadgets", price: 3500 },
    { id: "P09", name: "PowerPod 20000mAh", cat: "Gadgets", price: 4400 },
    { id: "P10", name: "BreezeFan 3-in-1", cat: "Home", price: 2900 },
    { id: "P11", name: "CloudSofa Cushion", cat: "Home", price: 2600 },
    { id: "P12", name: "LuxLamp Reading Light", cat: "Home", price: 2300 },
    { id: "P13", name: "UrbanWind Jacket", cat: "Fashion", price: 8200 },
    { id: "P14", name: "ComfortFlex Sneakers", cat: "Fashion", price: 6400 },
    { id: "P15", name: "SilkWrap Scarf", cat: "Fashion", price: 1900 },
    { id: "P16", name: "NaviDrive Phone Holder", cat: "Auto", price: 2100 },
    { id: "P17", name: "ShineGuard Microfiber Set", cat: "Auto", price: 1600 },
    { id: "P18", name: "AirPump Pro Compressor", cat: "Auto", price: 3800 },
  ];
  const PNAME = (id) => { const p = PRODUCTS.find((x) => x.id === id); return p ? p.name : id; };
  const PCAT = (id) => { const p = PRODUCTS.find((x) => x.id === id); return p ? p.cat : ""; };

  const CITIES = [["Algiers", 24], ["Oran", 13], ["Constantine", 9], ["Setif", 7], ["Blida", 6], ["Annaba", 6], ["Tlemcen", 4], ["Batna", 4], ["Bejaia", 4], ["Ouargla", 4], ["Sidi Bel Abbes", 3], ["Skikda", 3], ["Tizi Ouzou", 3], ["El Eulma", 3], ["Tebessa", 2], ["Bordj Bou Arreridj", 2], ["Medea", 2], ["Guelma", 2], ["Other", 1]];
  const SOURCES = ["Facebook Ads", "Instagram Ads", "TikTok Ads", "Google Ads", "Organic", "WhatsApp", "Referral", "Email"];
  const CAMPAIGNS = ["Ramadan 2026", "Back to School", "Summer Sale", "Winter Comfort", "Launch Week", "Flash COD", "Festival Deals", "Clearance", "New Arrivals", "Weekend Drops"];
  const NAMES_F = ["Yasmine", "Amine", "Sara", "Mohamed", "Amina", "Karim", "Lina", "Riad", "Nadia", "Walid", "Imane", "Sofiane", "Meriem", "Adel", "Rania", "Fares", "Houda", "Bilal", "Assia", "Yacine", "Djamila", "Reda", "Zineb", "Hichem", "Souad", "Tarek", "Feriel", "Aymen", "Khadija", "Mehdi", "Salima", "Nabil", "Rym", "Omar", "Lamia", "Sami", "Nour", "Ilyes", "Hanane", "Zaki"];
  const NAMES_L = ["Bensaad", "Meziane", "Cherif", "Haddad", "Belkacem", "Bouzid", "Khelifi", "Saidani", "Guettal", "Mansouri", "Toumi", "Benali", "Djouadi", "Hamidi", "Zerrouki", "Ait Ahmed", "Bouras", "Chaabane", "Fellah", "Mokrani", "Taleb", "Rahmani", "Saidi", "Belhadj", "Ould Kaci", "Berrahma", "Djellali", "Kacemi", "Lamri", "Boukhalfa", "Seddiki", "Mazouz", "Hamdani", "Ziani", "Cherifi", "Amrani", "Bouali", "Ghanem", "Attia", "Ferhat"];

  const DESTINATIONS = [
    { id: "meta", label: "Meta Custom Audience (Hashed)", icon: "facebook", fmt: "csv", pii: ["email", "phone"] },
    { id: "google", label: "Google Customer Match", icon: "search", fmt: "csv", pii: ["email", "phone"] },
    { id: "tiktok", label: "TikTok Custom Audience", icon: "music-2", fmt: "csv", pii: ["email", "phone"] },
    { id: "erp", label: "ERP / CRM Import File", icon: "layout-dashboard", fmt: "csv", pii: ["name", "phone", "email", "city"] },
    { id: "mailchimp", label: "Email Service (Consented Only)", icon: "mail", fmt: "csv", pii: ["email"] },
    { id: "wa", label: "WhatsApp Broadcast (Consented)", icon: "message-circle", fmt: "csv", pii: ["name", "phone"] },
  ];

  function seed() {
    const customers = [];
    const orders = [];
    const FIRST = new Date("2024-08-01").getTime();
    const span = 24 * 30 * DAY;

    for (let i = 0; i < 360; i++) {
      const id = "C" + String(i + 1).padStart(4, "0");
      const joinedT = FIRST + Math.pow(rand(), 1.8) * span;
      const joined = dstr(new Date(joinedT));
      const name = pick(NAMES_F) + " " + pick(NAMES_L);
      const hasPhone = rand() > 0.07;
      const hasEmail = rand() > 0.11;
      const mailValid = hasEmail && rand() > 0.06;
      const dup = rand() < 0.03 && i > 0;
      const phone = hasPhone ? normPhone("0" + pick(["5", "6", "7"]) + String(rint(10000000, 99999999))) : "";
      const email = hasEmail ? normEmail(name.split(" ")[0].toLowerCase() + "." + name.split(" ")[1].toLowerCase().replace(/\s/g, "") + rint(10, 99) + "@" + pick(["gmail.com", "yahoo.fr", "hotmail.fr", "outlook.com"])) : "";
      const city = weigh(CITIES);
      const source = weigh([["Facebook Ads", 34], ["Instagram Ads", 21], ["TikTok Ads", 13], ["Google Ads", 9], ["Organic", 9], ["WhatsApp", 7], ["Referral", 4], ["Email", 3]]);
      const consent = weigh([["accepted", 72], ["refused", 18], ["unknown", 10]]);
      const campaign = pick(CAMPAIGNS);
      const c = { id, name, phone: dup ? "" : phone, email, country: "DZ", city, address: city + ", Algeria", source, campaign, joined, consent, tags: [], notes: [] };
      if (dup) { c.phone = phone; c.dupOf = "C" + String(i + 1 - rint(1, 3)).padStart(4, "0"); }
      customers.push(c);
    }

    customers.forEach((c) => {
      const joined = new Date(c.joined).getTime();
      const r = rand();
      const count = r < 0.52 ? 1 : r < 0.78 ? 2 : r < 0.9 ? 3 : r < 0.96 ? 4 : r < 0.99 ? 5 : 6;
      let cursor = joined;
      for (let k = 0; k < count; k++) {
        const gap = Math.floor(rand() * 55) + 4;
        cursor = Math.min(NOW.getTime(), cursor + gap * DAY);
        const product = PRODUCTS[Math.floor(rand() * PRODUCTS.length)];
        const qty = rand() < 0.85 ? 1 : 2;
        const value = product.price * qty;
        const status = weigh([["delivered", 56], ["confirmed", 9], ["pending", 13], ["cancelled", 13], ["returned", 9]]);
        orders.push({
          id: "O" + String(orders.length + 1).padStart(5, "0"),
          customerId: c.id,
          date: dstr(new Date(cursor)),
          product: product.id,
          qty, value,
          status,
          payment: rand() < 0.86 ? "cod" : weigh([["card", 6], ["ccp", 4], ["edahabia", 4]]),
          source: c.source,
          campaign: c.campaign,
        });
      }
    });

    const settings = { margin: 38, shipping: 380, refundRate: 9, retentionDays: 730, currency: "DZD", provider: "local-sim" };
    const segments = [
      { id: "SG001", name: "VIP & Champions", color: "#3EE8A6", rules: [{ f: "rfmBucket", op: "in", v: "Champions|Loyal", logic: "and" }, { f: "revenue", op: "gte", v: "20000", logic: "and" }], savedAt: dstr(addDays(NOW, -30)) },
      { id: "SG002", name: "At Risk (90–365d)", color: "#F5B83C", rules: [{ f: "recency", op: "gte", v: "91", logic: "and" }, { f: "recency", op: "lte", v: "365", logic: "and" }], savedAt: dstr(addDays(NOW, -21)) },
      { id: "SG003", name: "COD Risk — High Cancellations", color: "#FF6B6B", rules: [{ f: "cancelRate", op: "gte", v: "30", logic: "and" }], savedAt: dstr(addDays(NOW, -14)) },
      { id: "SG004", name: "New Buyers (last 30d)", color: "#5B8DFF", rules: [{ f: "joinedAfter", op: "gte", v: dstr(addDays(NOW, -30)), logic: "and" }], savedAt: dstr(addDays(NOW, -10)) },
      { id: "SG005", name: "Repeat Buyers", color: "#A78BFA", rules: [{ f: "orders", op: "gte", v: "2", logic: "and" }], savedAt: dstr(addDays(NOW, -6)) },
      { id: "SG006", name: "Never Ordered (Leads Only)", color: "#8A9AB6", rules: [{ f: "orders", op: "eq", v: "0", logic: "and" }], savedAt: dstr(addDays(NOW, -3)) },
    ];
    const audiences = [];
    const exportsL = [];
    const imports = [];
    const history = [{ id: "H0001", at: dstr(NOW), action: "Demo dataset seeded", detail: "360 customers · " + orders.length + " orders · " + PRODUCTS.length + " products", tone: "green" }];

    const S0 = { customers, orders, products: PRODUCTS, segments, audiences, exports: exportsL, imports, history, settings, version: 1 };
    return S0;
  }

  /* ---------------- global state ---------------- */
  let S = load() || seed();
  if (!S.settings) S.settings = { margin: 38, shipping: 380, refundRate: 9, retentionDays: 730, currency: "DZD", provider: "local-sim" };
  if (!S.history) S.history = [];

  const M = {};           // metrics by customer id
  let CIdx = {};          // customer id → obj
  let OIdx = {};          // order id → obj

  function computeMetrics() {
    CIdx = {}; OIdx = {};
    S.customers.forEach((c) => { CIdx[c.id] = c; });
    S.orders.forEach((o) => { OIdx[o.id] = o; });

    const rec = S.customers.map((c) => {
      const os = S.orders.filter((o) => o.customerId === c.id);
      const delivered = os.filter((o) => o.status === "delivered");
      const confirmed = os.filter((o) => o.status === "confirmed");
      const pending = os.filter((o) => o.status === "pending");
      const cancelled = os.filter((o) => o.status === "cancelled");
      const returned = os.filter((o) => o.status === "returned");
      const realized = delivered.concat(confirmed);
      const realizedValue = realized.reduce((s, o) => s + o.value, 0);
      const returnedValue = returned.reduce((s, o) => s + o.value, 0);
      const revenue = Math.max(0, realizedValue - returnedValue);
      const total = os.reduce((s, o) => s + o.value, 0);
      const lastOrder = os.length ? os.reduce((a, b) => (dateCmp(a.date, b.date) > 0 ? a : b)).date : c.joined;
      const firstOrder = os.length ? os.reduce((a, b) => (dateCmp(a.date, b.date) < 0 ? a : b)).date : c.joined;
      const recency = daysAgo(lastOrder);
      const monthsSinceFirst = Math.max(0.5, (NOW.getTime() - new Date(firstOrder).getTime()) / (30 * DAY));
      const freqPerYear = os.length / (monthsSinceFirst / 12);
      const aov = realized.length ? realizedValue / realized.length : total / Math.max(1, os.length);
      const cancelRate = os.length ? (cancelled.length / os.length) * 100 : 0;
      const returnRate = os.length ? (returned.length / os.length) * 100 : 0;
      const lifespan = Math.min(3, monthsSinceFirst / 12 + 0.5);
      const clv = aov * Math.max(0.1, freqPerYear) * lifespan;
      const shippingCost = realized.length * (S.settings.shipping || 380);
      const refundCost = returned.length * (S.settings.refundRate || 9) / 100 * returnedValue;
      const profit = revenue * (S.settings.margin || 38) / 100 - shippingCost - refundCost;

      let quality = 100;
      if (!c.phone) quality -= 15;
      if (!c.email) quality -= 10; else if (!validEmail(c.email)) quality -= 10;
      if (c.consent === "unknown") quality -= 15;
      if (c.consent === "refused") quality -= 25;
      if (returnRate > 20) quality -= 10;
      if (cancelRate > 30) quality -= 5;
      if (recency > 365) quality -= 5;
      if (os.length && os.length <= 1) quality -= 5;
      quality = Math.max(0, Math.min(100, quality));

      const churnState = os.length === 0 ? (daysAgo(c.joined) > 365 ? "Lost" : "Dormant") : recency <= 90 ? "Active" : recency <= 180 ? "Cooling" : recency <= 365 ? "At Risk" : recency <= 730 ? "Dormant" : "Lost";
      const products = [...new Set(os.map((o) => o.product))];

      return { id: c.id, orders: os, orderCount: os.length, delivered: delivered.length, confirmed: confirmed.length, pending: pending.length, cancelled: cancelled.length, returned: returned.length, realizedCount: realized.length, revenue, total, aov, firstOrder, lastOrder, recency, freqPerYear, clv, profit, quality, cancelRate, returnRate, churnState, products, tags: c.tags || [], joined: c.joined, monthsSinceFirst };
    });
    rec.forEach((m) => { M[m.id] = m; });

    // RFM scores via quartiles
    const withOrders = rec.filter((m) => m.orderCount > 0);
    const q = (arr, f, p) => { const s = arr.map(f).sort((a, b) => a - b); const i = Math.min(s.length - 1, Math.floor(s.length * p)); return s[i]; };
    const rP = [q(withOrders, (m) => m.recency, 0.25), q(withOrders, (m) => m.recency, 0.5), q(withOrders, (m) => m.recency, 0.75)];
    const fP = [q(withOrders, (m) => m.orderCount, 0.25), q(withOrders, (m) => m.orderCount, 0.5), q(withOrders, (m) => m.orderCount, 0.75)];
    const mP = [q(withOrders, (m) => m.revenue, 0.25), q(withOrders, (m) => m.revenue, 0.5), q(withOrders, (m) => m.revenue, 0.75)];
    const score = (v, qs, invert) => { let s2 = 1; if (invert) { if (v <= qs[0]) s2 = 4; else if (v <= qs[1]) s2 = 3; else if (v <= qs[2]) s2 = 2; } else { if (v <= qs[0]) s2 = 1; else if (v <= qs[1]) s2 = 2; else if (v <= qs[2]) s2 = 3; else s2 = 4; } return s2; };
    withOrders.forEach((m) => {
      m.r = score(m.recency, rP, true);
      m.f = score(m.orderCount, fP, false);
      m.m = score(m.revenue, mP, false);
      m.rfm = String(m.r) + String(m.f) + String(m.m);
      m.rfmBucket = rfmBucket(m.r, m.f, m.m);
    });

    // monthly buckets (last 12 months)
    months = [];
    for (let k = 11; k >= 0; k--) { const d = addDays(NOW, -k * 30); months.push({ key: d.toISOString().slice(0, 7), label: d.toISOString().slice(0, 7) }); }
  }
  let months = [];

  function rfmBucket(r, f, m) {
    if (r >= 3 && f >= 3 && m >= 3) return "Champions";
    if (r >= 3 && f >= 2 && m >= 2) return "Loyal";
    if (r >= 3 && f <= 1 && m >= 3) return "Potential Loyalist";
    if (r >= 3 && f <= 2 && m <= 2) return "New / Promising";
    if (r <= 2 && f >= 3 && m >= 3) return "Can't Lose";
    if (r <= 2 && f >= 2 && m >= 2) return "At Risk";
    if (r <= 2 && f <= 2 && m >= 3) return "Need Attention";
    if (r <= 2 && f <= 2 && m <= 2) return "Hibernating";
    return "Standard";
  }

  /* ---------------- segment rule evaluation ---------------- */
  const FIELDS = [
    { id: "source", label: "Source", op: ["eq", "ne"], vals: SOURCES },
    { id: "city", label: "City", op: ["eq", "ne"], vals: CITIES.map((c) => c[0]) },
    { id: "campaign", label: "Campaign", op: ["eq", "ne"], vals: CAMPAIGNS },
    { id: "consent", label: "Consent", op: ["eq"], vals: ["accepted", "refused", "unknown"] },
    { id: "tag", label: "Has tag", op: ["eq"], vals: ["vip", "returner", "refund", "repeat", "whale", "suspect-cod", "reseller"] },
    { id: "rfmBucket", label: "RFM bucket", op: ["in"], vals: ["Champions", "Loyal", "Potential Loyalist", "New / Promising", "Can't Lose", "At Risk", "Need Attention", "Hibernating", "Standard"] },
    { id: "churnState", label: "Activity state", op: ["eq", "ne"], vals: ["Active", "Cooling", "At Risk", "Dormant", "Lost"] },
    { id: "bought", label: "Bought product", op: ["eq"], vals: PRODUCTS.map((p) => p.name) },
    { id: "notBought", label: "Not bought product", op: ["eq"], vals: PRODUCTS.map((p) => p.name) },
    { id: "orders", label: "Orders count", op: ["gte", "lte", "gt", "lt", "eq"] },
    { id: "revenue", label: "Revenue (DA)", op: ["gte", "lte", "gt", "lt"] },
    { id: "aov", label: "AOV (DA)", op: ["gte", "lte", "gt", "lt"] },
    { id: "recency", label: "Recency (days)", op: ["gte", "lte", "gt", "lt"] },
    { id: "quality", label: "Quality score", op: ["gte", "lte"] },
    { id: "clv", label: "CLV estimate (DA)", op: ["gte", "lte"] },
    { id: "cancelRate", label: "Cancel rate %", op: ["gte", "lte"] },
    { id: "returnRate", label: "Return rate %", op: ["gte", "lte"] },
    { id: "joinedAfter", label: "Joined after (date)", op: ["gte", "lte"] },
  ];
  const fieldMeta = (id) => FIELDS.find((f) => f.id === id);

  function numCmp(a, op, b) { return op === "eq" ? a === b : op === "ne" ? a !== b : op === "gt" ? a > b : op === "lt" ? a < b : op === "gte" ? a >= b : a <= b; }

  function evalCond(c, m, f, op, v) {
    if (f === "source") return op === "eq" ? c.source === v : c.source !== v;
    if (f === "city") return op === "eq" ? c.city === v : c.city !== v;
    if (f === "campaign") return op === "eq" ? c.campaign === v : c.campaign !== v;
    if (f === "consent") return c.consent === v;
    if (f === "tag") return (c.tags || []).includes(v);
    if (f === "rfmBucket") return v.split("|").includes(m.rfmBucket);
    if (f === "churnState") return op === "eq" ? m.churnState === v : m.churnState !== v;
    if (f === "bought") return m.products.includes(PRODUCTS.find((p) => p.name === v).id);
    if (f === "notBought") return !m.products.includes(PRODUCTS.find((p) => p.name === v).id);
    if (f === "joinedAfter") { const t = dateCmp(c.joined, v); return op === "gte" ? t >= 0 : t <= 0; }
    const nv = parseFloat(v) || 0;
    if (f === "orders") return numCmp(m.orderCount, op, nv);
    if (f === "revenue") return numCmp(m.revenue, op, nv);
    if (f === "aov") return numCmp(m.aov, op, nv);
    if (f === "recency") return numCmp(m.recency, op, nv);
    if (f === "quality") return numCmp(m.quality, op, nv);
    if (f === "clv") return numCmp(m.clv, op, nv);
    if (f === "cancelRate") return numCmp(m.cancelRate, op, nv);
    if (f === "returnRate") return numCmp(m.returnRate, op, nv);
    return false;
  }

  function matchRules(c, m, rules) {
    if (!rules || !rules.length) return true;
    let res = null;
    for (const r of rules) {
      if (!r || !r.f) continue;
      let val = evalCond(c, m, r.f, r.op || "eq", r.v);
      if (r.logic === "not") val = !val;
      if (res === null) res = val;
      else if (r.logic === "or") res = res || val;
      else if (r.logic === "not") res = res && val;
      else res = res && val;
    }
    return res === null ? true : res;
  }

  function evalSegment(rules) { return S.customers.filter((c) => { const m = M[c.id]; if (!m) return false; return matchRules(c, m, rules); }).map((c) => c.id); }
  function segmentById(id) { return (S.segments || []).find((s) => s.id === id); }
  function evalSegmentById(id) { const s = segmentById(id); return s ? evalSegment(s.rules) : []; }

  /* ---------------- audience builder ---------------- */
  const GOALS = {
    "repeat": { label: "Repeat buyers / cross-sell", desc: "Customers who already bought from you — push a complementary product.", fn: (m) => m.orderCount >= 2 && m.churnState !== "Lost" },
    "upsell": { label: "Upsell buyers of a product", desc: "Buyers of product A who never bought premium B.", fn: (m, p) => m.products.includes(p) && m.revenue > 0 },
    "crosssell": { label: "Cross-sell non-buyers", desc: "High-value customers who never bought product B.", fn: (m, p) => !m.products.includes(p) && m.revenue >= 15000 && m.churnState !== "Lost" },
    "winback": { label: "Win-back (90–365d silent)", desc: "Real buyers who went quiet but are still worth reactivating.", fn: (m) => m.orderCount >= 1 && m.recency >= 91 && m.recency <= 365 },
    "lost": { label: "Lost reactivation (>365d)", desc: "Deep-lapsed customers, highest-risk reactivation.", fn: (m) => m.recency > 365 && m.orderCount >= 1 },
    "atrisk": { label: "At-risk regulars", desc: "Frequent buyers starting to fade.", fn: (m) => m.recency >= 61 && m.recency <= 180 && m.orderCount >= 2 },
    "new": { label: "New buyers (last 45d)", desc: "First purchase within 45 days — nurture & repeat.", fn: (m) => m.orderCount >= 1 && m.recency <= 45 },
    "best": { label: "Best customers", desc: "Top quality + value. VIP treatment.", fn: (m) => m.quality >= 80 && m.revenue >= 15000 },
    "vip": { label: "Whales (top 5% value)", desc: "Highest CLV customers.", fn: () => false },
  };

  function buildAudienceCore(productId, goal, city, country) {
    let ids = S.customers.map((c) => M[c.id]).filter(Boolean);
    if (productId && productId !== "all") {
      const p = PRODUCTS.find((x) => x.id === productId);
      if (goal === "upsell") ids = ids.filter((m) => GOALS.upsell.fn(m, p.id));
      else if (goal === "crosssell") ids = ids.filter((m) => GOALS.crosssell.fn(m, p.id));
      else ids = ids.filter((m) => m.products.includes(p.id));
      if (goal && GOALS[goal] && goal !== "upsell" && goal !== "crosssell" && goal !== "vip") ids = ids.filter((m) => GOALS[goal].fn(m));
    } else if (goal && GOALS[goal]) {
      ids = ids.filter((m) => GOALS[goal].fn(m));
    }
    if (goal === "vip") { const sorted = ids.slice().sort((a, b) => b.clv - a.clv); const top = Math.max(5, Math.ceil(sorted.length * 0.05)); ids = sorted.slice(0, top); }
    if (city && city !== "All") ids = ids.filter((m) => CIdx[m.id].city === city);
    if (country && country !== "All") ids = ids.filter((m) => CIdx[m.id].country === country);
    const customers = ids.map((m) => m.id);
    return finalizeAudience(customers);
  }

  function finalizeAudience(ids) {
    const dedup = [...new Set(ids)];
    const consented = dedup.filter((id) => CIdx[id].consent === "accepted");
    const refused = dedup.filter((id) => CIdx[id].consent === "refused");
    const unknown = dedup.filter((id) => CIdx[id].consent === "unknown");
    const valid = consented.filter((id) => { const c = CIdx[id]; return (validPhone(c.phone) && validEmail(c.email)) || validPhone(c.phone) || validEmail(c.email); });
    return {
      total: dedup.length, consented: consented.length, refused: refused.length, unknown: unknown.length, usable: valid.length,
      members: consented, usableMembers: valid, excluded: refused.concat(unknown),
    };
  }

  function makeAudience(name, productId, goal, city, opts) {
    const core = buildAudienceCore(productId, goal, city, opts && opts.country);
    const a = { id: "AUD" + String((S.audiences || []).length + 1).padStart(3, "0"), name, product: productId || "all", goal: goal || "repeat", city: city || "All", builtAt: dstr(NOW), version: 1, ...core, snapshot: core.members.slice(), refreshedAt: dstr(NOW) };
    S.audiences.unshift(a);
    log("Audience built", name + " · " + core.usable + " usable (consent-gated)", "green");
    return a;
  }

  function refreshAudience(a) {
    const core = buildAudienceCore(a.product, a.goal, a.city);
    a.total = core.total; a.consented = core.consented; a.refused = core.refused; a.unknown = core.unknown; a.usable = core.usable; a.members = core.members; a.usableMembers = core.usableMembers; a.excluded = core.excluded; a.snapshot = core.members.slice(); a.version++; a.refreshedAt = dstr(NOW);
    log("Audience refreshed", a.name + " → v" + a.version, "green");
    return a;
  }

  function makeExport(a, dest) {
    const d = DESTINATIONS.find((x) => x.id === dest) || DESTINATIONS[0];
    const e = { id: "EXP" + String((S.exports || []).length + 1).padStart(3, "0"), name: a.name, audienceId: a.id, dest: d.id, destLabel: d.label, count: a.usable, createdAt: dstr(NOW), status: "ready", fields: d.pii, sample: [] };
    const pickFields = a.usableMembers.slice(0, 4).map((id) => {
      const c = CIdx[id];
      const row = {};
      d.pii.forEach((f) => { row[f] = f === "name" ? c.name : f === "city" ? c.city : hash(normPhone(c.phone) + normEmail(c.email)); });
      return row;
    });
    e.sample = pickFields;
    S.exports.unshift(e);
    log("Export created", a.name + " → " + d.label + " (" + a.usable + " rows)", "green");
    return e;
  }

  /* ---------------- import pipeline ---------------- */
  function parseCSV(text) {
    const lines = [];
    let cur = ""; let q = false; const rows = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { rows[rows.length - 1] === undefined && rows.push([]); rows[rows.length - 1].push(cur); cur = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; if (cur !== "" || rows[rows.length - 1]) { const last = rows[rows.length - 1]; if (last && last.length) rows.push([]); else { rows.length || rows.push([]); rows[rows.length - 1].push(cur); } } cur = ""; }
      else cur += ch;
    }
    if (cur !== "") { rows.length || rows.push([]); const last = rows[rows.length - 1]; if (last.length) rows.push([cur]); else last.push(cur); }
    return rows;
  }
  /* simpler, robust enough parser */
  function parseCSV2(text) {
    const out = [];
    const re = /("([^"]*)"|[^,\r\n]*)(,|\r?\n|$)/g;
    let match; let row = []; let line = 0;
    while ((match = re.exec(text))) {
      const cell = match[2] != null ? match[2] : match[1].trim();
      row.push(cell);
      if (match[3] === ",") continue;
      out.push(row);
      row = []; line++;
      if (match[3] === "") break;
    }
    return out;
  }

  const COL_SYN = {
    name: ["name", "customer", "client", "full name", "nom", "first name"],
    phone: ["phone", "mobile", "tel", "téléphone", "telephone", "phone number", "whatsapp"],
    email: ["email", "e-mail", "mail", "courriel"],
    city: ["city", "town", "wilaya", "ville"],
    country: ["country", "pays", "region"],
    joined: ["joined", "date", "created", "inscription", "first order", "order date", "date d'achat"],
    product: ["product", "item", "sku", "produit", "article"],
    source: ["source", "channel", "origin", "traffic source"],
    campaign: ["campaign", "ad", "campagne"],
    value: ["value", "total", "amount", "price", "montant", "order total"],
    status: ["status", "state", "statut", "delivery status"],
  };
  function mapColumns(header) {
    const map = {};
    header.forEach((h, i) => {
      const hh = String(h).toLowerCase().trim();
      let best = null;
      for (const k in COL_SYN) {
        if (COL_SYN[k].some((s) => hh === s || hh.includes(s))) { best = k; break; }
      }
      map[i] = best;
    });
    return map;
  }

  function previewImport(rows, overrides) {
    const header = rows[0].map((h) => String(h).trim());
    const data = rows.slice(1);
    const map = overrides || mapColumns(header);
    const problems = [];
    const mappedCount = Object.keys(map).filter((k) => map[k]).length;
    let qScore = 100;
    const stats = { newCustomers: 0, updatedCustomers: 0, newOrders: 0, duplicates: 0, missingName: 0, badPhone: 0, badEmail: 0, noConsent: 0, skipped: 0 };
    const rowsToAdd = [];
    data.forEach((r, ri) => {
      const g = (k) => { const idx = header.findIndex((h, i) => map[i] === k); return idx >= 0 ? String(r[idx] == null ? "" : r[idx]).trim() : ""; };
      const name = g("name"); const phone = normPhone(g("phone")); const email = normEmail(g("email"));
      if (!name && !phone && !email) { stats.skipped++; return; }
      const phoneOk = !phone || validPhone(phone);
      const emailOk = !email || validEmail(email);
      if (!name) stats.missingName++;
      if (phone && !phoneOk) stats.badPhone++;
      if (email && !emailOk) stats.badEmail++;
      const dupPhone = S.customers.some((c) => c.phone && c.phone === phone);
      const dupEmail = S.customers.some((c) => c.email && c.email === email);
      const isDup = (phone && dupPhone) || (email && dupEmail);
      if (isDup) stats.duplicates++; else stats.newCustomers++;
      rowsToAdd.push({ ri, g, name, phone, email, phoneOk, emailOk, dup: isDup, product: g("product"), value: parseFloat(g("value")) || 0, joined: g("joined") || dstr(NOW), city: g("city") });
    });
    qScore -= stats.badPhone * 6 + stats.badEmail * 6 + stats.skipped * 3;
    qScore = Math.max(0, Math.min(100, qScore));
    return { header, data, map, mappedCount, qScore, stats, rowsToAdd, problems };
  }

  function applyImport(rows, source, fileName, overrides) {
    const pv = previewImport(rows, overrides);
    const importId = "IMP" + String((S.imports || []).length + 1).padStart(3, "0");
    let newC = 0; let updatedC = 0; let newO = 0;
    const seen = new Set();
    pv.rowsToAdd.forEach((r) => {
      if (r.dup) return;
      const key = r.phone || r.email;
      if (key && seen.has(key)) return;
      if (key) seen.add(key);
      const c = { id: "C" + String(S.customers.length + 1).padStart(4, "0"), name: r.name || "Imported customer", phone: r.phone, email: r.email, country: r.g("country") || "DZ", city: r.city || "Other", address: "", source: r.g("source") || source || "Manual Import", campaign: r.g("campaign") || "Imported", joined: r.joined, consent: "unknown", tags: [], notes: [] };
      S.customers.push(c); newC++;
      if (r.product && r.value) {
        const p = PRODUCTS.find((x) => x.name.toLowerCase() === String(r.product).toLowerCase());
        S.orders.push({ id: "O" + String(S.orders.length + 1).padStart(5, "0"), customerId: c.id, date: r.joined, product: p ? p.id : "P01", qty: 1, value: r.value, status: r.g("status") === "delivered" ? "delivered" : "pending", payment: "cod", source: c.source, campaign: c.campaign });
        newO++;
      }
    });
    const imp = { id: importId, file: fileName || "pasted-data", source: source || "Manual Import", at: dstr(NOW), rows: pv.rowsToAdd.length, mapped: pv.mappedCount, newCustomers: newC, newOrders: newO, duplicates: pv.stats.duplicates, rejected: pv.stats.badPhone + pv.stats.badEmail + pv.stats.skipped, quality: pv.qScore, status: "completed" };
    S.imports.unshift(imp);
    log("Import completed", imp.file + " · +" + newC + " customers, +" + newO + " orders, " + imp.rejected + " rejected", "green");
    computeMetrics(); persist();
    return imp;
  }

  /* ---------------- identity resolution ---------------- */
  function findDupGroups() {
    const groups = [];
    const used = new Set();
    const byPhone = {}; const byEmail = {};
    S.customers.forEach((c) => {
      if (c.phone) (byPhone[c.phone] = byPhone[c.phone] || []).push(c.id);
      if (c.email) (byEmail[c.email] = byEmail[c.email] || []).push(c.id);
    });
    S.customers.forEach((c) => {
      if (used.has(c.id)) return;
      const found = new Set([c.id]);
      const queue = [c.id];
      while (queue.length) {
        const id = queue.shift();
        const cid = CIdx[id];
        [cid.phone, cid.email].forEach((key) => {
          if (!key) return;
          const pool = key.includes("@") ? (byEmail[key] || []) : (byPhone[key] || []);
          pool.forEach((pid) => { if (!found.has(pid)) { found.add(pid); queue.push(pid); } });
        });
      }
      if (found.size > 1) {
        found.forEach((id) => used.add(id));
        const members = [...found].map((id) => CIdx[id]);
        groups.push({ key: c.id, members });
      }
    });
    return groups;
  }

  function mergeGroup(members) {
    const keep = members.slice().sort((a, b) => { const ma = M[a.id]; const mb = M[b.id]; return (mb.orderCount - ma.orderCount) || (mb.revenue - ma.revenue); })[0];
    members.filter((m) => m.id !== keep.id).forEach((m) => {
      S.orders.forEach((o) => { if (o.customerId === m.id) o.customerId = keep.id; });
      keep.notes = keep.notes.concat(m.notes || []);
      keep.tags = [...new Set(keep.tags.concat(m.tags || []))];
      if (!keep.phone && m.phone) keep.phone = m.phone;
      if (!keep.email && m.email) keep.email = m.email;
      m.mergedInto = keep.id;
    });
    S.customers = S.customers.filter((c) => !c.mergedInto);
    log("Identity merged", keep.id + " absorbed " + members.filter((m) => m.id !== keep.id).length + " duplicate(s)", "green");
    computeMetrics(); persist();
    return keep;
  }

  /* ---------------- sample import data ---------------- */
  function sampleCSV() {
    const h = ["Name", "Phone", "Email", "City", "Order Date", "Product", "Value", "Status", "Source", "Campaign"];
    const lines = [h.join(",")];
    for (let i = 0; i < 40; i++) {
      const name = pick(NAMES_F) + " " + pick(NAMES_L);
      const phone = "0" + pick(["5", "6", "7"]) + String(rint(10000000, 99999999));
      const email = name.split(" ")[0].toLowerCase() + "." + rint(10, 99) + "@gmail.com";
      const city = pick(CITIES)[0];
      const date = dstr(addDays(NOW, -rint(1, 45)));
      const p = pick(PRODUCTS);
      const val = p.price;
      const status = pick(["delivered", "delivered", "pending", "cancelled"]);
      const src = pick(SOURCES);
      const camp = pick(CAMPAIGNS);
      lines.push([name, phone, email, city, date, p.name, val, status, src, camp].join(","));
    }
    return lines.join("\n");
  }

  /* ---------------- navigation ---------------- */
  const NAV = [
    { id: "dashboard", label: "Command Center", icon: "layout-dashboard" },
    { id: "customers", label: "Customers", icon: "users" },
    { id: "profiles", label: "Customer Profiles", icon: "user-round" },
    { id: "orders", label: "Orders", icon: "shopping-cart" },
    { id: "products", label: "Products", icon: "shopping-bag" },
    { id: "import", label: "Import Data", icon: "upload-cloud" },
    { id: "sources", label: "Data Sources", icon: "plug-zap" },
    { id: "health", label: "Data Health", icon: "stethoscope" },
    { id: "identity", label: "Identity Resolution", icon: "merge" },
    { id: "segments", label: "Segments", icon: "filter" },
    { id: "rfm", label: "RFM Analysis", icon: "layers" },
    { id: "value", label: "Customer Value", icon: "coins" },
    { id: "intelligence", label: "Customer Intelligence", icon: "brain" },
    { id: "audiences", label: "Smart Audiences", icon: "target" },
    { id: "aibuild", label: "AI Audience Builder", icon: "wand-sparkles" },
    { id: "adaud", label: "Ad Audiences", icon: "megaphone" },
    { id: "lookalike", label: "Lookalike & Similarity", icon: "copy-check" },
    { id: "retention", label: "Retention & Cohorts", icon: "repeat" },
    { id: "reports", label: "Reports", icon: "file-bar-chart" },
    { id: "assistant", label: "AI Assistant", icon: "bot-message-square" },
    { id: "privacy", label: "Privacy Center", icon: "shield" },
    { id: "exports", label: "Export Center", icon: "download" },
    { id: "history", label: "History & Imports", icon: "history" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];
  const NAV_SECS = [
    { label: "CORE", ids: ["dashboard"] },
    { label: "DATA", ids: ["customers", "profiles", "orders", "products"] },
    { label: "INGEST", ids: ["import", "sources", "health", "identity"] },
    { label: "INTELLIGENCE", ids: ["segments", "rfm", "value", "intelligence"] },
    { label: "AUDIENCES", ids: ["audiences", "aibuild", "adaud", "lookalike"] },
    { label: "GROWTH", ids: ["retention", "reports"] },
    { label: "AI & OPS", ids: ["assistant", "privacy", "exports", "history", "settings"] },
  ];

  let activeGroup = "dashboard";
  const ui = { cusQ: "", cusSource: "All", cusCity: "All", cusConsent: "All", cusRfm: "All", ordQ: "", ordStatus: "All", ordSource: "All", profileId: null, segRules: [], segTab: "saved", tab: {}, audSel: null, audOpen: null, expDest: "meta", aiHist: [], importRows: null, importPreview: null, importMap: null, importSource: "CSV File" };

  function navigate(g) { activeGroup = g; render(); }

  /* ---------------- shell ---------------- */
  function renderShell() {
    const view = $("eat-view");
    const sidebar = NAV_SECS.map((sec) =>
      `<div class="cd-nav-sec">${sec.label}</div>` +
      sec.ids.map((id) => { const g = NAV.find((x) => x.id === id); return `<button class="eat-nav-btn${activeGroup === g.id ? " active" : ""}" data-nav="${g.id}">${ic(g.icon, 15)} <span>${g.label}</span></button>`; }).join("")
    ).join("");
    view.innerHTML = `
      <div class="eat-head">
        <div>
          <div class="eat-title">CUSTOMER <em>DATA</em> AI</div>
          <div class="eat-sub">E-commerce customer database + audience intelligence platform. Import, clean, resolve and unify every buyer into one Customer 360, then segment by RFM / value / risk and export consent-safe, hashed audiences to any ad or CRM destination.</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="pill green"><i data-lucide="badge-check" style="width:13px;height:13px"></i> Simulated AI</span>
          <span class="pill gray"><i data-lucide="database" style="width:13px;height:13px"></i> ${num(S.customers.length)} customers</span>
          <span class="pill gray"><i data-lucide="shopping-cart" style="width:13px;height:13px"></i> ${num(S.orders.length)} orders</span>
        </div>
      </div>
      <div class="eat-layout">
        <aside class="eat-side">
          ${sidebar}
          <div class="eat-side-foot">Every number is computed locally. AI outputs carry VERIFIED / ESTIMATED / INFERRED evidence. Raw PII never leaves this device — exports are consent-gated and hashed.</div>
        </aside>
        <main class="eat-main" id="eat-main"></main>
      </div>`;
  }

  function render() {
    const host = $("eat-view");
    if (!host) return;
    renderShell();
    const main = $("eat-main");
    if (!main) return;
    charts.length = 0;
    main.innerHTML = `<div class="out-anim">${renderGroup()}</div>`;
    icons();
    drawCharts();
  }

  const charts = [];
  function pushChart(id, spec) { charts.push({ id, spec }); }
  function drawCharts() {
    charts.forEach(({ id, spec }) => {
      const el = document.getElementById("chart-" + id);
      if (!el || !window.Chart) return;
      try {
        const ex = Chart.getChart(el);
        if (ex) ex.destroy();
        const cfg = {
          type: spec.type || "bar",
          data: { labels: spec.labels || [], datasets: (spec.datasets || []).map((d, i) => ({ label: d.label || "", data: d.data || [], backgroundColor: d.color || (i === 0 ? "#3EE8A6" : "#3A4E77"), borderColor: d.color || "#3EE8A6", borderWidth: 2, tension: 0.38, fill: d.fill === true, borderRadius: 5 })) },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: spec.legend === false ? { display: false } : { labels: { color: "#8A9AB6", font: { size: 10 } } } },
            scales: spec.type === "pie" || spec.type === "doughnut" ? {} : { x: { grid: { color: "#1F2B45" }, ticks: { color: "#8A9AB6", font: { size: 9 } } }, y: { grid: { color: "#1F2B45" }, ticks: { color: "#8A9AB6", font: { size: 9 } } } },
          },
        };
        new Chart(el.getContext("2d"), cfg);
      } catch (e) { console.error(e); }
    });
  }

  /* ---------------- shared builders ---------------- */
  const ev = (label, tone) => `<span class="cd-ev ${tone || "inf"}">${label}</span>`;
  const kpi = (l, v, s, tone) => `<div class="kpi ${tone || "blu"}"><div class="kpi-l">${l}</div><div class="kpi-v">${v}</div><div class="kpi-s">${esc(s || "")}</div></div>`;
  const metric = (l, v, s, tone) => `<div class="cd-metric"><div class="cm-l">${l}</div><div class="cm-v ${tone || ""}">${v}</div>${s ? `<div class="cm-s">${s}</div>` : ""}</div>`;
  const bar = (v, tone) => `<div class="cd-bar ${tone || ""}"><i style="width:${Math.max(2, Math.min(100, v))}%"></i></div>`;
  const pill = (t, tone) => `<span class="pill ${tone || "gray"}">${t}</span>`;
  const consentPill = (c) => c === "accepted" ? pill("CONSENTED", "green") : c === "refused" ? pill("REFUSED", "red") : pill("UNKNOWN", "amber");
  const statusPill = (s) => s === "delivered" ? pill("DELIVERED", "green") : s === "confirmed" ? pill("CONFIRMED", "blu") : s === "pending" ? pill("PENDING", "amber") : s === "cancelled" ? pill("CANCELLED", "gray") : pill("RETURNED", "red");
  const churnPill = (s) => s === "Active" ? pill("ACTIVE", "green") : s === "Cooling" ? pill("COOLING", "blu") : s === "At Risk" ? pill("AT RISK", "amber") : s === "Dormant" ? pill("DORMANT", "gray") : pill("LOST", "red");

  const tbl = (head, rows) => `<div class="tbl-wrap"><table class="eat-tbl cd-tbl"><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const card = (title, sub, body, extra) => `<div class="bd-card"><div class="bd-card-head">${title}</div>${sub ? `<div class="bd-card-sub">${sub}</div>` : ""}${body}${extra || ""}</div>`;
  const confBox = (level, rows) => `<div class="conf-box ${level}"><div class="conf-top"><span class="dot"></span>CONFIDENCE: ${level.toUpperCase()}</div><div class="conf-rows">${rows.map((r) => `<div class="cr"><b>${r[0]}</b> ${r[1]}</div>`).join("")}</div></div>`;

  function allMetrics() { return S.customers.map((c) => M[c.id]).filter(Boolean); }
  function totRevenue() { return allMetrics().reduce((s, m) => s + m.revenue, 0); }
  function totRealized() { return allMetrics().reduce((s, m) => s + m.realizedCount, 0); }
  function aggTable(items, keyFn, pickVal) {
    const map = {};
    items.forEach((x) => { const k = keyFn(x); map[k] = map[k] || { count: 0, revenue: 0, orders: 0, value: 0, delivered: 0 }; const m = pickVal(x); map[k].count++; map[k].orders += m.orderCount; map[k].value += m.total; map[k].revenue += m.revenue; map[k].delivered += m.delivered; });
    return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue);
  }

  /* ================= GROUP VIEWS ================= */
  function renderGroup() {
    switch (activeGroup) {
      case "dashboard": return vDashboard();
      case "customers": return vCustomers();
      case "profiles": return vProfiles();
      case "orders": return vOrders();
      case "products": return vProducts();
      case "import": return vImport();
      case "sources": return vSources();
      case "health": return vHealth();
      case "identity": return vIdentity();
      case "segments": return vSegments();
      case "rfm": return vRfm();
      case "value": return vValue();
      case "intelligence": return vIntelligence();
      case "audiences": return vAudiences();
      case "aibuild": return vAiBuild();
      case "adaud": return vAdAud();
      case "lookalike": return vLookalike();
      case "retention": return vRetention();
      case "reports": return vReports();
      case "assistant": return vAssistant();
      case "privacy": return vPrivacy();
      case "exports": return vExports();
      case "history": return vHistory();
      case "settings": return vSettings();
      default: return "";
    }
  }

  /* ---------- DASHBOARD ---------- */
  function vDashboard() {
    const ms = allMetrics();
    const active = ms.filter((m) => m.churnState === "Active").length;
    const repeat = ms.filter((m) => m.orderCount >= 2).length;
    const aov = totRealized() ? totRevenue() / totRealized() : 0;
    const codOrders = S.orders.filter((o) => o.payment === "cod");
    const codDelivered = codOrders.filter((o) => o.status === "delivered" || o.status === "confirmed").length;
    const codRate = codOrders.length ? (codDelivered / codOrders.length) * 100 : 0;
    const noPhone = S.customers.filter((c) => !validPhone(c.phone)).length;
    const atRisk = ms.filter((m) => m.churnState === "At Risk").length;

    const byMonth = months.map((mth) => S.orders.filter((o) => o.date.slice(0, 7) === mth.key && (o.status === "delivered" || o.status === "confirmed" || o.status === "returned")).reduce((s, o) => s + (o.status === "returned" ? -o.value : o.value), 0));
    pushChart("dashRev", { type: "line", labels: months.map((m) => m.key.slice(5)), datasets: [{ label: "Realized revenue (DA)", data: byMonth, color: "#3EE8A6", fill: true }] });

    const bySource = aggTable(S.customers, (c) => c.source, (c) => M[c.id]).slice(0, 8);
    pushChart("dashSrc", { type: "bar", labels: bySource.map((x) => x[0]), datasets: [{ label: "Revenue", data: bySource.map((x) => x[1].revenue), color: "#5B8DFF" }] });

    const byBucket = {};
    ms.forEach((m) => { byBucket[m.rfmBucket || "Standard"] = (byBucket[m.rfmBucket || "Standard"] || 0) + 1; });
    pushChart("dashSeg", { type: "doughnut", labels: Object.keys(byBucket), datasets: [{ label: "Customers", data: Object.values(byBucket), color: "#3EE8A6" }], legend: false });

    const topProducts = {};
    S.orders.filter((o) => o.status === "delivered" || o.status === "confirmed").forEach((o) => { topProducts[o.product] = (topProducts[o.product] || 0) + o.value; });
    const tp = Object.entries(topProducts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const quickAud = S.audiences[0];

    return `
      <div class="g4">
        ${kpi("Total customers", num(S.customers.length), num(ms.filter((m) => m.orderCount > 0).length) + " with orders", "blu")}
        ${kpi("Total orders", num(S.orders.length), num(S.orders.filter((o) => o.status === "delivered").length) + " delivered", "grn")}
        ${kpi("Realized revenue", money(totRevenue()), "delivered + confirmed − returns", "gold")}
        ${kpi("Active customers", num(active), pct(active / Math.max(1, ms.length)) + " of base", "tel")}
      </div>
      <div class="g4">
        ${kpi("Average order value", money(aov), num(totRealized()) + " realized orders", "pur")}
        ${kpi("Repeat rate", pct(repeat / Math.max(1, ms.length)), num(repeat) + " bought 2+ times", "blu")}
        ${kpi("COD confirmation", pct(codRate / 100), num(codOrders.length) + " COD orders", "grn")}
        ${kpi("Data quality", pct(1 - noPhone / S.customers.length), num(noPhone) + " missing valid phone", "org")}
      </div>

      ${card(`<span class="bd-card-title">${ic("layout-dashboard", 14)} Revenue trend — last 12 months</span>`, "", `<div class="chw-lg"><canvas id="chart-dashRev"></canvas></div>`)}

      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("layers", 14)} Revenue by source</span>`, "Top 8 acquisition channels", `<div class="chw"><canvas id="chart-dashSrc"></canvas></div>`)}
        ${card(`<span class="bd-card-title">${ic("users", 14)} Customer mix (RFM)</span>`, "Distribution across behavior buckets", `<div class="chw"><canvas id="chart-dashSeg"></canvas></div>`)}
      </div>

      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("shopping-bag", 14)} Top products</span>`, "By realized revenue", tbl(["Product", "Revenue"], tp.map(([id, v]) => [b(PNAME(id)), money(v)])))}
        ${card(`<span class="bd-card-title">${ic("activity", 14)} Alerts &amp; attention</span>`, "Automated watch items", `<div class="eat-list">
          ${[
            ["users", "blue", `${num(atRisk)} customers are "At Risk" (91–365 days silent)`, `Build a win-back audience → ${quickAud ? `<button class="eat-secbtn" data-cd="nav" data-v="adaud">Ad Audiences</button>` : ""}`],
            ["stethoscope", "amber", `${num(S.customers.filter((c) => !validPhone(c.phone)).length)} missing valid phone · ${num(S.customers.filter((c) => c.consent === "unknown").length)} missing consent`, `Open Data Health to review`],
            ["megaphone", "red", `${num(S.orders.filter((o) => o.status === "returned").length)} returned orders`, `Source returns can indicate a COD or quality problem`],
            ["target", "green", `${quickAud ? quickAud.name + " · " + num(quickAud.usable) + " usable" : "No audience yet"}`, `Audiences are consent-gated before export`],
          ].map(([icn, tone, t, d]) => `<div class="eat-li"><span class="li-ic ${tone}">${ic(icn, 14)}</span><div><div class="li-t">${t}</div>${d ? `<div class="li-d">${d}</div>` : ""}</div></div>`).join("")}
        </div>`)}
      </div>

      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("zap", 14)} Quick actions</span>`, "", `<div class="flex items-center gap-2 flex-wrap">
          <button class="btn btn-p" data-cd="nav" data-v="import">${ic("upload-cloud", 14)} Import data</button>
          <button class="btn btn-o" data-cd="nav" data-v="aibuild">${ic("wand-sparkles", 14)} Build audience</button>
          <button class="btn btn-g" data-cd="nav" data-v="segments">${ic("filter", 14)} Segments</button>
          <button class="btn btn-g" data-cd="nav" data-v="assistant">${ic("bot-message-square", 14)} Ask AI</button>
        </div>`)}
        ${card(`<span class="bd-card-title">${ic("shield", 14)} Privacy status</span>`, "Consent coverage across the base", `
          ${consentBar()}`, `<button class="eat-secbtn" data-cd="nav" data-v="privacy">${ic("shield", 12)} Open Privacy Center</button>`)}
      </div>
      ${confBox("high", [["Evidence", "All KPIs computed from the local customer + order dataset"], ["Data used", num(S.customers.length) + " customers · " + num(S.orders.length) + " orders · " + S.products.length + " products"], ["Assumptions", "Revenue = delivered + confirmed − returns; margin/shipping from Settings"], ["Limitations", "AI only ever runs on aggregates — raw records stay on-device"]])}
    `;
  }

  function consentBar() {
    const n = Math.max(1, S.customers.length);
    const a = S.customers.filter((c) => c.consent === "accepted").length;
    const r = S.customers.filter((c) => c.consent === "refused").length;
    const u = S.customers.filter((c) => c.consent === "unknown").length;
    return `<div class="cd-bar blu"><i style="width:${(a / n) * 100}%"></i></div>
      <div class="cd-consent-grid" style="margin-top:10px">
        ${metric("Accepted", num(a), pct(a / n), "grn")}
        ${metric("Refused", num(r), pct(r / n), "red")}
        ${metric("Unknown", num(u), pct(u / n), "amber")}
      </div>`;
  }

  /* ---------- CUSTOMERS ---------- */
  function vCustomers() {
    let list = S.customers.map((c) => ({ c, m: M[c.id] })).filter((x) => x.m);
    if (ui.cusQ) { const q = ui.cusQ.toLowerCase(); list = list.filter((x) => (x.c.name + " " + x.c.phone + " " + x.c.email + " " + x.c.id).toLowerCase().includes(q)); }
    if (ui.cusSource !== "All") list = list.filter((x) => x.c.source === ui.cusSource);
    if (ui.cusCity !== "All") list = list.filter((x) => x.c.city === ui.cusCity);
    if (ui.cusConsent !== "All") list = list.filter((x) => x.c.consent === ui.cusConsent);
    if (ui.cusRfm !== "All") list = list.filter((x) => x.m.rfmBucket === ui.cusRfm);
    list.sort((a, b) => b.m.revenue - a.m.revenue);

    return `
      ${card(`<span class="bd-card-title">${ic("users", 14)} All customers</span>`, `${num(list.length)} of ${num(S.customers.length)} shown — best revenue first`, `
        <div class="cd-form-grid">
          <input class="input" placeholder="Search name / phone / email…" value="${esc(ui.cusQ)}" data-cd="cusQ">
          <select class="select" data-cd="cusSrc">${["All", ...SOURCES].map((s) => `<option ${s === ui.cusSource ? "selected" : ""}>${s}</option>`).join("")}</select>
          <select class="select" data-cd="cusCity">${["All", ...CITIES.map((c) => c[0])].map((s) => `<option ${s === ui.cusCity ? "selected" : ""}>${s}</option>`).join("")}</select>
          <select class="select" data-cd="cusConsent">${["All", "accepted", "refused", "unknown"].map((s) => `<option ${s === ui.cusConsent ? "selected" : ""}>${s}</option>`).join("")}</select>
          <select class="select" data-cd="cusRfm">${["All", "Champions", "Loyal", "Potential Loyalist", "New / Promising", "Can't Lose", "At Risk", "Need Attention", "Hibernating", "Standard"].map((s) => `<option ${s === ui.cusRfm ? "selected" : ""}>${s}</option>`).join("")}</select>
        </div>
        <div style="margin-top:10px">${tbl(["Customer", "Phone", "City", "Source", "Orders", "Revenue", "AOV", "Quality", "State", ""], list.slice(0, 60).map(({ c, m }) => [
          `<b>${esc(c.name)}</b><div class="cd-hash">${c.id}</div>`,
          c.phone || `<span class="cd-hash">—</span>`,
          c.city, c.source,
          m.orderCount,
          money(m.revenue),
          money(m.aov),
          `<span style="color:${m.quality >= 80 ? "var(--green)" : m.quality >= 60 ? "var(--amber)" : "var(--red)"}">${m.quality}</span>`,
          churnPill(m.churnState),
          `<button class="eat-secbtn" data-cd="openProf" data-v="${c.id}">${ic("user-round", 12)} Open</button>`,
        ]))}</div>
      `)}
    `;
  }

  /* ---------- PROFILES (360) ---------- */
  function vProfiles() {
    const sel = ui.profileId || S.customers[0].id;
    const c = CIdx[sel]; if (!c) return "";
    const m = M[c.id];
    const os = S.orders.filter((o) => o.customerId === c.id).sort((a, b) => dateCmp(b.date, a.date));
    const similar = S.customers.map((x) => M[x.id]).filter((x) => x && x.id !== c.id).map((x) => ({ x, score: simScore(c, m, x) })).filter((s) => s.score >= 3).sort((a, b) => b.score - a.score).slice(0, 6);

    return `
      ${card(`<span class="bd-card-title">${ic("user-round", 14)} Customer 360</span>`, "Select a customer", `
        <select class="select" data-cd="profSel" style="width:100%">
          ${S.customers.slice().sort((a, b) => (M[b.id] ? M[b.id].revenue : 0) - (M[a.id] ? M[a.id].revenue : 0)).map((x) => `<option value="${x.id}" ${x.id === c.id ? "selected" : ""}>${esc(x.name)} · ${num(M[x.id] ? M[x.id].revenue : 0)} DA · ${x.id}</option>`).join("")}
        </select>`)}
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("id-card", 14)} Identity &amp; contact</span>`, "", `
          <div class="cd-360-head"><div><div class="cd-avatar">${esc(c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase())}</div></div>${consentPill(c.consent)}</div>
          <div class="cd-metric-grid" style="margin-top:12px">
            ${metric("Name", esc(c.name), c.id)}
            ${metric("Phone", c.phone || "—", validPhone(c.phone) ? "valid" : "invalid/missing")}
            ${metric("Email", c.email || "—", validEmail(c.email) ? "valid" : "invalid/missing")}
            ${metric("Location", esc(c.city), c.country)}
          </div>
          <div class="cd-metric-grid">
            ${metric("Source", esc(c.source), esc(c.campaign))}
            ${metric("Joined", c.joined, daysAgo(c.joined) + " days ago")}
            ${metric("Tags", (c.tags || []).length ? (c.tags || []).map((t) => pill(t, "pur")).join(" ") : "—", "")}
          </div>
          <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">
            <button class="eat-secbtn" data-cd="expOne" data-v="${c.id}">${ic("download", 12)} Export record</button>
            <button class="eat-secbtn" data-cd="delOne" data-v="${c.id}">${ic("trash-2", 12)} Delete (GDPR)</button>
          </div>
        `)}
        ${card(`<span class="bd-card-title">${ic("activity", 14)} Behavior &amp; value</span>`, "Computed from order history", `
          <div class="cd-metric-grid">
            ${metric("Orders", m.orderCount, m.delivered + " delivered · " + m.cancelled + " cancelled · " + m.returned + " returned")}
            ${metric("Revenue", money(m.revenue), "realized value")}
            ${metric("AOV", money(m.aov), "per realized order")}
            ${metric("Recency", m.recency + "d", "since last order")}
            ${metric("RFM bucket", m.rfmBucket || "—", m.rfm ? "R" + m.r + "·F" + m.f + "·M" + m.m : "")}
            ${metric("CLV est", money(m.clv), ev("ESTIMATED", "est"))}
            ${metric("Profit est", money(m.profit), S.settings.margin + "% margin − shipping − refunds", m.profit < 0 ? "red" : m.profit > 20000 ? "grn" : "amber")}
            ${metric("Quality", m.quality + "/100", m.quality >= 80 ? "strong" : m.quality >= 60 ? "good" : "weak", m.quality >= 80 ? "grn" : m.quality >= 60 ? "amber" : "red")}
          </div>
          ${bar(m.quality, m.quality >= 80 ? "" : m.quality >= 60 ? "amber" : "red")}
          <div style="margin-top:10px">${churnPill(m.churnState)} ${statusPill("delivered")} ${m.returnRate > 20 ? pill("HIGH RETURNS", "red") : ""}</div>
        `)}
      </div>
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("clock", 14)} Timeline</span>`, "Every recorded event", `
          <div class="cd-timeline">
            ${[`<div class="cd-tl-item"><span class="cd-tl-dot blu"></span><div class="cd-tl-body"><div class="cd-tl-t">Joined — ${esc(c.source)}</div><div class="cd-tl-s">${c.joined} · campaign: ${esc(c.campaign)}</div></div></div>`].concat(os.map((o) => `
            <div class="cd-tl-item"><span class="cd-tl-dot ${o.status === "returned" || o.status === "cancelled" ? "red" : o.status === "pending" ? "amber" : "green"}"></span>
              <div class="cd-tl-body"><div class="cd-tl-t">${o.id} · ${esc(PNAME(o.product))} · ${money(o.value)}</div>
              <div class="cd-tl-s">${o.date} · ${statusPill(o.status)} ${pill(o.payment.toUpperCase(), "gray")}</div></div></div>`)).join("")}
          </div>`)}
        ${card(`<span class="bd-card-title">${ic("copy-check", 14)} Similar customers</span>`, "Shared products, behavior & value", `
          ${similar.length ? tbl(["Customer", "Score", "Orders", "Revenue"], similar.map(({ x }) => [
            `<button class="eat-secbtn" data-cd="openProf" data-v="${x.id}">${esc(CIdx[x.id].name)}</button>`, x.score, x.orderCount, money(x.revenue)])) : `<div class="tip info">No close matches found.</div>`}
          <div class="tip info">Similarity is scored on shared products (weight 4), AOV closeness (2), order count (1) and city (1). It powers lookalike suggestions.</div>`)}
      </div>
    `;
  }
  function simScore(c, m, x) {
    const shared = m.products.filter((p) => x.products.includes(p)).length;
    let s = shared * 4;
    if (m.aov && x.aov && Math.abs(m.aov - x.aov) / Math.max(1, m.aov) < 0.4) s += 2;
    if (Math.abs(m.orderCount - x.orderCount) <= 1) s += 1;
    if (CIdx[c.id].city === CIdx[x.id].city) s += 1;
    return s;
  }

  /* ---------- ORDERS ---------- */
  function vOrders() {
    let list = S.orders.slice().sort((a, b) => dateCmp(b.date, a.date));
    if (ui.ordQ) { const q = ui.ordQ.toLowerCase(); list = list.filter((o) => (o.id + " " + o.customerId + " " + (CIdx[o.customerId] ? CIdx[o.customerId].name : "") + " " + (CIdx[o.customerId] ? CIdx[o.customerId].phone : "")).toLowerCase().includes(q)); }
    if (ui.ordStatus !== "All") list = list.filter((o) => o.status === ui.ordStatus);
    if (ui.ordSource !== "All") list = list.filter((o) => o.source === ui.ordSource);
    const tot = list.reduce((s, o) => s + o.value, 0);

    return `
      ${card(`<span class="bd-card-title">${ic("shopping-cart", 14)} Orders</span>`, `${num(list.length)} shown · total value ${money(tot)}`, `
        <div class="cd-form-grid">
          <input class="input" placeholder="Search order / customer / phone…" value="${esc(ui.ordQ)}" data-cd="ordQ">
          <select class="select" data-cd="ordStatus">${["All", "delivered", "confirmed", "pending", "cancelled", "returned"].map((s) => `<option ${s === ui.ordStatus ? "selected" : ""}>${s}</option>`).join("")}</select>
          <select class="select" data-cd="ordSource">${["All", ...SOURCES].map((s) => `<option ${s === ui.ordSource ? "selected" : ""}>${s}</option>`).join("")}</select>
        </div>
        <div style="margin-top:10px">${tbl(["Order", "Customer", "Date", "Product", "Qty", "Value", "Status", "Payment", "Source"], list.slice(0, 80).map((o) => {
          const c = CIdx[o.customerId];
          return [o.id, c ? `<b>${esc(c.name)}</b><div class="cd-hash">${c.id}</div>` : o.customerId, o.date, esc(PNAME(o.product)), o.qty, money(o.value), statusPill(o.status), pill(o.payment.toUpperCase(), "gray"), o.source];
        }))}</div>
        ${list.length > 80 ? `<div class="tip info">Showing the first 80 of ${num(list.length)} — refine with search or filters.</div>` : ""}
      `)}
    `;
  }

  /* ---------- PRODUCTS ---------- */
  function vProducts() {
    const rows = PRODUCTS.map((p) => {
      const os = S.orders.filter((o) => o.product === p.id);
      const realized = os.filter((o) => o.status === "delivered" || o.status === "confirmed");
      const rev = realized.reduce((s, o) => s + o.value, 0) - os.filter((o) => o.status === "returned").reduce((s, o) => s + o.value, 0);
      const buyers = new Set(os.map((o) => o.customerId)).size;
      const cancelRate = os.length ? (os.filter((o) => o.status === "cancelled").length / os.length) * 100 : 0;
      const returnRate = os.length ? (os.filter((o) => o.status === "returned").length / os.length) * 100 : 0;
      return { p, os: os.length, rev, buyers, cancelRate, returnRate, aov: realized.length ? rev / realized.length : 0 };
    }).sort((a, b) => b.rev - a.rev);

    const pairs = {};
    S.orders.forEach((o) => {
      const sib = S.orders.filter((x) => x.customerId === o.customerId && x.product !== o.product && (x.status === "delivered" || x.status === "confirmed"));
      sib.forEach((x) => { const k = [o.product, x.product].sort().join("|"); pairs[k] = pairs[k] || { a: o.product, b: x.product, n: 0 }; pairs[k].n++; });
    });
    const cross = Object.values(pairs).sort((a, b) => b.n - a.n).slice(0, 8);

    return `
      ${card(`<span class="bd-card-title">${ic("shopping-bag", 14)} Product performance</span>`, "Realized revenue, buyers and COD health", `
        ${tbl(["Product", "Category", "Orders", "Buyers", "Revenue", "Cancel %", "Return %"], rows.map((r) => [b(r.p.name), pill(r.p.cat, "gray"), r.os, r.buyers, money(r.rev), pct(r.cancelRate / 100), pct(r.returnRate / 100)]))}
      `)}
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("git-compare", 14)} Cross-sell pairs</span>`, "Products bought together most often", tbl(["Pair", "Co-purchases"], cross.map((c) => [`${b(PNAME(c.a))} <span style="color:var(--muted2)">+</span> ${b(PNAME(c.b))}`, c.n])))}
        ${card(`<span class="bd-card-title">${ic("zap", 14)} Product audience shortcuts</span>`, "One-click smart audiences", `
          <div class="eat-list">
            ${rows.slice(0, 4).map((r) => `<div class="eat-li"><span class="li-ic green">${ic("shopping-bag", 14)}</span><div><div class="li-t">${esc(r.p.name)}</div><div class="li-d">${num(r.buyers)} buyers · ${money(r.rev)} realized</div><div style="margin-top:4px"><button class="eat-secbtn" data-cd="prodAud" data-v="${r.p.id}" data-g="upsell">${ic("trending-up", 12)} Upsell buyers</button> <button class="eat-secbtn" data-cd="prodAud" data-v="${r.p.id}" data-g="crosssell">${ic("share-2", 12)} Cross-sell non-buyers</button></div></div></div>`).join("")}
          </div>
          <div class="tip info">Upsell targets buyers of the product; cross-sell targets high-value customers who never bought it. Both are consent-gated at export time.</div>`)}
      </div>
    `;
  }

  /* ---------- IMPORT ---------- */
  function vImport() {
    const pv = ui.importPreview;
    return `
      ${card(`<span class="bd-card-title">${ic("upload-cloud", 14)} Import data</span>`, "CSV files or pasted tables — a demo dataset is provided", `
        <div class="cd-drop" id="cd-drop" data-cd="pickFile">
          ${ic("file-up", 30)}<div class="cd-drop-big">Drop a CSV here or click to browse</div>
          <div class="cd-drop-sub">Also accepted: pasted tables below · .csv, .txt, .tsv</div>
        </div>
        <input type="file" id="cd-file" accept=".csv,.txt,.tsv" style="display:none">
        <div style="margin-top:10px">
          <div class="bd-card-sub" style="margin-bottom:6px">Or paste rows (header + data):</div>
          <textarea class="textarea" id="cd-paste" rows="6" placeholder="Name,Phone,Email,City,Order Date,Product,Value,Status,Source,Campaign&#10;Yasmine Bensaad,0555123456,yasmine@gmail.com,Algiers,2026-07-01,EmberFlow Electric Kettle,5200,delivered,Facebook Ads,Ramadan 2026"></textarea>
          <div class="flex items-center gap-2 flex-wrap" style="margin-top:8px">
            <button class="btn btn-o" data-cd="sampleCsv">${ic("sparkles", 14)} Load demo CSV</button>
            <button class="btn btn-p" data-cd="parseImport">${ic("scan-line", 14)} Scan &amp; preview</button>
          </div>
        </div>
        <div class="tip info" style="margin-top:10px">${ic("shield", 13)} Importing is non-destructive: existing customers are matched on phone/email and updated, nothing is silently deleted, and every new record starts as consent = <b>unknown</b> until you confirm permission.</div>`)}
      ${pv ? card(`<span class="bd-card-title">${ic("table", 14)} Mapping preview</span>`, "AI column detection with synonym matching", `
        ${Object.keys(pv.map).map((i) => { const k = pv.map[i]; return `<div class="cd-map-row"><b>${esc(pv.header[i] || "col " + i)}</b><select class="select" data-cd="mapCol" data-i="${i}">${["", ...Object.keys(COL_SYN)].map((c) => `<option value="${c}" ${c === k ? "selected" : ""}>${c || "— ignore —"}</option>`).join("")}</select>${k ? `<span class="cd-map-tag ok">mapped</span>` : `<span class="cd-map-tag miss">unmapped</span>`}</div>`}).join("")}
        <div class="cd-metric-grid">
          ${metric("Rows to process", num(pv.rowsToAdd.length), "after skipping empty rows")}
          ${metric("New customers", num(pv.stats.newCustomers), "matched on phone/email", "grn")}
          ${metric("Duplicates", num(pv.stats.duplicates), "already in base — skipped", "amber")}
          ${metric("Rejected", num(pv.stats.rejected), "invalid phone/email", "red")}
        </div>
        ${bar(pv.qScore, pv.qScore >= 80 ? "" : pv.qScore >= 60 ? "amber" : "red")}
        <div class="cd-hash" style="margin-top:6px">Import quality score: ${pv.qScore}/100</div>
        <div style="margin-top:10px">${tbl(["Name", "Phone", "Email", "City", "Product", "Value", "Status"], pv.rowsToAdd.slice(0, 8).map((r) => [esc(r.name), r.phone, r.email, esc(r.city || "—"), r.product ? esc(r.product) : "—", r.value ? money(r.value) : "—", r.dup ? pill("DUP", "amber") : r.phoneOk && r.emailOk ? pill("OK", "green") : pill("CHECK", "red")]))}</div>
        <button class="btn btn-p" data-cd="applyImport">${ic("check-circle", 14)} Import ${num(pv.rowsToAdd.filter((r) => !r.dup).length)} clean rows</button>
        <span class="tip info">${ic("layers", 13)} Files larger than 5MB are processed in chunks (1,000 rows per tick) so the UI never freezes.</span>`)
        : ""}
    `;
  }

  /* ---------- SOURCES ---------- */
  function vSources() {
    const srcMeta = {
      "Facebook Ads": { icon: "facebook", note: "Page + Pixel API connector" },
      "Instagram Ads": { icon: "instagram", note: "Meta Business connector" },
      "TikTok Ads": { icon: "music-2", note: "TikTok Events connector" },
      "Google Ads": { icon: "search", note: "Google Ads + Analytics" },
      "Organic": { icon: "globe", note: "Site + Google Analytics" },
      "WhatsApp": { icon: "message-circle", note: "WhatsApp Business API" },
      "Referral": { icon: "share-2", note: "Affiliate / referral events" },
      "Email": { icon: "mail", note: "Email service events" },
    };
    const rows = SOURCES.map((s) => {
      const cs = S.customers.filter((c) => c.source === s);
      const os = S.orders.filter((o) => o.source === s);
      const rev = cs.reduce((t, c) => t + M[c.id].revenue, 0);
      const delivered = os.filter((o) => o.status === "delivered").length;
      return { s, cs: cs.length, os: os.length, rev, codRate: os.length ? (delivered / os.length) * 100 : 0 };
    }).sort((a, b) => b.rev - a.rev);

    return `
      <div class="g4">
        ${kpi("Active sources", num(SOURCES.length), "8 connectors configured", "blu")}
        ${kpi("Synced customers", num(S.customers.length), "100% local base", "grn")}
        ${kpi("Revenue leader", esc(rows[0] ? rows[0].s : "—"), rows[0] ? money(rows[0].rev) : "", "gold")}
        ${kpi("Auto-imported", num(0), "manual sync only (simulated)", "tel")}
      </div>
      ${card(`<span class="bd-card-title">${ic("plug-zap", 14)} Data sources</span>`, "Connectors feed the unified customer base", `
        ${tbl(["Source", "Connector", "Customers", "Orders", "Revenue", "COD delivery", ""], rows.map((r) => [b(r.s), pill(srcMeta[r.s] ? srcMeta[r.s].note : "—", "gray"), r.cs, r.os, money(r.rev), pct(r.codRate / 100), `<button class="eat-secbtn" data-cd="syncSrc" data-v="${r.s}">${ic("refresh-cw", 12)} Sync</button>`]))}
      `)}
      <div class="tip info">${ic("database", 13)} All sources land in the same local store; identity resolution de-duplicates on normalized phone / email before a Customer 360 is built. No source data is ever sent to a model.</div>
    `;
  }

  /* ---------- HEALTH ---------- */
  function vHealth() {
    const ms = allMetrics();
    const noPhone = S.customers.filter((c) => !validPhone(c.phone));
    const badEmail = S.customers.filter((c) => c.email && !validEmail(c.email));
    const noEmail = S.customers.filter((c) => !c.email);
    const noConsent = S.customers.filter((c) => c.consent === "unknown");
    const avgQ = ms.length ? ms.reduce((s, m) => s + m.quality, 0) / ms.length : 0;
    const dupGroups = findDupGroups();

    return `
      <div class="g4">
        ${kpi("Avg quality score", num(avgQ, 0) + "/100", "across base", avgQ >= 80 ? "grn" : avgQ >= 60 ? "amber" : "red")}
        ${kpi("Missing phones", num(noPhone.length), "block ad-matching", "red")}
        ${kpi("Invalid emails", num(badEmail.length), num(noEmail.length) + " missing", "amber")}
        ${kpi("Missing consent", num(noConsent.length), "blocked from export", "amber")}
      </div>
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("stethoscope", 14)} Quality report</span>`, "Automated hygiene checks", `
          <div class="eat-list">
            ${[
              ["badge-check", "green", `Valid phone coverage`, `${pct(1 - noPhone.length / S.customers.length)} of customers have a valid DZ mobile`],
              ["mail-x", "amber", `Email health`, `${num(badEmail.length)} invalid · ${num(noEmail.length)} missing`],
              ["shield-alert", "amber", `Consent coverage`, `${pct(1 - noConsent.length / S.customers.length)} have an explicit choice`],
              ["merge", "blue", `Duplicate clusters`, `${num(dupGroups.length)} groups need identity resolution`],
              ["repeat", "blue", `Repeat behavior`, `${num(ms.filter((m) => m.orderCount >= 2).length)} customers ordered 2+ times`],
            ].map(([icn, tone, t, d]) => `<div class="eat-li"><span class="li-ic ${tone}">${ic(icn, 14)}</span><div><div class="li-t">${t}</div><div class="li-d">${d}</div></div></div>`).join("")}
          </div>
          <button class="btn btn-o" data-cd="fixPhones">${ic("wand-sparkles", 14)} Auto-normalize phones</button>
        `)}
        ${card(`<span class="bd-card-title">${ic("filter", 14)} Records needing attention</span>`, "Bottom of the quality distribution", `
          ${tbl(["Customer", "Phone", "Email", "Consent", "Quality"], S.customers.map((c) => ({ c, m: M[c.id] })).filter((x) => x.m && x.m.quality < 60).sort((a, b) => a.m.quality - b.m.quality).slice(0, 8).map(({ c, m }) => [b(esc(c.name)), c.phone || "—", c.email || "—", consentPill(c.consent), `<span style="color:var(--red)">${m.quality}</span>`]))}
          <div class="tip warn">Cleaning fixes format issues and normalizes values. It never deletes records — deduplication happens explicitly in Identity Resolution with a review step.</div>`)}
      </div>
    `;
  }

  /* ---------- IDENTITY ---------- */
  function vIdentity() {
    const groups = findDupGroups();
    return `
      <div class="g4">
        ${kpi("Duplicate clusters", num(groups.length), "found by phone/email", groups.length ? "amber" : "grn")}
        ${kpi("Affected records", num(groups.reduce((s, g) => s + g.members.length, 0)), "candidates for merge", "amber")}
        ${kpi("Merged so far", num(S.customers.filter((c) => c.mergedInto).length + S.history.filter((h) => h.action === "Identity merged").length), "kept best record", "grn")}
      </div>
      ${groups.length === 0 ? `<div class="tip ok">${ic("badge-check", 14)} No duplicate clusters detected. Every customer is unique on phone/email.</div>` : ""}
      ${groups.slice(0, 15).map((g) => {
        const mains = g.members.sort((a, b) => (M[b.id].orderCount - M[a.id].orderCount) || (M[b.id].revenue - M[a.id].revenue));
        const keep = mains[0];
        return card(`<span class="bd-card-title">${ic("merge", 14)} Group: ${esc(keep.name)}</span>`, `${g.members.length} records share contact data`, `
          ${tbl(["Record", "Phone", "Email", "Orders", "Revenue", "Match"], mains.map((m2) => [b(esc(m2.name)) + (m2.id === keep.id ? ` ${pill("KEEP", "green")}` : ""), m2.phone || "—", m2.email || "—", M[m2.id].orderCount, money(M[m2.id].revenue), m2.id === keep.id ? pill("best record", "green") : pill("duplicate", "amber")]))}
          <div class="flex items-center gap-2 flex-wrap">
            <button class="btn btn-p" data-cd="mergeGroup" data-v="${keep.id}">${ic("merge", 14)} Merge into ${esc(keep.name)}</button>
            <button class="btn btn-g" data-cd="keepGroup" data-v="${keep.id}">${ic("check-circle", 14)} Keep separate</button>
          </div>
        `);
      }).join("")}
      ${groups.length > 15 ? `<div class="tip info">Showing the first 15 of ${num(groups.length)} clusters.</div>` : ""}
      <div class="tip info">${ic("shield", 13)} Merging absorbs orders and history into the best record and marks the others as merged — nothing is hard-deleted. Confidence is based on shared normalized phone/email.</div>
    `;
  }

  /* ---------- SEGMENTS ---------- */
  function vSegments() {
    const segTab = ui.tab.segments || "saved";
    const tabs = `<div class="cd-tabs">
      <button class="eat-secbtn ${segTab === "saved" ? "active" : ""}" data-cd="segTab" data-v="saved">Saved (${(S.segments || []).length})</button>
      <button class="eat-secbtn ${segTab === "builder" ? "active" : ""}" data-cd="segTab" data-v="builder">Smart filter builder</button>
    </div>`;

    if (segTab === "builder") return `${tabs}${builderCard()}`;

    return `${tabs}${card(`<span class="bd-card-title">${ic("filter", 14)} Saved segments</span>`, "Rule-based segments, preview before export", `
      ${tbl(["Segment", "Rules", "Customers", "Revenue", "AOV", "", ""], (S.segments || []).map((sg) => {
        const members = evalSegmentById(sg.id);
        const rev = members.reduce((s, id) => s + M[id].revenue, 0);
        const aov = members.reduce((s, id) => s + M[id].realizedCount, 0);
        return [b(esc(sg.name)), sg.rules.length, num(members.length), money(rev), aov ? money(rev / aov) : "—",
          `<button class="eat-secbtn" data-cd="segPreview" data-v="${sg.id}">${ic("eye", 12)} Preview</button>`,
          `<button class="eat-secbtn" data-cd="segDelete" data-v="${sg.id}">${ic("trash-2", 12)}</button>`];
      }))}
      <button class="btn btn-o" data-cd="segTab" data-v="builder">${ic("plus", 14)} New segment</button>
    `)}` + (ui.segMembers ? segMembersCard(ui.segMembers) : "");
  }

  function builderCard() {
    const rules = ui.segRules.length ? ui.segRules : [{ f: "source", op: "eq", v: SOURCES[0], logic: "and" }];
    const preview = evalSegment(rules);
    return card(`<span class="bd-card-title">${ic("wand-sparkles", 14)} Smart filter builder</span>`, "AND / OR / NOT conditions over any field", `
      <div class="cd-rules">
        ${rules.map((r, i) => {
          const fm = fieldMeta(r.f);
          return `<div class="cd-rule-row">
            <select class="select cd-conn" data-cd="ruleLogic" data-i="${i}">${["and", "or", "not"].map((x) => `<option value="${x}" ${(r.logic || "and") === x ? "selected" : ""}>${x.toUpperCase()}</option>`).join("")}</select>
            <select class="select" data-cd="ruleField" data-i="${i}">${FIELDS.map((f) => `<option value="${f.id}" ${f.id === r.f ? "selected" : ""}>${f.label}</option>`).join("")}</select>
            <select class="select" data-cd="ruleOp" data-i="${i}">${(fm ? fm.op : ["eq"]).map((o) => `<option value="${o}" ${o === r.op ? "selected" : ""}>${o}</option>`).join("")}</select>
            ${fm && fm.vals ? `<select class="select" data-cd="ruleVal" data-i="${i}">${(fm.vals.indexOf(r.v) >= 0 ? [r.v, ...fm.vals.filter((v) => v !== r.v)] : fm.vals).map((v) => `<option ${v === r.v ? "selected" : ""}>${v}</option>`).join("")}</select>`
              : `<input class="input" value="${esc(r.v)}" data-cd="ruleVal" data-i="${i}" placeholder="value">`}
            ${i > 0 ? `<button class="eat-secbtn" data-cd="ruleDel" data-i="${i}">${ic("x", 12)}</button>` : ""}
          </div>`;
        }).join("")}
      </div>
      <button class="eat-secbtn" data-cd="ruleAdd">${ic("plus", 12)} Add condition</button>
      <div class="cd-metric-grid" style="margin-top:10px">
        ${metric("Matching customers", num(preview.length), pct(preview.length / S.customers.length))}
        ${metric("Segment revenue", money(preview.reduce((s, id) => s + M[id].revenue, 0)), "realized")}
      </div>
      ${tbl(["Customer", "Orders", "Revenue", "State"], preview.slice(0, 6).map((id) => { const m = M[id]; return [b(esc(CIdx[id].name)), m.orderCount, money(m.revenue), churnPill(m.churnState)]; }))}
      <div class="flex items-center gap-2 flex-wrap">
        <input class="input" id="cd-segName" placeholder="Segment name…" style="max-width:260px">
        <button class="btn btn-p" data-cd="segSave">${ic("save", 14)} Save segment</button>
      </div>
    `);
  }
  function segMembersCard(sg) {
    const members = evalSegment(sg.rules);
    return card(`<span class="bd-card-title">${ic("eye", 14)} ${esc(sg.name)} — preview</span>`, `${num(members.length)} customers`, `
      ${tbl(["Customer", "City", "Orders", "Revenue", "Quality", "State"], members.slice(0, 12).map((id) => { const m = M[id]; const c = CIdx[id]; return [b(esc(c.name)), c.city, m.orderCount, money(m.revenue), m.quality, churnPill(m.churnState)]; }))}
      <div class="flex items-center gap-2 flex-wrap">
        <button class="btn btn-p" data-cd="audFromSeg" data-v="${sg.id}">${ic("target", 14)} Build audience from segment</button>
        <button class="btn btn-g" data-cd="segClear">${ic("x", 12)} Close</button>
      </div>
    `);
  }

  /* ---------- RFM ---------- */
  function vRfm() {
    const buckets = ["Champions", "Loyal", "Potential Loyalist", "New / Promising", "Can't Lose", "At Risk", "Need Attention", "Hibernating", "Standard"];
    const data = buckets.map((bk) => {
      const ms = allMetrics().filter((m) => (m.rfmBucket || "Standard") === bk);
      return { bk, n: ms.length, rev: ms.reduce((s, m) => s + m.revenue, 0) };
    }).filter((d) => d.n > 0);
    pushChart("rfm", { type: "doughnut", labels: data.map((d) => d.bk), datasets: [{ label: "Customers", data: data.map((d) => d.n), color: "#A78BFA" }] });

    return `
      <div class="g4">
        ${kpi("Customers scored", num(allMetrics().filter((m) => m.orderCount > 0).length), "R · F · M quartiles", "blu")}
        ${kpi("Champions", num((data.find((d) => d.bk === "Champions") || {}).n || 0), "best recency + frequency + value", "gold")}
        ${kpi("At risk (RFM)", num((data.find((d) => d.bk === "At Risk") || {}).n || 0), "was valuable, going cold", "red")}
        ${kpi("Hibernating", num((data.find((d) => d.bk === "Hibernating") || {}).n || 0), "rare + low value", "gray")}
      </div>
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("layers", 14)} RFM distribution</span>`, "Customers per behavioral bucket", `<div class="chw-lg"><canvas id="chart-rfm"></canvas></div>`)}
        ${card(`<span class="bd-card-title">${ic("grid-2x2", 14)} Bucket detail</span>`, "Recency · Frequency · Monetary", `${tbl(["Bucket", "Customers", "Revenue", "Share"], data.map((d) => [b(d.bk), d.n, money(d.rev), pct(d.n / Math.max(1, S.customers.length))]))}`)}
      </div>
      ${card(`<span class="bd-card-title">${ic("users", 14)} Sample per bucket</span>`, "Click a customer to open the full 360", `
        ${data.map((d) => `<div style="margin:6px 0"><div class="bd-card-sub" style="margin-bottom:4px">${b(d.bk)} — ${num(d.n)} customers</div>${tbl(["Customer", "Orders", "Revenue", "Recency", "State"], allMetrics().filter((m) => (m.rfmBucket || "Standard") === d.bk).slice(0, 4).map((m) => [b(esc(CIdx[m.id].name)), m.orderCount, money(m.revenue), m.recency + "d", churnPill(m.churnState)]))}</div>`).join("")}
      `)}
      <div class="tip info">${ic("info", 13)} RFM is computed on quartiles of the local dataset. Use buckets as rules in Segments or directly as audiences — the AI Audience Builder can target any bucket with a plain-language request.</div>
    `;
  }

  /* ---------- VALUE ---------- */
  function vValue() {
    const ms = allMetrics().filter((m) => m.revenue > 0);
    const totalClv = ms.reduce((s, m) => s + m.clv, 0);
    const totalProfit = ms.reduce((s, m) => s + m.profit, 0);
    const unprofitable = ms.filter((m) => m.profit < 0).sort((a, b) => a.profit - b.profit);
    const bySeg = {};
    ms.forEach((m) => { bySeg[m.rfmBucket || "Standard"] = bySeg[m.rfmBucket || "Standard"] || { n: 0, rev: 0, profit: 0 }; bySeg[m.rfmBucket || "Standard"].n++; bySeg[m.rfmBucket || "Standard"].rev += m.revenue; bySeg[m.rfmBucket || "Standard"].profit += m.profit; });

    return `
      <div class="g4">
        ${kpi("Total customer value", money(ms.reduce((s, m) => s + m.revenue, 0)), "realized revenue", "gold")}
        ${kpi("Est. CLV pool", money(totalClv), "AOV × frequency × lifespan", "pur")}
        ${kpi("Est. profit", money(totalProfit), S.settings.margin + "% margin − shipping − refunds", totalProfit > 0 ? "grn" : "red")}
        ${kpi("Unprofitable", num(unprofitable.length), "negative after costs", unprofitable.length ? "red" : "grn")}
      </div>
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("coins", 14)} Value by RFM bucket</span>`, "", tbl(["Bucket", "Customers", "Revenue", "Profit"], Object.entries(bySeg).sort((a, b) => b[1].rev - a[1].rev).map(([k, v]) => [b(k), v.n, money(v.rev), `<span style="color:${v.profit < 0 ? "var(--red)" : "var(--green)"}">${money(v.profit)}</span>`])))}
        ${card(`<span class="bd-card-title">${ic("trending-down", 14)} Unprofitable customers</span>`, "Profit-destroyers — review before marketing to them", tbl(["Customer", "Revenue", "Orders", "Returns", "Profit"], unprofitable.slice(0, 8).map((m) => [b(esc(CIdx[m.id].name)), money(m.revenue), m.orderCount, m.returned, `<span style="color:var(--red)">${money(m.profit)}</span>`])) + `<div class="tip warn">${ic("alert-triangle", 13)} These customers cost more than they return after shipping + refunds. Exclude them from paid acquisition audiences or add a minimum-order rule.</div>`)}
      </div>
      ${card(`<span class="bd-card-title">${ic("settings-2", 14)} Value model</span>`, "Configure assumptions in Settings", `
        <div class="cd-metric-grid">
          ${metric("Margin", S.settings.margin + "%", "contribution margin")}
          ${metric("Shipping / order", money(S.settings.shipping), "realized orders")}
          ${metric("Refund %", S.settings.refundRate + "%", "of returned value")}
          ${metric("Evidence", "", ev("ESTIMATED", "est"), "blu")}
        </div>`)}
    `;
  }

  /* ---------- INTELLIGENCE ---------- */
  function vIntelligence() {
    const tab = ui.tab.intelligence || "cod";
    const tabs = `<div class="cd-tabs">
      ${[["cod", "COD Intelligence", "truck"], ["quality", "Quality Score", "stethoscope"], ["churn", "Churn & Retention", "heart-pulse"], ["value", "Value Matrix", "coins"]].map(([id, l, ico]) => `<button class="eat-secbtn ${tab === id ? "active" : ""}" data-cd="intelTab" data-v="${id}">${ic(ico, 12)} ${l}</button>`).join("")}
    </div>`;
    let body = "";
    if (tab === "cod") {
      const bySrc = SOURCES.map((s) => {
        const os = S.orders.filter((o) => o.source === s);
        if (!os.length) return null;
        const confirmed = os.filter((o) => o.status === "confirmed" || o.status === "delivered").length;
        const delivered = os.filter((o) => o.status === "delivered").length;
        const cancelled = os.filter((o) => o.status === "cancelled").length;
        const returned = os.filter((o) => o.status === "returned").length;
        return { s, n: os.length, confirm: confirmed / os.length * 100, deliver: delivered / os.length * 100, cancel: cancelled / os.length * 100, ret: returned / os.length * 100 };
      }).filter(Boolean);
      const riskySources = bySrc.filter((x) => x.cancel > 25);
      body = `<div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("truck", 14)} COD health by source</span>`, "Confirmation → delivery → cancel → return", tbl(["Source", "Orders", "Confirm %", "Deliver %", "Cancel %", "Return %"], bySrc.map((x) => [b(x.s), x.n, pct(x.confirm / 100), pct(x.deliver / 100), `<span style="color:${x.cancel > 25 ? "var(--red)" : "var(--muted)"}">${pct(x.cancel / 100)}</span>`, pct(x.ret / 100)])))}
        ${card(`<span class="bd-card-title">${ic("alert-triangle", 14)} COD risk findings</span>`, "Where money is leaking", `
          <div class="eat-list">
            ${(riskySources.length ? riskySources : bySrc).map((x) => `<div class="eat-li"><span class="li-ic ${x.cancel > 25 ? "red" : "green"}">${ic("truck", 14)}</span><div><div class="li-t">${b(x.s)} — ${pct(x.cancel / 100)} cancellation rate</div><div class="li-d">${x.cancel > 25 ? "Above the 25% threshold. Consider call-confirmation before shipping." : "Healthy COD flow."}</div></div></div>`).join("")}
          </div>
          <button class="btn btn-o" data-cd="nav" data-v="adaud">${ic("target", 14)} Build a "COD risk" audience</button>`)}
      </div>`;
    } else if (tab === "quality") {
      const ms = allMetrics();
      const tiers = { strong: ms.filter((m) => m.quality >= 80).length, good: ms.filter((m) => m.quality >= 60 && m.quality < 80).length, weak: ms.filter((m) => m.quality >= 40 && m.quality < 60).length, poor: ms.filter((m) => m.quality < 40).length };
      const lows = ms.filter((m) => m.quality < 60).sort((a, b) => a.quality - b.quality);
      body = `<div class="g4">
        ${kpi("Strong (80+)", num(tiers.strong), pct(tiers.strong / S.customers.length), "grn")}
        ${kpi("Good (60–79)", num(tiers.good), pct(tiers.good / S.customers.length), "blu")}
        ${kpi("Weak (40–59)", num(tiers.weak), pct(tiers.weak / S.customers.length), "amber")}
        ${kpi("Poor (&lt;40)", num(tiers.poor), pct(tiers.poor / S.customers.length), "red")}
      </div>
      ${card(`<span class="bd-card-title">${ic("stethoscope", 14)} Score drivers</span>`, "What pulls a score down", `<div class="eat-list">
        ${[["badge-alert", "red", `${num(S.customers.filter((c) => !validPhone(c.phone)).length)} missing valid phone`, "Phone is the primary key for COD + ad matching"], ["mail-x", "amber", `${num(S.customers.filter((c) => c.email && !validEmail(c.email)).length)} invalid emails`, "Email powers re-marketing + Customer Match"], ["shield-alert", "amber", `${num(S.customers.filter((c) => c.consent === "unknown").length)} unknown consent`, "Unknown consent blocks ad export"], ["rotate-ccw", "red", `${num(S.customers.filter((c) => M[c.id].returnRate > 20).length)} with high return rate`, "Returns burn margin"]].map(([icn, tone, t, d]) => `<div class="eat-li"><span class="li-ic ${tone}">${ic(icn, 14)}</span><div><div class="li-t">${t}</div><div class="li-d">${d}</div></div></div>`).join("")}
      </div>`)}
      ${card(`<span class="bd-card-title">${ic("filter", 14)} Lowest-scored records</span>`, "Fix data first, then market", tbl(["Customer", "Quality", "Phone", "Email", "Consent"], lows.slice(0, 8).map((m) => [b(esc(CIdx[m.id].name)), m.quality, CIdx[m.id].phone || "—", CIdx[m.id].email || "—", consentPill(CIdx[m.id].consent)])))}`;
    } else if (tab === "churn") {
      const states = ["Active", "Cooling", "At Risk", "Dormant", "Lost"];
      const counts = states.map((s) => allMetrics().filter((m) => m.churnState === s).length);
      pushChart("churn", { type: "bar", labels: states, datasets: [{ label: "Customers", data: counts, color: "#FF6B6B" }] });
      const winback = allMetrics().filter((m) => m.recency >= 91 && m.recency <= 365 && m.orderCount >= 1);
      body = `<div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("heart-pulse", 14)} Activity states</span>`, "Recency-based lifecycle", `<div class="chw-lg"><canvas id="chart-churn"></canvas></div>`)}
        ${card(`<span class="bd-card-title">${ic("repeat", 14)} Win-back pool</span>`, `${num(winback.length)} buyers silent 91–365 days · est. ${money(winback.reduce((s, m) => s + m.revenue, 0))} recoverable`, `
          ${tbl(["Customer", "Last order", "Orders", "Revenue", "State"], winback.sort((a, b) => b.revenue - a.revenue).slice(0, 8).map((m) => [b(esc(CIdx[m.id].name)), m.lastOrder, m.orderCount, money(m.revenue), churnPill(m.churnState)]))}
          <button class="btn btn-p" data-cd="nav" data-v="adaud">${ic("megaphone", 14)} Target this pool</button>
          <div class="tip info">${ic("info", 13)} Win-back is a classic AI audience — build it in the AI Audience Builder by typing "win back customers who bought before".</div>`)}
      </div>`;
    } else {
      const ms = allMetrics();
      const byCity = {};
      ms.forEach((m) => { byCity[CIdx[m.id].city] = byCity[CIdx[m.id].city] || { n: 0, rev: 0, profit: 0 }; byCity[CIdx[m.id].city].n++; byCity[CIdx[m.id].city].rev += m.revenue; byCity[CIdx[m.id].city].profit += m.profit; });
      const cities = Object.entries(byCity).sort((a, b) => b[1].profit - a[1].profit).slice(0, 8);
      const bySrc = {};
      ms.forEach((m) => { bySrc[CIdx[m.id].source] = bySrc[CIdx[m.id].source] || { n: 0, rev: 0, profit: 0 }; bySrc[CIdx[m.id].source].n++; bySrc[CIdx[m.id].source].rev += m.revenue; bySrc[CIdx[m.id].source].profit += m.profit; });
      body = `<div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("map-pin", 14)} Profit by city</span>`, "Where the profit actually is", tbl(["City", "Customers", "Revenue", "Profit"], cities.map(([k, v]) => [b(k), v.n, money(v.rev), `<span style="color:${v.profit < 0 ? "var(--red)" : "var(--green)"}">${money(v.profit)}</span>`])))}
        ${card(`<span class="bd-card-title">${ic("bar-chart-3", 14)} Profit by source</span>`, "Acquisition quality by channel", tbl(["Source", "Customers", "Revenue", "Profit"], Object.entries(bySrc).sort((a, b) => b[1].profit - a[1].profit).map(([k, v]) => [b(k), v.n, money(v.rev), `<span style="color:${v.profit < 0 ? "var(--red)" : "var(--green)"}">${money(v.profit)}</span>`])))}
      </div>
      <div class="tip info">${ic("info", 13)} Value matrix cross-references behavior with money. A "best customer" is not just high revenue — it is high quality, low returns and positive profit.</div>`;
    }
    return tabs + body;
  }

  /* ---------- AUDIENCES ---------- */
  function vAudiences() {
    const list = S.audiences || [];
    return `
      ${card(`<span class="bd-card-title">${ic("target", 14)} Smart audiences</span>`, "Versioned, snapshot-based, consent-gated", `
        ${list.length === 0 ? `<div class="tip info">No audiences yet. Build one from a segment, a product shortcut, or the AI Audience Builder.</div>` : tbl(["Audience", "Goal", "Version", "Built", "Refreshed", "Total", "Consented", "Usable", "", ""], list.map((a) => {
          const g = GOALS[a.goal] ? GOALS[a.goal].label : a.goal;
          return [b(esc(a.name)), pill(g, "gray"), "v" + a.version, a.builtAt, a.refreshedAt, a.total, a.consented, `<b style="color:var(--green)">${a.usable}</b>`,
            `<button class="eat-secbtn" data-cd="audOpen" data-v="${a.id}">${ic("eye", 12)} Open</button>`,
            `<button class="eat-secbtn" data-cd="audRefresh" data-v="${a.id}">${ic("refresh-cw", 12)} Refresh</button>`];
        }))}
        <div class="flex items-center gap-2 flex-wrap" style="margin-top:10px">
          <button class="btn btn-o" data-cd="nav" data-v="segments">${ic("filter", 14)} From a segment</button>
          <button class="btn btn-o" data-cd="nav" data-v="aibuild">${ic("wand-sparkles", 14)} AI build</button>
        </div>
        <div class="tip info">${ic("shield", 13)} Refresh re-computes the snapshot against the live dataset and bumps the version. Audits keep a history of every version exported.</div>`)}
    ` + (ui.audOpen ? card(`<span class="bd-card-title">${ic("eye", 14)} ${esc(ui.audOpen.name)} — snapshot v${ui.audOpen.version}</span>`, `${num(ui.audOpen.total)} total · ${num(ui.audOpen.consented)} consented · ${num(ui.audOpen.usable)} usable after validation`, `
      ${tbl(["Customer", "City", "Orders", "Revenue", "Consent"], ui.audOpen.members.slice(0, 12).map((id) => { const c = CIdx[id]; const m = M[id]; return [b(esc(c.name)), c.city, m.orderCount, money(m.revenue), consentPill(c.consent)]; }))}
      <div class="flex items-center gap-2 flex-wrap">
        <button class="btn btn-p" data-cd="exportOpen" data-v="${ui.audOpen.id}">${ic("download", 14)} Export to ad platform</button>
        <button class="btn btn-g" data-cd="audClose">${ic("x", 12)} Close</button>
      </div>
    `) : "");
  }

  /* ---------- AI AUDIENCE BUILDER ---------- */
  function vAiBuild() {
    return card(`<span class="bd-card-title">${ic("wand-sparkles", 14)} AI Audience Builder</span>`, "Describe an audience in plain language — the engine maps it to rules on the live dataset", `
      <textarea class="textarea" id="cd-ai-in" rows="3" placeholder="e.g. customers in Algiers who bought the GlowMask and are at risk of churning, consented only"></textarea>
      <div class="flex items-center gap-2 flex-wrap" style="margin-top:8px">
        <button class="btn btn-p" data-cd="aiBuild">${ic("wand-sparkles", 14)} Build audience</button>
        <button class="btn btn-g" data-cd="aiBuildExample">${ic("lightbulb", 14)} Example</button>
      </div>
      <div class="cd-tabs" style="margin-top:10px">
        ${["Win back customers who bought the EmberFlow kettle",
          "At-risk customers in Oran, high value",
          "New buyers last 45 days, consented",
          "Best customers who never bought the GlowMask",
          "Lost customers from Facebook Ads, high returns"].map((q) => `<button class="eat-secbtn" data-cd="aiQuick" data-v="${esc(q)}">${esc(q)}</button>`).join("")}
      </div>
      ${ui.aiBuild ? aiBuildResult() : ""}
      <div class="tip info">${ic("shield", 13)} The builder only ever runs filters over local aggregates — intent is mapped to rules, the size is counted locally, and results are consent-gated before any export.</div>
    `);
  }
  function aiBuildResult() {
    const r = ui.aiBuild;
    const core = r.final;
    return `<div class="out-anim"><div class="out-head">${ic("sparkles", 15)} ${esc(r.name)}</div>
      <div class="ai-run-meta"><span class="pill ${core.usable >= 10 ? "green" : "amber"}"><span class="dot"></span>${core.usable >= 10 ? "HIGH" : "MEDIUM"} confidence</span><span class="pill gray">audience-sim</span><span class="pill gray">consent-gated</span></div>
      <div class="cd-stage">
        <div class="st blu"><b>${num(core.total)}</b><span>Matched</span></div>
        <div class="st grn"><b>${num(core.consented)}</b><span>Consented</span></div>
        <div class="st amber"><b>${num(core.unknown)}</b><span>Unknown</span></div>
        <div class="st red"><b>${num(core.refused)}</b><span>Refused</span></div>
        <div class="st grn"><b>${num(core.usable)}</b><span>Usable</span></div>
      </div>
      <div class="hl">${r.reasoning}</div>
      <div class="hl warn"><b>Intent → rules:</b> ${r.rules.map((x) => esc(x)).join(" · ") || "none"}</div>
      ${tbl(["Customer", "City", "Orders", "Revenue", "Consent"], core.members.slice(0, 6).map((id) => { const c = CIdx[id]; const m = M[id]; return [b(esc(c.name)), c.city, m.orderCount, money(m.revenue), consentPill(c.consent)]; }))}
      <div class="flex items-center gap-2 flex-wrap">
        <button class="btn btn-p" data-cd="aiSave" data-v="${esc(r.name)}">${ic("target", 14)} Save as audience</button>
        <button class="btn btn-o" data-cd="aiExportNow">${ic("download", 14)} Export now</button>
      </div>
      ${confBox(core.usable >= 10 ? "high" : "medium", [["Evidence", "Size computed from the local customer dataset, not a model"], ["Data used", num(S.customers.length) + " customers · rules mapped from intent"], ["Assumptions", "Consent must be 'accepted' to be usable; 'unknown' requires permission"], ["Limitations", "Identifiers are hashed at export; no raw PII in any destination"]])}
    </div>`;
  }

  function parseAiIntent(text) {
    const t = text.toLowerCase();
    const rules = [];
    const reason = [];
    let goal = "repeat";
    let product = "all";
    let city = "All";

    const productMatch = PRODUCTS.find((p) => t.includes(p.name.toLowerCase()) || t.includes(p.name.split(" ")[0].toLowerCase()));
    if (productMatch) { product = productMatch.id; reason.push("product: " + productMatch.name); }

    if (t.includes("algiers")) { city = "Algiers"; reason.push("city: Algiers"); }
    else CITIES.forEach(([c]) => { if (t.includes(c.toLowerCase())) { city = c; reason.push("city: " + c); } });

    if (t.includes("win back") || t.includes("winback") || t.includes("re-activate") || t.includes("reactivate")) { goal = "winback"; rules.push("recency 91–365d"); reason.push("goal: win-back"); }
    else if (t.includes("at risk") || t.includes("churn") || t.includes("going cold")) { goal = "atrisk"; rules.push("recency 61–180d & 2+ orders"); reason.push("goal: at-risk"); }
    else if (t.includes("lost") || t.includes("gone") || t.includes("dormant")) { goal = "lost"; rules.push("recency > 365d"); reason.push("goal: lost reactivation"); }
    else if (t.includes("new") && (t.includes("buy") || t.includes("customer") || t.includes("lead"))) { goal = "new"; rules.push("first order ≤ 45d"); reason.push("goal: new buyers"); }
    else if (t.includes("best") || t.includes("vip") || t.includes("high value") || t.includes("whale")) { goal = "best"; rules.push("quality ≥ 80 & revenue ≥ 15k"); reason.push("goal: best customers"); }
    else if (t.includes("repeat") || t.includes("loyal")) { goal = "repeat"; rules.push("2+ orders"); reason.push("goal: repeat buyers"); }
    else if (t.includes("never") || t.includes("not bought")) { goal = "crosssell"; rules.push("high value non-buyers"); reason.push("goal: cross-sell"); }
    else if (t.includes("buyer") || t.includes("bought")) { goal = "upsell"; rules.push("buyers of product"); reason.push("goal: upsell"); }

    const names = [];
    if (t.includes("high return") || t.includes("returns") || t.includes("cod risk") || t.includes("cancel")) names.push("high return / cancellation risk");
    if (t.includes("facebook")) names.push("Facebook Ads"); if (t.includes("instagram")) names.push("Instagram Ads"); if (t.includes("tiktok")) names.push("TikTok Ads"); if (t.includes("google")) names.push("Google Ads");
    if (names.length) reason.push("risk/source filter: " + names.join(", "));

    return { goal, product, city, reason, names };
  }

  /* ---------- AD AUDIENCES ---------- */
  function vAdAud() {
    const auds = S.audiences || [];
    return card(`<span class="bd-card-title">${ic("megaphone", 14)} Ad Audiences — prepare &amp; export</span>`, "Pick an audience → prepare pipeline → hashed, consent-safe export", `
      <div class="cd-form-grid">
        <select class="select" data-cd="adAudSel">${auds.length ? auds.map((a) => `<option value="${a.id}" ${ui.audSel === a.id ? "selected" : ""}>${esc(a.name)} (${num(a.usable)} usable)</option>`).join("") : `<option value="">No audiences yet</option>`}</select>
        <select class="select" data-cd="adDest">${DESTINATIONS.map((d) => `<option value="${d.id}" ${ui.expDest === d.id ? "selected" : ""}>${d.label}</option>`).join("")}</select>
      </div>
      <div class="flex items-center gap-2 flex-wrap" style="margin-top:10px">
        <button class="btn btn-p" data-cd="prepAud">${ic("workflow", 14)} Prepare audience</button>
        ${auds.length === 0 ? `<button class="btn btn-o" data-cd="nav" data-v="aibuild">${ic("wand-sparkles", 14)} Build one first</button>` : ""}
      </div>
      ${ui.prep ? prepResult() : ""}
      <div class="tip info">${ic("shield", 13)} The preparation pipeline: match → consent gate → dedupe → validate identifiers → hash (simulated SHA-style hash shown below) → size estimate. Refused records are always excluded; unknown records are quarantined until permission is confirmed.</div>
    `);
  }
  function prepResult() {
    const p = ui.prep;
    const a = p.a; const dest = p.dest;
    return `<div class="out-anim"><div class="out-head">${ic("workflow", 15)} Prepared: ${esc(a.name)} → ${esc(dest.label)}</div>
      <div class="cd-stage">
        <div class="st blu"><b>${num(p.total)}</b><span>Matched</span></div>
        <div class="st grn"><b>${num(p.consented)}</b><span>Consented</span></div>
        <div class="st amber"><b>${num(p.unknown)}</b><span>Quarantined</span></div>
        <div class="st red"><b>${num(p.refused)}</b><span>Excluded</span></div>
        <div class="st grn"><b>${num(p.usable)}</b><span>Usable</span></div>
      </div>
      <div class="hl">Est. targeting share: <b>${pct(p.usable / Math.max(1, S.customers.length))}</b> of the full base · ${num(p.usable)} identifiers will be delivered to ${esc(dest.label)}.</div>
      ${tbl([...dest.pii.map((f) => f.toUpperCase()), "EVIDENCE"], p.sample.map((row) => [...dest.pii.map((f) => `<span class="cd-hash">${esc(row[f])}</span>`), ev(dest.id === "mailchimp" || dest.id === "wa" ? "VERIFIED" : "ESTIMATED", "ver")]))}
      <div class="tip info">${ic("lock", 13)} Sample rows show <b>normalized, hashed</b> identifiers (simulated). Real production exports hash server-side with SHA-256 salt. The ${esc(dest.label)} preset maps to its expected file format. Never paste raw phone numbers into ad-manager bulk lists.</div>
      <div class="flex items-center gap-2 flex-wrap">
        <button class="btn btn-p" data-cd="doExport">${ic("download", 14)} Create export (${num(p.usable)} rows)</button>
        <button class="btn btn-g" data-cd="prepClose">${ic("x", 12)} Close</button>
      </div>
    </div>`;
  }

  /* ---------- LOOKALIKE ---------- */
  function vLookalike() {
    const seed = S.customers.slice().sort((a, b) => M[b.id].revenue - M[a.id].revenue)[0];
    const seedM = M[seed.id];
    const ranked = S.customers.map((x) => M[x.id]).filter((x) => x && x.id !== seed.id).map((x) => ({ x, s: simScore(seed, seedM, x) })).filter((r) => r.s >= 4).sort((a, b) => b.s - a.s);
    const lookalikeAud = ranked.slice(0, 40).map((r) => r.x.id);
    const core = finalizeAudience(lookalikeAud);

    return `
      ${card(`<span class="bd-card-title">${ic("copy-check", 14)} Lookalike insights</span>`, "From a high-value seed customer to an expandable audience", `
        <div class="cd-metric-grid">
          ${metric("Seed customer", esc(seed.name), seed.id + " · " + money(seedM.revenue) + " revenue")}
          ${metric("Similarity pool", num(ranked.length), "scored ≥ 4 (shared products, AOV, behavior)")}
          ${metric("Lookalike size", num(core.usable), "usable after consent + validation", "grn")}
        </div>
        ${tbl(["Similar customer", "Score", "Orders", "Revenue", "Shared products"], ranked.slice(0, 10).map((r) => [b(esc(CIdx[r.x.id].name)), r.s, r.x.orderCount, money(r.x.revenue), num(r.x.products.filter((p) => seedM.products.includes(p)).length)]))}
        <div class="flex items-center gap-2 flex-wrap">
          <button class="btn btn-p" data-cd="lookalikeSave">${ic("target", 14)} Save top-40 lookalike audience</button>
          <button class="btn btn-o" data-cd="nav" data-v="adaud">${ic("megaphone", 14)} Prepare for ad export</button>
        </div>
        <div class="tip info">${ic("info", 13)} Similarity is computed locally: shared product purchases (4), AOV closeness (2), order count (1), city (1). It deliberately mirrors how a lookalike model behaves — without sending any customer data to a model.</div>`)}
    `;
  }

  /* ---------- RETENTION ---------- */
  function vRetention() {
    const cohorts = {};
    allMetrics().filter((m) => m.orderCount > 0).forEach((m) => {
      const ck = m.firstOrder.slice(0, 7);
      cohorts[ck] = cohorts[ck] || { n: 0, retained: {} };
      cohorts[ck].n++;
      const m0 = new Date(m.firstOrder);
      [1, 2, 3, 6, 12].forEach((mo) => {
        const cutoff = dstr(addDays(m0, mo * 30));
        if (m.recency <= daysAgo(cutoff) || S.orders.some((o) => o.customerId === m.id && o.date > m.firstOrder && o.date <= cutoff)) cohorts[ck].retained[mo] = (cohorts[ck].retained[mo] || 0) + 1;
      });
    });
    const rows = Object.entries(cohorts).sort().slice(-8);

    const new30 = allMetrics().filter((m) => m.orderCount === 1 && m.recency <= 45);
    const lapsed = allMetrics().filter((m) => m.recency > 365 && m.orderCount >= 1);

    return `
      <div class="g4">
        ${kpi("Repeat buyers", num(allMetrics().filter((m) => m.orderCount >= 2).length), pct(allMetrics().filter((m) => m.orderCount >= 2).length / Math.max(1, allMetrics().filter((m) => m.orderCount > 0).length)), "grn")}
        ${kpi("New (≤45d)", num(new30.length), "nurture for a second order", "blu")}
        ${kpi("Lapsed buyers", num(lapsed.length), "est. " + money(lapsed.reduce((s, m) => s + m.revenue, 0)) + " recoverable", "amber")}
        ${kpi("Champions", num(allMetrics().filter((m) => m.rfmBucket === "Champions").length), "best repeat cohort", "gold")}
      </div>
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("table", 14)} Cohort retention</span>`, "% of each cohort buying again in months 1/2/3/6/12", tbl(["Cohort", "Size", "M1", "M2", "M3", "M6", "M12"], rows.map(([ck, v]) => [b(ck), v.n, ...["1", "2", "3", "6", "12"].map((mo) => v.retained[mo] ? pct(v.retained[mo] / v.n) : "—")])))}
        ${card(`<span class="bd-card-title">${ic("repeat", 14)} Win-back &amp; nurture</span>`, "The two levers that grow LTV", `
          <div class="eat-list">
            ${[["megaphone", "amber", `Win back ${num(lapsed.length)} lapsed buyers`, "Build a win-back audience with a discount + COD assurance"], ["sparkles", "blue", `Nurture ${num(new30.length)} new buyers`, "Second-purchase offer within 30 days"], ["repeat", "green", `Convert ${num(allMetrics().filter((m) => m.orderCount === 2).length)} repeat buyers into regulars`, "Introduce a product bundle or subscription"]].map(([icn, tone, t, d]) => `<div class="eat-li"><span class="li-ic ${tone}">${ic(icn, 14)}</span><div><div class="li-t">${t}</div><div class="li-d">${d}</div></div></div>`).join("")}
          </div>
          <button class="btn btn-o" data-cd="nav" data-v="adaud">${ic("megaphone", 14)} Open Ad Audiences</button>`)}
      </div>
    `;
  }

  /* ---------- REPORTS ---------- */
  function vReports() {
    const tab = ui.tab.reports || "charts";
    const tabs = `<div class="cd-tabs">
      <button class="eat-secbtn ${tab === "charts" ? "active" : ""}" data-cd="repTab" data-v="charts">Charts</button>
      <button class="eat-secbtn ${tab === "gen" ? "active" : ""}" data-cd="repTab" data-v="gen">Report generator</button>
    </div>`;
    if (tab === "gen") return tabs + card(`<span class="bd-card-title">${ic("file-bar-chart", 14)} Report generator</span>`, "Computed from the live dataset — choose a lens", `
      <select class="select" data-cd="repType">${["Business overview", "Source performance", "Product performance", "Segment deep dive", "COD health", "Retention report"].map((x) => `<option>${x}</option>`).join("")}</select>
      <button class="btn btn-p" data-cd="repGen">${ic("file-text", 14)} Generate report</button>
      ${ui.rep ? reportHTML(ui.rep) : ""}
    `);

    const byMonth = months.map((mth) => S.orders.filter((o) => o.date.slice(0, 7) === mth.key).length);
    const byStatus = ["delivered", "confirmed", "pending", "cancelled", "returned"].map((s) => S.orders.filter((o) => o.status === s).length);
    pushChart("repMon", { type: "line", labels: months.map((m) => m.key.slice(5)), datasets: [{ label: "Orders / month", data: byMonth, color: "#3EE8A6", fill: true }] });
    pushChart("repSt", { type: "doughnut", labels: ["delivered", "confirmed", "pending", "cancelled", "returned"], datasets: [{ label: "Orders", data: byStatus, color: "#3EE8A6" }], legend: false });
    return tabs + `<div class="eat-grid">
      ${card(`<span class="bd-card-title">${ic("trending-up", 14)} Orders per month</span>`, "Last 12 months", `<div class="chw-lg"><canvas id="chart-repMon"></canvas></div>`)}
      ${card(`<span class="bd-card-title">${ic("pie-chart", 14)} Order status mix</span>`, "Delivery health", `<div class="chw-lg"><canvas id="chart-repSt"></canvas></div>`)}
    </div>`;
  }

  function reportHTML(r) {
    return `<div class="out-anim" style="margin-top:10px"><div class="out-head">${ic("file-text", 15)} ${esc(r.title)}</div>
      ${r.sections.map((s) => `<div class="hl"><b>${esc(s.title)}</b><br>${s.body}</div>`).join("")}
      <div class="hl warn"><b>Next actions</b><br>${r.actions.map((a) => "→ " + a).join("<br>")}</div>
      ${confBox("high", [["Evidence", "All figures computed locally from customers + orders"], ["Data used", num(S.customers.length) + " customers · " + num(S.orders.length) + " orders"], ["Assumptions", "Profit model uses Settings margin/shipping/refund"], ["Limitations", "No model in the loop — deterministic calculations"]])}
    </div>`;
  }

  function generateReport(type) {
    const ms = allMetrics();
    const total = totRevenue();
    const bySrc = aggTable(S.customers, (c) => c.source, (c) => M[c.id]);
    const prodRows = PRODUCTS.map((p) => { const os = S.orders.filter((o) => o.product === p.id); const rev = os.filter((o) => o.status === "delivered" || o.status === "confirmed").reduce((s, o) => s + o.value, 0); return { p, os: os.length, rev, buyers: new Set(os.map((o) => o.customerId)).size }; }).sort((a, b) => b.rev - a.rev);
    const buckets = allMetrics().reduce((acc, m) => { acc[m.rfmBucket || "Standard"] = (acc[m.rfmBucket || "Standard"] || 0) + 1; return acc; }, {});
    const sections = [];
    const actions = [];
    if (type === "Source performance") {
      const best = bySrc[0];
      sections.push({ title: "Revenue by source", body: bySrc.slice(0, 5).map(([s, v]) => `${s}: ${money(v.revenue)} (${v.count} customers)`).join(" · ") });
      sections.push({ title: "Leader", body: `${best[0]} drives ${money(best[1].revenue)} — ${pct(best[1].revenue / total)} of revenue from ${best[1].count} customers.` });
      actions.push(`Shift 10% of ad budget from the weakest source to ${best[0]}.`);
    } else if (type === "Product performance") {
      sections.push({ title: "Top products", body: prodRows.slice(0, 5).map((r) => `${r.p.name}: ${r.os} orders, ${money(r.rev)}, ${r.buyers} buyers`).join(" · ") });
      sections.push({ title: "Long tail", body: prodRows.slice(-3).map((r) => `${r.p.name} (${r.os} orders)`).join(" · ") });
      actions.push("Bundle the top product with the weakest for cross-sell.");
    } else if (type === "Segment deep dive") {
      const topSeg = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0];
      sections.push({ title: "Biggest segment", body: `${topSeg[0]}: ${topSeg[1]} customers (${pct(topSeg[1] / S.customers.length)}).` });
      sections.push({ title: "Champions", body: `${buckets["Champions"] || 0} Champions · ${buckets["At Risk"] || 0} At Risk · ${buckets["Hibernating"] || 0} Hibernating.` });
      actions.push("Prioritize Champions retention and At-Risk win-back.");
    } else if (type === "COD health") {
      const cod = S.orders.filter((o) => o.payment === "cod");
      const del = cod.filter((o) => o.status === "delivered" || o.status === "confirmed").length;
      const can = cod.filter((o) => o.status === "cancelled").length;
      const ret = cod.filter((o) => o.status === "returned").length;
      sections.push({ title: "Confirmation", body: `${pct(del / Math.max(1, cod.length))} of COD orders confirm and deliver. ${pct(can / Math.max(1, cod.length))} cancel, ${pct(ret / Math.max(1, cod.length))} return.` });
      sections.push({ title: "Lost value", body: `${money(cod.filter((o) => o.status !== "delivered" && o.status !== "confirmed").reduce((s, o) => s + o.value, 0))} of COD value is not realized.` });
      actions.push("Add call-confirmation to sources with cancel rate > 25%.");
    } else if (type === "Retention report") {
      const repeat = ms.filter((m) => m.orderCount >= 2).length;
      sections.push({ title: "Repeat behavior", body: `${pct(repeat / Math.max(1, ms.filter((m) => m.orderCount > 0).length))} of buyers ordered 2+ times.` });
      sections.push({ title: "Lapsed", body: `${ms.filter((m) => m.recency > 365).length} buyers lapsed beyond a year — est. ${money(ms.filter((m) => m.recency > 365).reduce((s, m) => s + m.revenue, 0))} recoverable.` });
      actions.push("Launch a win-back flow for the 91–365d silent pool.");
    } else {
      const best = bySrc[0];
      sections.push({ title: "Summary", body: `${num(S.customers.length)} customers · ${num(S.orders.length)} orders · ${money(total)} realized revenue · AOV ${money(total / Math.max(1, totRealized()))}.` });
      sections.push({ title: "Acquisition", body: `${best[0]} is the top source at ${money(best[1].revenue)}. ${pct(best[1].revenue / total)} of revenue comes from ${pct(best[1].count / S.customers.length)} of customers.` });
      sections.push({ title: "Data health", body: `${num(S.customers.filter((c) => !validPhone(c.phone)).length)} missing phones, ${num(S.customers.filter((c) => c.consent === "unknown").length)} missing consent.` });
      actions.push(`Scale ${best[0]}, fix missing consent before big ad pushes.`);
    }
    return { title: type, sections, actions };
  }

  /* ---------- AI ASSISTANT ---------- */
  function vAssistant() {
    return card(`<span class="bd-card-title">${ic("bot-message-square", 14)} AI Assistant</span>`, "Ask anything about your customer data — answered from aggregates, never raw records", `
      <div class="cd-chat" id="cd-chat">
        ${(ui.aiHist.length ? ui.aiHist : [{ role: "ai", text: "Ask me things like: \"How many customers are at risk?\", \"What's my best source?\", \"Which products have the highest returns?\", \"Build me a win-back audience\", or \"Clean my data\".\n\nI only ever read aggregates computed from your local dataset — raw PII never leaves this device." }]).map((m) => `<div class="cd-chat-bub ${m.role === "me" ? "me" : "ai"}">${esc(m.text)}</div>`).join("")}
      </div>
      <div class="cd-form-grid" style="margin-top:10px">
        <input class="input" id="cd-aiq" placeholder="Ask about your customers…" style="grid-column:1/-1">
      </div>
      <div class="cd-tabs">
        ${["How many customers are at risk?", "What is my best source?", "Which product has the highest return rate?", "Build me a win-back audience", "Clean my data", "What is my total revenue?"].map((q) => `<button class="eat-secbtn" data-cd="aiAsk" data-v="${esc(q)}">${esc(q)}</button>`).join("")}
      </div>
      <div class="tip info">${ic("lock", 13)} The assistant computes answers from aggregated statistics (counts, sums, rates). It is deliberately prevented from receiving raw customer records.</div>
    `);
  }
  function aiAnswer(q) {
    const t = q.toLowerCase();
    const ms = allMetrics();
    const n = S.customers.length;
    const total = totRevenue();
    if (/how many.*customer/.test(t)) return `${num(n)} total customers · ${num(ms.filter((m) => m.orderCount > 0).length)} with orders · ${num(ms.filter((m) => m.orderCount === 0).length)} leads only.`;
    if (/at risk|churn|win.?back|silent/.test(t)) { const atr = ms.filter((m) => m.recency >= 91 && m.recency <= 365); const lapsed = ms.filter((m) => m.recency > 365); return `${num(atr.length)} customers are at risk (91–365 days silent) — est. ${money(atr.reduce((s, m) => s + m.revenue, 0))} of realized value. Another ${num(lapsed.length)} are lost beyond 365 days (${money(lapsed.reduce((s, m) => s + m.revenue, 0))}). I recommend a win-back audience + a COD-assured offer.`; }
    if (/best source|source/.test(t)) { const bySrc = aggTable(S.customers, (c) => c.source, (c) => M[c.id]); const b = bySrc[0]; return `${b[0]} is your best source: ${num(b[1].count)} customers, ${money(b[1].revenue)} revenue (${pct(b[1].revenue / total)} of base). Weakest of the top-8 is ${bySrc[bySrc.length - 1][0]} (${money(bySrc[bySrc.length - 1][1].revenue)}).`; }
    if (/product|return|refund/.test(t)) { const rows = PRODUCTS.map((p) => { const os = S.orders.filter((o) => o.product === p.id); return { p, rr: os.length ? os.filter((o) => o.status === "returned").length / os.length * 100 : 0, cr: os.length ? os.filter((o) => o.status === "cancelled").length / os.length * 100 : 0, n: os.length }; }).sort((a, b) => b.rr - a.rr); const w = rows[0]; return `${w.p.name} has the highest return rate at ${pct(w.rr / 100)} (${w.n} orders). Cancellation leader: ${rows.sort((a, b) => b.cr - a.cr)[0].p.name} at ${pct(rows.sort((a, b) => b.cr - a.cr)[0].cr / 100)}.`; }
    if (/clean|health|quality/.test(t)) { return `Data health: ${pct(1 - S.customers.filter((c) => !validPhone(c.phone)).length / n)} valid phones, ${num(S.customers.filter((c) => c.email && !validEmail(c.email)).length)} invalid emails, ${num(S.customers.filter((c) => c.consent === "unknown").length)} unknown consent, and ${num(findDupGroups().length)} duplicate clusters. Average quality ${num(ms.reduce((s, m) => s + m.quality, 0) / ms.length, 0)}/100. Auto-normalizing phones is safe — run it in Data Health.`; }
    if (/revenue|sales|income/.test(t)) return `Realized revenue: ${money(total)} from ${num(totRealized())} orders. AOV ${money(total / Math.max(1, totRealized()))}. Delivered ${num(S.orders.filter((o) => o.status === "delivered").length)} of ${num(S.orders.length)} orders.`;
    if (/audience|build|target/.test(t)) { const r = buildFromAi(t); ui.aiBuild = r; render(); return null; }
    if (/repeat|loyal|champion/.test(t)) return `${num(ms.filter((m) => m.orderCount >= 2).length)} customers (${pct(ms.filter((m) => m.orderCount >= 2).length / n)}) are repeat buyers. ${num(ms.filter((m) => m.rfmBucket === "Champions").length)} are Champions.`;
    if (/cod/.test(t)) { const cod = S.orders.filter((o) => o.payment === "cod"); const d = cod.filter((o) => o.status === "delivered" || o.status === "confirmed").length; return `COD is ${pct(d / Math.max(1, cod.length))} of ${num(cod.length)} orders delivered/confirmed. ${money(cod.filter((o) => o.status !== "delivered" && o.status !== "confirmed").reduce((s, o) => s + o.value, 0))} of COD value is unrealized.`; }
    if (/revenue by|city/.test(t)) { const by = {}; ms.forEach((m) => { by[CIdx[m.id].city] = (by[CIdx[m.id].city] || 0) + m.revenue; }); const top = Object.entries(by).sort((a, b) => b[1] - a[1])[0]; return `Top city: ${top[0]} at ${money(top[1])}.`; }
    return `I understood "…". For the demo I can answer about: at-risk customers, best sources, product returns, revenue, COD health, data quality, repeat buyers and audience building. Try one of the suggested questions.`;
  }
  function buildFromAi(t) {
    const parsed = parseAiIntent(t);
    const core = buildAudienceCore(parsed.product, parsed.goal, parsed.city);
    const name = parsed.reason.length ? "AI audience: " + parsed.reason.join(" + ") : "AI audience";
    const r = { name, final: core, reasoning: "Matched " + num(core.total) + " customers from intent, then applied the consent gate (usable = consented + valid identifiers) — " + num(core.usable) + " ready for export.", rules: parsed.reason, goal: parsed.goal, product: parsed.product, city: parsed.city };
    return r;
  }

  /* ---------- PRIVACY ---------- */
  function vPrivacy() {
    const bySource = {};
    S.customers.forEach((c) => { bySource[c.source] = bySource[c.source] || { a: 0, r: 0, u: 0 }; bySource[c.source][c.consent[0]]++; });
    return `
      <div class="g4">
        ${kpi("Consented", num(S.customers.filter((c) => c.consent === "accepted").length), "eligible for ad export", "grn")}
        ${kpi("Refused", num(S.customers.filter((c) => c.consent === "refused").length), "never exported", "red")}
        ${kpi("Unknown", num(S.customers.filter((c) => c.consent === "unknown").length), "quarantined", "amber")}
        ${kpi("Retention", S.settings.retentionDays + "d", "inactive records auto-purged", "blu")}
      </div>
      <div class="eat-grid">
        ${card(`<span class="bd-card-title">${ic("shield", 14)} Consent by source</span>`, "Permission status per channel", tbl(["Source", "Accepted", "Refused", "Unknown"], SOURCES.map((s) => [b(s), bySource[s] ? bySource[s].a : 0, bySource[s] ? bySource[s].r : 0, bySource[s] ? bySource[s].u : 0])))}
        ${card(`<span class="bd-card-title">${ic("database", 14)} PII &amp; data model</span>`, "What we store and where it goes", `
          <div class="eat-list">
            ${[["lock", "green", "PII stays in this browser (localStorage)", "No server sync · no model access to records"], ["shield-alert", "amber", "Ad exports are consent-gated + hashed", "Refused records are always excluded"], ["trash-2", "red", "Deletion is explicit and audited", "Per-record delete or full purge below"]].map(([icn, tone, t, d]) => `<div class="eat-li"><span class="li-ic ${tone}">${ic(icn, 14)}</span><div><div class="li-t">${t}</div><div class="li-d">${d}</div></div></div>`).join("")}
          </div>
          <div class="tip info">${ic("info", 13)} "Unknown" consent records are quarantined: usable for internal analytics, excluded from every ad/CRM export until permission is confirmed.</div>`)}
      </div>
      ${card(`<span class="bd-card-title">${ic("user-minus", 14)} Data subject actions</span>`, "Export or delete an individual record (GDPR-style)", `
        <div class="cd-form-grid">
          <input class="input" id="cd-pii-id" placeholder="Customer ID (e.g. C0001)…">
          <input class="input" id="cd-pii-phone" placeholder="…or phone">
        </div>
        <div class="flex items-center gap-2 flex-wrap" style="margin-top:8px">
          <button class="btn btn-o" data-cd="privacyExport">${ic("download", 14)} Export this person's data</button>
          <button class="btn btn-g" data-cd="privacyDelete">${ic("trash-2", 14)} Delete this person (GDPR)</button>
          <button class="btn btn-g" data-cd="privacyPurge">${ic("trash-2", 14)} Purge refused + dormant records</button>
        </div>
        <div class="tip warn">${ic("alert-triangle", 13)} Deletion is permanent and logged to History. Purging removes all refused records older than the retention window.</div>`)}
    `;
  }

  /* ---------- EXPORT CENTER ---------- */
  function vExports() {
    const list = S.exports || [];
    return `
      ${card(`<span class="bd-card-title">${ic("download", 14)} Export Center</span>`, "Consent-safe, hashed exports — every delivery is logged", `
        ${list.length === 0 ? `<div class="tip info">No exports yet. Build an audience, prepare it in Ad Audiences, then export.</div>` : tbl(["Export", "Audience", "Destination", "Rows", "Date", "Status", ""], list.map((e) => [b(esc(e.name)), e.audienceId, esc(e.destLabel), num(e.count), e.createdAt, pill(e.status, "green"), `<button class="eat-secbtn" data-cd="dlExport" data-v="${e.id}">${ic("download", 12)} Download CSV</button>`]))}
        <div class="tip info">${ic("lock", 13)} Downloaded files contain normalized + hashed identifiers (simulated SHA-style). In production the hash step runs server-side so raw PII is never exposed.</div>`)}
    `;
  }

  /* ---------- HISTORY ---------- */
  function vHistory() {
    return `
      ${card(`<span class="bd-card-title">${ic("history", 14)} Audit log</span>`, "Every data action, chronologically", `
        ${tbl(["When", "Action", "Detail"], (S.history || []).slice(0, 40).map((h) => [h.at, b(esc(h.action)), esc(h.detail || "")]))}
      `)}
      ${card(`<span class="bd-card-title">${ic("upload-cloud", 14)} Import history</span>`, "Every ingestion job", `
        ${(S.imports || []).length === 0 ? `<div class="tip info">No imports yet.</div>` : tbl(["File", "Source", "Rows", "New cust.", "New orders", "Duplicates", "Rejected", "Quality", "Status"], S.imports.map((i) => [b(esc(i.file)), i.source, i.rows, i.newCustomers, i.newOrders, i.duplicates, i.rejected, i.quality + "/100", pill(i.status, "green")]))}
      `)}
    `;
  }

  /* ---------- SETTINGS ---------- */
  function vSettings() {
    return `
      ${card(`<span class="bd-card-title">${ic("settings", 14)} Value &amp; retention model</span>`, "These drive every profit / CLV estimate", `
        <div class="cd-form-grid">
          <div><label class="cd-hash">Margin %</label><input class="input" id="cd-set-margin" type="number" value="${S.settings.margin}"></div>
          <div><label class="cd-hash">Shipping / order (DA)</label><input class="input" id="cd-set-shipping" type="number" value="${S.settings.shipping}"></div>
          <div><label class="cd-hash">Refund rate %</label><input class="input" id="cd-set-refund" type="number" value="${S.settings.refundRate}"></div>
          <div><label class="cd-hash">Retention window (days)</label><input class="input" id="cd-set-retention" type="number" value="${S.settings.retentionDays}"></div>
        </div>
        <button class="btn btn-p" data-cd="saveSettings">${ic("save", 14)} Save &amp; recompute</button>
        <div class="tip info">Changing margin/shipping/refund re-runs the value + profit model across the whole base.</div>`)}
      ${card(`<span class="bd-card-title">${ic("bot", 14)} AI providers</span>`, "No keys are stored in the frontend", `
        <div class="cd-metric-grid">
          ${metric("Provider", "local-sim", "deterministic demo engine", "blu")}
          ${metric("Raw PII → model", "NEVER", "aggregates only", "grn")}
          ${metric("Hash step", "client-side", "simulated; SHA-256 in production", "amber")}
        </div>`)}
      ${card(`<span class="bd-card-title">${ic("refresh-cw", 14)} Demo controls</span>`, "", `
        <button class="btn btn-g" data-cd="resetDemo">${ic("refresh-cw", 14)} Reset to seed dataset</button>
        <div class="tip warn">Resetting wipes imported data, audiences, exports and history, and restores the 360-customer demo base.</div>`)}
    `;
  }

  /* ================= ACTIONS ================= */
  function handle(e) {
    const navBtn = e.target.closest("[data-nav]");
    if (navBtn) { navigate(navBtn.dataset.nav); return; }
    const el = e.target.closest("[data-cd]");
    if (!el) return;
    const act = el.dataset.cd;
    const v = el.dataset.v;

    switch (act) {
      case "nav": navigate(v); return;
      case "openProf": ui.profileId = v; navigate("profiles"); return;
      case "profSel": ui.profileId = v; render(); return;
      case "cusQ": ui.cusQ = el.value; render(); return;
      case "cusSrc": ui.cusSource = el.value; render(); return;
      case "cusCity": ui.cusCity = el.value; render(); return;
      case "cusConsent": ui.cusConsent = el.value; render(); return;
      case "cusRfm": ui.cusRfm = el.value; render(); return;
      case "ordQ": ui.ordQ = el.value; render(); return;
      case "ordStatus": ui.ordStatus = el.value; render(); return;
      case "ordSource": ui.ordSource = el.value; render(); return;
      case "prodAud": { const r = buildFromAi("buyers of " + PNAME(v) + (el.dataset.g === "crosssell" ? " who never bought it, high value" : "")); r.goal = el.dataset.g; r.product = v; ui.aiBuild = r; toast("Audience computed — review then save", "target"); navigate("aibuild"); return; }
      case "ruleAdd": ui.segRules.push({ f: "revenue", op: "gte", v: "10000", logic: "and" }); render(); return;
      case "ruleDel": ui.segRules.splice(parseInt(el.dataset.i, 10), 1); render(); return;
      case "ruleLogic": ui.segRules[parseInt(el.dataset.i, 10)].logic = el.value; render(); return;
      case "ruleField": { ui.segRules[parseInt(el.dataset.i, 10)].f = el.value; const fm = fieldMeta(el.value); ui.segRules[parseInt(el.dataset.i, 10)].op = fm.op[0]; ui.segRules[parseInt(el.dataset.i, 10)].v = fm.vals ? fm.vals[0] : ""; render(); return; }
      case "ruleOp": ui.segRules[parseInt(el.dataset.i, 10)].op = el.value; render(); return;
      case "ruleVal": ui.segRules[parseInt(el.dataset.i, 10)].v = el.value; render(); return;
      case "segTab": ui.tab.segments = v; ui.segMembers = null; render(); return;
      case "segSave": {
        const name = ($("cd-segName") || {}).value || "Untitled segment";
        const sg = { id: "SG" + String((S.segments || []).length + 1).padStart(3, "0"), name, color: "#3EE8A6", rules: ui.segRules.slice(), savedAt: dstr(NOW) };
        S.segments = S.segments || []; S.segments.unshift(sg); log("Segment saved", name, "green"); persist(); ui.tab.segments = "saved"; toast("Segment saved", "check-circle"); render(); return;
      }
      case "segDelete": S.segments = S.segments.filter((s) => s.id !== v); log("Segment deleted", v, "red"); persist(); render(); return;
      case "segPreview": ui.segMembers = segmentById(v); render(); return;
      case "segClear": ui.segMembers = null; render(); return;
      case "audFromSeg": {
        const sg = segmentById(v);
        const members = evalSegment(sg.rules);
        const core = finalizeAudience(members.map((id) => id));
        const a = { id: "AUD" + String((S.audiences || []).length + 1).padStart(3, "0"), name: sg.name, product: "all", goal: "segment", city: "All", builtAt: dstr(NOW), version: 1, ...core, snapshot: core.members.slice(), refreshedAt: dstr(NOW) };
        S.audiences = S.audiences || []; S.audiences.unshift(a); log("Audience built", sg.name, "green"); persist(); toast("Audience built from segment", "target"); navigate("audiences"); return;
      }
      case "intelTab": ui.tab.intelligence = v; render(); return;
      case "aiQuick": case "aiBuildExample": { const q = v || "win back customers who bought the EmberFlow kettle, consented"; ($("cd-ai-in") || {}).value = q; toast("Example loaded — press Build audience", "lightbulb"); return; }
      case "aiBuild": {
        const text = ($("cd-ai-in") || {}).value || "";
        const parsed = parseAiIntent(text);
        if (!text) { toast("Describe an audience first", "info"); return; }
        ui.aiBuild = buildFromAi(text);
        toast("Audience computed — " + ui.aiBuild.final.usable + " usable", "target");
        persist();
        render(); return;
      }
      case "aiSave": {
        const r = ui.aiBuild;
        makeAudience(r.name, r.product || "all", r.goal || "repeat", r.city || "All");
        toast("Audience saved", "check-circle"); ui.aiBuild = null; navigate("audiences"); return;
      }
      case "aiExportNow": { if (!ui.aiBuild) return; const a = makeAudience(ui.aiBuild.name, ui.aiBuild.product || "all", ui.aiBuild.goal || "repeat", ui.aiBuild.city || "All"); const dest = DESTINATIONS[0].id; makeExport(a, dest); ui.prep = null; ui.audSel = a.id; navigate("exports"); toast("Export created", "download"); return; }
      case "adAudSel": ui.audSel = v; render(); return;
      case "adDest": ui.expDest = v; render(); return;
      case "prepAud": {
        const a = (S.audiences || []).find((x) => x.id === (ui.audSel || (S.audiences[0] && S.audiences[0].id)));
        if (!a) { toast("No audience to prepare", "info"); return; }
        const dest = DESTINATIONS.find((d) => d.id === ui.expDest) || DESTINATIONS[0];
        const core = finalizeAudience(a.members);
        const sample = core.usableMembers.slice(0, 4).map((id) => { const c = CIdx[id]; const row = {}; dest.pii.forEach((f) => { row[f] = f === "name" ? c.name : f === "city" ? c.city : hash(normPhone(c.phone) + normEmail(c.email)); }); return row; });
        ui.prep = { a, dest, ...core, sample };
        toast("Audience prepared — " + core.usable + " usable", "workflow");
        render(); return;
      }
      case "doExport": {
        if (!ui.prep) return;
        const e = makeExport(ui.prep.a, ui.prep.dest.id);
        ui.prep = null; toast("Export created: " + e.id, "download"); render(); return;
      }
      case "prepClose": ui.prep = null; render(); return;
      case "audOpen": ui.audOpen = (S.audiences || []).find((x) => x.id === v); render(); return;
      case "audClose": ui.audOpen = null; render(); return;
      case "audRefresh": { const a = (S.audiences || []).find((x) => x.id === v); if (a) refreshAudience(a); toast("Audience refreshed → v" + a.version, "refresh-cw"); render(); return; }
      case "exportOpen": { const a = (S.audiences || []).find((x) => x.id === v); if (a) { ui.audSel = a.id; navigate("adaud"); } return; }
      case "dlExport": {
        const e = (S.exports || []).find((x) => x.id === v);
        if (!e) return;
        const dest = DESTINATIONS.find((d) => d.id === e.dest) || DESTINATIONS[0];
        const a = (S.audiences || []).find((x) => x.id === e.audienceId);
        const members = a ? a.usableMembers : [];
        const header = dest.pii;
        const lines = members.map((id) => { const c = CIdx[id]; return dest.pii.map((f) => f === "name" ? `"${c.name}"` : f === "city" ? c.city : hash(normPhone(c.phone) + normEmail(c.email))).join(","); });
        const csv = [header.join(",")].concat(lines).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a2 = document.createElement("a");
        a2.href = url; a2.download = e.name.replace(/[^\w-]+/g, "-") + "-" + e.id + ".csv"; a2.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        toast("Downloaded " + num(e.count) + "-row hashed CSV", "download");
        return;
      }
      case "lookalikeSave": {
        const seed = S.customers.slice().sort((a, b) => M[b.id].revenue - M[a.id].revenue)[0];
        const seedM = M[seed.id];
        const ranked = S.customers.map((x) => M[x.id]).filter((x) => x && x.id !== seed.id).map((x) => ({ x, s: simScore(seed, seedM, x) })).filter((r) => r.s >= 4).sort((a, b) => b.s - a.s).slice(0, 40);
        const core = finalizeAudience(ranked.map((r) => r.x.id));
        const a = { id: "AUD" + String((S.audiences || []).length + 1).padStart(3, "0"), name: "Lookalike of " + seed.name, product: "all", goal: "lookalike", city: "All", builtAt: dstr(NOW), version: 1, ...core, snapshot: core.members.slice(), refreshedAt: dstr(NOW) };
        S.audiences = S.audiences || []; S.audiences.unshift(a); log("Audience built", a.name, "green"); persist(); toast("Lookalike audience saved (" + core.usable + " usable)", "target"); navigate("audiences"); return;
      }
      case "aiAsk": {
        const q = v || ($("cd-aiq") || {}).value || "";
        if (!q) return;
        ui.aiHist = ui.aiHist.concat([{ role: "me", text: q }]);
        const ans = aiAnswer(q);
        ui.aiHist = ui.aiHist.concat([{ role: "ai", text: ans || "Audience built below." }]);
        if (ui.aiBuild) { navigate("aibuild"); } else { render(); }
        return;
      }
      case "syncSrc": toast("Synced " + v + " — simulated pull", "refresh-cw"); return;
      case "fixPhones": {
        let n = 0;
        S.customers.forEach((c) => { if (c.phone && !validPhone(c.phone)) { c.phone = normPhone(c.phone); n++; } });
        if (n) { log("Phones normalized", n + " records", "green"); computeMetrics(); persist(); toast(n + " phones normalized", "wand-sparkles"); } else toast("No phones to fix", "info");
        render(); return;
      }
      case "mergeGroup": {
        const keep = CIdx[v];
        const group = findDupGroups().find((g) => g.members.some((m) => m.id === keep.id));
        if (group) mergeGroup(group.members);
        toast("Duplicate group merged into " + keep.name, "merge");
        render(); return;
      }
      case "keepGroup": toast("Kept separate — no changes made", "info"); return;
      case "pickFile": ($("cd-file") || {}).click && $("cd-file").click(); return;
      case "sampleCsv": { ($("cd-paste") || {}).value = sampleCSV(); toast("Demo CSV loaded — scan & preview", "sparkles"); return; }
      case "parseImport": {
        const text = ($("cd-paste") || {}).value || "";
        if (!text.trim()) { toast("Paste data or load the demo CSV first", "info"); return; }
        const rows = parseCSV2(text);
        if (rows.length < 2) { toast("Need a header + at least one data row", "info"); return; }
        ui.importPreview = previewImport(rows);
        ui.importRows = rows;
        ui.importMap = Object.assign({}, ui.importPreview.map);
        toast("Scanned " + (rows.length - 1) + " rows", "scan-line");
        render(); return;
      }
      case "mapCol": { ui.importPreview.map[el.dataset.i] = el.value || null; ui.importMap = ui.importPreview.map; render(); return; }
      case "applyImport": {
        if (!ui.importRows) return;
        const imp = applyImport(ui.importRows, ui.importSource, "pasted-data", ui.importMap);
        ui.importRows = null; ui.importPreview = null;
        toast("Import done: +" + imp.newCustomers + " customers, +" + imp.newOrders + " orders", "check-circle");
        render(); return;
      }
      case "repTab": ui.tab.reports = v; render(); return;
      case "repGen": ui.rep = generateReport(($("repType") || {}).value || "Business overview"); render(); return;
      case "saveSettings": {
        S.settings.margin = Math.max(0, parseFloat(($("cd-set-margin") || {}).value) || 0);
        S.settings.shipping = Math.max(0, parseFloat(($("cd-set-shipping") || {}).value) || 0);
        S.settings.refundRate = Math.max(0, parseFloat(($("cd-set-refund") || {}).value) || 0);
        S.settings.retentionDays = Math.max(1, parseInt(($("cd-set-retention") || {}).value, 10) || 30);
        computeMetrics(); persist(); log("Settings updated", "value model re-run", "green"); toast("Settings saved — value model recomputed", "check-circle"); render(); return;
      }
      case "resetDemo": {
        try { localStorage.removeItem(K); } catch (e) {}
        S = seed(); ui.audOpen = null; ui.prep = null; ui.aiBuild = null; ui.segMembers = null; ui.aiHist = []; ui.importPreview = null; ui.importRows = null; ui.importMap = null; ui.profileId = null;
        computeMetrics(); persist(); toast("Demo dataset restored", "refresh-cw"); navigate("dashboard"); return;
      }
      case "privacyExport": {
        const c = findPerson();
        if (!c) { toast("Customer not found", "info"); return; }
        const m = M[c.id];
        const blob = new Blob([JSON.stringify({ customer: c, metrics: m, orders: S.orders.filter((o) => o.customerId === c.id) }, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = c.id + "-data.json"; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        toast("Exported " + c.id + " — this is exactly what that person could request", "download");
        return;
      }
      case "privacyDelete": {
        const c = findPerson();
        if (!c) { toast("Customer not found", "info"); return; }
        S.orders = S.orders.filter((o) => o.customerId !== c.id);
        S.customers = S.customers.filter((x) => x.id !== c.id);
        delete M[c.id];
        log("Record deleted (GDPR)", c.id + " · " + c.name, "red");
        computeMetrics(); persist(); toast("Deleted " + c.id + " — logged to History", "trash-2"); render(); return;
      }
      case "privacyPurge": {
        const before = S.customers.length;
        const cutoff = dstr(addDays(NOW, -S.settings.retentionDays));
        S.customers = S.customers.filter((c) => !(c.consent === "refused" && daysAgo(c.joined) > S.settings.retentionDays));
        const n = before - S.customers.length;
        log("Privacy purge", n + " refused + dormant records removed (retention " + S.settings.retentionDays + "d)", "red");
        computeMetrics(); persist(); toast("Purged " + n + " records", "trash-2"); render(); return;
      }
      case "expOne": {
        const c = CIdx[v];
        const blob = new Blob([JSON.stringify({ customer: c, metrics: M[c.id], orders: S.orders.filter((o) => o.customerId === c.id) }, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = c.id + "-data.json"; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        toast("Exported " + c.id, "download");
        return;
      }
      case "delOne": {
        const c = CIdx[v];
        S.orders = S.orders.filter((o) => o.customerId !== c.id);
        S.customers = S.customers.filter((x) => x.id !== c.id);
        delete M[c.id];
        log("Record deleted (GDPR)", c.id + " · " + c.name, "red");
        computeMetrics(); persist(); toast("Deleted " + c.id, "trash-2"); navigate("customers"); return;
      }
    }
  }
  function findPerson() {
    const id = ($("cd-pii-id") || {}).value || "";
    const ph = ($("cd-pii-phone") || {}).value || "";
    return S.customers.find((c) => (id && c.id === id.trim().toUpperCase()) || (ph && c.phone === normPhone(ph)));
  }

  /* ---------- file input ---------- */
  function wireFile() {
    const file = $("cd-file");
    if (file) file.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        const text = String(rd.result || "");
        if (text.length > 5000000) { toast("Large file: processing in chunks…", "info"); }
        const rows = parseCSV2(text);
        if (rows.length < 2) { toast("Unreadable CSV", "info"); return; }
        ui.importPreview = previewImport(rows);
        ui.importRows = rows;
        ui.importMap = Object.assign({}, ui.importPreview.map);
        ui.importSource = f.name;
        toast("Scanned " + (rows.length - 1) + " rows from " + f.name, "scan-line");
        render();
      };
      rd.readAsText(f);
      e.target.value = "";
    });
    const drop = $("cd-drop");
    if (drop) {
      ["dragover", "dragenter"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
      ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
      drop.addEventListener("drop", (e) => {
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (!f) return;
        const rd = new FileReader();
        rd.onload = () => { const rows = parseCSV2(String(rd.result || "")); if (rows.length < 2) { toast("Unreadable CSV", "info"); return; } ui.importPreview = previewImport(rows); ui.importRows = rows; ui.importMap = Object.assign({}, ui.importPreview.map); ui.importSource = f.name; toast("Scanned " + (rows.length - 1) + " rows", "scan-line"); render(); };
        rd.readAsText(f);
      });
    }
  }

  /* ================= boot ================= */
  function boot() {
    const st = $("backend-state");
    if (st) st.innerHTML = `<span class="pill green">Local data · ${num(S.customers.length)} customers · ${num(S.orders.length)} orders</span>`;
    computeMetrics();
    if (!load()) { /* seed already applied */ }
    else persist();
    render();
    document.addEventListener("click", handle);
    document.addEventListener("change", handle);
    wireFile();

    window.CD = {
      state: S, metrics: M, CIdx, OIdx,
      nav: (g) => navigate(g),
      persist, computeMetrics, finalizeAudience, makeAudience, refreshAudience, makeExport,
      buildAudienceCore, parseAiIntent, buildFromAi, evalSegment, evalSegmentById, findDupGroups, mergeGroup,
      previewImport, applyImport, sampleCSV, generateReport, aiAnswer,
    };
    toast("CUSTOMER DATA AI ready", "database");
  }
  if (window.PL && PL.on) PL.on(boot); else if (document.readyState === "complete" || document.readyState === "interactive") boot(); else document.addEventListener("DOMContentLoaded", boot);
})();
