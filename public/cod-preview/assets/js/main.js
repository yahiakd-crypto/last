/* COD landing — order logic.
   DESIGN RULES (from the master prompt):
   - No fabricated facts. Every number below lives in CONFIG so the seller sets
     truthful values. Demo/placeholder numbers are marked NEEDS USER INPUT and
     the footer + success state tell the visitor when something is a demo.
   - 4-language content layer (en / fr / ar / dz) — swap without touching markup.
   - Quantity + tiered pricing + shipping rule + validation + FAQ + sticky bar. */

/* ============================================================
   SELLER CONFIG — replace every value with your real data.
   Urgency values (stockLeft, rating, reviewCount, ordersDelivered)
   are DEMO placeholders: set them truthfully or to 0/null to hide.
   ============================================================ */
const CONFIG = {
  brand: "Punchline Store",
  /* Contact — replace with real numbers */
  phoneTel: "+213000000000",
  whatsapp: "https://wa.me/213000000000",

  /* Product — replace with your real product (never invent facts) */
  productName: "Your Product Name",
  tagline: "Add a short persuasive benefit line here — set in CONFIG.",
  currency: "DZD",

  /* Pricing (demo values — set truthful prices) */
  unitPrice: 1490,
  oldPrice: 1990,                 // crossed-out reference price; set null to hide
  tierQty: 2,                     // buy >= tierQty -> tierPrice per unit
  tierPrice: 1345,
  shippingFlat: 400,              // flat shipping fee (DZD)
  freeShippingAbove: 3000,        // order subtotal >= this -> free delivery

  /* Social proof (demo placeholders — replace or null to hide) */
  rating: 4.8,
  reviewCount: 214,
  ordersDelivered: "2,300+",
  stockLeft: 12,                  // set 0/null to hide "Only X left"
};

/* ------------------------------------------------------------
   ALGERIA WILAYAS (58) — swap this array for another country's
   admin divisions if needed; the UI adapts automatically.
   ------------------------------------------------------------ */
const WILAYAS = [
  "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira",
  "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda",
  "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla",
  "Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela",
  "Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar",
  "Ouled Djellal","Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M'Ghair","El Meniaa",
];

/* ------------------------------------------------------------
   CONTENT LAYER — copy per language. UI strings + FAQ.
   ------------------------------------------------------------ */
