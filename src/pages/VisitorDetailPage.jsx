import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, AlertTriangle, Eye, FileText } from "lucide-react";
import {
  FEE_PRICING,
  formatDate,
  formatRupiah,
  formatShortId,
  getAllInvoiceLines,
  getAllTickets,
  getInvoiceIdForTicket,
} from "@/data/dummyData";
import {
  getTicketActivityInfo,
  groupTicketsByVisitor,
  loadHiddenVisitorKeys,
} from "@/features/visitors/visitorUtils";

const PAYMENT_STATUS_LABELS = {
  sudah_bayar: "Sudah Bayar",
  belum_bayar: "Belum Bayar",
  tidak_bayar: "Tidak Bayar",
  refund_diajukan: "Refund Diajukan",
  refund_diproses: "Refund Diproses",
  refund_selesai: "Refund Selesai",
  unsuccessful: "Tidak Berhasil",
  no_activity: "Belum Ada Aktivitas",
};

const REALISASI_STATUS_LABELS = {
  sudah_terealisasi: "Sudah Terealisasi",
  belum_terealisasi: "Belum Terealisasi",
};

const getPaymentBadgeClass = (paymentStatus) => {
  if (paymentStatus === "sudah_bayar") {
    return "bg-status-approved-bg text-status-approved";
  }
  if (String(paymentStatus || "").startsWith("refund_")) {
    return "bg-status-revision-bg text-status-revision";
  }
  if (paymentStatus === "belum_bayar" || paymentStatus === "tidak_bayar") {
    return "bg-status-pending-bg text-status-pending";
  }
  return "bg-slate-200 text-slate-700";
};

const getRealisasiBadgeClass = (realisasiStatus) => {
  if (realisasiStatus === "sudah_terealisasi") {
    return "bg-status-approved-bg text-status-approved";
  }
  return "bg-status-pending-bg text-status-pending";
};

const resolveInvoicePaymentStatus = (statuses) => {
  if (statuses.some((status) => String(status || "").startsWith("refund_"))) {
    return statuses.find((status) => String(status || "").startsWith("refund_")) || "refund_diajukan";
  }
  if (statuses.includes("belum_bayar")) return "belum_bayar";
  if (statuses.includes("sudah_bayar")) return "sudah_bayar";
  return statuses[0] || "no_activity";
};

const resolveInvoiceRealisasiStatus = (statuses) => {
  if (!statuses.length) return "belum_terealisasi";
  return statuses.every((status) => status === "sudah_terealisasi")
    ? "sudah_terealisasi"
    : "belum_terealisasi";
};

const isChildTicket = (ticket) =>
  Boolean(
    ticket?.isChildVisitor ||
      ticket?.relationshipToParent === "anak" ||
      ticket?.parentTicketId,
  );

