/**
 * CRITICAL UI REDESIGN — CHATGPT-QUALITY SKILL OUTPUT RENDERER
 *
 * Implements a true conversational document layout inspired by ChatGPT responses:
 *
 * Typography System:
 *  - Main report title: 24px, 700 weight, 1.3 line height
 *  - Section heading H2: 20px, 650 weight, 1.4 line height
 *  - Section heading H3: 17px, 600 weight, 1.4 line height
 *  - Subheading: 15px, 600 weight, 1.5 line height
 *  - Body paragraphs: 15px, 400 weight, 1.7 line height (14px bottom margin)
 *  - List items: 15px, 400 weight, 1.65 line height (8px gap)
 *  - Table text: 13.5–14px, 400 weight, 1.5 line height
 *  - Table headers: 12–13px, 600 weight, 1.4 line height
 *  - KPI values: 26–32px, 650 weight, 1.2 line height
 *  - KPI labels: 12–13px, 500 weight, 1.4 line height
 *  - Status badges: 11–12px, 600 weight, 1.3 line height (22-24px height, 6px radius)
 *  - Metadata / Captions: 12px, 400 weight, 1.4-1.5 line height
 *  - Code: 13px, 400 weight, 1.6 line height
 *
 * Layout:
 *  - One central response column: Desktop max-w-[820px] mx-auto
 *  - Natural continuous flow (NOT every piece of info in a bordered card)
 *  - Unboxed narrative with inline data visualizations and unified KPI group
 */

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Search,
  Maximize2,
  Minimize2,
  RotateCcw,
  Tag,
  ArrowRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  Play,
  FileCode,
  Layers,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Activity,
  SplitSquareHorizontal,
  AlignLeft,
  LayoutGrid,
  Shield,
  Clock,
  Package,
  Globe,
  Calculator,
  FileSpreadsheet,
  FileText,
  ArrowUpRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Design Tokens & Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type BadgeCategory = 'success' | 'warning' | 'danger' | 'neutral';

export function getBadgeCategory(text: string): BadgeCategory {
  const t = text.toLowerCase();
  if (
    t.includes('completed') ||
    t.includes('good') ||
    t.includes('validated') ||
    t.includes('active') ||
    t.includes('approved') ||
    t.includes('optimal') ||
    t.includes('positive') ||
    t.includes('recommended') ||
    t.includes('strong') ||
    t.includes('high margin')
  ) {
    return 'success';
  }
  if (
    t.includes('needs review') ||
    t.includes('needs validation') ||
    t.includes('pending') ||
    t.includes('medium') ||
    t.includes('in progress') ||
    t.includes('watch') ||
    t.includes('warning')
  ) {
    return 'warning';
  }
  if (
    t.includes('failed') ||
    t.includes('critical') ||
    t.includes('high risk') ||
    t.includes('invalid') ||
    t.includes('alert') ||
    t.includes('poor') ||
    t.includes('danger')
  ) {
    return 'danger';
  }
  return 'neutral';
}

// ─────────────────────────────────────────────────────────────────────────────
// Universal Status Badge Component
// Specification: Height 22-24px, px 8px, radius 6px, font 11-12px, weight 500-600
// ─────────────────────────────────────────────────────────────────────────────

export interface StatusBadgeProps {
  children: React.ReactNode;
  category?: BadgeCategory;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'green' | 'orange' | 'gray' | 'blue' | 'purple';
  className?: string;
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  category,
  variant,
  className = '',
  dot = false,
}) => {
  const resolvedCategory: BadgeCategory = category || (
    variant === 'green'
      ? 'success'
      : variant === 'orange'
      ? 'warning'
      : variant === 'danger'
      ? 'danger'
      : variant === 'gray' || variant === 'neutral'
      ? 'neutral'
      : typeof children === 'string'
      ? getBadgeCategory(children)
      : 'neutral'
  );

  const styleMap = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/90 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/90 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/90 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60',
    neutral: 'bg-[#F7F7F8] text-[#676767] border-[#E5E7EB] dark:bg-[#2B2B2B] dark:text-[#A1A1AA] dark:border-[#3A3A3A]',
  }[resolvedCategory];

  const dotColor = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    neutral: 'bg-slate-400',
  }[resolvedCategory];

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-[23px] px-2 rounded-[6px] text-[11.5px] font-semibold font-sans border transition-colors leading-[1.3] select-none ${styleMap} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{children}</span>
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Skill Report Header (Unboxed, Prominent Title 24px, Metadata Badges 11-12px)
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillReportHeaderProps {
  title: string;
  badges?: Array<{ text: string; category?: BadgeCategory; variant?: string }>;
  timestamp?: string;
  stageLabel?: string;
}

