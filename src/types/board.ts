export interface ProductLibraryItem {
  id: string;
  title: string;
  subtitle: string;
  niche: string;
  image: string;
  sellingPrice: number;
  productCost: number;
  profitMargin: number;
  sellingPoints: string;
  description: string;
  stock: number;
}

export const SAMPLE_PRODUCTS: ProductLibraryItem[] = [
  {
    id: 'prod-egg-sitter',
    title: 'Egg Sitter-style Honeycomb Gel Seat Cushion',
    subtitle: 'Branded original: Egg Sitter Support Cushion by BulbHead with breathable honeycomb design.',
    niche: 'Ergonomics & Home Comfort',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a9927b74b7?w=300&h=300&fit=crop',
    sellingPrice: 3800,
    productCost: 1100,
    profitMargin: 71,
    sellingPoints: 'Absorbs pressure points, egg-test demonstration hook, ultra-flex polymer, washable non-slip cover.',
    description: 'Proven globally commoditized ergonomic cushion with instant demonstration appeal for drivers and office workers.',
    stock: 580,
  },
  {
    id: 'prod-scaler',
    title: 'Electric Ultrasonic Dental Scaler Pro',
    subtitle: 'At-home professional calculus & plaque remover with 5 frequency modes.',
    niche: 'Personal Care & Health',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=300&h=300&fit=crop',
    sellingPrice: 4800,
    productCost: 1400,
    profitMargin: 71,
    sellingPoints: 'IPX6 Waterproof, Medical Grade Alloy Head, USB Rechargeable, 30-day battery life.',
    description: 'High-converting personal care item in Algerian COD market with viral TikTok video angles.',
    stock: 420,
  },
  {
    id: 'prod-camera',
    title: '4K Dual-Lens Wireless Security Camera',
    subtitle: 'Solar-powered 360° PTZ camera with 4G SIM and two-way intercom.',
    niche: 'Smart Home & Security',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=300&h=300&fit=crop',
    sellingPrice: 7500,
    productCost: 2800,
    profitMargin: 63,
    sellingPoints: 'Color Night Vision, PIR Humanoid Motion Detection, No Wiring Required, Solar Continuous Power.',
    description: 'Top seller for Algerian villas, warehouses, and farms with high perceived value.',
    stock: 180,
  },
  {
    id: 'prod-washer',
    title: 'Cordless High-Pressure Car & Garden Washer',
    subtitle: 'Portable 48V rechargeable high pressure water gun with foam tank.',
    niche: 'Automotive & Hardware',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=300&h=300&fit=crop',
    sellingPrice: 6200,
    productCost: 2100,
    profitMargin: 66,
    sellingPoints: 'Draws water from any bucket or lake, 30 Bar pressure, 2 interchangeable spray nozzles.',
    description: 'Huge utility factor for Algerian car owners and garage hobbyists.',
    stock: 250,
  },
  {
    id: 'prod-massager',
    title: 'Smart Cervical Spine & Neck Massager',
    subtitle: 'Electromagnetic pulse & constant temperature infrared heat therapy.',
    niche: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    sellingPrice: 3900,
    productCost: 1200,
    profitMargin: 69,
    sellingPoints: 'TENS/EMS Dual Pulse, 15 Intensity Levels, 42°C Hot Compress, Ergonomic U-Shape.',
    description: 'Immediate relief for office workers, drivers, and elders with stiff neck tension.',
    stock: 540,
  },
  {
    id: 'prod-snore',
    title: 'Anti-Snoring Smart Micro-CPAP Device',
    subtitle: 'Electronic quiet sleep aid with dual vortex micro air pump technology.',
    niche: 'Sleep & Medical',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
    sellingPrice: 4200,
    productCost: 1300,
    profitMargin: 69,
    sellingPoints: 'Soft Medical Silicone, PM2.5 Air Filter, Silent Operation, Improves Deep REM Sleep.',
    description: 'High emotional relief angle solving marital sleep disruptions.',
    stock: 310,
  },
  {
    id: 'prod-slicer',
    title: 'Pro Stainless Steel Vegetable Mandoline Slicer',
    subtitle: 'Multi-functional food chopper and shredder with safe hand guard.',
    niche: 'Kitchen & Dining',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=300&h=300&fit=crop',
    sellingPrice: 3400,
    productCost: 1100,
    profitMargin: 68,
    sellingPoints: 'Rustproof 420 Stainless Steel, 8 Sharp Blades, Non-Slip Base, Dishwasher Safe.',
    description: 'Viral kitchen gadget showing fast preparation of salads and traditional Algerian dishes.',
    stock: 600,
  },
];

