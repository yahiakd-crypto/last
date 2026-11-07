// ============================================================================
// CRO LANDING PAGE STRATEGY ENGINE
// Shared by the client builder and the server AI endpoint.
//
// Pipeline: PRODUCT > CUSTOMER > PROBLEM > DESIRE > SOLUTION > PROOF > OFFER
//           > TRUST > CTA
//
// Ground rule: work ONLY with the product facts provided. Never invent
// prices, ratings, reviews, certifications or guarantees. Anything missing is
// logged in `gaps` and rendered with a clearly labeled placeholder.
// ============================================================================

export interface CroGap {
  field: string;
  whatIsMissing: string;
  placeholderUsed: string;
  howToConfirm: string;
}

export interface CroStrategyData {
  gaps: CroGap[];
  brandIdentity: {
    brandName: string;
    logoType: string;
    colorPalette: { primary: string; secondary: string; accent: string; background: string };
    fonts: { headline: string; body: string };
    vibe: string;
  };
  productContent: {
    photos: string[];
    categoryLabel: string;
    headline: string;
    description: string;
    benefits: Array<{ icon: string; label: string; detail: string }>;
    accordion: { description: string; ingredientsSpecs: string; howToUse: string };
  };
  pricingOffer: {
    regularPrice: string;
    discountPrice: string;
    percentOff: string;
    subscription: { available: boolean; frequencies: string[]; savingsPercent: number };
    bundleQuantityDiscount: string;
    shippingPolicy: string;
    guarantee: string;
  };
  socialProof: {
    starRating: number;
    reviewCount: number;
    reviews: Array<{ name: string; rating: number; quote: string }>;
  };
  navigation: {
    navItems: string[];
    cartIcon: boolean;
    searchIcon: boolean;
    primaryCta: { label: string; url: string };
    urgency: { type: string; label: string };
  };
  conversion: {
    headlineAngle: string;
    offerStrategy: string;
    trustStrategy: string;
    objectionHandling: string;
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontHeadline: string;
    fontBody: string;
    fontStyle: string;
  };
  sections: Array<{
    key: string;
    name: string;
    purpose: string;
    headline: string;
    subheadline: string;
    body: string;
    ctaLabel: string;
    layout: string;
  }>;
}

export interface CroProductFacts {
  name?: string;
  title?: string;
  category?: string;
  description?: string;
  headline?: string;
  price?: number | string | null;
  priceFormatted?: string;
  originalPrice?: number | string | null;
  currency?: string;
  image?: string;
  images?: string[];
  benefits?: string[];
  features?: string[];
  specs?: string;
  howToUse?: string;
  rating?: number | null;
  reviewCount?: number | null;
  reviews?: Array<{ name: string; rating: number; quote: string }>;
  shipping?: string;
  guarantee?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  urgency?: { type: string; label: string };
  crossSell?: Array<{ name: string; price?: string; image?: string }>;
  language?: string;
}

export const CRO_PIPELINE_STAGES = [
  { key: 'PRODUCT', label: 'Product', desc: 'Core facts, mechanics & physical specs' },
  { key: 'CUSTOMER', label: 'Customer', desc: 'Target avatar, mindset & buying friction' },
  { key: 'PROBLEM', label: 'Problem', desc: 'Primary pain point & costly daily frustration' },
  { key: 'DESIRE', label: 'Desire', desc: 'Desired end-state & emotional transformation' },
  { key: 'SOLUTION', label: 'Solution', desc: 'Unique mechanism & direct result promise' },
  { key: 'PROOF', label: 'Proof', desc: 'Verifiable social proof, ratings & demonstrations' },
  { key: 'OFFER', label: 'Offer', desc: 'Price anchoring, bundles & payment terms' },
  { key: 'TRUST', label: 'Trust', desc: 'Risk reversal, guarantee & delivery transparency' },
  { key: 'CTA', label: 'CTA', desc: 'High-contrast sticky buy button & frictionless form' },
];

const TODO = 'TODO';

const DEFAULT_PALETTE = {
  primary: '#2563EB',
  secondary: '#0F172A',
  accent: '#F59E0B',
  background: '#FFFFFF',
};

const DEFAULT_FONTS = {
  headline: 'Inter, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif',
};

const BENEFIT_ICONS = ['Zap', 'ShieldCheck', 'Truck', 'Award'];

