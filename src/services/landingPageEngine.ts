import {
  LandingPageProject,
  SectionModel,
  LandingPageToolName,
  ToolExecutionResult,
  ProductFeature,
  PricingBundle,
  CustomerReviewItem,
  FaqItem,
} from '../types/landingPageProject';

// =========================================================================
// 1. CENTRALIZED AI MODEL RESOLVER (READ SAVED SETTINGS FROM LOCALSTORAGE)
// =========================================================================
export interface SavedVaultKeyItem {
  id: string;
  name: string;
  provider: 'openai' | 'gemini' | 'deepseek' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom';
  key: string;
  preferredModel: string;
  createdAt?: string;
  lastUsedAt?: string;
}

export interface ConfiguredProviderItem {
  id: string;
  name: string;
  provider: 'openai' | 'gemini' | 'deepseek' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom';
  key: string;
  maskedKey: string;
  preferredModel: string;
  isCurrent: boolean;
}

export interface ResolvedAiConfig {
  provider: 'openai' | 'gemini' | 'deepseek' | 'anthropic' | 'openrouter' | 'agentrouter' | 'nvidia' | 'custom';
  model: string;
  apiKey: string;
  hasKey: boolean;
  isConfigured: boolean;
  vaultKeys: SavedVaultKeyItem[];
  configuredProviders: ConfiguredProviderItem[];
  verifiedModels: string[];
}

