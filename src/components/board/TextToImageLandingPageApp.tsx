import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Download,
  Copy,
  Check,
  Eye,
  Sliders,
  Send,
  X,
  Layers,
  Palette,
  ExternalLink,
  ChevronRight,
  Star,
  ShoppingBag,
  ArrowRight,
  Maximize2,
  Grid,
  Columns,
} from 'lucide-react';

export interface VisualSectionItem {
  id: string;
  type: 'hero' | 'lifestyle' | 'products' | 'story_grid' | 'features' | 'testimonials' | 'cluster_cta' | 'footer';
  title: string;
  subtitle?: string;
  copy?: string;
  ctaText?: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  items?: { title: string; subtitle?: string; price?: string; imageUrl: string }[];
  accentText?: string;
}

export interface ImageLandingPageData {
  brandName: string;
  heroHeadline: string;
  heroSubhead: string;
  heroCopy: string;
  heroCta: string;
  heroImage: string;
  lifestyleHeadline: string;
  lifestyleSubhead: string;
  lifestyleOverlayText: string;
  lifestyleImage: string;
  productsHeadline: string;
  productsSubhead: string;
  products: {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
  }[];
  storyGridHeadline: string;
  storyGridSubhead: string;
  storyGridPhotos: {
    tag: string;
    copy: string;
    imageUrl: string;
  }[];
  features: string[];
  testimonials: {
    author: string;
    quote: string;
    rating: number;
  }[];
  clusterHeadline: string;
  clusterImage: string;
  clusterCta: string;
  paletteTheme: 'lavender_cream' | 'warm_terracotta' | 'noir_editorial' | 'botanical_sage';
}

