import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Layers,
  Workflow,
  Sparkles,
  ShoppingBag,
  Plus,
  Check,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  Users,
  Target,
  DollarSign,
  TrendingUp,
  Sliders,
  ExternalLink,
  Tag,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { DetailedProduct, loadProductsFromStorage, ATTACHED_UMBRELLA_PRODUCT } from '../../utils/productStore';
import { SAMPLE_PRODUCTS } from '../../types/board';

export interface AdSetGroup {
  id: string;
  index: number;
  adsetName: string;
  themeCategory: string;
  audienceProfile: {
    avatar: string;
    ageRange: string;
    gender: string;
    interestTags: string[];
    codWilayas: string;
  };
  sharedAngle: string;
  recommendedHook: string;
  testingStrategy: string;
  products: DetailedProduct[];
}

export interface CampaignBlueprint {
  campaignName: string;
  campaignType: 'cbo' | 'abo' | 'tiktok';
  objective: string;
  dailyBudget: number;
  currency: string;
  targetMarket: string;
  productsPerGroup: number;
  totalProductsCount: number;
  groups: AdSetGroup[];
  generatedAt: string;
}

// -------------------------------------------------------------
// EXPORTED SMART CATEGORY & AUDIENCE CLUSTERING ALGORITHM
// -------------------------------------------------------------
export function clusterProductsIntoBlueprint(
  chosenProducts: DetailedProduct[],
  productsPerGroup: number = 2,
  campaignName: string = 'Algeria COD Q4 Scaling / Multi-Product Testing',
  campaignType: 'cbo' | 'abo' | 'tiktok' = 'cbo',
  dailyBudget: number = 50,
  groupingGoal: 'audience' | 'niche' | 'price' = 'audience'
): CampaignBlueprint {
  // 1. Semantic Tagging & Scoring for each product
  const scored = chosenProducts.map((product) => {
    const textToAnalyze = `${product.name} ${product.category} ${product.source || ''} ${
      product.details?.material || ''
    } ${product.intelligence?.targetCustomer || ''} ${product.aiAnalysis?.whySell?.join(' ') || ''}`.toLowerCase();

    // Detect Domain Archetype
    let archetype = 'General COD';
    let audienceAvatar = 'Online Algerian COD Shoppers (18-50)';
    let ageRange = '22-50';
    let gender = 'All';
    let interests = ['Online Shopping', 'Discounts', 'Home Delivery'];
    let hookTheme = 'Practical daily life improvement with cash on delivery guarantee';

    if (
      textToAnalyze.includes('cushion') ||
      textToAnalyze.includes('egg') ||
      textToAnalyze.includes('seat') ||
      textToAnalyze.includes('spine') ||
      textToAnalyze.includes('back') ||
      textToAnalyze.includes('sciatica') ||
      textToAnalyze.includes('chair')
    ) {
      archetype = 'Ergonomics & Pain Relief';
      audienceAvatar = 'Commercial Drivers (Taxi, VTC), Desk Workers & Back Pain Sufferers';
      ageRange = '25-60';
      gender = 'All';
      interests = ['Car accessories', 'Ergonomics', 'Sciatica', 'Office chairs', 'Back pain'];
      hookTheme = '12 hours seated with zero spine fatigue & shock-absorbing egg demonstration';
    } else if (
      textToAnalyze.includes('umbrella') ||
      textToAnalyze.includes('rain') ||
      textToAnalyze.includes('windproof') ||
      textToAnalyze.includes('macaron') ||
      textToAnalyze.includes('waterproof')
    ) {
      archetype = 'Seasonal Rain & Commute Accessories';
      audienceAvatar = 'Daily Commuters, Women (18-40), Students & Urban Pedestrians';
      ageRange = '18-40';
      gender = 'Women 70% / Men 30%';
      interests = ['Fashion accessories', 'Rainwear', 'Urban commuting', 'College life'];
      hookTheme = 'November-January rain season readiness with compact bag-clip carabiner';
    } else if (
      textToAnalyze.includes('tool') ||
      textToAnalyze.includes('belt') ||
      textToAnalyze.includes('knee') ||
      textToAnalyze.includes('hardware') ||
      textToAnalyze.includes('organizer') ||
      textToAnalyze.includes('plumber') ||
      textToAnalyze.includes('electrician')
    ) {
      archetype = 'Tools & Trade Equipment';
      audienceAvatar = 'Handymen, Plumbers, Electricians, Construction Workers & DIYers';
      ageRange = '24-55';
      gender = 'Men 90%';
      interests = ['Power tools', 'Construction', 'Carpentry', 'Plumbing', 'Hand tools'];
      hookTheme = 'Work 2x faster with hands-free heavy-duty gear protection on job sites';
    } else if (
      textToAnalyze.includes('scaler') ||
      textToAnalyze.includes('dental') ||
      textToAnalyze.includes('teeth') ||
      textToAnalyze.includes('plaque') ||
      textToAnalyze.includes('ultrasonic') ||
      textToAnalyze.includes('massager')
    ) {
      archetype = 'Personal Health & Dental Care';
      audienceAvatar = 'Adults concerned with clinical dental costs, smokers & tea/coffee drinkers';
      ageRange = '22-55';
      gender = 'All';
      interests = ['Dental health', 'Teeth whitening', 'Personal care', 'Oral hygiene'];
      hookTheme = 'Professional tartar & calculus removal at home without expensive clinic bills';
    } else if (
      textToAnalyze.includes('camp') ||
      textToAnalyze.includes('light') ||
      textToAnalyze.includes('lantern') ||
      textToAnalyze.includes('outdoor') ||
      textToAnalyze.includes('rechargeable') ||
      textToAnalyze.includes('solar')
    ) {
      archetype = 'Outdoor, Camping & Night Utility';
      audienceAvatar = 'Campers, Night Drivers, Travelers & Algerian Villa/Farm Owners';
      ageRange = '22-55';
      gender = 'Men 80%';
      interests = ['Camping', 'Outdoor recreation', 'Flashlights', 'Road trips'];
      hookTheme = 'Ultra-bright dual leaf portable illumination for outdoor & emergency outages';
    } else if (
      textToAnalyze.includes('warmer') ||
      textToAnalyze.includes('mug') ||
      textToAnalyze.includes('desk') ||
      textToAnalyze.includes('coffee') ||
      textToAnalyze.includes('tea')
    ) {
      archetype = 'Office & Home Comfort Gadgets';
      audienceAvatar = 'Office professionals, IT engineers, tea/coffee enthusiasts & students';
      ageRange = '20-45';
      gender = 'All';
      interests = ['Coffee culture', 'Tea lovers', 'Office desk setups', 'Home office'];
      hookTheme = 'Never drink cold coffee or tea again at your desk during winter work hours';
    } else if (
      textToAnalyze.includes('coat') ||
      textToAnalyze.includes('rack') ||
      textToAnalyze.includes('hanger') ||
      textToAnalyze.includes('home') ||
      textToAnalyze.includes('living')
    ) {
      archetype = 'Home Organization & Space Savers';
      audienceAvatar = 'Homeowners, Apartment Dwellers & Family Organizers';
      ageRange = '25-55';
      gender = 'All';
      interests = ['Interior design', 'Home decor', 'Space saving', 'Hallway storage'];
      hookTheme = 'Instant entryway organization with sturdy modern tree design';
    } else if (
      textToAnalyze.includes('camera') ||
      textToAnalyze.includes('security') ||
      textToAnalyze.includes('cctv') ||
      textToAnalyze.includes('4k') ||
      textToAnalyze.includes('ptz') ||
      textToAnalyze.includes('surveillance')
    ) {
      archetype = 'Smart Home & Security Systems';
      audienceAvatar = 'Villa & Farm Owners, Shopkeepers & Property Security Seekers';
      ageRange = '28-60';
      gender = 'Men 75% / Women 25%';
      interests = ['Home security', 'Smart home', 'CCTV', 'Property protection'];
      hookTheme = 'Monitor your home & property 24/7 in 4K color night vision with zero monthly fees';
    } else if (
      textToAnalyze.includes('washer') ||
      textToAnalyze.includes('car') ||
      textToAnalyze.includes('auto') ||
      textToAnalyze.includes('pressure') ||
      textToAnalyze.includes('vehicle') ||
      textToAnalyze.includes('foam')
    ) {
      archetype = 'Automotive & Garage Utility';
      audienceAvatar = 'Car Owners, Garage Hobbyists, Taxi Drivers & Mechanics';
      ageRange = '22-55';
      gender = 'Men 90%';
      interests = ['Car detailing', 'Automotive care', 'Pressure washing', 'Garage tools'];
      hookTheme = 'Wash your car anywhere with 48V cordless pressure power straight from a bucket';
    } else if (
      textToAnalyze.includes('snore') ||
      textToAnalyze.includes('cpap') ||
      textToAnalyze.includes('sleep') ||
      textToAnalyze.includes('apnea') ||
      textToAnalyze.includes('breathing')
    ) {
      archetype = 'Sleep Wellness & Snoring Relief';
      audienceAvatar = 'Chronic Snorers, Married Couples & Restless Sleep Sufferers';
      ageRange = '30-65';
      gender = 'All';
      interests = ['Sleep health', 'Snoring remedies', 'Wellness', 'Marital harmony'];
      hookTheme = 'Quiet peaceful nights for you and your spouse with micro-CPAP vortex airflow';
    } else if (
      textToAnalyze.includes('slicer') ||
      textToAnalyze.includes('mandoline') ||
      textToAnalyze.includes('kitchen') ||
      textToAnalyze.includes('chopper') ||
      textToAnalyze.includes('cutter') ||
      textToAnalyze.includes('cooking')
    ) {
      archetype = 'Kitchen Gadgets & Quick Food Prep';
      audienceAvatar = 'Home Cooks, Busy Mothers, Salad Lovers & Food Enthusiasts';
      ageRange = '22-55';
      gender = 'Women 70% / Men 30%';
      interests = ['Cooking', 'Kitchen gadgets', 'Healthy recipes', 'Meal prep'];
      hookTheme = 'Chop, slice, and julienne dinner ingredients in 60 seconds with zero finger risk';
    } else if (
      textToAnalyze.includes('watch') ||
      textToAnalyze.includes('smartwatch') ||
      textToAnalyze.includes('fitness') ||
      textToAnalyze.includes('garmin')
    ) {
      archetype = 'Smart Tech & Wearables';
      audienceAvatar = 'Young Professionals, Tech Lovers & Fitness Enthusiasts';
      ageRange = '18-45';
      gender = 'All';
      interests = ['Smartwatches', 'Gadgets', 'Fitness', 'Mobile tech'];
      hookTheme = 'Premium smartwatch with health tracking & bluetooth calling';
    } else {
      archetype = product.category || 'Trending COD Products';
      audienceAvatar = product.intelligence?.targetCustomer || 'Active Algerian Online Shoppers (20-50)';
      ageRange = '20-50';
      gender = 'All';
      interests = ['Online Shopping', 'Algeria E-commerce', 'Cash on Delivery'];
      hookTheme = product.aiAnalysis?.marketingAngle || 'High value direct-to-consumer offer with COD guarantee';
    }

    return {
      product,
      archetype,
      audienceAvatar,
      ageRange,
      gender,
      interests,
      hookTheme,
    };
  });

  // 2. Group by Archetype first to preserve category & audience synergy
  const groupsMap = new Map<string, typeof scored>();
  scored.forEach((item) => {
    const key = groupingGoal === 'niche' ? item.archetype : item.archetype;
    if (!groupsMap.has(key)) groupsMap.set(key, []);
    groupsMap.get(key)!.push(item);
  });

  // 3. Partition or chunk groups into the requested productsPerGroup size
  const finalGroups: AdSetGroup[] = [];
  let groupCounter = 1;

  groupsMap.forEach((items, archetypeKey) => {
    // Chunk items into pieces of size `productsPerGroup`
    for (let i = 0; i < items.length; i += productsPerGroup) {
      const chunk = items.slice(i, i + productsPerGroup);
      const first = chunk[0];

      const groupTitle =
        chunk.length === 1
          ? `AdSet ${groupCounter}: ${first.archetype} (${first.product.name.slice(0, 25)}...)`
          : `AdSet ${groupCounter}: ${first.archetype} (${chunk.length} Products)`;

      finalGroups.push({
        id: `adset-${Date.now()}-${groupCounter}`,
        index: groupCounter,
        adsetName: groupTitle,
        themeCategory: archetypeKey,
        audienceProfile: {
          avatar: first.audienceAvatar,
          ageRange: first.ageRange,
          gender: first.gender,
          interestTags: first.interests,
          codWilayas: '58 Wilayas (Algeria Top COD Hubs: Alger, Oran, Constantine, Sétif)',
        },
        sharedAngle: first.hookTheme,
        recommendedHook: `« الحل الأمثل لـ ${first.audienceAvatar.slice(0, 35)} مع ضمان وتوصيل 58 ولاية »`,
        testingStrategy:
          chunk.length > 1
            ? `Dynamic Creative Multi-Offer (${chunk.length} products bundled or carousel A/B test)`
            : `Single Product Lead Magnet (Video Hook + COD Offer)`,
        products: chunk.map((c) => c.product),
      });

      groupCounter++;
    }
  });

  return {
    campaignName: campaignName || 'Algeria COD Q4 Scaling / Multi-Product Testing',
    campaignType,
    objective: 'Purchases (COD Conversions) - Advantage+ Optimized',
    dailyBudget,
    currency: 'USD',
    targetMarket: 'Algeria (58 Wilayas)',
    productsPerGroup,
    totalProductsCount: chosenProducts.length,
    groups: finalGroups,
    generatedAt: new Date().toISOString(),
  };
}