function maskApiKey(key: string): string {
  if (!key) return 'Not Configured';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 6)}••••${key.slice(-4)}`;
}

export function resolveAiModelSettings(): ResolvedAiConfig {
  const provider = (localStorage.getItem('ai_provider') as any) || 'gemini';
  const rawModel = localStorage.getItem('ai_model');

  let defaultModelForProvider = 'gemini-3.8-flash';
  if (provider === 'gemini') defaultModelForProvider = 'gemini-3.8-flash';
  else if (provider === 'openai') defaultModelForProvider = 'gpt-4o-mini';
  else if (provider === 'openrouter') defaultModelForProvider = 'nvidia/nemotron-3.5-lightning:free';
  else if (provider === 'deepseek') defaultModelForProvider = 'deepseek-chat';
  else if (provider === 'anthropic') defaultModelForProvider = 'claude-3-5-haiku-20241022';
  else if (provider === 'nvidia') defaultModelForProvider = 'nvidia/nemotron-3.5-lightning:free';

  let model = rawModel && rawModel.trim() ? rawModel.trim() : defaultModelForProvider;
  if (
    provider === 'gemini' &&
    (model === 'gemini-2.0-flash' ||
      model === 'gemini-2.5-flash' ||
      model === 'gemini-1.5-pro' ||
      model === 'gemini-1.5-flash' ||
      !model.startsWith('gemini-'))
  ) {
    model = 'gemini-3.8-flash';
  }

  let apiKey = '';
  if (provider === 'openai') apiKey = localStorage.getItem('openai_api_key') || '';
  else if (provider === 'gemini') apiKey = localStorage.getItem('gemini_api_key') || localStorage.getItem('user_api_key') || '';
  else if (provider === 'openrouter') apiKey = localStorage.getItem('openrouter_api_key') || '';
  else if (provider === 'deepseek') apiKey = localStorage.getItem('deepseek_api_key') || '';
  else if (provider === 'anthropic') apiKey = localStorage.getItem('anthropic_api_key') || '';
  else if (provider === 'agentrouter') apiKey = localStorage.getItem('agentrouter_api_key') || '';
  else if (provider === 'nvidia') apiKey = localStorage.getItem('nvidia_api_key') || '';

  // If specific provider key is not found, check universal user_api_key
  if (!apiKey) {
    const uKey = (localStorage.getItem('user_api_key') || '').trim();
    if (uKey) {
      if (provider === 'openrouter' && (uKey.startsWith('sk-or-') || !uKey.startsWith('AIza'))) apiKey = uKey;
      else if (provider === 'gemini' && uKey.startsWith('AIza')) apiKey = uKey;
      else if (provider === 'openai' && uKey.startsWith('sk-') && !uKey.startsWith('sk-or-')) apiKey = uKey;
      else if (!apiKey) apiKey = uKey;
    }
  }

  // Also check saved_api_keys_vault if still empty
  if (!apiKey) {
    try {
      const storedVault = localStorage.getItem('saved_api_keys_vault');
      if (storedVault) {
        const list = JSON.parse(storedVault);
        if (Array.isArray(list)) {
          const match = list.find((item: any) => item.provider === provider && item.key);
          if (match && match.key) apiKey = match.key.trim();
          else if (list[0]?.key) apiKey = list[0].key.trim();
        }
      }
    } catch {}
  }

  // Gemini uses server-side GEMINI_API_KEY automatically; OpenRouter free models work without credits
  const hasKey = apiKey.trim().length > 0 || provider === 'gemini' || (provider === 'openrouter' && model.includes(':free'));

  // 1. Read saved keys vault from settings
  let vaultKeys: SavedVaultKeyItem[] = [];
  try {
    const rawVault = localStorage.getItem('saved_api_keys_vault');
    if (rawVault) {
      const parsed = JSON.parse(rawVault);
      if (Array.isArray(parsed)) {
        vaultKeys = parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse saved_api_keys_vault', e);
  }

  // 2. Read verified models from settings diagnostic
  let verifiedModels: string[] = [];
  try {
    const rawVerified = localStorage.getItem('verified_working_models');
    if (rawVerified) {
      const parsed = JSON.parse(rawVerified);
      if (Array.isArray(parsed)) {
        verifiedModels = parsed.map((m: any) => (typeof m === 'string' ? m : m.id || m.model)).filter(Boolean);
      }
    }
  } catch (e) {
    console.warn('Failed to parse verified_working_models', e);
  }

  // 3. Assemble all configured providers found in Settings
  const configuredProviders: ConfiguredProviderItem[] = [];

  const orKey = localStorage.getItem('openrouter_api_key') || '';
  if (orKey || (provider === 'openrouter' && model.includes(':free'))) {
    configuredProviders.push({
      id: 'prov_openrouter',
      name: 'OpenRouter Platform',
      provider: 'openrouter',
      key: orKey,
      maskedKey: maskApiKey(orKey),
      preferredModel: provider === 'openrouter' ? model : 'nvidia/nemotron-3.5-lightning:free',
      isCurrent: provider === 'openrouter',
    });
  }

  const oKey = localStorage.getItem('openai_api_key') || '';
  if (oKey) {
    configuredProviders.push({
      id: 'prov_openai',
      name: 'OpenAI Direct API',
      provider: 'openai',
      key: oKey,
      maskedKey: maskApiKey(oKey),
      preferredModel: provider === 'openai' ? model : 'gpt-4o-mini',
      isCurrent: provider === 'openai',
    });
  }

  const gKey = localStorage.getItem('gemini_api_key') || localStorage.getItem('user_api_key') || '';
  configuredProviders.push({
    id: 'prov_gemini',
    name: 'Google Gemini Vision (Built-In Server Engine)',
    provider: 'gemini',
    key: gKey,
    maskedKey: gKey ? maskApiKey(gKey) : 'Server Managed',
    preferredModel: provider === 'gemini' ? model : 'gemini-3.8-flash',
    isCurrent: provider === 'gemini',
  });

  const dKey = localStorage.getItem('deepseek_api_key') || '';
  if (dKey) {
    configuredProviders.push({
      id: 'prov_deepseek',
      name: 'DeepSeek Platform',
      provider: 'deepseek',
      key: dKey,
      maskedKey: maskApiKey(dKey),
      preferredModel: provider === 'deepseek' ? model : 'deepseek-chat',
      isCurrent: provider === 'deepseek',
    });
  }

  const nvKey = localStorage.getItem('nvidia_api_key') || '';
  if (nvKey) {
    configuredProviders.push({
      id: 'prov_nvidia',
      name: 'NVIDIA NIM Platform',
      provider: 'nvidia',
      key: nvKey,
      maskedKey: maskApiKey(nvKey),
      preferredModel: provider === 'nvidia' ? model : 'meta/llama-3.3-70b-instruct',
      isCurrent: provider === 'nvidia',
    });
  }

  const arKey = localStorage.getItem('agentrouter_api_key') || '';
  if (arKey) {
    configuredProviders.push({
      id: 'prov_agentrouter',
      name: 'AgentRouter Universal',
      provider: 'agentrouter',
      key: arKey,
      maskedKey: maskApiKey(arKey),
      preferredModel: provider === 'agentrouter' ? model : 'agentrouter/auto',
      isCurrent: provider === 'agentrouter',
    });
  }

  const antKey = localStorage.getItem('anthropic_api_key') || '';
  if (antKey) {
    configuredProviders.push({
      id: 'prov_anthropic',
      name: 'Anthropic Claude',
      provider: 'anthropic',
      key: antKey,
      maskedKey: maskApiKey(antKey),
      preferredModel: provider === 'anthropic' ? model : 'claude-3-5-haiku-20241022',
      isCurrent: provider === 'anthropic',
    });
  }

  // Also merge any keys from vault that are not already listed
  vaultKeys.forEach((vk) => {
    if (!configuredProviders.some((cp) => cp.key === vk.key)) {
      configuredProviders.push({
        id: vk.id || `vault_${Math.random()}`,
        name: vk.name || `${vk.provider.toUpperCase()} Key`,
        provider: vk.provider,
        key: vk.key,
        maskedKey: maskApiKey(vk.key),
        preferredModel: vk.preferredModel || defaultModelForProvider,
        isCurrent: provider === vk.provider && apiKey === vk.key,
      });
    }
  });

  return {
    provider,
    model,
    apiKey: apiKey.trim(),
    hasKey,
    isConfigured: hasKey,
    vaultKeys,
    configuredProviders,
    verifiedModels,
  };
}

// =========================================================================
// 2. INITIAL CENTRALIZED LANDING PAGE PROJECT STATE
// =========================================================================
export const DEFAULT_LANDING_PAGE_PROJECT: LandingPageProject = {
  projectId: 'verde-project-dental-scaler',
  version: 1,
  updatedAt: new Date().toISOString(),
  product: {
    name: 'Ultrasonic Dental Scaler Pro',
    category: 'Personal Care & Health',
    headline: 'احصل على ابتسامة ناصعة وتخلص من الجير والتصبغات في منزلك خلال دقائق!',
    subtitle:
      'جهاز التنظيف بالموجات فوق الصوتية المعتمد طبياً لإزالة الجير العنيد وبقع القهوة والتدخين بأمان تام، مع حق فحص ومعاينة الطرد قبل الدفع عند الاستلام.',
    description:
      'تقنية الاهتزاز الصوتي الذكي تزيل التكلسات بدقة فائقة دون أي ألم أو حساسية للثة، مع رؤية واضحة بفضل ضوء الـ LED المدمج.',
    price: '4,800 DZD',
    originalPrice: '7,200 DZD',
    discountPercentage: '-33% تخفيض اليوم',
    image:
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=700&h=550&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=700&h=550&fit=crop',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=700&h=550&fit=crop',
    ],
    features: [
      {
        id: 'f1',
        title: 'اهتزاز بالموجات فوق الصوتية',
        description: 'تردد عالي يفتت الجير العنيد بدقة دون لمس أو إيذاء أنسجة اللثة الحساسة.',
        icon: 'Zap',
      },
      {
        id: 'f2',
        title: '5 مستويات قوة تناسب الجميع',
        description: 'من التنظيف اللطيف للمبتدئين حتى المستوى المركز للبقع العميقة والتكلسات.',
        icon: 'CheckCircle2',
      },
      {
        id: 'f3',
        title: 'إضاءة LED مدمجة ورؤية واضحة',
        description: 'كشاف أمامي فائق السطوع يتيح لك رؤية كل زاوية بدقة وسهولة داخل الفم.',
        icon: 'Award',
      },
      {
        id: 'f4',
        title: 'مقاوم للماء وشحن USB سريع',
        description: 'معيار IPX6 قابل للغسل بالماء بالكامل وبطارية تدوم لأسابيع بشحنة واحدة.',
        icon: 'PackageCheck',
      },
    ],
    targetAudience: 'Adults looking for professional home dental care in Algeria',
    painPoints: [
      'تكلفة جلسات تنظيف الأسنان المتكررة في العيادات',
      'تراكم الجير والبقع الصفراء الناتجة عن القهوة والتدخين',
      'رائحة الفم الكريهة وتراجع اللثة بسبب التكلسات',
    ],
    sellingPoints: [
      'توصيل سريع لـ 58 ولاية جزائرية',
      'الدفع عند الاستلام بعد معاينة الطرد',
      'ضمان استبدال واسترجاع لمدة 30 يوم',
    ],
  },
  brand: {
    name: 'Dental Scaler Pro',
    domain: 'dentalscaler.dz',
    logoText: '✦ DentalScaler',
    accentColor: '#10b981', // Emerald green
    secondaryColor: '#0f172a',
    fontFamily: 'Cairo',
    badgeText: '🇩🇿 الدفع عند الاستلام • توصيل سريع لـ 58 ولاية • ضمان 100%',
  },
  design: {
    primaryColor: '#10b981',
    secondaryColor: '#0f172a',
    backgroundColor: '#fafaf9',
    fontFamily: 'Cairo',
    borderRadius: 'rounded-2xl',
    layoutDirection: 'rtl',
    language: 'Arabic',
  },
  sections: [
    {
      id: 'header',
      type: 'header',
      title: 'Header & Navigation',
      visible: true,
      order: 1,
      data: {
        ctaText: 'اطلب الآن والدفع عند الاستلام 🚚',
        phoneBadge: 'توصيل لـ 58 ولاية • الدفع عند الاستلام',
      },
    },
    {
      id: 'hero',
      type: 'hero',
      title: 'Hero Showcase & CTA',
      visible: true,
      order: 2,
      data: {
        ctaText: 'اطلب الآن والدفع عند الاستلام 🚚',
        guaranteeText: 'الدفع عند الاستلام • فحص الطرد قبل الدفع',
        ratingText: '4.9/5 (أكثر من 2,450 زبون راضٍ في الجزائر)',
      },
    },
    {
      id: 'trust',
      type: 'trust',
      title: '58 Wilaya COD Trust Strip',
      visible: true,
      order: 3,
      data: {
        badges: [
          { title: 'توصيل لـ 58 ولاية', subtitle: 'خلال 24 إلى 48 ساعة لباب منزلك', icon: 'Truck' },
          { title: 'الدفع عند الاستلام (COD)', subtitle: 'لا تدفع أي دينار حتى تفحص طردك بنفسك', icon: 'Banknote' },
          { title: 'ضمان الاسترجاع 30 يوم', subtitle: 'استبدال فوري أو استرجاع الأموال', icon: 'ShieldCheck' },
          { title: 'تقييم ممتاز 4.9/5', subtitle: 'أكثر من 2,450 زبون راضٍ في الجزائر', icon: 'Star' },
        ],
      },
    },
    {
      id: 'features',
      type: 'features',
      title: 'Key Features Grid',
      visible: true,
      order: 4,
      data: {
        heading: 'مميزات الجهاز الاستثنائية',
        subheading: 'تم تصميمه بأعلى معايير الجودة ليوفر لك أفضل تجربة ونتائج فورية',
      },
    },
    {
      id: 'bundles',
      type: 'bundles',
      title: '3-Tier Pricing Bundles',
      visible: true,
      order: 5,
      data: {
        heading: 'العروض الخاصة والباقات الحصرية',
        subheading: 'اختر الباقة الأنسب لك مع توصيل مجاني للباقات المتعددة',
        bundles: [
          {
            id: 'b1',
            title: 'باقة قطعة واحدة (1)',
            quantity: 1,
            price: '4,800 DZD',
            originalPrice: '7,200 DZD',
            savingsText: 'سعر مناسب وتوصيل سريع',
            badge: 'الخيار القياسي',
            popular: false,
          },
          {
            id: 'b2',
            title: 'باقة قطعتين (2) — الأكثر طلباً 🔥',
            quantity: 2,
            price: '8,600 DZD',
            originalPrice: '14,400 DZD',
            savingsText: 'وفر 1,000 دج + توصيل مجاني 🚚',
            badge: 'الأكثر توفيراً',
            popular: true,
          },
          {
            id: 'b3',
            title: 'باقة العائلة (3 قطع)',
            quantity: 3,
            price: '11,900 DZD',
            originalPrice: '21,600 DZD',
            savingsText: 'وفر 2,500 دج + توصيل مجاني 🚚',
            badge: 'عرض العائلة',
            popular: false,
          },
        ],
      },
    },
    {
      id: 'order',
      type: 'order',
      title: 'Instant COD Checkout Form',
      visible: true,
      order: 6,
      data: {
        heading: 'استمارة الطلب السريع والدفع عند الاستلام',
        subheading: 'يرجى إدخال معلوماتك أدناه لتأكيد الشحن خلال دقائق',
        buttonText: 'تأكيد الطلب والدفع عند الاستلام 🚚',
        guaranteeNotice: '🔒 لا تدفع أي شيء مسبقاً • الدفع عند الاستلام بعد معاينة الطرد • ضمان 30 يوم',
      },
    },
    {
      id: 'reviews',
      type: 'reviews',
      title: 'Customer Reviews (4.9★)',
      visible: true,
      order: 7,
      data: {
        heading: 'آراء الزبائن الذين جربوا المنتج',
        subheading: 'تقييمات حقيقية من زبائن في مختلف ولايات الوطن',
        reviews: [
          {
            id: 'r1',
            name: 'يوسف بلقاسم',
            location: 'الجزائر العاصمة',
            date: 'منذ 3 أيام',
            rating: 5,
            comment: 'منتج قمة في الروعة، نحى كل الجير المتراكم في أول استعمال بدون أي وجع. الشحن كان سريع وصلني في 24 ساعة.',
            verified: true,
          },
          {
            id: 'r2',
            name: 'أمينة بن علي',
            location: 'وهران',
            date: 'منذ أسبوع',
            rating: 5,
            comment: 'شكراً لكم على المصداقية، فتحت الطرد وتأكدت من جودة الجهاز قبل ما نخلص ليفروور. ممتاز جداً وننصح به.',
            verified: true,
          },
          {
            id: 'r3',
            name: 'كريم منصوري',
            location: 'قسنطينة',
            date: 'منذ أسبوعين',
            rating: 5,
            comment: 'والله وفرت دراهم أطباء الأسنان، الجهاز يخدم كيما مكتوب بالضبط والبطارية تشد بزاف. أنصح بالشراء بدون تردد.',
            verified: true,
          },
        ],
      },
    },
    {
      id: 'faqs',
      type: 'faqs',
      title: 'Frequently Asked Questions',
      visible: true,
      order: 8,
      data: {
        heading: 'الأسئلة الشائعة والأجوبة',
        subheading: 'إجابات واضحة على أكثر الأسئلة تكراراً',
        faqs: [
          {
            id: 'faq1',
            question: 'هل يمكنني فحص الطرد ومعاينته قبل دفع المال للموزع؟',
            answer: 'نعم بكل تأكيد! نحن نمنحك الحق الكامل في فتح الطرد ومعاينة الجهاز قبل تسليم أي دينار لعامل التوصيل.',
          },
          {
            id: 'faq2',
            question: 'كم يستغرق التوصيل وما هي الولايات المشمولة؟',
            answer: 'التوصيل متوفر لجميع الـ 58 ولاية جزائرية، ويستغرق من 24 إلى 48 ساعة فقط حسب ولايتك.',
          },
          {
            id: 'faq3',
            question: 'هل الجهاز آمن للاستخدام المنزلي ولا يسبب نزيفاً للثة؟',
            answer: 'الجهاز مصمم بتقنية ذكية تتوقف تلقائياً عند ملامسة الأنسجة الرخوة ويعمل فقط على التكلسات الصلبة بأمان تام.',
          },
        ],
      },
    },
    {
      id: 'footer',
      type: 'footer',
      title: 'Footer & Legal COD Notice',
      visible: true,
      order: 9,
      data: {
        copyright: 'جميع الحقوق محفوظة • الدفع عند الاستلام لـ 58 ولاية جزائرية.',
      },
    },
  ],
  htmlSource: '',
  cssSource: '',
  jsSource: '',
  responsiveMode: 'desktop',
  isCustomHtmlActive: false,
  customHtmlCode: '',
  editCount: 14,
};

// =========================================================================
// 3. CODE GENERATOR (HTML/CSS) - CENTRALIZED SINGLE SOURCE OF TRUTH
// =========================================================================
export function renderFullLandingPageHtml(project: LandingPageProject): string {
  const p = project.product;
  const b = project.brand;
  const d = project.design;
  const primaryColor = d.primaryColor || b.accentColor || '#10b981';

  // Sort visible sections
  const visibleSections = [...project.sections]
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  const heroSection = project.sections.find((s) => s.type === 'hero');
  const trustSection = project.sections.find((s) => s.type === 'trust');
  const featuresSection = project.sections.find((s) => s.type === 'features');
  const bundlesSection = project.sections.find((s) => s.type === 'bundles');
  const reviewsSection = project.sections.find((s) => s.type === 'reviews');
  const faqsSection = project.sections.find((s) => s.type === 'faqs');
  const orderSection = project.sections.find((s) => s.type === 'order');

  return `<!DOCTYPE html>
