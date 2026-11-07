import React, { useState } from 'react';
import { WorkflowNode, WorkflowEdge } from '../../types/workflow';
import { NodeIcon } from '../icons/NodeIcons';
import { ALGERIAN_WILAYAS } from '../../utils/algeriaCOD';
import {
  X,
  Sparkles,
  Loader2,
  Play,
  Sliders,
  Database,
  GitBranch,
  Clock,
  Palette,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit2,
  MoreHorizontal,
  ChevronDown,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

interface NodeInspectorProps {
  selectedNode: WorkflowNode | null;
  selectedEdge: WorkflowEdge | null;
  allNodes: WorkflowNode[];
  allEdges?: WorkflowEdge[];
  onUpdateNode: (node: WorkflowNode) => void;
  onUpdateEdge: (edge: WorkflowEdge) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onClose: () => void;
  onRunAiAgent?: (nodeId: string, taskType: string, prompt: string) => Promise<void>;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  selectedEdge,
  allNodes,
  allEdges = [],
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge,
  onClose,
  onRunAiAgent,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'connections' | 'automation' | 'appearance'>('overview');
  const [isAiRunning, setIsAiRunning] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  if (!selectedNode && !selectedEdge) {
    return null;
  }

  // Edge Inspector View
  if (selectedEdge) {
    const sourceNode = allNodes.find((n) => n.id === selectedEdge.source);
    const targetNode = allNodes.find((n) => n.id === selectedEdge.target);

    return (
      <aside className="w-88 h-[calc(100vh-3.5rem)] bg-white border-l border-slate-200 shadow-lg flex flex-col z-30 shrink-0 select-none overflow-y-auto">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Connection Details</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Route</span>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between font-medium text-slate-800">
              <span className="truncate">{sourceNode?.title || selectedEdge.source}</span>
              <span className="text-slate-400 mx-2">→</span>
              <span className="truncate">{targetNode?.title || selectedEdge.target}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">Traffic Label / Badge</label>
            <input
              type="text"
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              value={selectedEdge.trafficLabel || ''}
              placeholder="e.g. 1.8% · 720 clics"
              onChange={(e) => onUpdateEdge({ ...selectedEdge, trafficLabel: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Conversion Rate (%)</label>
              <input
                type="number"
                step="0.1"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                value={selectedEdge.conversionRate ?? 100}
                onChange={(e) => onUpdateEdge({ ...selectedEdge, conversionRate: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Volume (ppl)</label>
              <input
                type="number"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono"
                value={selectedEdge.trafficVolume ?? 500}
                onChange={(e) => onUpdateEdge({ ...selectedEdge, trafficVolume: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">Connection Color</label>
            <div className="flex items-center gap-2">
              {['#2563EB', '#0284C7', '#7C3AED', '#D97706', '#059669', '#10B981', '#DC2626'].map((c) => (
                <button
                  key={c}
                  onClick={() => onUpdateEdge({ ...selectedEdge, color: c })}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    selectedEdge.color === c ? 'scale-110 border-slate-900 ring-2 ring-blue-500/20' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => onDeleteEdge(selectedEdge.id)}
              className="w-full px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Connection</span>
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Node Inspector View
  const node = selectedNode!;
  const watchThumb = '/src/assets/images/garmin_smartwatch_product_1792688464563.jpg';

  const outgoingEdges = allEdges.filter((e) => e.source === node.id);
  const incomingEdges = allEdges.filter((e) => e.target === node.id);

  const handleMetricChange = (key: string, val: any) => {
    onUpdateNode({
      ...node,
      metrics: {
        ...node.metrics,
        [key]: val,
      },
    });
  };

  const handleDataChange = (key: string, val: any) => {
    onUpdateNode({
      ...node,
      data: {
        ...node.data,
        [key]: val,
      },
    });
  };

  const handleRunAgent = async () => {
    if (!onRunAiAgent) return;
    setIsAiRunning(true);
    try {
      await onRunAiAgent(node.id, node.data?.taskType || 'product_validation', aiPrompt || node.description || node.title);
    } finally {
      setIsAiRunning(false);
    }
  };

  return (
    <aside className="w-88 h-[calc(100vh-3.5rem)] bg-white border-l border-slate-200/90 shadow-xl flex flex-col z-30 shrink-0 select-none overflow-hidden">
      {/* Inspector Top Bar (matching screenshot 2) */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
            style={{ backgroundColor: node.accentColor || '#2563EB' }}
          >
            <NodeIcon name={node.type} size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate leading-tight">{node.title}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11px] font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Bar: Overview | Data | Connections | Automation | Appearance */}
      <div className="flex items-center border-b border-slate-100 px-3 py-1 bg-white">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'data', label: 'Data' },
          { id: 'connections', label: 'Connections' },
          { id: 'automation', label: 'Automation' },
          { id: 'appearance', label: 'Appearance' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-2 text-[11px] font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* TAB: OVERVIEW (Matching exact layout from screenshot 2) */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Banner Card with Watch thumbnail & edit pencil */}
            <div className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50 to-indigo-50/60 p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={watchThumb}
                  alt="Campaign"
                  className="w-14 h-14 rounded-lg object-cover border border-blue-200 bg-white shadow-xs shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">Meta Ads Campaign</h4>
                  <p className="text-[11px] text-slate-600 leading-snug mt-0.5">
                    Reach the right audience with powerful Meta ads.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('data')}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-2xs shrink-0"
                title="Edit Details"
              >
                <Edit2 className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>

            {/* Details Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Details</span>
              <div className="space-y-2 text-[11px] text-slate-600">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Title</span>
                  <span className="font-semibold text-slate-800">{node.title}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Description</span>
                  <span className="font-medium text-slate-800 max-w-[180px] text-right truncate">
                    {node.description || 'Campaign for Garmin watches - Algeria (COD)'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Platform</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <span className="text-blue-600">♾️</span> Meta
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Status</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] flex items-center gap-1 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Spend (DZD)</span>
                  <span className="font-bold text-slate-900 font-mono">{(node.metrics?.spend || 3000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Impressions</span>
                  <span className="font-bold text-slate-900 font-mono">{(node.metrics?.impressions || 12500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Link CTR</span>
                  <span className="font-bold text-slate-900 font-mono">{node.metrics?.ctr || 2.4}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">CPC (DZD)</span>
                  <span className="font-bold text-slate-900 font-mono">{node.metrics?.cpc || 18}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Orders</span>
                  <span className="font-bold text-slate-900 font-mono">{node.metrics?.orders || 15}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">ROAS</span>
                  <span className="font-bold text-blue-600 font-mono">{node.metrics?.roas || 2.8}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-400">Last update</span>
                  <span className="font-mono text-slate-500 text-[10px]">2025-10-27 14:32</span>
                </div>
              </div>
            </div>

            {/* Tags Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {['Ads', 'Meta', 'Campaign'].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold flex items-center gap-1 border border-blue-100">
                  <Tag className="w-3 h-3 text-blue-500" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            {/* Connections Section */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-900 block">Connections</span>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Outgoing (2)</span>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">🌐</span>
                    <span className="font-semibold text-slate-800 text-[11px]">Landing Page</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">3.2K</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px]">🎨</span>
                    <span className="font-semibold text-slate-800 text-[11px]">Ad Creative</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">2.4K</span>
                </div>

                <span className="text-[10px] text-slate-400 uppercase tracking-wider block pt-1">Incoming (0)</span>
                <div className="p-2 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-center text-[11px]">
                  No incoming connections
                </div>
              </div>
            </div>

            {/* Primary Action: Edit Node */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('data')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Node</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: DATA & COD PRICING */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                Financials (DZD)
              </span>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Selling Price (DZD)</label>
                <input
                  type="number"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  value={node.data?.sellingPrice ?? 3500}
                  onChange={(e) => handleDataChange('sellingPrice', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Spend (DZD)</label>
                  <input
                    type="number"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800"
                    value={node.metrics?.spend ?? 3000}
                    onChange={(e) => handleMetricChange('spend', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">ROAS</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-blue-600 font-bold"
                    value={node.metrics?.roas ?? 2.8}
                    onChange={(e) => handleMetricChange('roas', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onDeleteNode(node.id)}
                className="w-full px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Node</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: CONNECTIONS */}
        {activeTab === 'connections' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-900 block">Manage Active Routes</span>
            <div className="space-y-2">
              {outgoingEdges.map((e) => (
                <div key={e.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-slate-700 font-medium">→ {e.trafficLabel || 'Route'}</span>
                  <button onClick={() => onDeleteEdge(e.id)} className="text-rose-500 hover:text-rose-700">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: AUTOMATION & AI */}
        {activeTab === 'automation' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/70 space-y-2.5">
              <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Gemini Strategy Agent</span>
              </div>
              <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                Autonomous AI analyzes Algerian customer desires, formulates Arabic/French hooks, and evaluates COD break-even safety margins.
              </p>

              <button
                onClick={handleRunAgent}
                disabled={isAiRunning}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {isAiRunning ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run AI Agent Now</span>
                  </>
                )}
              </button>
            </div>

            {node.data?.lastAiResult && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Latest AI Output
                </span>
                <div className="text-slate-800 whitespace-pre-line text-[11px] leading-relaxed max-h-48 overflow-y-auto">
                  {node.data.lastAiResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: APPEARANCE */}
        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Accent Color</label>
              <div className="flex items-center gap-2">
                {['#2563EB', '#0284C7', '#7C3AED', '#D97706', '#059669', '#10B981', '#DC2626'].map((c) => (
                  <button
                    key={c}
                    onClick={() => onUpdateNode({ ...node, accentColor: c })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      node.accentColor === c ? 'scale-110 border-slate-900 ring-2 ring-blue-500/20' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
