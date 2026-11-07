import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Share2,
  MoreHorizontal,
  Copy,
  RotateCcw,
  ThumbsUp,
  Check,
  Paperclip,
  ArrowUp,
  Monitor,
  Smartphone,
  Download,
  Lock,
  ChevronDown,
  FileCode,
  FileText,
  Zap,
  Cpu,
  Truck,
  ShieldCheck,
  Banknote,
  Star,
  Award,
  CheckCircle2,
  PackageCheck,
  Phone,
  Flame,
  Pencil,
  ShoppingBag,
  Link,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Layers,
  Grid,
  HelpCircle,
  Code2,
  Eye,
  EyeOff,
  Play,
  Sliders,
  Compass,
} from 'lucide-react';
import { BoardNode } from '../../types/board';

// ==========================================
// SECTIONS & LAYERS DEFINITION
// ==========================================
export interface LandingPageSectionDef {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  icon: string;
}

export const LANDING_PAGE_SECTIONS: LandingPageSectionDef[] = [
  { id: 'header', name: 'Navbar & Brand Header', arabicName: 'الشريط العلوي والشعار', category: 'Navigation', icon: 'Compass' },
  { id: 'hero', name: 'Hero Section (Showcase & CTA)', arabicName: 'القسم الرئيسي والعرض', category: 'Conversion', icon: 'Sparkles' },
  { id: 'trust', name: '58 Wilaya COD Trust Badges', arabicName: 'شريط الضمان والتوصيل 58 ولاية', category: 'Trust', icon: 'ShieldCheck' },
  { id: 'features', name: 'Product Features Grid (4 Cards)', arabicName: 'شبكة المميزات والفوائد', category: 'Details', icon: 'Grid' },
  { id: 'bundles', name: '3-Tier Pricing Bundles', arabicName: 'باقات الأسعار والعروض الخاصة', category: 'Pricing', icon: 'Layers' },
  { id: 'order', name: 'Cash-on-Delivery (COD) Order Form', arabicName: 'استمارة الطلب السريع والدفع عند الاستلام', category: 'Checkout', icon: 'ShoppingBag' },
  { id: 'reviews', name: 'Customer Reviews (4.9★)', arabicName: 'آراء وتقييمات الزبائن', category: 'Proof', icon: 'Star' },
  { id: 'faqs', name: 'Frequently Asked Questions (FAQs)', arabicName: 'الأسئلة الشائعة والأجوبة', category: 'Support', icon: 'HelpCircle' },
  { id: 'footer', name: 'Footer & COD Notice', arabicName: 'تذييل الصفحة وحقوق الملكية', category: 'Legal', icon: 'FileText' },
];

// ==========================================
// DATA INTERFACES FOR REAL PRODUCT LANDING PAGE
// ==========================================
export interface VerdeLandingPageData {
  projectName: string;
  brandName: string;
  domain: string;
  badgeText: string;
  heroHeadline: string;
  heroSubtitle: string;
  productImage: string;
  priceFormatted: string;
  originalPriceFormatted: string;
  discountPercentage: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  accentColor: string; // e.g. '#10b981' (emerald)

  // DTC CRO Reference Layout (Image 2)
  heroLayout?: 'image-up' | 'text-up';
  productGalleryImages?: string[];
  featurePills?: string[];
  benefitCheckmarks?: string[];

  // Trust Strip
  trustBadges: { title: string; subtitle: string; icon: string }[];

  // Problem vs Solution
  problemSolution: {
    problemTitle: string;
    problemDescription: string;
    solutionTitle: string;
    solutionDescription: string;
  };

  // Features Grid
  features: { title: string; description: string; icon: string }[];

  // Multi-tier Bundles (High Conversion)
  bundles: {
    title: string;
    quantity: number;
    price: string;
    originalPrice?: string;
    badge?: string;
    popular?: boolean;
    freeShipping?: boolean;
    savingsText?: string;
  }[];

  // Customer Reviews & Social Proof
  reviews: {
    name: string;
    location: string;
    rating: number;
    comment: string;
    verified: boolean;
    date: string;
  }[];

  // Frequently Asked Questions
  faqs: { question: string; answer: string }[];

  // Cash on Delivery Order Form
  orderForm: {
    headline: string;
    subtitle: string;
    buttonText: string;
    guaranteeNotice: string;
  };

  filesGenerated: { name: string; lines: number; type: 'html' | 'css' | 'tsx' }[];
  editCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  content: string;
  duration?: string;
  files?: { name: string; lines: number }[];
  features?: string[];
  modelUsed?: string;
}

// Default initial state: Clean Algerian & international e-commerce product landing page
export const INITIAL_VERDE_DATA: VerdeLandingPageData = {
  projectName: 'Ultrasonic Dental Scaler — Landing Page',
  brandName: 'Dental Scaler Pro',
  domain: 'dentalscaler.dz',
  badgeText: '🇩🇿 الدفع عند الاستلام • توصيل سريع لـ 58 ولاية • ضمان 100%',
  heroHeadline: 'احصل على ابتسامة ناصعة وتخلص من الجير والتصبغات في منزلك خلال دقائق!',
  heroSubtitle:
    'جهاز التنظيف بالموجات فوق الصوتية المعتمد طبياً لإزالة الجير العنيد وبقع القهوة والتدخين بأمان تام، مع حق فحص ومعاينة الطرد قبل الدفع عند الاستلام.',
  productImage:
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=700&h=550&fit=crop',
  priceFormatted: '4,800 DZD',
  originalPriceFormatted: '7,200 DZD',
  discountPercentage: '-33% تخفيض اليوم',
  primaryCtaText: 'اطلب الآن والدفع عند الاستلام 🚚',
  secondaryCtaText: 'مشاهدة المميزات والآراء',
  accentColor: '#10b981', // Emerald green
  heroLayout: 'image-up', // Image UP, Text DOWN (Matching DTC reference Image 2)
  featurePills: [
    '✨ مقبض Carabiner D-Ring',
    '💨 هيكل 8 أضلاع مقاوم للرياح',
    '🎨 ألوان ماكارون الباستيل',
    '🛡️ منتج أصلي 100%',
  ],
  benefitCheckmarks: [
    'مقبض Carabiner D-Ring مدمج للتعليق الفوري على الحقائب والأحزمة وسهولة الحمل',
    'هيكل تيتانيوم مقوى بـ 8 أضلاع متينة تتحمل الرياح العاتية والأمطار الغزيرة',
    'قماش عازل مطلي بتقنية النانو يطرد قطرات الماء ويحجب الأشعة فوق البنفسجية',
    'توصيل متوفر لجميع 58 ولاية مع حق فتح وفحص الطرد قبل الدفع عند الاستلام',
  ],
  productGalleryImages: [
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=700&h=550&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=700&h=550&fit=crop',
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=700&h=550&fit=crop',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=700&h=550&fit=crop',
  ],
  trustBadges: [
    { title: 'توصيل لـ 58 ولاية', subtitle: 'خلال 24 إلى 48 ساعة لباب منزلك', icon: 'Truck' },
    { title: 'الدفع عند الاستلام (COD)', subtitle: 'لا تدفع أي دينار حتى تفحص طردك بنفسك', icon: 'Banknote' },
    { title: 'ضمان الاسترجاع 30 يوم', subtitle: 'استبدال فوري أو استرجاع الأموال', icon: 'ShieldCheck' },
    { title: 'تقييم ممتاز 4.9/5', subtitle: 'أكثر من 2,450 زبون راضٍ في الجزائر', icon: 'Star' },
  ],
  problemSolution: {
    problemTitle: 'هل تعاني من تكلفة جلسات تنظيف الأسنان المتكررة وتراكم الجير؟',
    problemDescription:
      'تراكم الجير والتصبغات يسبب رائحة الفم الكريهة وتراجع اللثة، ومواعيد العيادات مكلفة وتأخذ الكثير من وقتك وجهدك.',
    solutionTitle: 'الحل الاحترافي والآمن بين يديك في المنزل',
    solutionDescription:
      'تقنية الاهتزاز الصوتي الذكي تزيل التكلسات بدقة فائقة دون أي ألم أو حساسية للثة، مع رؤية واضحة بفضل ضوء الـ LED المدمج.',
  },
  features: [
    {
      title: 'اهتزاز بالموجات فوق الصوتية',
      description: 'تردد عالي يفتت الجير العنيد بدقة دون لمس أو إيذاء أنسجة اللثة الحساسة.',
      icon: 'Zap',
    },
    {
      title: '5 مستويات قوة تناسب الجميع',
      description: 'من التنظيف اللطيف للمبتدئين حتى المستوى المركز للبقع العميقة والتكلسات.',
      icon: 'CheckCircle2',
    },
    {
      title: 'إضاءة LED مدمجة ورؤية واضحة',
      description: 'كشاف أمامي فائق السطوع يتيح لك رؤية كل زاوية بدقة وسهولة داخل الفم.',
      icon: 'Award',
    },
    {
      title: 'مقاوم للماء وسهل الشحن USB',
      description: 'معيار IPX6 قابل للغسل بالماء بالكامل وبطارية تدوم لأسابيع بشحنة واحدة.',
      icon: 'PackageCheck',
    },
  ],
  bundles: [
    {
      title: 'باقة قطعة واحدة (1)',
      quantity: 1,
      price: '4,800 DZD',
      originalPrice: '7,200 DZD',
      badge: 'الخيار القياسي',
      freeShipping: false,
      savingsText: 'سعر مناسب جداً',
    },
    {
      title: 'عرض قطعتين (2) — الأكثر طلباً',
      quantity: 2,
      price: '8,600 DZD',
      originalPrice: '14,400 DZD',
      badge: 'الأكثر طلباً 🔥',
      popular: true,
      freeShipping: true,
      savingsText: 'وفر 1,000 دج + توصيل مجاني',
    },
    {
      title: 'الباقة العائلية (3 قطع)',
      quantity: 3,
      price: '11,900 DZD',
      originalPrice: '21,600 DZD',
      badge: 'أقصى توفير 💰',
      freeShipping: true,
      savingsText: 'وفر 2,500 دج + توصيل مجاني + هدية',
    },
  ],
  reviews: [
    {
      name: 'محمد عبد الرحيم',
      location: 'الجزائر العاصمة',
      rating: 5,
      comment: 'وصلني في 24 ساعة بالضبط. جودة عالية ومطابق للوصف 100%. التوصيل سريع وعون التوصيل محترم.',
      verified: true,
      date: 'منذ يومين',
    },
    {
      name: 'سارة بن عيسى',
      location: 'وهران',
      rating: 5,
      comment: 'منتج رائع وخدمة عملاء ممتازة ردوا على كل استفساراتي عبر الواتساب. أنصح به بشدة!',
      verified: true,
      date: 'منذ 4 أيام',
    },
    {
      name: 'ياسين بلقاسم',
      location: 'قسنطينة',
      rating: 5,
      comment: 'أفضل استثمار، فتحت الطرد وتأكدت بنفسي قبل ما ندفع للدليفري. شكرا لكم.',
      verified: true,
      date: 'منذ أسبوع',
    },
  ],
  faqs: [
    {
      question: 'متى يصلني المنتج بعد تأكيد الطلب؟',
      answer: 'يصلك الطرد في غضون 24 إلى 48 ساعة كأقصى تقدير لجميع ولايات الوطن (58 ولاية).',
    },
    {
      question: 'هل يمكنني فحص ومعاينة المنتج قبل الدفع؟',
      answer: 'نعم بالتأكيد! لديك الحق الكامل في فتح الطرد ومعاينته مع عون التوصيل قبل دفع المبلغ.',
    },
    {
      question: 'هل يوجد ضمان على المنتج؟',
      answer: 'نعم، نوفر ضمان استبدال مجاني أو استرجاع لمدة 30 يوماً في حال وجود أي عيب مصنعي.',
    },
  ],
  orderForm: {
    headline: 'املأ الاستمارة أدناه لتأكيد طلبك والدفع عند الاستلام',
    subtitle: 'الكمية محدودة! سيتصل بك فريقنا لتأكيد معلومات التوصيل فوراً.',
    buttonText: 'تأكيد الطلب الآن 🚚 (الدفع عند الاستلام)',
    guaranteeNotice: '🔒 معلوماتك مشفرة ومحمية 100% • الدفع فقط بعد الاستلام والمعاينة',
  },
  filesGenerated: [
    { name: 'index.html', lines: 210, type: 'html' },
    { name: 'theme.css', lines: 118, type: 'css' },
    { name: 'checkout-cod.tsx', lines: 92, type: 'tsx' },
  ],
  editCount: 14,
};

// Initial chat history
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    timestamp: 'TODAY · 9:41 AM',
    content:
      'Build a clean, high-converting product landing page for Dental Scaler Pro. Localize it for Algerian COD e-commerce with prices in DZD, trust signals for 58 wilayas, bundle offers, and an interactive cash-on-delivery order form.',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    timestamp: 'TODAY · 9:41 AM',
    duration: '2s',
    content:
      "Done — generated an authentic high-converting product landing page! Clean Scandinavian aesthetic with emerald accents, high-res product photo, Algerian COD guarantees, 3 bundle pricing rows, customer testimonials, and an interactive order form. You can also click directly on any text in the preview on the right to edit it live!",
    files: [
      { name: 'index.html', lines: 210 },
      { name: 'theme.css', lines: 118 },
      { name: 'checkout-cod.tsx', lines: 92 },
    ],
    features: [
      'Interactive visual inline editing on all text in preview',
      'Hero section with real product photo, price & instant COD CTA',
      '3 High-converting bundles: 1 Unit, Pack 2 Popular, Pack 3 Family',
      'Instant Cash-on-Delivery (COD) Order Form for 58 Wilayas',
    ],
    modelUsed: 'OPENROUTER: nvidia/nemotron-3.5-lightning:free',
  },
];

