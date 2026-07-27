import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/context/WorkspaceContext";
import { maskId } from "@/lib/format";
import { can } from "@/lib/permissions";
import { Eye, Lock } from "lucide-react";
import { toast } from "sonner";

/**
 * Sensitive identifiers are masked by default. Revealing is a deliberate,
 * permission-aware action and is written to the session audit log.
 */
export function MaskedValue({ value, fieldKey, label }: { value: string; fieldKey: string; label: string }) {
  const { isRevealed, reveal, personaId, logAudit } = useWorkspace();
  const allowed = can(personaId, "reveal_sensitive");
  const shown = isRevealed(fieldKey);

  if (shown) {
    return <span className="num font-medium">{value}</span>;
  }

  return (
    <span className="inline-flex items-center gap-1">
      <span className="num font-medium tracking-tight">{maskId(value)}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 px-1.5 text-xs"
        onClick={() => {
          if (!allowed) {
            toast.error("Your role is not authorized to reveal this identifier.");
            return;
          }
          reveal(fieldKey);
          logAudit({ action: "Sensitive field revealed", record: label, detail: `${label} unmasked in the workspace.` });
        }}
        aria-label={allowed ? `Reveal ${label}` : `${label} is restricted`}
      >
        {allowed ? <Eye className="h-3 w-3" aria-hidden="true" /> : <Lock className="h-3 w-3" aria-hidden="true" />}
        <span className="ml-1">{allowed ? "Reveal" : "Restricted"}</span>
      </Button>
    </span>
  );
}
