import { AlertBanner } from "@/components/common/AlertBanner";
import { DataTable } from "@/components/common/DataTable";
import { MaskedValue } from "@/components/common/MaskedValue";
import { EmptyState, LoadingRows, MetricCard, PageHeader, SectionCard } from "@/components/common/Primitives";
import { SourceBadge } from "@/components/common/SourceBadge";
import { RecordStatus, SlaIndicator, StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { currency, relativeTime, shortDate } from "@/lib/format";
import {
  AccountService,
  CaseService,
  ClaimService,
  ClientService,
  DocumentService,
  InteractionService,
  PolicyService,
  WorkflowService,
} from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Client360() {
  const { clientId = "" } = useParams();
  const navigate = useNavigate();
  const { addRecentClient, askCopilot } = useWorkspace();

  const { data: client, isLoading } = useQuery({ queryKey: ["client", clientId], queryFn: () => ClientService.get(clientId) });
  const { data: policies = [] } = useQuery({ queryKey: ["policies", clientId], queryFn: () => PolicyService.byClient(clientId) });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts", clientId], queryFn: () => AccountService.byClient(clientId) });
  const { data: cases = [] } = useQuery({ queryKey: ["cases", clientId], queryFn: () => CaseService.byClient(clientId) });
  const { data: claims = [] } = useQuery({ queryKey: ["claims", clientId], queryFn: () => ClaimService.byClient(clientId) });
  const { data: interactions = [] } = useQuery({ queryKey: ["interactions", clientId], queryFn: () => InteractionService.byClient(clientId) });
  const { data: documents = [] } = useQuery({ queryKey: ["documents", clientId], queryFn: () => DocumentService.byClient(clientId) });
  const { data: alerts = [] } = useQuery({ queryKey: ["client-alerts", clientId], queryFn: () => ClientService.alerts(clientId) });
  const { data: plan } = useQuery({ queryKey: ["plan", clientId], queryFn: () => WorkflowService.planByClient(clientId) });

  useEffect(() => {
    if (client) addRecentClient(client.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?.id]);

  const totalCoverage = policies.reduce((s, p) => s + (p.faceAmount ?? 0), 0);
  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);

  useCopilotContext(
    client ? `${client.firstName} ${client.lastName} (client 360)` : "Client 360",
    client
      ? [
          `Client: ${client.firstName} ${client.lastName}, ${client.ageBand}, ${client.city} ${client.state}, tier ${client.relationshipTier}, status ${client.status}, client since ${client.clientSince}, sentiment ${client.sentiment}. Identity verified: ${client.identityVerified}.`,
          `Policies: ${policies.map((p) => `${p.productName} ${p.policyNumber} status ${p.status}, premium ${p.premium} ${p.premiumMode}, beneficiaries ${p.beneficiaryStatus}, next ${p.nextKeyDateLabel} ${p.nextKeyDate}`).join("; ")}.`,
          `Accounts: ${accounts.map((a) => `${a.name} ${a.accountNumber} balance ${a.balance} risk ${a.riskProfile}`).join("; ")}.`,
          `Open cases: ${cases.map((c) => `${c.caseNumber} ${c.subject} (${c.status}, SLA ${c.slaHealth}, due ${c.dueDate})`).join("; ")}.`,
          `Claims: ${claims.map((c) => `${c.claimNumber} ${c.claimType} ${c.status} at stage ${c.stage}; outstanding requirements ${c.requirements.filter((r) => r.status === "Outstanding").map((r) => r.name).join(", ") || "none"}`).join("; ")}.`,
          `Recent interactions: ${interactions.slice(0, 6).map((i) => `${i.at} ${i.channel}: ${i.subject} (${i.sentiment})`).join("; ")}.`,
          plan ? `Financial plan: status ${plan.status}, ${plan.completenessPct}% complete, next review ${plan.nextReviewDate}, missing data ${plan.missingData.join(", ") || "none"}.` : "No financial plan on file.",
          `Alerts: ${alerts.map((a) => `${a.title} (${a.severity}) — ${a.detail}`).join("; ") || "none"}.`,
        ].join("\n")
      : "Client record loading.",
  );

  if (isLoading) return <LoadingRows rows={6} />;
  if (!client) return <EmptyState title="Client not found" description="This record is not available in the demonstration data set." />;

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        description={`${client.relationshipTier} relationship · ${client.relationshipType} since ${client.clientSince} · ${client.city}, ${client.state} · Advisor ${client.advisorName}`}
        actions={
          <>
            <Button variant="outline" onClick={() => askCopilot({ prompt: "Summarize this relationship for a service call in under 150 words.", contextLabel: `${client.firstName} ${client.lastName}` })}>
              Summarize relationship
            </Button>
            <Button variant="outline" onClick={() => askCopilot({ prompt: "Prepare me for the next client meeting: agenda, open items, and risks.", contextLabel: `${client.firstName} ${client.lastName}` })}>
              Meeting prep
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <SourceBadge provenance={client} />
        <StatusBadge label={client.identityVerified ? "Identity verified" : "Identity not verified"} tone={client.identityVerified ? "positive" : "warning"} />
        <StatusBadge label={`Sentiment: ${client.sentiment}`} tone={client.sentiment === "negative" ? "critical" : client.sentiment === "positive" ? "positive" : "neutral"} />
        <span className="text-xs text-muted-foreground">
          Member ID <MaskedValue value={client.memberId} fieldKey={`member-${client.id}`} label="Member ID" /> · Advisor360 ID{" "}
          <MaskedValue value={client.advisor360Id} fieldKey={`a360-${client.id}`} label="Advisor360 ID" />
        </span>
      </div>

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <AlertBanner key={a.id} alert={a} onAction={() => (a.actionHref ? navigate(a.actionHref) : undefined)} />
          ))}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total coverage" value={currency(totalCoverage, { compact: true })} detail={`${policies.length} policies`} />
        <MetricCard label="Assets under management" value={currency(totalAssets, { compact: true })} detail={`${accounts.length} accounts`} />
        <MetricCard label="Open cases" value={String(cases.filter((c) => c.status !== "Closed" && c.status !== "Resolved").length)} detail={`${claims.length} claims on file`} tone={cases.some((c) => c.slaHealth === "breached") ? "critical" : "default"} />
        <MetricCard label="Plan completeness" value={plan ? `${plan.completenessPct}%` : "—"} detail={plan ? `Next review ${shortDate(plan.nextReviewDate)}` : "No plan on file"} />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="cases">Cases & claims</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-4 lg:grid-cols-2">
          <SectionCard title="Contact and preferences">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Email</dt><dd>{client.email}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Phone</dt><dd className="num">{client.phone}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Preferred contact</dt><dd>{client.contactPreference}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Language</dt><dd>{client.preferredLanguage}</dd></div>
            </dl>
            <p className="mt-3 text-sm text-muted-foreground">{client.notes}</p>
          </SectionCard>
          <SectionCard title="Consent and permissions" contentClassName="p-0">
            <DataTable
              caption="Consent preferences"
              rows={client.consent.map((c, i) => ({ id: `${c.channel}-${i}`, ...c }))}
              columns={[
                { key: "channel", header: "Channel", render: (r) => r.channel },
                { key: "marketing", header: "Marketing", render: (r) => <StatusBadge label={r.marketing ? "Opted in" : "Opted out"} tone={r.marketing ? "positive" : "neutral"} /> },
                { key: "servicing", header: "Servicing", render: (r) => <StatusBadge label={r.servicing ? "Allowed" : "Blocked"} tone={r.servicing ? "positive" : "warning"} /> },
                { key: "updated", header: "Captured", render: (r) => `${shortDate(r.updatedAt)} · ${r.capturedVia}` },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <SectionCard title={`Policies (${policies.length})`} contentClassName="p-0">
            <DataTable
              caption="Client policies"
              rows={policies}
              onRowClick={(p) => navigate(`/clients/${client.id}/policies/${p.id}`)}
              columns={[
                { key: "num", header: "Policy", render: (p) => <span className="num text-xs">{p.policyNumber}</span> },
                { key: "product", header: "Product", render: (p) => <span className="font-medium">{p.productName}</span> },
                { key: "status", header: "Status", render: (p) => <RecordStatus status={p.status} /> },
                { key: "premium", header: "Premium", render: (p) => <span className="num">{currency(p.premium)} / {p.premiumMode.toLowerCase()}</span> },
                { key: "benef", header: "Beneficiaries", render: (p) => <StatusBadge label={p.beneficiaryStatus} tone={p.beneficiaryStatus === "Current" ? "positive" : "warning"} /> },
                { key: "next", header: "Next key date", render: (p) => `${p.nextKeyDateLabel} · ${shortDate(p.nextKeyDate)}` },
                { key: "src", header: "Source", render: (p) => <SourceBadge provenance={p} /> },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="accounts" className="mt-4">
          <SectionCard title={`Accounts (${accounts.length})`} contentClassName="p-0">
            <DataTable
              caption="Client accounts"
              rows={accounts}
              onRowClick={(a) => navigate(`/clients/${client.id}/accounts/${a.id}`)}
              columns={[
                { key: "num", header: "Account", render: (a) => <span className="num text-xs">{a.accountNumber}</span> },
                { key: "name", header: "Name", render: (a) => <span className="font-medium">{a.name}</span> },
                { key: "type", header: "Type", render: (a) => a.type },
                { key: "balance", header: "Balance", sortValue: (a) => a.balance, render: (a) => <span className="num">{currency(a.balance)}</span> },
                { key: "risk", header: "Risk profile", render: (a) => a.riskProfile },
                { key: "src", header: "Source", render: (a) => <SourceBadge provenance={a} /> },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="cases" className="mt-4 space-y-4">
          <SectionCard title={`Cases (${cases.length})`} contentClassName="p-0">
            <DataTable
              caption="Client cases"
              rows={cases}
              onRowClick={(c) => navigate(`/cases/${c.id}`)}
              columns={[
                { key: "num", header: "Case", render: (c) => <span className="num text-xs">{c.caseNumber}</span> },
                { key: "subject", header: "Subject", render: (c) => <span className="font-medium">{c.subject}</span> },
                { key: "status", header: "Status", render: (c) => <RecordStatus status={c.status} /> },
                { key: "sla", header: "SLA", render: (c) => <SlaIndicator health={c.slaHealth} /> },
                { key: "owner", header: "Owner", render: (c) => c.ownerName },
                { key: "due", header: "Due", render: (c) => shortDate(c.dueDate) },
              ]}
            />
          </SectionCard>
          <SectionCard title={`Claims (${claims.length})`} contentClassName="p-0">
            <DataTable
              caption="Client claims"
              rows={claims}
              onRowClick={(c) => navigate(`/claims/${c.id}`)}
              columns={[
                { key: "num", header: "Claim", render: (c) => <span className="num text-xs">{c.claimNumber}</span> },
                { key: "type", header: "Type", render: (c) => <span className="font-medium">{c.claimType}</span> },
                { key: "status", header: "Status", render: (c) => <RecordStatus status={c.status} /> },
                { key: "stage", header: "Stage", render: (c) => c.stage },
                { key: "examiner", header: "Examiner", render: (c) => c.examiner },
                { key: "target", header: "Target", render: (c) => shortDate(c.targetCompletionDate) },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="interactions" className="mt-4">
          <SectionCard title="Interaction history" description="Unified across voice, chat, email, portal and advisor meetings.">
            <ol className="space-y-3">
              {interactions.map((i) => (
                <li key={i.id} className="rounded border border-border bg-card p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{i.subject}</span>
                    <StatusBadge label={i.channel} tone="info" />
                    <StatusBadge label={i.sentiment} tone={i.sentiment === "negative" ? "critical" : i.sentiment === "positive" ? "positive" : "neutral"} />
                    <span className="ml-auto text-xs text-muted-foreground">{relativeTime(i.at)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{i.summary}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{i.participants.join(", ")} · {shortDate(i.at)}</p>
                </li>
              ))}
            </ol>
          </SectionCard>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <SectionCard title={`Documents (${documents.length})`} contentClassName="p-0">
            <DataTable
              caption="Client documents"
              rows={documents}
              columns={[
                { key: "name", header: "Document", render: (d) => <span className="font-medium">{d.name}</span> },
                { key: "type", header: "Type", render: (d) => d.type },
                { key: "repo", header: "Repository", render: (d) => d.repository },
                { key: "class", header: "Classification", render: (d) => <StatusBadge label={d.classification} tone={d.classification === "Restricted" ? "critical" : "neutral"} /> },
                { key: "date", header: "Date", sortValue: (d) => d.date, render: (d) => shortDate(d.date) },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="planning" className="mt-4">
          {plan ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <SectionCard title="Goals" description={`Plan ${plan.status.toLowerCase()} · ${plan.completenessPct}% complete`}>
                <ul className="space-y-2">
                  {plan.goals.map((g) => (
                    <li key={g.id} className="rounded border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{g.name}</span>
                        <StatusBadge label={g.onTrack ? "On track" : "Off track"} tone={g.onTrack ? "positive" : "warning"} />
                      </div>
                      <p className="num mt-1 text-sm text-muted-foreground">
                        {currency(g.currentAmount, { compact: true })} of {currency(g.targetAmount, { compact: true })} by {g.targetYear}
                      </p>
                    </li>
                  ))}
                </ul>
              </SectionCard>
              <SectionCard title="Recommendations" description="Advisor review required before anything is presented to the client.">
                <ul className="space-y-2">
                  {plan.recommendations.map((r) => (
                    <li key={r.id} className="rounded border border-border p-3">
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{r.rationale}</p>
                      <StatusBadge className="mt-2" label={r.status} tone={r.status === "Accepted" ? "positive" : "warning"} />
                    </li>
                  ))}
                </ul>
                {plan.missingData.length > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">Missing data: {plan.missingData.join(", ")}</p>
                )}
              </SectionCard>
            </div>
          ) : (
            <EmptyState title="No financial plan on file" description="Planning data would be sourced from FPAS once a plan is created." />
          )}
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        Need the household view? <Link className="underline" to="/search">Browse related clients</Link>.
      </p>
    </div>
  );
}
