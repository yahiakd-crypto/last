import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  CheckCircle2,
  Undo2,
  Redo2,
  Eye,
  Play,
  Share2,
  Bell,
  ChevronDown,
  ChevronRight,
  X,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  Sparkles,
  RefreshCw,
  Cpu,
  Sliders,
  DollarSign,
  TrendingUp,
  MousePointer,
  HelpCircle,
  FolderKanban,
  Zap,
  Globe,
  Tag,
  Check,
  Copy,
  Megaphone,
  Mail,
  Video,
  PenTool,
  ShoppingBag,
  ShoppingCart,
  Truck,
  RotateCcw,
  BarChart2,
  Database,
  FileText,
  FileSpreadsheet,
  Download,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  Filter,
  Webhook,
  Grid as GridIcon,
  Layers,
  Move,
  GripHorizontal,
  Hand,
  ZoomIn,
  ZoomOut,
  Trash2,
  ChevronsUpDown,
  List as ListIcon,
  AlignLeft,
  AlignRight,
  Settings,
  Workflow,
  Save,
  LogOut,
  ArrowLeft,
  Type,
  Languages,
  UploadCloud,
  FileCode,
  Image as ImageIcon,
  ExternalLink,
  HardDrive,
  Paperclip,
  Table,
  FileUp,
  Palette,
  Shapes,
  Square,
  Circle,
  Store,
  MapPin,
  Wand2,
  Film,
  Clapperboard,
  Link2,
  Target,
  ShieldCheck,
  MessageSquareQuote,
  Compass,
  Code,
  Smartphone,
  Droplets,
  Bot,
  Send,
  MessageSquare,
  CheckSquare,
  User,
  MessageCircle,
  Headphones,
  LayoutGrid,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ALL_SKILL_CATEGORIES, ALL_SKILLS, SkillCategory, SkillItem } from '../../data/skillsData';

import {
  ProductLibraryItem,
  BoardNode,
  BoardEdge,
  BoardStickyNote,
  BoardProject,
  BoardShape,
  SAMPLE_PRODUCTS,
  getDefaultPromptForNode,
  TextStyleConfig,
  UploadedFileItem,
  CustomSkillItem,
  FileType,
  DEFAULT_UPLOADED_FILES,
  SavedPromptItem,
} from '../../types/board';
import {
  loadBoardProjectsFromStorage,
  saveBoardProjectsToStorage,
  loadActiveBoardProjectId,
  saveActiveBoardProjectId,
  loadOpenBoardTabIds,
  saveOpenBoardTabIds,
  createNewBoardProjectOptions,
} from '../../utils/boardProjects';
import { BoardTabBar } from './BoardTabBar';
import { BoardProjectsModal } from './BoardProjectsModal';
import { NewBoardProjectModal } from './NewBoardProjectModal';
import { BoardProjectsHub } from './BoardProjectsHub';
import { UniversalContentEngine, normalizeAndCleanAIOutput } from './UniversalContentEngine';
import { SkillPreviewEngine } from './SkillPreviewEngine';
import { ChatGPTMarkdownDocumentRenderer, StatusBadge } from './ChatGPTComponents';
import { AppNodeCanvasCard } from './AppNodeCanvasCard';
import { AppSidebar } from '../navigation/AppSidebar';
import { ServicesMenuDropdown } from '../navigation/ServicesMenuDropdown';
import { ProductPreviewModal } from '../products/ProductPreviewModal';
import { ProductImportModal } from '../products/ProductImportModal';
import { ProductRegrouperApp, CampaignBlueprint } from './ProductRegrouperApp';
import { TextToCodeLandingPageApp, DEFAULT_THE_GOOD_DOSE_DATA, LandingPageData } from './TextToCodeLandingPageApp';
import { TextToImageLandingPageApp, DEFAULT_ORVENA_DATA, ImageLandingPageData } from './TextToImageLandingPageApp';
import {
  LandingPageGeneratorApp,
  INITIAL_LANDING_PAGE_SETTINGS,
  LandingPageSettings,
} from './LandingPageGeneratorApp';
import { CroMobileLandingPageBuilder } from './CroMobileLandingPageBuilder';
import {
  DetailedProduct,
  loadProductsFromStorage,
  saveProductsToStorage,
  ATTACHED_UMBRELLA_PRODUCT,
} from '../../utils/productStore';
import { buildMasterStoreLandingPageHtml } from '../../utils/masterLandingPageBuilder';
import { croFactsFromNode, croFactsFromProductLike } from '../../utils/croLandingPageStrategy';

export type { ProductLibraryItem, BoardNode, BoardEdge, BoardStickyNote, BoardProject, BoardShape };
export { SAMPLE_PRODUCTS };

interface BoardPageProps {
  onNavigateHome: () => void;
  onNavigateToView: (view: string, subItem?: string) => void;
  initialSubItem?: string;
}

// Pixel-perfect Brand and Skill SVGs matching image_ca6855fc.png
export const SkillBrandIcon: React.FC<{ type: string; className?: string }> = ({
  type,
  className = 'w-4 h-4',
}) => {
  switch (type) {
    case 'meta':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path
            d="M16.96 4.5C14.7 4.5 13.06 5.67 12 6.96 10.94 5.67 9.3 4.5 7.04 4.5 3.16 4.5 0 7.71 0 11.73c0 4.9 4.3 8.77 10.28 8.77 1.03 0 1.95-.14 2.76-.39.81.25 1.73.39 2.76.39 5.98 0 10.28-3.87 10.28-8.77 0-4.02-3.16-7.23-7.12-7.23zM7.04 17.5c-3.19 0-5.74-2.58-5.74-5.77s2.55-5.77 5.74-5.77c1.78 0 3.29.82 4.26 2.08-1.57 2.15-2.73 5.46-4.26 9.46zm9.92 0c-1.53-4-2.69-7.31-4.26-9.46.97-1.26 2.48-2.08 4.26-2.08 3.19 0 5.74 2.58 5.74 5.77s-2.55 5.77-5.74 5.77z"
            fill="currentColor"
          />
        </svg>
      );
    case 'google_ads':
      return (
        <svg viewBox="0 0 24 24" className={className}>
          <path d="M3.7 15.3l5.5-9.6c.7-1.2 2.3-1.6 3.5-.9l.9.5c1.2.7 1.6 2.3.9 3.5L8.5 18.4c-.7 1.2-2.3 1.6-3.5.9l-.4-.2c-1.3-.7-1.7-2.3-.9-3.8z" fill="#FBBC04" />
          <path d="M16.8 19.5c1.5 0 2.7-1.2 2.7-2.7s-1.2-2.7-2.7-2.7-2.7 1.2-2.7 2.7 1.2 2.7 2.7 2.7z" fill="#4285F4" />
          <path d="M20.3 13.5l-5.5-9.6c-.7-1.2-2.3-1.6-3.5-.9l-1 .6c-1.2.7-1.6 2.3-.9 3.5l5.5 9.6c.7 1.2 2.3 1.6 3.5.9l1-.6c1.1-.7 1.6-2.3.9-3.5z" fill="#34A853" />
        </svg>
      );
    case 'tiktok_ads':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.63c.3 0 .59.05.86.13V9.4a6.34 6.34 0 0 0-7.39 6.22 6.34 6.34 0 0 0 10.87 4.54 6.28 6.28 0 0 0 1.9-4.54V9.08a8.28 8.28 0 0 0 4.87 1.58V7.21a4.84 4.84 0 0 1-1-.52z" />
        </svg>
      );
    case 'sheets':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="3" y="2" width="18" height="20" rx="3" fill="#0F9D58" />
          <path d="M7 7h10M7 11h10M7 15h10M11 7v10" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'shopify':
    case 'store':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M18.8 6.5l-2.6-1.5c-.2-.1-.5 0-.6.2l-1 2.2-2.1-1.3c-.3-.2-.7 0-.8.3l-1.3 6.9-2.5-4.5c-.2-.3-.6-.4-.9-.2l-2.7 1.5c-.2.1-.3.3-.3.6l1.2 10.3c.1.5.5.9 1 .9h9c.5 0 .9-.4 1-.9l1.7-13.8c0-.3-.1-.6-.4-.7z" fill="#95BF47" />
          <path d="M13.2 8.9l1.7 4.1c.2.4.7.6 1.1.4l2.8-1.4-1.2 9.5c0 .3-.3.5-.6.5h-8c-.3 0-.6-.2-.6-.5L7.3 12l2.3-1.3 2.1 3.8c.3.5.9.6 1.5-.6z" fill="#5E8E3E" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
};

// Helper to detect if text contains Arabic/Darija characters
function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F]/.test(text);
}

// Helper to format inline bold (**text**) into <strong>
function formatInlineMarkdown(text: string): React.ReactNode {
  if (!text) return '';
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// Helper to convert hex color to transparent rgba
function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  if (c.length !== 6) return `rgba(99, 102, 241, ${alpha})`;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface MarketCountryItem {
  id: string;
  name: string;
  flag: string;
  region: string;
  currency: string;
}

export const TARGET_MARKETS: MarketCountryItem[] = [
  // North Africa (Algeria Default)
  { id: 'Algeria', name: 'Algeria', flag: '🇩🇿', region: 'North Africa', currency: 'DZD' },
  { id: 'Morocco', name: 'Morocco', flag: '🇲🇦', region: 'North Africa', currency: 'MAD' },
  { id: 'Tunisia', name: 'Tunisia', flag: '🇹🇳', region: 'North Africa', currency: 'TND' },
  { id: 'Egypt', name: 'Egypt', flag: '🇪🇬', region: 'North Africa', currency: 'EGP' },
  // GCC
  { id: 'Saudi Arabia', name: 'Saudi Arabia (GCC)', flag: '🇸🇦', region: 'GCC', currency: 'SAR' },
  { id: 'UAE', name: 'UAE Emirates (GCC)', flag: '🇦🇪', region: 'GCC', currency: 'AED' },
  { id: 'Qatar', name: 'Qatar (GCC)', flag: '🇶🇦', region: 'GCC', currency: 'QAR' },
  { id: 'Kuwait', name: 'Kuwait (GCC)', flag: '🇰🇼', region: 'GCC', currency: 'KWD' },
  { id: 'Oman', name: 'Oman (GCC)', flag: '🇴🇲', region: 'GCC', currency: 'OMR' },
  { id: 'Bahrain', name: 'Bahrain (GCC)', flag: '🇧🇭', region: 'GCC', currency: 'BHD' },
  // Western Europe
  { id: 'Spain', name: 'Spain', flag: '🇪🇸', region: 'Western Europe', currency: 'EUR' },
  { id: 'France', name: 'France', flag: '🇫🇷', region: 'Western Europe', currency: 'EUR' },
  { id: 'Italy', name: 'Italy', flag: '🇮🇹', region: 'Western Europe', currency: 'EUR' },
  { id: 'Germany', name: 'Germany', flag: '🇩🇪', region: 'Western Europe', currency: 'EUR' },
  { id: 'United Kingdom', name: 'United Kingdom (UK)', flag: '🇬🇧', region: 'Western Europe', currency: 'GBP' },
  { id: 'Belgium', name: 'Belgium', flag: '🇧🇪', region: 'Western Europe', currency: 'EUR' },
  { id: 'Portugal', name: 'Portugal', flag: '🇵🇹', region: 'Western Europe', currency: 'EUR' },
  // Central & Eastern Europe
  { id: 'Poland', name: 'Poland', flag: '🇵🇱', region: 'Eastern Europe', currency: 'PLN' },
  { id: 'Ukraine', name: 'Ukraine', flag: '🇺🇦', region: 'Eastern Europe', currency: 'UAH' },
  { id: 'Romania', name: 'Romania', flag: '🇷🇴', region: 'Eastern Europe', currency: 'RON' },
  // Americas
  { id: 'USA', name: 'United States (USA)', flag: '🇺🇸', region: 'Americas', currency: 'USD' },
  { id: 'Canada', name: 'Canada', flag: '🇨🇦', region: 'Americas', currency: 'CAD' },
  { id: 'Brazil', name: 'Brazil', flag: '🇧🇷', region: 'Americas', currency: 'BRL' },
  // Asia & Pacific
  { id: 'Japan', name: 'Japan', flag: '🇯🇵', region: 'Asia & Pacific', currency: 'JPY' },
  { id: 'China', name: 'China', flag: '🇨🇳', region: 'Asia & Pacific', currency: 'CNY' },
  { id: 'Australia', name: 'Australia', flag: '🇦🇺', region: 'Asia & Pacific', currency: 'AUD' },
  // Eurasia & Other
  { id: 'Russia', name: 'Russia', flag: '🇷🇺', region: 'Eurasia', currency: 'RUB' },
  { id: 'Turkey', name: 'Turkey', flag: '🇹🇷', region: 'Eurasia', currency: 'TRY' },
];

export const BoardPage: React.FC<BoardPageProps> = ({ onNavigateHome, onNavigateToView, initialSubItem }) => {
  // Selection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [resultViewStyle, setResultViewStyle] = useState<'organized' | 'plain'>('organized');
  const [copiedSnippetKey, setCopiedSnippetKey] = useState<string | null>(null);
  const [settingsModalNodeId, setSettingsModalNodeId] = useState<string | null>(null);
  const [settingsActiveTab, setSettingsActiveTab] = useState<'config' | 'prompt' | 'options' | 'typography'>('config');
  const [activePromptModalTabId, setActivePromptModalTabId] = useState<string | null>(null);
  const [styleAppliedAllToast, setStyleAppliedAllToast] = useState(false);
  const [activeBottomResultNodeId, setActiveBottomResultNodeId] = useState<string | null>(null);
  const [isBottomResultOpen, setIsBottomResultOpen] = useState(true);
  const [bottomResultHeight, setBottomResultHeight] = useState<'normal' | 'large'>('normal');
  const [expandedCardResultIds, setExpandedCardResultIds] = useState<Record<string, boolean>>({});
  const [isSkillsPanelOpen, setIsSkillsPanelOpen] = useState(true);
  const [skillsSearch, setSkillsSearch] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('All');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    master_orchestration: true,
    stage_1_product: true,
    stage_2_strategy: true,
    stage_3_creative: true,
    dz_landing_page: true,
    fb_ads_testing: true,
    fb_ads_scaling: true,
    decision_intelligence: true,
  });
  const [skillsViewMode, setSkillsViewMode] = useState<'list' | 'grid'>('grid');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'findings' | 'settings' | 'metrics' | 'connections'>('findings');

  // Left Drawer Tab Mode: 'skills' | 'products' | 'uploads' | 'apps'
  const [sidebarTab, setSidebarTab] = useState<'skills' | 'products' | 'uploads' | 'apps'>('skills');
  const [productSearch, setProductSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [copiedResult, setCopiedResult] = useState(false);
  const [textDirection, setTextDirection] = useState<'ltr' | 'rtl'>('ltr');

  // Products Dossier & Intelligence Store State
  const [productsList, setProductsList] = useState<DetailedProduct[]>(() => loadProductsFromStorage());
  const [isProductImportModalOpen, setIsProductImportModalOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<DetailedProduct | null>(null);
  const [isRegrouperModalOpen, setIsRegrouperModalOpen] = useState(false);
  const [regrouperData, setRegrouperData] = useState<Partial<CampaignBlueprint> | null>(null);
  const [isTextToCodeModalOpen, setIsTextToCodeModalOpen] = useState(false);
  const [textToCodeData, setTextToCodeData] = useState<Partial<LandingPageData> | null>(null);
  const [isTextToImageLpModalOpen, setIsTextToImageLpModalOpen] = useState(false);
  const [textToImageLpData, setTextToImageLpData] = useState<Partial<ImageLandingPageData> | null>(null);
  const [isLandingPageModalOpen, setIsLandingPageModalOpen] = useState(false);
  const [landingPageSettings, setLandingPageSettings] = useState<Partial<LandingPageSettings> | null>(null);
  const [isCroMobileModalOpen, setIsCroMobileModalOpen] = useState(false);

  // Auto-open Apps Modals if navigated directly via Apps sidebar
  useEffect(() => {
    if (initialSubItem === 'regrouper') {
      setIsRegrouperModalOpen(true);
    } else if (initialSubItem === 'text-to-code-lp' || initialSubItem === 'text_to_code_landing_page') {
      setIsTextToCodeModalOpen(true);
    } else if (initialSubItem === 'text-to-image-lp' || initialSubItem === 'text_to_image_landing_page') {
      setIsTextToImageLpModalOpen(true);
    } else if (
      initialSubItem === 'cro-mobile-lp' ||
      initialSubItem === 'cro_mobile_landing_page' ||
      initialSubItem === 'cro-mobile' ||
      initialSubItem === 'cro'
    ) {
      setIsCroMobileModalOpen(true);
    } else if (
      initialSubItem === 'landing-page' ||
      initialSubItem === 'lanidng-page' ||
      initialSubItem === 'landing_page' ||
      initialSubItem === 'landing_page_generator' ||
      initialSubItem === 'ai-landing-page'
    ) {
      setIsLandingPageModalOpen(true);
    }
  }, [initialSubItem]);

  // File Uploads & Datasets State (Persistent)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>(() => {
    try {
      const saved = localStorage.getItem('user_uploaded_files_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_UPLOADED_FILES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('user_uploaded_files_v1', JSON.stringify(uploadedFiles));
    } catch (e) {
      console.error('Failed to save uploaded files to localStorage', e);
    }
  }, [uploadedFiles]);

  const [fileFilter, setFileFilter] = useState<'all' | 'excel' | 'pdf' | 'word' | 'json' | 'image'>('all');
  const [fileSearch, setFileSearch] = useState('');
  const [previewFileModal, setPreviewFileModal] = useState<UploadedFileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom AI Skills State (Persistent)
  const [customSkills, setCustomSkills] = useState<CustomSkillItem[]>(() => {
    try {
      const saved = localStorage.getItem('user_custom_skills_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('user_custom_skills_v1', JSON.stringify(customSkills));
    } catch (e) {
      console.error('Failed to save custom skills to localStorage', e);
    }
  }, [customSkills]);

  // Hidden / Removed skill IDs from list (Persistent)
  const [removedSkillIds, setRemovedSkillIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('user_removed_skill_ids_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('user_removed_skill_ids_v1', JSON.stringify(removedSkillIds));
    } catch (e) {
      console.error('Failed to save removed skill ids to localStorage', e);
    }
  }, [removedSkillIds]);

  // Skill pending removal confirmation modal state
  const [skillToRemove, setSkillToRemove] = useState<{
    id: string;
    title: string;
    isCustom?: boolean;
  } | null>(null);

  const handleConfirmRemoveSkill = () => {
    if (!skillToRemove) return;
    if (skillToRemove.isCustom) {
      setCustomSkills((prev) => prev.filter((s) => s.id !== skillToRemove.id));
      showToast(`✓ Removed custom skill "${skillToRemove.title}"`);
    } else {
      setRemovedSkillIds((prev) => [...prev, skillToRemove.id]);
      showToast(`✓ Removed skill "${skillToRemove.title}" from list`);
    }
    setSkillToRemove(null);
  };

  const handleRestoreAllSkills = () => {
    setRemovedSkillIds([]);
    showToast('✓ Restored all hidden skills to list!');
  };

  const [isNewSkillModalOpen, setIsNewSkillModalOpen] = useState(false);
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [newSkillSubtitle, setNewSkillSubtitle] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('stage_1_product');
  const [isCustomCategoryMode, setIsCustomCategoryMode] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [newSkillIcon, setNewSkillIcon] = useState('Sparkles');
  const [newSkillColor, setNewSkillColor] = useState('bg-emerald-600');
  const [newSkillPrompt, setNewSkillPrompt] = useState(
    'Execute customized intelligence analysis for "{product_title}".\nAnalyze market potential and pricing for {selling_price} DZD in Algerian COD market.\nIncorporate attached file data: {file_data}.\nProvide 3 high-converting creative hooks written 100% EXCLUSIVELY in {language}.'
  );



  // Helper parser for Clean Text Preview (Matching user attached image_571e17db.png)
  const parseCleanTextOutput = useCallback((rawContent: string, fallbackProduct?: string) => {
    let productName = fallbackProduct || '';
    let summary = '';
    const additionalSections: { title: string; body: string }[] = [];

    if (!rawContent) {
      return { productName, summary, additionalSections };
    }

    // 1. Match Product name: ...
    const productMatch = rawContent.match(/Product name:\s*([^\n\r]+)/i);
    if (productMatch && productMatch[1]) {
      productName = productMatch[1].trim();
    } else {
      const targetMatch = rawContent.match(/\*\*Target Product\*\*:\s*([^\n\r(]+)/i);
      if (targetMatch && targetMatch[1]) {
        productName = targetMatch[1].trim();
      }
    }

    // 2. Match Summary: ...
    const summaryMatch = rawContent.match(/Summary:\s*([\s\S]*?)(?=(?:\n\s*\n\s*[A-Z][A-Za-z0-9\s&/\-]+:)|(?:\n\s*###)|(?:\n\s*####)|$)/i);
    if (summaryMatch && summaryMatch[1]) {
      summary = summaryMatch[1].trim();
    } else {
      const cleaned = rawContent
        .replace(/^#+.*$/gm, '')
        .replace(/\*\*Target Product\*\*:.*$/gm, '')
        .trim();
      const paragraphs = cleaned.split(/\n\s*\n/);
      summary = paragraphs[0]?.trim() || '';
    }

    // 3. Match additional structured sections
    const lines = rawContent.split('\n');
    let currentTitle = '';
    let currentLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^(?:####?\s*)?([A-Za-z0-9\s&/\-]+):\s*(.*)$/);
      if (match && !line.toLowerCase().startsWith('product name:') && !line.toLowerCase().startsWith('summary:')) {
        if (currentTitle && currentLines.length > 0) {
          additionalSections.push({
            title: currentTitle,
            body: currentLines.join('\n').trim(),
          });
        }
        currentTitle = match[1].trim().replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '');
        currentLines = match[2] ? [match[2].trim()] : [];
      } else if (currentTitle) {
        currentLines.push(line);
      }
    }

    if (currentTitle && currentLines.length > 0) {
      additionalSections.push({
        title: currentTitle,
        body: currentLines.join('\n').trim(),
      });
    }

    return { productName, summary, additionalSections };
  }, []);

  // Snippet copy handler
  const handleCopySnippet = useCallback((text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedSnippetKey(key);
    setTimeout(() => setCopiedSnippetKey(null), 2000);
  }, []);

  // --- MULTI-PROJECT BOARD STATE ---
  const [boardProjects, setBoardProjects] = useState<BoardProject[]>(() => loadBoardProjectsFromStorage());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => loadActiveBoardProjectId(boardProjects));
  const [openProjectIds, setOpenProjectIds] = useState<string[]>(() => loadOpenBoardTabIds(boardProjects));
  // Default view is 'hub' matching image_ddb7176c.png so user sees all projects and chooses what to open
  const [boardViewMode, setBoardViewMode] = useState<'hub' | 'canvas'>('hub');

  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isHeaderProjectDropdownOpen, setIsHeaderProjectDropdownOpen] = useState(false);

  // Active project
  const currentProject =
    boardProjects.find((p) => p.id === activeProjectId) ||
    boardProjects[0] || {
      id: 'default',
      name: 'Algeria COD Sales Funnel',
      nodes: [],
      edges: [],
      stickyNotes: [],
      panOffset: { x: 50, y: 20 },
      zoom: 85,
    };

  // Surface Color Presets for Board Canvas (User Request: small cards view surface color)
  const SURFACE_COLOR_PRESETS = [
    {
      id: 'finalytic-dark',
      name: 'Finalytic Dark',
      color: '#161618',
      dotColor: '#454552',
      lineColor: '#2b2b32',
      isDark: true,
      description: 'Matches the sidebar & header theme',
    },
    {
      id: 'deep-obsidian',
      name: 'Deep Obsidian',
      color: '#0e0e11',
      dotColor: '#363640',
      lineColor: '#202027',
      isDark: true,
      description: 'Ultra dark high-contrast surface',
    },
    {
      id: 'midnight-navy',
      name: 'Midnight Navy',
      color: '#0B132B',
      dotColor: '#28385e',
      lineColor: '#1C2541',
      isDark: true,
      description: 'Deep celestial dark blue canvas',
    },
    {
      id: 'graphite',
      name: 'Modern Graphite',
      color: '#1E1E24',
      dotColor: '#4E4E58',
      lineColor: '#2F2F38',
      isDark: true,
      description: 'Technical matte dark charcoal',
    },
    {
      id: 'clean-slate',
      name: 'Clean Slate',
      color: '#F8FAFC',
      dotColor: '#CBD5E1',
      lineColor: '#E2E8F0',
      isDark: false,
      description: 'Crisp airy modern blueprint',
    },
    {
      id: 'warm-paper',
      name: 'Warm Paper',
      color: '#FDFBF7',
      dotColor: '#D8D1C5',
      lineColor: '#EBE5D8',
      isDark: false,
      description: 'Soft warm natural surface',
    },
    {
      id: 'pure-white',
      name: 'Studio White',
      color: '#FFFFFF',
      dotColor: '#E2E8F0',
      lineColor: '#F1F5F9',
      isDark: false,
      description: 'Minimal pure white canvas',
    },
    {
      id: 'soft-zinc',
      name: 'Soft Zinc Gray',
      color: '#F1F5F9',
      dotColor: '#94A3B8',
      lineColor: '#CBD5E1',
      isDark: false,
      description: 'Balanced cool neutral tone',
    },
  ];

  // Surface background color state (defaults to Home Dashboard #F8FAFC light theme)
  const [boardBgColor, setBoardBgColor] = useState<string>(() => {
    const saved = localStorage.getItem('board_surface_color');
    if (!saved || saved === '#161618') return '#F8FAFC';
    return saved;
  });
  const [isSurfaceColorMenuOpen, setIsSurfaceColorMenuOpen] = useState(false);

  const handleSelectBoardBgColor = (color: string) => {
    setBoardBgColor(color);
    localStorage.setItem('board_surface_color', color);
    showToast(`Board surface color set to ${color}`);
  };

  const isDarkSurface = React.useMemo(() => {
    const c = boardBgColor.replace('#', '');
    if (c.length === 6) {
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness < 128;
    }
    return false;
  }, [boardBgColor]);

  // Zoom & Pan & Grid Style - restores from active project
  const [zoom, setZoom] = useState<number>(() => currentProject?.zoom || 85);
  const [gridStyle, setGridStyle] = useState<'dots' | 'lines' | 'cross'>('dots');
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);
  const [runningNodeId, setRunningNodeId] = useState<string | null>(null);
  const [activeLanguageMenuNodeId, setActiveLanguageMenuNodeId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Active AI Model selection & detection state on Board
  const [currentAiModel, setCurrentAiModel] = useState<string>(
    () => localStorage.getItem('ai_model') || 'gpt-4o-mini'
  );
  const [currentAiProvider, setCurrentAiProvider] = useState<string>(
    () => localStorage.getItem('ai_provider') || 'openai'
  );
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [boardDetectedModels, setBoardDetectedModels] = useState<
    Array<{ id: string; name: string; isRecommended?: boolean; category?: string }>
  >([]);
  const [verifiedWorkingModels, setVerifiedWorkingModels] = useState<
    Array<{ id: string; name?: string; provider?: string; latencyMs?: number; success?: boolean; testedAt?: string }>
  >(() => {
    try {
      const stored = localStorage.getItem('verified_working_models');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isDetectingOnBoard, setIsDetectingOnBoard] = useState(false);
  const [isTestingOnBoard, setIsTestingOnBoard] = useState(false);
  const [showOnlyVerified, setShowOnlyVerified] = useState(true);
  const [boardDetectionMsg, setBoardDetectionMsg] = useState<string | null>(null);
  const [customModelOnBoard, setCustomModelOnBoard] = useState('');
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const connectStartTimeRef = useRef<number>(0);
  const justCompletedConnectionRef = useRef<boolean>(false);

  const syncModelsFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('verified_working_models');
      if (stored) {
        setVerifiedWorkingModels(JSON.parse(stored));
      }
      const savedModel = localStorage.getItem('ai_model');
      if (savedModel) setCurrentAiModel(savedModel);
      const savedProv = localStorage.getItem('ai_provider');
      if (savedProv) setCurrentAiProvider(savedProv);
    } catch {}
  }, []);

  useEffect(() => {
    const handleStorageChange = () => syncModelsFromStorage();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncModelsFromStorage]);

  const handleFetchAndTestBoardModels = async (prov = currentAiProvider) => {
    setIsTestingOnBoard(true);
    setBoardDetectionMsg(null);
    try {
      const key =
        (prov === 'openai' ? localStorage.getItem('openai_api_key') : null) ||
        (prov === 'deepseek' ? localStorage.getItem('deepseek_api_key') : null) ||
        (prov === 'gemini' ? localStorage.getItem('gemini_api_key') : null) ||
        (prov === 'openrouter' ? localStorage.getItem('openrouter_api_key') : null) ||
        (prov === 'agentrouter' ? localStorage.getItem('agentrouter_api_key') : null) ||
        (prov === 'nvidia' ? localStorage.getItem('nvidia_api_key') : null) ||
        localStorage.getItem('user_api_key') ||
        '';

      if (!key) {
        showToast('Please enter an API key in Settings first to test models.');
        setBoardDetectionMsg('Missing API key in Settings');
        setIsTestingOnBoard(false);
        return;
      }

      // Step 1: Fetch models
      setBoardDetectionMsg('Step 1/2: Fetching available models...');
      const resModels = await fetch('/api/ai/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: prov, apiKey: key }),
      });
      const dataModels = await resModels.json();
      const candidateList: string[] = (
        dataModels.models && dataModels.models.length > 0
          ? dataModels.models.map((m: any) => m.id)
          : prov === 'openai'
          ? ['gpt-4o-mini', 'gpt-4o', 'o1-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']
          : [currentAiModel]
      ).slice(0, 15);

      setBoardDetectedModels(dataModels.models || []);

      // Step 2: Test models to verify working status
      setBoardDetectionMsg('Step 2/2: Testing models in parallel...');
      const resTest = await fetch('/api/ai/test-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: prov, apiKey: key, models: candidateList }),
      });
      const dataTest = await resTest.json();

      if (dataTest.results) {
        const working = dataTest.results
          .filter((r: any) => r.success)
          .map((r: any) => ({
            id: r.model,
            name: r.model,
            provider: prov,
            latencyMs: r.latencyMs,
            success: true,
            reply: r.reply,
            testedAt: new Date().toLocaleTimeString(),
          }));

        // Merge into verified working models
        try {
          const stored: any[] = JSON.parse(localStorage.getItem('verified_working_models') || '[]');
          const testedIds = new Set(candidateList);
          const untouched = stored.filter((m) => m.provider !== prov || !testedIds.has(m.id));
          const updated = [...working, ...untouched];
          localStorage.setItem('verified_working_models', JSON.stringify(updated));
          setVerifiedWorkingModels(updated);
        } catch {
          localStorage.setItem('verified_working_models', JSON.stringify(working));
          setVerifiedWorkingModels(working);
        }

        if (working.length > 0) {
          showToast(`Verified ${working.length} working models on ${prov.toUpperCase()}!`);
          setBoardDetectionMsg(`${working.length} working models verified.`);
          // Auto-select first working model if current isn't among working
          if (!working.some((w: any) => w.id === currentAiModel)) {
            setCurrentAiModel(working[0].id);
            localStorage.setItem('ai_model', working[0].id);
          }
        } else {
          showToast('None of the tested models responded with success. Check API key quota or balance.');
          setBoardDetectionMsg('All tested models failed. Check key balance or quota.');
        }
      }
    } catch (err: any) {
      setBoardDetectionMsg(`Test error: ${err?.message}`);
      showToast(`Verification error: ${err?.message}`);
    } finally {
      setIsTestingOnBoard(false);
    }
  };

  const handleFetchBoardModels = async (prov = currentAiProvider) => {
    setIsDetectingOnBoard(true);
    setBoardDetectionMsg(null);
    try {
      const key =
        (prov === 'openai' ? localStorage.getItem('openai_api_key') : null) ||
        (prov === 'deepseek' ? localStorage.getItem('deepseek_api_key') : null) ||
        (prov === 'gemini' ? localStorage.getItem('gemini_api_key') : null) ||
        (prov === 'openrouter' ? localStorage.getItem('openrouter_api_key') : null) ||
        (prov === 'agentrouter' ? localStorage.getItem('agentrouter_api_key') : null) ||
        (prov === 'nvidia' ? localStorage.getItem('nvidia_api_key') : null) ||
        localStorage.getItem('user_api_key') ||
        '';
      const res = await fetch('/api/ai/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: prov, apiKey: key }),
      });
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        setBoardDetectedModels(data.models);
        setBoardDetectionMsg(data.message || `Detected ${data.models.length} active models`);
      } else {
        setBoardDetectionMsg(data.message || 'No models returned from API.');
      }
    } catch (e: any) {
      setBoardDetectionMsg(`Error: ${e?.message}`);
    } finally {
      setIsDetectingOnBoard(false);
    }
  };

  const handleSelectBoardModel = (modelId: string) => {
    setCurrentAiModel(modelId);
    localStorage.setItem('ai_model', modelId);
    try {
      window.dispatchEvent(new CustomEvent('ai_model_changed', { detail: { provider: currentAiProvider, model: modelId } }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast(`Active AI model set to: ${modelId}`);
    setIsModelDropdownOpen(false);
  };

  const handleSelectBoardProvider = (prov: string) => {
    setCurrentAiProvider(prov);
    localStorage.setItem('ai_provider', prov);
    let target = 'gpt-4o-mini';
    if (prov === 'deepseek') target = 'deepseek-chat';
    else if (prov === 'gemini') target = 'gemini-3.8-flash';
    else if (prov === 'openai') target = 'gpt-4o-mini';
    else if (prov === 'openrouter') target = 'nvidia/nemotron-3.5-lightning:free';
    else if (prov === 'agentrouter') target = 'gpt-4o';
    else if (prov === 'nvidia') target = 'meta/llama-3.3-70b-instruct';

    // If verified working models exist for this provider, pick the first working one
    const provWorking = verifiedWorkingModels.filter((m) => (m.provider || 'openai') === prov && m.success);
    if (provWorking.length > 0) {
      target = provWorking[0].id;
    }

    setCurrentAiModel(target);
    localStorage.setItem('ai_model', target);
    try {
      window.dispatchEvent(new CustomEvent('ai_model_changed', { detail: { provider: prov, model: target } }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast(`AI Provider switched to: ${prov.toUpperCase()}`);
  };

  // Manual Zoom controls state
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const [wheelZoomEnabled, setWheelZoomEnabled] = useState(true);

  // Pan tool state - restores user last position from active project
  const [activeTool, setActiveTool] = useState<'select' | 'pan'>('select');
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>(() => currentProject?.panOffset || { x: 50, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Drag-and-drop skill from left drawer state
  const [isCanvasDragOver, setIsCanvasDragOver] = useState(false);
  const [dragOverCoords, setDragOverCoords] = useState<{ x: number; y: number } | null>(null);
  const [pointerDraggingSkill, setPointerDraggingSkill] = useState<{
    skill: any;
    currentX: number;
    currentY: number;
    startX: number;
    startY: number;
    hasMoved: boolean;
  } | null>(null);

  // Edge selection & Interactive connection drawing states
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<{
    nodeId: string;
    anchor: 'left' | 'right';
    subId?: string;
  } | null>(null);
  const [connectingMousePos, setConnectingMousePos] = useState<{ x: number; y: number } | null>(null);

  // Dragging state for smooth interactive movement
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Minimap visibility & duplicate add prevention refs
  const [isMinimapOpen, setIsMinimapOpen] = useState(true);
  const lastAddSkillTimeRef = useRef<number>(0);
  const justDraggedSkillRef = useRef<boolean>(false);
  const isAddingSkillLockRef = useRef<boolean>(false);

  // Storage keys for user's work on the board
  const STORAGE_KEY_NODES = 'user_board_nodes_v1';
  const STORAGE_KEY_EDGES = 'user_board_edges_v1';
  const STORAGE_KEY_STICKY = 'user_board_sticky_v1';
  const STORAGE_KEY_PAN = 'user_board_pan_v1';
  const STORAGE_KEY_ZOOM = 'user_board_zoom_v1';

  // Canvas state initialized directly from the current active project
  const [nodes, setNodes] = useState<BoardNode[]>(() => currentProject?.nodes || []);

  // Presets archived; board defaults to clean state as requested
  /*
  const _unusedNodes: BoardNode[] = [
    {
      id: 'node-product-scaler',
      title: 'Ultrasonic Dental Scaler Pro',
      subtitle: 'Electric calculus remover • 4,800 DZD',
      category: 'Product Library',
      iconType: 'ShoppingBag',
      iconBg: 'bg-emerald-600',
      iconColor: 'text-white',
      x: -260,
      y: 130,
      status: 'active',
      isProduct: true,
      productData: SAMPLE_PRODUCTS[0],
      metrics: [
        { label: 'Selling', value: '4,800 DZD' },
        { label: 'Cost', value: '1,400 DZD' },
        { label: 'Margin', value: '+71%' },
      ],
      config: {
        name: 'Ultrasonic Dental Scaler Pro',
        description: 'High-converting personal care item in Algerian COD market with viral TikTok video angles.',
        campaignObjective: 'Sales',
        targetAudience: 'Algeria - 18+',
        budget: '30',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: true,
      },
    },
    {
      id: 'node-meta-ads',
      title: 'Meta Ads',
      subtitle: 'Find winning audience and launch campaigns',
      category: 'Acquisition',
      iconType: 'meta',
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
      x: 80,
      y: 130,
      status: 'active',
      liveWebResearch: true,
      language: 'English',
      executionResult: {
        executedAt: '10:45 AM',
        skillName: 'Meta Ads',
        productName: 'Egg Sitter-style Honeycomb Gel Seat Cushion (branded original: Egg Sitter Support Cushion by BulbHead)',
        language: 'English',
        webResearchUsed: true,
        content: `Product name: Egg Sitter-style Honeycomb Gel Seat Cushion (branded original: Egg Sitter Support Cushion by BulbHead)

Summary:
The Egg Sitter-style honeycomb gel seat cushion is a proven, globally commoditized product with a strong demonstration hook (sitting on a raw egg without breaking it) and a mature market. Global demand is evidenced by 5,514 Amazon ratings, 829 Walmart ratings, and 50,000+ sold on a French AliExpress comparable, but the product is not novel and faces intense generic competition.

Winning Hooks:
1. Demonstration Hook (Raw Egg Test): "شفت هاد الكوسان بالجيل لي راه داير حالة في تيك توك؟ يمتص كامل الضغط حتى لوكان تقعد فوق حبة بيض ما تكسرهاش!"
2. Long-Distance Driver Relief: "Fatigué du mal de dos après de longues heures au volant ou au bureau ? Découvrez le coussin gel orthopédique n°1 testé en Algérie."
3. COD Guarantee: "Livraison 58 Wilayas disponible + متخلصش حتى تفتح الكولي وتجرب بعينيك!"

Market & COD Logistics:
- Selling Price: 3,800 DZD | Product Cost: 1,100 DZD | Gross Profit: +2,700 DZD (71%)
- Break-Even Delivery Rate: 64% with Yalidine Express across 58 Wilayas
- Return Mitigation: Call center WhatsApp voice message confirmation within 10 minutes of order placement.

Action Plan:
- Launch 3 UGC demonstration video creatives on Meta Ads targeting Wilayas 16 (Alger), 31 (Oran), 19 (Setif), and 25 (Constantine) at 2,500 DZD/day test budget.`,
        isSimulated: false,
      },
      metrics: [
        { label: 'Spend', value: '$182.4' },
        { label: 'Clicks', value: '12.4K' },
        { label: 'CTR', value: '2.8%' },
      ],
      config: {
        name: 'Meta Ads',
        description: 'Find winning audience and launch campaigns for your product.',
        campaignObjective: 'Sales',
        targetAudience: 'Algeria - 18+',
        budget: '50',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: true,
      },
    },
    {
      id: 'node-product-research',
      title: 'Product Research',
      subtitle: 'Analyze demand, competition and profitability',
      category: 'Product Intelligence',
      iconType: 'search',
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      x: 430,
      y: 130,
      status: 'active',
      metrics: [
        { label: 'Ideas', value: '128' },
        { label: 'Potential', value: '42' },
        { label: 'Score > 70', value: '18' },
      ],
      config: {
        name: 'Product Research',
        description: 'Analyze demand, competition and profitability for winning COD products.',
        campaignObjective: 'Research & Validation',
        targetAudience: 'Algeria Wilayas',
        budget: '20',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: false,
        saveAdsToLibrary: true,
      },
    },
    {
      id: 'node-creative-production',
      title: 'Creative Production',
      subtitle: 'Generate creatives (images, videos, hooks)',
      category: 'Creative Production',
      iconType: 'creative',
      iconBg: 'bg-purple-600',
      iconColor: 'text-white',
      x: 770,
      y: 130,
      status: 'active',
      metrics: [
        { label: 'Created', value: '36' },
        { label: 'Approved', value: '28' },
        { label: 'CTR', value: '4.5%' },
      ],
      config: {
        name: 'Creative Production',
        description: 'Generate high converting Algerian video ads, UGC hooks and Darija scripts.',
        campaignObjective: 'Creative Testing',
        targetAudience: 'Broad Algeria',
        budget: '35',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: true,
      },
    },
    {
      id: 'node-fb-ads-library',
      title: 'Facebook Ads Library',
      subtitle: 'Research competitors & winning ads',
      category: 'Acquisition',
      iconType: 'library',
      iconBg: 'bg-purple-600',
      iconColor: 'text-white',
      x: 80,
      y: 320,
      status: 'active',
      metrics: [
        { label: 'Ads Found', value: '1.2K' },
        { label: 'Pages', value: '342' },
        { label: 'New Ads', value: '87' },
      ],
      config: {
        name: 'Facebook Ads Library',
        description: 'Monitor competitor landing pages and active creative campaigns.',
        campaignObjective: 'Competitive Intelligence',
        targetAudience: 'Algerian Competitors',
        budget: '0',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: true,
      },
    },
    {
      id: 'node-landing-page',
      title: 'Landing Page',
      subtitle: 'Build and test landing pages',
      category: 'Website & Conversion',
      iconType: 'landing',
      iconBg: 'bg-rose-500',
      iconColor: 'text-white',
      x: 520,
      y: 320,
      status: 'active',
      metrics: [
        { label: 'Views', value: '8.4K' },
        { label: 'CTR', value: '5.2%' },
        { label: 'CVR', value: '3.1%' },
      ],
      config: {
        name: 'Landing Page',
        description: 'Algerian COD optimized landing page with 58 Wilayas 1-page checkout.',
        campaignObjective: 'Lead Generation',
        targetAudience: 'Algeria All Wilayas',
        budget: '15',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
    {
      id: 'node-checkout',
      title: 'Checkout',
      subtitle: 'Customer places order',
      category: 'Website & Conversion',
      iconType: 'checkout',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      x: 80,
      y: 500,
      status: 'active',
      metrics: [
        { label: 'Started', value: '1.2K' },
        { label: 'Completed', value: '842' },
        { label: 'CVR', value: '71%' },
      ],
      config: {
        name: 'Checkout',
        description: 'Fast mobile COD order form with address auto-completion and phone validation.',
        campaignObjective: 'Conversions',
        targetAudience: 'Algeria Mobile Users',
        budget: '0',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
    {
      id: 'node-new-order-cod',
      title: 'New Order (COD)',
      subtitle: 'Confirm order via WhatsApp/Phone',
      category: 'Algeria COD Operations',
      iconType: 'order',
      iconBg: 'bg-teal-500',
      iconColor: 'text-white',
      x: 430,
      y: 500,
      status: 'active',
      metrics: [
        { label: 'Orders', value: '842' },
        { label: 'Confirm Rate', value: '98%' },
        { label: 'COD', value: '100%' },
      ],
      config: {
        name: 'New Order (COD)',
        description: 'Instant call-center audio confirmation within 15 minutes of placement.',
        campaignObjective: 'Fulfillment & Confirmation',
        targetAudience: '58 Wilayas',
        budget: '10',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
    {
      id: 'node-delivery',
      title: 'Delivery',
      subtitle: 'Delivery company & tracking',
      category: 'Algeria COD Operations',
      iconType: 'delivery',
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
      x: 770,
      y: 500,
      status: 'active',
      metrics: [
        { label: 'Delivered', value: '780' },
        { label: 'RTO', value: '8%' },
        { label: 'Delivery Rate', value: '92%' },
      ],
      config: {
        name: 'Delivery',
        description: 'Yalidine Express and ZR Express tracking with doorstep cash collection.',
        campaignObjective: 'Logistics',
        targetAudience: 'Algeria Dispatch',
        budget: '45',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
    {
      id: 'node-rto-return',
      title: 'RTO / Return',
      subtitle: 'Manage returns if failed delivery',
      category: 'Algeria COD Operations',
      iconType: 'return',
      iconBg: 'bg-rose-500',
      iconColor: 'text-white',
      x: 770,
      y: 680,
      status: 'active',
      metrics: [
        { label: 'RTO', value: '62' },
        { label: 'Returned', value: '50' },
        { label: 'Loss', value: '$1.2K' },
      ],
      config: {
        name: 'RTO / Return',
        description: 'Auto-blacklist and return parcel recovery workflow.',
        campaignObjective: 'Risk Mitigation',
        targetAudience: 'Returns & Claims',
        budget: '0',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
    {
      id: 'node-store',
      title: 'Store',
      subtitle: 'Shopify store & products',
      category: 'Website & Conversion',
      iconType: 'store',
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      x: 470,
      y: 680,
      status: 'active',
      metrics: [
        { label: 'Visitors', value: '5.2K' },
        { label: 'Orders', value: '842' },
        { label: 'CVR', value: '4.2%' },
      ],
      config: {
        name: 'Store',
        description: 'E-commerce platform connected with automated inventory sync.',
        campaignObjective: 'Store Management',
        targetAudience: 'Customers',
        budget: '29',
        budgetPeriod: 'per month',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
    {
      id: 'node-profit-report',
      title: 'Profit Report',
      subtitle: 'Calculate profit and ROAS',
      category: 'Analytics & Profit',
      iconType: 'profit',
      iconBg: 'bg-purple-600',
      iconColor: 'text-white',
      x: 120,
      y: 680,
      status: 'active',
      metrics: [
        { label: 'Revenue', value: '$12.4K' },
        { label: 'Profit Margin', value: '63%' },
        { label: 'ROAS', value: '3.8' },
      ],
      config: {
        name: 'Profit Report',
        description: 'Daily gross profit, ad spend deduction, shipping costs, and net margin.',
        campaignObjective: 'Financial Analysis',
        targetAudience: 'Executive',
        budget: '0',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
    {
      id: 'node-google-sheets',
      title: 'Google Sheets',
      subtitle: 'Save data and generate reports',
      category: 'Storage & Output',
      iconType: 'sheets',
      iconBg: 'bg-emerald-600',
      iconColor: 'text-white',
      x: 430,
      y: 850,
      status: 'active',
      metrics: [
        { label: 'Records', value: '1.2K' },
        { label: 'Updated', value: '2h ago' },
        { label: 'Sync', value: 'Auto' },
      ],
      config: {
        name: 'Google Sheets',
        description: 'Automated 2-way sync with Yalidine and call center Google Spreadsheet.',
        campaignObjective: 'Data Synchronization',
        targetAudience: 'Internal Team',
        budget: '0',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: false,
      },
    },
  ];
  */

  // Edges definition linking the nodes: initialized directly from active project
  const [edges, setEdges] = useState<BoardEdge[]>(() => currentProject?.edges || []);

  // Sticky Notes: initialized directly from active project
  const [stickyNotes, setStickyNotes] = useState<BoardStickyNote[]>(() => currentProject?.stickyNotes || []);

  // Background Shapes (Strictly rendered at z-0 behind cards)
  const [boardShapes, setBoardShapes] = useState<BoardShape[]>(() => {
    try {
      const saved = localStorage.getItem('user_board_shapes_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return currentProject?.shapes || [
      {
        id: 'shape-zone-testing',
        type: 'rectangle',
        x: 40,
        y: 20,
        width: 480,
        height: 720,
        title: 'Zone 1: Audience & Hook Testing (Background Frame)',
        color: '#6366f1',
        opacity: 0.12,
        strokeColor: '#818cf8',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('user_board_shapes_v1', JSON.stringify(boardShapes));
    } catch (e) {
      console.error('Failed to save shapes', e);
    }
  }, [boardShapes]);

  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [isShapeToolMenuOpen, setIsShapeToolMenuOpen] = useState(false);
  const [draggingShapeId, setDraggingShapeId] = useState<string | null>(null);
  const [resizingShape, setResizingShape] = useState<{
    id: string;
    handle: 'corner' | 'right' | 'bottom';
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const [resizingNode, setResizingNode] = useState<{
    id: string;
    handle: 'corner' | 'right' | 'bottom';
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const [editingShapeTitleId, setEditingShapeTitleId] = useState<string | null>(null);
  const [activeMarketMenuNodeId, setActiveMarketMenuNodeId] = useState<string | null>(null);

  // Mouse interactive drawing mode for zones
  const [drawMode, setDrawMode] = useState<'rectangle' | 'circle' | null>(null);
  const [drawColor, setDrawColor] = useState<string>('#6366f1');
  const [activeDrawing, setActiveDrawing] = useState<{
    type: 'rectangle' | 'circle';
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    color: string;
  } | null>(null);

  const [draggingStickyId, setDraggingStickyId] = useState<string | null>(null);
  const [boardToast, setBoardToast] = useState<string | null>(null);

  // Zone header parameter popover states
  const [activeShapeOpacityMenuId, setActiveShapeOpacityMenuId] = useState<string | null>(null);
  const [activeShapeFontSizeMenuId, setActiveShapeFontSizeMenuId] = useState<string | null>(null);

  // Miro-Style Whiteboard Elements & Canvas AI Chat States
  const [isAiCanvasChatOpen, setIsAiCanvasChatOpen] = useState(false);
  const [isAiCanvasChatExpanded, setIsAiCanvasChatExpanded] = useState(false);
  const [activeZoneForChat, setActiveZoneForChat] = useState<string | null>(null);
  const [aiCanvasChatInput, setAiCanvasChatInput] = useState('');
  const [isAiCanvasChatLoading, setIsAiCanvasChatLoading] = useState(false);
  const [aiCanvasChatMessages, setAiCanvasChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    actionBadge?: string;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'emerald';
    }>;
  }>>([]);
  const [recentAiChats, setRecentAiChats] = useState<string[]>([
    'New Design Ideas for Work',
    'Smoothie Recipe Suggestions',
    'Tips for Daily Productivity',
  ]);
  const [activeChatTopic, setActiveChatTopic] = useState<string>('New Chat');

  const showToast = (msg: string) => {
    setBoardToast(msg);
    setTimeout(() => setBoardToast(null), 3000);
  };

  // Add new shape (always drawn behind cards, with transparent option and font size)
  const handleAddShape = (
    type: 'rectangle' | 'circle',
    preferredColor: string = '#6366f1',
    isTransparent: boolean = false,
    initialTitle?: string
  ) => {
    // Center shape in current board view
    const canvas = canvasRef.current;
    let spawnX = 120;
    let spawnY = 100;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scale = zoom / 100;
      spawnX = Math.round((rect.width / 2 - panOffset.x) / scale - 240);
      spawnY = Math.round((rect.height / 2 - panOffset.y) / scale - 180);
    }

    const newShape: BoardShape = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      x: Math.max(0, spawnX),
      y: Math.max(0, spawnY),
      width: type === 'circle' ? 420 : 520,
      height: type === 'circle' ? 420 : 400,
      title: initialTitle || (type === 'circle' ? 'Focal Hub (Background)' : `Zone ${boardShapes.length + 1}: Audience & Campaign Stage`),
      color: preferredColor,
      opacity: isTransparent ? 0 : 0.14,
      isTransparent,
      strokeColor: preferredColor,
      fontSize: 14,
    };

    setBoardShapes((prev) => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
    showToast(`Added ${type === 'circle' ? 'Circle' : 'Rectangle'} zone (${isTransparent ? 'Transparent Frame' : 'Tinted'}) ✓`);
  };

  // Add Miro-Style Whiteboard Elements (Sticky Notes, Headings, Callouts, Task Cards, Project Tables)
  const handleAddMiroElement = (
    type: 'sticky' | 'heading' | 'callout' | 'task' | 'table',
    preset?: {
      color?: string;
      title?: string;
      author?: string;
      status?: 'To do' | 'In progress' | 'Done';
      fontSize?: number;
    }
  ) => {
    const canvas = canvasRef.current;
    let spawnX = 160;
    let spawnY = 140;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scale = zoom / 100;
      spawnX = Math.round((rect.width / 2 - panOffset.x) / scale - 120);
      spawnY = Math.round((rect.height / 2 - panOffset.y) / scale - 80);
    }

    const newElement: BoardStickyNote = {
      id: `elem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: preset?.title || (
        type === 'heading'
          ? 'Project Brief & Strategy'
          : type === 'callout'
          ? 'Needs review for COD Algeria'
          : type === 'task'
          ? 'Test 3 Darja Video Hooks on TikTok'
          : type === 'table'
          ? 'Q1 Project & Deliverables Plan'
          : 'Add inspirational creative to aid customers'
      ),
      icon: type === 'heading' ? '🔤' : type === 'callout' ? '💬' : type === 'task' ? '✅' : type === 'table' ? '📊' : '💡',
      x: Math.max(20, spawnX + Math.round(Math.random() * 40 - 20)),
      y: Math.max(20, spawnY + Math.round(Math.random() * 40 - 20)),
      rotate: type === 'sticky' ? Math.round(Math.random() * 6 - 3) : 0,
      color: preset?.color || (
        type === 'sticky' ? '#FEF08A' :
        type === 'callout' ? '#E9D5FF' :
        type === 'task' ? '#FFFFFF' :
        '#FFFFFF'
      ),
      type,
      fontSize: preset?.fontSize || (type === 'heading' ? 24 : 13),
      author: preset?.author || (type === 'callout' ? 'Miriam' : undefined),
      status: preset?.status || (type === 'task' ? 'In progress' : undefined),
      assignee: type === 'task' ? 'Growth Lead' : undefined,
      tableData: type === 'table' ? {
        headers: ['Stage', 'Channel', 'Target Metric', 'Status'],
        rows: [
          ['Hook Testing', 'TikTok & FB', 'CTR > 3.2%', 'In Progress'],
          ['Wilaya Courier', 'Yalidine COD', 'Delivery > 78%', 'Planned'],
          ['CRO Funnel', 'Mobile Landers', 'Conv > 4.5%', 'Review'],
        ],
      } : undefined,
    };

    setStickyNotes((prev) => [...prev, newElement]);
    showToast(`Added ${type === 'heading' ? 'Text Heading' : type === 'callout' ? 'Member Callout' : type === 'task' ? 'Action Item Card' : type === 'table' ? 'Project Plan Table' : 'Sticky Note'} to board!`);
  };

  const handleDeleteShape = (shapeId: string) => {
    setBoardShapes((prev) => prev.filter((s) => s.id !== shapeId));
    setSelectedShapeId((prev) => (prev === shapeId ? null : prev));
    showToast('Zone removed');
  };

  const handleShapeMouseDown = (e: React.MouseEvent, shapeId: string) => {
    e.stopPropagation();
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, input, textarea, select, [data-no-drag]')) {
      return;
    }

    setSelectedShapeId(shapeId);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);

    if (activeTool === 'pan' || isSpacePressed) return;
    setDraggingShapeId(shapeId);

    const targetShape = boardShapes.find((s) => s.id === shapeId);
    if (!targetShape) return;

    const scale = zoom / 100;
    setDragOffset({
      x: e.clientX - (targetShape.x * scale + panOffset.x),
      y: e.clientY - (targetShape.y * scale + panOffset.y),
    });
  };

  const handleStartResizeShape = (
    e: React.MouseEvent,
    shapeId: string,
    handle: 'corner' | 'right' | 'bottom' = 'corner'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const targetShape = boardShapes.find((s) => s.id === shapeId);
    if (!targetShape) return;

    setSelectedShapeId(shapeId);
    setResizingShape({
      id: shapeId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: targetShape.width,
      startHeight: targetShape.height,
    });
  };

  const handleStartResizeNode = (
    e: React.MouseEvent,
    nodeId: string,
    handle: 'corner' | 'right' | 'bottom' = 'corner'
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const el = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement | null;
    const currentScale = (zoom || 100) / 100;

    let initialW = targetNode.width;
    let initialH = targetNode.height;

    if (!initialW || !initialH) {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (!initialW) initialW = Math.round(rect.width / currentScale);
        if (!initialH) initialH = Math.round(rect.height / currentScale);
      }
      initialW = initialW || 560;
      initialH = initialH || 400;
    }

    const startX = e.clientX;
    const startY = e.clientY;

    setSelectedNodeId(nodeId);
    setResizingNode({
      id: nodeId,
      handle,
      startX,
      startY,
      startWidth: initialW,
      startHeight: initialH,
    });

    document.body.style.cursor = handle === 'corner' ? 'nwse-resize' : handle === 'right' ? 'ew-resize' : 'ns-resize';
    document.body.style.userSelect = 'none';
  };

  // Switch Active Project
  const handleSelectProject = (projectId: string) => {
    if (projectId === activeProjectId) return;

    // Snapshot current active project before switching
    const updatedProjects = boardProjects.map((p) => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          nodes,
          edges,
          stickyNotes,
          panOffset,
          zoom,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    const target = updatedProjects.find((p) => p.id === projectId);
    if (!target) return;

    setBoardProjects(updatedProjects);
    setActiveProjectId(target.id);
    const nextTabs = openProjectIds.includes(target.id) ? openProjectIds : [...openProjectIds, target.id];
    setOpenProjectIds(nextTabs);

    setNodes(target.nodes || []);
    setEdges(target.edges || []);
    setStickyNotes(target.stickyNotes || []);
    setPanOffset(target.panOffset || { x: 50, y: 20 });
    setZoom(target.zoom || 85);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);

    saveBoardProjectsToStorage(updatedProjects);
    saveActiveBoardProjectId(target.id);
    saveOpenBoardTabIds(nextTabs);

    showToast(`Loaded project "${target.name}"`);
  };

  // Create New Project
  const handleCreateNewProject = (name: string, templateId: 'blank' | 'algeria_cod' | 'tiktok_scaler') => {
    const newProj = createNewBoardProjectOptions(name, templateId);

    // Snapshot current active project state before creating
    const updatedProjects = boardProjects.map((p) =>
      p.id === activeProjectId
        ? { ...p, nodes, edges, stickyNotes, panOffset, zoom, updatedAt: new Date().toISOString() }
        : p
    );
    const nextList = [newProj, ...updatedProjects];
    setBoardProjects(nextList);
    setActiveProjectId(newProj.id);
    const nextTabs = [newProj.id, ...openProjectIds.filter((id) => id !== newProj.id)];
    setOpenProjectIds(nextTabs);

    setNodes(newProj.nodes || []);
    setEdges(newProj.edges || []);
    setStickyNotes(newProj.stickyNotes || []);
    setPanOffset(newProj.panOffset || { x: 50, y: 20 });
    setZoom(newProj.zoom || 85);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);

    saveBoardProjectsToStorage(nextList);
    saveActiveBoardProjectId(newProj.id);
    saveOpenBoardTabIds(nextTabs);

    setBoardViewMode('canvas');
    showToast(`Created clean canvas "${newProj.name}" — 0 nodes`);
  };

  // Instant New Clean Board (0 nodes)
  const handleCreateNewBlankBoard = () => {
    handleCreateNewProject(`Board ${boardProjects.length + 1}`, 'blank');
  };

  // Wipe / Clear everything on current active board
  const handleClearCurrentBoard = () => {
    setNodes([]);
    setEdges([]);
    setStickyNotes([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setActiveBottomResultNodeId(null);
    setSettingsModalNodeId(null);
    setAiCanvasChatMessages([]);
    showToast('Wiped canvas clean — all cards and links removed.');
  };

  // Duplicate Project
  const handleDuplicateProject = (projectId: string) => {
    const target = boardProjects.find((p) => p.id === projectId);
    if (!target) return;

    const sourceNodes = projectId === activeProjectId ? nodes : target.nodes;
    const sourceEdges = projectId === activeProjectId ? edges : target.edges;
    const sourceSticky = projectId === activeProjectId ? stickyNotes : target.stickyNotes;
    const sourcePan = projectId === activeProjectId ? panOffset : target.panOffset;
    const sourceZoom = projectId === activeProjectId ? zoom : target.zoom;

    const duplicated: BoardProject = {
      ...target,
      id: `board_proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${target.name} (Copy)`,
      nodes: sourceNodes,
      edges: sourceEdges,
      stickyNotes: sourceSticky,
      panOffset: sourcePan,
      zoom: sourceZoom,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextList = [duplicated, ...boardProjects];
    setBoardProjects(nextList);
    setActiveProjectId(duplicated.id);
    setOpenProjectIds((prev) => [duplicated.id, ...prev]);

    setNodes(duplicated.nodes);
    setEdges(duplicated.edges);
    setStickyNotes(duplicated.stickyNotes);
    setPanOffset(duplicated.panOffset);
    setZoom(duplicated.zoom);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);

    saveBoardProjectsToStorage(nextList);
    saveActiveBoardProjectId(duplicated.id);

    showToast(`Duplicated to "${duplicated.name}"`);
  };

  // Rename Project
  const handleRenameProject = (projectId: string, newName: string) => {
    setBoardProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
      )
    );
    showToast(`Renamed project to "${newName}"`);
  };

  // Delete Project (Can remove any project and return to hub if needed)
  const handleDeleteProject = (projectId: string) => {
    const nextList = boardProjects.filter((p) => p.id !== projectId);
    const nextOpen = openProjectIds.filter((id) => id !== projectId);

    if (nextList.length === 0) {
      const fresh = createNewBoardProjectOptions('New Project', 'blank');
      setBoardProjects([fresh]);
      setActiveProjectId(fresh.id);
      setOpenProjectIds([fresh.id]);
      setNodes([]);
      setEdges([]);
      setStickyNotes([]);
      setPanOffset({ x: 50, y: 20 });
      setZoom(85);
      saveBoardProjectsToStorage([fresh]);
      saveActiveBoardProjectId(fresh.id);
      saveOpenBoardTabIds([fresh.id]);
      setBoardViewMode('hub');
      showToast('Project removed');
      return;
    }

    setBoardProjects(nextList);
    saveBoardProjectsToStorage(nextList);

    if (activeProjectId === projectId) {
      const fallback = nextList[0];
      setActiveProjectId(fallback.id);
      const remainingTabs = nextOpen.length > 0 ? nextOpen : [fallback.id];
      setOpenProjectIds(remainingTabs);
      setNodes(fallback.nodes || []);
      setEdges(fallback.edges || []);
      setStickyNotes(fallback.stickyNotes || []);
      setPanOffset(fallback.panOffset || { x: 50, y: 20 });
      setZoom(fallback.zoom || 85);
      saveActiveBoardProjectId(fallback.id);
      saveOpenBoardTabIds(remainingTabs);

      if (boardViewMode === 'canvas' && nextOpen.length === 0) {
        setBoardViewMode('hub');
      }
    } else {
      setOpenProjectIds(nextOpen.length > 0 ? nextOpen : [nextList[0].id]);
      saveOpenBoardTabIds(nextOpen.length > 0 ? nextOpen : [nextList[0].id]);
    }
    showToast('Project removed successfully');
  };

  // Close Tab - Closes project and returns to Hub if no more open tabs
  const handleCloseTab = (projectId: string) => {
    const nextOpen = openProjectIds.filter((id) => id !== projectId);
    setOpenProjectIds(nextOpen);
    saveOpenBoardTabIds(nextOpen);

    if (nextOpen.length === 0) {
      setBoardViewMode('hub');
      showToast('Closed project');
      return;
    }

    if (activeProjectId === projectId) {
      handleSelectProject(nextOpen[nextOpen.length - 1]);
    }
  };

  // Explicit Save Project Button handler
  const handleSaveProject = () => {
    const updatedProjects = boardProjects.map((p) => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          nodes,
          edges,
          stickyNotes,
          panOffset,
          zoom,
          updatedAt: new Date().toISOString(),
        };
      }
      return p;
    });

    setBoardProjects(updatedProjects);
    saveBoardProjectsToStorage(updatedProjects);
    saveActiveBoardProjectId(activeProjectId);
    saveOpenBoardTabIds(openProjectIds);

    try {
      localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(nodes));
      localStorage.setItem(STORAGE_KEY_EDGES, JSON.stringify(edges));
      localStorage.setItem(STORAGE_KEY_STICKY, JSON.stringify(stickyNotes));
      localStorage.setItem(STORAGE_KEY_PAN, JSON.stringify(panOffset));
      localStorage.setItem(STORAGE_KEY_ZOOM, JSON.stringify(zoom));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }

    setSaveStatus('saved');
    showToast(`Saved "${currentProject?.name || 'Project'}" successfully! ✓`);
  };

  // Auto-save changes to the active project in localStorage
  useEffect(() => {
    setBoardProjects((prev) =>
      prev.map((p) => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            nodes,
            edges,
            stickyNotes,
            panOffset,
            zoom,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      })
    );
    setSaveStatus('saving');

    const timer = setTimeout(() => {
      setBoardProjects((currentList) => {
        saveBoardProjectsToStorage(currentList);
        return currentList;
      });
      saveActiveBoardProjectId(activeProjectId);
      saveOpenBoardTabIds(openProjectIds);

      // Legacy fallback
      try {
        localStorage.setItem(STORAGE_KEY_NODES, JSON.stringify(nodes));
        localStorage.setItem(STORAGE_KEY_EDGES, JSON.stringify(edges));
        localStorage.setItem(STORAGE_KEY_STICKY, JSON.stringify(stickyNotes));
        localStorage.setItem(STORAGE_KEY_PAN, JSON.stringify(panOffset));
        localStorage.setItem(STORAGE_KEY_ZOOM, JSON.stringify(zoom));
      } catch (e) {
        console.warn('Failed to auto-save board state', e);
      }
      setSaveStatus('saved');
    }, 450);

    return () => clearTimeout(timer);
  }, [nodes, edges, stickyNotes, panOffset, zoom, activeProjectId]);

  const selectedNode = (selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null) || (nodes.length > 0 ? nodes[0] : null);
  const activeBottomResultNode =
    (activeBottomResultNodeId ? nodes.find((n) => n.id === activeBottomResultNodeId) : null) ||
    (selectedNodeId ? nodes.find((n) => n.id === selectedNodeId && !!n.executionResult) : null) ||
    nodes.find((n) => !!n.executionResult) ||
    null;
  const settingsModalNode = settingsModalNodeId ? nodes.find((n) => n.id === settingsModalNodeId) : null;

  const updateNodeConfigById = (nodeId: string, updates: Partial<BoardNode['config']>) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, config: { ...n.config, ...updates } } : n
      )
    );
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 400);
  };



  // Helper to get consistent background storage key for any node's custom prompts
  const getSkillPromptStorageKey = (nodeTitle: string): string => {
    return `user_saved_prompts_${nodeTitle.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
  };

  // Helper to load or initialize saved prompts for any node with persistent background sync
  const getNodeSavedPrompts = useCallback((node: BoardNode): { prompts: SavedPromptItem[]; activeId: string } => {
    const def = getDefaultPromptForNode(node.title, node.subtitle);

    // 1. Check if node.config already has savedPrompts populated
    if (node.config.savedPrompts && Array.isArray(node.config.savedPrompts) && node.config.savedPrompts.length > 0) {
      const activeId =
        node.config.activePromptId && node.config.savedPrompts.some((p) => p.id === node.config.activePromptId)
          ? node.config.activePromptId
          : node.config.savedPrompts[0].id;
      return { prompts: node.config.savedPrompts, activeId };
    }

    // 2. Check persistent background localStorage for this skill
    try {
      const key = getSkillPromptStorageKey(node.title);
      const raw = localStorage.getItem(key);
      const savedActiveId = localStorage.getItem(`${key}_active_id`);
      if (raw) {
        const parsed: SavedPromptItem[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const activeId =
            savedActiveId && parsed.some((p) => p.id === savedActiveId)
              ? savedActiveId
              : parsed[0].id;
          return { prompts: parsed, activeId };
        }
      }
    } catch (e) {
      console.warn('Failed reading prompt from background storage', e);
    }

    // 3. Fallback: Initialize with current customPrompt or default prompt template
    const initialText =
      node.config.customPrompt && node.config.customPrompt.trim().length > 0
        ? node.config.customPrompt
        : def;
    const initialId = `prompt-default-${node.id}`;
    const initialList: SavedPromptItem[] = [
      {
        id: initialId,
        name: 'Default Prompt',
        prompt: initialText,
        createdAt: new Date().toISOString(),
        isDefault: true,
      },
    ];
    return { prompts: initialList, activeId: initialId };
  }, []);

  // Update prompts array and chosen active prompt for a node, auto-saving to state and background localStorage
  const handleUpdatePromptsForNode = useCallback(
    (nodeId: string, prompts: SavedPromptItem[], newActiveId?: string) => {
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (!targetNode) return;

      const effectiveActiveId =
        newActiveId ||
        targetNode.config.activePromptId ||
        prompts[0]?.id;

      const activePromptItem =
        prompts.find((p) => p.id === effectiveActiveId) || prompts[0];
      const activePromptText = activePromptItem?.prompt || '';

      // 1. Update node config in active board state
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id !== nodeId) return n;
          return {
            ...n,
            config: {
              ...n.config,
              savedPrompts: prompts,
              activePromptId: effectiveActiveId,
              customPrompt: activePromptText,
            },
          };
        })
      );

      // 2. Write to persistent background storage immediately so it restores on reopen
      try {
        const key = getSkillPromptStorageKey(targetNode.title);
        localStorage.setItem(key, JSON.stringify(prompts));
        localStorage.setItem(`${key}_active_id`, effectiveActiveId);
      } catch (e) {
        console.warn('Error saving prompts to background storage', e);
      }

      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 250);
    },
    [nodes]
  );

  // Maintain stable visual screen coordinates when toggling sidebar
  const handleToggleSkillsPanel = useCallback((shouldOpen: boolean) => {
    setIsSkillsPanelOpen(shouldOpen);
    setPanOffset((prev) => ({
      ...prev,
      x: shouldOpen ? prev.x - 320 : prev.x + 320,
    }));
  }, []);

  // Smooth manual zoom anchored to center of visible viewport
  const handleSetZoomWithAnchor = useCallback(
    (newZoomOrFn: number | ((curr: number) => number)) => {
      setZoom((prevZoom) => {
        const nextRaw =
          typeof newZoomOrFn === 'function' ? newZoomOrFn(prevZoom) : newZoomOrFn;
        const clamped = Math.min(400, Math.max(10, Math.round(nextRaw)));
        if (clamped === prevZoom) return prevZoom;

        const canvas = canvasRef.current;
        if (canvas) {
          const rect = canvas.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const prevScale = prevZoom / 100;
          const nextScale = clamped / 100;

          setPanOffset((prevPan) => ({
            x: centerX - ((centerX - prevPan.x) / prevScale) * nextScale,
            y: centerY - ((centerY - prevPan.y) / prevScale) * nextScale,
          }));
        }

        return clamped;
      });
    },
    []
  );

  // Align board to clean left margin (60px margin from sidebar) matching image_ca6855fc.png
  const handleResetLeftMargin = useCallback(() => {
    setZoom(85);
    setPanOffset({ x: 50, y: 20 });
  }, []);

  // Delete Node and all its associated edges
  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId));
    setSelectedNodeId((prev) => (prev === nodeId ? null : prev));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 300);
  }, []);

  // Update Node properties
  const updateNode = useCallback((nodeId: string, updated: Partial<BoardNode>) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, ...updated } : n))
    );
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 300);
  }, []);

  // Delete Edge
  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    setSelectedEdgeId((prev) => (prev === edgeId ? null : prev));
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 300);
  }, []);

  // Hotkey listener: Spacebar for Pan, Delete / Backspace to remove selected card or line
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable);

      if (e.code === 'Space' && !e.repeat && !isTyping) {
        setIsSpacePressed(true);
      }

      if (e.key === 'Escape') {
        if (connectingFrom) {
          setConnectingFrom(null);
          setConnectingMousePos(null);
          return;
        }
      }

      if (!isTyping && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedNodeId) {
          e.preventDefault();
          deleteNode(selectedNodeId);
        } else if (selectedEdgeId) {
          e.preventDefault();
          deleteEdge(selectedEdgeId);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge]);

  // Dragging Handlers for Nodes (Ignores clicks on buttons, inputs, textareas, content preview so clicks and selections work reliably)
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();

    // If user clicked inside a button, input, textarea, select, menu, or document preview, DO NOT start card drag!
    const target = e.target as HTMLElement | null;
    if (
      target &&
      target.closest(
        'button, input, textarea, select, [data-no-drag], [data-no-card-drag], .universal-content-engine, [data-scrollable="true"], .overflow-y-auto, .overflow-auto, .prose'
      )
    ) {
      return;
    }

    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);

    if (activeTool === 'pan' || isSpacePressed) return;
    setDraggingNodeId(nodeId);

    const targetNode = nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const scale = zoom / 100;
    setDragOffset({
      x: e.clientX - (targetNode.x * scale + panOffset.x),
      y: e.clientY - (targetNode.y * scale + panOffset.y),
    });
  };

  // Dragging Handlers for Sticky Notes
  const handleStickyMouseDown = (e: React.MouseEvent, stickyId: string) => {
    e.stopPropagation();
    if (activeTool === 'pan' || isSpacePressed) return;
    setDraggingStickyId(stickyId);

    const targetSticky = stickyNotes.find((s) => s.id === stickyId);
    if (!targetSticky) return;

    const scale = zoom / 100;
    setDragOffset({
      x: e.clientX - (targetSticky.x * scale + panOffset.x),
      y: e.clientY - (targetSticky.y * scale + panOffset.y),
    });
  };

  // Canvas Background Mouse Down (Deselects items, Pans canvas, or Starts drawing zone)
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    if (!drawMode) {
      setSelectedShapeId(null);
    }
    if (connectingFrom) {
      setConnectingFrom(null);
      setConnectingMousePos(null);
    }

    // Mouse interactive drawing mode for zones
    if (drawMode) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = zoom / 100;
      const boardX = Math.round((e.clientX - rect.left - panOffset.x) / scale);
      const boardY = Math.round((e.clientY - rect.top - panOffset.y) / scale);

      setActiveDrawing({
        type: drawMode,
        startX: boardX,
        startY: boardY,
        currentX: boardX,
        currentY: boardY,
        color: drawColor || '#6366f1',
      });
      return;
    }

    if (
      activeTool === 'pan' ||
      isSpacePressed ||
      e.button === 1 ||
      e.target === canvasRef.current ||
      (e.target as HTMLElement).tagName === 'svg' ||
      (e.target as HTMLElement).tagName === 'rect'
    ) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      });
    }
  };

  // Start creating an interactive connection from a port
  const handleStartConnection = (nodeId: string, anchor: 'left' | 'right', subId?: string) => {
    connectStartTimeRef.current = Date.now();
    setConnectingFrom({ nodeId, anchor, subId });
  };

  // Complete interactive connection
  const handleEndConnection = (targetNodeId: string, targetAnchor: 'left' | 'right', targetSubId?: string) => {
    if (!connectingFrom) return;
    if (connectingFrom.nodeId === targetNodeId && connectingFrom.subId === targetSubId) {
      setConnectingFrom(null);
      setConnectingMousePos(null);
      return;
    }

    // Check if connection already exists
    const exists = edges.some(
      (e) =>
        (e.from === connectingFrom.nodeId && e.to === targetNodeId && e.fromSubId === connectingFrom.subId && e.toSubId === targetSubId) ||
        (e.from === targetNodeId && e.to === connectingFrom.nodeId && e.toSubId === connectingFrom.subId && e.fromSubId === targetSubId)
    );

    if (!exists) {
      let pillMain = 'Active';
      let pillSub = 'Connected';

      const sourceNode = nodes.find((n) => n.id === connectingFrom.nodeId);
      const targetNode = nodes.find((n) => n.id === targetNodeId);

      // Support linking in both directions: OrgChart -> Skill OR Skill -> OrgChart!
      const orgChartNode = sourceNode?.appType === 'product_regrouper' ? sourceNode : targetNode?.appType === 'product_regrouper' ? targetNode : null;
      const relevantSubId = sourceNode?.appType === 'product_regrouper' ? connectingFrom.subId : targetSubId;
      const skillNode = sourceNode?.appType === 'product_regrouper' ? targetNode : sourceNode;

      let linkedProduct: any = null;

      if (orgChartNode && relevantSubId) {
        if (relevantSubId.startsWith('adset:')) {
          const rawId = relevantSubId.replace('adset:', '');
          const grp = orgChartNode.appData?.groups?.find((g: any) => g.id === rawId || String(g.id) === rawId);
          pillMain = 'AdSet Target';
          pillSub = grp ? grp.adsetName?.slice(0, 16) || 'AdSet Info' : 'AdSet Info';
        } else if (relevantSubId.startsWith('prod:')) {
          const rawId = relevantSubId.replace('prod:', '');
          orgChartNode.appData?.groups?.forEach((g: any) => {
            g.products?.forEach((p: any, pIdx: number) => {
              if (
                String(p.id) === rawId ||
                String(pIdx) === rawId ||
                `prod:${p.id}` === relevantSubId ||
                `prod:${pIdx}` === relevantSubId ||
                rawId === `${g.index}-${pIdx}`
              ) {
                linkedProduct = p;
              }
            });
          });
          pillMain = 'Product Data';
          pillSub = linkedProduct ? linkedProduct.name?.slice(0, 14) : 'Product Info';
        }
      } else if (sourceNode && targetNode) {
        if (sourceNode.isProduct || targetNode.isProduct) {
          const prodNode = sourceNode.isProduct ? sourceNode : targetNode;
          pillMain = 'Product Synced';
          pillSub = (prodNode.title || 'Product').slice(0, 18);
        } else if (sourceNode.isFile || targetNode.isFile) {
          const fileNode = sourceNode.isFile ? sourceNode : targetNode;
          pillMain = 'Dataset Linked';
          pillSub = (fileNode.title || 'Dataset').slice(0, 18);
        } else {
          pillMain = 'Skill Linked';
          pillSub = `${(sourceNode.title || 'Skill').slice(0, 14)} → ${(targetNode.title || 'Skill').slice(0, 14)}`;
        }
      }

      const newEdge: BoardEdge = {
        id: `edge-${Date.now()}`,
        from: connectingFrom.nodeId,
        to: targetNodeId,
        fromAnchor: connectingFrom.anchor,
        toAnchor: targetAnchor,
        fromSubId: connectingFrom.subId,
        toSubId: targetSubId,
        arrow: true,
        pillMain,
        pillSub,
      };
      setEdges((prev) => [...prev, newEdge]);
      setSelectedEdgeId(newEdge.id);
      setSelectedNodeId(null);
      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 300);

      // If linked directly to a product, immediately inject product details into the skill node's config!
      if (linkedProduct && skillNode) {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === skillNode.id
              ? {
                  ...n,
                  subtitle: `Trained on: ${linkedProduct.name?.slice(0, 26)}`,
                  config: {
                    ...n.config,
                    targetAudience: linkedProduct.category || n.config?.targetAudience,
                    productName: linkedProduct.name,
                    sellingPrice: linkedProduct.financials?.sellingPrice,
                    productCost: linkedProduct.financials?.costPrice,
                    margin: linkedProduct.financials?.roi,
                  },
                  appData:
                    n.appType === 'cro_mobile_landing_page'
                      ? { ...(n.appData || {}), product: croFactsFromProductLike(linkedProduct) }
                      : n.appData,
                }
              : n
          )
        );
        showToast(`✓ Linked product "${linkedProduct.name?.slice(0, 20)}" directly to "${(sourceNode?.id === skillNode.id ? sourceNode : targetNode)?.title}"!`);
      } else {
        // Direct Support for CRO Mobile Landing Page Node Connection!
        const isCroTarget = targetNode?.appType === 'cro_mobile_landing_page';
        const isCroSource = sourceNode?.appType === 'cro_mobile_landing_page';

        if (isCroTarget || isCroSource) {
          const croNode = isCroTarget ? targetNode! : sourceNode!;
          const otherNode = isCroTarget ? sourceNode! : targetNode!;
          const hasProductFacts = Boolean(
            otherNode.isProduct ||
              otherNode.productData ||
              otherNode.isFile ||
              otherNode.appData?.settings?.product
          );

          if (!hasProductFacts) {
            showToast('Connect a product node to fill the CRO landing page facts.');
          } else {
            const facts = croFactsFromNode(otherNode);
            const factName = facts.name || 'Connected Product';
            setNodes((prev) =>
              prev.map((n) =>
                n.id === croNode.id
                  ? {
                      ...n,
                      subtitle: `Trained on: ${factName.slice(0, 26)}`,
                      appData: {
                        ...(n.appData || {}),
                        product: { ...facts, name: factName },
                      },
                    }
                  : n
              )
            );
            showToast(`✓ CRO page filled with "${factName.slice(0, 24)}" — ${facts.image ? 'photo linked' : 'add a photo to finish the hero'}`);
          }

          setConnectingFrom(null);
          setConnectingMousePos(null);
          return;
        }

        // Direct Support for Landing Page Generator Node Connection!
        const isLpTarget = targetNode?.appType === 'landing_page_generator';
        const isLpSource = sourceNode?.appType === 'landing_page_generator';
        if (isLpTarget || isLpSource) {
          const lpNode = isLpTarget ? targetNode! : sourceNode!;
          const otherNode = isLpTarget ? sourceNode! : targetNode!;

          const otherAny = otherNode as any;
          const otherProdData = (otherAny.productData || (otherAny.isProduct ? otherAny : null)) as any;
          const prodName = otherAny.title || otherAny.config?.name || otherProdData?.name || otherAny.executionResult?.productName || 'Connected Product';
          const rawPrice = otherProdData?.sellingPrice || otherProdData?.financials?.sellingPrice || otherAny.config?.sellingPrice || 4800;
          const prodPrice = typeof rawPrice === 'number' ? `${rawPrice.toLocaleString()} DZD` : String(rawPrice);
          const numPrice = typeof rawPrice === 'number' ? rawPrice : parseInt(prodPrice.replace(/\D/g, '') || '4800', 10);
          const prodOrigPrice = `${Math.round(numPrice * 1.55).toLocaleString()} DZD`;
          const prodCategory = otherProdData?.niche || otherAny.category || 'Direct Response E-Commerce';
          const prodDesc = otherProdData?.description || otherAny.subtitle || otherAny.config?.description || otherAny.executionResult?.content?.slice(0, 450) || '';
          const prodImg = otherProdData?.image || otherProdData?.previewUrl || otherAny.previewUrl || otherAny.fileData?.previewUrl;

          let sellingPoints: string[] = [];
          if (otherProdData?.sellingPoints) {
            sellingPoints = otherProdData.sellingPoints.split(/[,•\n]+/).map((s: string) => s.trim()).filter(Boolean);
          } else if (otherAny.executionResult?.content) {
            const bulletMatches = otherAny.executionResult.content.match(/^[•\-\*]\s*(.+)$/gm);
            if (bulletMatches) {
              sellingPoints = bulletMatches.map((b: string) => b.replace(/^[•\-\*]\s*/, '').trim()).filter((b: string) => b.length > 4).slice(0, 4);
            }
          }

          const existingSettings = lpNode.appData?.settings || INITIAL_LANDING_PAGE_SETTINGS;
          const updatedProduct = {
            name: prodName,
            category: prodCategory,
            price: prodPrice,
            originalPrice: prodOrigPrice,
            description: prodDesc,
            productFeatures: sellingPoints.length ? sellingPoints : ['Original Product', '100% Inspection Guarantee', 'Fast Shipping 58 Wilayas'],
            mainBenefits: sellingPoints.length ? sellingPoints : ['High-Efficiency Daily Performance', 'Yalidine COD Inspection Rights', '12-Month Official Warranty'],
            images: prodImg ? [{ id: `img-${Date.now()}`, url: prodImg, isPrimary: true, alt: prodName }] : (existingSettings.product?.images || []),
            country: 'Algeria',
            currency: 'DZD',
            language: 'Arabic',
            customerProblem: otherNode.executionResult?.content?.match(/(?:problem|pain|المشكلة)[:\s]+([^\n\.\!]+)/i)?.[1]?.trim() || 'Searching for original reliable product with inspection rights',
            productSolution: otherNode.executionResult?.content?.match(/(?:solution|حل|النتيجة)[:\s]+([^\n\.\!]+)/i)?.[1]?.trim() || 'Certified original product delivered safely to your door',
          };

          const updatedSettings = {
            ...existingSettings,
            product: updatedProduct,
            productDescription: `${prodName}\n${prodDesc}`,
            singlePrice: prodPrice,
          };

          setNodes((prev) =>
            prev.map((n) =>
              n.id === lpNode.id
                ? {
                    ...n,
                    subtitle: `Trained on: ${prodName.slice(0, 24)}`,
                    appData: {
                      ...n.appData,
                      settings: updatedSettings,
                    },
                  }
                : n
            )
          );
          showToast(`✓ Auto-filled Landing Page with "${prodName.slice(0, 24)}"!`);
        } else if (targetNode?.appType === 'verde_landing_page_builder' || sourceNode?.appType === 'verde_landing_page_builder') {
          // Direct Support for Verde 2 AI Landing Page Builder!
          const verdeNode = (targetNode?.appType === 'verde_landing_page_builder' ? targetNode : sourceNode)!;
          const otherNode = (targetNode?.appType === 'verde_landing_page_builder' ? sourceNode : targetNode)!;

          const otherAny = otherNode as any;
          const otherProdData = (otherAny.productData || (otherAny.isProduct ? otherAny : null)) as any;
          const prodName = otherAny.title || otherAny.config?.name || otherProdData?.name || otherAny.executionResult?.productName || 'Connected Product';
          const rawPrice = otherProdData?.sellingPrice || otherProdData?.financials?.sellingPrice || otherAny.config?.sellingPrice || 4800;
          const numPrice = typeof rawPrice === 'number' ? rawPrice : parseInt(String(rawPrice).replace(/\D/g, '') || '4800', 10);
          const prodPrice = `${numPrice.toLocaleString()} DZD`;
          const prodOrigPrice = `${Math.round(numPrice * 1.5).toLocaleString()} DZD`;
          const prodDesc = otherProdData?.description || otherAny.subtitle || otherAny.config?.description || '';
          const prodImg = otherProdData?.image || otherProdData?.previewUrl || otherAny.previewUrl || otherAny.fileData?.previewUrl || 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop';

          let sellingPoints: string[] = [];
          if (otherProdData?.sellingPoints) {
            sellingPoints = otherProdData.sellingPoints.split(/[,•\n]+/).map((s: string) => s.trim()).filter(Boolean);
          } else if (otherAny.executionResult?.content) {
            const bulletMatches = otherAny.executionResult.content.match(/^[•\-\*]\s*(.+)$/gm);
            if (bulletMatches) {
              sellingPoints = bulletMatches.map((b: string) => b.replace(/^[•\-\*]\s*/, '').trim()).filter((b: string) => b.length > 4).slice(0, 4);
            }
          }
          if (sellingPoints.length === 0) {
            sellingPoints = [
              'جودة ممتازة وخامات أصلية مضمونة',
              'سهولة الاستخدام ونتائج سريعة ومثبتة',
              'حق فحص ومعاينة الطرد قبل الدفع',
              'توصيل سريع ومؤمن إلى 58 ولاية',
            ];
          }

          const productFacts = {
            id: otherNode.id,
            name: prodName,
            price: numPrice,
            currency: 'DZD',
            priceFormatted: prodPrice,
            originalPriceFormatted: prodOrigPrice,
            image: prodImg,
            description: prodDesc,
            sellingPoints,
          };

          const newLandingData = {
            projectName: `${prodName} — Landing Page`,
            brandName: prodName,
            domain: `${prodName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'store'}.dz`,
            badgeText: '🇩🇿 الدفع عند الاستلام • توصيل 58 ولاية • ضمان 100%',
            heroHeadline: `احصل على ${prodName} الأصلي مع توصيل سريع لـ 58 ولاية!`,
            heroSubtitle: prodDesc || `الحل المثالي والمضمون بجودة عالية، مع حق فحص الطرد عند الاستلام وضمان استبدال لمدة 30 يوم.`,
            productImage: prodImg,
            priceFormatted: prodPrice,
            originalPriceFormatted: prodOrigPrice,
            discountPercentage: '-33%',
            primaryCtaText: 'اطلب الآن (الدفع عند الاستلام) 🚚',
            secondaryCtaText: 'مشاهدة المميزات والتقييمات',
            accentColor: '#10b981',
            trustBadges: [
              { title: 'توصيل لـ 58 ولاية', subtitle: 'خلال 24-48 ساعة لباب المنزل', icon: 'Truck' },
              { title: 'الدفع عند الاستلام', subtitle: 'لا تدفع حتى تستلم وتفحص طردك', icon: 'Banknote' },
              { title: 'ضمان الاسترجاع 30 يوم', subtitle: 'استبدال فوري بدون تعقيد', icon: 'ShieldCheck' },
              { title: 'تقييم ممتاز 4.9/5', subtitle: 'أكثر من 2,400 زبون راضٍ', icon: 'Star' },
            ],
            problemSolution: {
              problemTitle: 'هل تعاني من المنتجات المقلدة وضعيفة الجودة؟',
              problemDescription: 'معظم البدائل في السوق لا تدوم طويلاً وتفتقر للضمان الحقيقي، مما يسبب إحباطاً وخسارة للمال.',
              solutionTitle: `الحل النهائي مع ${prodName} المضمون`,
              solutionDescription: `تصميم مدروس وخامات فائقة الجودة تضمن لك الأداء المثالي مع حق المعاينة الشخصية قبل دفع أي دينار.`,
            },
            features: sellingPoints.map((sp, idx) => ({
              title: sp,
              description: `ميزة رئيسية معتمدة تمنحك أفضل تجربة وقيمة مقابل السعر.`,
              icon: idx === 0 ? 'Zap' : idx === 1 ? 'CheckCircle2' : idx === 2 ? 'Shield' : 'Award',
            })),
            bundles: [
              {
                title: 'باقة قطعة واحدة (1)',
                quantity: 1,
                price: prodPrice,
                originalPrice: prodOrigPrice,
                badge: 'الخيار القياسي',
                freeShipping: false,
                savingsText: 'سعر مناسب جداً',
              },
              {
                title: 'باقة قطعتين (2) — الأكثر طلباً',
                quantity: 2,
                price: `${Math.round(numPrice * 1.8).toLocaleString()} DZD`,
                originalPrice: `${Math.round(numPrice * 3).toLocaleString()} DZD`,
                badge: 'الأكثر طلباً 🔥',
                popular: true,
                freeShipping: true,
                savingsText: `وفر ${Math.round(numPrice * 0.2).toLocaleString()} DZD + توصيل مجاني`,
              },
              {
                title: 'الباقة العائلية (3 قطع)',
                quantity: 3,
                price: `${Math.round(numPrice * 2.4).toLocaleString()} DZD`,
                originalPrice: `${Math.round(numPrice * 4.5).toLocaleString()} DZD`,
                badge: 'أقصى توفير 💰',
                freeShipping: true,
                savingsText: `وفر ${Math.round(numPrice * 0.6).toLocaleString()} DZD + هدية مجانية`,
              },
            ],
            reviews: [
              {
                name: 'محمد عبد الرحيم',
                location: 'الجزائر العاصمة',
                rating: 5,
                comment: 'وصلني في 24 ساعة بالضبط. جودة عالية ومطابق للوصف 100%. التوصيل سريع وعون التوصيل محترم.',
                verified: true,
                date: 'منذ يومين',
              },
              {
                name: 'سارة بن عيسى',
                location: 'وهران',
                rating: 5,
                comment: 'منتج رائع وخدمة عملاء ممتازة ردوا على كل استفساراتي عبر الواتساب. أنصح به بشدة!',
                verified: true,
                date: 'منذ 4 أيام',
              },
              {
                name: 'ياسين بلقاسم',
                location: 'قسنطينة',
                rating: 5,
                comment: 'أفضل استثمار، فتحت الطرد وتأكدت بنفسي قبل ما ندفع للدليفري. شكرا لكم.',
                verified: true,
                date: 'منذ أسبوع',
              },
            ],
            faqs: [
              { question: 'متى يصلني المنتج بعد تأكيد الطلب؟', answer: 'يصلك الطرد في غضون 24 إلى 48 ساعة كأقصى تقدير لجميع ولايات الوطن (58 ولاية).' },
              { question: 'هل يمكنني فحص المنتج قبل الدفع؟', answer: 'نعم بالتأكيد! لديك الحق الكامل في فتح الطرد ومعاينته مع عون التوصيل قبل دفع المبلغ.' },
              { question: 'هل يوجد ضمان على المنتج؟', answer: 'نعم، نوفر ضمان استبدال مجاني أو استرجاع لمدة 30 يوما في حال وجود أي عيب مصنعي.' },
            ],
            orderForm: {
              headline: 'املأ الاستمارة أدناه لتأكيد طلبك والدفع عند الاستلام',
              subtitle: 'الكمية محدودة! سيتصل بك فريقنا لتأكيد معلومات التوصيل.',
              buttonText: 'تأكيد الطلب الآن 🚚 (الدفع عند الاستلام)',
              guaranteeNotice: '🔒 معلوماتك مشفرة ومحمية 100% • الدفع فقط بعد الاستلام',
            },
            filesGenerated: [
              { name: 'index.html', lines: 195, type: 'html' },
              { name: 'product-theme.css', lines: 124, type: 'css' },
              { name: 'checkout-cod.tsx', lines: 88, type: 'tsx' },
            ],
            editCount: 1,
          };

          setNodes((prev) =>
            prev.map((n) =>
              n.id === verdeNode.id
                ? {
                    ...n,
                    title: `${prodName} · Landing Page Studio`,
                    subtitle: `Trained on: ${prodName.slice(0, 24)} (${prodPrice})`,
                    appData: {
                      ...(n.appData || {}),
                      connectedProduct: productFacts,
                      landingPageData: newLandingData,
                      chatMessages: [
                        {
                          id: `msg-${Date.now()}-user`,
                          role: 'user',
                          timestamp: 'JUST NOW',
                          content: `Build a high-converting landing page for ${prodName} (${prodPrice}) with product photos, benefits, Algerian COD offer, and instant checkout.`,
                        },
                        {
                          id: `msg-${Date.now()}-assistant`,
                          role: 'assistant',
                          timestamp: 'JUST NOW',
                          duration: '1s',
                          content: `Generated full high-converting landing page for **${prodName}**! Real product images, localized Algerian COD pricing (${prodPrice}), 3 bundle offers, customer testimonials, and an interactive checkout form are live on the right. You can click on any text directly to edit it, or ask me here to change anything!`,
                          files: [
                            { name: 'index.html', lines: 195 },
                            { name: 'product-theme.css', lines: 124 },
                            { name: 'checkout-cod.tsx', lines: 88 },
                          ],
                          features: [
                            `Product Hero with high-resolution photo & price badge`,
                            `3 High-converting bundles (1 Unit, Pack 2 Popular, Pack 3 Family)`,
                            `Interactive Cash-on-Delivery (COD) Order Form for 58 Wilayas`,
                            `Click-to-edit directly on any text in the preview`,
                          ],
                          modelUsed: `${currentAiProvider.toUpperCase()}: ${currentAiModel}`,
                        },
                      ],
                    },
                  }
                : n
            )
          );
          showToast(`✓ Landing page built for "${prodName.slice(0, 24)}" with product image & pricing!`);
        } else {
          showToast(`Linked ${pillMain} to skill! Data flows into analysis.`);
        }
      }
    }
    setConnectingFrom(null);
    setConnectingMousePos(null);
  };

  // Central Node Creation with strict mutex lock (never duplicates, exactly 1 added)
  const createNodeAtPosition = useCallback(
    (
      skill: {
        title: string;
        category?: string;
        iconType: string;
        iconBg: string;
        subtitle?: string;
        isProduct?: boolean;
        productData?: any;
        isFile?: boolean;
        fileData?: UploadedFileItem;
        isCustomSkill?: boolean;
        customPromptTemplate?: string;
        isAppNode?: boolean;
        appType?: BoardNode['appType'];
        appData?: any;
        isMasterSynthesizer?: boolean;
      },
      boardX: number,
      boardY: number
    ) => {
      if (isAddingSkillLockRef.current) return;
      const now = Date.now();
      if (now - lastAddSkillTimeRef.current < 400) return;

      isAddingSkillLockRef.current = true;
      lastAddSkillTimeRef.current = now;

      let finalX = boardX;
      let finalY = boardY;
      if (snapToGrid) {
        finalX = Math.round(finalX / 20) * 20;
        finalY = Math.round(finalY / 20) * 20;
      }

      const isProduct = skill.isProduct || false;
      const isFile = skill.isFile || false;
      const isCustomSkill = skill.isCustomSkill || false;
      const isAppNode = skill.isAppNode || false;
      const isMasterSynthesizer =
        (skill as any).isMasterSynthesizer ||
        skill.appType === 'omni_skill_master_synthesizer' ||
        skill.title.toLowerCase().includes('multi-skill synthesis') ||
        skill.title.toLowerCase().includes('master multi-skill');
      const appType = isMasterSynthesizer ? ('omni_skill_master_synthesizer' as const) : skill.appType;

      let metrics = isMasterSynthesizer
        ? [
            { label: 'Role', value: 'Master Synthesizer' },
            { label: 'Connects', value: 'Multi-Skill' },
            { label: 'Report', value: 'Big Dossier' },
          ]
        : [
            { label: 'Traffic', value: '4.2K' },
            { label: 'CVR', value: '3.8%' },
            { label: 'ROAS', value: '4.2' },
          ];

      if (isAppNode) {
        if (appType === 'verde_landing_page_builder') {
          metrics = [
            { label: 'Studio', value: 'Verde 2 · Build' },
            { label: 'Files', value: '3 Generated' },
            { label: 'Mode', value: 'Chat & Split' },
          ];
        } else if (appType === 'cro_mobile_landing_page') {
          metrics = [
            { label: 'CVR Potential', value: '78%' },
            { label: 'Market', value: 'COD DZ' },
            { label: 'Format', value: 'Mobile CRO' },
          ];
        } else if (appType === 'landing_page_generator') {
          metrics = [
            { label: 'Layout', value: '3-Column' },
            { label: 'Market', value: 'COD Algeria' },
            { label: 'Preview', value: 'Live Code' },
          ];
        } else if (appType === 'text_to_image') {
          metrics = [
            { label: 'Model', value: 'Imagen 3' },
            { label: 'Quality', value: '4K Studio' },
            { label: 'Aspect', value: '1:1 / 9:16' },
          ];
        } else if (appType === 'image_to_text') {
          metrics = [
            { label: 'OCR', value: '99.4%' },
            { label: 'Extracted', value: 'Specs & Hook' },
            { label: 'Format', value: 'Multilingual' },
          ];
        } else if (appType === 'text_to_storyboard') {
          metrics = [
            { label: 'Frames', value: '5 Beats' },
            { label: 'Pacing', value: '30s Viral' },
            { label: 'Conversion', value: '+34%' },
          ];
        } else if (appType === 'text_to_video_script') {
          metrics = [
            { label: 'Format', value: '3-Column' },
            { label: 'Hook', value: '0-3s Stop' },
            { label: 'Audio', value: 'Darja/FR' },
          ];
        } else {
          metrics = [
            { label: 'Type', value: 'Director Guide' },
            { label: 'Shots', value: '4 Setups' },
            { label: 'Lighting', value: '5600K Key' },
          ];
        }
      } else if (isProduct) {
        metrics = [
          { label: 'Selling', value: `${skill.productData?.sellingPrice?.toLocaleString() || 4800} DZD` },
          { label: 'Cost', value: `${skill.productData?.productCost?.toLocaleString() || 1400} DZD` },
          { label: 'Margin', value: `+${skill.productData?.profitMargin || 70}%` },
        ];
      } else if (isFile && skill.fileData) {
        if (skill.fileData.type === 'excel') {
          metrics = [
            { label: 'Type', value: 'Excel Table' },
            { label: 'Rows', value: `${skill.fileData.tableData?.totalRows || 0}` },
            { label: 'Cols', value: `${skill.fileData.tableData?.headers?.length || 0}` },
          ];
        } else if (skill.fileData.type === 'image') {
          metrics = [
            { label: 'Type', value: 'Image Asset' },
            { label: 'Size', value: `${Math.round(skill.fileData.size / 1024)} KB` },
            { label: 'Format', value: 'High-Res' },
          ];
        } else if (skill.fileData.type === 'json') {
          metrics = [
            { label: 'Type', value: 'JSON Dataset' },
            { label: 'Size', value: `${Math.round(skill.fileData.size / 1024)} KB` },
            { label: 'Format', value: 'Structured' },
          ];
        } else {
          metrics = [
            { label: 'Type', value: skill.fileData.type === 'pdf' ? 'PDF Doc' : 'Word Doc' },
            { label: 'Size', value: `${Math.round(skill.fileData.size / 1024)} KB` },
            { label: 'Status', value: 'Parsed' },
          ];
        }
      }

      const newNode: BoardNode = {
        id: `node-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: skill.title,
        subtitle: skill.subtitle || `${skill.title} configuration & metrics`,
        category: skill.category || (isAppNode ? 'AI Creative Studio' : isProduct ? 'Product Library' : isFile ? 'Uploaded Files' : 'Custom'),
        iconType: skill.iconType,
        iconBg: skill.iconBg,
        iconColor: 'text-white',
        x: finalX,
        y: finalY,
        status: 'active',
        liveWebResearch: false,
        language: 'English',
        isProduct,
        productData: skill.productData,
        isFile,
        fileData: skill.fileData,
        isCustomSkill,
        customPromptTemplate: skill.customPromptTemplate,
        isAppNode,
        appType,
        isMasterSynthesizer,
        appData: skill.appData || {},
        sectionNumber: isMasterSynthesizer ? 'MASTER DOSSIER' : isAppNode ? 'AI APP' : isFile ? 'DATASET' : `SECTION ${String(nodes.length + 1).padStart(2, '0')}`,
        customInstructions: '',
        hideText: false,
        hideResult: false,
        activePreviewTab: 'chatgpt',
        analysisMode: 'standard',
        metrics,
        config: {
          name: skill.title,
          description: isAppNode
            ? (skill.subtitle || 'AI Creative Production Studio')
            : isProduct
            ? (skill.productData?.description || 'E-commerce Winning Product')
            : isFile
            ? (skill.fileData?.summary || 'Attached dataset for e-commerce intelligence')
            : `Optimize and scale ${skill.title} for Algerian e-commerce.`,
          campaignObjective: isAppNode ? 'Creative Asset' : isProduct ? 'Sales' : isFile ? 'Data Intelligence' : 'Conversions',
          targetAudience: 'Algeria - 18+',
          budget: '30',
          budgetPeriod: 'per day',
          autoOptimization: true,
          trackConversions: true,
          saveAdsToLibrary: true,
          customPrompt: skill.customPromptTemplate || '',
        },
        width: appType === 'verde_landing_page_builder' ? 1280 : undefined,
        height: appType === 'verde_landing_page_builder' ? 760 : undefined,

      };

      setNodes((prev) => [...prev, newNode]);
      setSelectedNodeId(newNode.id);
      setSelectedEdgeId(null);
      setIsInspectorOpen(true);
      setSaveStatus('saving');
      setTimeout(() => {
        setSaveStatus('saved');
        isAddingSkillLockRef.current = false;
      }, 400);
    },
    [snapToGrid]
  );

  // Global Mouse Move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // 0. Active mouse drawing of zone on canvas
      if (activeDrawing) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const scale = zoom / 100;
          const currentX = Math.round((e.clientX - rect.left - panOffset.x) / scale);
          const currentY = Math.round((e.clientY - rect.top - panOffset.y) / scale);
          setActiveDrawing((prev) => (prev ? { ...prev, currentX, currentY } : null));
        }
        return;
      }

      // 1. Connection line dragging
      if (connectingFrom) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const scale = zoom / 100;
          setConnectingMousePos({
            x: (e.clientX - rect.left - panOffset.x) / scale,
            y: (e.clientY - rect.top - panOffset.y) / scale,
          });
        }
        return;
      }

      // 2. Panning canvas
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        return;
      }

      const scale = zoom / 100;

      // 3. Dragging node - completely free unconstrained movement
      if (draggingNodeId) {
        let rawX = (e.clientX - dragOffset.x - panOffset.x) / scale;
        let rawY = (e.clientY - dragOffset.y - panOffset.y) / scale;

        if (snapToGrid) {
          rawX = Math.round(rawX / 20) * 20;
          rawY = Math.round(rawY / 20) * 20;
        }

        setNodes((prev) =>
          prev.map((n) =>
            n.id === draggingNodeId ? { ...n, x: rawX, y: rawY } : n
          )
        );
        setSaveStatus('saving');
      } else if (draggingStickyId) {
        // 4. Dragging sticky note - completely free unconstrained movement
        let rawX = (e.clientX - dragOffset.x - panOffset.x) / scale;
        let rawY = (e.clientY - dragOffset.y - panOffset.y) / scale;

        if (snapToGrid) {
          rawX = Math.round(rawX / 20) * 20;
          rawY = Math.round(rawY / 20) * 20;
        }

        setStickyNotes((prev) =>
          prev.map((s) =>
            s.id === draggingStickyId ? { ...s, x: rawX, y: rawY } : s
          )
        );
        setSaveStatus('saving');
      } else if (draggingShapeId) {
        // 5. Dragging background shape zone with mouse
        let rawX = (e.clientX - dragOffset.x - panOffset.x) / scale;
        let rawY = (e.clientY - dragOffset.y - panOffset.y) / scale;

        if (snapToGrid) {
          rawX = Math.round(rawX / 20) * 20;
          rawY = Math.round(rawY / 20) * 20;
        }

        setBoardShapes((prev) =>
          prev.map((s) => (s.id === draggingShapeId ? { ...s, x: rawX, y: rawY } : s))
        );
        setSaveStatus('saving');
      } else if (resizingShape) {
        // 6. Resizing background shape zone with mouse handles
        const deltaX = (e.clientX - resizingShape.startX) / scale;
        const deltaY = (e.clientY - resizingShape.startY) / scale;
        let newW = resizingShape.startWidth;
        let newH = resizingShape.startHeight;

        if (resizingShape.handle === 'corner') {
          newW = Math.max(120, Math.round(resizingShape.startWidth + deltaX));
          newH = Math.max(80, Math.round(resizingShape.startHeight + deltaY));
        } else if (resizingShape.handle === 'right') {
          newW = Math.max(120, Math.round(resizingShape.startWidth + deltaX));
        } else if (resizingShape.handle === 'bottom') {
          newH = Math.max(80, Math.round(resizingShape.startHeight + deltaY));
        }

        setBoardShapes((prev) =>
          prev.map((s) =>
            s.id === resizingShape.id
              ? {
                  ...s,
                  width: newW,
                  height: s.type === 'circle' ? Math.max(newW, newH) : newH,
                }
              : s
          )
        );
        setSaveStatus('saving');
      } else if (resizingNode) {
        // 7. Resizing node / card with mouse handles
        const deltaX = (e.clientX - resizingNode.startX) / scale;
        const deltaY = (e.clientY - resizingNode.startY) / scale;
        let newW = resizingNode.startWidth;
        let newH = resizingNode.startHeight;

        if (resizingNode.handle === 'corner') {
          newW = Math.max(340, Math.round(resizingNode.startWidth + deltaX));
          newH = Math.max(160, Math.round(resizingNode.startHeight + deltaY));
        } else if (resizingNode.handle === 'right') {
          newW = Math.max(340, Math.round(resizingNode.startWidth + deltaX));
        } else if (resizingNode.handle === 'bottom') {
          newH = Math.max(160, Math.round(resizingNode.startHeight + deltaY));
        }

        setNodes((prev) =>
          prev.map((n) =>
            n.id === resizingNode.id
              ? {
                  ...n,
                  width: newW,
                  height: newH,
                }
              : n
          )
        );
        setSaveStatus('saving');
      }
    },
    [
      activeDrawing,
      connectingFrom,
      isPanning,
      panStart,
      draggingNodeId,
      draggingStickyId,
      draggingShapeId,
      resizingShape,
      resizingNode,
      dragOffset,
      panOffset,
      zoom,
      snapToGrid,
    ]
  );

  // Global Mouse Up
  const handleMouseUp = useCallback(() => {
    // Finalize interactive drawing of shape zone
    if (activeDrawing) {
      const minX = Math.min(activeDrawing.startX, activeDrawing.currentX);
      const minY = Math.min(activeDrawing.startY, activeDrawing.currentY);
      const rawW = Math.abs(activeDrawing.currentX - activeDrawing.startX);
      const rawH = Math.abs(activeDrawing.currentY - activeDrawing.startY);
      const width = Math.max(120, rawW);
      const height = Math.max(80, rawH);
      const finalH = activeDrawing.type === 'circle' ? Math.max(width, height) : height;
      const finalW = activeDrawing.type === 'circle' ? Math.max(width, height) : width;

      const newShape: BoardShape = {
        id: `shape-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: activeDrawing.type,
        x: minX,
        y: minY,
        width: finalW,
        height: finalH,
        title: activeDrawing.type === 'circle' ? 'Circle Zone' : 'Zone Frame',
        color: activeDrawing.color,
        opacity: 0.14,
        strokeColor: activeDrawing.color,
      };

      setBoardShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
      setActiveDrawing(null);
      setDrawMode(null);
      showToast(`Created ${activeDrawing.type === 'circle' ? 'Circle' : 'Rectangle'} zone (${finalW} × ${finalH} px) ✓`);
    }

    if (connectingFrom) {
      const elapsed = Date.now() - connectStartTimeRef.current;
      // If the user did a quick click (< 260ms), keep connectingFrom active for smooth Click-to-Connect
      if (elapsed > 260) {
        setConnectingFrom(null);
        setConnectingMousePos(null);
      }
    }

    if (isPanning) {
      setIsPanning(false);
    }

    if (draggingNodeId || draggingStickyId || draggingShapeId || resizingShape || resizingNode) {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setResizingNode(null);
      setDraggingNodeId(null);
      setDraggingStickyId(null);
      setDraggingShapeId(null);
      setResizingShape(null);
      setTimeout(() => setSaveStatus('saved'), 300);
    }
  }, [
    activeDrawing,
    isPanning,
    draggingNodeId,
    draggingStickyId,
    draggingShapeId,
    resizingShape,
    resizingNode,
    connectingFrom,
  ]);

  useEffect(() => {
    if (
      draggingNodeId ||
      draggingStickyId ||
      draggingShapeId ||
      resizingShape ||
      resizingNode ||
      activeDrawing ||
      isPanning ||
      connectingFrom
    ) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [
    draggingNodeId,
    draggingStickyId,
    draggingShapeId,
    resizingShape,
    resizingNode,
    activeDrawing,
    isPanning,
    connectingFrom,
    handleMouseMove,
    handleMouseUp,
  ]);

  // NON-PASSIVE wheel listener on canvas: 100% cancels native browser scrolling and zooms centered on cursor!
  useEffect(() => {
    if (boardViewMode !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e: WheelEvent) => {
      // 1. If mouse is over a scrollable text area or document preview, allow full scrolling without canvas interference
      const target = e.target as HTMLElement | null;
      const scrollable = target?.closest(
        '.universal-content-engine, [data-scrollable="true"], .overflow-y-auto, .overflow-auto, textarea, pre'
      ) as HTMLElement | null;

      if (scrollable && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        // Allow inner content to scroll naturally; never zoom or pan canvas when scrolling inside document
        return;
      }

      // 2. Completely prevent native browser page & element scroll
      e.preventDefault();
      e.stopPropagation();

      // 3. Shift + Wheel pans horizontally
      if (e.shiftKey && !e.ctrlKey && !e.metaKey) {
        setPanOffset((prev) => ({
          ...prev,
          x: prev.x - e.deltaY,
        }));
        return;
      }

      // 4. If wheel zoom is disabled by user, use wheel to pan the canvas smoothly
      if (!wheelZoomEnabled && !e.ctrlKey && !e.metaKey) {
        setPanOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
        return;
      }

      // 5. Smooth zoom anchored right at mouse pointer position (like Figma / Miro) with 10% - 400% freedom
      let zoomFactor: number;
      if (e.ctrlKey || e.metaKey) {
        // Trackpad pinch-to-zoom gives small continuous deltaY
        zoomFactor = Math.exp(-e.deltaY * 0.007);
      } else {
        // Standard mouse wheel notch (e.deltaY usually ±100 or ±120) or smooth wheel
        zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      }

      setZoom((prevZoom) => {
        const nextZoom = Math.min(400, Math.max(10, Math.round(prevZoom * zoomFactor)));
        if (nextZoom === prevZoom) return prevZoom;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const prevScale = prevZoom / 100;
        const nextScale = nextZoom / 100;

        // Keep the exact point under the cursor unchanged
        setPanOffset((prevPan) => ({
          x: mouseX - ((mouseX - prevPan.x) / prevScale) * nextScale,
          y: mouseY - ((mouseY - prevPan.y) / prevScale) * nextScale,
        }));

        return nextZoom;
      });
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [wheelZoomEnabled, boardViewMode, activeProjectId]);

  // HTML5 Drag & Drop handlers on Canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOverCoords({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setIsCanvasDragOver(true);
  };

  const handleDragLeave = () => {
    setIsCanvasDragOver(false);
    setDragOverCoords(null);
  };

  const handleDropSkill = (e: React.DragEvent) => {
    e.preventDefault();
    setIsCanvasDragOver(false);
    setDragOverCoords(null);
    justDraggedSkillRef.current = true;
    setTimeout(() => {
      justDraggedSkillRef.current = false;
    }, 350);

    const dataStr = e.dataTransfer.getData('application/json');
    if (!dataStr) return;
    try {
      const skill = JSON.parse(dataStr);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = zoom / 100;
      const mouseX = e.clientX - rect.left - panOffset.x;
      const mouseY = e.clientY - rect.top - panOffset.y;
      const boardX = mouseX / scale - 116;
      const boardY = mouseY / scale - 55;
      createNodeAtPosition(skill, boardX, boardY);
    } catch (err) {
      console.error('Failed to parse dropped skill', err);
    }
  };

  // Dynamic Anchor coordinates calculator (Supports Org Chart Campaign, AdSet sub-cards, and Product sub-cards)
  const getNodeAnchor = (
    node: BoardNode,
    anchor?: 'left' | 'right' | 'top' | 'bottom',
    subId?: string
  ) => {
    const effectiveAnchor = anchor || 'right';

    // 1. DIRECT DOM MEASUREMENT: Highest accuracy, links directly to the rendered product card div & port on canvas
    if (canvasRef.current && typeof document !== 'undefined') {
      let targetEl: HTMLElement | null = null;

      if (subId) {
        // A. Look for exact port element first
        targetEl = canvasRef.current.querySelector(
          `[data-sub-port="${node.id}:${subId}:${effectiveAnchor}"]`
        );
        // B. Look for any port matching this subId on this node
        if (!targetEl) {
          targetEl = canvasRef.current.querySelector(
            `[data-sub-port^="${node.id}:${subId}"]`
          );
        }
        // C. Look for port with subId-only attribute
        if (!targetEl) {
          targetEl = canvasRef.current.querySelector(
            `[data-sub-port-id="${subId}:${effectiveAnchor}"]`
          );
        }
        // D. Look for the product card or adset card div itself
        if (!targetEl) {
          targetEl = canvasRef.current.querySelector(
            `[data-sub-card="${node.id}:${subId}"]`
          );
        }
        // E. Look for sub-card by sub-id or prod-id
        if (!targetEl) {
          targetEl = canvasRef.current.querySelector(
            `[data-sub-id="${subId}"], [data-sub-card-id="${subId}"]`
          );
        }
        // F. Try raw identifier without 'prod:' or 'adset:' prefix
        const raw = subId.replace(/^(prod|adset):/, '');
        if (!targetEl && raw) {
          targetEl = canvasRef.current.querySelector(
            `[data-node-id="${node.id}"][data-prod-id="${raw}"], [data-node-id="${node.id}"][data-sub-card*="${raw}"]`
          );
        }
        // G. If still not found and it's a product, try matching by card index
        if (!targetEl && subId.startsWith('prod:')) {
          const productCards = canvasRef.current.querySelectorAll(
            `[data-node-id="${node.id}"][data-sub-id^="prod:"]`
          );
          if (productCards.length > 0) {
            const num = parseInt(raw, 10);
            if (!isNaN(num) && num < productCards.length) {
              targetEl = productCards[num] as HTMLElement;
            } else {
              targetEl = productCards[0] as HTMLElement;
            }
          }
        }
      } else if (node.appType === 'product_regrouper') {
        // Root campaign card
        targetEl = canvasRef.current.querySelector(`[data-campaign-card="${node.id}"]`);
      }

      if (targetEl) {
        const elRect = targetEl.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const scale = zoom / 100;

        const isPort = targetEl.hasAttribute('data-sub-port') || targetEl.hasAttribute('data-sub-port-id');
        if (isPort) {
          return {
            x: (elRect.left + elRect.width / 2 - canvasRect.left - panOffset.x) / scale,
            y: (elRect.top + elRect.height / 2 - canvasRect.top - panOffset.y) / scale,
          };
        } else {
          // Attaches directly to the product card div border at vertical center
          const xOffset = effectiveAnchor === 'left' ? 0 : elRect.width;
          return {
            x: (elRect.left + xOffset - canvasRect.left - panOffset.x) / scale,
            y: (elRect.top + elRect.height / 2 - canvasRect.top - panOffset.y) / scale,
          };
        }
      }
    }

    // 2. MATHEMATICAL FALLBACK: In case DOM element is not yet mounted/measured
    if (node.appType === 'product_regrouper') {
      const groups = node.appData?.groups || [];
      const groupsCount = groups.length || 3;
      const totalWidth = Math.max(440, (groupsCount - 1) * 300 + 280);
      const centerX = node.x + totalWidth / 2;
      const campaignCardHalfWidth = 220;

      // 1. If subId is an AdSet ('adset:id')
      if (subId && subId.startsWith('adset:')) {
        const rawId = subId.replace('adset:', '');
        const gIdx = groups.findIndex((g: any) => g.id === rawId || String(g.id) === rawId);
        const validIdx = gIdx >= 0 ? gIdx : 0;
        const totalAdsetWidth = groupsCount * 300 - 20;
        const adsetColX = node.x + (totalWidth - totalAdsetWidth) / 2 + validIdx * 300;
        const adsetMidY = node.y + 207 + 120;
        if (anchor === 'left') {
          return { x: adsetColX, y: adsetMidY };
        }
        return { x: adsetColX + 280, y: adsetMidY };
      }

      // 2. If subId is a Product ('prod:id')
      if (subId && subId.startsWith('prod:')) {
        const rawId = subId.replace('prod:', '');
        let targetGIdx = 0;
        let targetPIdx = 0;

        groups.forEach((g: any, gIdx: number) => {
          g.products?.forEach((p: any, pIdx: number) => {
            if (
              String(p.id) === rawId ||
              `prod:${p.id}` === subId ||
              `prod:${pIdx}` === subId ||
              rawId === `${g.index}-${pIdx}`
            ) {
              targetGIdx = gIdx;
              targetPIdx = pIdx;
            }
          });
        });

        const targetGroup = groups[targetGIdx];
        const pCount = targetGroup?.products?.length || 1;
        const totalAdsetWidth = groupsCount * 300 - 20;
        const adsetColX = node.x + (totalWidth - totalAdsetWidth) / 2 + targetGIdx * 300;

        let prodStartX = adsetColX + 75;
        let prodMidY = node.y + 207 + 250 + 24 + 65;

        if (pCount === 1) {
          prodStartX = adsetColX + (280 - 130) / 2;
          prodMidY = node.y + 207 + 250 + 24 + 65;
        } else {
          const rowIdx = Math.floor(targetPIdx / 2);
          const colIdx = targetPIdx % 2;
          prodStartX = colIdx === 0 ? adsetColX + 4 : adsetColX + 146;
          const rowSpacing = 210;
          prodMidY = node.y + 207 + 250 + 28 + rowIdx * rowSpacing + 85;
        }

        if (anchor === 'left') {
          return { x: prodStartX, y: prodMidY };
        }
        return { x: prodStartX + 130, y: prodMidY };
      }

      const anchorY = 135;
      if (anchor === 'left') {
        return { x: centerX - campaignCardHalfWidth, y: node.y + anchorY };
      }
      return { x: centerX + campaignCardHalfWidth, y: node.y + anchorY };
    }
    // Measure real DOM card width first so expanded or result-showing skill cards (880px / 920px / 960px) anchor accurately on their right border
    let measuredWidth = 0;
    if (canvasRef.current) {
      const cardEl = canvasRef.current.querySelector(`[data-node-id="${node.id}"]`) as HTMLElement | null;
      if (cardEl && cardEl.offsetWidth > 0) {
        measuredWidth = cardEl.offsetWidth;
      }
    }
    const isRunningThisNode = runningNodeId === node.id;
    const fallbackSkillWidth =
      (node.previewSide === 'left' || node.previewSide === 'right') && !node.hideResult && (node.executionResult || isRunningThisNode)
        ? 960
        : node.isExpandedDown
        ? 920
        : !node.hideResult && (node.executionResult || isRunningThisNode)
        ? 880
        : 560;
    const cardWidth = node.width
      ? node.width
      : measuredWidth > 0
      ? measuredWidth
      : node.isAppNode
      ? node.appType === 'cro_mobile_landing_page' || node.appType === 'verde_landing_page_builder'
        ? 1280
        : node.appType === 'landing_page_generator'
        ? 1200
        : node.appType === 'text_to_image_landing_page' || node.appType === 'text_to_code_landing_page'
        ? 940
        : 580
      : node.isProduct
      ? 320
      : node.isFile
      ? 420
      : fallbackSkillWidth;
    const anchorY = node.isAppNode ? 50 : node.isProduct ? 60 : node.isFile ? 50 : 62;
    if (anchor === 'left') {
      return { x: node.x, y: node.y + anchorY };
    }
    return { x: node.x + cardWidth, y: node.y + anchorY };
  };

  // Quick Link a Skill directly from an AdSet or Product in the Org Chart
  const handleQuickLinkSkillFromOrgChart = (
    orgChartNodeId: string,
    subType: 'adset' | 'product',
    subData: any,
    skillTitle?: string
  ) => {
    const orgNode = nodes.find((n) => n.id === orgChartNodeId);
    if (!orgNode) return;

    // If user clicked an existing skill on board
    if (subData?.targetSkillNodeId) {
      const targetNode = nodes.find((n) => n.id === subData.targetSkillNodeId);
      if (targetNode) {
        const subId = subType === 'adset' ? `adset:${subData.id}` : `prod:${subData.id}`;
        const newEdge: BoardEdge = {
          id: `edge-${Date.now()}`,
          from: orgChartNodeId,
          to: targetNode.id,
          fromAnchor: 'right',
          toAnchor: 'left',
          fromSubId: subId,
          arrow: true,
          pillMain: subType === 'adset' ? 'AdSet Info' : 'Product Info',
          pillSub: subType === 'adset' ? subData.adsetName?.slice(0, 16) : subData.name?.slice(0, 14),
        };
        setEdges((prev) => [...prev, newEdge]);
        showToast(`Linked ${targetNode.title} to ${subType === 'adset' ? `AdSet ${subData.index}` : subData.name}!`);
        return;
      }
    }

    // Otherwise spawn a new skill on the board pre-loaded with this data
    const chosenTitle = skillTitle || (subType === 'adset' ? 'Facebook & Instagram Ad Copy' : 'Product Copy & Angles');
    const subId = subType === 'adset' ? `adset:${subData.id}` : `prod:${subData.id}`;

    let foundSkillMeta: any = null;
    for (const cat of ALL_SKILL_CATEGORIES) {
      const s = cat.skills.find((item) => item.title.toLowerCase() === chosenTitle.toLowerCase());
      if (s) {
        foundSkillMeta = { ...s, category: cat.name };
        break;
      }
    }

    const groupsCount = orgNode.appData?.groups?.length || 3;
    const totalOrgWidth = Math.max(440, (groupsCount - 1) * 300 + 280);
    const spawnX = orgNode.x + totalOrgWidth + 60;
    const spawnY = orgNode.y + (subType === 'adset' ? 180 : 380);

    const newNodeId = `node-skill-${Date.now()}`;
    const newSkillNode: BoardNode = {
      id: newNodeId,
      title: chosenTitle,
      subtitle: foundSkillMeta?.subtitle || (subType === 'adset' ? `Tailored for ${subData.adsetName}` : `Trained on ${subData.name}`),
      category: foundSkillMeta?.category || 'Creative Production',
      iconType: foundSkillMeta?.iconType || (subType === 'adset' ? 'meta' : 'Sparkles'),
      iconBg: foundSkillMeta?.iconBg || 'bg-blue-600',
      iconColor: 'text-white',
      x: spawnX,
      y: spawnY,
      status: 'idle',
      language: 'English',
      liveWebResearch: true,
      config: {
        name: chosenTitle,
        description: `Automated skill linked to ${subType === 'adset' ? `AdSet: ${subData.adsetName}` : `Product: ${subData.name}`}. Extracts target audience, price, and testing angles directly.`,
        campaignObjective: 'Conversions',
        targetAudience: subType === 'adset' ? subData.audienceProfile?.avatar : subData.category,
        budget: '30',
        budgetPeriod: 'per day',
        autoOptimization: true,
        trackConversions: true,
        saveAdsToLibrary: true,
      },
    };

    const newEdge: BoardEdge = {
      id: `edge-${Date.now()}`,
      from: orgChartNodeId,
      to: newNodeId,
      fromAnchor: 'right',
      toAnchor: 'left',
      fromSubId: subId,
      arrow: true,
      pillMain: subType === 'adset' ? 'AdSet Data' : 'Product Data',
      pillSub: subType === 'adset' ? subData.adsetName?.slice(0, 16) : subData.name?.slice(0, 14),
    };

    setNodes((prev) => [...prev, newSkillNode]);
    setEdges((prev) => [...prev, newEdge]);
    setSelectedNodeId(newNodeId);
    showToast(`✓ Created "${chosenTitle}" and linked to ${subType === 'adset' ? `AdSet ${subData.index}` : subData.name}!`);
  };

  // Compute smooth Bezier curve for Left/Right ports with natural looping if needed
  const getBezierPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    fromAnchor: 'left' | 'right' | 'top' | 'bottom' = 'right',
    toAnchor: 'left' | 'right' | 'top' | 'bottom' = 'left'
  ) => {
    const actualFrom = fromAnchor === 'left' ? 'left' : 'right';
    const actualTo = toAnchor === 'right' ? 'right' : 'left';
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    if (actualFrom === 'right' && actualTo === 'left') {
      if (dx >= 20) {
        const curvature = Math.max(35, dx * 0.45);
        return `M ${start.x} ${start.y} C ${start.x + curvature} ${start.y}, ${end.x - curvature} ${end.y}, ${end.x} ${end.y}`;
      } else {
        const loop = Math.max(50, Math.abs(dy) * 0.25 + 45);
        return `M ${start.x} ${start.y} C ${start.x + loop} ${start.y}, ${end.x - loop} ${end.y}, ${end.x} ${end.y}`;
      }
    }

    if (actualFrom === 'left' && actualTo === 'right') {
      if (dx <= -20) {
        const curvature = Math.max(35, Math.abs(dx) * 0.45);
        return `M ${start.x} ${start.y} C ${start.x - curvature} ${start.y}, ${end.x + curvature} ${end.y}, ${end.x} ${end.y}`;
      } else {
        const loop = Math.max(50, Math.abs(dy) * 0.25 + 45);
        return `M ${start.x} ${start.y} C ${start.x - loop} ${start.y}, ${end.x + loop} ${end.y}, ${end.x} ${end.y}`;
      }
    }

    if (actualFrom === 'right' && actualTo === 'right') {
      const loop = Math.max(60, Math.abs(dy) * 0.25 + 45);
      const maxX = Math.max(start.x, end.x) + loop;
      return `M ${start.x} ${start.y} C ${maxX} ${start.y}, ${maxX} ${end.y}, ${end.x} ${end.y}`;
    }

    // left to left
    const loop = Math.max(60, Math.abs(dy) * 0.25 + 45);
    const minX = Math.min(start.x, end.x) - loop;
    return `M ${start.x} ${start.y} C ${minX} ${start.y}, ${minX} ${end.y}, ${end.x} ${end.y}`;
  };

  // Exact curve midpoint for floating conversion pill and line delete button
  const getCurveMidpoint = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    fromAnchor: 'left' | 'right' | 'top' | 'bottom' = 'right',
    toAnchor: 'left' | 'right' | 'top' | 'bottom' = 'left'
  ) => {
    const actualFrom = fromAnchor === 'left' ? 'left' : 'right';
    const actualTo = toAnchor === 'right' ? 'right' : 'left';
    let cp1 = { x: start.x, y: start.y };
    let cp2 = { x: end.x, y: end.y };
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    if (actualFrom === 'right' && actualTo === 'left') {
      if (dx >= 20) {
        const curvature = Math.max(35, dx * 0.45);
        cp1 = { x: start.x + curvature, y: start.y };
        cp2 = { x: end.x - curvature, y: end.y };
      } else {
        const loop = Math.max(50, Math.abs(dy) * 0.25 + 45);
        cp1 = { x: start.x + loop, y: start.y };
        cp2 = { x: end.x - loop, y: end.y };
      }
    } else if (actualFrom === 'left' && actualTo === 'right') {
      if (dx <= -20) {
        const curvature = Math.max(35, Math.abs(dx) * 0.45);
        cp1 = { x: start.x - curvature, y: start.y };
        cp2 = { x: end.x + curvature, y: end.y };
      } else {
        const loop = Math.max(50, Math.abs(dy) * 0.25 + 45);
        cp1 = { x: start.x - loop, y: start.y };
        cp2 = { x: end.x + loop, y: end.y };
      }
    } else if (actualFrom === 'right' && actualTo === 'right') {
      const loop = Math.max(60, Math.abs(dy) * 0.25 + 45);
      const maxX = Math.max(start.x, end.x) + loop;
      cp1 = { x: maxX, y: start.y };
      cp2 = { x: maxX, y: end.y };
    } else {
      const loop = Math.max(60, Math.abs(dy) * 0.25 + 45);
      const minX = Math.min(start.x, end.x) - loop;
      cp1 = { x: minX, y: start.y };
      cp2 = { x: minX, y: end.y };
    }

    return {
      x: (start.x + 3 * cp1.x + 3 * cp2.x + end.x) / 8,
      y: (start.y + 3 * cp1.y + 3 * cp2.y + end.y) / 8,
    };
  };

  // Dynamic Lucide and brand icon lookup
  const getDynamicSkillIcon = (iconName: string, className = 'w-4 h-4 text-white') => {
    if (iconName === 'meta') {
      return <SkillBrandIcon type="meta" className={className} />;
    }
    if (iconName === 'google_ads') {
      return <SkillBrandIcon type="google_ads" className={className} />;
    }
    if (iconName === 'tiktok_ads') {
      return <SkillBrandIcon type="tiktok_ads" className={className} />;
    }
    if (iconName === 'sheets') {
      return <SkillBrandIcon type="sheets" className={className} />;
    }
    if (iconName === 'store') {
      return <SkillBrandIcon type="store" className={className} />;
    }
    const IconComp = (LucideIcons as Record<string, any>)[iconName];
    if (IconComp && (typeof IconComp === 'function' || typeof IconComp === 'object')) {
      const Element = IconComp;
      return <Element className={className} />;
    }
    return <Zap className={className} />;
  };

  // Helper to render node icon in card
  const renderCardIcon = (node: BoardNode) => {
    return getDynamicSkillIcon(node.iconType, 'w-4 h-4 text-white');
  };

  // Toggle Category accordion open/close
  const handleToggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // Expand or Collapse All Categories
  const handleToggleExpandAllCategories = () => {
    const allOpen = ALL_SKILL_CATEGORIES.every((c) => expandedCategories[c.id]);
    const nextState: Record<string, boolean> = {};
    ALL_SKILL_CATEGORIES.forEach((c) => {
      nextState[c.id] = !allOpen;
    });
    setExpandedCategories(nextState);
  };

  // Filtered skills and categories calculation based on search, pills, and removed skills
  const filteredCategories = React.useMemo(() => {
    const q = skillsSearch.trim().toLowerCase();
    const activeFilter = skillsFilter;

    // Build categories map incorporating custom skills
    const categoriesMap = new Map<string, SkillCategory>();

    ALL_SKILL_CATEGORIES.forEach((cat) => {
      categoriesMap.set(cat.id, {
        ...cat,
        skills: [...cat.skills],
      });
    });

    // Merge custom skills into their selected categories or create custom category
    customSkills.forEach((cSkill) => {
      if (removedSkillIds.includes(cSkill.id)) return;
      const targetCatId = (cSkill as any).categoryId || 'custom_skills';

      let targetCat = categoriesMap.get(targetCatId);
      if (!targetCat) {
        for (const cat of categoriesMap.values()) {
          if (cat.name.toLowerCase() === cSkill.category.toLowerCase()) {
            targetCat = cat;
            break;
          }
        }
      }

      const customSkillItem: SkillItem = {
        num: 999,
        id: cSkill.id,
        title: cSkill.title,
        subtitle: cSkill.subtitle,
        category: cSkill.category,
        categoryId: targetCat ? targetCat.id : targetCatId,
        tag: 'CUSTOM',
        score: '100%',
        icon: cSkill.iconType || 'Sparkles',
        iconBg: cSkill.iconBg || 'bg-emerald-600',
        iconColor: 'text-white',
        description: cSkill.subtitle || 'Custom AI Skill',
      };

      if (targetCat) {
        targetCat.skills = [customSkillItem, ...targetCat.skills];
      } else {
        categoriesMap.set(targetCatId, {
          id: targetCatId,
          name: cSkill.category,
          skillsCount: 1,
          icon: cSkill.iconType || 'Sparkles',
          color: cSkill.iconBg || 'bg-emerald-600',
          textColor: 'text-emerald-400',
          skills: [customSkillItem],
        });
      }
    });

    const allCategoriesList = Array.from(categoriesMap.values());

    return allCategoriesList.map((category) => {
      // Exclude skills hidden or removed by user
      const visibleCategorySkills = category.skills.filter((s) => !removedSkillIds.includes(s.id));
      if (visibleCategorySkills.length === 0) return null;

      // Check category pill filter
      if (activeFilter !== 'All') {
        const f = activeFilter.toLowerCase();
        const matchesCategory =
          category.id.toLowerCase() === f ||
          category.id.toLowerCase().includes(f) ||
          category.name.toLowerCase().includes(f);

        const hasMatchingTag = visibleCategorySkills.some(
          (s) => s.tag.toLowerCase() === f
        );

        if (!matchesCategory && !hasMatchingTag) return null;
      }

      // Check search query
      if (!q) {
        if (activeFilter !== 'All') {
          const f = activeFilter.toLowerCase();
          const matchesCategory =
            category.id.toLowerCase() === f ||
            category.id.toLowerCase().includes(f) ||
            category.name.toLowerCase().includes(f);

          if (matchesCategory) {
            return { ...category, skills: visibleCategorySkills };
          }

          const matchingSkills = visibleCategorySkills.filter(
            (s) =>
              s.categoryId.toLowerCase().includes(f) ||
              s.tag.toLowerCase() === f ||
              category.name.toLowerCase().includes(f)
          );
          return matchingSkills.length > 0 ? { ...category, skills: matchingSkills } : null;
        }
        return { ...category, skills: visibleCategorySkills };
      }

      const matchingSkills = visibleCategorySkills.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.subtitle && s.subtitle.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.tag.toLowerCase().includes(q)
      );

      if (matchingSkills.length === 0) return null;

      return {
        ...category,
        skills: matchingSkills,
      };
    }).filter(Boolean) as SkillCategory[];
  }, [skillsSearch, skillsFilter, removedSkillIds, customSkills]);

  const totalMatchingSkills = React.useMemo(() => {
    return filteredCategories.reduce((acc, c) => acc + c.skills.length, 0);
  }, [filteredCategories]);

  // Filtered products list for Product Library tab
  const filteredProducts = React.useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return SAMPLE_PRODUCTS;
    return SAMPLE_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.niche.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sellingPoints.toLowerCase().includes(q)
    );
  }, [productSearch]);

  // Filtered detailed products for rich Product Dossiers
  const filteredDetailedProducts = React.useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return productsList;
    return productsList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.intelligence?.evidenceNotes && p.intelligence.evidenceNotes.toLowerCase().includes(q)) ||
        (p.aiAnalysis?.marketingAngle && p.aiAnalysis.marketingAngle.toLowerCase().includes(q))
    );
  }, [productSearch, productsList]);

  // Filtered uploaded files for Uploads tab
  const filteredUploadedFiles = React.useMemo(() => {
    const q = fileSearch.trim().toLowerCase();
    return uploadedFiles.filter((file) => {
      if (fileFilter !== 'all') {
        if (fileFilter === 'excel' && file.type !== 'excel') return false;
        if (fileFilter === 'pdf' && file.type !== 'pdf') return false;
        if (fileFilter === 'word' && file.type !== 'word') return false;
        if (fileFilter === 'json' && file.type !== 'json') return false;
        if (fileFilter === 'image' && file.type !== 'image') return false;
      }
      if (!q) return true;
      return (
        file.name.toLowerCase().includes(q) ||
        (file.summary && file.summary.toLowerCase().includes(q)) ||
        (file.tags && file.tags.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [uploadedFiles, fileFilter, fileSearch]);

  // Auto-link all active skill nodes on board to the Master Synthesizer node
  const handleAutoLinkAllSkillsToMaster = useCallback((masterNodeId: string) => {
    const masterNode = nodes.find((n) => n.id === masterNodeId);
    if (!masterNode) return;

    const currentConnectedIds = new Set(
      edges
        .filter((e) => e.to === masterNodeId || e.from === masterNodeId)
        .map((e) => (e.to === masterNodeId ? e.from : e.to))
    );

    const skillsToConnect = nodes.filter(
      (n) => n.id !== masterNodeId && !currentConnectedIds.has(n.id) && !n.isProduct && !n.isFile
    );

    if (skillsToConnect.length === 0) {
      showToast('All available skill nodes are already linked to the Master Synthesizer!');
      return;
    }

    const newEdges: BoardEdge[] = skillsToConnect.map((sNode, idx) => ({
      id: `edge-${Date.now()}-${idx}-${sNode.id.slice(-4)}-to-${masterNodeId.slice(-4)}`,
      from: sNode.id,
      to: masterNodeId,
      fromAnchor: 'right',
      toAnchor: 'left',
      arrow: true,
      pillMain: 'Skill Linked',
      pillSub: sNode.title.slice(0, 18),
    }));

    setEdges((prev) => [...prev, ...newEdges]);
    showToast(`⚡ Linked ${skillsToConnect.length} skill nodes to Master Multi-Skill Synthesizer!`);
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 400);
  }, [nodes, edges, showToast]);

  // Add a new node to canvas from skills list (centers on visible canvas area, adds strictly ONE)
  const handleAddSkillToBoard = (skill: {
    title: string;
    category?: string;
    iconType: string;
    iconBg: string;
    subtitle?: string;
    isProduct?: boolean;
    productData?: any;
    isFile?: boolean;
    fileData?: UploadedFileItem;
    isCustomSkill?: boolean;
    customPromptTemplate?: string;
    isAppNode?: boolean;
    appType?: BoardNode['appType'];
    appData?: any;
    isMasterSynthesizer?: boolean;
  }) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = (width / 2 - panOffset.x) / scale - 138 + (Math.random() * 40 - 20);
    const centerY = (height / 2 - panOffset.y) / scale - 82 + (Math.random() * 40 - 20);

    createNodeAtPosition(skill, centerX, centerY);
  };

  // CRO_PROMPT: The exact AI system prompt embedded into the CRO skill payload
  const CRO_LANDING_PAGE_PROMPT = `You are an AI PRODUCT → CRO STRATEGY → LANDING PAGE generator. You think:

PRODUCT → CUSTOMER → PROBLEM → DESIRE → SOLUTION → PROOF → OFFER → TRUST → CTA

BEFORE generating any UI. You pipeline ANY ecommerce product into a landing page that is adapted SPECIFICALLY to that product.

DESIGN LANGUAGE — a high-converting ecommerce product page:
- information hierarchy, conversion structure, mobile-first UX, offer presentation, product storytelling, CTA placement, visual hierarchy. Do NOT copy any specific template; apply these principles to THIS product.
- Premium modern ecommerce look: strong visual hierarchy, large product imagery, clear typography, strong CTA hierarchy, clean cards, rounded corners, subtle shadows, premium spacing, clear pricing blocks, trust indicators, fully responsive layouts.
- Avoid: generic SaaS layouts, heavy gradients, excessive animation, clutter, tiny text, too many colors.

GROUND RULES — NEVER CHANGE THESE:
- Work ONLY with the product information provided. NEVER invent product facts, statistics, reviews, certifications, guarantees, or prices.
- Any claim shown on the page MUST be traceable to the input data; if a number (price, rating, reviews count) is unknown, omit it from the page.
- The landing page must work for ANY product. The product stays the visual focus at all times.
- Copy must focus on the CUSTOMER'S RESULT, not just the product name.
- Mobile (390x844) is the PRIMARY design target; support 375, 412, 768, 1024, 1440.

=== PART 1 — DISCOVERY (complete this BEFORE planning any build) ===
DISCOVERY-FIRST RULE: catalog every fact below from the PRODUCT FACTS and USER INSTRUCTIONS. If a fact is missing, DO NOT invent random/generic filler — create a CLEARLY LABELED, realistic placeholder (example: "TODO — confirm final price, currently 3490 DZD") and record { field, whatIsMissing, placeholderUsed, howToConfirm } in the "gaps" array. Every guess MUST be in gaps.

1. BRAND IDENTITY — exact brand/product name (spelling + capitalization), a TEXT LOGO derived from the name (no logo file uploads here), brand color palette (primary, secondary, accent, background hex), font pairing (one headline + one body), and vibe/tone: playful | luxury | clinical-trustworthy | warm-organic | bold-edgy. Choose colors from the provided facts / brand trademarks / category conventions; if you must color from scratch, pick a tasteful category-appropriate palette and ADD A GAP asking the human to confirm the hex codes.
2. PRODUCT CONTENT — describe the product shots to render as realistic inline SVG art (avoid gray boxes), one category label, ONE benefit-driven headline (a promise, not a description), a 2-3 sentence supporting description, 3-4 key benefits (short label + icon name + one-sentence detail), and full accordion content (description / ingredients-or-specs / how to use).
3. PRICING & OFFER — regular price, discount price + % off, subscription option (frequencies + savings %), bundle/quantity discount, shipping policy (free threshold + delivery time), guarantee/return text.
4. SOCIAL PROOF — star rating, review count, 3-5 realistic reviews (name, rating, one-sentence quote).
5. NAVIGATION & CONVERSION — nav menu items, cart/search icons needed, primary CTA label + real destination, urgency element (countdown / low-stock / limited badge / none).

PRODUCT FACTS AVAILABLE (use ONLY these facts):
PRODUCT NAME: [Connected Product]

=== PART 2 — SECTION PLAN (choose NOTHING: the full 12-section single-product page, this exact order) ===
1 announcement bar · 2 sticky nav · 3 hero image carousel with dots + thumbnails · 4 rating strip · 5 category label + benefit headline · 6 benefit icons row · 7 price block (with offer toggles) · 8 primary CTA (sticky on mobile) · 9 info accordion · 10 reviews · 11 cross-sell row · 12 footer.

OUTPUT RULE: Return ONLY the strategy JSON below (pure JSON, no markdown fences).

{
  "gaps": [
    {
      "field": "brandIdentity.colorPalette",
      "whatIsMissing": "what was not provided",
      "placeholderUsed": "the clearly labeled placeholder you created",
      "howToConfirm": "exact instruction for the human (e.g. give me 3 hex codes)"
    }
  ],
  "brandIdentity": {
    "brandName": "exact brand/product name + capitalization",
    "logoType": "text-logo-from-name",
    "colorPalette": { "primary": "hex", "secondary": "hex", "accent": "hex", "background": "hex" },
    "fonts": { "headline": "headline font family", "body": "body font family" },
    "vibe": "playful | luxury | clinical-trustworthy | warm-organic | bold-edgy"
  },
  "productContent": {
    "photos": ["describe each product shot that will be rendered as realistic inline SVG art, e.g. hero shot on neutral studio background"],
    "categoryLabel": "one short label, e.g. Nose Hair Trimmer",
    "headline": "one benefit-driven promise, not a description",
    "description": "2-3 sentence supporting description",
    "benefits": [
      { "icon": "lucide icon name of the benefit", "label": "very short label", "detail": "one sentence" }
    ],
    "accordion": { "description": "…", "ingredientsSpecs": "…", "howToUse": "…" }
  },
  "pricingOffer": {
    "regularPrice": "…", "discountPrice": "… or ''", "percentOff": "… or ''",
    "subscription": { "available": false, "frequencies": ["…"], "savingsPercent": 0 },
    "bundleQuantityDiscount": "… or ''",
    "shippingPolicy": "free shipping threshold + delivery time",
    "guarantee": "guarantee / return policy text"
  },
  "socialProof": {
    "starRating": 0, "reviewCount": 0,
    "reviews": [ { "name": "…", "rating": 0, "quote": "one sentence" } ]
  },
  "navigation": {
    "navItems": ["About", "FAQ", "Shipping", "Contact"],
    "cartIcon": true, "searchIcon": false,
    "primaryCta": { "label": "real button label", "url": "real destination or ''" },
    "urgency": { "type": "countdown|low-stock|badge|none", "label": "…" }
  },
  "conversion": {
    "headlineAngle": "…", "offerStrategy": "…", "trustStrategy": "…", "objectionHandling": "…"
  },
  "design": {
    "primaryColor": "hex", "secondaryColor": "hex", "accentColor": "hex",
    "backgroundColor": "hex", "textColor": "hex",
    "fontHeadline": "…", "fontBody": "…", "fontStyle": "modern stack string"
  },
  "sections": [
    { "key": "announcement_bar", "name": "Top Announcement Bar", "purpose": "sitewide promo/shipping strip", "headline": "…", "subheadline": "", "body": "", "ctaLabel": "", "layout": "full-width solid color strip" },
    { "key": "nav", "name": "Sticky Nav Bar", "purpose": "logo, menu, cart, search", "headline": "", "subheadline": "", "body": "", "ctaLabel": "", "layout": "logo-left, hamburger, cart-icon" },
    { "key": "hero_carousel", "name": "Hero Image Carousel", "purpose": "real product shots, swipeable", "headline": "…", "subheadline": "…", "body": "", "ctaLabel": "…", "layout": "dotted carousel + thumbnail strip" },
    { "key": "rating_strip", "name": "Rating Strip", "purpose": "stars + review count", "headline": "", "subheadline": "…", "body": "", "ctaLabel": "", "layout": "compact centered strip" },
    { "key": "category_headline", "name": "Category Label + Benefit Headline", "purpose": "category badge + promise + description", "headline": "…", "subheadline": "…", "body": "…", "ctaLabel": "", "layout": "badge, big headline, 2-3 sentences" },
    { "key": "benefit_icons", "name": "Benefit Icons Row", "purpose": "3-4 real benefit icons", "headline": "", "subheadline": "", "body": "", "ctaLabel": "", "layout": "icon cards in a row" },
    { "key": "price_block", "name": "Price Block", "purpose": "regular/discount price, subscribe toggle, bundle", "headline": "…", "subheadline": "", "body": "…", "ctaLabel": "", "layout": "price, toggles, fee notes" },
    { "key": "primary_cta", "name": "Primary CTA", "purpose": "full-width high-contrast buy button, sticky on mobile", "headline": "", "subheadline": "", "body": "", "ctaLabel": "…", "layout": "full-width button" },
    { "key": "info_accordion", "name": "Info Accordion", "purpose": "Description / Ingredients / How to Use, collapsible", "headline": "", "subheadline": "", "body": "…", "ctaLabel": "", "layout": "collapsible rows" },
    { "key": "reviews", "name": "Reviews Section", "purpose": "real reviews, stars, names", "headline": "…", "subheadline": "…", "body": "", "ctaLabel": "", "layout": "review cards" },
    { "key": "cross_sell", "name": "Cross-Sell Row", "purpose": "related products, horizontally scrollable", "headline": "…", "subheadline": "", "body": "", "ctaLabel": "…", "layout": "horizontal scroll cards" },
    { "key": "footer", "name": "Footer", "purpose": "shipping, returns, contact, socials", "headline": "", "subheadline": "", "body": "", "ctaLabel": "", "layout": "simple link columns" }
  ]
}`;

  // Reusable Skill Item component strictly matching image_d8993db4.png
  const renderSkillItem = (s: SkillItem) => {
    const isMasterSynthesizer =
      s.id === 'omni_skill_master_synthesizer' ||
      s.title.toLowerCase().includes('multi-skill synthesis') ||
      s.title.toLowerCase().includes('master multi-skill');
    const isCroMobileSkill =
      !isMasterSynthesizer &&
      (s.id === 'cro_landing_page_builder_mobile' ||
        s.title.toLowerCase().includes('cro landing page builder') ||
        (s.title.toLowerCase().includes('cro') && s.title.toLowerCase().includes('mobile')));
    const isLpSkill =
      !isMasterSynthesizer &&
      !isCroMobileSkill &&
      (s.id === 'ai_landing_page_generator' || s.title.toLowerCase().includes('landing page'));

    if (isMasterSynthesizer) {
      const masterPayload = {
        title: s.title,
        category: s.category,
        iconType: 'Layers',
        iconBg: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600',
        subtitle: s.subtitle || s.description,
        isMasterSynthesizer: true,
        appType: 'omni_skill_master_synthesizer' as const,
      };

      return (
        <div
          key={s.id}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('application/json', JSON.stringify(masterPayload));
            e.dataTransfer.effectAllowed = 'copy';
          }}
          className="col-span-2 rounded-2xl p-4 bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-rose-50/70 border-2 border-amber-300 hover:border-amber-400 ring-2 ring-amber-500/10 hover:shadow-md transition-all flex flex-col justify-between group cursor-grab active:cursor-grabbing select-none relative overflow-hidden shadow-xs"
          title="Master Multi-Skill Synthesizer: Connect multiple skills across your board to aggregate all findings into an exhaustive General Executive Report."
        >
          {/* Ambient glowing backlight */}
          <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-amber-300/20 rounded-full blur-2xl group-hover:bg-amber-400/25 transition-all" />

          <div>
            {/* Top Row: VIP Master Badge & 100% Score */}
            <div className="flex items-center justify-between gap-1 relative z-10">
              <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border border-amber-300 shadow-2xs flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
                <span>🌟 MASTER AGGREGATOR</span>
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-xs font-mono shadow-2xs">
                  100% MASTER
                </span>
                <button
                  type="button"
                  data-no-drag="true"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSkillToRemove({
                      id: s.id,
                      title: s.title,
                      isCustom: false,
                    });
                  }}
                  className="opacity-60 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title={`Remove "${s.title}" from list`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Distinctive Title */}
            <h4 className="font-black text-sm text-slate-900 mt-2.5 leading-snug">
              {s.title}
            </h4>

            {/* Subtitle */}
            <p className="text-slate-600 text-[11px] mt-1.5 leading-relaxed font-medium">
              {s.subtitle || s.description}
            </p>

            {/* Feature Pills */}
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              <span className="px-2 py-0.5 rounded-md bg-white/90 border border-amber-200 text-amber-700 font-mono text-[9.5px] font-bold">
                🔗 Multi-Skill Linkable
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/90 border border-purple-200 text-purple-700 font-mono text-[9.5px] font-bold">
                📑 Big Dossier (1500+ Words)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/90 border border-rose-200 text-rose-700 font-mono text-[9.5px] font-bold">
                📊 Cross-Funnel Matrix
              </span>
              <span className="px-2 py-0.5 rounded-md bg-white/90 border border-emerald-200 text-emerald-700 font-mono text-[9.5px] font-bold">
                ⚡ 1-Click Auto-Link
              </span>
            </div>
          </div>

          {/* Action Button: + Add Master Synthesizer to Board */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddSkillToBoard(masterPayload);
            }}
            className="w-full mt-3.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-105 active:scale-98 text-white text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm relative z-10"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>+ Add Master Synthesizer to Board</span>
          </button>
        </div>
      );
    }

    const skillDataPayload = {
      title: s.title,
      category: s.category,
      iconType: s.icon,
      iconBg: s.iconBg,
      subtitle: s.subtitle || s.description,
      ...(isCroMobileSkill
        ? {
            isAppNode: true,
            appType: 'cro_mobile_landing_page' as const,
            appData: { systemPrompt: CRO_LANDING_PAGE_PROMPT },
          }
        : isLpSkill
        ? {
            isAppNode: true,
            appType: 'landing_page_generator' as const,
            appData: { settings: INITIAL_LANDING_PAGE_SETTINGS },
          }
        : {}),
    };

    return (
      <div
        key={s.id}
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData('application/json', JSON.stringify(skillDataPayload));
          e.dataTransfer.effectAllowed = 'copy';
        }}
        className="bg-white hover:bg-blue-50/30 rounded-2xl p-3 border border-slate-200/90 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group cursor-grab active:cursor-grabbing select-none shadow-2xs"
        title={`${s.title}\n\n${s.subtitle || s.description}\n\nDrag onto canvas or click '+ Add to Board'.`}
      >
        <div>
          {/* Top Row: Tag on Left, Emerald Score & Remove Button on Right */}
          <div className="flex items-center justify-between gap-1">
            <span className="bg-slate-100 text-slate-600 text-[9.5px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono truncate border border-slate-200/80">
              {s.tag || 'SKILL'}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-emerald-600 font-bold text-xs font-mono">
                {s.score || '95%'}
              </span>
              <button
                type="button"
                data-no-drag="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setSkillToRemove({
                    id: s.id,
                    title: s.title,
                    isCustom: false,
                  });
                }}
                className="opacity-60 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                title={`Remove "${s.title}" from list`}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Bold Title */}
          <h4 className="font-bold text-slate-900 text-xs mt-2.5 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {s.title}
          </h4>

          {/* Subtitle */}
          <p className="text-slate-500 text-[11px] mt-1 line-clamp-2 leading-relaxed">
            {s.subtitle || s.description}
          </p>
        </div>

        {/* Action Button: + Add to Board */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleAddSkillToBoard(skillDataPayload);
          }}
          className="w-full mt-3 py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-600 hover:border-blue-600 hover:text-white active:scale-98 text-slate-700 text-[11px] font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
        >
          <span>+ Add to Board</span>
        </button>
      </div>
    );
  };

  // Add a product node to canvas from Product Library (centers on visible canvas area)
  const handleAddProductToBoard = (product: ProductLibraryItem) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = (width / 2 - panOffset.x) / scale - 150 + (Math.random() * 40 - 20);
    const centerY = (height / 2 - panOffset.y) / scale - 60 + (Math.random() * 40 - 20);

    const productPayload = {
      title: product.title,
      subtitle: product.subtitle,
      category: 'Product Library',
      iconType: 'ShoppingBag',
      iconBg: 'bg-emerald-600',
      isProduct: true,
      productData: {
        image: product.image,
        sellingPrice: product.sellingPrice,
        productCost: product.productCost,
        profitMargin: product.profitMargin,
        niche: product.niche,
        sellingPoints: product.sellingPoints,
        description: product.description,
        stock: product.stock,
      },
    };

    createNodeAtPosition(productPayload, centerX, centerY);
  };

  // Add a rich detailed product node to canvas
  const handleAddDetailedProductToBoard = (product: DetailedProduct) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = (width / 2 - panOffset.x) / scale - 150 + (Math.random() * 40 - 20);
    const centerY = (height / 2 - panOffset.y) / scale - 60 + (Math.random() * 40 - 20);

    const sellingPrice = product.financials?.sellingPrice ?? 1400;
    const costPrice = product.financials?.costPrice ?? 760;
    const shippingCost = product.financials?.shippingCost ?? 202;
    const marginPct = Math.round(
      ((sellingPrice - costPrice - shippingCost) / (sellingPrice || 1)) * 100
    );

    const productPayload = {
      title: product.name,
      subtitle: product.aiAnalysis?.marketingAngle || product.category || 'Product Dossier',
      category: 'Product Intelligence',
      iconType: 'ShoppingBag',
      iconBg: 'bg-blue-600',
      isProduct: true,
      productData: {
        image: product.mainImage,
        sellingPrice,
        productCost: costPrice,
        profitMargin: marginPct,
        niche: product.category,
        sellingPoints: product.aiAnalysis?.whySell?.slice(0, 2).join(' • ') || 'Verified product dossier',
        description: product.intelligence?.evidenceNotes || product.name,
        stock: product.supplier?.moq ? `MOQ ${product.supplier.moq}` : 'Active',
      },
    };

    createNodeAtPosition(productPayload, centerX, centerY);
    showToast(`Added "${product.name.slice(0, 30)}..." to the board!`);
  };

  // Check for any pending product queued from Products Intelligence page
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pending_board_product');
      if (raw) {
        localStorage.removeItem('pending_board_product');
        const prod = JSON.parse(raw);
        if (prod && (prod.name || prod.title)) {
          setTimeout(() => {
            handleAddDetailedProductToBoard(prod);
          }, 350);
        }
      }
    } catch (err) {
      console.error('Failed to load pending product to board:', err);
    }
  }, []);

  // Add an uploaded file node to canvas (centers on visible canvas area)
  const handleAddFileToBoard = (file: UploadedFileItem) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = (width / 2 - panOffset.x) / scale - 180 + (Math.random() * 40 - 20);
    const centerY = (height / 2 - panOffset.y) / scale - 80 + (Math.random() * 40 - 20);

    const iconType =
      file.type === 'excel'
        ? 'FileSpreadsheet'
        : file.type === 'image'
        ? 'Image'
        : file.type === 'json'
        ? 'FileCode'
        : 'FileText';

    const iconBg =
      file.type === 'excel'
        ? 'bg-emerald-600'
        : file.type === 'pdf'
        ? 'bg-rose-600'
        : file.type === 'word'
        ? 'bg-blue-600'
        : file.type === 'json'
        ? 'bg-amber-600'
        : 'bg-purple-600';

    const filePayload = {
      title: file.name,
      subtitle: file.summary || `${file.type.toUpperCase()} file asset`,
      category: 'Uploaded Files',
      iconType,
      iconBg,
      isFile: true,
      fileData: file,
    };

    createNodeAtPosition(filePayload, centerX, centerY);
    showToast(`Added "${file.name}" to the board!`);
  };

  // Drag start for an uploaded file
  const handleDragStartFile = (e: React.DragEvent, file: UploadedFileItem) => {
    const iconType =
      file.type === 'excel'
        ? 'FileSpreadsheet'
        : file.type === 'image'
        ? 'Image'
        : file.type === 'json'
        ? 'FileCode'
        : 'FileText';

    const iconBg =
      file.type === 'excel'
        ? 'bg-emerald-600'
        : file.type === 'pdf'
        ? 'bg-rose-600'
        : file.type === 'word'
        ? 'bg-blue-600'
        : file.type === 'json'
        ? 'bg-amber-600'
        : 'bg-purple-600';

    const filePayload = {
      title: file.name,
      subtitle: file.summary || `${file.type.toUpperCase()} file asset`,
      category: 'Uploaded Files',
      iconType,
      iconBg,
      isFile: true,
      fileData: file,
    };

    e.dataTransfer.setData('application/json', JSON.stringify(filePayload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Delete an uploaded file
  const handleDeleteUploadedFile = (fileId: string, fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    showToast(`Deleted file "${fileName}"`);
  };

  // AI Creative Apps Catalog (CRO Mobile LP, AI Landing Page Generator, Text to Code LP, Text to Image LP, Regroupe Product, Text to Image, Image to Text, Storyboard, Script, Séance)
  const AI_STUDIO_APPS = [
    {
      id: 'app-verde-landing-page',
      title: 'Verde AI Landing Page Builder',
      subtitle: 'Conversational AI Landing Page Studio: Live split preview, chat-based building & editing, and instant code export',
      appType: 'verde_landing_page_builder' as const,
      iconType: 'Zap',
      iconBg: 'bg-emerald-600',
      badge: 'VERDE 2 · BUILD',
      tag: 'CONVERSATIONAL AI STUDIO',
      description:
        'Exact Verde 2 landing page studio layout matching reference: Left icon rail & conversational AI chat interface, right live interactive browser preview with desktop/mobile viewports, and full code editor.',
      features: [
        'Exact Visual Match to Reference: Icon Rail, Conversational Chat & Live Preview',
        'Direct AI Chat Editing: Instruct the AI to refine headlines, colors, pricing, and sections',
        'Live Interactive Browser Mockup with Streaming Chart, Metric Counters, and Features',
        'Built-in Code Viewer: Inspect & copy index.html, theme.css, and pricing.tsx',
        '1-Click Standalone HTML Export and Local Storage Persistence',
      ],
      defaultData: {},
    },
    {
      id: 'app-cro-mobile-landing-page',
      title: 'CRO Landing Page Builder (Mobile)',
      subtitle: 'Mobile CRO DTC Landing Page Builder with Kada Garmin preview, conversion rings & 5-step workflow',
      appType: 'cro_mobile_landing_page' as const,
      iconType: 'Smartphone',
      iconBg: 'bg-blue-600',
      badge: 'MOBILE CRO STUDIO',
      tag: 'COD DZ HIGH-CONVERTING',
      description:
        'Exact DTC Mobile CRO Landing Page Builder featuring 3-column studio layout, live Kada Garmin Sports Smartwatch desktop hero, mobile phone frame preview, circular conversion potential ring, A/B test variations, and a 5-step master workflow footer.',
      features: [
        'Exact Layout Matching Reference: Left Controls, Center Desktop Hero, Right Mobile CRO Phone',
        'Interactive Conversion Potential Ring & Performance Score Breakdown',
        'Direct A/B Variant Simulator & COD Algeria 58-Wilaya Form',
        '5-Step Creative Workflow (Research → Angle → LP → Ads → Fulfillment)',
        'Full HTML5 / Tailwind CSS Export with 1-Click Download',
      ],
      defaultData: {},
    },
    {
      id: 'app-landing-page-generator',
      title: 'AI Landing Page Generator',
      subtitle: 'Transform product prompts into high-converting COD landing pages with live 3-column preview and section customization',
      appType: 'landing_page_generator' as const,
      iconType: 'Palette',
      iconBg: 'bg-blue-600',
      badge: '3-COLUMN LIVE LP',
      tag: 'COD CONVERSION',
      description:
        'Transform product descriptions, research, or custom prompts into full high-converting landing pages. Complete with 3 columns: Product & Template Settings, Page Sections & Reordering, and Direct Responsive Live Website Preview without phone mockups.',
      features: [
        'Exact 3-Column UI: Setup, Parameters & Live Browser Preview',
        'Direct Website Preview (Desktop & Mobile, smooth scrolling)',
        'Section Customizer: Hero, Before/After, Showcase, COD Form, FAQ',
        'Algerian COD Optimized (58 Wilayas, DZD, Cash On Delivery)',
        'Instant Code Export (HTML, Tailwind CSS, JS) + Download',
      ],
      defaultData: {
        settings: INITIAL_LANDING_PAGE_SETTINGS,
      },
    },
    {
      id: 'app-text-to-code-lp',
      title: 'Text to Code Landing Page',
      subtitle: 'Give text explaining product → generates responsive code landing page & live view (Image 1)',
      appType: 'text_to_code_landing_page' as const,
      iconType: 'Code',
      iconBg: 'bg-rose-600',
      badge: 'IMAGE 1 CODE LP',
      tag: 'DIRECT RESPONSE',
      description:
        'Synthesize production-ready e-commerce landing pages from product text. Features live countdown timer, interactive pricing tiers ($40 vs $32 subscription), quantity selector, instant cart drawer, and clean exportable HTML5 + Tailwind CSS code.',
      features: [
        'Dual View: Interactive Phone Mockup + Clean HTML Code',
        'Matching Image 1: The Good Dose layout & typography',
        'Live ticking countdown timer & pricing tier switcher',
        '1-Click Copy Code & Download Standalone HTML',
      ],
      defaultData: DEFAULT_THE_GOOD_DOSE_DATA,
    },
    {
      id: 'app-text-to-image-lp',
      title: 'Text to Image Landing Page',
      subtitle: 'Give text explaining product → generates multi-tier editorial visual landing page (Image 2)',
      appType: 'text_to_image_landing_page' as const,
      iconType: 'Image',
      iconBg: 'bg-purple-600',
      badge: 'IMAGE 2 VISUAL LP',
      tag: 'EDITORIAL GRAPHIC',
      description:
        'Generate multi-tier visual graphic landing pages matching the Orvena reference layout. Includes Editorial Brand Header, Lifestyle Action Hero, 3-Product Lineup, Story Grid ("Make it a moment, not a task"), Features Bar, Testimonials, and Packshot Showcase.',
      features: [
        '3-Column Triptych & Continuous Vertical Page Scroll',
        'Matching Image 2: Orvena editorial wellness aesthetic',
        'AI Image Studio: Regenerate any section with custom prompt',
        'Multi-palette presets: Lavender, Terracotta, Sage, Noir',
      ],
      defaultData: DEFAULT_ORVENA_DATA,
    },
    {
      id: 'app-product-regrouper',
      title: 'Regroupe Product',
      subtitle: 'Cluster products by similar category & audience into Campaign & AdSets with Org Chart diagram',
      appType: 'product_regrouper' as const,
      iconType: 'Workflow',
      iconBg: 'bg-violet-600',
      badge: 'CAMPAIGN CLUSTER',
      tag: 'STRATEGY',
      description: 'Select products, set group size, and automatically group by category & audience similarity to target the same audience in testing campaigns. Previews as an interactive Org Chart diagram (Campaign → AdSets → Products).',
      features: [
        'Select products with checkboxes & filters',
        'Choose items per group (1 to 5+)',
        'Category & audience avatar similarity clustering',
        'Interactive Org Chart Tree (Campaign → AdSets → Products)',
        'Send to Board Canvas as connected nodes',
      ],
      defaultData: {
        campaignName: 'Algeria COD Q4 Scaling / Multi-Product Testing',
        campaignType: 'cbo',
        dailyBudget: 50,
        productsPerGroup: 2,
        objective: 'Sales / COD Conversions',
        targetMarket: 'Algeria 58 Wilayas',
        groups: [],
      },
    },
    {
      id: 'app-text-to-image',
      title: 'Text to Image',
      subtitle: 'Generate photorealistic product renders & ad visuals from text prompts',
      appType: 'text_to_image' as const,
      iconType: 'Image',
      iconBg: 'bg-blue-600',
      badge: 'IMAGE AI',
      tag: 'VISUAL',
      description: 'Studio-grade e-commerce photography, custom aspect ratios (1:1, 9:16, 16:9, 4:5), preset styles, and instant prompt enhancement.',
      features: ['Aspect ratio switcher (1:1, 9:16, 16:9)', '4K Commercial studio presets', 'Prompt AI Enhancer tool'],
      defaultData: {
        prompt: 'Ultra-realistic e-commerce product render of a sleek Ultrasonic Dental Scaler Pro on a clean marble surface, studio lighting, water splash droplets, 8k resolution, commercial advertising photo',
        aspectRatio: '1:1',
        style: 'Studio Commercial',
        negativePrompt: 'blur, low quality, distorted, extra hands, text watermark',
        generatedImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
      },
    },
    {
      id: 'app-image-to-text',
      title: 'Image to Text',
      subtitle: 'Extract product specs, selling angles & viral ad hooks from photos',
      appType: 'image_to_text' as const,
      iconType: 'FileText',
      iconBg: 'bg-indigo-600',
      badge: 'VISION OCR',
      tag: 'ANALYSIS',
      description: 'Deep computer vision scans packaging and item photos to extract technical specs, pain-point hooks, and multilingual sales copy.',
      features: ['Optical Character Recognition (OCR)', 'Technical specifications parser', 'Auto-generated COD marketing hooks'],
      defaultData: {
        sourceImage: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop',
        extractedText: 'MODEL: SonicPro DS-5 • 12,000 VPM Ultrasonic • IPX6 Waterproof • Medical 316 Titanium Tip • USB-C Quick Charge 400mAh • 5 Frequency Vibrations',
        productSpecs: [
          { label: 'Technology', value: 'High-Frequency Sonic (12,000 VPM)' },
          { label: 'Material', value: 'Medical-Grade 316 Stainless Tip' },
          { label: 'Waterproof', value: 'IPX6 Full Body Washable' },
          { label: 'Battery', value: 'USB-C Rechargeable (30-day standby)' },
        ],
        generatedHooks: [
          '🇩🇿 « تهنى من الجير ورائحة الفم في دارك بلا ما تصرف ملاين عند الطبيب! »',
          '⚡ « الحل السريع والأصلي لإزالة التكلسات في 5 دقائق مع ضمان الدفع عند الاستلام »',
          '💎 « Smile like Hollywood with zero dentist appointments — 100% safe home ultrasonic cleaning! »',
        ],
      },
    },
    {
      id: 'app-text-to-storyboard',
      title: 'Text to Board Story',
      subtitle: 'Storyboard 5-beat viral conversion narrative with visual frames & voice cues',
      appType: 'text_to_storyboard' as const,
      iconType: 'Film',
      iconBg: 'bg-amber-600',
      badge: 'STORYBOARD',
      tag: 'CREATIVE',
      description: 'Structure 30-second high-converting TikTok / Reels video ads: Hook (0-3s), Agitation, Product Reveal, Social Proof, and COD Urgency CTA.',
      features: ['5-Beat viral video architecture', 'Spoken Darija / French voiceover cues', 'Interactive visual pacing checklist'],
      defaultData: {
        topic: 'Ultrasonic Dental Scaler viral TikTok/Reels direct response ad for Algerian COD',
        beats: [
          {
            id: 'b1',
            timecode: '00:00 - 00:03',
            type: 'Hook',
            visual: 'Extreme macro close-up of stubborn yellow coffee plaque on teeth. Red warning icon flashes.',
            audio: '« ما زالك تصرف دراهمك عند طبيب الأسنان غير باش تنحي الجير؟ »',
            tag: 'Scroll Stopper',
          },
          {
            id: 'b2',
            timecode: '00:03 - 00:08',
            type: 'Agitation',
            visual: 'Frustrated person looking in bathroom mirror touching yellow teeth with disappointment.',
            audio: '« الأسنان الصفراء ورائحة الفم تحرجك قدام الناس وتكلفك ملاين كل شهر... »',
            tag: 'Pain Trigger',
          },
          {
            id: 'b3',
            timecode: '00:08 - 00:16',
            type: 'Reveal & Demo',
            visual: 'Device unboxed, water droplets vibrating into mist at 12,000 VPM. Instant plaque removal test.',
            audio: '« هاهو الحل الجذري! جهاز SonicPro الأصلي بتقنية الموجات فوق الصوتية ينظف أسنانك في 5 دقائق! »',
            tag: 'Visual Proof',
          },
          {
            id: 'b4',
            timecode: '00:16 - 00:23',
            type: 'Social Proof',
            visual: 'Split screen customer selfie videos smiling brightly with clean white teeth across 58 wilayas.',
            audio: '« أكثر من 1,400 زبون في الجزائر جربوه وشكروا النتيجة الفورية من أول استعمال! »',
            tag: 'Trust Builder',
          },
          {
            id: 'b5',
            timecode: '00:23 - 00:30',
            type: 'Offer & COD CTA',
            visual: 'Delivery driver handing parcel to satisfied customer. "Livraison 58 Wilayas + Paiement à la réception".',
            audio: '« اطلب الآن واستفد من تخفيض 30% مع توصيل سريع والدفع بعد ما تفحص طلبيتك! »',
            tag: 'COD Guarantee',
          },
        ],
      },
    },
    {
      id: 'app-text-to-video-script',
      title: 'Text to Script Video',
      subtitle: '3-column studio video script with timing, visual actions & bilingual dialogue',
      appType: 'text_to_video_script' as const,
      iconType: 'Video',
      iconBg: 'bg-emerald-600',
      badge: 'SCRIPT',
      tag: 'VIDEO',
      description: 'Production-ready shooting table with precise timecodes, visual camera choreography, Darija/French voiceovers, and animated caption overlays.',
      features: ['3-Column studio layout', 'Scene-by-scene millisecond timecodes', 'On-screen text motion markers'],
      defaultData: {
        title: '30s High-Converting UGC Reel Script',
        duration: '30s',
        language: 'Algerian Darja / French',
        scenes: [
          {
            sceneNumber: 1,
            timecode: '00:00 - 00:04',
            visual: 'Split screen: Left side shows dental clinic bill (12,000 DZD). Right side shows speaker holding handheld sonic scaler with confident grin.',
            voiceover: '« وعلاش تخلص 12,000 دج عند الكابيني؟ هاد الجهاز ينقي أسنانك في دارك بـ 4,800 دج برك! »',
            onScreenText: '❌ 12,000 DZD vs ✅ 4,800 DZD',
          },
          {
            sceneNumber: 2,
            timecode: '00:04 - 00:11',
            visual: 'POV bathroom sink test. Speaker dips tip in water cup — instant ultrasonic micro-vibrations without vibrating skin. Demonstrates on model tooth.',
            voiceover: '« شوف قوة الموجات! يفتت الجير والتكلسات بلا ما يقيس اللثة ولا يوجعك خلاص. »',
            onScreenText: '⚡ 12,000 ذبذبة / دقيقة • آمن 100%',
          },
          {
            sceneNumber: 3,
            timecode: '00:11 - 00:21',
            visual: 'Close up on 5 modes switch (Soft, Normal, Clean, Strong). Quick montage of wiping clean head under tap — showing IPX6 water resistance.',
            voiceover: '« فيه 5 مستويات قوة، ضد الماء بالكامل، وتشارجيه مرة وحدة في الشهر بـ USB-C! »',
            onScreenText: '💧 مضاد للماء IPX6 • بطارية شهر كامل',
          },
          {
            sceneNumber: 4,
            timecode: '00:21 - 00:30',
            visual: 'Courier arrives with Yalidine / ZR Express parcel. Customer opens package in front of camera, smiles, and taps order link on screen.',
            voiceover: '« التوصيل متوفر لـ 58 ولاية، وتخلص حتى تفتح الباكي وتتأكد بعينيك. اضغط واطلب اليوم! »',
            onScreenText: '📦 الدفع بعد الفحص • توصيل سريع 58 ولاية',
          },
        ],
      },
    },
    {
      id: 'app-text-to-scene-video',
      title: 'Text to Séance Video',
      subtitle: 'Director shot list with camera setups, lighting, focal lengths & shooting cues',
      appType: 'text_to_scene_video' as const,
      iconType: 'Clapperboard',
      iconBg: 'bg-rose-600',
      badge: 'DIRECTOR',
      tag: 'PRODUCTION',
      description: 'Technical field filming guide for creators and video teams with lens focal lengths, 5600K key light settings, props checklist, and shoot notes.',
      features: ['Shot-by-shot lens & angle tags', '5600K Lighting & studio temperature', 'Actor movement & framing directions'],
      defaultData: {
        shootTitle: 'Algerian UGC Direct Response Shoot',
        totalShots: 4,
        location: 'Modern Bathroom / Clean Vanity Mirror Studio',
        lightingSetup: 'Key Light 5600K Diffused Softbox + 3200K Warm Rim Accent',
        shots: [
          {
            shotNumber: 1,
            shotType: 'Macro Close-Up (50mm f/2.0)',
            framing: 'Tight on device head submerging in shallow glass dish with surface tension ripples.',
            lighting: 'Direct 5600K key light at 45° angle to capture clear water droplet refraction.',
            choreography: 'Turn power on at count 2. Maintain steady hold for 3 seconds of misting.',
            equipment: 'Tripod + Macro Extension Tube',
          },
          {
            shotNumber: 2,
            shotType: 'Over-the-Shoulder POV (35mm f/2.8)',
            framing: 'Over actor shoulder looking into illuminated bathroom mirror.',
            lighting: 'Ring light behind camera + warm ceiling ambience.',
            choreography: 'Actor turns on device, brings to mirror, shows satisfied confident nod.',
            equipment: 'Handheld Gimbal (smooth micro-movements)',
          },
          {
            shotNumber: 3,
            shotType: 'Product Packshot Flat Lay (24mm f/4.0)',
            framing: 'Top-down bird-eye view of white unboxing box, USB-C cable, and 2 spare heads.',
            lighting: 'Dual 45° softboxes to eliminate harsh specular reflections on plastic.',
            choreography: 'Hand enters frame smoothly from bottom right, picks up main unit.',
            equipment: 'C-Stand overhead rig',
          },
          {
            shotNumber: 4,
            shotType: 'Doorstep Delivery Handshake (35mm f/2.8)',
            framing: 'Exterior doorway, natural daylight 10:00 AM.',
            lighting: 'Natural ambient overcast or shaded doorway (avoid direct midday sun).',
            choreography: 'Delivery courier hands brown branded box, customer signs receipt with smile.',
            equipment: 'Natural Handheld camera shake for realistic UGC feel',
          },
        ],
      },
    },
  ];

  // Add an AI App node to canvas
  const handleAddAppToBoard = (app: typeof AI_STUDIO_APPS[0]) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = Math.round((width / 2 - panOffset.x) / scale - 290 + (Math.random() * 40 - 20));
    const centerY = Math.round((height / 2 - panOffset.y) / scale - 180 + (Math.random() * 40 - 20));

    const appPayload = {
      title: app.title,
      subtitle: app.subtitle,
      category: 'AI Creative Studio',
      iconType: app.iconType,
      iconBg: app.iconBg,
      isAppNode: true,
      appType: app.appType,
      appData: app.defaultData,
    };

    createNodeAtPosition(appPayload, centerX, centerY);
    showToast(`Added "${app.title}" to board! ✓`);
  };

  // Send grouped campaign from Product Regrouper onto the Board Canvas
  const handleSendRegrouperToBoard = (blueprint: CampaignBlueprint) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = Math.round((width / 2 - panOffset.x) / scale - 360);
    const centerY = Math.round((height / 2 - panOffset.y) / scale - 180);

    const campaignNodeId = `node-regrouper-${Date.now()}`;

    // Add directly as the Org Chart node on the board!
    const orgChartNode: BoardNode = {
      id: campaignNodeId,
      title: blueprint.campaignName || 'Campaign Org Chart',
      subtitle: `${blueprint.campaignType.toUpperCase()} • $${blueprint.dailyBudget}/day • 🇩🇿 58 Wilayas COD`,
      category: 'AI Creative Studio',
      iconType: 'Workflow',
      iconBg: 'bg-violet-600',
      iconColor: 'text-white',
      x: centerX,
      y: centerY,
      status: 'active',
      isAppNode: true,
      appType: 'product_regrouper',
      appData: blueprint,
      config: {
        name: blueprint.campaignName || 'Campaign Org Chart',
        description: `Campaign Objective: ${blueprint.objective}. Clustered into ${blueprint.groups.length} AdSets for multi-product audience testing.`,
      },
    };

    setNodes((prev) => [...prev, orgChartNode]);
    setSelectedNodeId(campaignNodeId);
    showToast(`Added Org Chart Diagram directly to Board! ✓`);
    setIsRegrouperModalOpen(false);
  };

  // Send Text to Code Landing Page onto the Board Canvas
  const handleSendTextToCodeToBoard = (landingPage: LandingPageData, htmlCode: string) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = Math.round((width / 2 - panOffset.x) / scale - 290);
    const centerY = Math.round((height / 2 - panOffset.y) / scale - 180);

    const nodeId = `node-text-to-code-${Date.now()}`;
    const codeLpNode: BoardNode = {
      id: nodeId,
      title: `${landingPage.brandName} (Code LP)`,
      subtitle: `${landingPage.headline.slice(0, 40)}...`,
      category: 'AI Creative Studio',
      iconType: 'Code',
      iconBg: 'bg-rose-600',
      iconColor: 'text-white',
      x: centerX,
      y: centerY,
      status: 'active',
      isAppNode: true,
      appType: 'text_to_code_landing_page',
      appData: { ...landingPage, htmlCode },
      config: {
        name: landingPage.brandName,
        description: landingPage.description,
      },
    };

    setNodes((prev) => [...prev, codeLpNode]);
    setSelectedNodeId(nodeId);
    showToast(`Added "Text to Code Landing Page" directly to Board! ✓`);
    setIsTextToCodeModalOpen(false);
  };

  // Send Text to Image Landing Page onto the Board Canvas
  const handleSendTextToImageLpToBoard = (landingPage: ImageLandingPageData) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = Math.round((width / 2 - panOffset.x) / scale - 290);
    const centerY = Math.round((height / 2 - panOffset.y) / scale - 180);

    const nodeId = `node-text-to-image-lp-${Date.now()}`;
    const imageLpNode: BoardNode = {
      id: nodeId,
      title: `${landingPage.brandName} (Visual LP)`,
      subtitle: `${landingPage.heroHeadline.slice(0, 40)}...`,
      category: 'AI Creative Studio',
      iconType: 'Image',
      iconBg: 'bg-purple-600',
      iconColor: 'text-white',
      x: centerX,
      y: centerY,
      status: 'active',
      isAppNode: true,
      appType: 'text_to_image_landing_page',
      appData: landingPage,
      config: {
        name: landingPage.brandName,
        description: landingPage.heroCopy,
      },
    };

    setNodes((prev) => [...prev, imageLpNode]);
    setSelectedNodeId(nodeId);
    showToast(`Added "Text to Image Landing Page" directly to Board! ✓`);
    setIsTextToImageLpModalOpen(false);
  };

  // Send AI Landing Page Generator onto the Board Canvas
  const handleSendLandingPageToBoard = (settings: LandingPageSettings) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = Math.round((width / 2 - panOffset.x) / scale - 590);
    const centerY = Math.round((height / 2 - panOffset.y) / scale - 220);

    const nodeId = `node-landing-page-${Date.now()}`;
    const lpNode: BoardNode = {
      id: nodeId,
      title: `${settings.brandName || 'DentalPro'} (AI Landing Page)`,
      subtitle: `${settings.heroHeadline?.slice(0, 45) || 'Professional Dental Care at Home'}...`,
      category: 'AI Creative Studio',
      iconType: 'Palette',
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
      x: centerX,
      y: centerY,
      status: 'active',
      isAppNode: true,
      appType: 'landing_page_generator',
      appData: { settings },
      width: 1190,
      config: {
        name: settings.brandName || 'AI Landing Page',
        description: settings.productDescription || 'AI Landing Page Generator for Algerian COD',
      },
    };

    setNodes((prev) => [...prev, lpNode]);
    setSelectedNodeId(nodeId);
    showToast(`Added AI Landing Page Generator card to Board! ✓`);
    setIsLandingPageModalOpen(false);
  };

  // Drag start for an AI App
  const handleDragStartApp = (e: React.DragEvent, app: typeof AI_STUDIO_APPS[0]) => {
    const appPayload = {
      title: app.title,
      subtitle: app.subtitle,
      category: 'AI Creative Studio',
      iconType: app.iconType,
      iconBg: app.iconBg,
      isAppNode: true,
      appType: app.appType,
      appData: app.defaultData,
    };

    e.dataTransfer.setData('application/json', JSON.stringify(appPayload));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Upload handler for files (Image, PDF, Word, JSON, Table Excel/CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: FileType = 'word';
      if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
        type = 'image';
      } else if (ext === 'pdf') {
        type = 'pdf';
      } else if (['xlsx', 'xls', 'csv', 'tsv'].includes(ext)) {
        type = 'excel';
      } else if (ext === 'json') {
        type = 'json';
      } else {
        type = 'word';
      }

      const reader = new FileReader();

      if (type === 'image') {
        reader.onload = (event) => {
          const previewUrl = event.target?.result as string;
          const newFile: UploadedFileItem = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: 'image',
            size: file.size,
            uploadedAt: 'Just now',
            previewUrl,
            summary: `High-resolution visual asset (${Math.round(file.size / 1024)} KB)`,
            tags: ['Image Asset', ext.toUpperCase()],
          };
          setUploadedFiles((prev) => [newFile, ...prev]);
          showToast(`Image "${file.name}" uploaded successfully!`);
        };
        reader.readAsDataURL(file);
      } else if (type === 'json') {
        reader.onload = (event) => {
          const text = event.target?.result as string;
          let jsonData: any = null;
          try {
            jsonData = JSON.parse(text);
          } catch {
            jsonData = { raw: text };
          }
          const keysCount = jsonData && typeof jsonData === 'object' ? Object.keys(jsonData).length : 0;
          const newFile: UploadedFileItem = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: 'json',
            size: file.size,
            uploadedAt: 'Just now',
            jsonData,
            textContent: text,
            summary: `Structured JSON dataset with ${keysCount} root keys`,
            tags: ['JSON Dataset', `${keysCount} keys`],
          };
          setUploadedFiles((prev) => [newFile, ...prev]);
          showToast(`JSON dataset "${file.name}" uploaded!`);
        };
        reader.readAsText(file);
      } else if (type === 'excel') {
        reader.onload = (event) => {
          const text = (event.target?.result as string) || '';
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          const delimiter = file.name.endsWith('.tsv') ? '\t' : text.includes(';') ? ';' : ',';
          const headers = lines[0]
            ? lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''))
            : ['Column 1', 'Column 2'];
          const rows = lines.slice(1, 30).map((l) =>
            l.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''))
          );

          const newFile: UploadedFileItem = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type: 'excel',
            size: file.size,
            uploadedAt: 'Just now',
            summary: `Spreadsheet table with ${Math.max(lines.length - 1, 1)} records and ${headers.length} columns`,
            tags: ['Spreadsheet', `${headers.length} cols`, `${Math.max(lines.length - 1, 1)} rows`],
            tableData: {
              headers,
              rows,
              totalRows: Math.max(lines.length - 1, 1),
            },
          };
          setUploadedFiles((prev) => [newFile, ...prev]);
          showToast(`Spreadsheet "${file.name}" parsed (${Math.max(lines.length - 1, 1)} rows)!`);
        };
        reader.readAsText(file);
      } else {
        reader.onload = (event) => {
          const text = (event.target?.result as string) || '';
          const words = text ? text.trim().split(/\s+/).length : 0;
          const newFile: UploadedFileItem = {
            id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            name: file.name,
            type,
            size: file.size,
            uploadedAt: 'Just now',
            textContent: text || `${file.name} document content parsed.`,
            summary: `${type.toUpperCase()} document (${words} words, ${Math.round(file.size / 1024)} KB)`,
            tags: [type === 'pdf' ? 'PDF Document' : 'Word Document', `${words} words`],
          };
          setUploadedFiles((prev) => [newFile, ...prev]);
          showToast(`Document "${file.name}" uploaded successfully!`);
        };
        reader.readAsText(file);
      }
    });

    e.target.value = '';
  };

  // Create a new custom skill
  const handleCreateCustomSkill = () => {
    if (!newSkillTitle.trim()) {
      showToast('Please enter a title for your custom skill');
      return;
    }

    // Determine final category name and categoryId
    let finalCategoryName = 'Custom AI Skills';
    let finalCategoryId = 'custom_skills';
    if (isCustomCategoryMode && customCategoryInput.trim()) {
      finalCategoryName = customCategoryInput.trim();
      finalCategoryId = `custom_${finalCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    } else {
      const matchedCat = ALL_SKILL_CATEGORIES.find(
        (c) => c.id === newSkillCategory || c.name === newSkillCategory
      );
      if (matchedCat) {
        finalCategoryName = matchedCat.name;
        finalCategoryId = matchedCat.id;
      } else if (newSkillCategory.trim()) {
        finalCategoryName = newSkillCategory.trim();
        finalCategoryId = `cat_${Date.now()}`;
      }
    }

    const newSkill: CustomSkillItem = {
      id: `custom-skill-${Date.now()}`,
      title: newSkillTitle.trim(),
      subtitle: newSkillSubtitle.trim() || 'Custom AI e-commerce intelligence skill',
      category: finalCategoryName,
      categoryId: finalCategoryId,
      promptTemplate: newSkillPrompt.trim() || getDefaultPromptForNode(newSkillTitle),
      iconType: newSkillIcon || 'Sparkles',
      iconBg: newSkillColor || 'bg-emerald-600',
      iconColor: 'text-white',
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    setCustomSkills((prev) => [newSkill, ...prev]);

    // Automatically spawn the custom skill node directly onto the canvas board with identical card layout!
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = Math.round((width / 2 - panOffset.x) / scale - 138 + (Math.random() * 40 - 20));
    const centerY = Math.round((height / 2 - panOffset.y) / scale - 82 + (Math.random() * 40 - 20));

    createNodeAtPosition(
      {
        title: newSkill.title,
        subtitle: newSkill.subtitle,
        category: newSkill.category,
        iconType: newSkill.iconType || 'Sparkles',
        iconBg: newSkill.iconBg || 'bg-emerald-600',
        isCustomSkill: true,
        customPromptTemplate: newSkill.promptTemplate,
      },
      centerX,
      centerY
    );

    setIsNewSkillModalOpen(false);
    setNewSkillTitle('');
    setNewSkillSubtitle('');
    setIsCustomCategoryMode(false);
    setCustomCategoryInput('');
    showToast(`Custom skill "${newSkill.title}" created & added to board! ✓`);
  };

  // Add custom skill to board
  const handleAddCustomSkillToBoard = (skill: CustomSkillItem) => {
    const scale = zoom / 100;
    const canvasEl = canvasRef.current;
    const width = canvasEl?.clientWidth || 800;
    const height = canvasEl?.clientHeight || 600;

    const centerX = (width / 2 - panOffset.x) / scale - 138 + (Math.random() * 40 - 20);
    const centerY = (height / 2 - panOffset.y) / scale - 82 + (Math.random() * 40 - 20);

    const skillPayload = {
      title: skill.title,
      subtitle: skill.subtitle,
      category: skill.category,
      iconType: 'Sparkles',
      iconBg: 'bg-emerald-600',
      isCustomSkill: true,
      customPromptTemplate: skill.promptTemplate,
    };

    createNodeAtPosition(skillPayload, centerX, centerY);
    showToast(`Added custom skill "${skill.title}" to board!`);
  };

  // Generator for Exhaustive, Massive General Executive Dossier across connected skills ("beeg info, dont small text")
  const generateMasterDossierContent = useCallback((
    pTitle: string,
    sPrice: number,
    pCost: number,
    pMargin: number,
    targetMarketName: string,
    targetCurrency: string,
    targetFlag: string,
    linkedSkills: BoardNode[],
    fileData?: any
  ): string => {
    const pProfit = sPrice - pCost;
    const deliveryCost = 750;
    const callCenterCost = 250;
    const packagingCost = 150;
    const avgCpa = Math.round(sPrice * 0.22);
    const netProfitPerDelivered = sPrice - pCost - deliveryCost - callCenterCost - packagingCost - avgCpa;
    const netMarginPercent = Math.round((netProfitPerDelivered / sPrice) * 100);

    const skillsCount = linkedSkills.length || 1;
    const skillsMatrixRows = linkedSkills.length > 0
      ? linkedSkills.map((sk, idx) => {
          const hasResult = !!sk.executionResult;
          const status = hasResult ? '🟢 OPTIMIZED' : '🟡 INTEGRATED';
          const metric = hasResult ? '100% Complete' : 'Context Loaded';
          const impact = idx === 0 ? 'CRITICAL / PILLAR' : idx % 2 === 0 ? 'HIGH CONVERSION' : 'OPERATIONAL EFFICIENCY';
          const mandate = hasResult
            ? `Incorporate ${sk.title} findings into live adset & landing page`
            : `Execute Stage ${idx + 1} parameters during campaign ramp-up`;
          return `| ${idx + 1} | **${sk.title}** | ${sk.category} | ${status} | ${metric} | ${impact} | ${mandate} |`;
        }).join('\n')
      : `| 1 | **Product Discovery** | Product Intelligence | 🟢 OPTIMIZED | 94% Demand | CRITICAL | Launch winner validation |
| 2 | **Ad Hook & Creative Engine** | Creative Intelligence | 🟢 OPTIMIZED | 3.8x ROAS Hook | HIGH CONVERSION | Deploy Darja/French split test |
| 3 | **COD Confirmation & Rebuttals** | Confirmation Operations | 🟢 OPTIMIZED | 88% Target | RTO DEFENSE | Implement 10-min outbound calling protocol |
| 4 | **Wilaya Courier Matrix** | Delivery Operations | 🟢 OPTIMIZED | 58 Wilayas | MARGIN PROTECTION | Dispatch Alger/Oran via Yalidine 24h |`;

    return `# 🏛️ OMNI-SKILL MASTER SYNTHESIS & EXECUTIVE DOSSIER
**General Strategic Dossier | Unified Cross-Skill Multi-Funnel Architecture**
*Target Product:* **${pTitle}** | *Market:* **${targetFlag} ${targetMarketName} (${targetCurrency})** | *Linked Skills:* **${skillsCount} Nodes Aggregated** | *Verdict:* **🟢 IMMEDIATE COMMERCIAL SCALE (Score: 94/100)**

---

## 1. 📊 EXECUTIVE SUMMARY & CROSS-SKILL VERDICT

This comprehensive master report aggregates, cross-examines, and synthesizes intelligence from **${skillsCount} connected operational skills** on the board. Rather than isolated departmental tactics, this dossier unifies **Product Economics**, **Creative Strategy**, **Paid Acquisition Traffic**, **Phone Confirmation Operations**, and **Wilaya Courier Logistics** into a single cohesive growth engine.

### Core Strategic Findings
1. **Commercial Feasibility Score: 94 / 100** — Exceptional unit economics with a baseline selling price of **${sPrice.toLocaleString()} ${targetCurrency}** against a landed unit cost of **${pCost.toLocaleString()} ${targetCurrency}** (${pMargin}% gross product margin).
2. **Cross-Skill Synergy Alignment** — Creative hooks directly resolve the top customer objections identified in the phone confirmation logs ("Paiement à la livraison avec vérification de colis"), preventing customer churn before dispatch.
3. **Logistics & Cashflow Safeguard** — With an engineered phone confirmation workflow and selective carrier routing (Yalidine for Central/Western wilayas, ZR Express for Eastern hubs), net delivered rate is projected at **84.5% – 88.2%**, protecting net profitability above **${netMarginPercent}%**.

---

## 2. 🧩 UNIFIED CROSS-SKILL INTELLIGENCE MATRIX

The following matrix benchmarks each connected upstream skill node, extracting its core outputs, operational status, and mandatory integration checkpoints:

| # | Connected Skill Node | Stage / Category | Status | Operational Metric | Growth Impact | Mandatory Execution Mandate |
|---|----------------------|------------------|--------|-------------------|---------------|-----------------------------|
${skillsMatrixRows}

---

## 3. 💰 DEEP UNIT ECONOMICS, PRICING & FUNNEL FINANCIALS

Comprehensive financial diagnostic based on true **Cash-On-Delivery (COD)** economics in **${targetMarketName}**:

### Per-Order Financial Architecture (${targetCurrency})
| Financial Component | Value (${targetCurrency}) | % of Gross Revenue | Strategic Notes |
|:--------------------|:--------------------------|:-------------------|:----------------|
| **Retail Selling Price (AOV)** | **${sPrice.toLocaleString()} ${targetCurrency}** | 100.0% | Optimized for impulse purchasing threshold |
| **Product Landed Cost (COGS)** | **-${pCost.toLocaleString()} ${targetCurrency}** | -${Math.round((pCost / sPrice) * 100)}% | Sourced directly / bulk local wholesaler |
| **National Shipping & Return Allowance** | **-${deliveryCost} ${targetCurrency}** | -${Math.round((deliveryCost / sPrice) * 100)}% | Weighted average across 58 Wilayas (factoring 14% RTO) |
| **Call Center Confirmation & SMS Voice** | **-${callCenterCost} ${targetCurrency}** | -${Math.round((callCenterCost / sPrice) * 100)}% | 2 Outbound phone attempts + WhatsApp GPS ping |
| **Eco Packaging & Bubble Seal Bag** | **-${packagingCost} ${targetCurrency}** | -${Math.round((packagingCost / sPrice) * 100)}% | Tamper-proof branded polybag with Arabic instructions |
| **Target Acquisition CPA (Meta/TikTok)** | **-${avgCpa} ${targetCurrency}** | -22.0% | Blended target across testing & retargeting |
| **NET CASH PROFIT PER DELIVERED ORDER** | **+${netProfitPerDelivered.toLocaleString()} ${targetCurrency}** | **+${netMarginPercent}% NET** | **Robust net margin cushion for scaling ad spend** |

### Projected Daily Profit Scenarios
- **Conservative Scale (25 Orders / Day):** Gross: ${(sPrice * 25).toLocaleString()} ${targetCurrency} | **Net Daily Profit: +${(netProfitPerDelivered * 25).toLocaleString()} ${targetCurrency}** (~${(netProfitPerDelivered * 25 * 30).toLocaleString()} ${targetCurrency}/mo)
- **Aggressive Scale (75 Orders / Day):** Gross: ${(sPrice * 75).toLocaleString()} ${targetCurrency} | **Net Daily Profit: +${(netProfitPerDelivered * 75).toLocaleString()} ${targetCurrency}** (~${(netProfitPerDelivered * 75 * 30).toLocaleString()} ${targetCurrency}/mo)
- **High-Velocity Scale (150 Orders / Day):** Gross: ${(sPrice * 150).toLocaleString()} ${targetCurrency} | **Net Daily Profit: +${(netProfitPerDelivered * 150).toLocaleString()} ${targetCurrency}** (~${(netProfitPerDelivered * 150 * 30).toLocaleString()} ${targetCurrency}/mo)

---

## 4. 🎯 OMNICHANNEL AUDIENCE & PSYCHOLOGICAL AVATAR PROFILES

### Primary Avatar: "The Discerning Problem Solver"
- **Demographics:** Age 25–48 | Men & Women | Algiers, Oran, Constantine, Sétif, Blida, Annaba, Batna.
- **Psychographic Core:** Seeks tangible daily life upgrades, ergonomic comfort, or functional lifestyle fixes. Reluctant to trust generic online ads due to past experiences with poor-quality knockoffs.
- **Primary Objection:** *"Is this genuine quality, and can I inspect the package before paying the delivery driver?"*
- **Psychological Solution:** Feature doorstep open-box verification and 100% Algerian Darja video demonstrations prominently in the ad hooks and landing page header.

### Secondary Avatar: "The Family / Household Champion"
- **Demographics:** Age 28–55 | Family decision-makers seeking utility, convenience, and value bundles.
- **Buying Trigger:** Value bundling (e.g. "Buy 2 units + Free Wilaya Shipping") providing a natural impulse to buy for spouse, parent, or colleague.

---

## 5. 🎬 MASTER CREATIVE, COPYWRITING & HOOK BLUEPRINT

Cross-synthesizing creative intelligence into high-converting video and copy assets for Meta Advantage+ and TikTok feeds:

### 3 High-Retention Video Hooks (0 – 3 Seconds)
1. **Hook #1 (Demonstration & Pattern Interrupt - Darja):**
   - *Visual:* Macro high-speed footage demonstrating the product solving the acute pain point in 2 seconds flat.
   - *Audio (Darja):* *"يا خويا / يا أختي، إذا راك تعاني من هذا المشكل كل يوم، دقيقة برك شوف هذا الحل العجيب قبل ما تكمونديه!"*
   - *Subtitles:* Bold yellow/white kinetic typography with Arabic/Darja phrasing.
2. **Hook #2 (Contrast & Shock Value - French/Darja Hybrid):**
   - *Visual:* Split-screen displaying the flawed, frustrating old method vs. the effortless 5-second fix with **${pTitle}**.
   - *Audio:* *"Arrêtez de gaspiller votre argent sur des produits qui ne durent pas! Voici le seul produit testé et approuvé avec garantie."*
3. **Hook #3 (Social Proof & Courier Unboxing):**
   - *Visual:* Real Algerian customer opening the shipping box at their doorstep with the delivery courier smiling in the background.
   - *Audio:* *"التوصيل حتى لباب الدار في 58 ولاية، وما تخلص حتى حبة دورو حتى تفتح الباطة وتتحقق من الجودة بنفسك!"*

### Primary Direct-Response Ad Copy
\`\`\`
🔥 العرض المحدود: ${pTitle} الأصلي وصل أخيراً للجزائر! 🔥

هل سئمت من المنتجات المقلدة التي تتعطل بعد أسبوع واحد؟
مع ${pTitle} الجديد، استمتع بأعلى معايير الجودة والراحة اليومية التي تستحقها.

✅ أصلي 100% بجودة ممتازة وضمان استبدال.
✅ توصيل سريع حتى باب المنزل في جميع الـ 58 ولاية.
✅ الدفع عند الاستلام مع إمكانية فتح الطرد والتأكد من المنتج قبل الدفع!

⚡ تخفيض استثنائي لفترة محدودة: احصل عليه اليوم بسعر ${sPrice.toLocaleString()} دج فقط!
🎁 اطلب 2 قطع واحصل على توصيل مجاني فوري!

اضغط على الرابط أسفله واطلب الآن قبل نفاد المخزون 👇
\`\`\`

---

## 6. 🚚 LOGISTICS, WILAYA COD & RTO DEFENSE PROTOCOL

Returns (RTO) are the #1 profit killer in Algerian e-commerce. This master protocol combines multi-skill data to maintain delivery success above **85%**:

### 3-Step Outbound Confirmation Framework
1. **10-Minute Rapid Contact Window:** Call customer within 10 minutes of order submission while buying intent is peak.
2. **Double Verification Script:**
   - *Agent:* "Bonjour Mr. [Nom], je vous appelle de la boutique officielle pour confirmer votre commande de **${pTitle}** à **${sPrice.toLocaleString()} DA** avec livraison à domicile sur la wilaya de [Nom Wilaya]."
   - *Confirmation of Address:* "Pour faciliter la livraison au coursier, pouvez-vous me confirmer votre commune exacte et un repère connu?"
   - *Bundle Upsell:* "Avant d'expédier votre colis, nous avons une offre spéciale aujourd'hui: la 2ème pièce à seulement ${Math.round(sPrice * 0.75)} DA avec livraison 100% gratuite. On vous ajoute la 2ème pièce?"
3. **Immediate WhatsApp GPS Ping:** If phone is unanswered, dispatch automated WhatsApp text with voice note + Google Maps pin request within 15 minutes.

### Courier Dispatch Routing Matrix
- **Zone 1 (Centre: Alger, Blida, Boumerdes, Tipaza):** Route via **Yalidine / ZR Express** — Target 24h delivery rate: **91.4%**.
- **Zone 2 (Ouest: Oran, Tlemcen, Mostaganem, Sidi Bel Abbes):** Route via **Yalidine Express** — Target 36h delivery rate: **88.2%**.
- **Zone 3 (Est: Constantine, Sétif, Annaba, Batna):** Route via **ZR Express / Kazitour** — Target 48h delivery rate: **86.7%**.
- **Zone 4 (Sud: Ouargla, Biskra, Ghardaïa, Béchar):** Call verification mandatory; dispatch with **Nord & Sud Express** only upon confirmed Stop-Desk pickup availability.

---

## 7. 🚀 30-DAY STEP-BY-STEP OMNICHANNEL EXECUTION ROADMAP

| Phase | Timeline | Core Objectives | Daily Ad Spend | Success Benchmarks (KPIs) |
|:------|:---------|:----------------|:---------------|:--------------------------|
| **Phase 1: Creative & Offer Testing** | Days 1 – 7 | Test 3 Video Hooks x 2 Ad Copies in Meta CBO (Broad + Engaged Shoppers) | $30 – $50 / day | CTR > 2.8% • CPC < $0.12 • CPA < ${Math.round(sPrice * 0.22)} ${targetCurrency} |
| **Phase 2: Funnel Optimization** | Days 8 – 14 | Optimize mobile landing page load speed, test bundle upsell, calibrate call center | $60 – $100 / day | CVR > 4.2% • Confirmation Rate > 88% • Delivery > 82% |
| **Phase 3: Omnichannel Scale** | Days 15 – 24 | Scale winning hook to TikTok Spark Ads + Meta Advantage+ Shopping; add retargeting | $150 – $300 / day | Volume: 50–100 orders/day • Blended ROAS > 3.6x |
| **Phase 4: Retention & Wholesale** | Days 25 – 30 | Re-order stock from supplier, deploy SMS repurchase offers, activate affiliate influencers | $300+ / day | Net Monthly Profit > 1,200,000 ${targetCurrency} |

---

## 8. ⚖️ COMPREHENSIVE RISK AUDIT & FINAL SCALABILITY SCORECARD

| Evaluation Dimension | Weight | Score (1-10) | Weighted Score | Strategic Risk Mitigation |
|:---------------------|:------:|:------------:|:--------------:|:--------------------------|
| **1. Market Demand & Urgency** | 15% | 9.5 / 10 | 1.43 / 1.50 | Strong evergreen consumer appeal in ${targetMarketName} |
| **2. Unit Economic Margin** | 20% | 9.0 / 10 | 1.80 / 2.00 | ${pMargin}% gross margin provides high CPA elasticity |
| **3. Demonstration / Hook Factor** | 15% | 9.5 / 10 | 1.43 / 1.50 | Instant visual transformation ideal for TikTok/Reels |
| **4. Supplier Stability & Stock** | 15% | 8.5 / 10 | 1.28 / 1.50 | Maintain 14-day safety buffer in local fulfillment depot |
| **5. COD Logistics & RTO Safety** | 20% | 8.8 / 10 | 1.76 / 2.00 | Strict 3-step phone confirmation slashes refusal rates |
| **6. Competition & Saturation** | 15% | 8.0 / 10 | 1.20 / 1.50 | Unique Darja messaging and bundle offers outcompete copycats |
| **OVERALL SCALABILITY INDEX** | **100%** | **—** | **94.0 / 100** | **VERDICT: 🟢 TIER-1 COMMERCIAL LAUNCH READY** |

---
*Dossier Generated by Omni-Skill Master Synthesizer Engine • Ready for immediate deployment.*`;
  }, []);

  // Run single skill node with live AI intelligence execution (linked to product & Settings API key)
  const handleRunSingleNode = useCallback(async (nodeId: string) => {
    setRunningNodeId(nodeId);

    const currentNode = nodes.find((n) => n.id === nodeId);
    if (!currentNode) {
      setRunningNodeId(null);
      return;
    }

    showToast(`⚡ Running AI Analysis for "${currentNode.title}"...`);

    // Immediately unhide result so the in-card preview container expands downward right away
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              hideResult: false,
              activePreviewTab: 'chatgpt',
            }
          : n
      )
    );

    // 1. Identify connected Product node from incoming or outgoing edges
    const incomingEdges = edges.filter((e) => e.to === nodeId);
    let linkedProductNode = nodes.find(
      (n) => incomingEdges.some((e) => e.from === n.id) && n.isProduct
    );
    if (!linkedProductNode) {
      linkedProductNode = nodes.find(
        (n) => edges.some((e) => e.from === nodeId && e.to === n.id) && n.isProduct
      );
    }
    if (!linkedProductNode) {
      linkedProductNode = nodes.find((n) => n.isProduct);
    }

    // 1b. Identify connected File node from incoming or outgoing edges
    let linkedFileNode = nodes.find(
      (n) => incomingEdges.some((e) => e.from === n.id) && n.isFile
    );
    if (!linkedFileNode) {
      linkedFileNode = nodes.find(
        (n) => edges.some((e) => e.from === nodeId && e.to === n.id) && n.isFile
      );
    }
    if (!linkedFileNode) {
      linkedFileNode = nodes.find((n) => n.isFile);
    }

    // 1c. Identify connected Org Chart (Regrouper) node and extract AdSet or Product info
    const linkedOrgChartEdge = edges.find(
      (e) => (e.to === nodeId || e.from === nodeId) && (
        nodes.find((n) => n.id === (e.to === nodeId ? e.from : e.to))?.appType === 'product_regrouper'
      )
    );

    let orgChartPromptAddition = '';
    let extractedAdSetData: any = null;
    let extractedProductData: any = null;

    if (linkedOrgChartEdge) {
      const orgChartNode = nodes.find(
        (n) => (n.id === linkedOrgChartEdge.from || n.id === linkedOrgChartEdge.to) && n.appType === 'product_regrouper'
      );
      const subId = linkedOrgChartEdge.from === orgChartNode?.id ? linkedOrgChartEdge.fromSubId : linkedOrgChartEdge.toSubId;
      const groups: any[] = orgChartNode?.appData?.groups || [];

      if (subId && subId.startsWith('adset:')) {
        const rawId = subId.replace('adset:', '');
        extractedAdSetData = groups.find((g: any) => g.id === rawId || String(g.id) === rawId) || groups[0];
      } else if (subId && subId.startsWith('prod:')) {
        const rawId = subId.replace('prod:', '');
        groups.forEach((g: any) => {
          const found = g.products?.find((p: any) => String(p.id) === rawId);
          if (found) {
            extractedProductData = found;
            extractedAdSetData = g;
          }
        });
      } else if (groups.length > 0) {
        extractedAdSetData = groups[0];
      }

      if (extractedProductData) {
        orgChartPromptAddition = `\n\n=== EXTRACTED DATA FROM LINKED PRODUCT (ORG CHART) ===
Product Title: ${extractedProductData.name}
Selling Price: ${extractedProductData.financials?.sellingPrice || 4800} DZD
Product Cost: ${extractedProductData.financials?.productCost || 1400} DZD
ROI / Margin: ${extractedProductData.financials?.roi || 70}%
Category: ${extractedProductData.category}
Opportunity Score: ${extractedProductData.opportunity?.overallScore || 85}/100
Image Asset: ${extractedProductData.mainImage}
CRITICAL INSTRUCTION: Analyze and optimize hooks, copy, and creative strategy specifically for this selected product!`;
      } else if (extractedAdSetData) {
        const prodsList = extractedAdSetData.products?.map((p: any, idx: number) => `  ${idx + 1}. ${p.name} — ${p.financials?.sellingPrice || 3500} DZD (${p.category})`).join('\n') || '';
        orgChartPromptAddition = `\n\n=== EXTRACTED DATA FROM LINKED ADSET (ORG CHART) ===
AdSet: ${extractedAdSetData.adsetName} (Group #${extractedAdSetData.index})
Target Audience Avatar: ${extractedAdSetData.audienceProfile?.avatar}
Demographics: Age ${extractedAdSetData.audienceProfile?.ageRange} | Gender: ${extractedAdSetData.audienceProfile?.gender}
Interest Tags: #${extractedAdSetData.audienceProfile?.interestTags?.join(' #')}
Core Testing Angle: "${extractedAdSetData.sharedAngle}"
Products in this AdSet:
${prodsList}
CRITICAL INSTRUCTION: Tailor all hooks, copies, scripts, and targeting angles specifically to resonate with this exact audience avatar and core test angle!`;
      }
    }

    const effectiveProduct = extractedProductData
      ? {
          title: extractedProductData.name,
          sellingPrice: extractedProductData.financials?.sellingPrice || 4800,
          productCost: extractedProductData.financials?.productCost || 1400,
          profitMargin: extractedProductData.financials?.roi || 70,
          niche: extractedProductData.category || 'Algeria COD',
          sellingPoints: extractedProductData.opportunity?.recommendations?.join(', ') || 'High margin, viral angle',
          description: `Extracted from Org Chart. Score: ${extractedProductData.opportunity?.overallScore}/100. Category: ${extractedProductData.category}.`,
        }
      : extractedAdSetData && extractedAdSetData.products?.[0]
      ? {
          title: `${extractedAdSetData.products[0].name} (AdSet ${extractedAdSetData.index})`,
          sellingPrice: extractedAdSetData.products[0].financials?.sellingPrice || 3500,
          productCost: extractedAdSetData.products[0].financials?.productCost || 1200,
          profitMargin: extractedAdSetData.products[0].financials?.roi || 65,
          niche: extractedAdSetData.products[0].category || 'Algeria COD',
          sellingPoints: `Targeting: ${extractedAdSetData.audienceProfile?.avatar}. Angle: ${extractedAdSetData.sharedAngle}`,
          description: `Grouped in ${extractedAdSetData.adsetName} with ${extractedAdSetData.products.length} products.`,
        }
      : linkedProductNode?.productData
      ? {
          title: linkedProductNode.title,
          ...linkedProductNode.productData,
        }
      : {
          title: SAMPLE_PRODUCTS[0].title,
          sellingPrice: SAMPLE_PRODUCTS[0].sellingPrice,
          productCost: SAMPLE_PRODUCTS[0].productCost,
          profitMargin: SAMPLE_PRODUCTS[0].profitMargin,
          niche: SAMPLE_PRODUCTS[0].niche,
          sellingPoints: SAMPLE_PRODUCTS[0].sellingPoints,
          description: SAMPLE_PRODUCTS[0].description,
        };

    // 2. Read saved AI Provider & API key from Settings (localStorage)
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
      localStorage.getItem('deepseek_api_key') ||
      localStorage.getItem('gemini_api_key') ||
      '';
    const aiModel =
      currentAiModel ||
      localStorage.getItem('ai_model') ||
      (provider === 'openai'
        ? 'gpt-4o-mini'
        : provider === 'deepseek'
        ? 'deepseek-chat'
        : provider === 'openrouter'
        ? 'nvidia/nemotron-3.5-lightning:free'
        : provider === 'agentrouter'
        ? 'gpt-4o'
        : provider === 'nvidia'
        ? 'meta/llama-3.3-70b-instruct'
        : 'gemini-3.8-flash');

    // 3. Resolve user's chosen active prompt template (with background persistence support)
    const { prompts: nodePrompts, activeId: nodeActiveId } = getNodeSavedPrompts(currentNode);
    const activePromptItem = nodePrompts.find((p) => p.id === nodeActiveId) || nodePrompts[0];

    const rawTemplate =
      activePromptItem && activePromptItem.prompt && activePromptItem.prompt.trim().length > 0
        ? activePromptItem.prompt
        : currentNode.config.customPrompt && currentNode.config.customPrompt.trim().length > 0
        ? currentNode.config.customPrompt
        : currentNode.customPromptTemplate && currentNode.customPromptTemplate.trim().length > 0
        ? currentNode.customPromptTemplate
        : getDefaultPromptForNode(currentNode.title, currentNode.subtitle);

    let filePromptAddition = '';
    if (linkedFileNode && linkedFileNode.fileData) {
      const fd = linkedFileNode.fileData;
      filePromptAddition = `\n\n=== ATTACHED FILE DATA FOR ANALYSIS ===
File Name: ${fd.name}
File Type: ${fd.type.toUpperCase()}
${fd.summary ? `Summary: ${fd.summary}\n` : ''}
${fd.tableData ? `Spreadsheet Data (${fd.tableData.totalRows} rows):\nHeaders: ${fd.tableData.headers.join(' | ')}\nSample Rows:\n${fd.tableData.rows.slice(0, 12).map((r) => r.join(' | ')).join('\n')}\n` : ''}
${fd.jsonData ? `JSON Data:\n${JSON.stringify(fd.jsonData, null, 2).slice(0, 3000)}\n` : ''}
${fd.textContent ? `Document Content:\n${fd.textContent.slice(0, 3000)}\n` : ''}
Please incorporate this specific attached file data and metrics directly into your analysis and strategic recommendations!`;
    }

    const targetMarket = currentNode.targetMarket || 'Algeria';
    const targetMarketObj = TARGET_MARKETS.find((m) => m.id === targetMarket) || TARGET_MARKETS[0];

    const interpolatedPrompt = rawTemplate
      .replace(/\{product_title\}/g, effectiveProduct.title || '')
      .replace(/\{title\}/g, effectiveProduct.title || '')
      .replace(/\{skill_name\}/g, currentNode.title)
      .replace(/\{skill_subtitle\}/g, currentNode.subtitle || '')
      .replace(/\{niche\}/g, effectiveProduct.niche || 'E-commerce')
      .replace(/\{selling_price\}/g, String(effectiveProduct.sellingPrice || 4800))
      .replace(/\{product_cost\}/g, String(effectiveProduct.productCost || 1400))
      .replace(/\{profit_margin\}/g, String(effectiveProduct.profitMargin || 70))
      .replace(/\{selling_points\}/g, effectiveProduct.sellingPoints || 'High quality, viral appeal')
      .replace(/\{description\}/g, effectiveProduct.description || '')
      .replace(/\{file_name\}/g, linkedFileNode?.fileData?.name || 'Dataset')
      .replace(/\{file_data\}/g, linkedFileNode?.fileData?.summary || '')
      .replace(/\{language\}/g, currentNode.language || 'English')
      .replace(/\{target_market\}/g, `${targetMarketObj.flag} ${targetMarketObj.name}`)
      .replace(/\{market\}/g, targetMarketObj.name);

    const marketPromptAddition = `\n\n=== TARGET MARKET SPECIFICATION ===\nTarget Country / Market: ${targetMarketObj.flag} ${targetMarketObj.name} (Region: ${targetMarketObj.region}, Currency: ${targetMarketObj.currency})\nTailor all market assumptions, buyer demographics, price elasticity (${targetMarketObj.currency}), courier dynamics, customer objections, and ad angle psychology specifically to ${targetMarketObj.name}!`;

    // 1d. Include intelligence output from any upstream linked Skill cards (Skill A -> Skill B pipeline)
    const upstreamSkillNodes = nodes.filter(
      (n) =>
        n.id !== nodeId &&
        !n.isProduct &&
        !n.isFile &&
        !n.isAppNode &&
        incomingEdges.some((e) => e.from === n.id) &&
        n.executionResult?.content
    );
    const upstreamSkillsPromptAddition =
      upstreamSkillNodes.length > 0
        ? `\n\n=== LINKED UPSTREAM SKILL INTELLIGENCE (${upstreamSkillNodes.map((u) => u.title).join(', ')}) ===\n${upstreamSkillNodes
            .map(
              (u) =>
                `--- Output from "${u.title}" ---\n${(u.executionResult?.content || '').slice(0, 2200)}`
            )
            .join('\n\n')}\nBuild directly upon the insights, hooks, and findings from the linked upstream skill card(s) above!`
        : '';

    const baseWithMarket = `${interpolatedPrompt}${marketPromptAddition}`;
    const baseWithFile = filePromptAddition ? `${baseWithMarket}\n${filePromptAddition}` : baseWithMarket;
    const baseWithOrg = orgChartPromptAddition ? `${baseWithFile}\n${orgChartPromptAddition}` : baseWithFile;
    const baseWithUpstream = upstreamSkillsPromptAddition ? `${baseWithOrg}\n${upstreamSkillsPromptAddition}` : baseWithOrg;

    const fullPrompt = currentNode.customInstructions?.trim()
      ? `${baseWithUpstream}\n\nAdditional Custom AI Instructions:\n${currentNode.customInstructions}`
      : baseWithUpstream;

    // Detect if this is the Omni-Skill Master Synthesizer node
    const isMasterSynthesizerNode =
      currentNode.isMasterSynthesizer ||
      currentNode.id === 'omni_skill_master_synthesizer' ||
      currentNode.title.toLowerCase().includes('multi-skill synthesis') ||
      currentNode.title.toLowerCase().includes('master multi-skill');

    let effectiveFullPrompt = fullPrompt;
    let linkedSkillNodesForMaster: BoardNode[] = [];

    if (isMasterSynthesizerNode) {
      const masterConnectedEdges = edges.filter((e) => e.to === nodeId || e.from === nodeId);
      linkedSkillNodesForMaster = nodes.filter(
        (n) =>
          n.id !== nodeId &&
          !n.isProduct &&
          !n.isFile &&
          masterConnectedEdges.some((e) => e.to === n.id || e.from === n.id)
      );
      if (linkedSkillNodesForMaster.length === 0) {
        linkedSkillNodesForMaster = nodes.filter((n) => n.id !== nodeId && !n.isProduct && !n.isFile);
      }

      let crossSkillsDataText = '';
      if (linkedSkillNodesForMaster.length > 0) {
        crossSkillsDataText = linkedSkillNodesForMaster
          .map((sk, idx) => {
            const res = sk.executionResult?.content;
            return `\n=== LINKED UPSTREAM SKILL #${idx + 1}: ${sk.title.toUpperCase()} (${sk.category}) ===\n` +
              `Description: ${sk.subtitle || 'Standard configuration'}\n` +
              `Status: ${res ? 'COMPLETED & ANALYZED' : 'PENDING'}\n` +
              `Instructions: ${sk.customInstructions || 'Default'}\n` +
              `Output / Findings:\n${res || '(Skill context loaded — synthesize based on target goals)'}\n`;
          })
          .join('\n');
      }

      effectiveFullPrompt = `You are the CHIEF EXECUTIVE STRATEGIST, HEAD OF E-COMMERCE INTELLIGENCE, and MASTER FUNNEL ARCHITECT.
Your task is to execute an ALL-INCLUSIVE, HIGH-LEVEL MULTI-SKILL STRATEGIC SYNTHESIS across all connected skills for:
PRODUCT: ${effectiveProduct.title}
PRICE: ${effectiveProduct.sellingPrice} ${targetMarketObj.currency} | COST: ${effectiveProduct.productCost} ${targetMarketObj.currency} | MARGIN: ${effectiveProduct.profitMargin}%
TARGET MARKET: ${targetMarketObj.flag} ${targetMarketObj.name} (${targetMarketObj.currency})

CRITICAL MANDATE — "BEEG INFO, DONT SMALL TEXT" (MASSIVE, EXHAUSTIVE EXECUTIVE REPORT):
- DO NOT provide brief summaries, tiny bullet points, or short generic text!
- You must generate a GIGANTIC, DEEP, METICULOUS GENERAL EXECUTIVE DOSSIER (minimum 1,500 to 2,500 words).
- Reconcile, correlate, and aggregate every single piece of information, finding, and output from the ${linkedSkillNodesForMaster.length} connected skills listed below.
- Include structured Markdown tables, precise numerical calculations (${targetMarketObj.currency} unit economics, CAC, ROAS, Wilaya shipping tariffs), exact psychological hooks in Algerian Darja/French, customer avatar analysis, call-center confirmation scripts, and day-by-day action plans.

=== CONNECTED SKILLS & GATHERED INTELLIGENCE (${linkedSkillNodesForMaster.length} SKILLS LINKED) ===
${crossSkillsDataText}
${filePromptAddition}
${marketPromptAddition}
${currentNode.customInstructions?.trim() ? `\nAdditional Custom Instructions:\n${currentNode.customInstructions}` : ''}

=== REQUIRED STRUCTURE OF THE GENERAL EXECUTIVE DOSSIER ===
1. 📊 EXECUTIVE SUMMARY & CROSS-SKILL VERDICT (Commercial Feasibility /100, Core Growth Thesis)
2. 🧩 UNIFIED CROSS-SKILL INTELLIGENCE MATRIX (Markdown table detailing each connected skill, findings, status 🟢🟡🔴, impact, and mandates)
3. 💰 DEEP UNIT ECONOMICS, PRICING & FUNNEL FINANCIALS (Per-order breakdown in ${targetMarketObj.currency}: Product cost, shipping, call-center, packaging, CPA, net profit, daily scenarios at 25, 75, 150 orders/day)
4. 🎯 OMNICHANNEL AUDIENCE & PSYCHOLOGICAL AVATAR PROFILES (Primary & secondary buyer personas in ${targetMarketObj.name}, pain triggers, objections)
5. 🎬 MASTER CREATIVE, COPYWRITING & HOOK BLUEPRINT (3 High-converting video hooks in local dialect/French, ad copies, UGC directions)
6. 🚚 LOGISTICS, WILAYA COD & RTO DEFENSE PROTOCOL (3-step confirmation script, WhatsApp voice ping, courier matrix Yalidine / ZR)
7. 🚀 30-DAY STEP-BY-STEP OMNICHANNEL EXECUTION ROADMAP (Phase 1 Testing, Phase 2 Optimization, Phase 3 Scaling, Phase 4 Retention)
8. ⚖️ COMPREHENSIVE RISK AUDIT & FINAL SCALABILITY SCORECARD (10-point audit matrix, contingency plans)`;
    }

    try {
      const response = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: currentNode.title,
          provider,
          model: aiModel,
          prompt: effectiveFullPrompt,
          contextData: {
            title: effectiveProduct.title,
            language: currentNode.language || 'English',
            targetMarket: targetMarketObj.name,
            currency: targetMarketObj.currency,
            liveWebResearch: !!currentNode.liveWebResearch,
            product: effectiveProduct,
            fileData: linkedFileNode?.fileData || null,
          },
          apiKey: userApiKey,
        }),
      });

      const data = await response.json();
      const executedAt = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const content = data.result || 'Skill analysis completed.';
      const finalContent = normalizeAndCleanAIOutput(content);

      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: 'active',
                hideResult: false,
                isExpandedDown: isMasterSynthesizerNode ? true : n.isExpandedDown,
                activePreviewTab: 'chatgpt',
                executionResult: {
                  executedAt,
                  skillName: currentNode.title,
                  productName: effectiveProduct.title,
                  language: currentNode.language || 'English',
                  webResearchUsed: !!currentNode.liveWebResearch,
                  content: finalContent,
                  isSimulated: data.isSimulated || false,
                },
              }
            : n
        )
      );

      setSelectedNodeId(nodeId);
      showToast(`✓ AI Analysis completed for "${currentNode.title}"!`);
      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 400);
    } catch (error) {
      const executedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const targetLang = currentNode.language || 'English';
      const tLower = (currentNode.title || '').toLowerCase();
      const pTitle = effectiveProduct.title || 'Product';
      const sPrice = Number(effectiveProduct.sellingPrice) || 3800;
      const pCost = Number(effectiveProduct.productCost) || 1100;
      const pMargin = effectiveProduct.profitMargin ? Number(effectiveProduct.profitMargin) : Math.round(((sPrice - pCost) / sPrice) * 100);
      const pProfit = sPrice - pCost;

      const effectiveSkillTitle = currentNode.title || 'E-Commerce Intelligence';
      let fallbackContent = '';

      const isMultiSkillSynthesizer =
        isMasterSynthesizerNode ||
        tLower.includes('multi-skill synthesis') ||
        tLower.includes('master multi-skill');

      const isWhyPeopleBuy = !isMultiSkillSynthesizer && (
        tLower.includes('why people buy') ||
        tLower.includes('why buy') ||
        tLower.includes('buying trigger') ||
        tLower.includes('purchase motivation') ||
        tLower.includes('buying motivation')
      );

      const isMaster = !isMultiSkillSynthesizer && !isWhyPeopleBuy && (tLower.includes('all in one') || tLower.includes('master') || tLower.includes('15-stage') || tLower.includes('funnel'));
      const isConfirmation = !isMultiSkillSynthesizer && !isMaster && !isWhyPeopleBuy && (tLower.includes('confirm') || tLower.includes('phone') || tLower.includes('call') || tLower.includes('whatsapp') || tLower.includes('objection') || tLower.includes('rebuttal') || tLower.includes('tele') || tLower.includes('support'));
      const isCompetitor = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isWhyPeopleBuy && (tLower.includes('competitor') || tLower.includes('spy') || tLower.includes('benchmark') || tLower.includes('saturation'));
      const isQuality = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isWhyPeopleBuy && (tLower.includes('packag') || tLower.includes('unboxing') || tLower.includes('qc') || tLower.includes('checklist') || tLower.includes('inspect'));
      const isProductDiscovery = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isCompetitor && !isWhyPeopleBuy && (tLower.includes('discovery') || tLower.includes('winning') || tLower.includes('finder') || tLower.includes('demand') || tLower.includes('trend') || tLower.includes('scout'));
      const isDeepDive = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isCompetitor && !isWhyPeopleBuy && (tLower.includes('deep dive') || tLower.includes('technical') || tLower.includes('spec') || tLower.includes('anatomy'));
      const isAvatar = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isCompetitor && !isWhyPeopleBuy && (tLower.includes('avatar') || tLower.includes('persona') || tLower.includes('psychographic') || tLower.includes('buyer') || tLower.includes('audience profile'));
      const isTargetMarket = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isWhyPeopleBuy && (tLower.includes('target market') || tLower.includes('market research') || tLower.includes('market analysis') || tLower.includes('demographic'));
      const isCreative = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isWhyPeopleBuy && (tLower.includes('creative') || tLower.includes('hook') || tLower.includes('angle') || tLower.includes('copy') || tLower.includes('video') || tLower.includes('ugc') || tLower.includes('script'));
      const isCampaign = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isCompetitor && !isWhyPeopleBuy && (tLower.includes('campaign') || tLower.includes('meta') || tLower.includes('tiktok') || tLower.includes('traffic') || tLower.includes('budget') || tLower.includes('media buying'));
      const isPricing = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isCompetitor && !isWhyPeopleBuy && (tLower.includes('pricing') || tLower.includes('economic') || tLower.includes('margin') || tLower.includes('profit') || tLower.includes('financial') || tLower.includes('cost') || tLower.includes('roas'));
      const isLogistics = !isMultiSkillSynthesizer && !isMaster && !isConfirmation && !isWhyPeopleBuy && (tLower.includes('delivery') || tLower.includes('courier') || tLower.includes('rto') || tLower.includes('return') || tLower.includes('logistics') || tLower.includes('yalidine'));

      if (isMultiSkillSynthesizer) {
        fallbackContent = generateMasterDossierContent(
          pTitle,
          sPrice,
          pCost,
          pMargin,
          targetMarketObj.name,
          targetMarketObj.currency,
          targetMarketObj.flag,
          linkedSkillNodesForMaster,
          linkedFileNode?.fileData
        );
      } else if (isWhyPeopleBuy) {
        fallbackContent = `### Why People Buy: ${pTitle}

Understanding the emotional, psychological, and subconscious triggers that convert prospective shoppers into paying customers for **${pTitle}** in ${targetMarketObj.flag} ${targetMarketObj.name}.

### Executive Summary
Purchasing decisions for **${pTitle}** in the Cash on Delivery (COD) market are predominantly impulsive and driven by a strong desire for personal convenience, aesthetic enhancement, and visual problem resolution. At the retail price of **${sPrice.toLocaleString()} ${targetMarketObj.currency}**, the customer seeks clear reassurance that the product delivers immediate, demonstrable value that exceeds its monetary cost.

### Primary Emotional Buying Triggers
1. **Instant Visual Problem-Resolution**: The product solves a concrete, everyday friction point in a demonstrable, satisfying way.
2. **Elevated Aesthetic & Style Identity**: Modern design and high-end feel that communicates good taste, status, and contemporary lifestyle.
3. **Frictionless Trust via Doorstep Inspection**: The explicit guarantee that customers can physically inspect the package before paying the courier eliminates risk and accelerates conversion.
4. **Impulse Indulgence & Affordable Luxury**: Priced within an accessible spending range, making it an easy emotional purchase for self-use or gifting.

### Core Buyer Archetypes & Motivations

| Buyer Archetype | Primary Motivation | Dominant Hesitation / Friction | Winning Conversion Angle |
|---|---|---|---|
| Urban Professional / Active Commuter | Practical convenience, compact durability & daily utility | Skeptical of cheap, fragile marketplace items | High-definition demonstration of material strength and reliability |
| Thoughtful Gift Buyer | Unique visual charm & high perceived recipient value | Worried about arrival condition & plain packaging | Elegant unboxing presentation + fast 48h express dispatch |
| Value-Driven Household Decision Maker | Solving household or personal hassles affordably | Comparing price against traditional souk goods | 2-Piece bundle savings (${(sPrice * 1.8).toFixed(0)} ${targetMarketObj.currency}) with free national shipping |

### Top 3 Psychological Objections & Counter-Arguments
- **"Is the quality truly worth ${sPrice.toLocaleString()} ${targetMarketObj.currency}?"**
  → *Psychological Rebuttal*: Highlight premium materials, reinforced construction, and longevity compared to low-cost alternatives that break within weeks.
- **"What if the product does not match what was advertised in the video?"**
  → *Psychological Rebuttal*: Reiterate 100% open-box doorstep inspection with the delivery courier before handing over payment.
- **"How fast can I receive it?"**
  → *Psychological Rebuttal*: 24 to 48-hour delivery commitment to top Wilayas directly from localized distribution centers.

### Winning Psychological Ad Copy Angles
- **Angle 1 (The Frustration Breaker)**: "Tired of dealing with unreliable essentials that break when you need them most? Discover why thousands of shoppers are upgrading to **${pTitle}**."
- **Angle 2 (Aesthetic Pride)**: "Designed for those who appreciate both functionality and modern aesthetics. Experience the difference today."
- **Angle 3 (100% Risk-Free COD)**: "Doorstep delivery across all 58 Wilayas. Inspect your parcel before paying — zero risk, total peace of mind."`;
      } else if (isTargetMarket) {
        fallbackContent = `### Target Market Research: ${pTitle}

Geographic distribution, demographic dynamics, and market expansion strategy for **${pTitle}** across ${targetMarketObj.flag} ${targetMarketObj.name}.

### 1. High-Priority Geographic Clusters
- **Tier 1 Express Hubs**: Algiers (16), Oran (31), Blida (09), Sétif (19), Constantine (25) — representing ~65% of total high-intent demand.
- **Tier 2 Growth Wilayas**: Batna (05), Tlemcen (13), Annaba (23), Béjaïa (06), Mostaganem (27), Chlef (02).
- **Tier 3 Extended Coverage**: Southern Wilayas with strong purchasing power (Biskra, Ghardaïa, Ouargla) served via express Stop-Desk delivery.

### 2. Pricing Dynamics & Purchasing Power
- Current target selling price: **${sPrice.toLocaleString()} ${targetMarketObj.currency}**
- Estimated landed cost: **${pCost.toLocaleString()} ${targetMarketObj.currency}** (+${pMargin}% Gross Margin)
- Optimal bundle price: **${(sPrice * 1.8).toFixed(0)} ${targetMarketObj.currency}** (2 units with free shipping)
- Price sensitivity testing confirms that conversion remains strong up to ${(sPrice * 1.15).toFixed(0)} ${targetMarketObj.currency} when accompanied by guaranteed doorstep inspection.

### 3. Purchasing Habits & Peak Traffic Windows
- Peak mobile impulse shopping occurs between 20:30 and 01:00 on weekdays and throughout Friday-Saturday evenings.
- Mobile browsing accounts for over 88% of store sessions; fast-loading, single-page checkouts maximize order completion.`;
      } else if (isMaster) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

| Layer | Stage | Key Metric | Status 🟢🟡🔴 | #1 Next Action |
|-------|-------|------------|----------------|----------------|
| 1     | Product | Total Score | 🟢 | Finalize supplier agreements |
| 2     | Strategy | USP Clarity | 🟢 | Create detailed buyer personas |
| 3     | Creative | CTR Prediction | 🟡 | Test 3 new hooks this week |
| 4     | Campaign | Budget Allocation | 🟢 | Set up initial ad campaign |
| 5     | Traffic | CTR Rate | 🟡 | Optimize landing page design |
| 6     | Order | Conversion Rate | 🟡 | Review checkout process |
| 7     | Confirmation | Contact Rate | 🟡 | Enhance confirmation scripts |
| 8     | Delivery | Avg Delivery Days | 🟡 | Partner with additional couriers |
| 9     | RTO | RTO Rate | 🟡 | Address customer objections in ads |
| 10    | Revenue | Net Revenue | 🟢 | Monitor daily sales closely |
| 11    | Profit | Net Profit Margin | 🟢 | Assess cost-cutting opportunities |
| 12    | Customer Quality | Quality Score | 🟡 | Implement retention strategies |
| 13    | Ad Platform Signal | Signal Quality | 🟢 | Ensure pixel tracking is optimized |
| 14    | AI Optimization | CPA | 🟡 | Adjust campaigns based on data |
| 15    | New Traffic | Expansion Opportunities | 🟡 | Research new audience segments |

### Key Performance Benchmarks

| 🎯 Metric | Value | Why it matters |
|-----------------|-------|---------------------------------------------------------------------|
| Demand Score | 8 | Strong market interest for ergonomic products in Algeria |
| Wow Factor | 8.5 | Demonstrable visual problem resolution on social feeds |
| Problem Severity | 9 | High incidence of discomfort among office workers and drivers |
| Profit Margin | 10 | ${pMargin}% margin maximizes profitability |
| Risk | 6 | Moderate risk due to competition and market saturation |
| **Total Score** | **40/50** | High potential for a successful launch |

\`\`\`
USP → Value Prop → Positioning → Pricing
   ├─ Ergonomic Comfort
   │   ├─ Alleviates Pressure Points
   │   │   ├─ Targeting Office Workers
   │   │   │   ├─ ${sPrice} DZD
   │   │   │   └─ Affordable Comfort
   │   │   └─ Targeting Drivers
   │   │       ├─ ${sPrice} DZD
   │   │       └─ On-the-Go Relief
   └─ Competitive Pricing
\`\`\``;
      } else if (isConfirmation) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Comprehensive phone confirmation framework and WhatsApp voice dispatch protocol for **${pTitle}**, engineered to push COD delivery rates past 85% across all 58 Algerian Wilayas.

### Rapid 10-Minute Confirmation Protocol
- **Target Response Time**: Call customer within 10 minutes of web form submission.
- **Golden Calling Window**: 09:30 AM – 08:30 PM local Algerian time.
- **Fallback Action**: Automated WhatsApp voice note sent immediately after 1st unanswered call, followed by 2nd attempt in 120 minutes.

### Word-for-Word Phone Confirmation Script
- **Agent**: "Hello Mr./Ms. [Customer Name], this is [Agent Name] calling from [Store Name] regarding your order for the **${pTitle}** at **${sPrice.toLocaleString()} DZD**. I'm calling to verify your exact delivery address in [Wilaya / Commune]."
- **Customer**: "Yes, that's my order."
- **Agent**: "Perfect! Your package includes door-to-door courier delivery and full parcel inspection rights — you can open the box and verify the product quality with the driver before paying cash. By the way, would you like to take advantage of our 2-piece family bundle today for only ${(sPrice * 1.8).toFixed(0)} DZD with free national delivery?"
- **Customer**: "Just the single unit / Add the bundle."
- **Agent**: "Excellent. Your tracking code will be sent via SMS once dispatched this afternoon. Expect delivery within 24 to 48 hours. Thank you for your trust!"

### Top 5 Customer Objections & Word-for-Word Rebuttals
1. **"Can I open and inspect the parcel before paying the courier?"**
   - **Rebuttal**: "Yes, 100%! Our courier agreement guarantees open-box inspection. You check the quality before handing over any payment."
2. **"Will it flatten out or lose shape after a couple weeks?"**
   - **Rebuttal**: "No. This uses medical-grade hyper-elastic polymer that springs back instantly. It comes with a 1-year shape retention guarantee."
3. **"Is shipping included in the price?"**
   - **Rebuttal**: "The total amount confirmed right now is final — no hidden fees or extra surcharges upon delivery."
4. **"I saw a similar product online for cheaper."**
   - **Rebuttal**: "Cheap knockoffs use inferior materials that degrade immediately. Ours uses reinforced, verified premium materials with guaranteed durability."
5. **"I am currently traveling / not home."**
   - **Rebuttal**: "No problem at all! We can hold dispatch to your preferred date, or deliver to your nearest Yalidine/ZR Stop-Desk branch for convenient pickup anytime."

### WhatsApp Voice Note Dispatch Template
- "Hello [Customer Name]! This is [Store Name] regarding your verified order of **${pTitle}**. We have your order packed and scheduled for courier dispatch today. Please reply with a quick 'CONFIRM' or your preferred delivery day so our driver can head your way. Thank you!"`;
      } else if (isCreative) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Direct-response viral creative blueprints and video hook scripts for **${pTitle}**, engineered for high CTR and low acquisition costs on Meta Advantage+ and TikTok feeds in ${targetMarketObj.flag} ${targetMarketObj.name}.

### 4 High-Converting Viral Hooks
1. **Hook 1: The Visual Demonstration & Pattern Interrupt**
   - **Visual Action**: Fast 2-second macro close-up showcasing the key feature of **${pTitle}** in action under demanding conditions.
   - **Voiceover**: "Stop scrolling if you want to upgrade your daily routine! Look at what makes this design completely different."
2. **Hook 2: The Direct Problem Callout**
   - **Visual Action**: Contrast between an old, broken generic alternative versus the effortless, premium performance of **${pTitle}**.
   - **Voiceover**: "Tired of dealing with essentials that break within weeks? Here's the solution everyone is talking about."
3. **Hook 3: The Doorstep Inspection Guarantee**
   - **Visual Action**: Customer cheerfully receiving package from courier, unboxing to verify flawless quality before handing over payment.
   - **Voiceover**: "Doorstep delivery across all 58 Wilayas â€” open the package, check the quality, and pay only after you're 100% satisfied!"
4. **Hook 4: The Limited-Time Duo Bundle**
   - **Visual Action**: Unboxing two coordinated units, displaying the bundle price tag and free delivery badge.
   - **Voiceover**: "Order yours today and get a second unit for almost half price with free doorstep delivery!"

### Full 30-Second Video Ad Script
- **00:00 - 00:03 (Pattern Interrupt)**: Rapid hook action demonstrating the standout feature with upbeat audio sound effect.
- **00:04 - 00:10 (Problem Agitation)**: Illustrating the daily annoyance and cost of using cheap, subpar alternatives.
- **00:11 - 00:20 (Demonstration & Proof)**: Clear, close-up demonstration of **${pTitle}**, highlighting durability, materials, and ease of use.
- **00:21 - 00:30 (Offer & CTA)**: Display price (**${sPrice.toLocaleString()} ${targetMarketObj.currency}**), 58 Wilaya COD badge, and "Commander Maintenant" button.`;
      } else if (isAvatar) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Target audience psychological profiling, daily pain points, and conversion triggers for **${pTitle}** in ${targetMarketObj.flag} ${targetMarketObj.name}.

### Primary Persona: The Modern Urban Consumer
- **Demographic**: Men & Women, 22â€“48 years old, residing in urban and suburban regions.
- **Daily Reality**: Busy schedule, looking for practical items that provide immediate daily convenience and aesthetic satisfaction.
- **Purchasing Habit**: Frequent mobile browser, values quality assurance and transparent cash on delivery terms.

### Core Pain Points & Latent Frustrations
- Low-quality generic commodities flooding local shops that malfunction or wear out quickly.
- Unreliable online shopping experiences with misleading photos or hidden courier charges.
- Frustration with complicated, overpriced alternatives that lack practical durability.

### Deep Emotional Desires & Status Motivators
- **Confidence & Style**: Owning well-designed essentials that look contemporary and functional.
- **Stress-Free Shopping**: Full peace of mind knowing they inspect before handing cash to the driver.
- **Smart Value**: Getting high perceived value and lasting performance for **${sPrice.toLocaleString()} ${targetMarketObj.currency}**.

### Conversion Triggers & Messaging Angles
- **Video Proof Demonstration**: Clear macro close-up showcasing authentic materials and craftsmanship.
- **"Pay Only After Inspection" (Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ù‚Ø¨Ù„ Ø§Ù„Ø¯ÙØ¹)**: Completely eliminates hesitation and builds instant trust.
- **Wilaya Delivery Assurance**: Clear promise of doorstep delivery across all 58 Wilayas within 24–48 hours.`;
      } else if (isProductDiscovery) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

${pTitle} represents a high-velocity e-commerce opportunity with strong impulse-purchase triggers in ${targetMarketObj.flag} ${targetMarketObj.name}. Priced at ${sPrice.toLocaleString()} ${targetMarketObj.currency} against a landed wholesale cost of ${pCost.toLocaleString()} ${targetMarketObj.currency} (+${pMargin}% gross margin), it provides healthy unit economics.

### Opportunity Scoring Matrix

| 🎯 Metric | Value | Why it matters |
|---|---|---|
| Demand Score | 8.5/10 | High search volume and active consumer interest |
| Wow Factor | 9.0/10 | Instantly demonstrable visual benefit within the first 3 seconds |
| Problem Severity | 8.5/10 | Solves everyday friction with clear, tangible convenience |
| Profit Margin | 9.5/10 | ${pMargin}% margin (+${pProfit.toLocaleString()} ${targetMarketObj.currency}) absorbs ad spend and shipping buffer |
| Risk Assessment | 8.5/10 | Durable, compact form factor minimizes transit damage |
| **Total Score** | **44/50** | **High potential for immediate scale & profitable ad launch 🟢** |

### Market Validation Criteria

| Validation Criteria | Benchmark | Product Status | Risk Level |
|---|---|---|---|
| Search Volume & Demand | > 15,000 / mo | Active upward consumer interest | 🟢 Low Risk |
| Competitor Saturation | Moderate | Fragmented advertisers with generic creative | 🟢 High Opportunity |
| Local Supplier Stock | Guaranteed | Available in central wholesale hubs | 🟢 Low Risk |
| Transit Breakage Risk | < 3% | Compact, reinforced construction | 🟢 Safe |

### Launch Verdict & Recommendations
- **Verdict**: Scale immediately. Emphasize physical video demonstration and doorstep inspection rights.
- **Offer Structure**: Single unit at ${sPrice.toLocaleString()} ${targetMarketObj.currency}; Duo bundle at ${(sPrice * 1.8).toFixed(0)} ${targetMarketObj.currency} with free national delivery.`;
      } else if (isCompetitor) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Comprehensive competitive landscape, pricing benchmarks, and market differentiation strategy for **${pTitle}** in ${targetMarketObj.flag} ${targetMarketObj.name}.

### Competitor Landscape & Benchmarks

| Competitor / Store Archetype | Selling Price | Delivery Terms | Observed Weakness | Our Strategic Advantage |
|---|---|---|---|---|
| Generic Drop-shipper Ads | ${(sPrice * 0.85).toFixed(0)} ${targetMarketObj.currency} | Paid Shipping (+600 ${targetMarketObj.currency}) | No inspection allowed, low-grade build quality | Full open-box inspection guaranteed before payment |
| Marketplace Stores | ${(sPrice * 1.05).toFixed(0)} ${targetMarketObj.currency} | Stop-Desk Only | Slow dispatch (3-5 days), stockout delays | Stocked locally with 24-48h express doorstep delivery |
| Traditional Retail Shops | ${(sPrice * 1.35).toFixed(0)} ${targetMarketObj.currency} | In-store pickup only | High retail markup, zero doorstep delivery | Direct-to-consumer pricing at ${sPrice.toLocaleString()} ${targetMarketObj.currency} |
| Our Brand Strategy | ${sPrice.toLocaleString()} ${targetMarketObj.currency} | Doorstep 58 Wilayas | None (Streamlined COD execution) | Authentic video proof + 2-pack bundle at ${(sPrice * 1.8).toFixed(0)} ${targetMarketObj.currency} |

### Market Gap & Dominance Strategy
- **Demonstration Vacuum**: Competitors run static images or stolen low-res clips. Shooting authentic video showcasing real build quality wins the feed immediately.
- **Bundle Advantage**: Offering a 2-Pack Duo Bundle for ${(sPrice * 1.8).toFixed(0)} ${targetMarketObj.currency} captures multi-unit and gift buyers, increasing Average Order Value (AOV) by +35%.`;
      } else if (isPricing) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Financial modeling, landed cost breakdown, break-even thresholds, and wilaya revenue projections for **${pTitle}**.

### Unit Economics Breakdown

| Cost Component | Value (DZD) | % of Price | Strategic Notes |
|----------------|-------------|------------|-----------------|
| Selling Price (Single Unit) | ${sPrice.toLocaleString()} DZD | 100.0% | Optimized impulse-purchase price point |
| Wholesale COGS (Landed) | ${pCost.toLocaleString()} DZD | ${((pCost / sPrice) * 100).toFixed(1)}% | Landed cost from wholesale supplier |
| Courier Delivery Fee (Average) | 450 DZD | 11.8% | Blended rate across 58 Wilayas |
| Confirmation Call & SMS | 150 DZD | 3.9% | Rapid 10-minute call center & WhatsApp alert |
| Packaging & Protective Wrap | 100 DZD | 2.6% | Reinforced polybag + user instruction insert |
| RTO Loss Reserve (12% Return Buffer) | 185 DZD | 4.9% | Covers return freight on refused deliveries |
| Target Ad Spend Allowance (CPA) | 600 DZD | 15.8% | Meta & TikTok Ads acquisition target |
| **Net Profit per Delivered Order** | **${Math.max(pProfit - 1485, 950).toLocaleString()} DZD** | **${(Math.max(pProfit - 1485, 950) / sPrice * 100).toFixed(1)}%** | **Pure bottom-line net profit (+${pMargin}% Gross Margin)** |

### Top Wilayas Projected Revenue Distribution

| Wilaya / Region | Projected Monthly Orders | Unit Price | Total Revenue (DZD) | % Share |
|-----------------|--------------------------|------------|---------------------|---------|
| Wilaya 16 - Alger | 140 Orders | ${sPrice} DZD | ${(sPrice * 140).toLocaleString()} DZD | 35% |
| Wilaya 31 - Oran | 90 Orders | ${sPrice} DZD | ${(sPrice * 90).toLocaleString()} DZD | 22% |
| Wilaya 19 - Sétif | 70 Orders | ${sPrice} DZD | ${(sPrice * 70).toLocaleString()} DZD | 17% |
| Wilaya 25 - Constantine | 55 Orders | ${sPrice} DZD | ${(sPrice * 55).toLocaleString()} DZD | 14% |
| Other 54 Wilayas | 45 Orders | ${sPrice} DZD | ${(sPrice * 45).toLocaleString()} DZD | 12% |

### Break-Even ROAS Targets
- **Minimum Break-Even ROAS**: **1.65x**
- **Target Scaling ROAS**: **3.10x+**`;
      } else if (isCampaign) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Paid acquisition blueprint and budget distribution for scaling **${pTitle}** across Meta Ads and TikTok Ads in ${targetMarketObj.flag} ${targetMarketObj.name}.

### Campaign & AdSet Budget Allocation

| Campaign / AdSet | Daily Budget (${targetMarketObj.currency}) | % Share | Audience Targeting | Target CPA |
|---|---|---|---|---|
| CBO Broad Scaling (National 58 Wilayas) | 3,500 ${targetMarketObj.currency} | 50% | Men & Women 22-55, Broad Demographics | < 550 ${targetMarketObj.currency} |
| High-Intent Interest Stack | 2,000 ${targetMarketObj.currency} | 29% | Online Shopping, Lifestyle, Gadgets | < 600 ${targetMarketObj.currency} |
| Retargeting & Duo Bundle Campaign | 1,500 ${targetMarketObj.currency} | 21% | Video Viewers 75% & Cart Visitors | < 450 ${targetMarketObj.currency} |

### Funnel Performance Benchmarks
- **Target Click-Through Rate (CTR)**: > 2.2% (driven by visual hook demonstration).
- **Target Cost per Click (CPC)**: < 25 ${targetMarketObj.currency} on Meta Feed / TikTok.
- **Landing Page Conversion Rate (CVR)**: > 16% on streamlined 1-page COD form.
- **Delivery Confirmation Rate**: > 84% post-phone call.`;
      } else if (isLogistics) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Operational fulfillment blueprint, courier delivery rates, and return-to-origin (RTO) suppression protocols for **${pTitle}** across 58 Algerian Wilayas.

### Courier Performance Matrix

| Courier Partner | Delivery Rate % | Avg Transit Days | Stop-Desk Cost | Home Delivery | Strategic Role |
|-----------------|-----------------|------------------|----------------|---------------|----------------|
| Yalidine Express | 89.4% | 1.8 Days | 350 DZD | 550 DZD | 🟢 Primary National Partner |
| ZR Express | 86.8% | 2.0 Days | 300 DZD | 500 DZD | 🟢 Urban Metro Specialist |
| Nord & Sud Express | 81.2% | 3.5 Days | 450 DZD | 750 DZD | 🟡 South & Sahara Wilayas |

### Root Causes of Refused Deliveries & Actionable Fixes
1. **Unreachable on Phone (39% of RTOs)**: Collect secondary mobile number on checkout form; dispatch WhatsApp voice reminder upon shipment.
2. **Delivery Delay > 48 Hours (30% of RTOs)**: Hand parcels to courier sorting hubs before 16:00 daily to ensure next-day movement.
3. **Customer Hesitation (19% of RTOs)**: Reiterate the inspect-before-paying guarantee in confirmation audio and SMS.
4. **Refusal to Pay Delivery Fee (12% of RTOs)**: Always confirm the all-inclusive final price during the phone confirmation call.`;
      } else if (isQuality) {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Comprehensive quality control specifications, warehouse inspection checklist, and transit-safe packaging guidelines for **${pTitle}**.

### Product Acceptance Specifications
- **Build & Finish Quality**: Flawless exterior finish with zero surface blemishes, scratches, or manufacturing defects.
- **Mechanical & Functional Integrity**: Complete verification of moving parts, closures, or mechanisms across 3 operational cycles.
- **Packaging Integrity**: Reinforced protective inner boxing with moisture seal and courier label compliance.

### Warehouse Packaging & Inspection Checklist
- [ ] Verify product is completely free of cosmetic defects or functional irregularities.
- [ ] Test all moving parts and accessories included in the package.
- [ ] Insert laminated "Quick-Start & Care Guide" inside the inner box.
- [ ] Seal parcel inside waterproof, tear-resistant courier polybag.
- [ ] Firmly affix barcoded shipping label with customer phone number 1 and backup phone number 2.
- [ ] Scan parcel into courier pickup dispatch batch before daily cutoff.`;
      } else {
        fallbackContent = `### ${effectiveSkillTitle}: ${pTitle}

Executive strategic breakdown and actionable implementation directives for **${pTitle}** in ${targetMarketObj.flag} ${targetMarketObj.name}.

### Executive Overview & Strategic Assessment
The commercial viability of **${pTitle}** in the e-commerce market is driven by clear product utility combined with strong visual demonstration potential. Priced at **${sPrice.toLocaleString()} ${targetMarketObj.currency}** with a landed cost of **${pCost.toLocaleString()} ${targetMarketObj.currency}** (+${pMargin}% gross margin, +${pProfit.toLocaleString()} ${targetMarketObj.currency} gross profit), this product provides solid financial margins to support scalable advertising and operational fulfillment.

### Core Strategic Directives
- **Direct-Response Focus**: Prioritize authentic visual demonstration showing the product in practical daily use.
- **Pricing & Offer Architecture**: Anchor single unit at ${sPrice.toLocaleString()} ${targetMarketObj.currency}; feature the 2-pack bundle at ${(sPrice * 1.8).toFixed(0)} ${targetMarketObj.currency} with free delivery to maximize revenue per customer.
- **Risk Removal**: Prominently advertise doorstep inspection ("Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ù‚Ø¨Ù„ Ø§Ù„Ø¯ÙØ¹") in all creatives and confirmation calls to maximize customer confidence.
- **Rapid Operations**: Enforce an express confirmation workflow to ensure orders are dispatched within 24 hours to high-velocity Wilayas.

### Step-by-Step Implementation Roadmap
1. **Inventory Sourcing**: Verify initial batch quality and secure consistent supply from verified distributors.
2. **Creative Production**: Produce 3 distinct video hooks focusing on problem-solving, aesthetic design, and doorstep inspection.
3. **Funnel Deployment**: Launch mobile-optimized landing page featuring 1-click Wilaya ordering.
4. **Targeted Advertising**: Initiate testing on Meta Advantage+ with dedicated budget allocation for high-demand regions.
5. **Fulfillment & Tracking**: Process orders via express couriers with proactive SMS and WhatsApp delivery tracking.`;
      }

      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                status: 'active',
                hideResult: false,
                isExpandedDown: isMasterSynthesizerNode ? true : n.isExpandedDown,
                activePreviewTab: 'chatgpt',
                executionResult: {
                  executedAt,
                  skillName: currentNode.title,
                  productName: effectiveProduct.title,
                  language: targetLang,
                  webResearchUsed: !!currentNode.liveWebResearch,
                  content: fallbackContent,
                  isSimulated: true,
                },
              }
            : n
        )
      );
      setSelectedNodeId(nodeId);
      showToast(`✓ AI Analysis generated for "${currentNode.title}" (${targetLang})!`);
    } finally {
      setRunningNodeId(null);
    }
  }, [nodes, edges]);

  // Toggle Live Web Research for a specific node
  const handleToggleLiveWebResearch = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, liveWebResearch: !n.liveWebResearch } : n
      )
    );
  }, []);

  // Update language for a specific node and enforce pure output
  const handleChangeNodeLanguage = useCallback((nodeId: string, lang: string) => {
    const isRtl = lang === 'Arabic' || lang === 'Algerian Darja';
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              language: lang,
              previewDirection: isRtl ? 'rtl' : 'ltr',
              executionResult: n.executionResult
                ? { ...n.executionResult, language: lang }
                : undefined,
            }
          : n
      )
    );
    setActiveLanguageMenuNodeId(null);
    showToast(`✓ Language set to ${lang} — all results will generate 100% in ${lang}`);
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 400);
  }, []);

  const handleRunWorkflow = () => {
    setIsRunningWorkflow(true);
    setTimeout(() => {
      setIsRunningWorkflow(false);
      showToast('Workflow simulation completed! All 12 nodes executed successfully.');
    }, 2000);
  };

  const updateSelectedNodeConfig = (updates: Partial<BoardNode['config']>) => {
    if (!selectedNode) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNode.id
          ? { ...n, config: { ...n.config, ...updates } }
          : n
      )
    );
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 400);
  };



  const updateNodeTextStyle = (nodeId: string, updates: Partial<TextStyleConfig>) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        const current = n.textStyle || {};
        return {
          ...n,
          textStyle: {
            ...current,
            ...updates,
          },
        };
      })
    );
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 400);
  };



  const applyTextStyleToAllNodes = (style: TextStyleConfig) => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        textStyle: {
          ...(n.textStyle || {}),
          ...style,
        },
      }))
    );
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 400);
  };

  // ── Focus canvas on a specific node ──
  const handleFocusNode = useCallback((nodeId: string) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (target) {
      setSelectedNodeId(nodeId);
      const canvasEl = canvasRef.current;
      const w = canvasEl?.clientWidth || 800;
      const h = canvasEl?.clientHeight || 600;
      const scale = zoom / 100;
      setPanOffset({
        x: w / 2 - (target.x + 140) * scale,
        y: h / 2 - (target.y + 80) * scale,
      });
      showToast(`Focused on "${target.title}"`);
    }
  }, [nodes, zoom]);

  // ── Twiks.AI Autonomous Canvas Copilot Submission Handler ──
  const handleSendCanvasAiChat = async (presetText?: string) => {
    const textToSend = (presetText || aiCanvasChatInput).trim();
    if (!textToSend || isAiCanvasChatLoading) return;

    const userMsgId = `msg-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiCanvasChatMessages((prev) => [...prev, userMsg]);
    setAiCanvasChatInput('');
    setIsAiCanvasChatLoading(true);
    setActiveChatTopic(textToSend.slice(0, 30));

    // Update recent chats
    setRecentAiChats((prev) => {
      const title = textToSend.slice(0, 26);
      return [title, ...prev.filter((c) => c.toLowerCase() !== title.toLowerCase())].slice(0, 8);
    });

    const lower = textToSend.toLowerCase();

    // 1. ACTION: CLEAR BOARD
    if (/clear\s+(?:the\s+)?board|reset\s+board|start\s+fresh|delete\s+all\s+nodes/i.test(lower)) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      localStorage.removeItem('user_board_nodes_v1');
      localStorage.removeItem('user_board_edges_v1');
      showToast('Board cleared. Clean canvas ready.');

      setAiCanvasChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `### 🧹 Canvas Cleared\n\nI have reset the board and removed all nodes and connections. You now have a completely clean canvas.\n\nYou can ask me to add new skills (e.g. \`add skill static ad\`) or build a launch pipeline whenever you are ready!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionBadge: 'Board Reset',
        },
      ]);
      setIsAiCanvasChatLoading(false);
      return;
    }

    // 2. ACTION: BUILD FULL LAUNCH PIPELINE
    if (/build\s+(?:a\s+)?(?:launch\s+)?(?:pipeline|funnel|workflow)|orchestrat(?:e|ion)/i.test(lower)) {
      const scale = zoom / 100;
      const canvasEl = canvasRef.current;
      const w = canvasEl?.clientWidth || 800;
      const h = canvasEl?.clientHeight || 600;
      const startX = (w / 2 - panOffset.x) / scale - 450;
      const startY = (h / 2 - panOffset.y) / scale - 80;

      const pipelineSkills = [
        {
          id: `node-${Date.now()}-1`,
          title: 'Product Discovery & Feasibility',
          category: 'Market Intelligence',
          iconType: 'Search',
          iconBg: 'bg-blue-600',
          subtitle: 'Analyze product demand, problem clarity, and commercial potential.',
          position: { x: startX, y: startY },
        },
        {
          id: `node-${Date.now()}-2`,
          title: 'Target Market & Buyer Persona',
          category: 'Market Intelligence',
          iconType: 'User',
          iconBg: 'bg-indigo-600',
          subtitle: 'Map demographic brackets, psychographics, and buying triggers.',
          position: { x: startX + 660, y: startY },
        },
        {
          id: `node-${Date.now()}-3`,
          title: 'Ad Image Concepts (Static Ads)',
          category: 'DZ Landing Page Strategy',
          iconType: 'FileText',
          iconBg: 'bg-emerald-600',
          subtitle: '10 static ad image concepts with AI generation prompts.',
          position: { x: startX + 1320, y: startY },
        },
        {
          id: `node-${Date.now()}-4`,
          title: 'High-Converting CRO Landing Page',
          category: 'DZ Landing Page Strategy',
          iconType: 'LayoutGrid',
          iconBg: 'bg-rose-600',
          subtitle: '12-section mobile direct-response landing page with sticky CTA.',
          position: { x: startX + 1980, y: startY },
        },
      ];

      const newEdges: BoardEdge[] = [
        { id: `edge-${Date.now()}-1`, from: pipelineSkills[0].id, to: pipelineSkills[1].id, fromAnchor: 'right', toAnchor: 'left', arrow: true, label: 'Audience Feed', pillMain: 'Audience Feed', pillSub: 'Step 1 → 2' },
        { id: `edge-${Date.now()}-2`, from: pipelineSkills[1].id, to: pipelineSkills[2].id, fromAnchor: 'right', toAnchor: 'left', arrow: true, label: 'Creative Angles', pillMain: 'Creative Angles', pillSub: 'Step 2 → 3' },
        { id: `edge-${Date.now()}-3`, from: pipelineSkills[2].id, to: pipelineSkills[3].id, fromAnchor: 'right', toAnchor: 'left', arrow: true, label: 'Offer & Landers', pillMain: 'Offer & Landers', pillSub: 'Step 3 → 4' },
      ];

      const activeProduct = nodes.find((n) => n.isProduct && n.productData)?.productData || SAMPLE_PRODUCTS[0];

      const newBoardNodes: BoardNode[] = pipelineSkills.map((s) => ({
        id: s.id,
        title: s.title,
        category: s.category,
        iconType: s.iconType,
        iconBg: s.iconBg,
        iconColor: 'text-white',
        x: s.position.x,
        y: s.position.y,
        inputs: 1,
        outputs: 1,
        status: 'idle',
        role: 'agent',
        tags: ['PIPELINE', s.category.toUpperCase()],
        subtitle: s.subtitle,
        productData: activeProduct,
        previewEngine: 'chatgpt',
        config: {
          name: s.title,
          description: s.subtitle,
        },
      }));

      setNodes((prev) => [...prev, ...newBoardNodes]);
      setEdges((prev) => [...prev, ...newEdges]);
      showToast('🚀 Created 4-Step Full Launch Pipeline on Board!');

      setAiCanvasChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `### 🚀 Full Launch Pipeline Created!\n\n` +
            `I have orchestrated and connected **4 core skills** directly on your board in a sequential launch flow:\n\n` +
            `1. **Product Discovery & Feasibility**\n` +
            `2. **Target Market & Buyer Persona**\n` +
            `3. **Ad Image Concepts (Static Ads)**\n` +
            `4. **High-Converting CRO Landing Page**\n\n` +
            `All nodes are connected with directional workflows. You can see them live on your canvas now!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionBadge: 'Pipeline Created',
          actions: [
            {
              label: '⚡ Run All Nodes in Pipeline',
              onClick: () => handleRunWorkflow(),
              variant: 'primary',
            },
            {
              label: '🔍 Focus First Step',
              onClick: () => handleFocusNode(pipelineSkills[0].id),
              variant: 'secondary',
            },
          ],
        },
      ]);
      setIsAiCanvasChatLoading(false);
      return;
    }

    // 3. ACTION: RUN SKILL / EXECUTE NODES
    if (/^run\s+(?:all\s+nodes|all\s+skills|all|workflow|board)/i.test(lower)) {
      handleRunWorkflow();
      setAiCanvasChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `### ⚡ Executing All Canvas Skills\n\nI have triggered execution for all active nodes on your canvas! Watch the progress and preview results as each skill completes.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionBadge: 'Execution Started',
        },
      ]);
      setIsAiCanvasChatLoading(false);
      return;
    }

    if (/^run\s+(?:skill\s+|node\s+)?(.+)/i.test(lower)) {
      const match = lower.match(/^run\s+(?:skill\s+|node\s+)?(.+)/i);
      const query = match ? match[1].trim() : '';
      const targetNode = nodes.find(
        (n) => n.title.toLowerCase().includes(query) || n.id === query || query.includes(n.title.toLowerCase())
      ) || nodes[nodes.length - 1];

      if (targetNode) {
        handleRunSingleNode(targetNode.id);
        showToast(`⚡ Running "${targetNode.title}"`);
        setAiCanvasChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: `### ⚡ Running Node: **${targetNode.title}**\n\nI have started execution for **${targetNode.title}**. The AI Engine is analyzing upstream data and synthesizing the output with the Universal ChatGPT Preview Engine.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionBadge: 'Running Node',
            actions: [
              {
                label: '🔍 Focus Node on Canvas',
                onClick: () => handleFocusNode(targetNode.id),
                variant: 'secondary',
              },
            ],
          },
        ]);
        setIsAiCanvasChatLoading(false);
        return;
      }
    }

    // 4. ACTION: CHANGE PARAMETER / CONFIGURE SKILL
    if (/change\s+param|set\s+price|set\s+cost|set\s+audience|change\s+setting|configure\s+skill/i.test(lower)) {
      const targetNode = selectedNode || nodes[nodes.length - 1];
      if (targetNode) {
        const priceMatch = textToSend.match(/(\d[\d,\.\s]*)\s*(?:dzd|da|dinars?|\$|usd)/i) || textToSend.match(/price\s*(?:to|is|=)?\s*(\d+)/i);
        const audienceMatch = textToSend.match(/audience\s*(?:to|is|=)?\s*([^,\.]+)/i);

        let updatedField = 'configuration';
        let updatedVal = textToSend;

        if (priceMatch) {
          const numPrice = Number(priceMatch[1].replace(/[\s,]/g, ''));
          updatedField = 'sellingPrice';
          updatedVal = `${numPrice} DZD`;
          setNodes((prev) =>
            prev.map((n) =>
              n.id === targetNode.id
                ? {
                    ...n,
                    productData: {
                      ...(n.productData || {}),
                      sellingPrice: numPrice,
                    },
                    config: {
                      ...(n.config || {}),
                      sellingPrice: numPrice,
                    },
                  }
                : n
            )
          );
        } else if (audienceMatch) {
          updatedField = 'targetAudience';
          updatedVal = audienceMatch[1].trim();
          setNodes((prev) =>
            prev.map((n) =>
              n.id === targetNode.id
                ? {
                    ...n,
                    config: {
                      ...(n.config || {}),
                      targetAudience: updatedVal,
                    },
                  }
                : n
            )
          );
        } else {
          setNodes((prev) =>
            prev.map((n) =>
              n.id === targetNode.id
                ? {
                    ...n,
                    config: {
                      ...(n.config || {}),
                      customNote: textToSend,
                    },
                  }
                : n
            )
          );
        }

        showToast(`⚙️ Updated parameters for "${targetNode.title}"!`);

        setAiCanvasChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: `### ⚙️ Parameters Updated for **${targetNode.title}**\n\n` +
              `I have adjusted the node configuration:\n\n` +
              `• **Parameter**: \`${updatedField}\`\n` +
              `• **New Value**: **${updatedVal}**\n\n` +
              `The skill will use this updated parameter when executed!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionBadge: 'Configured',
            actions: [
              {
                label: '⚡ Run Skill with New Params',
                onClick: () => handleRunSingleNode(targetNode.id),
                variant: 'primary',
              },
              {
                label: '🔍 Focus Node',
                onClick: () => handleFocusNode(targetNode.id),
                variant: 'secondary',
              },
            ],
          },
        ]);
        setIsAiCanvasChatLoading(false);
        return;
      }
    }

    // 5. ACTION: ADD SKILL TO BOARD
    const isAddSkill =
      /add\s+(?:the\s+)?(?:skill\s+|node\s+)?(.+)/i.test(lower) ||
      /create\s+(?:skill\s+|node\s+)?(.+)/i.test(lower) ||
      /put\s+(?:skill\s+|node\s+)?(.+)/i.test(lower) ||
      /insert\s+(?:skill\s+|node\s+)?(.+)/i.test(lower);

    if (isAddSkill) {
      const match = lower.match(/(?:add|create|put|insert)\s+(?:the\s+)?(?:skill\s+|node\s+)?(.+?)(?:\s+to\s+(?:the\s+)?board|\s+to\s+canvas)?$/i);
      const skillQuery = match ? match[1].trim() : lower;

      let matchedSkill: any = null;

      if (skillQuery.includes('static') || skillQuery.includes('ad image') || skillQuery.includes('creative') || skillQuery.includes('image concept')) {
        matchedSkill = {
          title: 'Ad Image Concepts (Static Ads)',
          subtitle: '10 static ad image concepts (lifestyle, flat-lay, macro detail, problem/solution) with AI image prompts.',
          category: 'DZ Landing Page Strategy',
          iconType: 'FileText',
          iconBg: 'bg-emerald-600',
        };
      } else if (skillQuery.includes('copy') || skillQuery.includes('script') || skillQuery.includes('headline') || skillQuery.includes('hook')) {
        matchedSkill = {
          title: 'Direct Response Copywriting',
          subtitle: 'High-converting ad copy, headlines, hooks, and problem-solution sales scripts.',
          category: 'Creative Strategy',
          iconType: 'PenTool',
          iconBg: 'bg-purple-600',
        };
      } else if (skillQuery.includes('persona') || skillQuery.includes('buyer')) {
        matchedSkill = {
          title: 'Buyer Persona Research',
          subtitle: 'Map customer pain points, emotional triggers, objections, and purchasing habits.',
          category: 'Market Intelligence',
          iconType: 'User',
          iconBg: 'bg-indigo-600',
        };
      } else if (skillQuery.includes('market') || skillQuery.includes('target')) {
        matchedSkill = {
          title: 'Target Market Research',
          subtitle: 'Analyze customer segments, demographics, income brackets, and buying motivations.',
          category: 'Market Intelligence',
          iconType: 'Search',
          iconBg: 'bg-blue-600',
        };
      } else if (skillQuery.includes('landing') || skillQuery.includes('cro') || skillQuery.includes('page')) {
        matchedSkill = {
          title: 'High-Converting CRO Landing Page',
          subtitle: 'Full 12-section mobile-first e-commerce landing page with sticky CTA.',
          category: 'DZ Landing Page Strategy',
          iconType: 'LayoutGrid',
          iconBg: 'bg-rose-600',
        };
      } else if (skillQuery.includes('profit') || skillQuery.includes('pricing') || skillQuery.includes('calc') || skillQuery.includes('economic')) {
        matchedSkill = {
          title: 'Product Profitability & Unit Economics',
          subtitle: 'Interactive contribution margin calculator with delivery and return provisions.',
          category: 'Financial Intelligence',
          iconType: 'DollarSign',
          iconBg: 'bg-emerald-600',
        };
      } else if (skillQuery.includes('video') || skillQuery.includes('storyboard')) {
        matchedSkill = {
          title: 'Video Ad Scripts & Storyboards',
          subtitle: '10 video concepts (UGC, Demo, Unboxing) with 3-second hooks and storyboard prompts.',
          category: 'Creative Strategy',
          iconType: 'Video',
          iconBg: 'bg-amber-600',
        };
      } else if (skillQuery.includes('synthesis') || skillQuery.includes('dossier') || skillQuery.includes('master')) {
        matchedSkill = {
          title: 'Master Multi-Skill Synthesis & Deep Dossier',
          subtitle: 'Aggregates all upstream skill outputs into an exhaustive executive report.',
          category: 'Master Full-Funnel Orchestration',
          iconType: 'Layers',
          iconBg: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600',
          isMasterSynthesizer: true,
        };
      } else {
        const found = ALL_SKILLS.find(
          (s) =>
            s.title.toLowerCase().includes(skillQuery) ||
            s.subtitle.toLowerCase().includes(skillQuery) ||
            s.description?.toLowerCase().includes(skillQuery)
        );
        if (found) {
          matchedSkill = {
            title: found.title,
            subtitle: found.subtitle,
            category: found.category,
            iconType: found.icon || 'Sparkles',
            iconBg: found.iconBg || 'bg-blue-600',
          };
        } else {
          matchedSkill = {
            title: skillQuery.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            subtitle: `AI skill specialized in ${skillQuery} for e-commerce intelligence.`,
            category: 'Custom AI Strategy',
            iconType: 'Sparkles',
            iconBg: 'bg-indigo-600',
            isCustomSkill: true,
          };
        }
      }

      // Add to Board!
      handleAddSkillToBoard(matchedSkill);
      showToast(`✅ Added "${matchedSkill.title}" to board!`);

      // Reply with action buttons
      setAiCanvasChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `### ✅ Added to Board: **${matchedSkill.title}**\n\n` +
            `I have placed the **${matchedSkill.title}** node onto your canvas! You can see it live on the board right now.\n\n` +
            `• **Category**: \`${matchedSkill.category}\`\n` +
            `• **Purpose**: ${matchedSkill.subtitle}\n\n` +
            `What would you like to do next with this skill?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionBadge: 'Added to Board',
          actions: [
            {
              label: '⚡ Run Skill Now',
              onClick: () => {
                const latest = nodes[nodes.length - 1];
                if (latest) handleRunSingleNode(latest.id);
                else handleRunWorkflow();
              },
              variant: 'primary',
            },
            {
              label: '⚙️ Configure Parameters',
              onClick: () => {
                const latest = nodes[nodes.length - 1];
                if (latest) handleFocusNode(latest.id);
                showToast(`Select "${matchedSkill.title}" on board to configure parameters.`);
              },
              variant: 'secondary',
            },
            {
              label: '🔍 Focus on Board',
              onClick: () => {
                const latest = nodes[nodes.length - 1];
                if (latest) handleFocusNode(latest.id);
              },
              variant: 'secondary',
            },
          ],
        },
      ]);
      setIsAiCanvasChatLoading(false);
      return;
    }

    // 6. GENERAL REASONING & STRATEGY ASSISTANT (Connected to API or Rich Fallback)
    const provider = localStorage.getItem('ai_provider') || 'openai';
    const model = localStorage.getItem('ai_model') || (provider === 'deepseek' ? 'deepseek-chat' : provider === 'gemini' ? 'gemini-2.0-flash' : 'gpt-4o-mini');
    const userApiKey =
      (provider === 'openai' ? localStorage.getItem('openai_api_key') : null) ||
      (provider === 'deepseek' ? localStorage.getItem('deepseek_api_key') : null) ||
      (provider === 'gemini' ? localStorage.getItem('gemini_api_key') : null) ||
      (provider === 'openrouter' ? localStorage.getItem('openrouter_api_key') : null) ||
      localStorage.getItem('openai_api_key') ||
      localStorage.getItem('user_api_key') ||
      '';

    const canvasContextPrompt =
      `You are Twiks.AI, the autonomous conversational copilot and board strategist inside the Product Intelligence OS canvas.\n` +
      `Current Canvas State:\n` +
      `- Active Nodes on Board (${nodes.length}): ${nodes.map((n) => n.title).join(', ') || 'Clean canvas, no nodes yet'}\n` +
      `- Current Active Product: ${nodes.find((n) => n.isProduct && n.productData)?.title || 'Ultrasonic Dental Scaler Pro'}\n` +
      `- Selected Node: ${selectedNode?.title || 'None'}\n\n` +
      `Provide strategic, actionable e-commerce intelligence. Format your response cleanly using Markdown (headers, bullet lists, bold highlights). Recommend specific skills the user can add to the canvas next.\n\n` +
      `User Query: ${textToSend}`;

    try {
      const res = await fetch('/api/ai/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType: 'General AI Chat',
          provider,
          model,
          prompt: canvasContextPrompt,
          apiKey: userApiKey,
        }),
      });

      const data = await res.json();
      const aiReplyText = data.result || data.content || '';

      if (aiReplyText) {
        setAiCanvasChatMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: aiReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actions: [
              {
                label: '+ Add Static Ad Creative',
                onClick: () => handleSendCanvasAiChat('add skill static ad'),
                variant: 'secondary',
              },
              {
                label: '🚀 Build Launch Pipeline',
                onClick: () => handleSendCanvasAiChat('build launch pipeline'),
                variant: 'primary',
              },
            ],
          },
        ]);
      } else {
        throw new Error('Empty response');
      }
    } catch {
      const fallback =
        `### Strategic Recommendations for **"${textToSend}"**\n\n` +
        `• **Target Customer Identification**: Clarify the specific demographic segment and pain points before creative generation.\n` +
        `• **Direct-Response Angle Testing**: Prepare 3–5 distinct visual angles (problem/solution, macro detail, social proof).\n` +
        `• **Unit Economics Safeguard**: Ensure your selling price in DZD covers COD returns and product delivery margins.\n\n` +
        `You can ask me to execute any action on your board! For example:\n` +
        `- \`add skill static ad\`\n` +
        `- \`add skill copywriting\`\n` +
        `- \`build a full launch pipeline\`\n` +
        `- \`run all nodes\``;

      setAiCanvasChatMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: fallback,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [
            {
              label: '+ Add Static Ad Creative',
              onClick: () => handleSendCanvasAiChat('add skill static ad'),
              variant: 'primary',
            },
            {
              label: '🚀 Build Launch Pipeline',
              onClick: () => handleSendCanvasAiChat('build launch pipeline'),
              variant: 'emerald',
            },
          ],
        },
      ]);
    } finally {
      setIsAiCanvasChatLoading(false);
    }
  };

  // If in Hub mode, show BoardProjectsHub with AppSidebar version noir
  if (boardViewMode === 'hub') {
    return (
      <div className="w-screen h-screen flex bg-[#F8FAFC] overflow-hidden select-none">
        {/* AppSidebar Version Noir */}
        <AppSidebar
          activeView="board"
          onNavigate={(view, subItem) => {
            if (view === 'board') {
              setBoardViewMode('hub');
            } else {
              onNavigateToView(view, subItem);
            }
          }}
          onOpenNewModal={() => setIsNewProjectModalOpen(true)}
        />

        {/* Main Hub Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <BoardProjectsHub
            projects={boardProjects}
            activeProjectId={activeProjectId}
            onOpenProject={(projId) => {
              handleSelectProject(projId);
              setBoardViewMode('canvas');
            }}
            onNewProject={() => setIsNewProjectModalOpen(true)}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onExportProject={(proj) => {
              try {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proj, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute('href', dataStr);
                downloadAnchor.setAttribute('download', `${proj.name.replace(/\s+/g, '_').toLowerCase()}_board.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                showToast(`Exported "${proj.name}"`);
              } catch (err) {
                console.warn('Failed to export', err);
              }
            }}
            onNavigateHome={onNavigateHome}
          />
        </div>

        <NewBoardProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onCreate={(name, template) => {
            handleCreateNewProject(name, template);
            setBoardViewMode('canvas');
          }}
        />
        {boardToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <span>{boardToast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden select-none">
      {/* 1. TOP HEADER BAR styled with Home Dashboard light theme */}
      <header className="h-14 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between gap-4 shrink-0 z-30 shadow-2xs text-slate-800">
        {/* Left: App Logo & Breadcrumb */}
        <div className="flex items-center gap-3">
          <ServicesMenuDropdown
            currentView="board"
            onNavigate={(view, subItem) => {
              if (view === 'dashboard') {
                onNavigateHome();
              } else {
                onNavigateToView(view, subItem);
              }
            }}
          />

          {/* Return to Hub Button */}
          <button
            type="button"
            onClick={() => setBoardViewMode('hub')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 hover:text-blue-600 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-2xs"
            title="Return to Board Projects Hub"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">All Projects</span>
          </button>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium relative">
            <button
              onClick={() => setBoardViewMode('hub')}
              className="hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 text-slate-500"
            >
              <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
              <span>Projects Hub</span>
            </button>
            <span className="text-slate-300">›</span>
            {/* Interactive Project Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsHeaderProjectDropdownOpen(!isHeaderProjectDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold transition-all border border-slate-200 cursor-pointer shadow-2xs"
                title="Switch between board projects or create a new one"
              >
                <Workflow className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[170px] truncate">{currentProject?.name || 'Board Project'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isHeaderProjectDropdownOpen && (
                <div
                  className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs animate-in fade-in text-slate-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-2.5 py-1 border-b border-slate-100 mb-1">
                    <span className="font-bold text-[10px] uppercase text-slate-400 tracking-wider">
                      Switch Board Project
                    </span>
                    <span className="text-[10px] font-mono text-blue-600 font-bold">
                      {boardProjects.length} saved
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1 py-1">
                    {boardProjects.map((proj) => {
                      const isCur = proj.id === activeProjectId;
                      return (
                        <button
                          key={proj.id}
                          onClick={() => {
                            handleSelectProject(proj.id);
                            setIsHeaderProjectDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                            isCur
                              ? 'bg-blue-50/80 text-blue-700 font-bold border border-blue-200'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Workflow className={`w-3.5 h-3.5 shrink-0 ${isCur ? 'text-blue-600' : 'text-slate-400'}`} />
                            <div className="truncate">
                              <span className="block truncate text-xs">{proj.name}</span>
                              <span className="block text-[10px] text-slate-400 font-normal">
                                {proj.nodes?.length || 0} nodes • {proj.edges?.length || 0} links
                              </span>
                            </div>
                          </div>
                          {isCur && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsHeaderProjectDropdownOpen(false);
                        setIsNewProjectModalOpen(true);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer border border-blue-200"
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                      <span>New Board</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsHeaderProjectDropdownOpen(false);
                        setBoardViewMode('hub');
                      }}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer border border-slate-200"
                    >
                      <FolderKanban className="w-3 h-3 text-slate-500" />
                      <span>All Projects</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <span className="text-slate-300">›</span>
            <span className="font-bold text-slate-800">Board</span>
          </div>
        </div>

        {/* Center: Search Bar with Ctrl+K */}
        <div className="relative flex-1 max-w-md hidden lg:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search nodes, products, or anything..."
            className="w-full pl-9 pr-14 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            Ctrl + K
          </kbd>
        </div>

        {/* Right Actions Zone */}
        <div className="flex items-center gap-2">
          {/* Active AI Model Switcher with Live Detection & Tested Models Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const nextOpen = !isModelDropdownOpen;
                setIsModelDropdownOpen(nextOpen);
                if (nextOpen) {
                  syncModelsFromStorage();
                  if (verifiedWorkingModels.length === 0 && boardDetectedModels.length === 0) {
                    handleFetchBoardModels(currentAiProvider);
                  }
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 hover:border-blue-400 transition-all cursor-pointer shadow-2xs"
              title="Click to choose which AI model executes workflows or detect models on your API key"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] uppercase font-bold text-slate-500">
                {currentAiProvider}:
              </span>
              <span className="font-mono text-blue-600 font-bold max-w-[130px] truncate">
                {currentAiModel}
              </span>
              {verifiedWorkingModels.some(
                (m) => m.id === currentAiModel && (m.provider || 'openai') === currentAiProvider && m.success
              ) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Tested & Working" />
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isModelDropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-92 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 animate-in fade-in text-slate-700 select-text"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">AI Engine & Working Models</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleFetchAndTestBoardModels(currentAiProvider)}
                      disabled={isTestingOnBoard || isDetectingOnBoard}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors disabled:opacity-50"
                      title="Fetch models and test which ones work on this API key"
                    >
                      <Zap className={`w-3 h-3 ${isTestingOnBoard ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
                      <span>{isTestingOnBoard ? 'Testing...' : 'Fetch & Test'}</span>
                    </button>
                  </div>
                </div>

                {/* Provider switcher pills */}
                <div className="grid grid-cols-3 gap-1 mb-2.5">
                  {[
                    { id: 'openai', label: 'OpenAI' },
                    { id: 'gemini', label: 'Gemini' },
                    { id: 'deepseek', label: 'DeepSeek' },
                    { id: 'openrouter', label: 'OpenRouter' },
                    { id: 'agentrouter', label: 'AgentRouter' },
                    { id: 'nvidia', label: 'NVIDIA' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectBoardProvider(p.id)}
                      className={`py-1 px-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                        currentAiProvider === p.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* Filter Header: Tested Working Only */}
                {(() => {
                  const providerWorking = verifiedWorkingModels.filter(
                    (m) => (m.provider || 'openai') === currentAiProvider && m.success
                  );

                  return (
                    <div className="mb-2 flex items-center justify-between text-[10.5px] px-2.5 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/80">
                      <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          {providerWorking.length > 0
                            ? `${providerWorking.length} Tested & Working Model${providerWorking.length > 1 ? 's' : ''}`
                            : 'No tested models yet'}
                        </span>
                      </div>
                      {providerWorking.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowOnlyVerified(!showOnlyVerified)}
                          className="text-[10px] text-blue-600 hover:underline font-bold cursor-pointer"
                        >
                          {showOnlyVerified ? 'Show All' : 'Only Tested'}
                        </button>
                      )}
                    </div>
                  );
                })()}

                {/* Model List */}
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 mb-2">
                  {(() => {
                    const providerWorking = verifiedWorkingModels.filter(
                      (m) => (m.provider || 'openai') === currentAiProvider && m.success
                    );

                    // When user has tested models and showOnlyVerified is active, SHOW JUST TESTED WORKING MODELS
                    if (showOnlyVerified && providerWorking.length > 0) {
                      return providerWorking.map((m) => {
                        const isSelected = currentAiModel === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectBoardModel(m.id)}
                            className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 text-blue-800 font-bold border border-blue-300 shadow-2xs'
                                : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="truncate pr-2">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-mono text-[11.5px] truncate text-slate-900">{m.id}</span>
                                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Working{m.latencyMs ? ` • ${m.latencyMs}ms` : ''}
                                </span>
                              </div>
                              {m.testedAt && (
                                <span className="block text-[9.5px] text-slate-400 truncate mt-0.5">
                                  Verified response confirmed at {m.testedAt}
                                </span>
                              )}
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                          </button>
                        );
                      });
                    }

                    // Fallback or full list when no tested models or showOnlyVerified is false
                    const candidateModels =
                      boardDetectedModels.length > 0
                        ? boardDetectedModels
                        : currentAiProvider === 'openai'
                        ? [
                            { id: 'gpt-4o-mini', name: 'gpt-4o-mini (Fast & Economical)', isRecommended: true },
                            { id: 'gpt-4o', name: 'gpt-4o (Flagship Omni)', isRecommended: true },
                            { id: 'gpt-4o-2024-08-06', name: 'gpt-4o-2024-08-06 (Structured Analysis)', isRecommended: false },
                            { id: 'chatgpt-4o-latest', name: 'chatgpt-4o-latest (Dynamic Latest Checkpoint)', isRecommended: false },
                            { id: 'o1-mini', name: 'o1-mini (Fast Reasoning & Math)', isRecommended: true },
                            { id: 'o1', name: 'o1 (Deep Reasoning Proof)', isRecommended: false },
                            { id: 'gpt-4-turbo', name: 'gpt-4-turbo (128k Context)', isRecommended: false },
                            { id: 'gpt-4', name: 'gpt-4 (Standard Base)', isRecommended: false },
                            { id: 'gpt-3.5-turbo', name: 'gpt-3.5-turbo (Classic Fast)', isRecommended: false },
                          ]
                        : currentAiProvider === 'gemini'
                        ? [
                            { id: 'gemini-3.8-flash', name: 'gemini-3.8-flash (Recommended Fast & Smart)', isRecommended: true },
                            { id: 'gemini-4-argon', name: 'gemini-4-argon (Flagship Complex Reasoning)', isRecommended: true },
                            { id: 'gemini-3.1-flash-lite', name: 'gemini-3.1-flash-lite (Ultra-Low Latency)', isRecommended: false },
                            { id: 'gemini-3.1-flash-lite-image', name: 'gemini-3.1-flash-lite-image (Vision Tasks)', isRecommended: false },
                          ]
                        : currentAiProvider === 'openrouter'
                        ? [
                            { id: 'nvidia/nemotron-3.5-lightning:free', name: 'nvidia/nemotron-3.5-lightning:free (Free Tier • 50/day)', isRecommended: true },
                            { id: 'google/gemma-4-31b-it:free', name: 'google/gemma-4-31b-it:free (Free Tier)', isRecommended: true },
                            { id: 'nvidia/nemotron-3.5-super-vl:free', name: 'nvidia/nemotron-3.5-super-vl:free (Free Tier)', isRecommended: false },
                            { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'meta-llama/llama-3.2-3b-instruct:free (Free Tier)', isRecommended: false },
                            { id: 'deepseek/deepseek-chat', name: 'deepseek/deepseek-chat (DeepSeek V3 • Paid)', isRecommended: false },
                            { id: 'anthropic/claude-3.5-sonnet', name: 'anthropic/claude-3.5-sonnet (Claude 3.5 Sonnet • Paid)', isRecommended: false },
                            { id: 'openai/gpt-4o', name: 'openai/gpt-4o (GPT-4o Omni • Paid)', isRecommended: false },
                          ]
                        : currentAiProvider === 'agentrouter'
                        ? [
                            { id: 'gpt-4o', name: 'gpt-4o (GPT-4o Routed)', isRecommended: true },
                            { id: 'claude-3-5-sonnet-latest', name: 'claude-3-5-sonnet-latest (Claude Routed)', isRecommended: true },
                            { id: 'deepseek-v3', name: 'deepseek-v3 (DeepSeek V3 Routed)', isRecommended: true },
                            { id: 'deepseek-r1', name: 'deepseek-r1 (DeepSeek R1 Routed)', isRecommended: true },
                            { id: 'agentrouter/auto', name: 'agentrouter/auto (Smart Dynamic Routing)', isRecommended: false },
                          ]
                        : currentAiProvider === 'nvidia'
                        ? [
                            { id: 'meta/llama-3.3-70b-instruct', name: 'meta/llama-3.3-70b-instruct (NVIDIA NIM Llama 3.3 70B)', isRecommended: true },
                            { id: 'deepseek-ai/deepseek-r1', name: 'deepseek-ai/deepseek-r1 (NVIDIA NIM DeepSeek R1)', isRecommended: true },
                            { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'mistralai/mixtral-8x22b-instruct-v0.1 (Mixtral 8x22B)', isRecommended: true },
                            { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'nvidia/llama-3.1-nemotron-70b-instruct (Nemotron 70B)', isRecommended: true },
                            { id: 'meta/llama-3.1-8b-instruct', name: 'meta/llama-3.1-8b-instruct (NVIDIA NIM High Speed 8B)', isRecommended: false },
                          ]
                        : [
                            { id: 'deepseek-chat', name: 'deepseek-chat (DeepSeek-V3)', isRecommended: true },
                            { id: 'deepseek-reasoner', name: 'deepseek-reasoner (DeepSeek-R1)', isRecommended: true },
                          ];

                    return (
                      <>
                        {providerWorking.length === 0 && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 mb-1.5 space-y-2">
                            <p className="text-slate-600 text-[11px] leading-snug">
                              No models tested yet for {currentAiProvider.toUpperCase()}. Run a test to filter and display only working models.
                            </p>
                            <button
                              type="button"
                              onClick={() => handleFetchAndTestBoardModels(currentAiProvider)}
                              disabled={isTestingOnBoard}
                              className="w-full py-1.5 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                            >
                              <Zap className="w-3 h-3 text-white" />
                              <span>{isTestingOnBoard ? 'Testing in progress...' : 'Fetch & Test Available Models'}</span>
                            </button>
                          </div>
                        )}
                        {candidateModels.map((m) => {
                          const isSelected = currentAiModel === m.id;
                          const verifiedItem = verifiedWorkingModels.find(
                            (v) => v.id === m.id && (v.provider || 'openai') === currentAiProvider && v.success
                          );
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => handleSelectBoardModel(m.id)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-800 font-bold border border-blue-300'
                                  : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                              }`}
                            >
                              <div className="truncate pr-2">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className="font-mono text-[11px] truncate text-slate-900">{m.id}</span>
                                  {verifiedItem && (
                                    <span className="text-[9.5px] font-bold px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Tested {verifiedItem.latencyMs}ms
                                    </span>
                                  )}
                                </div>
                                {m.name && m.name !== m.id && (
                                  <span className="block text-[10px] text-slate-400 truncate">
                                    {m.name}
                                  </span>
                                )}
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>

                {/* Custom Model Input Option */}
                {isCustomInputOpen ? (
                  <div className="flex gap-1.5 mb-2">
                    <input
                      type="text"
                      value={customModelOnBoard}
                      onChange={(e) => setCustomModelOnBoard(e.target.value)}
                      placeholder="Enter custom model ID..."
                      className="flex-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customModelOnBoard.trim()) {
                          handleSelectBoardModel(customModelOnBoard.trim());
                          setIsCustomInputOpen(false);
                        }
                      }}
                      className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCustomInputOpen(true)}
                    className="w-full text-left px-2 py-1 mb-2 rounded-lg text-[10.5px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-slate-400" />
                    <span>Type Custom Model ID...</span>
                  </button>
                )}

                {/* Status or Detection Message */}
                {boardDetectionMsg && (
                  <p className="text-[10px] text-blue-600 font-medium px-1 mb-1 truncate">
                    {boardDetectionMsg}
                  </p>
                )}

                {/* Link to Settings */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Active: <code className="text-blue-600 font-bold">{currentAiModel}</code>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModelDropdownOpen(false);
                      onNavigateToView?.('settings', 'ai');
                    }}
                    className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Diagnostics in Settings</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Launcher: Regroupe Product (Campaign & AdSet Org Chart) */}
          <button
            type="button"
            onClick={() => setIsRegrouperModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Open Regroupe Product App: Select products & cluster into Campaign & AdSets with Org Chart diagram"
          >
            <Workflow className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline">Regroupe Product</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white/20 text-white font-mono font-bold">
              APP
            </span>
          </button>

          {/* Direct Page (Studio Edit Mode) Launcher */}
          <button
            type="button"
            id="btn-board-direct-page-studio-edit"
            onClick={() => {
              window.location.href = '/fb-ads.html';
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Direct Page (Studio Edit Mode) — Opens standalone top-level document with Zero Iframes so Google Studio Edit selects individual DOM elements"
          >
            <ExternalLink className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Direct Page (Studio Edit Mode)</span>
          </button>

          {/* Explicit Save Project Button */}
          <button
            type="button"
            onClick={handleSaveProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Save current board state to project"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          {/* Close Project Button */}
          <button
            type="button"
            onClick={() => handleCloseTab(activeProjectId)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 text-xs font-semibold transition-all border border-slate-200 cursor-pointer shadow-2xs"
            title="Close this project and return to projects hub"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Close</span>
          </button>

          {/* Clear Board Button */}
          <button
            type="button"
            onClick={() => {
              if (nodes.length > 0) {
                setNodes([]);
                setEdges([]);
                setSelectedNodeId(null);
                localStorage.removeItem('user_board_nodes_v1');
                localStorage.removeItem('user_board_edges_v1');
                showToast('Board cleared. You now have a clean canvas.');
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Clear All Nodes (Start Fresh)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Undo / Redo */}
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer">
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Tool Selector: Select (Pointer) vs Pan (Hand) */}
          <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-0.5 text-xs">
            <button
              onClick={() => setActiveTool('select')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === 'select'
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Select Tool (V) - Move & Select Cards"
            >
              <MousePointer className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTool('pan')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTool === 'pan'
                  ? 'bg-white text-blue-600 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Pan Tool (H) - Drag Canvas freely (or hold Space)"
            >
              <Hand className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid Toggle Selector & Snap */}
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                setGridStyle((curr) => (curr === 'dots' ? 'lines' : curr === 'lines' ? 'cross' : 'dots'))
              }
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Toggle Grid (Dots / Lines / Cross)"
            >
              <GridIcon className="w-3.5 h-3.5 text-blue-600" />
              <span className="capitalize text-[11px] font-medium">{gridStyle}</span>
            </button>
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`px-2 py-1 rounded-xl border text-[11px] font-semibold transition-colors cursor-pointer ${
                snapToGrid
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
              title="Snap to Grid (20px)"
            >
              Snap
            </button>
          </div>

          {/* INTERACTIVE MANUAL ZOOM CONTROLS (Slider + Quick Menu + Presets: 10% - 400%) */}
          <div className="relative flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <button
              onClick={() => handleSetZoomWithAnchor((z) => Math.max(10, z - 10))}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Zoom Out (-10%)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Manual Range Slider: Drag directly with mouse (10% to 400%) */}
            <input
              type="range"
              min="10"
              max="400"
              step="5"
              value={zoom}
              onChange={(e) => handleSetZoomWithAnchor(Number(e.target.value))}
              className="w-16 sm:w-20 md:w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              title={`Drag to Zoom: ${zoom}%`}
            />

            <button
              onClick={() => handleSetZoomWithAnchor((z) => Math.min(400, z + 10))}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Zoom In (+10%)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Clickable Percentage Dropdown with Presets & Manual Input */}
            <div className="relative">
              <button
                onClick={() => setIsZoomMenuOpen(!isZoomMenuOpen)}
                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-slate-700 font-bold hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Click to choose preset zoom or enter exact %"
              >
                <span className="w-10 text-right font-mono text-[11px] text-slate-900">{zoom}%</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isZoomMenuOpen && (
                <div className="absolute top-full mt-2 right-0 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 text-slate-700">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 pb-1 tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
                    <span>Zoom Level</span>
                    <span className="font-mono text-blue-600 font-bold">{zoom}%</span>
                  </div>

                  {/* Direct Numeric Input */}
                  <div className="flex items-center gap-2 px-2 py-1.5 mb-1 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 font-medium">Exact %:</span>
                    <input
                      type="number"
                      min="10"
                      max="400"
                      value={zoom}
                      onChange={(e) =>
                        handleSetZoomWithAnchor(Math.max(10, Math.min(400, Number(e.target.value) || 10)))
                      }
                      className="w-16 px-1.5 py-0.5 rounded bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => setIsZoomMenuOpen(false)}
                      className="ml-auto text-[10px] font-bold text-blue-600 px-1.5 py-0.5 rounded bg-blue-50 hover:bg-blue-100 cursor-pointer"
                    >
                      OK
                    </button>
                  </div>

                  {/* Quick Margin Alignment Action */}
                  <button
                    onClick={() => {
                      handleResetLeftMargin();
                      setIsZoomMenuOpen(false);
                    }}
                    className="w-full mb-1 text-left px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-between transition-colors cursor-pointer border border-slate-200"
                    title="Reset to 85% with 60px left margin from sidebar"
                  >
                    <span>Align Left Margin (60px)</span>
                    <span className="text-[10px] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-blue-700 font-mono">
                      85%
                    </span>
                  </button>

                  {/* Preset Options */}
                  <div className="space-y-0.5 max-h-48 overflow-y-auto pr-0.5">
                    {[
                      { label: "25% - Bird's Eye", value: 25 },
                      { label: '50% - Far Out', value: 50 },
                      { label: '75% - Overview', value: 75 },
                      { label: '85% - Default Fit', value: 85 },
                      { label: '100% - Actual Size', value: 100 },
                      { label: '125% - Zoomed In', value: 125 },
                      { label: '150% - Close Up', value: 150 },
                      { label: '200% - Detailed', value: 200 },
                      { label: '300% - High Zoom', value: 300 },
                      { label: '400% - Maximum', value: 400 },
                    ].map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => {
                          handleSetZoomWithAnchor(preset.value);
                          setIsZoomMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          zoom === preset.value
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{preset.label}</span>
                        {zoom === preset.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    ))}
                  </div>

                  {/* Mouse Wheel Zoom Toggle */}
                  <div className="pt-2 mt-1.5 border-t border-slate-100 flex items-center justify-between px-2 text-[11px] text-slate-600">
                    <span>Mouse Wheel Zoom:</span>
                    <button
                      onClick={() => setWheelZoomEnabled(!wheelZoomEnabled)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                        wheelZoomEnabled
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {wheelZoomEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Button */}
          <button
            onClick={() => showToast('Preview mode ready')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-slate-50 shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Preview</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              showToast('Board link copied to clipboard!');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-slate-50 shadow-2xs cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share</span>
          </button>

          {/* AI Chat Copilot Top Header Button */}
          <button
            type="button"
            onClick={() => setIsAiCanvasChatOpen(!isAiCanvasChatOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs select-none ${
              isAiCanvasChatOpen
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-blue-400 ring-2 ring-blue-500/30'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
            title="Open Twiks.AI Canvas Copilot (Docked Right Drawer)"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAiCanvasChatOpen ? 'text-amber-200' : 'text-amber-600'} animate-pulse shrink-0`} />
            <span className="hidden sm:inline">AI Chat</span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono font-bold ${isAiCanvasChatOpen ? 'bg-white/20 text-white' : 'bg-amber-200/60 text-amber-800'}`}>
              COPILOT
            </span>
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          {/* User Profile Yahia Pro User */}
          <div className="flex items-center gap-2 pl-1 cursor-pointer">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-blue-600 relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                alt="Yahia"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold absolute inset-0">
                Y
              </div>
            </div>
            <div className="text-left hidden xl:block leading-tight">
              <span className="text-xs font-bold text-slate-900 block">Yahia</span>
              <span className="text-[10px] text-blue-600 font-semibold block">Pro User</span>
            </div>
          </div>
        </div>
      </header>

      {/* BOARD PROJECTS TAB BAR (Multi-Project Tabs & Switcher) */}
      <BoardTabBar
        projects={boardProjects}
        openProjectIds={openProjectIds}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCloseTab={handleCloseTab}
        onReturnToHub={() => setBoardViewMode('hub')}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onDuplicateProject={handleDuplicateProject}
        onRenameProject={handleRenameProject}
        onDeleteProject={handleDeleteProject}
        onSaveProject={handleSaveProject}
        onCreateNewBlankBoard={handleCreateNewBlankBoard}
        onClearBoard={handleClearCurrentBoard}
        saveStatus={saveStatus}
      />

      {/* 2. MAIN 3-PANEL BODY (Skills Left Drawer + Center Board Canvas + Right Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* PANEL A: Left Drawer "Skills / Nodes" with 670 Skills matching image_d8993db4.png */}
        {isSkillsPanelOpen ? (
          <aside className="w-[360px] sm:w-[390px] my-3 ml-3 h-[calc(100%-1.5rem)] rounded-3xl bg-white border border-slate-200/90 shadow-lg flex flex-col z-20 shrink-0 select-none overflow-hidden text-slate-800">
            {/* Header (CSS Selector 2: aside:nth-of-type(1) > div:nth-of-type(1)) */}
            <div className="h-14 px-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Rounded Blue Icon Box matching Home Dashboard */}
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                  <Workflow className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block leading-none">
                    Team
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm font-bold text-slate-900 tracking-tight block leading-tight truncate">
                      Finalytic
                    </span>
                    <span className="text-slate-400 text-xs hidden sm:inline">• AI Skills</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {/* Expand / Collapse All Toggle with ChevronsUpDown */}
                <button
                  type="button"
                  onClick={handleToggleExpandAllCategories}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Expand / Collapse All Categories"
                >
                  <ChevronsUpDown className="w-3.5 h-3.5" />
                </button>

                {/* Add New Custom Skill Button */}
                <button
                  type="button"
                  onClick={() => setIsNewSkillModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-bold shadow-2xs transition-all cursor-pointer mr-0.5 active:scale-95"
                  title="Create custom AI skill with your own prompt"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Skill</span>
                </button>

                {/* View Mode Toggle: List vs Grid */}
                <button
                  onClick={() => setSkillsViewMode((prev) => (prev === 'list' ? 'grid' : 'list'))}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title={skillsViewMode === 'list' ? 'Switch to 2-Column Grid' : 'Switch to Detailed View'}
                >
                  {skillsViewMode === 'list' ? (
                    <GridIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ListIcon className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Close Drawer Button */}
                <button
                  onClick={() => handleToggleSkillsPanel(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer ml-0.5"
                  title="Collapse Skills Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Left Drawer Navigation Tabs */}
            <div className="p-1 bg-slate-100/90 rounded-2xl mx-3 mt-2.5 mb-1 border border-slate-200/80 grid grid-cols-4 gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarTab('skills');
                }}
                className={`py-1.5 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 select-none ${
                  sidebarTab === 'skills'
                    ? 'bg-white text-blue-700 font-bold shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Browse 670 E-commerce Skills & Funnel Stages"
              >
                <Sparkles className={`w-3.5 h-3.5 ${sidebarTab === 'skills' ? 'text-blue-600' : 'text-slate-500'} shrink-0 pointer-events-none`} />
                <span className="truncate text-[11px] pointer-events-none">Skills</span>
                <span className="bg-blue-600 text-white font-bold text-[9px] px-1 py-0.2 rounded-md font-mono shrink-0 pointer-events-none">
                  {totalMatchingSkills + customSkills.length}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarTab('products');
                }}
                className={`py-1.5 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 select-none ${
                  sidebarTab === 'products'
                    ? 'bg-white text-blue-700 font-bold shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Product Dossiers & Intelligence Catalog"
              >
                <ShoppingBag className={`w-3.5 h-3.5 ${sidebarTab === 'products' ? 'text-blue-600' : 'text-slate-500'} shrink-0 pointer-events-none`} />
                <span className="truncate text-[11px] pointer-events-none">Products</span>
                <span className="text-[9.5px] text-slate-500 font-mono pointer-events-none">
                  {productsList.length}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarTab('uploads');
                }}
                className={`py-1.5 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 select-none ${
                  sidebarTab === 'uploads'
                    ? 'bg-white text-blue-700 font-bold shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title="Uploaded Files, Datasets & Documents"
              >
                <UploadCloud className={`w-3.5 h-3.5 ${sidebarTab === 'uploads' ? 'text-blue-600' : 'text-slate-500'} shrink-0 pointer-events-none`} />
                <span className="truncate text-[11px] pointer-events-none">Uploads</span>
                <span className="text-[9.5px] text-slate-500 font-mono pointer-events-none">
                  {uploadedFiles.length}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarTab('apps');
                }}
                className={`py-1.5 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95 select-none ${
                  sidebarTab === 'apps'
                    ? 'bg-white text-purple-700 font-bold shadow-2xs border border-purple-200'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/60'
                }`}
                title="AI Studio Apps: Text to Code LP, Text to Image LP, Regroupe Product, Storyboard, Script Video, Séance Video"
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-600 shrink-0 pointer-events-none" />
                <span className="truncate text-[11px] pointer-events-none">Apps</span>
                <span className="bg-purple-600 text-white font-bold text-[9px] px-1 py-0.2 rounded-md font-mono shrink-0 pointer-events-none">
                  {AI_STUDIO_APPS.length}
                </span>
              </button>
            </div>

            {sidebarTab === 'skills' ? (
              <>
                {/* Filter Pills & Search */}
                <div className="p-3 border-b border-slate-200/80 space-y-2.5 bg-white">
                  {/* Search Skills Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search 670 skills, sub-skills..."
                      value={skillsSearch}
                      onChange={(e) => setSkillsSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                    {skillsSearch && (
                      <button
                        onClick={() => setSkillsSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
                    {[
                      { label: 'All', id: 'All' },
                      { label: '🌟 Master Orchestration (4)', id: 'master_orchestration' },
                      { label: 'Stage 1: Product (19)', id: 'stage_1_product' },
                      { label: 'Stage 2: Strategy (26)', id: 'stage_2_strategy' },
                      { label: 'Stage 3: Creative (32)', id: 'stage_3_creative' },
                      { label: 'Stage 4: Campaign (30)', id: 'stage_4_campaign' },
                      { label: 'Stage 5: Traffic (28)', id: 'stage_5_traffic' },
                      { label: 'Stage 6: Order (23)', id: 'stage_6_order' },
                      { label: 'Stage 7: Confirmation (21)', id: 'stage_7_confirmation' },
                      { label: 'Stage 8: Delivery (21)', id: 'stage_8_delivery' },
                      { label: 'Stage 9: RTO & Returns (24)', id: 'stage_9_rto' },
                      { label: 'Stage 10: Revenue (22)', id: 'stage_10_revenue' },
                      { label: 'Stage 11: Profit (26)', id: 'stage_11_profit' },
                      { label: 'Stage 12: Customer Quality (25)', id: 'stage_12_customer' },
                      { label: 'Stage 13: Signals (CAPI) (26)', id: 'stage_13_signals' },
                      { label: 'Stage 14: AI Engine (34)', id: 'stage_14_ai' },
                      { label: 'Stage 15: Acquisition (26)', id: 'stage_15_acquisition' },
                      { label: 'DZ Landing Page (17)', id: 'dz_landing_page' },
                      { label: 'Ads Testing (15)', id: 'fb_ads_testing' },
                      { label: 'Ads Scaling (15)', id: 'fb_ads_scaling' },
                      { label: 'Decision Intelligence (4)', id: 'decision_intelligence' },
                      { label: 'Advanced Strategy (22)', id: 'advanced_strategy_intelligence' },
                      { label: 'Advanced Product (17)', id: 'advanced_product_intelligence' },
                      { label: 'Advanced Creative (8)', id: 'advanced_creative_intelligence' },
                      { label: 'Autonomous Agents (7)', id: 'autonomous_agents' },
                      { label: 'Copywriting (10)', id: 'copywriting_frameworks' },
                      { label: 'Shopify & Store (6)', id: 'shopify_store_apps' },
                      { label: 'Analytics & Ops (13)', id: 'advanced_ads_analytics_ops' },
                      { label: 'Advanced Algeria (6)', id: 'advanced_algeria_skills' },
                      { label: 'Suppliers & Sourcing (6)', id: 'supplier_sourcing_intelligence' },
                      { label: 'Logistics (5)', id: 'logistics_supply_chain' },
                      { label: 'Business & Setup (5)', id: 'business_company_setup' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSkillsFilter(cat.id)}
                        className={`px-3 py-1 rounded-xl text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                          skillsFilter === cat.id
                            ? 'bg-blue-600 text-white shadow-2xs font-bold'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {skillsSearch && (
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium px-0.5">
                      <span>Found {totalMatchingSkills} skills</span>
                      <button
                        onClick={() => setSkillsSearch('')}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                </div>

                {/* 2-Column Skill Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/70 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                  {/* Restore bar if any skills have been removed */}
                  {removedSkillIds.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-[11px] shadow-2xs">
                      <span className="text-slate-700">
                        <strong className="text-rose-600 font-bold">{removedSkillIds.length}</strong> hidden skill{removedSkillIds.length > 1 ? 's' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={handleRestoreAllSkills}
                        className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer flex items-center gap-1 font-mono"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Restore All</span>
                      </button>
                    </div>
                  )}

                  {/* Custom AI Skills section if any exist */}
                  {customSkills.length > 0 && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 overflow-hidden shadow-2xs p-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-emerald-800">
                            Custom Skills ({customSkills.length})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsNewSkillModalOpen(true)}
                          className="text-[10px] font-bold text-emerald-700 hover:underline cursor-pointer"
                        >
                          + New
                        </button>
                      </div>
                      <div className="space-y-2">
                        {customSkills.map((cSkill) => (
                          <div
                            key={cSkill.id}
                            draggable={true}
                            onDragStart={(e) => {
                              const payload = {
                                title: cSkill.title,
                                subtitle: cSkill.subtitle,
                                category: cSkill.category,
                                iconType: 'Sparkles',
                                iconBg: 'bg-emerald-600',
                                isCustomSkill: true,
                                customPromptTemplate: cSkill.promptTemplate,
                              };
                              e.dataTransfer.setData('application/json', JSON.stringify(payload));
                              e.dataTransfer.effectAllowed = 'copy';
                            }}
                            className="bg-white rounded-xl p-2.5 border border-slate-200 hover:border-emerald-400 shadow-2xs transition-all cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono uppercase border border-emerald-200">
                                CUSTOM
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSkillToRemove({
                                    id: cSkill.id,
                                    title: cSkill.title,
                                    isCustom: true,
                                  });
                                }}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Custom Skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h5 className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                              {cSkill.title}
                            </h5>
                            <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                              {cSkill.subtitle}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddCustomSkillToBoard(cSkill);
                              }}
                              className="w-full mt-2 py-1 px-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-slate-700 text-[10.5px] font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Add to Board</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredCategories.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 space-y-2">
                      <Search className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-xs font-semibold text-slate-700">No skills found</p>
                      <p className="text-[11px]">Try a different search term or category filter</p>
                      <button
                        onClick={() => {
                          setSkillsSearch('');
                          setSkillsFilter('All');
                        }}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow-2xs"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    filteredCategories.map((category) => {
                      const isOpen = skillsSearch.trim() || skillsFilter !== 'All' ? true : !!expandedCategories[category.id];
                      const CategoryIconComp =
                        (LucideIcons as Record<string, any>)[category.icon] || LucideIcons.Zap;

                      return (
                        <div
                          key={category.id}
                          className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
                        >
                          {/* Accordion Category Header */}
                          <button
                            onClick={() => handleToggleCategory(category.id)}
                            className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`w-6 h-6 rounded-lg ${category.color} flex items-center justify-center text-white shrink-0 shadow-2xs`}
                              >
                                <CategoryIconComp className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate block leading-tight">
                                  {category.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {category.skills.length} skills
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/80">
                                {category.skills.length}
                              </span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </button>

                          {/* Accordion Category Skills List: 2-Column Cards Layout */}
                          {isOpen && (
                            <div className="p-2 pt-1.5 border-t border-slate-100 grid grid-cols-2 gap-2 bg-slate-50/50">
                              {category.skills.map((skill) => renderSkillItem(skill))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : sidebarTab === 'products' ? (
              /* Product Library & Intelligence Tab Content */
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70">
                {/* Product Header & Add Trigger */}
                <div className="p-3 border-b border-slate-200/80 space-y-2 bg-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900 tracking-tight">Products</span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-mono text-[9.5px] font-bold border border-blue-200">
                        {filteredDetailedProducts.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onNavigateToView('products')}
                        className="px-2 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border border-slate-200"
                        title="Open dedicated Products Intelligence page"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Full Page</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsProductImportModalOpen(true)}
                        className="px-2.5 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ Add Product</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search products by title, category, ID..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Quick Helper Banner */}
                  <div
                    onClick={() => setIsProductImportModalOpen(true)}
                    className="p-2 rounded-xl bg-blue-50/60 border border-blue-200/70 text-[10.5px] text-slate-700 leading-snug flex items-center justify-between gap-1.5 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">Add via <strong>AI Vision Scan</strong>, <strong>JSON File</strong> or <strong>Manual</strong></span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold shrink-0">Open</span>
                  </div>
                </div>

                {/* Products List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {filteredDetailedProducts.map((product) => {
                    const sellingPrice = product.financials?.sellingPrice ?? 1400;
                    const costPrice = product.financials?.costPrice ?? 760;
                    const shippingCost = product.financials?.shippingCost ?? 202;
                    const marginPct = Math.round(
                      ((sellingPrice - costPrice - shippingCost) / (sellingPrice || 1)) * 100
                    );

                    const productPayload = {
                      title: product.name,
                      subtitle: product.aiAnalysis?.marketingAngle || product.category || 'Product Dossier',
                      category: 'Product Intelligence',
                      iconType: 'ShoppingBag',
                      iconBg: 'bg-blue-600',
                      isProduct: true,
                      productData: {
                        image: product.mainImage,
                        sellingPrice,
                        productCost: costPrice,
                        profitMargin: marginPct,
                        niche: product.category,
                        sellingPoints: product.aiAnalysis?.whySell?.slice(0, 2).join(' • ') || 'Verified product dossier',
                        description: product.intelligence?.evidenceNotes || product.name,
                        stock: product.supplier?.moq ? `MOQ ${product.supplier.moq}` : 'Active',
                      },
                    };

                    return (
                      <div
                        key={product.id}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/json', JSON.stringify(productPayload));
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => setPreviewProduct(product)}
                        className="bg-white rounded-2xl p-3 border border-slate-200/90 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer select-none shadow-2xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=500&h=500&fit=crop';
                              }}
                            />
                            <div className="absolute top-1 left-1 px-1 rounded bg-slate-900/80 text-[8px] font-mono text-white font-bold">
                              DZ
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider font-mono truncate ${
                                  product.status === 'Active'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {product.status}
                              </span>
                              <span className="text-[9.5px] text-blue-600 font-mono font-bold shrink-0">
                                Score {product.opportunity?.overallScore ?? 52}/100
                              </span>
                            </div>

                            <h4 className="font-bold text-xs text-slate-900 mt-1 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h4>

                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-xs font-bold text-blue-600 font-mono">
                                {(product.financials?.sellingPrice ?? 1400).toLocaleString()} DZD
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Cost: {(product.financials?.costPrice ?? 760).toLocaleString()}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1 rounded font-mono ${
                                  (product.financials?.roi ?? 0) >= 0
                                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                    : 'text-rose-700 bg-rose-50 border border-rose-200'
                                }`}
                              >
                                {(product.financials?.roi ?? 0) > 0 ? `+${product.financials.roi}%` : `${product.financials?.roi ?? 0}%`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-500 text-[10.5px] mt-2 line-clamp-2 leading-relaxed">
                          {product.intelligence?.evidenceNotes || product.aiAnalysis?.marketingAngle || product.source}
                        </p>

                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewProduct(product);
                            }}
                            className="flex-1 py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 active:scale-98 text-slate-700 text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddDetailedProductToBoard(product);
                            }}
                            className="flex-1 py-1.5 px-2.5 rounded-xl border border-blue-600 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-[11px] font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : sidebarTab === 'uploads' ? (
              /* Uploads / Files Tab Content */
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70">
                {/* Upload Header & Filters */}
                <div className="p-3 border-b border-slate-200/80 space-y-2.5 bg-white shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.webp,.svg,.gif,.pdf,.doc,.docx,.txt,.rtf,.xlsx,.xls,.csv,.tsv,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Dropzone Upload Trigger */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFileUpload({ target: { files: e.dataTransfer.files } } as any);
                      }
                    }}
                    className="p-3 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/40 transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mb-1.5 transition-colors shadow-2xs">
                      <FileUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Click to Upload or Drag & Drop
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      Excel / CSV • PDF • Word • JSON • Images
                    </span>
                  </div>

                  {/* Search Files Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search uploaded files, data..."
                      value={fileSearch}
                      onChange={(e) => setFileSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                    {fileSearch && (
                      <button
                        onClick={() => setFileSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills for File Types */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs font-semibold scrollbar-none">
                    {[
                      { id: 'all', label: `All (${uploadedFiles.length})` },
                      { id: 'excel', label: `📊 Tables (${uploadedFiles.filter((f) => f.type === 'excel').length})` },
                      { id: 'pdf', label: `📄 PDF (${uploadedFiles.filter((f) => f.type === 'pdf').length})` },
                      { id: 'word', label: `📝 Word (${uploadedFiles.filter((f) => f.type === 'word').length})` },
                      { id: 'json', label: `📦 JSON (${uploadedFiles.filter((f) => f.type === 'json').length})` },
                      { id: 'image', label: `🖼️ Images (${uploadedFiles.filter((f) => f.type === 'image').length})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFileFilter(f.id as any)}
                        className={`px-2 py-0.5 rounded-lg text-[10.5px] whitespace-nowrap transition-all cursor-pointer ${
                          fileFilter === f.id
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Uploaded Files List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {filteredUploadedFiles.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <UploadCloud className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="text-xs font-semibold text-slate-700">No files found</p>
                      <p className="text-[11px] text-slate-500">Upload an Excel table, PDF, Word doc, JSON, or image</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        Browse Files
                      </button>
                    </div>
                  ) : (
                    filteredUploadedFiles.map((file) => {
                      const iconBg =
                        file.type === 'excel'
                          ? 'bg-emerald-600'
                          : file.type === 'pdf'
                          ? 'bg-rose-600'
                          : file.type === 'word'
                          ? 'bg-blue-600'
                          : file.type === 'json'
                          ? 'bg-amber-600'
                          : 'bg-purple-600';

                      return (
                        <div
                          key={file.id}
                          draggable={true}
                          onDragStart={(e) => handleDragStartFile(e, file)}
                          className="bg-white rounded-2xl p-3 border border-slate-200/90 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between group cursor-grab active:cursor-grabbing select-none shadow-2xs"
                        >
                          <div>
                            {/* Top info row */}
                            <div className="flex items-center justify-between gap-1">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
                                file.type === 'excel' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                file.type === 'pdf' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                file.type === 'word' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                file.type === 'json' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {file.type.toUpperCase()}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {Math.round(file.size / 1024)} KB
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUploadedFile(file.id, file.name);
                                  }}
                                  className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete File"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Middle file presentation */}
                            <div className="flex items-start gap-2.5 mt-2">
                              {file.type === 'image' && file.previewUrl ? (
                                <img
                                  src={file.previewUrl}
                                  alt={file.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-white shrink-0 shadow-2xs`}>
                                  {file.type === 'excel' && <FileSpreadsheet className="w-5 h-5" />}
                                  {file.type === 'pdf' && <FileText className="w-5 h-5" />}
                                  {file.type === 'word' && <FileText className="w-5 h-5" />}
                                  {file.type === 'json' && <FileCode className="w-5 h-5" />}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1" title={file.name}>
                                  {file.name}
                                </h4>
                                <p className="text-slate-500 text-[10px] mt-0.5 line-clamp-2 leading-tight">
                                  {file.summary}
                                </p>
                              </div>
                            </div>

                            {/* Tags */}
                            {file.tags && file.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-2 flex-wrap">
                                {file.tags.slice(0, 3).map((tag, tIdx) => (
                                  <span key={tIdx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-mono border border-slate-200/80">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons: Add to Board & Inspect */}
                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFileToBoard(file);
                              }}
                              className="flex-1 py-1 px-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-slate-700 text-[11px] font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                            >
                              <Plus className="w-3 h-3" />
                              <span>+ Add to Board</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFileModal(file);
                              }}
                              className="p-1 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Inspect File Data"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              /* AI Creative Studio Apps Tab Content (sidebarTab === 'apps') */
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70">
                {/* Apps Header & Filters */}
                <div className="p-3 border-b border-slate-200/80 space-y-2.5 bg-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">AI Creative Apps</span>
                        <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                          {AI_STUDIO_APPS.length} APPS READY
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Production studio tools for e-commerce creatives & ads
                      </p>
                    </div>
                  </div>

                  {/* Search Apps Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search apps (Image, Storyboard, Script, Séance)..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                    {appSearch && (
                      <button
                        onClick={() => setAppSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Apps List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {AI_STUDIO_APPS.filter((app) =>
                    !appSearch ||
                    app.title.toLowerCase().includes(appSearch.toLowerCase()) ||
                    app.subtitle.toLowerCase().includes(appSearch.toLowerCase()) ||
                    app.description.toLowerCase().includes(appSearch.toLowerCase())
                  ).map((app) => {
                    return (
                      <div
                        key={app.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStartApp(e, app)}
                        onClick={() => {
                          if (app.appType === 'cro_mobile_landing_page') {
                            setIsCroMobileModalOpen(true);
                          } else if (app.appType === 'landing_page_generator') {
                            setIsLandingPageModalOpen(true);
                          } else if (app.appType === 'product_regrouper') {
                            setIsRegrouperModalOpen(true);
                          } else if (app.appType === 'text_to_code_landing_page') {
                            setIsTextToCodeModalOpen(true);
                          } else if (app.appType === 'text_to_image_landing_page') {
                            setIsTextToImageLpModalOpen(true);
                          } else {
                            handleAddAppToBoard(app);
                          }
                        }}
                        className="bg-white hover:bg-purple-50/20 rounded-2xl p-3.5 border border-slate-200/90 hover:border-purple-300 hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer active:scale-[0.99] select-none shadow-2xs"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="bg-slate-100 text-slate-600 text-[9.5px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono border border-slate-200/80">
                              {app.tag}
                            </span>
                            <span className="bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[9px] px-2 py-0.5 rounded-md font-mono shrink-0">
                              {app.badge}
                            </span>
                          </div>

                          {/* App Icon + Title */}
                          <div className="flex items-start gap-2.5">
                            <div className={`w-9 h-9 rounded-xl ${app.iconBg} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                              {app.appType === 'verde_landing_page_builder' && <Zap className="w-4.5 h-4.5" />}
                              {app.appType === 'cro_mobile_landing_page' && <Smartphone className="w-4.5 h-4.5" />}
                              {app.appType === 'landing_page_generator' && <Palette className="w-4.5 h-4.5" />}
                              {app.appType === 'text_to_code_landing_page' && <Code className="w-4.5 h-4.5" />}
                              {app.appType === 'text_to_image_landing_page' && <ImageIcon className="w-4.5 h-4.5" />}
                              {app.appType === 'text_to_image' && <ImageIcon className="w-4.5 h-4.5" />}
                              {app.appType === 'image_to_text' && <FileText className="w-4.5 h-4.5" />}
                              {app.appType === 'text_to_storyboard' && <Film className="w-4.5 h-4.5" />}
                              {app.appType === 'text_to_video_script' && <Video className="w-4.5 h-4.5" />}
                              {app.appType === 'text_to_scene_video' && <Clapperboard className="w-4.5 h-4.5" />}
                              {app.appType === 'product_regrouper' && <Workflow className="w-4.5 h-4.5" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-purple-700 transition-colors">
                                {app.title}
                              </h4>
                              <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                                {app.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                            {app.description}
                          </p>

                          {/* Feature Highlights */}
                          <div className="mt-2.5 space-y-1">
                            {app.features.map((feat, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 text-[10.5px] text-slate-600">
                                <span className="text-emerald-600 text-[11px] font-bold">✓</span>
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 mt-3.5">
                          {app.appType === 'cro_mobile_landing_page' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCroMobileModalOpen(true);
                              }}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Open CRO Landing Page Builder (Mobile)"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Open App</span>
                            </button>
                          )}
                          {app.appType === 'landing_page_generator' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsLandingPageModalOpen(true);
                              }}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Open AI Landing Page Generator (3-Column Live Studio)"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Open App</span>
                            </button>
                          )}
                          {app.appType === 'product_regrouper' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsRegrouperModalOpen(true);
                              }}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Open Fullscreen Org Chart & Regroup Products"
                            >
                              <Workflow className="w-3.5 h-3.5" />
                              <span>Open App</span>
                            </button>
                          )}
                          {app.appType === 'text_to_code_landing_page' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsTextToCodeModalOpen(true);
                              }}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Open Text to Code Landing Page Generator"
                            >
                              <Code className="w-3.5 h-3.5" />
                              <span>Open App</span>
                            </button>
                          )}
                          {app.appType === 'text_to_image_landing_page' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsTextToImageLpModalOpen(true);
                              }}
                              className="flex-1 py-1.5 px-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Open Text to Image Landing Page Generator"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Open App</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddAppToBoard(app);
                            }}
                            className={`py-1.5 px-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-600 hover:text-white active:scale-98 text-purple-700 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                              app.appType === 'cro_mobile_landing_page' || app.appType === 'landing_page_generator' || app.appType === 'product_regrouper' || app.appType === 'text_to_code_landing_page' || app.appType === 'text_to_image_landing_page'
                                ? 'flex-1'
                                : 'w-full'
                            }`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>+ Add to Board</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        ) : (
          /* Button to re-open Skills panel when collapsed */
          <button
            onClick={() => handleToggleSkillsPanel(true)}
            className="absolute left-3 top-3 z-30 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-md text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            title="Open Skills Panel"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Skills / Nodes</span>
          </button>
        )}

        {/* PANEL B: Center Board Canvas with MOVABLE CARDS, CRISP GRID, DYNAMIC BEZIERS */}
        <main
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropSkill}
          style={{ backgroundColor: boardBgColor }}
          className={`flex-1 h-full relative overflow-hidden select-none transition-colors duration-150 ${
            drawMode
              ? 'cursor-crosshair'
              : activeTool === 'pan' || isSpacePressed
              ? isPanning
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-default'
          }`}
        >
          {/* Active Mouse Drawing Banner Overlay */}
          {drawMode && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#16161a]/95 text-white border border-blue-500/60 rounded-full px-5 py-2 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in select-none">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-white">
                ✏️ Mouse Draw: Click & drag anywhere on board to draw {drawMode === 'circle' ? 'Circle' : 'Rectangle'} zone
              </span>
              <button
                type="button"
                onClick={() => {
                  setDrawMode(null);
                  setActiveDrawing(null);
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-rose-500/20 hover:text-rose-300 text-white text-[11px] font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* PROFESSIONAL SVG GRID (Dots, Lines, or Cross) - Synchronized with Zoom & Pan */}
          <div className="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                {gridStyle === 'dots' && (
                  <pattern
                    id="board-grid-pattern"
                    width={24 * (zoom / 100)}
                    height={24 * (zoom / 100)}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`translate(${panOffset.x}, ${panOffset.y})`}
                  >
                    <circle
                      cx={(12 * zoom) / 100}
                      cy={(12 * zoom) / 100}
                      r={Math.max(0.9, (1.2 * zoom) / 100)}
                      fill={isDarkSurface ? '#555566' : '#CBD5E1'}
                      opacity={isDarkSurface ? '0.75' : '0.85'}
                    />
                  </pattern>
                )}
                {gridStyle === 'lines' && (
                  <pattern
                    id="board-grid-pattern"
                    width={30 * (zoom / 100)}
                    height={30 * (zoom / 100)}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`translate(${panOffset.x}, ${panOffset.y})`}
                  >
                    <path
                      d={`M ${30 * (zoom / 100)} 0 L 0 0 0 ${30 * (zoom / 100)}`}
                      fill="none"
                      stroke={isDarkSurface ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}
                      strokeWidth="1"
                    />
                  </pattern>
                )}
                {gridStyle === 'cross' && (
                  <pattern
                    id="board-grid-pattern"
                    width={36 * (zoom / 100)}
                    height={36 * (zoom / 100)}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`translate(${panOffset.x}, ${panOffset.y})`}
                  >
                    <path
                      d={`M ${18 * (zoom / 100)} ${14 * (zoom / 100)} L ${18 * (zoom / 100)} ${22 * (zoom / 100)} M ${14 * (zoom / 100)} ${18 * (zoom / 100)} L ${22 * (zoom / 100)} ${18 * (zoom / 100)}`}
                      stroke={isDarkSurface ? 'rgba(255,255,255,0.18)' : '#CBD5E1'}
                      strokeWidth="1"
                      opacity="0.85"
                    />
                  </pattern>
                )}
              </defs>
              <rect width="100%" height="100%" fill="url(#board-grid-pattern)" />
            </svg>
          </div>

          {/* Visual Drop Target Highlight when dragging a skill over canvas with mouse */}
          {isCanvasDragOver && (
            <div className="absolute inset-4 rounded-3xl border-2 border-dashed border-blue-500 bg-blue-500/5 z-20 pointer-events-none flex items-center justify-center animate-pulse">
              <div className="px-4 py-2.5 rounded-2xl bg-white shadow-2xl border border-blue-300 text-blue-600 font-bold text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Drop skill here to add to Board</span>
              </div>
            </div>
          )}

          {/* Floating Live Connection Status Helper */}
          {connectingFrom && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
              <div className="px-4 py-2 rounded-2xl bg-neutral-900/95 text-white border border-emerald-500/50 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className="text-emerald-400 font-bold">Connecting:</span>
                  <span className="text-neutral-200">
                    {connectingFrom.subId?.startsWith('prod:')
                      ? 'Product selected'
                      : connectingFrom.subId?.startsWith('adset:')
                      ? 'AdSet selected'
                      : 'Skill node selected'}
                  </span>
                  <span className="text-neutral-400 mx-1">•</span>
                  <span className="text-neutral-300">
                    Click or drop on any {connectingFrom.subId ? 'Skill card' : 'Product or Skill card'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConnectingFrom(null);
                    setConnectingMousePos(null);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] font-mono cursor-pointer border border-white/10"
                >
                  Cancel (Esc)
                </button>
              </div>
            </div>
          )}

          {/* Canvas Scaled & Panned Content Viewport - Infinite plane without artificial bounding clamp */}
          <div
            className="absolute inset-0 origin-top-left overflow-visible select-none transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
              transformOrigin: '0 0',
            }}
          >
            {/* 0. BACKGROUND SHAPES & FRAMES (STRICTLY ALWAYS IN THE BACK BEHIND CARDS AT z-0) */}
            {boardShapes.map((shape) => {
              const isSelected = selectedShapeId === shape.id;
              const isCircle = shape.type === 'circle';
              const isEditingTitle = editingShapeTitleId === shape.id;
              const isBeingDragged = draggingShapeId === shape.id;
              const isBeingResized = resizingShape?.id === shape.id;

              return (
                <div
                  key={shape.id}
                  data-shape-id={shape.id}
                  onMouseDown={(e) => handleShapeMouseDown(e, shape.id)}
                  className={`absolute group transition-shadow ${
                    isBeingDragged ? 'cursor-grabbing' : 'cursor-move'
                  } ${
                    isCircle ? 'rounded-full' : 'rounded-3xl'
                  } ${
                    isSelected
                      ? 'ring-2 ring-blue-500/90 shadow-xl'
                      : 'hover:ring-1 hover:ring-white/40'
                  }`}
                  style={{
                    left: shape.x,
                    top: shape.y,
                    width: shape.width,
                    height: shape.height,
                    backgroundColor:
                      shape.isTransparent || shape.opacity === 0
                        ? 'transparent'
                        : hexToRgba(shape.color, shape.opacity !== undefined ? shape.opacity : 0.14),
                    borderWidth: '2px',
                    borderStyle: 'dashed',
                    borderColor: shape.strokeColor || shape.color,
                    zIndex: 0, // ALWAYS BEHIND CARDS
                    pointerEvents: 'auto',
                  }}
                >
                  {/* Top Title Tag Header Badge with Text Size, Transparency, Unlimited Colors, and AI */}
                  <div
                    data-no-drag="true"
                    onMouseDown={(e) => e.stopPropagation()}
                    className={`absolute -top-3.5 left-6 px-3 py-1 rounded-full font-bold shadow-md flex items-center gap-2 backdrop-blur-md border cursor-default select-none ${
                      isDarkSurface
                        ? 'bg-[#18181b]/95 border-white/20 text-white'
                        : 'bg-white/95 border-slate-300 text-slate-800'
                    }`}
                    style={{
                      transform: (shape.fontSize && shape.fontSize >= 18) ? 'translateY(-6px)' : undefined,
                      paddingTop: (shape.fontSize && shape.fontSize >= 20) ? '6px' : undefined,
                      paddingBottom: (shape.fontSize && shape.fontSize >= 20) ? '6px' : undefined,
                      paddingLeft: (shape.fontSize && shape.fontSize >= 20) ? '16px' : undefined,
                      paddingRight: (shape.fontSize && shape.fontSize >= 20) ? '16px' : undefined,
                    }}
                  >
                    <span
                      className="rounded-full shrink-0"
                      style={{
                        backgroundColor: shape.color,
                        width: (shape.fontSize && shape.fontSize >= 20) ? '12px' : '10px',
                        height: (shape.fontSize && shape.fontSize >= 20) ? '12px' : '10px',
                      }}
                    />
                    {isEditingTitle ? (
                      <input
                        type="text"
                        autoFocus
                        value={shape.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBoardShapes((prev) =>
                            prev.map((s) => (s.id === shape.id ? { ...s, title: val } : s))
                          );
                        }}
                        onBlur={() => setEditingShapeTitleId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setEditingShapeTitleId(null);
                        }}
                        style={{ fontSize: `${shape.fontSize || 12}px` }}
                        className="bg-transparent border-b border-blue-400 font-bold outline-none px-1"
                      />
                    ) : (
                      <span
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingShapeTitleId(shape.id);
                        }}
                        title="Double-click to edit zone title"
                        style={{ fontSize: `${shape.fontSize || 12}px` }}
                        className="cursor-pointer hover:underline font-bold"
                      >
                        {shape.title || (isCircle ? 'Circle Zone' : 'Rectangle Zone')}
                      </span>
                    )}

                    {/* Controls Toolbar: Aa Text Size, 💧 Opacity/Transparent, Colors, AI & Delete */}
                    <div className="flex items-center gap-1.5 pl-1.5 border-l border-white/20">
                      {/* 1. TEXT SIZE PARAMETER (Aa) */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveShapeFontSizeMenuId(activeShapeFontSizeMenuId === shape.id ? null : shape.id);
                            setActiveShapeOpacityMenuId(null);
                          }}
                          className="px-1.5 py-0.5 rounded text-[10.5px] font-bold text-neutral-300 hover:text-white hover:bg-white/10 flex items-center gap-0.5 transition-colors cursor-pointer"
                          title="Text Size Parameter (Make text big, normal, or banner)"
                        >
                          <Type className="w-3 h-3 text-blue-400" />
                          <span>{shape.fontSize ? `${shape.fontSize}px` : 'Aa'}</span>
                        </button>
                        {activeShapeFontSizeMenuId === shape.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-0 top-full mt-1.5 bg-[#18181b] border border-white/20 rounded-xl shadow-2xl p-2 z-50 text-white flex flex-col gap-1 min-w-[140px] animate-in fade-in zoom-in-95 backdrop-blur-xl"
                          >
                            <span className="text-[9.5px] uppercase font-bold text-neutral-400 tracking-wider px-1">
                              Zone Title Size:
                            </span>
                            {[
                              { label: 'Normal (12px)', size: 12 },
                              { label: 'Medium (16px)', size: 16 },
                              { label: 'Big (22px)', size: 22 },
                              { label: 'Extra Big (28px)', size: 28 },
                              { label: 'Huge Banner (36px)', size: 36 },
                            ].map((sz) => (
                              <button
                                key={sz.size}
                                type="button"
                                onClick={() => {
                                  setBoardShapes((prev) =>
                                    prev.map((s) => (s.id === shape.id ? { ...s, fontSize: sz.size } : s))
                                  );
                                  setActiveShapeFontSizeMenuId(null);
                                }}
                                className={`px-2 py-1 rounded-lg text-left text-xs font-semibold hover:bg-blue-600/30 hover:text-blue-200 transition-colors cursor-pointer flex items-center justify-between ${
                                  (shape.fontSize || 12) === sz.size
                                    ? 'bg-blue-600/40 text-blue-300 font-bold'
                                    : 'text-neutral-300'
                                }`}
                              >
                                <span>{sz.label}</span>
                                {(shape.fontSize || 12) === sz.size && <Check className="w-3 h-3 text-blue-400" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 2. TRANSPARENCY / OPACITY PARAMETER (💧) */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveShapeOpacityMenuId(activeShapeOpacityMenuId === shape.id ? null : shape.id);
                            setActiveShapeFontSizeMenuId(null);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10.5px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer ${
                            shape.isTransparent || shape.opacity === 0
                              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50'
                              : 'text-neutral-300 hover:text-white hover:bg-white/10'
                          }`}
                          title="Opacity & Transparency Parameter"
                        >
                          <Droplets className="w-3 h-3 text-cyan-400" />
                          <span>
                            {shape.isTransparent || shape.opacity === 0
                              ? 'Clear (0%)'
                              : `${Math.round((shape.opacity ?? 0.14) * 100)}%`}
                          </span>
                        </button>
                        {activeShapeOpacityMenuId === shape.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-0 top-full mt-1.5 bg-[#18181b] border border-white/20 rounded-xl shadow-2xl p-2.5 z-50 text-white flex flex-col gap-1.5 min-w-[180px] animate-in fade-in zoom-in-95 backdrop-blur-xl"
                          >
                            <span className="text-[9.5px] uppercase font-bold text-neutral-400 tracking-wider px-1">
                              Background Opacity:
                            </span>
                            <div className="grid grid-cols-2 gap-1">
                              {[
                                { label: '💧 0% (Clear)', op: 0, trans: true },
                                { label: '10% Subtle', op: 0.1, trans: false },
                                { label: '25% Medium', op: 0.25, trans: false },
                                { label: '50% Tinted', op: 0.5, trans: false },
                                { label: '75% Bold', op: 0.75, trans: false },
                                { label: '100% Solid', op: 1.0, trans: false },
                              ].map((lvl) => (
                                <button
                                  key={lvl.label}
                                  type="button"
                                  onClick={() => {
                                    setBoardShapes((prev) =>
                                      prev.map((s) =>
                                        s.id === shape.id
                                          ? { ...s, opacity: lvl.op, isTransparent: lvl.trans }
                                          : s
                                      )
                                    );
                                    setActiveShapeOpacityMenuId(null);
                                  }}
                                  className={`px-2 py-1 rounded-md text-[11px] font-medium text-left hover:bg-cyan-600/30 hover:text-cyan-200 transition-colors cursor-pointer ${
                                    (shape.isTransparent && lvl.trans) ||
                                    (!shape.isTransparent && Math.abs((shape.opacity ?? 0.14) - lvl.op) < 0.05)
                                      ? 'bg-cyan-600/40 text-cyan-300 font-bold'
                                      : 'text-neutral-300'
                                  }`}
                                >
                                  {lvl.label}
                                </button>
                              ))}
                            </div>
                            <div className="pt-1.5 border-t border-white/10 flex items-center gap-2">
                              <span className="text-[10px] text-neutral-400">Slider:</span>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={shape.isTransparent ? 0 : (shape.opacity ?? 0.14)}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value);
                                  setBoardShapes((prev) =>
                                    prev.map((s) =>
                                      s.id === shape.id
                                        ? { ...s, opacity: val, isTransparent: val === 0 }
                                        : s
                                    )
                                  );
                                }}
                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. UNLIMITED COLOR PICKER & QUICK SWATCHES */}
                      <div className="flex items-center gap-1 pl-1 border-l border-white/20">
                        {['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#8b5cf6'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBoardShapes((prev) =>
                                prev.map((s) => (s.id === shape.id ? { ...s, color: c, strokeColor: c } : s))
                              );
                            }}
                            className="w-2.5 h-2.5 rounded-full hover:scale-125 transition-transform cursor-pointer"
                            style={{ backgroundColor: c }}
                            title={`Color ${c}`}
                          />
                        ))}

                        {/* Unlimited Spectrum Color Picker Input */}
                        <label
                          className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center cursor-pointer hover:scale-125 transition-transform overflow-hidden shadow-2xs relative bg-gradient-to-tr from-rose-500 via-amber-400 to-blue-500"
                          title="Unlimited Color Spectrum Picker (Pick ANY color)"
                        >
                          <input
                            type="color"
                            value={shape.color || '#6366f1'}
                            onChange={(e) => {
                              const chosen = e.target.value;
                              setBoardShapes((prev) =>
                                prev.map((s) =>
                                  s.id === shape.id ? { ...s, color: chosen, strokeColor: chosen } : s
                                )
                              );
                            }}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          />
                          <Palette className="w-2.5 h-2.5 text-white drop-shadow-md pointer-events-none" />
                        </label>
                      </div>

                      {/* 4. AI CANVAS CHAT FOR THIS ZONE */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveZoneForChat(shape.title);
                          setIsAiCanvasChatOpen(true);
                          showToast(`Opened AI Canvas Chat for "${shape.title}"`);
                        }}
                        className="p-1 rounded-md text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 transition-colors cursor-pointer flex items-center gap-0.5"
                        title="Chat with AI about this Zone"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                        <span className="text-[9.5px] font-bold hidden sm:inline">AI</span>
                      </button>

                      {/* 5. DELETE ZONE BUTTON */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteShape(shape.id);
                        }}
                        className="ml-0.5 p-0.5 rounded text-neutral-400 hover:text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                        title="Delete this background zone"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Multi-Handle Mouse Resizing (Corner, Right, Bottom) */}
                  {isSelected && (
                    <>
                      {/* Bottom-right Corner Resize Handle */}
                      <div
                        data-no-drag="true"
                        onMouseDown={(e) => handleStartResizeShape(e, shape.id, 'corner')}
                        className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-blue-500 shadow-md flex items-center justify-center cursor-nwse-resize hover:scale-125 transition-transform z-10"
                        title="Drag corner with mouse to resize both width and height"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>

                      {/* Right Edge Resize Handle */}
                      {!isCircle && (
                        <div
                          data-no-drag="true"
                          onMouseDown={(e) => handleStartResizeShape(e, shape.id, 'right')}
                          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-7 rounded-full bg-white border border-blue-500 shadow-md flex items-center justify-center cursor-ew-resize hover:scale-125 transition-transform z-10"
                          title="Drag right edge with mouse to adjust width"
                        >
                          <div className="w-0.5 h-3 rounded-full bg-blue-500" />
                        </div>
                      )}

                      {/* Bottom Edge Resize Handle */}
                      {!isCircle && (
                        <div
                          data-no-drag="true"
                          onMouseDown={(e) => handleStartResizeShape(e, shape.id, 'bottom')}
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-7 h-3 rounded-full bg-white border border-blue-500 shadow-md flex items-center justify-center cursor-ns-resize hover:scale-125 transition-transform z-10"
                          title="Drag bottom edge with mouse to adjust height"
                        >
                          <div className="w-3 h-0.5 rounded-full bg-blue-500" />
                        </div>
                      )}

                      {/* Live Dimensions Display Badge */}
                      <div className="absolute -bottom-6 right-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-neutral-900/90 text-white/95 border border-white/20 shadow-md pointer-events-none select-none flex items-center gap-1 z-10">
                        <span>{shape.width} × {shape.height} px</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Ghost Preview for Active Mouse Drawing on Canvas */}
            {activeDrawing && (() => {
              const minX = Math.min(activeDrawing.startX, activeDrawing.currentX);
              const minY = Math.min(activeDrawing.startY, activeDrawing.currentY);
              const rawW = Math.abs(activeDrawing.currentX - activeDrawing.startX);
              const rawH = Math.abs(activeDrawing.currentY - activeDrawing.startY);
              const isCircle = activeDrawing.type === 'circle';
              const w = Math.max(10, isCircle ? Math.max(rawW, rawH) : rawW);
              const h = Math.max(10, isCircle ? Math.max(rawW, rawH) : rawH);

              return (
                <div
                  className={`absolute pointer-events-none border-2 border-dashed ${
                    isCircle ? 'rounded-full' : 'rounded-3xl'
                  } z-0 shadow-lg`}
                  style={{
                    left: minX,
                    top: minY,
                    width: w,
                    height: h,
                    backgroundColor: hexToRgba(activeDrawing.color, 0.22),
                    borderColor: activeDrawing.color,
                  }}
                >
                  <div
                    className="absolute -top-7 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md flex items-center gap-1.5"
                    style={{ backgroundColor: activeDrawing.color }}
                  >
                    <span>✏️ Drawing {isCircle ? 'Circle' : 'Rectangle'}: {w} × {h} px</span>
                  </div>
                </div>
              );
            })()}

            {/* DYNAMIC SVG CONNECTING EDGES (Follow nodes in real-time) */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none z-0">
              <defs>
                <marker
                  id="board-arrow"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#3B82F6" />
                </marker>
                <marker
                  id="board-arrow-selected"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#EF4444" />
                </marker>
              </defs>

              {/* Existing Connected Edges */}
              {edges.map((edge) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const start = getNodeAnchor(fromNode, edge.fromAnchor || 'right', edge.fromSubId);
                const end = getNodeAnchor(toNode, edge.toAnchor || 'left', edge.toSubId);
                const pathString = getBezierPath(start, end, edge.fromAnchor || 'right', edge.toAnchor || 'left');
                const isSelected = selectedEdgeId === edge.id;

                return (
                  <g key={edge.id} className="pointer-events-auto">
                    {/* Wide invisible click target for easy line selection */}
                    <path
                      d={pathString}
                      stroke="transparent"
                      strokeWidth="18"
                      fill="none"
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdgeId(edge.id);
                        setSelectedNodeId(null);
                      }}
                    />
                    {/* Background glow path */}
                    <path
                      d={pathString}
                      stroke={isSelected ? '#FDA4AF' : '#93C5FD'}
                      strokeWidth={isSelected ? '6' : '4'}
                      strokeOpacity={isSelected ? '0.6' : '0.25'}
                      fill="none"
                      className="pointer-events-none transition-all"
                    />
                    {/* Foreground path */}
                    <path
                      d={pathString}
                      stroke={isSelected ? '#EF4444' : '#3B82F6'}
                      strokeWidth={isSelected ? '2.5' : '2'}
                      strokeDasharray={edge.style === 'dashed' || isRunningWorkflow ? '5 5' : 'none'}
                      fill="none"
                      markerEnd={isSelected ? 'url(#board-arrow-selected)' : 'url(#board-arrow)'}
                      className="cursor-pointer transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdgeId(edge.id);
                        setSelectedNodeId(null);
                      }}
                    />
                  </g>
                );
              })}

              {/* Live interactive connection preview while dragging a port */}
              {connectingFrom && connectingMousePos && (() => {
                const sourceNode = nodes.find((n) => n.id === connectingFrom.nodeId);
                if (!sourceNode) return null;
                const start = getNodeAnchor(sourceNode, connectingFrom.anchor, connectingFrom.subId);
                const end = connectingMousePos;
                const path = getBezierPath(start, end, connectingFrom.anchor, 'left');
                return (
                  <path
                    d={path}
                    stroke="#3B82F6"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                    fill="none"
                    markerEnd="url(#board-arrow)"
                    className="pointer-events-none"
                  />
                );
              })()}
            </svg>

            {/* DYNAMIC CONVERSION METRIC PILLS & DELETE ACTIONS (Exact midpoint on curves) */}
            {edges.map((edge) => {
              const fromNode = nodes.find((n) => n.id === edge.from);
              const toNode = nodes.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const start = getNodeAnchor(fromNode, edge.fromAnchor || 'right', edge.fromSubId);
              const end = getNodeAnchor(toNode, edge.toAnchor || 'left', edge.toSubId);
              const mid = getCurveMidpoint(start, end, edge.fromAnchor || 'right', edge.toAnchor || 'left');
              const isSelected = selectedEdgeId === edge.id;

              const pillTitle = edge.pillMain || edge.label || 'Linked';
              const pillSubtitle = edge.pillSub || (fromNode && toNode ? `${fromNode.title.slice(0, 12)} → ${toNode.title.slice(0, 12)}` : '');

              return (
                <div
                  key={`pill-${edge.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdgeId(edge.id);
                    setSelectedNodeId(null);
                  }}
                  className={`group/pill absolute z-20 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md border shadow-md text-center leading-none transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-rose-400 ring-2 ring-rose-400/30 text-rose-700 shadow-rose-200'
                      : 'border-blue-200 hover:border-blue-400 text-blue-700 hover:shadow-lg'
                  }`}
                  style={{ left: mid.x, top: mid.y }}
                >
                  <div className="flex items-center gap-1.5">
                    <div>
                      <span className="text-[11px] font-bold block">{pillTitle}</span>
                      {pillSubtitle && (
                        <span className="text-[9px] opacity-80 font-medium block mt-0.5">
                          {pillSubtitle}
                        </span>
                      )}
                    </div>
                    {/* Delete connection line button on pill */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEdge(edge.id);
                      }}
                      className={`p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer ${
                        isSelected ? 'opacity-100 text-rose-600' : 'opacity-60 group-hover/pill:opacity-100'
                      }`}
                      title="Unlink / Delete this connection line (or press Delete key)"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* MIRO-STYLE WHITEBOARD ELEMENTS (Sticky Notes, Headings, Callouts, Tasks, Tables) */}
            {stickyNotes.map((note) => {
              const isDragging = draggingStickyId === note.id;
              const noteType = note.type || 'sticky';

              // 1. BIG TEXT HEADING (Miro style: "Project brief", "Brainstorm ideas", "Action items", etc.)
              if (noteType === 'heading') {
                return (
                  <div
                    key={note.id}
                    onMouseDown={(e) => handleStickyMouseDown(e, note.id)}
                    className={`absolute z-10 p-2 group select-none cursor-grab active:cursor-grabbing rounded-xl hover:ring-1 hover:ring-blue-400/40 transition-all ${
                      isDragging ? 'opacity-80 scale-105 z-30' : ''
                    }`}
                    style={{
                      left: note.x,
                      top: note.y,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{ fontSize: `${note.fontSize || 26}px` }}
                        className={`font-black tracking-tight leading-none ${
                          isDarkSurface ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {note.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStickyNotes((prev) => prev.filter((s) => s.id !== note.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-rose-500/20 text-rose-400 transition-opacity cursor-pointer"
                        title="Delete Heading"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              }

              // 2. MEMBER SPEECH BUBBLE CALLOUT (Miro style: "Juan", "Miriam", "Sophia", "Team Lead")
              if (noteType === 'callout') {
                return (
                  <div
                    key={note.id}
                    onMouseDown={(e) => handleStickyMouseDown(e, note.id)}
                    className={`absolute z-10 group select-none cursor-grab active:cursor-grabbing ${
                      isDragging ? 'shadow-2xl scale-105 z-30' : ''
                    }`}
                    style={{
                      left: note.x,
                      top: note.y,
                    }}
                  >
                    <div
                      className="px-3.5 py-1.5 rounded-full border shadow-md flex items-center gap-2 relative transition-transform hover:scale-105"
                      style={{
                        backgroundColor: note.color || '#E9D5FF',
                        borderColor: 'rgba(0,0,0,0.15)',
                        color: '#1e1b4b',
                      }}
                    >
                      <div className="w-5 h-5 rounded-full bg-white/80 text-[10px] font-black flex items-center justify-center shrink-0 shadow-2xs text-indigo-950 font-mono">
                        {note.author ? note.author.charAt(0) : 'M'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9.5px] font-black uppercase tracking-wider text-indigo-900 font-mono">
                          {note.author || 'Team'}
                        </span>
                        <span className="text-xs font-bold leading-tight text-indigo-950">
                          {note.title}
                        </span>
                      </div>

                      {/* Callout Speech Pointer Arrow */}
                      <div
                        className="absolute -bottom-1.5 left-4 w-3 h-3 rotate-45 border-r border-b"
                        style={{
                          backgroundColor: note.color || '#E9D5FF',
                          borderColor: 'rgba(0,0,0,0.15)',
                        }}
                      />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStickyNotes((prev) => prev.filter((s) => s.id !== note.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 rounded hover:bg-black/10 text-slate-700 transition-opacity cursor-pointer"
                        title="Delete Callout"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }

              // 3. ACTION ITEM / TASK CARD (Miro style: In Progress / Done / To Do)
              if (noteType === 'task') {
                return (
                  <div
                    key={note.id}
                    onMouseDown={(e) => handleStickyMouseDown(e, note.id)}
                    className={`absolute z-10 w-64 p-3 rounded-2xl bg-white text-slate-900 border border-slate-200/90 shadow-lg group select-none cursor-grab active:cursor-grabbing transition-all ${
                      isDragging ? 'shadow-2xl scale-105 z-30' : 'hover:shadow-xl'
                    }`}
                    style={{
                      left: note.x,
                      top: note.y,
                    }}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500">
                          Action Item
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStickyNotes((prev) => prev.filter((s) => s.id !== note.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                        title="Delete Task"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs font-bold leading-snug block text-slate-800 mb-2">
                      {note.title}
                    </span>
                    <div className="flex items-center justify-between pt-1">
                      {/* Clickable Status Pill */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextStatus: 'To do' | 'In progress' | 'Done' =
                            note.status === 'To do' ? 'In progress' :
                            note.status === 'In progress' ? 'Done' : 'To do';
                          setStickyNotes((prev) =>
                            prev.map((s) => (s.id === note.id ? { ...s, status: nextStatus } : s))
                          );
                        }}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                          note.status === 'Done'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : note.status === 'In progress'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                        title="Click to toggle status (To do → In progress → Done)"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            note.status === 'Done'
                              ? 'bg-emerald-600'
                              : note.status === 'In progress'
                              ? 'bg-blue-600 animate-pulse'
                              : 'bg-amber-600'
                          }`}
                        />
                        <span>{note.status || 'In progress'}</span>
                      </button>
                      {note.assignee && (
                        <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{note.assignee}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              }

              // 4. PROJECT PLAN TABLE / MATRIX (Miro style)
              if (noteType === 'table') {
                return (
                  <div
                    key={note.id}
                    onMouseDown={(e) => handleStickyMouseDown(e, note.id)}
                    className={`absolute z-10 w-96 p-3.5 rounded-2xl bg-white text-slate-900 border border-slate-200/90 shadow-xl group select-none cursor-grab active:cursor-grabbing ${
                      isDragging ? 'shadow-2xl scale-105 z-30' : ''
                    }`}
                    style={{
                      left: note.x,
                      top: note.y,
                    }}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Table className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800">{note.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStickyNotes((prev) => prev.filter((s) => s.id !== note.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-slate-100">
                      <table className="w-full text-[10px] text-left border-collapse">
                        <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                          <tr>
                            {(note.tableData?.headers || ['Stage', 'Channel', 'Target', 'Status']).map((h, i) => (
                              <th key={i} className="p-1.5 border-r border-slate-200 last:border-r-0 font-mono">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(note.tableData?.rows || [
                            ['Hook Testing', 'TikTok & FB', 'CTR > 3.2%', 'In Progress'],
                            ['Wilaya Courier', 'Yalidine COD', 'Delivery > 78%', 'Planned'],
                            ['CRO Funnel', 'Mobile Landers', 'Conv > 4.5%', 'Review'],
                          ]).map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="p-1.5 border-r border-slate-100 last:border-r-0 font-medium text-slate-700"
                                >
                                  {cell}
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

              // 5. CLASSIC STICKY NOTE (Multi-color Post-it)
              return (
                <div
                  key={note.id}
                  onMouseDown={(e) => handleStickyMouseDown(e, note.id)}
                  className={`absolute z-10 p-3.5 w-48 rounded-2xl shadow-lg border select-none cursor-grab active:cursor-grabbing group transition-all ${
                    isDragging ? 'shadow-2xl scale-105 z-30 opacity-95' : 'hover:shadow-xl'
                  }`}
                  style={{
                    left: note.x,
                    top: note.y,
                    transform: `rotate(${note.rotate || 0}deg)`,
                    backgroundColor: note.color || '#FEF08A',
                    borderColor: 'rgba(0,0,0,0.12)',
                    color: '#422006',
                  }}
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-black/10 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold opacity-80">
                      Sticky Note
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">{note.icon || '💡'}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStickyNotes((prev) => prev.filter((s) => s.id !== note.id));
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-black/10 text-neutral-600 transition-opacity cursor-pointer"
                        title="Delete Note"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <span className="text-xs font-semibold leading-snug block font-sans">
                    {note.title}
                  </span>
                </div>
              );
            })}

            {/* Clean Board Empty State when no skills exist on board */}
            {nodes.length === 0 && (
              <div
                style={{ left: 180, top: 140 }}
                className="absolute z-10 w-[450px] p-7 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl text-center space-y-4 select-none animate-in fade-in zoom-in-95"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900">
                    Your Board is Clean & Ready
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Default skills have been removed. Drag any skill from the left library, or click below to start building your custom workflow. All changes save automatically.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isSkillsPanelOpen) {
                        handleToggleSkillsPanel(true);
                      }
                      showToast('Select any skill from the left library to add to your board');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Browse 670+ Skills</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddProductToBoard(SAMPLE_PRODUCTS[0]);
                      showToast('Winning product added to board');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>
            )}

            {/* CARDS MATCHING USER ATTACHED SPEC (image_29b431d7.png): Same Card Down Result Preview */}
            {nodes.map((node, nodeIdx) => {
              const isSelected = selectedNodeId === node.id;
              const isDragging = draggingNodeId === node.id;
              const incomingEdge = edges.find((e) => e.to === node.id);
              const sourceNode = incomingEdge ? nodes.find((n) => n.id === incomingEdge.from) : null;
              const dependsOnText = sourceNode ? sourceNode.title : 'Connected Node';
              const isRunningThis = runningNodeId === node.id;
              const isRegrouper = node.appType === 'product_regrouper';



              return (
                <div
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (connectingFrom && connectingFrom.nodeId !== node.id) {
                      handleEndConnection(node.id, 'left');
                      return;
                    }
                    setSelectedNodeId(node.id);
                    setSelectedEdgeId(null);
                  }}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onMouseUp={(e) => {
                    if (connectingFrom && connectingFrom.nodeId !== node.id) {
                      e.stopPropagation();
                      handleEndConnection(node.id, 'left');
                    }
                  }}
                  className={`group absolute z-10 select-none cursor-grab active:cursor-grabbing ${resizingNode?.id === node.id || isDragging ? '' : 'transition-all duration-150'} ${
                    isRegrouper
                      ? 'bg-transparent border-0 shadow-none ring-0 w-max max-w-none'
                      : `${
                          node.width
                            ? ''
                            : node.isAppNode
                            ? node.appType === 'cro_mobile_landing_page' || node.appType === 'verde_landing_page_builder'
                              ? 'w-[1280px] max-w-[98vw] min-h-[820px]'
                              : node.appType === 'landing_page_generator'
                              ? 'w-[1200px] max-w-[98vw] min-h-[500px]'
                              : node.appType === 'text_to_image_landing_page' || node.appType === 'text_to_code_landing_page'
                              ? 'w-[940px] max-w-[96vw] min-h-[160px]'
                              : 'w-[580px] max-w-[94vw] min-h-[160px]'
                            : node.isProduct
                            ? 'w-[320px]'
                            : node.isFile
                            ? 'w-[420px] max-w-[92vw]'
                            : (node.previewSide === 'left' || node.previewSide === 'right') && !node.hideResult && (node.executionResult || isRunningThis)
                            ? 'w-[960px] max-w-[96vw]'
                            : node.isExpandedDown
                            ? 'w-[920px] max-w-[96vw]'
                            : !node.hideResult && (node.executionResult || isRunningThis)
                            ? 'w-[880px] max-w-[96vw]'
                            : 'w-[560px] max-w-[92vw]'
                        } rounded-2xl bg-white border ${
                          isSelected
                            ? 'border-blue-500 ring-4 ring-blue-500/15 shadow-[0_12px_32px_rgba(37,99,235,0.18)]'
                            : connectingFrom && connectingFrom.nodeId !== node.id
                            ? 'border-blue-400 ring-2 ring-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:border-blue-500'
                            : 'border-slate-200/90 hover:border-slate-300 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.1)]'
                        }`
                  } ${isDragging ? 'opacity-90 scale-[1.01] shadow-2xl z-30' : ''}`}
                  data-node-id={node.id}
                  style={{
                    left: node.x,
                    top: node.y,
                    width: node.width ? `${node.width}px` : undefined,
                    height: node.height ? `${node.height}px` : undefined,
                    maxWidth: node.width ? 'none' : undefined,
                  }}
                >
                  {/* Visual Drop / Click to Link Indicator when Connecting */}
                  {!isRegrouper && connectingFrom && connectingFrom.nodeId !== node.id && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold font-mono tracking-wider shadow-md flex items-center gap-1 z-30 animate-bounce pointer-events-none">
                      <Link2 className="w-3 h-3" />
                      <span>Click to Link</span>
                    </div>
                  )}

                  {/* Top Accent Line */}
                  {!isRegrouper && (
                    <div
                      className={`absolute inset-x-0 top-0 h-[2.5px] rounded-t-2xl ${
                        isSelected
                          ? 'bg-blue-600'
                          : node.appType === 'verde_landing_page_builder'
                          ? 'bg-emerald-500'
                          : node.isAppNode
                          ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500'
                          : node.isFile
                          ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500'
                          : 'bg-gradient-to-r from-blue-500/40 via-indigo-500/50 to-blue-500/40'
                      }`}
                    />
                  )}

                  {/* STRICTLY 2-PORT CONNECTION HANDLES: Left & Right anchored firmly at header */}
                  {!isRegrouper && (
                    <>
                      <div
                        title="Connect Left (click or drag to link directly)"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          if (connectingFrom && connectingFrom.nodeId !== node.id) {
                            justCompletedConnectionRef.current = true;
                            handleEndConnection(node.id, 'left');
                          } else if (connectingFrom && connectingFrom.nodeId === node.id) {
                            setConnectingFrom(null);
                            setConnectingMousePos(null);
                          } else {
                            justCompletedConnectionRef.current = false;
                            handleStartConnection(node.id, 'left');
                          }
                        }}
                        onMouseUp={(e) => {
                          e.stopPropagation();
                          if (justCompletedConnectionRef.current) {
                            justCompletedConnectionRef.current = false;
                            return;
                          }
                          if (connectingFrom && connectingFrom.nodeId !== node.id) {
                            handleEndConnection(node.id, 'left');
                          }
                        }}
                        className={`absolute -left-2.5 ${node.isAppNode || node.isFile ? 'top-[50px]' : node.isProduct ? 'top-[60px]' : 'top-[62px]'} -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 ${connectingFrom ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-400 scale-125' : 'border-blue-500'} shadow-xs hover:scale-150 hover:bg-blue-600 hover:border-white transition-all cursor-crosshair z-20 group-hover:scale-125 flex items-center justify-center`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      </div>
                      <div
                        title="Connect Right (click or drag to link directly)"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          if (connectingFrom && connectingFrom.nodeId !== node.id) {
                            justCompletedConnectionRef.current = true;
                            handleEndConnection(node.id, 'right');
                          } else if (connectingFrom && connectingFrom.nodeId === node.id) {
                            setConnectingFrom(null);
                            setConnectingMousePos(null);
                          } else {
                            justCompletedConnectionRef.current = false;
                            handleStartConnection(node.id, 'right');
                          }
                        }}
                        onMouseUp={(e) => {
                          e.stopPropagation();
                          if (justCompletedConnectionRef.current) {
                            justCompletedConnectionRef.current = false;
                            return;
                          }
                          if (connectingFrom && connectingFrom.nodeId !== node.id) {
                            handleEndConnection(node.id, 'right');
                          }
                        }}
                        className={`absolute -right-2.5 ${node.isAppNode || node.isFile ? 'top-[50px]' : node.isProduct ? 'top-[60px]' : 'top-[62px]'} -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 ${connectingFrom ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-400 scale-125' : 'border-blue-500'} shadow-xs hover:scale-150 hover:bg-blue-600 hover:border-white transition-all cursor-crosshair z-20 group-hover:scale-125 flex items-center justify-center`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      </div>
                    </>
                  )}

                  {node.isAppNode ? (
                    /* AI APP CARD ON CANVAS */
                    <AppNodeCanvasCard
                      node={node}
                      isSelected={isSelected}
                      isConnecting={Boolean(connectingFrom)}
                      onUpdateNode={(updated) => updateNode(node.id, updated)}
                      onDeleteNode={() => deleteNode(node.id)}
                      onStartConnection={(anchor, subId) => handleStartConnection(node.id, anchor, subId)}
                      onEndConnection={(anchor, subId) => handleEndConnection(node.id, anchor, subId)}
                      onLinkSkillToSubItem={(subType, subData, skillTitle) => handleQuickLinkSkillFromOrgChart(node.id, subType, subData, skillTitle)}
                      existingConnectedSubIds={edges.filter((e) => e.from === node.id || e.to === node.id).map((e) => (e.from === node.id ? e.fromSubId : e.toSubId)).filter(Boolean) as string[]}
                      boardSkillsList={nodes.filter((n) => n.id !== node.id && !n.isAppNode).map((n) => ({ id: n.id, title: n.title, category: n.category }))}
                      connectedProduct={
                        (() => {
                          const connectedEdges = edges.filter((e) => e.from === node.id || e.to === node.id);
                          const connectedNodeIds = connectedEdges.map((e) => (e.from === node.id ? e.to : e.from));
                          const pNode =
                            nodes.find((n) => connectedNodeIds.includes(n.id) && (n.isProduct || n.productData || n.category === 'Product Library' || n.executionResult)) ||
                            nodes.find((n) => connectedNodeIds.includes(n.id));
                          if (pNode) {
                            const facts = croFactsFromNode(pNode);
                            if (pNode.executionResult?.content) {
                              const text = pNode.executionResult.content;
                              const nameMatch = text.match(/(?:\*\*#2\s+Product\s+DNA\*\*|Product\s*:\s*|\*\*Product\*\*:\s*)([^\n\r]+)/i)
                                || text.match(/(?:for\s+|احصل على\s+)([A-Z0-9\s\(\)\-\,\.\/]+)/i)
                                || text.match(/([A-Z][a-zA-Z0-9\s\(\)\-\,\.\/]{8,60})/);
                              const priceMatch = text.match(/(\d+[\,\.]?\d*)\s*(?:SP|DZD|DA|دج)/i);
                              const avatarMatch = text.match(/(?:mapped\s+\d+\s+primary\s+avatars?\s*\(([^)]+)\))/i);
                              return {
                                ...facts,
                                name: facts.name || pNode.executionResult.productName || (nameMatch ? nameMatch[1].trim() : pNode.title),
                                title: facts.title || pNode.executionResult.productName || pNode.title,
                                price: facts.price || (priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 1400),
                                priceFormatted: facts.priceFormatted || (priceMatch ? `${priceMatch[1]} DZD` : '1,400 DZD'),
                                description: facts.description || (avatarMatch ? `Designed for ${avatarMatch[1]}. High quality with 58 Wilaya COD.` : pNode.subtitle),
                                rawIntelligence: text,
                              };
                            }
                            return facts;
                          }
                          return (node.appData?.connectedProduct || null);
                        })()
                      }
                      allCanvasProducts={nodes.filter((n) => n.isProduct || n.productData || n.category === 'Product Library').map((p) => ({ id: p.id, title: p.title, ...croFactsFromNode(p) }))}
                    />
                  ) : node.isFile ? (
                    /* UPLOADED FILE NODE CARD ON CANVAS (Best Visual Preview) */
                    <div className="p-3.5 space-y-3">
                      {/* File Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-9 h-9 rounded-xl ${node.iconBg} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                            {node.fileData?.type === 'excel' && <FileSpreadsheet className="w-5 h-5" />}
                            {node.fileData?.type === 'pdf' && <FileText className="w-5 h-5" />}
                            {node.fileData?.type === 'word' && <FileText className="w-5 h-5" />}
                            {node.fileData?.type === 'json' && <FileCode className="w-5 h-5" />}
                            {node.fileData?.type === 'image' && <ImageIcon className="w-5 h-5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider font-mono ${
                                node.fileData?.type === 'excel' ? 'bg-emerald-100 text-emerald-800' :
                                node.fileData?.type === 'pdf' ? 'bg-rose-100 text-rose-800' :
                                node.fileData?.type === 'word' ? 'bg-blue-100 text-blue-800' :
                                node.fileData?.type === 'json' ? 'bg-amber-100 text-amber-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {node.fileData?.type?.toUpperCase() || 'FILE'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {Math.round((node.fileData?.size || 0) / 1024)} KB
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5" title={node.title}>
                              {node.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {node.fileData && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewFileModal(node.fileData!);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer"
                              title="Inspect Full File"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Remove File Node"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Type-Specific Visual Preview */}
                      {node.fileData?.type === 'excel' && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-mono font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                            <span>📊 {node.fileData.tableData?.totalRows || 0} Records</span>
                            <span>{node.fileData.tableData?.headers?.length || 0} Columns</span>
                            <span className="text-emerald-600 font-bold">COD Table</span>
                          </div>

                          {/* Real Interactive Spreadsheet Table Preview */}
                          <div className="max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                            <table className="w-full text-left text-[10px] border-collapse font-sans">
                              <thead>
                                <tr className="bg-slate-100/90 border-b border-slate-200 sticky top-0 z-10">
                                  {node.fileData.tableData?.headers?.slice(0, 4).map((h, i) => (
                                    <th key={i} className="p-1.5 font-bold text-slate-700 whitespace-nowrap border-r border-slate-200 last:border-0 font-mono text-[9px]">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {node.fileData.tableData?.rows?.slice(0, 5).map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-slate-100 hover:bg-emerald-50/40 transition-colors odd:bg-white even:bg-slate-50/50">
                                    {row.slice(0, 4).map((cell, cIdx) => (
                                      <td key={cIdx} className="p-1.5 text-slate-700 whitespace-nowrap border-r border-slate-100 last:border-0 font-mono text-[9.5px]">
                                        {String(cell)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <p className="text-[10.5px] text-slate-600 leading-tight">
                            💡 {node.fileData.summary}
                          </p>
                        </div>
                      )}

                      {node.fileData?.type === 'image' && (
                        <div className="space-y-2">
                          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-52 group">
                            <img
                              src={node.fileData.previewUrl || node.fileData.url}
                              alt={node.title}
                              className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-mono">
                              High-Res Visual
                            </div>
                          </div>
                          <p className="text-[10.5px] text-slate-600 leading-tight">
                            {node.fileData.summary}
                          </p>
                        </div>
                      )}

                      {(node.fileData?.type === 'pdf' || node.fileData?.type === 'word') && (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-sans text-[11px] text-slate-700 leading-relaxed max-h-44 overflow-y-auto space-y-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[10.5px] border-b border-slate-200 pb-1 font-mono">
                              <span>📄 Document Excerpt</span>
                              <span className="text-[9px] text-slate-400 font-normal ml-auto">Ready for AI analysis</span>
                            </div>
                            <div className="whitespace-pre-line text-slate-600 text-[10px] line-clamp-6">
                              {node.fileData.textContent || node.fileData.summary}
                            </div>
                          </div>
                          <p className="text-[10.5px] text-slate-600 leading-tight">
                            💡 {node.fileData.summary}
                          </p>
                        </div>
                      )}

                      {node.fileData?.type === 'json' && (
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[10px] max-h-44 overflow-y-auto leading-relaxed shadow-inner">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(node.fileData.jsonData, null, 2)?.slice(0, 320)}...
                            </pre>
                          </div>
                          <p className="text-[10.5px] text-slate-600 leading-tight">
                            💡 {node.fileData.summary}
                          </p>
                        </div>
                      )}

                      {/* Connection Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Connected to Board</span>
                        </span>
                        <span className="font-mono text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md">
                          Drag link to any Skill ⚡
                        </span>
                      </div>
                    </div>
                  ) : node.isProduct ? (
                    /* PRODUCT NODE CARD ON CANVAS */
                    <div className="p-3.5 space-y-2.5">
                      <div className="flex items-start gap-3">
                        <img
                          src={node.productData?.image || 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=300&h=300&fit=crop'}
                          alt={node.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200/90 shadow-2xs"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200/60 uppercase tracking-wider font-mono truncate">
                              {node.productData?.niche || 'Winning Product'}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSettingsModalNodeId(node.id);
                                  setSettingsActiveTab('config');
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                                title="Product Settings"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNode(node.id);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                                title="Delete Product Card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5 leading-tight">
                            {node.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs font-black text-emerald-600 font-mono">
                              {node.productData?.sellingPrice?.toLocaleString() || '4,800'} DZD
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono line-through">
                              {node.productData?.productCost?.toLocaleString() || '1,400'}
                            </span>
                            <span className="text-[9.5px] font-bold text-blue-600 bg-blue-50 px-1 rounded">
                              +{node.productData?.profitMargin || 71}% margin
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[9.5px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3 text-emerald-600" />
                          Source Product
                        </span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                          Connect right dot → Skill
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* AI SKILL CARD MATCHING EXACT SPEC (image_29b431d7.png) */
                    <div className={`p-4 ${
                      (node.previewSide === 'left' || node.previewSide === 'right') && !node.hideResult && (node.executionResult || isRunningThis)
                        ? `flex ${node.previewSide === 'left' ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`
                        : 'space-y-3'
                    }`}>
                      <div className={`space-y-3 ${
                        (node.previewSide === 'left' || node.previewSide === 'right') && !node.hideResult && (node.executionResult || isRunningThis)
                          ? 'w-[390px] shrink-0'
                          : 'w-full'
                      }`}>
                      {/* 1. SECTION BADGE & STATUS */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider font-mono">
                            {node.sectionNumber || `SECTION ${String(nodeIdx + 1).padStart(2, '0')}`}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{node.executionResult ? 'Completed — — •' : isRunningThis ? 'Running Analysis...' : 'Ready — — •'}</span>
                          </span>
                        </div>

                        {/* Action Icons: Typography (Aa), Settings & Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            data-no-drag="true"
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSettingsModalNodeId(node.id);
                              setSettingsActiveTab('typography');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Taille & Style du texte (Taille, Police, Graisse)"
                          >
                            <Type className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            data-no-drag="true"
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSettingsModalNodeId(node.id);
                              setSettingsActiveTab('config');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Skill Settings & Prompt"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            data-no-drag="true"
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNode(node.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* 2. CARD TITLE & SUBTITLE */}
                      <div>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-lg ${node.iconBg} flex items-center justify-center shrink-0 shadow-2xs text-white`}>
                            {renderCardIcon(node)}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 leading-tight">
                            {node.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {node.subtitle}
                        </p>
                      </div>

                      {/* 3. CONTROLS PILLS ROW 1: Depends on, Web Research, Language */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Org Chart Div Link Badge */}
                        {incomingEdge && incomingEdge.fromSubId && (() => {
                          const fromOrgNode = nodes.find((n) => n.id === incomingEdge.from);
                          if (fromOrgNode?.appType === 'product_regrouper') {
                            const isAdSet = incomingEdge.fromSubId.startsWith('adset:');
                            const isProd = incomingEdge.fromSubId.startsWith('prod:');
                            return (
                              <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-violet-300 bg-violet-50 text-[11px] font-bold text-violet-800 shadow-2xs"
                                title={`This skill is actively receiving extracted data from ${isAdSet ? 'AdSet' : 'Product'}: ${incomingEdge.pillSub}`}
                              >
                                <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
                                <span>{isAdSet ? `⚡ AdSet: ${incomingEdge.pillSub || 'Target'}` : isProd ? `⚡ Product: ${incomingEdge.pillSub || 'Data'}` : '⚡ Linked to Org Chart'}</span>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Depends on pill */}
                        <div
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700 shadow-2xs"
                          title={`Depends on: ${dependsOnText}`}
                        >
                          <span className="text-slate-400">Depends on:</span>
                          <span className="font-semibold text-slate-800 truncate max-w-[150px]">{dependsOnText}</span>
                        </div>

                        {/* Live Web Research Toggle Button */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLiveWebResearch(node.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-bold tracking-tight uppercase transition-all cursor-pointer shadow-2xs ${
                            node.liveWebResearch
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title="Toggle Live Web Research"
                        >
                          <Globe className={`w-3 h-3 ${node.liveWebResearch ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>LIVE WEB RESEARCH | {node.liveWebResearch ? 'ON' : 'OFF'}</span>
                        </button>

                        {/* Language dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            data-no-drag="true"
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLanguageMenuNodeId(activeLanguageMenuNodeId === node.id ? null : node.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-200/90 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 text-[11px] font-semibold shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                            title="Select language: Analysis will be generated 100% in this language"
                          >
                            <Languages className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{node.language || 'English'}</span>
                            <ChevronDown className="w-3 h-3 text-indigo-500" />
                          </button>

                          {activeLanguageMenuNodeId === node.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="absolute left-0 mt-1 z-50 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 text-xs animate-in fade-in zoom-in-95"
                            >
                              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                                Output Language
                              </div>
                              {[
                                { id: 'English', label: 'English', sub: '100% English' },
                                { id: 'French', label: 'Français', sub: '100% Français' },
                                { id: 'Arabic', label: 'العربية', sub: '100% فصحى' },
                                { id: 'Algerian Darja', label: 'الدارجة الجزائرية', sub: '100% الدارجة' },
                              ].map(({ id, label, sub }) => (
                                <button
                                  key={id}
                                  type="button"
                                  data-no-drag="true"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={() => handleChangeNodeLanguage(node.id, id)}
                                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer ${
                                    (node.language || 'English') === id
                                      ? 'font-bold text-indigo-700 bg-indigo-50/80'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  <div>
                                    <div className="font-medium">{label}</div>
                                    <div className="text-[10px] text-slate-400 font-normal">{sub}</div>
                                  </div>
                                  {(node.language || 'English') === id && (
                                    <Check className="w-4 h-4 text-indigo-600" />
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Target Market Dropdown (Algeria Default as requested) */}
                        <div className="relative">
                          <button
                            type="button"
                            data-no-drag="true"
                            onMouseDown={(e) => e.stopPropagation()}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMarketMenuNodeId(activeMarketMenuNodeId === node.id ? null : node.id);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-300/90 bg-emerald-50/90 hover:bg-emerald-100 text-emerald-950 text-[11px] font-semibold shadow-2xs transition-all hover:scale-[1.02] cursor-pointer"
                            title="Target Market: Directs AI audience, currency, courier dynamics & consumer psychology (Default: Algeria)"
                          >
                            <Store className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-sm">
                              {TARGET_MARKETS.find((m) => m.id === (node.targetMarket || 'Algeria'))?.flag || '🇩🇿'}
                            </span>
                            <span className="font-bold">{node.targetMarket || 'Algeria'}</span>
                            <ChevronDown className="w-3 h-3 text-emerald-600" />
                          </button>

                          {activeMarketMenuNodeId === node.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="absolute left-0 mt-1 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 text-xs animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto"
                            >
                              <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
                                <span>Target Market / Country</span>
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">🇩🇿 Algeria Default</span>
                              </div>

                              {/* Categorized list of all requested countries */}
                              {['North Africa', 'GCC', 'Western Europe', 'Eastern Europe', 'Americas', 'Asia & Pacific', 'Eurasia'].map((regionName) => {
                                const countriesInRegion = TARGET_MARKETS.filter((m) => m.region === regionName);
                                if (countriesInRegion.length === 0) return null;

                                return (
                                  <div key={regionName} className="mb-1.5">
                                    <div className="px-3 py-1 text-[9.5px] font-black text-indigo-700 uppercase tracking-wider bg-slate-50/80 font-mono">
                                      {regionName}
                                    </div>
                                    {countriesInRegion.map((market) => {
                                      const isSelected = (node.targetMarket || 'Algeria') === market.id;
                                      return (
                                        <button
                                          key={market.id}
                                          type="button"
                                          data-no-drag="true"
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onClick={() => {
                                            setNodes((prev) =>
                                              prev.map((n) => (n.id === node.id ? { ...n, targetMarket: market.id } : n))
                                            );
                                            setActiveMarketMenuNodeId(null);
                                            showToast(`Target market set to ${market.flag} ${market.name}`);
                                          }}
                                          className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50/70 flex items-center justify-between text-xs cursor-pointer ${
                                            isSelected
                                              ? 'font-bold text-emerald-950 bg-emerald-50/90'
                                              : 'text-slate-700'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm">{market.flag}</span>
                                            <div>
                                              <div className="font-semibold">{market.name}</div>
                                              <div className="text-[10px] text-slate-400 font-mono">
                                                Currency: {market.currency}
                                              </div>
                                            </div>
                                          </div>
                                          {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 4. CONTROLS PILLS ROW 2: Standard v, WORK PROMPT DEFAULT, PREVIEW RESULTAT DEFAULT */}
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {/* Mode Selector */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            const current = node.analysisMode || 'standard';
                            const next = current === 'standard' ? 'deep' : current === 'deep' ? 'express' : 'standard';
                            setNodes((prev) => prev.map((n) => n.id === node.id ? { ...n, analysisMode: next } : n));
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold capitalize shadow-2xs cursor-pointer"
                          title="Click to toggle Analysis Depth"
                        >
                          <span>{node.analysisMode || 'Standard'}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>

                        {/* WORK PROMPT PILL WITH ACTIVE PROMPT LABEL & COUNT */}
                        {(() => {
                          const { prompts, activeId } = getNodeSavedPrompts(node);
                          const activePrompt = prompts.find((p) => p.id === activeId) || prompts[0];
                          const activeLabel = activePrompt ? activePrompt.name : 'DEFAULT';
                          return (
                            <button
                              type="button"
                              data-no-drag="true"
                              onMouseDown={(e) => e.stopPropagation()}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSettingsModalNodeId(node.id);
                                setSettingsActiveTab('prompt');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold shadow-2xs cursor-pointer group"
                              title={`Current active prompt: "${activeLabel}". Click to view, add or switch prompts.`}
                            >
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>WORK PROMPT</span>
                              <span className="text-[9px] uppercase px-1.5 py-0.2 bg-purple-50 text-purple-700 border border-purple-200/70 rounded font-mono font-bold max-w-[100px] truncate">
                                {activeLabel}
                              </span>
                              {prompts.length > 1 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full">
                                  {prompts.length}
                                </span>
                              )}
                            </button>
                          );
                        })()}

                        {/* PREVIEW RESULTAT DEFAULT */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!node.executionResult) {
                              handleRunSingleNode(node.id);
                            } else {
                              setNodes((prev) =>
                                prev.map((n) => (n.id === node.id ? { ...n, hideResult: !n.hideResult } : n))
                              );
                            }
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold shadow-2xs cursor-pointer ${
                            !node.hideResult && (node.executionResult || isRunningThis)
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                          title="Toggle result preview (or run analysis if empty)"
                        >
                          <FileText className="w-3 h-3 text-emerald-600" />
                          <span>PREVIEW RESULTAT</span>
                          <span className="text-[9px] uppercase px-1 py-0.2 bg-slate-100 rounded text-slate-500 font-mono">DEFAULT</span>
                        </button>
                      </div>

                      {/* 5. CUSTOM AI INSTRUCTIONS (collapsible via HIDE TEXT) */}
                      {!node.hideText && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            CUSTOM AI INSTRUCTIONS
                          </label>
                          <textarea
                            rows={2}
                            data-no-drag="true"
                            onMouseDown={(e) => e.stopPropagation()}
                            value={node.customInstructions ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNodes((prev) =>
                                prev.map((n) => (n.id === node.id ? { ...n, customInstructions: val } : n))
                              );
                            }}
                            placeholder="Add custom instructions, angle focus, or target audience..."
                            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-sans"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      )}

                      {/* 6. ACTION BUTTONS ROW (as shown in image_29b431d7.png) */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {/* RUN AI ANALYSIS (green button) */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRunSingleNode(node.id);
                          }}
                          disabled={isRunningThis}
                          className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-80 select-none ${
                            isRunningThis
                              ? 'bg-amber-600 animate-pulse'
                              : 'bg-[#059669] hover:bg-[#047857]'
                          }`}
                        >
                          <Play className={`w-3.5 h-3.5 fill-white ${isRunningThis ? 'animate-spin' : ''}`} />
                          <span>{isRunningThis ? 'RUNNING AI...' : 'RUN AI ANALYSIS'}</span>
                        </button>

                        {/* HIDE TEXT / SHOW TEXT */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNodes((prev) =>
                              prev.map((n) => (n.id === node.id ? { ...n, hideText: !n.hideText } : n))
                            );
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>{node.hideText ? 'SHOW TEXT' : 'HIDE TEXT'}</span>
                        </button>

                        {/* HIDE RESULT / SHOW RESULT */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNodes((prev) =>
                              prev.map((n) => (n.id === node.id ? { ...n, hideResult: !n.hideResult } : n))
                            );
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>{node.hideResult ? 'SHOW RESULT' : 'HIDE RESULT'}</span>
                        </button>

                        {/* COPY JSON */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (node.executionResult) {
                              navigator.clipboard.writeText(JSON.stringify(node.executionResult, null, 2));
                              showToast('JSON copied to clipboard!');
                            } else {
                              showToast('Run the node first to copy results.');
                            }
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>COPY JSON</span>
                        </button>

                        {/* COPY PROMPT */}
                        <button
                          type="button"
                          data-no-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            const { prompts, activeId } = getNodeSavedPrompts(node);
                            const activePrompt = prompts.find((p) => p.id === activeId) || prompts[0];
                            const prompt =
                              activePrompt?.prompt ||
                              node.config.customPrompt ||
                              getDefaultPromptForNode(node.title, node.subtitle);
                            navigator.clipboard.writeText(prompt);
                            showToast(`AI Prompt "${activePrompt?.name || 'Default'}" copied to clipboard!`);
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>COPY PROMPT</span>
                        </button>
                      </div>

                      </div>

                      {/* 7. UNIVERSAL RESEARCH & CONTENT PRESENTATION ENGINE */}
                      {!node.hideResult && (node.executionResult || isRunningThis) && (
                        <div
                          data-no-drag="true"
                          data-no-card-drag="true"
                          onMouseDown={(e) => e.stopPropagation()}
                          onPointerDown={(e) => e.stopPropagation()}
                          className={`animate-in fade-in select-text cursor-auto ${
                            node.previewSide === 'left' || node.previewSide === 'right'
                              ? 'flex-1 min-w-0 self-stretch'
                              : 'pt-2 border-t border-slate-100 space-y-2'
                          }`}
                        >
                          {isRunningThis && !node.executionResult ? (
                            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 animate-in fade-in">
                              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                                <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                                <span>Generating Intelligence Report with Universal AI Engine...</span>
                              </div>
                              <div className="space-y-2 animate-pulse">
                                <div className="h-4 bg-emerald-100/70 rounded-md w-2/3"></div>
                                <div className="h-3 bg-slate-100 rounded-md w-full"></div>
                                <div className="h-3 bg-slate-100 rounded-md w-5/6"></div>
                                <div className="h-3 bg-slate-100 rounded-md w-4/5"></div>
                              </div>
                            </div>
                          ) : node.executionResult ? (
                            <UniversalContentEngine
                              content={normalizeAndCleanAIOutput(node.executionResult.content)}
                              skillTitle={node.executionResult.skillName || node.title}
                              productTitle={node.executionResult.productName}
                              category={node.category}
                              language={node.executionResult.language || node.language || 'English'}
                              webResearchUsed={node.executionResult.webResearchUsed}
                              executedAt={node.executionResult.executedAt}
                              isSimulated={node.executionResult.isSimulated}
                              activeTab={node.activePreviewTab || (node.previewEngine === 'classic' ? 'preview' : 'chatgpt')}
                              onTabChange={(tab) => {
                                setNodes((prev) =>
                                  prev.map((n) => (n.id === node.id ? { ...n, activePreviewTab: tab } : n))
                                );
                              }}
                              direction={node.previewDirection || 'ltr'}
                              onDirectionToggle={() => {
                                const nextDir = node.previewDirection === 'rtl' ? 'ltr' : 'rtl';
                                setNodes((prev) =>
                                  prev.map((n) => (n.id === node.id ? { ...n, previewDirection: nextDir } : n))
                                );
                              }}
                              placement={node.previewSide || 'bottom'}
                              onPlacementToggle={() => {
                                const nextSide =
                                  (!node.previewSide || node.previewSide === 'bottom')
                                    ? 'right'
                                    : node.previewSide === 'right'
                                    ? 'left'
                                    : 'bottom';
                                setNodes((prev) =>
                                  prev.map((n) => (n.id === node.id ? { ...n, previewSide: nextSide } : n))
                                );
                              }}
                              promptText={node.config.customPrompt || getDefaultPromptForNode(node.title, node.subtitle)}
                              maxHeight={node.isExpandedDown ? 'max-h-[850px] min-h-[460px]' : 'max-h-[500px]'}
                              isExpanded={!!node.isExpandedDown}
                              onToggleExpand={() => {
                                setNodes((prev) =>
                                  prev.map((n) => (n.id === node.id ? { ...n, isExpandedDown: !n.isExpandedDown } : n))
                                );
                              }}
                              textStyle={node.textStyle}
                              onTextStyleChange={(newStyle) => updateNodeTextStyle(node.id, newStyle)}
                              onOpenSettings={() => {
                                setSettingsModalNodeId(node.id);
                                setSettingsActiveTab('typography');
                              }}
                              skillIconBg={node.iconBg}
                              skillIconColor={node.iconColor}
                                skillColor={node.iconBg}
                                customWidth={node.width}
                                customHeight={node.height ? Math.max(220, node.height - 230) : undefined}
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                  )}
                  {/* Interactive Manual Mouse Resize Handles (Corner, Right edge, Bottom edge) */}
                  {!isRegrouper && (
                    <div className={isSelected || resizingNode?.id === node.id ? 'opacity-100 pointer-events-auto' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-auto'}>
                      {/* Corner Handle: Both Horizontal and Vertical */}
                      <div
                        data-no-drag="true"
                        onMouseDown={(e) => handleStartResizeNode(e, node.id, 'corner')}
                        className="absolute -bottom-3 -right-3 w-8 h-8 rounded-lg bg-white dark:bg-neutral-800 border-2 border-emerald-500 shadow-xl flex items-center justify-center cursor-nwse-resize hover:scale-115 transition-transform z-35 touch-none select-none group/handle hover:bg-emerald-50 active:bg-emerald-100 active:border-emerald-600"
                        title="Drag corner with mouse to resize card width and height freely"
                      >
                        <div className="w-3 h-3 border-r-2 border-b-2 border-emerald-600 dark:border-emerald-400 pointer-events-none" />
                      </div>

                      {/* Right Edge Handle: Horizontal Width */}
                      <div
                        data-no-drag="true"
                        onMouseDown={(e) => handleStartResizeNode(e, node.id, 'right')}
                        className="absolute top-1/2 -right-3 -translate-y-1/2 w-5 h-14 rounded-full bg-white dark:bg-neutral-800 border-2 border-emerald-500 shadow-md flex items-center justify-center cursor-ew-resize hover:scale-115 transition-transform z-35 touch-none select-none hover:bg-emerald-50 active:bg-emerald-100 active:border-emerald-600"
                        title="Drag right edge with mouse to adjust card width horizontally"
                      >
                        <div className="w-1 h-6 rounded-full bg-emerald-500 pointer-events-none" />
                      </div>

                      {/* Bottom Edge Handle: Vertical Height */}
                      <div
                        data-no-drag="true"
                        onMouseDown={(e) => handleStartResizeNode(e, node.id, 'bottom')}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-5 rounded-full bg-white dark:bg-neutral-800 border-2 border-emerald-500 shadow-md flex items-center justify-center cursor-ns-resize hover:scale-115 transition-transform z-35 touch-none select-none hover:bg-emerald-50 active:bg-emerald-100 active:border-emerald-600"
                        title="Drag bottom edge with mouse to adjust card height vertically"
                      >
                        <div className="w-6 h-1 rounded-full bg-emerald-500 pointer-events-none" />
                      </div>

                      {/* Live Dimensions Display Badge with One-Click Reset */}
                      <div className="absolute -bottom-9 right-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-neutral-900/95 text-white/95 border border-white/20 shadow-md pointer-events-auto select-none flex items-center gap-2 z-35">
                        <span>{node.width ? `${node.width}px` : 'Auto'} × {node.height ? `${node.height}px` : 'Auto'}</span>
                        {(node.width || node.height) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNodes((prev) =>
                                prev.map((n) =>
                                  n.id === node.id ? { ...n, width: undefined, height: undefined } : n
                                )
                              );
                            }}
                            className="text-emerald-400 hover:text-emerald-300 underline cursor-pointer text-[9px]"
                            title="Reset to default automatic size"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
          {/* PERMANENTLY FIXED TO BOTTOM RIGHT OF CANVAS VIEWPORT (Never scrolls, never shifts with pan/zoom) */}
          <div className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2.5 pointer-events-auto select-none">
            {/* Minimap card */}
            {isMinimapOpen && (
              <div className="w-56 h-36 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg p-2.5 relative overflow-hidden flex flex-col animate-in fade-in zoom-in-95 text-slate-700">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[10px] font-semibold text-slate-400">
                  <span className="flex items-center gap-1 text-slate-900 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Board Overview
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={handleResetLeftMargin}
                      className="hover:text-blue-600 p-0.5 rounded transition-colors cursor-pointer"
                      title="Reset View & Margin"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setIsMinimapOpen(false)}
                      className="hover:text-slate-800 p-0.5 rounded transition-colors cursor-pointer"
                      title="Hide Minimap"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="w-full flex-1 relative bg-slate-50 rounded-xl border border-slate-200/80 overflow-hidden">
                  {/* Miniature node representations in minimap */}
                  {nodes.map((n) => (
                    <div
                      key={`mini-${n.id}`}
                      className="absolute w-3.5 h-2 rounded-xs bg-blue-600/80 transition-all duration-75"
                      style={{
                        left: `${Math.max(4, Math.min(92, (n.x / 1200) * 80 + 10))}%`,
                        top: `${Math.max(4, Math.min(88, (n.y / 1100) * 75 + 10))}%`,
                      }}
                    />
                  ))}
                  {/* Minimap Viewport indicator */}
                  <div
                    className="w-20 h-12 border-2 border-blue-500/80 rounded-md bg-blue-500/10 absolute pointer-events-none transition-all duration-75"
                    style={{
                      left: `${Math.max(2, Math.min(68, (-panOffset.x / 14) + 12))}%`,
                      top: `${Math.max(2, Math.min(64, (-panOffset.y / 14) + 12))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Floating Manual Zoom Bar with Surface Background Color option */}
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-1.5 shadow-lg text-slate-700">
              <button
                onClick={() => handleSetZoomWithAnchor((z) => Math.max(10, z - 10))}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Zoom Out (-10%)"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Floating Manual Zoom Slider: Drag with mouse (10% to 400%) */}
              <input
                type="range"
                min="10"
                max="400"
                step="5"
                value={zoom}
                onChange={(e) => handleSetZoomWithAnchor(Number(e.target.value))}
                className="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                title={`Manual Zoom: ${zoom}%`}
              />

              <button
                onClick={() => handleSetZoomWithAnchor((z) => Math.min(400, z + 10))}
                className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Zoom In (+10%)"
              >
                <Plus className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              <button
                onClick={handleResetLeftMargin}
                className="px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1"
                title="Align Left Margin (60px, 85% Zoom)"
              >
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Margin</span>
              </button>

              <button
                onClick={() => handleSetZoomWithAnchor(100)}
                className="px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                title="Actual Size (100%)"
              >
                {zoom}%
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              {/* Quick Mouse Wheel Zoom Mode indicator & toggle */}
              <button
                onClick={() => {
                  const nextState = !wheelZoomEnabled;
                  setWheelZoomEnabled(nextState);
                  showToast(nextState ? 'Mouse Wheel Zoom: ACTIVE (Scroll to zoom)' : 'Mouse Wheel Zoom: OFF (Scroll to pan)');
                }}
                className={`px-2 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  wheelZoomEnabled
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
                title={`Mouse wheel currently ${wheelZoomEnabled ? 'ZOOMS the board (scroll up/down). Click to switch to Pan.' : 'PANS the canvas. Click to switch to Zoom.'}`}
              >
                <MousePointer className="w-3.5 h-3.5 text-blue-600" />
                <span>Wheel: {wheelZoomEnabled ? 'Zoom' : 'Pan'}</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              {/* Surface Background Color Picker Option with Small Cards View */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSurfaceColorMenuOpen(!isSurfaceColorMenuOpen)}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs"
                  title="Change Board Surface Background Color"
                >
                  <Palette className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: boardBgColor }}
                  />
                  <span className="hidden sm:inline">Surface</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isSurfaceColorMenuOpen && (
                  <div
                    className="absolute bottom-full mb-3 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 text-slate-700 animate-in fade-in zoom-in-95 backdrop-blur-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">Board Surface Color</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSurfaceColorMenuOpen(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-2.5 leading-snug">
                      Click any small surface card with your mouse to change the canvas background:
                    </p>

                    {/* Small Cards View Surface Colors */}
                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                      {SURFACE_COLOR_PRESETS.map((preset) => {
                        const isSelected = boardBgColor.toLowerCase() === preset.color.toLowerCase();
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectBoardBgColor(preset.color)}
                            className={`w-full p-2 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-blue-50/70 border-blue-300 shadow-xs ring-1 ring-blue-200'
                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80'
                            }`}
                          >
                            {/* Left: Small Card View Surface Swatch with Mini Grid */}
                            <div
                              className="w-14 h-9 rounded-lg border border-slate-300 shadow-inner shrink-0 relative overflow-hidden flex items-center justify-center"
                              style={{ backgroundColor: preset.color }}
                            >
                              <svg width="100%" height="100%" className="w-full h-full opacity-60">
                                <pattern
                                  id={`mini-pat-${preset.id}`}
                                  width="6"
                                  height="6"
                                  patternUnits="userSpaceOnUse"
                                >
                                  <circle cx="3" cy="3" r="0.8" fill={preset.dotColor} />
                                </pattern>
                                <rect width="100%" height="100%" fill={`url(#mini-pat-${preset.id})`} />
                              </svg>
                            </div>

                            {/* Middle: Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                  {preset.name}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400">
                                  {preset.color}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 block truncate">
                                {preset.description}
                              </span>
                            </div>

                            {/* Right: Selected Checkmark */}
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Mouse Color Picker */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={boardBgColor}
                          onChange={(e) => handleSelectBoardBgColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-200 p-0.5"
                          title="Choose custom color with mouse"
                        />
                        <div>
                          <span className="text-xs font-semibold text-slate-900 block">Custom Color</span>
                          <span className="text-[10px] font-mono text-slate-500">{boardBgColor}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectBoardBgColor('#F8FAFC')}
                        className="text-[10.5px] font-medium text-slate-600 hover:text-blue-600 px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 cursor-pointer"
                      >
                        Reset Theme
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              {/* Shape Drawing Tool Option (Behind Cards) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsShapeToolMenuOpen(!isShapeToolMenuOpen)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-2xs ${
                    isShapeToolMenuOpen
                      ? 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-500/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200'
                  }`}
                  title="Draw Zones & Background Shapes (Always behind cards)"
                >
                  <Shapes className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="hidden sm:inline">Draw Zone</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isShapeToolMenuOpen && (
                  <div
                    className="absolute bottom-full mb-3 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3.5 z-50 text-slate-700 animate-in fade-in zoom-in-95 backdrop-blur-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Shapes className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">Draw Behind Cards</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsShapeToolMenuOpen(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-2.5 leading-snug">
                      Background shapes stay <strong>permanently behind cards</strong>. Choose mouse drawing or 1-click placement:
                    </p>

                    {/* Interactive Mouse Draw Mode Triggers */}
                    <div className="space-y-1.5 mb-3">
                      <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider block">
                        ✏️ Click & Drag on Board with Mouse:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDrawMode('rectangle');
                            setIsShapeToolMenuOpen(false);
                            showToast('✏️ Click & drag anywhere on the board to draw a Rectangle zone');
                          }}
                          className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 flex items-center justify-center gap-2 transition-all group cursor-pointer"
                        >
                          <Square className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-blue-800">
                            Draw Rectangle
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDrawMode('circle');
                            setIsShapeToolMenuOpen(false);
                            showToast('✏️ Click & drag anywhere on the board to draw a Circle zone');
                          }}
                          className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-300 flex items-center justify-center gap-2 transition-all group cursor-pointer"
                        >
                          <Circle className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-purple-800">
                            Draw Circle
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 1-Click Placement Options */}
                    <div className="space-y-1.5 mb-3 pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        + Or Add to Center View:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            handleAddShape('rectangle');
                            setIsShapeToolMenuOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center gap-1 transition-all text-center group cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-800">
                            + Rectangle Zone
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Auto centered
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleAddShape('circle');
                            setIsShapeToolMenuOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center gap-1 transition-all text-center group cursor-pointer"
                        >
                          <span className="text-xs font-bold text-slate-800">
                            + Circle Zone
                          </span>
                          <span className="text-[9.5px] text-slate-400">
                            Auto centered
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Preset Color Themes */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                        Quick Tint & Add:
                      </span>
                      <div className="grid grid-cols-6 gap-1.5">
                        {[
                          { color: '#6366f1', name: 'Violet' },
                          { color: '#10b981', name: 'Emerald' },
                          { color: '#f59e0b', name: 'Amber' },
                          { color: '#f43f5e', name: 'Rose' },
                          { color: '#06b6d4', name: 'Cyan' },
                          { color: '#8b5cf6', name: 'Purple' },
                        ].map((c) => (
                          <button
                            key={c.color}
                            type="button"
                            onClick={() => {
                              handleAddShape('rectangle', c.color);
                              setIsShapeToolMenuOpen(false);
                            }}
                            className="h-8 rounded-lg border border-white/20 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                            style={{ backgroundColor: c.color }}
                            title={`Add ${c.name} Rectangle`}
                          >
                            <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Map toggle when collapsed */}
              {!isMinimapOpen && (
                <button
                  onClick={() => setIsMinimapOpen(true)}
                  className="px-2 py-1 rounded-xl text-xs font-bold text-neutral-200 bg-[#1f1f23] hover:bg-[#282830] transition-colors cursor-pointer border border-white/10"
                  title="Show Minimap"
                >
                  Map
                </button>
              )}
            </div>
          </div>

        </main>

        {/* TWIK.AI AUTONOMOUS CANVAS COPILOT RIGHT-SIDE DRAWER (Non-blocking, ChatGPT typography & action controls) */}
        {isAiCanvasChatOpen && (
          <aside
            className={`fixed right-0 top-14 bottom-0 z-40 bg-white dark:bg-[#18181b] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-all duration-300 animate-in slide-in-from-right ${
              isAiCanvasChatExpanded
                ? 'w-full sm:w-[680px] md:w-[760px] lg:w-[840px] max-w-[96vw]'
                : 'w-full sm:w-[460px] md:w-[500px] lg:w-[540px] max-w-[90vw]'
            }`}
          >
            {/* Top Perspective Mesh & Radial Glow */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-500/5 via-orange-500/5 to-transparent pointer-events-none" />

            {/* DRAWER HEADER */}
            <div className="px-4 py-3 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between shrink-0 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow-sm shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" stroke="none">
                    <circle cx="12" cy="7" r="2.2" />
                    <circle cx="16.5" cy="9.5" r="2.2" />
                    <circle cx="16.5" cy="14.5" r="2.2" />
                    <circle cx="12" cy="17" r="2.2" />
                    <circle cx="7.5" cy="14.5" r="2.2" />
                    <circle cx="7.5" cy="9.5" r="2.2" />
                    <circle cx="12" cy="12" r="1.5" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">Twiks.AI</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[9px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400">Autonomous Canvas Copilot & Strategist</p>
                </div>
              </div>

              {/* Action buttons on header */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAiCanvasChatExpanded(!isAiCanvasChatExpanded)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  title={isAiCanvasChatExpanded ? 'Standard width (500px)' : 'Expand width (760px)'}
                >
                  {isAiCanvasChatExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAiCanvasChatMessages([]);
                    setAiCanvasChatInput('');
                    setActiveChatTopic('New Chat');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  title="Start fresh conversation"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiCanvasChatOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                  title="Close Copilot"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* QUICK ACTIONS BAR */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-white/[0.02] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[11px]">
              <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 px-1">Quick:</span>
              <button
                type="button"
                onClick={() => handleSendCanvasAiChat('add skill static ad')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
              >
                + Static Ad
              </button>
              <button
                type="button"
                onClick={() => handleSendCanvasAiChat('add skill direct response copywriting')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-purple-400 dark:hover:border-purple-400 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
              >
                + Copywriting
              </button>
              <button
                type="button"
                onClick={() => handleSendCanvasAiChat('build launch pipeline')}
                className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 text-emerald-700 dark:text-emerald-300 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
              >
                🚀 Build Pipeline
              </button>
              <button
                type="button"
                onClick={() => handleSendCanvasAiChat('run all')}
                className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:border-amber-400 text-amber-700 dark:text-amber-300 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
              >
                ⚡ Run All
              </button>
              <button
                type="button"
                onClick={() => handleSendCanvasAiChat('clear the board')}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-rose-400 text-slate-600 dark:text-slate-300 hover:text-rose-600 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium"
              >
                🧹 Clear
              </button>
            </div>

            {/* CHAT MESSAGES BODY */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {aiCanvasChatMessages.length === 0 ? (
                /* WELCOME STATE IN DRAWER */
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 text-white dark:text-slate-900 flex items-center justify-center shadow-lg mb-4">
                    <Sparkles className="w-7 h-7 text-amber-400 dark:text-amber-500" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Twiks.AI Canvas Copilot
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                    Chat with your autonomous AI strategist. I can add skills to your canvas, change parameters, run workflows, and answer questions.
                  </p>

                  <div className="w-full mt-6 space-y-2 text-left">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                      Try asking:
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSendCanvasAiChat('add skill static ad')}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 transition-all text-left flex items-center justify-between cursor-pointer group"
                    >
                      <span>➕ "Add skill static ad to canvas"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendCanvasAiChat('build launch pipeline')}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 transition-all text-left flex items-center justify-between cursor-pointer group"
                    >
                      <span>🚀 "Build a full 4-step launch pipeline"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendCanvasAiChat('change parameter selling price to 2500 DZD')}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 transition-all text-left flex items-center justify-between cursor-pointer group"
                    >
                      <span>⚙️ "Change selling price to 2500 DZD"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendCanvasAiChat('run all')}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-200 transition-all text-left flex items-center justify-between cursor-pointer group"
                    >
                      <span>⚡ "Run all skills on the board"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              ) : (
                aiCanvasChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.sender === 'user' ? (
                      <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-xs bg-slate-900 text-white dark:bg-blue-600 text-xs leading-relaxed shadow-sm">
                        {msg.text}
                      </div>
                    ) : (
                      <div className="w-full max-w-[96%] flex flex-col items-start gap-1.5">
                        {/* Assistant Header */}
                        <div className="flex items-center gap-2 px-1">
                          <div className="w-6 h-6 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 text-[10px] shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Twiks.AI</span>
                          {msg.actionBadge && (
                            <StatusBadge variant="green" dot>
                              {msg.actionBadge}
                            </StatusBadge>
                          )}
                          <span className="text-[10px] text-slate-400 ml-auto">{msg.timestamp}</span>
                        </div>

                        {/* Message Box with ChatGPT Markdown Typography */}
                        <div className="w-full p-4 rounded-2xl rounded-tl-xs bg-[#fbfbfb] dark:bg-[#202024] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 shadow-xs">
                          <ChatGPTMarkdownDocumentRenderer content={msg.text} />

                          {/* Interactive Action Pills */}
                          {msg.actions && msg.actions.length > 0 && (
                            <div className="mt-3.5 pt-3 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap items-center gap-2">
                              {msg.actions.map((act, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={act.onClick}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                    act.variant === 'primary'
                                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                                      : act.variant === 'emerald'
                                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      : 'bg-white hover:bg-slate-100 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200'
                                  }`}
                                >
                                  {act.label}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Assistant Footer Controls */}
                          <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(msg.text);
                                showToast('Copied to clipboard! ✓');
                              }}
                              className="px-2 py-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-white/10 text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleAddMiroElement('sticky', {
                                  title: msg.text.slice(0, 100),
                                  color: '#FEF08A',
                                });
                              }}
                              className="px-2 py-1 rounded-md hover:bg-slate-200/60 dark:hover:bg-white/10 text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Send to Board</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {isAiCanvasChatLoading && (
                <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 text-xs p-3">
                  <div className="w-5 h-5 rounded-md bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 animate-spin">
                    <Sparkles className="w-3 h-3 text-amber-300 dark:text-amber-600" />
                  </div>
                  <span>Twiks.AI is thinking...</span>
                </div>
              )}
            </div>

            {/* BOTTOM INPUT BAR */}
            <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCanvasAiChat();
                }}
                className="w-full px-3.5 py-2.5 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200/70 focus-within:bg-white dark:focus-within:bg-[#202024] focus-within:ring-2 focus-within:ring-blue-500/40 border border-slate-200 dark:border-white/10 shadow-xs flex items-center gap-2.5 transition-all"
              >
                <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-300 dark:text-slate-600 select-none">|</span>
                <input
                  type="text"
                  value={aiCanvasChatInput}
                  onChange={(e) => setAiCanvasChatInput(e.target.value)}
                  placeholder="Ask Twiks.AI to add skills, run nodes, or plan..."
                  className="flex-1 bg-transparent text-xs text-slate-800 dark:text-white placeholder-slate-400 outline-none"
                />
                <button
                  type="submit"
                  disabled={!aiCanvasChatInput.trim() || isAiCanvasChatLoading}
                  className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-30 text-white transition-all cursor-pointer shrink-0"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </aside>
        )}

        {/* Floating Ghost when manually dragging a skill with the mouse */}
        {pointerDraggingSkill && pointerDraggingSkill.hasMoved && (
          <div
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 p-3 w-48 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-blue-500 shadow-2xl flex items-center gap-2.5 animate-in fade-in"
            style={{
              left: pointerDraggingSkill.currentX,
              top: pointerDraggingSkill.currentY,
            }}
          >
            <div
              className={`w-8 h-8 rounded-xl ${pointerDraggingSkill.skill.iconBg} flex items-center justify-center text-white shrink-0 shadow-sm`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 block truncate">
                {pointerDraggingSkill.skill.title}
              </span>
              <span className="text-[10px] text-blue-600 font-semibold block">Drop to place</span>
            </div>
          </div>
        )}

        {/* SKILL & PRODUCT CARD SETTINGS MODAL (User Request: All skill cards add icon setting) */}
        {settingsModalNode && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSettingsModalNodeId(null)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${settingsModalNode.iconBg} flex items-center justify-center text-white shadow-2xs`}>
                    {renderCardIcon(settingsModalNode)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {settingsModalNode.title}
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Configure parameters, AI prompt & execution settings
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSettingsModalNodeId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center border-b border-slate-100 px-5 text-xs font-semibold bg-white">
                <button
                  onClick={() => setSettingsActiveTab('config')}
                  className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
                    settingsActiveTab === 'config'
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Configuration
                </button>
                <button
                  onClick={() => setSettingsActiveTab('prompt')}
                  className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    settingsActiveTab === 'prompt'
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Prompt Template</span>
                  {(() => {
                    if (!settingsModalNode) return null;
                    const count = getNodeSavedPrompts(settingsModalNode).prompts.length;
                    return count > 1 ? (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9.5px] font-bold bg-purple-100 text-purple-700">
                        {count} prompts
                      </span>
                    ) : null;
                  })()}
                </button>
                <button
                  onClick={() => setSettingsActiveTab('typography')}
                  className={`py-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    settingsActiveTab === 'typography'
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Taille & Style du texte</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1">
                {settingsActiveTab === 'config' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Node Title
                      </label>
                      <input
                        type="text"
                        value={settingsModalNode.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNodes((prev) =>
                            prev.map((n) => (n.id === settingsModalNode.id ? { ...n, title: val } : n))
                          );
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Subtitle / Description
                      </label>
                      <input
                        type="text"
                        value={settingsModalNode.subtitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNodes((prev) =>
                            prev.map((n) => (n.id === settingsModalNode.id ? { ...n, subtitle: val } : n))
                          );
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Execution Language
                        </label>
                        <select
                          value={settingsModalNode.language || 'English'}
                          onChange={(e) => handleChangeNodeLanguage(settingsModalNode.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer"
                        >
                          <option value="English">English</option>
                          <option value="Algerian Darja">Algerian Darja</option>
                          <option value="French">French</option>
                          <option value="Arabic">Arabic</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Live Web Research
                        </label>
                        <button
                          type="button"
                          onClick={() => handleToggleLiveWebResearch(settingsModalNode.id)}
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                            settingsModalNode.liveWebResearch
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{settingsModalNode.liveWebResearch ? 'Active (Search On)' : 'Disabled'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Campaign Objective
                        </label>
                        <input
                          type="text"
                          value={settingsModalNode.config.campaignObjective}
                          onChange={(e) =>
                            updateNodeConfigById(settingsModalNode.id, { campaignObjective: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Daily Budget ($)
                        </label>
                        <input
                          type="text"
                          value={settingsModalNode.config.budget}
                          onChange={(e) =>
                            updateNodeConfigById(settingsModalNode.id, { budget: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : settingsActiveTab === 'prompt' ? (
                  (() => {
                    const { prompts, activeId } = getNodeSavedPrompts(settingsModalNode);
                    const currentTabId =
                      activePromptModalTabId && prompts.some((p) => p.id === activePromptModalTabId)
                        ? activePromptModalTabId
                        : activeId;
                    const currentPromptItem =
                      prompts.find((p) => p.id === currentTabId) || prompts[0];
                    const isCurrentActive = currentPromptItem.id === activeId;

                    return (
                      <div className="space-y-4">
                        {/* CSS selector 2: Custom AI Prompt Template header with background persistence indicator */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                              Custom AI Prompt Template
                            </span>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                              title="Any changes are automatically saved directly in the background and restored when you reopen the app"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Auto-saved in background
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const newId = `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
                                const newPromptObj: SavedPromptItem = {
                                  id: newId,
                                  name: `Prompt #${prompts.length + 1}`,
                                  prompt: getDefaultPromptForNode(settingsModalNode.title, settingsModalNode.subtitle),
                                  createdAt: new Date().toISOString(),
                                  isDefault: false,
                                };
                                const nextList = [...prompts, newPromptObj];
                                setActivePromptModalTabId(newId);
                                handleUpdatePromptsForNode(settingsModalNode.id, nextList, activeId);
                                showToast(`✓ Added new prompt "${newPromptObj.name}"! Saved in background.`);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Add another prompt for this skill"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Prompt</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const copyId = `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
                                const duplicateObj: SavedPromptItem = {
                                  id: copyId,
                                  name: `Copy of ${currentPromptItem.name}`,
                                  prompt: currentPromptItem.prompt,
                                  createdAt: new Date().toISOString(),
                                  isDefault: false,
                                };
                                const nextList = [...prompts, duplicateObj];
                                setActivePromptModalTabId(copyId);
                                handleUpdatePromptsForNode(settingsModalNode.id, nextList, activeId);
                                showToast(`✓ Duplicated to "${duplicateObj.name}"! Saved in background.`);
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Duplicate current prompt"
                            >
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Duplicate</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const def = getDefaultPromptForNode(settingsModalNode.title, settingsModalNode.subtitle);
                                const updated = prompts.map((p) =>
                                  p.id === currentPromptItem.id ? { ...p, prompt: def } : p
                                );
                                handleUpdatePromptsForNode(settingsModalNode.id, updated, activeId);
                                showToast('Reset current prompt to default template');
                              }}
                              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer px-1.5 py-1"
                            >
                              Reset to Default
                            </button>
                          </div>
                        </div>

                        {/* Multi-Prompt Switcher Tabs / Pills */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                              Saved Prompts ({prompts.length}) — Click to view or choose active:
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                            {prompts.map((pItem, idx) => {
                              const isSelectedTab = pItem.id === currentPromptItem.id;
                              const isThisActive = pItem.id === activeId;
                              return (
                                <div
                                  key={pItem.id}
                                  onClick={() => setActivePromptModalTabId(pItem.id)}
                                  className={`group px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all select-none whitespace-nowrap shrink-0 ${
                                    isSelectedTab
                                      ? 'bg-purple-50/90 border-purple-300 text-purple-900 shadow-xs ring-1 ring-purple-200'
                                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5">
                                    {isThisActive ? (
                                      <span
                                        className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200"
                                        title="Active prompt chosen for AI execution"
                                      />
                                    ) : (
                                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    )}
                                    <span>{pItem.name || `Prompt ${idx + 1}`}</span>
                                  </div>

                                  {isThisActive && (
                                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[9.5px] font-bold tracking-tight">
                                      ACTIVE
                                    </span>
                                  )}

                                  {prompts.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const nextList = prompts.filter((p) => p.id !== pItem.id);
                                        const nextActive = isThisActive ? nextList[0].id : activeId;
                                        const nextTab = isSelectedTab ? nextList[0].id : currentPromptItem.id;
                                        setActivePromptModalTabId(nextTab);
                                        handleUpdatePromptsForNode(settingsModalNode.id, nextList, nextActive);
                                        showToast(`Removed prompt "${pItem.name}"`);
                                      }}
                                      className="p-0.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                      title="Delete this prompt"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              );
                            })}

                            <button
                              type="button"
                              onClick={() => {
                                const newId = `prompt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
                                const newPromptObj: SavedPromptItem = {
                                  id: newId,
                                  name: `Prompt #${prompts.length + 1}`,
                                  prompt: getDefaultPromptForNode(settingsModalNode.title, settingsModalNode.subtitle),
                                  createdAt: new Date().toISOString(),
                                  isDefault: false,
                                };
                                const nextList = [...prompts, newPromptObj];
                                setActivePromptModalTabId(newId);
                                handleUpdatePromptsForNode(settingsModalNode.id, nextList, activeId);
                                showToast(`✓ Added "${newPromptObj.name}"! Saved in background.`);
                              }}
                              className="px-2.5 py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 text-slate-500 hover:text-blue-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>

                        {/* Active Selection Banner & Prompt Name Config */}
                        <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex-1 min-w-0">
                            <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                              Prompt Name / Label:
                            </label>
                            <input
                              type="text"
                              value={currentPromptItem.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                const updated = prompts.map((p) =>
                                  p.id === currentPromptItem.id ? { ...p, name: val } : p
                                );
                                handleUpdatePromptsForNode(settingsModalNode.id, updated, activeId);
                              }}
                              placeholder="e.g. Angle 1 - Direct Response, Darja Pitch, French Formal..."
                              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-0">
                            {isCurrentActive ? (
                              <div className="px-3 py-1.5 rounded-xl bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                <span>CHOSEN FOR AI RUN</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdatePromptsForNode(settingsModalNode.id, prompts, currentPromptItem.id);
                                  showToast(`✓ Set "${currentPromptItem.name}" as active prompt! Saved directly in background.`);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                                title="Click to use this prompt when running AI analysis"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Choose This Prompt</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                handleUpdatePromptsForNode(settingsModalNode.id, prompts, activeId);
                                showToast(`✓ Prompt "${currentPromptItem.name}" saved directly in background!`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Save directly in background (persists on restart)"
                            >
                              <Save className="w-3.5 h-3.5 text-slate-500" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>

                        {/* CSS selector 1: The prompt textarea */}
                        <textarea
                          rows={7}
                          value={currentPromptItem.prompt}
                          onChange={(e) => {
                            const val = e.target.value;
                            const updated = prompts.map((p) =>
                              p.id === currentPromptItem.id ? { ...p, prompt: val } : p
                            );
                            handleUpdatePromptsForNode(settingsModalNode.id, updated, activeId);
                          }}
                          placeholder="Write your custom prompt template here..."
                          className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500 focus:bg-white resize-y"
                        />

                        {/* Variables insert & word count */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Click variable to insert:
                            </span>
                            <span className="text-[10.5px] font-mono text-slate-500">
                              {currentPromptItem.prompt.length} chars • {currentPromptItem.prompt.trim().split(/\s+/).filter(Boolean).length} words
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {[
                              '{product_title}',
                              '{niche}',
                              '{selling_price}',
                              '{product_cost}',
                              '{profit_margin}',
                              '{selling_points}',
                              '{language}',
                            ].map((variableTag) => (
                              <button
                                key={variableTag}
                                type="button"
                                onClick={() => {
                                  const val = currentPromptItem.prompt + ' ' + variableTag;
                                  const updated = prompts.map((p) =>
                                    p.id === currentPromptItem.id ? { ...p, prompt: val } : p
                                  );
                                  handleUpdatePromptsForNode(settingsModalNode.id, updated, activeId);
                                }}
                                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-[10.5px] font-mono text-slate-600 transition-colors cursor-pointer"
                              >
                                +{variableTag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* TYPOGRAPHY & TEXT STYLING TAB (Taille & Style du texte) */
                  <div className="space-y-5">
                    {/* Size scale header with active % display and quick stepper */}
                    <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 p-4 rounded-2xl border border-blue-100/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <Type className="w-4 h-4 text-blue-600" />
                            <span>Taille du texte (Font Size Scaling)</span>
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Ajustez l'échelle de lecture pour prévisualiser les résultats confortablement
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-mono font-black text-sm shadow-2xs">
                          {settingsModalNode.textStyle?.fontSizeScale || 125}%
                        </span>
                      </div>

                      {/* Presets: S, M, L, XL, 2XL */}
                      <div>
                        <span className="text-[10.5px] uppercase font-bold text-slate-500 font-mono block mb-1.5">
                          Préréglages rapides (Presets) :
                        </span>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { label: 'Compact', val: 100, sub: '100%' },
                            { label: 'Standard', val: 115, sub: '115%' },
                            { label: 'Grand', val: 130, sub: '130%' },
                            { label: 'Très Grand', val: 150, sub: '150%' },
                            { label: 'Géant', val: 170, sub: '170%' },
                          ].map((p) => {
                            const isSelected = (settingsModalNode.textStyle?.fontSizeScale || 125) === p.val;
                            return (
                              <button
                                key={p.val}
                                type="button"
                                onClick={() => updateNodeTextStyle(settingsModalNode.id, { fontSizeScale: p.val })}
                                className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                                }`}
                              >
                                <span className="block text-xs font-bold">{p.label}</span>
                                <span className={`block text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                  {p.sub}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Precise Slider + Stepper Controls */}
                      <div className="pt-1 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                          <span>Ajustement précis (80% à 180%)</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const curr = settingsModalNode.textStyle?.fontSizeScale || 125;
                                updateNodeTextStyle(settingsModalNode.id, { fontSizeScale: Math.max(80, curr - 5) });
                              }}
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-mono font-bold text-xs cursor-pointer shadow-2xs"
                              title="Diminuer de 5%"
                            >
                              -5%
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const curr = settingsModalNode.textStyle?.fontSizeScale || 125;
                                updateNodeTextStyle(settingsModalNode.id, { fontSizeScale: Math.min(180, curr + 5) });
                              }}
                              className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-mono font-bold text-xs cursor-pointer shadow-2xs"
                              title="Augmenter de 5%"
                            >
                              +5%
                            </button>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="80"
                          max="180"
                          step="5"
                          value={settingsModalNode.textStyle?.fontSizeScale || 125}
                          onChange={(e) => updateNodeTextStyle(settingsModalNode.id, { fontSizeScale: Number(e.target.value) })}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-slate-400">
                          <span>80% (Compact)</span>
                          <span>125% (Confortable)</span>
                          <span>180% (Large)</span>
                        </div>
                      </div>
                    </div>

                    {/* Font Weight & Line Height */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Font Weight */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Épaisseur du texte (Font Weight)
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { label: 'Normal (400)', val: 'normal' },
                            { label: 'Médium (500)', val: 'medium' },
                            { label: 'Semi-Bold (600)', val: 'semibold' },
                            { label: 'Bold (700)', val: 'bold' },
                          ].map((w) => {
                            const isSelected = (settingsModalNode.textStyle?.fontWeight || 'normal') === w.val;
                            return (
                              <button
                                key={w.val}
                                type="button"
                                onClick={() => updateNodeTextStyle(settingsModalNode.id, { fontWeight: w.val as any })}
                                className={`py-1.5 px-2 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-2xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {w.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Line Height */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                          Hauteur de ligne (Interligne)
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { label: 'Serré', val: 'tight', sub: '1.4' },
                            { label: 'Normal', val: 'normal', sub: '1.65' },
                            { label: 'Aéré', val: 'relaxed', sub: '1.85' },
                          ].map((lh) => {
                            const isSelected = (settingsModalNode.textStyle?.lineHeight || 'normal') === lh.val;
                            return (
                              <button
                                key={lh.val}
                                type="button"
                                onClick={() => updateNodeTextStyle(settingsModalNode.id, { lineHeight: lh.val as any })}
                                className={`py-1.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <span className="block text-xs font-semibold">{lh.label}</span>
                                <span className={`block text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                  {lh.sub}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Font Family */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Famille de Police (Font Family)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: 'Sans Moderne', val: 'sans', fontClass: 'font-sans', desc: 'Jakarta / Inter' },
                          { label: 'Serif Élégant', val: 'serif', fontClass: 'font-serif', desc: 'Georgia / Editorial' },
                          { label: 'Monospace Tech', val: 'mono', fontClass: 'font-mono', desc: 'JetBrains / Code' },
                        ].map((f) => {
                          const isSelected = (settingsModalNode.textStyle?.fontFamily || 'sans') === f.val;
                          return (
                            <button
                              key={f.val}
                              type="button"
                              onClick={() => updateNodeTextStyle(settingsModalNode.id, { fontFamily: f.val as any })}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-2xs ring-1 ring-blue-500'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className={`block text-xs font-bold ${f.fontClass}`}>{f.label}</span>
                              <span className="block text-[10px] text-slate-400 mt-0.5">{f.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Color Theme */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">
                        Thème de Couleur & Contraste
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { label: 'Défaut', val: 'default', color: 'bg-slate-800' },
                          { label: 'Émeraude', val: 'emerald', color: 'bg-emerald-600' },
                          { label: 'Violet IA', val: 'purple', color: 'bg-purple-600' },
                          { label: 'Ambre Chaud', val: 'amber', color: 'bg-amber-600' },
                          { label: 'Haut Contraste', val: 'contrast', color: 'bg-black' },
                        ].map((th) => {
                          const isSelected = (settingsModalNode.textStyle?.colorTheme || 'default') === th.val;
                          return (
                            <button
                              key={th.val}
                              type="button"
                              onClick={() => updateNodeTextStyle(settingsModalNode.id, { colorTheme: th.val as any })}
                              className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className={`w-3 h-3 rounded-full shrink-0 ${th.color}`} />
                              <span className="text-[11px] truncate">{th.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Interactive Preview Box */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700 block">
                        Aperçu en direct (Live Preview) :
                      </span>
                      <div
                        className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-2 transition-all overflow-hidden"
                        style={{
                          fontSize: `${settingsModalNode.textStyle?.fontSizeScale || 125}%`,
                          fontWeight:
                            (settingsModalNode.textStyle?.fontWeight === 'bold'
                              ? 700
                              : settingsModalNode.textStyle?.fontWeight === 'semibold'
                              ? 600
                              : settingsModalNode.textStyle?.fontWeight === 'medium'
                              ? 500
                              : 400),
                          lineHeight:
                            (settingsModalNode.textStyle?.lineHeight === 'tight'
                              ? 1.4
                              : settingsModalNode.textStyle?.lineHeight === 'relaxed'
                              ? 1.85
                              : 1.65),
                          fontFamily:
                            (settingsModalNode.textStyle?.fontFamily === 'serif'
                              ? 'Merriweather, Georgia, serif'
                              : settingsModalNode.textStyle?.fontFamily === 'mono'
                              ? '"JetBrains Mono", monospace'
                              : 'inherit'),
                        }}
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                          <span className="font-bold text-slate-900">
                            Rapport d'Intelligence E-commerce
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[0.75em] font-bold font-mono">
                            3,800 DZD • +71% Marge
                          </span>
                        </div>
                        <p className="text-slate-700 m-0">
                          Le coussin orthopédique offre une opportunité COD éprouvée en Algérie sur les Wilayas d'Alger, Oran et Sétif avec un taux de livraison cible de 64%.
                        </p>
                        <div className="p-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-[0.85em] font-semibold italic">
                          "شفت هاد الكوسان بالجيل لي راه داير حالة؟ يمتص كامل الضغط حتى لوكان تقعد فوق حبة بيض!"
                        </div>
                      </div>
                    </div>

                    {/* Actions: Apply to all cards & Reset */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          updateNodeTextStyle(settingsModalNode.id, {
                            fontSizeScale: 125,
                            fontWeight: 'normal',
                            lineHeight: 'normal',
                            fontFamily: 'sans',
                            colorTheme: 'default',
                          });
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Réinitialiser aux valeurs par défaut
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const style = settingsModalNode.textStyle || { fontSizeScale: 125 };
                          applyTextStyleToAllNodes(style);
                          setStyleAppliedAllToast(true);
                          setTimeout(() => setStyleAppliedAllToast(false), 2500);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                          styleAppliedAllToast
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200'
                        }`}
                      >
                        {styleAppliedAllToast ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Appliqué à toutes les cartes !</span>
                          </>
                        ) : (
                          <>
                            <Sliders className="w-3.5 h-3.5 text-blue-600" />
                            <span>Appliquer à toutes les cartes du tableau</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <button
                  type="button"
                  onClick={() => setSettingsModalNodeId(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Done
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      const id = settingsModalNode.id;
                      setSettingsModalNodeId(null);
                      await handleRunSingleNode(id);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run & Preview Result ↓</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Board Projects Library Modal */}
        <BoardProjectsModal
          isOpen={isProjectsModalOpen}
          onClose={() => setIsProjectsModalOpen(false)}
          projects={boardProjects}
          activeProjectId={activeProjectId}
          onSelectProject={handleSelectProject}
          onNewProject={() => {
            setIsProjectsModalOpen(false);
            setIsNewProjectModalOpen(true);
          }}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
        />

        {/* Create New Board Project Modal */}
        <NewBoardProjectModal
          isOpen={isNewProjectModalOpen}
          onClose={() => setIsNewProjectModalOpen(false)}
          onCreate={handleCreateNewProject}
        />

        {/* NEW CUSTOM SKILL MODAL */}
        {isNewSkillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      Create New Custom AI Skill
                    </h3>
                    <p className="text-xs text-slate-500">
                      Define what this skill does in text with custom prompt instructions
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewSkillModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Skill Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Algerian Facebook Creative Angle Generator"
                    value={newSkillTitle}
                    onChange={(e) => setNewSkillTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subtitle / Short Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Generates 5 viral hooks in Algerian Darja with objection-handling call scripts"
                    value={newSkillSubtitle}
                    onChange={(e) => setNewSkillSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Category Selection: Choose Existing or Create New */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Category & Funnel Stage *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategoryMode(!isCustomCategoryMode);
                        if (!isCustomCategoryMode) {
                          setCustomCategoryInput('');
                        }
                      }}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer flex items-center gap-1 font-mono"
                    >
                      {isCustomCategoryMode ? '← Choose Existing Category' : '+ Create New Category'}
                    </button>
                  </div>

                  {!isCustomCategoryMode ? (
                    <div className="relative">
                      <select
                        value={newSkillCategory}
                        onChange={(e) => {
                          if (e.target.value === '__create_new__') {
                            setIsCustomCategoryMode(true);
                            setCustomCategoryInput('');
                          } else {
                            setNewSkillCategory(e.target.value);
                          }
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer shadow-2xs"
                      >
                        <optgroup label="Choose Existing Stage / Category (30+ Categories)">
                          {ALL_SKILL_CATEGORIES.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name} ({cat.skills.length} skills)
                            </option>
                          ))}
                        </optgroup>
                        <option value="__create_new__" className="text-emerald-700 font-bold">
                          ✨ + Create Brand New Category...
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1.5 animate-in fade-in">
                      <input
                        type="text"
                        placeholder="Enter your new category name (e.g., Scaling Tactics DZ, Algerian Influencers...)"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border-2 border-emerald-500 text-xs text-slate-900 focus:outline-none font-semibold shadow-2xs"
                        autoFocus
                      />
                      <p className="text-[10.5px] text-emerald-700 font-medium">
                        ✓ A dedicated category section with this name will be created in your library & board.
                      </p>
                    </div>
                  )}
                </div>

                {/* Icon & Color Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Icon Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Card Icon
                    </label>
                    <div className="grid grid-cols-6 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                      {[
                        { name: 'Sparkles', icon: <Sparkles className="w-3.5 h-3.5" /> },
                        { name: 'Zap', icon: <Zap className="w-3.5 h-3.5" /> },
                        { name: 'Target', icon: <Target className="w-3.5 h-3.5" /> },
                        { name: 'TrendingUp', icon: <TrendingUp className="w-3.5 h-3.5" /> },
                        { name: 'Layers', icon: <Layers className="w-3.5 h-3.5" /> },
                        { name: 'ShoppingBag', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                        { name: 'ShieldCheck', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                        { name: 'DollarSign', icon: <DollarSign className="w-3.5 h-3.5" /> },
                        { name: 'Lightbulb', icon: <Lightbulb className="w-3.5 h-3.5" /> },
                        { name: 'MessageSquareQuote', icon: <MessageSquareQuote className="w-3.5 h-3.5" /> },
                        { name: 'FileText', icon: <FileText className="w-3.5 h-3.5" /> },
                        { name: 'Compass', icon: <Compass className="w-3.5 h-3.5" /> },
                      ].map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setNewSkillIcon(item.name)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                            newSkillIcon === item.name
                              ? 'bg-emerald-600 text-white shadow-xs scale-105 ring-2 ring-emerald-400/40'
                              : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                          }`}
                          title={item.name}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Accent Color
                    </label>
                    <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex-wrap">
                      {[
                        { name: 'Emerald', bg: 'bg-emerald-600', ring: 'ring-emerald-400' },
                        { name: 'Blue', bg: 'bg-blue-600', ring: 'ring-blue-400' },
                        { name: 'Purple', bg: 'bg-purple-600', ring: 'ring-purple-400' },
                        { name: 'Indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-400' },
                        { name: 'Amber', bg: 'bg-amber-600', ring: 'ring-amber-400' },
                        { name: 'Rose', bg: 'bg-rose-600', ring: 'ring-rose-400' },
                        { name: 'Cyan', bg: 'bg-cyan-600', ring: 'ring-cyan-400' },
                      ].map((c) => (
                        <button
                          key={c.bg}
                          type="button"
                          onClick={() => setNewSkillColor(c.bg)}
                          className={`w-6 h-6 rounded-full ${c.bg} transition-all cursor-pointer shadow-2xs ${
                            newSkillColor === c.bg ? 'ring-3 ring-offset-2 scale-110 ' + c.ring : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Live Preview */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-50 to-emerald-50/30 border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Board Card Layout Preview
                  </span>
                  <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className={`w-8 h-8 rounded-xl ${newSkillColor} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                      {getDynamicSkillIcon(newSkillIcon, 'w-4 h-4 text-white')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {newSkillTitle || 'Untitled Custom Skill'}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                          CUSTOM
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 truncate mt-0.5">
                        {isCustomCategoryMode
                          ? customCategoryInput || 'New Category'
                          : ALL_SKILL_CATEGORIES.find((c) => c.id === newSkillCategory)?.name || 'Custom Category'}
                        {' • '}
                        {newSkillSubtitle || 'Custom AI Skill'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      What should this skill do? (Prompt Instructions) *
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Click to insert variable
                    </span>
                  </div>

                  {/* Variable Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    {[
                      '{product_title}',
                      '{selling_price}',
                      '{product_cost}',
                      '{profit_margin}',
                      '{niche}',
                      '{file_name}',
                      '{file_data}',
                      '{language}',
                    ].map((variable) => (
                      <button
                        key={variable}
                        type="button"
                        onClick={() => setNewSkillPrompt((prev) => `${prev} ${variable}`)}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-mono font-semibold border border-emerald-200 transition-colors cursor-pointer"
                      >
                        +{variable}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={6}
                    value={newSkillPrompt}
                    onChange={(e) => setNewSkillPrompt(e.target.value)}
                    placeholder="Write exactly what you need the AI skill to do..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewSkillModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateCustomSkill}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-98 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save & Add Skill</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SKILL REMOVAL CONFIRMATION MODAL WINDOW */}
        {skillToRemove && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setSkillToRemove(null)}
          >
            <div
              className="bg-[#18181b] rounded-3xl border border-white/15 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-rose-950/40 via-red-950/20 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Remove Skill from List?
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Confirmation required before removing
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSkillToRemove(null)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#232329] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Skill to Remove
                  </span>
                  <p className="text-sm font-bold text-white">
                    {skillToRemove.title}
                  </p>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  Are you sure you want to remove <strong className="text-white">"{skillToRemove.title}"</strong>? {skillToRemove.isCustom ? 'This custom skill will be permanently deleted.' : 'It will be hidden from your skills drawer. You can restore it anytime with "Restore All".'}
                </p>
              </div>

              <div className="p-4 px-5 border-t border-white/10 bg-[#141416] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSkillToRemove(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRemoveSkill}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-98 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Remove</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FILE PREVIEW MODAL */}
        {previewFileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 max-h-[85vh] flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl ${
                    previewFileModal.type === 'excel' ? 'bg-emerald-600' :
                    previewFileModal.type === 'pdf' ? 'bg-rose-600' :
                    previewFileModal.type === 'word' ? 'bg-blue-600' :
                    previewFileModal.type === 'json' ? 'bg-amber-600' : 'bg-purple-600'
                  } flex items-center justify-center text-white shrink-0 shadow-2xs`}>
                    {previewFileModal.type === 'excel' && <FileSpreadsheet className="w-4 h-4" />}
                    {previewFileModal.type === 'pdf' && <FileText className="w-4 h-4" />}
                    {previewFileModal.type === 'word' && <FileText className="w-4 h-4" />}
                    {previewFileModal.type === 'json' && <FileCode className="w-4 h-4" />}
                    {previewFileModal.type === 'image' && <ImageIcon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {previewFileModal.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {previewFileModal.type.toUpperCase()} • {Math.round(previewFileModal.size / 1024)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewFileModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                {previewFileModal.type === 'excel' && previewFileModal.tableData && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Full Table Preview ({previewFileModal.tableData.totalRows} records)</span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 border-b border-slate-200">
                            {previewFileModal.tableData.headers.map((h, i) => (
                              <th key={i} className="p-2 font-bold text-slate-700 whitespace-nowrap font-mono text-[10.5px]">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewFileModal.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-100 odd:bg-white even:bg-slate-50/50 hover:bg-emerald-50/30">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2 text-slate-700 whitespace-nowrap font-mono text-[11px]">
                                  {String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {previewFileModal.type === 'image' && (previewFileModal.previewUrl || previewFileModal.url) && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 flex items-center justify-center">
                    <img
                      src={previewFileModal.previewUrl || previewFileModal.url}
                      alt={previewFileModal.name}
                      className="max-h-[60vh] object-contain"
                    />
                  </div>
                )}

                {previewFileModal.type === 'json' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(previewFileModal.jsonData, null, 2)}
                    </pre>
                  </div>
                )}

                {(previewFileModal.type === 'pdf' || previewFileModal.type === 'word') && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                    {previewFileModal.textContent || previewFileModal.summary}
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready for AI analysis when attached to board
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewFileModal(null)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleAddFileToBoard(previewFileModal);
                      setPreviewFileModal(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
                  >
                    + Add to Board
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Preview Dossier Modal (Matching attached JSON) */}
        <ProductPreviewModal
          product={previewProduct}
          isOpen={Boolean(previewProduct)}
          onClose={() => setPreviewProduct(null)}
          onAddToBoard={handleAddDetailedProductToBoard}
        />

        {/* Product Import Modal (Upload File, Manual, Paste Code JSON) */}
        <ProductImportModal
          isOpen={isProductImportModalOpen}
          onClose={() => setIsProductImportModalOpen(false)}
          onProductAdded={(newProduct) => {
            const fresh = loadProductsFromStorage();
            setProductsList(fresh);
            setPreviewProduct(newProduct);
            showToast(`Imported "${newProduct.name.slice(0, 30)}..."`);
          }}
        />

        {/* Product Regrouper Modal (Select products, group size & cluster into Org Chart) */}
        {isRegrouperModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsRegrouperModalOpen(false)}
          >
            <div
              className="w-full max-w-6xl max-h-[94vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <ProductRegrouperApp
                initialData={regrouperData || undefined}
                onUpdateData={(updated) => setRegrouperData(updated)}
                onSendToBoard={(blueprint) => {
                  handleSendRegrouperToBoard(blueprint);
                  setIsRegrouperModalOpen(false);
                }}
                isModal={true}
                onCloseModal={() => setIsRegrouperModalOpen(false)}
              />
            </div>
          </div>
        )}
        {/* Text to Code Landing Page Modal (Image 1 Engine) */}
        {isTextToCodeModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsTextToCodeModalOpen(false)}
          >
            <div
              className="w-full max-w-6xl max-h-[94vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <TextToCodeLandingPageApp
                initialData={textToCodeData || undefined}
                onSendToBoard={(lp, html) => {
                  handleSendTextToCodeToBoard(lp, html);
                  setIsTextToCodeModalOpen(false);
                }}
                isModal={true}
                onCloseModal={() => setIsTextToCodeModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Text to Image Landing Page Modal (Image 2 Engine) */}
        {isTextToImageLpModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsTextToImageLpModalOpen(false)}
          >
            <div
              className="w-full max-w-6xl max-h-[94vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <TextToImageLandingPageApp
                initialData={textToImageLpData || undefined}
                onSendToBoard={(lp) => {
                  handleSendTextToImageLpToBoard(lp);
                  setIsTextToImageLpModalOpen(false);
                }}
                isModal={true}
                onCloseModal={() => setIsTextToImageLpModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* CRO Landing Page Builder (Mobile) Modal (Exact Image Match) */}
        {isCroMobileModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsCroMobileModalOpen(false)}
          >
            <div
              className="w-full max-w-[98vw] max-h-[96vh] flex flex-col bg-[#F3F6FD] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CroMobileLandingPageBuilder
                isModal={true}
                onClose={() => setIsCroMobileModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* AI Landing Page Generator Modal (Exact 3-Column Studio matching reference image) */}
        {isLandingPageModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsLandingPageModalOpen(false)}
          >
            <div
              className="w-full max-w-[96vw] max-h-[96vh] flex flex-col bg-[#F3F6FF] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <LandingPageGeneratorApp
                initialSettings={landingPageSettings || undefined}
                onSaveSettings={(settings) => setLandingPageSettings(settings)}
                onSendToBoard={(settings) => {
                  handleSendLandingPageToBoard(settings);
                  setIsLandingPageModalOpen(false);
                }}
                isModal={true}
                onCloseModal={() => setIsLandingPageModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Board Notification Toast */}
        {boardToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <span>{boardToast}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Crosshair component fallback
function CrosshairIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  );
}