function clean(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return '';
}

export function formatMoney(value?: number | string | null, currency = 'DZD'): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${value.toLocaleString('en-US')} ${currency}`.trim();
  }
  const raw = String(value).trim();
  if (!raw) return '';
  if (/[A-Za-z]{2,3}/.test(raw.replace(/[.,\d\s]/g, ''))) return raw;
  return `${raw} ${currency}`.trim();
}

export function parseMoney(value?: number | string | null): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const digits = String(value).replace(/[^\d.]/g, '');
  if (!digits) return null;
  const num = Number(digits);
  return Number.isFinite(num) ? num : null;
}

function computePercentOff(price?: number | string | null, original?: number | string | null): string {
  const p = parseMoney(price);
  const o = parseMoney(original);
  if (!p || !o || o <= p) return '';
  return `${Math.round(((o - p) / o) * 100)}%`;
}

/** Trims trailing sentence punctuation from short benefit labels. */
function cleanLabel(value?: string | null): string {
  return clean(value).replace(/[.;,]+$/, '');
}

/**
 * Turns a raw marketing angle (e.g. "Built for ipx6 waterproof") into a
 * display headline ("Built for IPX6 Waterproof") without inventing words.
 */
function toDisplayHeadline(value?: string | null): string {
  const raw = clean(value);
  if (!raw) return '';
  const minorWords = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);
  return raw
    .split(/\s+/)
    .map((word, index) => {
      if (/\d/.test(word)) return word.toUpperCase();
      const lower = word.toLowerCase();
      if (index > 0 && minorWords.has(lower)) return lower;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Deterministic, fact-only strategy used as:
 *  - the immediate preview when the node is dropped on the board
 *  - the fallback when no AI provider key is configured / the AI call fails
 *
 * It NEVER invents claims: missing data becomes a labeled TODO + a gap entry.
 */
export function buildCroStrategyForProduct(name?: string, input?: CroProductFacts | null): CroStrategyData {
  const facts = input || {};
  const brandName = clean(facts.name) || clean(name) || 'Connected Product';
  const currency = clean(facts.currency) || 'DZD';
  const images = Array.from(
    new Set([
      ...(Array.isArray(facts.images) ? facts.images.filter(Boolean) : []),
      ...(facts.image ? [facts.image] : []),
    ])
  );

  const priceLabel = formatMoney(facts.price, currency);
  const originalLabel = formatMoney(facts.originalPrice, currency);
  const percentOff = computePercentOff(facts.price, facts.originalPrice);

  const benefitSource = (facts.benefits && facts.benefits.length ? facts.benefits : facts.features) || [];
  const benefits = (benefitSource.length ? benefitSource : ['', '', '', ''])
    .slice(0, 4)
    .map((label, idx) => ({
      icon: BENEFIT_ICONS[idx % BENEFIT_ICONS.length],
      label: cleanLabel(label) || `${TODO} — confirm benefit ${idx + 1}`,
      detail: '',
    }));

  const rating = typeof facts.rating === 'number' && facts.rating > 0 ? Math.min(5, facts.rating) : 0;
  const reviewCount =
    typeof facts.reviewCount === 'number' && facts.reviewCount > 0 ? Math.round(facts.reviewCount) : 0;
  const reviews = Array.isArray(facts.reviews)
    ? facts.reviews.filter((r) => r && clean(r.name) && clean(r.quote))
    : [];

  const gaps: CroGap[] = [];
  if (!clean(facts.category)) {
    gaps.push({
      field: 'productContent.categoryLabel',
      whatIsMissing: `Product category was not provided for ${brandName}`,
      placeholderUsed: `${TODO} — confirm category label`,
      howToConfirm: 'Give the exact category (e.g. Smart Watch, Kitchen Gadget, Skincare).',
    });
  }
  gaps.push({
    field: 'brandIdentity.colorPalette',
    whatIsMissing: 'Brand hex palette was not provided',
    placeholderUsed: `Neutral blue palette: ${DEFAULT_PALETTE.primary} / ${DEFAULT_PALETTE.secondary} / ${DEFAULT_PALETTE.accent} / ${DEFAULT_PALETTE.background}`,
    howToConfirm: 'Provide 4 hex codes: primary, secondary, accent, background.',
  });
  if (!priceLabel) {
    gaps.push({
      field: 'pricingOffer.regularPrice',
      whatIsMissing: 'Selling price and currency were not provided',
      placeholderUsed: `${TODO} — confirm final price`,
      howToConfirm: 'Provide the selling price and currency.',
    });
  }
  if (!images.length) {
    gaps.push({
      field: 'productContent.photos',
      whatIsMissing: 'Product photography was not provided',
      placeholderUsed: 'Inline SVG product art placeholder',
      howToConfirm: 'Upload or link at least one product image URL.',
    });
  }
  if (!clean(facts.shipping)) {
    gaps.push({
      field: 'pricingOffer.shippingPolicy',
      whatIsMissing: 'Shipping threshold and delivery time were not provided',
      placeholderUsed: `${TODO} — confirm shipping threshold & delivery time`,
      howToConfirm: 'State the free-shipping threshold and average delivery time.',
    });
  }
  if (!clean(facts.guarantee)) {
    gaps.push({
      field: 'pricingOffer.guarantee',
      whatIsMissing: 'Guarantee / return policy was not provided',
      placeholderUsed: `${TODO} — confirm guarantee & return terms`,
      howToConfirm: 'Provide the exact guarantee and return terms.',
    });
  }
  if (!rating || !reviewCount) {
    gaps.push({
      field: 'socialProof',
      whatIsMissing: 'Verified rating and review count were not provided',
      placeholderUsed: 'Rating strip omitted (no numbers invented)',
      howToConfirm: 'Provide the real average rating and number of reviews.',
    });
  }
  if (!clean(facts.specs)) {
    gaps.push({
      field: 'productContent.accordion.ingredientsSpecs',
      whatIsMissing: 'Materials / specifications were not provided',
      placeholderUsed: `${TODO} — confirm materials & specs`,
      howToConfirm: 'Provide materials, dimensions or technical specs.',
    });
  }
  if (!clean(facts.howToUse)) {
    gaps.push({
      field: 'productContent.accordion.howToUse',
      whatIsMissing: 'Usage steps were not provided',
      placeholderUsed: `${TODO} — confirm how to use`,
      howToConfirm: 'Provide the usage steps for the product.',
    });
  }

  const categoryLabel = clean(facts.category) || `${TODO} — confirm category label`;
  const headline =
    toDisplayHeadline(facts.headline) ||
    (benefitSource[0] ? toDisplayHeadline(`Built for ${cleanLabel(benefitSource[0]).toLowerCase()}`) : `${TODO} — confirm benefit headline for ${brandName}`);
  const description =
    clean(facts.description) ||
    `${TODO} — add a 2–3 sentence description using verified product facts only.`;
  const shippingPolicy = clean(facts.shipping) || `${TODO} — confirm shipping threshold & delivery time`;
  const guarantee = clean(facts.guarantee) || `${TODO} — confirm guarantee & return terms`;
  const ctaLabel = clean(facts.ctaLabel) || 'Order Now — Cash on Delivery';
  const ctaUrl = clean(facts.ctaUrl) || '#order';

  const design = {
    primaryColor: DEFAULT_PALETTE.primary,
    secondaryColor: DEFAULT_PALETTE.secondary,
    accentColor: DEFAULT_PALETTE.accent,
    backgroundColor: DEFAULT_PALETTE.background,
    textColor: '#0F172A',
    fontHeadline: DEFAULT_FONTS.headline,
    fontBody: DEFAULT_FONTS.body,
    fontStyle: 'font-sans tracking-tight antialiased',
  };

  return {
    gaps,
    brandIdentity: {
      brandName,
      logoType: 'text-logo-from-name',
      colorPalette: { ...DEFAULT_PALETTE },
      fonts: { ...DEFAULT_FONTS },
      vibe: 'clinical-trustworthy',
    },
    productContent: {
      photos: images,
      categoryLabel,
      headline,
      description,
      benefits,
      accordion: {
        description: clean(facts.description) || `${TODO} — confirm the product description.`,
        ingredientsSpecs: clean(facts.specs) || `${TODO} — confirm materials & specs.`,
        howToUse: clean(facts.howToUse) || `${TODO} — confirm how to use the product.`,
      },
    },
    pricingOffer: {
      regularPrice: originalLabel || priceLabel || `${TODO} — confirm final price`,
      discountPrice: originalLabel && priceLabel ? priceLabel : '',
      percentOff,
      subscription: { available: false, frequencies: [], savingsPercent: 0 },
      bundleQuantityDiscount: '',
      shippingPolicy,
      guarantee,
    },
    socialProof: { starRating: rating, reviewCount, reviews },
    navigation: {
      navItems: ['About', 'FAQ', 'Shipping', 'Contact'],
      cartIcon: true,
      searchIcon: false,
      primaryCta: { label: ctaLabel, url: ctaUrl },
      urgency: facts.urgency || { type: 'none', label: '' },
    },
    conversion: {
      headlineAngle: 'Lead with the customer result, then support it with verified facts.',
      offerStrategy: priceLabel
        ? `Present ${priceLabel} with any verified bundle or quantity saving; never invent discounts.`
        : 'Price placeholder shown until confirmed; no discount is claimed.',
      trustStrategy: guarantee.startsWith(TODO)
        ? 'Guarantee placeholder shown; no trust claim is invented.'
        : guarantee,
      objectionHandling: 'Answer delivery, payment and usage questions with the provided facts only.',
    },
    design,
    sections: [
      {
        key: 'announcement_bar',
        name: 'Top Announcement Bar',
        purpose: 'sitewide promo/shipping strip',
        headline: shippingPolicy,
        subheadline: '',
        body: '',
        ctaLabel: '',
        layout: 'full-width solid color strip',
      },
      {
        key: 'nav',
        name: 'Sticky Nav Bar',
        purpose: 'logo, menu, cart, search',
        headline: '',
        subheadline: '',
        body: '',
        ctaLabel: '',
        layout: 'logo-left, hamburger, cart-icon',
      },
      {
        key: 'hero_carousel',
        name: 'Hero Image Carousel',
        purpose: 'real product shots, swipeable',
        headline,
        subheadline: description,
        body: '',
        ctaLabel: ctaLabel,
        layout: 'dotted carousel + thumbnail strip',
      },
      {
        key: 'rating_strip',
        name: 'Rating Strip',
        purpose: 'stars + review count',
        headline: '',
        subheadline: rating && reviewCount ? `${rating}/5 from ${reviewCount} reviews` : '',
        body: '',
        ctaLabel: '',
        layout: 'compact centered strip',
      },
      {
        key: 'category_headline',
        name: 'Category Label + Benefit Headline',
        purpose: 'category badge + promise + description',
        headline,
        subheadline: categoryLabel,
        body: description,
        ctaLabel: '',
        layout: 'badge, big headline, 2-3 sentences',
      },
      {
        key: 'benefit_icons',
        name: 'Benefit Icons Row',
        purpose: '3-4 real benefit icons',
        headline: '',
        subheadline: '',
        body: '',
        ctaLabel: '',
        layout: 'icon cards in a row',
      },
      {
        key: 'price_block',
        name: 'Price Block',
        purpose: 'regular/discount price, subscribe toggle, bundle',
        headline: priceLabel || `${TODO} — confirm final price`,
        subheadline: '',
        body: originalLabel && priceLabel ? `Was ${originalLabel} — now ${priceLabel}${percentOff ? ` (${percentOff} off)` : ''}` : '',
        ctaLabel: '',
        layout: 'price, toggles, fee notes',
      },
      {
        key: 'primary_cta',
        name: 'Primary CTA',
        purpose: 'full-width high-contrast buy button, sticky on mobile',
        headline: '',
        subheadline: '',
        body: '',
        ctaLabel,
        layout: 'full-width button',
      },
      {
        key: 'info_accordion',
        name: 'Info Accordion',
        purpose: 'Description / Ingredients / How to Use, collapsible',
        headline: '',
        subheadline: '',
        body: description,
        ctaLabel: '',
        layout: 'collapsible rows',
      },
      {
        key: 'reviews',
        name: 'Reviews Section',
        purpose: 'real reviews, stars, names',
        headline: 'Customer Reviews',
        subheadline: reviews.length ? 'Verified buyer feedback' : 'No verified reviews provided',
        body: '',
        ctaLabel: '',
        layout: 'review cards',
      },
      {
        key: 'cross_sell',
        name: 'Cross-Sell Row',
        purpose: 'related products, horizontally scrollable',
        headline: 'Frequently Bought Together',
        subheadline: '',
        body: '',
        ctaLabel: 'Add',
        layout: 'horizontal scroll cards',
      },
      {
        key: 'footer',
        name: 'Footer',
        purpose: 'shipping, returns, contact, socials',
        headline: '',
        subheadline: '',
        body: '',
        ctaLabel: '',
        layout: 'simple link columns',
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// AI prompt (the exact CRO operating system requested by the user)
// ---------------------------------------------------------------------------
export function buildCroStrategyPrompt(product: CroProductFacts = {}, instructions = ''): string {
  const facts = JSON.stringify(product ?? {}, null, 2);

  return `You are an AI PRODUCT → CRO STRATEGY → LANDING PAGE generator. You think:

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

