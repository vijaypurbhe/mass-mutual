import { AlertBanner } from "@/components/common/AlertBanner";
import { MetricCard, PageHeader, SectionCard } from "@/components/common/Primitives";
import { DataTable } from "@/components/common/DataTable";
import { RecordStatus, SlaIndicator } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { currency, relativeTime, shortDate } from "@/lib/format";
import { HOME_TITLE } from "@/lib/permissions";
import { ClientService, GovernanceService, WorkflowService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  Clock,
  FileWarning,
  PhoneCall,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AlertRecord, PersonaId, WorkItem } from "@/types";

/** Which alert categories each persona actually cares about on their landing page. */
const ALERT_FOCUS: Record<PersonaId, AlertRecord["category"][] | "all"> = {
  service_rep: ["Service", "Identity", "Claims", "Complaint"],
  advisor: ["Planning", "Policy", "Service"],
  back_office: ["Policy", "Claims", "Consent"],
  manager: "all",
  admin: ["Identity", "Consent", "Policy"],
  customer: "all",
};

/** Work items relevant to the signed-in persona. */
function scopeWork(items: WorkItem[], personaId: PersonaId, actor: string): WorkItem[] {
  switch (personaId) {
    case "service_rep":
      return items.filter((w) => w.assignedTo === actor || (w.category === "Team Queue" && w.assignedTo === "Unassigned"));
    case "advisor":
      return items.filter((w) => w.assignedTo === actor || w.category === "Task");
    case "back_office":
      return items.filter((w) => w.assignedTo === actor || w.category === "Team Queue" || w.category === "Exception");
    case "manager":
      return items.filter((w) => w.category !== "Automation");
    case "admin":
      return items.filter((w) => w.category === "Exception" || w.category === "Automation");
    default:
      return items;
  }
}

