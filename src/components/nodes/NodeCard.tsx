import React, { useState } from 'react';
import { WorkflowNode } from '../../types/workflow';
import { NodeIcon } from '../icons/NodeIcons';
import {
  User,
  Play,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ExternalLink,
  Phone,
  PhoneOff,
  ShoppingBag,
  ShoppingCart,
  Truck,
  RotateCcw,
  Check,
  TrendingUp,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

interface NodeCardProps {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: (nodeId: string, isMulti: boolean) => void;
  onUpdate: (updatedNode: WorkflowNode) => void;
  onStartConnection: (nodeId: string, handleId: string, position: 'left' | 'right' | 'top' | 'bottom', e: React.MouseEvent) => void;
  onExecuteNode?: (nodeId: string) => void;
  zoom: number;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onStartConnection,
  onExecuteNode,
  zoom,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(node.title);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() && titleValue !== node.title) {
      onUpdate({ ...node, title: titleValue.trim() });
    } else {
      setTitleValue(node.title);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id, e.shiftKey);
  };

  // Sticky Note (Yellow Goal Card from screenshot)
  if (node.type === 'sticky_note') {
    return (
      <div
        className={`absolute rounded-2xl p-4 bg-[#FEF9C3] border border-[#FDE047] shadow-sm cursor-move select-none transition-all ${
          isSelected ? 'ring-2 ring-amber-500 shadow-md' : 'hover:shadow-md'
        }`}
        style={{
          transform: `translate(${node.x}px, ${node.y}px)`,
          width: node.width || 230,
          minHeight: node.height || 120,
        }}
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-1.5 pb-2 mb-1.5 border-b border-amber-300/40">
          <span className="text-sm">💡</span>
          <span className="text-xs font-bold text-slate-800">Goal</span>
        </div>
        <textarea
          className="w-full h-16 bg-transparent text-xs text-slate-800 font-sans resize-none focus:outline-none placeholder-amber-600/60 leading-relaxed font-medium"
          value={node.description || 'Vendre des montres Garmin en Algérie avec paiement à la livraison (COD).'}
          onChange={(e) => onUpdate({ ...node, description: e.target.value })}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  const accent = node.accentColor || '#2563EB';
  const watchThumb = '/src/assets/images/garmin_smartwatch_product_1792688464563.jpg';

  // Helper for status dot & label
  const renderStatus = () => {
    const subtitle = node.subtitle || (node.status === 'active' ? 'Active' : node.status === 'completed' ? 'Completed' : 'Processing');
    let dotColor = 'bg-emerald-500';

    if (subtitle.includes('Active') || subtitle.includes('Completed') || subtitle.includes('Calculated')) {
      dotColor = 'bg-emerald-500';
    } else if (subtitle.includes('Generating') || subtitle.includes('In Progress')) {
      dotColor = 'bg-blue-500 animate-pulse';
    } else if (subtitle.includes('Researching')) {
      dotColor = 'bg-purple-500';
    } else if (subtitle.includes('Processing') || subtitle.includes('Rate: 28%')) {
      dotColor = 'bg-amber-500';
    } else if (subtitle.includes('Failed') || subtitle.includes('Returned')) {
      dotColor = 'bg-rose-500';
    }

    return (
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
        <span>{subtitle}</span>
      </div>
    );
  };

  return (
    <div
      id={`node-${node.id}`}
      className={`absolute group bg-white rounded-2xl border transition-all duration-150 select-none shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06),0_2px_6px_-2px_rgba(0,0,0,0.04)] ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-md z-30'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-sm z-10'
      }`}
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
        width: node.width,
        minHeight: node.height,
      }}
      onClick={handleCardClick}
    >
      {/* Input Handle (Left) */}
      <div
        className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-crosshair z-40 group/handle"
        onClick={(e) => {
          e.stopPropagation();
          onStartConnection(node.id, 'in', 'left', e);
        }}
        title="Input Handle: Drag to connect"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-400 group-hover/handle:border-blue-600 group-hover/handle:scale-125 transition-transform shadow-xs" />
      </div>

      {/* Output Handle (Right) */}
      <div
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-crosshair z-40 group/handle"
        onClick={(e) => {
          e.stopPropagation();
          onStartConnection(node.id, 'out', 'right', e);
        }}
        title="Output Handle: Drag to connect"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-400 group-hover/handle:border-blue-600 group-hover/handle:scale-125 transition-transform shadow-xs" />
      </div>

      {/* Card Header */}
      <div className="p-3 pb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Node Icon Box */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
            style={{ backgroundColor: accent }}
          >
            <NodeIcon name={node.type === 'phone_confirmation' ? 'WhatsApp' : node.type} size={16} className="text-white" />
          </div>

          <div className="min-w-0">
            {isEditingTitle ? (
              <input
                autoFocus
                type="text"
                className="text-xs font-bold text-slate-900 border-b border-blue-500 focus:outline-none w-full bg-transparent"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3
                onDoubleClick={() => setIsEditingTitle(true)}
                className="text-xs font-bold text-slate-900 truncate tracking-tight cursor-text"
                title="Double-click to rename"
              >
                {node.title}
              </h3>
            )}
            {renderStatus()}
          </div>
        </div>

        {/* Top-Right Audience / Badge */}
        {node.audienceBadge && (
          <div className="text-[11px] font-semibold text-slate-500 font-mono tabular-nums shrink-0">
            {node.audienceBadge}
          </div>
        )}
      </div>

      {/* Card Body by Node Specialization */}

      {/* 1. Meta Ads (with Watch thumbnail on left) */}
      {node.type === 'meta_ads' && (
        <div className="px-3 pb-3 flex items-center gap-3 pt-1">
          <img
            src={watchThumb}
            alt="Product"
            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
          />
          <div className="text-[11px] text-slate-600 space-y-0.5 leading-tight font-medium">
            <div>Spend: <span className="font-semibold text-slate-800">3,000 DZD</span></div>
            <div>Impressions: <span className="font-semibold text-slate-800">12.5K</span></div>
            <div>CTR: <span className="font-semibold text-slate-800">2.4%</span></div>
            <div>CPC: <span className="font-semibold text-slate-800">18 DZD</span></div>
          </div>
        </div>
      )}

      {/* 2. Product Research (Garmin Fenix 5S) */}
      {node.type === 'product_research' && (
        <div className="px-3 pb-3 flex items-center gap-2.5 pt-1">
          <img
            src={watchThumb}
            alt="Garmin"
            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div className="text-[11px] text-slate-600 leading-tight">
            <div className="font-semibold text-slate-800 truncate">Garmin Fenix 5S</div>
            <div className="text-slate-500 mt-0.5">Score: <span className="font-bold text-purple-700">78/100</span></div>
          </div>
        </div>
      )}

      {/* 3. Competitor Analysis */}
      {node.type === 'competitor' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 leading-snug space-y-0.5 pt-0.5">
          <div>5 competitors found</div>
          <div>Avg. price: <span className="font-semibold text-slate-800">34,800 DZD</span></div>
        </div>
      )}

      {/* 4. AI Creative (3 variations thumbnail strip) */}
      {node.type === 'ai_image_gen' && (
        <div className="px-3 pb-3 pt-0.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <img src={watchThumb} alt="Var 1" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
            <img src={watchThumb} alt="Var 2" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
            <img src={watchThumb} alt="Var 3" className="w-8 h-8 rounded-md object-cover border border-slate-200" />
          </div>
          <div className="text-[11px] text-slate-600 flex justify-between">
            <span>5 variations</span>
            <span>CTR est.: <strong className="text-slate-800">2.8%</strong></span>
          </div>
        </div>
      )}

      {/* 5. Ad Campaign */}
      {node.type === 'ad_creative' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>Budget: <span className="font-semibold text-slate-800">3,000 DZD</span></div>
          <div>ROAS: <span className="font-semibold text-slate-800">2.8</span></div>
        </div>
      )}

      {/* 6. Supplier (with China Flag 🇨🇳) */}
      {node.type === 'supplier' && (
        <div className="px-3 pb-3 flex items-center gap-2.5 pt-0.5">
          <div className="w-8 h-8 rounded-md bg-rose-50 border border-rose-200 flex items-center justify-center text-base shrink-0">
            🇨🇳
          </div>
          <div className="text-[11px] text-slate-600 space-y-0.5 leading-tight">
            <div>Cost: <span className="font-semibold text-slate-800">1,200 DZD</span></div>
            <div>Shipping: <span className="font-semibold text-slate-800">2,500 DZD</span></div>
          </div>
        </div>
      )}

      {/* 7. Product Score */}
      {node.type === 'product_score' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>Score: <span className="font-bold text-purple-700">78/100</span></div>
          <div>Status: <span className="font-semibold text-emerald-600">Good</span></div>
        </div>
      )}

      {/* 8. Landing Page (Mini Browser Mockup with Watch) */}
      {node.type === 'landing_page' && (
        <div className="px-3 pb-3 pt-0.5">
          <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center p-1.5 gap-2">
            <img
              src={watchThumb}
              alt="LP Watch"
              className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
            />
            <div className="text-[11px] text-slate-600 leading-tight">
              <div>Visitors: <span className="font-semibold text-slate-800">3.2K</span></div>
              <div>CVR: <span className="font-semibold text-emerald-600">4.7%</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 9. New Order */}
      {node.type === 'new_order' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>Orders: <span className="font-semibold text-slate-800">150</span></div>
          <div>Value: <span className="font-semibold text-slate-800">525,000 DZD</span></div>
        </div>
      )}

      {/* 10. Phone Confirmation */}
      {node.type === 'phone_confirmation' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>Confirmed: <span className="font-semibold text-emerald-600">112</span></div>
          <div>Pending: <span className="font-semibold text-slate-800">38</span></div>
          <div>Rate: <span className="font-semibold text-emerald-600">75%</span></div>
        </div>
      )}

      {/* 11. No Answer */}
      {node.type === 'customer_refusal' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div className="text-rose-600 font-medium">42 orders</div>
          <div>Rate: <span className="font-semibold text-rose-600">28%</span></div>
        </div>
      )}

      {/* 12. Dispatch */}
      {node.type === 'dispatch' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>Dispatched: <span className="font-semibold text-slate-800">105</span></div>
          <div>Delivery rate: <span className="font-semibold text-blue-600">90%</span></div>
        </div>
      )}

      {/* 13. Delivered */}
      {node.type === 'delivered' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>Delivered: <span className="font-semibold text-emerald-600">95</span></div>
          <div>Payment: <span className="font-semibold text-emerald-600">95%</span></div>
        </div>
      )}

      {/* 14. Revenue */}
      {node.type === 'revenue' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>Net Profit: <span className="font-bold text-emerald-600">8,200 DZD</span></div>
          <div>ROAS: <span className="font-semibold text-blue-600">2.8</span></div>
        </div>
      )}

      {/* 15. Failed Delivery */}
      {node.type === 'failed_delivery' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div className="text-rose-600">Count: <strong>6</strong></div>
          <div>Rate: <strong className="text-rose-600">5.7%</strong></div>
        </div>
      )}

      {/* 16. RTO */}
      {node.type === 'rto' && (
        <div className="px-3 pb-3 text-[11px] text-slate-600 space-y-0.5 pt-0.5">
          <div>12 orders</div>
          <div>RTO rate: <strong className="text-rose-600">25%</strong></div>
        </div>
      )}
    </div>
  );
};
