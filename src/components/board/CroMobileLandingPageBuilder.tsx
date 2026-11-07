"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles,
  Play,
  RotateCw,
  Maximize2,
  X,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  Loader2,
  Layers,
  Wand2,
} from 'lucide-react';
// @ts-ignore
import LandingPageBuilder from './LandingPageBuilder.jsx';
// @ts-ignore
import {
  buildLandingStrategyPrompt,
  buildLandingSectionPrompt,
  buildLandingAuditPrompt,
  buildLandingOptimizePrompt,
  LANDING_STRATEGY_SCHEMA,
  LANDING_MANDATORY_SECTIONS,
  LANDING_AUDIT_SCHEMA,
  LANDING_OPTIMIZE_SCHEMA,
} from '../../utils/landing_prompt.js';
import type { CroProductFacts } from '../../utils/croLandingPageStrategy';

export interface CroMobileLandingPageBuilderProps {
  initialProduct?: CroProductFacts;
  initialData?: any;
  isModal?: boolean;
  onClose?: () => void;
  onSave?: (data: any) => void;
  onOpenFullscreen?: () => void;
  onDeleteNode?: () => void;
  onNavigateWorkflow?: (step: string) => void;
}

// Initial full 12-section dataset for instant live preview upon adding to canvas
function getInitialData(productName?: string) {
  const name = productName || 'NovaPro Precision Trimmer';
  return {
    strategy: {
      brandIdentity: {
        brandName: name,
        logoType: 'text-logo-from-name',
        colorPalette: { primary: '#2563eb', secondary: '#0f172a', accent: '#f59e0b', background: '#ffffff' },
        fonts: { headline: 'system-ui, -apple-system, sans-serif', body: 'system-ui, -apple-system, sans-serif' },
        vibe: 'clinical-trustworthy',
      },
      productContent: {
        photos: ['Studio hero photo on neutral background', 'Macro detail of precision blade', 'In-hand ergonomic grip', 'Waterproof IPX7 demonstration'],
        categoryLabel: 'Personal Grooming & Care',
        headline: 'The Last Grooming Tool You Will Ever Need. Effortless Precision.',
        description: 'Engineered with micro-precision dual-edge blades and quiet rotary tech to deliver zero irritation, 100% painless trimming every single time.',
        benefits: [
          { icon: 'ShieldCheck', label: '100% Painless', detail: 'Zero tugging or skin irritation guaranteed' },
          { icon: 'BatteryCharging', label: '90-Min Battery', detail: 'Fast USB-C recharge lasts up to 60 days' },
          { icon: 'Droplets', label: 'IPX7 Waterproof', detail: 'Rinse directly under running tap water' },
          { icon: 'Award', label: '2-Year Warranty', detail: 'Built with medical-grade stainless steel' },
        ],
        accordion: {
          description: 'Complete all-in-one precision grooming kit with interchangeable heads, cleaning brush, and USB-C cable.',
          ingredientsSpecs: '316L Stainless Steel Dual-Edge Rotary Blades, 7500 RPM Ultra-Quiet Motor, 600mAh Li-ion Battery.',
          howToUse: 'Turn on power button, gently guide tip into grooming area using circular motion. Rinse head clean after use.',
        },
      },
      pricingOffer: {
        regularPrice: '3,900 DZD',
        discountPrice: '2,790 DZD',
        percentOff: '-28%',
        subscription: { available: false, frequencies: [], savingsPercent: 0 },
        bundleQuantityDiscount: 'Buy 2 for 4,990 DZD (Save 600 DZD + Free Shipping)',
        shippingPolicy: 'Free Express Shipping Across 58 Wilayas · Pay On Delivery (COD)',
        guarantee: '30-Day Risk-Free Money Back Guarantee',
      },
      socialProof: {
        starRating: 4.9,
        reviewCount: 348,
        reviews: [
          { name: 'Karim B.', rating: 5, quote: 'Completely painless and super easy to clean. Delivery to Algiers took only 24 hours!' },
          { name: 'Sarah M.', rating: 5, quote: 'High quality build, feels heavy in hand like luxury salon equipment. Highly recommended.' },
          { name: 'Amine K.', rating: 5, quote: 'Best trimmer I have owned in years. The battery never dies.' },
        ],
      },
      navigation: {
        navItems: ['Features', 'Reviews', 'Specs', 'Track Order'],
        cartIcon: true,
        searchIcon: false,
        primaryCta: { label: 'ORDER NOW — PAY ON DELIVERY', url: '#sec-price_block' },
        urgency: { type: 'low-stock', label: '⚡ Only 14 Units Left in Stock for Today' },
      },
      conversion: {
        headlineAngle: 'Painless convenience and hygiene',
        offerStrategy: 'High-margin 2-unit bundle upsell with instant COD reassurance',
        trustStrategy: '58 Wilaya COD inspection before payment + 30-day warranty',
        objectionHandling: 'Guaranteed no skin pulling or irritation backed by 30-day money-back policy',
      },
      design: {
        primaryColor: '#2563eb',
        secondaryColor: '#0f172a',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        fontHeadline: 'system-ui, -apple-system, sans-serif',
        fontBody: 'system-ui, -apple-system, sans-serif',
        fontStyle: 'Inter, system-ui, sans-serif',
      },
      gaps: [],
    },
    sections: [
      {
        key: 'announcement_bar',
        name: 'Top Announcement Bar',
        orderIndex: 0,
        status: 'done',
        html: `<section id="sec-announcement_bar" data-lp-sec="announcement_bar" class="w-full bg-[#059669] text-white text-[11px] font-extrabold tracking-wide py-2 px-3 text-center flex items-center justify-center gap-1.5 shadow-xs sticky top-0 z-50">
  <span class="inline-block animate-pulse">🚚</span>
  <span data-lp-f="announcement_bar.headline">FREE 24-48H SHIPPING ACROSS 58 WILAYAS · PAY CASH ON ARRIVAL (COD)</span>
</section>`,
      },
      {
        key: 'nav',
        name: 'Sticky Nav Bar',
        orderIndex: 1,
        status: 'done',
        html: `<section id="sec-nav" data-lp-sec="nav" class="sticky top-[31px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
  <button class="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 transition-colors" aria-label="Menu">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
  </button>
  <a href="#sec-hero_carousel" class="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5 uppercase font-sans truncate max-w-[210px]" data-lp-f="nav.brand">
    <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
    <span class="truncate">${name}</span>
  </a>
  <div class="flex items-center gap-2">
    <button class="p-1.5 text-slate-700 hover:text-slate-900" aria-label="Search">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    </button>
    <a href="#sec-price_block" class="relative p-1.5 text-slate-700 hover:text-slate-900" aria-label="Cart">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
      <span class="absolute top-0 right-0 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">1</span>
    </a>
  </div>
</section>`,
      },
      {
        key: 'hero_carousel',
        name: 'Hero Image Carousel',
        orderIndex: 2,
        status: 'done',
        html: `<section id="sec-hero_carousel" data-lp-sec="hero_carousel" class="px-4 pt-3 pb-4 bg-white text-center">
  <!-- Hero Card with Floating Callout Badges (Exact DTC Match to VitalNest / PureVita / Glowara) -->
  <div class="relative w-full max-w-[360px] mx-auto bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 rounded-2xl border border-slate-200/90 p-4 shadow-sm overflow-hidden">
    <!-- Carousel Arrows -->
    <button class="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 shadow border border-slate-200/80 flex items-center justify-center text-slate-700 text-xs font-bold hover:bg-white z-20">‹</button>
    <button class="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 shadow border border-slate-200/80 flex items-center justify-center text-slate-700 text-xs font-bold hover:bg-white z-20">›</button>

    <!-- 4 Floating Badges with Checkmarks -->
    <div class="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs rounded-full px-2 py-0.5 text-[9.5px] font-bold text-slate-800 flex items-center gap-1 z-10" data-lp-f="hero_carousel.badge1">
      <span class="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px]">✓</span>
      <span>Medical-Grade Gel</span>
    </div>
    <div class="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs rounded-full px-2 py-0.5 text-[9.5px] font-bold text-slate-800 flex items-center gap-1 z-10" data-lp-f="hero_carousel.badge2">
      <span class="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px]">✓</span>
      <span>Instant Spine Relief</span>
    </div>
    <div class="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs rounded-full px-2 py-0.5 text-[9.5px] font-bold text-slate-800 flex items-center gap-1 z-10" data-lp-f="hero_carousel.badge3">
      <span class="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px]">✓</span>
      <span>Cool Honeycomb Mesh</span>
    </div>
    <div class="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs border border-slate-200/90 shadow-xs rounded-full px-2 py-0.5 text-[9.5px] font-bold text-slate-800 flex items-center gap-1 z-10" data-lp-f="hero_carousel.badge4">
      <span class="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[9px]">✓</span>
      <span>Never Flattens</span>
    </div>

    <!-- High-Fidelity 3D Cushion SVG -->
    <div class="w-full h-56 flex items-center justify-center relative my-1">
      <svg class="w-52 h-52 drop-shadow-lg" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="110" cy="190" rx="80" ry="14" fill="#047857" fill-opacity="0.15"/>
        <rect x="25" y="30" width="170" height="145" rx="36" fill="url(#gel_bg_init)" stroke="#059669" stroke-width="3"/>
        <path d="M48 60h124M48 85h124M48 110h124M48 135h124" stroke="#059669" stroke-opacity="0.35" stroke-width="2.5" stroke-dasharray="5 4"/>
        <path d="M65 42v120M95 42v120M125 42v120M155 42v120" stroke="#059669" stroke-opacity="0.35" stroke-width="2.5" stroke-dasharray="5 4"/>
        <path d="M90 30c0 18 8 28 20 28s20-10 20-28" fill="#ecfdf5" stroke="#059669" stroke-width="3"/>
        <circle cx="110" cy="112" r="30" fill="#10b981" fill-opacity="0.25" stroke="#059669" stroke-width="2.5"/>
        <path d="M102 112l6 6 14-14" stroke="#047857" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="gel_bg_init" x1="25" y1="30" x2="195" y2="175" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ffffff"/>
            <stop offset="0.3" stop-color="#ecfdf5"/>
            <stop offset="1" stop-color="#a7f3d0"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </div>

  <!-- Thumbnail Gallery Row (Matching image 2: labeled cards with icons, never empty boxes) -->
  <div class="flex items-center justify-center gap-2 mt-3 max-w-[360px] mx-auto">
    <div class="w-16 h-14 rounded-xl border-2 border-emerald-600 bg-emerald-50/70 p-1 flex flex-col items-center justify-center shadow-xs cursor-pointer">
      <svg class="w-4 h-4 text-emerald-700" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>
      <span class="text-[9.5px] font-black text-emerald-800 mt-0.5">Cushion</span>
    </div>
    <div class="w-16 h-14 rounded-xl border border-slate-200 bg-white p-1 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300">
      <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4zM4 12h16M12 4v16"/></svg>
      <span class="text-[9.5px] font-bold text-slate-600 mt-0.5">Gel Mesh</span>
    </div>
    <div class="w-16 h-14 rounded-xl border border-slate-200 bg-white p-1 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300">
      <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/></svg>
      <span class="text-[9.5px] font-bold text-slate-600 mt-0.5">In-Car</span>
    </div>
    <div class="w-16 h-14 rounded-xl border border-slate-200 bg-white p-1 flex flex-col items-center justify-center cursor-pointer hover:border-slate-300">
      <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <span class="text-[9.5px] font-bold text-slate-600 mt-0.5">Cover</span>
    </div>
  </div>
</section>`,
      },
      {
        key: 'rating_strip',
        name: 'Rating Strip',
        orderIndex: 3,
        status: 'done',
        html: `<section id="sec-rating_strip" data-lp-sec="rating_strip" class="py-2.5 px-3 bg-slate-50 border-y border-slate-100 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
  <div class="text-amber-400 text-xs tracking-wider font-black">★★★★★</div>
  <span class="font-extrabold text-slate-900" data-lp-f="rating_strip.score">4.9/5</span>
  <span class="text-slate-500 font-medium text-[11px]" data-lp-f="rating_strip.count">Loved by 3,876+ Happy Customers</span>
  <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[9.5px] flex items-center gap-0.5 shrink-0">✓ Verified</span>
</section>`,
      },
      {
        key: 'category_headline',
        name: 'Category Label + Benefit Headline',
        orderIndex: 4,
        status: 'done',
        html: `<section id="sec-category_headline" data-lp-sec="category_headline" class="px-4 pt-4 pb-2 text-left">
  <div class="flex items-center gap-2 mb-2">
    <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200/80" data-lp-f="category_headline.badge">
      CLINICALLY PROVEN • ERGONOMIC DESIGN
    </span>
  </div>
  <h1 class="text-lg sm:text-xl font-black text-slate-900 leading-snug tracking-tight mb-2" data-lp-f="category_headline.headline">
    ${name} — Instant Spine & Sciatica Pressure Relief
  </h1>
  <p class="text-xs text-slate-600 leading-relaxed font-normal mb-3" data-lp-f="category_headline.body">
    Engineered with medical-grade hyper-elastic gel that absorbs body weight, aligns your spine, and allows air circulation so you sit in 100% painless comfort all day.
  </p>
  <div class="space-y-1.5 border-t border-slate-100 pt-2.5">
    <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
      <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] shrink-0">✓</span>
      <span>Eliminates lower back, hip & tailbone numbness</span>
    </div>
    <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
      <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] shrink-0">✓</span>
      <span>Honeycomb cooling channels prevent seat sweat</span>
    </div>
    <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
      <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] shrink-0">✓</span>
      <span>Never flattens — retains 100% shape under 120kg</span>
    </div>
  </div>
</section>`,
      },
      {
        key: 'benefit_icons',
        name: 'Benefit Icons Row',
        orderIndex: 5,
        status: 'done',
        html: `<section id="sec-benefit_icons" data-lp-sec="benefit_icons" class="px-4 py-3">
  <div class="grid grid-cols-2 gap-2.5">
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
      <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
        <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
        <span data-lp-f="benefit_icons.b1_title">100% Painless</span>
      </div>
      <p class="text-[11px] text-slate-500 leading-tight" data-lp-f="benefit_icons.b1_desc">Zero tailbone numbness or lower back pressure guaranteed.</p>
    </div>
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
      <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
        <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
        <span data-lp-f="benefit_icons.b2_title">Honeycomb Airflow</span>
      </div>
      <p class="text-[11px] text-slate-500 leading-tight" data-lp-f="benefit_icons.b2_desc">200+ cooling vents prevent sweat and heat buildup.</p>
    </div>
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
      <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
        <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
        <span data-lp-f="benefit_icons.b3_title">Never Flattens</span>
      </div>
      <p class="text-[11px] text-slate-500 leading-tight" data-lp-f="benefit_icons.b3_desc">Retains elasticity under 120kg weight for 10+ years.</p>
    </div>
    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col gap-1">
      <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
        <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">✓</span>
        <span data-lp-f="benefit_icons.b4_title">Free Zipper Cover</span>
      </div>
      <p class="text-[11px] text-slate-500 leading-tight" data-lp-f="benefit_icons.b4_desc">Non-slip washable cover fits cars, desks & chairs.</p>
    </div>
  </div>
</section>`,
      },
      {
        key: 'price_block',
        name: 'Price Block',
        orderIndex: 6,
        status: 'done',
        html: `<section id="sec-price_block" data-lp-sec="price_block" class="px-4 py-3">
  <!-- Core Price & Discount Banner -->
  <div class="flex items-baseline justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
    <div class="flex items-baseline gap-2">
      <span class="text-2xl font-black text-slate-900" data-lp-f="price_block.discount_price">2,790 DZD</span>
      <span class="text-sm font-semibold text-slate-400 line-through" data-lp-f="price_block.regular_price">3,900 DZD</span>
    </div>
    <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-wide" data-lp-f="price_block.save_badge">SAVE 28% TODAY</span>
  </div>

  <!-- 3 Bundle Boxes Grid (Matching VitalNest & PureVita in Image 2) -->
  <div class="grid grid-cols-3 gap-2 mb-3">
    <!-- Box 1 -->
    <label class="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer flex flex-col justify-between text-center relative transition-all">
      <input type="radio" name="bundle_choice" class="accent-emerald-600 mx-auto mb-1 w-3.5 h-3.5" />
      <div class="text-[11px] font-bold text-slate-800 leading-tight">1 Cushion</div>
      <div class="text-[9.5px] text-slate-400">Standard</div>
      <div class="text-xs font-black text-slate-900 mt-1" data-lp-f="price_block.b1_price">2,790 DZD</div>
    </label>

    <!-- Box 2 (MOST POPULAR) -->
    <label class="p-2.5 rounded-xl border-2 border-emerald-600 bg-emerald-50/50 cursor-pointer flex flex-col justify-between text-center relative shadow-xs">
      <div class="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full whitespace-nowrap">
        MOST POPULAR
      </div>
      <input type="radio" name="bundle_choice" checked class="accent-emerald-600 mx-auto mb-1 w-3.5 h-3.5" />
      <div class="text-[11px] font-black text-slate-900 leading-tight">2 Cushions</div>
      <div class="text-[9px] text-emerald-700 font-extrabold">SAVE 35%</div>
      <div class="text-xs font-black text-emerald-800 mt-1" data-lp-f="price_block.b2_price">4,790 DZD</div>
    </label>

    <!-- Box 3 (BEST VALUE) -->
    <label class="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 cursor-pointer flex flex-col justify-between text-center relative transition-all">
      <div class="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full whitespace-nowrap">
        BEST VALUE
      </div>
      <input type="radio" name="bundle_choice" class="accent-emerald-600 mx-auto mb-1 w-3.5 h-3.5" />
      <div class="text-[11px] font-bold text-slate-800 leading-tight">3 Cushions</div>
      <div class="text-[9px] text-amber-700 font-extrabold">SAVE 45%</div>
      <div class="text-xs font-black text-slate-900 mt-1" data-lp-f="price_block.b3_price">6,290 DZD</div>
    </label>
  </div>

  <!-- COD Guarantee & Delivery Notice -->
  <div class="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-center text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1.5" data-lp-f="price_block.shippingPolicy">
    <span>🛡️ Pay on Delivery (COD) · Inspect parcel before handing payment</span>
  </div>
</section>`,
      },
      {
        key: 'primary_cta',
        name: 'Primary CTA',
        orderIndex: 7,
        status: 'done',
        html: `<section id="sec-primary_cta" data-lp-sec="primary_cta" class="px-4 py-2.5 sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
  <a href="#sec-price_block" class="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 transition-all cursor-pointer text-center" data-lp-f="primary_cta.label">
    <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
    <span>ORDER NOW — PAY ON ARRIVAL (2,790 DZD)</span>
  </a>
  <div class="flex items-center justify-center gap-3 text-[10px] text-slate-500 font-bold mt-1.5">
    <span>🔒 30-Day Guarantee</span>
    <span>•</span>
    <span>🚚 58 Wilayas Fast Delivery</span>
    <span>•</span>
    <span>📦 Open & Check First</span>
  </div>
</section>`,
      },
      {
        key: 'info_accordion',
        name: 'Info Accordion',
        orderIndex: 8,
        status: 'done',
        html: `<section id="sec-info_accordion" data-lp-sec="info_accordion" class="px-4 py-4 space-y-2 bg-slate-50/50">
  <details class="group bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs cursor-pointer" open>
    <summary class="flex items-center justify-between text-xs font-black text-slate-900 list-none select-none" data-lp-f="info_accordion.t1">
      <span>How the Honeycomb Gel Relieves Pain</span>
      <span class="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
    </summary>
    <p class="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal" data-lp-f="info_accordion.p1">
      Unlike memory foam that compresses flat under your weight, hyper-elastic polymer columns absorb pressure like water. Even if you sit on an egg, the egg will not break under your body weight.
    </p>
  </details>

  <details class="group bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs cursor-pointer">
    <summary class="flex items-center justify-between text-xs font-black text-slate-900 list-none select-none" data-lp-f="info_accordion.t2">
      <span>Specifications & Inclusions</span>
      <span class="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
    </summary>
    <p class="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal" data-lp-f="info_accordion.p2">
      Dimensions: 42cm x 36cm x 3.5cm · Weight: 980g · Material: 100% Medical-Grade TPE Polymer · Includes 1x Breathable Non-Slip Washable Zipper Cover.
    </p>
  </details>

  <details class="group bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs cursor-pointer">
    <summary class="flex items-center justify-between text-xs font-black text-slate-900 list-none select-none" data-lp-f="info_accordion.t3">
      <span>58 Wilaya Delivery & Cash on Delivery Policy</span>
      <span class="text-slate-400 group-open:rotate-180 transition-transform">▾</span>
    </summary>
    <p class="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal" data-lp-f="info_accordion.p3">
      Dispatched within 4 hours. Delivery takes 24 hours for Algiers and central cities, and 48-72 hours for remaining wilayas. You inspect your cushion package with the courier before paying.
    </p>
  </details>
</section>`,
      },
      {
        key: 'reviews',
        name: 'Reviews Section',
        orderIndex: 9,
        status: 'done',
        html: `<section id="sec-reviews" data-lp-sec="reviews" class="px-4 py-5 bg-white">
  <div class="text-center mb-4">
    <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
      AUTHENTIC VERIFIED TESTIMONIALS
    </span>
    <h3 class="text-base font-black text-slate-900 mt-1" data-lp-f="reviews.heading">What Algerian Drivers & Office Workers Say</h3>
  </div>

  <div class="space-y-2.5">
    <div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-1.5">
          <span class="font-extrabold text-xs text-slate-900" data-lp-f="reviews.u1">Karim B. (Alger)</span>
          <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">✓ Verified</span>
        </div>
        <div class="text-amber-400 text-xs">★★★★★</div>
      </div>
      <p class="text-xs text-slate-600 italic" data-lp-f="reviews.q1">
        "I drive a taxi 9 hours a day across Algiers. My sciatic pain was unbearable. After 2 days on this cushion, I have zero numbness. Yalidine delivery took only 24 hours to Kouba."
      </p>
    </div>

    <div class="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80">
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-1.5">
          <span class="font-extrabold text-xs text-slate-900" data-lp-f="reviews.u2">Amine K. (Oran)</span>
          <span class="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">✓ Verified</span>
        </div>
        <div class="text-amber-400 text-xs">★★★★★</div>
      </div>
      <p class="text-xs text-slate-600 italic" data-lp-f="reviews.q2">
        "Medical-grade quality. It stays cool and doesn't trap heat like foam cushions. Ordered the 2-pack so my wife has one for her desk."
      </p>
    </div>
  </div>
</section>`,
      },
      {
        key: 'cross_sell',
        name: 'Cross-Sell Row',
        orderIndex: 10,
        status: 'done',
        html: `<section id="sec-cross_sell" data-lp-sec="cross_sell" class="px-4 py-4 bg-slate-50/70 border-t border-slate-100">
  <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5" data-lp-f="cross_sell.title">Frequently Bought Together</h4>
  <div class="grid grid-cols-2 gap-2.5">
    <div class="p-2.5 rounded-xl bg-white border border-slate-200 text-center flex flex-col justify-between">
      <div>
        <div class="w-full h-16 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-700 mb-1.5">Lumbar Support</div>
        <div class="text-[11px] font-bold text-slate-900" data-lp-f="cross_sell.i1_name">Ergonomic Back Pillow</div>
      </div>
      <div class="mt-2">
        <div class="text-xs font-black text-emerald-700 mb-1.5" data-lp-f="cross_sell.i1_price">1,990 DZD</div>
        <button class="w-full py-1 text-[10px] font-extrabold bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-colors">+ Add</button>
      </div>
    </div>
    <div class="p-2.5 rounded-xl bg-white border border-slate-200 text-center flex flex-col justify-between">
      <div>
        <div class="w-full h-16 rounded-lg bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-700 mb-1.5">Gel Pillow</div>
        <div class="text-[11px] font-bold text-slate-900" data-lp-f="cross_sell.i2_name">Cooling Neck Contour</div>
      </div>
      <div class="mt-2">
        <div class="text-xs font-black text-emerald-700 mb-1.5" data-lp-f="cross_sell.i2_price">2,490 DZD</div>
        <button class="w-full py-1 text-[10px] font-extrabold bg-slate-900 text-white rounded-lg hover:bg-emerald-600 transition-colors">+ Add</button>
      </div>
    </div>
  </div>
</section>`,
      },
      {
        key: 'footer',
        name: 'Footer',
        orderIndex: 11,
        status: 'done',
        html: `<section id="sec-footer" data-lp-sec="footer" class="p-6 bg-slate-950 text-slate-400 text-center text-xs">
  <div class="text-white text-sm font-black uppercase tracking-wider mb-2 font-sans" data-lp-f="footer.brand">
    ${name} Official Store
  </div>
  <div class="flex items-center justify-center gap-3 text-[11px] text-slate-400 mb-3">
    <a href="#sec-hero_carousel" class="hover:text-white">Top</a> ·
    <a href="#sec-info_accordion" class="hover:text-white">Specs</a> ·
    <a href="#sec-reviews" class="hover:text-white">Reviews</a> ·
    <a href="#sec-price_block" class="hover:text-white">58 Wilayas COD</a>
  </div>
  <div class="text-[10px] text-slate-500 max-w-[280px] mx-auto leading-relaxed" data-lp-f="footer.copy">
    © 2026 ${name}. All Rights Reserved. National Cash on Delivery fulfillment with parcel inspection guarantee.
  </div>
</section>`,
      },
    ],
    audit: {
      totalScore: 94,
      scores: {
        valueProposition: 94,
        hero: 92,
        productClarity: 95,
        visualHierarchy: 93,
        benefits: 95,
        trust: 96,
        socialProof: 91,
        offer: 94,
        cta: 95,
        pricing: 92,
        objectionHandling: 90,
        mobileUx: 96,
        overall: 94,
      },
      problems: [
        {
          priority: 'MEDIUM',
          affectedSectionKey: 'primary_cta',
          affectedField: 'primary_cta.label',
          problem: 'CTA can emphasize Cash on Delivery reassurance more clearly for Algerian shoppers.',
          whyItHurtsConversion: 'COD buyers convert 28% higher when payment terms are explicit on the button.',
          recommendedFix: 'Change button label to "ORDER NOW — FREE DELIVERY & PAY ON ARRIVAL"',
        },
      ],
    },
    patches: [
      {
        field: 'primary_cta.label',
        newText: 'ORDER NOW — FREE DELIVERY & PAY ON ARRIVAL',
        reason: 'Explicit COD guarantee eliminates risk for hesitant first-time buyers.',
      },
    ],
    progress: [
      { id: 'lp0', state: 'done', label: `PART 1 DONE — Brand locked: ${name} · 12-section plan ready`, detail: null },
      { id: 'lpa', state: 'done', label: 'CRO AUDIT — 94/100', detail: null },
      { id: 'lpo', state: 'done', label: 'AUTO-OPTIMIZATION done — 1 high-impact COD patch applied', detail: null },
    ],
  };
}

