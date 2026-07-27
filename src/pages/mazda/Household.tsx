import { motion } from "framer-motion";
import { User, Car, CreditCard, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HOUSEHOLD } from "@/lib/mazda-mock";
import { PageHeader, Crumb } from "@/components/MazdaAppShell";
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function HouseholdPage() {
  const h = HOUSEHOLD;
  const ltvTrend = [
    { y: "2020", v: 32 }, { y: "2021", v: 58 }, { y: "2022", v: 92 },
    { y: "2023", v: 128 }, { y: "2024", v: 162 }, { y: "2025", v: 184 },
  ];
  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto">
      <Crumb>Customer 360</Crumb>
      <PageHeader
        eyebrow="Stage 1 + Stage 5 · Customer 360 + Trade-Cycle"
        title={h.name}
        description={`Data Cloud key-ring unifies ${h.members.length} drivers, ${h.garage.length} VINs, MFS lease, MyMazda + Owner's Club into one Auto Cloud profile. Trade-cycle propensity ${h.tradeCycle.propensity}.`}
      />
      <div className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="rounded border hairline bg-card p-6 border-l-4 border-l-primary lg:col-span-2">
            <div className="text-[10px] uppercase tracking-[0.14em] text-primary mb-1 font-medium">Data Cloud key-ring</div>
            <h2 className="text-xl font-semibold mb-4">Lifetime value trajectory</h2>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Lifetime value</div>
                <div className="text-3xl mt-1 text-primary">{h.ltv}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active vehicles</div>
                <div className="text-3xl mt-1">{h.garage.filter((g) => g.status.includes("Active")).length}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last engaged</div>
                <div className="text-sm mt-2">{h.marketing.lastEngaged}</div>
              </div>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ltvTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="y" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}k`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} formatter={(v) => `$${v}k`} />
                  <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded border hairline bg-card p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Trade-cycle</div>
            <h3 className="text-xl mt-1 mb-2">Repurchase propensity</h3>
            <div className="h-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="65%" outerRadius="100%" data={[{ name: "p", value: h.tradeCycle.propensity * 100, fill: "hsl(var(--soul-red))" }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "hsl(var(--secondary))" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl font-semibold">{Math.round(h.tradeCycle.propensity * 100)}%</div>
                <div className="text-[10px] text-muted-foreground">{h.tradeCycle.window}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">Next best: <span className="text-foreground">{h.tradeCycle.nextBest}</span></p>
          </section>
        </div>

          <section>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Members</div>
            <h2 className="text-xl mb-3">Drivers & co-drivers</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {h.members.map((m, i) => (
                <motion.button key={m.email} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="text-left rounded border hairline bg-card p-4 hover:border-primary hover:shadow-md transition-all">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-muted-foreground">{m.role}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.email}</div>
                </motion.button>
              ))}
            </div>
          </section>

          <section>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Garage</div>
            <h2 className="text-xl mb-3">Multi-vehicle history</h2>
            <div className="rounded border hairline bg-card overflow-hidden divide-y divide-border">
              {h.garage.map((g) => (
                <Link key={g.vin} to="/vehicle" className="p-4 flex items-center gap-4 hover:bg-primary/5 transition-colors group">
                  <div className="h-10 w-10 rounded bg-secondary flex items-center justify-center">
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">{g.model}</div>
                    <div className="text-xs text-muted-foreground font-mono">{g.vin}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${g.status.includes("Active") ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>{g.status}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded border hairline bg-card p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Finance</div>
              <h3 className="text-lg mb-3">Mazda Capital</h3>
              {h.finance.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-sm">
                    <div>{f.type} · {f.vehicle}</div>
                    <div className="text-xs text-muted-foreground">{f.remaining} remaining · {f.monthly}/mo</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded border hairline bg-card p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">Marketing</div>
              <h3 className="text-lg mb-3">Engagement</h3>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div>{h.marketing.lastEngaged}</div>
                  <div className="text-xs text-muted-foreground">Opt-in: {h.marketing.optIn ? "yes" : "no"}</div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}