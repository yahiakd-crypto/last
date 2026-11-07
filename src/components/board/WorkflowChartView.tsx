import React, { useState, useMemo } from 'react';
import {
  Layers,
  Target,
  Video,
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowDown,
  DollarSign,
  Users,
  Compass,
  Zap,
  ShoppingBag,
  ExternalLink,
  Split,
  Eye,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Workflow,
  GitFork,
  MessageSquareQuote,
  LayoutGrid,
  ListOrdered,
  FileSpreadsheet,
  ShieldCheck,
  Heart,
  ShoppingCart,
  Truck,
  FileText,
  Lightbulb,
  Flame,
  UserCheck,
  Radio,
  BookOpen,
  PieChart,
  Sun,
  Moon,
} from 'lucide-react';

// ============================================================================
// TOPIC TYPES & INTERFACES
// ============================================================================

export type WorkflowTopicType = string;

export interface TextStyleConfig {
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontSizeScale?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  lineHeight?: 'tight' | 'normal' | 'relaxed';
  fontFamily?: 'sans' | 'serif' | 'mono';
  colorTheme?: 'default' | 'emerald' | 'purple' | 'amber' | 'contrast';
}

export interface SkillTopicOption {
  id: string;
  label: string;
  icon: any;
  categoryTag?: string;
  isExtractedFromContent?: boolean;
}

export interface WorkflowNodeItem {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  badge?: string;
  tag?: string;
  icon?: string;
  metaMetrics?: { label: string; value: string }[];
  primaryText?: string;
  secondaryText?: string;
  visualDirection?: string;
  cta?: string;
  explanation: string;
  keyTakeaways?: string[];
}

export interface WorkflowGroupItem {
  id: string;
  number: number;
  title: string;
  subtitle?: string;
  strategyTag: string;
  audienceOrFocus?: string;
  budgetOrMetric?: string;
  placementsOrChannel?: string;
  wilayasOrScope?: string;
  explanation: string;
  items: WorkflowNodeItem[];
}

export interface UniversalWorkflowData {
  topicType: WorkflowTopicType;
  topicLabel: string;
  title: string;
  subtitle?: string;
  objective: string;
  budgetOrMetric: string;
  biddingOrMechanism: string;
  marketScope: string;
  optimizationGoal: string;
  explanation: string;
  level1Badge: string;
  level2Badge: string;
  level3Badge: string;
  targetMetrics?: { label: string; value: string }[];
  groups: WorkflowGroupItem[];
}

// Backward-compatibility aliases for existing imports
export type WorkflowAdItem = WorkflowNodeItem;
export interface WorkflowAdSetItem extends WorkflowGroupItem {
  audience: string;
  budgetSplit: string;
  placements: string;
  wilayas?: string;
  ads: WorkflowAdItem[];
}
export interface WorkflowCampaignData extends UniversalWorkflowData {
  budget: string;
  bidding: string;
  adSets: WorkflowAdSetItem[];
}

export interface SkillColorTheme {
  name: string;
  primaryBg: string;
  badgeBg: string;
  badgeText: string;
  accentText: string;
  borderPrimary: string;
  borderLight: string;
  gradientCard: string;
  gradientHeader: string;
  tabActiveGradient: string;
  tabInactive: string;
  lineFrom: string;
  lineTo: string;
  glow: string;
  pillBg: string;
}

export function getSkillTheme(skillColor?: string, category?: string): SkillColorTheme {
  const c = (skillColor || '').toLowerCase();
  const cat = (category || '').toLowerCase();

  if (c.includes('emerald') || c.includes('green') || cat.includes('fulfillment') || cat.includes('orders')) {
    return {
      name: 'emerald',
      primaryBg: 'bg-emerald-600',
      badgeBg: 'bg-emerald-500/20',
      badgeText: 'text-emerald-300',
      accentText: 'text-emerald-400',
      borderPrimary: 'border-emerald-500/60',
      borderLight: 'border-emerald-500/30',
      gradientCard: 'from-emerald-950 via-slate-900 to-slate-950',
      gradientHeader: 'from-slate-950 via-slate-900 to-emerald-950',
      tabActiveGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      tabInactive: 'text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100 hover:text-emerald-950 border border-emerald-300/80',
      lineFrom: 'from-emerald-500',
      lineTo: 'to-emerald-400',
      glow: 'shadow-[0_8px_32px_rgba(16,185,129,0.22)]',
      pillBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
    };
  }

  if (c.includes('purple') || c.includes('violet') || c.includes('fuchsia') || cat.includes('copywriting') || cat.includes('offer')) {
    return {
      name: 'purple',
      primaryBg: 'bg-purple-600',
      badgeBg: 'bg-purple-500/20',
      badgeText: 'text-purple-300',
      accentText: 'text-purple-400',
      borderPrimary: 'border-purple-500/60',
      borderLight: 'border-purple-500/30',
      gradientCard: 'from-purple-950 via-slate-900 to-slate-950',
      gradientHeader: 'from-slate-950 via-slate-900 to-purple-950',
      tabActiveGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      tabInactive: 'text-purple-800 bg-purple-50/90 hover:bg-purple-100 hover:text-purple-950 border border-purple-300/80',
      lineFrom: 'from-purple-500',
      lineTo: 'to-purple-400',
      glow: 'shadow-[0_8px_32px_rgba(168,85,247,0.22)]',
      pillBg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
    };
  }

  if (c.includes('blue') || cat.includes('product') || cat.includes('research')) {
    return {
      name: 'blue',
      primaryBg: 'bg-blue-600',
      badgeBg: 'bg-blue-500/20',
      badgeText: 'text-blue-300',
      accentText: 'text-blue-400',
      borderPrimary: 'border-blue-500/60',
      borderLight: 'border-blue-500/30',
      gradientCard: 'from-blue-950 via-slate-900 to-slate-950',
      gradientHeader: 'from-slate-950 via-slate-900 to-blue-950',
      tabActiveGradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      tabInactive: 'text-blue-800 bg-blue-50/90 hover:bg-blue-100 hover:text-blue-950 border border-blue-300/80',
      lineFrom: 'from-blue-500',
      lineTo: 'to-blue-400',
      glow: 'shadow-[0_8px_32px_rgba(59,130,246,0.22)]',
      pillBg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
    };
  }

  if (c.includes('rose') || c.includes('red') || c.includes('pink') || cat.includes('risk') || cat.includes('validation')) {
    return {
      name: 'rose',
      primaryBg: 'bg-rose-600',
      badgeBg: 'bg-rose-500/20',
      badgeText: 'text-rose-300',
      accentText: 'text-rose-400',
      borderPrimary: 'border-rose-500/60',
      borderLight: 'border-rose-500/30',
      gradientCard: 'from-rose-950 via-slate-900 to-slate-950',
      gradientHeader: 'from-slate-950 via-slate-900 to-rose-950',
      tabActiveGradient: 'bg-gradient-to-r from-rose-600 to-pink-600',
      tabInactive: 'text-rose-800 bg-rose-50/90 hover:bg-rose-100 hover:text-rose-950 border border-rose-300/80',
      lineFrom: 'from-rose-500',
      lineTo: 'to-rose-400',
      glow: 'shadow-[0_8px_32px_rgba(244,63,94,0.22)]',
      pillBg: 'bg-rose-500/15 border-rose-500/30 text-rose-300',
    };
  }

  if (c.includes('cyan') || c.includes('teal')) {
    return {
      name: 'cyan',
      primaryBg: 'bg-cyan-600',
      badgeBg: 'bg-cyan-500/20',
      badgeText: 'text-cyan-300',
      accentText: 'text-cyan-400',
      borderPrimary: 'border-cyan-500/60',
      borderLight: 'border-cyan-500/30',
      gradientCard: 'from-cyan-950 via-slate-900 to-slate-950',
      gradientHeader: 'from-slate-950 via-slate-900 to-cyan-950',
      tabActiveGradient: 'bg-gradient-to-r from-cyan-600 to-teal-600',
      tabInactive: 'text-cyan-800 bg-cyan-50/90 hover:bg-cyan-100 hover:text-cyan-950 border border-cyan-300/80',
      lineFrom: 'from-cyan-500',
      lineTo: 'to-cyan-400',
      glow: 'shadow-[0_8px_32px_rgba(6,182,212,0.22)]',
      pillBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    };
  }

  if (c.includes('amber') || c.includes('orange') || c.includes('yellow')) {
    return {
      name: 'amber',
      primaryBg: 'bg-amber-600',
      badgeBg: 'bg-amber-500/20',
      badgeText: 'text-amber-300',
      accentText: 'text-amber-400',
      borderPrimary: 'border-amber-500/60',
      borderLight: 'border-amber-500/30',
      gradientCard: 'from-amber-950 via-slate-900 to-slate-950',
      gradientHeader: 'from-slate-950 via-slate-900 to-amber-950',
      tabActiveGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
      tabInactive: 'text-amber-800 bg-amber-50/90 hover:bg-amber-100 hover:text-amber-950 border border-amber-300/80',
      lineFrom: 'from-amber-500',
      lineTo: 'to-amber-400',
      glow: 'shadow-[0_8px_32px_rgba(245,158,11,0.22)]',
      pillBg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
    };
  }

  // Default: Indigo
  return {
    name: 'indigo',
    primaryBg: 'bg-indigo-600',
    badgeBg: 'bg-indigo-500/20',
    badgeText: 'text-indigo-300',
    accentText: 'text-indigo-400',
    borderPrimary: 'border-indigo-500/60',
    borderLight: 'border-indigo-500/30',
    gradientCard: 'from-indigo-950 via-slate-900 to-slate-950',
    gradientHeader: 'from-slate-950 via-slate-900 to-indigo-950',
    tabActiveGradient: 'bg-gradient-to-r from-indigo-600 to-violet-600',
    tabInactive: 'text-indigo-800 bg-indigo-50/90 hover:bg-indigo-100 hover:text-indigo-950 border border-indigo-300/80',
    lineFrom: 'from-indigo-500',
    lineTo: 'to-indigo-400',
    glow: 'shadow-[0_8px_32px_rgba(99,102,241,0.22)]',
    pillBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
  };
}

export interface WorkflowChartViewProps {
  content: string;
  productTitle?: string;
  skillTitle?: string;
  language?: string;
  direction?: 'ltr' | 'rtl';
  skillColor?: string;
  category?: string;
  textStyle?: TextStyleConfig;
  onCopyWorkflow?: () => void;
}

// ============================================================================
// DYNAMIC SKILL & CONTENT TOPIC EXTRACTOR
// Extracts topics tailored directly to WHAT THIS SKILL DOES + what was analyzed!
// ============================================================================

