import * as React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  Users,
  Car,
  Wrench,
  BarChart3,
  Building2,
  Sparkles,
  Search,
  ChevronRight,
  Bell,
  Grid3x3,
  HelpCircle,
  Settings,
  ChevronDown,
  Headset,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PersonaProvider, usePersona } from "@/lib/persona-context";
import { PERSONAS, type PersonaId } from "@/lib/mazda-mock";
import AgentforceWidget from "@/components/AgentforceWidget";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

const NAV: Record<PersonaId, { to: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  field: [
    { to: "/", label: "Home", icon: Home },
    { to: "/leads", label: "Lead Routing", icon: Users },
    { to: "/dealer-scorecard", label: "Dealer Performance", icon: BarChart3 },
    { to: "/household", label: "Customer 360", icon: Building2 },
  ],
  agent: [
    { to: "/", label: "Home", icon: Home },
    { to: "/vehicle", label: "Vehicle", icon: Car },
    { to: "/warranty", label: "Owner Cases", icon: LifeBuoy },
    { to: "/household", label: "Customer 360", icon: Building2 },
  ],
  dealer: [
    { to: "/", label: "Home", icon: Home },
    { to: "/leads", label: "Sales Pipeline", icon: Users },
    { to: "/vehicle", label: "Vehicle", icon: Car },
    { to: "/warranty", label: "Warranty", icon: Wrench },
    { to: "/household", label: "Customer 360", icon: Building2 },
  ],
  partner: [
    { to: "/", label: "Home", icon: Home },
    { to: "/vehicle", label: "Vehicle", icon: Car },
    { to: "/warranty", label: "Warranty", icon: Wrench },
    { to: "/household", label: "Households", icon: Building2 },
  ],
};

function Shell() {
  const { persona, setPersona } = usePersona();
  const p = PERSONAS[persona];
  const location = useLocation();
  const nav = NAV[persona];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="h-9 bg-[hsl(var(--slds-brand-dark))] text-white flex items-center px-3 gap-2 text-xs sticky top-0 z-40">
        <button className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center" title="App Launcher">
          <Grid3x3 className="h-3.5 w-3.5" />
        </button>
        <div className="flex items-center gap-2 pl-1 pr-3 border-r border-white/15">
          <div className="h-5 w-5 rounded-sm bg-soul-red flex items-center justify-center">
            <span className="text-[10px] font-bold leading-none text-white">M</span>
          </div>
          <span className="font-semibold tracking-wide">Mazda Automotive Cloud</span>
          <span className="text-white/50">·</span>
          <span className="text-white/80">{p.app}</span>
        </div>

        <div className="flex-1 max-w-2xl relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
          <input
            placeholder="Search Mazda Auto Cloud — VIN, household, lead, case…"
            className="w-full h-7 pl-8 pr-3 rounded-sm bg-white/10 text-white placeholder:text-white/50 text-xs focus:outline-none focus:bg-white/15 focus:ring-1 focus:ring-white/30"
          />
        </div>

        <button className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center" title="Help">
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
        <button className="h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center" title="Setup">
          <Settings className="h-3.5 w-3.5" />
        </button>
        <button className="relative h-7 w-7 rounded hover:bg-white/10 flex items-center justify-center" title="Notifications">
          <Bell className="h-3.5 w-3.5" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-warning" />
        </button>
        <PersonaMenu value={persona} onChange={setPersona} initials={p.initials} name={p.name} role={p.role} />
      </div>

      <header className="h-12 border-b hairline bg-card flex items-center px-4 gap-1 sticky top-9 z-30 shadow-sm">
        <div className="flex items-center gap-2 mr-4 pr-4 border-r hairline">
          <Headset className="h-4 w-4 text-primary" />
          <div className="text-[13px] font-semibold leading-tight">{p.app}</div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <nav className="flex items-center gap-0.5 h-full overflow-x-auto">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "h-12 px-3 inline-flex items-center gap-1.5 text-[13px] border-b-[3px] transition-colors whitespace-nowrap",
                  active
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-foreground/70 hover:text-foreground hover:border-border",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto text-[11px] text-muted-foreground">
          Logged in as <span className="text-foreground font-medium">{p.name}</span> · {p.role}
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <AgentforceWidget />
    </div>
  );
}

export default function MazdaAppShell() {
  return (
    <PersonaProvider>
      <Shell />
    </PersonaProvider>
  );
}

function PersonaMenu({ value, onChange, initials, name, role }: { value: PersonaId; onChange: (p: PersonaId) => void; initials: string; name: string; role: string }) {
  const items: { id: PersonaId; label: string }[] = [
    { id: "field", label: "MNAO Field" },
    { id: "agent", label: "Owner Support" },
    { id: "dealer", label: "Dealer" },
    { id: "partner", label: "CV / MFS Partner" },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-7 w-7 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[10px] font-semibold ml-1 hover:bg-white/25 focus:outline-none focus:ring-1 focus:ring-white/40"
          title="Switch persona"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold leading-tight">{name}</span>
          <span className="text-[11px] font-normal text-muted-foreground">{role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          Switch persona
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as PersonaId)}>
          {items.map((it) => (
            <DropdownMenuRadioItem key={it.id} value={it.id} className="text-sm">
              {it.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[11px] text-muted-foreground">Log out · Settings</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 mb-6">
      <div>
        {eyebrow && (
          <div className="text-[11px] uppercase tracking-[0.14em] text-primary mb-1.5 font-medium">{eyebrow}</div>
        )}
        <h1 className="text-2xl md:text-[26px] text-foreground font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

export function Crumb({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
      <Link to="/" className="hover:text-primary hover:underline">Home</Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-foreground">{children}</span>
    </div>
  );
}

// AgentDock removed in favor of the floating AgentforceWidget.

export function HighlightsPanel({
  icon: Icon,
  iconTone = "blue",
  recordType,
  title,
  fields,
  actions,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconTone?: "blue" | "teal" | "orange" | "soul" | "purple";
  recordType: string;
  title: string;
  fields: { label: string; value: string }[];
  actions?: React.ReactNode;
}) {
  const toneClass = {
    blue: "bg-[#0176D3]",
    teal: "bg-[#107CAD]",
    orange: "bg-[#FE9339]",
    soul: "bg-soul-red",
    purple: "bg-[#7F56D9]",
  }[iconTone];
  return (
    <div className="rounded border hairline bg-card shadow-card">
      <div className="p-4 border-b hairline flex items-start gap-3">
        <div className={cn("h-10 w-10 rounded-sm flex items-center justify-center flex-shrink-0", toneClass)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{recordType}</div>
          <div className="text-lg font-semibold leading-tight truncate">{title}</div>
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
      <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
        {fields.map((f) => (
          <div key={f.label} className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{f.label}</div>
            <div className="text-sm truncate">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}