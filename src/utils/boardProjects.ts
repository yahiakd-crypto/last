import {
  BoardNode,
  BoardEdge,
  BoardStickyNote,
  BoardProject,
  SAMPLE_PRODUCTS,
} from '../types/board';

export type { BoardNode, BoardEdge, BoardStickyNote, BoardProject };

export const STORAGE_KEY_BOARD_PROJECTS = 'user_board_projects_v2';
export const STORAGE_KEY_BOARD_ACTIVE_ID = 'user_board_active_id_v2';
export const STORAGE_KEY_BOARD_OPEN_TABS = 'user_board_open_tabs_v2';

// Old keys for backward-compatibility migration
const OLD_KEY_NODES = 'user_board_nodes_v1';
const OLD_KEY_EDGES = 'user_board_edges_v1';
const OLD_KEY_STICKY = 'user_board_sticky_v1';
const OLD_KEY_PAN = 'user_board_pan_v1';
const OLD_KEY_ZOOM = 'user_board_zoom_v1';

// Default starter presets
export const createDefaultBoardProjects = (migratedNodes?: BoardNode[], migratedEdges?: BoardEdge[]): BoardProject[] => {
  const now = new Date().toISOString();

  // If user already had nodes on their board, use them as project 1
  const hasUserWork = migratedNodes && migratedNodes.length > 0;

  const project1: BoardProject = {
    id: 'proj_algeria_cod_funnel',
    name: 'Algeria COD Sales Funnel',
    description: 'Full cash-on-delivery funnel: product validation, Meta ads creative angles, and 58 wilaya logistics.',
    createdAt: now,
    updatedAt: now,
    nodes: hasUserWork
      ? migratedNodes
      : [
          {
            id: 'node-product-scaler',
            title: 'Electric Ultrasonic Dental Scaler Pro',
            subtitle: 'Personal Care & Health • 4,800 DZD',
            category: 'Product Library',
            iconType: 'ShoppingBag',
            iconBg: 'bg-emerald-600',
            iconColor: 'text-white',
            x: 80,
            y: 120,
            status: 'active',
            isProduct: true,
            productData: SAMPLE_PRODUCTS[1] || SAMPLE_PRODUCTS[0],
            sectionNumber: 'SECTION 01',
            customInstructions: '',
            hideText: false,
            hideResult: false,
            activePreviewTab: 'preview',
            analysisMode: 'standard',
            metrics: [
              { label: 'Selling', value: '4,800 DZD' },
              { label: 'Cost', value: '1,400 DZD' },
              { label: 'Margin', value: '+71%' },
            ],
            config: {
              name: 'Electric Ultrasonic Dental Scaler Pro',
              description: 'High-converting personal care item in Algerian COD market with viral TikTok video angles.',
              campaignObjective: 'Sales',
              targetAudience: 'Algeria - 18+',
              budget: '3500 DZD',
              budgetPeriod: 'per day',
              autoOptimization: true,
              trackConversions: true,
              saveAdsToLibrary: true,
            },
          },
          {
            id: 'node-product-deep-dive',
            title: 'Product Deep Dive',
            subtitle: 'Perform an exhaustive technical, practical, and commercial breakdown of the product before launch.',
            category: 'Stage 1: Product Intelligence',
            iconType: 'search',
            iconBg: 'bg-blue-600',
            iconColor: 'text-white',
            x: 460,
            y: 120,
            status: 'active',
            liveWebResearch: true,
            language: 'English',
            sectionNumber: 'SECTION 02',
            customInstructions: '',
            hideText: false,
            hideResult: false,
            activePreviewTab: 'preview',
            analysisMode: 'deep',
            previewSide: 'bottom',
            previewDirection: 'ltr',
            executionResult: {
              executedAt: '11:15 AM',
              skillName: 'Product Deep Dive',
              productName: 'Electric Ultrasonic Dental Scaler Pro',
              language: 'English',
              webResearchUsed: true,
              content: `Product name: Electric Ultrasonic Dental Scaler Pro\n\nSummary:\nCompact electric ultrasonic dental scaler for home use, removes plaque and tartar, improves oral hygiene. Strong demand curve with rising interest across Algerian metropolitan wilayas.\n\nKey Findings:\n- Growing demand driven by increased interest in home dental care and oral hygiene.\n- Moderate competition with room for differentiation (better features or branding).\n- Healthy estimated margin with manageable costs and shipping to Algeria.\n\nPricing & Margin:\n- Price Range: $18 – $45 (USD) | Est. Margin: 31% | Opportunity Score: 82/100 (Verdict: Worth validating)`,
            },
            config: {
              name: 'Product Deep Dive',
              description: 'Exhaustive commercial, competition, and profit breakdown.',
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
            x: 1460,
            y: 120,
            status: 'active',
            liveWebResearch: true,
            language: 'English',
            sectionNumber: 'SECTION 03',
            customInstructions: '',
            hideText: false,
            hideResult: false,
            activePreviewTab: 'preview',
            analysisMode: 'standard',
            executionResult: {
              executedAt: '10:45 AM',
              skillName: 'Meta Ads',
              productName: 'Electric Ultrasonic Dental Scaler Pro',
              language: 'English',
              webResearchUsed: true,
              content: `Product name: Electric Ultrasonic Dental Scaler Pro (Personal Care & Health)

Summary:
Proven high-margin personal care device with immediate visual demonstration appeal (removing simulated plaque and tea stains). Strong impulse purchase triggers across Algerian urban Wilayas with high mobile penetration.

Winning Hooks:
1. Darija Hook: "شفت هاد الجهاز لي راه داير حالة؟ نقي سنانك في دارك كيما عند دونتيست وبلا وجع!"
2. Problem Agitation Hook: "احصل على ابتسامة ناصعة وتخلص من الجير الأصفر في 5 دقائق وبدون زيارة الطبيب المكلفة."
3. COD Wilaya Guarantee: "التوصيل متوفر لـ 58 ولاية والدفع عند الاستلام بعد ما تفتح وتتأكد من الكولي!"

Market & COD Logistics:
- Selling Price: 4,800 DZD | Landed Cost: 1,400 DZD | Gross Profit: +3,400 DZD (71%)
- Break-Even Delivery Rate: 58% with Yalidine Express across 58 Wilayas.
- Top Converting Wilayas: Alger (16), Oran (31), Setif (19), Constantine (25).

Action Plan:
- Test 3 video creative angles showing direct ultrasonic plaque removal on ceramic models.
- Set CAPI server-side tracking optimized for Purchase.`,
            },
            config: {
              name: 'Meta Ads Campaign',
              description: 'Targeted Algerian audience campaign for personal care.',
              campaignObjective: 'Conversions',
              targetAudience: 'Algeria (Wilaya 16, 31, 19, 25)',
              budget: '3,000 DZD',
              budgetPeriod: 'daily',
            },
          },
        ],
    edges: hasUserWork
      ? (migratedEdges || [])
      : [
          {
            id: 'edge-product-to-deepdive',
            from: 'node-product-scaler',
            to: 'node-product-deep-dive',
            fromAnchor: 'right',
            toAnchor: 'left',
            animated: true,
            label: 'Pass Product Data',
          },
          {
            id: 'edge-deepdive-to-ads',
            from: 'node-product-deep-dive',
            to: 'node-meta-ads',
            fromAnchor: 'right',
            toAnchor: 'left',
            animated: true,
            label: 'Pass Intelligence',
          },
        ],
    stickyNotes: [
      {
        id: 'sticky-1',
        title: 'Algerian COD Rule: Always confirm orders via Darija WhatsApp audio within 10 minutes to reach 85%+ delivery rate.',
        icon: '💡',
        x: 80,
        y: 420,
        rotate: -2,
      },
    ],
    panOffset: { x: 40, y: 30 },
    zoom: 85,
  };

  const project2: BoardProject = {
    id: 'proj_tiktok_scaler',
    name: 'TikTok Viral Dropship Scaler',
    description: 'High-frequency video angle testing, influencer unboxing scripts, and margin threshold monitoring.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    nodes: [
      {
        id: 'node-cushion-product',
        title: 'Egg Sitter Honeycomb Gel Seat Cushion',
        subtitle: 'Ergonomics & Home Comfort • 3,800 DZD',
        category: 'Product Library',
        iconType: 'ShoppingBag',
        iconBg: 'bg-emerald-600',
        iconColor: 'text-white',
        x: 60,
        y: 120,
        status: 'active',
        isProduct: true,
        productData: SAMPLE_PRODUCTS[0],
        sectionNumber: 'SECTION 01',
        customInstructions: '',
        hideText: false,
        hideResult: false,
        activePreviewTab: 'preview',
        analysisMode: 'standard',
        metrics: [
          { label: 'Selling', value: '3,800 DZD' },
          { label: 'Cost', value: '1,100 DZD' },
          { label: 'Margin', value: '+71%' },
        ],
        config: {
          name: 'Egg Sitter Cushion Campaign',
          description: 'Sitting on raw egg viral demonstration.',
          campaignObjective: 'Impulse Sales',
          targetAudience: 'Algerian Drivers & Office Workers',
          budget: '4000 DZD',
          budgetPeriod: 'per day',
        },
      },
      {
        id: 'node-tiktok-angles',
        title: 'TikTok Ads',
        subtitle: 'Spark Ads & Short Form Video Creative Strategy',
        category: 'Acquisition',
        iconType: 'tiktok',
        iconBg: 'bg-slate-900',
        iconColor: 'text-white',
        x: 560,
        y: 120,
        status: 'active',
        liveWebResearch: true,
        language: 'English',
        sectionNumber: 'SECTION 02',
        customInstructions: '',
        hideText: false,
        hideResult: false,
        activePreviewTab: 'preview',
        analysisMode: 'standard',
        executionResult: {
          executedAt: '09:20 AM',
          skillName: 'TikTok Ads',
          productName: 'Egg Sitter Honeycomb Gel Seat Cushion',
          language: 'English',
          webResearchUsed: true,
          content: `Product name: Egg Sitter Honeycomb Gel Seat Cushion (Ergonomics & Home Comfort)

Summary:
The ultimate viral demonstration item for TikTok DZ. The visual test of sitting on a raw egg without cracking it creates immediate stop-scroll velocity and high impulse conversions.

Winning Hooks:
1. Video Hook (0-3s): "حطينا حبة بيض وقعدنا فوقها.. واش صرى؟ شوف بعينيك هاد الكوسان السحري!"
2. Chauffeur / Taxi Hook: "يا شوفور، تسوق ساعات طويلة وضهرك يوجعك؟ هاد هو الحل النهائي لي يريحك."
3. Bundle Offer: "اشري 2 والثالثة باطل + التوصيل مجاني لجميع الولايات والدفع عند الاستلام."

Market & COD Logistics:
- Selling Price: 3,800 DZD | Unit Cost: 1,100 DZD | Gross Profit: +2,700 DZD (71%)
- Delivery Rate Target: 75%+ with Yalidine desk pickup incentive.`,
        },
        config: {
          name: 'TikTok Spark Ads Scaler',
          description: 'Viral UGC demonstration videos for taxi drivers and desk workers.',
        },
      },
    ],
    edges: [
      {
        id: 'edge-cushion-tiktok',
        from: 'node-cushion-product',
        to: 'node-tiktok-angles',
        fromAnchor: 'right',
        toAnchor: 'left',
        animated: true,
        label: 'Video Angles',
      },
    ],
    stickyNotes: [
      {
        id: 'sticky-tiktok-1',
        title: 'Video Tip: Film real unboxing in front of an Algerian street or car seat with natural daylight for maximum trust.',
        icon: '🎬',
        x: 560,
        y: 420,
        rotate: 1,
      },
    ],
    panOffset: { x: 40, y: 30 },
    zoom: 85,
  };

  return [project1, project2];
};