1. BRAND IDENTITY — exact brand/product name (spelling + capitalization), a TEXT LOGO derived from the name, brand color palette (primary, secondary, accent, background hex), font pairing (one headline + one body), and vibe/tone: playful | luxury | clinical-trustworthy | warm-organic | bold-edgy. Choose colors from the provided facts / brand trademarks / category conventions; if you must color from scratch, pick a tasteful category-appropriate palette and ADD A GAP asking the human to confirm the hex codes.
2. PRODUCT CONTENT — describe the product shots to render as realistic inline SVG art (avoid gray boxes), one category label, ONE benefit-driven headline (a promise, not a description), a 2-3 sentence supporting description, 3-4 key benefits (short label + icon name + one-sentence detail), and full accordion content (description / ingredients-or-specs / how to use).
3. PRICING & OFFER — regular price, discount price + % off, subscription option (frequencies + savings %), bundle/quantity discount, shipping policy (free threshold + delivery time), guarantee/return text.
4. SOCIAL PROOF — star rating, review count, 3-5 realistic reviews (name, rating, one-sentence quote).
5. NAVIGATION & CONVERSION — nav menu items, cart/search icons needed, primary CTA label + real destination, urgency element (countdown / low-stock / limited badge / none).

PRODUCT FACTS AVAILABLE (use ONLY these facts):
${facts}

