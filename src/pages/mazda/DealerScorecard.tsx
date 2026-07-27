import { motion } from "framer-motion";
import {
  Calendar,
  Sparkles,
  Check,
  Building2,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  Car,
  Users,
  Wrench,
  ArrowUpRight,
  Star,
  Clock,
} from "lucide-react";
import { DEALER_SCORECARD } from "@/lib/mazda-mock";
import { PageHeader, Crumb, HighlightsPanel } from "@/components/MazdaAppShell";
import { Link } from "react-router-dom";
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const DEALER_PROFILE = {
  principal: "Beverly Galpin",
  gm: "Theo Marquez",
  contact: "(818) 778-2000",
  email: "ops@galpinmazda.com",
  address: "15555 Roscoe Blvd, Van Nuys, CA 91406",
  pma: "PMA: Los Angeles North · 412k households",
  tier: "Tier 1 · Master Dealer",
  since: "Franchised since 2003",
};

const PIPELINE = [
  { stage: "New Leads", count: 184, delta: "+12%", tone: "up" as const },
  { stage: "Working", count: 96, delta: "+4%", tone: "up" as const },
  { stage: "Test Drive", count: 41, delta: "−6%", tone: "down" as const },
  { stage: "Quoted", count: 27, delta: "+2%", tone: "up" as const },
  { stage: "Sold MTD", count: 64, delta: "+9%", tone: "up" as const },
];

const INVENTORY = [
  { model: "CX-5", on: 38, target: 45, ds: 24 },
  { model: "CX-50", on: 22, target: 28, ds: 18 },
  { model: "CX-90 PHEV", on: 9, target: 14, ds: 11 },
  { model: "Mazda3", on: 17, target: 20, ds: 32 },
  { model: "MX-5 Miata", on: 6, target: 8, ds: 41 },
];

const SERVICE_OPS = [
  { label: "RO throughput (wk)", value: "412", trend: "+18", good: true },
  { label: "Hours per RO", value: "2.1", trend: "+0.2", good: true },
  { label: "First-time fix rate", value: "78%", trend: "−3 pts", good: false },
  { label: "Service CSI", value: "892", trend: "+6", good: true },
];

const RECALLS = [
  { code: "C2451", model: "CX-5 (2021–22)", open: 76, total: 132, severity: "high" as const },
  { code: "R2390", model: "CX-9 (2019–20)", open: 18, total: 64, severity: "med" as const },
  { code: "S2402", model: "CX-30 (2023)", open: 4, total: 22, severity: "low" as const },
];

const ACTIVITY = [
  { when: "2h ago", who: "Atlas", what: "Drafted SMS booking flow for 76 open C2451 VINs.", tag: "Recall" },
  { when: "Today 9:14a", who: "Marcus Avila (MNAO)", what: "Logged coaching note: BDC SLA gap on weekends.", tag: "Coaching" },
  { when: "Yesterday", who: "Atlas", what: "Flagged 24 lease maturities inside 60-day window.", tag: "Trade-cycle" },
  { when: "2d ago", who: "Theo Marquez (GM)", what: "Closed 3 owner cases decoupled from Siebel CAC.", tag: "Owner" },
];

function PipelineBar({ s }: { s: typeof PIPELINE[number] }) {
  const TrendIcon = s.tone === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="rounded border hairline bg-card p-4 flex flex-col gap-1">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.stage}</div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold tabular-nums">{s.count}</div>
        <div className={`flex items-center gap-1 text-[11px] ${s.tone === "up" ? "text-success" : "text-warning"}`}>
          <TrendIcon className="h-3 w-3" />
          {s.delta}
        </div>
      </div>
    </div>
  );
}