export const SkillReportHeader: React.FC<SkillReportHeaderProps> = ({
  title,
  badges = [
    { text: 'Analysis completed', category: 'success' },
    { text: 'Stage 01: Product Intelligence', category: 'neutral' },
  ],
  timestamp,
  stageLabel,
}) => {
  return (
    <div className="space-y-2 mb-6">
      <h1 className="text-[24px] font-bold leading-[1.3] text-[#202123] dark:text-white tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-2 flex-wrap text-[12px] text-[#676767] dark:text-[#A1A1AA]">
        {badges.map((b, i) => (
          <StatusBadge key={i} category={b.category} variant={b.variant as any}>
            {b.text}
          </StatusBadge>
        ))}
        {stageLabel && (
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] font-normal leading-[1.4]">
            {stageLabel}
          </span>
        )}
        {timestamp && (
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] font-normal leading-[1.4] ml-auto">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. MessageRenderer (Conversational Introductory Area with ChatGPT Feedback Bar)
// ─────────────────────────────────────────────────────────────────────────────

export interface MessageRendererProps {
  content: string;
  senderName?: string;
  keyFindings?: string[];
  recommendation?: string;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onSpeak?: () => void;
  hideFeedbackBar?: boolean;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({
  content,
  senderName = 'Assistant',
  keyFindings = [],
  recommendation,
  onCopy,
  onLike,
  onDislike,
  onSpeak,
  hideFeedbackBar = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3.5 font-sans text-[#202123] dark:text-[#ECECEC]">
      {/* Assistant Avatar & Header */}
      <div className="flex items-center gap-2.5 text-[#202123] dark:text-[#ECECEC] mb-2">
        <div className="w-6 h-6 rounded-full bg-[#10A37F] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <span className="text-[15px] font-semibold leading-[1.4]">{senderName}</span>
      </div>

      {/* Main conversational text with 15px font & 1.7 line height */}
      <div className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB] whitespace-pre-wrap">
        {content}
      </div>

      {/* Key findings bullet list (15px font, 1.65 line height, 8px gap) */}
      {keyFindings.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-[15px] font-semibold text-[#202123] dark:text-white leading-[1.5]">
            Key findings
          </h4>
          <ul className="space-y-2 pl-5 list-disc text-[15px] leading-[1.65] text-[#202123] dark:text-[#D1D5DB]">
            {keyFindings.map((f, i) => (
              <li key={i} className="leading-[1.65]">{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* My recommendation */}
      {recommendation && (
        <div className="space-y-1.5 pt-2">
          <h4 className="text-[15px] font-semibold text-[#202123] dark:text-white leading-[1.5]">
            My recommendation
          </h4>
          <p className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB]">
            {recommendation}
          </p>
        </div>
      )}

      {/* Bottom ChatGPT Feedback Controls */}
      {!hideFeedbackBar && (
        <div className="flex items-center gap-2 pt-2 text-[#676767] dark:text-[#A1A1AA]">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] text-[#676767] hover:text-[#202123] dark:hover:text-white transition-colors cursor-pointer"
            title="Copy response"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setLiked(liked === true ? null : true);
              onLike?.();
            }}
            className={`p-1.5 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer ${
              liked === true ? 'text-emerald-600' : 'text-[#676767] hover:text-[#202123] dark:hover:text-white'
            }`}
            title="Good response"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setLiked(liked === false ? null : false);
              onDislike?.();
            }}
            className={`p-1.5 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer ${
              liked === false ? 'text-rose-600' : 'text-[#676767] hover:text-[#202123] dark:hover:text-white'
            }`}
            title="Bad response"
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onSpeak}
            className="p-1.5 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] text-[#676767] hover:text-[#202123] dark:hover:text-white transition-colors cursor-pointer"
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. MarkdownRenderer (Unboxed Structured Report with Heading Hierarchy)
// ─────────────────────────────────────────────────────────────────────────────

export interface ReportSection {
  number?: number;
  title: string;
  content?: string;
  bulletPoints?: string[];
}

export interface MarkdownRendererProps {
  title?: string;
  badges?: Array<{ text: string; variant?: string; category?: BadgeCategory }>;
  sections: ReportSection[];
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  title,
  badges,
  sections,
}) => {
  return (
    <div className="font-sans text-[#202123] dark:text-[#ECECEC] space-y-4">
      {title && (
        <SkillReportHeader title={title} badges={badges} />
      )}

      {/* Numbered Sections flowing naturally without individual card borders */}
      <div className="space-y-6">
        {sections.map((sec, idx) => {
          const sectionNum = sec.number !== undefined ? sec.number : idx + 1;
          return (
            <div key={idx} className="space-y-2">
              <h2 className="text-[20px] font-semibold leading-[1.4] text-[#202123] dark:text-white tracking-tight mt-[28px] mb-[10px]">
                {sectionNum}. {sec.title}
              </h2>

              {sec.content && (
                <p className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
                  {sec.content}
                </p>
              )}

              {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                <ul className="space-y-2 pl-5 list-disc text-[15px] leading-[1.65] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
                  {sec.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx} className="leading-[1.65]">{bp}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. KPIRenderer (Unified KPI Group — Clean Surface, 28px Values, 12px Labels)
// ─────────────────────────────────────────────────────────────────────────────

export interface KPICardItem {
  label: string;
  value: string;
  subValue?: string;
  badge?: string;
  badgeCategory?: BadgeCategory;
}

export interface KPIRendererProps {
  title?: string;
  timeframe?: string;
  statusBadge?: string;
  metrics?: KPICardItem[];
  footnote?: string;
}

export const KPIRenderer: React.FC<KPIRendererProps> = ({
  title = 'Performance Metrics',
  timeframe,
  statusBadge,
  metrics = [],
  footnote,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 sm:p-5 my-6 font-sans text-[#202123] dark:text-[#ECECEC] transition-all">
      {/* Unified Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white leading-[1.4]">
            {title}
          </h3>
          {timeframe && (
            <span className="text-[12px] font-medium uppercase tracking-wider text-[#676767] dark:text-[#A1A1AA] block mt-0.5">
              {timeframe}
            </span>
          )}
        </div>
        {statusBadge && (
          <StatusBadge category="success">
            {statusBadge}
          </StatusBadge>
        )}
      </div>

      {/* Unified Metrics Row / Grid */}
      {isExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 py-2 border-t border-[#E5E7EB] dark:border-[#3A3A3A]">
          {metrics.map((m, i) => (
            <div key={i} className="space-y-1.5">
              <span className="text-[12.5px] font-medium text-[#676767] dark:text-[#A1A1AA] uppercase tracking-wide block leading-[1.4]">
                {m.label}
              </span>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[28px] sm:text-[30px] font-bold font-mono tracking-tight text-[#202123] dark:text-white leading-[1.2]">
                  {m.value}
                </span>
                {m.subValue && (
                  <span className="text-[12px] font-mono text-[#676767] dark:text-[#A1A1AA]">{m.subValue}</span>
                )}
              </div>
              {m.badge && (
                <div className="pt-0.5">
                  <StatusBadge category={m.badgeCategory || 'success'}>
                    {m.badge}
                  </StatusBadge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footnote & Collapse button */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] dark:border-[#3A3A3A] text-[12px] text-[#676767] dark:text-[#A1A1AA]">
        <span>{footnote}</span>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 rounded-md hover:bg-white dark:hover:bg-[#212121] flex items-center justify-center text-[#676767] hover:text-[#202123] dark:hover:text-white transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse metrics' : 'Expand metrics'}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. ProductCardsRenderer (Product Comparison Cards — 15px Text, Clean Margin)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductCardItem {
  id: string;
  name: string;
  sellingPrice: number;
  productCost: number;
  profitMargin: number;
  image?: string;
  badge?: string;
  badgeCategory?: BadgeCategory;
}

export interface ProductCardsRendererProps {
  products?: ProductCardItem[];
}

export const ProductCardsRenderer: React.FC<ProductCardsRendererProps> = ({
  products = [],
}) => {
  if (!products || products.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 font-sans">
      {products.map((p) => (
        <div
          key={p.id}
          className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-4 shadow-2xs space-y-3 flex flex-col justify-between"
        >
          {/* Image */}
          <div className="w-full h-44 rounded-lg overflow-hidden bg-[#F7F7F8] dark:bg-[#2B2B2B] flex items-center justify-center">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <div className="text-[#676767] font-mono text-[13px]">No Image</div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-1">
            <h4 className="text-[15px] font-semibold text-[#202123] dark:text-white leading-[1.4]">{p.name}</h4>
            <div className="text-[20px] font-bold text-emerald-600 font-mono">
              {p.sellingPrice.toLocaleString()} DZD
            </div>
            <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] block">Selling price</span>
          </div>

          {/* Unit Economics Divider */}
          <div className="pt-2.5 border-t border-[#E5E7EB] dark:border-[#3A3A3A] space-y-1.5 text-[13.5px]">
            <div className="flex items-center justify-between text-[#202123] dark:text-[#D1D5DB]">
              <span className="text-[12.5px] text-[#676767] dark:text-[#A1A1AA]">Cost</span>
              <span className="font-mono font-bold">
                {p.productCost.toLocaleString()} DZD
              </span>
            </div>
            <div className="flex items-center justify-between text-[#202123] dark:text-[#D1D5DB]">
              <span className="text-[12.5px] text-[#676767] dark:text-[#A1A1AA]">Margin</span>
              <span className="font-mono font-bold text-emerald-600">
                {p.profitMargin}%
              </span>
            </div>
          </div>

          {/* Status Badge */}
          {p.badge && (
            <div className="pt-1">
              <StatusBadge category={p.badgeCategory || 'success'}>
                {p.badge}
              </StatusBadge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. TableRenderer (14px Body Text, 13px Header, Sorting, Search, CSV Export)
// ─────────────────────────────────────────────────────────────────────────────

export interface TableRendererProps {
  title?: string;
  columns?: string[];
  rows?: Array<{ criteria: string; [key: string]: string }>;
  bestOpportunity?: string;
}

export const TableRenderer: React.FC<TableRendererProps> = ({
  title = 'Product Opportunity Comparison',
  columns = ['Criteria', 'Product A', 'Product B', 'Product C'],
  rows = [
    { criteria: 'Demand', 'Product A': 'High', 'Product B': 'Medium', 'Product C': 'High' },
    { criteria: 'Competition', 'Product A': 'Medium', 'Product B': 'High', 'Product C': 'Low' },
    { criteria: 'Margin', 'Product A': '65%', 'Product B': '40%', 'Product C': '55%' },
    { criteria: 'Shipping', 'Product A': 'Easy', 'Product B': 'Medium', 'Product C': 'Easy' },
    { criteria: 'Risk', 'Product A': 'Low', 'Product B': 'High', 'Product C': 'Medium' },
    { criteria: 'Overall', 'Product A': 'Strong', 'Product B': 'Weak', 'Product C': 'Strong' },
  ],
  bestOpportunity = 'Product A',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredRows = useMemo(() => {
    let list = [...rows];
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((r) =>
        Object.values(r).some((val) => String(val).toLowerCase().includes(q))
      );
    }
    if (sortCol) {
      list.sort((a, b) => {
        const valA = String(a[sortCol] || '').toLowerCase();
        const valB = String(b[sortCol] || '').toLowerCase();
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return list;
  }, [rows, searchTerm, sortCol, sortDir]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [columns.join(','), ...rows.map((r) => columns.map((c) => `"${r[c] || ''}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-4 sm:p-5 my-6 font-sans text-[#202123] dark:text-[#ECECEC] space-y-3">
      {/* Table Header Row with Search and Export */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#676767] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 text-[12.5px] rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] text-[#202123] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 sm:w-48"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#2B2B2B] hover:bg-[#F7F7F8] text-[12px] font-semibold text-[#202123] dark:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Table Element: 14px body text, 12.5px header, 12-14px padding */}
      <div className="overflow-x-auto w-full max-w-full rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] custom-scrollbar">
        <table className={`w-full text-left border-collapse ${columns.length >= 4 ? 'min-w-[700px]' : 'min-w-full'}`}>
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B]">
              {columns.map((c, i) => (
                <th
                  key={i}
                  onClick={() => {
                    if (sortCol === c) {
                      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortCol(c);
                      setSortDir('asc');
                    }
                  }}
                  className={`py-3 px-3.5 text-[12.5px] font-semibold uppercase tracking-wider text-[#202123] dark:text-white cursor-pointer select-none whitespace-nowrap ${
                    i === 0 ? 'min-w-[130px]' : 'min-w-[150px]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{c}</span>
                    {sortCol === c && (
                      <span className="text-emerald-600 font-bold">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]/70 dark:divide-[#3A3A3A]/70">
            {filteredRows.map((r, ri) => (
              <tr key={ri} className="hover:bg-[#F7F7F8]/60 dark:hover:bg-[#2B2B2B]/60 transition-colors">
                <td className="py-3 px-3.5 text-[13.5px] sm:text-[14px] font-semibold text-[#202123] dark:text-white align-top min-w-[130px]">
                  <EnrichedMarkdownText text={String(r.criteria ?? '')} />
                </td>
                {columns.slice(1).map((colName, ci) => {
                  const val = r[colName] || '—';
                  const isHighOrStrong = val === 'High' || val === 'Strong' || String(val).includes('%');
                  return (
                    <td key={ci} className="py-3 px-3.5 text-[13.5px] sm:text-[14px] text-[#202123] dark:text-[#D1D5DB] align-top min-w-[150px]">
                      {isHighOrStrong ? (
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                          {val}
                        </span>
                      ) : (
                        <EnrichedMarkdownText text={String(val)} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Best Opportunity Footer */}
      {bestOpportunity && (
        <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#3A3A3A] flex items-center justify-between text-[13.5px]">
          <span className="font-semibold text-[#202123] dark:text-white">Best opportunity</span>
          <StatusBadge category="success">
            {bestOpportunity}
          </StatusBadge>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. ChartRenderer (Min Height 260px, Clean Axis Labels, Bar & Line Charts)
// ─────────────────────────────────────────────────────────────────────────────

export interface ChartRendererProps {
  barTitle?: string;
  barSubtitle?: string;
  barData?: Array<{ day: string; value: number }>;
  lineTitle?: string;
  lineSubtitle?: string;
  lineData?: Array<{ day: string; value: number }>;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  barTitle = 'Daily Spend',
  barSubtitle,
  barData,
  lineTitle = 'Daily Trend',
  lineSubtitle,
  lineData,
}) => {
  const safeBars = barData || [];
  const safeLines = lineData || [];
  if (safeBars.length === 0 && safeLines.length === 0) {
    return null;
  }
  const maxBar = Math.max(2800, ...safeBars.map((b) => b.value));
  const maxLine = Math.max(15, ...safeLines.map((l) => l.value));

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-5 my-6 space-y-6 font-sans text-[#202123] dark:text-[#ECECEC]">
      {/* 1. Bar Chart */}
      <div className="space-y-3">
        <div>
          <h4 className="text-[15px] font-semibold text-[#202123] dark:text-white">{barTitle}</h4>
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] block">{barSubtitle}</span>
        </div>

        <div className="relative pt-6 pb-2 min-h-[200px]">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pointer-events-none pb-6">
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">2.8K DZD</div>
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">2.1K DZD</div>
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">1.4K DZD</div>
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">700 DZD</div>
            <div className="border-b border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">0 DZD</div>
          </div>

          {/* Bars */}
          <div className="relative h-44 flex items-end justify-between pl-16 pr-4 z-10">
            {safeBars.map((b, i) => {
              const heightPct = Math.round((b.value / maxBar) * 100);
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1 max-w-[48px]">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all cursor-pointer shadow-2xs"
                    title={`${b.day}: ${b.value} DZD`}
                  />
                  <span className="text-[12px] text-[#202123] dark:text-[#D1D5DB] font-medium">{b.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-[#E5E7EB] dark:border-[#3A3A3A]" />

      {/* 2. Line Chart */}
      <div className="space-y-3">
        <div>
          <h4 className="text-[15px] font-semibold text-[#202123] dark:text-white">{lineTitle}</h4>
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] block">{lineSubtitle}</span>
        </div>

        <div className="relative pt-6 pb-2 min-h-[200px]">
          {/* Y-axis grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pointer-events-none pb-6">
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">15</div>
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">12</div>
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">9</div>
            <div className="border-b border-dashed border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">6</div>
            <div className="border-b border-[#E5E7EB] dark:border-[#3A3A3A] pb-0.5">3</div>
          </div>

          {/* SVG Line */}
          <div className="relative h-44 pl-12 pr-4 z-10 flex flex-col justify-between">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 350 140">
              {(() => {
                const points = safeLines.map((d, idx) => {
                  const x = 20 + idx * 50;
                  const y = 130 - (d.value / maxLine) * 120;
                  return `${x},${y}`;
                }).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      points={points}
                      strokeLinecap="round"
                    />
                    {safeLines.map((d, idx) => {
                      const cx = 20 + idx * 50;
                      const cy = 130 - (d.value / maxLine) * 120;
                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r="4"
                          fill="#3B82F6"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="hover:scale-125 transition-transform cursor-pointer"
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
            <div className="flex justify-between pl-3 pr-2 text-[12px] text-[#202123] dark:text-[#D1D5DB] font-medium">
              {safeLines.map((d, i) => (
                <span key={i}>{d.day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. FlowchartRenderer (Connected Nodes, 14px Text, Decision Point Box)
// ─────────────────────────────────────────────────────────────────────────────

export interface FlowchartStepItem {
  id: string;
  title: string;
  subtitle?: string;
  isDecision?: boolean;
  decisionLabel?: string;
  branches?: Array<{ label: string; text: string; category?: BadgeCategory }>;
}

export interface FlowchartRendererProps {
  title?: string;
  steps?: FlowchartStepItem[];
}

export const FlowchartRenderer: React.FC<FlowchartRendererProps> = ({
  title = 'Workflow Execution Flow',
  steps = [],
}) => {
  if (!steps || steps.length < 2) return null;
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-6 my-6 font-sans text-[#202123] dark:text-[#ECECEC] space-y-4">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="flex flex-col items-center space-y-3 py-3">
        {steps.map((st, idx) => (
          <React.Fragment key={st.id}>
            {st.isDecision ? (
              <div className="w-full max-w-md rounded-xl border-2 border-emerald-500 bg-white dark:bg-[#2B2B2B] p-4 text-center shadow-xs space-y-1.5">
                <span className="text-[14px] font-bold tracking-wide text-[#202123] dark:text-white block font-mono">
                  {st.title}
                </span>
                {st.decisionLabel && (
                  <StatusBadge category="success">
                    {st.decisionLabel}
                  </StatusBadge>
                )}
              </div>
            ) : (
              <div className="text-center space-y-0.5">
                <span className="text-[14px] font-bold tracking-wider text-[#202123] dark:text-white block font-mono">
                  {st.title}
                </span>
                {st.subtitle && (
                  <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] block">{st.subtitle}</span>
                )}
              </div>
            )}

            {/* Connecting arrow */}
            {idx < steps.length - 1 && (
              <div className="text-[#676767] dark:text-[#A1A1AA] font-bold select-none text-[14px]">↓</div>
            )}

            {/* Branches if decision point */}
            {st.branches && (
              <div className="w-full max-w-md grid grid-cols-2 gap-4 pt-2">
                {st.branches.map((b, bi) => (
                  <div key={bi} className="flex flex-col items-center space-y-1.5 text-center">
                    <StatusBadge category={b.category || 'success'}>
                      {b.label}
                    </StatusBadge>
                    <span className="text-[13.5px] font-semibold text-[#202123] dark:text-white">{b.text}</span>
                  </div>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. DecisionTreeRenderer (Conditional Decision Tree with YES/NO branches)
// ─────────────────────────────────────────────────────────────────────────────

export interface DecisionTreeProps {
  title?: string;
  question?: string;
  yesBranch?: { check: string; action: string };
  noBranch?: { check: string; action: string };
}

export const DecisionTreeRenderer: React.FC<DecisionTreeProps> = ({
  title = 'Decision Tree & Logic Branching',
  question,
  yesBranch,
  noBranch,
}) => {
  if (!question || !yesBranch || !noBranch) return null;
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-6 my-6 font-sans text-[#202123] dark:text-[#ECECEC] space-y-4">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="flex flex-col items-center space-y-3 py-2">
        <span className="text-[15px] font-semibold text-[#202123] dark:text-white text-center font-mono">
          {question}
        </span>

        <div className="w-full max-w-lg grid grid-cols-2 gap-6 pt-2">
          {/* YES BRANCH */}
          <div className="flex flex-col items-center space-y-2">
            <StatusBadge category="success">YES</StatusBadge>
            <span className="text-[13px] text-[#676767] dark:text-[#A1A1AA]">↓</span>
            <div className="w-full rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-3 text-center text-[13.5px] font-semibold text-[#202123] dark:text-white shadow-2xs">
              {yesBranch.check}
            </div>
            <span className="text-[13px] text-[#676767] dark:text-[#A1A1AA]">↓</span>
            <span className="text-[14px] font-bold text-emerald-600">{yesBranch.action}</span>
          </div>

          {/* NO BRANCH */}
          <div className="flex flex-col items-center space-y-2">
            <StatusBadge category="danger">NO</StatusBadge>
            <span className="text-[13px] text-[#676767] dark:text-[#A1A1AA]">↓</span>
            <div className="w-full rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-3 text-center text-[13.5px] font-semibold text-[#202123] dark:text-white shadow-2xs">
              {noBranch.check}
            </div>
            <span className="text-[13px] text-[#676767] dark:text-[#A1A1AA]">↓</span>
            <span className="text-[14px] font-bold text-rose-600">{noBranch.action}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. FunnelRenderer (E-Commerce Conversion Funnel with Progress Bars)
// ─────────────────────────────────────────────────────────────────────────────

export interface FunnelStageItem {
  stage: string;
  volume: number;
  highlight?: boolean;
}

export interface FunnelRendererProps {
  title?: string;
  stages?: FunnelStageItem[];
  highlightBadge?: string;
}

export const FunnelRenderer: React.FC<FunnelRendererProps> = ({
  title = 'Conversion Funnel',
  stages = [],
  highlightBadge,
}) => {
  if (!stages || stages.length === 0) return null;
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="space-y-3 pt-1">
        {stages.map((st, i) => {
          const widthPct = i === 0 ? 100 : Math.max(14, Math.round(100 - i * 14));
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="font-medium text-[#202123] dark:text-[#D1D5DB]">{st.stage}</span>
                <span className="font-mono font-bold text-[#202123] dark:text-white">
                  {st.volume.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F7F7F8] dark:bg-[#2B2B2B] overflow-hidden">
                <div
                  style={{ width: `${widthPct}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${
                    st.highlight ? 'bg-emerald-500' : 'bg-slate-600 dark:bg-slate-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {highlightBadge && (
        <div className="pt-2">
          <StatusBadge category="success">
            {highlightBadge}
          </StatusBadge>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. ChecklistRenderer (Interactive Checklist — 15px Text, Circular Checks)
// ─────────────────────────────────────────────────────────────────────────────

export interface ChecklistRendererProps {
  title?: string;
  items?: string[];
  initialCheckedIndices?: number[];
}

export const ChecklistRenderer: React.FC<ChecklistRendererProps> = ({
  title = 'Action Checklist',
  items = [],
  initialCheckedIndices = [],
}) => {
  const [checked, setChecked] = useState<Set<number>>(new Set(initialCheckedIndices));

  if (!items || items.length === 0) return null;

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const progressPct = Math.round((checked.size / items.length) * 100);

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-3 font-sans text-[#202123] dark:text-[#ECECEC]">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>
        <StatusBadge category={checked.size === items.length ? 'success' : 'neutral'}>
          {checked.size}/{items.length} completed
        </StatusBadge>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-[#F7F7F8] dark:bg-[#2B2B2B] overflow-hidden">
        <div
          style={{ width: `${progressPct}%` }}
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
        />
      </div>

      {/* List items: 15px font, 1.65 line height, 8px gap */}
      <div className="space-y-2 pt-1">
        {items.map((it, idx) => {
          const isDone = checked.has(idx);
          return (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer select-none"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isDone
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-[#E5E7EB] dark:border-[#3A3A3A]'
                }`}
              >
                {isDone && <Check className="w-3 h-3 text-white" />}
              </div>
              <span
                className={`text-[15px] leading-[1.65] ${
                  isDone ? 'line-through text-[#676767] dark:text-[#A1A1AA]' : 'text-[#202123] dark:text-white'
                }`}
              >
                {it}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. TimelineRenderer (Connected Vertical Timeline with Status Badges)
// ─────────────────────────────────────────────────────────────────────────────

export interface MilestoneItem {
  day: string;
  title: string;
  description: string;
  status: 'Completed' | 'In progress' | 'Pending';
}

export interface TimelineRendererProps {
  title?: string;
  milestones?: MilestoneItem[];
}

export const TimelineRenderer: React.FC<TimelineRendererProps> = ({
  title = 'Timeline & Milestones',
  milestones = [],
}) => {
  if (!milestones || milestones.length === 0) return null;
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="relative pl-6 space-y-4 border-l border-[#E5E7EB] dark:border-[#3A3A3A] ml-2">
        {milestones.map((m, idx) => (
          <div key={idx} className="relative space-y-1">
            <div className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#3A3A3A] text-[10px] font-mono font-bold text-[#676767] dark:text-[#A1A1AA] flex items-center justify-center">
              {idx + 1}
            </div>

            <span className="text-[15px] font-semibold text-[#202123] dark:text-white block leading-tight">
              {m.day}
            </span>
            <p className="text-[13.5px] text-[#676767] dark:text-[#A1A1AA] leading-normal">
              {m.description}
            </p>
            <div className="pt-0.5">
              <StatusBadge
                category={
                  m.status === 'Completed'
                    ? 'success'
                    : m.status === 'In progress'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {m.status}
              </StatusBadge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. RiskMatrixRenderer (2x2 Priority and Risk Matrix)
// ─────────────────────────────────────────────────────────────────────────────

export interface RiskMatrixItem {
  priority: 'High priority' | 'Medium priority' | 'Low priority';
  title: string;
  description: string;
}

export interface RiskMatrixRendererProps {
  title?: string;
  items?: RiskMatrixItem[];
}

export const RiskMatrixRenderer: React.FC<RiskMatrixRendererProps> = ({
  title = 'Priority & Risk Assessment',
  items = [],
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-3 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {items.map((it, i) => (
          <div key={i} className="space-y-1 p-3 rounded-lg bg-[#F7F7F8] dark:bg-[#2B2B2B]">
            <StatusBadge
              category={
                it.priority.includes('High')
                  ? 'danger'
                  : it.priority.includes('Medium')
                  ? 'warning'
                  : 'success'
              }
            >
              {it.priority}
            </StatusBadge>
            <h4 className="text-[14px] font-semibold text-[#202123] dark:text-white pt-1">{it.title}</h4>
            <p className="text-[13px] text-[#676767] dark:text-[#A1A1AA] leading-normal">{it.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. CodeRenderer (Syntax-Highlighted Code Panel with 13px Font & Language Badge)
// ─────────────────────────────────────────────────────────────────────────────

export interface CodeRendererProps {
  title?: string;
  subtitle?: string;
  language?: string;
  code?: string;
  badge?: string;
}

export const CodeRenderer: React.FC<CodeRendererProps> = ({
  title = 'Code Snippet',
  subtitle,
  language = 'HTML',
  code = '',
  badge = 'Generated',
}) => {
  const [copied, setCopied] = useState(false);

  if (!code || !code.trim()) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#1E1E1E] text-white p-4 my-6 space-y-3 font-sans">
      <div className="flex items-center justify-between text-white">
        <div>
          <h3 className="text-[15px] font-semibold">{title}</h3>
          {subtitle && <span className="text-[12px] text-neutral-400 block">{subtitle}</span>}
        </div>
        <StatusBadge category="neutral">
          {language}
        </StatusBadge>
      </div>

      <div className="rounded-lg bg-[#141414] border border-white/10 p-4 space-y-2">
        <div className="flex items-center justify-between text-neutral-400 pb-1 border-b border-white/10 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 font-bold text-neutral-300">
            <span>&lt;/&gt;</span>
            <span>{language}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="hover:text-white transition-colors cursor-pointer"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              className="hover:text-white transition-colors cursor-pointer"
              title="Run / Preview"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <pre className="font-mono text-[13px] text-emerald-400 whitespace-pre overflow-x-auto leading-[1.6] select-text py-1">
          {code}
        </pre>
      </div>

      <div className="flex items-center justify-between pt-1 text-[12px] text-neutral-400">
        <span>Editable code • Copy • Expand</span>
        <StatusBadge category="success">
          {badge}
        </StatusBadge>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 14. LandingPagePreview (Interactive Landing Page View)
// ─────────────────────────────────────────────────────────────────────────────

export interface LandingPagePreviewProps {
  productName?: string;
  price?: number;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({
  productName = 'Algerian Winning Product',
  price = 2500,
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-3 font-sans text-[#202123] dark:text-[#ECECEC]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">Landing Page Preview</h3>
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA]">CRO Optimized Mobile First Layout</span>
        </div>
        <div className="flex items-center gap-1 bg-[#F7F7F8] dark:bg-[#2B2B2B] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-2 py-0.5 rounded text-[11.5px] font-medium transition-colors cursor-pointer ${
              device === 'mobile' ? 'bg-white dark:bg-[#212121] text-emerald-700 shadow-2xs' : 'text-[#676767]'
            }`}
          >
            Mobile (390px)
          </button>
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-2 py-0.5 rounded text-[11.5px] font-medium transition-colors cursor-pointer ${
              device === 'desktop' ? 'bg-white dark:bg-[#212121] text-emerald-700 shadow-2xs' : 'text-[#676767]'
            }`}
          >
            Desktop
          </button>
        </div>
      </div>

      <div className="flex justify-center p-4 bg-[#F7F7F8] dark:bg-[#2B2B2B] rounded-xl overflow-hidden">
        <div
          className={`border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#1A1A1A] rounded-xl shadow-md p-4 transition-all space-y-3 ${
            device === 'mobile' ? 'w-[360px]' : 'w-full max-w-2xl'
          }`}
        >
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              🔥 LIVRAISON GRATUITE SUR 58 WILAYAS
            </span>
            <h4 className="text-[17px] font-bold text-[#202123] dark:text-white leading-tight">
              {productName}
            </h4>
            <div className="text-[20px] font-extrabold text-emerald-600 font-mono">
              {price.toLocaleString()} DZD
            </div>
          </div>

          <div className="h-40 bg-[#F7F7F8] dark:bg-[#2B2B2B] rounded-lg flex items-center justify-center text-[#676767] text-[13px]">
            Product Hero Image Preview
          </div>

          <div className="space-y-1.5 text-[13px] text-[#202123] dark:text-[#D1D5DB]">
            <p>✅ الدفع عند الاستلام مع فتح الطرد قبل الدفع</p>
            <p>✅ ضمان استبدال حقيقي لمدة 7 أيام</p>
            <p>✅ جودة أصلية ممتازة مع ملحقات كاملة</p>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-emerald-600 text-white font-bold text-[14px] hover:bg-emerald-700 transition-colors shadow-xs"
          >
            اضغط هنا للطلب والدفع عند الاستلام
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 15. ArtifactRenderer (Deliverables & Downloadable Files)
// ─────────────────────────────────────────────────────────────────────────────

export interface ArtifactDeliverable {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  content?: string;
  description?: string;
}

export const ArtifactRenderer: React.FC<{ artifacts: ArtifactDeliverable[] }> = ({ artifacts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (art: ArtifactDeliverable) => {
    navigator.clipboard.writeText(art.content || '');
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (art: ArtifactDeliverable) => {
    const filename = art.name || `${art.id}.txt`;
    const blob = new Blob([art.content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-3 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">Artifacts & Deliverables</h3>

      <div className="space-y-2.5">
        {artifacts.map((art) => (
          <div
            key={art.id}
            className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B]"
          >
            <div className="space-y-0.5">
              <span className="text-[13.5px] font-semibold text-[#202123] dark:text-white block">
                {art.title || art.name}
              </span>
              {art.description && (
                <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] block">{art.description}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(art)}
                className="px-2.5 py-1 rounded-md border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] text-[12px] font-semibold text-[#202123] dark:text-white hover:bg-[#F7F7F8] transition-colors"
              >
                {copiedId === art.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => handleDownload(art)}
                className="px-2.5 py-1 rounded-md border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] text-[12px] font-semibold text-[#202123] dark:text-white hover:bg-[#F7F7F8] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Other Support Renderers
// ─────────────────────────────────────────────────────────────────────────────

export const SectionRenderer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>{children}</div>
);

export const CitationRenderer: React.FC<{ citations?: string[] }> = ({ citations = [] }) => {
  if (citations.length === 0) return null;
  return (
    <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#3A3A3A] text-[12px] text-[#676767] dark:text-[#A1A1AA] space-y-1">
      <span className="font-semibold block text-[#202123] dark:text-white">References & Footnotes:</span>
      <ul className="list-decimal pl-4 space-y-0.5">
        {citations.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export const RecommendationRenderer: React.FC<{
  recommendation: string;
  priority?: string;
  impact?: string;
  nextAction?: string;
}> = ({ recommendation, priority = 'P1 High', impact, nextAction }) => (
  <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-4 my-4 space-y-2">
    <div className="flex items-center justify-between">
      <StatusBadge category={priority.includes('P1') ? 'danger' : 'warning'}>{priority}</StatusBadge>
      {impact && <span className="text-[12px] font-semibold text-emerald-600 font-mono">Impact: {impact}</span>}
    </div>
    <h4 className="text-[15px] font-semibold text-[#202123] dark:text-white">{recommendation}</h4>
    {nextAction && (
      <div className="text-[13px] text-[#676767] dark:text-[#A1A1AA]">
        <span className="font-medium">Action: </span>{nextAction}
      </div>
    )}
  </div>
);

export const SplitViewRenderer: React.FC<{ leftPane: React.ReactNode; rightPane: React.ReactNode }> = ({
  leftPane,
  rightPane,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
    <div className="space-y-4">{leftPane}</div>
    <div className="space-y-4">{rightPane}</div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Ref 14. CreativeConceptsGallery (Image Gallery & Creative Concepts)
// ─────────────────────────────────────────────────────────────────────────────

export interface CreativeConceptItem {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  tag?: string;
}

export const CreativeConceptsGallery: React.FC<{
  title?: string;
  concepts?: CreativeConceptItem[];
}> = ({
  title = 'Advertising creative concepts',
  concepts = [
    {
      id: 'c1',
      title: 'Concept A — Premium',
      subtitle: 'Luxury product positioning',
      image: 'https://images.unsplash.com/photo-1580481077195-c3a9927b74b7?w=400&h=400&fit=crop',
    },
    {
      id: 'c2',
      title: 'Concept B — Minimal',
      subtitle: 'Simple product demonstration',
      image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&h=400&fit=crop',
    },
    {
      id: 'c3',
      title: 'Concept C — Lifestyle',
      subtitle: 'Show real-world use',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    },
    {
      id: 'c4',
      title: 'Concept D — Features',
      subtitle: 'Highlight product benefits',
      image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=400&h=400&fit=crop',
    },
  ],
}) => {
  if (!concepts || concepts.length === 0) return null;
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {concepts.map((c) => (
          <div
            key={c.id}
            className="rounded-lg overflow-hidden border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] group hover:shadow-xs transition-shadow"
          >
            <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
              {c.image ? (
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#676767] text-xs font-mono">
                  No preview available
                </div>
              )}
            </div>
            <div className="p-3 space-y-0.5">
              <h4 className="text-[13.5px] font-semibold text-[#202123] dark:text-white leading-tight">
                {c.title}
              </h4>
              <p className="text-[12px] text-[#676767] dark:text-[#A1A1AA] leading-normal">
                {c.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 14 · Image galleries and creative previews
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 15. ResearchCitationsCard (Research Findings with Source Cards)
// ─────────────────────────────────────────────────────────────────────────────

export interface ResearchCitationSource {
  name: string;
  description: string;
  sourceText?: string;
  refLabel: string;
}

export const ResearchCitationsCard: React.FC<{
  title?: string;
  sources?: ResearchCitationSource[];
  conclusion?: string;
}> = ({
  title = 'Competitor research',
  sources = [
    {
      name: 'Competitor A',
      description: 'Pricing and positioning analysis',
      sourceText: 'Source: Example research source',
      refLabel: 'Reference 1',
    },
    {
      name: 'Competitor B',
      description: 'Offer and product differentiation',
      sourceText: 'Source: Example research source',
      refLabel: 'Reference 2',
    },
  ],
  conclusion = 'Compare actual prices, delivery conditions and customer reviews before deciding which competitor is the strongest benchmark.',
}) => {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <div className="space-y-1">
        <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>
        <div className="flex items-center gap-1.5 text-[12.5px] text-[#676767] dark:text-[#A1A1AA]">
          <Globe className="w-3.5 h-3.5 text-blue-500" />
          <span>Market research sources</span>
        </div>
      </div>

      <div className="space-y-3">
        {sources.map((s, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-semibold text-[#202123] dark:text-white">{s.name}</span>
              <span className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#3A3A3A] text-slate-700 dark:text-slate-300">
                {s.refLabel}
              </span>
            </div>
            <p className="text-[13px] text-[#202123] dark:text-[#D1D5DB] leading-normal">{s.description}</p>
            {s.sourceText && (
              <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA] block">{s.sourceText}</span>
            )}
          </div>
        ))}
      </div>

      {conclusion && (
        <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#3A3A3A] space-y-1 text-[13px]">
          <span className="font-semibold text-[#202123] dark:text-white block">Conclusion</span>
          <p className="text-[#676767] dark:text-[#A1A1AA] leading-relaxed">{conclusion}</p>
        </div>
      )}

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 15 · Research citations and source cards
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 16. ExpandableAnalysisSections (Collapsible Accordion Analysis)
// ─────────────────────────────────────────────────────────────────────────────

export interface ExpandableSectionItem {
  id: string;
  title: string;
  summary: string;
  badge?: string;
  badgeCategory?: BadgeCategory;
  details?: React.ReactNode;
}

export const ExpandableAnalysisSections: React.FC<{
  title?: string;
  sections?: ExpandableSectionItem[];
}> = ({
  title = 'Detailed product evaluation',
  sections = [
    {
      id: 's1',
      title: 'Audience analysis',
      summary: 'Primary audience: men aged 20–45 interested in personal grooming. Expand to inspect demographics, buying motivations and objections.',
      badge: 'Strong',
      badgeCategory: 'success',
      details: 'Demographic breakdown: Urban professionals, self-groomers, gift buyers. Main objection: Quality guarantee and battery longevity.',
    },
    {
      id: 's2',
      title: 'Pricing analysis',
      summary: 'Potential selling price: 2,500 DZD. Estimated product cost: 850 DZD. Margin profile remains optimal for direct Meta traffic.',
      badge: 'Promising',
      badgeCategory: 'success',
      details: 'Break-even CPA is approximately 650 DZD. Suggested introductory test bundle at 3,500 DZD with extra replacement heads.',
    },
    {
      id: 's3',
      title: 'Competition analysis',
      summary: 'Further competitor validation is required across major national delivery channels.',
      badge: 'Review needed',
      badgeCategory: 'warning',
      details: 'Top 3 competitors on Facebook are retailing basic trimmers at 1,800–2,200 DZD with standard plastic heads.',
    },
  ],
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!sections || sections.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="space-y-3">
        {sections.map((sec) => {
          const isExp = expandedId === sec.id;
          return (
            <div
              key={sec.id}
              className="rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExp ? null : sec.id)}
                className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-slate-100/60 dark:hover:bg-[#333333]/60 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[14px] font-semibold text-[#202123] dark:text-white">
                      {sec.title}
                    </h4>
                  </div>
                  <p className="text-[12.5px] text-[#676767] dark:text-[#A1A1AA] leading-normal">
                    {sec.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  {sec.badge && (
                    <StatusBadge category={sec.badgeCategory || 'success'}>
                      {sec.badge}
                    </StatusBadge>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 text-[#676767] transition-transform duration-200 ${
                      isExp ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {isExp && sec.details && (
                <div className="px-3.5 pb-3.5 pt-1 text-[13px] text-[#202123] dark:text-[#D1D5DB] border-t border-[#E5E7EB] dark:border-[#3A3A3A] bg-white/70 dark:bg-[#212121]/70 leading-relaxed animate-in fade-in">
                  {sec.details}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 16 · Expandable sections / accordions
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 17. ActionableRecommendationsCard (Actionable AI Recommendations)
// ─────────────────────────────────────────────────────────────────────────────

export interface ActionableRecommendationItem {
  id: string;
  number?: number;
  title: string;
  description: string;
  priority: 'High priority' | 'Medium' | 'Low' | string;
  expectedImpact: string;
  actionLabel?: string;
}

export const ActionableRecommendationsCard: React.FC<{
  title?: string;
  items?: ActionableRecommendationItem[];
}> = ({
  title = 'AI optimization recommendations',
  items = [
    {
      id: 'r1',
      number: 1,
      title: 'Improve creative hook',
      description: 'Replace generic product introductions with a problem-solving opening.',
      priority: 'High priority',
      expectedImpact: 'Better initial attention',
      actionLabel: 'Recommended action',
    },
    {
      id: 'r2',
      number: 2,
      title: 'Improve offer presentation',
      description: 'Highlight cash on delivery and delivery conditions.',
      priority: 'Medium',
      expectedImpact: 'Better purchase confidence',
    },
    {
      id: 'r3',
      number: 3,
      title: 'Monitor order quality',
      description: 'Compare confirmed orders with delivered orders.',
      priority: 'Medium',
      expectedImpact: 'Better profitability',
    },
  ],
}) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="space-y-3">
        {items.map((it, idx) => {
          const num = it.number !== undefined ? it.number : idx + 1;
          const isHigh = it.priority.toLowerCase().includes('high');
          return (
            <div
              key={it.id || idx}
              className="rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[14px] font-semibold text-[#202123] dark:text-white">
                  {num}. {it.title}
                </h4>
                <StatusBadge category={isHigh ? 'danger' : 'warning'}>
                  {it.priority}
                </StatusBadge>
              </div>

              <p className="text-[13px] text-[#202123] dark:text-[#D1D5DB] leading-normal">
                {it.description}
              </p>

              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#3A3A3A] flex items-center justify-between gap-2 flex-wrap text-[12px]">
                <span className="text-[#676767] dark:text-[#A1A1AA]">
                  Expected impact: <strong className="text-[#202123] dark:text-white font-medium">{it.expectedImpact}</strong>
                </span>
                {it.actionLabel && (
                  <StatusBadge category="success">
                    {it.actionLabel}
                  </StatusBadge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 17 · Actionable AI recommendations
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 18. MultiStageSkillTracker (Skill Orchestration & Pipeline Progress)
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillExecutionStage {
  step: string;
  title: string;
  status: 'Completed' | 'Running' | 'Waiting';
}

export const MultiStageSkillTracker: React.FC<{
  title?: string;
  progressPercent?: number;
  stages?: SkillExecutionStage[];
}> = ({
  title = 'Full-funnel skill orchestration',
  progressPercent = 60,
  stages = [
    { step: '01', title: 'Product Intelligence', status: 'Completed' },
    { step: '02', title: 'Product Strategy', status: 'Completed' },
    { step: '03', title: 'Creative Strategy', status: 'Completed' },
    { step: '04', title: 'Campaign Setup', status: 'Running' },
    { step: '05', title: 'Traffic Analysis', status: 'Waiting' },
    { step: '06', title: 'Order Quality', status: 'Waiting' },
    { step: '07', title: 'Profit Optimization', status: 'Waiting' },
  ],
}) => {
  if (!stages || stages.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      {/* Progress header & bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11.5px] font-mono text-[#676767] dark:text-[#A1A1AA]">
          <span className="uppercase tracking-wider">EXECUTION PROGRESS</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#F7F7F8] dark:bg-[#2B2B2B] overflow-hidden">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          />
        </div>
      </div>

      {/* Stages list */}
      <div className="divide-y divide-[#E5E7EB]/80 dark:divide-[#3A3A3A]/80 pt-1">
        {stages.map((st, i) => (
          <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-[13px]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11.5px] text-[#676767] dark:text-[#A1A1AA] w-5">
                {st.step}
              </span>
              <span className="font-medium text-[#202123] dark:text-white">
                {st.title}
              </span>
            </div>

            <div>
              <StatusBadge
                category={
                  st.status === 'Completed'
                    ? 'success'
                    : st.status === 'Running'
                    ? 'warning'
                    : 'neutral'
                }
                dot={st.status === 'Running'}
              >
                {st.status}
              </StatusBadge>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 18 · Multi-skill orchestration and execution progress
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 19. InteractiveProfitabilityCalculator (Data Input & Real-Time Calculation)
// ─────────────────────────────────────────────────────────────────────────────

export const InteractiveProfitabilityCalculator: React.FC<{
  title?: string;
  initialSellingPrice?: number;
  initialProductCost?: number;
  initialDeliveryCost?: number;
  currency?: string;
}> = ({
  title = 'Product profitability calculator',
  initialSellingPrice = 2500,
  initialProductCost = 850,
  initialDeliveryCost = 500,
  currency = 'DZD',
}) => {
  const [sellingPrice, setSellingPrice] = useState<number>(initialSellingPrice);
  const [productCost, setProductCost] = useState<number>(initialProductCost);
  const [deliveryCost, setDeliveryCost] = useState<number>(initialDeliveryCost);

  const contribution = sellingPrice - productCost - deliveryCost;
  const contributionMargin = sellingPrice > 0 ? ((contribution / sellingPrice) * 100).toFixed(1) : '0.0';

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      {/* Input Fields */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[12.5px] text-[#676767] dark:text-[#A1A1AA]">
            Selling price ({currency})
          </label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
            className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] text-[14px] font-mono font-medium text-[#202123] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[12.5px] text-[#676767] dark:text-[#A1A1AA]">
            Product cost ({currency})
          </label>
          <input
            type="number"
            value={productCost}
            onChange={(e) => setProductCost(Number(e.target.value) || 0)}
            className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] text-[14px] font-mono font-medium text-[#202123] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[12.5px] text-[#676767] dark:text-[#A1A1AA]">
            Delivery cost ({currency})
          </label>
          <input
            type="number"
            value={deliveryCost}
            onChange={(e) => setDeliveryCost(Number(e.target.value) || 0)}
            className="w-full px-3.5 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] text-[14px] font-mono font-medium text-[#202123] dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Reactive Calculation Results */}
      <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#3A3A3A] space-y-1">
        <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] block">
          Estimated contribution before advertising and other costs
        </span>
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <span className="text-[26px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {contribution.toLocaleString()} {currency}
          </span>
          <div className="text-[13px] text-[#676767] dark:text-[#A1A1AA]">
            Contribution margin: <strong className="text-[#202123] dark:text-white font-mono">{contributionMargin}%</strong>
          </div>
        </div>
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 19 · Interactive tools and calculators
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 20. SkillValidationReport (Validation & Quality Status)
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationCheckItem {
  label: string;
  status: 'Passed' | 'Valid' | 'Incomplete' | 'Needs review' | 'Failed';
}

export const SkillValidationReport: React.FC<{
  title?: string;
  overallStatus?: string;
  checks?: ValidationCheckItem[];
}> = ({
  title = 'Skill validation results',
  overallStatus = 'Passed',
  checks = [
    { label: 'Product information', status: 'Valid' },
    { label: 'Pricing data', status: 'Valid' },
    { label: 'Audience analysis', status: 'Valid' },
    { label: 'Competitor evidence', status: 'Incomplete' },
    { label: 'Profit calculations', status: 'Needs review' },
  ],
}) => {
  if (!checks || checks.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-3 font-sans text-[#202123] dark:text-[#ECECEC]">
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#3A3A3A]">
        <div>
          <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA]">Output validation</span>
        </div>
        <StatusBadge category={overallStatus === 'Passed' ? 'success' : 'warning'}>
          {overallStatus}
        </StatusBadge>
      </div>

      <div className="space-y-2 pt-1">
        {checks.map((chk, i) => (
          <div key={i} className="flex items-center justify-between py-1 text-[13px]">
            <span className="text-[#202123] dark:text-[#D1D5DB]">{chk.label}</span>
            <StatusBadge
              category={
                chk.status === 'Valid' || chk.status === 'Passed'
                  ? 'success'
                  : chk.status === 'Incomplete'
                  ? 'warning'
                  : 'danger'
              }
            >
              {chk.status}
            </StatusBadge>
          </div>
        ))}
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 20 · Validation and execution status
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 21. FormulaPresentationCard (Mathematical & Formula Presentation)
// ─────────────────────────────────────────────────────────────────────────────

export const FormulaPresentationCard: React.FC<{
  title?: string;
  formulaSubtitle?: string;
  formulaEquation?: string;
  variables?: Array<{ symbol: string; name: string }>;
  exampleEquation?: string;
  resultLabel?: string;
  resultValue?: string;
}> = ({
  title = 'E-commerce profit formula',
  formulaSubtitle = 'Contribution before advertising:',
  formulaEquation = 'P = SP - PC - DC',
  variables = [
    { symbol: 'SP', name: 'Selling price' },
    { symbol: 'PC', name: 'Product cost' },
    { symbol: 'DC', name: 'Delivery cost' },
  ],
  exampleEquation = '2500 - 850 - 500 = 1150',
  resultLabel = 'Contribution before advertising',
  resultValue = '1,150 DZD',
}) => {
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>
      <span className="text-[12.5px] text-[#676767] dark:text-[#A1A1AA] block">{formulaSubtitle}</span>

      {/* Formula Box */}
      <div className="py-3 px-4 rounded-lg bg-[#F7F7F8] dark:bg-[#2B2B2B] text-center font-serif text-[18px] sm:text-[20px] font-medium tracking-wide text-[#202123] dark:text-white">
        <em>{formulaEquation}</em>
      </div>

      {/* Variables */}
      <div className="space-y-1.5 text-[13px]">
        <span className="font-semibold text-[#202123] dark:text-white block">Where:</span>
        <ul className="space-y-1 pl-4 list-disc text-[#676767] dark:text-[#A1A1AA]">
          {variables.map((v, i) => (
            <li key={i}>
              <strong className="font-serif italic text-[#202123] dark:text-white">{v.symbol}</strong> = {v.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Example Calculation */}
      <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#3A3A3A] space-y-2">
        <span className="text-[12px] font-semibold text-[#202123] dark:text-white uppercase tracking-wider block">
          Example
        </span>
        <div className="font-mono text-[14px] text-[#202123] dark:text-[#D1D5DB]">
          {exampleEquation}
        </div>
        <div>
          <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA] block">{resultLabel}</span>
          <span className="text-[20px] font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {resultValue}
          </span>
        </div>
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 21 · Formulas and mathematical explanations
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 22. ArtifactDeliverablesCard (Deliverables with File Badges)
// ─────────────────────────────────────────────────────────────────────────────

export interface GeneratedDeliverableItem {
  id: string;
  title: string;
  metaInfo: string;
  fileKind: 'pdf' | 'xlsx' | 'code' | 'doc';
  badgeLabel?: string;
  downloadUrl?: string;
}

export const ArtifactDeliverablesCard: React.FC<{
  title?: string;
  deliverables?: GeneratedDeliverableItem[];
}> = ({
  title = 'Generated deliverables',
  deliverables = [
    {
      id: 'd1',
      title: 'Product Analysis Report',
      metaInfo: 'PDF — 12 pages',
      fileKind: 'pdf',
      badgeLabel: 'Generated',
    },
    {
      id: 'd2',
      title: 'Campaign Performance',
      metaInfo: 'XLSX — 5 worksheets',
      fileKind: 'xlsx',
      badgeLabel: 'Generated',
    },
    {
      id: 'd3',
      title: 'Landing Page Source',
      metaInfo: 'HTML — CSS — JavaScript',
      fileKind: 'code',
      badgeLabel: 'Generated',
    },
  ],
}) => {
  if (!deliverables || deliverables.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-3 font-sans text-[#202123] dark:text-[#ECECEC]">
      <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">{title}</h3>

      <div className="space-y-2.5">
        {deliverables.map((d) => {
          const iconColor =
            d.fileKind === 'pdf'
              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
              : d.fileKind === 'xlsx'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';

          return (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B]"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${iconColor}`}>
                  {d.fileKind === 'pdf' ? (
                    <FileText className="w-4 h-4" />
                  ) : d.fileKind === 'xlsx' ? (
                    <FileSpreadsheet className="w-4 h-4" />
                  ) : (
                    <FileCode className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-[13.5px] font-semibold text-[#202123] dark:text-white leading-tight">
                    {d.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA]">{d.metaInfo}</span>
                    {d.badgeLabel && (
                      <StatusBadge category="success" className="h-[18px] text-[10px] px-1.5">
                        {d.badgeLabel}
                      </StatusBadge>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Downloading ${d.title}...`)}
                className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] flex items-center justify-center text-[#676767] hover:text-[#202123] dark:hover:text-white transition-colors cursor-pointer"
                title="Download deliverable"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 22 · Generated artifacts and file previews
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 23. ProductPageLivePreview (Clean E-Commerce Landing Page View)
// ─────────────────────────────────────────────────────────────────────────────

export const ProductPageLivePreview: React.FC<{
  productName?: string;
  price?: number;
  headline?: string;
  description?: string;
  image?: string;
  currency?: string;
}> = ({
  productName = 'NOSTRIL NOIR',
  price = 2500,
  headline = 'Confidence in every detail.',
  description = 'Precision grooming made simple. Compact, rechargeable and easy to use.',
  image = 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=400&fit=crop',
  currency = 'DZD',
}) => {
  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-3 font-sans text-[#202123] dark:text-[#ECECEC]">
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#3A3A3A]">
        <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white">Landing page preview</h3>
        <StatusBadge category="success">Preview</StatusBadge>
      </div>

      <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F4EE] dark:bg-[#1E1E1E] p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between text-xs font-mono font-bold tracking-wider text-slate-800 dark:text-slate-200">
          <span>{productName.toUpperCase()}</span>
          <span>MENU ≡</span>
        </div>

        {/* Hero image */}
        <div className="w-full h-52 sm:h-64 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
          <img
            src={image}
            alt={productName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1.5">
          <h4 className="text-[18px] sm:text-[20px] font-bold text-slate-900 dark:text-white leading-tight">
            {headline}
          </h4>
          <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-normal">
            {description}
          </p>
          <div className="text-[22px] font-bold font-mono text-slate-900 dark:text-white pt-1">
            {price.toLocaleString()} {currency}
          </div>
        </div>

        <button
          type="button"
          className="w-full py-3 rounded-lg bg-[#202123] text-white font-bold text-[13.5px] uppercase tracking-wider hover:bg-black transition-colors shadow-xs cursor-pointer"
        >
          ORDER NOW
        </button>

        <div className="text-center text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
          Cash on delivery — Express delivery
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA]">
        <span>Desktop / Mobile preview</span>
        <StatusBadge category="neutral">Responsive</StatusBadge>
      </div>
      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA]">
        REFERENCE 23 · Live website and landing page preview
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 25. NextRecommendedSkillCard (Streaming Skill & Pipeline Trigger)
// ─────────────────────────────────────────────────────────────────────────────

export const NextRecommendedSkillCard: React.FC<{
  skillName: string;
  skillDescription?: string;
  onClick?: () => void;
}> = ({
  skillName,
  skillDescription,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 my-4 flex items-center justify-between gap-3 font-sans transition-all hover:border-emerald-300 cursor-pointer group"
    >
      <div className="space-y-0.5">
        <span className="text-[12px] font-medium text-[#676767] dark:text-[#A1A1AA] uppercase tracking-wider block">
          Next recommended skill
        </span>
        <h4 className="text-[15px] font-semibold text-[#202123] dark:text-white group-hover:text-emerald-600 transition-colors">
          {skillName}
        </h4>
        {skillDescription && (
          <p className="text-[12px] text-[#676767] dark:text-[#A1A1AA]">{skillDescription}</p>
        )}
      </div>

      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#3A3A3A] flex items-center justify-center text-[#676767] group-hover:text-emerald-600 group-hover:border-emerald-300 transition-all shrink-0">
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 24. SkillResultWorkspace (Split-Screen Text + Visual Preview Workspace)
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillResultWorkspaceProps {
  skillName?: string;
  categoryLabel?: string;
  statusBadge?: string;
  defaultMode?: 'split' | 'text' | 'preview';
  textAnalysis?: {
    productOverview?: string;
    audience?: string;
    recommendation?: string;
    rawText?: string;
  };
  visualComponents?: {
    marketPotential?: string;
    targetAudience?: string;
    nextAction?: string;
    margin?: string | number;
    metrics?: KPICardItem[];
    customPreview?: React.ReactNode;
  };
  onFullscreen?: () => void;
  onSettings?: () => void;
}

export const SkillResultWorkspace: React.FC<SkillResultWorkspaceProps> = ({
  skillName = 'PRODUCT INTELLIGENCE SKILL',
  statusBadge = 'Completed',
  defaultMode = 'split',
  textAnalysis = {
    productOverview: 'Portable rechargeable grooming device.',
    audience: 'Men aged 20–45.',
    recommendation: 'Test three creative angles before scaling.',
  },
  visualComponents = {
    marketPotential: 'High',
    targetAudience: 'Men 20–45',
    nextAction: 'Creative testing',
  },
  onFullscreen,
  onSettings,
}) => {
  const [mode, setMode] = useState<'split' | 'text' | 'preview'>(defaultMode);

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC] shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#3A3A3A] gap-2 flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-[#202123] dark:text-white leading-tight">
            Skill result workspace
          </h3>
          <span className="text-[11.5px] uppercase tracking-wider font-mono text-[#676767] dark:text-[#A1A1AA] block mt-0.5">
            {skillName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge category="success">{statusBadge}</StatusBadge>
          {onFullscreen && (
            <button
              type="button"
              onClick={onFullscreen}
              className="p-1 rounded text-[#676767] hover:text-[#202123] dark:hover:text-white transition-colors cursor-pointer"
              title="Expand workspace"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3 Main View Toggle Buttons (Exactly like Reference 24!) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1 rounded-xl bg-[#F7F7F8] dark:bg-[#2B2B2B] border border-[#E5E7EB] dark:border-[#3A3A3A]">
        <button
          type="button"
          onClick={() => setMode('split')}
          className={`py-2 px-3 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'split'
              ? 'bg-white dark:bg-[#212121] text-[#202123] dark:text-white shadow-2xs border border-[#E5E7EB] dark:border-[#3A3A3A]'
              : 'text-[#676767] dark:text-[#A1A1AA] hover:text-[#202123] dark:hover:text-white'
          }`}
        >
          <SplitSquareHorizontal className="w-4 h-4" />
          <span>Split view</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('text')}
          className={`py-2 px-3 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'text'
              ? 'bg-white dark:bg-[#212121] text-[#202123] dark:text-white shadow-2xs border border-[#E5E7EB] dark:border-[#3A3A3A]'
              : 'text-[#676767] dark:text-[#A1A1AA] hover:text-[#202123] dark:hover:text-white'
          }`}
        >
          <AlignLeft className="w-4 h-4" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('preview')}
          className={`py-2 px-3 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'preview'
              ? 'bg-white dark:bg-[#212121] text-[#202123] dark:text-white shadow-2xs border border-[#E5E7EB] dark:border-[#3A3A3A]'
              : 'text-[#676767] dark:text-[#A1A1AA] hover:text-[#202123] dark:hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Preview</span>
        </button>
      </div>

      {/* Mode Renderings */}
      {mode === 'split' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* LEFT: TEXT OUTPUT */}
          <div className="rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 space-y-3">
            <div className="pb-1 border-b border-[#E5E7EB] dark:border-[#3A3A3A]">
              <span className="text-[12px] font-bold font-mono uppercase tracking-wider text-[#676767] dark:text-[#A1A1AA] block">
                TEXT OUTPUT
              </span>
              <span className="text-[11px] text-[#676767] dark:text-[#A1A1AA]">Written analysis:</span>
            </div>

            <div className="space-y-2.5 text-[13.5px] leading-relaxed">
              {textAnalysis.productOverview && (
                <div>
                  <h4 className="font-semibold text-[#202123] dark:text-white text-[13.5px]">Product overview</h4>
                  <p className="text-[#676767] dark:text-[#D1D5DB] text-[13px]">{textAnalysis.productOverview}</p>
                </div>
              )}
              {textAnalysis.audience && (
                <div>
                  <h4 className="font-semibold text-[#202123] dark:text-white text-[13.5px]">Audience</h4>
                  <p className="text-[#676767] dark:text-[#D1D5DB] text-[13px]">{textAnalysis.audience}</p>
                </div>
              )}
              {textAnalysis.recommendation && (
                <div>
                  <h4 className="font-semibold text-[#202123] dark:text-white text-[13.5px]">Recommendation</h4>
                  <p className="text-[#676767] dark:text-[#D1D5DB] text-[13px]">{textAnalysis.recommendation}</p>
                </div>
              )}
              {textAnalysis.rawText && !textAnalysis.productOverview && (
                <div className="text-[13px] text-[#202123] dark:text-[#D1D5DB] whitespace-pre-wrap">
                  {textAnalysis.rawText}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: VISUAL OUTPUT */}
          <div className="rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 space-y-3">
            <div className="pb-1 border-b border-[#E5E7EB] dark:border-[#3A3A3A]">
              <span className="text-[12px] font-bold font-mono uppercase tracking-wider text-[#676767] dark:text-[#A1A1AA] block">
                VISUAL OUTPUT
              </span>
              <span className="text-[11px] text-[#676767] dark:text-[#A1A1AA]">Rendered components:</span>
            </div>

            <div className="space-y-3 text-[13.5px]">
              {visualComponents.marketPotential && (
                <div>
                  <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA] block">Market potential</span>
                  <span className="font-bold text-[#202123] dark:text-white text-[14px]">
                    {visualComponents.marketPotential}
                  </span>
                </div>
              )}
              {visualComponents.targetAudience && (
                <div>
                  <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA] block">Target audience</span>
                  <span className="font-bold text-[#202123] dark:text-white text-[14px]">
                    {visualComponents.targetAudience}
                  </span>
                </div>
              )}
              {visualComponents.nextAction && (
                <div>
                  <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA] block">Next action</span>
                  <span className="font-bold text-[#202123] dark:text-white text-[14px]">
                    {visualComponents.nextAction}
                  </span>
                </div>
              )}
              {visualComponents.customPreview}
            </div>
          </div>
        </div>
      ) : mode === 'text' ? (
        <div className="rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 space-y-3">
          <div className="pb-1 border-b border-[#E5E7EB] dark:border-[#3A3A3A]">
            <span className="text-[12px] font-bold font-mono uppercase tracking-wider text-[#676767] dark:text-[#A1A1AA] block">
              TEXT OUTPUT
            </span>
          </div>
          <div className="space-y-2 text-[14px] leading-relaxed text-[#202123] dark:text-[#D1D5DB]">
            {textAnalysis.rawText || (
              <>
                <p><strong>Product overview:</strong> {textAnalysis.productOverview}</p>
                <p><strong>Target audience:</strong> {textAnalysis.audience}</p>
                <p><strong>Strategic recommendation:</strong> {textAnalysis.recommendation}</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 space-y-4">
          <div className="pb-1 border-b border-[#E5E7EB] dark:border-[#3A3A3A]">
            <span className="text-[12px] font-bold font-mono uppercase tracking-wider text-[#676767] dark:text-[#A1A1AA] block">
              VISUAL OUTPUT PREVIEW
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#3A3A3A]">
              <span className="text-[11px] text-[#676767] block">Market Potential</span>
              <span className="text-[16px] font-bold text-emerald-600">{visualComponents.marketPotential || 'High'}</span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#3A3A3A]">
              <span className="text-[11px] text-[#676767] block">Target Audience</span>
              <span className="text-[16px] font-bold text-[#202123] dark:text-white">{visualComponents.targetAudience || 'Men 20–45'}</span>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-[#212121] border border-[#E5E7EB] dark:border-[#3A3A3A]">
              <span className="text-[11px] text-[#676767] block">Next Action</span>
              <span className="text-[16px] font-bold text-indigo-600">{visualComponents.nextAction || 'Creative testing'}</span>
            </div>
          </div>
          {visualComponents.customPreview}
        </div>
      )}

      {/* Footer */}
      <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#3A3A3A] flex items-center justify-between text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA]">
        <span>Illustrative split-screen interface.</span>
        <span>REFERENCE 24 · Split-view workspace</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Ref 25. ChatStyleExecutionCard (Chat-Style Streaming Skill Execution)
// ─────────────────────────────────────────────────────────────────────────────

export interface ChatStyleExecutionProps {
  agentName?: string;
  statusBadge?: string;
  introMessage?: string;
  summaryTitle?: string;
  opportunityBadge?: string;
  summaryText?: string;
  visualAnalysis?: {
    margin?: string | number;
    competition?: string;
  };
  nextSkillName?: string;
  onNextSkillClick?: () => void;
  onCopy?: () => void;
}

export const ChatStyleExecutionCard: React.FC<ChatStyleExecutionProps> = ({
  agentName = 'Product Intelligence Agent',
  statusBadge = 'Completed',
  introMessage = "I've completed the product analysis. Here are the main findings.",
  summaryTitle = 'Product summary',
  opportunityBadge = 'Promising',
  summaryText = 'The product has a clear use case and an identifiable target audience.',
  visualAnalysis = {
    margin: '46%',
    competition: 'Medium',
  },
  nextSkillName = 'Product Strategy',
  onNextSkillClick,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  return (
    <div className="rounded-xl border border-[#E5E7EB] dark:border-[#3A3A3A] bg-white dark:bg-[#212121] p-5 my-6 space-y-4 font-sans text-[#202123] dark:text-[#ECECEC] shadow-2xs">
      {/* Agent header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] dark:border-[#3A3A3A]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] flex items-center justify-center text-[10px] text-[#676767]">
            □
          </div>
          <span className="text-[14px] font-semibold text-[#202123] dark:text-white">
            {agentName}
          </span>
        </div>
        <StatusBadge category="success">{statusBadge}</StatusBadge>
      </div>

      {/* Intro message */}
      <p className="text-[14px] text-[#202123] dark:text-[#D1D5DB] leading-relaxed">
        {introMessage}
      </p>

      {/* Product Summary */}
      <div className="space-y-1.5">
        <h4 className="text-[14px] font-semibold text-[#202123] dark:text-white">
          {summaryTitle}
        </h4>
        <div className="flex items-center justify-between text-[12.5px] text-[#676767] dark:text-[#A1A1AA]">
          <span>Overall opportunity</span>
          <StatusBadge category="success">{opportunityBadge}</StatusBadge>
        </div>
        <p className="text-[13px] text-[#202123] dark:text-[#D1D5DB] leading-normal">
          {summaryText}
        </p>
      </div>

      {/* Visual Analysis Inner Card */}
      <div className="rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] p-4 space-y-2">
        <span className="text-[12px] font-semibold text-[#676767] dark:text-[#A1A1AA] block">
          Visual analysis
        </span>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA] block">Margin</span>
            <span className="text-[20px] font-bold font-mono text-[#202123] dark:text-white">
              {visualAnalysis.margin}
            </span>
          </div>
          <div>
            <span className="text-[11.5px] text-[#676767] dark:text-[#A1A1AA] block">Competition</span>
            <span className="text-[16px] font-bold text-[#202123] dark:text-white">
              {visualAnalysis.competition}
            </span>
          </div>
        </div>
      </div>

      {/* Next recommended skill */}
      {nextSkillName && (
        <div className="pt-1">
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] block mb-1">
            Next recommended skill
          </span>
          <button
            type="button"
            onClick={onNextSkillClick}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] dark:border-[#3A3A3A] bg-[#F7F7F8] dark:bg-[#2B2B2B] hover:bg-slate-100 dark:hover:bg-[#333333] transition-colors cursor-pointer group"
          >
            <span className="text-[14px] font-semibold text-[#202123] dark:text-white group-hover:text-emerald-600 transition-colors">
              {nextSkillName}
            </span>
            <ArrowRight className="w-4 h-4 text-[#676767] group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      )}

      {/* Bottom action controls */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB] dark:border-[#3A3A3A] text-[#676767] dark:text-[#A1A1AA]">
        <button
          type="button"
          onClick={() => {
            onCopy?.();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="p-1.5 rounded hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer"
          title="Copy"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={() => setLiked(liked === true ? null : true)}
          className={`p-1.5 rounded hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer ${
            liked === true ? 'text-emerald-600' : ''
          }`}
          title="Good response"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setLiked(liked === false ? null : false)}
          className={`p-1.5 rounded hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer ${
            liked === false ? 'text-rose-600' : ''
          }`}
          title="Bad response"
        >
          <ThumbsDown className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="text-[11px] font-mono text-[#676767] dark:text-[#A1A1AA] pt-1">
        REFERENCE 25 · Chat-style streaming skill execution
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 16. ChatGPTConversationalRenderer (The Master Continuous Conversational Layout)
// One central column (max-w-[820px] mx-auto) flowing naturally with zero boxiness!
// ─────────────────────────────────────────────────────────────────────────────

export interface ChatGPTConversationalProps {
  skillTitle: string;
  productTitle?: string;
  category?: string;
  rawContent?: string;
  introText?: string;
  reportTitle?: string;
  badges?: Array<{ text: string; category?: BadgeCategory }>;
  sections?: ReportSection[];
  metrics?: KPICardItem[];
  tables?: Array<{ title?: string; headers: string[]; rows: string[][] }>;
  products?: ProductCardItem[];
  flowSteps?: FlowchartStepItem[];
  decisionTree?: { question: string; yes: { check: string; action: string }; no: { check: string; action: string } };
  funnelStages?: FunnelStageItem[];
  chartData?: ChartRendererProps;
  checklist?: string[];
  timeline?: MilestoneItem[];
  riskMatrix?: RiskMatrixItem[];
  codeSnippet?: { title?: string; language?: string; code: string };
  recommendations?: Array<{ recommendation: string; priority?: string; impact?: string; nextAction?: string }>;
  conclusion?: string;
  artifacts?: ArtifactDeliverable[];
  onCopy?: () => void;
  // Visual Reference 14-25 Extensions:
  creativeGallery?: CreativeConceptItem[];
  researchCitations?: { title?: string; sources: ResearchCitationSource[]; conclusion?: string };
  expandableSections?: ExpandableSectionItem[];
  actionableRecommendations?: ActionableRecommendationItem[];
  multiStageTracker?: { progressPercent?: number; stages: SkillExecutionStage[] };
  calculator?: { initialSellingPrice?: number; initialProductCost?: number; initialDeliveryCost?: number; currency?: string };
  validationStatus?: { overallStatus?: string; checks: ValidationCheckItem[] };
  formula?: { formulaSubtitle?: string; formulaEquation?: string; variables?: Array<{ symbol: string; name: string }>; exampleEquation?: string; resultLabel?: string; resultValue?: string };
  deliverableCards?: GeneratedDeliverableItem[];
  productPageLivePreview?: { productName?: string; price?: number; headline?: string; description?: string; image?: string; currency?: string };
  workspacePreview?: SkillResultWorkspaceProps;
  chatStyleExecution?: ChatStyleExecutionProps;
  nextRecommendedSkill?: { name: string; description?: string; onClick?: () => void };
}

export const ChatGPTConversationalRenderer: React.FC<ChatGPTConversationalProps> = ({
  skillTitle,
  productTitle,
  category,
  rawContent,
  introText,
  reportTitle,
  badges,
  sections = [],
  metrics = [],
  tables = [],
  products,
  flowSteps,
  decisionTree,
  funnelStages,
  chartData,
  checklist,
  timeline,
  riskMatrix,
  codeSnippet,
  recommendations,
  conclusion,
  artifacts = [],
  onCopy,
  creativeGallery,
  researchCitations,
  expandableSections,
  actionableRecommendations,
  multiStageTracker,
  calculator,
  validationStatus,
  formula,
  deliverableCards,
  productPageLivePreview,
  workspacePreview,
  chatStyleExecution,
  nextRecommendedSkill,
}) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const resolvedReportTitle =
    reportTitle ||
    `${skillTitle}${productTitle ? ` — ${productTitle}` : ''}`;

  const resolvedBadges = badges || [
    { text: 'Analysis completed', category: 'success' as BadgeCategory },
    { text: category ? `Stage: ${category}` : 'Stage 01: Product Intelligence', category: 'neutral' as BadgeCategory },
  ];

  return (
    <div className="w-full max-w-[820px] mx-auto px-2 sm:px-4 py-4 font-sans text-[#202123] dark:text-[#ECECEC] space-y-6 select-text">
      {/* 1. Assistant Message Header */}
      <div className="flex items-center gap-2.5 text-[#202123] dark:text-[#ECECEC] pb-1">
        <div className="w-6 h-6 rounded-full bg-[#10A37F] text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold leading-[1.4]">Assistant</span>
          <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA]">• {skillTitle}</span>
        </div>
      </div>

      {/* 2. Natural Intro Text (15px font, 1.7 line height) */}
      {introText && !rawContent && (
        <p className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
          {introText}
        </p>
      )}

      {/* 3. Skill Report Header (24px Title, 11-12px Badges) */}
      <SkillReportHeader title={resolvedReportTitle} badges={resolvedBadges} />

      {/* 4. Natural Markdown Document Body (if rawContent provided) */}
      {rawContent ? (
        <ChatGPTMarkdownDocumentRenderer content={rawContent} />
      ) : sections.length > 0 ? (
        <div className="space-y-6">
          {sections.map((sec, idx) => {
            const num = sec.number !== undefined ? sec.number : idx + 1;
            return (
              <div key={idx} className="space-y-2">
                <h2 className="text-[20px] font-semibold leading-[1.4] text-[#202123] dark:text-white tracking-tight mt-[28px] mb-[10px]">
                  {num}. {sec.title}
                </h2>
                {sec.content && (
                  <p className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
                    {sec.content}
                  </p>
                )}
                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="space-y-2 pl-5 list-disc text-[15px] leading-[1.65] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
                    {sec.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="leading-[1.65]">{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 5. Unified KPI Dashboard Group (ONLY if metrics actually provided) */}
      {metrics && metrics.length > 0 && (
        <KPIRenderer
          title="Campaign Performance & Commercial Benchmarks"
          timeframe="LAST 7 DAYS"
          statusBadge="Active campaign"
          metrics={metrics}
        />
      )}

      {/* 6. Comparison Product Cards (ONLY if real products provided) */}
      {products && products.length > 0 && (
        <ProductCardsRenderer products={products} />
      )}

      {/* 7. Structured Tables (ONLY if separate tables provided and not in rawContent) */}
      {!rawContent && tables && tables.length > 0 && tables.map((tbl, i) => (
        <TableRenderer
          key={i}
          title={tbl.title || 'Product Opportunity Comparison'}
          columns={tbl.headers}
          rows={tbl.rows.map((row) => {
            const obj: any = { criteria: row[0] || `Row ${i + 1}` };
            tbl.headers.slice(1).forEach((h, hIdx) => {
              obj[h] = row[hIdx + 1] || '—';
            });
            return obj;
          })}
          bestOpportunity={productTitle || 'Product A'}
        />
      ))}

      {/* 8. Connected Flowchart Diagram (ONLY if real sequential steps provided) */}
      {flowSteps && flowSteps.length >= 2 && (
        <FlowchartRenderer title="Full-Funnel E-Commerce Workflow" steps={flowSteps} />
      )}

      {/* 9. Conditional Decision Tree (ONLY if decision tree provided) */}
      {decisionTree && (
        <DecisionTreeRenderer
          question={decisionTree.question}
          yesBranch={decisionTree.yes}
          noBranch={decisionTree.no}
        />
      )}

      {/* 10. Funnel Visualization (ONLY if funnel provided) */}
      {funnelStages && funnelStages.length > 0 && (
        <FunnelRenderer stages={funnelStages} />
      )}

      {/* 11. Performance Charts (ONLY if chart data provided) */}
      {chartData && (chartData.barData?.length || chartData.lineData?.length) && (
        <ChartRenderer {...chartData} />
      )}

      {/* 12. Interactive Checklist (ONLY if checklist items provided and not in rawContent) */}
      {!rawContent && checklist && checklist.length > 0 && (
        <ChecklistRenderer items={checklist} />
      )}

      {/* 13. Timeline and Milestones (ONLY if timeline provided) */}
      {timeline && timeline.length > 0 && (
        <TimelineRenderer milestones={timeline} />
      )}

      {/* 14. Priority and Risk Matrix (ONLY if risk matrix provided) */}
      {riskMatrix && riskMatrix.length > 0 && (
        <RiskMatrixRenderer items={riskMatrix} />
      )}

      {/* 15. Code Block Preview (ONLY if separate code block provided and not in rawContent) */}
      {!rawContent && codeSnippet && (
        <CodeRenderer
          title={codeSnippet.title || 'Direct-Response Ad Copy & HTML'}
          language={codeSnippet.language || 'HTML'}
          code={codeSnippet.code}
        />
      )}

      {/* 16. Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-3 my-6">
          <h3 className="text-[17px] font-semibold text-[#202123] dark:text-white">
            Strategic Recommendations
          </h3>
          {recommendations.map((rec, i) => (
            <RecommendationRenderer
              key={i}
              recommendation={rec.recommendation}
              priority={rec.priority}
              impact={rec.impact}
              nextAction={rec.nextAction}
            />
          ))}
        </div>
      )}

      {/* Ref 14. Creative Concepts Image Gallery */}
      {creativeGallery && creativeGallery.length > 0 && (
        <CreativeConceptsGallery concepts={creativeGallery} />
      )}

      {/* Ref 15. Research Findings with Citations */}
      {researchCitations && researchCitations.sources.length > 0 && (
        <ResearchCitationsCard
          title={researchCitations.title}
          sources={researchCitations.sources}
          conclusion={researchCitations.conclusion}
        />
      )}

      {/* Ref 16. Expandable Analysis Sections */}
      {expandableSections && expandableSections.length > 0 && (
        <ExpandableAnalysisSections sections={expandableSections} />
      )}

      {/* Ref 17. Actionable Recommendations & Next Action Cards */}
      {actionableRecommendations && actionableRecommendations.length > 0 && (
        <ActionableRecommendationsCard items={actionableRecommendations} />
      )}

      {/* Ref 18. Multi-Stage Skill Execution Tracker */}
      {multiStageTracker && multiStageTracker.stages.length > 0 && (
        <MultiStageSkillTracker
          progressPercent={multiStageTracker.progressPercent}
          stages={multiStageTracker.stages}
        />
      )}

      {/* Ref 19. Interactive Profitability Calculator */}
      {calculator && (
        <InteractiveProfitabilityCalculator
          initialSellingPrice={calculator.initialSellingPrice}
          initialProductCost={calculator.initialProductCost}
          initialDeliveryCost={calculator.initialDeliveryCost}
          currency={calculator.currency}
        />
      )}

      {/* Ref 20. Skill Validation Results & Quality Report */}
      {validationStatus && validationStatus.checks.length > 0 && (
        <SkillValidationReport
          overallStatus={validationStatus.overallStatus}
          checks={validationStatus.checks}
        />
      )}

      {/* Ref 21. Mathematical & Profit Formula Presentation */}
      {formula && (
        <FormulaPresentationCard
          formulaSubtitle={formula.formulaSubtitle}
          formulaEquation={formula.formulaEquation}
          variables={formula.variables}
          exampleEquation={formula.exampleEquation}
          resultLabel={formula.resultLabel}
          resultValue={formula.resultValue}
        />
      )}

      {/* Ref 22. Generated File & Artifact Deliverables Cards */}
      {deliverableCards && deliverableCards.length > 0 && (
        <ArtifactDeliverablesCard deliverables={deliverableCards} />
      )}

      {/* Ref 23. Live Product Page Responsive Preview */}
      {productPageLivePreview && (
        <ProductPageLivePreview
          productName={productPageLivePreview.productName}
          price={productPageLivePreview.price}
          headline={productPageLivePreview.headline}
          description={productPageLivePreview.description}
          image={productPageLivePreview.image}
          currency={productPageLivePreview.currency}
        />
      )}

      {/* 17. Final Written Conclusion */}
      {conclusion && (
        <div className="space-y-2 pt-2">
          <h3 className="text-[17px] font-semibold text-[#202123] dark:text-white">
            Final Launch Verdict & Scale Authorization
          </h3>
          <p className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB]">
            {conclusion}
          </p>
        </div>
      )}

      {/* 18. Artifact Deliverables */}
      {artifacts.length > 0 && (
        <ArtifactRenderer artifacts={artifacts} />
      )}

      {/* Ref 24. Split-Screen Text + Visual Preview Workspace */}
      {workspacePreview && (
        <SkillResultWorkspace {...workspacePreview} />
      )}

      {/* Ref 25. Chat-Style Streaming Skill Execution */}
      {chatStyleExecution && (
        <ChatStyleExecutionCard {...chatStyleExecution} />
      )}

      {/* Ref 25. Next Recommended Skill Pill (Flow to next agent) */}
      {nextRecommendedSkill && (
        <NextRecommendedSkillCard
          skillName={nextRecommendedSkill.name}
          skillDescription={nextRecommendedSkill.description}
          onClick={nextRecommendedSkill.onClick}
        />
      )}

      {/* 19. Bottom ChatGPT Action Controls */}
      <div className="flex items-center gap-2 pt-6 border-t border-[#E5E7EB] dark:border-[#3A3A3A] text-[#676767] dark:text-[#A1A1AA]">
        <button
          type="button"
          onClick={() => {
            onCopy?.();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="p-1.5 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] text-[#676767] hover:text-[#202123] dark:hover:text-white transition-colors cursor-pointer"
          title="Copy response"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
        <button
          type="button"
          onClick={() => setLiked(liked === true ? null : true)}
          className={`p-1.5 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer ${
            liked === true ? 'text-emerald-600' : 'text-[#676767] hover:text-[#202123] dark:hover:text-white'
          }`}
          title="Good response"
        >
          <ThumbsUp className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setLiked(liked === false ? null : false)}
          className={`p-1.5 rounded-lg hover:bg-[#F7F7F8] dark:hover:bg-[#2B2B2B] transition-colors cursor-pointer ${
            liked === false ? 'text-rose-600' : 'text-[#676767] hover:text-[#202123] dark:hover:text-white'
          }`}
          title="Bad response"
        >
          <ThumbsDown className="w-4 h-4" />
        </button>
        <span className="text-[12px] text-[#676767] dark:text-[#A1A1AA] ml-auto font-mono">
          ChatGPT-Grade Output
        </span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 17. EnrichedMarkdownText & ChatGPTMarkdownDocumentRenderer
// Converts markdown directly to ChatGPT-grade typography without nested card borders
// ─────────────────────────────────────────────────────────────────────────────

export const EnrichedMarkdownText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-[#111827] dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={i}
              className="text-[13px] font-mono px-1.5 py-0.5 rounded bg-[#F7F7F8] dark:bg-[#2B2B2B] text-[#202123] dark:text-[#ECECEC] border border-[#E5E7EB] dark:border-[#3A3A3A]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={i} className="italic text-[#202123] dark:text-[#ECECEC]">
              {part.slice(1, -1)}
            </em>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

export const ChatGPTMarkdownDocumentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const blocks = useMemo(() => {
    const rawLines = content.split(/\r?\n/);
    const result: Array<{
      type: 'h1' | 'h2' | 'h3' | 'h4' | 'paragraph' | 'list' | 'code' | 'table';
      text?: string;
      items?: string[];
      code?: string;
      language?: string;
      headers?: string[];
      rows?: string[][];
    }> = [];

    let i = 0;
    while (i < rawLines.length) {
      const line = rawLines[i].trim();
      if (!line) {
        i++;
        continue;
      }

      // Code Block
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim() || 'HTML';
        const codeLines: string[] = [];
        i++;
        while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
          codeLines.push(rawLines[i]);
          i++;
        }
        if (i < rawLines.length) i++; // skip closing ```
        result.push({
          type: 'code',
          language: lang,
          code: codeLines.join('\n'),
        });
        continue;
      }

      // Headings
      if (line.startsWith('# ')) {
        result.push({ type: 'h1', text: line.slice(2).trim() });
        i++;
        continue;
      }
      if (line.startsWith('## ')) {
        result.push({ type: 'h2', text: line.slice(3).trim() });
        i++;
        continue;
      }
      if (line.startsWith('### ')) {
        result.push({ type: 'h3', text: line.slice(4).trim() });
        i++;
        continue;
      }
      if (line.startsWith('#### ')) {
        result.push({ type: 'h4', text: line.slice(5).trim() });
        i++;
        continue;
      }

      // Markdown Table
      if (line.includes('|') && (line.startsWith('|') || line.endsWith('|'))) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().includes('|')) {
          tableLines.push(rawLines[i].trim());
          i++;
        }
        if (tableLines.length >= 2) {
          const parseRow = (l: string) =>
            l
              .replace(/^\|/, '')
              .replace(/\|$/, '')
              .split('|')
              .map((c) => c.trim());
          const isSep = (l: string) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(l);
          const delimIdx = tableLines.findIndex(isSep);
          let headers: string[] = [];
          let rows: string[][] = [];
          if (delimIdx > 0) {
            headers = parseRow(tableLines[delimIdx - 1]);
            rows = tableLines
              .filter((_, idx) => idx !== delimIdx && idx !== delimIdx - 1)
              .map(parseRow);
          } else {
            headers = parseRow(tableLines[0]);
            rows = tableLines.slice(1).map(parseRow);
          }
          result.push({ type: 'table', headers, rows });
          continue;
        }
      }

      // Bullet List
      if (/^[-*•]\s+/.test(line)) {
        const items: string[] = [];
        while (i < rawLines.length && /^[-*•]\s+/.test(rawLines[i].trim())) {
          items.push(rawLines[i].trim().replace(/^[-*•]\s+/, ''));
          i++;
        }
        result.push({ type: 'list', items });
        continue;
      }

      // Numbered List
      if (/^\d+[.)]\s+/.test(line)) {
        const items: string[] = [];
        while (i < rawLines.length && /^\d+[.)]\s+/.test(rawLines[i].trim())) {
          items.push(rawLines[i].trim().replace(/^\d+[.)]\s+/, ''));
          i++;
        }
        result.push({ type: 'list', items });
        continue;
      }

      // Paragraph
      result.push({ type: 'paragraph', text: line });
      i++;
    }

    return result;
  }, [content]);

  return (
    <div className="w-full max-w-full mx-auto space-y-4 font-sans text-[#202123] dark:text-[#ECECEC] select-text">
      {blocks.map((b, idx) => {
        if (b.type === 'h1') {
          return (
            <h1 key={idx} className="text-[24px] font-bold leading-[1.3] text-[#202123] dark:text-white tracking-tight mt-6 mb-3 first:mt-0">
              <EnrichedMarkdownText text={b.text || ''} />
            </h1>
          );
        }
        if (b.type === 'h2') {
          return (
            <h2 key={idx} className="text-[20px] font-semibold leading-[1.4] text-[#202123] dark:text-white tracking-tight mt-7 mb-2.5">
              <EnrichedMarkdownText text={b.text || ''} />
            </h2>
          );
        }
        if (b.type === 'h3') {
          return (
            <h3 key={idx} className="text-[17px] font-semibold leading-[1.4] text-[#202123] dark:text-white mt-5 mb-2">
              <EnrichedMarkdownText text={b.text || ''} />
            </h3>
          );
        }
        if (b.type === 'h4') {
          return (
            <h4 key={idx} className="text-[15px] font-semibold leading-[1.5] text-[#202123] dark:text-white mt-4 mb-1.5">
              <EnrichedMarkdownText text={b.text || ''} />
            </h4>
          );
        }
        if (b.type === 'list') {
          return (
            <ul key={idx} className="space-y-2 pl-5 list-disc text-[15px] leading-[1.65] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
              {b.items?.map((it, itemIdx) => (
                <li key={itemIdx} className="leading-[1.65]">
                  <EnrichedMarkdownText text={it} />
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === 'table') {
          return (
            <TableRenderer
              key={idx}
              columns={b.headers}
              rows={(b.rows || []).map((row) => {
                const obj: any = { criteria: row[0] || '' };
                (b.headers || []).slice(1).forEach((h, hIdx) => {
                  obj[h] = row[hIdx + 1] || '—';
                });
                return obj;
              })}
            />
          );
        }
        if (b.type === 'code') {
          return (
            <CodeRenderer
              key={idx}
              language={b.language}
              code={b.code}
            />
          );
        }
        return (
          <p key={idx} className="text-[15px] font-normal leading-[1.7] text-[#202123] dark:text-[#D1D5DB] mb-[14px]">
            <EnrichedMarkdownText text={b.text || ''} />
          </p>
        );
      })}
    </div>
  );
};

