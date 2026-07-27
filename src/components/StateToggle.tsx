import { useState } from "react";

const StateToggle = ({ state, onChange }: { state: "current" | "agentic"; onChange: (s: "current" | "agentic") => void }) => (
  <div className="flex items-center gap-1 sm:gap-2 bg-secondary/50 rounded-lg p-1">
    <button onClick={() => onChange("current")} className={`text-[10px] sm:text-[11px] font-medium px-2.5 sm:px-4 py-1.5 rounded-md transition-all ${state === "current" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Current State</button>
    <button onClick={() => onChange("agentic")} className={`text-[10px] sm:text-[11px] font-medium px-2.5 sm:px-4 py-1.5 rounded-md transition-all ${state === "agentic" ? "bg-primary/20 text-primary shadow-sm glow-primary" : "text-muted-foreground hover:text-foreground"}`}>⚡ Agentic Future</button>
  </div>
);

const currentMetrics = [
  { label: "Product Discovery", current: "Manual catalog browsing + basic search", agentic: "Einstein AI search with visual recognition + predictive suggestions" },
  { label: "Pricing Strategy", current: "Static price lists updated quarterly", agentic: "Dynamic pricing based on GA4 demand signals + elasticity models" },
  { label: "Cart Recovery", current: "Batch email reminders (24h delay)", agentic: "Real-time exit-intent + personalized recovery flows (< 1 min)" },
  { label: "Marketing Attribution", current: "Last-click reporting in GA4", agentic: "Data-driven multi-touch attribution with automated budget shifting" },
  { label: "Customer Retention", current: "Manual account reviews (quarterly)", agentic: "Continuous churn prediction + automated re-engagement triggers" },
  { label: "Catalog Management", current: "Manual product data entry (2-week cycle)", agentic: "AI-enriched product listings with auto-generated specs & compatibility" },
];

const CurrentVsFuture = ({ state }: { state: "current" | "agentic" }) => (
  <div className="glass-card p-4 sm:p-5">
    <h3 className="text-sm font-semibold text-foreground mb-3">{state === "current" ? "Current eCommerce Operations" : "Agentic eCommerce Future"}</h3>
    <div className="space-y-2">
      {currentMetrics.map((m) => (
        <div key={m.label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
          <span className="text-muted-foreground sm:w-40 shrink-0 font-medium sm:font-normal">{m.label}</span>
          <div className={`flex-1 rounded-lg p-2 transition-all ${state === "agentic" ? "bg-primary/5 border border-primary/20" : "bg-secondary/50 border border-border/30"}`}>
            <span className={state === "agentic" ? "text-primary" : "text-foreground"}>{state === "agentic" ? m.agentic : m.current}</span>
          </div>
        </div>
      ))}
    </div>
    {state === "agentic" && (
      <div className="mt-4 bg-primary/5 border border-primary/20 rounded-lg p-3">
        <div className="text-[10px] text-primary font-medium mb-1">Projected Annual Impact</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><div className="font-mono text-base sm:text-lg font-bold text-success">+$68M</div><div className="text-[9px] text-muted-foreground">Incremental Revenue</div></div>
          <div><div className="font-mono text-base sm:text-lg font-bold text-primary">4.8%</div><div className="text-[9px] text-muted-foreground">Target Conv Rate</div></div>
          <div><div className="font-mono text-base sm:text-lg font-bold text-warning">-42%</div><div className="text-[9px] text-muted-foreground">Cart Abandonment</div></div>
        </div>
      </div>
    )}
  </div>
);

export { StateToggle, CurrentVsFuture };
