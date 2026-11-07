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
  Filter,
  Grid,
  List,
  Clock,
  Share2,
  ChevronDown,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  Edit3,
  Download,
  Copy,
  Trash2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Tag,
  ShoppingBag,
  Watch,
  Smartphone,
  Check,
  Archive,
  Megaphone,
  ShoppingCart,
  Users,
  Palette,
  Eye,
  SlidersHorizontal,
  Star,
  Coins,
  Calculator,
} from 'lucide-react';

export interface ProjectItem {
  id: string;
  name: string;
  subtitle: string;
  status: 'active' | 'draft' | 'paused' | 'archived';
  category: string;
  lastEdited: string;
  lastEditedTimestamp: number;
  nodeCount: number;
  connectionCount: number;
  templateId: string;
  iconType: 'flag_dz' | 'meta' | 'blender' | 'bag' | 'watch' | 'chart';
  pipeline: Array<{
    name: string;
    icon: string;
    color: string;
    bg: string;
  }>;
}

import { AppSidebar } from '../navigation/AppSidebar';

interface ProjectsPageProps {
  onNavigate?: (view: string, subItem?: string) => void;
  onNavigateToCanvas: (templateId?: string) => void;
  onNavigateToHome: () => void;
  onNavigateToProjects?: () => void;
  onNavigateToResearch?: () => void;
  onOpenNewProject: () => void;
  onOpenTemplates: () => void;
  currentCurrency?: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onNavigate,
  onNavigateToCanvas,
  onNavigateToHome,
  onNavigateToProjects,
  onNavigateToResearch,
  onOpenNewProject,
  onOpenTemplates,
  currentCurrency = 'DZD',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'last_edited' | 'name' | 'nodes'>('last_edited');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Initial projects matching screenshot
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
    {
      id: 'proj_1',
      name: 'Algeria COD Sales Funnel',
      subtitle: 'Complete COD e-commerce funnel for Algeria market',
      status: 'active',
      category: 'Algerian E-commerce',
      lastEdited: '2 hours ago',
      lastEditedTimestamp: Date.now() - 2 * 3600 * 1000,
      nodeCount: 15,
      connectionCount: 9,
      templateId: 'algeria_cod_complete_funnel',
      iconType: 'flag_dz',
      pipeline: [
        { name: 'Ads', icon: 'megaphone', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Landing Page', icon: 'layout', color: '#9333EA', bg: '#FAF5FF' },
        { name: 'Checkout', icon: 'cart', color: '#D97706', bg: '#FFFBEB' },
        { name: 'COD Order', icon: 'package', color: '#16A34A', bg: '#F0FDF4' },
      ],
    },
    {
      id: 'proj_2',
      name: 'Meta Ads – Sports Watches',
      subtitle: 'Meta ad campaigns and creative testing for sports watches',
      status: 'active',
      category: 'Paid Advertising',
      lastEdited: '5 hours ago',
      lastEditedTimestamp: Date.now() - 5 * 3600 * 1000,
      nodeCount: 8,
      connectionCount: 5,
      templateId: 'facebook_ads_analysis',
      iconType: 'meta',
      pipeline: [
        { name: 'Audience', icon: 'users', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Ads', icon: 'megaphone', color: '#0284C7', bg: '#F0F9FF' },
        { name: 'Creative Test', icon: 'palette', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Sales', icon: 'cart', color: '#16A34A', bg: '#F0FDF4' },
      ],
    },
    {
      id: 'proj_3',
      name: 'Portable Blender Research',
      subtitle: 'Product research and supplier analysis',
      status: 'draft',
      category: 'Product Research',
      lastEdited: '1 day ago',
      lastEditedTimestamp: Date.now() - 24 * 3600 * 1000,
      nodeCount: 6,
      connectionCount: 2,
      templateId: 'product_intelligence_pipeline',
      iconType: 'blender',
      pipeline: [
        { name: 'Research', icon: 'search', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Supplier', icon: 'package', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Analysis', icon: 'chart', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Report', icon: 'file', color: '#16A34A', bg: '#F0FDF4' },
      ],
    },
    {
      id: 'proj_4',
      name: 'Fashion Bags – Creative Test',
      subtitle: 'Creative testing for fashion bags products',
      status: 'paused',
      category: 'Creative Production',
      lastEdited: '2 days ago',
      lastEditedTimestamp: Date.now() - 48 * 3600 * 1000,
      nodeCount: 10,
      connectionCount: 7,
      templateId: 'creative_testing_matrix',
      iconType: 'bag',
      pipeline: [
        { name: 'Product', icon: 'bag', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Creatives', icon: 'palette', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'A/B Test', icon: 'sliders', color: '#0D9488', bg: '#F0FDFA' },
        { name: 'Ads', icon: 'megaphone', color: '#E11D48', bg: '#FFF1F2' },
      ],
    },
    {
      id: 'proj_5',
      name: 'Smart Watch Product Intelligence',
      subtitle: 'Market research and competitor analysis for smart watches',
      status: 'active',
      category: 'Product Research',
      lastEdited: '3 days ago',
      lastEditedTimestamp: Date.now() - 72 * 3600 * 1000,
      nodeCount: 12,
      connectionCount: 8,
      templateId: 'algeria_cod_complete_funnel',
      iconType: 'watch',
      pipeline: [
        { name: 'Research', icon: 'search', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Competitors', icon: 'users', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Validation', icon: 'check', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Recommendation', icon: 'star', color: '#16A34A', bg: '#F0FDF4' },
      ],
    },
    {
      id: 'proj_6',
      name: 'COD Profitability Analyzer',
      subtitle: 'Analyze costs, conversion and profit for COD business',
      status: 'draft',
      category: 'Analytics & Profit',
      lastEdited: '4 days ago',
      lastEditedTimestamp: Date.now() - 96 * 3600 * 1000,
      nodeCount: 7,
      connectionCount: 4,
      templateId: 'ecommerce_profit_engine',
      iconType: 'chart',
      pipeline: [
        { name: 'Orders', icon: 'package', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Costs', icon: 'coins', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Profit Calc', icon: 'calculator', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'Report', icon: 'file', color: '#16A34A', bg: '#F0FDF4' },
      ],
    },
    {
      id: 'proj_7',
      name: 'Summer Eyewear Dropship Funnel',
      subtitle: 'Direct-to-consumer sunglasses campaign for Oran & Alger',
      status: 'archived',
      category: 'Archived',
      lastEdited: '2 weeks ago',
      lastEditedTimestamp: Date.now() - 14 * 24 * 3600 * 1000,
      nodeCount: 9,
      connectionCount: 6,
      templateId: 'algeria_cod_complete_funnel',
      iconType: 'chart',
      pipeline: [
        { name: 'TikTok', icon: 'video', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'Landing', icon: 'layout', color: '#7C3AED', bg: '#F5F3FF' },
        { name: 'COD Form', icon: 'cart', color: '#D97706', bg: '#FFFBEB' },
        { name: 'Delivered', icon: 'check', color: '#16A34A', bg: '#F0FDF4' },
      ],
    },
    {
      id: 'proj_8',
      name: 'Beauty & Skincare Algeria COD',
      subtitle: 'Cosmetics validation with Wilaya delivery speed optimization',
      status: 'archived',
      category: 'Archived',
      lastEdited: '1 month ago',
      lastEditedTimestamp: Date.now() - 30 * 24 * 3600 * 1000,
      nodeCount: 11,
      connectionCount: 7,
      templateId: 'algeria_cod_complete_funnel',
      iconType: 'flag_dz',
      pipeline: [
        { name: 'Meta Ads', icon: 'megaphone', color: '#2563EB', bg: '#EFF6FF' },
        { name: 'WhatsApp', icon: 'users', color: '#16A34A', bg: '#F0FDF4' },
        { name: 'Yalidine', icon: 'package', color: '#0284C7', bg: '#F0F9FF' },
        { name: 'Profit', icon: 'coins', color: '#7C3AED', bg: '#F5F3FF' },
      ],
    },
  ]);

  // Project Templates in right sidebar matching screenshot
  const projectTemplates = [
    {
      id: 'tmpl_1',
      name: 'E-commerce COD Funnel',
      desc: 'Complete funnel for Algerian market with COD operations.',
      templateId: 'algeria_cod_complete_funnel',
      nodes: [
        { x: 12, y: 15, color: '#3B82F6' },
        { x: 38, y: 10, color: '#10B981' },
        { x: 62, y: 22, color: '#F59E0B' },
        { x: 30, y: 35, color: '#8B5CF6' },
      ],
    },
    {
      id: 'tmpl_2',
      name: 'Product Research Workflow',
      desc: 'From idea to validation with suppliers and analysis.',
      templateId: 'product_intelligence_pipeline',
      nodes: [
        { x: 35, y: 22, color: '#EF4444' },
        { x: 14, y: 14, color: '#3B82F6' },
        { x: 62, y: 14, color: '#10B981' },
        { x: 50, y: 35, color: '#8B5CF6' },
      ],
    },
    {
      id: 'tmpl_3',
      name: 'Meta Ads Campaign',
      desc: 'Ad research, creative testing and performance tracking.',
      templateId: 'facebook_ads_analysis',
      nodes: [
        { x: 16, y: 12, color: '#3B82F6' },
        { x: 54, y: 12, color: '#10B981' },
        { x: 16, y: 34, color: '#8B5CF6' },
        { x: 54, y: 34, color: '#F59E0B' },
      ],
    },
    {
      id: 'tmpl_4',
      name: 'Profitability Analyzer',
      desc: 'Calculate costs, conversion and profit for your products.',
      templateId: 'ecommerce_profit_engine',
      nodes: [
        { x: 14, y: 24, color: '#F59E0B' },
        { x: 38, y: 12, color: '#3B82F6' },
        { x: 62, y: 24, color: '#10B981' },
        { x: 38, y: 36, color: '#8B5CF6' },
      ],
    },
  ];

  // Recent activity items matching screenshot
  const recentActivities = [
    {
      id: 'a1',
      type: 'created',
      title: 'Project created',
      project: 'Algeria COD Sales Funnel',
      time: '2 hours ago',
      icon: Plus,
      iconBg: 'bg-emerald-500',
    },
    {
      id: 'a2',
      type: 'updated',
      title: 'Node updated',
      project: 'Meta Ads – Sports Watches',
      time: '3 hours ago',
      icon: Edit3,
      iconBg: 'bg-blue-500',
    },
    {
      id: 'a3',
      type: 'shared',
      title: 'Project shared',
      project: 'Portable Blender Research',
      time: '5 hours ago',
      icon: Users,
      iconBg: 'bg-purple-500',
    },
    {
      id: 'a4',
      type: 'executed',
      title: 'Workflow executed',
      project: 'Fashion Bags – Creative Test',
      time: '1 day ago',
      icon: Check,
      iconBg: 'bg-emerald-600',
    },
    {
      id: 'a5',
      type: 'template',
      title: 'Template used',
      project: 'Smart Watch Product Intelligence',
      time: '2 days ago',
      icon: Download,
      iconBg: 'bg-amber-500',
    },
    {
      id: 'a6',
      type: 'report',
      title: 'Report generated',
      project: 'COD Profitability Analyzer',
      time: '3 days ago',
      icon: FileText,
      iconBg: 'bg-blue-600',
    },
  ];

  // Filter & sort logic
  const filteredProjects = useMemo(() => {
    return projectsList
      .filter((item) => {
        if (activeTab === 'active' && item.status !== 'active') return false;
        if (activeTab === 'draft' && item.status !== 'draft') return false;
        if (activeTab === 'archived' && item.status !== 'archived') return false;
        if (activeTab === 'all' && item.status === 'archived') return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          return (
            item.name.toLowerCase().includes(q) ||
            item.subtitle.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'nodes') return b.nodeCount - a.nodeCount;
        return b.lastEditedTimestamp - a.lastEditedTimestamp;
      });
  }, [projectsList, activeTab, searchQuery, sortBy]);

  // Statistics
  const totalCount = 12;
  const activeCount = 7;
  const draftCount = 3;
  const archivedCount = 2;

  // Render project icon based on type
  const renderProjectIcon = (type: ProjectItem['iconType']) => {
    switch (type) {
      case 'flag_dz':
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-xl shadow-2xs shrink-0 overflow-hidden">
            <span role="img" aria-label="Algeria Flag">🇩🇿</span>
          </div>
        );
      case 'meta':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
            {/* Meta Infinity Logo */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M12 7.75c-2.4 0-4.3 1.5-5.3 3.5-1-2-2.9-3.5-5.3-3.5C1.5 7.75 0 9.25 0 11.15c0 3.7 4.2 8.1 6.7 8.1 1.6 0 3-1.1 3.9-2.6.9 1.5 2.3 2.6 3.9 2.6 2.5 0 6.7-4.4 6.7-8.1 0-1.9-1.5-3.4-3.4-3.4-2.4 0-4.3 1.5-5.3 3.5-.5-1-1.3-1.8-2.2-2.3 1-1.2 2.6-2 4.4-2 2.6 0 4.7 1.8 5.2 4.3.4-2.5 2.6-4.3 5.2-4.3 2.9 0 5.3 2.4 5.3 5.3 0 4.8-4.8 9.5-7.9 9.5-1.9 0-3.5-1.3-4.5-3.1-1 1.8-2.6 3.1-4.5 3.1-3.1 0-7.9-4.7-7.9-9.5 0-2.9 2.4-5.3 5.3-5.3 2.3 0 4.3 1.5 5 3.6.7-2.1 2.7-3.6 5-3.6z" />
            </svg>
          </div>
        );
      case 'blender':
        return (
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-600 shadow-2xs shrink-0">
            <Smartphone className="w-5 h-5 text-sky-600" />
          </div>
        );
      case 'bag':
        return (
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
          </div>
        );
      case 'watch':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
            <Watch className="w-5 h-5 text-blue-600" />
          </div>
        );
      case 'chart':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
        );
    }
  };

  // Pipeline stage icon renderer
  const renderPipelineIcon = (iconName: string) => {
    switch (iconName) {
      case 'megaphone':
        return <Megaphone className="w-3.5 h-3.5" />;
      case 'layout':
        return <LayoutGrid className="w-3.5 h-3.5" />;
      case 'cart':
        return <ShoppingCart className="w-3.5 h-3.5" />;
      case 'package':
        return <Package className="w-3.5 h-3.5" />;
      case 'users':
        return <Users className="w-3.5 h-3.5" />;
      case 'palette':
        return <Palette className="w-3.5 h-3.5" />;
      case 'search':
        return <Search className="w-3.5 h-3.5" />;
      case 'chart':
        return <BarChart2 className="w-3.5 h-3.5" />;
      case 'file':
        return <FileText className="w-3.5 h-3.5" />;
      case 'bag':
        return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'sliders':
        return <SlidersHorizontal className="w-3.5 h-3.5" />;
      case 'check':
        return <Check className="w-3.5 h-3.5" />;
      case 'star':
        return <Star className="w-3.5 h-3.5" />;
      case 'coins':
        return <Coins className="w-3.5 h-3.5" />;
      case 'calculator':
        return <Calculator className="w-3.5 h-3.5" />;
      default:
        return <Zap className="w-3.5 h-3.5" />;
    }
  };

  const handleSidebarNavigate = (view: string, subItem?: string) => {
    if (onNavigate) {
      onNavigate(view, subItem);
      return;
    }
    if (view === 'dashboard') onNavigateToHome();
    else if (view === 'projects') onNavigateToProjects?.();
    else if (view === 'templates') onOpenTemplates();
    else if (view === 'canvas') onNavigateToCanvas();
    else if (view === 'research') onNavigateToResearch?.();
  };

  return (
    <div className="w-screen h-screen flex bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden select-none">
      {/* 1. UNIFIED LEFT NAVIGATION SIDEBAR */}
      <AppSidebar
        activeView="projects"
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
              <span className="text-slate-800 font-semibold">Projects & Workflows</span>
            </nav>
          </div>

          {/* Center: Search Bar & Filter */}
          <div className="flex items-center gap-2 flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>

            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Right: Notifications, Dark Mode & Yahia Profile */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="w-[1px] h-6 bg-slate-200 mx-0.5" />

            {/* Yahia Profile */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                Y
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">Yahia</span>
                <span className="text-[10px] text-slate-400 block font-medium">Pro User</span>
              </div>
            </div>
          </div>
        </header>

        {/* BODY LAYOUT: Center Content + Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* CENTER MAIN CONTENT: Projects & Workflows Grid */}
          <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                Projects & Workflows
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your product research and e-commerce systems
              </p>
            </div>

            <button
              onClick={onOpenNewProject}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>New Project</span>
            </button>
          </div>

          {/* Filter Tabs & Summary Counters Bar (Matching Screenshot) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            {/* Left: Segmented Pill Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 w-fit">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-blue-600 shadow-2xs border border-blue-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All Projects</span>
              </button>

              <button
                onClick={() => setActiveTab('active')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'active'
                    ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active</span>
              </button>

              <button
                onClick={() => setActiveTab('draft')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'draft'
                    ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Drafts</span>
              </button>

              <button
                onClick={() => setActiveTab('archived')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'archived'
                    ? 'bg-white text-slate-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>Archived</span>
              </button>
            </div>

            {/* Right: Quick Stats Counter Badge */}
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-2xs text-xs text-slate-600 w-fit">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{totalCount}</span>
                <span className="text-slate-400 text-[11px]">Total Projects</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-slate-900">{activeCount}</span>
                <span className="text-slate-400 text-[11px]">Active</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="font-bold text-slate-900">{draftCount}</span>
                <span className="text-slate-400 text-[11px]">Draft</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-200" />
              <div className="flex items-center gap-1.5">
                <Archive className="w-3 h-3 text-slate-400" />
                <span className="font-bold text-slate-900">{archivedCount}</span>
                <span className="text-slate-400 text-[11px]">Archived</span>
              </div>
            </div>
          </div>

          {/* View Mode Toggle & Sort Control */}
          <div className="flex items-center justify-end gap-2 pt-1 pb-1">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-slate-700 font-medium hover:bg-slate-50 focus:outline-none cursor-pointer"
              >
                <option value="last_edited">Sort by: Last edited</option>
                <option value="name">Sort by: Name</option>
                <option value="nodes">Sort by: Node count</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* GRID VIEW: Project Cards (2 Columns x 3 Rows Matching Screenshot) */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onNavigateToCanvas(project.templateId)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400/80 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between relative"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        {renderProjectIcon(project.iconType)}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {project.name}
                            </h3>
                            {/* Status Badge */}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                                project.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : project.status === 'draft'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                  : project.status === 'paused'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  project.status === 'active'
                                    ? 'bg-emerald-500'
                                    : project.status === 'draft'
                                    ? 'bg-blue-500'
                                    : project.status === 'paused'
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                                }`}
                              />
                              <span className="capitalize">{project.status}</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                            {project.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Card Action Menu */}
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === project.id ? null : project.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === project.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white border border-slate-200 shadow-xl p-1 text-xs z-30 animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                onNavigateToCanvas(project.templateId);
                              }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                              <span>Open in Canvas</span>
                            </button>
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Duplicate Workflow</span>
                            </button>
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                              <span>Rename</span>
                            </button>
                            <div className="my-1 border-t border-slate-100" />
                            <button
                              onClick={() => setActiveMenuId(null)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Project</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual Mini Workflow Pipeline Container (Matching Screenshot) */}
                    <div className="mt-4 mb-4 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div className="flex items-center justify-between gap-1">
                        {project.pipeline.map((stage, idx) => (
                          <React.Fragment key={idx}>
                            <div className="flex flex-col items-center flex-1 text-center">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 shadow-2xs transition-transform group-hover:scale-105"
                                style={{ backgroundColor: stage.bg, color: stage.color }}
                              >
                                {renderPipelineIcon(stage.icon)}
                              </div>
                              <span className="text-[11px] font-medium text-slate-700 truncate w-full px-0.5">
                                {stage.name}
                              </span>
                            </div>

                            {/* Arrow Connection */}
                            {idx < project.pipeline.length - 1 && (
                              <div className="text-slate-300 -mt-4 text-xs font-bold">
                                →
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Metadata (Clock, Nodes, Connections) */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last edited: {project.lastEdited}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <LayoutGrid className="w-3 h-3 text-slate-400" />
                        <span>{project.nodeCount} nodes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-slate-400" />
                        <span>{project.connectionCount} connections</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* LIST VIEW TABLE */
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-4 font-medium">Project Name</th>
                    <th className="py-3 px-4 font-medium">Category</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">Nodes / Edges</th>
                    <th className="py-3 px-4 font-medium">Last Edited</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProjects.map((proj) => (
                    <tr
                      key={proj.id}
                      onClick={() => onNavigateToCanvas(proj.templateId)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        {renderProjectIcon(proj.iconType)}
                        <div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                            {proj.name}
                          </span>
                          <span className="text-[11px] text-slate-400">{proj.subtitle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{proj.category}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                            proj.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : proj.status === 'draft'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              proj.status === 'active'
                                ? 'bg-emerald-500'
                                : proj.status === 'draft'
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span className="capitalize">{proj.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {proj.nodeCount} nodes · {proj.connectionCount} links
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-medium">{proj.lastEdited}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToCanvas(proj.templateId);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-[11px] transition-colors"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR: Recent Activity & Project Templates (Matching Screenshot) */}
        <aside className="w-80 bg-white border-l border-slate-200/90 p-5 space-y-6 shrink-0 overflow-y-auto">
          {/* Card 1: Recent Activity */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent activity</h3>
              <button
                onClick={() => {}}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs ${act.iconBg}`}
                    >
                      <Icon className="w-3 h-3 stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-1">
                        <span className="font-bold text-slate-800 leading-tight block truncate">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {act.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {act.project}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Card 2: Project Templates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Project templates</h3>
              <button
                onClick={onOpenTemplates}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {projectTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => onNavigateToCanvas(tmpl.templateId)}
                  className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group flex items-start gap-3 shadow-2xs"
                >
                  {/* Mini visual diagram box (Matching Screenshot) */}
                  <div className="w-14 h-12 rounded-lg bg-white border border-slate-200/80 p-1 relative shrink-0 shadow-2xs overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 80 50">
                      {/* Lines between nodes */}
                      <line x1="16" y1="18" x2="48" y2="15" stroke="#CBD5E1" strokeWidth="1.5" />
                      <line x1="48" y1="15" x2="65" y2="28" stroke="#CBD5E1" strokeWidth="1.5" />
                      <line x1="35" y1="38" x2="65" y2="28" stroke="#CBD5E1" strokeWidth="1.5" />

                      {/* Circles for nodes */}
                      {tmpl.nodes.map((n, i) => (
                        <circle
                          key={i}
                          cx={n.x}
                          cy={n.y}
                          r="4.5"
                          fill={n.color}
                          stroke="#FFFFFF"
                          strokeWidth="1.5"
                        />
                      ))}
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-0.5 truncate">
                      {tmpl.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-1.5">
                      {tmpl.desc}
                    </p>
                    <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <span>Use template</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
        </div>
      </div>
    </div>
  );
};