// Load all projects with seamless migration of old single-board storage
export const loadBoardProjectsFromStorage = (): BoardProject[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOARD_PROJECTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize any residual Gen Z strings in stored nodes and fix overlapping default skill card X
        return parsed.map((proj: BoardProject) => ({
          ...proj,
          nodes: Array.isArray(proj.nodes)
            ? proj.nodes.map((n) => ({
                ...n,
                x: n.id === 'node-meta-ads' && n.x === 1040 ? 1460 : n.x,
                customInstructions:
                  n.customInstructions === 'Focus on Gen Z buyers and Tiktok Shop performance.'
                    ? ''
                    : (n.customInstructions || ''),
              }))
            : [],
        }));
      }
    }

    // Check if user has legacy single-board data in localStorage to migrate
    let legacyNodes: BoardNode[] = [];
    let legacyEdges: BoardEdge[] = [];
    const savedNodes = localStorage.getItem(OLD_KEY_NODES);
    if (savedNodes) {
      const parsed = JSON.parse(savedNodes);
      if (Array.isArray(parsed) && parsed.length > 0) {
        legacyNodes = parsed.map((n: BoardNode) => ({
          ...n,
          customInstructions:
            n.customInstructions === 'Focus on Gen Z buyers and Tiktok Shop performance.'
              ? ''
              : (n.customInstructions || ''),
        }));
      }
    }
    const savedEdges = localStorage.getItem(OLD_KEY_EDGES);
    if (savedEdges) {
      const parsed = JSON.parse(savedEdges);
      if (Array.isArray(parsed)) legacyEdges = parsed;
    }

    const defaultProjects = createDefaultBoardProjects(legacyNodes, legacyEdges);
    saveBoardProjectsToStorage(defaultProjects);
    return defaultProjects;
  } catch (e) {
    console.warn('Failed to load board projects from storage', e);
    return createDefaultBoardProjects();
  }
};