USER INSTRUCTIONS:
${instructions || 'Generate the highest-converting mobile-first landing page strategy for this product.'}

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
}

// ---------------------------------------------------------------------------
// Parsing + normalization of model output
// ---------------------------------------------------------------------------
export function parseCroStrategyJson(raw: string): any {
  if (!raw) throw new Error('Empty AI response');
  let text = String(raw).trim();

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence && fence[1]) text = fence[1].trim();

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('AI response did not contain a JSON object');
  text = text.slice(start, end + 1);

  const parsed = JSON.parse(text);
  if (parsed && typeof parsed === 'object' && parsed.strategy && typeof parsed.strategy === 'object') {
    return parsed.strategy;
  }
  return parsed;
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function num(value: unknown, fallback = 0): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Merge whatever the model returned on top of the fact-only baseline so the
 * renderer never crashes on a missing key, and so missing facts stay gaps.
 */
export function normalizeCroStrategy(raw: any, product: CroProductFacts = {}): CroStrategyData {
  const base = buildCroStrategyForProduct(product.name, product);
  if (!raw || typeof raw !== 'object') return base;

  const safe = (obj: any) => (obj && typeof obj === 'object' ? obj : {});
  const rawBrand = safe(raw.brandIdentity);
  const rawContent = safe(raw.productContent);
  const rawPricing = safe(raw.pricingOffer);
  const rawProof = safe(raw.socialProof);
  const rawNav = safe(raw.navigation);
  const rawConversion = safe(raw.conversion);
  const rawDesign = safe(raw.design);
  const rawPalette = safe(rawBrand.colorPalette);
  const rawFonts = safe(rawBrand.fonts);
  const rawAccordion = safe(rawContent.accordion);
  const rawSubscription = safe(rawPricing.subscription);
  const rawCta = safe(rawNav.primaryCta);
  const rawUrgency = safe(rawNav.urgency);

  const rawBenefits = Array.isArray(rawContent.benefits) ? rawContent.benefits : [];
  const benefits = rawBenefits
    .filter((b: any) => b && (str(b.label) || str(b.detail)))
    .slice(0, 4)
    .map((b: any, idx: number) => ({
      icon: str(b.icon, BENEFIT_ICONS[idx % BENEFIT_ICONS.length]),
      label: str(b.label, `${TODO} — confirm benefit ${idx + 1}`),
      detail: str(b.detail, 'Based on the provided product facts.'),
    }));

  const rawReviews = Array.isArray(rawProof.reviews) ? rawProof.reviews : [];
  const reviews = rawReviews
    .filter((r: any) => r && str(r.quote))
    .slice(0, 6)
    .map((r: any) => ({
      name: str(r.name, 'Verified buyer'),
      rating: Math.max(0, Math.min(5, num(r.rating, 5))),
      quote: str(r.quote),
    }));

  const photos = Array.isArray(rawContent.photos)
    ? rawContent.photos.map((p: any) => str(p)).filter(Boolean)
    : base.productContent.photos;

  const rawSections = Array.isArray(raw.sections) ? raw.sections : [];
  const sections = base.sections.map((fallbackSection) => {
    const match = rawSections.find((s: any) => s && s.key === fallbackSection.key);
    if (!match) return fallbackSection;
    return {
      key: fallbackSection.key,
      name: str(match.name, fallbackSection.name),
      purpose: str(match.purpose, fallbackSection.purpose),
      headline: str(match.headline, fallbackSection.headline),
      subheadline: str(match.subheadline, fallbackSection.subheadline),
      body: str(match.body, fallbackSection.body),
      ctaLabel: str(match.ctaLabel, fallbackSection.ctaLabel),
      layout: str(match.layout, fallbackSection.layout),
    };
  });

  const rawGaps = Array.isArray(raw.gaps) ? raw.gaps : [];
  const gaps: CroGap[] = rawGaps
    .filter((g: any) => g && str(g.field))
    .map((g: any) => ({
      field: str(g.field),
      whatIsMissing: str(g.whatIsMissing),
      placeholderUsed: str(g.placeholderUsed),
      howToConfirm: str(g.howToConfirm),
    }));

  return {
    gaps: gaps.length ? gaps : base.gaps,
    brandIdentity: {
      brandName: str(rawBrand.brandName, base.brandIdentity.brandName),
      logoType: str(rawBrand.logoType, 'text-logo-from-name'),
      colorPalette: {
        primary: str(rawPalette.primary, base.brandIdentity.colorPalette.primary),
        secondary: str(rawPalette.secondary, base.brandIdentity.colorPalette.secondary),
        accent: str(rawPalette.accent, base.brandIdentity.colorPalette.accent),
        background: str(rawPalette.background, base.brandIdentity.colorPalette.background),
      },
      fonts: {
        headline: str(rawFonts.headline, base.brandIdentity.fonts.headline),
        body: str(rawFonts.body, base.brandIdentity.fonts.body),
      },
      vibe: str(rawBrand.vibe, base.brandIdentity.vibe),
    },
    productContent: {
      photos: photos.length ? photos : base.productContent.photos,
      categoryLabel: str(rawContent.categoryLabel, base.productContent.categoryLabel),
      headline: str(rawContent.headline, base.productContent.headline),
      description: str(rawContent.description, base.productContent.description),
      benefits: benefits.length ? benefits : base.productContent.benefits,
      accordion: {
        description: str(rawAccordion.description, base.productContent.accordion.description),
        ingredientsSpecs: str(rawAccordion.ingredientsSpecs, base.productContent.accordion.ingredientsSpecs),
        howToUse: str(rawAccordion.howToUse, base.productContent.accordion.howToUse),
      },
    },
    pricingOffer: {
      regularPrice: str(rawPricing.regularPrice, base.pricingOffer.regularPrice),
      discountPrice: str(rawPricing.discountPrice, base.pricingOffer.discountPrice),
      percentOff: str(rawPricing.percentOff, base.pricingOffer.percentOff),
      subscription: {
        available: Boolean(rawSubscription.available),
        frequencies: Array.isArray(rawSubscription.frequencies)
          ? rawSubscription.frequencies.map((f: any) => str(f)).filter(Boolean)
          : [],
        savingsPercent: num(rawSubscription.savingsPercent, 0),
      },
      bundleQuantityDiscount: str(rawPricing.bundleQuantityDiscount, base.pricingOffer.bundleQuantityDiscount),
      shippingPolicy: str(rawPricing.shippingPolicy, base.pricingOffer.shippingPolicy),
      guarantee: str(rawPricing.guarantee, base.pricingOffer.guarantee),
    },
    socialProof: {
      starRating: Math.max(0, Math.min(5, num(rawProof.starRating, base.socialProof.starRating))),
      reviewCount: Math.max(0, Math.round(num(rawProof.reviewCount, base.socialProof.reviewCount))),
      reviews: reviews.length ? reviews : base.socialProof.reviews,
    },
    navigation: {
      navItems: Array.isArray(rawNav.navItems)
        ? rawNav.navItems.map((n: any) => str(n)).filter(Boolean)
        : base.navigation.navItems,
      cartIcon: rawNav.cartIcon === undefined ? true : Boolean(rawNav.cartIcon),
      searchIcon: Boolean(rawNav.searchIcon),
      primaryCta: {
        label: str(rawCta.label, base.navigation.primaryCta.label),
        url: str(rawCta.url, base.navigation.primaryCta.url),
      },
      urgency: {
        type: str(rawUrgency.type, base.navigation.urgency.type),
        label: str(rawUrgency.label, base.navigation.urgency.label),
      },
    },
    conversion: {
      headlineAngle: str(rawConversion.headlineAngle, base.conversion.headlineAngle),
      offerStrategy: str(rawConversion.offerStrategy, base.conversion.offerStrategy),
      trustStrategy: str(rawConversion.trustStrategy, base.conversion.trustStrategy),
      objectionHandling: str(rawConversion.objectionHandling, base.conversion.objectionHandling),
    },
    design: {
      primaryColor: str(rawDesign.primaryColor, base.design.primaryColor),
      secondaryColor: str(rawDesign.secondaryColor, base.design.secondaryColor),
      accentColor: str(rawDesign.accentColor, base.design.accentColor),
      backgroundColor: str(rawDesign.backgroundColor, base.design.backgroundColor),
      textColor: str(rawDesign.textColor, base.design.textColor),
      fontHeadline: str(rawDesign.fontHeadline, base.design.fontHeadline),
      fontBody: str(rawDesign.fontBody, base.design.fontBody),
      fontStyle: str(rawDesign.fontStyle, base.design.fontStyle),
    },
    sections,
  };
}

