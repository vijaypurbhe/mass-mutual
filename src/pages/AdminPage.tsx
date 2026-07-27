import { DataTable } from "@/components/common/DataTable";
import { PageHeader, SectionCard, UnauthorizedState } from "@/components/common/Primitives";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { dateTime } from "@/lib/format";
import { CAPABILITIES, can } from "@/lib/permissions";
import { GovernanceService } from "@/services";
import { useQuery } from "@tanstack/react-query";

export default function AdminPage() {
  const { personaId, personas } = useWorkspace();
  const { data: audit = [] } = useQuery({ queryKey: ["audit"], queryFn: GovernanceService.auditEvents });
  const { data: health = [] } = useQuery({ queryKey: ["integration-health"], queryFn: GovernanceService.integrationHealth });

  useCopilotContext(
    "Administration and governance",
    `Integration health: ${health.map((h) => `${h.name} ${h.status} latency ${h.latencyMs}ms — ${h.note}`).join("; ")}.`,
  );

  if (!can(personaId, "view_admin")) {
    return <UnauthorizedState requirement="Administration is restricted to the platform administrator role." />;
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Administration and governance" description="Access model, integration health and the audit trail behind the unified workspace." />

      <Tabs defaultValue="integrations">
        <TabsList>
          <TabsTrigger value="integrations">Integration health</TabsTrigger>
          <TabsTrigger value="access">Access model</TabsTrigger>
          <TabsTrigger value="audit">Audit trail</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="mt-4">
          <SectionCard title="Source systems" contentClassName="p-0">
            <DataTable
              caption="Integration health"
              rows={health.map((h) => ({ id: h.name, ...h }))}
              columns={[
                { key: "name", header: "System", render: (h) => <span className="font-medium">{h.name}</span> },
                { key: "status", header: "Status", render: (h) => <StatusBadge label={h.status} tone={h.status === "Operational" ? "positive" : "warning"} /> },
                { key: "latency", header: "Latency", sortValue: (h) => h.latencyMs, render: (h) => <span className="num">{h.latencyMs} ms</span> },
                { key: "throughput", header: "Throughput", render: (h) => h.throughput },
                { key: "last", header: "Last event", render: (h) => dateTime(h.lastEvent) },
                { key: "note", header: "Note", render: (h) => <span className="text-muted-foreground">{h.note}</span> },
              ]}
            />
          </SectionCard>
        </TabsContent>

        <TabsContent value="access" className="mt-4">
          <SectionCard title="Role capabilities" description="What each persona may see and do in this workspace.">
            <ul className="space-y-2">
              {personas.map((p) => (
                <li key={p.id} className="rounded border border-border p-3">
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {CAPABILITIES[p.id].length === 0 && <StatusBadge label="Self-service only" tone="neutral" />}
                    {CAPABILITIES[p.id].map((c) => (
                      <StatusBadge key={c} label={c.replace(/_/g, " ")} tone="info" />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <SectionCard title="Audit trail" contentClassName="p-0">
            <DataTable
              caption="Audit events"
              rows={audit}
              columns={[
                { key: "at", header: "When", sortValue: (a) => a.at, render: (a) => dateTime(a.at) },
                { key: "actor", header: "Actor", render: (a) => a.actor },
                { key: "action", header: "Action", render: (a) => <span className="font-medium">{a.action}</span> },
                { key: "record", header: "Record", render: (a) => a.record },
                { key: "channel", header: "Channel", render: (a) => a.channel },
                { key: "detail", header: "Detail", render: (a) => <span className="text-muted-foreground">{a.detail}</span> },
              ]}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