const STRINGS = {
  en: {
    announce: "Fast delivery • Cash on Delivery available",
    orderNow: "Order Now",
    secureOrder: "100% secure order — pay when you receive it",
    currencyNote: "Price per unit",
    reviewsLabel: "reviews",
    featuredPill: "Hot offer",
    imgPlaceholder: "Product image — add yours",
    form: {
      title: "Complete your order", subtitle: "Fill in the form — we will call you to confirm",
      name: "Full name", namePh: "e.g. Ahmed Benali",
      phone: "Phone number", phonePh: "0550 12 34 56", phoneHint: "Algerian format: 05/06/07 + 8 digits",
      wilaya: "Wilaya", wilayaPh: "Select your wilaya",
      address: "Commune / address", addressPh: "Commune, street, house number",
      qty: "Quantity", tierHint: "Buy 2+ and save per unit",
      summary: "Order summary", unit: "Unit price", shipping: "Shipping", freeShip: "Free delivery",
      savings: "You save", total: "Total",
      paymentLabel: "Cash on Delivery — pay when you receive your order",
      submit: "Confirm my order", submitMicro: "100% secure order • No prepayment",
    },
    errors: {
      name: "Please enter your full name",
      phone: "Enter a valid phone number (e.g. 0550 12 34 56)",
      wilaya: "Please select your wilaya",
      address: "Please enter your commune / address",
    },
    success: {
      title: "Your order has been received!",
      msg: "Our team will call you to confirm delivery details.",
      demoNote: "Demo mode — no backend configured, order stored in this browser only.",
      newOrder: "Place another order",
    },
    trust: {
      fastT: "Fast delivery", fastD: "Delivered to your door in days",
      payT: "Pay on delivery", payD: "Cash when your order arrives",
      returnsT: "Easy returns", returnsD: "Hassle-free within the return window",
      qualityT: "Verified quality", qualityD: "Checked before it ships to you",
    },
    benefits: { title: "Why you will love it",
      b1t: "Benefit 1 (edit me)", b1d: "Add your first product benefit here — set the copy in CONFIG.",
      b2t: "Benefit 2 (edit me)", b2d: "Add your second product benefit here — never invent facts.",
      b3t: "Benefit 3 (edit me)", b3d: "Add your third product benefit here — set the copy in CONFIG." },
    proof: { title: "Trusted by customers",
      ordersL: "orders delivered", ratingL: "average rating", wilayasL: "wilayas covered",
      t1q: "“Add a real customer quote here — never invent testimonials.”", t1n: "Customer name", t1c: "Algiers",
      t2q: "“Add a second real customer quote here — replace before going live.”", t2n: "Customer name", t2c: "Oran" },
    faq: { title: "Questions & answers" },
    faqs: [
      { q: "Is it really cash on delivery?", a: "Yes — you only pay when the order arrives at your door. No prepayment is required." },
      { q: "How long does delivery take?", a: "Delivery time depends on your wilaya. Set the real estimate in CONFIG before going live." },
      { q: "Can I return the product?", a: "Yes. Contact us within the return window and we will arrange a return or exchange." },
      { q: "How will you confirm my order?", a: "Our team will call you to confirm the address and delivery details before shipping." },
    ],
    sticky: { totalLabel: "Total (incl. shipping)" },
    footer: { delivery: "Delivery & returns", contact: "Contact us",
      demo: "Demo preview — all prices, stock and review numbers are placeholders. Set your real product values in CONFIG inside assets/js/main.js." },
    stockLeft: "Only {n} left",
    tierOffer: "Buy {n}+ — save {s} each",
    savePct: "Save {p}%",
    toastErr: "Please complete the highlighted fields.",
  },

  fr: {
    announce: "Livraison rapide • Paiement à la livraison",
    orderNow: "Commander",
    secureOrder: "Commande 100% sécurisée — payez à la réception",
    currencyNote: "Prix unitaire",
    reviewsLabel: "avis",
    featuredPill: "Offre spéciale",
    imgPlaceholder: "Image produit — ajoutez la vôtre",
    form: {
      title: "Complétez votre commande", subtitle: "Remplissez le formulaire — nous vous appellerons pour confirmer",
      name: "Nom complet", namePh: "ex. Ahmed Benali",
      phone: "Numéro de téléphone", phonePh: "0550 12 34 56", phoneHint: "Format algérien : 05/06/07 + 8 chiffres",
      wilaya: "Wilaya", wilayaPh: "Choisissez votre wilaya",
      address: "Commune / adresse", addressPh: "Commune, rue, numéro",
      qty: "Quantité", tierHint: "Achetez 2+ et économisez par unité",
      summary: "Récapitulatif", unit: "Prix unitaire", shipping: "Livraison", freeShip: "Livraison gratuite",
      savings: "Vous économisez", total: "Total",
      paymentLabel: "Paiement à la livraison — payez à la réception",
      submit: "Confirmer ma commande", submitMicro: "Commande 100% sécurisée • Aucun prépaiement",
    },
    errors: {
      name: "Veuillez saisir votre nom complet",
      phone: "Entrez un numéro valide (ex. 0550 12 34 56)",
      wilaya: "Veuillez choisir votre wilaya",
      address: "Veuillez saisir votre commune / adresse",
    },
    success: {
      title: "Votre commande a été reçue !",
      msg: "Notre équipe vous appellera pour confirmer la livraison.",
      demoNote: "Mode démo — aucun backend configuré, commande enregistrée uniquement dans ce navigateur.",
      newOrder: "Passer une autre commande",
    },
    trust: {
      fastT: "Livraison rapide", fastD: "Livrée à votre porte en quelques jours",
      payT: "Paiement à la livraison", payD: "En espèces à la réception",
      returnsT: "Retours faciles", returnsD: "Sans tracas pendant la période de retour",
      qualityT: "Qualité vérifiée", qualityD: "Vérifiée avant expédition",
    },
    benefits: { title: "Pourquoi vous allez l'adorer",
      b1t: "Avantage 1 (à modifier)", b1d: "Ajoutez ici votre premier avantage produit — réglez le texte dans CONFIG.",
      b2t: "Avantage 2 (à modifier)", b2d: "Ajoutez votre second avantage — n'inventez jamais de faits.",
      b3t: "Avantage 3 (à modifier)", b3d: "Ajoutez votre troisième avantage — réglez le texte dans CONFIG." },
    proof: { title: "La confiance de nos clients",
      ordersL: "commandes livrées", ratingL: "note moyenne", wilayasL: "wilayas couvertes",
      t1q: "“Ajoutez ici un vrai avis client — n'inventez jamais de témoignages.”", t1n: "Nom du client", t1c: "Alger",
      t2q: "“Ajoutez un second avis réel — remplacez-le avant la mise en ligne.”", t2n: "Nom du client", t2c: "Oran" },
    faq: { title: "Questions fréquentes" },
    faqs: [
      { q: "Le paiement à la livraison est-il réel ?", a: "Oui — vous payez uniquement à la réception. Aucun prépaiement n'est requis." },
      { q: "Quel est le délai de livraison ?", a: "Le délai dépend de votre wilaya. Réglez l'estimation réelle dans CONFIG avant la mise en ligne." },
      { q: "Puis-je retourner le produit ?", a: "Oui. Contactez-nous pendant la période de retour et nous organiserons un retour ou un échange." },
      { q: "Comment confirmez-vous ma commande ?", a: "Notre équipe vous appellera pour confirmer l'adresse et les détails avant l'expédition." },
    ],
    sticky: { totalLabel: "Total (livraison incluse)" },
    footer: { delivery: "Livraison & retours", contact: "Contactez-nous",
      demo: "Aperçu démo — tous les prix, stocks et avis sont des exemples. Réglez vos vraies valeurs dans CONFIG (assets/js/main.js)." },
    stockLeft: "Plus que {n} en stock",
    tierOffer: "Achetez {n}+ — économisez {s} par unité",
    savePct: "Économisez {p}%",
    toastErr: "Veuillez compléter les champs en surbrillance.",
  },

  ar: {
    announce: "توصيل سريع • الدفع عند الاستلام متاح",
    orderNow: "اطلب الآن",
    secureOrder: "طلب آمن 100% — الدفع عند الاستلام",
    currencyNote: "سعر الوحدة",
    reviewsLabel: "تقييمات",
    featuredPill: "عرض مميز",
    imgPlaceholder: "صورة المنتج — أضف صورتك",
    form: {
      title: "أكمل طلبك", subtitle: "املأ الاستمارة — سنتصل بك للتأكيد",
      name: "الاسم الكامل", namePh: "مثال: أحمد بن علي",
      phone: "رقم الهاتف", phonePh: "0550 12 34 56", phoneHint: "الصيغة الجزائرية: 05/06/07 + 8 أرقام",
      wilaya: "الولاية", wilayaPh: "اختر ولايتك",
      address: "البلدية / العنوان", addressPh: "البلدية، الشارع، رقم المنزل",
      qty: "الكمية", tierHint: "اشترِ 2+ ووفّر على الوحدة",
      summary: "ملخص الطلب", unit: "سعر الوحدة", shipping: "التوصيل", freeShip: "توصيل مجاني",
      savings: "توفيرك", total: "المجموع",
      paymentLabel: "الدفع عند الاستلام — ادفع عند وصول طلبك",
      submit: "تأكيد الطلب", submitMicro: "طلب آمن 100% • بدون دفع مسبق",
    },
    errors: {
      name: "يرجى إدخال الاسم الكامل",
      phone: "أدخل رقم هاتف صحيح (مثال: 0550 12 34 56)",
      wilaya: "يرجى اختيار الولاية",
      address: "يرجى إدخال البلدية / العنوان",
    },
    success: {
      title: "تم استلام طلبك!",
      msg: "سيتصل بك فريقنا لتأكيد التوصيل.",
      demoNote: "وضع تجريبي — لا يوجد خادم، الطلب محفوظ في هذا المتصفح فقط.",
      newOrder: "إصدار طلب آخر",
    },
    trust: {
      fastT: "توصيل سريع", fastD: "يصل إلى باب منزلك بسرعة",
      payT: "ادفع عند الاستلام", payD: "نقداً عند وصول الطلب",
      returnsT: "إرجاع سهل", returnsD: "بدون تعقيدات ضمن مدة الإرجاع",
      qualityT: "جودة مضمونة", qualityD: "يُفحص قبل الشحن",
    },
    benefits: { title: "لماذا ستحبه",
      b1t: "الفائدة الأولى (عدّلني)", b1d: "أضف أول فائدة لمنتجك — حدّد النص في CONFIG.",
      b2t: "الفائدة الثانية (عدّلني)", b2d: "أضف الفائدة الثانية — لا تخترع حقائق أبداً.",
      b3t: "الفائدة الثالثة (عدّلني)", b3d: "أضف الفائدة الثالثة — حدّد النص في CONFIG." },
    proof: { title: "موثوق من عملائنا",
      ordersL: "طلب تم توصيله", ratingL: "متوسط التقييم", wilayasL: "ولاية نغطيها",
      t1q: "“أضف اقتباساً حقيقياً من عميل هنا — لا تخترع شهادات أبداً.”", t1n: "اسم العميل", t1c: "الجزائر",
      t2q: "“أضف اقتباساً ثانياً حقيقياً — استبدله قبل النشر.”", t2n: "اسم العميل", t2c: "وهران" },
    faq: { title: "الأسئلة الشائعة" },
    faqs: [
      { q: "هل الدفع فعلاً عند الاستلام؟", a: "نعم — تدفع فقط عند وصول الطلب إلى بابك. لا يوجد دفع مسبق." },
      { q: "كم تستغرق مدة التوصيل؟", a: "تعتمد على ولايتك. حدّد المدة الحقيقية في CONFIG قبل النشر." },
      { q: "هل يمكنني إرجاع المنتج؟", a: "نعم. تواصل معنا ضمن مدة الإرجاع وسنرتب الإرجاع أو الاستبدال." },
      { q: "كيف ستؤكدون طلبي؟", a: "سيتصل بك فريقنا لتأكيد العنوان وتفاصيل التوصيل قبل الشحن." },
    ],
    sticky: { totalLabel: "المجموع (مع التوصيل)" },
    footer: { delivery: "التوصيل والإرجاع", contact: "اتصل بنا",
      demo: "معاينة تجريبية — كل الأسعار والمخزون والتقييمات مؤقتة. حدّد قيم منتجك الحقيقية في CONFIG داخل assets/js/main.js." },
    stockLeft: "بقي {n} فقط",
    tierOffer: "اشترِ {n}+ — وفّر {s} للوحدة",
    savePct: "وفّر {p}%",
    toastErr: "يرجى إكمال الحقول المميزة.",
  },

  dz: {
    announce: "توصيل سريع • الخلاص عند الاستلام متاح",
    orderNow: "اطلب دابا",
    secureOrder: "الطلب مضمون 100% — تخلص ملي توصلك",
    currencyNote: "الثمن للوحدة",
    reviewsLabel: "تقييمات",
    featuredPill: "عرض خاص",
    imgPlaceholder: "تصويرة المنتج — ضع تصويرة ديالك",
    form: {
      title: "كمّل طلبك", subtitle: "عمّر الاستمارة — غادي نتصلو بيك للتأكيد",
      name: "الاسم الكامل", namePh: "مثال: أحمد بن علي",
      phone: "رقم التلفون", phonePh: "0550 12 34 56", phoneHint: "الصيغة الجزائرية: 05/06/07 + 8 أرقام",
      wilaya: "الولاية", wilayaPh: "خيّر ولايتك",
      address: "البلدية / العنوان", addressPh: "البلدية، الزنقة، رقم الدار",
      qty: "الكمية", tierHint: "شري 2+ واربح على الوحدة",
      summary: "ملخص الطلب", unit: "ثمن الوحدة", shipping: "التوصيل", freeShip: "التوصيل بلا ثمن",
      savings: "ربيحك", total: "المجموع",
      paymentLabel: "الخلاص عند الاستلام — تخلص ملي يوصلك الطلب",
      submit: "أكد الطلب", submitMicro: "الطلب مضمون 100% • بلا خلاص مسبق",
    },
    errors: {
      name: "عمّر الاسم الكامل",
      phone: "عطيني رقم صحيح (مثال: 0550 12 34 56)",
      wilaya: "خيّر ولايتك",
      address: "عمّر البلدية / العنوان",
    },
    success: {
      title: "توصلنا لطلبك!",
      msg: "غادي يتصلو بيك لتأكيد التوصيل.",
      demoNote: "وضع تجريبي — ما عندناش خادم، الطلب مسجل غير في هذا المتصفح.",
      newOrder: "اطلب شي حاجة أخرى",
    },
    trust: {
      fastT: "توصيل سريع", fastD: "يوصلوك حتى لباب الدار",
      payT: "خلص عند الاستلام", payD: "نقدا ملي يوصلك",
      returnsT: "الإرجاع ساهل", returnsD: "من غير مشاكل في مدة الإرجاع",
      qualityT: "جودة مضمونة", qualityD: "مدقق قبل ما يخرج",
    },
    benefits: { title: "علاش غادي يعجبك",
      b1t: "الفائدة الأولى (بدّلني)", b1d: "زد أول فائدة للمنتج — حدّد النص في CONFIG.",
      b2t: "الفائدة الثانية (بدّلني)", b2d: "زد الفائدة الثانية — لا تخترع الحوايج أبداً.",
      b3t: "الفائدة الثالثة (بدّلني)", b3d: "زد الفائدة الثالثة — حدّد النص في CONFIG." },
    proof: { title: "يثقو بيا العملاء",
      ordersL: "طلب توصل", ratingL: "متوسط التقييم", wilayasL: "ولاية نغطيوهم",
      t1q: "“زد هنا اقتباس حقيقي من عميل — لا تخترع شهادات أبداً.”", t1n: "سمية العميل", t1c: "الجزائر",
      t2q: "“زد اقتباس ثاني حقيقي — بدّلو قبل ما تنشر.”", t2n: "سمية العميل", t2c: "وهران" },
    faq: { title: "الأسئلة المتكررة" },
    faqs: [
      { q: "واش خاصة الدفع عند الاستلام؟", a: "أيوه — تخلص غير ملي يوصلك الطلب لباب الدار. ما كاينش خلاص مسبق." },
      { q: "شحال ياخد التوصيل؟", a: "حسب ولايتك. حدّد المدة الحقيقية في CONFIG قبل ما تنشر." },
      { q: "نقدر نرجع المنتج؟", a: "أيوه. اتصل بينا في مدة الإرجاع ونرتبو الإرجاع ولا التبديل." },
      { q: "كيفاش تثبتو طلبي؟", a: "غادي يتصلو بيك لتأكيد العنوان وتفاصيل التوصيل قبل الشحن." },
    ],
    sticky: { totalLabel: "المجموع (مع التوصيل)" },
    footer: { delivery: "التوصيل والإرجاع", contact: "اتصل بينا",
      demo: "معاينة تجريبية — كل الأسعار والمخزون والتقييمات مؤقتة. حدّد القيم الحقيقية في CONFIG داخل assets/js/main.js." },
    stockLeft: "باقي {n} بوح",
    tierOffer: "شري {n}+ — ربح {s} على الوحدة",
    savePct: "ربح {p}%",
    toastErr: "عمّر الحقول المميزة بلا ما نكملو.",
  },
};

