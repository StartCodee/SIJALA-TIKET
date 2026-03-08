import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Download,
  Eye,
  FileText,
  XCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { ApprovalStatusChip, PaymentStatusChip } from "@/components/StatusChip";
import {
  getTicketById,
  getInvoiceIdForTicket,
  saveTicketOverride,
  formatDateTime,
  formatRupiah,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
} from "@/data/dummyData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildResearcherDetail,
  isResearcherFeeCategory,
} from "@/features/researchers/researcherDetailUtils";

const buildResearcherFormItems = (detail) => [
  { label: "Lokasi KKPN", value: detail.lokasiKkpn },
  { label: "Nama Institusi", value: detail.namaInstitusi },
  { label: "Asal Institusi", value: detail.asalInstitusi },
  { label: "Alamat Institusi", value: detail.alamatInstitusi },
  { label: "Provinsi", value: detail.provinsi },
  { label: "Kabupaten/Kota", value: detail.kabupatenKota },
  { label: "Nomor Telepon Institusi Peneliti", value: detail.teleponInstitusi },
  { label: "Email Institusi Peneliti", value: detail.emailInstitusi },
  { label: "Judul Penelitian", value: detail.judulPenelitian },
  { label: "Tujuan Penelitian", value: detail.tujuanPenelitian },
  { label: "Uraian Singkat Penelitian", value: detail.uraianSingkatPenelitian },
  { label: "Tanggal Mulai Kegiatan", value: detail.tanggalMulaiKegiatan },
  { label: "Tanggal Selesai Kegiatan", value: detail.tanggalSelesaiKegiatan },
  { label: "Nama Lengkap Penanggung Jawab", value: detail.penanggungJawabNama },
  {
    label: "Kewarganegaraan Penanggung Jawab",
    value: detail.penanggungJawabKewarganegaraan,
  },
  {
    label: "Nomor Seluler Penanggung Jawab",
    value: detail.penanggungJawabNomorSeluler,
  },
];

const buildResearcherParticipantRows = (ticket, researcherDetail) => {
  const participants = Array.isArray(ticket?.anggotaPeneliti) ? ticket.anggotaPeneliti : [];

  if (!participants.length) {
    return [
      {
        id: `${ticket?.id || "ticket"}-principal`,
        namaLengkap: ticket?.namaLengkap || researcherDetail?.ticketName || "-",
        kewarganegaraan:
          ticket?.kewarganegaraanPenanggungJawab ||
          ticket?.countryOCR ||
          researcherDetail?.penanggungJawabKewarganegaraan ||
          "-",
        asalNegara: ticket?.asalInstitusi || ticket?.countryOCR || "-",
        fotoIdentitas:
          ticket?.identityDocumentUrl ||
          ticket?.ktmUrl ||
          ticket?.fotoIdentitasPenanggungJawabUrl ||
          "/placeholder.svg",
      },
    ];
  }

  return participants.map((participant, index) => ({
    id: participant?.id || `${ticket?.id || "ticket"}-${index + 1}`,
    namaLengkap:
      participant?.nama ||
      participant?.name ||
      participant?.namaLengkap ||
      `Peneliti ${index + 1}`,
    kewarganegaraan:
      participant?.kewarganegaraan ||
      participant?.citizenship ||
      ticket?.kewarganegaraanPenanggungJawab ||
      ticket?.countryOCR ||
      "-",
    asalNegara:
      participant?.asalNegara ||
      participant?.country ||
      ticket?.asalInstitusi ||
      ticket?.countryOCR ||
      "-",
    fotoIdentitas:
      participant?.dokumenIdentitasUrl ||
      participant?.identityDocumentUrl ||
      participant?.ktpUrl ||
      ticket?.identityDocumentUrl ||
      ticket?.ktmUrl ||
      "/placeholder.svg",
  }));
};

const SUPPORTING_DOCUMENT_LABELS = {
  surat_izin_penelitian: "Surat Izin Penelitian (Institusi Indonesia)",
  surat_permohonan_penelitian: "Surat Permohonan Resmi Penelitian",
  foto_identitas_penanggung_jawab: "Foto Identitas (KTP/SIM/Paspor) Penanggung Jawab",
};

