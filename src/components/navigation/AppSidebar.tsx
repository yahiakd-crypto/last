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
  ChevronDown,
  TrendingUp,
  Play,
  Link,
  Target,
  PieChart,
  Globe,
  DollarSign,
  Workflow,
  ShoppingBag,
  Code,
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  Plus,
  Calculator,
  ExternalLink,
} from 'lucide-react';
import { ServicesMenuDropdown } from './ServicesMenuDropdown';

export interface AppSidebarProps {
  activeView: string;
  activeSubItem?: string;
  onNavigate: (view: string, subItem?: string) => void;
  onOpenNewModal?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeView,
  activeSubItem,
  onNavigate,
  onOpenNewModal,
}) => {
  const [isAdsExpanded, setIsAdsExpanded] = useState(activeView === 'ads-library');
  const [isAnalyticsExpanded, setIsAnalyticsExpanded] = useState(activeView === 'analytics');

  const getPromoContent = () => {
    if (activeView === 'ads-library') {
      return {
        icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
        title: 'Track Competitors Like a Pro',
        description: 'Save ads, pages and monitor new launches automatically with Product Intelligence OS.',
        buttonLabel: 'Save New Ad / Page',
        action: () => onNavigate('ads-library', 'save'),
      };
    }
    if (activeView === 'analytics') {
      return {
        icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
        title: 'Turn Data into Profits',
        description: 'Discover insights, track trends, and optimize your e-commerce business faster.',
        buttonLabel: 'Create Report',
        action: () => onNavigate('reports', 'new'),
      };
    }
    return {
      icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
      title: 'Grow Your E-commerce Business',
      description: 'Discover products, analyze competitors, create campaigns, track orders and maximize profit — all in one place.',
      buttonLabel: 'Start a New Project',
      action: () => (onOpenNewModal ? onOpenNewModal() : onNavigate('projects')),
    };
  };

  const promo = getPromoContent();

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 select-none z-20 shadow-2xs text-slate-800">
      {/* Top Branding & Services Menu (Matches Punchline logo and services dropdown) */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 relative z-30 bg-white">
        <ServicesMenuDropdown
          currentView={activeView}
          onNavigate={onNavigate}
        />
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {/* 1. Home / Dashboard */}
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home className={`w-4 h-4 ${activeView === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Home</span>
          </button>

          {/* 2. Board */}
          <button
            type="button"
            onClick={() => onNavigate('board')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'board' && !activeSubItem
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Workflow className={`w-4 h-4 ${activeView === 'board' && !activeSubItem ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Board</span>
          </button>

          {/* Direct Page (Studio Edit Mode) */}
          <button
            type="button"
            id="btn-sidebar-direct-page-studio-edit"
            onClick={() => {
              window.location.href = '/fb-ads.html';
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/90 shadow-2xs"
            title="Open selected page directly as a top-level document (Zero iframes) so Google AI Studio's native Edit mode can select any element"
          >
            <div className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4 text-emerald-600" />
              <span>Studio Edit Mode</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[9px] font-extrabold">
              DIRECT
            </span>
          </button>

          {/* 3. Projects */}
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'projects'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FolderKanban className={`w-4 h-4 ${activeView === 'projects' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Projects</span>
          </button>

          {/* 4. Products */}
          <button
            type="button"
            onClick={() => onNavigate('products')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'products'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className={`w-4 h-4 ${activeView === 'products' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Products</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-mono text-[9.5px] font-bold border border-blue-200">
              DZ COD
            </span>
          </button>

          {/* 5. Templates */}
          <button
            type="button"
            onClick={() => onNavigate('templates')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'templates'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className={`w-4 h-4 ${activeView === 'templates' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Templates</span>
          </button>

          {/* 6. Canvas */}
          <button
            type="button"
            onClick={() => onNavigate('canvas')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'canvas'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${activeView === 'canvas' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Canvas</span>
          </button>

          {/* 7. Product Research */}
          <button
            type="button"
            onClick={() => onNavigate('research')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'research'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className={`w-4 h-4 ${activeView === 'research' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Product Research</span>
          </button>

          {/* 8. Ads Library */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onNavigate('ads-library', 'videos');
                setIsAdsExpanded(!isAdsExpanded);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'ads-library'
                  ? 'bg-blue-50 text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Video className={`w-4 h-4 ${activeView === 'ads-library' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Ads Library</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isAdsExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {isAdsExpanded && (
              <div className="ml-5 pl-3 border-l border-slate-200 space-y-1 py-1">
                <button
                  type="button"
                  onClick={() => onNavigate('ads-library', 'videos')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeView === 'ads-library' && (!activeSubItem || activeSubItem === 'videos')
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Play className="w-3 h-3 text-slate-400" />
                  <span>Ads / Videos</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('ads-library', 'pages')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeView === 'ads-library' && activeSubItem === 'pages'
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Link className="w-3 h-3 text-slate-400" />
                  <span>Saved Pages</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('ads-library', 'competitor')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeView === 'ads-library' && activeSubItem === 'competitor'
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Target className="w-3 h-3 text-slate-400" />
                  <span>Competitor Ads</span>
                </button>
              </div>
            )}
          </div>

          {/* 8.5 Ad Tracker (Directly below Ads Library) */}
          <button
            type="button"
            onClick={() => onNavigate('ad-tracker')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'ad-tracker'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart2 className={`w-4 h-4 ${activeView === 'ad-tracker' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Ad Tracker</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-100/90 text-blue-600 text-[10px] font-bold leading-none">
              New
            </span>
          </button>

          {/* 9. Analytics */}
          <div className="space-y-0.5">
            <button
              type="button"
              onClick={() => {
                onNavigate('analytics', 'overview');
                setIsAnalyticsExpanded(!isAnalyticsExpanded);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-blue-50 text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart2 className={`w-4 h-4 ${activeView === 'analytics' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>Analytics</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isAnalyticsExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </button>

            {isAnalyticsExpanded && (
              <div className="ml-5 pl-3 border-l border-slate-200 space-y-1 py-1">
                <button
                  type="button"
                  onClick={() => onNavigate('analytics', 'overview')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeView === 'analytics' && (!activeSubItem || activeSubItem === 'overview')
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <PieChart className="w-3 h-3 text-slate-400" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('analytics', 'traffic')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeView === 'analytics' && activeSubItem === 'traffic'
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-3 h-3 text-slate-400" />
                  <span>Traffic</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('analytics', 'conversions')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeView === 'analytics' && activeSubItem === 'conversions'
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Target className="w-3 h-3 text-slate-400" />
                  <span>Conversions</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('analytics', 'roas')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    activeView === 'analytics' && activeSubItem === 'roas'
                      ? 'bg-blue-50/80 text-blue-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <DollarSign className="w-3 h-3 text-slate-400" />
                  <span>Profit & ROAS</span>
                </button>
              </div>
            )}
          </div>

          {/* 10. Orders & COD */}
          <button
            type="button"
            onClick={() => onNavigate('orders-cod')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'orders-cod'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Package className={`w-4 h-4 ${activeView === 'orders-cod' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Orders & COD</span>
          </button>

          {/* 10.5. Breakdown (Margin & CPA Calculator) */}
          <button
            type="button"
            onClick={() => onNavigate('breakdown')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'breakdown'
                ? 'bg-emerald-50 text-emerald-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calculator className={`w-4 h-4 ${activeView === 'breakdown' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Breakdown & CPA</span>
          </button>

          {/* 10.6. Global Sourcing */}
          <button
            type="button"
            onClick={() => onNavigate('sourcing')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'sourcing'
                ? 'bg-emerald-50 text-emerald-600 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className={`w-4 h-4 ${activeView === 'sourcing' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Global Sourcing</span>
          </button>

          {/* 11. Automation */}
          <button
            type="button"
            onClick={() => onNavigate('automation')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'automation'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap className={`w-4 h-4 ${activeView === 'automation' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Automation</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold text-[10px] leading-none">
              2
            </span>
          </button>

          {/* 12. Reports */}
          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'reports'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeView === 'reports' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Reports</span>
          </button>

          {/* 13. Settings */}
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'settings'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className={`w-4 h-4 ${activeView === 'settings' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Settings</span>
          </button>

          {/* Creative Studio Apps Section */}
          <div className="pt-2 pb-1 px-3 flex items-center justify-between border-t border-slate-100 mt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Creative Apps
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
              5 APPS
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('landing-page')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeView === 'landing-page' ||
              ((activeSubItem === 'landing-page' || activeSubItem === 'lanidng-page') && activeView === 'board')
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles
                className={`w-4 h-4 ${
                  activeView === 'landing-page' ||
                  ((activeSubItem === 'landing-page' || activeSubItem === 'lanidng-page') && activeView === 'board')
                    ? 'text-blue-600'
                    : 'text-slate-400'
                }`}
              />
              <span className="truncate">Landing Page</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-mono text-[9px] font-bold border border-blue-200">
              AI LP
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('board', 'regrouper')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubItem === 'regrouper' && activeView === 'board'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Workflow
                className={`w-4 h-4 ${
                  activeSubItem === 'regrouper' && activeView === 'board' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate">Regroupe Product</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-600 font-mono text-[9px] font-bold border border-violet-200">
              ORG
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('board', 'text-to-code-lp')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubItem === 'text-to-code-lp' && activeView === 'board'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Code
                className={`w-4 h-4 ${
                  activeSubItem === 'text-to-code-lp' && activeView === 'board' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate">Text to Code LP</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 font-mono text-[9px] font-bold border border-rose-200">
              CODE
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('board', 'text-to-image-lp')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubItem === 'text-to-image-lp' && activeView === 'board'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ImageIcon
                className={`w-4 h-4 ${
                  activeSubItem === 'text-to-image-lp' && activeView === 'board' ? 'text-blue-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate">Text to Image LP</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 font-mono text-[9px] font-bold border border-purple-200">
              IMG
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('board', 'cro-mobile-lp')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              (activeSubItem === 'cro-mobile-lp' || activeSubItem === 'cro_mobile_landing_page') && activeView === 'board'
                ? 'bg-blue-50 text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Smartphone
                className={`w-4 h-4 ${
                  (activeSubItem === 'cro-mobile-lp' || activeSubItem === 'cro_mobile_landing_page') && activeView === 'board'
                    ? 'text-blue-600'
                    : 'text-slate-400'
                }`}
              />
              <span className="truncate">CRO Mobile LP</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-mono text-[9px] font-bold border border-blue-200">
              CRO DZ
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Promo Card matching the Home Dashboard exactly */}
      <div className="p-3 shrink-0">
        <div className="p-4 rounded-2xl bg-[#0F172A] text-white shadow-xl relative overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
            {promo.icon}
          </div>
          <h3 className="text-xs font-bold leading-tight mb-1 text-white">
            {promo.title}
          </h3>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
            {promo.description}
          </p>
          <button
            type="button"
            onClick={promo.action}
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{promo.buttonLabel}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
