import React, { useMemo } from 'react';
import { WorkflowEdge, WorkflowNode } from '../../types/workflow';
import { calculateCubicBezier, getPointOnCubicBezier, Point } from '../../utils/bezier';
import { User, Trash2 } from 'lucide-react';

interface ConnectionEdgeProps {
  edge: WorkflowEdge;
  sourceNode: WorkflowNode;
  targetNode: WorkflowNode;
  isSelected: boolean;
  onSelect: (edgeId: string) => void;
  onDelete: (edgeId: string) => void;
  animationsEnabled: boolean;
  particleSpeed: number; // 0.5, 1, 2
  particleDensity: number; // 2 to 6
  particleStyle: 'people' | 'dots' | 'hybrid';
  simulationTick: number; // continuously incremented animation clock
}

export const ConnectionEdge: React.FC<ConnectionEdgeProps> = ({
  edge,
  sourceNode,
  targetNode,
  isSelected,
  onSelect,
  onDelete,
  animationsEnabled,
  particleSpeed,
  particleDensity,
  particleStyle,
  simulationTick,
}) => {
  // Determine coordinates: source right edge to target left edge
  const curveData = useMemo(() => {
    const x1 = sourceNode.x + sourceNode.width;
    const y1 = sourceNode.y + sourceNode.height / 2;
    const x2 = targetNode.x;
    const y2 = targetNode.y + targetNode.height / 2;

    return calculateCubicBezier(x1, y1, x2, y2, 'right', 'left', 0.45);
  }, [sourceNode.x, sourceNode.y, sourceNode.width, sourceNode.height, targetNode.x, targetNode.y, targetNode.height]);

  const { path, source, target, cp1, cp2, midpoint } = curveData;
  const strokeColor = edge.color || '#2563EB';

  // Calculate traveling particles along the curve
  const particles = useMemo(() => {
    if (!animationsEnabled) return [];

    const count = Math.max(1, Math.min(8, particleDensity));
    const items: { x: number; y: number; progress: number; id: number }[] = [];

    // simulationTick advances 0 -> 1 over time
    const speed = (particleSpeed || 1) * 0.0008;

    for (let i = 0; i < count; i++) {
      const offset = i / count;
      // Cyclical progress in [0, 1]
      const progress = (simulationTick * speed + offset) % 1;
      const pt = getPointOnCubicBezier(source.x, source.y, cp1.x, cp1.y, cp2.x, cp2.y, target.x, target.y, progress);
      items.push({ x: pt.x, y: pt.y, progress, id: i });
    }

    return items;
  }, [animationsEnabled, particleDensity, particleSpeed, simulationTick, source.x, source.y, cp1.x, cp1.y, cp2.x, cp2.y, target.x, target.y]);

  // Dropoff stream calculation (downward faint branch seen in screenshot 1 & 3)
  const dropoffData = useMemo(() => {
    if (!edge.hasDropoff && !edge.dropoffLabel) return null;

    // Split off at t = 0.25 of the main curve
    const branchPt = getPointOnCubicBezier(source.x, source.y, cp1.x, cp1.y, cp2.x, cp2.y, target.x, target.y, 0.22);
    const dropEndY = branchPt.y + 60;
    const dropEndX = branchPt.x + 8;

    const dropPath = `M ${branchPt.x.toFixed(1)} ${branchPt.y.toFixed(1)} C ${branchPt.x.toFixed(1)} ${(branchPt.y + 25).toFixed(1)}, ${dropEndX.toFixed(1)} ${(branchPt.y + 35).toFixed(1)}, ${dropEndX.toFixed(1)} ${dropEndY.toFixed(1)}`;

    return {
      branchPt,
      dropEndX,
      dropEndY,
      dropPath,
    };
  }, [edge.hasDropoff, edge.dropoffLabel, source.x, source.y, cp1.x, cp1.y, cp2.x, cp2.y, target.x, target.y]);

  return (
    <g className="cursor-pointer group/edge" onClick={() => onSelect(edge.id)}>
      {/* Invisible wider hover hit-area */}
      <path
        d={path}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        strokeLinecap="round"
      />

      {/* Background shadow stroke for depth */}
      <path
        d={path}
        fill="none"
        stroke="rgba(0,0,0,0.04)"
        strokeWidth={isSelected ? 5 : 3.5}
        strokeLinecap="round"
      />

      {/* Main Connection Path */}
      <path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isSelected ? 3.5 : 2.2}
        strokeLinecap="round"
        strokeOpacity={isSelected ? 1 : 0.85}
        className="transition-all duration-150"
      />

      {/* Optional selection glow ring */}
      {isSelected && (
        <path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={8}
          strokeOpacity={0.2}
          strokeLinecap="round"
        />
      )}

      {/* Dropoff Stream Branch (faint red downward flow from screenshot 1: -39.3K, -5.7K) */}
      {dropoffData && (
        <g className="opacity-80">
          <path
            d={dropoffData.dropPath}
            fill="none"
            stroke="#EF4444"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            strokeOpacity={0.5}
          />

          {/* Faint falling people icons along dropoff stream */}
          <g transform={`translate(${dropoffData.dropEndX - 4}, ${dropoffData.dropEndY - 35})`}>
            <circle cx="4" cy="4" r="3.5" fill="#FCA5A5" fillOpacity="0.4" />
            <path d="M1 9 C1 6.5, 7 6.5, 7 9" fill="#FCA5A5" fillOpacity="0.4" />
          </g>
          <g transform={`translate(${dropoffData.dropEndX - 4}, ${dropoffData.dropEndY - 15})`}>
            <circle cx="4" cy="4" r="3.5" fill="#FCA5A5" fillOpacity="0.4" />
            <path d="M1 9 C1 6.5, 7 6.5, 7 9" fill="#FCA5A5" fillOpacity="0.4" />
          </g>

          {/* Negative dropoff count badge (e.g. -39.3K, -5.7K) */}
          <foreignObject
            x={dropoffData.dropEndX - 35}
            y={dropoffData.dropEndY + 4}
            width={70}
            height={24}
            className="overflow-visible pointer-events-none"
          >
            <div className="flex items-center justify-center">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/60 shadow-xs tabular-nums">
                {edge.dropoffLabel || (edge.dropoffCount ? `-${edge.dropoffCount.toLocaleString()}` : '-421')}
              </span>
            </div>
          </foreignObject>
        </g>
      )}

      {/* Animated Traveling People / Dots along the Bézier path */}
      {animationsEnabled &&
        particles.map((p) => (
          <g
            key={p.id}
            transform={`translate(${p.x}, ${p.y})`}
            className="pointer-events-none transition-transform"
          >
            {particleStyle === 'dots' ? (
              // Clean glowing dot
              <circle
                r={3.5}
                fill={strokeColor}
                stroke="#FFFFFF"
                strokeWidth={1.5}
                className="shadow-sm filter drop-shadow(0 1px 2px rgba(0,0,0,0.15))"
              />
            ) : (
              // Distinctive little person icon (Matching screenshot 1, 2, 3!)
              <g transform="translate(-5, -6) scale(0.85)">
                {/* Person Head */}
                <circle
                  cx="6"
                  cy="4"
                  r="3"
                  fill={strokeColor}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                />
                {/* Person Body */}
                <path
                  d="M2 13 C2 9.5, 10 9.5, 10 13 Z"
                  fill={strokeColor}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                />
              </g>
            )}
          </g>
        ))}

      {/* Conversion Rate & Volume Badge on Midpoint (e.g. 1.8% · 720 ppl, 55% · 1.4K ppl) */}
      {(edge.trafficLabel || edge.conversionRate !== undefined || edge.label) && (
        <foreignObject
          x={midpoint.x - 65}
          y={midpoint.y - 14}
          width={130}
          height={32}
          className="overflow-visible pointer-events-auto"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(edge.id);
            }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all shadow-xs cursor-pointer select-none whitespace-nowrap border ${
              isSelected
                ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-blue-500/40 shadow-sm'
                : 'bg-white/95 text-slate-800 border-slate-200/90 hover:border-slate-300 hover:shadow-sm backdrop-blur-xs'
            }`}
          >
            {/* Tiny traffic dot indicator */}
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: strokeColor }}
            />
            <span className="tabular-nums font-semibold tracking-tight">
              {edge.trafficLabel ||
                (edge.conversionRate !== undefined
                  ? `${edge.conversionRate}% · ${edge.trafficVolume || 720} ppl`
                  : edge.label || 'Flow')}
            </span>

            {/* Quick delete icon if edge is selected */}
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(edge.id);
                }}
                className="ml-0.5 p-0.5 text-slate-400 hover:text-rose-300 transition-colors"
                title="Delete Connection"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        </foreignObject>
      )}
    </g>
  );
};
