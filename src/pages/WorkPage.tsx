import { AlertBanner } from "@/components/common/AlertBanner";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader, SectionCard } from "@/components/common/Primitives";
import { RecordStatus, SeverityBadge, SlaIndicator } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/GuidedFlow";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { currency, relativeTime, shortDate } from "@/lib/format";
import { can } from "@/lib/permissions";
import { GovernanceService, WorkflowService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function WorkPage() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "queue";
  const navigate = useNavigate();
  const { personaId, logAudit } = useWorkspace();
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmReassign, setConfirmReassign] = useState(false);

  const { data: work = [] } = useQuery({ queryKey: ["work-items"], queryFn: WorkflowService.items });
  const { data: referrals = [] } = useQuery({ queryKey: ["referrals"], queryFn: WorkflowService.referrals });
  const { data: plans = [] } = useQuery({ queryKey: ["plans"], queryFn: WorkflowService.plans });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: GovernanceService.alerts });

  useCopilotContext(
    "Work and queue management",
    `Work items: ${work.map((w) => `${w.workItemId} ${w.type} (${w.category}) status ${w.status}, SLA ${w.slaHealth}, assigned ${w.assignedTo}, due ${w.dueDate}`).join("; ")}. Alerts: ${alerts.map((a) => a.title).join("; ")}.`,
  );

  const filtered = {
    queue: work,
    tasks: work.filter((w) => w.category === "Task" || w.category === "My Work"),
    exceptions: work.filter((w) => w.category === "Exception"),
    applications: work.filter((w) => w.type.toLowerCase().includes("application")),
    team: work,
    cases: work.filter((w) => w.type.toLowerCase().includes("case")),
    claims: work.filter((w) => w.type.toLowerCase().includes("claim")),
  }[tab] ?? work;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Work management"
        description="One prioritized queue across service cases, claims, applications, exceptions and approvals."
        actions={
          can(personaId, "bulk_reassign") && (
            <Button disabled={selected.length === 0} onClick={() => setConfirmReassign(true)}>
              Reassign {selected.length || ""} selected
            </Button>
          )
        }
      />

      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v })}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="queue">All work</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="exceptions">Exceptions</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {["queue", "tasks", "exceptions", "applications", "team", "cases", "claims"].map((key) => (
          <TabsContent key={key} value={key} className="mt-4">
            <SectionCard title={`${filtered.length} items`} contentClassName="p-0">
              <DataTable
                caption="Work items"
                rows={filtered}
                selectable={can(personaId, "bulk_reassign")}
                selectedIds={selected}
                onToggleSelect={(id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))}
                columns={[
                  { key: "id", header: "Item", render: (w) => <span className="num text-xs">{w.workItemId}</span> },
                  { key: "type", header: "Type", sortValue: (w) => w.type, render: (w) => <span className="font-medium">{w.type}</span> },
                  { key: "record", header: "Related record", render: (w) => w.relatedRecord },
                  { key: "priority", header: "Priority", render: (w) => <SeverityBadge severity={w.priority} /> },
                  { key: "status", header: "Status", render: (w) => <RecordStatus status={w.status} /> },
                  { key: "sla", header: "SLA", render: (w) => <SlaIndicator health={w.slaHealth} /> },
                  { key: "assignee", header: "Assigned to", render: (w) => w.assignedTo },
                  { key: "due", header: "Due", sortValue: (w) => w.dueDate, render: (w) => shortDate(w.dueDate) },
                  { key: "last", header: "Last activity", render: (w) => <span className="text-muted-foreground">{relativeTime(w.lastActivity)}</span> },
                ]}
              />
            </SectionCard>
          </TabsContent>
        ))}

        <TabsContent value="referrals" className="mt-4">
          <SectionCard title={`Referrals and opportunities (${referrals.length})`} contentClassName="p-0">
            <DataTable
              caption="Referrals"
              rows={referrals}
              onRowClick={(r) => navigate(`/clients/${r.clientId}`)}
              columns={[
                { key: "house", header: "Household", render: (r) => <span className="font-medium">{r.householdName}</span> },
                { key: "type", header: "Opportunity", render: (r) => r.type },
                { key: "stage", header: "Stage", render: (r) => <RecordStatus status={r.stage} /> },
                { key: "value", header: "Estimated value", sortValue: (r) => r.estimatedValue, render: (r) => <span className="num">{currency(r.estimatedValue, { compact: true })}</span> },
                { key: "source", header: "Source", render: (r) => r.source },
                { key: "owner", header: "Owner", render: (r) => r.owner },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="planning" className="mt-4">
          <SectionCard title={`Financial plans (${plans.length})`} contentClassName="p-0">
            <DataTable
              caption="Financial plans"
              rows={plans}
              onRowClick={(p) => navigate(`/clients/${p.clientId}`)}
              columns={[
                { key: "client", header: "Client", render: (p) => p.clientId },
                { key: "status", header: "Status", render: (p) => <RecordStatus status={p.status} /> },
                { key: "complete", header: "Completeness", sortValue: (p) => p.completenessPct, render: (p) => <span className="num">{p.completenessPct}%</span> },
                { key: "risk", header: "Risk tolerance", render: (p) => p.riskTolerance },
                { key: "review", header: "Next review", render: (p) => shortDate(p.nextReviewDate) },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <SectionCard title={`Alerts (${alerts.length})`} contentClassName="space-y-2">
            {alerts.map((a) => (
              <AlertBanner key={a.id} alert={a} onAction={() => (a.actionHref ? navigate(a.actionHref) : undefined)} />
            ))}
          </SectionCard>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmReassign}
        onOpenChange={setConfirmReassign}
        title="Reassign selected work?"
        description={`${selected.length} items will be reassigned and the change recorded against each record's audit trail.`}
        confirmLabel="Confirm reassignment"
        onConfirm={() => {
          logAudit({ action: "Bulk reassignment submitted", record: `${selected.length} work items`, detail: selected.join(", ") });
          toast.success(`${selected.length} items reassigned.`);
          setSelected([]);
        }}
      />
    </div>
  );
}
