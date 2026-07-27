import { useEffect, useState } from "react";
import { AlertTriangle, X, MessageSquare } from "lucide-react";

export interface AlertItem {
  id: number;
  agentId: string;
  agent: string;
  message: string;
  severity: "warning" | "critical";
  time: string;
}

const alertsPool: Omit<AlertItem, "id">[] = [
  { agentId: "cart", agent: "Cart Recovery Agent", message: "Checkout step 3 drop-off spiked to 38% in last hour — shipping cost shock on 12 high-value carts ($84K total)", severity: "critical", time: "Just now" },
  { agentId: "retention", agent: "Retention Agent", message: "Duke Energy Services (Top 1 account, $3.2M/yr) — no orders in 94 days, competitor portal visits detected in GA4", severity: "critical", time: "2 min ago" },
  { agentId: "merchandising", agent: "Merchandising Agent", message: "GA4 site search: 1,240 queries for 'wind gearbox bearing' today — product page missing from SFCC catalog", severity: "warning", time: "5 min ago" },
  { agentId: "marketing", agent: "Marketing Attribution Agent", message: "Google Ads CPC up 18% this week — ROAS dropping below 4.5x threshold on non-brand campaigns", severity: "warning", time: "8 min ago" },
  { agentId: "revenue", agent: "Revenue Optimization Agent", message: "Einstein A/B test results: dynamic pricing variant showing +14% revenue on top 200 SKUs (95% confidence)", severity: "warning", time: "12 min ago" },
];

interface StreamingAlertsProps {
  onAlertClick?: (agentId: string, alertContext: string) => void;
}

const StreamingAlerts = ({ onAlertClick }: StreamingAlertsProps) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  useEffect(() => {
    let idx = 0;
    const addAlert = () => {
      if (idx >= alertsPool.length) return;
      const alert = { ...alertsPool[idx], id: idx };
      setAlerts((prev) => [alert, ...prev]);
      idx++;
    };
    const timers = alertsPool.map((_, i) => setTimeout(addAlert, i * 2500));
    return () => timers.forEach(clearTimeout);
  }, []);

  const dismiss = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed((prev) => new Set(prev).add(id));
  };
  const visible = alerts.filter((a) => !dismissed.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.map((alert, i) => (
        <div
          key={alert.id}
          onClick={() => onAlertClick?.(alert.agentId, alert.message)}
          className={`flex items-start sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-xl border animate-slide-up cursor-pointer transition-all hover:shadow-md ${alert.severity === "critical" ? "bg-destructive/5 border-destructive/20 hover:bg-destructive/10" : "bg-warning/5 border-warning/20 hover:bg-warning/10"}`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <AlertTriangle className={`w-3.5 h-3.5 shrink-0 mt-0.5 sm:mt-0 ${alert.severity === "critical" ? "text-destructive" : "text-warning"} animate-stream`} />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground">{alert.agent}</span>
            <span className="text-[10px] text-muted-foreground mx-1.5 hidden sm:inline">•</span>
            <span className="text-xs text-foreground block sm:inline">{alert.message}</span>
          </div>
          <button className="text-[10px] text-primary hover:text-primary/80 transition-colors shrink-0 flex items-center gap-1 font-medium">
            <MessageSquare className="w-3 h-3" /> <span className="hidden sm:inline">Investigate</span>
          </button>
          <span className="text-[9px] text-muted-foreground shrink-0 hidden sm:block">{alert.time}</span>
          <button onClick={(e) => dismiss(alert.id, e)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0"><X className="w-3 h-3" /></button>
        </div>
      ))}
    </div>
  );
};

export default StreamingAlerts;
