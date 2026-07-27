import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { dateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Provenance } from "@/types";
import { Database } from "lucide-react";

const qualityLabel: Record<Provenance["dataQualityStatus"], string> = {
  verified: "Verified",
  review: "Review recommended",
  stale: "Stale sync",
  conflict: "Conflicting values",
};

const qualityClass: Record<Provenance["dataQualityStatus"], string> = {
  verified: "border-border bg-muted text-muted-foreground",
  review: "border-warning/40 bg-warning/15 text-warning-foreground",
  stale: "border-warning/40 bg-warning/10 text-warning-foreground",
  conflict: "border-destructive/30 bg-destructive/10 text-destructive",
};

export function SourceBadge({ provenance, className }: { provenance: Provenance; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-help items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-medium",
            qualityClass[provenance.dataQualityStatus],
            className,
          )}
        >
          <Database className="h-3 w-3" aria-hidden="true" />
          {provenance.sourceSystem}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        <p className="font-semibold">{provenance.sourceSystem}</p>
        <p>Record {provenance.sourceRecordId}</p>
        <p>Last synchronized {dateTime(provenance.lastSyncedAt)}</p>
        <p>Data quality: {qualityLabel[provenance.dataQualityStatus]}</p>
        <p>{provenance.authoritativeSource ? "Authoritative source" : "Secondary source"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
