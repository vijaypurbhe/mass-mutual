import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import AppShell from "@/components/layout/AppShell";
import RequireAuth from "@/components/layout/RequireAuth";
import Login from "@/pages/Login";
import HomePage from "@/pages/Home";
import SearchPage from "@/pages/SearchPage";
import Client360 from "@/pages/Client360";
import PolicyDetail from "@/pages/PolicyDetail";
import AccountDetail from "@/pages/AccountDetail";
import CaseWorkspace from "@/pages/CaseWorkspace";
import ClaimWorkspace from "@/pages/ClaimWorkspace";
import WorkPage from "@/pages/WorkPage";
import KnowledgePage from "@/pages/KnowledgePage";
import DocumentsPage from "@/pages/DocumentsPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AdminPage from "@/pages/AdminPage";
import SelfService from "@/pages/SelfService";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WorkspaceProvider>
      <TooltipProvider delayDuration={200}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/self-service" element={<SelfService />} />
            <Route
              element={
                <RequireAuth>
                  <AppShell />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/clients/:clientId" element={<Client360 />} />
              <Route path="/clients/:clientId/policies/:policyId" element={<PolicyDetail />} />
              <Route path="/clients/:clientId/accounts/:accountId" element={<AccountDetail />} />
              <Route path="/cases/:caseId" element={<CaseWorkspace />} />
              <Route path="/claims/:claimId" element={<ClaimWorkspace />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/knowledge" element={<KnowledgePage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WorkspaceProvider>
  </QueryClientProvider>
);

export default App;
