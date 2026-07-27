// Mock data for Commerce Intelligence Platform
// Scope: Salesforce Commerce Cloud (SFCC) + Google Analytics 4 (GA4)

export interface KpiDetail {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  period: string;
  chartData: { month: string; value: number; previous: number }[];
  breakdown: { label: string; value: string; pct: number }[];
  insight: string;
}

export const kpiData: KpiDetail[] = [
  {
    label: "Online Revenue", value: "$142M", change: +12.4, trend: "up", period: "vs last quarter",
    chartData: [
      { month: "Jul", value: 108, previous: 96 }, { month: "Aug", value: 112, previous: 100 },
      { month: "Sep", value: 118, previous: 104 }, { month: "Oct", value: 126, previous: 112 },
      { month: "Nov", value: 134, previous: 118 }, { month: "Dec", value: 142, previous: 126 },
    ],
    breakdown: [
      { label: "B2B Portal", value: "$98M", pct: 69 },
      { label: "B2C / Small Business", value: "$32M", pct: 23 },
      { label: "Marketplace / 3P", value: "$12M", pct: 8 },
    ],
    insight: "B2B portal revenue is accelerating fastest at +16% QoQ. Marketplace channel growing at 28% but from a small base. Mobile commerce remains under-indexed at 22% of revenue vs 38% of sessions.",
  },
  {
    label: "Conversion Rate", value: "3.8%", change: +0.6, trend: "up", period: "vs last quarter",
    chartData: [
      { month: "Jul", value: 3.2, previous: 2.9 }, { month: "Aug", value: 3.3, previous: 3.0 },
      { month: "Sep", value: 3.4, previous: 3.1 }, { month: "Oct", value: 3.5, previous: 3.1 },
      { month: "Nov", value: 3.6, previous: 3.2 }, { month: "Dec", value: 3.8, previous: 3.2 },
    ],
    breakdown: [
      { label: "B2B Portal (logged in)", value: "6.2%", pct: 42 },
      { label: "Returning Visitors", value: "5.1%", pct: 28 },
      { label: "New Visitors", value: "1.8%", pct: 18 },
      { label: "Mobile", value: "2.4%", pct: 12 },
    ],
    insight: "B2B portal users convert at 6.2% — nearly 3.5x new visitors. The biggest drag is mobile at 2.4%, flat QoQ despite growing traffic. Fixing mobile checkout could lift blended rate to 4.3%.",
  },
  {
    label: "Avg Order Value", value: "$4,280", change: +8.2, trend: "up", period: "vs last quarter",
    chartData: [
      { month: "Jul", value: 3680, previous: 3420 }, { month: "Aug", value: 3780, previous: 3480 },
      { month: "Sep", value: 3900, previous: 3540 }, { month: "Oct", value: 4020, previous: 3620 },
      { month: "Nov", value: 4140, previous: 3700 }, { month: "Dec", value: 4280, previous: 3950 },
    ],
    breakdown: [
      { label: "Enterprise (>$500K/yr)", value: "$8,400", pct: 45 },
      { label: "Mid-market", value: "$4,200", pct: 30 },
      { label: "SMB", value: "$1,680", pct: 18 },
      { label: "Long-tail", value: "$420", pct: 7 },
    ],
    insight: "AOV growth is driven by Einstein's 'Complete the Set' bundles achieving a 22% attach rate. Enterprise accounts averaging $8,400 per order, primarily from parts bundled with service kits.",
  },
  {
    label: "Cart Abandonment", value: "62.4%", change: -3.1, trend: "down", period: "vs last quarter",
    chartData: [
      { month: "Jul", value: 65.5, previous: 68.2 }, { month: "Aug", value: 65.0, previous: 67.8 },
      { month: "Sep", value: 64.2, previous: 67.1 }, { month: "Oct", value: 63.8, previous: 66.4 },
      { month: "Nov", value: 63.1, previous: 65.8 }, { month: "Dec", value: 62.4, previous: 65.5 },
    ],
    breakdown: [
      { label: "Shipping cost shock", value: "34%", pct: 34 },
      { label: "Just researching", value: "22%", pct: 22 },
      { label: "Payment issues", value: "16%", pct: 16 },
      { label: "Account required", value: "12%", pct: 12 },
    ],
    insight: "Shipping cost reveal at checkout step 3 remains the #1 killer. $88M in carts abandoned monthly. Implementing tiered free shipping thresholds projected to recover $29M annually.",
  },
  {
    label: "Sessions (GA4)", value: "1.24M", change: +18.6, trend: "up", period: "vs last quarter",
    chartData: [
      { month: "Jul", value: 920, previous: 780 }, { month: "Aug", value: 960, previous: 810 },
      { month: "Sep", value: 1020, previous: 840 }, { month: "Oct", value: 1080, previous: 880 },
      { month: "Nov", value: 1160, previous: 920 }, { month: "Dec", value: 1240, previous: 1045 },
    ],
    breakdown: [
      { label: "Organic Search", value: "412K", pct: 33 },
      { label: "Paid Search", value: "286K", pct: 23 },
      { label: "Direct", value: "198K", pct: 16 },
      { label: "Email / Social", value: "344K", pct: 28 },
    ],
    insight: "Organic search traffic up 22% — driven by SEO investment in technical product pages 6 months ago. Top 50 landing pages still growing. Mobile sessions up 28% but desktop still drives 62% of revenue.",
  },
  {
    label: "Returning Buyers", value: "34.2%", change: +2.8, trend: "up", period: "vs last quarter",
    chartData: [
      { month: "Jul", value: 31.4, previous: 29.2 }, { month: "Aug", value: 31.8, previous: 29.6 },
      { month: "Sep", value: 32.4, previous: 30.1 }, { month: "Oct", value: 33.0, previous: 30.8 },
      { month: "Nov", value: 33.6, previous: 31.2 }, { month: "Dec", value: 34.2, previous: 31.4 },
    ],
    breakdown: [
      { label: "Enterprise CSA holders", value: "94%", pct: 40 },
      { label: "Mid-market", value: "78%", pct: 30 },
      { label: "SMB", value: "52%", pct: 20 },
      { label: "New (last 6mo)", value: "41%", pct: 10 },
    ],
    insight: "Enterprise retention is world-class at 94%. Concern area: new account 12-month retention at 41% — onboarding flow needs work. Einstein reorder reminders driving 24% conversion on lapsed accounts.",
  },
  {
    label: "Catalog Coverage", value: "78%", change: +6.1, trend: "up", period: "of 150K SKUs online",
    chartData: [
      { month: "Jul", value: 68, previous: 62 }, { month: "Aug", value: 70, previous: 64 },
      { month: "Sep", value: 72, previous: 65 }, { month: "Oct", value: 74, previous: 66 },
      { month: "Nov", value: 76, previous: 68 }, { month: "Dec", value: 78, previous: 72 },
    ],
    breakdown: [
      { label: "Fully enriched", value: "98K", pct: 65 },
      { label: "Basic listing", value: "19K", pct: 13 },
      { label: "Not yet online", value: "33K", pct: 22 },
    ],
    insight: "33K SKUs still not on SFCC — including 8,200 actively searched for on-site (GA4 site search). Each percentage point of coverage added translates to ~$1.2M in incremental quarterly revenue.",
  },
  {
    label: "ROAS (Paid)", value: "5.2x", change: +0.8, trend: "up", period: "vs last quarter",
    chartData: [
      { month: "Jul", value: 4.4, previous: 4.0 }, { month: "Aug", value: 4.6, previous: 4.1 },
      { month: "Sep", value: 4.8, previous: 4.2 }, { month: "Oct", value: 5.0, previous: 4.3 },
      { month: "Nov", value: 5.1, previous: 4.3 }, { month: "Dec", value: 5.2, previous: 4.4 },
    ],
    breakdown: [
      { label: "Email (Mktg Cloud)", value: "8.4x", pct: 35 },
      { label: "Retargeting", value: "6.2x", pct: 25 },
      { label: "Paid Search", value: "5.2x", pct: 25 },
      { label: "Social/Display", value: "3.1x", pct: 15 },
    ],
    insight: "Email is the ROAS champion at 8.4x but gets the smallest budget. Paid search CPCs up 22% YoY — diminishing returns. Shifting 15% of paid search to email nurture could yield +$3.8M at same spend.",
  },
];

