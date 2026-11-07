/* ============================================================
   GLOBAL SOURCING AI — dataset (global-data.js)
   Platforms, suppliers, warehouses, trends, seasonality,
   currency reference rates. All data is stored locally; it is
   a SNAPSHOT, not a live connection. Evidence labels separate
   VERIFIED / ESTIMATED / INFERRED at all times.
   ============================================================ */

window.GS_DATA = {
  REGIONS: [
    "Asia", "Europe", "Africa", "North America", "South America", "Middle East", "Oceania"
  ],

  TYPES: [
    "B2B Marketplace", "Manufacturer", "Wholesale", "Dropshipping",
    "Private Label", "White Label", "Print on Demand", "Liquidation",
    "Closeout", "Factory Marketplace", "Supplier Directory", "Handmade",
    "Marketplace", "Import Broker", "Trade Platform", "Specialty"
  ],

  /* 56 platforms across 7 regions + 16 types.
     cap = generic connector capabilities (one interface, many platforms).
     trusted = known/verifiable platform. Everything else = estimated. */
  PLATFORMS: [
    /* ----- Asia (13) ----- */
    { id: "alibaba", name: "Alibaba.com", region: "Asia", country: "China", type: "B2B Marketplace", focus: "Global wholesale & manufacturers", api: "yes", moq: "10+", ship: "20-40d", fee: "Free to quote", rating: 9.0, trusted: true, cap: ["search", "price", "inventory", "supplier"], note: "Default reference for cross-border bulk sourcing." },
    { id: "aliexpress", name: "AliExpress", region: "Asia", country: "China", type: "Dropshipping", focus: "Retail dropship, 1-unit MOQ", api: "yes", moq: "1", ship: "15-35d", fee: "Marketplace fees", rating: 8.4, trusted: true, cap: ["search", "price", "inventory", "orders"], note: "Fast to test product-market fit at low risk." },
    { id: "madeinchina", name: "Made-in-China.com", region: "Asia", country: "China", type: "Manufacturer", focus: "Factory-direct manufacturers", api: "partial", moq: "20+", ship: "20-40d", fee: "Free to quote", rating: 8.1, trusted: true, cap: ["search", "price", "supplier"], note: "Strong on suppliers who actually manufacture." },
    { id: "globalsources", name: "Global Sources", region: "Asia", country: "Hong Kong", type: "Trade Platform", focus: "Electronics & trade shows", api: "partial", moq: "10+", ship: "25-45d", fee: "Verified supplier tiers", rating: 8.7, trusted: true, cap: ["search", "price", "supplier"], note: "Heavy electronics/sourcing-fair coverage." },
    { id: "s1688", name: "1688.com", region: "Asia", country: "China", type: "Wholesale", focus: "Domestic China bulk", api: "no", moq: "5+", ship: "25-40d", fee: "Agent needed", rating: 7.6, trusted: true, cap: ["search", "price"], note: "Cheapest domestic floor — needs an agent/buyer." },
    { id: "dhgate", name: "DHgate", region: "Asia", country: "China", type: "Dropshipping", focus: "Small bulk dropship", api: "yes", moq: "1-5", ship: "18-38d", fee: "Marketplace fees", rating: 7.9, trusted: true, cap: ["search", "price", "orders"], note: "Useful for sub-MOQ trial orders." },
    { id: "taobao", name: "Taobao", region: "Asia", country: "China", type: "Wholesale", focus: "Domestic consumer bulk", api: "no", moq: "10+", ship: "25-40d", fee: "Agent needed", rating: 6.9, trusted: true, cap: ["search", "price"], note: "Great for niche/trendy China-native products." },
    { id: "ec21", name: "EC21", region: "Asia", country: "South Korea", type: "B2B Marketplace", focus: "General B2B, Korea/Asia", api: "partial", moq: "20+", ship: "20-40d", fee: "Free to quote", rating: 7.5, trusted: true, cap: ["search", "price", "supplier"], note: "" },
    { id: "ecplaza", name: "ECPlaza", region: "Asia", country: "South Korea", type: "B2B Marketplace", focus: "General B2B", api: "partial", moq: "20+", ship: "20-40d", fee: "Free to quote", rating: 7.2, trusted: true, cap: ["search", "price", "supplier"], note: "" },
    { id: "tradeindia", name: "TradeIndia", region: "Asia", country: "India", type: "B2B Marketplace", focus: "General India B2B", api: "partial", moq: "15+", ship: "15-35d", fee: "Free to quote", rating: 7.6, trusted: true, cap: ["search", "price", "supplier"], note: "India supplier depth is strong." },
    { id: "indiamart", name: "IndiaMART", region: "Asia", country: "India", type: "Supplier Directory", focus: "1M+ India suppliers", api: "yes", moq: "10+", ship: "10-30d", fee: "Free to quote", rating: 8.0, trusted: true, cap: ["search", "price", "supplier", "inventory"], note: "" },
    { id: "tokyotrade", name: "Tokyo Trade", region: "Asia", country: "Japan", type: "Trade Platform", focus: "Japan wholesale", api: "no", moq: "20+", ship: "20-45d", fee: "Membership", rating: 6.8, trusted: false, cap: ["search", "price"], note: "Japanese quality focus, high costs." },
    { id: "hktdc", name: "HKTDC Sourcing", region: "Asia", country: "Hong Kong", type: "Trade Platform", focus: "HK trade fairs & sourcing", api: "partial", moq: "10+", ship: "25-45d", fee: "Verified listings", rating: 8.3, trusted: true, cap: ["search", "supplier"], note: "" },

    /* ----- Europe (7) ----- */
    { id: "ankora", name: "Ankorstore", region: "Europe", country: "France", type: "Wholesale", focus: "Indie retail brands wholesale", api: "yes", moq: "3+", ship: "7-20d", fee: "Brand margin model", rating: 7.9, trusted: true, cap: ["search", "price", "orders"], note: "EU-first, small-MOQ, brand-direct." },
    { id: "europages", name: "Europages", region: "Europe", country: "France", type: "Supplier Directory", focus: "EU supplier directory", api: "partial", moq: "Varies", ship: "15-35d", fee: "Listing tiers", rating: 7.8, trusted: true, cap: ["search", "supplier"], note: "Good for discovering EU factories." },
    { id: "kompass", name: "Kompass", region: "Europe", country: "France", type: "Supplier Directory", focus: "Global B2B directory", api: "partial", moq: "Varies", ship: "15-35d", fee: "Listing tiers", rating: 7.4, trusted: true, cap: ["search", "supplier"], note: "" },
    { id: "wlw", name: "Wer Liefert Was", region: "Europe", country: "Germany", type: "Supplier Directory", focus: "German suppliers", api: "no", moq: "Varies", ship: "10-30d", fee: "Listing tiers", rating: 7.7, trusted: true, cap: ["search", "supplier"], note: "German industrial + B2B strength." },
    { id: "printful", name: "Printful", region: "Europe", country: "Latvia", type: "Print on Demand", focus: "POD fulfillment EU/US", api: "yes", moq: "1", ship: "5-12d", fee: "Print cost + margin", rating: 8.5, trusted: true, cap: ["search", "inventory", "orders"], note: "Zero inventory POD; built-in shipping." },
    { id: "printify", name: "Printify", region: "Europe", country: "Latvia", type: "Print on Demand", focus: "POD provider network", api: "yes", moq: "1", ship: "5-15d", fee: "Print cost + margin", rating: 8.3, trusted: true, cap: ["search", "inventory", "orders"], note: "" },
    { id: "go4wb-eu", name: "Go4WorldBusiness EU", region: "Europe", country: "Spain", type: "B2B Marketplace", focus: "General EU B2B", api: "no", moq: "Varies", ship: "20-45d", fee: "Free to quote", rating: 5.2, trusted: false, cap: ["search", "price"], note: "Thin supplier depth — verify every lead." },

    /* ----- Africa (5) ----- */
    { id: "wasoko", name: "Wasoko (ex-Sokowatch)", region: "Africa", country: "Kenya", type: "Wholesale", focus: "FMCG B2B East Africa", api: "partial", moq: "Case", ship: "7-20d", fee: "Distribution margin", rating: 6.5, trusted: false, cap: ["search", "price"], note: "Regional FMCG distribution, not global import." },
    { id: "twiga", name: "Twiga Foods", region: "Africa", country: "Kenya", type: "Wholesale", focus: "Fresh & FMCG B2B", api: "no", moq: "Case", ship: "7-20d", fee: "Distribution margin", rating: 6.3, trusted: false, cap: ["price"], note: "Fresh produce focus." },
    { id: "jumia", name: "Jumia Sellers", region: "Africa", country: "Nigeria", type: "B2B Marketplace", focus: "Marketplace selling", api: "partial", moq: "1+", ship: "10-30d", fee: "Category fees", rating: 7.1, trusted: true, cap: ["search", "price", "orders"], note: "Reach African consumers; good demand data." },
    { id: "export2africa", name: "Export2Africa", region: "Africa", country: "Kenya", type: "Trade Platform", focus: "African SME exports", api: "no", moq: "Varies", ship: "25-50d", fee: "Free to quote", rating: 5.6, trusted: false, cap: ["search", "supplier"], note: "Africa-origin sourcing is limited — verify." },
    { id: "go4wb-af", name: "Go4WorldBusiness Africa", region: "Africa", country: "Egypt", type: "B2B Marketplace", focus: "General Africa B2B", api: "no", moq: "Varies", ship: "20-45d", fee: "Free to quote", rating: 5.0, trusted: false, cap: ["search", "price"], note: "INSUFFICIENT DATA — treat leads as unverified." },

    /* ----- North America (16) ----- */
    { id: "faire", name: "Faire", region: "North America", country: "USA", type: "Wholesale", focus: "Independent brands wholesale", api: "yes", moq: "2+", ship: "2-10d", fee: "Brand margin model", rating: 8.8, trusted: true, cap: ["search", "price", "inventory", "orders"], note: "Small MOQ, free returns, strong for boutique-style sourcing." },
    { id: "handshake", name: "Handshake", region: "North America", country: "USA", type: "Wholesale", focus: "Shopify wholesale", api: "yes", moq: "1+", ship: "3-12d", fee: "Brand-set pricing", rating: 8.2, trusted: true, cap: ["search", "price", "inventory", "orders"], note: "Integrates with Shopify storefronts." },
    { id: "spocket", name: "Spocket", region: "North America", country: "USA", type: "Dropshipping", focus: "US/EU supplier dropship", api: "yes", moq: "1", ship: "4-14d", fee: "Subscription + margin", rating: 8.0, trusted: true, cap: ["search", "price", "inventory", "orders"], note: "Faster shipping than China for US/EU end-customers." },
    { id: "modalyst", name: "Modalyst", region: "North America", country: "USA", type: "Dropshipping", focus: "Brand dropship", api: "yes", moq: "1", ship: "5-15d", fee: "Subscription + margin", rating: 7.7, trusted: true, cap: ["search", "price", "inventory", "orders"], note: "" },
    { id: "doba", name: "Doba", region: "North America", country: "USA", type: "Dropshipping", focus: "Dropship aggregation", api: "yes", moq: "1", ship: "5-20d", fee: "Subscription", rating: 6.9, trusted: true, cap: ["search", "price", "inventory"], note: "Aggregates many US dropship suppliers." },
    { id: "inventorysource", name: "Inventory Source", region: "North America", country: "USA", type: "Dropshipping", focus: "Supplier network + sync", api: "yes", moq: "1", ship: "6-20d", fee: "Subscription", rating: 7.3, trusted: true, cap: ["search", "price", "inventory"], note: "" },
    { id: "worldwidebrands", name: "Worldwide Brands", region: "North America", country: "USA", type: "Supplier Directory", focus: "Vetted wholesale directory", api: "no", moq: "Varies", ship: "10-40d", fee: "One-time membership", rating: 7.6, trusted: true, cap: ["search", "supplier"], note: "Vetted-claim directory — verify MOQs yourself." },
    { id: "wholesalecentral", name: "Wholesale Central", region: "North America", country: "USA", type: "Supplier Directory", focus: "Wholesale directory", api: "no", moq: "Varies", ship: "7-25d", fee: "Free", rating: 7.2, trusted: true, cap: ["search", "supplier"], note: "" },
    { id: "thomasnet", name: "ThomasNet", region: "North America", country: "USA", type: "Supplier Directory", focus: "Industrial suppliers", api: "partial", moq: "Varies", ship: "15-45d", fee: "Listing tiers", rating: 8.4, trusted: true, cap: ["search", "supplier", "price"], note: "Deep US industrial/manufacturing index." },
    { id: "mfg", name: "MFG.com", region: "North America", country: "USA", type: "Factory Marketplace", focus: "Custom manufacturing RFQ", api: "yes", moq: "Custom", ship: "20-60d", fee: "Subscription + RFQ", rating: 8.5, trusted: true, cap: ["search", "supplier", "price"], note: "RFQ engine for custom/private label manufacturing." },
    { id: "makersrow", name: "Maker's Row", region: "North America", country: "USA", type: "Factory Marketplace", focus: "US factories", api: "partial", moq: "Custom", ship: "15-45d", fee: "Subscription", rating: 7.9, trusted: true, cap: ["search", "supplier"], note: "Made-in-USA private label." },
    { id: "liquidation", name: "Liquidation.com", region: "North America", country: "USA", type: "Liquidation", focus: "Pallets & lots", api: "yes", moq: "Lot", ship: "7-21d", fee: "Auction fees", rating: 7.0, trusted: true, cap: ["search", "price"], note: "Bulk pallets — inspect condition before bidding." },
    { id: "bulq", name: "BULQ", region: "North America", country: "USA", type: "Liquidation", focus: "Retail overstock", api: "yes", moq: "Lot", ship: "7-20d", fee: "Lot pricing", rating: 7.4, trusted: true, cap: ["search", "price"], note: "" },
    { id: "sunrise", name: "Sunrise Wholesale", region: "North America", country: "USA", type: "Wholesale", focus: "Electronics wholesale", api: "partial", moq: "1+", ship: "10-30d", fee: "Wholesale pricing", rating: 7.5, trusted: true, cap: ["search", "price", "inventory"], note: "" },
    { id: "cre", name: "CRE Closeout", region: "North America", country: "USA", type: "Closeout", focus: "Closeout general merch", api: "no", moq: "Case", ship: "10-35d", fee: "Closeout pricing", rating: 6.8, trusted: false, cap: ["search", "price"], note: "Deep discount but supply is inconsistent." },
    { id: "etsy", name: "Etsy", region: "North America", country: "USA", type: "Handmade", focus: "Handmade & vintage", api: "yes", moq: "1", ship: "7-20d", fee: "Listing + transaction", rating: 8.1, trusted: true, cap: ["search", "price", "orders"], note: "Source unique handmade items for niche stores." },

    /* ----- South America (4) ----- */
    { id: "b2brazil", name: "B2Brazil", region: "South America", country: "Brazil", type: "B2B Marketplace", focus: "Brazil exporters", api: "partial", moq: "20+", ship: "25-50d", fee: "Free to quote", rating: 6.4, trusted: false, cap: ["search", "price", "supplier"], note: "Brazil export depth; freight is the cost driver." },
    { id: "braztrade", name: "Brazil Trade Net", region: "South America", country: "Brazil", type: "Trade Platform", focus: "Official Brazil trade", api: "no", moq: "Varies", ship: "25-55d", fee: "Export services", rating: 6.1, trusted: false, cap: ["search"], note: "" },
    { id: "go4wb-sa", name: "Go4WorldBusiness SA", region: "South America", country: "Argentina", type: "B2B Marketplace", focus: "General LatAm B2B", api: "no", moq: "Varies", ship: "30-60d", fee: "Free to quote", rating: 5.0, trusted: false, cap: ["search", "price"], note: "INSUFFICIENT DATA — verify every lead." },
    { id: "mercado", name: "Mercado Libre (B2B sellers)", region: "South America", country: "Argentina", type: "Marketplace", focus: "LatAm retail marketplace", api: "yes", moq: "1", ship: "15-35d", fee: "Category fees", rating: 7.4, trusted: true, cap: ["search", "price", "orders"], note: "Reach consumers, not suppliers — use for demand signals." },

    /* ----- Middle East (6) ----- */
    { id: "tradeling", name: "Tradeling", region: "Middle East", country: "UAE", type: "B2B Marketplace", focus: "MENA B2B procurement", api: "partial", moq: "5+", ship: "7-21d", fee: "Marketplace fees", rating: 7.2, trusted: true, cap: ["search", "price", "orders"], note: "Regional B2B buying; local delivery options." },
    { id: "sary", name: "Sary", region: "Middle East", country: "Saudi Arabia", type: "Wholesale", focus: "FMCG B2B Saudi", api: "partial", moq: "Case", ship: "5-18d", fee: "Distribution margin", rating: 7.0, trusted: true, cap: ["search", "price"], note: "Saudi local supply chain." },
    { id: "storez", name: "Storez", region: "Middle East", country: "Saudi Arabia", type: "Wholesale", focus: "Saudi wholesale", api: "no", moq: "Case", ship: "7-20d", fee: "Distribution margin", rating: 6.4, trusted: false, cap: ["search", "price"], note: "" },
    { id: "dubaitrade", name: "Dubai Trade", region: "Middle East", country: "UAE", type: "Trade Platform", focus: "Ports, customs & logistics", api: "yes", moq: "N/A", ship: "Varies", fee: "Gov services", rating: 8.0, trusted: true, cap: ["inventory", "orders"], note: "Key hub for MENA import/export processing." },
    { id: "tradekey", name: "TradeKey", region: "Middle East", country: "UAE", type: "B2B Marketplace", focus: "Global B2B directory", api: "partial", moq: "Varies", ship: "20-45d", fee: "Listing tiers", rating: 6.6, trusted: false, cap: ["search", "supplier"], note: "" },
    { id: "go4wb-me", name: "ExportHub Middle East", region: "Middle East", country: "UAE", type: "B2B Marketplace", focus: "General ME B2B", api: "no", moq: "Varies", ship: "25-50d", fee: "Free to quote", rating: 5.4, trusted: false, cap: ["search", "price"], note: "INSUFFICIENT DATA — verify." },

    /* ----- Oceania (3) ----- */
    { id: "trademe", name: "Trade Me (B2B)", region: "Oceania", country: "New Zealand", type: "Marketplace", focus: "NZ marketplace", api: "partial", moq: "1", ship: "5-18d", fee: "Listing fees", rating: 7.3, trusted: true, cap: ["search", "price", "orders"], note: "NZ-local demand + small wholesale lots." },
    { id: "go4wb-oc", name: "Go4WorldBusiness Oceania", region: "Oceania", country: "Australia", type: "B2B Marketplace", focus: "General AU/NZ B2B", api: "no", moq: "Varies", ship: "25-55d", fee: "Free to quote", rating: 5.0, trusted: false, cap: ["search", "price"], note: "INSUFFICIENT DATA — verify." },
    { id: "grays", name: "GraysOnline (Liquidation)", region: "Oceania", country: "Australia", type: "Closeout", focus: "AU auction & clearance", api: "partial", moq: "Lot", ship: "7-25d", fee: "Auction fees", rating: 6.9, trusted: true, cap: ["search", "price"], note: "Clearance/auction — condition risk." },

    /* ----- Import brokers / logistics (2) ----- */
    { id: "flexport", name: "Flexport", region: "North America", country: "USA", type: "Import Broker", focus: "Freight forwarding + customs", api: "yes", moq: "Container", ship: "30-60d", fee: "Freight + fees", rating: 8.6, trusted: true, cap: ["inventory", "orders"], note: "Ocean/air freight for import runs." },
    { id: "freightos", name: "Freightos", region: "North America", country: "USA", type: "Import Broker", focus: "Freight marketplace", api: "yes", moq: "LCL/FCL", ship: "20-50d", fee: "Freight quotes", rating: 8.2, trusted: true, cap: ["inventory", "orders"], note: "Instant freight rate comparison." }
  ],

  /* ----- Suppliers (16) ----- */
  SUPPLIERS: [
    { id: "sup-yw", name: "Yiwu Wholesale Co.", region: "Asia", country: "China", platforms: ["Alibaba.com", "1688.com"], focus: "Home, kitchen, gadgets", moq: 50, cost: 1.8, rating: 4.4, yrs: 9, certs: ["ISO 9001"], ontime: 88, risk: "LOW", verified: true, note: "Factory-direct, sample process documented." },
    { id: "sup-sz", name: "Shenzhen Tech Mfg", region: "Asia", country: "China", platforms: ["Made-in-China.com", "Alibaba.com"], focus: "Electronics, LED, smart devices", moq: 100, cost: 4.2, rating: 4.6, yrs: 12, certs: ["CE", "FCC"], ontime: 92, risk: "LOW", verified: true, note: "Strong QC, good for electronics." },
    { id: "sup-gz", name: "Guangzhou Packaging", region: "Asia", country: "China", platforms: ["Alibaba.com"], focus: "Packaging, labels, displays", moq: 200, cost: 0.4, rating: 4.1, yrs: 7, certs: ["ISO 14001"], ontime: 84, risk: "MEDIUM", verified: true, note: "Cheap but lead time varies." },
    { id: "sup-ahm", name: "Ahmedabad Textiles", region: "Asia", country: "India", platforms: ["IndiaMART", "TradeIndia"], focus: "Textiles, apparel", moq: 150, cost: 3.1, rating: 4.0, yrs: 15, certs: ["OEKO-TEX"], ontime: 80, risk: "MEDIUM", verified: false, note: "Long history, sample still recommended." },
    { id: "sup-hy", name: "Hyderabad Pharma & Health", region: "Asia", country: "India", platforms: ["TradeIndia"], focus: "Health devices, supplements", moq: 300, cost: 2.4, rating: 3.8, yrs: 6, certs: ["GMP"], ontime: 76, risk: "MEDIUM", verified: false, note: "" },
    { id: "sup-han", name: "Hanoi Handcraft", region: "Asia", country: "Vietnam", platforms: ["Made-in-China.com"], focus: "Handmade, furniture, rattan", moq: 100, cost: 5.0, rating: 4.2, yrs: 8, certs: [], ontime: 82, risk: "MEDIUM", verified: false, note: "Beautiful craftwork; QC by photos first." },
    { id: "sup-ist", name: "Istanbul Home & Kitchen", region: "Europe", country: "Turkey", platforms: ["Europages"], focus: "Home, kitchen, decor", moq: 60, cost: 6.5, rating: 4.3, yrs: 11, certs: ["ISO 9001"], ontime: 86, risk: "LOW", verified: true, note: "EU-adjacent, faster freight to MENA." },
    { id: "sup-mil", name: "Milan Fashion Studio", region: "Europe", country: "Italy", platforms: ["Ankorstore"], focus: "Premium fashion, accessories", moq: 30, cost: 14.0, rating: 4.7, yrs: 18, certs: [], ontime: 90, risk: "LOW", verified: true, note: "Premium, high MOQ value." },
    { id: "sup-rig", name: "Riga Print House", region: "Europe", country: "Latvia", platforms: ["Printful", "Printify"], focus: "Print on demand", moq: 1, cost: 7.9, rating: 4.5, yrs: 5, certs: [], ontime: 94, risk: "LOW", verified: true, note: "Zero inventory POD fulfillment." },
    { id: "sup-nbo", name: "Nairobi FMCG Supply", region: "Africa", country: "Kenya", platforms: ["Wasoko"], focus: "FMCG, personal care", moq: 100, cost: 1.2, rating: 3.5, yrs: 4, certs: [], ontime: 70, risk: "HIGH", verified: false, note: "Regional distribution only — not export." },
    { id: "sup-cai", name: "Cairo Textile Mills", region: "Africa", country: "Egypt", platforms: ["Go4WorldBusiness Africa"], focus: "Textiles, garments", moq: 200, cost: 2.9, rating: 3.4, yrs: 20, certs: [], ontime: 65, risk: "HIGH", verified: false, note: "INSUFFICIENT DATA — requires full verification." },
    { id: "sup-lax", name: "LA Wholesale Depot", region: "North America", country: "USA", platforms: ["Sunrise Wholesale", "BULQ"], focus: "Electronics, accessories", moq: 10, cost: 9.8, rating: 4.2, yrs: 10, certs: [], ontime: 89, risk: "LOW", verified: true, note: "US stock, fast to N.America." },
    { id: "sup-nyc", name: "NYC Boutique Brands", region: "North America", country: "USA", platforms: ["Faire", "Handshake"], focus: "Lifestyle, gift, beauty", moq: 6, cost: 8.2, rating: 4.6, yrs: 7, certs: [], ontime: 91, risk: "LOW", verified: true, note: "Small MOQ, premium positioning." },
    { id: "sup-sao", name: "Sao Paulo Export House", region: "South America", country: "Brazil", platforms: ["B2Brazil"], focus: "Footwear, leather goods", moq: 120, cost: 11.5, rating: 3.9, yrs: 9, certs: [], ontime: 72, risk: "MEDIUM", verified: false, note: "Freight and customs add real cost." },
    { id: "sup-dub", name: "Dubai Trading Co.", region: "Middle East", country: "UAE", platforms: ["Tradeling", "TradeKey"], focus: "Distribution, FMCG, electronics", moq: 40, cost: 7.0, rating: 4.4, yrs: 14, certs: ["ISO 9001"], ontime: 90, risk: "LOW", verified: true, note: "Fast regional delivery to MENA." },
    { id: "sup-jed", name: "Jeddah Food & Beverage", region: "Middle East", country: "Saudi Arabia", platforms: ["Sary"], focus: "F&B, household", moq: 100, cost: 3.8, rating: 4.0, yrs: 9, certs: ["SASO"], ontime: 84, risk: "MEDIUM", verified: false, note: "Local Saudi supply chain." },
    { id: "sup-auck", name: "Auckland Handmade Collective", region: "Oceania", country: "New Zealand", platforms: ["Trade Me"], focus: "Handmade, wellness", moq: 20, cost: 12.4, rating: 4.3, yrs: 6, certs: [], ontime: 88, risk: "MEDIUM", verified: false, note: "Small volume, premium price." }
  ],

  /* ----- Warehouses (10) ----- */
  WAREHOUSES: [
    { id: "wh-shenzhen", name: "Shenzhen Hub", region: "Asia", city: "Shenzhen, CN", capacity: 12000, used: 7800, costPerKg: 0.22, transit: "6-10d", services: ["Consolidation", "Inspection", "Repack", "Sourcing"] },
    { id: "wh-yiwu", name: "Yiwu Consolidation", region: "Asia", city: "Yiwu, CN", capacity: 8000, used: 6100, costPerKg: 0.18, transit: "7-11d", services: ["Consolidation", "Repack"] },
    { id: "wh-dubai", name: "Dubai Gateway", region: "Middle East", city: "Dubai, UAE", capacity: 9000, used: 4800, costPerKg: 0.35, transit: "1-3d", services: ["Fulfillment", "Customs", "COD prep", "Repack"] },
    { id: "wh-riyadh", name: "Riyadh Fulfillment", region: "Middle East", city: "Riyadh, SA", capacity: 7000, used: 3900, costPerKg: 0.42, transit: "1-2d", services: ["Fulfillment", "COD", "Same-city delivery"] },
    { id: "wh-cairo", name: "Cairo Hub", region: "Africa", city: "Cairo, EG", capacity: 6000, used: 5200, costPerKg: 0.3, transit: "1-3d", services: ["Fulfillment", "Customs", "COD"] },
    { id: "wh-algiers", name: "Algiers Fulfillment", region: "Africa", city: "Algiers, DZ", capacity: 5000, used: 4700, costPerKg: 0.38, transit: "1-2d", services: ["Fulfillment", "COD", "Wilaya shipping"] },
    { id: "wh-frankfurt", name: "Frankfurt EU Hub", region: "Europe", city: "Frankfurt, DE", capacity: 8000, used: 3300, costPerKg: 0.48, transit: "1-2d", services: ["Fulfillment", "Customs", "EU returns"] },
    { id: "wh-texas", name: "Texas US Hub", region: "North America", city: "Dallas, US", capacity: 10000, used: 4100, costPerKg: 0.44, transit: "1-3d", services: ["Fulfillment", "US returns"] },
    { id: "wh-sao", name: "Sao Paulo Hub", region: "South America", city: "Sao Paulo, BR", capacity: 4000, used: 2200, costPerKg: 0.55, transit: "1-4d", services: ["Fulfillment", "Customs"] },
    { id: "wh-sydney", name: "Sydney Hub", region: "Oceania", city: "Sydney, AU", capacity: 4000, used: 1600, costPerKg: 0.6, transit: "1-2d", services: ["Fulfillment"] }
  ],

  /* ----- Trend radar (16) ----- */
  TRENDS: [
    { id: "tr1", name: "Mini electric scrubber", category: "Home", momentum: 92, avgCost: 6.5, avgSell: 24, evidence: "verified", note: "Strong demo potential, light for air freight." },
    { id: "tr2", name: "Magnetic car phone holder", category: "Automotive", momentum: 88, avgCost: 3.2, avgSell: 15, evidence: "verified", note: "Low shipping weight, unboxing-friendly." },
    { id: "tr3", name: "Portable mini blender", category: "Kitchen", momentum: 85, avgCost: 9.0, avgSell: 29, evidence: "verified", note: "Lifestyle content, good margin." },
    { id: "tr4", name: "Anti-snore mouthpiece", category: "Health", momentum: 83, avgCost: 4.5, avgSell: 26, evidence: "estimated", note: "Emotional problem-led demand." },
    { id: "tr5", name: "LED grow lights strip", category: "Home", momentum: 80, avgCost: 7.2, avgSell: 22, evidence: "verified", note: "Plant lovers — UGC friendly." },
    { id: "tr6", name: "Smart door lock (keypad)", category: "Smart Home", momentum: 78, avgCost: 22, avgSell: 58, evidence: "estimated", note: "Higher AOV, needs trust content." },
    { id: "tr7", name: "Cat water fountain", category: "Pets", momentum: 81, avgCost: 8.0, avgSell: 28, evidence: "verified", note: "Recurring filter sales." },
    { id: "tr8", name: "Massage gun (mini)", category: "Health", momentum: 76, avgCost: 14, avgSell: 45, evidence: "verified", note: "Crowded but demo strong." },
    { id: "tr9", name: "Ring light phone holder", category: "Beauty", momentum: 79, avgCost: 3.6, avgSell: 16, evidence: "estimated", note: "Content-creator accessory." },
    { id: "tr10", name: "Solar garden lights", category: "Outdoor", momentum: 74, avgCost: 5.4, avgSell: 20, evidence: "verified", note: "Seasonal peak in warm months." },
    { id: "tr11", name: "Jewelry organizer (travel)", category: "Beauty", momentum: 72, avgCost: 2.8, avgSell: 14, evidence: "estimated", note: "Cheap, gift-able, lightweight." },
    { id: "tr12", name: "Car seat gap organizer", category: "Automotive", momentum: 70, avgCost: 2.4, avgSell: 12, evidence: "estimated", note: "Low price, easy upsell." },
    { id: "tr13", name: "Insulated water bottle", category: "Outdoor", momentum: 77, avgCost: 5.8, avgSell: 24, evidence: "verified", note: "All-season staple." },
    { id: "tr14", name: "Robot vacuum (budget)", category: "Smart Home", momentum: 68, avgCost: 55, avgSell: 130, evidence: "inferred", note: "High AOV, heavy — sea freight only." },
    { id: "tr15", name: "Standing desk converter", category: "Office", momentum: 71, avgCost: 42, avgSell: 95, evidence: "estimated", note: "Heavy, check freight economics." },
    { id: "tr16", name: "Electric kettle (travel)", category: "Kitchen", momentum: 69, avgCost: 8.8, avgSell: 30, evidence: "estimated", note: "Strong in Ramadan tea/cooking season." }
  ],

  /* ----- Seasonality (10) ----- */
  SEASONAL: [
    { id: "se-ramadan", name: "Ramadan", start: "2026-02-17", end: "2026-03-19", categories: ["Kitchen", "Food", "Gifting", "Home"], regions: ["Middle East", "North Africa", "Asia"], note: "Kitchen tools, food prep, gifting, home decor peak." },
    { id: "se-eidf", name: "Eid al-Fitr", start: "2026-03-20", end: "2026-03-22", categories: ["Gifting", "Fashion", "Beauty", "Kids"], regions: ["Middle East", "North Africa", "Asia"], note: "Gifts, outfits, kids' items. Order 60-75 days ahead." },
    { id: "se-eida", name: "Eid al-Adha", start: "2026-05-27", end: "2026-05-29", categories: ["Gifting", "Home", "Outdoor"], regions: ["Middle East", "North Africa", "Asia"], note: "Second gifting peak of the year." },
    { id: "se-bf", name: "Black Friday", start: "2026-11-27", end: "2026-11-30", categories: ["Electronics", "Home", "Beauty", "Fashion"], regions: ["Global"], note: "Biggest discount event — stock 90 days ahead." },
    { id: "se-xmas", name: "Christmas", start: "2026-12-01", end: "2026-12-25", categories: ["Gifting", "Toys", "Home", "Decor"], regions: ["Global"], note: "Gift season. Plan stock by early Q4." },
    { id: "se-vday", name: "Valentine's Day", start: "2026-02-01", end: "2026-02-14", categories: ["Gifting", "Beauty", "Jewelry"], regions: ["Global"], note: "Gift-led, emotional buying." },
    { id: "se-mother", name: "Mother's Day", start: "2026-05-01", end: "2026-05-10", categories: ["Gifting", "Home", "Beauty"], regions: ["Global"], note: "Varies by country — confirm local date." },
    { id: "se-cny", name: "Chinese New Year", start: "2026-02-17", end: "2026-02-25", categories: ["All"], regions: ["Asia"], note: "Factories close 2-4 weeks — order well before." },
    { id: "se-prime", name: "Prime Day", start: "2026-07-01", end: "2026-07-15", categories: ["Electronics", "Home"], regions: ["Global"], note: "Marketplace event — pre-stock in local fulfillment." },
    { id: "se-bts", name: "Back to School", start: "2026-08-15", end: "2026-09-15", categories: ["Office", "Stationery", "Kids", "Bags"], regions: ["Global"], note: "Predictable demand window." }
  ],

  /* ----- Currency reference rates (per 1 USD) — SNAPSHOT, editable ----- */
  CURRENCIES: [
    ["USD", "US Dollar", "$", 1], ["EUR", "Euro", "€", 0.92], ["CNY", "Chinese Yuan", "¥", 7.2],
    ["JPY", "Japanese Yen", "¥", 152], ["INR", "Indian Rupee", "₹", 83], ["KRW", "Korean Won", "₩", 1330],
    ["GBP", "British Pound", "£", 0.79], ["AED", "UAE Dirham", "AED", 3.67], ["SAR", "Saudi Riyal", "SAR", 3.75],
    ["MAD", "Moroccan Dirham", "MAD", 10.0], ["DZD", "Algerian Dinar", "DA", 135], ["EGP", "Egyptian Pound", "E£", 48],
    ["TND", "Tunisian Dinar", "TND", 3.1], ["NGN", "Nigerian Naira", "₦", 1550], ["KES", "Kenyan Shilling", "KSh", 129],
    ["BRL", "Brazilian Real", "R$", 5.2], ["ARS", "Argentine Peso", "$", 950], ["AUD", "Australian Dollar", "A$", 1.52],
    ["NZD", "NZ Dollar", "NZ$", 1.64], ["TRY", "Turkish Lira", "₺", 33], ["IDR", "Indonesian Rupiah", "Rp", 15800],
    ["VND", "Vietnamese Dong", "₫", 25000], ["THB", "Thai Baht", "฿", 36], ["PHP", "Philippine Peso", "₱", 58],
    ["MXN", "Mexican Peso", "MXN", 18.5], ["CAD", "Canadian Dollar", "C$", 1.37], ["CHF", "Swiss Franc", "CHF", 0.9],
    ["PLN", "Polish Zloty", "zł", 4.0], ["RON", "Romanian Leu", "lei", 4.6], ["CZK", "Czech Koruna", "Kč", 23.5],
    ["SEK", "Swedish Krona", "kr", 10.6], ["NOK", "Norwegian Krone", "kr", 10.8], ["ZAR", "South African Rand", "R", 18.6]
  ],

  /* ----- Region profiles (directional, not sourced stats) ----- */
  REGION_PROFILE: {
    "Asia": { demand: "High", competition: "Very High", margin: "Low", logistics: "Established", lead: "20-40d", note: "Lowest cost, largest supply — but differentiation is the challenge." },
    "Europe": { demand: "Moderate", competition: "Medium", margin: "Medium", logistics: "Fast regional", lead: "7-20d", note: "Premium sourcing, EU customs and compliance." },
    "Africa": { demand: "Growing", competition: "Low", margin: "High", logistics: "Emerging", lead: "Varies", note: "Local sourcing is thin; mostly a target market, not a source." },
    "North America": { demand: "High", competition: "High", margin: "Medium", logistics: "Fast domestic", lead: "5-20d", note: "Great for dropship + POD; higher cost base." },
    "South America": { demand: "Growing", competition: "Low", margin: "Medium", logistics: "Slow, costly", lead: "25-55d", note: "Freight and customs are the deciding costs." },
    "Middle East": { demand: "High", competition: "Medium", margin: "High", logistics: "Hub for MENA", lead: "5-20d", note: "Fast regional delivery; strong for gifting/seasonal." },
    "Oceania": { demand: "Moderate", competition: "Low", margin: "High", logistics: "Small, costly", lead: "10-30d", note: "Small market, premium pricing possible." }
  }
};
