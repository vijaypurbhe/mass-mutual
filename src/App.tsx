import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginReport from "./pages/LoginReport";
import NotFound from "./pages/NotFound";
import MazdaAppShell from "./components/MazdaAppShell";
import MazdaHome from "./pages/mazda/Home";
import MazdaLeads from "./pages/mazda/Leads";
import MazdaVehicle from "./pages/mazda/Vehicle";
import MazdaWarranty from "./pages/mazda/Warranty";
import MazdaDealerScorecard from "./pages/mazda/DealerScorecard";
import MazdaHousehold from "./pages/mazda/Household";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MazdaAppShell />}>
            <Route path="/" element={<MazdaHome />} />
            <Route path="/leads" element={<MazdaLeads />} />
            <Route path="/vehicle" element={<MazdaVehicle />} />
            <Route path="/warranty" element={<MazdaWarranty />} />
            <Route path="/dealer-scorecard" element={<MazdaDealerScorecard />} />
            <Route path="/household" element={<MazdaHousehold />} />
          </Route>
          <Route path="/login-report" element={<LoginReport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
