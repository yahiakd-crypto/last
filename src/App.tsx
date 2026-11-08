import React, { useState, useEffect, useCallback } from 'react';
import { WorkflowProject, WorkflowNode, WorkflowEdge, ProductRecord } from './types/workflow';
import { WORKFLOW_TEMPLATES } from './utils/templates';
import { LIBRARY_CATEGORIES } from './utils/libraryDefinitions';
import { calculateCODMetrics, propagateGraphMetrics } from './utils/algeriaCOD';
import {
  loadCanvasesFromStorage,
  saveCanvasesToStorage,
  loadOpenCanvasIds,
  saveOpenCanvasIds,
  loadActiveCanvasId,
  saveActiveCanvasId,
  createNewCanvasOptions,
} from './utils/canvasLibrary';
import { TopBar } from './components/topbar/TopBar';
import { CanvasTabBar } from './components/canvas/CanvasTabBar';
import { CanvasLibraryModal } from './components/canvas/CanvasLibraryModal';
import { NewCanvasModal } from './components/canvas/NewCanvasModal';
import { NodeLibrary } from './components/sidebar/NodeLibrary';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { NodeInspector } from './components/inspector/NodeInspector';
import { TemplatesModal } from './components/modals/TemplatesModal';
import { ExportModal } from './components/modals/ExportModal';
import { ProductRecordModal } from './components/modals/ProductRecordModal';
import { SearchModal } from './components/modals/SearchModal';
import { SimulationBar } from './components/modals/SimulationBar';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ProjectsPage } from './components/projects/ProjectsPage';
import { ProductResearchPage } from './components/research/ProductResearchPage';
import { TemplatesPage } from './components/templates/TemplatesPage';
import { AdsLibraryPage } from './components/ads/AdsLibraryPage';
import { AnalyticsDashboardPage } from './components/analytics/AnalyticsDashboardPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { OrdersPage } from './components/orders/OrdersPage';
import { AutomationPage } from './components/automation/AutomationPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { BoardPage } from './components/board/BoardPage';
import { ProductsPage } from './components/products/ProductsPage';
import { AppSidebar } from './components/navigation/AppSidebar';
import { LandingPageGeneratorApp } from './components/board/LandingPageGeneratorApp';
import { AdTrackerPage } from './components/ad-tracker/AdTrackerPage';
import { CODBreakdownCalculatorPage } from './components/calculator/CODBreakdownCalculatorPage';
import { GlobalSourcingPage } from './components/sourcing/GlobalSourcingPage';
import { ClonedAppViewer } from './components/navigation/ClonedAppViewer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export type AppView =
  | 'dashboard'
  | 'board'
  | 'projects'
  | 'products'
  | 'research'
  | 'templates'
  | 'canvas'
  | 'ads-library'
  | 'ad-tracker'
  | 'analytics'
  | 'orders-cod'
  | 'automation'
  | 'reports'
  | 'settings'
  | 'landing-page'
  | 'breakdown'
  | 'sourcing'
  | 'cloned-app';

