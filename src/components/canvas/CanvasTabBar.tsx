import React, { useState, useRef, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  X,
  Copy,
  Pencil,
  Trash2,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { WorkflowProject } from '../../types/workflow';

interface CanvasTabBarProps {
  canvases: WorkflowProject[];
  openCanvasIds: string[];
  activeCanvasId: string;
  onSelectCanvas: (canvasId: string) => void;
  onCloseTab: (canvasId: string) => void;
  onOpenLibraryModal: () => void;
  onOpenNewCanvasModal: () => void;
  onDuplicateCanvas: (canvasId: string) => void;
  onRenameCanvas: (canvasId: string, newName: string) => void;
  onDeleteCanvas: (canvasId: string) => void;
}

export const CanvasTabBar: React.FC<CanvasTabBarProps> = ({
  canvases,
  openCanvasIds,
  activeCanvasId,
  onSelectCanvas,
  onCloseTab,
  onOpenLibraryModal,
  onOpenNewCanvasModal,
  onDuplicateCanvas,
  onRenameCanvas,
  onDeleteCanvas,
}) => {
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [tabContextMenu, setTabContextMenu] = useState<{
    canvasId: string;
    x: number;
    y: number;
  } | null>(null);

  const quickAddRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setShowQuickAddMenu(false);
      }
      setTabContextMenu(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const openCanvases = canvases.filter((c) => openCanvasIds.includes(c.id));
  const activeCanvas = canvases.find((c) => c.id === activeCanvasId);

  const handleStartRename = (canvas: WorkflowProject) => {
    setEditingCanvasId(canvas.id);
    setEditName(canvas.name);
  };

  const handleFinishRename = (canvasId: string) => {
    if (editName.trim()) {
      onRenameCanvas(canvasId, editName.trim());
    }
    setEditingCanvasId(null);
  };

  return (
    <div className="h-10 bg-slate-100/90 border-b border-slate-200/90 flex items-center justify-between px-3 z-20 select-none text-xs">
      {/* Left: Library Toggle & Canvas Tabs Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {/* Library Button */}
        <button
          onClick={onOpenLibraryModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-semibold shadow-2xs transition-all shrink-0 group"
          title="Open Canvas Project Library"
        >
          <FolderKanban className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition-transform" />
          <span className="font-medium text-[11px]">Canvas Library</span>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 font-mono">
            {canvases.length}
          </span>
        </button>

        <div className="w-[1px] h-4 bg-slate-300 mx-1 shrink-0" />

        {/* Canvas Tabs */}
        {openCanvases.map((canvas) => {
          const isActive = canvas.id === activeCanvasId;
          const isEditing = editingCanvasId === canvas.id;

          return (
            <div
              key={canvas.id}
              onClick={() => onSelectCanvas(canvas.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                setTabContextMenu({
                  canvasId: canvas.id,
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
              className={`group relative flex items-center gap-2 px-3 py-1 rounded-t-lg transition-all cursor-pointer shrink-0 border-t-2 ${
                isActive
                  ? 'bg-white text-slate-900 border-t-blue-600 font-semibold shadow-2xs border-x border-slate-200/90'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border-t-transparent'
              }`}
            >
              {/* Category / Status Indicator Dot */}
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isActive ? 'bg-blue-600 animate-pulse' : 'bg-slate-300 group-hover:bg-slate-400'
                }`}
              />

              {/* Title or Inline Edit Input */}
              {isEditing ? (
                <input
                  autoFocus
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleFinishRename(canvas.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFinishRename(canvas.id);
                    if (e.key === 'Escape') setEditingCanvasId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-32 bg-white text-xs font-semibold px-1 py-0.5 border border-blue-500 rounded outline-none"
                />
              ) : (
                <span
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleStartRename(canvas);
                  }}
                  className="max-w-[150px] truncate text-[11px]"
                  title={`${canvas.name} (Double-click to rename)`}
                >
                  {canvas.name}
                </span>
              )}

              {/* Node Count Pill */}
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  isActive ? 'bg-slate-100 text-slate-600' : 'text-slate-400'
                }`}
              >
                {canvas.nodes?.length || 0}n
              </span>

              {/* Close Tab Button (allowed if more than 1 tab open) */}
              {openCanvases.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(canvas.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:bg-slate-200/80 p-0.5 rounded text-slate-400 hover:text-slate-700 transition-opacity ml-0.5"
                  title="Close tab (keeps project in library)"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Plus Tab Button */}
        <div className="relative shrink-0" ref={quickAddRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickAddMenu(!showQuickAddMenu);
            }}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
            title="Create or open canvas..."
          >
            <Plus className="w-3.5 h-3.5" />
          </button>

          {/* Quick Add Popover */}
          {showQuickAddMenu && (
            <div
              className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowQuickAddMenu(false);
                  onOpenNewCanvasModal();
                }}
                className="w-full text-left px-3 py-2 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 text-slate-800 font-semibold"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>New Blank Canvas</span>
              </button>

              <div className="h-[1px] bg-slate-100 my-1" />

              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Canvases in Library
              </div>

              {canvases
                .filter((c) => !openCanvasIds.includes(c.id))
                .slice(0, 4)
                .map((closedCanvas) => (
                  <button
                    key={closedCanvas.id}
                    onClick={() => {
                      setShowQuickAddMenu(false);
                      onSelectCanvas(closedCanvas.id);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-slate-700"
                  >
                    <span className="truncate max-w-[130px]">{closedCanvas.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {closedCanvas.nodes?.length || 0}n
                    </span>
                  </button>
                ))}

              <div className="h-[1px] bg-slate-100 my-1" />

              <button
                onClick={() => {
                  setShowQuickAddMenu(false);
                  onOpenLibraryModal();
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-600 font-medium"
              >
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Browse Full Library...</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Active Info & Action Buttons */}
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        {activeCanvas && (
          <div className="text-[11px] text-slate-400 font-mono hidden md:inline">
            <span className="text-slate-600 font-bold">{activeCanvas.nodes?.length || 0}</span> nodes ·{' '}
            <span className="text-slate-600 font-bold">{activeCanvas.edges?.length || 0}</span> edges
          </div>
        )}

        {/* Duplicate Current Canvas */}
        {activeCanvas && (
          <button
            onClick={() => onDuplicateCanvas(activeCanvas.id)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
            title="Duplicate current canvas"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}

        {/* + New Canvas Primary Button */}
        <button
          onClick={onOpenNewCanvasModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow-2xs transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>New Canvas</span>
        </button>
      </div>

      {/* Tab Context Menu */}
      {tabContextMenu && (
        <div
          className="fixed bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-44 text-xs z-50 select-none animate-in fade-in zoom-in-95"
          style={{ left: tabContextMenu.x, top: tabContextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const target = canvases.find((c) => c.id === tabContextMenu.canvasId);
              if (target) handleStartRename(target);
              setTabContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-400" />
            <span>Rename Canvas</span>
          </button>

          <button
            onClick={() => {
              onDuplicateCanvas(tabContextMenu.canvasId);
              setTabContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Duplicate Canvas</span>
          </button>

          <div className="h-[1px] bg-slate-100 my-1" />

          {openCanvases.length > 1 && (
            <button
              onClick={() => {
                onCloseTab(tabContextMenu.canvasId);
                setTabContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left text-slate-600 hover:bg-slate-50 flex items-center gap-2"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
              <span>Close Tab</span>
            </button>
          )}

          {canvases.length > 1 && (
            <button
              onClick={() => {
                onDeleteCanvas(tabContextMenu.canvasId);
                setTabContextMenu(null);
              }}
              className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Delete from Library</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
