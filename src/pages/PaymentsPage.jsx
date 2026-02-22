import React from "react";
import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import {
  getAllInvoiceLines,
  saveInvoiceLineOverride,
  saveTicketOverride,
  dummyRefunds,
  formatNominal,
  formatDateTime,
  formatShortId,
  getTicketById,
} from "@/data/dummyData";
import { Search, Download, FileText, Printer, Plus, Check, ChevronsUpDown } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportExcel } from "@/lib/exporters";
import { cn } from "@/lib/utils";

const PAYMENT_METHOD_OPTIONS = [
  { value: "doku_credit_card", label: "Doku - Credit Card" },
  { value: "doku_bank_va", label: "Doku - Transfer Bank (VA)" },
  { value: "doku_qris", label: "Doku - QRIS" },
  { value: "doku_e_wallet", label: "Doku - E-Wallet" },
  { value: "doku_minimarket", label: "Doku - Minimarket" },
  { value: "doku_paylater", label: "Doku - PayLater" },
  { value: "doku_bank_direct", label: "Doku - Bank Langsung" },
  { value: "doku_bank_digital", label: "Doku - Bank Digital" },
  { value: "blud_bank_va", label: "BLUD R4 - Transfer Bank (VA)" },
  { value: "blud_qris", label: "BLUD R4 - QRIS" },
  { value: "blud_bank_direct", label: "BLUD R4 - Bank Langsung" },
  { value: "blud_cash", label: "BLUD R4 - Tunai" },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pembayaran");
  const [invoicePickerOpen, setInvoicePickerOpen] = useState(false);
  const [paymentLines, setPaymentLines] = useState(() =>
    getAllInvoiceLines().map((line) => ({
      ...line,
    })),
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    invoiceId: "",
    method: "blud_bank_va",
    paidAt: "",
    amount: "",
  });
  const [editError, setEditError] = useState("");
  const fromDateTimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString();
  };
  const getOverviewOperatorName = (ticket) => {
    if (!ticket) return "Operator tidak diketahui";
    if (typeof ticket.operatorName === "string" && ticket.operatorName.trim()) {
      return ticket.operatorName.trim();
    }
    if (ticket.bookingType === "group" || ticket.feeCategory === "mooring") {
      return "Kapal Raja Ampat Explorer";
    }
    if (ticket.feeCategory === "sport_fishing") {
      return "Dive Center Blue Lagoon";
    }
    if (ticket.operatorType === "qris") return "Homestay Dalang";
    if (ticket.operatorType === "doku") return "Resort Waigeo Paradise";
    if (ticket.operatorType === "loket") return "Mandiri Loket Utama";
    if (ticket.operatorType === "transfer") return "Operator Raja Ampat Sejahtera";
    return "Operator Raja Ampat Sejahtera";
  };
  const refundByTicketId = React.useMemo(
    () =>
      dummyRefunds.reduce((acc, item) => {
        acc[item.ticketId] = item;
        return acc;
      }, {}),
    [],
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
          baseDate: line.paidAt || line.refundAt || ticket?.createdAt || "",
          refundDate: keluarAt || "",
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

  const incomingRecords = paymentRows.filter((row) => row.jumlahMasuk > 0);
  const refundRecords = paymentRows.filter(
    (row) =>
      row.jumlahKeluar > 0 ||
      row.refundFlag ||
      row.paymentStatus === "refund_diajukan" ||
      row.paymentStatus === "refund_diproses" ||
      row.paymentStatus === "refund_selesai",
  );

  const matchesSearch = (row) => {
    const query = searchQuery.toLowerCase();
    return (
      row.id.toLowerCase().includes(query) ||
      row.ticketId.toLowerCase().includes(query) ||
      row.operatorName.toLowerCase().includes(query)
    );
  };

  const filteredIncomingRecords = incomingRecords.filter(matchesSearch);
  const filteredRefundRecords = refundRecords.filter(matchesSearch);
  const invoiceOptions = React.useMemo(() => {
    const paidOrRefundStatuses = new Set([
      "sudah_bayar",
      "refund_diajukan",
      "refund_diproses",
      "refund_selesai",
    ]);
    const grouped = new Map();
    for (const row of paymentRows) {
      if (!grouped.has(row.id)) {
        grouped.set(row.id, {
          id: row.id,
          operatorName: row.operatorName,
          ticketCount: 0,
          totalAmount: 0,
          latestDate: row.baseDate || row.tanggalMasuk || row.tanggalKeluar || "",
          hasPaidOrRefund: false,
        });
      }
      const current = grouped.get(row.id);
      current.ticketCount += 1;
      current.totalAmount += Number(row.amount || 0);
      if (paidOrRefundStatuses.has(row.paymentStatus)) {
        current.hasPaidOrRefund = true;
      }
      const currentDate = new Date(current.latestDate || 0).getTime();
      const rowDate = new Date(row.baseDate || row.tanggalMasuk || row.tanggalKeluar || 0).getTime();
      if (rowDate > currentDate) {
        current.latestDate = row.baseDate || row.tanggalMasuk || row.tanggalKeluar || "";
      }
    }
    return Array.from(grouped.values())
      .filter((option) => !option.hasPaidOrRefund)
      .sort((a, b) => {
      const aTime = new Date(a.latestDate || 0).getTime();
      const bTime = new Date(b.latestDate || 0).getTime();
      return bTime - aTime;
      });
  }, [paymentRows]);
  const selectedInvoiceOption = invoiceOptions.find((option) => option.id === editForm.invoiceId) || null;

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
  const kpiTrends = React.useMemo(() => {
    const parseDate = (value) => {
      const date = new Date(value || "");
      if (Number.isNaN(date.getTime())) return null;
      return date;
    };

    const paidStatuses = new Set([
      "sudah_bayar",
      "refund_diajukan",
      "refund_diproses",
      "refund_selesai",
    ]);

    const rowsWithDate = paymentRows
      .map((row) => ({
        ...row,
        dateObj: parseDate(row.baseDate || row.tanggalMasuk || row.tanggalKeluar),
      }))
      .filter((row) => row.dateObj);

    const latestDate = rowsWithDate.length
      ? rowsWithDate.reduce((latest, row) => (row.dateObj > latest ? row.dateObj : latest), rowsWithDate[0].dateObj)
      : new Date();

    const currentMonthStart = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
    const nextMonthStart = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 1);
    const prevMonthStart = new Date(latestDate.getFullYear(), latestDate.getMonth() - 1, 1);

    const isInRange = (date, start, end) => date >= start && date < end;

    const currentRows = rowsWithDate.filter((row) =>
      isInRange(row.dateObj, currentMonthStart, nextMonthStart),
    );
    const previousRows = rowsWithDate.filter((row) =>
      isInRange(row.dateObj, prevMonthStart, currentMonthStart),
    );

    const calcMetrics = (rows, periodType) => {
      const refundRows = rows.filter(
        (row) =>
          row.jumlahKeluar > 0 ||
          row.refundFlag ||
          row.paymentStatus === "refund_diajukan" ||
          row.paymentStatus === "refund_diproses" ||
          row.paymentStatus === "refund_selesai",
      );
      const refundCount =
        periodType === "current"
          ? refundRows.filter((row) => {
              const refundDate = parseDate(row.refundDate || row.tanggalKeluar || row.baseDate);
              return refundDate && isInRange(refundDate, currentMonthStart, nextMonthStart);
            }).length
          : refundRows.filter((row) => {
              const refundDate = parseDate(row.refundDate || row.tanggalKeluar || row.baseDate);
              return refundDate && isInRange(refundDate, prevMonthStart, currentMonthStart);
            }).length;

      const paidCount = rows.filter((row) => paidStatuses.has(row.paymentStatus)).length;
      const potential = rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      const realized = rows
        .filter((row) => row.realisasiStatus === "sudah_terealisasi")
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      const paid = rows
        .filter((row) => paidStatuses.has(row.paymentStatus))
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      return {
        paidCount,
        refundCount,
        potential,
        realized,
        unpaidGap: potential - paid,
      };
    };

    const prev = calcMetrics(previousRows, "previous");
    const current = calcMetrics(currentRows, "current");

    const toPercent = (curr, prevValue) => {
      if (!prevValue && !curr) return 0;
      if (!prevValue && curr) return 100;
      return ((curr - prevValue) / Math.abs(prevValue)) * 100;
    };

    const formatPercent = (value) =>
      `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(
        Math.abs(value),
      )}%`;

    const getTrend = (currentValue, previousValue, preferHigher = true) => {
      const percent = toPercent(currentValue, previousValue);
      if (Math.abs(percent) < 0.1) {
        return {
          text: "Stabil vs bln lalu",
          className: "text-muted-foreground",
        };
      }

      const isIncrease = percent > 0;
      const isPositive = preferHigher ? isIncrease : !isIncrease;
      return {
        text: `${isIncrease ? "Naik" : "Turun"} ${formatPercent(percent)} vs bln lalu`,
        className: isPositive ? "text-status-approved" : "text-destructive",
      };
    };

    return {
      paidCount: getTrend(current.paidCount, prev.paidCount, true),
      refundCount: getTrend(current.refundCount, prev.refundCount, false),
      potential: getTrend(current.potential, prev.potential, true),
      realized: getTrend(current.realized, prev.realized, true),
      unpaidGap: getTrend(current.unpaidGap, prev.unpaidGap, false),
    };
  }, [paymentRows]);
  const openAddTransaction = () => {
    setEditError("");
    setInvoicePickerOpen(false);
    setEditForm({
      invoiceId: "",
      method: "blud_bank_va",
      paidAt: "",
      amount: "",
    });
    setShowEditDialog(true);
  };
  const handleSelectInvoice = (invoiceId) => {
    const selectedLines = paymentLines.filter((line) => line.id === invoiceId);
    const totalAmount = selectedLines.reduce((sum, line) => sum + Number(line.amount || 0), 0);
    const firstLine = selectedLines[0];

    setEditForm((prev) => ({
      ...prev,
      invoiceId,
      method: firstLine?.method || prev.method || "blud_bank_va",
      amount: totalAmount ? String(totalAmount) : "",
      paidAt: firstLine?.paidAt ? new Date(firstLine.paidAt).toISOString().slice(0, 16) : "",
    }));
    setInvoicePickerOpen(false);
  };
  const handleSaveEdit = () => {
    setEditError("");
    const invoiceId = String(editForm.invoiceId || "").trim();
    const selectedLines = paymentLines.filter((line) => line.id === invoiceId);

    const amount = Number(editForm.amount || 0);

    if (!invoiceId) {
      setEditError("ID invoice wajib dipilih.");
      return;
    }
    if (!selectedLines.length) {
      setEditError("Invoice tidak ditemukan pada data transaksi.");
      return;
    }
    if (amount < 0) {
      setEditError("Nominal pembayaran tidak boleh kurang dari 0.");
      return;
    }
    if (!editForm.paidAt) {
      setEditError("Tanggal pembayaran wajib diisi.");
      return;
    }

    const distributeAmount = (totalValue, lines, baseSelector) => {
      const count = lines.length;
      if (!count) return [];
      if (count === 1) return [Math.round(totalValue)];

      const baseValues = lines.map(baseSelector);
      const baseSum = baseValues.reduce((sum, value) => sum + value, 0);
      if (baseSum <= 0) {
        const even = Math.floor(totalValue / count);
        const distributed = Array.from({ length: count }, () => even);
        distributed[count - 1] += totalValue - even * count;
        return distributed;
      }

      const distributed = baseValues.map((value) =>
        Math.round((value / baseSum) * totalValue),
      );
      const diff = totalValue - distributed.reduce((sum, value) => sum + value, 0);
      distributed[count - 1] += diff;
      return distributed;
    };

    const paidAtIso = fromDateTimeLocal(editForm.paidAt);
    const roundedAmount = Math.round(amount);
    const distributedAmounts = distributeAmount(
      roundedAmount,
      selectedLines,
      (line) => Number(line.amount || 0),
    );

    const patchMap = new Map();
    const fixedPaymentStatus = "sudah_bayar";
    selectedLines.forEach((line, index) => {
      const patch = {
        paymentStatus: fixedPaymentStatus,
        method: editForm.method,
        paidAt: paidAtIso,
        refundAt: "",
        amount: distributedAmounts[index] ?? 0,
        refundAmount: 0,
        refundFlag: false,
        realisasiStatus: "sudah_terealisasi",
      };

      patchMap.set(`${line.id}::${line.ticketId}`, patch);
      saveInvoiceLineOverride(line.id, line.ticketId, patch);

      if (getTicketById(line.ticketId)) {
        saveTicketOverride(line.ticketId, {
          paymentStatus: patch.paymentStatus,
          paidAt: patch.paidAt || "",
          realisasiStatus: patch.realisasiStatus,
          qrActive: patch.paymentStatus === "sudah_bayar",
        });
      }
    });

    setPaymentLines((prev) =>
      prev.map((line) => {
        const key = `${line.id}::${line.ticketId}`;
        if (!patchMap.has(key)) return line;
        return { ...line, ...patchMap.get(key) };
      }),
    );

    setShowEditDialog(false);
  };
  const handleExportXls = () => {
    const rowsToExport =
      activeTab === "pengembalian" ? filteredRefundRecords : filteredIncomingRecords;
    const sheetName = activeTab === "pengembalian" ? "Refunds" : "Payments";
    const filenamePrefix = activeTab === "pengembalian" ? "refunds_export" : "payments_export";

    exportExcel(
      rowsToExport.map((invoice) => ({
        invoice_id: invoice.id,
        ticket_id: invoice.ticketId,
        jumlah_masuk: invoice.jumlahMasuk,
        jumlah_keluar: invoice.jumlahKeluar,
        payment_status: invoice.paymentStatus,
        method: invoice.method,
        paid_at: invoice.tanggalMasuk || "",
        refund_at: invoice.tanggalKeluar || "",
        realisasi_status: invoice.realisasiStatus || "",
        refund_flag: invoice.refundFlag ? "yes" : "no",
      })),
      `${filenamePrefix}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      {
        sheetName,
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
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={handleExportXls}
            >
              <Download className="w-4 h-4" />
              Export XLS
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={handleExportPdf}
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </>
        }
      />
      <div className="flex-1 overflow-auto overscroll-contain p-6">
        <div className="grid gap-4 mb-6 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Pembayaran Masuk
            </p>
            <p className="text-xl sm:text-2xl font-bold leading-tight break-words">
              {paidInvoices.length}
            </p>
            <p className={`mt-1 text-[10px] leading-tight ${kpiTrends.paidCount.className}`}>
              {kpiTrends.paidCount.text}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Tanda Pengembalian Dana
            </p>
            <p className="text-xl sm:text-2xl font-bold text-status-revision leading-tight break-words">
              {paymentLines.filter((i) => i.refundFlag).length}
            </p>
            <p className={`mt-1 text-[10px] leading-tight ${kpiTrends.refundCount.className}`}>
              {kpiTrends.refundCount.text}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Total Potensi Terbayar Rp.
            </p>
            <p className="text-lg sm:text-xl font-bold text-status-approved leading-tight break-words">
              {formatNominal(totalPotential)}
            </p>
            <p className={`mt-1 text-[10px] leading-tight ${kpiTrends.potential.className}`}>
              {kpiTrends.potential.text}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Total Realisasi Rp.
            </p>
            <p className="text-lg sm:text-xl font-bold text-primary leading-tight break-words">
              {formatNominal(totalRealized)}
            </p>
            <p className={`mt-1 text-[10px] leading-tight ${kpiTrends.realized.className}`}>
              {kpiTrends.realized.text}
            </p>
          </Card>
          <Card className="card-ocean p-4 min-w-0">
            <p className="text-xs text-muted-foreground mb-1 break-words">
              Selisih Belum Terbayar Rp.
            </p>
            <p className="text-lg sm:text-xl font-bold text-status-pending leading-tight break-words">
              {formatNominal(unpaidGap)}
            </p>
            <p className={`mt-1 text-[10px] leading-tight ${kpiTrends.unpaidGap.className}`}>
              {kpiTrends.unpaidGap.text}
            </p>
          </Card>
        </div>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:w-[520px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Invoice, ID Tiket, atau Operator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button
            className="btn-ocean gap-2 w-full sm:w-auto lg:h-10 lg:shrink-0"
            onClick={openAddTransaction}
          >
            <Plus className="w-4 h-4" />
            Tambah Transaksi
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
          <TabsList className="grid h-auto w-full grid-cols-1 gap-1 rounded-lg p-1 sm:grid-cols-2">
            <TabsTrigger value="pembayaran" className="w-full px-3 py-2 text-center">
              Pembayaran Masuk ({filteredIncomingRecords.length})
            </TabsTrigger>
            <TabsTrigger value="pengembalian" className="w-full px-3 py-2 text-center">
              Pengembalian ({filteredRefundRecords.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pembayaran" className="mt-0">
            <Card className="card-ocean overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID Invoice</th>
                      <th>Nama Operator</th>
                      <th className="text-right">Jumlah Masuk Rp</th>
                      <th>Tanggal Masuk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncomingRecords.map((invoice) => (
                      <tr key={`${invoice.id}-${invoice.ticketId}`}>
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
                        <td className="text-sm text-muted-foreground">
                          {invoice.tanggalMasuk ? formatDateTime(invoice.tanggalMasuk) : "-"}
                        </td>
                      </tr>
                    ))}
                    {!filteredIncomingRecords.length && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                          Belum ada pembayaran masuk.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="pengembalian" className="mt-0">
            <Card className="card-ocean overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID Invoice</th>
                      <th>Nama Operator</th>
                      <th className="text-right">Jumlah Keluar Rp</th>
                      <th>Tanggal Keluar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRefundRecords.map((invoice) => (
                      <tr key={`${invoice.id}-${invoice.ticketId}`}>
                        <td>
                          <span className="font-mono text-sm font-medium">
                            {formatShortId(invoice.id)}
                          </span>
                        </td>
                        <td className="text-sm">{invoice.operatorName}</td>
                        <td className="text-right">
                          <span className="text-sm font-semibold">
                            {formatNominal(invoice.jumlahKeluar)}
                          </span>
                        </td>
                        <td className="text-sm text-muted-foreground">
                          {invoice.tanggalKeluar ? formatDateTime(invoice.tanggalKeluar) : "-"}
                        </td>
                      </tr>
                    ))}
                    {!filteredRefundRecords.length && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                          Belum ada pengembalian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Transaksi</DialogTitle>
              <DialogDescription>
                Pilih invoice terlebih dahulu, lalu isi detail transaksi.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div className="space-y-2 md:col-span-2">
                <Label>ID Invoice</Label>
                <Popover open={invoicePickerOpen} onOpenChange={setInvoicePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={invoicePickerOpen}
                      className="w-full justify-between bg-background font-normal"
                    >
                      {selectedInvoiceOption
                        ? `${formatShortId(selectedInvoiceOption.id)} - ${selectedInvoiceOption.operatorName}`
                        : "Cari dan pilih ID Invoice"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder="Cari ID invoice atau operator..." />
                      <CommandList>
                        <CommandEmpty>Invoice belum bayar tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {invoiceOptions.map((option) => (
                            <CommandItem
                              key={option.id}
                              value={`${option.id} ${option.operatorName}`}
                              onSelect={() => handleSelectInvoice(option.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  editForm.invoiceId === option.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {formatShortId(option.id)} - {option.operatorName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {option.ticketCount} tiket | Rp {formatNominal(option.totalAmount)}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedInvoiceOption && (
                  <p className="text-xs text-muted-foreground">
                    Invoice {formatShortId(selectedInvoiceOption.id)} dipilih.
                  </p>
                )}
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
                    {PAYMENT_METHOD_OPTIONS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
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
              {editError && (
                <p className="md:col-span-2 text-xs text-destructive">{editError}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false);
                }}
              >
                Batal
              </Button>
              <Button className="btn-ocean" onClick={handleSaveEdit}>
                Simpan Transaksi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