export type FileType = 'image' | 'pdf' | 'word' | 'json' | 'excel';

export interface UploadedFileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadedAt: string;
  url?: string;
  previewUrl?: string;
  textContent?: string;
  jsonData?: any;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
    totalRows: number;
  };
  summary?: string;
  tags?: string[];
}

export interface CustomSkillItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryId?: string;
  promptTemplate: string;
  iconType?: string;
  iconBg?: string;
  iconColor?: string;
  createdAt: string;
  isCustom: boolean;
}

export const DEFAULT_UPLOADED_FILES: UploadedFileItem[] = [
  {
    id: 'file-wilaya-stats',
    name: 'algeria_cod_wilaya_delivery_rates.xlsx',
    type: 'excel',
    size: 24576,
    uploadedAt: 'Today, 14:20',
    summary: 'Wilaya-by-wilaya COD delivery success, RTO rates, and carrier performance across Algeria.',
    tags: ['COD Logistics', 'Wilayas', 'Delivery %', 'Yalidine'],
    tableData: {
      headers: ['Wilaya Code & Name', 'Zone', 'Delivery Rate (%)', 'RTO Refusal (%)', 'Avg Lead Time', 'Primary Carrier', 'Avg COD Basket (DZD)'],
      rows: [
        ['16 - Alger (Capital)', 'Centre', '91.4%', '8.6%', '24h', 'Yalidine / ZR Express', '4,850 DZD'],
        ['31 - Oran', 'Ouest', '88.2%', '11.8%', '36h', 'Yalidine Express', '5,100 DZD'],
        ['25 - Constantine', 'Est', '86.7%', '13.3%', '48h', 'ZR Express / Kazitour', '4,400 DZD'],
        ['19 - Sétif', 'Hauts Plateaux', '89.1%', '10.9%', '36h', 'Nord & Sud Express', '4,750 DZD'],
        ['09 - Blida', 'Centre', '90.3%', '9.7%', '24h', 'Yalidine Express', '4,900 DZD'],
        ['23 - Annaba', 'Est', '85.4%', '14.6%', '48h', 'ZR Express', '4,300 DZD'],
        ['13 - Tlemcen', 'Ouest', '87.0%', '13.0%', '48h', 'Yalidine Express', '4,650 DZD'],
        ['05 - Batna', 'Aures', '84.8%', '15.2%', '48h', 'Kazitour / Yalidine', '4,200 DZD'],
        ['30 - Ouargla / Hassi M.', 'Sud', '79.5%', '20.5%', '72h', 'Nord & Sud Express', '6,200 DZD'],
        ['35 - Boumerdès', 'Centre', '89.8%', '10.2%', '24h', 'ZR Express', '4,800 DZD'],
      ],
      totalRows: 58,
    },
  },
  {
    id: 'file-competitor-pdf',
    name: 'competitor_tiktok_ad_audit_algeria.pdf',
    type: 'pdf',
    size: 421800,
    uploadedAt: 'Yesterday, 18:45',
    summary: 'Competitor tear-down of 15 viral Algerian TikTok & Instagram ad hooks with hook retention graphs.',
    tags: ['Competitor Intel', 'TikTok Ads', 'Algerian Darja Hooks', 'UGC'],
    textContent: `COMPETITIVE ADVERTISING INTELLIGENCE REPORT - ALGERIA COD MARKET
Scope: Top 15 scaling e-commerce dropshipping & brand campaigns in Algeria (Q1-Q2).

Key Finding 1: The "Problem-Demonstration-Urgency" hook structure in Algerian Darja ("يا خويا شفت هذا المشكل؟ الحل راهو هنا") beats French-only ads by 3.4x in ROAS across wilayas outside Alger centre.
Key Finding 2: Video ads featuring real unboxing and tactile demonstrations (e.g. scraping plaque for scalers, or sitting on egg cushion) have a 68% 3-second hook retention rate.
Key Finding 3: Offer bundling (Buy 2 get Free Shipping + 10% discount) increases Average Order Value from 3,800 DZD to 6,400 DZD while dropping cancellation rate by 14%.
Top Competitor Angles:
- Angle A: "Livraison 58 Wilayas + Paiement à la réception avec vérification avant de payer"
- Angle B: "Garantie 30 jours + Échange gratuit si non satisfait"
- Angle C: Scarcity countdown with limited stock in local depot (Alger/Blida).`,
  },
  {
    id: 'file-call-center-doc',
    name: 'customer_support_call_transcripts.docx',
    type: 'word',
    size: 118400,
    uploadedAt: '2 days ago',
    summary: 'Real telephone confirmation call logs from Algerian tele-operators with customer objection patterns.',
    tags: ['Call Center', 'Customer Voice', 'Confirmation Script', 'Objections'],
    textContent: `ALGERIAN COD CALL CENTER CONFIRMATION AUDIT (TRANSCRIPTS SAMPLE)
Session: 150 Recorded Outbound Confirmation Calls

Common Objections & Field Solutions:
1. "Chhal la livraison lel wilaya ta3i?" (How much is delivery to my wilaya?)
   Operator best practice: Quote bundled total immediately: "Le total c'est 4,800 DA produit + livraison offerte jusqu'au domicile".
2. "Est-ce que na9der nchouf l produit 9bel ma nkhellas?" (Can I open/inspect the parcel before paying?)
   Crucial factor: 92% of customers ask this. Confirmation teams must explicitly state: "Oui bien sûr, avec notre livreur vous vérifiez l'emballage et la conformité".
3. Refusal Reasons during delivery:
   - Delayed delivery (> 48h in remote wilayas) -> 38% of refusals.
   - Client unreachable by courier on phone -> 41% of returns.
   - Spousal dispute / duplicate order -> 21%.
Recommendation: Send automated SMS confirmation + WhatsApp GPS location ping immediately after phone call.`,
  },
  {
    id: 'file-meta-audiences-json',
    name: 'meta_pixel_audiences_algeria.json',
    type: 'json',
    size: 18200,
    uploadedAt: 'Oct 22, 2026',
    summary: 'Meta pixel audience definitions, demographic segments, and high-LTV interests for Algeria.',
    tags: ['Meta Ads', 'Lookalike', 'Demographics', 'Pixel Data'],
    jsonData: {
      market: 'Algeria (DZ)',
      currency: 'DZD',
      target_population: 44000000,
      active_social_users: 26500000,
      platforms: ['Facebook', 'Instagram', 'TikTok'],
      demographics: {
        age_brackets: {
          '18-24': { share: '32%', intent: 'Impulse, Viral Beauty & Gadgets' },
          '25-34': { share: '41%', intent: 'Primary Buyers, High Disposable Income, Home & Tech' },
          '35-49': { share: '21%', intent: 'Family, Health, Kitchen, Security' },
          '50+': { share: '6%', intent: 'Pain Relief, Wellness' },
        },
        top_provinces_by_purchasing_power: [
          '16 - Alger',
          '31 - Oran',
          '09 - Blida',
          '19 - Sétif',
          '25 - Constantine',
        ],
      },
      recommended_ad_spend_split: {
        broad_targeting_dz: '60%',
        interest_clusters: '25%',
        retargeting_engaged: '15%',
      },
    },
  },
  {
    id: 'file-product-photo',
    name: 'product_packshot_scaler_hd.png',
    type: 'image',
    size: 524000,
    uploadedAt: 'Oct 20, 2026',
    summary: 'High-definition unboxing packshot with 5-head accessory attachments and waterproof body.',
    tags: ['Creative Asset', 'Packshot', 'Dental Scaler', 'High Res'],
    previewUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop',
  },
];