export default function HomePage() {
  const { persona, personaId, startInteraction, askCopilot, pinnedClients } = useWorkspace();
  const navigate = useNavigate();

  const { data: work = [] } = useQuery({ queryKey: ["work-items"], queryFn: WorkflowService.items });
  const { data: allAlerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: GovernanceService.alerts });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: ClientService.list });
  const { data: referrals = [] } = useQuery({ queryKey: ["referrals"], queryFn: WorkflowService.referrals });
  const { data: plans = [] } = useQuery({ queryKey: ["plans"], queryFn: WorkflowService.plans });
  const { data: integrations = [] } = useQuery({ queryKey: ["integration-health"], queryFn: GovernanceService.integrationHealth });

  const scoped = scopeWork(work, personaId, persona.name);
  const open = scoped.filter((w) => w.status !== "Complete");
  const breached = scoped.filter((w) => w.slaHealth === "breached").length;
  const atRisk = scoped.filter((w) => w.slaHealth === "at_risk").length;

  const focus = ALERT_FOCUS[personaId];
  const alerts = focus === "all" ? allAlerts : allAlerts.filter((a) => focus.includes(a.category));

  const myReferrals = personaId === "advisor" ? referrals.filter((r) => r.owner === persona.name) : referrals;
  const approvals = work.filter((w) => w.category === "Approval" && w.status !== "Complete");
  const exceptions = work.filter((w) => w.category === "Exception" && w.status !== "Complete");
  const degraded = integrations.filter((i) => i.status !== "Operational");
  const reviewsDue = plans.filter((p) => p.status === "Review Due").length;

  useCopilotContext(
    `${HOME_TITLE[personaId]} for ${persona.name}`,
    `Persona home view for ${persona.title} (${persona.team}). Open work items in scope: ${open.length}. SLA breached: ${breached}. SLA at risk: ${atRisk}. ` +
      `Alerts in focus: ${alerts.map((a) => `${a.title} (${a.severity})`).join("; ")}. ` +
      `Top work items: ${open.slice(0, 8).map((w) => `${w.workItemId} ${w.type} for ${w.relatedRecord}, due ${w.dueDate}, ${w.slaHealth}`).join("; ")}.`,
  );

  const metrics = (() => {
    switch (personaId) {
      case "advisor":
        return [
          { label: "My tasks", value: String(open.length), detail: "Advisory follow-ups in flight", icon: Briefcase, to: "/work?tab=tasks" },
          { label: "Pipeline value", value: currency(myReferrals.reduce((s, r) => s + r.estimatedValue, 0), { compact: true }), detail: `${myReferrals.length} open referrals`, icon: TrendingUp, to: "/work?tab=referrals" },
          { label: "Plan reviews due", value: String(reviewsDue), detail: `${plans.length} household plans`, icon: Clock, tone: reviewsDue ? ("warning" as const) : undefined, to: "/work?tab=planning" },
          { label: "Households", value: String(clients.length), detail: `${pinnedClients.length} pinned`, icon: Users, to: "/search" },
        ];
      case "back_office":
        return [
          { label: "Queue volume", value: String(open.length), detail: "Requirements, exceptions and reviews", icon: Briefcase, to: "/work" },
          { label: "SLA breached", value: String(breached), detail: `${atRisk} more at risk`, icon: Clock, tone: breached ? ("critical" as const) : ("positive" as const), to: "/work" },
          { label: "Open exceptions", value: String(exceptions.length), detail: "Data quality and processing", icon: FileWarning, to: "/work?tab=exceptions" },
          { label: "Unassigned", value: String(scoped.filter((w) => w.assignedTo === "Unassigned" && w.status !== "Complete").length), detail: "Awaiting pick-up", icon: Users, to: "/work" },
        ];
      case "manager":
        return [
          { label: "Team backlog", value: String(open.length), detail: "Across all servicing queues", icon: Briefcase, to: "/work?tab=team" },
          { label: "SLA breached", value: String(breached), detail: `${atRisk} more at risk`, icon: Clock, tone: breached ? ("critical" as const) : ("positive" as const), to: "/analytics?dash=service" },
          { label: "Pending approvals", value: String(approvals.length), detail: "Waiting on your decision", icon: CheckCircle2, to: "/work?tab=approvals" },
          { label: "Escalations", value: String(alerts.filter((a) => a.severity === "critical" || a.severity === "high").length), detail: "High and critical alerts", icon: ShieldAlert, tone: "warning" as const, to: "/analytics?dash=cx" },
        ];
      case "admin":
        return [
          { label: "Open exceptions", value: String(exceptions.length), detail: "Governance and data quality", icon: FileWarning, to: "/admin" },
          { label: "Integration issues", value: String(degraded.length), detail: `${integrations.length} monitored connections`, icon: Activity, tone: degraded.length ? ("critical" as const) : ("positive" as const), to: "/admin" },
          { label: "Automations", value: String(work.filter((w) => w.category === "Automation").length), detail: "Scheduled jobs today", icon: Briefcase, to: "/admin" },
          { label: "Client records", value: String(clients.length), detail: "Under governance", icon: Users, to: "/search" },
        ];
      default:
        return [
          { label: "My open work", value: String(open.length), detail: "Assigned to you", icon: Briefcase, to: "/work" },
          { label: "SLA breached", value: String(breached), detail: `${atRisk} more at risk`, icon: Clock, tone: breached ? ("critical" as const) : ("positive" as const), to: "/work" },
          { label: "Relationships", value: String(clients.length), detail: `${pinnedClients.length} pinned`, icon: Users, to: "/search" },
          { label: "Open referrals", value: String(referrals.length), detail: currency(referrals.reduce((s, r) => s + r.estimatedValue, 0), { compact: true }) + " pipeline", icon: TrendingUp, to: "/work?tab=referrals" },
        ];
    }
  })();

  const workSectionTitle: Record<PersonaId, string> = {
    service_rep: "My priority work",
    advisor: "Advisory follow-ups",
    back_office: "Queue — next best items",
    manager: "Team work needing intervention",
    admin: "Exceptions and automation runs",
    customer: "Priority work",
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title={HOME_TITLE[personaId]}
        description={`${persona.name} · ${persona.team}. ${persona.description}`}
        actions={
          <>
            {personaId === "service_rep" && (
              <Button
                onClick={() =>
                  startInteraction({ channel: "Voice", callerLabel: "Jordan Lee (inbound)", verified: false, queue: "Life Servicing", clientId: "cl-jordan-lee" })
                }
              >
                <PhoneCall className="mr-1 h-4 w-4" aria-hidden="true" />
                Simulate inbound call
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => askCopilot({ prompt: `Prioritize my day as ${persona.title}: what needs attention first and why?`, contextLabel: HOME_TITLE[personaId] })}
            >
              Plan my day with Copilot
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} detail={m.detail} icon={m.icon} tone={m.tone} onClick={() => navigate(m.to)} />
        ))}
      </div>

      {alerts.length > 0 && (
        <SectionCard title="Alerts requiring attention" description={`Filtered for ${persona.title}, ranked by severity and due date.`} contentClassName="space-y-2">
          {alerts.slice(0, 4).map((alert) => (
            <AlertBanner key={alert.id} alert={alert} onAction={() => (alert.actionHref ? navigate(alert.actionHref) : navigate("/work"))} />
          ))}
        </SectionCard>
      )}

      {personaId === "advisor" && myReferrals.length > 0 && (
        <SectionCard title="Opportunities and referrals" description="Sourced from planning gaps, life events and household coverage analysis." contentClassName="p-0">
          <DataTable
            caption="Advisor referrals"
            rows={myReferrals.slice(0, 6)}
            onRowClick={() => navigate("/work?tab=referrals")}
            columns={[
              { key: "household", header: "Household", render: (r) => <span className="font-medium">{r.householdName}</span> },
              { key: "type", header: "Opportunity", render: (r) => r.type },
              { key: "stage", header: "Stage", render: (r) => r.stage },
              { key: "value", header: "Estimated value", sortValue: (r) => r.estimatedValue, render: (r) => <span className="num">{currency(r.estimatedValue)}</span> },
              { key: "source", header: "Source", render: (r) => <span className="text-muted-foreground">{r.source}</span> },
            ]}
          />
        </SectionCard>
      )}

      {personaId === "manager" && (
        <SectionCard title="Approvals waiting on you" description="Decisions blocking downstream servicing." contentClassName="p-0">
          <DataTable
            caption="Pending approvals"
            rows={approvals}
            onRowClick={() => navigate("/work?tab=approvals")}
            columns={[
              { key: "id", header: "Item", render: (r) => <span className="num text-xs">{r.workItemId}</span> },
              { key: "type", header: "Decision", render: (r) => <span className="font-medium">{r.type}</span> },
              { key: "record", header: "Related record", render: (r) => r.relatedRecord },
              { key: "sla", header: "SLA", render: (r) => <SlaIndicator health={r.slaHealth} /> },
              { key: "due", header: "Due", sortValue: (r) => r.dueDate, render: (r) => <span className="whitespace-nowrap">{shortDate(r.dueDate)}</span> },
            ]}
          />
        </SectionCard>
      )}

      {personaId === "admin" && (
        <SectionCard title="Integration health" description="Salesforce and platform connections feeding this Headless360 experience." contentClassName="p-0">
          <DataTable
            caption="Integration health"
            rows={integrations}
            columns={[
              { key: "name", header: "Connection", render: (r) => <span className="font-medium">{r.name}</span> },
              { key: "status", header: "Status", render: (r) => <span className={r.status === "Operational" ? "text-muted-foreground" : "font-medium text-destructive"}>{r.status}</span> },
              { key: "latency", header: "Latency", sortValue: (r) => r.latencyMs, render: (r) => <span className="num">{r.latencyMs} ms</span> },
              { key: "throughput", header: "Throughput", render: (r) => r.throughput },
              { key: "event", header: "Last event", render: (r) => <span className="text-muted-foreground">{relativeTime(r.lastEvent)}</span> },
            ]}
          />
        </SectionCard>
      )}

      <SectionCard
        title={workSectionTitle[personaId]}
        description="Highest-priority items in your scope."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/work")}>
            Open full queue
          </Button>
        }
        contentClassName="p-0"
      >
        <DataTable
          caption="Priority work items"
          rows={open.slice(0, 8)}
          onRowClick={() => navigate("/work")}
          columns={[
            { key: "id", header: "Item", render: (r) => <span className="num text-xs">{r.workItemId}</span> },
            { key: "type", header: "Type", sortValue: (r) => r.type, render: (r) => <span className="font-medium">{r.type}</span> },
            { key: "record", header: "Related record", render: (r) => r.relatedRecord },
            { key: "owner", header: "Owner", render: (r) => <span className="text-muted-foreground">{r.assignedTo}</span> },
            { key: "status", header: "Status", render: (r) => <RecordStatus status={r.status} /> },
            { key: "sla", header: "SLA", render: (r) => <SlaIndicator health={r.slaHealth} /> },
            { key: "due", header: "Due", sortValue: (r) => r.dueDate, render: (r) => <span className="whitespace-nowrap">{shortDate(r.dueDate)}</span> },
            { key: "activity", header: "Last activity", render: (r) => <span className="text-muted-foreground">{relativeTime(r.lastActivity)}</span> },
          ]}
        />
      </SectionCard>
    </div>
  );
}
