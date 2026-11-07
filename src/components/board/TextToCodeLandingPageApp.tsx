import React, { useState, useEffect } from 'react';
import {
  Code,
  Smartphone,
  Monitor,
  Copy,
  Download,
  Check,
  Sparkles,
  RefreshCw,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ShieldCheck,
  Clock,
  ArrowRight,
  Palette,
  ExternalLink,
  Send,
  X,
  Sliders,
  Layers,
  Zap,
} from 'lucide-react';

export interface LandingPageData {
  brandName: string;
  tagline: string;
  announcementSale: string;
  announcementDiscount: string;
  subBannerText: string;
  headline: string;
  description: string;
  productImage: string;
  badgeText: string;
  ratingScore: string;
  ratingCount: string;
  benefits: string[];
  singleOptionTitle: string;
  singlePrice: string;
  bundleOptionTitle: string;
  bundlePrice: string;
  bundleFeatures: string[];
  bundleBadge: string;
  ctaText: string;
  guaranteeText: string;
  primaryColor: string; // e.g., '#e91e63'
  accentColor: string; // e.g., '#bbf7d0' or '#84cc16'
  fontFamily: 'serif' | 'sans';
  currency: string;
}

export interface TextToCodeLandingPageAppProps {
  initialData?: Partial<LandingPageData>;
  onSendToBoard?: (landingPage: LandingPageData, htmlCode: string) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

// Preset template matching image_8f6424d6.png perfectly
export const DEFAULT_THE_GOOD_DOSE_DATA: LandingPageData = {
  brandName: 'the good dose',
  tagline: '@weareunbland',
  announcementSale: 'SPRING SALE',
  announcementDiscount: 'Shop now and get up to 50% off',
  subBannerText: 'Buy 2 Get 1 Free • 30-Day Happy Gut Guarantee • Free Delivery',
  headline: 'Daily fiber that actually feels fun.',
  description:
    'A fruity daily fiber supplement made to support digestion, gut balance, and that lighter feel-good routine — without the boring wellness vibes.',
  productImage:
    '/assets/aistudio/image_8f6424d6.png',
  badgeText: '5g fiber per serving',
  ratingScore: '4.9',
  ratingCount: '1,200+ happy guts',
  benefits: ['No added sugar', 'Naturally sourced fiber', '5g fiber per serving'],
  singleOptionTitle: 'Try It Once',
  singlePrice: '$40',
  bundleOptionTitle: 'Make It Your Daily Ritual',
  bundlePrice: '$32',
  bundleFeatures: ['SAVE 20% ON EVERY DOSE', 'PAUSE OR CANCEL WHENEVER'],
  bundleBadge: 'BEST VALUE ✨',
  ctaText: 'ADD TO CART →',
  guaranteeText: 'Your 30-day feel-good trial, risk-free.',
  primaryColor: '#e11d48', // vibrant magenta/pink
  accentColor: '#bef264', // lime green
  fontFamily: 'serif',
  currency: 'USD',
};

// Preset templates for quick user experimentation
const SAMPLE_PRESETS: { name: string; tag: string; description: string; data: LandingPageData }[] = [
  {
    name: 'The Good Dose (Fruity Fiber)',
    tag: 'Image 1 Match',
    description: 'Vibrant direct response supplement page matching the reference screenshot.',
    data: DEFAULT_THE_GOOD_DOSE_DATA,
  },
  {
    name: 'SonicPro Dental Scaler (Algerian COD)',
    tag: 'COD Algeria',
    description: 'High-conversion Algerian COD page with Wilayas delivery and Arabic-French badges.',
    data: {
      brandName: 'SonicPro Algeria',
      tagline: 'Garantie 100% Satisfait ou Remboursé',
      announcementSale: 'PROMOTION SPÉCIALE 58 WILAYAS',
      announcementDiscount: 'Livraison Gratuite + Paiement à la Réception',
      subBannerText: 'توصيل مجاني لـ 58 ولاية • الدفع عند الاستلام • ضمان 12 شهر',
      headline: 'ابتسامة هوليود ناصعة في 5 دقائق في دارك.',
      description:
        'الجهاز الأصلي لإزالة الجير والتكلسات بتقنية الموجات فوق الصوتية (12,000 ذبذبة/دقيقة). تخلص من اصفرار الأسنان ورائحة الفم نهائياً وبلا وجع.',
      productImage: '/assets/aistudio/dental_scaler_pro.png',
      badgeText: '12,000 VPM Sonique',
      ratingScore: '4.95',
      ratingCount: '3,840+ عميل راضي في الجزائر',
      benefits: ['رأس تيتانيوم طبي 316', 'مقاوم للماء بالكامل IPX6', 'شحن USB-C سريع يدوم شهر'],
      singleOptionTitle: 'علبة واحدة (الجهاز + رأسين إضافيين)',
      singlePrice: '4,800 DZD',
      bundleOptionTitle: 'عرض العائلة (جهازين + 4 رؤوس مجاناً)',
      bundlePrice: '7,800 DZD',
      bundleFeatures: ['توفير 1,800 دج فوري', 'رأسين تنظيف دقيق إضافيين هدية', 'توصيل سريع مجاني لباب المنزل'],
      bundleBadge: 'الأكثر طلباً ⭐',
      ctaText: 'تأكيد الطلب الآن (الدفع عند الاستلام) ←',
      guaranteeText: 'افحص طلبيتك قبل الدفع وتأكد من الجودة 100%.',
      primaryColor: '#0284c7', // Cyan / Medical Blue
      accentColor: '#10b981', // Emerald green
      fontFamily: 'sans',
      currency: 'DZD',
    },
  },
  {
    name: 'Aura Glow Vitamin C Serum',
    tag: 'Beauty / Skincare',
    description: 'Clean luxury skincare with minimalist aesthetics and clinical proof points.',
    data: {
      brandName: 'Aura Botanics',
      tagline: 'Clean Clinical Skin Nutrition',
      announcementSale: 'LIMITED DROP',
      announcementDiscount: 'Complimentary Gua Sha Stone with Every Order',
      subBannerText: 'Dermatologist Tested • 100% Vegan & Cruelty-Free • Carbon Neutral',
      headline: 'Radiance so pure, makeup becomes optional.',
      description:
        'Triple-stabilized 15% Vitamin C blended with cold-pressed botanical oils. Visibly fades dark spots and restores luminous bounce in 14 days.',
      productImage:
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      badgeText: '15% Active Vit-C',
      ratingScore: '4.98',
      ratingCount: '4,150+ glowing reviews',
      benefits: ['Zero parabens or silicones', 'Cold-pressed Marula base', 'Noticeable glow in 7 days'],
      singleOptionTitle: '1 Month Bottle (30ml)',
      singlePrice: '$48',
      bundleOptionTitle: 'Glow Duo + Rose Quartz Stone',
      bundlePrice: '$76',
      bundleFeatures: ['SAVE $20 IMMEDIATELY', 'FREE ROSE QUARTZ GUA SHA ($28 VALUE)', 'PRIORITY SHIPPING'],
      bundleBadge: 'BEST VALUE ✨',
      ctaText: 'GET YOUR GLOW TODAY →',
      guaranteeText: '60-day empty bottle guarantee. Love it or full refund.',
      primaryColor: '#ea580c', // Warm Amber / Sunset
      accentColor: '#fbbf24', // Warm Gold
      fontFamily: 'serif',
      currency: 'USD',
    },
  },
];

export const TextToCodeLandingPageApp: React.FC<TextToCodeLandingPageAppProps> = ({
  initialData,
  onSendToBoard,
  isModal = false,
  onCloseModal,
}) => {
  // Main data state
  const [data, setData] = useState<LandingPageData>({
    ...DEFAULT_THE_GOOD_DOSE_DATA,
    ...initialData,
  });

  // User product prompt input
  const [productTextPrompt, setProductTextPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // View state: 'preview' (interactive responsive render) vs 'code' (HTML & CSS)
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'customize'>('preview');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('mobile');
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'bundle'>('bundle');
  const [quantity, setQuantity] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Live countdown timer state matching image 1
  const [countdown, setCountdown] = useState({ hours: 6, minutes: 50, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate complete standalone production HTML
  const generateStandaloneHtml = (lp: LandingPageData): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lp.brandName} - ${lp.headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #fdf2f4; }
    .font-serif-title { font-family: ${lp.fontFamily === 'serif' ? "'Playfair Display', Georgia, serif" : "'Plus Jakarta Sans', sans-serif"}; }
  </style>
</head>
<body class="min-h-screen flex justify-center py-6 px-3 bg-gradient-to-br from-amber-100 via-rose-100 to-pink-200">

  <!-- Mobile Container Mockup matching image_8f6424d6.png -->
  <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 flex flex-col">
    
    <!-- Top Announcement Bar -->
    <div style="background-color: ${lp.primaryColor};" class="text-white px-4 py-2.5 text-center flex items-center justify-between shadow-xs">
      <div class="text-left">
        <p class="text-[10px] tracking-widest font-black uppercase">${lp.announcementSale}</p>
        <p class="text-xs font-semibold">${lp.announcementDiscount}</p>
      </div>
      <div class="flex items-center gap-1 font-mono text-[11px] font-bold">
        <span class="bg-black/20 px-1.5 py-0.5 rounded">06<span class="text-[8px] block opacity-75">Hr</span></span>
        <span>:</span>
        <span class="bg-black/20 px-1.5 py-0.5 rounded">49<span class="text-[8px] block opacity-75">Min</span></span>
        <span>:</span>
        <span class="bg-black/20 px-1.5 py-0.5 rounded">22<span class="text-[8px] block opacity-75">Sec</span></span>
      </div>
    </div>

    <!-- Orange Guarantee Sub-Bar -->
    <div class="bg-amber-600 text-white text-[10px] font-bold px-3 py-1 text-center tracking-wide">
      ${lp.subBannerText}
    </div>

    <!-- Header Navigation -->
    <header class="px-5 py-3 flex items-center justify-between border-b border-rose-50">
      <button class="p-1 text-slate-700 hover:text-black">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="text-center">
        <h1 class="text-lg font-black tracking-tight text-rose-900 font-serif-title uppercase">${lp.brandName}</h1>
      </div>
      <button class="p-1 text-slate-700 hover:text-black relative">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      </button>
    </header>

    <!-- Product Image Showcase Card -->
    <div class="p-4">
      <div class="relative bg-rose-50/70 rounded-2xl p-6 flex flex-col items-center justify-center border border-rose-100/60 overflow-hidden min-h-[280px]">
        <span style="background-color: ${lp.accentColor};" class="absolute top-3 right-3 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wide">
          ${lp.badgeText}
        </span>
        <img src="${lp.productImage}" alt="${lp.headline}" class="max-h-56 max-w-full object-contain filter drop-shadow-lg" />
      </div>
    </div>

    <!-- Content & Purchase Section -->
    <div class="px-5 pb-6 space-y-4">
      <!-- Ratings -->
      <div class="flex items-center gap-1.5 text-xs text-rose-950 font-bold">
        <div class="flex text-rose-600">★★★★★</div>
        <span>${lp.ratingScore}</span>
        <span class="text-slate-400">|</span>
        <span class="text-slate-600 font-medium">${lp.ratingCount}</span>
      </div>

      <!-- Headline -->
      <h2 class="text-2xl font-black text-rose-950 leading-tight font-serif-title">
        ${lp.headline}
      </h2>

      <!-- Description -->
      <p class="text-xs text-slate-700 leading-relaxed font-normal">
        ${lp.description}
      </p>

      <!-- Benefits Pills -->
      <div class="flex flex-wrap gap-1.5 pt-1">
        ${lp.benefits
          .map(
            (b) => `
          <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-[10.5px] font-semibold">
            <span>✓</span>
            <span>${b}</span>
          </div>`
          )
          .join('')}
      </div>

      <!-- Pricing Radio Options -->
      <div class="space-y-2 pt-2">
        <!-- Single Option -->
        <label class="flex items-center justify-between p-3 rounded-xl border border-rose-200 hover:border-rose-400 bg-white cursor-pointer transition-all">
          <div class="flex items-center gap-2.5">
            <input type="radio" name="lp_plan" value="single" class="w-4 h-4 text-rose-600 focus:ring-rose-500">
            <span class="text-xs font-bold text-slate-800">${lp.singleOptionTitle}</span>
          </div>
          <span class="text-xs font-black text-slate-900">${lp.singlePrice}</span>
        </label>

        <!-- Bundle / Subscription Option (BEST VALUE) -->
        <label class="relative flex flex-col p-3 rounded-xl border-2 border-rose-500 bg-rose-50/50 cursor-pointer transition-all shadow-xs">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <input type="radio" name="lp_plan" value="bundle" checked class="w-4 h-4 text-rose-600 focus:ring-rose-500">
              <span class="text-xs font-black text-rose-950">${lp.bundleOptionTitle}</span>
            </div>
            <span class="text-sm font-black text-rose-900">${lp.bundlePrice}</span>
          </div>
          <div class="ml-6 mt-1.5 space-y-0.5 text-[10px] font-bold text-rose-700">
            ${lp.bundleFeatures.map((f) => `<p>✓ ${f}</p>`).join('')}
          </div>
          <span class="absolute -bottom-2 right-4 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
            ${lp.bundleBadge}
          </span>
        </label>
      </div>

      <!-- Quantity + Add to Cart -->
      <div class="pt-3 flex items-center gap-2">
        <select class="px-3 py-3 rounded-xl border border-rose-200 bg-white text-xs font-bold text-slate-800 focus:outline-none">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>5</option>
        </select>
        <button style="background-color: ${lp.accentColor};" class="flex-1 py-3 px-4 rounded-xl text-emerald-950 font-black text-sm uppercase tracking-wide shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
          <span>${lp.ctaText}</span>
        </button>
      </div>

      <!-- Risk-Free Guarantee Footer -->
      <div class="pt-2 text-center text-[10.5px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
        <span>🛡️</span>
        <span>${lp.guaranteeText}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const currentHtmlCode = generateStandaloneHtml(data);

  // Handle AI generation from user text explaining product
  const handleGenerateFromText = async () => {
    if (!productTextPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationNotice(null);

    try {
      const savedProvider = localStorage.getItem('ai_provider') || 'openrouter';
      const savedModel =
        localStorage.getItem('ai_model') ||
        (savedProvider === 'openrouter' ? 'nvidia/nemotron-3.5-lightning:free' : 'gpt-4o-mini');
      const savedKey =
        localStorage.getItem('openrouter_api_key') ||
        localStorage.getItem('user_api_key') ||
        localStorage.getItem('openai_api_key') ||
        '';

      const promptPayload = `You are a world-class Direct Response landing page designer and copywriter.
Based on the following product explanation, generate high-converting e-commerce landing page content matching the structure of Image 1 ("The Good Dose" style).

Product Input:
${productTextPrompt}

Format your response as a valid, raw JSON object with NO markdown formatting, NO backticks. Exactly these keys:
{
  "brandName": "Brand Name",
  "tagline": "Short slogan or handle",
  "announcementSale": "PROMO BADGE (e.g. FLASH SALE / SPRING SALE)",
  "announcementDiscount": "Offer subtitle (e.g. Save up to 40% Off)",
  "subBannerText": "3 trust/incentive points separated by bullets",
  "headline": "Bold high-converting product headline in punchy conversational style",
  "description": "2-3 sentences explaining product benefits, daily routine, and emotional transformation",
  "badgeText": "Highlight pill badge (e.g. 100% Organic / 12k VPM)",
  "ratingScore": "4.9",
  "ratingCount": "1,400+ happy buyers",
  "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
  "singleOptionTitle": "Standard Package / Try It Once",
  "singlePrice": "$39",
  "bundleOptionTitle": "Value Bundle / Daily Ritual",
  "bundlePrice": "$29",
  "bundleFeatures": ["SAVE 25% IMMEDIATELY", "FREE SHIPPING INCLUDED"],
  "bundleBadge": "BEST VALUE ✨",
  "ctaText": "ADD TO CART →",
  "guaranteeText": "30-day money-back guarantee, risk-free.",
  "primaryColor": "#e11d48",
  "accentColor": "#bef264",
  "fontFamily": "serif"
}`;

      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: savedProvider,
          model: savedModel,
          apiKey: savedKey,
          prompt: promptPayload,
          systemInstruction: 'You are a JSON-only API. Respond strictly with raw valid JSON.',
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        let rawContent = resData.result || '';
        // Extract json inside ```json ... ``` if model wrapped it
        if (rawContent.includes('```')) {
          rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        }
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setData((prev) => ({
            ...prev,
            ...parsed,
            productImage: prev.productImage, // keep working image
          }));
          setGenerationNotice('Landing page generated from your product description! ✓');
          setActiveTab('preview');
          return;
        }
      }
      throw new Error('AI parsing failed');
    } catch {
      // Clean local smart generator based on keywords
      const lower = productTextPrompt.toLowerCase();
      let detectedBrand = 'Lumina Vitality';
      let detectedHeadline = 'Transform your daily routine with real results.';
      let detectedPrice = '$39';
      let detectedBundle = '$29';
      let pColor = '#e11d48';
      let aColor = '#bef264';

      if (lower.includes('dental') || lower.includes('teeth') || lower.includes('scaler') || lower.includes('أسنان')) {
        detectedBrand = 'SonicPro Dental';
        detectedHeadline = 'Clean white teeth in 5 minutes right at home.';
        detectedPrice = '4,800 DZD';
        detectedBundle = '7,800 DZD';
        pColor = '#0284c7';
        aColor = '#10b981';
      } else if (lower.includes('glow') || lower.includes('skin') || lower.includes('serum') || lower.includes('face')) {
        detectedBrand = 'Aura Botanics';
        detectedHeadline = 'Wake up to radiant, hydrated glass skin every morning.';
        detectedPrice = '$45';
        detectedBundle = '$34';
        pColor = '#ea580c';
        aColor = '#facc15';
      }

      setData((prev) => ({
        ...prev,
        brandName: detectedBrand,
        headline: detectedHeadline,
        description: productTextPrompt.slice(0, 220),
        singlePrice: detectedPrice,
        bundlePrice: detectedBundle,
        primaryColor: pColor,
        accentColor: aColor,
      }));
      setGenerationNotice('Created custom landing page from your text! ✓');
      setActiveTab('preview');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationNotice(null), 4000);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentHtmlCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([currentHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.brandName.toLowerCase().replace(/\s+/g, '-')}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddToCart = () => {
    setCartCount((c) => c + quantity);
    const chosenPrice = selectedPlan === 'bundle' ? data.bundlePrice : data.singlePrice;
    setCartToast(`Added ${quantity}x "${selectedPlan === 'bundle' ? data.bundleOptionTitle : data.singleOptionTitle}" (${chosenPrice}) to cart! 🛍️`);
    setTimeout(() => setCartToast(null), 3000);
  };

  return (
    <div className={`flex flex-col bg-slate-950 text-slate-100 rounded-2xl border border-white/10 overflow-hidden ${isModal ? 'h-[92vh]' : 'h-full'}`}>
      {/* Top Header Bar */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shadow-md">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Text to Code Landing Page</h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/30">
                IMAGE 1 ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Input product text → generates responsive code landing page & live interactive view
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {/* Tab Switcher: Preview | Code | Customize */}
          <div className="flex p-0.5 bg-slate-800/80 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive View</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'code' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Code</span>
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'customize' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>
          </div>

          {/* Copy Code */}
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            title="Copy Clean Standalone HTML"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>

          {/* Download HTML */}
          <button
            onClick={handleDownloadHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            title="Download Standalone HTML file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HTML</span>
          </button>

          {/* Send to Board */}
          {onSendToBoard && (
            <button
              onClick={() => onSendToBoard(data, currentHtmlCode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Board</span>
            </button>
          )}

          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Body: Left Input + Right Preview / Code */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Column: Text Input & Generator Settings */}
        <div className="w-full lg:w-96 p-4 border-r border-white/10 overflow-y-auto space-y-4 shrink-0 bg-slate-900/40">
          {/* Preset Buttons */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Reference Presets</span>
            </label>
            <div className="space-y-1.5">
              {SAMPLE_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setData(p.data);
                    setProductTextPrompt(`${p.data.headline} ${p.data.description}`);
                    setActiveTab('preview');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    data.brandName === p.data.brandName
                      ? 'bg-rose-500/15 border-rose-500/50 text-white'
                      : 'bg-slate-800/60 border-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold truncate">{p.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Prompt */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span>Explain your product in text:</span>
              <span className="text-[10px] font-normal text-slate-400">AI Text-to-Landing-Page</span>
            </label>
            <textarea
              value={productTextPrompt}
              onChange={(e) => setProductTextPrompt(e.target.value)}
              placeholder="e.g. A fruity daily fiber ritual drink made to support gut health and balance without boring taste. Single is $40, daily subscription is $32..."
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-800/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none font-sans"
            />
            <button
              onClick={handleGenerateFromText}
              disabled={isGenerating || !productTextPrompt.trim()}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Landing Page...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Landing Page Code</span>
                </>
              )}
            </button>

            {generationNotice && (
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{generationNotice}</span>
              </div>
            )}
          </div>

          {/* Quick Color & Style Tweaker */}
          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span>Theme & Visual Styling</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Banner & Accent Color</span>
                <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1.5 rounded-lg border border-white/10">
                  <input
                    type="color"
                    value={data.primaryColor}
                    onChange={(e) => setData({ ...data, primaryColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-[11px] font-mono text-slate-300 uppercase">{data.primaryColor}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">CTA Button Color</span>
                <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-1.5 rounded-lg border border-white/10">
                  <input
                    type="color"
                    value={data.accentColor}
                    onChange={(e) => setData({ ...data, accentColor: e.target.value })}
                    className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-[11px] font-mono text-slate-300 uppercase">{data.accentColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Phone View / Desktop View / Code */}
        <div className="flex-1 flex flex-col bg-slate-900/20 overflow-hidden relative">
          {/* Sub Toolbar for View */}
          <div className="px-4 py-2 bg-slate-900/60 border-b border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {activeTab === 'preview' && (
                <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-white/10">
                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] cursor-pointer ${
                      deviceView === 'mobile' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Frame (Image 1)</span>
                  </button>
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold text-[11px] cursor-pointer ${
                      deviceView === 'desktop' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop Width</span>
                  </button>
                </div>
              )}
              {activeTab === 'code' && (
                <span className="text-[11px] font-mono text-slate-400">
                  Pure HTML5 + Tailwind CSS • 0 external server dependencies
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Cart ({cartCount})
                </span>
              )}
              <span className="text-[10px] text-slate-400 font-mono">
                Model: {localStorage.getItem('ai_model') || 'OpenRouter / Active AI'}
              </span>
            </div>
          </div>

          {/* Toast Notice */}
          {cartToast && (
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
              {cartToast}
            </div>
          )}

          {/* Mode 1: Interactive Visual Preview */}
          {activeTab === 'preview' && (
            <div className="flex-1 overflow-y-auto p-4 flex justify-center items-start bg-gradient-to-tr from-amber-100 via-rose-100 to-pink-200">
              <div
                className={`transition-all duration-300 ${
                  deviceView === 'mobile' ? 'w-full max-w-[390px]' : 'w-full max-w-2xl'
                }`}
              >
                {/* Visual Phone Frame matching image_8f6424d6.png */}
                <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border-8 border-slate-900/90 text-slate-900 flex flex-col font-sans">
                  {/* Phone Speaker Notch */}
                  <div className="bg-slate-900 py-1 flex justify-center items-center">
                    <div className="w-16 h-3.5 bg-black rounded-full" />
                  </div>

                  {/* 1. Top Urgency Banner with Countdown */}
                  <div
                    style={{ backgroundColor: data.primaryColor }}
                    className="text-white px-4 py-2.5 flex items-center justify-between text-left select-none shadow-xs"
                  >
                    <div>
                      <span className="text-[9.5px] font-black uppercase tracking-widest block leading-none">
                        {data.announcementSale}
                      </span>
                      <span className="text-xs font-bold leading-tight block mt-0.5">
                        {data.announcementDiscount}
                      </span>
                    </div>
                    {/* Live Countdown */}
                    <div className="flex items-center gap-1 font-mono text-[11px] font-black">
                      <div className="bg-black/25 px-1.5 py-0.5 rounded text-center">
                        <span>{String(countdown.hours).padStart(2, '0')}</span>
                        <span className="text-[7.5px] block opacity-75 font-sans font-bold">Hr</span>
                      </div>
                      <span className="opacity-75">:</span>
                      <div className="bg-black/25 px-1.5 py-0.5 rounded text-center">
                        <span>{String(countdown.minutes).padStart(2, '0')}</span>
                        <span className="text-[7.5px] block opacity-75 font-sans font-bold">Mins</span>
                      </div>
                      <span className="opacity-75">:</span>
                      <div className="bg-black/25 px-1.5 py-0.5 rounded text-center">
                        <span>{String(countdown.seconds).padStart(2, '0')}</span>
                        <span className="text-[7.5px] block opacity-75 font-sans font-bold">Secs</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Orange Incentive Sub-Bar */}
                  <div className="bg-[#ea580c] text-white text-[10px] font-bold px-3 py-1.5 text-center tracking-wide">
                    {data.subBannerText}
                  </div>

                  {/* 3. Header Bar */}
                  <div className="px-4 py-3 flex items-center justify-between border-b border-rose-50 bg-white">
                    <button className="p-1 text-slate-700 hover:text-black cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <div className="text-center">
                      <h3
                        className={`text-base font-black tracking-tight text-rose-950 uppercase ${
                          data.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                        }`}
                      >
                        {data.brandName}
                      </h3>
                    </div>
                    <button
                      onClick={() => setCartToast(`Shopping bag currently has ${cartCount} items.`)}
                      className="p-1 text-slate-700 hover:text-black relative cursor-pointer"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* 4. Product Showcase Box */}
                  <div className="p-4 bg-white">
                    <div className="relative bg-rose-50/70 rounded-2xl p-5 flex flex-col items-center justify-center border border-rose-100/70 min-h-[260px] overflow-hidden">
                      {/* Badge Pill in corner */}
                      <span
                        style={{ backgroundColor: data.accentColor }}
                        className="absolute top-3 right-3 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wide"
                      >
                        {data.badgeText}
                      </span>

                      {/* Navigation Chevrons */}
                      <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/70 hover:bg-white text-rose-800 shadow-xs cursor-pointer">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/70 hover:bg-white text-rose-800 shadow-xs cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <img
                        src={data.productImage}
                        alt={data.headline}
                        className="max-h-56 max-w-full object-contain filter drop-shadow-md transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  </div>

                  {/* 5. Product Copy & Purchase Flow */}
                  <div className="px-5 pb-6 space-y-3.5 bg-white">
                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 text-xs text-rose-950 font-bold">
                      <div className="flex text-rose-600">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                        ))}
                      </div>
                      <span className="font-black text-rose-950">{data.ratingScore}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-600 font-semibold">{data.ratingCount}</span>
                    </div>

                    {/* Headline */}
                    <h2
                      className={`text-2xl font-black text-rose-950 leading-tight ${
                        data.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
                      }`}
                    >
                      {data.headline}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-slate-700 leading-relaxed font-normal">
                      {data.description}
                    </p>

                    {/* Benefit Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {data.benefits.map((b, i) => (
                        <div
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50/80 border border-rose-200 text-rose-950 text-[10.5px] font-semibold"
                        >
                          <span className="text-rose-600 font-bold">✓</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    {/* Purchase Tiers (Try It Once vs Daily Ritual) */}
                    <div className="space-y-2 pt-1">
                      {/* Option 1: Single */}
                      <div
                        onClick={() => setSelectedPlan('single')}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          selectedPlan === 'single'
                            ? 'border-rose-500 bg-rose-50/40 ring-1 ring-rose-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedPlan === 'single' ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                            }`}
                          >
                            {selectedPlan === 'single' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="text-xs font-bold text-slate-800">{data.singleOptionTitle}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">{data.singlePrice}</span>
                      </div>

                      {/* Option 2: Subscription / Best Value */}
                      <div
                        onClick={() => setSelectedPlan('bundle')}
                        className={`relative flex flex-col p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedPlan === 'bundle'
                            ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedPlan === 'bundle' ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                              }`}
                            >
                              {selectedPlan === 'bundle' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-black text-rose-950">{data.bundleOptionTitle}</span>
                          </div>
                          <span className="text-sm font-black text-rose-900">{data.bundlePrice}</span>
                        </div>

                        <div className="ml-6.5 mt-1.5 space-y-0.5 text-[10px] font-bold text-rose-800">
                          {data.bundleFeatures.map((f, i) => (
                            <p key={i} className="flex items-center gap-1">
                              <span className="text-rose-600">✓</span>
                              <span>{f}</span>
                            </p>
                          ))}
                        </div>

                        {/* Best Value Ribbon */}
                        <span className="absolute -bottom-2 right-4 bg-amber-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
                          {data.bundleBadge}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Add to Cart Button */}
                    <div className="pt-2 flex items-center gap-2">
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="px-3.5 py-3 rounded-xl border border-rose-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 cursor-pointer shadow-xs"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                      </select>

                      <button
                        onClick={handleAddToCart}
                        style={{ backgroundColor: data.accentColor }}
                        className="flex-1 py-3 px-4 rounded-xl text-emerald-950 font-black text-sm uppercase tracking-wider shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{data.ctaText}</span>
                      </button>
                    </div>

                    {/* Guarantee Line */}
                    <div className="pt-2 text-center text-[10.5px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                      <span>{data.guaranteeText}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Clean Code View */}
          {activeTab === 'code' && (
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400">index.html (Ready to Deploy)</span>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs font-semibold cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Full Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-900 border border-white/10 text-slate-200 overflow-x-auto text-[11px] leading-relaxed selection:bg-rose-500 selection:text-white">
                <code>{currentHtmlCode}</code>
              </pre>
            </div>
          )}

          {/* Mode 3: Manual Customizer Fields */}
          {activeTab === 'customize' && (
            <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                <span>Fine-Tune Copy & Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={data.brandName}
                    onChange={(e) => setData({ ...data, brandName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={data.badgeText}
                    onChange={(e) => setData({ ...data, badgeText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Headline</label>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => setData({ ...data, headline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Single Price</label>
                  <input
                    type="text"
                    value={data.singlePrice}
                    onChange={(e) => setData({ ...data, singlePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Bundle Price</label>
                  <input
                    type="text"
                    value={data.bundlePrice}
                    onChange={(e) => setData({ ...data, bundlePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={data.productImage}
                  onChange={(e) => setData({ ...data, productImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToCodeLandingPageApp;