export const revenueChartData = [
  { month: "Jul", revenue: 108000000, target: 100000000 },
  { month: "Aug", revenue: 112000000, target: 105000000 },
  { month: "Sep", revenue: 118000000, target: 110000000 },
  { month: "Oct", revenue: 126000000, target: 120000000 },
  { month: "Nov", revenue: 134000000, target: 125000000 },
  { month: "Dec", revenue: 142000000, target: 130000000 },
];

export const channelData = [
  { channel: "Organic Search", revenue: 48200000, sessions: 412000, conversion: 4.2, roas: null },
  { channel: "Paid Search (Google Ads)", revenue: 32600000, sessions: 286000, conversion: 3.8, roas: 5.2 },
  { channel: "Direct / Bookmarked", revenue: 28400000, sessions: 198000, conversion: 5.1, roas: null },
  { channel: "Email (Marketing Cloud)", revenue: 18600000, sessions: 156000, conversion: 4.6, roas: 8.4 },
  { channel: "Social & Display", revenue: 14200000, sessions: 188000, conversion: 2.1, roas: 3.1 },
];

export type AgentStatus = "monitoring" | "alert" | "acting";

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  insight: string;
  confidence: number;
  action: string;
  impact: string;
  icon: string;
}

export const agents: Agent[] = [
  {
    id: "revenue",
    name: "Revenue Optimization Agent",
    status: "monitoring",
    insight: "Online parts & services revenue hit $142M this quarter, up 12.4%. GA4 shows high-intent traffic from organic search converting at 4.2%, outperforming paid channels.",
    confidence: 94,
    action: "Activate dynamic pricing on top 200 SKUs based on demand elasticity data",
    impact: "+$8.6M incremental revenue",
    icon: "💰",
  },
  {
    id: "merchandising",
    name: "Merchandising & Catalog Agent",
    status: "alert",
    insight: "22% of high-traffic product pages have zero inventory visibility on SFCC. GA4 exit rates on these pages are 78% vs 34% site average.",
    confidence: 91,
    action: "Enrich 3,400 product listings with specs, compatibility, and lead times",
    impact: "+14% catalog conversion",
    icon: "📦",
  },
  {
    id: "cart",
    name: "Cart Recovery Agent",
    status: "acting",
    insight: "Cart abandonment dropped to 62.4%, but $88M in carts abandoned monthly. Top exit point: shipping cost reveal at checkout step 3.",
    confidence: 89,
    action: "Deploy tiered free-shipping thresholds + real-time exit-intent offers via SFCC",
    impact: "-8% abandonment ($7M/mo)",
    icon: "🛒",
  },
  {
    id: "retention",
    name: "Customer Retention Agent",
    status: "monitoring",
    insight: "Returning buyer rate is 34.2%, but top 8% of accounts drive 52% of online revenue. 14 high-value accounts haven't reordered in 90+ days.",
    confidence: 87,
    action: "Trigger personalized reorder campaigns via Marketing Cloud for at-risk accounts",
    impact: "$4.2M at-risk revenue protected",
    icon: "🔄",
  },
  {
    id: "marketing",
    name: "Marketing Attribution Agent",
    status: "monitoring",
    insight: "GA4 data-driven attribution shows organic search is undervalued by 34% in last-click models. Email campaigns (Marketing Cloud) have highest ROAS at 8.4x.",
    confidence: 85,
    action: "Shift 15% of paid search budget to email nurture sequences for qualified leads",
    impact: "+$3.8M revenue at lower CAC",
    icon: "📊",
  },
];

