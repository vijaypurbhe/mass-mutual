import { DataTable } from "@/components/common/DataTable";
import { PageHeader, SectionCard } from "@/components/common/Primitives";
import { SourceBadge } from "@/components/common/SourceBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { useCopilotContext } from "@/context/CopilotContext";
import { shortDate } from "@/lib/format";
import { DocumentService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function DocumentsPage() {
  const [query, setQuery] = useState("");
  const { data: documents = [] } = useQuery({ queryKey: ["documents"], queryFn: DocumentService.all });
  const filtered = documents.filter((d) => `${d.name} ${d.type} ${d.repository} ${d.relatedRecord}`.toLowerCase().includes(query.toLowerCase()));

  useCopilotContext(
    "Document repository",
    `Documents in scope: ${documents.slice(0, 25).map((d) => `${d.name} (${d.type}, ${d.repository}, ${d.classification}, ${d.date})`).join("; ")}.`,
  );

  return (
    <div className="space-y-5">
      <PageHeader title="Documents" description="A unified view across FileNet, Salesforce Files, the wealth platform and the planning vault." />
      <SectionCard title="Filter" contentClassName="p-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name, type, repository or record" aria-label="Filter documents" />
      </SectionCard>
      <SectionCard title={`${filtered.length} documents`} contentClassName="p-0">
        <DataTable
          caption="Documents"
          rows={filtered}
          columns={[
            { key: "name", header: "Document", sortValue: (d) => d.name, render: (d) => <span className="font-medium">{d.name}</span> },
            { key: "type", header: "Type", render: (d) => d.type },
            { key: "repo", header: "Repository", render: (d) => d.repository },
            { key: "record", header: "Related record", render: (d) => d.relatedRecord },
            { key: "class", header: "Classification", render: (d) => <StatusBadge label={d.classification} tone={d.classification === "Restricted" ? "critical" : d.classification === "Confidential" ? "warning" : "neutral"} /> },
            { key: "date", header: "Date", sortValue: (d) => d.date, render: (d) => shortDate(d.date) },
            { key: "retention", header: "Retention", render: (d) => d.retention },
            { key: "src", header: "Source", render: (d) => <SourceBadge provenance={d} /> },
          ]}
        />
      </SectionCard>
    </div>
  );
}
