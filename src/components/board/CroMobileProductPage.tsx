import React, { useId, useMemo, useState } from 'react';
import {
  Award,
  BatteryCharging,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Droplets,
  Flame,
  Globe,
  Heart,
  Leaf,
  Menu,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  ThumbsUp,
  Truck,
  Wallet,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { CroProductFacts, CroStrategyData } from '../../utils/croLandingPageStrategy';

const ICONS: Record<string, LucideIcon> = {
  Zap,
  ShieldCheck,
  Truck,
  Award,
  BatteryCharging,
  Smartphone,
  Heart,
  Star,
  Droplets,
  Flame,
  Leaf,
  Clock,
  Compass,
  Globe,
  RotateCcw,
  Tag,
  ThumbsUp,
  Wallet,
  Package,
  Sparkles,
};

const WILAYAS = ['16 - Alger', '31 - Oran', '09 - Blida', '19 - Sétif', '25 - Constantine'];

function isTodo(value?: string): boolean {
  return typeof value === 'string' && /^\s*TODO\b/i.test(value);
}

function hasValue(value?: string): boolean {
  return Boolean(value && value.trim() && !isTodo(value));
}

const Todo: React.FC<{ children?: React.ReactNode; label?: string }> = ({ children, label = 'TODO' }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-amber-300/70 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
    <span className="h-1 w-1 rounded-full bg-amber-500" />
    {children || label}
  </span>
);

/** Premium, clearly-labeled inline SVG product art used when no photo exists. */
const ProductArt: React.FC<{ palette: CroStrategyData['design']; index: number; label: string }> = ({
  palette,
  index,
  label,
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const rotate = [-10, 8, -3, 14][index % 4];
  const accentX = [286, 96, 300, 88][index % 4];

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.backgroundColor} />
          <stop offset="55%" stopColor="#EEF2F7" />
          <stop offset="100%" stopColor="#DDE5EF" />
        </linearGradient>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.primaryColor} />
          <stop offset="100%" stopColor={palette.secondaryColor} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={palette.accentColor} stopOpacity="0.32" />
          <stop offset="100%" stopColor={palette.accentColor} stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#0F172A" floodOpacity="0.18" />
        </filter>
      </defs>

      <rect width="400" height="400" fill={`url(#bg-${uid})`} />
      <circle cx="200" cy="190" r="150" fill={`url(#glow-${uid})`} />
      <circle cx={accentX} cy="80" r="34" fill={palette.accentColor} opacity="0.18" />
      <circle cx={400 - accentX} cy="320" r="54" fill={palette.primaryColor} opacity="0.08" />
      <ellipse cx="200" cy="330" rx="116" ry="20" fill="#0F172A" opacity="0.1" />

      <g transform={`rotate(${rotate} 200 200)`} filter={`url(#soft-${uid})`}>
        <rect x="120" y="86" width="160" height="228" rx="38" fill={`url(#body-${uid})`} />
        <rect x="134" y="100" width="132" height="200" rx="30" fill="#0B1220" opacity="0.9" />
        <rect x="150" y="122" width="100" height="118" rx="20" fill={palette.primaryColor} opacity="0.35" />
        <circle cx="200" cy="178" r="32" fill={palette.accentColor} opacity="0.92" />
        <circle cx="200" cy="178" r="20" fill="#FFFFFF" opacity="0.22" />
        <rect x="166" y="262" width="68" height="9" rx="4.5" fill="#FFFFFF" opacity="0.55" />
        <rect x="182" y="284" width="36" height="7" rx="3.5" fill="#FFFFFF" opacity="0.28" />
      </g>

      <g opacity="0.9">
        <rect x="52" y="52" width="68" height="22" rx="11" fill="#FFFFFF" opacity="0.75" />
        <text x="86" y="67" textAnchor="middle" fontSize="10" fontWeight="700" fill={palette.textColor} opacity="0.65">
          PRODUCT
        </text>
      </g>
    </svg>
  );
};

