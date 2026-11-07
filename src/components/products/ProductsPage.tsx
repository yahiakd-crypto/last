import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Eye,
  Download,
  Trash2,
  ArrowRight,
  Sparkles,
  Calendar,
  ArrowUpDown,
  X
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import {
  DetailedProduct,
  loadProductsFromStorage,
  saveProductsToStorage,
  downloadProductAsJson,
  ATTACHED_UMBRELLA_PRODUCT,
  getProductDate
} from '../../utils/productStore';
import { ProductPreviewModal } from './ProductPreviewModal';
import { ProductImportModal } from './ProductImportModal';

interface ProductsPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  onOpenSearchModal?: () => void;
  onAddToBoard?: (product: DetailedProduct) => void;
}

const MARKET_FLAGS: Record<string, string> = {
  DZ: '🇩🇿 DZ',
  MA: '🇲🇦 MA',
  TN: '🇹🇳 TN',
  SA: '🇸🇦 SA',
  AE: '🇦🇪 AE',
  QA: '🇶🇦 QA',
  KW: '🇰🇼 KW',
  EG: '🇪🇬 EG',
  FR: '🇫🇷 FR',
  US: '🇺🇸 US',
  GB: '🇬🇧 UK',
};

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onNavigate,
  onAddToBoard
}) => {
  const [products, setProducts] = useState<DetailedProduct[]>(() => loadProductsFromStorage());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Researching' | 'Active' | 'Testing'>('All');

  // Date Filtering & Sorting state
  const [datePreset, setDatePreset] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [dateSort, setDateSort] = useState<'newest' | 'oldest'>('newest');

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedProductForPreview, setSelectedProductForPreview] = useState<DetailedProduct | null>(null);

  // Sync products when added/saved from ProductImportModal (keeps user in Step 1 of scanner)
  const handleProductAdded = () => {
    setProducts(loadProductsFromStorage());
  };

  const handleDeleteProduct = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this product?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      saveProductsToStorage(updated);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.country || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.currency || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || product.status === statusFilter;

      if (!matchesSearch || !matchesStatus) return false;

      // Date filter evaluation
      if (datePreset === 'all' && !dateFrom && !dateTo) return true;

      const prodDate = getProductDate(product);
      const prodTime = prodDate.getTime();
      const now = new Date();

      if (datePreset === 'today') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfToday = startOfToday + 24 * 60 * 60 * 1000 - 1;
        return prodTime >= startOfToday && prodTime <= endOfToday;
      }

      if (datePreset === '7days') {
        const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
        return prodTime >= sevenDaysAgo;
      }

      if (datePreset === '30days') {
        const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
        return prodTime >= thirtyDaysAgo;
      }

      if (datePreset === 'custom' || dateFrom || dateTo) {
        if (dateFrom) {
          const fromDate = new Date(`${dateFrom}T00:00:00`);
          if (!isNaN(fromDate.getTime()) && prodTime < fromDate.getTime()) {
            return false;
          }
        }
        if (dateTo) {
          const toDate = new Date(`${dateTo}T23:59:59.999`);
          if (!isNaN(toDate.getTime()) && prodTime > toDate.getTime()) {
            return false;
          }
        }
      }

      return true;
    })
    .sort((a, b) => {
      const timeA = getProductDate(a).getTime();
      const timeB = getProductDate(b).getTime();
      return dateSort === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const totalProducts = products.length;
  const researchingCount = products.filter((p) => p.status === 'Researching').length;
  const activeCount = products.filter((p) => p.status === 'Active').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans select-none">
      {/* 1. Unified AppSidebar */}
      <AppSidebar
        activeView="products"
        onNavigate={onNavigate}
        onOpenNewModal={() => setIsImportModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/90 bg-white px-6 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-2xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">Products Intelligence</h1>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-mono font-bold border border-blue-200">
                  {filteredProducts.length} / {totalProducts} Items
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage multi-market COD product dossiers, unit economics, and AI Vision analysis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={async () => {
                try {
                  const res = await fetch('/assets/aistudio/all_products_master_2026-10-17_2f10e9b8.json');
                  if (res.ok) {
                    const text = await res.text();
                    const { parseProductJsonInput } = await import('../../utils/productStore');
                    const parsed = parseProductJsonInput(text);
                    if (parsed.success && parsed.products.length > 0) {
                      const existing = loadProductsFromStorage();
                      const updated = [...parsed.products, ...existing.filter((p) => !new Set(parsed.products.map(x => x.id)).has(p.id))];
                      saveProductsToStorage(updated);
                      setProducts(updated);
                    }
                  }
                } catch (err) {
                  console.error('Error loading master collection:', err);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-all border border-blue-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Import all 10 researched products from Master JSON"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Import Master (10 Products)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('board')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180 text-slate-500" />
              <span>Back to Board</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add / Scan Product</span>
            </button>
          </div>
        </header>

        {/* Filters, Search & Date Filter Strip */}
        <div className="px-6 py-4 border-b border-slate-200/80 bg-white/90 space-y-3 shrink-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search bar */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product name, category, market, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-semibold">
              {[
                { id: 'All', label: `All (${totalProducts})` },
                { id: 'Researching', label: `Researching (${researchingCount})` },
                { id: 'Active', label: `Active (${activeCount})` },
                { id: 'Testing', label: `Testing` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter & Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mr-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Filter by Date:</span>
              </span>

              {[
                { id: 'all', label: 'All Dates' },
                { id: 'today', label: 'Today' },
                { id: '7days', label: 'Last 7 Days' },
                { id: '30days', label: 'Last 30 Days' },
                { id: 'custom', label: 'Custom Range' },
              ].map((dp) => (
                <button
                  key={dp.id}
                  type="button"
                  onClick={() => {
                    setDatePreset(dp.id as any);
                    if (dp.id !== 'custom') {
                      setDateFrom('');
                      setDateTo('');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    datePreset === dp.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                  }`}
                >
                  {dp.label}
                </button>
              ))}

              {/* Direct From / To Date Pickers */}
              <div className="flex items-center gap-1.5 ml-1">
                <span className="text-[10.5px] text-slate-400 font-mono">From:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-800 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                />
                <span className="text-[10.5px] text-slate-400 font-mono">To:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-800 font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
                />
                {(dateFrom || dateTo || datePreset !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setDatePreset('all');
                      setDateFrom('');
                      setDateTo('');
                    }}
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                    title="Clear date filter"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Sort Order Toggle */}
            <button
              type="button"
              onClick={() => setDateSort((prev) => (prev === 'newest' ? 'oldest' : 'newest'))}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowUpDown className="w-3 h-3 text-blue-600" />
              <span>Sort: {dateSort === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700">No products match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try clearing the date or search filter, or scan a new product via AI Image Scanner.
              </p>
              <div className="flex items-center gap-2 mt-2">
                {(datePreset !== 'all' || dateFrom || dateTo || searchQuery || statusFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setDatePreset('all');
                      setDateFrom('');
                      setDateTo('');
                      setSearchQuery('');
                      setStatusFilter('All');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  + Add Product
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => {
                const prodCurrency = prod.currency || 'DZD';
                const prodCountry = prod.country || 'DZ';
                const marketBadge = MARKET_FLAGS[prodCountry] || `🌍 ${prodCountry}`;
                const prodDateObj = getProductDate(prod);
                const formattedDate = prodDateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProductForPreview(prod)}
                    className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 flex flex-col justify-between transition-all group cursor-pointer hover:shadow-md relative overflow-hidden"
                  >
                    <div>
                      {/* Top image & status */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-3.5">
                        <img
                          src={prod.mainImage}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=500&h=500&fit=crop';
                          }}
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono shadow-xs ${
                              prod.status === 'Active'
                                ? 'bg-blue-600 text-white'
                                : 'bg-amber-500 text-white'
                            }`}
                          >
                            {prod.status}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] text-white font-mono font-bold">
                            {marketBadge} • {prodCurrency}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-white/95 border border-slate-200 text-[10px] font-mono font-bold text-blue-600 shadow-2xs">
                            Score {prod.opportunity?.overallScore ?? 52}/100
                          </span>
                        </div>

                        {/* Date Badge on Image Bottom Right */}
                        <div className="absolute bottom-2 right-2">
                          <span className="px-2 py-0.5 rounded-md bg-white/95 border border-slate-200 text-[9.5px] font-mono font-semibold text-slate-700 flex items-center gap-1 shadow-2xs">
                            <Calendar className="w-2.5 h-2.5 text-blue-600" />
                            <span>{formattedDate}</span>
                          </span>
                        </div>
                      </div>

                      {/* Category & Title */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono text-slate-400 block truncate uppercase tracking-wider font-semibold">
                          {prod.category || 'General E-commerce'}
                        </span>
                        {prod.language && (
                          <span className="text-[9.5px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 shrink-0">
                            {prod.language}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {prod.name}
                      </h3>

                      {/* Financials Strip */}
                      <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono font-bold">SELLING</span>
                          <span className="text-xs font-bold text-blue-600 font-mono">
                            {(prod.financials?.sellingPrice ?? 1400).toLocaleString()} {prodCurrency}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono font-bold">COST</span>
                          <span className="text-xs font-bold text-slate-700 font-mono">
                            {(prod.financials?.costPrice ?? 760).toLocaleString()} {prodCurrency}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono font-bold">ROI</span>
                          <span
                            className={`text-xs font-bold font-mono ${
                              (prod.financials?.roi ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {(prod.financials?.roi ?? 0) > 0 ? `+${prod.financials.roi}%` : `${prod.financials?.roi ?? 0}%`}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {prod.visualSummary || prod.intelligence?.evidenceNotes || prod.aiAnalysis?.marketingAngle || prod.source || 'Product research dossier'}
                      </p>
                    </div>

                    {/* Actions Bottom Bar */}
                    <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductForPreview(prod);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-700"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAddToBoard) {
                            onAddToBoard(prod);
                          } else {
                            onNavigate('board');
                          }
                        }}
                        className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        title="Add to Board"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>To Board</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadProductAsJson(prod);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Download JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {prod.id !== ATTACHED_UMBRELLA_PRODUCT.id && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteProduct(prod.id, e)}
                          className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProductPreviewModal
        product={selectedProductForPreview}
        isOpen={Boolean(selectedProductForPreview)}
        onClose={() => setSelectedProductForPreview(null)}
        onAddToBoard={(p) => {
          if (onAddToBoard) {
            onAddToBoard(p);
          } else {
            onNavigate('board');
          }
        }}
      />

      <ProductImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onProductAdded={handleProductAdded}
        onNavigate={onNavigate}
        onAddToBoard={(p) => {
          setIsImportModalOpen(false);
          if (onAddToBoard) {
            onAddToBoard(p);
          } else {
            onNavigate('board');
          }
        }}
      />
    </div>
  );
};
