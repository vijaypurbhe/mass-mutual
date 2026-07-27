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
import { Briefcase, Clock, PhoneCall, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { persona, personaId, startInteraction, askCopilot, pinnedClients } = useWorkspace();
  const navigate = useNavigate();

  const { data: work = [] } = useQuery({ queryKey: ["work-items"], queryFn: WorkflowService.items });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: GovernanceService.alerts });
  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: ClientService.list });
  const { data: referrals = [] } = useQuery({ queryKey: ["referrals"], queryFn: WorkflowService.referrals });

  const open = work.filter((w) => w.status !== "Complete");
  const breached = work.filter((w) => w.slaHealth === "breached").length;
  const atRisk = work.filter((w) => w.slaHealth === "at_risk").length;

  useCopilotContext(
    `${HOME_TITLE[personaId]} for ${persona.name}`,
    `Persona home view. Open work items: ${open.length}. SLA breached: ${breached}. SLA at risk: ${atRisk}. ` +
      `Active alerts: ${alerts.map((a) => `${a.title} (${a.severity})`).join("; ")}. ` +
      `Top work items: ${open.slice(0, 8).map((w) => `${w.workItemId} ${w.type} for ${w.relatedRecord}, due ${w.dueDate}, ${w.slaHealth}`).join("; ")}.`,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title={HOME_TITLE[personaId]}
        description={`${persona.name} · ${persona.team}. Work, alerts and relationships prioritized for your role.`}
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
              onClick={() => askCopilot({ prompt: "Prioritize my day: what needs attention first and why?", contextLabel: HOME_TITLE[personaId] })}
            >
              Plan my day with Copilot
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open work" value={String(open.length)} detail="Assigned across your queues" icon={Briefcase} onClick={() => navigate("/work")} />
        <MetricCard label="SLA breached" value={String(breached)} detail={`${atRisk} more at risk`} icon={Clock} tone={breached ? "critical" : "positive"} onClick={() => navigate("/work")} />
        <MetricCard label="Relationships" value={String(clients.length)} detail={`${pinnedClients.length} pinned`} icon={Users} onClick={() => navigate("/search")} />
        <MetricCard
          label="Pipeline value"
          value={currency(referrals.reduce((sum, r) => sum + r.estimatedValue, 0), { compact: true })}
          detail={`${referrals.length} open referrals`}
          icon={TrendingUp}
          onClick={() => navigate("/work?tab=referrals")}
        />
      </div>

      {alerts.length > 0 && (
        <SectionCard title="Alerts requiring attention" description="Ranked by severity and due date." contentClassName="space-y-2">
          {alerts.slice(0, 4).map((alert) => (
            <AlertBanner
              key={alert.id}
              alert={alert}
              onAction={() => (alert.actionHref ? navigate(alert.actionHref) : navigate("/work"))}
            />
          ))}
        </SectionCard>
      )}

      <SectionCard
        title="Priority work"
        description="Highest-priority items assigned to you or your team."
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
          onRowClick={(row) => navigate("/work")}
          columns={[
            { key: "id", header: "Item", render: (r) => <span className="num text-xs">{r.workItemId}</span> },
            { key: "type", header: "Type", sortValue: (r) => r.type, render: (r) => <span className="font-medium">{r.type}</span> },
            { key: "record", header: "Related record", render: (r) => r.relatedRecord },
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