export default function App() {
  // Route & View state with URL query parameter preservation
  const [activeView, setActiveView] = useState<AppView>(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const viewParam = search.get('view');
      const pageParam = search.get('page') || search.get('url');
      if (pageParam && pageParam.endsWith('.html')) return 'cloned-app';
      if (viewParam) return viewParam as AppView;
    } catch {}
    return 'board';
  });
  const [activeSubItem, setActiveSubItem] = useState<string>(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      return search.get('sub') || search.get('tab') || 'videos';
    } catch {}
    return 'videos';
  });
  const [clonedAppUrl, setClonedAppUrl] = useState<string>(() => {
    try {
      const search = new URLSearchParams(window.location.search);
      const pageParam = search.get('page') || search.get('url');
      if (pageParam) return pageParam;
    } catch {}
    return 'erp.html';
  });

  // Keep browser URL synchronized so refresh preserves current route/view
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activeView === 'cloned-app') {
        url.searchParams.set('view', 'cloned-app');
        url.searchParams.set('url', clonedAppUrl);
        url.searchParams.delete('sub');
      } else {
        url.searchParams.set('view', activeView);
        if (activeSubItem) url.searchParams.set('sub', activeSubItem);
        url.searchParams.delete('url');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {}
  }, [activeView, clonedAppUrl, activeSubItem]);

  // Multi-canvas library management
  const [canvases, setCanvases] = useState<WorkflowProject[]>(() => loadCanvasesFromStorage());
  const [activeCanvasId, setActiveCanvasId] = useState<string>(() => loadActiveCanvasId(canvases));
  const [openCanvasIds, setOpenCanvasIds] = useState<string[]>(() => loadOpenCanvasIds(canvases));

  // Current active canvas project
  const project = canvases.find((c) => c.id === activeCanvasId) || canvases[0] || WORKFLOW_TEMPLATES[0].project;

  // Selection states
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // UI Drawer states
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);

  // Modals
  const [isCanvasLibraryOpen, setIsCanvasLibraryOpen] = useState(false);
  const [isNewCanvasOpen, setIsNewCanvasOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProductRecordOpen, setIsProductRecordOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Save status
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ nodes: WorkflowNode[]; edges: WorkflowEdge[] }>>([]);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [simActiveStep, setSimActiveStep] = useState<string | undefined>(undefined);

  // Push history snapshot before modifications
  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-25), { nodes: project.nodes, edges: project.edges }]);
    setRedoStack([]);
    setSaveStatus('unsaved');
  }, [project.nodes, project.edges]);

  // Update current active canvas
  const updateCurrentCanvas = useCallback(
    (updater: (prev: WorkflowProject) => WorkflowProject) => {
      setCanvases((prevCanvases) =>
        prevCanvases.map((c) => {
          if (c.id === activeCanvasId) {
            return updater(c);
          }
          return c;
        })
      );
      setSaveStatus('unsaved');
    },
    [activeCanvasId]
  );

  // Undo
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [...prev, { nodes: project.nodes, edges: project.edges }]);
    setHistory((prev) => prev.slice(0, -1));
    updateCurrentCanvas((prev) => ({
      ...prev,
      nodes: previous.nodes,
      edges: previous.edges,
    }));
  };

  // Redo
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, { nodes: project.nodes, edges: project.edges }]);
    setRedoStack((prev) => prev.slice(0, -1));
    updateCurrentCanvas((prev) => ({
      ...prev,
      nodes: next.nodes,
      edges: next.edges,
    }));
  };

  // Auto-save to localStorage with debounce
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      saveCanvasesToStorage(canvases);
      saveActiveCanvasId(activeCanvasId);
      saveOpenCanvasIds(openCanvasIds);
      setSaveStatus('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [canvases, activeCanvasId, openCanvasIds]);

  // Switch Active Canvas
  const handleSelectCanvas = (canvasId: string) => {
    setActiveCanvasId(canvasId);
    setOpenCanvasIds((prev) => (prev.includes(canvasId) ? prev : [...prev, canvasId]));
    setSelectedNodeIds([]);
    setSelectedEdgeId(null);
    setHistory([]);
    setRedoStack([]);
  };

  // Close Tab
  const handleCloseTab = (canvasId: string) => {
    const nextOpen = openCanvasIds.filter((id) => id !== canvasId);
    if (nextOpen.length === 0) return;
    setOpenCanvasIds(nextOpen);
    if (activeCanvasId === canvasId) {
      setActiveCanvasId(nextOpen[nextOpen.length - 1]);
      setSelectedNodeIds([]);
      setSelectedEdgeId(null);
      setHistory([]);
      setRedoStack([]);
    }
  };

  // Create New Canvas
  const handleCreateNewCanvas = (
    name?: string,
    templateId?: string,
    currency: 'DZD' | 'USD' | 'EUR' = 'DZD'
  ) => {
    const newCanvas = createNewCanvasOptions(name || 'Untitled Workflow Canvas', templateId, currency);
    setCanvases((prev) => [newCanvas, ...prev]);
    setActiveCanvasId(newCanvas.id);
    setOpenCanvasIds((prev) => [newCanvas.id, ...prev.filter((id) => id !== newCanvas.id)]);
    setSelectedNodeIds([]);
    setSelectedEdgeId(null);
    setHistory([]);
    setRedoStack([]);
    setActiveView('canvas');
  };

  // Duplicate Canvas
  const handleDuplicateCanvas = (canvasId: string) => {
    const target = canvases.find((c) => c.id === canvasId);
    if (!target) return;
    const duplicated: WorkflowProject = {
      ...target,
      id: `canvas_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${target.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCanvases((prev) => [duplicated, ...prev]);
    setActiveCanvasId(duplicated.id);
    setOpenCanvasIds((prev) => [duplicated.id, ...prev]);
    setSelectedNodeIds([]);
    setSelectedEdgeId(null);
    setHistory([]);
    setRedoStack([]);
  };

  // Rename Canvas
  const handleRenameCanvas = (canvasId: string, newName: string) => {
    setCanvases((prev) =>
      prev.map((c) =>
        c.id === canvasId ? { ...c, name: newName, updatedAt: new Date().toISOString() } : c
      )
    );
  };

  // Delete Canvas
  const handleDeleteCanvas = (canvasId: string) => {
    if (canvases.length <= 1) return;
    const nextCanvases = canvases.filter((c) => c.id !== canvasId);
    const nextOpen = openCanvasIds.filter((id) => id !== canvasId);
    setCanvases(nextCanvases);
    setOpenCanvasIds(nextOpen.length > 0 ? nextOpen : [nextCanvases[0].id]);
    if (activeCanvasId === canvasId) {
      setActiveCanvasId(nextCanvases[0].id);
      setSelectedNodeIds([]);
      setSelectedEdgeId(null);
      setHistory([]);
      setRedoStack([]);
    }
  };

  // Export Canvas JSON
  const handleExportCanvas = (target: WorkflowProject) => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(target, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${target.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_workflow.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Canvas JSON
  const handleImportCanvas = (imported: WorkflowProject) => {
    setCanvases((prev) => [imported, ...prev]);
    setActiveCanvasId(imported.id);
    setOpenCanvasIds((prev) => [imported.id, ...prev]);
    setSelectedNodeIds([]);
    setSelectedEdgeId(null);
    setActiveView('canvas');
  };

  // Cross-app navigation handler for all views & tabs
  const handleNavigate = (view: string, subItem?: string) => {
    if (view === 'cloned-app' && subItem) {
      setClonedAppUrl(subItem);
      setActiveView('cloned-app');
      return;
    }
    if (view.endsWith('.html')) {
      setClonedAppUrl(view);
      setActiveView('cloned-app');
      return;
    }
    if (subItem && subItem.endsWith('.html')) {
      setClonedAppUrl(subItem);
      setActiveView('cloned-app');
      return;
    }
    if (view === 'board') {
      setActiveView('board');
      if (subItem) setActiveSubItem(subItem);
    } else if (view === 'products' || view === 'product') {
      setActiveView('products');
    } else if (view === 'ads' || view === 'ads-library') {
      setActiveView('ads-library');
      if (subItem) setActiveSubItem(subItem);
    } else if (view === 'ad-tracker' || view === 'adtracker') {
      setActiveView('ad-tracker');
    } else if (view === 'analytics') {
      setActiveView('analytics');
      if (subItem) setActiveSubItem(subItem);
    } else if (view === 'orders' || view === 'orders-cod') {
      setActiveView('orders-cod');
    } else if (view === 'breakdown') {
      setClonedAppUrl('breakdown.html');
      setActiveView('cloned-app');
    } else if (view === 'sourcing') {
      setClonedAppUrl('global-sourcing.html');
      setActiveView('cloned-app');
    } else if (view === 'automation') {
      setActiveView('automation');
    } else if (view === 'reports') {
      setActiveView('reports');
    } else if (view === 'settings') {
      setActiveView('settings');
      if (subItem) setActiveSubItem(subItem);
    } else if (view === 'dashboard' || view === 'home') {
      setActiveView('dashboard');
    } else if (view === 'projects') {
      setActiveView('projects');
    } else if (view === 'research') {
      setActiveView('research');
    } else if (view === 'templates') {
      setActiveView('templates');
    } else if (view === 'canvas') {
      setActiveView('canvas');
    }
  };

  // Handle Nodes Change (with automatic metric recalculation)
  const handleNodesChange = (newNodes: WorkflowNode[]) => {
    const { updatedNodes, updatedEdges } = propagateGraphMetrics(newNodes, project.edges);
    updateCurrentCanvas((prev) => ({
      ...prev,
      nodes: updatedNodes,
      edges: updatedEdges,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Handle Edges Change
  const handleEdgesChange = (newEdges: WorkflowEdge[]) => {
    pushHistory();
    const { updatedNodes, updatedEdges } = propagateGraphMetrics(project.nodes, newEdges);
    updateCurrentCanvas((prev) => ({
      ...prev,
      nodes: updatedNodes,
      edges: updatedEdges,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Node Selection
  const handleSelectNode = (nodeId: string, isMulti: boolean) => {
    setSelectedEdgeId(null);
    if (isMulti) {
      setSelectedNodeIds((prev) =>
        prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
      );
    } else {
      setSelectedNodeIds([nodeId]);
    }
  };

  // Edge Selection
  const handleSelectEdge = (edgeId: string | null) => {
    setSelectedNodeIds([]);
    setSelectedEdgeId(edgeId);
  };

  const handleClearSelection = () => {
    setSelectedNodeIds([]);
    setSelectedEdgeId(null);
  };

  // Add Node from Library at coordinate
  const handleAddNodeAtPosition = (nodeType: string, x: number, y: number) => {
    pushHistory();

    let itemDef = null;
    for (const cat of LIBRARY_CATEGORIES) {
      const found = cat.items.find((item) => item.type === nodeType);
      if (found) {
        itemDef = found;
        break;
      }
    }

    const newNode: WorkflowNode = {
      id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: (itemDef?.type || nodeType) as any,
      category: itemDef?.category || 'product_intelligence',
      title: itemDef?.title || 'New Node',
      subtitle: itemDef?.subtitle || '',
      description: itemDef?.description || '',
      x,
      y,
      width: 270,
      height: 150,
      sizeMode: 'standard',
      status: 'idle',
      accentColor: itemDef?.defaultColor || '#2563EB',
      audienceBadge: itemDef?.defaultBadge || '',
      metrics: itemDef?.defaultMetrics || {},
      data: itemDef?.defaultData || {},
      customPreview: itemDef?.customPreview,
      handles: {
        inputs: [{ id: 'in', position: 'left' }],
        outputs: [{ id: 'out', position: 'right' }],
      },
    };

    const newNodes = [...project.nodes, newNode];
    handleNodesChange(newNodes);
    setSelectedNodeIds([newNode.id]);
  };

  // Add Node via double-click from sidebar at center of viewport
  const handleAddNodeAtCenter = (nodeType: string) => {
    const centerX = -project.viewport.x + 400 / project.viewport.zoom;
    const centerY = -project.viewport.y + 300 / project.viewport.zoom;
    handleAddNodeAtPosition(nodeType, Math.round(centerX), Math.round(centerY));
  };

  // Duplicate Selected Nodes
  const handleDuplicateNodes = (nodeIds: string[]) => {
    pushHistory();
    const toDuplicate = project.nodes.filter((n) => nodeIds.includes(n.id));
    const newNodes = toDuplicate.map((n) => ({
      ...n,
      id: `node_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${n.title} (Copy)`,
      x: n.x + 40,
      y: n.y + 40,
    }));

    handleNodesChange([...project.nodes, ...newNodes]);
    setSelectedNodeIds(newNodes.map((n) => n.id));
  };

  // Delete Selected Nodes / Edge
  const handleDeleteSelected = () => {
    pushHistory();
    if (selectedNodeIds.length > 0) {
      const remainingNodes = project.nodes.filter((n) => !selectedNodeIds.includes(n.id));
      const remainingEdges = project.edges.filter(
        (e) => !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)
      );
      updateCurrentCanvas((prev) => ({
        ...prev,
        nodes: remainingNodes,
        edges: remainingEdges,
      }));
      setSelectedNodeIds([]);
    } else if (selectedEdgeId) {
      updateCurrentCanvas((prev) => ({
        ...prev,
        edges: prev.edges.filter((e) => e.id !== selectedEdgeId),
      }));
      setSelectedEdgeId(null);
    }
  };

  // Execute AI Agent
  const handleRunAiAgent = async (nodeId: string, taskType: string, prompt: string) => {
    const targetNode = project.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    handleNodesChange(
      project.nodes.map((n) => (n.id === nodeId ? { ...n, status: 'running' } : n))
    );

    try {
      const provider = localStorage.getItem('ai_provider') || 'openai';
      const userApiKey =
        (provider === 'openai' ? localStorage.getItem('openai_api_key') : null) ||
        (provider === 'deepseek' ? localStorage.getItem('deepseek_api_key') : null) ||
        (provider === 'gemini' ? localStorage.getItem('gemini_api_key') : null) ||
        (provider === 'openrouter' ? localStorage.getItem('openrouter_api_key') : null) ||
        (provider === 'agentrouter' ? localStorage.getItem('agentrouter_api_key') : null) ||
        (provider === 'nvidia' ? localStorage.getItem('nvidia_api_key') : null) ||
        localStorage.getItem('openai_api_key') ||
        localStorage.getItem('user_api_key') ||
        '';
      const aiModel =
        localStorage.getItem('ai_model') ||
        (provider === 'openai'
          ? 'gpt-4o-mini'
          : provider === 'deepseek'
          ? 'deepseek-chat'
          : provider === 'openrouter'
          ? 'deepseek/deepseek-r1'
          : provider === 'agentrouter'
          ? 'agentrouter/auto'
          : provider === 'nvidia'
          ? 'meta/llama-3.3-70b-instruct'
          : 'gemini-3.8-flash');

      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType,
          prompt,
          provider,
          model: aiModel,
          apiKey: userApiKey,
          contextData: {
            title: targetNode.title,
            category: targetNode.category,
            data: targetNode.data,
            metrics: targetNode.metrics,
            productRecord: project.productRecord,
          },
        }),
      });

      const data = await res.json();
      const aiResultText = data.result || 'No advice returned.';

      handleNodesChange(
        project.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: 'completed',
                data: {
                  ...n.data,
                  lastAiResult: aiResultText,
                },
                metrics: {
                  ...n.metrics,
                  score: taskType === 'product_validation' ? 88 : n.metrics?.score,
                },
              }
            : n
        )
      );
    } catch (err: any) {
      console.error('AI call failed:', err);
      handleNodesChange(
        project.nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: 'error',
                data: {
                  ...n.data,
                  lastAiResult: 'Analysis offline or model unavailable.',
                },
              }
            : n
        )
      );
    }
  };

  // Interactive Simulation Loop
  useEffect(() => {
    if (!isSimulating) {
      setSimActiveStep(undefined);
      return;
    }

    let stepIndex = 0;
    const sortedNodes = [...project.nodes].sort((a, b) => a.x - b.x);

    const interval = setInterval(() => {
      if (sortedNodes.length === 0) return;
      const currentNode = sortedNodes[stepIndex % sortedNodes.length];
      setSimActiveStep(currentNode.title);

      updateCurrentCanvas((prev) => ({
        ...prev,
        nodes: prev.nodes.map((n) => {
          if (n.id === currentNode.id) return { ...n, status: 'running' };
          return n;
        }),
      }));

      setTimeout(() => {
        updateCurrentCanvas((prev) => ({
          ...prev,
          nodes: prev.nodes.map((n) => {
            if (n.id === currentNode.id) return { ...n, status: 'completed' };
            return n;
          }),
        }));
      }, 700 / simulationSpeed);

      stepIndex++;
    }, 1400 / simulationSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, project.nodes.length, updateCurrentCanvas]);

  // Keyboard Shortcuts (Delete, Cmd+K, Ctrl+Z, Ctrl+Y, Ctrl+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteSelected();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        if (selectedNodeIds.length > 0) {
          handleDuplicateNodes(selectedNodeIds);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, selectedEdgeId, history, redoStack]);

  const activeNode = project.nodes.find((n) => selectedNodeIds.includes(n.id)) || null;
  const activeEdge = project.edges.find((e) => e.id === selectedEdgeId) || null;

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden select-auto">
      {/* CLONED APP FULL-SCREEN VIEWER */}
      {activeView === 'cloned-app' ? (
        <ClonedAppViewer
          initialUrl={clonedAppUrl}
          onBackToBoard={() => setActiveView('board')}
        />
      ) : activeView === 'board' ? (
        /* 0. BOARD PAGE (Matching User Uploaded image_ca6855fc.png) */
        <BoardPage
          onNavigateHome={() => handleNavigate('dashboard')}
          onNavigateToView={handleNavigate}
          initialSubItem={activeSubItem}
        />
      ) : activeView === 'landing-page' ? (
        /* AI LANDING PAGE GENERATOR STUDIO (FULL 3-COLUMN WORKSPACE) */
        <div className="w-screen h-screen flex bg-[#F8FAFC] overflow-hidden select-text">
          <AppSidebar
            activeView={activeView}
            activeSubItem={activeSubItem}
            onNavigate={handleNavigate}
          />
          <main className="flex-1 overflow-hidden bg-[#F8FAFC] flex flex-col min-w-0">
            <ErrorBoundary fallbackTitle="AI Landing Page Studio Recovered">
              <LandingPageGeneratorApp
                isModal={false}
                onSendToBoard={() => {
                  handleNavigate('board', 'landing-page');
                }}
              />
            </ErrorBoundary>
          </main>
        </div>
      ) : activeView === 'products' ? (
        /* PRODUCTS INTELLIGENCE & DOSSIER PAGE */
        <ProductsPage
          onNavigate={handleNavigate}
          onOpenSearchModal={() => setIsSearchOpen(true)}
          onAddToBoard={(product) => {
            try {
              localStorage.setItem('pending_board_product', JSON.stringify(product));
            } catch (e) {
              console.error(e);
            }
            handleNavigate('board');
          }}
        />
      ) : activeView === 'ads-library' ? (
        /* 1. ADS LIBRARY PAGE (Matching User Screenshot 1) */
        <AdsLibraryPage
          onNavigate={handleNavigate}
          activeSubItem={activeSubItem}
          onOpenSearchModal={() => setIsSearchOpen(true)}
          onOpenSettings={() => handleNavigate('settings', 'general')}
        />
      ) : activeView === 'ad-tracker' ? (
        /* 1.5 AD TRACKER PAGE (Meta Ads Analytics & Optimization Dashboard) */
        <AdTrackerPage
          onNavigate={handleNavigate}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />
      ) : activeView === 'analytics' ? (
        /* 2. ANALYTICS DASHBOARD PAGE (Matching User Screenshot 2) */
        <AnalyticsDashboardPage
          onNavigate={handleNavigate}
          activeSubItem={activeSubItem}
          onOpenSearchModal={() => setIsSearchOpen(true)}
          onOpenSettings={() => handleNavigate('settings', 'general')}
        />
      ) : activeView === 'settings' ? (
        /* 3. SETTINGS PAGE (Matching User Screenshot 3) */
        <SettingsPage
          onNavigate={handleNavigate}
          activeSubItem={activeSubItem}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />
      ) : activeView === 'orders-cod' ? (
        /* 4. ORDERS & COD PAGE */
        <OrdersPage
          onNavigate={handleNavigate}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />
      ) : activeView === 'automation' ? (
        /* 5. AUTOMATION PAGE */
        <AutomationPage
          onNavigate={handleNavigate}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />
      ) : activeView === 'reports' ? (
        /* 6. REPORTS PAGE */
        <ReportsPage
          onNavigate={handleNavigate}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />
      ) : activeView === 'breakdown' ? (
        /* 6.5. COD MARGIN & CPA BREAKDOWN CALCULATOR */
        <CODBreakdownCalculatorPage
          onNavigate={handleNavigate}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />
      ) : activeView === 'sourcing' ? (
        /* 6.6. GLOBAL SOURCING INTELLIGENCE */
        <GlobalSourcingPage
          onNavigate={handleNavigate}
          onOpenSearchModal={() => setIsSearchOpen(true)}
        />
      ) : activeView === 'dashboard' ? (
        /* 7. DASHBOARD PAGE */
        <DashboardPage
          onNavigate={handleNavigate}
          onNavigateToCanvas={(templateId) => {
            if (templateId) {
              const match = canvases.find(
                (c) => c.id === templateId || c.name.toLowerCase().includes(templateId.replace(/_/g, ' '))
              );
              if (match) {
                handleSelectCanvas(match.id);
              } else {
                handleCreateNewCanvas(undefined, templateId);
              }
            }
            setActiveView('canvas');
          }}
          onNavigateToBoard={() => handleNavigate('board')}
          onNavigateToProjects={() => setActiveView('projects')}
          onNavigateToProducts={() => handleNavigate('products')}
          onNavigateToResearch={() => setActiveView('research')}
          onNavigateToAds={() => handleNavigate('ads-library', 'videos')}
          onNavigateToAnalytics={() => handleNavigate('analytics', 'overview')}
          onNavigateToOrders={() => handleNavigate('orders-cod')}
          onNavigateToAutomation={() => handleNavigate('automation')}
          onNavigateToReports={() => handleNavigate('reports')}
          onNavigateToSettings={() => handleNavigate('settings', 'general')}
          onOpenNewProject={() => handleCreateNewCanvas()}
          onOpenTemplates={() => setActiveView('templates')}
          currentCurrency={project.settings.currency}
        />
      ) : activeView === 'projects' ? (
        /* 8. PROJECTS & WORKFLOWS SECTION */
        <ProjectsPage
          onNavigate={handleNavigate}
          onNavigateToHome={() => setActiveView('dashboard')}
          onNavigateToProjects={() => setActiveView('projects')}
          onNavigateToResearch={() => setActiveView('research')}
          onNavigateToCanvas={(templateId) => {
            if (templateId) {
              const match = canvases.find(
                (c) => c.id === templateId || c.name.toLowerCase().includes(templateId.replace(/_/g, ' '))
              );
              if (match) {
                handleSelectCanvas(match.id);
              } else {
                handleCreateNewCanvas(undefined, templateId);
              }
            }
            setActiveView('canvas');
          }}
          onOpenNewProject={() => handleCreateNewCanvas()}
          onOpenTemplates={() => setActiveView('templates')}
          currentCurrency={project.settings.currency}
        />
      ) : activeView === 'research' ? (
        /* 9. PRODUCT RESEARCH & WINNING PRODUCT FINDER */
        <ProductResearchPage
          onNavigate={handleNavigate}
          onNavigateToHome={() => setActiveView('dashboard')}
          onNavigateToProjects={() => setActiveView('projects')}
          onNavigateToCanvas={(templateId) => {
            if (templateId) {
              const match = canvases.find(
                (c) => c.id === templateId || c.name.toLowerCase().includes(templateId.replace(/_/g, ' '))
              );
              if (match) {
                handleSelectCanvas(match.id);
              } else {
                handleCreateNewCanvas(undefined, templateId);
              }
            }
            setActiveView('canvas');
          }}
          onOpenTemplates={() => setActiveView('templates')}
          currentCurrency={project.settings.currency}
        />
      ) : activeView === 'templates' ? (
        /* 10. TEMPLATES & WORKFLOW BLUEPRINTS SECTION */
        <TemplatesPage
          onNavigate={handleNavigate}
          onNavigateToHome={() => setActiveView('dashboard')}
          onNavigateToProjects={() => setActiveView('projects')}
          onNavigateToResearch={() => setActiveView('research')}
          onNavigateToCanvas={(templateId) => {
            if (templateId) {
              const match = canvases.find(
                (c) => c.id === templateId || c.name.toLowerCase().includes(templateId.replace(/_/g, ' '))
              );
              if (match) {
                handleSelectCanvas(match.id);
              } else {
                handleCreateNewCanvas(undefined, templateId);
              }
            }
            setActiveView('canvas');
          }}
          onOpenNewProject={() => handleCreateNewCanvas()}
          currentCurrency={project.settings.currency}
        />
      ) : (
        /* 5. INTERACTIVE WORKFLOW CANVAS WITH MULTI-CANVAS LIBRARY TABS */
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Navigation Bar with Screenshot 2 breadcrumbs & actions */}
          <TopBar
            projectName={project.name}
            onProjectNameChange={(name) => handleRenameCanvas(activeCanvasId, name)}
            saveStatus={saveStatus}
            canUndo={history.length > 0}
            canRedo={redoStack.length > 0}
            onUndo={handleUndo}
            onRedo={handleRedo}
            zoom={project.viewport.zoom}
            onZoomChange={(newZoom) =>
              updateCurrentCanvas((prev) => ({
                ...prev,
                viewport: { ...prev.viewport, zoom: newZoom },
              }))
            }
            onZoomReset={() =>
              updateCurrentCanvas((prev) => ({
                ...prev,
                viewport: { ...prev.viewport, zoom: 1 },
              }))
            }
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onOpenTemplates={() => setActiveView('templates')}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenProductRecord={() => setIsProductRecordOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            currency={project.settings.currency}
            onCurrencyChange={(curr) =>
              updateCurrentCanvas((prev) => ({
                ...prev,
                settings: { ...prev.settings, currency: curr },
              }))
            }
            animationsEnabled={project.settings.animationsEnabled}
            onToggleAnimations={() =>
              updateCurrentCanvas((prev) => ({
                ...prev,
                settings: { ...prev.settings, animationsEnabled: !prev.settings.animationsEnabled },
              }))
            }
            particleStyle={project.settings.particleStyle}
            onParticleStyleChange={(s) =>
              updateCurrentCanvas((prev) => ({
                ...prev,
                settings: { ...prev.settings, particleStyle: s },
              }))
            }
            onNavigateHome={() => setActiveView('dashboard')}
            onNavigate={handleNavigate}
            canvases={canvases}
            activeCanvasId={activeCanvasId}
            onSelectCanvas={handleSelectCanvas}
            onOpenCanvasLibrary={() => setIsCanvasLibraryOpen(true)}
            onNewCanvas={() => setIsNewCanvasOpen(true)}
          />

          {/* Canvas Tabs Bar: Switcher between Open/Saved Canvases */}
          <CanvasTabBar
            canvases={canvases}
            openCanvasIds={openCanvasIds}
            activeCanvasId={activeCanvasId}
            onSelectCanvas={handleSelectCanvas}
            onCloseTab={handleCloseTab}
            onOpenLibraryModal={() => setIsCanvasLibraryOpen(true)}
            onOpenNewCanvasModal={() => setIsNewCanvasOpen(true)}
            onDuplicateCanvas={handleDuplicateCanvas}
            onRenameCanvas={handleRenameCanvas}
            onDeleteCanvas={handleDeleteCanvas}
          />

          {/* Main Workspace: Icon Rail + Node Library Drawer + Canvas + Inspector */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Sidebar: Icon Rail + Expandable Node Library */}
            <NodeLibrary
              isOpen={isLibraryOpen}
              onToggle={() => setIsLibraryOpen(!isLibraryOpen)}
              onAddNode={handleAddNodeAtCenter}
              onNavigateHome={() => setActiveView('dashboard')}
              onNavigateProjects={() => setActiveView('projects')}
              onNavigateResearch={() => setActiveView('research')}
              onNavigateAds={() => handleNavigate('ads-library', 'videos')}
              onNavigateAnalytics={() => handleNavigate('analytics', 'overview')}
              onNavigateSettings={() => handleNavigate('settings', 'general')}
              onOpenTemplates={() => setActiveView('templates')}
              onOpenSearch={() => setIsSearchOpen(true)}
            />

            {/* Center: Infinite Canvas */}
            <main className="flex-1 h-full relative overflow-hidden">
              <WorkflowCanvas
                nodes={project.nodes}
                edges={project.edges}
                selectedNodeIds={selectedNodeIds}
                selectedEdgeId={selectedEdgeId}
                viewport={project.viewport}
                snapToGrid={project.settings.snapToGrid}
                gridSize={project.settings.gridSize}
                animationsEnabled={project.settings.animationsEnabled}
                particleSpeed={project.settings.particleSpeed}
                particleDensity={project.settings.particleDensity}
                particleStyle={project.settings.particleStyle}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onSelectNode={handleSelectNode}
                onSelectEdge={handleSelectEdge}
                onClearSelection={handleClearSelection}
                onViewportChange={(viewport) =>
                  updateCurrentCanvas((prev) => ({ ...prev, viewport }))
                }
                onExecuteNode={(id) => handleRunAiAgent(id, 'product_validation', 'Evaluate node')}
                onDuplicateNodes={handleDuplicateNodes}
                onDeleteSelected={handleDeleteSelected}
                onAddNodeAtPosition={handleAddNodeAtPosition}
              />
            </main>

            {/* Right Sidebar: Node / Edge Inspector */}
            {(activeNode || activeEdge) && (
              <NodeInspector
                selectedNode={activeNode}
                selectedEdge={activeEdge}
                allNodes={project.nodes}
                onUpdateNode={(updated) => {
                  handleNodesChange(project.nodes.map((n) => (n.id === updated.id ? updated : n)));
                }}
                onUpdateEdge={(updated) => {
                  handleEdgesChange(project.edges.map((e) => (e.id === updated.id ? updated : e)));
                }}
                onDeleteNode={(id) => {
                  handleNodesChange(project.nodes.filter((n) => n.id !== id));
                  handleClearSelection();
                }}
                onDeleteEdge={(id) => {
                  handleEdgesChange(project.edges.filter((e) => e.id !== id));
                  handleClearSelection();
                }}
                onClose={handleClearSelection}
                onRunAiAgent={handleRunAiAgent}
              />
            )}
          </div>
        </div>
      )}

      {/* Floating Simulation Bar Dock */}
      {isSimulating && (
        <SimulationBar
          isSimulating={isSimulating}
          onToggleSimulation={() => setIsSimulating(!isSimulating)}
          onStepNext={() => {
            const sortedNodes = [...project.nodes].sort((a, b) => a.x - b.x);
            if (sortedNodes.length > 0) {
              const randNode = sortedNodes[Math.floor(Math.random() * sortedNodes.length)];
              setSimActiveStep(randNode.title);
            }
          }}
          onReset={() => {
            setIsSimulating(false);
            setSimActiveStep(undefined);
            updateCurrentCanvas((prev) => ({
              ...prev,
              nodes: prev.nodes.map((n) => ({ ...n, status: 'idle' })),
            }));
          }}
          speed={simulationSpeed}
          onSpeedChange={setSimulationSpeed}
          currentStepName={simActiveStep}
        />
      )}

      {/* Canvas Project Library Modal */}
      <CanvasLibraryModal
        isOpen={isCanvasLibraryOpen}
        onClose={() => setIsCanvasLibraryOpen(false)}
        canvases={canvases}
        activeCanvasId={activeCanvasId}
        onSelectCanvas={handleSelectCanvas}
        onNewCanvas={(name, templateId) => handleCreateNewCanvas(name, templateId)}
        onDuplicateCanvas={handleDuplicateCanvas}
        onRenameCanvas={handleRenameCanvas}
        onDeleteCanvas={handleDeleteCanvas}
        onExportCanvas={handleExportCanvas}
        onImportCanvas={handleImportCanvas}
      />

      {/* New Canvas Modal */}
      <NewCanvasModal
        isOpen={isNewCanvasOpen}
        onClose={() => setIsNewCanvasOpen(false)}
        onCreate={(name, templateId, currency) =>
          handleCreateNewCanvas(name, templateId, currency)
        }
      />

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={(tmpl) => {
          handleCreateNewCanvas(tmpl.name, tmpl.id);
        }}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
        onImportProject={(imported) => {
          handleImportCanvas(imported);
        }}
      />

      {/* Product Record Modal */}
      <ProductRecordModal
        isOpen={isProductRecordOpen}
        onClose={() => setIsProductRecordOpen(false)}
        productRecord={project.productRecord}
        onSaveRecord={(record) => {
          updateCurrentCanvas((prev) => ({ ...prev, productRecord: record }));
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        nodes={project.nodes}
        onSelectAndFocusNode={(nodeId) => {
          const target = project.nodes.find((n) => n.id === nodeId);
          if (target) {
            setSelectedNodeIds([nodeId]);
            const windowW = window.innerWidth;
            const windowH = window.innerHeight;
            const targetX = -(target.x - windowW / 2 / project.viewport.zoom);
            const targetY = -(target.y - windowH / 2 / project.viewport.zoom);
            updateCurrentCanvas((prev) => ({
              ...prev,
              viewport: { ...prev.viewport, x: targetX, y: targetY },
            }));
          }
        }}
      />
    </div>
  );
}
