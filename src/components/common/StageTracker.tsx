import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function StageTracker({ stages, current }: { stages: string[]; current: string }) {
  const currentIndex = Math.max(0, stages.indexOf(current));
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Progress stages">
      {stages.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <li
            key={stage}
            aria-current={active ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 rounded border px-2.5 py-1.5 text-xs transition-colors duration-150",
              done && "border-success/30 bg-success/10 text-success",
              active && "border-primary bg-primary/10 font-semibold text-primary",
              !done && !active && "border-border bg-muted/40 text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
                done && "border-success bg-success text-success-foreground",
                active && "border-primary bg-primary text-primary-foreground",
                !done && !active && "border-border",
              )}
              aria-hidden="true"
            >
              {done ? <Check className="h-2.5 w-2.5" /> : i + 1}
            </span>
            {stage}
            {done && <span className="sr-only">(completed)</span>}
            {active && <span className="sr-only">(current stage)</span>}
          </li>
        );
      })}
    </ol>
  );
}
