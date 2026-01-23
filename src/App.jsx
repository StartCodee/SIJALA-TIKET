import React from "react";
const _jsxFileName = "src\\App.tsx";import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import TicketListPage from "./pages/TicketListPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import ApprovalQueuePage from "./pages/ApprovalQueuePage";
import PaymentsPage from "./pages/PaymentsPage";
import ServiceRatesPage from "./pages/ServiceRatesPage";
import GateMonitorPage from "./pages/GateMonitorPage";
import FinanceReportsPage from "./pages/FinanceReportsPage";
import RefundCenterPage from "./pages/RefundCenterPage";
import UserManagementPage from "./pages/UserManagementPage";
import ActivityLogsPage from "./pages/ActivityLogsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  React.createElement(QueryClientProvider, { client: queryClient, __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
    , React.createElement(TooltipProvider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
      , React.createElement(Toaster, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} )
      , React.createElement(Sonner, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
      , React.createElement(BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
        , React.createElement(Routes, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
          , React.createElement(Route, { path: "/", element: React.createElement(OverviewPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 29}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}} )
          , React.createElement(Route, { path: "/tickets", element: React.createElement(TicketListPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 30}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}} )
          , React.createElement(Route, { path: "/tickets/:ticketId", element: React.createElement(TicketDetailPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 31}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}} )
          , React.createElement(Route, { path: "/approval", element: React.createElement(ApprovalQueuePage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 32}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}} )
          , React.createElement(Route, { path: "/payments", element: React.createElement(PaymentsPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} )
          , React.createElement(Route, { path: "/tarif", element: React.createElement(ServiceRatesPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )
          , React.createElement(Route, { path: "/gate", element: React.createElement(GateMonitorPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} )
          , React.createElement(Route, { path: "/reports", element: React.createElement(FinanceReportsPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 36}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}} )
          , React.createElement(Route, { path: "/refunds", element: React.createElement(RefundCenterPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}} )
          , React.createElement(Route, { path: "/users", element: React.createElement(UserManagementPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 38}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}} )
          , React.createElement(Route, { path: "/logs", element: React.createElement(ActivityLogsPage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 39}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}} )
          , React.createElement(Route, { path: "/profile", element: React.createElement(ProfilePage, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 40}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}} )
          , React.createElement(Route, { path: "*", element: React.createElement(NotFound, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 41}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}} )
        )
      )
    )
  )
);

export default App;
