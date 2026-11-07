/* ============================================================
   PUNCHLINE — LARKTAB (larktab.html)
   Personal hub of every website / platform you use all the time.
   Idea cards grouped into folders, add / edit / remove and
   one-click open the site. Persisted in localStorage (larktab.v1).
   ============================================================ */
(function () {
  "use strict";

  const STORE = "larktab.v1";
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const ic = (n, s) => `<i data-lucide="${n}" style="width:${s || 14}px;height:${s || 14}px"></i>`;
  const uid = () => "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const toast = (m, t) => { try { window.PL && PL.toast(m, t || "ok"); } catch (e) { console.warn(m); } };
  function icons() { try { if (window.lucide) lucide.createIcons(); } catch (e) {} }

  const GROUPS = [
    { id: "ads", label: "Ads & Marketing", icon: "megaphone" },
    { id: "research", label: "Product Research", icon: "search" },
    { id: "shop", label: "My Stores", icon: "store" },
    { id: "markets", label: "Marketplaces", icon: "shopping-cart" },
    { id: "sourcing", label: "Sourcing & Dropshipping", icon: "package-search" },
    { id: "payments", label: "Payments & Finance", icon: "credit-card" },
    { id: "shipping", label: "Shipping & Delivery", icon: "truck" },
    { id: "voice", label: "Voice AI", icon: "mic" },
    { id: "visa", label: "Travel Visa", icon: "plane" },
    { id: "ai", label: "All AI", icon: "sparkles" },
    { id: "search", label: "Search Engine", icon: "globe" },
    { id: "crowdfunding", label: "Crowdfunding", icon: "hand-coins" },
    { id: "traffic", label: "Source Traffic", icon: "radio-tower" },
    { id: "blog", label: "Blog Ecom", icon: "newspaper" },
    { id: "scraping", label: "Scraping", icon: "database" },
    { id: "courses", label: "Courses", icon: "graduation-cap" },
    { id: "digital", label: "Digital Products", icon: "package" },
    { id: "crochet", label: "Crochet", icon: "scissors" },
    { id: "forums", label: "Forums", icon: "messages-square" },
    { id: "app", label: "Apps", icon: "app-window" },
    { id: "seo", label: "SEO", icon: "search-check" },
    { id: "sheets", label: "Sheets Templates", icon: "table" },
    { id: "blogs", label: "Blog", icon: "book-open" },
    { id: "dbase", label: "Database", icon: "archive" },
    { id: "videoai", label: "Video AI", icon: "clapperboard" },
    { id: "cards", label: "Cards", icon: "credit-card" },
    { id: "tools", label: "Tools", icon: "wrench" },
    { id: "market", label: "Market", icon: "shopping-bag" },
    { id: "llc", label: "LLC", icon: "landmark" },
    { id: "fbagency", label: "Facebook Agency", icon: "share-2" },
    { id: "trend", label: "Trend", icon: "trending-up" },
    { id: "spy", label: "Spy", icon: "scan-eye" },
    { id: "clothing", label: "Clothing", icon: "shirt" },
    { id: "niches", label: "Niches", icon: "target" },
    { id: "inspiration", label: "Inspiration", icon: "lightbulb" },
  ];

  const DEFAULT_ITEMS = [
    { name: "Facebook Ads Manager", url: "fb-ads22.html", desc: "Create and manage every Meta ad campaign, ad set, audience and budget — local AI FB Ads tool.", group: "ads", color: "#1877F2" },
    { name: "Meta Business Suite", url: "https://business.facebook.com", desc: "Inbox, publishing, insights and ad account overview.", group: "ads", color: "#1877F2" },
    { name: "TikTok Ads", url: "https://ads.tiktok.com", desc: "Build TikTok campaigns, catalog ads and Spark Ads.", group: "ads", color: "#1C1C28" },
    { name: "Google Ads", url: "https://ads.google.com", desc: "Search, Shopping and Display campaigns with keyword research.", group: "ads", color: "#4285F4" },
    { name: "AliExpress", url: "https://www.aliexpress.com", desc: "Supplier catalog for winning product discovery and research.", group: "research", color: "#E62E04" },
    { name: "CJ Dropshipping", url: "https://www.cjdropshipping.com", desc: "Sourcing, warehousing, fulfillment and global shipping.", group: "research", color: "#22C55E" },
    { name: "Zendrop", url: "https://www.zendrop.com", desc: "Automated dropshipping and private label sourcing.", group: "research", color: "#7C3AED" },
    { name: "Shopify Admin", url: "https://admin.shopify.com", desc: "Store dashboard — products, orders, checkout and analytics.", group: "shop", color: "#96BF48" },
    { name: "Jumia Algeria", url: "https://www.jumia.dz", desc: "Local COD marketplace for Algeria.", group: "markets", color: "#F68B1E" },
    { name: "Cdiscount", url: "https://www.cdiscount.com", desc: "French marketplace for listing your products.", group: "markets", color: "#D71920" },
    { name: "Alibaba", url: "https://www.alibaba.com", desc: "Wholesale suppliers, MOQ and bulk sourcing.", group: "sourcing", color: "#FF6A00" },
    { name: "DHgate", url: "https://www.dhgate.com", desc: "Wholesale marketplace with dropshipping suppliers.", group: "sourcing", color: "#B030B0" },
    { name: "Wise", url: "https://wise.com", desc: "Send and receive money internationally at low fees.", group: "payments", color: "#9FE870" },
    { name: "PayPal", url: "https://www.paypal.com", desc: "Online payments and international transfers.", group: "payments", color: "#003087" },
    { name: "Binance", url: "https://www.binance.com", desc: "Crypto payments and exchange.", group: "payments", color: "#F0B90B" },
    { name: "Yalidine", url: "https://yalidine.com", desc: "Algerian COD carrier — track parcels and collect cash on delivery.", group: "shipping", color: "#E32636" },
    { name: "DHL", url: "https://www.dhl.com", desc: "International express courier and tracking.", group: "shipping", color: "#FFCC00" },
    { name: "Chronopost", url: "https://www.chronopost.com", desc: "French express delivery and tracking.", group: "shipping", color: "#E30613" },
    { name: "Google AI Studio — Speech", url: "https://aistudio.google.com/generate-speech", desc: "Google AI Studio — generate speech from text with Gemini voices.", group: "voice", color: "#4285F4" },
    { name: "OpenAI FM", url: "https://www.openai.fm/", desc: "OpenAI's experimental text-to-speech playground.", group: "voice", color: "#10A37F" },
    { name: "ElevenLabs", url: "https://elevenlabs.io/app/home", desc: "Ultra-realistic AI voice generation, cloning and dubbing.", group: "voice", color: "#8B5CF6" },
    { name: "Fliki Voices", url: "https://app.fliki.ai/voices", desc: "AI voiceover library with hundreds of voices and languages.", group: "voice", color: "#6C47FF" },
    { name: "Darija TTS", url: "https://tts.darijat.com/", desc: "Darija text-to-speech — generate Algerian/Moroccan dialect audio.", group: "voice", color: "#E11D48" },
    { name: "Eventseye Trade Shows Europe", url: "https://www.eventseye.com/fairs/z1_trade-shows_europe_1.html", desc: "Directory of trade shows and business events across Europe.", group: "visa", color: "#0EA5E9" },
    { name: "VFSBot", url: "https://github.com/hnavidan/VFSBot", desc: "Open-source bot that automates VFS Global visa appointment bookings.", group: "visa", color: "#6366F1" },
    { name: "Ecommerce Guide AI", url: "https://ecommerceguide.com/a/", desc: "Curated directory of AI tools for e-commerce.", group: "ai", color: "#10B981" },
    { name: "Meawfy", url: "https://meawfy.com/", desc: "AI-powered search engine with fast, summarized results.", group: "search", color: "#F59E0B" },
    { name: "Giggster", url: "https://giggster.com/#best", desc: "Book film, video and production locations & experiences.", group: "crowdfunding", color: "#8B5CF6" },
    { name: "Yelp", url: "https://www.yelp.com/", desc: "Local business reviews and advertising platform.", group: "crowdfunding", color: "#D32323" },
    { name: "BizBuySell", url: "https://www.bizbuysell.com/", desc: "Marketplace to buy or sell an existing business.", group: "crowdfunding", color: "#2563EB" },
    { name: "Wefunder", url: "https://wefunder.com/explore", desc: "Crowdfund into startups and small businesses.", group: "crowdfunding", color: "#10B981" },
    { name: "Google Ads", url: "https://ads.google.com/", desc: "Search, Display, Shopping and video campaigns.", group: "traffic", color: "#2563EB" },
    { name: "Microsoft Advertising", url: "https://ads.microsoft.com/", desc: "Bing search ads and the audience network.", group: "traffic", color: "#2563EB" },
    { name: "Baidu Ads", url: "https://ads.baidu.com/", desc: "China's dominant search advertising platform.", group: "traffic", color: "#2563EB" },
    { name: "Yandex Ads", url: "https://yandex.com/adv/", desc: "Search and display ads across Russia and the CIS.", group: "traffic", color: "#2563EB" },
    { name: "Apple Search Ads", url: "https://searchads.apple.com/", desc: "Promote your app inside the App Store.", group: "traffic", color: "#2563EB" },
    { name: "Yelp Ads", url: "https://business.yelp.com/advertise/", desc: "Local advertising for businesses on Yelp.", group: "traffic", color: "#2563EB" },
    { name: "LookSmart", url: "https://www.looksmart.com/", desc: "Paid search and directory-based advertising.", group: "traffic", color: "#2563EB" },
    { name: "Meta Ads", url: "https://www.facebook.com/business/ads", desc: "Meta's full Facebook ads manager suite.", group: "traffic", color: "#2563EB" },
    { name: "Google Video Ads", url: "https://ads.google.com/intl/en_us/home/campaigns/video-ads/", desc: "Video campaigns across YouTube and partners.", group: "traffic", color: "#2563EB" },
    { name: "LinkedIn Ads", url: "https://business.linkedin.com/marketing-solutions/ads", desc: "B2B targeting and sponsored content on LinkedIn.", group: "traffic", color: "#2563EB" },
    { name: "X Ads", url: "https://ads.x.com/", desc: "Advertising on X (Twitter).", group: "traffic", color: "#2563EB" },
    { name: "Instagram Ads", url: "https://www.facebook.com/business/instagram/advertising", desc: "Meta ads across Instagram feeds and stories.", group: "traffic", color: "#2563EB" },
    { name: "Pinterest Ads", url: "https://ads.pinterest.com/", desc: "Promote pins and product catalogs on Pinterest.", group: "traffic", color: "#2563EB" },
    { name: "Quora Ads", url: "https://www.quora.com/business", desc: "Reach people asking questions on Quora.", group: "traffic", color: "#2563EB" },
    { name: "Snapchat Ads", url: "https://forbusiness.snapchat.com/", desc: "AR, video and collection ads for young audiences.", group: "traffic", color: "#2563EB" },
    { name: "Reddit Ads", url: "https://ads.reddit.com/", desc: "Community-based advertising on Reddit.", group: "traffic", color: "#2563EB" },
    { name: "Spotify Ads", url: "https://ads.spotify.com/", desc: "Audio and video ads to music listeners.", group: "traffic", color: "#2563EB" },
    { name: "Tumblr Ads", url: "https://www.tumblr.com/business", desc: "Sponsored posting on Tumblr.", group: "traffic", color: "#2563EB" },
    { name: "Yahoo Advertising", url: "https://www.yahoo.com/advertising/", desc: "Display and native advertising network.", group: "traffic", color: "#2563EB" },
    { name: "Amazon Ads", url: "https://advertising.amazon.com/", desc: "Sponsored products and DSP across Amazon.", group: "traffic", color: "#2563EB" },
    { name: "eBay Advertising", url: "https://www.ebayadvertising.com/", desc: "Promoted listings on eBay.", group: "traffic", color: "#2563EB" },
    { name: "Roundel", url: "https://roundel.com/", desc: "Target's retail media network.", group: "traffic", color: "#2563EB" },
    { name: "Etsy Ads", url: "https://www.etsy.com/advertising", desc: "Onsite advertising for Etsy sellers.", group: "traffic", color: "#2563EB" },
    { name: "Yellow Pages Ads", url: "https://www.yellowpages.com/advertise", desc: "Local search advertising and listings.", group: "traffic", color: "#2563EB" },
    { name: "Pandora Ads", url: "https://advertising.pandora.com/", desc: "Audio advertising on the Pandora platform.", group: "traffic", color: "#2563EB" },
    { name: "Google Display Ads", url: "https://ads.google.com/home/campaigns/display-ads/", desc: "Banner and display ads across the web.", group: "traffic", color: "#2563EB" },
    { name: "BuySellAds", url: "https://www.buysellads.com/", desc: "Direct marketplace for buying ad placements.", group: "traffic", color: "#2563EB" },
    { name: "AdCash", url: "https://adcash.com/", desc: "Pop, push and native traffic network.", group: "traffic", color: "#2563EB" },
    { name: "AdMedia", url: "https://www.admedia.com/", desc: "Display ad monetization network.", group: "traffic", color: "#2563EB" },
    { name: "PropellerAds", url: "https://propellerads.com/", desc: "Push, pop-under and interstitial traffic.", group: "traffic", color: "#2563EB" },
    { name: "PropelMedia", url: "https://www.propelmedia.com/", desc: "Display and social traffic solutions.", group: "traffic", color: "#2563EB" },
    { name: "YesAdvertising", url: "https://www.yesadvertising.com/", desc: "Programmatic display and performance ads.", group: "traffic", color: "#2563EB" },
    { name: "Infolinks", url: "https://www.infolinks.com/", desc: "In-text monetization for publishers.", group: "traffic", color: "#2563EB" },
    { name: "SmartyAds", url: "https://smartyads.com/", desc: "Programmatic SSP and DSP advertising.", group: "traffic", color: "#2563EB" },
    { name: "CJ Affiliate", url: "https://www.cj.com/", desc: "Affiliate network for performance marketing.", group: "traffic", color: "#2563EB" },
    { name: "Nexxen", url: "https://www.nexxen.com/", desc: "CTV, video and data-driven advertising.", group: "traffic", color: "#2563EB" },
    { name: "Exponential", url: "https://exponential.com/", desc: "Display, native and rich media ad network.", group: "traffic", color: "#2563EB" },
    { name: "Sovrn", url: "https://www.sovrn.com/", desc: "Publisher monetization and ad tech.", group: "traffic", color: "#2563EB" },
    { name: "Vibrant Media", url: "https://www.vibrantmedia.com/", desc: "In-article and native contextual ads.", group: "traffic", color: "#2563EB" },
    { name: "AdMaven", url: "https://www.admaven.com/", desc: "Monetization with popunder and push traffic.", group: "traffic", color: "#2563EB" },
    { name: "Basis", url: "https://basis.com/", desc: "Zeta's omnichannel advertising platform.", group: "traffic", color: "#2563EB" },
    { name: "Midroll", url: "https://www.midroll.com/", desc: "Podcast advertising for listeners.", group: "traffic", color: "#2563EB" },
    { name: "Acast Ads", url: "https://advertise.acast.com/", desc: "Podcast advertising marketplace.", group: "traffic", color: "#2563EB" },
    { name: "Megaphone", url: "https://megaphone.fm/", desc: "Podcast hosting and advertising.", group: "traffic", color: "#2563EB" },
    { name: "Giant Media", url: "https://www.giantmedia.com/", desc: "Video distribution and native ads.", group: "traffic", color: "#2563EB" },
    { name: "Unruly", url: "https://unruly.co/", desc: "Emotion-driven video advertising.", group: "traffic", color: "#2563EB" },
    { name: "Chocolate Platform", url: "https://chocolateplatform.com/", desc: "SSP and publisher revenue platform.", group: "traffic", color: "#2563EB" },
    { name: "Outbrain", url: "https://www.outbrain.com/", desc: "Native content recommendation ads.", group: "traffic", color: "#2563EB" },
    { name: "Taboola", url: "https://www.taboola.com/", desc: "Native discovery advertising network.", group: "traffic", color: "#2563EB" },
    { name: "Revcontent", url: "https://www.revcontent.com/", desc: "Premium native content advertising.", group: "traffic", color: "#2563EB" },
    { name: "Content.ad", url: "https://www.content.ad/", desc: "Native content recommendation network.", group: "traffic", color: "#2563EB" },
    { name: "AdBlade", url: "https://www.adblade.com/", desc: "Native advertising network.", group: "traffic", color: "#2563EB" },
    { name: "Nativo", url: "https://www.nativo.com/", desc: "Native content and creative ads.", group: "traffic", color: "#2563EB" },
    { name: "LockerDome", url: "https://lockerdome.com/", desc: "Audience and content advertising.", group: "traffic", color: "#2563EB" },
    { name: "dntx", url: "https://www.dntx.com/", desc: "Digital demand and inventory solutions.", group: "traffic", color: "#2563EB" },
    { name: "Zeropark", url: "https://zeropark.com/", desc: "Search, pop and push ad marketplace.", group: "traffic", color: "#2563EB" },
    { name: "PopAds", url: "https://www.popads.net/", desc: "Self-serve popunder ad network.", group: "traffic", color: "#2563EB" },
    { name: "PopCash", url: "https://popcash.net/", desc: "Popunder and display ad network.", group: "traffic", color: "#2563EB" },
    { name: "PopUnderTotal", url: "https://www.popundertotal.com/", desc: "Popunder traffic ad network.", group: "traffic", color: "#2563EB" },
    { name: "Perfect Audience", url: "https://www.perfectaudience.com/", desc: "Retargeting platform for small business.", group: "traffic", color: "#2563EB" },
    { name: "AdRoll", url: "https://www.adroll.com/", desc: "Retargeting and performance advertising.", group: "traffic", color: "#2563EB" },
    { name: "Retargeter", url: "https://retargeter.com/", desc: "Display retargeting campaigns.", group: "traffic", color: "#2563EB" },
    { name: "InMobi", url: "https://www.inmobi.com/", desc: "Mobile-first ad network and exchange.", group: "traffic", color: "#2563EB" },
    { name: "Cidewalk", url: "https://www.cidewalk.com/", desc: "Local advertising marketplace.", group: "traffic", color: "#2563EB" },
    { name: "Airpush", url: "https://www.airpush.com/", desc: "Mobile app advertising network.", group: "traffic", color: "#2563EB" },
    { name: "BuzzCity", url: "https://www.buzzcity.com/", desc: "Mobile ads for emerging markets.", group: "traffic", color: "#2563EB" },
    { name: "Go2Mobi", url: "https://www.go2mobi.com/", desc: "Mobile performance ad network.", group: "traffic", color: "#2563EB" },
    { name: "Tapjoy", url: "https://www.tapjoy.com/", desc: "Rewarded mobile ads for apps.", group: "traffic", color: "#2563EB" },
    { name: "LeadBolt", url: "https://www.leadbolt.com/", desc: "Mobile direct-response advertising.", group: "traffic", color: "#2563EB" },
    { name: "AdModa", url: "https://www.admoda.com/", desc: "Mobile ad monetization network.", group: "traffic", color: "#2563EB" },
    { name: "Geekflare Digital Marketing", url: "https://geekflare.com/topic/digital-marketing/", desc: "Digital marketing guides, tools and growth tactics.", group: "blog", color: "#0EA5E9" },
    { name: "Api2Cart", url: "https://api2cart.com/", desc: "Unified e-commerce data API — connect 80+ platforms.", group: "scraping", color: "#22C55E" },
    { name: "Apify Pricing", url: "https://apify.com/pricing", desc: "Cloud web scraping & automation platform pricing.", group: "scraping", color: "#22C55E" },
    { name: "Bright Data", url: "https://brightdata.com/", desc: "Web data platform — proxies, scraping browser, datasets.", group: "scraping", color: "#22C55E" },
    { name: "Oxylabs", url: "https://oxylabs.io/", desc: "Premium proxies and real-time web scrapers.", group: "scraping", color: "#22C55E" },
    { name: "e-Scraper", url: "https://e-scraper.com/", desc: "Ready-made web scraping API for popular sites.", group: "scraping", color: "#22C55E" },
    { name: "DataList — Scrape Facebook/LinkedIn", url: "https://www.datablist.com/how-to/scrape-facebook-group-members-linkedin", desc: "Guide to scrape Facebook group members and LinkedIn.", group: "scraping", color: "#22C55E" },
    { name: "GitHub — Etsy repos", url: "https://github.com/search?q=etsy&type=repositories&p=3", desc: "GitHub search for Etsy-related repositories and scrapers.", group: "scraping", color: "#22C55E" },
    { name: "Courses — Drive Folder", url: "https://drive.google.com/drive/u/1/folders/1CV3fz-3l0xqLAJFYwme2l4ixNOnFKncN", desc: "Shared Google Drive folder with courses.", group: "courses", color: "#F59E0B" },
    { name: "Creative Fabrica", url: "https://www.creativefabrica.com/content/", desc: "Design assets, fonts, crafts and digital downloads.", group: "digital", color: "#7C3AED" },
    { name: "Design Bundles", url: "https://designbundles.net/", desc: "Design bundles — fonts, graphics, crafts at a discount.", group: "digital", color: "#7C3AED" },
    { name: "TemplateMonster", url: "https://www.templatemonster.com", desc: "Website templates, themes and digital assets.", group: "digital", color: "#7C3AED" },
    { name: "Gridfiti", url: "https://gridfiti.com/", desc: "Digital desktop inspiration — wallpapers, templates, resources.", group: "digital", color: "#7C3AED" },
    { name: "Creative Market", url: "https://creativemarket.com/", desc: "Marketplace for fonts, templates and design assets.", group: "digital", color: "#7C3AED" },
    { name: "OnPlanners", url: "https://onplanners.com/", desc: "Planner templates — printable and digital planners.", group: "digital", color: "#7C3AED" },
    { name: "Plati Market", url: "https://plati.market/?lang=en-US", desc: "Global digital goods marketplace.", group: "digital", color: "#7C3AED" },
    { name: "ElectronicFirst", url: "https://www.electronicfirst.com/", desc: "Digital products and electronic goods store.", group: "digital", color: "#7C3AED" },
    { name: "GameSatis", url: "https://www.gamesatis.com/", desc: "Digital game keys marketplace.", group: "digital", color: "#7C3AED" },
    { name: "Klasgame", url: "https://www.klasgame.com/", desc: "Game keys and digital goods store.", group: "digital", color: "#7C3AED" },
    { name: "Oyun Alışverişi", url: "https://www.oyunalisveris.com/", desc: "Turkish digital game key marketplace.", group: "digital", color: "#7C3AED" },
    { name: "KabaSakal Online", url: "https://kabasakalonline.com/tr", desc: "Digital game and software keys store (TR).", group: "digital", color: "#7C3AED" },
    { name: "ItemHesap", url: "https://www.itemhesap.com/", desc: "Digital accounts and game keys marketplace.", group: "digital", color: "#7C3AED" },
    { name: "OyunOne", url: "https://www.oyunone.com/", desc: "Turkish digital games and keys store.", group: "digital", color: "#7C3AED" },
    { name: "MTCGame", url: "https://www.mtcgame.com/", desc: "Game keys and digital products store.", group: "digital", color: "#7C3AED" },
    { name: "Eneba", url: "https://www.eneba.com/", desc: "Gaming marketplace — buy game keys at a discount.", group: "digital", color: "#7C3AED" },
    { name: "ItemSatis CD Keys", url: "https://www.itemsatis.com/cd-keys.html", desc: "CD keys and game codes marketplace.", group: "digital", color: "#7C3AED" },
    { name: "Avito — Envato Elements", url: "https://www.avito.ru/all?q=envato+elements", desc: "Avito search for envato elements listings.", group: "digital", color: "#7C3AED" },
    { name: "Wyrel", url: "https://wyrel.com/en/", desc: "Digital products store — games, keys, accounts.", group: "digital", color: "#7C3AED" },
    { name: "GameCone", url: "https://gamecone.net/", desc: "Digital game keys store.", group: "digital", color: "#7C3AED" },
    { name: "WMCentre", url: "https://wmcentre.net/", desc: "Digital keys and codes marketplace.", group: "digital", color: "#7C3AED" },
    { name: "GGSel", url: "https://ggsel.net/", desc: "Digital goods market for games, keys and services.", group: "digital", color: "#7C3AED" },
    { name: "U2XU", url: "https://www.u2xu.com/", desc: "Digital products and game keys marketplace.", group: "digital", color: "#7C3AED" },
    { name: "VK Crochet Wall", url: "https://m.vk.ru/wall470830127?reactions_opened=wall470830127_7270", desc: "VK wall post with crochet content.", group: "crochet", color: "#F472B6" },
    { name: "CanadaHun Crochet Topic", url: "https://canadahun.com/temak/k%C3%B6t%C3%A9s-horgol%C3%A1s-2024-janu%C3%A1r-05-t%C5%91l.63101/page-434", desc: "Crochet & knitting forum topic (HU).", group: "crochet", color: "#F472B6" },
    { name: "Folksy", url: "https://folksy.com/", desc: "Handmade marketplace — crafts, crochet and gifts.", group: "crochet", color: "#F472B6" },
    { name: "Kruchcom", url: "https://kruchcom.ru/archives/22259", desc: "Russian crochet blog with patterns.", group: "crochet", color: "#F472B6" },
    { name: "Dzen Amigurumi", url: "https://dzen.ru/a/ZQK0-aweEgreNYGA", desc: "Dzen article on amigurumi crochet.", group: "crochet", color: "#F472B6" },
    { name: "Crazypatterns", url: "https://www.crazypatterns.net/de/", desc: "Free crochet and knitting patterns (DE).", group: "crochet", color: "#F472B6" },
    { name: "Hackujemesdione", url: "https://www.hackujemesdione.cz/navody-velikonoce/", desc: "Czech DIY patterns — Easter crochet.", group: "crochet", color: "#F472B6" },
    { name: "Slivmk Amigurumi", url: "https://s1.slivmk.pro/product-tag/amigurumi/", desc: "Amigurumi product tag on slivmk.pro.", group: "crochet", color: "#F472B6" },
    { name: "Tumblr Sewing Pattern", url: "https://www.tumblr.com/tagged/sewing%20pattern", desc: "Tumblr tag — sewing patterns.", group: "crochet", color: "#F472B6" },
    { name: "Vinted Brendahof", url: "https://www.vinted.nl/member/89656824-brendahof", desc: "Vinted profile with handmade items.", group: "crochet", color: "#F472B6" },
    { name: "Babia.to", url: "https://babia.to/", desc: "Forum for courses, scripts and shared resources.", group: "forums", color: "#3B82F6" },
    { name: "HacksNation", url: "https://hacksnation.com/", desc: "Forum with tools, scripts and hacking resources.", group: "forums", color: "#3B82F6" },
    { name: "EDollarEarn", url: "https://edollarearn.to/", desc: "Earning and SEO forum — guides and methods.", group: "forums", color: "#3B82F6" },
    { name: "BlackHatProtools", url: "https://blackhatprotools.info/forum.php?s=cf0bc740257534f0265e8a5e6658d5b3", desc: "Black hat SEO tools and resource forum.", group: "forums", color: "#3B82F6" },
    { name: "BHW — Cheap Traffic Sources", url: "https://blackhatworld.com/seo/super-insanely-cheap-traffic-sources-learn-where-to-buy-traffic-for-as-low-as-0-01-per-1-000-visitors.1313989/", desc: "BlackHatWorld thread on super cheap traffic ($0.01 per 1k visitors).", group: "forums", color: "#3B82F6" },
    { name: "Patched.to", url: "https://patched.to/", desc: "Forum for tools, scripts and cracked resources.", group: "forums", color: "#3B82F6" },
    { name: "TechEnclave", url: "https://techenclave.com/categories", desc: "Indian tech forum — categories, deals and discussion.", group: "forums", color: "#3B82F6" },
    { name: "Digital Point Marketplace", url: "https://marketplace.digitalpoint.com/designs.26/category", desc: "Digital Point marketplace — designs and services.", group: "forums", color: "#3B82F6" },
    { name: "Warrior Forum — Digital Products", url: "https://www.warriorforum.com/search/digital%20product", desc: "Warrior Forum search results for digital products.", group: "forums", color: "#3B82F6" },
    { name: "vc.ru Marketing", url: "https://vc.ru/marketing", desc: "Russian business and marketing publication.", group: "forums", color: "#3B82F6" },
    { name: "Crozdesk Marketing", url: "https://crozdesk.com/marketing", desc: "Software comparison and discovery hub — marketing tools.", group: "app", color: "#06B6D4" },
    { name: "Slant — Linux", url: "https://www.slant.co/tags/linux", desc: "Community-ranked Linux software recommendations.", group: "app", color: "#06B6D4" },
    { name: "Geekflare — SMS Marketing Software", url: "https://geekflare.com/software/best-sms-marketing-software/", desc: "Best SMS marketing software comparisons and reviews.", group: "app", color: "#06B6D4" },
    { name: "ShareTool Ads Spy", url: "https://sharetool.net/ads-spy/", desc: "Shared SEO and ad spy tools at group-buy pricing.", group: "seo", color: "#14B8A6" },
    { name: "Oxaam", url: "https://www.oxaam.com/index.php", desc: "Group buy platform for premium SEO tools.", group: "seo", color: "#14B8A6" },
    { name: "GroupBuySEOTools", url: "https://www.groupbuyseotools.org/", desc: "Group buy access to premium SEO tools.", group: "seo", color: "#14B8A6" },
    { name: "ToolsZap — Spy Tools", url: "https://toolszap.info/tools/spy-tools-ads/", desc: "Ad spy and competitor research tools directory.", group: "seo", color: "#14B8A6" },
    { name: "NoxTools", url: "https://noxtools.com/", desc: "Noxtools — online SEO utilities and tools.", group: "seo", color: "#14B8A6" },
    { name: "ToolzBuy", url: "https://toolzbuy.com/", desc: "Group buy SEO tools marketplace.", group: "seo", color: "#14B8A6" },
    { name: "SpyBox Tools", url: "https://spybox.io/tools", desc: "Ad spy and competitor research tools.", group: "seo", color: "#14B8A6" },
    { name: "Template.net — Google Sheets", url: "https://www.template.net/editable/google-sheets", desc: "Editable Google Sheets template library.", group: "sheets", color: "#22C55E" },
    { name: "Sheets Templates — Drive Folder", url: "https://drive.google.com/drive/u/0/folders/1joG5itFEUSvQfhul0zjT9fO4j_TJwbRi", desc: "Shared Google Drive folder with spreadsheet templates.", group: "sheets", color: "#22C55E" },
    { name: "Two Minute Reports — E-commerce Sheets", url: "https://twominutereports.com/templates/e-commerce-google-sheets", desc: "E-commerce Google Sheets templates.", group: "sheets", color: "#22C55E" },
    { name: "Pikbest — Excel E-commerce", url: "https://pikbest.com/free-excel/e-commerce.html", desc: "Free Excel and e-commerce spreadsheet templates.", group: "sheets", color: "#22C55E" },
    { name: "Airwallex", url: "https://www.airwallex.com/global/business-account", desc: "Global business accounts, FX and payments.", group: "payments", color: "#003087" },
    { name: "Emburse Cards", url: "https://www.emburse.com/products/emburse-cards", desc: "Corporate cards and expense management.", group: "payments", color: "#003087" },
    { name: "Extend", url: "https://www.paywithextend.com/platform-overview", desc: "Virtual card issuance for any payment system.", group: "payments", color: "#003087" },
    { name: "SumUp Banking", url: "https://www.sumup.com/en-us/banking/", desc: "Business bank accounts for merchants.", group: "payments", color: "#003087" },
    { name: "Monito", url: "https://www.monito.com/", desc: "Compare international money transfer fees.", group: "payments", color: "#003087" },
    { name: "Invoice Ninja Payments", url: "https://invoiceninja.com/payments/", desc: "Online invoicing and payment processing.", group: "payments", color: "#003087" },
    { name: "HitPay", url: "https://hitpayapp.com/", desc: "Payment gateway for small businesses (SG).", group: "payments", color: "#003087" },
    { name: "Checkout.com", url: "https://www.checkout.com/", desc: "Global payment processing platform.", group: "payments", color: "#003087" },
    { name: "Braintree", url: "https://www.paypal.com/us/braintree", desc: "PayPal's full-stack payment platform.", group: "payments", color: "#003087" },
    { name: "Authorize.Net", url: "https://www.authorize.net/", desc: "Payment gateway for online merchants.", group: "payments", color: "#003087" },
    { name: "PayFast", url: "https://payfast.io/", desc: "South African online payment gateway.", group: "payments", color: "#003087" },
    { name: "Mollie", url: "https://www.mollie.com/", desc: "European payment gateway for online payments.", group: "payments", color: "#003087" },
    { name: "Square", url: "https://squareup.com/us/en", desc: "Payments, banking and POS for business.", group: "payments", color: "#003087" },
    { name: "eWay", url: "https://eway.io/", desc: "Australian payment gateway.", group: "payments", color: "#003087" },
    { name: "Razorpay", url: "https://razorpay.com/", desc: "Indian payment gateway and banking suite.", group: "payments", color: "#003087" },
    { name: "Adyen Pricing", url: "https://www.adyen.com/pricing", desc: "Global payments platform pricing.", group: "payments", color: "#003087" },
    { name: "2Checkout (Verifone)", url: "https://www.2checkout.com/products/2monetize/", desc: "Global merchant account and payment platform.", group: "payments", color: "#003087" },
    { name: "Payoneer", url: "https://www.payoneer.com/ar/", desc: "Cross-border payments for freelancers and sellers.", group: "payments", color: "#003087" },
    { name: "Paddle", url: "https://www.paddle.com/", desc: "Merchant of record for software sales.", group: "payments", color: "#003087" },
    { name: "Coinbase", url: "https://www.coinbase.com/", desc: "Crypto exchange and payments.", group: "payments", color: "#003087" },
    { name: "Paysend", url: "https://paysend.com/", desc: "International money transfer and cards.", group: "payments", color: "#003087" },
    { name: "PayPlus", url: "https://payplus.co.il/en", desc: "Israeli payment gateway.", group: "payments", color: "#003087" },
    { name: "DoDropshipping — Beginners", url: "https://dodropshipping.com/category/dropshipping/dropshipping-for-beginners/", desc: "Dropshipping guides and beginner tutorials.", group: "blogs", color: "#F59E0B" },
    { name: "Geekflare", url: "https://geekflare.com/", desc: "Tech, marketing and business guides and reviews.", group: "blogs", color: "#F59E0B" },
    { name: "Ecommerce Fastlane Podcast", url: "https://ecommercefastlane.com/podcast/#", desc: "E-commerce growth podcast and resources.", group: "blogs", color: "#F59E0B" },
    { name: "Whop Blog — Digital Products", url: "https://whop.com/blog/best-digital-products-to-sell/#3-ebooks", desc: "Best digital products to sell — ideas and guides.", group: "blogs", color: "#F59E0B" },
    { name: "Xperiencify Blog", url: "https://xperiencify.com/blog/", desc: "Online course platform blog and guides.", group: "blogs", color: "#F59E0B" },
    { name: "DailyRazor Blog", url: "https://www.dailyrazor.com/blog/", desc: "Business, marketing and tech articles.", group: "blogs", color: "#F59E0B" },
    { name: "Hootsuite Blog — Facebook Ads", url: "https://blog.hootsuite.com/?s=Facebook+ads&topics%5B%5D=ai", desc: "Social media marketing and Facebook ads articles.", group: "blogs", color: "#F59E0B" },
    { name: "HubSpot Blog", url: "https://blog.hubspot.com/", desc: "Marketing, sales and growth content.", group: "blogs", color: "#F59E0B" },
    { name: "Ippei Blog", url: "https://ippei.com/blog/", desc: "SEO and content marketing case studies.", group: "blogs", color: "#F59E0B" },
    { name: "Gelato Blog — Business", url: "https://www.gelato.com/blog/business", desc: "Print-on-demand business insights.", group: "blogs", color: "#F59E0B" },
    { name: "CPA.rip — Push Networks", url: "https://cpa.rip/networks/push/", desc: "CPA networks and push traffic resources.", group: "blogs", color: "#F59E0B" },
    { name: "CIFNews — Facebook", url: "https://www.cifnews.com/search?keyword=facebook", desc: "Cross-border e-commerce news search (Facebook).", group: "blogs", color: "#F59E0B" },
    { name: "LearnWorlds Blog", url: "https://www.learnworlds.com/blog/", desc: "Online course creation and edtech articles.", group: "blogs", color: "#F59E0B" },
    { name: "LinkedIn — Scale FB Ads", url: "https://www.linkedin.com/pulse/how-scale-your-facebook-ad-campaigns-without-ruining-salif-sibane/", desc: "Article on scaling Facebook ad campaigns.", group: "blogs", color: "#F59E0B" },
    { name: "BigSpy Blog", url: "https://bigspy.com/blog", desc: "Ad spy tool blog — tips and updates.", group: "blogs", color: "#F59E0B" },
    { name: "MegaDigital Blog", url: "https://megadigital.ai/en/blog/facebook-advertising/", desc: "Facebook advertising guides and strategies.", group: "blogs", color: "#F59E0B" },
    { name: "DoDropshipping — Etsy Research", url: "https://dodropshipping.com/product-research-on-etsy/", desc: "Etsy product research guide.", group: "blogs", color: "#F59E0B" },
    { name: "AliDropship Forum — Digital Products", url: "https://forum.alidropship.com/search/3333985/?q=DIGITAL+PRODUCT&o=date", desc: "AliDropship forum search — digital product threads.", group: "dbase", color: "#64748B" },
    { name: "Cracking.org — EcommerceGo Leak", url: "https://cracking.org/threads/leak-ecommercego-3-0-saas-ecommerce-store-with-multi-theme-and-multi-store.272722/#post-2390419", desc: "Forum thread — leaked e-commerce SaaS platform.", group: "dbase", color: "#64748B" },
    { name: "CrackingX Forums", url: "https://crackingx.com/forums/5/", desc: "CrackingX forums — tools and resources.", group: "dbase", color: "#64748B" },
    { name: "bt4g Magnet", url: "https://bt4gprx.com/magnet/C9IJTv5F041MOTKhtL1PF6baNRvCfMSWA", desc: "bt4g proxy — magnet link.", group: "dbase", color: "#64748B" },
    { name: "PrivateLoader — Facebook Leak Thread", url: "https://privateloader.forumeiros.com/t431-repost-facebook-533-million-leak-facebook-user-infofiledot-to-free-download", desc: "PrivateLoader forum thread — index of leaked data.", group: "dbase", color: "#64748B" },
    { name: "Sinister.ly", url: "https://sinister.ly/index.php", desc: "Hacking and community forum.", group: "dbase", color: "#64748B" },
    { name: "SEOPirat Club", url: "https://seopirat.club/", desc: "SEO tools and resources community.", group: "dbase", color: "#64748B" },
    { name: "HardForum", url: "https://hardforum.com/", desc: "Tech hardware discussion forum.", group: "dbase", color: "#64748B" },
    { name: "Leaks Community — SQL", url: "https://leaks-community.forumactif.com/f16-sql", desc: "Leaks community — SQL section.", group: "dbase", color: "#64748B" },
    { name: "CrackingX", url: "https://crackingx.com/", desc: "CrackingX — tools and cracked resources.", group: "dbase", color: "#64748B" },
    { name: "Toolify — Free AI Image Tools", url: "https://www.toolify.ai/free-ai-tools/image-generation-editing", desc: "Free AI image generation and editing tools.", group: "videoai", color: "#A855F7" },
    { name: "Google Labs Flow", url: "https://labs.google/fx/ar/tools/flow?from=whisk", desc: "Google Labs Flow — AI image and video experiments.", group: "videoai", color: "#A855F7" },
    { name: "Flora AI", url: "https://app.flora.ai/home", desc: "Flora — AI image generation app.", group: "videoai", color: "#A855F7" },
    { name: "DreamFace", url: "https://www.dreamfaceapp.com/", desc: "DreamFace — AI face animation app.", group: "videoai", color: "#A855F7" },
    { name: "Google AI Studio — Prompt", url: "https://aistudio.google.com/prompts/10rBv06EFxRYujWAtHAcYZa4ZhJus681T", desc: "Shared Google AI Studio prompt link.", group: "videoai", color: "#A855F7" },
    { name: "PST", url: "https://pst.net/", desc: "PST — prepaid and virtual card issuer.", group: "cards", color: "#0EA5E9" },
    { name: "Wallester Business", url: "https://wallester.com/business", desc: "BIN sponsorship and card issuance for business.", group: "cards", color: "#0EA5E9" },
    { name: "Moss", url: "https://www.getmoss.com/", desc: "Corporate cards and spend management.", group: "cards", color: "#0EA5E9" },
    { name: "Paylocity Corporate Cards", url: "https://www.paylocity.com/products/finance/corporate-cards/", desc: "Employee spend and corporate cards.", group: "cards", color: "#0EA5E9" },
    { name: "Combo Cards", url: "https://combo.cards/", desc: "Corporate cards for teams.", group: "cards", color: "#0EA5E9" },
    { name: "Pleo Virtual Cards", url: "https://www.pleo.io/en/virtual-cards", desc: "Smart company spend and virtual cards.", group: "cards", color: "#0EA5E9" },
    { name: "Mesh Cards", url: "https://meshpayments.com/cards/", desc: "Corporate cards and payment solutions.", group: "cards", color: "#0EA5E9" },
    { name: "Karta", url: "https://karta.io/", desc: "Corporate cards and expense management.", group: "cards", color: "#0EA5E9" },
    { name: "4x4", url: "https://4x4.io/", desc: "Corporate card platform.", group: "cards", color: "#0EA5E9" },
    { name: "CPA.rip — Bank Cards", url: "https://cpa.rip/finance/bank-cards/", desc: "CPA.rip bank and card finance resources.", group: "cards", color: "#0EA5E9" },
    { name: "Func Cards", url: "https://funccards.com/", desc: "Multi-currency virtual cards.", group: "cards", color: "#0EA5E9" },
    { name: "Getsby", url: "https://getsby.com/en/", desc: "Prepaid multi-currency cards.", group: "cards", color: "#0EA5E9" },
    { name: "JoinSecret — Marketing Software", url: "https://www.joinsecret.com/categories/marketing-software/advertising", desc: "Marketing software categories, comparisons and deals.", group: "tools", color: "#F97316" },
    { name: "Hugging Face", url: "https://huggingface.co/", desc: "AI models, datasets and ML community hub.", group: "ai", color: "#10B981" },
    { name: "AITop100", url: "https://www.aitop100.cn/infomation/", desc: "Top 100 AI tools ranking (CN).", group: "ai", color: "#10B981" },
    { name: "CPALenta — Facebook Ads", url: "https://cpalenta.ru/?s=Facebook+ads", desc: "Russian CPA blog search — Facebook ads.", group: "blogs", color: "#F59E0B" },
    { name: "WordStream Blog — Facebook Ads", url: "https://www.wordstream.com/blog/ws/category/facebook-ads", desc: "PPC and Facebook ads articles.", group: "blogs", color: "#F59E0B" },
    { name: "Dzen — Facebook Ads", url: "https://dzen.ru/search?query=facebook%20ads", desc: "Dzen search for Facebook ads articles.", group: "blogs", color: "#F59E0B" },
    { name: "BIR Blog — FB Ads Reporting", url: "https://bir.ch/blog/facebook-ads-reporting-tools", desc: "Facebook ads reporting tools roundup.", group: "blogs", color: "#F59E0B" },
    { name: "Neil Patel Blog", url: "https://neilpatel.com/blog/", desc: "SEO, content and growth marketing blog.", group: "blogs", color: "#F59E0B" },
    { name: "Jon Loomer Blog", url: "https://www.jonloomer.com/blog/", desc: "Facebook advertising deep-dive blog.", group: "blogs", color: "#F59E0B" },
    { name: "Yandex Market", url: "https://market.yandex.ru/", desc: "Russian e-commerce marketplace.", group: "market", color: "#F59E0B" },
    { name: "Merkandi ES", url: "https://merkandi.com/products/country/es?page=6", desc: "Wholesale B2B marketplace — Spain listings.", group: "market", color: "#F59E0B" },
    { name: "Europages", url: "https://www.europages.co.uk/", desc: "European B2B company directory.", group: "market", color: "#F59E0B" },
    { name: "Umbrex — Marketing KPIs", url: "https://umbrex.com/resources/key-performance-indicators/marketing-key-performance-indicators/", desc: "Marketing KPI reference library.", group: "market", color: "#F59E0B" },
    { name: "Etsy", url: "https://www.etsy.com/", desc: "Marketplace for handmade, vintage and digital.", group: "market", color: "#F59E0B" },
    { name: "VK Market", url: "https://vk.ru/market", desc: "VK marketplace social commerce.", group: "market", color: "#F59E0B" },
    { name: "UpCounsel — LLC Tax Rates", url: "https://www.upcounsel.com/llc-tax-rates-by-state", desc: "LLC tax rates by state reference.", group: "llc", color: "#10B981" },
    { name: "iPostal1 Login", url: "https://my.ipostal1.com/login", desc: "Virtual mailing address login.", group: "llc", color: "#10B981" },
    { name: "Bizee Dashboard", url: "https://orders.bizee.com/dashboard/login", desc: "Bizee (LLC filing) dashboard login.", group: "llc", color: "#10B981" },
    { name: "Sonetel App", url: "https://app.sonetel.com/login", desc: "Virtual phone numbers app login.", group: "llc", color: "#10B981" },
    { name: "GetSMSCode", url: "https://www.getsmscode.com/", desc: "Receive SMS verification codes.", group: "fbagency", color: "#1877F2" },
    { name: "Luban — Blue Media", url: "https://luban.bluemediagroup.cn/user/login", desc: "Blue Media Luban — agency login.", group: "fbagency", color: "#1877F2" },
    { name: "AIPrice", url: "https://www.aiprice.com/", desc: "AI-powered product price comparison.", group: "sourcing", color: "#FF6A00" },
    { name: "Superbuy — Freight Calculator", url: "https://www.superbuy.com/en/page/query/freight/?tabIndex=0&areaId=83072&length=15&width=10&height=20&warehouseId=1&weight=1000&limitIds=24&priceSort=0&productType=1&productType=2&productType=3&productType=4&productType=5&productType=6&taxMark=0&deliveryPeriod=0&packMethod=1&packMethod=2&packMethod=3", desc: "Superbuy freight/shipping cost calculator.", group: "sourcing", color: "#FF6A00" },
    { name: "Google Trends", url: "https://trends.google.com/trends", desc: "Search interest over time.", group: "trend", color: "#EF4444" },
    { name: "Pinterest Trends — Planners", url: "https://trends.pinterest.com/detail/?terms=digital%20planner%2Bgoodnotes%20planner%20template%2Bgoodnotes&dateRange=365D", desc: "Pinterest trend detail — planners/templates.", group: "trend", color: "#EF4444" },
    { name: "Google Keyword Planner", url: "https://ads.google.com/aw/keywordplanner/ideas/new", desc: "Google Ads keyword planner ideas.", group: "trend", color: "#EF4444" },
    { name: "BuiltWith — Shopify Palo Alto", url: "https://trends.builtwith.com/websitelist/Shopify-Palo-Alto-Theme", desc: "Websites built with the Shopify Palo Alto theme.", group: "spy", color: "#6366F1" },
    { name: "DSM Tool Blog — Free Dropshipping Tools", url: "https://blog.dsmtool.com/dropshipping/free-dropshipping-tools-and-extensions/", desc: "Free dropshipping tools and extensions.", group: "spy", color: "#6366F1" },
    { name: "VieSearch Shopping", url: "https://viesearch.com/shopping/clothing_and_shoes/accessories", desc: "Shopping site directory — accessories.", group: "spy", color: "#6366F1" },
    { name: "Bilibili", url: "https://www.bilibili.com/", desc: "Chinese video platform.", group: "spy", color: "#6366F1" },
    { name: "Foreplay", url: "https://www.foreplay.co/?via=welcome", desc: "Ad library and creative intelligence.", group: "spy", color: "#6366F1" },
    { name: "Accio", url: "https://www.accio.com/?src=p_GoogleSearch_web", desc: "AI-powered sourcing and product search.", group: "spy", color: "#6366F1" },
    { name: "MyIP.ms", url: "https://myip.ms/", desc: "IP and website info lookup.", group: "spy", color: "#6366F1" },
    { name: "PicClick — Scanner Listing", url: "https://picclick.fr/3M-CR100-Document-Passport-Reader-Scanner-MRZ-MRTD-133166952939.html", desc: "PicClick price comparator — scanner listing.", group: "spy", color: "#6366F1" },
    { name: "EMarketingHacks — Keyword Tools", url: "https://emarketinghacks.com/best-keyword-research-tools/", desc: "Best keyword research tools roundup.", group: "seo", color: "#14B8A6" },
    { name: "EEFF — Clothing Forum", url: "https://www.eeff.net/forum.php?cat_id=307&fid=364", desc: "Clothing patterns and forum.", group: "clothing", color: "#EC4899" },
    { name: "MiQibu Thread", url: "https://www.miqibu.com/thread-483-1-1.html", desc: "Clothing pattern thread.", group: "clothing", color: "#EC4899" },
    { name: "MungFali — Clothing Post", url: "https://mungfali.com/post/872C2109E3578EC7D9A6877DB54F69A14328CD01/254461D6321F5C22E6AB9910148FB75B46BF5FFE", desc: "Image/site aggregator — clothing post.", group: "clothing", color: "#EC4899" },
    { name: "Frills and Flares Blog", url: "https://frillsandflares.blogspot.com/p/blog-page.html", desc: "Sewing and pattern blog.", group: "clothing", color: "#EC4899" },
    { name: "Reddit — r/freepatterns", url: "https://www.reddit.com/r/freepatterns/", desc: "Free sewing pattern community.", group: "clothing", color: "#EC4899" },
    { name: "Book118 — A4 Patterns", url: "https://max.book118.com/search.html?q=a4%E7%94%B5%E5%AD%90%E7%89%88%E7%94%B7%E5%A5%B3%E7%BA%B8%E6%A0%B7%E5%B0%8F%E8%A5%BF%E6%9C%8D", desc: "A4 digital clothing pattern search.", group: "clothing", color: "#EC4899" },
    { name: "Sewing Layla Seel", url: "https://linktr.ee/sewinglaylaseel", desc: "Linktree — sewing patterns hub.", group: "clothing", color: "#EC4899" },
    { name: "Abzala — Backpack Pattern", url: "https://abzala.com/en/files/free-patterns/bags/free-backpack-pattern-from-treehouseleather-hm", desc: "Free leather backpack pattern.", group: "clothing", color: "#EC4899" },
    { name: "LivePlan — Sample Business Plans", url: "https://www.liveplan.com/sample-business-plans?ref=bplans", desc: "Sample business plans library.", group: "niches", color: "#14B8A6" },
    { name: "Magnific — Sewing Template", url: "https://www.magnific.com/search?format=search&last_filter=query&last_value=Product+sewing+template&query=Product+sewing+template", desc: "Magnific AI search — sewing template inspiration.", group: "inspiration", color: "#FACC15" },
  ];

  const S = { items: [], active: "all", q: "" };

  function normalize(url) {
    let u = String(url || "").trim();
    if (!u) return "";
    if (/^(\/|\.\/|\.\.\/)/.test(u) || /\.html?($|[?#])/i.test(u)) return u;
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    return u;
  }
  function hostOf(url) {
    try { return new URL(normalize(url)).hostname.replace(/^www\./, ""); }
    catch (e) { return String(url).replace(/^https?:\/\//, "").split("/")[0]; }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) { const d = JSON.parse(raw); if (Array.isArray(d)) {
        S.items = d;
        // migrate: the Facebook Ads Manager card now opens the local fb-ads22.html tool
        let migrated = false;
        S.items.forEach((i) => {
          if (i && i.url && normalize(i.url) === "https://www.facebook.com/adsmanager") {
            i.url = "fb-ads22.html";
            migrated = true;
          }
        });
        // merge any missing default sites (newly added folders) without touching the rest
        const have = new Set(S.items.map((i) => normalize(i.url)));
        const missing = DEFAULT_ITEMS.filter((x) => !have.has(normalize(x.url)));
        if (missing.length) {
          S.items = S.items.concat(missing.map((x) => Object.assign({}, x, { id: uid() })));
          migrated = true;
        }
        if (migrated) persist();
        return;
      } }
    } catch (e) {}
    S.items = DEFAULT_ITEMS.map((x) => Object.assign({}, x, { id: uid() }));
    persist();
  }
  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify(S.items)); } catch (e) {}
    const st = document.getElementById("lt-state");
    if (st) st.textContent = S.items.length + " sites · saved locally";
  }

  function groupLabel(gid) { const g = GROUPS.find((x) => x.id === gid); return g ? g.label : (gid || "Other"); }
  function groupIcon(gid) { const g = GROUPS.find((x) => x.id === gid); return g ? g.icon : "folder" }

  /* ---------------- shell ---------------- */
  function renderShell() {
    const view = $("#lt-app");
    if (!view) return;
    const groups = GROUPS.filter((g) => S.items.some((i) => i.group === g.id) || g.id !== "shop");
    const sidebar = `
      <div class="eat-side-lbl">Folders</div>
      <div class="lt-search">${ic("search", 13)}<input id="lt-q" type="search" placeholder="Search sites…" value="${esc(S.q)}"></div>
      <button class="lt-group${S.active === "all" ? " active" : ""}" data-group="all">${ic("layout-grid", 15)} <span>All sites</span><span class="cnt">${S.items.length}</span></button>
      ${groups.map((g) => `<button class="lt-group${S.active === g.id ? " active" : ""}" data-group="${g.id}">${ic(g.icon, 15)} <span>${esc(g.label)}</span><span class="cnt">${S.items.filter((i) => i.group === g.id).length}</span></button>`).join("")}
      <button class="lt-add-btn" id="lt-add-side">${ic("plus", 14)} Add website</button>
      <div class="eat-side-foot">Your own launcher — every platform you use, in one folder. Click a card or the favicon to open the site in a new tab.</div>`;
    view.innerHTML = `
      <div class="eat-head">
        <div>
          <div class="eat-title">LARK<em>TAB</em></div>
          <div class="eat-sub">Your personal launcher — every website and platform you use all the time, saved as idea cards grouped into folders. Add new ones, edit or delete them, and open any site in one click.</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span class="pill green">${ic("bookmark-check", 13)} Local hub</span>
          <span class="pill gray">${ic("layout-grid", 13)} ${S.items.length} sites</span>
        </div>
      </div>
      <div class="eat-layout">
        <aside class="eat-side">${sidebar}</aside>
        <main class="eat-main" id="lt-main"></main>
      </div>`;
  }

  function visible() {
    const q = S.q.toLowerCase();
    return S.items.filter((i) => {
      const inGroup = S.active === "all" || i.group === S.active;
      if (!inGroup) return false;
      if (!q) return true;
      return (i.name + " " + (i.desc || "") + " " + hostOf(i.url)).toLowerCase().indexOf(q) !== -1;
    });
  }

  function fav(letter, color) {
    return `<span class="lt-fav" style="background:${color || "#1A2440"}"><b>${esc(letter)}</b></span>`;
  }

  function cardHTML(i) {
    const host = hostOf(i.url);
    return `
    <article class="lt-card" data-id="${i.id}">
      <div class="lt-top">
        ${fav((i.name || "W")[0].toUpperCase(), i.color)}
        <div>
          <h4>${esc(i.name)}</h4>
          <div class="lt-host">${esc(host)}</div>
        </div>
      </div>
      <p class="lt-desc">${esc(i.desc || "No description — click edit to add one.")}</p>
      <span class="lt-tag">${ic(groupIcon(i.group), 11)} ${esc(groupLabel(i.group))}</span>
      <div class="lt-acts">
        <button class="lt-open" data-open="${i.id}">${ic("external-link", 12)} Open website</button>
        <button class="lt-icobtn" data-edit="${i.id}" title="Edit">${ic("pencil", 13)}</button>
        <button class="lt-icobtn del" data-del="${i.id}" title="Delete">${ic("trash-2", 13)}</button>
      </div>
    </article>`;
  }

  function renderMain() {
    const main = $("#lt-main");
    if (!main) return;
    const list = visible();
    const addCard = `<div class="lt-card add" id="lt-add-main"><div class="lt-plus">${ic("plus", 20)}</div><div>Add a website</div></div>`;

    if (!list.length) {
      const g = GROUPS.find((x) => x.id === S.active);
      main.innerHTML = `
        <div class="eat-grouphead" style="display:flex;align-items:center;gap:9px;margin:2px 0 13px;">
          <i data-lucide="${S.active === "all" ? "layout-grid" : groupIcon(S.active)}" style="width:17px;height:17px;color:var(--green)"></i>
          <b style="font-size:15px;font-weight:900;color:var(--ink)">${esc(S.active === "all" ? "All sites" : (g ? g.label : S.active))}</b>
          <span style="font-size:10.5px;color:var(--muted2)">${S.q ? "no match for “" + esc(S.q) + "”" : "empty folder"}</span>
        </div>
        <div class="lt-grid">
          <div class="lt-empty">${ic("folder-open", 34)}<b>${S.q ? "No results" : "This folder is empty"}</b><span>${S.q ? "Try another search term." : "Add the first website to this folder, or pick another folder."}</span></div>
          ${addCard}
        </div>`;
    } else {
      const g = GROUPS.find((x) => x.id === S.active);
      main.innerHTML = `
        <div class="lt-grouphead">
          <i data-lucide="${S.active === "all" ? "layout-grid" : groupIcon(S.active)}" style="width:17px;height:17px;color:var(--green)"></i>
          <b>${esc(S.active === "all" ? "All sites" : (g ? g.label : S.active))}</b>
          <span>${list.length} ${list.length === 1 ? "site" : "sites"}${S.q ? " · matching “" + esc(S.q) + "”" : ""}</span>
        </div>
        <div class="lt-grid">
          ${list.map(cardHTML).join("")}
          ${addCard}
        </div>`;
    }
    const favs = main.querySelectorAll(".lt-fav");
    list.forEach((i) => {
      const tile = favs && favs[list.indexOf(i)];
      if (tile) {
        const img = document.createElement("img");
        img.src = "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(hostOf(i.url)) + "&sz=64";
        img.alt = "";
        img.loading = "lazy";
        img.onerror = () => img.remove();
        tile.appendChild(img);
      }
    });
    icons();
  }

  function render() {
    renderShell();
    renderMain();
    const q = document.getElementById("lt-q");
    if (q) q.addEventListener("input", () => { S.q = q.value.trim(); renderMain(); });
    bindActions();
  }

  /* ---------------- actions ---------------- */
  function bindActions() {
    document.querySelectorAll(".lt-group").forEach((b) => b.addEventListener("click", () => { S.active = b.getAttribute("data-group"); S.q = ""; render(); }));

    const main = $("#lt-main");
    if (main) main.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open]");
      if (openBtn) return openItem(openBtn.getAttribute("data-open"));
      const editBtn = e.target.closest("[data-edit]");
      if (editBtn) return editItem(editBtn.getAttribute("data-edit"));
      const delBtn = e.target.closest("[data-del]");
      if (delBtn) return delItem(delBtn.getAttribute("data-del"));
      const addBtn = e.target.closest("#lt-add-main");
      if (addBtn) return openForm(null);
      const card = e.target.closest(".lt-card[data-id]");
      if (card) return openItem(card.getAttribute("data-id"));
    });

    const addSide = document.getElementById("lt-add-side");
    if (addSide) addSide.addEventListener("click", () => openForm(null));
  }

  function findItem(id) { return S.items.find((i) => i.id === id); }

  function openItem(id) {
    const i = findItem(id);
    if (!i) return;
    window.open(normalize(i.url), "_blank", "noopener,noreferrer");
    toast("Opening " + i.name + "…", "external-link");
  }

  function openForm(id) {
    const item = id ? findItem(id) : null;
    const modal = document.getElementById("lt-modal");
    const box = document.getElementById("lt-modal-box");
    const groupOpts = GROUPS.map((g) => `<option value="${g.id}"${item && item.group === g.id ? " selected" : ""}>${esc(g.label)}</option>`).join("");
    box.innerHTML = `
      <h3>${ic(item ? "pencil" : "plus", 16)} ${item ? "Edit website" : "Add a website"}</h3>
      <div class="lt-field"><label>Name</label><input id="f-name" placeholder="e.g. Facebook Ads Manager" value="${item ? esc(item.name) : ""}"></div>
      <div class="lt-field"><label>Website URL</label><input id="f-url" placeholder="e.g. https://www.facebook.com/adsmanager" value="${item ? esc(item.url) : ""}"></div>
      <div class="lt-field"><label>Description (idea)</label><input id="f-desc" placeholder="What do you use it for?" value="${item ? esc(item.desc || "") : ""}"></div>
      <div class="lt-field"><label>Folder</label><select id="f-group">${groupOpts}</select></div>
      <div class="lt-modal-acts">
        <button class="lt-btn" id="f-cancel">Cancel</button>
        <button class="lt-btn primary" id="f-save">${item ? "Save changes" : "Add website"}</button>
      </div>`;
    modal.classList.add("open");

    box.querySelector("#f-cancel").addEventListener("click", closeForm);
    box.addEventListener("click", (e) => { if (e.target.id === "f-cancel" || e.target.id === "f-save") return; });
    box.querySelector("#f-save").addEventListener("click", () => {
      const name = box.querySelector("#f-name").value.trim();
      const url = normalize(box.querySelector("#f-url").value);
      const desc = box.querySelector("#f-desc").value.trim();
      const group = box.querySelector("#f-group").value;
      if (!name) return toast("Enter a name", "warn");
      if (!url) return toast("Enter a website URL", "warn");
      if (item) {
        Object.assign(item, { name, url, desc, group });
        toast("Website updated", "ok");
      } else {
        S.items.push({ id: uid(), name, url, desc, group, color: "#1A2440" });
        toast("Website added", "ok");
      }
      persist();
      closeForm();
      render();
    });
    box.querySelector("#f-name").focus();
  }

  function editItem(id) { openForm(id); }

  function delItem(id) {
    const item = findItem(id);
    if (!item) return;
    const modal = document.getElementById("lt-modal");
    const box = document.getElementById("lt-modal-box");
    box.innerHTML = `
      <h3>${ic("trash-2", 16)} Delete “${esc(item.name)}”?</h3>
      <p style="font-size:12.5px;color:var(--muted);line-height:1.6;margin:0;">This only removes the shortcut from your launcher — the website itself is untouched. This cannot be undone.</p>
      <div class="lt-modal-acts">
        <button class="lt-btn" id="f-cancel">Cancel</button>
        <button class="lt-btn danger" id="f-deldone">Delete</button>
      </div>`;
    modal.classList.add("open");
    box.querySelector("#f-cancel").addEventListener("click", closeForm);
    box.querySelector("#f-deldone").addEventListener("click", () => {
      S.items = S.items.filter((x) => x.id !== id);
      if (!S.items.some((x) => x.group === S.active)) S.active = "all";
      persist();
      closeForm();
      render();
      toast("Website removed", "ok");
    });
  }

  function closeForm() {
    const modal = document.getElementById("lt-modal");
    if (modal) modal.classList.remove("open");
    const box = document.getElementById("lt-modal-box");
    if (box) box.innerHTML = "";
  }

  /* ---------------- boot ---------------- */
  function init() {
    load();
    render();
    const modal = document.getElementById("lt-modal");
    if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeForm(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
