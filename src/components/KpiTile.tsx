import { useState, useRef, useEffect } from "react";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { KpiDetail } from "@/data/mockData";

const KpiTile = ({ label, value, change, trend, period, chartData, breakdown, insight, index }: KpiDetail & { index: number }) => {
  const [open, setOpen] = useState(false);
  const isInverse = label === "Cart Abandonment";
  const displayPositive = isInverse ? change < 0 : change > 0;
  const tileRef = useRef<HTMLDivElement>(null);

  const barColors = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const handleClick = (e: MouseEvent) => {
      if (tileRef.current && !tileRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClick);
    return () => { document.removeEventListener("keydown", handleEsc); document.removeEventListener("mousedown", handleClick); };
  }, [open]);

  return (
    <div ref={tileRef} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className={`glass-card-hover p-3 sm:p-5 xl:p-6 flex flex-col gap-1.5 sm:gap-2 animate-slide-up cursor-pointer transition-all duration-300 ${open ? "ring-1 ring-primary/40 shadow-lg shadow-primary/10" : ""}`}
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <span className="text-[10px] sm:text-xs xl:text-sm font-medium tracking-wide uppercase text-muted-foreground">{label}</span>
        <span className="font-mono text-lg sm:text-2xl xl:text-3xl font-bold text-foreground animate-count-up">{value}</span>
        <div className="flex items-center gap-1.5 mt-auto">
          {displayPositive ? (
            <TrendingUp className="w-3 sm:w-3.5 xl:w-4 h-3 sm:h-3.5 xl:h-4 text-success" />
          ) : (
            <TrendingDown className="w-3 sm:w-3.5 xl:w-4 h-3 sm:h-3.5 xl:h-4 text-destructive" />
          )}
          <span className={`text-[10px] sm:text-xs xl:text-sm font-mono font-medium ${displayPositive ? "text-success" : "text-destructive"}`}>
            {change > 0 ? "+" : ""}{change}%
          </span>
          <span className="text-[10px] sm:text-xs xl:text-sm text-muted-foreground hidden sm:inline">{period}</span>
        </div>
      </div>

      {/* Popover card anchored to tile */}
      {open && (
        <div
          className="absolute top-0 left-0 z-50 w-[280px] sm:w-[340px] glass-card border border-primary/20 shadow-2xl shadow-primary/10 p-3 sm:p-4 space-y-3 animate-scale-in origin-top-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{label}</span>
              <span className="font-mono text-lg font-bold text-foreground">{value}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${displayPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"}`}>
                {change > 0 ? "+" : ""}{change}%
              </span>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Trend Chart */}
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1">6-Month Trend</div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`grad-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 10 }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area type="monotone" dataKey="previous" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="4 4" fill="none" name="Previous" />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill={`url(#grad-${label.replace(/\s/g, "")})`} name="Current" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-1.5">Breakdown</div>
            <div className="space-y-1.5">
              {breakdown.map((item, i) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-20 text-[10px] text-foreground truncate">{item.label}</div>
                  <div className="flex-1 h-4 bg-secondary/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.pct}%`, background: barColors[i % barColors.length], transitionDelay: `${i * 80}ms` }}
                    />
                  </div>
                  <div className="w-12 text-right text-[10px] font-mono font-medium text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5">
            <div className="text-[9px] text-primary font-medium mb-0.5">⚡ Einstein Insight</div>
            <p className="text-[10px] text-foreground leading-relaxed">{insight}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiTile;
