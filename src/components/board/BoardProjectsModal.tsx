import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  X,
  Search,
  Workflow,
  Sparkles,
  Calendar,
  Layers,
  Copy,
  Trash2,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { BoardProject } from '../../utils/boardProjects';

interface BoardProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: BoardProject[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export const BoardProjectsModal: React.FC<BoardProjectsModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  onDuplicateProject,
  onDeleteProject,
}) => {
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200/90 flex items-center justify-between shrink-0 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Board Projects Library</h2>
              <p className="text-xs text-slate-500">
                View, switch between, and open any board projects created before ({projects.length} saved)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNewProject();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar & Stats */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between gap-4 bg-white shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search your saved board projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Showing {filtered.length} of {projects.length} projects
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50">
          {filtered.map((project) => {
            const isActive = project.id === activeProjectId;
            const nodeCount = project.nodes?.length || 0;
            const edgeCount = project.edges?.length || 0;
            const stickyCount = project.stickyNotes?.length || 0;
            const productNode = project.nodes?.find((n) => n.isProduct);

            return (
              <div
                key={project.id}
                className={`relative bg-white rounded-2xl border p-4.5 transition-all flex flex-col justify-between shadow-2xs hover:shadow-md ${
                  isActive
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top line: Active badge & Created timestamp */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                          isActive
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Workflow className="w-4 h-4" />
                      </div>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          <CheckCircle2 className="w-3 h-3" />
                          Currently Open
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(project.updatedAt || project.createdAt)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {project.description ||
                      `${nodeCount} active skill nodes configured with live intelligence and Algeria COD logistics.`}
                  </p>

                  {/* Product Tag if present */}
                  {productNode && productNode.productData && (
                    <div className="mb-3 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-2 text-xs">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-800 truncate">
                        {productNode.title || productNode.config?.name || 'Linked Product'}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 font-bold ml-auto shrink-0">
                        {productNode.productData.sellingPrice?.toLocaleString()} DZD
                      </span>
                    </div>
                  )}

                  {/* Badges: Nodes, Links, Sticky notes */}
                  <div className="flex items-center gap-2 flex-wrap text-[11px] mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {nodeCount} {nodeCount === 1 ? 'Skill Node' : 'Skill Nodes'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {edgeCount} {edgeCount === 1 ? 'Connection' : 'Connections'}
                    </span>
                    {stickyCount > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 font-medium">
                        {stickyCount} Notes
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Duplicate */}
                    <button
                      onClick={() => onDuplicateProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Duplicate this project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    {projects.length > 1 && (
                      <>
                        {deleteConfirmId === project.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                onDeleteProject(project.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-1.5 py-1 text-slate-400 hover:text-slate-600 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(project.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete this project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Primary Open Button */}
                  <button
                    onClick={() => {
                      onSelectProject(project.id);
                      onClose();
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <span>{isActive ? 'View Canvas' : 'Open Project'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-2 py-12 text-center text-slate-400">
              <FolderKanban className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No board projects found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
