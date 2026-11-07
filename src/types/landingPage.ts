export interface ProductImageItem {
  id: string;
  name: string;
  url: string;
  base64?: string;
  mimeType?: string;
  size: number;
  isMain: boolean;
}

export interface ProductInputData {
  name: string;
  category: string;
  description: string;
  mainBenefits: string[];
  targetAudience: string;
  customerProblem: string;
  productSolution: string;
  productFeatures: string[];
  price: string;
  originalPrice?: string;
  currency: string;
  country: string;
  language: string;
  // Optional Product Research Info
  research: {
    competitors?: string;
    reviews?: string;
    testimonials?: string;
    faqs?: string;
    specs?: string;
    shipping?: string;
    warranty?: string;
  };
  images: ProductImageItem[];
}

export interface AiModelConfig {
  provider: 'gemini' | 'openai' | 'deepseek' | 'openrouter' | 'anthropic';
  modelId: string;
  modelName: string;
  quality: 'fast' | 'balanced' | 'high';
  reasoningLevel: 'none' | 'low' | 'high';
  apiKey?: string;
}

export interface LandingPageSectionConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  order: number;
}

export type CopywritingFramework = 'AIDA' | 'PAS' | 'BAB' | '4P' | 'Direct Response';

export interface VisualTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: 'rounded' | 'pill' | 'square';
}

export interface LandingPageConfig {
  style:
    | 'modern_ecommerce'
    | 'premium_luxury'
    | 'minimalist'
    | 'high_converting_sales'
    | 'professional_product'
    | 'problem_solution'
    | 'direct_response';
  sections: LandingPageSectionConfig[];
  theme: VisualTheme;
  marketing: {
    marketingAngle: string;
    painPoint: string;
    promise: string;
    usp: string;
    primaryCta: string;
    secondaryCta: string;
    toneOfVoice: string;
    framework: CopywritingFramework;
    urgencyLevel: 'none' | 'moderate' | 'high' | 'extreme';
    trustStrategy: string;
  };
  targetMarket: {
    country: string;
    language: string;
    currency: string;
    isAlgeriaCod: boolean;
    wilayasCount: number;
    deliveryCompany: string;
    paymentMethod: string;
  };
}

export interface ProductAnalysis {
  productIdentity: string;
  category: string;
  mainFeatures: string[];
  customerProblems: string[];
  productBenefits: string[];
  mainBenefits?: string[];
  targetAudience: string;
  buyingMotivations: string[];
  mainObjections: string[];
  differentiation: string;
  marketingOpportunities: string[];
  opportunityScore: number;
}

export interface LandingPageStrategy {
  primaryAngle: string;
  secondaryAngles: string[];
  uniqueSellingProposition: string;
  heroHeadline: string;
  supportingHeadline: string;
  mainCtaText: string;
  announcementText?: string;
  beforeText?: string;
  afterText?: string;
  testimonials?: Array<{ name: string; wilaya?: string; rating: number; text: string }>;
  faqs?: Array<{ q: string; a: string }>;
  recommendedStructure: string[];
  objectionStrategy: string;
  trustStrategy: string;
  conversionStrategy: string;
}

export interface GeneratedLandingPage {
  html: string;
  css: string;
  js: string;
  fullHtml: string;
  generatedAt: string;
  modelUsed: string;
  providerUsed: string;
  analysis?: ProductAnalysis;
  strategy?: LandingPageStrategy;
}

export interface GenerationStageStatus {
  id: number;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  detail?: string;
  durationMs?: number;
}

export interface SavedLandingPageProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  productInput: ProductInputData;
  modelConfig: AiModelConfig;
  config: LandingPageConfig;
  analysis?: ProductAnalysis;
  strategy?: LandingPageStrategy;
  generatedPage?: GeneratedLandingPage;
}

export interface StrategyReportOutputA {
  productIntelligence: {
    visualAnalysis: string;
    functionalClassification: string;
    materialsBuild: string;
    emotionalAppeal: string;
    perceivedValue: string;
  };
  marketAnalysis: {
    categoryDynamics: string;
    marketOpportunityScore: number;
    competitorLandscape: string;
    saturationLevel: string;
  };
  targetAudience: {
    demographics: string;
    psychographics: string;
    awarenessLevel: string;
    buyingMindset: string;
  };
  customerAvatars: Array<{
    name: string;
    role: string;
    likelihood: 'High' | 'Very High' | 'Highest';
    corePain: string;
    primaryDesire: string;
    keyObjection: string;
  }>;
  brandIdentity: {
    archetype: string;
    toneOfVoice: string;
    positioningStatement: string;
    emotionalTerritory: string;
  };
  brandNames: Array<{
    name: string;
    rationale: string;
    isRecommended: boolean;
  }>;
  logoConcept: {
    visualConcept: string;
    typographyDirection: string;
    iconography: string;
    packagingPlacement: string;
  };
  colorPalette: {
    primaryHex: string;
    secondaryHex: string;
    accentHex: string;
    backgroundHex: string;
    textDarkHex: string;
    psychologicalJustification: string;
  };
  marketingAngles: Array<{
    rank: number;
    angleName: string;
    hookHeadline: string;
    bodyAngle: string;
    ctaFraming: string;
    targetAvatar: string;
  }>;
  usp: {
    primaryUSP: string;
    supportingPoints: string[];
    antiObjectionClaim: string;
  };
  offerStrategy: {
    tier1: { name: string; supply: string; price: string; origPrice: string; savings: string; badge?: string };
    tier2: { name: string; supply: string; price: string; origPrice: string; savings: string; badge: string };
    tier3: { name: string; supply: string; price: string; origPrice: string; savings: string; badge: string };
    guaranteeTerm: string;
    urgencyDriver: string;
  };
  pricingStrategy: {
    retailPrice: string;
    costOfGoods: string;
    grossMarginPercent: number;
    netProfitDZD: string;
    breakEvenRoas: number;
  };
  bundleEconomics: {
    singleContributionMargin: string;
    duoContributionMargin: string;
    trioContributionMargin: string;
    codReturnAbsorptionNotes: string;
  };
  pageArchitecture: Array<{
    section: string;
    order: number;
    purpose: string;
    croRationale: string;
  }>;
  designDirection: {
    visualStyle: string;
    heroLayout: string;
    mobileOptimizations: string[];
    trustTriggers: string[];
  };
}
