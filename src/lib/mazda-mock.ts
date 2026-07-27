// Mazda Automotive Cloud + Agentforce concept prototype mock data.
// Ported from the standalone Mazda Connect Vision project.

export type PersonaId = "field" | "agent" | "dealer" | "partner";

export const PERSONAS: Record<PersonaId, {
  id: PersonaId;
  name: string;
  role: string;
  org: string;
  agentName: string;
  initials: string;
  app: string;
}> = {
  field: {
    id: "field",
    name: "Marcus Avila",
    role: "Regional Lifecycle & Field Manager — West",
    org: "Mazda North American Operations (MNAO)",
    agentName: "Atlas for MNAO",
    initials: "MA",
    app: "Lifecycle & Dealer Performance",
  },
  agent: {
    id: "agent",
    name: "Renee Okafor",
    role: "Senior Owner Support Specialist",
    org: "Mazda Customer Experience Center",
    agentName: "Atlas for Owner Support",
    initials: "RO",
    app: "Owner Support Console",
  },
  dealer: {
    id: "dealer",
    name: "Priya Shah",
    role: "General Sales Manager",
    org: "Galpin Mazda — Van Nuys, CA · Dealer #45821",
    agentName: "Atlas for Dealer",
    initials: "PS",
    app: "Dealer Workbench",
  },
  partner: {
    id: "partner",
    name: "Hideo Tanaka",
    role: "Connected Vehicle & Subscription Lead",
    org: "Mazda Connected Services + Mazda Financial Services",
    agentName: "Atlas for Partners",
    initials: "HT",
    app: "Connected Vehicle Partner Portal",
  },
};

export const KPIS: Record<PersonaId, { label: string; value: string; delta: string; positive: boolean }[]> = {
  field: [
    { label: "Lead → Dealer SLA (West)", value: "1h 42m", delta: "−24m vs target", positive: true },
    { label: "DR Lead Acceptance", value: "92%", delta: "+3 pts", positive: true },
    { label: "Test-Drive → Sale", value: "34%", delta: "+1.8 pts", positive: true },
    { label: "Dealer CSI Avg", value: "934", delta: "+6", positive: true },
  ],
  agent: [
    { label: "Open Owner Cases", value: "186", delta: "−12 since 6am", positive: true },
    { label: "First-Contact Resolution", value: "78%", delta: "+4 pts", positive: true },
    { label: "Siebel MGSS Decoupled", value: "61%", delta: "+8 pts QoQ", positive: true },
    { label: "Avg Handle Time", value: "6:12", delta: "−1:08", positive: true },
  ],
  dealer: [
    { label: "DR Leads in Queue", value: "186", delta: "+12 today", positive: true },
    { label: "Test Drives Booked", value: "47", delta: "+9 wk/wk", positive: true },
    { label: "Open Service ROs", value: "31", delta: "−3", positive: true },
    { label: "Open Recall Campaigns", value: "8 VINs", delta: "C2451 · CX-5", positive: false },
  ],
  partner: [
    { label: "Active CV Subscribers", value: "284,610", delta: "+1.2% MoM", positive: true },
    { label: "Renewal Rate (Trailing 90d)", value: "87.4%", delta: "+0.9 pts", positive: true },
    { label: "MFS Lease Maturity (90d)", value: "11,842", delta: "Trade-cycle window", positive: true },
    { label: "DTC P0420 — 2024 CX-50", value: "6.2× baseline", delta: "Engineering review opened", positive: false },
  ],
};

export type BriefingItem = {
  id: string;
  icon: "lead" | "alert" | "claim" | "score";
  title: string;
  detail: string;
  source: string;
};

