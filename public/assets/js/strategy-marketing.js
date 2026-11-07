/* ============================================================
   STRATEGY MARKETING — Premium Infographic (EN/AR)
   Bento grid · Animated KPIs · Visual hierarchy
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, p) => (p || document).querySelector(s);
  const ic = (n, s) => `<i data-lucide="${n}" style="width:${s || 18}px;height:${s || 18}px"></i>`;
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const CATEGORIES = [
    { id: "all",      en: "All Strategies", ar: "كل الاستراتيجيات", icon: "layers" },
    { id: "persona",  en: "Persona",        ar: "الشخصية",          icon: "users" },
    { id: "content",  en: "Content",        ar: "المحتوى",          icon: "pen-tool" },
    { id: "digital",  en: "Digital",        ar: "رقمي",             icon: "globe" },
    { id: "growth",   en: "Growth",         ar: "النمو",            icon: "trending-up" },
    { id: "strategy", en: "Strategy",       ar: "الاستراتيجية",     icon: "target" },
    { id: "brand",    en: "Brand",          ar: "العلامة التجارية",  icon: "award" },
  ];

  /* ── STRATEGY CARDS ── */
  const S = [
    /* ═══ PERSONA ═══ */
    {
      cat: "persona", icon: "target", color: "purple", size: "lg",
      en: { title: "Buyer Persona Development", desc: "Build detailed profiles of your ideal customers using demographics, psychographics, behavior data, and real interview insights.", steps: [
        "Survey 50+ existing customers with structured questionnaires",
        "Analyze purchase history, browsing patterns, and device data",
        "Create 3–5 primary personas with full demographic profiles",
        "Map goals, pain points, communication preferences, and triggers",
        "Share personas across marketing, sales, and support teams",
        "Validate assumptions with A/B testing and real campaigns",
      ]},
      ar: { title: "بناء شخصية المشتري", desc: "أنشئ ملفات تعريف مفصلة لعملائك المثاليين باستخدام البيانات الديموغرافية والسلوكية ونتائج المقابلات الحقيقية.", steps: [
        "استبيان أكثر من 50 عميل حالي بأسئلة منظمة",
        "تحليل سجل المشتريات وأنماط التصفح وأجهزة الاستخدام",
        "إنشاء 3-5 شخصيات أساسية بملفات ديموغرافية كاملة",
        "رسم الأهداف ونقاط الألم وتفضيلات التواصل والمحفزات",
        "مشاركة الشخصيات مع فرق التسويق والمبيعات والدعم",
        "التحقق من الافتراضات عبر اختبار A/B والحملات الفعلية",
      ]},
      tags: ["Research", "Data", "Teams"],
    },
    {
      cat: "persona", icon: "pie-chart", color: "indigo", size: "lg",
      en: { title: "Audience Segmentation", desc: "Divide your market into distinct groups with unique motivations, purchasing power, and channel preferences.", kpis: [
        { val: "5", label: "Core Segments" },
        { val: "3–5", label: "Personas Each" },
        { val: "2×", label: "Conversion Lift" },
        { val: "40%", label: "Less Wasted Spend" },
      ], bars: [
        { label: "Convenience", pct: 85, color: "purple" },
        { label: "Value", pct: 72, color: "amber" },
        { label: "Quality", pct: 58, color: "green" },
        { label: "Social", pct: 91, color: "pink" },
        { label: "Mission", pct: 64, color: "sky" },
      ]},
      ar: { title: "تقسيم الجمهور المستهدف", desc: "قسّم سوقك إلى مجموعات متميزة بدافعات فريدة وقدرة شرائية و تفضيلات قنوات مختلفة.", kpis: [
        { val: "5", label: "شرائح أساسية" },
        { val: "3–5", label: "شخصية لكل شريحة" },
        { val: "2×", label: "تحسن التحويل" },
        { val: "40%", label: "إنفاق أقل ضائعاً" },
      ], bars: [
        { label: "الراحة", pct: 85, color: "purple" },
        { label: "القيمة", pct: 72, color: "amber" },
        { label: "الجودة", pct: 58, color: "green" },
        { label: "اجتماعي", pct: 91, color: "pink" },
        { label: "القيم", pct: 64, color: "sky" },
      ]},
      tags: ["Segments", "Targeting", "Data"],
    },
    {
      cat: "persona", icon: "map", color: "teal", size: "lg",
      en: { title: "Customer Journey Map", desc: "Chart the complete path from first awareness to loyal advocacy — every touchpoint, emotion, and decision across 4 stages.", steps: [
        "Map the 4 key stages: Awareness → Consideration → Decision → Retention",
        "Identify all touchpoints at each stage",
        "Document customer emotions and friction points",
        "Find gaps where customers drop off between stages",
        "Design interventions for each critical moment",
        "Measure journey completion rates and optimize continuously",
      ]},
      ar: { title: "رسم خريطة رحلة العميل", desc: "اسجل المسار الكامل من الوعي الأول إلى الدعم الوفي — كل نقطة تواصل وقرار عبر 4 مراحل.", steps: [
        "رسم 4 مراحل أساسية: الوعي ← المقارنة ← القرار ← الاحتفاظ",
        "تحديد جميع نقاط التواصل في كل مرحلة",
        "توثيق مشاعر العميل ونقاط الاحتكاك",
        "اكتشاف الفجوات بين المراحل حيث يفقد العملاء",
        "تصميم تدخلات لكل لحظة حرجة",
        "قياس معدلات إتمام الرحلة والتحسين المستمر",
      ]},
      tags: ["Journey", "Touchpoints", "UX"],
    },
    {
      cat: "persona", icon: "users", color: "fuchsia", size: "sm",
      en: { title: "Persona Validation", desc: "Verify your personas against real data — analytics, surveys, interviews, and behavioral tracking.", steps: [
        "Cross-reference personas with Google Analytics demographics",
        "Run customer surveys to validate assumptions",
        "Interview 10–15 customers per persona",
        "Check purchase patterns match persona profiles",
      ]},
      ar: { title: "التحقق من الشخصيات", desc: "تحقق من شخصياتك مقابل البيانات الفعلية — التحليلات، الاستبيانات، المقابلات، والتتبع السلوكي.", steps: [
        "المقارنة مع ديموغرافيا Google Analytics",
        "إجراء استبيانات للتحقق من الافتراضات",
        "مقابلة 10-15 عميل لكل شخصية",
        "التحقق من توافق أنماط الشراء مع ملفات الشخصيات",
      ]},
      tags: ["Validation", "Analytics"],
    },

    /* ═══ CONTENT ═══ */
    {
      cat: "content", icon: "pen-tool", color: "sky", size: "lg",
      en: { title: "Content Marketing Strategy", desc: "Create valuable, relevant content that attracts and retains your target audience — blog posts, guides, case studies, and thought leadership.", steps: [
        "Build a content calendar aligned with buyer journey stages",
        "Create pillar pages and topic clusters for SEO authority",
        "Produce 80% educational and 20% promotional content",
        "Repurpose long-form content into social snippets and emails",
        "Measure content engagement, shares, and conversion attribution",
        "Update top-performing content quarterly for freshness",
      ]},
      ar: { title: "استراتيجية تسويق المحتوى", desc: "أنشئ محتوى قيم وذو صلة يجذب الجمهور المستهدف ويحتفظ به — مقالات، أدلة، دراسات حالة، وريادة فكر.", steps: [
        "بناء تقويم محتوى متوافق مع مراحل رحلة المشتري",
        "إنشاء صفحات أساسية ومجموعات مواضيع لسلطة SEO",
        "إنتاج 80% محتوى تعليمي و20% ترويجي",
        "إعادة تدوير المحتوى الطويل إلى مقاطع اجتماعية ورسائل",
        "قياس تفاعل المحتوى وال المشاركات ونسبة التحويل",
        "تحديث المحتوى الأفضل أداءً كل ربع سنة",
      ]},
      tags: ["Blog", "SEO", "Calendar"],
    },
    {
      cat: "content", icon: "video", color: "pink", size: "md",
      en: { title: "Video Marketing", desc: "Use video across platforms — short-form for TikTok/Reels, long-form for YouTube, live streams for engagement.", steps: [
        "Produce short-form vertical videos for TikTok, Reels, and Shorts",
        "Create product demos and unboxing videos under 2 minutes",
        "Launch a YouTube channel with weekly educational content",
        "Host live shopping events with real-time Q&A",
        "Repurpose one video into 8+ platform-specific formats",
      ]},
      ar: { title: "التسويق بالفيديو", desc: "استخدم الفيديو عبر المنصات — قصير لـ TikTok/Reels، طويل لـ YouTube، بث مباشر للتفاعل.", steps: [
        "إنتاج فيديوهات قصيرة عمودية لـ TikTok وReels وShorts",
        "إنشاء عروض منتجات وفيديوهات فتح صناديق أقل من دقيقتين",
        "إطلاق قناة YouTube بمحتوى تعليمي أسبوعي",
        "استضافة فعاليات تسوق مباشر مع أسئلة مباشرة",
        "إعادة تدوير فيديو واحد إلى أكثر من 8 صيغ مخصصة للمنصات",
      ]},
      tags: ["YouTube", "TikTok", "Reels"],
    },
    {
      cat: "content", icon: "image", color: "violet", size: "md",
      en: { title: "User-Generated Content", desc: "Leverage customer photos, videos, reviews, and testimonials as social proof — UGC builds trust 2.4× faster.", steps: [
        "Create a branded hashtag campaign for social sharing",
        "Feature customer reviews and photos on product pages",
        "Run monthly UGC contests with prizes for best submissions",
        "Build a customer spotlight series on social media",
        "Obtain permissions and repurpose UGC in paid ads",
      ]},
      ar: { title: "المحتوى المُنشأ من المستخدمين", desc: "استفد من صور ومراجعات العملاء كدليل اجتماعي — المحتوى المُنشأ يبني الثقة 2.4× أسرع.", steps: [
        "إنشاء حملة هاشتاغ علائمي للمشاركة الاجتماعية",
        "عرض مراجعات وصور العملاء على صفحات المنتجات",
        "إجراء مسابقات شهرية للمحتوى المُنشأ مع جوائز",
        "بناء سلسلة عملاء مميزين على وسائل التواصل",
        "الحصول على الأذونات وإعادة استخدام المحتوى في الإعلانات",
      ]},
      tags: ["Reviews", "Social", "Trust"],
    },
    {
      cat: "content", icon: "book-open", color: "emerald", size: "sm",
      en: { title: "Thought Leadership Content", desc: "Position your brand as an industry authority through white papers, research reports, and expert commentary.", steps: [
        "Publish original research and industry reports quarterly",
        "Write in-depth white papers on trending topics",
        "Contribute expert articles to industry publications",
        "Speak at conferences and webinars",
      ]},
      ar: { title: "محتوى الريادة الفكرية", desc: "موضع علامتك التجارية كسلطة في الصناعة عبر الأوراق البحثية وتقارير البحث والتعليقات الخبيرة.", steps: [
        "نشر أبحاث أصلية وتقارير صناعية ربع سنوياً",
        "كتابة أوراق بيضاء متعمقة على مواضيع رائجة",
        "المساهمة بمقالات خبيرة في المطبوعات الصناعية",
        "التحدث في المؤتمر والندوات عبر الإنترنت",
      ]},
      tags: ["Research", "Authority", "Speaking"],
    },

    /* ═══ DIGITAL ═══ */
    {
      cat: "digital", icon: "search", color: "green", size: "lg",
      en: { title: "SEO (Search Engine Optimization)", desc: "Rank higher on Google through technical SEO, on-page optimization, link building, and content authority.", kpis: [
        { val: "53%", label: "Organic Traffic" },
        { val: "#1–3", label: "Target Rankings" },
        { val: "3.2×", label: "CTR vs Position 10" },
        { val: "6 mo", label: "Time to Results" },
      ], bars: [
        { label: "Technical", pct: 88, color: "green" },
        { label: "On-Page", pct: 76, color: "teal" },
        { label: "Off-Page", pct: 65, color: "sky" },
        { label: "Content", pct: 82, color: "purple" },
      ]},
      ar: { title: "تحسين محركات البحث (SEO)", desc: "ارتقِ في ترتيب جوجل من خلال SEO التقني والتحسين على الصفحة وبناء الروابط وسلطة المحتوى.", kpis: [
        { val: "53%", label: "حركة زور عضوية" },
        { val: "#1–3", label: "تصنيفات مستهدفة" },
        { val: "3.2×", label: "نقرة مقابل المركز 10" },
        { val: "6 شهور", label: "الوقت للنتائج" },
      ], bars: [
        { label: "تقني", pct: 88, color: "green" },
        { label: "على الصفحة", pct: 76, color: "teal" },
        { label: "خارج الصفحة", pct: 65, color: "sky" },
        { label: "المحتوى", pct: 82, color: "purple" },
      ]},
      tags: ["Google", "Keywords", "Organic"],
    },
    {
      cat: "digital", icon: "mail", color: "amber", size: "md",
      en: { title: "Email Marketing Automation", desc: "Nurture leads with automated flows — welcome series, abandoned cart recovery, post-purchase sequences, and VIP campaigns.", steps: [
        "Set up automated welcome series for new subscribers",
        "Build abandoned cart recovery with 3-touch sequence",
        "Create post-purchase follow-up and review request emails",
        "Segment lists by purchase history and engagement",
        "A/B test subject lines, send times, and CTAs",
      ]},
      ar: { title: "أتمتة التسويق عبر البريد", desc: "نمّي العملاء المحتملين بتدفقات مؤتمتة — سلسلة الترحيب، استرداد السلال المتروكة، ما بعد الشراء.", steps: [
        "إعداد سلسلة ترحيب مؤتمتة للمشتركين الجدد",
        "بناء تدفق استرداد السلال المتروكة بتسلسل من 3 نقاط",
        "إنشاء رسائل متابعة ما بعد الشراء وطلب المراجعات",
        "تقسيم القوائم حسب سجل الشراء والتفاعل",
        "اختبار A/B لعناوين الموضوع وأوقات الإرسال",
      ]},
      tags: ["Automation", "Drip", "Retention"],
    },
    {
      cat: "digital", icon: "share-2", color: "pink", size: "md",
      en: { title: "Social Media Marketing", desc: "Build brand presence across Instagram, TikTok, Facebook, LinkedIn — with platform-specific content and community engagement.", steps: [
        "Choose 2–3 primary platforms based on audience demographics",
        "Create a content mix: 40% educational, 30% entertaining, 20% engaging, 10% promotional",
        "Post consistently with platform-specific formats",
        "Engage with comments and DMs within 1 hour",
        "Run quarterly social media audits and strategy reviews",
      ]},
      ar: { title: "التسويق عبر وسائل التواصل", desc: "ابنِ حضور العلامة التجارية عبر Instagram وTikTok وFacebook — بمحتوى مخصص لكل منصة وتفاعل مجتمعي.", steps: [
        "اختيار 2-3 منصات أساسية بناءً على ديموغرافيا الجمهور",
        "إنشاء مزيج محتوى: 40% تعليمي، 30% ترفيهي، 20% تفاعلي، 10% ترويجي",
        "النشر بانتظام بصيغ مخصصة لكل منصة",
        "الرد على التعليقات والرسائل خلال ساعة",
        "إجراء مراجعات وتدقيق ربع سنوي لاستراتيجية التواصل",
      ]},
      tags: ["Instagram", "TikTok", "Community"],
    },
    {
      cat: "digital", icon: "smartphone", color: "emerald", size: "sm",
      en: { title: "Mobile-First Strategy", desc: "Design every experience for mobile first — responsive layouts, fast loads, thumb-friendly navigation.", steps: [
        "Audit all pages for mobile usability",
        "Optimize images with WebP/AVIF and lazy loading",
        "Simplify checkout to 3 steps or fewer on mobile",
      ]},
      ar: { title: "استراتيجية الجوال أولاً", desc: "صمّم كل تجربة للجوال أولاً — تخطيطات متجاوبة، تحميل سريع، تنقل مريح للإبهام.", steps: [
        "تدقيق جميع الصفحات لاستخدام الجوال",
        "تحسين الصور بـ WebP/AVIF والتحميل الكسول",
        "تبسيط عملية الشراء إلى 3 خطوات أو أقل على الجوال",
      ]},
      tags: ["UX", "Responsive"],
    },
    {
      cat: "digital", icon: "zap", color: "orange", size: "md",
      en: { title: "PPC & Paid Advertising", desc: "Drive targeted traffic through Google Ads, Meta Ads, and programmatic display — with continuous bid optimization.", steps: [
        "Set up Google Shopping campaigns with product feeds",
        "Create Meta Ads with lookalike and retargeting audiences",
        "Implement conversion tracking with GA4 and pixel events",
        "Test 3–5 ad variations per campaign for creative optimization",
        "Set ROAS targets and pause underperforming campaigns weekly",
      ]},
      ar: { title: "الإعلانات المدفوعة وال PPC", desc: "جلب حركة زور مستهدفة من خلال إعلانات جوجل وميتا والعرض البرمجي — مع تحسين مستمر للمزايدة.", steps: [
        "إعداد حملات Google Shopping مع فيديوهات المنتجات",
        "إنشاء إعلانات Meta مع جماهير متشابهة وإعادة الاستهداف",
        "تطبيق تتبع التحويلات مع GA4 وأحداث البكسل",
        "اختبار 3-5 صيغ إعلانية لكل حملة لتحسين الإبداع",
        "تحديد أهداف ROAS وإيقاف الحملات ضعيفة الأداء أسبوعياً",
      ]},
      tags: ["Google Ads", "Meta", "ROAS"],
    },
    {
      cat: "digital", icon: "layers", color: "rose", size: "sm",
      en: { title: "Personalization & AI", desc: "Use AI to personalize every touchpoint — product recommendations, dynamic content, predictive search.", steps: [
        "Implement product recommendation engine",
        "Create dynamic email content per recipient",
        "Add predictive search with auto-complete",
        "Build individualized landing pages by traffic source",
      ]},
      ar: { title: "التخصيص والذكاء الاصطناعي", desc: "استخدم الذكاء الاصطناعي لتخصيص كل نقطة تواصل — توصيات المنتجات، محتوى ديناميكي، بحث تنبؤي.", steps: [
        "تطبيق محرك توصيات المنتجات",
        "إنشاء محتوى بريد إلكتروني ديناميكي لكل متلقي",
        "إضافة بحث تنبؤي مع إكمال تلائمي",
        "بناء صفحات هبوط فردية حسب مصدر الحركة",
      ]},
      tags: ["AI", "Dynamic", "Data"],
    },

    /* ═══ GROWTH ═══ */
    {
      cat: "growth", icon: "repeat", color: "cyan", size: "md",
      en: { title: "Customer Retention & Loyalty", desc: "Retain existing customers 5× cheaper than acquiring new ones — through loyalty programs and personalized outreach.", kpis: [
        { val: "5×", label: "Cheaper to Retain" },
        { val: "95%", label: "Retention Target" },
        { val: "25%", label: "CLV Increase" },
        { val: "3×", label: "Repeat Purchase" },
      ], bars: [
        { label: "Loyalty", pct: 90, color: "cyan" },
        { label: "VIP Tier", pct: 70, color: "purple" },
        { label: "Win-Back", pct: 55, color: "rose" },
        { label: "Upsell", pct: 68, color: "green" },
      ]},
      ar: { title: "الاحتفاظ بالعملاء والولاء", desc: "الاحتفاظ بالعملاء الحاليين أرخص 5× من اكتساب جدد — من خلال برامج الولاء والتواصل الشخصي.", kpis: [
        { val: "5×", label: "أرخص للاحتفاظ" },
        { val: "95%", label: "هدف الاحتفاظ" },
        { val: "25%", label: "زيادة قيمة العميل" },
        { val: "3×", label: "شرة متكررة" },
      ], bars: [
        { label: "الولاء", pct: 90, color: "cyan" },
        { label: "طبقة VIP", pct: 70, color: "purple" },
        { label: "استرداد", pct: 55, color: "rose" },
        { label: "بيع أعلى", pct: 68, color: "green" },
      ]},
      tags: ["Loyalty", "CLV", "Programs"],
    },
    {
      cat: "growth", icon: "gift", color: "rose", size: "md",
      en: { title: "Referral Marketing Program", desc: "Turn happy customers into brand advocates — dual-sided incentives, shareable links, and automated rewards.", steps: [
        "Design a dual-sided referral program (give $10, get $10)",
        "Generate unique referral links for each customer",
        "Add referral prompts post-purchase and after 5-star reviews",
        "Automate reward delivery when referrals convert",
        "Create a referral leaderboard and gamification elements",
      ]},
      ar: { title: "برنامج التسويق بالإحالة", desc: "حوّل العملاء السعداء إلى مدافعين عن العلامة التجارية — مكافآت ثنائية وروابط قابلة للمشاركة وأتمتة.", steps: [
        "تصميم برنامج إحالة ثنائي الطرف (أعطِ 10$،احصل على 10$)",
        "إنشاء روابط إحالة فريدة لكل عميل",
        "إضافة مطالبات الإحالة ما بعد الشراء وبعد المراجعات 5 نجوم",
        "أتمتة تسليم المكافآت عند تحويل الإحالات",
        "إنشاء لوحة صدارة للإحالة وعناصر تلعيم",
      ]},
      tags: ["Referrals", "Viral", "Advocacy"],
    },
    {
      cat: "growth", icon: "users", color: "fuchsia", size: "sm",
      en: { title: "Affiliate Marketing Network", desc: "Partner with publishers and influencers to promote products for commission — scalable, performance-based.", steps: [
        "Launch an affiliate program with competitive commissions",
        "Recruit affiliates through influencer platforms",
        "Provide creative assets and deep link tools",
        "Monitor affiliate performance and optimize top partners",
      ]},
      ar: { title: "شبكة التسويق بالعمولة", desc: "شارك مع الناشرين والمؤثرين لترويج المنتجات مقابل عمولة — قابل للتوسع ومبني على الأداء.", steps: [
        "إطلاق برنامج تسويق بالعمولة بمعدلات تنافسية",
        "استقطاب المسوّقين بالعمولة من خلال منصات المؤثرين",
        "توفير الأصول الإبداعية وأدوات الروابط العميقة",
        "مراقبة أداء المسوّقين وتحسين الشركاء المتميزين",
      ]},
      tags: ["Partners", "Commission", "Scale"],
    },
    {
      cat: "growth", icon: "shield-check", color: "lime", size: "sm",
      en: { title: "Customer Service Excellence", desc: "Turn support into a growth engine — fast response, proactive resolution, multi-channel support.", steps: [
        "Set SLAs: 1hr email, 5min chat, 24hr social",
        "Implement omnichannel support",
        "Create a self-service knowledge base",
        "Send CSAT surveys after every interaction",
      ]},
      ar: { title: "التميز في خدمة العملاء", desc: "حوّل الدعم إلى محرك نمو — استجابة سريعة، حل استباقي، دعم متعدد القنوات.", steps: [
        "تحديد معايير الاستجابة: ساعة للبريد، 5 دقائق للدردشة، 24 ساعة للتواصل",
        "تطبيق الدعم عبر القنوات المتعددة",
        "إنشاء قاعدة معرفية لخدمة ذاتية",
        "إرسال استبيانات رضا العملاء بعد كل تفاعل",
      ]},
      tags: ["Support", "NPS", "CSAT"],
    },
    {
      cat: "growth", icon: "clock", color: "amber", size: "md",
      en: { title: "Seasonal & Event Campaigns", desc: "Capitalize on seasonal peaks — Black Friday, Ramadan, back-to-school, and niche holidays with themed campaigns.", steps: [
        "Build a 12-month campaign calendar with key retail events",
        "Create themed landing pages and email sequences for each event",
        "Prepare inventory and supply chain for demand spikes",
        "Launch early-bird promotions 2 weeks before major events",
        "Analyze post-event performance and document learnings",
      ]},
      ar: { title: "الحملات الموسمية والأحداث", desc: "استفد من الذروات الموسمية — الجمعة السوداء، رمضان، العودة للمدارس، والأحداث بحملات ذات صلة.", steps: [
        "بناء تقويم حملات ل 12 شهراً بالأحداث الرئيسية",
        "إنشاء صفحات هبوط ورسائل بريد لكل حدث",
        "إعداد المخزون وسلسلة التوريد لذروات الطلب",
        "إطلاق عروض للمبكر قبل أسبوعين من الأحداث الكبرى",
        "تحليل أداء ما بعد الحدث وتوثيق الدروس",
      ]},
      tags: ["Black Friday", "Ramadan", "Events"],
    },

    /* ═══ STRATEGY ═══ */
    {
      cat: "strategy", icon: "crosshair", color: "red", size: "md",
      en: { title: "Brand Positioning & Messaging", desc: "Define how your brand is perceived — unique value proposition, competitive differentiation, consistent brand voice.", steps: [
        "Conduct a competitive positioning analysis (top 5 rivals)",
        "Define your unique value proposition in one sentence",
        "Create a brand voice guide with do's and don'ts",
        "Ensure consistent messaging across all channels",
        "Test positioning statements with target audience surveys",
      ]},
      ar: { title: "تموضع العلامة التجارية والرسائل", desc: "حدد كيف تُدرك علامتك التجارية — القيمة الفريدة والتمييز التنافسي وصوت العلامة التجارية المتسق.", steps: [
        "إجراء تحليل تموضعي تنافسي (أقوى 5 منافسين)",
        "تحديد القيمة الفريدة في جملة واحدة",
        "إنشاء دليل صوت العلامة التجارية مع الإرشادات",
        "ضمان اتساق الرسائل عبر جميع القنوات",
        "اختبار عبارات التموضع مع استبيانات الجمهور المستهدف",
      ]},
      tags: ["UVP", "Voice", "Consistency"],
    },
    {
      cat: "strategy", icon: "tag", color: "amber", size: "md",
      en: { title: "Dynamic Pricing Strategy", desc: "Optimize pricing based on demand, competition, and segments — psychological pricing, bundling, and dynamic discounts.", compare: {
        left: { title: "Tactics", color: "amber", items: ["Charm pricing ($49.99)", "Bundle offers +20–35% AOV", "Dynamic rules by demand", "Volume discounts", "Seasonal markdowns"] },
        right: { title: "Avoid", color: "red", items: ["Hidden fees", "Unclear pricing tiers", "Frequent deep discounts", "Price without justification", "Inconsistent pricing"] },
      }},
      ar: { title: "استراتيجية التسعير الديناميكي", desc: "حسّن التسعير بناءً على الطلب والمنافسة وشرائح العملاء — التسعير النفسي والتجميع والخصومات الديناميكية.", compare: {
        left: { title: "التكتيكات", color: "amber", items: ["تسعير نفسي ($49.99)", "عروضundles +20-35% AOV", "قواعد ديناميكية بالطلب", "خصومات الحجم", "تخفيضات موسمية"] },
        right: { title: "تجنب", color: "red", items: ["رسوم مخفية", "مستويات تسعير غير واضحة", "خصومات عميقة متكررة", "تسعير بدون تبرير", "تسعير غير متسق"] },
      }},
      tags: ["Pricing", "Bundles", "A/B"],
    },
    {
      cat: "strategy", icon: "rocket", color: "orange", size: "sm",
      en: { title: "Product Launch Playbook", desc: "Execute successful launches with pre-launch hype, launch-day momentum, and post-launch optimization.", steps: [
        "Build a pre-launch waitlist with early-bird incentives",
        "Seed products to influencers 4–6 weeks before launch",
        "Create a launch-day content blitz across all channels",
        "Run limited-time launch offers for first 100 sales",
      ]},
      ar: { title: "دليل إطلاق المنتج", desc: "نفّذ إطلاق ناجح مع تفاعل قبل الإطلاق وعند الإطلاق وتحسين ما بعد الإطلاق.", steps: [
        "بناء قائمة انتظار قبل الإطلاق مع مكافآت للمبكر",
        "توفير المنتجات للمؤثرين 4-6 أسابيع قبل الإطلاق",
        "إنشاء حملة محتوى يوم الإطلاق عبر جميع القنوات",
        "تشغيل عروض إطلاق محدودة للحصول على أول 100 عملية بيع",
      ]},
      tags: ["Launch", "Waitlist", "Urgency"],
    },
    {
      cat: "strategy", icon: "bar-chart-3", color: "teal", size: "md",
      en: { title: "Conversion Rate Optimization", desc: "Systematically increase visitor-to-action rate — A/B testing, UX improvements, trust signals, checkout optimization.", kpis: [
        { val: "+40%", label: "Conv. Lift" },
        { val: "-35%", label: "Cart Abandon" },
        { val: "+22%", label: "AOV Increase" },
        { val: "4.8s", label: "Load Time" },
      ], bars: [
        { label: "Product", pct: 85, color: "teal" },
        { label: "Checkout", pct: 72, color: "green" },
        { label: "Mobile", pct: 78, color: "sky" },
        { label: "Trust", pct: 90, color: "purple" },
      ]},
      ar: { title: "تحسين معدل التحويل (CRO)", desc: "زيادة نسبة الزوار الذين يتخذون إجراء بشكل منهجي — اختبار A/B، تحسينات UX، إشارات الثقة.", kpis: [
        { val: "+40%", label: "تحسن التحويل" },
        { val: "-35%", label: "تسرب السلال" },
        { val: "+22%", label: "زيادة متوسط الطلب" },
        { val: "4.8 ث", label: "سرعة التحميل" },
      ], bars: [
        { label: "المنتج", pct: 85, color: "teal" },
        { label: "الشراء", pct: 72, color: "green" },
        { label: "الجوال", pct: 78, color: "sky" },
        { label: "الثقة", pct: 90, color: "purple" },
      ]},
      tags: ["Testing", "UX", "Checkout"],
    },
    {
      cat: "strategy", icon: "globe", color: "sky", size: "sm",
      en: { title: "Market Expansion Strategy", desc: "Scale into new markets — localization, local partnerships, culturally adapted marketing.", steps: [
        "Research target market size and competition",
        "Localize website, listings, and checkout",
        "Partner with local influencers and media",
        "Test with limited assortment before full launch",
      ]},
      ar: { title: "استراتيجية التوسع في السوق", desc: "توسع في أسواق جديدة — التوطين والشراكات المحلية والتسويق المكيّف ثقافياً.", steps: [
        "بحث حجم السوق المستهدف والمنافسة",
        "توطين الموقع وعروض المنتجات والشراء",
        "الشراكة مع المؤثرين المحليين ووسائل الإعلام",
        "الاختبار بمجموعة منتجات محدودة قبل الإطلاق الكامل",
      ]},
      tags: ["Localization", "New Markets"],
    },
    {
      cat: "strategy", icon: "search", color: "indigo", size: "sm",
      en: { title: "Competitive Intelligence", desc: "Monitor competitors' pricing, content, ads, and launches to identify gaps and opportunities.", steps: [
        "Set up Google Alerts for competitor brands",
        "Track competitor pricing weekly",
        "Analyze competitor ad creatives",
        "Create quarterly competitive analysis reports",
      ]},
      ar: { title: "الاستخبارات التنافسية", desc: "راقب تسعير المنافسين ومحتواهم وإعلاناتهم لتحديد الفجوات والفرص في سوقك.", steps: [
        "إعداد تنبيهات جوجل لأسماء علامات منافسين",
        "تتبع تسعير المنافسين أسبوعياً",
        "تحليل إبداعات إعلانات المنافسين",
        "إنشاء تقرير تحليل تنافسي ربع سنوي",
      ]},
      tags: ["Monitoring", "Gaps", "Intel"],
    },
    {
      cat: "strategy", icon: "test-tube", color: "lime", size: "sm",
      en: { title: "A/B Testing Framework", desc: "Make data-driven decisions with statistically rigorous variant testing.", steps: [
        "Prioritize tests using ICE framework",
        "Run one test at a time with sufficient sample",
        "Set 95% confidence level before declaring winner",
        "Document all tests and learnings",
      ]},
      ar: { title: "إطار اختبار A/B", desc: "اتخذ قرارات مبنية على البيانات من خلال اختبار نماذج بدقة إحصائية.", steps: [
        "تحديد أولويات الاختبارات بإطار ICE",
        "تشغيل اختبار واحد في كل مرة بحجم عينة كافٍ",
        "تحديد مستوى ثقة 95% على الأقل قبل الإعلان عن الفائز",
        "توثيق جميع الاختبارات والدروس المستفادة",
      ]},
      tags: ["Testing", "ICE", "Data"],
    },

    /* ═══ BRAND ═══ */
    {
      cat: "brand", icon: "heart", color: "red", size: "sm",
      en: { title: "Emotional Brand Storytelling", desc: "Craft narratives that connect — origin stories, customer triumphs, mission-driven content.", steps: [
        "Develop your brand origin story",
        "Feature real customer transformation journeys",
        "Create video documentaries about brand impact",
        "Weave storytelling into product descriptions",
      ]},
      ar: { title: "السرد العاطفي للعلامة التجارية", desc: "اصنع سرداً يتصل بجمهورك عاطفياً — قصص الأصل وانتصارات العملاء والمحتوى المبني على المهمة.", steps: [
        "تطوير قصة أصل العلامة التجارية",
        "عرض قصص عملاء حقيقية ورحلات تحول",
        "إنشاء فيديو وثائقي عن تأثير العلامة التجارية",
        "دمج السرد في أوصاف المنتجات",
      ]},
      tags: ["Storytelling", "Emotion"],
    },
    {
      cat: "brand", icon: "award", color: "emerald", size: "sm",
      en: { title: "Omnichannel Brand Experience", desc: "Deliver seamless experience across all touchpoints — website, app, social, email, stores, support.", steps: [
        "Map all customer touchpoints with consistent branding",
        "Unify design systems across all channels",
        "Sync customer data in real time",
        "Create cross-channel campaigns",
      ]},
      ar: { title: "تجربة العلامة التجارية عبر القنوات المتعددة", desc: "قدم تجربة سلسة عبر جميع نقاط التواصل — الموقع، التطبيق، التواصل، البريد، المتاجر، الدعم.", steps: [
        "رسم جميع نقاط التواصل بعلامة تجارية متسقة",
        "توحيد أنظمة التصميم عبر جميع القنوات",
        "مزامنة بيانات العملاء في الوقت الفعلي",
        "إنشاء حملات متعددة القنوات",
      ]},
      tags: ["Seamless", "Consistency"],
    },
    {
      cat: "brand", icon: "message-circle", color: "violet", size: "sm",
      en: { title: "Community Building", desc: "Build engaged community — forums, events, user content that creates belonging.", steps: [
        "Create a branded community forum or Discord",
        "Host monthly virtual or in-person events",
        "Launch a customer ambassador program",
        "Run community challenges with prizes",
      ]},
      ar: { title: "بناء المجتمع", desc: "ابنِ مجتمعاً من Engagement — منتديات، فعاليات، محتوى مُنشأ يشعر بالانتماء.", steps: [
        "إنشاء منتدى مجتمعي علائمي أو خادم Discord",
        "استضافة فعاليات شهرية افتراضية أو حقيقية",
        "إطلاق برنامج سفراء العملاء",
        "إجراء تحديات مجتمعية مع جوائز",
      ]},
      tags: ["Forum", "Events", "Advocacy"],
    },
    {
      cat: "brand", icon: "shield", color: "cyan", size: "sm",
      en: { title: "Trust & Social Proof", desc: "Establish credibility through reviews, certifications, press mentions, and transparency.", steps: [
        "Display verified customer reviews prominently",
        "Obtain industry certifications and trust badges",
        "Publish transparent shipping and return policies",
        "Respond publicly to negative reviews",
      ]},
      ar: { title: "بناء الثقة والدليل الاجتماعي", desc: "确立 المصداقية من خلال المراجعات والشهادات والشفافية.", steps: [
        "عرض مراجعات العملاء المعتمدة بشكل بارز",
        "الحصول على شهادات الصناعة وشعارات الثقة",
        "نشر سياسات شفافة للشحن والإرجاع",
        "الرد علنياً على المراجعات السلبية",
      ]},
      tags: ["Reviews", "Certifications"],
    },
    {
      cat: "brand", icon: "palette", color: "fuchsia", size: "sm",
      en: { title: "Visual Identity System", desc: "Cohesive visual identity — logo, colors, typography, imagery, and component library.", steps: [
        "Define logo usage rules and color variations",
        "Establish primary and secondary color palettes",
        "Select typography scales for all contexts",
        "Build a reusable component library",
      ]},
      ar: { title: "نظام الهوية البصرية", desc: "هوية بصرية متماسكة — الشعار، الألوان، الطباعة، الصور، ومكتبة المكونات.", steps: [
        "تحديد قواعد استخدام الشعار وتنويعات الألوان",
        "إنشاء لوحة ألوان أساسية وثانوية",
        "اختيار مقاييس الطباعة لكل السياقات",
        "بناء مكتبة مكونات قابلة لإعادة الاستخدام",
      ]},
      tags: ["Design", "Logo", "Components"],
    },
  ];

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  function render() {
    const app = $("#sm-app");
    if (!app) return;

    const totalSteps = S.reduce((a, c) => a + (c.en.steps ? c.en.steps.length : 0), 0);
    const catCount = CATEGORIES.length - 1;

    app.innerHTML = `
      <!-- HERO -->
      <div class="sm-hero">
        <div class="sm-hero-orb sm-hero-orb--a"></div>
        <div class="sm-hero-orb sm-hero-orb--b"></div>
        <div class="sm-hero-orb sm-hero-orb--c"></div>
        <div class="sm-hero-grid"></div>
        <div class="sm-hero-inner">
          <div class="sm-hero-badge">${ic("target", 13)} Strategy Marketing</div>
          <h1><em>Strategy Marketing</em><br>Infographic Guide</h1>
          <p class="sm-hero-sub">Every strategy visualized. Every text bilingual. Professional infographic design with data-driven visual hierarchy.</p>
          <p class="sm-hero-sub-ar">كل استراتيجية مُ可视化. كل نص ثنائي اللغة. تصميم انفوغرافيك احترافي مع تسلسل بصري مبني على البيانات.</p>
        </div>
      </div>

      <!-- STATS -->
      <div class="sm-stats" id="sm-stats">
        <div class="sm-stat" style="animation: smFadeUp .4s .1s both">
          <div class="sm-stat-icon" style="background:rgba(99,102,241,.10);color:var(--sm-purple)">${ic("layers", 18)}</div>
          <div class="sm-stat-num" data-target="${S.length}">0</div>
          <div class="sm-stat-label">Total Strategies</div>
          <div class="sm-stat-sub">استراتيجية إجمالية</div>
        </div>
        <div class="sm-stat" style="animation: smFadeUp .4s .2s both">
          <div class="sm-stat-icon" style="background:rgba(14,165,233,.10);color:var(--sm-sky)">${ic("grid-3x3", 18)}</div>
          <div class="sm-stat-num" data-target="${catCount}">0</div>
          <div class="sm-stat-label">Categories</div>
          <div class="sm-stat-sub">فئات</div>
        </div>
        <div class="sm-stat" style="animation: smFadeUp .4s .3s both">
          <div class="sm-stat-icon" style="background:rgba(16,185,129,.10);color:var(--sm-green)">${ic("languages", 18)}</div>
          <div class="sm-stat-num" data-target="${totalSteps}">0</div>
          <div class="sm-stat-label">Bilingual Steps</div>
          <div class="sm-stat-sub">خطوة ثنائية اللغة</div>
        </div>
        <div class="sm-stat" style="animation: smFadeUp .4s .4s both">
          <div class="sm-stat-icon" style="background:rgba(245,158,11,.10);color:var(--sm-amber)">${ic("bar-chart-3", 18)}</div>
          <div class="sm-stat-num" data-target="2">0</div>
          <div class="sm-stat-label">Languages</div>
          <div class="sm-stat-sub">لغات</div>
        </div>
      </div>

      <!-- SECTION: CATEGORIES -->
      <div class="sm-section-head" style="animation: smFadeUp .4s .5s both">
        <div class="icon-box" style="background:rgba(99,102,241,.10);color:var(--sm-purple)">${ic("grid-3x3", 18)}</div>
        <h2>Strategy Categories<small>Browse by topic — EN / AR bilingual content in every card</small></h2>
      </div>
      <div class="sm-cats" id="sm-cats">
        ${CATEGORIES.map((c) => {
          const cnt = c.id === "all" ? S.length : S.filter((x) => x.cat === c.id).length;
          return `<div class="sm-cat${c.id === "all" ? " active" : ""}" data-cat="${c.id}">
            <div class="sm-cat-icon">${ic(c.icon, 16)}</div>
            <div><div class="sm-cat-label">${esc(c.en)}</div><div class="sm-cat-label-ar">${esc(c.ar)}</div></div>
            <span class="sm-cat-cnt">${cnt}</span>
          </div>`;
        }).join("")}
      </div>

      <!-- SECTION: STRATEGIES -->
      <div class="sm-section-head" id="sm-strat-head" style="animation: smFadeUp .4s .6s both">
        <div class="icon-box" style="background:rgba(14,165,233,.10);color:var(--sm-sky)">${ic("target", 18)}</div>
        <h2>All Strategies<small>Visual infographic cards — each with English + Arabic content</small></h2>
      </div>
      <div class="sm-wrap">
        <div class="sm-bento" id="sm-bento"></div>
      </div>
    `;

    renderBento("all");
    animateCounters();
    setupFilters();

    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  /* ── BENTO GRID ── */
  function renderBento(cat) {
    const grid = $("#sm-bento");
    if (!grid) return;

    const filtered = cat === "all" ? S : S.filter((c) => c.cat === cat);

    if (!filtered.length) {
      grid.innerHTML = `<div class="sm-empty">${ic("search", 32)}<br>No strategies in this category.</div>`;
      if (typeof lucide !== "undefined") lucide.createIcons();
      return;
    }

    grid.innerHTML = filtered.map((card, i) => {
      const sz = card.size || "sm";
      const cls = `sm-bc sm-bc--${sz} sm-bc--${card.color} sm-animate`;
      const delay = Math.min(i * 0.04, 0.6);

      let body = "";
      if (card.en.kpis) body = renderKpiBody(card);
      else if (card.en.compare) body = renderCompareBody(card);
      else if (card.en.bars) body = renderBarsBody(card);
      else body = renderStepsBody(card);

      const tagsHtml = (card.tags || []).map((t) => `<span class="sm-tag ${card.color}">${esc(t)}</span>`).join("");

      return `
        <div class="${cls}" style="animation-delay:${delay}s">
          <div class="sm-bc-head">
            <div class="sm-bc-icon ${card.color}">${ic(card.icon, 22)}</div>
            <div class="sm-bc-title">
              <div class="sm-bc-title-en">${esc(card.en.title)}</div>
              <div class="sm-bc-title-ar">${esc(card.ar.title)}</div>
            </div>
          </div>
          <div class="sm-bc-body">
            ${body}
          </div>
          ${tagsHtml ? `<div class="sm-bc-foot">${tagsHtml}</div>` : ""}
        </div>`;
    }).join("");

    animateBars();
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  /* ── STEPS BODY ── */
  function renderStepsBody(card) {
    const steps = card.en.steps || [];
    const stepsAr = card.ar.steps || [];
    const stepsHtml = steps.map((enStep, si) => `
      <li class="sm-step">
        <span class="step-num ${card.color}">${si + 1}</span>
        <div class="sm-step-content">
          <div class="sm-step-en">${esc(enStep)}</div>
          <div class="step-ar">${esc(stepsAr[si] || "")}</div>
        </div>
      </li>`).join("");

    return `
      <div class="sm-bc-desc">${esc(card.en.desc)}</div>
      <div class="sm-bc-desc-ar">${esc(card.ar.desc)}</div>
      <ul class="sm-steps">${stepsHtml}</ul>`;
  }

  /* ── KPI BODY ── */
  function renderKpiBody(card) {
    const kpis = card.en.kpis || [];
    const kpisAr = card.ar.kpis || [];
    const kpiHtml = kpis.map((k, ki) => `
      <div class="sm-card-kpi-item">
        <div class="sm-card-kpi-val">${esc(k.val)}</div>
        <div class="sm-card-kpi-label">${esc(kpisAr[ki]?.label || k.label)}</div>
      </div>`).join("");

    const bars = card.en.bars || [];
    const barsAr = card.ar.bars || [];
    const barsHtml = bars.map((b, bi) => `
      <div class="sm-progress-row">
        <div class="sm-progress-label">${esc(b.label)}</div>
        <div class="sm-progress-track"><div class="sm-progress-fill ${b.color}" data-w="${b.pct}%"></div></div>
        <div class="sm-progress-val">${esc(barsAr[bi]?.label || b.label)}</div>
      </div>`).join("");

    return `
      <div class="sm-bc-desc">${esc(card.en.desc)}</div>
      <div class="sm-bc-desc-ar">${esc(card.ar.desc)}</div>
      <div class="sm-card-kpi">${kpiHtml}</div>
      ${barsHtml}`;
  }

  /* ── BARS BODY (no KPIs, just bars) ── */
  function renderBarsBody(card) {
    const bars = card.en.bars || [];
    const barsAr = card.ar.bars || [];
    const barsHtml = bars.map((b, bi) => `
      <div class="sm-progress-row">
        <div class="sm-progress-label">${esc(b.label)}</div>
        <div class="sm-progress-track"><div class="sm-progress-fill ${b.color}" data-w="${b.pct}%"></div></div>
        <div class="sm-progress-val">${b.pct}%</div>
      </div>`).join("");

    return `
      <div class="sm-bc-desc">${esc(card.en.desc)}</div>
      <div class="sm-bc-desc-ar">${esc(card.ar.desc)}</div>
      ${barsHtml}`;
  }

  /* ── COMPARE BODY ── */
  function renderCompareBody(card) {
    const cmp = card.en.compare;
    const cmpAr = card.ar.compare;
    return `
      <div class="sm-bc-desc">${esc(card.en.desc)}</div>
      <div class="sm-bc-desc-ar">${esc(card.ar.desc)}</div>
      <div class="sm-compare">
        <div class="sm-compare-col">
          <h5 style="color:var(--sm-${cmp.left.color})">${ic("check-circle", 12)} ${esc(cmp.left.title)}</h5>
          <ul>${cmp.left.items.map((it, ii) => `<li>${esc(it)}<br><span style="font-size:10px;color:var(--sm-muted2);direction:rtl;display:block">${esc(cmpAr.left.items[ii] || "")}</span></li>`).join("")}</ul>
        </div>
        <div class="sm-compare-col">
          <h5 style="color:var(--sm-${cmp.right.color})">${ic("x-circle", 12)} ${esc(cmp.right.title)}</h5>
          <ul>${cmp.right.items.map((it, ii) => `<li>${esc(it)}<br><span style="font-size:10px;color:var(--sm-muted2);direction:rtl;display:block">${esc(cmpAr.right.items[ii] || "")}</span></li>`).join("")}</ul>
        </div>
      </div>`;
  }

  /* ── COUNTERS ── */
  function animateCounters() {
    setTimeout(() => {
      document.querySelectorAll(".sm-stat-num[data-target]").forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target)) return;
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const iv = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(iv); }
          el.textContent = current;
        }, 30);
      });
    }, 400);
  }

  /* ── BARS ANIMATION ── */
  function animateBars() {
    setTimeout(() => {
      document.querySelectorAll(".sm-progress-fill[data-w]").forEach((el) => {
        el.style.width = el.getAttribute("data-w");
      });
    }, 200);
  }

  /* ── FILTERS ── */
  function setupFilters() {
    const cats = $("#sm-cats");
    if (!cats) return;
    cats.addEventListener("click", (e) => {
      const btn = e.target.closest(".sm-cat");
      if (!btn) return;
      cats.querySelectorAll(".sm-cat").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderBento(btn.dataset.cat);
    });
  }

  document.addEventListener("DOMContentLoaded", render);
})();
