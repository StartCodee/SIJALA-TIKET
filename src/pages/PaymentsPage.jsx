import React from "react";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import {
  dummyInvoices,
  dummyRefunds,
  formatNominal,
  formatDateTime,
  formatShortId,
  getTicketById,
} from "@/data/dummyData";
import { Search, Download, Edit, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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
import { exportExcel } from "@/lib/exporters";
export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentLines, setPaymentLines] = useState(() =>
    dummyInvoices.map((line) => ({
      ...line,
    })),
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [editForm, setEditForm] = useState({
    paymentStatus: "belum_bayar",
    method: "bank_transfer",
    paidAt: "",
    refundAt: "",
    amount: "",
    refundAmount: "",
  });
  const [editError, setEditError] = useState("");
  const toDateTimeLocal = (iso) => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };
  const fromDateTimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString();
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
  const refundByTicketId = React.useMemo(
    () =>
      dummyRefunds.reduce((acc, item) => {
        acc[item.ticketId] = item;
        return acc;
      }, {}),
    [],
  );
  const paymentMethodOptions = React.useMemo(
    () =>
      Array.from(
        new Set(
          paymentLines
            .map((line) => line.method)
            .filter((method) => typeof method === "string" && method.length > 0),
        ),
      ),
    [paymentLines],
  );
  const paymentRows = React.useMemo(
    () =>
      paymentLines.map((line) => {
        const ticket = getTicketById(line.ticketId);
        const refund = refundByTicketId[line.ticketId];
        const isPaidOrRefunded = [
          "sudah_bayar",
          "refund_diajukan",
          "refund_diproses",
          "refund_selesai",
        ].includes(
          line.paymentStatus,
        );
        const isRefunded = ["refund_diproses", "refund_selesai"].includes(
          line.paymentStatus,
        );
        const refundOut = Number(line.refundAmount ?? refund?.refundAmount ?? 0);
        const keluarAt =
          line.refundAt ||
          refund?.completedAt ||
          refund?.processedAt ||
          refund?.requestedAt ||
          "";
        return {
          ...line,
          operatorName: getOverviewOperatorName(ticket),
          jumlahMasuk: isPaidOrRefunded ? line.amount : 0,
          jumlahKeluar: isRefunded ? refundOut : 0,
          tanggalMasuk: line.paidAt || "",
          tanggalKeluar:
            line.paymentStatus === "refund_diajukan" ||
            line.paymentStatus === "refund_diproses" ||
            line.paymentStatus === "refund_selesai"
              ? keluarAt
              : "",
        };
      }),
    [paymentLines, refundByTicketId],
  );

  // Filter invoices
  const filteredInvoices = paymentRows.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.operatorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      invoice.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const paidInvoices = paymentLines.filter((i) =>
    ["sudah_bayar", "refund_diajukan", "refund_diproses", "refund_selesai"].includes(
      i.paymentStatus,
    ),
  );
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPotential = paymentLines.reduce((sum, i) => sum + i.amount, 0);
  const unpaidGap = totalPotential - totalPaid;
  const totalRealized = paymentLines
    .filter((i) => i.realisasiStatus === "sudah_terealisasi")
    .reduce((sum, i) => sum + i.amount, 0);
  const getPaymentStatusLabel = (invoice) => {
    if (["sudah_bayar", "refund_diajukan", "refund_diproses", "refund_selesai"].includes(invoice.paymentStatus)) {
      return {
        label: "Sudah bayar",
        className: "bg-status-approved-bg text-status-approved",
      };
    }
    if (invoice.paymentStatus === "belum_bayar") {
      return {
        label: "Belum Bayar",
        className: "bg-status-pending-bg text-status-pending",
      };
    }
    if (invoice.paymentStatus === "tidak_bayar") {
      return {
        label: "Tidak Bayar (lebih dari 24 jam)",
        className: "bg-slate-200 text-slate-700",
      };
    }
    return {
      label: "-",
      className: "bg-muted text-muted-foreground",
    };
  };
  const getRefundStatusLabel = (invoice) => {
    if (invoice.paymentStatus === "refund_diajukan") {
      return {
        label: "Pengembalian Diajukan",
        className: "bg-status-revision-bg text-status-revision",
      };
    }
    if (invoice.paymentStatus === "refund_diproses") {
      return {
        label: "Pengembalian Diproses",
        className: "bg-status-pending-bg text-status-pending",
      };
    }
    if (invoice.paymentStatus === "refund_selesai") {
      return {
        label: "Pengembalian Selesai",
        className: "bg-status-approved-bg text-status-approved",
      };
    }
    return {
      label: "-",
      className: "bg-muted text-muted-foreground",
    };
  };
  const openEdit = (line) => {
    const refund = refundByTicketId[line.ticketId];
    const fallbackRefundAt =
      refund?.completedAt || refund?.processedAt || refund?.requestedAt || "";
    const fallbackRefundAmount = refund?.refundAmount ?? 0;
    setEditError("");
    setSelectedLine(line);
    setEditForm({
      paymentStatus: line.paymentStatus || "belum_bayar",
      method: line.method || "bank_transfer",
      paidAt: toDateTimeLocal(line.paidAt || ""),
      refundAt: toDateTimeLocal(line.refundAt || fallbackRefundAt),
      amount: line.amount ?? "",
      refundAmount: line.refundAmount ?? fallbackRefundAmount,
    });
    setShowEditDialog(true);
  };
  const handleSaveEdit = () => {
    if (!selectedLine) return;
    setEditError("");

    const amount = Number(editForm.amount || 0);
    const refundAmount = Number(editForm.refundAmount || 0);
    const refundStatuses = ["refund_diajukan", "refund_diproses", "refund_selesai"];
    const isRefundStatus = refundStatuses.includes(editForm.paymentStatus);

    if (amount < 0) {
      setEditError("Nominal pembayaran tidak boleh kurang dari 0.");
      return;
    }
    if (refundAmount < 0) {
      setEditError("Nominal pengembalian tidak boleh kurang dari 0.");
      return;
    }
    if (refundAmount > amount) {
      setEditError("Nominal pengembalian tidak boleh lebih besar dari nominal pembayaran.");
      return;
    }
    if (editForm.paymentStatus === "sudah_bayar" && !editForm.paidAt) {
      setEditError("Tanggal pembayaran wajib diisi untuk status Sudah Bayar.");
      return;
    }
    if (isRefundStatus && !editForm.paidAt) {
      setEditError("Tanggal pembayaran wajib diisi untuk status pengembalian.");
      return;
    }
    if (isRefundStatus && refundAmount <= 0) {
      setEditError("Nominal pengembalian wajib diisi untuk status pengembalian.");
      return;
    }

    const paidAtIso = fromDateTimeLocal(editForm.paidAt);
    const refundAtIso = fromDateTimeLocal(editForm.refundAt);

    setPaymentLines((prev) =>
      prev.map((line) =>
        line.id === selectedLine.id && line.ticketId === selectedLine.ticketId
          ? {
              ...line,
              paymentStatus: editForm.paymentStatus,
              method: editForm.method,
              paidAt:
                editForm.paymentStatus === "belum_bayar" ||
                editForm.paymentStatus === "tidak_bayar"
                  ? ""
                  : paidAtIso,
              refundAt: isRefundStatus ? refundAtIso : "",
              amount,
              refundAmount: isRefundStatus ? refundAmount : 0,
              refundFlag: isRefundStatus,
            }
          : line,
      ),
    );
    setShowEditDialog(false);
  };
  const handleExportXls = () => {
    exportExcel(
      filteredInvoices.map((invoice) => ({
        invoice_id: invoice.id,
        ticket_id: invoice.ticketId,
        amount: invoice.amount,
        payment_status: invoice.paymentStatus,
        method: invoice.method,
        paid_at: invoice.paidAt || "",
        realisasi_status: invoice.realisasiStatus || "",
        refund_flag: invoice.refundFlag ? "yes" : "no",
      })),
      `payments_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      {
        sheetName: "Payments",
      },
    );
  };
  const handleExportPdf = () => {
    window.print();
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <AdminLayout>
      <AdminHeader
        title="Pembayaran dan Pengembalian"
        subtitle="Kelola pembayaran dan pengembalian tiket"
        showSearch={false}
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Pembayaran Masuk
            </p>
            <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
              {paidInvoices.length}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Tanda Pengembalian Dana
            </p>
            <p className="text-xl sm:text-2xl font-bold text-status-revision leading-tight break-words">
              {paymentLines.filter((i) => i.refundFlag).length}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Total Potensi Terbayar Rp.
            </p>
            <p className="text-lg sm:text-xl font-bold text-status-approved leading-tight break-words">
              {formatNominal(totalPotential)}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Total Realisasi Rp.
            </p>
            <p className="text-lg sm:text-xl font-bold text-primary leading-tight break-words">
              {formatNominal(totalRealized)}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Selisih Belum Terbayar Rp.
            </p>
            <p className="text-lg sm:text-xl font-bold text-status-pending leading-tight break-words">
              {formatNominal(unpaidGap)}
            </p>
          </Card>
        </div>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
            <div className="relative w-full min-w-[220px] lg:w-[420px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari ID Invoice, ID Tiket, atau Operator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[220px] bg-card">
                <SelectValue placeholder="Status Pembayaran" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                <SelectItem value="tidak_bayar">
                  Tidak Bayar (lebih dari 24 jam)
                </SelectItem>
                <SelectItem value="refund_diajukan">
                  Pengembalian Diajukan
                </SelectItem>
                <SelectItem value="refund_diproses">
                  Pengembalian Diproses
                </SelectItem>
                <SelectItem value="refund_selesai">
                  Pengembalian Selesai
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 lg:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExportXls}
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
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Invoice</th>
                  <th>Nama Operator</th>
                  <th className="text-right">Jumlah Masuk Rp</th>
                  <th className="text-right">Jumlah Keluar Rp</th>
                  <th>Tanggal Masuk</th>
                  <th>Tanggal Keluar</th>
                  <th>Status Pembayaran</th>
                  <th>Status Pengembalian</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <span className="font-mono text-sm font-medium">
                        {formatShortId(invoice.id)}
                      </span>
                    </td>
                    <td className="text-sm">{invoice.operatorName}</td>
                    <td className="text-right">
                      <span className="text-sm font-semibold">
                        {formatNominal(invoice.jumlahMasuk)}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="text-sm font-semibold">
                        {formatNominal(invoice.jumlahKeluar)}
                      </span>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {invoice.tanggalMasuk ? formatDateTime(invoice.tanggalMasuk) : "-"}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {invoice.tanggalKeluar ? formatDateTime(invoice.tanggalKeluar) : "-"}
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusLabel(invoice).className}`}
                      >
                        {getPaymentStatusLabel(invoice).label}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRefundStatusLabel(invoice).className}`}
                      >
                        {getRefundStatusLabel(invoice).label}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Edit pembayaran"
                        onClick={() => openEdit(invoice)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Pembayaran</DialogTitle>
              <DialogDescription>
                Perubahan manual untuk menjaga konsistensi data.
              </DialogDescription>
              {selectedLine && (
                <p className="text-xs text-muted-foreground mt-1">
                  Invoice {formatShortId(selectedLine.id)} - Tiket{" "}
                  {formatShortId(selectedLine.ticketId)}
                </p>
              )}
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div className="space-y-2">
                <Label>Status</Label>
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
                    <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                    <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                    <SelectItem value="tidak_bayar">
                      Tidak Bayar (lebih dari 24 jam)
                    </SelectItem>
                    <SelectItem value="refund_diajukan">
                      Pengembalian Diajukan
                    </SelectItem>
                    <SelectItem value="refund_diproses">
                      Pengembalian Diproses
                    </SelectItem>
                    <SelectItem value="refund_selesai">
                      Pengembalian Selesai
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Metode</Label>
                <Select
                  value={editForm.method}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({
                      ...prev,
                      method: value,
                    }))
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {paymentMethodOptions.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tanggal Pembayaran</Label>
                <Input
                  type="datetime-local"
                  value={editForm.paidAt}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      paidAt: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Pengembalian (opsional)</Label>
                <Input
                  type="datetime-local"
                  value={editForm.refundAt}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      refundAt: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Nominal Pembayaran</Label>
                <Input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Nominal Pengembalian (opsional)</Label>
                <Input
                  type="number"
                  value={editForm.refundAmount}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      refundAmount: e.target.value,
                    }))
                  }
                />
              </div>
              {editError && (
                <p className="md:col-span-2 text-xs text-destructive">{editError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Batal
              </Button>
              <Button className="btn-ocean" onClick={handleSaveEdit}>
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
