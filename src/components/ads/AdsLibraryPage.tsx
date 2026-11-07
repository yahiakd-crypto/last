import React, { useState } from 'react';
import {
  Video,
  Play,
  Pause,
  Link as LinkIcon,
  Filter,
  Calendar,
  Plus,
  Eye,
  MessageSquare,
  TrendingUp,
  MoreVertical,
  X,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Users,
  Clock,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  List,
  Shield,
  Layers,
  ArrowRight,
  Maximize2,
  Download,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import { AppHeader } from '../navigation/AppHeader';

interface AdsLibraryPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  activeSubItem?: string;
  onOpenSearchModal?: () => void;
  onOpenSettings?: () => void;
}

export interface AdVideoItem {
  id: string;
  title: string;
  brand: string;
  brandDomain: string;
  brandAvatar: string;
  platform: string;
  status: string;
  daysAgo: string;
  firstSeen: string;
  lastSeen: string;
  duration: string;
  durationSeconds: number;
  reach: string;
  engagement: string;
  ctr: string;
  thumbnail: string;
  videoUrl?: string;
  isSaved: boolean;
  targeting: {
    country: string;
    age: string;
    interests: string[];
  };
  insights: {
    hookRetention: string;
    topAudience: string;
    mainCta: string;
  };
}

export interface SavedPageItem {
  id: string;
  brand: string;
  domain: string;
  title: string;
  lastSeen: string;
  newAdsCount: number;
  thumbnail: string;
  isNew: boolean;
}

