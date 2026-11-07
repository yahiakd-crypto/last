import React, { useState } from 'react';
import { X, Plus, Sparkles, Layers, Box, Zap, Check } from 'lucide-react';
import { WORKFLOW_TEMPLATES } from '../../utils/templates';

interface NewCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, templateId?: string, currency?: 'DZD' | 'USD' | 'EUR') => void;
}

export const NewCanvasModal: React.FC<NewCanvasModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('blank');
  const [currency, setCurrency] = useState<'DZD' | 'USD' | 'EUR'>('DZD');

  if (!isOpen) return null;

  const starterOptions = [
    {
      id: 'blank',
      title: 'Blank Canvas',
      category: 'Clean Slate',
      description: 'Start with an empty infinite grid and build your custom nodes from scratch.',
      badge: 'Empty',
      icon: Box,
      accent: 'border-slate-300 text-slate-700',
    },
    {
      id: 'algeria_cod_complete_funnel',
      title: 'Algeria COD - Complete Funnel',
      category: 'Algerian E-commerce',
      description: 'Garmin smartwatch sales with Meta Ads, WhatsApp confirmation & Yalidine courier.',
      badge: '17 Nodes',
      icon: Zap,
      accent: 'border-blue-500 text-blue-600',
    },
    {
      id: 'tiktok_viral',
      title: 'TikTok Viral & Flash Sale COD',
      category: 'Viral Social Funnel',
      description: 'UGC video hooks, comment-to-DM automated responder & 48H urgency countdown.',
      badge: '5 Nodes',
      icon: Sparkles,
      accent: 'border-rose-500 text-rose-600',
    },
    {
      id: 'meta_ads_testing',
      title: 'Meta Ads & Creative Testing',
      category: 'Paid Advertising',
      description: 'Systematic creative testing matrix with video variations, ROAS & CTR benchmarks.',
      badge: '6 Nodes',
      icon: Layers,
      accent: 'border-indigo-500 text-indigo-600',
    },
    {
      id: 'product_intelligence_pipeline',
      title: 'Product Intelligence Pipeline',
      category: 'Product Research',
      description: 'Systematic product idea validation, margin calculator & competitor scraping.',
      badge: '8 Nodes',
      icon: Sparkles,
      accent: 'border-emerald-500 text-emerald-600',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName =
      name.trim() ||
      (selectedTemplate === 'blank'
        ? 'Untitled Workflow Canvas'
        : starterOptions.find((o) => o.id === selectedTemplate)?.title || 'New Canvas');

    onCreate(
      finalName,
      selectedTemplate === 'blank' ? undefined : selectedTemplate,
      currency
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Canvas</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add a new workflow canvas to your project library.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Canvas Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Canvas Name
            </label>
            <input
              type="text"
              placeholder="e.g. Algerian Ramadan COD Campaign, Meta Ads Test..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          {/* Currency Choice */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Currency
            </label>
            <div className="flex items-center gap-2">
              {(['DZD', 'USD', 'EUR'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    currency === curr
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {curr} {curr === 'DZD' && '(Algeria)'}
                </button>
              ))}
            </div>
          </div>

          {/* Starter Blueprint Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Choose Starter Blueprint or Blank
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
              {starterOptions.map((opt) => {
                const isSelected = selectedTemplate === opt.id;
                const IconComponent = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedTemplate(opt.id)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-900">{opt.title}</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Canvas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
