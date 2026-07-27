import { DataTable } from "@/components/common/DataTable";
import { EmptyState, LoadingRows, MetricCard, PageHeader, SectionCard } from "@/components/common/Primitives";
import { SourceBadge } from "@/components/common/SourceBadge";
import { Button } from "@/components/ui/button";
import { useCopilotContext } from "@/context/CopilotContext";
import { currency, percent, shortDate } from "@/lib/format";
import { AccountService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useNavigate, useParams } from "react-router-dom";

export default function AccountDetail() {
  const { clientId = "", accountId = "" } = useParams();
  const navigate = useNavigate();
  const { data: account, isLoading } = useQuery({ queryKey: ["account", accountId], queryFn: () => AccountService.get(accountId) });

  useCopilotContext(
    account ? `Account ${account.accountNumber}` : "Account detail",
    account
      ? `Account ${account.accountNumber} (${account.name}, ${account.type}). Balance ${account.balance}, cash ${account.cash}, risk profile ${account.riskProfile}, opened ${account.openedDate}. YTD contributions ${account.ytdContributions}, withdrawals ${account.ytdWithdrawals}. Positions: ${account.positions.map((p) => `${p.symbol} ${p.name} ${p.assetClass} value ${p.value} weight ${p.weightPct}% YTD ${p.ytdReturnPct}%`).join("; ")}.`
      : "Account loading.",
  );

  if (isLoading) return <LoadingRows rows={5} />;
  if (!account) return <EmptyState title="Account not found" description="This account is not part of the demonstration data set." />;

  return (
    <div className="space-y-5">
      <PageHeader
        title={account.name}
        description={`Account ${account.accountNumber} · ${account.type} · ${account.riskProfile} risk profile`}
        actions={<Button variant="outline" onClick={() => navigate(`/clients/${clientId}`)}>Back to client</Button>}
      />

      <SourceBadge provenance={account} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Balance" value={currency(account.balance, { compact: true })} detail={`Cash ${currency(account.cash, { compact: true })}`} />
        <MetricCard label="YTD contributions" value={currency(account.ytdContributions, { compact: true })} />
        <MetricCard label="YTD withdrawals" value={currency(account.ytdWithdrawals, { compact: true })} />
        <MetricCard label="Opened" value={shortDate(account.openedDate)} />
      </div>

      <SectionCard title="Value history" description="Rolling account value from the wealth platform.">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={account.history}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => currency(Number(v), { compact: true })} />
              <Tooltip formatter={(v) => currency(Number(v))} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Positions" contentClassName="p-0">
        <DataTable
          caption="Account positions"
          rows={account.positions.map((p) => ({ id: p.symbol, ...p }))}
          columns={[
            { key: "sym", header: "Symbol", render: (p) => <span className="num text-xs">{p.symbol}</span> },
            { key: "name", header: "Holding", render: (p) => <span className="font-medium">{p.name}</span> },
            { key: "class", header: "Asset class", render: (p) => p.assetClass },
            { key: "value", header: "Value", sortValue: (p) => p.value, render: (p) => <span className="num">{currency(p.value)}</span> },
            { key: "weight", header: "Weight", render: (p) => <span className="num">{percent(p.weightPct)}</span> },
            { key: "ytd", header: "YTD return", sortValue: (p) => p.ytdReturnPct, render: (p) => <span className={p.ytdReturnPct >= 0 ? "num text-success" : "num text-destructive"}>{percent(p.ytdReturnPct)}</span> },
          ]}
        />
      </SectionCard>
    </div>
  );
}
