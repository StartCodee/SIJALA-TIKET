import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Search, Filter, Download, ChevronDown, ChevronUp, Eye, Printer } from 'lucide-react';

import { dummyInvoices, formatDateTime, formatRupiah } from '@/data/dummyData';
import { buildInvoicesFromLines } from '@/features/invoices/invoiceUtils';
import { exportCSV } from '@/lib/exporters';
import { getUserRole, isAdministrator } from '@/lib/rbac';
import { PaymentStatusChip } from '@/components/StatusChip';

export default function InvoiceListPage() {
  const role = getUserRole();
  const canExport = isAdministrator(role);

  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [typeFilter, setTypeFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [refundFilter, setRefundFilter] = useState('all');

  const invoices = useMemo(() => buildInvoicesFromLines(dummyInvoices), []);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return invoices.filter((inv) => {
      const matchesSearch =
        !q ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.invoiceId.toLowerCase().includes(q) ||
        inv.billedTo.name.toLowerCase().includes(q) ||
        inv.billedTo.email.toLowerCase().includes(q);

      const matchesType = typeFilter === 'all' || inv.invoiceType === typeFilter;
      const matchesPayment = paymentFilter === 'all' || inv.paymentStatus === paymentFilter;
      const matchesMethod = methodFilter === 'all' || inv.method === methodFilter;
      const matchesRefund =
        refundFilter === 'all' ||
        (refundFilter === 'yes' ? inv.refundFlag : !inv.refundFlag);

      return matchesSearch && matchesType && matchesPayment && matchesMethod && matchesRefund;
    });
  }, [invoices, searchQuery, typeFilter, paymentFilter, methodFilter, refundFilter]);

  const stats = useMemo(() => {
    const total = filtered.reduce((acc, i) => acc + i.grandTotal, 0);
    const groupCount = filtered.filter((i) => i.invoiceType === 'group').length;
    return { total, count: filtered.length, groupCount };
  }, [filtered]);

  const handleExport = () => {
    if (!canExport) return;

    exportCSV(
      filtered.map((i) => ({
        invoice_id: i.invoiceId,
        invoice_no: i.invoiceNo,
        invoice_type: i.invoiceType,
        issued_at: i.issuedAt,
        billed_name: i.billedTo.name,
        billed_email: i.billedTo.email,
        ticket_count: i.ticketCount,
        payment_status: i.paymentStatus,
        method: i.method,
        refund_flag: i.refundFlag ? 'yes' : 'no',
        total: i.grandTotal,
      })),
      `invoice_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Invoice"
        // subtitle="Invoice dapat berisi banyak tiket (Group) atau 1 tiket (Perorangan)"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari invoice, nama, email..."
              className="pl-9 bg-card"
            />
          </div>

          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowFilters((s) => !s)}>
            <Filter className="w-4 h-4" />
            Filter
            {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleExport}
            disabled={!canExport}
            title={!canExport ? 'Hanya super_admin yang bisa export' : 'Export CSV'}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {showFilters && (
          <Card className="card-ocean animate-fade-in">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipe Invoice</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="perorangan">Perorangan</SelectItem>
                      <SelectItem value="group">Grup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Payment Status</label>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                      <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                      <SelectItem value="refund_diproses">Refund Diproses</SelectItem>
                      <SelectItem value="refund_selesai">Refund Selesai</SelectItem>
                      <SelectItem value="campuran">Campuran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Metode</label>
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="qris">QRIS</SelectItem>
                      <SelectItem value="e_wallet">E-Wallet</SelectItem>
                      <SelectItem value="campuran">Campuran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Refund</label>
                  <Select value={refundFilter} onValueChange={setRefundFilter}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="no">Tidak</SelectItem>
                      <SelectItem value="yes">Ya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setTypeFilter('all');
                      setPaymentFilter('all');
                      setMethodFilter('all');
                      setRefundFilter('all');
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* {!canExport && (
                <p className="text-xs text-muted-foreground mt-3">
                  Role kamu: <span className="font-medium text-foreground">{role}</span>. Export hanya untuk <span className="font-medium text-foreground">super_admin</span>.
                </p>
              )} */}
            </CardContent>
          </Card>
        )}

        <Card className="card-ocean">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge variant="secondary">Invoice: {stats.count}</Badge>
              <Badge variant="secondary">Invoice Grup: {stats.groupCount}</Badge>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-primary">{formatRupiah(stats.total)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Invoice</th>
                  <th>Tipe</th>
                  <th>Tanggal</th>
                  <th>Pelanggan</th>
                  <th className="text-right">Jumlah Tiket</th>
                  <th>Pembayaran</th>
                  <th className="text-right">Total</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.invoiceId}>
                    <td className="whitespace-nowrap font-mono text-sm font-medium text-primary">
                      {inv.invoiceNo}
                    </td>
                    <td>
                      <Badge variant="secondary">
                        {inv.invoiceType === 'group' ? 'Grup' : 'Perorangan'}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap text-sm">{formatDateTime(inv.issuedAt)}</td>
                    <td>
                      <div>
                        <p className="text-sm font-medium">{inv.billedTo.name}</p>
                        <p className="text-xs text-muted-foreground">{inv.billedTo.email}</p>
                      </div>
                    </td>
                    <td className="text-right text-sm font-medium">{inv.ticketCount}</td>
                    <td>
                      {inv.paymentStatus === 'campuran'
                        ? <Badge variant="outline">Campuran</Badge>
                        : <PaymentStatusChip status={inv.paymentStatus} />
                      }
                    </td>
                    <td className="text-right text-sm font-semibold">{formatRupiah(inv.grandTotal)}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/invoices/${inv.invoiceId}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Detail Invoice">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link to={`/invoices/${inv.invoiceId}?print=1`} target="_blank" rel="noreferrer">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Cetak Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-sm text-muted-foreground">
                      Tidak ada invoice yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