// Agent conversation mock responses — SFCC + GA4 eCommerce context
export const agentConversations: Record<string, { greeting: string; responses: Record<string, string> }> = {
  revenue: {
    greeting: `I'm tracking online commerce performance across Salesforce Commerce Cloud and GA4. Let me walk you through the current picture.\n\nThe headline: online revenue hit $142M this quarter, up 12.4% versus plan. But there's a more interesting story in the channel mix.\n\n**What's driving the beat:**\n- Organic search traffic is up 18.6% and converting at 4.2% — our SEO investment on technical product pages is paying off\n- Average order value climbed to $4,280, largely driven by B2B buyers bundling parts with service agreements\n- Email campaigns through Marketing Cloud are delivering 8.4x ROAS — best performing channel by far\n\n**Where I see opportunity:**\n- Only 78% of our 150K SKU catalog is actually live on SFCC — the missing 22% includes high-margin specialty parts\n- Mobile commerce is 38% of sessions but only 22% of revenue — the mobile checkout experience needs attention\n\nWhat would you like to dig into?`,
    responses: {
      pricing: `Here's the dynamic pricing opportunity I've been modeling using GA4 behavioral data and SFCC transaction history.\n\n**Top 200 SKUs — Price Elasticity Analysis:**\n\nI segmented our highest-volume products by demand elasticity:\n\n| Category | SKUs | Current Margin | Elastic? | Opportunity |\n|----------|------|---------------|----------|-------------|\n| Gas turbine filters | 42 | 38% | Low (essential) | +12% price headroom |\n| Replacement bearings | 31 | 44% | Low | +8% price headroom |\n| Safety equipment | 28 | 32% | Medium | +5% with bundling |\n| General consumables | 54 | 28% | High | Competitive pricing needed |\n| Specialty tools | 45 | 52% | Very Low | +15% price headroom |\n\n**The math:**\n- Implementing demand-based pricing on the 146 low-elasticity SKUs could yield +$8.6M per quarter\n- GA4 shows these products have <5% comparison shopping behavior — buyers come direct\n- SFCC's pricing engine can handle rule-based dynamic pricing with customer-tier overrides\n\n**Risk mitigation:**\n- Contract customers (CSA holders) would keep negotiated pricing\n- Only spot-buy and transactional orders would see dynamic pricing\n- We'd A/B test with 20% of traffic first\n\nShall I generate the pricing rules for import into SFCC?`,
      ga4: `Let me break down what GA4 is telling us about the customer journey.\n\n**Traffic & Acquisition (Last 90 Days):**\n\n| Channel | Sessions | Conv Rate | Revenue | Trend |\n|---------|----------|-----------|---------|-------|\n| Organic Search | 412K | 4.2% | $48.2M | ↑ 22% |\n| Paid Search | 286K | 3.8% | $32.6M | ↑ 8% |\n| Direct | 198K | 5.1% | $28.4M | ↑ 12% |\n| Email | 156K | 4.6% | $18.6M | ↑ 34% |\n| Social/Display | 188K | 2.1% | $14.2M | ↓ 3% |\n\n**Key GA4 Insights:**\n\n1. **Organic search is our engine.** The top 50 landing pages are all technical product pages we optimized 6 months ago. "Gas turbine filter replacement" alone drives $2.1M/month.\n\n2. **The funnel tells a story:**\n   - Product view → Add to cart: 28% (healthy)\n   - Add to cart → Begin checkout: 52% (good)\n   - Begin checkout → Purchase: 38% (problem area)\n   - Checkout step 3 (shipping) is where we lose 34% of buyers\n\n3. **GA4 predictive audiences are gold:**\n   - "Likely to purchase in 7 days" audience: 2.3x conversion rate when targeted\n   - "High-value buyer" audience: AOV is 3.4x the site average\n\n4. **Cross-device behavior:**\n   - 41% of purchases involve multiple sessions across devices\n   - Mobile browse → Desktop purchase is the dominant pattern for B2B buyers\n\nThe biggest actionable insight: we need to fix checkout step 3. That single optimization could be worth $4-6M per quarter.`,
      default: `Here's the full revenue picture across SFCC channels.\n\n**Online Revenue Performance (Current Quarter):**\n- Total: $142M (+12.4% vs plan)\n- B2B Portal: $98M (69% of total) — average order: $6,840\n- B2C/Small Business: $32M (23%) — average order: $1,420\n- Marketplace/3P: $12M (8%) — growing fastest at +28%\n\n**Product Category Breakdown:**\n- Replacement parts: $62M (largest, driven by turbine consumables)\n- Service kits & bundles: $34M (highest margin at 48%)\n- Safety & compliance: $22M (steady, regulatory-driven)\n- Tools & equipment: $14M (growing via catalog expansion)\n- Digital subscriptions: $10M (APM licenses, monitoring subscriptions)\n\n**SFCC Platform Metrics:**\n- Uptime: 99.97%\n- Page load speed: 2.1s (target: <2.5s)\n- Search relevancy score: 84% (up from 72% after Einstein tuning)\n- Personalization: Active on 62% of product pages\n\nThe big lever I'd pull right now is catalog completeness. We're only at 78% of our 150K SKU catalog online — every percentage point of coverage we add translates to roughly $1.2M in incremental quarterly revenue based on historical patterns.\n\nWant me to explore any segment deeper?`,
    },
  },
  merchandising: {
    greeting: `I need to flag something important about our SFCC catalog health.\n\nI've been cross-referencing GA4 behavioral data with our product information management system, and there's a significant gap that's costing us conversions.\n\n**The problem in numbers:**\n- 150K total SKUs in our product database\n- 117K (78%) are live on SFCC with full product pages\n- 33K (22%) are either missing, incomplete, or have no inventory visibility online\n- Of those 33K, roughly 8,200 are actively searched for on our site (GA4 site search data)\n\n**Why this matters:**\n- GA4 shows 48,000 monthly searches for products we don't surface properly\n- Exit rate on "no results" pages: 91%\n- Exit rate on incomplete product pages: 78% vs 34% site average\n- Estimated lost revenue: $6.2M per quarter\n\nI've mapped out a prioritized enrichment plan based on search volume and margin contribution. Want to see the plan, or should we look at the specific product categories first?`,
    responses: {
      catalog: `Here's the catalog enrichment priority matrix I've built:\n\n**Tier 1 — Immediate (3,400 SKUs, $4.2M quarterly impact):**\n\n| Category | Missing SKUs | Monthly Searches | Action |\n|----------|-------------|-----------------|--------|\n| Hot gas path components | 420 | 12,400 | Full PDP build with compatibility matrix |\n| Combustion parts | 380 | 9,800 | Add specs + cross-reference charts |\n| Filter elements | 640 | 8,200 | Template-based enrichment (fast) |\n| Control system modules | 280 | 6,100 | Technical documentation required |\n| Bearing assemblies | 520 | 5,400 | Add lead times + alt part numbers |\n| Electrical components | 1,160 | 4,800 | Bulk upload with supplier data |\n\n**What each enriched listing needs:**\n1. Technical specifications (dimensions, materials, certifications)\n2. Equipment compatibility matrix (which turbine models)\n3. Real-time inventory visibility from SAP\n4. Estimated lead time and shipping weight\n5. Related/recommended parts (Einstein product recommendations)\n6. Installation guides or service bulletin references\n\n**SFCC implementation:**\n- Use Commerce Cloud's Product Data Management API for bulk import\n- Einstein Search will auto-index new products within 24 hours\n- Personalization engine will start serving recommendations after 7 days of behavioral data\n\nInvestment: ~$180K in content creation. Expected return: $16.8M annualized. That's a 23x ROI.`,
      default: `Here's the catalog and merchandising overview:\n\n**SFCC Catalog Health:**\n- Total SKUs in database: 150,000\n- Live on storefront: 117,000 (78%)\n- With complete product data: 98,000 (65%)\n- With Einstein recommendations active: 72,000 (48%)\n\n**Einstein Commerce Performance:**\n- Product recommendations: 14.2% click-through rate\n- Predictive sort: +8% conversion vs default sort\n- Search dictionaries: 2,400 custom entries for industry terminology\n- Einstein "Complete the Set" bundles: 22% attach rate\n\n**GA4 Site Search Insights:**\n- 186,000 monthly site searches\n- Top searches with zero results: "hydrogen conversion kit", "9HA blade inspection tool", "digital twin license"\n- Search-to-purchase conversion: 6.8% (2x higher than browse-to-purchase)\n- Searches including part numbers convert at 12.4%\n\n**What I'd prioritize:**\n1. Fix the 8,200 SKUs people are actively searching for but can't find\n2. Add compatibility matrices to the top 5,000 parts pages\n3. Enable Einstein visual search for equipment photos → part identification\n4. Implement "Request Quote" for the 33K SKUs not yet fully online (capture the demand)\n\nThe biggest quick win is adding a "Request Quote" button to unpublished SKUs. It would capture demand data while we build out full product pages.`,
    },
  },
  cart: {
    greeting: `Cart abandonment is the single biggest revenue leak on our SFCC storefront, and I've been digging into exactly where and why it happens.\n\n**Current state: 62.4% abandonment rate**\nThat's actually down from 65.5% last quarter — our progress is real but there's still $88M in monthly abandoned cart value.\n\n**GA4 funnel analysis pinpoints the problem:**\n\n| Checkout Step | Drop-off Rate | Lost Revenue |\n|--------------|---------------|-------------|\n| Cart → Step 1 (Account) | 18% | $15.8M/mo |\n| Step 1 → Step 2 (Billing) | 12% | $10.5M/mo |\n| Step 2 → Step 3 (Shipping) | 34% | $29.9M/mo ← biggest leak |\n| Step 3 → Step 4 (Review) | 8% | $7.0M/mo |\n| Step 4 → Purchase | 6% | $5.3M/mo |\n\n**Step 3 (shipping) is where 34% of buyers bail.** When I look at the GA4 session recordings and event data, it's clear: shipping costs are revealed for the first time at this step, and for B2B buyers ordering heavy parts, freight costs can be 15-25% of order value.\n\nI have a multi-pronged recovery strategy ready. Want to see it?`,
    responses: {
      recovery: `Here's the cart recovery strategy I've designed, combining SFCC capabilities with Marketing Cloud and GA4 insights:\n\n**1. Fix the Shipping Shock (Step 3 — $29.9M/mo leak)**\n- Show estimated shipping costs on PDP and in cart (before checkout)\n- Implement tiered free shipping: orders >$5K get free ground, >$10K get free expedited\n- For heavy/oversized items: add freight quote calculator on product page\n- Expected impact: -12 percentage points on Step 3 dropout\n\n**2. Real-time Exit Intent (SFCC + Einstein)**\n- Detect cursor movement toward close/back button\n- Trigger personalized overlay: "Your [product name] is ready — complete your order for [incentive]"\n- Incentives tiered by cart value: <$1K = free shipping, $1-5K = 5% off, >$5K = dedicated account rep callback\n- Expected impact: 8% save rate on abandoning sessions\n\n**3. Abandoned Cart Flows (Marketing Cloud)**\n- Email 1 (1 hour): "Your cart is saved" with product images and one-click return\n- Email 2 (24 hours): "Still deciding? Here's what others bought" + social proof\n- Email 3 (72 hours): "Your items are in high demand" + urgency messaging\n- SMS option for opted-in B2B accounts\n- Historical recovery rate on email flows: 12% of abandoned carts\n\n**4. GA4 Predictive Audiences**\n- Target "likely to abandon" audience with proactive chat offers\n- Feed GA4 signals to SFCC personalization engine for dynamic incentive display\n\n**Combined projected impact:**\n- Abandonment rate: 62.4% → 54.8%\n- Recovered revenue: ~$7.2M per month\n- Annual impact: $86M+ in recovered revenue`,
      default: `Here's the full cart and checkout optimization picture:\n\n**Abandonment Analytics (GA4):**\n- Overall rate: 62.4% (down from 65.5% last quarter)\n- B2B accounts: 58% abandonment (lower — they know what they need)\n- B2C/small business: 71% abandonment (higher — more price-sensitive)\n- Mobile: 74% abandonment (worst — checkout UX issues)\n\n**Top Reasons (GA4 exit surveys + session analysis):**\n1. Unexpected shipping costs (34% of exits)\n2. "Just researching / getting quote" (22%)\n3. Payment method issues — no PO/net-30 option visible (16%)\n4. Required to create account (12%)\n5. Technical issues / slow page load (8%)\n6. Other (8%)\n\n**What's already working:**\n- SFCC persistent cart: 18% of abandoned carts are completed within 7 days\n- Marketing Cloud recovery emails: 12% open rate, 3.4% conversion\n- Einstein "recently viewed" reminders: 6% re-engagement rate\n\n**SFCC Checkout Optimizations I'd Deploy:**\n1. Guest checkout for B2C (currently requires account)\n2. Apple Pay / Google Pay for mobile\n3. PO and net-30 terms visible at cart level (not hidden in checkout)\n4. Show shipping estimate on PDP and cart page\n5. Progress indicator with estimated completion time\n\nThe mobile experience is the fastest ROI. Fixing mobile checkout could move $12M in annual revenue.`,
    },
  },
  retention: {
    greeting: `I've been analyzing customer lifecycle data across SFCC transaction history and GA4 engagement patterns, and I want to walk you through the retention landscape.\n\n**The good news:** Returning buyer rate is 34.2%, up from 31.4% last quarter.\n**The concern:** Our top accounts are showing engagement drops.\n\n**Customer Concentration:**\n- Top 8% of accounts = 52% of online revenue ($73.8M)\n- Top 50 accounts average $1.48M annually through the portal\n- These accounts also have the highest self-service adoption\n\n**What's triggering my alert:**\n14 accounts in the top 50 haven't placed an order in 90+ days. That's unusual — their historical reorder cycle is 45-60 days.\n\n**When I cross-reference with GA4:**\n- 8 of these 14 accounts have reduced session frequency by 60%+\n- 4 accounts have been browsing competitor product pages (referral data)\n- 2 accounts have contacted support about catalog gaps\n\nThis represents $4.2M in quarterly revenue at risk. I have personalized re-engagement strategies ready for each account tier.\n\nWant to see the at-risk account details or the re-engagement plan?`,
    responses: {
      customers: `Here are the highest-priority at-risk accounts:\n\n**1. Duke Energy Services — $820K quarterly spend**\n- Last order: 94 days ago (usual cycle: 42 days)\n- GA4 signals: Session frequency down 72%, browsed 3 competitor sites via referral links\n- Portal behavior: Downloaded 4 product comparison PDFs last month\n- Risk level: HIGH\n- Recommended action: Executive outreach + custom pricing review + dedicated catalog build for their fleet\n\n**2. NextEra Maintenance Division — $640K quarterly**\n- Last order: 102 days ago (usual cycle: 38 days)\n- GA4 signals: Support tickets about missing SKUs (wind turbine gearbox components)\n- Portal behavior: 3 "out of stock" alerts triggered, no follow-up orders\n- Risk level: HIGH\n- Recommended action: Priority catalog enrichment for their top 200 SKUs + backorder notification system\n\n**3. Enel Green Power Procurement — $480K quarterly**\n- Last order: 88 days ago (usual cycle: 55 days)\n- GA4 signals: Still browsing weekly, but cart abandonment rate jumped to 89%\n- Portal behavior: Multiple quote requests never converted\n- Risk level: MEDIUM\n- Recommended action: Review pricing competitiveness + offer volume discount tier\n\n**4-14. Remaining accounts ($2.26M combined quarterly):**\n- Mix of delayed reorder cycles and seasonal patterns\n- 6 appear to be timing-related (will likely reorder within 30 days)\n- 5 need proactive outreach — I've drafted personalized emails for each\n\nShall I trigger the Marketing Cloud journeys for the top 3?`,
      default: `Here's the full customer retention picture:\n\n**Retention Metrics (SFCC + GA4):**\n- Returning buyer rate: 34.2% (+2.8pp QoQ)\n- Customer lifetime value (avg): $48,200\n- Repeat purchase rate: 2.8 orders per year\n- Reorder cycle: 52 days average\n- Net Promoter Score (portal): 64\n\n**Cohort Analysis:**\n\n| Cohort | Accounts | Retention (12mo) | AOV Trend |\n|--------|----------|-----------------|----------|\n| Enterprise CSA holders | 84 | 94% | +12% |\n| Mid-market (>$100K/yr) | 320 | 78% | +4% |\n| Small business (<$100K) | 2,400 | 52% | -2% |\n| New accounts (last 6mo) | 680 | 41% | Baseline |\n\n**Reactivation Campaigns (Marketing Cloud):**\n- "We miss you" series: 18% reactivation rate\n- Personalized reorder reminders: 24% conversion\n- Volume discount offers: 31% conversion (but lower margin)\n\n**Einstein Recommendations Impact:**\n- Cross-sell suggestions: 12% attach rate (adding $14.2M annually)\n- "Frequently bought together" bundles: 8% uplift on AOV\n- Personalized homepage: 22% higher engagement vs generic\n\n**What I'd focus on:**\n1. The 14 at-risk top accounts need immediate personal attention\n2. New account onboarding flow needs work — 41% 12-month retention is too low\n3. Small business tier needs a self-service loyalty program to improve stickiness`,
    },
  },
  marketing: {
    greeting: `I've been deep in the GA4 attribution data, and I want to challenge some assumptions about our marketing spend allocation.\n\n**The revelation:** Our current last-click attribution model is significantly misrepresenting channel value.\n\n**GA4 Data-Driven Attribution vs Last-Click:**\n\n| Channel | Last-Click Revenue | DDA Revenue | Variance |\n|---------|-------------------|-------------|----------|\n| Organic Search | $38.4M | $48.2M | +25% undervalued |\n| Paid Search | $38.1M | $32.6M | -14% overvalued |\n| Email | $14.8M | $18.6M | +26% undervalued |\n| Direct | $32.1M | $28.4M | -12% overvalued |\n| Social/Display | $18.6M | $14.2M | -24% overvalued |\n\n**What this means:**\nWe've been over-investing in paid search and social by about $2.4M per quarter, while under-investing in organic content and email nurture — the channels that actually initiate and assist the most valuable conversions.\n\n**The B2B buyer journey is long:**\n- Average touchpoints before purchase: 8.4\n- Average days from first touch to purchase: 34 days\n- Most common path: Organic search → Email nurture → Direct purchase\n\nWant me to walk through the budget reallocation model, or dive into a specific channel?`,
    responses: {
      budget: `Here's the data-driven budget reallocation I'm recommending:\n\n**Current vs Recommended Quarterly Spend:**\n\n| Channel | Current | Recommended | Change | Expected Impact |\n|---------|---------|-------------|--------|----------------|\n| Paid Search (Google Ads) | $3.2M | $2.7M | -$500K | Maintain 90% of revenue at lower cost |\n| Organic/SEO Content | $800K | $1.4M | +$600K | +$4.8M revenue (12-mo payback) |\n| Email (Marketing Cloud) | $600K | $1.1M | +$500K | +$3.8M revenue (8.4x ROAS) |\n| Social/Display | $1.8M | $1.2M | -$600K | Cut low-ROAS awareness spend |\n| Retargeting | $400K | $400K | — | Maintain — efficient at 6.2x ROAS |\n\n**Why I'm confident in this shift:**\n\n1. **Organic search** has a compounding effect — content we create today drives traffic for 18+ months. Our top 50 landing pages were built 6-12 months ago and still growing.\n\n2. **Email** is our highest-ROAS channel at 8.4x, yet it gets the smallest budget. Marketing Cloud journeys targeting GA4 predictive audiences ("likely to purchase") convert at 2.3x the baseline.\n\n3. **Paid search** is hitting diminishing returns — CPC is up 22% YoY in our category. We're bidding against ourselves on branded terms.\n\n4. **Social/display** works for awareness but GA4's DDA shows it rarely assists conversion for our B2B audience. It's a B2C tactic in a B2B context.\n\n**Projected quarterly impact:**\n- Revenue: +$3.8M with same total spend\n- CAC: -18% reduction\n- ROAS (blended): 5.2x → 6.1x`,
      default: `Here's the full marketing attribution analysis:\n\n**GA4 Attribution Overview:**\n- Attribution model: Data-driven (GA4 default)\n- Conversion window: 90 days (extended for B2B cycle)\n- Touchpoints tracked: 12 event types across web, email, paid\n\n**Channel Deep-Dive:**\n\n**Organic Search (GA4):**\n- 412K sessions, 4.2% conversion, $48.2M revenue\n- Top queries: product-specific (part numbers, equipment names)\n- 62% of organic traffic lands on product pages we optimized for SEO\n- Content ROI: $6 revenue per $1 invested (18-month attribution window)\n\n**Paid Search (Google Ads → GA4):**\n- 286K sessions, 3.8% conversion, $32.6M revenue\n- ROAS: 5.2x (down from 5.8x — CPCs rising)\n- Brand vs non-brand: 60/40 split — brand terms have 8x ROAS, non-brand 2.4x\n- Recommendation: Reduce brand bidding (we'd capture 80% organically)\n\n**Email (Marketing Cloud → GA4):**\n- 156K sessions, 4.6% conversion, $18.6M revenue\n- ROAS: 8.4x — highest of any channel\n- Best performing: Abandoned cart flows (12% recovery), reorder reminders (24% conversion)\n- Predictive audience targeting: 2.3x conversion uplift\n\n**Social/Display:**\n- 188K sessions, 2.1% conversion, $14.2M revenue\n- ROAS: 3.1x — lowest performing\n- LinkedIn performs 3x better than Facebook for our B2B audience\n- Display retargeting is efficient (6.2x) but prospecting display is not (1.8x)\n\nThe data is clear: shift investment toward email and organic, pull back on social display prospecting.`,
    },
  },
};