export const AdsLibraryPage: React.FC<AdsLibraryPageProps> = ({
  onNavigate,
  activeSubItem = 'videos',
  onOpenSearchModal,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'pages'>(
    activeSubItem === 'pages' ? 'pages' : 'videos'
  );
  const [sortOption, setSortOption] = useState<'newest' | 'reach' | 'ctr'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCountry, setCurrentCountry] = useState('Algeria');

  // Ad Details right sidebar drawer state
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [selectedAdId, setSelectedAdId] = useState<string>('ad-1');

  // Interactive video play simulation
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(35);

  // New Ad Modal
  const [isSaveAdModalOpen, setIsSaveAdModalOpen] = useState(false);
  const [newAdUrl, setNewAdUrl] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [fullAnalysisModalOpen, setFullAnalysisModalOpen] = useState(false);
  const [previewPageItem, setPreviewPageItem] = useState<SavedPageItem | null>(null);

  // High quality realistic Algerian e-commerce video ads
  const [ads, setAds] = useState<AdVideoItem[]>([
    {
      id: 'ad-1',
      title: 'Montre connectée ultra complète pour votre quotidien ! ⌚',
      brand: 'TechZone',
      brandDomain: 'techzone-dz.com',
      brandAvatar: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      platform: 'Meta',
      status: 'Active',
      daysAgo: '2 days ago',
      firstSeen: '2 days ago',
      lastSeen: 'Active',
      duration: '0:28',
      durationSeconds: 28,
      reach: '4.2M',
      engagement: '28K',
      ctr: '1.2%',
      thumbnail: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop',
      isSaved: true,
      targeting: {
        country: 'Algeria',
        age: '18 - 55',
        interests: ['Fitness', 'Technology', 'Watches'],
      },
      insights: {
        hookRetention: 'The hook (first 3 seconds) gets 72% retention.',
        topAudience: 'Top audience: 25-34 years old (41%).',
        mainCta: 'The main CTA is "Acheter Maintenant".',
      },
    },
    {
      id: 'ad-2',
      title: 'Une peau plus douce, plus claire, au naturel 🌿',
      brand: 'PureSkin',
      brandDomain: 'pureskin-dz.com',
      brandAvatar: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
      platform: 'Meta',
      status: 'Active',
      daysAgo: '3 days ago',
      firstSeen: '3 days ago',
      lastSeen: 'Active',
      duration: '0:20',
      durationSeconds: 20,
      reach: '3.8M',
      engagement: '24K',
      ctr: '0.9%',
      thumbnail: 'https://images.unsplash.com/photo-1608248597359-0081f969eb2e?w=800&h=800&fit=crop',
      isSaved: false,
      targeting: {
        country: 'Algeria',
        age: '20 - 45',
        interests: ['Organic Beauty', 'Skincare', 'Dermatology'],
      },
      insights: {
        hookRetention: 'UGC morning routine hook captures 68% retention.',
        topAudience: 'Top audience: 22-38 years old (64% female).',
        mainCta: 'The main CTA is "Commander via WhatsApp".',
      },
    },
    {
      id: 'ad-3',
      title: 'Aspirateur sans fil puissant 🔥 Nettoyage facile et rapide !',
      brand: 'HomeClean',
      brandDomain: 'homeclean-dz.com',
      brandAvatar: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop',
      platform: 'Meta',
      status: 'Active',
      daysAgo: '4 days ago',
      firstSeen: '4 days ago',
      lastSeen: 'Active',
      duration: '0:32',
      durationSeconds: 32,
      reach: '5.1M',
      engagement: '40K',
      ctr: '1.4%',
      thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&h=800&fit=crop',
      isSaved: true,
      targeting: {
        country: 'Algeria',
        age: '24 - 60',
        interests: ['Home Appliances', 'Kitchen', 'Cleaning'],
      },
      insights: {
        hookRetention: 'Problem-solving mess demonstration achieves 79% retention.',
        topAudience: 'Top audience: 28-50 years old (52% male, 48% female).',
        mainCta: 'The main CTA is "Livraison Gratuite 58 Wilayas".',
      },
    },
    {
      id: 'ad-4',
      title: 'Style unique pour tous les jours 👕 Livraison rapide !',
      brand: 'UrbanStyle',
      brandDomain: 'urbanstyle-dz.com',
      brandAvatar: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=100&h=100&fit=crop',
      platform: 'Meta',
      status: 'Active',
      daysAgo: '5 days ago',
      firstSeen: '5 days ago',
      lastSeen: 'Active',
      duration: '0:13',
      durationSeconds: 13,
      reach: '2.3M',
      engagement: '18K',
      ctr: '0.8%',
      thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=800&fit=crop',
      isSaved: false,
      targeting: {
        country: 'Algeria',
        age: '18 - 30',
        interests: ['Streetwear', 'Sneakers', 'Fashion'],
      },
      insights: {
        hookRetention: 'Fast-cut cinematic transition yields 64% retention.',
        topAudience: 'Top audience: 18-26 years old (72% male).',
        mainCta: 'The main CTA is "Commander Maintenant".',
      },
    },
    {
      id: 'ad-5',
      title: 'Le goût authentique chez vous 🍗 Commandez maintenant',
      brand: 'FoodExpress',
      brandDomain: 'foodexpress-dz.com',
      brandAvatar: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
      platform: 'Meta',
      status: 'Active',
      daysAgo: '6 days ago',
      firstSeen: '6 days ago',
      lastSeen: 'Active',
      duration: '0:25',
      durationSeconds: 25,
      reach: '4.7M',
      engagement: '38K',
      ctr: '1.2%',
      thumbnail: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=800&h=800&fit=crop',
      isSaved: true,
      targeting: {
        country: 'Algeria',
        age: '18 - 45',
        interests: ['Fast Food', 'Restaurants', 'Delivery'],
      },
      insights: {
        hookRetention: 'Crispy sizzle sound hook holds 75% retention.',
        topAudience: 'Top audience: 20-35 years old in Algiers, Oran, Blida.',
        mainCta: 'The main CTA is "Commander en 1 Clic".',
      },
    },
    {
      id: 'ad-6',
      title: 'Perdez du poids naturellement et durablement',
      brand: 'SlimLife',
      brandDomain: 'slimlife-dz.com',
      brandAvatar: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=100&h=100&fit=crop',
      platform: 'Meta',
      status: 'Active',
      daysAgo: '7 days ago',
      firstSeen: '7 days ago',
      lastSeen: 'Active',
      duration: '0:18',
      durationSeconds: 18,
      reach: '3.3M',
      engagement: '21K',
      ctr: '0.9%',
      thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=800&fit=crop',
      isSaved: false,
      targeting: {
        country: 'Algeria',
        age: '22 - 50',
        interests: ['Weight Loss', 'Fitness Training', 'Wellness'],
      },
      insights: {
        hookRetention: 'Transformation split-screen captures 70% retention.',
        topAudience: 'Top audience: 25-45 years old (58% female).',
        mainCta: 'The main CTA is "Profitez de l\'Offre Spéciale".',
      },
    },
  ]);

  // Saved landing pages data matching Screenshot 1
  const [savedPages, setSavedPages] = useState<SavedPageItem[]>([
    {
      id: 'page-1',
      brand: 'HomeClean',
      domain: 'homeclean-dz.com',
      title: 'Aspirateur sans fil - Nettoyage facile',
      lastSeen: '2 hours ago',
      newAdsCount: 3,
      thumbnail: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=400&fit=crop',
      isNew: true,
    },
    {
      id: 'page-2',
      brand: 'PureSkin',
      domain: 'pureskin-dz.com',
      title: 'Soin naturel pour une peau éclatante',
      lastSeen: '5 hours ago',
      newAdsCount: 5,
      thumbnail: 'https://images.unsplash.com/photo-1608248597359-0081f969eb2e?w=600&h=400&fit=crop',
      isNew: true,
    },
    {
      id: 'page-3',
      brand: 'TechZone',
      domain: 'techzone-dz.com',
      title: 'Montres connectées - Spécial offre',
      lastSeen: '7 hours ago',
      newAdsCount: 4,
      thumbnail: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=400&fit=crop',
      isNew: true,
    },
    {
      id: 'page-4',
      brand: 'UrbanStyle',
      domain: 'urbanstyle-dz.com',
      title: 'Collection streetwear 2025',
      lastSeen: '12 hours ago',
      newAdsCount: 6,
      thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=400&fit=crop',
      isNew: true,
    },
    {
      id: 'page-5',
      brand: 'FoodExpress',
      domain: 'foodexpress-dz.com',
      title: 'Commandez vos plats préférés',
      lastSeen: '1 day ago',
      newAdsCount: 8,
      thumbnail: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop',
      isNew: true,
    },
  ]);

  // Currently selected ad for right drawer
  const selectedAd = ads.find((a) => a.id === selectedAdId) || ads[0];

  const handleToggleSaveAd = (adId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, isSaved: !a.isSaved } : a))
    );
  };

  const handleAddNewAd = () => {
    if (!newAdUrl.trim()) return;
    const newAd: AdVideoItem = {
      id: `ad-${Date.now()}`,
      title: 'Campagne Algérie COD Spéciale Nouveauté 🔥',
      brand: 'E-com Brand',
      brandDomain: 'store-dz.com',
      brandAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      platform: 'Meta',
      status: 'Active',
      daysAgo: 'Just now',
      firstSeen: 'Today',
      lastSeen: 'Active',
      duration: '0:24',
      durationSeconds: 24,
      reach: '1.2M',
      engagement: '9.4K',
      ctr: '1.1%',
      thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      isSaved: true,
      targeting: {
        country: 'Algeria',
        age: '18 - 45',
        interests: ['Online Shopping', 'COD Algeria', 'Gadgets'],
      },
      insights: {
        hookRetention: 'High visual curiosity hook with 74% retention.',
        topAudience: 'Top audience: 20-35 years old (50% male).',
        mainCta: 'The main CTA is "Commander Maintenant".',
      },
    };
    setAds([newAd, ...ads]);
    setSelectedAdId(newAd.id);
    setIsSaveAdModalOpen(false);
    setNewAdUrl('');
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* 1. Standard Left App Sidebar */}
      <AppSidebar
        activeView="ads-library"
        activeSubItem={activeTab === 'pages' ? 'pages' : 'videos'}
        onNavigate={onNavigate}
        onOpenNewModal={() => setIsSaveAdModalOpen(true)}
      />

      {/* 2. Main Body Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <AppHeader
          breadcrumbs={[
            { label: 'Ads Library', action: () => onNavigate('ads-library') },
            {
              label: activeTab === 'videos' ? 'Ads' : 'Saved Pages',
              isCurrent: true,
            },
          ]}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenSearchModal={onOpenSearchModal}
          currentCountry={currentCountry}
          onCountryChange={setCurrentCountry}
          dateRangeText="Last 30 days"
          onOpenSettings={onOpenSettings}
        />

        {/* Scrollable Main Ads Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left / Center Content Column */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Header Title & Top KPI Stats Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
              {/* Title & Subtitle */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0 mt-0.5">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Ads Library
                  </h1>
                  <p className="text-xs text-slate-500 max-w-xl">
                    Save and track your competitors' ads and landing pages. Find what works, get inspired, and stay ahead.
                  </p>
                </div>
              </div>

              {/* Actions & Top KPI Cards */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filters Button */}
                <button
                  onClick={() => setFilterDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-2xs cursor-pointer"
                >
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Filters</span>
                </button>

                {/* Date Dropdown */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 text-xs font-semibold text-slate-700 bg-white shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Last 30 days</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>

                {/* Save Ad Primary Button */}
                <button
                  onClick={() => setIsSaveAdModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Ad</span>
                </button>
              </div>
            </div>

            {/* Top KPI Metrics Row (Matching Screenshot 1) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Tab Selector: Ads / Videos vs Saved Pages */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-200/60 p-1">
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'videos'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Ads / Videos</span>
                </button>

                <button
                  onClick={() => setActiveTab('pages')}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'pages'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Saved Pages</span>
                </button>
              </div>

              {/* 3 Metric Pills on Right */}
              <div className="flex items-center gap-3">
                {/* Total Saved Ads */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Total Saved Ads</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">328</span>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
                        ↑ 32%
                      </span>
                    </div>
                  </div>
                </div>

                {/* New Ads Found */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Play className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">New Ads Found</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">84</span>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
                        ↑ 18%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Unique Brands */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Unique Brands</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900">56</span>
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center">
                        ↑ 12%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: Saved Ads (Videos) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Saved Ads (Videos)</h2>
                    <p className="text-[11px] text-slate-400">
                      Video ads from Facebook Ad Library. Save and analyze the best performing creatives.
                    </p>
                  </div>
                </div>

                {/* Controls: Sort and Grid/List */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
                    <span>Sort:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value as any)}
                      className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="newest">Newest First</option>
                      <option value="reach">Highest Reach</option>
                      <option value="ctr">Highest CTR</option>
                    </select>
                  </div>

                  <div className="flex items-center p-0.5 rounded-xl bg-slate-200/70 border border-slate-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'grid' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === 'list' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500'
                      }`}
                      title="List View"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of Video Ads (Matching Screenshot 1) */}
              <div
                className={`grid gap-4 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'
                    : 'grid-cols-1'
                }`}
              >
                {ads.map((ad) => {
                  const isSelected = ad.id === selectedAdId;
                  return (
                    <div
                      key={ad.id}
                      onClick={() => {
                        setSelectedAdId(ad.id);
                        setIsDetailsOpen(true);
                      }}
                      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer hover:shadow-lg ${
                        isSelected
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : 'border-slate-200/80 hover:border-blue-300 shadow-2xs'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                        <img
                          src={ad.thumbnail}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                        {/* Top Meta Badge */}
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium">
                          <span>∞</span>
                          <span>Meta</span>
                        </div>

                        {/* Options button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAdId(ad.id);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Center Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-lg">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Duration Badge Bottom Right */}
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-[10px] text-white font-mono font-medium">
                          {ad.duration}
                        </span>
                      </div>

                      {/* Card Content Area */}
                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                        {/* Ad Headline */}
                        <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                          {ad.title}
                        </h3>

                        {/* Brand Row */}
                        <div className="flex items-center gap-2">
                          <img
                            src={ad.brandAvatar}
                            alt={ad.brand}
                            className="w-5 h-5 rounded-full object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[11px] font-bold text-slate-800 block truncate">
                              {ad.brand}
                            </span>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              <span className="text-emerald-600 font-medium">Active</span>
                              <span>•</span>
                              <span>{ad.daysAgo}</span>
                            </div>
                          </div>
                        </div>

                        {/* Stats Row (Reach, Engagement, CTR) */}
                        <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span className="font-semibold text-slate-700">{ad.reach}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-slate-400" />
                            <span className="font-semibold text-slate-700">{ad.engagement}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="font-semibold text-slate-700">{ad.ctr}</span>
                          </div>
                        </div>

                        {/* Save Ad Button */}
                        <button
                          onClick={(e) => handleToggleSaveAd(ad.id, e)}
                          className={`w-full py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            ad.isSaved
                              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${ad.isSaved ? 'fill-blue-600 text-blue-600' : ''}`} />
                          <span>{ad.isSaved ? 'Saved' : 'Save Ad'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECTION 2: Saved Pages */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <LinkIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Saved Pages</h2>
                    <p className="text-[11px] text-slate-400">
                      Landing pages from Facebook Ad Library. Track new ads and see what's being promoted.
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs">
                    <span>Sort:</span>
                    <span className="font-semibold text-slate-800">Newest First</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>

                  <div className="flex items-center p-0.5 rounded-xl bg-slate-200/70 border border-slate-200">
                    <button className="p-1.5 rounded-lg bg-white text-blue-600 shadow-2xs">
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg text-slate-500">
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Saved Pages Grid (Matching Screenshot 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {savedPages.map((page) => (
                  <div
                    key={page.id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
                  >
                    {/* Thumbnail preview */}
                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                      <img
                        src={page.thumbnail}
                        alt={page.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {/* "New" Badge */}
                      {page.isNew && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs">
                          New
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
                      {/* Brand Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {page.brand.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-tight">
                              {page.brand}
                            </span>
                            <span className="text-[10px] text-slate-400 block leading-none">
                              {page.domain}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-slate-700 mt-2 line-clamp-1">
                          {page.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Last seen: {page.lastSeen}
                        </span>
                      </div>

                      {/* New ads count & View Page button */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-blue-600 font-semibold">
                          New ads: {page.newAdsCount}
                        </span>
                        <button
                          onClick={() => setPreviewPageItem(page)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          View Page
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR DRAWER: "Ad Details" (Matching Screenshot 1) */}
          {isDetailsOpen && (
            <aside className="w-80 h-full bg-white border-l border-slate-200/90 flex flex-col overflow-y-auto shrink-0 z-10 shadow-sm select-none">
              {/* Header */}
              <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-900">Ad Details</span>
                </div>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Video Media Preview Player */}
                <div className="relative aspect-square w-full rounded-2xl bg-black overflow-hidden shadow-inner group">
                  <img
                    src={selectedAd.thumbnail}
                    alt={selectedAd.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-white/90 text-blue-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-blue-600" />
                      ) : (
                        <Play className="w-5 h-5 fill-blue-600 ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Scrubber / Progress bar */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white font-mono">{selectedAd.duration}</span>
                  </div>
                </div>

                {/* Ad Headline */}
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {selectedAd.title}
                  </h3>
                </div>

                {/* Brand row with Facebook/Instagram logos */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedAd.brandAvatar}
                      alt={selectedAd.brand}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">
                        {selectedAd.brand}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <span>f</span>
                        <span>Facebook & Instagram</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200/50">
                    Active
                  </span>
                </div>

                {/* Action Button: Save Ad */}
                <button
                  onClick={() => handleToggleSaveAd(selectedAd.id)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold transition-all shadow-sm shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bookmark className={`w-4 h-4 ${selectedAd.isSaved ? 'fill-white' : ''}`} />
                  <span>{selectedAd.isSaved ? 'Saved to Collection' : 'Save Ad'}</span>
                </button>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Estimated Reach</span>
                    <span className="text-xs font-bold text-slate-800">{selectedAd.reach}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Engagement</span>
                    <span className="text-xs font-bold text-slate-800">{selectedAd.engagement}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">CTR</span>
                    <span className="text-xs font-bold text-slate-800">{selectedAd.ctr}</span>
                  </div>
                </div>

                {/* Targeting Section */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Targeting
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>🇩🇿</span>
                      <span className="font-medium text-slate-800">{selectedAd.targeting.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>Age {selectedAd.targeting.age}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span className="text-[11px]">
                        Interests: {selectedAd.targeting.interests.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div>
                      <span>First Seen: </span>
                      <span className="font-semibold text-slate-700">{selectedAd.firstSeen}</span>
                    </div>
                    <div>
                      <span>Last Seen: </span>
                      <span className="font-semibold text-slate-700">{selectedAd.lastSeen}</span>
                    </div>
                  </div>
                </div>

                {/* Video Insights (AI Powered) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Video Insights</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-200/60 text-blue-800 font-bold ml-auto">
                      AI Powered
                    </span>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-blue-950/80">
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{selectedAd.insights.hookRetention}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{selectedAd.insights.topAudience}</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{selectedAd.insights.mainCta}</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => setFullAnalysisModalOpen(true)}
                    className="w-full py-1.5 rounded-xl bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold shadow-2xs cursor-pointer"
                  >
                    View Full Analysis
                  </button>
                </div>

                {/* Tracked Pages List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Tracked Pages
                    </span>
                    <button
                      onClick={() => setActiveTab('pages')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>View All</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {savedPages.map((tp) => (
                      <div
                        key={tp.id}
                        onClick={() => setPreviewPageItem(tp)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={tp.thumbnail}
                            alt={tp.brand}
                            className="w-6 h-6 rounded-md object-cover border border-slate-200"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-800 block truncate">
                              {tp.brand}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {tp.newAdsCount} new ads • {tp.lastSeen}
                            </span>
                          </div>
                        </div>
                        <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Save Ad Modal */}
      {isSaveAdModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Save Ad from Meta / TikTok</h3>
              </div>
              <button
                onClick={() => setIsSaveAdModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste the Facebook Ad Library URL or TikTok Creative link to import creative assets, reach, and copy automatically.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Ad / Post Link</label>
              <input
                type="text"
                placeholder="https://facebook.com/ads/library/?id=..."
                value={newAdUrl}
                onChange={(e) => setNewAdUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSaveAdModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewAd}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-500/25"
              >
                Import & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Landing Page Preview Modal */}
      {previewPageItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewPageItem.title}</h3>
                <span className="text-xs text-blue-600">{previewPageItem.domain}</span>
              </div>
              <button
                onClick={() => setPreviewPageItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={previewPageItem.thumbnail}
                alt={previewPageItem.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                <span>Active Algeria COD Funnel</span> • <span>58 Wilayas delivery form enabled</span>
              </div>
              <a
                href={`https://${previewPageItem.domain}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Visit Landing Page</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Full AI Analysis Modal */}
      {fullAnalysisModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Deep Creative Analysis</h3>
              </div>
              <button
                onClick={() => setFullAnalysisModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-1">Winning Creative Pattern</h4>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  This video utilizes a high-contrast Algerian lifestyle unboxing in the first 2 seconds, immediately removing skeptical purchase objections about Cash-On-Delivery.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-1">Recommended Re-hook</h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  "توصيل 58 ولاية مجاناً مع الدفع عند الاستلام — شوف كيفاش تسهل حياتك اليومية بهاد المنتوج الأصلي."
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setFullAnalysisModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
