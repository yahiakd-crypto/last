import { WorkflowProject } from '../types/workflow';
import { WORKFLOW_TEMPLATES } from './templates';

export const CANVAS_LIBRARY_STORAGE_KEY = 'product_intelligence_os_canvases_library_v2';
export const OPEN_CANVASES_STORAGE_KEY = 'product_intelligence_os_open_canvases_v2';
export const ACTIVE_CANVAS_STORAGE_KEY = 'product_intelligence_os_active_canvas_id_v2';

// 4th Starter Template: TikTok Organic & Flash Sale Funnel
export const TIKTOK_VIRAL_CANVAS: WorkflowProject = {
  id: 'canvas_tiktok_viral_cod',
  name: 'TikTok Viral & Flash Sale COD',
  description: 'Organic TikTok UGC video campaign paired with fast WhatsApp verification and Yalidine Express courier dispatch for trending beauty & gadgets.',
  createdAt: '2026-10-22T08:30:00Z',
  updatedAt: '2026-10-22T09:15:00Z',
  viewport: { x: 80, y: 120, zoom: 0.85 },
  settings: {
    currency: 'DZD',
    snapToGrid: true,
    gridSize: 16,
    animationsEnabled: true,
    particleSpeed: 1.2,
    particleDensity: 4,
    particleStyle: 'people',
  },
  nodes: [
    {
      id: 'tt_node_ugc',
      type: 'organic_social',
      category: 'acquisition',
      title: 'TikTok UGC Video',
      subtitle: 'Viral Algerian Hook',
      description: '3 daily creator unboxings showcasing pain point solution in Algerian Darja.',
      x: 80,
      y: 120,
      width: 270,
      height: 140,
      sizeMode: 'standard',
      status: 'completed',
      accentColor: '#000000',
      audienceBadge: '180K Views',
      metrics: { visitors: 18000, ctr: 4.8 },
      data: { platform: 'TikTok Algeria', sound: 'Trending Algerian Audio', viralityScore: 92 },
      handles: { inputs: [], outputs: [{ id: 'out', position: 'right' }] },
    },
    {
      id: 'tt_node_dm',
      type: 'comment_to_dm',
      category: 'acquisition',
      title: 'Auto Comment to DM',
      subtitle: 'Price Request Bot',
      description: 'Instant response bot triggering WhatsApp link when prospect comments "Prix" or "Chkoun".',
      x: 420,
      y: 120,
      width: 270,
      height: 140,
      sizeMode: 'standard',
      status: 'completed',
      accentColor: '#8B5CF6',
      audienceBadge: '3.4K DMs',
      metrics: { leads: 3400, ctr: 68.0 },
      data: { triggerKeyword: 'Prix, Combien', responseTimeSec: 2 },
      handles: { inputs: [{ id: 'in', position: 'left' }], outputs: [{ id: 'out', position: 'right' }] },
    },
    {
      id: 'tt_node_flash_page',
      type: 'landing_page',
      category: 'conversion',
      title: 'Flash Sale COD Page',
      subtitle: '48H Discount Timer',
      description: 'Fast mobile landing page with urgency countdown and 2-click COD order form.',
      x: 760,
      y: 120,
      width: 280,
      height: 190,
      sizeMode: 'expanded',
      status: 'completed',
      accentColor: '#EF4444',
      audienceBadge: '1.8K Orders',
      customPreview: {
        type: 'browser',
        url: 'tendance.dz/flash-deal',
        headline: 'Vente Flash 48H - 45% Réduction',
        tagline: 'Paiement à la livraison dans 58 wilayas',
      },
      metrics: { visitors: 3400, orders: 480, ctr: 14.1 },
      data: { countdownMinutes: 48, orderFormFields: ['Nom', 'Wilaya', 'Téléphone'] },
      handles: { inputs: [{ id: 'in', position: 'left' }], outputs: [{ id: 'out', position: 'right' }] },
    },
    {
      id: 'tt_node_whatsapp',
      type: 'whatsapp_confirmation',
      category: 'algeria_cod',
      title: 'WhatsApp Automation',
      subtitle: 'Agent Call Center',
      description: 'Quick address verification via automated template message in Algerian Darija.',
      x: 1100,
      y: 120,
      width: 270,
      height: 140,
      sizeMode: 'standard',
      status: 'completed',
      accentColor: '#10B981',
      audienceBadge: '430 Confirmed',
      metrics: { confirmationRate: 89.5, confirmedOrders: 430 },
      data: { templateLang: 'Darija/French', autoReply: true },
      handles: { inputs: [{ id: 'in', position: 'left' }], outputs: [{ id: 'out', position: 'right' }] },
    },
    {
      id: 'tt_node_courier',
      type: 'delivery_company',
      category: 'algeria_cod',
      title: 'Yalidine Express',
      subtitle: '58 Wilayas COD',
      description: 'Automated parcel pickup, tracking sync, and COD cash remittance to CCP/BaridiMob.',
      x: 1440,
      y: 120,
      width: 270,
      height: 140,
      sizeMode: 'standard',
      status: 'completed',
      accentColor: '#0EA5E9',
      audienceBadge: '92% Delivery',
      metrics: { deliveryRate: 92.0, deliveredOrders: 395, netProfit: 462000 },
      data: { courier: 'Yalidine', apiSync: 'Active', settlementCycle: 'Weekly' },
      handles: { inputs: [{ id: 'in', position: 'left' }], outputs: [] },
    },
  ],
  edges: [
    {
      id: 'edge_tt_1',
      source: 'tt_node_ugc',
      sourceHandle: 'out',
      target: 'tt_node_dm',
      targetHandle: 'in',
      trafficVolume: 3400,
      trafficLabel: '3.4K DMs',
      conversionRate: 18.8,
      animated: true,
      color: '#8B5CF6',
    },
    {
      id: 'edge_tt_2',
      source: 'tt_node_dm',
      sourceHandle: 'out',
      target: 'tt_node_flash_page',
      targetHandle: 'in',
      trafficVolume: 1800,
      trafficLabel: '1.8K Visitors',
      conversionRate: 52.9,
      animated: true,
      color: '#EF4444',
    },
    {
      id: 'edge_tt_3',
      source: 'tt_node_flash_page',
      sourceHandle: 'out',
      target: 'tt_node_whatsapp',
      targetHandle: 'in',
      trafficVolume: 480,
      trafficLabel: '480 Leads',
      conversionRate: 26.6,
      animated: true,
      color: '#10B981',
    },
    {
      id: 'edge_tt_4',
      source: 'tt_node_whatsapp',
      sourceHandle: 'out',
      target: 'tt_node_courier',
      targetHandle: 'in',
      trafficVolume: 430,
      trafficLabel: '430 Dispatched',
      conversionRate: 89.5,
      animated: true,
      color: '#0EA5E9',
    },
  ],
};

