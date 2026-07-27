import type { Scenario } from "@/data/mockData";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ScenarioPanel = ({ scenarios }: { scenarios: Scenario[] }) => {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const scenario = scenarios[active];

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-semibold text-foreground">Closed-Loop Scenario Simulation</h3>
        <div className="flex flex-wrap gap-1">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActive(i); setExpanded(false); }}
              className={`text-[10px] px-2.5 py-1 rounded-md transition-colors ${
                i === active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.title.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-warning/5 border border-warning/20 rounded-lg p-3 mb-4">
        <div className="text-[10px] text-warning font-medium mb-0.5">Trigger</div>
        <div className="text-xs text-foreground">{scenario.trigger}</div>
      </div>

      <div className="space-y-2">
        {scenario.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className={`w-2 h-2 rounded-full ${step.status === "complete" ? "bg-success" : step.status === "active" ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
              {i < scenario.steps.length - 1 && (
                <div className={`w-px h-6 ${step.status === "complete" ? "bg-success/30" : "bg-border"}`} />
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className={`text-xs font-medium ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{step.label}</div>
              <div className="text-[10px] text-muted-foreground">{step.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Projected Impact</span>
        <span className="font-mono text-sm font-bold text-success">{scenario.impact}</span>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full mt-3 flex items-center justify-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {expanded ? "Collapse Details" : "Deep Dive Analysis"}
      </button>

      {expanded && scenario.deepDive && (
        <div className="mt-3 space-y-4 animate-slide-up">
          <div className="bg-secondary/30 rounded-lg p-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Root Cause Analysis</div>
            <p className="text-xs text-foreground leading-relaxed">{scenario.deepDive.rootCause}</p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Supporting Data Points</div>
            <div className="space-y-1">
              {scenario.deepDive.dataPoints.map((dp, i) => (
                <div key={i} className="flex items-start gap-2 text-[10px]">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-foreground">{dp}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Financial Impact</div>
            <div className="grid grid-cols-2 gap-2">
              {scenario.deepDive.financialImpact.map((fi) => (
                <div key={fi.label} className="bg-secondary/50 rounded-lg p-2">
                  <div className="text-[9px] text-muted-foreground">{fi.label}</div>
                  <div className="text-xs font-mono font-semibold text-foreground">{fi.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div className="text-[10px] text-primary font-medium mb-1">⚡ AI Recommendation</div>
            <p className="text-xs text-foreground leading-relaxed">{scenario.deepDive.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioPanel;
