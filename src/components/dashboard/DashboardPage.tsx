import React, { useState } from 'react';
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
  User,
  Plus,
  ArrowRight,
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
  Truck,
  DollarSign,
  Megaphone,
  Coins,
  ExternalLink,
  Edit2,
  MoreHorizontal,
  Clock,
  Sparkles,
  MapPin,
  Workflow,
  ShoppingBag,
} from 'lucide-react';

import { AppSidebar } from '../navigation/AppSidebar';

interface DashboardPageProps {
  onNavigate?: (view: string, subItem?: string) => void;
  onNavigateToCanvas: (templateId?: string) => void;
  onNavigateToBoard?: () => void;
  onNavigateToProjects?: () => void;
  onNavigateToProducts?: () => void;
  onNavigateToResearch?: () => void;
  onNavigateToAds?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToOrders?: () => void;
  onNavigateToAutomation?: () => void;
  onNavigateToReports?: () => void;
  onNavigateToSettings?: () => void;
  onOpenNewProject: () => void;
  onOpenTemplates: () => void;
  currentCurrency?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onNavigateToCanvas,
  onNavigateToBoard,
  onNavigateToProjects,
  onNavigateToProducts,
  onNavigateToResearch,
  onNavigateToAds,
  onNavigateToAnalytics,
  onNavigateToOrders,
  onNavigateToAutomation,
  onNavigateToReports,
  onNavigateToSettings,
  onOpenNewProject,
  onOpenTemplates,
  currentCurrency = 'DZD',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const heroMountain = '/src/assets/images/dashboard_hero_mountain_1792688441880.jpg';
  const watchThumb = '/src/assets/images/garmin_smartwatch_product_1792688464563.jpg';

  const projects = [
    {
      id: 'p1',
      name: 'Algeria COD - Smart Watch',
      template: 'Complete OS',
      modified: '2 hours ago',
      status: 'Active',
      statusColor: 'emerald',
      iconColor: '#7C3AED',
      templateId: 'algeria_cod_complete_funnel',
    },
    {
      id: 'p2',
      name: 'Meta Ads - Sports Watches',
      template: 'Ads Analysis',
      modified: '5 hours ago',
      status: 'Active',
      statusColor: 'emerald',
      iconColor: '#2563EB',
      templateId: 'facebook_ads_analysis',
    },
    {
      id: 'p3',
      name: 'Portable Blender - New Product',
      template: 'Product Research',
      modified: '1 day ago',
      status: 'Draft',
      statusColor: 'blue',
      iconColor: '#0284C7',
      templateId: 'product_intelligence_pipeline',
    },
    {
      id: 'p4',
      name: 'COD Funnel - Algeria',
      template: 'COD Funnel',
      modified: '1 day ago',
      status: 'Active',
      statusColor: 'emerald',
      iconColor: '#EA580C',
      templateId: 'algeria_cod_complete_funnel',
    },
    {
      id: 'p5',
      name: 'Fashion Bags - Creative Test',
      template: 'Creative Testing',
      modified: '2 days ago',
      status: 'Paused',
      statusColor: 'amber',
      iconColor: '#E11D48',
      templateId: 'creative_testing_system',
    },
    {
      id: 'p6',
      name: 'Home & Kitchen - Research',
      template: 'Product Research',
      modified: '3 days ago',
      status: 'Draft',
      statusColor: 'blue',
      iconColor: '#7C3AED',
      templateId: 'product_intelligence_pipeline',
    },
  ];

