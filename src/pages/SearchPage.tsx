import { DataTable } from "@/components/common/DataTable";
import { PageHeader, SectionCard } from "@/components/common/Primitives";
import { RecordStatus } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { useCopilotContext } from "@/context/CopilotContext";
import { currency } from "@/lib/format";
import { ClientService, PolicyService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [params] = useSearchParams();
  const scope = params.get("scope") === "policies" ? "policies" : "clients";
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: clients = [] } = useQuery({ queryKey: ["clients"], queryFn: ClientService.list });
  const { data: policies = [] } = useQuery({ queryKey: ["policies"], queryFn: PolicyService.all });

  useCopilotContext(
    scope === "policies" ? "Policy and portfolio list" : "Client and household list",
    `The employee is browsing ${scope}. ${clients.length} clients and ${policies.length} policies are in scope.`,
  );

  const q = query.toLowerCase();
  const filteredClients = clients.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.memberId} ${c.email} ${c.city} ${c.advisorName}`.toLowerCase().includes(q),
  );
  const filteredPolicies = policies.filter((p) => `${p.policyNumber} ${p.productName} ${p.ownerName}`.toLowerCase().includes(q));

  return (
    <div className="space-y-5">
      <PageHeader
        title={scope === "policies" ? "Policies and portfolio" : "Clients and households"}
        description="Search spans identity, policy administration, wealth and service systems."
      />
      <SectionCard title="Filter" contentClassName="p-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name, number, city or owner" aria-label="Filter records" />
      </SectionCard>

      {scope === "policies" ? (
        <SectionCard title={`Policies (${filteredPolicies.length})`} contentClassName="p-0">
          <DataTable
            caption="Policies"
            rows={filteredPolicies}
            onRowClick={(p) => navigate(`/clients/${p.clientId}/policies/${p.id}`)}
            columns={[
              { key: "num", header: "Policy", render: (p) => <span className="num text-xs">{p.policyNumber}</span> },
              { key: "product", header: "Product", sortValue: (p) => p.productName, render: (p) => <span className="font-medium">{p.productName}</span> },
              { key: "owner", header: "Owner", render: (p) => p.ownerName },
              { key: "status", header: "Status", render: (p) => <RecordStatus status={p.status} /> },
              { key: "value", header: "Face / value", sortValue: (p) => p.faceAmount ?? p.accountValue ?? 0, render: (p) => <span className="num">{currency(p.faceAmount ?? p.accountValue ?? 0, { compact: true })}</span> },
              { key: "next", header: "Next key date", render: (p) => `${p.nextKeyDateLabel} · ${p.nextKeyDate}` },
            ]}
          />
        </SectionCard>
      ) : (
        <SectionCard title={`Clients (${filteredClients.length})`} contentClassName="p-0">
          <DataTable
            caption="Clients"
            rows={filteredClients}
            onRowClick={(c) => navigate(`/clients/${c.id}`)}
            columns={[
              { key: "name", header: "Client", sortValue: (c) => c.lastName, render: (c) => <span className="font-medium">{c.firstName} {c.lastName}</span> },
              { key: "tier", header: "Tier", render: (c) => c.relationshipTier },
              { key: "status", header: "Status", render: (c) => <RecordStatus status={c.status} /> },
              { key: "location", header: "Location", render: (c) => `${c.city}, ${c.state}` },
              { key: "advisor", header: "Advisor", render: (c) => c.advisorName },
              { key: "since", header: "Client since", sortValue: (c) => c.clientSince, render: (c) => c.clientSince },
            ]}
          />
        </SectionCard>
      )}
    </div>
  );
}