// Generate initial default canvases
export function getDefaultCanvases(): WorkflowProject[] {
  const templates = WORKFLOW_TEMPLATES.map((t) => ({
    ...t.project,
    id: t.id,
    name: t.name,
    description: t.description,
  }));

  return [
    templates[0], // Algeria COD - Complete Funnel (17 nodes)
    templates[1], // Product Intelligence Pipeline (8 nodes)
    templates[2], // Meta Ads & Creative Testing
    TIKTOK_VIRAL_CANVAS, // TikTok Viral & Flash Sale COD (5 nodes)
  ];
}

// Load canvases from localStorage or initialize defaults
export function loadCanvasesFromStorage(): WorkflowProject[] {
  try {
    const raw = localStorage.getItem(CANVAS_LIBRARY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load canvases from storage:', err);
  }

  // Fallback: check legacy single project key
  try {
    const legacy = localStorage.getItem('product_intelligence_os_active_project');
    if (legacy) {
      const parsedLegacy = JSON.parse(legacy);
      if (parsedLegacy?.nodes && parsedLegacy?.edges) {
        const defaults = getDefaultCanvases();
        defaults[0] = { ...defaults[0], ...parsedLegacy };
        return defaults;
      }
    }
  } catch (err) {
    console.error('Legacy project parse error:', err);
  }

  return getDefaultCanvases();
}

// Save canvases to localStorage
export function saveCanvasesToStorage(canvases: WorkflowProject[]) {
  try {
    localStorage.setItem(CANVAS_LIBRARY_STORAGE_KEY, JSON.stringify(canvases));
  } catch (err) {
    console.error('Failed to save canvases to storage:', err);
  }
}

// Load open canvas tab IDs
export function loadOpenCanvasIds(canvases: WorkflowProject[]): string[] {
  try {
    const raw = localStorage.getItem(OPEN_CANVASES_STORAGE_KEY);
    if (raw) {
      const ids: string[] = JSON.parse(raw);
      // Filter only existing canvases
      const validIds = ids.filter((id) => canvases.some((c) => c.id === id));
      if (validIds.length > 0) return validIds;
    }
  } catch (err) {
    console.error('Failed to load open canvas tab IDs:', err);
  }
  // Default: first 3 canvases open in tabs
  return canvases.slice(0, 3).map((c) => c.id);
}

// Save open canvas tab IDs
export function saveOpenCanvasIds(ids: string[]) {
  try {
    localStorage.setItem(OPEN_CANVASES_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Failed to save open canvas tab IDs:', err);
  }
}

// Load active canvas ID
export function loadActiveCanvasId(canvases: WorkflowProject[]): string {
  try {
    const id = localStorage.getItem(ACTIVE_CANVAS_STORAGE_KEY);
    if (id && canvases.some((c) => c.id === id)) {
      return id;
    }
  } catch (err) {
    console.error('Failed to load active canvas ID:', err);
  }
  return canvases[0]?.id || 'algeria_cod_complete_funnel';
}

// Save active canvas ID
export function saveActiveCanvasId(id: string) {
  try {
    localStorage.setItem(ACTIVE_CANVAS_STORAGE_KEY, id);
  } catch (err) {
    console.error('Failed to save active canvas ID:', err);
  }
}

// Factory to create a new canvas
export function createNewCanvasOptions(
  name: string,
  templateId?: string,
  currency: 'DZD' | 'USD' | 'EUR' = 'DZD'
): WorkflowProject {
  const timestamp = new Date().toISOString();
  const id = `canvas_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (templateId) {
    if (templateId === 'tiktok_viral') {
      return {
        ...TIKTOK_VIRAL_CANVAS,
        id,
        name: name || TIKTOK_VIRAL_CANVAS.name,
        createdAt: timestamp,
        updatedAt: timestamp,
        settings: {
          ...TIKTOK_VIRAL_CANVAS.settings,
          currency,
        },
      };
    }

    const found = WORKFLOW_TEMPLATES.find((t) => t.id === templateId);
    if (found) {
      return {
        ...found.project,
        id,
        name: name || found.name,
        createdAt: timestamp,
        updatedAt: timestamp,
        settings: {
          ...found.project.settings,
          currency,
        },
      };
    }
  }

  // Blank canvas
  return {
    id,
    name: name || 'Untitled Workflow Canvas',
    description: 'Custom e-commerce workflow created in Product Intelligence OS.',
    createdAt: timestamp,
    updatedAt: timestamp,
    viewport: { x: 50, y: 50, zoom: 0.8 },
    settings: {
      currency,
      snapToGrid: true,
      gridSize: 16,
      animationsEnabled: true,
      particleSpeed: 1,
      particleDensity: 4,
      particleStyle: 'people',
    },
    nodes: [],
    edges: [],
  };
}
