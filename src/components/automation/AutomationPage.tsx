import React, { useState } from 'react';
import {
  Zap,
  Play,
  Pause,
  Plus,
  MessageSquare,
  TrendingUp,
  ShoppingCart,
  ShieldAlert,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { AppSidebar } from '../navigation/AppSidebar';
import { AppHeader } from '../navigation/AppHeader';

interface AutomationPageProps {
  onNavigate: (view: string, subItem?: string) => void;
  onOpenSearchModal?: () => void;
}

export const AutomationPage: React.FC<AutomationPageProps> = ({ onNavigate, onOpenSearchModal }) => {
  const [workflows, setWorkflows] = useState([
    {
      id: 'wf-1',
      title: 'WhatsApp Instant Order Audio & Text Confirmation',
      description: 'Sends instant WhatsApp audio message in Algerian Darija confirming delivery address & wilaya within 3 minutes of checkout.',
      trigger: 'New Order Created',
      action: 'Send WhatsApp + Webhook to Yalidine',
      status: 'active',
      runs24h: 142,
      savedRTO: '24 orders saved',
      icon: MessageSquare,
      color: '#25D366',
    },
    {
      id: 'wf-2',
      title: 'High ROAS Campaign Auto-Scale Budget',
      description: 'Automatically increases Meta Ads daily budget by 15% when ROAS exceeds 4.5x over the last 24 hours.',
      trigger: 'ROAS > 4.5x for 24h',
      action: 'Scale Adset Budget +15%',
      status: 'active',
      runs24h: 8,
      savedRTO: '+48,000 DZD revenue',
      icon: TrendingUp,
      color: '#2563EB',
    },
    {
      id: 'wf-3',
      title: 'Wilaya RTO Risk Blacklist & Deposit Enforcer',
      description: 'Flags phone numbers with previous unpaid returned deliveries and requires confirmation audio before dispatching.',
      trigger: 'Customer Phone matches return list',
      action: 'Hold fulfillment + Alert Call Center',
      status: 'active',
      runs24h: 19,
      savedRTO: '68,000 DZD shipping saved',
      icon: ShieldAlert,
      color: '#EF4444',
    },
    {
      id: 'wf-4',
      title: 'Abandoned Checkout Recovery SMS',
      description: 'Sends SMS discount offer 30 minutes after customer enters phone number in checkout but exits before confirmation.',
      trigger: 'Abandoned Checkout (30m)',
      action: 'Send SMS with Free Shipping to Algiers/Oran',
      status: 'paused',
      runs24h: 0,
      savedRTO: '12 recovered last week',
      icon: ShoppingCart,
      color: '#F59E0B',
    },
  ]);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === 'active' ? 'paused' : 'active' } : w
      )
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      <AppSidebar activeView="automation" onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AppHeader
          breadcrumbs={[
            { label: 'Automation', isCurrent: true },
          ]}
          onOpenSearchModal={onOpenSearchModal}
          currentCountry="Algeria"
        />

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/70">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  E-commerce & COD Automations
                </h1>
                <p className="text-xs text-slate-500">
                  Set up trigger-action rules for WhatsApp confirmation, Meta ad budget scaling, and RTO prevention.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const newRule = {
                  id: `wf-${Date.now()}`,
                  title: 'Custom Wilaya Lead Validator',
                  description: 'Validates Algerian phone numbers (05, 06, 07) and tags Wilaya for fast dispatch.',
                  trigger: 'Order submission',
                  action: 'Validate Phone & Route Order',
                  status: 'active',
                  runs24h: 1,
                  savedRTO: 'Active',
                  icon: Zap,
                  color: '#3B82F6',
                };
                setWorkflows((prev) => [newRule, ...prev]);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Automation Rule</span>
            </button>
          </div>

          {/* Workflow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workflows.map((wf) => {
              const Icon = wf.icon;
              const isActive = wf.status === 'active';
              return (
                <div
                  key={wf.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: wf.color }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug">
                            {wf.title}
                          </h3>
                          <span className="text-[10px] text-slate-400">
                            Trigger: <span className="text-slate-700 font-semibold">{wf.trigger}</span>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleWorkflow(wf.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isActive ? 'Active' : 'Paused'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {wf.description}
                    </p>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">Action:</span>
                      <span className="font-semibold text-blue-600">{wf.action}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{wf.runs24h} executions past 24h</span>
                    </div>
                    <span className="font-semibold text-emerald-600">{wf.savedRTO}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
