import { channelData } from "@/data/mockData";

const ChannelTable = () => (
  <div className="glass-card p-5 xl:p-6">
    <h3 className="text-sm xl:text-base font-semibold text-foreground mb-4">Channel Performance (GA4)</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-xs xl:text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 xl:py-3 text-muted-foreground font-medium">Channel</th>
            <th className="text-right py-2 xl:py-3 text-muted-foreground font-medium">Revenue</th>
            <th className="text-right py-2 xl:py-3 text-muted-foreground font-medium">Sessions</th>
            <th className="text-right py-2 xl:py-3 text-muted-foreground font-medium">Conv Rate</th>
          </tr>
        </thead>
        <tbody>
          {channelData.map((ch) => (
            <tr key={ch.channel} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
              <td className="py-2.5 font-medium text-foreground">{ch.channel}</td>
              <td className="py-2.5 text-right font-mono text-foreground">
                ${(ch.revenue / 1000000).toFixed(1)}M
              </td>
              <td className="py-2.5 text-right font-mono text-muted-foreground">
                {(ch.sessions / 1000).toFixed(0)}K
              </td>
              <td className="py-2.5 text-right font-mono text-success">{ch.conversion}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ChannelTable;
