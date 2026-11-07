export type NodeCategory =
  | 'acquisition'
  | 'product_intelligence'
  | 'creative'
  | 'conversion'
  | 'algeria_cod'
  | 'analytics'
  | 'automation'
  | 'storage';

export type NodeType =
  // Acquisition
  | 'meta_ads'
  | 'facebook_ads_library'
  | 'tiktok_ads'
  | 'google_search'
  | 'organic_social'
  | 'influencer_traffic'
  | 'seo_traffic'
  | 'direct_traffic'
  | 'lookalike_audience'
  | 'comment_to_dm'
  // Product Intelligence
  | 'product_idea'
  | 'product_research'
  | 'supplier'
  | 'competitor'
  | 'winning_product_signal'
  | 'market_demand'
  | 'customer_pain_point'
  | 'product_score'
  | 'product_validation'
  | 'risk_assessment'
  // Creative Production
  | 'product_image'
  | 'image_analysis'
  | 'ai_image_gen'
  | 'ad_creative'
  | 'video_creative'
  | 'hook_generator'
  | 'copywriting'
  | 'creative_testing'
  | 'creative_performance'
  // Website and Conversion
  | 'shopify_store'
  | 'landing_page'
  | 'product_page'
  | 'lead_form'
  | 'checkout'
  | 'conversion_event'
  | 'abandoned_checkout'
  | 'ab_test'
  // Algeria COD Operations
  | 'new_order'
  | 'order_confirmation'
  | 'whatsapp_confirmation'
  | 'phone_confirmation'
  | 'customer_address'
  | 'wilaya_commune'
  | 'delivery_company'
  | 'dispatch'
  | 'delivered'
  | 'failed_delivery'
  | 'rto'
  | 'customer_refusal'
  // Analytics and Profit
  | 'advertising_spend'
  | 'cost_per_click'
  | 'cost_per_lead'
  | 'cost_per_order'
  | 'confirmation_rate'
  | 'delivery_rate'
  | 'rto_rate'
  | 'revenue'
  | 'product_cost'
  | 'shipping_cost'
  | 'net_profit'
  | 'roas'
  | 'breakeven_cpa'
  | 'customer_ltv'
  // Automation and AI
  | 'ai_agent'
  | 'ai_decision'
  | 'condition'
  | 'filter'
  | 'delay'
  | 'webhook'
  | 'api_request'
  | 'data_transformation'
  | 'notification'
  | 'manual_approval'
  | 'merge'
  | 'split'
  | 'loop'
  // Storage and Output
  | 'database'
  | 'product_record'
  | 'report'
  | 'spreadsheet'
  | 'document'
  | 'export'
  | 'final_recommendation'
  | 'sticky_note';

export type NodeExecutionStatus = 'idle' | 'active' | 'queued' | 'running' | 'completed' | 'failed' | 'error' | 'needs_approval' | 'paused';

export interface HandleConfig {
  id: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  label?: string;
  color?: string;
}

export interface NodeMetrics {
  spend?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
  visitors?: number;
  leads?: number;
  orders?: number;
  confirmedOrders?: number;
  dispatchedOrders?: number;
  deliveredOrders?: number;
  refusedOrders?: number;
  rtoOrders?: number;
  revenue?: number;
  netProfit?: number;
  margin?: number;
  score?: number;
  roas?: number;
  deliveryRate?: number;
  confirmationRate?: number;
  rtoRate?: number;
  cpa?: number;
  breakevenCpa?: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  category: NodeCategory;
  title: string;
  subtitle?: string;
  description?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sizeMode: 'compact' | 'standard' | 'expanded';
  status: NodeExecutionStatus;
  accentColor?: string;
  audienceBadge?: string; // e.g. "40K", "2.6K", "982"
  tags?: string[];
  metrics: NodeMetrics;
  data: Record<string, any>;
  customPreview?: {
    type: 'browser' | 'doc' | 'product' | 'ai' | 'stats';
    url?: string;
    imageUrl?: string;
    headline?: string;
    tagline?: string;
    score?: number;
  };
  handles: {
    inputs: HandleConfig[];
    outputs: HandleConfig[];
  };
  automation?: {
    trigger: 'immediate' | 'on_upstream_complete' | 'schedule' | 'manual';
    condition?: string;
    actionType: string;
    requiresApproval: boolean;
    retryCount?: number;
    prompt?: string;
    aiModel?: string;
    lastResult?: string;
  };
  history?: Array<{
    timestamp: string;
    status: NodeExecutionStatus;
    message: string;
  }>;
}

export interface WorkflowEdge {
  id: string;
  source: string; // source node id
  sourceHandle?: string;
  target: string; // target node id
  targetHandle?: string;
  label?: string;
  conversionRate?: number; // e.g., 1.8 (%)
  trafficVolume?: number; // e.g., 720
  trafficLabel?: string; // e.g., "720 ppl"
  hasDropoff?: boolean;
  dropoffCount?: number; // e.g., 39300
  dropoffLabel?: string; // e.g., "-39.3K"
  color?: string; // hex color or preset: blue, green, purple, orange, red, gray
  condition?: string;
  animated?: boolean;
  particleType?: 'person' | 'dot' | 'pulse';
  particleSpeed?: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  supplierName: string;
  supplierUrl?: string;
  supplierCost: number; // in DZD or USD
  internationalShippingCost: number;
  importHandlingCost: number;
  localSellingPriceDZD: number;
  competitorSellingPrices: number[];
  estimatedDemand: 'High' | 'Medium' | 'Low';
  competitorCount: number;
  targetCustomer: string;
  customerPainPoint: string;
  uniqueSellingProposition: string;
  productRisks: string[];
  evidenceSources: string[];
  researchDate: string;
  productScore: number; // 0-100
  testingStatus: 'Idea' | 'Testing' | 'Validated' | 'Scaling' | 'Dropped';
  notes?: string;
}

export interface WorkflowProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  settings: {
    currency: 'DZD' | 'USD' | 'EUR';
    snapToGrid: boolean;
    gridSize: number;
    animationsEnabled: boolean;
    particleSpeed: number; // 1 = normal, 0.5 = slow, 2 = fast
    particleDensity: number; // number of traveling icons
    particleStyle: 'people' | 'dots' | 'hybrid';
  };
  productRecord?: ProductRecord;
}

export interface AlgerianWilayaData {
  code: number;
  name: string;
  nameAr: string;
  region: 'Centre' | 'Est' | 'Ouest' | 'Sud' | 'Grand Sud';
  deliveryFee: number; // in DZD
  returnFee: number; // in DZD
  avgDeliveryRate: number; // percent
  avgConfirmationRate: number; // percent
}