/* ------------------------------------------------------------ */

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const state = { qty: 1 };
let LANG = localStorage.getItem("cod.lang") || "en";

const fmt = (n) => Number(n || 0).toLocaleString("en-US");
const fill = (tpl, vars) => String(tpl || "").replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));

const effectiveUnit = () => (state.qty >= CONFIG.tierQty ? CONFIG.tierPrice : CONFIG.unitPrice);
const savePct = () => Math.max(0, Math.round((1 - CONFIG.unitPrice / CONFIG.oldPrice) * 100));

function t(key, vars) {
  const root = STRINGS[LANG] || STRINGS.en;
  const val = key.split(".").reduce((o, k) => (o ? o[k] : undefined), root);
  const fallback = key.split(".").reduce((o, k) => (o ? o[k] : undefined), STRINGS.en);
  const out = val ?? fallback ?? key;
  return vars ? fill(out, vars) : out;
}

function initials(str) {
  return String(str || "?")
    .split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "?";
}

/* ---------- Language ---------- */
function applyLang() {
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === "ar" || LANG === "dz" ? "rtl" : "ltr";
  $$("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const custom = { productName: CONFIG.productName, tagline: CONFIG.tagline };
    el.textContent = key in custom ? custom[key] : t(key);
  });
  $$("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  const wPh = $("#f-wilaya option[value='']");
  if (wPh) wPh.textContent = t("form.wilayaPh");
  $$("[data-avatar]").forEach((el) => {
    const name = el.closest(".card") ? t("proof.t1n") : "";
    el.textContent = initials(name || t("proof.t1n"));
  });
  renderFAQ();
  renderTotals();
  renderSocial();
  if (window.lucide) lucide.createIcons();
}