export interface Scenario {
  id: string;
  title: string;
  trigger: string;
  steps: { label: string; detail: string; status: "complete" | "active" | "pending" }[];
  impact: string;
  deepDive: {
    rootCause: string;
    dataPoints: string[];
    financialImpact: { label: string; value: string }[];
    recommendation: string;
  };
}

export const scenarios: Scenario[] = [
  {
    id: "cart-recovery",
    title: "Checkout Abandonment Recovery",
    trigger: "GA4 detects 34% drop-off at shipping cost reveal (checkout step 3)",
    steps: [
      { label: "Anomaly Detected", detail: "GA4 funnel analysis flags step 3 as 3σ outlier vs industry benchmarks", status: "complete" },
      { label: "Root Cause Analyzed", detail: "Shipping cost shock — B2B freight costs 15-25% of order value revealed too late", status: "complete" },
      { label: "Solution Designed", detail: "SFCC tiered free shipping thresholds + upfront freight estimator on PDP", status: "complete" },
      { label: "A/B Test Deployed", detail: "Einstein A/B test running on 20% of traffic — showing 18% improvement", status: "active" },
      { label: "Full Rollout", detail: "Pending approval — projected $29M annual recovery", status: "pending" },
    ],
    impact: "$29M recovered/yr",
    deepDive: {
      rootCause: "SFCC checkout flow reveals freight costs only at step 3. For heavy industrial parts (avg weight: 45 lbs), freight can be $200-$1,200 per shipment. B2B buyers accustomed to net-pricing with freight included are experiencing 'sticker shock' when they see the total for the first time.",
      dataPoints: [
        "Step 3 drop-off: 34% (vs 8-12% industry benchmark for B2B eCommerce)",
        "Average freight cost on abandoned carts: $480 (18% of order value)",
        "GA4 session recordings: 72% of dropouts leave within 8 seconds of seeing shipping total",
        "Returning visitors who abandoned at step 3: only 24% come back (vs 52% for other abandonment points)",
        "Competitors offering free freight threshold: 4 of top 5",
      ],
      financialImpact: [
        { label: "Monthly abandoned at step 3", value: "$29.9M" },
        { label: "Cost of free shipping (>$5K)", value: "$1.8M/mo" },
        { label: "Expected recovery rate", value: "22-28%" },
        { label: "Net revenue impact", value: "+$4.8M/mo" },
        { label: "Annual ROI", value: "18x" },
      ],
      recommendation: "Deploy tiered free shipping immediately: orders >$5K get free ground shipping, >$10K get free expedited. Add a freight cost estimator widget to all product detail pages and the cart page so buyers see costs before entering checkout. SFCC's promotion engine can handle the shipping threshold rules, and the PDP widget can use the SFCC shipping API for real-time estimates.",
    },
  },
  {
    id: "personalization",
    title: "Einstein Personalization Uplift",
    trigger: "Einstein Commerce recommendations showing 14.2% CTR but only active on 48% of catalog",
    steps: [
      { label: "Opportunity Identified", detail: "Einstein active on 72K of 150K SKUs — missing high-margin specialty parts", status: "complete" },
      { label: "Data Enrichment", detail: "Added compatibility tags, use-case categories, and equipment associations to 28K SKUs", status: "complete" },
      { label: "Model Retrained", detail: "Einstein recommendation model retrained with enriched product attributes", status: "active" },
      { label: "Expanded Deployment", detail: "Roll out recommendations to remaining 50K eligible SKUs", status: "pending" },
      { label: "Results Measured", detail: "Expected +$18M annual revenue from expanded personalization", status: "pending" },
    ],
    impact: "+$18M annual revenue",
    deepDive: {
      rootCause: "Einstein Commerce Recommendations requires minimum product attribute coverage to generate quality suggestions. 50K+ SKUs lack the equipment compatibility tags, use-case categories, and cross-reference data needed for the recommendation engine to create meaningful connections. These tend to be specialty and long-tail parts with high margins but low discoverability.",
      dataPoints: [
        "Pages with Einstein recommendations: 14.2% CTR, 22% higher AOV",
        "Pages without recommendations: 8.4% CTR, baseline AOV",
        "Product attribute completeness: 48% (72K/150K SKUs meet Einstein threshold)",
        "Specialty parts (missing from Einstein): avg margin 52% vs 38% catalog average",
        "GA4 site search: 34% of specialty part searches end in exit (no recommendation to catch them)",
      ],
      financialImpact: [
        { label: "Current Einstein revenue contribution", value: "$24.6M/yr" },
        { label: "Enrichment cost (28K SKUs)", value: "$180K" },
        { label: "Expected incremental revenue", value: "$18M/yr" },
        { label: "Cross-sell attach rate improvement", value: "+6pp" },
        { label: "ROI on enrichment investment", value: "100x" },
      ],
      recommendation: "Prioritize enriching the 28K SKUs with highest search volume and margin contribution. Use the SFCC Product Attributes API for bulk enrichment, then retrain Einstein models. The recommendation engine will auto-deploy to newly eligible products. Focus on adding equipment compatibility matrices — GA4 data shows buyers who can confirm part compatibility convert at 3x the rate of those who can't.",
    },
  },
];

