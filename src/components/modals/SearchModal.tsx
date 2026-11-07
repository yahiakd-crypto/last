import React, { useState } from 'react';
import { WorkflowNode } from '../../types/workflow';
import { NodeIcon } from '../icons/NodeIcons';
import { Search, X, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: WorkflowNode[];
  onSelectAndFocusNode: (nodeId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  nodes,
  onSelectAndFocusNode,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = nodes.filter((n) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      n.title.toLowerCase().includes(q) ||
      (n.subtitle && n.subtitle.toLowerCase().includes(q)) ||
      (n.description && n.description.toLowerCase().includes(q)) ||
      n.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-slate-100 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1.5" />
          <input
            autoFocus
            type="text"
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            placeholder="Type node name, category, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching nodes found.
            </div>
          ) : (
            filtered.map((node) => (
              <div
                key={node.id}
                onClick={() => {
                  onSelectAndFocusNode(node.id);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: node.accentColor || '#2563EB' }}
                  >
                    <NodeIcon name={node.type} size={14} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{node.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{node.subtitle || node.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {node.audienceBadge && (
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                      {node.audienceBadge}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
