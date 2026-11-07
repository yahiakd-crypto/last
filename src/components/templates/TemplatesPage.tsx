import React, { useState, useMemo } from 'react';
import {
  Home,
  FolderKanban,
  Layers,
  LayoutGrid,
  Search,
  Video,
  BarChart2,
  Package,
  Zap,
  FileText,
  Settings,
  Bell,
  Moon,
  Sun,
  Plus,
  RotateCcw,
  RotateCw,
  Eye,
  Share2,
  ChevronDown,
  Filter,
  CheckCircle2,
  ExternalLink,
  MoreVertical,
  SlidersHorizontal,
  TrendingUp,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Check,
  Globe,
  Store,
  DollarSign,
  Truck,
  Users,
  Target,
  Factory,
  Copy,
  Clock,
  Download,
  Bookmark,
  BookmarkCheck,
  Play,
  FileSpreadsheet,
  Cpu,
  RefreshCw,
  Smartphone,
  Share,
} from 'lucide-react';
import { WORKFLOW_TEMPLATES, WorkflowTemplate } from '../../utils/templates';
import { AppSidebar } from '../navigation/AppSidebar';

interface TemplatesPageProps {
  onNavigate?: (view: string, subItem?: string) => void;
  onNavigateToCanvas: (templateId?: string) => void;
  onNavigateToHome: () => void;
  onNavigateToProjects: () => void;
  onNavigateToResearch: () => void;
  onOpenNewProject: () => void;
  currentCurrency?: string;
}

