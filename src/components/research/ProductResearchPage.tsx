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
  Percent,
  Compass,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Check,
  Globe,
  Store,
  DollarSign,
  Truck,
  Users,
  Target,
  Factory,
  Flame,
  ArrowUpRight,
  BookmarkPlus,
  BookmarkCheck,
} from 'lucide-react';

import { AppSidebar } from '../navigation/AppSidebar';

export type ResearchSubSection =
  | 'winning_products'
  | 'competitor_analysis'
  | 'market_trends'
  | 'supplier_finder';

interface ProductResearchPageProps {
  onNavigate?: (view: string, subItem?: string) => void;
  onNavigateToCanvas: (templateId?: string) => void;
  onNavigateToHome: () => void;
  onNavigateToProjects: () => void;
  onOpenTemplates: () => void;
  initialSubSection?: ResearchSubSection;
  currentCurrency?: string;
}

interface ProductItem {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  priceRange: string;
  trend: string;
  trendValue: number;
  demand: 'High' | 'Medium' | 'Low';
  competition: 'Low' | 'Medium' | 'High';
  profitMargin: number;
  image: string;
  inLibrary: boolean;
  score: number;
  monthlyRevenueEst: string;
  supplierCost: string;
  suggestedSellingDZ: string;
}

export const ProductResearchPage: React.FC<ProductResearchPageProps> = ({
  onNavigate,
  onNavigateToCanvas,
  onNavigateToHome,
  onNavigateToProjects,
  onOpenTemplates,
  initialSubSection = 'winning_products',
  currentCurrency = 'DZD',
}) => {
  const [activeSubSection, setActiveSubSection] = useState<ResearchSubSection>(initialSubSection);
  const [selectedCountry, setSelectedCountry] = useState('Algeria');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [trendFilter, setTrendFilter] = useState('Trending');
  const [competitionFilter, setCompetitionFilter] = useState('All');
  const [profitFilter, setProfitFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'trending' | 'top_rated' | 'profitable' | 'new'>('trending');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Selected product for right sidebar analysis
  const [selectedProductId, setSelectedProductId] = useState<string>('prod_2'); // Portable Blender

  // Master product data matching the screenshot
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'prod_1',
      name: 'LED Night Light Projector',
      category: 'Home & Living',
      subCategory: 'Home & Living',
      priceRange: '8.99 - 15.99 $',
      trend: '+134%',
      trendValue: 134,
      demand: 'High',
      competition: 'Low',
      profitMargin: 72,
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 94,
      monthlyRevenueEst: '42,000 $',
      supplierCost: '4.20 $',
      suggestedSellingDZ: '4,500 DZD',
    },
    {
      id: 'prod_2',
      name: 'Portable Blender',
      category: 'Kitchen',
      subCategory: 'Kitchen Appliances',
      priceRange: '12.99 - 22.99 $',
      trend: '+89%',
      trendValue: 89,
      demand: 'High',
      competition: 'Medium',
      profitMargin: 65,
      image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 91,
      monthlyRevenueEst: '68,000 $',
      supplierCost: '6.50 $',
      suggestedSellingDZ: '3,800 DZD',
    },
    {
      id: 'prod_3',
      name: 'Magnetic Phone Holder',
      category: 'Electronics',
      subCategory: 'Mobile Accessories',
      priceRange: '5.99 - 12.99 $',
      trend: '+76%',
      trendValue: 76,
      demand: 'High',
      competition: 'Low',
      profitMargin: 68,
      image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 88,
      monthlyRevenueEst: '29,000 $',
      supplierCost: '1.80 $',
      suggestedSellingDZ: '2,200 DZD',
    },
    {
      id: 'prod_4',
      name: 'Smart Watch (Budget)',
      category: 'Electronics',
      subCategory: 'Wearables',
      priceRange: '18.99 - 34.99 $',
      trend: '+62%',
      trendValue: 62,
      demand: 'Medium',
      competition: 'Medium',
      profitMargin: 55,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 85,
      monthlyRevenueEst: '54,000 $',
      supplierCost: '9.20 $',
      suggestedSellingDZ: '4,800 DZD',
    },
    {
      id: 'prod_5',
      name: 'Hair Styling Brush',
      category: 'Beauty',
      subCategory: 'Beauty & Personal Care',
      priceRange: '8.99 - 16.99 $',
      trend: '+58%',
      trendValue: 58,
      demand: 'High',
      competition: 'Medium',
      profitMargin: 62,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 83,
      monthlyRevenueEst: '38,000 $',
      supplierCost: '4.80 $',
      suggestedSellingDZ: '3,200 DZD',
    },
    {
      id: 'prod_6',
      name: 'Foldable Camping Chair',
      category: 'Sports & Outdoors',
      subCategory: 'Outdoor Gear',
      priceRange: '14.99 - 29.99 $',
      trend: '+52%',
      trendValue: 52,
      demand: 'Medium',
      competition: 'Low',
      profitMargin: 60,
      image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 80,
      monthlyRevenueEst: '24,000 $',
      supplierCost: '7.50 $',
      suggestedSellingDZ: '4,900 DZD',
    },
    {
      id: 'prod_7',
      name: 'Air Fryer',
      category: 'Home Appliances',
      subCategory: 'Kitchen Appliances',
      priceRange: '29.99 - 59.99 $',
      trend: '+48%',
      trendValue: 48,
      demand: 'High',
      competition: 'Medium',
      profitMargin: 58,
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 87,
      monthlyRevenueEst: '95,000 $',
      supplierCost: '18.00 $',
      suggestedSellingDZ: '12,500 DZD',
    },
    {
      id: 'prod_8',
      name: 'Back Support Pillow',
      category: 'Home & Living',
      subCategory: 'Orthopedic & Ergonomics',
      priceRange: '9.99 - 19.99 $',
      trend: '+44%',
      trendValue: 44,
      demand: 'Medium',
      competition: 'Low',
      profitMargin: 64,
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 81,
      monthlyRevenueEst: '18,500 $',
      supplierCost: '3.60 $',
      suggestedSellingDZ: '2,900 DZD',
    },
    {
      id: 'prod_9',
      name: 'LED Strip Lights',
      category: 'Home & Living',
      subCategory: 'Ambient Lighting',
      priceRange: '6.99 - 14.99 $',
      trend: '+41%',
      trendValue: 41,
      demand: 'High',
      competition: 'High',
      profitMargin: 61,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 79,
      monthlyRevenueEst: '31,000 $',
      supplierCost: '2.10 $',
      suggestedSellingDZ: '1,950 DZD',
    },
    {
      id: 'prod_10',
      name: 'Portable Mini Projector',
      category: 'Electronics',
      subCategory: 'Home Entertainment',
      priceRange: '39.99 - 69.99 $',
      trend: '+38%',
      trendValue: 38,
      demand: 'High',
      competition: 'Medium',
      profitMargin: 56,
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=160&auto=format&fit=crop&q=80',
      inLibrary: true,
      score: 86,
      monthlyRevenueEst: '72,000 $',
      supplierCost: '24.00 $',
      suggestedSellingDZ: '14,000 DZD',
    },
  ]);

  // Selected product object
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[1];
  }, [products, selectedProductId]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (competitionFilter !== 'All' && p.competition !== competitionFilter) return false;
      if (activeTab === 'top_rated' && p.score < 85) return false;
      if (activeTab === 'profitable' && p.profitMargin < 65) return false;
      return true;
    });
  }, [products, searchKeyword, categoryFilter, competitionFilter, activeTab]);

  // Toggle library addition
  const toggleLibrary = (productId: string) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, inLibrary: !item.inLibrary } : item
      )
    );
  };

  const handleLaunchToCanvas = (prod: ProductItem) => {
    onNavigateToCanvas('algeria_cod_complete_funnel');
  };

  const handleSidebarNavigate = (view: string, subItem?: string) => {
    if (onNavigate) {
      onNavigate(view, subItem);
      return;
    }
    if (view === 'dashboard') onNavigateToHome();
    else if (view === 'projects') onNavigateToProjects();
    else if (view === 'templates') onOpenTemplates();
    else if (view === 'canvas') onNavigateToCanvas();
  };

  return (
    <div className="w-screen h-screen flex bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden select-none">
      {/* 1. UNIFIED LEFT NAVIGATION SIDEBAR */}
      <AppSidebar
        activeView="research"
        onNavigate={handleSidebarNavigate}
        onOpenNewModal={() => onNavigateToCanvas('product_intelligence_pipeline')}
      />

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* TOP GLOBAL HEADER */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between gap-4 z-20 shrink-0 shadow-2xs">
          {/* Left: Breadcrumb & Sub-section pills */}
          <div className="flex items-center gap-2 shrink-0">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-2">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-slate-900 font-bold">Product Research</span>
            </nav>

            <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/70">
              {[
                { id: 'winning_products', label: 'Winning Products' },
                { id: 'competitor_analysis', label: 'Competitors' },
                { id: 'market_trends', label: 'Market Trends' },
                { id: 'supplier_finder', label: 'Suppliers' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSubSection(sub.id as ResearchSubSection)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    activeSubSection === sub.id
                      ? 'bg-white text-blue-600 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Search input */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products, niches, keywords... Ctrl + K"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-8 pr-14 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded">
                Ctrl + K
              </kbd>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToCanvas()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => onNavigateToCanvas('product_intelligence_pipeline')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Run Analysis</span>
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

        {/* BODY LAYOUT: Main Content + Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* 3. CENTER MAIN WORKSPACE */}
          <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section 1: Winning Product Finder (Default matching screenshot) */}
          {activeSubSection === 'winning_products' && (
            <>
              {/* Header Title with AI badge + Country selector + Add to Library */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                      Winning Product Finder
                    </h1>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-600 font-bold text-[10px]">
                      AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Discover profitable products based on real market data, trends and competition analysis.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Country Selector Dropdown */}
                  <div className="relative">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-2xs">
                      <span role="img" aria-label="Algeria" className="text-sm">🇩🇿</span>
                      <span>Algeria</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>

                  {/* Add to Library Button */}
                  <button
                    onClick={() => toggleLibrary(selectedProductId)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Library</span>
                  </button>
                </div>
              </div>

              {/* 4-Step Workflow Guidance Bar (Matching Screenshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">1. Find Ideas</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      Discover trending products and market opportunities.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                    <BarChart2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">2. Analyze</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      Check demand, competition, profit margin and risk.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">3. Validate</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      Confirm with suppliers, reviews and market data.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3 shadow-2xs">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">4. Add to Library</h4>
                    <p className="text-[10px] text-slate-400 leading-relaxed mt-0.5">
                      Save winning products to your product library.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar & Multi-Dimensional Filters */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search product ideas (e.g. portable, outdoor, kitchen...)"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold shadow-xs">
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>

                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    <span>Advanced Filters</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
                </div>

                {/* Filter Dropdowns Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Category</span>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium cursor-pointer"
                      >
                        <option value="All">All Categories</option>
                        <option value="Home & Living">Home & Living</option>
                        <option value="Kitchen">Kitchen</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Sports & Outdoors">Sports & Outdoors</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Price Range</span>
                      <select
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium cursor-pointer"
                      >
                        <option value="All">All Prices</option>
                        <option value="under_15">Under $15</option>
                        <option value="15_30">$15 - $30</option>
                        <option value="over_30">Over $30</option>
                      </select>
                    </div>

                    {/* Trend */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Trend</span>
                      <select
                        value={trendFilter}
                        onChange={(e) => setTrendFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium cursor-pointer"
                      >
                        <option value="Trending">Trending</option>
                        <option value="Explosive">Explosive (+100%)</option>
                        <option value="Steady">Steady Growth</option>
                      </select>
                    </div>

                    {/* Competition */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Competition</span>
                      <select
                        value={competitionFilter}
                        onChange={(e) => setCompetitionFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium cursor-pointer"
                      >
                        <option value="All">Low - Medium</option>
                        <option value="Low">Low only</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>

                    {/* Profit Margin */}
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block mb-0.5">Profit Margin</span>
                      <select
                        value={profitFilter}
                        onChange={(e) => setProfitFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium cursor-pointer"
                      >
                        <option value="All">High (&gt; 60%)</option>
                        <option value="70">Extreme (&gt; 70%)</option>
                        <option value="all">Any Margin</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCategoryFilter('All');
                      setPriceFilter('All');
                      setTrendFilter('Trending');
                      setCompetitionFilter('All');
                      setProfitFilter('All');
                      setSearchKeyword('');
                    }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium self-end py-1"
                  >
                    <span>Reset</span>
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards (Total Ideas, Winning Products, Avg Margin, Market Demand) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Total Ideas Found</span>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">342</div>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                      ↑ 18% <span className="text-slate-400 font-normal">vs last 7 days</span>
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Winning Products</span>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">48</div>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                      ↑ 22% <span className="text-slate-400 font-normal">vs last 7 days</span>
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Avg. Profit Margin</span>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">68%</div>
                    <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                      ↑ 12% <span className="text-slate-400 font-normal">vs last 7 days</span>
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Percent className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 font-medium">Market Demand</span>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">High</div>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">In Algeria</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Tabs: Trending Products, Top Rated, Most Profitable, New Arrivals */}
              <div className="border-b border-slate-200">
                <div className="flex items-center gap-6 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('trending')}
                    className={`pb-2.5 transition-all relative ${
                      activeTab === 'trending' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Trending Products</span>
                    {activeTab === 'trending' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('top_rated')}
                    className={`pb-2.5 transition-all relative ${
                      activeTab === 'top_rated' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Top Rated</span>
                    {activeTab === 'top_rated' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('profitable')}
                    className={`pb-2.5 transition-all relative ${
                      activeTab === 'profitable' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>Most Profitable</span>
                    {activeTab === 'profitable' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('new')}
                    className={`pb-2.5 transition-all relative ${
                      activeTab === 'new' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>New Arrivals</span>
                    {activeTab === 'new' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </button>
                </div>
              </div>

              {/* Products Table (Matching Screenshot Table) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-50/50">
                      <th className="py-3 px-4 font-medium">Product</th>
                      <th className="py-3 px-4 font-medium">Category</th>
                      <th className="py-3 px-4 font-medium">Trend</th>
                      <th className="py-3 px-4 font-medium">Demand</th>
                      <th className="py-3 px-4 font-medium">Competition</th>
                      <th className="py-3 px-4 font-medium">Profit Margin</th>
                      <th className="py-3 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredProducts.map((prod) => (
                      <tr
                        key={prod.id}
                        onClick={() => setSelectedProductId(prod.id)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                          selectedProductId === prod.id ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        {/* Product Thumbnail + Title + Price */}
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                          />
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block leading-tight">
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {prod.subCategory} • {prod.priceRange}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {prod.category}
                        </td>

                        {/* Trend */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                            ↑ {prod.trend}
                          </span>
                        </td>

                        {/* Demand */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              prod.demand === 'High'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                            }`}
                          >
                            {prod.demand}
                          </span>
                        </td>

                        {/* Competition */}
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              prod.competition === 'Low'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                : prod.competition === 'Medium'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                            }`}
                          >
                            {prod.competition}
                          </span>
                        </td>

                        {/* Profit Margin */}
                        <td className="py-3 px-4 font-bold text-emerald-600">
                          {prod.profitMargin}%
                        </td>

                        {/* Action: Add to Library button & More */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => toggleLibrary(prod.id)}
                              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                prod.inLibrary
                                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-500 hover:text-blue-600 shadow-2xs'
                              }`}
                            >
                              {prod.inLibrary ? 'Added' : 'Add to Library'}
                            </button>

                            <button
                              onClick={() => handleLaunchToCanvas(prod)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700"
                              title="Create Funnel Workflow in Canvas"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table Footer / Pagination (Matching Screenshot) */}
                <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((pageNum) => (
                      <button
                        key={pageNum}
                        className={`w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center transition-colors ${
                          pageNum === 1 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <span className="px-1 text-slate-400">...</span>
                    <button className="w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center text-slate-600 hover:bg-slate-100">
                      ›
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Showing 1 - 7 of 342 products
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Section 2: Competitor Analysis Sub-View */}
          {activeSubSection === 'competitor_analysis' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Competitor Intelligence & Spy Tool
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track active Facebook and TikTok campaigns running across 58 Algerian Wilayas.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateToCanvas('facebook_ads_analysis')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Competitor Ad Funnel</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Oran Watch Store (FB Page)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">Scaling</span>
                  </div>
                  <p className="text-xs text-slate-500">Active ads: 12 · Estimated spend: 180,000 DZD / week</p>
                  <div className="text-[11px] text-slate-400">Top offer: Garmin Smartwatch 3,800 DZD with Yalidine COD free delivery.</div>
                  <button
                    onClick={() => onNavigateToCanvas('algeria_cod_complete_funnel')}
                    className="w-full mt-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Replicate Funnel Strategy
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Alger Beauty Express</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">Testing</span>
                  </div>
                  <p className="text-xs text-slate-500">Active ads: 6 · Estimated spend: 90,000 DZD / week</p>
                  <div className="text-[11px] text-slate-400">Top offer: Hair Styling Brush 3,200 DZD with WhatsApp order confirmation.</div>
                  <button
                    onClick={() => onNavigateToCanvas('facebook_ads_analysis')}
                    className="w-full mt-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Inspect Creatives & Hooks
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Setif Electrics COD</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">High Volume</span>
                  </div>
                  <p className="text-xs text-slate-500">Active ads: 18 · Estimated spend: 320,000 DZD / week</p>
                  <div className="text-[11px] text-slate-400">Top offer: Portable Blender 3,500 DZD with 48h Home delivery.</div>
                  <button
                    onClick={() => onNavigateToCanvas('ecommerce_profit_engine')}
                    className="w-full mt-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                  >
                    Simulate Price War Margin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Market Trends Sub-View */}
          {activeSubSection === 'market_trends' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Algeria Market Seasonality & Trends
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live consumer interest across 58 Wilayas based on TikTok, Facebook & Google Search volume.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Rising Niches This Month</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-800">1. Sport Watches & Trackers</span>
                      <span className="font-bold text-emerald-600">+134% surge</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-800">2. Rechargeable Kitchen Blenders</span>
                      <span className="font-bold text-emerald-600">+89% surge</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-800">3. Magnetic In-Car Accessories</span>
                      <span className="font-bold text-emerald-600">+76% surge</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-800">4. LED Ambient Lights</span>
                      <span className="font-bold text-emerald-600">+62% surge</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Highest Wilaya Purchasing Power</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50">
                      <span className="font-semibold text-slate-800">Wilaya 16 - Alger</span>
                      <span className="font-bold text-emerald-700">76.4% Delivery rate · 720 DZD ship</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50">
                      <span className="font-semibold text-slate-800">Wilaya 31 - Oran</span>
                      <span className="font-bold text-emerald-700">74.2% Delivery rate · 750 DZD ship</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50">
                      <span className="font-semibold text-slate-800">Wilaya 19 - Setif</span>
                      <span className="font-bold text-emerald-700">71.8% Delivery rate · 780 DZD ship</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/50">
                      <span className="font-semibold text-slate-800">Wilaya 25 - Constantine</span>
                      <span className="font-bold text-emerald-700">69.5% Delivery rate · 800 DZD ship</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Supplier Finder Sub-View */}
          {activeSubSection === 'supplier_finder' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Verified Sourcing & Importer Directory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct verified suppliers from 1688, Yiwu, Guangzhou, and Algerian local bonded stock.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Shenzhen Precision Tech Co.</h3>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Verified 1688</span>
                  </div>
                  <p className="text-xs text-slate-500">Products: Smartwatches, Bluetooth earphones, fitness bracelets.</p>
                  <p className="text-xs text-slate-700 font-medium">Unit cost: $4.20 - $9.20 · MOA: 50 pcs · Air express to Algiers: 9 days</p>
                  <button
                    onClick={() => onNavigateToCanvas('product_intelligence_pipeline')}
                    className="w-full mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    Add to Sourcing Pipeline
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Yiwu Smart Home Appliances</h3>
                    <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">Verified 1688</span>
                  </div>
                  <p className="text-xs text-slate-500">Products: Portable blenders, mini mixers, juice extractors.</p>
                  <p className="text-xs text-slate-700 font-medium">Unit cost: $3.50 - $6.50 · MOA: 100 pcs · Sea shipping to Port of Algiers: 28 days</p>
                  <button
                    onClick={() => onNavigateToCanvas('product_intelligence_pipeline')}
                    className="w-full mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                  >
                    Add to Sourcing Pipeline
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* 4. RIGHT SIDEBAR: Product Library & Selected Product Analysis (Matching Screenshot) */}
        <aside className="w-80 bg-white border-l border-slate-200/90 p-5 space-y-5 shrink-0 overflow-y-auto">
          {/* Top Card: Product Library (142 products) */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Product Library</h3>
                <span className="text-[11px] text-slate-400">142 products</span>
              </div>
              <button
                onClick={() => {}}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View All
              </button>
            </div>

            {/* Search in library */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search in your library..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              >
              </input>
            </div>

            {/* Scrollable list of products */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-0.5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                    selectedProductId === prod.id
                      ? 'border-blue-400 bg-blue-50/40 shadow-2xs'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate leading-tight">
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">
                        {prod.category} • {prod.priceRange}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                      Added
                    </span>
                    <button className="p-1 rounded text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Bottom Card: Selected Product Analysis (Matching Screenshot) */}
          <div className="space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Selected Product Analysis
            </h3>

            {/* Product Card with Thumbnail & View Details button */}
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight truncate">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {selectedProduct.category} • {selectedProduct.priceRange}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleLaunchToCanvas(selectedProduct)}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shrink-0 shadow-2xs transition-colors"
              >
                View Details
              </button>
            </div>

            {/* 4 Mini Stat Pills (Trend, Demand, Competition, Profit Margin) */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Trend</span>
                <span className="text-xs font-bold text-emerald-600 block mt-0.5">
                  {selectedProduct.trend}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Demand</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1 py-0.5 rounded-full inline-block mt-0.5">
                  • {selectedProduct.demand}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Competition</span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1 py-0.5 rounded-full inline-block mt-0.5">
                  • {selectedProduct.competition}
                </span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Profit Margin</span>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  {selectedProduct.profitMargin}%
                </span>
              </div>
            </div>

            {/* Quick Launch CTA to Canvas Funnel */}
            <button
              onClick={() => handleLaunchToCanvas(selectedProduct)}
              className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Build Sales Funnel in Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
        </div>
      </div>
    </div>
  );
};
