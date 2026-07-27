import GlobalSearch from "@/components/layout/GlobalSearch";
import UtilityPanel from "@/components/layout/UtilityPanel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CopilotContextProvider, useCopilotContextStore } from "@/context/CopilotContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { NAV_BY_PERSONA } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { GovernanceService, WorkflowService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  PanelRightOpen,
  PhoneCall,
  PhoneOff,
  Search,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";

function InteractionBar() {
  const { activeInteraction, endInteraction, updateInteraction, logAudit } = useWorkspace();
  const [elapsed, setElapsed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!activeInteraction) return;
    const t = window.setInterval(() => setElapsed(Math.floor((Date.now() - activeInteraction.startedAt) / 1000)), 1000);
    return () => window.clearInterval(t);
  }, [activeInteraction]);

  if (!activeInteraction) return null;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="glass z-20 flex flex-wrap items-center gap-3 rounded-none border-x-0 border-t-0 bg-primary/[0.07] px-4 py-2 text-sm animate-fade-in">
      <span className="inline-flex items-center gap-2 font-medium text-foreground">
        <PhoneCall className="h-4 w-4 text-primary" aria-hidden="true" />
        {activeInteraction.channel} · {activeInteraction.callerLabel}
      </span>
      <span className="num text-muted-foreground" aria-live="off">
        {mm}:{ss}
      </span>
      <span className="text-muted-foreground">Queue {activeInteraction.queue}</span>
      <span
        className={cn(
          "rounded border px-1.5 py-0.5 text-xs font-medium",
          activeInteraction.verified
            ? "border-success/30 bg-success/10 text-success"
            : "border-warning/40 bg-warning/15 text-warning-foreground",
        )}
      >
        {activeInteraction.verified ? "Identity verified" : "Identity not verified"}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {activeInteraction.clientId && (
          <Button size="sm" variant="outline" onClick={() => navigate(`/clients/${activeInteraction.clientId}`)}>
            Open client record
          </Button>
        )}
        {!activeInteraction.verified && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              updateInteraction({ verified: true });
              logAudit({ action: "Identity verification completed", record: activeInteraction.callerLabel, detail: "Knowledge-based verification passed." });
              toast.success("Identity verified for this interaction.");
            }}
          >
            Verify identity
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            logAudit({ action: "Interaction ended", record: activeInteraction.callerLabel, detail: `Duration ${mm}:${ss}.` });
            endInteraction();
            toast.success("Interaction wrapped up and logged.");
          }}
        >
          <PhoneOff className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          End
        </Button>
      </div>
    </div>
  );
}

