import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import {
  getAllTickets,
  formatShortId,
  FEE_PRICING,
  DOMISILI_LABELS,
  BOOKING_TYPE_LABELS,
  formatDate,
} from "@/data/dummyData";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  User,
  FileText,
  Printer,
  Users,
  FileCheck,
  Landmark,
  IdCard,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { exportExcel } from "@/lib/exporters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function TicketListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(true);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const getPaymentType = (ticket) => {
    if (ticket.operatorType === "doku") return "online";
    return "on_the_spot";
  };
  const isInternationalTicket = (ticket) =>
    ticket.domisiliOCR === "mancanegara" ||
    ticket.feeCategory?.includes("mancanegara");
  const getPaymentStatusLabel = (ticket) => {
    switch (ticket.paymentStatus) {
      case "sudah_bayar":
        return {
          label: "Success",
          className: "bg-status-approved-bg text-status-approved",
        };
      case "belum_bayar":
        return {
          label: "Pending",
          className: "bg-status-pending-bg text-status-pending",
        };
      case "gagal":
      case "unsuccessful":
        return {
          label: "Unsuccessful",
          className: "bg-status-rejected-bg text-status-rejected",
        };
      case "no_activity":
        return {
          label: "No Activity",
          className: "bg-muted text-muted-foreground",
        };
      default:
        return {
          label: "No Activity",
          className: "bg-muted text-muted-foreground",
        };
    }
  };
  const getTicketTime = (ticket) =>
    new Date(ticket.createdAt).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const allTickets = getAllTickets();

  // Filter tickets
  const filteredTickets = allTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApproval =
      approvalFilter === "all" || ticket.approvalStatus === approvalFilter;
    const matchesPayment =
      paymentFilter === "all" || ticket.paymentStatus === paymentFilter;
    const matchesPaymentType =
      paymentTypeFilter === "all" ||
      getPaymentType(ticket) === paymentTypeFilter;
    const matchesCategory =
      categoryFilter === "all" || ticket.feeCategory === categoryFilter;
    return (
      matchesSearch &&
      matchesApproval &&
      matchesPayment &&
      matchesPaymentType &&
      matchesCategory
    );
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };
  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5" />
    );
  };
  const handleExportXls = () => {
    exportExcel(
      sortedTickets.map((ticket) => ({
        ticket_id: ticket.id,
        nama: ticket.namaLengkap,
        email: ticket.email,
        no_hp: ticket.noHP,
        domisili: DOMISILI_LABELS[ticket.domisiliOCR] || ticket.domisiliOCR,
        booking_type:
          BOOKING_TYPE_LABELS[ticket.bookingType] || ticket.bookingType,
        fee_category:
          FEE_PRICING[ticket.feeCategory]?.label || ticket.feeCategory,
        total_biaya: ticket.totalBiaya,
        payment_status: ticket.paymentStatus,
        approval_status: ticket.approvalStatus,
        created_at: ticket.createdAt,
      })),
      `tickets_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      {
        sheetName: "Tickets",
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
        title="Daftar Tiket"
        subtitle="Data master semua tiket biaya konservasi"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Search & Actions Bar */}
        <div className="flex flex-col gap-3 mb-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID Tiket, nama, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
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

        {/* Filters */}
        {showFilters && (
          <Card className="mb-4 card-ocean animate-fade-in">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status Persetujuan
                  </label>
                  <Select
                    value={approvalFilter}
                    onValueChange={setApprovalFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="menunggu">Menunggu</SelectItem>
                      <SelectItem value="disetujui">Disetujui</SelectItem>
                      <SelectItem value="ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status Pembayaran
                  </label>
                  <Select
                    value={paymentFilter}
                    onValueChange={setPaymentFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                      <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                      <SelectItem value="refund_diproses">
                        Pengembalian Diproses
                      </SelectItem>
                      <SelectItem value="refund_selesai">
                        Pengembalian Selesai
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Tipe Pembayaran
                  </label>
                  <Select
                    value={paymentTypeFilter}
                    onValueChange={setPaymentTypeFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="on_the_spot">On the spot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Kategori Biaya
                  </label>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      {Object.entries(FEE_PRICING).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end sm:col-span-2 lg:col-span-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setApprovalFilter("all");
                      setPaymentFilter("all");
                      setPaymentTypeFilter("all");
                      setCategoryFilter("all");
                    }}
                    className="text-xs w-full sm:w-auto"
                  >
                    Atur Ulang Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Info */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-muted-foreground">
            Menampilkan{" "}
            <span className="font-medium text-foreground">
              {sortedTickets.length}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-foreground">
              {allTickets.length}
            </span>{" "}
            tiket
          </p>
        </div>

        {/* Table */}
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Tanggal <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th>Waktu</th>
                  <th
                    className="cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center gap-1">
                      ID Tiket <SortIcon field="id" />
                    </div>
                  </th>
                  <th>Tipe</th>
                  <th>Tipe Pembayaran</th>
                  <th>Domisili</th>
                  <th>Status Pembayaran</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {sortedTickets.map((ticket) => {
                  const paymentStatus = getPaymentStatusLabel(ticket);
                  return (
                    <tr key={ticket.id} className="group">
                      <td className="whitespace-nowrap text-sm">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="whitespace-nowrap text-sm text-muted-foreground">
                        {getTicketTime(ticket)}
                      </td>
                      <td className="whitespace-nowrap">
                        <Link
                          to={`/tickets/${ticket.id}`}
                          className="font-mono text-sm font-medium text-primary hover:underline whitespace-nowrap"
                        >
                          {formatShortId(ticket.id)}
                        </Link>
                      </td>

                      <td>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">
                            {BOOKING_TYPE_LABELS[ticket.bookingType]}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            getPaymentType(ticket) === "online"
                              ? "inline-flex items-center rounded-full bg-status-approved-bg px-2.5 py-0.5 text-xs font-medium text-status-approved"
                              : "inline-flex items-center rounded-full bg-status-pending-bg px-2.5 py-0.5 text-xs font-medium text-status-pending"
                          }
                        >
                          {getPaymentType(ticket) === "online"
                            ? "Online"
                            : "On the spot"}
                        </span>
                      </td>

                      <td>
                        <span className="text-sm">
                          {DOMISILI_LABELS[ticket.domisiliOCR]}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentStatus.className}`}
                        >
                          {paymentStatus.label}
                        </span>
                      </td>

                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <Link to={`/tickets/${ticket.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Detail tiket"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>

                          {isInternationalTicket(ticket) ? (
                            <Link to={`/payments/${ticket.id}?type=turis`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Bukti Pembayaran Turis"
                              >
                                <FileCheck className="w-4 h-4" />
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/payments/${ticket.id}?type=blud`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                title="Bukti Pembayaran BLUD UPTD KKP"
                              >
                                <Landmark className="w-4 h-4" />
                              </Button>
                            </Link>
                          )}

                          <Link to={`/cards/${ticket.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Cetak Kartu TJL"
                            >
                              <IdCard className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
