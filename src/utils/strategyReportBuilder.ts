import { ProductInputData, StrategyReportOutputA } from '../types/landingPage';

/**
 * Synthesizes the Complete 15-Section Product Strategy Report (OUTPUT A)
 * based on the Master System Prompt guidelines.
 */
export function buildProductStrategyReport(
  product: ProductInputData,
  linkedIntelligence?: string
): StrategyReportOutputA {
  const name = product.name || 'Universal Innovation Product';
  const category = product.category || 'Direct Response E-Commerce';
  const lang = (product.language || 'English').toLowerCase();
  const isArabic = lang.includes('arab') || lang.includes('darja');
  const isFrench = lang.includes('french');
  const isDzd = product.currency === 'DZD' || product.price?.includes('DZD') || product.country === 'Algeria';

  const numPrice = parseInt((product.price || '4800').replace(/[^0-9]/g, '')) || (isDzd ? 4800 : 39);
  const numOrig = parseInt((product.originalPrice || '8500').replace(/[^0-9]/g, '')) || (isDzd ? 8500 : 49);
  const cost = Math.round(numPrice * 0.32);
  const grossMargin = Math.round(((numPrice - cost) / numPrice) * 100);
  const profit = numPrice - cost;

  // Extract core keywords
  const lowerName = `${name} ${category} ${product.description || ''}`.toLowerCase();

  // 1. Brand archetype & color psychology
  let archetype = 'The Hero (Mastery, Performance & Superior Strength)';
  let primaryHex = '#0f172a';
  let accentHex = '#2563eb';
  let emotionalTerritory = 'Confidence, Peak Performance, and Daily Mastery';

  if (lowerName.includes('protein') || lowerName.includes('coffee') || lowerName.includes('vegan') || lowerName.includes('nutrition')) {
    archetype = 'The Creator / Everyday Vitality (Nourishment, Energy & Purity)';
    primaryHex = '#3d1f08';
    accentHex = '#c05621';
    emotionalTerritory = 'Clean Vitality, Organic Nourishment, and Daily Renewal';
  } else if (lowerName.includes('dental') || lowerName.includes('teeth') || lowerName.includes('scaler') || lowerName.includes('medical')) {
    archetype = 'The Caregiver / Sage (Clinical Precision, Hygiene & Reassurance)';
    primaryHex = '#0369a1';
    accentHex = '#0284c7';
    emotionalTerritory = 'Clinical Hygiene, Self-Care Pride, and Painless Relief';
  } else if (lowerName.includes('cushion') || lowerName.includes('spine') || lowerName.includes('back')) {
    archetype = 'The Caregiver / Everyday Hero (Ergonomic Relief & Body Support)';
    primaryHex = '#1e3a8a';
    accentHex = '#2563eb';
    emotionalTerritory = 'Spinal Decompression, Pain-Free Freedom, and Daily Work Comfort';
  } else if (lowerName.includes('umbrella') || lowerName.includes('rain')) {
    archetype = 'The Explorer / Everyday Ally (Stormproof Reliability & Style)';
    primaryHex = '#581c87';
    accentHex = '#db2777';
    emotionalTerritory = 'All-Weather Readiness, Effortless Commute, and Compact Elegance';
  } else if (lowerName.includes('serum') || lowerName.includes('skin') || lowerName.includes('beauty')) {
    archetype = 'The Lover / Sovereign (Radiance, Youthful Rejuvenation & Luxury)';
    primaryHex = '#881337';
    accentHex = '#ea580c';
    emotionalTerritory = 'Luminous Radiance, Youthful Confidence, and Sensory Indulgence';
  }

  // 2. Brand names evaluated
  const basePrefix = name.split(' ')[0] || 'Vittal';
  const brandNames = [
    {
      name: `${basePrefix}Pure`,
      rationale: 'Evokes authentic clinical grade purity and zero-filler potency.',
      isRecommended: true,
    },
    {
      name: `Nova${basePrefix}`,
      rationale: 'Signals breakthrough modern engineering and advanced everyday functionality.',
      isRecommended: false,
    },
    {
      name: `Aura${basePrefix}`,
      rationale: 'Emphasizes radiant emotional wellbeing and elevated self-esteem.',
      isRecommended: false,
    },
    {
      name: `True${basePrefix}`,
      rationale: 'Builds direct consumer trust against cheap imitators and counterfeit items.',
      isRecommended: false,
    },
    {
      name: `${basePrefix} Shield`,
      rationale: 'Reinforces daily protection, long-term durability and ergonomic defense.',
      isRecommended: false,
    },
  ];

  // 3. Customer Avatars (3-5 ranked)
  const customerAvatars = [
    {
      name: isArabic ? 'أحمد ك. (المهني العملي المنشغل)' : 'Alex Vance (The Busy Urban Professional)',
      role: isArabic ? 'موظف أو صاحب مشروع حر (28-45 سنة)' : 'Manager / Tech Professional (28-42)',
      likelihood: 'Highest' as const,
      corePain: product.customerProblem || (isArabic ? 'ضيق الوقت وتكرار تكاليف الحلول المؤقتة' : 'Chronic discomfort, lack of time, and wasting money on cheap alternatives.'),
      primaryDesire: isArabic ? 'حل سريع ومضمون يعطي نتيجة فورية بدون مجهود' : 'Instant reliable solution that delivers clinical results from home.',
      keyObjection: isArabic ? 'هل المنتج أصلي حقاً ويمكنني معاينته قبل الدفع؟' : 'Is this genuinely durable and will it actually work as shown?',
    },
    {
      name: isArabic ? 'فاطمة م. (راعية العائلة والصحة)' : 'Sarah Jenkins (The Proactive Health & Home Enthusiast)',
      role: isArabic ? 'أم ومسؤولة مشتريات المنزل (30-50 سنة)' : 'Health-conscious Parent (32-48)',
      likelihood: 'Very High' as const,
      corePain: isArabic ? 'القلق من المنتجات المقلدة والرغبة في حماية العائلة' : 'Skeptical of substandard knockoffs and concerned about long-term well-being.',
      primaryDesire: isArabic ? 'منتج معتمد 100% يوفر راحة بال تدوم طويلاً' : 'Certified safe, long-lasting product with guaranteed satisfaction.',
      keyObjection: isArabic ? 'كيف تتم عملية الاستبدال إذا كان هناك أي عيب مصنعي؟' : 'What is the exact warranty and return policy if I am not satisfied?',
    },
    {
      name: isArabic ? 'مراد ب. (المستهلك الذكي والباحث عن القيمة)' : 'David Cole (The Value-Driven Pragmatist)',
      role: isArabic ? 'سائق أو تقني ميداني (25-55 سنة)' : 'Driver / Field Specialist (25-55)',
      likelihood: 'High' as const,
      corePain: isArabic ? 'الإرهاق البدني اليومي وتراكم المصاريف المتكررة' : 'Physical strain during long commutes and recurring maintenance bills.',
      primaryDesire: isArabic ? 'أفضل جودة مقابل السعر مع توفير عند شراء حزمتين' : 'Best ROI, maximum durability, and high volume bundle discount.',
      keyObjection: isArabic ? 'هل التوصيل سريع ومجاني لباب المنزل؟' : 'How fast is dispatch and are there hidden delivery fees?',
    },
  ];

  // 4. Marketing Angles (5 ranked)
  const marketingAngles = [
    {
      rank: 1,
      angleName: isArabic ? 'زاوية الحل الفوري الموفر للمال' : 'The Instant Problem-Solver Angle (Direct Savings)',
      hookHeadline: isArabic
        ? `توقف عن إهدار المال: الحل النهائي والأصلي لـ ${name}`
        : `Stop Overpaying for Clinic Visits: The Breakthrough ${name}`,
      bodyAngle: isArabic
        ? 'بينما تفرض الحلول التقليدية مواعيد وتكاليف متكررة، يمنحك هذا الابتكار نفس النتيجة الاحترافية في المنزل بـ 5 دقائق فقط.'
        : 'While traditional solutions require constant appointments and recurring bills, this innovation gives you professional results from home in 5 minutes.',
      ctaFraming: isArabic ? 'احصل على نسختك الأصلية مع تخفيض 45% لليوم فقط' : 'Claim Your 45% Limited Discount & Free Delivery',
      targetAvatar: isArabic ? 'أحمد ك. (المهني المنشغل)' : 'Alex Vance (Urban Professional)',
    },
    {
      rank: 2,
      angleName: isArabic ? 'زاوية المقارنة والإثبات المباشر' : 'The Demonstrable Visual Proof Angle',
      hookHeadline: isArabic
        ? `شاهد الفرق الصادم قبل وبعد الاستعمال الأول لـ ${name}`
        : `The Proof is in the Results: See The Real Difference with ${name}`,
      bodyAngle: isArabic
        ? 'اختبارات واقعية وتجارب موثقة تثبت الفعالية الفورية والتخلص التام من الإزعاج دون أي آثار جانبية.'
        : 'Engineered with certified materials that outperform generic alternatives on day one.',
      ctaFraming: isArabic ? 'اطلب الآن وعاين الطرد بنفسك قبل دفع أي دينار' : 'Order Now With Zero Risk — 100% Satisfaction Guarantee',
      targetAvatar: isArabic ? 'مراد ب. (المستهلك الذكي)' : 'David Cole (Value-Driven Pragmatist)',
    },
    {
      rank: 3,
      angleName: isArabic ? 'زاوية راحة البال والضمان الكامل' : 'The Zero-Risk Peace of Mind Angle',
      hookHeadline: isArabic
        ? `ضمان 100% رضا أو استرجاع — لا تدفع حتى تفحص الطرد`
        : `100% Risk-Free Guarantee: Inspect Before You Pay`,
      bodyAngle: isArabic
        ? 'نحن واثقون تماماً من جودة المنتج الأصلي، لذلك نمنحك حق المعاينة الكاملة عند باب المنزل لـ 58 ولاية.'
        : 'Backed by our unconditional 30-day satisfaction policy and rapid door-to-door dispatch.',
      ctaFraming: isArabic ? 'أطلب الآن واستفد من الدفع عند الاستلام' : 'Try It Risk-Free For 30 Days',
      targetAvatar: isArabic ? 'فاطمة م. (راعية العائلة)' : 'Sarah Jenkins (Health Enthusiast)',
    },
    {
      rank: 4,
      angleName: isArabic ? 'زاوية العرض المزدوج للعائلة (Pack Duo)' : 'The Family Duo Bundle Value Angle',
      hookHeadline: isArabic
        ? `عرض خاص: اشترِ قطعتين ووفر 35% مع شحن مجاني`
        : `Smart Bundle: Buy 2 Get 1 FREE (Save 20% + Free Shipping)`,
      bodyAngle: isArabic
        ? 'أغلب زبائننا يطلبون نسختين: واحدة للاستعمال الشخصي والأخرى كهدية قيمة للوالدين أو الشريك مع توفير فوري.'
        : 'Over 68% of customers choose the 3-Month supply for lasting long-term benefits and free dispatch.',
      ctaFraming: isArabic ? 'اختر حزمة التوفير العائلية قبل نفاد الكمية' : 'Upgrade to Most Popular Bundle',
      targetAvatar: isArabic ? 'فاطمة م. و مراد ب.' : 'Smart Shoppers & Families',
    },
    {
      rank: 5,
      angleName: isArabic ? 'زاوية الندرة والكمية المحدودة' : 'The Exclusive Seasonal Allocation Angle',
      hookHeadline: isArabic
        ? `الدَفعة الأصلية الأخيرة متوفرة حالياً في المخزن الوطني`
        : `Final Batch In Stock: Available for Next Day Dispatch`,
      bodyAngle: isArabic
        ? 'نظراً للطلب القياسي، الكميات المتبقية مخصصة للتوزيع الفوري مع شركات التوصيل السريعة.'
        : 'High-volume seasonal demand has allocated only 42 units for express same-day fulfillment.',
      ctaFraming: isArabic ? 'احجز قطعتك الآن قبل نفاد المخزون' : 'Secure Your Order Before Stock Closes',
      targetAvatar: isArabic ? 'جميع الفئات المهتمة' : 'Urgency-driven buyers',
    },
  ];

  // 5. Offer & Bundle Architecture matching Image.png
  const tier1Price = `${numPrice.toLocaleString()} ${isDzd ? 'DZD' : '$'}`;
  const tier1Orig = `${numOrig.toLocaleString()} ${isDzd ? 'DZD' : '$'}`;

  const tier2PriceNum = Math.round(numPrice * 1.8);
  const tier2OrigNum = Math.round(numOrig * 2.2);
  const tier2Price = `${tier2PriceNum.toLocaleString()} ${isDzd ? 'DZD' : '$'}`;
  const tier2Orig = `${tier2OrigNum.toLocaleString()} ${isDzd ? 'DZD' : '$'}`;

  const tier3PriceNum = Math.round(numPrice * 2.5);
  const tier3OrigNum = Math.round(numOrig * 3.4);
  const tier3Price = `${tier3PriceNum.toLocaleString()} ${isDzd ? 'DZD' : '$'}`;
  const tier3Orig = `${tier3OrigNum.toLocaleString()} ${isDzd ? 'DZD' : '$'}`;

  const offerStrategy = {
    tier1: {
      name: isArabic ? 'عرض قطعة واحدة (الأساسي)' : 'Buy 1 (1 Month Supply)',
      supply: isArabic ? 'استعمال شخصي 30 يوماً' : '30-Day Starter Supply',
      price: tier1Price,
      origPrice: tier1Orig,
      savings: isArabic ? 'وفر 20%' : 'SAVE 20%',
      badge: isArabic ? 'الخيار القياسي' : 'Standard Entry',
    },
    tier2: {
      name: isArabic ? 'عرض قطعتين (الأكثر طلباً ⭐)' : 'Buy 2 Get 1 FREE (3 Month Supply)',
      supply: isArabic ? 'حزمة التوفير - 90 يوماً' : '90-Day Full Transformation',
      price: tier2Price,
      origPrice: tier2Orig,
      savings: isArabic ? 'وفر 35%' : 'SAVE 20%',
      badge: 'MOST POPULAR',
    },
    tier3: {
      name: isArabic ? 'عرض 3 قطع (أفضل قيمة توفير)' : 'Buy 3 Get 2 FREE (5 Month Supply)',
      supply: isArabic ? 'حزمة العائلة - 150 يوماً' : '150-Day Optimal Wellness',
      price: tier3Price,
      origPrice: tier3Orig,
      savings: isArabic ? 'وفر 45%' : 'BEST VALUE',
      badge: 'BEST RESULTS',
    },
    guaranteeTerm: isArabic ? 'ضمان 30 يوماً استرجاع واستبدال مجاني مع فحص الطرد' : '30-Day Money-Back Guarantee (100% Risk Free)',
    urgencyDriver: isArabic ? 'توصيل خلال 24-48 ساعة لـ 58 ولاية مع ياليدين' : 'In Stock • Available for Next Day Dispatch',
  };

  // 6. Pricing Strategy
  const pricingStrategy = {
    retailPrice: tier1Price,
    costOfGoods: `${cost.toLocaleString()} ${isDzd ? 'DZD' : '$'}`,
    grossMarginPercent: grossMargin,
    netProfitDZD: `+${profit.toLocaleString()} ${isDzd ? 'DZD' : '$'}`,
    breakEvenRoas: 1.65,
  };

  // 7. Bundle Economics
  const bundleEconomics = {
    singleContributionMargin: `${(numPrice - cost - 450).toLocaleString()} ${isDzd ? 'DZD' : '$'} (absorbs 12% RTO)`,
    duoContributionMargin: `${(tier2PriceNum - (cost * 2) - 450).toLocaleString()} ${isDzd ? 'DZD' : '$'} (Superior AOV & profit)`,
    trioContributionMargin: `${(tier3PriceNum - (cost * 3) - 450).toLocaleString()} ${isDzd ? 'DZD' : '$'} (Maximum customer lifetime value)`,
    codReturnAbsorptionNotes: isArabic
      ? 'الحزم المزدوجة ترفع متوسط قيمة الطلب (AOV) بنسبة 40% وتخفض تكلفة الاستحواذ الإعلاني (CAC) لكل قطعة بنسبة 32%.'
      : 'Bundle architecture offsets customer acquisition cost and cushions against courier fulfillment return risks.',
  };

  // 8. Landing Page Architecture
  const pageArchitecture = [
    { section: 'Top Announcement Bar', order: 1, purpose: 'Urgency & Free Delivery Trigger', croRationale: 'Captures immediate attention and addresses shipping friction.' },
    { section: 'DTC Brand Navigation', order: 2, purpose: 'Brand Credibility & Cart Anchor', croRationale: 'Signals legitimate direct-to-consumer store, not a generic dropshipping page.' },
    { section: 'Hero Packshot & Flanking Badges', order: 3, purpose: 'Visual Impact & Value Anchoring', croRationale: 'Matches Image.png with high-definition packaging flanked by core benefits.' },
    { section: 'Social Proof & Rating Stars', order: 4, purpose: 'Bandwagon Effect & Trust Reassurance', croRationale: 'Overlapping customer avatars with 4.8/5.0 stars neutralizes buyer hesitation.' },
    { section: 'H1 Headline & Subtitle', order: 5, purpose: 'Clarity of Transformation & USP', croRationale: 'Explains exactly what the product does and why it is superior in 3 seconds.' },
    { section: '4 Key Benefit Badges', order: 6, purpose: 'Scannable Feature Checkmarks', croRationale: '2x2 grid of icons reduces cognitive load on mobile devices.' },
    { section: 'Tiered Supply Bundle Selector', order: 7, purpose: 'Quantity Framing & AOV Maximization', croRationale: 'Buy 1 vs Buy 2 Get 1 Free (Most Popular) vs Buy 3 Get 2 Free (Best Value).' },
    { section: 'In-Stock Pulsing Dispatch Badge', order: 8, purpose: 'Real Scarcity & Fast Transit Reassurance', croRationale: 'Dynamic delivery date creates natural FOMO without deceptive countdowns.' },
    { section: 'High-Contrast Full-Width CTA', order: 9, purpose: 'Frictionless Action', croRationale: 'Large button with embedded price tag drives immediate conversions.' },
    { section: '30-Day Guarantee & Trust Icons', order: 10, purpose: 'Risk Reversal', croRationale: 'Zero-risk trial guarantee removes the final hesitation barrier.' },
    { section: 'Express COD Form or DTC Checkout', order: 11, purpose: 'Frictionless Completion', croRationale: 'Simplified fields with dual phone numbers and 58 Wilayas fee auto-calc.' },
    { section: 'Verified Reviews & FAQ Accordion', order: 12, purpose: 'Objection Handling', croRationale: 'Resolves remaining shipping and inspection questions before bounce.' },
  ];

  return {
    productIntelligence: {
      visualAnalysis: `Premium packshot presentation with clean packaging aesthetics, distinctive form factor, and ergonomic usability suitable for DTC and COD direct response.`,
      functionalClassification: category,
      materialsBuild: `Certified high-durability construction with medical-grade/food-grade components engineered for repeatable daily use.`,
      emotionalAppeal: `Provides instant relief, aesthetic pride, and confidence, removing daily frustration and recurring external expenses.`,
      perceivedValue: `Positioned at 2.5x higher perceived value than wholesale cost, justifying ${tier1Price} retail anchor.`,
    },
    marketAnalysis: {
      categoryDynamics: `Rapidly growing consumer demand in ${category} fueled by mobile social commerce (TikTok, Meta, Reels).`,
      marketOpportunityScore: 94,
      competitorLandscape: `Generic competitors lack strong brand identity, local language copy, and transparent inspection rights.`,
      saturationLevel: `Moderate saturation in low-quality knockoffs; high blue-ocean opportunity for verified original branding.`,
    },
    targetAudience: {
      demographics: `Men & Women aged 25-55, mobile-first shoppers across metropolitan and regional wilayas.`,
      psychographics: `Value-conscious, convenience-seeking, cautious about quality, responsive to visual proof and risk-free trial.`,
      awarenessLevel: 'Problem-Aware',
      buyingMindset: `Prefers cash payment after physical package inspection; highly incentivized by multi-unit bundle savings.`,
    },
    customerAvatars,
    brandIdentity: {
      archetype,
      toneOfVoice: isArabic ? 'واثق، مهني، مباشر، ومطمئن' : 'Authoritative, Reassuring, Premium, and Direct',
      positioningStatement: `The #1 verified original ${name} delivering proven daily performance with 100% satisfaction guarantee.`,
      emotionalTerritory,
    },
    brandNames,
    logoConcept: {
      visualConcept: `Minimalist modern wordmark with clean geometric lettering and an embedded checkmark/shield accent.`,
      typographyDirection: isArabic ? 'Cairo font with bold weights' : 'Plus Jakarta Sans / Inter with bold geometric tracking',
      iconography: `Rounded duotone icons reflecting durability, safety, and certified authenticity.`,
      packagingPlacement: `Prominently debossed on center packshot face with high-contrast metallic or white foil finish.`,
    },
    colorPalette: {
      primaryHex,
      secondaryHex: '#1e293b',
      accentHex,
      backgroundHex: '#fafafa',
      textDarkHex: '#090d16',
      psychologicalJustification: `Deep primary conveys clinical authority and strength; warm accent draws focus to primary action buttons.`,
    },
    marketingAngles,
    usp: {
      primaryUSP: isArabic
        ? `المنتج الأصلي المعتمد الأعلى تقييماً مع حق فحص الطرد والدفع بعد المعاينة لـ 58 ولاية`
        : `#1 Certified Original Performance with Guaranteed Inspection Before Payment and Fast Dispatch`,
      supportingPoints: [
        isArabic ? 'فعالية مثبتة وتأثير فوري من أول استعمال' : 'Immediate noticeable difference on day one',
        isArabic ? 'تصميم متين يدوم طويلاً مع ضمان استبدال رسمي' : 'Heavy-duty long-lasting build with replacement warranty',
        isArabic ? 'توفير حقيقي مع عروض الحزم المزدوجة والشحن السريع' : 'High-savings bundle options with express delivery',
      ],
      antiObjectionClaim: isArabic
        ? 'لا تدفع أي دينار مسبقاً — تفحص طردك بالكامل أمام الموزع قبل استلامه'
        : 'Zero upfront risk — 100% cash on delivery with parcel inspection rights',
    },
    offerStrategy,
    pricingStrategy,
    bundleEconomics,
    pageArchitecture,
    designDirection: {
      visualStyle: 'Modern DTC High-Converting Mobile-First (Inspired by Earthwise / Goodroots / Puravita / Uvora)',
      heroLayout: 'Packshot centered with curved backdrop and flanking floating benefit pills',
      mobileOptimizations: [
        'Sticky bottom CTA bar on mobile viewport',
        'Large tap targets for bundle cards',
        'Auto-filling Wilaya delivery calculations',
        'Lightweight fast-loading WebP assets',
      ],
      trustTriggers: [
        'Overlapping customer avatars with 4.8/5.0 stars',
        '30-Day Money-Back Guarantee box',
        'Circular certifications row (Heavy Metal Free, Vegan, 100% Original)',
        'Live in-stock pulsing indicator',
      ],
    },
  };
}
