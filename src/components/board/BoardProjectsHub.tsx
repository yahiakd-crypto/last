import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Workflow,
  Copy,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  ShoppingBag,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  ArrowLeft,
  Home,
  Check,
} from 'lucide-react';
import { BoardProject } from '../../types/board';

interface BoardProjectsHubProps {
  projects: BoardProject[];
  activeProjectId: string;
  onOpenProject: (projectId: string) => void;
  onNewProject: () => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onExportProject?: (project: BoardProject) => void;
  onNavigateHome: () => void;
}

export const BoardProjectsHub: React.FC<BoardProjectsHubProps> = ({
  projects,
  activeProjectId,
  onOpenProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
  onExportProject,
  onNavigateHome,
}) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'draft'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filter projects by search and status
  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;

    const nodeCount = p.nodes?.length || 0;
    if (activeFilter === 'in_progress') return nodeCount > 0;
    if (activeFilter === 'draft') return nodeCount === 0;
    return true;
  });

  // Export JSON helper
  const handleDownloadJson = (project: BoardProject, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `${project.name.replace(/\s+/g, '_').toLowerCase()}_board.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.warn('Failed to export project', err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F8FAFC] text-slate-800 font-sans select-none overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Return to Home Dashboard"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold hidden sm:inline">Home</span>
          </button>

          <span className="text-slate-300">/</span>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">Board Projects</h1>
              <span className="text-[10px] text-slate-400 font-medium block">
                {projects.length} Saved Projects
              </span>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search board projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Filter Tabs Sub-header */}
      <div className="px-6 py-3 bg-white border-b border-slate-200/70 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'in_progress'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In Progress ({projects.filter((p) => (p.nodes?.length || 0) > 0).length})
          </button>
          <button
            onClick={() => setActiveFilter('draft')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeFilter === 'draft'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Drafts ({projects.filter((p) => (p.nodes?.length || 0) === 0).length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filtered.length} of {projects.length}
        </span>
      </div>

      {/* Main Grid: Projects matching user image image_ddb7176c.png */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((project) => {
            const nodeCount = project.nodes?.length || 0;
            const productNode = project.nodes?.find((n) => n.isProduct);
            const status = nodeCount > 0 ? 'In Progress' : 'Draft';
            const progressPct = Math.min(100, Math.round((nodeCount / 17) * 100));

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col overflow-hidden group"
              >
                {/* 1. TOP BANNER: Light Dashboard Theme with subtle blue gradient & Status Pill */}
                <div className="h-36 sm:h-40 bg-gradient-to-br from-slate-50 via-blue-50/70 to-indigo-50/80 border-b border-slate-200/70 relative flex items-center justify-center overflow-hidden">
                  {/* Subtle decorative grid pattern matching Home Dashboard */}
                  <div
                    className="absolute inset-0 opacity-35 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* If product has image, show subtle backdrop */}
                  {productNode?.productData?.image ? (
                    <img
                      src={productNode.productData.image}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}

                  {/* Centered Icon Badge & Large 'P' watermark */}
                  <div className="relative z-10 flex flex-col items-center justify-center gap-1.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-blue-200/80 shadow-xs flex items-center justify-center text-blue-600 font-black text-xl tracking-tight group-hover:scale-105 group-hover:border-blue-300 transition-all">
                      P
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200/80">
                      {nodeCount} {nodeCount === 1 ? 'Node' : 'Nodes'} • {project.edges?.length || 0} {project.edges?.length === 1 ? 'Link' : 'Links'}
                    </span>
                  </div>

                  {/* Top-Right Status Pill Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className={`text-[11px] font-bold px-3 py-0.5 rounded-full border shadow-2xs ${
                        status === 'In Progress'
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>

                {/* 2. CARD CONTENT: Title, subtitle, progress bar, action buttons */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    {/* Project Title */}
                    <h3
                      onClick={() => onOpenProject(project.id)}
                      className="font-bold text-sm text-slate-900 truncate mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                      title={project.name}
                    >
                      {project.name}
                    </h3>

                    {/* Subtitle / Product info */}
                    <p className="text-[11.5px] text-slate-500 truncate mb-2">
                      {productNode
                        ? `${productNode.title || 'Product'} — active • S${nodeCount}/17 • ${progressPct}%`
                        : `No product yet • S${nodeCount}/17 • ${progressPct}%`}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(progressPct, nodeCount > 0 ? 15 : 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons Row: [Open] [Copy] [Download] [Delete] */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {/* Open Button (Dashboard Theme Blue) */}
                    <button
                      onClick={() => onOpenProject(project.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl flex items-center justify-center shadow-xs transition-all cursor-pointer"
                    >
                      Open
                    </button>

                    {/* Duplicate Button */}
                    <button
                      onClick={() => onDuplicateProject(project.id)}
                      className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Export/Download Button */}
                    <button
                      onClick={(e) => handleDownloadJson(project, e)}
                      className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Export board as JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button (Red outline/fill) */}
                    {deleteConfirmId === project.id ? (
                      <div className="flex items-center gap-1 ml-auto">
                        <button
                          onClick={() => {
                            onDeleteProject(project.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold hover:bg-rose-700 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1 py-1 text-slate-400 text-[10px] hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(project.id)}
                        className="p-1.5 rounded-md bg-rose-50 border border-rose-200 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Plus Create New Card */}
          <div
            onClick={onNewProject}
            className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/30 transition-all p-8 flex flex-col items-center justify-center cursor-pointer min-h-[260px] text-center group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all mb-3 shadow-2xs">
              <Plus className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors block">
              Create New Board Project
            </span>
            <span className="text-xs text-slate-400 mt-1 block">
              Start with empty canvas or pre-built COD funnel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