function initLang() {
  $$(".lang-btn").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
  setLang(localStorage.getItem("cod.lang") || "en");
}

function setLang(l) {
  LANG = ["en", "fr", "ar", "dz"].includes(l) ? l : "en";
  localStorage.setItem("cod.lang", LANG);
  $$(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === LANG));
  applyLang();
}

/* ---------- Wilayas ---------- */
function populateWilayas() {
  const sel = $("#f-wilaya");
  WILAYAS.forEach((w) => {
    const o = document.createElement("option");
    o.value = w;
    o.textContent = w;
    sel.appendChild(o);
  });
}

/* ---------- Quantity + pricing ---------- */
function bindQty() {
  $$(".qty-btn").forEach((b) =>
    b.addEventListener("click", () => {
      state.qty = Math.min(99, Math.max(1, state.qty + Number(b.dataset.dir)));
      renderTotals();
    })
  );
}

function renderTotals() {
  const qty = state.qty;
  const unit = effectiveUnit();
  const subtotal = unit * qty;
  const savings = (CONFIG.unitPrice - unit) * qty;
  const shipping = subtotal >= CONFIG.freeShippingAbove ? 0 : CONFIG.shippingFlat;
  const total = subtotal + shipping;

  $$("[data-qty-val]").forEach((el) => { el.textContent = qty; });

  $("#hero-price").textContent = fmt(unit);
  if (CONFIG.oldPrice && CONFIG.oldPrice > CONFIG.unitPrice) {
    $("#hero-old-price").textContent = fmt(CONFIG.unitPrice);
    $("#hero-old-price").style.display = "";
  }
  $("#hero-save-pct").textContent = t("savePct", { p: savePct() });
  $("#save-pill").textContent = "-" + savePct() + "%";
  $("#save-pill").style.display = savePct() > 0 ? "" : "none";

  const stockPill = $("#stock-pill");
  if (CONFIG.stockLeft) {
    stockPill.textContent = t("stockLeft", { n: CONFIG.stockLeft });
    stockPill.style.display = "";
  } else {
    stockPill.style.display = "none";
  }

  $("#sum-unit").textContent = fmt(unit);
  $("#sum-qty").textContent = qty;
  $("#sum-savings-row").style.display = savings > 0 ? "flex" : "none";
  $("#sum-savings").textContent = "-" + fmt(savings);
  $("#sum-ship").textContent = shipping === 0 ? t("form.freeShip") : fmt(shipping);
  $("#sum-total").textContent = fmt(total);
  $("#sticky-price").textContent = fmt(total);

  $("#tier-hint").textContent = t("tierOffer", { n: CONFIG.tierQty, s: fmt((CONFIG.unitPrice - CONFIG.tierPrice) * 1) });
}

