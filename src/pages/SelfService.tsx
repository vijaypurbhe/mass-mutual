import { StageTracker } from "@/components/common/StageTracker";
import { MetricCard, SectionCard } from "@/components/common/Primitives";
import { RecordStatus, StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/context/WorkspaceContext";
import { currency, shortDate } from "@/lib/format";
import { AccountService, CaseService, ClaimService, ClientService, DocumentService, PolicyService } from "@/services";
import type { ClaimStage } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CLIENT_ID = "cl-jordan-lee";
const STAGES: ClaimStage[] = [
  "Notice received",
  "Identity and coverage verified",
  "Requirements requested",
  "Documentation review",
  "Assessment",
  "Decision",
  "Payment or closure",
];

export default function SelfService() {
  const { signOut } = useWorkspace();
  const navigate = useNavigate();
  const { data: client } = useQuery({ queryKey: ["client", CLIENT_ID], queryFn: () => ClientService.get(CLIENT_ID) });
  const { data: policies = [] } = useQuery({ queryKey: ["policies", CLIENT_ID], queryFn: () => PolicyService.byClient(CLIENT_ID) });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts", CLIENT_ID], queryFn: () => AccountService.byClient(CLIENT_ID) });
  const { data: claims = [] } = useQuery({ queryKey: ["claims", CLIENT_ID], queryFn: () => ClaimService.byClient(CLIENT_ID) });
  const { data: cases = [] } = useQuery({ queryKey: ["cases", CLIENT_ID], queryFn: () => CaseService.byClient(CLIENT_ID) });
  const { data: documents = [] } = useQuery({ queryKey: ["documents", CLIENT_ID], queryFn: () => DocumentService.byClient(CLIENT_ID) });

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card px-6 py-3">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">UF</span>
          <div>
            <p className="text-sm font-semibold text-foreground">My accounts and coverage</p>
            <p className="text-xs text-muted-foreground">Customer self-service portal</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => {
              signOut();
              navigate("/login");
            }}
          >
            <LogOut className="mr-1 h-4 w-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-6 py-6">
        <h1 className="text-xl font-semibold text-foreground">
          Welcome back{client ? `, ${client.preferredName ?? client.firstName}` : ""}
        </h1>

        <div className="grid gap-3 sm:grid-cols-3">
          <MetricCard label="Total coverage" value={currency(policies.reduce((s, p) => s + (p.faceAmount ?? 0), 0), { compact: true })} detail={`${policies.length} policies`} />
          <MetricCard label="Total balance" value={currency(accounts.reduce((s, a) => s + a.balance, 0), { compact: true })} detail={`${accounts.length} accounts`} />
          <MetricCard label="Open requests" value={String(cases.filter((c) => c.status !== "Closed" && c.status !== "Resolved").length)} detail="We will keep you updated" />
        </div>

        {claims.length > 0 && (
          <SectionCard title="Your claim progress" description="You see the same status your service team sees.">
            {claims.map((c) => (
              <div key={c.id} className="mb-4 last:mb-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{c.claimType} claim</span>
                  <RecordStatus status={c.status} />
                  <span className="text-xs text-muted-foreground">Target completion {shortDate(c.targetCompletionDate)}</span>
                </div>
                <StageTracker stages={STAGES} current={c.stage} />
                {c.requirements.some((r) => r.status === "Outstanding") && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    We still need: {c.requirements.filter((r) => r.status === "Outstanding").map((r) => r.name).join(", ")}.
                  </p>
                )}
              </div>
            ))}
          </SectionCard>
        )}

        <SectionCard title="My policies">
          <ul className="space-y-2">
            {policies.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-border p-3 text-sm">
                <span>
                  <span className="block font-medium">{p.productName}</span>
                  <span className="block text-xs text-muted-foreground">Policy ending {p.policyNumber.slice(-4)}</span>
                </span>
                <span className="num text-muted-foreground">{currency(p.premium)} / {p.premiumMode.toLowerCase()}</span>
                <RecordStatus status={p.status} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="My accounts">
          <ul className="space-y-2">
            {accounts.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-border p-3 text-sm">
                <span>
                  <span className="block font-medium">{a.name}</span>
                  <span className="block text-xs text-muted-foreground">Account ending {a.accountNumber.slice(-4)}</span>
                </span>
                <span className="num font-medium">{currency(a.balance)}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="My documents">
          <ul className="space-y-2">
            {documents.slice(0, 6).map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-border p-3 text-sm">
                <span>{d.name}</span>
                <span className="flex items-center gap-2">
                  <StatusBadge label={d.type} tone="neutral" />
                  <span className="text-xs text-muted-foreground">{shortDate(d.date)}</span>
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </main>
    </div>
  );
}
