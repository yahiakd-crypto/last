import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Megaphone,
  ShoppingBag,
  Users,
  Download,
  RotateCw,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Globe,
  PieChart,
  Target,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Search,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import { AppHeader } from '../navigation/AppHeader';

interface AnalyticsDashboardPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  activeSubItem?: string;
  onOpenSearchModal?: () => void;
  onOpenSettings?: () => void;
}

export const AnalyticsDashboardPage: React.FC<AnalyticsDashboardPageProps> = ({
  onNavigate,
  activeSubItem = 'overview',
  onOpenSearchModal,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'conversions' | 'roas'>(
    (activeSubItem as any) || 'overview'
  );
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'Custom'>('30D');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCountry, setCurrentCountry] = useState('Algeria');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<number | null>(8); // default to Oct 25
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Sparkline SVG helper generator
  const renderSparkline = (data: number[], strokeColor: string) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const width = 80;
    const height = 24;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / (max - min || 1)) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(' ');
    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Chart data points matching Screenshot 2: Oct 1 through Oct 31
  const chartPoints = [
    { date: 'Oct 1', revenue: 72000, orders: 92 },
    { date: 'Oct 4', revenue: 84000, orders: 110 },
    { date: 'Oct 7', revenue: 65000, orders: 85 },
    { date: 'Oct 10', revenue: 98000, orders: 130 },
    { date: 'Oct 13', revenue: 112000, orders: 145 },
    { date: 'Oct 16', revenue: 89000, orders: 118 },
    { date: 'Oct 19', revenue: 128000, orders: 168 },
    { date: 'Oct 22', revenue: 142000, orders: 182 },
    { date: 'Oct 25', revenue: 187500, orders: 214 }, // highlighted in screenshot
    { date: 'Oct 28', revenue: 136000, orders: 172 },
    { date: 'Oct 31', revenue: 195000, orders: 228 },
  ];

  const maxRevenue = 250000;
  const chartWidth = 620;
  const chartHeight = 180;

  // Build SVG path for revenue
  const revenuePoints = chartPoints.map((pt, idx) => {
    const x = (idx / (chartPoints.length - 1)) * chartWidth;
    const y = chartHeight - (pt.revenue / maxRevenue) * chartHeight;
    return { x, y, pt };
  });

  const revenuePath = revenuePoints.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Build SVG path for orders (scaled)
  const ordersPoints = chartPoints.map((pt, idx) => {
    const x = (idx / (chartPoints.length - 1)) * chartWidth;
    const y = chartHeight - (pt.orders / 250) * chartHeight;
    return { x, y, pt };
  });

  const ordersPath = ordersPoints.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    return `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Traffic sources breakdown data matching Screenshot 2
  const trafficSources = [
    { name: 'Facebook Ads', pct: 42.3, color: '#2563EB', visitors: 5280 },
    { name: 'Meta Organic', pct: 18.7, color: '#10B981', visitors: 2334 },
    { name: 'Direct', pct: 12.6, color: '#F59E0B', visitors: 1572 },
    { name: 'TikTok Ads', pct: 10.4, color: '#6366F1', visitors: 1298 },
    { name: 'Google Search', pct: 8.9, color: '#EF4444', visitors: 1110 },
    { name: 'Others', pct: 7.1, color: '#94A3B8', visitors: 888 },
  ];

  // Ad platforms performance data matching Screenshot 2
  const adPerformance = [
    {
      platform: 'Meta Ads (Facebook/Instagram)',
      spend: '14,280 DZD',
      clicks: '8,421',
      ctr: '2.8%',
      roas: '6.9',
      roasColor: 'text-emerald-600',
    },
    {
      platform: 'TikTok Ads',
      spend: '7,560 DZD',
      clicks: '4,210',
      ctr: '3.4%',
      roas: '7.2',
      roasColor: 'text-emerald-600',
    },
    {
      platform: 'Google Ads',
      spend: '3,240 DZD',
      clicks: '1,830',
      ctr: '2.1%',
      roas: '4.8',
      roasColor: 'text-amber-600',
    },
  ];

  // Top products table data matching Screenshot 2
  const topProducts = [
    {
      id: 1,
      name: 'Portable Blender',
      category: 'Kitchen',
      views: '4,820',
      addToCart: '892',
      conversionRate: '8.7%',
      revenue: '42,350 DZD',
      trend: [10, 14, 18, 15, 22, 28, 35],
      change: '+25%',
      thumb: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'LED Night Light Projector',
      category: 'Home & Living',
      views: '3,960',
      addToCart: '671',
      conversionRate: '7.3%',
      revenue: '31,780 DZD',
      trend: [12, 11, 15, 18, 19, 21, 24],
      change: '+18%',
      thumb: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Magnetic Phone Holder',
      category: 'Electronics',
      views: '2,845',
      addToCart: '512',
      conversionRate: '6.8%',
      revenue: '26,420 DZD',
      trend: [8, 10, 11, 13, 16, 17, 19],
      change: '+12%',
      thumb: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=100&h=100&fit=crop',
    },
    {
      id: 4,
      name: 'Smart Watch (Budget)',
      category: 'Electronics',
      views: '2,130',
      addToCart: '418',
      conversionRate: '5.9%',
      revenue: '21,560 DZD',
      trend: [7, 8, 9, 10, 11, 13, 14],
      change: '+9%',
      thumb: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
    },
    {
      id: 5,
      name: 'Hair Styling Brush',
      category: 'Beauty & Personal Care',
      views: '1,980',
      addToCart: '362',
      conversionRate: '5.1%',
      revenue: '18,900 DZD',
      trend: [6, 7, 7, 8, 9, 10, 11],
      change: '+7%',
      thumb: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* 1. Left Sidebar */}
      <AppSidebar
        activeView="analytics"
        activeSubItem={activeTab}
        onNavigate={onNavigate}
        onOpenNewModal={() => setIsExportModalOpen(true)}
      />

      {/* 2. Main Analytics Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <AppHeader
          breadcrumbs={[
            { label: 'Analytics', action: () => onNavigate('analytics') },
            {
              label:
                activeTab === 'overview'
                  ? 'Overview'
                  : activeTab === 'traffic'
                  ? 'Traffic'
                  : activeTab === 'conversions'
                  ? 'Conversions'
                  : 'Profit & ROAS',
              isCurrent: true,
            },
          ]}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSearchModal={onOpenSearchModal}
          currentCountry={currentCountry}
          onCountryChange={setCurrentCountry}
          dateRangeText="Oct 1, 2025 - Oct 31, 2025"
          onOpenSettings={onOpenSettings}
        />

        {/* Scrollable Analytics Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Header Title Row matching Screenshot 2 */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-1">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Analytics Dashboard
              </h1>
              <p className="text-xs text-slate-500">
                Track your performance, discover trends and make data-driven decisions.
              </p>
            </div>

            {/* Range Pills and Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 7D, 30D, 90D, Custom pill selector */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-200/80 border border-slate-200 text-xs font-semibold">
                {(['7D', '30D', '90D', 'Custom'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      timeRange === r
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Export Report Button */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Report</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Sub-tabs Row (Overview, Traffic, Conversions, Profit & ROAS) */}
          <div className="flex items-center gap-1 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('traffic')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'traffic'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Traffic
            </button>
            <button
              onClick={() => setActiveTab('conversions')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'conversions'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Conversions
            </button>
            <button
              onClick={() => setActiveTab('roas')}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'roas'
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Profit & ROAS
            </button>
          </div>

          {/* Top 5 Metric Cards with Sparklines (Matching Screenshot 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. Total Orders */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span>↑ 18%</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Total Orders</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">1,248</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[9px] text-slate-400">vs. previous 30 days</span>
                {renderSparkline([12, 15, 14, 18, 16, 22, 28], '#2563EB')}
              </div>
            </div>

            {/* 2. Total Revenue */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span>↑ 23%</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Total Revenue</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">187,500 DZD</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[9px] text-slate-400">vs. previous 30 days</span>
                {renderSparkline([100, 110, 105, 125, 135, 160, 187], '#10B981')}
              </div>
            </div>

            {/* 3. Ad Spend */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span>↑ 12%</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Ad Spend</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">28,400 DZD</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[9px] text-slate-400">vs. previous 30 days</span>
                {renderSparkline([18, 20, 22, 21, 24, 26, 28], '#A855F7')}
              </div>
            </div>

            {/* 4. ROAS */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span>↑ 28%</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">ROAS</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">6.61</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[9px] text-slate-400">vs. previous 30 days</span>
                {renderSparkline([4.5, 4.8, 5.2, 5.6, 5.9, 6.2, 6.6], '#F59E0B')}
              </div>
            </div>

            {/* 5. Conversion Rate */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5">
                  <span>↑ 21%</span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">Conversion Rate</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">3.8%</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[9px] text-slate-400">vs. previous 30 days</span>
                {renderSparkline([2.8, 2.9, 3.1, 3.3, 3.4, 3.6, 3.8], '#06B6D4')}
              </div>
            </div>
          </div>

          {/* Middle Row: Line Chart + Donut Chart + Right Insights Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left 2 Cols: Charts Container */}
            <div className="xl:col-span-2 space-y-5">
              {/* Card 1: Revenue & Orders Chart */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Revenue & Orders</h3>
                    <p className="text-[11px] text-slate-400">
                      Track your sales and order trends over time.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Legend */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                        <span className="font-medium">Revenue (DZD)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="font-medium">Orders</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span>Last 30 days</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Interactive SVG Chart */}
                <div className="relative pt-4">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-4 bottom-8 flex flex-col justify-between text-[10px] text-slate-400 font-mono">
                    <span>250K</span>
                    <span>200K</span>
                    <span>150K</span>
                    <span>100K</span>
                    <span>50K</span>
                    <span>0</span>
                  </div>

                  {/* Main SVG Plot */}
                  <div className="ml-10 h-52 relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-b border-slate-100 w-full" />
                      <div className="border-b border-slate-100 w-full" />
                      <div className="border-b border-slate-100 w-full" />
                      <div className="border-b border-slate-100 w-full" />
                      <div className="border-b border-slate-100 w-full" />
                      <div className="border-b border-slate-200 w-full" />
                    </div>

                    <svg
                      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                      className="w-full h-full overflow-visible"
                    >
                      {/* Gradient fill under revenue */}
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      <path
                        d={`${revenuePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                        fill="url(#revGrad)"
                      />

                      {/* Orders curve */}
                      <path
                        d={ordersPath}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Revenue curve */}
                      <path
                        d={revenuePath}
                        fill="none"
                        stroke="#2563EB"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Plot Markers */}
                      {revenuePoints.map((pt, idx) => (
                        <g key={idx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredChartPoint === idx ? 5 : 3}
                            className={`cursor-pointer transition-all ${
                              hoveredChartPoint === idx
                                ? 'fill-blue-600 stroke-4 stroke-blue-100'
                                : 'fill-blue-600'
                            }`}
                            onMouseEnter={() => setHoveredChartPoint(idx)}
                          />
                        </g>
                      ))}
                    </svg>

                    {/* Interactive Tooltip matching Screenshot 2 (e.g. Oct 25) */}
                    {hoveredChartPoint !== null && (
                      <div
                        className="absolute pointer-events-none -top-1 transform -translate-x-1/2 bg-slate-900 text-white rounded-xl px-3 py-2 text-xs shadow-xl z-20"
                        style={{
                          left: `${(hoveredChartPoint / (chartPoints.length - 1)) * 100}%`,
                        }}
                      >
                        <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                          {chartPoints[hoveredChartPoint].date}, 2025
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="font-bold">
                            Revenue: {chartPoints[hoveredChartPoint].revenue.toLocaleString()} DZD
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>Orders: {chartPoints[hoveredChartPoint].orders}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* X-axis date labels */}
                  <div className="ml-10 flex justify-between text-[10px] text-slate-400 font-medium pt-2">
                    {chartPoints.map((pt, i) => (
                      <span key={i}>{pt.date}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Traffic Sources Donut Chart */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Traffic Sources</h3>
                  <p className="text-[11px] text-slate-400">Where your visitors come from.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                  {/* SVG Donut */}
                  <div className="relative flex items-center justify-center h-44">
                    <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
                      {/* Segment 1: Facebook Ads 42.3% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#2563EB"
                        strokeWidth="14"
                        strokeDasharray="101 238"
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: Meta Organic 18.7% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#10B981"
                        strokeWidth="14"
                        strokeDasharray="44 238"
                        strokeDashoffset="-101"
                      />
                      {/* Segment 3: Direct 12.6% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#F59E0B"
                        strokeWidth="14"
                        strokeDasharray="30 238"
                        strokeDashoffset="-145"
                      />
                      {/* Segment 4: TikTok Ads 10.4% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#6366F1"
                        strokeWidth="14"
                        strokeDasharray="25 238"
                        strokeDashoffset="-175"
                      />
                      {/* Segment 5: Google Search 8.9% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#EF4444"
                        strokeWidth="14"
                        strokeDasharray="21 238"
                        strokeDashoffset="-200"
                      />
                      {/* Segment 6: Others 7.1% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#94A3B8"
                        strokeWidth="14"
                        strokeDasharray="17 238"
                        strokeDashoffset="-221"
                      />
                    </svg>

                    {/* Donut Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-base font-bold text-slate-900 leading-tight">12,482</span>
                      <span className="text-[10px] text-slate-400 font-medium">Total Visitors</span>
                    </div>
                  </div>

                  {/* Traffic Sources Legend */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                    {trafficSources.map((src) => (
                      <div key={src.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: src.color }}
                          />
                          <span className="text-slate-600 truncate">{src.name}</span>
                        </div>
                        <span className="font-bold text-slate-800 ml-1">{src.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: AI Insights + Top Products + Recent Activity */}
            <div className="space-y-5">
              {/* Card 3: Insights & Recommendations (AI Powered) */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900">
                      Insights & Recommendations
                    </h3>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-100">
                    AI Powered
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Insight 1 */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600">
                          ROAS increased by 28%
                        </h4>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-4">
                      Your advertising is performing better than last month. Keep scaling!
                    </p>
                  </div>

                  {/* Insight 2 */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600">
                          Facebook Ads is your top source
                        </h4>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-4">
                      42.3% of total traffic. Consider increasing budget by 10–20%.
                    </p>
                  </div>

                  {/* Insight 3 */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <h4 className="font-bold text-slate-800 group-hover:text-blue-600">
                          Best performing product
                        </h4>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-4">
                      Portable Blender (Conversion rate: 8.7%).
                    </p>
                  </div>

                  {/* Insight 4 */}
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 hover:border-rose-200 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                        <h4 className="font-bold text-rose-800">
                          RTO rate is high
                        </h4>
                      </div>
                      <ArrowRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-rose-700/80 mt-1 pl-5">
                      12.4% of orders are returned. Check product quality and descriptions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 4: Top Products by Revenue */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Top Products by Revenue</h3>
                  <button className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5">
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2">
                  {topProducts.slice(0, 5).map((prod) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 w-3">{prod.id}</span>
                        <img
                          src={prod.thumb}
                          alt={prod.name}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="truncate">
                          <span className="text-xs font-semibold text-slate-800 block truncate">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{prod.revenue}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600">{prod.change}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Recent Activity */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Recent Activity</h3>
                  <button className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5">
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShoppingCart className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">New order #ORD-4587</p>
                      <span className="text-[10px] text-slate-400">2 minutes ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Ad campaign completed: Meta Ads - Product Campaign
                      </p>
                      <span className="text-[10px] text-slate-400">18 minutes ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        New page added: TechZone - Facebook Ad Library
                      </p>
                      <span className="text-[10px] text-slate-400">1 hour ago</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShoppingBag className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        New product saved: Portable Blender
                      </p>
                      <span className="text-[10px] text-slate-400">2 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Ad Performance Table + Conversions Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Card: Ad Performance */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ad Performance</h3>
                  <p className="text-[11px] text-slate-400">
                    Compare your advertising performance across platforms.
                  </p>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5">
                  <span>View details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-semibold">
                      <th className="pb-2">Platform</th>
                      <th className="pb-2">Spend</th>
                      <th className="pb-2">Clicks</th>
                      <th className="pb-2">CTR</th>
                      <th className="pb-2">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adPerformance.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 font-medium text-slate-800">{item.platform}</td>
                        <td className="py-2.5 text-slate-600">{item.spend}</td>
                        <td className="py-2.5 text-slate-600">{item.clicks}</td>
                        <td className="py-2.5 text-slate-600">{item.ctr}</td>
                        <td className={`py-2.5 font-bold ${item.roasColor}`}>{item.roas}</td>
                      </tr>
                    ))}
                    {/* Total Row */}
                    <tr className="bg-slate-50 font-bold border-t border-slate-200">
                      <td className="py-2.5 text-slate-900">Total</td>
                      <td className="py-2.5 text-slate-900">28,400 DZD</td>
                      <td className="py-2.5 text-slate-900">14,461</td>
                      <td className="py-2.5 text-slate-900">2.8%</td>
                      <td className="py-2.5 text-emerald-600">6.6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card: Conversions Funnel */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Conversions Funnel</h3>
                <p className="text-[11px] text-slate-400">From visitors to customers.</p>
              </div>

              {/* Funnel Visual Stack */}
              <div className="space-y-2 pt-2">
                {/* 1. Visitors */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Visitors</span>
                    <span className="font-bold text-slate-900">12,482 (100%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full w-full" />
                  </div>
                </div>

                {/* 2. Product Views */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Product Views</span>
                    <span className="font-bold text-slate-900">5,832 (46.7%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full w-[46.7%]" />
                  </div>
                </div>

                {/* 3. Add to Cart */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Add to Cart</span>
                    <span className="font-bold text-slate-900">2,104 (16.9%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full w-[16.9%]" />
                  </div>
                </div>

                {/* 4. Checkout */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Checkout</span>
                    <span className="font-bold text-slate-900">1,047 (8.4%)</span>
                  </div>
                  <div className="h-3 rounded-full bg-blue-100 overflow-hidden">
                    <div className="h-full bg-blue-300 rounded-full w-[8.4%]" />
                  </div>
                </div>

                {/* 5. Orders Overall */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between mt-3">
                  <div>
                    <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider block">
                      Conversion Rate
                    </span>
                    <span className="text-xl font-bold text-emerald-800">3.8%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700">1,248 Orders</span>
                    <span className="text-[10px] text-emerald-600 block">↑ 21% vs previous 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Table: Top Performing Pages / Products (Matching Screenshot 2) */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Top Performing Pages / Products</h3>
                <p className="text-[11px] text-slate-400">
                  Performance breakdown of your leading inventory and sales funnels.
                </p>
              </div>
              <button className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5">
                <span>View all products</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[11px] font-semibold">
                    <th className="pb-2 w-8">#</th>
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Category</th>
                    <th className="pb-2">Page Views</th>
                    <th className="pb-2">Add to Cart</th>
                    <th className="pb-2">Conversion Rate</th>
                    <th className="pb-2">Revenue</th>
                    <th className="pb-2">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {topProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-400">{p.id}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.thumb}
                            alt={p.name}
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                          />
                          <span className="font-semibold text-slate-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500">{p.category}</td>
                      <td className="py-3 text-slate-700 font-medium">{p.views}</td>
                      <td className="py-3 text-slate-700 font-medium">{p.addToCart}</td>
                      <td className="py-3 font-bold text-slate-800">{p.conversionRate}</td>
                      <td className="py-3 font-bold text-slate-900">{p.revenue}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-600">{p.change}</span>
                          {renderSparkline(p.trend, '#10B981')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Export Analytics Report</h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Download complete order metrics, Algeria COD delivery statistics, and ad campaign ROAS tables.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const csvData = 'Metric,Value\nRevenue,420000 DZD\nOrders,158\nDelivery Rate,76%\nROAS,3.8x\n';
                  const blob = new Blob([csvData], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `analytics-report-${Date.now()}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                  setIsExportModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download as CSV</span>
              </button>

              <button
                onClick={() => {
                  const docData = `Product Intelligence OS - Executive Summary\nGenerated: ${new Date().toISOString()}\nTotal Revenue: 4,200,000 DZD\nDelivered Rate: 76%\nConfirmation Rate: 84%\n`;
                  const blob = new Blob([docData], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `executive-summary-${Date.now()}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                  setIsExportModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-white" />
                <span>Download Executive Summary</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
