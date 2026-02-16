import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ArrowLeft, Download, Printer, AlertTriangle, Copy, FileText, Eye, Edit, Upload } from 'lucide-react';

import {
  getInvoiceLinesById,
  formatDateTime,
  formatNominal,
  getTicketById,
} from '@/data/dummyData';
import { buildInvoiceFromLines } from '@/features/invoices/invoiceUtils';
import { exportJSON, exportExcel } from '@/lib/exporters';
import { getUserRole, isAdministrator } from '@/lib/rbac';
import { PaymentStatusChip } from '@/components/StatusChip';

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text);
}

function aggregate(values) {
  if (!values.length) return 'campuran';
  const first = values[0];
  return values.every((v) => v === first) ? first : 'campuran';
}

const APPROVAL_REQUIRED_FEE_CATEGORIES = new Set([
  'peneliti_domestik',
  'peneliti_mancanegara',
  'mooring',
  'sport_fishing',
]);

const PAYMENT_METHOD_LABELS = {
  // Doku
  doku_credit_card: 'Doku - Credit Card',
  doku_bank_va: 'Doku - Transfer Bank (Virtual Account)',
  doku_qris: 'Doku - QRIS',
  doku_e_wallet: 'Doku - E-Wallet',
  doku_minimarket: 'Doku - Minimarket',
  doku_paylater: 'Doku - PayLater',
  doku_bank_direct: 'Doku - Bank Langsung',
  doku_bank_digital: 'Doku - Bank Digital',
  // BLUD R4
  blud_bank_va: 'BLUD R4 - Transfer Bank (Virtual Account)',
  blud_qris: 'BLUD R4 - QRIS',
  blud_bank_direct: 'BLUD R4 - Bank Langsung',
  blud_cash: 'BLUD R4 - Tunai',
};

const DOCUMENT_LABELS = {
  foto_diri: 'Foto diri',
  dokumen_identitas: 'KTP/SIM/PASPOR/KITAS/KITAP',
  surat_izin_penelitian: 'Surat Ijin Penelitian (Institusi Indonesia)',
  surat_permohonan_penelitian: 'Surat Permohonan Resmi Penelitian',
  foto_kapal: 'Foto kapal',
};

const getRequiredDocumentKeys = (feeCategory) => {
  if (feeCategory === 'mooring' || feeCategory === 'sport_fishing') {
    return ['foto_diri', 'dokumen_identitas', 'foto_kapal'];
  }
  if (String(feeCategory).startsWith('peneliti_')) {
    return [
      'foto_diri',
      'dokumen_identitas',
      'surat_izin_penelitian',
      'surat_permohonan_penelitian',
    ];
  }
  return ['foto_diri', 'dokumen_identitas'];
};

const getRequiredDocumentLabels = (feeCategory) =>
  getRequiredDocumentKeys(feeCategory).map((key) => DOCUMENT_LABELS[key] || key);

const getDocumentItemsForTicket = (ticket, feeCategory) => {
  const byKey = {
    foto_diri: {
      key: 'foto_diri',
      label: DOCUMENT_LABELS.foto_diri,
      url: ticket?.selfieUrl || '/placeholder.svg',
    },
    dokumen_identitas: {
      key: 'dokumen_identitas',
      label: DOCUMENT_LABELS.dokumen_identitas,
      url: ticket?.identityDocumentUrl || ticket?.ktmUrl || '/placeholder.svg',
    },
    surat_izin_penelitian: {
      key: 'surat_izin_penelitian',
      label: DOCUMENT_LABELS.surat_izin_penelitian,
      url: ticket?.researchPermitUrl || '/placeholder.svg',
    },
    surat_permohonan_penelitian: {
      key: 'surat_permohonan_penelitian',
      label: DOCUMENT_LABELS.surat_permohonan_penelitian,
      url: ticket?.researchRequestLetterUrl || '/placeholder.svg',
    },
    foto_kapal: {
      key: 'foto_kapal',
      label: DOCUMENT_LABELS.foto_kapal,
      url: ticket?.boatPhotoUrl || '/placeholder.svg',
    },
  };
  return getRequiredDocumentKeys(feeCategory).map((key) => byKey[key]).filter(Boolean);
};