export default function VisitorDetailPage() {
  const { visitorKey } = useParams();
  const [statusFilter, setStatusFilter] = useState("all");
  const decodedVisitorKey = useMemo(() => {
    if (!visitorKey) return "";
    try {
      return decodeURIComponent(visitorKey);
    } catch {
      return visitorKey;
    }
  }, [visitorKey]);

  const allVisitors = useMemo(() => {
    const tickets = getAllTickets();
    const hiddenVisitorKeys = loadHiddenVisitorKeys();
    return groupTicketsByVisitor(tickets, hiddenVisitorKeys);
  }, []);

  const visitor = useMemo(
    () => allVisitors.find((item) => item.visitorKey === decodedVisitorKey) || null,
    [allVisitors, decodedVisitorKey],
  );

  const ticketRows = useMemo(() => {
    if (!visitor) return [];
    return [...visitor.tickets]
      .sort((a, b) => {
        const aTime = new Date(a.paidAt || a.createdAt || 0).getTime();
        const bTime = new Date(b.paidAt || b.createdAt || 0).getTime();
        return bTime - aTime;
      })
      .map((ticket) => {
        const activity = getTicketActivityInfo(ticket);
        return {
          ticket,
          activity,
          invoiceId: getInvoiceIdForTicket(ticket.id) || "",
        };
      });
  }, [visitor]);

  const invoiceRows = useMemo(() => {
    if (!visitor) return [];
    const ticketIdSet = new Set(visitor.tickets.map((ticket) => ticket.id));
    const groupedInvoices = new Map();

    getAllInvoiceLines()
      .filter((line) => ticketIdSet.has(line.ticketId))
      .forEach((line) => {
        const current = groupedInvoices.get(line.id) || {
          id: line.id,
          lines: [],
        };
        current.lines.push(line);
        groupedInvoices.set(line.id, current);
      });

    return Array.from(groupedInvoices.values())
      .map((invoice) => {
        const paidAtCandidates = invoice.lines
          .map((line) => line.paidAt)
          .filter(Boolean)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        const paymentStatuses = [...new Set(invoice.lines.map((line) => line.paymentStatus).filter(Boolean))];
        const realisasiStatuses = [...new Set(invoice.lines.map((line) => line.realisasiStatus).filter(Boolean))];

        return {
          id: invoice.id,
          paidAt: paidAtCandidates[0] || "",
          ticketIds: [...new Set(invoice.lines.map((line) => line.ticketId).filter(Boolean))],
          totalAmount: invoice.lines.reduce((sum, line) => sum + (Number(line.amount) || 0), 0),
          paymentStatus: resolveInvoicePaymentStatus(paymentStatuses),
          realisasiStatus: resolveInvoiceRealisasiStatus(realisasiStatuses),
        };
      })
      .sort((a, b) => {
        const aTime = new Date(a.paidAt || 0).getTime();
        const bTime = new Date(b.paidAt || 0).getTime();
        return bTime - aTime;
      });
  }, [visitor]);

  const visitorDocumentPreview = useMemo(() => {
    if (!visitor) {
      return {
        identityDocumentUrl: "/placeholder.svg",
        selfieUrl: "/placeholder.svg",
      };
    }

    const identityTicket =
      visitor.tickets.find(
        (ticket) =>
          ticket.identityDocumentUrl || ticket.ktmUrl || ticket.fotoIdentitasPenanggungJawabUrl,
      ) || visitor.tickets[0];
    const selfieTicket =
      visitor.tickets.find((ticket) => ticket.selfieUrl || ticket.fotoIdentitasPenanggungJawabUrl) ||
      identityTicket;

    return {
      identityDocumentUrl:
        identityTicket?.identityDocumentUrl ||
        identityTicket?.ktmUrl ||
        identityTicket?.fotoIdentitasPenanggungJawabUrl ||
        "/placeholder.svg",
      selfieUrl:
        selfieTicket?.selfieUrl || selfieTicket?.fotoIdentitasPenanggungJawabUrl || "/placeholder.svg",
    };
  }, [visitor]);

  const activeCount = ticketRows.filter((row) => row.activity.status === "active").length;
  const inactiveCount = ticketRows.length - activeCount;

  const filteredRows = useMemo(() => {
    if (statusFilter === "all") return ticketRows;
    return ticketRows.filter((row) => row.activity.status === statusFilter);
  }, [ticketRows, statusFilter]);

  if (!visitor) {
    return (
      <AdminLayout>
        <AdminHeader
          title="Detail Visitor"
          subtitle="Data visitor tidak ditemukan."
          showSearch={false}
          showDateFilter={false}
        />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Visitor Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Data visitor tidak tersedia atau sudah dihapus dari daftar.
            </p>
            <Link to="/visitors">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Visitor
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
        title="Detail Visitor"
        subtitle={`${visitor.namaLengkap} - daftar tiket berdasarkan masa berlaku`}
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <Link to="/visitors">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Visitor
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Informasi Visitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nama</p>
                    <p className="text-sm font-medium">{visitor.namaLengkap || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium">{visitor.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">No Telp</p>
                    <p className="text-sm font-medium">{visitor.noHP || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">No Identitas</p>
                    <p className="text-sm font-medium">
                      {visitor.noIdentitasDisplay || visitor.noIdentitas || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">Total Tiket</p>
                <p className="text-2xl font-bold">{ticketRows.length}</p>
              </div>
              <div className="rounded-lg border border-status-approved/30 bg-status-approved-bg/50 p-3">
                <p className="text-xs text-muted-foreground">Tiket Active</p>
                <p className="text-2xl font-bold text-status-approved">{activeCount}</p>
              </div>
              <div className="rounded-lg border border-slate-300 bg-slate-100/70 p-3">
                <p className="text-xs text-muted-foreground">Tiket Inactive</p>
                <p className="text-2xl font-bold text-slate-700">{inactiveCount}</p>
              </div>
            </div>

            <Card className="card-ocean overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Daftar Invoice Visitor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="data-table min-w-[900px]">
                    <thead>
                      <tr>
                        <th>ID Invoice</th>
                        <th className="text-center">Total Tiket</th>
                        <th>Total Tagihan</th>
                        <th>Tanggal Bayar</th>
                        <th>Status Pembayaran</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceRows.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="font-mono text-sm">{formatShortId(invoice.id)}</td>
                          <td className="text-center text-sm">{invoice.ticketIds.length}</td>
                          <td className="text-sm">{formatRupiah(invoice.totalAmount)}</td>
                          <td className="text-sm">{invoice.paidAt ? formatDate(invoice.paidAt) : "-"}</td>
                          <td>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRealisasiBadgeClass(invoice.realisasiStatus)}`}
                            >
                              {REALISASI_STATUS_LABELS[invoice.realisasiStatus] ||
                                invoice.realisasiStatus ||
                                "-"}
                            </span>
                          </td>
                          <td className="text-left">
                            <Link to={`/invoices/${invoice.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Detail invoice">
                                <FileText className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {!invoiceRows.length && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                            Visitor ini belum memiliki invoice.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="card-ocean overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-base font-semibold">Daftar Tiket Visitor</CardTitle>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[220px] bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua Tiket</SelectItem>
                      <SelectItem value="active">Tiket Active</SelectItem>
                      <SelectItem value="inactive">Tiket Non Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="data-table min-w-[980px]">
                    <thead>
                      <tr>
                        <th>ID Tiket</th>
                        <th>Kategori</th>
                        <th>Tanggal</th>
                        <th>Status Tiket</th>
                        <th>Invoice</th>
                        <th className="text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((row) => (
                        <tr key={row.ticket.id}>
                          <td className="font-mono text-sm">
                            {isChildTicket(row.ticket) ? "-" : formatShortId(row.ticket.id)}
                          </td>
                          <td className="text-sm">
                            {FEE_PRICING[row.ticket.feeCategory]?.label || row.ticket.feeCategory}
                          </td>
                          <td className="text-sm">
                            {formatDate(row.ticket.paidAt || row.ticket.createdAt)}
                          </td>
                          <td>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${row.activity.className}`}
                            >
                              {row.activity.label}
                            </span>
                          </td>
                          <td className="text-sm">
                            {row.invoiceId ? (
                              <span className="font-mono">{formatShortId(row.invoiceId)}</span>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td className="text-left">
                            <div className="flex items-left gap-1">
                              <Link to={`/tickets/${row.ticket.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Detail tiket">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!filteredRows.length && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                            Tidak ada tiket sesuai filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">File Identitas & Foto Diri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">KTP/SIM/PASPOR/KITAS/KITAP</p>
                  <div className="w-full aspect-video rounded-lg bg-muted overflow-hidden">
                    <img
                      src={visitorDocumentPreview.identityDocumentUrl}
                      alt="File identitas visitor"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-foreground">Foto Diri</p>
                  <div className="w-full aspect-video rounded-lg bg-muted overflow-hidden">
                    <img
                      src={visitorDocumentPreview.selfieUrl}
                      alt="Foto diri visitor"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
