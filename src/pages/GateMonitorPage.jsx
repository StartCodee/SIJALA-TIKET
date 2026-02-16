import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FEE_PRICING,
  dummyTickets,
  formatDateTime,
  formatNominal,
  getInvoiceIdForTicket,
} from "@/data/dummyData";
import { ClipboardPen, Ticket, Wallet, ShieldCheck } from "lucide-react";

const APPROVAL_REQUIRED_CATEGORIES = new Set([
  "peneliti_domestik",
  "peneliti_mancanegara",
  "mooring",
  "sport_fishing",
]);

const CATEGORY_OPTIONS = Object.entries(FEE_PRICING).map(([value, config]) => ({
  value,
  label: config.label,
}));

const PAYMENT_METHOD_OPTIONS = [
  { value: "blud_bank_va", label: "BLUD R4 - Transfer Bank (VA)" },
  { value: "blud_qris", label: "BLUD R4 - QRIS" },
  { value: "blud_bank_direct", label: "BLUD R4 - Bank Langsung" },
  { value: "blud_cash", label: "BLUD R4 - Tunai" },
];

const GATE_OPTIONS = [
  "Waisai",
  "Friwen",
  "Kri",
  "Arborek",
  "Saporkren",
  "Yenbuba",
];

const OFFICER_OPTIONS = [
  "Rudi Hartono",
  "Sakamoto",
  "Bambang Susilo",
  "Nadia Putri",
];

const DOMESTIC_ID_OPTIONS = [
  { value: "ktp", label: "KTP" },
  { value: "sim", label: "SIM" },
  { value: "paspor", label: "Paspor" },
];

const FOREIGN_ID_OPTIONS = [
  { value: "paspor", label: "Paspor" },
  { value: "kitas", label: "KITAS" },
  { value: "kitap", label: "KITAP" },
];

const METHOD_LABELS = {
  blud_bank_va: "Transfer VA",
  blud_qris: "QRIS",
  blud_bank_direct: "Bank Langsung",
  blud_cash: "Tunai",
};

const getTicketVisitorCount = (ticket) => {
  if (ticket.bookingType !== "group") return 1;
  const total = Number(ticket.jumlahDomestik || 0) + Number(ticket.jumlahMancanegara || 0);
  return total > 0 ? total : 1;
};

const normalizeMethodByOperator = (operatorType) => {
  if (operatorType === "qris") return "blud_qris";
  if (operatorType === "transfer") return "blud_bank_va";
  return "blud_cash";
};

const getIdentityOptionsByCategory = (feeCategory) => {
  const category = String(feeCategory || "");
  if (category === "wisatawan_mancanegara" || category === "peneliti_mancanegara") {
    return FOREIGN_ID_OPTIONS;
  }
  return DOMESTIC_ID_OPTIONS;
};

