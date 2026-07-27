import { motion } from "framer-motion";
import { Sparkles, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { LEADS, PIPELINE_STAGES } from "@/lib/mazda-mock";
import { PageHeader, Crumb } from "@/components/MazdaAppShell";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

export default function LeadsPage() {
  const stageData = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: LEADS.filter((l) => l.stage === stage).length || Math.ceil(Math.random() * 8 + 2),
  }));
  const dealerData = [
    { d: "Galpin", v: 41 },
    { d: "Browning", v: 36 },
    { d: "Puente Hills", v: 33 },
    { d: "South Coast", v: 28 },
  ];
  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto">
      <Crumb>Lead Routing</Crumb>
      <PageHeader
        eyebrow="Stage 2 · Digital Retail → Dealer Handoff"
        title="Inbound leads — West region"
        description="MazdaUSA configurator, Cox / Dealer.com, CarNow, and AutoFi leads land in Auto Cloud Lead Mgmt. Einstein scores prioritize, MNAO SLAs escalate, Atlas drafts the next dealer touch."
      />
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded border hairline bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Opportunity funnel</div>
                <h2 className="text-xl mt-1">Pipeline by stage</h2>
              </div>
              <div className="text-xs text-muted-foreground">All West dealers</div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} interval={0} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {stageData.map((_, i) => (
                      <Cell key={i} fill={`hsl(var(--primary) / ${0.4 + i * 0.1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded border hairline bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Closed-loop</div>
                <h2 className="text-xl mt-1">Test-drive → sale</h2>
              </div>
              <div className="text-xs text-muted-foreground">Conversion %</div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dealerData} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={90} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="v" fill="hsl(var(--soul-red))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="rounded border hairline bg-card overflow-hidden">
            <div className="p-5 border-b hairline flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Live lead queue</div>
                <h2 className="text-xl mt-1">Inbound leads · West region</h2>
              </div>
              <button className="text-xs px-3 py-1.5 rounded border hairline text-muted-foreground hover:text-foreground">Filter</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Lead</th>
                    <th className="text-left px-4 py-2 font-medium">Customer</th>
                    <th className="text-left px-4 py-2 font-medium">Model</th>
                    <th className="text-left px-4 py-2 font-medium">Dealer</th>
                    <th className="text-left px-4 py-2 font-medium">Score</th>
                    <th className="text-left px-4 py-2 font-medium">Stage</th>
                    <th className="text-left px-4 py-2 font-medium">SLA</th>
                    <th className="text-right px-4 py-2 font-medium">Open</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADS.map((l, i) => (
                    <motion.tr
                      key={l.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-t hairline hover:bg-primary/5 cursor-pointer group"
                      onClick={() => (window.location.href = "/household")}
                    >
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{l.id}</td>
                      <td className="px-4 py-3 font-medium group-hover:text-primary transition-colors">{l.customer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.model}</td>
                      <td className="px-4 py-3 text-muted-foreground">{l.dealer}</td>
                      <td className="px-4 py-3"><ScoreChip score={l.score} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{l.stage}</td>
                      <td className="px-4 py-3"><SLAChip status={l.sla} aged={l.aged} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link to="/household" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          Open <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
      </div>
    </div>
  );
}

function ScoreChip({ score }: { score: number }) {
  const tone = score >= 85 ? "bg-success/10 text-success" : score >= 75 ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground";
  return <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium", tone)}><Sparkles className="h-2.5 w-2.5" />{score}</span>;
}

function SLAChip({ status, aged }: { status: string; aged: string }) {
  const tone = status === "Breached" ? "text-destructive" : status === "Watch" ? "text-warning" : "text-success";
  return (
    <div className={cn("flex items-center gap-1 text-xs", tone)}>
      <Clock className="h-3 w-3" />
      <span>{status}</span>
      <span className="text-muted-foreground">· {aged}</span>
    </div>
  );
}