const buildApprovalSupportingDocumentGroups = (ticket, participantRows) => [
  {
    id: "surat_izin_penelitian",
    ownerLabel: SUPPORTING_DOCUMENT_LABELS.surat_izin_penelitian,
    docs: ["Dokumen pengajuan peneliti"],
    items: [
      {
        id: `${ticket?.id || "ticket"}-surat-izin`,
        label: SUPPORTING_DOCUMENT_LABELS.surat_izin_penelitian,
        name: ticket?.namaLengkapPenanggungJawab || ticket?.namaLengkap || "Penanggung Jawab",
        url: ticket?.researchPermitUrl || "/placeholder.svg",
      },
    ],
  },
  {
    id: "surat_permohonan_penelitian",
    ownerLabel: SUPPORTING_DOCUMENT_LABELS.surat_permohonan_penelitian,
    docs: ["Dokumen pengajuan peneliti"],
    items: [
      {
        id: `${ticket?.id || "ticket"}-surat-permohonan`,
        label: SUPPORTING_DOCUMENT_LABELS.surat_permohonan_penelitian,
        name: ticket?.namaLengkapPenanggungJawab || ticket?.namaLengkap || "Penanggung Jawab",
        url: ticket?.researchRequestLetterUrl || "/placeholder.svg",
      },
    ],
  },
  {
    id: "foto_identitas_penanggung_jawab",
    ownerLabel: SUPPORTING_DOCUMENT_LABELS.foto_identitas_penanggung_jawab,
    docs: ["Dokumen identitas penanggung jawab"],
    items: [
      {
        id: `${ticket?.id || "ticket"}-penanggung-jawab`,
        label: SUPPORTING_DOCUMENT_LABELS.foto_identitas_penanggung_jawab,
        name: ticket?.namaLengkapPenanggungJawab || ticket?.namaLengkap || "Penanggung Jawab",
        url:
          ticket?.fotoIdentitasPenanggungJawabUrl ||
          ticket?.personInChargeIdentityUrl ||
          ticket?.identityDocumentUrl ||
          ticket?.ktmUrl ||
          "/placeholder.svg",
      },
    ],
  },
].filter((group) => group.items.length);