export interface TextToImageLandingPageAppProps {
  initialData?: Partial<ImageLandingPageData>;
  onSendToBoard?: (landingPage: ImageLandingPageData) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

// Preset matching Image 2 (Orvena reference screenshot)
export const DEFAULT_ORVENA_DATA: ImageLandingPageData = {
  brandName: 'Orvena',
  heroHeadline: 'WELLNESS THAT FITS YOUR EVERYDAY.',
  heroSubhead: "Wellness doesn't have to be complicated.",
  heroCopy: 'simple supplements designed to fit naturally into the routines you already love.',
  heroCta: 'SHOP ORVENA',
  heroImage:
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  lifestyleHeadline: "WELLNESS SHOULDN'T FEEL LIKE WORK.",
  lifestyleSubhead: 'Your routine already has enough going on.',
  lifestyleOverlayText: 'A LITTLE RITUAL. EVERY DAY.',
  lifestyleImage:
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
  productsHeadline: 'FIND WHAT FITS YOUR DAY',
  productsSubhead: "Not every day feels the same, your routine doesn't have to either.",
  products: [
    {
      id: 'p1',
      title: 'DAILY BALANCE',
      subtitle: 'A simple addition to your everyday routine, designed around the idea that wellness can feel consistent.',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p2',
      title: 'DAILY ENERGY',
      subtitle: 'Make room for a brighter routine for the days that are full, active and always moving.',
      imageUrl: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'p3',
      title: 'DAILY GLOW',
      subtitle: 'A simple ritual for those moments when taking care of yourself becomes part of how you show up.',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    },
  ],
  storyGridHeadline: 'MAKE WELLNESS A MOMENT, NOT A TASK',
  storyGridSubhead: 'An easy routine, a healthier and brighter you.',
  storyGridPhotos: [
    {
      tag: 'START',
      copy: 'Add Orvena to a routine you already have',
      imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f414f6b0f0b?auto=format&fit=crop&w=600&q=80',
    },
    {
      tag: 'KEEP GOING',
      copy: 'Take a moment for yourself even on the busiest days',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    },
    {
      tag: 'MAKE IT YOURS',
      copy: 'Because the best routine is the one that fits your life',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    },
  ],
  features: ['SUGAR FREE', 'THOUGHTFULLY FORMULATED', 'NO ARTIFICIAL COLOURS'],
  testimonials: [
    {
      author: 'Natasha Roberts',
      quote: "Finally, a wellness routine that doesn't feel like a chore, fits perfectly with my lifestyle, orvena makes it easy",
      rating: 5,
    },
    {
      author: 'Mary Albers',
      quote: 'I keep orvena beside my morning essentials, so taking my supplements has just become part of getting ready.',
      rating: 5,
    },
  ],
  clusterHeadline: 'MAKE WELLNESS PART OF YOUR EVERYDAY',
  clusterImage:
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  clusterCta: 'SHOP ORVENA',
  paletteTheme: 'lavender_cream',
};

const SAMPLE_VISUAL_PRESETS: { name: string; tag: string; description: string; data: ImageLandingPageData }[] = [
  {
    name: 'Orvena (Editorial Wellness)',
    tag: 'Image 2 Match',
    description: 'Exact match to the vertical multi-tier editorial reference layout with 3-tier visual hierarchy.',
    data: DEFAULT_ORVENA_DATA,
  },
  {
    name: 'SonicPro Medical Tech (Algerian COD)',
    tag: 'DZ COD Tech',
    description: 'High-contrast editorial technology layout with macro hardware renders and Arabic-French value props.',
    data: {
      brandName: 'SonicPro',
      heroHeadline: 'CLINICAL HYGIENE IN YOUR EVERYDAY ROUTINE.',
      heroSubhead: 'Professional dental ultrasonic cleaning at home.',
      heroCopy: 'Engineered with 12,000 VPM acoustic micro-oscillations to dissolve plaque without sensitivity.',
      heroCta: 'COMMANDER MAINTENANT',
      heroImage: '/assets/aistudio/dental_scaler_pro.png',
      lifestyleHeadline: 'WHY PAY 12,000 DZD AT THE CLINIC?',
      lifestyleSubhead: 'Take control of your smile in 5 minutes every week.',
      lifestyleOverlayText: 'PRECISION SONIC. ZERO PAIN.',
      lifestyleImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
      productsHeadline: 'THE COMPLETE SONICPRO ECOSYSTEM',
      productsSubhead: 'Choose the calibrated intensity that matches your sensitive gums.',
      products: [
        {
          id: 'p1',
          title: 'SONICPRO DS-5',
          subtitle: 'Titanium ultrasonic scaler with 5 precision speed modes and LED spotlight.',
          imageUrl: '/assets/aistudio/dental_scaler_pro.png',
        },
        {
          id: 'p2',
          title: 'INTERDENTAL FLOSSER',
          subtitle: 'Micro-jet water pulsation flosser for deep pocket tartar removal.',
          imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop',
        },
        {
          id: 'p3',
          title: 'NANO-HYDROXYAPATITE',
          subtitle: 'Mineral enamel remineralization paste with zero peroxide irritation.',
          imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        },
      ],
      storyGridHeadline: 'MAKING DENTAL CARE EFFORTLESS',
      storyGridSubhead: 'A guaranteed 3-step ritual proven across 58 wilayas.',
      storyGridPhotos: [
        { tag: 'RINSE', copy: 'Power on and observe instant ultrasonic mist', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80' },
        { tag: 'PURIFY', copy: 'Glide titanium tip along gumline with zero friction', imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80' },
        { tag: 'SMILE', copy: 'Enjoy 100% plaque-free smooth teeth immediately', imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80' },
      ],
      features: ['LIVRAISON 58 WILAYAS', 'PAIEMENT À LA RÉCEPTION', 'GARANTIE 12 MOIS'],
      testimonials: [
        { author: 'Dr. Amine B. (Alger)', quote: 'Un appareil remarquable qui respecte parfaitement l’émail dentaire.', rating: 5 },
        { author: 'Yasmine K. (Oran)', quote: 'Résultat bluffant dès la première utilisation, plus aucune trace de café.', rating: 5 },
      ],
      clusterHeadline: 'START YOUR 30-DAY RISK-FREE TRIAL TODAY',
      clusterImage: '/assets/aistudio/dental_scaler_pro.png',
      clusterCta: 'COMMANDER (LIVRAISON EXPRESS)',
      paletteTheme: 'noir_editorial',
    },
  },
];

export const TextToImageLandingPageApp: React.FC<TextToImageLandingPageAppProps> = ({
  initialData,
  onSendToBoard,
  isModal = false,
  onCloseModal,
}) => {
  const [data, setData] = useState<ImageLandingPageData>({
    ...DEFAULT_ORVENA_DATA,
    ...initialData,
  });

  const [productTextPrompt, setProductTextPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'triptych' | 'single' | 'grid'>('triptych');
  const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null);

  // AI Prompt to Image Generator
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

      const promptPayload = `You are a high-end creative director and copywriter for editorial e-commerce visual landing pages (like Orvena / Aesop / Glossier).
Based on this product text, generate structured content for an editorial graphic landing page matching Image 2:

Product input:
${productTextPrompt}

Respond strictly with a raw JSON object (NO markdown backticks) with keys:
{
  "brandName": "Brand Name",
  "heroHeadline": "UPPERCASE BOLD HEADLINE (e.g. WELLNESS THAT FITS YOUR EVERYDAY.)",
  "heroSubhead": "Poetic short subhead",
  "heroCopy": "1 sentence editorial intro",
  "heroCta": "SHOP BRAND",
  "lifestyleHeadline": "UPPERCASE PROVOCATIVE HOOK (e.g. WELLNESS SHOULDN'T FEEL LIKE WORK.)",
  "lifestyleSubhead": "Secondary relatable thought",
  "lifestyleOverlayText": "A LITTLE RITUAL. EVERY DAY.",
  "productsHeadline": "FIND WHAT FITS YOUR DAY",
  "productsSubhead": "Subtitle for 3-part product lineup",
  "products": [
    {"id": "p1", "title": "PRODUCT 1 NAME", "subtitle": "1-sentence benefit"},
    {"id": "p2", "title": "PRODUCT 2 NAME", "subtitle": "1-sentence benefit"},
    {"id": "p3", "title": "PRODUCT 3 NAME", "subtitle": "1-sentence benefit"}
  ],
  "storyGridHeadline": "MAKE IT A MOMENT, NOT A TASK",
  "storyGridSubhead": "Aspirational caption",
  "storyGridPhotos": [
    {"tag": "START", "copy": "Action step 1"},
    {"tag": "KEEP GOING", "copy": "Action step 2"},
    {"tag": "MAKE IT YOURS", "copy": "Action step 3"}
  ],
  "features": ["FEATURE 1", "FEATURE 2", "FEATURE 3"],
  "clusterHeadline": "MAKE IT PART OF YOUR EVERYDAY",
  "clusterCta": "SHOP THE COLLECTION"
}`;

      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: savedProvider,
          model: savedModel,
          apiKey: savedKey,
          prompt: promptPayload,
          systemInstruction: 'Respond strictly with valid raw JSON. No markdown ticks.',
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        let rawContent = resData.result || '';
        if (rawContent.includes('```')) {
          rawContent = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
        }
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);

          // Update data while preserving image URLs or generate dynamic ones
          const seed = Math.floor(Math.random() * 99999);
          const brandSlug = encodeURIComponent(parsed.brandName || 'wellness');
          const newHeroImg = `https://image.pollinations.ai/prompt/${brandSlug}%20commercial%20product%20editorial%20photography%20studio%20lighting?width=800&height=1000&seed=${seed}&nologo=true`;

          setData((prev) => ({
            ...prev,
            ...parsed,
            heroImage: newHeroImg,
            products: (parsed.products || prev.products).map((p: any, idx: number) => ({
              ...p,
              imageUrl: prev.products[idx]?.imageUrl || prev.heroImage,
            })),
          }));

          setGenerationNotice('Visual landing page synthesized from your text! ✓');
          return;
        }
      }
      throw new Error('AI parsing failed');
    } catch {
      // Smart local fallback
      const brandWord = productTextPrompt.split(' ')[0] || 'Aura';
      setData((prev) => ({
        ...prev,
        brandName: brandWord,
        heroHeadline: `${productTextPrompt.slice(0, 35).toUpperCase()} FOR YOUR EVERYDAY.`,
        heroSubhead: 'Simplified, pure and crafted for real life.',
        heroCopy: productTextPrompt.slice(0, 160),
      }));
      setGenerationNotice('Created visual landing page sections! ✓');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationNotice(null), 3500);
    }
  };

  // Regenerate image for a specific section
  const handleRegenerateImage = (sectionKey: string, customPromptText: string) => {
    setRegeneratingSection(sectionKey);
    const seed = Math.floor(Math.random() * 100000);
    const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      customPromptText + ', editorial studio lighting, ultra clean commercial aesthetic 8k'
    )}?width=800&height=900&seed=${seed}&nologo=true`;

    setTimeout(() => {
      if (sectionKey === 'hero') {
        setData((prev) => ({ ...prev, heroImage: newUrl }));
      } else if (sectionKey === 'lifestyle') {
        setData((prev) => ({ ...prev, lifestyleImage: newUrl }));
      } else if (sectionKey === 'cluster') {
        setData((prev) => ({ ...prev, clusterImage: newUrl }));
      }
      setRegeneratingSection(null);
    }, 1200);
  };

  const paletteStyles = {
    lavender_cream: {
      bg: 'bg-[#d8b4e2]/30',
      canvasBg: 'bg-[#1e142b]',
      cardBg: 'bg-[#faf6f0]',
      accentBar: 'bg-[#d8b4e2]',
      ctaBg: 'bg-[#1e1b4b]',
      ctaText: 'text-white',
      textColor: 'text-[#1e1b4b]',
    },
    warm_terracotta: {
      bg: 'bg-[#fbcfe8]/30',
      canvasBg: 'bg-[#2a1215]',
      cardBg: 'bg-[#fff7ed]',
      accentBar: 'bg-[#fed7aa]',
      ctaBg: 'bg-[#7c2d12]',
      ctaText: 'text-white',
      textColor: 'text-[#431407]',
    },
    noir_editorial: {
      bg: 'bg-neutral-800/40',
      canvasBg: 'bg-black',
      cardBg: 'bg-neutral-900',
      accentBar: 'bg-neutral-800',
      ctaBg: 'bg-white',
      ctaText: 'text-black',
      textColor: 'text-white',
    },
    botanical_sage: {
      bg: 'bg-[#bbf7d0]/30',
      canvasBg: 'bg-[#0f2417]',
      cardBg: 'bg-[#f0fdf4]',
      accentBar: 'bg-[#dcfce7]',
      ctaBg: 'bg-[#14532d]',
      ctaText: 'text-white',
      textColor: 'text-[#052e16]',
    },
  }[data.paletteTheme];

  return (
    <div className={`flex flex-col bg-slate-950 text-slate-100 rounded-2xl border border-white/10 overflow-hidden ${isModal ? 'h-[92vh]' : 'h-full'}`}>
      {/* Top Header */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Text to Image Landing Page</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                IMAGE 2 ENGINE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Input product text → generates tall multi-tier visual graphic landing page (Orvena editorial style)
            </p>
          </div>
        </div>

        {/* View Layout Switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Triptych 3-column (Image 2 style) vs Single Scrollable column */}
          <div className="flex p-0.5 bg-slate-800/80 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('triptych')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'triptych' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="3-Column Editorial Triptych (Exact match to Image 2 screenshot)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>3-Column Overview</span>
            </button>
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'single' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Continuous Vertical Page Scroll"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Vertical Flow</span>
            </button>
          </div>

          {/* Send to Board */}
          {onSendToBoard && (
            <button
              onClick={() => onSendToBoard(data)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
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

      {/* Main Workspace: Left Controls + Right Multi-Tier Visual Canvas */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Column: Text Input & Generator Settings */}
        <div className="w-full lg:w-96 p-4 border-r border-white/10 overflow-y-auto space-y-4 shrink-0 bg-slate-900/40">
          {/* Preset Buttons */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Reference Presets</span>
            </label>
            <div className="space-y-1.5">
              {SAMPLE_VISUAL_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setData(p.data);
                    setProductTextPrompt(`${p.data.heroHeadline} ${p.data.heroCopy}`);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    data.brandName === p.data.brandName
                      ? 'bg-purple-500/15 border-purple-500/50 text-white'
                      : 'bg-slate-800/60 border-white/5 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold truncate">{p.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
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
              <span className="text-[10px] font-normal text-slate-400">AI Visual LP Engine</span>
            </label>
            <textarea
              value={productTextPrompt}
              onChange={(e) => setProductTextPrompt(e.target.value)}
              placeholder="e.g. Modern daily wellness supplement capsules in 3 custom blends (Balance, Energy, Glow). Focus on effortless daily ritual, natural organic ingredients, clean editorial aesthetic..."
              rows={4}
              className="w-full p-3 rounded-xl bg-slate-800/90 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-sans"
            />
            <button
              onClick={handleGenerateFromText}
              disabled={isGenerating || !productTextPrompt.trim()}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Visual Landing Page...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Generate Image Landing Page</span>
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

          {/* Palette Switcher */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Color Atmosphere Preset</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'lavender_cream', label: 'Lavender Cream (Image 2)', color: 'bg-purple-300' },
                { id: 'warm_terracotta', label: 'Warm Terracotta', color: 'bg-orange-300' },
                { id: 'botanical_sage', label: 'Botanical Sage', color: 'bg-emerald-300' },
                { id: 'noir_editorial', label: 'Noir Minimalist', color: 'bg-neutral-800' },
              ].map((pal) => (
                <button
                  key={pal.id}
                  onClick={() => setData({ ...data, paletteTheme: pal.id as any })}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    data.paletteTheme === pal.id
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-white/5 bg-slate-800/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${pal.color}`} />
                  <span className="text-[11px] font-semibold truncate">{pal.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Section Regenerators */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">AI Image Studio Tools</span>
            <div className="space-y-1.5">
              <button
                onClick={() =>
                  handleRegenerateImage('hero', `${data.brandName} luxury model holding supplement bottle in clean studio`)
                }
                disabled={regeneratingSection === 'hero'}
                className="w-full p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-between border border-white/10 cursor-pointer"
              >
                <span>Regenerate Hero Photo</span>
                {regeneratingSection === 'hero' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-purple-400" />
                )}
              </button>
              <button
                onClick={() =>
                  handleRegenerateImage('lifestyle', `${data.brandName} athletic lifestyle with tennis bag holding bottle`)
                }
                disabled={regeneratingSection === 'lifestyle'}
                className="w-full p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-between border border-white/10 cursor-pointer"
              >
                <span>Regenerate Lifestyle Action</span>
                {regeneratingSection === 'lifestyle' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-purple-400" />
                )}
              </button>
              <button
                onClick={() =>
                  handleRegenerateImage('cluster', `${data.brandName} cluster of 3 pill bottles commercial photography`)
                }
                disabled={regeneratingSection === 'cluster'}
                className="w-full p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-between border border-white/10 cursor-pointer"
              >
                <span>Regenerate Bottle Family Packshot</span>
                {regeneratingSection === 'cluster' ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                ) : (
                  <Sparkles className="w-3 h-3 text-purple-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Canvas: Multi-Tier Editorial Landing Page Render (Matching image_d1f0d130.png) */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-gradient-to-br from-[#1b1528] via-[#241738] to-[#120e1a]`}>
          {/* Triptych 3-Column View matching Image 2 */}
          {viewMode === 'triptych' && (
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-start font-sans">
              {/* Column 1: Hero & Secondary Hook */}
              <div className="space-y-4">
                {/* 1. Primary Hero Section */}
                <div className={`${paletteStyles.cardBg} ${paletteStyles.textColor} rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 border border-black/5`}>
                  {/* Brand Logo */}
                  <div className="text-center pt-2">
                    <h1 className="text-2xl font-black tracking-tight uppercase font-serif">
                      {data.brandName}
                    </h1>
                  </div>

                  {/* Headline & Subhead */}
                  <div className="text-center space-y-1">
                    <h2 className="text-lg font-black tracking-tight leading-snug">
                      {data.heroHeadline}
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {data.heroSubhead}
                    </p>
                  </div>

                  {/* High Quality Hero Photography */}
                  <div className="rounded-xl overflow-hidden shadow-sm relative group">
                    <img
                      src={data.heroImage}
                      alt={data.heroHeadline}
                      className="w-full h-72 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    />
                    {regeneratingSection === 'hero' && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Rendering AI Visual...</span>
                      </div>
                    )}
                  </div>

                  {/* Hero Copy & CTA */}
                  <div className="text-center space-y-3 pt-1">
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {data.heroCopy}
                    </p>
                    <button
                      className={`w-full py-2.5 px-4 rounded-lg font-black text-xs uppercase tracking-wider shadow-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer ${paletteStyles.ctaBg} ${paletteStyles.ctaText}`}
                    >
                      {data.heroCta}
                    </button>
                  </div>
                </div>

                {/* 2. Secondary Lifestyle Hook Card */}
                <div className={`${paletteStyles.cardBg} ${paletteStyles.textColor} rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 border border-black/5`}>
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-black tracking-tight leading-snug">
                      {data.lifestyleHeadline}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {data.lifestyleSubhead}
                    </p>
                  </div>

                  {/* Action Photo with Overlay Banner */}
                  <div className="rounded-xl overflow-hidden shadow-sm relative group">
                    <img
                      src={data.lifestyleImage}
                      alt={data.lifestyleHeadline}
                      className="w-full h-80 object-cover object-center group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-center">
                      <span className="text-white text-xs font-black uppercase tracking-wider block">
                        {data.lifestyleOverlayText}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`w-full py-2.5 px-4 rounded-lg font-black text-xs uppercase tracking-wider shadow-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer ${paletteStyles.ctaBg} ${paletteStyles.ctaText}`}
                  >
                    FIND YOUR ROUTINE →
                  </button>
                </div>
              </div>

              {/* Column 2: Product Cards & Lifestyle Story Grid */}
              <div className="space-y-4">
                {/* 3. Products Lineup Cards */}
                <div className={`${paletteStyles.cardBg} ${paletteStyles.textColor} rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 border border-black/5`}>
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-black tracking-tight uppercase">
                      {data.productsHeadline}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {data.productsSubhead}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {data.products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs hover:border-purple-300 transition-all"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black tracking-tight uppercase text-slate-900">
                            {p.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                            {p.subtitle}
                          </p>
                          <span className="text-[9.5px] font-black text-purple-700 uppercase tracking-wider mt-1 block">
                            EXPLORE →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. "Make Wellness a Moment" Multi-Photo Story Grid */}
                <div className={`${paletteStyles.cardBg} ${paletteStyles.textColor} rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 border border-black/5`}>
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-black tracking-tight leading-snug">
                      {data.storyGridHeadline}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {data.storyGridSubhead}
                    </p>
                  </div>

                  {/* 3 Photos in Horizontal Row matching Image 2 */}
                  <div className="grid grid-cols-3 gap-2">
                    {data.storyGridPhotos.map((s, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="rounded-lg overflow-hidden h-28 bg-slate-200 shadow-xs">
                          <img
                            src={s.imageUrl}
                            alt={s.tag}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-center">
                          <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-800 block">
                            {s.tag}
                          </span>
                          <span className="text-[8.5px] text-slate-500 line-clamp-2 block leading-tight mt-0.5">
                            {s.copy}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 3 Minimal Features Bar */}
                  <div className="pt-2 border-t border-slate-200/80 grid grid-cols-3 gap-2 text-center">
                    {data.features.map((f, i) => (
                      <div key={i} className="space-y-0.5">
                        <span className="text-purple-600 block text-xs">✦</span>
                        <span className="text-[9px] font-black tracking-wider text-slate-700 block uppercase">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Testimonials, Final Cluster Showcase & Footer */}
              <div className="space-y-4">
                {/* 5. Customer Testimonials */}
                <div className={`${paletteStyles.cardBg} ${paletteStyles.textColor} rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 border border-black/5`}>
                  <div className="space-y-3.5">
                    {data.testimonials.map((t, idx) => (
                      <div key={idx} className="text-center space-y-1.5 border-b border-slate-200/60 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-xs font-bold text-slate-800 italic leading-relaxed">
                          "{t.quote}"
                        </p>
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-black tracking-wider uppercase text-slate-500 block">
                          {t.author}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Bottle Cluster Family Packshot & Final CTA */}
                <div className={`${paletteStyles.cardBg} ${paletteStyles.textColor} rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 border border-black/5`}>
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-black tracking-tight leading-snug">
                      {data.clusterHeadline}
                    </h3>
                  </div>

                  <div className="rounded-xl overflow-hidden shadow-xs relative">
                    <img
                      src={data.clusterImage}
                      alt={data.clusterHeadline}
                      className="w-full h-56 object-cover object-center"
                    />
                  </div>

                  <button
                    className={`w-full py-3 px-4 rounded-lg font-black text-xs uppercase tracking-wider shadow-sm hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer ${paletteStyles.ctaBg} ${paletteStyles.ctaText}`}
                  >
                    {data.clusterCta}
                  </button>
                </div>

                {/* 7. Dark Editorial Footer */}
                <footer className="bg-[#121216] text-white rounded-2xl p-6 text-center space-y-4 shadow-xl border border-white/5">
                  <h4 className="text-lg font-black uppercase font-serif tracking-widest text-slate-200">
                    {data.brandName}
                  </h4>
                  <div className="flex items-center justify-center gap-4 text-slate-400 text-xs">
                    <span className="hover:text-white cursor-pointer">Instagram</span>
                    <span>•</span>
                    <span className="hover:text-white cursor-pointer">TikTok</span>
                    <span>•</span>
                    <span className="hover:text-white cursor-pointer">YouTube</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[9.5px] text-slate-500 flex items-center justify-center gap-3">
                    <span>Privacy Policy</span>
                    <span>Terms & Conditions</span>
                    <span>Contact Us</span>
                  </div>
                </footer>
              </div>
            </div>
          )}

          {/* Mode 2: Full Continuous Scrollable Column */}
          {viewMode === 'single' && (
            <div className="w-full max-w-xl space-y-6 pb-12">
              {/* Clean unified vertical scroll with all sections */}
              <div className={`${paletteStyles.cardBg} ${paletteStyles.textColor} rounded-3xl shadow-2xl overflow-hidden border border-black/10`}>
                {/* Hero Header */}
                <div className="p-8 text-center space-y-5 border-b border-black/5">
                  <h1 className="text-3xl font-black uppercase tracking-tight font-serif">{data.brandName}</h1>
                  <h2 className="text-2xl font-black leading-tight">{data.heroHeadline}</h2>
                  <p className="text-xs text-slate-500 font-medium">{data.heroSubhead}</p>
                  <img src={data.heroImage} alt="Hero" className="w-full rounded-2xl h-96 object-cover shadow-sm" />
                  <p className="text-xs text-slate-600 max-w-md mx-auto">{data.heroCopy}</p>
                  <button className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider ${paletteStyles.ctaBg} ${paletteStyles.ctaText}`}>
                    {data.heroCta}
                  </button>
                </div>

                {/* Lifestyle Section */}
                <div className="p-8 text-center space-y-5 border-b border-black/5">
                  <h3 className="text-xl font-black">{data.lifestyleHeadline}</h3>
                  <p className="text-xs text-slate-500">{data.lifestyleSubhead}</p>
                  <div className="relative rounded-2xl overflow-hidden shadow-sm">
                    <img src={data.lifestyleImage} alt="Lifestyle" className="w-full h-80 object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-3 text-white text-xs font-black">
                      {data.lifestyleOverlayText}
                    </div>
                  </div>
                  <button className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider ${paletteStyles.ctaBg} ${paletteStyles.ctaText}`}>
                    FIND YOUR ROUTINE →
                  </button>
                </div>

                {/* Product Lineup */}
                <div className="p-8 space-y-5 border-b border-black/5">
                  <div className="text-center">
                    <h3 className="text-xl font-black">{data.productsHeadline}</h3>
                    <p className="text-xs text-slate-500">{data.productsSubhead}</p>
                  </div>
                  <div className="space-y-3">
                    {data.products.map((p) => (
                      <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200">
                        <img src={p.imageUrl} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <h4 className="text-xs font-black uppercase">{p.title}</h4>
                          <p className="text-[11px] text-slate-500">{p.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Story Grid */}
                <div className="p-8 space-y-5 border-b border-black/5 text-center">
                  <h3 className="text-xl font-black">{data.storyGridHeadline}</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {data.storyGridPhotos.map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <img src={s.imageUrl} alt={s.tag} className="w-full h-28 object-cover rounded-xl" />
                        <span className="text-[10px] font-black uppercase block">{s.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials & Final CTA */}
                <div className="p-8 text-center space-y-5">
                  <h3 className="text-xl font-black">{data.clusterHeadline}</h3>
                  <img src={data.clusterImage} alt="Cluster" className="w-full h-64 object-cover rounded-2xl" />
                  <button className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider ${paletteStyles.ctaBg} ${paletteStyles.ctaText}`}>
                    {data.clusterCta}
                  </button>
                </div>

                {/* Footer */}
                <footer className="bg-black text-white p-6 text-center space-y-2">
                  <h4 className="text-base font-black font-serif tracking-widest uppercase">{data.brandName}</h4>
                  <p className="text-[10px] text-slate-500">© 2026 {data.brandName}. All rights reserved.</p>
                </footer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToImageLandingPageApp;
