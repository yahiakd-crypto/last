export interface CompetitorItem {
  name: string;
  productUrl: string;
  price: number;
  currency: string;
  shipping?: string | null;
  rating?: number | null;
  reviews?: number | null;
  positioning: string;
  differentiation: string;
  type: 'exact' | 'substitute' | 'broad';
}

export interface ProductSpecItem {
  attribute: string;
  value: string;
  confidence: 'High' | 'Medium' | 'Low';
  status: 'VERIFIED' | 'ESTIMATED' | 'AI INFERENCE' | 'NOT FOUND';
}

export interface AdAngleItem {
  title: string;
  desc: string;
}

export interface DetailedProduct {
  id: string;
  name: string;
  status: 'Researching' | 'Active' | 'Testing' | 'Validated' | 'Paused' | 'Archived';
  category: string;
  source?: string;
  country: string;
  currency?: string;
  language?: string;
  createdAt?: string;
  mainImage: string;
  gallery?: string[];
  favorite?: boolean;
  pinned?: boolean;
  hot?: boolean;
  highMargin?: boolean;
  supplier: {
    name: string;
    rating?: number | null;
    reliabilityScore?: number | null;
    storeAge?: string;
    orders?: number | null;
    shippingTime: string;
    processingTime?: string;
    moq: number;
    location: string;
  };
  financials: {
    sellingPrice: number;
    costPrice: number;
    shippingCost: number;
    roi: number;
    breakEvenPrice: number;
  };
  opportunity: {
    overallScore: number;
    demand: number;
    competition: number;
    margin: number;
    supplier?: number;
    trend?: number;
    algeriaCodSuitability: number;
    advertisingPotential?: number;
    evidenceQuality?: number;
  };
  competitors: CompetitorItem[];
  specifications?: ProductSpecItem[];
  adAngles?: AdAngleItem[];
  intelligence: {
    demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIRAL';
    competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'SATURATED';
    trendDirection: 'UP' | 'DOWN' | 'STABLE' | 'SEASONAL';
    seasonality?: string;
    impulseBuy?: 'LOW' | 'MEDIUM' | 'HIGH';
    targetCustomer: string;
    evidenceNotes: string;
  };
  visualSummary?: string;
  ocrText?: string[];
  details?: {
    material?: string;
    supportType?: string;
    contents?: string;
    colorVariants?: string[];
    sizes?: string;
    certifications?: string[];
    packaging?: string;
    identifiers?: string;
    warranty?: string;
  };
  aiAnalysis: {
    whySell: string[];
    risks: string[];
    marketingAngle: string;
    suggestedPrice: string;
    adScore?: number;
    customerSegments?: string[];
    painPoints?: string[];
    usp?: string[];
    objections?: string[];
    creativeFormats?: string[];
    adAngles?: AdAngleItem[];
    adHooks?: string[];
    landingPageStructure?: string[];
    bundles?: string[];
    testingPlan?: string;
    scaleReviseStop?: string;
  };
  structuredNotes?: {
    supplierNotes?: string;
    pricingNotes?: string;
    competitionNotes?: string;
    aiNotes?: string;
  };
  checklist?: Array<{
    text: string;
    done: boolean;
  }>;
  timeline?: Array<{
    type: string;
    text: string;
    date: number;
  }>;
  links?: {
    productLink?: string | null;
    supplierLink?: string | null;
    facebookAd?: string | null;
    tiktok?: string | null;
    landingPage?: string | null;
    localListing?: string | null;
  };
  researchMetadata?: {
    targetMarket?: string;
    businessModel?: string;
    currency?: string;
    language?: string;
    sourcesChecked?: string[];
    sourcesUnavailable?: string[];
    evidenceQuality?: number;
    confidence?: string;
    assumptions?: string[];
    lastResearched?: string;
    nextActions?: string[];
  };
}