/* ---------- Stars + social proof ---------- */
function starHTML(filled) {
  return `<svg viewBox="0 0 24 24" width="15" height="15" fill="${filled ? "#F5B301" : "#E2E1DF"}" stroke="${filled ? "#F5B301" : "#E2E1DF"}" stroke-width="1.5"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.4 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>`;
}

function renderSocial() {
  const rating = CONFIG.rating || 0;
  const filled = Math.round(rating);
  $("#hero-stars").innerHTML = Array.from({ length: 5 }, (_, i) => starHTML(i < filled)).join("");
  $("#hero-rating").textContent = rating.toFixed(1);
  const revLbl = $("#hero-rating").nextElementSibling;
  revLbl.textContent = `(${CONFIG.reviewCount ?? 0}) ` + t("reviewsLabel");

  $$("[data-stars]").forEach((el) => {
    el.innerHTML = Array.from({ length: Number(el.dataset.stars) || 5 }, () => starHTML(true)).join("");
  });

  if (CONFIG.ordersDelivered) $("#kpi-orders").textContent = CONFIG.ordersDelivered;
  if (CONFIG.rating) $("#kpi-rating").textContent = rating.toFixed(1) + "★";
  if (CONFIG.wilayas === undefined || CONFIG.wilayas === null) {
    $("#kpi-wilayas").textContent = WILAYAS.length;
  }
}

