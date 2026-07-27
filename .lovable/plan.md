## Goal

Delete the existing Mazda / GE Vernova demo entirely and build the **Unified Financial Services Engagement Hub** in its place — same Vite + React Router + Tailwind + shadcn spine, new product from the ground up. Full breadth in one pass: all routes, all six personas, all flagship screens.

## Removal

Delete `src/pages/mazda/*`, `src/pages/Index.tsx`, `Login.tsx`, `LoginReport.tsx`, all bespoke components (`MazdaAppShell`, `AgentCard`, `KpiTile`, `RevenueChart`, `ScenarioPanel`, `GovernancePanel`, `StreamingAlerts`, etc.), `src/data/mockData.ts`, and edge functions `mazda-chat` + `agent-chat`. Keep shadcn `ui/` primitives, Tailwind config, and the Supabase client.

## Design system

Rebuild `index.css` tokens: white/light-neutral page surfaces, deep navy nav, indigo primary, teal positive, amber warning, red critical. Inter typography, compact data-dense tables, 150–250ms motion, reduced-motion respected. No glassmorphism, no gradients, no hero sections. Dark mode retained via tokens.

## Route map

```text
/login                                  persona picker (mock auth)
/home                                   role-aware home (Rep / Advisor / Manager / Back-office)
/search                                 universal search + duplicate resolution
/clients/:clientId                      Client 360 (flagship, 9 tabs)
/clients/:clientId/policies/:policyId   policy detail
/clients/:clientId/accounts/:accountId  account/portfolio detail
/cases/:caseId                          case workbench
/claims/:claimId                        claim workspace + stage tracker
/work                                   6 tabs: My Work, Team Queue, Tasks, Approvals, Exceptions, Automation
/knowledge                              federated knowledge + cited AI answers
/documents                              virtual multi-repository document list
/analytics                              5 dashboards (Service, Claims, CX, Advisor, AI Ops)
/admin                                  roles, audit, integration health, AI action log
/self-service                           customer shell (separate lighter chrome)
```

## Shell

Collapsible left nav (role-aware, badge counts), top bar (global search, active-interaction indicator, notifications, help, persona switcher), right utility panel with tabs AI Copilot / Interaction Notes / Knowledge / Collaboration (resizable, drawer on mobile), Cmd+K command menu, Recently Viewed + Pinned Clients, breadcrumbs.

## Roles and auth

Mock persona login — no backend auth. Persona context in React state + localStorage: Service Rep, Advisor, Back-Office, Manager, Admin/Auditor, Customer. A permission matrix drives nav items, visible tabs, action availability, unauthorized states, and field masking (masked IDs reveal only via explicit permission-aware action).

## Data + service layer

Typed models in `src/types/`: Client, Household, Policy, Account, Beneficiary, PortfolioPosition, FinancialGoal, FinancialPlan, Case, Claim, Interaction, Task, WorkflowInstance, Document, KnowledgeArticle, Referral, Alert, ConsentPreference, AuditEvent, SourceSystemReference, AIRecommendation — each with `sourceSystem`, `sourceRecordId`, `lastSyncedAt`, `dataQualityStatus`, `authoritativeSource`.

Seed data (fictional, realistic, includes duplicate/at-risk/incomplete scenarios): 12 clients, 6 households, 18 policies, 10 accounts, 14 cases, 8 claims, 40 interactions, 30 work items, 20 documents, 15 knowledge articles, 10 referrals, 15 alerts. Anchor client **Jordan Lee** / **Lee Family**.

Service interfaces (`ClientService`, `PolicyService`, `CaseService`, `ClaimService`, `DocumentService`, `KnowledgeService`, `InteractionService`, `WorkflowService`, `AIService`) backed by seed data with simulated latency, consumed through TanStack Query so adapters can be swapped for real APIs later.

## AI Copilot (real AI)

New `ai-copilot` edge function on Lovable Cloud using the AI SDK + Lovable AI Gateway (`google/gemini-3.6-flash`), streaming. The client sends the current screen's record context; the system prompt enforces the guardrails: no legal/tax/medical/coverage/investment advice, no final decisions, citations to real seeded record IDs, confidence indicator, "review before use" notice, and explicit user confirmation before any record-creating suggested action. AI action log written into the admin view.

## Reusable components

App shell, page header, metric card, client identity header, alert banner, filter bar, data table, timeline, relationship map, policy card, status badge, SLA indicator, stage tracker, activity composer, guided-flow stepper, side drawer, confirmation modal, empty / error / unauthorized states, skeleton loader, AI answer card with citations, source-system badge.

## Guided flows

Stepper-driven, save-and-resume, Zod-validated: identity verification, contact update, beneficiary change, policy document request, claim intake, complaint escalation, financial-plan review prep. Each produces an auditable work item rather than mutating a record silently.

## Demo scenarios wired end-to-end

1. Rep authenticates a simulated call, finds Jordan Lee by masked member ID, verifies identity, opens a beneficiary-change case, completes after-call work.
2. Claim intake from a protection policy through to the claim workspace and "Requirements requested".
3. Advisor prepares the Lee household review via FPAS "Prepare for meeting".
4. Manager filters SLA-at-risk work in the Command Center and bulk-reassigns with confirmation + audit event.
5. Customer self-service: view policies, check claim status, send a secure message, update preferences.

## Quality pass

Strict TypeScript, WCAG 2.2 AA (keyboard nav, focus trapping/return, skip link, semantic headings, tabular alternatives for charts, no color-only status), responsive to tablet/mobile, loading/empty/error/unauthorized states everywhere, no dead primary actions. Updated `index.html` title and meta description.

## Sequencing within the build

Tokens + shell → persona/permissions → data model + seed + services → search → Client 360 → case + claim workspaces → work queues + guided flows → advisor/FPAS → Copilot → analytics → self-service → admin → accessibility/QA sweep.

This is a large build and will run across multiple passes; each pass leaves the app in a working, navigable state.