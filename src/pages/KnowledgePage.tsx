import { PageHeader, SectionCard } from "@/components/common/Primitives";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCopilotContext } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { shortDate } from "@/lib/format";
import { KnowledgeService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function KnowledgePage() {
  const [query, setQuery] = useState("");
  const { askCopilot } = useWorkspace();
  const { data: articles = [] } = useQuery({ queryKey: ["knowledge"], queryFn: KnowledgeService.all });

  const filtered = articles.filter((a) =>
    `${a.title} ${a.summary} ${a.body} ${a.product} ${a.process}`.toLowerCase().includes(query.toLowerCase()),
  );

  useCopilotContext(
    "Knowledge workspace",
    `Approved knowledge articles available: ${articles.map((a) => `${a.title} (${a.product}, ${a.process}, ${a.approvalStatus}, effective ${a.effectiveDate})`).join("; ")}.`,
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Knowledge and guidance"
        description="Approved procedural knowledge, filtered by product, process and jurisdiction."
        actions={
          <Button variant="outline" onClick={() => askCopilot({ prompt: `Answer using approved knowledge only: ${query || "what guidance exists for beneficiary changes?"}`, contextLabel: "Knowledge workspace" })}>
            Ask Copilot with citations
          </Button>
        }
      />

      <SectionCard title="Search" contentClassName="p-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search approved knowledge" aria-label="Search knowledge" />
      </SectionCard>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((a) => (
          <article key={a.id} className="surface-panel p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-foreground">{a.title}</h2>
              <StatusBadge label={a.approvalStatus} tone={a.approvalStatus === "Approved" ? "positive" : "warning"} />
              {a.featured && <StatusBadge label="Featured" tone="info" />}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
            <p className="mt-2 whitespace-pre-line text-sm text-foreground">{a.body}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {a.product} · {a.process} · {a.jurisdiction} · {a.channel} · owner {a.owner} · effective {shortDate(a.effectiveDate)}
            </p>
          </article>
        ))}
        {filtered.length === 0 && <p className="text-sm text-muted-foreground">No approved articles match that search.</p>}
      </div>
    </div>
  );
}
