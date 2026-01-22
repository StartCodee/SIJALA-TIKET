import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { RefundStatusChip } from '@/components/StatusChip';
import {
  dummyRefunds,
  formatRupiah,
  formatDateTime,
  formatShortId,
  REFUND_TYPE_LABELS,
  type Refund,
} from '@/data/dummyData';
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RefundCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  // Filter refunds
  const filteredRefunds = dummyRefunds.filter((refund) => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.ticketName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = {
    menunggu: dummyRefunds.filter((r) => r.status === 'requested').length,
    diterima: dummyRefunds.filter((r) => r.status === 'completed').length,
    ditolak: dummyRefunds.filter((r) => r.status === 'rejected').length,
    totalRefunded: dummyRefunds
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.refundAmount, 0),
  };

  const refundsByStatus = {
    menunggu: filteredRefunds.filter((refund) => refund.status === 'requested'),
    diterima: filteredRefunds.filter((refund) => refund.status === 'completed'),
    ditolak: filteredRefunds.filter((refund) => refund.status === 'rejected'),
  };

  const handleApprove = (refundId: string) => {
    console.log(`Aksi: terima pengembalian ${refundId}`);
  };

  const handleReject = (refundId: string) => {
    console.log(`Aksi: tolak pengembalian ${refundId}`);
  };

  const renderTable = (refunds: Refund[], showActions: boolean) => {
    return (
      <Card className="card-ocean overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Pengembalian</th>
                <th>ID Tiket</th>
                <th>Nama</th>
                <th>Status</th>
                <th>Diajukan</th>
                {showActions && (
                  <th className="text-center">
                    <div className="flex items-center justify-center">Aksi</div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund) => (
                <tr key={refund.id}>
                  <td>
                    <button
                      onClick={() => openDetail(refund)}
                      className="font-mono text-sm font-medium text-primary hover:underline"
                    >
                      {formatShortId(refund.id)}
                    </button>
                  </td>
                  <td>
                    <Link
                      to={`/tickets/${refund.ticketId}`}
                      className="font-mono text-sm text-muted-foreground hover:text-primary hover:underline"
                    >
                      {formatShortId(refund.ticketId)}
                    </Link>
                  </td>
                  <td className="text-sm">{refund.ticketName}</td>
                  <td>
                    <RefundStatusChip status={refund.status} />
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {formatDateTime(refund.requestedAt)}
                  </td>
                  {showActions && (
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleApprove(refund.id)}
                          size="sm"
                          className="gap-2 bg-status-approved hover:bg-status-approved/90 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Diterima
                        </Button>
                        <Button
                          onClick={() => handleReject(refund.id)}
                          size="sm"
                          variant="outline"
                          className="gap-2 border-status-rejected text-status-rejected hover:bg-status-rejected-bg"
                        >
                          <XCircle className="w-4 h-4" />
                          Ditolak
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  const openDetail = (refund: Refund) => {
    setSelectedRefund(refund);
    setShowDetailDialog(true);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Pengembalian Dana"
        subtitle="Kelola permintaan pengembalian dana tiket"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-pending-bg">
                <Clock className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.menunggu}</p>
                <p className="text-xs text-muted-foreground">Menunggu</p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-approved-bg">
                <CheckCircle className="w-5 h-5 text-status-approved" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.diterima}</p>
                <p className="text-xs text-muted-foreground">Diterima</p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-rejected-bg">
                <XCircle className="w-5 h-5 text-status-rejected" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.ditolak}</p>
                <p className="text-xs text-muted-foreground">Ditolak</p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatRupiah(stats.totalRefunded)}</p>
                <p className="text-xs text-muted-foreground">Total Dikembalikan</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Pengembalian, ID Tiket, atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Ekspor
          </Button>
        </div>

        <Tabs defaultValue="menunggu" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="menunggu" className="gap-2">
              <Clock className="w-4 h-4" />
              Menunggu ({refundsByStatus.menunggu.length})
            </TabsTrigger>
            <TabsTrigger value="diterima" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Diterima ({refundsByStatus.diterima.length})
            </TabsTrigger>
            <TabsTrigger value="ditolak" className="gap-2">
              <XCircle className="w-4 h-4" />
              Ditolak ({refundsByStatus.ditolak.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menunggu">
            {renderTable(refundsByStatus.menunggu, true)}
          </TabsContent>
          <TabsContent value="diterima">
            {renderTable(refundsByStatus.diterima, false)}
          </TabsContent>
          <TabsContent value="ditolak">
            {renderTable(refundsByStatus.ditolak, false)}
          </TabsContent>
        </Tabs>
      </div>

      {/* Refund Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-card border-border max-w-2xl">
          {selectedRefund && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">{formatShortId(selectedRefund.id)}</span>
                  <RefundStatusChip status={selectedRefund.status} />
                </DialogTitle>
                <DialogDescription>Detail permintaan pengembalian dana</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID Tiket</p>
                  <p className="text-sm font-medium">{formatShortId(selectedRefund.ticketId)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nama</p>
                  <p className="text-sm font-medium">{selectedRefund.ticketName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nominal Awal</p>
                  <p className="text-sm font-medium">{formatRupiah(selectedRefund.originalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nominal Pengembalian</p>
                  <p className="text-lg font-bold text-primary">
                    {formatRupiah(selectedRefund.refundAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tipe</p>
                  <Badge variant="outline" className="capitalize">
                    {REFUND_TYPE_LABELS[selectedRefund.type]}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Diajukan Pada</p>
                  <p className="text-sm">{formatDateTime(selectedRefund.requestedAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Alasan</p>
                  <p className="text-sm p-3 bg-muted/50 rounded-lg">{selectedRefund.reason}</p>
                </div>
                {selectedRefund.referenceNumber && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Nomor Referensi</p>
                    <p className="text-sm font-mono">{selectedRefund.referenceNumber}</p>
                  </div>
                )}
                {selectedRefund.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Catatan Internal</p>
                    <p className="text-sm p-3 bg-muted/50 rounded-lg italic">{selectedRefund.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Form for Processing */}
              {selectedRefund.status === 'processing' && (
                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="text-sm font-semibold">Selesaikan Pengembalian</h4>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Nomor Referensi</label>
                    <Input
                      placeholder="TRF-YYYYMMDD-XXX"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Unggah Bukti Transfer</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Klik atau tarik file</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Catatan</label>
                    <Textarea
                      placeholder="Catatan internal..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                  Tutup
                </Button>
                {selectedRefund.status === 'processing' && (
                  <Button className="bg-status-approved hover:bg-status-approved/90 text-white gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Selesaikan Pengembalian
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