export const BRIEFING: Record<PersonaId, BriefingItem[]> = {
  field: [
    { id: "b1", icon: "lead", title: "312 digital-retail leads landed overnight", detail: "From MazdaUSA configurator, CarNow and AutoFi. Auto-routed to 47 West-region dealers; 18 stalled past 48h SLA at Galpin Mazda.", source: "Auto Cloud Lead Mgmt · MuleSoft (Cox / CDK / CarNow / AutoFi APIs)" },
    { id: "b2", icon: "score", title: "Galpin Mazda CSI dropped 14 points", detail: "Service-lane satisfaction declined week-over-week. Driven by 3 escalated owner cases now in MGSS-decoupled queue.", source: "Dealer Scorecard · Medallia CX360" },
    { id: "b3", icon: "alert", title: "Lease maturity surge — 312 households at 33 mo", detail: "MFS shows lease-end inside 90d window. Trade-cycle propensity > 0.72. Dealer hand-off list ready.", source: "Mazda Financial Services · Data Cloud activation" },
  ],
  agent: [
    { id: "b1", icon: "alert", title: "Recall Campaign C2451 — CX-5 software update", detail: "184 households in your queue have received the recall notice. Atlas drafted personalized outreach with nearest dealer and open service slot.", source: "MGWS Recall · MyMazda · Auto Cloud Service Console" },
    { id: "b2", icon: "claim", title: "Owner Support case CV-44210 escalated", detail: "Connected vehicle subscription lapsed mid-drive — Stripe payment retry failed twice. Atlas surfaced billing context, MyMazda app session, and renewal SMS draft.", source: "Stripe · MyMazda · CV Subscription" },
    { id: "b3", icon: "score", title: "Siebel CAC volume down 38% this week", detail: "Decoupled FAQ + roadside flows now resolve in Service Console. 1,284 contacts deflected from Siebel since Monday.", source: "Siebel CAC → Auto Cloud transition KPI" },
  ],
  dealer: [
    { id: "b1", icon: "lead", title: "9 hot DR leads waiting follow-up", detail: "Einstein scored 80+. Two are MazdaUSA configurator + AutoFi credit pre-qual with appointment requested.", source: "Auto Cloud Lead Mgmt · MazdaUSA / AutoFi" },
    { id: "b2", icon: "claim", title: "Warranty claim drafted for VIN ...4F2A", detail: "DTC P0420 fired this morning via MyMazda. Atlas pre-filled parts, labor, MGWS policy match — ready to submit.", source: "MyMazda CV stream · MGWS warranty" },
    { id: "b3", icon: "alert", title: "8 CX-5 owners due Recall C2451", detail: "Software update — 1.2 hr labor each. Atlas drafted SMS with one-tap booking on your DMS calendar.", source: "MGWS · Dealer DMS · Auto Cloud" },
  ],
  partner: [
    { id: "b1", icon: "alert", title: "DTC P0420 trend — 2024 CX-50 fleet", detail: "Catalyst signal climbing 6.2× baseline across 14 dealers. Atlas opened engineering review with affected VIN list and CV diagnostic logs.", source: "Connected Vehicle Telematics · Databricks" },
    { id: "b2", icon: "claim", title: "CV subscription renewal at risk: 4,120 owners", detail: "Subscription expiring inside 30d, no engagement past 14d. Stripe pre-auth ready; renewal journey staged in Auto Cloud + AEP.", source: "Stripe · MyMazda · AEP" },
    { id: "b3", icon: "score", title: "MFS lease-maturity → trade-cycle handoff", detail: "11,842 leases mature inside 90d. Atlas synced household data to dealer actionable lists for in-person trade conversations.", source: "Mazda Financial Services · Auto Cloud Household" },
  ],
};

export type SuggestedAction = {
  id: string;
  title: string;
  rationale: string;
  effort: "1-click" | "Review & send" | "Approve plan";
};

