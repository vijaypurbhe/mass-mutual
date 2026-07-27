import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { customerProfile } from "@/data/mockData";

const CustomerProfile = () => {
  const p = customerProfile;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">360° Account Intelligence</h3>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{p.segment}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">🏭</div>
        <div>
          <div className="text-sm font-semibold text-foreground">{p.name}</div>
          <div className="text-[10px] text-muted-foreground font-mono">{p.id} • {p.type}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {[
          { label: "Contract Value", value: p.contractValue },
          { label: "Predicted LTV", value: p.predictedLifetimeValue },
          { label: "Risk Score", value: `${p.riskScore}%` },
          { label: "Fleet", value: "24 units" },
          { label: "CSA Status", value: "Active" },
          { label: "Last Outage", value: p.lastOutage },
        ].map((item) => (
          <div key={item.label} className="bg-secondary/50 rounded-lg p-2">
            <div className="text-[9px] text-muted-foreground uppercase tracking-wide">{item.label}</div>
            <div className="text-xs font-mono font-semibold text-foreground mt-0.5">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2">Recent Events</div>
        <div className="space-y-1.5">
          {p.recentEvents.map((ev, i) => (
            <div key={i} className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${ev.type === "Alert" ? "bg-warning animate-pulse" : ev.type === "Commercial" ? "bg-primary" : "bg-success"}`} />
                <span className="text-foreground">{ev.detail}</span>
              </div>
              <span className="text-muted-foreground shrink-0 ml-2">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
        <div className="text-[10px] text-primary font-medium mb-1">🎯 Next Best Action</div>
        <div className="text-xs text-foreground">{p.nextBestAction}</div>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-3 flex items-center justify-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Collapse" : "View Full Account Intelligence"}
      </button>

      {expanded && (
        <div className="mt-3 space-y-4 animate-slide-up">
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">AI-Generated Account Summary</div>
            <p className="text-xs text-foreground leading-relaxed">{p.aiSummary}</p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Installed Fleet</div>
            <div className="text-xs text-foreground mb-2">{p.fleet}</div>
            <div className="space-y-1">
              {p.topAssets.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px]">
                  <span className="text-primary">⚡</span>
                  <span className="text-foreground">{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Digital Products Deployed</div>
            <div className="flex flex-wrap gap-1.5">
              {p.digitalProducts.map((dp) => (
                <span key={dp} className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{dp}</span>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="text-[10px] text-primary font-medium mb-1.5">Cross-Platform Activation Simulation</div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span className="text-foreground">Data Cloud: Unified account profile synced across SFCC, CRM, IoT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span className="text-foreground">Marketing Cloud: Proactive outreach triggered for hydrogen co-firing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary animate-pulse">→</span>
                <span className="text-foreground">CRM: Executive sponsor alert escalated for CSA renewal preparation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">○</span>
                <span className="text-muted-foreground">Commerce: Custom portal with personalized parts catalog ready for activation</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
