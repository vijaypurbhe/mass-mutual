import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Battery, AlertTriangle, ShieldCheck, Sparkles, ArrowRight, Gauge, MapPin } from "lucide-react";
import { VEHICLE, FLEET_DTC_TREND } from "@/lib/mazda-mock";
import { PageHeader, Crumb } from "@/components/MazdaAppShell";
import { usePersona } from "@/lib/persona-context";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

export default function VehiclePage() {
  const { persona } = usePersona();
  const isPartner = persona === "partner";
  const mileageTrend = [
    { m: "Nov", v: 12200 }, { m: "Dec", v: 13400 }, { m: "Jan", v: 14600 },
    { m: "Feb", v: 15800 }, { m: "Mar", v: 17100 }, { m: "Apr", v: 18420 },
  ];
  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto">
      <Crumb>Vehicle 360</Crumb>
      <PageHeader
        eyebrow="Stage 4 · Ownership & Connected Vehicle"
        title={VEHICLE.model}
        description={`VIN ${VEHICLE.vin} · ${VEHICLE.color} · ${VEHICLE.owner}`}
        actions={
          <Link to="/warranty" className="inline-flex items-center gap-2 px-3 py-2 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
            Open warranty draft <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <TileLink to="/household" label="Mileage" value={VEHICLE.mileage.toLocaleString()} icon={Gauge} />
          <TileLink to="/vehicle" label="Battery SoH" value={`${VEHICLE.battery.soh}%`} icon={Battery} positive />
          <TileLink to="/household" label="In service since" value={VEHICLE.inService} />
          <TileLink to="/warranty" label="Warranty (MGWS)" value="Powertrain 8yr" sub={`Through ${VEHICLE.warranty.expires}`} icon={ShieldCheck} positive />
          <TileLink to="/household" label="CV Subscription" value={VEHICLE.cvSubscription.status} sub={`Renews ${VEHICLE.cvSubscription.renewsOn}`} positive />
          <TileLink to="/warranty" label="Open Recall" value={VEHICLE.openCampaign.id} sub="Tap to book" icon={AlertTriangle} warning />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="rounded border hairline bg-card p-5 lg:col-span-2">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Telematics</div>
                <h2 className="text-xl mt-1">Mileage accrual · trailing 6 months</h2>
              </div>
              <div className="text-xs text-success">+1,320 mi · last 30d</div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mileageTrend}>
                  <defs>
                    <linearGradient id="mi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--soul-red))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--soul-red))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="v" stroke="hsl(var(--soul-red))" strokeWidth={2} fill="url(#mi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded border hairline bg-card p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Health</div>
            <h2 className="text-xl mt-1 mb-3">Battery SoH</h2>
            <div className="h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "soh", value: VEHICLE.battery.soh, fill: "hsl(var(--success))" }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "hsl(var(--secondary))" }} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-3xl font-semibold">{VEHICLE.battery.soh}%</div>
                <div className="text-[11px] text-muted-foreground">{VEHICLE.battery.voltage}V</div>
              </div>
            </div>
          </section>
        </div>

          <section className="rounded border hairline bg-card overflow-hidden">
            <div className="p-5 border-b hairline">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Connected vehicle stream</div>
              <h2 className="text-xl mt-1">Diagnostic trouble codes</h2>
            </div>
            <div className="divide-y divide-border">
              {VEHICLE.dtc.map((d, i) => (
                <motion.div key={d.code} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Link to="/warranty" className="p-5 flex items-start gap-4 hover:bg-primary/5 transition-colors group">
                    <div className={`h-9 w-9 rounded flex items-center justify-center flex-shrink-0 ${d.severity === "Med" ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground"}`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono font-medium group-hover:text-primary">{d.code}</code>
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border hairline text-muted-foreground">{d.severity}</span>
                        <span className="text-xs text-muted-foreground ml-auto">{d.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
                      {d.code === "P0420" && (
                        <div className="mt-3 rounded border border-primary/30 bg-accent p-3 flex gap-2 text-xs">
                          <Sparkles className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Atlas matched this DTC to your powertrain warranty and drafted a claim — open warranty workbench.</span>
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all self-center" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="rounded border hairline bg-card p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">History</div>
            <h2 className="text-xl mt-1 mb-4">Service & ownership timeline</h2>
            <div className="space-y-4">
              {VEHICLE.history.map((h, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-xs text-muted-foreground w-28 flex-shrink-0 pt-0.5">{h.date}</div>
                  <div className="border-l hairline pl-4 pb-2 flex-1">
                    <div className="text-sm font-medium">{h.event}</div>
                    <div className="text-xs text-muted-foreground">{h.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {isPartner && (
            <section className="rounded border border-primary/30 bg-accent p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Partner view · Denso Powertrain</div>
              <h2 className="text-xl mt-1 mb-1">Fleet trend · DTC P0420 · catalyst component</h2>
              <p className="text-xs text-muted-foreground mb-4">Aggregated across all 2024 CX-50 VINs in the field.</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={FLEET_DTC_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--soul-red))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--soul-red))" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">Request engineering review</button>
                <button className="px-3 py-1.5 rounded border hairline text-xs text-muted-foreground hover:text-foreground">Export VIN list (CSV)</button>
              </div>
            </section>
          )}
      </div>
    </div>
  );
}

function TileLink({ to, label, value, sub, icon: Icon, positive, warning }: { to: string; label: string; value: string; sub?: string; icon?: React.ComponentType<{ className?: string }>; positive?: boolean; warning?: boolean }) {
  return (
    <Link to={to} className={`rounded border hairline bg-card p-4 hover:shadow-md transition-all group ${warning ? "hover:border-warning" : "hover:border-primary"}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className={`h-3 w-3 ${warning ? "text-warning" : positive ? "text-success" : ""}`} />}
        {label}
      </div>
      <div className="text-lg mt-1 font-semibold group-hover:text-primary transition-colors truncate">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground truncate">{sub}</div>}
    </Link>
  );
}