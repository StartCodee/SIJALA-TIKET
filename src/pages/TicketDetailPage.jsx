import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import {
  RefundStatusChip,
} from "@/components/StatusChip";
import {
  getTicketById,
  getInvoiceIdForTicket,
  saveTicketOverride,
  dummyRefunds,
  dummyAdminUsers,
  formatRupiah,
  formatShortId,
  FEE_PRICING,
  DOMISILI_LABELS,
  REFUND_TYPE_LABELS,
} from "@/data/dummyData";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getIdentityTypeLabel,
  getTicketIdentityNumber,
  getTicketIdentityType,
} from "@/features/visitors/visitorUtils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const location = useLocation();
  const [ticket, setTicket] = useState(() =>
    ticketId ? getTicketById(ticketId) : null,
  );
  const ticketRefunds = dummyRefunds.filter((r) => r.ticketId === ticketId);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    namaLengkap: "",
    email: "",
    noHP: "",
    countryOCR: "Indonesia",
  });
  useEffect(() => {
    if (!ticketId) return;
    setTicket(getTicketById(ticketId));
  }, [ticketId]);
  const getDefaultGateOfficerName = (ticketData) => {
    if (ticketData?.operatorType === "doku") {
      return "DOKU";
    }
    if (
      ticketData?.lastActionBy &&
      ticketData.lastActionBy !== "Pemindai Gerbang" &&
      ticketData.lastActionBy !== "Sistem"
    ) {
      return ticketData.lastActionBy;
    }
    const petugasByOperator = {
      loket: "Bambang Susilo",
      qris: "Dewi Anggraini",
      transfer: "Rudi Hartono",
      doku: "DOKU",
    };
    return petugasByOperator[ticketData?.operatorType] || "Bambang Susilo";
  };
  const openEditDialog = () => {
    if (!ticket) return;
    setEditForm({
      namaLengkap: ticket.namaLengkap || "",
      email: ticket.email || "",
      noHP: ticket.noHP || "",
      countryOCR:
        ticket.countryOCR ||
        (ticket.domisiliOCR === "mancanegara" ? "Mancanegara" : "Indonesia"),
    });
    setShowEditDialog(true);
  };
  const handleSaveEdit = () => {
    if (!ticket) return;
    saveTicketOverride(ticket.id, {
      namaLengkap: editForm.namaLengkap,
      email: editForm.email,
      noHP: editForm.noHP,
      countryOCR: editForm.countryOCR,
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
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Tiket Tidak Ditemukan
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              ID: {ticketId ? formatShortId(ticketId) : "-"}
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
  const isGroupInvoice = ticket.bookingType === "group";
  const pesertaTotal =
    (ticket.jumlahDomestik || 0) + (ticket.jumlahMancanegara || 0);
  const invoiceId = getInvoiceIdForTicket(ticket.id);
  const hasInvoice =
    typeof ticket.invoiceAvailable === "boolean"
      ? ticket.invoiceAvailable
      : Boolean(invoiceId);
  const hasEnteredTicket = ["masuk", "keluar"].includes(ticket.gateStatus);
  const paidStatuses = [
    "sudah_bayar",
    "refund_diajukan",
    "refund_diproses",
    "refund_selesai",
  ];
  const isPaid = hasEnteredTicket || paidStatuses.includes(ticket.paymentStatus);
  const hasPaymentProof =
    typeof ticket.paymentProofAvailable === "boolean"
      ? ticket.paymentProofAvailable
      : hasEnteredTicket || Boolean(ticket.paidAt);
  const latestRefund = [...ticketRefunds].sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  )[0];
  const manualRefundApproval = ticket.refundApprovalStatus;
  const isRefundApproved =
    manualRefundApproval === "disetujui" ||
    (manualRefundApproval !== "tidak_disetujui" &&
      (hasEnteredTicket ||
        ticket.approvalStatus === "disetujui" ||
        latestRefund?.status === "completed"));
  const hasRefundProof = Boolean(
    latestRefund?.proofUrl ||
      latestRefund?.referenceNumber ||
      latestRefund?.completedAt ||
      latestRefund?.processedAt,
  );
  const getRefundApprovedByLabel = (refund) => {
    const approver = dummyAdminUsers.find(
      (admin) =>
        admin.name === refund.processedBy &&
        (admin.role === "admin_utama" || admin.role === "admin_tiket"),
    );
    if (approver) {
      const roleLabel = approver.role === "admin_utama" ? "Admin Utama" : "Admin Tiket";
      return `${approver.name} (${roleLabel})`;
    }
    if (refund.status === "requested") {
      return "Menunggu Persetujuan";
    }
    return "-";
  };
  const bookingTypeLabel = ticket.bookingType === "group" ? "Grup" : "Individu";
  const identityType = getTicketIdentityType(ticket);
  const identityLabel = getIdentityTypeLabel(identityType);
  const identityNumber = getTicketIdentityNumber(ticket);
  const isOnlinePayment = ticket.operatorType === "doku";
  const petugasTiketName = ticket.gateOfficerName || getDefaultGateOfficerName(ticket);
  const gerbangValue = isOnlinePayment ? "DOKU" : petugasTiketName;
  const getRequiredDocumentKeys = (feeCategory) => {
    if (feeCategory === "mooring") {
      return ["foto_diri", "dokumen_identitas", "foto_kapal"];
    }
    if (feeCategory === "sport_fishing") {
      return ["foto_diri", "dokumen_identitas", "foto_kapal"];
    }
    if (String(feeCategory).startsWith("peneliti_")) {
      return [
        "foto_diri",
        "dokumen_identitas",
        "surat_izin_penelitian",
        "surat_permohonan_penelitian",
      ];
    }
    return ["foto_diri", "dokumen_identitas"];
  };
  const documentMetaByKey = {
    foto_diri: {
      label: "Foto Diri",
      url: ticket.selfieUrl || "/placeholder.svg",
    },
    dokumen_identitas: {
      label: "KTP/SIM/PASPOR/KITAS/KITAP",
      url: ticket.identityDocumentUrl || ticket.ktmUrl || "/placeholder.svg",
    },
    surat_izin_penelitian: {
      label: "Surat Ijin Penelitian (Institusi Indonesia)",
      url: ticket.researchPermitUrl || "/placeholder.svg",
    },
    surat_permohonan_penelitian: {
      label: "Surat Permohonan Resmi Penelitian",
      url: ticket.researchRequestLetterUrl || "/placeholder.svg",
    },
    foto_kapal: {
      label: "Foto Kapal",
      url: ticket.boatPhotoUrl || "/placeholder.svg",
    },
  };
  const supportingDocuments = getRequiredDocumentKeys(ticket.feeCategory)
    .map((key) => ({
      key,
      ...(documentMetaByKey[key] || {}),
    }))
    .filter((doc) => doc.label);

  const displayTotalBiaya = isGroupInvoice
    ? ticket.hargaPerOrang
    : ticket.totalBiaya;
  const searchParams = new URLSearchParams(location.search);
  const fromInvoiceId = searchParams.get("invoiceId");
  const backHref =
    searchParams.get("from") === "invoice" && fromInvoiceId
      ? `/invoices/${encodeURIComponent(fromInvoiceId)}`
      : "/tickets";
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
          <Link to={backHref}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {invoiceId ? (
              <Link to={`/invoices/${invoiceId}`}>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Invoice
                </Button>
              </Link>
            ) : (
              <Button variant="outline" className="gap-2" disabled>
                <FileText className="w-4 h-4" />
                Invoice
              </Button>
            )}
            <Button
              variant="outline"
              className="gap-2"
              onClick={openEditDialog}
            >
              <Edit className="w-4 h-4" />
              Edit Tiket
            </Button>

            {ticket.needsApproval && ticket.approvalStatus === "menunggu" && (
              <>
                <Button className="gap-2 bg-status-approved hover:bg-status-approved/90 text-white">
                  <CheckCircle className="w-4 h-4" />
                  Setujui
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-status-rejected text-status-rejected"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak
                </Button>
              </>
            )}

            {ticket.paymentStatus === "sudah_bayar" &&
              ticket.gateStatus === "belum_masuk" && (
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
                <CardTitle className="text-base font-semibold">Ringkasan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Nama Lengkap
                    </p>
                    <p className="text-sm font-medium break-words">
                      {ticket.namaLengkap}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium break-words">
                      {ticket.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">No. HP</p>
                    <p className="text-sm font-medium break-words">
                      {ticket.noHP}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Tipe Pemesanan
                    </p>
                    <p className="text-sm font-medium">{bookingTypeLabel}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Gerbang</p>
                  <p className="text-sm font-medium">{gerbangValue}</p>
                </div>
              </CardContent>
            </Card>

            {/* Dokumen Pendukung */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Dokumen Pendukung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  Dokumen wajib berdasarkan kategori:{" "}
                  <span className="font-medium text-foreground">
                    {FEE_PRICING[ticket.feeCategory]?.label || "-"}
                  </span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportingDocuments.map((doc) => (
                    <div key={doc.key} className="space-y-2">
                      <p className="text-xs font-medium text-foreground">{doc.label}</p>
                      <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative group">
                        <img
                          src={doc.url || "/placeholder.svg"}
                          alt={`Pratinjau ${doc.label}`}
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
                    </div>
                  ))}
                  {!supportingDocuments.length && (
                    <div className="col-span-full p-4 rounded-lg border border-border bg-muted/40 text-sm text-muted-foreground">
                      Dokumen pendukung belum tersedia untuk kategori ini.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hasil OCR */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">
                  Hasil OCR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Domisili</p>
                  <p className="text-base font-semibold text-foreground">
                    {DOMISILI_LABELS[ticket.domisiliOCR]}
                  </p>
                </div>
                <div className="p-4 bg-accent/30 rounded-lg border border-accent">
                  <p className="text-xs text-muted-foreground mb-2">
                    Teks Terdeteksi
                  </p>
                  <p className="text-sm font-mono text-foreground">
                    {identityLabel}: {identityNumber}
                    <br />
                    Domisili: {DOMISILI_LABELS[ticket.domisiliOCR] || "-"}
                    <br />
                    Negara: {ticket.countryOCR || "-"}
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
                <CardTitle className="text-base font-semibold">
                  Rincian Biaya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kategori</span>
                    <span className="font-medium">
                      {FEE_PRICING[ticket.feeCategory].label}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Harga/orang</span>
                    <span>{formatRupiah(ticket.hargaPerOrang)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {isGroupInvoice ? "Total (per orang)" : "Total"}
                    </span>
                    <span className="text-xl font-bold text-primary">
                      {formatRupiah(displayTotalBiaya)}
                    </span>
                  </div>

                  {isGroupInvoice && (
                    <p className="text-xs text-muted-foreground">
                      Invoice grup: {pesertaTotal || 0} orang Total invoice
                      grup:{" "}
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
                      "w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-3",
                      ticket.qrActive ? "bg-muted" : "bg-muted/50",
                    )}
                  >
                    <QrCode
                      className={cn(
                        "w-20 h-20",
                        ticket.qrActive
                          ? "text-foreground"
                          : "text-muted-foreground/30",
                      )}
                    />
                  </div>
                  <Badge
                    variant={ticket.qrActive ? "default" : "secondary"}
                    className="mb-2"
                  >
                    {ticket.qrActive ? "Aktif" : "Nonaktif"}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {ticket.qrActive
                      ? "QR dapat dipindai di gerbang"
                      : "QR belum aktif. Selesaikan pembayaran."}
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
                    <span className="text-muted-foreground">Invoice</span>
                    <span className="font-medium">{hasInvoice ? "Ada" : "Tidak"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bukti Bayar</span>
                    <span className="font-medium">{hasPaymentProof ? "Ada" : "Tidak"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status Pengembalian</span>
                    <span className="font-medium">
                      {isRefundApproved ? "Disetujui" : "Tidak Disetujui"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status Pembayaran</span>
                    <span className="font-medium">
                      {isPaid ? "Sudah Dibayar" : "Belum Dibayar"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bukti Pengembalian Dana</span>
                    <span className="font-medium">{hasRefundProof ? "Sudah Ada" : "Belum Ada"}</span>
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
                          <div
                            key={refund.id}
                            className="p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-xs text-primary">
                                {formatShortId(refund.id)}
                              </span>
                              <RefundStatusChip status={refund.status} />
                            </div>
                            <p className="text-sm font-medium">
                              {formatRupiah(refund.refundAmount)}{" "}
                              <span className="text-muted-foreground font-normal">
                                ({REFUND_TYPE_LABELS[refund.type]})
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {refund.reason}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Disetujui oleh:{" "}
                              <span className="font-medium text-foreground">
                                {getRefundApprovedByLabel(refund)}
                              </span>
                            </p>
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
        <DialogContent className="bg-card border-border max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Tiket</DialogTitle>
            <DialogDescription>
              Perubahan tiket akan berdampak pada invoice terkait (jumlah
              tagihan).
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={editForm.namaLengkap}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    namaLengkap: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>No Telp</Label>
              <Input
                value={editForm.noHP}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    noHP: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Domisili (Negara Asal)</Label>
              <Input
                value={editForm.countryOCR}
                placeholder="Contoh: Indonesia"
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    countryOCR: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button className="btn-ocean" onClick={handleSaveEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
