import React, { useState } from 'react';
import {
  RotateCcw,
  RotateCw,
  Play,
  Pause,
  Download,
  Share2,
  Settings,
  Layers,
  Sparkles,
  Search,
  Check,
  ChevronDown,
  Box,
  FileSpreadsheet,
  Zap,
  FolderKanban,
  Plus,
} from 'lucide-react';
import { WorkflowProject } from '../../types/workflow';

interface TopBarProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange?: (zoom: number) => void;
  onZoomReset: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  onOpenProductRecord: () => void;
  onOpenSearch: () => void;
  currency: 'DZD' | 'USD' | 'EUR';
  onCurrencyChange: (c: 'DZD' | 'USD' | 'EUR') => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
  particleStyle: 'people' | 'dots' | 'hybrid';
  onParticleStyleChange: (s: 'people' | 'dots' | 'hybrid') => void;
  onNavigateHome?: () => void;
  canvases?: WorkflowProject[];
  activeCanvasId?: string;
  onSelectCanvas?: (id: string) => void;
  onOpenCanvasLibrary?: () => void;
  onNewCanvas?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  projectName,
  onProjectNameChange,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  onZoomReset,
  isSimulating,
  onToggleSimulation,
  onOpenTemplates,
  onOpenExport,
  onOpenProductRecord,
  onOpenSearch,
  currency,
  onCurrencyChange,
  animationsEnabled,
  onToggleAnimations,
  particleStyle,
  onParticleStyleChange,
  onNavigateHome,
  canvases,
  activeCanvasId,
  onSelectCanvas,
  onOpenCanvasLibrary,
  onNewCanvas,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(projectName);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showZoomDropdown, setShowZoomDropdown] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  const handleNameSubmit = () => {
    setIsEditingName(false);
    if (nameInput.trim()) {
      onProjectNameChange(nameInput.trim());
    } else {
      setNameInput(projectName);
    }
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <header className="h-14 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between gap-4 z-30 select-none shadow-2xs">
      {/* Zone 1: Logo & Workspace / Project Breadcrumb (Screenshot 2 Match) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 group text-left cursor-pointer hover:opacity-90 transition-opacity"
          title="Return to Dashboard"
        >
          {/* Logo Mark */}
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Zap className="w-4.5 h-4.5 fill-white" />
          </div>
        </button>

        <div className="w-[1px] h-5 bg-slate-200 mx-1" />

        {/* Breadcrumb Selector: My Workspace / Algeria COD - Complete Funnel */}
        <div className="relative">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={onNavigateHome}
              className="text-slate-400 hover:text-slate-700 font-medium transition-colors"
            >
              My Workspace
            </button>
            <span className="text-slate-300 font-normal">/</span>

            {isEditingName ? (
              <input
                autoFocus
                type="text"
                className="text-xs font-bold text-slate-900 border-b-2 border-blue-600 focus:outline-none bg-transparent px-1 py-0.5"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              />
            ) : (
              <button
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="flex items-center gap-1 text-xs font-bold text-slate-800 hover:text-blue-600 px-1.5 py-1 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <span>{projectName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}

            {/* Save Status Checkmark */}
            <div className="flex items-center gap-1 ml-2 text-[11px] text-slate-400 font-medium">
              <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
              <span className="hidden sm:inline">Saved 2 min ago</span>
            </div>
          </div>

          {/* Workspace dropdown menu */}
          {showWorkspaceMenu && (
            <div
              className="absolute left-0 top-full mt-1.5 w-72 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Canvas Library</span>
                <span>{canvases?.length || 0} Saved</span>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-0.5 py-1">
                {canvases && canvases.length > 0 ? (
                  canvases.map((c) => {
                    const isCurrent = c.id === activeCanvasId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => {
                          if (onSelectCanvas) onSelectCanvas(c.id);
                          setShowWorkspaceMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-blue-50/70 text-blue-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isCurrent ? 'bg-blue-600' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">
                          {c.nodes?.length || 0}n
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <button
                    onClick={() => {
                      onProjectNameChange('Algeria COD - Complete Funnel');
                      setShowWorkspaceMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-50 text-slate-800 font-semibold flex items-center justify-between"
                  >
                    <span>Algeria COD - Complete Funnel</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">Active</span>
                  </button>
                )}
              </div>

              <div className="my-1 border-t border-slate-100" />

              {onNewCanvas && (
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    onNewCanvas();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-600 font-semibold flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Canvas</span>
                </button>
              )}

              {onOpenCanvasLibrary && (
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(false);
                    onOpenCanvasLibrary();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-2"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                  <span>Open Canvas Library...</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsEditingName(true);
                  setShowWorkspaceMenu(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
              >
                Rename current canvas
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links & Actions (Screenshot 2 Match) */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/60">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl + Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl + Y)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Selector Dropdown (Screenshot 2 shows "70%") */}
        <div className="relative">
          <button
            onClick={() => setShowZoomDropdown(!showZoomDropdown)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
          >
            <span>{zoomPercent}%</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showZoomDropdown && (
            <div
              className="absolute left-0 top-full mt-1.5 w-32 rounded-xl bg-white border border-slate-200 shadow-xl p-1 z-50 text-xs space-y-0.5"
              onClick={() => setShowZoomDropdown(false)}
            >
              {[50, 70, 85, 100, 125, 150].map((val) => (
                <button
                  key={val}
                  onClick={() => onZoomChange && onZoomChange(val / 100)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    zoomPercent === val ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {val}%
                </button>
              ))}
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={onZoomReset}
                className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Reset (100%)
              </button>
            </div>
          )}
        </div>

        {/* Quick Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-500 text-xs transition-colors w-44"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[11px] truncate">Search nodes...</span>
          <kbd className="ml-auto text-[9px] px-1 py-0.2 bg-white rounded border border-slate-200 text-slate-400 font-mono">⌘K</kbd>
        </button>

        {/* Template Gallery */}
        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Templates</span>
        </button>

        {/* Product Sourcing Record Modal */}
        <button
          onClick={onOpenProductRecord}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Box className="w-3.5 h-3.5 text-indigo-600" />
          <span>Product Intelligence</span>
        </button>
      </div>

      {/* Zone 3: Primary Actions (Preview in blue, Run in green, Share, User) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Preview Button (Blue, matching screenshot 2) */}
        <button
          onClick={onToggleSimulation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Preview</span>
        </button>

        {/* Run Workflow Button (Green, matching screenshot 2) */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
            isSimulating
              ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
            </>
          )}
        </button>

        {/* Share Icon */}
        <button
          onClick={onOpenExport}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Share workflow"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Export / Download Icon */}
        <button
          onClick={onOpenExport}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
          title="Download / Export"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Settings Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {showSettingsDropdown && (
            <div
              className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-white border border-slate-200 shadow-xl p-3 text-xs space-y-3 z-50 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Currency Mode
                </span>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-lg">
                  {(['DZD', 'USD', 'EUR'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => onCurrencyChange(curr)}
                      className={`py-1 text-[11px] font-semibold rounded-md ${
                        currency === curr ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Animation Flow
                </span>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                  <span className="text-slate-700">Particle Traffic</span>
                  <input
                    type="checkbox"
                    checked={animationsEnabled}
                    onChange={onToggleAnimations}
                    className="rounded text-blue-600"
                  />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Particle Style (Screenshot match)
                </span>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 p-0.5 rounded-lg">
                  <button
                    onClick={() => onParticleStyleChange('people')}
                    className={`py-1 text-[11px] font-semibold rounded-md ${
                      particleStyle === 'people' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    👤 People Icons
                  </button>
                  <button
                    onClick={() => onParticleStyleChange('dots')}
                    className={`py-1 text-[11px] font-semibold rounded-md ${
                      particleStyle === 'dots' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    ● Modern Dots
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-[1px] h-6 bg-slate-200 mx-0.5" />

        {/* User Profile: Yahia (Matching screenshots 1 and 2) */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-50 transition-colors text-left"
          title="Return to Dashboard"
        >
          <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
            Y
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline">Yahia</span>
        </button>
      </div>
    </header>
  );
};