/* ---------- FAQ ---------- */
function renderFAQ() {
  const list = $("#faq-list");
  list.innerHTML = t("faqs").map((f, i) => `
    <div class="faq-item">
      <button type="button" class="faq-btn" data-faq="${i}">
        <span>${f.q}</span>
        <span class="faq-caret"><i data-lucide="chevron-down" style="width:18px;height:18px"></i></span>
      </button>
      <div class="faq-body"><div class="faq-body-inner">${f.a}</div></div>
    </div>`).join("");
  if (window.lucide) lucide.createIcons();

  $$(".faq-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const body = item.querySelector(".faq-body");
      const isOpen = item.classList.contains("open");
      $$(".faq-item").forEach((it) => {
        it.classList.remove("open");
        it.querySelector(".faq-body").style.maxHeight = "0px";
      });
      if (!isOpen) {
        item.classList.add("open");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    })
  );
}

/* ---------- Validation + submit ---------- */
const errEl = (name) => $(`[data-err-for="${name}"]`);

function validate() {
  const v = {
    name: $("#f-name").value.trim(),
    phone: $("#f-phone").value.replace(/[\s\-]/g, ""),
    wilaya: $("#f-wilaya").value,
    address: $("#f-address").value.trim(),
  };
  const errors = {};
  if (v.name.length < 2) errors.name = t("errors.name");
  if (!/^(0|\+213)(5|6|7)\d{8}$/.test(v.phone)) errors.phone = t("errors.phone");
  if (!v.wilaya) errors.wilaya = t("errors.wilaya");
  if (v.address.length < 2) errors.address = t("errors.address");
  return errors;
}