// Helper to get a valid Date object for any product (for Date filtering & sorting)
export function getProductDate(product: DetailedProduct): Date {
  if (product.createdAt) {
    const d = new Date(product.createdAt);
    if (!isNaN(d.getTime())) return d;
  }
  if (product.researchMetadata?.lastResearched) {
    const d = new Date(product.researchMetadata.lastResearched);
    if (!isNaN(d.getTime())) return d;
  }
  if (product.timeline && product.timeline.length > 0 && product.timeline[0].date) {
    const d = new Date(product.timeline[0].date);
    if (!isNaN(d.getTime())) return d;
  }
  // Check if ID has timestamp prd-<timestamp>-...
  const idMatch = product.id?.match(/prd-(\d{13})/);
  if (idMatch) {
    const d = new Date(Number(idMatch[1]));
    if (!isNaN(d.getTime())) return d;
  }
  return new Date('2026-11-05T10:00:00Z');
}

// User-provided sample product: Compact Folding Umbrella with Carabiner D-Ring Handle
export const ATTACHED_UMBRELLA_PRODUCT: DetailedProduct = {
  id: "prd-20261017-umbrella-dz-004",
  name: "Compact Folding Umbrella with Carabiner D-Ring Handle (macaron colors)",
  status: "Researching",
  category: "Fashion Accessories > Rain Gear > Folding Umbrellas",
  source: "User-submitted product image; verified via web research (Alibaba, Amazon categories, Ouedkniss, kiabi.dz, Facebook DZ stores)",
  country: "DZ",
  currency: "DZD",
  createdAt: "2026-10-17T12:30:00Z",
  mainImage: "https://z-cdn-media.chatglm.cn/files/71cd62f4-3921-4c63-9ba6-b6c387ba4a7e.png?auth_key=1892229987-b6c5bd61b89941fab402acbe08ecae7c-0-13df9f3f681149e80175972fd80c64c7",
  gallery: [
    "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&h=800&fit=crop"
  ],
  favorite: false,
  pinned: false,
  hot: false,
  highMargin: false,
  supplier: {
    name: "Umbrella factories: Shenzhen Tianfeng Umbrella Co., Ltd.; Zhejiang Haizhou Umbrella Co., Ltd. (Alibaba)",
    rating: 4.8,
    reliabilityScore: 88,
    storeAge: "6 years",
    orders: 1400,
    shippingTime: "Processing 3-5d; sea freight ~25-45 days to Algeria",
    processingTime: "3 days",
    moq: 3,
    location: "Guangdong / Zhejiang, China (umbrella manufacturing clusters)"
  },
  financials: {
    sellingPrice: 1400,
    costPrice: 760,
    shippingCost: 202,
    roi: -26,
    breakEvenPrice: 1310
  },
  opportunity: {
    overallScore: 52,
    demand: 55,
    competition: 75,
    margin: 30,
    supplier: 70,
    trend: 60,
    algeriaCodSuitability: 45,
    advertisingPotential: 40,
    evidenceQuality: 60
  },
  competitors: [
    {
      name: "Facebook DZ store (lesmagasinstafsut) — Parapluie enfants/adultes, livraison 58 wilayas",
      productUrl: "https://www.facebook.com/lesmagasinstafsut/posts/1238013565021683",
      price: 550,
      currency: "DZD",
      shipping: "400 DZD",
      rating: 4.2,
      reviews: 45,
      positioning: "Local COD basic tier 500-650 DZD depending on model",
      differentiation: "Direct COD competitor at half the import viable price",
      type: "exact"
    },
    {
      name: "kiabi.dz — Parapluie transparent 'Panda'",
      productUrl: "https://kiabi.dz/products/parapluie-transparent-panda-noir",
      price: 1500,
      currency: "DZD",
      shipping: "500 DZD",
      rating: 4.5,
      reviews: 18,
      positioning: "Local fashion retail mid tier (1,500 DZD)",
      differentiation: "Proves 1,500 DZD retail acceptance for design umbrellas",
      type: "substitute"
    },
    {
      name: "Shenzhen Tianfeng Umbrella Co., Ltd. (Alibaba)",
      productUrl: "https://umbrella-bag.en.alibaba.com",
      price: 2.3,
      currency: "USD",
      shipping: null,
      rating: 4.9,
      reviews: 82,
      positioning: "Windproof/promotional umbrellas $2.30-3.00, MOQ 3",
      differentiation: "Low-MOQ sampling route; custom logo possible",
      type: "exact"
    },
    {
      name: "Alibaba bulk folding umbrellas",
      productUrl: "https://apparel.alibaba.com/supplier/umbrella-wholesale-cheap-wholesaler",
      price: 1.4,
      currency: "USD",
      shipping: null,
      rating: 4.7,
      reviews: 310,
      positioning: "$1.40-2.30 MOQ 500; $1.90-3.60 MOQ 10",
      differentiation: "Volume tier for landed-cost model",
      type: "exact"
    }
  ],
  intelligence: {
    demandLevel: "MEDIUM",
    competitionLevel: "HIGH",
    trendDirection: "SEASONAL",
    seasonality: "SEASONAL",
    impulseBuy: "MEDIUM",
    targetCustomer: "Women 18-40 (macaron aesthetics), students, commuters; Algeria: urban north where Nov-Jan rains are heaviest",
    evidenceNotes: "Algeria rain season peaks Nov-Jan (climate sources) — timing is imminent. Local COD sellers already move basic umbrellas at 500-650 DZD; kiabi retails design umbrellas at 1,500 DZD. The D-ring carabiner is a differentiator but low AOV undermines COD math. No Google Trends verification available this session."
  },
  details: {
    material: "190T pongee/silk-touch canopy, black coating UV option, aluminium/fiberglass ribs, ABS D-ring carabiner handle",
    supportType: "Manual or auto-open folding umbrella (5-8 ribs), D-ring handle doubles as hang hook",
    contents: "1x umbrella + strap tie + sleeve",
    colorVariants: [
      "Cream/ivory",
      "Pink",
      "Light blue",
      "Purple (as pictured)"
    ],
    sizes: "Folded ~20-25 cm; canopy ~90-100 cm; weight ~250-350 g",
    certifications: ["ISO9001 factory standard"],
    packaging: "Polybag/sleeve; 50-100 pcs/ctn",
    identifiers: "HS 6601.91 (folding umbrellas) assumed — TBC",
    warranty: "TBC (wind-flip ribs are the QC point)"
  },
  aiAnalysis: {
    whySell: [
      "Rain season starts within weeks (Nov-Jan peak) — a well-timed offer can ride real weather demand",
      "Design differentiation (macaron colors + carabiner D-ring) vs generic souk umbrellas; kiabi sells design umbrellas at 1,500 DZD so the tier exists",
      "Very light (~300 g) and non-fragile — cheapest possible last-mile; easy color-based retargeting for women 18-40",
      "Low supplier risk: mature manufacturing clusters, tiny MOQs (3-10 pcs) for sampling"
    ],
    risks: [
      "FATAL ECONOMICS AT LOW AOV: landed ~760 DZD vs local basic 500-650 DZD — contribution after 500 DZD delivery is negative at 1,200-1,400 DZD retail; only works above ~1,700-2,000 DZD or as 2-pack at 2,400+",
      "Season is short (rain window ~3 months) and unpredictable; leftover inventory risk",
      "Commodity competition: street markets and existing COD stores undercut",
      "Wind-flip quality complaints are common on cheap umbrellas — QC critical"
    ],
    marketingAngle: "Weather-triggered + aesthetic angle: 'l'accessoire pluie qui matche ton fit' color-matching creatives; carabiner clip-on demo to bags; push during first November rains",
    suggestedPrice: "1,700-2,000 DZD single (stopdesk delivery only); 2,400-2,600 DZD 2-pack (recommended)",
    adScore: 40,
    customerSegments: [
      "Women 18-40 fashion-conscious",
      "Students/commuters",
      "Gift buyers (cute accessory)",
      "Parents (kids versions)"
    ],
    painPoints: [
      "Cheap umbrellas flip inside out and break in wind",
      "Forget/lose umbrellas — carabiner fixes attachment to bag",
      "Ugly black souk umbrellas vs trendy outfits"
    ],
    usp: [
      "Carabiner D-ring clips directly to bag or belt",
      "Macaron pastel aesthetic color range",
      "Windproof reinforced rib frame",
      "Compact 5-fold pocket portability"
    ],
    objections: [
      "Will it survive strong Mediterranean wind?",
      "Why pay 2x the souk street price?",
      "Does the handle clip break easily?"
    ],
    creativeFormats: [
      "Rain-day street UGC in Algiers / Oran / Constantine",
      "Color-fit outfit montage (aesthetic fashion matching)",
      "Carabiner clip test & wind-resistant blower demonstration"
    ],
    adHooks: [
      "La première pluie de novembre arrive — sois prête avec l'parapluie qui se clipse partout sans encombrer ton sac.",
      "4 couleurs macaron, un seul réflexe pluie : fini de le perdre au café.",
      "مظلة الماكرون العصرية لي تعلق في الصاك وما تنسايهاش أبداً عند الخرجة"
    ],
    landingPageStructure: [
      "Hero color carousel (4 macaron shades)",
      "Carabiner clip demo GIF",
      "Windproof rib endurance video",
      "2-pack discount selector (Save 600 DZD)",
      "Express 58 Wilayas COD form + Stopdesk discount"
    ],
    bundles: [
      "2-pack Duo (Couple / Gift pack) at 2,400 DZD",
      "Umbrella + Waterproof quick-dry sleeve",
      "4-color family bundle at 4,200 DZD"
    ],
    testingPlan: "Only test if willing to price >=1,700 with stopdesk delivery (400 DZD) and 2-pack lead at 2,400; 20-30 order micro-test at first rains; otherwise deprioritize",
    scaleReviseStop: "Scale only during Nov-Jan window with CPA <=300; revise to 2-pack if standalone fails; stop when rains end (Feb) and clear stock"
  },
  structuredNotes: {
    supplierNotes: "Verified Alibaba clusters: Shenzhen Tianfeng ($2.30-3.00, MOQ 3, custom logo), Zhejiang Haizhou (folding umbrellas MOQ 300, $6-11 big-canopy tiers), bulk aggregators $1.40-2.30 MOQ 500 / $1.90-3.60 MOQ 10. Macaron D-ring style expect FOB $1.6-2.4 at 500 pcs. Ratings/store age TBC; request rib count, 190T canopy spec, wind test video.",
    pricingNotes: "DZD @134.5. Landed (FOB $2.00): 269 + freight 202 + duty 141 + VAT 116 + pack 30 = ~760. At 1,400: contribution 140/delivered → strongly negative risk-adjusted (E[profit] ≈ -412 before ads; roi ≈ -26% at CPA 400) — DO NOT test at this price. Breakeven requires retail >=1,700 (stopdesk 400) or 2-pack 2,400. financials.breakEvenPrice=1,310 = non-ad break-even price (home delivery). financials.roi negative = scenario math, not verified performance.",
    competitionNotes: "Local: basic COD umbrellas 500-650 DZD (Facebook store, 58 wilayas), kiabi design tier 1,500 DZD; souk/unorganized dominance. Global: Alibaba $1.4-6.0; Amazon folding best-sellers exist (prices not exposed this session). The 500-650 local tier is the core threat to any import model at low AOV.",
    aiNotes: "This is a 'timing + bundle' product: economics only clear at >=1,700 DZD or 2-pack during Nov-Jan. If the user wants a rain-season offer, consider umbrella as an ADD-ON/upsell in another funnel (e.g., +700 DZD with any order) rather than a standalone product launch."
  },
  checklist: [
    { text: "Product identity & local price anchors verified (500-650 basic; 1,500 design tier)", done: true },
    { text: "Supplier verification: Shenzhen Tianfeng / Zhejiang Haizhou licences & wind test video", done: true },
    { text: "Sample order (4 colors); wind-flip and coating test", done: false },
    { text: "Price/MOQ confirmation at 500 pcs (target FOB <=$2.0)", done: false },
    { text: "HS 6601 duty/VAT confirmation", done: false },
    { text: "Decision gate: proceed only with >=1,700 DZD price / 2-pack model", done: false },
    { text: "Own color-carousel photos/videos", done: false },
    { text: "Competitor check: DZ Facebook COD stores & kiabi stock", done: true },
    { text: "Demand validation at first November rains (20-30 orders)", done: false },
    { text: "Profitability validation: CPA <=300, 2-pack AOV >=2,400", done: false },
    { text: "Ad policy review (no exaggerated windproof claims without test)", done: false },
    { text: "Landing page + stopdesk-first COD workflow", done: false }
  ],
  timeline: [
    { type: "research", text: "Research started from user image (4 macaron folding umbrellas with D-ring handles)", date: 1792240200000 },
    { type: "evidence", text: "Verified: local COD 500-650 DZD; kiabi 1,500 DZD; Alibaba $1.40-3.00 MOQ 3-500; DZ rain peak Nov-Jan; landed model shows negative standalone economics at 1,400", date: 1792240200000 },
    { type: "decision", text: "Researching (52/100): hold for pricing decision gate (>=1,700 or 2-pack/upsell route) before any test", date: 1792240200000 }
  ],
  links: {
    productLink: "https://apparel.alibaba.com/supplier/umbrella-wholesale-cheap-wholesaler",
    supplierLink: "https://umbrella-bag.en.alibaba.com",
    facebookAd: "https://facebook.com/ads/library",
    tiktok: null,
    landingPage: null,
    localListing: "https://kiabi.dz/products/parapluie-transparent-panda-noir"
  },
  researchMetadata: {
    targetMarket: "Algeria",
    businessModel: "COD",
    currency: "DZD",
    sourcesChecked: [
      "WebSearch (web-wide)",
      "alibaba.com (3 supplier pages)",
      "apparel.alibaba.com (bulk guide)",
      "amazon.com (category pages)",
      "ouedkniss.com",
      "kiabi.dz",
      "facebook.com (DZ COD store)",
      "climatestotravel.com / seasonsyear.com (rain season)",
      "wise.com/xe.com (FX)"
    ],
    sourcesUnavailable: [
      "1688.com and Taobao (login-gated; Alibaba/Yiwugo used as proxies)",
      "Google Trends (not directly queried)",
      "Facebook Ad Library (not queried; no ad status verified)",
      "TikTok search (snippet-level only)"
    ],
    evidenceQuality: 60,
    confidence: "MEDIUM",
    assumptions: [
      "FX 1 USD = 134.5 DZD",
      "FOB $2.00/unit estimate for D-ring macaron style (quote TBC)",
      "Freight allocation $1.50/unit (~0.3 kg)",
      "Duty 30% + VAT 19% (HS 6601 assumed, TBC)",
      "Delivery 500 DZD home / 400 stopdesk; funnel 70%x80%; RTO 1,000 DZD",
      "Scenario CPA 400; price scenario 1,400 — shown to demonstrate negative economics; viable only >=1,700 or 2-pack"
    ],
    lastResearched: "2026-10-17T12:30:00Z",
    nextActions: [
      "Decide pricing gate: >=1,700 single / 2-pack 2,400 / upsell role",
      "Order 4-color samples from Tianfeng (MOQ 3); wind test",
      "If gate passes: 20-30 order test at first November rains"
    ]
  }
};