export interface TextStyleConfig {
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontSizeScale?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  lineHeight?: 'tight' | 'normal' | 'relaxed';
  fontFamily?: 'sans' | 'serif' | 'mono';
  colorTheme?: 'default' | 'emerald' | 'purple' | 'amber' | 'contrast';
}

export interface BoardNode {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  iconType: string;
  iconBg: string;
  iconColor: string;
  x: number;
  y: number;
  status: 'active' | 'idle' | 'paused';
  metrics?: { label: string; value: string }[];
  liveWebResearch?: boolean;
  language?: string;
  isProduct?: boolean;
  productData?: {
    image?: string;
    sellingPrice?: number;
    productCost?: number;
    profitMargin?: number;
    niche?: string;
    targetAudience?: string;
    sellingPoints?: string;
    description?: string;
  };
  isFile?: boolean;
  fileData?: UploadedFileItem;
  isCustomSkill?: boolean;
  customPromptTemplate?: string;
  isAppNode?: boolean;
  appType?:
    | 'text_to_image'
    | 'image_to_text'
    | 'text_to_storyboard'
    | 'text_to_video_script'
    | 'text_to_scene_video'
    | 'product_regrouper'
    | 'text_to_code_landing_page'
    | 'text_to_image_landing_page'
    | 'landing_page_generator'
    | 'cro_mobile_landing_page'
    | 'omni_skill_master_synthesizer'
    | 'verde_landing_page_builder';
  isMasterSynthesizer?: boolean;
  appData?: any;
  executionResult?: {
    executedAt: string;
    skillName: string;
    productName: string;
    language: string;
    webResearchUsed: boolean;
    content: string;
    isSimulated?: boolean;
  };
  customInstructions?: string;
  hideText?: boolean;
  hideResult?: boolean;
  previewEngine?: 'chatgpt' | 'classic';
  activePreviewTab?: 'chatgpt' | 'preview' | 'workflow' | 'analytics' | 'doc' | 'prompt' | 'json';
  previewDirection?: 'ltr' | 'rtl';
  previewSide?: 'bottom' | 'left' | 'right';
  analysisMode?: 'standard' | 'deep' | 'express';
  targetMarket?: string;
  sectionNumber?: string;
  textStyle?: TextStyleConfig;
  width?: number;
  height?: number;
  isExpandedDown?: boolean;
  tags?: string[];
  config: {
    name: string;
    description: string;
    campaignObjective?: string;
    targetAudience?: string;
    budget?: string;
    budgetPeriod?: string;
    autoOptimization?: boolean;
    trackConversions?: boolean;
    saveAdsToLibrary?: boolean;
    customPrompt?: string;
    savedPrompts?: SavedPromptItem[];
    activePromptId?: string;
  };
}