// Save all projects
export const saveBoardProjectsToStorage = (projects: BoardProject[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_BOARD_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.warn('Failed to save board projects to storage', e);
  }
};

// Load active project ID
export const loadActiveBoardProjectId = (projects: BoardProject[]): string => {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY_BOARD_ACTIVE_ID);
    if (savedId && projects.some((p) => p.id === savedId)) {
      return savedId;
    }
  } catch (e) {
    console.warn('Failed to load active board project ID', e);
  }
  return projects[0]?.id || 'proj_algeria_cod_funnel';
};

// Save active project ID
export const saveActiveBoardProjectId = (id: string) => {
  try {
    localStorage.setItem(STORAGE_KEY_BOARD_ACTIVE_ID, id);
  } catch (e) {
    console.warn('Failed to save active board project ID', e);
  }
};

// Load open tabs
export const loadOpenBoardTabIds = (projects: BoardProject[]): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOARD_OPEN_TABS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const validIds = parsed.filter((id) => projects.some((p) => p.id === id));
        if (validIds.length > 0) return validIds;
      }
    }
  } catch (e) {
    console.warn('Failed to load open board tab IDs', e);
  }
  return projects.map((p) => p.id).slice(0, 3);
};

// Save open tabs
export const saveOpenBoardTabIds = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_BOARD_OPEN_TABS, JSON.stringify(ids));
  } catch (e) {
    console.warn('Failed to save open board tab IDs', e);
  }
};

// Factory to create a new board project
export const createNewBoardProjectOptions = (
  name?: string,
  templateId?: 'blank' | 'algeria_cod' | 'tiktok_scaler'
): BoardProject => {
  const id = `board_proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const title = name?.trim() || `New Board Project ${new Date().toLocaleDateString()}`;

  if (templateId === 'tiktok_scaler') {
    const templates = createDefaultBoardProjects();
    const tiktokTemplate = templates[1];
    return {
      ...tiktokTemplate,
      id,
      name: title,
      createdAt: now,
      updatedAt: now,
    };
  }

  if (templateId === 'algeria_cod') {
    const templates = createDefaultBoardProjects();
    const codTemplate = templates[0];
    return {
      ...codTemplate,
      id,
      name: title,
      createdAt: now,
      updatedAt: now,
    };
  }

  // Blank canvas
  return {
    id,
    name: title,
    description: 'Clean canvas ready for specialized AI skills and funnel creation.',
    createdAt: now,
    updatedAt: now,
    nodes: [],
    edges: [],
    stickyNotes: [],
    panOffset: { x: 60, y: 40 },
    zoom: 85,
  };
};