export const SUGGESTED: Record<PersonaId, SuggestedAction[]> = {
  field: [
    { id: "s1", title: "Re-route 18 stale CX-90 DR leads from Galpin to backup dealers", rationale: "SLA breached >48h; backup capacity at Browning + South Coast confirmed.", effort: "1-click" },
    { id: "s2", title: "Trigger lease-maturity journey for 312 households", rationale: "33-month tenure window; trade-cycle propensity > 0.72. AEP segment + Auto Cloud journey staged.", effort: "Approve plan" },
    { id: "s3", title: "Schedule coaching call with Galpin Mazda GSM", rationale: "CSI down 14 pts and 3 escalations decoupled from Siebel — needs visit prep before Friday.", effort: "Approve plan" },
  ],
  agent: [
    { id: "s1", title: "Approve recall outreach for 184 CX-5 owners (Campaign C2451)", rationale: "Personalized SMS + nearest dealer + open service slot. Skips Siebel; logs straight to MGWS.", effort: "Approve plan" },
    { id: "s2", title: "Send Stripe renewal retry + CV subscription SMS", rationale: "Owner CV-44210 lost connected services mid-drive — recovery flow ready.", effort: "1-click" },
    { id: "s3", title: "Deflect MyMazda app login failures from Siebel CAC", rationale: "Knowledge article + reset link via Agentforce; 218 contacts predicted this week.", effort: "Review & send" },
  ],
  dealer: [
    { id: "s1", title: "Send test-drive confirmation to Tanaka household", rationale: "CX-90 PHEV booked Saturday 10am — SMS draft references prior CX-50 ownership.", effort: "1-click" },
    { id: "s2", title: "Submit warranty claim for VIN ...4F2A", rationale: "MGWS pre-filled · saves 18 min advisor time vs manual entry.", effort: "Review & send" },
    { id: "s3", title: "Book 8 CX-5 owners into Recall C2451 service slots", rationale: "MyMazda push + SMS with your DMS open inventory of 1.2hr slots.", effort: "Approve plan" },
  ],
  partner: [
    { id: "s1", title: "Open engineering review for catalyst trend", rationale: "P0420 6.2× baseline across 14 dealers — root cause analysis required.", effort: "Approve plan" },
    { id: "s2", title: "Run CV subscription save campaign — 4,120 owners", rationale: "Renewal at risk; Stripe pre-auth + MyMazda push + lifecycle email staged.", effort: "Review & send" },
    { id: "s3", title: "Hand 11,842 maturing leases to dealer actionable lists", rationale: "MFS data joined to household + garage; ready for dealer trade conversations.", effort: "1-click" },
  ],
};

export type ReasoningStep = { step: string; detail: string; source: string };

export const REASONING: Record<PersonaId, ReasoningStep[]> = {
  field: [
    { step: "Pulled overnight signals", detail: "312 DR leads, 47 dealers, 1,284 CV events ingested into Data Cloud key-ring.", source: "Data Cloud · MuleSoft (Cox/CDK/CarNow/AutoFi)" },
    { step: "Applied Mazda SLA + scorecard rules", detail: "Flagged any lead >48h with no dealer touch; overlaid CSI delta > ±10 pts threshold.", source: "Mazda SLA Policy v3.2 · Scorecard Engine" },
    { step: "Joined MFS lease-maturity window", detail: "Identified 312 households inside 33-month tenure with trade-cycle propensity > 0.72.", source: "Mazda Financial Services · Trade-Cycle Model" },
    { step: "Drafted action plan", detail: "Three suggested next actions ranked by impact × effort — awaiting your approval.", source: "Atlas · Agentforce reasoning" },
  ],
  agent: [
    { step: "Resolved customer identity", detail: "Matched inbound call to Tanaka household via key-ring (phone, MyMazda profile, VIN history).", source: "Data Cloud Identity Resolution" },
    { step: "Loaded vehicle + recall context", detail: "VIN ...4F2A: open Recall C2451, active CV subscription (Stripe), warranty year 1 of 8.", source: "MyMazda · MGWS · Stripe" },
    { step: "Searched Siebel-decoupled knowledge", detail: "Pulled article KB-CV-118 (subscription lapse recovery) and approved SMS template.", source: "Auto Cloud Knowledge · Agentforce" },
    { step: "Drafted next-best-action", detail: "Stripe retry + CV subscription SMS; logged interaction in Service Console (not Siebel CAC).", source: "Auto Cloud Service Console" },
  ],
  dealer: [
    { step: "Synced overnight data", detail: "Inbound DR leads, MyMazda CV events, MGWS open campaigns for assigned VINs.", source: "Auto Cloud Lead + Service Console" },
    { step: "Scored leads", detail: "Einstein lead scoring on 9 hot leads (80+ score) — ranked by close probability + AutoFi pre-qual.", source: "Einstein Lead Scoring · AutoFi" },
    { step: "Matched DTC to MGWS warranty policy", detail: "VIN ...4F2A · P0420 falls within 8yr/80k powertrain warranty. Drafted claim with parts + labor.", source: "MGWS Policy Engine" },
    { step: "Composed customer touches", detail: "SMS + MyMazda push templates personalized with vehicle, service history, dealer brand voice.", source: "AEP / Marketing Cloud · Personalization" },
  ],
  partner: [
    { step: "Aggregated DTC + subscription stream", detail: "Pulled P0420 events across all 2024 CX-50 VINs (1.2M events) + Stripe subscription state.", source: "CV Telematics · Stripe · Databricks" },
    { step: "Statistical baseline check", detail: "Current 7-day rate is 6.2× rolling 90-day baseline — exceeds engineering trigger.", source: "Anomaly Detection · Databricks" },
    { step: "Mapped to component BOM + MFS contracts", detail: "Trend isolated to catalyst P/N 8DC-20-130; 11,842 MFS leases mature inside 90-day window.", source: "Bill of Materials · MFS contract data" },
    { step: "Prepared partner brief", detail: "Engineering review draft + CV save campaign + dealer actionable lists handed off.", source: "Atlas · Agentforce" },
  ],
};

