import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import ApprovalQueuePage from "./pages/ApprovalQueuePage";
import PaymentsPage from "./pages/PaymentsPage";
import GateMonitorPage from "./pages/GateMonitorPage";
import FinanceReportsPage from "./pages/FinanceReportsPage";
import RefundCenterPage from "./pages/RefundCenterPage";
import UserManagementPage from "./pages/UserManagementPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailPage />} />
          <Route path="/approval" element={<ApprovalQueuePage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/gate" element={<GateMonitorPage />} />
          <Route path="/reports" element={<FinanceReportsPage />} />
          <Route path="/refunds" element={<RefundCenterPage />} />
          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/logs" element={<ActivityLogsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
