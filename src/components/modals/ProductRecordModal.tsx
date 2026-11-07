import React, { useState } from 'react';
import { ProductRecord } from '../../types/workflow';
import { X, Box, Check, Calculator, ShieldAlert, Sparkles, FileText, Code } from 'lucide-react';

interface ProductRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  productRecord?: ProductRecord;
  onSaveRecord: (record: ProductRecord) => void;
}

export const ProductRecordModal: React.FC<ProductRecordModalProps> = ({
  isOpen,
  onClose,
  productRecord,
  onSaveRecord,
}) => {
  const [form, setForm] = useState<ProductRecord>(
    productRecord || {
      id: `prod_${Date.now()}`,
      name: 'Mini Mixeur Sans Fil Rechargeable USB',
      category: 'Kitchen & Fitness Appliances',
      supplierName: 'Yiwu Smart Life Co.',
      supplierUrl: 'https://1688.com/item/blender-6-blades',
      supplierCost: 1200,
      internationalShippingCost: 350,
      importHandlingCost: 150,
      localSellingPriceDZD: 3500,
      competitorSellingPrices: [3800, 4200, 3900],
      estimatedDemand: 'High',
      competitorCount: 4,
      targetCustomer: 'Active adults, gym enthusiasts, working women 20-40 in Wilayas 16, 31, 19, 25',
      customerPainPoint: 'Need fresh smoothies or protein shakes on-the-go without bulky kitchen equipment',
      uniqueSellingProposition: '6 stainless blades, 2000mAh battery (15 blends per charge), water-tight seal',
      productRisks: ['Rechargeable battery transport to southern Wilayas', 'Fragile clear cup requires bubble wrap'],
      evidenceSources: ['TikTok Algeria trending #mixeur_portable', 'Meta Ads Library 4 active competitors'],
      researchDate: new Date().toISOString().split('T')[0],
      productScore: 84,
      testingStatus: 'Scaling',
      notes: 'High margin, Yalidine standard weight bracket (<1kg).',
    }
  );

  const [jsonMode, setJsonMode] = useState(false);
  const [rawJson, setRawJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  if (!isOpen) return null;

  const landedCost = form.supplierCost + form.internationalShippingCost + form.importHandlingCost;
  const grossMargin = form.localSellingPriceDZD - landedCost;
  const grossMarginPct = Math.round((grossMargin / (form.localSellingPriceDZD || 1)) * 100);

  const handleSave = () => {
    if (jsonMode) {
      try {
        const parsed = JSON.parse(rawJson);
        setJsonError(null);
        onSaveRecord(parsed);
        onClose();
      } catch (err: any) {
        setJsonError('Invalid JSON: ' + (err?.message || 'Check syntax'));
      }
    } else {
      setJsonError(null);
      onSaveRecord(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Product Intelligence Record
              </h2>
              <p className="text-xs text-slate-500">
                Structured sourcing specification, unit margins & Algerian market validation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!jsonMode) setRawJson(JSON.stringify(form, null, 2));
                setJsonMode(!jsonMode);
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              {jsonMode ? 'Form View' : 'JSON Mode'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {jsonMode ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Edit Structured Product JSON
                </label>
                {jsonError && (
                  <span className="text-xs text-rose-600 font-medium">
                    {jsonError}
                  </span>
                )}
              </div>
              <textarea
                className="w-full h-96 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs focus:outline-none"
                value={rawJson}
                onChange={(e) => {
                  setRawJson(e.target.value);
                  if (jsonError) setJsonError(null);
                }}
              />
            </div>
          ) : (
            <>
              {/* Margin KPI Strip */}
              <div className="grid grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Landed Cost</span>
                  <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
                    {landedCost.toLocaleString()} DZD
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Selling Price</span>
                  <span className="text-sm font-bold text-slate-800 font-mono tabular-nums">
                    {form.localSellingPriceDZD.toLocaleString()} DZD
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Gross Margin</span>
                  <span className="text-sm font-bold text-emerald-600 font-mono tabular-nums">
                    +{grossMargin.toLocaleString()} DZD
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Validation Score</span>
                  <span className="text-sm font-bold text-indigo-600 font-mono tabular-nums">
                    {form.productScore} / 100
                  </span>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
              </div>

              {/* Sourcing & Costs */}
              <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Sourcing & Unit Economics (DZD)
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Supplier Unit Cost</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                      value={form.supplierCost}
                      onChange={(e) => setForm({ ...form, supplierCost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Intl Freight / Air</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                      value={form.internationalShippingCost}
                      onChange={(e) => setForm({ ...form, internationalShippingCost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Local Selling Price</label>
                    <input
                      type="number"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-blue-600"
                      value={form.localSellingPriceDZD}
                      onChange={(e) => setForm({ ...form, localSellingPriceDZD: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Supplier Name & Link</label>
                    <input
                      type="text"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                      value={form.supplierName}
                      onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Testing Status</label>
                    <select
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                      value={form.testingStatus}
                      onChange={(e) => setForm({ ...form, testingStatus: e.target.value as any })}
                    >
                      <option value="Idea">Idea</option>
                      <option value="Testing">Testing</option>
                      <option value="Validated">Validated</option>
                      <option value="Scaling">Scaling</option>
                      <option value="Dropped">Dropped</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Market Proposition */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Customer Pain Point & Desires
                  </label>
                  <textarea
                    className="w-full h-16 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    value={form.customerPainPoint}
                    onChange={(e) => setForm({ ...form, customerPainPoint: e.target.value })}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Unique Selling Proposition (USP)
                  </label>
                  <textarea
                    className="w-full h-16 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
                    value={form.uniqueSellingProposition}
                    onChange={(e) => setForm({ ...form, uniqueSellingProposition: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-[11px] text-slate-400">
            Updated: {form.researchDate}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-medium text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Record</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