export const CroMobileLandingPageBuilder: React.FC<CroMobileLandingPageBuilderProps> = ({
  initialProduct,
  initialData,
  isModal,
  onClose,
  onSave,
  onOpenFullscreen,
  onDeleteNode,
}) => {
  const [data, setData] = useState<any>(() => initialData || getInitialData(initialProduct?.name));
  const [running, setRunning] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  // Sync initial product if it changes
  useEffect(() => {
    if (initialProduct?.name && !initialData) {
      setData(getInitialData(initialProduct.name));
    }
  }, [initialProduct?.name, initialData]);

  // Notify parent on data change
  const handleUpdateData = useCallback(
    (updater: (prev: any) => any) => {
      setData((prev: any) => {
        const next = updater(prev);
        if (onSave) onSave(next);
        return next;
      });
    },
    [onSave]
  );

  const callAI = async (prompt: string, id: string, schemaString: string) => {
    let clientApiKey = '';
    let provider = 'gemini';
    let model = '';
    if (typeof window !== 'undefined') {
      provider = localStorage.getItem('ai_provider') || 'gemini';
      clientApiKey =
        (provider === 'openai' ? localStorage.getItem('openai_api_key') : null) ||
        (provider === 'deepseek' ? localStorage.getItem('deepseek_api_key') : null) ||
        (provider === 'gemini' ? localStorage.getItem('gemini_api_key') : null) ||
        (provider === 'openrouter' ? localStorage.getItem('openrouter_api_key') : null) ||
        localStorage.getItem('gemini_api_key') ||
        localStorage.getItem('user_api_key') ||
        '';
      model = localStorage.getItem('ai_model') || '';
    }

    const res = await fetch('/api/ai/execute-node', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        skillId: `landing_${id}`,
        schemaString,
        apiKey: clientApiKey,
        provider,
        model,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed: ' + id);
    return json.result;
  };

  const stamp = (msgs: Array<{ id: string; state: string; label: string; detail?: string | null }>) => {
    handleUpdateData((prev: any) => ({
      ...prev,
      progress: [...(prev?.progress || []), ...msgs],
    }));
  };

  const setSection = (key: string, patch: any) => {
    handleUpdateData((prev: any) => ({
      ...prev,
      sections: (prev?.sections || []).map((sec: any) => (sec.key === key ? { ...sec, ...patch } : sec)),
    }));
  };

  // Run full multi-phase AI pipeline
  const runLandingPageSkill = async () => {
    if (running) return;
    setRunning(true);

    const productName = String(initialProduct?.name || '').trim() || 'NovaPro Precision Trimmer';
    const ctx = {
      productName,
      productDescription: String(initialProduct?.description || ''),
      productCategory: String(initialProduct?.category || ''),
      price: String(initialProduct?.price != null ? initialProduct.price : ''),
      instructions: String(instructions || '').trim(),
    };

    try {
      // Clear past progress logs on fresh start and set first step to running
      handleUpdateData((prev: any) => ({
        ...prev,
        progress: [{ id: 'lp0', state: 'running', label: 'PART 1 — DISCOVERY: brand · content · offer · social proof · plan…', detail: null }],
      }));
      const stratRaw = await callAI(buildLandingStrategyPrompt(ctx), 'strategy', LANDING_STRATEGY_SCHEMA);
      const strategy = stratRaw || {};
      const byKey: Record<string, any> = {};
      (Array.isArray(strategy.sections) ? strategy.sections : []).forEach((s: any) => {
        if (s && s.key) byKey[s.key] = s;
      });

      const plan = LANDING_MANDATORY_SECTIONS.map((k: string, i: number) => {
        const ai = byKey[k] || {};
        return {
          key: k,
          name: ai.name || k.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
          purpose: ai.purpose || '',
          headline: ai.headline || '',
          subheadline: ai.subheadline || '',
          body: ai.body || '',
          ctaLabel: ai.ctaLabel || '',
          layout: ai.layout || '',
          orderIndex: i,
        };
      });

      stamp([
        {
          id: 'lp0',
          state: 'done',
          label: `PART 1 DONE — brand locked: ${(strategy.brandIdentity && strategy.brandIdentity.brandName) || productName} · 12-section plan ready`,
          detail: null,
        },
      ]);

      handleUpdateData((prev: any) => ({
        ...prev,
        strategy,
        sections: plan.map((sec) => ({
          key: sec.key,
          name: sec.name || sec.key,
          orderIndex: sec.orderIndex,
          status: 'pending',
          html: null,
          error: null,
        })),
      }));

      // Phase B — Generate sections live
      const builtHtml: Record<string, string> = {};
      for (let i = 0; i < plan.length; i++) {
        const sec = plan[i];
        const secKey = sec.key || `sec_${i + 1}`;
        const secId = `lp_${secKey}`;
        setSection(secKey, { status: 'running', error: null });
        stamp([{ id: secId, state: 'running', label: `Section ${i + 1}/12 — Building "${sec.name || secKey}"…`, detail: null }]);
        try {
          const html = await callAI(buildLandingSectionPrompt(ctx, strategy, sec), `section_${secKey}`, '');
          builtHtml[secKey] = html || '';
          setSection(secKey, { status: 'done', html: html || '' });
          stamp([{ id: secId, state: 'done', label: `Section ${i + 1}/12 — "${sec.name || secKey}" live (${(html || '').length} chars)`, detail: null }]);
        } catch (err: any) {
          setSection(secKey, { status: 'error', error: err.message, html: null });
          stamp([{ id: secId, state: 'error', label: `"${sec.name || secKey}" failed — ${err.message}`, detail: null }]);
        }
      }

      // Phase C — CRO Audit
      stamp([{ id: 'lpa', state: 'running', label: 'PHASE 12 — Running CRO audit on the generated page…', detail: null }]);
      const assembled = Object.values(builtHtml).join('\n').trim();
      if (assembled) {
        const auditResult = await callAI(buildLandingAuditPrompt(assembled), 'audit', LANDING_AUDIT_SCHEMA);
        const audit = auditResult || {};
        stamp([
          {
            id: 'lpa',
            state: 'done',
            label: `CRO AUDIT — ${Math.round(audit.totalScore || 0)}/100`,
            detail: (audit.problems || []).slice(0, 3).map((p: any) => `[${p.priority}] ${p.problem}`).join('\n') || null,
          },
        ]);
        handleUpdateData((prev: any) => ({ ...prev, audit }));

        // Phase D — Auto-Optimize
        stamp([{ id: 'lpo', state: 'running', label: 'PHASE 13 — Auto-optimizing highest-priority fields…', detail: null }]);
        try {
          const optResult = await callAI(buildLandingOptimizePrompt(assembled, audit), 'optimize', LANDING_OPTIMIZE_SCHEMA);
          const patches = Array.isArray(optResult && optResult.patches) ? optResult.patches : [];
          if (patches.length) {
            stamp([
              {
                id: 'lpo',
                state: 'done',
                label: `AUTO-OPTIMIZATION done — ${patches.length} conversion patches applied`,
                detail: patches.slice(0, 3).map((p: any) => `${p.field}: ${p.newText}`).join('\n'),
              },
            ]);
          } else {
            stamp([{ id: 'lpo', state: 'done', label: 'AUTO-OPTIMIZATION done — page meets all CRO standards', detail: null }]);
          }
          handleUpdateData((prev: any) => ({ ...prev, patches }));
        } catch (err: any) {
          stamp([{ id: 'lpo', state: 'error', label: `Auto-optimization skipped — ${err.message}`, detail: null }]);
        }
      }
    } catch (err: any) {
      stamp([{ id: 'lpf', state: 'error', label: `FAILED — ${err.message}`, detail: null }]);
    } finally {
      setRunning(false);
    }
  };

  // Regenerate only a single section
  const handleRegenerateSection = async (sectionKey: string) => {
    if (!data?.strategy) return;
    const sec = (data?.sections || []).find((x: any) => x.key === sectionKey);
    if (!sec) return;
    const stratSec = (data?.strategy?.sections || []).find((x: any) => x.key === sectionKey) || sec;
    const ctx = {
      productName: String(data?.strategy?.brandIdentity?.brandName || initialProduct?.name || ''),
      productDescription: String(initialProduct?.description || ''),
      instructions: String(instructions || '').trim(),
    };

    setSection(sectionKey, { status: 'running', error: null });
    try {
      const html = await callAI(buildLandingSectionPrompt(ctx, data.strategy, stratSec), `section_${sectionKey}`, '');
      setSection(sectionKey, { status: 'done', html: html || '' });
    } catch (err: any) {
      setSection(sectionKey, { status: 'error', error: err.message });
    }
  };

  const isConnected = Boolean(initialProduct?.name);

  return (
    <div className={`flex flex-col w-full h-full ${isModal ? 'p-2' : ''}`}>
      {/* Top action header strip */}
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[#0B132B] text-white rounded-xl border border-white/10 shadow-xs text-xs mb-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full ${running ? 'bg-amber-400 animate-spin' : 'bg-blue-500 animate-pulse'} shrink-0`} />
          <span className="font-bold text-white text-xs truncate">CRO Landing Page Builder (Mobile)</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-600/30 text-blue-300 font-semibold border border-blue-400/30 shrink-0">
            12-SECTION DTC
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border shrink-0 ${
              isConnected
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-400/30'
            }`}
          >
            {isConnected ? `Product: ${initialProduct?.name}` : 'Awaiting product node'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            data-no-drag="true"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsPromptOpen((v) => !v);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Custom instructions or product specifics"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-300" />
            <span>{isPromptOpen ? 'Hide Brief' : 'Custom Brief'}</span>
          </button>

          <button
            type="button"
            disabled={running}
            data-no-drag="true"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              runLandingPageSkill();
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] font-mono flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              running
                ? 'bg-amber-600 text-white cursor-wait opacity-80'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{running ? 'GENERATING…' : 'RUN AI BUILDER'}</span>
          </button>

          {onOpenFullscreen && !isModal && (
            <button
              type="button"
              data-no-drag="true"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenFullscreen();
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Open Fullscreen Studio"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}

          {isModal && onClose && (
            <button
              type="button"
              data-no-drag="true"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/30 text-white hover:text-rose-300 transition-colors cursor-pointer"
              title="Close Fullscreen"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {onDeleteNode && !isModal && (
            <button
              type="button"
              data-no-drag="true"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDeleteNode();
              }}
              className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Delete Card"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Optional custom brief accordion */}
      {isPromptOpen && (
        <div
          data-no-drag="true"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="mb-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
        >
          <label className="text-[11px] font-bold text-slate-700 block">Custom Product Instructions & Key Benefits to Highlight</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Focus on 58 Wilaya COD delivery, highlight medical-grade titanium blades, include 2-pack bundle discount..."
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              disabled={running}
              data-no-drag="true"
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                runLandingPageSkill();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold font-mono shrink-0 cursor-pointer"
            >
              Apply & Rebuild
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Landing Page Builder component (from project 2) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <LandingPageBuilder
          data={data}
          running={running}
          onRegenerateSection={handleRegenerateSection}
        />
      </div>
    </div>
  );
};

export default CroMobileLandingPageBuilder;
