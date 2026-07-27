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
    <header className={cn("mb-5", className)}>
      {breadcrumbs}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>}
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
  const toneClass = {
    default: "",
    positive: "border-l-2 border-l-success",
    warning: "border-l-2 border-l-warning",
    critical: "border-l-2 border-l-destructive",
  }[tone];

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      {...(onClick ? { type: "button" as const, onClick } : {})}
      className={cn(
        "surface-panel w-full p-4 text-left transition-colors duration-150",
        toneClass,
        onClick && "hover:bg-muted/50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />}
      </div>
      <p className="num mt-2 text-2xl font-semibold text-foreground">{value}</p>
      {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
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
    <section className={cn("surface-panel", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className={cn("p-4", contentClassName)}>{children}</div>
    </section>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded border border-dashed border-border px-6 py-10 text-center">
      <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm font-medium text-foreground">{title}</p>
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