export function getFallbackDetailedProducts(): DetailedProduct[] {
  const loaded = loadProductsFromStorage();
  if (loaded && loaded.length > 0) {
    return loaded;
  }
  return [
    ATTACHED_UMBRELLA_PRODUCT,
    ...SAMPLE_PRODUCTS.map((sp) => ({
      id: sp.id,
      name: sp.title,
      status: 'Active' as const,
      category: sp.niche,
      country: 'Algeria',
      mainImage: sp.image,
      supplier: { name: 'Verified Supplier', shippingTime: '24-48h', moq: 1, location: 'Alger' },
      financials: {
        sellingPrice: sp.sellingPrice,
        costPrice: sp.productCost,
        shippingCost: 600,
        roi: sp.profitMargin,
        breakEvenPrice: sp.productCost + 600,
      },
      opportunity: { overallScore: 85, demand: 80, competition: 40, margin: sp.profitMargin, algeriaCodSuitability: 90 },
      competitors: [],
      intelligence: {
        demandLevel: 'HIGH' as const,
        competitionLevel: 'MEDIUM' as const,
        trendDirection: 'UP' as const,
        seasonality: 'EVERGREEN' as const,
        impulseBuy: 'HIGH' as const,
        targetCustomer: sp.subtitle,
        evidenceNotes: 'Tested e-commerce product',
      },
      details: { material: sp.sellingPoints },
      aiAnalysis: {
        whySell: [sp.sellingPoints],
        risks: ['Pricing competition and confirmation delivery rate'],
        marketingAngle: sp.subtitle,
        suggestedPrice: `${sp.sellingPrice} DZD`,
        adHooks: [],
      },
    })),
  ];
}

