import React, { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  FEE_PRICING,
  formatDateTime,
  formatNominal,
  getAllInvoiceLines,
  getTicketById,
} from "@/data/dummyData";
import { FileInput, Send, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const REFUND_REQUEST_STORAGE_KEY = "refund_requests_v1";

const PAID_STATUSES = new Set([
  "sudah_bayar",
  "refund_diajukan",
  "refund_diproses",
  "refund_selesai",
]);

const createDefaultForm = () => ({
  invoiceId: "",
  requesterName: "",
  requesterEmail: "",
  requesterPhone: "",
  requestedAmount: "",
  reason: "",
  bankName: "",
  bankAccountNumber: "",
  bankAccountHolder: "",
});

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

const saveRefundRequests = (requests) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(REFUND_REQUEST_STORAGE_KEY, JSON.stringify(requests));
  } catch {
    // noop for local dummy mode
  }
};

const buildRequestId = () => {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate(),
  ).padStart(2, "0")}`;
  const timePart = `${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(
    2,
    "0",
  )}${String(now.getSeconds()).padStart(2, "0")}`;
  return `RFQ-${datePart}-${timePart}`;
};

export default function RefundRequestPage() {
  const [form, setForm] = useState(createDefaultForm);
  const [searchQuery, setSearchQuery] = useState("");
  const [invoicePickerOpen, setInvoicePickerOpen] = useState(false);
  const [requests, setRequests] = useState(() => loadRefundRequests());
  const [formError, setFormError] = useState("");
  const [lastCreated, setLastCreated] = useState(null);

  const paidInvoiceOptions = useMemo(() => {
    const grouped = new Map();
    getAllInvoiceLines().forEach((line) => {
      if (!PAID_STATUSES.has(line.paymentStatus)) return;
      if (!grouped.has(line.id)) {
        grouped.set(line.id, {
          invoiceId: line.id,
          ticketIds: [],
          totalAmount: 0,
          latestAt: line.paidAt || "",
        });
      }
      const current = grouped.get(line.id);
      current.ticketIds.push(line.ticketId);
      current.totalAmount += Number(line.amount || 0);
      const lineDate = new Date(line.paidAt || getTicketById(line.ticketId)?.createdAt || 0).getTime();
      const currentDate = new Date(current.latestAt || 0).getTime();
      if (lineDate > currentDate) {
        current.latestAt = line.paidAt || getTicketById(line.ticketId)?.createdAt || "";
      }
    });

    return Array.from(grouped.values())
      .map((item) => {
        const firstTicket = item.ticketIds.length ? getTicketById(item.ticketIds[0]) : null;
        return {
          ...item,
          displayName: firstTicket?.namaLengkap || "Tanpa Nama",
          displayEmail: firstTicket?.email && firstTicket.email !== "-" ? firstTicket.email : "",
          displayPhone: firstTicket?.noHP && firstTicket.noHP !== "-" ? firstTicket.noHP : "",
        };
      })
      .sort((a, b) => new Date(b.latestAt || 0).getTime() - new Date(a.latestAt || 0).getTime());
  }, []);

  const selectedInvoiceOption = useMemo(
    () => paidInvoiceOptions.find((item) => item.invoiceId === form.invoiceId) || null,
    [paidInvoiceOptions, form.invoiceId],
  );
  const selectedTicketAmount = Number(selectedInvoiceOption?.totalAmount || 0);
  const selectedCategoryLabel = useMemo(() => {
    if (!selectedInvoiceOption?.ticketIds?.length) return "-";
    const feeCategories = Array.from(
      new Set(
        selectedInvoiceOption.ticketIds
          .map((ticketId) => getTicketById(ticketId)?.feeCategory)
          .filter(Boolean),
      ),
    );
    if (!feeCategories.length) return "-";
    if (feeCategories.length === 1) {
      return FEE_PRICING[feeCategories[0]]?.label || feeCategories[0];
    }
    return `Multi kategori (${feeCategories.length})`;
  }, [selectedInvoiceOption]);
  const effectiveRequestedAmount = Number(form.requestedAmount || 0);

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return requests;
    return requests.filter((item) => {
      return (
        String(item.id || "").toLowerCase().includes(query) ||
        String(item.invoiceId || item.ticketId || "").toLowerCase().includes(query) ||
        String(item.requesterName || "").toLowerCase().includes(query)
      );
    });
  }, [requests, searchQuery]);

  const handleInvoiceChange = (invoiceId) => {
    const selected = paidInvoiceOptions.find((item) => item.invoiceId === invoiceId) || null;
    const ticket = selected?.ticketIds?.length ? getTicketById(selected.ticketIds[0]) : null;
    setForm((prev) => ({
      ...prev,
      invoiceId,
      requesterName: ticket?.namaLengkap || prev.requesterName,
      requesterEmail: ticket?.email && ticket.email !== "-" ? ticket.email : prev.requesterEmail,
      requesterPhone: ticket?.noHP && ticket.noHP !== "-" ? ticket.noHP : prev.requesterPhone,
      requestedAmount: String(selected?.totalAmount || 0),
    }));
    setInvoicePickerOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.invoiceId) {
      setFormError("ID invoice wajib dipilih.");
      return;
    }
    if (!form.requesterName.trim()) {
      setFormError("Nama pengaju wajib diisi.");
      return;
    }
    if (!form.reason.trim()) {
      setFormError("Alasan pengembalian wajib diisi.");
      return;
    }
    if (!effectiveRequestedAmount || effectiveRequestedAmount <= 0) {
      setFormError("Nominal pengembalian tidak valid.");
      return;
    }

    const now = new Date().toISOString();
    const inferredRefundType =
      selectedTicketAmount > 0 && effectiveRequestedAmount >= selectedTicketAmount
        ? "full"
        : "partial";
    const nextItem = {
      id: buildRequestId(),
      invoiceId: form.invoiceId,
      ticketIds: selectedInvoiceOption?.ticketIds || [],
      ticketId: selectedInvoiceOption?.ticketIds?.[0] || "",
      requesterName: form.requesterName.trim(),
      requesterEmail: form.requesterEmail.trim(),
      requesterPhone: form.requesterPhone.trim(),
      refundType: inferredRefundType,
      requestedAmount: effectiveRequestedAmount,
      reason: form.reason.trim(),
      bankName: form.bankName.trim(),
      bankAccountNumber: form.bankAccountNumber.trim(),
      bankAccountHolder: form.bankAccountHolder.trim(),
      status: "diajukan",
      createdAt: now,
    };

    const nextRequests = [nextItem, ...requests].slice(0, 200);
    setRequests(nextRequests);
    saveRefundRequests(nextRequests);
    setLastCreated(nextItem);
    setForm(createDefaultForm());
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Pengajuan Refund"
        subtitle="Form pengajuan pengembalian dana tiket dari petugas"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2 card-ocean">
            <CardHeader>
              <CardTitle className="text-lg">Form Pengajuan Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            ? `${selectedInvoiceOption.invoiceId} - ${selectedInvoiceOption.displayName}`
                            : "Cari dan pilih invoice yang sudah dibayar"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput placeholder="Cari ID invoice atau nama..." />
                          <CommandList>
                            <CommandEmpty>Invoice tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {paidInvoiceOptions.map((invoice) => (
                                <CommandItem
                                  key={invoice.invoiceId}
                                  value={`${invoice.invoiceId} ${invoice.displayName}`}
                                  onSelect={() => handleInvoiceChange(invoice.invoiceId)}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      form.invoiceId === invoice.invoiceId ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">
                                      {invoice.invoiceId} - {invoice.displayName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {invoice.ticketIds.length} tiket | Rp{" "}
                                      {formatNominal(invoice.totalAmount)}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Nama Pengaju</Label>
                    <Input
                      value={form.requesterName}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, requesterName: event.target.value }))
                      }
                      placeholder="Nama lengkap pengaju"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Pengaju</Label>
                    <Input
                      type="email"
                      value={form.requesterEmail}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, requesterEmail: event.target.value }))
                      }
                      placeholder="email@contoh.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>No. HP Pengaju</Label>
                    <Input
                      value={form.requesterPhone}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, requesterPhone: event.target.value }))
                      }
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kategori Layanan</Label>
                    <Input
                      value={selectedCategoryLabel}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Nominal Pengajuan</Label>
                    <Input
                      type="number"
                      min={0}
                      value={form.requestedAmount}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, requestedAmount: event.target.value }))
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Total invoice: {formatNominal(selectedTicketAmount || 0)} (isi sesuai nominal refund)
                    </p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Alasan Pengembalian</Label>
                    <Textarea
                      value={form.reason}
                      onChange={(event) => setForm((prev) => ({ ...prev, reason: event.target.value }))}
                      placeholder="Tuliskan alasan pengembalian dana"
                      className="min-h-[96px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nama Bank</Label>
                    <Input
                      value={form.bankName}
                      onChange={(event) => setForm((prev) => ({ ...prev, bankName: event.target.value }))}
                      placeholder="Contoh: BCA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>No. Rekening</Label>
                    <Input
                      value={form.bankAccountNumber}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, bankAccountNumber: event.target.value }))
                      }
                      placeholder="Nomor rekening tujuan"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Atas Nama Rekening</Label>
                    <Input
                      value={form.bankAccountHolder}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, bankAccountHolder: event.target.value }))
                      }
                      placeholder="Nama pemilik rekening"
                    />
                  </div>
                </div>

                {formError ? (
                  <div className="rounded-md border border-status-rejected/40 bg-status-rejected-bg p-3 text-sm text-status-rejected">
                    {formError}
                  </div>
                ) : null}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setForm(createDefaultForm())}>
                    Reset
                  </Button>
                  <Button type="submit" className="btn-ocean gap-2">
                    <Send className="w-4 h-4" />
                    Kirim Pengajuan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-lg">Status Pengajuan Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!lastCreated && (
                <p className="text-muted-foreground">
                  Belum ada pengajuan baru di sesi ini. Isi form untuk mengirim pengajuan refund.
                </p>
              )}
              {lastCreated && (
                <div className="space-y-2">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">ID Pengajuan</p>
                    <p className="font-mono text-sm">{lastCreated.id}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">ID Invoice</p>
                    <p className="font-mono text-sm">{lastCreated.invoiceId || "-"}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Nominal Pengajuan</p>
                    <p className="font-semibold">{formatNominal(lastCreated.requestedAmount)}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className="border-status-pending text-status-pending">
                      Diajukan
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="card-ocean overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Pengajuan Refund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative w-full max-w-md">
              <FileInput className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari ID pengajuan, ID invoice, atau nama pengaju..."
                className="pl-9 bg-card"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="data-table min-w-[980px]">
                <thead>
                  <tr>
                    <th>Waktu</th>
                    <th>ID Pengajuan</th>
                    <th>ID Invoice</th>
                    <th>Pengaju</th>
                    <th>Nominal</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((row) => (
                    <tr key={row.id}>
                      <td className="text-sm whitespace-nowrap">{formatDateTime(row.createdAt)}</td>
                      <td className="font-mono text-xs">{row.id}</td>
                      <td className="font-mono text-xs">{row.invoiceId || row.ticketId || "-"}</td>
                      <td className="text-sm">{row.requesterName}</td>
                      <td className="text-sm font-semibold">{formatNominal(row.requestedAmount)}</td>
                      <td>
                        <Badge variant="outline" className="border-status-pending text-status-pending">
                          Diajukan
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {!filteredRequests.length && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        Belum ada data pengajuan refund.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