export default function DealerScorecardPage() {
  const d = DEALER_SCORECARD;
  const radarData = d.metrics.slice(0, 6).map((m) => {
    const num = parseFloat(m.value.replace(/[^0-9.]/g, "")) || 50;
    const normalized = m.label.includes("CSI") ? num / 10 : m.label.includes("Submit") ? 100 - num * 30 : num;
    return { metric: m.label.split(" ").slice(0, 2).join(" "), value: Math.min(100, normalized), district: Math.min(100, normalized * 0.85) };
  });
  const pipelineData = PIPELINE.map((s) => ({ stage: s.stage, count: s.count }));
  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto space-y-6">
      <Crumb>Dealer 360 · {d.name}</Crumb>
      <HighlightsPanel
        icon={Building2}
        iconTone="blue"
        recordType="Dealer Account"
        title={`${d.name} · #45821`}
        actions={
          <>
            <button className="px-3 h-8 rounded border hairline text-xs bg-card hover:bg-muted">Log a call</button>
            <button className="px-3 h-8 rounded border hairline text-xs bg-card hover:bg-muted">New task</button>
            <button className="inline-flex items-center gap-2 px-3 h-8 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
              <Calendar className="h-3.5 w-3.5" /> Schedule visit
            </button>
          </>
        }
        fields={[
          { label: "Tier", value: DEALER_PROFILE.tier },
          { label: "Region", value: "West · District 4" },
          { label: "Principal", value: DEALER_PROFILE.principal },
          { label: "GM", value: DEALER_PROFILE.gm },
          { label: "PMA", value: "412k HH · Los Angeles North" },
          { label: "Franchised", value: "Since 2003" },
        ]}
      />

      <PageHeader
        eyebrow="MNAO Field · Dealer Performance"
        title="Performance overview"
        description="Joined signals across DR retail, owner support, MyMazda activations, MGWS warranty, and recall completion. Atlas surfaces deltas vs target and ranks recommended actions."
      />

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="space-y-6">
          <div className="rounded border hairline bg-card p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div><div className="text-muted-foreground">Address</div><div className="text-foreground">{DEALER_PROFILE.address}</div></div>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div><div className="text-muted-foreground">Main</div><div className="text-foreground">{DEALER_PROFILE.contact}</div></div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div><div className="text-muted-foreground">Ops inbox</div><div className="text-foreground">{DEALER_PROFILE.email}</div></div>
            </div>
            <div className="flex items-start gap-2">
              <Star className="h-3.5 w-3.5 text-warning mt-0.5" />
              <div><div className="text-muted-foreground">Standing</div><div className="text-foreground">President's Club · 2024</div></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="rounded border hairline bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Performance radar</div>
                  <h3 className="text-lg mt-1">Galpin vs District median</h3>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <Radar name="Galpin" dataKey="value" stroke="hsl(var(--soul-red))" fill="hsl(var(--soul-red))" fillOpacity={0.35} />
                    <Radar name="District" dataKey="district" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.15} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>
            <section className="rounded border hairline bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Sales pipeline</div>
                  <h3 className="text-lg mt-1">Stage volume · MTD</h3>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section>
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Performance · trailing 30d</div>
                <h2 className="text-xl font-semibold">Scorecard metrics</h2>
              </div>
              <div className="text-xs text-muted-foreground">vs district median · West</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {d.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded border hairline bg-card p-4 flex flex-col gap-2 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground leading-tight">{m.label}</div>
                  <div className="text-2xl font-semibold tabular-nums">{m.value}</div>
                  <div className={`text-[11px] inline-flex items-center gap-1 ${m.good ? "text-success" : "text-warning"}`}>
                    {m.good ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {m.trend}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <section className="rounded border hairline bg-card overflow-hidden">
              <div className="px-5 py-3 border-b hairline flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Sales pipeline</h3>
                <span className="ml-auto text-[11px] text-muted-foreground">From Auto Cloud + DR partners</span>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {PIPELINE.map((s) => <PipelineBar key={s.stage} s={s} />)}
              </div>
            </section>

            <section className="rounded border hairline bg-card overflow-hidden">
              <div className="px-5 py-3 border-b hairline flex items-center gap-2">
                <Car className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Inventory mix</h3>
                <span className="ml-auto text-[11px] text-muted-foreground">on-lot vs target · days supply</span>
              </div>
              <div className="p-5 space-y-3">
                {INVENTORY.map((i) => {
                  const pct = Math.min(100, Math.round((i.on / i.target) * 100));
                  const low = pct < 80;
                  return (
                    <div key={i.model}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-medium text-foreground">{i.model}</span>
                        <span className="text-muted-foreground tabular-nums">{i.on}/{i.target} · {i.ds} DS</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${low ? "bg-warning" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="grid md:grid-cols-[1fr_1.1fr] gap-6">
            <section className="rounded border hairline bg-card overflow-hidden">
              <div className="px-5 py-3 border-b hairline flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Service operations</h3>
              </div>
              <div className="p-5 grid grid-cols-2 gap-3">
                {SERVICE_OPS.map((m) => (
                  <div key={m.label} className="rounded border hairline bg-card p-3">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
                    <div className="text-xl font-semibold mt-1 tabular-nums">{m.value}</div>
                    <div className={`text-[11px] mt-0.5 ${m.good ? "text-success" : "text-warning"}`}>{m.trend}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded border hairline bg-card overflow-hidden">
              <div className="px-5 py-3 border-b hairline flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Open recall campaigns</h3>
                <span className="ml-auto text-[11px] text-muted-foreground">VIN-level via MyMazda</span>
              </div>
              <div className="divide-y hairline">
                {RECALLS.map((r) => {
                  const pct = Math.round(((r.total - r.open) / r.total) * 100);
                  const tone = r.severity === "high" ? "bg-warning" : r.severity === "med" ? "bg-primary" : "bg-success";
                  return (
                    <div key={r.code} className="px-5 py-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          {r.severity === "high" && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
                          <span className="font-semibold text-foreground">{r.code}</span>
                          <span className="text-muted-foreground">· {r.model}</span>
                        </div>
                        <span className="tabular-nums text-muted-foreground">{r.total - r.open}/{r.total} closed · {pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="rounded border hairline bg-card overflow-hidden">
            <div className="p-5 border-b hairline flex items-center gap-3">
              <div className="h-9 w-9 rounded bg-gradient-soul flex items-center justify-center shadow-soul">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Atlas-generated</div>
                <h2 className="text-lg font-semibold mt-0.5">Visit briefing — {d.visit.date}</h2>
              </div>
              <div className="ml-auto text-xs text-muted-foreground">Field rep: <span className="text-foreground font-medium">{d.visit.rep}</span></div>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-muted-foreground max-w-3xl">Atlas synthesized a briefing from scorecard deltas, open issues, and prior coaching notes. Talking points are ranked by impact.</p>
              <ul className="grid md:grid-cols-2 gap-2">
                {d.visit.talkingPoints.map((t, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-3 rounded bg-secondary border hairline p-3">
                    <span className="text-sm text-primary w-5 font-medium tabular-nums">0{i + 1}</span>
                    <span className="text-sm flex-1">{t}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 pt-2">
                <button className="px-3 py-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" /> Approve coaching plan
                </button>
                <button className="px-3 py-2 rounded border hairline text-xs text-muted-foreground hover:text-foreground bg-card">Modify</button>
                <button className="px-3 py-2 rounded border hairline text-xs text-muted-foreground hover:text-foreground bg-card">Send to dealer</button>
              </div>
            </div>
          </section>

          <section className="rounded border hairline bg-card overflow-hidden">
            <div className="px-5 py-3 border-b hairline flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Recent activity</h3>
              <button className="ml-auto text-[11px] text-primary inline-flex items-center gap-1 hover:underline">View all <ArrowUpRight className="h-3 w-3" /></button>
            </div>
            <ul className="divide-y hairline">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="px-5 py-3 flex gap-3 items-start text-sm">
                  <div className="h-7 w-7 rounded-full bg-secondary border hairline flex items-center justify-center text-[10px] font-semibold text-muted-foreground flex-shrink-0">
                    {a.who.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground">{a.what}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{a.who} · {a.when}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-muted-foreground">{a.tag}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="rounded border hairline bg-card p-4 space-y-3">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">District ranking</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold tabular-nums">#3</span>
              <span className="text-xs text-muted-foreground">of 18 dealers · West D4</span>
            </div>
            <div className="text-xs text-success inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Up 2 spots vs Q1
            </div>
            <div className="pt-3 border-t hairline space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Sales volume</span><span className="font-medium">#2</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">CSI</span><span className="font-medium">#7</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">CV activations</span><span className="font-medium">#1</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Recall completion</span><span className="font-medium text-warning">#14</span></div>
            </div>
          </div>
          <Link to="/leads" className="block rounded border hairline bg-card p-4 hover:border-primary transition-colors">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Jump to</div>
            <div className="text-sm font-medium mt-1">Lead routing console →</div>
            <div className="text-xs text-muted-foreground">See live SLA + Einstein scores</div>
          </Link>
          <Link to="/household" className="block rounded border hairline bg-card p-4 hover:border-primary transition-colors">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Jump to</div>
            <div className="text-sm font-medium mt-1">Top household profiles →</div>
            <div className="text-xs text-muted-foreground">Trade-cycle, LTV, garage</div>
          </Link>
        </aside>
      </div>
    </div>
  );
}