function showErrors(errors) {
  ["name", "phone", "wilaya", "address"].forEach((k) => {
    const el = $(`#f-${k}`);
    const msg = errEl(k);
    if (errors[k]) {
      msg.textContent = errors[k];
      el.classList.add("has-error");
    } else {
      msg.textContent = "";
      el.classList.remove("has-error");
    }
  });
}

function bindForm() {
  const form = $("#cod-form");
  ["name", "phone", "address"].forEach((k) => {
    $(`#f-${k}`).addEventListener("input", () => {
      errEl(k).textContent = "";
      $(`#f-${k}`).classList.remove("has-error");
    });
  });
  $("#f-wilaya").addEventListener("change", () => {
    errEl("wilaya").textContent = "";
    $("#f-wilaya").classList.remove("has-error");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      showErrors(errors);
      toast(t("toastErr"));
      const first = document.querySelector(".has-error");
      if (first) first.focus();
      return;
    }

    const unit = effectiveUnit();
    const subtotal = unit * state.qty;
    const shipping = subtotal >= CONFIG.freeShippingAbove ? 0 : CONFIG.shippingFlat;

    const payload = {
      name: $("#f-name").value.trim(),
      phone: $("#f-phone").value.trim(),
      wilaya: $("#f-wilaya").value,
      address: $("#f-address").value.trim(),
      product: CONFIG.productName,
      quantity: state.qty,
      unitPrice: unit,
      shipping,
      total: subtotal + shipping,
      currency: CONFIG.currency,
      language: LANG,
    };

    const btn = $("#submit-btn");
    btn.disabled = true;
    btn.innerHTML = `<span data-i18n="form.submitting" class="submit-lbl">Placing order…</span>`;

    const res = await COD_API.submitOrder(payload);

    form.style.display = "none";
    $("#order-success").classList.remove("hidden");
    $("#success-order").textContent = t("success.msg") + "  •  Ref " + res.orderNumber;
    $("#success-demo").hidden = !res.demo;
    $("#order-form").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#new-order-btn").addEventListener("click", () => {
    form.reset();
    state.qty = 1;
    renderTotals();
    showErrors({});
    $("#cod-form").style.display = "";
    $("#order-success").classList.add("hidden");
    const btn = $("#submit-btn");
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="lock" style="width:18px;height:18px"></i><span data-i18n="form.submit">Confirm my order</span>`;
    if (window.lucide) lucide.createIcons();
    $("#order-form").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* ---------- Sticky bar / scroll helpers ---------- */
function scrollToForm() {
  $("#order-form").scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => $("#f-name").focus({ preventScroll: true }), 450);
}

function bindScroll() {
  $("#hero-order-btn").addEventListener("click", scrollToForm);
  $("#sticky-order-btn").addEventListener("click", scrollToForm);
  $("#back-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    $("#back-top").style.display = window.scrollY > 600 ? "" : "none";
  }, { passive: true });
}

/* ---------- Contact config ---------- */
function applyContact() {
  $("#phone-btn").href = "tel:" + CONFIG.phoneTel;
  $("#wa-btn").href = CONFIG.whatsapp;
}

/* ---------- Toast ---------- */
function toast(msg) {
  let el = $(".toast-cod");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast-cod";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._tm);
  el._tm = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------- Init ---------- */
function init() {
  applyContact();
  populateWilayas();
  bindQty();
  bindForm();
  bindScroll();
  initLang();
  renderSocial();
  renderFAQ();
  renderTotals();
  if (window.lucide) lucide.createIcons();
}

document.addEventListener("DOMContentLoaded", init);