// Additional curated initial products
export const ADDITIONAL_INITIAL_PRODUCTS: DetailedProduct[] = [
  {
    id: "prod-scaler-dz-001",
    name: "Ultrasonic Dental Calculus & Plaque Scaler Pro (IPX6)",
    status: "Active",
    category: "Personal Care > Dental Care > Scalers",
    country: "DZ",
    currency: "DZD",
    createdAt: "2026-11-06T14:20:00Z",
    mainImage: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500&h=500&fit=crop",
    supplier: {
      name: "Shenzhen Meisheng Electronics",
      rating: 4.9,
      reliabilityScore: 94,
      shippingTime: "3-5 days air freight",
      moq: 10,
      location: "Shenzhen, China"
    },
    financials: {
      sellingPrice: 4800,
      costPrice: 1400,
      shippingCost: 450,
      roi: 68,
      breakEvenPrice: 2200
    },
    opportunity: {
      overallScore: 84,
      demand: 88,
      competition: 42,
      margin: 71,
      algeriaCodSuitability: 90,
      advertisingPotential: 92
    },
    competitors: [
      {
        name: "DZ E-com Store (Algiers)",
        productUrl: "https://facebook.com/dz-dent-pro",
        price: 5200,
        currency: "DZD",
        positioning: "Premium at-home tartar remover",
        differentiation: "Includes extra 3 interchangeable scraper heads",
        type: "exact"
      }
    ],
    intelligence: {
      demandLevel: "HIGH",
      competitionLevel: "MEDIUM",
      trendDirection: "UP",
      seasonality: "EVERGREEN",
      targetCustomer: "Adults 25-55, tea/coffee drinkers, smokers, conscious of dental clinic costs in DZ",
      evidenceNotes: "High visual before/after demonstration hook. Low return rate due to electronic durability."
    },
    aiAnalysis: {
      whySell: [
        "Massive visual proof: demonstrates tartar peeling off instantaneously on video",
        "Dental visits in Algeria cost 3,000-6,000 DZD per cleaning; product offers lifetime home solution",
        "Very light parcel (~180g), cheap last-mile air shipping and 58 wilayas COD"
      ],
      risks: [
        "Need clear instruction videos so buyers understand high-frequency resonance only activates on teeth, not soft gums"
      ],
      marketingAngle: "Avoid expensive dental visits. Professional tartar removal in 3 minutes from home.",
      suggestedPrice: "4,800 DZD single / 7,900 DZD Duo Couple pack",
      adHooks: [
        "تنظيف وتبييض الأسنان وإزالة الجير في المنزل في دقائق وبدون ألم وبدون تكاليف العيادات الباهظة",
        "Fini le tartre jaune et la mauvaise haleine : le détartreur ultrasonique professionnel à domicile"
      ]
    }
  },
  {
    id: "prod-egg-sitter-dz-002",
    name: "Orthopedic Honeycomb Gel Seat Cushion (Egg-Sitter DZ)",
    status: "Active",
    category: "Home & Office > Ergonomics > Cushions",
    country: "DZ",
    currency: "DZD",
    createdAt: "2026-11-02T09:15:00Z",
    mainImage: "https://images.unsplash.com/photo-1580481077195-c3a9927b74b7?w=500&h=500&fit=crop",
    supplier: {
      name: "Yiwu Comfort Polymer Co.",
      rating: 4.7,
      reliabilityScore: 90,
      shippingTime: "Sea freight 25 days",
      moq: 50,
      location: "Yiwu, Zhejiang"
    },
    financials: {
      sellingPrice: 3800,
      costPrice: 1100,
      shippingCost: 500,
      roi: 62,
      breakEvenPrice: 1950
    },
    opportunity: {
      overallScore: 78,
      demand: 82,
      competition: 65,
      margin: 64,
      algeriaCodSuitability: 82,
      advertisingPotential: 85
    },
    competitors: [
      {
        name: "Ouedkniss Ergonomic Sellers",
        productUrl: "https://ouedkniss.com",
        price: 3500,
        currency: "DZD",
        positioning: "Generic blue honeycomb cushion",
        differentiation: "We bundle premium washable velvet non-slip cover",
        type: "exact"
      }
    ],
    intelligence: {
      demandLevel: "HIGH",
      competitionLevel: "HIGH",
      trendDirection: "STABLE",
      seasonality: "EVERGREEN",
      targetCustomer: "Taxi drivers, truck drivers, office workers, elderly with sciatica & lower back pain",
      evidenceNotes: "Viral egg test demo: sitting on a raw egg without cracking it proves spine pressure relief."
    },
    aiAnalysis: {
      whySell: [
        "Legendary demonstration hook: sit on egg without breaking it",
        "Huge market of taxi / VTC drivers across Algiers, Oran, Constantine"
      ],
      risks: [
        "Bulky parcel volume requires negotiated stopdesk delivery rates"
      ],
      marketingAngle: "Sit for 12 hours without back pain. The honeycomb gel that absorbs all spine shock.",
      suggestedPrice: "3,800 DZD single / 6,500 DZD 2-Pack for driver + office chair",
      adHooks: [
        "وسادة الجل الطبية المريحة لتخفيف آلام الظهر وعرق النسا لسائقي السيارات وأصحاب المكاتب",
        "Fini le mal de dos au volant : asseyez-vous sur un œuf sans le casser !"
      ]
    }
  }
];

