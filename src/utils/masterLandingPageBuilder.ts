/**
 * MASTER UNIVERSAL AI HIGH-CONVERTING PRODUCT LANDING PAGE BUILDER
 * 
 * Inspired by the "Updated" reference design from Image 3 (ecomheist.store):
 * - Organic curved backdrop wave banner
 * - Bestseller pill badge
 * - Large crisp product visual
 * - Vertical side feature pills with custom icons (e.g. Vegan, Protein, Low carb / Titanium, 12k VPM, IPX6)
 * - Overlapping customer avatar social proof + 4.8 / 5 star rating
 * - Clean bold product title + Variant/Serving pill badge
 * - Strike-through original price + Active price + Save % badge
 * - 2x2 soft tinted benefit cards with icons
 * - Live pulsing green in-stock indicator
 * - Full-width high-converting prominent CTA button with dynamic price tag
 * - Trust guarantee badge
 * - RTO-Protected 58 Wilayas Algerian COD checkout or DTC Cart
 * - Before & After transformation proof
 * - 3-step How It Works
 * - Customer reviews & FAQ accordion
 * - Mobile sticky bottom purchase bar
 */

import type { ProductInputData, LandingPageConfig, LandingPageStrategy, ProductAnalysis } from '../types/landingPage.ts';

export interface MasterLandingPageOptions {
  product: ProductInputData;
  config?: Partial<LandingPageConfig>;
  strategy?: Partial<LandingPageStrategy>;
  analysis?: Partial<ProductAnalysis>;
  linkedSkillIntelligence?: string;
}

// Category-aware color palettes inspired by Image 3
export function getPaletteForCategory(category: string, name: string): {
  primary: string;
  primaryDark: string;
  accent: string;
  waveColor: string;
  badgeBg: string;
  cardBg: string;
  cardBorder: string;
  bgLight: string;
  textDark: string;
  announcementBg: string;
} {
  const text = `${category} ${name}`.toLowerCase();

  // 1. Fitness, Protein, Nutrition, Coffee, Food (Image 3 exact theme: Mocha & Warm Terracotta)
  if (
    text.includes('protein') ||
    text.includes('coffee') ||
    text.includes('vegan') ||
    text.includes('nutrition') ||
    text.includes('fiber') ||
    text.includes('food') ||
    text.includes('supplement') ||
    text.includes('vittal')
  ) {
    return {
      primary: '#3d1f08', // Dark rich chocolate / espresso
      primaryDark: '#291404',
      accent: '#c05621', // Terracotta orange
      waveColor: '#a85018', // Warm curved wave
      badgeBg: '#3d1f08',
      cardBg: '#faf3ec', // Soft light cream beige
      cardBorder: '#eddcd0',
      bgLight: '#fcf9f6',
      textDark: '#261205',
      announcementBg: '#3d1f08',
    };
  }

  // 2. Dental, Oral Hygiene, Medical, Healthcare
  if (
    text.includes('dental') ||
    text.includes('scaler') ||
    text.includes('teeth') ||
    text.includes('oral') ||
    text.includes('medical') ||
    text.includes('clinic') ||
    text.includes('tartar') ||
    text.includes('sonic')
  ) {
    return {
      primary: '#0369a1', // Deep medical cyan / navy
      primaryDark: '#0c4a6e',
      accent: '#0284c7',
      waveColor: '#0284c7',
      badgeBg: '#0369a1',
      cardBg: '#f0f9ff',
      cardBorder: '#bae6fd',
      bgLight: '#f8fafc',
      textDark: '#0f172a',
      announcementBg: '#082f49',
    };
  }

  // 3. Ergonomics, Cushions, Spine, Back Pain
  if (
    text.includes('cushion') ||
    text.includes('gel') ||
    text.includes('seat') ||
    text.includes('spine') ||
    text.includes('back') ||
    text.includes('sciatica') ||
    text.includes('chair')
  ) {
    return {
      primary: '#1e3a8a', // Ergonomic royal blue
      primaryDark: '#172554',
      accent: '#2563eb',
      waveColor: '#3b82f6',
      badgeBg: '#1e3a8a',
      cardBg: '#eff6ff',
      cardBorder: '#bfdbfe',
      bgLight: '#f8fafc',
      textDark: '#0f172a',
      announcementBg: '#1e293b',
    };
  }

  // 4. Seasonal, Umbrella, Rain, Fashion, Commute
  if (
    text.includes('umbrella') ||
    text.includes('rain') ||
    text.includes('carabiner') ||
    text.includes('macaron') ||
    text.includes('windproof')
  ) {
    return {
      primary: '#581c87', // Macaron rich plum
      primaryDark: '#3b0764',
      accent: '#db2777', // Soft berry
      waveColor: '#7e22ce',
      badgeBg: '#581c87',
      cardBg: '#faf5ff',
      cardBorder: '#f3e8ff',
      bgLight: '#fdfbfe',
      textDark: '#1e1b4b',
      announcementBg: '#3b0764',
    };
  }

  // 5. Beauty, Skincare, Cosmetics, Glow
  if (
    text.includes('serum') ||
    text.includes('skin') ||
    text.includes('vitamin c') ||
    text.includes('beauty') ||
    text.includes('glow') ||
    text.includes('cream')
  ) {
    return {
      primary: '#881337', // Rose wine
      primaryDark: '#4c0519',
      accent: '#ea580c', // Sunset glow
      waveColor: '#be123c',
      badgeBg: '#881337',
      cardBg: '#fff1f2',
      cardBorder: '#fecdd3',
      bgLight: '#fffbfa',
      textDark: '#2a0b12',
      announcementBg: '#4c0519',
    };
  }

  // 6. Default / Tech / Electronics / Tools
  return {
    primary: '#0f172a', // Deep obsidian
    primaryDark: '#020617',
    accent: '#2563eb', // Electric blue
    waveColor: '#1e293b',
    badgeBg: '#0f172a',
    cardBg: '#f8fafc',
    cardBorder: '#e2e8f0',
    bgLight: '#ffffff',
    textDark: '#090d16',
    announcementBg: '#0f172a',
  };
}

