import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { EmptyState } from "./Primitives";

export interface Column<T> {
  key: string;
  header: string;
  sortValue?: (row: T) => string | number;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  caption,
  onRowClick,
  emptyTitle = "Nothing to show",
  emptyDescription = "No records match the current filters.",
  selectable,
  selectedIds,
  onToggleSelect,
}: {
  rows: T[];
  columns: Column<T>[];
  caption: string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  selectable?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [asc, setAsc] = useState(true);

  const sorted = useMemo(() => {
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av === bv) return 0;
      return (av > bv ? 1 : -1) * (asc ? 1 : -1);
    });
  }, [rows, columns, sortKey, asc]);

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            {selectable && <TableHead className="w-10"><span className="sr-only">Select</span></TableHead>}
            {columns.map((col) => (
              <TableHead key={col.key} className={cn("whitespace-nowrap text-xs", col.headerClassName)}>
                {col.sortValue ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                    onClick={() => {
                      if (sortKey === col.key) setAsc((v) => !v);
                      else {
                        setSortKey(col.key);
                        setAsc(true);
                      }
                    }}
                    aria-label={`Sort by ${col.header}`}
                  >
                    {col.header}
                    <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow
              key={row.id}
              className={cn("data-grid-row", onRowClick && "cursor-pointer")}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(row);
                      }
                    }
                  : undefined
              }
            >
              {selectable && (
                <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
                    checked={selectedIds?.includes(row.id) ?? false}
                    onChange={() => onToggleSelect?.(row.id)}
                    aria-label={`Select record ${row.id}`}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell key={col.key} className={cn("py-2 text-sm", col.className)}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