export interface CustomerAccount {
  name: string;
  id: string;
  type: string;
  contractValue: string;
  predictedLifetimeValue: string;
  riskScore: number;
  segment: string;
  fleet: string;
  csa: string;
  lastOutage: string;
  digitalProducts: string[];
  topAssets: string[];
  recentEvents: { type: string; detail: string; time: string }[];
  nextBestAction: string;
  aiSummary: string;
}

export const customerProfile: CustomerAccount = {
  name: "Duke Energy Services",
  id: "ACCT-DUKE-001",
  type: "Enterprise B2B Account",
  contractValue: "$3.2M annual",
  predictedLifetimeValue: "$18.4M",
  riskScore: 32,
  segment: "Enterprise — Utilities",
  fleet: "142 active product subscriptions across 18 plant sites",
  csa: "Preferred Buyer Program — Tier 1",
  lastOutage: "Last order: 94 days ago",
  digitalProducts: ["SFCC Portal Access", "Custom Catalog", "Automated Reordering", "Pricing Tier API"],
  topAssets: ["Gas turbine filters & consumables ($1.8M/yr)", "Combustion system parts ($680K/yr)", "Safety compliance kits ($420K/yr)"],
  recentEvents: [
    { type: "Alert", detail: "No orders in 94 days — usual cycle is 42 days", time: "Now" },
    { type: "Commercial", detail: "Downloaded 4 competitor product comparison PDFs", time: "2 weeks ago" },
    { type: "Service", detail: "Support ticket: missing SKUs for wind gearbox parts", time: "3 weeks ago" },
    { type: "Digital", detail: "Portal session frequency dropped 72%", time: "vs 90 days prior" },
  ],
  nextBestAction: "Trigger executive outreach with custom pricing review. Address catalog gaps for their wind fleet parts. Offer dedicated account catalog with their top 200 SKUs pre-loaded with negotiated pricing.",
  aiSummary: "Duke Energy Services is the #1 online buyer by volume through our SFCC portal, averaging $820K per quarter. The 94-day gap since last order is a strong churn signal — their reorder cycle is typically 42 days. GA4 referral data shows visits to 3 competitor parts portals. The root cause appears to be catalog gaps: they filed 2 support tickets about missing wind turbine gearbox components that we don't currently list on SFCC. Immediate action needed to retain this $3.2M annual account.",
};