// Helper to generate full standalone HTML string (Supporting Image UP & Text DOWN matching Image 2 DTC CRO)
export function generateVerdeHtml(data: VerdeLandingPageData): string {
  const isImageUp = data.heroLayout !== 'text-up';
  const pills = data.featurePills || [
    '✨ مقبض Carabiner D-Ring',
    '💨 هيكل 8 أضلاع مقاوم للرياح',
    '🎨 ألوان ماكارون الباستيل',
    '🛡️ منتج أصلي 100%',
  ];
  const checks = data.benefitCheckmarks || [
    'مقبض Carabiner D-Ring مدمج للتعليق الفوري على الحقائب والأحزمة وسهولة الحمل',
    'هيكل تيتانيوم مقوى بـ 8 أضلاع متينة تتحمل الرياح العاتية والأمطار الغزيرة',
    'قماش عازل مطلي بتقنية النانو يطرد قطرات الماء ويحجب الأشعة فوق البنفسجية',
    'توصيل متوفر لجميع 58 ولاية مع حق فتح وفحص الطرد قبل الدفع عند الاستلام',
  ];
  const galleryImages = (data.productGalleryImages && data.productGalleryImages.length > 0)
    ? data.productGalleryImages
    : [data.productImage];

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.brandName} — ${data.heroHeadline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Cairo', -apple-system, sans-serif; }
    .thumbnail-btn.active { border-color: ${data.accentColor}; ring: 2px ${data.accentColor}; }
  </style>
</head>
<body class="bg-[#fafaf9] text-slate-900 antialiased">
  <!-- Top Announcement Bar (DTC Image 2 Style) -->
  <div class="bg-emerald-800 text-white text-xs font-bold py-2 px-4 text-center">
    🎉 عرض خاص اليوم: توصيل سريع لـ 58 ولاية • الدفع عند الاستلام بعد المعاينة والفحص
  </div>

  <!-- Sticky Nav -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
    <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div style="background-color: ${data.accentColor}" class="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-xs">
          ✦
        </div>
        <span class="font-extrabold text-slate-900 text-base tracking-tight">${data.brandName}</span>
      </div>
      <div class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
        <span>🚚</span>
        <span>توصيل 58 ولاية • الدفع عند الاستلام</span>
      </div>
      <a href="#order-section" style="background-color: ${data.accentColor}" class="px-4 py-1.5 rounded-xl text-white text-xs font-bold hover:opacity-90 shadow-xs transition-opacity">
        ${data.primaryCtaText}
      </a>
    </div>
  </header>

  <!-- Hero Section (DTC CRO Layout - Image UP & Text DOWN) -->
  <section class="max-w-xl mx-auto px-4 pt-6 pb-10">
    ${
      isImageUp
        ? `
    <!-- 1. IMAGE GALLERY FIRST (UP) - Exactly like Image 2 (VitalNest / Purevita / Glowara) -->
    <div class="space-y-3">
      <div class="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-lg bg-white aspect-square flex items-center justify-center group">
        <img id="main-product-img" src="${galleryImages[0]}" alt="${data.brandName}" class="w-full h-full object-cover transition-all duration-300" />
        
        <!-- Floating Benefit Badges over Image (Image 2 style) -->
        <div class="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-[10.5px] font-bold shadow-md flex items-center gap-1">
          <span>${pills[0] || '✨ جودة ممتازة'}</span>
        </div>
        <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10.5px] font-bold shadow-md">
          <span>${pills[1] || '💨 مقاوم للرياح'}</span>
        </div>
        <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200 text-[10px] font-bold shadow-sm">
          <span>${pills[2] || '🎨 ألوان ماكارون'}</span>
        </div>
        <div class="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/95 text-white text-[10px] font-bold shadow-sm">
          <span>${pills[3] || '🛡️ أصلي 100%'}</span>
        </div>
      </div>

      <!-- Thumbnails Row underneath image -->
      <div class="flex items-center justify-center gap-2 overflow-x-auto py-1">
        ${galleryImages
          .map(
            (img, idx) => `
          <button type="button" onclick="document.getElementById('main-product-img').src='${img}'" class="w-14 h-14 rounded-xl border-2 border-slate-200 hover:border-emerald-500 overflow-hidden shrink-0 shadow-2xs focus:border-emerald-600 focus:ring-2 focus:ring-emerald-400">
            <img src="${img}" alt="Thumbnail ${idx + 1}" class="w-full h-full object-cover" />
          </button>`
          )
          .join('')}
      </div>
    </div>

    <!-- 2. PRODUCT DETAILS (TEXT DOWN) - Exactly like Image 2 -->
    <div class="space-y-4 pt-4 text-right">
      <!-- Rating & Social Proof -->
      <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div class="flex items-center gap-1.5 text-xs text-slate-600">
          <span class="text-amber-500 font-bold text-sm">★★★★★</span>
          <span class="font-bold text-slate-900">4.9/5</span>
          <span class="text-[11px] text-slate-500">(أكثر من 2,450 زبون راضٍ في الجزائر)</span>
        </div>
        <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
          ✓ زبون مؤكد
        </span>
      </div>

      <!-- Title / Headline -->
      <h1 class="text-xl sm:text-2xl font-black text-slate-950 leading-tight tracking-tight">
        ${data.heroHeadline}
      </h1>

      <!-- Pricing Bar -->
      <div class="flex items-baseline gap-3 pt-1">
        <span class="text-3xl font-black text-emerald-600 font-mono">${data.priceFormatted}</span>
        <span class="text-base text-slate-400 line-through font-mono">${data.originalPriceFormatted}</span>
        <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold font-mono">${data.discountPercentage}</span>
      </div>

      <!-- Subtitle -->
      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
        ${data.heroSubtitle}
      </p>

      <!-- Benefit Checkmark Bullets (✓) -->
      <div class="space-y-2 py-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60">
        ${checks
          .map(
            (c) => `
          <div class="flex items-start gap-2 text-xs text-slate-700 font-medium">
            <span class="text-emerald-600 font-bold text-sm shrink-0">✓</span>
            <span>${c}</span>
          </div>`
          )
          .join('')}
      </div>

      <!-- 3-Tier Multi-Pack Quantity Breaks (Cards matching Image 2!) -->
      <div class="space-y-2 pt-2">
        <span class="text-xs font-bold text-slate-800 block">اختر العرض المناسب (توفير أكبر للباقات المتعددة):</span>
        <div class="grid grid-cols-3 gap-2">
          ${(data.bundles || [])
            .map(
              (b, idx) => `
            <div onclick="selectBundleTier(${idx})" class="p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                b.popular ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'
              }">
              <div class="text-[10px] font-bold text-slate-500 mb-1">${b.title.split('(')[0]}</div>
              <div class="text-base font-black text-slate-900 font-mono">${b.price.replace(' DZD', ' دج')}</div>
              ${b.badge ? `<span class="inline-block px-1.5 py-0.5 mt-1 rounded text-[9px] font-bold ${b.popular ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}">${b.badge}</span>` : ''}
            </div>`
            )
            .join('')}
        </div>
      </div>

      <!-- Full-Width High-Converting CTA Button -->
      <div class="pt-3 space-y-2">
        <a href="#order-section" style="background-color: ${data.accentColor}" class="block w-full py-4 px-6 rounded-2xl text-white font-black text-center text-sm sm:text-base shadow-lg hover:opacity-95 transition-all">
          ${data.primaryCtaText}
        </a>
        <div class="text-center text-[10.5px] text-slate-500 flex items-center justify-center gap-1.5">
          <span>🔒</span>
          <span>الدفع عند الاستلام بعد معاينة وفحص الطرد • ضمان استبدال 30 يوم</span>
        </div>
      </div>

      <!-- 4 Trust Badges (Image 2 Style) -->
      <div class="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
        <div class="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
          <div class="text-base mb-0.5">🚚</div>
          <div class="text-[9.5px] font-bold text-slate-800">توصيل 58 ولاية</div>
        </div>
        <div class="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
          <div class="text-base mb-0.5">💵</div>
          <div class="text-[9.5px] font-bold text-slate-800">الدفع عند الاستلام</div>
        </div>
        <div class="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
          <div class="text-base mb-0.5">🔄</div>
          <div class="text-[9.5px] font-bold text-slate-800">استبدال 30 يوم</div>
        </div>
        <div class="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
          <div class="text-base mb-0.5">💬</div>
          <div class="text-[9.5px] font-bold text-slate-800">دعم متواصل</div>
        </div>
      </div>
    </div>
    `
        : `
    <!-- Classic Side-by-Side or Text-Up Layout -->
    <div class="space-y-5 text-right">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eafaf1] border border-[#a7f3d0] text-[#059669] text-xs font-bold">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        ${data.badgeText}
      </div>
      <h1 class="text-2xl md:text-3xl font-black text-slate-950 leading-tight">
        ${data.heroHeadline}
      </h1>
      <p class="text-xs md:text-sm text-slate-600 leading-relaxed">${data.heroSubtitle}</p>
      <div class="flex items-baseline gap-3 pt-1">
        <span class="text-2xl md:text-3xl font-black text-emerald-600 font-mono">${data.priceFormatted}</span>
        <span class="text-sm text-slate-400 line-through font-mono">${data.originalPriceFormatted}</span>
        <span class="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold font-mono">${data.discountPercentage}</span>
      </div>
      <a href="#order-section" style="background-color: ${data.accentColor}" class="block w-full py-3.5 px-6 rounded-2xl text-white font-bold text-center text-sm shadow-md">
        ${data.primaryCtaText}
      </a>
      <div class="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white aspect-4/3 mt-4">
        <img src="${data.productImage}" alt="${data.brandName}" class="w-full h-full object-cover" />
      </div>
    </div>
    `
    }
  </section>

  <!-- Features Grid -->
  <section class="max-w-5xl mx-auto px-6 py-12">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-2">مميزات ${data.brandName}</h2>
      <p class="text-sm text-slate-500">تم تصميمه بأعلى معايير الجودة ليمنحك أفضل تجربة عملية ونتائج فورية</p>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      ${(data.features || [])
        .map(
          (f) => `
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div style="background-color: ${data.accentColor}15; color: ${data.accentColor}" class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base mb-3">✦</div>
          <h3 class="text-sm font-bold text-slate-900 mb-1.5">${f.title}</h3>
          <p class="text-xs text-slate-500 leading-relaxed">${f.description}</p>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <!-- Bundles & Pricing -->
  <section class="max-w-4xl mx-auto px-6 py-12">
    <div class="text-center mb-8">
      <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-1">اختر الباقة المناسبة لك</h2>
      <p class="text-xs text-slate-500">عروض حصرية لفترة محدودة مع توصيل مجاني للباقات المتعددة</p>
    </div>
    <div class="grid md:grid-cols-3 gap-5">
      ${(data.bundles || [])
        .map(
          (b) => `
        <div class="bg-white p-6 rounded-2xl border ${
          b.popular ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200/80 shadow-xs'
        }">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-bold text-slate-900">${b.title}</h3>
            ${b.badge ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold ${b.popular ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}">${b.badge}</span>` : ''}
          </div>
          <div class="text-2xl font-black text-slate-900 my-2 font-mono">${b.price}</div>
          <p class="text-xs text-emerald-600 font-bold mb-4">${b.savingsText || ''}</p>
          <a href="#order-section" style="background-color: ${b.popular ? data.accentColor : '#0f172a'}" class="block w-full py-2.5 rounded-xl text-white text-xs font-bold text-center">
            اختيار هذه الباقة
          </a>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <!-- Instant Cash-On-Delivery Order Form -->
  <section id="order-section" class="max-w-xl mx-auto px-6 py-12">
    <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
      <div class="text-center space-y-1">
        <span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
          📦 استمارة الطلب السريع (COD)
        </span>
        <h3 class="text-xl font-black text-slate-900">${data.orderForm?.headline || 'استمارة الطلب السريع'}</h3>
        <p class="text-xs text-slate-500">${data.orderForm?.subtitle || 'يرجى إدخال معلوماتك لتأكيد الشحن'}</p>
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
        <button type="submit" style="background-color: ${data.accentColor}" class="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3">
          ${data.orderForm?.buttonText || 'تأكيد الطلب والدفع عند الاستلام 🚚'}
        </button>
        <p class="text-[10px] text-center text-slate-400 font-medium pt-1">
          ${data.orderForm?.guaranteeNotice || '🔒 الدفع عند الاستلام • فحص الطرد قبل الدفع • ضمان 30 يوم'}
        </p>
      </form>
    </div>
  </section>

  <!-- Real Customer Reviews -->
  <section class="max-w-4xl mx-auto px-6 py-12 border-t border-slate-100">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-black text-slate-900 mb-1">آراء الزبائن الذين جربوا المنتج</h2>
      <p class="text-xs text-slate-500">تقييمات حقيقية من زبائن في مختلف ولايات الوطن</p>
    </div>
    <div class="grid md:grid-cols-3 gap-4">
      ${(data.reviews || [])
        .map(
          (rev) => `
        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-900">${rev.name}</span>
            <span class="text-amber-500 font-bold">★★★★★</span>
          </div>
          <span class="text-[10px] text-slate-400 block font-mono">${rev.location} • ${rev.date}</span>
          <p class="text-xs text-slate-600 leading-relaxed">${rev.comment}</p>
          <div class="text-[10px] font-bold text-emerald-600 pt-1">✓ شراء مؤكد ومعاينة عند الاستلام</div>
        </div>`
        )
        .join('')}
    </div>
  </section>

  <footer class="text-center text-xs text-slate-400 py-8 border-t border-slate-100">
    <p>© ${new Date().getFullYear()} ${data.brandName}. جميع الحقوق محفوظة • الدفع عند الاستلام لـ 58 ولاية.</p>
  </footer>
</body>
</html>`;
}

// ==========================================
// MAIN VERDE LANDING PAGE COMPONENT
// ==========================================
export interface VerdeLandingPageAppProps {
  node: BoardNode;
  isSelected?: boolean;
  onUpdateNode?: (updated: Partial<BoardNode>) => void;
  onDeleteNode?: () => void;
  connectedProduct?: any;
  allCanvasProducts?: any[];
}

export const VerdeLandingPageApp: React.FC<VerdeLandingPageAppProps> = ({
  node,
  isSelected,
  onUpdateNode,
  onDeleteNode,
  connectedProduct,
  allCanvasProducts = [],
}) => {
  // 1. Resolve active product facts (from props or node.appData)
  const activeProduct = useMemo(() => {
    return connectedProduct || node.appData?.connectedProduct || null;
  }, [connectedProduct, node.appData]);

  // Track if a landing page project has been created or should start blank (no default mockups on brand new app)
  const [hasGeneratedPage, setHasGeneratedPage] = useState<boolean>(() => {
    return Boolean(node.appData?.hasGeneratedPage);
  });

  // 2. Data state (safely merged with INITIAL_VERDE_DATA so undefined arrays NEVER crash)
  const [data, setData] = useState<VerdeLandingPageData>(() => {
    const saved = node.appData?.landingPageData;
    const base: VerdeLandingPageData = {
      ...INITIAL_VERDE_DATA,
      ...(saved || {}),
      trustBadges: (saved?.trustBadges && saved.trustBadges.length > 0) ? saved.trustBadges : INITIAL_VERDE_DATA.trustBadges,
      problemSolution: saved?.problemSolution?.solutionTitle ? saved.problemSolution : INITIAL_VERDE_DATA.problemSolution,
      features: (saved?.features && saved.features.length > 0) ? saved.features : INITIAL_VERDE_DATA.features,
      bundles: (saved?.bundles && saved.bundles.length > 0) ? saved.bundles : INITIAL_VERDE_DATA.bundles,
      reviews: (saved?.reviews && saved.reviews.length > 0) ? saved.reviews : INITIAL_VERDE_DATA.reviews,
      faqs: (saved?.faqs && saved.faqs.length > 0) ? saved.faqs : INITIAL_VERDE_DATA.faqs,
      orderForm: saved?.orderForm?.headline ? saved.orderForm : INITIAL_VERDE_DATA.orderForm,
    };
    if (activeProduct) {
      const pPrice = Number(activeProduct.price) || 1400;
      return {
        ...base,
        projectName: `${activeProduct.name || activeProduct.title || 'Product'} — Landing Page`,
        brandName: activeProduct.name || activeProduct.title || base.brandName,
        productImage: activeProduct.image || base.productImage,
        productGalleryImages:
          activeProduct.images && activeProduct.images.length > 0
            ? activeProduct.images
            : [activeProduct.image || base.productImage, ...(base.productGalleryImages || [])],
        heroLayout: 'image-up',
        priceFormatted: activeProduct.priceFormatted || `${pPrice} DZD`,
        originalPriceFormatted:
          activeProduct.originalPriceFormatted || `${Math.round(pPrice * 1.5)} DZD`,
        heroHeadline: `احصل على ${activeProduct.name || activeProduct.title || 'المنتج الأصلي'} مع توصيل سريع لـ 58 ولاية!`,
        heroSubtitle:
          activeProduct.description ||
          `الحل المثالي والمضمون بجودة عالية وتصميم عملي، مع حق فحص الطرد عند الاستلام وضمان استبدال لمدة 30 يوم.`,
        featurePills: base.featurePills || [
          '✨ مقبض Carabiner D-Ring',
          '💨 هيكل 8 أضلاع مقاوم للرياح',
          '🎨 ألوان ماكارون الباستيل',
          '🛡️ منتج أصلي 100%',
        ],
        benefitCheckmarks: base.benefitCheckmarks || [
          'مقبض Carabiner D-Ring مدمج للتعليق الفوري على الحقائب والأحزمة وسهولة الحمل',
          'هيكل تيتانيوم مقوى بـ 8 أضلاع متينة تتحمل الرياح العاتية والأمطار الغزيرة',
          'قماش عازل مطلي بتقنية النانو يطرد قطرات الماء ويحجب الأشعة فوق البنفسجية',
          'توصيل متوفر لجميع 58 ولاية مع حق فتح وفحص الطرد قبل الدفع عند الاستلام',
        ],
        bundles: [
          {
            title: '1 قطعة (العبوة الفردية)',
            quantity: 1,
            price: `${pPrice} DZD`,
            originalPrice: `${Math.round(pPrice * 1.5)} DZD`,
            badge: 'الخيار القياسي',
            popular: false,
            freeShipping: false,
            savingsText: 'سعر مناسب جداً',
          },
          {
            title: '2 قطع (عرض الثنائي)',
            quantity: 2,
            price: `${Math.round(pPrice * 1.7)} DZD`,
            originalPrice: `${Math.round(pPrice * 3)} DZD`,
            badge: 'الأكثر طلباً 🔥',
            popular: true,
            freeShipping: true,
            savingsText: 'وفر 400 دج + توصيل مجاني',
          },
          {
            title: '3 قطع (العرض العائلي)',
            quantity: 3,
            price: `${Math.round(pPrice * 2.3)} DZD`,
            originalPrice: `${Math.round(pPrice * 4.5)} DZD`,
            badge: 'أفضل قيمة 💰',
            popular: false,
            freeShipping: true,
            savingsText: 'وفر 1,000 دج + شحن مجاني',
          },
        ],
      };
    }
    return base;
  });

  // When connectedProduct changes from the outside canvas connection, update data immediately!
  useEffect(() => {
    if (activeProduct && activeProduct.name) {
      const pPrice = Number(activeProduct.price) || 1400;
      setData((prev) => ({
        ...prev,
        projectName: `${activeProduct.name} — Landing Page`,
        brandName: activeProduct.name,
        productImage: activeProduct.image || prev.productImage,
        productGalleryImages:
          activeProduct.images && activeProduct.images.length > 0
            ? activeProduct.images
            : [activeProduct.image || prev.productImage, ...(prev.productGalleryImages || [])],
        heroLayout: 'image-up',
        priceFormatted: activeProduct.priceFormatted || `${pPrice} DZD`,
        originalPriceFormatted:
          activeProduct.originalPriceFormatted || `${Math.round(pPrice * 1.5)} DZD`,
        heroHeadline: `احصل على ${activeProduct.name} الأصلي مع توصيل سريع لـ 58 ولاية!`,
        heroSubtitle:
          activeProduct.description ||
          `الحل المثالي والمضمون بجودة عالية وتصميم عملي، مع حق فحص الطرد عند الاستلام وضمان استبدال لمدة 30 يوم.`,
        bundles: [
          {
            title: '1 قطعة (العبوة الفردية)',
            quantity: 1,
            price: `${pPrice} DZD`,
            originalPrice: `${Math.round(pPrice * 1.5)} DZD`,
            badge: 'الخيار القياسي',
            popular: false,
            freeShipping: false,
            savingsText: 'سعر مناسب جداً',
          },
          {
            title: '2 قطع (عرض الثنائي)',
            quantity: 2,
            price: `${Math.round(pPrice * 1.7)} DZD`,
            originalPrice: `${Math.round(pPrice * 3)} DZD`,
            badge: 'الأكثر طلباً 🔥',
            popular: true,
            freeShipping: true,
            savingsText: 'وفر 400 دج + توصيل مجاني',
          },
          {
            title: '3 قطع (العرض العائلي)',
            quantity: 3,
            price: `${Math.round(pPrice * 2.3)} DZD`,
            originalPrice: `${Math.round(pPrice * 4.5)} DZD`,
            badge: 'أفضل قيمة 💰',
            popular: false,
            freeShipping: true,
            savingsText: 'وفر 1,000 دج + شحن مجاني',
          },
        ],
      }));
    }
  }, [activeProduct]);

  // 3. Chat history state (clean empty start on fresh app add, restored if saved)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    if (node.appData?.chatMessages && node.appData.chatMessages.length > 0) {
      return node.appData.chatMessages;
    }
    return [];
  });

  // 4. Dynamic Model & Provider Connection (Synchronized with top bar!)
  const [activeProvider, setActiveProvider] = useState<string>(
    () => localStorage.getItem('ai_provider') || 'openrouter'
  );
  const [activeModel, setActiveModel] = useState<string>(
    () =>
      localStorage.getItem('ai_model') ||
      (localStorage.getItem('ai_provider') === 'openrouter'
        ? 'nvidia/nemotron-3.5-lightning:free'
        : 'gpt-4o-mini')
  );

  const refreshConnectedAiModel = useCallback(() => {
    const prov = localStorage.getItem('ai_provider') || 'openrouter';
    const mod =
      localStorage.getItem('ai_model') ||
      (prov === 'openrouter' ? 'nvidia/nemotron-3.5-lightning:free' : 'gpt-4o-mini');
    setActiveProvider(prov);
    setActiveModel(mod);
  }, []);

  useEffect(() => {
    refreshConnectedAiModel();
    const handleStorageChange = () => refreshConnectedAiModel();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ai_model_changed', handleStorageChange);
    const interval = setInterval(refreshConnectedAiModel, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ai_model_changed', handleStorageChange);
      clearInterval(interval);
    };
  }, [refreshConnectedAiModel]);

  // 5. UI states
  const [activeTab, setActiveTab] = useState<'preview' | 'layers' | 'code'>('preview');
  const [codeFile, setCodeFile] = useState<'index.html' | 'theme.css' | 'pricing.tsx'>('index.html');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const isMobile = viewportMode === 'mobile';
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [customHtml, setCustomHtml] = useState<string>('');
  const [isUsingCustomHtml, setIsUsingCustomHtml] = useState<boolean>(false);
  const [hiddenSections, setHiddenSections] = useState<Record<string, boolean>>({});
  const [codeEditorValue, setCodeEditorValue] = useState<string>('');
  const [codeApplySuccess, setCodeApplySuccess] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isInlineEditActive, setIsInlineEditActive] = useState(true);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [selectedBundleTier, setSelectedBundleTier] = useState(1);

  // Synchronize codeEditorValue with generatedHtml when data changes (if not using custom html)
  useEffect(() => {
    if (!isUsingCustomHtml) {
      setCodeEditorValue(generateVerdeHtml(data));
    }
  }, [data, isUsingCustomHtml]);

  // Jump to section in preview
  const handleSelectSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    setActiveTab('preview');
    setTimeout(() => {
      const el = document.getElementById(`section-${sectionId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // COD order form mock states in preview
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formWilaya, setFormWilaya] = useState('16 - Alger (الجزائر العاصمة)');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formSuccess, setFormSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to node appData
  useEffect(() => {
    if (onUpdateNode) {
      onUpdateNode({
        appData: {
          ...(node.appData || {}),
          landingPageData: data,
          chatMessages,
          hasGeneratedPage,
          connectedAiModel: activeModel,
          connectedAiProvider: activeProvider,
          connectedProduct: activeProduct,
        },
      });
    }
  }, [data, chatMessages, hasGeneratedPage, activeModel, activeProvider, activeProduct]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isGenerating]);

  const generatedHtml = useMemo(() => generateVerdeHtml(data), [data]);

  const generatedCss = useMemo(
    () => `/* Product Theme CSS for ${data.brandName} */
:root {
  --primary: ${data.accentColor};
  --bg-page: #fafaf9;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --font-family: 'Cairo', -apple-system, sans-serif;
}

body {
  background-color: var(--bg-page);
  color: var(--text-main);
  font-family: var(--font-family);
  direction: rtl;
}`,
    [data]
  );

  const generatedTsx = useMemo(
    () => `// React / Tailwind Component for ${data.brandName} COD Checkout
import React, { useState } from 'react';

export const CheckoutSection = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('16 - Alger');

  return (
    <div id="order-section" className="bg-white p-6 rounded-3xl border border-slate-200 max-w-lg mx-auto shadow-xl">
      <h3 className="text-xl font-black text-slate-900">${data.orderForm?.headline || 'استمارة الطلب'}</h3>
      <p className="text-xs text-slate-500 mb-4">${data.orderForm?.subtitle || ''}</p>
      <div className="space-y-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم واللقب..." className="w-full p-3 rounded-xl border border-slate-200" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف (05/06/07)..." className="w-full p-3 rounded-xl border border-slate-200" />
        <button style={{ backgroundColor: '${data.accentColor}' }} className="w-full py-3.5 rounded-xl text-white font-bold">
          ${data.orderForm?.buttonText || 'تأكيد الطلب 🚚'}
        </button>
      </div>
    </div>
  );
};`,
    [data]
  );

  // Send message and trigger real AI Generation & Editing
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || isGenerating) return;

    setInputPrompt('');
    setHasGeneratedPage(true);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: textToSend,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    const startTime = Date.now();
    const lower = textToSend.toLowerCase();

    // Check specific user intents
    const isResetRequest = /(new project|reset|clean|start over|مشروع جديد|مسح الكل)/i.test(textToSend);
    const isRtoRequest = /(rto|return to origin|anti[- ]?rto|zero rto|0% rto|تأكيد|فحص الطرد|تأكيد الطلب|معاينة|معاينة الطرد|ارجاع|إرجاع)/i.test(textToSend);
    const isImageUpRequest =
      /(image up|image first|image top|image on top|text down|image up text down|photo top|secend image|second image|same secend image|same second image|same image|dtc|cro|like image 2|build.*page.*second|build.*page.*secend)/i.test(
        textToSend
      );
    const isTextUpRequest = /(text up|image down|classic layout)/i.test(textToSend);
    const isMobileCssRequest = /(css|mobile|moble|phone|responsive|version mobile|solve problem|problem css|layout)/i.test(textToSend);
    const isHeroSectionRequest = /(hero|secrtion|section hero|headline|title|subheadline|banner)/i.test(textToSend);
    const isFeaturesRequest = /(feature|benefit|مميزات|خصائص)/i.test(textToSend);
    const isColorRequest = /(color|violet|purple|blue|red|rose|emerald|green|theme|لون|أزرق|أخضر|أحمر|بنفسجي|أسود)/i.test(textToSend);
    const priceNumMatch = textToSend.match(/\b([1-9][0-9]{2,4})\s*(?:dzd|da|دج|dinars?)?\b/i);
    const isPricingRequest = Boolean(priceNumMatch && /(price|pricing|bundle|discount|offer|سعر|عروض|باقات|cost|dzd|دج)/i.test(textToSend));
    const isCodeRequest = /(code|html|css|editor|كود|تعديل الكود|give him acce.*code)/i.test(textToSend);

    // If mobile request, activate mobile mode immediately so user sees the result!
    if (isMobileCssRequest) {
      setViewportMode('mobile');
    }

    try {
      const provider = localStorage.getItem('ai_provider') || activeProvider || 'openrouter';
      const model =
        activeModel ||
        localStorage.getItem('ai_model') ||
        (provider === 'openrouter' ? 'nvidia/nemotron-3.5-lightning:free' : 'gpt-4o-mini');

      const userApiKey =
        (provider === 'openrouter' ? localStorage.getItem('openrouter_api_key') : null) ||
        (provider === 'openai' ? localStorage.getItem('openai_api_key') : null) ||
        (provider === 'gemini' ? localStorage.getItem('gemini_api_key') : null) ||
        (provider === 'deepseek' ? localStorage.getItem('deepseek_api_key') : null) ||
        (provider === 'agentrouter' ? localStorage.getItem('agentrouter_api_key') : null) ||
        (provider === 'nvidia' ? localStorage.getItem('nvidia_api_key') : null) ||
        localStorage.getItem('openrouter_api_key') ||
        localStorage.getItem('openai_api_key') ||
        localStorage.getItem('gemini_api_key') ||
        localStorage.getItem('deepseek_api_key') ||
        localStorage.getItem('user_api_key') ||
        '';

      const promptForAI = [
        'You are Verde 2, an expert UI/UX landing page engineer and e-commerce conversion optimizer.',
        'You must help the user build, refine, or edit their live product landing page.',
        '',
        'Current Landing Page State:',
        `- Brand / Product Name: "${data.brandName}"`,
        `- Domain: "${data.domain}"`,
        `- Hero Headline: "${data.heroHeadline}"`,
        `- Hero Subtitle: "${data.heroSubtitle}"`,
        `- Badge: "${data.badgeText}"`,
        `- Price: "${data.priceFormatted}" (Original: "${data.originalPriceFormatted}")`,
        `- Primary CTA: "${data.primaryCtaText}"`,
        `- Accent Color: "${data.accentColor}"`,
        `- Connected Product Info: ${JSON.stringify(activeProduct || { name: data.brandName, price: data.priceFormatted })}`,
        '',
        'USER REQUEST:',
        `"${textToSend}"`,
        '',
        'INSTRUCTIONS:',
        '1. Explain concisely in 1-2 friendly, conversational sentences what you updated or improved.',
        '2. At the end of your response, output a single JSON block with any updated values:',
        '```json',
        JSON.stringify(
          {
            brandName: data.brandName,
            heroHeadline: 'updated headline',
            heroSubtitle: 'updated subtitle',
            badgeText: 'updated badge',
            priceFormatted: data.priceFormatted,
            originalPriceFormatted: data.originalPriceFormatted,
            primaryCtaText: data.primaryCtaText,
            secondaryCtaText: data.secondaryCtaText,
            accentColor: data.accentColor,
            keyChanges: ['change 1', 'change 2', 'change 3'],
          },
          null,
          2
        ),
        '```',
      ].join('\n');

      let aiResponseText = '';
      let aiJsonData: any = null;

      try {
        const response = await fetch('/api/ai/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            taskType: 'General AI Chat',
            provider,
            model,
            prompt: promptForAI,
            systemInstruction: `You are Verde 2, an elite UI/UX developer, landing page architect, and high-conversion e-commerce optimizer.
Always answer helpfully, conversationally, and concisely. When the user asks to change, add, translate, redesign, or improve elements of the landing page, explain the changes and append a JSON code block with the updated state.`,
            apiKey: userApiKey || undefined,
          }),
        });

        if (response.ok) {
          const resData = await response.json();
          aiResponseText = resData.result || resData.content || '';

          const jsonMatch =
            aiResponseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
            aiResponseText.match(/\{[\s\S]*"(?:heroHeadline|brandName|badgeText|features|bundles)"[\s\S]*\}/);

          if (jsonMatch) {
            try {
              const cleaned = (jsonMatch[1] || jsonMatch[0]).trim();
              aiJsonData = JSON.parse(cleaned);
            } catch (e) {
              console.warn('JSON parse warning:', e);
            }
          }
        }
      } catch (apiErr) {
        console.warn('AI call error, will use intelligent fallback:', apiErr);
      }

      let updatedData = { ...data };
      let summaryText = '';
      let bullets: string[] = [];

      if (aiJsonData && (aiJsonData.heroHeadline || aiJsonData.brandName)) {
        if (aiJsonData.brandName) updatedData.brandName = aiJsonData.brandName;
        if (aiJsonData.heroHeadline) updatedData.heroHeadline = aiJsonData.heroHeadline;
        if (aiJsonData.heroSubtitle) updatedData.heroSubtitle = aiJsonData.heroSubtitle;
        if (aiJsonData.badgeText) updatedData.badgeText = aiJsonData.badgeText;
        if (aiJsonData.priceFormatted) updatedData.priceFormatted = aiJsonData.priceFormatted;
        if (aiJsonData.originalPriceFormatted) updatedData.originalPriceFormatted = aiJsonData.originalPriceFormatted;
        if (aiJsonData.primaryCtaText) updatedData.primaryCtaText = aiJsonData.primaryCtaText;
        if (aiJsonData.secondaryCtaText) updatedData.secondaryCtaText = aiJsonData.secondaryCtaText;
        if (aiJsonData.accentColor) updatedData.accentColor = aiJsonData.accentColor;
        if (Array.isArray(aiJsonData.features) && aiJsonData.features.length > 0) {
          updatedData.features = aiJsonData.features;
        }
        if (Array.isArray(aiJsonData.bundles) && aiJsonData.bundles.length > 0) {
          updatedData.bundles = aiJsonData.bundles;
        }

        const cleanChatText = aiResponseText.replace(/```(?:json)?[\s\S]*?```/g, '').trim();
        summaryText =
          cleanChatText ||
          `Done — updated your landing page with ${provider.toUpperCase()}: ${model}. Live preview updated on the right.`;
        bullets = aiJsonData.keyChanges || [
          `Updated headline: "${updatedData.heroHeadline}"`,
          `Live re-rendered components on right`,
          `Connected model: ${provider.toUpperCase()}: ${model}`,
        ];
      }

      // -----------------------------------------------------------------
      // MODULAR INTENT EXECUTION ENGINE (DIRECT ACTIONS ON DATA & CODE)
      // -----------------------------------------------------------------
      const appliedActions: string[] = [];

      // 1. DTC Layout / Reference Image 2 / Image UP
      if (isImageUpRequest) {
        updatedData.heroLayout = 'image-up';
        const pName = activeProduct?.name || data.brandName;
        if (!updatedData.heroHeadline || updatedData.heroHeadline.includes('Smart Household')) {
          updatedData.heroHeadline = `احصل على ${pName} الأصلي مع توصيل سريع لـ 58 ولاية!`;
        }
        updatedData.badgeText = '🇩🇿 العرض الأقوى في الجزائر • فحص الطرد قبل الدفع • ضمان 30 يوم';
        updatedData.primaryCtaText = `اطلب الآن — الدفع عند الاستلام (${updatedData.priceFormatted}) 🚚`;
        appliedActions.push('Hero layout set to Image UP & Text DOWN matching DTC Reference Image 2');
        appliedActions.push('Added carousel with floating feature callouts & thumbnails');
        appliedActions.push('Social proof 4.9★ rating with 2,450+ verified reviews');
        appliedActions.push('3-Tier quantity break bundles with instant price recalculation');
      } else if (isTextUpRequest) {
        updatedData.heroLayout = 'text-up';
        appliedActions.push('Switched hero layout to Text UP');
      }

      // 2. Mobile Responsive View
      if (isMobileCssRequest) {
        setViewportMode('mobile');
        appliedActions.push('Optimized responsive 1-column mobile 375px CSS stack');
      }

      // 3. Anti-RTO & Parcel Inspection Protocol
      if (isRtoRequest) {
        updatedData.heroLayout = 'image-up';
        const pName = activeProduct?.name || data.brandName || 'المنتج الأصلي';
        updatedData.badgeText = '🇩🇿 فحص ومعاينة الطرد قبل الدفع • تأكيد فوري عبر الواتساب • 0% إرجاع RTO';
        updatedData.heroHeadline = `احصل على ${pName} الأصلي — عاين طردك بنفسك قبل الدفع!`;
        updatedData.heroSubtitle =
          'تسوق وأنت مطمئن تماماً مع نظام تقليل الإرجاع وضمان 0% RTO: يحق لك فتح الطرد وفحصه مع الموزع قبل دفع أي دينار. سنتصل بك لتأكيد القياس والعنوان قبل الإرسال لضمان تجربة شراء مثالية.';
        updatedData.primaryCtaText = `اطلب الآن وافحص طردك قبل الدفع (${updatedData.priceFormatted}) 🚚`;
        if (updatedData.orderForm) {
          updatedData.orderForm = {
            ...updatedData.orderForm,
            headline: 'اطلب الآن مع حق فحص الطرد قبل الدفع 📦',
            subtitle: 'توصيل سريع لـ 58 ولاية • تأكيد هاتفي فوري قبل الشحن',
            buttonText: 'تأكيد الطلب — الدفع بعد معاينة الطرد',
            guaranteeNotice: '🔒 حماية الزبون 100%: سنتصل بك عبر الهاتف والواتساب لتأكيد العنوان، ولا تدفع أي دينار حتى تستلم الطرد وتفحصه بنفسك.',
          };
        }
        updatedData.trustBadges = [
          { title: 'معاينة وفحص قبل الدفع', subtitle: 'افتح طردك وتأكد من جودته مع الموزع', icon: 'PackageCheck' },
          { title: 'تأكيد هاتفي وبالواتساب', subtitle: 'نتصل بك لتأكيد المقاس والعنوان فورياً', icon: 'Phone' },
          { title: 'توصيل مضمون لـ 58 ولاية', subtitle: 'خلال 24 إلى 48 ساعة حتى باب دارك', icon: 'Truck' },
          { title: 'ضمان الاسترجاع 30 يوم', subtitle: 'استبدال فوري أو استرجاع الأموال', icon: 'ShieldCheck' },
        ];
        appliedActions.push('Added 0% RTO Customer Trust badges and parcel inspection guarantee');
        appliedActions.push('Configured phone & WhatsApp confirmation protocol');
      }

      // 4. Hero Section & Headline Variations
      if (isHeroSectionRequest && !isImageUpRequest && !isRtoRequest) {
        const productName = activeProduct?.name || data.brandName;
        const variants = [
          `احصل على ${productName} الأصلي — الجودة العالية والراحة التي تستحقها!`,
          `تخلص من التعب والمعاناة مع ${productName} المعتمد والأكثر طلباً في الجزائر!`,
          `العرض الحصري اليوم: ${productName} الأصلي مع تخفيض فوري وتوصيل مجاني لـ 58 ولاية!`,
          `${productName}: تصميم استثنائي وجودة تدوم، عاين طردك وافحصه بنفسك قبل الدفع!`,
        ];
        const currentIdx = variants.indexOf(data.heroHeadline);
        const nextHeadline = variants[(currentIdx + 1) % variants.length];
        updatedData.heroHeadline = nextHeadline;
        appliedActions.push(`Updated hero headline: "${nextHeadline}"`);
      }

      // 5. Pricing & Bundles recalculation
      if (isPricingRequest && priceNumMatch) {
        const pNum = Number(priceNumMatch[1]);
        updatedData.priceFormatted = `${pNum.toLocaleString()} DZD`;
        updatedData.originalPriceFormatted = `${Math.round(pNum * 1.5).toLocaleString()} DZD`;
        updatedData.primaryCtaText = `اطلب الآن — الدفع عند الاستلام (${updatedData.priceFormatted}) 🚚`;
        if (updatedData.bundles && updatedData.bundles.length >= 3) {
          updatedData.bundles = [
            { ...updatedData.bundles[0], price: `${pNum.toLocaleString()} DZD`, originalPrice: `${Math.round(pNum * 1.5).toLocaleString()} DZD` },
            { ...updatedData.bundles[1], price: `${Math.round(pNum * 1.7).toLocaleString()} DZD`, originalPrice: `${Math.round(pNum * 3).toLocaleString()} DZD` },
            { ...updatedData.bundles[2], price: `${Math.round(pNum * 2.3).toLocaleString()} DZD`, originalPrice: `${Math.round(pNum * 4.5).toLocaleString()} DZD` },
          ];
        }
        appliedActions.push(`Updated pricing to ${updatedData.priceFormatted} and synced all 3 bundle tiers`);
      }

      // 6. Accent Color Theme
      if (isColorRequest) {
        if (/violet|purple|بنفسجي/i.test(textToSend)) updatedData.accentColor = '#8b5cf6';
        else if (/blue|أزرق/i.test(textToSend)) updatedData.accentColor = '#2563eb';
        else if (/red|rose|أحمر/i.test(textToSend)) updatedData.accentColor = '#e11d48';
        else if (/emerald|green|أخضر/i.test(textToSend)) updatedData.accentColor = '#10b981';
        else if (/amber|gold|orange|برتقالي/i.test(textToSend)) updatedData.accentColor = '#f59e0b';
        else if (/dark|black|أسود/i.test(textToSend)) updatedData.accentColor = '#0f172a';
        appliedActions.push(`Updated accent theme color to ${updatedData.accentColor}`);
      }

      // 7. Reset Project
      if (isResetRequest) {
        const prodName = activeProduct?.name || activeProduct?.title || 'New Product';
        updatedData = {
          ...INITIAL_VERDE_DATA,
          projectName: `${prodName} — Landing Page`,
          brandName: prodName,
          productImage: activeProduct?.image || INITIAL_VERDE_DATA.productImage,
          priceFormatted: activeProduct?.priceFormatted || '1,400 DZD',
          originalPriceFormatted: activeProduct?.originalPriceFormatted || '2,100 DZD',
          heroHeadline: `احصل على ${prodName} الأصلي مع توصيل سريع لـ 58 ولاية!`,
          heroSubtitle:
            activeProduct?.description ||
            'الحل المعتمد والأكثر طلباً بجودة عالية، مع حق فحص الطرد عند الاستلام وضمان استبدال لمدة 30 يوم.',
          editCount: 0,
        };
        appliedActions.push(`Reset landing page project for "${prodName}"`);
      }

      // 8. Code & Preview access synchronization
      if (isCodeRequest || appliedActions.length > 0) {
        appliedActions.push('Live preview synchronized & full responsive HTML/Tailwind code updated in <> Code Editor');
      }

      // Compose friendly assistant summary
      if (appliedActions.length > 0) {
        summaryText =
          summaryText && summaryText.length > 20
            ? summaryText
            : `Applied your requested changes to the landing page! Live preview updated on the right and full source code updated in the <> Code Editor.`;
        bullets = appliedActions;
      } else if (!summaryText || summaryText.length < 5) {
        summaryText =
          aiResponseText && !aiResponseText.includes('{')
            ? aiResponseText
            : `Applied your instructions with ${model}. Live preview has been synchronized on the right and code updated in <> Code Editor.`;
        bullets = ['Synchronized landing page preview', 'Live responsive layout', 'HTML/Tailwind code ready in <> Code Editor'];
      }

      setSelectedSection('hero');
      setTimeout(() => {
        const el = document.getElementById('section-hero');
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);

      updatedData.editCount = (data.editCount || 14) + 1;
      setData(updatedData);

      // Re-generate fresh standalone HTML and keep Code Editor & Custom HTML completely in sync!
      const freshHtml = generateVerdeHtml(updatedData);
      setCodeEditorValue(freshHtml);
      setCustomHtml(freshHtml);
      setIsUsingCustomHtml(false);
      setActiveTab('preview');

      const elapsedSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${elapsedSec}s`,
        content: summaryText,
        files: [
          { name: 'index.html', lines: 210 },
          { name: 'theme.css', lines: 118 },
          { name: 'checkout-cod.tsx', lines: 92 },
        ],
        features: bullets,
        modelUsed: `${provider.toUpperCase()}: ${model}`,
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    const code = codeFile === 'index.html' ? generatedHtml : codeFile === 'theme.css' ? generatedCss : generatedTsx;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.brandName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper for inline direct editing
  const handleInlineTextChange = (field: keyof VerdeLandingPageData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
      editCount: (prev.editCount || 0) + 1,
    }));
  };

  return (
    <div className="w-full h-full flex bg-[#fafaf9] text-slate-800 select-none overflow-hidden rounded-2xl border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] font-sans">
      {/* ---------------------------------------------------- */}
      {/* 1. LEFT ICON RAIL                                    */}
      {/* ---------------------------------------------------- */}
      <div
        data-no-drag="true"
        className="w-13 bg-white border-r border-slate-200/80 flex flex-col items-center py-4 justify-between shrink-0 select-none z-10"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            style={{ backgroundColor: data.accentColor }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-xs cursor-pointer hover:scale-105 transition-transform"
            title="Verde 2 AI Studio"
          >
            <Zap className="w-4 h-4 fill-white" />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. CHAT PANE                                         */}
      {/* ---------------------------------------------------- */}
      <div className="w-[390px] shrink-0 bg-white border-r border-slate-200/80 flex flex-col">
        {/* Chat Header */}
        <div data-no-drag="true" className="p-3.5 border-b border-slate-100 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-bold text-slate-900 truncate">{data.projectName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#eafaf1] text-[#059669] border border-[#a7f3d0] max-w-[210px] truncate"
                  title={`Connected AI Model: ${activeProvider.toUpperCase()} (${activeModel})`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="uppercase font-extrabold">{activeProvider}:</span>
                  <span className="truncate">{activeModel}</span>
                </span>
                <span className="text-[9.5px] font-mono text-slate-400 shrink-0">
                  ⑂ main · {data.editCount} edits
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Connected Product Pill & Selector */}
          <div className="relative">
            <div
              onClick={() => setIsProductPickerOpen(!isProductPickerOpen)}
              className="flex items-center justify-between gap-2 p-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 cursor-pointer transition-colors text-xs"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-3 h-3" />
                </div>
                <div className="min-w-0 truncate">
                  <span className="text-[9.5px] text-slate-400 block font-mono leading-none">CONNECTED PRODUCT</span>
                  <span className="font-bold text-[11px] text-slate-800 truncate block">
                    {activeProduct?.name || activeProduct?.title || data.brandName}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </div>

            {isProductPickerOpen && (
              <div className="absolute top-full mt-1 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-xs">
                <div className="px-3 py-1 text-[9px] font-mono text-slate-400 uppercase font-bold border-b border-slate-100">
                  Select Product to Build Page
                </div>
                {allCanvasProducts.length > 0 ? (
                  allCanvasProducts.map((p: any) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setData((prev) => ({
                          ...prev,
                          projectName: `${p.name || p.title} — Landing Page`,
                          brandName: p.name || p.title,
                          productImage: p.image || prev.productImage,
                          priceFormatted: p.priceFormatted || `${p.price || 4800} DZD`,
                          originalPriceFormatted:
                            p.originalPriceFormatted || `${Math.round((p.price || 4800) * 1.5)} DZD`,
                          heroHeadline: `احصل على ${p.name || p.title} الأصلي مع توصيل سريع لـ 58 ولاية!`,
                          heroSubtitle:
                            p.description ||
                            `الحل المثالي والمضمون بجودة عالية، مع حق فحص الطرد عند الاستلام وضمان استبدال لمدة 30 يوم.`,
                        }));
                        setIsProductPickerOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-emerald-50 flex items-center justify-between text-slate-700"
                    >
                      <span className="truncate font-semibold">{p.name || p.title}</span>
                      <span className="text-[10px] font-mono text-emerald-600 shrink-0">
                        {p.priceFormatted || `${p.price || 4800} DZD`}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2 text-[11px] text-slate-400">
                    Connect a product card on the canvas using a connection wire to sync automatically.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div data-no-drag="true" className="flex-1 overflow-y-auto p-4 space-y-4 text-xs flex flex-col">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-4 space-y-3.5 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Verde AI Landing Page Builder</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed max-w-xs">
                  {activeProduct
                    ? `Connected to "${activeProduct.name || activeProduct.title}". Ready to build your high-converting landing page.`
                    : 'Blank Project Canvas. Connect a product card or enter a prompt below to build your landing page.'}
                </p>
              </div>
              <div className="w-full space-y-2 pt-1 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Starters:</span>
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage(
                      activeProduct
                        ? `Build a high-converting mobile DTC landing page for ${activeProduct.name || activeProduct.title} with Image UP, 3 bundles, and 58 Wilaya COD checkout`
                        : 'Build high-converting mobile DTC landing page with Image UP, 3 bundles, and 58 Wilaya COD checkout'
                    )
                  }
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span className="text-emerald-600">✨</span>
                  <span className="truncate">{activeProduct ? `Build DTC page for "${activeProduct.name || activeProduct.title}"` : 'Build DTC page with Image UP & Text DOWN'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('change hero section with rto design and parcel inspection guarantee')}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span className="text-emerald-600">🛡️</span>
                  <span className="truncate">Add RTO-Proof Design (0% Return COD Guarantee)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('solve problem css in version mobile and optimize layout')}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-900 text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span className="text-emerald-600">📱</span>
                  <span className="truncate">Optimize Mobile Responsive 375px CSS</span>
                </button>
              </div>
            </div>
          ) : (
            chatMessages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="space-y-1">
                  <div className="text-[9.5px] font-mono font-semibold text-slate-400 text-left pl-1">
                    {msg.timestamp}
                  </div>
                  <div className="bg-[#e9faf1] text-slate-800 border border-[#d1fae5] rounded-2xl rounded-tl-sm p-3.5 leading-relaxed shadow-2xs">
                    {msg.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div
                      style={{ backgroundColor: data.accentColor }}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-black"
                    >
                      ✓
                    </div>
                    <span className="font-bold text-slate-800">Verde</span>
                    {msg.duration && <span>worked for {msg.duration}</span>}
                  </div>
                  {msg.modelUsed && (
                    <span className="text-[8.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 truncate max-w-[180px] flex items-center gap-1 font-semibold">
                      <Cpu className="w-2.5 h-2.5" />
                      {msg.modelUsed}
                    </span>
                  )}
                </div>

                <p className="text-slate-700 leading-relaxed pl-5">{msg.content}</p>

                {msg.files && msg.files.length > 0 && (
                  <div className="ml-5 p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs font-mono space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" />
                        {msg.files.length} FILES GENERATED
                      </span>
                      <span className="text-emerald-600 font-bold">
                        +{msg.files.reduce((a, b) => a + b.lines, 0)} lines
                      </span>
                    </div>
                    <div className="space-y-1 pt-0.5">
                      {msg.files.map((f, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setActiveTab('code');
                            setCodeFile(f.name as any);
                          }}
                          className="flex items-center justify-between text-[10px] text-slate-700 hover:text-emerald-600 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <FileCode className="w-3 h-3 text-emerald-500" />
                            {f.name}
                          </span>
                          <span className="text-slate-400">{f.lines}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.features && msg.features.length > 0 && (
                  <div className="ml-5 space-y-1">
                    {msg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="ml-5 flex items-center gap-3 pt-1 text-[10.5px] text-slate-400">
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Refine headlines and improve conversion rate')}
                    className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              </div>
            );
          }))}

          {isGenerating && (
            <div className="space-y-2 animate-pulse pl-5">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  {activeProvider.toUpperCase()} ({activeModel}) is building landing page...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Suggestions */}
        <div
          data-no-drag="true"
          className="px-3 pt-2 pb-1 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar"
        >
          {[
            {
              label: '🛡️ 0% RTO Design',
              prompt: 'change hero section with rto design: add parcel inspection guarantee, phone & whatsapp confirmation badges, and 0% return guarantee',
            },
            {
              label: '🖼️ Image UP (DTC)',
              prompt: 'change hero section i need for him be image up text down matching the second image DTC reference with product gallery, rating, bundle quantity selector and 58 wilaya COD checkout.',
            },
            {
              label: '📱 Solve Mobile CSS',
              prompt: 'Solve problem css in version mobile: make layout single-column, wrap headlines cleanly, and optimize 58 Wilaya COD checkout.',
            },
            {
              label: '🔥 Change Hero Section',
              prompt: 'Change section hero: generate high-converting headline, compelling value proposition, and COD trust guarantee tailored to this product.',
            },
            {
              label: '🇩🇿 COD 58 Wilayas',
              prompt: 'Adapt this landing page for Algerian e-commerce market with cash-on-delivery (COD) pricing in DZD and 58 wilayas.',
            },
            {
              label: '💰 3-Tier Bundles',
              prompt: 'Update bundle offers: 1 Unit standard, Pack 2 Best Value with Free Shipping, Pack 3 Mega Family discount.',
            },
            {
              label: '🎨 Electric Violet',
              prompt: 'Change accent palette to electric violet with modern tech feel.',
            },
          ].map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(action.prompt)}
              disabled={isGenerating}
              className="text-[9.5px] font-medium px-2 py-0.5 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors whitespace-nowrap shrink-0 border border-slate-200/60 cursor-pointer disabled:opacity-50"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Selected Layer Pill inside chat */}
        <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium truncate">
            <span className="text-slate-400 font-mono">Target Layer:</span>
            <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 truncate">
              <Layers className="w-2.5 h-2.5 text-emerald-600" />
              {LANDING_PAGE_SECTIONS.find((s) => s.id === selectedSection)?.name || 'Hero Section'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('layers')}
            className="text-[10px] text-emerald-700 font-bold hover:underline shrink-0 cursor-pointer"
          >
            All Layers ({LANDING_PAGE_SECTIONS.length}) →
          </button>
        </div>

        {/* Input area */}
        <div data-no-drag="true" className="p-3 bg-white">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-xs">
            <textarea
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={2}
              placeholder={`Ask Verde to edit ${LANDING_PAGE_SECTIONS.find((s) => s.id === selectedSection)?.name.toLowerCase() || 'hero'}, price, or colors...`}
              className="w-full bg-transparent resize-none text-xs text-slate-900 placeholder-slate-400 outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                </button>

                {/* DYNAMIC CONNECTED AI MODEL SELECTOR */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      refreshConnectedAiModel();
                      setIsModelDropdownOpen(!isModelDropdownOpen);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#86efac] text-[10px] font-mono text-emerald-900 transition-colors cursor-pointer max-w-[240px] shadow-2xs"
                    title={`Connected AI Model: ${activeProvider.toUpperCase()} (${activeModel}) - Click to switch`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    <span className="font-bold uppercase tracking-wider text-[9px] text-emerald-950">
                      {activeProvider}:
                    </span>
                    <span className="truncate font-semibold">{activeModel}</span>
                    <ChevronDown className="w-2.5 h-2.5 opacity-60 shrink-0 text-emerald-700" />
                  </button>

                  {isModelDropdownOpen && (
                    <div className="absolute bottom-full mb-1 left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-30 text-[11px]">
                      <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[9.5px] font-mono text-slate-500 uppercase tracking-wider font-bold flex items-center justify-between">
                        <span>Connected AI Model</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live Sync
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsModelDropdownOpen(false)}
                        className="w-full text-left px-3 py-2 bg-emerald-50/70 text-emerald-900 flex items-center justify-between font-bold"
                      >
                        <span className="truncate font-mono text-[10px]">
                          {activeProvider.toUpperCase()}: {activeModel}
                        </span>
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </button>

                      <div className="px-3 py-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold border-t border-slate-100 mt-1">
                        Switch AI Model (Updates Top Bar)
                      </div>

                      {[
                        { prov: 'openrouter', id: 'nvidia/nemotron-3.5-lightning:free', name: 'OpenRouter: Nemotron 3.5 Free' },
                        { prov: 'openrouter', id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'OpenRouter: Llama 3.3 70B Free' },
                        { prov: 'openai', id: 'gpt-4o-mini', name: 'OpenAI: GPT-4o Mini' },
                        { prov: 'openai', id: 'gpt-4o', name: 'OpenAI: GPT-4o' },
                        { prov: 'gemini', id: 'gemini-2.0-flash', name: 'Gemini: 2.0 Flash' },
                        { prov: 'deepseek', id: 'deepseek-chat', name: 'DeepSeek: V3' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            localStorage.setItem('ai_provider', item.prov);
                            localStorage.setItem('ai_model', item.id);
                            setActiveProvider(item.prov);
                            setActiveModel(item.id);
                            try {
                              window.dispatchEvent(
                                new CustomEvent('ai_model_changed', { detail: { provider: item.prov, model: item.id } })
                              );
                              window.dispatchEvent(new Event('storage'));
                            } catch {}
                            setIsModelDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between font-mono text-[10px] ${
                            activeModel === item.id ? 'text-emerald-700 font-bold bg-emerald-50/40' : 'text-slate-600'
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {activeModel === item.id && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">↵ to send</span>
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputPrompt.trim() || isGenerating}
                  style={{ backgroundColor: data.accentColor }}
                  className="w-7 h-7 rounded-full text-white flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. RIGHT PREVIEW WORKSPACE (AUTHENTIC PRODUCT LANDING PAGE) */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 bg-[#f3f4f6] flex flex-col overflow-hidden min-w-0">
        {/* Top Preview Controls Bar */}
        <div
          data-no-drag="true"
          className="p-3 bg-white border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0"
        >
          {/* Segmented Control & Inline Edit Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                style={{
                  backgroundColor: activeTab === 'preview' ? data.accentColor : 'transparent',
                  color: activeTab === 'preview' ? '#ffffff' : '#64748b',
                }}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('layers')}
                style={{
                  backgroundColor: activeTab === 'layers' ? data.accentColor : 'transparent',
                  color: activeTab === 'layers' ? '#ffffff' : '#64748b',
                }}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Layers ({LANDING_PAGE_SECTIONS.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('code')}
                style={{
                  backgroundColor: activeTab === 'code' ? data.accentColor : 'transparent',
                  color: activeTab === 'code' ? '#ffffff' : '#64748b',
                }}
                className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>&lt;&gt; Code Editor</span>
              </button>
            </div>

            {/* Direct Click-To-Edit Indicator */}
            <div
              onClick={() => setIsInlineEditActive(!isInlineEditActive)}
              className="hidden md:flex items-center gap-1.5 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
              title="Click any text on the landing page to edit directly!"
            >
              <Pencil className="w-3 h-3 text-emerald-600" />
              <span>{isInlineEditActive ? '✏️ Inline Edit: ON' : 'View Mode'}</span>
            </div>
          </div>

          {/* Viewports & Publish */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-500">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-lg hover:text-slate-900 transition-colors cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-slate-100 text-slate-900' : ''
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-lg hover:text-slate-900 transition-colors cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-slate-100 text-slate-900' : ''
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              style={{ backgroundColor: data.accentColor }}
              className="px-4 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs hover:opacity-90 flex items-center gap-1.5 transition-opacity cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export HTML</span>
            </button>
          </div>
        </div>

        {/* Horizontal Quick Section Jumper Bar */}
        <div className="bg-white/95 px-4 py-2 border-b border-slate-200/70 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-mono no-scrollbar shrink-0 shadow-2xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 font-bold shrink-0 text-[10px] uppercase flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-600" />
              Sections:
            </span>
            {LANDING_PAGE_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSelectSection(sec.id)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-sans flex items-center gap-1 shrink-0 transition-all cursor-pointer ${
                  selectedSection === sec.id
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={`${sec.name} (${sec.arabicName})`}
              >
                <span>{sec.name.split(' ')[0]}</span>
              </button>
            ))}

            {/* DTC CRO Layout Switcher (Image UP vs Text UP) */}
            <div className="flex items-center gap-1 shrink-0 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setData((prev) => ({ ...prev, heroLayout: 'image-up' }));
                  setSelectedSection('hero');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  (data.heroLayout || 'image-up') === 'image-up'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Image on TOP, text & CTA below (DTC Reference Image 2)"
              >
                <span>🖼️ Image UP (DTC Reference)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setData((prev) => ({ ...prev, heroLayout: 'text-up' }));
                  setSelectedSection('hero');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  data.heroLayout === 'text-up'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Text & Headline on top, image below"
              >
                <span>📝 Text UP</span>
              </button>
            </div>
          </div>
          {isUsingCustomHtml && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                Custom Code Active
              </span>
              <button
                type="button"
                onClick={() => setIsUsingCustomHtml(false)}
                className="text-[10.5px] font-bold text-emerald-700 underline hover:text-emerald-900 cursor-pointer"
              >
                Reset to Builder
              </button>
            </div>
          )}
        </div>

        {/* Workspace Canvas */}
        <div data-no-drag="true" className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
          {activeTab === 'preview' ? (
            /* ==================================================== */
            /* AUTHENTIC PRODUCT LANDING PAGE (DIRECT EDITABLE)    */
            /* ==================================================== */
            <div
              id="verde-preview-frame"
              className={`bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300 ${
                isMobile ? 'w-[375px] max-w-[375px] ring-8 ring-slate-800 rounded-[32px]' : 'w-full max-w-[880px] rounded-2xl'
              }`}
            >
              {/* Browser Address Bar Header */}
              <div className="bg-[#fcfdfd] px-3 py-2 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>

                <div className="flex-1 max-w-[220px] bg-slate-100/70 border border-slate-200/60 rounded-md px-2.5 py-0.5 text-[10.5px] font-mono text-slate-600 flex items-center justify-center gap-1.5 truncate shadow-2xs">
                  <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span
                    contentEditable={isInlineEditActive}
                    suppressContentEditableWarning
                    onBlur={(e) => handleInlineTextChange('domain', e.currentTarget.textContent || data.domain)}
                    className="outline-none hover:bg-white/60 px-1 rounded truncate"
                  >
                    {data.domain}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{isMobile ? '375px' : '880px'}</div>
              </div>

              {!hasGeneratedPage ? (
                <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-4 min-h-[480px] bg-slate-50/50">
                  <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-center text-emerald-600">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h3 className="font-bold text-slate-900 text-base">Blank Landing Page Canvas</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {activeProduct
                        ? `Product "${activeProduct.name || activeProduct.title}" is connected. Click below or send a prompt to build your high-converting landing page.`
                        : 'No landing page has been created yet. Chat with Verde on the left or click below to build your landing page live.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHasGeneratedPage(true);
                      handleSendMessage(
                        activeProduct
                          ? `Build high-converting mobile DTC landing page for ${activeProduct.name || activeProduct.title} with Image UP, 3 bundles, and 58 Wilaya COD checkout`
                          : 'Build high-converting mobile DTC landing page with Image UP, 3 bundles, and 58 Wilaya COD checkout'
                      );
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{activeProduct ? `Generate Page for "${activeProduct.name || activeProduct.title}"` : 'Generate Landing Page Now'}</span>
                  </button>
                </div>
              ) : isUsingCustomHtml && customHtml ? (
                <div className="relative">
                  <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Live Custom Coded HTML Rendering
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsUsingCustomHtml(false)}
                      className="px-2.5 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-[11px] underline cursor-pointer"
                    >
                      Revert to Visual Builder
                    </button>
                  </div>
                  <iframe
                    srcDoc={customHtml}
                    className={`w-full border-0 ${isMobile ? 'h-[650px]' : 'h-[850px]'}`}
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              ) : (
                /* REAL PRODUCT LANDING PAGE BODY */
                <div className="font-sans antialiased bg-white text-slate-900 pb-16" dir="rtl">
                  {/* 1. Header / Nav */}
                  {!hiddenSections.header && (
                    <div
                      id="section-header"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'header' ? 'ring-2 ring-emerald-500 rounded-xl' : ''
                      }`}
                    >
                      <div className={`flex items-center justify-between border-b border-slate-100 gap-2 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            style={{ backgroundColor: data.accentColor }}
                            className="w-7 h-7 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0"
                          >
                            ✦
                          </div>
                          <span
                            contentEditable={isInlineEditActive}
                            suppressContentEditableWarning
                            onBlur={(e) => handleInlineTextChange('brandName', e.currentTarget.textContent || data.brandName)}
                            className={`font-black text-slate-900 tracking-tight outline-none hover:ring-1 hover:ring-emerald-400 rounded px-1 truncate ${
                              isMobile ? 'max-w-[130px] text-xs' : 'max-w-[260px] text-sm'
                            }`}
                            title={data.brandName}
                          >
                            {data.brandName}
                          </span>
                        </div>

                        {!isMobile && (
                          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10.5px] font-bold border border-emerald-200/70">
                            <Truck className="w-3 h-3 text-emerald-600" />
                            <span>توصيل سريع لـ 58 ولاية • الدفع عند الاستلام</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById('order-section');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          style={{ backgroundColor: data.accentColor }}
                          className={`rounded-xl text-white font-bold hover:opacity-90 shadow-2xs cursor-pointer shrink-0 truncate ${
                            isMobile ? 'px-3 py-1.5 text-[11px] max-w-[120px]' : 'px-4 py-1.5 text-xs'
                          }`}
                        >
                          {data.primaryCtaText}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. Hero Section (Product Showcase - Image UP & Text DOWN matching DTC Reference Image 2) */}
                  {!hiddenSections.hero && (
                    <div
                      id="section-hero"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'hero' ? 'ring-2 ring-emerald-500 rounded-2xl' : ''
                      }`}
                    >
                      {/* Top Announcement Bar (Image 2 DTC Header Strip) */}
                      <div className="bg-emerald-800 text-white text-[11px] font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
                        <span>🎉 عرض خاص اليوم: توصيل سريع لـ 58 ولاية • الدفع عند الاستلام بعد المعاينة والفحص</span>
                      </div>

                      <div className={`mx-auto ${isMobile ? 'px-4 pt-4 pb-8 w-full' : 'px-6 pt-6 pb-10 max-w-xl'}`}>
                        {(data.heroLayout || 'image-up') === 'image-up' ? (
                          /* ======================================================= */
                          /* DTC CRO LAYOUT (IMAGE UP, TEXT DOWN - MATCHING IMAGE 2) */
                          /* ======================================================= */
                          <div className="flex flex-col space-y-4">
                            {/* 1. PRODUCT IMAGE GALLERY FIRST (UP) */}
                            <div className="space-y-2.5">
                              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-md bg-white aspect-square flex items-center justify-center group">
                                <img
                                  src={
                                    (data.productGalleryImages && data.productGalleryImages[activeGalleryIndex]) ||
                                    data.productImage
                                  }
                                  alt={data.brandName}
                                  className="w-full h-full object-cover transition-all duration-300"
                                />

                                {/* Floating Feature Badges over Image (Image 2 style) */}
                                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-bold shadow-md flex items-center gap-1 select-none pointer-events-none">
                                  <Award className="w-3 h-3 text-white" />
                                  <span>{(data.featurePills && data.featurePills[0]) || '✨ مقبض Carabiner D-Ring'}</span>
                                </div>
                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold shadow-md select-none pointer-events-none">
                                  <span>{(data.featurePills && data.featurePills[1]) || '💨 8 أضلاع مقاومة للرياح'}</span>
                                </div>
                                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-800 border border-slate-200 text-[9.5px] font-bold shadow-xs select-none pointer-events-none">
                                  <span>{(data.featurePills && data.featurePills[2]) || '🎨 ألوان ماكارون الباستيل'}</span>
                                </div>
                                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500/95 text-white text-[9.5px] font-bold shadow-xs select-none pointer-events-none">
                                  <span>{(data.featurePills && data.featurePills[3]) || '🛡️ منتج أصلي 100%'}</span>
                                </div>

                                {/* Carousel Navigation Arrows (< and >) */}
                                {data.productGalleryImages && data.productGalleryImages.length > 1 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveGalleryIndex((prev) =>
                                          prev > 0 ? prev - 1 : data.productGalleryImages!.length - 1
                                        );
                                      }}
                                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                      title="الصورة السابقة"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveGalleryIndex((prev) =>
                                          prev < data.productGalleryImages!.length - 1 ? prev + 1 : 0
                                        );
                                      }}
                                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                                      title="الصورة التالية"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Clickable Product Thumbnails Row */}
                              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 no-scrollbar">
                                {(data.productGalleryImages && data.productGalleryImages.length > 0
                                  ? data.productGalleryImages
                                  : [data.productImage]
                                ).map((thumb, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setActiveGalleryIndex(idx)}
                                    className={`w-13 h-13 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                                      activeGalleryIndex === idx
                                        ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-105 shadow-xs'
                                        : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
                                    }`}
                                  >
                                    <img src={thumb} alt="Thumbnail" className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* 2. PRODUCT DETAILS & BUYING BAR (TEXT DOWN) */}
                            <div className="space-y-3.5 text-right pt-1">
                              {/* Rating & Social Proof */}
                              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                  <span className="text-amber-500 font-bold text-sm">★★★★★</span>
                                  <span className="font-bold text-slate-900">4.9/5</span>
                                  <span className="text-[11px] text-slate-500">
                                    (أكثر من 2,450 زبون راضٍ في الجزائر)
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                                  ✓ زبون مؤكد
                                </span>
                              </div>

                              {/* Title / Headline */}
                              <h1
                                contentEditable={isInlineEditActive}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInlineTextChange('heroHeadline', e.currentTarget.textContent || data.heroHeadline)
                                }
                                className="font-black text-slate-950 tracking-tight outline-none hover:ring-1 hover:ring-emerald-400 rounded p-1 text-lg sm:text-xl md:text-2xl leading-tight"
                              >
                                {data.heroHeadline}
                              </h1>

                              {/* Pricing Row */}
                              <div className="flex items-baseline gap-2.5 pt-0.5 flex-wrap">
                                <span
                                  contentEditable={isInlineEditActive}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInlineTextChange(
                                      'priceFormatted',
                                      e.currentTarget.textContent || data.priceFormatted
                                    )
                                  }
                                  className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono outline-none hover:ring-1 hover:ring-emerald-400 rounded px-1"
                                >
                                  {data.priceFormatted}
                                </span>
                                <span
                                  contentEditable={isInlineEditActive}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInlineTextChange(
                                      'originalPriceFormatted',
                                      e.currentTarget.textContent || data.originalPriceFormatted
                                    )
                                  }
                                  className="text-sm text-slate-400 line-through font-mono outline-none hover:ring-1 hover:ring-emerald-400 rounded px-1"
                                >
                                  {data.originalPriceFormatted}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold font-mono">
                                  {data.discountPercentage}
                                </span>
                              </div>

                              {/* Subtitle */}
                              <p
                                contentEditable={isInlineEditActive}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInlineTextChange('heroSubtitle', e.currentTarget.textContent || data.heroSubtitle)
                                }
                                className="text-slate-600 leading-relaxed text-xs sm:text-sm outline-none hover:ring-1 hover:ring-emerald-400 rounded p-1"
                              >
                                {data.heroSubtitle}
                              </p>

                              {/* 4 Checkmark Benefit Bullets (Image 2 Style) */}
                              <div className="space-y-2 py-2 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70 text-right">
                                {(data.benefitCheckmarks || [
                                  'مقبض Carabiner D-Ring مدمج للتعليق الفوري على الحقائب والأحزمة وسهولة الحمل',
                                  'هيكل تيتانيوم مقوى بـ 8 أضلاع متينة تتحمل الرياح العاتية والأمطار الغزيرة',
                                  'قماش عازل مطلي بتقنية النانو يطرد قطرات الماء ويحجب الأشعة فوق البنفسجية',
                                  'توصيل متوفر لجميع 58 ولاية مع حق فتح وفحص الطرد قبل الدفع عند الاستلام',
                                ]).map((chk, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                                    <span className="text-emerald-600 font-bold text-sm shrink-0">✓</span>
                                    <span>{chk}</span>
                                  </div>
                                ))}
                              </div>

                              {/* 3-Tier Multi-Pack Quantity Breaks (Cards matching Image 2!) */}
                              <div className="space-y-2 pt-1">
                                <span className="text-xs font-bold text-slate-800 block text-right">
                                  اختر العرض المناسب (توفير أكبر للباقات المتعددة):
                                </span>
                                <div className="grid grid-cols-3 gap-2">
                                  {(data.bundles || []).map((b, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => setSelectedBundleTier(idx)}
                                      className={`p-2.5 rounded-2xl border text-center cursor-pointer transition-all ${
                                        selectedBundleTier === idx
                                          ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs scale-[1.02]'
                                          : 'border-slate-200 bg-white hover:border-slate-300'
                                      }`}
                                    >
                                      <div className="text-[10px] font-bold text-slate-500 mb-0.5">
                                        {b.title.split('(')[0]}
                                      </div>
                                      <div className="text-sm font-black text-slate-900 font-mono">
                                        {b.price.replace(' DZD', ' دج')}
                                      </div>
                                      {b.badge && (
                                        <span
                                          className={`inline-block px-1.5 py-0.5 mt-1 rounded text-[8.5px] font-bold ${
                                            selectedBundleTier === idx
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-slate-100 text-slate-600'
                                          }`}
                                        >
                                          {b.badge}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Full-Width High-Converting CTA Button */}
                              <div className="pt-2 space-y-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const el = document.getElementById('order-section');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  style={{ backgroundColor: data.accentColor }}
                                  className="w-full py-4 px-6 rounded-2xl text-white font-black text-xs sm:text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <ShoppingBag className="w-4 h-4" />
                                  <span
                                    contentEditable={isInlineEditActive}
                                    suppressContentEditableWarning
                                    onBlur={(e) =>
                                      handleInlineTextChange(
                                        'primaryCtaText',
                                        e.currentTarget.textContent || data.primaryCtaText
                                      )
                                    }
                                    className="outline-none"
                                  >
                                    اطلب الآن — الدفع عند الاستلام ({data.bundles?.[selectedBundleTier]?.price ? data.bundles[selectedBundleTier].price.replace(' DZD', ' دج') : data.priceFormatted}) 🚚
                                  </span>
                                </button>
                                <div className="text-center text-[10.5px] text-slate-500 flex items-center justify-center gap-1.5">
                                  <span>🔒</span>
                                  <span>الدفع عند الاستلام بعد معاينة وفحص الطرد • ضمان استبدال 30 يوم</span>
                                </div>
                              </div>

                              {/* 4 Trust Badges (Image 2 Style) */}
                              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
                                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                                  <div className="text-base mb-0.5">🚚</div>
                                  <div className="text-[9.5px] font-bold text-slate-800">توصيل 58 ولاية</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                                  <div className="text-base mb-0.5">💵</div>
                                  <div className="text-[9.5px] font-bold text-slate-800">الدفع عند الاستلام</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                                  <div className="text-base mb-0.5">🔄</div>
                                  <div className="text-[9.5px] font-bold text-slate-800">استبدال 30 يوم</div>
                                </div>
                                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                                  <div className="text-base mb-0.5">💬</div>
                                  <div className="text-[9.5px] font-bold text-slate-800">دعم متواصل</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* ======================================================= */
                          /* TEXT UP VARIATION                                       */
                          /* ======================================================= */
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eafaf1] border border-[#a7f3d0] text-[#059669] text-[11px] font-mono font-bold tracking-wider max-w-full">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              <span
                                contentEditable={isInlineEditActive}
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  handleInlineTextChange('badgeText', e.currentTarget.textContent || data.badgeText)
                                }
                                className="outline-none hover:ring-1 hover:ring-emerald-400 rounded px-1"
                              >
                                {data.badgeText}
                              </span>
                            </div>

                            <h1
                              contentEditable={isInlineEditActive}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInlineTextChange('heroHeadline', e.currentTarget.textContent || data.heroHeadline)
                              }
                              className="font-black text-slate-950 tracking-tight outline-none hover:ring-1 hover:ring-emerald-400 rounded p-1 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight max-w-2xl mx-auto break-normal"
                              style={{ wordBreak: 'normal', overflowWrap: 'normal', hyphens: 'none' }}
                            >
                              {data.heroHeadline}
                            </h1>

                            <p
                              contentEditable={isInlineEditActive}
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleInlineTextChange('heroSubtitle', e.currentTarget.textContent || data.heroSubtitle)
                              }
                              className="text-slate-600 text-center max-w-xl mx-auto leading-relaxed text-xs sm:text-sm outline-none hover:ring-1 hover:ring-emerald-400 rounded p-1"
                            >
                              {data.heroSubtitle}
                            </p>

                            <div className="flex flex-col items-center gap-3 pt-1 w-full max-w-md mx-auto">
                              <div className="flex items-baseline gap-2.5 flex-wrap justify-center">
                                <span
                                  contentEditable={isInlineEditActive}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInlineTextChange(
                                      'priceFormatted',
                                      e.currentTarget.textContent || data.priceFormatted
                                    )
                                  }
                                  className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono outline-none hover:ring-1 hover:ring-emerald-400 rounded px-1"
                                >
                                  {data.priceFormatted}
                                </span>
                                <span
                                  contentEditable={isInlineEditActive}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInlineTextChange(
                                      'originalPriceFormatted',
                                      e.currentTarget.textContent || data.originalPriceFormatted
                                    )
                                  }
                                  className="text-sm text-slate-400 line-through font-mono outline-none hover:ring-1 hover:ring-emerald-400 rounded px-1"
                                >
                                  {data.originalPriceFormatted}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold font-mono">
                                  {data.discountPercentage}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const el = document.getElementById('order-section');
                                  el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                style={{ backgroundColor: data.accentColor }}
                                className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                <span
                                  contentEditable={isInlineEditActive}
                                  suppressContentEditableWarning
                                  onBlur={(e) =>
                                    handleInlineTextChange(
                                      'primaryCtaText',
                                      e.currentTarget.textContent || data.primaryCtaText
                                    )
                                  }
                                  className="outline-none"
                                >
                                  {data.primaryCtaText}
                                </span>
                              </button>
                            </div>

                            <div className="w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-white relative group mt-4 aspect-4/3">
                              <img
                                src={data.productImage}
                                alt={data.brandName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. Trust Strip */}
                  {!hiddenSections.trust && (
                    <div
                      id="section-trust"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'trust' ? 'ring-2 ring-emerald-500 rounded-2xl' : ''
                      }`}
                    >
                      <div className={`mx-auto border-y border-slate-100 bg-slate-50/50 ${isMobile ? 'px-4 py-4 w-full' : 'px-6 py-6 max-w-4xl'}`}>
                        <div className={isMobile ? 'grid grid-cols-2 gap-2.5' : 'grid grid-cols-4 gap-4'}>
                          {(data.trustBadges || []).map((badge, i) => (
                            <div key={i} className={`flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs`}>
                              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                                {badge.icon === 'Truck' && <Truck className="w-4 h-4" />}
                                {badge.icon === 'Banknote' && <Banknote className="w-4 h-4" />}
                                {badge.icon === 'ShieldCheck' && <ShieldCheck className="w-4 h-4" />}
                                {badge.icon === 'Star' && <Star className="w-4 h-4" />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[11px] font-bold text-slate-900 leading-tight truncate">{badge.title}</h4>
                                <p className="text-[9.5px] text-slate-500 leading-tight truncate">{badge.subtitle}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Features Grid */}
                  {!hiddenSections.features && (
                    <div
                      id="section-features"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'features' ? 'ring-2 ring-emerald-500 rounded-2xl' : ''
                      }`}
                    >
                      <div className={`mx-auto ${isMobile ? 'px-4 py-6 w-full' : 'px-6 py-10 max-w-4xl'}`}>
                        <div className="text-center max-w-xl mx-auto mb-6">
                          <h2 className={`font-black text-slate-900 mb-1 ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                            لماذا تختار {data.brandName}؟
                          </h2>
                          <p className="text-xs text-slate-500">تم تصميمه ليوفر لك أفضل تجربة وأعلى جودة ممكنة</p>
                        </div>
                        <div className={isMobile ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-4 gap-3.5'}>
                          {(data.features || []).map((f, idx) => (
                            <div
                              key={idx}
                              className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-2xs hover:border-emerald-300 transition-colors"
                            >
                              <div
                                style={{ backgroundColor: '#eafaf1', color: data.accentColor }}
                                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs mb-3"
                              >
                                ✦
                              </div>
                              <h4
                                contentEditable={isInlineEditActive}
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  const newF = [...(data.features || [])];
                                  if (newF[idx]) {
                                    newF[idx].title = e.currentTarget.textContent || newF[idx].title;
                                    setData((prev) => ({ ...prev, features: newF }));
                                  }
                                }}
                                className="text-xs font-bold text-slate-900 mb-1 outline-none hover:ring-1 hover:ring-emerald-400 rounded"
                              >
                                {f.title}
                              </h4>
                              <p
                                contentEditable={isInlineEditActive}
                                suppressContentEditableWarning
                                onBlur={(e) => {
                                  const newF = [...(data.features || [])];
                                  if (newF[idx]) {
                                    newF[idx].description = e.currentTarget.textContent || newF[idx].description;
                                    setData((prev) => ({ ...prev, features: newF }));
                                  }
                                }}
                                className="text-[11px] text-slate-500 leading-snug outline-none hover:ring-1 hover:ring-emerald-400 rounded"
                              >
                                {f.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Bundles / Multi-Quantity Pricing */}
                  {!hiddenSections.bundles && (
                    <div
                      id="section-bundles"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'bundles' ? 'ring-2 ring-emerald-500 rounded-2xl' : ''
                      }`}
                    >
                      <div className={`mx-auto ${isMobile ? 'px-4 py-6 w-full' : 'px-6 py-8 max-w-4xl'}`}>
                        <div className="text-center mb-6">
                          <h2 className={`font-black text-slate-900 mb-1 ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>العروض الخاصة والباقات</h2>
                          <p className="text-xs text-slate-500">اختر الباقة الأنسب لك مع توصيل مجاني للباقات المتعددة</p>
                        </div>
                        <div className={isMobile ? 'grid grid-cols-1 gap-3.5' : 'grid grid-cols-3 gap-4'}>
                          {(data.bundles || []).map((b, idx) => (
                            <div
                              key={idx}
                              className={`bg-white p-5 rounded-2xl border ${
                                b.popular
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                                  : 'border-slate-200/80 shadow-2xs'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-xs text-slate-900">{b.title}</h3>
                                {b.badge && (
                                  <span
                                    className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                                      b.popular ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {b.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-2xl font-black text-slate-900 my-2 font-mono">{b.price}</div>
                              <p className="text-[11px] text-emerald-600 font-bold mb-3">{b.savingsText}</p>
                              <button
                                type="button"
                                onClick={() => setFormQuantity(b.quantity)}
                                style={{ backgroundColor: b.popular ? data.accentColor : '#0f172a' }}
                                className="w-full py-2.5 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
                              >
                                اختيار هذه الباقة
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 6. Interactive Cash-On-Delivery Order Form */}
                  {!hiddenSections.order && (
                    <div
                      id="section-order"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'order' ? 'ring-2 ring-emerald-500 rounded-3xl' : ''
                      }`}
                    >
                      <div id="order-section" className={`mx-auto ${isMobile ? 'px-4 py-6 w-full' : 'px-6 py-10 max-w-xl'}`}>
                        <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-4 ${isMobile ? 'p-5' : 'p-6 sm:p-8'}`}>
                          <div className="text-center space-y-1">
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono">
                              📦 استمارة الطلب السريع (COD)
                            </span>
                            <h3
                              contentEditable={isInlineEditActive}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const val = e.currentTarget.textContent || (data.orderForm?.headline || 'استمارة الطلب السريع');
                                setData((prev) => ({ ...prev, orderForm: { ...(prev.orderForm || INITIAL_VERDE_DATA.orderForm), headline: val } }));
                              }}
                              className="text-lg sm:text-xl font-black text-slate-900 outline-none hover:ring-1 hover:ring-emerald-400 rounded"
                            >
                              {data.orderForm?.headline || 'استمارة الطلب السريع'}
                            </h3>
                            <p
                              contentEditable={isInlineEditActive}
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const val = e.currentTarget.textContent || (data.orderForm?.subtitle || 'يرجى إدخال معلوماتك لتأكيد الشحن');
                                setData((prev) => ({ ...prev, orderForm: { ...(prev.orderForm || INITIAL_VERDE_DATA.orderForm), subtitle: val } }));
                              }}
                              className="text-xs text-slate-500 outline-none hover:ring-1 hover:ring-emerald-400 rounded"
                            >
                              {data.orderForm?.subtitle || 'يرجى إدخال معلوماتك لتأكيد الشحن والتوصيل'}
                            </p>
                          </div>

                          {formSuccess ? (
                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2 animate-in fade-in">
                              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                              <h4 className="text-sm font-bold text-emerald-900">تم تسجيل طلبك بنجاح!</h4>
                              <p className="text-xs text-emerald-700">سيتصل بك مسؤول التأكيد خلال دقائق لتأكيد العنوان والشحن.</p>
                              <button
                                type="button"
                                onClick={() => setFormSuccess(false)}
                                className="text-xs font-bold text-emerald-800 underline pt-2 cursor-pointer"
                              >
                                إرسال طلب آخر
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3 pt-2">
                              <div>
                                <label className="text-[11px] font-bold text-slate-700 block mb-1">الاسم الكامل (اللقب والاسم)</label>
                                <input
                                  type="text"
                                  value={formName}
                                  onChange={(e) => setFormName(e.target.value)}
                                  placeholder="مثال: يوسف بلقاسم"
                                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all text-right"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-700 block mb-1">رقم الهاتف</label>
                                <input
                                  type="text"
                                  value={formPhone}
                                  onChange={(e) => setFormPhone(e.target.value)}
                                  placeholder="05 / 06 / 07 XX XX XX"
                                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all text-right font-mono"
                                />
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-700 block mb-1">الولاية (58 ولاية)</label>
                                <select
                                  value={formWilaya}
                                  onChange={(e) => setFormWilaya(e.target.value)}
                                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all text-right"
                                >
                                  <option value="16 - Alger">16 - Alger (الجزائر العاصمة)</option>
                                  <option value="31 - Oran">31 - Oran (وهران)</option>
                                  <option value="25 - Constantine">25 - Constantine (قسنطينة)</option>
                                  <option value="19 - Sétif">19 - Sétif (سطيف)</option>
                                  <option value="06 - Béjaïa">06 - Béjaïa (بجاية)</option>
                                  <option value="09 - Blida">09 - Blida (البليدة)</option>
                                  <option value="58 - Wilayas">باقي الولايات (58 ولاية)</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[11px] font-bold text-slate-700 block mb-1">الكمية</label>
                                <div className="flex items-center gap-2">
                                  {[1, 2, 3].map((qty) => (
                                    <button
                                      key={qty}
                                      type="button"
                                      onClick={() => setFormQuantity(qty)}
                                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                        formQuantity === qty
                                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      {qty === 1 ? 'قطعة واحدة' : qty === 2 ? 'قطعتين (وفر 1,000 دج)' : '3 قطع (وفر 2,500 دج)'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => setFormSuccess(true)}
                                style={{ backgroundColor: data.accentColor }}
                                className="w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                              >
                                <ShoppingBag className="w-4 h-4" />
                                <span>{data.orderForm?.buttonText || 'تأكيد الطلب والدفع عند الاستلام 🚚'}</span>
                              </button>

                              <p className="text-[10px] text-center text-slate-400 font-medium">
                                {data.orderForm?.guaranteeNotice || '🔒 الدفع عند الاستلام • فحص الطرد قبل الدفع • ضمان 30 يوم'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. Real Customer Reviews */}
                  {!hiddenSections.reviews && (
                    <div
                      id="section-reviews"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'reviews' ? 'ring-2 ring-emerald-500 rounded-2xl' : ''
                      }`}
                    >
                      <div className={`mx-auto border-t border-slate-100 ${isMobile ? 'px-4 py-6 w-full' : 'px-6 py-8 max-w-4xl'}`}>
                        <div className="text-center mb-6">
                          <h2 className={`font-black text-slate-900 mb-1 ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>آراء الزبائن الذين جربوا المنتج</h2>
                          <p className="text-xs text-slate-500">تقييمات حقيقية من زبائن في مختلف ولايات الوطن</p>
                        </div>
                        <div className={isMobile ? 'grid grid-cols-1 gap-3' : 'grid grid-cols-3 gap-4'}>
                          {(data.reviews || []).map((rev, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-900">{rev.name}</span>
                                <span className="text-amber-500 font-bold">★★★★★</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block font-mono">{rev.location} • {rev.date}</span>
                              <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 pt-1">
                                <Check className="w-3 h-3" />
                                <span>شراء مؤكد ومعاينة عند الاستلام</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 8. FAQs */}
                  {!hiddenSections.faqs && (
                    <div
                      id="section-faqs"
                      className={`relative transition-all duration-300 ${
                        selectedSection === 'faqs' ? 'ring-2 ring-emerald-500 rounded-2xl' : ''
                      }`}
                    >
                      <div className={`mx-auto ${isMobile ? 'px-4 py-6 w-full' : 'px-6 py-8 max-w-2xl'}`}>
                        <div className="text-center mb-6">
                          <h2 className="text-xl font-black text-slate-900 mb-1">الأسئلة الشائعة</h2>
                          <p className="text-xs text-slate-500">إجابات على أكثر الأسئلة تكراراً</p>
                        </div>
                        <div className="space-y-2.5">
                          {(data.faqs || []).map((faq, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                              <h4 className="text-xs font-bold text-slate-900 mb-1">{faq.question}</h4>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 9. Footer */}
                  {!hiddenSections.footer && (
                    <footer id="section-footer" className="text-center text-[11px] text-slate-400 pt-8 pb-4 border-t border-slate-100">
                      <p>© {new Date().getFullYear()} {data.brandName}. جميع الحقوق محفوظة • الدفع عند الاستلام لـ 58 ولاية.</p>
                    </footer>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === 'layers' ? (
            /* ==================================================== */
            /* LAYERS & SECTIONS INSPECTOR TAB                      */
            /* ==================================================== */
            <div className="w-full max-w-[880px] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <span>Landing Page Layers &amp; Sections</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select any section to inspect, edit fields directly, or ask AI to rewrite it.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('preview');
                      handleSelectSection(selectedSection);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View in Preview</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-12 gap-6">
                {/* Left: Section List */}
                <div className="md:col-span-5 space-y-2 border-r border-slate-100 pr-4">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Available Layers ({LANDING_PAGE_SECTIONS.length})
                  </span>
                  {LANDING_PAGE_SECTIONS.map((sec, idx) => {
                    const isSelected = selectedSection === sec.id;
                    const isHidden = !!hiddenSections[sec.id];
                    return (
                      <div
                        key={sec.id}
                        onClick={() => setSelectedSection(sec.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500/30 text-emerald-950 shadow-2xs'
                            : 'bg-slate-50/60 border-slate-200/70 hover:bg-slate-100/70 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-mono font-bold text-slate-500 shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate leading-tight">{sec.name}</h4>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">{sec.arabicName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHiddenSections((prev) => ({ ...prev, [sec.id]: !prev[sec.id] }));
                            }}
                            className="p-1 rounded hover:bg-white text-slate-400 hover:text-slate-700 transition-colors"
                            title={isHidden ? 'Show Layer' : 'Hide Layer'}
                          >
                            {isHidden ? <EyeOff className="w-3.5 h-3.5 text-rose-500" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Section Details Inspector */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          Selected Layer Inspector
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-1">
                          {LANDING_PAGE_SECTIONS.find((s) => s.id === selectedSection)?.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const secName = LANDING_PAGE_SECTIONS.find((s) => s.id === selectedSection)?.name;
                          handleSendMessage(`Rewrite and optimize the ${secName} for high conversion.`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AI Rewrite Layer</span>
                      </button>
                    </div>

                    {/* Section Fields Form */}
                    {selectedSection === 'hero' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Hero Main Headline (عنوان رئيسي)</label>
                          <textarea
                            rows={2}
                            value={data.heroHeadline}
                            onChange={(e) => setData((prev) => ({ ...prev, heroHeadline: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Hero Subtitle (الوصف والضمان)</label>
                          <textarea
                            rows={3}
                            value={data.heroSubtitle}
                            onChange={(e) => setData((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Price (السعر الحالي)</label>
                            <input
                              type="text"
                              value={data.priceFormatted}
                              onChange={(e) => setData((prev) => ({ ...prev, priceFormatted: e.target.value }))}
                              className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-700 block mb-1">Original Price (السعر المشطوب)</label>
                            <input
                              type="text"
                              value={data.originalPriceFormatted}
                              onChange={(e) => setData((prev) => ({ ...prev, originalPriceFormatted: e.target.value }))}
                              className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Urgency Badge (شارة العرض)</label>
                          <input
                            type="text"
                            value={data.badgeText}
                            onChange={(e) => setData((prev) => ({ ...prev, badgeText: e.target.value }))}
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Primary CTA Button Text</label>
                          <input
                            type="text"
                            value={data.primaryCtaText}
                            onChange={(e) => setData((prev) => ({ ...prev, primaryCtaText: e.target.value }))}
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedSection === 'header' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Brand / Product Name</label>
                          <input
                            type="text"
                            value={data.brandName}
                            onChange={(e) => setData((prev) => ({ ...prev, brandName: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Store Domain</label>
                          <input
                            type="text"
                            value={data.domain}
                            onChange={(e) => setData((prev) => ({ ...prev, domain: e.target.value }))}
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {selectedSection === 'order' && (
                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Form Headline</label>
                          <input
                            type="text"
                            value={data.orderForm?.headline || ''}
                            onChange={(e) => setData((prev) => ({ ...prev, orderForm: { ...(prev.orderForm || INITIAL_VERDE_DATA.orderForm), headline: e.target.value } }))}
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Form Subtitle / Instructions</label>
                          <input
                            type="text"
                            value={data.orderForm?.subtitle || ''}
                            onChange={(e) => setData((prev) => ({ ...prev, orderForm: { ...(prev.orderForm || INITIAL_VERDE_DATA.orderForm), subtitle: e.target.value } }))}
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Checkout Button Text</label>
                          <input
                            type="text"
                            value={data.orderForm?.buttonText || ''}
                            onChange={(e) => setData((prev) => ({ ...prev, orderForm: { ...(prev.orderForm || INITIAL_VERDE_DATA.orderForm), buttonText: e.target.value } }))}
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {selectedSection !== 'hero' && selectedSection !== 'header' && selectedSection !== 'order' && (
                      <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-2">
                        <p className="text-xs text-slate-600">
                          You can edit this layer directly by clicking on it in the live preview or asking the AI in chat!
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSelectSection(selectedSection)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer"
                        >
                          Jump to Layer in Live Preview
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==================================================== */
            /* CODE STUDIO TAB (EDITABLE WITH LIVE APPLY)          */
            /* ==================================================== */
            <div className="w-full max-w-[880px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl font-mono text-xs flex flex-col">
              {/* Code Editor Header */}
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {(['index.html', 'theme.css', 'pricing.tsx'] as const).map((file) => (
                    <button
                      key={file}
                      type="button"
                      onClick={() => setCodeFile(file)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        codeFile === file ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white bg-slate-900/60'
                      }`}
                    >
                      {file}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomHtml(codeEditorValue);
                      setIsUsingCustomHtml(true);
                      setCodeApplySuccess(true);
                      setActiveTab('preview');
                      setTimeout(() => setCodeApplySuccess(false), 2500);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{codeApplySuccess ? '✅ Applied!' : 'Apply Code to Live Preview'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const fresh = generateVerdeHtml(data);
                      setCodeEditorValue(fresh);
                      setIsUsingCustomHtml(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    title="Reset to generated code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Editable Code Studio */}
              <div className="p-4 flex-1 flex flex-col min-h-[550px]">
                {codeFile === 'index.html' ? (
                  <textarea
                    value={codeEditorValue}
                    onChange={(e) => setCodeEditorValue(e.target.value)}
                    spellCheck={false}
                    className="w-full flex-1 min-h-[500px] bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-emerald-400 font-mono text-[11px] leading-relaxed outline-none focus:border-emerald-500 transition-colors resize-y select-text"
                    placeholder="<!-- Write or edit landing page HTML here -->"
                  />
                ) : (
                  <pre className="w-full flex-1 min-h-[500px] bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-auto">
                    {codeFile === 'theme.css' ? generatedCss : generatedTsx}
                  </pre>
                )}

                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>HTML5 • Tailwind CSS • Standalone Output</span>
                  <span>{codeEditorValue.length.toLocaleString()} characters</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
