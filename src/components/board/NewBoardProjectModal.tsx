import React, { useState } from 'react';
import {
  Plus,
  X,
  Workflow,
  Sparkles,
  ShoppingBag,
  Flame,
  Check,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface NewBoardProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, templateId: 'blank' | 'algeria_cod' | 'tiktok_scaler') => void;
}

export const NewBoardProjectModal: React.FC<NewBoardProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'blank' | 'algeria_cod' | 'tiktok_scaler'>('blank');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name.trim() || 'Untitled Board Project', selectedTemplate);
    setName('');
    setSelectedTemplate('blank');
    onClose();
  };

  const templates = [
    {
      id: 'blank' as const,
      title: 'Clean Empty Canvas',
      subtitle: 'Start with 0 nodes and freely add from 670 AI skills and product catalog.',
      badge: 'Most Flexible',
      badgeColor: 'bg-slate-100 text-slate-700',
      icon: Layers,
      iconBg: 'bg-slate-800 text-white',
    },
    {
      id: 'algeria_cod' as const,
      title: 'Algeria COD Sales Funnel',
      subtitle: 'Pre-loaded with verified product card, Meta Ads creative angles, and 58 Wilaya COD logistics.',
      badge: 'Algeria COD',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: ShoppingBag,
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      id: 'tiktok_scaler' as const,
      title: 'TikTok Viral Dropship Scaler',
      subtitle: 'Short-form UGC video hooks, demonstration angles, and stop-desk delivery rate optimizer.',
      badge: 'High Conversion',
      badgeColor: 'bg-rose-100 text-rose-800',
      icon: Flame,
      iconBg: 'bg-rose-600 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between shrink-0 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Board Project</h2>
              <p className="text-xs text-slate-500">
                Start a fresh canvas or choose a high-converting starter workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Project Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Project Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ultrasonic Dental Scaler COD, Hair Straightener Ads..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Starting Template
            </label>
            <div className="space-y-2.5">
              {templates.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;

                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplate(tmpl.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tmpl.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-xs text-slate-900">{tmpl.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tmpl.badgeColor}`}>
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {tmpl.subtitle}
                      </p>
                    </div>
                    <div className="pt-1">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <span>Create & Open Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