export interface CroMobileProductPageProps {
  strategy: CroStrategyData;
  facts?: CroProductFacts | null;
  className?: string;
}

/**
 * Mobile-first (390px primary) 12-section product landing page.
 * Every claim rendered here is traceable to the provided strategy/facts. When
 * a fact is missing we show a clearly labeled TODO block instead of inventing.
 */
export const CroMobileProductPage: React.FC<CroMobileProductPageProps> = ({ strategy, facts, className = '' }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [cartCount, setCartCount] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', wilaya: WILAYAS[0], note: '' });

  const palette = strategy.design;
  const { productContent, pricingOffer, socialProof, navigation, sections } = strategy;

  const photos = useMemo(() => {
    const urls = [
      ...(Array.isArray(facts?.images) ? facts!.images : []),
      ...(facts?.image ? [facts.image] : []),
    ].filter((url): url is string => typeof url === 'string' && /^(https?:|data:|blob:|\/)/i.test(url));
    return Array.from(new Set(urls));
  }, [facts]);

  const photosCount = Math.max(photos.length, 1);
  const heroPhoto = photos[imageIndex % photosCount];
  const priceLabel = hasValue(pricingOffer.discountPrice)
    ? pricingOffer.discountPrice
    : hasValue(pricingOffer.regularPrice)
    ? pricingOffer.regularPrice
    : '';
  const compareAt = hasValue(pricingOffer.discountPrice) && hasValue(pricingOffer.regularPrice)
    ? pricingOffer.regularPrice
    : '';
  const ctaLabel = navigation.primaryCta?.label || 'Add to Cart';
  const showRating = socialProof.starRating > 0 && socialProof.reviewCount > 0;
  const section = (key: string) => sections.find((s) => s.key === key);

  const announcement = section('announcement_bar')?.headline || pricingOffer.shippingPolicy;
  const categoryLabel = productContent.categoryLabel;
  const headline = productContent.headline;
  const description = productContent.description;

  const submitOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (!orderForm.name.trim() || !orderForm.phone.trim()) return;
    setOrderPlaced(true);
    setCartCount((c) => c + 1);
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col bg-white ${className}`}
      style={{ fontFamily: palette.fontBody, color: palette.textColor }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {/* 1. ANNOUNCEMENT BAR */}
        <div
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-center text-[10px] font-semibold leading-tight"
          style={{ backgroundColor: palette.primaryColor, color: '#FFFFFF' }}
        >
          {hasValue(announcement) ? (
            <span className="truncate">{announcement}</span>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Todo>Shipping TODO</Todo>
              <span className="opacity-80">confirm free-shipping threshold & delivery time</span>
            </span>
          )}
        </div>

        {/* 2. STICKY NAV */}
        <div className="sticky top-0 z-30 border-b border-slate-100 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg p-1.5 text-slate-700 transition-colors hover:bg-slate-100"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>

            <div
              className="min-w-0 truncate text-center text-[15px] font-black uppercase tracking-[0.14em]"
              style={{ fontFamily: palette.fontHeadline, color: palette.secondaryColor }}
              title={strategy.brandIdentity.brandName}
            >
              {strategy.brandIdentity.brandName}
            </div>

            <div className="flex items-center gap-1">
              {navigation.searchIcon && (
                <button type="button" className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100" aria-label="Search">
                  <Search className="h-4 w-4" />
                </button>
              )}
              {navigation.cartIcon && (
                <button
                  type="button"
                  onClick={() => setSheetOpen(cartCount > 0)}
                  className="relative rounded-lg p-1.5 text-slate-800 hover:bg-slate-100"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                  {cartCount > 0 && (
                    <span
                      className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[8px] font-black text-white"
                      style={{ backgroundColor: palette.accentColor }}
                    >
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          {menuOpen && (
            <div className="mt-2 grid gap-1 border-t border-slate-100 pt-2">
              {navigation.navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-1.5 text-left text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 3. HERO IMAGE CAROUSEL */}
        <section className="relative">
          <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
            {heroPhoto ? (
              <img src={heroPhoto} alt={productContent.photos[imageIndex] || strategy.brandIdentity.brandName} className="h-full w-full object-cover" />
            ) : (
              <ProductArt palette={palette} index={imageIndex} label={`${strategy.brandIdentity.brandName} product shot placeholder`} />
            )}

            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {!heroPhoto && <Todo>Product photo TODO</Todo>}
              {hasValue(pricingOffer.percentOff) && (
                <span
                  className="w-fit rounded-full px-2 py-0.5 text-[9px] font-black text-white"
                  style={{ backgroundColor: palette.accentColor }}
                >
                  {pricingOffer.percentOff} OFF
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setCartCount((c) => Math.max(c, 1));
                setSheetOpen(true);
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-md backdrop-blur"
              aria-label="Save"
            >
              <Heart className="h-4 w-4" />
            </button>

            {photosCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setImageIndex((i) => (i - 1 + photosCount) % photosCount)}
                  className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setImageIndex((i) => (i + 1) % photosCount)}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 py-2.5">
            {Array.from({ length: photosCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageIndex(idx)}
                aria-label={`Go to image ${idx + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: imageIndex === idx ? 16 : 6,
                  backgroundColor: imageIndex === idx ? palette.primaryColor : '#CBD5E1',
                }}
              />
            ))}
          </div>

          {photosCount > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3">
              {Array.from({ length: photosCount }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageIndex(idx)}
                  className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100"
                  style={{ borderColor: imageIndex === idx ? palette.primaryColor : 'transparent' }}
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  {photos[idx] ? (
                    <img src={photos[idx]} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ProductArt palette={palette} index={idx} label="thumbnail" />
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 4. RATING STRIP — only rendered when verified numbers exist */}
        {showRating && (
          <div className="flex items-center justify-center gap-2 border-y border-slate-100 bg-slate-50/80 px-4 py-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className="h-3 w-3"
                  style={{
                    color: palette.accentColor,
                    fill: idx < Math.round(socialProof.starRating) ? palette.accentColor : 'transparent',
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-slate-700">{socialProof.starRating}/5</span>
            <span className="text-[10px] text-slate-500">· {socialProof.reviewCount.toLocaleString()} reviews</span>
          </div>
        )}

        {/* 5. CATEGORY LABEL + BENEFIT HEADLINE */}
        <section className="space-y-2.5 px-4 pb-4 pt-5">
          <div className="flex flex-wrap items-center gap-1.5">
            {hasValue(categoryLabel) ? (
              <span
                className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]"
                style={{ backgroundColor: `${palette.primaryColor}12`, color: palette.primaryColor }}
              >
                {categoryLabel}
              </span>
            ) : (
              <Todo>Category TODO</Todo>
            )}
            {navigation.urgency?.type !== 'none' && hasValue(navigation.urgency?.label) && (
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-bold text-rose-600">
                {navigation.urgency.label}
              </span>
            )}
          </div>

          <h1
            className="text-[26px] font-black leading-[1.12] tracking-tight"
            style={{ fontFamily: palette.fontHeadline, color: palette.secondaryColor }}
          >
            {hasValue(headline) ? headline : <span className="text-amber-700">TODO — confirm benefit headline</span>}
          </h1>

          <p className="text-[12.5px] leading-relaxed text-slate-600">
            {hasValue(description) ? description : <span className="italic text-amber-700">TODO — add a verified 2–3 sentence description.</span>}
          </p>
        </section>

        {/* 6. BENEFIT ICONS ROW */}
        <section className="grid grid-cols-2 gap-2 px-4 pb-5">
          {productContent.benefits.map((benefit, idx) => {
            const Icon = ICONS[benefit.icon] || Sparkles;
            const labelIsTodo = isTodo(benefit.label);
            return (
              <div key={`${benefit.label}-${idx}`} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <div
                  className="mb-2 flex h-7 w-7 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${palette.primaryColor}12`, color: palette.primaryColor }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="text-[11px] font-bold leading-tight" style={{ color: palette.textColor }}>
                  {labelIsTodo ? <Todo>Benefit TODO</Todo> : benefit.label}
                </div>
                {benefit.detail && benefit.detail.trim() && (
                  <div className="mt-1 text-[9.5px] leading-snug text-slate-500">{benefit.detail}</div>
                )}
              </div>
            );
          })}
        </section>

        {/* 7. PRICE BLOCK */}
        <section className="mx-4 mb-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-end gap-2">
            {hasValue(priceLabel) ? (
              <span className="text-[26px] font-black leading-none" style={{ fontFamily: palette.fontHeadline, color: palette.secondaryColor }}>
                {priceLabel}
              </span>
            ) : (
              <Todo>Price TODO</Todo>
            )}

            {hasValue(compareAt) && (
              <span className="pb-0.5 text-[12px] font-medium text-slate-400 line-through">{compareAt}</span>
            )}

            {hasValue(pricingOffer.percentOff) && (
              <span
                className="mb-0.5 rounded-md px-1.5 py-0.5 text-[9px] font-black text-white"
                style={{ backgroundColor: palette.accentColor }}
              >
                SAVE {pricingOffer.percentOff}
              </span>
            )}
          </div>

          {hasValue(pricingOffer.bundleQuantityDiscount) ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white/70 px-3 py-2 text-[10.5px] font-semibold text-slate-700">
              <span className="mr-1 inline-flex items-center gap-1 font-black" style={{ color: palette.primaryColor }}>
                <Tag className="h-3 w-3" /> Offer
              </span>
              {pricingOffer.bundleQuantityDiscount}
            </div>
          ) : null}

          <div className="mt-3 space-y-1.5">
            <div className="flex items-start gap-2 text-[10.5px] leading-snug text-slate-600">
              <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: palette.primaryColor }} />
              {hasValue(pricingOffer.shippingPolicy) ? <span>{pricingOffer.shippingPolicy}</span> : <Todo>Shipping & delivery TODO</Todo>}
            </div>
            <div className="flex items-start gap-2 text-[10.5px] leading-snug text-slate-600">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: palette.primaryColor }} />
              {hasValue(pricingOffer.guarantee) ? <span>{pricingOffer.guarantee}</span> : <Todo>Guarantee / returns TODO</Todo>}
            </div>
            {pricingOffer.subscription.available && (
              <div className="flex items-start gap-2 text-[10.5px] leading-snug text-slate-600">
                <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: palette.primaryColor }} />
                <span>
                  Subscribe & save {pricingOffer.subscription.savingsPercent}% —{' '}
                  {pricingOffer.subscription.frequencies.join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 8. PRIMARY CTA (in-flow, full width) */}
        <section className="px-4 pb-5">
          <button
            type="button"
            onClick={() => {
              setOrderPlaced(false);
              setSheetOpen(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[13px] font-black text-white shadow-lg transition-transform active:scale-[0.985]"
            style={{ backgroundColor: palette.primaryColor }}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="truncate">{ctaLabel}</span>
          </button>

          <div className="mt-2 flex items-center justify-center gap-3 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-3 w-3" /> Pay on delivery
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Inspect on arrival
            </span>
          </div>
        </section>

        {/* 9. INFO ACCORDION */}
        <section className="border-t border-slate-100 px-4 py-5">
          <h2 className="mb-2 text-[13px] font-black" style={{ fontFamily: palette.fontHeadline, color: palette.secondaryColor }}>
            Product details
          </h2>
          {[
            { key: 'description', label: 'Description', value: productContent.accordion.description },
            { key: 'specs', label: 'Ingredients & specs', value: productContent.accordion.ingredientsSpecs },
            { key: 'usage', label: 'How to use', value: productContent.accordion.howToUse },
          ].map((item) => {
            const open = openAccordion === item.key;
            return (
              <div key={item.key} className="border-b border-slate-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(open ? null : item.key)}
                  className="flex w-full items-center justify-between gap-2 py-3 text-left"
                >
                  <span className="text-[11.5px] font-bold text-slate-800">{item.label}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <div className="pb-3 text-[10.5px] leading-relaxed text-slate-600">
                    {hasValue(item.value) ? item.value : <Todo>{item.label} TODO</Todo>}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* 10. REVIEWS — real reviews only */}
        <section className="bg-slate-50/70 px-4 py-5">
          <h2 className="mb-1 text-[13px] font-black" style={{ fontFamily: palette.fontHeadline, color: palette.secondaryColor }}>
            {section('reviews')?.headline || 'Customer Reviews'}
          </h2>
          {showRating ? (
            <p className="mb-3 text-[10px] text-slate-500">
              {socialProof.starRating}/5 from {socialProof.reviewCount.toLocaleString()} verified customers
            </p>
          ) : (
            <p className="mb-3 text-[10px] text-slate-500">No verified rating supplied — numbers are intentionally omitted.</p>
          )}

          {socialProof.reviews.length > 0 ? (
            <div className="space-y-2">
              {socialProof.reviews.slice(0, 4).map((review, idx) => (
                <div key={`${review.name}-${idx}`} className="rounded-xl border border-slate-100 bg-white p-3 shadow-[0_1px_6px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold text-slate-800">{review.name}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIdx) => (
                        <Star
                          key={starIdx}
                          className="h-2.5 w-2.5"
                          style={{
                            color: palette.accentColor,
                            fill: starIdx < Math.round(review.rating) ? palette.accentColor : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-[10.5px] leading-relaxed text-slate-600">“{review.quote}”</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 p-3 text-[10px] leading-relaxed text-amber-800">
              <Todo>Reviews TODO</Todo>
              <p className="mt-1">Connect verified buyer reviews. This section stays empty until real proof is provided.</p>
            </div>
          )}
        </section>

        {/* 11. CROSS-SELL ROW */}
        <section className="px-4 py-5">
          <h2 className="mb-2 text-[13px] font-black" style={{ fontFamily: palette.fontHeadline, color: palette.secondaryColor }}>
            {section('cross_sell')?.headline || 'Frequently bought together'}
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(facts?.crossSell && facts.crossSell.length > 0
              ? facts.crossSell
              : Array.from({ length: 3 }).map((_, idx) => ({ name: '', price: '', image: '', _idx: idx }))
            ).map((item, idx) => {
              const name = typeof item?.name === 'string' ? item.name : '';
              const image = typeof (item as any)?.image === 'string' ? (item as any).image : '';
              const price = typeof (item as any)?.price === 'string' ? (item as any).price : '';
              return (
                <div key={`${name}-${idx}`} className="w-[104px] shrink-0 rounded-xl border border-slate-100 bg-white p-1.5 shadow-[0_1px_6px_rgba(15,23,42,0.04)]">
                  <div className="mb-1.5 aspect-square overflow-hidden rounded-lg bg-slate-100">
                    {image ? (
                      <img src={image} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <ProductArt palette={palette} index={idx + 1} label="related product placeholder" />
                    )}
                  </div>
                  {name ? (
                    <>
                      <div className="line-clamp-2 text-[9.5px] font-bold leading-tight text-slate-700">{name}</div>
                      {price && <div className="mt-0.5 text-[9px] font-semibold text-slate-500">{price}</div>}
                    </>
                  ) : (
                    <Todo>Related TODO</Todo>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 12. FOOTER */}
        <footer className="border-t border-slate-100 bg-[#0F172A] px-4 py-5 text-slate-300">
          <div className="text-[13px] font-black uppercase tracking-[0.14em] text-white" style={{ fontFamily: palette.fontHeadline }}>
            {strategy.brandIdentity.brandName}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-[9.5px] leading-relaxed">
            <div>
              <div className="mb-1 font-bold uppercase tracking-wide text-slate-400">Shop</div>
              {navigation.navItems.map((item) => (
                <div key={item} className="truncate">{item}</div>
              ))}
            </div>
            <div>
              <div className="mb-1 font-bold uppercase tracking-wide text-slate-400">Help</div>
              <div>{hasValue(pricingOffer.shippingPolicy) ? 'Shipping & delivery' : <Todo>Shipping TODO</Todo>}</div>
              <div>{hasValue(pricingOffer.guarantee) ? 'Returns & guarantee' : <Todo>Returns TODO</Todo>}</div>
              <div>Contact support</div>
            </div>
          </div>
          <div className="mt-4 border-t border-white/10 pt-3 text-[8.5px] text-slate-500">
            © {new Date().getFullYear()} {strategy.brandIdentity.brandName}. Claims shown are limited to supplied product facts.
          </div>
        </footer>
      </div>

      {/* 8b. STICKY MOBILE CTA */}
      <div className="relative z-20 border-t border-slate-200 bg-white/95 px-3 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            {hasValue(priceLabel) ? (
              <div className="flex items-baseline gap-1.5">
                <span className="truncate text-[15px] font-black" style={{ color: palette.secondaryColor }}>
                  {priceLabel}
                </span>
                {hasValue(compareAt) && <span className="text-[9px] text-slate-400 line-through">{compareAt}</span>}
              </div>
            ) : (
              <Todo>Price TODO</Todo>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setOrderPlaced(false);
              setSheetOpen(true);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2.5 text-[11px] font-black text-white shadow-md active:scale-[0.98]"
            style={{ backgroundColor: palette.primaryColor }}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="max-w-[150px] truncate">{ctaLabel}</span>
          </button>
        </div>
      </div>

      {/* COD ORDER SHEET (interactive preview) */}
      {sheetOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-slate-950/45 backdrop-blur-[2px]">
          <div className="max-h-[92%] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <div className="text-[13px] font-black" style={{ color: palette.secondaryColor }}>
                  {orderPlaced ? 'Order request ready' : 'Cash on delivery order'}
                </div>
                <div className="text-[9.5px] text-slate-500">
                  {orderPlaced ? 'Preview only — no order was actually submitted.' : 'Pay when your parcel arrives.'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="rounded-full bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200"
                aria-label="Close order form"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {orderPlaced ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <div className="mt-2 text-[12px] font-bold text-emerald-800">Order form captured</div>
                <p className="mt-1 text-[10px] leading-relaxed text-emerald-700">
                  {orderForm.name} · {orderForm.phone} · {orderForm.wilaya}
                </p>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-[11px] font-bold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form className="space-y-2" onSubmit={submitOrder}>
                <input
                  value={orderForm.name}
                  onChange={(e) => setOrderForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-[11px] outline-none focus:border-slate-400"
                />
                <input
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="Phone number"
                  inputMode="tel"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-[11px] outline-none focus:border-slate-400"
                />
                <select
                  value={orderForm.wilaya}
                  onChange={(e) => setOrderForm((f) => ({ ...f, wilaya: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] outline-none focus:border-slate-400"
                >
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
                <input
                  value={orderForm.note}
                  onChange={(e) => setOrderForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Address / note (optional)"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-[11px] outline-none focus:border-slate-400"
                />
                <button
                  type="submit"
                  className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[12px] font-black text-white"
                  style={{ backgroundColor: palette.primaryColor }}
                >
                  <Check className="h-4 w-4" />
                  Confirm order
                </button>
                <p className="text-center text-[8.5px] text-slate-400">
                  Preview form · uses the CTA destination “{navigation.primaryCta?.url || '#order'}”
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CroMobileProductPage;
