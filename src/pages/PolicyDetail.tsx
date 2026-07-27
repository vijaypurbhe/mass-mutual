import { DataTable } from "@/components/common/DataTable";
import { EmptyState, LoadingRows, MetricCard, PageHeader, SectionCard } from "@/components/common/Primitives";
import { SourceBadge } from "@/components/common/SourceBadge";
import { RecordStatus, StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { currency, shortDate } from "@/lib/format";
import { ClaimService, PolicyService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export default function PolicyDetail() {
  const { clientId = "", policyId = "" } = useParams();
  const navigate = useNavigate();
  const { askCopilot } = useWorkspace();
  const { data: policy, isLoading } = useQuery({ queryKey: ["policy", policyId], queryFn: () => PolicyService.get(policyId) });
  const { data: claims = [] } = useQuery({ queryKey: ["policy-claims", policyId], queryFn: () => ClaimService.byPolicy(policyId) });

  useCopilotContext(
    policy ? `Policy ${policy.policyNumber}` : "Policy detail",
    policy
      ? `Policy ${policy.policyNumber} (${policy.productName}, ${policy.productFamily}). Status ${policy.status}. Owner ${policy.ownerName}, insured ${policy.insuredName}. Premium ${policy.premium} ${policy.premiumMode}. Face amount ${policy.faceAmount ?? "n/a"}, account value ${policy.accountValue ?? "n/a"}. Beneficiaries: ${policy.beneficiaries.map((b) => `${b.name} (${b.type}, ${b.allocationPct}%)`).join(", ")}. Beneficiary status ${policy.beneficiaryStatus}. Riders: ${policy.riders.map((r) => `${r.name} ${r.status}`).join(", ")}. Requirements: ${policy.requirements.map((r) => `${r.name} ${r.status}`).join(", ")}. Next ${policy.nextKeyDateLabel} on ${policy.nextKeyDate}.`
      : "Policy loading.",
  );

  if (isLoading) return <LoadingRows rows={5} />;
  if (!policy) return <EmptyState title="Policy not found" description="This policy is not part of the demonstration data set." />;

  return (
    <div className="space-y-5">
      <PageHeader
        title={policy.productName}
        description={`Policy ${policy.policyNumber} · Owner ${policy.ownerName} · Insured ${policy.insuredName}`}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(`/clients/${clientId}`)}>Back to client</Button>
            <Button variant="outline" onClick={() => askCopilot({ prompt: "Explain this policy's current status and any outstanding requirements in plain language.", contextLabel: `Policy ${policy.policyNumber}` })}>
              Explain this policy
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <RecordStatus status={policy.status} />
        <SourceBadge provenance={policy} />
        <StatusBadge label={`Beneficiaries: ${policy.beneficiaryStatus}`} tone={policy.beneficiaryStatus === "Current" ? "positive" : "warning"} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Face amount" value={policy.faceAmount ? currency(policy.faceAmount, { compact: true }) : "—"} />
        <MetricCard label="Account value" value={policy.accountValue ? currency(policy.accountValue, { compact: true }) : "—"} />
        <MetricCard label="Premium" value={currency(policy.premium)} detail={policy.premiumMode} />
        <MetricCard label={policy.nextKeyDateLabel} value={shortDate(policy.nextKeyDate)} detail={`Effective ${shortDate(policy.effectiveDate)}`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Beneficiaries" contentClassName="p-0">
          <DataTable
            caption="Beneficiaries"
            rows={policy.beneficiaries}
            columns={[
              { key: "name", header: "Name", render: (b) => <span className="font-medium">{b.name}</span> },
              { key: "rel", header: "Relationship", render: (b) => b.relationship },
              { key: "type", header: "Type", render: (b) => b.type },
              { key: "alloc", header: "Allocation", render: (b) => <span className="num">{b.allocationPct}%</span> },
              { key: "upd", header: "Updated", render: (b) => shortDate(b.updatedAt) },
            ]}
          />
        </SectionCard>
        <SectionCard title="Requirements and riders">
          <ul className="space-y-2">
            {policy.requirements.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-2 rounded border border-border p-2 text-sm">
                <span>{r.name}{r.due ? ` · due ${shortDate(r.due)}` : ""}</span>
                <RecordStatus status={r.status} />
              </li>
            ))}
            {policy.riders.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-2 rounded border border-border p-2 text-sm">
                <span>{r.name}{r.amount ? ` · ${currency(r.amount, { compact: true })}` : ""}</span>
                <StatusBadge label={r.status} tone="neutral" />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Billing history" contentClassName="p-0">
        <DataTable
          caption="Billing history"
          rows={policy.billing.map((b, i) => ({ id: `${b.date}-${i}`, ...b }))}
          columns={[
            { key: "date", header: "Date", sortValue: (b) => b.date, render: (b) => shortDate(b.date) },
            { key: "amt", header: "Amount", render: (b) => <span className="num">{currency(b.amount)}</span> },
            { key: "method", header: "Method", render: (b) => b.method },
            { key: "status", header: "Status", render: (b) => <RecordStatus status={b.status} /> },
          ]}
        />
      </SectionCard>

      {claims.length > 0 && (
        <SectionCard title="Claims on this policy" contentClassName="p-0">
          <DataTable
            caption="Claims on this policy"
            rows={claims}
            onRowClick={(c) => navigate(`/claims/${c.id}`)}
            columns={[
              { key: "num", header: "Claim", render: (c) => <span className="num text-xs">{c.claimNumber}</span> },
              { key: "type", header: "Type", render: (c) => c.claimType },
              { key: "status", header: "Status", render: (c) => <RecordStatus status={c.status} /> },
              { key: "stage", header: "Stage", render: (c) => c.stage },
            ]}
          />
        </SectionCard>
      )}
    </div>
  );
}
