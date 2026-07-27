import { motion } from "framer-motion";
import { Sparkles, Check, FileText, Wrench } from "lucide-react";
import { WARRANTY_DRAFT } from "@/lib/mazda-mock";
import { PageHeader, Crumb } from "@/components/MazdaAppShell";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Link } from "react-router-dom";

export default function WarrantyPage() {
  const partsTotal = WARRANTY_DRAFT.partsRequested.reduce((a, p) => a + parseFloat(p.unit.replace(/[$,]/g, "")) * p.qty, 0);
  const laborTotal = WARRANTY_DRAFT.laborCodes.reduce((a, l) => a + l.hours * 105, 0);
  const costBreakdown = [
    { name: "Parts", value: Math.round(partsTotal), fill: "hsl(var(--primary))" },
    { name: "Labor", value: Math.round(laborTotal), fill: "hsl(var(--soul-red))" },
    { name: "Diagnostics", value: 68, fill: "hsl(var(--muted-foreground))" },
  ];
  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto">
      <Crumb>Warranty Workbench</Crumb>
      <PageHeader
        eyebrow="Owner Support · Service Console"
        title={`Warranty claim ${WARRANTY_DRAFT.claimId}`}
        description={`Triggered by DTC ${WARRANTY_DRAFT.failureCode} on VIN ${WARRANTY_DRAFT.vin} via MyMazda CV stream. Atlas pre-filled against MGWS — review and submit.`}
        actions={<Link to="/vehicle" className="text-xs px-3 py-2 rounded border hairline hover:border-primary">← Back to vehicle</Link>}
      />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded border border-primary/30 bg-accent p-4 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium">Atlas pre-filled this claim in 4.2 seconds.</span>{" "}
              <span className="text-muted-foreground">Parts and labor pulled from BOM and standard times. Policy match verified against the powertrain warranty (year 1 of 8). Estimated saves 18 minutes of advisor time.</span>
            </div>
          </motion.div>

          <Section title="Failure information" icon={Wrench}>
            <Field label="VIN" value={WARRANTY_DRAFT.vin} mono />
            <Field label="Failure code" value={WARRANTY_DRAFT.failureCode} mono />
            <Field label="Policy match" value={WARRANTY_DRAFT.policyMatch} positive />
          </Section>

          <Section title="Parts requested" icon={FileText}>
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left py-2 font-medium">Part #</th><th className="text-left font-medium">Description</th><th className="text-right font-medium">Qty</th><th className="text-right font-medium">Unit</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WARRANTY_DRAFT.partsRequested.map((p) => (
                  <tr key={p.pn}>
                    <td className="py-2 font-mono text-xs">{p.pn}</td>
                    <td className="text-muted-foreground">{p.desc}</td>
                    <td className="text-right">{p.qty}</td>
                    <td className="text-right font-medium">{p.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="Labor codes" icon={Wrench}>
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="text-left py-2 font-medium">Code</th><th className="text-left font-medium">Operation</th><th className="text-right font-medium">Hours</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {WARRANTY_DRAFT.laborCodes.map((l) => (
                  <tr key={l.code}>
                    <td className="py-2 font-mono text-xs">{l.code}</td>
                    <td className="text-muted-foreground">{l.desc}</td>
                    <td className="text-right font-medium">{l.hours.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <div className="rounded border hairline bg-card p-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Estimated total</div>
              <div className="text-3xl mt-1">{WARRANTY_DRAFT.estimatedTotal}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded border hairline text-sm text-muted-foreground hover:text-foreground">Edit</button>
              <button className="px-4 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                <Check className="h-4 w-4" /> Submit claim
              </button>
            </div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded border hairline bg-card p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Cost breakdown</div>
            <h3 className="text-lg mt-1 mb-3">Claim composition</h3>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costBreakdown} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={2}>
                    {costBreakdown.map((c, i) => <Cell key={i} fill={c.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xl font-semibold">{WARRANTY_DRAFT.estimatedTotal}</div>
                <div className="text-[10px] text-muted-foreground">total</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
              {costBreakdown.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.fill }} />
                  <span className="text-muted-foreground flex-1">{c.name}</span>
                  <span className="font-medium">${c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded border hairline bg-card p-5">
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary">Avg approval time</div>
            <div className="text-3xl mt-2">4h 12m</div>
            <div className="text-xs text-success">−38% vs manual</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded border hairline bg-card overflow-hidden">
      <div className="px-5 py-3 border-b hairline flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, mono, positive }: { label: string; value: string; mono?: boolean; positive?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-1.5 text-sm">
      <div className="text-muted-foreground text-xs uppercase tracking-wider">{label}</div>
      <div className={`col-span-2 ${mono ? "font-mono text-xs" : ""} ${positive ? "text-success" : ""}`}>{value}</div>
    </div>
  );
}