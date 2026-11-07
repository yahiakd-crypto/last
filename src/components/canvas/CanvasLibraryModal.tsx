import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Plus,
  Copy,
  Trash2,
  Pencil,
  ExternalLink,
  Layers,
  FolderKanban,
  Sparkles,
  ArrowRight,
  Check,
  Download,
  Upload,
  Calendar,
  Zap,
  Globe,
  Share2,
} from 'lucide-react';
import { WorkflowProject } from '../../types/workflow';
import { WORKFLOW_TEMPLATES } from '../../utils/templates';

interface CanvasLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  canvases: WorkflowProject[];
  activeCanvasId: string;
  onSelectCanvas: (canvasId: string) => void;
  onNewCanvas: (name?: string, templateId?: string) => void;
  onDuplicateCanvas: (canvasId: string) => void;
  onRenameCanvas: (canvasId: string, newName: string) => void;
  onDeleteCanvas: (canvasId: string) => void;
  onExportCanvas: (canvas: WorkflowProject) => void;
  onImportCanvas: (importedProject: WorkflowProject) => void;
}

export const CanvasLibraryModal: React.FC<CanvasLibraryModalProps> = ({
  isOpen,
  onClose,
  canvases,
  activeCanvasId,
  onSelectCanvas,
  onNewCanvas,
  onDuplicateCanvas,
  onRenameCanvas,
  onDeleteCanvas,
  onExportCanvas,
  onImportCanvas,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'my_canvases' | 'blueprints'>('my_canvases');

  if (!isOpen) return null;

  // Filter canvases
  const filteredCanvases = canvases.filter((canvas) => {
    const matchesSearch =
      canvas.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      canvas.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      canvas.nodes.some((n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'cod') {
      return (
        canvas.name.toLowerCase().includes('cod') ||
        canvas.nodes.some((n) => n.category === 'algeria_cod')
      );
    }
    if (activeCategory === 'ads') {
      return (
        canvas.name.toLowerCase().includes('ads') ||
        canvas.nodes.some((n) => n.category === 'acquisition' || n.category === 'creative')
      );
    }
    if (activeCategory === 'research') {
      return (
        canvas.name.toLowerCase().includes('intelligence') ||
        canvas.nodes.some((n) => n.category === 'product_intelligence')
      );
    }
    if (activeCategory === 'custom') {
      return canvas.nodes.length === 0 || canvas.name.toLowerCase().includes('custom') || canvas.name.toLowerCase().includes('untitled');
    }
    return true;
  });

  const handleStartRename = (canvas: WorkflowProject) => {
    setEditingId(canvas.id);
    setEditNameValue(canvas.name);
  };

  const handleSaveRename = (canvasId: string) => {
    if (editNameValue.trim()) {
      onRenameCanvas(canvasId, editNameValue.trim());
    }
    setEditingId(null);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          onImportCanvas({
            ...parsed,
            id: `canvas_imported_${Date.now()}`,
            name: `${parsed.name || 'Imported Canvas'} (Imported)`,
            updatedAt: new Date().toISOString(),
          });
        } else {
          console.warn('Invalid canvas file format: Missing nodes or edges array.');
        }
      } catch (err) {
        console.warn('Failed to parse JSON file.', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-200 flex flex-col gap-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  Canvas Project Library
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono">
                    {canvases.length} {canvases.length === 1 ? 'Canvas' : 'Canvases'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse, duplicate, create, and switch between your saved visual workflow canvases.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Import Button */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileImport}
                />
              </label>

              {/* New Canvas Button */}
              <button
                onClick={() => {
                  onNewCanvas();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Canvas</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs & Search Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Tabs: My Canvases vs Blueprints */}
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('my_canvases')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'my_canvases'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Canvases ({canvases.length})
              </button>
              <button
                onClick={() => setActiveTab('blueprints')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'blueprints'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Blueprint Templates</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search canvases by name, node type, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Only on My Canvases) */}
          {activeTab === 'my_canvases' && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: 'All Canvases', count: canvases.length },
                { id: 'cod', label: 'Algerian COD Funnels' },
                { id: 'ads', label: 'Traffic & Creative Testing' },
                { id: 'research', label: 'Product Intelligence' },
                { id: 'custom', label: 'Custom & Blank' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body / Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/50">
          {activeTab === 'my_canvases' ? (
            filteredCanvases.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-200/80 flex items-center justify-center text-slate-400 mb-3">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No canvases match your search</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Try clearing the search query or create a new blank canvas.
                </p>
                <button
                  onClick={() => onNewCanvas()}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Blank Canvas</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCanvases.map((canvas) => {
                  const isActive = canvas.id === activeCanvasId;
                  const isEditing = editingId === canvas.id;
                  const isConfirmingDelete = deleteConfirmId === canvas.id;

                  return (
                    <div
                      key={canvas.id}
                      className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group shadow-2xs hover:shadow-md ${
                        isActive
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Card Header & Preview Banner */}
                      <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          {/* Active / Status Badge */}
                          <div className="flex items-center gap-1.5">
                            {isActive ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active Now
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                Canvas Project
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold">
                              {canvas.settings.currency || 'DZD'}
                            </span>
                          </div>

                          {/* Quick Card Top Menu */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onDuplicateCanvas(canvas.id)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Duplicate Canvas"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onExportCanvas(canvas)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Export JSON"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Title (editable) */}
                        {isEditing ? (
                          <div className="flex items-center gap-1 mt-1">
                            <input
                              autoFocus
                              type="text"
                              value={editNameValue}
                              onChange={(e) => setEditNameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(canvas.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="flex-1 text-xs font-bold px-2 py-1 border border-blue-500 rounded-lg outline-none"
                            />
                            <button
                              onClick={() => handleSaveRename(canvas.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group/title">
                            <h3
                              onClick={() => {
                                onSelectCanvas(canvas.id);
                                onClose();
                              }}
                              className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors truncate"
                              title={canvas.name}
                            >
                              {canvas.name}
                            </h3>
                            <button
                              onClick={() => handleStartRename(canvas)}
                              className="opacity-0 group-hover/title:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 ml-1"
                              title="Rename"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {canvas.description || 'Custom interactive workflow pipeline.'}
                        </p>
                      </div>

                      {/* Card Content & Stats */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        {/* Metrics Pills */}
                        <div className="grid grid-cols-3 gap-2 py-2 mb-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-center">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-medium">Nodes</span>
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              {canvas.nodes?.length || 0}
                            </span>
                          </div>
                          <div className="border-x border-slate-200">
                            <span className="text-[9px] text-slate-400 block font-medium">Edges</span>
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              {canvas.edges?.length || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-medium">Grid</span>
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              {canvas.settings?.gridSize || 16}px
                            </span>
                          </div>
                        </div>

                        {/* Node Category Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {Array.from(new Set(canvas.nodes.map((n) => n.title)))
                            .slice(0, 3)
                            .map((title, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                              >
                                {title}
                              </span>
                            ))}
                          {canvas.nodes.length > 3 && (
                            <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md">
                              +{canvas.nodes.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          {/* Delete Action (with confirmation) */}
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-rose-600 font-bold">Delete?</span>
                              <button
                                onClick={() => {
                                  onDeleteCanvas(canvas.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-medium"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              disabled={canvases.length <= 1}
                              onClick={() => setDeleteConfirmId(canvas.id)}
                              className="text-slate-400 hover:text-rose-600 disabled:opacity-20 disabled:hover:text-slate-400 p-1.5 rounded hover:bg-rose-50 transition-colors"
                              title={
                                canvases.length <= 1
                                  ? 'Cannot delete the only canvas'
                                  : 'Delete canvas'
                              }
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Open / Switch Button */}
                          <button
                            onClick={() => {
                              onSelectCanvas(canvas.id);
                              onClose();
                            }}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                              isActive
                                ? 'bg-slate-900 text-white hover:bg-slate-800'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            <span>{isActive ? 'Switch to Active' : 'Open Canvas'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* Blueprints Gallery */
            <div className="space-y-4">
              <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Add Proven Blueprints to Your Canvas Library
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Clone enterprise-grade Algerian COD pipelines, Meta ad creative matrices, and product research funnels with a single click.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WORKFLOW_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {tmpl.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold">
                          {tmpl.nodeCount} Pre-configured Nodes
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tmpl.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 font-mono">
                        Currency: <span className="font-bold text-slate-700">DZD</span>
                      </div>
                      <button
                        onClick={() => {
                          onNewCanvas(tmpl.name, tmpl.id);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add as New Canvas</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Auto-Save:</span>
            <span>All open canvases are persistently saved in your local workspace.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
