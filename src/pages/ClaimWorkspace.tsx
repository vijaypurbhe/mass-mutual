import { ConfirmDialog } from "@/components/common/GuidedFlow";
import { EmptyState, LoadingRows, MetricCard, PageHeader, SectionCard } from "@/components/common/Primitives";
import { SourceBadge } from "@/components/common/SourceBadge";
import { StageTracker } from "@/components/common/StageTracker";
import { RecordStatus, StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { currency, dateTime, shortDate } from "@/lib/format";
import { ClaimService } from "@/services";
import type { ClaimStage } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

const STAGES: ClaimStage[] = [
  "Notice received",
  "Identity and coverage verified",
  "Requirements requested",
  "Documentation review",
  "Assessment",
  "Decision",
  "Payment or closure",
];

export default function ClaimWorkspace() {
  const { claimId = "" } = useParams();
  const { askCopilot, logAudit } = useWorkspace();
  const [confirmRequest, setConfirmRequest] = useState(false);
  const { data: claim, isLoading } = useQuery({ queryKey: ["claim", claimId], queryFn: () => ClaimService.get(claimId) });

  useCopilotContext(
    claim ? `Claim ${claim.claimNumber}` : "Claim workspace",
    claim
      ? `Claim ${claim.claimNumber} (${claim.claimType}) on policy ${claim.policyId}. Status ${claim.status}, stage ${claim.stage}, examiner ${claim.examiner}. Event ${claim.dateOfEvent}, reported ${claim.reportedDate}, target completion ${claim.targetCompletionDate}. Coverage verified: ${claim.coverageVerified}. Claimant ${claim.claimantName} (${claim.claimantRelationship}). Amount requested ${claim.amountRequested ?? "n/a"}, approved ${claim.amountApproved ?? "n/a"}. Requirements: ${claim.requirements.map((r) => `${r.name} ${r.status}`).join("; ")}. Communications: ${claim.communications.map((c) => `${c.at} ${c.channel}: ${c.summary}`).join("; ")}.`
      : "Claim loading.",
  );

  if (isLoading) return <LoadingRows rows={5} />;
  if (!claim) return <EmptyState title="Claim not found" description="This claim is not part of the demonstration data set." />;

  const outstanding = claim.requirements.filter((r) => r.status === "Outstanding");

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${claim.claimType} claim`}
        description={`Claim ${claim.claimNumber} · Claimant ${claim.claimantName} (${claim.claimantRelationship}) · Examiner ${claim.examiner}`}
        actions={
          <>
            <Button variant="outline" onClick={() => askCopilot({ prompt: "Draft a plain-language status update for the claimant, listing outstanding requirements.", contextLabel: `Claim ${claim.claimNumber}` })}>
              Draft status update
            </Button>
            <Button disabled={outstanding.length === 0} onClick={() => setConfirmRequest(true)}>
              Request outstanding items
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <RecordStatus status={claim.status} />
        <StatusBadge label={claim.coverageVerified ? "Coverage verified" : "Coverage not verified"} tone={claim.coverageVerified ? "positive" : "warning"} />
        <SourceBadge provenance={claim} />
        <Link className="text-xs underline" to={`/clients/${claim.clientId}`}>Open client 360</Link>
      </div>

      <SectionCard title="Claim progress" description="Stages are shared with the client portal so both sides see the same status.">
        <StageTracker stages={STAGES} current={claim.stage} />
      </SectionCard>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Date of event" value={shortDate(claim.dateOfEvent)} detail={`Reported ${shortDate(claim.reportedDate)}`} />
        <MetricCard label="Target completion" value={shortDate(claim.targetCompletionDate)} />
        <MetricCard label="Amount requested" value={claim.amountRequested ? currency(claim.amountRequested, { compact: true }) : "—"} />
        <MetricCard label="Outstanding requirements" value={String(outstanding.length)} tone={outstanding.length ? "warning" : "positive"} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Requirements">
          <ul className="space-y-1.5">
            {claim.requirements.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-2 rounded border border-border p-2 text-sm">
                <span>{r.name}{r.requestedOn ? ` · requested ${shortDate(r.requestedOn)}` : ""}</span>
                <RecordStatus status={r.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Parties">
          <ul className="space-y-1.5">
            {claim.parties.map((p) => (
              <li key={p.name} className="rounded border border-border p-2 text-sm">
                <span className="font-medium">{p.name}</span>
                <p className="text-xs text-muted-foreground">{p.role} · {p.relationship}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Communications and audit trail">
        <ol className="space-y-2">
          {claim.communications.map((c, i) => (
            <li key={`c-${i}`} className="rounded border border-border p-2 text-sm">
              <div className="flex items-center gap-2">
                <StatusBadge label={c.channel} tone="info" />
                <span className="ml-auto text-xs text-muted-foreground">{dateTime(c.at)}</span>
              </div>
              <p className="mt-1 text-muted-foreground">{c.summary}</p>
            </li>
          ))}
          {claim.auditTrail.map((a, i) => (
            <li key={`a-${i}`} className="rounded border border-dashed border-border p-2 text-xs text-muted-foreground">
              {dateTime(a.at)} · {a.actor} · {a.action}
            </li>
          ))}
        </ol>
      </SectionCard>

      <ConfirmDialog
        open={confirmRequest}
        onOpenChange={setConfirmRequest}
        title="Request outstanding requirements?"
        description={`A requirement request will be sent for: ${outstanding.map((r) => r.name).join(", ")}. The claimant is notified through their preferred channel and the claim record is updated.`}
        confirmLabel="Send request"
        onConfirm={() => {
          logAudit({ action: "Requirement request sent", record: claim.claimNumber, detail: outstanding.map((r) => r.name).join(", ") });
          toast.success("Requirement request queued and logged.");
        }}
      />
    </div>
  );
}
