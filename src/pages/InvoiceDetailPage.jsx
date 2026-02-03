import { useEffect, useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { ArrowLeft, Download, Printer, AlertTriangle, Copy, FileText, Eye } from 'lucide-react';

import { dummyInvoices, getInvoiceLinesById, formatDateTime, formatRupiah } from '@/data/dummyData';
import { buildInvoiceFromLines } from '@/features/invoices/invoiceUtils';
import { exportJSON, exportExcel } from '@/lib/exporters';
import { getUserRole, isAdministrator } from '@/lib/rbac';
import { PaymentStatusChip, ApprovalStatusChip } from '@/components/StatusChip';

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text);
}

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const location = useLocation();
  const role = getUserRole();
  const canExport = isAdministrator(role);
  const shouldAutoPrint = new URLSearchParams(location.search).get('print') === '1';

  const { invoice, lines } = useMemo(() => {
    const id = invoiceId || '';
    const invLines = getInvoiceLinesById(id);
    const inv = invLines.length ? buildInvoiceFromLines(id, invLines) : null;
    return { invoice: inv, lines: invLines };
  }, [invoiceId]);

  useEffect(() => {
    if (!shouldAutoPrint) return;
    const timer = setTimeout(() => window.print(), 250);
    return () => clearTimeout(timer);
  }, [shouldAutoPrint]);

  if (!invoice || !lines.length) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Invoice Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground mb-4">ID: {invoiceId || '-'}</p>
            <Link to="/invoices">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Invoice
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
        domisili: t.domisiliLabel,
        booking_type: t.bookingType,
        category: t.feeCategory,
        unit_price: t.unitPrice,
        amount: t.amount,
        approval_status: t.approvalStatus,
        payment_status: t.paymentStatus,
        method: t.method,
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

        <div className="flex items-center justify-between no-print">
          <Link to="/invoices">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportJSON}
              disabled={!canExport}
              title={!canExport ? 'Hanya super_admin yang bisa export' : 'Export JSON'}
            >
              <Download className="w-4 h-4" />
              Export JSON
            </Button>

            <Button
              variant="outline"
              className="gap-2"
              onClick={handleExportTicketsExcel}
              disabled={!canExport}
              title={!canExport ? 'Hanya super_admin yang bisa export' : 'Export tiket Excel'}
            >
              <Download className="w-4 h-4" />
              Export Tiket (Excel)
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
                      ? <Badge variant="outline">Payment Campuran</Badge>
                      : <PaymentStatusChip status={invoice.paymentStatus} />
                    }
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
                    <p className="text-sm font-medium">{invoice.method === 'campuran' ? 'Campuran' : invoice.method}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Ditagihkan Kepada</p>
                  <p className="text-sm font-medium">{invoice.billedTo.name}</p>
                  <p className="text-xs text-muted-foreground">{invoice.billedTo.email} {invoice.billedTo.phone}</p>
                </div>
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
                        <th>Domisili</th>
                        {/* <th>Tipe Tiket</th> */}
                        <th>Kategori</th>
                        <th className="text-right">Amount</th>
                        {/* <th>Approval</th> */}
                        <th>Payment</th>
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
                          <td className="text-sm">{t.domisiliLabel}</td>
                          {/* <td>
                            <Badge variant="secondary">{t.bookingType === 'group' ? 'Grup' : 'Perorangan'}</Badge>
                          </td> */}
                          <td className="text-sm">{t.feeLabel}</td>
                          <td className="text-right text-sm font-semibold">{formatRupiah(t.amount)}</td>
                          {/* <td><ApprovalStatusChip status={t.approvalStatus} /></td> */}
                          <td><PaymentStatusChip status={t.paymentStatus} /></td>
                          <td className="text-center no-print">
                            <Link to={`/tickets/${t.ticketId}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
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
                          <span className="font-semibold">{formatRupiah(c.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/40 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Total Invoice</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatRupiah(invoice.subtotal)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Grand Total</span>
                        <span className="text-xl font-bold text-primary">{formatRupiah(invoice.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <p className="text-xs text-muted-foreground mt-4">
                  Role kamu: <span className="font-medium text-foreground">{role}</span>. Export hanya untuk <span className="font-medium text-foreground">super_admin</span>.
                </p> */}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Status Invoice (Aggregate)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment</span>
                  {invoice.paymentStatus === 'campuran'
                    ? <Badge variant="outline">Campuran</Badge>
                    : <PaymentStatusChip status={invoice.paymentStatus} />
                  }
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refund Flag</span>
                  <span className="font-medium">{invoice.refundFlag ? 'Ya' : 'Tidak'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