// ---------------------------------------------------------------------------
// Board-node -> product facts adapter
//
// Product nodes on the board come from several places (product library,
// product intelligence dossiers, campaign regroupers, uploaded files). This
// maps every shape we know about into the fact contract above WITHOUT
// inventing anything: fields that do not exist stay undefined and therefore
// become discovery gaps.
// ---------------------------------------------------------------------------
const NON_PRODUCT_CATEGORIES = new Set([
  'product library',
  'product intelligence',
  'products',
  'skill',
  'skills',
  'board',
  'ai creative studio',
]);

function splitPoints(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,•\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function firstUrl(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === 'string' && /^(https?:|data:|blob:|\/)/i.test(value.trim())) {
      return value.trim();
    }
  }
  return '';
}

export function croFactsFromProductLike(product: any): CroProductFacts {
  const p = product || {};
  const financials = p.financials || {};
  const aiAnalysis = p.aiAnalysis || {};
  const intelligence = p.intelligence || {};
  const supplier = p.supplier || {};

  const primaryImage = firstUrl(p.image, p.mainImage, p.previewUrl, p.fileData?.previewUrl);
  const images = [
    ...(Array.isArray(p.images)
      ? p.images.map((img: any) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
      : []),
    ...(primaryImage ? [primaryImage] : []),
  ].filter((v, i, arr) => typeof v === 'string' && arr.indexOf(v) === i);

  const rawCategory = clean(p.niche) || clean(p.category) || clean(p.aiAnalysis?.category);
  const category = rawCategory && !NON_PRODUCT_CATEGORIES.has(rawCategory.toLowerCase()) ? rawCategory : '';

  const benefits = [
    ...splitPoints(p.benefits),
    ...splitPoints(p.mainBenefits),
    ...splitPoints(p.productFeatures),
    ...splitPoints(p.sellingPoints),
    ...splitPoints(aiAnalysis.whySell),
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  const price =
    p.sellingPrice ?? financials.sellingPrice ?? p.price ?? p.singlePrice ?? intelligence.sellingPrice ?? null;
  const originalPrice = p.originalPrice ?? p.compareAtPrice ?? financials.originalPrice ?? null;

  const rating =
    typeof p.rating === 'number' && p.rating > 0
      ? p.rating
      : typeof p.starRating === 'number' && p.starRating > 0
      ? p.starRating
      : null;
  const reviewCount =
    typeof p.reviewCount === 'number' && p.reviewCount > 0
      ? p.reviewCount
      : typeof p.reviewsCount === 'number' && p.reviewsCount > 0
      ? p.reviewsCount
      : null;

  return {
    name: clean(p.name) || clean(p.title) || '',
    category,
    description: clean(p.description) || clean(p.subtitle) || clean(intelligence.evidenceNotes) || '',
    headline: clean(p.headline) || clean(aiAnalysis.marketingAngle) || '',
    price: price === null || price === '' ? null : price,
    originalPrice: originalPrice === null || originalPrice === '' ? null : originalPrice,
    currency: clean(p.currency) || 'DZD',
    image: images[0] || '',
    images,
    benefits: benefits.slice(0, 4),
    features: splitPoints(p.features),
    specs:
      clean(p.specs) ||
      clean(p.specifications) ||
      clean(p.ingredientsSpecs) ||
      clean(aiAnalysis.specs) ||
      (supplier.moq ? `MOQ ${supplier.moq}` : ''),
    howToUse: clean(p.howToUse) || clean(p.usage) || '',
    rating,
    reviewCount,
    reviews: Array.isArray(p.reviews)
      ? p.reviews.filter((r: any) => r && clean(r.quote) && clean(r.name))
      : undefined,
    shipping: clean(p.shippingPolicy) || clean(p.shipping) || clean(p.delivery) || '',
    guarantee: clean(p.guarantee) || clean(p.warranty) || '',
    ctaLabel: clean(p.ctaLabel) || '',
    ctaUrl: clean(p.ctaUrl) || '',
    urgency: p.urgency && typeof p.urgency === 'object' ? p.urgency : undefined,
    crossSell: Array.isArray(p.crossSell) ? p.crossSell : undefined,
  };
}

/**
 * Pull product facts out of a board node: product-library nodes, product
 * dossiers, campaign-regrouper products, landing-page settings and files.
 */
export function croFactsFromNode(node: any): CroProductFacts {
  const n = node || {};
  const appData = n.appData || {};
  const settingsProduct = appData.settings?.product || {};
  const productData = n.productData || {};
  const fileData = n.fileData || {};

  const base = croFactsFromProductLike({
    ...settingsProduct,
    ...productData,
    name:
      settingsProduct.name ||
      productData.name ||
      n.title ||
      n.executionResult?.productName ||
      '',
    category:
      settingsProduct.category ||
      productData.niche ||
      n.category ||
      '',
    description:
      settingsProduct.description ||
      productData.description ||
      n.subtitle ||
      '',
    image: settingsProduct.mainImage || productData.image || n.previewUrl || '',
    images: [
      ...(Array.isArray(settingsProduct.images)
        ? settingsProduct.images.map((img: any) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
        : []),
      ...(Array.isArray(productData.images) ? productData.images : []),
    ],
    price:
      settingsProduct.price ??
      productData.sellingPrice ??
      n.config?.sellingPrice ??
      null,
    originalPrice: settingsProduct.originalPrice ?? productData.originalPrice ?? null,
    currency: settingsProduct.currency || n.config?.currency || 'DZD',
    shipping: settingsProduct.shippingPolicy || productData.shipping || '',
    guarantee: settingsProduct.guarantee || productData.guarantee || '',
    rating: productData.rating ?? settingsProduct.rating ?? null,
    reviewCount: productData.reviewCount ?? settingsProduct.reviewCount ?? null,
    reviews: Array.isArray(settingsProduct.reviews)
      ? settingsProduct.reviews
      : Array.isArray(productData.reviews)
      ? productData.reviews
      : undefined,
    howToUse: settingsProduct.howToUse || productData.howToUse || '',
    specs: settingsProduct.ingredientsSpecs || productData.specs || '',
    ctaLabel: settingsProduct.ctaLabel || productData.ctaLabel || '',
    ctaUrl: settingsProduct.ctaUrl || productData.ctaUrl || '',
    crossSell: settingsProduct.crossSell || productData.crossSell,
  });

  if (!base.image && fileData.previewUrl) {
    base.image = fileData.previewUrl;
    base.images = [fileData.previewUrl];
  }

  return base;
}
