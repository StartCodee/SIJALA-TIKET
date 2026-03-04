export const LANGUAGE_STORAGE_KEY = "sijala_admin_language_v1";

export const DEFAULT_LANGUAGE = "id";

export const SUPPORTED_LANGUAGES = ["id", "en"];

const ROUTE_PAGE_MAP = [
  { match: (pathname) => pathname === "/", page: "overview" },
  { match: (pathname) => pathname === "/tickets", page: "ticket-list" },
  { match: (pathname) => pathname.startsWith("/tickets/"), page: "ticket-detail" },
  { match: (pathname) => pathname === "/approval", page: "approval" },
  { match: (pathname) => pathname === "/payments", page: "payments" },
  { match: (pathname) => pathname === "/tarif", page: "service-rates" },
  { match: (pathname) => pathname === "/gate", page: "gate-monitor" },
  { match: (pathname) => pathname === "/reports", page: "finance-reports" },
  { match: (pathname) => pathname === "/refund-request", page: "refund-request" },
  { match: (pathname) => pathname === "/refunds", page: "refund-center" },
  { match: (pathname) => pathname === "/users", page: "user-management" },
  { match: (pathname) => pathname === "/logs", page: "activity-logs" },
  { match: (pathname) => pathname === "/invoices", page: "invoice-list" },
  { match: (pathname) => pathname.startsWith("/invoices/"), page: "invoice-detail" },
  { match: (pathname) => pathname === "/ticket-designer", page: "ticket-designer" },
  { match: (pathname) => pathname === "/profile", page: "profile" },
  { match: (pathname) => pathname === "/visitors", page: "visitors" },
  { match: (pathname) => pathname.startsWith("/visitors/"), page: "visitor-detail" },
];

export function resolveLocalePage(pathname = "/") {
  const matched = ROUTE_PAGE_MAP.find((route) => route.match(pathname));
  return matched?.page || "not-found";
}
