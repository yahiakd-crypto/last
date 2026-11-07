import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface SimulationBarProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onStepNext: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  currentStepName?: string;
}

export const SimulationBar: React.FC<SimulationBarProps> = ({
  isSimulating,
  onToggleSimulation,
  onStepNext,
  onReset,
  speed,
  onSpeedChange,
  currentStepName,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/95 text-white shadow-2xl backdrop-blur-md border border-slate-700/80 animate-in slide-in-from-bottom-5 duration-200 select-none">
      <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-xs font-bold tracking-tight">Traffic Simulator</span>
      </div>

      {/* Play / Pause */}
      <button
        onClick={onToggleSimulation}
        className={`p-2 rounded-xl transition-all ${
          isSimulating ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
        } text-white shadow-xs`}
        title={isSimulating ? 'Pause Traffic' : 'Resume Traffic'}
      >
        {isSimulating ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
      </button>

      {/* Step Next */}
      <button
        onClick={onStepNext}
        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        title="Step Forward in Funnel"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      {/* Speed Controls */}
      <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
        {[0.5, 1, 2, 4].map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`px-2 py-1 text-[11px] font-mono font-semibold rounded-lg transition-colors ${
              speed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Status note */}
      <div className="text-xs text-slate-300 px-2 max-w-xs truncate">
        {currentStepName ? `Active Stage: ${currentStepName}` : 'Continuous live traffic flow along connections'}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 transition-colors"
        title="Reset Simulation State"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
