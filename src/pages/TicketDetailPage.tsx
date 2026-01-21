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
  dummyTickets,
  dummyAuditLogs,
  dummyRefunds,
  formatRupiah,
  formatDateTime,
  FEE_PRICING,
  DOMISILI_LABELS,
} from '@/data/dummyData';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  ZoomIn,
  QrCode,
  Clock,
  MapPin,
  Smartphone,
  User,
  Mail,
  Phone,
  FileText,
  Edit,
  DoorOpen,
  CreditCard,
  History,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const ticket = dummyTickets.find((t) => t.id === ticketId);
  const ticketLogs = dummyAuditLogs.filter((log) => log.entityId === ticketId);
  const ticketRefunds = dummyRefunds.filter((r) => r.ticketId === ticketId);

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Tiket Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground mb-4">ID: {ticketId}</p>
            <Link to="/tickets">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Ticket List
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminHeader
        title={`Ticket ${ticket.id}`}
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
            {ticket.needsApproval && ticket.approvalStatus === 'menunggu' && (
              <>
                <Button className="gap-2 bg-status-approved hover:bg-status-approved/90 text-white">
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button variant="outline" className="gap-2 border-status-rejected text-status-rejected">
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
                <Button variant="outline" className="gap-2 border-status-revision text-status-revision">
                  <RotateCcw className="w-4 h-4" />
                  Request Revision
                </Button>
              </>
            )}
            {ticket.paymentStatus === 'sudah_bayar' && ticket.gateStatus === 'belum_masuk' && (
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Initiate Refund
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
                  Summary
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
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tipe Booking</p>
                    <p className="text-sm font-medium capitalize">{ticket.bookingType}</p>
                  </div>
                </div>
                {ticket.approvedBy && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Approved By</p>
                    <p className="text-sm font-medium">
                      {ticket.approvedBy} • {formatDateTime(ticket.approvedAt!)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="documents">Dokumen</TabsTrigger>
                <TabsTrigger value="ocr">OCR Data</TabsTrigger>
                <TabsTrigger value="scan">Scan History</TabsTrigger>
                <TabsTrigger value="audit">Audit Log</TabsTrigger>
              </TabsList>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-4">
                <Card className="card-ocean">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Dokumen KTM</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="w-[200px] aspect-[3/4] bg-muted rounded-lg overflow-hidden relative group">
                        <img
                          src={ticket.ktmUrl}
                          alt="KTM Preview"
                          className="w-full h-full object-cover"
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
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-2">File Info</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nama File</span>
                            <span>ktm_upload.jpg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ukuran</span>
                            <span>1.2 MB</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Diupload</span>
                            <span>{formatDateTime(ticket.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* OCR Tab */}
              <TabsContent value="ocr" className="mt-4">
                <Card className="card-ocean">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">OCR Analysis</CardTitle>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="w-3.5 h-3.5" />
                        Override Manual
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Domisili Terdeteksi</p>
                        <p className="text-lg font-semibold text-foreground">
                          {DOMISILI_LABELS[ticket.domisiliOCR]}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-semibold text-foreground">{ticket.ocrConfidence}%</p>
                          <Badge
                            variant="outline"
                            className={cn(
                              ticket.ocrConfidence >= 90
                                ? 'border-status-approved text-status-approved'
                                : ticket.ocrConfidence >= 80
                                ? 'border-status-pending text-status-pending'
                                : 'border-status-rejected text-status-rejected'
                            )}
                          >
                            {ticket.ocrConfidence >= 90 ? 'High' : ticket.ocrConfidence >= 80 ? 'Medium' : 'Low'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-accent/30 rounded-lg border border-accent">
                      <p className="text-xs text-muted-foreground mb-2">Extracted Text</p>
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
              </TabsContent>

              {/* Scan History Tab */}
              <TabsContent value="scan" className="mt-4">
                <Card className="card-ocean">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Gate Scan History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticket.enteredAt || ticket.exitedAt ? (
                      <div className="space-y-4">
                        {ticket.enteredAt && (
                          <div className="flex items-center gap-4 p-3 bg-status-approved-bg rounded-lg">
                            <DoorOpen className="w-5 h-5 text-status-approved" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">Gate Masuk</p>
                              <p className="text-xs text-muted-foreground">{formatDateTime(ticket.enteredAt)}</p>
                            </div>
                            <Badge variant="outline">Main Gate</Badge>
                          </div>
                        )}
                        {ticket.exitedAt && (
                          <div className="flex items-center gap-4 p-3 bg-status-info-bg rounded-lg">
                            <DoorOpen className="w-5 h-5 text-status-info" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">Gate Keluar</p>
                              <p className="text-xs text-muted-foreground">{formatDateTime(ticket.exitedAt)}</p>
                            </div>
                            <Badge variant="outline">Main Gate</Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Belum ada aktivitas scan</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Audit Tab */}
              <TabsContent value="audit" className="mt-4">
                <Card className="card-ocean">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Audit Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ticketLogs.length > 0 ? (
                      <div className="space-y-4">
                        {ticketLogs.map((log) => (
                          <div key={log.id} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <History className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{log.actionType}</p>
                              <p className="text-xs text-muted-foreground">
                                by {log.adminUser} • {formatDateTime(log.timestamp)}
                              </p>
                              {log.note && (
                                <p className="text-xs text-muted-foreground mt-1 italic">"{log.note}"</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Tidak ada log untuk tiket ini</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Pricing, QR, Payment */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Pricing Breakdown</CardTitle>
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
                  {ticket.bookingType === 'group' && (
                    <>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Jumlah Domestik</span>
                        <span>{ticket.jumlahDomestik || 0} orang</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Jumlah Mancanegara</span>
                        <span>{ticket.jumlahMancanegara || 0} orang</span>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold text-primary">{formatRupiah(ticket.totalBiaya)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Status Card */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  QR Ticket
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
                      className={cn('w-20 h-20', ticket.qrActive ? 'text-foreground' : 'text-muted-foreground/30')}
                    />
                  </div>
                  <Badge variant={ticket.qrActive ? 'default' : 'secondary'} className="mb-2">
                    {ticket.qrActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {ticket.qrActive
                      ? 'QR dapat di-scan di gate'
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
                  Payment Info
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
                        Refund History
                      </h4>
                      <div className="space-y-2">
                        {ticketRefunds.map((refund) => (
                          <div key={refund.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs text-primary">{refund.id}</span>
                              <RefundStatusChip status={refund.status} />
                            </div>
                            <p className="text-sm font-medium">
                              {formatRupiah(refund.refundAmount)}{' '}
                              <span className="text-muted-foreground font-normal">({refund.type})</span>
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
    </AdminLayout>
  );
}
