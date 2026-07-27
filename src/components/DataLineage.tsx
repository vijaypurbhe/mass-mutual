const nodes = [
  { id: "sfcc", label: "SFCC Storefront", x: 10, y: 30, color: "hsl(var(--primary))" },
  { id: "ga4", label: "Google Analytics 4", x: 160, y: 30, color: "hsl(var(--warning))" },
  { id: "mktgcloud", label: "Marketing Cloud", x: 310, y: 30, color: "hsl(var(--chart-4))" },
  { id: "datacloud", label: "Data Cloud", x: 160, y: 120, color: "hsl(var(--primary))" },
  { id: "einstein", label: "Einstein AI", x: 10, y: 120, color: "hsl(var(--success))" },
  { id: "crm", label: "Salesforce CRM", x: 310, y: 120, color: "hsl(var(--warning))" },
  { id: "agentforce", label: "Agentforce", x: 160, y: 210, color: "hsl(var(--primary))" },
  { id: "personalize", label: "Personalization", x: 10, y: 210, color: "hsl(var(--chart-4))" },
  { id: "commerce", label: "Commerce Portal", x: 310, y: 210, color: "hsl(var(--success))" },
];

const edges = [
  { from: "sfcc", to: "datacloud" }, { from: "ga4", to: "datacloud" }, { from: "mktgcloud", to: "datacloud" },
  { from: "sfcc", to: "einstein" }, { from: "einstein", to: "datacloud" },
  { from: "datacloud", to: "crm" }, { from: "ga4", to: "crm" },
  { from: "datacloud", to: "agentforce" }, { from: "einstein", to: "agentforce" },
  { from: "agentforce", to: "personalize" }, { from: "agentforce", to: "commerce" },
];

const DataLineage = () => {
  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="glass-card p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Data Lineage & Architecture</h3>
      <p className="text-[10px] text-muted-foreground mb-4">eCommerce data flow: SFCC + GA4 ingestion → Data Cloud unification → Einstein intelligence → Agentforce activation</p>
      <svg viewBox="0 0 400 260" className="w-full" style={{ maxHeight: 260 }}>
        {edges.map((e, i) => {
          const from = getNode(e.from);
          const to = getNode(e.to);
          return (
            <line key={i} x1={from.x + 40} y1={from.y + 18} x2={to.x + 40} y2={to.y + 18} stroke="hsl(var(--border))" strokeWidth={1.5} strokeDasharray="4 3">
              <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="2s" repeatCount="indefinite" />
            </line>
          );
        })}
        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={80} height={36} rx={8} fill="hsl(var(--card))" stroke={n.color} strokeWidth={1} opacity={0.9} />
            <text x={n.x + 40} y={n.y + 21} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={9} fontWeight={500} fontFamily="Inter, system-ui">{n.label}</text>
            <circle cx={n.x + 8} cy={n.y + 8} r={2.5} fill={n.color} opacity={0.8}>
              <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        <text x={390} y={45} fill="hsl(var(--muted-foreground))" fontSize={8} textAnchor="end" fontFamily="JetBrains Mono">INGESTION</text>
        <text x={390} y={135} fill="hsl(var(--muted-foreground))" fontSize={8} textAnchor="end" fontFamily="JetBrains Mono">UNIFICATION</text>
        <text x={390} y={225} fill="hsl(var(--muted-foreground))" fontSize={8} textAnchor="end" fontFamily="JetBrains Mono">ACTIVATION</text>
      </svg>
    </div>
  );
};

export default DataLineage;