function ShellInner() {
  const { persona, personaId, personas, setPersona, signOut, utilityOpen, setUtilityOpen, askCopilot } = useWorkspace();
  const { contextLabel, contextText } = useCopilotContextStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const navigate = useNavigate();
  const nav = NAV_BY_PERSONA[personaId];

  const { data: work = [] } = useQuery({ queryKey: ["work-items"], queryFn: WorkflowService.items });
  const { data: alerts = [] } = useQuery({ queryKey: ["alerts"], queryFn: GovernanceService.alerts });

  const badgeCounts = {
    myWork: work.filter((w) => w.category === "My Work" && w.status !== "Complete").length,
    cases: work.filter((w) => w.type.toLowerCase().includes("case")).length,
    claims: work.filter((w) => w.type.toLowerCase().includes("claim")).length,
    exceptions: work.filter((w) => w.category === "Exception").length,
    approvals: work.filter((w) => w.category === "Approval").length,
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Ambient liquid backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-[120px] animate-float" />
        <div className="absolute -right-32 top-10 h-[30rem] w-[30rem] rounded-full bg-[hsl(var(--primary-glow)/0.18)] blur-[130px] animate-float [animation-delay:-5s]" />
        <div className="absolute bottom-[-14rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-[hsl(268_62%_60%/0.14)] blur-[140px] animate-float [animation-delay:-9s]" />
      </div>

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
        Skip to main content
      </a>

      <header className="glass z-30 flex h-16 shrink-0 items-center gap-3 rounded-none border-x-0 border-t-0 px-4">
        <div className="flex items-center gap-2.5">
          <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-primary-foreground shadow-glass">
            UF
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-foreground">Engagement Hub</p>
            <p className="text-[11px] text-muted-foreground">Headless360 · Salesforce Data</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="glass ml-4 flex h-10 max-w-xl flex-1 items-center gap-2 rounded-full px-4 text-left text-sm text-muted-foreground transition-all duration-300 hover:shadow-float hover:ring-1 hover:ring-primary/30"
          aria-label="Open global search"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="flex-1 truncate">Search clients, policies, claims, cases…</span>
          <kbd className="rounded-md border border-border/70 bg-foreground/[0.04] px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
        </button>


        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label={`${alerts.length} alerts`} onClick={() => navigate("/work?tab=alerts")}>
            <Bell className="h-4 w-4" aria-hidden="true" />
            {alerts.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                {alerts.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              askCopilot({ prompt: `Give me a short situational briefing for ${contextLabel}.`, contextLabel })
            }
          >
            Ask Copilot
          </Button>

          {!utilityOpen && (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setUtilityOpen(true)} aria-label="Open utility panel">
              <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 gap-2 px-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{persona.initials}</AvatarFallback>
                </Avatar>
                <span className="hidden text-left leading-tight lg:block">
                  <span className="block text-xs font-semibold text-foreground">{persona.name}</span>
                  <span className="block text-xs text-muted-foreground">{persona.title}</span>
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Switch demo persona</DropdownMenuLabel>
              {personas.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() => {
                    setPersona(p.id);
                    toast.success(`Now working as ${p.name}, ${p.title}.`);
                    navigate(p.id === "customer" ? "/self-service" : "/home");
                  }}
                >
                  <UserCog className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block text-sm">{p.name}</span>
                    <span className="block text-xs text-muted-foreground">{p.title}</span>
                  </span>
                  {p.id === personaId && <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut();
                  navigate("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign out of the demo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <InteractionBar />

      <div className="relative z-10 flex min-h-0 flex-1">
        <nav
          className={cn(
            "glass z-20 flex shrink-0 flex-col rounded-none border-y-0 border-l-0 transition-all duration-300 ease-out",
            railCollapsed ? "w-[4.5rem]" : "w-60",
          )}
          aria-label="Primary"
        >
          <ul className="flex-1 space-y-1 p-3">
            {nav.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                      railCollapsed && "justify-center px-0",
                      isActive
                        ? "bg-primary/[0.12] font-semibold text-primary shadow-[inset_0_1px_0_0_hsl(var(--glass-highlight)/0.5)] ring-1 ring-primary/20"
                        : "text-muted-foreground hover:bg-foreground/[0.05] hover:text-foreground",
                    )
                  }
                  title={railCollapsed ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && !railCollapsed && (
                        <span aria-hidden="true" className="brand-gradient absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full" />
                      )}
                      <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                      {!railCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!railCollapsed && item.badgeKey && badgeCounts[item.badgeKey] > 0 && (
                        <span className="num rounded-full bg-foreground/[0.07] px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {badgeCounts[item.badgeKey]}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="border-t border-border/60 p-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn("w-full rounded-xl", railCollapsed ? "justify-center px-0" : "justify-start")}
              onClick={() => setRailCollapsed((v) => !v)}
              aria-label={railCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              {railCollapsed ? <ChevronsRight className="h-4 w-4" aria-hidden="true" /> : <ChevronsLeft className="mr-2 h-4 w-4" aria-hidden="true" />}
              {!railCollapsed && "Collapse"}
            </Button>
          </div>
        </nav>

        <main id="main-content" className="relative z-10 min-w-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-[1600px] animate-fade-in">
            <Outlet />
          </div>
        </main>


        {utilityOpen && <UtilityPanel contextLabel={contextLabel} contextText={contextText} />}
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

export default function AppShell() {
  return (
    <CopilotContextProvider>
      <ShellInner />
    </CopilotContextProvider>
  );
}
