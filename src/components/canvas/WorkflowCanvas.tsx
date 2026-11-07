import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WorkflowNode, WorkflowEdge } from '../../types/workflow';
import { NodeCard } from '../nodes/NodeCard';
import { ConnectionEdge } from './ConnectionEdge';
import { Minimap } from './Minimap';
import { calculateCubicBezier } from '../../utils/bezier';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Grid, Plus, Copy, Trash2 } from 'lucide-react';

interface WorkflowCanvasProps {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeIds: string[];
  selectedEdgeId: string | null;
  viewport: { x: number; y: number; zoom: number };
  snapToGrid: boolean;
  gridSize: number;
  animationsEnabled: boolean;
  particleSpeed: number;
  particleDensity: number;
  particleStyle: 'people' | 'dots' | 'hybrid';
  onNodesChange: (nodes: WorkflowNode[]) => void;
  onEdgesChange: (edges: WorkflowEdge[]) => void;
  onSelectNode: (nodeId: string, isMulti: boolean) => void;
  onSelectEdge: (edgeId: string | null) => void;
  onClearSelection: () => void;
  onViewportChange: (viewport: { x: number; y: number; zoom: number }) => void;
  onExecuteNode?: (nodeId: string) => void;
  onDuplicateNodes: (nodeIds: string[]) => void;
  onDeleteSelected: () => void;
  onAddNodeAtPosition: (nodeType: string, x: number, y: number) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  selectedNodeIds,
  selectedEdgeId,
  viewport,
  snapToGrid,
  gridSize,
  animationsEnabled,
  particleSpeed,
  particleDensity,
  particleStyle,
  onNodesChange,
  onEdgesChange,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
  onViewportChange,
  onExecuteNode,
  onDuplicateNodes,
  onDeleteSelected,
  onAddNodeAtPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Node drag state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [initialNodePositions, setInitialNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());