export const aiResponses: Record<string, string> = {
  revenue: `Let me pull that analysis together. Querying SFCC order data and GA4 traffic metrics...\n\n**Online Revenue & Conversion Analysis**\n\nThe eCommerce picture is strong, but there are nuances worth unpacking:\n\n**What's working:**\n- Online revenue at $142M, up 12.4% — our SFCC platform is becoming the primary ordering channel\n- Organic search driving $48.2M through product pages we optimized 6 months ago\n- B2B portal buyers average $6,840 AOV — 60% higher than self-service buyers\n- Email campaigns via Marketing Cloud delivering 8.4x ROAS\n\n**Where I see opportunity:**\n- Only 78% of our 150K SKU catalog is live on SFCC — missing products = missed revenue\n- Cart abandonment at 62.4% means $88M in carts abandoned monthly\n- Mobile commerce is 38% of sessions but only 22% of revenue — checkout UX gap\n\n**The channel mix insight:**\nGA4's data-driven attribution reveals organic search is undervalued by 25% in last-click models, while paid search is overvalued by 14%. We're likely over-spending on Google Ads and under-investing in SEO content.\n\nWhat would you like me to dig into?`,

  conversion: `Analyzing conversion funnels across SFCC and GA4...\n\n**Conversion Rate Deep-Dive**\n\n**Overall: 3.8% (up from 3.2% last quarter)**\n\nBut the average hides important segments:\n\n| Segment | Conv Rate | Trend | Notes |\n|---------|-----------|-------|-------|\n| B2B Portal (logged in) | 6.2% | ↑ +0.8pp | They know what they need |\n| Returning visitors | 5.1% | ↑ +0.4pp | Familiarity drives conversion |\n| Organic search | 4.2% | ↑ +0.6pp | SEO landing pages working |\n| New visitors | 1.8% | ↑ +0.2pp | Needs onboarding improvement |\n| Mobile | 2.4% | — flat | Checkout friction |\n\n**GA4 Funnel Analysis:**\n- Product view → Add to cart: 28% (healthy)\n- Add to cart → Checkout: 52% (good for B2B)\n- Checkout → Purchase: 38% (problem — shipping cost reveal)\n\n**Top Conversion Killers (GA4 event analysis):**\n1. Shipping cost shock at checkout step 3 (34% exit)\n2. Required account creation for first-time B2C buyers (12% exit)\n3. Missing product specifications causing "research exits" (22% exit on incomplete PDPs)\n4. Out-of-stock with no backorder option (91% exit)\n\n**Quick wins I'd deploy on SFCC:**\n1. Show shipping estimates on product pages (fix #1)\n2. Enable guest checkout for small orders <$500 (fix #2)\n3. Add "Request Quote" CTA on incomplete product pages (fix #3)\n4. Enable backorder with estimated delivery date (fix #4)\n\nConservatively, these four changes could move conversion from 3.8% to 4.6%, worth $22M+ annually.`,

  segments: `Pulling customer segmentation data from SFCC and GA4...\n\n**Customer Segment Intelligence**\n\n| Segment | Accounts | Online Revenue | AOV | Conv Rate | Retention |\n|---------|----------|---------------|-----|-----------|----------|\n| Enterprise (>$500K/yr) | 42 | $62M | $8,400 | 7.8% | 94% |\n| Mid-market ($100-500K) | 186 | $38M | $4,200 | 5.2% | 78% |\n| SMB ($10-100K) | 840 | $28M | $1,680 | 3.4% | 62% |\n| Long-tail (<$10K) | 3,200+ | $14M | $420 | 2.1% | 41% |\n\n**Key insight:** Enterprise accounts are 1% of our customer base but 44% of revenue. They also have the highest retention and conversion because they use the B2B portal with personalized catalogs and negotiated pricing.\n\n**GA4 Behavioral Differences:**\n- Enterprise: 12 avg sessions before purchase, use site search heavily\n- Mid-market: 8 avg sessions, responsive to email campaigns\n- SMB: 4 avg sessions, price-sensitive, compare competitors\n- Long-tail: 2 avg sessions, often one-time emergency purchases\n\n**Growth Opportunities by Segment:**\n1. Enterprise: Expand catalog coverage for their specific fleets (+$8M)\n2. Mid-market: Automated reorder workflows via SFCC (+$6M)\n3. SMB: Loyalty/volume discount program to improve retention (+$4M)\n4. Long-tail: Guest checkout + fast-ship emergency parts program (+$3M)`,

  marketing: `Running GA4 attribution analysis across all marketing channels...\n\n**Marketing & Attribution Report**\n\n**The big insight:** Last-click attribution is lying to you. GA4's data-driven model tells a different story.\n\n**Channel Performance (GA4 Data-Driven Attribution):**\n\n| Channel | Revenue (DDA) | ROAS | Trend |\n|---------|--------------|------|-------|\n| Organic Search | $48.2M | n/a (earned) | ↑ 22% |\n| Paid Search | $32.6M | 5.2x | ↑ 8% |\n| Direct | $28.4M | n/a | ↑ 12% |\n| Email (MKTG Cloud) | $18.6M | 8.4x | ↑ 34% |\n| Social/Display | $14.2M | 3.1x | ↓ 3% |\n\n**Where the models disagree:**\n- Organic search is undervalued by 25% in last-click — it initiates journeys that close on direct\n- Email is undervalued by 26% — it's the critical middle touch in B2B journeys\n- Social/display is overvalued by 24% — generates impressions but rarely assists conversion\n\n**B2B Journey Pattern (GA4 Path Analysis):**\nMost common path: Organic search (discover) → Email nurture (educate) → Direct (purchase)\nAverage touchpoints: 8.4 over 34 days\n\n**My recommendation:**\nShift 15% of paid search budget ($500K) to email nurture sequences. Invest another $600K in SEO content targeting product-specific long-tail queries. Cut social display prospecting by $600K. Net impact: +$3.8M revenue at same total spend.`,

  default: `Let me scan across all SFCC and GA4 data sources for a comprehensive view...\n\n**Executive Briefing — eCommerce Intelligence**\n\n**Performance Summary:**\n- Online revenue: $142M (+12.4% vs plan)\n- Conversion rate: 3.8% (+0.6pp QoQ)\n- Average order value: $4,280 (+8.2%)\n- Cart abandonment: 62.4% (-3.1pp — improving)\n- Sessions (GA4): 1.24M (+18.6%)\n\n**Top Opportunities:**\n1. **Cart Recovery** — $88M monthly in abandoned carts. Fixing shipping cost shock at checkout step 3 could recover $29M annually\n2. **Catalog Expansion** — 22% of catalog not yet on SFCC. Represents $6.2M in quarterly lost revenue from search exits\n3. **Einstein Personalization** — Only active on 48% of catalog. Full deployment projects +$18M annually\n4. **Budget Reallocation** — GA4 DDA shows we're over-investing in paid search, under-investing in email nurture\n\n**Watch Items:**\n- 14 high-value accounts inactive 90+ days ($4.2M at risk)\n- Mobile conversion flat at 2.4% while sessions grow 28%\n- Paid search CPCs up 22% YoY — diminishing returns\n\n**Active AI Agents:**\n- 💰 Revenue Agent: Dynamic pricing opportunity on top 200 SKUs\n- 📦 Merchandising Agent: 3,400 SKUs need enrichment\n- 🛒 Cart Recovery Agent: Deploying shipping threshold optimization\n- 🔄 Retention Agent: 14 accounts flagged for re-engagement\n- 📊 Marketing Agent: Budget reallocation model ready\n\nWhat area would you like to explore?`,
};
