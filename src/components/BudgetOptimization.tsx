import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const initialBudget = [
  { channel: "Paid Search (Google Ads)", current: 320, recommended: 270, roas: 5.2 },
  { channel: "SEO & Content", current: 80, recommended: 140, roas: 12.4 },
  { channel: "Email (Marketing Cloud)", current: 60, recommended: 110, roas: 8.4 },
  { channel: "Social & Display", current: 180, recommended: 120, roas: 3.1 },
  { channel: "Retargeting", current: 40, recommended: 40, roas: 6.2 },
  { channel: "Marketplace / 3P", current: 20, recommended: 40, roas: 4.8 },
];

const attributionData = [
  { touchpoint: "Last Click", organic: 30, paid: 38, email: 12, direct: 14, social: 6 },
  { touchpoint: "First Click", organic: 42, paid: 28, email: 8, direct: 10, social: 12 },
  { touchpoint: "Linear", organic: 36, paid: 28, email: 16, direct: 12, social: 8 },
  { touchpoint: "Data-Driven (GA4)", organic: 34, paid: 23, email: 22, direct: 14, social: 7 },
];

const BudgetOptimization = () => {
  const [budgets, setBudgets] = useState(initialBudget.map((b) => ({ ...b, adjusted: b.current })));
  const [activeModel, setActiveModel] = useState("Data-Driven (GA4)");

  const totalCurrent = budgets.reduce((s, b) => s + b.current, 0);
  const totalAdjusted = budgets.reduce((s, b) => s + b.adjusted, 0);
  const predictedRevenue = budgets.reduce((s, b) => s + b.adjusted * b.roas, 0);
  const currentRevenue = budgets.reduce((s, b) => s + b.current * b.roas, 0);
  const delta = predictedRevenue - currentRevenue;

  const handleSlider = (i: number, val: number) => {
    setBudgets((prev) => prev.map((b, idx) => (idx === i ? { ...b, adjusted: val } : b)));
  };

  const applyRecommended = () => {
    setBudgets((prev) => prev.map((b) => ({ ...b, adjusted: b.recommended })));
  };

  return (
    <div className="glass-card p-4 sm:p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Marketing Budget & Attribution</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">GA4 multi-touch attribution + what-if budget simulator</p>
        </div>
        <button onClick={applyRecommended} className="text-[10px] font-medium px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors self-start">Apply AI Recommendations</button>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Attribution Model</span>
          <div className="flex flex-wrap gap-1">
            {attributionData.map((m) => (
              <button key={m.touchpoint} onClick={() => setActiveModel(m.touchpoint)} className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${activeModel === m.touchpoint ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{m.touchpoint}</button>
            ))}
          </div>
        </div>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[attributionData.find((d) => d.touchpoint === activeModel)!]} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 50]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="touchpoint" hide />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "11px" }} formatter={(v: number) => [`${v}%`]} />
              <Bar dataKey="organic" name="Organic Search" stackId="a" fill="hsl(var(--primary))" />
              <Bar dataKey="paid" name="Paid Search" stackId="a" fill="hsl(var(--warning))" />
              <Bar dataKey="email" name="Email" stackId="a" fill="hsl(var(--success))" />
              <Bar dataKey="direct" name="Direct" stackId="a" fill="hsl(var(--chart-4))" />
              <Bar dataKey="social" name="Social/Display" stackId="a" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-1">
          {[
            { label: "Organic", cssVar: "--primary" },
            { label: "Paid Search", cssVar: "--warning" },
            { label: "Email", cssVar: "--success" },
            { label: "Direct", cssVar: "--chart-4" },
            { label: "Social", cssVar: "--muted-foreground" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1 text-[9px] text-muted-foreground">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: `hsl(var(${l.cssVar}))` }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-3">What-If Budget Allocation ($K/quarter)</div>
        <div className="space-y-3">
          {budgets.map((b, i) => (
            <div key={b.channel} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-xs text-foreground sm:w-44 shrink-0">{b.channel}</span>
              <input type="range" min={0} max={500} value={b.adjusted} onChange={(e) => handleSlider(i, Number(e.target.value))} className="flex-1 h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer" />
              <div className="flex items-center gap-2 sm:w-20 sm:justify-end">
                <span className="font-mono text-xs text-foreground">${b.adjusted}K</span>
                {b.adjusted !== b.current && (
                  <span className={`text-[9px] font-mono ${b.adjusted > b.current ? "text-success" : "text-destructive"}`}>
                    {b.adjusted > b.current ? "+" : ""}{b.adjusted - b.current}K
                  </span>
                )}
              </div>
              <span className="text-[9px] text-muted-foreground sm:w-14 sm:text-right">{b.roas}x ROAS</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
        <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Total Spend</div>
          <div className="font-mono text-xs sm:text-sm font-bold text-foreground">${totalAdjusted}K</div>
          {totalAdjusted !== totalCurrent && <div className={`text-[9px] font-mono ${totalAdjusted > totalCurrent ? "text-warning" : "text-success"}`}>{totalAdjusted > totalCurrent ? "+" : ""}{totalAdjusted - totalCurrent}K</div>}
        </div>
        <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Predicted Revenue</div>
          <div className="font-mono text-xs sm:text-sm font-bold text-foreground">${(predictedRevenue / 1000).toFixed(1)}M</div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Incremental</div>
          <div className={`font-mono text-xs sm:text-sm font-bold ${delta >= 0 ? "text-success" : "text-destructive"}`}>{delta >= 0 ? "+" : ""}${(delta / 1000).toFixed(1)}M</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOptimization;
