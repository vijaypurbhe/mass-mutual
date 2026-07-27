import { cn } from "@/lib/utils";
import type { Severity, SlaHealth } from "@/types";
import { AlertTriangle, CheckCircle2, CircleDot, Clock, XCircle } from "lucide-react";

type Tone = "neutral" | "positive" | "warning" | "critical" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  positive: "bg-success/10 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/40",
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  info: "bg-primary/10 text-primary border-primary/30",
};

export function StatusBadge({ label, tone = "neutral", className }: { label: string; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-0.5 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}

const statusTone: Record<string, Tone> = {
  "In Force": "positive",
  Active: "positive",
  "Active Client": "positive",
  Approved: "positive",
  Resolved: "positive",
  Complete: "positive",
  Received: "positive",
  Operational: "positive",
  Met: "positive",
  "Paid Up": "positive",
  "In Progress": "info",
  "Under Review": "info",
  New: "info",
  Open: "info",
  Pending: "warning",
  "Grace Period": "warning",
  "Pending Requirements": "warning",
  "Awaiting Client": "warning",
  Outstanding: "warning",
  Waiting: "warning",
  Degraded: "warning",
  Draft: "warning",
  "Review Due": "warning",
  Escalated: "critical",
  Denied: "critical",
  Lapsed: "critical",
  Blocked: "critical",
  Conflict: "critical",
};

export function RecordStatus({ status }: { status: string }) {
  return <StatusBadge label={status} tone={statusTone[status] ?? "neutral"} />;
}

const severityTone: Record<Severity, Tone> = { critical: "critical", high: "warning", medium: "info", low: "neutral" };
const severityLabel: Record<Severity, string> = { critical: "Critical", high: "High", medium: "Medium", low: "Low" };

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <StatusBadge label={severityLabel[severity]} tone={severityTone[severity]} />;
}

const slaMeta: Record<SlaHealth, { label: string; tone: Tone; Icon: typeof Clock }> = {
  on_track: { label: "On track", tone: "positive", Icon: CheckCircle2 },
  at_risk: { label: "At risk", tone: "warning", Icon: AlertTriangle },
  breached: { label: "Breached", tone: "critical", Icon: XCircle },
  met: { label: "Met", tone: "neutral", Icon: CircleDot },
};

export function SlaIndicator({ health, className }: { health: SlaHealth; className?: string }) {
  const { label, tone, Icon } = slaMeta[health];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium", toneClass[tone], className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>SLA {label}</span>
    </span>
  );
}