  // Connecting handles state
  const [connectingFrom, setConnectingFrom] = useState<{
    nodeId: string;
    handleId: string;
    position: 'left' | 'right' | 'top' | 'bottom';
  } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Marquee selection state
  const [marqueeStart, setMarqueeStart] = useState<{ x: number; y: number } | null>(null);
  const [marqueeCurrent, setMarqueeCurrent] = useState<{ x: number; y: number } | null>(null);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; canvasX: number; canvasY: number } | null>(null);

  // Animation clock for moving people / particles
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      if (animationsEnabled) {
        setTick((prev) => prev + delta);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [animationsEnabled]);

  // Screen to Canvas coordinate transformation
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current) return { x: 0, y: 0 };
      const rect = containerRef.current.getBoundingClientRect();
      const x = (screenX - rect.left - viewport.x) / viewport.zoom;
      const y = (screenY - rect.top - viewport.y) / viewport.zoom;
      return { x, y };
    },
    [viewport]
  );

  // Native non-passive Wheel Zoom toward pointer position
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let zoomFactor: number;
      if (e.ctrlKey || e.metaKey) {
        zoomFactor = Math.exp(-e.deltaY * 0.006);
      } else {
        zoomFactor = e.deltaY < 0 ? 1.10 : 0.90;
      }

      const newZoom = Math.max(0.2, Math.min(2.5, viewport.zoom * zoomFactor));

      // Keep mouse pointer invariant in world space
      const worldX = (mouseX - viewport.x) / viewport.zoom;
      const worldY = (mouseY - viewport.y) / viewport.zoom;

      const newX = mouseX - worldX * newZoom;
      const newY = mouseY - worldY * newZoom;

      onViewportChange({ x: newX, y: newY, zoom: newZoom });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [viewport, onViewportChange]);

  const handleWheel = (e: React.WheelEvent) => {
    // Handled by native non-passive listener above
  };

  // Mouse Down on background
  const handleMouseDown = (e: React.MouseEvent) => {
    if (contextMenu) setContextMenu(null);

    // Middle click or plain left click on background
    if (e.button === 1 || (e.button === 0 && e.target === containerRef.current)) {
      if (e.shiftKey && e.button === 0) {
        // Shift + Drag = Marquee box selection
        const pos = screenToCanvas(e.clientX, e.clientY);
        setMarqueeStart(pos);
        setMarqueeCurrent(pos);
      } else {
        // Pan canvas
        setIsPanning(true);
        setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
        onClearSelection();
      }
    }
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    const curPos = screenToCanvas(e.clientX, e.clientY);
    setMousePos(curPos);

    if (isPanning) {
      onViewportChange({
        ...viewport,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (marqueeStart) {
      setMarqueeCurrent(curPos);
      return;
    }

    if (draggingNodeId) {
      // Calculate delta from start
      const dx = curPos.x - dragOffset.x;
      const dy = curPos.y - dragOffset.y;

      // Update positions of all selected nodes together
      const updated = nodes.map((node) => {
        if (selectedNodeIds.includes(node.id) || node.id === draggingNodeId) {
          const init = initialNodePositions.get(node.id);
          if (!init) return node;

          let newX = init.x + dx;
          let newY = init.y + dy;

          if (snapToGrid) {
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;
          }

          return { ...node, x: newX, y: newY };
        }
        return node;
      });

      onNodesChange(updated);
    }
  };

  // Mouse Up
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (draggingNodeId) {
      setDraggingNodeId(null);
    }

    if (marqueeStart && marqueeCurrent) {
      // Select all nodes within marquee bounding box
      const minX = Math.min(marqueeStart.x, marqueeCurrent.x);
      const maxX = Math.max(marqueeStart.x, marqueeCurrent.x);
      const minY = Math.min(marqueeStart.y, marqueeCurrent.y);
      const maxY = Math.max(marqueeStart.y, marqueeCurrent.y);

      const insideNodeIds = nodes
        .filter((n) => n.x + n.width >= minX && n.x <= maxX && n.y + n.height >= minY && n.y <= maxY)
        .map((n) => n.id);

      insideNodeIds.forEach((id) => onSelectNode(id, true));
      setMarqueeStart(null);
      setMarqueeCurrent(null);
    }

    // Cancel connecting line if dropped on canvas background
    if (connectingFrom) {
      setConnectingFrom(null);
    }
  };

  // Node Drag Initiated
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only

    const pos = screenToCanvas(e.clientX, e.clientY);
    setDraggingNodeId(nodeId);
    setDragOffset(pos);

    // Save initial positions of all currently selected nodes
    const map = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => {
      map.set(n.id, { x: n.x, y: n.y });
    });
    setInitialNodePositions(map);
  };

  // Connection Drag Initiated
  const handleStartConnection = (
    nodeId: string,
    handleId: string,
    position: 'left' | 'right' | 'top' | 'bottom',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const pos = screenToCanvas(e.clientX, e.clientY);
    setConnectingFrom({ nodeId, handleId, position });
    setMousePos(pos);
  };

  // Complete Connection when dropped onto target node
  const handleNodeMouseUpOnTarget = (targetNodeId: string) => {
    if (!connectingFrom) return;
    if (connectingFrom.nodeId === targetNodeId) {
      setConnectingFrom(null);
      return;
    }

    // Check if edge already exists
    const exists = edges.some(
      (e) => e.source === connectingFrom.nodeId && e.target === targetNodeId
    );

    if (!exists) {
      const sourceNode = nodes.find((n) => n.id === connectingFrom.nodeId);
      const targetNode = nodes.find((n) => n.id === targetNodeId);

      const newEdge: WorkflowEdge = {
        id: `edge_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        source: connectingFrom.nodeId,
        sourceHandle: connectingFrom.handleId,
        target: targetNodeId,
        targetHandle: 'in',
        color: sourceNode?.accentColor || '#2563EB',
        conversionRate: 100,
        trafficVolume: sourceNode?.metrics?.visitors || 500,
        trafficLabel: '100% · Connected',
        animated: true,
        particleType: 'person',
      };

      onEdgesChange([...edges, newEdge]);
    }

    setConnectingFrom(null);
  };

  // Drag and Drop from Node Library onto Canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('application/product-os-node');
    if (!nodeType) return;

    const pos = screenToCanvas(e.clientX, e.clientY);
    const snapX = snapToGrid ? Math.round(pos.x / gridSize) * gridSize : pos.x;
    const snapY = snapToGrid ? Math.round(pos.y / gridSize) * gridSize : pos.y;

    onAddNodeAtPosition(nodeType, snapX, snapY);
  };

  // Zoom controls
  const handleZoomIn = () => {
    const newZoom = Math.min(2.5, viewport.zoom * 1.2);
    onViewportChange({ ...viewport, zoom: newZoom });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(0.2, viewport.zoom / 1.2);
    onViewportChange({ ...viewport, zoom: newZoom });
  };

  const handleFitToViewport = () => {
    if (nodes.length === 0 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((n) => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height);
    });

    const padding = 100;
    const graphWidth = maxX - minX + padding * 2;
    const graphHeight = maxY - minY + padding * 2;

    const zoomX = rect.width / graphWidth;
    const zoomY = rect.height / graphHeight;
    const newZoom = Math.max(0.3, Math.min(1.2, Math.min(zoomX, zoomY)));

    const newX = rect.width / 2 - (minX + (maxX - minX) / 2) * newZoom;
    const newY = rect.height / 2 - (minY + (maxY - minY) / 2) * newZoom;

    onViewportChange({ x: newX, y: newY, zoom: newZoom });
  };

  const handleResetZoom = () => {
    onViewportChange({ ...viewport, zoom: 1 });
  };

  // Right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const pos = screenToCanvas(e.clientX, e.clientY);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      canvasX: snapToGrid ? Math.round(pos.x / gridSize) * gridSize : pos.x,
      canvasY: snapToGrid ? Math.round(pos.y / gridSize) * gridSize : pos.y,
    });
  };

  // Rubberband preview curve while connecting
  const connectingCurve = connectingFrom
    ? (() => {
        const sourceNode = nodes.find((n) => n.id === connectingFrom.nodeId);
        if (!sourceNode) return null;
        const x1 = sourceNode.x + sourceNode.width;
        const y1 = sourceNode.y + sourceNode.height / 2;
        return calculateCubicBezier(x1, y1, mousePos.x, mousePos.y, 'right', 'left', 0.45);
      })()
    : null;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none bg-[#f8fafc] ${
        isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onContextMenu={handleContextMenu}
    >
      {/* Infinite Canvas Background Grid (subtle dot grid matching screenshots) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#cbd5e1 1.2px, transparent 1.2px)`,
          backgroundSize: `${24 * viewport.zoom}px ${24 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
          opacity: 0.65,
        }}
      />

      {/* Canvas World Container (Pan & Zoom transform) */}
      <div
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        }}
      >
        {/* SVG Layer for Connections & Particles */}
        <svg className="absolute inset-0 w-[10000px] h-[10000px] pointer-events-none overflow-visible">
          {edges.map((edge) => {
            const sNode = nodes.find((n) => n.id === edge.source);
            const tNode = nodes.find((n) => n.id === edge.target);
            if (!sNode || !tNode) return null;

            return (
              <ConnectionEdge
                key={edge.id}
                edge={edge}
                sourceNode={sNode}
                targetNode={tNode}
                isSelected={selectedEdgeId === edge.id}
                onSelect={(id) => onSelectEdge(id)}
                onDelete={(id) => {
                  onEdgesChange(edges.filter((e) => e.id !== id));
                  onSelectEdge(null);
                }}
                animationsEnabled={animationsEnabled}
                particleSpeed={particleSpeed}
                particleDensity={particleDensity}
                particleStyle={particleStyle}
                simulationTick={tick}
              />
            );
          })}

          {/* Live Connecting Rubberband Line Preview */}
          {connectingCurve && (
            <g className="pointer-events-none">
              <path
                d={connectingCurve.path}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                className="animate-pulse"
              />
              <circle
                cx={mousePos.x}
                cy={mousePos.y}
                r={4}
                fill="#3B82F6"
                className="animate-ping"
              />
            </g>
          )}
        </svg>

        {/* HTML Layer for Interactive Node Cards */}
        <div className="absolute inset-0 pointer-events-auto">
          {nodes.map((node) => (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
              onMouseUp={() => handleNodeMouseUpOnTarget(node.id)}
            >
              <NodeCard
                node={node}
                isSelected={selectedNodeIds.includes(node.id)}
                onSelect={onSelectNode}
                onUpdate={(updated) => {
                  onNodesChange(nodes.map((n) => (n.id === updated.id ? updated : n)));
                }}
                onStartConnection={handleStartConnection}
                onExecuteNode={onExecuteNode}
                zoom={viewport.zoom}
              />
            </div>
          ))}
        </div>

        {/* Marquee Drag Selection Box */}
        {marqueeStart && marqueeCurrent && (
          <div
            className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none z-50 rounded-xs"
            style={{
              left: `${Math.min(marqueeStart.x, marqueeCurrent.x)}px`,
              top: `${Math.min(marqueeStart.y, marqueeCurrent.y)}px`,
              width: `${Math.abs(marqueeCurrent.x - marqueeStart.x)}px`,
              height: `${Math.abs(marqueeCurrent.y - marqueeStart.y)}px`,
            }}
          />
        )}
      </div>

      {/* Connection Types Legend (Bottom Left - matching screenshot 2) */}
      <div className="absolute bottom-28 left-4 p-2.5 rounded-xl bg-white/95 border border-slate-200/90 shadow-md backdrop-blur-xs z-20 select-none text-[11px] space-y-1.5 min-w-[130px]">
        <span className="text-[10px] font-bold text-slate-700 block uppercase tracking-wider">Connection Types</span>
        <div className="space-y-1 text-slate-600 font-medium text-[10px]">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /><span>Paid Traffic</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-600" /><span>Research</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600" /><span>Qualified</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>Processing</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-600" /><span>Error</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /><span>Info</span></div>
        </div>
      </div>

      {/* Floating Canvas Controls Dock (Above bottom analytics) */}
      <div className="absolute bottom-28 right-4 flex flex-col items-center gap-1 p-1 rounded-xl bg-white/95 border border-slate-200/90 shadow-md backdrop-blur-xs z-30 select-none">
        <button
          onClick={handleFitToViewport}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Fit All Nodes"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Minimap (Bottom Right) */}
      <div className="absolute bottom-28 right-14 z-30">
        <Minimap
          nodes={nodes}
          viewport={viewport}
          containerWidth={containerRef.current?.clientWidth || 1200}
          containerHeight={containerRef.current?.clientHeight || 800}
          onPanTo={(x, y) => onViewportChange({ ...viewport, x, y })}
        />
      </div>

      {/* Bottom Dock: COD Analytics (Algeria) - matching screenshot 2 */}
      <div className="absolute bottom-0 inset-x-0 bg-white/95 border-t border-slate-200/90 px-4 py-2.5 z-20 backdrop-blur-sm shadow-sm select-none">
        <div className="flex items-center justify-between gap-4">
          {/* Left Title & Filters */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>COD Analytics <span className="text-slate-400 font-normal">(Algeria)</span></span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700 border border-slate-200">DZD ▾</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600 border border-slate-200">Last 7 days ▾</span>
            </div>
          </div>

          {/* Metric KPIs */}
          <div className="grid grid-cols-6 gap-3 flex-1 max-w-3xl">
            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-left">
              <span className="text-[9px] text-slate-400 block">Total Orders</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-900 font-mono">150</span>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 12%</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-left">
              <span className="text-[9px] text-slate-400 block">Confirmed Orders</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-900 font-mono">112</span>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 8%</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-left">
              <span className="text-[9px] text-slate-400 block">Delivered Orders</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-slate-900 font-mono">95</span>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 14%</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-left">
              <span className="text-[9px] text-slate-400 block">RTO Rate</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-rose-600 font-mono">25%</span>
                <span className="text-[10px] text-emerald-600 font-semibold">↓ 5%</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-left">
              <span className="text-[9px] text-slate-400 block">Revenue</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-slate-900 font-mono">332,500 DZD</span>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 18%</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-lg bg-emerald-50/70 border border-emerald-100 text-left">
              <span className="text-[9px] text-emerald-700 block font-medium">Net Profit</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-bold text-emerald-700 font-mono">85,200 DZD</span>
                <span className="text-[10px] text-emerald-600 font-semibold">↑ 22%</span>
              </div>
            </div>
          </div>

          {/* Right Funnel Mini-Chart (matching screenshot 2) */}
          <div className="hidden xl:flex items-center gap-3 pl-3 border-l border-slate-200 shrink-0">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">Order Conversion Funnel</span>
            <div className="flex items-end gap-1.5 h-7">
              <div className="flex flex-col items-center">
                <div className="w-4 h-6 rounded-t bg-blue-500" />
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">150</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-5 rounded-t bg-emerald-500" />
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">112</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-t bg-sky-400" />
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">95</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-3 rounded-t bg-teal-400" />
                <span className="text-[8px] font-mono text-slate-400 mt-0.5">85</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu on Right Click */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-48 text-xs z-50 select-none animate-in fade-in zoom-in-95 duration-100"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onAddNodeAtPosition('sticky_note', contextMenu.canvasX, contextMenu.canvasY);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-amber-500" />
            <span>Add Sticky Note</span>
          </button>

          <button
            onClick={() => {
              onAddNodeAtPosition('meta_ads', contextMenu.canvasX, contextMenu.canvasY);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-blue-500" />
            <span>Add Meta Ads</span>
          </button>

          <button
            onClick={() => {
              onAddNodeAtPosition('whatsapp_confirmation', contextMenu.canvasX, contextMenu.canvasY);
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Add WhatsApp Confirm</span>
          </button>

          {selectedNodeIds.length > 0 && (
            <>
              <div className="h-[1px] bg-slate-100 my-1" />
              <button
                onClick={() => {
                  onDuplicateNodes(selectedNodeIds);
                  setContextMenu(null);
                }}
                className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Duplicate Selected ({selectedNodeIds.length})</span>
              </button>
              <button
                onClick={() => {
                  onDeleteSelected();
                  setContextMenu(null);
                }}
                className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete Selected</span>
              </button>
            </>
          )}

          <div className="h-[1px] bg-slate-100 my-1" />
          <button
            onClick={() => {
              handleFitToViewport();
              setContextMenu(null);
            }}
            className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-100 flex items-center gap-2"
          >
            <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Fit to Screen</span>
          </button>
        </div>
      )}
    </div>
  );
};
