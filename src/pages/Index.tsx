import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Activity, FileText, LogOut, Zap } from "lucide-react";
import KpiTile from "@/components/KpiTile";
import AgentCard, { type AgentCardHandle } from "@/components/AgentCard";
import RevenueChart from "@/components/RevenueChart";
import ChannelTable from "@/components/ChannelTable";
import AiCommandInput from "@/components/AiCommandInput";
import ScenarioPanel from "@/components/ScenarioPanel";
import CustomerProfile from "@/components/CustomerProfile";
import BudgetOptimization from "@/components/BudgetOptimization";
import GovernancePanel from "@/components/GovernancePanel";
import ForecastingPanel from "@/components/ForecastingPanel";
import { StateToggle, CurrentVsFuture } from "@/components/StateToggle";
import DataLineage from "@/components/DataLineage";
import StreamingAlerts from "@/components/StreamingAlerts";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { kpiData, agents, scenarios } from "@/data/mockData";
import Login from "./Login";
import { clearAuthenticatedEmail, getAuthenticatedEmail, isLoginReportAdmin, setAuthenticatedEmail } from "@/lib/demoAccess";

const Index = () => {
  const [viewState, setViewState] = useState<"current" | "agentic">("agentic");
  const [authenticatedEmail, setCurrentAuthenticatedEmail] = useState<string | null>(() => getAuthenticatedEmail());
  const agentRefs = useRef<Record<string, AgentCardHandle | null>>({});

  const handleAlertClick = useCallback((agentId: string, alertContext: string) => {
    const agentRef = agentRefs.current[agentId];
    if (agentRef) {
      agentRef.openWithContext(alertContext);
    }
  }, []);

  const handleAuthenticated = useCallback((email: string) => {
    setAuthenticatedEmail(email);
    setCurrentAuthenticatedEmail(email);
  }, []);

  const handleSignOut = useCallback(() => {
    clearAuthenticatedEmail();
    setCurrentAuthenticatedEmail(null);
  }, []);

  if (!authenticatedEmail) {
    return <Login onAuthenticated={handleAuthenticated} />;
  }

  const canAccessLoginReport = isLoginReportAdmin(authenticatedEmail);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 xl:px-10 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm xl:text-base font-bold text-foreground tracking-tight truncate">
                Agentic eCommerce Intelligence
              </h1>
              <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
                Salesforce Commerce Cloud • Google Analytics 4 • Data Cloud • Einstein AI • Marketing Cloud
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="hidden md:block">
              <StateToggle state={viewState} onChange={setViewState} />
            </div>
            <div className="flex items-center gap-1.5 text-[10px]">
              <Activity className="w-3 h-3 text-success animate-pulse" />
              <span className="text-success font-medium">Live</span>
              <span className="text-muted-foreground hidden sm:inline">• 5 agents active</span>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono hidden xl:block">
              1.24M sessions • 150K SKUs • 4,200+ accounts
            </div>
            {canAccessLoginReport ? (
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
                <Link to="/login-report">
                  <FileText className="w-4 h-4" />
                  Login Report
                </Link>
              </Button>
            ) : null}
            <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
        <div className="md:hidden px-4 pb-2 space-y-2">
          <StateToggle state={viewState} onChange={setViewState} />
          {canAccessLoginReport ? (
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/login-report">
                <FileText className="w-4 h-4" />
                Login Report
              </Link>
            </Button>
          ) : null}
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-4 sm:px-6 xl:px-10 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3 xl:gap-4">
          {kpiData.map((kpi, i) => (
            <KpiTile key={kpi.label} {...kpi} index={i} />
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
          <div className="lg:col-span-2 space-y-4">
            <RevenueChart />
            <ChannelTable />
          </div>
          <AiCommandInput />
        </section>

        <StreamingAlerts onAlertClick={handleAlertClick} />
        <ForecastingPanel />

        <section>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <h2 className="text-sm xl:text-base font-bold text-foreground">AI Agent Layer</h2>
            <span className="text-[10px] xl:text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Agentforce</span>
            <span className="text-[10px] xl:text-xs text-muted-foreground ml-1 hidden sm:inline">Click "Chat" to interact with any agent</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 xl:gap-4">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                ref={(el) => { agentRefs.current[agent.id] = el; }}
                agent={agent}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
          <ScenarioPanel scenarios={scenarios} />
          <CustomerProfile />
        </section>

        <BudgetOptimization />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
          <DataLineage />
          <CurrentVsFuture state={viewState} />
        </section>

        <GovernancePanel />

        <footer className="text-center py-4 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground">
            Simulated Demo Environment • Salesforce Commerce Cloud + Google Analytics 4 + Data Cloud + Einstein AI + Agentforce
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
