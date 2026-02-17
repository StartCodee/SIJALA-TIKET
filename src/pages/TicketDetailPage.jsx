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
  BOOKING_TYPE_LABELS,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const location = useLocation();
  const [ticket, setTicket] = useState(() =>
    ticketId ? getTicketById(ticketId) : null,
  );
  const ticketRefunds = dummyRefunds.filter((r) => r.ticketId === ticketId);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const adminApproverOptions = dummyAdminUsers.filter(
    (admin) => admin.role === "admin_utama" || admin.role === "admin_tiket",
  );
  const OPERATOR_CATEGORY_OPTIONS = [
    { value: "kapal", label: "Kapal" },
    { value: "resort", label: "Resort" },
    { value: "homestay", label: "Homestay" },
    { value: "dive_center", label: "Dive Center" },
    { value: "mandiri", label: "Mandiri" },
    { value: "lainnya", label: "Lainnya" },
  ];
  const getOperatorCategoryFromTicket = (ticketData) => {
    if (ticketData?.operatorCategory) return ticketData.operatorCategory;
    if (ticketData?.bookingType === "group" || ticketData?.feeCategory === "mooring") return "kapal";
    if (ticketData?.feeCategory === "sport_fishing") return "dive_center";
    if (ticketData?.operatorType === "doku") return "resort";
    if (ticketData?.operatorType === "qris") return "homestay";
    if (ticketData?.operatorType === "loket") return "mandiri";
    return "lainnya";
  };
  const getOperatorTypeFromCategory = (category) => {
    const categoryToOperatorType = {
      resort: "doku",
      homestay: "qris",
      mandiri: "loket",
      kapal: "transfer",
      dive_center: "transfer",
      lainnya: "transfer",
    };
    return categoryToOperatorType[category] || "transfer";
  };
  const getDefaultOperatorName = (operatorCategory) => {
    const operatorNameByCategory = {
      kapal: "Kapal Raja Ampat Explorer",
      resort: "Resort Waigeo Paradise",
      homestay: "Homestay Misool Indah",
      dive_center: "Dive Center Blue Lagoon",
      mandiri: "Mandiri Loket Utama",
      lainnya: "Operator Lainnya Raja Ampat",
    };
    return operatorNameByCategory[operatorCategory] || "Operator Lainnya Raja Ampat";
  };
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
  const [editForm, setEditForm] = useState({
    namaLengkap: "",
    email: "",
    noHP: "",
    countryOCR: "Indonesia",
    bookingType: "perorangan",
    feeCategory: "wisatawan_domestik_pbd",
    hargaPerOrang: 0,
    totalBiaya: 0,
    invoiceAvailable: "tidak",
    paymentProofAvailable: "tidak",
    operatorCategory: "mandiri",
    operatorName: "",
    refundApprovalStatus: "tidak_disetujui",
    paymentStatus: "belum_bayar",
    gateValue: "",
    approvedBy: "",
  });
  useEffect(() => {
    if (!ticketId) return;
    setTicket(getTicketById(ticketId));
  }, [ticketId]);
  const openEditDialog = () => {
    if (!ticket) return;
    const invoiceExists = Boolean(getInvoiceIdForTicket(ticket.id));
    const paidTicketStatuses = [
      "sudah_bayar",
      "refund_diajukan",
      "refund_diproses",
      "refund_selesai",
    ];
    const isTicketPaid = paidTicketStatuses.includes(ticket.paymentStatus);
    const latestTicketRefund = [...ticketRefunds].sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
    )[0];
    const operatorCategory = getOperatorCategoryFromTicket(ticket);
    const selectedOperatorType = getOperatorTypeFromCategory(operatorCategory);
    setEditForm({
      namaLengkap: ticket.namaLengkap || "",
      email: ticket.email || "",
      noHP: ticket.noHP || "",
      countryOCR:
        ticket.countryOCR ||
        (ticket.domisiliOCR === "mancanegara" ? "Mancanegara" : "Indonesia"),
      bookingType: ticket.bookingType || "perorangan",
      feeCategory: ticket.feeCategory || "wisatawan_domestik_pbd",
      hargaPerOrang: ticket.hargaPerOrang || 0,
      totalBiaya: ticket.totalBiaya || 0,
      invoiceAvailable:
        (typeof ticket.invoiceAvailable === "boolean"
          ? ticket.invoiceAvailable
          : invoiceExists)
          ? "ada"
          : "tidak",
      paymentProofAvailable:
        (typeof ticket.paymentProofAvailable === "boolean"
          ? ticket.paymentProofAvailable
          : Boolean(ticket.paidAt))
          ? "ada"
          : "tidak",
      operatorCategory,
      operatorName: ticket.operatorName || getDefaultOperatorName(operatorCategory),
      refundApprovalStatus:
        ticket.refundApprovalStatus ||
        (latestTicketRefund?.status === "completed"
          ? "disetujui"
          : "tidak_disetujui"),
      paymentStatus: isTicketPaid ? "sudah_bayar" : "belum_bayar",
      gateValue:
        selectedOperatorType === "doku"
          ? "DOKU"
          : ticket.gateOfficerName || getDefaultGateOfficerName(ticket),
      approvedBy: ticket.approvedBy || "",
    });
    setShowEditDialog(true);
  };
  const handleSaveEdit = () => {
    if (!ticket) return;
    const isPaid = editForm.paymentStatus === "sudah_bayar";
    const hasPaymentProof = editForm.paymentProofAvailable === "ada";
    const paidAtValue = isPaid || hasPaymentProof ? ticket.paidAt || new Date().toISOString() : "";
    const selectedOperatorType = getOperatorTypeFromCategory(editForm.operatorCategory);
    const gateOfficerName =
      selectedOperatorType === "doku" ? "DOKU" : editForm.gateValue.trim();
    saveTicketOverride(ticket.id, {
      namaLengkap: editForm.namaLengkap,
      email: editForm.email,
      noHP: editForm.noHP,
      countryOCR: editForm.countryOCR,
      bookingType: editForm.bookingType,
      feeCategory: editForm.feeCategory,
      hargaPerOrang: Number(editForm.hargaPerOrang || 0),
      totalBiaya: Number(editForm.totalBiaya || 0),
      invoiceAvailable: editForm.invoiceAvailable === "ada",
      paymentProofAvailable: hasPaymentProof,
      operatorType: selectedOperatorType,
      operatorCategory: editForm.operatorCategory,
      operatorName: editForm.operatorName || getDefaultOperatorName(editForm.operatorCategory),
      refundApprovalStatus: editForm.refundApprovalStatus,
      paymentStatus: isPaid ? "sudah_bayar" : "belum_bayar",
      paidAt: paidAtValue,
      qrActive: isPaid,
      gateOfficerName,
      lastActionBy:
        selectedOperatorType === "doku"
          ? ticket.lastActionBy
          : gateOfficerName || ticket.lastActionBy,
      approvedBy: editForm.approvedBy,
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
              <Label>Nomor Kontak</Label>
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
            <div className="space-y-2">
              <Label>Tipe Pemesan</Label>
              <Select
                value={editForm.bookingType}
                onValueChange={(value) => {
                  const pesertaCount = Math.max(
                    1,
                    (ticket.jumlahDomestik || 0) + (ticket.jumlahMancanegara || 0),
                  );
                  setEditForm((prev) => ({
                    ...prev,
                    bookingType: value,
                    totalBiaya:
                      value === "group"
                        ? Number(prev.hargaPerOrang || 0) * pesertaCount
                        : Number(prev.hargaPerOrang || 0),
                  }));
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(BOOKING_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select
                value={editForm.feeCategory}
                onValueChange={(value) => {
                  const nextHarga = FEE_PRICING[value]?.price ?? Number(editForm.hargaPerOrang || 0);
                  const pesertaCount = Math.max(
                    1,
                    (ticket.jumlahDomestik || 0) + (ticket.jumlahMancanegara || 0),
                  );
                  setEditForm((prev) => ({
                    ...prev,
                    feeCategory: value,
                    hargaPerOrang: nextHarga,
                    totalBiaya:
                      prev.bookingType === "group" ? nextHarga * pesertaCount : nextHarga,
                  }));
                }}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(FEE_PRICING).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Harga per Orang</Label>
              <Input
                type="number"
                value={editForm.hargaPerOrang}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    hargaPerOrang: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Total Biaya</Label>
              <Input
                type="number"
                value={editForm.totalBiaya}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    totalBiaya: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Invoice</Label>
              <Select
                value={editForm.invoiceAvailable}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    invoiceAvailable: value,
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="ada">Ada</SelectItem>
                  <SelectItem value="tidak">Tidak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bukti Bayar</Label>
              <Select
                value={editForm.paymentProofAvailable}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    paymentProofAvailable: value,
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="ada">Ada</SelectItem>
                  <SelectItem value="tidak">Tidak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jenis Operator</Label>
              <Select
                value={editForm.operatorCategory}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    operatorCategory: value,
                    operatorName: getDefaultOperatorName(value),
                    gateValue:
                      getOperatorTypeFromCategory(value) === "doku"
                        ? "DOKU"
                        : prev.gateValue || getDefaultGateOfficerName(ticket),
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {OPERATOR_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nama Operator</Label>
              <Input
                value={editForm.operatorName}
                placeholder="Nama homestay/resort/operator"
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    operatorName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Status Pengembalian</Label>
              <Select
                value={editForm.refundApprovalStatus}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    refundApprovalStatus: value,
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="disetujui">Disetujui</SelectItem>
                  <SelectItem value="tidak_disetujui">Tidak Disetujui</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status Pembayaran</Label>
              <Select
                value={editForm.paymentStatus}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    paymentStatus: value,
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="sudah_bayar">Sudah Dibayar</SelectItem>
                  <SelectItem value="belum_bayar">Belum Dibayar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Gerbang</Label>
              <Input
                value={editForm.gateValue}
                placeholder="DOKU atau nama petugas tiket"
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    gateValue: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Disetujui oleh</Label>
              <Select
                value={editForm.approvedBy || "__none__"}
                onValueChange={(value) =>
                  setEditForm((prev) => ({
                    ...prev,
                    approvedBy: value === "__none__" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="__none__">Belum dipilih</SelectItem>
                  {adminApproverOptions.map((admin) => (
                    <SelectItem key={admin.id} value={admin.name}>
                      {admin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
