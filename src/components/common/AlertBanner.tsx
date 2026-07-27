import { Button } from "@/components/ui/button";
import { shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AlertRecord } from "@/types";
import { AlertTriangle, Info, ShieldAlert, TriangleAlert } from "lucide-react";
import { SeverityBadge } from "./StatusBadge";

const icons = { critical: ShieldAlert, high: TriangleAlert, medium: AlertTriangle, low: Info };

export function AlertBanner({ alert, onAction }: { alert: AlertRecord; onAction?: (alert: AlertRecord) => void }) {
  const Icon = icons[alert.severity];
  return (
    <div
      className={cn(
        "flex flex-wrap items-start gap-3 rounded border px-3 py-2.5",
        alert.severity === "critical" && "border-destructive/30 bg-destructive/5",
        alert.severity === "high" && "border-warning/40 bg-warning/10",
        alert.severity === "medium" && "border-border bg-muted/50",
        alert.severity === "low" && "border-border bg-muted/30",
      )}
    >
      <Icon
        className={cn("mt-0.5 h-4 w-4 shrink-0", alert.severity === "critical" ? "text-destructive" : "text-muted-foreground")}
        aria-hidden="true"
      />
      <div className="min-w-[16rem] flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{alert.title}</p>
          <SeverityBadge severity={alert.severity} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{alert.detail}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Owner {alert.owner} · Due {shortDate(alert.dueDate)}
        </p>
      </div>
      {onAction && (
        <Button size="sm" variant={alert.severity === "critical" ? "default" : "outline"} onClick={() => onAction(alert)}>
          {alert.actionLabel}
        </Button>
      )}
    </div>
  );
}
