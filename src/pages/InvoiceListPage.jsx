import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  Printer,
  FileText,
} from "lucide-react";
import { dummyInvoices, formatDate, formatRupiah, getTicketById } from "@/data/dummyData";
import { buildInvoicesFromLines } from "@/features/invoices/invoiceUtils";
import { exportExcel } from "@/lib/exporters";
import { getUserRole, isAdministrator } from "@/lib/rbac";

const OPERATOR_LABELS = {
  homestay: "Homestay",
  resort: "Resort",
  kapal: "Kapal",
  dive_center: "Dive Center",
  mandiri: "Mandiri",
  lainnya: "Lainnya",
};

const getOverviewOperatorCategory = (ticket) => {
  if (!ticket) return "lainnya";
  if (ticket.bookingType === "group") return "kapal";
  if (ticket.feeCategory === "mooring") return "kapal";
  if (ticket.feeCategory === "sport_fishing") return "dive_center";
  if (ticket.operatorType === "qris") return "homestay";
  if (ticket.operatorType === "doku") return "resort";
  if (ticket.operatorType === "loket") return "mandiri";
  if (ticket.operatorType === "transfer") return "lainnya";
  return "lainnya";
};

const getDominantOperatorCategory = (categories) => {
  if (!categories.length) return "lainnya";
  const countMap = categories.reduce((acc, key) => {
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(countMap).sort((a, b) => b[1] - a[1])[0][0] || "lainnya";
};

const formatCurrencyNumber = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const isDateInFilter = (dateInput, filter) => {
  if (!dateInput || filter === "all") return true;
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();

  if (filter === "today") {
    return date.toDateString() === now.toDateString();
  }
  if (filter === "week") {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo && date <= now;
  }
  if (filter === "month") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  if (filter === "year") {
    return date.getFullYear() === now.getFullYear();
  }
  return true;
};

const isTicketCountInFilter = (count, filter) => {
  if (filter === "all") return true;
  if (filter === "1") return count === 1;
  if (filter === "2_5") return count >= 2 && count <= 5;
  if (filter === "6_plus") return count >= 6;
  return true;
};

const isTotalInFilter = (total, filter) => {
  if (filter === "all") return true;
  if (filter === "under_500k") return total < 500000;
  if (filter === "500k_2m") return total >= 500000 && total <= 2000000;
  if (filter === "2m_10m") return total > 2000000 && total <= 10000000;
  if (filter === "above_10m") return total > 10000000;
  return true;
};

export default function InvoiceListPage() {
  const role = getUserRole();
  const canExport = isAdministrator(role);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceNoFilter, setInvoiceNoFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [operatorFilter, setOperatorFilter] = useState("all");
  const [ticketCountFilter, setTicketCountFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [totalFilter, setTotalFilter] = useState("all");
  const invoices = useMemo(() => buildInvoicesFromLines(dummyInvoices), []);
  const enrichedInvoices = useMemo(
    () =>
      invoices.map((inv) => {
        const operatorCategories = 
          inv.tickets
            .map((row) => getOverviewOperatorCategory(getTicketById(row.ticketId)))
            .filter(Boolean);
        const operatorType = getDominantOperatorCategory(operatorCategories);
        const normalizedStatus =
          inv.paymentStatus === "sudah_bayar" ? "sudah_bayar" : "belum_bayar";

        return {
          ...inv,
          operatorType,
          operatorLabel: OPERATOR_LABELS[operatorType] || OPERATOR_LABELS.lainnya,
          normalizedStatus,
        };
      }),
    [invoices],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const invoiceNoQuery = invoiceNoFilter.toLowerCase().trim();
    return enrichedInvoices.filter((inv) => {
      const matchesSearch =
        !q ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.invoiceId.toLowerCase().includes(q) ||
        inv.billedTo.name.toLowerCase().includes(q) ||
        inv.billedTo.email.toLowerCase().includes(q);
      const matchesInvoiceNo =
        !invoiceNoQuery || inv.invoiceNo.toLowerCase().includes(invoiceNoQuery);
      const matchesType = typeFilter === "all" || inv.invoiceType === typeFilter;
      const matchesDate = isDateInFilter(inv.issuedAt, dateFilter);
      const matchesOperator =
        operatorFilter === "all" || inv.operatorType === operatorFilter;
      const matchesTicketCount = isTicketCountInFilter(
        inv.ticketCount,
        ticketCountFilter,
      );
      const matchesStatus =
        statusFilter === "all" || inv.normalizedStatus === statusFilter;
      const matchesTotal = isTotalInFilter(inv.grandTotal, totalFilter);

      return (
        matchesSearch &&
        matchesInvoiceNo &&
        matchesType &&
        matchesDate &&
        matchesOperator &&
        matchesTicketCount &&
        matchesStatus &&
        matchesTotal
      );
    });
  }, [
    enrichedInvoices,
    searchQuery,
    invoiceNoFilter,
    typeFilter,
    dateFilter,
    operatorFilter,
    ticketCountFilter,
    statusFilter,
    totalFilter,
  ]);
  const stats = useMemo(() => {
    const total = filtered.reduce((acc, i) => acc + i.grandTotal, 0);
    const individualCount = filtered.filter(
      (i) => i.invoiceType === "perorangan",
    ).length;
    const groupCount = filtered.filter((i) => i.invoiceType === "group").length;
    return {
      total,
      individualCount,
      groupCount,
    };
  }, [filtered]);
  const handleExport = () => {
    if (!canExport) return;
    exportExcel(
      filtered.map((i) => ({
        invoice_id: i.invoiceId,
        invoice_no: i.invoiceNo,
        invoice_type: i.invoiceType,
        issued_at: i.issuedAt,
        billed_name: i.billedTo.name,
        billed_email: i.billedTo.email,
        ticket_count: i.ticketCount,
        payment_status: i.paymentStatus,
        method: i.method,
        refund_flag: i.refundFlag ? "yes" : "no",
        total: i.grandTotal,
      })),
      `invoice_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      {
        sheetName: "Invoices",
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
        title="Invoice"
        subtitle="Data invoice tarif jasa lingkungan masuk kawasan konservasi"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari invoice, nama, email..."
              className="pl-9 bg-card"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters((s) => !s)}
            >
              <Filter className="w-4 h-4" />
              Filter
              {showFilters ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleExport}
              disabled={!canExport}
              title={
                !canExport ? "Hanya Admin Utama yang bisa export" : "Export XLS"
              }
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

        {showFilters && (
          <Card className="card-ocean animate-fade-in">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    No. Invoice
                  </label>
                  <Input
                    value={invoiceNoFilter}
                    onChange={(e) => setInvoiceNoFilter(e.target.value)}
                    placeholder="INV-2024-001"
                    className="bg-background"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Tipe Invoice
                  </label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="perorangan">Perorangan</SelectItem>
                      <SelectItem value="group">Grup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Tanggal
                  </label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="week">7 Hari Terakhir</SelectItem>
                      <SelectItem value="month">Bulan Ini</SelectItem>
                      <SelectItem value="year">Tahun Ini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Operator
                  </label>
                  <Select
                    value={operatorFilter}
                    onValueChange={setOperatorFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="homestay">Homestay</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                      <SelectItem value="kapal">Kapal</SelectItem>
                      <SelectItem value="dive_center">Dive Center</SelectItem>
                      <SelectItem value="mandiri">Mandiri</SelectItem>
                      <SelectItem value="lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Jumlah Tiket
                  </label>
                  <Select
                    value={ticketCountFilter}
                    onValueChange={setTicketCountFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="1">1 tiket</SelectItem>
                      <SelectItem value="2_5">2 - 5 tiket</SelectItem>
                      <SelectItem value="6_plus">6+ tiket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="sudah_bayar">Sudah dibayar</SelectItem>
                      <SelectItem value="belum_bayar">Belum dibayar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Total
                  </label>
                  <Select value={totalFilter} onValueChange={setTotalFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="under_500k">&lt; 500.000</SelectItem>
                      <SelectItem value="500k_2m">500.000 - 2.000.000</SelectItem>
                      <SelectItem value="2m_10m">2.000.001 - 10.000.000</SelectItem>
                      <SelectItem value="above_10m">&gt; 10.000.000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setInvoiceNoFilter("");
                      setTypeFilter("all");
                      setDateFilter("all");
                      setOperatorFilter("all");
                      setTicketCountFilter("all");
                      setStatusFilter("all");
                      setTotalFilter("all");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* {!canExport && (
                <p className="text-xs text-muted-foreground mt-3">
                  Role kamu: <span className="font-medium text-foreground">{role}</span>. Export hanya untuk <span className="font-medium text-foreground">Admin Utama</span>.
                </p>
               )} */}
            </CardContent>
          </Card>
        )}

        <Card className="card-ocean">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Badge variant="secondary">
                Invoice Individu: {stats.individualCount}
              </Badge>
              <Badge variant="secondary">
                Invoice Grup: {stats.groupCount}
              </Badge>
              <Separator orientation="vertical" className="h-5" />
              <span className="text-muted-foreground">Total:</span>
              <span className="font-semibold text-primary">
                {formatRupiah(stats.total)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No. Invoice</th>
                  <th>Tipe</th>
                  <th>Tanggal</th>
                  <th>Pemesan</th>
                  <th>Operator</th>
                  <th className="text-right">Jumlah tiket</th>
                  <th>Status</th>
                  <th className="text-right">Total Rp</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr key={inv.invoiceId}>
                    <td className="whitespace-nowrap font-mono text-sm font-medium text-primary">
                      {inv.invoiceNo}
                    </td>
                    <td>
                      <Badge variant="secondary">
                        {inv.invoiceType === "group" ? "Grup" : "Individu"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap text-sm">
                      {formatDate(inv.issuedAt)}
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-medium">
                          {inv.billedTo.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inv.billedTo.email}
                        </p>
                      </div>
                    </td>
                    <td className="text-sm">{inv.operatorLabel}</td>
                    <td className="text-right text-sm font-medium">
                      {inv.ticketCount}
                    </td>
                    <td>
                      <span
                        className={
                          inv.normalizedStatus === "sudah_bayar"
                            ? "inline-flex items-center rounded-full bg-status-approved-bg px-2.5 py-0.5 text-xs font-medium text-status-approved"
                            : "inline-flex items-center rounded-full bg-status-pending-bg px-2.5 py-0.5 text-xs font-medium text-status-pending"
                        }
                      >
                        {inv.normalizedStatus === "sudah_bayar"
                          ? "Sudah dibayar"
                          : "Belum dibayar"}
                      </span>
                    </td>
                    <td className="text-right text-sm font-semibold">
                      {formatCurrencyNumber(inv.grandTotal)}
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/invoices/${inv.invoiceId}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Detail Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link
                          to={`/invoices/${inv.invoiceId}?print=1`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Cetak Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-10 text-sm text-muted-foreground"
                    >
                      Tidak ada invoice yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
