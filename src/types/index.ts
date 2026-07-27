export type SourceSystem =
  | "Salesforce FSC"
  | "Salesforce Service"
  | "Data Cloud"
  | "Genesys Cloud CX"
  | "Informatica MDM"
  | "Policy Admin (Life70)"
  | "Wealth Platform (WMX)"
  | "FileNet"
  | "FPAS"
  | "Kafka Event Bus";

export type DataQualityStatus = "verified" | "review" | "stale" | "conflict";

export interface Provenance {
  sourceSystem: SourceSystem;
  sourceRecordId: string;
  lastSyncedAt: string;
  dataQualityStatus: DataQualityStatus;
  authoritativeSource: boolean;
}

export type PersonaId =
  | "service_rep"
  | "advisor"
  | "back_office"
  | "manager"
  | "admin"
  | "customer";

export interface Persona {
  id: PersonaId;
  name: string;
  title: string;
  team: string;
  initials: string;
  description: string;
}

export type Sentiment = "positive" | "neutral" | "negative";
export type Severity = "critical" | "high" | "medium" | "low";
export type SlaHealth = "on_track" | "at_risk" | "breached" | "met";

export interface ConsentPreference {
  channel: "Email" | "Phone" | "SMS" | "Postal Mail" | "Portal";
  marketing: boolean;
  servicing: boolean;
  updatedAt: string;
  capturedVia: string;
}

export interface Client extends Provenance {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  ageBand: string;
  city: string;
  state: string;
  memberId: string;
  advisor360Id: string;
  email: string;
  phone: string;
  householdId: string;
  advisorName: string;
  producerName: string;
  relationshipType: "Client" | "Prospect" | "Beneficiary" | "Former Client";
  relationshipTier: "Platinum" | "Gold" | "Silver" | "Standard";
  status: "Active Client" | "Lapsed" | "Prospect";
  clientSince: string;
  preferredLanguage: string;
  contactPreference: string;
  identityVerified: boolean;
  sentiment: Sentiment;
  consent: ConsentPreference[];
  duplicateOf?: string;
  notes: string;
}

export interface Household extends Provenance {
  id: string;
  name: string;
  primaryClientId: string;
  memberIds: string[];
  totalAssets: number;
  totalCoverage: number;
  advisorName: string;
  segment: string;
}

export type ProductFamily = "Protection" | "Wealth" | "Annuity" | "Worksite";

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  type: "Primary" | "Contingent";
  allocationPct: number;
  updatedAt: string;
}

export interface Policy extends Provenance {
  id: string;
  policyNumber: string;
  productName: string;
  productFamily: ProductFamily;
  status: "In Force" | "Grace Period" | "Pending" | "Lapsed" | "Paid Up";
  clientId: string;
  ownerName: string;
  insuredName: string;
  faceAmount?: number;
  accountValue?: number;
  premium: number;
  premiumMode: "Monthly" | "Quarterly" | "Annual";
  beneficiaryStatus: "Current" | "Review recommended" | "Incomplete";
  beneficiaries: Beneficiary[];
  effectiveDate: string;
  nextKeyDate: string;
  nextKeyDateLabel: string;
  riders: { name: string; status: string; amount?: number }[];
  requirements: { name: string; status: "Received" | "Outstanding" | "Waived"; due?: string }[];
  billing: { date: string; amount: number; method: string; status: string }[];
}

export interface PortfolioPosition {
  symbol: string;
  name: string;
  assetClass: "Equity" | "Fixed Income" | "Cash" | "Alternatives";
  value: number;
  weightPct: number;
  ytdReturnPct: number;
}

export interface Account extends Provenance {
  id: string;
  accountNumber: string;
  name: string;
  type: "Wealth Account" | "Protection Account" | "Retirement" | "Brokerage" | "Cash";
  clientId: string;
  balance: number;
  cash: number;
  ytdContributions: number;
  ytdWithdrawals: number;
  riskProfile: "Conservative" | "Moderate" | "Growth" | "Aggressive";
  openedDate: string;
  positions: PortfolioPosition[];
  history: { month: string; value: number }[];
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetYear: number;
  onTrack: boolean;
}

export interface FinancialPlan extends Provenance {
  id: string;
  clientId: string;
  householdId: string;
  status: "Active" | "Draft" | "Review Due" | "Not Started";
  completenessPct: number;
  riskTolerance: string;
  lastReviewDate: string;
  nextReviewDate: string;
  goals: FinancialGoal[];
  recommendations: { id: string; title: string; rationale: string; status: "Awaiting advisor review" | "Accepted" | "Declined" }[];
  missingData: string[];
  scenarios: { name: string; successProbability: number; note: string }[];
}

