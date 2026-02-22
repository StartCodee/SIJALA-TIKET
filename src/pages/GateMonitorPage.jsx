import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FEE_PRICING,
  getAllTickets,
  getAllInvoiceLines,
  formatDateTime,
  formatNominal,
  getInvoiceIdForTicket,
  addOnsiteTicket,
  addOnsiteInvoiceLine,
} from "@/data/dummyData";
import { ClipboardPen, Ticket, Wallet, ShieldCheck, Plus, Trash2, Minus, Ship } from "lucide-react";

const APPROVAL_REQUIRED_CATEGORIES = new Set([
  "peneliti_domestik",
  "peneliti_mancanegara",
  "mooring",
  "sport_fishing",
]);

// const FORM_TYPE_OPTIONS = [
//   { value: "wisatawan", label: "Wisatawan" },
//   // { value: "peneliti", label: "Peneliti" },
// ];

const OPERATOR_CATEGORY_OPTIONS = [
  { value: "homestay", label: "Homestay" },
  { value: "resort", label: "Resort" },
  { value: "liveaboard", label: "Liveaboard" },
  { value: "dive_center", label: "Dive Center" },
  { value: "mandiri", label: "Mandiri" },
  { value: "lainnya", label: "Lainnya" },
];

const CONTINENT_OPTIONS = [
  { value: "asia", label: "Asia" },
  { value: "afrika", label: "Afrika" },
  { value: "eropa", label: "Eropa" },
  { value: "amerika_utara", label: "Amerika Utara" },
  { value: "amerika_selatan", label: "Amerika Selatan" },
  { value: "australia", label: "Australia/Oceania" },
];

const GENDER_OPTIONS = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
  { value: "U", label: "Tidak disebutkan" },
];

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

const IDENTITY_OPTIONS = [
  { value: "ktp", label: "KTP" },
  { value: "sim", label: "SIM" },
  { value: "paspor", label: "Paspor" },
  { value: "kitas", label: "KITAS" },
  { value: "kitap", label: "KITAP" },
];

const TOURIST_TICKET_CATEGORY_OPTIONS = Object.entries(FEE_PRICING)
  .filter(([value]) => value.startsWith("wisatawan_"))
  .map(([value, config]) => ({
    value,
    label: config.label,
  }));

const RESEARCH_TICKET_CATEGORY_OPTIONS = Object.entries(FEE_PRICING)
  .filter(([value]) => value.startsWith("peneliti_"))
  .map(([value, config]) => ({
    value,
    label: config.label,
  }));

const KKPN_OPTIONS = [
  "KAWASAN KONSERVASI NASIONAL KEPULAUAN ANAMBAS",
  "KAWASAN KONSERVASI NASIONAL KEPULAUAN KAPOPOSANG",
  "KAWASAN KONSERVASI NASIONAL KEPULAUAN PADAIDO",
  "KAWASAN KONSERVASI NASIONAL KEPULAUAN RAJA AMPAT",
  "KAWASAN KONSERVASI NASIONAL KEPULAUAN WAIGEO SEBELAH BARAT",
  "KAWASAN KONSERVASI NASIONAL LAUT BANDA",
  "KAWASAN KONSERVASI NASIONAL PULAU GILI MATRA",
  "KAWASAN KONSERVASI NASIONAL PULAU PIEH",
  "SUAKA ALAM PERAIRAN KEPULAUAN ARU",
  "TAMAN NASIONAL PERAIRAN LAUT SAWU",
];

const CITIZENSHIP_OPTIONS = ["Indonesia", "Asing"];

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

const isIndonesiaCountry = (country) =>
  String(country || "").trim().toLowerCase().includes("indonesia");

const mapOperatorCategoryToType = (operatorCategory) => {
  if (operatorCategory === "homestay" || operatorCategory === "mandiri") return "qris";
  if (operatorCategory === "resort") return "doku";
  if (operatorCategory === "liveaboard" || operatorCategory === "dive_center") return "transfer";
  return "transfer";
};