// Helper: category-derived side vertical badges (Image 3 reference: 3 side badges)
export function getVerticalSideBadges(category: string, name: string, isArabic: boolean): { iconSvg: string; label: string }[] {
  const text = `${category} ${name}`.toLowerCase();

  if (text.includes('protein') || text.includes('vittal') || text.includes('vegan') || text.includes('coffee') || text.includes('nutrition')) {
    return [
      {
        iconSvg: `<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>`,
        label: isArabic ? 'نباتي 100%' : 'Vegan',
      },
      {
        iconSvg: `<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>`,
        label: isArabic ? 'بروتين نقي' : 'Protein',
      },
      {
        iconSvg: `<path d="M11 2v4"/><path d="m15.5 4.5-2.5 2.5"/><path d="M18 10h-4"/><path d="m15.5 15.5-2.5-2.5"/><path d="M11 22v-4"/><path d="m6.5 19.5 2.5-2.5"/><path d="M2 14h4"/><path d="m6.5 8.5 2.5 2.5"/>`,
        label: isArabic ? 'قليل الكربوهيدرات' : 'Low carb',
      },
    ];
  }

  if (text.includes('dental') || text.includes('scaler') || text.includes('teeth')) {
    return [
      {
        iconSvg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>`,
        label: isArabic ? 'تيتانيوم طبي' : 'Titanium',
      },
      {
        iconSvg: `<path d="M2 12h2"/><path d="M6 8h2"/><path d="M10 4h2"/><path d="M14 8h2"/><path d="M18 12h2"/><path d="M10 20h2"/><path d="M14 16h2"/>`,
        label: isArabic ? '12,000 ذبذبة' : '12k VPM',
      },
      {
        iconSvg: `<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
        label: isArabic ? 'مقاوم للماء' : 'IPX6 Proof',
      },
    ];
  }

  if (text.includes('cushion') || text.includes('gel') || text.includes('seat')) {
    return [
      {
        iconSvg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
        label: isArabic ? 'حماية الفقرات' : 'Spine Care',
      },
      {
        iconSvg: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>`,
        label: isArabic ? 'خلية النحل' : 'Gel Matrix',
      },
      {
        iconSvg: `<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>`,
        label: isArabic ? 'تهوية دائمة' : 'Cool Flow',
      },
    ];
  }

  // Default badges
  return [
    {
      iconSvg: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
      label: isArabic ? 'جودة أصلية' : 'Top Quality',
    },
    {
      iconSvg: `<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>`,
      label: isArabic ? 'فعالية فورية' : 'Fast Acting',
    },
    {
      iconSvg: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>`,
      label: isArabic ? 'ضمان شامل' : 'Certified',
    },
  ];
}

// Generate the complete high-converting HTML landing page
export function buildMasterStoreLandingPageHtml(options: MasterLandingPageOptions): string {
  const { product, config, strategy, linkedSkillIntelligence } = options;

  const targetLang = (product.language || 'English').toLowerCase();
  const isArabic = targetLang.includes('arab') || targetLang.includes('darja');
  const isFrench = targetLang.includes('french');
  const dir = isArabic ? 'rtl' : 'ltr';
  const lang = isArabic ? 'ar' : isFrench ? 'fr' : 'en';

  const palette = getPaletteForCategory(product.category || '', product.name || '');
  const sideBadges = getVerticalSideBadges(product.category || '', product.name || '', isArabic);

  const title = product.name || (isArabic ? 'منتج ابتكاري فاخر' : 'Premium Innovation Product');
  const brandName = title.split(' ')[0] || (isArabic ? 'نوفا' : 'Vittal');
  const price = product.price || (product.country === 'Algeria' ? '4,800 DZD' : '$39');
  const origPrice = product.originalPrice || (product.country === 'Algeria' ? '8,500 DZD' : '$49');

  const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || (product.country === 'Algeria' ? 4800 : 39);
  const numericOrigPrice = parseInt(origPrice.replace(/[^0-9]/g, '')) || (product.country === 'Algeria' ? 8500 : 49);
  const discountPercent = Math.max(15, Math.round(((numericOrigPrice - numericPrice) / numericOrigPrice) * 100)) || 20;

  // Extract or fallback images safely
  let mainImg = product.images?.find((i) => i.isMain)?.url || product.images?.[0]?.url;
  if (!mainImg || mainImg.includes('Algeria_COD_Product_Intelligence_Workflow')) {
    if (title.toLowerCase().includes('protein') || title.toLowerCase().includes('vittal') || title.toLowerCase().includes('coffee')) {
      mainImg = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80';
    } else if (title.toLowerCase().includes('umbrella') || title.toLowerCase().includes('مظلة')) {
      mainImg = 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=700&h=600&fit=crop';
    } else if (title.toLowerCase().includes('scaler') || title.toLowerCase().includes('dental')) {
      mainImg = '/assets/aistudio/dental_scaler_pro.png';
    } else if (title.toLowerCase().includes('cushion') || title.toLowerCase().includes('egg')) {
      mainImg = 'https://images.unsplash.com/photo-1580481077195-c3a9927b74b7?w=600&h=450&fit=crop';
    } else if (title.toLowerCase().includes('camera') || title.toLowerCase().includes('كاميرا')) {
      mainImg = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&h=450&fit=crop';
    } else {
      mainImg = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&h=600&fit=crop';
    }
  }

  // 4 Key Benefits matching Image 3 2x2 grid (Universal extraction)
  let defaultBenefits: string[] = [];
  if (options.analysis?.mainBenefits && options.analysis.mainBenefits.length >= 4) {
    defaultBenefits = options.analysis.mainBenefits.slice(0, 4);
  } else if (product.mainBenefits && product.mainBenefits.length >= 4) {
    defaultBenefits = product.mainBenefits.slice(0, 4);
  } else if (product.productFeatures && product.productFeatures.length >= 4) {
    defaultBenefits = product.productFeatures.slice(0, 4);
  } else if (product.mainBenefits && product.mainBenefits.length > 0) {
    defaultBenefits = [...product.mainBenefits];
    if (product.productFeatures) {
      for (const f of product.productFeatures) {
        if (defaultBenefits.length < 4 && !defaultBenefits.includes(f)) defaultBenefits.push(f);
      }
    }
  }

  if (defaultBenefits.length < 4) {
    if (title.toLowerCase().includes('protein') || title.toLowerCase().includes('vittal')) {
      defaultBenefits = [
        isArabic ? 'فيتامينات وحديد أساسية' : 'Iron & B Vitamins',
        isArabic ? 'دعم وتقوية العظام' : 'Bone support',
        isArabic ? 'بناء ونمو العضلات' : 'Supports muscle growth',
        isArabic ? 'جودة نباتية فائقة' : 'Top quality',
      ];
    } else if (title.toLowerCase().includes('umbrella') || title.toLowerCase().includes('مظلة')) {
      defaultBenefits = [
        isArabic ? 'مقاومة فائقة للرياح بـ 10 أضلاع' : 'Windproof 10-Rib Frame',
        isArabic ? 'مقبض حلقة تسلق D-Ring الذكي' : 'Smart Carabiner D-Ring Handle',
        isArabic ? 'قماش طارد للماء عالي الكثافة' : 'Waterproof High-Density Fabric',
        isArabic ? 'طي عكسي ذكي يمنع البلل' : 'Reverse Folding Dry Tech',
      ];
    } else if (title.toLowerCase().includes('scaler') || title.toLowerCase().includes('dental')) {
      defaultBenefits = [
        isArabic ? 'إزالة الجير والبقع في 5 دقائق' : 'Tartar & stain removal in 5 mins',
        isArabic ? 'مستشعر ذكي لحماية اللثة' : 'Smart gum protection sensor',
        isArabic ? 'توفير تكاليف العيادات الباهظة' : 'Saves costly clinical visits',
        isArabic ? 'بطارية تدوم 30 يوماً بشحنة واحدة' : '30-Day long-lasting battery',
      ];
    } else {
      defaultBenefits = [
        isArabic ? `أعلى جودة وتصميم أصلي لـ ${title.slice(0, 15)}` : 'Certified Original Build',
        isArabic ? 'سهولة الاستخدام وكفاءة فورية' : 'Instant Peak Performance',
        isArabic ? 'توفير الوقت والمال مع ضمان الرضا' : 'Time & Money Savings',
        isArabic ? 'فحص الطرد قبل الدفع مع توصيل سريع' : 'Inspection Before Payment',
      ];
    }
  }

  const benefitIcons = [
    `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
    `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    `<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>`,
    `<path d="M6 3h12l4 6-10 13L2 9z"/>`,
  ];

  // Delivery & Stock Date calculation (e.g. today + 3 days)
  const deliveryDateObj = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const deliveryDateString = deliveryDateObj.toLocaleDateString(isArabic ? 'ar-DZ' : isFrench ? 'fr-FR' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });

  const isAlgeriaCod = config?.targetMarket?.isAlgeriaCod ?? (product.country === 'Algeria' || product.currency === 'DZD' || price.includes('DZD'));

  const isSectionEnabled = (id: string): boolean => {
    if (!config?.sections || !Array.isArray(config.sections)) return true;
    const sec = config.sections.find((s) => s.id === id);
    return sec ? sec.enabled !== false : true;
  };

  const displayHeadline = strategy?.heroHeadline || title;
  const displaySubheadline = strategy?.supportingHeadline || (product.description ? product.description.slice(0, 160) + '...' : (isArabic ? 'تركيبة أصلية معتمدة تمنحك أقصى درجات الفعالية والراحة من أول يوم استعمال.' : 'Pure, high-potency formula engineered for daily vitality, superior absorption, and visible results.'));
  const announcementText = strategy?.announcementText || (isArabic ? '🚚 التوصيل متاح لـ 58 ولاية والدفع بعد معاينة وفحص الطرد ✨' : 'Free shipping on orders over $45 ✨');

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — ${isArabic ? 'المتجر الرسمي والطلب المباشر' : 'Official Store & Express Checkout'}</title>
  
  <!-- CDN Tailwind CSS Engine -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Google Typography: Plus Jakarta Sans for English/French, Cairo for Arabic -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --primary: ${palette.primary};
      --primary-dark: ${palette.primaryDark};
      --accent: ${palette.accent};
      --wave-color: ${palette.waveColor};
      --card-bg: ${palette.cardBg};
      --card-border: ${palette.cardBorder};
      --bg-light: ${palette.bgLight};
      --text-dark: ${palette.textDark};
    }
    
    body {
      font-family: ${isArabic ? "'Cairo', sans-serif" : "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"};
      background-color: var(--bg-light);
      color: var(--text-dark);
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    /* Pulse CTA animation */
    @keyframes subtlePulse {
      0%, 100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25); }
      50% { transform: scale(1.015); box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.35); }
    }
    .cta-pulse {
      animation: subtlePulse 2.4s ease-in-out infinite;
    }

    /* Wave Curve Backdrop inspired by Image 3 Updated */
    .hero-wave-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 120px;
      background: var(--wave-color);
      border-radius: 0 0 38% 38% / 0 0 45px 45px;
      z-index: 0;
    }

    /* Custom scrollbar for preview */
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
  </style>
