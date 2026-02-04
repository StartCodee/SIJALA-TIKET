import React from "react";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import {
  dummyInvoices,
  formatRupiah,
  formatDateTime,
  formatShortId,
} from "@/data/dummyData";
import { Search, Download, Edit, FileText, Printer } from "lucide-react";
import { Link } from "react-router-dom";
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
    amount: "",
  });
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

  // Filter invoices
  const filteredInvoices = paymentLines.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "proses_bayar"
        ? invoice.paymentStatus === "belum_bayar"
        : invoice.paymentStatus === statusFilter);
    return matchesSearch && matchesStatus;
  });

  // Stats
  const paidInvoices = paymentLines.filter((i) =>
    ["sudah_bayar", "refund_diproses", "refund_selesai"].includes(
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
    if (
      ["sudah_bayar", "refund_diproses", "refund_selesai"].includes(
        invoice.paymentStatus,
      )
    ) {
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
    return {
      label: "Proses Bayar (1x24 jam)",
      className: "bg-accent text-accent-foreground",
    };
  };
  const getRefundStatusLabel = (invoice) => {
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
    setSelectedLine(line);
    setEditForm({
      paymentStatus: line.paymentStatus || "belum_bayar",
      method: line.method || "bank_transfer",
      paidAt: toDateTimeLocal(line.paidAt || ""),
      amount: line.amount ?? "",
    });
    setShowEditDialog(true);
  };
  const handleSaveEdit = () => {
    if (!selectedLine) return;
    setPaymentLines((prev) =>
      prev.map((line) =>
        line.id === selectedLine.id && line.ticketId === selectedLine.ticketId
          ? {
              ...line,
              paymentStatus: editForm.paymentStatus,
              method: editForm.method,
              paidAt: fromDateTimeLocal(editForm.paidAt),
              amount: Number(editForm.amount || 0),
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
        title="Pembayaran & Tagihan"
        subtitle="Kelola pembayaran dan tagihan tiket"
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
              Total Potensi Terbayar
            </p>
            <p className="text-lg sm:text-xl font-bold text-status-approved leading-tight break-words">
              {formatRupiah(totalPotential)}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Total Terealisasi
            </p>
            <p className="text-lg sm:text-xl font-bold text-primary leading-tight break-words">
              {formatRupiah(totalRealized)}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Selisih belum terbayarkan
            </p>
            <p className="text-lg sm:text-xl font-bold text-status-pending leading-tight break-words">
              {formatRupiah(unpaidGap)}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Tanda Pengembalian
            </p>
            <p className="text-xl sm:text-2xl font-bold text-status-revision leading-tight break-words">
              {paymentLines.filter((i) => i.refundFlag).length}
            </p>
          </Card>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Invoice atau ID Tiket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Status Pembayaran" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
              <SelectItem value="proses_bayar">
                Proses Bayar (1x24 jam)
              </SelectItem>
              <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
            </SelectContent>
          </Select>
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
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Invoice</th>
                  <th>ID Tiket</th>
                  <th className="text-right">Jumlah</th>
                  <th>Dibayar Pada</th>
                  <th>Status Pembayaran</th>
                  <th>Pengembalian</th>
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
                    <td>
                      <Link
                        to={`/tickets/${invoice.ticketId}`}
                        className="font-mono text-sm text-primary hover:underline"
                      >
                        {formatShortId(invoice.ticketId)}
                      </Link>
                    </td>
                    <td className="text-right">
                      <span className="text-sm font-semibold">
                        {formatRupiah(invoice.amount)}
                      </span>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {invoice.paidAt ? formatDateTime(invoice.paidAt) : "-"}
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
                  Invoice {formatShortId(selectedLine.id)} • Tiket{" "}
                  {formatShortId(selectedLine.ticketId)}
                </p>
              )}
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
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
                    <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                    <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                    <SelectItem value="refund_diproses">
                      Refund Diproses
                    </SelectItem>
                    <SelectItem value="refund_selesai">
                      Refund Selesai
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
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                    <SelectItem value="e_wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tanggal Bayar</Label>
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
                <Label>Nominal</Label>
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
