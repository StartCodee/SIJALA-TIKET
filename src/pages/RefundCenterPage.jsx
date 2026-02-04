import React from "react";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { RefundStatusChip } from "@/components/StatusChip";
import {
  dummyRefunds,
  formatRupiah,
  formatDateTime,
  formatShortId,
  REFUND_TYPE_LABELS,
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
export default function RefundCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionNotes, setActionNotes] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [activeTab, setActiveTab] = useState("menunggu");

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
    menunggu: dummyRefunds.filter((r) => r.status === "requested").length,
    diterima: dummyRefunds.filter((r) => r.status === "completed").length,
    ditolak: dummyRefunds.filter((r) => r.status === "rejected").length,
    totalRefunded: dummyRefunds
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
        ticket_id: r.ticketId,
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
            key: "ticket_id",
            label: "ID Tiket",
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
  const handleApprove = (refundId) => {
    console.log(`Aksi: terima pengembalian ${refundId}`);
  };
  const handleReject = (refundId) => {
    console.log(`Aksi: tolak pengembalian ${refundId}`);
  };
  const renderTable = (refunds, showActions) => {
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
                  Menunggu
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
        <div className="flex flex-wrap items-center gap-3 mb-4 no-print">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Pengembalian, ID Tiket, atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
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
                  <p className="text-xs text-muted-foreground mb-1">ID Tiket</p>
                  <p className="text-sm font-medium">
                    {formatShortId(selectedRefund.ticketId)}
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
