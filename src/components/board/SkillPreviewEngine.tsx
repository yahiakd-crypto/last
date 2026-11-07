/**
 * BUILD: UNIVERSAL SKILL PREVIEW & RENDERING ENGINE
 *
 * Implements the ChatGPT-style Universal Skill Output UI inspired by the 25 visual reference designs:
 *
 * Reusable Components Exported:
 *  1. MessageRenderer          (Conversational response with feedback controls - Ref 01)
 *  2. MarkdownRenderer         (Structured long-form report with sections - Ref 02)
 *  3. SectionRenderer          (Collapsible accordion sections with badges)
 *  4. CardRenderer             (Generic multipurpose card)
 *  5. KPIRenderer              (KPI dashboard cards with status pills - Ref 03)
 *  6. TableRenderer            (Comparison table with best opportunity pill & sort - Ref 05)
 *  7. ChartRenderer            (Daily spend bar chart & purchase trend line chart - Ref 06)
 *  8. FlowchartRenderer        (Full-funnel e-commerce workflow with decision point - Ref 07)
 *  9. DecisionTreeRenderer     (Conditional decision tree with YES/NO branches - Ref 08)
 * 10. FunnelRenderer           (E-commerce conversion funnel with progress bars - Ref 09)
 * 11. TimelineRenderer         (7-day launch timeline with milestone badges - Ref 11)
 * 12. ChecklistRenderer        (Interactive checklist with progress bar & count - Ref 10)
 * 13. ImageGalleryRenderer     (Product comparison cards with image & unit economics - Ref 04)
 * 14. CodeRenderer             (Syntax-highlighted code panel with copy & run - Ref 13)
 * 15. CitationRenderer         (Evidence, references & footnotes - Ref 14)
 * 16. RecommendationRenderer   (Strategic recommendations with impact pills - Ref 15)
 * 17. ArtifactRenderer         (Downloadable deliverables & exports - Ref 16)
 * 18. LandingPagePreview       (Interactive mobile/desktop landing page preview - Ref 17)
 * 19. SplitViewRenderer        (Dual-pane synchronous view with resizable layout)
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Sparkles,
  BarChart3,
  FileText,
  Layers,
  GitFork,
  Eye,
  SplitSquareHorizontal,
  AlignLeft,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  DollarSign,
  Percent,
  Activity,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Code2,
  MessageSquare,
  Zap,
  ArrowUpRight,
  Star,
  Shield,
  BookOpen,
  Download,
  Search,
  Filter,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShoppingBag,
  Package,
  FileSpreadsheet,
  FileCode,
  Tag,
  ArrowRight,
  ExternalLink,
  Info,
  Clock,
  Compass,
} from 'lucide-react';

import {
  analyzeContent,
  normalizeAndCleanAIOutput,
  MarkdownDocumentRenderer,
  StatusAwareTableCell,
  renderDiagramTree,
  EnrichedText,
} from './UniversalContentEngine';

import { WorkflowChartView, getSkillTheme } from './WorkflowChartView';
import { AnalyticsDashboardView } from './AnalyticsDashboardView';

// Re-export the ChatGPT-style renderers
export {
  StatusBadge,
  SkillReportHeader,
  MessageRenderer,
  MarkdownRenderer,
  KPIRenderer,
  ProductCardsRenderer,
  ProductCardsRenderer as ImageGalleryRenderer,
  TableRenderer,
  ChartRenderer,
  FlowchartRenderer,
  DecisionTreeRenderer,
  FunnelRenderer,
  ChecklistRenderer,
  TimelineRenderer,
  RiskMatrixRenderer,
  CodeRenderer,
  CitationRenderer,
  RecommendationRenderer,
  ArtifactRenderer,
  LandingPagePreview,
  SectionRenderer,
  SplitViewRenderer,
  ChatGPTConversationalRenderer,
  ChatGPTMarkdownDocumentRenderer,
  EnrichedMarkdownText,
  CreativeConceptsGallery,
  ResearchCitationsCard,
  ExpandableAnalysisSections,
  ActionableRecommendationsCard,
  MultiStageSkillTracker,
  InteractiveProfitabilityCalculator,
  SkillValidationReport,
  FormulaPresentationCard,
  ArtifactDeliverablesCard,
  ProductPageLivePreview,
  SkillResultWorkspace,
  ChatStyleExecutionCard,
  NextRecommendedSkillCard,
} from './ChatGPTComponents';

import {
  StatusBadge,
  SkillReportHeader,
  MessageRenderer,
  MarkdownRenderer,
  MarkdownRenderer as ChatGptMarkdownReport,
  KPIRenderer,
  KPIRenderer as ChatGptKPIDashboard,
  ProductCardsRenderer,
  TableRenderer,
  TableRenderer as ChatGptTableComparison,
  ChartRenderer,
  ChartRenderer as ChatGptPerformanceCharts,
  FlowchartRenderer,
  FlowchartRenderer as ChatGptFlowchart,
  DecisionTreeRenderer,
  DecisionTreeRenderer as ChatGptDecisionTree,
  FunnelRenderer,
  FunnelRenderer as ChatGptFunnel,
  ChecklistRenderer,
  ChecklistRenderer as ChatGptChecklist,
  TimelineRenderer,
  TimelineRenderer as ChatGptTimeline,
  RiskMatrixRenderer,
  RiskMatrixRenderer as ChatGptRiskMatrix,
  CodeRenderer,
  CodeRenderer as ChatGptCodePreview,
  CitationRenderer,
  CitationRenderer as ChatGptCitations,
  RecommendationRenderer,
  RecommendationRenderer as ChatGptRecommendations,
  ArtifactRenderer,
  ArtifactRenderer as ChatGptArtifacts,
  LandingPagePreview,
  LandingPagePreview as ChatGptLandingPreview,
  SectionRenderer,
  SplitViewRenderer,
  ChatGPTConversationalRenderer,
  ChatGPTMarkdownDocumentRenderer,
  EnrichedMarkdownText,
  CreativeConceptsGallery,
  ResearchCitationsCard,
  ExpandableAnalysisSections,
  ActionableRecommendationsCard,
  MultiStageSkillTracker,
  InteractiveProfitabilityCalculator,
  SkillValidationReport,
  FormulaPresentationCard,
  ArtifactDeliverablesCard,
  ProductPageLivePreview,
  SkillResultWorkspace,
  ChatStyleExecutionCard,
  NextRecommendedSkillCard,
} from './ChatGPTComponents';

// ─────────────────────────────────────────────────────────────────────────────
// Universal Output Contract & Component Interfaces
// ─────────────────────────────────────────────────────────────────────────────

export interface UniversalSkillOutput {
  skill_name?: string;
  execution_status?: 'completed' | 'in_progress' | 'failed' | 'warning';
  text?: {
    title?: string;
    sections?: Array<{ title: string; content: string }>;
  };
  visuals?: Array<{
    type: 'kpi_grid' | 'table' | 'flowchart' | 'cards' | 'chart' | 'product';
    title?: string;
    data?: any;
  }>;
  recommendations?: Array<{
    recommendation: string;
    explanation?: string;
    priority?: 'high' | 'medium' | 'low' | 'P1' | 'P2' | 'P3';
    expected_impact?: string;
    next_action?: string;
  }>;
  artifacts?: Array<{
    id: string;
    title: string;
    type: 'csv' | 'markdown' | 'script' | 'json' | 'code';
    content: string;
    description?: string;
  }>;
}

export interface ProductDataSummary {
  id?: string;
  title?: string;
  sellingPrice?: number;
  productCost?: number;
  profitMargin?: number;
  niche?: string;
  image?: string;
  sellingPoints?: string;
  description?: string;
  stock?: number;
  marketPotential?: string | number;
  status?: string;
}

export interface SkillPreviewEngineProps {
  content: string;
  skillTitle?: string;
  productTitle?: string;
  product?: ProductDataSummary;
  category?: string;
  language?: string;
  webResearchUsed?: boolean;
  executedAt?: string;
  isSimulated?: boolean;
  promptText?: string;
  skillIconBg?: string;
  skillIconColor?: string;
  skillColor?: string;
  className?: string;
  maxHeight?: string;
  onOpenSettings?: () => void;
  initialViewMode?: ViewMode;
  initialTab?: TabId;
}

export type TabId =
  | 'chatgpt'
  | 'workspace'
  | 'doc'
  | 'overview'
  | 'text'
  | 'visuals'
  | 'tables'
  | 'workflows'
  | 'charts'
  | 'artifacts'
  | 'prompt'
  | 'json';

export type ViewMode = 'split' | 'text-only' | 'preview-only' | 'gallery';

// Generic CardRenderer alias
export const CardRenderer = SectionRenderer;

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Universal Card Components
// ─────────────────────────────────────────────────────────────────────────────

export function SummaryCard({
  title,
  description,
  status = 'Completed',
  findings = [],
}: {
  title: string;
  description: string;
  status?: string;
  findings?: string[];
}) {
  return (
    <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 via-blue-50/50 to-white p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950 font-mono">
            {title}
          </h4>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </span>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed font-normal">
        {description}
      </p>

      {findings.length > 0 && (
        <div className="space-y-1.5 pt-1 border-t border-indigo-100/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 font-mono">
            Core Insights
          </span>
          <div className="space-y-1">
            {findings.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function KPICard({
  label,
  value,
  comparison,
  trend,
  colorTheme = 'blue',
  status,
}: {
  label: string;
  value: string;
  comparison?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorTheme?: 'emerald' | 'amber' | 'purple' | 'cyan' | 'rose' | 'blue' | string;
  status?: 'optimal' | 'watch' | 'alert';
}) {
  const getThemeClasses = () => {
    switch (colorTheme) {
      case 'emerald':
        return {
          container: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-emerald-200/90 text-emerald-950',
          label: 'text-emerald-700',
          value: 'text-emerald-700',
          icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'amber':
        return {
          container: 'bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white border-amber-200/90 text-amber-950',
          label: 'text-amber-700',
          value: 'text-amber-800',
          icon: <Tag className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'purple':
        return {
          container: 'bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white border-purple-200/90 text-purple-950',
          label: 'text-purple-700',
          value: 'text-purple-700',
          icon: <Percent className="w-3.5 h-3.5 text-purple-600" />,
        };
      case 'cyan':
        return {
          container: 'bg-gradient-to-br from-cyan-50/90 via-sky-50/40 to-white border-cyan-200/90 text-cyan-950',
          label: 'text-cyan-800',
          value: 'text-cyan-700',
          icon: <Activity className="w-3.5 h-3.5 text-cyan-600" />,
        };
      case 'rose':
        return {
          container: 'bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white border-rose-200/90 text-rose-950',
          label: 'text-rose-700',
          value: 'text-rose-700',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
        };
      default:
        return {
          container: 'bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white border-blue-200/90 text-blue-950',
          label: 'text-blue-700',
          value: 'text-blue-700',
          icon: <Zap className="w-3.5 h-3.5 text-blue-600" />,
        };
    }
  };

  const style = getThemeClasses();
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-400';

  return (
    <div className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-sm transition-all space-y-1.5 ${style.container}`}>
      <div className="flex items-center justify-between gap-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider truncate font-mono ${style.label}`}>
          {label}
        </span>
        <div className="flex items-center gap-1">
          {status && (
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'optimal'
                  ? 'bg-emerald-500 animate-pulse'
                  : status === 'watch'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
          )}
          {style.icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-base sm:text-lg font-black font-mono tracking-tight ${style.value}`}>
          {value}
        </span>
        {trend && (
          <span className={`flex items-center text-[10px] font-bold font-mono ${trendColor}`}>
            <TrendIcon className="w-3 h-3 mr-0.5" />
            {trend === 'up' ? '+High' : trend === 'down' ? '-Low' : 'Stable'}
          </span>
        )}
      </div>

      {comparison && (
        <div className="text-[10px] text-slate-500 font-medium truncate pt-0.5 border-t border-slate-200/50">
          vs. {comparison}
        </div>
      )}
    </div>
  );
}

export function AnalysisCard({
  category,
  title,
  findings,
  evidence,
  riskLevel = 'low',
  recommendedAction,
}: {
  category: string;
  title: string;
  findings: string;
  evidence?: string;
  riskLevel?: 'low' | 'moderate' | 'high';
  recommendedAction?: string;
}) {
  const riskBadge = {
    low: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Low Risk 🟢' },
    moderate: { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Moderate Risk 🟡' },
    high: { bg: 'bg-rose-50 text-rose-800 border-rose-200', label: 'High Risk 🔴' },
  }[riskLevel];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs p-4 space-y-2.5 transition-all">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
          {category}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold border ${riskBadge.bg}`}>
          {riskBadge.label}
        </span>
      </div>

      <h4 className="text-xs font-bold text-slate-900 leading-tight">
        {title}
      </h4>

      <p className="text-xs text-slate-700 leading-relaxed">
        {findings}
      </p>

      {evidence && (
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-mono leading-relaxed">
          <span className="font-bold text-slate-700 block mb-0.5">Evidence Data:</span>
          {evidence}
        </div>
      )}

      {recommendedAction && (
        <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/50 p-2 rounded-xl border border-indigo-100">
          <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold">Next Action: </span>
            {recommendedAction}
          </div>
        </div>
      )}
    </div>
  );
}

export function RecommendationCard({
  recommendation,
  explanation,
  priority = 'P1',
  expectedImpact,
  nextAction,
}: {
  recommendation: string;
  explanation?: string;
  priority?: 'P1' | 'P2' | 'P3' | 'high' | 'medium' | 'low';
  expectedImpact?: string;
  nextAction?: string;
}) {
  const normPriority = (priority.startsWith('P') ? priority : priority === 'high' ? 'P1' : priority === 'medium' ? 'P2' : 'P3').toUpperCase();
  const priorityStyle =
    normPriority === 'P1'
      ? 'bg-rose-100 text-rose-800 border-rose-300'
      : normPriority === 'P2'
      ? 'bg-amber-100 text-amber-800 border-amber-300'
      : 'bg-blue-100 text-blue-800 border-blue-300';

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-xs transition-all space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider border ${priorityStyle}`}>
          {normPriority} PRIORITY
        </span>
        {expectedImpact && (
          <span className="text-[10px] font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Impact: {expectedImpact}
          </span>
        )}
      </div>

      <h4 className="text-xs font-bold text-slate-900 leading-snug flex items-start gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <span>{recommendation}</span>
      </h4>

      {explanation && (
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          {explanation}
        </p>
      )}

      {nextAction && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
          <span className="text-slate-500">Execution:</span>
          <span className="font-semibold flex items-center gap-1 hover:underline cursor-pointer">
            {nextAction} →
          </span>
        </div>
      )}
    </div>
  );
}

export function ProductCard({
  product,
}: {
  product: ProductDataSummary;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
      {product.image && (
        <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
          <img
            src={product.image}
            alt={product.title || 'Product'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-bold text-white font-mono">
            {product.niche || 'E-Com'}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0 space-y-1.5 w-full">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold text-slate-900 truncate">
            {product.title || 'Verified Winning Product'}
          </h4>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            {product.status || 'Verified Product'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold font-mono">
            Selling: {product.sellingPrice?.toLocaleString()} DZD
          </div>
          <div className="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-mono">
            Cost: {product.productCost?.toLocaleString()} DZD
          </div>
          <div className="px-2 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-[11px] font-bold font-mono">
            +{product.profitMargin}% Margin
          </div>
          {product.marketPotential && (
            <div className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold font-mono">
              Potential: {product.marketPotential}
            </div>
          )}
        </div>

        {product.sellingPoints && (
          <p className="text-[11px] text-slate-500 leading-tight truncate">
            💡 {product.sellingPoints}
          </p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Universal Flowchart & Table Renderers
// ─────────────────────────────────────────────────────────────────────────────

export function UniversalFlowchartRenderer({
  steps,
  title = 'Execution Workflow & Strategy Flowchart',
}: {
  steps: Array<{ number: number; title: string; description: string; badge?: string }>;
  title?: string;
}) {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((z) => Math.min(1.8, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z - 0.15));
  const handleResetZoom = () => setZoom(1);

  const handleExportText = () => {
    const textFlow = steps
      .map((s, idx) => `[Stage ${s.number}] ${s.title}\n   ${s.description}\n   ${idx < steps.length - 1 ? '      ↓' : ''}`)
      .join('\n');
    navigator.clipboard.writeText(textFlow);
    alert('Flowchart text hierarchy copied to clipboard!');
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-white' : ''
      }`}
    >
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-black uppercase tracking-wider font-mono text-slate-800">
            {title}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {steps.length} Nodes
          </span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center bg-white border border-slate-200/90 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono font-bold text-slate-600">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded cursor-pointer ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportText}
            className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[10.5px] font-mono font-semibold text-slate-700 flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Export Flowchart Hierarchy"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer shadow-2xs"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-6 bg-radial from-slate-50 via-white to-slate-50/50 overflow-auto flex-1 min-h-[300px] flex justify-center items-start">
        <div
          className="flex flex-col items-center space-y-3 transition-transform duration-150 origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          {steps.map((step, idx) => {
            const isSelected = selectedNode === step.number;
            return (
              <React.Fragment key={step.number}>
                <div
                  onClick={() => setSelectedNode(isSelected ? null : step.number)}
                  className={`relative w-80 sm:w-96 p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/90 ring-4 ring-indigo-500/20 scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-xs">
                        {String(step.number).padStart(2, '0')}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {step.title}
                      </h4>
                    </div>
                    {step.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
                        {step.badge}
                      </span>
                    )}
                  </div>

                  {step.description && (
                    <p className="text-[11.5px] text-slate-600 leading-relaxed font-normal line-clamp-3">
                      {step.description}
                    </p>
                  )}

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-indigo-200/80 text-[10.5px] text-indigo-900 font-mono flex items-center justify-between">
                      <span>✓ Active Node Selected</span>
                      <span className="underline">Click to close</span>
                    </div>
                  )}
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-indigo-300" />
                    <ChevronDown className="w-4 h-4 text-indigo-500 -mt-1.5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function UniversalTableRenderer({
  headers,
  rows,
  title = 'Data Matrix',
}: {
  headers: string[];
  rows: string[][];
  title?: string;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((row) =>
      row.some((cell) => cell.toLowerCase().includes(term))
    );
  }, [rows, searchTerm]);

  const sortedRows = useMemo(() => {
    if (sortCol === null) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortCol] || '';
      const bVal = b[sortCol] || '';
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortCol, sortDir]);

  const handleSort = (colIdx: number) => {
    if (sortCol === colIdx) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortCol(colIdx);
      setSortDir('asc');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${(title || 'table_export').toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden flex flex-col space-y-0">
      <div className="p-3 bg-gradient-to-r from-slate-50 via-slate-100/50 to-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <h4 className="text-xs font-black uppercase tracking-wider font-mono text-slate-800">
            {title}
          </h4>
          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            {sortedRows.length} {sortedRows.length === 1 ? 'row' : 'rows'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search table..."
              className="pl-7 pr-3 py-1 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-indigo-500 w-36 sm:w-48 shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-[11px] font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3 h-3 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-black">
              {headers.map((h, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(i)}
                  className="px-3.5 py-2.5 text-[11px] uppercase tracking-wider font-mono cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{h}</span>
                    {sortCol === i ? (
                      sortDir === 'asc' ? (
                        <ChevronUp className="w-3 h-3 text-indigo-600" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-indigo-600" />
                      )
                    ) : (
                      <span className="text-slate-300">↕</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-400 text-xs">
                  No matching records found.
                </td>
              </tr>
            ) : (
              sortedRows.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <tr
                    onClick={() => setExpandedRow(expandedRow === rIdx ? null : rIdx)}
                    className={`transition-colors cursor-pointer ${
                      rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    } hover:bg-blue-50/40`}
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3.5 py-2 text-slate-800 text-xs font-medium align-middle">
                        <StatusAwareTableCell text={cell} />
                      </td>
                    ))}
                  </tr>
                  {expandedRow === rIdx && (
                    <tr className="bg-indigo-50/40">
                      <td colSpan={headers.length} className="px-4 py-3 border-t border-b border-indigo-100">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                          {headers.map((h, hIdx) => (
                            <div key={hIdx} className="p-2 rounded-lg bg-white border border-indigo-100">
                              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                                {h}
                              </span>
                              <span className="text-slate-800 font-medium">{row[hIdx] || '—'}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Universal Skill Preview Engine Component
// ─────────────────────────────────────────────────────────────────────────────

export const SkillPreviewEngine: React.FC<SkillPreviewEngineProps> = ({
  content,
  skillTitle = 'AI Analysis',
  productTitle,
  product,
  category,
  language = 'English',
  webResearchUsed,
  executedAt,
  isSimulated,
  promptText,
  skillIconBg,
  skillIconColor,
  skillColor,
  className = '',
  maxHeight = 'max-h-[700px]',
  onOpenSettings,
  initialViewMode,
  initialTab,
}) => {
  // View mode: Split, Text Only, Preview Only, Gallery (defaults to ChatGPT Gallery mode!)
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode || 'gallery');
  const [activeTab, setActiveTab] = useState<TabId>(initialTab || 'chatgpt');
  const [checkedChecklist, setCheckedChecklist] = useState<Record<string, boolean>>({});

  // 1. Clean and normalize output
  const cleanContent = useMemo(() => normalizeAndCleanAIOutput(content), [content]);

  // Extract any code block from cleanContent for Code Preview (Reference 13)
  const extractedCodeBlock = useMemo(() => {
    const codeMatch = cleanContent.match(/```(?:html|javascript|typescript|json|css|bash)?\s*([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : null;
  }, [cleanContent]);

  // 2. Try JSON schema detection
  const structuredJsonOutput: UniversalSkillOutput | null = useMemo(() => {
    try {
      const trimmed = cleanContent.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && (parsed.skill_name || parsed.visuals || parsed.recommendations || parsed.artifacts)) {
          return parsed as UniversalSkillOutput;
        }
      }
    } catch {
      // Continue with Markdown parsing
    }
    return null;
  }, [cleanContent]);

  // 3. Analyze content using Universal Content Analyzer
  const analyzed = useMemo(() => {
    return analyzeContent(cleanContent, skillTitle, productTitle);
  }, [cleanContent, skillTitle, productTitle]);

  // 4. Resolve Skill Theme
  const theme = useMemo(() => {
    return getSkillTheme(skillColor || skillIconBg, category);
  }, [skillColor, skillIconBg, category]);

  // 5. Automatic extraction of Recommendations
  const recommendations = useMemo(() => {
    if (structuredJsonOutput?.recommendations) {
      return structuredJsonOutput.recommendations;
    }
    return analyzed.checklist.map((item, idx) => ({
      recommendation: item.text,
      explanation: `Operational action item identified in strategic review for ${productTitle || 'product'}.`,
      priority: item.priority === 'high' ? ('P1' as const) : ('P2' as const),
      expected_impact: idx === 0 ? 'High Revenue Impact' : 'Efficiency Boost',
      next_action: 'Deploy to live campaign',
    }));
  }, [structuredJsonOutput, analyzed.checklist, productTitle]);

  // 6. Automatic extraction of Artifacts
  const artifacts = useMemo(() => {
    if (structuredJsonOutput?.artifacts) {
      return structuredJsonOutput.artifacts.map((a) => ({
        id: a.id,
        name: a.title || 'deliverable.txt',
        title: a.title || 'deliverable.txt',
        type: (a.type || 'markdown') as 'markdown' | 'csv' | 'json' | 'code' | 'pdf',
        content: a.content,
        description: a.description,
      }));
    }
    const list: Array<{ id: string; name: string; title: string; type: 'markdown' | 'csv' | 'json' | 'code' | 'pdf'; content: string; description?: string }> = [];

    // Full Dossier Markdown
    list.push({
      id: 'art-full-dossier',
      name: `${(productTitle || 'strategy').toLowerCase().replace(/\s+/g, '_')}_full_dossier.md`,
      title: `${skillTitle} — General Strategic Dossier`,
      type: 'markdown',
      content: cleanContent,
      description: 'Complete unedited strategy dossier and cross-funnel analysis ready for export.',
    });

    // Tables as CSV
    analyzed.tables.forEach((tbl, idx) => {
      const csvStr = [
        tbl.headers.join(','),
        ...tbl.rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')),
      ].join('\n');
      list.push({
        id: `art-table-${idx}`,
        name: `${(tbl.title || `data_matrix_${idx + 1}`).toLowerCase().replace(/\s+/g, '_')}.csv`,
        title: tbl.title || `Data Matrix #${idx + 1}`,
        type: 'csv',
        content: csvStr,
        description: `Exportable structured table data (${tbl.rows.length} records).`,
      });
    });

    // Ad copy / scripts / hooks section
    const hookSec = analyzed.sections.find((s) => s.type === 'hooks');
    if (hookSec && hookSec.hookItems) {
      const hookText = hookSec.hookItems.map((h, i) => `HOOK #${i + 1} (${h.title}):\n"${h.body}"`).join('\n\n');
      list.push({
        id: 'art-hooks',
        name: 'viral_hooks_and_scripts.txt',
        title: 'Viral Hooks and Ad Copies',
        type: 'code',
        content: hookText,
        description: 'Direct-response video hooks and ad copies formatted for Meta & TikTok feeds.',
      });
    }

    return list;
  }, [structuredJsonOutput, cleanContent, productTitle, skillTitle, analyzed.tables, analyzed.sections]);

  // 7. Dynamic tab visibility
  const tabs = useMemo(() => {
    const list: { id: TabId; label: string; icon: React.ReactNode; badge?: number }[] = [
      { id: 'chatgpt', label: 'ChatGPT View', icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> },
      { id: 'workspace', label: 'Workspace View', icon: <SplitSquareHorizontal className="w-3.5 h-3.5 text-blue-600" /> },
      { id: 'doc', label: 'Document View', icon: <FileText className="w-3.5 h-3.5 text-indigo-600" /> },
      { id: 'overview', label: 'Overview', icon: <Star className="w-3.5 h-3.5" /> },
      { id: 'text', label: 'Text', icon: <AlignLeft className="w-3.5 h-3.5" /> },
      { id: 'visuals', label: 'Visual Preview', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    ];

    if (analyzed.tables.length > 0) {
      list.push({
        id: 'tables',
        label: 'Tables',
        icon: <Layers className="w-3.5 h-3.5" />,
        badge: analyzed.tables.length,
      });
    }

    if (analyzed.steps.length > 0) {
      list.push({
        id: 'workflows',
        label: 'Workflows',
        icon: <GitFork className="w-3.5 h-3.5" />,
      });
    }

    if (analyzed.metrics.length > 0) {
      list.push({
        id: 'charts',
        label: 'Charts',
        icon: <BarChart3 className="w-3.5 h-3.5" />,
      });
    }

    if (artifacts.length > 0) {
      list.push({
        id: 'artifacts',
        label: 'Artifacts',
        icon: <Package className="w-3.5 h-3.5" />,
        badge: artifacts.length,
      });
    }

    if (promptText) {
      list.push({
        id: 'prompt',
        label: 'Prompt',
        icon: <MessageSquare className="w-3.5 h-3.5" />,
      });
    }

    list.push({
      id: 'json',
      label: 'JSON',
      icon: <Code2 className="w-3.5 h-3.5" />,
    });

    return list;
  }, [analyzed.tables.length, analyzed.steps.length, analyzed.metrics.length, artifacts.length, promptText]);

  const toggleChecklist = (id: string) => {
    setCheckedChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Tab Content Renderers
  // ─────────────────────────────────────────────────────────────────────────

  // 1. OVERVIEW TAB
  const renderOverviewTab = () => (
    <div className="w-full max-w-[820px] mx-auto space-y-6 animate-in fade-in select-text">
      <SkillReportHeader
        title={analyzed.title || `${skillTitle} — ${productTitle || 'Verified Winning Product'}`}
        badges={[
          { text: 'Analysis completed', category: 'success' },
          { text: category ? `Stage: ${category}` : 'Stage 01: Product Intelligence', category: 'neutral' },
        ]}
        timestamp={executedAt}
      />

      {/* Executive Summary Paragraph (15px font, 1.7 line height) */}
      {analyzed.executiveSummary && (
        <div className="space-y-2">
          <h2 className="text-[20px] font-semibold leading-[1.4] text-[#202123] dark:text-white tracking-tight">
            Executive Summary & Key Findings
          </h2>
          <p className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
            {analyzed.executiveSummary}
          </p>
        </div>
      )}

      {/* Unified KPI Group */}
      {analyzed.metrics.length > 0 && (
        <KPIRenderer
          title="Campaign Performance & Commercial Benchmarks"
          timeframe="LAST 7 DAYS"
          statusBadge="Active campaign"
          metrics={analyzed.metrics.slice(0, 6).map((m) => ({
            label: m.label,
            value: m.value,
            subValue: m.value.includes('DZD') ? undefined : 'DZD',
            badge: m.trend === 'up' ? 'Optimal' : undefined,
            badgeCategory: m.trend === 'up' ? ('success' as const) : ('neutral' as const),
          }))}
        />
      )}

      {/* Top Strategic Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3 my-6">
          <h3 className="text-[17px] font-semibold text-[#202123] dark:text-white">
            Top Strategic Recommendations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec, i) => (
              <RecommendationCard
                key={i}
                recommendation={rec.recommendation}
                priority={rec.priority}
                expectedImpact={rec.expected_impact}
                nextAction={rec.next_action}
              />
            ))}
          </div>
        </div>
      )}

      {/* Strategic Verdict */}
      {analyzed.conclusion && (
        <div className="space-y-2 pt-2 border-t border-[#E5E7EB] dark:border-[#3A3A3A]">
          <h3 className="text-[17px] font-semibold text-[#202123] dark:text-white">
            Strategic Verdict & Scale Authorization
          </h3>
          <p className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB]">
            {analyzed.conclusion}
          </p>
        </div>
      )}
    </div>
  );

  // ── Intelligent Skill Objective & Adaptive Presentation Selector ──
  // Evaluates skill title, category, and real output content to select ONLY
  // the specific visual component(s) required. Never dumps all elements together!
  const adaptiveConfig = useMemo(() => {
    const t = (skillTitle || '').toLowerCase();
    const c = (cleanContent || '').toLowerCase();
    const cat = (category || '').toLowerCase();

    // 1. Skill Purpose & Domain Classification:
    const isFinancialOrPricing =
      t.includes('profit') ||
      t.includes('pricing') ||
      t.includes('margin') ||
      t.includes('cost') ||
      t.includes('economic') ||
      t.includes('calculator') ||
      t.includes('break-even') ||
      cat.includes('finance');

    const isLandingOrWeb =
      t.includes('landing') ||
      t.includes('product page') ||
      t.includes('website') ||
      t.includes('storefront') ||
      t.includes('web page') ||
      t.includes('sales page') ||
      cat.includes('web');

    const isAnalyticsOrCampaign =
      t.includes('campaign') ||
      t.includes('traffic') ||
      t.includes('spend') ||
      t.includes('roas') ||
      t.includes('analytics') ||
      t.includes('performance') ||
      t.includes('cpa') ||
      cat.includes('analytics');

    const isCopywritingOrCreative =
      t.includes('copy') ||
      t.includes('headline') ||
      t.includes('hook') ||
      t.includes('angle') ||
      t.includes('script') ||
      t.includes('vsl') ||
      cat.includes('copywriting') ||
      cat.includes('creative');

    const isWorkflowOrFunnel =
      t.includes('workflow') ||
      t.includes('funnel') ||
      t.includes('blueprint') ||
      t.includes('orchestrat') ||
      t.includes('pipeline') ||
      cat.includes('workflow');

    const isAuditOrValidation =
      t.includes('validation') ||
      t.includes('audit') ||
      t.includes('compliance') ||
      t.includes('quality') ||
      t.includes('check') ||
      cat.includes('validation');

    const isSynthesisDossier =
      t.includes('synthesis') ||
      t.includes('deep dossier') ||
      t.includes('master multi');

    const isProductDiscovery =
      t.includes('discovery') ||
      t.includes('intelligence') ||
      t.includes('winning') ||
      t.includes('competitor') ||
      t.includes('comparison') ||
      cat.includes('research') ||
      cat.includes('discovery');

    // 2. Real Content Signals:
    const hasCodeBlock = Boolean(extractedCodeBlock);
    const hasMetrics = analyzed.metrics.length > 0;
    const hasSteps = analyzed.steps.length >= 2;
    const hasChecklist = analyzed.checklist.length > 0;
    const hasRecs = recommendations.length > 0;
    const hasArtifacts = artifacts.length > 0;

    const mentionsPricing =
      c.includes('dzd') ||
      c.includes('selling price') ||
      c.includes('product cost') ||
      c.includes('margin') ||
      Boolean(product?.sellingPrice || product?.productCost);

    const mentionsFormula =
      c.includes('formula') ||
      c.includes('p = sp') ||
      c.includes('sp - pc') ||
      c.includes('contribution');

    return {
      showCalculator: isFinancialOrPricing && mentionsPricing && !mentionsFormula,
      showFormula: isFinancialOrPricing && mentionsFormula,
      showLandingPreview: isLandingOrWeb && (Boolean(product?.image) || c.includes('preview') || c.includes('order now')),
      showCharts: isAnalyticsOrCampaign && hasMetrics,
      showMetrics: (isAnalyticsOrCampaign || isProductDiscovery || isSynthesisDossier) && hasMetrics,
      showCodeSnippet: (isCopywritingOrCreative || isLandingOrWeb) && hasCodeBlock,
      showFlowchart: (isWorkflowOrFunnel || isSynthesisDossier) && hasSteps,
      showChecklist: (isWorkflowOrFunnel || isSynthesisDossier) && hasChecklist,
      showMultiStageTracker: (isWorkflowOrFunnel || isSynthesisDossier) && analyzed.steps.length >= 3,
      showRecommendations: (isSynthesisDossier || isProductDiscovery || isWorkflowOrFunnel) && hasRecs,
      showDeliverables: hasArtifacts,
      showProductCards: isProductDiscovery && Boolean(product && (product.sellingPrice || product.productCost)),
    };
  }, [skillTitle, category, cleanContent, analyzed, product, recommendations, artifacts, extractedCodeBlock]);

  // 2. CHATGPT CONTINUOUS CONVERSATIONAL VIEW (Matching ChatGPT Response Quality!)
  const renderChatGptGalleryTab = () => {
    const nextSkill = (() => {
      const t = skillTitle.toLowerCase();
      if (t.includes('discovery') || t.includes('intelligence')) {
        return { name: 'Target Market Research', description: 'Analyze customer segments, demographics and buying motivations.' };
      }
      if (t.includes('market')) {
        return { name: 'Buyer Persona Research', description: 'Map pain points, triggers, objections, and buying habits.' };
      }
      if (t.includes('persona')) {
        return { name: 'Direct Response Copywriting', description: 'Generate high-converting headlines, hooks, and sales scripts.' };
      }
      if (t.includes('copy') || t.includes('ad')) {
        return { name: 'Campaign Blueprint & Launch Strategy', description: 'Configure Meta & TikTok ad budgets, tests and scaling criteria.' };
      }
      return { name: 'Product Strategy & Scale Authorization', description: 'Validate unit economics and scale advertising campaigns.' };
    })();

    return (
      <ChatGPTConversationalRenderer
        skillTitle={skillTitle}
        productTitle={productTitle || product?.title}
        category={category}
        reportTitle={analyzed.title}
        badges={[
          { text: 'Analysis completed', category: 'success' },
          { text: category ? `Stage: ${category}` : 'Stage 01: Product Intelligence', category: 'neutral' },
        ]}
        rawContent={cleanContent}
        metrics={
          adaptiveConfig.showMetrics
            ? analyzed.metrics.map((m) => ({
                label: m.label,
                value: m.value,
                subValue: m.value.includes('DZD') ? undefined : 'DZD',
                badge: m.trend === 'up' ? 'Optimal' : undefined,
                badgeCategory: m.trend === 'up' ? ('success' as const) : ('neutral' as const),
              }))
            : undefined
        }
        products={
          adaptiveConfig.showProductCards && product
            ? [
                {
                  id: product.id || 'p1',
                  name: product.title || productTitle || 'Featured Product',
                  sellingPrice: product.sellingPrice || 2500,
                  productCost: product.productCost || 850,
                  profitMargin: product.profitMargin || 66,
                  image: product.image,
                  badge: 'Target product',
                  badgeCategory: 'success' as const,
                },
              ]
            : undefined
        }
        flowSteps={
          adaptiveConfig.showFlowchart
            ? analyzed.steps.map((st, idx) => ({
                id: String(idx + 1),
                title: st.title.toUpperCase(),
                subtitle: st.description,
                isDecision: idx === analyzed.steps.length - 1,
                decisionLabel: idx === analyzed.steps.length - 1 ? 'Decision point' : undefined,
              }))
            : undefined
        }
        checklist={
          adaptiveConfig.showChecklist
            ? analyzed.checklist.map((c) => c.text)
            : undefined
        }
        codeSnippet={
          adaptiveConfig.showCodeSnippet && extractedCodeBlock
            ? {
                title: 'Direct-Response Ad Copy & HTML',
                language: 'HTML',
                code: extractedCodeBlock,
              }
            : undefined
        }
        actionableRecommendations={
          adaptiveConfig.showRecommendations
            ? recommendations.slice(0, 3).map((r, i) => ({
                id: `ar-${i}`,
                number: i + 1,
                title: r.recommendation,
                description: r.explanation || `Actionable step identified for ${productTitle || 'product'}.`,
                priority: r.priority === 'P1' ? 'High priority' : 'Medium',
                expectedImpact: r.expected_impact || 'Better performance',
                actionLabel: i === 0 ? 'Recommended action' : undefined,
              }))
            : undefined
        }
        calculator={
          adaptiveConfig.showCalculator
            ? {
                initialSellingPrice: product?.sellingPrice || 2500,
                initialProductCost: product?.productCost || 850,
                initialDeliveryCost: 500,
                currency: 'DZD',
              }
            : undefined
        }
        formula={
          adaptiveConfig.showFormula
            ? {
                formulaSubtitle: 'Contribution before advertising:',
                formulaEquation: 'P = SP - PC - DC',
                variables: [
                  { symbol: 'SP', name: 'Selling price' },
                  { symbol: 'PC', name: 'Product cost' },
                  { symbol: 'DC', name: 'Delivery cost' },
                ],
                exampleEquation: `${product?.sellingPrice || 2500} - ${product?.productCost || 850} - 500 = ${(product?.sellingPrice || 2500) - (product?.productCost || 850) - 500}`,
                resultLabel: 'Contribution before advertising',
                resultValue: `${((product?.sellingPrice || 2500) - (product?.productCost || 850) - 500).toLocaleString()} DZD`,
              }
            : undefined
        }
        productPageLivePreview={
          adaptiveConfig.showLandingPreview
            ? {
                productName: product?.title || productTitle || 'Featured Product',
                price: product?.sellingPrice || 2500,
                headline: 'Confidence in every detail.',
                description: product?.description || 'Precision grooming made simple. Compact, rechargeable and easy to use.',
                image: product?.image,
                currency: 'DZD',
              }
            : undefined
        }
        chartData={
          adaptiveConfig.showCharts
            ? {
                barTitle: 'Daily advertising spend',
                barSubtitle: 'Illustrative campaign spending in DZD',
                lineTitle: 'Daily purchase trend',
                lineSubtitle: 'Illustrative daily purchases',
                barData: [
                  { day: 'Mon', value: 1200 },
                  { day: 'Tue', value: 1650 },
                  { day: 'Wed', value: 1850 },
                  { day: 'Thu', value: 1300 },
                  { day: 'Fri', value: 2300 },
                  { day: 'Sat', value: 1950 },
                  { day: 'Sun', value: 2600 },
                ],
                lineData: [
                  { day: 'Mon', value: 4 },
                  { day: 'Tue', value: 6 },
                  { day: 'Wed', value: 8 },
                  { day: 'Thu', value: 5 },
                  { day: 'Fri', value: 10 },
                  { day: 'Sat', value: 8 },
                  { day: 'Sun', value: 13 },
                ],
              }
            : undefined
        }
        multiStageTracker={
          adaptiveConfig.showMultiStageTracker
            ? {
                progressPercent: 60,
                stages: analyzed.steps.map((st, i) => ({
                  step: `0${i + 1}`.slice(-2),
                  title: st.title,
                  status: i < 3 ? 'Completed' : i === 3 ? 'Running' : 'Waiting',
                })),
              }
            : undefined
        }
        deliverableCards={
          adaptiveConfig.showDeliverables
            ? artifacts.map((art, idx) => ({
                id: art.id || `art-${idx}`,
                title: art.title,
                fileKind: (art.type === 'csv' ? 'xlsx' : art.type === 'code' ? 'code' : 'pdf') as any,
                metaInfo: art.description || `${art.type.toUpperCase()} Deliverable`,
                badgeLabel: 'Generated',
              }))
            : undefined
        }
        nextRecommendedSkill={{
          name: nextSkill.name,
          description: nextSkill.description,
          onClick: () => {
            alert(`Next recommended skill: ${nextSkill.name}`);
          },
        }}
        conclusion={analyzed.conclusion}
        artifacts={artifacts.length > 0 ? artifacts : undefined}
        onCopy={() => navigator.clipboard.writeText(cleanContent)}
      />
    );
  };

  // 2a. WORKSPACE VIEW (Split-Screen Text + Visual Preview Workspace — Reference 24)
  const renderWorkspaceTab = () => (
    <div className="w-full max-w-[860px] mx-auto animate-in fade-in select-text">
      <SkillResultWorkspace
        skillName={skillTitle.toUpperCase()}
        statusBadge="Completed"
        defaultMode="split"
        textAnalysis={{
          productOverview:
            analyzed.sections[0]?.paragraphs[0] ||
            (product
              ? `${product.title} — ${product.description || 'Portable rechargeable grooming device.'}`
              : 'Analysis of product opportunity, market demand, and audience feasibility.'),
          audience:
            analyzed.sections.find(
              (s) =>
                s.title.toLowerCase().includes('audience') ||
                s.title.toLowerCase().includes('target') ||
                s.title.toLowerCase().includes('persona')
            )?.paragraphs[0] || 'Men aged 20–45, personal grooming consumers, gift buyers.',
          recommendation:
            analyzed.conclusion ||
            recommendations[0]?.recommendation ||
            'Test three creative angles and validate offer before scaling ad budget.',
          rawText: cleanContent,
        }}
        visualComponents={{
          marketPotential: 'High',
          targetAudience: 'Men 20–45',
          nextAction: recommendations[0]?.recommendation || 'Creative testing',
          margin: product?.profitMargin ? `${product.profitMargin}%` : '66%',
          metrics: analyzed.metrics.map((m) => ({
            label: m.label,
            value: m.value,
            badge: m.trend === 'up' ? 'Optimal' : undefined,
            badgeCategory: 'success',
          })),
        }}
      />
    </div>
  );

  // 2b. DOCUMENT VIEW (Editorial Long-Form Reading — The exact past document preview)
  const renderDocumentTab = () => (
    <div className="prose prose-slate max-w-none space-y-4 animate-in fade-in leading-relaxed text-xs sm:text-[13.5px] text-slate-800 dark:text-slate-100 max-w-[820px] mx-auto select-text">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          {analyzed.title}
        </h2>
        {analyzed.subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {analyzed.subtitle}
          </p>
        )}
      </div>

      {analyzed.executiveSummary && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-indigo-950/40 dark:to-slate-900 border-l-4 border-indigo-600 text-slate-900 dark:text-slate-100 font-medium leading-relaxed shadow-2xs">
          <EnrichedText text={analyzed.executiveSummary} />
        </div>
      )}

      {/* Structured Document View with Markdown Tables, ASCII Flowcharts & Trees, Lists, Callouts */}
      <MarkdownDocumentRenderer content={cleanContent} />
    </div>
  );

  // 3. TEXT TAB (ChatGPTMarkdownDocumentRenderer — 15px font, 1.7 line height, no tiny boxes!)
  const renderTextTab = () => (
    <div className="w-full max-w-[820px] mx-auto py-2 font-sans select-text">
      <ChatGPTMarkdownDocumentRenderer content={cleanContent} />
    </div>
  );

  // 4. VISUALS TAB (All Visual Components — ChatGPT Standard)
  const renderVisualsTab = () => (
    <div className="w-full max-w-[820px] mx-auto space-y-6 select-text">
      {analyzed.metrics.length > 0 && (
        <KPIRenderer
          title="Commercial KPI Benchmarks"
          timeframe="SUMMARY"
          metrics={analyzed.metrics.map((m) => ({
            label: m.label,
            value: m.value,
            subValue: m.value.includes('DZD') ? undefined : 'DZD',
            badge: m.trend === 'up' ? 'Optimal' : undefined,
            badgeCategory: m.trend === 'up' ? ('success' as const) : ('neutral' as const),
          }))}
        />
      )}

      {/* Data Tables */}
      {analyzed.tables.map((tbl, i) => (
        <TableRenderer
          key={i}
          title={tbl.title || `Data Matrix #${i + 1}`}
          columns={tbl.headers}
          rows={tbl.rows.map((row) => {
            const obj: any = { criteria: row[0] || `Item ${i + 1}` };
            tbl.headers.slice(1).forEach((h, hIdx) => {
              obj[h] = row[hIdx + 1] || '—';
            });
            return obj;
          })}
        />
      ))}

      {/* Execution Roadmap Flowchart */}
      {analyzed.steps.length > 0 && (
        <FlowchartRenderer
          title="Execution Roadmap & Process Flow"
          steps={analyzed.steps.map((st, idx) => ({
            id: String(idx + 1),
            title: st.title.toUpperCase(),
            subtitle: st.description,
            isDecision: idx === analyzed.steps.length - 1,
            decisionLabel: idx === analyzed.steps.length - 1 ? 'Decision point' : undefined,
            branches:
              idx === analyzed.steps.length - 1
                ? [
                    { label: 'Good', text: 'Scale campaign', category: 'success' as const },
                    { label: 'Poor', text: 'Optimize campaign', category: 'danger' as const },
                  ]
                : undefined,
          }))}
        />
      )}

      {/* Interactive Action Checklist */}
      {analyzed.checklist.length > 0 && (
        <ChecklistRenderer
          title="Operational Action Checklist"
          items={analyzed.checklist.map((c) => c.text)}
        />
      )}
    </div>
  );
  // 5. TABLES TAB
  const renderTablesTab = () => (
    <div className="w-full max-w-[820px] mx-auto space-y-6 select-text">
      {analyzed.tables.length === 0 ? (
        <TableRenderer />
      ) : (
        analyzed.tables.map((tbl, i) => (
          <TableRenderer
            key={i}
            title={tbl.title || `Data Table #${i + 1}`}
            columns={tbl.headers}
            rows={tbl.rows.map((row) => {
              const obj: any = { criteria: row[0] || `Row ${i + 1}` };
              tbl.headers.slice(1).forEach((h, hIdx) => {
                obj[h] = row[hIdx + 1] || '—';
              });
              return obj;
            })}
          />
        ))
      )}
    </div>
  );

  // 6. WORKFLOWS TAB
  const renderWorkflowsTab = () => (
    <div className="w-full max-w-[820px] mx-auto space-y-6 select-text">
      {analyzed.steps.length > 0 ? (
        <FlowchartRenderer
          title="Execution Process Flowchart"
          steps={analyzed.steps.map((st, idx) => ({
            id: String(idx + 1),
            title: st.title.toUpperCase(),
            subtitle: st.description,
            isDecision: idx === analyzed.steps.length - 1,
            decisionLabel: idx === analyzed.steps.length - 1 ? 'Decision point' : undefined,
            branches:
              idx === analyzed.steps.length - 1
                ? [
                    { label: 'Good', text: 'Scale campaign', category: 'success' as const },
                    { label: 'Poor', text: 'Optimize campaign', category: 'danger' as const },
                  ]
                : undefined,
          }))}
        />
      ) : (
        <FlowchartRenderer />
      )}
      <WorkflowChartView
        content={cleanContent}
        skillTitle={skillTitle}
        productTitle={productTitle}
        language={language}
        skillColor={skillColor || skillIconBg}
        category={category}
      />
    </div>
  );

  // 7. CHARTS TAB
  const renderChartsTab = () => (
    <div className="w-full max-w-[820px] mx-auto space-y-6 select-text">
      <ChartRenderer />
      <AnalyticsDashboardView
        content={cleanContent}
        skillTitle={skillTitle}
        productTitle={productTitle}
        category={category}
        language={language}
        parsedData={analyzed}
        skillColor={skillColor || skillIconBg}
      />
    </div>
  );

  // 8. ARTIFACTS TAB
  const renderArtifactsTab = () => (
    <ChatGptArtifacts artifacts={artifacts} />
  );

  // 9. PROMPT TAB
  const renderPromptTab = () => (
    <div className="space-y-2 select-text">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
          AI Execution Prompt
        </span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(promptText || '');
            alert('Prompt copied!');
          }}
          className="px-2 py-0.5 rounded border border-slate-200 text-[10.5px] font-bold text-indigo-700 bg-white hover:bg-slate-50 cursor-pointer"
        >
          Copy Prompt
        </button>
      </div>
      <pre className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto">
        {promptText || 'Standard prompt executed.'}
      </pre>
    </div>
  );

  // 10. JSON TAB
  const renderJsonTab = () => (
    <div className="space-y-2 select-text">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
          Structured JSON Payload
        </span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(analyzed, null, 2));
            alert('JSON copied!');
          }}
          className="px-2 py-0.5 rounded border border-slate-700 text-[10.5px] font-bold text-emerald-400 bg-slate-800 hover:bg-slate-700 cursor-pointer"
        >
          Copy JSON
        </button>
      </div>
      <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto">
        {JSON.stringify(analyzed, null, 2)}
      </pre>
    </div>
  );

  return (
    <div
      data-no-drag="true"
      data-no-card-drag="true"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={`universal-skill-preview-engine rounded-2xl border border-slate-200/90 shadow-md bg-white flex flex-col overflow-hidden text-slate-800 font-sans select-text cursor-auto ${className}`}
    >
      {/* ── TOP HEADER: TABS + GLOBAL VIEW MODE SWITCHER ── */}
      <div className="px-3 pt-2.5 pb-0 bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap shrink-0">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto min-w-0 flex-1 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(tab.id);
                if (tab.id === 'chatgpt') {
                  setViewMode('gallery');
                } else if (viewMode === 'gallery') {
                  setViewMode('preview-only');
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-t-xl text-[11px] font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-black flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Global View Mode Switcher: Split View / Text Only / Preview Only / ChatGPT Gallery */}
        <div className="flex items-center gap-1 bg-white border border-slate-200/90 rounded-xl p-1 shadow-2xs mb-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('split');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Split View: Side-by-side Text & Visuals"
          >
            <SplitSquareHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split View</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('text-only');
              if (activeTab === 'visuals' || activeTab === 'tables' || activeTab === 'workflows' || activeTab === 'charts') {
                setActiveTab('text');
              }
            }}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'text-only'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Text Only Mode"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Text Only</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('preview-only');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'preview-only'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Preview Only Mode"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview Only</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewMode('gallery');
              setActiveTab('chatgpt');
            }}
            className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewMode === 'gallery'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
            title="ChatGPT Style 25-Reference Canvas View"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ChatGPT Mode</span>
          </button>
        </div>
      </div>

      {/* ── BODY CONTENT AREA ── */}
      <div
        className={`p-4 overflow-y-auto ${maxHeight} transition-all duration-150 select-text`}
      >
        {/* If in Split View mode */}
        {viewMode === 'split' ? (
          renderWorkspaceTab()
        ) : viewMode === 'text-only' ? (
          renderTextTab()
        ) : viewMode === 'gallery' ? (
          renderChatGptGalleryTab()
        ) : (
          (() => {
            switch (activeTab) {
              case 'chatgpt':
                return renderChatGptGalleryTab();
              case 'workspace':
                return renderWorkspaceTab();
              case 'doc':
                return renderDocumentTab();
              case 'overview':
                return renderOverviewTab();
              case 'text':
                return renderTextTab();
              case 'visuals':
                return renderVisualsTab();
              case 'tables':
                return renderTablesTab();
              case 'workflows':
                return renderWorkflowsTab();
              case 'charts':
                return renderChartsTab();
              case 'artifacts':
                return renderArtifactsTab();
              case 'prompt':
                return renderPromptTab();
              case 'json':
                return renderJsonTab();
              default:
                return renderOverviewTab();
            }
          })()
        )}
      </div>
    </div>
  );
};

export default SkillPreviewEngine;
