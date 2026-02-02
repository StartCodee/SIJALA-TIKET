import type { Invoice, PaymentStatus, RealisasiStatus, Ticket } from '@/data/dummyData';
import {
  dummyTickets,
  DOMISILI_LABELS,
  FEE_PRICING,
  groupInvoiceLinesById,
} from '@/data/dummyData';

export type InvoiceType = 'perorangan' | 'group';

export type InvoiceTicketRow = {
  invoiceId: string;
  ticketId: string;

  namaLengkap: string;
  email: string;
  noHP: string;
  domisiliLabel: string;

  bookingType: Ticket['bookingType'];
  feeCategory: Ticket['feeCategory'];
  feeLabel: string;

  unitPrice: number;
  amount: number;

  approvalStatus: Ticket['approvalStatus'];
  paymentStatus: PaymentStatus;
  realisasiStatus: RealisasiStatus;

  method: Invoice['method'];
  paidAt?: string;

  createdAt: string;
};

export type InvoiceViewModel = {
  invoiceId: string;
  invoiceNo: string;
  invoiceType: InvoiceType;

  issuedAt: string; // paidAt earliest, else createdAt earliest
  ticketCount: number;

  billedTo: {
    name: string;
    email: string;
    phone: string;
    domisiliLabel: string;
  };

  paymentStatus: PaymentStatus | 'campuran';
  realisasiStatus: RealisasiStatus | 'campuran';
  method: Invoice['method'] | 'campuran';
  refundFlag: boolean;

  subtotal: number;
  grandTotal: number;

  tickets: InvoiceTicketRow[];

  byCategory: Array<{
    feeCategory: string;
    feeLabel: string;
    qty: number;
    total: number;
  }>;
};

function aggregate<T extends string>(values: T[]): T | 'campuran' {
  if (!values.length) return 'campuran';
  const first = values[0];
  return values.every((v) => v === first) ? first : 'campuran';
}

function earliestIso(values: (string | undefined)[]) {
  const v = values.filter(Boolean) as string[];
  if (!v.length) return '';
  return v.slice().sort((a, b) => a.localeCompare(b))[0];
}

export function buildInvoicesFromLines(allLines: Invoice[]): InvoiceViewModel[] {
  const grouped = groupInvoiceLinesById(allLines);

  return Object.entries(grouped)
    .map(([invoiceId, lines]) => buildInvoiceFromLines(invoiceId, lines))
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
}

export function buildInvoiceFromLines(invoiceId: string, lines: Invoice[]): InvoiceViewModel {
  const lineTicketIds = lines.map((l) => l.ticketId);
  const tickets = lineTicketIds
    .map((id) => dummyTickets.find((t) => t.id === id))
    .filter(Boolean) as Ticket[];

  // fallback kalau ticket tidak ketemu
  const firstTicket = tickets[0];

  const ticketRows: InvoiceTicketRow[] = lines.map((l) => {
    const t = dummyTickets.find((x) => x.id === l.ticketId);

    const feeLabel = t ? (FEE_PRICING[t.feeCategory]?.label || t.feeCategory) : 'Unknown';
    const dom = t ? DOMISILI_LABELS[t.domisiliOCR] : '-';

    return {
      invoiceId,
      ticketId: l.ticketId,
      namaLengkap: t?.namaLengkap || '-',
      email: t?.email || '-',
      noHP: t?.noHP || '-',
      domisiliLabel: dom,
      bookingType: t?.bookingType || 'perorangan',
      feeCategory: t?.feeCategory || 'wisatawan_domestik_pbd',
      feeLabel,
      unitPrice: t?.hargaPerOrang || 0,
      amount: l.amount ?? (t?.totalBiaya || 0),
      approvalStatus: t?.approvalStatus || 'menunggu',
      paymentStatus: l.paymentStatus,
      realisasiStatus: l.realisasiStatus,
      method: l.method,
      paidAt: l.paidAt,
      createdAt: t?.createdAt || new Date().toISOString(),
    };
  });

  const subtotal = ticketRows.reduce((acc, r) => acc + (r.amount || 0), 0);
  const grandTotal = subtotal;

  const issuedAt =
    earliestIso(lines.map((l) => l.paidAt)) ||
    earliestIso(ticketRows.map((r) => r.createdAt)) ||
    new Date().toISOString();

  const paymentStatus = aggregate(lines.map((l) => l.paymentStatus));
  const realisasiStatus = aggregate(lines.map((l) => l.realisasiStatus));
  const method = aggregate(lines.map((l) => l.method));
  const refundFlag = lines.some((l) => l.refundFlag);

  const byCategoryMap = new Map<string, { feeCategory: string; feeLabel: string; qty: number; total: number }>();
  for (const r of ticketRows) {
    const key = r.feeCategory;
    const curr = byCategoryMap.get(key) || { feeCategory: key, feeLabel: r.feeLabel, qty: 0, total: 0 };
    curr.qty += 1;
    curr.total += r.amount || 0;
    byCategoryMap.set(key, curr);
  }

  const invoiceType: InvoiceType = lines.length > 1 ? 'group' : 'perorangan';

  return {
    invoiceId,
    invoiceNo: invoiceId, // sudah INV-2024-xxx sesuai dummy
    invoiceType,
    issuedAt,
    ticketCount: lines.length,

    billedTo: {
      name: firstTicket?.namaLengkap || ticketRows[0]?.namaLengkap || '-',
      email: firstTicket?.email || ticketRows[0]?.email || '-',
      phone: firstTicket?.noHP || ticketRows[0]?.noHP || '-',
      domisiliLabel: firstTicket ? DOMISILI_LABELS[firstTicket.domisiliOCR] : (ticketRows[0]?.domisiliLabel || '-'),
    },

    paymentStatus,
    realisasiStatus,
    method,
    refundFlag,

    subtotal,
    grandTotal,

    tickets: ticketRows,
    byCategory: Array.from(byCategoryMap.values()).sort((a, b) => b.total - a.total),
  };
}
