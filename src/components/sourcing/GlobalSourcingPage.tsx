import React, { useState, useMemo } from 'react';
import {
  Globe,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Package,
  Truck,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Star,
  MapPin,
  Building,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';

interface GlobalSourcingPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  onOpenSearchModal?: () => void;
}

export const GlobalSourcingPage: React.FC<GlobalSourcingPageProps> = ({
  onNavigate,
  onOpenSearchModal,
}) => {
  const [activeTab, setActiveTab] = useState<'suppliers' | 'calculator' | 'categories'>('suppliers');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState<string>('all');

  // Landed cost calculator state
  const [unitCostUSD, setUnitCostUSD] = useState<number>(3.5);
  const [quantity, setQuantity] = useState<number>(300);
  const [weightKgPerUnit, setWeightKgPerUnit] = useState<number>(0.25);
  const [shippingMode, setShippingMode] = useState<'air' | 'sea'>('air');
  const [exchangeRateDZD, setExchangeRateDZD] = useState<number>(245); // Square / parallel market benchmark
  const [customsPercent, setCustomsPercent] = useState<number>(15);

  // Sourcing Landed Cost calculations
  const landedCalculation = useMemo(() => {
    const totalUnitsCostUSD = unitCostUSD * quantity;
    const totalWeightKg = weightKgPerUnit * quantity;
    const airRatePerKg = 12; // $12/kg air cargo to Algeria
    const seaRatePerKg = 2.8; // $2.8/kg sea freight
    const freightUSD = totalWeightKg * (shippingMode === 'air' ? airRatePerKg : seaRatePerKg);
    const customsUSD = totalUnitsCostUSD * (customsPercent / 100);
    const totalUSD = totalUnitsCostUSD + freightUSD + customsUSD;
    const totalDZD = totalUSD * exchangeRateDZD;
    const landedCostPerUnitDZD = totalDZD / quantity;

    return {
      totalUnitsCostUSD,
      totalWeightKg,
      freightUSD,
      customsUSD,
      totalUSD,
      totalDZD,
      landedCostPerUnitDZD,
    };
  }, [unitCostUSD, quantity, weightKgPerUnit, shippingMode, exchangeRateDZD, customsPercent]);

  const verifiedSuppliers = [
    {
      id: 'sup1',
      name: 'Yiwu Top Notch Trade Co.',
      platform: '1688.com / Yiwu',
      country: 'China',
      categories: ['Home & Kitchen', 'Cleaning Gadgets'],
      rating: 4.9,
      moq: '50 pcs',
      leadTime: '3-5 days',
      verified: true,
      description: 'Specializes in viral TikTok & Reels consumer gadgets with rapid local warehousing delivery.',
    },
    {
      id: 'sup2',
      name: 'Shenzhen TechSpark Electronics',
      platform: 'Alibaba Verified Gold',
      country: 'China',
      categories: ['Electronics', 'Smartwatches', 'Audio'],
      rating: 4.8,
      moq: '100 pcs',
      leadTime: '5-7 days',
      verified: true,
      description: 'Direct manufacturer of OEM smart wearables, CE/FCC certified with bilingual packaging.',
    },
    {
      id: 'sup3',
      name: 'El Eulma Wholesale Import Hub',
      platform: 'Algeria Local Stock (El Eulma / Sétif)',
      country: 'Algeria',
      categories: ['Automotive Accessories', 'Tools'],
      rating: 4.7,
      moq: '1 carton (24-48 pcs)',
      leadTime: '24-48 hours',
      verified: true,
      description: 'Instant ready stock in Algeria. No customs delays, direct payment in DZD with receipt.',
    },
    {
      id: 'sup4',
      name: 'Guangzhou Elegance Beauty Lab',
      platform: '1688 / Taobao Wholesale',
      country: 'China',
      categories: ['Beauty', 'Hair Care', 'Personal Grooming'],
      rating: 4.9,
      moq: '50 pcs',
      leadTime: '4 days',
      verified: true,
      description: 'High-converting hair styling tools, epilators and facial massagers with Arabic manuals.',
    },
    {
      id: 'sup5',
      name: 'Ain Fakroun Textile & Apparel Depot',
      platform: 'Algeria Local Stock (Ain Fakroun / Oum El Bouaghi)',
      country: 'Algeria',
      categories: ['Fashion & Apparel', 'Shoes', 'Bags'],
      rating: 4.8,
      moq: '30 pcs',
      leadTime: 'Same day',
      verified: true,
      description: 'Premier wholesale hub for shoes, bags and seasonal fashion with weekly new drops.',
    },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-900 select-none">
      <AppSidebar
        activeView="sourcing"
        onNavigate={onNavigate}
        onOpenNewModal={() => onNavigate('board')}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 z-10 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Globe className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                Global Sourcing Intelligence
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Worldwide Sourcing Wholesale & E-commerce Hub (China & Algeria)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'suppliers'
                  ? 'bg-white text-emerald-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Verified Suppliers
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'calculator'
                  ? 'bg-white text-emerald-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Landed Cost Calculator
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-6xl mx-auto space-y-6">
            {activeTab === 'suppliers' ? (
              <>
                {/* Search & Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative flex-1 w-full max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search suppliers by keyword, category, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedHub('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        selectedHub === 'all'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      All Sourcing
                    </button>
                    <button
                      onClick={() => setSelectedHub('China')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        selectedHub === 'China'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      China (1688 / Alibaba)
                    </button>
                    <button
                      onClick={() => setSelectedHub('Algeria')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        selectedHub === 'Algeria'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      Algeria Ready Stock
                    </button>
                  </div>
                </div>

                {/* Suppliers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verifiedSuppliers
                    .filter((s) => selectedHub === 'all' || s.country === selectedHub)
                    .filter(
                      (s) =>
                        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((supplier) => (
                      <div
                        key={supplier.id}
                        className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs hover:border-emerald-200 hover:shadow-xs transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#EAFBF1] border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                              <Building className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{supplier.name}</span>
                                {supplier.verified && (
                                  <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-50 shrink-0" />
                                )}
                              </h3>
                              <p className="text-[11px] text-slate-400 font-medium">
                                {supplier.platform} • {supplier.country}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{supplier.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {supplier.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {supplier.categories.map((cat, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-600 text-[10px] font-semibold border border-slate-100"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
                          <div>
                            MOQ: <span className="text-slate-900 font-bold">{supplier.moq}</span>
                          </div>
                          <div>
                            Lead Time: <span className="text-slate-900 font-bold">{supplier.leadTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              /* Landed Cost Calculator Tab */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Import Sourcing Cost Parameters
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Factory Unit Cost (USD)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={unitCostUSD}
                      onChange={(e) => setUnitCostUSD(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Order Quantity (Units)
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Weight per Unit (Kg)
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={weightKgPerUnit}
                      onChange={(e) => setWeightKgPerUnit(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Shipping Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setShippingMode('air')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          shippingMode === 'air'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        Air Cargo ($12/kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => setShippingMode('sea')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          shippingMode === 'sea'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        Sea Freight ($2.8/kg)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      DZD Exchange Rate (1 USD = ? DZD)
                    </label>
                    <input
                      type="number"
                      value={exchangeRateDZD}
                      onChange={(e) => setExchangeRateDZD(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Landed Cost Summary in Algeria
                  </h3>

                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Final Landed Cost per Unit in Algeria
                    </span>
                    <div className="text-3xl font-black text-emerald-700">
                      {Math.round(landedCalculation.landedCostPerUnitDZD).toLocaleString()} <span className="text-sm font-bold">DZD</span>
                    </div>
                    <p className="text-[11px] text-emerald-600 mt-1 font-medium">
                      Equivalent to ${(landedCalculation.landedCostPerUnitDZD / exchangeRateDZD).toFixed(2)} USD per delivered unit into warehouse.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100 font-medium">
                      <span className="text-slate-500">Total Factory Invoice</span>
                      <span className="font-bold text-slate-900">${landedCalculation.totalUnitsCostUSD.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 font-medium">
                      <span className="text-slate-500">Estimated Freight ({shippingMode.toUpperCase()})</span>
                      <span className="font-bold text-slate-900">${landedCalculation.freightUSD.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 font-medium">
                      <span className="text-slate-500">Customs & Handling Provision</span>
                      <span className="font-bold text-slate-900">${landedCalculation.customsUSD.toFixed(2)} USD</span>
                    </div>
                    <div className="flex justify-between py-2.5 font-bold text-slate-900 text-sm">
                      <span>Total Shipment Investment</span>
                      <span className="text-emerald-600">{Math.round(landedCalculation.totalDZD).toLocaleString()} DZD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

