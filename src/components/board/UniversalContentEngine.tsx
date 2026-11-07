import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Layers,
  BarChart3,
  Code2,
  Compass,
  ShieldCheck,
  Target,
  Truck,
  DollarSign,
  Percent,
  Flame,
  Award,
  Zap,
  Tag,
  ArrowUpRight,
  MessageSquareQuote,
  Activity,
  BookmarkCheck,
  Sliders,
  Type,
  Palette,
  Settings,
  GitFork,
  Workflow,
  Table,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { WorkflowChartView, getSkillTheme } from './WorkflowChartView';
import { AnalyticsDashboardView } from './AnalyticsDashboardView';
import {
  ChatGPTMarkdownDocumentRenderer,
  StatusBadge,
  KPIRenderer,
  ActionableRecommendationsCard,
  InteractiveProfitabilityCalculator,
} from './ChatGPTComponents';

export interface TextStyleConfig {
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontSizeScale?: number; // e.g. 100, 115, 130, 150, 170%
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  lineHeight?: 'tight' | 'normal' | 'relaxed';
  fontFamily?: 'sans' | 'serif' | 'mono';
  colorTheme?: 'default' | 'emerald' | 'purple' | 'amber' | 'contrast';
}

export interface UniversalContentEngineProps {
  content: string;
  skillTitle?: string;
  productTitle?: string;
  category?: string;
  language?: string;
  webResearchUsed?: boolean;
  executedAt?: string;
  isSimulated?: boolean;
  activeTab?: 'chatgpt' | 'preview' | 'workflow' | 'analytics' | 'doc' | 'prompt' | 'json';
  onTabChange?: (tab: 'chatgpt' | 'preview' | 'workflow' | 'analytics' | 'doc' | 'prompt' | 'json') => void;
  direction?: 'ltr' | 'rtl';
  onDirectionToggle?: () => void;
  placement?: 'bottom' | 'right' | 'left';
  onPlacementToggle?: () => void;
  promptText?: string;
  className?: string;
  maxHeight?: string;
  textStyle?: TextStyleConfig;
  onTextStyleChange?: (style: TextStyleConfig) => void;
  onOpenSettings?: () => void;
  skillIconBg?: string;
  skillIconColor?: string;
  skillColor?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  customWidth?: number;
  customHeight?: number;
}

// Structured data interfaces extracted by content analyzer
interface ExtractedMetric {
  label: string;
  value: string;
  badge?: string;
  trend?: 'up' | 'down' | 'neutral';
  colorTheme?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'cyan';
}

interface ExtractedTable {
  headers: string[];
  rows: string[][];
  title?: string;
}

interface ExtractedProsCons {
  pros: string[];
  cons: string[];
  title?: string;
}

interface ExtractedStep {
  number: number;
  title: string;
  description: string;
  badge?: string;
}

interface ExtractedChecklistItem {
  id: string;
  text: string;
  priority?: 'high' | 'medium' | 'normal';
  category?: string;
}

interface ExtractedHookItem {
  id: string;
  title: string;
  body: string;
  badge?: string;
}

interface ExtractedSection {
  id: string;
  title: string;
  type: 'hooks' | 'market' | 'logistics' | 'strategy' | 'specs' | 'risk' | 'general';
  paragraphs: string[];
  bulletPoints: string[];
  keyPairs: { key: string; val: string }[];
  hookItems?: ExtractedHookItem[];
}

interface AnalyzedResult {
  title: string;
  subtitle: string;
  executiveSummary: string;
  metrics: ExtractedMetric[];
  tables: ExtractedTable[];
  prosCons?: ExtractedProsCons;
  steps: ExtractedStep[];
  checklist: ExtractedChecklistItem[];
  sections: ExtractedSection[];
  risksAndCaveats: string[];
  conclusion?: string;
}

/**
 * Normalizes and cleans raw AI output:
 * - Unwraps JSON arrays: ["string 1", "string 2"] -> joins them into clean markdown
 * - Unwraps JSON objects: { key: value } -> converts to structured markdown sections
 * - Unescapes literal string sequences: \n -> real newline, \r\n -> real newline, \t -> space, \" -> "
 * - Strips dangling outer JSON array brackets [ ] and trailing commas
 * - Strips leading/trailing block quotes around markdown headers or paragraphs
 */