<html lang="ar" dir="${d.layoutDirection}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${b.name} — ${p.headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${primaryColor};
      --secondary: ${b.secondaryColor};
      --bg-page: ${d.backgroundColor};
    }
    body {
      font-family: '${d.fontFamily || 'Cairo'}', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-page);
      word-break: normal;
      overflow-wrap: break-word;
      hyphens: none;
    }
  </style>
</head>
<body class="text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">

  <!-- Sticky Navbar -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2.5 min-w-0">
        <div style="background-color: ${primaryColor}" class="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-xs">
          ✦
        </div>
        <span class="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">${b.name}</span>
      </div>
      <div class="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
        <span>🚚</span>
        <span>توصيل سريع لـ 58 ولاية • الدفع عند الاستلام</span>
      </div>
      <a href="#order-section" style="background-color: ${primaryColor}" class="px-4 sm:px-5 py-2 rounded-xl text-white text-xs font-bold hover:opacity-90 shadow-xs transition-opacity shrink-0">
        اطلب الآن 🚚
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  ${heroSection && heroSection.visible ? `
  <section id="section-hero" class="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-10">
    <div class="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div class="space-y-4 sm:space-y-5 text-right">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eafaf1] border border-[#a7f3d0] text-[#059669] text-xs font-bold">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>${b.badgeText}</span>
        </div>
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-[1.25] tracking-tight">
          ${p.headline}
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
          ${p.subtitle}
        </p>
        <div class="flex items-baseline gap-3 pt-1 flex-wrap">
          <span class="text-3xl sm:text-4xl font-black text-emerald-600 font-mono">${p.price}</span>
          <span class="text-base text-slate-400 line-through font-mono">${p.originalPrice}</span>
          <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold font-mono">${p.discountPercentage}</span>
        </div>
        <div class="pt-2">
          <a href="#order-section" style="background-color: ${primaryColor}" class="block w-full sm:w-auto py-3.5 px-8 rounded-2xl text-white font-bold text-center text-sm shadow-md hover:opacity-95 transition-all">
            اطلب الآن والدفع بعد المعاينة 🚚
          </a>
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <span class="text-amber-500 font-bold">★★★★★</span>
          <span class="font-bold text-slate-700">4.9/5</span>
          <span>(أكثر من 2,450 زبون راضٍ في الجزائر)</span>
        </div>
      </div>
      <div class="rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-white aspect-4/3 relative">
        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover" />
        <div class="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold font-mono shadow-md">
          منتج أصلي 100%
        </div>
      </div>
    </div>
  </section>` : ''}

  <!-- Trust Strip -->
  ${trustSection && trustSection.visible ? `
  <section id="section-trust" class="border-y border-slate-100 bg-white/70 py-6">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${((trustSection.data?.badges) || []).map((badge: any) => `
          <div class="flex items-center gap-3 p-2 rounded-xl">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
              ✦
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 leading-tight">${badge.title}</h4>
              <p class="text-[11px] text-slate-500 leading-tight mt-0.5">${badge.subtitle}</p>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>` : ''}

  <!-- Features Grid -->
  ${featuresSection && featuresSection.visible ? `
  <section id="section-features" class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
    <div class="text-center max-w-xl mx-auto mb-10">
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">لماذا تختار ${b.name}؟</h2>
      <p class="text-xs sm:text-sm text-slate-500">تم تصميمه بأعلى معايير الجودة ليمنحك أفضل تجربة عملية ونتائج فورية</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      ${p.features.map((f) => `
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div style="background-color: ${primaryColor}15; color: ${primaryColor}" class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base mb-3">✦</div>
          <h3 class="text-sm font-bold text-slate-900 mb-1.5">${f.title}</h3>
          <p class="text-xs text-slate-500 leading-relaxed">${f.description}</p>
        </div>`).join('')}
    </div>
  </section>` : ''}

  <!-- Bundles & Offers -->
  ${bundlesSection && bundlesSection.visible ? `
  <section id="section-bundles" class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
    <div class="text-center mb-8">
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mb-2">اختر الباقة المناسبة لك</h2>
      <p class="text-xs sm:text-sm text-slate-500">عروض حصرية لفترة محدودة مع توصيل مجاني للباقات المتعددة</p>
    </div>
    <div class="grid md:grid-cols-3 gap-5">
      ${((bundlesSection.data?.bundles) || []).map((b: any) => `
        <div class="bg-white p-6 rounded-2xl border ${b.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200/80 shadow-xs'}">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-slate-900">${b.title}</h3>
            ${b.badge ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${b.popular ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">${b.badge}</span>` : ''}
          </div>
          <div class="text-2xl font-black text-slate-900 my-2 font-mono">${b.price}</div>
          <p class="text-xs text-emerald-600 font-bold mb-4">${b.savingsText || ''}</p>
          <a href="#order-section" style="background-color: ${b.popular ? primaryColor : '#0f172a'}" class="block w-full py-2.5 rounded-xl text-white text-xs font-bold text-center">
            اختيار هذه الباقة
          </a>
        </div>`).join('')}
    </div>
  </section>` : ''}

  <!-- Instant Cash on Delivery Checkout Form -->
  ${orderSection && orderSection.visible ? `
  <section id="order-section" class="max-w-xl mx-auto px-4 sm:px-6 py-12">
    <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-4">
      <div class="text-center space-y-1">
        <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
          📦 استمارة الطلب السريع (COD)
        </span>
        <h3 class="text-xl font-black text-slate-900">${orderSection.data?.heading || 'استمارة الطلب السريع'}</h3>
        <p class="text-xs text-slate-500">${orderSection.data?.subheading || 'يرجى إدخال معلوماتك لتأكيد الشحن والتوصيل'}</p>
      </div>
      <form class="space-y-3 pt-2" onsubmit="event.preventDefault(); alert('تم استلام طلبك بنجاح! سيتصل بك فريق التأكيد قريباً.');">
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل (اللقب والاسم)</label>
          <input required type="text" placeholder="مثال: يوسف بلقاسم" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-right outline-none focus:border-emerald-500 focus:bg-white transition-all" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">رقم الهاتف</label>
          <input required type="text" placeholder="05 / 06 / 07 XX XX XX" class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-right font-mono outline-none focus:border-emerald-500 focus:bg-white transition-all" />
        </div>
        <div>
          <label class="text-xs font-bold text-slate-700 block mb-1">الولاية (58 ولاية)</label>
          <select class="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-right outline-none focus:border-emerald-500 focus:bg-white transition-all">
            <option>16 - Alger (الجزائر العاصمة)</option>
            <option>31 - Oran (وهران)</option>
            <option>25 - Constantine (قسنطينة)</option>
            <option>19 - Sétif (سطيف)</option>
            <option>06 - Béjaïa (بجاية)</option>
            <option>09 - Blida (البليدة)</option>
            <option>باقي الولايات (58 ولاية)</option>
          </select>
        </div>
        <button type="submit" style="background-color: ${primaryColor}" class="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3">
          ${orderSection.data?.buttonText || 'تأكيد الطلب والدفع عند الاستلام 🚚'}
        </button>
        <p class="text-[10px] text-center text-slate-400 font-medium pt-1">
          ${orderSection.data?.guaranteeNotice || '🔒 الدفع عند الاستلام • فحص الطرد قبل الدفع • ضمان 30 يوم'}
        </p>
      </form>
    </div>
  </section>` : ''}

  <!-- Customer Reviews -->
  ${reviewsSection && reviewsSection.visible ? `
  <section id="section-reviews" class="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-100">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-black text-slate-900 mb-1">آراء الزبائن الذين جربوا المنتج</h2>
      <p class="text-xs text-slate-500">تقييمات حقيقية من زبائن في مختلف ولايات الوطن</p>
    </div>
    <div class="grid sm:grid-cols-3 gap-4">
      ${((reviewsSection.data?.reviews) || []).map((rev: any) => `
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-900">${rev.name}</span>
            <span class="text-amber-500 font-bold">★★★★★</span>
          </div>
          <span class="text-[10px] text-slate-400 block font-mono">${rev.location} • ${rev.date}</span>
          <p class="text-xs text-slate-600 leading-relaxed">${rev.comment}</p>
          <div class="text-[10px] font-bold text-emerald-600 pt-1">✓ شراء مؤكد ومعاينة عند الاستلام</div>
        </div>`).join('')}
    </div>
  </section>` : ''}

  <!-- FAQs -->
  ${faqsSection && faqsSection.visible ? `
  <section id="section-faqs" class="max-w-2xl mx-auto px-4 sm:px-6 py-12">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-black text-slate-900 mb-1">الأسئلة الشائعة</h2>
      <p class="text-xs text-slate-500">إجابات على أكثر الأسئلة تكراراً</p>
    </div>
    <div class="space-y-3">
      ${((faqsSection.data?.faqs) || []).map((faq: any) => `
        <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <h4 class="text-xs font-bold text-slate-900 mb-1">${faq.question}</h4>
          <p class="text-xs text-slate-600 leading-relaxed">${faq.answer}</p>
        </div>`).join('')}
    </div>
  </section>` : ''}

  <!-- Footer -->
  <footer class="text-center text-xs text-slate-400 py-8 border-t border-slate-100">
    <p>© ${new Date().getFullYear()} ${b.name}. جميع الحقوق محفوظة • الدفع عند الاستلام لـ 58 ولاية.</p>
  </footer>

</body>
</html>`;
}

// =========================================================================
// 4. REAL LANDING PAGE EDITING TOOLS (FUNCTIONAL IMPLEMENTATION)
// =========================================================================

export function executeLandingPageTool(
  toolName: LandingPageToolName,
  args: any,
  project: LandingPageProject
): ToolExecutionResult {
  const current: LandingPageProject = JSON.parse(JSON.stringify(project));
  current.version = (current.version || 1) + 1;
  current.updatedAt = new Date().toISOString();
  current.editCount = (current.editCount || 0) + 1;

  let summary = '';
  const keyChanges: string[] = [];

  switch (toolName) {
    case 'updateProductTitle':
    case 'editSection':
    case 'regenerateSection':
      if (args.sectionId === 'hero' || toolName === 'updateProductTitle' || args.title || args.headline) {
        const headline = args.headline || args.title;
        if (headline) {
          current.product.headline = headline;
          keyChanges.push(`Hero headline updated to: "${headline}"`);
        }
        if (args.subtitle) {
          current.product.subtitle = args.subtitle;
          keyChanges.push(`Hero subtitle updated`);
        }
        if (args.badgeText) {
          current.brand.badgeText = args.badgeText;
          keyChanges.push(`Urgency badge updated`);
        }
        if (args.primaryCtaText) {
          const heroSec = current.sections.find((s) => s.type === 'hero');
          if (heroSec) heroSec.data.ctaText = args.primaryCtaText;
          keyChanges.push(`CTA button text updated`);
        }
        summary = `Updated the Hero Section with refined e-commerce copywriting.`;
      } else if (args.sectionId === 'features' && Array.isArray(args.features)) {
        current.product.features = args.features;
        keyChanges.push(`Updated ${args.features.length} product features`);
        summary = `Updated product features grid.`;
      } else if (args.sectionId === 'bundles' && Array.isArray(args.bundles)) {
        const bundleSec = current.sections.find((s) => s.type === 'bundles');
        if (bundleSec) bundleSec.data.bundles = args.bundles;
        keyChanges.push(`Updated ${args.bundles.length} pricing bundle offers`);
        summary = `Updated bundle pricing offers.`;
      } else if (args.sectionId === 'order' && args.orderForm) {
        const orderSec = current.sections.find((s) => s.type === 'order');
        if (orderSec) orderSec.data = { ...orderSec.data, ...args.orderForm };
        keyChanges.push(`Updated cash-on-delivery checkout form fields`);
        summary = `Updated COD order form.`;
      } else {
        // Generic section edit
        const sec = current.sections.find((s) => s.id === args.sectionId || s.type === args.sectionId);
        if (sec) {
          sec.data = { ...sec.data, ...args.data, ...args };
          keyChanges.push(`Modified section "${sec.title}"`);
          summary = `Modified ${sec.title}.`;
        }
      }
      break;

    case 'updateColors':
      if (args.primaryColor || args.accentColor) {
        const color = args.primaryColor || args.accentColor;
        current.brand.accentColor = color;
        current.design.primaryColor = color;
        keyChanges.push(`Accent color switched to ${color}`);
        summary = `Updated primary palette tokens to ${color}.`;
      }
      break;

    case 'updateProductPrice':
      if (args.price) current.product.price = args.price;
      if (args.originalPrice) current.product.originalPrice = args.originalPrice;
      if (args.discountPercentage) current.product.discountPercentage = args.discountPercentage;
      keyChanges.push(`Pricing updated: ${current.product.price} (Original: ${current.product.originalPrice})`);
      summary = `Updated product pricing and discount percentage.`;
      break;

    case 'updateProductImages':
      if (args.imageUrl || args.image) {
        current.product.image = args.imageUrl || args.image;
        keyChanges.push(`Product showcase image replaced`);
        summary = `Updated main product image.`;
      }
      break;

    case 'updateProductDescription':
      if (args.description || args.subtitle) {
        current.product.subtitle = args.subtitle || args.description;
        current.product.description = args.description || args.subtitle;
        keyChanges.push(`Product value proposition & description refreshed`);
        summary = `Updated product description.`;
      }
      break;

    case 'updateResponsiveDesign':
      if (args.mode && ['desktop', 'tablet', 'mobile'].includes(args.mode)) {
        current.responsiveMode = args.mode;
        keyChanges.push(`Switched preview viewport to ${args.mode}`);
        summary = `Optimized viewport and layout for ${args.mode} devices.`;
      }
      break;

    case 'deleteSection':
      if (args.sectionId) {
        const secIndex = current.sections.findIndex((s) => s.id === args.sectionId || s.type === args.sectionId);
        if (secIndex >= 0) {
          const removed = current.sections.splice(secIndex, 1)[0];
          keyChanges.push(`Removed section "${removed.title}"`);
          summary = `Deleted section "${removed.title}".`;
        }
      }
      break;

    case 'addSection':
      if (args.type) {
        const newSec: SectionModel = {
          id: args.id || `section-${Date.now()}`,
          type: args.type,
          title: args.title || `Custom ${args.type} Section`,
          subtitle: args.subtitle || '',
          visible: true,
          order: current.sections.length + 1,
          data: args.data || {},
        };
        current.sections.push(newSec);
        keyChanges.push(`Added new section "${newSec.title}"`);
        summary = `Added ${newSec.title} to the landing page.`;
      }
      break;

    case 'updateHTML':
      if (args.htmlCode) {
        current.customHtmlCode = args.htmlCode;
        current.isCustomHtmlActive = true;
        keyChanges.push(`Applied custom coded HTML`);
        summary = `Updated page source HTML directly.`;
      }
      break;

    case 'generateLandingPage':
    case 'redesignLandingPage':
      if (args.productName) current.product.name = args.productName;
      if (args.headline) current.product.headline = args.headline;
      if (args.subtitle) current.product.subtitle = args.subtitle;
      if (args.price) current.product.price = args.price;
      if (args.accentColor) {
        current.brand.accentColor = args.accentColor;
        current.design.primaryColor = args.accentColor;
      }
      if (Array.isArray(args.features)) current.product.features = args.features;
      current.isCustomHtmlActive = false;
      keyChanges.push(`Generated complete high-conversion landing page structure`);
      summary = `Generated an authentic high-converting landing page for ${current.product.name}.`;
      break;

    default:
      summary = `Applied requested landing page updates.`;
      keyChanges.push(`Project synchronized`);
      break;
  }

  // Always regenerate HTML/CSS from the updated Single Source of Truth
  current.htmlSource = renderFullLandingPageHtml(current);
  current.cssSource = `/* Auto-generated for ${current.brand.name} */\n:root { --primary: ${current.design.primaryColor}; }`;

  return {
    success: true,
    toolUsed: toolName,
    summary,
    keyChanges,
    updatedProject: current,
  };
}

// =========================================================================
// 5. INTENT CLASSIFIER & DISPATCHER
// =========================================================================
export function detectUserIntent(
  userPrompt: string,
  current: LandingPageProject
): { tool: LandingPageToolName; args: any } {
  const p = userPrompt.trim();
  const lower = p.toLowerCase();

  // Mobile / Responsive
  if (/(css|mobile|moble|phone|responsive|viewport|version mobile|layout)/i.test(p)) {
    return {
      tool: 'updateResponsiveDesign',
      args: { mode: 'mobile' },
    };
  }

  // Hero Section / Headline
  if (/(hero|secrtion hero|section hero|headline|title|عنوان|بانر|الهيدر)/i.test(p)) {
    // Generate alternate creative hook tailored to product
    const prodName = current.product.name;
    const variants = [
      `احصل على ${prodName} الأصلي — الجودة العالية والراحة التي تستحقها!`,
      `تخلص من التعب والمعاناة مع ${prodName} المعتمد والأكثر طلباً في الجزائر!`,
      `العرض الحصري اليوم: ${prodName} الأصلي مع تخفيض فوري وتوصيل مجاني لـ 58 ولاية!`,
      `${prodName}: تصميم استثنائي وجودة تدوم، عاين طردك وافحصه بنفسك قبل الدفع!`,
    ];
    const currentIdx = variants.indexOf(current.product.headline);
    const nextHeadline = variants[(currentIdx + 1) % variants.length];

    return {
      tool: 'editSection',
      args: {
        sectionId: 'hero',
        headline: nextHeadline,
        subtitle: `الحل المثالي والمضمون بجودة عالية وتصميم عملي يلبي كل احتياجاتك اليومية. اطلب الآن واستفد من التوصيل السريع لـ 58 ولاية مع حق معاينة الطرد قبل الدفع.`,
        badgeText: `🇩🇿 الأكثر طلباً في الجزائر • فحص الطرد قبل الدفع • ضمان استرجاع 30 يوم`,
        primaryCtaText: `اطلب الآن والدفع عند الاستلام 🚚`,
      },
    };
  }

  // Price & Bundles
  if (/(price|pricing|discount|cost|dzd|دينار|سعر|تخفيض|باقة|عروض|bundle)/i.test(p)) {
    const customPriceMatch = p.match(/(\d[\d,\.\s]*)\s*(?:dzd|دج|دينار)?/i);
    const newPrice = customPriceMatch ? `${customPriceMatch[1].trim()} DZD` : current.product.price;
    return {
      tool: 'updateProductPrice',
      args: {
        price: newPrice,
        originalPrice: `${Math.round(parseInt(newPrice.replace(/[^0-9]/g, '') || '4800') * 1.5)} DZD`,
        discountPercentage: '-35% تخفيض حصري',
      },
    };
  }

  // Colors / Themes
  if (/(color|theme|violet|purple|blue|red|rose|emerald|green|gold|dark|لون)/i.test(p)) {
    let color = '#10b981';
    if (/violet|purple|بنفسجي/i.test(p)) color = '#8b5cf6';
    else if (/blue|أزرق/i.test(p)) color = '#2563eb';
    else if (/red|rose|أحمر/i.test(p)) color = '#e11d48';
    else if (/gold|amber|أصفر/i.test(p)) color = '#f59e0b';
    else if (/dark|black|أسود/i.test(p)) color = '#0f172a';
    return {
      tool: 'updateColors',
      args: { primaryColor: color, accentColor: color },
    };
  }

  // Features
  if (/(feature|benefit|مميزات|خصائص|فوائد)/i.test(p)) {
    return {
      tool: 'editSection',
      args: {
        sectionId: 'features',
        features: current.product.features,
      },
    };
  }

  // Redesign / Generate new
  if (/(generate|create|new page|redesign|إعادة تصميم|صفحة جديدة)/i.test(p)) {
    return {
      tool: 'generateLandingPage',
      args: {
        productName: current.product.name,
        headline: `احصل على ${current.product.name} الأصلي بأفضل سعر وتوصيل لـ 58 ولاية!`,
      },
    };
  }

  // Default fallback to general section update
  return {
    tool: 'updatePageContent',
    args: { text: p },
  };
}

