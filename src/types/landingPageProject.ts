// =========================================================================
// CENTRALIZED LANDING PAGE PROJECT STATE (SINGLE SOURCE OF TRUTH)
// =========================================================================

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PricingBundle {
  id: string;
  title: string;
  quantity: number;
  price: string;
  originalPrice: string;
  savingsText: string;
  badge?: string;
  popular?: boolean;
}

export interface TrustBadgeItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface CustomerReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  location: string;
  date: string;
  verified: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProductInfo {
  name: string;
  category: string;
  headline: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice: string;
  discountPercentage: string;
  image: string;
  galleryImages: string[];
  features: ProductFeature[];
  targetAudience: string;
  painPoints: string[];
  sellingPoints: string[];
}

export interface BrandInfo {
  name: string;
  domain: string;
  logoText: string;
  accentColor: string; // e.g. '#10b981'
  secondaryColor: string; // e.g. '#0f172a'
  fontFamily: string; // e.g. 'Cairo' | 'Inter' | 'Montserrat'
  badgeText: string;
}

export interface SectionModel {
  id: string;
  type:
    | 'header'
    | 'hero'
    | 'trust'
    | 'problemSolution'
    | 'features'
    | 'bundles'
    | 'order'
    | 'reviews'
    | 'faqs'
    | 'footer'
    | 'custom';
  title: string;
  subtitle?: string;
  visible: boolean;
  order: number;
  data: any;
}

export interface GlobalDesignSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  borderRadius: 'rounded-none' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  layoutDirection: 'rtl' | 'ltr';
  language: 'Arabic' | 'French' | 'English';
}

export interface LandingPageProject {
  projectId: string;
  version: number;
  updatedAt: string;
  product: ProductInfo;
  brand: BrandInfo;
  design: GlobalDesignSettings;
  sections: SectionModel[];
  htmlSource: string;
  cssSource: string;
  jsSource: string;
  responsiveMode: 'desktop' | 'tablet' | 'mobile';
  isCustomHtmlActive: boolean;
  customHtmlCode: string;
  editCount: number;
}

// History stack for Undo / Redo
export interface ProjectHistoryStack {
  past: LandingPageProject[];
  future: LandingPageProject[];
}

// Available AI Tools for Landing Page Execution
export type LandingPageToolName =
  | 'createLandingPage'
  | 'initializeLandingPage'
  | 'generateLandingPage'
  | 'duplicateLandingPage'
  | 'editLandingPage'
  | 'updateLandingPage'
  | 'redesignLandingPage'
  | 'modifyPageLayout'
  | 'updatePageContent'
  | 'addSection'
  | 'editSection'
  | 'deleteSection'
  | 'reorderSections'
  | 'duplicateSection'
  | 'regenerateSection'
  | 'updateColors'
  | 'updateTypography'
  | 'updateSpacing'
  | 'updateLayout'
  | 'updateResponsiveDesign'
  | 'updateProductTitle'
  | 'updateProductDescription'
  | 'updateProductImages'
  | 'updateProductPrice'
  | 'updateProductOffer'
  | 'updateProductFeatures'
  | 'updateHTML'
  | 'updateCSS'
  | 'updateJavaScript'
  | 'undo'
  | 'redo';

export interface ToolExecutionResult {
  success: boolean;
  toolUsed: LandingPageToolName;
  summary: string;
  keyChanges: string[];
  updatedProject: LandingPageProject;
  error?: string;
}