export default function GateMonitorPage() {
  const [form, setForm] = useState({
    visitorName: "",
    email: "",
    phone: "",
    country: "Indonesia",
    identityType: "ktp",
    identityNumber: "",
    bookingType: "perorangan",
    visitorCount: 1,
    feeCategory: "wisatawan_domestik_pbd",
    paymentMethod: "blud_cash",
    gateName: "Waisai",
    officerName: "Rudi Hartono",
    ocrDisabled: false,
    ocrApprovalRef: "",
  });
  const [recentTransactions, setRecentTransactions] = useState(() =>
    dummyTickets
      .filter((ticket) => ticket.operatorType !== "doku")
      .slice(0, 8)
      .map((ticket) => ({
        id: `TRX-${ticket.id}`,
        ticketId: ticket.id,
        invoiceId: getInvoiceIdForTicket(ticket.id) || "-",
        visitorName: ticket.namaLengkap,
        feeCategory: ticket.feeCategory,
        visitorCount: getTicketVisitorCount(ticket),
        paymentMethod: normalizeMethodByOperator(ticket.operatorType),
        gateName: ticket.gateOfficerName ? "Onsite" : "Waisai",
        officerName: ticket.gateOfficerName || "Petugas Lapangan",
        amount: Number(ticket.totalBiaya || ticket.hargaPerOrang || 0),
        createdAt: ticket.createdAt,
        status:
          APPROVAL_REQUIRED_CATEGORIES.has(ticket.feeCategory) && ticket.approvalStatus !== "disetujui"
            ? "pending_persetujuan"
            : "sudah_dibayar",
      })),
  );
  const [lastCreated, setLastCreated] = useState(null);

  const idOptions = useMemo(
    () => getIdentityOptionsByCategory(form.feeCategory),
    [form.feeCategory],
  );
  const pricePerPerson = FEE_PRICING[form.feeCategory]?.price || 0;
  const normalizedCount = Math.max(1, Number(form.visitorCount) || 1);
  const grandTotal = pricePerPerson * normalizedCount;
  const needsApproval = APPROVAL_REQUIRED_CATEGORIES.has(form.feeCategory);

  const todaySummary = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    const todays = recentTransactions.filter((item) => {
      const date = new Date(item.createdAt);
      return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d;
    });
    return {
      count: todays.length,
      total: todays.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
      pendingApproval: todays.filter((item) => item.status === "pending_persetujuan").length,
    };
  }, [recentTransactions]);

  const handleCategoryChange = (value) => {
    const options = getIdentityOptionsByCategory(value);
    setForm((prev) => {
      const hasSelectedIdentity = options.some((opt) => opt.value === prev.identityType);
      return {
        ...prev,
        feeCategory: value,
        identityType: hasSelectedIdentity ? prev.identityType : options[0].value,
      };
    });
  };

  const handleReset = () => {
    setForm((prev) => ({
      ...prev,
      visitorName: "",
      email: "",
      phone: "",
      identityNumber: "",
      bookingType: "perorangan",
      visitorCount: 1,
      feeCategory: "wisatawan_domestik_pbd",
      paymentMethod: "blud_cash",
      country: "Indonesia",
      ocrDisabled: false,
      ocrApprovalRef: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const now = new Date();
    const ticketSuffix = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`.padStart(6, "0");
    const dateStamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
      now.getDate(),
    ).padStart(2, "0")}`;
    const ticketId = `ONS-${dateStamp}-${ticketSuffix}`;
    const invoiceId = `INV-OS-${dateStamp}-${ticketSuffix}`;
    const entry = {
      id: `TRX-${ticketId}`,
      ticketId,
      invoiceId,
      visitorName: form.visitorName || "Tanpa Nama",
      feeCategory: form.feeCategory,
      visitorCount: normalizedCount,
      paymentMethod: form.paymentMethod,
      gateName: form.gateName,
      officerName: form.officerName,
      amount: grandTotal,
      createdAt: now.toISOString(),
      status: needsApproval ? "pending_persetujuan" : "sudah_dibayar",
    };

    setRecentTransactions((prev) => [entry, ...prev].slice(0, 40));
    setLastCreated(entry);

    setForm((prev) => ({
      ...prev,
      visitorName: "",
      email: "",
      phone: "",
      identityNumber: "",
      bookingType: "perorangan",
      visitorCount: 1,
      ocrDisabled: false,
      ocrApprovalRef: "",
    }));
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Tiket Langsung (Onsite)"
        subtitle="Form khusus petugas tiket untuk input pembelian langsung di lokasi"
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-ocean border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transaksi Onsite Hari Ini</p>
                  <p className="text-3xl font-bold">{todaySummary.count}</p>
                </div>
                <ClipboardPen className="w-9 h-9 text-primary/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-ocean border-l-4 border-l-status-approved">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Nilai Hari Ini</p>
                  <p className="text-2xl font-bold">{formatNominal(todaySummary.total)}</p>
                </div>
                <Wallet className="w-9 h-9 text-status-approved/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-ocean border-l-4 border-l-status-pending">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Perlu Persetujuan</p>
                  <p className="text-3xl font-bold text-status-pending">{todaySummary.pendingApproval}</p>
                </div>
                <ShieldCheck className="w-9 h-9 text-status-pending/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 card-ocean">
            <CardHeader>
              <CardTitle className="text-lg">Input Pembelian Tiket Langsung</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nama Pengunjung</Label>
                    <Input
                      value={form.visitorName}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorName: e.target.value }))}
                      placeholder="Nama lengkap pengunjung"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Opsional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Kontak</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+62..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Domisili (Negara Asal)</Label>
                    <Input
                      value={form.country}
                      onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                      placeholder="Indonesia"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Identitas</Label>
                    <Select
                      value={form.identityType}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, identityType: value }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {idOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nomor Identitas</Label>
                    <Input
                      value={form.identityNumber}
                      onChange={(e) => setForm((prev) => ({ ...prev, identityNumber: e.target.value }))}
                      placeholder="Masukkan nomor identitas"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipe Pemesan</Label>
                    <Select
                      value={form.bookingType}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, bookingType: value }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="perorangan">Perorangan</SelectItem>
                        <SelectItem value="group">Grup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Jumlah Orang</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.visitorCount}
                      onChange={(e) => setForm((prev) => ({ ...prev, visitorCount: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori Tiket</Label>
                    <Select value={form.feeCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border max-h-72">
                        {CATEGORY_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Harga per Orang</Label>
                    <Input value={formatNominal(pricePerPerson)} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Biaya</Label>
                    <Input value={formatNominal(grandTotal)} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Lokasi Pembayaran</Label>
                    <Input value="Onsite" readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Metode Pembayaran</Label>
                    <Select
                      value={form.paymentMethod}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {PAYMENT_METHOD_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gerbang Tiket</Label>
                    <Select
                      value={form.gateName}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, gateName: value }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {GATE_OPTIONS.map((gate) => (
                          <SelectItem key={gate} value={gate}>
                            {gate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Petugas Tiket</Label>
                    <Select
                      value={form.officerName}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, officerName: value }))}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {OFFICER_OPTIONS.map((officer) => (
                          <SelectItem key={officer} value={officer}>
                            {officer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Nonaktifkan OCR</p>
                      <p className="text-xs text-muted-foreground">
                        Untuk tamu khusus dengan persetujuan administrator.
                      </p>
                    </div>
                    <Switch
                      checked={form.ocrDisabled}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, ocrDisabled: checked }))
                      }
                    />
                  </div>
                  {form.ocrDisabled && (
                    <div className="space-y-2">
                      <Label>Referensi Persetujuan Admin</Label>
                      <Input
                        value={form.ocrApprovalRef}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, ocrApprovalRef: e.target.value }))
                        }
                        placeholder="Contoh: ADM-APPROVAL-2026-001"
                        required
                      />
                    </div>
                  )}
                </div>

                {needsApproval && (
                  <div className="rounded-md border border-status-pending/40 bg-status-pending/10 p-3 text-sm">
                    Kategori ini butuh antrian persetujuan. Status pembayaran akan tercatat sebagai
                    <span className="font-semibold"> pending persetujuan</span>.
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button type="submit" className="btn-ocean gap-2">
                    <Ticket className="w-4 h-4" />
                    Simpan Pembelian Onsite
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-lg">Status Input Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!lastCreated && (
                <p className="text-muted-foreground">
                  Belum ada input baru pada sesi ini. Isi form untuk membuat tiket onsite.
                </p>
              )}
              {lastCreated && (
                <div className="space-y-2">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Tiket</p>
                    <p className="font-mono text-sm">{lastCreated.ticketId}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Invoice</p>
                    <p className="font-mono text-sm">{lastCreated.invoiceId}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">{formatNominal(lastCreated.amount)}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant="outline"
                      className={
                        lastCreated.status === "pending_persetujuan"
                          ? "border-status-pending text-status-pending"
                          : "border-status-approved text-status-approved"
                      }
                    >
                      {lastCreated.status === "pending_persetujuan"
                        ? "Pending Persetujuan"
                        : "Sudah Dibayar"}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="card-ocean overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Input Onsite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>Tiket</th>
                    <th>Nama</th>
                    <th>Kategori</th>
                    <th>Pembayaran</th>
                    <th>Petugas</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((row) => (
                    <tr key={row.id}>
                      <td className="text-sm whitespace-nowrap">{formatDateTime(row.createdAt)}</td>
                      <td className="font-mono text-xs">
                        {row.ticketId.startsWith("RA-") ? (
                          <Link to={`/tickets/${row.ticketId}`} className="text-primary hover:underline">
                            {row.ticketId}
                          </Link>
                        ) : (
                          row.ticketId
                        )}
                      </td>
                      <td className="text-sm">{row.visitorName}</td>
                      <td className="text-sm">{FEE_PRICING[row.feeCategory]?.label || row.feeCategory}</td>
                      <td className="text-sm">{METHOD_LABELS[row.paymentMethod] || row.paymentMethod}</td>
                      <td className="text-sm">{row.officerName}</td>
                      <td className="text-sm font-semibold">{formatNominal(row.amount)}</td>
                      <td>
                        <Badge
                          variant="outline"
                          className={
                            row.status === "pending_persetujuan"
                              ? "border-status-pending text-status-pending"
                              : "border-status-approved text-status-approved"
                          }
                        >
                          {row.status === "pending_persetujuan"
                            ? "Pending Persetujuan"
                            : "Sudah Dibayar"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