const formatPaymentMethod = (method, ticket) => {
  const normalized = String(method || '').toLowerCase();
  if (PAYMENT_METHOD_LABELS[normalized]) return PAYMENT_METHOD_LABELS[normalized];
  const genericLabelByMethod = {
    bank_transfer: 'Transfer Bank',
    credit_card: 'Credit Card',
    qris: 'QRIS',
    e_wallet: 'E-Wallet',
    cash: 'Tunai',
  };
  if (ticket?.operatorType === 'doku' && genericLabelByMethod[normalized]) {
    return `Doku - ${genericLabelByMethod[normalized]}`;
  }
  if (genericLabelByMethod[normalized]) {
    return genericLabelByMethod[normalized];
  }
  if (ticket?.operatorType === 'doku') {
    return `Doku - ${normalized}`;
  }
  return normalized || '-';
};

const getCountryForTicket = (ticketId) => {
  const ticket = getTicketById(ticketId);
  return ticket?.countryOCR || '-';
};

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isFromApproval = searchParams.get('from') === 'approval';
  const approvalParam = searchParams.get('approval');
  const approvalTab = searchParams.get('tab');
  const backToHref =
    isFromApproval && approvalTab
      ? `/approval?tab=${encodeURIComponent(approvalTab)}`
      : isFromApproval
        ? '/approval'
        : '/invoices';
  const role = getUserRole();
  const canExport = isAdministrator(role);
  const shouldAutoPrint = new URLSearchParams(location.search).get('print') === '1';
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [invoiceOverride, setInvoiceOverride] = useState(null);
  const [editForm, setEditForm] = useState({
    invoiceNo: '',
    issuedAt: '',
    paymentStatus: 'belum_bayar',
    method: 'bank_transfer',
    paidAt: '',
    billedName: '',
    billedEmail: '',
    billedPhone: '',
    notes: '',
  });
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [selectedDocCategory, setSelectedDocCategory] = useState(null);
  const [selectedDocTicketId, setSelectedDocTicketId] = useState('');

  const { invoice: baseInvoice, lines } = useMemo(() => {
    const id = invoiceId || '';
    const invLines = getInvoiceLinesById(id);
    const inv = invLines.length ? buildInvoiceFromLines(id, invLines) : null;
    return { invoice: inv, lines: invLines };
  }, [invoiceId]);

  const invoice = useMemo(() => {
    if (!baseInvoice) return null;

    const ticketRows = baseInvoice.tickets.map((t) => ({
      ...t,
      paymentStatus:
        invoiceOverride?.paymentStatus && invoiceOverride.paymentStatus !== 'campuran'
          ? invoiceOverride.paymentStatus
          : t.paymentStatus,
      paidAt: invoiceOverride?.paidAt || t.paidAt,
      method:
        invoiceOverride?.method && invoiceOverride.method !== 'campuran'
          ? invoiceOverride.method
          : t.method,
    }));

    const subtotal = ticketRows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    const grandTotal = subtotal;

    const byCategoryMap = new Map();
    for (const r of ticketRows) {
      const key = r.feeCategory;
      const current = byCategoryMap.get(key) || { feeCategory: key, feeLabel: r.feeLabel, qty: 0, total: 0 };
      current.qty += 1;
      current.total += Number(r.amount) || 0;
      byCategoryMap.set(key, current);
    }

    const derivedPaymentStatus = aggregate(ticketRows.map((t) => t.paymentStatus));
    const derivedMethod = aggregate(ticketRows.map((t) => t.method));
    const derivedRealisasi = aggregate(ticketRows.map((t) => t.realisasiStatus));

    const billedSource = ticketRows[0] || baseInvoice.tickets[0];

    return {
      ...baseInvoice,
      invoiceNo: invoiceOverride?.invoiceNo || baseInvoice.invoiceNo,
      issuedAt: invoiceOverride?.issuedAt || baseInvoice.issuedAt,
      paymentStatus: invoiceOverride?.paymentStatus || derivedPaymentStatus || baseInvoice.paymentStatus,
      method: invoiceOverride?.method || derivedMethod || baseInvoice.method,
      realisasiStatus: derivedRealisasi || baseInvoice.realisasiStatus,
      billedTo: {
        ...baseInvoice.billedTo,
        name: invoiceOverride?.billedName || billedSource?.namaLengkap || baseInvoice.billedTo.name,
        email: invoiceOverride?.billedEmail || billedSource?.email || baseInvoice.billedTo.email,
        phone: invoiceOverride?.billedPhone || billedSource?.noHP || baseInvoice.billedTo.phone,
      },
      subtotal,
      grandTotal,
      ticketCount: ticketRows.length,
      tickets: ticketRows,
      byCategory: Array.from(byCategoryMap.values()).sort((a, b) => b.total - a.total),
      notes: invoiceOverride?.notes,
    };
  }, [baseInvoice, invoiceOverride]);

  const isApprovalPending = useMemo(() => {
    if (approvalParam === 'pending') return true;
    return Boolean(invoice?.tickets?.some((ticket) => ticket.approvalStatus === 'menunggu'));
  }, [approvalParam, invoice]);

  const toDateTimeLocal = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const fromDateTimeLocal = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString();
  };

  const openEditDialog = () => {
    if (!invoice) return;
    setEditForm({
      invoiceNo: invoice.invoiceNo || '',
      issuedAt: toDateTimeLocal(invoice.issuedAt),
      paymentStatus: invoice.paymentStatus === 'campuran' ? 'belum_bayar' : invoice.paymentStatus,
      method: invoice.method === 'campuran' ? 'bank_transfer' : invoice.method,
      paidAt: toDateTimeLocal(invoice.tickets?.[0]?.paidAt || ''),
      billedName: invoice.billedTo?.name || '',
      billedEmail: invoice.billedTo?.email || '',
      billedPhone: invoice.billedTo?.phone || '',
      notes: invoice.notes || '',
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    setInvoiceOverride({
      invoiceNo: editForm.invoiceNo,
      issuedAt: fromDateTimeLocal(editForm.issuedAt),
      paymentStatus: editForm.paymentStatus,
      method: editForm.method,
      paidAt: fromDateTimeLocal(editForm.paidAt),
      billedName: editForm.billedName,
      billedEmail: editForm.billedEmail,
      billedPhone: editForm.billedPhone,
      notes: editForm.notes,
    });
    setShowEditDialog(false);
  };

  useEffect(() => {
    if (!shouldAutoPrint) return;
    const timer = setTimeout(() => window.print(), 250);
    return () => clearTimeout(timer);
  }, [shouldAutoPrint]);

  useEffect(() => {
    setInvoiceOverride(null);
    setShowEditDialog(false);
    setShowDocumentsDialog(false);
    setSelectedDocCategory(null);
    setSelectedDocTicketId('');
  }, [invoiceId]);

  if (!invoice || !lines.length) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Invoice Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground mb-4">ID: {invoiceId || '-'}</p>
            <Link to={backToHref}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {isFromApproval ? 'Kembali ke Antrian Persetujuan' : 'Kembali ke Invoice'}
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const paymentMethodSummary = Array.from(
    new Set(
      invoice.tickets.map((ticket) => {
        const sourceTicket = getTicketById(ticket.ticketId);
        return formatPaymentMethod(ticket.method, sourceTicket);
      })
    )
  ).join(', ');

  const supportingDocsByCategory = invoice.byCategory.map((item) => {
    const ticketsInCategory = invoice.tickets.filter((ticket) => ticket.feeCategory === item.feeCategory);
    return {
      feeCategory: item.feeCategory,
      feeLabel: item.feeLabel,
      docs: getRequiredDocumentLabels(item.feeCategory),
      tickets: ticketsInCategory,
      ticketCount: ticketsInCategory.length,
    };
  });

  const selectedDocTicket = selectedDocTicketId ? getTicketById(selectedDocTicketId) : null;
  const selectedDocItems = selectedDocCategory
    ? getDocumentItemsForTicket(selectedDocTicket, selectedDocCategory.feeCategory)
    : [];

  const openDocumentsDialog = (categoryGroup) => {
    setSelectedDocCategory(categoryGroup);
    setSelectedDocTicketId(categoryGroup?.tickets?.[0]?.ticketId || '');
    setShowDocumentsDialog(true);
  };

  const handleDocumentDownload = (url, filename = 'document') => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = filename;
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isApprovalRelatedTicket = (ticket) =>
    APPROVAL_REQUIRED_FEE_CATEGORIES.has(ticket.feeCategory);

  const isPaymentPendingForApproval = (ticket) =>
    isApprovalRelatedTicket(ticket) && ticket.approvalStatus !== 'disetujui';

  const hasRefundForTicket = (ticket) =>
    String(ticket.paymentStatus || '').startsWith('refund_');

  const handleExportJSON = () => {
    if (!canExport) return;
    exportJSON(invoice, `invoice_${invoice.invoiceNo}.json`);
  };

  const handleExportTicketsExcel = () => {
    if (!canExport) return;
    exportExcel(
      invoice.tickets.map((t) => ({
        invoice_id: invoice.invoiceId,
        invoice_no: invoice.invoiceNo,
        ticket_id: t.ticketId,
        nama: t.namaLengkap,
        email: t.email,
        phone: t.noHP,
        domisili: getCountryForTicket(t.ticketId),
        booking_type: t.bookingType,
        category: t.feeCategory,
        unit_price: t.unitPrice,
        amount: t.amount,
        approval_status: t.approvalStatus,
        payment_status: t.paymentStatus,
        method: formatPaymentMethod(t.method, getTicketById(t.ticketId)),
        paid_at: t.paidAt || '',
          created_at: t.createdAt,
        })),
      `invoice_${invoice.invoiceNo}_tickets.xlsx`,
      { sheetName: 'Tickets' }
    );
  };

  return (
    <AdminLayout>
      <AdminHeader
        title={`Invoice ${invoice.invoiceNo}`}
        subtitle={invoice.invoiceType === 'group' ? 'Invoice Grup (multi tiket)' : 'Invoice Perorangan'}
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .print-wrap { padding: 0 !important; }
            .card-ocean { box-shadow: none !important; border: 1px solid #ddd !important; }
            table { width: 100% !important; }
          }
        `}</style>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
          <Link to={backToHref}>
            <Button variant="ghost" className="gap-2 w-full sm:w-auto justify-start">
              <ArrowLeft className="w-4 h-4" />
              {isFromApproval ? 'Kembali ke Antrian Persetujuan' : 'Kembali'}
            </Button>
          </Link>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={openEditDialog}>
              <Edit className="w-4 h-4" />
              Edit Invoice
            </Button>
            <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </Button>

            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={handleExportJSON}
              disabled={!canExport}
              title={!canExport ? 'Hanya Admin Utama yang bisa export' : 'Export JSON'}
            >
              <Download className="w-4 h-4" />
              Export JSON
            </Button>

            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={handleExportTicketsExcel}
              disabled={!canExport}
                title={!canExport ? 'Hanya Admin Utama yang bisa export' : 'Export tiket XLS'}
              >
                <Download className="w-4 h-4" />
              Export Tiket (XLS)
              </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print-wrap">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Detail Invoice
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{invoice.invoiceType === 'group' ? 'Grup' : 'Perorangan'}</Badge>
                    {invoice.paymentStatus === 'campuran'
                      ? <Badge variant="outline">Pembayaran Campuran</Badge>
                      : <PaymentStatusChip status={invoice.paymentStatus} />
                    }
                    {isApprovalPending && (
                      <Badge
                        variant="outline"
                        className="border-status-pending text-status-pending"
                      >
                        Pending Persetujuan
                      </Badge>
                    )}
                    {invoice.refundFlag && <Badge variant="outline">Refund</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">No. Invoice</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono font-medium text-primary">{invoice.invoiceNo}</p>
                      <Button className="h-7 w-7 no-print" variant="ghost" size="icon" onClick={() => copyToClipboard(invoice.invoiceNo)}>
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                    <p className="text-sm font-medium">{formatDateTime(invoice.issuedAt)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Jumlah Tiket</p>
                    <p className="text-sm font-medium">{invoice.ticketCount}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Metode</p>
                    <p className="text-sm font-medium">{paymentMethodSummary || '-'}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Ditagihkan Kepada</p>
                  <p className="text-sm font-medium">{invoice.billedTo.name}</p>
                  <p className="text-xs text-muted-foreground">{invoice.billedTo.email} {invoice.billedTo.phone}</p>
                </div>
                {isApprovalPending && (
                  <p className="mt-3 text-xs text-status-pending">
                    Invoice dikirim ke email pengaju setelah tiket disetujui.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* TICKETS TABLE */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Daftar Tiket dalam Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID Tiket</th>
                        <th>Nama</th>
                        <th>Domisili (Negara)</th>
                        {/* <th>Tipe Tiket</th> */}
                        <th>Kategori</th>
                        <th className="text-right">Jumlah Rp</th>
                        {/* <th>Approval</th> */}
                        <th>Pembayaran</th>
                        <th>Pengembalian</th>
                        <th className="text-center no-print">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.tickets.map((t) => (
                        <tr key={t.ticketId}>
                          <td className="whitespace-nowrap font-mono text-sm">{t.ticketId}</td>
                          <td>
                            <div>
                              <p className="text-sm font-medium">{t.namaLengkap}</p>
                              <p className="text-xs text-muted-foreground">{t.email}</p>
                            </div>
                          </td>
                          <td className="text-sm">{getCountryForTicket(t.ticketId)}</td>
                          {/* <td>
                            <Badge variant="secondary">{t.bookingType === 'group' ? 'Grup' : 'Perorangan'}</Badge>
                          </td> */}
                          <td className="text-sm">{t.feeLabel}</td>
                          <td className="text-right text-sm font-semibold">{formatNominal(t.amount)}</td>
                          {/* <td><ApprovalStatusChip status={t.approvalStatus} /></td> */}
                            <td>
                              {isPaymentPendingForApproval(t) ? (
                                <Badge
                                  variant="outline"
                                  className="border-status-pending text-status-pending"
                                >
                                  Pending
                                </Badge>
                              ) : (
                                <PaymentStatusChip status={t.paymentStatus} />
                              )}
                            </td>
                            <td className="text-sm">{hasRefundForTicket(t) ? 'Ya' : 'Tidak'}</td>
                            <td className="text-center no-print">
                              <Link
                                to={`/tickets/${t.ticketId}?from=invoice&invoiceId=${encodeURIComponent(invoice.invoiceId)}`}
                              >
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Detail tiket">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Ringkasan per Kategori</p>
                    <div className="space-y-2">
                      {invoice.byCategory.map((c) => (
                        <div key={c.feeCategory} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{c.feeLabel} {c.qty} tiket</span>
                          <span className="font-semibold">{formatNominal(c.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/40 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Total Invoice</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal Rp</span>
                        <span>{formatNominal(invoice.subtotal)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Grand Total Rp</span>
                        <span className="text-xl font-bold text-primary">{formatNominal(invoice.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <p className="text-xs text-muted-foreground mt-4">
                  Role kamu: <span className="font-medium text-foreground">{role}</span>. Export hanya untuk <span className="font-medium text-foreground">Admin Utama</span>.
                </p> */}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Dokumen Pendukung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {supportingDocsByCategory.map((group) => (
                  <div key={group.feeCategory} className="rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">
                      {group.feeLabel} ({group.ticketCount} tiket)
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {group.docs.join(', ')}
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="shrink-0"
                        onClick={() => openDocumentsDialog(group)}
                      >
                        Lihat Dokumen
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="bg-card border-border max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dokumen Pendukung Invoice</DialogTitle>
            <DialogDescription>
              {selectedDocCategory
                ? `${selectedDocCategory.feeLabel} - pilih tiket untuk melihat dokumen`
                : 'Pilih kategori dokumen'}
            </DialogDescription>
          </DialogHeader>

          {selectedDocCategory && (
            <div className="space-y-4">
              {selectedDocCategory.tickets.length > 1 && (
                <div className="space-y-2">
                  <Label>Pilih Tiket</Label>
                  <Select value={selectedDocTicketId} onValueChange={setSelectedDocTicketId}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border max-h-72">
                      {selectedDocCategory.tickets.map((ticket) => (
                        <SelectItem key={ticket.ticketId} value={ticket.ticketId}>
                          {ticket.ticketId} - {ticket.namaLengkap}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedDocItems.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDocItems.map((doc) => (
                    <div key={`${selectedDocTicketId}-${doc.key}`} className="space-y-2 rounded-lg border border-border p-3">
                      <p className="text-xs font-medium text-foreground">{doc.label}</p>
                      <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={doc.url || '/placeholder.svg'}
                          alt={`Pratinjau ${doc.label}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}>
                          Preview
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDocumentDownload(doc.url, `${selectedDocTicketId}-${doc.key}`)}
                        >
                          Unduh
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Dokumen belum tersedia untuk tiket ini.
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentsDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Ubah manual data invoice jika sistem otomatis bermasalah.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>No. Invoice</Label>
              <Input
                value={editForm.invoiceNo}
                onChange={(e) => setEditForm((prev) => ({ ...prev, invoiceNo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Invoice</Label>
              <Input
                type="datetime-local"
                value={editForm.issuedAt}
                onChange={(e) => setEditForm((prev) => ({ ...prev, issuedAt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Status Pembayaran</Label>
              <Select
                value={editForm.paymentStatus}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, paymentStatus: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                  <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                  <SelectItem value="refund_diproses">Refund Diproses</SelectItem>
                  <SelectItem value="refund_selesai">Refund Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select
                value={editForm.method}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, method: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="doku_credit_card">Doku - Credit Card</SelectItem>
                  <SelectItem value="doku_bank_va">Doku - Transfer Bank (VA)</SelectItem>
                  <SelectItem value="doku_qris">Doku - QRIS</SelectItem>
                  <SelectItem value="doku_e_wallet">Doku - E-Wallet</SelectItem>
                  <SelectItem value="doku_minimarket">Doku - Minimarket</SelectItem>
                  <SelectItem value="doku_paylater">Doku - PayLater</SelectItem>
                  <SelectItem value="doku_bank_direct">Doku - Bank Langsung</SelectItem>
                  <SelectItem value="doku_bank_digital">Doku - Bank Digital</SelectItem>
                  <SelectItem value="blud_bank_va">BLUD R4 - Transfer Bank (VA)</SelectItem>
                  <SelectItem value="blud_qris">BLUD R4 - QRIS</SelectItem>
                  <SelectItem value="blud_bank_direct">BLUD R4 - Bank Langsung</SelectItem>
                  <SelectItem value="blud_cash">BLUD R4 - Tunai</SelectItem>
                  <SelectItem value="bank_transfer">Transfer Bank (Legacy)</SelectItem>
                  <SelectItem value="credit_card">Credit Card (Legacy)</SelectItem>
                  <SelectItem value="qris">QRIS (Legacy)</SelectItem>
                  <SelectItem value="e_wallet">E-Wallet (Legacy)</SelectItem>
                  <SelectItem value="cash">Tunai (Legacy)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Bayar</Label>
              <Input
                type="datetime-local"
                value={editForm.paidAt}
                onChange={(e) => setEditForm((prev) => ({ ...prev, paidAt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Tagihan</Label>
              <Input
                value={editForm.billedName}
                onChange={(e) => setEditForm((prev) => ({ ...prev, billedName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.billedEmail}
                onChange={(e) => setEditForm((prev) => ({ ...prev, billedEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>No. HP</Label>
              <Input
                value={editForm.billedPhone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, billedPhone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Catatan Koreksi</Label>
            <Textarea
              placeholder="Tambahkan alasan perubahan manual..."
              value={editForm.notes}
              onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button className="btn-ocean gap-2" onClick={handleSaveEdit}>
              <Upload className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