export interface CaseRecord extends Provenance {
  id: string;
  caseNumber: string;
  type: string;
  subject: string;
  description: string;
  status: "New" | "In Progress" | "Awaiting Client" | "Escalated" | "Resolved" | "Closed";
  priority: Severity;
  ownerName: string;
  queue: string;
  channel: "Phone" | "Chat" | "Email" | "Portal" | "Mail" | "Advisor";
  clientId: string;
  policyId?: string;
  accountId?: string;
  claimId?: string;
  openedDate: string;
  dueDate: string;
  slaHealth: SlaHealth;
  activities: { at: string; actor: string; type: string; detail: string }[];
  tasks: { id: string; label: string; done: boolean; owner: string }[];
  requiredDocuments: { name: string; received: boolean }[];
  resolutionCriteria: { label: string; met: boolean }[];
}

export type ClaimStage =
  | "Notice received"
  | "Identity and coverage verified"
  | "Requirements requested"
  | "Documentation review"
  | "Assessment"
  | "Decision"
  | "Payment or closure";

export interface Claim extends Provenance {
  id: string;
  claimNumber: string;
  claimType: string;
  clientId: string;
  policyId: string;
  claimantName: string;
  claimantRelationship: string;
  dateOfEvent: string;
  reportedDate: string;
  targetCompletionDate: string;
  status: "Open" | "Pending Requirements" | "Under Review" | "Approved" | "Denied" | "Closed";
  stage: ClaimStage;
  examiner: string;
  amountRequested?: number;
  amountApproved?: number;
  requirements: { name: string; status: "Received" | "Outstanding" | "Waived"; requestedOn?: string }[];
  coverageVerified: boolean;
  parties: { name: string; role: string; relationship: string }[];
  communications: { at: string; channel: string; summary: string }[];
  auditTrail: { at: string; actor: string; action: string }[];
}

export interface Interaction extends Provenance {
  id: string;
  clientId: string;
  channel: "Voice" | "Chat" | "Email" | "Portal" | "Mobile" | "Mail" | "Advisor Meeting" | "AI Agent";
  at: string;
  durationMinutes?: number;
  participants: string[];
  subject: string;
  summary: string;
  sentiment: Sentiment;
  caseId?: string;
  transcript?: { speaker: string; text: string }[];
}

export interface WorkItem extends Provenance {
  id: string;
  workItemId: string;
  type: string;
  category: "My Work" | "Team Queue" | "Task" | "Approval" | "Exception" | "Automation";
  clientId?: string;
  relatedRecord: string;
  priority: Severity;
  status: "Not Started" | "In Progress" | "Waiting" | "Blocked" | "Complete";
  assignedTo: string;
  queue: string;
  dueDate: string;
  slaHealth: SlaHealth;
  lastActivity: string;
}

export interface DocumentRecord extends Provenance {
  id: string;
  name: string;
  type: "Policy Contract" | "Statement" | "Claim Form" | "Correspondence" | "Identity Document" | "Financial Plan" | "Disclosure";
  repository: "FileNet" | "Salesforce Files" | "Wealth Platform" | "FPAS Vault";
  clientId?: string;
  relatedRecord: string;
  owner: string;
  date: string;
  classification: "Public" | "Internal" | "Confidential" | "Restricted";
  retention: string;
  pages: number;
  excerpt: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  product: string;
  process: string;
  persona: PersonaId[];
  jurisdiction: string;
  channel: string;
  source: "Approved Knowledge" | "Draft" | "External Reference";
  owner: string;
  effectiveDate: string;
  approvalStatus: "Approved" | "In Review" | "Expiring";
  featured: boolean;
}

export interface Referral {
  id: string;
  clientId: string;
  householdName: string;
  type: string;
  estimatedValue: number;
  stage: "Identified" | "Contacted" | "Meeting Set" | "Proposal" | "Won" | "Lost";
  source: string;
  createdAt: string;
  owner: string;
}

export interface AlertRecord {
  id: string;
  clientId?: string;
  title: string;
  detail: string;
  severity: Severity;
  owner: string;
  dueDate: string;
  actionLabel: string;
  actionHref?: string;
  category: "Identity" | "Claims" | "Policy" | "Planning" | "Consent" | "Complaint" | "Service";
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  record: string;
  detail: string;
  channel: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  rationale: string;
  confidence: "High" | "Medium" | "Low";
  citations: { label: string; recordId: string }[];
  suggestedAction: string;
  requiresConfirmation: boolean;
}
