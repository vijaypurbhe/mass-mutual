import {
  accounts,
  alerts,
  auditEvents,
  cases,
  claims,
  clients,
  documents,
  financialPlans,
  households,
  integrationHealth,
  interactions,
  knowledgeArticles,
  policies,
  referrals,
  workItems,
} from "@/data/seed";
import type {
  Account,
  AlertRecord,
  AuditEvent,
  CaseRecord,
  Claim,
  Client,
  DocumentRecord,
  FinancialPlan,
  Household,
  Interaction,
  KnowledgeArticle,
  Policy,
  Referral,
  WorkItem,
} from "@/types";

/** Simulated enterprise integration latency so loading states are demonstrable. */
const latency = <T,>(value: T, ms = 220): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

export interface SearchHit {
  group: "Clients" | "Households" | "Accounts" | "Policies" | "Claims" | "Cases";
  id: string;
  title: string;
  subtitle: string;
  href: string;
  meta: string;
  potentialDuplicate?: boolean;
}

export const ClientService = {
  list: () => latency(clients.filter((c) => !c.duplicateOf)),
  all: () => latency(clients),
  get: (id: string) => latency(clients.find((c) => c.id === id) ?? null),
  duplicatesOf: (id: string) => latency(clients.filter((c) => c.duplicateOf === id)),
  household: (householdId: string) => latency(households.find((h) => h.id === householdId) ?? null),
  households: () => latency(households),
  members: (householdId: string) => latency(clients.filter((c) => c.householdId === householdId && !c.duplicateOf)),
  alerts: (clientId: string) => latency(alerts.filter((a) => a.clientId === clientId)),
};

export const PolicyService = {
  byClient: (clientId: string) => latency(policies.filter((p) => p.clientId === clientId)),
  byHousehold: (memberIds: string[]) => latency(policies.filter((p) => memberIds.includes(p.clientId))),
  get: (id: string) => latency(policies.find((p) => p.id === id) ?? null),
  all: () => latency(policies),
};

export const AccountService = {
  byClient: (clientId: string) => latency(accounts.filter((a) => a.clientId === clientId)),
  get: (id: string) => latency(accounts.find((a) => a.id === id) ?? null),
  all: () => latency(accounts),
};

export const CaseService = {
  byClient: (clientId: string) => latency(cases.filter((c) => c.clientId === clientId)),
  get: (id: string) => latency(cases.find((c) => c.id === id) ?? null),
  all: () => latency(cases),
};

export const ClaimService = {
  byClient: (clientId: string) => latency(claims.filter((c) => c.clientId === clientId)),
  byPolicy: (policyId: string) => latency(claims.filter((c) => c.policyId === policyId)),
  get: (id: string) => latency(claims.find((c) => c.id === id) ?? null),
  all: () => latency(claims),
};

export const InteractionService = {
  byClient: (clientId: string) =>
    latency(interactions.filter((i) => i.clientId === clientId).sort((a, b) => (a.at < b.at ? 1 : -1))),
  all: () => latency(interactions),
};

export const DocumentService = {
  byClient: (clientId: string) => latency(documents.filter((d) => d.clientId === clientId)),
  all: () => latency(documents),
};

export const KnowledgeService = {
  all: () => latency(knowledgeArticles),
  search: (query: string) =>
    latency(
      knowledgeArticles.filter((a) =>
        `${a.title} ${a.summary} ${a.body} ${a.product} ${a.process}`.toLowerCase().includes(query.toLowerCase()),
      ),
    ),
  get: (id: string) => latency(knowledgeArticles.find((a) => a.id === id) ?? null),
};

export const WorkflowService = {
  items: () => latency(workItems),
  referrals: () => latency(referrals),
  plans: () => latency(financialPlans),
  planByClient: (clientId: string) => latency(financialPlans.find((p) => p.clientId === clientId) ?? null),
};

export const GovernanceService = {
  auditEvents: () => latency(auditEvents),
  integrationHealth: () => latency(integrationHealth),
  alerts: () => latency(alerts),
};

export const SearchService = {
  query: async (raw: string): Promise<SearchHit[]> => {
    const q = raw.trim().toLowerCase();
    if (!q) return [];
    const hits: SearchHit[] = [];
    const match = (...values: (string | undefined)[]) => values.some((v) => v?.toLowerCase().includes(q));

    clients.forEach((c) => {
      if (match(`${c.firstName} ${c.lastName}`, c.preferredName, c.memberId, c.advisor360Id, c.email, c.phone)) {
        hits.push({
          group: "Clients",
          id: c.id,
          title: `${c.firstName} ${c.lastName}`,
          subtitle: `${c.ageBand} · ${c.city}, ${c.state} · ${c.relationshipType}`,
          href: `/clients/${c.id}`,
          meta: `${c.advisorName} · ${households.find((h) => h.id === c.householdId)?.name ?? "No household"}`,
          potentialDuplicate: Boolean(c.duplicateOf),
        });
      }
    });

    households.forEach((h) => {
      if (match(h.name, h.segment)) {
        hits.push({ group: "Households", id: h.id, title: h.name, subtitle: h.segment, href: `/clients/${h.primaryClientId}`, meta: `${h.memberIds.length} members · ${h.advisorName}` });
      }
    });

    accounts.forEach((a) => {
      if (match(a.name, a.accountNumber, a.type)) {
        hits.push({ group: "Accounts", id: a.id, title: a.name, subtitle: a.type, href: `/clients/${a.clientId}/accounts/${a.id}`, meta: a.accountNumber });
      }
    });

    policies.forEach((p) => {
      if (match(p.productName, p.policyNumber, p.productFamily, p.ownerName)) {
        hits.push({ group: "Policies", id: p.id, title: p.productName, subtitle: `${p.productFamily} · ${p.status}`, href: `/clients/${p.clientId}/policies/${p.id}`, meta: p.policyNumber });
      }
    });

    claims.forEach((c) => {
      if (match(c.claimNumber, c.claimType, c.claimantName)) {
        hits.push({ group: "Claims", id: c.id, title: `${c.claimType} claim`, subtitle: `${c.status} · ${c.stage}`, href: `/claims/${c.id}`, meta: c.claimNumber });
      }
    });

    cases.forEach((c) => {
      if (match(c.caseNumber, c.subject, c.type)) {
        hits.push({ group: "Cases", id: c.id, title: c.subject, subtitle: `${c.type} · ${c.status}`, href: `/cases/${c.id}`, meta: c.caseNumber });
      }
    });

    return latency(hits, 260);
  },
};

export type {
  Account,
  AlertRecord,
  AuditEvent,
  CaseRecord,
  Claim,
  Client,
  DocumentRecord,
  FinancialPlan,
  Household,
  Interaction,
  KnowledgeArticle,
  Policy,
  Referral,
  WorkItem,
};
