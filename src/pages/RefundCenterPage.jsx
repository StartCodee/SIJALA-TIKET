import React from "react";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { RefundStatusChip } from "@/components/StatusChip";
import {
  dummyRefunds,
  formatRupiah,
  formatNominal,
  formatDateTime,
  formatShortId,
  REFUND_TYPE_LABELS,
  getTicketById,
  getInvoiceIdForTicket,
  getTicketIdsByInvoiceId,
} from "@/data/dummyData";
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
  Printer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportExcel } from "@/lib/exporters";

const REFUND_REQUEST_STORAGE_KEY = "refund_requests_v1";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const loadRefundRequests = () => {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(REFUND_REQUEST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function RefundCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showReasonDialog, setShowReasonDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [pendingRefundId, setPendingRefundId] = useState(null);
  const [actionDialogNotes, setActionDialogNotes] = useState("");
  const [actionNotes, setActionNotes] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [activeTab, setActiveTab] = useState("menunggu");
  const [formRequests] = useState(() => loadRefundRequests());

  const getRefundInvoiceId = (refund) => {
    if (refund?.invoiceId) return String(refund.invoiceId);
    if (refund?.ticketId) return getInvoiceIdForTicket(refund.ticketId) || "";
    return "";
  };

  const getRefundPrimaryTicketId = (refund) => {
    if (refund?.ticketId) return String(refund.ticketId);
    if (refund?.invoiceId) {
      const ticketIds = getTicketIdsByInvoiceId(refund.invoiceId);
      return ticketIds[0] || "";
    }
    return "";
  };

  const getOverviewOperatorName = (ticket) => {
    if (!ticket) return "Lainnya";
    if (ticket.bookingType === "group") return "Kapal";
    if (ticket.feeCategory === "mooring") return "Kapal";
    if (ticket.feeCategory === "sport_fishing") return "Dive Center";
    if (ticket.operatorType === "qris") return "Homestay";
    if (ticket.operatorType === "doku") return "Resort";
    if (ticket.operatorType === "loket") return "Mandiri";
    if (ticket.operatorType === "transfer") return "Lainnya";
    return "Lainnya";
  };
  const getOperatorNameForRefund = (refund) => {
    const ticket = getTicketById(getRefundPrimaryTicketId(refund));
    return getOverviewOperatorName(ticket);
  };
  const normalizeReasonText = (text) => String(text || "-").slice(0, 255);
  const openReasonDialog = (title, text) => {
    setSelectedReason({
      title,
      text: normalizeReasonText(text),
    });
    setShowReasonDialog(true);
  };

  const mappedFormRequests = formRequests.map((item) => {
    const invoiceId = item.invoiceId || (item.ticketId ? getInvoiceIdForTicket(item.ticketId) : "");
    const ticketIds = Array.isArray(item.ticketIds)
      ? item.ticketIds
      : invoiceId
        ? getTicketIdsByInvoiceId(invoiceId)
        : item.ticketId
          ? [item.ticketId]
          : [];
    const primaryTicketId = item.ticketId || ticketIds[0] || "";
    const ticket = getTicketById(primaryTicketId);
    return {
      id: item.id,
      invoiceId,
      ticketId: primaryTicketId,
      ticketIds,
      ticketName: item.requesterName || ticket?.namaLengkap || "Pengaju",
      status: "requested",
      requestedAt: item.createdAt,
      type: item.refundType || "partial",
      originalAmount: Number(ticket?.totalBiaya || ticket?.hargaPerOrang || 0),
      refundAmount: Number(item.requestedAmount || 0),
      reason: item.reason || "-",
      requestedBy: item.requesterName || "-",
      processedBy: "",
      processedAt: "",
      completedAt: "",
      referenceNumber: "",
      notes: "Dibuat dari menu Pengajuan Refund",
      attachmentName: item.attachmentName || "",
    };
  });

  const allRefunds = [...dummyRefunds, ...mappedFormRequests].sort(
    (a, b) => new Date(b.requestedAt || 0).getTime() - new Date(a.requestedAt || 0).getTime(),
  );

  // Filter refunds
  const filteredRefunds = allRefunds.filter((refund) => {
    const refundInvoiceId = getRefundInvoiceId(refund);
    const refundTicketId = getRefundPrimaryTicketId(refund);
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(refundInvoiceId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(refundTicketId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.ticketName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getOperatorNameForRefund(refund).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = {
    menunggu: allRefunds.filter((r) => r.status === "requested").length,
    diterima: allRefunds.filter((r) => r.status === "completed").length,
    ditolak: allRefunds.filter((r) => r.status === "rejected").length,
    totalRefunded: allRefunds
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.refundAmount, 0),
  };
  const refundsByStatus = {
    menunggu: filteredRefunds.filter((refund) => refund.status === "requested"),
    diterima: filteredRefunds.filter((refund) => refund.status === "completed"),
    ditolak: filteredRefunds.filter((refund) => refund.status === "rejected"),
  };
  const activeRefunds = refundsByStatus[activeTab] || filteredRefunds;
  const handleExportExcel = () => {
    exportExcel(
      activeRefunds.map((r) => ({
        refund_id: r.id,
        invoice_id: getRefundInvoiceId(r),
        ticket_id: getRefundPrimaryTicketId(r),
        ticket_name: r.ticketName,
        status: r.status,
        requested_at: r.requestedAt,
        type: r.type,
        original_amount: r.originalAmount,
        refund_amount: r.refundAmount,
        reason: r.reason,
        requested_by: r.requestedBy || "",
        processed_by: r.processedBy || "",
        processed_at: r.processedAt || "",
        completed_at: r.completedAt || "",
        reference_number: r.referenceNumber || "",
        notes: r.notes || "",
      })),
      `refund_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      {
        sheetName: "Refunds",
        columns: [
          {
            key: "refund_id",
            label: "ID Pengembalian",
          },
          {
            key: "invoice_id",
            label: "ID Invoice",
          },
          {
            key: "ticket_id",
            label: "ID Tiket Utama",
          },
          {
            key: "ticket_name",
            label: "Nama",
          },
          {
            key: "status",
            label: "Status",
          },
          {
            key: "requested_at",
            label: "Diajukan",
          },
          {
            key: "type",
            label: "Tipe",
          },
          {
            key: "original_amount",
            label: "Nominal Awal",
          },
          {
            key: "refund_amount",
            label: "Nominal Pengembalian",
          },
          {
            key: "reason",
            label: "Alasan",
          },
          {
            key: "requested_by",
            label: "Diajukan Oleh",
          },
          {
            key: "processed_by",
            label: "Diproses Oleh",
          },
          {
            key: "processed_at",
            label: "Diproses Pada",
          },
          {
            key: "completed_at",
            label: "Selesai Pada",
          },
          {
            key: "reference_number",
            label: "No. Referensi",
          },
          {
            key: "notes",
            label: "Catatan",
          },
        ],
      },
    );
  };
  const handleExportPdf = () => {
    window.print();
  };
  const handlePrint = () => {
    window.print();
  };
  const openActionDialog = (refundId) => {
    setPendingRefundId(refundId);
    setActionDialogNotes("");
    setShowActionDialog(true);
  };
  const closeActionDialog = () => {
    setShowActionDialog(false);
    setPendingRefundId(null);
    setActionDialogNotes("");
  };
  const confirmActionDialog = () => {
    if (!pendingRefundId) return;
    const notes = actionDialogNotes.trim();
    console.log(`Aksi: tolak pengembalian ${pendingRefundId}`, notes);
    closeActionDialog();
  };
  const handleApprove = (refundId) => {
    console.log(`Aksi: terima pengembalian ${refundId}`);
  };
  const handleReject = (refundId) => {
    openActionDialog(refundId);
  };
  const renderTable = (refunds, options = {}) => {
    const { showActions = false, showRejectedReason = false } = options;
    return (
      <Card className="card-ocean overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Pengembalian</th>
                <th>ID Invoice</th>
                <th>Nama Pengajuan</th>
                <th>Nama Operator</th>
                <th>Status</th>
                {showRejectedReason && <th>Alasan Ditolak</th>}
                <th>Tanggal Pengajuan</th>
                <th>Alasan</th>
                <th className="text-right">Jumlah Pengajuan Rp</th>
                {showActions && (
                  <th className="text-center">
                    <div className="flex items-center justify-center">Aksi</div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund) => (
                <tr key={`${refund.id}-${getRefundInvoiceId(refund) || "noinv"}`}>
                  <td>
                    <button
                      onClick={() => openDetail(refund)}
                      className="font-mono text-sm font-medium text-primary hover:underline"
                    >
                      {formatShortId(refund.id)}
                    </button>
                  </td>
                  <td>
                    {getRefundInvoiceId(refund) ? (
                      <Link
                        to={`/invoices/${getRefundInvoiceId(refund)}`}
                        className="font-mono text-sm text-muted-foreground hover:text-primary hover:underline"
                      >
                        {formatShortId(getRefundInvoiceId(refund))}
                      </Link>
                    ) : (
                      <span className="font-mono text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="text-sm">{refund.ticketName}</td>
                  <td className="text-sm">{getOperatorNameForRefund(refund)}</td>
                  <td>
                    <RefundStatusChip status={refund.status} />
                  </td>
                  {showRejectedReason && (
                    <td>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          openReasonDialog("Alasan Ditolak", refund.notes || "-")
                        }
                      >
                        Lihat
                      </Button>
                    </td>
                  )}
                  <td className="text-sm text-muted-foreground">
                    {formatDateTime(refund.requestedAt)}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => openReasonDialog("Alasan", refund.reason)}
                    >
                      Lihat
                    </Button>
                  </td>
                  <td className="text-right text-sm font-semibold">
                    {formatNominal(refund.refundAmount)}
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
  const openDetail = (refund) => {
    setSelectedRefund(refund);
    setShowDetailDialog(true);
  };
  return (
    <AdminLayout>
      <AdminHeader
        title="Pengembalian Dana"
        subtitle="Kelola permintaan pengembalian dana tiket"
        showSearch={false}
        className="no-print"
      />
      <div className="flex-1 overflow-auto p-6 print-wrap">
        <style>{`
          @media print {
            .no-print { display: none !important; }
            aside { display: none !important; }
            .print-wrap { padding: 0 !important; }
            .card-ocean { box-shadow: none !important; border: 1px solid #ddd !important; }
            table { width: 100% !important; }
          }
        `}</style>
        <div className="grid grid-cols-2 gap-4 mb-6 xl:grid-cols-4">
          <Card className="card-ocean p-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-pending-bg">
                <Clock className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
                  {stats.menunggu}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  Tiket Pengajuan
                </p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-approved-bg">
                <CheckCircle className="w-5 h-5 text-status-approved" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
                  {stats.diterima}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  Diterima
                </p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-rejected-bg">
                <XCircle className="w-5 h-5 text-status-rejected" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
                  {stats.ditolak}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  Ditolak
                </p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold leading-tight break-words">
                  {formatRupiah(stats.totalRefunded)}
                </p>
                <p className="text-xs text-muted-foreground break-words">
                  Total Dikembalikan
                </p>
              </div>
            </div>
          </Card>
        </div>
        <div className="mb-4 no-print flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Pengembalian, ID Invoice, nama, atau operator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 lg:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExportExcel}
            >
              <Download className="w-4 h-4" />
              Export XLS
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExportPdf}
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 no-print">
            <TabsTrigger value="menunggu" className="gap-2">
              <Clock className="w-4 h-4" />
              Tiket Pengajuan ({refundsByStatus.menunggu.length})
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
            {renderTable(refundsByStatus.menunggu, { showActions: true })}
          </TabsContent>
          <TabsContent value="diterima">
            {renderTable(refundsByStatus.diterima)}
          </TabsContent>
          <TabsContent value="ditolak">
            {renderTable(refundsByStatus.ditolak, { showRejectedReason: true })}
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={showReasonDialog} onOpenChange={setShowReasonDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedReason?.title || "Alasan"}</DialogTitle>
            <DialogDescription>
              Maksimal 255 karakter (free text).
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap break-words">
            {selectedReason?.text || "-"}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReasonDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showActionDialog}
        onOpenChange={(open) => {
          if (!open) {
            closeActionDialog();
            return;
          }
          setShowActionDialog(true);
        }}
      >
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-status-rejected" />
              Tolak Pengajuan Refund
            </DialogTitle>
            <DialogDescription>
              {`Berikan alasan penolakan untuk pengajuan ${formatShortId(pendingRefundId || "")}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Alasan Penolakan</label>
            <Textarea
              placeholder="Tambahkan alasan penolakan..."
              value={actionDialogNotes}
              onChange={(event) => setActionDialogNotes(event.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeActionDialog}>
              Batal
            </Button>
            <Button
              onClick={confirmActionDialog}
              className="bg-status-rejected hover:bg-status-rejected/90 text-white"
            >
              Tolak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-card border-border max-w-2xl">
          {selectedRefund && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">
                    {formatShortId(selectedRefund.id)}
                  </span>
                  <RefundStatusChip status={selectedRefund.status} />
                </DialogTitle>
                <DialogDescription>
                  Detail permintaan pengembalian dana
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID Invoice</p>
                  <p className="text-sm font-medium">
                    {getRefundInvoiceId(selectedRefund)
                      ? formatShortId(getRefundInvoiceId(selectedRefund))
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nama</p>
                  <p className="text-sm font-medium">
                    {selectedRefund.ticketName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Nominal Awal
                  </p>
                  <p className="text-sm font-medium">
                    {formatRupiah(selectedRefund.originalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Nominal Pengembalian
                  </p>
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
                  <p className="text-xs text-muted-foreground mb-1">
                    Diajukan Pada
                  </p>
                  <p className="text-sm">
                    {formatDateTime(selectedRefund.requestedAt)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Alasan</p>
                  <p className="text-sm p-3 bg-muted/50 rounded-lg">
                    {selectedRefund.reason}
                  </p>
                </div>
                {selectedRefund.referenceNumber && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Nomor Referensi
                    </p>
                    <p className="text-sm font-mono">
                      {selectedRefund.referenceNumber}
                    </p>
                  </div>
                )}
                {selectedRefund.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">
                      Catatan Internal
                    </p>
                    <p className="text-sm p-3 bg-muted/50 rounded-lg italic">
                      {selectedRefund.notes}
                    </p>
                  </div>
                )}
              </div>
              {selectedRefund.status === "processing" && (
                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="text-sm font-semibold">
                    Selesaikan Pengembalian
                  </h4>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Nomor Referensi
                    </label>
                    <Input
                      placeholder="TRF-YYYYMMDD-XXX"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Unggah Bukti Transfer
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Klik atau tarik file
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">
                      Catatan
                    </label>
                    <Textarea
                      placeholder="Catatan internal..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailDialog(false)}
                >
                  Tutup
                </Button>
                {selectedRefund.status === "processing" && (
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