export interface SavedPromptItem {
  id: string;
  name: string;
  prompt: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface BoardShape {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  color: string;
  opacity: number;
  strokeColor?: string;
  locked?: boolean;
  fontSize?: number;
  isTransparent?: boolean;
  borderStyle?: 'dashed' | 'solid' | 'dotted';
}

export interface BoardEdge {
  id: string;
  from: string;
  to: string;
  fromAnchor?: 'right' | 'bottom' | 'top' | 'left';
  toAnchor?: 'left' | 'top' | 'bottom' | 'right';
  fromSubId?: string;
  toSubId?: string;
  pillMain?: string;
  pillSub?: string;
  style?: 'solid' | 'dashed';
  arrow?: boolean;
  animated?: boolean;
  label?: string;
}

export interface BoardStickyNote {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  rotate?: number;
  color?: string;
  textColor?: string;
  type?: 'sticky' | 'heading' | 'callout' | 'task' | 'table';
  fontSize?: number;
  status?: 'To do' | 'In progress' | 'Done';
  author?: string;
  assignee?: string;
  width?: number;
  height?: number;
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface BoardProject {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  nodes: BoardNode[];
  edges: BoardEdge[];
  stickyNotes: BoardStickyNote[];
  shapes?: BoardShape[];
  panOffset: { x: number; y: number };
  zoom: number;
}

// Default prompt generator for any skill card with domain-specific requirements
export const getDefaultPromptForNode = (nodeTitle: string, nodeSubtitle?: string) => {
  const t = (nodeTitle || '').toLowerCase();
  const st = (nodeSubtitle || '').toLowerCase();

  if (t === 'text to workflow' || t.includes('text to workflow') || t.includes('workflow chart')) {
    return `You are an elite E-commerce Media Buying & Systems Architect.
Execute the specialized "Text to Workflow" skill for "{product_title}".
Convert the strategic input, attached files ({file_data}), and market requirements into an exhaustive, visually connected 3-Tier Campaign-to-Ad Workflow Architecture.

Structure your response with this clean hierarchy so it parses perfectly into the Visual Workflow Flowchart:

Product name: {product_title}

Summary:
[Executive summary explaining the entire full-funnel workflow logic, budget strategy, and why this hierarchy maximizes profitability and minimizes COD returns in Algeria]

CAMPAIGN LEVEL:
- Objective: Sales / Purchase Conversions (Advantage+ CBO)
- Daily Budget: 6,000 DZD / day
- Bid Strategy: Highest Volume (ROAS Floor 3.2x)
- Market Scope: Algeria National 58 Wilayas (Yalidine / ZR Express)
- Optimization Goal: Purchase (COD Verified Order)
- Architecture Thesis: [Deep strategic explanation on how CBO dynamically distributes capital to winning ad sets and how returns are mitigated]

AD SET 1 - BROAD TESTING:
- Audience: Broad Open Targeting (Age 20-55+, Men & Women, All 58 Wilayas)
- Budget Split: 2,500 DZD / day (42%)
- Placements: Advantage+ Placements (Meta Reels, Feeds & TikTok For You)
- Target Wilayas: Alger (16), Oran (31), Blida (09), Sétif (19), Constantine (25)
- Strategy Explanation: [Step explanation on why broad testing isolates algorithmic buyer clusters without interest saturation]

AD CREATIVE 1 (UNDER AD SET 1):
- Format: 9:16 Vertical Video (Reels/TikTok)
- Hook Angle: "Raw Proof & Shock Pattern Interrupt"
- Hook Script: [Winning viral hook script written 100% in {language}]
- Visual Script Note: 0-3s close-up physical demonstration of the product problem/benefit without intro preamble.
- Call To Action: "Commander Maintenant - الدفع عند الاستلام بعد معاينة الطرد"
- Strategy Explanation: [Step explanation on why this creative converts in the first 3 seconds]

AD CREATIVE 2 (UNDER AD SET 1):
- Format: 9:16 Vertical UGC Video
- Hook Angle: "Problem-Agitation-Solution Angle"
- Hook Script: [Relatable pain relief script in {language}]
- Visual Script Note: Human reaction showing frustration with old methods, followed by instant relief.
- Call To Action: "Profiter de l'Offre Spéciale"
- Strategy Explanation: [Step explanation on pain point resolution]

AD SET 2 - HIGH-INTENT INTERESTS:
- Audience: Stacked Interest Cluster ({niche}, Online Shopping, Gadgets, Home Comfort)
- Budget Split: 2,000 DZD / day (33%)
- Placements: Facebook & Instagram Feeds
- Target Wilayas: National 58 Wilayas
- Strategy Explanation: [Step explanation on why stacked interests capture frequent online buyers with high purchasing power]

AD CREATIVE 3 (UNDER AD SET 2):
- Format: 9:16 Video / Carousel Showcase
- Hook Angle: "COD Trust & Inspection Guarantee"
- Hook Script: [Trust-building script in {language} emphasizing opening parcel before paying]
- Visual Script Note: Courier handing parcel, customer verifying product with satisfaction.
- Call To Action: "Commander sans Risque (COD)"
- Strategy Explanation: [Step explanation on eliminating fear of fraudulent goods]

AD SET 3 - RETARGETING & OFFER BUNDLES:
- Audience: Video Viewers 75% (last 14d) + Landing Page Visitors
- Budget Split: 1,500 DZD / day (25%)
- Placements: Reels, Feeds & Stories
- Target Wilayas: Top Purchasing Centers (Alger, Oran, Blida, Setif, Constantine)
- Strategy Explanation: [Step explanation on warm audience retargeting with multi-pack savings]

AD CREATIVE 4 (UNDER AD SET 3):
- Format: Square / Carousel 1:1 + Video
- Hook Angle: "Pack Duo & Urgency Scarcity Offer"
- Hook Script: [Bundle incentive script in {language}: Buy 2 and save 1,500 DZD + Free Delivery]
- Visual Script Note: Side-by-side savings comparison with stock countdown badge.
- Call To Action: "Réclamer le Pack Promo"
- Strategy Explanation: [Step explanation on increasing Average Order Value (AOV)]

CRITICAL SINGLE-LANGUAGE ENFORCEMENT:
Write the ENTIRE response 100% EXCLUSIVELY in {language}.`;
  }

  // 1. Product Discovery & Winning Product Finder
  if (t.includes('discovery') || t.includes('winning') || t.includes('finder') || t.includes('demand') || t.includes('trend')) {
    return `Execute the specialized product intelligence skill "${nodeTitle}" for "{product_title}".

Product Information:
- Niche: {niche}
- Selling Price: {selling_price} DZD | Product Cost: {product_cost} DZD | Margin: {profit_margin}%
- Description & Selling Points: {description} ({selling_points})

Requirements:
1. Executive Summary detailing commercial viability, demand signals, and target market suitability in {target_market}.
2. Product Opportunity Scoring Table formatted as:
| 🎯 Metric | Value | Why it matters |
Include Demand Score (/10), Wow Factor (/10), Problem Severity (/10), Profit Margin (/10), Risk (/10), and Total Score (/50).
3. Market Validation Criteria Table:
| Validation Criteria | Benchmark | Product Status | Risk Level |
4. Buyer Urgency, competitive saturation assessment, and final launch verdict.

Write the ENTIRE output 100% EXCLUSIVELY in {language}. Use structured Markdown tables and clear headings.`;
  }

  // 2. Product Deep Dive & Technical Breakdown
  if (t.includes('deep dive') || t.includes('technical') || t.includes('spec') || t.includes('anatomy') || t.includes('quality')) {
    return `Execute the specialized technical & practical product breakdown skill "${nodeTitle}" for "{product_title}".

Product Information:
- Niche: {niche}
- Selling Price: {selling_price} DZD | Product Cost: {product_cost} DZD | Margin: {profit_margin}%
- Description & Selling Points: {description} ({selling_points})

Requirements:
1. Executive Summary evaluating product ergonomics, build quality, and customer perceived value.
2. Value Proposition & Positioning Tree diagram using formatted ASCII indentation:
\`\`\`
USP → Value Prop → Positioning → Pricing
   ├─ Primary USP
   │   ├─ Alleviates Core Pain Point
   │   │   ├─ Target Segment 1
   │   │   └─ Target Segment 2
   └─ Secondary Value Angle
\`\`\`
3. Technical Specifications & Materials Table:
| Component / Feature | Material / Specification | Quality Grade | Durability Impact |
4. Product Failure Points & Return Prevention Table:
| Potential Issue / Defect | Failure Risk % | Packaging & Quality Fix | Courier Delivery Guidance |

Write the ENTIRE output 100% EXCLUSIVELY in {language}. Use structured Markdown tables and clear headings.`;
  }

  // 3. Customer Avatar & Strategy / Why People Buy
  if (t.includes('avatar') || t.includes('persona') || t.includes('strategy') || t.includes('positioning') || t.includes('buyer') || t.includes('why people buy') || t.includes('why buy') || t.includes('audience')) {
    return `Execute the specialized customer & positioning strategy skill "${nodeTitle}" for "{product_title}".

Product Information:
- Niche: {niche}
- Selling Price: {selling_price} DZD | Margin: {profit_margin}%
- Description & Selling Points: {description} ({selling_points})

Requirements:
1. Executive Summary on buyer psychology and market awareness in {target_market}.
2. Customer Avatar Matrix formatted as:
| Avatar | Pain Points | Desires | Awareness Level | Objections |
3. Pricing Strategy Evaluation Table:
| Pricing Strategy | Score | Demand Level | Profit Potential |
4. Key emotional buying triggers and objection handling script.

Write the ENTIRE output 100% EXCLUSIVELY in {language}. Use structured Markdown tables and clear headings.`;
  }

  // 4. Creative Angles, Hooks & Video Scripts
  if (t.includes('creative') || t.includes('hook') || t.includes('angle') || t.includes('copy') || t.includes('video') || t.includes('ugc') || t.includes('script')) {
    return `Execute the specialized creative & direct response copywriting skill "${nodeTitle}" for "{product_title}".

Product Information:
- Niche: {niche}
- Selling Price: {selling_price} DZD | Profit Margin: {profit_margin}%
- Description & Key Features: {description} ({selling_points})

Requirements:
1. Executive Summary on the visual demonstration hooks and scroll-stopping potential.
2. Creative Angle Matrix Table:
| Angle Name | Hook Formula | Visual Concept | Emotion Targeted |
3. Viral Hook Scripts with Predicted CTR % Table:
| Hook Script | Predicted CTR % | Format | Priority |
Provide 4-5 high-converting hook scripts written 100% in {language}.
4. 4-Stage Visual Storyboard flow (0-3s Pattern Interrupt → 4-10s Problem Demonstration → 11-20s Social Proof → 21-30s COD Call-to-Action).
5. Weekly creative testing calendar table.

Write the ENTIRE output 100% EXCLUSIVELY in {language}.`;
  }

  // 5. Campaign, Media Buying & Traffic
  if (t.includes('campaign') || t.includes('meta') || t.includes('tiktok') || t.includes('traffic') || t.includes('budget') || t.includes('media buying')) {
    return `Execute the specialized media buying and campaign structure skill "${nodeTitle}" for "{product_title}".

Product Information:
- Niche: {niche}
- Selling Price: {selling_price} DZD | Product Cost: {product_cost} DZD
- Description: {description}

Requirements:
1. Executive Summary outlining budget distribution, Advantage+ / CBO architecture, and bid strategy in {target_market}.
2. Campaign Budget Allocation Table:
| Campaign | Daily Budget (DZD) | % Share | Objective |
3. Funnel Performance Benchmarks Table with status badges:
| Metric | Benchmark | Target Rate | Status 🟢🟡🔴 | Action |
4. Full funnel drop-off flowchart diagram.

Write the ENTIRE output 100% EXCLUSIVELY in {language}.`;
  }

  // 6. Pricing, Margins & Unit Economics
  if (t.includes('pricing') || t.includes('economic') || t.includes('margin') || t.includes('profit') || t.includes('financial') || t.includes('cost') || t.includes('roas')) {
    return `Execute the specialized e-commerce financial intelligence skill "${nodeTitle}" for "{product_title}".

Product Information:
- Niche: {niche}
- Selling Price: {selling_price} DZD | Product Cost: {product_cost} DZD | Margin: {profit_margin}%

Requirements:
1. Executive Summary on cash flow velocity, contribution margin, and break-even thresholds.
2. Complete Unit Economics Breakdown Table:
| Metric | Value (DZD) | Formula / Component |
Include Selling Price, COGS, Shipping, Confirmation Cost, RTO Cost, Ad Spend per Order, and Net Profit.
3. Pricing Strategy Matrix Table:
| Pricing Strategy | Score | Demand Level | Profit Margin |
4. Wilaya Revenue Share Table across top purchasing wilayas.
5. Break-Even ROAS and Target CAC targets.

Write the ENTIRE output 100% EXCLUSIVELY in {language}.`;
  }

  // 7. Logistics, Delivery, RTO & Returns
  if (t.includes('delivery') || t.includes('courier') || t.includes('rto') || t.includes('return') || t.includes('confirmation') || t.includes('logistics') || t.includes('yalidine')) {
    return `Execute the specialized COD logistics, confirmation & return mitigation skill "${nodeTitle}" for "{product_title}".

Product Information:
- Selling Price: {selling_price} DZD | Landed Cost: {product_cost} DZD

Requirements:
1. Executive Summary on courier transit times, delivery rates across 58 Wilayas, and RTO suppression.
2. Courier Delivery Performance Table:
| Courier | Delivery Rate % | Avg Days | Cost (DZD) |
3. RTO Failure Root Cause Analysis Table:
| Reason | % of RTOs | Cumulative % | Priority | Actionable Fix |
4. 10-Minute Phone & WhatsApp audio order confirmation script in {language}.
5. Return Reduction Action Table with priority status:
| Action | Impact (1-5) | Effort (1-5) | Priority 🟩🟨 |

Write the ENTIRE output 100% EXCLUSIVELY in {language}.`;
  }

  // 8. Master Funnel & All-In-One Orchestrator
  if (t.includes('all in one') || t.includes('master') || t.includes('15-stage') || t.includes('funnel')) {
    return `Execute the complete 15-Stage Full-Funnel Orchestration skill "${nodeTitle}" for "{product_title}".

Requirements:
1. Complete 15-Layer Stage Summary Table formatted as:
| Layer | Stage | Key Metric | Status 🟢🟡🔴 | #1 Next Action |
Covering: 1 Product, 2 Strategy, 3 Creative, 4 Campaign, 5 Traffic, 6 Order, 7 Confirmation, 8 Delivery, 9 RTO, 10 Revenue, 11 Profit, 12 Customer Quality, 13 Ad Platform Signal, 14 AI Optimization, 15 New Traffic.
2. Key priority matrices and execution next steps.

Write the ENTIRE output 100% EXCLUSIVELY in {language}.`;
  }

  // 9. Standard / Default Skill Prompt
  return `Execute the specialized e-commerce intelligence skill "${nodeTitle}" (${nodeSubtitle || 'Strategic Intelligence'}) for "{product_title}".

Product Information:
- Niche: {niche}
- Selling Price: {selling_price} DZD | Product Cost: {product_cost} DZD | Margin: {profit_margin}%
- Selling Points: {selling_points}
- Description: {description}

Requirements:
1. Executive Summary on what "${nodeTitle}" accomplishes for this specific item in the e-commerce market ({target_market}).
2. Key structured data tables and metrics relevant to ${nodeTitle}.
3. Market considerations, unit economics, and operational risk factors.
4. Clear, actionable step-by-step roadmap.

Write the ENTIRE response 100% EXCLUSIVELY in {language}. Use structured Markdown tables and clear headings.`;
};