  const handleSidebarNavigate = (view: string, subItem?: string) => {
    if (onNavigate) {
      onNavigate(view, subItem);
      return;
    }
    if (view === 'canvas') onNavigateToCanvas();
    else if (view === 'board') onNavigateToBoard ? onNavigateToBoard() : onNavigateToCanvas();
    else if (view === 'projects') onNavigateToProjects ? onNavigateToProjects() : onNavigateToCanvas();
    else if (view === 'products') onNavigateToProducts ? onNavigateToProducts() : onNavigateToCanvas();
    else if (view === 'research') onNavigateToResearch ? onNavigateToResearch() : onNavigateToCanvas();
    else if (view === 'templates') onOpenTemplates();
    else if (view === 'ads-library') onNavigateToAds ? onNavigateToAds() : onNavigateToCanvas();
    else if (view === 'analytics') onNavigateToAnalytics ? onNavigateToAnalytics() : onNavigateToCanvas();
    else if (view === 'orders-cod') onNavigateToOrders ? onNavigateToOrders() : onNavigateToCanvas();
    else if (view === 'automation') onNavigateToAutomation ? onNavigateToAutomation() : onNavigateToCanvas();
    else if (view === 'reports') onNavigateToReports ? onNavigateToReports() : onNavigateToCanvas();
    else if (view === 'settings') onNavigateToSettings ? onNavigateToSettings() : onNavigateToCanvas();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-900 select-none">
      {/* 1. UNIFIED LEFT NAVIGATION SIDEBAR */}
      <AppSidebar
        activeView="dashboard"
        onNavigate={handleSidebarNavigate}
        onOpenNewModal={onOpenNewProject}
      />

      {/* 2. MAIN DASHBOARD CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between gap-6 shrink-0 z-10 shadow-2xs">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects, nodes, products, or templates... Ctrl + K"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-14 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
              Ctrl + K
            </kbd>
          </div>

          {/* User & Actions Zone */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="w-[1px] h-6 bg-slate-200" />

            {/* Profile Pill: Yahia Pro User */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                Y
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">Yahia</span>
                <span className="text-[10px] text-slate-400 block">Pro User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* LEFT 3 COLUMNS: Banner + Quick Actions + Projects Table */}
            <div className="xl:col-span-3 space-y-6">
              {/* Welcome Scenic Banner (Matching image 1) */}
              <div className="relative rounded-3xl overflow-hidden shadow-md min-h-[260px] flex flex-col justify-between p-7 text-white">
                {/* Background image & gradient overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroMountain})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-transparent" />

                {/* Top welcome kicker */}
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-3 border border-white/20">
                    Welcome back, Yahia 👋
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white max-w-lg leading-tight">
                    Turn Ideas into Profits with Product Intelligence OS
                  </h2>
                  <p className="text-xs text-slate-200 mt-1 font-medium">
                    Research. Create. Advertise. Sell. Automate.
                  </p>
                </div>

                {/* 4 Feature Shortcut Pills */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  {[
                    { label: 'Product Research', desc: 'Find winning products', icon: Search, color: '#2563EB' },
                    { label: 'Meta Ads', desc: 'Analyze & create campaigns', icon: Video, color: '#3B82F6' },
                    { label: 'COD Operations', desc: 'Manage Algerian orders', icon: Package, color: '#EA580C' },
                    { label: 'AI Automation', desc: 'Let AI work for you', icon: Sparkles, color: '#8B5CF6' },
                  ].map((f) => {
                    const FIcon = f.icon;
                    return (
                      <div
                        key={f.label}
                        onClick={() => onNavigateToCanvas()}
                        className="p-3 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 border border-white/40 shadow-sm hover:bg-white hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-2.5"
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                          style={{ backgroundColor: f.color }}
                        >
                          <FIcon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold truncate leading-tight">{f.label}</h4>
                          <p className="text-[10px] text-slate-500 truncate">{f.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions (6 Cards matching image 1) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
                    <p className="text-xs text-slate-400">Start a new workflow or use a template to get going faster.</p>
                  </div>
                  <button
                    onClick={onOpenTemplates}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View all templates</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { title: 'Create New Project', desc: 'Build your own workflow from scratch', color: '#2563EB', icon: Plus, action: onOpenNewProject },
                    { title: 'Product Intelligence Pipeline', desc: 'Find & validate winning products', color: '#059669', icon: Search, action: () => onNavigateToCanvas('product_intelligence_pipeline') },
                    { title: 'Algeria COD Sales Funnel', desc: 'Complete sales workflow for Algeria', color: '#7C3AED', icon: ShoppingCart, action: () => onNavigateToCanvas('algeria_cod_complete_funnel') },
                    { title: 'Facebook Ads Analysis', desc: 'Analyze competitors & create creatives', color: '#EA580C', icon: Video, action: () => onNavigateToCanvas('facebook_ads_analysis') },
                    { title: 'Creative Testing System', desc: 'Test, improve, scale', color: '#0891B2', icon: Sparkles, action: () => onNavigateToCanvas('creative_testing_system') },
                    { title: 'Complete OS Template', desc: 'All-in-one e-commerce system', color: '#E11D48', icon: Layers, action: () => onNavigateToCanvas('algeria_cod_complete_funnel') },
                  ].map((card) => {
                    const CardIcon = card.icon;
                    return (
                      <div
                        key={card.title}
                        onClick={card.action}
                        className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white mb-3 shadow-2xs"
                            style={{ backgroundColor: card.color }}
                          >
                            <CardIcon className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                            {card.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed">
                            {card.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-2 border-t border-slate-100 flex justify-end">
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* My Projects Table (Matching screenshot 1) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">My Projects</h3>
                    <p className="text-xs text-slate-400">Your recent projects and workflows</p>
                  </div>
                  <button
                    onClick={() => (onNavigateToProjects ? onNavigateToProjects() : onNavigateToCanvas())}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Template</th>
                        <th className="pb-3 font-medium">Last Modified</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {projects.map((proj) => (
                        <tr
                          key={proj.id}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                          onClick={() => onNavigateToCanvas(proj.templateId)}
                        >
                          <td className="py-3 pr-4 flex items-center gap-2.5">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                              style={{ backgroundColor: proj.iconColor }}
                            >
                              <Layers className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {proj.name}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 font-medium">{proj.template}</td>
                          <td className="py-3 text-slate-400 font-medium">{proj.modified}</td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 w-fit ${
                                proj.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                  : proj.status === 'Draft'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  proj.status === 'Active'
                                    ? 'bg-emerald-500'
                                    : proj.status === 'Draft'
                                    ? 'bg-blue-500'
                                    : 'bg-amber-500'
                                }`}
                              />
                              {proj.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => onNavigateToCanvas(proj.templateId)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                                title="Open Canvas"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                              <button
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="Edit Name"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                title="More Actions"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Analytics Row (Performance spline + Donut + Top Products) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Performance Overview Spline */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Performance Overview</h4>
                      <p className="text-[10px] text-slate-400">Your business performance (last 7 days)</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-semibold">
                      <span className="flex items-center gap-1 text-blue-600">● Revenue</span>
                      <span className="flex items-center gap-1 text-emerald-600">● Orders</span>
                    </div>
                  </div>

                  {/* SVG Spline Chart */}
                  <div className="h-32 w-full pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                      <line x1="0" y1="85" x2="300" y2="85" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="0" y1="15" x2="300" y2="15" stroke="#F1F5F9" strokeWidth="1" />

                      {/* Revenue curve */}
                      <path
                        d="M 10 75 Q 50 45, 90 55 T 170 35 T 250 45 T 290 20"
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                      />
                      {/* Orders curve */}
                      <path
                        d="M 10 85 Q 50 65, 90 70 T 170 60 T 250 55 T 290 40"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2"
                      />

                      {/* Dots on points */}
                      <circle cx="10" cy="75" r="3" fill="#2563EB" />
                      <circle cx="90" cy="55" r="3" fill="#2563EB" />
                      <circle cx="170" cy="35" r="3" fill="#2563EB" />
                      <circle cx="250" cy="45" r="3" fill="#2563EB" />
                      <circle cx="290" cy="20" r="3" fill="#2563EB" />
                    </svg>
                    <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                      <span>Oct 11</span>
                      <span>Oct 12</span>
                      <span>Oct 13</span>
                      <span>Oct 14</span>
                      <span>Oct 15</span>
                      <span>Oct 16</span>
                      <span>Oct 17</span>
                    </div>
                  </div>
                </div>

                {/* 2. Order Status Donut */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">Order Status</h4>
                    <span className="text-[10px] text-slate-400">7 days</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3.5" strokeDasharray="50 100" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3B82F6" strokeWidth="3.5" strokeDasharray="25 100" strokeDashoffset="-50" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeDasharray="15 100" strokeDashoffset="-75" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeDasharray="10 100" strokeDashoffset="-90" />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-sm font-extrabold text-slate-900 block font-mono">124</span>
                        <span className="text-[8px] text-slate-400 block font-medium">Total Orders</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-1.5 text-[10px] text-slate-600">
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Delivered</span><strong className="font-mono">62 (50%)</strong></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Confirmed</span><strong className="font-mono">87 (70%)</strong></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending</span><strong className="font-mono">18 (15%)</strong></div>
                      <div className="flex justify-between items-center"><span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Failed</span><strong className="font-mono">7 (6%)</strong></div>
                    </div>
                  </div>
                </div>

                {/* 3. Top Products */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">Top Products</h4>
                    <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">View all →</button>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { rank: 1, name: 'Smart Watch', orders: 32, change: '↑ 24%' },
                      { rank: 2, name: 'Portable Blender', orders: 18, change: '↑ 16%' },
                      { rank: 3, name: 'Travel Bag', orders: 12, change: '↑ 12%' },
                      { rank: 4, name: 'Phone Case', orders: 9, change: '↑ 8%' },
                    ].map((p) => (
                      <div key={p.rank} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-4 text-[11px] font-bold text-slate-400 font-mono">{p.rank}</span>
                          <img src={watchThumb} alt={p.name} className="w-6 h-6 rounded object-cover border border-slate-200" />
                          <span className="font-bold text-slate-800 text-[11px] truncate">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono">{p.orders} orders</span>
                          <span className="text-[10px] font-semibold text-emerald-600 font-mono">{p.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Quick Stats + Recent Activity + Continue Working (Matching image 1) */}
            <div className="space-y-6">
              {/* Quick Stats Grid (Algeria • Last 7 days) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Quick Stats</h3>
                    <p className="text-[10px] text-slate-400">Algeria • Last 7 days</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-1.5">
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">Total Orders</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono">124</div>
                    <span className="text-[10px] font-semibold text-emerald-600">↑ 18%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">Confirmed Orders</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono">87</div>
                    <span className="text-[10px] font-semibold text-emerald-600">↑ 23%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">Delivered Orders</span>
                    <div className="text-base font-extrabold text-slate-900 font-mono">62</div>
                    <span className="text-[10px] font-semibold text-emerald-600">↑ 16%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">Revenue</span>
                    <div className="text-sm font-extrabold text-slate-900 font-mono">187,500 DZD</div>
                    <span className="text-[10px] font-semibold text-emerald-600">↑ 12%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5">
                      <Megaphone className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-medium">Ad Spend</span>
                    <div className="text-sm font-extrabold text-slate-900 font-mono">28,400 DZD</div>
                    <span className="text-[10px] font-semibold text-emerald-600">↑ 9%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <div className="w-6 h-6 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center mb-1.5">
                      <Coins className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] text-emerald-700 block font-medium">Net Profit</span>
                    <div className="text-sm font-extrabold text-emerald-800 font-mono">42,360 DZD</div>
                    <span className="text-[10px] font-semibold text-emerald-700">↑ 21%</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity (Matching image 1) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Recent Activity</h3>
                  <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">View all →</button>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { action: 'Node updated', desc: 'Meta Ads · Sports Watches', time: '2 hours ago', icon: Zap, color: '#2563EB' },
                    { action: 'Order confirmed', desc: 'Order #A1024 · 3,500 DZD', time: '3 hours ago', icon: CheckCircle2, color: '#10B981' },
                    { action: 'New product research', desc: 'Portable Blender', time: '5 hours ago', icon: Search, color: '#7C3AED' },
                    { action: 'Campaign launched', desc: 'Facebook Ads · Algeria', time: '1 day ago', icon: Megaphone, color: '#0284C7' },
                    { action: 'Delivery completed', desc: 'Order #A1018 · Wilaya 16', time: '1 day ago', icon: Truck, color: '#059669' },
                    { action: 'Project duplicated', desc: 'Fashion Bags · Creative Test', time: '2 days ago', icon: Layers, color: '#6366F1' },
                  ].map((act, i) => {
                    const ActIcon = act.icon;
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5"
                          style={{ backgroundColor: act.color }}
                        >
                          <ActIcon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-baseline">
                            <h5 className="font-bold text-slate-800 text-[11px] truncate">{act.action}</h5>
                            <span className="text-[9px] text-slate-400 font-medium shrink-0">{act.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">{act.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Continue Working (Matching image 1) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Continue Working</h3>
                  <button className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">View all →</button>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Algeria COD - Smart Watch', meta: '12 nodes · 3 connections', templateId: 'algeria_cod_complete_funnel' },
                    { title: 'Meta Ads - Sports Watches', meta: '8 nodes · 5 connections', templateId: 'facebook_ads_analysis' },
                    { title: 'Portable Blender - Research', meta: '6 nodes · 2 connections', templateId: 'product_intelligence_pipeline' },
                    { title: 'COD Funnel - Algeria', meta: '15 nodes · 9 connections', templateId: 'algeria_cod_complete_funnel' },
                  ].map((c, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2 hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={watchThumb}
                          alt={c.title}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 text-xs truncate leading-tight">{c.title}</h5>
                          <p className="text-[10px] text-slate-400 truncate">{c.meta}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateToCanvas(c.templateId)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-[11px] transition-colors shrink-0"
                      >
                        Continue
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