export function extractSkillTopicOptions(
  skillTitle = '',
  category = '',
  rawContent = '',
  language = 'English'
): SkillTopicOption[] {
  const isDarjaOrArabic = language === 'Algerian Darja' || language === 'Arabic' || /[\u0600-\u06FF]/.test(rawContent);
  const title = (skillTitle || '').toLowerCase();
  const cat = (category || '').toLowerCase();
  const text = rawContent || '';

  const options: SkillTopicOption[] = [];

  // 1. First, extract the REAL topics/sections analyzed in this report!
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const rawSections: { id: string; title: string; points: string[]; explanation: string }[] = [];
  let curTitle = '';
  let curPts: string[] = [];

  lines.forEach((line) => {
    // Check for section heading like "Winning Hooks:", "Summary:", "Market & COD Logistics:", "### Section"
    const headingMatch = line.match(/^(?:###?|####?)\s*(.+)$/) || line.match(/^([A-Z0-9\u0600-\u06FF\s&/\-_'’]{3,45}):(?:\s*(.*))?$/);
    if (headingMatch) {
      const candidate = (headingMatch[1] || '').replace(/[*_#]/g, '').trim();
      const afterColon = headingMatch[2] ? headingMatch[2].trim() : '';
      const isMeta = candidate.toLowerCase().startsWith('product name') || candidate.toLowerCase().startsWith('language') || candidate.toLowerCase().startsWith('date') || candidate.toLowerCase().startsWith('nom du produit');
      if (candidate.length > 2 && candidate.length < 50 && !isMeta) {
        if (curTitle && curPts.length > 0) {
          rawSections.push({
            id: `sec_${rawSections.length}`,
            title: curTitle,
            points: curPts.slice(0, 3),
            explanation: curPts[0] || 'Strategic pillar analyzed in this section.',
          });
          curPts = [];
        }
        curTitle = candidate;
        if (afterColon) curPts.push(afterColon);
        return;
      }
    }

    if (curTitle) {
      if (/^[-*•\d.)]+\s+/.test(line)) {
        const clean = line.replace(/^[-*•\d.)]+\s*/, '').trim();
        if (clean.length > 4) curPts.push(clean);
      } else if (line.length > 20 && curPts.length < 3 && !line.startsWith('|') && !line.startsWith('```')) {
        curPts.push(line);
      }
    }
  });

  if (curTitle && curPts.length > 0) {
    rawSections.push({
      id: `sec_${rawSections.length}`,
      title: curTitle,
      points: curPts.slice(0, 3),
      explanation: curPts[0] || 'Strategic pillar analyzed in this section.',
    });
  }

  // If raw sections exist, each represents a real topic analyzed by this skill!
  if (rawSections.length >= 2) {
    options.push({
      id: 'all_topics',
      label: isDarjaOrArabic ? 'الهيكل الكامل للتقرير' : 'All Topics Blueprint',
      icon: GitFork,
      isExtractedFromContent: true,
    });

    rawSections.forEach((sec, idx) => {
      let icon: any = FileText;
      const lowerT = sec.title.toLowerCase();
      if (lowerT.includes('hook') || lowerT.includes('creative') || lowerT.includes('خطاف')) icon = Flame;
      else if (lowerT.includes('summary') || lowerT.includes('demand') || lowerT.includes('thesis') || lowerT.includes('ملخص')) icon = Sparkles;
      else if (lowerT.includes('market') || lowerT.includes('cod') || lowerT.includes('logistics') || lowerT.includes('توصيل')) icon = Truck;
      else if (lowerT.includes('action') || lowerT.includes('plan') || lowerT.includes('testing') || lowerT.includes('خطة')) icon = Target;
      else if (lowerT.includes('competitor') || lowerT.includes('price') || lowerT.includes('منافس')) icon = PieChart;
      else if (lowerT.includes('audience') || lowerT.includes('persona') || lowerT.includes('جمهور')) icon = UserCheck;

      let label = sec.title;
      if (label.length > 28) label = label.slice(0, 26) + '...';

      options.push({
        id: `sec_${idx}`,
        label,
        icon,
        isExtractedFromContent: true,
      });
    });
  }

  // 2. Add skill-specific domain topics matching WHAT THIS SKILL ACTUALLY DOES:
  if (title.includes('product') || title.includes('research') || cat.includes('product')) {
    if (!options.some((o) => o.id === 'all_topics')) {
      options.push({ id: 'all_topics', label: 'Full Research Blueprint', icon: GitFork });
    }
    options.push({ id: 'demand_trends', label: 'Demand & Market Viability', icon: Sparkles });
    options.push({ id: 'competitor_bench', label: 'Competitor Price & Saturation', icon: PieChart });
    options.push({ id: 'margins_cogs', label: 'Margin & Sourcing Economics', icon: DollarSign });
    options.push({ id: 'cod_potential', label: 'Algerian COD Scalability', icon: Truck });
  } else if (title.includes('meta') || title.includes('campaign') || title.includes('google') || title.includes('tiktok') || cat.includes('acquisition')) {
    if (!options.some((o) => o.id === 'all_topics')) {
      options.push({ id: 'all_topics', label: 'Full Campaign Architecture', icon: GitFork });
    }
    options.push({ id: 'cbo_hierarchy', label: 'CBO Campaign Hierarchy', icon: Target });
    options.push({ id: 'audience_clusters', label: 'Audience & Wilaya Clusters', icon: Users });
    options.push({ id: 'angle_testing', label: 'Creative Angle Testing', icon: Flame });
    options.push({ id: 'scaling_rules', label: 'Budget Pacing & Scaling', icon: Zap });
  } else if (title.includes('creative') || title.includes('video') || title.includes('production')) {
    if (!options.some((o) => o.id === 'all_topics')) {
      options.push({ id: 'all_topics', label: 'Full Creative Engine', icon: GitFork });
    }
    options.push({ id: 'thumb_stop_hooks', label: '3s Thumb-Stop Hooks', icon: Flame });
    options.push({ id: 'visual_broll', label: 'Visual B-Roll Storyboard', icon: Video });
    options.push({ id: 'darja_scripts', label: 'Darja Voiceover Scripts', icon: MessageSquareQuote });
    options.push({ id: 'objection_cta', label: 'Objection Crushing & CTA', icon: ShieldCheck });
  } else if (title.includes('library') || title.includes('competitor') || title.includes('facebook ads')) {
    if (!options.some((o) => o.id === 'all_topics')) {
      options.push({ id: 'all_topics', label: 'Competitor Ads Audit', icon: GitFork });
    }
    options.push({ id: 'active_competitor_ads', label: 'Active Ads Breakdown', icon: Eye });
    options.push({ id: 'creative_longevity', label: 'Hook Formats & Longevity', icon: Flame });
    options.push({ id: 'offer_bundles', label: 'Bundle Offers & Pricing', icon: ShoppingBag });
    options.push({ id: 'scaling_signals', label: 'Scaling & Longevity Signals', icon: Target });
  } else if (title.includes('cod') || title.includes('logistics') || title.includes('order') || title.includes('wilaya') || cat.includes('fulfillment')) {
    if (!options.some((o) => o.id === 'all_topics')) {
      options.push({ id: 'all_topics', label: 'Full COD Architecture', icon: GitFork });
    }
    options.push({ id: 'wilaya_rates', label: '58 Wilayas Delivery Matrix', icon: Truck });
    options.push({ id: 'courier_routing', label: 'Courier Routing (Yalidine/ZR)', icon: Compass });
    options.push({ id: 'call_center', label: 'Call Center Confirmation Protocol', icon: Radio });
    options.push({ id: 'rto_defense', label: 'RTO Refusal & Cancellation', icon: ShieldCheck });
  } else if (title.includes('copywriting') || title.includes('offer') || title.includes('landing')) {
    if (!options.some((o) => o.id === 'all_topics')) {
      options.push({ id: 'all_topics', label: 'Offer & Copywriting Engine', icon: GitFork });
    }
    options.push({ id: 'irresistible_bundle', label: 'Bundle Offer & Anchoring', icon: ShoppingCart });
    options.push({ id: 'trust_inspection', label: 'Parcel Inspection Policy', icon: ShieldCheck });
    options.push({ id: 'pas_copywriting', label: 'Pain-Agitation-Solution Copy', icon: MessageSquareQuote });
    options.push({ id: 'urgency_scarcity', label: 'Urgency & Stock Triggers', icon: Zap });
  } else {
    // Custom Skill or general topic
    if (!options.some((o) => o.id === 'all_topics')) {
      options.push({ id: 'all_topics', label: `${skillTitle || 'Skill'} Architecture`, icon: GitFork });
    }
    options.push({ id: 'core_thesis', label: 'Core Strategy Thesis', icon: Sparkles });
    options.push({ id: 'execution_pillars', label: 'Execution Pillars', icon: Layers });
    options.push({ id: 'actionable_steps', label: 'Tactical Steps', icon: Target });
  }

  return options;
}

export function detectTopicFromContext(
  content: string,
  skillTitle = '',
  category = ''
): WorkflowTopicType {
  const options = extractSkillTopicOptions(skillTitle, category, content);
  return options[0]?.id || 'all_topics';
}

// ============================================================================
// TOPIC WORKFLOW BUILDERS
// ============================================================================

export function parseWorkflowFromContent(
  rawContent: string,
  productTitle = 'E-commerce Product',
  skillTitle = 'Topic Analysis',
  language = 'English',
  forcedTopic?: WorkflowTopicType
): UniversalWorkflowData {
  const topic = forcedTopic || detectTopicFromContext(rawContent, skillTitle);
  const text = rawContent || '';
  const isDarjaOrArabic =
    language === 'Algerian Darja' || language === 'Arabic' || /[\u0600-\u06FF]/.test(text);
  const isFrench = language === 'French' || /Livraison|Accroche|Vente|Produit/i.test(text);

  // Extract common sections or fallback sentences
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const detectedProduct = productTitle || 'Target E-commerce Product';

  // 1. BUYER PERSONA & AUDIENCE CLUSTERS WORKFLOW
  if (topic === 'buyer_persona' || topic === 'audience_clusters') {
    return {
      topicType: 'buyer_persona',
      topicLabel: isDarjaOrArabic ? 'شخصية المشتري المثالي' : isFrench ? 'Profil Persona Acheteur' : 'Ideal Buyer Persona',
      title: `${detectedProduct} • ${isDarjaOrArabic ? 'هندسة شخصية المشتري وقرار الشراء' : 'Target Buyer Persona Architecture'}`,
      subtitle: isDarjaOrArabic
        ? 'تحليل دوافع الشراء، نقاط الألم، ومحفزات تأكيد الطلب بالدفع عند الاستلام'
        : 'Comprehensive breakdown of customer psychographics, pain triggers & COD objections',
      objective: isDarjaOrArabic
        ? 'استهداف الشريحة الأكثر رغبة وقدرة على الشراء الفوري في الجزائر'
        : 'High-LTV Algerian & Regional Impulse Shoppers (Ages 22-48)',
      budgetOrMetric: isDarjaOrArabic ? 'جاهزية الدفع COD: 92%' : 'COD Intent Score: 92%',
      biddingOrMechanism: isDarjaOrArabic ? 'قوة الشراء: متوسطة إلى مرتفعة' : 'Purchasing Power: Mid-to-High',
      marketScope: isDarjaOrArabic ? 'الولايات الكبرى (الوسط، وهران، سطيف، قسنطينة)' : 'Wilayas with >88% Delivery Rate',
      optimizationGoal: isDarjaOrArabic ? 'تأكيد الطلب الفوري عبر الهاتف' : 'Instant Phone Confirmation Rate > 85%',
      explanation: isDarjaOrArabic
        ? `هذا المشتري يبحث عن حل فوري وملموس لمشكلته اليومية، ويحتاج إلى رؤية المنتج في تجربة حقيقية وضمان المعاينة قبل الدفع لتبديد أي تردد.`
        : isFrench
        ? `Le persona cible recherche un soulagement immédiat à son problème quotidien. La garantie de vérification du colis avant paiement est son déclencheur numéro 1.`
        : `Primary avatar is driven by instant utility and emotional relief. Requires zero-friction proof and explicit reassurance that the parcel can be opened upon delivery.`,
      level1Badge: isDarjaOrArabic ? 'المستوى 1 • هوية المشتري المستهدف' : 'LEVEL 1 • PRIMARY AVATAR PROFILE',
      level2Badge: isDarjaOrArabic ? 'المستوى 2 • الركائز النفسية للشراء' : 'LEVEL 2 • PSYCHOGRAPHIC PILLARS',
      level3Badge: isDarjaOrArabic ? 'المستوى 3 • محفزات اتخاذ القرار' : 'LEVEL 3 • CONVERSION TRIGGERS',
      targetMetrics: [
        { label: 'Primary Age', value: '24 - 45' },
        { label: 'Top Wilayas', value: 'Alger, Blida, Oran, Sétif' },
        { label: 'Buying Window', value: '18h00 - 23h30' },
      ],
      groups: [
        {
          id: 'grp-pain',
          number: 1,
          title: isDarjaOrArabic ? 'الركيزة 1: نقاط الألم والإحباط اليومي' : 'Pillar 1: Core Pain Points & Frustrations',
          strategyTag: 'PAIN AGITATION',
          audienceOrFocus: isDarjaOrArabic ? 'المعاناة من الحلول المؤقتة والمنتجات المقلدة' : 'Exhausted by low-quality fakes & temporary fixes',
          budgetOrMetric: 'High Emotional Weight',
          explanation: isDarjaOrArabic
            ? 'المستهلك جرب حلولاً سابقة رديئة الجودة وخاب أمله، ويبحث عن منتج أصلي مضمون يعطيه نتيجة من أول استعمال.'
            : 'The prospect has suffered from cheap imitations and wasted money. They require undeniable proof of durability and authenticity.',
          items: [
            {
              id: 'node-pain-1',
              number: 1,
              title: isDarjaOrArabic ? 'الإحباط من التقليد وخسارة المال' : 'Disappointment from Counterfeit Products',
              primaryText: isDarjaOrArabic
                ? 'شريت من قبل منتجات رخيصة وتكسرو بعد يومين؟ هاد المرة الأصلي المضمون راهو هنا.'
                : 'Tired of cheap online products breaking in 24 hours? Here is the genuine certified solution.',
              explanation: isDarjaOrArabic
                ? 'مخاطبة تجربة الخداع السابقة تبني الثقة الفورية وتفصل علامتك عن الباعة العشوائيين.'
                : 'Directly acknowledging past bad shopping experiences builds instant empathy and trust.',
              cta: isDarjaOrArabic ? 'ضمان الاستبدال المجاني' : 'Certified Authentic Guarantee',
            },
            {
              id: 'node-pain-2',
              number: 2,
              title: isDarjaOrArabic ? 'المعاناة اليومية وضيق الوقت' : 'Daily Life Friction & Time Drain',
              primaryText: isDarjaOrArabic
                ? 'ما عندكش وقت تضيعو؟ وفر جهدك وتمتع بحل سريع في دقائق قليلة يومياً.'
                : 'Struggling with wasted time and effort? Experience effortless relief in just 3 minutes.',
              explanation: isDarjaOrArabic
                ? 'التركيز على الراحة السريعة يرفع نسبة الطلب العاطفي بدون تأجيل.'
                : 'Highlights immediate time and effort savings to trigger impulsive ordering.',
              cta: isDarjaOrArabic ? 'وفر وقتك الآن' : 'Save Time Today',
            },
          ],
        },
        {
          id: 'grp-desire',
          number: 2,
          title: isDarjaOrArabic ? 'الركيزة 2: الرغبات العميقة والنتيجة المنشودة' : 'Pillar 2: Deep Desires & Dream Outcome',
          strategyTag: 'DREAM OUTCOME',
          audienceOrFocus: isDarjaOrArabic ? 'البحث عن الراحة، التميز والنتيجة المباشرة' : 'Seeking comfort, social status & immediate transformation',
          budgetOrMetric: 'High Conversion Pull',
          explanation: isDarjaOrArabic
            ? 'المشتري لا يشتري الميزات التقنية، بل يشتري شعور الراحة والاطمئنان والنتيجة الواضحة أمام عائلته وزملائه.'
            : 'The customer does not buy specifications; they buy the feeling of relief, confidence, and pride in solving their issue.',
          items: [
            {
              id: 'node-desire-1',
              number: 1,
              title: isDarjaOrArabic ? 'التحول المباشر والإحساس بالراحة' : 'Instant Visible Transformation',
              primaryText: isDarjaOrArabic
                ? 'من أول استعمال راح تحس بالفرق وراحة البال لي كنت تحوس عليها من مدة.'
                : 'Feel the difference and peace of mind from your very first session.',
              explanation: isDarjaOrArabic
                ? 'إبراز النتيجة الفورية يقلل مرحلة التردد قبل ملء استمارة الطلب.'
                : 'Fast-acting benefits dramatically shorten the customer consideration phase.',
              cta: isDarjaOrArabic ? 'اكتشف الفرق الآن' : 'See The Difference',
            },
          ],
        },
        {
          id: 'grp-objection',
          number: 3,
          title: isDarjaOrArabic ? 'الركيزة 3: مخاوف الدفع عند الاستلام والحلول' : 'Pillar 3: COD Skepticism & Risk Reversals',
          strategyTag: 'OBJECTION CRUSHER',
          audienceOrFocus: isDarjaOrArabic ? 'الخوف من عدم وصول الطرد أو عدم تطابق المحتوى' : 'Worried about shipping delays, damaged boxes, or scams',
          budgetOrMetric: 'Zero Risk Tolerance',
          explanation: isDarjaOrArabic
            ? 'أكبر عائق أمام الطلبيات المؤكدة في الجزائر هو الخوف من عدم القدرة على فتح العلبة. تقديم المعاينة قبل الدفع يرفع التحويل بـ 45%.'
            : 'The #1 friction point in Algerian COD is fear of being scammed. Guaranteeing parcel inspection prior to payment lifts confirmation by 45%.',
          items: [
            {
              id: 'node-obj-1',
              number: 1,
              title: isDarjaOrArabic ? 'حق المعاينة والتأكد قبل تسليم المبلغ' : 'Inspect Before You Pay Policy',
              primaryText: isDarjaOrArabic
                ? 'معنا تفتح الباكي ديالك وتتأكد من السلعة مليح مع الليفرور قبل ما تخلص أي دينار!'
                : 'Open and inspect your parcel with our courier before paying a single Dinar!',
              explanation: isDarjaOrArabic
                ? 'هذا الشرط يزيل أي تردد نفسي ويجعل نسبة تأكيد الاتصال تتجاوز 90%.'
                : 'Completely eliminates payment anxiety and drives telephone confirmation rate above 90%.',
              cta: isDarjaOrArabic ? 'أطلب وأنت مطمئن' : 'Order With 100% Zero Risk',
            },
          ],
        },
      ],
    };
  }

  // 2. VIRAL HOOKS & CREATIVE ANGLES WORKFLOW
  if (topic === 'hooks' || topic === 'thumb_stop_hooks' || topic === 'angle_testing' || topic === 'creative_longevity') {
    return {
      topicType: 'hooks',
      topicLabel: isDarjaOrArabic ? 'هندسة الخطافات الإعلانية الفيروسية' : isFrench ? 'Architecture des Accroches Vidéo' : 'Viral Ad Hooks Engine',
      title: `${detectedProduct} • ${isDarjaOrArabic ? 'مخطط الخطافات والزوايا الإعلانية' : 'Viral Hook & Creative Angle Flowchart'}`,
      subtitle: isDarjaOrArabic
        ? 'تحليل إيقاف التمرير في أول 3 ثوانٍ مع سكريبتات دارجة وتوجيهات بصرية'
        : '3-Second thumb-stop hooks, visual angles, Darja scripts & high-CTR CTAs',
      objective: isDarjaOrArabic
        ? 'رفع نسبة الاحتفاظ بالمشاهدة فوق 65% في فيد تيك توك وريلز'
        : 'Thumb-Stop Rate > 68% across Meta Reels & TikTok DZ',
      budgetOrMetric: isDarjaOrArabic ? 'معدل الاحتفاظ 3ث: 68%' : '3s Retention: 68%+',
      biddingOrMechanism: isDarjaOrArabic ? 'صيغة: فيديو عمودي 9:16' : 'Format: 9:16 Vertical UGC',
      marketScope: isDarjaOrArabic ? 'الجمهور الجزائري والمغاربي النشط' : 'Algerian Mobile Feed Users',
      optimizationGoal: isDarjaOrArabic ? 'النقرات المؤدية للشراء الفوري' : 'High CTR & Impulsive Add-to-Cart',
      explanation: isDarjaOrArabic
        ? `في الإعلانات الممولة في الجزائر، الخطاف في أول ثانيتين هو الذي يحدد ربحية الحملة. نستخدم الصدمة البصرية، طرح المشكل بالدارجة، وتأكيد الدفع عند الاستلام.`
        : isFrench
        ? `Sur TikTok et Reels, les 3 premières secondes déterminent 80% du ROAS. Nous misons sur la démonstration tactile brute et le problème agité en Darija.`
        : `Thumb-stop rate is the master lever of COD profitability. These hooks lead with tactile demonstration before introducing the brand or face.`,
      level1Badge: isDarjaOrArabic ? 'المستوى 1 • استراتيجية إيقاف التمرير' : 'LEVEL 1 • THUMB-STOP HOOK ENGINE',
      level2Badge: isDarjaOrArabic ? 'المستوى 2 • الزوايا الإعلانية الإبداعية' : 'LEVEL 2 • CREATIVE ANGLES',
      level3Badge: isDarjaOrArabic ? 'المستوى 3 • السكريبتات والتوجيه البصري' : 'LEVEL 3 • SCRIPTS & VISUAL DIRECTION',
      targetMetrics: [
        { label: '3s Thumb-Stop', value: '68%+' },
        { label: 'Avg Watch Time', value: '14.2s' },
        { label: 'Outbound CTR', value: '3.8%' },
      ],
      groups: [
        {
          id: 'grp-hook-1',
          number: 1,
          title: isDarjaOrArabic ? 'الزاوية 01: الصدمة البصرية والإثبات الفوري' : 'Angle 1: Raw Proof & Shock Demonstration',
          strategyTag: 'VISCERAL PROOF',
          audienceOrFocus: isDarjaOrArabic ? 'إثبات الفعالية في أول ثانيتين بدون مقدمات' : 'Immediate tactile product demonstration before logo',
          budgetOrMetric: 'Top Scaling Hook',
          explanation: isDarjaOrArabic
            ? 'الكاميرا تبدأ مباشرة بالمنتج وهو يعمل ويحل المشكل بطريقة مبهرة، مما يجبر المشاهد على التوقف ومتابعة التفاصيل.'
            : 'Immediate visual shock disrupts mindless scrolling and holds viewers past the critical 3-second threshold.',
          items: [
            {
              id: 'node-h1',
              number: 1,
              title: isDarjaOrArabic ? 'خطاف الإثبات القاطع' : 'Shock Proof Pattern Interrupt',
              primaryText: isDarjaOrArabic
                ? 'شفت هاد السلعة لي راهي دايرة حالة في تيك توك؟ شوف بعينك واش دير في أول دقيقة!'
                : 'Stop scrolling! Look at what everyone in Algeria is raving about right now.',
              visualDirection: isDarjaOrArabic
                ? '0-3 ثوانٍ: لقطة قريبة جداً ومتحركة للمنتج وهو يقوم بعمله بنجاح باهر دون ظهور الوجه.'
                : '0-3s: Macro tactile demonstration showing product in rapid action before any spoken intro.',
              cta: isDarjaOrArabic ? 'أطلب الآن والدفع عند الاستلام' : 'Commander Maintenant (Paiement à la Livraison)',
              explanation: isDarjaOrArabic
                ? 'الإثبات البصري المباشر يرفع الثقة ويزيد نسبة النقر إلى صفحة الهبوط.'
                : 'Direct visual proof builds unshakeable credibility and drives high-intent clicks.',
            },
          ],
        },
        {
          id: 'grp-hook-2',
          number: 2,
          title: isDarjaOrArabic ? 'الزاوية 02: مخاطبة المشكل والحل الجذري' : 'Angle 2: Problem-Agitation-Solution (PAS)',
          strategyTag: 'PAIN & RELIEF',
          audienceOrFocus: isDarjaOrArabic ? 'مخاطبة التعب والإرهاق اليومي وتقديم الحل السحري' : 'Relatable frustration followed by instant satisfaction',
          budgetOrMetric: 'Consistent Converter',
          explanation: isDarjaOrArabic
            ? 'نبدأ بجملة تلمس وجع المستهلك الحقيقي، ثم نكشف أن الحل أصبح متوفراً في الجزائر مع التوصيل لباب المنزل.'
            : 'Validates real human frustration, then presents the product as the zero-risk solution delivered to their doorstep.',
          items: [
            {
              id: 'node-h2',
              number: 2,
              title: isDarjaOrArabic ? 'خطاف الوجع اليومي' : 'Daily Pain Relief Hook',
              primaryText: isDarjaOrArabic
                ? 'عييت من هاد المشكل وكل مرة تجرب حاجة وتخسر دراهمك؟ جبنالك الحل الأصلي حتى لباب دارك.'
                : 'Tired of struggling every day and wasting your hard-earned money? Here is the real answer.',
              visualDirection: isDarjaOrArabic
                ? '0-3 ثوانٍ: شخص يعبر عن انزعاجه الحقيقي من المشكل، ثم ابتسامة مريحة فور استخدام المنتج.'
                : '0-3s: Expression of real frustration with old method, then instant smile of relief using product.',
              cta: isDarjaOrArabic ? 'احجز طلبيتك قبل نفاذ الكمية' : 'Profiter de l\'Offre Spéciale',
              explanation: isDarjaOrArabic
                ? 'الربط العاطفي بين الألم والحل يضاعف الرغبة في الشراء الفوري.'
                : 'Emotional connection between pain and relief multiplies purchase urgency.',
            },
          ],
        },
        {
          id: 'grp-hook-3',
          number: 3,
          title: isDarjaOrArabic ? 'الزاوية 03: نفاذ المخزون وعرض التوصيل' : 'Angle 3: Scarcity & Limited Depot Stock',
          strategyTag: 'URGENCY SCARCITY',
          audienceOrFocus: isDarjaOrArabic ? 'الكمية محدودة في مستودع الجزائر مع توصيل سريع' : 'Limited pieces in local wilaya warehouse with fast dispatch',
          budgetOrMetric: 'Closing Engine',
          explanation: isDarjaOrArabic
            ? 'استغلال شعور الخوف من فوات الفرصة (FOMO) مع عرض خاص وتوصيل لجميع الولايات.'
            : 'Leverages genuine scarcity to convert fence-sitters before stock in local hub depletes.',
          items: [
            {
              id: 'node-h3',
              number: 3,
              title: isDarjaOrArabic ? 'خطاف نفاذ المخزون المحلي' : 'Depot Flash Clearance Hook',
              primaryText: isDarjaOrArabic
                ? 'بقات كمية قليلة في المستودع! أطلب زوج حبات والتوصيل باطل لـ 58 ولاية اليوم فقط.'
                : 'Only 35 units left in our Algiers depot! Order 2 today and get FREE delivery to 58 Wilayas.',
              visualDirection: isDarjaOrArabic
                ? '0-3 ثوانٍ: لقطة علب جاهزة للشحن مع ملصق التوصيل السريع واسم ولاية المشتري.'
                : '0-3s: Showing prepared parcels with courier labels being packed for immediate dispatch.',
              cta: isDarjaOrArabic ? 'استفد من التوصيل المجاني' : 'Claim Free Shipping Now',
              explanation: isDarjaOrArabic
                ? 'العروض المحدودة بالوقت والكمية ترفع من سرعة تأكيد الطلب بنسبة 35%.'
                : 'Time-sensitive bundles accelerate order placement and reduce phone cancellations.',
            },
          ],
        },
      ],
    };
  }

  // 3. CAMPAIGN STRUCTURE & CBO SCALING WORKFLOW
  if (topic === 'campaign_structure' || topic === 'cbo_hierarchy' || topic === 'scaling_rules' || topic === 'scaling_signals') {
    return {
      topicType: 'campaign_structure',
      topicLabel: isDarjaOrArabic ? 'هيكلة الحملة الإعلانية' : isFrench ? 'Structure de Campagne' : 'Campaign Architecture',
      title: `${detectedProduct} • Advantage+ Scaling Architecture`,
      subtitle: isDarjaOrArabic
        ? 'حملة CBO مركزية لتوجيه الميزانية آلياً نحو المجموعات الأكثر ربحية'
        : 'CBO Campaign -> Segmented Ad Sets -> Multi-Angle Creative Testing',
      objective: isDarjaOrArabic
        ? 'المبيعات وتأكيد الطلبيات (Sales / Purchase COD)'
        : isFrench
        ? 'Conversions & Ventes COD (Paiement à la Livraison)'
        : 'Sales & COD Conversions (Advantage+ Budget CBO)',
      budgetOrMetric: '6,000 DZD / Day (CBO Scalable)',
      biddingOrMechanism: isDarjaOrArabic ? 'أعلى حجم تحويلات مع سقف تكلفة الطلب' : 'Highest Volume (Auto-bid)',
      marketScope: isDarjaOrArabic ? 'الجزائر (58 ولاية مع ياليدي وزد آر إكسبريس)' : 'Algeria National (58 Wilayas COD)',
      optimizationGoal: 'Purchase / Verified COD Order',
      explanation: isDarjaOrArabic
        ? `خطة إعلانية وهيكلة شاملة لحملة ${detectedProduct} في سوق التجارة الإلكترونية الجزائري. تعتمد على ميزانية CBO مركزية لتوجيه رأس المال آلياً نحو المجموعات الأكثر تحويلاً بأقل تكلفة للطلبية المؤكدة.`
        : isFrench
        ? `Architecture de campagne CBO Advantage+ pour ${detectedProduct}. Centralise le budget sur les segments les plus rentables tout en minimisant le coût par commande.`
        : `Unified CBO campaign structure engineered for ${detectedProduct}. Centralizes budget allocation across broad testing, interest stacking, and retargeting to maximize margin.`,
      level1Badge: 'LEVEL 1 • TOP-LEVEL CAMPAIGN (CBO)',
      level2Badge: 'LEVEL 2 • AD SET AUDIENCES',
      level3Badge: 'LEVEL 3 • AD CREATIVES',
      targetMetrics: [
        { label: 'Target CPA', value: '450 DZD' },
        { label: 'Target Delivery %', value: '88%+' },
        { label: 'Breakeven ROAS', value: '2.4x' },
      ],
      groups: [
        {
          id: 'grp-c1',
          number: 1,
          title: isDarjaOrArabic ? 'المجموعة 01: الاستهداف المفتوح (Broad Testing)' : 'Ad Set 1: Broad Testing (No Interests)',
          strategyTag: 'SCALE ENGINE',
          audienceOrFocus: isDarjaOrArabic ? 'كل الجزائر | العمر 20-55+ | رجال ونساء' : 'Broad Algeria | Age 20-55+ | All Genders',
          budgetOrMetric: '2,500 DZD / day (42%)',
          placementsOrChannel: 'Advantage+ Placements (Meta Reels, Feeds & TikTok FYP)',
          wilayasOrScope: 'Top Hubs: Alger (16), Oran (31), Blida (09), Sétif (19)',
          explanation: isDarjaOrArabic
            ? 'الاستهداف المفتوح يمنح الخوارزمية الحرية لاكتشاف شرائح المشترين ويخفض تكلفة الـ CPM بمقدار 35%.'
            : 'Broad testing allows the ad platform algorithm to discover winning buyer clusters without interest saturation.',
          items: [
            {
              id: 'node-c1-1',
              number: 1,
              title: 'Ad 1: Proof & Shock Hook (Demonstration)',
              primaryText: isDarjaOrArabic
                ? 'شفت هاد السلعة لي راهي دايرة حالة في تيك توك؟ جرب بنفسك وشوف الفرق في أول دقيقة!'
                : 'Stop scrolling! Watch why everyone in Algeria is raving about this product.',
              visualDirection: '0-3s: Immediate tactile demonstration showing product in action before showing face or logo.',
              cta: isDarjaOrArabic ? 'أطلب الآن والدفع عند الاستلام' : 'Commander Maintenant (Paiement à la Livraison)',
              explanation: 'Focuses on visceral 3-second pattern interruption and immediate proof to keep thumb-stop rate > 65%.',
            },
            {
              id: 'node-c1-2',
              number: 2,
              title: 'Ad 2: Problem-Agitation-Solution Angle',
              primaryText: isDarjaOrArabic
                ? 'عييت من المشكل هادا وكل مرة تلقى حلول ما تخدمش؟ جبنالك الحل الأصلي والمضمون لباب دارك.'
                : 'Tired of cheap imitations that break in days? Here is the real verified original solution.',
              visualDirection: '0-3s: Expressing real human frustration with everyday problem, followed by instant relief.',
              cta: isDarjaOrArabic ? 'احجز طلبيتك الآن' : 'Profiter de l\'Offre Spéciale',
              explanation: 'Agitates the genuine consumer pain point and presents the product as the zero-risk remedy.',
            },
          ],
        },
        {
          id: 'grp-c2',
          number: 2,
          title: isDarjaOrArabic ? 'المجموعة 02: الاهتمامات المتراكمة (Stacked Interests)' : 'Ad Set 2: High-Intent Interests Matrix',
          strategyTag: 'HIGH-INTENT',
          audienceOrFocus: isDarjaOrArabic ? 'تسوق إلكتروني + أجهزة ذكية + حلول الراحة | 22-50' : 'Online Shopping + Comfort / Tech Gadgets | 22-50',
          budgetOrMetric: '2,000 DZD / day (33%)',
          placementsOrChannel: 'Feeds & Video Feeds (Facebook & Instagram)',
          wilayasOrScope: 'National 58 Wilayas (Excluding remote transit zones)',
          explanation: isDarjaOrArabic
            ? 'تجميع الاهتمامات يقلل التداخل ويستهدف المستهلكين الذين لديهم سوابق شراء متكررة عبر الإنترنت.'
            : 'Stacked interests isolate verified frequent online shoppers with higher average order value.',
          items: [
            {
              id: 'node-c2-1',
              number: 3,
              title: 'Ad 3: Social Proof & Customer Unboxing',
              primaryText: isDarjaOrArabic
                ? 'شوف رأي زبائننا في مختلف ولايات الوطن بعد ما استلمو السلعة وجربوها في ديارهم!'
                : 'See real customer unboxing and reviews from Algerian buyers across 58 wilayas.',
              visualDirection: '0-3s: Showing customer opening parcel with courier and confirming product perfection.',
              cta: isDarjaOrArabic ? 'شاهد آراء المشترين وأطلب' : 'Commander en Toute Sécurité',
              explanation: 'Eliminates trust barriers in the Algerian market through authentic unboxing and verified reviews.',
            },
          ],
        },
        {
          id: 'grp-c3',
          number: 3,
          title: isDarjaOrArabic ? 'المجموعة 03: إعادة الاستهداف (Retargeting)' : 'Ad Set 3: Warm Retargeting & Scarcity',
          strategyTag: 'RETARGETING',
          audienceOrFocus: isDarjaOrArabic ? 'المتفاعلون مع الصفحة ومشاهدو الفيديو 50%+' : 'Engaged with Page / Video Viewers 50%+ (Past 30 Days)',
          budgetOrMetric: '1,500 DZD / day (25%)',
          placementsOrChannel: 'All Mobile Placements (Stories, Feeds, In-stream)',
          wilayasOrScope: 'Hot Buyers Hub (Centre, Oran, Constantine)',
          explanation: isDarjaOrArabic
            ? 'إعادة استهداف المهتمين الذين لم يؤكدوا طلبهم بعد، مع تقديم حافز توصيل مجاني أو تخفيض للقطعتين.'
            : 'Converts warm leads who visited but didn’t complete the COD confirmation form.',
          items: [
            {
              id: 'node-c3-1',
              number: 4,
              title: 'Ad 4: Urgency Offer & Free Wilaya Shipping',
              primaryText: isDarjaOrArabic
                ? 'مازالك متردد؟ اليوم فقط: أطلب حبة والثانية بنصف السعر والتوصيل مجاني لباب دارك!'
                : 'Still hesitating? Today only: Buy 1 get 2nd at 50% off + FREE delivery to your door!',
              visualDirection: '0-3s: Limited stock counter showing 12 parcels left in central courier hub.',
              cta: isDarjaOrArabic ? 'استغل العرض قبل انتهاء العداد' : 'Réclamer Mon Offre Spéciale',
              explanation: 'Creates legitimate scarcity and removes price friction to trigger immediate COD checkout.',
            },
          ],
        },
      ],
    };
  }

  // 4. COPYWRITING & OFFER WORKFLOW
  if (
    topic === 'copywriting_offer' ||
    topic === 'irresistible_bundle' ||
    topic === 'pas_copywriting' ||
    topic === 'offer_bundles' ||
    topic === 'urgency_scarcity' ||
    topic === 'trust_inspection'
  ) {
    return {
      topicType: 'copywriting_offer',
      topicLabel: isDarjaOrArabic ? 'العرض الذي لا يقاوم والكتابة الإعلانية' : isFrench ? 'Offre Irrésistible & Copywriting' : 'Irresistible Offer & Copy Engine',
      title: `${detectedProduct} • Value Proposition & Offer Architecture`,
      subtitle: isDarjaOrArabic
        ? 'بناء عرض متكامل مع مضاعفة القيمة المدركة وإلغاء مخاطر الدفع عند الاستلام'
        : 'Irresistible Offer Formula -> AIDA Persuasion Copy -> Risk-Reversal CTAs',
      objective: isDarjaOrArabic
        ? 'رفع معدل إتمام استمارة الطلب ورفع متوسط قيمة السلة (AOV)'
        : 'Maximize Form Completion & Average Order Value (AOV)',
      budgetOrMetric: 'Target Conversion: 4.8%+',
      biddingOrMechanism: 'Bundling (Buy 2 Get 10% Off + Free Delivery)',
      marketScope: 'National Algeria E-commerce Stores',
      optimizationGoal: 'Zero-Hesitation Impulse Ordering',
      explanation: isDarjaOrArabic
        ? `العرض الناجح في السوق الجزائري يعتمد على سعر نفسي ذكي (مثل 3800 دج أو 4800 دج) مع عرض كميات يشجع على شراء قطعتين، وتأكيد حق المعاينة قبل الدفع.`
        : isFrench
        ? `L'offre gagnante combine un ancrage de prix psychologique fort, un bundle à 2 pièces avec livraison offerte, et la réassurance totale du paiement à la livraison.`
        : `A high-converting COD offer centers on psychological pricing, bundle incentives that double margins, and bulletproof risk reversal.`,
      level1Badge: 'LEVEL 1 • CORE VALUE PROPOSITION',
      level2Badge: 'LEVEL 2 • PERSUASION FRAMEWORK (AIDA)',
      level3Badge: 'LEVEL 3 • HEADLINES & COPY ASSETS',
      targetMetrics: [
        { label: 'Form Conversion', value: '4.8%+' },
        { label: 'Bundle Uptake', value: '42%' },
        { label: 'AOV Lift', value: '+35%' },
      ],
      groups: [
        {
          id: 'grp-co-1',
          number: 1,
          title: isDarjaOrArabic ? 'المرحلة 01: العنوان الجذاب والخطاف الإعلاني' : 'Phase 1: Attention Hook & Big Idea',
          strategyTag: 'ATTENTION',
          audienceOrFocus: isDarjaOrArabic ? 'جذب الانتباه الفوري في الثانية الأولى' : 'Stop cold traffic and frame the primary breakthrough',
          budgetOrMetric: 'Top of Funnel',
          explanation: isDarjaOrArabic
            ? 'عنوان مباشر يربط بين أكبر مشكلة يعاني منها الزبون والحل المبتكر دون استخدام مصطلحات معقدة.'
            : 'Directly hooks cold traffic by promising tangible relief from their primary everyday frustration.',
          items: [
            {
              id: 'node-co1',
              number: 1,
              title: isDarjaOrArabic ? 'العنوان الرئيسي المقنع' : 'The Big Idea Headline',
              primaryText: isDarjaOrArabic
                ? 'الحل الأصلي والنهائي لي راح يهنيك من المشكل وتشوف النتيجة بعينك من أول نهار!'
                : 'The original verified breakthrough that solves your daily struggle once and for all.',
              explanation: 'Positions the product as the definitive, authentic solution to separate it from inferior clones.',
              cta: isDarjaOrArabic ? 'اكتشف التفاصيل الكاملة' : 'Découvrir la Solution',
            },
          ],
        },
        {
          id: 'grp-co-2',
          number: 2,
          title: isDarjaOrArabic ? 'المرحلة 02: الرغبة والإثبات الملموس' : 'Phase 2: Desire Building & Social Proof',
          strategyTag: 'DESIRE & PROOF',
          audienceOrFocus: isDarjaOrArabic ? 'إبراز الميزات كفوائد ملموسة لحياة المشتري' : 'Translating technical features into emotional benefits',
          budgetOrMetric: 'Mid Funnel',
          explanation: isDarjaOrArabic
            ? 'التركيز على راحة البال، وتوفير الوقت، وسهولة الاستخدام مع شهادات زبائن حقيقيين من ولايات مختلفة.'
            : 'Demonstrates tangible lifestyle improvements and builds overwhelming social proof.',
          items: [
            {
              id: 'node-co2',
              number: 2,
              title: isDarjaOrArabic ? 'حزمة الفوائد الثلاثية' : '3-Point Benefit Stack',
              primaryText: isDarjaOrArabic
                ? '• سهل الاستخدام بدون أي تعقيد\n• جودة أصلية تدوم طويلاً\n• راحة تامة توفر عليك مصاريف متكررة'
                : '• Effortless 3-minute operation\n• Certified medical/premium durability\n• Saves hundreds in recurring expenses',
              explanation: 'Transforms abstract specifications into concrete, daily lifestyle upgrades.',
              cta: isDarjaOrArabic ? 'تأكيد المواصفات الأصلية' : 'Verified Specifications',
            },
          ],
        },
        {
          id: 'grp-co-3',
          number: 3,
          title: isDarjaOrArabic ? 'المرحلة 03: إلغاء المخاطر ونداء الشراء الفوري' : 'Phase 3: Risk Reversal & Urgent Action',
          strategyTag: 'CALL TO ACTION',
          audienceOrFocus: isDarjaOrArabic ? 'تشجيع الزبون على حجز طلبه الآن بدون أي تردد' : 'Remove all payment hesitation and close the order',
          budgetOrMetric: 'Bottom of Funnel',
          explanation: isDarjaOrArabic
            ? 'تقديم ضمان المعاينة قبل الدفع مع عرض حبة ثانية بسعر تفضيلي وتوصيل سريع.'
            : 'Provides ironclad reassurance that payment only occurs after the customer holds and inspects the parcel.',
          items: [
            {
              id: 'node-co3',
              number: 3,
              title: isDarjaOrArabic ? 'عرض الباقة الذهبية' : 'Golden Bundle Offer & Guarantee',
              primaryText: isDarjaOrArabic
                ? 'أطلب قطعتين واحصل على توصيل مجاني لباب منزلك + حق المعاينة والتأكد قبل تسليم المبلغ للموزع.'
                : 'Order 2 today for FREE nationwide shipping + 100% parcel inspection rights with our courier.',
              explanation: 'Lifts average basket size while dropping confirmation cancellation rate by 30%.',
              cta: isDarjaOrArabic ? 'اضغط هنا لتأكيد طلبك' : 'Commander Maintenant',
            },
          ],
        },
      ],
    };
  }

  // 5. COD LOGISTICS & WILAYA WORKFLOW
  if (
    topic === 'cod_logistics' ||
    topic === 'wilaya_rates' ||
    topic === 'courier_routing' ||
    topic === 'call_center' ||
    topic === 'rto_defense' ||
    topic === 'cod_potential'
  ) {
    return {
      topicType: 'cod_logistics',
      topicLabel: isDarjaOrArabic ? 'لوجستيات الدفع عند الاستلام والتوصيل' : isFrench ? 'Logistique COD & Wilayas' : 'COD Logistics & Wilaya Engine',
      title: `${detectedProduct} • 58 Wilayas Fulfillment Architecture`,
      subtitle: isDarjaOrArabic
        ? 'خطة التوصيل، إدارة مراكز ياليدي وزد آر، وتقليل نسبة الـ Retour'
        : 'National Carrier Routing -> Confirmation Protocol -> RTO Return Prevention',
      objective: isDarjaOrArabic
        ? 'تحقيق نسبة تسليم تتجاوز 88% عبر 58 ولاية وخفض تكلفة الارتجاع'
        : 'Achieve >88% Delivery Success across Algeria with Minimal RTO',
      budgetOrMetric: 'Target Delivery: 88%+',
      biddingOrMechanism: 'Yalidine & ZR Express Hybrid Routing',
      marketScope: 'Algeria 58 Wilayas (Hubs & Stop-Desk)',
      optimizationGoal: 'Low Return Rate (<12%) & High Cash Flow',
      explanation: isDarjaOrArabic
        ? `النجاح في التجارة الإلكترونية بالجزائر يرتكز على لوجستيات احترافية: الاتصال لتأكيد الطلب خلال 15 دقيقة، وتوفير خيار الاستلام من المكتب (Stop-Desk) لتقليل الرجوع.`
        : isFrench
        ? `La rentabilité e-commerce en Algérie repose sur la logistique : confirmation téléphonique sous 15 min et promotion du retrait en bureau (Stop-Desk).`
        : `COD margins depend on strict fulfillment discipline: sub-15 minute confirmation calls and incentivize stop-desk pickup to maximize delivery rates.`,
      level1Badge: 'LEVEL 1 • NATIONAL LOGISTICS ENGINE',
      level2Badge: 'LEVEL 2 • REGIONAL SHIPPING HUBS',
      level3Badge: 'LEVEL 3 • CONFIRMATION & RETURN SHIELD',
      targetMetrics: [
        { label: 'Target Delivery %', value: '88%+' },
        { label: 'Avg Lead Time', value: '24h - 48h' },
        { label: 'Stop-Desk Share', value: '55%' },
      ],
      groups: [
        {
          id: 'grp-log-1',
          number: 1,
          title: isDarjaOrArabic ? 'المنطقة 01: ولايات الوسط ذات الكثافة العالية' : 'Zone 1: Capital & Central Wilayas (Hub 16/09/35)',
          strategyTag: 'FAST TRANSIT',
          audienceOrFocus: isDarjaOrArabic ? 'الجزائر العاصمة، البليدة، بومرداس، تيبازة' : 'Alger, Blida, Boumerdès, Tipaza (24h Delivery)',
          budgetOrMetric: 'Transit: 24h Max',
          explanation: isDarjaOrArabic
            ? 'تمثل 45% من حجم المبيعات الإجمالي مع أعلى نسبة تسليم تفوق 91% وتكلفة شحن منخفضة.'
            : 'Accounts for 45% of total volume with >91% delivery rate and rapid 24-hour turnaround.',
          items: [
            {
              id: 'node-log1',
              number: 1,
              title: isDarjaOrArabic ? 'بروتوكول الشحن السريع في نفس اليوم' : 'Same-Day Dispatch & Delivery Protocol',
              primaryText: isDarjaOrArabic
                ? 'الطلبيات المؤكدة قبل 13h تشحن وتصل في أقل من 24 ساعة لباب الزبون.'
                : 'Orders confirmed prior to 13:00 dispatched immediately with guaranteed 24h delivery.',
              explanation: 'Speed is the ultimate return killer: sub-24h delivery slashes customer cancellations by half.',
              cta: isDarjaOrArabic ? 'شحن فوري اليوم' : 'Same-Day Express',
            },
          ],
        },
        {
          id: 'grp-log-2',
          number: 2,
          title: isDarjaOrArabic ? 'المنطقة 02: كبرى ولايات الشرق والغرب' : 'Zone 2: Major Regional Metros (Est & Ouest)',
          strategyTag: 'HIGH-VOLUME',
          audienceOrFocus: isDarjaOrArabic ? 'وهران، سطيف، قسنطينة، تلمسان، عنابة، باتنة' : 'Oran, Sétif, Constantine, Tlemcen, Annaba (36-48h)',
          budgetOrMetric: 'Transit: 36h - 48h',
          explanation: isDarjaOrArabic
            ? 'قدرة شرائية عالية، مع أفضلية لخيار الاستلام من مكتب شركة التوصيل (Stop-Desk) لتقليل الارتجاع.'
            : 'High purchasing power with 60% preference for stop-desk branch collection.',
          items: [
            {
              id: 'node-log2',
              number: 2,
              title: isDarjaOrArabic ? 'تحفيز الاستلام من مكاتب ياليدي (Stop-Desk)' : 'Stop-Desk Branch Pickup Optimization',
              primaryText: isDarjaOrArabic
                ? 'خصم 200 دج على سعر التوصيل عند اختيار الاستلام من أقرب مكتب ياليدي في ولايتك.'
                : 'Incentivize branch collection with a 200 DZD discount for guaranteed 94% pickup rates.',
              explanation: 'Stop-desk pickup prevents "client unreachable" courier failures and boosts cash flow velocity.',
              cta: isDarjaOrArabic ? 'أقرب مكتب استلام' : 'Branch Pickup Hub',
            },
          ],
        },
        {
          id: 'grp-log-3',
          number: 3,
          title: isDarjaOrArabic ? 'المنطقة 03: بروتوكول تأكيد الهاتف ومكافحة الـ Retour' : 'Zone 3: Confirmation Call & Anti-RTO Shield',
          strategyTag: 'RETURN SHIELD',
          audienceOrFocus: isDarjaOrArabic ? 'الاتصال خلال 15 دقيقة وإرسال رسالة واتساب' : '15-Minute outbound call + WhatsApp location ping',
          budgetOrMetric: 'Refusal: < 10%',
          explanation: isDarjaOrArabic
            ? 'فريق التأكيد يوضح محتويات العلبة، السعر الإجمالي الشامل للشحن، وحق المعاينة لتفادي أي رفض عند الباب.'
            : 'Confirmation agents verify complete address, confirm total price, and remind buyers to keep cash ready.',
          items: [
            {
              id: 'node-log3',
              number: 3,
              title: isDarjaOrArabic ? 'سكريبت الاتصال الهاتفي الاحترافي' : 'Telephone Confirmation Best Practice',
              primaryText: isDarjaOrArabic
                ? '"أهلاً خويا، معك خدمة الزبائن بخصوص طلبيتك. السعر الإجمالي مع التوصيل راهو 4800 دج والسلعة توصلك غدوة وتقدر تتأكد منها مع الليفرور."'
                : '"Hello, calling to verify your parcel. Total including delivery is exactly 4,800 DZD. You can inspect it upon delivery tomorrow."',
              explanation: 'Explicitly stating total bundled price on call prevents unpleasant courier surprises.',
              cta: isDarjaOrArabic ? 'بروتوكول التأكيد' : 'Call Center Protocol',
            },
          ],
        },
      ],
    };
  }

  // 6. COMPETITOR & MARKET INTELLIGENCE WORKFLOW
  if (topic === 'competitor_market') {
    return {
      topicType: 'competitor_market',
      topicLabel: isDarjaOrArabic ? 'تحليل المنافسين وحصة السوق' : isFrench ? 'Analyse Concurrence & Marché' : 'Competitor & Market Intelligence',
      title: `${detectedProduct} • Competitive Landscape & Market Domination`,
      subtitle: isDarjaOrArabic
        ? 'تحليل نقاط ضعف المنافسين، تسعير السوق، وفرص الاستحواذ'
        : 'Market Sizing -> Competitor Weakness Tear-Down -> Winning Differentiators',
      objective: isDarjaOrArabic
        ? 'الاستحواذ على حصة سوقية رائدة بالتميز في جودة المنتج وسرعة التوصيل'
        : 'Outcompete Dropshippers with Branded Packaging & Fast Delivery',
      budgetOrMetric: 'Competitor Price: 3,800 - 5,200 DZD',
      biddingOrMechanism: 'Quality Superiority & Real Video Proof',
      marketScope: 'Algeria TikTok & Meta Marketplace',
      optimizationGoal: 'Become the #1 Recognized Local Brand',
      explanation: isDarjaOrArabic
        ? `أغلب المنافسين في السوق يبيعون نسخاً مقلدة بدون ضمان ويستعملون فيديوهات مسروقة من الخارج. التميز بتصوير محلي بالدارجة وضمان حقيقي يمنحك الصدارة فوراً.`
        : isFrench
        ? `La majorité des concurrents utilisent des vidéos étrangères copiées et vendent des répliques. Le tournage local en Darija et le packaging soigné créent un monopole.`
        : `Most Algerian competitors run low-quality creative scrapes and generic products. Custom local Darja UGC and branded packaging deliver an unassailable edge.`,
      level1Badge: 'LEVEL 1 • MARKET INTELLIGENCE',
      level2Badge: 'LEVEL 2 • COMPETITOR PROFILES',
      level3Badge: 'LEVEL 3 • DIFFERENTIATION WEAPONS',
      targetMetrics: [
        { label: 'Market Demand', value: 'Surging' },
        { label: 'Competitor Saturation', value: 'Moderate' },
        { label: 'Margin Potential', value: '68%+' },
      ],
      groups: [
        {
          id: 'grp-cmp-1',
          number: 1,
          title: isDarjaOrArabic ? 'المنافس 01: الباعة العشوائيون والمنتجات المقلدة' : 'Tier 1: Generic Dropshippers & Cheap Clones',
          strategyTag: 'LOW QUALITY',
          audienceOrFocus: isDarjaOrArabic ? 'تسعير منخفض وجودة رديئة بدون دعم' : 'Compete strictly on lowest price with zero customer support',
          budgetOrMetric: 'Price: ~3,200 DZD',
          explanation: isDarjaOrArabic
            ? 'يعانون من نسبة إرجاع تتجاوز 35% بسبب شكاوى الزبائن وسوء جودة المنتج.'
            : 'Suffers from >35% return rates due to product breakage and angry buyer complaints.',
          items: [
            {
              id: 'node-cmp1',
              number: 1,
              title: isDarjaOrArabic ? 'نقطة الضعف: غياب الثقة والجودة' : 'Their Vulnerability: Zero Trust & Fragile Build',
              primaryText: isDarjaOrArabic
                ? 'منتجاتهم تخسر بعد أيام ولا يقدمون أي ضمان. فرصتنا: إبراز شهادة الجودة الأصلية والتجربة المباشرة.'
                : 'Their product breaks in 3 days with no warranty. Our weapon: Certified quality & unboxing proof.',
              explanation: 'Highlight our 30-day warranty to siphon skeptical buyers away from unreliable sellers.',
              cta: isDarjaOrArabic ? 'ضمان الجودة الأصلية' : 'Superior Quality Proof',
            },
          ],
        },
        {
          id: 'grp-cmp-2',
          number: 2,
          title: isDarjaOrArabic ? 'المنافس 02: العلامات التجارية والمستوردون الكبار' : 'Tier 2: Traditional Retailers & Big Importers',
          strategyTag: 'HIGH PRICED',
          audienceOrFocus: isDarjaOrArabic ? 'تسعير مرتفع جداً وتوصيل بطيء' : 'Overpriced showroom retail with slow delivery options',
          budgetOrMetric: 'Price: 6,500+ DZD',
          explanation: isDarjaOrArabic
            ? 'أسعارهم مبالغ فيها وإجراءات الطلب لديهم معقدة.'
            : 'High overhead costs force them to overcharge; slow to adapt to TikTok & Reels trends.',
          items: [
            {
              id: 'node-cmp2',
              number: 2,
              title: isDarjaOrArabic ? 'فرصتنا: السعر المباشر والطلب بضغطة زر' : 'Our Advantage: Direct Fair Price & 1-Click Order',
              primaryText: isDarjaOrArabic
                ? 'نقدم نفس الجودة الممتازة بنصف السعر ومباشرة لباب المنزل دون عناء التنقل للمحلات.'
                : 'We offer exact premium performance at 40% lower cost delivered straight to the door.',
              explanation: 'Convenience + fair direct-to-consumer pricing captures mainstream family buyers.',
              cta: isDarjaOrArabic ? 'سعر مباشر عادل' : 'Direct Fair Pricing',
            },
          ],
        },
      ],
    };
  }

  // 7. UNIVERSAL TOPIC WORKFLOW (Dynamic Analysis of the Text)
  // Extracts topic sections directly from headings & text!
  const extractedSections: { title: string; points: string[]; explanation: string }[] = [];
  let currentTitle = '';
  let currentPoints: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith('#') || line.endsWith(':') || (line.length < 50 && /^[0-9]\.|^[A-Z][a-z]+/.test(line) && !line.includes('.'))) {
      if (currentTitle && currentPoints.length > 0) {
        extractedSections.push({
          title: currentTitle.replace(/^#+\s*/, '').replace(/:$/, ''),
          points: currentPoints.slice(0, 3),
          explanation: currentPoints[0] || 'Strategic pillar extracted from intelligence report.',
        });
        currentPoints = [];
      }
      currentTitle = line.replace(/^#+\s*/, '').replace(/:$/, '');
    } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
      const cleanPt = line.replace(/^[-•*]\s*/, '').trim();
      if (cleanPt) currentPoints.push(cleanPt);
    } else if (line.length > 15 && currentPoints.length < 3) {
      currentPoints.push(line);
    }
  });

  if (currentTitle && currentPoints.length > 0) {
    extractedSections.push({
      title: currentTitle.replace(/^#+\s*/, '').replace(/:$/, ''),
      points: currentPoints.slice(0, 3),
      explanation: currentPoints[0] || 'Strategic pillar extracted from intelligence report.',
    });
  }

  // Handle specific section topic selection (e.g. sec_0, sec_1, etc.)
  if (topic.startsWith('sec_')) {
    const secIdx = parseInt(topic.replace('sec_', ''), 10);
    const targetSec = extractedSections[secIdx];
    if (targetSec) {
      return {
        topicType: topic,
        topicLabel: targetSec.title,
        title: `${detectedProduct} • ${targetSec.title}`,
        subtitle: targetSec.explanation || `Strategic breakdown of ${targetSec.title}`,
        objective: isDarjaOrArabic
          ? `تحليل تفصيلي لمحور "${targetSec.title}" واستخراج الركائز التنفيذية`
          : `Deep tactical deconstruction of "${targetSec.title}" into operational vectors`,
        budgetOrMetric: isDarjaOrArabic ? 'دقة التحليل: 98%' : 'Topic Priority: High',
        biddingOrMechanism: isDarjaOrArabic ? 'منهجية تحليل البيانات' : 'Tactical Execution Vector',
        marketScope: isDarjaOrArabic ? 'السوق الجزائري 58 ولاية' : '58 Algerian Wilayas Scope',
        optimizationGoal: isDarjaOrArabic ? 'تحقيق أعلى عائد على الاستثمار' : 'Maximum Execution Impact',
        explanation: targetSec.explanation || `Operational insights extracted directly from ${targetSec.title}.`,
        level1Badge: `LEVEL 1 • ${targetSec.title.toUpperCase().slice(0, 32)}`,
        level2Badge: 'LEVEL 2 • STRATEGIC PILLARS',
        level3Badge: 'LEVEL 3 • TACTICAL ACTIONS',
        targetMetrics: [
          { label: 'Strategic Focus', value: targetSec.title.slice(0, 16) },
          { label: 'Key Pillars', value: `${targetSec.points.length} Pillars` },
          { label: 'Execution', value: 'Production' },
        ],
        groups: targetSec.points.map((pt, pIdx) => ({
          id: `grp-sec-${secIdx}-${pIdx}`,
          number: pIdx + 1,
          title: pt.length > 45 ? pt.slice(0, 45) + '...' : pt,
          strategyTag: `PILLAR 0${pIdx + 1}`,
          audienceOrFocus: pt,
          budgetOrMetric: 'Key Vector',
          explanation: pt,
          items: [
            {
              id: `item-sec-${secIdx}-${pIdx}-1`,
              number: 1,
              title: isDarjaOrArabic ? 'تنفيذ التوصية الميدانية' : 'Tactical Implementation Vector',
              primaryText: pt,
              explanation: isDarjaOrArabic
                ? 'تطبيق هذه الركيزة بدقة يرفع نسبة التحويل ويقلل تكلفة الاكتساب.'
                : 'Direct execution of this finding optimizes conversion efficiency.',
              cta: isDarjaOrArabic ? 'تنفيذ الخطوة' : 'Execute Step',
            },
          ],
        })),
      };
    }
  }

  // Handle skill-specific domain topics:
  if (topic === 'demand_trends') {
    return {
      topicType: 'demand_trends',
      topicLabel: isDarjaOrArabic ? 'حجم الطلب وإمكانات السوق' : 'Market Demand & Growth Potential',
      title: `${detectedProduct} • Market Demand & Trends Analysis`,
      subtitle: 'Consumer pull metrics, search trajectory & impulse buying triggers',
      objective: 'High-Volume Product Demand Validation in Algerian Market',
      budgetOrMetric: 'Demand Score: 94/100',
      biddingOrMechanism: 'Consumer Pull Trajectory',
      marketScope: 'National Algeria (58 Wilayas)',
      optimizationGoal: 'Validated Market Depth > 5,000 Units/Month',
      explanation: 'Search volume and social engagement reveal strong untreated pain points and immediate visual fascination.',
      level1Badge: 'LEVEL 1 • DEMAND & TREND ENGINE',
      level2Badge: 'LEVEL 2 • DEMAND PILLARS',
      level3Badge: 'LEVEL 3 • VERIFICATION STEPS',
      targetMetrics: [
        { label: 'Market Demand', value: 'High' },
        { label: 'Search Index', value: '+142%' },
        { label: 'Saturation', value: 'Low' },
      ],
      groups: [
        {
          id: 'grp-dt-1',
          number: 1,
          title: 'Immediate Visual Proof & Demonstration Fascination',
          strategyTag: 'DEMO PULL',
          audienceOrFocus: 'Problem-aware consumers needing tactile conviction',
          budgetOrMetric: 'Top Driver',
          explanation: 'Demonstrations that solve immediate pain disruption trigger impulsive checkout intent.',
          items: [
            {
              id: 'node-dt-1',
              number: 1,
              title: 'Visceral Before/After Transformation',
              primaryText: 'Clear visual disparity between problem state and solved state in first 2 seconds.',
              explanation: 'Reduces cognitive load and eliminates lengthy consideration.',
              cta: 'Validate Demo Factor',
            },
          ],
        },
        {
          id: 'grp-dt-2',
          number: 2,
          title: 'Seasonal Evergreen Stability',
          strategyTag: 'EVERGREEN',
          audienceOrFocus: 'Year-round household and personal utility',
          budgetOrMetric: 'Consistent LTV',
          explanation: 'Product does not rely on short holiday peaks and sustains healthy margins across all quarters.',
          items: [
            {
              id: 'node-dt-2',
              number: 1,
              title: 'Multi-Demographic Cross-Appeal',
              primaryText: 'Useful for drivers, office workers, elders, and families across all regions.',
              explanation: 'Expands audience beyond narrow age brackets.',
              cta: 'Deploy Broad Testing',
            },
          ],
        },
      ],
    };
  }

  if (topic === 'competitor_bench' || topic === 'active_competitor_ads') {
    return {
      topicType: topic,
      topicLabel: 'Competitor Benchmark & Market Saturation',
      title: `${detectedProduct} • Competitor Pricing & Saturation Breakdown`,
      subtitle: 'Spy-tool tear-down of active competitor ads, offer structures & margin gaps',
      objective: 'Uncover Competitor Fatigue Points & Win Market Share',
      budgetOrMetric: 'Market Saturation: Moderate (28 Active Stores)',
      biddingOrMechanism: 'Differentiation Vector',
      marketScope: 'Algerian Facebook & TikTok Ad Space',
      optimizationGoal: 'Out-Convert Generic Ads by 2.4x with Superior Offer',
      explanation: 'Competitors run weak generic French video creatives with poor delivery guarantees, leaving massive room for Darja proof-driven branding.',
      level1Badge: 'LEVEL 1 • COMPETITOR INTELLIGENCE',
      level2Badge: 'LEVEL 2 • BENCHMARK PILLARS',
      level3Badge: 'LEVEL 3 • COMPETITIVE LEVERS',
      targetMetrics: [
        { label: 'Avg Competitor Price', value: '4,200 DZD' },
        { label: 'Active Creatives', value: '18 Ads' },
        { label: 'Ad Longevity', value: '45+ Days' },
      ],
      groups: [
        {
          id: 'grp-cb-1',
          number: 1,
          title: 'Competitor Offer & Price Tear-down',
          strategyTag: 'PRICING EDGE',
          audienceOrFocus: 'Price-conscious shoppers comparing options',
          budgetOrMetric: 'Price Advantage',
          explanation: 'Most competitors sell single units without free shipping bundles.',
          items: [
            {
              id: 'node-cb-1',
              number: 1,
              title: 'Bundle Superiority (Buy 2 + Free Delivery)',
              primaryText: 'Anchor single unit at fair price, make 2-pack irresistible with bundled free delivery.',
              explanation: 'Lifts AOV from 3,800 DZD to 6,400 DZD and crushes competitor unit margins.',
              cta: 'Implement Offer Bundle',
            },
          ],
        },
      ],
    };
  }

  if (topic === 'margins_cogs') {
    return {
      topicType: 'margins_cogs',
      topicLabel: 'Margin & Sourcing Unit Economics',
      title: `${detectedProduct} • Profit Margin & Cost Breakdown`,
      subtitle: 'Complete economic model: COGS, shipping, return allowance & net ROI',
      objective: 'Guarantee >65% Gross Profit Margin on Confirmed COD Orders',
      budgetOrMetric: 'Net Target Profit: +1,800 DZD / Delivered Unit',
      biddingOrMechanism: 'Unit Economic Guardrails',
      marketScope: 'Algeria Wholesale Depots & Import Channels',
      optimizationGoal: 'Break-Even Delivery Rate < 62%',
      explanation: 'Clear pricing formulas protect ad spend against RTO returns and courier return fees.',
      level1Badge: 'LEVEL 1 • FINANCIAL UNIT ECONOMICS',
      level2Badge: 'LEVEL 2 • ECONOMIC PILLARS',
      level3Badge: 'LEVEL 3 • MARGIN SAFEGUARDS',
      targetMetrics: [
        { label: 'Selling Price', value: '3,800 - 4,800 DZD' },
        { label: 'Product Cost', value: '1,100 - 1,400 DZD' },
        { label: 'Target Margin', value: '+71%' },
      ],
      groups: [
        {
          id: 'grp-mc-1',
          number: 1,
          title: 'COGS & Sourcing Feasibility',
          strategyTag: 'COGS CONTROL',
          audienceOrFocus: 'Local suppliers in Hamiz, El Eulma & Algiers import depots',
          budgetOrMetric: 'Low Acquisition Cost',
          explanation: 'Acquire inventory at stable domestic wholesale rates before scale.',
          items: [
            {
              id: 'node-mc-1',
              number: 1,
              title: 'Tiered Quantity Sourcing Discounts',
              primaryText: 'Negotiate unit cost down by 15% when committing to 200+ unit batches.',
              explanation: 'Directly drops break-even ad cost per purchase by 250 DZD.',
              cta: 'Lock Sourcing Price',
            },
          ],
        },
      ],
    };
  }

  if (topic === 'visual_broll' || topic === 'darja_scripts' || topic === 'objection_cta') {
    return {
      topicType: topic,
      topicLabel: isDarjaOrArabic ? 'سكريبت الدارجة وتصوير الفيديو' : 'Darja Video Script & Storyboard',
      title: `${detectedProduct} • UGC Video Creative Storyboard`,
      subtitle: 'Complete 30-second shoot breakdown: hooks, b-roll angles & authentic Darja voiceover',
      objective: 'High-Retention Video Creative Delivering >4.2% Conversion Rate',
      budgetOrMetric: 'Video Duration: 24s - 32s',
      biddingOrMechanism: 'Organic UGC Tone (Darja Dialect)',
      marketScope: 'Algeria TikTok & Meta Reels Feed',
      optimizationGoal: 'Full Video Completion Rate > 35%',
      explanation: 'Authentic local video footage recorded on smartphone with real Darja audio converts 3.4x better than polished generic studio ads.',
      level1Badge: 'LEVEL 1 • UGC VIDEO PRODUCTION',
      level2Badge: 'LEVEL 2 • SCENE-BY-SCENE PILLARS',
      level3Badge: 'LEVEL 3 • DARJA SCRIPTS & B-ROLL CUTS',
      targetMetrics: [
        { label: 'Hook Retention', value: '71%+' },
        { label: 'Video Length', value: '28 Sec' },
        { label: 'Voiceover', value: 'Algerian Darja' },
      ],
      groups: [
        {
          id: 'grp-scr-1',
          number: 1,
          title: 'Scene 1 (0-3s): Hook & Problem Demonstration',
          strategyTag: 'HOOK & DISRUPT',
          audienceOrFocus: 'Cold audience scrolling fast on mobile',
          budgetOrMetric: 'First 3 Seconds',
          explanation: 'Visceral close-up showing the pain point being experienced in an authentic Algerian household setting.',
          items: [
            {
              id: 'node-scr-1',
              number: 1,
              title: 'Visual Action + Darja Shock Hook',
              primaryText: 'دارجة: "إذا مازلت تعاني من هاد المشكل كل يوم، شوف الحل لي راهو داير حالة في الدزاير!"',
              visualDirection: 'Macro shot of product solving the problem with water/texture/sound in first 2 seconds.',
              explanation: 'Immediate visual reward stops scrolling fingers instantly.',
              cta: 'Direct Look to Camera',
            },
          ],
        },
        {
          id: 'grp-scr-2',
          number: 2,
          title: 'Scene 2 (3-18s): Solution Proof & Texture B-Roll',
          strategyTag: 'PROOF DEMO',
          audienceOrFocus: 'Curious viewers evaluating utility and build quality',
          budgetOrMetric: 'Mid Retention',
          explanation: 'Hands-on demonstration showing step-by-step ease of use without complex jargon.',
          items: [
            {
              id: 'node-scr-2',
              number: 1,
              title: 'Step-by-Step Hands Demonstration',
              primaryText: 'دارجة: "طريقة الاستعمال ساهلة بزاف، دير هكذا برك وتشوف النتيجة قدام عينك في دقائق."',
              visualDirection: 'Over-the-shoulder POV shot showing hands opening and demonstrating product.',
              explanation: 'Reduces cognitive barrier by showing how easy it is to operate.',
              cta: 'Display Ease of Use',
            },
          ],
        },
        {
          id: 'grp-scr-3',
          number: 3,
          title: 'Scene 3 (18-30s): COD Inspection Guarantee & CTA',
          strategyTag: 'COD CLOSE',
          audienceOrFocus: 'Skeptical buyers requiring zero-risk reassurance',
          budgetOrMetric: 'Final Conversion',
          explanation: 'Reassure buyer that courier delivers to door and allows opening parcel before payment.',
          items: [
            {
              id: 'node-scr-3',
              number: 1,
              title: 'Inspect Parcel Before Payment Policy',
              primaryText: 'دارجة: "أطلب درك والتوصيل حتى لباب الدار، وتفتح الباكي ديالك وتتأكد من السلعة قبل ما تخلص!"',
              visualDirection: 'Courier handover shot: customer opening clean branded parcel with smile.',
              explanation: 'Removes the final and biggest objection to placing an order.',
              cta: 'Order Now Button Pulse',
            },
          ],
        },
      ],
    };
  }

  // Fallback pillars if sections couldn't be parsed
  const finalSections =
    extractedSections.length >= 2
      ? extractedSections.slice(0, 3)
      : [
          {
            title: isDarjaOrArabic ? 'التحليل الاستراتيجي والمميزات الأساسية' : 'Strategic Thesis & Core Value',
            points: [
              isDarjaOrArabic ? 'ميزة تنافسية واضحة في السوق المستهدف' : 'Clear competitive advantage identified in target market',
              isDarjaOrArabic ? 'طلب مرتفع مع قابلية توسع عبر الإعلانات الممولة' : 'High consumer pull with scalable paid media economics',
            ],
            explanation: isDarjaOrArabic
              ? 'تحديد الركيزة الأساسية لنجاح المنتج وتحقيق هوامش ربحية مستقرة.'
              : 'Core foundational pillar driving verified customer demand and healthy unit economics.',
          },
          {
            title: isDarjaOrArabic ? 'خطة التنفيذ العملي والتسويق' : 'Execution Blueprint & Action Points',
            points: [
              isDarjaOrArabic ? 'صناعة إعلانات فيديو تركز على التجربة الحقيقية' : 'Deploy authentic demonstration video creatives',
              isDarjaOrArabic ? 'تحسين مسار الطلب وضمان سرعة التوصيل' : 'Optimize checkout funnel with transparent COD guarantees',
            ],
            explanation: isDarjaOrArabic
              ? 'خطوات عملية لتحويل التحليل النظري إلى مبيعات مؤكدة وأرباح ملموسة.'
              : 'Tactical execution steps to transition strategic intelligence into verified deliveries.',
          },
        ];

  return {
    topicType: 'all_topics',
    topicLabel: isDarjaOrArabic ? 'مخطط التحليل الشامل' : `${skillTitle || 'Skill'} Architecture`,
    title: `${detectedProduct} • ${skillTitle || 'Universal Topic Flowchart'}`,
    subtitle: isDarjaOrArabic
      ? 'تفكيك شامل لمحتوى التقرير إلى مستويات هيكلية واضحة ومترابطة'
      : 'Comprehensive hierarchical decomposition of analyzed topic intelligence',
    objective: isDarjaOrArabic ? 'تحليل الموضوع واستخراج ركائز العمل' : `Extract Core ${skillTitle || 'Topic'} Thesis & Actionable Vectors`,
    budgetOrMetric: isDarjaOrArabic ? 'تحليل متكامل 360°' : 'High-Impact Action Plan',
    biddingOrMechanism: isDarjaOrArabic ? 'منهجية تحليل البيانات الذكية' : 'Data-Driven Topic Strategy',
    marketScope: isDarjaOrArabic ? 'السوق الجزائري والدولي' : 'National & Regional Target Market',
    optimizationGoal: isDarjaOrArabic ? 'تحقيق أقصى عائد على الاستثمار' : 'Maximum Execution Velocity & Profitability',
    explanation:
      lines.find((l) => l.length > 50 && !l.startsWith('#')) ||
      (isDarjaOrArabic
        ? `هذا المخطط يحلل موضوع "${skillTitle}" الخاص بمنتج "${detectedProduct}" ويفككه إلى ركائز واضحة قابلة للتنفيذ المباشر.`
        : `Structured hierarchical workflow generated from "${skillTitle}" intelligence analysis for "${detectedProduct}".`),
    level1Badge: `LEVEL 1 • ${(skillTitle || 'TOPIC').toUpperCase()} THESIS`,
    level2Badge: 'LEVEL 2 • STRATEGIC PILLARS',
    level3Badge: 'LEVEL 3 • ACTIONABLE TACTICS',
    targetMetrics: [
      { label: 'Strategic Clarity', value: 'High' },
      { label: 'Actionable Steps', value: `${finalSections.reduce((acc, s) => acc + s.points.length, 0)} Points` },
      { label: 'Readiness', value: 'Production' },
    ],
    groups: finalSections.map((sec, idx) => ({
      id: `grp-dyn-${idx}`,
      number: idx + 1,
      title: sec.title,
      strategyTag: `PILLAR 0${idx + 1}`,
      audienceOrFocus: sec.points[0] || 'Target focus area',
      budgetOrMetric: 'Key Pillar',
      explanation: sec.explanation,
      items: sec.points.map((pt, pIdx) => ({
        id: `node-dyn-${idx}-${pIdx}`,
        number: pIdx + 1,
        title: pt.length > 40 ? pt.slice(0, 40) + '...' : pt,
        primaryText: pt,
        explanation: isDarjaOrArabic
          ? 'نقطة عملية مستخرجة مباشرة من تحليل الموضوع لتحقيق نتائج ملموسة.'
          : 'Concrete actionable insight extracted directly from content analysis.',
        cta: isDarjaOrArabic ? 'تنفيذ التوصية' : 'Execute Tactic',
      })),
    })),
  };
}

// ============================================================================
// MAIN COMPONENT: WORKFLOW CHART VIEW
// ============================================================================

export const WorkflowChartView: React.FC<WorkflowChartViewProps> = ({
  content,
  productTitle = 'E-commerce Product',
  skillTitle = 'Topic Analysis',
  language = 'English',
  direction = 'ltr',
  skillColor,
  category,
  textStyle,
  onCopyWorkflow,
}) => {
  // Color theme derived strictly from the card skill color!
  const theme = useMemo(() => getSkillTheme(skillColor, category), [skillColor, category]);

  // Topic Options: Analyzes what this skill actually does + all report sections analyzed in real time!
  const topicOptions = useMemo(
    () => extractSkillTopicOptions(skillTitle, category, content, language),
    [skillTitle, category, content, language]
  );

  // Detected auto topic
  const detectedTopic = useMemo(
    () => detectTopicFromContext(content, skillTitle, category),
    [content, skillTitle, category]
  );

  // Active selected topic state (defaults to first extracted topic or detected topic)
  const [selectedTopic, setSelectedTopic] = useState<WorkflowTopicType>(() => {
    return topicOptions[0]?.id || detectedTopic || 'all_topics';
  });

  // Sync selectedTopic if skill or content changes and current topic is no longer present
  React.useEffect(() => {
    if (topicOptions.length > 0 && !topicOptions.some((o) => o.id === selectedTopic)) {
      setSelectedTopic(topicOptions[0].id);
    }
  }, [topicOptions, selectedTopic]);

  const [viewLayout, setViewLayout] = useState<'tree' | 'pipeline' | 'compact'>('tree');
  const [levelFilter, setLevelFilter] = useState<'all' | 'level1' | 'level2' | 'level3'>('all');
  const [showAllExplanations, setShowAllExplanations] = useState(true);
  const [copied, setCopied] = useState(false);

  // Default theme is white background with clean white/black styling!
  const [themeMode, setThemeMode] = useState<'white' | 'dark'>('white');
  const isWhite = themeMode === 'white';

  // Parse workflow data based on current selected topic
  const workflow = useMemo(() => {
    return parseWorkflowFromContent(content, productTitle, skillTitle, language, selectedTopic);
  }, [content, productTitle, skillTitle, language, selectedTopic]);

  const handleCopy = () => {
    let exportText = `=== WORKFLOW ARCHITECTURE: ${workflow.title} [Topic: ${workflow.topicLabel}] ===\n`;
    exportText += `\nLEVEL 1: ${workflow.level1Badge}\nObjective: ${workflow.objective}\nKey Metrics: ${workflow.budgetOrMetric}\nScope: ${workflow.marketScope}\nExplanation: ${workflow.explanation}\n`;
    workflow.groups.forEach((grp) => {
      exportText += `\n  LEVEL 2: ${grp.title}\n  Tag: ${grp.strategyTag}\n  Focus: ${grp.audienceOrFocus || ''}\n  Explanation: ${grp.explanation}\n`;
      grp.items.forEach((item) => {
        exportText += `\n    LEVEL 3: ${item.title}\n    Primary: "${item.primaryText || ''}"\n    Visual: ${item.visualDirection || 'N/A'}\n    Action: ${item.cta || 'N/A'}\n    Explanation: ${item.explanation}\n`;
      });
    });

    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (onCopyWorkflow) onCopyWorkflow();
  };

  const isRtl = direction === 'rtl';

  return (
    <div
      dir={direction}
      style={{
        zoom: textStyle?.fontSizeScale ? `${textStyle.fontSizeScale}%` : undefined,
        fontFamily:
          textStyle?.fontFamily === 'serif'
            ? 'Merriweather, Georgia, serif'
            : textStyle?.fontFamily === 'mono'
            ? '"JetBrains Mono", Menlo, monospace'
            : undefined,
      }}
      className={`workflow-chart-container w-full bg-[#f8fafc] text-[#0f172a] rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden font-sans select-text ${
        isRtl ? 'text-right' : 'text-left'
      }`}
    >
      {/* 1. TOP CONTROL BAR */}
      <div className="px-5 py-3.5 bg-white border-b border-[#e2e8f0] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] flex items-center justify-center shadow-xs">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-mono font-bold tracking-wider border border-[#e2e8f0]/80 uppercase">
                {workflow.topicType.replace('_', ' ')}
              </span>
              <span className="text-[#10b981] font-bold font-mono text-xs">
                98% MATCH
              </span>
              <span className="text-xs font-bold text-[#0f172a] hidden sm:inline">
                • {workflow.topicLabel}
              </span>
            </div>
            <p className="text-[11px] text-[#94a3b8] truncate max-w-sm mt-0.5 font-normal">
              {workflow.title}
            </p>
          </div>
        </div>

        {/* View Layout Controls & Actions */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Layout Mode */}
          <div className="flex items-center rounded-full p-0.5 border border-[#e2e8f0] bg-[#f8fafc]">
            <button
              type="button"
              onClick={() => setViewLayout('tree')}
              className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewLayout === 'tree'
                  ? 'border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
              title="Hierarchical Tree: Card -> Line Down -> Cards"
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Tree</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('pipeline')}
              className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewLayout === 'pipeline'
                  ? 'border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
              title="Step Pipeline"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              type="button"
              onClick={() => setViewLayout('compact')}
              className={`px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                viewLayout === 'compact'
                  ? 'border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] shadow-xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
              title="Compact Matrix"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Matrix</span>
            </button>
          </div>

          {/* Level Filter */}
          <div className="hidden sm:flex items-center rounded-full p-0.5 text-[11px] border border-[#e2e8f0] bg-[#f8fafc]">
            {(['all', 'level1', 'level2', 'level3'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-0.5 rounded-full font-semibold capitalize transition-all cursor-pointer ${
                  levelFilter === lvl
                    ? 'border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] font-bold shadow-2xs'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                {lvl === 'all'
                  ? 'All Tiers'
                  : lvl === 'level1'
                  ? 'L1: Core'
                  : lvl === 'level2'
                  ? 'L2: Pillars'
                  : 'L3: Tactics'}
              </button>
            ))}
          </div>

          {/* Toggle Step Explanations */}
          <button
            type="button"
            onClick={() => setShowAllExplanations(!showAllExplanations)}
            className="px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] text-[#475569]"
            title="Toggle step explanation text on all cards"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#10b981]" />
            <span>{showAllExplanations ? 'Hide Details' : 'Show Details'}</span>
          </button>

          {/* Copy / Export Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-[#6ee7b7] bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] font-mono font-bold text-xs py-1 px-3.5 flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            title="Copy full workflow structure as formatted text"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* 2. INTERACTIVE TOPIC PREVIEW SELECTOR BAR (Exact "+ Add to Board" Pill Styling) */}
      <div className="px-5 py-2.5 bg-white border-b border-[#e2e8f0] flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#10b981]" />
            <span>Analyze Topic:</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
          {topicOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selectedTopic === opt.id;
            const isAuto = detectedTopic === opt.id;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedTopic(opt.id)}
                className={`rounded-full font-mono text-[11px] py-1 px-3 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'border border-[#34d399] bg-[#ecfdf5] text-[#047857] font-bold shadow-xs'
                    : 'border border-[#e2e8f0] bg-white hover:bg-[#f8fafc] text-[#64748b] font-medium'
                }`}
                title={`Preview workflow as ${opt.label}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{opt.label}</span>
                {opt.isExtractedFromContent ? (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                    Analyzed
                  </span>
                ) : isAuto ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. MAIN WORKFLOW CANVAS / TREE VIEWPORT */}
      <div className="p-6 overflow-x-auto max-h-[640px] overflow-y-auto bg-[#f8fafc] scrollbar-thin scrollbar-thumb-slate-300">
        {/* =========================================================================
            TREE HIERARCHY LAYOUT: LEVEL 1 -> CONNECTOR -> LEVEL 2 -> CONNECTOR -> LEVEL 3
           ========================================================================= */}
        {viewLayout === 'tree' && (
          <div className="min-w-[760px] flex flex-col items-center space-y-0">
            {/* LEVEL 1: TOP-LEVEL NODE (Exact Style of user reference card!) */}
            {(levelFilter === 'all' || levelFilter === 'level1') && (
              <div className="w-full max-w-3xl relative z-10">
                <div className="bg-white border border-[#e2e8f0] hover:border-[#34d399] rounded-2xl p-5 shadow-xs hover:shadow-sm transition-all space-y-3">
                  {/* Top Header Row matching photo: [PRODUCT] on left, [97%] on right */}
                  <div className="flex items-center justify-between pb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#e2e8f0]/80">
                      {workflow.level1Badge}
                    </span>
                    <span className="text-[#10b981] font-bold font-mono text-sm">
                      98%
                    </span>
                  </div>

                  {/* Title & Subtitle matching photo */}
                  <div>
                    <h3 className="text-base font-bold text-[#0f172a] leading-tight">
                      {workflow.title}
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed font-normal">
                      {workflow.objective}
                    </p>
                  </div>

                  {/* Parameters & Metrics Chips */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] font-mono text-[11px] font-semibold">
                      🎯 {workflow.budgetOrMetric}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] font-mono text-[11px]">
                      📍 {workflow.marketScope}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#059669] font-mono text-[11px] font-bold">
                      ✓ {workflow.optimizationGoal}
                    </span>
                  </div>

                  {/* Step 1 Explanation Box */}
                  {showAllExplanations && (
                    <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs leading-relaxed text-[#334155] space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase font-mono text-[#059669]">
                        <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                        <span>Executive Strategy Thesis</span>
                      </div>
                      <p className="text-xs text-[#475569] leading-relaxed">
                        {workflow.explanation}
                      </p>
                    </div>
                  )}

                  {/* Action Button styled EXACTLY like "+ Add to Board" */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="w-full rounded-full border border-[#6ee7b7] bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] font-mono font-bold text-xs py-2 px-4 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span className="text-sm font-bold leading-none">+</span>
                      <span>Deploy Executive Architecture</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CONNECTOR LINE 1: LEVEL 1 DOWN TO LEVEL 2 */}
            {(levelFilter === 'all' || levelFilter === 'level2' || levelFilter === 'level3') && (
              <div className="w-full flex flex-col items-center my-0 select-none pointer-events-none">
                <div className="w-0.5 h-8 bg-[#cbd5e1] flex items-end justify-center">
                  <ArrowDown className="w-3.5 h-3.5 text-[#10b981] mb-0.5" />
                </div>
              </div>
            )}

            {/* LEVEL 2: PILLARS / GROUPS (Horizontal Branching) */}
            {(levelFilter === 'all' || levelFilter === 'level2' || levelFilter === 'level3') && (
              <div
                className={`w-full grid gap-4 ${
                  workflow.groups.length === 1
                    ? 'grid-cols-1 max-w-xl'
                    : workflow.groups.length === 2
                    ? 'grid-cols-1 md:grid-cols-2 max-w-4xl'
                    : 'grid-cols-1 md:grid-cols-3 max-w-6xl'
                }`}
              >
                {workflow.groups.map((group, gIdx) => {
                  const scorePercentage = `${96 - gIdx * 2}%`;

                  return (
                    <div key={group.id} className="flex flex-col items-center">
                      {/* Group Card matching uploaded photo */}
                      <div className="w-full rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#34d399] p-4 shadow-xs hover:shadow-sm transition-all space-y-2.5">
                        {/* Top Row: [PILLAR 01] on left, [97%] on right */}
                        <div className="flex items-center justify-between pb-1">
                          <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#e2e8f0]/80">
                            {workflow.level2Badge} • 0{gIdx + 1}
                          </span>
                          <span className="text-[#10b981] font-bold font-mono text-xs">
                            {scorePercentage}
                          </span>
                        </div>

                        {/* Title matching uploaded photo */}
                        <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] leading-tight">
                          {group.title}
                        </h4>

                        {/* Subtitle / Focus matching uploaded photo */}
                        <p className="text-xs text-[#94a3b8] leading-relaxed font-normal">
                          {group.audienceOrFocus || group.strategyTag}
                        </p>

                        {/* Extra Parameters */}
                        <div className="space-y-1 text-[11px] pt-1">
                          {group.budgetOrMetric && (
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="text-[#94a3b8] font-mono text-[10px]">Weight:</span>
                              <span className="font-semibold text-[#0f172a]">{group.budgetOrMetric}</span>
                            </div>
                          )}
                          {group.wilayasOrScope && (
                            <div className="text-[10.5px] font-mono text-[#64748b] truncate">
                              📍 {group.wilayasOrScope}
                            </div>
                          )}
                        </div>

                        {/* Step 2 Explanation Box */}
                        {showAllExplanations && (
                          <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-[11px] leading-relaxed text-[#475569]">
                            <span className="text-[9.5px] font-bold uppercase font-mono text-[#059669] block mb-0.5">
                              Strategic Logic
                            </span>
                            <p>{group.explanation}</p>
                          </div>
                        )}

                        {/* Action Button styled EXACTLY like "+ Add to Board" */}
                        <button
                          type="button"
                          className="w-full rounded-full border border-[#6ee7b7] bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] font-mono font-bold text-xs py-1.5 px-3 flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                        >
                          <span className="text-sm font-bold leading-none">+</span>
                          <span>{group.strategyTag || 'Add Pillar'}</span>
                        </button>
                      </div>

                      {/* CONNECTOR LINE 2: GROUP DOWN TO ITEMS */}
                      {(levelFilter === 'all' || levelFilter === 'level3') && (
                        <div className="w-full flex flex-col items-center my-0 select-none pointer-events-none">
                          <div className="w-0.5 h-7 bg-[#cbd5e1] flex items-end justify-center">
                            <ArrowDown className="w-3 h-3 text-[#10b981] mb-0.5" />
                          </div>
                        </div>
                      )}

                      {/* LEVEL 3: TACTICAL / ACTION CARDS */}
                      {(levelFilter === 'all' || levelFilter === 'level3') && (
                        <div className="w-full space-y-3">
                          {group.items.map((item, itemIdx) => {
                            const itemScore = `${95 - itemIdx * 2}%`;

                            return (
                              <div
                                key={item.id}
                                className="w-full rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#34d399] p-4 shadow-xs hover:shadow-sm transition-all space-y-2.5"
                              >
                                {/* Top Row: [LEVEL 3] on left, [95%] on right */}
                                <div className="flex items-center justify-between pb-1">
                                  <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[9.5px] font-mono font-bold uppercase tracking-wider border border-[#e2e8f0]/80">
                                    {workflow.level3Badge} • 0{gIdx + 1}.{itemIdx + 1}
                                  </span>
                                  <span className="text-[#10b981] font-bold font-mono text-xs">
                                    {itemScore}
                                  </span>
                                </div>

                                {/* Title */}
                                <h5 className="text-xs font-bold text-[#0f172a] leading-tight">
                                  {item.title}
                                </h5>

                                {/* Description / Script */}
                                {item.primaryText && (
                                  <div className="p-2.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs space-y-1">
                                    <div className="flex items-center justify-between text-[9.5px] font-mono text-[#94a3b8] font-bold uppercase">
                                      <span>Action Script</span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(item.primaryText || '');
                                        }}
                                        className="text-[#047857] hover:text-[#065f46] cursor-pointer"
                                        title="Copy script"
                                      >
                                        <Copy className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                    <p className="italic font-normal leading-relaxed text-[#334155] select-text">
                                      "{item.primaryText}"
                                    </p>
                                  </div>
                                )}

                                {/* Visual Execution */}
                                {item.visualDirection && (
                                  <div className="text-[10.5px] leading-snug p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b]">
                                    <strong className="font-mono text-[9px] text-[#059669] block uppercase">
                                      🎬 Visual Direction:
                                    </strong>
                                    {item.visualDirection}
                                  </div>
                                )}

                                {/* Action Button styled EXACTLY like "+ Add to Board" */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(item.primaryText || item.title);
                                  }}
                                  className="w-full rounded-full border border-[#6ee7b7] bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] font-mono font-bold text-xs py-1.5 px-3 flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                                >
                                  <span className="text-sm font-bold leading-none">+</span>
                                  <span>{item.cta || 'Add to Board'}</span>
                                </button>

                                {/* Step 3 Explanation */}
                                {showAllExplanations && (
                                  <p className="text-[10.5px] text-[#94a3b8] leading-relaxed pt-0.5">
                                    {item.explanation}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            PIPELINE VIEW: LINEAR STEP-BY-STEP FLOW
           ========================================================================= */}
        {viewLayout === 'pipeline' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {/* Step 1: Core Thesis */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#e2e8f0]">
                  STAGE 1: {workflow.topicLabel.toUpperCase()}
                </span>
                <span className="text-[#10b981] font-bold font-mono text-xs">98%</span>
              </div>
              <h4 className="text-sm font-bold text-[#0f172a]">{workflow.title}</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">{workflow.explanation}</p>
              <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] font-mono text-[11px]">
                  {workflow.objective}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[#059669] font-mono font-bold text-[11px]">
                  {workflow.budgetOrMetric}
                </span>
              </div>
            </div>

            <div className="w-0.5 h-6 bg-[#cbd5e1] mx-auto" />

            {/* Step 2: Pillars */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#e2e8f0]">
                  STAGE 2: STRATEGIC PILLARS
                </span>
                <span className="text-[#10b981] font-bold font-mono text-xs">96%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {workflow.groups.map((grp, idx) => (
                  <div key={grp.id} className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#475569] font-bold">Pillar 0{idx + 1}</span>
                      <span className="text-[#10b981] font-bold">{96 - idx * 2}%</span>
                    </div>
                    <h5 className="text-xs font-bold text-[#0f172a]">{grp.title}</h5>
                    <p className="text-[11px] text-[#94a3b8]">{grp.audienceOrFocus}</p>
                    <button
                      type="button"
                      className="w-full rounded-full border border-[#6ee7b7] bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] font-mono font-bold text-[11px] py-1 px-3 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>+</span>
                      <span>{grp.strategyTag}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-0.5 h-6 bg-[#cbd5e1] mx-auto" />

            {/* Step 3: Actionable Execution */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#475569] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#e2e8f0]">
                  STAGE 3: TACTICAL EXECUTION
                </span>
                <span className="text-[#10b981] font-bold font-mono text-xs">95%</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {workflow.groups
                  .flatMap((g) => g.items)
                  .map((item, idx) => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#475569] font-bold">Action 0{idx + 1}</span>
                        <span className="text-[#10b981] font-bold">{95 - (idx % 3)}%</span>
                      </div>
                      <h5 className="text-xs font-bold text-[#0f172a]">{item.title}</h5>
                      {item.primaryText && (
                        <p className="text-xs italic text-[#475569] bg-white p-2 rounded-lg border border-[#e2e8f0]">
                          "{item.primaryText}"
                        </p>
                      )}
                      <button
                        type="button"
                        className="w-full rounded-full border border-[#6ee7b7] bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#047857] font-mono font-bold text-xs py-1 px-3 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                      >
                        <span>+</span>
                        <span>{item.cta || 'Add to Board'}</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            COMPACT MATRIX VIEW
           ========================================================================= */}
        {viewLayout === 'compact' && (
          <div className="space-y-3 max-w-5xl mx-auto">
            <div className="overflow-x-auto rounded-2xl border border-[#e2e8f0] bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse text-[#0f172a]">
                <thead className="bg-[#f1f5f9] text-[#475569] uppercase font-mono text-[10px] border-b border-[#e2e8f0]">
                  <tr>
                    <th className="p-3">Level</th>
                    <th className="p-3">Node Name</th>
                    <th className="p-3">Focus / Audience</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0] font-medium bg-white">
                  {/* Level 1 Row */}
                  <tr className="bg-[#f8fafc] font-bold">
                    <td className="p-3 font-mono text-[10px] text-[#475569]">{workflow.level1Badge}</td>
                    <td className="p-3 text-[#0f172a]">{workflow.title}</td>
                    <td className="p-3 text-[#64748b]">{workflow.marketScope}</td>
                    <td className="p-3 text-[#10b981] font-mono font-bold">98%</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 rounded-full border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] font-mono text-[10px] font-bold">
                        + Deploy
                      </span>
                    </td>
                  </tr>

                  {/* Level 2 & 3 Rows */}
                  {workflow.groups.map((grp, gIdx) => (
                    <React.Fragment key={grp.id}>
                      <tr className="bg-white text-[#0f172a] font-semibold">
                        <td className="p-3 font-mono text-[10px] text-[#475569]">
                          {workflow.level2Badge} 0{gIdx + 1}
                        </td>
                        <td className="p-3 text-[#0f172a]">{grp.title}</td>
                        <td className="p-3 text-[#94a3b8]">{grp.audienceOrFocus}</td>
                        <td className="p-3 text-[#10b981] font-mono font-bold">{96 - gIdx * 2}%</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] font-mono text-[10px] font-bold">
                            + {grp.strategyTag}
                          </span>
                        </td>
                      </tr>
                      {grp.items.map((item, itemIdx) => (
                        <tr key={item.id} className="hover:bg-[#f8fafc]">
                          <td className="p-3 pl-6 font-mono text-[10px] text-[#94a3b8]">
                            ↳ {workflow.level3Badge} 0{gIdx + 1}.{itemIdx + 1}
                          </td>
                          <td className="p-3 font-semibold text-[#0f172a]">{item.title}</td>
                          <td className="p-3 italic text-[#94a3b8]">
                            "{item.primaryText ? item.primaryText.slice(0, 45) + '...' : ''}"
                          </td>
                          <td className="p-3 text-[#10b981] font-mono font-bold">{95 - (itemIdx % 3)}%</td>
                          <td className="p-3">
                            <span className="px-2.5 py-0.5 rounded-full border border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] font-mono text-[10px] font-bold">
                              + {item.cta || 'Add'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. FOOTER EXPLANATION & SUMMARY */}
      <div className="px-5 py-3 bg-white border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#94a3b8] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[#475569]">
            Topic: <strong className="text-[#0f172a]">{workflow.topicLabel}</strong> • {workflow.groups.length} Pillars •{' '}
            {workflow.groups.reduce((acc, g) => acc + g.items.length, 0)} Tactical Actions
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[#94a3b8]">Verified E-Commerce Architecture</span>
          <button
            type="button"
            onClick={handleCopy}
            className="font-bold font-mono text-[#047857] hover:underline cursor-pointer"
          >
            Export Flowchart ↑
          </button>
        </div>
      </div>
    </div>
  );
};
