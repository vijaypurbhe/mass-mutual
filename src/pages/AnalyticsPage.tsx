import { MetricCard, PageHeader, SectionCard, UnauthorizedState } from "@/components/common/Primitives";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { can } from "@/lib/permissions";
import { currency } from "@/lib/format";
import { CaseService, ClaimService, WorkflowService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CHART_COLORS = ["hsl(var(--primary))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export default function AnalyticsPage() {
  const { personaId } = useWorkspace();
  const { data: work = [] } = useQuery({ queryKey: ["work-items"], queryFn: WorkflowService.items });
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: CaseService.all });
  const { data: claims = [] } = useQuery({ queryKey: ["claims"], queryFn: ClaimService.all });
  const { data: referrals = [] } = useQuery({ queryKey: ["referrals"], queryFn: WorkflowService.referrals });

  useCopilotContext(
    "Analytics and operations insight",
    `Cases: ${cases.length}, claims: ${claims.length}, work items: ${work.length}. SLA breached ${work.filter((w) => w.slaHealth === "breached").length}, at risk ${work.filter((w) => w.slaHealth === "at_risk").length}.`,
  );

  if (!can(personaId, "view_analytics")) {
    return <UnauthorizedState requirement="Analytics dashboards are available to advisors, managers and administrators." />;
  }

  const slaData = (["on_track", "at_risk", "breached", "met"] as const).map((h) => ({
    name: h.replace("_", " "),
    value: work.filter((w) => w.slaHealth === h).length,
  }));

  const caseByType = Object.entries(
    cases.reduce<Record<string, number>>((acc, c) => ({ ...acc, [c.type]: (acc[c.type] ?? 0) + 1 }), {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-5">
      <PageHeader title="Analytics" description="Operational health, service quality and pipeline across the unified workspace." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Open cases" value={String(cases.filter((c) => c.status !== "Closed").length)} />
        <MetricCard label="Claims in flight" value={String(claims.filter((c) => c.status !== "Closed").length)} />
        <MetricCard label="SLA breached" value={String(work.filter((w) => w.slaHealth === "breached").length)} tone="critical" />
        <MetricCard label="Pipeline" value={currency(referrals.reduce((s, r) => s + r.estimatedValue, 0), { compact: true })} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="SLA health across work items">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={slaData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                  {slaData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Cases by type">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={0} angle={-15} height={60} textAnchor="end" />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
