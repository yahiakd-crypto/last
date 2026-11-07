/* ============================================================
   AI PRODUCT PAGE BUILDER — Shopify-Grade DTC Page Builder
   Professional product page generation with live preview
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, p) => (p || document).querySelector(s);
  const ic = (n, s) => `<i data-lucide="${n}" style="width:${s || 18}px;height:${s || 18}px"></i>`;
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const uid = () => "s" + Math.random().toString(36).slice(2, 9);

  /* ═══════════════════════════════════════════
     SECTION DEFINITIONS — Product Page Sections
     ═══════════════════════════════════════════ */
  const SECTIONS = {
    product_hero: {
      defaults: () => ({
        badge: "BEST SELLER",
        title: "Product Name",
        subtitle: "Short benefit-driven tagline that explains the main value.",
        price: "$49.99",
        comparePrice: "$79.99",
        discount: "38% OFF",
        cta: "Add to Cart",
        ctaColor: "#1A1A2E",
        trust1: "Free Shipping",
        trust2: "30-Day Guarantee",
        trust3: "Secure Checkout",
        paymentIcons: "Visa · Mastercard · PayPal · Apple Pay",
      }),
      render(d) {
        return `<section class="pp-hero">
          <div class="pp-hero-grid">
            <div class="pp-hero-gallery">
              <div class="pp-hero-main-img">${ic("image", 48)}<span>Product Image</span></div>
              <div class="pp-hero-thumbs">
                <div class="pp-hero-thumb active">${ic("image", 20)}</div>
                <div class="pp-hero-thumb">${ic("image", 20)}</div>
                <div class="pp-hero-thumb">${ic("image", 20)}</div>
                <div class="pp-hero-thumb">${ic("video", 20)}</div>
              </div>
            </div>
            <div class="pp-hero-info">
              ${d.badge ? `<div class="pp-hero-badge">${esc(d.badge)}</div>` : ""}
              <h1>${esc(d.title)}</h1>
              <p class="pp-hero-sub">${esc(d.subtitle)}</p>
              <div class="pp-hero-rating">${ic("star", 16)}${ic("star", 16)}${ic("star", 16)}${ic("star", 16)}${ic("star", 16)} <span>4.8 (2,347 reviews)</span></div>
              <div class="pp-hero-pricing">
                <span class="pp-price-now">${esc(d.price)}</span>
                ${d.comparePrice ? `<span class="pp-price-was">${esc(d.comparePrice)}</span>` : ""}
                ${d.discount ? `<span class="pp-price-save">${esc(d.discount)}</span>` : ""}
              </div>
              <div class="pp-hero-variants">
                <div class="pp-variant-label">Color</div>
                <div class="pp-variant-options">
                  <span class="pp-variant-opt active" style="background:#1A1A2E"></span>
                  <span class="pp-variant-opt" style="background:#6366F1"></span>
                  <span class="pp-variant-opt" style="background:#059669"></span>
                </div>
              </div>
              <button class="pp-hero-cta" style="background:${d.ctaColor}">${esc(d.cta)}</button>
              <div class="pp-hero-trust-row">
                <span>${ic("truck", 14)} ${esc(d.trust1)}</span>
                <span>${ic("shield-check", 14)} ${esc(d.trust2)}</span>
                <span>${ic("lock", 14)} ${esc(d.trust3)}</span>
              </div>
              <div class="pp-hero-payments">${esc(d.paymentIcons)}</div>
            </div>
          </div>
        </section>`;
      },
    },
    problem: {
      defaults: () => ({
        title: "Sound <em>Familiar</em>?",
        subtitle: "You're not alone — 73% of people face this exact problem every day.",
        items: [
          { icon: "alert-triangle", text: "You've tried multiple solutions but nothing really works." },
          { icon: "clock", text: "You're wasting hours every week on a problem that should be simple." },
          { icon: "x-circle", text: "The frustration is real — and it's costing you money, time, and peace of mind." },
        ],
      }),
      render(d) {
        const items = d.items.map((it) => `
          <div class="pp-problem-item">
            <div class="pp-problem-icon">${ic(it.icon, 22)}</div>
            <p>${esc(it.text)}</p>
          </div>`).join("");
        return `<section class="pp-section pp-problem">
          <div class="pp-section-inner">
            <div class="pp-section-title"><h2>${d.title}</h2><p>${esc(d.subtitle)}</p></div>
            <div class="pp-problem-list">${items}</div>
          </div></section>`;
      },
    },
    benefits: {
      defaults: () => ({
        title: "Why Customers <em>Love</em> It",
        subtitle: "Real results that make a real difference.",
        items: [
          { icon: "trending-up", color: "#10B981", title: "2× Faster Results", desc: "See measurable improvements within the first week of use." },
          { icon: "shield-check", color: "#6366F1", title: "Clinically Tested", desc: "Backed by research and trusted by over 10,000 customers." },
          { icon: "heart", color: "#EC4899", title: "Feel the Difference", desc: "Premium quality you can feel from the very first use." },
          { icon: "clock", color: "#F59E0B", title: "Saves You Time", desc: "Just 5 minutes a day for maximum results." },
        ],
      }),
      render(d) {
        const items = d.items.map((b) => `
          <div class="pp-benefit-card">
            <div class="pp-benefit-icon" style="background:${b.color}12;color:${b.color}">${ic(b.icon, 24)}</div>
            <h3>${esc(b.title)}</h3>
            <p>${esc(b.desc)}</p>
          </div>`).join("");
        return `<section class="pp-section pp-section-alt pp-benefits">
          <div class="pp-section-inner">
            <div class="pp-section-title"><h2>${d.title}</h2><p>${esc(d.subtitle)}</p></div>
            <div class="pp-benefits-grid">${items}</div>
          </div></section>`;
      },
    },
    how_it_works: {
      defaults: () => ({
        title: "How It <em>Works</em>",
        subtitle: "Three simple steps to transform your experience.",
        steps: [
          { num: "1", title: "Choose Your Plan", desc: "Select the option that fits your needs. No commitment required." },
          { num: "2", title: "Apply & Enjoy", desc: "Follow our simple instructions. Most customers see results in days." },
          { num: "3", title: "Love the Results", desc: "Join thousands of happy customers who made the switch." },
        ],
      }),
      render(d) {
        const steps = d.steps.map((s) => `
          <div class="pp-step">
            <div class="pp-step-num">${esc(s.num)}</div>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.desc)}</p>
          </div>`).join("");
        return `<section class="pp-section pp-how">
          <div class="pp-section-inner">
            <div class="pp-section-title"><h2>${d.title}</h2><p>${esc(d.subtitle)}</p></div>
            <div class="pp-steps-grid">${steps}</div>
          </div></section>`;
      },
    },
    social_proof: {
      defaults: () => ({
        title: "Trusted by <em>10,000+</em> Happy Customers",
        subtitle: "Don't just take our word for it.",
        avgRating: "4.8",
        reviewCount: "2,347",
        testimonials: [
          { stars: 5, text: "This changed everything for me. Within a week I could already see a massive difference. Worth every penny.", name: "Sarah M.", role: "Verified Buyer", color: "#6366F1", verified: true },
          { stars: 5, text: "I was skeptical at first, but the results speak for themselves. My friends keep asking what changed.", name: "James L.", role: "Verified Buyer", color: "#10B981", verified: true },
          { stars: 5, text: "Best purchase I've made this year. The quality is incredible and the customer service is top-notch.", name: "Emily R.", role: "Verified Buyer", color: "#F59E0B", verified: true },
        ],
      }),
      render(d) {
        const cards = d.testimonials.map((t) => {
          const stars = Array(t.stars).fill('<svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join("");
          return `<div class="pp-review">
            <div class="pp-review-stars">${stars}</div>
            <div class="pp-review-text">"${esc(t.text)}"</div>
            <div class="pp-review-author">
              <div class="pp-review-avatar" style="background:${t.color}">${t.name[0]}</div>
              <div><div class="pp-review-name">${esc(t.name)}</div>${t.verified ? '<div class="pp-review-verified">' + ic("check-circle", 12) + " Verified Buyer</div>" : ""}</div>
            </div>
          </div>`;
        }).join("");
        return `<section class="pp-section pp-social">
          <div class="pp-section-inner">
            <div class="pp-section-title"><h2>${d.title}</h2><p>${esc(d.subtitle)}</p></div>
            <div class="pp-social-rating">${ic("star", 24)} <span class="pp-social-score">${esc(d.avgRating)}</span> <span class="pp-social-count">Based on ${esc(d.reviewCount)} reviews</span></div>
            <div class="pp-reviews-grid">${cards}</div>
          </div></section>`;
      },
    },
    comparison: {
      defaults: () => ({
        title: "Why We're <em>Different</em>",
        subtitle: "See how we compare to traditional alternatives.",
        headers: ["Feature", "Our Product", "Competitor A", "Old Way"],
        rows: [
          ["Quality Materials", "✓ Premium", "✓ Standard", "✗ Cheap"],
          ["Money-Back Guarantee", "✓ 30 Days", "✗ None", "✗ None"],
          ["Free Shipping", "✓ Worldwide", "✗ $15 Fee", "✗ $20 Fee"],
          ["Customer Support", "✓ 24/7 Live", "✗ Email Only", "✗ None"],
          ["Results Speed", "✓ 1 Week", "~ 1 Month", "✗ Never"],
        ],
      }),
      render(d) {
        const hdrs = d.headers.map((h) => `<th>${esc(h)}</th>`).join("");
        const rows = d.rows.map((r) => `<tr>${r.map((c, i) => `<td class="${i === 1 ? "pp-tbl-highlight" : ""}">${esc(c)}</td>`).join("")}</tr>`).join("");
        return `<section class="pp-section pp-compare">
          <div class="pp-section-inner">
            <div class="pp-section-title"><h2>${d.title}</h2><p>${esc(d.subtitle)}</p></div>
            <div class="pp-table-wrap"><table class="pp-table"><thead><tr>${hdrs}</tr></thead><tbody>${rows}</tbody></table></div>
          </div></section>`;
      },
    },
    offer: {
      defaults: () => ({
        title: "Special <em>Offer</em> — Today Only",
        subtitle: "Get everything you need at a price that won't last.",
        price: "$49.99",
        comparePrice: "$79.99",
        savings: "You save $30.00",
        bonuses: [
          { icon: "gift", text: "Bonus: Quick Start Guide (Value $19)" },
          { icon: "gift", text: "Bonus: Premium Support Access (Value $29)" },
          { icon: "truck", text: "Free Express Shipping (Value $9.99)" },
        ],
        cta: "Claim Your Discount Now",
        ctaColor: "#DC2626",
        urgency: "Hurry — Offer ends in 23:59:59",
      }),
      render(d) {
        const bonuses = d.bonuses.map((b) => `
          <div class="pp-offer-bonus">${ic(b.icon, 16)} <span>${esc(b.text)}</span></div>`).join("");
        return `<section class="pp-section pp-offer">
          <div class="pp-section-inner">
            <div class="pp-offer-box">
              <div class="pp-offer-badge">${ic("zap", 16)} LIMITED OFFER</div>
              <h2>${d.title}</h2>
              <p>${esc(d.subtitle)}</p>
              <div class="pp-offer-pricing">
                <span class="pp-offer-now">${esc(d.price)}</span>
                <span class="pp-offer-was">${esc(d.comparePrice)}</span>
              </div>
              <div class="pp-offer-savings">${esc(d.savings)}</div>
              <div class="pp-offer-bonuses">${bonuses}</div>
              <button class="pp-offer-cta" style="background:${d.ctaColor}">${esc(d.cta)}</button>
              <div class="pp-offer-urgency">${ic("clock", 14)} ${esc(d.urgency)}</div>
            </div>
          </div></section>`;
      },
    },
    guarantee: {
      defaults: () => ({
        title: "30-Day <em>Money-Back</em> Guarantee",
        subtitle: "Try it risk-free. If you're not 100% satisfied, we'll refund every penny — no questions asked.",
        items: [
          { icon: "shield-check", title: "Secure Checkout", desc: "256-bit SSL encryption protects your payment." },
          { icon: "refresh-cw", title: "Easy Returns", desc: "Not satisfied? Return within 30 days for a full refund." },
          { icon: "headphones", title: "24/7 Support", desc: "Our team is always here to help via chat, email, or phone." },
          { icon: "lock", title: "Privacy Protected", desc: "We never share your data. Your information stays safe." },
        ],
      }),
      render(d) {
        const items = d.items.map((it) => `
          <div class="pp-trust-item">
            <div class="pp-trust-icon">${ic(it.icon, 28)}</div>
            <h4>${esc(it.title)}</h4>
            <p>${esc(it.desc)}</p>
          </div>`).join("");
        return `<section class="pp-section pp-section-alt pp-guarantee">
          <div class="pp-section-inner">
            <div class="pp-section-title"><h2>${d.title}</h2><p>${esc(d.subtitle)}</p></div>
            <div class="pp-trust-grid">${items}</div>
          </div></section>`;
      },
    },
    faq: {
      defaults: () => ({
        title: "Frequently <em>Asked</em>",
        subtitle: "Got questions? We've got answers.",
        items: [
          { q: "How does it work?", a: "Simply follow our 3-step process. Most customers see results within the first week of use." },
          { q: "What if I'm not satisfied?", a: "We offer a 30-day money-back guarantee. If you're not happy, contact us for a full refund." },
          { q: "How long does shipping take?", a: "Free standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout." },
          { q: "Is it suitable for beginners?", a: "Absolutely. Our product is designed for everyone, regardless of experience level." },
          { q: "What's included in the box?", a: "Everything you need to get started: the product, a quick start guide, and access to our premium support." },
          { q: "How do I contact support?", a: "You can reach us 24/7 via live chat, email, or phone. We typically respond within 2 hours." },
        ],
      }),
      render(d) {
        const items = d.items.map((f, i) => `
          <div class="pp-faq-item">
            <button class="pp-faq-q${i === 0 ? " open" : ""}" data-faq="${i}">
              <span>${esc(f.q)}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="pp-faq-a"${i === 0 ? ' style="max-height:200px"' : ""}>
              <div class="pp-faq-a-inner">${esc(f.a)}</div>
            </div>
          </div>`).join("");
        return `<section class="pp-section pp-faq">
          <div class="pp-section-inner">
            <div class="pp-section-title"><h2>${d.title}</h2><p>${esc(d.subtitle)}</p></div>
            <div class="pp-faq-list">${items}</div>
          </div></section>`;
      },
    },
    final_cta: {
      defaults: () => ({
        title: "Ready to Transform\nYour Experience?",
        subtitle: "Join 10,000+ customers who already made the switch.",
        price: "$49.99",
        cta: "Get It Now — 38% Off",
        ctaColor: "#1A1A2E",
        badge: "30-Day Guarantee · Free Shipping",
      }),
      render(d) {
        return `<section class="pp-final-cta">
          <div class="pp-final-inner">
            <h2>${esc(d.title).replace(/\n/g, "<br>")}</h2>
            <p class="pp-final-sub">${esc(d.subtitle)}</p>
            <div class="pp-final-price">${esc(d.price)}</div>
            <button class="pp-final-btn" style="background:${d.ctaColor}">${esc(d.cta)}</button>
            <div class="pp-final-badge">${esc(d.badge)}</div>
          </div>
        </section>`;
      },
    },
    footer: {
      defaults: () => ({ text: "© 2026 YourBrand. All rights reserved." }),
      render(d) { return `<div class="pp-footer">${esc(d.text)}</div>`; },
    },
  };

  const SECTION_TYPES = Object.keys(SECTIONS);

  const TYPE_ALIASES = {
    hero: "product_hero", hero_section: "product_hero", product_section: "product_hero",
    problem_section: "problem", pain_points: "problem",
    benefit_section: "benefits", feature_section: "benefits", features: "benefits",
    how_section: "how_it_works", process: "how_it_works", steps_section: "how_it_works", usage: "how_it_works",
    testimonials: "social_proof", reviews: "social_proof", review_section: "social_proof", social_section: "social_proof",
    comparison_section: "comparison", vs: "comparison", compare: "comparison",
    pricing: "offer", pricing_section: "offer", deal: "offer", special_offer: "offer",
    guarantee_section: "guarantee", trust_section: "guarantee", trust: "guarantee",
    faq_section: "faq", questions: "faq",
    cta: "final_cta", call_to_action: "final_cta", final_section: "final_cta", bottom_cta: "final_cta",
    footer_section: "footer", site_footer: "footer",
  };

  function resolveType(t) { return TYPE_ALIASES[t] || t; }

  /* ═══════════════════════════════════════════
     PAGE STATE
     ═══════════════════════════════════════════ */
  let state = { sections: [] };
  let selectedId = null;
  let device = "desktop";
  let chatHistory = [];
  let isProcessing = false;

  function addSection(type, pos, data) {
    const s = { id: uid(), type, data: data || SECTIONS[type].defaults() };
    if (pos != null && pos >= 0 && pos < state.sections.length) state.sections.splice(pos, 0, s);
    else state.sections.push(s);
    return s;
  }
  function removeSection(id) { state.sections = state.sections.filter((s) => s.id !== id); }
  function removeSectionByType(type) {
    const s = state.sections.find((x) => x.type === type);
    if (s) { removeSection(s.id); return true; }
    return false;
  }
  function updateSection(type, patch) {
    const s = state.sections.find((x) => x.type === type);
    if (s) Object.assign(s.data, patch);
    return s;
  }
  function findSectionByType(type) { return state.sections.find((s) => s.type === type); }
  function clearSections() { state.sections = []; }

  /* ═══════════════════════════════════════════
     AI SYSTEM PROMPT — Dynamic Product Page Builder
     ═══════════════════════════════════════════ */
  const LP_SYSTEM = `You are a premium DTC product page builder. You build high-converting Shopify-grade product pages.

CRITICAL RULE: The reference design is a LAYOUT TEMPLATE only. When the user provides a product, you must generate 100% NEW content specific to that product. Never hardcode or reuse content from a reference product.

WORKFLOW:
1. Analyze the product the user describes
2. Extract: name, price, category, features, target audience, key benefits
3. Generate ALL section content from that product information
4. Return the complete page as structured JSON

REPLY FORMAT — You MUST use exactly this structure. Nothing else:

[ACTIONS]
{"actions":[{"action":"clear"},{"action":"add","type":"product_hero","data":{"badge":"PRODUCT BADGE","title":"ACTUAL PRODUCT NAME FROM USER","subtitle":"Benefit-driven tagline for THIS specific product","price":"USER'S PRICE","comparePrice":"HIGHER PRICE","discount":"XX% OFF","cta":"CTA FOR THIS PRODUCT","ctaColor":"#HEX","trust1":"Free Shipping","trust2":"30-Day Guarantee","trust3":"Secure Checkout"}},{"action":"add","type":"problem","data":{"title":"Problem about THIS product's category","subtitle":"Why customers struggle with THIS type of product","items":[{"icon":"alert-triangle","text":"Pain point 1 specific to this product"},{"icon":"clock","text":"Pain point 2 specific to this product"},{"icon":"x-circle","text":"Pain point 3 specific to this product"}]}},{"action":"add","type":"benefits","data":{"title":"Benefits of THIS product","subtitle":"Why choose THIS product","items":[{"icon":"trending-up","color":"#10B981","title":"Benefit 1","desc":"Specific benefit of THIS product"},{"icon":"shield-check","color":"#6366F1","title":"Benefit 2","desc":"Specific benefit of THIS product"},{"icon":"heart","color":"#EC4899","title":"Benefit 3","desc":"Specific benefit of THIS product"},{"icon":"clock","color":"#F59E0B","title":"Benefit 4","desc":"Specific benefit of THIS product"}]}},{"action":"add","type":"how_it_works","data":{"title":"How It Works","subtitle":"Steps for THIS product","steps":[{"num":"1","title":"Step for THIS product","desc":"Description for THIS product"},{"num":"2","title":"Step for THIS product","desc":"Description for THIS product"},{"num":"3","title":"Step for THIS product","desc":"Description for THIS product"}]}},{"action":"add","type":"social_proof","data":{"title":"Customer Reviews","subtitle":"Real feedback about THIS product","avgRating":"4.8","reviewCount":"2347","testimonials":[{"stars":5,"text":"Review about THIS product","name":"Customer Name","role":"Verified Buyer","color":"#6366F1","verified":true},{"stars":5,"text":"Review about THIS product","name":"Customer Name","role":"Verified Buyer","color":"#10B981","verified":true},{"stars":5,"text":"Review about THIS product","name":"Customer Name","role":"Verified Buyer","color":"#F59E0B","verified":true}]}},{"action":"add","type":"comparison","data":{"title":"Why We're Different","subtitle":"How THIS product compares","headers":["Feature","This Product","Competitor","Traditional"],"rows":[["Feature","✓ This product","✗ Competitor","✗ Traditional"]]}},{"action":"add","type":"offer","data":{"title":"Special Offer","subtitle":"Get THIS product today","price":"USER'S PRICE","comparePrice":"HIGHER PRICE","savings":"Save $XX","bonuses":[{"icon":"gift","text":"Bonus related to THIS product"}],"cta":"Buy THIS product","ctaColor":"#DC2626","urgency":"Limited time offer"}},{"action":"add","type":"guarantee","data":{"title":"Money-Back Guarantee","subtitle":"Try THIS product risk-free","items":[{"icon":"shield-check","title":"Secure Checkout","desc":"256-bit SSL encryption"},{"icon":"refresh-cw","title":"Easy Returns","desc":"30-day full refund"},{"icon":"headphones","title":"24/7 Support","desc":"We're here to help"},{"icon":"lock","title":"Privacy Protected","desc":"Your data stays safe"}]}},{"action":"add","type":"faq","data":{"title":"Frequently Asked","subtitle":"Questions about THIS product","items":[{"q":"FAQ about THIS product?","a":"Answer specific to THIS product"},{"q":"FAQ about THIS product?","a":"Answer specific to THIS product"},{"q":"FAQ about THIS product?","a":"Answer specific to THIS product"},{"q":"FAQ about THIS product?","a":"Answer specific to THIS product"},{"q":"FAQ about THIS product?","a":"Answer specific to THIS product"},{"q":"FAQ about THIS product?","a":"Answer specific to THIS product"}]}},{"action":"add","type":"final_cta","data":{"title":"Ready to Try THIS PRODUCT?","subtitle":"Join happy customers","price":"USER'S PRICE","cta":"Buy THIS product now","ctaColor":"#HEX","badge":"30-Day Guarantee · Free Shipping"}},{"action":"add","type":"footer","data":{"text":"© 2026 BRAND NAME. All rights reserved."}}]}
[/ACTIONS]

RULES:
1. Start with [ACTIONS], end with [/ACTIONS]
2. Inside put valid JSON with {"actions":[...]}
3. Section types: product_hero, problem, benefits, how_it_works, social_proof, comparison, offer, guarantee, faq, final_cta, footer
4. ALWAYS build ALL 11 sections from product_hero to footer
5. EVERY section must contain content SPECIFIC to the product the user described
6. NEVER use generic placeholder text — generate unique copy for each product
7. Extract price from user input — use THEIR price, not a default
8. Generate benefits based on the product's actual features
9. Generate FAQ based on common questions for THIS type of product
10. Generate comparison rows relevant to THIS product category
11. Generate problem statements about THIS product's specific pain points
12. Write benefit-driven headlines, not feature-driven
13. Translate features into customer outcomes
14. Use realistic placeholder reviews mentioning the product name
15. After [/ACTIONS] add a brief summary of what you built
16. NEVER return raw HTML — ONLY [ACTIONS] JSON format
17. Icons available: zap, palette, bar-chart-3, smartphone, lock, puzzle, globe, cpu, layers, mail, phone, star, heart, gift, award, compass, code, rocket, users, eye, shield, clock, trending-up, target, shield-check, headphones, alert-triangle, x-circle, refresh-cw, truck, check-circle, check, home, sun, sparkles, coffee, utensils, dumbbell, briefcase, car, camping, baby, paw-print, scissors, gem, music, camera, video, anchor, mountain, flame, droplet, wifi, battery, speaker, monitor, keyboard, mouse, print, database, server, cloud, zap, activity, bar-chart, pie-chart, trending-down, award, map, navigation, umbrella, flashlight, tent, fish, Leaf, Wheat, Milk, Cookie, Citrus  `;

  /* ═══════════════════════════════════════════
     AI: REAL API + LOCAL FALLBACK
     ═══════════════════════════════════════════ */
  let apiStatus = { connected: false, provider: "none", model: "none" };

  async function checkApiConnection() {
    try { const r = await fetch("/api/health"); const j = await r.json(); apiStatus.connected = !!(r.ok && j.ok); }
    catch (e) { apiStatus.connected = false; }
    updateApiBadge();
    return apiStatus.connected;
  }

  function updateApiBadge() {
    const badge = $("#api-status-badge");
    if (!badge) return;
    if (apiStatus.connected) {
      badge.className = "api-badge api-connected";
      badge.innerHTML = `${ic("wifi", 12)} AI Connected`;
      badge.title = `Connected: ${apiStatus.provider} · ${apiStatus.model}`;
    } else {
      badge.className = "api-badge api-disconnected";
      badge.innerHTML = `${ic("wifi-off", 12)} Demo Mode`;
      badge.title = "No AI key — using local fallback";
    }
    if (typeof lucide !== "undefined") lucide.createIcons({ nodes: [badge] });
  }

  function showThinkingInPreview() {
    const el = $("#preview-content");
    if (!el || el.querySelector(".pv-thinking-overlay")) return;
    const ov = document.createElement("div");
    ov.className = "pv-thinking-overlay";
    ov.innerHTML = `<div class="pv-thinking-box"><div class="pv-thinking-spinner"></div><div class="pv-thinking-title">AI is building your page...</div><div class="pv-thinking-msg">Analyzing product and crafting sections</div><div class="pv-thinking-dots"><span></span><span></span><span></span></div></div>`;
    el.appendChild(ov);
  }
  function removeThinkingFromPreview() { const el = $("#preview-content"); if (el) { const ov = el.querySelector(".pv-thinking-overlay"); if (ov) ov.remove(); } }
  function updateThinkingText(t) { const el = $("#preview-content"); if (el) { const m = el.querySelector(".pv-thinking-msg"); if (m) m.textContent = t; } }

  function buildStateContext() {
    if (!state.sections.length) return "Current page: empty (no sections yet).";
    return "Current page sections: [" + state.sections.map((s) => s.type).join(", ") + "]";
  }

  async function aiChat(userText) {
    chatHistory.push({ role: "user", content: userText });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    const hasApi = window.PL_API && typeof window.PL_API.chat === "function";
    if (hasApi) {
      try {
        updateThinkingText("Connecting to AI provider...");
        const ctx = buildStateContext();
        updateThinkingText("Generating product page sections...");
        const res = await window.PL_API.chat(chatHistory, { system: LP_SYSTEM + "\n\n" + ctx });
        if (res && res.ok && res.reply) {
          chatHistory.push({ role: "assistant", content: res.reply });
          if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
          const isReal = res.meta && res.meta.provider !== "demo";
          if (isReal) { apiStatus.connected = true; apiStatus.provider = res.meta.provider || "?"; apiStatus.model = res.meta.model || "?"; updateApiBadge(); }
          return { text: res.reply, meta: res.meta, isReal };
        }
      } catch (e) { /* fallback */ }
    }
    return { text: "", meta: { provider: "local", model: "fallback", status: "ok" }, isReal: false };
  }

  /* ═══════════════════════════════════════════
     ACTION PARSING + SMART FALLBACK
     ═══════════════════════════════════════════ */
  function parseActions(reply, userRequest) {
    let actions = null;
    /* Try [ACTIONS] block */
    const match = reply.match(/\[ACTIONS\]\s*([\s\S]*?)\s*\[\/ACTIONS\]/i);
    if (match) { actions = tryParseActionsJSON(match[1]); }
    /* Try bare JSON */
    if (!actions) {
      const jm = reply.match(/\{[\s]*"actions"[\s]*:\s*\[[\s\S]*?\]\s*\}/);
      if (jm) actions = tryParseActionsJSON(jm[0]);
    }
    /* If AI gave partial response, supplement with fallback */
    if (actions && actions.length) {
      const addCount = actions.filter((a) => a.action === "add").length;
      if (addCount < 5) {
        const fallback = buildProductPage(userRequest || chatHistory[0]?.content || "");
        const have = new Set(actions.filter((a) => a.action === "add").map((a) => resolveType(a.type)));
        for (const fb of fallback) {
          if (fb.action === "add" && !have.has(fb.type)) actions.push(fb);
        }
      }
      return actions;
    }
    /* Full fallback */
    return buildProductPage(userRequest || chatHistory[0]?.content || "");
  }

  function tryParseActionsJSON(str) {
    try { const p = JSON.parse(str); if (p.actions && p.actions.length) return p.actions; } catch (e) {}
    try { const c = str.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim(); const p = JSON.parse(c); if (p.actions && p.actions.length) return p.actions; } catch (e) {}
    return null;
  }

  /* ═══════════════════════════════════════════
     PRODUCT DETAIL EXTRACTION
     ═══════════════════════════════════════════ */
  function extractProductDetails(req) {
    const info = { name: "", price: "", features: [], description: "", audience: "", category: "" };
    const nameM = req.match(/(?:called|named|brand|product|company|app|shop|store)\s+["'"]?([A-Z][\w\s&.'\-]{1,40}?)["'"]?(?:\s*[,.—\-–]|$|\.)/i);
    if (nameM) { info.name = nameM[1].trim(); }
    if (!info.name) { const caps = req.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g); const skip = ["Create", "Build", "Make", "Design", "I", "A", "An", "The", "For", "With", "And", "Shopify", "Product", "Page", "Landing", "Builds", "Premium", "Professional"]; if (caps) { const found = caps.find((w) => !skip.includes(w)); if (found) info.name = found; } }
    if (!info.name) info.name = "YourBrand";
    const priceM = req.match(/\$(\d+(?:\.\d{2})?)/);
    if (priceM) info.price = "$" + priceM[1];
    const moPrice = req.match(/\$(\d+(?:\.\d{2})?)\s*(?:\/mo|per\s*month|monthly|\/\s*month)/i);
    if (moPrice) info.price = "$" + moPrice[1] + "/mo";
    const featuresM = req.match(/features?[:\s]+(.+?)(?:\.|$)/i);
    if (featuresM) info.features = featuresM[1].split(/,|;|and/).map((f) => f.trim()).filter(Boolean).slice(0, 6);
    const descM = req.match(/(?:description|desc|about|tagline)[:\s]+(.+?)(?:\.|$)/i);
    if (descM) info.description = descM[1].trim();
    const audM = req.match(/(?:target|audience|customer|for)\s*[:\s]+(.+?)(?:\.|$)/i);
    if (audM) info.audience = audM[1].trim();
    info.category = detectType(req.toLowerCase());
    if (info.features.length === 0) { const words = req.toLowerCase(); const feats = []; if (words.match(/premium|high.?end|luxury/)) feats.push("premium quality"); if (words.match(/wireless|bluetooth/)) feats.push("wireless connectivity"); if (words.match(/rechargeable|battery/)) feats.push("rechargeable battery"); if (words.match(/waterproof|water.?resistant/)) feats.push("waterproof design"); if (words.match(/portable|compact|lightweight/)) feats.push("portable design"); if (words.match(/fast|quick|rapid/)) feats.push("fast performance"); if (words.match(/durable|strong|heavy.?duty/)) feats.push("durable construction"); if (words.match(/organic|natural/)) feats.push("natural ingredients"); if (words.match(/free.?trial|free plan/)) feats.push("free trial available"); if (words.match(/guarantee|warranty/)) feats.push("money-back guarantee"); if (words.match(/free shipping|free delivery/)) feats.push("free shipping"); info.features = feats.slice(0, 6); }
    if (info.features.length === 0) info.features = ["premium quality", "proven results", "risk-free guarantee"];
    return info;
  }

  /* ═══════════════════════════════════════════
     CATEGORY SYSTEM — Themes + Content Generators
     ═══════════════════════════════════════════ */
  const THEMES = {
    saas: { color: "#6366F1", accent: "#0EA5E9", badge: "LAUNCHING NOW", cta: "Start Free Trial", icons: ["bar-chart-3", "zap", "globe", "layers", "cpu", "lock"] },
    food: { color: "#059669", accent: "#F59E0B", badge: "100% ORGANIC", cta: "Order Now", icons: ["heart", "star", "award", "gift", "clock", "shield-check"] },
    fitness: { color: "#DC2626", accent: "#F97316", badge: "#1 BEST SELLER", cta: "Shop Now", icons: ["zap", "target", "trending-up", "users", "shield-check", "clock"] },
    beauty: { color: "#DB2777", accent: "#8B5CF6", badge: "DERMATOLOGIST APPROVED", cta: "Add to Cart", icons: ["star", "heart", "sparkles", "shield-check", "award", "sun"] },
    fashion: { color: "#1A1A2E", accent: "#D4AF37", badge: "NEW COLLECTION", cta: "Shop the Look", icons: ["star", "heart", "gift", "award", "eye", "compass"] },
    electronics: { color: "#1E40AF", accent: "#06B6D4", badge: "TECH INNOVATION", cta: "Buy Now", icons: ["cpu", "zap", "smartphone", "globe", "shield", "layers"] },
    kitchen: { color: "#EA580C", accent: "#059669", badge: "CHEF APPROVED", cta: "Order Now", icons: ["utensils", "star", "award", "heart", "shield-check", "clock"] },
    automotive: { color: "#374151", accent: "#2563EB", badge: "TOP RATED", cta: "Add to Cart", icons: ["car", "shield", "star", "zap", "award", "check-circle"] },
    outdoor: { color: "#065F46", accent: "#D97706", badge: "ADVENTURE READY", cta: "Get Yours", icons: ["mountain", "tent", "flashlight", "compass", "shield-check", "flame"] },
    home: { color: "#92400E", accent: "#059669", badge: "HANDCRAFTED", cta: "Add to Cart", icons: ["home", "heart", "star", "award", "shield-check", "clock"] },
    pet: { color: "#EA580C", accent: "#6366F1", badge: "VET RECOMMENDED", cta: "Order Now", icons: ["heart", "star", "award", "shield-check", "gift", "clock"] },
    general: { color: "#1A1A2E", accent: "#6366F1", badge: "BEST SELLER", cta: "Add to Cart", icons: ["zap", "star", "shield-check", "trending-up", "heart", "clock"] },
  };

  function detectType(r) {
    if (r.match(/saas|software|dashboard|analytics|platform|tool|app|subscription|crm|erp/)) return "saas";
    if (r.match(/coffee|cafe|restaurant|food|drink|organic|tea|snack|meal|blender|juicer|kitchen|cooking|bake|recipe|chef/)) return "kitchen";
    if (r.match(/car|auto|vehicle|dashcam|mount|holder|driving|gps|tire|brake/)) return "automotive";
    if (r.match(/camp|hike|outdoor|lantern|tent|sleeping|backpack|fishing|hunt|survival|flashlight|torch/)) return "outdoor";
    if (r.match(/fitness|gym|workout|health|exercise|sport|yoga|supplement|protein|posture|stretch/)) return "fitness";
    if (r.match(/skincare|skin|beauty|cream|serum|moisturizer|sunscreen|cosmetic|makeup|lip/)) return "beauty";
    if (r.match(/fashion|clothing|shirt|dress|shoe|bag|watch|jewelry|accessori|wallet|belt|hat/)) return "fashion";
    if (r.match(/electronics|headphone|speaker|charger|gadget|tech|device|phone|earbuds|power.?bank|led|lamp/)) return "electronics";
    if (r.match(/home|furniture|lamp|decor|kitchen|bed|pillow|mat|organiz|vacuum|clean|air.?purif/)) return "home";
    if (r.match(/pet|dog|cat|animal|pet food|treat|leash|collar|groom/)) return "pet";
    return "general";
  }

  /* ═══════════════════════════════════════════
     DYNAMIC PAGE BUILDER — Generates content from product info
     ═══════════════════════════════════════════ */
  const CT = (s) => `<em>${s}</em>`;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const CATEGORY_CONTENT = {
    saas: {
      heroTag: (n, f) => `The all-in-one ${f[0] || "platform"} that helps teams work smarter, not harder.`,
      problems: (n) => [
        { icon: "alert-triangle", text: `You're wasting hours on tasks that ${n} could automate in seconds.` },
        { icon: "clock", text: "Juggling multiple disconnected tools that don't talk to each other." },
        { icon: "x-circle", text: "Your team is growing but your processes can't keep up." },
      ],
      benefits: (n, f) => [
        { title: "All-in-One Dashboard", desc: `Everything you need in one place — no more switching between ${f.length > 1 ? f[0] + " and " + f[1] : "tools"}.` },
        { title: "Lightning Fast", desc: `${n} is built for speed. Results in seconds, not minutes.` },
        { title: "Team Collaboration", desc: "Share insights, assign tasks, and track progress together." },
        { title: "Smart Automation", desc: "Automate repetitive workflows and focus on what matters." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Sign Up", desc: `Create your ${n} account in under 60 seconds.` },
        { num: "2", title: "Connect", desc: "Integrate your existing tools with one click." },
        { num: "3", title: "Grow", desc: "Watch your productivity soar from day one." },
      ],
      reviews: (n) => [
        { text: `${n} replaced 3 separate tools for us. Our team saves hours every week.`, name: "Alex M.", role: "Product Manager" },
        { text: `The best ${n.toLowerCase()} I've used. Clean interface, powerful features.`, name: "Jordan L.", role: "CEO" },
        { text: `Our workflow improved dramatically since switching to ${n}. Highly recommend.`, name: "Sam K.", role: "Team Lead" },
      ],
      comparison: (n) => [
        ["Price", "$29/mo", "$99/mo", "$200+/mo"],
        ["Setup Time", "2 minutes", "2-3 weeks", "Months"],
        ["Ease of Use", "✓ Intuitive", "✗ Steep learning", "✗ Complex"],
        ["Support", "✓ 24/7 Live", "✗ Email only", "✗ None"],
        ["Free Trial", "✓ 14 days", "✗ No", "✗ No"],
      ],
      faq: (n) => [
        { q: `How long does setup take?`, a: `Most teams are live on ${n} in under 2 minutes. Our guided setup handles the heavy lifting.` },
        { q: `Do I need technical skills?`, a: `Not at all. ${n} is designed for anyone, regardless of technical background.` },
        { q: `Can my whole team use it?`, a: `Yes! Every plan includes unlimited team members with role-based access.` },
        { q: `Is there a free trial?`, a: `Yes — 14 days free with full access. No credit card required.` },
        { q: `What if I need help getting started?`, a: `We offer free onboarding support, plus 24/7 live chat for any questions.` },
        { q: `Can I cancel anytime?`, a: `Absolutely. No contracts, no cancellation fees. Cancel with one click.` },
      ],
    },
    kitchen: {
      heroTag: (n, f) => `The ${f[0] || "kitchen essential"} that makes every meal effortless and delicious.`,
      problems: (n) => [
        { icon: "alert-triangle", text: `Old, bulky ${n.toLowerCase()}s take up counter space and underperform.` },
        { icon: "clock", text: "Spending too much time prepping meals instead of enjoying them." },
        { icon: "x-circle", text: "Cheap alternatives that break after a few uses." },
      ],
      benefits: (n, f) => [
        { title: "Space-Saving Design", desc: "Compact footprint that fits any kitchen without clutter." },
        { title: f[0] ? capitalize(f[0]) : "Premium Performance", desc: `Professional-grade ${f[0] || "results"} in the comfort of your home.` },
        { title: "Easy to Clean", desc: "Dishwasher-safe parts for hassle-free cleanup after every use." },
        { title: "Built to Last", desc: "Premium materials designed to withstand daily heavy use." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Prepare", desc: "Add your ingredients in seconds." },
        { num: "2", title: "Process", desc: `One button. ${n} does the rest.` },
        { num: "3", title: "Enjoy", desc: "Perfect results every single time." },
      ],
      reviews: (n) => [
        { text: `${n} completely changed my morning routine. I use it every single day.`, name: "Maria L.", role: "Home Chef" },
        { text: `So easy to use and clean. Best kitchen purchase I've made this year.`, name: "David R.", role: "Verified Buyer" },
        { text: `Restaurant-quality results at home. My family is amazed every time.`, name: "Sarah K.", role: "Busy Parent" },
      ],
      comparison: (n) => [
        ["Quality", "✓ Premium", "✓ Standard", "✗ Cheap"],
        ["Ease of Cleaning", "✓ Dishwasher safe", "✗ Hand wash only", "✗ Difficult"],
        ["Durability", "✓ Years of use", "~ Months", "✗ Weeks"],
        ["Warranty", "✓ 2 Years", "✗ 90 days", "✗ None"],
        ["Price", "$Competitive", "$Similar", "$Higher"],
      ],
      faq: (n) => [
        { q: `How easy is it to clean?`, a: `Super easy! Most parts are dishwasher-safe. A quick rinse is all you need.` },
        { q: `Is it suitable for daily use?`, a: `Absolutely. ${n} is built for heavy daily use with premium, durable materials.` },
        { q: `What's included in the box?`, a: `Everything you need to get started right away, plus a quick start guide.` },
        { q: `Does it come with a warranty?`, a: `Yes — full 2-year warranty. We stand behind our quality.` },
        { q: `Is it beginner-friendly?`, a: `Designed for everyone. From first-time users to experienced cooks.` },
        { q: `How long does shipping take?`, a: `Free shipping in 3-5 business days. Express options available at checkout.` },
      ],
    },
    automotive: {
      heroTag: (n, f) => `The ${f[0] || "essential upgrade"} every driver needs for a safer, smarter ride.`,
      problems: (n) => [
        { icon: "alert-triangle", text: `Cheap ${n.toLowerCase()}s that rattle, slip, or fail when you need them most.` },
        { icon: "clock", text: "Wasting money on accessories that don't fit or work properly." },
        { icon: "x-circle", text: "Fumbling with complicated installs instead of just driving." },
      ],
      benefits: (n, f) => [
        { title: "Universal Fit", desc: "Designed to work with virtually any vehicle make and model." },
        { title: "Install in Minutes", desc: "Tool-free setup — ready to use straight out of the box." },
        { title: "Built Tough", desc: "Premium materials that withstand heat, vibration, and daily wear." },
        { title: "Drive Safer", desc: "Keep your focus on the road with a hands-free, secure design." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Unbox", desc: `${n} is ready to install in under 2 minutes.` },
        { num: "2", title: "Install", desc: "No tools needed. Just snap, click, or mount." },
        { num: "3", title: "Drive", desc: "Enjoy a safer, more comfortable driving experience." },
      ],
      reviews: (n) => [
        { text: `I've tried 5 different ${n.toLowerCase()}s. This is the only one that actually stays in place.`, name: "Chris P.", role: "Daily Commuter" },
        { text: `Installed in 60 seconds. Solid build quality. Very happy with this purchase.`, name: "Taylor M.", role: "Verified Buyer" },
        { text: `Much better than the expensive brand I had before. Great value.`, name: "Alex R.", role: "Car Enthusiast" },
      ],
      comparison: (n) => [
        ["Build Quality", "✓ Premium", "✓ Average", "✗ Flimsy"],
        ["Fit", "✓ Universal", "✗ Vehicle specific", "✗ Poor fit"],
        ["Installation", "✓ Tool-free", "~ Tools needed", "✗ Complex"],
        ["Durability", "✓ 5+ years", "~ 1 year", "✗ Months"],
        ["Price", "$Competitive", "$Similar", "$Higher"],
      ],
      faq: (n) => [
        { q: `Will this fit my vehicle?`, a: `Yes! ${n} is designed with a universal fit that works with virtually any car, truck, or SUV.` },
        { q: `How long does installation take?`, a: `Under 2 minutes. No tools required — just snap it in place.` },
        { q: `Is it durable enough for daily use?`, a: `Absolutely. Built with premium materials tested for thousands of hours of use.` },
        { q: `What if it doesn't fit my car?`, a: `We offer a 30-day money-back guarantee. Full refund if it's not a perfect fit.` },
        { q: `Does it affect my driving?`, a: `Not at all. ${n} is designed to enhance your driving experience safely.` },
        { q: `What's in the box?`, a: `${n}, quick start guide, and everything you need for immediate setup.` },
      ],
    },
    outdoor: {
      heroTag: (n, f) => `The ${f[0] || "essential gear"} you need for your next adventure.`,
      problems: (n) => [
        { icon: "alert-triangle", text: `Bulky, unreliable ${n.toLowerCase()} that weighs you down on the trail.` },
        { icon: "clock", text: "Fumbling in the dark with gear that runs out of power too fast." },
        { icon: "x-circle", text: "Weather-dependent equipment that fails when conditions get tough." },
      ],
      benefits: (n, f) => [
        { title: "Ultra Portable", desc: "Lightweight and compact — fits easily in any backpack." },
        { title: "Weather-Proof", desc: "Built to perform in rain, snow, heat, and everything in between." },
        { title: "Long-Lasting Power", desc: "Extended battery life that outlasts your longest adventures." },
        { title: "Trail-Tested", desc: "Used and trusted by thousands of outdoor enthusiasts." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Pack", desc: `Toss ${n} in your bag — it weighs almost nothing.` },
        { num: "2", title: "Deploy", desc: "Ready to use in seconds, no setup required." },
        { num: "3", title: "Explore", desc: "Confidently tackle any adventure with reliable gear." },
      ],
      reviews: (n) => [
        { text: `${n} survived a 3-day hike in pouring rain. Still works perfectly.`, name: "Mike T.", role: "Hiker" },
        { text: `Lightest piece of gear I own, but incredibly durable. Game changer.`, name: "Laura K.", role: "Camping Enthusiast" },
        { text: `Finally, outdoor gear that actually lives up to its promises.`, name: "Ryan S.", role: "Verified Buyer" },
      ],
      comparison: (n) => [
        ["Weight", "✓ Ultra-light", "~ Moderate", "✗ Heavy"],
        ["Weather Rating", "✓ All-weather", "~ Light rain", "✗ Indoor only"],
        ["Battery Life", "✓ 40+ hours", "~ 12 hours", "✗ 4 hours"],
        ["Warranty", "✓ Lifetime", "~ 1 year", "✗ 90 days"],
        ["Price", "$Great value", "$Similar", "$Overpriced"],
      ],
      faq: (n) => [
        { q: `How weather-resistant is it?`, a: `Fully weather-proof. ${n} is tested in extreme conditions — rain, snow, heat, you name it.` },
        { q: `How long does the battery last?`, a: `Up to 40+ hours on a single charge. Enough for multi-day trips.` },
        { q: `How much does it weigh?`, a: `Incredibly lightweight. Designed to be barely noticeable in your pack.` },
        { q: `Is it covered by a warranty?`, a: `Yes — lifetime warranty. We stand behind every piece of gear we make.` },
        { q: `Can beginners use it?`, a: `Absolutely. No experience needed. Just unbox and go.` },
        { q: `What's included?`, a: `${n}, charging cable, carry case, and quick start guide.` },
      ],
    },
    beauty: {
      heroTag: (n, f) => `Dermatologist-tested ${f[0] || "skincare"} that visibly transforms your skin.`,
      problems: (n) => [
        { icon: "alert-triangle", text: "Expensive products that promise the world but deliver nothing." },
        { icon: "clock", text: "A complicated routine that eats up your mornings." },
        { icon: "x-circle", text: "Irritation and breakouts from harsh chemicals and fillers." },
      ],
      benefits: (n, f) => [
        { title: "Visible Results", desc: "See a real difference in as little as 14 days." },
        { title: "Dermatologist Tested", desc: "Approved by skin experts for all skin types." },
        { title: "Clean Formula", desc: "No parabens, sulfates, or harmful chemicals." },
        { title: "Fast Absorbing", desc: "Lightweight texture that won't clog pores." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Cleanse", desc: "Apply to damp skin, massage gently." },
        { num: "2", title: "Apply", desc: `Use ${n} as directed for best results.` },
        { num: "3", title: "Glow", desc: "See visible results in 14 days." },
      ],
      reviews: (n) => [
        { text: `My skin has never looked this good. Friends keep asking what I'm using!`, name: "Jessica M.", role: "Verified Buyer" },
        { text: `Finally a product that delivers on its promise. Worth every penny.`, name: "Aisha K.", role: "Verified Buyer" },
        { text: `I've tried dozens of products. This one actually works.`, name: "Rachel T.", role: "Verified Buyer" },
      ],
      comparison: (n) => [
        ["Results", "✓ 14 Days", "~ 6-8 Weeks", "✗ Never"],
        ["Clean Ingredients", "✓ 100%", "~ 50%", "✗ Full of fillers"],
        ["Dermatologist Approved", "✓ Yes", "✗ No", "✗ No"],
        ["Money-Back Guarantee", "✓ 30 Days", "✗ None", "✗ None"],
        ["Price", "$Competitive", "$Similar", "$Overpriced"],
      ],
      faq: (n) => [
        { q: `Is it suitable for sensitive skin?`, a: `Yes! Dermatologist-tested and gentle enough for all skin types.` },
        { q: `How soon will I see results?`, a: `Most customers notice visible improvements within 14 days of consistent use.` },
        { q: `Is it cruelty-free?`, a: `Yes — we never test on animals.` },
        { q: `What if it doesn't work for me?`, a: `30-day money-back guarantee. Full refund, no questions asked.` },
        { q: `Can I use it with other products?`, a: `Absolutely. It layers perfectly under moisturizer and sunscreen.` },
        { q: `How long does one bottle last?`, a: `Approximately 60 days with daily use.` },
      ],
    },
    fitness: {
      heroTag: (n, f) => `Premium ${f[0] || "fitness equipment"} designed for maximum results in minimum time.`,
      problems: (n) => [
        { icon: "alert-triangle", text: "You don't have 2 hours a day to spend at the gym." },
        { icon: "clock", text: "Home workouts feel unstructured and results never come." },
        { icon: "x-circle", text: "Generic programs that ignore your fitness level and goals." },
      ],
      benefits: (n, f) => [
        { title: "Space-Saving Design", desc: "Full workout in just a few square feet." },
        { title: "All Levels", desc: "Adjusts from beginner to advanced in seconds." },
        { title: "Commercial Grade", desc: "Built to last with premium materials." },
        { title: "Free Training Guide", desc: "Personalized workout plan included with every purchase." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Unbox", desc: `${n} arrives ready to use.` },
        { num: "2", title: "Setup", desc: "Quick setup in under 5 minutes." },
        { num: "3", title: "Train", desc: "Follow the included workout guide." },
      ],
      reviews: (n) => [
        { text: `Best investment for my home gym. Solid, compact, and effective.`, name: "Mike R.", role: "Fitness Enthusiast" },
        { text: `I cancelled my gym membership after 2 weeks with ${n}.`, name: "Diana L.", role: "Busy Mom" },
        { text: `Commercial quality at a fraction of the price. Love it.`, name: "Tom K.", role: "Personal Trainer" },
      ],
      comparison: (n) => [
        ["Quality", "✓ Premium", "✓ Standard", "✗ Cheap"],
        ["Space Required", "✓ Minimal", "~ Moderate", "✗ Huge"],
        ["Setup Time", "✓ 5 min", "~ 30 min", "✗ Hours"],
        ["Warranty", "✓ Lifetime", "~ 1 year", "✗ 90 days"],
        ["Price", "$Great value", "$Similar", "$Overpriced"],
      ],
      faq: (n) => [
        { q: `How much space do I need?`, a: `Very little! ${n} is designed for small spaces — apartments, bedrooms, offices.` },
        { q: `Is it suitable for beginners?`, a: `Absolutely. Adjustable difficulty goes from very easy to very challenging.` },
        { q: `Is there a warranty?`, a: `Yes — lifetime frame warranty and 2-year parts warranty.` },
        { q: `How long does shipping take?`, a: `Free delivery in 5-7 business days.` },
        { q: `Can I return it?`, a: `30-day money-back guarantee. We'll even arrange free pickup.` },
        { q: `What's included?`, a: `${n}, quick start guide, and access to workout library.` },
      ],
    },
    fashion: {
      heroTag: (n, f) => `The ${f[0] || "must-have accessory"} that elevates every outfit.`,
      problems: (n) => [
        { icon: "alert-triangle", text: "Fast fashion that falls apart after a few washes." },
        { icon: "clock", text: "Spending hours shopping and still not finding the right piece." },
        { icon: "x-circle", text: "Overpriced brands that charge for the name, not the quality." },
      ],
      benefits: (n, f) => [
        { title: "Timeless Design", desc: "Classic style that never goes out of fashion." },
        { title: "Premium Materials", desc: "Crafted from the finest materials for lasting quality." },
        { title: "Versatile", desc: "Pairs perfectly with any outfit, any occasion." },
        { title: "Affordable Luxury", desc: "Designer quality without the designer price tag." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Choose", desc: "Pick your favorite style and color." },
        { num: "2", title: "Order", desc: "Secure checkout with free shipping." },
        { num: "3", title: "Style", desc: "Elevate your look from day one." },
      ],
      reviews: (n) => [
        { text: `I get compliments every time I wear ${n}. Incredibly well made.`, name: "Emma S.", role: "Fashion Lover" },
        { text: `The quality is outstanding for the price. I've bought 3 more as gifts.`, name: "Alex P.", role: "Verified Buyer" },
        { text: `Finally, a brand that delivers on both style AND quality.`, name: "Jordan L.", role: "Verified Buyer" },
      ],
      comparison: (n) => [
        ["Quality", "✓ Premium", "✓ Average", "✗ Fast fashion"],
        ["Durability", "✓ Years", "~ Months", "✗ Washes out"],
        ["Style", "✓ Timeless", "~ Trendy", "✗ Outdated"],
        ["Price", "$Great value", "$Similar", "$Overpriced"],
        ["Sustainability", "✓ Ethical", "~ Partial", "✗ Unsustainable"],
      ],
      faq: (n) => [
        { q: `What materials is it made from?`, a: `Premium, sustainably-sourced materials built to last.` },
        { q: `How do I care for it?`, a: `Simple care instructions included. Most pieces are machine washable.` },
        { q: `What sizes are available?`, a: `We offer a full range of sizes. Check our size guide for the perfect fit.` },
        { q: `Can I return or exchange?`, a: `30-day hassle-free returns and exchanges.` },
        { q: `Is it true to size?`, a: `Yes! Our sizing is consistent. Check the size guide for measurements.` },
        { q: `How long does shipping take?`, a: `Free standard shipping in 3-5 days. Express available.` },
      ],
    },
    electronics: {
      heroTag: (n, f) => `The ${f[0] || "tech gadget"} that's smarter, faster, and better than the rest.`,
      problems: (n) => [
        { icon: "alert-triangle", text: "Cheap electronics that glitch, lag, or die after a few weeks." },
        { icon: "clock", text: "Overcomplicated devices with features you'll never use." },
        { icon: "x-circle", text: "Battery life that barely lasts through the morning." },
      ],
      benefits: (n, f) => [
        { title: "Latest Technology", desc: "Packed with the newest features and improvements." },
        { title: "All-Day Battery", desc: "Hours of use on a single charge." },
        { title: "Compact Design", desc: "Pocket-sized and travel-friendly." },
        { title: "Universal Compatibility", desc: "Works with all your existing devices." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Unbox", desc: `${n} is ready to go right out of the box.` },
        { num: "2", title: "Connect", desc: "Pair or plug in — takes just seconds." },
        { num: "3", title: "Use", desc: "Enjoy premium performance instantly." },
      ],
      reviews: (n) => [
        { text: `${n} exceeded all my expectations. The build quality is incredible.`, name: "Kevin L.", role: "Tech Reviewer" },
        { text: `Best gadget I've bought this year. Works flawlessly every time.`, name: "Priya S.", role: "Verified Buyer" },
        { text: `So much better than my old one. Worth every single penny.`, name: "Marcus T.", role: "Verified Buyer" },
      ],
      comparison: (n) => [
        ["Performance", "✓ Top tier", "✓ Good", "✗ Slow"],
        ["Battery Life", "✓ All day", "~ Half day", "✗ 2 hours"],
        ["Build Quality", "✓ Premium", "✓ Plastic", "✗ Cheap"],
        ["Warranty", "✓ 2 Years", "~ 1 Year", "✗ 90 days"],
        ["Price", "$Great value", "$Similar", "$Overpriced"],
      ],
      faq: (n) => [
        { q: `How long does the battery last?`, a: `All-day battery life. ${n} easily lasts through a full day of use.` },
        { q: `Is it compatible with my devices?`, a: `Yes! Works with virtually all modern devices and operating systems.` },
        { q: `What's in the box?`, a: `${n}, charging cable, user manual, and quick start guide.` },
        { q: `Is there a warranty?`, a: `Yes — full 2-year manufacturer warranty.` },
        { q: `How do I set it up?`, a: `Plug and play — ready to use in under 60 seconds.` },
        { q: `Can I return it?`, a: `30-day money-back guarantee. Full refund, no questions asked.` },
      ],
    },
    home: {
      heroTag: (n, f) => `The ${f[0] || "home essential"} that makes your living space better.`,
      problems: (n) => [
        { icon: "alert-triangle", text: "Cluttered, uncomfortable spaces that never feel quite right." },
        { icon: "clock", text: "Wasting money on cheap products that need replacing every year." },
        { icon: "x-circle", text: "Items that look good in photos but disappoint in person." },
      ],
      benefits: (n, f) => [
        { title: "Premium Craftsmanship", desc: "Handcrafted with attention to every detail." },
        { title: "Fits Any Space", desc: "Versatile design that complements any room." },
        { title: "Durable Materials", desc: "Built to last for years of daily use." },
        { title: "Easy Maintenance", desc: "Low-effort care for busy lifestyles." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Order", desc: "Choose your style and check out securely." },
        { num: "2", title: "Receive", desc: "Free shipping directly to your door." },
        { num: "3", title: "Enjoy", desc: "Transform your space from day one." },
      ],
      reviews: (n) => [
        { text: `${n} completely transformed my living room. So happy with this purchase.`, name: "Lisa M.", role: "Homeowner" },
        { text: `Beautiful design and incredible quality. Better than expected.`, name: "James K.", role: "Verified Buyer" },
        { text: `My friends keep asking where I got it. The quality speaks for itself.`, name: "Nicole R.", role: "Interior Design Lover" },
      ],
      comparison: (n) => [
        ["Quality", "✓ Premium", "✓ Standard", "✗ Cheap"],
        ["Design", "✓ Modern", "~ Basic", "✗ Outdated"],
        ["Durability", "✓ Years", "~ Months", "✗ Weeks"],
        ["Assembly", "✓ Minimal", "~ Moderate", "✗ Complex"],
        ["Price", "$Great value", "$Similar", "$Overpriced"],
      ],
      faq: (n) => [
        { q: `Does it require assembly?`, a: `Minimal assembly. Most customers have it set up in under 15 minutes.` },
        { q: `What materials is it made from?`, a: `Premium, sustainably sourced materials built to last.` },
        { q: `How do I clean it?`, a: `Simple care — a damp cloth is all you need for most maintenance.` },
        { q: `What's the return policy?`, a: `30-day hassle-free returns with full refund.` },
        { q: `Does it come with a warranty?`, a: `Yes — 2-year warranty covering all manufacturing defects.` },
        { q: `How long is shipping?`, a: `Free standard shipping in 5-7 business days.` },
      ],
    },
    pet: {
      heroTag: (n, f) => `The ${f[0] || "pet essential"} your furry friend deserves.`,
      problems: (n) => [
        { icon: "alert-triangle", text: "Generic pet products that don't address your pet's real needs." },
        { icon: "clock", text: "Low-quality items that fall apart after a few uses." },
        { icon: "x-circle", text: "Products filled with artificial ingredients your pet doesn't need." },
      ],
      benefits: (n, f) => [
        { title: "Vet Approved", desc: "Recommended by veterinarians for happy, healthy pets." },
        { title: "Premium Ingredients", desc: "Only the best for your furry family member." },
        { title: "Pet-Tested", desc: "Loved by pets of all sizes and breeds." },
        { title: "Safe & Natural", desc: "No artificial colors, flavors, or harmful chemicals." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Order", desc: `Choose ${n} for your pet.` },
        { num: "2", title: "Introduce", desc: "Let your pet try it for the first time." },
        { num: "3", title: "Love", desc: "Watch your pet's tail wag with joy." },
      ],
      reviews: (n) => [
        { text: `My dog absolutely loves ${n}. Won't go a day without it!`, name: "Patricia H.", role: "Dog Mom" },
        { text: `Finally found something my picky cat actually enjoys.`, name: "Brian W.", role: "Cat Owner" },
        { text: `Great quality and my vet even recommended it. Win-win.`, name: "Sandra L.", role: "Verified Buyer" },
      ],
      comparison: (n) => [
        ["Ingredients", "✓ Natural", "~ Mixed", "✗ Artificial"],
        ["Vet Approved", "✓ Yes", "~ Sometimes", "✗ No"],
        ["Quality", "✓ Premium", "✓ Standard", "✗ Low"],
        ["Pet Approval", "✓ Loves it", "~ Likes it", "✗ Ignores it"],
        ["Price", "$Great value", "$Similar", "$Overpriced"],
      ],
      faq: (n) => [
        { q: `Is it safe for all pets?`, a: `Yes! Made with safe, natural ingredients suitable for all breeds and sizes.` },
        { q: `How quickly will my pet notice a difference?`, a: `Most pets show immediate interest. Results are visible within days.` },
        { q: `What ingredients are used?`, a: `Only premium, natural ingredients. Full transparency on our ingredient list.` },
        { q: `What if my pet doesn't like it?`, a: `30-day money-back guarantee. We want both you and your pet to be happy.` },
        { q: `How should I store it?`, a: `Simple storage instructions included. Stays fresh for months.` },
        { q: `Is it vet recommended?`, a: `Yes — recommended by veterinarians nationwide.` },
      ],
    },
    general: {
      heroTag: (n, f) => `The premium ${f[0] || "product"} designed for people who demand the best.`,
      problems: (n) => [
        { icon: "alert-triangle", text: "Cheap alternatives that break, fail, or disappoint within weeks." },
        { icon: "clock", text: "Wasting money on products that don't live up to their promises." },
        { icon: "x-circle", text: "No guarantee, no support, no peace of mind." },
      ],
      benefits: (n, f) => [
        { title: "Premium Quality", desc: "Built with the finest materials for lasting performance." },
        { title: "Proven Results", desc: "Backed by thousands of happy customers." },
        { title: "Risk-Free", desc: "30-day money-back guarantee — no questions asked." },
        { title: "Fast Delivery", desc: "Free shipping straight to your door." },
      ],
      howSteps: (n) => [
        { num: "1", title: "Order", desc: "Choose your option and check out securely." },
        { num: "2", title: "Receive", desc: "Free shipping in 3-5 business days." },
        { num: "3", title: "Enjoy", desc: "Experience the difference from day one." },
      ],
      reviews: (n) => [
        { text: `Absolutely love ${n}! Exceeded my expectations in every way.`, name: "Alex M.", role: "Verified Buyer" },
        { text: `Best purchase I've made this year. The quality is incredible.`, name: "Jordan L.", role: "Verified Buyer" },
        { text: `So glad I made the switch. The difference is night and day.`, name: "Sam R.", role: "Verified Buyer" },
      ],
      comparison: (n) => [
        ["Quality", "✓ Premium", "✓ Standard", "✗ Cheap"],
        ["Guarantee", "✓ 30 Days", "✗ None", "✗ None"],
        ["Free Shipping", "✓ Yes", "✗ $15", "✗ $20"],
        ["Support", "✓ 24/7", "✗ Email", "✗ None"],
        ["Durability", "✓ Years", "~ Months", "✗ Weeks"],
      ],
      faq: (n) => [
        { q: `How does it work?`, a: `Simply follow the included instructions. Most customers master it within minutes.` },
        { q: `What if I'm not satisfied?`, a: `30-day money-back guarantee. Full refund, no questions asked.` },
        { q: `How long is shipping?`, a: `Free standard shipping in 3-5 days. Express available at checkout.` },
        { q: `Is it beginner-friendly?`, a: `Absolutely. Designed for everyone, regardless of experience.` },
        { q: `What's included?`, a: `The product, quick start guide, and access to premium support.` },
        { q: `How do I get support?`, a: `24/7 via live chat, email, or phone. We respond within 2 hours.` },
      ],
    },
  };

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function buildProductPage(req) {
    const info = extractProductDetails(req);
    const T = THEMES[info.category] || THEMES.general;
    const C = CATEGORY_CONTENT[info.category] || CATEGORY_CONTENT.general;
    const b = info.name;
    const p = info.price || "$49.99";
    const compareP = info.price ? "$" + (parseFloat(info.price.replace(/[^0-9.]/g, "")) * 1.6).toFixed(2) : "$79.99";
    const discountPct = Math.round((1 - parseFloat(p.replace(/[^0-9.]/g, "")) / parseFloat(compareP.replace(/[^0-9.]/g, ""))) * 100);
    const colors = [T.color, T.accent, "#10B981", "#F59E0B"];
    return [
      { action: "clear" },
      { action: "add", type: "product_hero", data: {
        badge: T.badge, title: b,
        subtitle: C.heroTag(b, info.features),
        price: p, comparePrice: compareP, discount: discountPct > 5 ? discountPct + "% OFF" : "",
        cta: T.cta, ctaColor: T.color,
        trust1: "Free Shipping", trust2: "30-Day Guarantee", trust3: "Secure Checkout",
        paymentIcons: "Visa · Mastercard · PayPal · Apple Pay",
      }},
      { action: "add", type: "problem", data: {
        title: CT("Tired of <em>Settling</em>?"),
        subtitle: `You deserve better. Here's why ${b} changes everything.`,
        items: C.problems(b),
      }},
      { action: "add", type: "benefits", data: {
        title: CT(`Why Customers <em>Love</em> ${b}`),
        subtitle: "Everything you need, nothing you don't.",
        items: C.benefits(b, info.features).map((bf, i) => ({ icon: T.icons[i], color: colors[i], ...bf })),
      }},
      { action: "add", type: "how_it_works", data: {
        title: CT("How It Works"),
        subtitle: `Getting started with ${b} is easy.`,
        steps: C.howSteps(b),
      }},
      { action: "add", type: "social_proof", data: {
        title: CT(`What People Say About ${b}`),
        subtitle: "Real feedback from real customers.",
        avgRating: "4.8", reviewCount: "2,347",
        testimonials: C.reviews(b).map((r, i) => ({ stars: 5, ...r, color: colors[i], verified: true })),
      }},
      { action: "add", type: "comparison", data: {
        title: CT("Why We're Different"),
        subtitle: `See how ${b} compares to the rest.`,
        headers: ["Feature", b, "Competitor", "Old Way"],
        rows: C.comparison(b),
      }},
      { action: "add", type: "offer", data: {
        title: CT("Special Offer — Today Only"),
        subtitle: `Get ${b} at a price that won't last.`,
        price: p, comparePrice: compareP,
        savings: `You save $${(parseFloat(compareP.replace(/[^0-9.]/g, "")) - parseFloat(p.replace(/[^0-9.]/g, ""))).toFixed(2)}`,
        bonuses: [
          { icon: "gift", text: `Bonus: Quick Start Guide (Value $19)` },
          { icon: "gift", text: `Bonus: Premium Support (Value $29)` },
          { icon: "truck", text: "Free Express Shipping (Value $9.99)" },
        ],
        cta: "Claim Your Discount", ctaColor: "#DC2626",
        urgency: "Hurry — Offer ends soon",
      }},
      { action: "add", type: "guarantee", data: {
        title: CT("30-Day Money-Back Guarantee"),
        subtitle: `Try ${b} risk-free. Full refund if you're not satisfied.`,
        items: [
          { icon: "shield-check", title: "Secure Checkout", desc: "256-bit SSL encryption protects your payment." },
          { icon: "refresh-cw", title: "Easy Returns", desc: "Return within 30 days for a full refund." },
          { icon: "headphones", title: "24/7 Support", desc: "Our team is always here to help." },
          { icon: "lock", title: "Privacy Protected", desc: "Your data stays safe. We never share it." },
        ],
      }},
      { action: "add", type: "faq", data: {
        title: CT("Frequently Asked"),
        subtitle: `Everything you need to know about ${b}.`,
        items: C.faq(b),
      }},
      { action: "add", type: "final_cta", data: {
        title: `Ready to Try\n${b}?`,
        subtitle: "Join thousands of happy customers.",
        price: p, cta: T.cta, ctaColor: T.color,
        badge: "30-Day Guarantee · Free Shipping",
      }},
      { action: "add", type: "footer", data: { text: `© 2026 ${b}. All rights reserved.` } },
    ];
  }

  /* ═══════════════════════════════════════════
     RENDER ENGINE
     ═══════════════════════════════════════════ */
  function renderApp() {
    const app = $("#app");
    if (!app) return;
    app.innerHTML = `
      <div class="app">
        <header class="topbar">
          <div class="topbar-left">
            <div class="topbar-logo">${ic("layout", 20)} Product Page Builder</div>
            <div class="topbar-sep"></div>
            <div class="topbar-project">My Product Page</div>
          </div>
          <div class="topbar-center"></div>
          <div class="topbar-right">
            <div id="api-status-badge" class="api-badge api-checking">${ic("loader", 12)} Checking...</div>
            <div class="topbar-sep"></div>
            <div class="device-group">
              <button class="device-btn active" data-dev="desktop" title="Desktop">${ic("monitor", 16)}</button>
              <button class="device-btn" data-dev="tablet" title="Tablet">${ic("tablet", 16)}</button>
              <button class="device-btn" data-dev="mobile" title="Mobile">${ic("smartphone", 16)}</button>
            </div>
            <div class="topbar-sep"></div>
            <button class="tb-btn" id="tb-refresh" title="Refresh">${ic("refresh-cw", 15)}</button>
          </div>
        </header>
        <div class="workspace">
          <aside class="chat-panel" id="chat-panel">
            <div class="chat-header">
              <h3>${ic("sparkles", 18)} AI Product Page Builder</h3>
              <p>Describe your product and I'll build a premium Shopify-grade page.</p>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-suggestions" id="chat-suggestions">
              <div class="sug-label">Try a product:</div>
              <button class="sug-chip" data-msg="Build a product page for HydraGlow — a premium vitamin C serum for anti-aging skincare, $39, dermatologist tested, 30-day guarantee">Skincare Serum</button>
              <button class="sug-chip" data-msg="Build a product page for FitForge Pro — a compact home gym equipment, $299, free delivery, lifetime warranty">Home Gym</button>
              <button class="sug-chip" data-msg="Build a product page for BrewCraft — organic specialty coffee subscription, $24/month, free shipping, cancel anytime">Coffee Brand</button>
              <button class="sug-chip" data-msg="Build a product page for Pulse Analytics — SaaS dashboard for startups, $29/mo, 14-day free trial">SaaS Platform</button>
              <button class="sug-chip" data-msg="Build a product page for NomadPack — premium travel organizer bag, $59, waterproof, lifetime guarantee">Travel Product</button>
            </div>
            <div class="chat-input-area">
              <div class="chat-input-wrap">
                <textarea id="chat-input" rows="1" placeholder="Describe your product: name, type, price, key features..."></textarea>
                <button class="chat-send" id="chat-send" disabled>${ic("arrow-up", 16)}</button>
              </div>
            </div>
          </aside>
          <main class="preview-panel">
            <div class="preview-toolbar">
              <span class="preview-toolbar-label">Preview</span>
              <span class="preview-toolbar-sep"></span>
              <span class="preview-toolbar-label" id="preview-device-label">Desktop — 1440px</span>
              <span class="preview-toolbar-sep"></span>
              <span class="preview-toolbar-label" id="preview-section-count">0 sections</span>
            </div>
            <div class="preview-scroll" id="preview-scroll">
              <div class="preview-frame" id="preview-frame">
                <div class="preview-content" id="preview-content"></div>
              </div>
            </div>
          </main>
        </div>
        <div class="mobile-tabs">
          <button class="mobile-tab active" data-tab="chat">${ic("message-square", 20)} Chat</button>
          <button class="mobile-tab" data-tab="preview">${ic("eye", 20)} Preview</button>
        </div>
      </div>`;
    renderPreview();
    bindEvents();
    if (typeof lucide !== "undefined") lucide.createIcons();
    checkApiConnection();
    addAIMessage("Welcome to **AI Product Page Builder**! I build premium Shopify-grade product pages.\n\nTell me about your product — name, type, price, key features, and I'll create a complete, high-converting product page with hero, benefits, social proof, FAQ, and more.", []);
  }

  function renderPreview() {
    const el = $("#preview-content");
    if (!el) return;
    const countEl = $("#preview-section-count");
    if (countEl) countEl.textContent = state.sections.length + " section" + (state.sections.length !== 1 ? "s" : "");
    if (!state.sections.length) {
      el.innerHTML = `<div class="preview-empty">${ic("layout", 48)}<h3>No page yet</h3><p>Describe your product in the chat, or click a suggestion above.</p></div>`;
      if (typeof lucide !== "undefined") lucide.createIcons();
      return;
    }
    el.innerHTML = state.sections.map((s) => {
      const renderer = SECTIONS[s.type];
      if (!renderer) return `<div class="pv-section-wrap pv-unknown" data-sid="${s.id}" data-stype="${s.type}"><div style="padding:20px;background:#FFF3CD;color:#856404;border:1px solid #FFEEBA;border-radius:8px;margin:8px 48px;">Unsupported section: ${esc(s.type)}</div></div>`;
      return `<div class="pv-section-wrap" data-sid="${s.id}" data-stype="${s.type}">${renderer.render(s.data)}</div>`;
    }).join("");
    bindSectionEvents();
    bindFAQ();
  }

  /* ── Chat UI ── */
  function addMessage(role, text, actions, meta) {
    const wrap = $("#chat-messages");
    if (!wrap) return;
    const isAI = role === "ai";
    const actionsHtml = actions && actions.length ? `<div class="msg-actions">${actions.map((a) => `<div class="msg-action">${ic("check-circle", 13)} ${esc(typeof a === "string" ? a : a.text || "")}</div>`).join("")}</div>` : "";
    const metaHtml = meta && meta.provider ? `<div class="msg-meta">${esc(meta.provider)} · ${esc(meta.model || "")}${meta.latency ? " · " + esc(meta.latency) : ""}</div>` : "";
    const htmlText = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").split("\n").map((l) => `<p>${l || "&nbsp;"}</p>`).join("");
    const div = document.createElement("div");
    div.className = "msg";
    div.innerHTML = `<div class="msg-avatar ${isAI ? "ai" : "user"}">${isAI ? "AI" : "U"}</div><div class="msg-body"><div class="msg-name">${isAI ? "AI Builder" : "You"}</div><div class="msg-text">${htmlText}${actionsHtml}${metaHtml}</div></div>`;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function addTypingIndicator() {
    const wrap = $("#chat-messages");
    if (!wrap) return;
    const t = document.createElement("div");
    t.className = "msg"; t.id = "typing-indicator";
    t.innerHTML = `<div class="msg-avatar ai">AI</div><div class="msg-body"><div class="msg-name">AI Builder</div><div class="msg-text"><div class="typing-dots"><span></span><span></span><span></span></div></div></div>`;
    wrap.appendChild(t);
    wrap.scrollTop = wrap.scrollHeight;
  }
  function removeTypingIndicator() { const el = $("#typing-indicator"); if (el) el.remove(); }
  function addAIMessage(text, actions, meta) {
    addTypingIndicator();
    setTimeout(() => { removeTypingIndicator(); addMessage("ai", text, actions, meta); renderPreview(); }, 300);
  }
  function addUserMessage(text) { addMessage("user", text); }

  /* ── Animated Execution ── */
  function executeActions(actions) {
    const applied = [];
    for (const a of actions) {
      const rawType = a.type;
      const type = rawType ? resolveType(rawType) : rawType;
      switch (a.action) {
        case "clear": clearSections(); applied.push({ type: "clear", text: "Cleared all sections", sectionType: null }); break;
        case "add": {
          if (!type || !SECTIONS[type]) break;
          const existing = findSectionByType(type);
          if (existing) { Object.assign(existing.data, a.data || {}); applied.push({ type: "update", text: `Updated ${type}`, sectionType: type }); }
          else { const s = addSection(type, null, a.data); applied.push({ type: "add", text: `Added ${type}`, sectionType: type, sectionId: s.id }); }
          break;
        }
        case "update": {
          if (!type) break;
          const u = updateSection(type, a.data || {});
          if (u) applied.push({ type: "update", text: `Updated ${type}`, sectionType: type, sectionId: u.id });
          else { const s = addSection(type, null, a.data); applied.push({ type: "add", text: `Added ${type}`, sectionType: type, sectionId: s.id }); }
          break;
        }
        case "remove": { if (!type) break; const r = removeSectionByType(type); applied.push({ type: "remove", text: r ? `Removed ${type}` : `${type} not found`, sectionType: type }); break; }
      }
    }
    return applied;
  }

  async function executeActionsAnimated(actions, onStep) {
    for (let i = 0; i < actions.length; i++) {
      const result = executeActions([actions[i]]);
      if (result.length) {
        renderPreview();
        if (result[0].sectionType) animateSectionIn(result[0].sectionType);
        if (onStep) onStep(result[0], i, actions.length);
      }
      if (i < actions.length - 1) await delay(400);
    }
  }

  function animateSectionIn(type) {
    const el = $(`.preview-content [data-stype="${type}"]`);
    if (!el) return;
    el.classList.add("pv-building-in");
    const scroll = $("#preview-scroll");
    if (scroll) { const top = el.offsetTop - scroll.offsetTop - 40; scroll.scrollTo({ top: Math.max(0, top), behavior: "smooth" }); }
    setTimeout(() => el.classList.remove("pv-building-in"), 1800);
  }

  function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function appendBuildingStep(text) {
    const wrap = $("#chat-messages");
    if (!wrap) return;
    const last = wrap.lastElementChild;
    if (last && last.classList.contains("msg-building")) {
      const steps = last.querySelector(".building-steps");
      if (steps) { const s = document.createElement("div"); s.className = "building-step"; s.innerHTML = `<span class="building-check">${ic("check", 12)}</span> ${esc(text)}`; steps.appendChild(s); wrap.scrollTop = wrap.scrollHeight; if (typeof lucide !== "undefined") lucide.createIcons({ nodes: [s] }); return; }
    }
    const div = document.createElement("div");
    div.className = "msg msg-building";
    div.innerHTML = `<div class="msg-avatar ai">AI</div><div class="msg-body"><div class="msg-name">AI Builder</div><div class="msg-text"><div class="building-header">${ic("loader", 16)} Building your product page...</div><div class="building-steps"></div></div></div>`;
    wrap.appendChild(div);
    if (typeof lucide !== "undefined") lucide.createIcons({ nodes: [div] });
    const steps = div.querySelector(".building-steps");
    const s = document.createElement("div");
    s.className = "building-step";
    s.innerHTML = `<span class="building-check">${ic("check", 12)}</span> ${esc(text)}`;
    steps.appendChild(s);
    if (typeof lucide !== "undefined") lucide.createIcons({ nodes: [s] });
    wrap.scrollTop = wrap.scrollHeight;
  }

  /* ── Send Message ── */
  async function sendMessage() {
    const input = $("#chat-input");
    if (!input || !input.value.trim() || isProcessing) return;
    const text = input.value.trim();
    input.value = "";
    input.style.height = "auto";
    input.dispatchEvent(new Event("input"));
    const sug = $("#chat-suggestions");
    if (sug) sug.style.display = "none";
    addUserMessage(text);
    isProcessing = true;
    const sendBtn = $("#chat-send");
    if (sendBtn) sendBtn.disabled = true;
    addTypingIndicator();
    showThinkingInPreview();
    try {
      updateThinkingText("Waiting for AI response...");
      const result = await aiChat(text);
      removeTypingIndicator();
      removeThinkingFromPreview();
      const actions = parseActions(result.text, text);
      const cleanText = result.text.replace(/\[ACTIONS\][\s\S]*?\[\/ACTIONS\]/gi, "").trim();
      if (actions.length) {
        const addCount = actions.filter((a) => a.action === "add").length;
        const aiProvided = result.text && result.text.match(/\[ACTIONS\]/i);
        const supplementNote = aiProvided && addCount > 5 ? "" : aiProvided ? " (supplemented with additional sections)" : "";
        addMessage("ai", `Building ${addCount} sections${supplementNote}...`, null, result.meta);
        await delay(200);
        await executeActionsAnimated(actions, (step, idx, total) => {
          appendBuildingStep(`${step.type === "add" ? "+" : step.type === "remove" ? "-" : "~"} ${step.text} (${idx + 1}/${total})`);
        });
        await delay(150);
        const sectionList = actions.filter((a) => a.action === "add").map((a) => a.type).join(", ");
        addMessage("ai", cleanText || `Done! Your product page is ready with: ${sectionList}. Tell me if you'd like to change anything.`, null, result.meta);
      } else {
        addMessage("ai", cleanText || "Tell me about your product and I'll build a premium page for it.", null, result.meta);
      }
      renderPreview();
    } catch (e) {
      removeTypingIndicator();
      removeThinkingFromPreview();
      addMessage("ai", "Something went wrong. Please try again.", null, { provider: "error", model: "", status: "err" });
    }
    isProcessing = false;
    if (sendBtn) sendBtn.disabled = !input.value.trim();
  }

  /* ── Event Bindings ── */
  function bindEvents() {
    const input = $("#chat-input");
    const sendBtn = $("#chat-send");
    if (input) {
      input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; sendBtn.disabled = !input.value.trim() || isProcessing; });
      input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
    }
    if (sendBtn) sendBtn.addEventListener("click", sendMessage);
    document.querySelectorAll(".sug-chip").forEach((chip) => {
      chip.addEventListener("click", () => { if (isProcessing) return; const msg = chip.dataset.msg; if (input) { input.value = msg; input.dispatchEvent(new Event("input")); } sendMessage(); });
    });
    document.querySelectorAll(".device-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".device-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        device = btn.dataset.dev;
        const frame = $("#preview-frame");
        const label = $("#preview-device-label");
        frame.className = "preview-frame" + (device !== "desktop" ? ` device-${device}` : "");
        if (label) label.textContent = { desktop: "Desktop — 1440px", tablet: "Tablet — 1024px", mobile: "Mobile — 390px" }[device];
      });
    });
    document.querySelectorAll(".mobile-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".mobile-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const panel = $("#chat-panel");
        if (tab.dataset.tab === "chat") panel.classList.add("open"); else panel.classList.remove("open");
      });
    });
    const refreshBtn = $("#tb-refresh");
    if (refreshBtn) refreshBtn.addEventListener("click", renderPreview);
  }

  function bindSectionEvents() {
    document.querySelectorAll(".pv-section-wrap").forEach((sec) => {
      sec.addEventListener("click", (e) => { e.stopPropagation(); document.querySelectorAll(".pv-section-wrap.selected").forEach((s) => s.classList.remove("selected")); sec.classList.add("selected"); selectedId = sec.dataset.sid; });
    });
  }

  function bindFAQ() {
    document.querySelectorAll(".pp-faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const body = btn.nextElementSibling;
        const isOpen = body.style.maxHeight && body.style.maxHeight !== "0px";
        document.querySelectorAll(".pp-faq-a").forEach((a) => { a.style.maxHeight = "0px"; });
        document.querySelectorAll(".pp-faq-q").forEach((b) => b.classList.remove("open"));
        if (!isOpen) { body.style.maxHeight = body.scrollHeight + "px"; btn.classList.add("open"); }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", renderApp);
})();