export const LEADS = [
  { id: "L-9821", customer: "Jordan Fielding", model: "CX-90 PHEV", source: "MazdaUSA Configurator", dealer: "Galpin Mazda", score: 92, stage: "Test Drive", sla: "On track", aged: "6h" },
  { id: "L-9822", customer: "Tanaka Household", model: "CX-90 PHEV", source: "AutoFi · Pre-qual", dealer: "Galpin Mazda", score: 88, stage: "Quote", sla: "On track", aged: "1d" },
  { id: "L-9823", customer: "Renee Okafor", model: "CX-50 Hybrid", source: "CarNow · Chat", dealer: "Browning Mazda", score: 81, stage: "Qualified", sla: "On track", aged: "12h" },
  { id: "L-9824", customer: "Diego Marin", model: "MX-5 Miata", source: "MazdaUSA Configurator", dealer: "Puente Hills Mazda", score: 76, stage: "Inquiry", sla: "Breached", aged: "3d" },
  { id: "L-9825", customer: "Aisha Patel", model: "CX-90", source: "Mazda Owner Event", dealer: "Galpin Mazda", score: 71, stage: "Inquiry", sla: "Watch", aged: "2d" },
  { id: "L-9826", customer: "Wei Chen", model: "CX-30", source: "Cox / Dealer.com", dealer: "South Coast Mazda", score: 68, stage: "Qualified", sla: "On track", aged: "8h" },
];

export const PIPELINE_STAGES = ["Inquiry", "Qualified", "Test Drive", "Quote", "F&I", "Closed Won"] as const;

export const VEHICLE = {
  vin: "JM3KFBDM7R0234F2A",
  model: "2024 Mazda CX-50 Turbo Premium Plus",
  color: "Soul Red Crystal Metallic",
  owner: "Tanaka Household · Primary: Hideo · MyMazda ID 8841092",
  mileage: 18420,
  battery: { soh: 94, voltage: 12.6 },
  inService: "Mar 14, 2024",
  warranty: { type: "Powertrain 8yr / 80,000 mi (MGWS)", expires: "Mar 14, 2032" },
  cvSubscription: { plan: "Mazda Connected Services Premium", status: "Active", renewsOn: "Mar 14, 2026", billing: "Stripe · Visa ••4421" },
  openCampaign: { id: "C2451", desc: "CX-5/CX-50 powertrain control software update", status: "Open · not yet booked" },
  dtc: [
    { code: "P0420", desc: "Catalyst System Efficiency Below Threshold (Bank 1)", severity: "Med", time: "2h ago" },
    { code: "B1437", desc: "Climate control sensor — informational", severity: "Low", time: "3d ago" },
  ],
  history: [
    { date: "Apr 02, 2025", event: "10,000 mi service · Galpin Mazda (DMS RO #44120)", note: "Oil + tire rotation · CSI 9.4" },
    { date: "Nov 18, 2024", event: "Recall MZ-2024-08 completed via MGWS", note: "Software update applied" },
    { date: "Mar 14, 2024", event: "Vehicle delivered · Mazda Promise journey started", note: "Sold by Galpin Mazda · MyMazda activated" },
  ],
};

