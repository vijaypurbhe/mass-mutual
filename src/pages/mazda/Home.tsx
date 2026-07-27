import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Wrench,
  AlertTriangle,
  TrendingUp,
  Check,
  X,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { usePersona } from "@/lib/persona-context";
import { PERSONAS, KPIS, BRIEFING, SUGGESTED } from "@/lib/mazda-mock";
import { PageHeader } from "@/components/MazdaAppShell";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const ICONS = { lead: Mail, alert: AlertTriangle, claim: Wrench, score: TrendingUp };

const ICON_ROUTE: Record<string, string> = {
  lead: "/leads",
  alert: "/vehicle",
  claim: "/warranty",
  score: "/dealer-scorecard",
};

const KPI_ROUTE_BY_PERSONA: Record<string, string[]> = {
  field: ["/leads", "/leads", "/dealer-scorecard", "/dealer-scorecard"],
  agent: ["/warranty", "/warranty", "/vehicle", "/warranty"],
  dealer: ["/leads", "/leads", "/warranty", "/vehicle"],
  partner: ["/household", "/household", "/household", "/vehicle"],
};

const REVENUE_TREND = [
  { d: "Mon", v: 1240, t: 1100 },
  { d: "Tue", v: 1380, t: 1150 },
  { d: "Wed", v: 1290, t: 1180 },
  { d: "Thu", v: 1560, t: 1220 },
  { d: "Fri", v: 1720, t: 1280 },
  { d: "Sat", v: 1610, t: 1300 },
  { d: "Sun", v: 1840, t: 1340 },
];

export default function MazdaHome() {
  const { persona } = usePersona();
  const p = PERSONAS[persona];
  const navigate = useNavigate();
  const routes = KPI_ROUTE_BY_PERSONA[persona];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <PageHeader
        eyebrow={p.org}
        title={`Good morning, ${p.name.split(" ")[0]}.`}
        description={`${p.agentName} pulled overnight signals from Data Cloud, Sales, Service, and connected vehicles. Here's what needs your attention.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {KPIS[persona].map((k, i) => (
          <motion.button
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(routes[i] ?? "/")}
            className="text-left rounded border hairline bg-card p-4 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
            <div className="text-3xl mt-2 group-hover:text-primary transition-colors">{k.value}</div>
            <div className={`text-xs mt-1 ${k.positive ? "text-success" : "text-warning"}`}>{k.delta}</div>
            <Spark seed={i} positive={k.positive} />
          </motion.button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded border hairline bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">This week</div>
                <h2 className="text-xl mt-1">Revenue vs target</h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold">$10.6M</div>
                <div className="text-xs text-success">+12.4% vs target</div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_TREND}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev)" />
                  <Area type="monotone" dataKey="t" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="Morning briefing" title="What changed overnight" />
            <div className="space-y-3">
              {BRIEFING[persona].map((item, i) => {
                const Icon = ICONS[item.icon];
                const to = ICON_ROUTE[item.icon];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link to={to} className="rounded border hairline bg-card p-5 flex gap-4 hover:border-primary hover:shadow-md transition-all group">
                      <div className="h-10 w-10 rounded bg-secondary group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{item.title}</div>
                        <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                        <div className="text-[11px] text-muted-foreground mt-2 uppercase tracking-wider">Source: {item.source}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all self-center flex-shrink-0" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section>
            <SectionTitle eyebrow="Atlas suggests" title="Approve, modify, or dismiss" />
            <div className="space-y-3">
              {SUGGESTED[persona].map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded border hairline bg-card p-4"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm font-medium">{s.title}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{s.rationale}</p>
                  <div className="mt-2 inline-block text-[10px] uppercase tracking-wider text-muted-foreground border hairline rounded px-1.5 py-0.5">{s.effort}</div>
                  <div className="mt-3 flex gap-1.5">
                    <button
                      onClick={() => toast.success("Action approved", { description: `${s.title} — logged to Auto Cloud audit trail.` })}
                      className="flex-1 h-7 rounded bg-primary text-primary-foreground hover:bg-primary/90 text-[11px] font-medium flex items-center justify-center gap-1"
                    >
                      <Check className="h-3 w-3" /> Approve
                    </button>
                    <button
                      onClick={() => toast("Open Atlas to refine", { description: "Use the chat bubble bottom-right." })}
                      title="Modify with Atlas"
                      className="h-7 w-7 rounded border hairline text-muted-foreground hover:text-foreground flex items-center justify-center"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => toast("Suggestion dismissed", { description: s.title })}
                      className="h-7 w-7 rounded border hairline text-muted-foreground hover:text-foreground flex items-center justify-center"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle eyebrow="Jump into" title="Deep-dive consoles" />
            <div className="grid grid-cols-1 gap-2">
              <ConsoleLink to="/leads" title="Lead → Sale Pipeline" desc="DR routing (MazdaUSA / Cox / CarNow / AutoFi), Einstein scores, SLA timers" />
              <ConsoleLink to="/vehicle" title="Vehicle Console" desc="VIN, MyMazda telemetry, CV subscription, open recalls" />
              <ConsoleLink to="/warranty" title="Warranty / Owner Case" desc="MGWS-matched claim drafted by Atlas" />
              <ConsoleLink to="/dealer-scorecard" title="Dealer Performance" desc="DR acceptance, CSI, recall completion, visit prep" />
              <ConsoleLink to="/household" title="Customer 360 / Household" desc="Key-ring identity, multi-VIN garage, trade-cycle propensity" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-primary">{eyebrow}</div>
      <h2 className="text-xl mt-1">{title}</h2>
    </div>
  );
}

function Spark({ seed, positive }: { seed: number; positive: boolean }) {
  const data = React.useMemo(() => {
    const rng = (n: number) => Math.abs(Math.sin((seed + 1) * (n + 1) * 1.3)) * 30 + 20;
    return Array.from({ length: 12 }, (_, i) => ({ i, v: rng(i) + (positive ? i * 1.2 : -i * 0.6) }));
  }, [seed, positive]);
  const color = positive ? "hsl(var(--success))" : "hsl(var(--warning))";
  return (
    <div className="h-8 mt-2 -mx-1">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`sp-${seed}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sp-${seed})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ConsoleLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="group rounded border hairline bg-card p-3 flex items-center gap-3 hover:border-primary transition-colors">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}