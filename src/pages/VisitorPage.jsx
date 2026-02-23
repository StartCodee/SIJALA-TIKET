import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { exportExcel } from "@/lib/exporters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
} from "lucide-react";
import { getAllTickets, saveTicketOverride } from "@/data/dummyData";
import {
  getIdentityTypeLabel,
  getTicketActivityInfo,
  getTicketIdentityType,
  groupTicketsByVisitor,
  loadHiddenVisitorKeys,
  saveHiddenVisitorKeys,
} from "@/features/visitors/visitorUtils";

export default function VisitorPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [identityTypeFilter, setIdentityTypeFilter] = useState("all");
  const [ticketCountFilter, setTicketCountFilter] = useState("all");
  const [tickets, setTickets] = useState(() => getAllTickets());
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [hiddenVisitorKeys, setHiddenVisitorKeys] = useState(() => loadHiddenVisitorKeys());
  const [editForm, setEditForm] = useState({
    namaLengkap: "",
    email: "",
    noHP: "",
    noIdentitas: "",
  });

  const visitors = useMemo(
    () => groupTicketsByVisitor(tickets, hiddenVisitorKeys),
    [tickets, hiddenVisitorKeys],
  );

  const visitorsWithStats = useMemo(
    () =>
      visitors.map((visitor) => {
        const activeTicketCount = visitor.tickets.filter(
          (ticket) => getTicketActivityInfo(ticket).status === "active",
        ).length;
        const identityType = getTicketIdentityType(visitor.tickets[0]);
        return {
          ...visitor,
          identityType,
          identityTypeLabel: getIdentityTypeLabel(identityType),
          activeTicketCount,
          inactiveTicketCount: visitor.tickets.length - activeTicketCount,
          visitorStatus: activeTicketCount > 0 ? "active" : "inactive",
        };
      }),
    [visitors],
  );

  const filteredVisitors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return visitorsWithStats.filter((visitor) => {
      const matchesSearch =
        !query ||
        String(visitor.namaLengkap || "").toLowerCase().includes(query) ||
        String(visitor.email || "").toLowerCase().includes(query) ||
        String(visitor.noHP || "").toLowerCase().includes(query) ||
        String(visitor.noIdentitas || "").toLowerCase().includes(query) ||
        String(visitor.noIdentitasDisplay || "").toLowerCase().includes(query) ||
        String(visitor.identityTypeLabel || "").toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "all" || visitor.visitorStatus === statusFilter;
      const matchesIdentityType =
        identityTypeFilter === "all" || visitor.identityType === identityTypeFilter;
      const matchesTicketCount =
        ticketCountFilter === "all" ||
        (ticketCountFilter === "1" && visitor.tickets.length === 1) ||
        (ticketCountFilter === "2_5" &&
          visitor.tickets.length >= 2 &&
          visitor.tickets.length <= 5) ||
        (ticketCountFilter === "6_plus" && visitor.tickets.length >= 6);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesIdentityType &&
        matchesTicketCount
      );
    });
  }, [visitorsWithStats, searchQuery, statusFilter, identityTypeFilter, ticketCountFilter]);

  const handleExportXls = () => {
    exportExcel(
      filteredVisitors.map((visitor) => ({
        nama: visitor.namaLengkap,
        email: visitor.email,
        no_hp: visitor.noHP,
        jenis_identitas: visitor.identityTypeLabel,
        no_identitas: visitor.noIdentitas,
        status_visitor: visitor.visitorStatus === "active" ? "Active" : "Non Active",
        jumlah_tiket: visitor.tickets.length,
        tiket_active: visitor.activeTicketCount,
        tiket_non_active: visitor.inactiveTicketCount,
      })),
      `visitor_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      {
        sheetName: "Visitors",
      },
    );
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  const openEdit = (visitor) => {
    setSelectedVisitor(visitor);
    setEditForm({
      namaLengkap: visitor.namaLengkap === "-" ? "" : visitor.namaLengkap,
      email: visitor.email === "-" ? "" : visitor.email,
      noHP: visitor.noHP === "-" ? "" : visitor.noHP,
      noIdentitas: visitor.noIdentitas === "-" ? "" : visitor.noIdentitas,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedVisitor) return;
    const nextName = editForm.namaLengkap.trim();
    const nextEmail = editForm.email.trim();
    const nextNoHp = editForm.noHP.trim();
    const nextIdentityNumber = editForm.noIdentitas.trim();

    for (const ticket of selectedVisitor.tickets) {
      const currentIdentityType = String(ticket.identityType || (ticket.noKTP ? "ktp" : ""))
        .trim()
        .toLowerCase();
      const fallbackIdentityNumber = ticket.identityNumber || ticket.noKTP || "";

      saveTicketOverride(ticket.id, {
        namaLengkap: nextName || ticket.namaLengkap || "",
        email: nextEmail || ticket.email || "",
        noHP: nextNoHp || ticket.noHP || "",
        noKTP: currentIdentityType === "ktp" ? nextIdentityNumber : "",
        identityType: currentIdentityType,
        identityNumber: nextIdentityNumber || fallbackIdentityNumber,
      });
    }

    const selectedIds = new Set(selectedVisitor.tickets.map((ticket) => ticket.id));
    setTickets((prev) =>
      prev.map((ticket) => {
        if (!selectedIds.has(ticket.id)) return ticket;
        const currentIdentityType = String(ticket.identityType || (ticket.noKTP ? "ktp" : ""))
          .trim()
          .toLowerCase();
        const fallbackIdentityNumber = ticket.identityNumber || ticket.noKTP || "";
        return {
          ...ticket,
          namaLengkap: nextName || ticket.namaLengkap || "",
          email: nextEmail || ticket.email || "",
          noHP: nextNoHp || ticket.noHP || "",
          noKTP: currentIdentityType === "ktp" ? nextIdentityNumber : "",
          identityType: currentIdentityType,
          identityNumber: nextIdentityNumber || fallbackIdentityNumber,
        };
      }),
    );

    setShowEditDialog(false);
    setSelectedVisitor(null);
  };

  const openDelete = (visitor) => {
    setSelectedVisitor(visitor);
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    if (!selectedVisitor) return;
    const next = Array.from(new Set([...hiddenVisitorKeys, selectedVisitor.visitorKey]));
    setHiddenVisitorKeys(next);
    saveHiddenVisitorKeys(next);
    setShowDeleteDialog(false);
    setSelectedVisitor(null);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Visitor"
        subtitle="Data pengunjung dan riwayat tiket yang dimiliki."
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full min-w-[220px] lg:flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, no telp, atau no Identitas..."
              className="bg-card pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
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

        {showFilters && (
          <Card className="mb-4 card-ocean animate-fade-in">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Status Visitor
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Non Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Jenis Identitas
                  </label>
                  <Select value={identityTypeFilter} onValueChange={setIdentityTypeFilter}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="ktp">NIK</SelectItem>
                      <SelectItem value="sim">No SIM</SelectItem>
                      <SelectItem value="paspor">No Paspor</SelectItem>
                      <SelectItem value="kitas">No KITAS</SelectItem>
                      <SelectItem value="kitap">No KITAP</SelectItem>
                      <SelectItem value="dokumen_peneliti">Dokumen Peneliti</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                    Jumlah Tiket
                  </label>
                  <Select value={ticketCountFilter} onValueChange={setTicketCountFilter}>
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

                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setStatusFilter("all");
                      setIdentityTypeFilter("all");
                      setTicketCountFilter("all");
                    }}
                  >
                    Atur Ulang Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-3 text-sm text-muted-foreground">
          Menampilkan <span className="font-medium text-foreground">{filteredVisitors.length}</span> dari{" "}
          <span className="font-medium text-foreground">{visitorsWithStats.length}</span> visitor
        </div>

        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="data-table min-w-[980px]">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No Telp</th>
                  <th>No Identitas</th>
                  <th className="text-center">Jumlah Tiket</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.visitorKey}>
                    <td className="font-medium">{visitor.namaLengkap}</td>
                    <td>{visitor.email}</td>
                    <td>{visitor.noHP}</td>
                    <td>{visitor.noIdentitasDisplay || visitor.noIdentitas || "-"}</td>
                    <td className="text-center">{visitor.tickets.length}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/visitors/${encodeURIComponent(visitor.visitorKey)}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Detail tiket visitor"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="Edit visitor"
                          onClick={() => openEdit(visitor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Delete visitor"
                          onClick={() => openDelete(visitor)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredVisitors.length && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                      Tidak ada data visitor yang cocok.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Visitor</DialogTitle>
            <DialogDescription>
              Perubahan akan diterapkan ke semua tiket milik visitor ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Nama</Label>
              <Input
                value={editForm.namaLengkap}
                onChange={(e) => setEditForm((prev) => ({ ...prev, namaLengkap: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>No Telp</Label>
              <Input
                value={editForm.noHP}
                onChange={(e) => setEditForm((prev) => ({ ...prev, noHP: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>No Identitas</Label>
              <Input
                value={editForm.noIdentitas}
                onChange={(e) => setEditForm((prev) => ({ ...prev, noIdentitas: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button className="btn-ocean" onClick={handleSaveEdit}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Visitor</DialogTitle>
            <DialogDescription>
              Visitor {selectedVisitor?.namaLengkap || "-"} akan disembunyikan dari daftar visitor.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