export function normalizeAndCleanAIOutput(raw: any): string {
  if (!raw) return '';

  let text = '';

  // 1. If it's already an array
  if (Array.isArray(raw)) {
    text = raw
      .map((item) => (typeof item === 'string' ? item : JSON.stringify(item)))
      .filter((s) => s.trim().length > 0)
      .join('\n\n');
  } else if (typeof raw === 'object' && raw !== null) {
    if (raw.result && typeof raw.result === 'string') {
      text = raw.result;
    } else if (raw.content && typeof raw.content === 'string') {
      text = raw.content;
    } else {
      text = Object.entries(raw)
        .map(([k, v]) => `### ${k}\n${typeof v === 'string' ? v : JSON.stringify(v, null, 2)}`)
        .join('\n\n');
    }
  } else {
    text = String(raw);
  }

  // 2. Check if string is wrapped in markdown code fence like ```json ... ``` or ```markdown ... ```
  const codeBlockMatch = text.match(/^```(?:json|markdown|text)?\s*([\s\S]*?)\s*```$/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    text = codeBlockMatch[1].trim();
  }

  // 3. Try to parse as JSON if it looks like a JSON array or object
  const trimmed = text.trim();
  if (
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 20)
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return normalizeAndCleanAIOutput(parsed);
      }
      if (typeof parsed === 'string') {
        return normalizeAndCleanAIOutput(parsed);
      }
      if (typeof parsed === 'object' && parsed !== null) {
        return normalizeAndCleanAIOutput(parsed);
      }
    } catch {
      // JSON parse failed; proceed with regex-based normalizer below
    }
  }

  // 4. Handle escaped newlines (literal \n or \r\n characters in text)
  if (text.includes('\\n')) {
    text = text.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n');
  }
  if (text.includes('\\t')) {
    text = text.replace(/\\t/g, '  ');
  }
  if (text.includes('\\"')) {
    text = text.replace(/\\"/g, '"');
  }

  // 5. Clean array artifacts if text was stringified array with dangling quotes & commas:
  // e.g. "### Heading..." , \n "### Heading 2..."
  text = text
    // Strip leading [ and trailing ] if loose
    .replace(/^\[\s*/, '')
    .replace(/\s*\]$/, '')
    // Replace comma-separated quotes: " ,\n " or " , " with double newline
    .replace(/"\s*,\s*[\r\n]+\s*"/g, '\n\n')
    .replace(/"\s*,\s*"/g, '\n\n')
    // Replace quote at end of line followed by comma
    .replace(/"\s*,\s*$/gm, '')
    // Strip leading quotes on lines that start with markdown headers: "### -> ###
    .replace(/^"\s*(#+)/gm, '$1')
    // Strip leading quotes on bullet points: "- -> -
    .replace(/^"\s*([-*•\d+])/gm, '$1')
    // Strip leading quotes on emoji lines: " 💡 -> 💡
    .replace(/^"\s*([\uD800-\uDBFF\uDC00-\uDFFF\u2600-\u27BF])/gm, '$1')
    // Strip trailing quotes at end of lines or blocks
    .replace(/"\s*$/gm, '');

  // 6. Ensure clean spacing between headers and tables
  text = text.replace(/(^#+\s+[^\n]+)\n+(\|)/gm, '$1\n\n$2');

  return text.trim();
}

/**
 * Safely parses markdown table row into cells, handling leading, trailing, and missing outer pipes
 */
export function parseMarkdownTableRow(rowStr: string): string[] {
  let cleaned = rowStr.trim();
  if (cleaned.startsWith('|')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.endsWith('|')) {
    cleaned = cleaned.substring(0, cleaned.length - 1);
  }
  return cleaned.split('|').map((c) => c.trim());
}

/**
 * Universal Content Analyzer
 * Analyzes unstructured/structured markdown, bullets, or text and extracts semantic hierarchy
 * without losing any information.
 */
export function analyzeContent(
  rawInput: string,
  fallbackTitle = 'Analysis Report',
  fallbackProduct = ''
): AnalyzedResult {
  const rawContent = normalizeAndCleanAIOutput(rawInput);

  if (!rawContent || rawContent.trim().length === 0) {
    return {
      title: fallbackProduct || fallbackTitle,
      subtitle: 'Generated Research & Strategy Report',
      executiveSummary: 'No content available for this node yet. Click Run to generate.',
      metrics: [],
      tables: [],
      steps: [],
      checklist: [],
      sections: [],
      risksAndCaveats: [],
    };
  }

  let title = fallbackProduct || '';
  let subtitle = '';
  let executiveSummary = '';
  const metrics: ExtractedMetric[] = [];
  const tables: ExtractedTable[] = [];
  let prosCons: ExtractedProsCons | undefined;
  const steps: ExtractedStep[] = [];
  const checklist: ExtractedChecklistItem[] = [];
  const sections: ExtractedSection[] = [];
  const risksAndCaveats: string[] = [];
  let conclusion = '';

  // 1. Detect Title (What was searched / Product Name / Subject)
  if (fallbackTitle && fallbackTitle !== 'Analysis Report') {
    title = fallbackProduct && !fallbackTitle.toLowerCase().includes(fallbackProduct.toLowerCase())
      ? `${fallbackTitle} — ${fallbackProduct}`
      : fallbackTitle;
  } else {
    const productMatch = rawContent.match(/(?:Product\s*name|Target\s*Product|Title|Subject):\s*([^\n\r]+)/i);
    if (productMatch && productMatch[1]) {
      title = productMatch[1].replace(/[*_#]/g, '').trim();
    } else {
      // Check first H1/H2/H3
      const headingMatch = rawContent.match(/^#+\s*(.+)$/m);
      const cand = headingMatch && headingMatch[1] ? headingMatch[1].replace(/[*_]/g, '').trim() : '';
      const isGeneric = !cand || ['summary', 'keypoints', 'overview', 'strategic intelligence', 'résumé', 'ملخص'].includes(cand.toLowerCase());
      if (cand && !isGeneric) {
        title = cand;
      } else {
        title = fallbackProduct || fallbackTitle;
      }
    }
  }

  // 2. Detect Subtitle or Context
  const contextMatch = rawContent.match(/(?:Context|Scope|Category|Subtitle|Niche):\s*([^\n\r]+)/i);
  if (contextMatch && contextMatch[1]) {
    subtitle = contextMatch[1].replace(/[*_]/g, '').trim();
  } else {
    subtitle = fallbackProduct ? `${fallbackTitle} • ${fallbackProduct}` : fallbackTitle;
  }

  // 3. Detect Executive Summary / Core Findings (Multilingual support: English, French, Arabic, Algerian Darja)
  const summaryMatch = rawContent.match(
    /(?:Executive\s*Summary|Summary|Core\s*Findings|TL;?DR|Overview|Résumé|Résumé\s*Exécutif|ملخص\s*تنفيذي|ملخص|الملخص):\s*([\s\S]*?)(?=(?:\n\s*\n\s*(?:[A-Z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s&/\-_'’]+:|#+))|$)/i
  );
  if (summaryMatch && summaryMatch[1]) {
    executiveSummary = summaryMatch[1].trim();
  } else {
    // Fallback: Use opening narrative before the first structured header
    const cleanBlocks = rawContent
      .replace(/^#+.*$/gm, '')
      .replace(/^(?:Product\s*name|Target\s*Product|Title|Nom\s*du\s*produit|اسم\s*المنتج|اسم\s*السلعة):\s*.*$/gim, '')
      .trim()
      .split(/\n\s*\n/);
    if (cleanBlocks[0] && cleanBlocks[0].length > 15 && !cleanBlocks[0].includes('|')) {
      executiveSummary = cleanBlocks[0].trim();
    }
  }

  // 4. Detect Explicit & Implicit Metrics with semantic color assignments
  const pipeMetricLines = rawContent.match(
    /(?:Selling\s*Price|Product\s*Cost|Margin|Price|Budget|Score|CTR|CVR|ROAS|CPC|Orders|Revenue|Volume)[^\n]+\|[^\n]+/gi
  );
  if (pipeMetricLines) {
    pipeMetricLines.forEach((line) => {
      const parts = line.split('|');
      parts.forEach((p) => {
        const pair = p.match(/([^:]+):\s*([^\n\r]+)/);
        if (pair) {
          const l = pair[1].replace(/[*_#\-]/g, '').trim();
          const v = pair[2].replace(/[*_#]/g, '').trim();
          if (l.length > 0 && v.length > 0 && !metrics.some((m) => m.label.toLowerCase() === l.toLowerCase())) {
            const lowerL = l.toLowerCase();
            let colorTheme: ExtractedMetric['colorTheme'] = 'blue';
            if (lowerL.includes('price') || lowerL.includes('selling') || lowerL.includes('revenue')) {
              colorTheme = 'emerald';
            } else if (lowerL.includes('cost') || lowerL.includes('cpc') || lowerL.includes('budget')) {
              colorTheme = 'amber';
            } else if (lowerL.includes('margin') || lowerL.includes('profit') || lowerL.includes('roas')) {
              colorTheme = 'purple';
            } else if (lowerL.includes('ctr') || lowerL.includes('cvr') || lowerL.includes('rate') || lowerL.includes('score')) {
              colorTheme = 'cyan';
            }

            metrics.push({
              label: l,
              value: v,
              trend: v.includes('+') ? 'up' : v.includes('-') ? 'down' : 'neutral',
              colorTheme,
            });
          }
        }
      });
    });
  }

  // Standalone key metrics
  const metricPatterns: { regex: RegExp; theme: ExtractedMetric['colorTheme'] }[] = [
    { regex: /(?:Selling\s*Price|Target\s*Price|Price):\s*([\d,.]+\s*(?:DZD|USD|\$|EUR|€|DA)?)/i, theme: 'emerald' },
    { regex: /(?:Product\s*Cost|Landed\s*Cost|Cost):\s*([\d,.]+\s*(?:DZD|USD|\$|EUR|€|DA)?)/i, theme: 'amber' },
    { regex: /(?:Profit\s*Margin|Net\s*Margin|Margin):\s*([+\-]?\d+(?:\.\d+)?%)/i, theme: 'purple' },
    { regex: /(?:Target\s*Score|Validation\s*Score|Score|Rating):\s*(\d+(?:\/\d+|%)?)/i, theme: 'cyan' },
    { regex: /(?:Expected\s*ROAS|Target\s*ROAS|ROAS):\s*(\d+(?:\.\d+)?x?)/i, theme: 'purple' },
    { regex: /(?:CTR|Click\s*Through\s*Rate):\s*(\d+(?:\.\d+)?%)/i, theme: 'cyan' },
    { regex: /(?:CVR|Conversion\s*Rate):\s*(\d+(?:\.\d+)?%)/i, theme: 'blue' },
    { regex: /(?:Estimated\s*Orders|Daily\s*Orders):\s*([\d,.]+(?:\+)?)/i, theme: 'emerald' },
    { regex: /(?:Wilayas\s*Covered|Wilaya\s*Coverage|Coverage):\s*(\d+\s*Wilayas?)/i, theme: 'blue' },
    { regex: /(?:Delivery\s*Rate|Break-Even\s*Rate):\s*(\d+(?:\.\d+)?%)/i, theme: 'cyan' },
  ];

  metricPatterns.forEach(({ regex, theme }) => {
    const m = rawContent.match(regex);
    if (m && m[1]) {
      const label = m[0].split(':')[0].replace(/[*_#\-]/g, '').trim();
      const val = m[1].replace(/[*_#]/g, '').trim();
      if (!metrics.some((x) => x.label.toLowerCase() === label.toLowerCase())) {
        metrics.push({
          label,
          value: val,
          trend: val.includes('+') ? 'up' : 'neutral',
          colorTheme: theme,
        });
      }
    }
  });

  // 5. Parse Markdown Tables (with title support)
  // Supports tables whether rows start/end with pipes or not, with or without trailing pipes
  let cleanContentWithoutTables = rawContent;
  const rawLines = rawContent.split(/\r?\n/);
  let lineIdx = 0;

  while (lineIdx < rawLines.length) {
    const curLine = rawLines[lineIdx].trim();
    if (curLine.includes('|') && (curLine.startsWith('|') || curLine.endsWith('|') || curLine.split('|').length >= 3)) {
      // Possible table start!
      // Check if previous line had a title
      let tableTitle: string | undefined = undefined;
      let titleLineIdx = -1;
      if (lineIdx > 0) {
        const prevLine = rawLines[lineIdx - 1].trim();
        const headerMatch = prevLine.match(/^(?:###?|####?|\*\*)\s*([^\n|#]+?)(?:\*\*|:)?$/);
        if (headerMatch && !headerMatch[1].toLowerCase().includes('summary') && !headerMatch[1].toLowerCase().includes('product')) {
          tableTitle = headerMatch[1].replace(/[*_#]/g, '').trim();
          titleLineIdx = lineIdx - 1;
        }
      }

      const tableLines: string[] = [];
      while (
        lineIdx < rawLines.length &&
        rawLines[lineIdx].trim().length > 0 &&
        rawLines[lineIdx].includes('|')
      ) {
        tableLines.push(rawLines[lineIdx].trim());
        lineIdx++;
      }

      if (tableLines.length >= 2) {
        const parsedRows = tableLines.map(parseMarkdownTableRow);
        const isDelimiter = (l: string) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(l.trim());
        const delimIdx = tableLines.findIndex(isDelimiter);

        let headers: string[] = [];
        let dataRows: string[][] = [];

        if (delimIdx > 0) {
          headers = parsedRows[delimIdx - 1];
          dataRows = parsedRows.filter((_, idx) => idx !== delimIdx && idx !== delimIdx - 1);
        } else {
          headers = parsedRows[0];
          dataRows = parsedRows.slice(1);
        }

        // Clean headers and normalize column count
        headers = headers.map((h) => h.replace(/[*_]/g, '').trim());
        const colCount = Math.max(headers.length, ...dataRows.map((r) => r.length));

        while (headers.length < colCount) {
          headers.push(`Column ${headers.length + 1}`);
        }

        dataRows = dataRows.map((row) => {
          const padded = [...row];
          while (padded.length < colCount) {
            padded.push('');
          }
          return padded.slice(0, colCount);
        });

        if (headers.length > 0 && dataRows.length > 0) {
          tables.push({ headers, rows: dataRows, title: tableTitle });

          // Blank out table from cleanContentWithoutTables
          const fullTableStr = (titleLineIdx >= 0 ? rawLines[titleLineIdx] + '\n' : '') + tableLines.join('\n');
          cleanContentWithoutTables = cleanContentWithoutTables.replace(fullTableStr, '\n\n');
        }
      }
    } else {
      lineIdx++;
    }
  }

  const lines = cleanContentWithoutTables.split(/\r?\n/);

  // 6. Detect Pros & Cons
  const prosMatch = rawContent.match(/(?:Pros|Advantages|Strengths|Positive\s*Signals):\s*([\s\S]*?)(?=(?:\n\s*\n\s*(?:Cons|Disadvantages|Risks|Weaknesses|[A-Z][A-Za-z0-9\s&/\-]+:))|$)/i);
  const consMatch = rawContent.match(/(?:Cons|Disadvantages|Weaknesses|Risks|Negative\s*Signals):\s*([\s\S]*?)(?=(?:\n\s*\n\s*[A-Z][A-Za-z0-9\s&/\-]+:)|$)/i);
  if (prosMatch || consMatch) {
    const extractItems = (block?: string) => {
      if (!block) return [];
      return block
        .split('\n')
        .map((l) => l.replace(/^[\s\-*•\d.)+]+/, '').trim())
        .filter((l) => l.length > 3);
    };
    const pros = extractItems(prosMatch?.[1]);
    const cons = extractItems(consMatch?.[1]);
    if (pros.length > 0 || cons.length > 0) {
      prosCons = { pros, cons };
    }
  }

  // 7. Detect Sequential Steps / Workflow Phases
  const stepRegex = /(?:Step|Phase|Milestone|Stage)\s*(\d+)[:.-]\s*([^\n]+)(?:\n([\s\S]*?)(?=(?:\n\s*(?:Step|Phase|Milestone|Stage)\s*\d+)|(?:\n\s*###)|$))?/gi;
  let stepMatch;
  while ((stepMatch = stepRegex.exec(rawContent)) !== null) {
    const num = parseInt(stepMatch[1], 10) || steps.length + 1;
    const stepTitle = stepMatch[2].replace(/[*_#]/g, '').trim();
    const stepDesc = stepMatch[3] ? stepMatch[3].trim() : '';
    steps.push({
      number: num,
      title: stepTitle,
      description: stepDesc,
    });
  }

  // 8. Detect Action Items / Checklists (Multilingual: English, French, Arabic, Algerian Darja)
  const actionMatch = rawContent.match(
    /(?:(?:💡\s*)?(?:Action\s*Items|Action\s*Plan|Next\s*Steps|Checklist|Execution\s*Tasks|Top\s*\d*\s*Actions?|Plan\s*d'Action|Plan\s*d'action|Étapes\s*suivantes|خطة\s*العمل|خطة\s*الخدمة\s*والتطوير))(?::|\s*\n)\s*([\s\S]*?)(?=(?:\n\s*\n\s*(?:[A-Z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s&/\-_'’]+:|#+))|$)/i
  );
  if (actionMatch && actionMatch[1]) {
    const actionLines = actionMatch[1].split('\n');
    actionLines.forEach((l, idx) => {
      const clean = l.replace(/^[\s\-*•\d.)+\[\]x]+/, '').trim();
      if (clean.length > 3) {
        const isHigh =
          clean.toLowerCase().includes('immediate') ||
          clean.toLowerCase().includes('priority') ||
          clean.toLowerCase().includes('critical') ||
          clean.toLowerCase().includes('urgently') ||
          clean.toLowerCase().includes('phase 1') ||
          clean.toLowerCase().includes('étape 1') ||
          clean.toLowerCase().includes('المرحلة 1') ||
          clean.toLowerCase().includes('الخطوة 1');
        checklist.push({
          id: `task-${idx}-${Date.now()}`,
          text: clean,
          priority: isHigh ? 'high' : 'normal',
        });
      }
    });
  }

  // 9. Detect Risks & Caveats
  const riskMatch = rawContent.match(/(?:Risks?|Caveats?|Limitations?|Assumptions?|Watch\s*Out\s*For|Bottlenecks?|Risques?|مخاطر):\s*([\s\S]*?)(?=(?:\n\s*\n\s*[A-Z\u0600-\u06FF][A-Za-z0-9\u0600-\u06FF\s&/\-]+:)|$)/i);
  if (riskMatch && riskMatch[1]) {
    riskMatch[1].split('\n').forEach((l) => {
      const clean = l.replace(/^[\s\-*•\d.)+]+/, '').trim();
      if (clean.length > 4) {
        risksAndCaveats.push(clean);
      }
    });
  }

  // 10. Detect Conclusion / Final Recommendation
  const conclusionMatch = rawContent.match(/(?:Conclusion|Final\s*Recommendation|Final\s*Verdict|Strategic\s*Takeaway|Bottom\s*Line|Verdict\s*final|خلاصة|توصية\s*نهائية):\s*([\s\S]*?)$/i);
  if (conclusionMatch && conclusionMatch[1]) {
    conclusion = conclusionMatch[1].trim();
  }

  // 11. Parse General Structured Sections & Hooks
  let currentSectionTitle = '';
  let currentSectionType: ExtractedSection['type'] = 'general';
  let currentParagraphs: string[] = [];
  let currentBullets: string[] = [];
  let currentKeyPairs: { key: string; val: string }[] = [];
  let currentHooks: ExtractedHookItem[] = [];

  const commitSection = () => {
    if (currentSectionTitle && (currentParagraphs.length > 0 || currentBullets.length > 0 || currentKeyPairs.length > 0 || currentHooks.length > 0)) {
      const t = currentSectionTitle.toLowerCase();
      if (
        t.includes('hook') ||
        t.includes('accroche') ||
        t.includes('creative') ||
        t.includes('video') ||
        t.includes('script') ||
        t.includes('angle') ||
        t.includes('هوك') ||
        t.includes('خطاف') ||
        t.includes('إعلان')
      ) {
        currentSectionType = 'hooks';
      } else if (
        t.includes('market') ||
        t.includes('marché') ||
        t.includes('demand') ||
        t.includes('competition') ||
        t.includes('audience') ||
        t.includes('سوق') ||
        t.includes('السوق')
      ) {
        currentSectionType = 'market';
      } else if (
        t.includes('logistics') ||
        t.includes('logistique') ||
        t.includes('shipping') ||
        t.includes('cod') ||
        t.includes('delivery') ||
        t.includes('wilaya') ||
        t.includes('لوجستيك') ||
        t.includes('توصيل') ||
        t.includes('شحن')
      ) {
        currentSectionType = 'logistics';
      } else if (
        t.includes('strategy') ||
        t.includes('stratégie') ||
        t.includes('funnel') ||
        t.includes('adset') ||
        t.includes('scale') ||
        t.includes('استراتيجية')
      ) {
        currentSectionType = 'strategy';
      } else if (
        t.includes('spec') ||
        t.includes('feature') ||
        t.includes('dimension') ||
        t.includes('material') ||
        t.includes('caractéristique') ||
        t.includes('مواصفات')
      ) {
        currentSectionType = 'specs';
      } else if (t.includes('risk') || t.includes('risque') || t.includes('مخاطر')) {
        currentSectionType = 'risk';
      } else {
        currentSectionType = 'general';
      }

      sections.push({
        id: `sec-${sections.length + 1}`,
        title: currentSectionTitle,
        type: currentSectionType,
        paragraphs: [...currentParagraphs],
        bulletPoints: [...currentBullets],
        keyPairs: [...currentKeyPairs],
        hookItems: currentHooks.length > 0 ? [...currentHooks] : undefined,
      });
    }
    currentParagraphs = [];
    currentBullets = [];
    currentKeyPairs = [];
    currentHooks = [];
  };

  const ignoredSectionKeywords = [
    'product name',
    'summary',
    'executive summary',
    'action items',
    'action plan',
    'next steps',
    'conclusion',
    'final verdict',
    'risks',
    // French
    'nom du produit',
    'résumé',
    'resume',
    'plan d\'action',
    'plan d’action',
    'métadonnées',
    // Arabic & Darija
    'اسم المنتج',
    'اسم السلعة',
    'ملخص',
    'ملخص تنفيذي',
    'خطة العمل',
    'خطة الخدمة',
    'تفاصيل العملية',
    'بيانات التنفيذ',
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check for section heading (support Latin, accented, and Arabic characters)
    const headingMatch = line.match(/^(?:###?|####?)\s*(.+)$/) || line.match(/^([A-Z0-9\u0600-\u06FF\s&/\-_'’]+):\s*(.*)$/);

    if (headingMatch) {
      const candidateTitle = (headingMatch[1] || '').replace(/[*_#]/g, '').trim();
      const afterColon = headingMatch[2] ? headingMatch[2].trim() : '';

      const isIgnored = ignoredSectionKeywords.some((k) => candidateTitle.toLowerCase().startsWith(k));
      if (!isIgnored && candidateTitle.length > 2 && candidateTitle.length < 60) {
        commitSection();
        currentSectionTitle = candidateTitle;
        if (afterColon) {
          currentParagraphs.push(afterColon);
        }
        continue;
      }
    }

    // Check if within Hooks section and line starts with a numbered hook
    const isInsideHooks =
      currentSectionTitle.toLowerCase().includes('hook') ||
      currentSectionTitle.toLowerCase().includes('creative') ||
      currentSectionTitle.toLowerCase().includes('accroche') ||
      currentSectionTitle.includes('هوك') ||
      currentSectionTitle.includes('خطاف');
    const hookLineMatch = line.match(/^(\d+)[.)]\s*([^:"'\n]+):\s*["“]?([^"”\n]+)["”]?$/);
    if (isInsideHooks && hookLineMatch) {
      currentHooks.push({
        id: `hook-${currentHooks.length + 1}`,
        title: hookLineMatch[2].trim(),
        body: hookLineMatch[3].trim(),
        badge: hookLineMatch[2].toLowerCase().includes('darija')
          ? 'Darija Viral'
          : hookLineMatch[2].toLowerCase().includes('problem')
            ? 'Problem/Pain'
            : hookLineMatch[2].toLowerCase().includes('cod') || hookLineMatch[2].toLowerCase().includes('trust')
              ? 'COD Guarantee'
              : 'High Engagement',
      });
      continue;
    }

    // Check for bullet point
    if (/^[-*•]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const cleanBullet = line.replace(/^[-*•\d.)]+\s*/, '').trim();

      // Detect bold key with colon:
      // Pattern 1: **Key:** Value or **Key**: Value or *Key:* Value
      // Pattern 2: Key: Value
      let key = '';
      let val = '';

      const boldKeyMatch = cleanBullet.match(/^\*{1,2}([^*:]+)(?::\*{1,2}|\*{1,2}:)\s*(.*)$/);
      if (boldKeyMatch) {
        key = boldKeyMatch[1].trim();
        val = boldKeyMatch[2].trim();
      } else {
        const plainKvMatch = cleanBullet.match(/^([^:]{2,45}):\s*(.*)$/);
        if (plainKvMatch && !plainKvMatch[1].includes('"') && !plainKvMatch[1].includes("'")) {
          key = plainKvMatch[1].replace(/[*_]/g, '').trim();
          val = plainKvMatch[2].trim();
        }
      }

      // Clean val of any leading/trailing stray asterisks
      val = val.replace(/^\s*\*\*\s*/, '').replace(/\s*\*\*\s*$/, '').trim();
      const meaningfulVal = val.replace(/[*_#\-~]/g, '').trim();

      if (key && meaningfulVal.length > 0) {
        currentKeyPairs.push({
          key: key.replace(/[*_]/g, '').trim(),
          val,
        });
      } else if (!key && cleanBullet.replace(/[*_#\-~]/g, '').trim().length > 2) {
        // Only push to regular bullets if it wasn't an empty key without value
        currentBullets.push(cleanBullet.replace(/^\s*\*\*\s*/, '').replace(/\s*\*\*\s*$/, '').trim());
      }
    } else if (!line.startsWith('|') && !line.startsWith('```')) {
      currentParagraphs.push(line);
    }
  }

  commitSection();

  return {
    title,
    subtitle,
    executiveSummary,
    metrics,
    tables,
    prosCons,
    steps,
    checklist,
    sections,
    risksAndCaveats,
    conclusion,
  };
}

/**
 * Text enrichment helper:
 * - Parses Markdown **bold** and __bold__ into strong elements
 * - Strips dangling raw asterisks
 * - Formats currencies and metrics cleanly with elegant typography (no awkward disjointed background pills)
 */
export function EnrichedText({ text, className = '' }: { text: string; className?: string }) {
  if (!text) return null;

  // Clean raw asterisks at beginning/end or lone asterisks
  const cleanText = text
    .replace(/^\s*\*\*\s*/, '')
    .replace(/\s*\*\*\s*$/, '')
    .trim();

  if (!cleanText || cleanText === '**' || cleanText === '*' || cleanText === '-') {
    return null;
  }

  // Tokenize markdown bold **bold** and __bold__
  const boldTokens = cleanText.split(/(\*\*[^*]+\*\*|__[^\_]+__)/g);

  return (
    <span className={className}>
      {boldTokens.map((token, bIdx) => {
        if (!token) return null;

        // Is it bold?
        if ((token.startsWith('**') && token.endsWith('**')) || (token.startsWith('__') && token.endsWith('__'))) {
          const innerBold = token.slice(2, -2).trim();
          return (
            <strong key={bIdx} className="font-bold text-slate-900 inline">
              {renderFormattedInner(innerBold)}
            </strong>
          );
        }

        // Clean any stray asterisks that were not part of a valid pair
        const regularChunk = token.replace(/\*\*/g, '');
        return <React.Fragment key={bIdx}>{renderFormattedInner(regularChunk)}</React.Fragment>;
      })}
    </span>
  );
}

function renderFormattedInner(text: string) {
  if (!text) return null;

  // Split on quotes or metrics to apply subtle, clean accents (WITHOUT disruptive background blocks)
  // CRITICAL: Quoted phrases must be short (< 80 chars), single-line, and never contain table pipes '|' or headers '#'
  const parts = text.split(/(["“][^"”\n\r|#]{1,80}["”]|(?:\+|-)?\d+(?:[\d,.]*)?\s*(?:DZD|DA|USD|\$|EUR|€|%|Wilayas?|ROAS|x\b))/g);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Genuine inline quoted phrase: elegant highlight (strictly < 80 chars, no newlines, no tables)
    if (
      part.length <= 80 &&
      !part.includes('\n') &&
      !part.includes('|') &&
      !part.includes('#') &&
      ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith('“') && part.endsWith('”')))
    ) {
      return (
        <span
          key={idx}
          className="font-semibold text-purple-900 bg-purple-50/80 px-1 py-0.5 rounded text-[11.5px] italic border border-purple-100"
        >
          {part}
        </span>
      );
    }

    // Currency (DZD, USD, EUR, etc.) - clean font-mono styling, subtle text color, NO bulky background box
    if (/(?:DZD|DA|USD|\$|EUR|€)/i.test(part)) {
      return (
        <span key={idx} className="font-bold font-mono text-emerald-700">
          {part}
        </span>
      );
    }

    // Percentage (%) - clean font-mono
    if (/%/.test(part)) {
      return (
        <span key={idx} className="font-bold font-mono text-indigo-700">
          {part}
        </span>
      );
    }

    // Wilayas
    if (/Wilayas?/i.test(part)) {
      return (
        <span key={idx} className="font-semibold text-sky-800">
          {part}
        </span>
      );
    }

    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

/**
 * Renders table cell contents with status badges (🟢, 🟡, 🔴, 🟩, 🟨, ✅), priority pills, currency, and typography
 */
export function StatusAwareTableCell({ text }: { text: string }) {
  if (!text) return <span className="text-slate-300">—</span>;
  const trimmed = text.trim();

  // 1. Single status emojis / badges
  if (trimmed === '🟢' || trimmed === '🟩') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span>Optimal 🟢</span>
      </span>
    );
  }
  if (trimmed === '🟡' || trimmed === '🟨') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <span>Watch 🟡</span>
      </span>
    );
  }
  if (trimmed === '🔴' || trimmed === '🟥') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold font-mono bg-rose-50 text-rose-800 border border-rose-200/80 shadow-2xs">
        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
        <span>Alert 🔴</span>
      </span>
    );
  }
  if (trimmed === '✅') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>Active</span>
      </span>
    );
  }

  // 2. Priority badges (P1, P2, P3, High, Medium, Low)
  if (/^P[123]$/i.test(trimmed)) {
    const isP1 = trimmed.toUpperCase() === 'P1';
    const isP2 = trimmed.toUpperCase() === 'P2';
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${isP1
          ? 'bg-rose-100 text-rose-800 border border-rose-300'
          : isP2
            ? 'bg-amber-100 text-amber-800 border border-amber-300'
            : 'bg-blue-100 text-blue-800 border border-blue-300'
          }`}
      >
        {trimmed.toUpperCase()}
      </span>
    );
  }

  return <EnrichedText text={text} />;
}

/**
 * Renders ASCII flowcharts and hierarchical trees with syntax highlighting for branch lines & nodes
 */
export function renderDiagramTree(diagramText: string): React.ReactNode {
  const lines = diagramText.split(/\r?\n/);

  return lines.map((line, idx) => {
    // Check if line contains tree branch characters or arrows
    if (/[├└│─→⇒▼▲]/.test(line)) {
      // Tokenize branch symbols vs content
      const parts = line.split(/([├└│─]+|→|=>|->)/g);
      return (
        <div key={idx} className="leading-relaxed font-mono">
          {parts.map((p, pIdx) => {
            if (/[├└│─]/.test(p)) {
              return (
                <span key={pIdx} className="text-cyan-400 font-bold select-none">
                  {p}
                </span>
              );
            }
            if (/→|=>|->/.test(p)) {
              return (
                <span key={pIdx} className="text-amber-400 font-bold px-1 select-none">
                  {p}
                </span>
              );
            }
            // Check for DZD or numbers
            if (/(?:DZD|DA|USD|\$|EUR|€|%)/i.test(p)) {
              return (
                <span key={pIdx} className="text-emerald-300 font-bold">
                  {p}
                </span>
              );
            }
            return (
              <span key={pIdx} className="text-slate-100 font-medium">
                {p}
              </span>
            );
          })}
        </div>
      );
    }

    // Step lines like: Step 1: Ad Impressions
    if (/^Step\s*\d+:/i.test(line.trim())) {
      const match = line.match(/^(Step\s*\d+:)(.*)$/i);
      if (match) {
        return (
          <div key={idx} className="leading-relaxed font-mono flex items-center gap-1.5 py-0.5">
            <span className="text-amber-300 font-black">{match[1]}</span>
            <span className="text-slate-200">{match[2]}</span>
          </div>
        );
      }
    }

    return (
      <div key={idx} className="leading-relaxed font-mono text-slate-200">
        {line || '\u00A0'}
      </div>
    );
  });
}

export interface MarkdownBlock {
  type: 'heading' | 'table' | 'code' | 'list' | 'blockquote' | 'paragraph';
  level?: number;
  text?: string;
  code?: string;
  language?: string;
  isDiagram?: boolean;
  headers?: string[];
  rows?: string[][];
  title?: string;
  items?: string[];
  ordered?: boolean;
}

export function parseMarkdownToBlocks(content: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = [];
  const lines = content.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Code Block (``` ... ```)
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }
      const code = codeLines.join('\n');
      const isDiagram =
        /[├└│─→⇒▼▲]/.test(code) ||
        /Step\s*\d+:/i.test(code) ||
        /USP|Funnel|Workflow|Flow/i.test(code);
      blocks.push({
        type: 'code',
        code,
        language,
        isDiagram,
      });
      continue;
    }

    // 2. Heading (#, ##, ###, ####)
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        blocks.push({
          type: 'heading',
          level: match[1].length,
          text: match[2].trim(),
        });
        i++;
        continue;
      }
    }

    // 3. Blockquote (> ...)
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      blocks.push({
        type: 'blockquote',
        text: quoteLines.join(' '),
      });
      continue;
    }

    // 4. Markdown Table (Line contains |)
    if (trimmed.includes('|') && (trimmed.startsWith('|') || trimmed.endsWith('|') || trimmed.split('|').length >= 3)) {
      // Check if previous block was heading
      let tableTitle: string | undefined = undefined;
      if (blocks.length > 0 && blocks[blocks.length - 1].type === 'heading') {
        const lastHeading = blocks[blocks.length - 1];
        if (lastHeading.text && !lastHeading.text.toLowerCase().includes('summary') && !lastHeading.text.toLowerCase().includes('executive')) {
          tableTitle = lastHeading.text;
        }
      }

      const tableLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim().length > 0 &&
        lines[i].includes('|')
      ) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 1) {
        const parsedRows = tableLines.map(parseMarkdownTableRow);
        const isDelimiter = (l: string) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?$/.test(l.trim());
        const delimIdx = tableLines.findIndex(isDelimiter);

        let headers: string[] = [];
        let dataRows: string[][] = [];

        if (delimIdx > 0) {
          headers = parsedRows[delimIdx - 1];
          dataRows = parsedRows.filter((_, idx) => idx !== delimIdx && idx !== delimIdx - 1);
        } else if (parsedRows.length > 1) {
          headers = parsedRows[0];
          dataRows = parsedRows.slice(1);
        } else {
          headers = parsedRows[0];
          dataRows = [];
        }

        headers = headers.map((h) => h.replace(/[*_]/g, '').trim());
        const colCount = Math.max(headers.length, ...dataRows.map((r) => r.length));

        while (headers.length < colCount) {
          headers.push(`Column ${headers.length + 1}`);
        }

        dataRows = dataRows.map((row) => {
          const padded = [...row];
          while (padded.length < colCount) {
            padded.push('');
          }
          return padded.slice(0, colCount);
        });

        blocks.push({
          type: 'table',
          headers,
          rows: dataRows,
          title: tableTitle,
        });
        continue;
      }
    }

    // 5. Lists (unordered - / * or ordered 1. / 2.)
    const isUnordered = /^[-*•]\s+/.test(trimmed);
    const isOrdered = /^\d+[.)]\s+/.test(trimmed);
    if (isUnordered || isOrdered) {
      const items: string[] = [];
      const ordered = isOrdered;
      while (
        i < lines.length &&
        lines[i].trim() &&
        (/^[-*•]\s+/.test(lines[i].trim()) || /^\d+[.)]\s+/.test(lines[i].trim()))
      ) {
        const itemText = lines[i].trim().replace(/^([-*•]|\d+[.)])\s+/, '');
        items.push(itemText);
        i++;
      }
      blocks.push({
        type: 'list',
        items,
        ordered,
      });
      continue;
    }

    // 6. Regular Paragraph
    blocks.push({
      type: 'paragraph',
      text: trimmed,
    });
    i++;
  }

  return blocks;
}

/**
 * Comprehensive Document Markdown Renderer for Editorial Long-Form Reading
 * Formats Markdown Tables, ASCII Flowcharts/Trees, Headings, Lists, Callouts, and Bold/Code seamlessly
 */
export const MarkdownDocumentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const blocks = useMemo(() => {
    return parseMarkdownToBlocks(content);
  }, [content]);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800 leading-relaxed">
      {blocks.map((block, idx) => {
        if (block.type === 'heading') {
          const level = block.level || 1;
          return (
            <div
              key={idx}
              className={`pt-3 pb-1 border-b ${level === 1
                ? 'border-slate-300'
                : level === 2
                  ? 'border-slate-200'
                  : 'border-slate-100'
                }`}
            >
              {level === 1 ? (
                <h2 className="text-[24px] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.3] my-2">
                  <EnrichedText text={block.text || ''} />
                </h2>
              ) : level === 2 ? (
                <h3 className="text-[20px] font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.4] flex items-center gap-2 my-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <EnrichedText text={block.text || ''} />
                </h3>
              ) : level === 3 ? (
                <div className="flex items-center gap-2 my-1.5">
                  <span className="w-2 h-2 rounded-sm bg-indigo-600 rotate-45 shrink-0" />
                  <h4 className="text-[17px] font-semibold text-slate-900 dark:text-white tracking-wide leading-[1.4]">
                    <EnrichedText text={block.text || ''} />
                  </h4>
                </div>
              ) : (
                <h5 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 tracking-wider leading-[1.5] my-1">
                  <EnrichedText text={block.text || ''} />
                </h5>
              )}
            </div>
          );
        }

        if (block.type === 'table') {
          const headers = block.headers || [];
          const rows = block.rows || [];
          return (
            <div key={idx} className="my-5 overflow-hidden rounded-xl border border-slate-200/90 dark:border-zinc-700 shadow-2xs bg-white dark:bg-zinc-900">
              {block.title && (
                <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4 text-emerald-600" />
                    <span className="text-[13px] font-bold text-slate-800 dark:text-white font-mono uppercase">
                      {block.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">
                    {rows.length} {rows.length === 1 ? 'row' : 'rows'}
                  </span>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800 border-b border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-white">
                      {headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-4 py-3 text-[12.5px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-200 whitespace-nowrap"
                        >
                          <EnrichedText text={h} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                    {rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className={
                          rIdx % 2 === 0
                            ? 'bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors'
                            : 'bg-slate-50/50 dark:bg-zinc-900/60 hover:bg-slate-50 dark:hover:bg-zinc-800/60 transition-colors'
                        }
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="px-4 py-3 text-slate-800 dark:text-zinc-200 text-[13.5px] font-normal leading-[1.5] align-middle"
                          >
                            <StatusAwareTableCell text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        if (block.type === 'code') {
          const code = block.code || '';
          const isCopied = copiedCodeIdx === idx;
          return (
            <div key={idx} className="my-5 rounded-xl bg-[#141414] border border-white/10 shadow-md overflow-hidden">
              <div className="px-4 py-2 bg-[#1E1E1E] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[12px] font-mono font-bold text-slate-300 ml-1.5">
                    {block.isDiagram
                      ? 'Execution Architecture & Hierarchy Flow'
                      : block.language
                        ? `${block.language.toUpperCase()} Snippet`
                        : 'Diagram / Code Block'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(code, idx)}
                  className="text-[11px] font-mono font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded-lg border border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-4 font-mono text-[13px] text-emerald-400 leading-[1.6] overflow-x-auto whitespace-pre selection:bg-emerald-900 selection:text-white">
                {renderDiagramTree(code)}
              </div>
            </div>
          );
        }

        if (block.type === 'list') {
          const items = block.items || [];
          const ordered = block.ordered || false;
          return (
            <ul key={idx} className="my-3 space-y-2 pl-5 list-disc text-[15px] leading-[1.65] text-slate-800 dark:text-zinc-200">
              {items.map((item, iIdx) => (
                <li key={iIdx} className="leading-[1.65]">
                  <EnrichedText text={item} />
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <div
              key={idx}
              className="my-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border-l-4 border-emerald-500 text-[15px] text-slate-800 dark:text-zinc-300 italic leading-[1.7] shadow-2xs"
            >
              <EnrichedText text={block.text || ''} />
            </div>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="text-[15px] font-normal leading-[1.7] text-slate-800 dark:text-zinc-200 mb-[14px]">
            <EnrichedText text={block.text || ''} />
          </p>
        );
      })}
    </div>
  );
};

export const UniversalContentEngine: React.FC<UniversalContentEngineProps> = ({
  content,
  skillTitle = 'Research & Analysis',
  productTitle,
  category,
  language = 'English',
  webResearchUsed = false,
  executedAt,
  isSimulated = false,
  activeTab: controlledActiveTab,
  onTabChange,
  direction: controlledDirection,
  onDirectionToggle,
  placement = 'bottom',
  onPlacementToggle,
  promptText,
  className = '',
  maxHeight = 'max-h-[580px]',
  textStyle,
  onTextStyleChange,
  onOpenSettings,
  skillIconBg,
  skillIconColor,
  skillColor,
  isExpanded: controlledIsExpanded,
  onToggleExpand,
  customWidth,
  customHeight,
}) => {
  // Theme color dynamically synced from the parent skill card!
  const skillTheme = useMemo(
    () => getSkillTheme(skillColor || skillIconBg, category),
    [skillColor, skillIconBg, category]
  );

  const engineId = useMemo(
    () => (skillTitle || 'skill').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() + '_' + Math.random().toString(36).substring(2, 7),
    [skillTitle]
  );

  // Local state fallbacks if not controlled from parent
  const [localTab, setLocalTab] = useState<'chatgpt' | 'preview' | 'workflow' | 'analytics' | 'doc' | 'prompt' | 'json'>(
    skillTitle === 'Text to Workflow' ? 'workflow' : 'chatgpt'
  );
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : localTab;
  const setActiveTab = onTabChange || setLocalTab;

  const isRtlLanguage = language === 'Arabic' || language === 'Algerian Darja';
  const [localDirection, setLocalDirection] = useState<'ltr' | 'rtl'>(() => (isRtlLanguage ? 'rtl' : 'ltr'));
  useEffect(() => {
    if (controlledDirection === undefined) {
      setLocalDirection(isRtlLanguage ? 'rtl' : 'ltr');
    }
  }, [language, isRtlLanguage, controlledDirection]);
  const direction = controlledDirection !== undefined ? controlledDirection : localDirection;
  const toggleDirection = onDirectionToggle || (() => setLocalDirection((d) => (d === 'rtl' ? 'ltr' : 'rtl')));

  // Text Scaling & Typography controls (Taille et Style du texte)
  const [localFontSizeScale, setLocalFontSizeScale] = useState<number>(() => {
    const saved = localStorage.getItem('universal_text_scale');
    return saved ? parseInt(saved, 10) : 125;
  });
  const [isTextMenuOpen, setIsTextMenuOpen] = useState(false);

  const effectiveScale = textStyle?.fontSizeScale || localFontSizeScale;
  const effectiveWeight = textStyle?.fontWeight || 'normal';
  const effectiveLineHeight = textStyle?.lineHeight || 'normal';
  const effectiveFont = textStyle?.fontFamily || 'sans';
  const effectiveTheme = textStyle?.colorTheme || 'default';

  const handleUpdateScale = (newScale: number) => {
    setLocalFontSizeScale(newScale);
    localStorage.setItem('universal_text_scale', String(newScale));
    onTextStyleChange?.({
      ...textStyle,
      fontSizeScale: newScale,
    });
  };

  // In-place expanded state: previews in the SAME place down below the card without popping out!
  const [localExpanded, setLocalExpanded] = useState(false);
  const isExpandedDown = controlledIsExpanded !== undefined ? controlledIsExpanded : localExpanded;

  const handleToggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setLocalExpanded((prev) => !prev);
    }
  };

  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Parse structured data from raw content
  const parsedData = useMemo(() => {
    return analyzeContent(content, skillTitle, productTitle);
  }, [content, skillTitle, productTitle]);

  // Copy full content
  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }, [content]);

  // Copy individual hook
  const handleCopyHook = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHookId(id);
    setTimeout(() => setCopiedHookId(null), 1500);
  };

  // Toggle checklist task
  const handleToggleTask = (id: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle section collapse
  const handleToggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? true : !prev[id],
    }));
  };

  // Section theme & icon resolver with vivid domain colors
  const getSectionTheme = (type: ExtractedSection['type']) => {
    switch (type) {
      case 'hooks':
        return {
          icon: <Sparkles className="w-4 h-4 text-purple-600" />,
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
          headerBg: 'bg-gradient-to-r from-purple-50/90 via-fuchsia-50/50 to-white',
          accentBorder: 'border-purple-200',
        };
      case 'market':
        return {
          icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          headerBg: 'bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white',
          accentBorder: 'border-emerald-200',
        };
      case 'logistics':
        return {
          icon: <Truck className="w-4 h-4 text-sky-600" />,
          badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
          headerBg: 'bg-gradient-to-r from-sky-50/90 via-blue-50/50 to-white',
          accentBorder: 'border-sky-200',
        };
      case 'strategy':
        return {
          icon: <Target className="w-4 h-4 text-indigo-600" />,
          badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          headerBg: 'bg-gradient-to-r from-indigo-50/90 via-blue-50/50 to-white',
          accentBorder: 'border-indigo-200',
        };
      case 'specs':
        return {
          icon: <Layers className="w-4 h-4 text-slate-700" />,
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
          headerBg: 'bg-gradient-to-r from-slate-50 via-slate-100/50 to-white',
          accentBorder: 'border-slate-200',
        };
      case 'risk':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          headerBg: 'bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-white',
          accentBorder: 'border-amber-200',
        };
      default:
        return {
          icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          headerBg: 'bg-gradient-to-r from-slate-50 to-white',
          accentBorder: 'border-slate-200',
        };
    }
  };

  // Metric card color theme styles
  const getMetricCardStyles = (theme?: ExtractedMetric['colorTheme']) => {
    switch (theme) {
      case 'emerald':
        return {
          container: 'bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-white border-emerald-200/90 text-emerald-950',
          label: 'text-emerald-700',
          value: 'text-emerald-700',
          icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'amber':
        return {
          container: 'bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white border-amber-200/90 text-amber-950',
          label: 'text-amber-700',
          value: 'text-amber-800',
          icon: <Tag className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'purple':
        return {
          container: 'bg-gradient-to-br from-purple-50/90 via-fuchsia-50/50 to-white border-purple-200/90 text-purple-950',
          label: 'text-purple-700',
          value: 'text-purple-700',
          icon: <Percent className="w-3.5 h-3.5 text-purple-600" />,
        };
      case 'cyan':
        return {
          container: 'bg-gradient-to-br from-cyan-50/90 via-sky-50/50 to-white border-cyan-200/90 text-cyan-950',
          label: 'text-cyan-800',
          value: 'text-cyan-700',
          icon: <Activity className="w-3.5 h-3.5 text-cyan-600" />,
        };
      case 'rose':
        return {
          container: 'bg-gradient-to-br from-rose-50/90 via-pink-50/50 to-white border-rose-200/90 text-rose-950',
          label: 'text-rose-700',
          value: 'text-rose-700',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
        };
      default:
        return {
          container: 'bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white border-blue-200/90 text-blue-950',
          label: 'text-blue-700',
          value: 'text-blue-700',
          icon: <Zap className="w-3.5 h-3.5 text-blue-600" />,
        };
    }
  };

  return (
    <div
      dir={direction}
      data-no-drag="true"
      data-no-card-drag="true"
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      style={{
        width: customWidth ? `${customWidth}px` : undefined,
        minWidth: customWidth ? `${Math.min(customWidth, 340)}px` : undefined,
      }}
      className={`universal-content-engine flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden text-slate-800 font-sans transition-all select-text cursor-auto ${direction === 'rtl' ? 'text-right' : 'text-left'
        } ${className}`}
    >
      {/* 1. TOP TOOLBAR & CONTROLS */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-slate-50 via-slate-100/80 to-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap shrink-0">
        {/* Left: View Mode Tabs with Colorful Active States */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('chatgpt');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'chatgpt'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xs'
              : 'text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50'
              }`}
            title="ChatGPT View: Rich Conversational Output with Headings, Tables, KPIs & Diagrams"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>ChatGPT View</span>
          </button>

          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('preview');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'preview'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            title="Smart Presentation: Vivid Structured SaaS Layout"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Smart View</span>
          </button>

          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('workflow');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'workflow'
              ? `${skillTheme.tabActiveGradient} text-white shadow-xs`
              : `${skillTheme.tabInactive} shadow-2xs`
              }`}
            title="Workflow Chart: Visual Flowchart for your selected topic"
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Workflow Chart</span>
          </button>

          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('analytics');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'analytics'
              ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            title="Analytics Engine: Tables, Bar Charts, Diagrams, and Color Degradation Circles"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('doc');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'doc'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            title="Clean Document View: Editorial Typography"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Document</span>
          </button>

          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('prompt');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'prompt'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            title="Work Prompt: View Prompt Template"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prompt</span>
          </button>

          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('json');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${activeTab === 'json'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            title="RAW JSON & Metadata"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>

        {/* Right: Actions (Text Size, Settings, Direction, Position, Copy, Fullscreen) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quick Text Size Stepper: A- / 125% / A+ */}
          <div className="relative flex items-center bg-white border border-slate-200/90 rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateScale(Math.max(85, effectiveScale - 10));
              }}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:text-blue-700 hover:bg-slate-100 font-black text-[11px] cursor-pointer"
              title="Réduire taille du texte (A-)"
            >
              A-
            </button>

            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                setIsTextMenuOpen(!isTextMenuOpen);
              }}
              className="px-1.5 py-0.5 text-[10.5px] font-mono font-black text-blue-700 hover:bg-blue-50 rounded cursor-pointer flex items-center gap-0.5"
              title="Taille du texte (cliquez pour choisir un preset)"
            >
              <Type className="w-3 h-3 text-blue-600" />
              <span>{effectiveScale}%</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateScale(Math.min(180, effectiveScale + 10));
              }}
              className="w-6 h-6 flex items-center justify-center rounded text-slate-600 hover:text-blue-700 hover:bg-slate-100 font-black text-[11px] cursor-pointer"
              title="Agrandir taille du texte (A+)"
            >
              A+
            </button>

            {/* Quick Text Size & Style Dropdown */}
            {isTextMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-full mt-1.5 right-0 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 space-y-3 text-xs animate-in fade-in zoom-in-95"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                    Taille & Style du texte
                  </span>
                  <span className="text-[11px] font-mono font-bold text-blue-600">{effectiveScale}%</span>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Presets de taille:</span>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { label: 'S', val: 100, title: 'Compact (100%)' },
                      { label: 'M', val: 115, title: 'Standard (115%)' },
                      { label: 'L', val: 130, title: 'Large (130%)' },
                      { label: 'XL', val: 150, title: 'Extra Large (150%)' },
                      { label: '2XL', val: 170, title: 'Jumbo (170%)' },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => {
                          handleUpdateScale(p.val);
                          setIsTextMenuOpen(false);
                        }}
                        className={`py-1 text-center rounded-lg font-bold text-xs transition-colors cursor-pointer ${effectiveScale === p.val
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        title={p.title}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Ajuster taille (80% - 180%):</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="180"
                    step="5"
                    value={effectiveScale}
                    onChange={(e) => handleUpdateScale(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Open Full Settings Modal */}
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsTextMenuOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ouvrir Paramètres Taille & Style →</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Text Style / Settings Icon Button */}
          {onOpenSettings && (
            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                onOpenSettings();
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
              title="Changer taille & style du texte depuis les paramètres"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline font-semibold">Style</span>
            </button>
          )}

          {/* Direction Switcher (LTR / RTL) */}
          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              toggleDirection();
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-mono font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            title="Toggle Text Direction (LTR / RTL for Arabic & Darija)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>{direction === 'rtl' ? 'RTL' : 'LTR'}</span>
          </button>

          {/* Placement Switcher */}
          {onPlacementToggle && (
            <button
              type="button"
              data-no-drag="true"
              onClick={(e) => {
                e.stopPropagation();
                onPlacementToggle();
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-mono font-bold transition-colors cursor-pointer shadow-2xs"
              title="Switch Placement (Bottom / Right / Left)"
            >
              <span>{placement ? placement.toUpperCase() : 'DOWN'}</span>
            </button>
          )}

          {/* Copy Report */}
          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              handleCopyAll();
            }}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 text-[11px] font-medium transition-all cursor-pointer shadow-2xs flex items-center gap-1"
            title="Copy entire analysis content to clipboard"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Fullscreen Expand / Collapse IN SAME PLACE DOWN */}
          <button
            type="button"
            data-no-drag="true"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleExpand();
            }}
            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs flex items-center gap-1 ${isExpandedDown
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            title={
              isExpandedDown
                ? "Réduire l'aperçu (Mode compact)"
                : 'Agrandir en plein écran en bas (Même place)'
            }
          >
            {isExpandedDown ? (
              <Minimize2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Scoped CSS for Text Scaling, Font Family, Font Weight, and Color Theme */}
      <style>{`
        .engine-content-${engineId} {
          zoom: ${effectiveScale}%;
        }
        .engine-content-${engineId},
        .engine-content-${engineId} * {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        .engine-content-${engineId} p,
        .engine-content-${engineId} span:not([class*="lucide"]),
        .engine-content-${engineId} li,
        .engine-content-${engineId} td,
        .engine-content-${engineId} th,
        .engine-content-${engineId} h1,
        .engine-content-${engineId} h2,
        .engine-content-${engineId} h3,
        .engine-content-${engineId} h4,
        .engine-content-${engineId} h5 {
          font-family: ${effectiveFont === 'serif'
          ? 'Merriweather, Georgia, Cambria, "Times New Roman", serif !important'
          : effectiveFont === 'mono'
            ? '"JetBrains Mono", Menlo, Consolas, monospace !important'
            : '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif'
        };
          ${effectiveWeight === 'bold' ? 'font-weight: 700 !important;' : effectiveWeight === 'semibold' ? 'font-weight: 600 !important;' : effectiveWeight === 'medium' ? 'font-weight: 500 !important;' : ''}
          line-height: ${effectiveLineHeight === 'relaxed' ? '1.85 !important' : effectiveLineHeight === 'tight' ? '1.35 !important' : '1.6'};
        }
        ${effectiveTheme === 'contrast' ? `
          .engine-content-${engineId} {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .engine-content-${engineId} p,
          .engine-content-${engineId} span,
          .engine-content-${engineId} h1,
          .engine-content-${engineId} h2,
          .engine-content-${engineId} h3,
          .engine-content-${engineId} h4 {
            color: #000000 !important;
          }
          .engine-content-${engineId} [class*="border"] {
            border-color: #000000 !important;
          }
        ` : ''}
        ${effectiveTheme === 'emerald' ? `
          .engine-content-${engineId} {
            border-color: #10b981 !important;
          }
        ` : ''}
        ${effectiveTheme === 'purple' ? `
          .engine-content-${engineId} {
            border-color: #a855f7 !important;
          }
        ` : ''}
        ${effectiveTheme === 'amber' ? `
          .engine-content-${engineId} {
            border-color: #f59e0b !important;
          }
        ` : ''}
      `}</style>

      {/* 2. BODY CONTENT AREA with Dynamic Font Scaling & Typography - PREVIEWS IN SAME PLACE DOWN */}
      <div
        data-no-drag="true"
        data-no-card-drag="true"
        data-scrollable="true"
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className={`engine-content-${engineId} p-4 overflow-y-auto overscroll-contain space-y-4 transition-all duration-200 select-text cursor-auto ${customHeight
            ? ''
            : isExpandedDown
              ? 'max-h-[850px] min-h-[460px] bg-white'
              : maxHeight || 'max-h-[500px]'
          } ${effectiveTheme === 'emerald'
            ? 'border-emerald-300 ring-1 ring-emerald-400/30'
            : effectiveTheme === 'purple'
              ? 'border-purple-300 ring-1 ring-purple-400/30'
              : effectiveTheme === 'amber'
                ? 'border-amber-300 ring-1 ring-amber-400/30'
                : effectiveTheme === 'contrast'
                  ? 'border-2 border-black'
                  : ''
          }`}
        style={{
          height: customHeight ? `${customHeight}px` : undefined,
          maxHeight: customHeight ? `${customHeight}px` : undefined,
          minHeight: customHeight ? `${Math.min(customHeight, 220)}px` : undefined,
          lineHeight: effectiveLineHeight === 'relaxed' ? 1.85 : effectiveLineHeight === 'tight' ? 1.4 : 1.65,
          fontFamily: effectiveFont === 'serif' ? 'Georgia, Cambria, serif' : effectiveFont === 'mono' ? 'JetBrains Mono, monospace' : undefined,
          fontWeight: effectiveWeight === 'bold' ? 700 : effectiveWeight === 'semibold' ? 600 : effectiveWeight === 'medium' ? 500 : 400,
        }}
      >
        {/* In-place Expanded indicator header banner (stays in same place down, no popup overlay!) */}
        {isExpandedDown && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-950 text-xs mb-3 shadow-2xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[11px] text-emerald-900">
                Aperçu Développé en Place (En Bas)
              </span>
              <span className="text-[10px] text-emerald-700 font-mono hidden sm:inline">
                • Reste à la même place en bas de la carte
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleExpand}
              className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            >
              <Minimize2 className="w-3 h-3 text-emerald-600" />
              <span>Réduire</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 0: CHATGPT UNIVERSAL PREVIEW (Authentic Conversational & Inter Typography System)
           ========================================================================= */}
        {activeTab === 'chatgpt' && (() => {
          const lower = `${content} ${skillTitle || ''} ${category || ''}`.toLowerCase();
          const titleLower = (skillTitle || '').toLowerCase();

          // Strict detection: ONLY inject specialized widgets when explicitly relevant to the skill purpose
          const isCampaignOrMetrics = (titleLower.includes('campaign') || titleLower.includes('traffic') || titleLower.includes('performance') || titleLower.includes('ad spend') || titleLower.includes('roas') || titleLower.includes('analytics')) && !!(parsedData.metrics && parsedData.metrics.length >= 2);

          const isPricingCalculator = (titleLower.includes('pricing') || titleLower.includes('profitability') || titleLower.includes('unit economic') || titleLower.includes('landed cost') || titleLower.includes('margin calculator')) || (lower.includes('profitability calculator') && lower.includes('selling price'));

          const isActionRecommendations = (titleLower.includes('recommendation') || titleLower.includes('action plan') || titleLower.includes('optimization directive')) && !!((parsedData.steps && parsedData.steps.length > 0) || (parsedData.checklist && parsedData.checklist.length > 0));

          const wordCount = content.trim().length > 0 ? content.trim().split(/\s+/).filter(Boolean).length : 0;
          const readTimeMinutes = Math.max(1, Math.round(wordCount / 200));

          return (
            <div className="w-full bg-white dark:bg-[#18181b] p-4 sm:p-7 animate-in fade-in select-text cursor-auto min-h-[300px]">
              <div className="w-full max-w-full mx-auto space-y-6 font-sans">
                {/* 1. Conversational Document Header (OpenAI / ChatGPT style) */}
                <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/10 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {skillTitle || 'Assistant response'}
                        </span>
                        <StatusBadge variant="green" dot>
                          Analysis completed
                        </StatusBadge>
                        {category && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                            {category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-no-drag="true"
                      onClick={handleCopyAll}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{copiedAll ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. KPI Dashboard Card (ONLY when genuinely campaign/traffic analytics) */}
                {isCampaignOrMetrics && parsedData.metrics && parsedData.metrics.length > 0 && (
                  <div className="space-y-2">
                    <KPIRenderer
                      title={`${skillTitle || 'Campaign'} Performance Dashboard`}
                      timeframe="Last 7 Days"
                      statusBadge="Active campaign"
                      metrics={parsedData.metrics.slice(0, 4).map((m) => ({
                        label: m.label,
                        value: m.value,
                        subValue: m.badge || 'Illustrative metric',
                        badge: m.trend === 'up' ? 'Positive' : m.trend === 'down' ? 'Needs review' : (m.badge || 'On target'),
                        badgeCategory: m.colorTheme === 'emerald' ? 'success' : 'neutral',
                      }))}
                    />
                  </div>
                )}

                {/* 3. Main Conversational Document (Natural Markdown Document with Inter Scale) */}
                <div className="text-slate-900 dark:text-[#ECECEC] leading-relaxed">
                  <ChatGPTMarkdownDocumentRenderer content={content} />
                </div>

                {/* 4. Interactive Profitability Calculator (ONLY when explicitly unit economics / pricing calculation) */}
                {isPricingCalculator && (
                  <InteractiveProfitabilityCalculator
                    title="Product Profitability & Unit Economics Calculator"
                    initialSellingPrice={
                      parsedData.metrics.find((m) => m.label.toLowerCase().includes('selling') || m.label.toLowerCase().includes('price'))?.value
                        ? Number(parsedData.metrics.find((m) => m.label.toLowerCase().includes('selling') || m.label.toLowerCase().includes('price'))?.value.replace(/[^0-9]/g, '')) || 2500
                        : 2500
                    }
                    initialProductCost={
                      parsedData.metrics.find((m) => m.label.toLowerCase().includes('cost'))?.value
                        ? Number(parsedData.metrics.find((m) => m.label.toLowerCase().includes('cost'))?.value.replace(/[^0-9]/g, '')) || 850
                        : 850
                    }
                    initialDeliveryCost={500}
                    currency="DZD"
                  />
                )}

                {/* 5. Actionable AI Recommendations (ONLY when explicitly recommendations/action plan) */}
                {isActionRecommendations && (
                  <ActionableRecommendationsCard
                    title="Actionable AI Recommendations"
                    items={
                      parsedData.steps && parsedData.steps.length > 0
                        ? parsedData.steps.map((s, i) => ({
                          id: `step-${s.number || i}`,
                          number: s.number || i + 1,
                          title: s.title || 'Strategic Recommendation',
                          description: s.description || '',
                          priority: s.badge || (i === 0 ? 'High priority' : 'Medium'),
                          expectedImpact: 'Better performance & profitability',
                          actionLabel: 'Recommended action',
                        }))
                        : parsedData.checklist.map((c, i) => ({
                          id: c.id || `chk-${i}`,
                          number: i + 1,
                          title: c.category || 'Recommended Action',
                          description: c.text,
                          priority: c.priority === 'high' ? 'High priority' : 'Medium',
                          expectedImpact: 'Optimization target',
                          actionLabel: 'Recommended action',
                        }))
                    }
                  />
                )}

                {/* 6. Authentic ChatGPT Conversation Actions Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      data-no-drag="true"
                      onClick={handleCopyAll}
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      data-no-drag="true"
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                      title="Good response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      data-no-drag="true"
                      className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                      title="Bad response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{readTimeMinutes} min read</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* =========================================================================
            TAB 1: SMART PRESENTATION (Vivid Color & Stylish Typography)
           ========================================================================= */}
        {activeTab === 'preview' && (
          <div className="space-y-4 animate-in fade-in">
            {/* 1. Header Banner with Rich Gradient Accent */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md border border-indigo-950/60 relative overflow-hidden">
              {/* Subtle decorative glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9.5px] font-mono font-black uppercase tracking-wider shadow-2xs">
                      INTELLIGENCE BRIEF
                    </span>
                    {webResearchUsed && (
                      <span className="inline-flex items-center gap-1 text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-md border border-cyan-700/50 text-[10px] font-bold font-mono">
                        <Compass className="w-3 h-3 text-cyan-400" />
                        Live Web Verified
                      </span>
                    )}
                    {language && (
                      <span className="text-slate-300 text-[10.5px] font-mono bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                        {language}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight mt-1">
                    {skillTitle && (parsedData.title.toLowerCase().includes('summary') || parsedData.title.toLowerCase().includes('strategic intelligence') || !parsedData.title)
                      ? (productTitle && !skillTitle.toLowerCase().includes(productTitle.toLowerCase()) ? `${skillTitle} — ${productTitle}` : skillTitle)
                      : parsedData.title || skillTitle || 'Intelligence Report'}
                  </h3>

                  <p className="text-xs text-indigo-200/90 leading-normal font-medium">
                    {parsedData.subtitle && !parsedData.subtitle.toLowerCase().includes('analysis report') && !parsedData.subtitle.toLowerCase().includes('generated research')
                      ? parsedData.subtitle
                      : category
                        ? `${category} • E-commerce Intelligence`
                        : 'AI Intelligence'}
                  </p>
                </div>

                {executedAt && (
                  <span className="text-indigo-200/70 font-mono text-[10px] shrink-0 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                    {executedAt}
                  </span>
                )}
              </div>
            </div>

            {/* 2. Executive Summary Card with Indigo Gradient & Highlighted Text */}
            {parsedData.executiveSummary && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-blue-50/40 to-white border border-indigo-200/90 shadow-xs space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-indigo-900 text-xs font-black uppercase tracking-wider font-mono">
                    <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span>EXECUTIVE SUMMARY & CORE FINDINGS</span>
                  </div>

                  <button
                    type="button"
                    data-no-drag="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('workflow');
                    }}
                    className="text-[10.5px] font-bold font-mono text-amber-800 bg-amber-100/90 hover:bg-amber-200 hover:text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs hover:scale-[1.02]"
                    title="Change this result card to a visual Campaign -> Ad Sets -> Ads workflow chart"
                  >
                    <GitFork className="w-3 h-3 text-amber-600" />
                    <span>⚡ Convert to Workflow Chart</span>
                  </button>
                </div>
                <div className="text-xs text-slate-800 leading-relaxed font-normal pt-1">
                  <EnrichedText text={parsedData.executiveSummary} />
                </div>
              </div>
            )}

            {/* 3. KPI & Commercial Metrics Grid with Vivid Color Themes */}
            {parsedData.metrics.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Key Metrics & Unit Economics</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {parsedData.metrics.length} metrics identified
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {parsedData.metrics.map((m, idx) => {
                    const style = getMetricCardStyles(m.colorTheme);
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border shadow-2xs hover:shadow-md transition-all space-y-1 ${style.container}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-bold uppercase tracking-wider truncate font-mono ${style.label}`}>
                            {m.label}
                          </span>
                          {style.icon}
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className={`text-base sm:text-lg font-black font-mono tracking-tight ${style.value}`}>
                            {m.value}
                          </span>
                          {m.trend === 'up' && (
                            <span className="text-[10.5px] font-black text-emerald-600 font-mono">↑</span>
                          )}
                          {m.trend === 'down' && (
                            <span className="text-[10.5px] font-black text-rose-600 font-mono">↓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Structured Data Matrix (Markdown Tables) */}
            {parsedData.tables.map((tbl, tIdx) => (
              <div key={tIdx} className="space-y-2">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{tbl.title || 'Structured Comparison Matrix'}</span>
                </span>
                <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 via-indigo-50/50 to-slate-100 border-b border-slate-200 text-slate-800 font-black">
                        {tbl.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-3.5 py-2.5 text-[11px] uppercase tracking-wider font-mono">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {tbl.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white hover:bg-blue-50/40 transition-colors' : 'bg-slate-50/60 hover:bg-blue-50/50 transition-colors'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3.5 py-2 text-slate-800 text-xs font-medium">
                              <StatusAwareTableCell text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            {/* 5. Pros & Cons Comparison Matrix with Vibrant Cards */}
            {parsedData.prosCons && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pros Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/30 to-white border border-emerald-200/90 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-xs font-mono">
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>ADVANTAGES & POSITIVE SIGNALS</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {parsedData.prosCons.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed bg-white/70 p-2 rounded-xl border border-emerald-100 shadow-2xs">
                        <span className="text-emerald-600 font-black text-xs mt-0.5 shrink-0">✓</span>
                        <EnrichedText text={p} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50 via-pink-50/30 to-white border border-rose-200/90 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-rose-900 font-black text-xs font-mono">
                    <div className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center shadow-xs">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                    <span>RISKS, UNCERTAINTIES & LIMITS</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-800">
                    {parsedData.prosCons.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed bg-white/70 p-2 rounded-xl border border-rose-100 shadow-2xs">
                        <span className="text-rose-600 font-black text-xs mt-0.5 shrink-0">!</span>
                        <EnrichedText text={c} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 6. Execution Workflow & Roadmap Steps */}
            {parsedData.steps.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Execution Workflow & Roadmap</span>
                </span>
                <div className="space-y-2">
                  {parsedData.steps.map((step) => (
                    <div
                      key={step.number}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-white via-indigo-50/20 to-white border border-slate-200/90 hover:border-indigo-300 transition-all flex items-start gap-3 shadow-2xs hover:shadow-xs"
                    >
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {String(step.number).padStart(2, '0')}
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                        {step.description && (
                          <div className="text-[11.5px] text-slate-600 leading-relaxed pt-0.5">
                            <EnrichedText text={step.description} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Action Plan & Interactive Checklist */}
            {parsedData.checklist.length > 0 && (
              <div className="space-y-2.5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white border border-emerald-200/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-950 font-mono flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <BookmarkCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>Action Plan & Execution Tasks</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-mono font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                    {Object.values(checkedTasks).filter(Boolean).length} / {parsedData.checklist.length} Completed
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {parsedData.checklist.map((task) => {
                    const isChecked = !!checkedTasks[task.id];
                    return (
                      <div
                        key={task.id}
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all cursor-pointer ${isChecked
                          ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950 line-through opacity-75'
                          : 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-300 shadow-2xs hover:shadow-xs'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleTask(task.id)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                        />
                        <span className="flex-1 leading-snug font-medium">
                          <EnrichedText text={task.text} />
                        </span>
                        {task.priority === 'high' && !isChecked && (
                          <span className="text-[9px] font-black text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md border border-rose-200/90 shrink-0 uppercase tracking-wider font-mono">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. Detailed Thematic Analysis Sections */}
            {parsedData.sections.length > 0 && (
              <div className="space-y-3 pt-1">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Detailed Intelligence & Breakdown</span>
                </span>

                <div className="space-y-3">
                  {parsedData.sections.map((sec) => {
                    const isExpanded = expandedSections[sec.id] !== false;
                    const theme = getSectionTheme(sec.type);

                    return (
                      <div
                        key={sec.id}
                        className={`rounded-2xl border ${theme.accentBorder} bg-white overflow-hidden shadow-2xs hover:shadow-xs transition-all`}
                      >
                        {/* Section Header */}
                        <div
                          onClick={() => handleToggleSection(sec.id)}
                          className={`px-4 py-3 ${theme.headerBg} border-b border-slate-100 flex items-center justify-between cursor-pointer transition-colors`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-white shadow-2xs border border-slate-200/60">
                              {theme.icon}
                            </div>
                            <h4 className="text-xs font-black text-slate-900 tracking-tight">{sec.title}</h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md border font-mono ${theme.badgeColor}`}>
                              {sec.type.toUpperCase()}
                            </span>
                            <button
                              type="button"
                              className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                            >
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Section Body */}
                        {isExpanded && (
                          <div className="p-4 space-y-3 text-xs text-slate-800">
                            {/* Hook Items with 1-Click Copy if parsed as hooks */}
                            {sec.hookItems && sec.hookItems.length > 0 && (
                              <div className="space-y-2">
                                {sec.hookItems.map((hook) => (
                                  <div
                                    key={hook.id}
                                    className="p-3 rounded-xl bg-gradient-to-r from-purple-50/70 via-fuchsia-50/30 to-white border border-purple-200/80 shadow-2xs space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <MessageSquareQuote className="w-3.5 h-3.5 text-purple-600" />
                                        <span className="text-[11px] font-bold text-purple-950 font-mono">
                                          {hook.title}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        {hook.badge && (
                                          <span className="text-[9px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200 font-mono">
                                            {hook.badge}
                                          </span>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => handleCopyHook(hook.id, hook.body)}
                                          className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-white px-2 py-0.5 rounded border border-purple-200 hover:bg-purple-50 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                          {copiedHookId === hook.id ? (
                                            <>
                                              <Check className="w-3 h-3 text-emerald-600" />
                                              <span className="text-emerald-700">Copied</span>
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3 h-3" />
                                              <span>Copy Hook</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-900 font-medium leading-relaxed italic bg-white/80 p-2.5 rounded-lg border border-purple-100">
                                      "{hook.body}"
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Standard Paragraphs */}
                            {sec.paragraphs.map((p, idx) => (
                              <p key={idx} className="leading-relaxed text-slate-700 font-normal">
                                <EnrichedText text={p} />
                              </p>
                            ))}

                            {/* Key-Value Pairs & Structured Insights */}
                            {sec.keyPairs.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                {sec.keyPairs.map((kv, idx) => {
                                  const isLong = kv.val.length >= 45 || kv.val.includes('.') || kv.val.includes(';') || kv.val.includes('\n');
                                  return (
                                    <div
                                      key={idx}
                                      className={`p-3 rounded-xl border border-slate-200/90 shadow-2xs transition-all hover:border-slate-300 flex flex-col justify-start ${isLong
                                        ? 'sm:col-span-2 space-y-1.5 bg-gradient-to-r from-slate-50/70 via-white to-slate-50/40'
                                        : 'space-y-1 bg-white hover:bg-slate-50/50'
                                        }`}
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wide font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/80 inline-block">
                                          {kv.key}
                                        </span>
                                      </div>
                                      <div className={`text-slate-800 leading-relaxed ${isLong ? 'text-xs font-normal' : 'text-xs font-semibold'}`}>
                                        <EnrichedText text={kv.val} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Bullet Points */}
                            {sec.bulletPoints.length > 0 && (
                              <ul className="space-y-2 pt-1 text-slate-700">
                                {sec.bulletPoints.map((b, idx) => (
                                  <li key={idx} className="flex items-start gap-2.5 leading-relaxed bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                                    <span>
                                      <EnrichedText text={b} />
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 9. Strategic Conclusion / Final Verdict Card */}
            {parsedData.conclusion && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white space-y-2 shadow-lg border border-indigo-900/60 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider font-mono">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>STRATEGIC VERDICT & NEXT IMMEDIATE ACTION</span>
                  </div>
                  <span className="text-[9.5px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                    Decision Approved
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-normal pt-1">
                  <EnrichedText text={parsedData.conclusion} />
                </p>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB: WORKFLOW CHART VIEW (Campaign -> Line Down -> Ad Set -> Line Down -> Ad)
           ========================================================================= */}
        {activeTab === 'workflow' && (
          <div className="animate-in fade-in py-1">
            <WorkflowChartView
              content={content}
              productTitle={productTitle || parsedData.title}
              skillTitle={skillTitle}
              language={language}
              direction={direction}
              skillColor={skillColor || skillIconBg}
              category={category}
              textStyle={textStyle}
            />
          </div>
        )}

        {/* =========================================================================
            TAB: ANALYTICS VIEW (Tables, Bar Charts, Diagrams, Degradation Circles)
           ========================================================================= */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in py-1">
            <AnalyticsDashboardView
              content={content}
              skillTitle={skillTitle}
              productTitle={productTitle || parsedData.title}
              category={category}
              language={language}
              parsedData={parsedData}
              skillColor={skillColor || skillIconBg}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 2: DOCUMENT VIEW (Editorial Long-Form Reading)
           ========================================================================= */}
        {activeTab === 'doc' && (
          <div className="prose prose-slate max-w-none space-y-4 animate-in fade-in leading-relaxed text-xs sm:text-[13px] text-slate-800">
            <div className="pb-3 border-b border-slate-200">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {parsedData.title}
              </h2>
              {parsedData.subtitle && (
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {parsedData.subtitle}
                </p>
              )}
            </div>

            {parsedData.executiveSummary && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-600 text-slate-900 italic font-medium leading-relaxed">
                <EnrichedText text={parsedData.executiveSummary} />
              </div>
            )}

            {/* Structured Document View with Markdown Tables, ASCII Flowcharts & Trees, Lists, Callouts */}
            <MarkdownDocumentRenderer content={content} />
          </div>
        )}

        {/* =========================================================================
            TAB 3: PROMPT VIEW (Work Prompt & Template)
           ========================================================================= */}
        {activeTab === 'prompt' && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span className="font-bold uppercase tracking-wider text-[10px] font-mono text-purple-700">
                AI Execution Prompt
              </span>
              <button
                type="button"
                onClick={() => {
                  if (promptText) {
                    navigator.clipboard.writeText(promptText);
                  }
                }}
                className="text-[11px] text-purple-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Prompt</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed select-text max-h-[380px] overflow-y-auto">
              {promptText || 'Standard prompt executed.'}
            </pre>
          </div>
        )}

        {/* =========================================================================
            TAB 4: RAW JSON VIEW
           ========================================================================= */}
        {activeTab === 'json' && (
          <div className="space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
              <span className="font-bold uppercase tracking-wider text-[10px] font-mono text-slate-700">
                JSON Data Payload
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2));
                }}
                className="text-[11px] text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>Copy JSON</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 text-[11px] font-mono whitespace-pre-wrap leading-relaxed select-text max-h-[380px] overflow-y-auto">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalContentEngine;
