import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { ApprovalStatusChip } from '@/components/StatusChip';
import {
  getAllTickets,
  saveTicketOverride,
  getInvoiceIdForTicket,
  formatRupiah,
  formatDateTime,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
} from '@/data/dummyData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const TAB_KEYS = ['menunggu', 'disetujui', 'ditolak'];

const getInitialTab = (search) => {
  const tab = new URLSearchParams(search).get('tab');
  return TAB_KEYS.includes(tab) ? tab : 'menunggu';
};

export default function ApprovalQueuePage() {
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(getInitialTab(location.search));
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectTicketId, setRejectTicketId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    setActiveTab(getInitialTab(location.search));
  }, [location.search]);

  const approvalTickets = useMemo(
    () => getAllTickets().filter((ticket) => ticket.needsApproval),
    [refreshKey],
  );

  const ticketsByStatus = useMemo(
    () => ({
      menunggu: approvalTickets.filter((ticket) => ticket.approvalStatus === 'menunggu'),
      disetujui: approvalTickets.filter((ticket) => ticket.approvalStatus === 'disetujui'),
      ditolak: approvalTickets.filter((ticket) => ticket.approvalStatus === 'ditolak'),
    }),
    [approvalTickets],
  );

  const getDetailLink = (ticket) => {
    const invoiceId = getInvoiceIdForTicket(ticket.id);
    if (!invoiceId) return `/invoices`;

    const params = new URLSearchParams({
      from: 'approval',
      tab: activeTab,
      ticketId: ticket.id,
    });
    if (ticket.approvalStatus === 'menunggu') {
      params.set('approval', 'pending');
    }
    return `/invoices/${invoiceId}?${params.toString()}`;
  };

  const handleApprove = (ticketId) => {
    const now = new Date().toISOString();
    saveTicketOverride(ticketId, {
      approvalStatus: 'disetujui',
      approvedBy: 'Admin Tiket',
      approvedAt: now,
      lastActionBy: 'Admin Tiket',
      lastActionAt: now,
    });
    setRefreshKey((prev) => prev + 1);
  };

  const handleReject = (ticketId) => {
    setRejectTicketId(ticketId);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectTicketId) return;
    const now = new Date().toISOString();
    saveTicketOverride(rejectTicketId, {
      approvalStatus: 'ditolak',
      rejectionReason: rejectNotes.trim(),
      approvedBy: 'Admin Tiket',
      approvedAt: now,
      lastActionBy: 'Admin Tiket',
      lastActionAt: now,
    });
    setShowRejectDialog(false);
    setRejectTicketId(null);
    setRejectNotes('');
    setRefreshKey((prev) => prev + 1);
  };

  const renderTicketList = (tickets, showActions) => {
    if (!tickets.length) {
      return (
        <Card className="card-ocean">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle className="w-16 h-16 text-status-approved/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">Belum Ada Data</h3>
            <p className="text-sm text-muted-foreground">Tidak ada tiket pada status ini.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="card-ocean overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        to={getDetailLink(ticket)}
                        className="font-mono text-lg font-semibold text-primary hover:underline"
                      >
                        {formatShortId(ticket.id)}
                      </Link>
                      <ApprovalStatusChip status={ticket.approvalStatus} />
                      {showActions && ticket.needsApproval && (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-status-pending text-status-pending"
                        >
                          Butuh Persetujuan
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-foreground">{ticket.namaLengkap}</h3>
                    <p className="text-sm text-muted-foreground">{ticket.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{formatRupiah(ticket.totalBiaya)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Dibuat {formatDateTime(ticket.createdAt)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-start">
                  <div className="grid flex-1 grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                      <p className="text-sm font-medium">{FEE_PRICING[ticket.feeCategory]?.label || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Negara</p>
                      <p className="text-sm font-medium">{ticket.countryOCR || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Tipe</p>
                      <p className="text-sm font-medium">{BOOKING_TYPE_LABELS[ticket.bookingType]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">No. HP</p>
                      <p className="text-sm font-medium">{ticket.noHP}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  {showActions && (
                    <>
                      <Button
                        onClick={() => handleApprove(ticket.id)}
                        className="gap-2 bg-status-approved hover:bg-status-approved/90 text-white"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Setujui
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleReject(ticket.id)}
                        className="gap-2 border-status-rejected text-status-rejected hover:bg-status-rejected-bg"
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </Button>
                    </>
                  )}

                  {!showActions && ticket.approvalStatus === 'ditolak' && (
                    <div className="max-w-[420px] rounded-lg border border-status-rejected/20 bg-status-rejected-bg px-4 py-3">
                      <p className="text-xs font-medium text-status-rejected mb-1">Alasan Ditolak</p>
                      <p className="text-sm text-status-rejected">
                        {ticket.rejectionReason || 'Tidak ada catatan.'}
                      </p>
                    </div>
                  )}

                  <div className="flex-1" />
                  <Link to={getDetailLink(ticket)}>
                    <Button variant="ghost" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Antrian Persetujuan"
        subtitle="Tiket yang membutuhkan persetujuan Admin Tiket"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="menunggu" className="gap-2">
              <Clock className="w-4 h-4" />
              Menunggu ({ticketsByStatus.menunggu.length})
            </TabsTrigger>
            <TabsTrigger value="disetujui" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Diterima ({ticketsByStatus.disetujui.length})
            </TabsTrigger>
            <TabsTrigger value="ditolak" className="gap-2">
              <XCircle className="w-4 h-4" />
              Ditolak ({ticketsByStatus.ditolak.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menunggu">{renderTicketList(ticketsByStatus.menunggu, true)}</TabsContent>
          <TabsContent value="disetujui">{renderTicketList(ticketsByStatus.disetujui, false)}</TabsContent>
          <TabsContent value="ditolak">{renderTicketList(ticketsByStatus.ditolak, false)}</TabsContent>
        </Tabs>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-status-rejected" />
              Tolak Tiket
            </DialogTitle>
            <DialogDescription>Berikan alasan penolakan untuk tiket ini.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Alasan Penolakan</label>
            <Textarea
              placeholder="Tambahkan alasan penolakan..."
              value={rejectNotes}
              onChange={(event) => setRejectNotes(event.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Batal
            </Button>
            <Button
              onClick={confirmReject}
              className="bg-status-rejected hover:bg-status-rejected/90 text-white"
            >
              Tolak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
