import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import {
  ApprovalStatusChip,
  PaymentStatusChip,
  GateStatusChip,
  RealisasiStatusChip,
} from '@/components/StatusChip';
import {
  dummyTickets,
  formatRupiah,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
  DOMISILI_LABELS,
  type Ticket,
} from '@/data/dummyData';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TicketListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [gateFilter, setGateFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(true);
  const [sortField, setSortField] = useState<keyof Ticket>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Filter tickets
  const filteredTickets = dummyTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApproval = approvalFilter === 'all' || ticket.approvalStatus === approvalFilter;
    const matchesPayment = paymentFilter === 'all' || ticket.paymentStatus === paymentFilter;
    const matchesGate = gateFilter === 'all' || ticket.gateStatus === gateFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.feeCategory === categoryFilter;
    return matchesSearch && matchesApproval && matchesPayment && matchesGate && matchesCategory;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const handleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: keyof Ticket }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" />
    );
  };
  return (
    <AdminLayout>
      <AdminHeader 
        title="Daftar Tiket" 
        subtitle="Data master semua tiket biaya konservasi"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Search & Actions Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Tiket, nama, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
            {showFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Ekspor
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-4 card-ocean animate-fade-in">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status Persetujuan
                  </label>
                  <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="menunggu">Menunggu</SelectItem>
                      <SelectItem value="disetujui">Disetujui</SelectItem>
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status Pembayaran
                  </label>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                      <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                      <SelectItem value="refund_diproses">Pengembalian Diproses</SelectItem>
                      <SelectItem value="refund_selesai">Pengembalian Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status Gerbang
                  </label>
                  <Select value={gateFilter} onValueChange={setGateFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="belum_masuk">Belum Masuk</SelectItem>
                      <SelectItem value="masuk">Masuk</SelectItem>
                      <SelectItem value="keluar">Keluar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Kategori Biaya
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      {Object.entries(FEE_PRICING).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setApprovalFilter('all');
                      setPaymentFilter('all');
                      setGateFilter('all');
                      setCategoryFilter('all');
                    }}
                    className="text-xs"
                  >
                    Atur Ulang Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-medium text-foreground">{sortedTickets.length}</span> dari{' '}
            <span className="font-medium text-foreground">{dummyTickets.length}</span> tiket
          </p>
        </div>

        {/* Table */}
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th 
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center gap-1">
                      ID Tiket <SortIcon field="id" />
                    </div>
                  </th>
                  <th>Tipe</th>
                  <th>Domisili</th>
                  <th className="text-right">Total Biaya</th>
                  <th>Persetujuan</th>
                  <th>Pembayaran</th>
                  <th>Gerbang</th>
                  <th>Realisasi</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.map((ticket) => (
                  <tr key={ticket.id} className="group">
                    <td className="whitespace-nowrap">
                      <Link 
                        to={`/tickets/${ticket.id}`}
                        className="font-mono text-sm font-medium text-primary hover:underline whitespace-nowrap"
                      >
                        {formatShortId(ticket.id)}
                      </Link>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {ticket.bookingType === 'group' ? (
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className="text-sm">{BOOKING_TYPE_LABELS[ticket.bookingType]}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">{DOMISILI_LABELS[ticket.domisiliOCR]}</span>
                    </td>
                    <td className="text-right">
                      <span className="font-medium text-sm">{formatRupiah(ticket.totalBiaya)}</span>
                    </td>
                    <td>
                      <ApprovalStatusChip status={ticket.approvalStatus} />
                    </td>
                    <td>
                      <PaymentStatusChip status={ticket.paymentStatus} />
                    </td>
                    <td>
                      <GateStatusChip status={ticket.gateStatus} />
                    </td>
                    <td>
                      <RealisasiStatusChip status={ticket.realisasiStatus} />
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/tickets/${ticket.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
