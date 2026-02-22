import { FEE_PRICING } from "@/data/dummyData";

export const VISITOR_HIDE_KEY = "visitor_hidden_keys_v1";

const PAID_STATUSES = new Set([
  "sudah_bayar",
  "refund_diajukan",
  "refund_diproses",
  "refund_selesai",
]);

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const normalizeString = (value) => String(value || "").trim().toLowerCase();

const normalizeKtp = (value) => String(value || "").replace(/\s+/g, "").trim();

export const getTicketKtp = (ticket) => {
  if (ticket?.noKTP) return String(ticket.noKTP).trim();
  if (ticket?.identityType === "ktp" && ticket?.identityNumber) {
    return String(ticket.identityNumber).trim();
  }
  return "";
};

export const getVisitorKeyFromTicket = (ticket) => {
  const ktp = normalizeKtp(getTicketKtp(ticket));
  const email = normalizeString(ticket?.email);
  const phone = normalizeString(ticket?.noHP);
  const name = normalizeString(ticket?.namaLengkap);

  if (ktp) return `ktp:${ktp}`;
  if (email && phone) return `contact:${email}|${phone}`;
  if (email) return `email:${email}`;
  if (phone) return `phone:${phone}`;
  return `name:${name || ticket?.id || "visitor"}`;
};

export const loadHiddenVisitorKeys = () => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(VISITOR_HIDE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveHiddenVisitorKeys = (keys) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(VISITOR_HIDE_KEY, JSON.stringify(keys));
  } catch {
    // noop for dummy mode
  }
};

export const groupTicketsByVisitor = (tickets, hiddenVisitorKeys = []) => {
  const hiddenSet = new Set(hiddenVisitorKeys);
  const groupMap = new Map();

  for (const ticket of tickets) {
    const key = getVisitorKeyFromTicket(ticket);
    if (hiddenSet.has(key)) continue;

    if (!groupMap.has(key)) {
      groupMap.set(key, {
        visitorKey: key,
        namaLengkap: ticket.namaLengkap || "-",
        email: ticket.email || "-",
        noHP: ticket.noHP || "-",
        noKTP: getTicketKtp(ticket) || "-",
        tickets: [],
      });
    }
    groupMap.get(key).tickets.push(ticket);
  }

  return Array.from(groupMap.values()).sort((a, b) =>
    String(a.namaLengkap || "").localeCompare(String(b.namaLengkap || "")),
  );
};

const getCardActiveStart = (ticket) => ticket?.paidAt || ticket?.createdAt;

const getValidityMonths = (ticket) => {
  const validityLabel = FEE_PRICING[ticket?.feeCategory]?.validity || "12 bulan";
  const monthMatch = String(validityLabel).match(/(\d+)/);
  return monthMatch ? Number(monthMatch[1]) : 12;
};

export const getTicketRemainingDays = (ticket) => {
  if (!PAID_STATUSES.has(ticket?.paymentStatus)) return 0;
  const activeStart = new Date(getCardActiveStart(ticket));
  if (Number.isNaN(activeStart.getTime())) return 0;

  const expiresAt = new Date(activeStart);
  expiresAt.setMonth(expiresAt.getMonth() + getValidityMonths(ticket));
  const remainingMs = expiresAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
};

export const getTicketActivityInfo = (ticket) => {
  const remainingDays = getTicketRemainingDays(ticket);
  if (remainingDays > 0) {
    return {
      status: "active",
      label: `${remainingDays} hari`,
      className: "bg-status-approved-bg text-status-approved",
      remainingDays,
    };
  }
  return {
    status: "inactive",
    label: "0 hari",
    className: "bg-slate-200 text-slate-700",
    remainingDays: 0,
  };
};
