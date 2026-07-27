

# Convert Demo to Production Dashboard — Feasibility & Plan

## Short answer

Yes, this is fully achievable. Every tile, chart, agent, and the command center can be wired to real Salesforce Commerce Cloud (SFCC), GA4, and Agentforce data without changing the UI. The work is primarily **data integration + backend orchestration** — the React frontend stays largely as-is.

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│  React Dashboard (current UI — unchanged)               │
└──────────────┬──────────────────────────────────────────┘
               │ React Query / SSE
┌──────────────▼──────────────────────────────────────────┐
│  Lovable Cloud (Supabase) — Edge Functions + Postgres   │
│  • /api/kpis        • /api/channels    • /api/forecast  │
│  • /api/alerts (SSE)• /api/agent-chat  • /api/scenarios │
└──┬────────────┬───────────────┬────────────┬────────────┘
   │            │               │            │
   ▼            ▼               ▼            ▼
 SFCC OCAPI   GA4 Data API   Agentforce   Marketing Cloud
 (orders,    (sessions,     (Einstein    (campaigns,
  SKUs,       conversions,   agents,      attribution)
  carts)      attribution)   actions)
```

## Data source mapping (every panel)

| Dashboard element | Real data source | API |
|---|---|---|
| 8 KPI tiles (Revenue, AOV, Conversion, Sessions, etc.) | SFCC + GA4 | OCAPI Orders + GA4 `runReport` |
| Revenue chart (90-day trend) | GA4 | GA4 `runReport` (date, totalRevenue) |
| Channel performance table | GA4 | GA4 (sessionDefaultChannelGroup) |
| Streaming alerts | SFCC webhooks + GA4 anomaly | Realtime channel + Edge Function |
| Forecasting panel | Historical GA4 + ML | Lovable AI (Gemini) or BigQuery ML |
| 5 AI agents (Revenue, Merch, Cart, Retention, Attribution) | Agentforce | Salesforce Agentforce REST API |
| Command Center chat | Agentforce + RAG over SFCC/GA4 | Edge function w/ tool calling |
| Customer profile (360°) | Data Cloud | Data Cloud Profile API |
| Budget optimization | Marketing Cloud + GA4 ROAS | MC REST + GA4 |
| Governance panel | Internal audit table | Postgres (already partially exists) |
| Data lineage | Static config / metadata | Postgres metadata table |

## Implementation phases

**Phase 1 — Foundation (1-2 weeks)**
- Connect SFCC (OAuth client credentials, OCAPI Shop/Data API)
- Connect GA4 (service account, Data API v1)
- Connect Agentforce (Connected App, OAuth JWT bearer flow)
- Store credentials as Lovable Cloud secrets
- Build connector edge functions: `sfcc-client`, `ga4-client`, `agentforce-client`

**Phase 2 — KPIs & Charts (1-2 weeks)**
- Replace `mockData.ts` with React Query hooks hitting edge functions
- Implement caching layer (Postgres materialized tables refreshed every 15 min)
- Wire revenue chart, channel table, KPI tiles to live queries

**Phase 3 — Agents & Command Center (2-3 weeks)**
- Replace mock Gemini system prompts with Agentforce agent invocations
- Implement RAG: index SFCC product catalog + GA4 reports in pgvector
- Wire 5 agent cards to specific Agentforce agent IDs
- Command Center: tool-calling agent with access to SFCC/GA4 query tools

**Phase 4 — Realtime & Forecasting (1-2 weeks)**
- SFCC webhooks → Postgres → Supabase Realtime → Streaming Alerts panel
- Forecasting: Gemini-based time-series or BigQuery ML ARIMA_PLUS
- Scenario simulator: parameterized SAQL/SQL queries

**Phase 5 — Production hardening (1 week)**
- Auth: replace demo gate with real SSO (Salesforce or Google Workspace)
- RBAC: Executive / Analyst / Admin roles using existing `user_roles` table
- Audit logging, rate limiting, error monitoring

## What you'll need from Salesforce / Google

1. **SFCC**: OCAPI client ID + secret, instance URL, site ID
2. **GA4**: Service account JSON with Viewer access, Property ID
3. **Agentforce**: Connected App with `api` + `agent_api` scopes, 5 deployed agent IDs
4. **Marketing Cloud** (optional): API integration with Journey Builder access
5. **Data Cloud** (optional): Connected App with Data Cloud Query API access

## Key technical notes

- **No frontend rewrite required** — components already accept props; only data source swaps
- **Lovable AI Gateway** can power Command Center if Agentforce is unavailable
- **Streaming**: Existing SSE pattern in `streamChat.ts` works directly with Agentforce streaming responses
- **Caching is critical** — GA4 and SFCC have rate limits; cache aggregates in Postgres
- **Cost**: Agentforce is per-conversation; budget for ~$2 per agent session at scale

## Estimated effort

- **MVP (KPIs + 1 agent live)**: 3-4 weeks, 1 full-stack engineer
- **Full production parity**: 7-9 weeks, 1 engineer + 1 Salesforce admin
- **Enterprise hardening (SSO, audit, SLA)**: +2 weeks

## Deliverable on approval

A working production dashboard with the same UI, powered by real SFCC + GA4 + Agentforce data, deployed on Lovable Cloud with auth, caching, and monitoring in place.

