/* ============================================================
   PUNCHLINE ERP — AI Business Operating System (single-page).
   Plain HTML + Tailwind + vanilla JS, indigo accent.
   Multi-company (isolated per-company data), role permissions,
   immutable inventory ledger, connected ad→lead→order→shipment→
   delivery→finance→AI data model. Same /api/ai backend as the
   rest of Punchline (computed fallbacks when the backend is off).
   Core loop: KNOW → UNDERSTAND → DECIDE → EXPECTED IMPACT.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- helpers ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => Math.round(Number(n || 0)).toLocaleString("en-US");
  const money = (n) => fmt(n) + " " + (company().currency || "DZD");
  const icon = (n, s) => `<i data-lucide="${n}" style="width:${s || 16}px;height:${s || 16}px"></i>`;
  const daysAgo = (iso) => iso ? Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)) : 0;
  const fmtDate = (iso) => { if (!iso) return "—"; const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }); };
  const fmtDateTime = (iso) => { if (!iso) return "—"; const d = new Date(iso); return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); };
  const day = (n) => new Date(Date.now() - n * 86400000).toISOString();

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------- multi-tenant companies ---------------- */
  const KEY_COMPANIES = "erp.companies";
  const KEY_CURRENT = "erp.currentCompany";
  const KEY_USER = "erp.currentUser";

  const ATLAS = {
    id: "co1",
    name: "Atlas Trade SARL",
    logo: "A",
    country: "DZ",
    currency: "DZD",
    tax: { rate: 19, config: "TVA inclusive" },
    address: "Zone Industrielle, Route de Baraki",
    city: "Algiers",
    phone: "+213 21 55 66 77",
    email: "contact@atlastrade.dz",
    website: "atlastrade.dz",
    type: "Retail + Wholesale import",
    industry: "E-commerce / Fast-moving consumer goods",
    fiscalYear: "Jan–Dec",
    defaultWarehouse: "wh1",
    lang: "fr",
    timezone: "Africa/Algiers",
    createdAt: Date.now() - 200 * 86400000,
  };

  function getCompanies() {
    try { const s = JSON.parse(localStorage.getItem(KEY_COMPANIES) || "null"); if (Array.isArray(s) && s.length) return s; } catch (e) {}
    return [ATLAS];
  }
  function saveCompanies(list) { localStorage.setItem(KEY_COMPANIES, JSON.stringify(list)); }
  function company() {
    const id = localStorage.getItem(KEY_CURRENT) || ATLAS.id;
    return getCompanies().find((c) => c.id === id) || ATLAS;
  }
  function setCompany(id) { localStorage.setItem(KEY_CURRENT, id); }

  const ME = { id: "u1", name: "Ahmed", role: "Owner", email: "ahmed@atlastrade.dz" };
  function me() { try { return JSON.parse(localStorage.getItem(KEY_USER)) || ME; } catch (e) { return ME; } }
  function setMe(u) { localStorage.setItem(KEY_USER, JSON.stringify(u)); }

  /* ---------------- roles & permissions ---------------- */
  const ROLES = ["Owner", "Super Admin", "Manager", "Sales", "Purchasing", "Warehouse", "Accounting", "HR", "Customer Support", "Marketing", "Viewer"];
  const ROLE_LEVEL = { Owner: 100, "Super Admin": 90, Manager: 70, Accounting: 60, Purchasing: 60, Warehouse: 60, Sales: 50, Marketing: 50, HR: 50, "Customer Support": 50, Viewer: 10 };
  const PERMS = ["view", "create", "edit", "delete", "approve", "export", "import", "finance", "employees", "inventory", "settings"];
  const PERM_LEVEL = { view: 10, create: 50, edit: 50, delete: 50, approve: 70, export: 50, import: 60, finance: 60, employees: 60, inventory: 60, settings: 90 };
  function can(perm) {
    const lvl = ROLE_LEVEL[me().role] || 10;
    return lvl >= (PERM_LEVEL[perm] || 50);
  }

  /* ---------------- per-company collections ---------------- */
  const colKey = (name) => `erp.${company().id}.${name}`;
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

  /* ---------------- audit log ---------------- */
  function audit(action, detail, before, after) {
    const a = load("audit");
    a.unshift({ id: uid(), user: me().name, role: me().role, action, detail, before: before || null, after: after || null, at: new Date().toISOString() });
    save("audit", a.slice(0, 500));
  }

  /* ---------------- statuses ---------------- */
  const ORDER_STATUSES = ["New", "Pending Confirmation", "Confirmed", "Preparing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned", "Refunded"];
  const PO_STATUSES = ["Draft", "Pending Approval", "Approved", "Sent", "Partially Received", "Received", "Cancelled"];
  const TRANSFER_STATUSES = ["Requested", "Approved", "In Transit", "Received", "Cancelled"];
  const PIPELINE = ["Lead", "Contacted", "Qualified", "Interested", "Proposal", "Won", "Lost"];
  const EXPENSE_CATS = ["Advertising", "Shipping", "Packaging", "Rent", "Salary", "Software", "Utilities", "Supplier", "Travel", "Other"];
  const TASK_STATUSES = ["Todo", "In Progress", "Blocked", "Done"];
  const SOURCES = ["Website", "Meta", "WhatsApp", "POS", "Marketplace", "Wholesale", "Manual"];

  const orderPill = (s) => ({
    Delivered: "pill green", Confirmed: "pill green", New: "pill blue", "Pending Confirmation": "pill amber",
    Preparing: "pill sky", Shipped: "pill indigo", "Out for Delivery": "pill violet", Cancelled: "pill red",
    Returned: "pill orange", Refunded: "pill gray",
  })[s] || "pill gray";
  const poPill = (s) => ({
    Received: "pill green", Approved: "pill sky", Sent: "pill blue", "Partially Received": "pill amber",
    "Pending Approval": "pill violet", Draft: "pill gray", Cancelled: "pill red",
  })[s] || "pill gray";

  /* ---------------- demo seed ---------------- */
  function ensureSeed() {
    if (load("products").length && load("orders").length) return;
    const R = rng(11);

    const suppliers = [
      { id: "s1", name: "Guangzhou YR", contact: "Lin Wei", phone: "+86 20 1234 5678", email: "sales@yrgz.cn", address: "Yuexiu, Guangzhou", country: "CN", currency: "CNY", terms: "30% deposit / 70% before ship", products: ["p1", "p7"], totalPurchases: 412000, avgCost: 1300, deliveryTime: 26, lateDeliveries: 2, defectRate: 1.8, priceChanges: 1, outstanding: 64000, ordersCount: 6, score: { price: 8, quality: 9, reliability: 8, speed: 7, defect: 8, terms: 7 } },
      { id: "s2", name: "Shenzhen GL", contact: "Chen Yu", phone: "+86 755 3344 5566", email: "export@glsz.cn", address: "Bao'an, Shenzhen", country: "CN", currency: "CNY", terms: "LC / 50% upfront", products: ["p2", "p5", "p8"], totalPurchases: 398000, avgCost: 1750, deliveryTime: 21, lateDeliveries: 1, defectRate: 2.4, priceChanges: 3, outstanding: 51000, ordersCount: 5, score: { price: 7, quality: 8, reliability: 9, speed: 8, defect: 7, terms: 6 } },
      { id: "s3", name: "Ningbo HQ", contact: "Wang Fang", phone: "+86 574 8877 6655", email: "contact@hqnb.cn", address: "Yinzhou, Ningbo", country: "CN", currency: "CNY", terms: "T/T in advance", products: ["p3"], totalPurchases: 142000, avgCost: 620, deliveryTime: 33, lateDeliveries: 4, defectRate: 3.1, priceChanges: 2, outstanding: 18000, ordersCount: 3, score: { price: 9, quality: 6, reliability: 6, speed: 5, defect: 6, terms: 8 } },
      { id: "s4", name: "Dongguan MX", contact: "Zhao Min", phone: "+86 769 2233 4455", email: "info@mxdg.cn", address: "Dalang, Dongguan", country: "CN", currency: "CNY", terms: "Net 30", products: ["p4"], totalPurchases: 226000, avgCost: 2050, deliveryTime: 24, lateDeliveries: 1, defectRate: 1.2, priceChanges: 1, outstanding: 27000, ordersCount: 4, score: { price: 8, quality: 9, reliability: 9, speed: 8, defect: 9, terms: 9 } },
      { id: "s5", name: "Istanbul Textile", contact: "Emre Kaya", phone: "+90 212 5566 7788", email: "sales@istextile.com.tr", address: "Kadıköy, Istanbul", country: "TR", currency: "USD", terms: "30% deposit", products: ["p6"], totalPurchases: 88000, avgCost: 330, deliveryTime: 18, lateDeliveries: 0, defectRate: 0.6, priceChanges: 2, outstanding: 9000, ordersCount: 2, score: { price: 8, quality: 10, reliability: 9, speed: 9, defect: 10, terms: 8 } },
    ];
    save("suppliers", suppliers);

    const products = [
      { id: "p1", name: "Pro Chef Knife Set", sku: "KNF-100", barcode: "613000000001", category: "Kitchen", brand: "AtlasHome", description: "Set of 3 stainless steel kitchen knives.", supplierId: "s1", supplierCost: 1200, sellingPrice: 2490, wholesalePrice: 1900, discountPrice: 1990, taxRate: 19, weight: 1.4, dims: "35x12x6cm", minStock: 40, maxStock: 600, reorderLevel: 60, type: "Physical", status: "Active", stock: 340, sold: 86, returned: 9, damaged: 0, variants: [] },
      { id: "p2", name: "LED Face Mask", sku: "SKN-201", barcode: "613000000002", category: "Beauty", brand: "GlowDZ", description: "LED light therapy face mask, 7 modes.", supplierId: "s2", supplierCost: 1850, sellingPrice: 3490, wholesalePrice: 2700, discountPrice: 2990, taxRate: 19, weight: 0.42, dims: "20x18x9cm", minStock: 30, maxStock: 400, reorderLevel: 40, type: "Physical", status: "Active", stock: 210, sold: 122, returned: 17, damaged: 0, variants: [] },
      { id: "p3", name: "Car Seat Organizer", sku: "CAR-302", barcode: "613000000003", category: "Automotive", brand: "RoadKit", description: "Multipocket waterproof car organizer.", supplierId: "s3", supplierCost: 650, sellingPrice: 1490, wholesalePrice: 1100, discountPrice: 1190, taxRate: 19, weight: 0.7, dims: "48x34x8cm", minStock: 50, maxStock: 700, reorderLevel: 50, type: "Physical", status: "Active", stock: 420, sold: 64, returned: 5, damaged: 0, variants: [] },
      { id: "p4", name: "Wireless Neck Massager", sku: "HEL-403", barcode: "613000000004", category: "Health", brand: "ReliefCare", description: "Pulse + heat neck massager, 16 levels.", supplierId: "s4", supplierCost: 2100, sellingPrice: 3990, wholesalePrice: 3150, discountPrice: 3390, taxRate: 19, weight: 0.55, dims: "30x18x8cm", minStock: 25, maxStock: 300, reorderLevel: 30, type: "Physical", status: "Active", stock: 150, sold: 141, returned: 22, damaged: 0, variants: [] },
      { id: "p5", name: "Smart Watch Pro", sku: "WCH-500", barcode: "613000000005", category: "Electronics", brand: "PulseTech", description: "AMOLED fitness smartwatch.", supplierId: "s2", supplierCost: 1800, sellingPrice: 3200, wholesalePrice: 2500, discountPrice: 2790, taxRate: 19, weight: 0.3, dims: "10x4x2cm", minStock: 20, maxStock: 250, reorderLevel: 25, type: "Variable", status: "Active", stock: 190, sold: 95, returned: 8, damaged: 0, variants: [
        { id: "v1", name: "Black / 46mm", sku: "WCH-500-BLK", cost: 1800, price: 3200, stock: 120, weight: 0.3 },
        { id: "v2", name: "Silver / 44mm", sku: "WCH-500-SLV", cost: 1820, price: 3300, stock: 70, weight: 0.29 },
      ] },
      { id: "p6", name: "Essential T-Shirt", sku: "TSH-600", barcode: "613000000006", category: "Apparel", brand: "OwnLabel", description: "Cotton essential tee.", supplierId: "s5", supplierCost: 350, sellingPrice: 890, wholesalePrice: 620, discountPrice: 750, taxRate: 19, weight: 0.2, dims: "30x20x2cm", minStock: 80, maxStock: 1000, reorderLevel: 80, type: "Variable", status: "Active", stock: 520, sold: 210, returned: 12, damaged: 0, variants: [
        { id: "v3", name: "Black / M", sku: "TSH-600-BKM", cost: 350, price: 890, stock: 160, weight: 0.2 },
        { id: "v4", name: "White / L", sku: "TSH-600-WHL", cost: 350, price: 890, stock: 120, weight: 0.2 },
      ] },
      { id: "p7", name: "Espresso Hand Press", sku: "KIT-700", barcode: "613000000007", category: "Kitchen", brand: "AtlasHome", description: "Portable manual espresso maker.", supplierId: "s1", supplierCost: 1400, sellingPrice: 2690, wholesalePrice: 2050, discountPrice: 2290, taxRate: 19, weight: 0.8, dims: "22x10x9cm", minStock: 20, maxStock: 200, reorderLevel: 25, type: "Physical", status: "Active", stock: 130, sold: 41, returned: 2, damaged: 0, variants: [] },
      { id: "p8", name: "Bluetooth Speaker", sku: "AUD-800", barcode: "613000000008", category: "Electronics", brand: "PulseTech", description: "Waterproof BT speaker, 24h battery.", supplierId: "s2", supplierCost: 1100, sellingPrice: 2290, wholesalePrice: 1700, discountPrice: 1990, taxRate: 19, weight: 0.5, dims: "16x8x8cm", minStock: 30, maxStock: 350, reorderLevel: 30, type: "Physical", status: "Active", stock: 260, sold: 57, returned: 3, damaged: 0, variants: [] },
    ];
    save("products", products);

    const warehouses = [
      { id: "wh1", name: "Main Warehouse", location: "Algiers", manager: "Karim D.", status: "Active" },
      { id: "wh2", name: "Algiers Branch", location: "Bab Ezzouar", manager: "Sofiane H.", status: "Active" },
      { id: "wh3", name: "Oran Branch", location: "Oran", manager: "Lina M.", status: "Active" },
    ];
    save("warehouses", warehouses);

    /* inventory: onHand / reserved / incoming per product+warehouse */
    const inv = [];
    products.forEach((p, i) => {
      const main = Math.round(p.stock * (i % 3 === 0 ? 0.66 : 0.5));
      const b1 = Math.round((p.stock - main) * 0.7);
      const b2 = p.stock - main - b1;
      inv.push({ id: "i" + p.id + "a", productId: p.id, warehouseId: "wh1", onHand: main, reserved: Math.round(main * 0.08), incoming: i % 2 === 0 ? 60 : 0 });
      inv.push({ id: "i" + p.id + "b", productId: p.id, warehouseId: "wh2", onHand: b1, reserved: 0, incoming: 0 });
      inv.push({ id: "i" + p.id + "c", productId: p.id, warehouseId: "wh3", onHand: b2, reserved: 0, incoming: 0 });
    });
    save("inventory", inv);

    const ledger = [
      { id: "l1", date: day(40), productId: "p1", productName: "Pro Chef Knife Set", variant: "—", warehouseId: "wh1", qty: 200, before: 140, after: 340, type: "Purchase", ref: "PO-2024-018", user: "Ahmed", reason: "Container A arrival" },
      { id: "l2", date: day(25), productId: "p2", productName: "LED Face Mask", variant: "—", warehouseId: "wh1", qty: -30, before: 240, after: 210, type: "Sale", ref: "Order PL-10250", user: "system", reason: "COD delivery" },
      { id: "l3", date: day(12), productId: "p4", productName: "Wireless Neck Massager", variant: "—", warehouseId: "wh1", qty: -4, before: 154, after: 150, type: "Adjustment", ref: "Count #3", user: "Karim D.", reason: "Damaged in storage" },
      { id: "l4", date: day(6), productId: "p6", productName: "Essential T-Shirt", variant: "White / L", warehouseId: "wh2", qty: 30, before: 90, after: 120, type: "Transfer", ref: "TRF-77", user: "Sofiane H.", reason: "Restock Algiers Branch" },
      { id: "l5", date: day(2), productId: "p5", productName: "Smart Watch Pro", variant: "Black / 46mm", warehouseId: "wh1", qty: 5, before: 115, after: 120, type: "Return", ref: "RMA-12", user: "system", reason: "Customer return restock" },
      { id: "l6", date: day(1), productId: "p3", productName: "Car Seat Organizer", variant: "—", warehouseId: "wh1", qty: -12, before: 432, after: 420, type: "Sale", ref: "Order PL-10258", user: "system", reason: "COD delivery" },
    ];
    save("ledger", ledger);

    const pos = [
      { id: "po1", number: "PO-2024-018", supplierId: "s1", supplierName: "Guangzhou YR", status: "Received", currency: "CNY", warehouseId: "wh1", expectedDelivery: day(45), terms: "30/70", notes: "", items: [{ productId: "p1", name: "Pro Chef Knife Set", qty: 200, received: 200, cost: 1200 }], total: 240000, createdAt: day(60) },
      { id: "po2", number: "PO-2024-019", supplierId: "s2", supplierName: "Shenzhen GL", status: "Received", currency: "CNY", warehouseId: "wh1", expectedDelivery: day(30), terms: "LC/50", notes: "", items: [{ productId: "p2", name: "LED Face Mask", qty: 150, received: 150, cost: 1850 }, { productId: "p8", name: "Bluetooth Speaker", qty: 200, received: 200, cost: 1100 }], total: 497500, createdAt: day(42) },
      { id: "po3", number: "PO-2024-020", supplierId: "s4", supplierName: "Dongguan MX", status: "Partially Received", currency: "CNY", warehouseId: "wh1", expectedDelivery: day(8), terms: "Net 30", notes: "Second batch pending", items: [{ productId: "p4", name: "Wireless Neck Massager", qty: 100, received: 60, cost: 2100 }], total: 210000, createdAt: day(20) },
      { id: "po4", number: "PO-2024-021", supplierId: "s1", supplierName: "Guangzhou YR", status: "Sent", currency: "CNY", warehouseId: "wh1", expectedDelivery: day(-10), terms: "30/70", notes: "", items: [{ productId: "p7", name: "Espresso Hand Press", qty: 80, received: 0, cost: 1400 }], total: 112000, createdAt: day(12) },
      { id: "po5", number: "PO-2024-022", supplierId: "s5", supplierName: "Istanbul Textile", status: "Pending Approval", currency: "USD", warehouseId: "wh2", expectedDelivery: day(18), terms: "30% deposit", notes: "Replenish T-shirts", items: [{ productId: "p6", name: "Essential T-Shirt", qty: 300, received: 0, cost: 350 }], total: 105000, createdAt: day(2) },
      { id: "po6", number: "PO-2024-023", supplierId: "s3", supplierName: "Ningbo HQ", status: "Draft", currency: "CNY", warehouseId: "wh1", expectedDelivery: day(25), terms: "T/T advance", notes: "", items: [{ productId: "p3", name: "Car Seat Organizer", qty: 200, received: 0, cost: 650 }], total: 130000, createdAt: day(0) },
    ];
    save("pos", pos);

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
    save("customers", pool.map((c, i) => ({
      id: "cu" + (i + 1), name: c.name, phone: c.phone, email: "", address: c.address, city: c.city, wilaya: c.wilaya,
      orders: [3, 2, 1, 4, 2, 1, 2, 1, 1, 3, 2, 1][i],
      totalSpent: 0, aov: 0, lastPurchase: day([3, 6, 20, 2, 8, 12, 1, 15, 9, 4, 7, 5][i]),
      returns: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0][i],
      cancellations: [0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0][i],
      balance: 0, tags: [i === 0 || i === 9 ? "VIP" : i % 3 === 0 ? "Repeat" : "New"], source: SOURCES[i % SOURCES.length],
      timeline: [{ type: "Order", date: day(5), note: "PL-10250 delivered" }, { type: "Message", date: day(2), note: "WhatsApp follow-up sent" }],
    })));

    const campaigns = [
      { id: "c1", name: "UGC — Knife Set", productId: "p1", channel: "Meta", budget: 8000, spend: 6200, leads: 410, orders: 96, delivered: 74, returns: 9, revenue: 147260, status: "Active", target: "All DZ" },
      { id: "c2", name: "Discount 40% — Face Mask", productId: "p2", channel: "Meta", budget: 6000, spend: 5100, leads: 380, orders: 88, delivered: 66, returns: 12, revenue: 197340, status: "Active", target: "F 25-45" },
      { id: "c3", name: "Car Organizer Retarget", productId: "p3", channel: "Meta", budget: 5000, spend: 2800, leads: 170, orders: 52, delivered: 41, returns: 3, revenue: 48790, status: "Paused", target: "Video viewers" },
      { id: "c4", name: "Neck Massager Prospecting", productId: "p4", channel: "Meta", budget: 9000, spend: 7400, leads: 460, orders: 102, delivered: 70, returns: 15, revenue: 237300, status: "Active", target: "All DZ 25-55" },
    ];
    save("campaigns", campaigns);

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

    /* orders: [poolIdx, adIdx, status, daysAgo, qty, adCost, source] */
    const ordTpl = [
      [0, 0, "Delivered", 1, 1, 120, "Meta"], [1, 0, "Delivered", 2, 1, 160, "Meta"], [2, 0, "Shipped", 2, 2, 130, "Meta"],
      [3, 0, "Out for Delivery", 3, 1, 90, "Meta"], [4, 1, "Delivered", 3, 1, 110, "Meta"], [5, 1, "Confirmed", 4, 1, 80, "WhatsApp"],
      [6, 2, "Delivered", 1, 1, 140, "Meta"], [7, 2, "Preparing", 2, 2, 150, "Meta"], [8, 3, "Pending Confirmation", 2, 1, 100, "WhatsApp"],
      [9, 3, "Delivered", 4, 1, 120, "Meta"], [10, 4, "Delivered", 3, 1, 95, "Meta"], [11, 4, "Cancelled", 5, 1, 60, "Meta"],
      [0, 5, "Returned", 5, 1, 85, "Meta"], [1, 6, "Delivered", 1, 2, 180, "Meta"], [2, 6, "Shipped", 3, 1, 145, "Website"],
      [3, 7, "New", 0, 1, 70, "WhatsApp"], [4, 7, "Returned", 6, 1, 105, "Meta"], [5, 7, "Delivered", 2, 1, 165, "Meta"],
    ];
    const employees = [
      { id: "e1", name: "Ahmed", role: "Owner", department: "Management", phone: "0550 00 00 01", email: "ahmed@atlas.dz", salary: 0, startDate: day(400), status: "Active", stats: { orders: 0, confirms: 0, interactions: 0, tasksDone: 0 } },
      { id: "e2", name: "Karim D.", role: "Warehouse Manager", department: "Warehouse", phone: "0661 11 11 01", email: "karim@atlas.dz", salary: 68000, startDate: day(300), status: "Active", stats: { orders: 0, confirms: 0, interactions: 0, tasksDone: 14 } },
      { id: "e3", name: "Sofiane H.", role: "Warehouse", department: "Warehouse", phone: "0771 22 22 01", email: "sofiane@atlas.dz", salary: 52000, startDate: day(240), status: "Active", stats: { orders: 0, confirms: 0, interactions: 0, tasksDone: 9 } },
      { id: "e4", name: "Lina M.", role: "Confirmation Agent", department: "Sales", phone: "0552 33 33 01", email: "lina@atlas.dz", salary: 48000, startDate: day(220), status: "Active", stats: { orders: 0, confirms: 86, interactions: 310, tasksDone: 6 } },
      { id: "e5", name: "Nesrine A.", role: "Confirmation Agent", department: "Sales", phone: "0663 44 44 01", email: "nesrine@atlas.dz", salary: 48000, startDate: day(200), status: "Active", stats: { orders: 0, confirms: 74, interactions: 280, tasksDone: 5 } },
      { id: "e6", name: "Walid G.", role: "Sales Agent", department: "Sales", phone: "0774 55 55 01", email: "walid@atlas.dz", salary: 45000, startDate: day(180), status: "Active", stats: { orders: 42, confirms: 0, interactions: 190, tasksDone: 3 } },
      { id: "e7", name: "Rania F.", role: "Accountant", department: "Accounting", phone: "0555 66 66 01", email: "rania@atlas.dz", salary: 62000, startDate: day(160), status: "Active", stats: { orders: 0, confirms: 0, interactions: 0, tasksDone: 11 } },
      { id: "e8", name: "Imene R.", role: "Marketing", department: "Marketing", phone: "0666 77 77 01", email: "imene@atlas.dz", salary: 58000, startDate: day(140), status: "Active", stats: { orders: 0, confirms: 0, interactions: 120, tasksDone: 8 } },
    ];
    save("employees", employees);

    const orders = ordTpl.map((t, i) => {
      const c = pool[t[0]];
      const ad = ads[t[1]];
      const camp = campaigns.find((c2) => c2.id === ad.campaignId);
      const prod = products.find((p) => p.id === camp.productId);
      const qty = t[4];
      const price = prod.discountPrice;
      const subtotal = price * qty;
      const shipping = 450;
      const total = subtotal + shipping;
      const o = {
        id: "o" + (i + 1),
        orderNumber: "PL-" + String(10240 + i),
        customerId: "cu" + (t[0] + 1),
        customerName: c.name,
        customerPhone: c.phone,
        customerWilaya: c.wilaya,
        items: [{ productId: prod.id, name: prod.name, sku: prod.sku, qty, price, cost: prod.supplierCost }],
        subtotal, shipping, discount: 0, tax: 0, total,
        paymentMethod: "COD",
        paymentStatus: t[2] === "Delivered" ? "Paid" : "Unpaid",
        status: t[2],
        source: t[6],
        campaignId: ad.campaignId,
        adId: ad.id,
        salesAgent: ["e4", "e5"][i % 2],
        warehouseId: ["wh1", "wh2", "wh3"][i % 3],
        createdAt: day(t[3]),
        confirmedAt: t[2] === "New" || t[2] === "Pending Confirmation" ? null : day(t[3] - 1),
        shippedAt: ["Shipped", "Out for Delivery", "Delivered"].includes(t[2]) ? day(t[3] - 2) : null,
        deliveredAt: t[2] === "Delivered" ? day(t[3] - 3) : null,
        returnedAt: t[2] === "Returned" ? day(t[3] - 1) : null,
        notes: "",
      };
      o.profit = orderProfit(o);
      o.revenue = o.status === "Delivered" ? o.total : 0;
      return o;
    });
    save("orders", orders);

    const leads = pool.slice(0, 8).map((c, i) => ({
      id: "l" + (i + 1), name: c.name, phone: c.phone, source: SOURCES[i % SOURCES.length],
      campaignId: campaigns[i % 4].id, salesperson: ["e6", "e8"][i % 2], stage: PIPELINE[i],
      expectedValue: 2500 + i * 900, probability: [20, 40, 60, 70, 80, 90, 10, 50][i],
      nextAction: ["Call", "Send offer", "WhatsApp", "Follow up", "Demo", "Send invoice", "Re-qualify", "Call"] [i],
      notes: "", createdAt: day(3 + i), willClose: day(10 - i),
    }));
    save("leads", leads);

    const invoices = orders.filter((o) => o.status === "Delivered" || o.status === "Shipped").slice(0, 10).map((o, i) => ({
      id: "inv" + (i + 1), number: "INV-" + String(2200 + i), customerId: o.customerId, customerName: o.customerName,
      total: o.total, paid: i % 3 === 0 ? o.total : i % 3 === 1 ? Math.round(o.total / 2) : 0,
      status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Partially Paid" : i % 2 === 0 ? "Overdue" : "Sent",
      dueDate: day(5 + i * 2), createdAt: o.deliveredAt || o.createdAt,
    }));
    save("invoices", invoices);

    save("payments", [
      { id: "pay1", invoiceId: "inv1", customerName: "Amina B.", amount: 2940, currency: "DZD", date: day(1), method: "COD Cash", ref: "COL-118" },
      { id: "pay2", invoiceId: "inv2", customerName: "Mohamed K.", amount: 2940, currency: "DZD", date: day(2), method: "Bank transfer", ref: "VIR-5501" },
      { id: "pay3", invoiceId: "inv3", customerName: "Yacine T.", amount: 4900, currency: "DZD", date: day(3), method: "COD Cash", ref: "COL-119" },
      { id: "pay4", invoiceId: "inv4", customerName: "Sara L.", amount: 2480, currency: "DZD", date: day(1), method: "COD Cash", ref: "COL-120" },
      { id: "pay5", invoiceId: "inv6", customerName: "Lina M.", amount: 3840, currency: "DZD", date: day(2), method: "Card", ref: "CARD-332" },
      { id: "pay6", invoiceId: "inv7", customerName: "Omar S.", amount: 1650, currency: "DZD", date: day(1), method: "COD Cash", ref: "COL-121" },
      { id: "pay7", invoiceId: "inv10", customerName: "Rania F.", amount: 1650, currency: "DZD", date: day(0), method: "COD Cash", ref: "COL-122" },
      { id: "pay8", invoiceId: "inv5", customerName: "Karim D.", amount: 1650, currency: "DZD", date: day(0), method: "Online payment", ref: "WEB-981" },
    ]);

    const exps = [];
    const expTpl = [["Facebook Ads manager", "Advertising", 142000, 2], ["Boosted creatives", "Advertising", 66000, 1], ["Yalidine COD shipping", "Shipping", 84000, 1], ["Boxes + bubble wrap", "Packaging", 26000, 3], ["Warehouse rent", "Rent", 120000, 30], ["Salaries (8 staff)", "Salary", 381000, 30], ["Meta Business Suite", "Software", 12000, 10], ["Electricity + internet", "Utilities", 34000, 8], ["Supplier DDP import", "Supplier", 96000, 15], ["Courier trip Oran", "Travel", 18000, 6], ["Phone credit agents", "Other", 22000, 4], ["Stock count tools", "Other", 9000, 9]];
    expTpl.forEach((e, i) => exps.push({ id: "x" + (i + 1), title: e[0], amount: e[1], date: day(e[3]), category: e[2], warehouseId: "wh1", employeeId: "e7", notes: "", hasReceipt: i % 2 === 0 }));
    save("expenses", exps);

    save("tasks", [
      { id: "t1", title: "Confirm 14 pending COD orders", description: "Call list from confirmation queue.", employeeId: "e4", priority: "High", dueDate: day(0), status: "In Progress", related: { type: "order", id: "", name: "Confirmation queue" } },
      { id: "t2", title: "Receive PO-2024-020 partial batch", description: "60 units Neck Massager expected.", employeeId: "e2", priority: "High", dueDate: day(1), status: "Todo", related: { type: "po", id: "po3", name: "PO-2024-020" } },
      { id: "t3", title: "Reconcile Yalidine statement", description: "Match delivery fees vs ledger.", employeeId: "e7", priority: "Medium", dueDate: day(2), status: "Todo", related: { type: "", id: "", name: "Shipping" } },
      { id: "t4", title: "Send Oran branch transfer", description: "Move 60 knives to Oran.", employeeId: "e3", priority: "Medium", dueDate: day(1), status: "Blocked", related: { type: "product", id: "p1", name: "Pro Chef Knife Set" } },
      { id: "t5", title: "Draft Q3 ad budget realloc", description: "Move spend from c3 to c1.", employeeId: "e8", priority: "Low", dueDate: day(4), status: "Todo", related: { type: "campaign", id: "c3", name: "Car Organizer Retarget" } },
      { id: "t6", title: "Approve PO-2024-022", description: "T-shirt replenishment from Istanbul.", employeeId: "e1", priority: "High", dueDate: day(0), status: "Todo", related: { type: "po", id: "po5", name: "PO-2024-022" } },
      { id: "t7", title: "Chase overdue INV-2204", description: "Nesrine A. invoice 14 days overdue.", employeeId: "e5", priority: "Medium", dueDate: day(1), status: "In Progress", related: { type: "invoice", id: "inv4", name: "INV-2204" } },
      { id: "t8", title: "Audit returned stock restock", description: "Verify RMA restock hit ledger.", employeeId: "e2", priority: "Low", dueDate: day(3), status: "Done", related: { type: "", id: "", name: "Inventory" } },
    ]);

    save("notifications", [
      { id: "n1", type: "stock", title: "Low stock — Wireless Neck Massager", body: "Available 133 units, below reorder level 30 in Main Warehouse.", date: day(0), read: false, link: "inventory" },
      { id: "n2", type: "order", title: "New COD order PL-10257", body: "Sara L. · LED Face Mask — pending confirmation.", date: day(0), read: false, link: "orders" },
      { id: "n3", type: "finance", title: "INV-2204 overdue", body: "Nesrine A. · 14 days overdue · 2,480 DZD.", date: day(1), read: false, link: "invoices" },
      { id: "n4", type: "purchase", title: "PO-2024-021 expected late", body: "Guangzhou YR shipment is 10 days late.", date: day(1), read: false, link: "purchasing" },
      { id: "n5", type: "ai", title: "AI alert — Ad efficiency drop", body: "Campaign c3 ROAS below 1.0. Consider pausing.", date: day(2), read: true, link: "marketing" },
      { id: "n6", type: "task", title: "Task due today — confirm 14 orders", body: "Assigned to Lina M.", date: day(0), read: false, link: "tasks" },
    ]);

    save("settings", {
      modules: { inventory: true, purchasing: true, warehouse: true, crm: true, cod: true, marketing: true, employees: true, finance: true },
      thresholds: { lowStock: 1, deadDays: 60, slowDays: 30, overstockDays: 90 },
      negativeInventory: false,
      alerts: { lowStock: true, newOrder: true, overdueInvoice: true, return: true, aiAlert: true },
    });

    save("users", [
      { id: "u1", name: "Ahmed", email: "ahmed@atlas.dz", role: "Owner" },
      { id: "u2", name: "Rania F.", email: "rania@atlas.dz", role: "Accounting" },
      { id: "u3", name: "Walid G.", email: "walid@atlas.dz", role: "Sales" },
      { id: "u4", name: "Karim D.", email: "karim@atlas.dz", role: "Warehouse" },
      { id: "u5", name: "Imene R.", email: "imene@atlas.dz", role: "Marketing" },
    ]);

    /* audit trail */
    save("audit", [
      { id: "a1", user: "Ahmed", role: "Owner", action: "Stock adjusted", detail: "Neck Massager −4 (damaged, Count #3)", before: { onHand: 154 }, after: { onHand: 150 }, at: day(12) },
      { id: "a2", user: "Rania F.", role: "Accounting", action: "Payment recorded", detail: "INV-2201 paid 2,940 DZD (COD Cash)", before: null, after: { paid: 2940 }, at: day(1) },
      { id: "a3", user: "Ahmed", role: "Owner", action: "Price changed", detail: "Smart Watch Pro 3,300 → 3,200", before: { price: 3300 }, after: { price: 3200 }, at: day(15) },
      { id: "a4", user: "Imene R.", role: "Marketing", action: "Campaign created", detail: "Neck Massager Prospecting", before: null, after: { campaign: "c4" }, at: day(30) },
      { id: "a5", user: "Walid G.", role: "Sales", action: "Lead won", detail: "Proposal → Won (Sara L.)", before: { stage: "Proposal" }, after: { stage: "Won" }, at: day(6) },
      { id: "a6", user: "Ahmed", role: "Owner", action: "Invoice cancelled", detail: "INV-2211 cancelled", before: { status: "Sent" }, after: { status: "Cancelled" }, at: day(8) },
    ]);
  }

  function orderProfit(o) {
    if (o.status !== "Delivered") return 0;
    const cost = (o.items || []).reduce((s, it) => s + it.cost * it.qty, 0);
    const pkg = (o.items || []).reduce((s, it) => s + it.qty * 60, 0);
    return o.total - cost - o.shipping - pkg - (o.adCost || 0);
  }

  /* ---------------- aggregation ---------------- */
  function stockFor(productId) {
    const inv = load("inventory");
    const rows = inv.filter((i) => i.productId === productId);
    return {
      onHand: rows.reduce((s, r) => s + r.onHand, 0),
      reserved: rows.reduce((s, r) => s + r.reserved, 0),
      incoming: rows.reduce((s, r) => s + r.incoming, 0),
      available: rows.reduce((s, r) => s + r.onHand - r.reserved, 0),
    };
  }

  function agg() {
    const products = load("products");
    const orders = load("orders");
    const expenses = load("expenses");
    const invoices = load("invoices");
    const payments = load("payments");
    const suppliers = load("suppliers");
    const campaigns = load("campaigns");
    const employees = load("employees");

    const delivered = orders.filter((o) => o.status === "Delivered");
    const revenue = delivered.reduce((s, o) => s + o.total, 0);
    const cogs = delivered.reduce((s, o) => s + (o.items || []).reduce((x, it) => x + it.cost * it.qty, 0), 0);
    const shipCost = delivered.reduce((s, o) => s + o.shipping, 0);
    const pkgCost = delivered.reduce((s, o) => s + (o.items || []).reduce((x, it) => x + it.qty * 60, 0), 0);
    const adSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const gross = revenue - cogs - shipCost - pkgCost;
    const expTotal = expenses.reduce((s, e) => s + e.amount, 0);
    const net = gross - expTotal;
    const orderCount = orders.length;
    const pending = orders.filter((o) => ["New", "Pending Confirmation", "Confirmed", "Preparing", "Shipped", "Out for Delivery"].includes(o.status)).length;
    const cancelled = orders.filter((o) => o.status === "Cancelled").length;
    const returned = orders.filter((o) => o.status === "Returned").length;

    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
    const todayDelivered = orders.filter((o) => o.status === "Delivered" && new Date(o.deliveredAt).toDateString() === today);
    const todayRevenue = todayDelivered.reduce((s, o) => s + o.total, 0);
    const todayProfit = todayDelivered.reduce((s, o) => s + (o.profit || 0), 0);

    const lowStock = products.filter((p) => stockFor(p.id).available <= p.reorderLevel);
    const outOfStock = products.filter((p) => stockFor(p.id).available <= 0);
    const inventoryValue = products.reduce((s, p) => s + stockFor(p.id).onHand * p.supplierCost, 0);

    const receivables = invoices.reduce((s, i) => s + (i.total - i.paid), 0);
    const payables = suppliers.reduce((s, sp) => s + sp.outstanding, 0);
    const cash = payments.reduce((s, p) => s + p.amount, 0) - expTotal;

    const confirmed = orders.filter((o) => ["Confirmed", "Preparing", "Shipped", "Out for Delivery", "Delivered"].includes(o.status)).length;
    const confirmationRate = orderCount ? (confirmed / orderCount) * 100 : 0;
    const deliveryRate = confirmed ? (delivered.length / confirmed) * 100 : 0;
    const returnRate = delivered.length ? (returned / delivered.length) * 100 : 0;
    const profitPerDelivered = delivered.length ? delivered.reduce((s, o) => s + (o.profit || 0), 0) / delivered.length : 0;
    const aov = delivered.length ? revenue / delivered.length : 0;

    const topProducts = products.map((p) => {
      const oo = orders.filter((o) => (o.items || []).some((it) => it.productId === p.id));
      const dd = oo.filter((o) => o.status === "Delivered");
      const rv = dd.reduce((s, o) => s + o.total, 0);
      const pf = dd.reduce((s, o) => s + (o.profit || 0), 0);
      return { ...p, orders: oo.length, delivered: dd.length, revenue: rv, profit: pf, st: stockFor(p.id) };
    }).sort((a, b) => b.profit - a.profit);

    const customers = load("customers").map((c) => {
      const oo = orders.filter((o) => o.customerId === c.id);
      const dd = oo.filter((o) => o.status === "Delivered");
      const spent = dd.reduce((s, o) => s + o.total, 0);
      const a = dd.length ? spent / dd.length : 0;
      c.orders = oo.length; c.delivered = dd.length; c.totalSpent = spent; c.aov = a;
      return c;
    }).sort((a, b) => b.totalSpent - a.totalSpent);

    const funnel = [
      { label: "Leads", value: orders.length + load("leads").length },
      { label: "Orders", value: orderCount },
      { label: "Confirmed", value: confirmed },
      { label: "Shipped", value: orders.filter((o) => ["Shipped", "Out for Delivery", "Delivered"].includes(o.status)).length },
      { label: "Delivered", value: delivered.length },
    ];
    const funnelConv = funnel.slice(0, -1).map((f, i) => ({ rate: f.value ? (funnel[i + 1].value / f.value) * 100 : 0 }));

    /* date-filtered series (last 14 days) */
    const days = [];
    for (let i = 13; i >= 0; i--) { const d = new Date(Date.now() - i * 86400000); days.push(d.toDateString()); }
    const revSeries = days.map((d) => delivered.filter((o) => new Date(o.deliveredAt).toDateString() === d).reduce((s, o) => s + o.total, 0));
    const profitSeries = days.map((d) => delivered.filter((o) => new Date(o.deliveredAt).toDateString() === d).reduce((s, o) => s + (o.profit || 0), 0));
    const orderSeries = days.map((d) => orders.filter((o) => new Date(o.createdAt).toDateString() === d).length);
    const cashInSeries = days.map((d) => payments.filter((p) => new Date(p.date).toDateString() === d).reduce((s, p) => s + p.amount, 0));
    const cashOutSeries = days.map((d) => expenses.filter((e) => new Date(e.date).toDateString() === d).reduce((s, e) => s + e.amount, 0));
    const expByCat = EXPENSE_CATS.map((c) => ({ cat: c, val: expenses.filter((e) => e.category === c).reduce((s, e) => s + e.amount, 0) })).filter((c) => c.val > 0);

    return {
      kpis: { revenue, cogs, gross, net, expTotal, adSpend, orderCount, delivered: delivered.length, pending, cancelled, returned, lowStock: lowStock.length, outOfStock: outOfStock.length, inventoryValue, receivables, payables, cash, confirmationRate, deliveryRate, returnRate, profitPerDelivered, aov },
      today: { revenue: todayRevenue, orders: todayOrders.length, profit: todayProfit, pending, lowStock: lowStock.length, outstanding: receivables + payables },
      products, orders, expenses, invoices, payments, suppliers, campaigns, employees, customers,
      pos: load("pos"), lowStock, outOfStock, topProducts,
      funnel, funnelConv,
      revSeries, profitSeries, orderSeries, cashInSeries, cashOutSeries, expSeries: cashOutSeries, expByCat, days,
    };
  }

  /* ---------------- charts ---------------- */
  const charts = {};
  function mkChart(id, cfg) {
    const cv = document.getElementById(id);
    if (!cv || typeof Chart === "undefined") return;
    if (charts[id]) { charts[id].destroy(); delete charts[id]; }
    charts[id] = new Chart(cv, cfg);
  }
  const C = { line: "#4f46e5", green: "#0fa05a", red: "#d32f2f", amber: "#f5b301", gray: "#c7c9d1" };

  /* ---------------- global state ---------------- */
  const state = { section: "dashboard", range: "30", q: "" };

  /* ---------------- shell ---------------- */
  function shell() {
    ensureSeed();
    $("#erp-sidebar").innerHTML = sidebarHTML(state.section) + `<div class="erp-sidebar-foot">${esc(company().name)} · ERP OS v1.0<br>${esc(me().name)} — ${esc(me().role)} · demo data</div>`;
    $("#erp-topbar").innerHTML = topbarHTML();
    $("#erp-content").innerHTML = S[state.section]();
    mount(state.section);
    if (window.lucide) lucide.createIcons();
    PL_API.detect().then((on) => {
      const b = $("#erp-backend");
      if (b) { b.textContent = on ? "AI connected" : "AI demo mode"; b.className = on ? "pill green" : "pill amber"; }
    });
    closeDrawer();
  }

  function sidebarHTML(active) {
    const groups = [
      { label: "OVERVIEW", items: ["dashboard", "analytics", "reports", "advisor"] },
      { label: "COMMERCE", items: ["products", "inventory", "warehouses", "purchasing", "suppliers"] },
      { label: "SALES", items: ["sales", "orders", "cod", "shipping", "returns", "customers", "crm"] },
      { label: "FINANCE", items: ["invoices", "payments", "expenses", "finance"] },
      { label: "PEOPLE", items: ["employees", "tasks"] },
      { label: "GROWTH", items: ["marketing", "ads"] },
      { label: "SYSTEM", items: ["settings"] },
    ];
    const S = {
      dashboard: ["Dashboard", "layout-dashboard"], analytics: ["Analytics", "chart-column"], reports: ["Reports", "file-text"], advisor: ["AI Advisor", "sparkles"],
      products: ["Products", "package"], inventory: ["Inventory", "boxes"], warehouses: ["Warehouses", "warehouse"],
      purchasing: ["Purchasing", "shopping-basket"], suppliers: ["Suppliers", "truck"],
      sales: ["Sales", "handshake"], orders: ["Orders", "shopping-cart"], cod: ["COD", "banknote"], shipping: ["Shipping", "truck"],
      returns: ["Returns", "rotate-ccw"], customers: ["Customers", "users"], crm: ["CRM", "contact"],
      invoices: ["Invoices", "receipt-text"], payments: ["Payments", "credit-card"], expenses: ["Expenses", "wallet"], finance: ["Finance", "bar-chart-3"],
      employees: ["Employees", "user-circle"], tasks: ["Tasks", "checklist"],
      marketing: ["Marketing", "megaphone"], ads: ["Ads Manager", "target"], settings: ["Settings", "settings"],
    };
    const notifs = load("notifications").filter((n) => !n.read).length;
    return groups.map((g) => `
      <div class="erp-side-label">${g.label}</div>
      ${g.items.map((id) => {
        const [name, ic] = S[id];
        const b = id === "orders" && pendingBadge() ? `<span class="erp-badge">${pendingBadge()}</span>` : (id === "advisor" && notifs ? `<span class="erp-badge">${notifs}</span>` : "");
        return `<button class="erp-nav-item${active === id ? " active" : ""}" data-nav="${id}">${icon(ic, 17)}<span>${name}</span>${b}</button>`;
      }).join("")}
    `).join("");
  }
  function pendingBadge() {
    return load("orders").filter((o) => ["New", "Pending Confirmation"].includes(o.status)).length || "";
  }

  function topbarHTML() {
    const cos = getCompanies();
    const co = company();
    return `
      <button class="erp-hamburger" id="erp-burger">${icon("menu", 19)}</button>
      <div class="erp-search">
        ${icon("search", 15)}
        <input id="erp-global-search" placeholder="Search products, orders, customers, SKUs, phones… (Ctrl+K)">
      </div>
      <div class="flex items-center gap-2 flex-1"></div>
      <a href="cod.html" class="erp-btn ghost" title="Back to COD OS">${icon("arrow-left-right", 15)} COD OS</a>
      <select class="erp-select" id="company-switch" title="Switch company (multi-tenant)">
        ${cos.map((c) => `<option value="${c.id}"${c.id === co.id ? " selected" : ""}>${esc(c.name)} (${c.currency})</option>`).join("")}
        <option value="__new">+ New company…</option>
      </select>
      <button class="erp-btn ghost" id="erp-bell" data-action="open-notifications">${icon("bell", 16)}<span class="erp-badge" style="margin-left:2px">${load("notifications").filter((n) => !n.read).length || ""}</span></button>
      <button class="erp-btn ghost" id="erp-user-btn" data-action="open-user">${icon("user-circle", 16)} ${esc(me().name)}</button>
      <span class="pill gray" id="erp-backend-pill">…</span>`;
  }

  /* ---------------- modals / toasts / drawer ---------------- */
  let modalStack = 0;
  function openModal(html, wide) {
    let m = $("#erp-modal");
    if (!m) {
      m = document.createElement("div");
      m.id = "erp-modal";
      document.body.appendChild(m);
    }
    m.innerHTML = `<div class="erp-modal-panel${wide ? " erp-modal-wide" : ""}">${html}</div>`;
    m.classList.add("open");
    modalStack++;
    if (window.lucide) lucide.createIcons();
  }
  function closeModal() { const m = $("#erp-modal"); if (m) { m.classList.remove("open"); m.innerHTML = ""; } modalStack = 0; }

  function toast(msg, type) {
    let box = $("#erp-toasts");
    if (!box) { box = document.createElement("div"); box.id = "erp-toasts"; document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "erp-toast" + (type ? " " + type : "");
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3600);
  }

  function closeDrawer() {
    const sb = $("#erp-sidebar");
    if (sb) sb.classList.remove("open");
    const m = $("#erp-drawer-mask");
    if (m) m.classList.remove("show");
  }

  /* ---------------- module registry ---------------- */
  const S = {
    dashboard: S_dashboard, analytics: S_analytics, reports: S_reports, advisor: S_advisor,
    products: S_products, inventory: S_inventory, warehouses: S_warehouses, purchasing: S_purchasing,
    suppliers: S_suppliers, sales: S_sales, orders: S_orders, cod: S_cod, shipping: S_shipping,
    returns: S_returns, customers: S_customers, crm: S_crm, invoices: S_invoices, payments: S_payments,
    expenses: S_expenses, finance: S_finance, employees: S_employees, tasks: S_tasks,
    marketing: S_marketing, ads: S_ads, settings: S_settings,
  };

  function mount(sec) {
    try { if (MOUNT[sec]) MOUNT[sec](); } catch (e) { console.error("mount", sec, e); }
  }
  const MOUNT = {};

  /* ---------------- date ranges ---------------- */
  function rangeWindow() {
    const now = new Date();
    const today0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    switch (state.range) {
      case "today": return [today0.getTime(), now.getTime()];
      case "yesterday": return [today0.getTime() - 86400000, today0.getTime()];
      case "7": return [today0.getTime() - 6 * 86400000, now.getTime()];
      case "month": return [new Date(now.getFullYear(), now.getMonth(), 1).getTime(), now.getTime()];
      case "lastmonth": return [new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime(), new Date(now.getFullYear(), now.getMonth(), 1).getTime()];
      case "year": return [new Date(now.getFullYear(), 0, 1).getTime(), now.getTime()];
      default: return [today0.getTime() - 29 * 86400000, now.getTime()];
    }
  }
  function inRange(iso) { if (!iso) return false; const t = new Date(iso).getTime(); const w = rangeWindow(); return t >= w[0] && t <= w[1]; }
  function rangeLabel() { return { today: "Today", yesterday: "Yesterday", 7: "Last 7 days", 30: "Last 30 days", month: "This month", lastmonth: "Last month", year: "This year" }[state.range] || "Last 30 days"; }

  /* ---------------- dashboard ---------------- */
  function S_dashboard() {
    const a = agg();
    const k = a.kpis;
    const per = a.orders.filter((o) => inRange(o.createdAt));
    const perDel = per.filter((o) => o.status === "Delivered");
    const perRev = perDel.reduce((s, o) => s + o.total, 0);
    const perProfit = perDel.reduce((s, o) => s + (o.profit || 0), 0);
    const perExp = a.expenses.filter((e) => inRange(e.date)).reduce((s, e) => s + e.amount, 0);
    const h = healthScore(a);
    const s1 = summaryLocal(a);
    return `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <div class="erp-title text-[22px]">${greeting()} 👋</div>
        <div class="text-[12.5px] text-[#9A9AA2] mt-0.5">Here is what is happening in ${esc(company().name)} today.</div>
      </div>
      <select class="erp-select" id="range-switch" title="Date range">
        ${["today", "yesterday", "7", "30", "month", "lastmonth", "year"].map((r) => `<option value="${r}"${state.range === r ? " selected" : ""}>${rangeLabel()}</option>`).join("")}
      </select>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div class="kpi hot"><div class="kpi-lbl">💰 Revenue (${rangeLabel()})</div><div class="kpi-num">${money(perRev)}</div><div class="kpi-lbl">${fmt(perDel.length)} delivered orders</div></div>
      <div class="kpi"><div class="kpi-lbl">📈 Net profit</div><div class="kpi-num">${money(perProfit)}</div><div class="kpi-lbl">vs expenses ${money(perExp)}</div></div>
      <div class="kpi"><div class="kpi-lbl">🧾 Orders (${rangeLabel()})</div><div class="kpi-num">${fmt(per.length)}</div><div class="kpi-lbl">${fmt(k.pending)} pending · ${fmt(k.cancelled)} cancelled</div></div>
      <div class="kpi"><div class="kpi-lbl">📦 Low stock</div><div class="kpi-num">${fmt(k.lowStock)}</div><div class="kpi-lbl">${fmt(k.outOfStock)} out of stock</div></div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
      <div class="kpi"><div class="kpi-lbl">Revenue (all time)</div><div class="kpi-num text-[19px]">${money(k.revenue)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Gross profit</div><div class="kpi-num text-[19px]">${money(k.gross)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Inventory value</div><div class="kpi-num text-[19px]">${money(k.inventoryValue)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Receivables</div><div class="kpi-num text-[19px] text-[#C93A3F]">${money(k.receivables)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Payables</div><div class="kpi-num text-[19px] text-[#B98A1F]">${money(k.payables)}</div></div>
    </div>

    <div class="ai-band mt-4">
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2"><span class="icon-tile green-soft">${icon("sparkles", 18)}</span><div><div class="card-title">AI BUSINESS SUMMARY</div><div class="card-sub">What is going well · wrong · biggest risk · opportunity · what needs attention</div></div></div>
        <button class="erp-btn primary" id="erp-summary-run">${icon("zap", 15)} Run AI summary</button>
      </div>
      <div id="erp-summary-out" class="mt-3">${summaryHTML(s1, true)}</div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
      <div class="kpi"><div class="kpi-lbl">Today's revenue</div><div class="kpi-num text-[18px]">${money(a.today.revenue)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Today's orders</div><div class="kpi-num text-[18px]">${fmt(a.today.orders)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Today's profit</div><div class="kpi-num text-[18px]">${money(a.today.profit)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Cash balance</div><div class="kpi-num text-[18px]">${money(k.cash)}</div></div>
      <div class="kpi"><div class="kpi-lbl">AI Health Score</div><div class="kpi-num text-[18px]"><span style="color:${h.color}">${h.value}/100</span></div><div class="kpi-lbl">Internal analytical score</div></div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("trending-up", 18)}</span><div><div class="card-title">Revenue & profit</div><div class="card-sub">Last 14 days</div></div></div><canvas id="ch-rev" height="220"></canvas></div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("shopping-cart", 18)}</span><div><div class="card-title">Orders per day</div><div class="card-sub">Last 14 days</div></div></div><canvas id="ch-ord" height="220"></canvas></div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("wallet", 18)}</span><div><div class="card-title">Expenses by category</div><div class="card-sub">All time</div></div></div><canvas id="ch-exp" height="220"></canvas></div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("bar-chart-3", 18)}</span><div><div class="card-title">Cash flow in / out</div><div class="card-sub">Last 14 days</div></div></div><canvas id="ch-cash" height="220"></canvas></div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("warehouse", 18)}</span><div><div class="card-title">Inventory value by warehouse</div><div class="card-sub">Cost value</div></div></div><canvas id="ch-inv" height="220"></canvas></div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("activity", 18)}</span><div><div class="card-title">COD funnel</div><div class="card-sub">Leads → orders → delivered</div></div></div>
        <div class="space-y-2 mt-2">${a.funnel.map((f, i) => `
          <div class="funnel-row">
            <span class="text-[12px] font-bold text-[#6B6B73]">${f.label}</span>
            <div class="h-[22px] rounded-lg overflow-hidden" style="background:#F1F0EE"><div class="funnel-bar" style="width:${Math.max(2, (f.value / a.funnel[0].value) * 100)}%">${fmt(f.value)}</div></div>
            <span class="text-[12px] font-bold text-right">${a.funnelConv[i] ? a.funnelConv[i].rate.toFixed(0) + "%" : "—"}</span>
          </div>`).join("")}</div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("package", 18)}</span><div><div class="card-title">Top products</div><div class="card-sub">By profit</div></div></div>
        <div class="space-y-3 mt-2">${a.topProducts.slice(0, 5).map((p) => `
          <button class="w-full text-left" data-action="open-product" data-id="${p.id}">
            <div class="flex justify-between items-center gap-2"><span class="text-[13px] font-bold truncate">${esc(p.name)}</span><b class="${p.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(p.profit)}</b></div>
            <div class="flex justify-between text-[11.5px] text-[#9A9AA2] mt-1"><span>${fmt(p.delivered)} delivered · ${money(p.revenue)}</span><span>${fmt(p.st.available)} in stock</span></div>
          </button>`).join("")}</div>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("users", 18)}</span><div><div class="card-title">Top customers</div><div class="card-sub">By lifetime spend</div></div></div>
        <div class="space-y-3 mt-2">${a.customers.slice(0, 5).map((c) => `
          <button class="w-full text-left" data-action="open-customer" data-id="${c.id}">
            <div class="flex justify-between items-center gap-2"><span class="text-[13px] font-bold truncate">${esc(c.name)}</span><b>${money(c.totalSpent)}</b></div>
            <div class="flex justify-between text-[11.5px] text-[#9A9AA2] mt-1"><span>${fmt(c.delivered)} orders · AOV ${money(c.aov)}</span><span class="pill ${c.orders >= 3 ? "indigo" : "gray"}">${c.tags.join(", ")}</span></div>
          </button>`).join("")}</div>
      </div>
      <div class="card">
        <div class="card-head"><span class="icon-tile green-soft">${icon("truck", 18)}</span><div><div class="card-title">Suppliers</div><div class="card-sub">Outstanding balances</div></div></div>
        <div class="space-y-3 mt-2">${a.suppliers.slice(0, 5).map((s) => `
          <button class="w-full text-left" data-action="open-supplier" data-id="${s.id}">
            <div class="flex justify-between items-center gap-2"><span class="text-[13px] font-bold truncate">${esc(s.name)}</span><b class="text-[#B98A1F]">${money(s.outstanding)}</b></div>
            <div class="flex justify-between text-[11.5px] text-[#9A9AA2] mt-1"><span>${s.ordersCount} orders · ${s.deliveryTime}d avg</span><span class="risk ${s.lateDeliveries > 3 ? "high" : s.lateDeliveries > 1 ? "medium" : "low"}">${s.lateDeliveries} late</span></div>
          </button>`).join("")}</div>
      </div>
    </div>`;
  }

  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }

  function healthScore(a) {
    const k = a.kpis;
    const margin = k.revenue ? Math.max(0, Math.min(100, (k.gross / k.revenue) * 100 * 3)) : 40;
    const sales = Math.min(100, (k.delivered / 70) * 100);
    const cash = Math.min(100, (k.cash / 300000) * 100 + 40);
    const inv = Math.max(0, Math.min(100, 100 - (k.lowStock / 3) * 40 - (k.outOfStock / 2) * 50));
    const retention = Math.max(0, Math.min(100, 100 - k.returnRate * 3 - k.cancelled * 1.5));
    const suppliers = Math.max(0, Math.min(100, 100 - a.suppliers.reduce((s, x) => s + x.lateDeliveries, 0) * 12));
    const operations = Math.max(0, Math.min(100, 100 - a.orders.filter((o) => ["New", "Pending Confirmation"].includes(o.status)).length * 4));
    const marketing = Math.min(100, Math.max(0, (k.gross + k.net) / k.revenue ? 100 - (k.expTotal / (k.revenue || 1)) * 120 : 50));
    const value = Math.round((margin + sales + cash + inv + retention + suppliers + operations + marketing) / 8);
    return { value, color: value >= 70 ? "#0fa05a" : value >= 45 ? "#f5b301" : "#d32f2f", parts: { margin, sales, cash, inv, retention, suppliers, operations, marketing } };
  }

  MOUNT.dashboard = () => {
    const a = agg();
    const lbl = a.days.map((d) => d.slice(4, 10));
    mkChart("ch-rev", { type: "line", data: { labels: lbl, datasets: [
      { label: "Revenue", data: a.revSeries, borderColor: C.line, backgroundColor: "rgba(79,70,229,.12)", fill: true, tension: .35, pointRadius: 2 },
      { label: "Profit", data: a.profitSeries, borderColor: C.green, backgroundColor: "rgba(15,160,90,.1)", fill: true, tension: .35, pointRadius: 2 },
    ]}, options: { plugins: { legend: { labels: { boxWidth: 10, font: { size: 11 } } } }, scales: { y: { ticks: { callback: (v) => fmt(v) }, grid: { color: "#f2f2f5" } }, x: { grid: { display: false } } } } });
    mkChart("ch-ord", { type: "bar", data: { labels: lbl, datasets: [{ label: "Orders", data: a.orderSeries, backgroundColor: C.line, borderRadius: 6 }]}, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { precision: 0 }, grid: { color: "#f2f2f5" } }, x: { grid: { display: false } } } } });
    mkChart("ch-exp", { type: "doughnut", data: { labels: a.expByCat.map((e) => e.cat), datasets: [{ data: a.expByCat.map((e) => e.val), backgroundColor: [C.line, C.amber, C.green, C.red, "#8b7dff", "#14b8a6", "#f472b6", "#fb923c", "#64748b", "#a3a3a3"] }] }, options: { plugins: { legend: { position: "right", labels: { boxWidth: 10, font: { size: 11 } } } } } });
    mkChart("ch-cash", { type: "bar", data: { labels: lbl, datasets: [
      { label: "Cash in", data: a.cashInSeries, backgroundColor: C.green, borderRadius: 5 },
      { label: "Cash out", data: a.cashOutSeries.map((v) => -v), backgroundColor: C.red, borderRadius: 5 },
    ]}, options: { plugins: { legend: { labels: { boxWidth: 10, font: { size: 11 } } } }, scales: { y: { ticks: { callback: (v) => fmt(Math.abs(v)) }, grid: { color: "#f2f2f5" } }, x: { grid: { display: false } } } } });
    const invByWh = load("warehouses").map((w) => ({ name: w.name.split(" ")[0], val: load("inventory").filter((i) => i.warehouseId === w.id).reduce((s, i) => s + i.onHand * (load("products").find((p) => p.id === i.productId) || {}).supplierCost || 0, 0) }));
    mkChart("ch-inv", { type: "bar", data: { labels: invByWh.map((w) => w.name), datasets: [{ label: "Inventory value", data: invByWh.map((w) => w.val), backgroundColor: [C.line, "#8b7dff", "#c7c9d1"], borderRadius: 6 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => fmt(v) }, grid: { color: "#f2f2f5" } }, x: { grid: { display: false } } } } });
  };

  /* ---------------- analytics ---------------- */
  function S_analytics() {
    const a = agg();
    const k = a.kpis;
    const bySrc = {};
    a.orders.forEach((o) => { bySrc[o.source] = bySrc[o.source] || { orders: 0, delivered: 0, revenue: 0, profit: 0 }; bySrc[o.source].orders++; if (o.status === "Delivered") { bySrc[o.source].delivered++; bySrc[o.source].revenue += o.total; bySrc[o.source].profit += o.profit; } });
    const byWh = load("warehouses").map((w) => {
      const oo = a.orders.filter((o) => o.warehouseId === w.id);
      return { name: w.name, orders: oo.length, delivered: oo.filter((o) => o.status === "Delivered").length, revenue: oo.filter((o) => o.status === "Delivered").reduce((s, o) => s + o.total, 0) };
    });
    return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="kpi hot"><div class="kpi-lbl">Confirmation rate</div><div class="kpi-num">${k.confirmationRate.toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-lbl">Delivery rate</div><div class="kpi-num">${k.deliveryRate.toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-lbl">Return rate</div><div class="kpi-num">${k.returnRate.toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-lbl">Profit / delivered</div><div class="kpi-num">${money(k.profitPerDelivered)}</div></div>
    </div>
    <div class="grid lg:grid-cols-2 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("handshake", 18)}</span><div><div class="card-title">Sales by channel</div><div class="card-sub">Profit per source</div></div></div>
        <div class="cod-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Channel</th><th>Orders</th><th>Delivered</th><th>Revenue</th><th>Profit</th></tr></thead>
        <tbody>${Object.entries(bySrc).map(([src, v]) => `<tr><td><b>${esc(src)}</b></td><td>${v.orders}</td><td>${v.delivered}</td><td>${fmt(v.revenue)}</td><td class="font-bold ${v.profit >= 0 ? "text-[#0FA05A]" : "text-[#C93A3F]"}">${money(v.profit)}</td></tr>`).join("")}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("warehouse", 18)}</span><div><div class="card-title">Performance by warehouse</div><div class="card-sub">Orders & revenue</div></div></div>
        <div class="cod-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Warehouse</th><th>Orders</th><th>Delivered</th><th>Revenue</th></tr></thead>
        <tbody>${byWh.map((w) => `<tr><td><b>${esc(w.name)}</b></td><td>${w.orders}</td><td>${w.delivered}</td><td>${money(w.revenue)}</td></tr>`).join("")}</tbody></table></div>
      </div>
    </div>
    <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("chart-column", 18)}</span><div><div class="card-title">14-day trends</div><div class="card-sub">Revenue, orders, profit</div></div></div>
      <canvas id="ch-an" height="240"></canvas>
    </div>`;
  }
  MOUNT.analytics = () => {
    const a = agg();
    const lbl = a.days.map((d) => d.slice(4, 10));
    mkChart("ch-an", { type: "line", data: { labels: lbl, datasets: [
      { label: "Revenue", data: a.revSeries, borderColor: C.line, tension: .35, pointRadius: 2 },
      { label: "Orders", data: a.orderSeries, borderColor: C.amber, tension: .35, pointRadius: 2, yAxisID: "y1" },
      { label: "Profit", data: a.profitSeries, borderColor: C.green, tension: .35, pointRadius: 2 },
    ]}, options: { plugins: { legend: { labels: { boxWidth: 10, font: { size: 11 } } } }, scales: { y: { ticks: { callback: (v) => fmt(v) }, grid: { color: "#f2f2f5" } }, y1: { position: "right", ticks: { precision: 0 }, grid: { display: false } }, x: { grid: { display: false } } } } });
  };

  /* ---------------- AI local engines (computed, no hallucination) ---------------- */
  function summaryLocal(a) {
    const k = a.kpis;
    const good = [];
    const bad = [];
    const risk = [];
    const opp = [];
    const att = [];
    if (k.delivered) { good.push("Sales are flowing — " + k.delivered + " delivered orders and " + money(k.revenue) + " collected."); }
    if (k.gross > 0) { good.push("Gross margin " + (k.revenue ? ((k.gross / k.revenue) * 100).toFixed(0) : 0) + "% across all delivered orders."); }
    const best = a.topProducts[0];
    if (best && best.profit > 0) { good.push("Best product: " + best.name + " at " + money(best.profit) + " profit."); opp.push(best.name + " drives the most profit — consider scaling its winning ads."); }
    if (k.lowStock) { bad.push(k.lowStock + " product(s) below reorder level."); risk.push(a.lowStock[0] ? a.lowStock[0].name + " may run out within days — reorder now to avoid lost sales." : ""); att.push("Approve outstanding purchase orders and receive pending stock."); }
    if (k.returnRate > 15) { bad.push("Return rate " + k.returnRate.toFixed(0) + "% is above the 15% threshold."); att.push("Audit the confirmation script for products with the highest returns."); }
    if (k.receivables > 0) { risk.push(money(k.receivables) + " receivable from customers — follow up on overdue invoices."); att.push("Chase overdue invoices and COD collections."); }
    if (k.payables > 0) { risk.push(money(k.payables) + " owed to suppliers — payments due may exceed cash in."); att.push("Prioritize supplier payments by due date and importance."); }
    const slow = a.orders.filter((o) => ["New", "Pending Confirmation"].includes(o.status)).length;
    if (slow) { bad.push(slow + " orders waiting for confirmation."); att.push("Confirm pending COD orders to protect the delivery rate."); }
    const badCamp = a.campaigns.filter((c) => c.spend > 0 && c.revenue && (c.revenue / c.spend) < 1.2);
    if (badCamp.length) { bad.push(badCamp.map((c) => c.name).join(", ") + " has weak return on ad spend."); }
    const repeat = a.customers.filter((c) => c.delivered >= 3);
    if (repeat.length) { opp.push(repeat.length + " customers ordered 3+ times — high repeat-purchase potential, build a retention flow."); }
    return { good, bad, risk: risk.filter(Boolean), opp, att, today: advisorLocal(a).slice(0, 3) };
  }

  function summaryHTML(s, demo) {
    return `
      ${demo ? `<div class="mb-3 rounded-xl px-4 py-2 text-[12px]" style="background:#FFF7EF;border:1px solid #FFE8D9;color:#B98A1F">Computed from your data. Run AI for a natural-language executive summary.</div>` : ""}
      <div class="grid md:grid-cols-2 gap-3">
        <div class="rounded-xl p-3" style="background:#E7F7EC;border:1px solid #D3EFDC"><div class="text-[12px] font-black uppercase text-[#0FA05A]">🔥 What is going well</div><div class="space-y-1 mt-1">${s.good.map((g) => `<div class="text-[12.5px]">• ${g}</div>`).join("") || "<div class='text-[12.5px]'>—</div>"}</div></div>
        <div class="rounded-xl p-3" style="background:#FDEAEA;border:1px solid #FAD7D7"><div class="text-[12px] font-black uppercase text-[#C93A3F]">⚠️ What is going wrong</div><div class="space-y-1 mt-1">${s.bad.map((g) => `<div class="text-[12.5px]">• ${g}</div>`).join("") || "<div class='text-[12.5px]'>—</div>"}</div></div>
        <div class="rounded-xl p-3" style="background:#FFF6E0;border:1px solid #FFEDBE"><div class="text-[12px] font-black uppercase text-[#B98A1F]">🔴 Biggest risk</div><div class="space-y-1 mt-1">${s.risk.map((g) => `<div class="text-[12.5px]">• ${g}</div>`).join("") || "<div class='text-[12.5px]'>—</div>"}</div></div>
        <div class="rounded-xl p-3" style="background:#E0E7FF;border:1px solid #D3DCFF"><div class="text-[12px] font-black uppercase text-[#4338CA]">🟢 Biggest opportunity</div><div class="space-y-1 mt-1">${s.opp.map((g) => `<div class="text-[12.5px]">• ${g}</div>`).join("") || "<div class='text-[12.5px]'>—</div>"}</div></div>
      </div>
      <div class="mt-3 rounded-xl p-3" style="background:#F7F7FA;border:1px solid var(--line)"><div class="text-[12px] font-black uppercase text-[#6B6B73]">📌 What needs attention</div><div class="space-y-1 mt-1">${s.att.map((g) => `<div class="text-[12.5px]">• ${g}</div>`).join("") || "<div class='text-[12.5px]'>—</div>"}</div></div>`;
  }

  async function runSummary() {
    const out = $("#erp-summary-out") || $("#erp-report-out");
    if (!out) return;
    out.innerHTML = `<div class="text-[13px] font-bold text-[#9A9AA2]">Analyzing all modules…</div>`;
    const a = agg();
    const payload = {
      company: company().name,
      kpis: a.kpis, today: a.today,
      lowStock: a.lowStock.map((p) => p.name + " (avail " + stockFor(p.id).available + ")"),
      topProducts: a.topProducts.slice(0, 5).map((p) => p.name + " " + p.profit),
      topCustomers: a.customers.slice(0, 3).map((c) => c.name + " " + c.totalSpent),
      receivables: a.kpis.receivables, payables: a.kpis.payables, returnRate: a.kpis.returnRate,
    };
    const res = await PL_API.ai("erp_summary", payload, {
      maxTokens: 2000,
      prompt: "You are the executive AI of an ERP. Given this JSON snapshot of a business, return STRICT JSON only: {\"good\":[\"what is going well with numbers\"],\"bad\":[\"what is going wrong\"],\"risk\":\"biggest risk\",\"opportunity\":\"biggest opportunity\",\"attention\":[\"what needs attention\"]}. Use only data provided. Max 4 per list. Mark anything unknown as UNKNOWN.",
    });
    let s = res.data ? parseJSON(res.data) : null;
    if (s && (s.good || s.bad)) {
      s = { good: s.good || [], bad: s.bad || [], risk: [s.risk], opp: [s.opportunity], att: s.attention || [] };
      out.innerHTML = summaryHTML(s, false);
    } else {
      out.innerHTML = summaryHTML(summaryLocal(a), true);
    }
  }

  function advisorLocal(a) {
    const k = a.kpis;
    const p = [];
    if (a.lowStock.length) { const x = a.lowStock[0]; p.push({ priority: "🔥 HIGH", area: "INVENTORY", title: "Reorder " + x.name + " within 3 days", reason: "Available " + stockFor(x.id).available + " ≤ reorder level " + x.reorderLevel + ".", data: "Projected stock-out from current run-rate.", impact: "Avoid " + money(1400) + "+ of lost margin per week.", action: "Approve a purchase order and receive within lead time." }); }
    const latePO = a.pos.filter((po) => po.status === "Sent" && daysAgo(po.expectedDelivery) > 3);
    if (latePO.length) { const x = latePO[0]; p.push({ priority: "🔴 HIGH", area: "PURCHASING", title: x.supplierName + " shipment is late", reason: "PO " + x.number + " was due " + daysAgo(x.expectedDelivery) + " days ago.", data: "Waiting on " + x.items.reduce((s, i) => s + (i.qty - i.received), 0) + " units.", impact: "Stock-out risk for those products.", action: "Chase supplier or split the order to another source." }); }
    const over = a.invoices.filter((i) => i.status === "Overdue");
    if (over.length) { const x = over[0]; p.push({ priority: "🔴 HIGH", area: "FINANCE", title: "Invoice " + x.number + " is overdue", reason: x.customerName + " · " + money(x.total - x.paid) + " unpaid past due date.", data: x.dueDate, impact: "Recover cash and reduce receivables.", action: "Send a follow-up task to the sales agent." }); }
    const stale = a.customers.filter((c) => c.delivered >= 1 && daysAgo(c.lastPurchase) > 45);
    if (stale.length) { p.push({ priority: "🟡 MEDIUM", area: "CRM", title: stale.length + " customers inactive 45+ days", reason: "Repeat-purchase value proven — they are drifting.", data: "Largest: " + stale[0].name + " (" + money(stale[0].totalSpent) + " lifetime).", impact: "Recovery campaign at low cost.", action: "WhatsApp re-engagement offer to top 10." }); }
    const winner = a.topProducts[0];
    if (winner && winner.profit > 0) { p.push({ priority: "🟢 OPPORTUNITY", area: "SALES", title: winner.name + " is your profit engine", reason: "Highest profit " + money(winner.profit) + " from " + winner.delivered + " delivered orders.", data: "Available stock " + stockFor(winner.id).available, impact: "Scale budget on its winning creatives.", action: "Shift spend from weak campaigns to its best ads." }); }
    if (k.returnRate > 15) { p.push({ priority: "🟡 MEDIUM", area: "COD", title: "Return rate " + k.returnRate.toFixed(0) + "% is above threshold", reason: "Affects profit per delivered order.", data: k.returned + " returned vs " + k.delivered + " delivered.", impact: "Every 1% lower = " + money(k.profitPerDelivered * 0.7) + " saved per order.", action: "Fix confirmation script + delivery zones for worst wilayas." }); }
    return p.slice(0, 6);
  }

  function S_advisor() {
    const a = agg();
    return `
    <div class="card">
      <div class="card-head"><span class="icon-tile green-soft">${icon("sparkles", 18)}</span><div><div class="card-title">WHAT SHOULD I DO TODAY?</div><div class="card-sub">AI decision engine reads every module and prioritizes actions.</div></div></div>
      <div class="flex items-center justify-between flex-wrap gap-2">
        <span class="pill gray">${esc(company().name)} · based on live data</span>
        <button class="erp-btn primary" id="erp-advisor-run">${icon("zap", 15)} Run AI analysis</button>
      </div>
      <div id="erp-advisor-out" class="mt-4">${advisorHTML(advisorLocal(a), true)}</div>
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("message-circle", 18)}</span><div><div class="card-title">ASK YOUR BUSINESS</div><div class="card-sub">Natural-language questions answered from real ERP data.</div></div></div>
      <form id="erp-ask-form" class="flex gap-2">
        <input class="erp-input flex-1" id="erp-ask-input" placeholder="Try: which products made the most profit? how much do customers owe me? which warehouse has the most stock?">
        <button class="erp-btn primary" type="submit">${icon("send", 15)} Ask</button>
      </form>
      <div id="erp-ask-out" class="mt-3"></div>
      <div class="flex flex-wrap gap-2 mt-3">
        ${["Which products made the most profit?", "Which supplier is most reliable?", "Which products should I reorder?", "How much do customers owe me?", "Which warehouse has the most inventory?", "Which campaign is actually profitable?"].map((q) => `<button class="erp-chip gray" data-action="ask-sample" data-q="${esc(q)}">${esc(q)}</button>`).join("")}
      </div>
    </div>`;
  }
  MOUNT.advisor = () => {};

  function advisorHTML(p, demo) {
    return `
      ${demo ? `<div class="mb-3 rounded-xl px-4 py-2 text-[12.5px]" style="background:#FFF7EF;border:1px solid #FFE8D9;color:#B98A1F">Computed priority actions from your data. Run AI for deeper analysis.</div>` : ""}
      <div class="space-y-3">
        ${p.map((r) => `
          <div class="rounded-xl p-4" style="background:#FAFAFA;border:1px solid var(--line)">
            <div class="flex items-center gap-2 flex-wrap"><span class="pill ${r.priority.includes("HIGH") ? "red" : r.priority.includes("OPPORTUNITY") ? "green" : "amber"}">${r.priority}</span><span class="pill gray">${r.area}</span><b class="text-[14px]">${esc(r.title)}</b></div>
            <div class="grid sm:grid-cols-3 gap-3 mt-2 text-[12.5px]">
              <div><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Why / data</div><div class="text-[#6B6B73]">${esc(r.reason)} ${esc(r.data)}</div></div>
              <div><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Expected impact</div><div class="text-[#6B6B73]">${esc(r.impact)}</div></div>
              <div><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Suggested action</div><div class="text-[#6B6B73]">${esc(r.action)}</div></div>
            </div>
          </div>`).join("")}
      </div>`;
  }

  async function runAdvisor() {
    const out = $("#erp-advisor-out");
    if (!out) return;
    out.innerHTML = `<div class="text-[13px] font-bold text-[#9A9AA2]">Analyzing sales, inventory, finance, customers, marketing…</div>`;
    const a = agg();
    const res = await PL_API.ai("erp_advisor", {
      company: company().name,
      kpis: a.kpis,
      lowStock: a.lowStock.map((p) => ({ name: p.name, available: stockFor(p.id).available, reorder: p.reorderLevel })),
      overdueInvoices: a.invoices.filter((i) => i.status === "Overdue").map((i) => i.number + " " + i.customerName + " " + (i.total - i.paid)),
      staleCustomers: a.customers.filter((c) => c.delivered >= 1 && daysAgo(c.lastPurchase) > 45).length,
      campaigns: a.campaigns.map((c) => ({ name: c.name, spend: c.spend, revenue: c.revenue, delivered: c.delivered, returns: c.returns })),
    }, {
      maxTokens: 2500,
      prompt: "You are the decision engine of an ERP. Return STRICT JSON only: {\"recommendations\":[{\"priority\":\"HIGH|MEDIUM|OPPORTUNITY\",\"area\":\"SALES|INVENTORY|FINANCE|CRM|PURCHASING|COD\",\"title\":\"...\",\"reason\":\"why\",\"data\":\"the data used\",\"impact\":\"expected impact\",\"action\":\"suggested action\"}]} max 6. Use only provided data, never invent numbers.",
    });
    let p = res.data ? parseJSON(res.data) : null;
    if (p && Array.isArray(p.recommendations)) {
      out.innerHTML = advisorHTML(p.recommendations.slice(0, 6).map((r) => ({ priority: r.priority, area: r.area, title: r.title, reason: r.reason, data: r.data, impact: r.impact, action: r.action })), false);
    } else {
      out.innerHTML = advisorHTML(advisorLocal(a), true);
    }
  }

  /* -------- ask your business (query engine on real data) -------- */
  function analystAnswer(q) {
    const a = agg();
    const t = q.toLowerCase();
    const out = [];
    if (/product|profit|top|best|margin/i.test(t) && /profit|top|best|perform/i.test(t)) {
      const rows = a.topProducts.slice(0, 5);
      out.push({ head: "Most profitable products", rows: rows.map((p) => [p.name, p.delivered + " delivered", money(p.revenue), money(p.profit)]) });
    } else if (/product|sale|sell|best/i.test(t)) {
      const rows = a.topProducts.slice().sort((x, y) => y.orders - x.orders).slice(0, 5);
      out.push({ head: "Top products by orders", rows: rows.map((p) => [p.name, p.orders + " orders", money(p.revenue)]) });
    } else if (/reorder|low|stock|run out|restock|inventory|supply/i.test(t)) {
      const rows = a.lowStock.map((p) => [p.name, stockFor(p.id).available, stockFor(p.id).onHand, p.reorderLevel, money(p.supplierCost * (p.reorderLevel * 1.5))]);
      out.push({ head: "Products to reorder (available ≤ reorder level)", rows });
    } else if (/owe|receivable|debt|invoice|customer.*money|outstanding/i.test(t)) {
      const ar = a.invoices.filter((i) => i.total > i.paid).map((i) => [i.number, i.customerName, money(i.total - i.paid), i.status]);
      out.push({ head: "Customers owe you " + money(a.kpis.receivables), rows: ar });
    } else if (/owe.*supplier|payable|bill/i.test(t)) {
      const ap = a.suppliers.filter((s) => s.outstanding > 0).map((s) => [s.name, money(s.outstanding), s.terms]);
      out.push({ head: "You owe suppliers " + money(a.kpis.payables), rows: ap });
    } else if (/warehouse|store.*stock|inventory.*warehouse/i.test(t)) {
      const rows = load("warehouses").map((w) => [w.name, load("inventory").filter((i) => i.warehouseId === w.id).reduce((s, i) => s + i.onHand, 0), money(load("inventory").filter((i) => i.warehouseId === w.id).reduce((s, i) => s + i.onHand * (a.products.find((p) => p.id === i.productId) || {}).supplierCost || 0, 0))]);
      out.push({ head: "Inventory by warehouse", rows });
    } else if (/campaign|ad|marketing|profitable.*campaign|roas/i.test(t)) {
      const rows = a.campaigns.map((c) => [c.name, money(c.spend), money(c.revenue), (c.revenue / (c.spend || 1)).toFixed(2) + "x", c.delivered + " delivered", c.returns + " returns"]);
      out.push({ head: "Campaigns — profitable revenue check", rows });
    } else if (/supplier|reliab|quality|best supplier|price/i.test(t)) {
      const rows = a.suppliers.map((s) => [s.name, s.avgCost, s.deliveryTime + "d", s.lateDeliveries + " late", s.defectRate + "% defects", s.score.reliability + "/10"]);
      out.push({ head: "Supplier performance", rows });
    } else if (/customer.*buy|repeat|orders.*3|vip/i.test(t)) {
      const rows = a.customers.filter((c) => c.delivered >= 3).map((c) => [c.name, c.delivered + " orders", money(c.totalSpent)]);
      out.push({ head: "Repeat customers (3+ delivered)", rows });
    } else if (/expense|cost|spend.*money|where.*money/i.test(t)) {
      const rows = a.expByCat.slice().sort((x, y) => y.val - x.val).map((c) => [c.cat, money(c.val), ((c.val / (a.kpis.expTotal || 1)) * 100).toFixed(0) + "%"]);
      out.push({ head: "Expenses by category (" + money(a.kpis.expTotal) + ")", rows });
    } else if (/profit|why.*profit|net/i.test(t)) {
      const k = a.kpis;
      out.push({ head: "Profit breakdown", rows: [["Revenue", money(k.revenue)], ["COGS", "-" + money(k.cogs)], ["Shipping & packaging", "-" + money(k.shipCost + pkgAll(a))], ["Marketing spend", "-" + money(k.adSpend)], ["Expenses", "-" + money(k.expTotal)], ["Net profit", money(k.net)]] });
    } else if (/order|cod|pending|confirm/i.test(t)) {
      const rows = a.orders.filter((o) => ["New", "Pending Confirmation"].includes(o.status)).map((o) => [o.orderNumber, o.customerName, o.customerWilaya, o.status, money(o.total)]);
      out.push({ head: "Orders awaiting confirmation (" + a.kpis.pending + " pending)", rows });
    } else {
      return null;
    }
    return out;
  }
  function pkgAll(a) { return a.orders.filter((o) => o.status === "Delivered").reduce((s, o) => s + (o.items || []).reduce((x, it) => x + it.qty * 60, 0), 0); }

  function analystHTML(results) {
    return results.map((r) => `
      <div class="rounded-xl p-4 mt-3" style="background:#FAFAFA;border:1px solid var(--line)">
        <div class="text-[12px] font-black uppercase text-[#4338CA] mb-2">${esc(r.head)}</div>
        <div class="erp-table-wrap"><table class="erp-table"><tbody>${r.rows.map((row) => `<tr>${row.map((c) => `<td class="text-[12.5px] ${typeof c === "string" && c.startsWith("-") ? "text-[#C93A3F]" : ""}">${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      </div>`).join("");
  }

  async function askAnalyst(q) {
    const out = $("#erp-ask-out");
    if (!out) return;
    out.innerHTML = `<div class="text-[12.5px] font-bold text-[#9A9AA2] mt-2">Querying ERP data…</div>`;
    const results = analystAnswer(q);
    if (results) {
      const a = agg();
      const res = await PL_API.ai("erp_analyst", { question: q, snapshot: { revenue: a.kpis.revenue, net: a.kpis.net, lowStock: a.lowStock.length, receivables: a.kpis.receivables, payables: a.kpis.payables, topProduct: a.topProducts[0] && a.topProducts[0].name } }, {
        maxTokens: 1200,
        prompt: "You are the AI business analyst of an ERP. Answer the owner's question in one short paragraph using ONLY the provided snapshot data. If the answer is not in the data, say what is needed. Never invent numbers.",
      });
      const ai = res.data ? (parseJSON(res.data) ? (parseJSON(res.data).answer || parseJSON(res.data).narrative) : res.data) : "";
      out.innerHTML = analystHTML(results) + (ai ? `<div class="rounded-xl p-4 mt-3" style="background:#E0E7FF;border:1px solid #D3DCFF"><div class="text-[12px] font-black uppercase text-[#4338CA]">AI explanation</div><div class="text-[12.5px] mt-1">${esc(String(ai))}</div></div>` : "");
    } else {
      out.innerHTML = `<div class="rounded-xl p-4 mt-3" style="background:#FFF7EF;border:1px solid #FFE8D9;color:#B98A1F;font-size:13px">I could not map that to a data query. Try one of the suggestions, or ask about products, profit, inventory, suppliers, customers, expenses, campaigns or receivables.</div>`;
    }
  }

  /* ---------------- products ---------------- */
  function S_products() {
    const q = (state.q || "").toLowerCase();
    const list = load("products").filter((p) => !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.barcode || "").includes(q) || p.category.toLowerCase().includes(q));
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Products</div><div class="erp-title-sub">${list.length} products · variants · stock · pricing</div></div>
      <div class="flex gap-2">
        ${can("create") ? `<button class="erp-btn primary" data-action="add-product">${icon("plus", 15)} Product</button>` : ""}
        ${can("export") ? `<button class="erp-btn ghost" data-action="export-products">${icon("download", 15)} CSV</button>` : ""}
      </div>
    </div>
    <div class="erp-table-wrap mt-3">
      <table class="erp-table">
        <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Supplier</th><th>Cost</th><th>Price</th><th>On hand</th><th>Available</th><th>Sold</th><th>Returns</th><th>Status</th></tr></thead>
        <tbody>
          ${list.map((p) => {
            const st = stockFor(p.id);
            const sup = load("suppliers").find((s) => s.id === p.supplierId);
            return `<tr class="cursor-pointer" data-action="open-product" data-id="${p.id}">
              <td><div class="font-bold">${esc(p.name)}</div><div class="text-[11.5px] text-[#9A9AA2]">${esc(p.type)}${p.variants.length ? " · " + p.variants.length + " variants" : ""}</div></td>
              <td>${esc(p.sku)}</td><td>${esc(p.category)}</td><td>${esc(sup ? sup.name : "—")}</td>
              <td>${fmt(p.supplierCost)}</td><td><b>${fmt(p.discountPrice || p.sellingPrice)}</b></td>
              <td>${st.onHand}</td><td class="${st.available <= p.reorderLevel ? "text-[#C93A3F] font-bold" : "text-[#0FA05A] font-bold"}">${st.available}</td>
              <td>${p.sold}</td><td>${p.returned}</td>
              <td><span class="pill ${p.status === "Active" ? "green" : "gray"}">${p.status}</span></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>`;
  }
  MOUNT.products = () => {};

  function openProduct(id) {
    const p = load("products").find((x) => x.id === id);
    if (!p) return;
    const st = stockFor(id);
    const sup = load("suppliers").find((s) => s.id === p.supplierId);
    const ledger = load("ledger").filter((l) => l.productId === id).slice(0, 8);
    openModal(`
      <div class="flex items-center justify-between">
        <div><div class="erp-title text-[17px]">${esc(p.name)}</div><div class="erp-title-sub">${esc(p.sku)} · ${esc(p.category)} · ${esc(p.type)}</div></div>
        <button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button>
      </div>
      <div class="grid grid-cols-4 gap-3 mt-4">
        <div class="kpi"><div class="kpi-lbl">On hand</div><div class="kpi-num text-[18px]">${st.onHand}</div></div>
        <div class="kpi"><div class="kpi-lbl">Reserved</div><div class="kpi-num text-[18px]">${st.reserved}</div></div>
        <div class="kpi"><div class="kpi-lbl">Available</div><div class="kpi-num text-[18px]">${st.available}</div></div>
        <div class="kpi"><div class="kpi-lbl">Incoming</div><div class="kpi-num text-[18px]">${st.incoming}</div></div>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-4 text-[13px]">
        <div class="rounded-xl p-3" style="background:#FAFAFA;border:1px solid var(--line)"><b>Cost</b> ${fmt(p.supplierCost)} · <b>Sell</b> ${fmt(p.sellingPrice)} · <b>Offer</b> ${fmt(p.discountPrice)} · <b>Wholesale</b> ${fmt(p.wholesalePrice)}</div>
        <div class="rounded-xl p-3" style="background:#FAFAFA;border:1px solid var(--line)"><b>Supplier</b> ${esc(sup ? sup.name : "—")}<br><b>Reorder</b> ${p.reorderLevel} · <b>Min</b> ${p.minStock} · <b>Max</b> ${p.maxStock} · <b>Tax</b> ${p.taxRate}%</div>
      </div>
      ${p.variants.length ? `<div class="erp-table-wrap mt-4"><table class="erp-table"><thead><tr><th>Variant</th><th>SKU</th><th>Cost</th><th>Price</th><th>Stock</th></tr></thead><tbody>${p.variants.map((v) => `<tr><td><b>${esc(v.name)}</b></td><td>${esc(v.sku)}</td><td>${v.cost}</td><td>${v.price}</td><td>${v.stock}</td></tr>`).join("")}</tbody></table></div>` : ""}
      <div class="mt-4"><div class="text-[12px] font-black uppercase text-[#9A9AA2] mb-2">Recent inventory ledger</div>
        <div class="erp-table-wrap"><table class="erp-table"><thead><tr><th>Date</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>Ref</th><th>User</th></tr></thead>
        <tbody>${ledger.map((l) => `<tr><td>${fmtDate(l.date)}</td><td><span class="pill ${l.qty > 0 ? "green" : "red"}">${l.type}</span></td><td><b>${l.qty > 0 ? "+" : ""}${l.qty}</b></td><td>${l.before}</td><td>${l.after}</td><td>${esc(l.ref)}</td><td>${esc(l.user)}</td></tr>`).join("")}</tbody></table></div>
      </div>
    `, true);
  }

  function openProductForm(id) {
    const p = id ? load("products").find((x) => x.id === id) : null;
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">${p ? "Edit product" : "New product"}</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="product-form" class="grid grid-cols-2 gap-3 mt-4">
        <div><label class="label">Name</label><input class="erp-input w-full" name="name" value="${p ? esc(p.name) : ""}" required></div>
        <div><label class="label">SKU</label><input class="erp-input w-full" name="sku" value="${p ? esc(p.sku) : ""}" required></div>
        <div><label class="label">Category</label><input class="erp-input w-full" name="category" value="${p ? esc(p.category) : ""}"></div>
        <div><label class="label">Supplier</label><select class="erp-select w-full" name="supplierId">${load("suppliers").map((s) => `<option value="${s.id}"${p && p.supplierId === s.id ? " selected" : ""}>${esc(s.name)}</option>`).join("")}</select></div>
        <div><label class="label">Cost</label><input class="erp-input w-full" type="number" name="supplierCost" value="${p ? p.supplierCost : ""}"></div>
        <div><label class="label">Selling price</label><input class="erp-input w-full" type="number" name="sellingPrice" value="${p ? p.sellingPrice : ""}"></div>
        <div><label class="label">Discount price</label><input class="erp-input w-full" type="number" name="discountPrice" value="${p ? p.discountPrice : ""}"></div>
        <div><label class="label">Reorder level</label><input class="erp-input w-full" type="number" name="reorderLevel" value="${p ? p.reorderLevel : ""}"></div>
        <div class="col-span-2"><label class="label">Description</label><textarea class="erp-textarea" name="description">${p ? esc(p.description || "") : ""}</textarea></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${p ? "Save changes" : "Create product"}</button></div>
      </form>`);
  }

  function exportCSV(name, rows) {
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = name + ".csv";
    a.click();
    toast("Exported " + name + ".csv", "ok");
  }

  /* ---------------- inventory ---------------- */
  function S_inventory() {
    const a = agg();
    const alerts = inventoryAlerts(a);
    return `
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="kpi hot"><div class="kpi-lbl">Inventory value</div><div class="kpi-num">${money(a.kpis.inventoryValue)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Low stock</div><div class="kpi-num text-[#B98A1F]">${fmt(a.lowStock.length)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Out of stock</div><div class="kpi-num text-[#C93A3F]">${fmt(a.outOfStock.length)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Ledger entries</div><div class="kpi-num">${fmt(load("ledger").length)}</div></div>
    </div>

    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("alert-triangle", 18)}</span><div><div class="card-title">Stock alerts & AI reorder advice</div><div class="card-sub">Low / out / overstock / slow-moving / dead stock</div></div></div>
      <div class="grid md:grid-cols-2 gap-3 mt-2">
        ${alerts.map((x) => `<div class="rounded-xl p-3 text-[12.5px]" style="background:${x.bg};border:1px solid ${x.border}"><b class="${x.color}">${x.title}</b><div class="text-[#6B6B73] mt-0.5">${x.body}</div></div>`).join("")}
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("boxes", 18)}</span><div><div class="card-title">Current stock</div><div class="card-sub">AVAILABLE = ON HAND − RESERVED</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Product</th><th>On hand</th><th>Reserved</th><th>Incoming</th><th>Available</th></tr></thead>
        <tbody>${a.products.map((p) => { const st = stockFor(p.id); return `<tr><td><b>${esc(p.name)}</b><div class="text-[11px] text-[#9A9AA2]">${esc(p.sku)}</div></td><td>${st.onHand}</td><td>${st.reserved}</td><td>${st.incoming}</td><td class="font-bold ${st.available <= p.reorderLevel ? "text-[#C93A3F]" : "text-[#0FA05A]"}">${st.available}</td></tr>`; }).join("")}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("scroll-text", 18)}</span><div><div class="card-title">Inventory ledger</div><div class="card-sub">Immutable — every movement has before/after</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>User</th></tr></thead>
        <tbody>${load("ledger").slice(0, 14).map((l) => `<tr><td>${fmtDate(l.date)}</td><td class="max-w-[140px] truncate">${esc(l.productName)}</td><td><span class="pill ${l.qty > 0 ? "green" : "red"}">${l.type}</span></td><td><b>${l.qty > 0 ? "+" : ""}${l.qty}</b></td><td>${l.before}</td><td>${l.after}</td><td>${esc(l.user)}</td></tr>`).join("")}</tbody></table></div>
        <div class="text-[11px] text-[#9A9AA2] mt-2">Showing latest ${Math.min(14, load("ledger").length)} of ${load("ledger").length} entries.</div>
      </div>
    </div>`;
  }
  MOUNT.inventory = () => {};

  function inventoryAlerts(a) {
    const out = [];
    a.lowStock.forEach((p) => {
      const st = stockFor(p.id);
      const sup = load("suppliers").find((s) => s.id === p.supplierId);
      out.push({ title: "Low stock: " + p.name, body: "Available " + st.available + " vs reorder " + p.reorderLevel + ". Reorder ~" + (p.reorderLevel * 1.5) + " units from " + (sup ? sup.name : "a supplier") + " (" + (sup ? sup.deliveryTime + " days lead" : "lead time unknown") + ").", bg: "#FFF6E0", border: "#FFEDBE", color: "#B98A1F" });
    });
    a.outOfStock.forEach((p) => out.push({ title: "Out of stock: " + p.name, body: "0 available — block new sales or backorder.", bg: "#FDEAEA", border: "#FAD7D7", color: "#C93A3F" }));
    const over = a.products.filter((p) => stockFor(p.id).onHand > p.maxStock);
    over.forEach((p) => out.push({ title: "Overstock: " + p.name, body: "On hand " + stockFor(p.id).onHand + " above max " + p.maxStock + ". Consider a promo or transfer to another warehouse.", bg: "#E0E7FF", border: "#D3DCFF", color: "#4338CA" }));
    const soldRate = a.products.map((p) => ({ p, rate: p.sold / Math.max(1, daysAgo2(p)) })).sort((x, y) => x.rate - y.rate);
    soldRate.slice(0, 2).forEach(({ p }) => out.push({ title: "Slow-moving: " + p.name, body: "Low sell-through — review stock level and demand.", bg: "#F2E8FC", border: "#E5D4F8", color: "#7A3AC9" }));
    return out.slice(0, 6);
  }
  function daysAgo2() { return 30; }

  /* ---------------- warehouses & transfers ---------------- */
  function S_warehouses() {
    const whs = load("warehouses");
    const trs = load("transfers");
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Warehouses</div><div class="erp-title-sub">Multi-warehouse stock · transfers</div></div>
      ${can("inventory") ? `<button class="erp-btn primary" data-action="add-warehouse">${icon("plus", 15)} Warehouse</button>` : ""}
    </div>
    <div class="grid md:grid-cols-3 gap-3 mt-3">
      ${whs.map((w) => {
        const rows = load("inventory").filter((i) => i.warehouseId === w.id);
        const units = rows.reduce((s, i) => s + i.onHand, 0);
        const val = rows.reduce((s, i) => s + i.onHand * ((load("products").find((p) => p.id === i.productId) || {}).supplierCost || 0), 0);
        return `<div class="card">
          <div class="flex items-center justify-between"><div class="font-bold text-[14px]">${esc(w.name)}</div><span class="pill ${w.status === "Active" ? "green" : "gray"}">${w.status}</span></div>
          <div class="text-[11.5px] text-[#9A9AA2]">${esc(w.location)} · Manager ${esc(w.manager)}</div>
          <div class="flex justify-between mt-3 text-[13px]"><span>Stock units</span><b>${fmt(units)}</b></div>
          <div class="flex justify-between mt-1 text-[13px]"><span>Stock value</span><b>${money(val)}</b></div>
          <div class="flex justify-between mt-1 text-[13px]"><span>Incoming</span><b>${fmt(rows.reduce((s, i) => s + i.incoming, 0))}</b></div>
        </div>`;
      }).join("")}
    </div>
    <div class="card mt-4">
      <div class="card-head"><span class="icon-tile green-soft">${icon("arrow-left-right", 18)}</span><div><div class="card-title">Warehouse transfers</div><div class="card-sub">Request → Approved → In Transit → Received</div></div>
        ${can("inventory") ? `<button class="erp-btn primary" data-action="new-transfer">${icon("plus", 15)} New transfer</button>` : ""}
      </div>
      <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Ref</th><th>From</th><th>To</th><th>Items</th><th>Status</th><th>Requested by</th><th>Date</th><th></th></tr></thead>
      <tbody>${(trs.length ? trs : transferSeed()).map((t) => `
        <tr>
          <td><b>${esc(t.number)}</b></td><td>${esc((load("warehouses").find((w) => w.id === t.sourceId) || {}).name || "—")}</td>
          <td>${esc((load("warehouses").find((w) => w.id === t.destId) || {}).name || "—")}</td>
          <td>${t.items.map((i) => i.qty + "× " + esc(i.name)).join(", ")}</td>
          <td><span class="pill ${t.status === "Received" ? "green" : t.status === "Cancelled" ? "red" : t.status === "Approved" ? "sky" : t.status === "In Transit" ? "amber" : "blue"}">${t.status}</span></td>
          <td>${esc(t.requestedBy)}</td><td>${fmtDate(t.createdAt)}</td>
          <td>${can("inventory") && t.status !== "Received" && t.status !== "Cancelled" ? `<button class="erp-chip indigo" data-action="advance-transfer" data-id="${t.id}">${t.status === "Requested" ? "Approve" : t.status === "Approved" ? "Ship" : "Receive"}</button>` : ""}</td>
        </tr>`).join("")}</tbody></table></div>
    </div>`;
  }
  MOUNT.warehouses = () => {};

  function transferSeed() {
    if (load("transfers").length) return load("transfers");
    const list = [
      { id: "tr1", number: "TRF-77", sourceId: "wh1", destId: "wh2", status: "Received", items: [{ productId: "p6", name: "Essential T-Shirt", qty: 30 }], requestedBy: "Karim D.", createdAt: day(6) },
      { id: "tr2", number: "TRF-78", sourceId: "wh1", destId: "wh3", status: "In Transit", items: [{ productId: "p1", name: "Pro Chef Knife Set", qty: 40 }], requestedBy: "Ahmed", createdAt: day(1) },
      { id: "tr3", number: "TRF-79", sourceId: "wh2", destId: "wh1", status: "Approved", items: [{ productId: "p5", name: "Smart Watch Pro", qty: 20 }], requestedBy: "Sofiane H.", createdAt: day(0) },
    ];
    save("transfers", list);
    return list;
  }

  function newTransferForm() {
    const whs = load("warehouses");
    const prods = load("products");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New warehouse transfer</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="transfer-form" class="grid grid-cols-2 gap-3 mt-4">
        <div><label class="label">From</label><select class="erp-select w-full" name="sourceId">${whs.map((w) => `<option value="${w.id}">${esc(w.name)}</option>`).join("")}</select></div>
        <div><label class="label">To</label><select class="erp-select w-full" name="destId">${whs.map((w) => `<option value="${w.id}">${esc(w.name)}</option>`).join("")}</select></div>
        <div><label class="label">Product</label><select class="erp-select w-full" name="productId">${prods.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></div>
        <div><label class="label">Quantity</label><input class="erp-input w-full" type="number" name="qty" value="10" min="1"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">Create request</button></div>
      </form>`);
  }

  function advanceTransfer(id) {
    const list = transferSeed();
    const t = list.find((x) => x.id === id);
    if (!t) return;
    const next = { Requested: "Approved", Approved: "In Transit", "In Transit": "Received" }[t.status];
    if (!next) return;
    const before = t.status;
    t.status = next;
    if (next === "Received") {
      const inv = load("inventory");
      t.items.forEach((it) => {
        const src = inv.find((i) => i.warehouseId === t.sourceId && i.productId === it.productId);
        const dst = inv.find((i) => i.warehouseId === t.destId && i.productId === it.productId);
        if (src && src.onHand >= it.qty) {
          const sb = src.onHand;
          src.onHand -= it.qty;
          const db = dst ? dst.onHand : 0;
          if (dst) dst.onHand += it.qty;
          else inv.push({ id: uid(), productId: it.productId, warehouseId: t.destId, onHand: it.qty, reserved: 0, incoming: 0 });
          logLedger({ date: new Date().toISOString(), productId: it.productId, productName: it.name, variant: "—", warehouseId: t.sourceId, qty: -it.qty, before: sb, after: src.onHand, type: "Transfer", ref: t.number, user: me().name, reason: "Transfer to " + t.destId });
          logLedger({ date: new Date().toISOString(), productId: it.productId, productName: it.name, variant: "—", warehouseId: t.destId, qty: it.qty, before: db, after: (dst || { onHand: it.qty }).onHand, type: "Transfer", ref: t.number, user: me().name, reason: "Transfer from " + t.sourceId });
        }
      });
      save("inventory", inv);
    }
    save("transfers", list);
    audit("Transfer advanced", t.number + ": " + before + " → " + next);
    toast("Transfer " + t.number + " → " + next, "ok");
    shell();
  }

  function logLedger(entry) {
    const l = load("ledger");
    l.unshift({ id: uid(), ...entry });
    save("ledger", l);
  }

  /* ---------------- purchasing ---------------- */
  function S_purchasing() {
    const pos = load("pos");
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Purchasing</div><div class="erp-title-sub">Purchase request → PO → confirmation → shipment → receiving → quality → inventory</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-po">${icon("plus", 15)} Purchase order</button>` : ""}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
      ${[
        ["Total POs", pos.length],
        ["Open value", money(pos.filter((po) => !["Received", "Cancelled"].includes(po.status)).reduce((s, po) => s + po.total, 0))],
        ["Awaiting goods", fmt(pos.filter((po) => ["Approved", "Sent", "Partially Received"].includes(po.status)).length)],
        ["Pending approval", fmt(pos.filter((po) => po.status === "Pending Approval").length)],
      ].map(([l, v]) => `<div class="kpi"><div class="kpi-lbl">${l}</div><div class="kpi-num text-[19px]">${v}</div></div>`).join("")}
    </div>
    <div class="erp-table-wrap mt-4">
      <table class="erp-table">
        <thead><tr><th>Number</th><th>Supplier</th><th>Items</th><th>Total</th><th>Status</th><th>Expected</th><th>Receiving</th><th></th></tr></thead>
        <tbody>${pos.map((po) => `
          <tr>
            <td><b>${esc(po.number)}</b></td>
            <td>${esc(po.supplierName)}</td>
            <td>${po.items.map((i) => i.qty + "× " + esc(i.name)).join("<br>")}</td>
            <td><b>${money(po.total)}</b></td>
            <td><span class="pill ${poPill(po.status)}">${po.status}</span></td>
            <td>${fmtDate(po.expectedDelivery)} ${daysAgo(po.expectedDelivery) > 2 && ["Sent", "Approved", "Partially Received"].includes(po.status) ? `<span class="risk high">late</span>` : ""}</td>
            <td>${po.items.map((i) => i.received + "/" + i.qty).join(", ")}</td>
            <td>${can("inventory") && ["Approved", "Sent", "Partially Received"].includes(po.status) ? `<button class="erp-chip green" data-action="receive-goods" data-id="${po.id}">${icon("package-check", 14)} Receive</button>` : ""}</td>
          </tr>`).join("")}</tbody>
      </table>
    </div>`;
  }
  MOUNT.purchasing = () => {};

  function newPOForm() {
    const sups = load("suppliers");
    const prods = load("products");
    const whs = load("warehouses");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New purchase order</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="po-form" class="grid grid-cols-2 gap-3 mt-4">
        <div><label class="label">Supplier</label><select class="erp-select w-full" name="supplierId">${sups.map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select></div>
        <div><label class="label">Warehouse</label><select class="erp-select w-full" name="warehouseId">${whs.map((w) => `<option value="${w.id}">${esc(w.name)}</option>`).join("")}</select></div>
        <div><label class="label">Product</label><select class="erp-select w-full" name="productId">${prods.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select></div>
        <div><label class="label">Quantity</label><input class="erp-input w-full" type="number" name="qty" value="50" min="1"></div>
        <div><label class="label">Unit cost</label><input class="erp-input w-full" type="number" name="cost"></div>
        <div><label class="label">Expected delivery (days)</label><input class="erp-input w-full" type="number" name="lead" value="21"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">Create PO</button></div>
      </form>`);
  }

  function createPO(data) {
    const pos = load("pos");
    const sup = load("suppliers").find((s) => s.id === data.supplierId);
    const prod = load("products").find((p) => p.id === data.productId);
    const cost = Number(data.cost) || prod.supplierCost;
    const qty = Number(data.qty) || 1;
    const lead = Number(data.lead) || 21;
    const po = {
      id: uid(), number: "PO-" + (2025 + pos.length), supplierId: sup.id, supplierName: sup.name,
      status: "Pending Approval", currency: sup.currency, warehouseId: data.warehouseId,
      expectedDelivery: new Date(Date.now() + lead * 86400000).toISOString(), terms: sup.terms, notes: "",
      items: [{ productId: prod.id, name: prod.name, qty, received: 0, cost }],
      total: cost * qty, createdAt: new Date().toISOString(),
    };
    upsert("pos", po);
    audit("Purchase order created", po.number + " · " + po.supplierName + " · " + money(po.total));
    toast("PO " + po.number + " created (pending approval)", "ok");
    shell();
  }

  function receiveGoods(poId) {
    const po = load("pos").find((x) => x.id === poId);
    if (!po) return;
    openModal(`
      <div class="flex items-center justify-between"><div><div class="erp-title">Goods receiving — ${esc(po.number)}</div><div class="erp-title-sub">${esc(po.supplierName)} · ${esc((load("warehouses").find((w) => w.id === po.warehouseId) || {}).name || "—")}</div></div>
      <button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="receiving-form" data-po="${po.id}" class="mt-4">
        ${po.items.map((it) => {
          const remaining = it.qty - it.received;
          return `<div class="rounded-xl p-4 mb-3" style="background:#FAFAFA;border:1px solid var(--line)">
            <div class="flex items-center justify-between"><b>${esc(it.name)}</b><span class="text-[12px] text-[#9A9AA2]">Ordered ${it.qty} · Received ${it.received}</span></div>
            <div class="grid grid-cols-3 gap-3 mt-2">
              <div><label class="label">Received qty</label><input class="erp-input w-full" type="number" name="rec_${it.productId}" value="${remaining}" min="0" max="${it.qty}"></div>
              <div><label class="label">Damaged</label><input class="erp-input w-full" type="number" name="dmg_${it.productId}" value="0" min="0"></div>
              <div><label class="label">Missing</label><input class="erp-input w-full" type="number" name="mis_${it.productId}" value="0" min="0"></div>
            </div>
          </div>`;
        }).join("")}
        <div class="flex justify-end"><button class="erp-btn primary" type="submit">${icon("package-check", 15)} Confirm receiving</button></div>
      </form>`);
  }

  function confirmReceiving(form) {
    const poId = form.dataset.po;
    const po = load("pos").find((x) => x.id === poId);
    if (!po) return;
    const fd = new FormData(form);
    const inv = load("inventory");
    po.items.forEach((it) => {
      const rec = Number(fd.get("rec_" + it.productId)) || 0;
      const dmg = Number(fd.get("dmg_" + it.productId)) || 0;
      const mis = Number(fd.get("mis_" + it.productId)) || 0;
      if (!rec) return;
      it.received += rec;
      const row = inv.find((i) => i.productId === it.productId && i.warehouseId === po.warehouseId);
      const before = row ? row.onHand : 0;
      if (row) row.onHand += rec; else inv.push({ id: uid(), productId: it.productId, warehouseId: po.warehouseId, onHand: rec, reserved: 0, incoming: 0 });
      const prod = load("products").find((p) => p.id === it.productId);
      if (prod) { prod.stock = (prod.stock || 0) + rec; prod.sold = prod.sold || 0; upsert("products", prod); }
      logLedger({ date: new Date().toISOString(), productId: it.productId, productName: it.name, variant: "—", warehouseId: po.warehouseId, qty: rec, before, after: (row || { onHand: rec }).onHand, type: "Purchase", ref: po.number, user: me().name, reason: "Goods receiving" + (dmg ? " · damaged " + dmg : "") + (mis ? " · missing " + mis : "") });
    });
    po.status = po.items.every((i) => i.received >= i.qty) ? "Received" : "Partially Received";
    upsert("pos", po);
    audit("Goods received", po.number + " → " + po.status);
    toast("Receiving confirmed — inventory updated via ledger", "ok");
    shell();
  }

  /* ---------------- suppliers ---------------- */
  function S_suppliers() {
    const sups = load("suppliers");
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Suppliers</div><div class="erp-title-sub">Profiles · KPIs · AI supplier analysis</div></div>
      <button class="erp-btn primary" id="erp-supplier-ai">${icon("sparkles", 15)} AI supplier analysis</button>
    </div>
    <div class="erp-table-wrap mt-3">
      <table class="erp-table">
        <thead><tr><th>Supplier</th><th>Country</th><th>Orders</th><th>Avg cost</th><th>Delivery</th><th>Late</th><th>Defects</th><th>Outstanding</th><th>Reliability</th></tr></thead>
        <tbody>${sups.map((s) => `
          <tr class="cursor-pointer" data-action="open-supplier" data-id="${s.id}">
            <td><b>${esc(s.name)}</b><div class="text-[11.5px] text-[#9A9AA2]">${esc(s.contact)}</div></td>
            <td>${esc(s.country)}</td><td>${s.ordersCount}</td><td>${money(s.avgCost)}</td>
            <td>${s.deliveryTime}d</td><td class="${s.lateDeliveries > 3 ? "text-[#C93A3F] font-bold" : ""}">${s.lateDeliveries}</td>
            <td>${s.defectRate}%</td><td class="text-[#B98A1F] font-bold">${money(s.outstanding)}</td>
            <td><span class="risk ${s.score.reliability >= 9 ? "low" : s.score.reliability >= 7 ? "medium" : "high"}">${s.score.reliability}/10</span></td>
          </tr>`).join("")}</tbody>
      </table>
    </div>
    <div id="erp-supplier-out" class="mt-4"></div>`;
  }
  MOUNT.suppliers = () => {};

  function openSupplier(id) {
    const s = load("suppliers").find((x) => x.id === id);
    if (!s) return;
    const prods = load("products").filter((p) => p.supplierId === id);
    const pos = load("pos").filter((po) => po.supplierId === id);
    openModal(`
      <div class="flex items-center justify-between"><div><div class="erp-title">${esc(s.name)}</div><div class="erp-title-sub">${esc(s.country)} · ${esc(s.terms)}</div></div>
      <button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="grid grid-cols-3 gap-3 mt-4">
        <div class="kpi"><div class="kpi-lbl">Total purchases</div><div class="kpi-num text-[18px]">${money(s.totalPurchases)}</div></div>
        <div class="kpi"><div class="kpi-lbl">Outstanding</div><div class="kpi-num text-[18px] text-[#B98A1F]">${money(s.outstanding)}</div></div>
        <div class="kpi"><div class="kpi-lbl">Avg delivery</div><div class="kpi-num text-[18px]">${s.deliveryTime} days</div></div>
      </div>
      <div class="grid grid-cols-3 gap-3 mt-4">
        ${Object.entries(s.score).map(([k, v]) => `<div class="rounded-xl p-3 text-center" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">${k}</div><div class="text-[22px] font-black ${v >= 8 ? "text-[#0FA05A]" : v >= 6 ? "text-[#B98A1F]" : "text-[#C93A3F]"}">${v}</div></div>`).join("")}
      </div>
      <div class="mt-4 text-[13px]">Products: ${prods.map((p) => `<span class="pill indigo">${esc(p.name)}</span>`).join(" ") || "—"}</div>
      <div class="mt-3 text-[13px]">Purchase history: ${pos.map((po) => `${esc(po.number)} · ${money(po.total)}`).join(" — ") || "—"}</div>
    `, true);
  }

  async function runSupplierAI() {
    const out = $("#erp-supplier-out");
    if (!out) return;
    out.innerHTML = `<div class="text-[13px] font-bold text-[#9A9AA2]">Scoring price, quality, reliability, delivery, defects, terms…</div>`;
    const sups = load("suppliers");
    const res = await PL_API.ai("erp_suppliers", { suppliers: sups.map((s) => ({ name: s.name, avgCost: s.avgCost, deliveryTime: s.deliveryTime, lateDeliveries: s.lateDeliveries, defectRate: s.defectRate, priceChanges: s.priceChanges, terms: s.terms, score: s.score, outstanding: s.outstanding })) }, {
      maxTokens: 1800,
      prompt: "You are a sourcing analyst. Given supplier data, return STRICT JSON only: {\"bestPrice\":\"name\",\"bestQuality\":\"name\",\"bestReliability\":\"name\",\"bestOverall\":\"name\",\"reason\":\"one short line why best overall\"}. Never choose on price alone.",
    });
    let r = res.data ? parseJSON(res.data) : null;
    if (r && r.bestOverall) {
      out.innerHTML = `
        <div class="ai-band"><div class="card-title">AI SUPPLIER ANALYSIS</div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          ${[["Best price", r.bestPrice], ["Best quality", r.bestQuality], ["Best reliability", r.bestReliability], ["Best overall", r.bestOverall]].map(([l, v]) => `<div class="rounded-xl p-3 text-center" style="background:#fff;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">${l}</div><div class="text-[16px] font-black text-[#4338CA] mt-1">${esc(v || "—")}</div></div>`).join("")}
        </div>
        <div class="text-[12.5px] text-[#6B6B73] mt-3">${esc(r.reason || "")}</div></div>`;
    } else {
      const best = sups.slice().sort((a, b) => (b.score.reliability + b.score.quality) - (a.score.reliability + a.score.quality))[0];
      out.innerHTML = `<div class="ai-band"><div class="card-title">AI SUPPLIER ANALYSIS (computed)</div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div class="rounded-xl p-3 text-center" style="background:#fff;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Best price</div><div class="text-[16px] font-black text-[#4338CA] mt-1">${esc(sups.slice().sort((a, b) => a.avgCost - b.avgCost)[0].name)}</div></div>
          <div class="rounded-xl p-3 text-center" style="background:#fff;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Best quality</div><div class="text-[16px] font-black text-[#4338CA] mt-1">${esc(sups.slice().sort((a, b) => b.score.quality - a.score.quality)[0].name)}</div></div>
          <div class="rounded-xl p-3 text-center" style="background:#fff;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Best reliability</div><div class="text-[16px] font-black text-[#4338CA] mt-1">${esc(sups.slice().sort((a, b) => b.score.reliability - a.score.reliability)[0].name)}</div></div>
          <div class="rounded-xl p-3 text-center" style="background:#fff;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Best overall</div><div class="text-[16px] font-black text-[#4338CA] mt-1">${esc(best.name)}</div></div>
        </div>
        <div class="text-[12.5px] text-[#6B6B73] mt-3">Balanced on reliability + quality + delivery + terms, not price alone.</div></div>`;
    }
  }

  /* ---------------- sales ---------------- */
  function S_sales() {
    const a = agg();
    const bySrc = {};
    a.orders.forEach((o) => { bySrc[o.source] = bySrc[o.source] || { orders: 0, revenue: 0, delivered: 0 }; bySrc[o.source].orders++; if (o.status === "Delivered") { bySrc[o.source].delivered++; bySrc[o.source].revenue += o.total; } });
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Sales</div><div class="erp-title-sub">Channels · orders · quotation → sales order → invoice → payment</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-sale">${icon("plus", 15)} New sale</button>` : ""}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Revenue</div><div class="kpi-num text-[19px]">${money(a.kpis.revenue)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Orders</div><div class="kpi-num text-[19px]">${fmt(a.kpis.orderCount)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Delivered</div><div class="kpi-num text-[19px]">${fmt(a.kpis.delivered)}</div></div>
      <div class="kpi"><div class="kpi-lbl">AOV</div><div class="kpi-num text-[19px]">${money(a.kpis.aov)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Return rate</div><div class="kpi-num text-[19px]">${a.kpis.returnRate.toFixed(0)}%</div></div>
    </div>
    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("handshake", 18)}</span><div><div class="card-title">By channel</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${Object.entries(bySrc).map(([s, v]) => `<tr><td><b>${esc(s)}</b></td><td>${v.orders} orders</td><td>${v.delivered} delivered</td><td class="font-bold">${money(v.revenue)}</td></tr>`).join("")}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("trophy", 18)}</span><div><div class="card-title">Top sales agents</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${a.employees.filter((e) => ["Sales Agent", "Confirmation Agent"].includes(e.role)).map((e) => `<tr><td><b>${esc(e.name)}</b></td><td>${e.stats.orders} orders</td><td>${e.stats.confirms} confirms</td><td>${e.stats.interactions} interactions</td></tr>`).join("")}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("trending-up", 18)}</span><div><div class="card-title">Revenue trend</div></div></div>
        <canvas id="ch-sales" height="200"></canvas>
      </div>
    </div>`;
  }
  MOUNT.sales = () => {
    const a = agg();
    mkChart("ch-sales", { type: "line", data: { labels: a.days.map((d) => d.slice(4, 10)), datasets: [{ label: "Revenue", data: a.revSeries, borderColor: C.line, fill: true, backgroundColor: "rgba(79,70,229,.1)", tension: .35, pointRadius: 2 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => fmt(v) }, grid: { color: "#f2f2f5" } }, x: { grid: { display: false } } } } });
  };

  function newSaleForm() {
    const prods = load("products");
    const custs = load("customers");
    const whs = load("warehouses");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New sale</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="sale-form" class="grid grid-cols-2 gap-3 mt-4">
        <div><label class="label">Customer</label><select class="erp-select w-full" name="customerId">${custs.map((c) => `<option value="${c.id}">${esc(c.name)} · ${esc(c.phone)}</option>`).join("")}</select></div>
        <div><label class="label">Source</label><select class="erp-select w-full" name="source">${SOURCES.map((s) => `<option>${s}</option>`).join("")}</select></div>
        <div><label class="label">Product</label><select class="erp-select w-full" name="productId">${prods.filter((p) => stockFor(p.id).available > 0).map((p) => `<option value="${p.id}">${esc(p.name)} · ${fmt(p.discountPrice)}</option>`).join("")}</select></div>
        <div><label class="label">Qty</label><input class="erp-input w-full" type="number" name="qty" value="1" min="1"></div>
        <div><label class="label">Warehouse</label><select class="erp-select w-full" name="warehouseId">${whs.map((w) => `<option value="${w.id}">${esc(w.name)}</option>`).join("")}</select></div>
        <div><label class="label">Payment</label><select class="erp-select w-full" name="method"><option>COD</option><option>Cash</option><option>Bank transfer</option><option>Card</option><option>Online payment</option></select></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Complete sale</button></div>
      </form>`);
  }

  function completeSale(data) {
    const cust = load("customers").find((c) => c.id === data.customerId);
    const prod = load("products").find((p) => p.id === data.productId);
    const qty = Number(data.qty) || 1;
    const orders = load("orders");
    const price = prod.discountPrice || prod.sellingPrice;
    const total = price * qty + 450;
    const o = {
      id: uid(), orderNumber: "PL-" + String(10240 + orders.length), customerId: cust.id, customerName: cust.name, customerPhone: cust.phone, customerWilaya: cust.wilaya,
      items: [{ productId: prod.id, name: prod.name, sku: prod.sku, qty, price, cost: prod.supplierCost }],
      subtotal: price * qty, shipping: 450, discount: 0, tax: 0, total,
      paymentMethod: data.method, paymentStatus: data.method === "COD" ? "Unpaid" : "Paid",
      status: "Delivered", source: data.source, campaignId: "", adId: "", salesAgent: me().id, warehouseId: data.warehouseId,
      createdAt: new Date().toISOString(), deliveredAt: new Date().toISOString(), confirmedAt: new Date().toISOString(), shippedAt: new Date().toISOString(), notes: "",
    };
    o.profit = orderProfit(o); o.revenue = o.total;
    const inv = load("inventory");
    const row = inv.find((i) => i.productId === prod.id && i.warehouseId === data.warehouseId);
    if (row) { const before = row.onHand; if (row.onHand < qty) { toast("Not enough stock in that warehouse", "err"); return; } row.onHand -= qty; save("inventory", inv); logLedger({ date: new Date().toISOString(), productId: prod.id, productName: prod.name, variant: "—", warehouseId: data.warehouseId, qty: -qty, before, after: row.onHand, type: "Sale", ref: o.orderNumber, user: me().name, reason: "POS / manual sale" }); }
    upsert("orders", o);
    prod.sold = (prod.sold || 0) + qty; upsert("products", prod);
    cust.totalSpent = (cust.totalSpent || 0) + total; cust.lastPurchase = new Date().toISOString(); cust.orders = (cust.orders || 0) + 1; upsert("customers", cust);
    if (data.method !== "COD") upsert("payments", { id: uid(), invoiceId: "", customerName: cust.name, amount: total, currency: company().currency, date: new Date().toISOString(), method: data.method, ref: "POS-" + o.orderNumber });
    audit("Sale created", o.orderNumber + " · " + cust.name + " · " + money(total));
    toast("Sale " + o.orderNumber + " recorded · stock + ledger updated", "ok");
    shell();
  }

  /* ---------------- orders ---------------- */
  function S_orders() {
    const q = (state.q || "").toLowerCase();
    const list = load("orders").filter((o) => !q || o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || (o.customerPhone || "").includes(q));
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Orders</div><div class="erp-title-sub">${list.length} orders · connected to campaign, ad, customer, warehouse, finance</div></div>
      <div class="flex gap-2">
        ${can("export") ? `<button class="erp-btn ghost" data-action="export-orders">${icon("download", 15)} CSV</button>` : ""}
        <button class="erp-btn ghost" data-action="open-funnel">${icon("filter", 15)} Funnel</button>
      </div>
    </div>
    <div class="erp-table-wrap mt-3">
      <table class="erp-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Source</th><th>Campaign / Ad</th><th>Total</th><th>Status</th><th>Payment</th><th>Created</th></tr></thead>
        <tbody>${list.map((o) => {
          const camp = load("campaigns").find((c) => c.id === o.campaignId);
          const ad = load("ads").find((a) => a.id === o.adId);
          return `<tr class="cursor-pointer" data-action="open-order" data-id="${o.id}">
            <td><b>${esc(o.orderNumber)}</b></td>
            <td>${esc(o.customerName)}<div class="text-[11.5px] text-[#9A9AA2]">${esc(o.customerWilaya)}</div></td>
            <td>${o.items.map((it) => it.qty + "× " + esc(it.name)).join("<br>")}</td>
            <td>${esc(o.source)}</td>
            <td class="text-[12px]">${esc(camp ? camp.name : "—")}<br><span class="text-[#9A9AA2]">${esc(ad ? ad.name : "")}</span></td>
            <td><b>${money(o.total)}</b></td>
            <td><span class="pill ${orderPill(o.status)}">${o.status}</span></td>
            <td><span class="pill ${o.paymentStatus === "Paid" ? "green" : "amber"}">${o.paymentStatus}</span></td>
            <td>${fmtDate(o.createdAt)}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>
    </div>`;
  }
  MOUNT.orders = () => {};

  /* ---------------- cod / delivery ---------------- */
  function S_cod() {
    const orders = load("orders");
    const cod = orders.filter((o) => o.paymentMethod === "COD" || o.paymentStatus === "Unpaid");
    const byStatus = {};
    cod.forEach((o) => { byStatus[o.status] = byStatus[o.status] || []; byStatus[o.status].push(o); });
    const stages = ["Placed", "Confirmed", "Shipped", "Delivered", "Returned", "Cancelled"];
    const col = (s) => byStatus[s] || [];
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">COD Operations</div><div class="erp-title-sub">Cash on delivery · confirmation → shipping → delivery → returns</div></div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-6 gap-3 mt-3">
      ${stages.map((s, i) => `<div class="kpi${s === "Returned" ? " err" : ""}"><div class="kpi-lbl">${s}</div><div class="kpi-num text-[19px]">${col(s).length}<span class="kpi-arrow">${i > 0 ? "→" : ""}</span></div><div class="kpi-sub">${money(col(s).reduce((x, o) => x + o.total, 0))}</div></div>`).join("")}
    </div>
    <div class="grid lg:grid-cols-2 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("package", 18)}</span><div><div class="card-title">Confirmations</div><div class="card-sub">Awaiting customer confirmation</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${col("Placed").map((o) => `<tr><td><b>${esc(o.orderNumber)}</b></td><td>${esc(o.customerName)}</td><td>${money(o.total)}</td><td>${fmtDate(o.createdAt)}</td>${can("update") ? `<td><button class="erp-btn mini primary" data-action="confirm-order" data-id="${o.id}">Confirm</button></td>` : ""}</tr>`).join("") || `<tr><td colspan="4" class="empty">No pending confirmations</td></tr>`}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("truck", 18)}</span><div><div class="card-title">Ready to ship</div><div class="card-sub">Confirmed orders awaiting dispatch</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${col("Confirmed").map((o) => `<tr><td><b>${esc(o.orderNumber)}</b></td><td>${esc(o.customerName)}</td><td>${esc(o.customerWilaya)}</td><td>${money(o.total)}</td>${can("update") ? `<td><button class="erp-btn mini primary" data-action="ship-order" data-id="${o.id}">Ship</button></td>` : ""}</tr>`).join("") || `<tr><td colspan="5" class="empty">Nothing confirmed yet</td></tr>`}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("check-circle", 18)}</span><div><div class="card-title">In transit</div><div class="card-sub">Shipped, awaiting delivery confirmation</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${col("Shipped").map((o) => `<tr><td><b>${esc(o.orderNumber)}</b></td><td>${esc(o.customerName)}</td><td>${esc(o.customerWilaya)}</td><td>${money(o.total)}</td>${can("update") ? `<td><button class="erp-btn mini primary" data-action="deliver-order" data-id="${o.id}">Deliver</button></td>` : ""}</tr>`).join("") || `<tr><td colspan="5" class="empty">Nothing in transit</td></tr>`}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile red-soft">${icon("rotate-ccw", 18)}</span><div><div class="card-title">Returns & cancellations</div><div class="card-sub">Require restocking + refund workflows</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${[...col("Returned"), ...col("Cancelled")].map((o) => `<tr><td><b>${esc(o.orderNumber)}</b></td><td>${esc(o.customerName)}</td><td><span class="pill ${o.status === "Returned" ? "err" : "gray"}">${o.status}</span></td><td>${money(o.total)}</td></tr>`).join("") || `<tr><td colspan="4" class="empty">No returns or cancellations</td></tr>`}</tbody></table></div>
      </div>
    </div>`;
  }
  MOUNT.cod = () => {};

  /* ---------------- shipping ---------------- */
  function S_shipping() {
    const a = agg();
    const byWilaya = {};
    a.orders.filter((o) => o.status === "Delivered" || o.status === "Shipped").forEach((o) => {
      const w = o.customerWilaya;
      byWilaya[w] = byWilaya[w] || { delivered: 0, total: 0 };
      byWilaya[w].delivered++; byWilaya[w].total += o.total;
    });
    const couriers = ["Airbox Express", "Yalidine", "ZR Express", "SGL", "Ecotax"];
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Shipping & Delivery</div><div class="erp-title-sub">Couriers · wilaya zones · delivery performance</div></div>
      ${can("update") ? `<button class="erp-btn primary" data-action="new-transfer">${icon("plus", 15)} Record shipment</button>` : ""}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Delivered</div><div class="kpi-num text-[19px]">${fmt(a.kpis.delivered)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Delivery rate</div><div class="kpi-num text-[19px]">${a.kpis.deliveryRate.toFixed(0)}%</div></div>
      <div class="kpi"><div class="kpi-lbl">Avg shipping fee</div><div class="kpi-num text-[19px]">${money(a.orders.filter((o) => o.status === "Delivered").reduce((x, o) => x + o.shipping, 0) / Math.max(1, a.kpis.delivered))}</div></div>
      <div class="kpi"><div class="kpi-lbl">Wilayas covered</div><div class="kpi-num text-[19px]">${Object.keys(byWilaya).length}</div></div>
      <div class="kpi"><div class="kpi-lbl">Active couriers</div><div class="kpi-num text-[19px]">${couriers.length}</div></div>
    </div>
    <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("map-pin", 18)}</span><div><div class="card-title">Deliveries by wilaya</div></div></div>
      <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${Object.entries(byWilaya).sort((x, y) => y[1].delivered - x[1].delivered).map(([w, v]) => `<tr><td><b>${esc(w)}</b></td><td>${v.delivered} delivered</td><td>${money(v.total)} value</td><td><div class="bar"><div class="bar-fill" style="width:${Math.round(v.delivered / Math.max(1, Object.entries(byWilaya)[0][1].delivered) * 100)}%"></div></div></td></tr>`).join("")}</tbody></table></div>
    </div>`;
  }
  MOUNT.shipping = () => {};

  /* ---------------- returns ---------------- */
  function S_returns() {
    const list = load("orders").filter((o) => o.status === "Returned" || o.status === "Cancelled");
    const refunds = list.filter((o) => o.status === "Returned");
    const rec = load("receivables");
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Returns & Refunds</div><div class="erp-title-sub">Restocking · refund tracking · quality signals</div></div>
    </div>
    <div class="grid grid-cols-3 gap-3 mt-3">
      <div class="kpi"><div class="kpi-lbl">Returned</div><div class="kpi-num text-[19px]">${refunds.length}</div></div>
      <div class="kpi err"><div class="kpi-lbl">Refund value</div><div class="kpi-num text-[19px]">${money(refunds.reduce((x, o) => x + o.total, 0))}</div></div>
      <div class="kpi"><div class="kpi-lbl">Return rate</div><div class="kpi-num text-[19px]">${agg().kpis.returnRate.toFixed(0)}%</div></div>
    </div>
    <div class="erp-table-wrap mt-4"><table class="erp-table">
      <thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Status</th><th>Total</th><th>Refunded</th><th>Reason</th><th>Date</th></tr></thead>
      <tbody>${list.map((o) => {
        const reason = o.notes || "—";
        const isRefunded = rec.some((r) => r.orderId === o.id && r.type === "refund");
        return `<tr>
          <td><b>${esc(o.orderNumber)}</b></td><td>${esc(o.customerName)}</td>
          <td>${o.items.map((it) => it.qty + "× " + esc(it.name)).join("<br>")}</td>
          <td><span class="pill ${o.status === "Returned" ? "err" : "gray"}">${o.status}</span></td>
          <td><b>${money(o.total)}</b></td>
          <td>${isRefunded ? `<span class="pill green">Refunded</span>` : o.status === "Returned" && can("update") ? `<button class="erp-btn mini primary" data-action="mark-refunded" data-id="${o.id}">Mark refunded</button>` : `<span class="text-[12px] text-[#9A9AA2]">—</span>`}</td>
          <td class="text-[12px]">${esc(reason)}</td>
          <td>${fmtDate(o.updatedAt || o.createdAt)}</td>
        </tr>`;
      }).join("") || `<tr><td colspan="8" class="empty">No returns yet</td></tr>`}</tbody>
    </table></div>`;
  }
  MOUNT.returns = () => {};

  /* ---------------- customers ---------------- */
  function S_customers() {
    const q = (state.q || "").toLowerCase();
    const list = load("customers").filter((c) => !q || c.name.toLowerCase().includes(q) || (c.phone || "").includes(q) || c.wilaya.toLowerCase().includes(q));
    const groups = { vip: list.filter((c) => c.segment === "VIP"), reg: list.filter((c) => c.segment !== "VIP") };
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Customers</div><div class="erp-title-sub">${list.length} customers · lifetime value · segmentation</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-customer">${icon("plus", 15)} New customer</button>` : ""}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Total customers</div><div class="kpi-num text-[19px]">${list.length}</div></div>
      <div class="kpi"><div class="kpi-lbl">VIP</div><div class="kpi-num text-[19px]">${groups.vip.length}</div></div>
      <div class="kpi"><div class="kpi-lbl">Lifetime value</div><div class="kpi-num text-[19px]">${money(list.reduce((x, c) => x + (c.totalSpent || 0), 0))}</div></div>
      <div class="kpi"><div class="kpi-lbl">Repeat rate</div><div class="kpi-num text-[19px]">${(list.filter((c) => (c.orders || 0) > 1).length / Math.max(1, list.length) * 100).toFixed(0)}%</div></div>
    </div>
    <div class="erp-table-wrap mt-4"><table class="erp-table">
      <thead><tr><th>Customer</th><th>Contact</th><th>Wilaya</th><th>Segment</th><th>Orders</th><th>LTV</th><th>Last purchase</th></tr></thead>
      <tbody>${list.map((c) => `<tr class="cursor-pointer" data-action="open-customer" data-id="${c.id}">
        <td><b>${esc(c.name)}</b></td>
        <td class="text-[12px]">${esc(c.phone || "")}<br><span class="text-[#9A9AA2]">${esc(c.email || "")}</span></td>
        <td>${esc(c.wilaya)}</td>
        <td><span class="pill ${c.segment === "VIP" ? "indigo" : "gray"}">${c.segment}</span></td>
        <td>${c.orders || 0}</td>
        <td><b>${money(c.totalSpent || 0)}</b></td>
        <td>${c.lastPurchase ? fmtDate(c.lastPurchase) : "—"}</td>
      </tr>`).join("")}</tbody>
    </table></div>`;
  }
  MOUNT.customers = () => {};

  function openCustomer(id) {
    const c = load("customers").find((x) => x.id === id);
    if (!c) return;
    const o = load("orders").filter((x) => x.customerId === id);
    const t = load("tasks").filter((x) => (x.relatedId || "") === id);
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">${esc(c.name)}</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex flex-wrap gap-4 mt-3 text-[13px]">
        <span class="pill indigo">${c.segment}</span>
        <span class="text-[#9A9AA2]">${esc(c.phone || "")} · ${esc(c.email || "")} · ${esc(c.wilaya)}</span>
        <span><b>${c.orders || 0}</b> orders</span>
        <span>LTV <b>${money(c.totalSpent || 0)}</b></span>
        ${c.lastPurchase ? `<span>Last purchase ${fmtDate(c.lastPurchase)}</span>` : ""}
      </div>
      <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("shopping-bag", 18)}</span><div><div class="card-title">Order history</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${o.map((x) => `<tr class="cursor-pointer" data-action="open-order" data-id="${x.id}"><td><b>${esc(x.orderNumber)}</b></td><td>${x.items.map((it) => it.qty + "× " + esc(it.name)).join("<br>")}</td><td><span class="pill ${orderPill(x.status)}">${x.status}</span></td><td>${money(x.total)}</td><td>${fmtDate(x.createdAt)}</td></tr>`).join("") || `<tr><td colspan="5" class="empty">No orders yet</td></tr>`}</tbody></table></div>
      </div>
      ${t.length ? `<div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("clipboard", 18)}</span><div><div class="card-title">Follow-up tasks</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${t.map((x) => `<tr><td><b>${esc(x.title)}</b></td><td><span class="pill ${x.priority === "High" ? "err" : x.priority === "Medium" ? "amber" : "green"}">${x.priority}</span></td><td>${x.status}</td><td>${x.assignedTo}</td></tr>`).join("")}</tbody></table></div></div>` : ""}
    `);
  }

  function newCustomerForm() {
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New customer</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="customer-form" class="grid grid-cols-2 gap-3 mt-4">
        <div class="col-span-2"><label class="label">Name</label><input class="erp-input w-full" name="name" required></div>
        <div><label class="label">Phone</label><input class="erp-input w-full" name="phone"></div>
        <div><label class="label">Wilaya</label><input class="erp-input w-full" name="wilaya"></div>
        <div><label class="label">Email</label><input class="erp-input w-full" name="email"></div>
        <div><label class="label">Segment</label><select class="erp-select w-full" name="segment"><option>New</option><option>Regular</option><option>VIP</option><option>At risk</option></select></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Save customer</button></div>
      </form>`);
  }

  /* ---------------- crm ---------------- */
  function S_crm() {
    const leads = load("leads");
    const stages = ["New", "Contacted", "Qualified", "Proposal", "Won"];
    const byStage = {};
    leads.forEach((l) => { byStage[l.status] = byStage[l.status] || []; byStage[l.status].push(l); });
    const tasks = load("tasks");
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">CRM</div><div class="erp-title-sub">Leads pipeline · follow-ups · campaign attribution</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-lead">${icon("plus", 15)} New lead</button>` : ""}
    </div>
    <div class="grid grid-cols-5 gap-2 mt-3 pipeline">
      ${stages.map((s) => `<div class="pipeline-col"><div class="pipeline-head">${s} <span class="pill indigo">${(byStage[s] || []).length}</span></div>${(byStage[s] || []).map((l) => `<div class="pipeline-card cursor-pointer" data-action="open-lead" data-id="${l.id}"><div class="flex items-center justify-between"><b>${esc(l.name)}</b><span class="pill ${l.source === "Meta Ads" ? "blue" : l.source === "TikTok" ? "pink" : "green"}">${esc(l.source)}</span></div><div class="text-[12px] text-[#9A9AA2] mt-1">${esc(l.phone || "")} · ${esc(l.wilaya || "")}</div><div class="flex items-center justify-between mt-2"><span class="text-[11.5px] text-[#9A9AA2]">${esc(l.campaignName || "")}</span><span class="text-[11.5px] font-bold">${money(l.value || 0)}</span></div></div>`).join("") || `<div class="pipeline-empty">Empty</div>`}</div>`).join("")}
    </div>
    <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("clipboard", 18)}</span><div><div class="card-title">Follow-up tasks</div></div></div>
      <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${tasks.map((t) => `<tr><td><b>${esc(t.title)}</b></td><td>${esc(t.type)}</td><td><span class="pill ${t.priority === "High" ? "err" : t.priority === "Medium" ? "amber" : "green"}">${t.priority}</span></td><td><span class="pill ${t.status === "Done" ? "green" : t.status === "In progress" ? "indigo" : "gray"}">${t.status}</span></td><td>${esc(t.assignedTo)}</td><td>${t.due ? fmtDate(t.due) : "—"}</td></tr>`).join("") || `<tr><td colspan="6" class="empty">No tasks</td></tr>`}</tbody></table></div>
    </div>`;
  }
  MOUNT.crm = () => {};

  function newLeadForm() {
    const camps = load("campaigns");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New lead</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="lead-form" class="grid grid-cols-2 gap-3 mt-4">
        <div><label class="label">Name</label><input class="erp-input w-full" name="name" required></div>
        <div><label class="label">Phone</label><input class="erp-input w-full" name="phone"></div>
        <div><label class="label">Wilaya</label><input class="erp-input w-full" name="wilaya"></div>
        <div><label class="label">Source</label><select class="erp-select w-full" name="source"><option>Meta Ads</option><option>TikTok</option><option>Google</option><option>Referral</option><option>Instagram</option><option>Facebook</option><option>Walk-in</option></select></div>
        <div><label class="label">Campaign</label><select class="erp-select w-full" name="campaignId">${camps.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></div>
        <div><label class="label">Value (₦)</label><input class="erp-input w-full" type="number" name="value" value="0"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Save lead</button></div>
      </form>`);
  }

  function openLead(id) {
    const l = load("leads").find((x) => x.id === id);
    if (!l) return;
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">${esc(l.name)}</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex flex-wrap gap-4 mt-3 text-[13px]">
        <span class="pill ${l.source === "Meta Ads" ? "blue" : l.source === "TikTok" ? "pink" : "green"}">${esc(l.source)}</span>
        <span class="pill indigo">${l.status}</span>
        <span class="text-[#9A9AA2]">${esc(l.phone || "")} · ${esc(l.email || "")} · ${esc(l.wilaya || "")}</span>
        <span>Value <b>${money(l.value || 0)}</b></span>
        <span>${esc(l.campaignName || "")}</span>
      </div>
      <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("activity", 18)}</span><div><div class="card-title">Advance lead</div></div></div>
        <div class="flex flex-wrap gap-2 mt-2">${["Contacted", "Qualified", "Proposal", "Won", "Lost"].map((s) => `<button class="erp-btn mini ${l.status === s ? "primary" : "ghost"}" data-action="advance-lead" data-id="${l.id}" data-to="${s}">${s}</button>`).join("")}</div>
        <div class="text-[12.5px] text-[#6B6B73] mt-3">${esc(l.notes || "")}</div>
      </div>
    `);
  }

  /* ---------------- invoicing ---------------- */
  function S_invoices() {
    const invs = load("invoices");
    const q = (state.q || "").toLowerCase();
    const list = invs.filter((i) => !q || i.number.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q));
    const tot = list.reduce((x, i) => x + i.total, 0);
    const paid = list.filter((i) => i.status === "Paid").reduce((x, i) => x + i.total, 0);
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Invoices</div><div class="erp-title-sub">${list.length} invoices · billing documents</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-invoice">${icon("plus", 15)} New invoice</button>` : ""}
    </div>
    <div class="grid grid-cols-3 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Total billed</div><div class="kpi-num text-[19px]">${money(tot)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Collected</div><div class="kpi-num text-[19px]">${money(paid)}</div></div>
      <div class="kpi amber"><div class="kpi-lbl">Outstanding</div><div class="kpi-num text-[19px]">${money(tot - paid)}</div></div>
    </div>
    <div class="erp-table-wrap mt-4"><table class="erp-table">
      <thead><tr><th>Invoice</th><th>Customer</th><th>Date</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th></th></tr></thead>
      <tbody>${list.map((i) => `<tr class="cursor-pointer" data-action="open-invoice" data-id="${i.id}">
        <td><b>${esc(i.number)}</b></td><td>${esc(i.customerName)}</td><td>${fmtDate(i.date)}</td>
        <td>${money(i.total)}</td><td>${money(i.paid || 0)}</td><td>${money((i.total || 0) - (i.paid || 0))}</td>
        <td><span class="pill ${i.status === "Paid" ? "green" : i.status === "Partial" ? "amber" : "gray"}">${i.status}</span></td>
        <td class="text-right">${icon("chevron-right", 15, "#9A9AA2")}</td>
      </tr>`).join("")}</tbody>
    </table></div>`;
  }
  MOUNT.invoices = () => {};

  function openInvoice(id) {
    const i = load("invoices").find((x) => x.id === id);
    if (!i) return;
    const due = (i.total || 0) - (i.paid || 0);
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">${esc(i.number)}</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex flex-wrap gap-4 mt-3 text-[13px]">
        <span class="pill ${i.status === "Paid" ? "green" : i.status === "Partial" ? "amber" : "gray"}">${i.status}</span>
        <span class="text-[#9A9AA2]">${esc(i.customerName)} · ${fmtDate(i.date)}</span>
        <span>Total <b>${money(i.total)}</b></span>
        <span>Paid <b>${money(i.paid || 0)}</b></span>
        ${due > 0 ? `<span class="text-[#DC2626]">Balance ${money(due)}</span>` : ""}
      </div>
      <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("file-text", 18)}</span><div><div class="card-title">Line items</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${(i.items || []).map((it) => `<tr><td>${esc(it.name)}</td><td>${it.qty}×</td><td>${money(it.price)}</td><td class="font-bold">${money(it.price * it.qty)}</td></tr>`).join("")}</tbody></table></div>
      </div>
      <div class="flex justify-end mt-3">${due > 0 && can("update") ? `<button class="erp-btn primary" data-action="record-payment" data-invoice="${i.id}" data-amount="${due}">${icon("dollar-sign", 15)} Record payment</button>` : ""}</div>
    `);
  }

  function newInvoiceForm() {
    const custs = load("customers");
    const prods = load("products");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New invoice</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="invoice-form" class="grid grid-cols-2 gap-3 mt-4">
        <div><label class="label">Customer</label><select class="erp-select w-full" name="customerId">${custs.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></div>
        <div><label class="label">Product</label><select class="erp-select w-full" name="productId">${prods.map((p) => `<option value="${p.id}">${esc(p.name)} · ${fmt(p.sellingPrice)}</option>`).join("")}</select></div>
        <div><label class="label">Qty</label><input class="erp-input w-full" type="number" name="qty" value="1" min="1"></div>
        <div><label class="label">Unit price</label><input class="erp-input w-full" type="number" name="price"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Create invoice</button></div>
      </form>`);
  }

  /* ---------------- payments & expenses ---------------- */
  function S_payments() {
    const list = load("payments");
    const rec = load("receivables");
    const q = (state.q || "").toLowerCase();
    const filtered = list.filter((p) => !q || p.customerName.toLowerCase().includes(q) || (p.ref || "").toLowerCase().includes(q));
    const tot = filtered.reduce((x, p) => x + p.amount, 0);
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Payments</div><div class="erp-title-sub">Incoming cash · methods · receivables</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-payment">${icon("plus", 15)} Record payment</button>` : ""}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Collected</div><div class="kpi-num text-[19px]">${money(tot)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Cash</div><div class="kpi-num text-[19px]">${money(filtered.filter((p) => p.method === "Cash").reduce((x, p) => x + p.amount, 0))}</div></div>
      <div class="kpi"><div class="kpi-lbl">Card / online</div><div class="kpi-num text-[19px]">${money(filtered.filter((p) => ["Card", "Online payment", "Bank transfer"].includes(p.method)).reduce((x, p) => x + p.amount, 0))}</div></div>
      <div class="kpi amber"><div class="kpi-lbl">Receivables</div><div class="kpi-num text-[19px]">${money(rec.reduce((x, r) => x + (r.amount || 0), 0))}</div></div>
    </div>
    <div class="erp-table-wrap mt-4"><table class="erp-table">
      <thead><tr><th>Ref</th><th>Customer</th><th>Method</th><th>Amount</th><th>Date</th></tr></thead>
      <tbody>${filtered.map((p) => `<tr><td><b>${esc(p.ref || "PAY-" + p.id.slice(0, 5))}</b></td><td>${esc(p.customerName)}</td><td>${esc(p.method)}</td><td><b>${money(p.amount)}</b></td><td>${fmtDate(p.date)}</td></tr>`).join("") || `<tr><td colspan="5" class="empty">No payments recorded</td></tr>`}</tbody>
    </table></div>`;
  }
  MOUNT.payments = () => {};

  function S_expenses() {
    const list = load("expenses");
    const q = (state.q || "").toLowerCase();
    const filtered = list.filter((e) => !q || e.category.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    const byCat = {};
    filtered.forEach((e) => { byCat[e.category] = byCat[e.category] || 0; byCat[e.category] += e.amount; });
    const byCatArr = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Expenses</div><div class="erp-title-sub">Outgoing cash by category</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-expense">${icon("plus", 15)} Add expense</button>` : ""}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
      <div class="kpi err"><div class="kpi-lbl">Total spent</div><div class="kpi-num text-[19px]">${money(filtered.reduce((x, e) => x + e.amount, 0))}</div></div>
      ${byCatArr.slice(0, 3).map(([c, v]) => `<div class="kpi"><div class="kpi-lbl">${esc(c)}</div><div class="kpi-num text-[19px]">${money(v)}</div></div>`).join("")}
    </div>
    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("pie-chart", 18)}</span><div><div class="card-title">By category</div></div></div>
        <div class="mt-2">${byCatArr.map(([c, v], i) => `<div class="flex items-center gap-2 mb-1.5 text-[12.5px]"><span class="dot" style="background:${CHART_COLORS[i % CHART_COLORS.length]}"></span><span class="flex-1">${esc(c)}</span><b>${money(v)}</b><span class="text-[#9A9AA2]">${Math.round(v / Math.max(1, byCatArr[0][1]) * 100)}%</span></div>`).join("")}</div>
      </div>
      <div class="card lg:col-span-2"><div class="card-head"><span class="icon-tile green-soft">${icon("list", 18)}</span><div><div class="card-title">Transactions</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${filtered.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map((e) => `<tr><td><b>${esc(e.description)}</b></td><td><span class="pill indigo">${esc(e.category)}</span></td><td>${e.method}</td><td class="text-[#DC2626] font-bold">−${money(e.amount)}</td><td>${fmtDate(e.date)}</td></tr>`).join("") || `<tr><td colspan="5" class="empty">No expenses</td></tr>`}</tbody></table></div>
      </div>
    </div>`;
  }
  MOUNT.expenses = () => {};

  function newExpenseForm() {
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">Add expense</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="expense-form" class="grid grid-cols-2 gap-3 mt-4">
        <div class="col-span-2"><label class="label">Description</label><input class="erp-input w-full" name="description" required></div>
        <div><label class="label">Category</label><select class="erp-select w-full" name="category">${["Ads", "Salaries", "Rent", "Shipping", "Supplies", "Packaging", "Software", "Utilities", "Maintenance", "Other"].map((c) => `<option>${c}</option>`).join("")}</select></div>
        <div><label class="label">Amount (${company().currency})</label><input class="erp-input w-full" type="number" name="amount" required></div>
        <div><label class="label">Method</label><select class="erp-select w-full" name="method"><option>Cash</option><option>Bank transfer</option><option>Card</option><option>Online payment</option></select></div>
        <div><label class="label">Date</label><input class="erp-input w-full" type="date" name="date" value="${new Date().toISOString().slice(0, 10)}"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Save expense</button></div>
      </form>`);
  }

  /* ---------------- finance ---------------- */
  function S_finance() {
    const a = agg();
    const inv = load("invoices");
    const rec = load("receivables");
    const pay = load("payments");
    const exp = load("expenses");
    const totalExp = exp.reduce((x, e) => x + e.amount, 0);
    const collected = pay.reduce((x, p) => x + p.amount, 0) + inv.filter((i) => i.status === "Paid").reduce((x, i) => x + i.total, 0);
    const gross = a.kpis.revenue;
    const net = gross - totalExp;
    const cogs = a.products.reduce((x, p) => x + (p.supplierCost || 0) * (p.sold || 0), 0);
    const gp = gross - cogs;
    const cashIn = collected + rec.filter((r) => r.type === "refund").reduce((x, r) => x - (r.amount || 0), 0);
    const cashOut = totalExp + cogs;
    const cashFlow = cashIn - cashOut;
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Finance</div><div class="erp-title-sub">P&L · cash flow · receivables & payables</div></div>
      <button class="erp-btn ghost" data-action="export-finance">${icon("download", 15)} Export</button>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Gross profit</div><div class="kpi-num text-[19px]">${money(gp)}</div><div class="kpi-sub">Revenue ${money(gross)} − COGS ${money(cogs)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Net (simplified)</div><div class="kpi-num text-[19px]">${money(net)}</div><div class="kpi-sub">Gross − operating expenses</div></div>
      <div class="kpi amber"><div class="kpi-lbl">Receivables</div><div class="kpi-num text-[19px]">${money(rec.reduce((x, r) => x + (r.amount || 0), 0))}</div><div class="kpi-sub">Outstanding customer balances</div></div>
      <div class="kpi ${cashFlow >= 0 ? "" : "err"}"><div class="kpi-lbl">Cash flow</div><div class="kpi-num text-[19px]">${money(cashFlow)}</div><div class="kpi-sub">In ${money(cashIn)} − Out ${money(cashOut)}</div></div>
    </div>
    <div class="grid lg:grid-cols-3 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("bar-chart", 18)}</span><div><div class="card-title">Cash flow</div></div></div>
        <canvas id="ch-finance" height="190"></canvas>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("trending-up", 18)}</span><div><div class="card-title">Revenue vs expenses</div></div></div>
        <canvas id="ch-finance2" height="190"></canvas>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("receipt", 18)}</span><div><div class="card-title">Top expenses</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${exp.slice().sort((x, y) => y.amount - x.amount).slice(0, 6).map((e) => `<tr><td>${esc(e.description)}</td><td><span class="pill indigo">${esc(e.category)}</span></td><td class="text-[#DC2626] font-bold">−${money(e.amount)}</td></tr>`).join("") || `<tr><td colspan="3" class="empty">No expenses</td></tr>`}</tbody></table></div>
      </div>
    </div>`;
  }
  MOUNT.finance = () => {
    const a = agg();
    mkChart("ch-finance", { type: "line", data: { labels: a.days.map((d) => d.slice(4, 10)), datasets: [{ label: "Cash flow", data: a.revSeries.map((r, i) => r - (a.expSeries[i] || 0)), borderColor: "#059669", fill: true, backgroundColor: "rgba(5,150,105,.1)", tension: .35, pointRadius: 2 }] }, options: { plugins: { legend: { display: false } }, scales: { y: { ticks: { callback: (v) => fmt(v) }, grid: { color: "#f2f2f5" } }, x: { grid: { display: false } } } } });
    mkChart("ch-finance2", { type: "bar", data: { labels: a.days.map((d) => d.slice(4, 10)), datasets: [{ label: "Revenue", data: a.revSeries, backgroundColor: "#4f46e5", borderRadius: 3 }, { label: "Expenses", data: a.expSeries, backgroundColor: "#f97316", borderRadius: 3 }] }, options: { plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } }, scales: { y: { ticks: { callback: (v) => fmt(v) }, grid: { color: "#f2f2f5" } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } } } } });
  };

  /* ---------------- employees ---------------- */
  function S_employees() {
    const list = load("users");
    const tasks = load("tasks");
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Employees</div><div class="erp-title-sub">${list.length} employees · roles & permissions · workload</div></div>
      ${can("manage") ? `<button class="erp-btn primary" data-action="new-user">${icon("plus", 15)} Invite</button>` : ""}
    </div>
    <div class="grid lg:grid-cols-3 gap-4 mt-3">
      ${list.map((u) => {
        const uTasks = tasks.filter((t) => t.assignedTo === u.name && t.status !== "Done");
        const openCount = uTasks.length;
        return `<div class="card p-4">
          <div class="flex items-center gap-3">
            <div class="avatar ${u.role === "Owner" || u.role === "Super Admin" ? "indigo" : ""}" style="background:${AVATAR_COLORS[hash(u.name) % AVATAR_COLORS.length]}">${esc(u.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</div>
            <div class="flex-1"><div class="font-bold text-[14px]">${esc(u.name)}</div><div class="text-[12px] text-[#9A9AA2]">${esc(u.email)}</div></div>
            <span class="pill indigo">${esc(u.role)}</span>
          </div>
          <div class="flex items-center justify-between mt-3 text-[12px] text-[#6B6B73]">
            <span>${u.stat == null ? "" : ""}Open tasks: <b>${openCount}</b></span>
            <span>Permissions: <b>${ROLE_LEVEL[u.role] || 10}/${ROLE_LEVEL.Owner}</b></span>
          </div>
          <div class="mt-3 text-[11.5px] text-[#9A9AA2]">Joined ${fmtDate(u.createdAt || u.joined || new Date().toISOString())} · ${esc(u.status || "Active")}</div>
        </div>`;
      }).join("")}
    </div>`;
  }
  MOUNT.employees = () => {};

  function newUserForm() {
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">Invite employee</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="user-form" class="grid grid-cols-2 gap-3 mt-4">
        <div class="col-span-2"><label class="label">Name</label><input class="erp-input w-full" name="name" required></div>
        <div><label class="label">Email</label><input class="erp-input w-full" type="email" name="email" required></div>
        <div><label class="label">Role</label><select class="erp-select w-full" name="role">${Object.keys(ROLES).map((r) => `<option>${r}</option>`).join("")}</select></div>
        <div><label class="label">Department</label><select class="erp-select w-full" name="department"><option>Sales</option><option>Marketing</option><option>Operations</option><option>Finance</option><option>HR</option></select></div>
        <div><label class="label">Base salary</label><input class="erp-input w-full" type="number" name="salary" value="30000"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Invite</button></div>
      </form>`);
  }

  /* ---------------- tasks ---------------- */
  function S_tasks() {
    const list = load("tasks");
    const cols = ["To do", "In progress", "Done"];
    const by = { "To do": [], "In progress": [], Done: [] };
    list.forEach((t) => { if (by[t.status]) by[t.status].push(t); });
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Tasks</div><div class="erp-title-sub">${list.length} tasks · assignments · deadlines</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-task">${icon("plus", 15)} New task</button>` : ""}
    </div>
    <div class="grid grid-cols-3 gap-3 mt-3 pipeline">
      ${cols.map((c) => `<div class="pipeline-col"><div class="pipeline-head">${c} <span class="pill indigo">${by[c].length}</span></div>${by[c].map((t) => `<div class="pipeline-card cursor-pointer" data-action="open-task" data-id="${t.id}"><div class="flex items-center justify-between"><b>${esc(t.title)}</b><span class="pill ${t.priority === "High" ? "err" : t.priority === "Medium" ? "amber" : "green"}">${t.priority}</span></div><div class="text-[12px] text-[#9A9AA2] mt-1">${esc(t.type)} · assigned ${esc(t.assignedTo)}</div>${t.due ? `<div class="text-[11.5px] mt-1 ${new Date(t.due) < new Date() && t.status !== "Done" ? "text-[#DC2626]" : "text-[#9A9AA2]"}">Due ${fmtDate(t.due)}${new Date(t.due) < new Date() && t.status !== "Done" ? " · overdue" : ""}</div>` : ""}</div>`).join("") || `<div class="pipeline-empty">Empty</div>`}</div>`).join("")}
    </div>`;
  }
  MOUNT.tasks = () => {};

  function openTask(id) {
    const t = load("tasks").find((x) => x.id === id);
    if (!t) return;
    const users = load("users");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">${esc(t.title)}</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex flex-wrap gap-3 mt-3 text-[13px]">
        <span class="pill ${t.priority === "High" ? "err" : t.priority === "Medium" ? "amber" : "green"}">${t.priority}</span>
        <span class="pill indigo">${t.status}</span>
        <span class="text-[#9A9AA2]">${esc(t.type)} · ${esc(t.assignedTo)}</span>
        ${t.due ? `<span>Due ${fmtDate(t.due)}</span>` : ""}
      </div>
      <div class="text-[13px] text-[#6B6B73] mt-3">${esc(t.notes || t.description || "")}</div>
      <div class="flex flex-wrap gap-2 mt-4">${can("update") ? ["To do", "In progress", "Done"].map((s) => `<button class="erp-btn mini ${t.status === s ? "primary" : "ghost"}" data-action="set-task" data-id="${t.id}" data-to="${s}">${s}</button>`).join("") : ""}</div>
    `);
  }

  function newTaskForm() {
    const users = load("users");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New task</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="task-form" class="grid grid-cols-2 gap-3 mt-4">
        <div class="col-span-2"><label class="label">Title</label><input class="erp-input w-full" name="title" required></div>
        <div><label class="label">Type</label><select class="erp-select w-full" name="type"><option>Call</option><option>Follow-up</option><option>Delivery</option><option>Packing</option><option>Invoicing</option><option>Admin</option></select></div>
        <div><label class="label">Assigned to</label><select class="erp-select w-full" name="assignedTo">${users.map((u) => `<option>${esc(u.name)}</option>`).join("")}</select></div>
        <div><label class="label">Priority</label><select class="erp-select w-full" name="priority"><option>Medium</option><option>High</option><option>Low</option></select></div>
        <div><label class="label">Due</label><input class="erp-input w-full" type="date" name="due"></div>
        <div class="col-span-2"><label class="label">Notes</label><textarea class="erp-input w-full" name="notes" rows="2"></textarea></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Create task</button></div>
      </form>`);
  }

  /* ---------------- marketing & ads ---------------- */
  function S_marketing() {
    const camps = load("campaigns");
    const ads = load("ads");
    const orders = load("orders");
    const totalSpend = camps.reduce((x, c) => x + c.budget, 0) + ads.reduce((x, a) => x + (a.spend || 0), 0);
    const att = (cid) => {
      let rev = 0;
      orders.forEach((o) => { if (o.campaignId === cid) rev += o.total; });
      return rev;
    };
    const totalRev = camps.reduce((x, c) => x + att(c.id), 0);
    const roas = totalSpend > 0 ? totalRev / totalSpend : 0;
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Marketing</div><div class="erp-title-sub">Campaigns · ad spend · ROAS attribution</div></div>
      ${can("create") ? `<button class="erp-btn primary" data-action="new-campaign">${icon("plus", 15)} New campaign</button>` : ""}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Spend</div><div class="kpi-num text-[19px]">${money(totalSpend)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Attributed revenue</div><div class="kpi-num text-[19px]">${money(totalRev)}</div></div>
      <div class="kpi ${roas >= 2 ? "green" : "amber"}"><div class="kpi-lbl">ROAS</div><div class="kpi-num text-[19px]">${roas.toFixed(2)}×</div></div>
      <div class="kpi"><div class="kpi-lbl">Campaigns</div><div class="kpi-num text-[19px]">${camps.length} / ${ads.length} ads</div></div>
    </div>
    <div class="grid lg:grid-cols-2 gap-4 mt-4">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("megaphone", 18)}</span><div><div class="card-title">Campaigns</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${camps.map((c) => { const r = att(c.id); const ro = c.budget > 0 ? r / c.budget : 0; return `<tr class="cursor-pointer" data-action="open-campaign" data-id="${c.id}"><td><b>${esc(c.name)}</b></td><td><span class="pill ${c.status === "Active" ? "green" : "gray"}">${c.status}</span></td><td>${money(c.budget)}</td><td>${money(r)}</td><td class="font-bold ${ro >= 2 ? "text-[#059669]" : "text-[#D97706]"}">${ro.toFixed(1)}×</td></tr>`; }).join("") || `<tr><td colspan="5" class="empty">No campaigns</td></tr>`}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("target", 18)}</span><div><div class="card-title">Top ads</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${ads.slice().sort((x, y) => (y.spend ? y.impressions : 0) - (x.spend ? x.impressions : 0)).slice(0, 8).map((a) => { const ro = a.spend > 0 ? (a.revenue || 0) / a.spend : 0; return `<tr class="cursor-pointer" data-action="open-ad" data-id="${a.id}"><td><b>${esc(a.name)}</b></td><td class="text-[12px]">${fmt(a.impressions)} impr</td><td>${money(a.spend || 0)}</td><td>${money(a.revenue || 0)}</td><td class="font-bold ${ro >= 2 ? "text-[#059669]" : "text-[#D97706]"}">${ro.toFixed(1)}×</td></tr>`; }).join("") || `<tr><td colspan="5" class="empty">No ads</td></tr>`}</tbody></table></div>
      </div>
    </div>`;
  }
  MOUNT.marketing = () => {};

  function openCampaign(id) {
    const c = load("campaigns").find((x) => x.id === id);
    if (!c) return;
    const ads = load("ads").filter((a) => a.campaignId === id);
    const o = load("orders").filter((x) => x.campaignId === id);
    const rev = o.reduce((x, z) => x + z.total, 0);
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">${esc(c.name)}</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex flex-wrap gap-3 mt-3 text-[13px]">
        <span class="pill ${c.status === "Active" ? "green" : "gray"}">${c.status}</span>
        <span>Budget <b>${money(c.budget)}</b></span>
        <span>Revenue <b>${money(rev)}</b></span>
        <span>ROAS <b class="${c.budget > 0 && rev / c.budget >= 2 ? "text-[#059669]" : "text-[#D97706]"}">${(c.budget > 0 ? rev / c.budget : 0).toFixed(1)}×</b></span>
        <span class="text-[#9A9AA2]">${fmtDate(c.start)} → ${fmtDate(c.end)}</span>
      </div>
      <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("target", 18)}</span><div><div class="card-title">Ads in campaign</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${ads.map((a) => `<tr class="cursor-pointer" data-action="open-ad" data-id="${a.id}"><td><b>${esc(a.name)}</b></td><td>${fmt(a.impressions)}</td><td>${fmt(a.clicks)} clicks</td><td>${money(a.spend || 0)}</td><td>${money(a.revenue || 0)}</td></tr>`).join("") || `<tr><td colspan="5" class="empty">No ads</td></tr>`}</tbody></table></div>
      </div>
    `);
  }

  function openAd(id) {
    const a = load("ads").find((x) => x.id === id);
    if (!a) return;
    const camp = load("campaigns").find((c) => c.id === a.campaignId);
    const ctr = a.impressions > 0 ? (a.clicks / a.impressions * 100).toFixed(2) : "0.00";
    const ro = a.spend > 0 ? (a.revenue || 0) / a.spend : 0;
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">${esc(a.name)}</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex flex-wrap gap-3 mt-3 text-[13px]">
        <span class="pill ${a.status === "Active" ? "green" : "gray"}">${a.status}</span>
        <span class="text-[#9A9AA2]">${esc(camp ? camp.name : "")}</span>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-4 text-[13px]">
        <div class="kpi"><div class="kpi-lbl">Impressions</div><div class="kpi-num text-[17px]">${fmt(a.impressions)}</div></div>
        <div class="kpi"><div class="kpi-lbl">Clicks · CTR</div><div class="kpi-num text-[17px]">${fmt(a.clicks)} · ${ctr}%</div></div>
        <div class="kpi"><div class="kpi-lbl">Spend</div><div class="kpi-num text-[17px]">${money(a.spend || 0)}</div></div>
        <div class="kpi"><div class="kpi-lbl">Revenue · ROAS</div><div class="kpi-num text-[17px]">${money(a.revenue || 0)} · ${ro.toFixed(1)}×</div></div>
      </div>
      <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("trophy", 18)}</span><div><div class="card-title">AI verdict</div></div></div>
        <div class="text-[13px] text-[#6B6B73] mt-2">${ro >= 2 ? `<span class="text-[#059669] font-bold">Healthy ad.</span> ${esc(a.name)} is converting well with a ROAS of ${ro.toFixed(1)}×. Consider scaling budget ${Math.round(a.spend * 0.2)} to capture more volume.` : `<span class="text-[#D97706] font-bold">Below target.</span> ROAS ${ro.toFixed(1)}× under the 2.0× target — tighten audience or refresh creative.`}</div>
      </div>
    `);
  }

  function newCampaignForm() {
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New campaign</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="campaign-form" class="grid grid-cols-2 gap-3 mt-4">
        <div class="col-span-2"><label class="label">Campaign name</label><input class="erp-input w-full" name="name" required></div>
        <div><label class="label">Platform</label><select class="erp-select w-full" name="platform"><option>Meta Ads</option><option>TikTok Ads</option><option>Google Ads</option></select></div>
        <div><label class="label">Budget (${company().currency})</label><input class="erp-input w-full" type="number" name="budget" value="10000"></div>
        <div><label class="label">Start</label><input class="erp-input w-full" type="date" name="start" value="${new Date().toISOString().slice(0, 10)}"></div>
        <div><label class="label">End</label><input class="erp-input w-full" type="date" name="end"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Launch</button></div>
      </form>`);
  }

  /* ---------------- settings ---------------- */
  function S_settings() {
    const c = company();
    const users = load("users");
    const rolesList = ROLES;
    const permLevel = { create: 50, update: 50, manage: 70, export: 50 };
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Settings</div><div class="erp-title-sub">Company · team · roles & permissions</div></div>
    </div>
    <div class="grid lg:grid-cols-3 gap-4 mt-3">
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("settings", 18)}</span><div><div class="card-title">Company</div></div></div>
        <form id="settings-form" class="grid gap-3 mt-3">
          <div><label class="label">Name</label><input class="erp-input w-full" name="name" value="${esc(c.name)}"></div>
          <div><label class="label">Currency</label><select class="erp-select w-full" name="currency">${CURRENCIES.map((x) => `<option ${x === c.currency ? "selected" : ""}>${x}</option>`).join("")}</select></div>
          <div><label class="label">Timezone</label><select class="erp-select w-full" name="timezone">${["Africa/Algiers", "UTC", "Africa/Cairo", "Europe/Paris", "Africa/Casablanca", "Asia/Dubai"].map((t) => `<option ${t === c.timezone ? "selected" : ""}>${t}</option>`).join("")}</select></div>
          <div><label class="label">Country</label><input class="erp-input w-full" name="country" value="${esc(c.country || "")}"></div>
          <div class="flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Save</button></div>
        </form>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("shield", 18)}</span><div><div class="card-title">Roles & permissions</div></div></div>
        <div class="erp-table-wrap mt-3"><table class="erp-table"><thead><tr><th>Role</th><th>Level</th><th>Create</th><th>Update</th><th>Manage</th><th>Export</th></tr></thead><tbody>${rolesList.map((r) => `<tr><td><b>${r}</b></td><td>${ROLE_LEVEL[r] || 10}/100</td>${["create", "update", "manage", "export"].map((p) => `<td>${(ROLE_LEVEL[r] || 10) >= permLevel[p] ? `<span class="text-[#059669]">${icon("check", 14)}</span>` : `<span class="text-[#9A9AA2]">·</span>`}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      </div>
      <div class="card"><div class="card-head"><span class="icon-tile green-soft">${icon("users", 18)}</span><div><div class="card-title">Team</div></div></div>
        <div class="erp-table-wrap mt-3"><table class="erp-table"><tbody>${users.map((u) => `<tr><td><div class="flex items-center gap-2"><div class="avatar" style="background:${AVATAR_COLORS[hash(u.name) % AVATAR_COLORS.length]}">${esc(u.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</div><div><b>${esc(u.name)}</b><div class="text-[11.5px] text-[#9A9AA2]">${esc(u.email)}</div></div></div></td><td><span class="pill indigo">${esc(u.role)}</span></td></tr>`).join("")}</tbody></table></div>
      </div>
    </div>`;
  }
  MOUNT.settings = () => {};

  /* ---------------- AI helpers ---------------- */
  function parseJSON(text) {
    if (!text) return null;
    if (typeof text === "object") return text;
    const m = String(text).match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { return JSON.parse(m[0]); } catch (e) { return null; }
  }
  function hash(s) { let h = 0; s = String(s); for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return Math.abs(h); }
  const CURRENCIES = ["DZD", "MAD", "TND", "EGP", "USD", "EUR", "GBP", "AED", "CNY", "TRY"];
  const CHART_COLORS = ["#4f46e5", "#0fa05a", "#f97316", "#d32f2f", "#7a3ac9", "#1a66d6", "#b98a1f", "#0d9488"];
  const AVATAR_COLORS = ["#4f46e5", "#0fa05a", "#f97316", "#d32f2f", "#7a3ac9", "#1a66d6", "#b98a1f", "#0d9488", "#db2777", "#0891b2"];

  /* ---------------- reports ---------------- */
  function S_reports() {
    const a = agg();
    const k = a.kpis;
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Reports</div><div class="erp-title-sub">Library of ready reports · local data first, AI narrative on demand</div></div>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="sales"><div class="card-head"><span class="icon-tile green-soft">${icon("handshake", 18)}</span><div><div class="card-title">Sales performance</div><div class="card-sub">Revenue, orders, conversion, by channel & product</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">Revenue ${money(k.revenue)} · ${k.delivered} delivered · ${money(k.aov)} AOV</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="inventory"><div class="card-head"><span class="icon-tile green-soft">${icon("boxes", 18)}</span><div><div class="card-title">Inventory report</div><div class="card-sub">Stock value, low stock, dead stock, per warehouse</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">${money(k.inventoryValue)} value · ${k.lowStock} low · ${k.outOfStock} out</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="finance"><div class="card-head"><span class="icon-tile green-soft">${icon("bar-chart-3", 18)}</span><div><div class="card-title">Financial P&L</div><div class="card-sub">Revenue, COGS, margin, expenses, net</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">Gross ${money(k.gross)} · Net ${money(k.net)}</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="customers"><div class="card-head"><span class="icon-tile green-soft">${icon("users", 18)}</span><div><div class="card-title">Customer report</div><div class="card-sub">Top spenders, repeat buyers, wilaya distribution</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">${a.customers.length} customers · LTV ${money(a.customers.reduce((x, c) => x + c.totalSpent, 0))}</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="marketing"><div class="card-head"><span class="icon-tile green-soft">${icon("megaphone", 18)}</span><div><div class="card-title">Marketing ROAS</div><div class="card-sub">Spend, revenue, ROAS per campaign & ad</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">Spend ${money(a.campaigns.reduce((x, c) => x + c.spend, 0))}</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="cod"><div class="card-head"><span class="icon-tile green-soft">${icon("banknote", 18)}</span><div><div class="card-title">COD funnel report</div><div class="card-sub">Lead → order → confirm → deliver, wilaya-wise</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">Confirm ${k.confirmationRate.toFixed(0)}% · Delivery ${k.deliveryRate.toFixed(0)}%</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="suppliers"><div class="card-head"><span class="icon-tile green-soft">${icon("truck", 18)}</span><div><div class="card-title">Supplier scorecard</div><div class="card-sub">Price, quality, reliability, delivery, defects</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">${a.suppliers.length} suppliers · ${money(k.payables)} owed</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="purchasing"><div class="card-head"><span class="icon-tile green-soft">${icon("shopping-basket", 18)}</span><div><div class="card-title">Purchasing report</div><div class="card-sub">POs by status, expected vs late deliveries</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">${load("pos").length} purchase orders</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="returns"><div class="card-head"><span class="icon-tile green-soft">${icon("rotate-ccw", 18)}</span><div><div class="card-title">Returns & quality</div><div class="card-sub">Return reasons, products, refund liability</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">${k.returnRate.toFixed(0)}% return rate</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="warehouses"><div class="card-head"><span class="icon-tile green-soft">${icon("warehouse", 18)}</span><div><div class="card-title">Warehouse report</div><div class="card-sub">Stock per warehouse, transfers, utilization</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">${load("warehouses").length} warehouses</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="employees"><div class="card-head"><span class="icon-tile green-soft">${icon("user-circle", 18)}</span><div><div class="card-title">Employee report</div><div class="card-sub">Performance by role, workload, tasks</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">${a.employees.length} employees</div></button>
      <button class="card text-left cursor-pointer hover:-translate-y-0.5 transition-transform" data-action="gen-report" data-report="summary"><div class="card-head"><span class="icon-tile green-soft">${icon("sparkles", 18)}</span><div><div class="card-title">Executive summary</div><div class="card-sub">AI narrative across all modules</div></div></div>
        <div class="text-[12px] text-[#6B6B73] mt-2">KNOW → UNDERSTAND → DECIDE</div></button>
    </div>
    <div id="erp-report-out" class="mt-4"></div>`;
  }
  MOUNT.reports = () => {};

  function genReport(name) {
    const out = $("#erp-report-out");
    if (!out) return;
    const a = agg();
    const k = a.kpis;
    const now = new Date();
    const head = `<div class="flex items-center justify-between flex-wrap gap-2"><div class="flex items-center gap-2"><span class="icon-tile green-soft">${icon("file-text", 18)}</span><div><div class="card-title text-[15px]">${esc(REPORT_TITLES[name] || name)}</div><div class="card-sub">${esc(company().name)} · generated ${now.toLocaleDateString("en-GB")}</div></div></div><button class="erp-btn ghost" data-action="export-report">${icon("download", 15)} CSV</button></div>`;
    let body = "";
    if (name === "sales") {
      const bySrc = {};
      a.orders.forEach((o) => { bySrc[o.source] = bySrc[o.source] || { orders: 0, delivered: 0, revenue: 0, profit: 0 }; bySrc[o.source].orders++; if (o.status === "Delivered") { bySrc[o.source].delivered++; bySrc[o.source].revenue += o.total; bySrc[o.source].profit += o.profit; } });
      body = `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3"><div class="kpi hot"><div class="kpi-lbl">Revenue</div><div class="kpi-num text-[19px]">${money(k.revenue)}</div></div><div class="kpi"><div class="kpi-lbl">Orders</div><div class="kpi-num text-[19px]">${fmt(k.orderCount)}</div></div><div class="kpi"><div class="kpi-lbl">Delivery rate</div><div class="kpi-num text-[19px]">${k.deliveryRate.toFixed(0)}%</div></div><div class="kpi"><div class="kpi-lbl">AOV</div><div class="kpi-num text-[19px]">${money(k.aov)}</div></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("handshake", 18)}</span><div><div class="card-title">By channel</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Channel</th><th>Orders</th><th>Delivered</th><th>Revenue</th><th>Profit</th></tr></thead><tbody>${Object.entries(bySrc).map(([s, v]) => `<tr><td><b>${esc(s)}</b></td><td>${v.orders}</td><td>${v.delivered}</td><td>${money(v.revenue)}</td><td>${money(v.profit)}</td></tr>`).join("")}</tbody></table></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("trophy", 18)}</span><div><div class="card-title">Top products</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Product</th><th>Delivered</th><th>Revenue</th><th>Profit</th></tr></thead><tbody>${a.topProducts.slice(0, 8).map((p) => `<tr><td><b>${esc(p.name)}</b></td><td>${p.delivered}</td><td>${money(p.revenue)}</td><td>${money(p.profit)}</td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "inventory") {
      body = `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3"><div class="kpi hot"><div class="kpi-lbl">Inventory value</div><div class="kpi-num text-[19px]">${money(k.inventoryValue)}</div></div><div class="kpi"><div class="kpi-lbl">Low stock</div><div class="kpi-num text-[19px]">${k.lowStock}</div></div><div class="kpi err"><div class="kpi-lbl">Out of stock</div><div class="kpi-num text-[19px]">${k.outOfStock}</div></div><div class="kpi"><div class="kpi-lbl">Ledger entries</div><div class="kpi-num text-[19px]">${fmt(load("ledger").length)}</div></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("alert-triangle", 18)}</span><div><div class="card-title">Stock alerts</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Product</th><th>On hand</th><th>Reserved</th><th>Available</th><th>Reorder</th><th>Status</th></tr></thead><tbody>${a.products.map((p) => { const st = stockFor(p.id); const bad = st.available <= p.reorderLevel; return `<tr><td><b>${esc(p.name)}</b></td><td>${st.onHand}</td><td>${st.reserved}</td><td>${st.available}</td><td>${p.reorderLevel}</td><td><span class="pill ${bad ? "amber" : "green"}">${bad ? "Low" : "OK"}</span></td></tr>`; }).join("")}</tbody></table></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("warehouse", 18)}</span><div><div class="card-title">Per warehouse</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Warehouse</th><th>Units</th><th>Value</th><th>Incoming</th></tr></thead><tbody>${load("warehouses").map((w) => { const rows = load("inventory").filter((i) => i.warehouseId === w.id); return `<tr><td><b>${esc(w.name)}</b></td><td>${rows.reduce((s, i) => s + i.onHand, 0)}</td><td>${money(rows.reduce((s, i) => s + i.onHand * ((load("products").find((p) => p.id === i.productId) || {}).supplierCost || 0), 0))}</td><td>${rows.reduce((s, i) => s + i.incoming, 0)}</td></tr>`; }).join("")}</tbody></table></div></div>`;
    } else if (name === "finance") {
      const exp = a.expenses.reduce((s, e) => s + e.amount, 0);
      const cogs = a.topProducts.reduce((s, p) => s + p.st.onHand * p.supplierCost, 0);
      body = `
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div class="kpi hot"><div class="kpi-lbl">Revenue</div><div class="kpi-num text-[19px]">${money(k.revenue)}</div></div>
          <div class="kpi"><div class="kpi-lbl">Gross profit</div><div class="kpi-num text-[19px]">${money(k.gross)}</div></div>
          <div class="kpi"><div class="kpi-lbl">Expenses</div><div class="kpi-num text-[19px]">${money(exp)}</div></div>
          <div class="kpi ${k.net >= 0 ? "" : "err"}"><div class="kpi-lbl">Net</div><div class="kpi-num text-[19px]">${money(k.net)}</div></div>
        </div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("bar-chart-3", 18)}</span><div><div class="card-title">P&L summary</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>
          <tr><td>Delivered revenue</td><td class="font-bold">${money(k.revenue)}</td></tr>
          <tr><td>COGS (delivered)</td><td>−${money(k.cogs)}</td></tr>
          <tr><td>Shipping + packaging</td><td>−${money(k.shipCost + pkgAll(a))}</td></tr>
          <tr><td>Ad spend</td><td>−${money(k.adSpend)}</td></tr>
          <tr><td>Gross profit</td><td class="font-bold">${money(k.gross)}</td></tr>
          <tr><td>Operating expenses</td><td>−${money(exp)}</td></tr>
          <tr><td class="font-black">Net profit</td><td class="font-black ${k.net >= 0 ? "text-[#0fa05a]" : "text-[#d32f2f]"}">${money(k.net)}</td></tr>
        </tbody></table></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("wallet", 18)}</span><div><div class="card-title">Expenses by category</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Category</th><th>Amount</th></tr></thead><tbody>${a.expByCat.slice().sort((x, y) => y.val - x.val).map((c) => `<tr><td>${esc(c.cat)}</td><td>${money(c.val)}</td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "customers") {
      const byWil = {};
      a.customers.forEach((c) => { byWil[c.wilaya] = (byWil[c.wilaya] || 0) + 1; });
      body = `
        <div class="grid grid-cols-3 gap-3 mt-3"><div class="kpi hot"><div class="kpi-lbl">Customers</div><div class="kpi-num text-[19px]">${a.customers.length}</div></div><div class="kpi"><div class="kpi-lbl">Lifetime value</div><div class="kpi-num text-[19px]">${money(a.customers.reduce((s, c) => s + c.totalSpent, 0))}</div></div><div class="kpi"><div class="kpi-lbl">Repeat (3+)</div><div class="kpi-num text-[19px]">${a.customers.filter((c) => c.delivered >= 3).length}</div></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("users", 18)}</span><div><div class="card-title">Top customers</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Customer</th><th>Wilaya</th><th>Orders</th><th>LTV</th><th>Last purchase</th></tr></thead><tbody>${a.customers.slice(0, 10).map((c) => `<tr><td><b>${esc(c.name)}</b></td><td>${esc(c.wilaya)}</td><td>${c.delivered}</td><td>${money(c.totalSpent)}</td><td>${c.lastPurchase ? fmtDate(c.lastPurchase) : "—"}</td></tr>`).join("")}</tbody></table></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("map-pin", 18)}</span><div><div class="card-title">By wilaya</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Wilaya</th><th>Customers</th></tr></thead><tbody>${Object.entries(byWil).map(([w, v]) => `<tr><td><b>${esc(w)}</b></td><td>${v}</td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "marketing") {
      const att = (cid) => a.orders.filter((o) => o.campaignId === cid && o.status === "Delivered").reduce((s, o) => s + o.total, 0);
      const totalSpend = a.campaigns.reduce((s, c) => s + c.spend, 0);
      const totalRev = a.campaigns.reduce((s, c) => s + att(c.id), 0);
      body = `
        <div class="grid grid-cols-3 gap-3 mt-3"><div class="kpi hot"><div class="kpi-lbl">Spend</div><div class="kpi-num text-[19px]">${money(totalSpend)}</div></div><div class="kpi"><div class="kpi-lbl">Attributed revenue</div><div class="kpi-num text-[19px]">${money(totalRev)}</div></div><div class="kpi ${totalSpend > 0 && totalRev / totalSpend >= 2 ? "green" : "amber"}"><div class="kpi-lbl">ROAS</div><div class="kpi-num text-[19px]">${(totalSpend > 0 ? totalRev / totalSpend : 0).toFixed(2)}×</div></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("megaphone", 18)}</span><div><div class="card-title">Campaigns</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Campaign</th><th>Spend</th><th>Revenue</th><th>ROAS</th><th>Status</th></tr></thead><tbody>${a.campaigns.map((c) => { const r = att(c.id); return `<tr><td><b>${esc(c.name)}</b></td><td>${money(c.spend)}</td><td>${money(r)}</td><td>${(c.spend > 0 ? r / c.spend : 0).toFixed(2)}×</td><td><span class="pill ${c.status === "Active" ? "green" : "gray"}">${c.status}</span></td></tr>`; }).join("")}</tbody></table></div></div>`;
    } else if (name === "cod") {
      body = `
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("filter", 18)}</span><div><div class="card-title">Funnel</div></div></div>
        <div class="flex items-end gap-2 p-3">${a.funnel.map((f, i) => `<div class="flex-1 text-center"><div class="text-[17px] font-black text-[#4338CA]">${f.value}</div><div class="text-[11px] text-[#9A9AA2]">${f.label}</div><div class="rounded-lg mt-1" style="height:${Math.max(8, Math.round(f.value / Math.max(1, a.funnel[0].value) * 90))}px;background:${["#4f46e5", "#6d5ef0", "#8b7bff", "#a79bff", "#c4bcff"][i]}"></div>${i < a.funnel.length - 1 ? `<div class="text-[10px] text-[#9A9AA2] mt-1">${a.funnelConv[i].rate.toFixed(0)}%</div>` : ""}</div>`).join("")}</div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("banknote", 18)}</span><div><div class="card-title">COD health</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>
          <tr><td>Confirmation rate</td><td class="font-bold">${k.confirmationRate.toFixed(0)}%</td></tr>
          <tr><td>Delivery rate (confirmed → delivered)</td><td class="font-bold">${k.deliveryRate.toFixed(0)}%</td></tr>
          <tr><td>Return rate</td><td class="font-bold ${k.returnRate > 15 ? "text-[#d32f2f]" : ""}">${k.returnRate.toFixed(0)}%</td></tr>
          <tr><td>Pending confirmation</td><td class="font-bold">${a.orders.filter((o) => ["New", "Pending Confirmation"].includes(o.status)).length}</td></tr>
        </tbody></table></div></div>`;
    } else if (name === "suppliers") {
      body = `
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("truck", 18)}</span><div><div class="card-title">Supplier scorecard</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Supplier</th><th>Price</th><th>Quality</th><th>Reliability</th><th>Speed</th><th>Defects</th><th>Terms</th><th>Overall</th></tr></thead><tbody>${a.suppliers.map((s) => `<tr><td><b>${esc(s.name)}</b></td><td>${s.score.price}</td><td>${s.score.quality}</td><td>${s.score.reliability}</td><td>${s.score.speed}</td><td>${s.defectRate}%</td><td>${esc(s.terms)}</td><td><span class="risk ${s.score.reliability >= 9 ? "low" : s.score.reliability >= 7 ? "medium" : "high"}">${s.score.reliability}/10</span></td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "purchasing") {
      const pos = load("pos");
      body = `
        <div class="grid grid-cols-3 gap-3 mt-3"><div class="kpi hot"><div class="kpi-lbl">POs</div><div class="kpi-num text-[19px]">${pos.length}</div></div><div class="kpi"><div class="kpi-lbl">Open value</div><div class="kpi-num text-[19px]">${money(pos.filter((po) => !["Received", "Cancelled"].includes(po.status)).reduce((s, po) => s + po.total, 0))}</div></div><div class="kpi"><div class="kpi-lbl">Late</div><div class="kpi-num text-[19px]">${pos.filter((po) => daysAgo(po.expectedDelivery) > 2 && ["Sent", "Approved", "Partially Received"].includes(po.status)).length}</div></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("shopping-basket", 18)}</span><div><div class="card-title">Purchase orders</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Number</th><th>Supplier</th><th>Total</th><th>Status</th><th>Expected</th></tr></thead><tbody>${pos.map((po) => `<tr><td><b>${esc(po.number)}</b></td><td>${esc(po.supplierName)}</td><td>${money(po.total)}</td><td><span class="pill ${poPill(po.status)}">${po.status}</span></td><td>${fmtDate(po.expectedDelivery)}</td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "returns") {
      const returns = a.orders.filter((o) => o.status === "Returned" || o.status === "Cancelled");
      body = `
        <div class="grid grid-cols-3 gap-3 mt-3"><div class="kpi err"><div class="kpi-lbl">Returns</div><div class="kpi-num text-[19px]">${returns.filter((o) => o.status === "Returned").length}</div></div><div class="kpi"><div class="kpi-lbl">Refund value</div><div class="kpi-num text-[19px]">${money(returns.filter((o) => o.status === "Returned").reduce((s, o) => s + o.total, 0))}</div></div><div class="kpi"><div class="kpi-lbl">Return rate</div><div class="kpi-num text-[19px]">${k.returnRate.toFixed(0)}%</div></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("rotate-ccw", 18)}</span><div><div class="card-title">Returned orders</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Total</th></tr></thead><tbody>${returns.map((o) => `<tr><td><b>${esc(o.orderNumber)}</b></td><td>${esc(o.customerName)}</td><td>${o.items.map((it) => it.qty + "× " + esc(it.name)).join("<br>")}</td><td>${money(o.total)}</td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "warehouses") {
      body = `
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("warehouse", 18)}</span><div><div class="card-title">Warehouse stock</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Warehouse</th><th>Location</th><th>Units</th><th>Value</th><th>Incoming</th></tr></thead><tbody>${load("warehouses").map((w) => { const rows = load("inventory").filter((i) => i.warehouseId === w.id); return `<tr><td><b>${esc(w.name)}</b></td><td>${esc(w.location)}</td><td>${rows.reduce((s, i) => s + i.onHand, 0)}</td><td>${money(rows.reduce((s, i) => s + i.onHand * ((load("products").find((p) => p.id === i.productId) || {}).supplierCost || 0), 0))}</td><td>${rows.reduce((s, i) => s + i.incoming, 0)}</td></tr>`; }).join("")}</tbody></table></div></div>
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("arrow-left-right", 18)}</span><div><div class="card-title">Transfers</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Ref</th><th>From</th><th>To</th><th>Items</th><th>Status</th></tr></thead><tbody>${transferSeed().map((t) => `<tr><td><b>${esc(t.number)}</b></td><td>${esc((load("warehouses").find((w) => w.id === t.sourceId) || {}).name || "—")}</td><td>${esc((load("warehouses").find((w) => w.id === t.destId) || {}).name || "—")}</td><td>${t.items.map((i) => i.qty + "× " + esc(i.name)).join(", ")}</td><td><span class="pill ${t.status === "Received" ? "green" : t.status === "In Transit" ? "amber" : "blue"}">${t.status}</span></td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "employees") {
      body = `
        <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("user-circle", 18)}</span><div><div class="card-title">Employees</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><thead><tr><th>Name</th><th>Role</th><th>Department</th><th>Salary</th><th>Tasks done</th></tr></thead><tbody>${a.employees.map((e) => `<tr><td><b>${esc(e.name)}</b></td><td>${esc(e.role)}</td><td>${esc(e.department)}</td><td>${e.salary ? money(e.salary) : "—"}</td><td>${e.stats.tasksDone || 0}</td></tr>`).join("")}</tbody></table></div></div>`;
    } else if (name === "summary") {
      const s1 = summaryLocal(a);
      body = `<div class="ai-band mt-3">${summaryHTML(s1, true)}<button class="erp-btn primary mt-3" id="erp-summary-run">${icon("zap", 15)} Run AI summary</button></div>`;
    }
    out.innerHTML = head + body + (name !== "summary" ? `<button class="erp-btn primary mt-4" data-action="ai-report" data-report="${name}">${icon("sparkles", 15)} AI narrative</button>` : "");
  }

  async function runAIReport(name) {
    const a = agg();
    const out = $("#erp-report-out");
    if (!out) return;
    const res = await PL_API.ai("erp_report", { company: company().name, report: name, kpis: a.kpis, topProducts: a.topProducts.slice(0, 3).map((p) => p.name + " " + p.profit) }, {
      maxTokens: 1200,
      prompt: "You are a management consultant. Given ERP metrics for the report '" + name + "', write a 3-4 sentence plain-English narrative: what the data says, the biggest insight, and one recommended action. No JSON, no markdown. Never invent numbers.",
    });
    const txt = res.data ? (parseJSON(res.data) ? (parseJSON(res.data).narrative || parseJSON(res.data).summary || JSON.stringify(parseJSON(res.data))) : res.data) : "";
    const note = document.createElement("div");
    note.className = "rounded-xl p-4 mt-3";
    note.style.cssText = "background:#E0E7FF;border:1px solid #D3DCFF";
    note.innerHTML = `<div class="text-[12px] font-black uppercase text-[#4338CA]">AI narrative · ${esc(REPORT_TITLES[name] || name)}</div><div class="text-[13px] mt-1 text-[#4338CA]">${esc(txt || "AI unavailable — see the computed data above.")}${res.simulated ? ' <span class="opacity-60">(demo)</span>' : ""}</div>`;
    out.appendChild(note);
  }

  const REPORT_TITLES = { sales: "Sales performance", inventory: "Inventory report", finance: "Financial P&L", customers: "Customer report", marketing: "Marketing ROAS", cod: "COD funnel report", suppliers: "Supplier scorecard", purchasing: "Purchasing report", returns: "Returns & quality", warehouses: "Warehouse report", employees: "Employee report", summary: "Executive summary" };

  /* ---------------- ads manager ---------------- */
  function S_ads() {
    const ads = load("ads");
    const camps = load("campaigns");
    const orders = load("orders");
    const list = ads.map((ad) => {
      const camp = camps.find((c) => c.id === ad.campaignId);
      const rev = orders.filter((o) => o.adId === ad.id && o.status === "Delivered").reduce((s, o) => s + o.total, 0);
      const sp = (ad.spend || 0) || (camp && camp.spend ? Math.round(camp.spend / 4) : 0);
      const ro = sp > 0 ? rev / sp : 0;
      return { ad, camp, rev, sp, ro };
    });
    const totalSpend = list.reduce((s, x) => s + x.sp, 0);
    const totalRev = list.reduce((s, x) => s + x.rev, 0);
    return `
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div><div class="erp-title">Ads Manager</div><div class="erp-title-sub">${ads.length} ads · spend, revenue & ROAS per ad</div></div>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
      <div class="kpi hot"><div class="kpi-lbl">Ad spend</div><div class="kpi-num text-[19px]">${money(totalSpend)}</div></div>
      <div class="kpi"><div class="kpi-lbl">Attributed revenue</div><div class="kpi-num text-[19px]">${money(totalRev)}</div></div>
      <div class="kpi ${totalSpend > 0 && totalRev / totalSpend >= 2 ? "green" : "amber"}"><div class="kpi-lbl">Blended ROAS</div><div class="kpi-num text-[19px]">${(totalSpend > 0 ? totalRev / totalSpend : 0).toFixed(2)}×</div></div>
      <div class="kpi"><div class="kpi-lbl">Avg CTR</div><div class="kpi-num text-[19px]">${(ads.reduce((s, a) => s + (a.impressions > 0 ? a.clicks / a.impressions : 0), 0) / Math.max(1, ads.length) * 100).toFixed(2)}%</div></div>
    </div>
    <div class="erp-table-wrap mt-4"><table class="erp-table">
      <thead><tr><th>Ad</th><th>Campaign</th><th>Impressions</th><th>Clicks</th><th>Spend</th><th>Revenue</th><th>ROAS</th><th>Status</th></tr></thead>
      <tbody>${list.map((x) => `<tr class="cursor-pointer" data-action="open-ad" data-id="${x.ad.id}">
        <td><b>${esc(x.ad.name)}</b><div class="text-[11.5px] text-[#9A9AA2]">${esc(x.ad.creative || "")}</div></td>
        <td class="text-[12px]">${esc(x.camp ? x.camp.name : "—")}</td>
        <td>${fmt(x.ad.impressions)}</td><td>${fmt(x.ad.clicks)}</td>
        <td>${money(x.sp)}</td><td>${money(x.rev)}</td>
        <td class="font-bold ${x.ro >= 2 ? "text-[#0fa05a]" : "text-[#d97706]"}">${x.ro.toFixed(1)}×</td>
        <td><span class="pill ${x.ad.status === "Active" ? "green" : "gray"}">${x.ad.status || "Active"}</span></td>
      </tr>`).join("")}</tbody>
    </table></div>`;
  }
  MOUNT.ads = () => {};

  /* ---------------- order detail & actions ---------------- */
  function openOrder(id) {
    const o = load("orders").find((x) => x.id === id);
    if (!o) return;
    const camp = load("campaigns").find((c) => c.id === o.campaignId);
    const ad = load("ads").find((a) => a.id === o.adId);
    const wh = load("warehouses").find((w) => w.id === o.warehouseId);
    const steps = [
      ["Order placed", o.createdAt],
      ["Confirmed", o.confirmedAt],
      ["Shipped", o.shippedAt],
      ["Delivered", o.deliveredAt],
    ].filter((s) => s[1]);
    const actions = [
      ["Pending Confirmation", "confirm-order", "Confirm", "primary", o.status === "Placed" || o.status === "New"],
      ["Confirmed", "ship-order", "Ship", "primary", o.status === "Confirmed"],
      ["Shipped", "deliver-order", "Deliver", "primary", o.status === "Shipped" || o.status === "Out for Delivery"],
      ["Returned", "return-order", "Return", "ghost", ["Shipped", "Out for Delivery", "Delivered"].includes(o.status)],
    ].filter((a) => a[4] && can("update"));
    openModal(`
      <div class="flex items-center justify-between"><div><div class="erp-title text-[17px]">${esc(o.orderNumber)}</div><div class="erp-title-sub">${esc(o.customerName)} · ${esc(o.customerPhone || "")} · ${esc(o.customerWilaya)}</div></div>
      <button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex flex-wrap gap-2 mt-3">
        <span class="pill ${orderPill(o.status)}">${o.status}</span>
        <span class="pill ${o.paymentStatus === "Paid" ? "green" : "amber"}">${o.paymentStatus}</span>
        <span class="text-[12.5px] text-[#9A9AA2]">${esc(o.source)} · ${esc(camp ? camp.name : "—")} · ${esc(ad ? ad.name : "")}</span>
        <span class="text-[12.5px] text-[#9A9AA2]">${esc(wh ? wh.name : "")}</span>
      </div>
      ${actions.length ? `<div class="flex flex-wrap gap-2 mt-3">${actions.map((a) => `<button class="erp-btn ${a[3]}" data-action="${a[2]}" data-id="${o.id}">${a[1]}</button>`).join("")}</div>` : ""}
      <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("shopping-cart", 18)}</span><div><div class="card-title">Items</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${o.items.map((it) => `<tr><td><b>${esc(it.name)}</b></td><td>${it.qty}×</td><td>${money(it.price)}</td><td class="font-bold">${money(it.price * it.qty)}</td></tr>`).join("")}</tbody></table></div>
        <div class="flex justify-between mt-2 px-3 text-[12.5px] text-[#6B6B73]"><span>Subtotal ${money(o.subtotal)} · Shipping ${money(o.shipping)}${o.discount ? " · Discount " + money(o.discount) : ""}</span><span class="font-black text-[15px]">Total ${money(o.total)}</span></div>
      </div>
      <div class="grid grid-cols-2 gap-3 mt-3">
        <div class="rounded-xl p-3" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Profit</div><div class="text-[18px] font-black ${o.profit >= 0 ? "text-[#0fa05a]" : "text-[#d32f2f]"}">${money(o.profit || 0)}</div></div>
        <div class="rounded-xl p-3" style="background:#FAFAFA;border:1px solid var(--line)"><div class="text-[11px] font-black uppercase text-[#9A9AA2]">Timeline</div>${steps.map((s) => `<div class="text-[12px] mt-1">• ${s[0]}: ${fmtDateTime(s[1])}</div>`).join("") || `<div class="text-[12px] text-[#9A9AA2] mt-1">No milestones yet</div>`}</div>
      </div>
    `, true);
  }

  function setOrderStatus(id, status) {
    const o = load("orders").find((x) => x.id === id);
    if (!o) return;
    o.status = status;
    const now = new Date().toISOString();
    if (status === "Confirmed") o.confirmedAt = now;
    if (status === "Shipped" || status === "Out for Delivery") o.shippedAt = now;
    if (status === "Delivered") { o.deliveredAt = now; o.paymentStatus = "Paid"; o.revenue = o.total; o.profit = orderProfit(o); }
    if (status === "Returned") { o.returnedAt = now; o.paymentStatus = "Refunded"; o.revenue = 0; o.profit = 0; }
    upsert("orders", o);
    audit("Order " + status.toLowerCase(), o.orderNumber + " · " + o.customerName);
    toast("Order " + o.orderNumber + " → " + status, "ok");
    shell();
  }

  /* ---------------- funnel ---------------- */
  function openFunnel() {
    const a = agg();
    openModal(`
      <div class="flex items-center justify-between"><div><div class="erp-title">Sales funnel</div><div class="erp-title-sub">Lead → order → confirm → ship → deliver</div></div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="flex items-end gap-3 p-4 mt-2">${a.funnel.map((f, i) => `<div class="flex-1 text-center"><div class="text-[20px] font-black text-[#4338CA]">${f.value}</div><div class="text-[11px] text-[#9A9AA2]">${f.label}</div><div class="rounded-xl mt-2" style="height:${Math.max(10, Math.round(f.value / Math.max(1, a.funnel[0].value) * 120))}px;background:${["#4f46e5", "#6d5ef0", "#8b7bff", "#a79bff", "#c4bcff"][i]};opacity:.85"></div>${i < a.funnel.length - 1 ? `<div class="text-[11px] font-bold mt-1 text-[#4338CA]">${a.funnelConv[i].rate.toFixed(0)}%</div><div class="text-[10px] text-[#9A9AA2]">conversion</div>` : ""}</div>`).join("")}</div>
      <div class="erp-table-wrap mt-3"><table class="erp-table"><thead><tr><th>Stage</th><th>Count</th><th>Conversion</th></tr></thead><tbody>${a.funnel.map((f, i) => `<tr><td><b>${f.label}</b></td><td>${f.value}</td><td>${i === 0 ? "—" : a.funnelConv[i - 1].rate.toFixed(0) + "% from " + a.funnel[i - 1].label}</td></tr>`).join("")}</tbody></table></div>
    `, true);
  }

  /* ---------------- notifications & user ---------------- */
  function openNotifications() {
    const list = load("notifications");
    list.forEach((n) => { n.read = true; });
    save("notifications", list);
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">Notifications</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="space-y-2 mt-4">${list.map((n) => `<div class="rounded-xl p-3" style="background:#FAFAFA;border:1px solid var(--line)"><div class="flex items-center gap-2"><span class="pill ${n.type === "stock" ? "amber" : n.type === "order" ? "blue" : n.type === "finance" ? "red" : n.type === "ai" ? "indigo" : "green"}">${esc(n.type)}</span><b class="text-[13px]">${esc(n.title)}</b></div><div class="text-[12.5px] text-[#6B6B73] mt-1">${esc(n.body)}</div><div class="text-[11px] text-[#9A9AA2] mt-1">${fmtDate(n.date)}</div></div>`).join("") || `<div class="empty">No notifications</div>`}</div>
    `, true);
  }

  function openUser() {
    const u = me();
    const users = load("users");
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">Account</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <div class="card mt-4"><div class="card-head"><span class="icon-tile green-soft">${icon("user-circle", 18)}</span><div><div class="card-title">${esc(u.name)}</div><div class="card-sub">${esc(u.email)}</div></div></div>
        <div class="flex flex-wrap gap-2 mt-2"><span class="pill indigo">${esc(u.role)}</span><span class="pill gray">${ROLE_LEVEL[u.role] || 10}% access</span></div>
        <div class="text-[12px] text-[#9A9AA2] mt-3">You can ${PERMS.filter((p) => can(p)).map((p) => p).join(", ")} in this workspace.</div>
      </div>
      <div class="card mt-3"><div class="card-head"><span class="icon-tile green-soft">${icon("users", 18)}</span><div><div class="card-title">Team members</div></div></div>
        <div class="erp-table-wrap mt-2"><table class="erp-table"><tbody>${users.map((x) => `<tr><td><b>${esc(x.name)}</b></td><td>${esc(x.email)}</td><td><span class="pill indigo">${esc(x.role)}</span></td></tr>`).join("")}</tbody></table></div>
      </div>
    `, true);
  }

  /* ---------------- payments ---------------- */
  function newPaymentForm() {
    const invs = load("invoices").filter((i) => (i.total || 0) > (i.paid || 0));
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">Record payment</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="payment-form" class="grid grid-cols-2 gap-3 mt-4">
        <div class="col-span-2"><label class="label">Invoice</label><select class="erp-select w-full" name="invoiceId">${invs.map((i) => `<option value="${i.id}">${esc(i.number)} · ${esc(i.customerName)} · ${money((i.total || 0) - (i.paid || 0))} due</option>`).join("")}</select></div>
        <div><label class="label">Amount</label><input class="erp-input w-full" type="number" name="amount"></div>
        <div><label class="label">Method</label><select class="erp-select w-full" name="method"><option>COD Cash</option><option>Bank transfer</option><option>Card</option><option>Online payment</option><option>Cash</option></select></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Record</button></div>
      </form>`);
  }

  function recordPayment(invoiceId, amount) {
    const i = load("invoices").find((x) => x.id === invoiceId);
    if (!i) return;
    const amt = Number(amount) || (i.total - i.paid);
    i.paid = (i.paid || 0) + amt;
    i.status = i.paid >= i.total ? "Paid" : "Partial";
    upsert("invoices", i);
    upsert("payments", { id: uid(), invoiceId, customerName: i.customerName, amount: amt, currency: company().currency, date: new Date().toISOString(), method: "Manual", ref: "PAY-" + i.number });
    audit("Payment recorded", i.number + " · " + money(amt));
    toast("Payment recorded on " + i.number, "ok");
    closeModal();
    shell();
  }

  /* ---------------- exports ---------------- */
  function exportOrders() {
    const a = agg();
    const rows = [["Order", "Customer", "Phone", "Wilaya", "Product", "Qty", "Total", "Status", "Payment", "Source", "Campaign", "Date"]];
    a.orders.forEach((o) => {
      rows.push([o.orderNumber, o.customerName, o.customerPhone, o.customerWilaya, o.items.map((it) => it.name).join("|"), o.items.reduce((s, it) => s + it.qty, 0), o.total, o.status, o.paymentStatus, o.source, (load("campaigns").find((c) => c.id === o.campaignId) || {}).name || "", o.createdAt]);
    });
    exportCSV("orders", rows);
  }
  function exportFinance() {
    const a = agg();
    exportCSV("finance", [["Metric", "Value"], ["Revenue", kpisV(a)], ["Gross profit", kpisV(a, 1)], ["Expenses", kpisV(a, 2)], ["Net", kpisV(a, 3)], ["Receivables", kpisV(a, 4)], ["Payables", kpisV(a, 5)], ["Inventory value", kpisV(a, 6)]]);
  }
  function kpisV(a, i) {
    const k = a.kpis;
    return [k.revenue, k.gross, k.expTotal, k.net, k.receivables, k.payables, k.inventoryValue][i || 0];
  }
  function exportProducts() {
    const a = agg();
    exportCSV("products", [["Name", "SKU", "Category", "Supplier", "Cost", "Price", "On hand", "Available", "Sold", "Status"], ...a.products.map((p) => { const st = stockFor(p.id); const sup = load("suppliers").find((s) => s.id === p.supplierId); return [p.name, p.sku, p.category, sup ? sup.name : "—", p.supplierCost, p.discountPrice || p.sellingPrice, st.onHand, st.available, p.sold, p.status]; })]);
  }

  /* ---------------- global event delegation ---------------- */
  function wire() {
    document.addEventListener("click", async (e) => {
      const nav = e.target.closest("[data-nav]");
      if (nav) { state.section = nav.dataset.nav; closeDrawer(); shell(); return; }

      const burger = e.target.closest("#erp-burger");
      if (burger) { $("#erp-sidebar").classList.add("open"); const m = $("#erp-drawer-mask"); if (m) m.classList.add("show"); return; }
      if (e.target.closest("#erp-drawer-mask")) closeDrawer();

      const el = e.target.closest("[data-action]");
      if (!el) return;
      const a = el.dataset.action;
      const id = el.dataset.id || "";
      const arg = el.dataset.arg || el.dataset.to || el.dataset.q || "";

      if (a === "close-modal") { closeModal(); return; }

      switch (a) {
        case "go": state.section = el.dataset.section; shell(); return;
        case "new-sale": newSaleForm(); return;
        case "new-customer": newCustomerForm(); return;
        case "new-lead": newLeadForm(); return;
        case "new-invoice": newInvoiceForm(); return;
        case "new-payment": newPaymentForm(); return;
        case "new-expense": newExpenseForm(); return;
        case "new-user": newUserForm(); return;
        case "new-task": newTaskForm(); return;
        case "new-campaign": newCampaignForm(); return;
        case "add-product": openProductForm(""); return;
        case "add-warehouse": addWarehouseForm(); return;
        case "new-transfer": newTransferForm(); return;
        case "new-po": newPOForm(); return;
        case "receive-goods": receiveGoods(id); return;
        case "advance-transfer": advanceTransfer(id); return;
        case "export-products": exportProducts(); return;
        case "export-orders": exportOrders(); return;
        case "export-finance": exportFinance(); return;
        case "export-report": exportCurrentReport(el.dataset.report); return;
        case "open-product": openProduct(id); return;
        case "open-order": openOrder(id); return;
        case "open-customer": openCustomer(id); return;
        case "open-lead": openLead(id); return;
        case "open-invoice": openInvoice(id); return;
        case "open-supplier": openSupplier(id); return;
        case "open-campaign": openCampaign(id); return;
        case "open-ad": openAd(id); return;
        case "open-task": openTask(id); return;
        case "open-funnel": openFunnel(); return;
        case "open-notifications": openNotifications(); return;
        case "open-user": openUser(); return;
        case "confirm-order": setOrderStatus(id, "Confirmed"); return;
        case "ship-order": setOrderStatus(id, "Shipped"); return;
        case "deliver-order": setOrderStatus(id, "Delivered"); return;
        case "return-order": setOrderStatus(id, "Returned"); return;
        case "mark-refunded": {
          const o = load("orders").find((x) => x.id === id);
          if (o) { o.paymentStatus = "Refunded"; upsert("orders", o); toast("Marked refunded", "ok"); shell(); }
          return;
        }
        case "advance-lead": advanceLead(id, arg); return;
        case "record-payment": recordPayment(id, el.dataset.amount || ""); return;
        case "set-task": setTaskStatus(id, arg); return;
        case "ask-sample": askAnalyst(arg); return;
        case "gen-report": genReport(el.dataset.report || arg || id); return;
        case "ai-report": runAIReport(el.dataset.report || arg || id); return;
        case "run-summary": runSummary(); return;
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target.closest("#erp-summary-run")) runSummary();
      if (e.target.closest("#erp-advisor-run")) runAdvisor();
      if (e.target.closest("#erp-supplier-ai")) runSupplierAI();
    });

    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.id === "range-switch") { state.range = t.value; shell(); return; }
      if (t.id === "company-switch") {
        const v = t.value;
        if (v === "__new") {
          const name = prompt("New company name:", "Acme Corp");
          if (!name) { t.value = company().id; return; }
          const id = uid();
          const list = getCompanies();
          list.push({ id, name, logo: (name[0] || "A").toUpperCase(), country: "DZ", currency: "DZD", tax: { rate: 19, config: "TVA inclusive" }, address: "", city: "", phone: "", email: "", website: "", type: "Retail", industry: "E-commerce", fiscalYear: "Jan–Dec", defaultWarehouse: "wh1", lang: "fr", timezone: "Africa/Algiers", createdAt: Date.now() });
          saveCompanies(list);
          setCompany(id);
          seedCompany(id, name);
          shell();
          toast("Company created — data isolated per tenant", "ok");
        } else {
          setCompany(v);
          shell();
          toast("Switched to " + (getCompanies().find((c) => c.id === v) || {}).name, "ok");
        }
        return;
      }
    });

    document.addEventListener("submit", async (e) => {
      const form = e.target;
      const fid = form.id;
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const num = (k) => Math.max(0, Number(data[k] || 0));

      if (fid === "sale-form") { e.preventDefault(); completeSale(data); return; }
      if (fid === "customer-form") {
        e.preventDefault();
        const c = { id: uid(), name: data.name, phone: data.phone || "", email: data.email || "", wilaya: data.wilaya || "", city: "", address: "", orders: 0, totalSpent: 0, aov: 0, lastPurchase: null, returns: 0, cancellations: 0, balance: 0, tags: [data.segment], source: "Manual", timeline: [] };
        upsert("customers", c);
        audit("Customer created", c.name);
        toast("Customer saved", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "lead-form") {
        e.preventDefault();
        const camp = load("campaigns").find((c) => c.id === data.campaignId);
        const l = { id: uid(), name: data.name, phone: data.phone || "", email: "", wilaya: data.wilaya || "", source: data.source, campaignId: camp ? camp.id : "", campaignName: camp ? camp.name : "", salesperson: me().name, stage: "New", status: "New", value: num("value"), expectedValue: num("value"), probability: 50, nextAction: "Call", notes: "", createdAt: new Date().toISOString(), willClose: day(10) };
        upsert("leads", l);
        audit("Lead created", l.name);
        toast("Lead saved", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "invoice-form") {
        e.preventDefault();
        const cust = load("customers").find((c) => c.id === data.customerId);
        const prod = load("products").find((p) => p.id === data.productId);
        const price = num("price") || prod.discountPrice || prod.sellingPrice;
        const qty = num("qty") || 1;
        const inv = { id: uid(), number: "INV-" + String(2200 + load("invoices").length + 1), customerId: cust.id, customerName: cust.name, total: price * qty, paid: 0, status: "Sent", items: [{ name: prod.name, qty, price }], dueDate: day(14), date: new Date().toISOString(), createdAt: new Date().toISOString() };
        upsert("invoices", inv);
        audit("Invoice created", inv.number + " · " + cust.name);
        toast("Invoice " + inv.number + " created", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "payment-form") {
        e.preventDefault();
        recordPayment(data.invoiceId, data.amount);
        return;
      }
      if (fid === "expense-form") {
        e.preventDefault();
        const x = { id: uid(), title: data.description, description: data.description, category: data.category, amount: num("amount"), method: data.method, date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(), warehouseId: "wh1", employeeId: "e7", notes: "", hasReceipt: false };
        upsert("expenses", x);
        audit("Expense added", x.title + " · " + money(x.amount));
        toast("Expense saved", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "user-form") {
        e.preventDefault();
        const u = { id: uid(), name: data.name, email: data.email, role: data.role, department: data.department, salary: num("salary"), createdAt: new Date().toISOString(), status: "Active" };
        upsert("users", u);
        audit("Employee invited", u.name + " · " + u.role);
        toast("Invited " + u.name, "ok"); closeModal(); shell();
        return;
      }
      if (fid === "task-form") {
        e.preventDefault();
        const t = { id: uid(), title: data.title, description: data.notes || "", type: data.type, priority: data.priority, status: "To do", assignedTo: data.assignedTo, due: data.due ? new Date(data.due).toISOString() : null, notes: data.notes || "", createdAt: new Date().toISOString() };
        upsert("tasks", t);
        audit("Task created", t.title);
        toast("Task created", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "campaign-form") {
        e.preventDefault();
        const c = { id: uid(), name: data.name, productId: "p1", channel: data.platform, budget: num("budget"), spend: 0, leads: 0, orders: 0, delivered: 0, returns: 0, revenue: 0, status: "Active", target: "All DZ", start: data.start ? new Date(data.start).toISOString() : day(0), end: data.end ? new Date(data.end).toISOString() : day(30) };
        upsert("campaigns", c);
        audit("Campaign created", c.name);
        toast("Campaign launched", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "settings-form") {
        e.preventDefault();
        const list = getCompanies().map((c) => c.id === company().id ? { ...c, name: data.name || c.name, currency: data.currency || c.currency, timezone: data.timezone || c.timezone, country: data.country || c.country } : c);
        saveCompanies(list);
        toast("Settings saved", "ok");
        shell();
        return;
      }
      if (fid === "product-form") {
        e.preventDefault();
        const p = { id: uid(), name: data.name, sku: data.sku, barcode: "", category: data.category || "General", brand: "", description: data.description || "", supplierId: data.supplierId, supplierCost: num("supplierCost"), sellingPrice: num("sellingPrice"), wholesalePrice: 0, discountPrice: num("discountPrice") || num("sellingPrice"), taxRate: 19, weight: 0, dims: "", minStock: 0, maxStock: 0, reorderLevel: num("reorderLevel"), type: "Physical", status: "Active", stock: 0, sold: 0, returned: 0, damaged: 0, variants: [] };
        upsert("products", p);
        const inv = load("inventory");
        if (!inv.some((i) => i.productId === p.id)) { inv.push({ id: "i" + p.id, productId: p.id, warehouseId: "wh1", onHand: 0, reserved: 0, incoming: 0 }); save("inventory", inv); }
        audit("Product created", p.name);
        toast("Product saved", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "transfer-form") {
        e.preventDefault();
        const src = load("warehouses").find((w) => w.id === data.sourceId);
        const dst = load("warehouses").find((w) => w.id === data.destId);
        const prod = load("products").find((p) => p.id === data.productId);
        const tr = { id: uid(), number: "TRF-" + (80 + load("transfers").length), sourceId: data.sourceId, destId: data.destId, status: "Requested", items: [{ productId: prod.id, name: prod.name, qty: num("qty") }], requestedBy: me().name, createdAt: new Date().toISOString() };
        upsert("transfers", tr);
        audit("Transfer requested", tr.number + " · " + src.name + " → " + dst.name);
        toast("Transfer request created", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "po-form") {
        e.preventDefault();
        createPO(data);
        return;
      }
      if (fid === "receiving-form") {
        e.preventDefault();
        confirmReceiving(form);
        return;
      }
      if (fid === "warehouse-form") {
        e.preventDefault();
        const w = { id: uid(), name: data.name, location: data.location || "", manager: data.manager || "", status: "Active" };
        upsert("warehouses", w);
        audit("Warehouse created", w.name);
        toast("Warehouse added", "ok"); closeModal(); shell();
        return;
      }
      if (fid === "erp-ask-form") {
        e.preventDefault();
        const q = $("#erp-ask-input");
        askAnalyst(q ? q.value : "");
        return;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeModal(); closeDrawer(); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const s = $("#erp-global-search");
        if (s) s.focus();
      }
    });

    const gs = $("#erp-global-search");
    if (gs) gs.addEventListener("input", () => {
      state.q = gs.value;
      const sec = ["products", "orders", "customers", "invoices"].includes(state.section) ? state.section : "products";
      state.section = sec;
      shell();
      gs.focus();
    });
  }

  function exportCurrentReport(name) {
    const a = agg();
    const rows = [["Metric", "Value"]];
    if (name === "sales") { a.topProducts.forEach((p) => rows.push([p.name, p.delivered + " delivered · " + p.revenue + " · " + p.profit])); }
    else if (name === "inventory") { a.products.forEach((p) => { const st = stockFor(p.id); rows.push([p.name, "onHand " + st.onHand + " · avail " + st.available + " · reorder " + p.reorderLevel]); }); }
    else if (name === "finance") { rows.push(["Revenue", a.kpis.revenue], ["Gross", a.kpis.gross], ["Expenses", a.kpis.expTotal], ["Net", a.kpis.net]); }
    else if (name === "customers") { a.customers.slice(0, 10).forEach((c) => rows.push([c.name, c.delivered + " orders · " + c.totalSpent])); }
    else if (name === "suppliers") { a.suppliers.forEach((s) => rows.push([s.name, s.avgCost + " avg · " + s.deliveryTime + "d · " + s.defectRate + "% defects"])); }
    else if (name === "purchasing") { load("pos").forEach((po) => rows.push([po.number, po.supplierName + " · " + po.total + " · " + po.status])); }
    else if (name === "returns") { a.orders.filter((o) => o.status === "Returned" || o.status === "Cancelled").forEach((o) => rows.push([o.orderNumber, o.customerName + " · " + o.status + " · " + o.total])); }
    else { Object.entries(a.kpis).slice(0, 20).forEach(([k, v]) => rows.push([k, v])); }
    exportCSV(name + "-report", rows);
  }

  function advanceLead(id, to) {    const l = load("leads").find((x) => x.id === id);
    if (!l) return;
    l.status = to;
    if (to === "Won") { l.probability = 100; }
    if (to === "Lost") { l.probability = 0; }
    upsert("leads", l);
    audit("Lead → " + to, l.name);
    toast("Lead moved to " + to, "ok");
    closeModal();
    shell();
  }

  function setTaskStatus(id, to) {
    const t = load("tasks").find((x) => x.id === id);
    if (!t) return;
    t.status = to;
    upsert("tasks", t);
    audit("Task → " + to, t.title);
    toast("Task moved to " + to, "ok");
    closeModal();
    shell();
  }

  function addWarehouseForm() {
    openModal(`
      <div class="flex items-center justify-between"><div class="erp-title">New warehouse</div><button class="erp-btn ghost" data-action="close-modal">${icon("x", 15)}</button></div>
      <form id="warehouse-form" class="grid grid-cols-2 gap-3 mt-4">
        <div class="col-span-2"><label class="label">Name</label><input class="erp-input w-full" name="name" required></div>
        <div><label class="label">Location</label><input class="erp-input w-full" name="location"></div>
        <div><label class="label">Manager</label><input class="erp-input w-full" name="manager"></div>
        <div class="col-span-2 flex justify-end"><button class="erp-btn primary" type="submit">${icon("check", 15)} Create</button></div>
      </form>`);
  }

  function seedCompany(id, name) {
    const was = localStorage.getItem(KEY_CURRENT);
    setCompany(id);
    try { ensureSeed(); }
    finally { setCompany(was || id); }
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