export default function ApprovalDetailPage() {
  const { ticketId } = useParams();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const backTab = searchParams.get("tab") || "menunggu";
  const backHref = `/approval?tab=${encodeURIComponent(backTab)}`;
  const [ticket, setTicket] = useState(() => (ticketId ? getTicketById(ticketId) : null));
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [selectedDocGroup, setSelectedDocGroup] = useState(null);

  useEffect(() => {
    if (!ticketId) return;
    setTicket(getTicketById(ticketId));
  }, [ticketId]);

  const invoiceId = ticket ? getInvoiceIdForTicket(ticket.id) : "";
  const isResearcherTicket = isResearcherFeeCategory(ticket?.feeCategory);
  const researcherDetail = useMemo(() => {
    if (!ticket || !isResearcherTicket) return null;
    return buildResearcherDetail(ticket, {
      ticketId: ticket.id,
      namaLengkap: ticket.namaLengkap,
      feeLabel: FEE_PRICING[ticket.feeCategory]?.label || ticket.feeCategory || "-",
      noHP: ticket.noHP,
    });
  }, [isResearcherTicket, ticket]);
  const researcherParticipantRows = useMemo(
    () => (ticket && researcherDetail ? buildResearcherParticipantRows(ticket, researcherDetail) : []),
    [researcherDetail, ticket],
  );
  const supportingDocumentGroups = useMemo(
    () =>
      ticket && isResearcherTicket
        ? buildApprovalSupportingDocumentGroups(ticket, researcherParticipantRows)
        : [],
    [isResearcherTicket, researcherParticipantRows, ticket],
  );

  const openDocumentsDialog = (group) => {
    setSelectedDocGroup(group);
    setShowDocumentsDialog(true);
  };

  const handleDocumentDownload = (url, filename = "document") => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = filename;
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApprove = () => {
    if (!ticket) return;
    const now = new Date().toISOString();
    saveTicketOverride(ticket.id, {
      approvalStatus: "disetujui",
      approvedBy: "Admin Tiket",
      approvedAt: now,
      lastActionBy: "Admin Tiket",
      lastActionAt: now,
      rejectionReason: "",
    });
    setTicket(getTicketById(ticket.id));
  };

  const confirmReject = () => {
    if (!ticket) return;
    const now = new Date().toISOString();
    saveTicketOverride(ticket.id, {
      approvalStatus: "ditolak",
      rejectionReason: rejectNotes.trim(),
      approvedBy: "Admin Tiket",
      approvedAt: now,
      lastActionBy: "Admin Tiket",
      lastActionAt: now,
    });
    setShowRejectDialog(false);
    setRejectNotes("");
    setTicket(getTicketById(ticket.id));
  };

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Data Persetujuan Tidak Ditemukan
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              ID: {ticketId ? formatShortId(ticketId) : "-"}
            </p>
            <Link to={backHref}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Antrian Persetujuan
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
        title={`Persetujuan ${formatShortId(ticket.id)}`}
        subtitle={ticket.namaLengkap}
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Link to={backHref}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            {invoiceId && ticket.approvalStatus === "disetujui" && (
              <Link to={`/invoices/${invoiceId}`}>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Invoice
                </Button>
              </Link>
            )}

            {ticket.approvalStatus === "menunggu" && (
              <>
                <Button
                  onClick={handleApprove}
                  className="gap-2 bg-status-approved hover:bg-status-approved/90 text-white"
                >
                  <CheckCircle className="w-4 h-4" />
                  Setujui
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRejectDialog(true)}
                  className="gap-2 border-status-rejected text-status-rejected hover:bg-status-rejected-bg"
                >
                  <XCircle className="w-4 h-4" />
                  Tolak
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Ringkasan Pengajuan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ID Pengajuan</p>
                    <p className="text-sm font-medium font-mono">{ticket.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status Persetujuan</p>
                    <ApprovalStatusChip status={ticket.approvalStatus} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nama Pengaju</p>
                    <p className="text-sm font-medium">{ticket.namaLengkap}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium break-words">{ticket.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">No. HP</p>
                    <p className="text-sm font-medium">{ticket.noHP || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Negara</p>
                    <p className="text-sm font-medium">{ticket.countryOCR || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                    <p className="text-sm font-medium">
                      {FEE_PRICING[ticket.feeCategory]?.label || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tipe Pengajuan</p>
                    <p className="text-sm font-medium">
                      {BOOKING_TYPE_LABELS[ticket.bookingType] || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nominal</p>
                    <p className="text-sm font-medium">{formatRupiah(ticket.totalBiaya || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Dibuat</p>
                    <p className="text-sm font-medium">{formatDateTime(ticket.createdAt)}</p>
                  </div>
                </div>

                {ticket.approvalStatus === "ditolak" && (
                  <div className="mt-4 rounded-lg border border-status-rejected/20 bg-status-rejected-bg p-4">
                    <p className="text-xs font-medium text-status-rejected mb-1">
                      Alasan Penolakan
                    </p>
                    <p className="text-sm text-status-rejected">
                      {ticket.rejectionReason || "Tidak ada catatan."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {researcherDetail && (
              <Card className="card-ocean">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Form Pengajuan Peneliti
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{researcherDetail.ticketName}</p>
                        <p className="text-xs text-muted-foreground">
                          {researcherDetail.ticketId} - {researcherDetail.feeLabel}
                        </p>
                      </div>
                      <Badge variant="outline">Data Pengajuan</Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {buildResearcherFormItems(researcherDetail).map((item) => (
                        <div key={`${researcherDetail.ticketId}-${item.label}`}>
                          <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                          <p className="text-sm font-medium whitespace-pre-wrap break-words">
                            {item.value || "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {researcherParticipantRows.length > 0 && (
              <Card className="card-ocean">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Daftar Peneliti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="data-table min-w-[860px]">
                      <thead>
                        <tr>
                          <th>Nama Lengkap</th>
                          <th>Kewarganegaraan</th>
                          <th>Asal Negara</th>
                          <th>Foto (KTP/SIM/Paspor)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {researcherParticipantRows.map((participant) => (
                          <tr key={participant.id}>
                            <td className="text-sm font-medium">{participant.namaLengkap}</td>
                            <td className="text-sm">{participant.kewarganegaraan}</td>
                            <td className="text-sm">{participant.asalNegara}</td>
                            <td>
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  className="h-16 w-24 overflow-hidden rounded-md border border-border bg-muted transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  onClick={() =>
                                    setPreviewImage({
                                      src: participant.fotoIdentitas || "/placeholder.svg",
                                      name: participant.namaLengkap,
                                    })
                                  }
                                  title={`Lihat foto identitas ${participant.namaLengkap}`}
                                >
                                  <img
                                    src={participant.fotoIdentitas || "/placeholder.svg"}
                                    alt={`Foto identitas ${participant.namaLengkap}`}
                                    className="h-full w-full object-contain"
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          <div className="space-y-6">
            {supportingDocumentGroups.length > 0 && (
              <Card className="card-ocean">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">
                    Dokumen Pendukung
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {supportingDocumentGroups.map((group) => (
                    <div key={group.id} className="rounded-lg border border-border p-3">
                      <p className="text-xs font-semibold text-foreground mb-2">
                        {group.ownerLabel}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {group.docs.join(", ")}
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="shrink-0"
                          onClick={() => openDocumentsDialog(group)}
                        >
                          Lihat Dokumen
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">
                  Status Lanjutan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Invoice</span>
                  <span className="font-medium">
                    {invoiceId ? formatShortId(invoiceId) : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Diputuskan Oleh</span>
                  <span className="font-medium">{ticket.approvedBy || "-"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Waktu Keputusan</span>
                  <span className="font-medium">
                    {ticket.approvedAt ? formatDateTime(ticket.approvedAt) : "-"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-status-rejected" />
              Tolak Persetujuan
            </DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan untuk pengajuan ini.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Alasan Penolakan</label>
            <Textarea
              placeholder="Tambahkan alasan penolakan..."
              value={rejectNotes}
              onChange={(event) => setRejectNotes(event.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Batal
            </Button>
            <Button
              onClick={confirmReject}
              className="bg-status-rejected hover:bg-status-rejected/90 text-white"
            >
              Tolak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(previewImage)} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="bg-card border-border max-w-3xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>Preview Foto Identitas</DialogTitle>
            <DialogDescription>
              {previewImage?.name || "Dokumen identitas peneliti"}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-hidden rounded-lg border border-border bg-muted">
            <img
              src={previewImage?.src || "/placeholder.svg"}
              alt={previewImage?.name || "Preview foto identitas"}
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewImage(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDocumentsDialog}
        onOpenChange={(open) => {
          setShowDocumentsDialog(open);
          if (!open) setSelectedDocGroup(null);
        }}
      >
        <DialogContent className="bg-card border-border max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dokumen Pendukung Persetujuan</DialogTitle>
            <DialogDescription>
              {selectedDocGroup
                ? selectedDocGroup.items.length > 1
                  ? `${selectedDocGroup.ownerLabel} - pratinjau per peneliti`
                  : selectedDocGroup.ownerLabel
                : "Pilih dokumen pendukung"}
            </DialogDescription>
          </DialogHeader>

          {selectedDocGroup?.items?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDocGroup.items.map((doc) => (
                <div key={doc.id} className="space-y-2 rounded-lg border border-border p-3">
                  <p className="text-xs font-medium text-foreground">{doc.name}</p>
                  <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={doc.url || "/placeholder.svg"}
                      alt={`Pratinjau ${doc.label} ${doc.name}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(doc.url, "_blank", "noopener,noreferrer")}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDocumentDownload(doc.url, `${doc.id}-${selectedDocGroup.id}`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Unduh
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Dokumen pendukung belum tersedia.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
