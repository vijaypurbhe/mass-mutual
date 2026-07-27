import { useState } from "react";
import { Check, Clock, AlertTriangle, Eye, ChevronRight } from "lucide-react";

interface ApprovalItem {
  id: string;
  agent: string;
  action: string;
  impact: string;
  risk: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected";
  reasoning: string[];
  dataLineage: string[];
  timestamp: string;
}

const approvals: ApprovalItem[] = [
  {
    id: "APR-001",
    agent: "Cart Recovery Agent",
    action: "Deploy tiered free shipping thresholds on SFCC checkout (orders >$5K = free ground)",
    impact: "Recover $29M/yr in abandoned carts",
    risk: "low",
    status: "pending",
    reasoning: [
      "GA4 funnel analysis: 34% of buyers exit at checkout step 3 when shipping costs are revealed",
      "Average freight cost on abandoned carts: $480 (18% of order value) — causing sticker shock",
      "Einstein A/B test on 20% of traffic showed 18% recovery improvement with shipping thresholds",
      "4 of 5 top competitors already offer free shipping above a threshold",
    ],
    dataLineage: [
      "GA4 → checkout funnel drop-off events",
      "SFCC → cart value + shipping cost calculations",
      "Einstein → A/B test conversion data",
      "Competitive Intel → competitor shipping policies",
      "SFCC Promotions API → threshold rule deployment",
    ],
    timestamp: "2 min ago",
  },
  {
    id: "APR-002",
    agent: "Retention Agent",
    action: "Launch personalized re-engagement campaign for 14 at-risk high-value accounts ($4.2M)",
    impact: "$4.2M at-risk revenue protected",
    risk: "medium",
    status: "pending",
    reasoning: [
      "14 accounts in top 50 inactive for 90+ days (vs 45-day typical reorder cycle)",
      "GA4 referral data shows 4 accounts visiting competitor portals",
      "Historical data: accounts re-engaged within 30 days of going dormant retain at 82% vs 41% after 120 days",
      "Marketing Cloud personalized campaigns show 24% reactivation rate on similar cohorts",
    ],
    dataLineage: [
      "SFCC → order history + reorder cycle analysis",
      "GA4 → session frequency, referral sources, engagement metrics",
      "Marketing Cloud → campaign performance benchmarks",
      "Einstein → churn prediction model v3.1 (87% accuracy)",
      "CRM → account health scoring",
    ],
    timestamp: "8 min ago",
  },
  {
    id: "APR-003",
    agent: "Revenue Optimization Agent",
    action: "Activate dynamic pricing on top 200 low-elasticity SKUs via SFCC pricing engine",
    impact: "+$8.6M incremental quarterly revenue",
    risk: "low",
    status: "approved",
    reasoning: [
      "GA4 behavioral analysis: <5% comparison shopping on these SKUs — buyers come direct",
      "Price elasticity modeling shows 8-15% price headroom on essential parts (filters, bearings, safety equipment)",
      "Contract/CSA customers excluded — only spot-buy and transactional orders affected",
      "A/B test validated: 14% revenue uplift with no measurable conversion drop",
    ],
    dataLineage: [
      "GA4 → product page behavior, comparison shopping signals",
      "SFCC → transaction history, price sensitivity analysis",
      "Einstein → price elasticity model + A/B test results",
      "ERP/SAP → cost basis and margin floors",
    ],
    timestamp: "1 hour ago",
  },
];

const riskColors = { low: "text-success bg-success/10", medium: "text-warning bg-warning/10", high: "text-destructive bg-destructive/10" };

const GovernancePanel = () => {
  const [items, setItems] = useState(approvals);
  const [expanded, setExpanded] = useState<string | null>("APR-001");

  const handleApprove = (id: string) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "approved" as const } : item)));
  const handleReject = (id: string) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "rejected" as const } : item)));

  return (
    <div className="glass-card p-4 sm:p-5 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Governance & Explainability</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">Human-in-the-loop approval workflow with full AI decision transparency</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const isExpanded = expanded === item.id;
          return (
            <div key={item.id} className={`border rounded-xl transition-all ${item.status === "approved" ? "border-success/20 bg-success/5" : item.status === "rejected" ? "border-destructive/20 bg-destructive/5" : "border-border/50 bg-secondary/20"}`}>
              <button onClick={() => setExpanded(isExpanded ? null : item.id)} className="w-full flex items-start sm:items-center gap-3 p-3 text-left">
                <div className="shrink-0 mt-0.5 sm:mt-0">
                  {item.status === "approved" ? <Check className="w-4 h-4 text-success" /> : item.status === "rejected" ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Clock className="w-4 h-4 text-warning animate-pulse" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="text-xs font-semibold text-foreground">{item.action}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full self-start ${riskColors[item.risk]}`}>{item.risk} risk</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{item.agent} • {item.timestamp} • Impact: <span className="text-success font-mono">{item.impact}</span></div>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isExpanded ? "rotate-90" : ""}`} />
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-border/30 pt-3 sm:ml-7">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5 flex items-center gap-1"><Eye className="w-3 h-3" /> Decision Reasoning</div>
                    <ol className="space-y-1">{item.reasoning.map((r, i) => (<li key={i} className="text-[10px] text-foreground flex gap-2"><span className="text-muted-foreground font-mono shrink-0">{i + 1}.</span>{r}</li>))}</ol>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Data Lineage</div>
                    <div className="flex flex-wrap gap-1">{item.dataLineage.map((d, i) => (<span key={i} className="text-[9px] bg-secondary/60 text-muted-foreground px-2 py-0.5 rounded-md font-mono">{d}</span>))}</div>
                  </div>
                  {item.status === "pending" && (
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => handleApprove(item.id)} className="text-[10px] font-medium px-4 py-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors">✓ Approve & Execute</button>
                      <button onClick={() => handleReject(item.id)} className="text-[10px] font-medium px-4 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">✕ Reject</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GovernancePanel;