export const WARRANTY_DRAFT = {
  claimId: "WC-2025-04-2841",
  vin: "JM3KFBDM7R0234F2A",
  failureCode: "P0420",
  partsRequested: [
    { pn: "8DC-20-130", desc: "Catalyst Converter Assy (Bank 1)", qty: 1, unit: "$1,284.00" },
    { pn: "9YA-21-001", desc: "O2 Sensor — downstream", qty: 1, unit: "$148.00" },
  ],
  laborCodes: [
    { code: "EX-205", desc: "Catalyst R&R", hours: 2.4 },
    { code: "EL-118", desc: "Sensor diagnostic + replace", hours: 0.6 },
  ],
  policyMatch: "MGWS Powertrain 8yr/80k — covered (year 1, 18,420 mi)",
  estimatedTotal: "$1,684.20",
};

export const DEALER_SCORECARD = {
  name: "Galpin Mazda",
  city: "Van Nuys, CA · Dealer #45821",
  metrics: [
    { label: "DR Lead Acceptance", value: "88%", trend: "−4 pts", good: false },
    { label: "Lead Follow-up SLA", value: "2h 18m", trend: "+22m vs target", good: false },
    { label: "Test-Drive → Sale", value: "36%", trend: "+2 pts", good: true },
    { label: "CSI", value: "884", trend: "−14", good: false },
    { label: "CV Activation Rate", value: "91%", trend: "+3 pts", good: true },
    { label: "Owner's Club Enrollment", value: "67%", trend: "+5 pts", good: true },
    { label: "Recall Completion (C2451)", value: "42%", trend: "76 VINs open", good: false },
    { label: "MGWS Submit Time", value: "1.2d", trend: "−0.4d", good: true },
  ],
  visit: {
    date: "Friday, May 2 · 10:00 AM",
    rep: "Marcus Avila",
    talkingPoints: [
      "DR lead acceptance fell 4 pts — review Cox + AutoFi handoff with BDC team.",
      "CSI dipped 14 pts; 3 owner cases decoupled from Siebel CAC need dealer-side closure.",
      "76 CX-5 VINs still open on Recall C2451 — Atlas can push booking SMS via MyMazda.",
      "Trade-cycle: 24 households in your PMA hit 33-mo lease maturity inside 60d.",
      "Recognize CX-90 PHEV close rate (38%) — top quartile in West region.",
    ],
  },
};

export const HOUSEHOLD = {
  name: "Tanaka Household",
  primary: "Hideo Tanaka",
  members: [
    { name: "Hideo Tanaka", role: "Primary driver · MyMazda ID 8841092", email: "h.tanaka@example.com" },
    { name: "Mei Tanaka", role: "Co-driver / spouse · Owner's Club Gold", email: "m.tanaka@example.com" },
    { name: "Kenji Tanaka", role: "Co-driver / son (18) · first-vehicle signal", email: "kenji@example.com" },
  ],
  garage: [
    { vin: "JM3KFBDM7R0234F2A", model: "2024 CX-50 Turbo", status: "Active · CV subscribed · open recall" },
    { vin: "JM1NDAD79N0512Z31", model: "2022 MX-5 Miata RF", status: "Active · MFS lease 26 mo remaining" },
    { vin: "JM3TCBDY8L0445B11", model: "2020 CX-9 Signature", status: "Sold back · 2024 trade" },
  ],
  finance: [
    { type: "Mazda Capital Lease", vehicle: "2022 MX-5 Miata RF", remaining: "26 mo", monthly: "$489" },
  ],
  ltv: "$184,200",
  marketing: { lastEngaged: "12d ago · CX-90 PHEV email (AEP)", optIn: true },
  tradeCycle: { propensity: 0.78, window: "Stage 5 — repurchase inside 90d", nextBest: "CX-90 PHEV — matches household profile + Owner's Club Gold offer" },
};

export const FLEET_DTC_TREND = [
  { month: "Nov", count: 12 },
  { month: "Dec", count: 18 },
  { month: "Jan", count: 24 },
  { month: "Feb", count: 41 },
  { month: "Mar", count: 78 },
  { month: "Apr", count: 142 },
];