const createResearcherItem = () => ({
  id: `researcher-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  namaLengkap: "",
  kewarganegaraan: "Indonesia",
  asalNegara: "Indonesia",
  identityPhotoName: "",
  identityPhotoPreview: "",
});

const createDefaultForm = (formType = "wisatawan") => ({
  formType,
  operatorCategory: "homestay",
  operatorName: "",
  operatorEmail: "",
  bookerName: "",
  bookerEmail: "",
  visitorName: "",
  visitorEmail: "",
  originContinent: "asia",
  country: "Indonesia",
  gender: "U",
  identityType: "ktp",
  identityNumber: "",
  identityPhotoName: "",
  identityPhotoPreview: "",
  feeCategory: "wisatawan_domestik_pbd",
  researchFeeCategory: "peneliti_domestik",
  researchLocationKKPN: "",
  institutionName: "",
  institutionOrigin: "",
  institutionAddress: "",
  institutionProvince: "",
  institutionCity: "",
  institutionPhone: "",
  institutionEmail: "",
  researchTitle: "",
  researchPurpose: "",
  researchSummary: "",
  researchStartDate: "",
  researchEndDate: "",
  institutionPermitFileName: "",
  institutionPermitFilePreview: "",
  researchRequestFileName: "",
  researchRequestFilePreview: "",
  picName: "",
  picCitizenship: "Indonesia",
  picIdentityPhotoName: "",
  picIdentityPhotoPreview: "",
  picPhone: "",
  researchers: [createResearcherItem()],
  indonesianVesselTariff: "0",
  indonesianVesselCount: "0",
  indonesianVesselNames: "",
  foreignVesselTariff: "0",
  foreignVesselCount: "0",
  foreignVesselNames: "",
  paymentMethod: "blud_cash",
  paymentProofName: "",
  paymentProofPreview: "",
  gateName: "Waisai",
  officerName: "Rudi Hartono",
});

const toNumberValue = (value) => {
  const raw = String(value ?? "").replace(/[^\d.-]/g, "");
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toNameArray = (value) =>
  String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const revokeObjectUrl = (url) => {
  if (!url) return;
  if (typeof window === "undefined" || !window.URL || !window.URL.revokeObjectURL) return;
  window.URL.revokeObjectURL(url);
};

const collectObjectUrls = (sourceForm) => {
  const urls = [
    sourceForm.identityPhotoPreview,
    sourceForm.institutionPermitFilePreview,
    sourceForm.researchRequestFilePreview,
    sourceForm.picIdentityPhotoPreview,
    sourceForm.paymentProofPreview,
  ];
  (sourceForm.researchers || []).forEach((item) => {
    if (item.identityPhotoPreview) urls.push(item.identityPhotoPreview);
  });
  return urls.filter(Boolean);
};

export default function GateMonitorPage() {
  const [form, setForm] = useState(() => createDefaultForm("wisatawan"));
  const [recentTransactions, setRecentTransactions] = useState(() => {
    const invoiceMethodByTicket = new Map(
      getAllInvoiceLines().map((line) => [line.ticketId, line.method]),
    );
    return getAllTickets()
      .filter((ticket) => ticket.sourceChannel === "onsite")
      .slice(0, 8)
      .map((ticket) => ({
        id: `TRX-${ticket.id}`,
        ticketId: ticket.id,
        invoiceId: getInvoiceIdForTicket(ticket.id) || "-",
        visitorName: ticket.namaLengkap,
        feeCategory: ticket.feeCategory,
        visitorCount: getTicketVisitorCount(ticket),
        paymentMethod:
          invoiceMethodByTicket.get(ticket.id) ||
          normalizeMethodByOperator(ticket.operatorType),
        gateName: ticket.gateOfficerName ? "Onsite" : "Waisai",
        officerName: ticket.gateOfficerName || "Petugas Lapangan",
        amount: Number(ticket.totalBiaya || ticket.hargaPerOrang || 0),
        createdAt: ticket.createdAt,
        status:
          APPROVAL_REQUIRED_CATEGORIES.has(ticket.feeCategory) &&
          ticket.approvalStatus !== "disetujui"
            ? "pending_persetujuan"
            : ticket.paymentStatus === "sudah_bayar"
              ? "sudah_dibayar"
              : "menunggu_pembayaran",
      }));
  });
  const [lastCreated, setLastCreated] = useState(null);

  const activeFeeCategory =
    form.formType === "wisatawan" ? form.feeCategory : form.researchFeeCategory;
  const pricePerPerson = FEE_PRICING[activeFeeCategory]?.price || 0;
  const normalizedCount = 1;
  const researchMemberCount = Math.max(1, form.researchers.length);
  const researchBaseTotal = pricePerPerson * researchMemberCount;
  const indonesianVesselSubtotal =
    toNumberValue(form.indonesianVesselTariff) * toNumberValue(form.indonesianVesselCount);
  const foreignVesselSubtotal =
    toNumberValue(form.foreignVesselTariff) * toNumberValue(form.foreignVesselCount);
  const researchVesselTotal = indonesianVesselSubtotal + foreignVesselSubtotal;
  const grandTotal =
    form.formType === "wisatawan"
      ? pricePerPerson * normalizedCount
      : researchBaseTotal + researchVesselTotal;
  const needsApproval = APPROVAL_REQUIRED_CATEGORIES.has(activeFeeCategory);

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

  const handleReset = () => {
    collectObjectUrls(form).forEach((url) => revokeObjectUrl(url));
    setForm(createDefaultForm(form.formType));
  };

  const handleSingleUploadChange = (nameKey, previewKey, event) => {
    const file = event.target.files?.[0];
    setForm((prev) => {
      revokeObjectUrl(prev[previewKey]);
      if (!file) {
        return {
          ...prev,
          [nameKey]: "",
          [previewKey]: "",
        };
      }
      const fileUrl =
        typeof window !== "undefined" && window.URL && window.URL.createObjectURL
          ? window.URL.createObjectURL(file)
          : "";
      return {
        ...prev,
        [nameKey]: file.name,
        [previewKey]: fileUrl,
      };
    });
  };

  const handleIdentityPhotoChange = (event) => {
    handleSingleUploadChange("identityPhotoName", "identityPhotoPreview", event);
  };

  const handlePaymentProofChange = (event) => {
    handleSingleUploadChange("paymentProofName", "paymentProofPreview", event);
  };

  const handleResearcherIdentityPhotoChange = (index, event) => {
    const file = event.target.files?.[0];
    setForm((prev) => {
      const nextResearchers = prev.researchers.map((item, idx) => {
        if (idx !== index) return item;
        revokeObjectUrl(item.identityPhotoPreview);
        if (!file) {
          return {
            ...item,
            identityPhotoName: "",
            identityPhotoPreview: "",
          };
        }
        const fileUrl =
          typeof window !== "undefined" && window.URL && window.URL.createObjectURL
            ? window.URL.createObjectURL(file)
            : "";
        return {
          ...item,
          identityPhotoName: file.name,
          identityPhotoPreview: fileUrl,
        };
      });
      return { ...prev, researchers: nextResearchers };
    });
  };

  const handleAddResearcher = () => {
    setForm((prev) => ({
      ...prev,
      researchers: [...prev.researchers, createResearcherItem()],
    }));
  };

  const handleRemoveResearcher = (index) => {
    setForm((prev) => {
      if (prev.researchers.length <= 1) return prev;
      const target = prev.researchers[index];
      if (target?.identityPhotoPreview) revokeObjectUrl(target.identityPhotoPreview);
      return {
        ...prev,
        researchers: prev.researchers.filter((_, idx) => idx !== index),
      };
    });
  };

  const adjustVesselCount = (field, delta) => {
    setForm((prev) => {
      const current = Math.max(0, toNumberValue(prev[field]));
      const next = Math.max(0, current + delta);
      return { ...prev, [field]: String(next) };
    });
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
    const isInitialPaid = false;
    const firstResearcher = form.researchers[0] || createResearcherItem();
    const researchCountry = firstResearcher.asalNegara || "Indonesia";
    const domisiliOCR =
      form.formType === "wisatawan"
        ? isIndonesiaCountry(form.country)
          ? "pbd"
          : "mancanegara"
        : isIndonesiaCountry(researchCountry)
          ? "pbd"
          : "mancanegara";
    const operatorType =
      form.formType === "wisatawan" ? mapOperatorCategoryToType(form.operatorCategory) : "transfer";
    const approvalStatus = needsApproval ? "menunggu" : "disetujui";
    const paidAtValue = isInitialPaid ? now.toISOString() : "";
    const createdAtValue = now.toISOString();
    const realisasiStatus = isInitialPaid ? "sudah_terealisasi" : "belum_terealisasi";
    const hasIndonesianResearchVessel = toNumberValue(form.indonesianVesselCount) > 0;
    const hasForeignResearchVessel = toNumberValue(form.foreignVesselCount) > 0;
    const researchFacilitiesUsed = [
      hasIndonesianResearchVessel
        ? "Kapal Penelitian - Ekspedisi Berbendera Indonesia"
        : null,
      hasForeignResearchVessel ? "Kapal Penelitian - Ekspedisi Berbendera Asing" : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const onsiteTicket = {
      id: ticketId,
      sourceChannel: "onsite",
      bookingType: "perorangan",
      feeCategory: activeFeeCategory,
      domisiliOCR,
      countryOCR: form.formType === "wisatawan" ? form.country || "Indonesia" : researchCountry,
      genderOCR: form.formType === "wisatawan" ? form.gender || "U" : "U",
      operatorType,
      operatorCategory: form.operatorCategory,
      operatorName: form.formType === "wisatawan" ? form.operatorName || "-" : form.institutionName || "-",
      operatorEmail: form.formType === "wisatawan" ? form.operatorEmail || "-" : form.institutionEmail || "-",
      bookerName:
        form.formType === "wisatawan"
          ? form.bookerName || form.visitorName || "Tanpa Nama"
          : form.picName || firstResearcher.namaLengkap || "Penanggung Jawab",
      bookerEmail: form.formType === "wisatawan" ? form.bookerEmail || "-" : form.institutionEmail || "-",
      namaLengkap:
        form.formType === "wisatawan"
          ? form.visitorName || "Tanpa Nama"
          : form.picName || firstResearcher.namaLengkap || "Peneliti",
      email: form.formType === "wisatawan" ? form.visitorEmail || "-" : form.institutionEmail || "-",
      visitorEmail: form.formType === "wisatawan" ? form.visitorEmail || "-" : form.institutionEmail || "-",
      noHP: form.formType === "wisatawan" ? "-" : form.picPhone || "-",
      originContinent: form.formType === "wisatawan" ? form.originContinent || "asia" : "-",
      identityType: form.formType === "wisatawan" ? form.identityType : "dokumen_peneliti",
      identityNumber: form.formType === "wisatawan" ? form.identityNumber : "-",
      noKTP: form.formType === "wisatawan" ? (form.identityType === "ktp" ? form.identityNumber : "") : "",
      identityDocumentUrl:
        form.formType === "wisatawan"
          ? form.identityPhotoPreview || ""
          : form.picIdentityPhotoPreview || "",
      ktmUrl:
        form.formType === "wisatawan"
          ? form.identityPhotoPreview || "/placeholder.svg"
          : form.picIdentityPhotoPreview || "/placeholder.svg",
      jumlahDomestik: form.formType === "wisatawan" ? normalizedCount : researchMemberCount,
      jumlahMancanegara:
        form.formType === "wisatawan"
          ? 0
          : form.researchers.filter((item) => !isIndonesiaCountry(item.asalNegara)).length,
      hargaPerOrang: pricePerPerson,
      totalBiaya: grandTotal,
      approvalStatus,
      paymentStatus: isInitialPaid ? "sudah_bayar" : "belum_bayar",
      gateStatus: "belum_masuk",
      realisasiStatus,
      needsApproval,
      gateOfficerName: form.officerName,
      lastActionBy: form.officerName,
      lastActionAt: createdAtValue,
      createdAt: createdAtValue,
      paidAt: paidAtValue,
      paymentProofUrl: form.paymentProofPreview || "",
      paymentProofAvailable: Boolean(form.paymentProofPreview),
      qrActive: isInitialPaid,
      ...(form.formType === "peneliti"
        ? {
            lokasiKKPN: form.researchLocationKKPN,
            namaInstitusi: form.institutionName,
            asalInstitusi: form.institutionOrigin,
            alamatInstitusi: form.institutionAddress,
            provinsi: form.institutionProvince,
            kabupatenKota: form.institutionCity,
            nomorTeleponInstitusiPeneliti: form.institutionPhone,
            emailInstitusiPeneliti: form.institutionEmail,
            judulPenelitian: form.researchTitle,
            tujuanPenelitian: form.researchPurpose,
            uraianSingkatPenelitian: form.researchSummary,
            tanggalMulaiKegiatan: form.researchStartDate,
            tanggalSelesaiKegiatan: form.researchEndDate,
            suratIzinDisetujuiInstitusiIndonesiaUrl: form.institutionPermitFilePreview || "",
            dokumenSuratPermohonanResmiPenelitianUrl: form.researchRequestFilePreview || "",
            namaLengkapPenanggungJawab: form.picName,
            kewarganegaraanPenanggungJawab: form.picCitizenship,
            fotoIdentitasPenanggungJawabUrl: form.picIdentityPhotoPreview || "",
            nomorSelulerPenanggungJawab: form.picPhone,
            anggotaPeneliti: form.researchers.map((item) => ({
              nama: item.namaLengkap || "-",
              kewarganegaraan: item.kewarganegaraan || "-",
              asalNegara: item.asalNegara || "-",
              dokumenIdentitasUrl: item.identityPhotoPreview || "/placeholder.svg",
            })),
            saranaPenelitianDigunakan: researchFacilitiesUsed || "Kapal Penelitian",
            kapalPenelitianIndonesia: toNumberValue(form.indonesianVesselCount),
            kapalPenelitianIndonesiaCount: toNumberValue(form.indonesianVesselCount),
            kapalPenelitianIndonesiaTarif: toNumberValue(form.indonesianVesselTariff),
            kapalPenelitianIndonesiaNames: toNameArray(form.indonesianVesselNames),
            kapalPenelitianAsing: toNumberValue(form.foreignVesselCount),
            kapalPenelitianAsingCount: toNumberValue(form.foreignVesselCount),
            kapalPenelitianAsingTarif: toNumberValue(form.foreignVesselTariff),
            kapalPenelitianAsingNames: toNameArray(form.foreignVesselNames),
          }
        : {}),
    };

    const onsiteInvoiceLine = {
      id: invoiceId,
      ticketId,
      amount: grandTotal,
      method: form.paymentMethod,
      paidAt: paidAtValue,
      paymentStatus: isInitialPaid ? "sudah_bayar" : "belum_bayar",
      proofUrl: form.paymentProofPreview || "",
      realisasiStatus,
      refundFlag: false,
    };

    addOnsiteTicket(onsiteTicket);
    addOnsiteInvoiceLine(onsiteInvoiceLine);

    const entry = {
      id: `TRX-${ticketId}`,
      ticketId,
      invoiceId,
      visitorName:
        form.formType === "wisatawan"
          ? form.visitorName || "Tanpa Nama"
          : form.picName || firstResearcher.namaLengkap || "Peneliti",
      feeCategory: activeFeeCategory,
      visitorCount: form.formType === "wisatawan" ? normalizedCount : researchMemberCount,
      paymentMethod: form.paymentMethod,
      gateName: form.gateName,
      officerName: form.officerName,
      amount: grandTotal,
      createdAt: now.toISOString(),
      status: needsApproval ? "pending_persetujuan" : isInitialPaid ? "sudah_dibayar" : "menunggu_pembayaran",
    };

    setRecentTransactions((prev) => [entry, ...prev].slice(0, 40));
    setLastCreated(entry);

    collectObjectUrls(form).forEach((url) => revokeObjectUrl(url));
    setForm(createDefaultForm(form.formType));
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Tiket Langsung (Onsite)"
        subtitle="Form khusus petugas tiket untuk input pembelian langsung di lokasi"
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto overscroll-contain p-6 space-y-6">
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
                {/* Tab tipe form disembunyikan sementara.
                    Tiket langsung saat ini difokuskan ke form wisatawan saja. */}

                {form.formType === "wisatawan" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Jenis Operator</Label>
                      <Select
                        value={form.operatorCategory}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, operatorCategory: value }))}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {OPERATOR_CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Operator</Label>
                      <Input
                        value={form.operatorName}
                        onChange={(e) => setForm((prev) => ({ ...prev, operatorName: e.target.value }))}
                        placeholder="Contoh: Homestay Dalang"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alamat Email Operator</Label>
                      <Input
                        type="email"
                        value={form.operatorEmail}
                        onChange={(e) => setForm((prev) => ({ ...prev, operatorEmail: e.target.value }))}
                        placeholder="operator@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nama Pemesan</Label>
                      <Input
                        value={form.bookerName}
                        onChange={(e) => setForm((prev) => ({ ...prev, bookerName: e.target.value }))}
                        placeholder="Nama pemesan"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Pemesan</Label>
                      <Input
                        type="email"
                        value={form.bookerEmail}
                        onChange={(e) => setForm((prev) => ({ ...prev, bookerEmail: e.target.value }))}
                        placeholder="pemesan@email.com"
                        required
                      />
                    </div>
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
                      <Label>Alamat Email</Label>
                      <Input
                        type="email"
                        value={form.visitorEmail}
                        onChange={(e) => setForm((prev) => ({ ...prev, visitorEmail: e.target.value }))}
                        placeholder="pengunjung@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Asal Benua</Label>
                      <Select
                        value={form.originContinent}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, originContinent: value }))}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {CONTINENT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Asal Negara</Label>
                      <Input
                        value={form.country}
                        onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                        placeholder="Indonesia"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Jenis Kelamin</Label>
                      <Select
                        value={form.gender}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {GENDER_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Unggah Foto Jenis Identitas</Label>
                      <Input type="file" accept="image/*" onChange={handleIdentityPhotoChange} />
                      {form.identityPhotoName ? (
                        <p className="text-xs text-muted-foreground truncate">{form.identityPhotoName}</p>
                      ) : null}
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
                          {IDENTITY_OPTIONS.map((opt) => (
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
                      <Label>Total Biaya</Label>
                      <Input value={formatNominal(grandTotal)} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Kategori Tiket</Label>
                      <Select
                        value={form.feeCategory}
                        onValueChange={(value) => setForm((prev) => ({ ...prev, feeCategory: value }))}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          {TOURIST_TICKET_CATEGORY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Label>Unggah Bukti Pembayaran</Label>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handlePaymentProofChange}
                      />
                      {form.paymentProofName ? (
                        <p className="text-xs text-muted-foreground truncate">{form.paymentProofName}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground">Belum ada file dipilih.</p>
                      )}
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
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4 space-y-4">
                      <h3 className="text-sm font-semibold">
                        A. Lokasi KKPN, Institusi dan Uraian Penelitian
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Lokasi KKPN</Label>
                          <Select
                            value={form.researchLocationKKPN}
                            onValueChange={(value) =>
                              setForm((prev) => ({ ...prev, researchLocationKKPN: value }))
                            }
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Pilih lokasi KKPN" />
                            </SelectTrigger>
                            <SelectContent
                              className="bg-popover border-border max-h-56"
                              position="popper"
                              side="bottom"
                              align="start"
                              sideOffset={6}
                              avoidCollisions={false}
                            >
                              {KKPN_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Kategori Tiket</Label>
                          <Select
                            value={form.researchFeeCategory}
                            onValueChange={(value) =>
                              setForm((prev) => ({ ...prev, researchFeeCategory: value }))
                            }
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              {RESEARCH_TICKET_CATEGORY_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Nama Institusi</Label>
                          <Input
                            value={form.institutionName}
                            onChange={(e) => setForm((prev) => ({ ...prev, institutionName: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Asal Institusi</Label>
                          <Input
                            value={form.institutionOrigin}
                            onChange={(e) => setForm((prev) => ({ ...prev, institutionOrigin: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Alamat Institusi</Label>
                          <Textarea
                            value={form.institutionAddress}
                            onChange={(e) => setForm((prev) => ({ ...prev, institutionAddress: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Provinsi</Label>
                          <Input
                            value={form.institutionProvince}
                            onChange={(e) =>
                              setForm((prev) => ({ ...prev, institutionProvince: e.target.value }))
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Kabupaten/Kota</Label>
                          <Input
                            value={form.institutionCity}
                            onChange={(e) => setForm((prev) => ({ ...prev, institutionCity: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Nomor Telepon Institusi Peneliti</Label>
                          <Input
                            value={form.institutionPhone}
                            onChange={(e) => setForm((prev) => ({ ...prev, institutionPhone: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email Institusi Peneliti</Label>
                          <Input
                            type="email"
                            value={form.institutionEmail}
                            onChange={(e) => setForm((prev) => ({ ...prev, institutionEmail: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Judul Penelitian</Label>
                          <Input
                            value={form.researchTitle}
                            onChange={(e) => setForm((prev) => ({ ...prev, researchTitle: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Tujuan Penelitian</Label>
                          <Textarea
                            value={form.researchPurpose}
                            onChange={(e) => setForm((prev) => ({ ...prev, researchPurpose: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Uraian Singkat Penelitian</Label>
                          <Textarea
                            value={form.researchSummary}
                            onChange={(e) => setForm((prev) => ({ ...prev, researchSummary: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tanggal Mulai Kegiatan</Label>
                          <Input
                            type="date"
                            value={form.researchStartDate}
                            onChange={(e) => setForm((prev) => ({ ...prev, researchStartDate: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tanggal Selesai Kegiatan</Label>
                          <Input
                            type="date"
                            value={form.researchEndDate}
                            onChange={(e) => setForm((prev) => ({ ...prev, researchEndDate: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unggah Surat Izin Disetujui Institusi Indonesia</Label>
                          <Input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) =>
                              handleSingleUploadChange(
                                "institutionPermitFileName",
                                "institutionPermitFilePreview",
                                e,
                              )
                            }
                            required
                          />
                          {form.institutionPermitFileName ? (
                            <p className="text-xs text-muted-foreground truncate">
                              {form.institutionPermitFileName}
                            </p>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <Label>Unggah Dokumen Surat Permohonan Resmi</Label>
                          <Input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(e) =>
                              handleSingleUploadChange(
                                "researchRequestFileName",
                                "researchRequestFilePreview",
                                e,
                              )
                            }
                            required
                          />
                          {form.researchRequestFileName ? (
                            <p className="text-xs text-muted-foreground truncate">
                              {form.researchRequestFileName}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4 space-y-4">
                      <h3 className="text-sm font-semibold">B. Data Penanggung Jawab Kegiatan</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nama lengkap</Label>
                          <Input
                            value={form.picName}
                            onChange={(e) => setForm((prev) => ({ ...prev, picName: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Kewarganegaraan</Label>
                          <Select
                            value={form.picCitizenship}
                            onValueChange={(value) => setForm((prev) => ({ ...prev, picCitizenship: value }))}
                          >
                            <SelectTrigger className="bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              {CITIZENSHIP_OPTIONS.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Foto Identitas (KTP/SIM/Paspor)</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) =>
                              handleSingleUploadChange(
                                "picIdentityPhotoName",
                                "picIdentityPhotoPreview",
                                e,
                              )
                            }
                            required
                          />
                          {form.picIdentityPhotoName ? (
                            <p className="text-xs text-muted-foreground truncate">
                              {form.picIdentityPhotoName}
                            </p>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <Label>Nomor Seluler</Label>
                          <Input
                            value={form.picPhone}
                            onChange={(e) => setForm((prev) => ({ ...prev, picPhone: e.target.value }))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">C. Data Peneliti</h3>
                        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handleAddResearcher}>
                          <Plus className="w-4 h-4" />
                          Tambah Peneliti
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {form.researchers.map((item, index) => (
                          <div key={item.id} className="rounded-md border border-border/70 p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-muted-foreground">
                                Peneliti #{index + 1}
                              </p>
                              {form.researchers.length > 1 ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 px-2 text-destructive"
                                  onClick={() => handleRemoveResearcher(index)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              ) : null}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Nama Lengkap</Label>
                                <Input
                                  value={item.namaLengkap}
                                  onChange={(e) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      researchers: prev.researchers.map((row, idx) =>
                                        idx === index ? { ...row, namaLengkap: e.target.value } : row,
                                      ),
                                    }))
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Kewarganegaraan</Label>
                                <Select
                                  value={item.kewarganegaraan}
                                  onValueChange={(value) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      researchers: prev.researchers.map((row, idx) =>
                                        idx === index ? { ...row, kewarganegaraan: value } : row,
                                      ),
                                    }))
                                  }
                                >
                                  <SelectTrigger className="bg-background">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-popover border-border">
                                    {CITIZENSHIP_OPTIONS.map((opt) => (
                                      <SelectItem key={opt} value={opt}>
                                        {opt}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Asal Negara</Label>
                                <Input
                                  value={item.asalNegara}
                                  onChange={(e) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      researchers: prev.researchers.map((row, idx) =>
                                        idx === index ? { ...row, asalNegara: e.target.value } : row,
                                      ),
                                    }))
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Foto Identitas (KTP/SIM/Paspor)</Label>
                                <Input
                                  type="file"
                                  accept="image/*,.pdf"
                                  onChange={(e) => handleResearcherIdentityPhotoChange(index, e)}
                                  required
                                />
                                {item.identityPhotoName ? (
                                  <p className="text-xs text-muted-foreground truncate">
                                    {item.identityPhotoName}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border p-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold">D. Sarana penelitian yang digunakan</h3>
                        <p className="text-xs text-muted-foreground">
                          Gunakan tombol +/- untuk input jumlah lebih cepat.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">
                                Kapal Penelitian - Ekspedisi Berbendera Indonesia
                              </p>
                            </div>
                            <Ship className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-2">
                              <Label>Tarif (per Unit per Kegiatan)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={form.indonesianVesselTariff}
                                onChange={(e) =>
                                  setForm((prev) => ({ ...prev, indonesianVesselTariff: e.target.value }))
                                }
                                className="h-10 bg-background"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Jumlah (Unit/Set)</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => adjustVesselCount("indonesianVesselCount", -1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <Input
                                  type="number"
                                  min={0}
                                  value={form.indonesianVesselCount}
                                  onChange={(e) =>
                                    setForm((prev) => ({ ...prev, indonesianVesselCount: e.target.value }))
                                  }
                                  className="h-9 bg-background text-center"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => adjustVesselCount("indonesianVesselCount", 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Nama Kapal</Label>
                              <Textarea
                                value={form.indonesianVesselNames}
                                onChange={(e) =>
                                  setForm((prev) => ({ ...prev, indonesianVesselNames: e.target.value }))
                                }
                                placeholder="Contoh: KM Nusa Laut, KM Raja Ampat 01"
                                className="min-h-[70px] bg-background"
                              />
                            </div>
                            <div className="rounded-md border border-border/60 bg-background px-3 py-2">
                              <p className="text-[11px] text-muted-foreground">Subtotal Sarana Indonesia</p>
                              <p className="text-sm font-semibold">{formatNominal(indonesianVesselSubtotal)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold">
                                Kapal Penelitian - Ekspedisi Berbendera Asing
                              </p>
                            </div>
                            <Ship className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="space-y-2">
                              <Label>Tarif (per Unit per Kegiatan)</Label>
                              <Input
                                type="number"
                                min={0}
                                value={form.foreignVesselTariff}
                                onChange={(e) =>
                                  setForm((prev) => ({ ...prev, foreignVesselTariff: e.target.value }))
                                }
                                className="h-10 bg-background"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Jumlah (Unit/Set)</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => adjustVesselCount("foreignVesselCount", -1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <Input
                                  type="number"
                                  min={0}
                                  value={form.foreignVesselCount}
                                  onChange={(e) =>
                                    setForm((prev) => ({ ...prev, foreignVesselCount: e.target.value }))
                                  }
                                  className="h-9 bg-background text-center"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => adjustVesselCount("foreignVesselCount", 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Nama Kapal</Label>
                              <Textarea
                                value={form.foreignVesselNames}
                                onChange={(e) =>
                                  setForm((prev) => ({ ...prev, foreignVesselNames: e.target.value }))
                                }
                                placeholder="Contoh: RV Ocean Explorer, RV Pacific Quest"
                                className="min-h-[70px] bg-background"
                              />
                            </div>
                            <div className="rounded-md border border-border/60 bg-background px-3 py-2">
                              <p className="text-[11px] text-muted-foreground">Subtotal Sarana Asing</p>
                              <p className="text-sm font-semibold">{formatNominal(foreignVesselSubtotal)}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="rounded-md border border-border/70 bg-background px-3 py-2">
                          <p className="text-[11px] text-muted-foreground">Biaya Tiket Peneliti</p>
                          <p className="text-sm font-semibold">{formatNominal(researchBaseTotal)}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {researchMemberCount} peneliti x {formatNominal(pricePerPerson)}
                          </p>
                        </div>
                        <div className="rounded-md border border-border/70 bg-background px-3 py-2">
                          <p className="text-[11px] text-muted-foreground">Total Sarana</p>
                          <p className="text-sm font-semibold">{formatNominal(researchVesselTotal)}</p>
                        </div>
                        <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
                          <p className="text-[11px] text-muted-foreground">Total Biaya Keseluruhan</p>
                          <p className="text-base font-bold text-primary">{formatNominal(grandTotal)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Label>Unggah Bukti Pembayaran</Label>
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handlePaymentProofChange}
                          />
                          {form.paymentProofName ? (
                            <p className="text-xs text-muted-foreground truncate">{form.paymentProofName}</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">Belum ada file dipilih.</p>
                          )}
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
                    </div>
                  </div>
                )}

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
                          : lastCreated.status === "menunggu_pembayaran"
                            ? "border-slate-400 text-slate-600"
                            : "border-status-approved text-status-approved"
                      }
                    >
                      {lastCreated.status === "pending_persetujuan"
                        ? "Pending Persetujuan"
                        : lastCreated.status === "menunggu_pembayaran"
                          ? "Menunggu Pembayaran"
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
                        <Link to={`/tickets/${row.ticketId}`} className="text-primary hover:underline">
                          {row.ticketId}
                        </Link>
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
                              : row.status === "menunggu_pembayaran"
                                ? "border-slate-400 text-slate-600"
                                : "border-status-approved text-status-approved"
                          }
                        >
                          {row.status === "pending_persetujuan"
                            ? "Pending Persetujuan"
                            : row.status === "menunggu_pembayaran"
                              ? "Menunggu Pembayaran"
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
