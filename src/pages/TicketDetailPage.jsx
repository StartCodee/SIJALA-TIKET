import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import {
  ApprovalStatusChip,
  PaymentStatusChip,
  GateStatusChip,
  RealisasiStatusChip,
  RefundStatusChip,
} from '@/components/StatusChip';
import {
  getTicketById,
  saveTicketOverride,
  dummyRefunds,
  formatRupiah,
  formatDateTime,
  formatShortId,
  FEE_PRICING,
  DOMISILI_LABELS,
  REFUND_TYPE_LABELS,
  BOOKING_TYPE_LABELS,
} from '@/data/dummyData';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  ZoomIn,
  QrCode,
  CreditCard,
  AlertTriangle,
  FileText,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
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

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(() => (ticketId ? getTicketById(ticketId) : null));
  const ticketRefunds = dummyRefunds.filter((r) => r.ticketId === ticketId);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    namaLengkap: '',
    email: '',
    noHP: '',
    domisiliOCR: 'pbd',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_pbd',
    hargaPerOrang: 0,
    totalBiaya: 0,
    approvalStatus: 'menunggu',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
  });

  useEffect(() => {
    if (!ticketId) return;
    setTicket(getTicketById(ticketId));
  }, [ticketId]);

  const openEditDialog = () => {
    if (!ticket) return;
    setEditForm({
      namaLengkap: ticket.namaLengkap || '',
      email: ticket.email || '',
      noHP: ticket.noHP || '',
      domisiliOCR: ticket.domisiliOCR || 'pbd',
      bookingType: ticket.bookingType || 'perorangan',
      feeCategory: ticket.feeCategory || 'wisatawan_domestik_pbd',
      hargaPerOrang: ticket.hargaPerOrang || 0,
      totalBiaya: ticket.totalBiaya || 0,
      approvalStatus: ticket.approvalStatus || 'menunggu',
      paymentStatus: ticket.paymentStatus || 'belum_bayar',
      gateStatus: ticket.gateStatus || 'belum_masuk',
      realisasiStatus: ticket.realisasiStatus || 'belum_terealisasi',
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!ticket) return;
    saveTicketOverride(ticket.id, {
      namaLengkap: editForm.namaLengkap,
      email: editForm.email,
      noHP: editForm.noHP,
      domisiliOCR: editForm.domisiliOCR,
      bookingType: editForm.bookingType,
      feeCategory: editForm.feeCategory,
      hargaPerOrang: Number(editForm.hargaPerOrang || 0),
      totalBiaya: Number(editForm.totalBiaya || 0),
      approvalStatus: editForm.approvalStatus,
      paymentStatus: editForm.paymentStatus,
      gateStatus: editForm.gateStatus,
      realisasiStatus: editForm.realisasiStatus,
    });
    setTicket(getTicketById(ticket.id));
    setShowEditDialog(false);
  };

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Tiket Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground mb-4">
              ID: {ticketId ? formatShortId(ticketId) : '-'}
            </p>
            <Link to="/tickets">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Daftar Tiket
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const isGroupInvoice = ticket.bookingType === 'group';
  const pesertaTotal =
    (ticket.jumlahDomestik || 0) + (ticket.jumlahMancanegara || 0);

  // Revisi #1: tampilan tiket jadi perorangan
  const displayTotalBiaya = isGroupInvoice ? ticket.hargaPerOrang : ticket.totalBiaya;

  return (
    <AdminLayout>
      <AdminHeader
        title={`Tiket ${formatShortId(ticket.id)}`}
        subtitle={ticket.namaLengkap}
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/tickets">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Link to={`/invoices/${ticket.id}`}>
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Invoice
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={openEditDialog}>
              <Edit className="w-4 h-4" />
              Edit Tiket
            </Button>

            {ticket.needsApproval && ticket.approvalStatus === 'menunggu' && (
              <>
                <Button className="gap-2 bg-status-approved hover:bg-status-approved/90 text-white">
                  <CheckCircle className="w-4 h-4" />
                  Setujui
                </Button>
                <Button variant="outline" className="gap-2 border-status-rejected text-status-rejected">
                  <XCircle className="w-4 h-4" />
                  Tolak
                </Button>
              </>
            )}

            {ticket.paymentStatus === 'sudah_bayar' && ticket.gateStatus === 'belum_masuk' && (
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Mulai Pengembalian Dana
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Card */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  Ringkasan
                  <div className="flex items-center gap-2">
                    <ApprovalStatusChip status={ticket.approvalStatus} />
                    <PaymentStatusChip status={ticket.paymentStatus} />
                    <GateStatusChip status={ticket.gateStatus} />
                    <RealisasiStatusChip status={ticket.realisasiStatus} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nama Lengkap</p>
                    <p className="text-sm font-medium">{ticket.namaLengkap}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium">{ticket.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">No. HP</p>
                    <p className="text-sm font-medium">{ticket.noHP}</p>
                  </div>

                  {/* Revisi #1: selalu Perorangan */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tipe Pemesanan</p>
                    <p className="text-sm font-medium">Perorangan</p>
                    {isGroupInvoice && (
                      <Badge variant="secondary" className="mt-1">
                        Invoice Grup
                      </Badge>
                    )}
                  </div>
                </div>

                {ticket.approvedBy && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Disetujui Oleh</p>
                    <p className="text-sm font-medium">
                      {ticket.approvedBy} {formatDateTime(ticket.approvedAt)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dokumen KTP */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Dokumen KTP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full aspect-video max-h-[320px] bg-muted rounded-lg overflow-hidden relative group">
                  <img
                    src={ticket.ktmUrl}
                    alt="Pratinjau KTP"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hasil OCR */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Hasil OCR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Domisili</p>
                  <p className="text-base font-semibold text-foreground">
                    {DOMISILI_LABELS[ticket.domisiliOCR]}
                  </p>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg border border-accent">
                  <p className="text-xs text-muted-foreground mb-2">Teks Terdeteksi</p>
                  <p className="text-sm font-mono text-foreground">
                    NIK: 9201****00001234
                    <br />
                    Provinsi: Papua Barat Daya
                    <br />
                    Kabupaten: Raja Ampat
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pricing, QR, Payment */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Rincian Biaya</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kategori</span>
                    <span className="font-medium">{FEE_PRICING[ticket.feeCategory].label}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Harga/orang</span>
                    <span>{formatRupiah(ticket.hargaPerOrang)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {isGroupInvoice ? 'Total (per orang)' : 'Total'}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatRupiah(displayTotalBiaya)}
                    </span>
                  </div>

                  {isGroupInvoice && (
                    <p className="text-xs text-muted-foreground">
                      Invoice grup: {pesertaTotal || 0} orang Total invoice grup:{' '}
                      <span className="font-medium text-foreground">
                        {formatRupiah(ticket.totalBiaya)}
                      </span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* QR Status Card */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  QR Tiket
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div
                    className={cn(
                      'w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-3',
                      ticket.qrActive ? 'bg-muted' : 'bg-muted/50'
                    )}
                  >
                    <QrCode
                      className={cn(
                        'w-20 h-20',
                        ticket.qrActive ? 'text-foreground' : 'text-muted-foreground/30'
                      )}
                    />
                  </div>
                  <Badge variant={ticket.qrActive ? 'default' : 'secondary'} className="mb-2">
                    {ticket.qrActive ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {ticket.qrActive
                      ? 'QR dapat dipindai di gerbang'
                      : 'QR belum aktif. Selesaikan pembayaran.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Refund Card */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Info Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <PaymentStatusChip status={ticket.paymentStatus} />
                  </div>
                  {ticket.paidAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dibayar</span>
                      <span>{formatDateTime(ticket.paidAt)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Realisasi</span>
                    <RealisasiStatusChip status={ticket.realisasiStatus} />
                  </div>
                </div>

                {/* Refund Info */}
                {ticketRefunds.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Riwayat Pengembalian Dana
                      </h4>
                      <div className="space-y-2">
                        {ticketRefunds.map((refund) => (
                          <div key={refund.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs text-primary">
                                {formatShortId(refund.id)}
                              </span>
                              <RefundStatusChip status={refund.status} />
                            </div>
                            <p className="text-sm font-medium">
                              {formatRupiah(refund.refundAmount)}{' '}
                              <span className="text-muted-foreground font-normal">
                                ({REFUND_TYPE_LABELS[refund.type]})
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{refund.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tiket</DialogTitle>
            <DialogDescription>
              Perubahan tiket akan berdampak pada invoice terkait (jumlah tagihan).
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={editForm.namaLengkap}
                onChange={(e) => setEditForm((prev) => ({ ...prev, namaLengkap: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>No. HP</Label>
              <Input
                value={editForm.noHP}
                onChange={(e) => setEditForm((prev) => ({ ...prev, noHP: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Domisili</Label>
              <Select
                value={editForm.domisiliOCR}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, domisiliOCR: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(DOMISILI_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipe Pemesanan</Label>
              <Select
                value={editForm.bookingType}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, bookingType: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(BOOKING_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={editForm.feeCategory}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, feeCategory: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(FEE_PRICING).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Harga per Orang</Label>
              <Input
                type="number"
                value={editForm.hargaPerOrang}
                onChange={(e) => setEditForm((prev) => ({ ...prev, hargaPerOrang: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Biaya</Label>
              <Input
                type="number"
                value={editForm.totalBiaya}
                onChange={(e) => setEditForm((prev) => ({ ...prev, totalBiaya: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status Persetujuan</Label>
              <Select
                value={editForm.approvalStatus}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, approvalStatus: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="menunggu">Menunggu</SelectItem>
                  <SelectItem value="disetujui">Disetujui</SelectItem>
                  <SelectItem value="ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="unsuccessful">Unsuccessful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status Gerbang</Label>
              <Select
                value={editForm.gateStatus}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, gateStatus: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="belum_masuk">Belum Masuk</SelectItem>
                  <SelectItem value="masuk">Masuk</SelectItem>
                  <SelectItem value="keluar">Keluar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status Realisasi</Label>
              <Select
                value={editForm.realisasiStatus}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, realisasiStatus: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="belum_terealisasi">Belum Terealisasi</SelectItem>
                  <SelectItem value="sudah_terealisasi">Sudah Terealisasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Batal</Button>
            <Button className="btn-ocean" onClick={handleSaveEdit}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