export interface ProductRegrouperAppProps {
  initialData?: Partial<CampaignBlueprint>;
  onUpdateData?: (data: CampaignBlueprint) => void;
  onSendToBoard?: (blueprint: CampaignBlueprint) => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const ProductRegrouperApp: React.FC<ProductRegrouperAppProps> = ({
  initialData,
  onUpdateData,
  onSendToBoard,
  isModal = false,
  onCloseModal,
}) => {
  // Products from store
  const [allProducts, setAllProducts] = useState<DetailedProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());

  // Configuration options
  const [productsPerGroup, setProductsPerGroup] = useState<number>(initialData?.productsPerGroup || 2);
  const [groupingGoal, setGroupingGoal] = useState<'audience' | 'niche' | 'price'>('audience');
  const [campaignName, setCampaignName] = useState<string>(
    initialData?.campaignName || 'Algeria COD Q4 Scaling / Multi-Product Testing'
  );
  const [campaignType, setCampaignType] = useState<'cbo' | 'abo' | 'tiktok'>(
    initialData?.campaignType || 'cbo'
  );
  const [dailyBudget, setDailyBudget] = useState<number>(initialData?.dailyBudget || 50);

  // Results & UI State
  const [blueprint, setBlueprint] = useState<CampaignBlueprint | null>(
    initialData && initialData.groups && initialData.groups.length > 0
      ? (initialData as CampaignBlueprint)
      : null
  );
  const [isClustering, setIsClustering] = useState(false);
  const [viewMode, setViewMode] = useState<'diagram' | 'cards'>('diagram');
  const [collapsedAdsetIds, setCollapsedAdsetIds] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeStep, setActiveStep] = useState<'configure' | 'results'>(
    initialData && initialData.groups && initialData.groups.length > 0 ? 'results' : 'configure'
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(isModal);

  // Load products on mount
  useEffect(() => {
    const loaded = loadProductsFromStorage();
    if (loaded && loaded.length > 0) {
      setAllProducts(loaded);
      if (selectedProductIds.size === 0) {
        setSelectedProductIds(new Set(loaded.map((p) => p.id)));
      }
    } else {
      // Fallback to SAMPLE_PRODUCTS + ATTACHED_UMBRELLA_PRODUCT
      const initialList: DetailedProduct[] = [
        ATTACHED_UMBRELLA_PRODUCT,
        ...SAMPLE_PRODUCTS.map((sp) => ({
          id: sp.id,
          name: sp.title,
          status: 'Active' as const,
          category: sp.niche,
          country: 'Algeria',
          mainImage: sp.image,
          supplier: { name: 'Verified Supplier', shippingTime: '24-48h', moq: 1, location: 'Alger' },
          financials: {
            sellingPrice: sp.sellingPrice,
            costPrice: sp.productCost,
            shippingCost: 600,
            roi: sp.profitMargin,
            breakEvenPrice: sp.productCost + 600,
          },
          opportunity: { overallScore: 85, demand: 80, competition: 40, margin: sp.profitMargin, algeriaCodSuitability: 90 },
          competitors: [],
          intelligence: {
            demandLevel: 'HIGH' as const,
            competitionLevel: 'MEDIUM' as const,
            trendDirection: 'UP' as const,
            seasonality: 'EVERGREEN' as const,
            impulseBuy: 'HIGH' as const,
            targetCustomer: sp.subtitle,
            evidenceNotes: 'Tested e-commerce product',
          },
          details: { material: sp.sellingPoints },
          aiAnalysis: {
            whySell: [sp.sellingPoints],
            risks: ['Pricing competition and confirmation delivery rate'],
            marketingAngle: sp.subtitle,
            suggestedPrice: `${sp.sellingPrice} DZD`,
            adHooks: [],
          },
        })),
      ];
      setAllProducts(initialList);
      if (selectedProductIds.size === 0) {
        setSelectedProductIds(new Set(initialList.map((p) => p.id)));
      }
    }
  }, []);

  // Filtered products list for selector
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.intelligence?.targetCustomer && p.intelligence.targetCustomer.toLowerCase().includes(q))
      );
    });
  }, [allProducts, searchQuery]);

  // Compute estimated groups
  const estimatedGroupsCount = useMemo(() => {
    const count = selectedProductIds.size;
    if (count === 0) return 0;
    return Math.ceil(count / Math.max(1, productsPerGroup));
  }, [selectedProductIds.size, productsPerGroup]);

  // Toggle selection
  const handleToggleProduct = (id: string) => {
    const next = new Set(selectedProductIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedProductIds(next);
  };

  const handleSelectAll = () => {
    setSelectedProductIds(new Set(allProducts.map((p) => p.id)));
  };

  const handleDeselectAll = () => {
    setSelectedProductIds(new Set());
  };

  const runSmartClustering = () => {
    const chosenProducts = allProducts.filter((p) => selectedProductIds.has(p.id));
    if (chosenProducts.length === 0) return;

    setIsClustering(true);

    setTimeout(() => {
      const newBlueprint = clusterProductsIntoBlueprint(
        chosenProducts,
        productsPerGroup,
        campaignName,
        campaignType,
        dailyBudget,
        groupingGoal
      );

      setBlueprint(newBlueprint);
      setActiveStep('results');
      setIsClustering(false);

      if (onUpdateData) {
        onUpdateData(newBlueprint);
      }
    }, 500);
  };

  // Toggle collapse for an adset
  const toggleCollapseAdset = (id: string) => {
    const next = new Set(collapsedAdsetIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCollapsedAdsetIds(next);
  };

  // Copy structure as text
  const handleCopyStructure = () => {
    if (!blueprint) return;
    let txt = `=========================================================\n`;
    txt += `CAMPAIGN: ${blueprint.campaignName}\n`;
    txt += `Type: ${blueprint.campaignType.toUpperCase()} | Objective: ${blueprint.objective}\n`;
    txt += `Budget: $${blueprint.dailyBudget}/day | Market: ${blueprint.targetMarket}\n`;
    txt += `Total Products: ${blueprint.totalProductsCount} in ${blueprint.groups.length} AdSets (${blueprint.productsPerGroup} per AdSet)\n`;
    txt += `=========================================================\n\n`;

    blueprint.groups.forEach((group, idx) => {
      txt += `[ADSET ${group.index}] ${group.adsetName}\n`;
      txt += `  • Shared Audience: ${group.audienceProfile.avatar} (${group.audienceProfile.ageRange}, ${group.audienceProfile.gender})\n`;
      txt += `  • Meta Interest Tags: ${group.audienceProfile.interestTags.join(', ')}\n`;
      txt += `  • Shared Angle: ${group.sharedAngle}\n`;
      txt += `  • Test Hook: ${group.recommendedHook}\n`;
      txt += `  • Grouped Products (${group.products.length}):\n`;
      group.products.forEach((p, pIdx) => {
        txt += `     ${pIdx + 1}. ${p.name} — ${p.financials?.sellingPrice || 3500} DZD (${p.category})\n`;
      });
      txt += `\n`;
    });

    navigator.clipboard.writeText(txt);
    setCopiedKey('text');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Export JSON
  const handleExportJson = () => {
    if (!blueprint) return;
    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign_regrouped_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`flex flex-col bg-[#111114] text-neutral-200 border border-white/10 rounded-3xl shadow-2xl overflow-hidden select-none transition-all ${
        isModal ? 'w-full h-full max-w-6xl max-h-[90vh]' : 'w-full'
      }`}
    >
      {/* 1. APP HEADER BAR */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-[#17171b] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <Workflow className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">Product Regrouper App</h3>
              <span className="px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono text-[10px] font-bold">
                CAMPAIGN CLUSTER AI
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Select products, set group size, cluster by audience & category, and view as Org Chart diagram
            </p>
          </div>
        </div>

        {/* Tab & Modal Actions */}
        <div className="flex items-center gap-2">
          {blueprint && (
            <div className="flex bg-[#202026] p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setActiveStep('configure')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStep === 'configure'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                1. Select & Config
              </button>
              <button
                type="button"
                onClick={() => setActiveStep('results')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStep === 'results'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                2. Org Chart Diagram ({blueprint.groups.length} AdSets)
              </button>
            </div>
          )}

          {isModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. BODY CONTENT: STEP 1 (CONFIG) OR STEP 2 (RESULTS ORG CHART) */}
      <div className="flex-1 overflow-y-auto">
        {activeStep === 'configure' ? (
          <div className="p-5 sm:p-6 space-y-6">
            {/* Top Config Ribbon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#17171b] border border-white/5">
              {/* Parameter 1: Number of products per group */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Number of Products per Group</span>
                  <span className="text-[11px] font-mono text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                    {productsPerGroup} items / AdSet
                  </span>
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setProductsPerGroup(num)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        productsPerGroup === num
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'bg-[#22222a] text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <div className="flex items-center bg-[#22222a] px-2 py-1 rounded-xl border border-white/10">
                    <span className="text-[10px] text-neutral-400 mr-1 font-mono">Custom:</span>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={productsPerGroup}
                      onChange={(e) => setProductsPerGroup(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                      className="w-10 bg-transparent text-xs text-white font-mono font-bold focus:outline-none"
                    />
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 block leading-tight">
                  {selectedProductIds.size} products chosen → creates ~{estimatedGroupsCount} AdSet groups
                </span>
              </div>

              {/* Parameter 2: Grouping Goal / Similarity Criterion */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">Similarity Criterion</label>
                <select
                  value={groupingGoal}
                  onChange={(e) => setGroupingGoal(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-[#22222a] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="audience">Same Target Audience & Customer Avatar (Recommended)</option>
                  <option value="niche">Same Product Category / Niche</option>
                  <option value="price">Same Price & COD Margin Tier</option>
                </select>
                <span className="text-[10px] text-neutral-400 block leading-tight">
                  Clusters products so you can target identical audiences in each AdSet
                </span>
              </div>

              {/* Parameter 3: Campaign Type & Daily Budget */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white block">Campaign Architecture</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'cbo', label: 'Meta CBO' },
                    { id: 'abo', label: 'Meta ABO' },
                    { id: 'tiktok', label: 'TikTok Spark' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setCampaignType(t.id as any)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        campaignType === t.id
                          ? 'bg-violet-600 text-white shadow-md'
                          : 'bg-[#22222a] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-neutral-400">Budget:</span>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Number(e.target.value))}
                    className="w-20 px-2 py-0.5 rounded-lg bg-[#22222a] border border-white/10 text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                  <span className="text-[11px] text-neutral-400 font-mono">USD / day</span>
                </div>
              </div>
            </div>

            {/* Campaign Name Field */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Campaign Title / Project Code
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. Algeria COD Q4 Scaling / Multi-Product Testing"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#17171b] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Run Regrouping Button */}
              <div className="pt-5">
                <button
                  type="button"
                  disabled={selectedProductIds.size === 0 || isClustering}
                  onClick={runSmartClustering}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {isClustering ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Clustering Products...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Regrouping ({selectedProductIds.size} Products)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Selector Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-violet-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Select Products to Include in Campaign ({selectedProductIds.size} / {allProducts.length})
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-violet-400 hover:underline font-semibold cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-neutral-600">•</span>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs text-neutral-400 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Search filter for products */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter products by title, category, or customer audience..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#17171b] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {filteredProducts.map((prod) => {
                  const isChecked = selectedProductIds.has(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleToggleProduct(prod.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-violet-950/20 border-violet-500/50 shadow-sm'
                          : 'bg-[#17171b] border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 accent-violet-600 rounded cursor-pointer"
                      />
                      <img
                        src={prod.mainImage}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-white truncate" title={prod.name}>
                          {prod.name}
                        </h5>
                        <span className="text-[10px] text-neutral-400 block truncate font-mono">
                          {prod.category}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold text-violet-400 font-mono">
                            {prod.financials?.sellingPrice || 3500} DZD
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-neutral-300 font-bold">
                            {prod.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: RESULTS - ORG CHART DIAGRAM */
          blueprint && (
            <div className="p-5 sm:p-6 space-y-6">
              {/* Org Chart Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#17171b] border border-white/10">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('diagram')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'diagram'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Workflow className="w-3.5 h-3.5" />
                    <span>Org Chart Tree</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>AdSet Grid</span>
                  </button>
                </div>

                {/* Tree Zoom Controls */}
                {viewMode === 'diagram' && (
                  <div className="flex items-center gap-1 bg-[#22222a] px-2 py-1 rounded-xl border border-white/5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(60, z - 10))}
                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono text-neutral-300 px-1 font-bold">
                      {zoomLevel}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(100)}
                      className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                      title="Reset Zoom"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Export & Board Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyStructure}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
                    title="Copy full campaign plan text"
                  >
                    {copiedKey === 'text' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Plan</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer"
                    title="Download JSON file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>

                  {onSendToBoard && (
                    <button
                      type="button"
                      onClick={() => onSendToBoard(blueprint)}
                      className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      title="Send this Campaign Org Chart as nodes & connections onto the Board canvas"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Send to Board Canvas</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* ORG CHART TREE DIAGRAM RENDERING (The Requested Diagram!)      */}
              {/* ------------------------------------------------------------- */}
              {viewMode === 'diagram' ? (
                <div
                  className="w-full overflow-x-auto p-4 sm:p-6 bg-[#0c0c0f] rounded-3xl border border-white/10 min-h-[500px] flex flex-col items-center select-none"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                >
                  {/* ROOT NODE: CAMPAIGN LEVEL */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-[380px] sm:w-[460px] p-4 rounded-2xl bg-gradient-to-b from-[#241c38] to-[#1a1628] border-2 border-violet-500/60 shadow-2xl flex flex-col items-center text-center">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-violet-500/30 text-violet-300 font-mono font-bold text-[10px] tracking-wider uppercase border border-violet-500/40">
                          {blueprint.campaignType.toUpperCase()} CAMPAIGN LEVEL
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">
                          🇩🇿 58 Wilayas COD
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                        {blueprint.campaignName}
                      </h3>

                      <p className="text-[11px] text-violet-200/80 mt-1">
                        Objective: <strong className="text-white">{blueprint.objective}</strong>
                      </p>

                      {/* Campaign Key Badges */}
                      <div className="grid grid-cols-3 gap-2 w-full mt-3 pt-2.5 border-t border-violet-500/20 text-center font-mono">
                        <div className="p-1.5 rounded-lg bg-black/40">
                          <span className="text-[9px] text-neutral-400 block">BUDGET</span>
                          <span className="text-xs font-bold text-emerald-400">
                            ${blueprint.dailyBudget}/day
                          </span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/40">
                          <span className="text-[9px] text-neutral-400 block">ADSETS</span>
                          <span className="text-xs font-bold text-violet-300">
                            {blueprint.groups.length} Groups
                          </span>
                        </div>
                        <div className="p-1.5 rounded-lg bg-black/40">
                          <span className="text-[9px] text-neutral-400 block">PRODUCTS</span>
                          <span className="text-xs font-bold text-white">
                            {blueprint.totalProductsCount} Units
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stem Line down from Campaign */}
                    <div className="w-0.5 h-8 bg-violet-500/60" />
                  </div>

                  {/* HORIZONTAL CONNECTOR TRUNK FOR ADSETS */}
                  {blueprint.groups.length > 0 && (
                    <div className="w-full flex flex-col items-center">
                      {/* Horizontal bar spanning across adset columns */}
                      {blueprint.groups.length > 1 && (
                        <div
                          className="h-0.5 bg-violet-500/50 mb-0"
                          style={{
                            width: `${Math.max(300, (blueprint.groups.length - 1) * 320)}px`,
                          }}
                        />
                      )}

                      {/* ADSET COLUMNS */}
                      <div className="flex items-start justify-center gap-6 pt-0">
                        {blueprint.groups.map((group) => {
                          const isCollapsed = collapsedAdsetIds.has(group.id);
                          return (
                            <div key={group.id} className="flex flex-col items-center">
                              {/* Vertical connector from trunk into AdSet */}
                              <div className="w-0.5 h-6 bg-violet-500/50" />

                              {/* LEVEL 2: ADSET NODE CARD */}
                              <div className="w-[300px] p-3.5 rounded-2xl bg-[#191920] border-2 border-violet-500/40 hover:border-violet-500 shadow-xl transition-all flex flex-col justify-between">
                                <div>
                                  {/* Header */}
                                  <div className="flex items-center justify-between gap-1 mb-2">
                                    <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white font-mono font-bold text-[10px]">
                                      ADSET {group.index}
                                    </span>
                                    <span className="text-[10px] text-neutral-400 font-mono">
                                      {group.products.length} Products
                                    </span>
                                  </div>

                                  <h4 className="text-xs font-bold text-white leading-tight">
                                    {group.adsetName}
                                  </h4>

                                  {/* Audience Avatar Tag Box */}
                                  <div className="mt-2.5 p-2 rounded-xl bg-[#121217] border border-white/5 space-y-1 text-[10.5px]">
                                    <div className="flex items-center gap-1.5 text-violet-300 font-bold">
                                      <Users className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">Shared Audience Target:</span>
                                    </div>
                                    <p className="text-neutral-300 leading-tight">
                                      {group.audienceProfile.avatar}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-[9.5px] text-neutral-400 font-mono pt-1">
                                      <span>Age: {group.audienceProfile.ageRange}</span>
                                      <span>•</span>
                                      <span>{group.audienceProfile.gender}</span>
                                    </div>
                                  </div>

                                  {/* Interest Tags */}
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {group.audienceProfile.interestTags.slice(0, 3).map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[9px] px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-300 border border-violet-500/20 font-mono"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>

                                  {/* Shared Testing Angle */}
                                  <p className="text-[10px] text-neutral-400 italic mt-2 line-clamp-2 leading-relaxed">
                                    Angle: "{group.sharedAngle}"
                                  </p>
                                </div>

                                {/* Collapse / Expand AdSet Products Toggle */}
                                <button
                                  type="button"
                                  onClick={() => toggleCollapseAdset(group.id)}
                                  className="w-full mt-2.5 py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[10px] font-bold font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
                                >
                                  {isCollapsed ? (
                                    <>
                                      <ChevronRight className="w-3 h-3 text-violet-400" />
                                      <span>Show {group.products.length} Products</span>
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3 text-violet-400" />
                                      <span>Hide Products</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* STEM DOWN TO PRODUCTS */}
                              {!isCollapsed && group.products && group.products.length > 0 && (() => {
                                const renderModalProductCard = (prod: any) => (
                                  <div className="w-[138px] p-2.5 rounded-xl bg-[#141418] border border-white/10 hover:border-violet-500/50 shadow-md flex flex-col justify-between text-left group transition-all">
                                    <div className="relative w-full h-20 rounded-lg overflow-hidden bg-black/50 mb-2 border border-white/5">
                                      <img
                                        src={prod.mainImage}
                                        alt={prod.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8.5px] font-mono font-bold text-violet-300">
                                        {prod.financials?.sellingPrice || 3500} DZD
                                      </span>
                                    </div>

                                    <h5 className="text-[10px] font-bold text-white truncate leading-tight" title={prod.name}>
                                      {prod.name}
                                    </h5>
                                    <span className="text-[8.5px] text-neutral-400 block truncate font-mono mt-0.5">
                                      {prod.category}
                                    </span>

                                    <div className="mt-1.5 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-neutral-300">
                                      <span className="text-emerald-400 font-bold">
                                        ROI {prod.financials?.roi || 65}%
                                      </span>
                                      <span className="text-neutral-500">
                                        Score {prod.opportunity?.overallScore || 70}
                                      </span>
                                    </div>
                                  </div>
                                );

                                if (group.products.length === 1) {
                                  return (
                                    <div className="flex flex-col items-center w-full">
                                      <div className="w-0.5 h-6 bg-violet-500/40" />
                                      <div className="w-[138px] flex justify-center">
                                        {renderModalProductCard(group.products[0])}
                                      </div>
                                    </div>
                                  );
                                }

                                const rows: any[][] = [];
                                for (let i = 0; i < group.products.length; i += 2) {
                                  rows.push(group.products.slice(i, i + 2));
                                }

                                return (
                                  <div className="flex flex-col items-center w-full">
                                    {rows.map((rowProds, rIdx) => {
                                      const hasTwo = rowProds.length === 2;
                                      return (
                                        <div key={rIdx} className="flex flex-col items-center w-full">
                                          {/* Connector stem leading into this row */}
                                          <div className="w-0.5 h-4 bg-violet-500/40" />

                                          {/* Branch bar */}
                                          <div className="relative w-[148px] h-3">
                                            {hasTwo ? (
                                              <div className="absolute top-0 left-0 right-0 h-0.5 bg-violet-500/40" />
                                            ) : (
                                              <div className="absolute top-0 left-0 w-[74px] h-0.5 bg-violet-500/40" />
                                            )}
                                            <div className="absolute top-0 left-0 w-0.5 h-3 bg-violet-500/40" />
                                            {hasTwo && (
                                              <div className="absolute top-0 right-0 w-0.5 h-3 bg-violet-500/40" />
                                            )}
                                          </div>

                                          {/* 2-Column Product Cards Row */}
                                          <div className="grid grid-cols-2 gap-2.5 w-[286px]">
                                            <div className="w-[138px] flex justify-center">
                                              {renderModalProductCard(rowProds[0])}
                                            </div>
                                            {hasTwo ? (
                                              <div className="w-[138px] flex justify-center">
                                                {renderModalProductCard(rowProds[1])}
                                              </div>
                                            ) : (
                                              <div className="w-[138px]" />
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* GRID CARDS VIEW MODE */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {blueprint.groups.map((group) => (
                    <div
                      key={group.id}
                      className="p-4 rounded-2xl bg-[#16161b] border border-white/10 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white font-mono font-bold text-[10px]">
                            ADSET {group.index}
                          </span>
                          <span className="font-mono text-[11px] text-neutral-400">
                            {group.products.length} Products
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white">{group.adsetName}</h4>

                        {/* Audience Info */}
                        <div className="mt-3 p-3 rounded-xl bg-[#1f1f26] border border-white/5 space-y-1.5 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-violet-300">
                            <Target className="w-3.5 h-3.5 shrink-0" />
                            <span>Target Audience Profile:</span>
                          </div>
                          <p className="text-neutral-300 text-[11px] leading-relaxed">
                            {group.audienceProfile.avatar}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {group.audienceProfile.interestTags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-violet-900/30 text-violet-300 border border-violet-500/20 text-[9.5px] font-mono"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Products Included */}
                        <div className="mt-3 space-y-2">
                          <span className="text-[10.5px] font-bold text-neutral-400 block uppercase tracking-wider font-mono">
                            Grouped Products ({group.products.length}):
                          </span>
                          {group.products.map((prod) => (
                            <div
                              key={prod.id}
                              className="p-2 rounded-xl bg-[#1d1d24] flex items-center justify-between gap-2.5"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={prod.mainImage}
                                  alt={prod.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                                />
                                <div className="min-w-0">
                                  <h6 className="text-[11px] font-bold text-white truncate max-w-[170px]">
                                    {prod.name}
                                  </h6>
                                  <span className="text-[9px] text-neutral-400 block truncate font-mono">
                                    {prod.category}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono text-xs font-bold text-violet-400 shrink-0">
                                {prod.financials?.sellingPrice || 3500} DZD
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Testing Strategy footer */}
                      <div className="pt-2 border-t border-white/5 text-[10.5px] text-neutral-400">
                        <span className="font-bold text-neutral-300">Strategy:</span>{' '}
                        {group.testingStrategy}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
