import { useWorkspace } from "@/context/WorkspaceContext";
import { SearchService, type SearchHit } from "@/services";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const navigate = useNavigate();
  const { logAudit } = useWorkspace();

  useEffect(() => {
    let active = true;
    if (query.trim().length < 2) {
      setHits([]);
      return;
    }
    SearchService.query(query).then((result) => {
      if (active) setHits(result);
    });
    return () => {
      active = false;
    };
  }, [query]);

  const groups = ["Clients", "Households", "Accounts", "Policies", "Claims", "Cases"] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <DialogTitle className="sr-only">Global search</DialogTitle>
        <DialogDescription className="sr-only">Search clients, households, policies, accounts, claims and cases.</DialogDescription>
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search name, member ID, policy number, claim, or case…"
          />
          <CommandList className="max-h-[24rem]">
            {query.trim().length >= 2 && hits.length === 0 && <CommandEmpty>No matching records.</CommandEmpty>}
            {query.trim().length < 2 && (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                Type at least two characters. Search spans identity, policy administration, wealth, claims and service records.
              </div>
            )}
            {groups.map((group) => {
              const items = hits.filter((h) => h.group === group);
              if (items.length === 0) return null;
              return (
                <CommandGroup key={group} heading={group}>
                  {items.map((hit) => (
                    <CommandItem
                      key={`${hit.group}-${hit.id}`}
                      value={`${hit.group}-${hit.id}`}
                      onSelect={() => {
                        logAudit({ action: "Record opened from search", record: hit.title, detail: `${hit.group} · ${hit.meta}` });
                        onOpenChange(false);
                        setQuery("");
                        navigate(hit.href);
                      }}
                      className="flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {hit.title}
                          {hit.potentialDuplicate && (
                            <span className="ml-2 rounded border border-warning/40 bg-warning/15 px-1.5 py-0.5 text-xs text-warning-foreground">
                              Potential duplicate
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{hit.subtitle}</p>
                      </div>
                      <span className="num shrink-0 text-xs text-muted-foreground">{hit.meta}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
