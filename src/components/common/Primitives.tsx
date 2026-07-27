import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Inbox, ShieldOff } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 animate-fade-in", className)}>
      {breadcrumbs}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  trend,
  icon: Icon,
  tone = "default",
  onClick,
}: {
  label: string;
  value: string;
  detail?: string;
  trend?: string;
  icon?: LucideIcon;
  tone?: "default" | "positive" | "warning" | "critical";
  onClick?: () => void;
}) {
  const accent = {
    default: "from-primary/70 to-primary-glow/60",
    positive: "from-success/80 to-success/30",
    warning: "from-warning/80 to-warning/30",
    critical: "from-destructive/80 to-destructive/30",
  }[tone];

  const iconTone = {
    default: "text-primary",
    positive: "text-success",
    warning: "text-warning",
    critical: "text-destructive",
  }[tone];

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={cn(
        "surface-panel glass-hover relative w-full overflow-hidden p-4 text-left",
        onClick && "cursor-pointer",
      )}
    >
      <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", accent)} />
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
        {Icon && (
          <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.04]", iconTone)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <p className="num mt-2.5 text-[1.7rem] font-semibold leading-none tracking-tight text-foreground">{value}</p>
      {detail && <p className="mt-2 text-xs text-muted-foreground">{detail}</p>}
      {trend && <p className="mt-1 text-xs font-medium text-foreground">{trend}</p>}
    </Wrapper>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={cn("surface-panel overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className={cn("p-4", contentClassName)}>{children}</div>
    </section>
  );
}


export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-foreground/[0.015] px-6 py-12 text-center">
      <span className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}


export function ErrorState({ title = "Something went wrong", description }: { title?: string; description: string }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
      <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function UnauthorizedState({ requirement }: { requirement: string }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded border border-border bg-muted/40 px-6 py-10 text-center">
      <ShieldOff className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-semibold text-foreground">Not available for your role</p>
      <p className="max-w-md text-sm text-muted-foreground">{requirement}</p>
    </div>
  );
}

export function LoadingRows({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading content</span>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
