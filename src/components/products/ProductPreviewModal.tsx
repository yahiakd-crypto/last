import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Plus,
  Share2,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Truck,
  ShieldCheck,
  Tag,
  Store,
  Layers,
  Sparkles,
  Target,
  BarChart2,
  Clock,
  CheckSquare,
  Copy,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { DetailedProduct, downloadProductAsJson } from '../../utils/productStore';

interface ProductPreviewModalProps {
  product: DetailedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToBoard?: (product: DetailedProduct) => void;
}

export const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToBoard
}) => {
  const [activeTab, setActiveTab] = useState<'financials' | 'competitors' | 'aiAnalysis' | 'supplier' | 'checklist'>('financials');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen || !product) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(product, null, 2));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Researching':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Testing':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-blue-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl max-h-[92vh] bg-[#141416] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#19191d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider font-mono border ${getStatusColor(
                product.status
              )}`}
            >
              {product.status}
            </span>
            <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
              ID: {product.id}
            </span>
            <span className="text-xs text-neutral-500">•</span>
            <span className="text-xs text-neutral-400 truncate max-w-md">
              {product.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onAddToBoard && (
              <button
                type="button"
                onClick={() => {
                  onAddToBoard(product);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Board</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyJson}
              className="p-2 rounded-xl bg-[#232328] hover:bg-[#2c2c33] border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Copy JSON"
            >
              {copiedText ? <Check className="w-4 h-4 text-blue-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => downloadProductAsJson(product)}
              className="p-2 rounded-xl bg-[#232328] hover:bg-[#2c2c33] border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Download JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#232328] hover:bg-rose-500/20 border border-white/10 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Hero Info */}
        <div className="p-5 sm:p-6 bg-[#161619] border-b border-white/5 flex flex-col md:flex-row gap-5 items-start">
          <div className="relative shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-white/10 bg-[#202025] shadow-lg">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback image if external URL fails
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=500&h=500&fit=crop';
              }}
            />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white font-bold">
              DZ COD
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-blue-400">
                Algeria E-Commerce Intelligence
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-xs text-neutral-400">
                Currency: DZD
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              {product.name}
            </h2>

            <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
              {product.intelligence?.evidenceNotes || product.source || 'Researched product dossier for Algerian COD market.'}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
              <div className="p-2.5 rounded-xl bg-[#1d1d22] border border-white/5">
                <span className="text-[10px] text-neutral-400 block font-mono">SELLING PRICE</span>
                <span className="text-sm font-bold text-white font-mono">
                  {(product.financials?.sellingPrice ?? 1400).toLocaleString()} DZD
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1d1d22] border border-white/5">
                <span className="text-[10px] text-neutral-400 block font-mono">LANDED COST</span>
                <span className="text-sm font-bold text-neutral-300 font-mono">
                  {(product.financials?.costPrice ?? 760).toLocaleString()} DZD
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1d1d22] border border-white/5">
                <span className="text-[10px] text-neutral-400 block font-mono">OVERALL SCORE</span>
                <span className={`text-sm font-bold font-mono ${getScoreColor(product.opportunity?.overallScore ?? 52)}`}>
                  {product.opportunity?.overallScore ?? 52} / 100
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#1d1d22] border border-white/5">
                <span className="text-[10px] text-neutral-400 block font-mono">COD SUITABILITY</span>
                <span className={`text-sm font-bold font-mono ${getScoreColor(product.opportunity?.algeriaCodSuitability ?? 45)}`}>
                  {product.opportunity?.algeriaCodSuitability ?? 45} / 100
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/5 bg-[#17171a] overflow-x-auto scrollbar-none text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('financials')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'financials'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Unit Economics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('competitors')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'competitors'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Competitors ({product.competitors?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aiAnalysis')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'aiAnalysis'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Strategy & Hooks</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supplier')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supplier'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Supplier & Specs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'checklist'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checklist ({product.checklist?.filter((c) => c.done).length || 0}/{product.checklist?.length || 0})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: FINANCIALS & UNIT ECONOMICS */}
          {activeTab === 'financials' && (
            <div className="space-y-6">
              {/* Alert note if margin is negative or low */}
              {(product.financials?.roi ?? 0) <= 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-200 mb-0.5">Pricing Gate Alert</h4>
                    <p className="leading-relaxed">
                      At {product.financials?.sellingPrice ?? 1400} DZD standalone retail, contribution after 500 DZD Algerian shipping is thin or negative (breakeven is {product.financials?.breakEvenPrice ?? 1310} DZD). Recommended to price at 1,700-2,000 DZD with Stopdesk or bundle as 2-Pack at 2,400+ DZD.
                    </p>
                  </div>
                </div>
              )}

              {/* Financials Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#1c1c21] border border-white/5">
                  <span className="text-[10px] text-neutral-400 font-mono block">RETAIL PRICE</span>
                  <span className="text-lg font-bold text-blue-400 font-mono">
                    {(product.financials?.sellingPrice ?? 1400).toLocaleString()} DZD
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">Direct COD Offer</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1c1c21] border border-white/5">
                  <span className="text-[10px] text-neutral-400 font-mono block">LANDED COST</span>
                  <span className="text-lg font-bold text-neutral-200 font-mono">
                    {(product.financials?.costPrice ?? 760).toLocaleString()} DZD
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">FOB + Duty + Pack</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1c1c21] border border-white/5">
                  <span className="text-[10px] text-neutral-400 font-mono block">SHIPPING COST</span>
                  <span className="text-lg font-bold text-neutral-300 font-mono">
                    {(product.financials?.shippingCost ?? 202).toLocaleString()} DZD
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">Freight Allocation</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1c1c21] border border-white/5">
                  <span className="text-[10px] text-neutral-400 font-mono block">BREAKEVEN PRICE</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">
                    {(product.financials?.breakEvenPrice ?? 1310).toLocaleString()} DZD
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">Zero Margin Threshold</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1c1c21] border border-white/5">
                  <span className="text-[10px] text-neutral-400 font-mono block">SCENARIO ROI</span>
                  <span
                    className={`text-lg font-bold font-mono ${
                      (product.financials?.roi ?? 0) >= 0 ? 'text-blue-400' : 'text-rose-400'
                    }`}
                  >
                    {(product.financials?.roi ?? 0) > 0 ? `+${product.financials.roi}%` : `${product.financials?.roi ?? 0}%`}
                  </span>
                  <span className="text-[10px] text-neutral-500 block mt-1">Risk Adjusted</span>
                </div>
              </div>

              {/* Opportunity Scores Breakdown */}
              <div className="p-4 rounded-2xl bg-[#1a1a1f] border border-white/5 space-y-4">
                <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono">
                  Opportunity Metrics & Market Fit
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">Demand Level</span>
                      <span className="font-bold text-white">{product.opportunity?.demand ?? 55}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${product.opportunity?.demand ?? 55}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">Competition Index</span>
                      <span className="font-bold text-amber-400">{product.opportunity?.competition ?? 75}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${product.opportunity?.competition ?? 75}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">Algeria COD Fit</span>
                      <span className="font-bold text-white">{product.opportunity?.algeriaCodSuitability ?? 45}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${product.opportunity?.algeriaCodSuitability ?? 45}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-neutral-400">Ad Potential</span>
                      <span className="font-bold text-purple-400">{product.opportunity?.advertisingPotential || 65}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${product.opportunity?.advertisingPotential || 65}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Notes */}
              {product.structuredNotes?.pricingNotes && (
                <div className="p-4 rounded-2xl bg-[#1c1c21] border border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-neutral-300 font-mono uppercase">
                    Financial Analysis Notes
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {product.structuredNotes.pricingNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPETITORS BENCHMARK */}
          {activeTab === 'competitors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Benchmarked local Algerian COD stores and global suppliers
                </span>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {product.competitors?.length || 0} sources tracked
                </span>
              </div>

              <div className="space-y-3">
                {(product.competitors || []).map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#1c1c21] border border-white/5 hover:border-white/15 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-neutral-800 text-neutral-300">
                            {comp.type}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {comp.name}
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-400 mt-1">
                          {comp.positioning}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm sm:text-base font-bold text-blue-400 font-mono">
                          {comp.price} {comp.currency}
                        </span>
                        {comp.productUrl && (
                          <a
                            href={comp.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-end gap-1 text-[11px] text-blue-400 hover:underline mt-0.5"
                          >
                            <span>Visit</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="italic">
                        Differentiation: <strong className="text-neutral-200">{comp.differentiation}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AI ANALYSIS & HOOKS */}
          {activeTab === 'aiAnalysis' && (
            <div className="space-y-6">
              {/* Marketing Angle Banner */}
              <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase font-mono tracking-wider">
                  Core Winning Angle
                </span>
                <p className="text-xs sm:text-sm font-medium text-blue-100">
                  {product.aiAnalysis?.marketingAngle || 'High-converting Algerian COD offer with strong visual proof.'}
                </p>
                <div className="text-xs text-neutral-300 pt-1">
                  <strong>Suggested Pricing:</strong> {product.aiAnalysis?.suggestedPrice || `${product.financials?.sellingPrice ?? 1400} DZD`}
                </div>
              </div>

              {/* Ad Hooks in Arabic and French */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
                  High-Converting Ad Hooks
                </h4>
                <div className="space-y-2">
                  {(product.aiAnalysis?.adHooks || []).map((hook, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#1c1c21] border border-white/5 text-xs text-neutral-200 flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{hook}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Sell & Fatal Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#18181c] border border-white/5 space-y-2.5">
                  <h4 className="text-xs font-bold text-blue-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Why Sell in Algeria</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {(product.aiAnalysis?.whySell || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#18181c] border border-white/5 space-y-2.5">
                  <h4 className="text-xs font-bold text-rose-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Fatal Risks & Watchouts</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-300">
                    {(product.aiAnalysis?.risks || []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Target Customer & Segments */}
              <div className="p-4 rounded-2xl bg-[#1c1c21] border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
                  Target Customer & Segments
                </h4>
                <p className="text-xs text-neutral-400">
                  {product.intelligence?.targetCustomer}
                </p>
                {product.aiAnalysis.customerSegments && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.aiAnalysis.customerSegments.map((seg, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#27272e] text-neutral-300 text-xs font-medium border border-white/5"
                      >
                        {seg}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SUPPLIER & SPECS */}
          {activeTab === 'supplier' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#1c1c21] border border-white/5 space-y-3">
                <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono">
                  Sourcing & Manufacturing Profile
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500 block font-mono text-[10px]">SUPPLIER</span>
                    <span className="font-bold text-white">{product.supplier?.name || 'Verified Supplier'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-mono text-[10px]">LOCATION</span>
                    <span className="font-bold text-white">{product.supplier?.location || 'China / Global'}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-mono text-[10px]">MIN ORDER (MOQ)</span>
                    <span className="font-bold text-blue-400 font-mono">{product.supplier?.moq ?? 5} pcs</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-mono text-[10px]">TRANSIT TO DZ</span>
                    <span className="font-bold text-neutral-300">{product.supplier?.shippingTime || '25-45 days to Algeria'}</span>
                  </div>
                </div>
              </div>

              {product.details && (
                <div className="p-4 rounded-2xl bg-[#1c1c21] border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider font-mono">
                    Product Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {product.details.material && (
                      <div>
                        <span className="text-neutral-500 block font-mono text-[10px]">MATERIAL</span>
                        <span className="text-neutral-300">{product.details.material}</span>
                      </div>
                    )}
                    {product.details.sizes && (
                      <div>
                        <span className="text-neutral-500 block font-mono text-[10px]">SIZES & WEIGHT</span>
                        <span className="text-neutral-300">{product.details.sizes}</span>
                      </div>
                    )}
                    {product.details.supportType && (
                      <div>
                        <span className="text-neutral-500 block font-mono text-[10px]">FRAME TYPE</span>
                        <span className="text-neutral-300">{product.details.supportType}</span>
                      </div>
                    )}
                    {product.details.colorVariants && (
                      <div>
                        <span className="text-neutral-500 block font-mono text-[10px]">COLOR VARIANTS</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {product.details.colorVariants.map((col, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px]">
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <span className="text-xs text-neutral-400">
                Action items and validation roadmap for launching in Algeria
              </span>
              <div className="space-y-2">
                {product.checklist?.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      item.done
                        ? 'bg-blue-600/10 border-blue-500/30 text-blue-200'
                        : 'bg-[#1c1c21] border-white/5 text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          item.done
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-neutral-600 bg-neutral-800'
                        }`}
                      >
                        {item.done && <Check className="w-3 h-3" />}
                      </div>
                      <span className={item.done ? 'line-through text-neutral-400' : ''}>
                        {item.text}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {item.done ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#19191d] flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white text-[10px] font-mono">ESC</kbd> to close
          </div>

          <div className="flex items-center gap-2">
            {onAddToBoard && (
              <button
                type="button"
                onClick={() => {
                  onAddToBoard(product);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add to Board Canvas</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#232328] hover:bg-[#2b2b32] text-neutral-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
