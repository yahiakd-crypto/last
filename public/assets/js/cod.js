/* ============================================================
   PUNCHLINE COD — AI COD E-Commerce Operating System (single-page).
   Plain HTML + Tailwind + vanilla JS, orange accent.
   Persists per-store demo data in localStorage; calls the same
   /api/ai backend as the rest of Punchline (demo fallbacks when off).
   Core objective everywhere: PROFITABLE DELIVERED ORDERS.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => Math.round(Number(n || 0)).toLocaleString("en-US");
  const money = (n) => fmt(n) + " " + (store().currency || "DZD");
  const icon = (n, s) => `<i data-lucide="${n}" style="width:${s || 16}px;height:${s || 16}px"></i>`;
  const daysAgo = (iso) => iso ? Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)) : 0;
  const fmtDate = (iso) => { if (!iso) return "—"; const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); };
  const fmtDateTime = (iso) => { if (!iso) return "—"; const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); };

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- stores ---------------- */
  const KEY_STORES = "cod.stores";
  const KEY_CURRENT = "cod.currentStore";
  const DZ_STORE = {
    id: "dz1",
    name: "Algeria COD Store",
    logo: "P",
    country: "DZ",
    currency: "DZD",
    lang: "ar",
    whatsapp: "213550000000",
    createdAt: Date.now(),
  };

  function getStores() {
    try { const s = JSON.parse(localStorage.getItem(KEY_STORES) || "null"); if (Array.isArray(s) && s.length) return s; } catch (e) {}
    return [DZ_STORE];
  }
  function saveStores(list) { localStorage.setItem(KEY_STORES, JSON.stringify(list)); }
  function store() {
    const id = localStorage.getItem(KEY_CURRENT) || DZ_STORE.id;
    return getStores().find((s) => s.id === id) || DZ_STORE;
  }
  function setCurrentStore(id) { localStorage.setItem(KEY_CURRENT, id); }

  /* ---------------- per-store collections ---------------- */
  const colKey = (name) => `cod.${store().id}.${name}`;
  function load(name) {
    try { const v = JSON.parse(localStorage.getItem(colKey(name)) || "null"); if (Array.isArray(v)) return v; } catch (e) {}
    return [];
  }
  function save(name, arr) { localStorage.setItem(colKey(name), JSON.stringify(arr)); }
  function upsert(name, item) {
    const arr = load(name);
    const i = arr.findIndex((x) => x.id === item.id);
    if (i >= 0) arr[i] = item; else arr.unshift(item);
    save(name, arr);
    return item;
  }
  function uid() { return (crypto.randomUUID && crypto.randomUUID()) || "id-" + Date.now() + "-" + Math.floor(Math.random() * 1e6); }

  /* ---------------- statuses ---------------- */
  const ORDER_STATUSES = ["New", "Pending Confirmation", "Confirmed", "Preparing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded"];
  const LEAD_STATUSES = ["New", "Contacted", "Interested", "Order Created", "Confirmed", "Cancelled", "No Answer", "Invalid Number", "Duplicate", "Delivered", "Returned"];
  const SHIP_STATUSES = ["Preparing", "Picked up", "In transit", "Arrived", "Out for delivery", "Delivered", "Failed delivery", "Returned"];
  const RETURN_REASONS = ["Customer refused", "Wrong product", "Damaged", "Late delivery", "Changed mind", "Wrong size", "Other"];

  const pill = {
    blue: "pill blue", sky: "pill sky", indigo: "pill indigo", violet: "pill violet",
    orange: "pill orange", green: "pill green", red: "pill red", amber: "pill amber", gray: "pill gray",
  };
  const orderPill = (s) => pill[
    ["Delivered"].includes(s) ? "green" :
    ["Cancelled"].includes(s) ? "red" :
    ["Returned"].includes(s) ? "orange" :
    ["New"].includes(s) ? "blue" :
    ["Confirmed"].includes(s) ? "green" :
    ["Preparing"].includes(s) ? "sky" :
    ["Shipped"].includes(s) ? "indigo" :
    ["Out for Delivery"].includes(s) ? "violet" :
    ["Refunded"].includes(s) ? "gray" : "amber"];
  const leadPill = (s) => pill[
    ["Delivered", "Confirmed"].includes(s) ? "green" :
    ["Cancelled", "Invalid Number", "Duplicate"].includes(s) ? "red" :
    ["No Answer"].includes(s) ? "amber" :
    ["Order Created"].includes(s) ? "blue" : "gray"];
  const shipPill = (s) => pill[
    ["Delivered"].includes(s) ? "green" :
    ["Returned", "Failed delivery"].includes(s) ? "red" :
    ["Preparing"].includes(s) ? "amber" : "sky"];

  /* ---------------- demo seed ---------------- */
  function ensureSeed() {
    const p = load("products");
    const o = load("orders");
    if (p.length && o.length) return;
    const R = rng(7);
    const day = (n) => new Date(Date.now() - n * 86400000).toISOString();

    const products = [
      { id: "p1", name: "Pro Chef Knife Set", sku: "KNF-100", category: "Kitchen", supplier: "Guangzhou YR", supplierCost: 1200, sellingPrice: 2490, discountPrice: 1990, shippingCost: 450, packagingCost: 120, confirmationCost: 35, returnCost: 250, deliveryCost: 380, stock: 340, sold: 86, returned: 9, delivered: 74, cancelled: 12, images: [], description: "Set of 3 stainless steel kitchen knives.", benefits: ["Ultra-sharp blades", "Ergonomic handles"], features: ["AISI 420 steel", "Non-slip grip"] },
      { id: "p2", name: "LED Face Mask", sku: "SKN-201", category: "Beauty", supplier: "Shenzhen GL", supplierCost: 1850, sellingPrice: 3490, discountPrice: 2990, shippingCost: 500, packagingCost: 150, confirmationCost: 35, returnCost: 280, deliveryCost: 420, stock: 210, sold: 122, returned: 17, delivered: 98, cancelled: 24, images: [], description: "LED light therapy face mask.", benefits: ["Skincare at home", "Visible glow"], features: ["7 light modes", "USB rechargeable"] },
      { id: "p3", name: "Car Seat Organizer", sku: "CAR-302", category: "Automotive", supplier: "Ningbo HQ", supplierCost: 650, sellingPrice: 1490, discountPrice: 1190, shippingCost: 350, packagingCost: 60, confirmationCost: 35, returnCost: 180, deliveryCost: 300, stock: 420, sold: 64, returned: 5, delivered: 55, cancelled: 9, images: [], description: "Multipocket car seat organizer.", benefits: ["Declutter your car", "Fits any seat"], features: ["6 pockets", "Waterproof fabric"] },
      { id: "p4", name: "Wireless Neck Massager", sku: "HEL-403", category: "Health", supplier: "Dongguan MX", supplierCost: 2100, sellingPrice: 3990, discountPrice: 3390, shippingCost: 550, packagingCost: 160, confirmationCost: 35, returnCost: 300, deliveryCost: 460, stock: 150, sold: 141, returned: 22, delivered: 108, cancelled: 31, images: [], description: "Electric neck and shoulder massager.", benefits: ["Relieves tension", "Pulse + heat modes"], features: ["16 intensity levels", "Rechargeable battery"] },
    ];
    save("products", products);

    const ads = [
      { id: "a11", campaignId: "c1", name: "UGC: chef demo", creative: "UGC video", cpc: 48, impressions: 52000, clicks: 720, landingViews: 410 },
      { id: "a12", campaignId: "c1", name: "Hook: broken knife", creative: "Problem video", cpc: 39, impressions: 31000, clicks: 480, landingViews: 260 },
      { id: "a21", campaignId: "c2", name: "Discount angle 40%", creative: "Image + offer", cpc: 44, impressions: 48000, clicks: 610, landingViews: 340 },
      { id: "a22", campaignId: "c2", name: "Before/After face", creative: "Static carousel", cpc: 41, impressions: 27000, clicks: 350, landingViews: 190 },
      { id: "a31", campaignId: "c3", name: "Retarget viewers", creative: "Video retarget", cpc: 36, impressions: 22000, clicks: 300, landingViews: 210 },
      { id: "a32", campaignId: "c3", name: "Car owner pain", creative: "Problem image", cpc: 33, impressions: 33000, clicks: 420, landingViews: 240 },
      { id: "a41", campaignId: "c4", name: "Pain: neck pain", creative: "Problem video", cpc: 52, impressions: 60000, clicks: 890, landingViews: 500 },
      { id: "a42", campaignId: "c4", name: "UGC testimonial", creative: "Testimonial video", cpc: 47, impressions: 36000, clicks: 520, landingViews: 280 },
    ];
    save("ads", ads);

    const campaigns = [
      { id: "c1", name: "UGC — Knife Set", productId: "p1", budget: 8000, status: "Active", target: "All DZ" },
      { id: "c2", name: "Discount 40% — Face Mask", productId: "p2", budget: 6000, status: "Active", target: "F 25-45" },
      { id: "c3", name: "Car Organizer Retarget", productId: "p3", budget: 5000, status: "Paused", target: "Video viewers" },
      { id: "c4", name: "Neck Massager Prospecting", productId: "p4", budget: 9000, status: "Active", target: "All DZ 25-55" },
    ];
    save("campaigns", campaigns);

    const pool = [
      { name: "Amina B.", phone: "0550 12 34 56", wilaya: "Alger", city: "Bab El Oued", address: "Rue Didouche 12" },
      { name: "Mohamed K.", phone: "0661 23 45 67", wilaya: "Oran", city: "Hai Salem", address: "Lot 45, bl 8" },
      { name: "Yacine T.", phone: "0772 34 56 78", wilaya: "Constantine", city: "Didouche Mourad", address: "Cité 20 Août" },
      { name: "Sara L.", phone: "0551 98 76 54", wilaya: "Blida", city: "Beni Mered", address: "Rue des Oliviers" },
      { name: "Karim D.", phone: "0669 87 65 43", wilaya: "Sétif", city: "El Hidhab", address: "Boulevard Ziani" },
      { name: "Lina M.", phone: "0771 23 09 87", wilaya: "Batna", city: "Tazoult", address: "Cité Emir" },
      { name: "Omar S.", phone: "0554 55 66 77", wilaya: "Tlemcen", city: "Chetouane", address: "Route de Maghnia" },
      { name: "Nesrine A.", phone: "0667 78 89 90", wilaya: "Annaba", city: "El Bouni", address: "Zone touristique" },
      { name: "Walid G.", phone: "0775 56 67 78", wilaya: "Bejaia", city: "Amizour", address: "Cité Boukhalfa" },
      { name: "Rania F.", phone: "0552 33 44 55", wilaya: "Alger", city: "Kouba", address: "Rue Mouloud" },
      { name: "Sofiane H.", phone: "0663 44 55 66", wilaya: "Oran", city: "Bir El Djir", address: "Cité 5 Juillet" },
      { name: "Imene R.", phone: "0774 45 56 67", wilaya: "Blida", city: "Boufarik", address: "Avenue de l'Indépendance" },
    ];

    // tuple: [poolIdx, adIdx, orderStatus, leadStatus, daysAgo, qty, adCost]
    const ordTpl = [
      [0, 0, "Delivered", "Delivered", 1, 1, 120],
      [1, 0, "Delivered", "Delivered", 2, 1, 160],
      [2, 0, "Shipped", "Confirmed", 2, 2, 130],
      [3, 0, "Out for Delivery", "Confirmed", 3, 1, 90],
      [4, 1, "Delivered", "Delivered", 3, 1, 110],
      [5, 1, "Confirmed", "Confirmed", 4, 1, 80],
      [6, 2, "Delivered", "Delivered", 1, 1, 140],
      [7, 2, "Preparing", "Order Created", 2, 2, 150],
      [8, 3, "Pending Confirmation", "Order Created", 2, 1, 100],
      [9, 3, "Delivered", "Delivered", 4, 1, 120],
      [10, 4, "Delivered", "Delivered", 3, 1, 95],
      [11, 4, "Cancelled", "Cancelled", 5, 1, 60],
      [0, 5, "Returned", "Returned", 5, 1, 85],
      [1, 6, "Delivered", "Delivered", 1, 2, 180],
      [2, 6, "Shipped", "Confirmed", 3, 1, 145],
      [3, 7, "New", "New", 0, 1, 70],
      [4, 7, "Returned", "Returned", 6, 1, 105],
      [5, 7, "Delivered", "Delivered", 2, 1, 165],
    ];

    const orders = ordTpl.map((t, i) => {
      const c = pool[t[0]];
      const ad = ads[t[1]];
      const prod = products.find((p) => p.id === campaigns.find((c2) => c2.id === ad.campaignId).productId);
      const qty = t[5];
      const price = prod.discountPrice;
      const subtotal = price * qty;
      const shipping = prod.shippingCost;
      const total = subtotal + shipping;
      const o = {
        id: "o" + (i + 1),
        orderNumber: "PL-" + String(10240 + i),
        customer: { name: c.name, phone: c.phone, wilaya: c.wilaya, city: c.city, address: c.address },
        productId: prod.id,
        productName: prod.name,
        qty,
        price,
        shipping,
        total,
        adCost: t[6],
        status: t[2],
        paymentMethod: "COD",
        campaignId: ad.campaignId,
        adId: ad.id,
        landing: "lp-" + ad.id,
        utm: { source: "meta", campaign: ad.campaignId, ad: ad.id },
        createdAt: day(t[4]),
        confirmedAt: t[2] === "New" ? null : day(t[4] - 1),
        shippedAt: ["Shipped", "Out for Delivery", "Delivered"].includes(t[2]) ? day(t[4] - 2) : null,
        deliveredAt: t[2] === "Delivered" ? day(t[4] - 3) : null,
        returnedAt: t[2] === "Returned" ? day(t[4] - 1) : null,
        notes: "",
      };
      o.profit = orderProfit(o);
      o.revenue = o.status === "Delivered" ? o.total : 0;
      return o;
    });
    save("orders", orders);

    const leads = orders.map((o) => ({
      id: "l" + o.id,
      name: o.customer.name,
      phone: o.customer.phone,
      wilaya: o.customer.wilaya,
      city: o.customer.city,
      status: t_leadStatus(o.status),
      source: "Meta Ads",
      campaignId: o.campaignId,
      adId: o.adId,
      productId: o.productId,
      orderId: o.id,
      orderValue: o.total,
      createdAt: o.createdAt,
      agent: ["Samir", "Yasmine", "Karim"][Math.floor(rng(3)() * 3)],
    }));
    save("leads", leads);

    const returns = orders.filter((o) => o.status === "Returned").map((o, i) => ({
      id: "r" + (i + 1),
      orderId: o.id,
      orderNumber: o.orderNumber,
      productId: o.productId,
      productName: o.productName,
      customer: o.customer,
      reason: RETURN_REASONS[i % RETURN_REASONS.length],
      condition: ["Opened", "Sealed", "Used"][i % 3],
      resolution: "Pending",
      refund: o.total * 0.6,
      shippingCost: o.shipping,
      returnShipping: 250,
      campaignId: o.campaignId,
      createdAt: o.returnedAt || day(1),
    }));
    save("returns", returns);

    save("settings", {
      scripts: {
        en: "Hello {name}, this is {store}. We received your COD order {order}. Can we confirm your address in {wilaya}?",
        fr: "Bonjour {name}, ici {store}. Nous avons reçu votre commande {order}. Pouvons-nous confirmer votre adresse à {wilaya} ?",
        ar: "السلام عليكم {name}، هنا {store}. وصلنا طلبك رقم {order}. نأكد العنوان في {wilaya}؟",
        dz: "السلام {name}، هذي {store}. وصلنا طلبك {order}. نتأكدو معاك العنوان في {wilaya}؟",
      },
      providers: [
        { id: "yld", name: "Yalidine", connected: true, apiKey: "••••••", zone: "Algeria" },
        { id: "zr", name: "ZR Express", connected: false, apiKey: "", zone: "Algeria" },
        { id: "may", name: "Maystro", connected: false, apiKey: "", zone: "Algeria" },
      ],
      alertThresholds: { returnRate: 12, confirmRate: 45, stockLow: 20 },
      roles: ["Owner", "Admin", "Manager", "Confirmation Agent", "Warehouse", "Shipping Agent", "Viewer"],
    });

    save("shipments", orders.filter((o) => ["Shipped", "Out for Delivery", "Delivered", "Returned"].includes(o.status)).map((o, i) => ({
      id: "s" + (i + 1),
      orderId: o.id,
      orderNumber: o.orderNumber,
      provider: "yld",
      tracking: "YL-" + String(88000 + i * 7),
      status: o.status === "Delivered" ? "Delivered" : o.status === "Returned" ? "Returned" : o.status === "Out for Delivery" ? "Out for delivery" : "In transit",
      pickupDate: o.shippedAt || day(2),
      cost: o.shipping,
      destination: o.customer.wilaya + " / " + o.customer.city,
    })));
  }

  function t_leadStatus(os) {
    if (os === "Delivered") return "Delivered";
    if (os === "Returned") return "Returned";
    if (os === "Cancelled") return "Cancelled";
    if (os === "New") return "New";
    if (["Pending Confirmation"].includes(os)) return "Contacted";
    return "Confirmed";
  }

  /* ---------------- financials ---------------- */
  function productCosts(pid) {
    const p = load("products").find((x) => x.id === pid) || {};
    return {
      supplier: Number(p.supplierCost) || 0, shipping: Number(p.shippingCost) || 0,
      packaging: Number(p.packagingCost) || 0, confirm: Number(p.confirmationCost) || 0,
      ret: Number(p.returnCost) || 0, price: Number(p.sellingPrice) || 0, discount: Number(p.discountPrice) || Number(p.sellingPrice) || 0,
    };
  }
  function orderProfit(o) {
    const c = productCosts(o.productId);
    const qty = o.qty || 1;
    const total = o.total != null ? o.total : (c.discount * qty + c.shipping);
    let cost = c.supplier * qty + (o.shipping != null ? o.shipping : c.shipping) + c.packaging * qty + c.confirm + (o.adCost || 0);
    if (o.status === "Returned" || o.status === "Refunded") cost += c.ret;
    const revenue = o.status === "Delivered" ? total : 0;
    return Math.round(revenue - cost);
  }
  function refreshOrderFinancials(o) { o.profit = orderProfit(o); o.revenue = o.status === "Delivered" ? o.total : 0; return o; }

  /* ---------------- aggregates ---------------- */
  function agg() {
    const orders = load("orders");
    const leads = load("leads");
    const ads = load("ads");
    const products = load("products");
    const campaigns = load("campaigns");
    const returns = load("returns");
    const shipments = load("shipments");

    const sum = (arr, f) => arr.reduce((a, x) => a + (Number(f(x)) || 0), 0);

    const delivered = orders.filter((o) => o.status === "Delivered");
    const returned = orders.filter((o) => o.status === "Returned");
    const cancelled = orders.filter((o) => o.status === "Cancelled" || o.status === "Refunded");
    const confirmed = orders.filter((o) => !["New", "Cancelled", "Refunded"].includes(o.status));
    const shipped = orders.filter((o) => ["Shipped", "Out for Delivery", "Delivered"].includes(o.status));

    const revenue = sum(delivered, (o) => o.total);
    const netProfit = sum(orders, (o) => o.profit != null ? o.profit : orderProfit(o));

    // campaign / ad attribution
    const adAgg = ads.map((ad) => {
      const spend = Math.round(ad.clicks * ad.cpc);
      const orderList = orders.filter((o) => o.adId === ad.id);
      const leadList = leads.filter((l) => l.adId === ad.id);
      const deliv = orderList.filter((o) => o.status === "Delivered");
      const profit = sum(orderList, (o) => o.profit != null ? o.profit : orderProfit(o));
      return {
        ...ad,
        spend, leads: leadList.length, orders: orderList.length,
        delivered: deliv.length, returned: orderList.filter((o) => o.status === "Returned").length,
        revenue: sum(deliv, (o) => o.total), profit,
        roas: spend ? revenue / spend : 0, profitRoas: spend ? profit / spend : 0,
        ctr: ad.impressions ? (ad.clicks / ad.impressions) * 100 : 0,
        cpc: ad.cpc,
      };
    });
    const campaignAgg = campaigns.map((c) => {
      const ads_ = adAgg.filter((a) => a.campaignId === c.id);
      const orderList = orders.filter((o) => o.campaignId === c.id);
      return {
        ...c,
        ads: ads_,
        spend: sum(ads_, (a) => a.spend),
        impressions: sum(ads_, (a) => a.impressions),
        clicks: sum(ads_, (a) => a.clicks),
        leads: sum(ads_, (a) => a.leads),
        orders: sum(ads_, (a) => a.orders),
        delivered: sum(ads_, (a) => a.delivered),
        returned: sum(ads_, (a) => a.returned),
        revenue: sum(ads_, (a) => a.revenue),
        profit: sum(ads_, (a) => a.profit),
        deliveryRate: sum(ads_, (a) => a.orders) ? (sum(ads_, (a) => a.delivered) / sum(ads_, (a) => a.orders)) * 100 : 0,
      };
    });

    const productAgg = products.map((p) => {
      const orderList = orders.filter((o) => o.productId === p.id);
      const deliv = orderList.filter((o) => o.status === "Delivered");
      const ret = orderList.filter((o) => o.status === "Returned");
      const profit = sum(orderList, (o) => o.profit != null ? o.profit : orderProfit(o));
      const revenue = sum(deliv, (o) => o.total);
      const margin = revenue ? (profit / revenue) * 100 : 0;
      const opp = Math.max(0, Math.min(100, Math.round(
        (orderList.length * 2) + (deliv.length * 2) + (margin / 2) - (ret.length * 3)
      )));
      return {
        ...p,
        orders: orderList.length, delivered: deliv.length, returned: ret.length,
        revenue, profit, margin, returnRate: orderList.length ? (ret.length / orderList.length) * 100 : 0,
        opportunity: opp,
      };
    });

    const wilayaAgg = [...new Set(orders.map((o) => o.customer.wilaya))].map((w) => {
      const oo = orders.filter((o) => o.customer.wilaya === w);
      const de = oo.filter((o) => o.status === "Delivered");
      const re = oo.filter((o) => o.status === "Returned");
      return {
        wilaya: w, sample: oo.length, orders: oo.length,
        confirmed: oo.filter((o) => !["New", "Cancelled", "Refunded"].includes(o.status)).length,
        delivered: de.length, returned: re.length,
        shipping: sum(oo, (o) => o.shipping),
        profit: sum(oo, (o) => o.profit != null ? o.profit : orderProfit(o)),
        returnRate: oo.length ? (re.length / oo.length) * 100 : 0,
        cancelRate: oo.length ? (oo.filter((o) => ["Cancelled", "Refunded"].includes(o.status)).length / oo.length) * 100 : 0,
      };
    }).sort((a, b) => b.profit - a.profit);

    // funnel
    const impressions = sum(adAgg, (a) => a.impressions);
    const clicks = sum(adAgg, (a) => a.clicks);
    const landingViews = sum(adAgg, (a) => a.landingViews);
    const leadCount = leads.length;
    const orderCount = orders.length;
    const confirmedCount = confirmed.length;
    const shippedCount = shipped.length;
    const deliveredCount = delivered.length;
    const funnel = [
      { label: "Impressions", value: impressions },
      { label: "Clicks", value: clicks },
      { label: "Landing page", value: landingViews },
      { label: "Leads", value: leadCount },
      { label: "Orders", value: orderCount },
      { label: "Confirmed", value: confirmedCount },
      { label: "Shipped", value: shippedCount },
      { label: "Delivered", value: deliveredCount },
    ];
    const funnelConv = [];
    for (let i = 1; i < funnel.length; i++) {
      funnelConv.push({ from: funnel[i - 1].label, to: funnel[i].label, rate: funnel[i - 1].value ? (funnel[i].value / funnel[i - 1].value) * 100 : 0 });
    }

    const kpis = {
      revenue, netProfit,
      adSpend: sum(campaignAgg, (c) => c.spend),
      orders: orderCount, confirmed: confirmedCount, delivered: deliveredCount, returned: returned.length,
      confirmationRate: orders.length ? (confirmedCount / orders.length) * 100 : 0,
      deliveryRate: orders.length ? (deliveredCount / orders.length) * 100 : 0,
      returnRate: deliveredCount ? (returned.length / deliveredCount) * 100 : 0,
      cac: deliveredCount ? sum(campaignAgg, (c) => c.spend) / deliveredCount : 0,
      costPerDelivered: deliveredCount ? sum(campaignAgg, (c) => c.spend) / deliveredCount : 0,
      costPerConfirmed: confirmedCount ? sum(campaignAgg, (c) => c.spend) / confirmedCount : 0,
      roas: sum(campaignAgg, (c) => c.spend) ? revenue / sum(campaignAgg, (c) => c.spend) : 0,
      profitRoas: sum(campaignAgg, (c) => c.spend) ? netProfit / sum(campaignAgg, (c) => c.spend) : 0,
      aov: deliveredCount ? revenue / deliveredCount : 0,
      profitPerDelivered: deliveredCount ? netProfit / deliveredCount : 0,
      breakEvenCpa: sum(campaignAgg, (c) => c.spend) ? sum(campaignAgg, (c) => c.spend) : 0,
    };
    kpis.breakEvenCpa = kpis.profitPerDelivered > 0 ? kpis.profitPerDelivered + kpis.costPerDelivered : kpis.costPerDelivered;

    return { orders, leads, ads: adAgg, products: productAgg, campaigns: campaignAgg, returns, shipments, wilaya: wilayaAgg, funnel, funnelConv, kpis };
  }

  /* ---------------- toast ---------------- */
  function toast(msg, kind) {
    let zone = $("#cod-toasts");
    if (!zone) { zone = document.createElement("div"); zone.id = "cod-toasts"; document.body.appendChild(zone); }
    const el = document.createElement("div");
    el.className = "cod-toast " + (kind || "");
    el.textContent = msg;
    zone.appendChild(el);
    setTimeout(() => { el.style.opacity = "0"; el.style.transition = "opacity .3s"; setTimeout(() => el.remove(), 320); }, 2600);
  }

  /* ---------------- modal ---------------- */
  function openModal(html) {
    let m = $("#cod-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "cod-modal";
      document.body.appendChild(m);
      m.addEventListener("click", (e) => { if (e.target === m) closeModal(); });
    }
    m.innerHTML = `<div class="cod-modal-panel">${html}</div>`;
    m.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.lucide) lucide.createIcons();
  }
  function closeModal() {
    const m = $("#cod-modal");
    if (m) m.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ---------------- sections ---------------- */
  const state = { section: "dashboard", qty: 1 };

  function sidebarHTML(active) {
    const groups = [
      { label: "OPERATE", items: ["dashboard", "orders", "confirmation", "shipping", "returns"] },
      { label: "MARKET", items: ["products", "research", "offers", "landing", "creative", "ads"] },
      { label: "GROW", items: ["leads", "customers", "analytics", "profit"] },
      { label: "AI", items: ["advisor"] },
      { label: "SYSTEM", items: ["settings"] },
    ];
    const S = {
      dashboard: ["Dashboard", "layout-dashboard"], orders: ["Orders", "shopping-cart"],
      confirmation: ["Confirmation", "phone-call"], shipping: ["Shipping", "truck"], returns: ["Returns", "rotate-ccw"],
      products: ["Products", "package"], research: ["AI Product Research", "search"], offers: ["Offers", "badge-percent"],
      landing: ["Landing Pages", "monitor"], creative: ["Creative Lab", "palette"], ads: ["Ads Manager", "megaphone"],
      leads: ["Leads", "users"], customers: ["Customers", "contact"], analytics: ["Analytics", "chart-column"],
      profit: ["Profit", "trending-up"], advisor: ["AI Advisor", "sparkles"], settings: ["Settings", "settings"],
    };
    return groups.map((g) => `
      <div class="cod-side-label">${g.label}</div>
      ${g.items.map((id) => `<button class="cod-nav-item${active === id ? " active" : ""}" data-nav="${id}">${icon(S[id][1], 17)}<span>${S[id][0]}</span></button>`).join("")}
    `).join("");
  }

  function topbarHTML() {
    const stores = getStores();
    const s = store();
    return `
      <div class="flex items-center gap-2">
        <button class="cod-hamburger" id="cod-burger">${icon("menu", 19)}</button>
        <div>
          <div class="cod-title">${esc(s.name)}</div>
          <div class="cod-title-sub">AI COD Operating System</div>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-1"></div>
      <select class="cod-select" id="store-switch" title="Switch store">
        ${stores.map((x) => `<option value="${x.id}"${x.id === s.id ? " selected" : ""}>${esc(x.name)} (${x.currency})</option>`).join("")}
      </select>
      <button class="cod-btn outline" id="btn-preview-cod">${icon("eye", 16)} Preview landing</button>
      <a href="erp.html" class="cod-btn primary" title="Open the AI-powered ERP Business Operating System">${icon("layout-dashboard", 16)} ERP OS</a>
      <span class="pill gray" id="cod-backend">Detecting…</span>`;
  }

  function shell() {
    ensureSeed();
    $("#cod-sidebar").innerHTML = sidebarHTML(state.section) + `
      <div class="cod-sidebar-foot">COD OS · v1.0<br>Demo data — reset in Settings</div>`;
    $("#cod-topbar").innerHTML = topbarHTML();
    $("#cod-content").innerHTML = S[state.section]();
    mount(state.section);
    if (window.lucide) lucide.createIcons();
    PL_API.detect().then((on) => {
      const b = $("#cod-backend");
      if (b) { b.textContent = on ? "AI connected" : "AI demo mode"; b.className = on ? "pill green" : "pill amber"; }
    });
    closeDrawer();
  }

  /* ---------------- mount chart registry ---------------- */
  const charts = {};
  function mkChart(id, cfg) {
    const cv = document.getElementById(id);
    if (!cv || typeof Chart === "undefined") return;
    if (charts[id]) { charts[id].destroy(); delete charts[id]; }
    charts[id] = new Chart(cv, cfg);
  }

  /* ---------------- dashboard ---------------- */
  function S_dashboard() {
    const { kpis: k, funnel, funnelConv, campaigns, products } = agg();
    const recs = advisorLocal();
    return `
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <div class="kpi hot"><div class="kpi-lbl">🔥 Net profit</div><div class="kpi-num">${money(k.netProfit)}</div><div class="kpi-lbl">${fmt(k.profitPerDelivered)} per delivered order</div></div>
      <div class="kpi"><div class="kpi-lbl">Revenue</div><div class="kpi-num">${money(k.revenue)}</div><div class="kpi-lbl">${fmt(k.delivered)} delivered orders</div></div>
      <div class="kpi"><div class="kpi-lbl">Ad spend</div><div class="kpi-num">${money(k.adSpend)}</div><div class="kpi-lbl">ROAS ${k.roas.toFixed(2)} · Profit ROAS ${k.profitRoas.toFixed(2)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Delivered orders</div><div class="kpi-num">${fmt(k.delivered)}</div><div class="kpi-lbl">Conf ${k.confirmationRate.toFixed(0)}% · Deliver ${k.deliveryRate.toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-lbl">Profit / delivered</div><div class="kpi-num">${money(k.profitPerDelivered)}</div><div class="kpi-lbl">AOV ${money(k.aov)} · CAC ${money(k.cac)}</div></div>
    </div>

    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("filter", 18)}</span><div><div class="card-title">COD Funnel</div><div class="card-sub">Every stage of the profitable-delivered-order journey</div></div></div>
      <div class="space-y-2">
        ${funnel.map((f, i) => `
          <div class="funnel-row">
            <span class="text-[12px] font-bold text-[#6B6B73]">${f.label}</span>
            <div class="h-[26px] rounded-lg overflow-hidden" style="background:#F1F0EE">
              <div class="funnel-bar" style="width:${Math.max(2, (f.value / funnel[0].value) * 100)}%">${fmt(f.value)}</div>
            </div>
            <span class="text-[12px] font-bold text-right">${funnel[i + 1] ? funnelConv[i].rate.toFixed(0) + "%" : "—"}</span>
          </div>`).join("")}
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("trophy", 18)}</span><div><div class="card-title">Top campaigns</div></div></div>
        <div class="space-y-3">
          ${campaigns.slice(0, 4).map((c) => `
            <button class="w-full text-left" data-action="open-campaign" data-id="${c.id}">
              <div class="flex justify-between items-center gap-2">
                <span class="text-[13px] font-bold truncate">${esc(c.name)}</span>
                <span class="pill ${c.deliveryRate > 60 ? "green" : c.deliveryRate > 40 ? "amber" : "red"}">${c.deliveryRate.toFixed(0)}% deliver</span>
              </div>
              <div class="flex justify-between text-[11.5px] text-[#9A9AA2] mt-1">
                <span>${fmt(c.orders)} orders · ${fmt(c.leads)} leads</span>
                <span class="font-bold ${c.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(c.profit)}</span>
              </div>
            </button>`).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("gift", 18)}</span><div><div class="card-title">Top products</div></div></div>
        <div class="space-y-3">
          ${products.slice(0, 4).map((p) => `
            <div class="flex justify-between items-center gap-2">
              <div class="min-w-0"><div class="text-[13px] font-bold truncate">${esc(p.name)}</div><div class="text-[11.5px] text-[#9A9AA2]">${fmt(p.orders)} orders · ${p.returnRate.toFixed(0)}% returns</div></div>
              <span class="text-[13px] font-black ${p.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(p.profit)}</span>
            </div>`).join("")}
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("sparkles", 18)}</span><div><div class="card-title">AI recommendations</div></div></div>
        <div class="space-y-3">
          ${recs.slice(0, 4).map((r) => `
            <div class="flex gap-2">
              <span class="pill ${r.type === "SCALE" ? "green" : r.type === "REDUCE" ? "red" : r.type === "TEST" ? "blue" : "amber"}">${r.type}</span>
              <div class="text-[12.5px] leading-snug"><b>${esc(r.title)}</b><br><span class="text-[#6B6B73]">${esc(r.detail)}</span></div>
            </div>`).join("")}
        </div>
        <button class="cod-btn ghost w-full mt-3" data-action="go" data-section="advisor">Open AI Advisor →</button>
      </div>
    </div>`;
  }

  /* ---------------- products ---------------- */
  function S_products() {
    const { products } = agg();
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <div class="card-title">Product database</div>
        <div class="card-sub">Every product with its full cost stack and real COD margin</div>
      </div>
      <button class="cod-btn primary" data-action="add-product">${icon("plus", 16)} Add product</button>
    </div>
    <div class="cod-table-wrap mt-3">
      <table class="cod-table">
        <thead><tr><th>Product</th><th>SKU</th><th>Sell</th><th>Cost</th><th>Orders</th><th>Delivered</th><th>Return rate</th><th>Margin</th><th>Profit</th><th>Score</th><th></th></tr></thead>
        <tbody>
          ${products.map((p) => `
          <tr>
            <td><div class="font-bold">${esc(p.name)}</div><div class="text-[11.5px] text-[#9A9AA2]">${esc(p.category)} · ${esc(p.supplier)}</div></td>
            <td>${esc(p.sku)}</td>
            <td class="font-bold">${fmt(p.discountPrice)}</td>
            <td class="text-[#6B6B73]">${fmt(p.supplierCost)}</td>
            <td>${fmt(p.orders)}</td>
            <td>${fmt(p.delivered)}</td>
            <td><span class="pill ${p.returnRate > 15 ? "red" : p.returnRate > 8 ? "amber" : "green"}">${p.returnRate.toFixed(0)}%</span></td>
            <td class="font-bold ${p.margin >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${p.margin.toFixed(0)}%</td>
            <td class="font-black ${p.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(p.profit)}</td>
            <td><span class="risk ${p.opportunity > 66 ? "low" : p.opportunity > 40 ? "medium" : "high"}">${p.opportunity}</span></td>
            <td><button class="cod-chip gray" data-action="open-product" data-id="${p.id}">${icon("arrow-up-right", 14)}</button></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("award", 18)}</span><div><div class="card-title">Product opportunity score</div><div class="card-sub">AI winner detector — demand, delivery, margin, returns</div></div></div>
      <div class="grid md:grid-cols-3 gap-3">
        ${[...products].sort((a, b) => b.opportunity - a.opportunity).slice(0, 3).map((p, i) => `
          <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
            <div class="text-[12px] font-black">${["🥇 Best product", "🥈 Second", "🥉 Third"][i]}</div>
            <div class="font-bold mt-1">${esc(p.name)}</div>
            <div class="text-[11.5px] text-[#9A9AA2]">Opportunity score <b>${p.opportunity}</b>/100 · ${p.delivered} delivered · ${p.margin.toFixed(0)}% margin</div>
            <div class="mt-2 h-2 rounded-full overflow-hidden" style="background:#EDEDF0"><div style="width:${p.opportunity}%;height:100%;background:linear-gradient(90deg,#FF6B1A,#FF9B5E)"></div></div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  function productForm(p) {
    p = p || {};
    const F = (k, lbl, v, ph) => `<div><label class="label">${lbl}</label><input class="cod-input w-full" name="${k}" value="${esc(v != null ? v : "")}" placeholder="${ph || ""}"></div>`;
    return `
    <div class="flex items-center justify-between">
      <div class="card-title">${p.id ? "Edit product" : "New product"}</div>
      <button class="cod-btn ghost" data-action="close-modal">${icon("x", 15)}</button>
    </div>
    <form class="grid grid-cols-2 gap-3 mt-4" id="product-form" data-id="${p.id || ""}">
      ${F("name", "Product name *", p.name, "Pro Chef Knife Set")}
      ${F("sku", "SKU", p.sku, "KNF-100")}
      ${F("category", "Category", p.category, "Kitchen")}
      ${F("supplier", "Supplier", p.supplier, "Guangzhou YR")}
      ${F("supplierCost", "Supplier cost *", p.supplierCost, "1200")}
      ${F("sellingPrice", "Selling price *", p.sellingPrice, "2490")}
      ${F("discountPrice", "Discount / COD price", p.discountPrice, "1990")}
      ${F("shippingCost", "Shipping cost", p.shippingCost, "450")}
      ${F("packagingCost", "Packaging cost", p.packagingCost, "120")}
      ${F("confirmationCost", "COD confirmation cost", p.confirmationCost, "35")}
      ${F("returnCost", "Return cost", p.returnCost, "250")}
      ${F("deliveryCost", "Expected delivery cost", p.deliveryCost, "380")}
      ${F("stock", "Stock", p.stock, "300")}
      <div class="col-span-2"><label class="label">Description</label><textarea class="cod-textarea" name="description">${esc(p.description || "")}</textarea></div>
      <div class="col-span-2 flex justify-end gap-2">
        <button type="button" class="cod-btn ghost" data-action="close-modal">Cancel</button>
        <button type="submit" class="cod-btn primary">${icon("save", 15)} Save product</button>
      </div>
    </form>`;
  }

  function openProductModal(id) {
    const { products } = agg();
    const p = products.find((x) => x.id === id);
    if (!p) return;
    const costs = productCosts(id);
    const grossPerUnit = p.discountPrice - costs.supplier - costs.shipping - costs.packaging - costs.confirm;
    const netPerDelivered = Math.round(p.profit / Math.max(1, p.delivered));
    openModal(`
      <div class="flex items-center justify-between">
        <div class="card-title text-[17px]">${esc(p.name)}</div>
        <button class="cod-btn ghost" data-action="close-modal">${icon("x", 15)}</button>
      </div>
      <div class="grid sm:grid-cols-2 gap-3 mt-4">
        <div class="kpi"><div class="kpi-lbl">Revenue</div><div class="kpi-num text-[22px]">${money(p.revenue)}</div></div>
        <div class="kpi hot"><div class="kpi-lbl">Profit</div><div class="kpi-num text-[22px]">${money(p.profit)}</div><div class="kpi-lbl">${money(netPerDelivered)} / delivered</div></div>
        <div class="kpi"><div class="kpi-lbl">Orders · Delivered · Returned</div><div class="kpi-num text-[22px]">${p.orders} · ${p.delivered} · ${p.returned}</div></div>
        <div class="kpi"><div class="kpi-lbl">Return rate · Margin</div><div class="kpi-num text-[22px]">${p.returnRate.toFixed(0)}% · ${p.margin.toFixed(0)}%</div></div>
      </div>
      <div class="mt-4 text-[13px]">
        <div class="font-bold mb-2">Full cost stack per unit</div>
        <div class="space-y-1.5">
          <div class="flex justify-between"><span class="text-[#6B6B73]">COD price</span><b>${money(p.discountPrice)}</b></div>
          <div class="flex justify-between"><span class="text-[#6B6B73]">− Supplier cost</span><span class="text-[#C93A3F]">-${money(costs.supplier)}</span></div>
          <div class="flex justify-between"><span class="text-[#6B6B73]">− Shipping</span><span class="text-[#C93A3F]">-${money(costs.shipping)}</span></div>
          <div class="flex justify-between"><span class="text-[#6B6B73]">− Packaging</span><span class="text-[#C93A3F]">-${money(costs.packaging)}</span></div>
          <div class="flex justify-between"><span class="text-[#6B6B73]">− Confirmation cost</span><span class="text-[#C93A3F]">-${money(costs.confirm)}</span></div>
          <div class="flex justify-between pt-2 border-t" style="border-color:var(--line)"><span class="font-bold">Gross profit / unit</span><b class="text-[#0FA05A]">${money(grossPerUnit)}</b></div>
          <div class="flex justify-between"><span class="text-[#6B6B73]">− Return cost (on returns)</span><span class="text-[#C93A3F]">-${money(costs.ret)}</span></div>
        </div>
      </div>
      <div class="flex gap-2 mt-5">
        <button class="cod-btn outline flex-1" data-action="offers-for" data-id="${id}">${icon("badge-percent", 15)} Build offers</button>
        <button class="cod-btn primary flex-1" data-action="edit-product" data-id="${id}">${icon("edit-3", 15)} Edit</button>
      </div>`);
  }

  /* ---------------- research ---------------- */
  function S_research() {
    return `
    <div class="card">
      <div class="card-head"><span class="icon-tile green-soft">${icon("search", 18)}</span><div><div class="card-title">AI Product Research</div><div class="card-sub">Paste a URL, description, or upload images/PDF — AI extracts facts, assumptions & recommendations</div></div></div>
      <form id="research-form" class="grid gap-3">
        <div><label class="label">Product URL (Alibaba / AliExpress / supplier page)</label><input class="cod-input w-full" name="url" placeholder="https://…"></div>
        <div><label class="label">Product description (paste)</label><textarea class="cod-textarea" name="desc" placeholder="Paste the product description here…"></textarea></div>
        <div class="flex flex-wrap items-center gap-3">
          <input type="file" class="hidden" id="research-file" multiple accept="image/*,application/pdf,.txt">
          <button type="button" class="cod-btn ghost" data-action="pick-research-file">${icon("upload", 15)} Upload images / PDF</button>
          <span class="text-[12px] text-[#9A9AA2]" id="research-file-label"></span>
          <button type="submit" class="cod-btn primary ml-auto">${icon("sparkles", 15)} Analyze with AI</button>
        </div>
      </form>
      <div id="research-out"></div>
    </div>`;
  }

  async function runResearch(form) {
    const url = new FormData(form).get("url") || "";
    const desc = new FormData(form).get("desc") || "";
    const out = $("#research-out");
    out.innerHTML = `<div class="mt-4 rounded-xl p-4 text-center" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[13px] font-bold">Analyzing…</div><div class="text-[12px] text-[#9A9AA2]">${url ? "Scraping product page" : "Reading description"} + AI analysis</div></div>`;
    const res = await PL_API.ai("extract_product", { url: url || undefined, description: desc || undefined, language: store().lang }, { maxTokens: 3000 });
    let analysis = null;
    if (res.data) analysis = parseJSON(res.data);
    if (!analysis) analysis = demoResearch(url, desc);
    out.innerHTML = researchHTML(analysis, res.simulated || res.meta.status === "demo");
    if (window.lucide) lucide.createIcons();
  }

  function demoResearch(url, desc) {
    const src = url ? "scraped product page" : "product description";
    return {
      product: { name: desc ? desc.split("\n")[0].slice(0, 60) : (url || "Product"), category: "UNKNOWN", price: null },
      facts: [{ k: "Source", v: src, note: "What the AI could verify" }, { k: "Category", v: "UNKNOWN / NEEDS USER INPUT" }],
      assumptions: [{ k: "Target audience", v: "UNKNOWN — infer from product category after real data" }],
      recommendations: [{ k: "Positioning", v: "Start with a problem-focused hook; validate with a test campaign" }],
      usp: "UNKNOWN / NEEDS USER INPUT", audience: "UNKNOWN", pains: ["UNKNOWN"], desires: ["UNKNOWN"], objections: ["Trust: COD buyers need social proof"], triggers: ["UNKNOWN"], competitors: ["UNKNOWN"], pricing: "UNKNOWN",
    };
  }

  function researchHTML(a, demo) {
    const rows = (arr, label) => arr && arr.length ? `
      <div><div class="text-[12px] font-black uppercase tracking-wide text-[#9A9AA2]">${label}</div>
      <div class="mt-1.5 space-y-1.5">${arr.map((x) => `<div class="rounded-lg px-3 py-2 text-[13px]" style="background:#FAFAFA;border:1px solid var(--line)"><b>${esc(x.k || "")}</b> · ${esc(x.v || "")} ${x.note ? `<span class="text-[11.5px] text-[#9A9AA2]">— ${esc(x.note)}</span>` : ""}</div>`).join("")}</div></div>` : "";
    const chips = (arr, lbl) => arr && arr.length ? `<div><div class="text-[12px] font-black uppercase tracking-wide text-[#9A9AA2]">${lbl}</div><div class="flex flex-wrap gap-1.5 mt-1.5">${arr.map((x) => `<span class="pill gray">${esc(x)}</span>`).join("")}</div></div>` : "";
    return `
      <div class="mt-4 space-y-4">
        ${demo ? `<div class="rounded-xl px-4 py-3 text-[12.5px]" style="background:#FFF7EF;border:1px solid #FFE8D9;color:#B98A1F">⚠ Demo analysis — connect an AI key in Settings for a real product deep-dive. Facts marked UNKNOWN need your real input.</div>` : ""}
        <div class="grid sm:grid-cols-2 gap-3">
          ${rows(a.facts, "FACT")}
          ${rows(a.assumptions, "ASSUMPTION")}
          ${rows(a.recommendations, "RECOMMENDATION")}
          <div class="kpi"><div class="kpi-lbl">USP</div><div class="text-[14px] font-bold mt-1">${esc(a.usp || "UNKNOWN")}</div></div>
        </div>
        ${chips(a.pains, "Pain points")}
        ${chips(a.desires, "Desires")}
        ${chips(a.objections, "Objections")}
        ${chips(a.triggers, "Buying triggers")}
        ${chips(a.competitors, "Competitors")}
        <div class="flex justify-end"><button class="cod-btn primary" data-action="add-research-product" data-name="${esc((a.product && a.product.name) || "Researched product")}">${icon("package-plus", 15)} Save as product</button></div>
      </div>`;
  }

  /* ---------------- offers ---------------- */
  function S_offers() {
    const { products } = agg();
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div>
        <div class="card-title">COD Offer Builder</div>
        <div class="card-sub">Six offer templates with real profit math — compare before you launch</div>
      </div>
      <select class="cod-select" id="offer-product">
        ${products.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}
      </select>
    </div>
    <div id="offer-grid" class="mt-3"></div>`;
  }

  function offerMath(p) {
    const c = productCosts(p.id);
    const base = { product: c, sell: c.discount, cost: c.supplier, ship: c.shipping, pack: c.packaging, confirm: c.confirm, ret: c.ret };
    const mk = (name, qty, unitPrice, shipMult, extraDesc) => {
      const subtotal = unitPrice * qty;
      const shipping = shipMult ? c.shipping * shipMult : c.shipping;
      const total = subtotal + shipping;
      const gross = subtotal - (c.supplier * qty) - shipping - (c.packaging * qty) - c.confirm;
      const net = Math.round(gross - gross * 0.06); // expected return + ops
      const margin = total ? (net / total) * 100 : 0;
      return { name, qty, unitPrice, total, net, margin, shipping, desc: extraDesc };
    };
    return [
      mk("A — Standard", 1, c.discount, 1, "Single unit, standard price"),
      mk("B — Discount", 1, Math.round(c.discount * 0.9), 1, "10% off single unit"),
      mk("C — Bundle", 2, c.discount, 1, "2 units, one shipping fee"),
      mk("D — Buy 2 get discount", 2, Math.round(c.discount * 0.85), 1, "2 units, 15% off each"),
      mk("E — Free shipping", 1, c.discount, 0, "Shipping absorbed by margin"),
      mk("F — Premium bundle", 3, Math.round(c.discount * 0.8), 1, "3 units, 20% off each"),
    ];
  }

  function renderOffers() {
    const { products } = agg();
    const pid = $("#offer-product") ? $("#offer-product").value : (products[0] && products[0].id);
    const p = products.find((x) => x.id === pid);
    if (!p) return;
    const offers = offerMath(p);
    $("#offer-grid").innerHTML = `
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        ${offers.map((o) => `
          <div class="rounded-xl p-4" style="background:#fff;border:1px solid var(--line);box-shadow:0 4px 14px rgba(28,28,30,.05)">
            <div class="flex items-center justify-between"><div class="font-extrabold">Offer ${o.name.split(" ")[1]} — ${o.name.split(" ").slice(2).join(" ")}</div><span class="pill ${o.margin > 45 ? "green" : o.margin > 30 ? "amber" : "red"}">${o.margin.toFixed(0)}% margin</span></div>
            <div class="text-[12px] text-[#9A9AA2] mt-1">${o.desc} · ${o.qty} unit${o.qty > 1 ? "s" : ""} · ${o.unitPrice} each</div>
            <div class="mt-3 space-y-1 text-[12.5px]">
              <div class="flex justify-between"><span class="text-[#6B6B73]">Selling price</span><b>${money(o.total)}</b></div>
              <div class="flex justify-between"><span class="text-[#6B6B73]">Shipping</span><span>${o.shipping ? money(o.shipping) : "FREE"}</span></div>
              <div class="flex justify-between pt-1 border-t" style="border-color:var(--line)"><span class="font-bold">Net profit</span><b class="text-[#0FA05A]">${money(o.net)}</b></div>
            </div>
          </div>`).join("")}
      </div>
      <div class="card mt-3"><div class="card-sub">Profit math: (price × qty) − supplier cost − shipping − packaging − COD confirmation cost − 6% expected returns & ops. Edit any cost in Products.</div></div>`;
  }

  /* ---------------- landing ---------------- */
  function S_landing() {
    return `
    <div class="card">
      <div class="card-head"><span class="icon-tile green-soft">${icon("monitor", 18)}</span><div><div class="card-title">COD Landing Page — Strategy & Analyzer</div><div class="card-sub">The proven COD structure, section scoring, and AI analysis of your live page</div></div></div>
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
          <div class="font-bold mb-2">Optimized COD structure</div>
          <div class="space-y-1 text-[12.5px]">${["HOOK", "PROBLEM", "PRODUCT", "BENEFITS", "DEMONSTRATION", "SOCIAL PROOF", "OFFER", "COD FORM", "FAQ", "TRUST"].map((x, i) => `<div class="flex items-center gap-2"><span class="w-5 h-5 rounded-full grid place-items-center text-[10px] font-black" style="background:#FFE8D9;color:#E85D0F">${i + 1}</span>${x}</div>`).join("")}</div>
        </div>
        <form id="landing-form" class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
          <div class="font-bold mb-2">Analyze a live landing page</div>
          <input class="cod-input w-full" name="url" placeholder="https://your-landing-page.com">
          <div class="flex gap-2 mt-3">
            <button type="button" class="cod-btn ghost" data-action="open-live-preview">${icon("eye", 15)} Preview our COD page</button>
            <button type="submit" class="cod-btn primary ml-auto">${icon("sparkles", 15)} Analyze</button>
          </div>
          <div id="landing-out" class="mt-3"></div>
        </form>
      </div>
    </div>`;
  }

  async function runLanding(form) {
    const url = new FormData(form).get("url") || "";
    const out = $("#landing-out");
    out.innerHTML = `<div class="text-[12.5px] font-bold text-[#9A9AA2]">Analyzing…</div>`;
    const res = await PL_API.ai("analyze_landing", { url }, { maxTokens: 2500 });
    const sec = ["HOOK", "PROBLEM", "PRODUCT", "BENEFITS", "DEMONSTRATION", "SOCIAL PROOF", "OFFER", "COD FORM", "FAQ", "TRUST"];
    let scores = null;
    if (res.data) scores = parseJSON(res.data);
    out.innerHTML = `
      ${res.simulated ? `<div class="text-[11.5px]" style="color:#B98A1F">Demo scoring — provide a URL and a configured AI key for a real audit.</div>` : ""}
      <div class="space-y-1.5 mt-2">${sec.map((s) => {
        const sc = scores && scores.sections ? (scores.sections.find((x) => String(x.name).toUpperCase() === s) || { score: 5 }) : { score: Math.round(3 + Math.random() * 6) };
        return `<div class="flex items-center gap-2"><span class="text-[12px] font-bold w-32 truncate">${s}</span><div class="flex-1 h-2 rounded-full overflow-hidden" style="background:#EDEDF0"><div style="width:${sc.score * 10}%;height:100%;background:${sc.score >= 7 ? "#0FA05A" : sc.score >= 5 ? "#F5B301" : "#C93A3F"}"></div></div><span class="text-[11px] font-bold w-6 text-right">${sc.score}/10</span></div>`;
      }).join("")}</div>
      ${scores && scores.recommendations ? `<div class="mt-3 space-y-1">${scores.recommendations.map((r) => `<div class="text-[12px]">• ${esc(r)}</div>`).join("")}</div>` : ""}`;
  }

  /* ---------------- creative ---------------- */
  function S_creative() {
    return `
    <div class="card">
      <div class="card-head"><span class="icon-tile green-soft">${icon("palette", 18)}</span><div><div class="card-title">AI Creative Lab</div><div class="card-sub">Hooks, texts, headlines, UGC scripts and a testing matrix — built for COD buyers</div></div></div>
      <form id="creative-form" class="grid sm:grid-cols-3 gap-3">
        <div><label class="label">Product</label><select class="cod-select w-full" name="product">${load("products").map((p) => `<option>${esc(p.name)}</option>`).join("")}</select></div>
        <div><label class="label">Angle</label><select class="cod-select w-full" name="angle"><option>Problem</option><option>Demonstration</option><option>Testimonial</option><option>Comparison</option><option>Educational</option></select></div>
        <div><label class="label">Persona</label><select class="cod-select w-full" name="persona"><option>Impulse buyer</option><option>Price-sensitive</option><option>High-intent</option><option>Primary</option><option>Secondary</option></select></div>
        <div class="sm:col-span-3 flex justify-end"><button type="submit" class="cod-btn primary">${icon("sparkles", 15)} Generate creatives</button></div>
      </form>
      <div id="creative-out"></div>
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("scan-search", 18)}</span><div><div class="card-title">Creative Analyzer</div><div class="card-sub">Upload an ad — AI decides KEEP / CHANGE / TEST and writes 3 improved versions</div></div></div>
      <div class="flex flex-wrap gap-3 items-center">
        <input type="file" class="hidden" id="creative-file" accept="image/*,video/*">
        <button class="cod-btn ghost" data-action="pick-creative-file">${icon("upload", 15)} Upload image / video</button>
        <button class="cod-btn primary" data-action="run-creative-analyzer">${icon("sparkles", 15)} Analyze creative</button>
      </div>
      <div id="creative-an-out"></div>
    </div>`;
  }

  async function runCreative(form) {
    const data = Object.fromEntries(new FormData(form));
    const out = $("#creative-out");
    out.innerHTML = `<div class="mt-3 text-[12.5px] font-bold text-[#9A9AA2]">Generating creative concepts…</div>`;
    const res = await PL_API.ai("cod_creative", data, {
      maxTokens: 3000,
      prompt: `You are a direct-response creative copywriter for COD (cash-on-delivery) e-commerce. Product: ${data.product}. Angle: ${data.angle}. Persona: ${data.persona}. Return STRICT JSON only (no markdown, no preamble): {"hooks":["3-5 short attention hooks for the first 3 seconds"],"texts":["2-3 primary ad texts, COD-focused, Algeria audience, no invented testimonials"],"headlines":["3-4 headlines"],"scripts":[{"scene":"UGC video script 0-15s: 0-3s hook, 3-10s demonstration, 10-15s offer + COD CTA"}],"matrix":[{"test":"A/B test name","variable":"what changes","expected":"expected result"}]}. Be specific and non-deceptive.`,
    });
    let g = res.data ? parseJSON(res.data) : null;
    if (!g) {
      g = {
        hooks: ["Hook 1 — " + data.product + " (demo)", "Does this sound like you? " + data.product + " (demo)"],
        texts: ["Primary text demo for " + data.product + " — cash on delivery across Algeria."],
        headlines: ["Headline demo: Fix the problem today."],
        scripts: [{ scene: "Demo UGC script — 0-3s hook, 3-10s demo, 10-15s offer + COD CTA" }],
        matrix: [{ test: "Hook A vs Hook B", variable: "First 3 seconds", expected: "Higher confirmation rate" }],
      };
    }
    out.innerHTML = `
      <div class="mt-4 grid sm:grid-cols-2 gap-3">
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">Hooks</div><div class="space-y-1.5 mt-2">${(g.hooks || []).map((h) => `<div class="text-[13px] px-3 py-2 rounded-lg" style="background:#fff;border:1px solid var(--line)">${esc(h)}</div>`).join("")}</div></div>
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">Primary texts</div><div class="space-y-1.5 mt-2">${(g.texts || []).map((h) => `<div class="text-[13px] px-3 py-2 rounded-lg" style="background:#fff;border:1px solid var(--line)">${esc(h)}</div>`).join("")}</div></div>
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">Headlines</div><div class="space-y-1.5 mt-2">${(g.headlines || []).map((h) => `<div class="text-[13px] px-3 py-2 rounded-lg" style="background:#fff;border:1px solid var(--line)">${esc(h)}</div>`).join("")}</div></div>
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">UGC scripts</div><div class="space-y-1.5 mt-2">${(g.scripts || []).map((h) => `<div class="text-[13px] px-3 py-2 rounded-lg" style="background:#fff;border:1px solid var(--line)">${esc(h.scene || h)}</div>`).join("")}</div></div>
      </div>
      <div class="mt-3"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">Testing matrix</div>
        <div class="cod-table-wrap mt-2"><table class="cod-table"><thead><tr><th>Test</th><th>Variable</th><th>Expected result</th></tr></thead><tbody>${(g.matrix || []).map((m) => `<tr><td>${esc(m.test)}</td><td>${esc(m.variable)}</td><td>${esc(m.expected)}</td></tr>`).join("")}</tbody></table></div>
      </div>`;
  }

  /* ---------------- ads ---------------- */
  function S_ads() {
    const { campaigns } = agg();
    const { kpis } = agg();
    return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="kpi hot"><div class="kpi-lbl">🔥 Profit / delivered order</div><div class="kpi-num">${money(kpis.profitPerDelivered)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Total delivered</div><div class="kpi-num">${fmt(kpis.delivered)}</div></div>
      <div class="kpi"><div class="kpi-lbl">ROAS</div><div class="kpi-num">${kpis.roas.toFixed(2)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Profit ROAS</div><div class="kpi-num">${kpis.profitRoas.toFixed(2)}</div></div>
    </div>
    <div class="cod-table-wrap mt-4">
      <table class="cod-table">
        <thead><tr><th>Campaign</th><th>Spend</th><th>Imp</th><th>Clicks</th><th>CTR</th><th>Leads</th><th>Orders</th><th>Delivered</th><th>Revenue</th><th>Profit</th><th>ROAS</th><th>Status</th></tr></thead>
        <tbody>${campaigns.map((c) => `
          <tr class="cursor-pointer" data-action="open-campaign" data-id="${c.id}">
            <td><div class="font-bold">${esc(c.name)}</div><div class="text-[11.5px] text-[#9A9AA2]">${c.target}</div></td>
            <td>${fmt(c.spend)}</td><td>${fmt(c.impressions)}</td><td>${fmt(c.clicks)}</td>
            <td>${c.ctr ? c.ctr.toFixed(2) : "—"}%</td><td>${c.leads}</td><td>${c.orders}</td>
            <td><b>${c.delivered}</b> <span class="text-[11px] text-[#9A9AA2]">${c.deliveryRate.toFixed(0)}%</span></td>
            <td>${fmt(c.revenue)}</td>
            <td class="font-bold ${c.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(c.profit)}</td>
            <td>${c.roas ? c.roas.toFixed(2) : "—"}</td>
            <td><span class="pill ${c.status === "Active" ? "green" : "gray"}">${c.status}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("link-2", 18)}</span><div><div class="card-title">AD → LEAD → ORDER → DELIVERED → PROFIT attribution</div><div class="card-sub">The real COD KPI is a profitable delivered order — not CPL. Open any order to trace it back to the exact ad.</div></div></div>
    </div>`;
  }

  function openCampaignModal(id) {
    const { campaigns, ads } = agg();
    const c = campaigns.find((x) => x.id === id);
    if (!c) return;
    const adList = ads.filter((a) => a.campaignId === id);
    openModal(`
      <div class="flex items-center justify-between">
        <div><div class="card-title text-[17px]">${esc(c.name)}</div><div class="card-sub">${c.target} · ${c.status} · Budget ${money(c.budget)}</div></div>
        <button class="cod-btn ghost" data-action="close-modal">${icon("x", 15)}</button>
      </div>
      <div class="grid grid-cols-3 gap-3 mt-4">
        <div class="kpi"><div class="kpi-lbl">Spend</div><div class="kpi-num text-[20px]">${money(c.spend)}</div></div>
        <div class="kpi hot"><div class="kpi-lbl">Profit</div><div class="kpi-num text-[20px]">${money(c.profit)}</div></div>
        <div class="kpi"><div class="kpi-lbl">Delivered</div><div class="kpi-num text-[20px]">${c.delivered}</div></div>
      </div>
      <div class="mt-4 text-[13px]">
        <div class="font-bold mb-2">Ads in this campaign</div>
        <div class="space-y-2">${adList.map((a) => `
          <div class="rounded-xl p-3" style="background:#FAFAFA;border:1px solid var(--line)">
            <div class="flex justify-between"><b>${esc(a.name)}</b><span class="pill ${a.profit >= 0 ? "green" : "red"}">${money(a.profit)}</span></div>
            <div class="text-[11.5px] text-[#9A9AA2]">${a.creative} · ${fmt(a.clicks)} clicks · ${a.leads} leads · ${a.orders} orders · ${a.delivered} delivered · CTR ${a.ctr.toFixed(2)}%</div>
          </div>`).join("")}</div>
      </div>`);
  }

  /* ---------------- leads ---------------- */
  function S_leads() {
    const { leads } = agg();
    const opts = (sel) => LEAD_STATUSES.map((s) => `<option ${s === sel ? "selected" : ""}>${s}</option>`).join("");
    const filt = (f, label) => `<select class="cod-select" data-filter="${f}"><option value="">${label}: all</option>${unique(leads, f).map((v) => `<option>${esc(v)}</option>`).join("")}</select>`;
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="card-title">Lead CRM</div><div class="card-sub">Every lead, every campaign, every status — with order value</div></div>
      <div class="flex flex-wrap gap-2">${filt("productName", "Product")}${filt("wilaya", "Wilaya")}${filt("source", "Source")}<select class="cod-select" data-filter="status"><option value="">Status: all</option>${LEAD_STATUSES.map((s) => `<option>${s}</option>`).join("")}</select></div>
    </div>
    <div class="cod-table-wrap mt-3">
      <table class="cod-table">
        <thead><tr><th>Lead</th><th>Phone</th><th>Wilaya</th><th>Product</th><th>Campaign</th><th>Status</th><th>Value</th><th>Date</th></tr></thead>
        <tbody id="leads-tbody">
          ${leads.map((l) => `
          <tr class="cursor-pointer" data-action="open-lead" data-id="${l.id}">
            <td class="font-bold">${esc(l.name)}</td><td>${esc(l.phone)}</td><td>${esc(l.wilaya)}</td>
            <td>${esc(l.productName || "")}</td><td class="text-[#6B6B73]">${esc(l.campaignName || "")}</td>
            <td><span class="${leadPill(l.status)}">${l.status}</span></td>
            <td class="font-bold">${l.orderValue ? money(l.orderValue) : "—"}</td><td class="text-[#9A9AA2]">${fmtDate(l.createdAt)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
  }

  function unique(arr, f) { return [...new Set(arr.map((x) => x[f]).filter(Boolean))].sort(); }

  /* ---------------- orders ---------------- */
  function S_orders() {
    const { orders, kpis } = agg();
    const filters = `<select class="cod-select" data-filter="status"><option value="">Status: all</option>${ORDER_STATUSES.map((s) => `<option>${s}</option>`).join("")}</select>
      <select class="cod-select" data-filter="wilaya"><option value="">Wilaya: all</option>${unique(orders, "wilaya").map((v) => `<option>${esc(v)}</option>`).join("")}</select>`;
    return `
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
      <div class="kpi hot"><div class="kpi-lbl">Net profit</div><div class="kpi-num">${money(kpis.netProfit)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Orders</div><div class="kpi-num">${fmt(kpis.orders)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Delivered</div><div class="kpi-num">${fmt(kpis.delivered)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Returned</div><div class="kpi-num">${fmt(kpis.returned)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Confirmation</div><div class="kpi-num">${kpis.confirmationRate.toFixed(0)}%</div></div>
    </div>
    <div class="flex items-center justify-between flex-wrap gap-2 mt-4">
      <div><div class="card-title">Orders</div><div class="card-sub">Full COD lifecycle with ad attribution and per-order profit</div></div>
      <div class="flex flex-wrap gap-2">${filters}<button class="cod-btn ghost" data-action="add-order">${icon("plus", 15)} New order</button></div>
    </div>
    <div class="cod-table-wrap mt-3">
      <table class="cod-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Product</th><th>Qty</th><th>Total</th><th>Profit</th><th>Status</th><th>Wilaya</th><th>Ad</th><th>Date</th></tr></thead>
        <tbody id="orders-tbody">
          ${orders.map((o) => `
          <tr class="cursor-pointer" data-action="open-order" data-id="${o.id}">
            <td class="font-bold text-[#E85D0F]">${esc(o.orderNumber)}</td>
            <td class="font-bold">${esc(o.customer.name)}</td><td>${esc(o.customer.phone)}</td>
            <td>${esc(o.productName)}</td><td>${o.qty}</td>
            <td class="font-bold">${money(o.total)}</td>
            <td class="font-black ${o.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(o.profit)}</td>
            <td><span class="${orderPill(o.status)}">${o.status}</span></td>
            <td>${esc(o.customer.wilaya)}</td>
            <td class="text-[11.5px] text-[#6B6B73]">${esc(adName(o.adId))}</td>
            <td class="text-[#9A9AA2]">${fmtDate(o.createdAt)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
  }

  function adName(adId) {
    const ad = load("ads").find((a) => a.id === adId);
    return ad ? ad.name : "—";
  }

  function orderDetailHTML(o) {
    const c = productCosts(o.productId);
    const cust = o.customer || {};
    const risk = customerRisk(cust.phone);
    const prod = load("products").find((p) => p.id === o.productId);
    return `
    <div class="flex items-center justify-between">
      <div><div class="card-title text-[17px]">Order ${esc(o.orderNumber)}</div><div class="card-sub">${fmtDateTime(o.createdAt)} · ${esc(o.paymentMethod)}</div></div>
      <div class="flex items-center gap-2"><span class="${orderPill(o.status)}">${o.status}</span><button class="cod-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
    </div>
    <div class="grid sm:grid-cols-2 gap-3 mt-4">
      <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
        <div class="text-[11px] font-black uppercase text-[#9A9AA2]">Customer</div>
        <div class="font-bold mt-1">${esc(cust.name)}</div>
        <div class="text-[13px]">${esc(cust.phone)}</div>
        <div class="text-[13px] text-[#6B6B73]">${esc(cust.city)}, ${esc(cust.wilaya)} — ${esc(cust.address)}</div>
        <div class="mt-2"><span class="risk ${risk.level === "LOW" ? "low" : risk.level === "MEDIUM" ? "medium" : "high"}">${risk.level} RISK</span></div>
        ${risk.reasons.length ? `<div class="text-[11.5px] text-[#9A9AA2] mt-1.5">${risk.reasons.map((r) => "• " + esc(r)).join("<br>")}</div>` : ""}
      </div>
      <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
        <div class="text-[11px] font-black uppercase text-[#9A9AA2]">Attribution</div>
        <div class="text-[13px] mt-1">Product: <b>${esc(o.productName)}</b> (${esc(prod ? prod.sku : "")})</div>
        <div class="text-[13px]">Campaign: <b>${esc(campaignName(o.campaignId))}</b></div>
        <div class="text-[13px]">Ad: <b>${esc(adName(o.adId))}</b></div>
        <div class="text-[13px] text-[#6B6B73]">Landing ${esc(o.landing)} · UTM ${esc((o.utm && o.utm.campaign) || "—")}</div>
      </div>
    </div>
    <div class="mt-3 rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
      <div class="text-[11px] font-black uppercase text-[#9A9AA2]">Financials</div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[13px] mt-2">
        <div class="flex justify-between"><span class="text-[#6B6B73]">Subtotal (${o.qty} × ${fmt(o.price)})</span><b>${money(o.price * o.qty)}</b></div>
        <div class="flex justify-between"><span class="text-[#6B6B73]">Shipping</span><b>${money(o.shipping)}</b></div>
        <div class="flex justify-between"><span class="text-[#6B6B73]">− Supplier (${o.qty}×${fmt(c.supplier)})</span><span class="text-[#C93A3F]">-${money(c.supplier * o.qty)}</span></div>
        <div class="flex justify-between"><span class="text-[#6B6B73]">− Packaging + confirm</span><span class="text-[#C93A3F]">-${money(c.packaging * o.qty + c.confirm)}</span></div>
        <div class="flex justify-between"><span class="text-[#6B6B73]">− Ad cost share</span><span class="text-[#C93A3F]">-${money(o.adCost)}</span></div>
        ${["Returned", "Refunded"].includes(o.status) ? `<div class="flex justify-between"><span class="text-[#6B6B73]">− Return cost</span><span class="text-[#C93A3F]">-${money(c.ret)}</span></div>` : ""}
        <div class="flex justify-between pt-2 border-t" style="border-color:var(--line)"><span class="font-bold">Total ${o.status === "Delivered" ? "revenue" : "value"}</span><b>${money(o.total)}</b></div>
        <div class="flex justify-between pt-2 border-t" style="border-color:var(--line)"><span class="font-bold">${o.status === "Delivered" ? "Net profit" : "Net (no revenue yet)"}</span><b class="${o.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(o.profit)}</b></div>
      </div>
    </div>
    <div class="flex flex-wrap gap-2 mt-4">${orderActions(o)}</div>`;
  }

  function orderActions(o) {
    const act = (a, lbl, cls) => `<button class="cod-chip ${cls}" data-action="order-action" data-id="${o.id}" data-arg="${a}">${lbl}</button>`;
    const acts = [];
    if (o.status === "New") { acts.push(act("Pending Confirmation", "Start confirmation", "amber")); acts.push(act("Cancelled", "Cancel", "red")); }
    if (o.status === "Pending Confirmation") { acts.push(act("Confirmed", "Confirm", "green")); acts.push(act("No Answer", "No answer", "amber")); acts.push(act("Cancelled", "Cancel", "red")); }
    if (o.status === "Confirmed") { acts.push(act("Preparing", "Preparing", "blue")); }
    if (o.status === "Preparing") { acts.push(act("Shipped", "Ship", "blue")); }
    if (o.status === "Shipped") { acts.push(act("Out for Delivery", "Out for delivery", "violet")); }
    if (o.status === "Out for Delivery") { acts.push(act("Delivered", "Delivered ✅", "green")); acts.push(act("Returned", "Returned", "red")); }
    if (["New", "Pending Confirmation", "Confirmed", "Preparing", "Shipped", "Out for Delivery"].includes(o.status)) {
      acts.push(`<button class="cod-chip blue" data-action="order-call" data-id="${o.id}">${icon("phone", 13)} Call</button>`);
      acts.push(`<button class="cod-chip gray" data-action="order-msg" data-id="${o.id}">${icon("message-square", 13)} Send confirmation msg</button>`);
    }
    return acts.join("");
  }

  function applyOrderAction(id, arg) {
    const orders = load("orders");
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    o.status = arg;
    if (arg === "Delivered") { o.deliveredAt = new Date().toISOString(); toast("Order delivered 💰 " + money(o.total) + " revenue", "ok"); }
    if (arg === "Shipped") o.shippedAt = new Date().toISOString();
    if (arg === "Confirmed") o.confirmedAt = new Date().toISOString();
    if (arg === "Returned" || arg === "Cancelled") {
      o.notes = (o.notes ? o.notes + " " : "") + "→ " + arg;
      if (arg === "Returned") { createReturn(o); toast("Order returned — return recorded", "ok"); }
    }
    refreshOrderFinancials(o);
    upsert("orders", o);
    syncLeadFromOrder(o);
    shell();
    toast("Order → " + arg, "ok");
  }

  function createReturn(o) {
    const returns = load("returns");
    const r = returns.find((x) => x.orderId === o.id);
    if (r) return;
    const c = productCosts(o.productId);
    upsert("returns", {
      id: uid(), orderId: o.id, orderNumber: o.orderNumber, productId: o.productId, productName: o.productName,
      customer: o.customer, reason: "Customer refused", condition: "Opened", resolution: "Pending",
      refund: Math.round(o.total * 0.6), shippingCost: o.shipping, returnShipping: 250,
      campaignId: o.campaignId, createdAt: new Date().toISOString(),
    });
  }

  function syncLeadFromOrder(o) {
    const leads = load("leads");
    const l = leads.find((x) => x.orderId === o.id);
    if (!l) return;
    l.status = t_leadStatus(o.status);
    upsert("leads", l);
  }

  /* ---------------- confirmation ---------------- */
  function S_confirmation() {
    const { orders, kpis } = agg();
    const queue = orders.filter((o) => ["New", "Pending Confirmation"].includes(o.status));
    return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="kpi hot"><div class="kpi-lbl">Confirmation rate</div><div class="kpi-num">${kpis.confirmationRate.toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-lbl">Cancelled</div><div class="kpi-num">${orders.filter((o) => o.status === "Cancelled").length}</div></div>
      <div class="kpi"><div class="kpi-lbl">Returned</div><div class="kpi-num">${orders.filter((o) => o.status === "Returned").length}</div></div>
      <div class="kpi"><div class="kpi-lbl">In queue now</div><div class="kpi-num">${queue.length}</div></div>
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("phone-call", 18)}</span><div><div class="card-title">Confirmation Center</div><div class="card-sub">Call each new order — Confirm, Cancel, No Answer or Reschedule</div></div></div>
      ${queue.length ? queue.map((o) => `
        <div class="rounded-xl p-4 mb-3" style="background:#FAFAFA;border:1px solid var(--line)">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div class="font-extrabold">${esc(o.customer.name)} <span class="text-[#E85D0F]">${esc(o.orderNumber)}</span></div>
              <div class="text-[12.5px] text-[#6B6B73]">${esc(o.customer.phone)} · ${esc(o.customer.city)}, ${esc(o.customer.wilaya)}</div>
              <div class="text-[12.5px]">${esc(o.productName)} ×${o.qty} — <b>${money(o.total)}</b> · ${money(o.price * o.qty + o.shipping)} incl shipping</div>
            </div>
            <div class="flex flex-wrap gap-2">
              <button class="cod-chip green" data-action="order-action" data-id="${o.id}" data-arg="Confirmed">Confirm</button>
              <button class="cod-chip blue" data-action="order-call" data-id="${o.id}">${icon("phone", 13)} Call</button>
              <button class="cod-chip gray" data-action="order-msg" data-id="${o.id}">${icon("message-square", 13)} Msg</button>
              <button class="cod-chip amber" data-action="order-action" data-id="${o.id}" data-arg="Pending Confirmation">Reschedule</button>
              <button class="cod-chip red" data-action="order-action" data-id="${o.id}" data-arg="Cancelled">Cancel</button>
            </div>
          </div>
          <div id="conf-msg-${o.id}" class="mt-2 hidden"><textarea class="cod-textarea" rows="2" id="conf-text-${o.id}"></textarea><button class="cod-btn green mt-2" data-action="copy-conf" data-id="${o.id}">${icon("copy", 14)} Copy message</button></div>
        </div>`).join("") : `<div class="text-center py-8 text-[13px] text-[#9A9AA2]">Queue is empty 🎉</div>`}
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("badge-check", 18)}</span><div><div class="card-title">Confirmation analytics</div><div class="card-sub">Which campaigns, wilayas and products produce real delivered orders?</div></div></div>
      <div class="grid md:grid-cols-3 gap-3">
        ${confAnalytics().map((x) => `
          <div class="rounded-xl p-3" style="background:#FAFAFA;border:1px solid var(--line)">
            <div class="text-[11px] font-black uppercase text-[#9A9AA2]">${x.k}</div>
            <div class="space-y-1 mt-1.5">${x.rows.map((r) => `
              <div class="flex justify-between text-[12.5px]"><span class="truncate">${esc(r.name)}</span><b>${r.v}</b></div>`).join("")}</div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  function confAnalytics() {
    const { orders } = agg();
    const group = (f, filter) => {
      const m = {};
      orders.forEach((o) => { const k = filter(o); if (!k) return; (m[k] = m[k] || { n: 0, ok: 0 }); m[k].n++; if (o.status !== "New" && o.status !== "Cancelled" && o.status !== "Refunded") m[k].ok++; });
      return Object.entries(m).map(([k, v]) => ({ name: k, rate: v.n ? Math.round((v.ok / v.n) * 100) : 0, n: v.n })).sort((a, b) => b.rate - a.rate).slice(0, 5).map((x) => ({ name: x.name, v: x.rate + "% (" + x.n + ")" }));
    };
    return [
      { k: "By campaign", rows: group("campaignId", (o) => campaignName(o.campaignId)) },
      { k: "By wilaya", rows: group("wilaya", (o) => o.customer.wilaya) },
      { k: "By product", rows: group("product", (o) => o.productName) },
    ];
  }

  function campaignName(id) {
    const c = load("campaigns").find((x) => x.id === id);
    return c ? c.name : "—";
  }

  /* ---------------- shipping ---------------- */
  function S_shipping() {
    const { shipments } = agg();
    return `
    <div class="card">
      <div class="card-head"><span class="icon-tile green-soft">${icon("layers", 18)}</span><div><div class="card-title">Shipping Provider abstraction</div><div class="card-sub">Provider-agnostic: createShipment / getShipment / trackShipment / cancelShipment / createReturn. Configure providers in Settings.</div></div></div>
      <div class="grid sm:grid-cols-2 gap-3 text-[13px]">
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><code class="text-[12.5px]">ShippingProvider.createShipment({orderId, provider})</code><br><span class="text-[12px] text-[#9A9AA2]">→ returns tracking number + label</span></div>
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><code class="text-[12.5px]">ShippingProvider.trackShipment(tracking)</code><br><span class="text-[12px] text-[#9A9AA2]">→ live delivery status</span></div>
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><code class="text-[12.5px]">ShippingProvider.createReturn(orderId)</code><br><span class="text-[12px] text-[#9A9AA2]">→ return label</span></div>
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><code class="text-[12.5px]">ShippingProvider.cancelShipment(tracking)</code><br><span class="text-[12px] text-[#9A9AA2]">→ stops shipment before pickup</span></div>
      </div>
    </div>
    <div class="cod-table-wrap mt-4">
      <table class="cod-table">
        <thead><tr><th>Shipment</th><th>Order</th><th>Provider</th><th>Tracking</th><th>Status</th><th>Pickup</th><th>Cost</th><th>Destination</th></tr></thead>
        <tbody>${shipments.map((s) => `
          <tr>
            <td class="font-bold">#${esc(s.id)}</td><td>${esc(s.orderNumber)}</td>
            <td><span class="pill sky">${esc(providerName(s.provider))}</span></td>
            <td class="font-mono">${esc(s.tracking)}</td>
            <td><span class="${shipPill(s.status)}">${s.status}</span></td>
            <td>${fmtDate(s.pickupDate)}</td><td>${money(s.cost)}</td>
            <td class="text-[#6B6B73]">${esc(s.destination)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
  }

  function providerName(id) {
    const s = load("settings").providers || [];
    const p = s.find((x) => x.id === id);
    return p ? p.name : id;
  }

  /* ---------------- returns ---------------- */
  function S_returns() {
    const { returns, kpis } = agg();
    return `
    <div class="grid grid-cols-3 gap-3">
      <div class="kpi"><div class="kpi-lbl">Returned orders</div><div class="kpi-num">${returns.length}</div></div>
      <div class="kpi"><div class="kpi-lbl">Return rate</div><div class="kpi-num">${kpis.returnRate.toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-lbl">Return value at risk</div><div class="kpi-num">${money(returns.reduce((a, x) => a + (x.refund || 0) + (x.shippingCost || 0) + (x.returnShipping || 0), 0))}</div></div>
    </div>
    <div class="cod-table-wrap mt-4">
      <table class="cod-table">
        <thead><tr><th>Order</th><th>Product</th><th>Customer</th><th>Reason</th><th>Condition</th><th>Refund</th><th>Resolution</th><th></th></tr></thead>
        <tbody>${returns.map((r) => `
          <tr>
            <td class="font-bold">${esc(r.orderNumber)}</td><td>${esc(r.productName)}</td>
            <td>${esc(r.customer.name)}</td>
            <td><span class="pill ${r.reason === "Customer refused" ? "red" : "amber"}">${esc(r.reason)}</span></td>
            <td>${esc(r.condition)}</td><td>${money(r.refund)}</td>
            <td><select class="cod-select" data-action="return-resolution" data-id="${r.id}">${["Pending", "Refunded", "Replacement"].map((x) => `<option ${x === r.resolution ? "selected" : ""}>${x}</option>`).join("")}</select></td>
            <td><button class="cod-chip gray" data-action="open-return" data-id="${r.id}">${icon("arrow-up-right", 14)}</button></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("search", 18)}</span><div><div class="card-title">AI return pattern analysis</div></div></div>
      <div id="return-ai-out">${returnPatternsHTML()}</div>
    </div>`;
  }

  function returnPatternsHTML() {
    const { returns, orders } = agg();
    if (!returns.length) return `<div class="text-[13px] text-[#9A9AA2]">No returns yet.</div>`;
    const byCampaign = {};
    returns.forEach((r) => { const k = campaignName(r.campaignId); (byCampaign[k] = byCampaign[k] || []).push(r); });
    const byReason = {};
    returns.forEach((r) => { byReason[r.reason] = (byReason[r.reason] || 0) + 1; });
    const topReason = Object.entries(byReason).sort((a, b) => b[1] - a[1])[0];
    return `
      <div class="grid sm:grid-cols-2 gap-3">
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
          <div class="text-[12px] font-black uppercase text-[#9A9AA2]">Top return reason</div>
          <div class="font-bold mt-1">${esc(topReason[0])} (${topReason[1]})</div>
          <div class="text-[12.5px] text-[#6B6B73] mt-1">Compare the confirmation script + creative against the refusing customer — refused deliveries often follow over-promising creatives.</div>
        </div>
        <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
          <div class="text-[12px] font-black uppercase text-[#9A9AA2]">Returns by campaign</div>
          <div class="space-y-1 mt-1">${Object.entries(byCampaign).map(([k, v]) => `<div class="flex justify-between text-[12.5px]"><span class="truncate">${esc(k)}</span><b>${v.length} return${v.length > 1 ? "s" : ""}</b></div>`).join("")}</div>
        </div>
      </div>
      <div class="mt-3 rounded-xl p-3 text-[12.5px]" style="background:#FFF7EF;border:1px solid #FFE8D9;color:#B98A1F">💡 Rule-based demo analysis. Connect an AI key for natural-language pattern mining across campaigns & creatives.</div>`;
  }

  /* ---------------- customers ---------------- */
  function S_customers() {
    const { orders } = agg();
    const custs = customerList(orders);
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="card-title">Customer CRM</div><div class="card-sub">Profiles, classification and fraud/risk engine (LOW / MEDIUM / HIGH)</div></div>
      <select class="cod-select" data-filter="class"><option value="">Class: all</option><option>New</option><option>Returning</option><option>VIP</option><option>High-risk</option><option>Frequent returner</option></select>
    </div>
    <div class="cod-table-wrap mt-3">
      <table class="cod-table">
        <thead><tr><th>Customer</th><th>Phone</th><th>Wilaya</th><th>Orders</th><th>Delivered</th><th>Returned</th><th>Spent</th><th>Class</th><th>Risk</th><th></th></tr></thead>
        <tbody id="cust-tbody">
          ${custs.map((c) => `
          <tr class="cursor-pointer" data-action="open-customer" data-phone="${esc(c.phone)}">
            <td class="font-bold">${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${esc(c.wilaya)}</td>
            <td>${c.orders.length}</td><td class="font-bold text-[#0FA05A]">${c.delivered}</td><td class="text-[#C93A3F]">${c.returned}</td>
            <td class="font-bold">${money(c.spent)}</td>
            <td><span class="pill ${c.class === "VIP" ? "amber" : c.class === "Frequent returner" || c.class === "High-risk" ? "red" : c.class === "Returning" ? "green" : "gray"}">${c.class}</span></td>
            <td><span class="risk ${c.risk.level === "LOW" ? "low" : c.risk.level === "MEDIUM" ? "medium" : "high"}">${c.risk.level}</span></td>
            <td><button class="cod-chip gray" data-action="open-customer" data-phone="${esc(c.phone)}">${icon("arrow-up-right", 14)}</button></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
  }

  function customerList(orders) {
    const map = {};
    orders.forEach((o) => {
      const p = o.customer.phone;
      (map[p] = map[p] || { name: o.customer.name, phone: p, wilaya: o.customer.wilaya, city: o.customer.city, orders: [] });
      map[p].orders.push(o);
    });
    return Object.values(map).map((c) => {
      const delivered = c.orders.filter((o) => o.status === "Delivered").length;
      const returned = c.orders.filter((o) => o.status === "Returned").length;
      const cancelled = c.orders.filter((o) => ["Cancelled", "Refunded"].includes(o.status)).length;
      const spent = c.orders.filter((o) => o.status === "Delivered").reduce((a, o) => a + o.total, 0);
      const n = c.orders.length;
      let cls = "New";
      if (n >= 3 && delivered >= 2) cls = "VIP";
      else if (returned >= 2) cls = "Frequent returner";
      else if (cancelled >= 2) cls = "High-risk";
      else if (n >= 2) cls = "Returning";
      return { ...c, delivered, returned, cancelled, spent, class: cls, risk: customerRisk(c.phone) };
    });
  }

  function customerRisk(phone) {
    const orders = load("orders");
    const mine = orders.filter((o) => o.customer.phone === phone);
    const leads = load("leads");
    const dupLeads = leads.filter((l) => l.phone === phone).length;
    const returned = mine.filter((o) => o.status === "Returned").length;
    const cancelled = mine.filter((o) => ["Cancelled", "Refunded"].includes(o.status)).length;
    const recent = mine.filter((o) => daysAgo(o.createdAt) <= 3).length;
    const reasons = [];
    let score = 0;
    if (dupLeads > 2) { score += 2; reasons.push(dupLeads + " leads with same phone (duplicate risk)"); }
    if (returned >= 1) { score += 2; reasons.push(returned + " returned order(s)"); }
    if (cancelled >= 2) { score += 2; reasons.push(cancelled + " cancelled order(s)"); }
    if (recent >= 2) { score += 1; reasons.push(recent + " recent orders in 3 days"); }
    if (mine.some((o) => o.qty > 3)) { score += 1; reasons.push("unusual quantity ordered"); }
    if (mine.length <= 1 && leads.length <= 2) { score = Math.max(0, score - 1); reasons.push("new customer, no history"); }
    if (!reasons.length) reasons.push("no suspicious patterns");
    return { level: score >= 4 ? "HIGH" : score >= 2 ? "MEDIUM" : "LOW", score, reasons };
  }

  function openCustomerModal(phone) {
    const { orders } = agg();
    const c = customerList(orders).find((x) => x.phone === phone);
    if (!c) return;
    openModal(`
      <div class="flex items-center justify-between">
        <div><div class="card-title text-[17px]">${esc(c.name)}</div><div class="card-sub">${esc(c.phone)} · ${esc(c.city)}, ${esc(c.wilaya)}</div></div>
        <div class="flex items-center gap-2"><span class="pill ${c.class === "VIP" ? "amber" : c.class === "Frequent returner" ? "red" : "green"}">${c.class}</span><span class="risk ${c.risk.level === "LOW" ? "low" : c.risk.level === "MEDIUM" ? "medium" : "high"}">${c.risk.level} RISK</span><button class="cod-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      </div>
      <div class="grid grid-cols-4 gap-3 mt-4">
        <div class="kpi"><div class="kpi-lbl">Orders</div><div class="kpi-num text-[20px]">${c.orders.length}</div></div>
        <div class="kpi"><div class="kpi-lbl">Delivered</div><div class="kpi-num text-[20px]">${c.delivered}</div></div>
        <div class="kpi"><div class="kpi-lbl">Spent</div><div class="kpi-num text-[20px]">${money(c.spent)}</div></div>
        <div class="kpi"><div class="kpi-lbl">AOV</div><div class="kpi-num text-[20px]">${money(c.delivered ? c.spent / c.delivered : 0)}</div></div>
      </div>
      <div class="mt-3"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">Risk reasons</div><div class="text-[12.5px] mt-1">${c.risk.reasons.map((r) => "• " + esc(r)).join("<br>")}</div></div>
      <div class="mt-3"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">Order history</div>
        <div class="space-y-1.5 mt-1.5">${c.orders.map((o) => `<div class="flex justify-between text-[12.5px] px-3 py-2 rounded-lg" style="background:#FAFAFA;border:1px solid var(--line)"><span>${esc(o.orderNumber)} · ${esc(o.productName)} ×${o.qty} · ${fmtDate(o.createdAt)}</span><b>${money(o.total)}</b> <span class="${orderPill(o.status)}">${o.status}</span></div>`).join("")}</div>
      </div>`);
  }

  /* ---------------- analytics ---------------- */
  function S_analytics() {
    const { wilaya, funnelConv, kpis } = agg();
    return `
    <div class="grid lg:grid-cols-2 gap-4">
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("chart-column", 18)}</span><div><div class="card-title">COD Funnel conversions</div></div></div>
        <canvas id="funnel-chart" height="120"></canvas>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("map", 18)}</span><div><div class="card-title">Funnel conversion rates</div></div></div>
        <div class="space-y-2 mt-2">${funnelConv.map((c) => `
          <div class="flex items-center justify-between text-[13px]"><span class="text-[#6B6B73]">${c.from} → ${c.to}</span><b>${c.rate.toFixed(1)}%</b></div>
          <div class="h-2 rounded-full overflow-hidden -mt-1" style="background:#EDEDF0"><div style="width:${Math.min(100, c.rate)}%;height:100%;background:${c.rate > 50 ? "#0FA05A" : c.rate > 25 ? "#F5B301" : "#C93A3F"}"></div></div>`).join("")}</div>
      </div>
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("map-pin", 18)}</span><div><div class="card-title">Wilaya / location analytics</div><div class="card-sub">Best, worst, high-profit and high-return regions — sample size shown, no conclusions without data</div></div></div>
      <div class="cod-table-wrap"><table class="cod-table">
        <thead><tr><th>Wilaya</th><th>Orders</th><th>Confirmed</th><th>Delivered</th><th>Returned</th><th>Return %</th><th>Cancel %</th><th>Shipping</th><th>Profit</th><th>Sample</th></tr></thead>
        <tbody>${wilaya.map((w) => `
          <tr><td class="font-bold">${esc(w.wilaya)}</td><td>${w.orders}</td><td>${w.confirmed}</td><td class="font-bold text-[#0FA05A]">${w.delivered}</td><td>${w.returned}</td>
          <td><span class="pill ${w.returnRate > 30 ? "red" : w.returnRate > 15 ? "amber" : "green"}">${w.returnRate.toFixed(0)}%</span></td>
          <td>${w.cancelRate.toFixed(0)}%</td><td>${money(w.shipping)}</td>
          <td class="font-bold ${w.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(w.profit)}</td>
          <td><span class="pill gray">n=${w.sample}</span></td></tr>`).join("")}
        </tbody>
      </table></div>
    </div>`;
  }

  /* ---------------- profit ---------------- */
  function S_profit() {
    const { kpis: k } = agg();
    const rows = [
      ["Revenue (delivered)", money(k.revenue), ""],
      ["− Product cost", "-" + money(k.orders * 1200), "demo avg"],
      ["− Shipping cost", "-" + money(k.costPerDelivered * k.delivered), ""],
      ["− Packaging", "-" + money(k.delivered * 120), ""],
      ["− COD confirmation cost", "-" + money(k.orders * 35), ""],
      ["− Return shipping + refunds", "-" + money(load("returns").reduce((a, r) => a + r.refund + r.returnShipping, 0)), ""],
      ["− Ad spend", "-" + money(k.adSpend), ""],
      ["= NET PROFIT", money(k.netProfit), "🔥"],
    ];
    const cards = [
      ["Gross profit", money(k.revenue - k.adSpend), ""],
      ["Net profit", money(k.netProfit), "🔥"],
      ["Profit margin", (k.revenue ? (k.netProfit / k.revenue) * 100 : 0).toFixed(1) + "%", ""],
      ["Profit / delivered order", money(k.profitPerDelivered), "🔥"],
      ["CAC", money(k.cac), ""],
      ["Cost / confirmed order", money(k.costPerConfirmed), ""],
      ["Cost / delivered order", money(k.costPerDelivered), ""],
      ["Break-even CPA", money(k.breakEvenCpa), ""],
    ];
    return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      ${cards.map(([l, v, em]) => `<div class="kpi${em ? " hot" : ""}"><div class="kpi-lbl">${em} ${l}</div><div class="kpi-num">${v}</div></div>`).join("")}
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("calculator", 18)}</span><div><div class="card-title">Real profit waterfall</div><div class="card-sub">Revenue − every cost = net profit. No fake margins.</div></div></div>
      <div class="space-y-1.5 max-w-xl">${rows.map(([l, v, em]) => `
        <div class="flex justify-between text-[13.5px] ${l.startsWith("=") ? "pt-2 border-t font-black" : ""}" style="border-color:var(--line)"><span>${l}</span><b class="${v.startsWith("-") ? "text-[#C93A3F]" : ""} ${l.startsWith("=") ? "text-[#0FA05A] text-[16px]" : ""}">${v}</b></div>`).join("")}</div>
    </div>`;
  }

  /* ---------------- AI advisor ---------------- */
  function advisorLocal() {
    const { campaigns, kpis, wilaya } = agg();
    const recs = [];
    const best = campaigns.filter((c) => c.profit > 0).sort((a, b) => b.profit - a.profit)[0];
    if (best) recs.push({ type: "SCALE", title: "Scale " + best.name, detail: "Best profitable delivered orders (" + money(best.profit) + "). Increase budget " + money(best.budget) + " → +30%." });
    const bad = campaigns.filter((c) => c.orders > 0 && c.deliveryRate < 40).sort((a, b) => a.deliveryRate - b.deliveryRate)[0];
    if (bad) recs.push({ type: "REDUCE", title: "Reduce " + bad.name, detail: bad.delivered + "/" + bad.orders + " delivered (" + bad.deliveryRate.toFixed(0) + "%). Cheap leads, weak profit. Pause or change angle." });
    const ret = wilaya.filter((w) => w.sample >= 3 && w.returnRate > 30).sort((a, b) => b.returnRate - a.returnRate)[0];
    if (ret) recs.push({ type: "FIX", title: "High returns in " + ret.wilaya, detail: ret.returnRate.toFixed(0) + "% return rate on n=" + ret.sample + " orders. Check confirmation script + delivery zone." });
    recs.push({ type: "TEST", title: "Test problem-focused UGC hook", detail: "Winning creatives use the #1 pain point in the first 3 seconds. A/B against product-focused hook." });
    if (kpis.returnRate > 15) recs.push({ type: "REDUCE", title: "Return rate above threshold", detail: kpis.returnRate.toFixed(0) + "% overall returns. Audit offer vs creative promise." });
    return recs.slice(0, 6);
  }

  function S_advisor() {
    return `
    <div class="card">
      <div class="card-head"><span class="icon-tile green-soft">${icon("sparkles", 18)}</span><div><div class="card-title">WHAT SHOULD I DO TODAY?</div><div class="card-sub">AI reads your real data and tells you exactly where profit leaks — scale, reduce, test, fix.</div></div></div>
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="pill gray">Based on live store data (${esc(store().name)})</span>
        <button class="cod-btn primary" id="advisor-run">${icon("sparkles", 15)} Run AI analysis</button>
      </div>
      <div id="advisor-out" class="mt-4">${advisorHTML(advisorLocal(), true)}</div>
    </div>`;
  }

  function advisorHTML(recs, demo) {
    return `
      ${demo ? `<div class="mb-3 rounded-xl px-4 py-2.5 text-[12.5px]" style="background:#FFF7EF;border:1px solid #FFE8D9;color:#B98A1F">Rule-based demo recommendations computed from your data. Connect an AI key for deeper natural-language analysis.</div>` : ""}
      <div class="space-y-3">
        ${recs.map((r) => `
          <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
            <div class="flex items-center gap-2"><span class="pill ${r.type === "SCALE" ? "green" : r.type === "REDUCE" ? "red" : r.type === "TEST" ? "blue" : "amber"}">${r.type}</span><b class="text-[14px]">${esc(r.title)}</b></div>
            <div class="text-[13px] text-[#6B6B73] mt-1.5">${esc(r.detail)}</div>
          </div>`).join("")}
      </div>`;
  }

  async function runAdvisor() {
    const out = $("#advisor-out");
    out.innerHTML = `<div class="text-[13px] font-bold text-[#9A9AA2]">Analyzing your store data…</div>`;
    const { kpis, campaigns, wilaya, orders } = agg();
    const payload = {
      store: store().name,
      kpis,
      campaigns: campaigns.map((c) => ({ name: c.name, spend: c.spend, orders: c.orders, delivered: c.delivered, returned: c.returned, profit: c.profit, deliveryRate: c.deliveryRate })),
      wilaya: wilaya.map((w) => ({ wilaya: w.wilaya, sample: w.sample, returnRate: w.returnRate, profit: w.profit })),
      orderCount: orders.length,
    };
    const res = await PL_API.ai("cod_advisor", payload, { maxTokens: 2500, prompt: "You are the AI advisor of a COD e-commerce operating system. Given this JSON of real store KPIs, return STRICT JSON: {\"recommendations\":[{\"type\":\"SCALE|REDUCE|TEST|FIX\",\"title\":\"...\",\"detail\":\"why and what to do\"}]} (max 6). Optimize for PROFITABLE DELIVERED ORDERS. Never invent numbers." });
    let recs = res.data ? parseJSON(res.data) : null;
    recs = recs && Array.isArray(recs.recommendations) ? recs.recommendations.slice(0, 6) : advisorLocal();
    out.innerHTML = advisorHTML(recs, !res.data);
  }

  /* ---------------- settings ---------------- */
  function S_settings() {
    const s = load("settings");
    const st = store();
    return `
    <div class="grid lg:grid-cols-2 gap-4">
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("store", 18)}</span><div><div class="card-title">Store</div></div></div>
        <form id="store-form" class="grid grid-cols-2 gap-3">
          <div><label class="label">Store name</label><input class="cod-input w-full" name="name" value="${esc(st.name)}"></div>
          <div><label class="label">Currency</label><input class="cod-input w-full" name="currency" value="${esc(st.currency)}"></div>
          <div><label class="label">Country</label><input class="cod-input w-full" name="country" value="${esc(st.country)}"></div>
          <div><label class="label">Default language</label><select class="cod-select w-full" name="lang">${["ar", "dz", "fr", "en"].map((l) => `<option ${l === st.lang ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div class="col-span-2"><label class="label">WhatsApp number</label><input class="cod-input w-full" name="whatsapp" value="${esc(st.whatsapp)}"></div>
          <div class="col-span-2"><button class="cod-btn primary" type="submit">${icon("save", 15)} Save store</button></div>
        </form>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("message-circle", 18)}</span><div><div class="card-title">Confirmation scripts (Arabic / Darija / French / English)</div></div></div>
        <form id="scripts-form" class="space-y-3">
          ${["ar", "dz", "fr", "en"].map((l) => `<div><label class="label">${l.toUpperCase()}</label><textarea class="cod-textarea" name="${l}" rows="2">${esc((s.scripts && s.scripts[l]) || "")}</textarea></div>`).join("")}
          <button class="cod-btn primary" type="submit">${icon("save", 15)} Save scripts</button>
          <div class="text-[11.5px] text-[#9A9AA2]">Variables: {name} {store} {order} {wilaya} {product} {total}</div>
        </form>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("truck", 18)}</span><div><div class="card-title">Shipping providers (API abstraction)</div></div></div>
        <div class="space-y-2">
          ${(s.providers || []).map((p) => `
            <div class="flex items-center justify-between rounded-xl px-3 py-2.5" style="background:#FAFAFA;border:1px solid var(--line)">
              <div><div class="text-[13px] font-bold">${esc(p.name)}</div><div class="text-[11.5px] text-[#9A9AA2]">${p.zone} · key ${esc(p.apiKey || "not set")}</div></div>
              <span class="pill ${p.connected ? "green" : "gray"}">${p.connected ? "Connected" : "Not connected"}</span>
            </div>`).join("")}
        </div>
        <div class="text-[12px] text-[#9A9AA2] mt-3">API keys are stored server-side only (Settings → AI providers pattern). The ShippingProvider interface is provider-agnostic; add API key / secret / account / webhook here or import via CSV.</div>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("bell", 18)}</span><div><div class="card-title">Alert thresholds & roles</div></div></div>
        <form id="alert-form" class="grid grid-cols-3 gap-3">
          <div><label class="label">Return rate %</label><input class="cod-input w-full" name="returnRate" value="${(s.alertThresholds && s.alertThresholds.returnRate) || 12}"></div>
          <div><label class="label">Confirm rate %</label><input class="cod-input w-full" name="confirmRate" value="${(s.alertThresholds && s.alertThresholds.confirmRate) || 45}"></div>
          <div><label class="label">Low stock</label><input class="cod-input w-full" name="stockLow" value="${(s.alertThresholds && s.alertThresholds.stockLow) || 20}"></div>
          <div class="col-span-3"><button class="cod-btn primary" type="submit">${icon("save", 15)} Save thresholds</button></div>
        </form>
        <div class="mt-4">
          <div class="text-[12px] font-black uppercase text-[#9A9AA2]">Roles</div>
          <div class="flex flex-wrap gap-1.5 mt-2">${(s.roles || []).map((r) => `<span class="pill gray">${esc(r)}</span>`).join("")}</div>
          <div class="text-[11.5px] text-[#9A9AA2] mt-2">Owner / Admin / Manager / Confirmation Agent / Warehouse / Shipping Agent / Viewer — with role-based permissions enforced by the backend (auth layer).</div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("database", 18)}</span><div><div class="card-title">Demo data</div></div></div>
        <div class="flex flex-wrap gap-2">
          <button class="cod-btn ghost" data-action="export-cod">${icon("download", 15)} Export JSON</button>
          <button class="cod-btn red" data-action="reset-cod">${icon("trash-2", 15)} Reset demo data</button>
        </div>
        <div class="text-[11.5px] text-[#9A9AA2] mt-3">All data is demo/seed data persisted in localStorage. Production would persist to the Punchline server (entities + orders API) with auth, rate limiting and audit logs.</div>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("settings", 18)}</span><div><div class="card-title">AI provider routing</div></div></div>
        <div class="text-[13px] text-[#6B6B73]">COD OS reuses the Punchline AI layer: OpenRouter, NVIDIA NIM, OpenAI, Anthropic, Gemini, Mistral, Groq, DeepSeek — with vision / fast / deep / copywriting routing and automatic fallback.</div>
        <a class="cod-btn outline mt-3 inline-flex" href="settings.html" target="_blank">${icon("arrow-up-right", 15)} Configure AI providers</a>
        <div class="text-[11.5px] text-[#9A9AA2] mt-2">API keys never leave the server.</div>
      </div>
    </div>`;
  }

  /* ---------------- generic renders ---------------- */
  const S = {
    dashboard: S_dashboard, products: S_products, research: S_research, offers: S_offers,
    landing: S_landing, creative: S_creative, ads: S_ads, leads: S_leads, orders: S_orders,
    confirmation: S_confirmation, shipping: S_shipping, returns: S_returns, customers: S_customers,
    analytics: S_analytics, profit: S_profit, advisor: S_advisor, settings: S_settings,
  };

  function mount(id) {
    if (id === "offers") renderOffers();
    if (id === "analytics") mkChart("funnel-chart", {
      type: "bar",
      data: { labels: agg().funnel.slice(1).map((f) => f.label), datasets: [{ label: "Count", data: agg().funnel.slice(1).map((f) => f.value), backgroundColor: "#FF9B5E", borderRadius: 8, maxBarThickness: 42 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#F1F0EE" }, ticks: { precision: 0 } }, x: { grid: { display: false } } } },
    });
  }

  /* ---------------- AI helpers ---------------- */
  function parseJSON(text) {
    if (!text) return null;
    const m = String(text).match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { return JSON.parse(m[0]); } catch (e) { return null; }
  }

  /* ---------------- global event delegation ---------------- */
  function wire() {
    document.addEventListener("click", async (e) => {
      const t = e.target.closest("[data-nav]");
      if (t) { state.section = t.dataset.nav; shell(); return; }

      const action = e.target.closest("[data-action]");
      if (!action) return;
      const a = action.dataset.action;
      const id = action.dataset.id || action.dataset.phone || "";
      const arg = action.dataset.arg || "";

      if (a === "go") { state.section = action.dataset.section; shell(); return; }
      if (a === "close-modal") { closeModal(); return; }

      if (a === "open-order") {
        const o = load("orders").find((x) => x.id === id);
        if (o) openModal(orderDetailHTML(o));
        return;
      }
      if (a === "order-action") { applyOrderAction(id, arg); return; }
      if (a === "order-call") { const o = load("orders").find((x) => x.id === id); if (o) window.open("tel:" + o.customer.phone.replace(/[^0-9+]/g, "")); return; }
      if (a === "order-msg") {
        const o = load("orders").find((x) => x.id === id);
        if (!o) return;
        const wrap = $("#conf-msg-" + id);
        const txt = $("#conf-text-" + id);
        if (wrap) {
          wrap.classList.toggle("hidden");
          if (!wrap.classList.contains("hidden")) txt.value = buildScript(o);
        } else {
          toast(buildScript(o));
        }
        return;
      }
      if (a === "copy-conf") {
        const txt = $("#conf-text-" + id);
        if (txt) { await navigator.clipboard.writeText(txt.value).catch(() => {}); toast("Message copied", "ok"); }
        return;
      }
      if (a === "open-lead") {
        const l = load("leads").find((x) => x.id === id);
        if (l) {
          const statusOptions = LEAD_STATUSES.map((s) => `<button class="cod-chip ${l.status === s ? "green" : "gray"}" data-action="lead-action" data-id="${l.id}" data-arg="${s}">${s}</button>`).join(" ");
          openModal(`<div class="flex items-center justify-between"><div class="card-title text-[17px]">${esc(l.name)}</div><button class="cod-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
            <div class="text-[13px] text-[#6B6B73]">${esc(l.phone)} · ${esc(l.wilaya)} · ${fmtDateTime(l.createdAt)}</div>
            <div class="mt-2 text-[13px]">Product <b>${esc(l.productName || "—")}</b> · Campaign <b>${esc(l.campaignName || "—")}</b> · Order ${l.orderValue ? money(l.orderValue) : "—"}</div>
            <div class="mt-3 text-[12px] font-black uppercase text-[#9A9AA2]">Move lead</div>
            <div class="flex flex-wrap gap-1.5 mt-2">${statusOptions}</div>`);
        }
        return;
      }
      if (a === "lead-action") { updateLead(id, arg); return; }
      if (a === "add-product") { openModal(productForm()); return; }
      if (a === "edit-product") {
        const p = load("products").find((x) => x.id === id);
        if (p) openModal(productForm(p));
        return;
      }
      if (a === "open-product") { openProductModal(id); return; }
      if (a === "offers-for") { closeModal(); state.section = "offers"; shell(); setTimeout(() => { if ($("#offer-product")) $("#offer-product").value = id; renderOffers(); }, 0); return; }
      if (a === "pick-research-file") { const f = $("#research-file"); if (f) f.click(); return; }
      if (a === "add-research-product") {
        const products = load("products");
        upsert("products", { id: uid(), name: arg, sku: "NEW", category: "UNKNOWN", supplier: "UNKNOWN", supplierCost: 0, sellingPrice: 0, discountPrice: 0, shippingCost: 0, packagingCost: 0, confirmationCost: 35, returnCost: 0, deliveryCost: 0, stock: 0, description: "Added from AI research — fill costs before launching." });
        toast("Product added — edit costs in Products", "ok");
        state.section = "products"; shell();
        return;
      }
      if (a === "pick-creative-file") { const f = $("#creative-file"); if (f) f.click(); return; }
      if (a === "run-creative-analyzer") {
        const out = $("#creative-an-out");
        out.innerHTML = `<div class="mt-3 text-[12.5px] font-bold text-[#9A9AA2]">Analyzing creative…</div>`;
        const res = await PL_API.ai("analyze_ad", { note: "Uploaded creative" }, { maxTokens: 2500 });
        const g = res.data ? parseJSON(res.data) : null;
        const verdict = (g && g.verdict) || "UNKNOWN / NEEDS USER INPUT";
        const versions = (g && g.versions) || ["Improved version 1 — sharpen the hook (demo)", "Improved version 2 — tighten the offer (demo)", "Improved version 3 — add social proof (demo)"];
        out.innerHTML = `
          <div class="mt-3 grid sm:grid-cols-2 gap-3">
            <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">Verdict</div><div class="flex gap-2 mt-2">${["KEEP", "CHANGE", "TEST"].map((v) => `<span class="pill ${v === verdict ? "orange" : "gray"}">${v}</span>`).join("")}</div></div>
            <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[12px] font-black uppercase text-[#9A9AA2]">3 improved versions</div><div class="space-y-1.5 mt-2">${versions.map((v) => `<div class="text-[12.5px] px-3 py-2 rounded-lg" style="background:#fff;border:1px solid var(--line)">${esc(v)}</div>`).join("")}</div></div>
          </div>` + (res.simulated ? `<div class="mt-3 text-[11.5px]" style="color:#B98A1F">Demo output — upload a real creative + configure an AI key for a real verdict.</div>` : "");
        return;
      }
      if (a === "open-campaign") { openCampaignModal(id); return; }
      if (a === "open-return") {
        const r = load("returns").find((x) => x.id === id);
        if (r) openModal(`<div class="flex items-center justify-between"><div class="card-title text-[17px]">Return ${esc(r.orderNumber)}</div><button class="cod-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
          <div class="mt-3 text-[13px] space-y-1"><div>Reason: <b>${esc(r.reason)}</b></div><div>Condition: ${esc(r.condition)}</div><div>Refund: ${money(r.refund)} · Return shipping: ${money(r.returnShipping)}</div><div>Campaign: ${esc(campaignName(r.campaignId))}</div></div>`);
        return;
      }
      if (a === "open-customer") { openCustomerModal(id); return; }
      if (a === "open-live-preview" || a === "btn-preview-cod") { openPreview(); return; }
      if (a === "export-cod") {
        const payload = { store: store(), collections: ["products", "campaigns", "ads", "leads", "orders", "returns", "shipments", "settings"].reduce((m, c) => (m[c] = load(c), m), {}) };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a"); link.href = url; link.download = "cod-" + store().id + ".json"; link.click();
        URL.revokeObjectURL(url);
        toast("Export downloaded", "ok");
        return;
      }
      if (a === "reset-cod") {
        Object.keys(localStorage).filter((k) => k.startsWith("cod.")).forEach((k) => localStorage.removeItem(k));
        location.reload();
        return;
      }
    });

    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.dataset && t.dataset.filter) {
        const key = t.dataset.filter;
        const val = t.value;
        const tbody = $("#leads-tbody") || $("#orders-tbody") || $("#cust-tbody");
        if (!tbody) return;
        $$("tr", tbody).forEach((tr) => {
          const cell = tr.querySelector("td:nth-child(" + (key === "status" ? "6" : key === "productName" ? "4" : key === "wilaya" ? "3" : key === "class" ? "8" : "1") + ")");
          const show = !val || (cell && cell.textContent === val);
          tr.style.display = show ? "" : "none";
        });
        return;
      }
      if (t.dataset && t.dataset.action === "return-resolution") {
        const r = load("returns").find((x) => x.id === t.dataset.id);
        if (r) { r.resolution = t.value; upsert("returns", r); toast("Return → " + t.value, "ok"); }
        return;
      }
      if (t.id === "store-switch") { setCurrentStore(t.value); shell(); return; }
      if (t.id === "offer-product") { renderOffers(); return; }
    });

    document.addEventListener("submit", async (e) => {
      const form = e.target;
      const fid = form.id;
      if (fid === "product-form") {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const num = (k) => Math.max(0, Number(data[k] || 0));
        const p = {
          id: form.dataset.id || uid(),
          name: data.name || "Unnamed", sku: data.sku || "SKU", category: data.category || "—",
          supplier: data.supplier || "—", supplierCost: num("supplierCost"), sellingPrice: num("sellingPrice"),
          discountPrice: num("discountPrice") || num("sellingPrice"), shippingCost: num("shippingCost"),
          packagingCost: num("packagingCost"), confirmationCost: num("confirmationCost"), returnCost: num("returnCost"),
          deliveryCost: num("deliveryCost"), stock: num("stock"), description: data.description || "",
        };
        upsert("products", p);
        closeModal(); shell(); toast("Product saved", "ok");
        return;
      }
      if (fid === "research-form") { e.preventDefault(); runResearch(form); return; }
      if (fid === "landing-form") { e.preventDefault(); runLanding(form); return; }
      if (fid === "creative-form") { e.preventDefault(); runCreative(form); return; }
      if (fid === "store-form") {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const list = getStores().map((s) => s.id === store().id ? { ...s, name: data.name || s.name, currency: data.currency || s.currency, country: data.country || s.country, lang: data.lang || s.lang, whatsapp: data.whatsapp || s.whatsapp } : s);
        saveStores(list); shell(); toast("Store saved", "ok");
        return;
      }
      if (fid === "scripts-form") {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const s = load("settings");
        s.scripts = { ...(s.scripts || {}), ar: data.ar, dz: data.dz, fr: data.fr, en: data.en };
        save("settings", s); toast("Confirmation scripts saved", "ok");
        return;
      }
      if (fid === "alert-form") {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const s = load("settings");
        s.alertThresholds = { returnRate: Number(data.returnRate) || 0, confirmRate: Number(data.confirmRate) || 0, stockLow: Number(data.stockLow) || 0 };
        save("settings", s); toast("Thresholds saved", "ok");
        return;
      }
    });

    document.addEventListener("click", (e) => {
      const burger = e.target.closest("#cod-burger");
      if (burger) { $("#cod-sidebar").classList.add("open"); const m = $("#cod-drawer-mask"); m.classList.add("show"); return; }
      if (e.target.closest("#cod-drawer-mask")) closeDrawer();
      if (e.target.closest("#advisor-run")) runAdvisor();
      if (e.target.closest("[data-action='open-live-preview']") || e.target.closest("#btn-preview-cod")) openPreview();
    });

    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); closeDrawer(); } });

    /* file inputs */
    const rf = document.getElementById("research-file");
    if (rf) rf.addEventListener("change", () => { const lbl = $("#research-file-label"); lbl.textContent = [...rf.files].map((f) => f.name + " (" + f.size + " B)").join(", ") || ""; });
    const cf = document.getElementById("creative-file");
    if (cf) cf.addEventListener("change", () => { toast("File selected: " + (cf.files[0] && cf.files[0].name)); });
  }

  function updateLead(id, status) {
    const leads = load("leads");
    const l = leads.find((x) => x.id === id);
    if (!l) return;
    l.status = status;
    if (status === "Order Created" && !l.orderId) {
      const orders = load("orders");
      const o = { id: uid(), orderNumber: "PL-" + String(10000 + orders.length + 1), customer: { name: l.name, phone: l.phone, wilaya: l.wilaya, city: l.city, address: "" }, productId: l.productId, productName: l.productName, qty: 1, price: 0, shipping: 0, total: 0, adCost: 0, status: "New", paymentMethod: "COD", campaignId: l.campaignId, adId: l.adId, landing: "lp", utm: { source: "meta" }, createdAt: new Date().toISOString() };
      upsert("orders", o);
      l.orderId = o.id;
      toast("Order created — open Orders to complete pricing", "ok");
    }
    upsert("leads", l);
    shell();
  }

  function buildScript(o) {
    const s = load("settings");
    const lang = store().lang || "en";
    const tpl = (s.scripts && s.scripts[lang]) || "{name}, here is {store}. Can we confirm order {order} to {wilaya}?";
    return tpl
      .replace("{name}", o.customer.name)
      .replace("{store}", store().name)
      .replace("{order}", o.orderNumber)
      .replace("{wilaya}", o.customer.wilaya)
      .replace("{product}", o.productName)
      .replace("{total}", money(o.total));
  }

  function openPreview() {
    let m = $("#preview-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "preview-modal";
      m.style.cssText = "position:fixed;inset:0;z-index:500;display:none;align-items:center;justify-content:center;background:rgba(28,28,30,.5);backdrop-filter:blur(3px);padding:16px";
      m.innerHTML = `<div style="width:100%;max-width:940px;height:min(88vh,760px);background:#fff;border-radius:20px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 24px 80px rgba(28,28,30,.35)">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #ECECEE">
          <b style="font-size:14px">COD Landing — live preview</b>
          <div style="display:flex;gap:12px;align-items:center">
            <a href="cod-preview/index.html" target="_blank" style="font-size:13px;font-weight:700;color:#E85D0F;text-decoration:none">Open in new tab</a>
            <button id="preview-close-x" style="width:34px;height:34px;border:none;border-radius:10px;background:#F4F4F6;cursor:pointer">✕</button>
          </div>
        </div>
        <iframe src="cod-preview/index.html" style="flex:1;border:none;width:100%"></iframe>
      </div>`;
      document.body.appendChild(m);
      m.addEventListener("click", (e) => { if (e.target === m) m.style.display = "none"; });
      m.querySelector("#preview-close-x").addEventListener("click", () => { m.style.display = "none"; });
    }
    m.style.display = "flex";
  }

  function closeDrawer() {
    const sb = $("#cod-sidebar");
    if (sb) sb.classList.remove("open");
    const m = $("#cod-drawer-mask");
    if (m) m.classList.remove("show");
  }

  /* ---------------- init ---------------- */
  function init() {
    const host = document.getElementById("app-nav");
    if (host) { PL.on(() => { shell(); wire(); }); }
    else { shell(); wire(); }
  }

  if (document.readyState === "complete" || document.readyState === "interactive") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