</head>
<body class="min-h-screen pb-24 antialiased selection:bg-amber-100">

  ${isSectionEnabled('announcement_bar') ? `
  <!-- =============================================================
       SECTION 01: ANNOUNCEMENT BAR (Inspired by Image 3 Updated)
       ============================================================= -->
  <div class="py-2.5 px-4 text-center text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 text-white shadow-xs" style="background-color: ${palette.announcementBg};">
    <span>${announcementText}</span>
  </div>
  ` : ''}

  ${isSectionEnabled('navbar') ? `
  <!-- =============================================================
       SECTION 02: CLEAN STORE HEADER (Hamburger + Centered Logo + Cart)
       ============================================================= -->
  <header class="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-4 h-14 flex items-center justify-between">
    <!-- Hamburger Menu Icon -->
    <button type="button" aria-label="Menu" class="p-2 -ml-2 text-slate-800 hover:text-black">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>

    <!-- Centered Brand Logo (Image 3 exact typography) -->
    <a href="#order-target" class="text-xl sm:text-2xl font-black tracking-tight" style="color: var(--primary);">
      ${brandName}
    </a>

    <!-- Shopping Cart Icon with Badge -->
    <a href="#order-target" class="p-2 -mr-2 text-slate-800 relative hover:text-black">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>
      <span class="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style="background-color: var(--accent);">
        1
      </span>
    </a>
  </header>
  ` : ''}

  <!-- =============================================================
       SECTION 03: PRODUCT CARD SHOWCASE (MATCHING IMAGE 3 "UPDATED")
       ============================================================= -->
  <main class="max-w-md mx-auto px-4 pt-4 pb-8 space-y-5">

    <!-- Hero Card Container with Organic Wave Backdrop & Side Badges -->
    <div class="relative bg-white rounded-3xl p-4 shadow-sm border border-slate-100 overflow-hidden">
      
      <!-- Top Organic Wave (Image 3 signature element) -->
      <div class="hero-wave-backdrop"></div>

      <!-- Floating "Bestseller" pill badge -->
      <div class="relative z-10 flex items-center justify-between mb-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs" style="background-color: var(--badgeBg);">
          ${isArabic ? 'الأكثر طلباً ⭐' : 'Bestseller'}
        </span>
        ${isArabic ? `
          <span class="text-[11px] font-bold text-white/90 drop-shadow-xs">
            أصلي 100%
          </span>
        ` : ''}
      </div>

      <!-- Product Visual Area + Right Side Vertical Badges (Image 3 layout) -->
      <div class="relative z-10 grid grid-cols-12 gap-2 items-center min-h-[260px] pt-2">
        
        <!-- Main Product Image (Centered & Sharp) -->
        <div class="col-span-9 flex items-center justify-center p-2">
          <img
            src="${mainImg}"
            alt="${title}"
            class="max-h-[240px] w-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
            loading="eager"
          />
        </div>

        <!-- Right Side Vertical Feature Pills (3 Rounded Square Badges matching Image 3) -->
        <div class="col-span-3 flex flex-col items-center justify-center gap-2.5">
          ${sideBadges.map((badge) => `
            <div class="flex flex-col items-center text-center group">
              <div class="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110" style="background-color: var(--cardBg); border: 1px solid var(--cardBorder); color: var(--primary);">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  ${badge.iconSvg}
                </svg>
              </div>
              <span class="text-[10px] font-bold text-slate-700 mt-1 leading-tight tracking-tight">
                ${badge.label}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Rating & Social Proof Row (Stacked Avatars + Stars) -->
    <div class="flex items-center gap-3">
      <!-- Stacked customer avatars -->
      <div class="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
        <img class="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Customer avatar" />
        <img class="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Customer avatar" />
        <img class="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Customer avatar" />
      </div>
      <!-- Rating Text -->
      <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <span class="text-amber-500 font-black">★★★★★</span>
        <span>${isArabic ? 'تقييم 4.8 / 5.0 • 365 تقييم موثق' : "Rated 4.8 / 5.0 • 365 Reviews"}</span>
      </div>
    </div>

    <!-- Product Title & Variant Badge -->
    <div class="space-y-1">
      <div class="flex items-baseline justify-between gap-2">
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
          ${displayHeadline}
        </h1>
        <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200">
          ${isArabic ? 'النسخة الأصلية' : '100% Certified'}
        </span>
      </div>
      <p class="text-xs text-slate-600 leading-relaxed">
        ${displaySubheadline}
      </p>
    </div>

    <!-- 4 Checkmark Feature Pills (Image 3 & 4 style) -->
    <div class="grid grid-cols-2 gap-2 pt-0.5">
      ${defaultBenefits.map((b) => `
        <div class="py-1.5 px-3 rounded-full flex items-center gap-2 bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 text-xs font-bold shadow-2xs">
          <span class="text-emerald-600 font-black">✓</span>
          <span class="truncate">${b}</span>
        </div>
      `).join('')}
    </div>

    <!-- =============================================================
         TIERED SUPPLY / QUANTITY BUNDLE SELECTOR (Image.png Benchmark)
         ============================================================= -->
    <div class="pt-2 space-y-2.5">
      <div class="flex items-center justify-between">
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-900">
          ${isArabic ? 'اختر باقة التوفير:' : 'Select Your Supply:'}
        </h3>
        <span class="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
          ${isArabic ? 'خصم محدود حتى 45%' : 'Spring Offer — Up to 45% Off'}
        </span>
      </div>

      <!-- 3 Tiered Supply Cards -->
      <div class="space-y-2">
        <!-- Tier 1: Buy 1 (1 Month Supply) -->
        <div
          id="bundle-card-1"
          onclick="selectSupplyBundle(1)"
          class="bundle-card p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer relative flex items-center justify-between gap-3 shadow-2xs"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="bundle-radio w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0">
              <div class="bundle-dot w-2.5 h-2.5 rounded-full bg-transparent"></div>
            </div>
            <img src="${mainImg}" alt="1 Unit" class="w-10 h-10 object-contain rounded-lg bg-slate-50 p-0.5 shrink-0" />
            <div class="min-w-0">
              <span class="font-extrabold text-xs text-slate-900 block truncate">
                ${isArabic ? 'باقة قطعة واحدة' : 'Buy 1 (1 Month Supply)'}
              </span>
              <span class="text-[10.5px] text-slate-500 block">
                ${isArabic ? 'استعمال شخصي 30 يوماً' : '30 Day Supply • Daily Routine'}
              </span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[11px] line-through text-slate-400 block font-mono">${origPrice}</span>
            <span class="text-sm font-black font-mono text-slate-900">${price}</span>
          </div>
        </div>

        <!-- Tier 2: Buy 2 Get 1 FREE (3 Month Supply) - MOST POPULAR -->
        <div
          id="bundle-card-2"
          onclick="selectSupplyBundle(2)"
          class="bundle-card p-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50/20 transition-all cursor-pointer relative flex items-center justify-between gap-3 shadow-xs ring-1 ring-emerald-500/30"
        >
          <!-- Ribbon Badge -->
          <div class="absolute -top-2.5 ${isArabic ? 'left-3' : 'right-3'} flex items-center gap-1.5">
            <span class="text-[9.5px] font-black uppercase text-white px-2 py-0.5 rounded-full shadow-xs" style="background-color: var(--primary);">
              MOST POPULAR
            </span>
            <span class="text-[9.5px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-full shadow-xs">
              SAVE 20%
            </span>
          </div>

          <div class="flex items-center gap-2.5 min-w-0">
            <div class="bundle-radio w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0 bg-emerald-600">
              <div class="bundle-dot w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
            <div class="relative shrink-0">
              <img src="${mainImg}" alt="2+1 Pack" class="w-10 h-10 object-contain rounded-lg bg-slate-50 p-0.5" />
              <span class="absolute -bottom-1 -right-1 text-[8.5px] font-black bg-emerald-700 text-white px-1 rounded-full">2+1</span>
            </div>
            <div class="min-w-0">
              <span class="font-extrabold text-xs text-slate-900 block truncate">
                ${isArabic ? 'عرض قطعتين + 1 مجاناً (الأكثر طلباً ⭐)' : 'Buy 2, Get 1 FREE (3 Month Supply)'}
              </span>
              <span class="text-[10.5px] text-emerald-800 font-bold block">
                ${isArabic ? 'أفضل النتائج خلال 6-8 أسابيع' : 'Best Results in 6 - 8 Weeks • Free Delivery'}
              </span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[11px] line-through text-slate-400 block font-mono">
              ${isAlgeriaCod ? `${Math.round(numericOrigPrice * 2.2).toLocaleString()} DZD` : `$${Math.round(numericOrigPrice * 2.2)}`}
            </span>
            <span class="text-sm font-black font-mono text-emerald-700">
              ${isAlgeriaCod ? `${Math.round(numericPrice * 1.8).toLocaleString()} DZD` : `$${Math.round(numericPrice * 1.8)}`}
            </span>
          </div>
        </div>

        <!-- Tier 3: Buy 3 Get 2 FREE (5 Month Supply) - BEST VALUE -->
        <div
          id="bundle-card-3"
          onclick="selectSupplyBundle(3)"
          class="bundle-card p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-slate-300 transition-all cursor-pointer relative flex items-center justify-between gap-3 shadow-2xs"
        >
          <!-- Ribbon Badge -->
          <div class="absolute -top-2.5 ${isArabic ? 'left-3' : 'right-3'} flex items-center gap-1.5">
            <span class="text-[9.5px] font-black uppercase text-amber-900 bg-amber-300 px-2 py-0.5 rounded-full shadow-xs">
              BEST RESULTS
            </span>
            <span class="text-[9.5px] font-black uppercase bg-red-600 text-white px-1.5 py-0.5 rounded-full shadow-xs">
              SAVE 25%
            </span>
          </div>

          <div class="flex items-center gap-2.5 min-w-0">
            <div class="bundle-radio w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0">
              <div class="bundle-dot w-2.5 h-2.5 rounded-full bg-transparent"></div>
            </div>
            <div class="relative shrink-0">
              <img src="${mainImg}" alt="3+2 Pack" class="w-10 h-10 object-contain rounded-lg bg-slate-50 p-0.5" />
              <span class="absolute -bottom-1 -right-1 text-[8.5px] font-black bg-amber-600 text-white px-1 rounded-full">3+2</span>
            </div>
            <div class="min-w-0">
              <span class="font-extrabold text-xs text-slate-900 block truncate">
                ${isArabic ? 'عرض 3 قطع + 2 مجاناً (حزمة العائلة)' : 'Buy 3, Get 2 FREE (5 Month Supply)'}
              </span>
              <span class="text-[10.5px] text-slate-500 block">
                ${isArabic ? 'توفير أقصى للاستعمال طويل الأمد' : '150 Day Supply • Maximum Long-Term Savings'}
              </span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[11px] line-through text-slate-400 block font-mono">
              ${isAlgeriaCod ? `${Math.round(numericOrigPrice * 3.4).toLocaleString()} DZD` : `$${Math.round(numericOrigPrice * 3.4)}`}
            </span>
            <span class="text-sm font-black font-mono text-slate-900">
              ${isAlgeriaCod ? `${Math.round(numericPrice * 2.5).toLocaleString()} DZD` : `$${Math.round(numericPrice * 2.5)}`}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stock & Urgency Pill (Pulsing Green Dot matching Image 3) -->
    <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/80 w-full justify-center">
      <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
      <span>${isArabic ? `● متوفر في المخزون | متاح للتوصيل السريع قبل ${deliveryDateString}` : `● In Stock | Available for Next Day Dispatch`}</span>
    </div>

    <!-- Big Prominent CTA Button (Image 3 & 4 exact aesthetic with Price Tag) -->
    <div id="order-target" class="pt-1 space-y-2.5">
      <a
        id="hero-cta-btn"
        href="#checkout-flow"
        class="cta-pulse w-full py-4 px-6 rounded-2xl text-white text-center font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
        style="background-color: var(--primary);"
      >
        <span id="hero-cta-label">
          ${isArabic
            ? `أطلب الآن — ${isAlgeriaCod ? `${Math.round(numericPrice * 1.8).toLocaleString()} DZD` : `$${Math.round(numericPrice * 1.8)}`} (الدفع عند الاستلام)`
            : `ADD TO CART • ${isAlgeriaCod ? `${Math.round(numericPrice * 1.8).toLocaleString()} DZD` : `$${Math.round(numericPrice * 1.8)}`}`}
        </span>
      </a>

      <!-- 30-Day Money-Back Guarantee Box (Image.png exact design) -->
      <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs">
        <div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div class="space-y-0.5">
          <span class="font-extrabold text-slate-900 block">
            ${isArabic ? 'ضمان 30 يوماً استرجاع واستبدال مجاني' : '30-Day Money-Back Guarantee'}
          </span>
          <span class="text-[11px] text-slate-500 block leading-tight">
            ${isArabic ? 'نحن واثقون تماماً من جودة وفعالية المنتج، خذ 30 يوماً لتجربته بكل ثقة.' : "We're so confident you'll love it, take 30 days on us. 100% risk free."}
          </span>
        </div>
      </div>

      <!-- Shipping Destination Line -->
      <div class="text-center text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5">
        <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-8-4.5-8-11.8A8 8 0 0112 1a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
        <span>${isArabic ? 'شحن سريع ومجاني لـ: 58 ولاية جزائرية مع معاينة الطرد' : `Fast, Free Shipping to: ${product.country || 'Your Location'}`}</span>
      </div>

      <!-- Circular Trust Icons Row (Image.png Signature Component) -->
      <div class="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-2xs text-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <span class="text-[9.5px] font-bold text-slate-600 mt-1">${isArabic ? 'أصلي 100%' : '100% Original'}</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-2xs text-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <span class="text-[9.5px] font-bold text-slate-600 mt-1">${isArabic ? 'فحص قبل الدفع' : 'Pay After Check'}</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-2xs text-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span class="text-[9.5px] font-bold text-slate-600 mt-1">${isArabic ? 'توصيل سريع' : 'Fast Dispatch'}</span>
        </div>
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-2xs text-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </div>
          <span class="text-[9.5px] font-bold text-slate-600 mt-1">${isArabic ? 'ضمان الرضا' : 'Satisfaction'}</span>
        </div>
      </div>
    </div>

  ${isSectionEnabled('cod_order_form') ? `
    <!-- =============================================================
         SECTION 04: RTO-PROTECTED COD ORDER FORM OR DTC CHECKOUT
         ============================================================= -->
    <section id="checkout-flow" class="pt-6">
      <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/90 space-y-4">
        
        <div class="text-center space-y-1 border-b border-slate-100 pb-3">
          <span class="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white" style="background-color: var(--primary);">
            ${isArabic ? 'الدفع نقداً عند الاستلام 100%' : 'Fast Direct Checkout'}
          </span>
          <h2 class="text-lg font-black text-slate-900">
            ${isArabic ? 'أدخل معلوماتك لتأكيد الشحن فوراً' : 'Complete Your Order Details'}
          </h2>
          <p class="text-[11px] text-slate-500">
            ${isArabic ? 'سنتصل بك هاتفياً خلال 15 دقيقة لتأكيد الطلب قبل الإرسال مع ياليدين.' : 'Quick express delivery with zero risk.'}
          </p>
        </div>

        <form id="landing-order-form" onsubmit="event.preventDefault(); document.getElementById('confirmation-modal').classList.remove('hidden');" class="space-y-3.5 text-xs">
          
          <!-- Offer Bundle Radio Selection -->
          <div class="space-y-1.5">
            <label class="block font-bold text-slate-800">${isArabic ? 'اختر العرض:' : 'Choose Package:'}</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="p-3 rounded-2xl border-2 border-slate-200 flex flex-col justify-between cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/20">
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-slate-900">${isArabic ? 'قطعة واحدة' : '1 Unit'}</span>
                  <input type="radio" name="qty-select" value="1" checked onchange="updateTotalCost(1)" />
                </div>
                <span class="font-mono font-bold text-slate-800">${price}</span>
              </label>

              <label class="p-3 rounded-2xl border-2 border-amber-300 bg-amber-50/20 flex flex-col justify-between cursor-pointer relative has-[:checked]:border-amber-600 has-[:checked]:bg-amber-50/50">
                <span class="absolute -top-2 ${isArabic ? 'left-2' : 'right-2'} text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded-full">
                  ${isArabic ? 'وفر 35%' : 'BEST VALUE ✨'}
                </span>
                <div class="flex items-center justify-between mb-1">
                  <span class="font-bold text-slate-900">${isArabic ? 'عرض قطعتين (دبل)' : '2 Units (Duo)'}</span>
                  <input type="radio" name="qty-select" value="2" onchange="updateTotalCost(2)" />
                </div>
                <span class="font-mono font-bold text-emerald-700">
                  ${product.country === 'Algeria' ? `${Math.round(numericPrice * 1.8).toLocaleString()} DZD` : `$${Math.round(numericPrice * 1.7)}`}
                </span>
              </label>
            </div>
          </div>

          <!-- Customer Name -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">${isArabic ? 'الاسم واللقب *' : 'Full Name *'}</label>
            <input type="text" required placeholder="${isArabic ? 'مثال: كريم بن علي' : 'e.g. John Doe'}" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-medium" />
          </div>

          <!-- Phone Number -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="font-bold text-slate-700">${isArabic ? 'رقم الهاتف الأساسي *' : 'Phone Number *'}</label>
              <span id="phone-badge" class="text-[10px] font-mono text-slate-400">06 / 07 / 05</span>
            </div>
            <input type="tel" required placeholder="${isArabic ? '06XXXXXXXX أو 07XXXXXXXX' : '+1 (555) 000-0000'}" class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono font-bold text-left" dir="ltr" oninput="detectOperator(this.value)" />
          </div>

          ${isAlgeriaCod ? `
          <!-- Algerian 58 Wilayas Selector -->
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1">الولاية (58 ولاية) *</label>
              <select id="wilaya-select" required class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold" onchange="calculateDeliveryFee()">
                <option value="400">16 - الجزائر (400 دج)</option>
                <option value="500">09 - البليدة (500 دج)</option>
                <option value="550">31 - وهران (550 دج)</option>
                <option value="550">25 - قسنطينة (550 دج)</option>
                <option value="550">19 - سطيف (550 دج)</option>
                <option value="500">15 - تيزي وزو (500 دج)</option>
                <option value="450">35 - بومرداس (450 دج)</option>
                <option value="600">13 - تلمسان (600 دج)</option>
                <option value="600">23 - عنابة (600 دج)</option>
                <option value="850">30 - ورقلة (850 دج)</option>
                <option value="1100">11 - تمنراست (1100 دج)</option>
                <option value="600">باقي الولايات (600 دج)</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">البلدية والعنوان *</label>
              <input type="text" required placeholder="اسم البلدية والحي..." class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900" />
            </div>
          </div>

          <!-- Stop-Desk vs Home Delivery -->
          <div class="space-y-1 pt-1">
            <label class="block font-bold text-slate-800">مكان الاستلام:</label>
            <div class="grid grid-cols-2 gap-2">
              <label class="p-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/20">
                <input type="radio" name="delivery-mode" value="home" checked onchange="calculateDeliveryFee()" />
                <span class="font-bold text-slate-900">توصيل للبيت</span>
              </label>
              <label class="p-2.5 rounded-xl border border-slate-200 flex items-center gap-1.5 cursor-pointer has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50/20">
                <input type="radio" name="delivery-mode" value="stopdesk" onchange="calculateDeliveryFee()" />
                <span class="font-bold text-emerald-800">مكتب ياليدين (-200 دج)</span>
              </label>
            </div>
          </div>
          ` : `
          <!-- DTC Address -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Shipping Address *</label>
            <input type="text" required placeholder="Street address, apartment, suite..." class="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50" />
          </div>
          `}

          <!-- Order Summary Calculation -->
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-slate-600 text-[11px]">
            <div class="flex justify-between">
              <span>${isArabic ? 'سعر المنتج:' : 'Subtotal:'}</span>
              <span id="calc-subtotal" class="font-mono font-bold text-slate-900">${price}</span>
            </div>
            ${isAlgeriaCod ? `
            <div class="flex justify-between">
              <span>شحن ياليدين إكسبريس:</span>
              <span id="calc-shipping" class="font-mono font-bold text-slate-900">400 DZD</span>
            </div>
            <div id="stopdesk-discount-row" class="hidden flex justify-between text-emerald-700 font-bold">
              <span>خصم استلام المكتب:</span>
              <span class="font-mono">-200 DZD</span>
            </div>
            ` : ''}
            <div class="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
              <span>${isArabic ? 'المجموع المستحق عند الاستلام:' : 'Total Payable:'}</span>
              <span id="calc-total" class="font-mono" style="color: var(--primary);">${price}</span>
            </div>
          </div>

          <!-- Final Submit Button -->
          <button
            type="submit"
            class="w-full py-4 rounded-2xl text-white font-extrabold text-sm sm:text-base shadow-md hover:opacity-95 transition-all cursor-pointer"
            style="background-color: var(--primary);"
          >
            ${isArabic ? 'تأكيد الطلب الآن ←' : 'CONFIRM ORDER NOW →'}
          </button>
        </form>
      </div>
    </section>
  ` : ''}

  ${isSectionEnabled('before_after') ? `
    <!-- =============================================================
         SECTION 05: BEFORE & AFTER TRANSFORMATION PROOF
         ============================================================= -->
    <section class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
      <div class="text-center space-y-1">
        <span class="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
          ${isArabic ? 'نتائج مثبتة' : 'Proven Results'}
        </span>
        <h3 class="text-base font-extrabold text-slate-900">
          ${isArabic ? 'الفرق الواضح والتأثير المباشر' : 'Visible Transformation in Daily Life'}
        </h3>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-3 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1.5">
          <span class="font-bold text-rose-900 block flex items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">✕</span>
            ${isArabic ? 'بدون هذا المنتج' : 'Without it'}
          </span>
          <p class="text-[11px] text-rose-800/90 leading-relaxed">
            ${strategy?.beforeText || (isArabic ? 'تكاليف متكررة، ضياع وقت وجهد، واستمرار الإحساس بعدم الراحة.' : 'Expensive alternatives, daily fatigue, and slow results.')}
          </p>
        </div>
        <div class="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
          <span class="font-bold text-emerald-900 block flex items-center gap-1">
            <span class="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
            ${isArabic ? `مع ${brandName}` : `With ${brandName}`}
          </span>
          <p class="text-[11px] text-emerald-800/90 leading-relaxed">
            ${strategy?.afterText || (isArabic ? 'نتيجة فورية ممتازة، راحة بال تامة، وتوفير حقيقي مع ضمان الجودة.' : 'Instant noticeable improvement, superior comfort, and risk-free trial.')}
          </p>
        </div>
      </div>
    </section>
  ` : ''}

  ${isSectionEnabled('testimonials') ? `
    <!-- =============================================================
         SECTION 06: CUSTOMER REVIEWS (SOCIAL PROOF)
         ============================================================= -->
    <section class="space-y-3">
      <div class="text-center space-y-0.5">
        <h3 class="text-sm font-extrabold text-slate-900">
          ${isArabic ? 'آراء وتجارب العملاء الموثقة' : 'Verified Customer Testimonials'}
        </h3>
        <p class="text-[11px] text-slate-500">
          ${isArabic ? 'أكثر من 3,840+ عميل راضٍ في مختلف الولايات' : 'Over 3,840+ happy customers'}
        </p>
      </div>

      <div class="space-y-2.5">
        ${(strategy?.testimonials && strategy.testimonials.length > 0 ? strategy.testimonials : [
          {
            name: isArabic ? 'كريم ب. (الجزائر العاصمة 16)' : 'Karim B. (Verified Buyer)',
            rating: 5,
            text: isArabic ? 'منتج ممتاز ومطابق للصورة تماماً. وصلني الطرد في أقل من 24 ساعة وفحصته قبل الدفع للموزع.' : 'Super high quality! Exactly as described and works like a charm. Delivery was fast.'
          },
          {
            name: isArabic ? 'أمينة م. (وهران 31)' : 'Amina M. (Verified Buyer)',
            rating: 5,
            text: isArabic ? 'صراحة النتيجة مبهرة ووفّرت علي الكثير من المصاريف. ننصح بيه أي واحد حاب جودة أصلية.' : 'Noticeable difference from day one! Definitely 10/10 recommend to anyone looking for real quality.'
          }
        ]).map((item: any, idx: number) => `
          <div class="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 font-bold text-slate-800">
                <span class="w-5 h-5 rounded-full ${idx % 2 === 0 ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'} flex items-center justify-center text-[10px] font-bold">
                  ${(item.name || 'U')[0]}
                </span>
                <span>${item.name || 'Verified Buyer'} ${item.wilaya ? `(${item.wilaya})` : ''}</span>
              </div>
              <span class="text-amber-500 text-xs">${'★'.repeat(item.rating || 5)}</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              ${item.text}
            </p>
          </div>
        `).join('')}
      </div>
    </section>
  ` : ''}

  ${isSectionEnabled('faq') ? `
    <!-- =============================================================
         SECTION 07: ACCORDION FAQ
         ============================================================= -->
    <section class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-2.5">
      <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 text-center mb-1">
        ${isArabic ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
      </h3>

      ${(strategy?.faqs && strategy.faqs.length > 0 ? strategy.faqs : [
        {
          q: isArabic ? 'كيف تتم عملية الدفع واستلام الطرد؟' : 'How does shipping & payment work?',
          a: isArabic ? 'الدفع يتم نقداً عند الاستلام 100% (Cash on Delivery). لا تدفع أي دينار حتى تستلم طردك وتتفحصه بنفسك.' : 'You pay cash upon delivery after inspecting the package.'
        },
        {
          q: isArabic ? 'ماذا أفعل إذا كان هناك أي عيب أو مشكلة؟' : 'What is the return & warranty policy?',
          a: isArabic ? 'نوفر لك ضمان استبدال مجاني وفوري. إذا وجد أي عيب مصنعي في المنتج، سيتكفل فريق خدمة العملاء باستبداله فوراً.' : 'We offer a full satisfaction and replacement guarantee. Simply reach out to customer care.'
        }
      ]).map((faq: any) => `
        <details class="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 cursor-pointer group">
          <summary class="font-bold text-xs text-slate-800 flex items-center justify-between">
            <span>${faq.q}</span>
            <span class="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="text-[11px] text-slate-600 mt-2 leading-relaxed pt-1.5 border-t border-slate-200/50">
            ${faq.a}
          </p>
        </details>
      `).join('')}
    </section>
  ` : ''}

  ${isSectionEnabled('footer') ? `
    <!-- Store Footer -->
    <footer class="pt-4 text-center text-[10px] text-slate-400 space-y-1">
      <p class="font-bold text-slate-600">${title} • ${isArabic ? 'المتجر الرسمي المعتمد' : 'Official Store'}</p>
      <p>© ${new Date().getFullYear()} ${brandName}. All rights reserved. 58 Wilayas Cash on Delivery.</p>
    </footer>
  ` : ''}

  </main>

  <!-- =============================================================
       STICKY BOTTOM PURCHASE BAR (MOBILE CONVERSION BOOSTER)
       ============================================================= -->
  <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-40 flex items-center justify-between max-w-md mx-auto shadow-2xl">
    <div class="flex items-center gap-2.5">
      <img src="${mainImg}" alt="${title}" class="w-10 h-10 object-contain rounded-lg border border-slate-100 bg-slate-50" />
      <div>
        <span class="font-mono font-black text-sm block" style="color: var(--text-dark);">${price}</span>
        <span class="text-[10px] text-emerald-600 font-bold block">${isArabic ? '● متوفر الآن' : '● In Stock'}</span>
      </div>
    </div>
    <a
      href="#checkout-flow"
      class="py-2.5 px-6 rounded-xl text-white text-xs font-black shadow-md transition-all active:scale-95"
      style="background-color: var(--primary);"
    >
      ${isArabic ? 'أطلب الآن 🚚' : 'ADD TO CART'}
    </a>
  </div>

  <!-- ORDER SUCCESS MODAL -->
  <div id="confirmation-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
    <div class="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
      <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-black">
        ✓
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-black text-slate-900">${isArabic ? 'تم تأكيد طلبك بنجاح!' : 'Order Placed Successfully!'}</h3>
        <p class="text-xs text-slate-600 leading-relaxed">
          ${isArabic ? 'شكراً لثقتكم. سيتصل بكم فريق خدمة العملاء خلال دقائق لتأكيد العنوان وموعد التسليم عبر ياليدين.' : 'Thank you for your order. Our team will contact you shortly to confirm express dispatch.'}
        </p>
      </div>
      <button
        type="button"
        onclick="document.getElementById('confirmation-modal').classList.add('hidden')"
        class="w-full py-3 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer"
        style="background-color: var(--primary);"
      >
        ${isArabic ? 'حسناً، شكراً' : 'Great, Got It!'}
      </button>
    </div>
  </div>

  <!-- Interactive JavaScript Engine -->
  <script>
    const basePrice = ${numericPrice};
    const isAlgeria = ${isAlgeriaCod ? 'true' : 'false'};
    const isAr = ${isArabic ? 'true' : 'false'};

    let currentBundleTier = 2; // Default to Most Popular Tier 2

    function formatPrice(amount) {
      if (isAlgeria) {
        return amount.toLocaleString() + ' DZD';
      }
      return '$' + amount;
    }

    function selectSupplyBundle(tier) {
      currentBundleTier = tier;

      // Update Card Visuals
      for (let t = 1; t <= 3; t++) {
        const card = document.getElementById('bundle-card-' + t);
        if (!card) continue;
        const radio = card.querySelector('.bundle-radio');
        const dot = card.querySelector('.bundle-dot');

        if (t === tier) {
          card.classList.remove('border-slate-200', 'bg-white');
          card.classList.add('border-emerald-600', 'bg-emerald-50/20', 'ring-1', 'ring-emerald-500/30');
          if (radio) {
            radio.classList.remove('border-slate-300');
            radio.classList.add('border-emerald-600', 'bg-emerald-600');
          }
          if (dot) {
            dot.classList.remove('bg-transparent');
            dot.classList.add('bg-white');
          }
        } else {
          card.classList.remove('border-emerald-600', 'bg-emerald-50/20', 'ring-1', 'ring-emerald-500/30');
          card.classList.add('border-slate-200', 'bg-white');
          if (radio) {
            radio.classList.remove('border-emerald-600', 'bg-emerald-600');
            radio.classList.add('border-slate-300');
          }
          if (dot) {
            dot.classList.remove('bg-white');
            dot.classList.add('bg-transparent');
          }
        }
      }

      // Calculate bundle price
      let multiplier = 1;
      if (tier === 2) multiplier = 1.8;
      if (tier === 3) multiplier = 2.5;

      const activeBundlePrice = Math.round(basePrice * multiplier);
      const priceString = formatPrice(activeBundlePrice);

      // Update Hero CTA Button Label
      const ctaLabel = document.getElementById('hero-cta-label');
      if (ctaLabel) {
        ctaLabel.textContent = isAr
          ? 'أطلب الآن — ' + priceString + ' (الدفع عند الاستلام)'
          : 'ADD TO CART • ' + priceString;
      }

      // Sync with checkout form radio if present
      const radios = document.querySelectorAll('input[name="qty-select"]');
      radios.forEach((r) => {
        if (parseInt(r.value) === tier) r.checked = true;
      });

      // Update Order Form subtotal & delivery fee
      updateTotalCost(tier);
    }

    function detectOperator(val) {
      const badge = document.getElementById('phone-badge');
      if (!badge) return;
      const clean = val.replace(/\\D/g, '');
      if (clean.startsWith('06') || clean.startsWith('6')) {
        badge.textContent = 'Mobilis (موبيليس)';
        badge.className = 'text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded';
      } else if (clean.startsWith('07') || clean.startsWith('7')) {
        badge.textContent = 'Djezzy (جيزي)';
        badge.className = 'text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded';
      } else if (clean.startsWith('05') || clean.startsWith('5')) {
        badge.textContent = 'Ooredoo (أوريدو)';
        badge.className = 'text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded';
      } else {
        badge.textContent = '06 / 07 / 05';
        badge.className = 'text-[10px] font-mono text-slate-400';
      }
    }

    let currentQty = 2; // Default to Tier 2

    function updateTotalCost(qty) {
      currentQty = qty;
      const subtotalEl = document.getElementById('calc-subtotal');
      let unitMultiplier = 1;
      if (qty === 2) unitMultiplier = 1.8;
      if (qty === 3) unitMultiplier = 2.5;

      const calculatedSubtotal = Math.round(basePrice * unitMultiplier);
      
      if (subtotalEl) {
        subtotalEl.textContent = formatPrice(calculatedSubtotal);
      }
      calculateDeliveryFee();
    }

    function calculateDeliveryFee() {
      if (!isAlgeria) return;
      const wilayaEl = document.getElementById('wilaya-select');
      const stopDeskDiscountRow = document.getElementById('stopdesk-discount-row');
      const shippingEl = document.getElementById('calc-shipping');
      const totalEl = document.getElementById('calc-total');

      const wilayaFee = wilayaEl ? (parseInt(wilayaEl.value) || 400) : 400;
      const isStopDesk = document.querySelector('input[name="delivery-mode"]:checked')?.value === 'stopdesk';
      const stopDeskDiscount = isStopDesk ? 200 : 0;

      if (stopDeskDiscountRow) {
        if (isStopDesk) stopDeskDiscountRow.classList.remove('hidden');
        else stopDeskDiscountRow.classList.add('hidden');
      }

      const effectiveShipping = Math.max(0, wilayaFee - stopDeskDiscount);
      if (shippingEl) shippingEl.textContent = wilayaFee + ' DZD';

      let unitMultiplier = 1;
      if (currentQty === 2) unitMultiplier = 1.8;
      if (currentQty === 3) unitMultiplier = 2.5;

      const productTotal = Math.round(basePrice * unitMultiplier);
      const grandTotal = productTotal + effectiveShipping;

      if (totalEl) {
        totalEl.textContent = grandTotal.toLocaleString() + ' DZD';
      }
    }

    // Initialize fees & default to Tier 2 on page load
    window.addEventListener('DOMContentLoaded', () => {
      selectSupplyBundle(2);
      calculateDeliveryFee();
    });
  </script>
</body>
</html>`;
}