export interface DetailedTemplate {
  id: string;
  name: string;
  category: 'algeria_cod' | 'ads_acquisition' | 'product_research' | 'creative_production' | 'unit_economics' | 'automation';
  categoryLabel: string;
  description: string;
  detailedOverview: string;
  nodeCount: number;
  connectionCount: number;
  estimatedSetupTime: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  benchmarkKpis: {
    label: string;
    value: string;
    highlight?: boolean;
  }[];
  flowStages: {
    name: string;
    color: string;
    bg: string;
  }[];
  svgNodes: {
    x: number;
    y: number;
    color: string;
  }[];
  svgLinks: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }[];
  isPopular?: boolean;
  isNew?: boolean;
  templateId: string;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  onNavigate,
  onNavigateToCanvas,
  onNavigateToHome,
  onNavigateToProjects,
  onNavigateToResearch,
  onOpenNewProject,
  currentCurrency = 'DZD',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'nodes' | 'name'>('popular');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedPreviewTemplate, setSelectedPreviewTemplate] = useState<DetailedTemplate | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['tmpl_algeria_cod']);

  // Professional templates collection
  const templates: DetailedTemplate[] = [
    {
      id: 'tmpl_algeria_cod',
      name: 'Algeria COD – Complete Funnel',
      category: 'algeria_cod',
      categoryLabel: 'Algerian E-commerce',
      description: 'End-to-end Cash-on-Delivery system for the Algerian market with multi-channel traffic, WhatsApp verification, Call Center salvage, and Yalidine courier dispatch.',
      detailedOverview: 'Engineered specifically for 58 Algerian Wilayas. Features Meta CBO campaign targeting, fast single-page Shopify checkout, automated WhatsApp confirmation, Call Center backup queue for abandoned carts, and Yalidine courier tracking with real-time RTO rate protection.',
      nodeCount: 17,
      connectionCount: 9,
      estimatedSetupTime: '5 mins',
      complexity: 'Intermediate',
      tags: ['Algeria COD', 'Yalidine Express', 'WhatsApp Conf', 'Meta Ads', 'Call Center', 'Wilayas 1-58'],
      benchmarkKpis: [
        { label: 'Confirmation Rate', value: '70.0%', highlight: true },
        { label: 'Delivery Rate', value: '74.3%', highlight: true },
        { label: 'RTO Protection', value: '17.1%' },
        { label: 'ROAS Benchmark', value: '4.2x' },
      ],
      flowStages: [
        { name: 'Meta Ads', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Store', color: '#4F46E5', bg: '#EEF2FF' },
        { name: 'WhatsApp', color: '#16A34A', bg: '#F0FDF4' },
        { name: 'Yalidine', color: '#0284C7', bg: '#F0F9FF' },
        { name: 'Net Profit', color: '#10B981', bg: '#ECFDF5' },
      ],
      svgNodes: [
        { x: 15, y: 18, color: '#3B82F6' },
        { x: 38, y: 14, color: '#6366F1' },
        { x: 62, y: 22, color: '#10B981' },
        { x: 42, y: 36, color: '#0284C7' },
        { x: 70, y: 38, color: '#059669' },
      ],
      svgLinks: [
        { x1: 15, y1: 18, x2: 38, y2: 14 },
        { x1: 38, y1: 14, x2: 62, y2: 22 },
        { x1: 62, y1: 22, x2: 42, y2: 36 },
        { x1: 42, y1: 36, x2: 70, y2: 38 },
      ],
      isPopular: true,
      templateId: 'algeria_cod_complete_funnel',
    },
    {
      id: 'tmpl_product_intelligence',
      name: 'Product Intelligence & Validation Pipeline',
      category: 'product_research',
      categoryLabel: 'Product Research',
      description: 'Systematic validation workflow from raw winning product signal to supplier unit cost, competitor price elasticity, and risk evaluation.',
      detailedOverview: 'Transforms raw product hypotheses into calculated business cases. Includes 1688 wholesale lookup, air and sea freight calculator, local Algerian market demand analysis, and risk scoring for lithium batteries and fragile goods.',
      nodeCount: 8,
      connectionCount: 6,
      estimatedSetupTime: '3 mins',
      complexity: 'Beginner',
      tags: ['Product Scoring', '1688 Sourcing', 'Competitor Spy', 'Market Demand', 'Risk Audit'],
      benchmarkKpis: [
        { label: 'Validation Accuracy', value: '92%', highlight: true },
        { label: 'Avg Margin Found', value: '68%' },
        { label: 'Screening Time', value: '< 15 mins' },
      ],
      flowStages: [
        { name: 'Product Idea', color: '#2563EB', bg: '#EFF6FF' },
        { name: '1688 Supplier', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Competitor Spy', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Score & Launch', color: '#16A34A', bg: '#F0FDF4' },
      ],
      svgNodes: [
        { x: 18, y: 24, color: '#3B82F6' },
        { x: 42, y: 15, color: '#F59E0B' },
        { x: 42, y: 35, color: '#8B5CF6' },
        { x: 68, y: 24, color: '#10B981' },
      ],
      svgLinks: [
        { x1: 18, y1: 24, x2: 42, y2: 15 },
        { x1: 18, y1: 24, x2: 42, y2: 35 },
        { x1: 42, y1: 15, x2: 68, y2: 24 },
        { x1: 42, y1: 35, x2: 68, y2: 24 },
      ],
      isPopular: true,
      templateId: 'product_intelligence_pipeline',
    },
    {
      id: 'tmpl_facebook_ads',
      name: 'Facebook & TikTok Ads Creative Matrix',
      category: 'ads_acquisition',
      categoryLabel: 'Paid Acquisition',
      description: 'Systematic creative testing pipeline with 3 hook variations, angle testing, audience lookalikes (1-3%), and automatic CBO scaling rules.',
      detailedOverview: 'Eliminates ad spend waste by structuring early testing into distinct phases: 3-second hook testing, problem-solution demo, and social proof angles. Integrates automated budget reallocation for winning combinations.',
      nodeCount: 11,
      connectionCount: 7,
      estimatedSetupTime: '8 mins',
      complexity: 'Intermediate',
      tags: ['Meta Ads Library', 'Hook Testing', 'Lookalikes', 'CBO Scaling', 'Creative Matrix'],
      benchmarkKpis: [
        { label: 'CPA Reduction', value: '-35%', highlight: true },
        { label: 'CTR Benchmark', value: '3.4%' },
        { label: 'Hook Retention', value: '42%' },
      ],
      flowStages: [
        { name: 'Meta / TikTok', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Hook Test', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Angle Test', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Scale CBO', color: '#16A34A', bg: '#F0FDF4' },
      ],
      svgNodes: [
        { x: 14, y: 16, color: '#3B82F6' },
        { x: 14, y: 34, color: '#6366F1' },
        { x: 42, y: 25, color: '#8B5CF6' },
        { x: 68, y: 16, color: '#F59E0B' },
        { x: 68, y: 34, color: '#10B981' },
      ],
      svgLinks: [
        { x1: 14, y1: 16, x2: 42, y2: 25 },
        { x1: 14, y1: 34, x2: 42, y2: 25 },
        { x1: 42, y1: 25, x2: 68, y2: 16 },
        { x1: 42, y1: 25, x2: 68, y2: 34 },
      ],
      templateId: 'facebook_ads_analysis',
    },
    {
      id: 'tmpl_profit_engine',
      name: 'E-commerce Profit & Unit Economics Engine',
      category: 'unit_economics',
      categoryLabel: 'Analytics & Profit',
      description: 'Calculates real cash-in-hand net profit factoring in confirmation rate, courier delivery rate, return shipping penalties, and break-even CPA.',
      detailedOverview: 'Built to prevent the common Algerian COD pitfall of having high top-line revenue but zero net profit. Real-time sensitivity simulation on delivery rate fluctuations from 60% to 85% and courier tariff changes.',
      nodeCount: 8,
      connectionCount: 5,
      estimatedSetupTime: '4 mins',
      complexity: 'Advanced',
      tags: ['COD Profit', 'Break-even CPA', 'Wilaya Shipping', 'RTO Penalty', 'Cashflow'],
      benchmarkKpis: [
        { label: 'Net Margin Accuracy', value: '99.4%', highlight: true },
        { label: 'Break-even CPA', value: '620 DZD' },
        { label: 'Real Cash Profit', value: 'Calculated' },
      ],
      flowStages: [
        { name: 'Gross Revenue', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Ad Spend', color: '#EF4444', bg: '#FEF2F2' },
        { name: 'Courier & RTO', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Net Cash', color: '#10B981', bg: '#ECFDF5' },
      ],
      svgNodes: [
        { x: 15, y: 25, color: '#3B82F6' },
        { x: 38, y: 15, color: '#EF4444' },
        { x: 38, y: 35, color: '#F59E0B' },
        { x: 65, y: 25, color: '#10B981' },
      ],
      svgLinks: [
        { x1: 15, y1: 25, x2: 38, y2: 15 },
        { x1: 15, y1: 25, x2: 38, y2: 35 },
        { x1: 38, y1: 15, x2: 65, y2: 25 },
        { x1: 38, y1: 35, x2: 65, y2: 25 },
      ],
      isPopular: true,
      templateId: 'ecommerce_profit_engine',
    },
    {
      id: 'tmpl_creative_testing',
      name: 'High-Impact Creative Production Studio',
      category: 'creative_production',
      categoryLabel: 'Creative Production',
      description: 'Visual asset workflow for generating winning video ads, UGC scripts, product angles, and localized Algerian Arabic (Darja) ad copy.',
      detailedOverview: 'Streamlines the creation of high-converting visual assets. Features AI prompt generators for product staging, Darja voiceover scripts, split-screen comparison templates, and TikTok viral hook formats.',
      nodeCount: 9,
      connectionCount: 6,
      estimatedSetupTime: '6 mins',
      complexity: 'Intermediate',
      tags: ['AI Imagery', 'Video Scripts', 'Darja Copywriting', 'UGC Ads', 'A/B Test'],
      benchmarkKpis: [
        { label: 'Creative Velocity', value: '4x faster', highlight: true },
        { label: 'Cost Per Creative', value: '-60%' },
        { label: 'Winner Rate', value: '28%' },
      ],
      flowStages: [
        { name: 'Product Photos', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'AI Generation', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Darja Script', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Production', color: '#16A34A', bg: '#F0FDF4' },
      ],
      svgNodes: [
        { x: 16, y: 14, color: '#3B82F6' },
        { x: 38, y: 22, color: '#8B5CF6' },
        { x: 62, y: 14, color: '#F59E0B' },
        { x: 62, y: 36, color: '#10B981' },
      ],
      svgLinks: [
        { x1: 16, y1: 14, x2: 38, y2: 22 },
        { x1: 38, y1: 22, x2: 62, y2: 14 },
        { x1: 38, y1: 22, x2: 62, y2: 36 },
      ],
      isNew: true,
      templateId: 'creative_testing_matrix',
    },
    {
      id: 'tmpl_whatsapp_salvage',
      name: 'WhatsApp & Call Center COD Order Recovery',
      category: 'automation',
      categoryLabel: 'Automation & AI',
      description: 'Automated recovery sequence for abandoned checkouts and hesitant buyers with instant WhatsApp confirmation and call center routing.',
      detailedOverview: 'Boosts overall order confirmation rate from 55% to 78%. When an order is placed, an instant WhatsApp message with Wilaya address confirmation is sent. If unconfirmed within 2 hours, routes automatically to a Call Center agent.',
      nodeCount: 10,
      connectionCount: 7,
      estimatedSetupTime: '5 mins',
      complexity: 'Intermediate',
      tags: ['WhatsApp Automation', 'Call Center', 'Order Recovery', 'Lead Salvage'],
      benchmarkKpis: [
        { label: 'Confirmation Lift', value: '+23%', highlight: true },
        { label: 'Response Time', value: '< 2 mins' },
        { label: 'Salvaged Revenue', value: '+140K DZD' },
      ],
      flowStages: [
        { name: 'New Lead', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'WhatsApp Bot', color: '#16A34A', bg: '#F0FDF4' },
        { name: 'Call Center', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Confirmed', color: '#10B981', bg: '#ECFDF5' },
      ],
      svgNodes: [
        { x: 15, y: 25, color: '#3B82F6' },
        { x: 42, y: 14, color: '#10B981' },
        { x: 42, y: 36, color: '#8B5CF6' },
        { x: 70, y: 25, color: '#059669' },
      ],
      svgLinks: [
        { x1: 15, y1: 25, x2: 42, y2: 14 },
        { x1: 15, y1: 25, x2: 42, y2: 36 },
        { x1: 42, y1: 14, x2: 70, y2: 25 },
        { x1: 42, y1: 36, x2: 70, y2: 25 },
      ],
      templateId: 'algeria_cod_complete_funnel',
    },
  ];

  // Category navigation tabs
  const categories = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'algeria_cod', label: 'Algerian COD Funnels', count: templates.filter((t) => t.category === 'algeria_cod').length },
    { id: 'product_research', label: 'Product Research', count: templates.filter((t) => t.category === 'product_research').length },
    { id: 'ads_acquisition', label: 'Paid Acquisition & Ads', count: templates.filter((t) => t.category === 'ads_acquisition').length },
    { id: 'unit_economics', label: 'Unit Economics & Profit', count: templates.filter((t) => t.category === 'unit_economics').length },
    { id: 'creative_production', label: 'Creative Studio', count: templates.filter((t) => t.category === 'creative_production').length },
  ];

  // Filtered & sorted templates
  const filteredTemplates = useMemo(() => {
    return templates
      .filter((tmpl) => {
        if (activeCategory !== 'all' && tmpl.category !== activeCategory) return false;
        if (complexityFilter !== 'all' && tmpl.complexity !== complexityFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          return (
            tmpl.name.toLowerCase().includes(q) ||
            tmpl.description.toLowerCase().includes(q) ||
            tmpl.tags.some((tag) => tag.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'nodes') return b.nodeCount - a.nodeCount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [templates, activeCategory, complexityFilter, searchQuery, sortBy]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const flagshipTemplate = templates[0];

  const handleSidebarNavigate = (view: string, subItem?: string) => {
    if (onNavigate) {
      onNavigate(view, subItem);
      return;
    }
    if (view === 'dashboard') onNavigateToHome();
    else if (view === 'projects') onNavigateToProjects();
    else if (view === 'canvas') onNavigateToCanvas();
    else if (view === 'research') onNavigateToResearch();
  };

  return (
    <div className="w-screen h-screen flex bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden select-none">
      {/* 1. UNIFIED LEFT NAVIGATION SIDEBAR */}
      <AppSidebar
        activeView="templates"
        onNavigate={handleSidebarNavigate}
        onOpenNewModal={onOpenNewProject}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP GLOBAL HEADER */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between gap-4 z-20 shrink-0 shadow-2xs">
          {/* Left: Breadcrumb */}
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <button
                onClick={onNavigateToHome}
                className="hover:text-blue-600 transition-colors flex items-center cursor-pointer"
                title="Go to Home"
              >
                <Home className="w-3.5 h-3.5" />
              </button>
              <span className="text-slate-300">›</span>
              <span className="text-slate-900 font-bold">Workflow Blueprints & Templates</span>
            </nav>
          </div>

          {/* Center: Search input */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 40+ workflow blueprints, COD funnels, ads testing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-14 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded">
                Ctrl + K
              </kbd>
            </div>
          </div>

          {/* Right Actions: Create Blank, Theme, Yahia Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewProject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Blank</span>
            </button>

            <button
              onClick={() => onNavigateToCanvas()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Open Canvas</span>
            </button>

            <div className="w-[1px] h-6 bg-slate-200 mx-0.5" />

            {/* Profile: Yahia Pro User */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                Y
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">Yahia</span>
                <span className="text-[10px] text-slate-400 block font-medium">Pro User</span>
              </div>
            </div>
          </div>
        </header>

        {/* BODY LAYOUT: Center Main Content + Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">

        {/* 3. MAIN CENTER WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                  Workflow Templates & Blueprints
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                  {templates.length} Curated
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pre-built, high-converting e-commerce funnels for Algeria COD, TikTok viral ads, and product intelligence.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToCanvas('algeria_cod_complete_funnel')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Flagship Funnel</span>
              </button>
            </div>
          </div>

          {/* Featured Hero Template Banner: Algeria COD Complete Funnel */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-xl relative overflow-hidden">
            {/* Subtle decorative grid background */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Copy & Highlights */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
                    ★ Flagship Algerian COD Blueprint
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Updated for 2026</span>
                </div>

                <div>
                  <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white leading-tight">
                    Algeria COD – Complete Garmin Smartwatch Funnel
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1.5 max-w-xl">
                    The complete 17-node reference sales pipeline shown on the visual canvas. Integrates Meta CBO ads, Shopify COD order forms, WhatsApp automated verification, Call Center salvage, and Yalidine 58 Wilayas dispatch.
                  </p>
                </div>

                {/* Benchmark Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Confirmation Rate</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-0.5">70.0%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Delivery Rate</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-0.5">74.3%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">RTO Protection</span>
                    <span className="text-sm font-bold text-amber-400 block mt-0.5">17.1%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">ROAS Benchmark</span>
                    <span className="text-sm font-bold text-blue-400 block mt-0.5">4.2x</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigateToCanvas('algeria_cod_complete_funnel')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Use This Blueprint on Canvas</span>
                  </button>

                  <button
                    onClick={() => setSelectedPreviewTemplate(flagshipTemplate)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect 17 Nodes Flow</span>
                  </button>
                </div>
              </div>

              {/* Right Mini Diagram Preview Card */}
              <div className="lg:col-span-5 bg-white/5 rounded-2xl border border-white/10 p-4 relative backdrop-blur-xs">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-white/10">
                  <span className="font-semibold text-slate-300">Live Pipeline Schema</span>
                  <span>17 Nodes • 9 Connections</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">1</div>
                      <span className="font-semibold text-white">Acquisition</span>
                    </div>
                    <span className="text-[11px] text-blue-400 font-mono">Meta CBO + Google Intent</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">2</div>
                      <span className="font-semibold text-white">Conversion</span>
                    </div>
                    <span className="text-[11px] text-indigo-400 font-mono">1-Page Shopify Checkout</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">3</div>
                      <span className="font-semibold text-white">COD Verification</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono">WhatsApp + Call Center</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-bold">4</div>
                      <span className="font-semibold text-white">Fulfillment</span>
                    </div>
                    <span className="text-[11px] text-sky-400 font-mono">Yalidine 58 Wilayas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Navigation Pills & Filters Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-fit">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-white text-blue-600 shadow-2xs border border-blue-200/50'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeCategory === cat.id
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Sorter & Complexity Filters */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Level:</span>
              </div>
              <select
                value={complexityFilter}
                onChange={(e) => setComplexityFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium cursor-pointer"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="nodes">Sort: Node Count</option>
                <option value="name">Sort: Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Templates Grid (2 Columns, Rich Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTemplates.map((tmpl) => {
              const isBookmarked = bookmarkedIds.includes(tmpl.id);

              return (
                <div
                  key={tmpl.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  <div>
                    {/* Top Badges & Bookmark */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider">
                          {tmpl.categoryLabel}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            tmpl.complexity === 'Beginner'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : tmpl.complexity === 'Intermediate'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {tmpl.complexity}
                        </span>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{tmpl.estimatedSetupTime}</span>
                        </span>
                      </div>

                      <button
                        onClick={() => toggleBookmark(tmpl.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-50 text-amber-600 border-amber-200'
                            : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                        title="Bookmark Template"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1.5">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {tmpl.description}
                    </p>

                    {/* Flow Stages Visual Diagram Strip */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Workflow Pipeline Architecture
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                        {tmpl.flowStages.map((stage, idx) => (
                          <React.Fragment key={idx}>
                            <span
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 shadow-2xs"
                              style={{ backgroundColor: stage.bg, color: stage.color }}
                            >
                              {stage.name}
                            </span>
                            {idx < tmpl.flowStages.length - 1 && (
                              <span className="text-slate-300 font-bold text-xs shrink-0">→</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Benchmark KPIs Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      {tmpl.benchmarkKpis.map((kpi, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block truncate">{kpi.label}</span>
                          <span
                            className={`text-xs font-bold block mt-0.5 ${
                              kpi.highlight ? 'text-emerald-600' : 'text-slate-800'
                            }`}
                          >
                            {kpi.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tags Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tmpl.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 text-slate-600 font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400 font-medium">
                      <span>{tmpl.nodeCount} nodes</span> • <span>{tmpl.connectionCount} links</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPreviewTemplate(tmpl)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => onNavigateToCanvas(tmpl.templateId)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR: Blueprints Hub & Fast Sourcing */}
        <aside className="w-80 bg-white border-l border-slate-200/90 p-5 space-y-5 shrink-0 overflow-y-auto">
          {/* Card 1: Blueprint Stats */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Blueprint Library Metrics
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Total Blueprints</span>
                <span className="text-lg font-bold text-slate-900 block mt-0.5">{templates.length}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Nodes Catalog</span>
                <span className="text-lg font-bold text-blue-600 block mt-0.5">64 Types</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Algeria Ready</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                All templates include 58 Wilayas courier tariff presets, Yalidine tracking handles, and local COD formulas.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Card 2: Quick Start Guides */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Blueprint Execution Guide
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-800 block">1. Select & Load</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Click 'Use Template' to load all connected nodes directly onto your canvas.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-800 block">2. Customize Ad Budget & Pricing</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Adjust product costs, local selling prices, and targeted Wilayas.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                <span className="font-bold text-slate-800 block">3. Simulate & Run AI</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Press 'Run Simulation' to watch live traffic flows or activate the AI Agent.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Card 3: Custom Template Export */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800">Save Your Canvas as Blueprint</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Export custom workflows with configured nodes, connections, and custom rules for your team.
            </p>
            <button
              onClick={() => onNavigateToCanvas()}
              className="w-full py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export From Canvas</span>
            </button>
          </div>
        </aside>
        </div>
      </div>

      {/* 5. MODAL: Template Detailed Inspector Drawer */}
      {selectedPreviewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedPreviewTemplate(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                    {selectedPreviewTemplate.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedPreviewTemplate.nodeCount} nodes • {selectedPreviewTemplate.connectionCount} links
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  {selectedPreviewTemplate.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedPreviewTemplate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Architecture Overview</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {selectedPreviewTemplate.detailedOverview}
                </p>
              </div>

              {/* Benchmarks */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Performance Benchmarks</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedPreviewTemplate.benchmarkKpis.map((kpi, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">{kpi.label}</span>
                      <span className="text-xs font-bold text-slate-900 block mt-0.5">{kpi.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flow Stages */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Pipeline Sequence</h4>
                <div className="space-y-1.5">
                  {selectedPreviewTemplate.flowStages.map((stage, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-800">Stage {idx + 1}: {stage.name}</span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{ backgroundColor: stage.bg, color: stage.color }}
                      >
                        Configured
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-400 text-xs">
                Estimated setup: {selectedPreviewTemplate.estimatedSetupTime}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPreviewTemplate(null)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setSelectedPreviewTemplate(null);
                    onNavigateToCanvas(selectedPreviewTemplate.templateId);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch in Canvas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
