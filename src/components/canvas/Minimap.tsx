import React, { useMemo } from 'react';
import { WorkflowNode } from '../../types/workflow';

interface MinimapProps {
  nodes: WorkflowNode[];
  viewport: { x: number; y: number; zoom: number };
  containerWidth: number;
  containerHeight: number;
  onPanTo: (x: number, y: number) => void;
}

export const Minimap: React.FC<MinimapProps> = ({
  nodes,
  viewport,
  containerWidth,
  containerHeight,
  onPanTo,
}) => {
  // Compute bounds of all nodes
  const bounds = useMemo(() => {
    if (nodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 1800, maxY: 1000, width: 1800, height: 1000 };
    }
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

    // Add margin
    minX = Math.min(minX - 150, -viewport.x);
    minY = Math.min(minY - 150, -viewport.y);
    maxX = Math.max(maxX + 150, -viewport.x + containerWidth / viewport.zoom);
    maxY = Math.max(maxY + 150, -viewport.y + containerHeight / viewport.zoom);

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: Math.max(maxX - minX, 1000),
      height: Math.max(maxY - minY, 800),
    };
  }, [nodes, viewport, containerWidth, containerHeight]);

  const mapWidth = 160;
  const mapHeight = 110;
  const scaleX = mapWidth / bounds.width;
  const scaleY = mapHeight / bounds.height;
  const scale = Math.min(scaleX, scaleY);

  // Viewport rect inside minimap
  const viewRect = {
    x: (-viewport.x - bounds.minX) * scale,
    y: (-viewport.y - bounds.minY) * scale,
    w: (containerWidth / viewport.zoom) * scale,
    h: (containerHeight / viewport.zoom) * scale,
  };

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert back to canvas world coords
    const worldX = clickX / scale + bounds.minX;
    const worldY = clickY / scale + bounds.minY;

    // Center viewport at this coordinate
    const targetX = -(worldX - (containerWidth / 2) / viewport.zoom);
    const targetY = -(worldY - (containerHeight / 2) / viewport.zoom);
    onPanTo(targetX, targetY);
  };

  return (
    <div
      onClick={handleMinimapClick}
      className="absolute bottom-4 right-4 w-44 h-32 rounded-xl bg-white/95 border border-slate-200/90 shadow-lg backdrop-blur-sm p-1.5 cursor-crosshair z-30 select-none overflow-hidden"
    >
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1 px-1">
        Canvas Map
      </div>
      <div className="relative w-full h-[88px] bg-slate-50/80 rounded-lg overflow-hidden border border-slate-100">
        {/* Render Node Mini-Rectangles */}
        {nodes.map((n) => {
          const nx = (n.x - bounds.minX) * scale;
          const ny = (n.y - bounds.minY) * scale;
          const nw = Math.max(n.width * scale, 3);
          const nh = Math.max(n.height * scale, 3);

          return (
            <div
              key={n.id}
              className="absolute rounded-[1px] transition-opacity"
              style={{
                left: `${nx}px`,
                top: `${ny}px`,
                width: `${nw}px`,
                height: `${nh}px`,
                backgroundColor: n.accentColor || '#3B82F6',
                opacity: 0.85,
              }}
            />
          );
        })}

        {/* Viewport frame box */}
        <div
          className="absolute border border-blue-500 bg-blue-500/10 pointer-events-none rounded-[1px] transition-all"
          style={{
            left: `${Math.max(0, viewRect.x)}px`,
            top: `${Math.max(0, viewRect.y)}px`,
            width: `${Math.min(mapWidth, viewRect.w)}px`,
            height: `${Math.min(mapHeight, viewRect.h)}px`,
          }}
        />
      </div>
    </div>
  );
};
