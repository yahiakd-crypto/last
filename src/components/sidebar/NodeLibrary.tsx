import React, { useState } from 'react';
import { LIBRARY_CATEGORIES, LibraryItem } from '../../utils/libraryDefinitions';
import { NodeIcon } from '../icons/NodeIcons';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  PanelLeftClose,
  PanelLeft,
  GripVertical,
  Home,
  Layers,
  Settings,
  BarChart2,
  FolderKanban,
  Video,
} from 'lucide-react';

interface NodeLibraryProps {
  isOpen: boolean;
  onToggle: () => void;
  onAddNode: (type: string) => void;
  onNavigateHome?: () => void;
  onNavigateProjects?: () => void;
  onNavigateResearch?: () => void;
  onNavigateAds?: () => void;
  onNavigateAnalytics?: () => void;
  onNavigateSettings?: () => void;
  onOpenTemplates?: () => void;
  onOpenSearch?: () => void;
}

export const NodeLibrary: React.FC<NodeLibraryProps> = ({
  isOpen,
  onToggle,
  onAddNode,
  onNavigateHome,
  onNavigateProjects,
  onNavigateResearch,
  onNavigateAds,
  onNavigateAnalytics,
  onNavigateSettings,
  onOpenTemplates,
  onOpenSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    acquisition: true,
    algeria_cod: true,
    conversion: true,
    analytics: true,
  });

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleDragStart = (e: React.DragEvent, item: LibraryItem) => {
    e.dataTransfer.setData('application/product-os-node', item.type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Filter categories and items based on search query
  const filteredCategories = LIBRARY_CATEGORIES.map((cat) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return cat;
    const matchingItems = cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
    return { ...cat, items: matchingItems };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] shrink-0 z-20 select-none">
      {/* 1. Permanent Left Icon Rail (Matching screenshot 2) */}
      <div className="w-12 h-full bg-white border-r border-slate-200/90 flex flex-col items-center justify-between py-3 z-30 shadow-2xs">
        {/* Top actions */}
        <div className="flex flex-col items-center gap-2">
          {/* Home icon - takes user back to Dashboard page */}
          <button
            onClick={onNavigateHome}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Dashboard Home (Screenshot 1)"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* Templates icon */}
          <button
            onClick={onOpenTemplates}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Workflow Templates"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Plus / Add Node Library button (Active indicator when open) */}
          <button
            onClick={onToggle}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              isOpen
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title="Toggle Node Library"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Search nodes */}
          <button
            onClick={onOpenSearch}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Search Nodes (⌘K)"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom actions */}
        <div className="flex flex-col items-center gap-2">
          {/* Ads Library button */}
          <button
            onClick={onNavigateAds}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Ads Library"
          >
            <Video className="w-4 h-4" />
          </button>

          {/* Analytics button */}
          <button
            onClick={onNavigateAnalytics}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Analytics Dashboard"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          {/* Product Research & Winning Product Finder */}
          <button
            onClick={onNavigateResearch || onNavigateHome}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Product Research"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onNavigateProjects || onNavigateHome}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Projects & Workflows"
          >
            <FolderKanban className="w-4 h-4" />
          </button>

          {/* Settings button */}
          <button
            onClick={onNavigateSettings}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Expandable Node Library Drawer */}
      {isOpen && (
        <aside className="w-72 h-full bg-white border-r border-slate-200/90 shadow-sm flex flex-col z-20 shrink-0 animate-in slide-in-from-left-4 duration-150">
      {/* Sidebar Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Node Library
          </h2>
          <p className="text-[11px] text-slate-400">
            Drag or double-click to add to canvas
          </p>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3 border-b border-slate-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            placeholder="Search all 64 node types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Categories List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2">
        {filteredCategories.map((category) => {
          const isCatOpen = searchQuery ? true : !!openCategories[category.id];

          return (
            <div
              key={category.id}
              className="rounded-xl border border-slate-200/60 overflow-hidden bg-slate-50/40"
            >
              {/* Category Header Accordion */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isCatOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className="text-xs font-semibold text-slate-800">
                    {category.name}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-600 font-mono font-medium">
                  {category.items.length}
                </span>
              </button>

              {/* Items List */}
              {isCatOpen && (
                <div className="px-1.5 pb-1.5 space-y-1">
                  {category.items.map((item) => (
                    <div
                      key={item.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      onDoubleClick={() => onAddNode(item.type)}
                      className="group flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/70 hover:border-blue-400 hover:shadow-xs cursor-grab active:cursor-grabbing transition-all select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Drag Handle Icon */}
                        <GripVertical className="w-3 h-3 text-slate-300 group-hover:text-slate-400 shrink-0" />

                        {/* Icon Box */}
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                          style={{ backgroundColor: item.defaultColor }}
                        >
                          <NodeIcon name={item.type} size={14} className="w-3.5 h-3.5 text-white" />
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate leading-tight group-hover:text-blue-600">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddNode(item.type);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-blue-50 text-blue-600 transition-opacity"
                        title="Add to Canvas"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  )}
</div>
  );
};
