import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { revenueChartData } from "@/data/mockData";

const formatValue = (value: number) => `$${(value / 1000000).toFixed(0)}M`;

const RevenueChart = () => (
  <div className="glass-card p-4 sm:p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-foreground">Online Revenue vs Target</h3>
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-primary rounded-full" /> Actual Revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-0.5 bg-muted-foreground/40 rounded-full" /> Target
        </span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={revenueChartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatValue} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
          formatter={(value: number) => [formatValue(value)]}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revenueGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueChart;
