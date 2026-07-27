import { EmptyState, LoadingRows, PageHeader, SectionCard } from "@/components/common/Primitives";
import { SourceBadge } from "@/components/common/SourceBadge";
import { RecordStatus, SeverityBadge, SlaIndicator, StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmDialog } from "@/components/common/GuidedFlow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { dateTime, shortDate } from "@/lib/format";
import { CaseService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function CaseWorkspace() {
  const { caseId = "" } = useParams();
  const { askCopilot, logAudit } = useWorkspace();
  const [note, setNote] = useState("");
  const [confirmResolve, setConfirmResolve] = useState(false);
  const { data: record, isLoading } = useQuery({ queryKey: ["case", caseId], queryFn: () => CaseService.get(caseId) });

  useCopilotContext(
    record ? `Case ${record.caseNumber}` : "Case workspace",
    record
      ? `Case ${record.caseNumber}: ${record.subject}. Type ${record.type}, status ${record.status}, priority ${record.priority}, channel ${record.channel}, queue ${record.queue}, owner ${record.ownerName}. Opened ${record.openedDate}, due ${record.dueDate}, SLA ${record.slaHealth}. Description: ${record.description}. Tasks: ${record.tasks.map((t) => `${t.label} (${t.done ? "done" : "open"}, ${t.owner})`).join("; ")}. Required documents: ${record.requiredDocuments.map((d) => `${d.name} ${d.received ? "received" : "outstanding"}`).join("; ")}. Resolution criteria: ${record.resolutionCriteria.map((c) => `${c.label} ${c.met ? "met" : "not met"}`).join("; ")}. Recent activity: ${record.activities.slice(0, 6).map((a) => `${a.at} ${a.actor}: ${a.detail}`).join("; ")}.`
      : "Case loading.",
  );

  if (isLoading) return <LoadingRows rows={5} />;
  if (!record) return <EmptyState title="Case not found" description="This case is not part of the demonstration data set." />;

  const criteriaMet = record.resolutionCriteria.every((c) => c.met);

  return (
    <div className="space-y-5">
      <PageHeader
        title={record.subject}
        description={`Case ${record.caseNumber} · ${record.type} · ${record.queue} · Owner ${record.ownerName}`}
        actions={
          <>
            <Button variant="outline" onClick={() => askCopilot({ prompt: "Summarize this case and recommend the next best action.", contextLabel: `Case ${record.caseNumber}` })}>
              Copilot next best action
            </Button>
            <Button disabled={!criteriaMet} onClick={() => setConfirmResolve(true)}>
              Resolve case
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <RecordStatus status={record.status} />
        <SeverityBadge severity={record.priority} />
        <SlaIndicator health={record.slaHealth} />
        <SourceBadge provenance={record} />
        <span className="text-xs text-muted-foreground">Opened {shortDate(record.openedDate)} · Due {shortDate(record.dueDate)}</span>
        {record.clientId && (
          <Link className="text-xs underline" to={`/clients/${record.clientId}`}>
            Open client 360
          </Link>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title="Case detail">
          <p className="text-sm text-muted-foreground">{record.description}</p>
          <h3 className="mt-4 text-sm font-semibold">Resolution criteria</h3>
          <ul className="mt-2 space-y-1.5">
            {record.resolutionCriteria.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-2 rounded border border-border p-2 text-sm">
                <span>{c.label}</span>
                <StatusBadge label={c.met ? "Met" : "Outstanding"} tone={c.met ? "positive" : "warning"} />
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-sm font-semibold">Required documents</h3>
          <ul className="mt-2 space-y-1.5">
            {record.requiredDocuments.map((d) => (
              <li key={d.name} className="flex items-center justify-between gap-2 rounded border border-border p-2 text-sm">
                <span>{d.name}</span>
                <StatusBadge label={d.received ? "Received" : "Outstanding"} tone={d.received ? "positive" : "warning"} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="space-y-4">
          <SectionCard title="Tasks">
            <ul className="space-y-1.5">
              {record.tasks.map((t) => (
                <li key={t.id} className="rounded border border-border p-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span>{t.label}</span>
                    <StatusBadge label={t.done ? "Complete" : "Open"} tone={t.done ? "positive" : "info"} />
                  </div>
                  <p className="text-xs text-muted-foreground">{t.owner}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Add case note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Record what was done and agreed…" aria-label="Case note" />
            <Button
              className="mt-2 w-full"
              size="sm"
              variant="outline"
              disabled={!note.trim()}
              onClick={() => {
                logAudit({ action: "Case note added", record: record.caseNumber, detail: note.slice(0, 160) });
                toast.success("Note added to the case activity trail.");
                setNote("");
              }}
            >
              Add note
            </Button>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Activity trail" description="Every action on this case is captured for audit.">
        <ol className="space-y-2">
          {record.activities.map((a, i) => (
            <li key={i} className="rounded border border-border p-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{a.type}</span>
                <span className="text-xs text-muted-foreground">{a.actor}</span>
                <span className="ml-auto text-xs text-muted-foreground">{dateTime(a.at)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
            </li>
          ))}
        </ol>
      </SectionCard>

      <ConfirmDialog
        open={confirmResolve}
        onOpenChange={setConfirmResolve}
        title="Resolve this case?"
        description="Resolving records an auditable outcome and notifies the client through their preferred channel. This prototype does not update a production system."
        confirmLabel="Confirm resolution"
        onConfirm={() => {
          logAudit({ action: "Case resolution submitted", record: record.caseNumber, detail: "All resolution criteria met." });
          toast.success(`Resolution submitted for ${record.caseNumber}.`);
        }}
      />
    </div>
  );
}