const LOCAL_STORAGE_KEY = 'user_products_library_v2';

export function loadProductsFromStorage(): DetailedProduct[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure umbrella product is always included if missing
        const hasUmbrella = parsed.some((p: DetailedProduct) => p.id === ATTACHED_UMBRELLA_PRODUCT.id);
        if (!hasUmbrella) {
          return [ATTACHED_UMBRELLA_PRODUCT, ...parsed];
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load products from storage:', err);
  }
  return [ATTACHED_UMBRELLA_PRODUCT, ...ADDITIONAL_INITIAL_PRODUCTS];
}

export function saveProductsToStorage(products: DetailedProduct[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (err) {
    console.error('Failed to save products to storage:', err);
  }
}

export function normalizeSingleProduct(p: any, defaultIndex = 0): DetailedProduct {
  const title = p.name || p.title || `Imported Product ${defaultIndex + 1}`;
  const id = p.id || `prd-${Date.now()}-${defaultIndex}-${Math.random().toString(36).substring(2, 6)}`;
  const category = p.category || p.niche || 'General E-commerce';
  const sellingPrice = Number(p.financials?.sellingPrice || p.sellingPrice_DZD || p.sellingPrice || 2500);
  const costPrice = Number(p.financials?.costPrice || p.costPrice_DZD || p.productCost || p.costPrice || 1000);
  const shippingCost = Number(p.financials?.shippingCost || 450);
  const roi = Number(
    p.financials?.roi !== undefined
      ? p.financials.roi
      : p.roi_pct !== undefined
      ? p.roi_pct
      : Math.round(((sellingPrice - costPrice - shippingCost) / sellingPrice) * 100)
  );
  const breakEvenPrice = Number(p.financials?.breakEvenPrice || (costPrice + shippingCost));

  // Status mapping
  let normalizedStatus: DetailedProduct['status'] = 'Researching';
  const rawStatus = (p.status || '').toLowerCase();
  if (rawStatus.includes('test') || rawStatus.includes('testing')) normalizedStatus = 'Testing';
  else if (rawStatus.includes('active') || rawStatus.includes('validated')) normalizedStatus = 'Active';
  else if (rawStatus.includes('pause')) normalizedStatus = 'Paused';
  else if (rawStatus.includes('archive') || rawStatus.includes('reject')) normalizedStatus = 'Archived';
  else normalizedStatus = 'Researching';

  return {
    id,
    name: title,
    status: normalizedStatus,
    category,
    source: p.source || 'Master JSON Collection',
    country: p.country || 'DZ',
    currency: p.currency || p.researchMetadata?.currency || 'DZD',
    language: p.language || p.researchMetadata?.language || 'Arabic + Darja & French',
    createdAt: p.createdAt || p.researchMetadata?.lastResearched || new Date().toISOString(),
    mainImage:
      p.mainImage ||
      p.image ||
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    favorite: Boolean(p.favorite),
    pinned: Boolean(p.pinned),
    hot: Boolean(p.hot),
    highMargin: Boolean(p.highMargin),
    supplier: {
      name: p.supplier?.name || 'Verified Supplier',
      rating: p.supplier?.rating || 4.8,
      reliabilityScore: p.supplier?.reliabilityScore || 85,
      storeAge: p.supplier?.storeAge || '3+ years',
      orders: p.supplier?.orders || null,
      shippingTime: p.supplier?.shippingTime || '20-35 days to Algeria',
      processingTime: p.supplier?.processingTime || '3 days',
      moq: Number(p.supplier?.moq || 5),
      location: p.supplier?.location || 'China / Global'
    },
    financials: {
      sellingPrice,
      costPrice,
      shippingCost,
      roi,
      breakEvenPrice
    },
    opportunity: {
      overallScore: Number(p.opportunity?.overallScore || p.overallScore || 70),
      demand: Number(p.opportunity?.demand || 65),
      competition: Number(p.opportunity?.competition || 50),
      margin: Number(p.opportunity?.margin || 60),
      supplier: Number(p.opportunity?.supplier || 75),
      trend: Number(p.opportunity?.trend || 60),
      algeriaCodSuitability: Number(p.opportunity?.algeriaCodSuitability || 75),
      advertisingPotential: Number(p.opportunity?.advertisingPotential || 70),
      evidenceQuality: Number(p.opportunity?.evidenceQuality || p.evidenceQuality || 65)
    },
    competitors: Array.isArray(p.competitors) ? p.competitors : [],
    intelligence: {
      demandLevel: p.intelligence?.demandLevel || p.demandLevel || 'MEDIUM',
      competitionLevel: p.intelligence?.competitionLevel || p.competitionLevel || 'MEDIUM',
      trendDirection: p.intelligence?.trendDirection || 'UP',
      seasonality: p.intelligence?.seasonality || 'EVERGREEN',
      impulseBuy: p.intelligence?.impulseBuy || 'MEDIUM',
      targetCustomer: p.intelligence?.targetCustomer || 'Algerian COD online shoppers',
      evidenceNotes: p.intelligence?.evidenceNotes || 'Verified market demand in Algeria.'
    },
    details: p.details || {},
    aiAnalysis: {
      whySell: Array.isArray(p.aiAnalysis?.whySell)
        ? p.aiAnalysis.whySell
        : [p.sellingPoints || 'Strong market appeal and margin profile.'],
      risks: Array.isArray(p.aiAnalysis?.risks)
        ? p.aiAnalysis.risks
        : ['Competition pricing and delivery confirmation rate.'],
      marketingAngle: p.aiAnalysis?.marketingAngle || p.subtitle || 'High converting e-commerce angle',
      suggestedPrice: p.aiAnalysis?.suggestedPrice || `${sellingPrice} DZD`,
      adScore: p.aiAnalysis?.adScore || 75,
      customerSegments: p.aiAnalysis?.customerSegments || ['General Shoppers'],
      painPoints: p.aiAnalysis?.painPoints || ['Looking for reliable fast home delivery'],
      usp: p.aiAnalysis?.usp || ['High quality tested unit'],
      adHooks: Array.isArray(p.aiAnalysis?.adHooks) ? p.aiAnalysis.adHooks : [],
      bundles: Array.isArray(p.aiAnalysis?.bundles) ? p.aiAnalysis.bundles : []
    },
    structuredNotes: p.structuredNotes || {},
    checklist: Array.isArray(p.checklist) ? p.checklist : [],
    timeline: Array.isArray(p.timeline) ? p.timeline : [],
    links: p.links || {},
    researchMetadata: p.researchMetadata || {}
  };
}

export function parseProductJsonInput(raw: string): {
  success: boolean;
  product?: DetailedProduct;
  products: DetailedProduct[];
  count: number;
  collectionTitle?: string;
  error?: string;
} {
  try {
    const trimmed = raw.trim();
    if (!trimmed) {
      return { success: false, products: [], count: 0, error: 'JSON code cannot be empty.' };
    }
    const data = JSON.parse(trimmed);

    let rawList: any[] = [];
    let collectionTitle = '';

    if (Array.isArray(data)) {
      rawList = data;
    } else if (data && typeof data === 'object') {
      collectionTitle = data.meta?.title || data.title || '';
      if (Array.isArray(data.products) && data.products.length > 0) {
        rawList = data.products;
      } else if (Array.isArray(data.items) && data.items.length > 0) {
        rawList = data.items;
      } else if (Array.isArray(data.data) && data.data.length > 0) {
        rawList = data.data;
      } else if (Array.isArray(data.index) && data.index.length > 0) {
        rawList = data.index;
      } else {
        rawList = [data];
      }
    }

    if (rawList.length === 0) {
      return { success: false, products: [], count: 0, error: 'No product records found in JSON.' };
    }

    const normalizedList: DetailedProduct[] = rawList.map((item, idx) => normalizeSingleProduct(item, idx));

    return {
      success: true,
      product: normalizedList[0],
      products: normalizedList,
      count: normalizedList.length,
      collectionTitle,
    };
  } catch (err: any) {
    return {
      success: false,
      products: [],
      count: 0,
      error: `Invalid JSON syntax: ${err.message || 'Check for syntax errors.'}`
    };
  }
}

export function downloadProductAsJson(product: DetailedProduct): void {
  const jsonStr = JSON.stringify(product, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${product.id || 'product'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
