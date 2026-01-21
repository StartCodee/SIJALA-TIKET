import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { PaymentStatusChip, RealisasiStatusChip } from '@/components/StatusChip';
import {
  dummyInvoices,
  formatRupiah,
  formatDateTime,
} from '@/data/dummyData';
import {
  Search,
  Download,
  Filter,
  CreditCard,
  Building,
  Smartphone,
  QrCode,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const methodIcons: Record<string, typeof CreditCard> = {
  bank_transfer: Building,
  credit_card: CreditCard,
  qris: QrCode,
  e_wallet: Smartphone,
};

const methodLabels: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  qris: 'QRIS',
  e_wallet: 'E-Wallet',
};

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  // Filter invoices
  const filteredInvoices = dummyInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
    const matchesMethod = methodFilter === 'all' || invoice.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Stats
  const totalPaid = dummyInvoices
    .filter((i) => i.paymentStatus === 'sudah_bayar')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalRealized = dummyInvoices
    .filter((i) => i.realisasiStatus === 'sudah_terealisasi')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <AdminLayout>
      <AdminHeader
        title="Payments & Invoices"
        subtitle="Kelola pembayaran dan invoice tiket"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-ocean p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Invoices</p>
            <p className="text-2xl font-bold">{dummyInvoices.length}</p>
          </Card>
          <Card className="card-ocean p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
            <p className="text-xl font-bold text-status-approved">{formatRupiah(totalPaid)}</p>
          </Card>
          <Card className="card-ocean p-4">
            <p className="text-xs text-muted-foreground mb-1">Total Realized</p>
            <p className="text-xl font-bold text-primary">{formatRupiah(totalRealized)}</p>
          </Card>
          <Card className="card-ocean p-4">
            <p className="text-xs text-muted-foreground mb-1">Refund Flags</p>
            <p className="text-2xl font-bold text-status-revision">
              {dummyInvoices.filter((i) => i.refundFlag).length}
            </p>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari Invoice ID atau Ticket ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
              <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
              <SelectItem value="refund_diproses">Refund Diproses</SelectItem>
              <SelectItem value="refund_selesai">Refund Selesai</SelectItem>
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[150px] bg-card">
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua Method</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="qris">QRIS</SelectItem>
              <SelectItem value="e_wallet">E-Wallet</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Table */}
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Ticket ID</th>
                  <th className="text-right">Amount</th>
                  <th>Method</th>
                  <th>Paid At</th>
                  <th>Payment Status</th>
                  <th>Realisasi</th>
                  <th>Refund</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => {
                  const MethodIcon = methodIcons[invoice.method] || CreditCard;
                  return (
                    <tr key={invoice.id}>
                      <td>
                        <span className="font-mono text-sm font-medium">{invoice.id}</span>
                      </td>
                      <td>
                        <Link
                          to={`/tickets/${invoice.ticketId}`}
                          className="font-mono text-sm text-primary hover:underline"
                        >
                          {invoice.ticketId}
                        </Link>
                      </td>
                      <td className="text-right">
                        <span className="text-sm font-semibold">{formatRupiah(invoice.amount)}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{methodLabels[invoice.method]}</span>
                        </div>
                      </td>
                      <td className="text-sm text-muted-foreground">
                        {invoice.paidAt ? formatDateTime(invoice.paidAt) : '-'}
                      </td>
                      <td>
                        <PaymentStatusChip status={invoice.paymentStatus} />
                      </td>
                      <td>
                        <RealisasiStatusChip status={invoice.realisasiStatus} />
                      </td>
                      <td>
                        {invoice.refundFlag ? (
                          <Badge variant="outline" className="text-status-revision border-status-revision">
                            Has Refund
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
