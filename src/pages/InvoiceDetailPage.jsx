import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { ArrowLeft, Download, Printer, AlertTriangle, Copy, FileText, Eye, Edit, Upload } from 'lucide-react';

import {
  getInvoiceLinesById,
  formatDateTime,
  formatNominal,
  getTicketById,
  saveInvoiceLineOverride,
  saveTicketOverride,
} from '@/data/dummyData';
import { buildInvoiceFromLines } from '@/features/invoices/invoiceUtils';
import { exportJSON, exportExcel } from '@/lib/exporters';
import { getUserRole, isAdministrator } from '@/lib/rbac';
import { PaymentStatusChip } from '@/components/StatusChip';

function copyToClipboard(text) {
  navigator.clipboard?.writeText(text);
}

function aggregate(values) {
  if (!values.length) return 'campuran';
  const first = values[0];
  return values.every((v) => v === first) ? first : 'campuran';
}

const APPROVAL_REQUIRED_FEE_CATEGORIES = new Set([
  'peneliti_domestik',
  'peneliti_mancanegara',
  'mooring',
  'sport_fishing',
]);

const PAYMENT_METHOD_LABELS = {
  // Doku
  doku_credit_card: 'Doku - Credit Card',
  doku_bank_va: 'Doku - Transfer Bank (Virtual Account)',
  doku_qris: 'Doku - QRIS',
  doku_e_wallet: 'Doku - E-Wallet',
  doku_minimarket: 'Doku - Minimarket',
  doku_paylater: 'Doku - PayLater',
  doku_bank_direct: 'Doku - Bank Langsung',
  doku_bank_digital: 'Doku - Bank Digital',
  // BLUD R4
  blud_bank_va: 'BLUD R4 - Transfer Bank (Virtual Account)',
  blud_qris: 'BLUD R4 - QRIS',
  blud_bank_direct: 'BLUD R4 - Bank Langsung',
  blud_cash: 'BLUD R4 - Tunai',
};

const EDITABLE_PAYMENT_METHOD_VALUES = new Set([
  'doku_credit_card',
  'doku_bank_va',
  'doku_qris',
  'doku_e_wallet',
  'doku_minimarket',
  'doku_paylater',
  'doku_bank_direct',
  'doku_bank_digital',
  'blud_bank_va',
  'blud_qris',
  'blud_bank_direct',
  'blud_cash',
]);

const DOCUMENT_LABELS = {
  foto_diri: 'Foto diri',
  dokumen_identitas: 'KTP/SIM/PASPOR/KITAS/KITAP',
  surat_izin_penelitian: 'Surat Izin Penelitian (Institusi Indonesia)',
  surat_permohonan_penelitian: 'Surat Permohonan Resmi Penelitian',
  foto_identitas_penanggung_jawab: 'Foto Identitas (KTP/SIM/Paspor) Penanggung Jawab',
  foto_identitas_peneliti: 'Foto Identitas (KTP/SIM/Paspor) Peneliti',
  foto_kapal: 'Foto kapal',
};

const getRequiredDocumentKeys = (feeCategory) => {
  if (feeCategory === 'mooring' || feeCategory === 'sport_fishing') {
    return ['foto_diri', 'dokumen_identitas', 'foto_kapal'];
  }
  if (String(feeCategory).startsWith('peneliti_')) {
    return [
      'surat_izin_penelitian',
      'surat_permohonan_penelitian',
      'foto_identitas_penanggung_jawab',
    ];
  }
  return ['foto_diri', 'dokumen_identitas'];
};

const getRequiredDocumentLabels = (feeCategory) =>
  getRequiredDocumentKeys(feeCategory).map((key) => DOCUMENT_LABELS[key] || key);

const getDocumentItemsForTicket = (ticket, feeCategory, explicitDocumentKeys = null) => {
  const byKey = {
    foto_diri: {
      key: 'foto_diri',
      label: DOCUMENT_LABELS.foto_diri,
      url: ticket?.selfieUrl || '/placeholder.svg',
    },
    dokumen_identitas: {
      key: 'dokumen_identitas',
      label: DOCUMENT_LABELS.dokumen_identitas,
      url: ticket?.identityDocumentUrl || ticket?.ktmUrl || '/placeholder.svg',
    },
    surat_izin_penelitian: {
      key: 'surat_izin_penelitian',
      label: DOCUMENT_LABELS.surat_izin_penelitian,
      url: ticket?.researchPermitUrl || '/placeholder.svg',
    },
    surat_permohonan_penelitian: {
      key: 'surat_permohonan_penelitian',
      label: DOCUMENT_LABELS.surat_permohonan_penelitian,
      url: ticket?.researchRequestLetterUrl || '/placeholder.svg',
    },
    foto_identitas_penanggung_jawab: {
      key: 'foto_identitas_penanggung_jawab',
      label: DOCUMENT_LABELS.foto_identitas_penanggung_jawab,
      url:
        ticket?.fotoIdentitasPenanggungJawabUrl ||
        ticket?.personInChargeIdentityUrl ||
        ticket?.identityDocumentUrl ||
        ticket?.ktmUrl ||
        '/placeholder.svg',
    },
    foto_identitas_peneliti: {
      key: 'foto_identitas_peneliti',
      label: DOCUMENT_LABELS.foto_identitas_peneliti,
      url: ticket?.identityDocumentUrl || ticket?.ktmUrl || '/placeholder.svg',
    },
    foto_kapal: {
      key: 'foto_kapal',
      label: DOCUMENT_LABELS.foto_kapal,
      url: ticket?.boatPhotoUrl || '/placeholder.svg',
    },
  };
  const documentKeys = explicitDocumentKeys?.length
    ? explicitDocumentKeys
    : getRequiredDocumentKeys(feeCategory);
  return documentKeys.map((key) => byKey[key]).filter(Boolean);
};

const formatPaymentMethod = (method, ticket) => {
  const normalized = String(method || '').toLowerCase();
  if (PAYMENT_METHOD_LABELS[normalized]) return PAYMENT_METHOD_LABELS[normalized];
  const genericLabelByMethod = {
    bank_transfer: 'Transfer Bank',
    credit_card: 'Credit Card',
    qris: 'QRIS',
    e_wallet: 'E-Wallet',
    cash: 'Tunai',
  };
  if (ticket?.operatorType === 'doku' && genericLabelByMethod[normalized]) {
    return `Doku - ${genericLabelByMethod[normalized]}`;
  }
  if (genericLabelByMethod[normalized]) {
    return genericLabelByMethod[normalized];
  }
  if (ticket?.operatorType === 'doku') {
    return `Doku - ${normalized}`;
  }
  return normalized || '-';
};

const shouldPreferDokuMethod = (invoice) => {
  const ticketMethods = Array.isArray(invoice?.tickets)
    ? invoice.tickets.map((ticket) => String(ticket?.method || '').toLowerCase())
    : [];
  if (ticketMethods.some((method) => method.startsWith('doku_'))) return true;
  if (ticketMethods.some((method) => method.startsWith('blud_'))) return false;

  const operatorTypes = Array.isArray(invoice?.tickets)
    ? invoice.tickets.map((ticket) => String(ticket?.operatorType || '').toLowerCase())
    : [];
  return operatorTypes.some((operatorType) => operatorType === 'doku');
};

const getDefaultEditableMethod = (invoice) =>
  shouldPreferDokuMethod(invoice) ? 'doku_bank_va' : 'blud_bank_va';

const normalizeEditablePaymentMethod = (method, invoice) => {
  const normalized = String(method || '').toLowerCase();
  if (EDITABLE_PAYMENT_METHOD_VALUES.has(normalized)) return normalized;

  const preferDoku = shouldPreferDokuMethod(invoice);
  if (normalized === 'bank_transfer') {
    return preferDoku ? 'doku_bank_va' : 'blud_bank_va';
  }
  if (normalized === 'qris') {
    return preferDoku ? 'doku_qris' : 'blud_qris';
  }
  if (normalized === 'cash') {
    return 'blud_cash';
  }
  if (normalized === 'credit_card') {
    return preferDoku ? 'doku_credit_card' : 'blud_bank_va';
  }
  if (normalized === 'e_wallet') {
    return preferDoku ? 'doku_e_wallet' : 'blud_bank_va';
  }

  return getDefaultEditableMethod(invoice);
};

const getCountryForTicket = (ticketId) => {
  const ticket = getTicketById(ticketId);
  return ticket?.countryOCR || '-';
};

const isResearcherFeeCategory = (feeCategory) =>
  String(feeCategory || '').startsWith('peneliti_');

const hasDisplayValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const pickFirstValue = (source, keys, fallback = '-') => {
  for (const key of keys) {
    const value = source?.[key];
    if (hasDisplayValue(value)) return value;
  }
  return fallback;
};

const toNameList = (value) => {
  if (Array.isArray(value)) {
    const validItems = value.map((item) => String(item || '').trim()).filter(Boolean);
    return validItems.length ? validItems.join(', ') : '-';
  }
  if (typeof value === 'string') {
    return value.trim() || '-';
  }
  return '-';
};

const toNumericValue = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatResearchDate = (value) => {
  if (!hasDisplayValue(value)) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const buildResearcherInvoiceDetail = (ticket, ticketRow) => {
  const source = ticket || {};
  const indonesianVesselNamesRaw = pickFirstValue(source, [
    'indonesianResearchVesselNames',
    'indonesianResearchVessels',
    'kapalPenelitianIndonesiaNames',
    'kapalPenelitianIndonesia',
    'namaKapalPenelitianIndonesia',
    'namaKapalIndonesia',
  ], []);
  const foreignVesselNamesRaw = pickFirstValue(source, [
    'foreignResearchVesselNames',
    'foreignResearchVessels',
    'kapalPenelitianAsingNames',
    'kapalPenelitianAsing',
    'namaKapalPenelitianAsing',
    'namaKapalAsing',
  ], []);

  const derivedIndonesianCount = Array.isArray(indonesianVesselNamesRaw)
    ? indonesianVesselNamesRaw.filter(Boolean).length
    : null;
  const derivedForeignCount = Array.isArray(foreignVesselNamesRaw)
    ? foreignVesselNamesRaw.filter(Boolean).length
    : null;

  const indonesianCountValue = toNumericValue(pickFirstValue(source, [
    'indonesianResearchVesselCount',
    'kapalPenelitianIndonesiaCount',
    'jumlahKapalPenelitianIndonesia',
    'jumlahKapalIndonesia',
  ], null));
  const foreignCountValue = toNumericValue(pickFirstValue(source, [
    'foreignResearchVesselCount',
    'kapalPenelitianAsingCount',
    'jumlahKapalPenelitianAsing',
    'jumlahKapalAsing',
  ], null));

  return {
    ticketId: ticketRow?.ticketId || source?.id || '-',
    ticketName: ticketRow?.namaLengkap || source?.namaLengkap || '-',
    feeLabel: ticketRow?.feeLabel || source?.feeCategory || 'Peneliti',
    lokasiKkpn: pickFirstValue(source, ['lokasiKKPN', 'lokasiKkpn', 'researchLocationKKPN', 'kkpnLocation']),
    namaInstitusi: pickFirstValue(source, ['namaInstitusi', 'institutionName', 'researchInstitutionName']),
    asalInstitusi: pickFirstValue(source, ['asalInstitusi', 'institutionOrigin', 'researchInstitutionOrigin']),
    alamatInstitusi: pickFirstValue(source, ['alamatInstitusi', 'institutionAddress', 'researchInstitutionAddress']),
    provinsi: pickFirstValue(source, ['provinsi', 'province', 'institutionProvince', 'provinsiInstitusi']),
    kabupatenKota: pickFirstValue(source, ['kabupatenKota', 'kabupaten_kota', 'city', 'institutionCity', 'kotaInstitusi']),
    teleponInstitusi: pickFirstValue(source, [
      'nomorTeleponInstitusiPeneliti',
      'nomorTeleponInstitusi',
      'institutionPhone',
      'researchInstitutionPhone',
    ]),
    emailInstitusi: pickFirstValue(source, [
      'emailInstitusiPeneliti',
      'emailInstitusi',
      'institutionEmail',
      'researchInstitutionEmail',
    ]),
    judulPenelitian: pickFirstValue(source, ['judulPenelitian', 'researchTitle']),
    tujuanPenelitian: pickFirstValue(source, ['tujuanPenelitian', 'researchObjective']),
    uraianSingkatPenelitian: pickFirstValue(source, ['uraianSingkatPenelitian', 'researchSummary', 'researchDescription']),
    tanggalMulaiKegiatan: formatResearchDate(
      pickFirstValue(source, ['tanggalMulaiKegiatan', 'activityStartDate', 'researchStartDate'], null),
    ),
    tanggalSelesaiKegiatan: formatResearchDate(
      pickFirstValue(source, ['tanggalSelesaiKegiatan', 'activityEndDate', 'researchEndDate'], null),
    ),
    penanggungJawabNama: pickFirstValue(
      source,
      ['namaLengkapPenanggungJawab', 'penanggungJawabNama', 'personInChargeName'],
      ticketRow?.namaLengkap || source?.namaLengkap || '-',
    ),
    penanggungJawabKewarganegaraan: pickFirstValue(
      source,
      ['kewarganegaraanPenanggungJawab', 'penanggungJawabKewarganegaraan', 'personInChargeCitizenship'],
      source?.countryOCR || '-',
    ),
    penanggungJawabNomorSeluler: pickFirstValue(
      source,
      ['nomorSelulerPenanggungJawab', 'penanggungJawabNomorSeluler', 'personInChargePhone'],
      ticketRow?.noHP || source?.noHP || '-',
    ),
    saranaPenelitian: pickFirstValue(
      source,
      ['saranaPenelitianDigunakan', 'saranaPenelitian', 'researchFacilitiesUsed', 'researchFacility'],
      '-',
    ),
    kapalPenelitianIndonesiaJumlah: indonesianCountValue ?? derivedIndonesianCount ?? '-',
    kapalPenelitianIndonesiaNama: toNameList(indonesianVesselNamesRaw),
    kapalPenelitianAsingJumlah: foreignCountValue ?? derivedForeignCount ?? '-',
    kapalPenelitianAsingNama: toNameList(foreignVesselNamesRaw),
  };
};

const getResearcherIdentityParticipants = (ticket, ticketRow) => {
  const source = ticket || {};
  const participantSources = [
    source?.researcherIdentityDocs,
    source?.researcherIdentities,
    source?.anggotaPeneliti,
    source?.researchMembers,
    source?.researchers,
  ];
  const firstList = participantSources.find((value) => Array.isArray(value) && value.length > 0);
  const fallbackUrl = source?.identityDocumentUrl || source?.ktmUrl || '/placeholder.svg';

  if (firstList) {
    return firstList.map((member, index) => ({
      id: member?.id || member?.identityId || `${ticketRow?.ticketId || source?.id || 'ticket'}-${index + 1}`,
      name:
        member?.nama ||
        member?.name ||
        member?.namaLengkap ||
        member?.fullName ||
        `Peneliti ${index + 1}`,
      url:
        member?.dokumenIdentitasUrl ||
        member?.identityDocumentUrl ||
        member?.ktpUrl ||
        member?.url ||
        fallbackUrl,
    }));
  }

  const totalParticipants = Math.max(
    1,
    Number(source?.jumlahDomestik || 0) + Number(source?.jumlahMancanegara || 0),
  );
  if (totalParticipants > 1) {
    return Array.from({ length: totalParticipants }, (_, index) => ({
      id: `${ticketRow?.ticketId || source?.id || 'ticket'}-${index + 1}`,
      name: `Peneliti ${index + 1}`,
      url: fallbackUrl,
    }));
  }

  return [{
    id: `${ticketRow?.ticketId || source?.id || 'ticket'}-1`,
    name: ticketRow?.namaLengkap || source?.namaLengkap || '-',
    url: fallbackUrl,
  }];
};

export default function InvoiceDetailPage() {
  const { invoiceId } = useParams();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isFromApproval = searchParams.get('from') === 'approval';
  const approvalParam = searchParams.get('approval');
  const approvalTab = searchParams.get('tab');
  const backToHref =
    isFromApproval && approvalTab
      ? `/approval?tab=${encodeURIComponent(approvalTab)}`
      : isFromApproval
        ? '/approval'
        : '/invoices';
  const role = getUserRole();
  const canExport = isAdministrator(role);
  const shouldAutoPrint = new URLSearchParams(location.search).get('print') === '1';
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [invoiceOverride, setInvoiceOverride] = useState(null);
  const [editForm, setEditForm] = useState({
    invoiceNo: '',
    issuedAt: '',
    paymentStatus: 'belum_bayar',
    method: 'blud_bank_va',
    paidAt: '',
    billedName: '',
    billedEmail: '',
    billedPhone: '',
    notes: '',
  });
  const [showDocumentsDialog, setShowDocumentsDialog] = useState(false);
  const [selectedDocCategory, setSelectedDocCategory] = useState(null);
  const [selectedDocTicketId, setSelectedDocTicketId] = useState('');

  const { invoice: baseInvoice, lines } = useMemo(() => {
    const id = invoiceId || '';
    const invLines = getInvoiceLinesById(id);
    const inv = invLines.length ? buildInvoiceFromLines(id, invLines) : null;
    return { invoice: inv, lines: invLines };
  }, [invoiceId]);

  const invoice = useMemo(() => {
    if (!baseInvoice) return null;

    const ticketRows = baseInvoice.tickets.map((t) => ({
      ...t,
      paymentStatus:
        invoiceOverride?.paymentStatus && invoiceOverride.paymentStatus !== 'campuran'
          ? invoiceOverride.paymentStatus
          : t.paymentStatus,
      paidAt: invoiceOverride?.paidAt || t.paidAt,
      method:
        invoiceOverride?.method && invoiceOverride.method !== 'campuran'
          ? invoiceOverride.method
          : t.method,
    }));

    const subtotal = ticketRows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    const grandTotal = subtotal;

    const byCategoryMap = new Map();
    for (const r of ticketRows) {
      const key = r.feeCategory;
      const current = byCategoryMap.get(key) || { feeCategory: key, feeLabel: r.feeLabel, qty: 0, total: 0 };
      current.qty += 1;
      current.total += Number(r.amount) || 0;
      byCategoryMap.set(key, current);
    }

    const derivedPaymentStatus = aggregate(ticketRows.map((t) => t.paymentStatus));
    const derivedMethod = aggregate(ticketRows.map((t) => t.method));
    const derivedRealisasi = aggregate(ticketRows.map((t) => t.realisasiStatus));

    const billedSource = ticketRows[0] || baseInvoice.tickets[0];

    return {
      ...baseInvoice,
      invoiceNo: invoiceOverride?.invoiceNo || baseInvoice.invoiceNo,
      issuedAt: invoiceOverride?.issuedAt || baseInvoice.issuedAt,
      paymentStatus: invoiceOverride?.paymentStatus || derivedPaymentStatus || baseInvoice.paymentStatus,
      method: invoiceOverride?.method || derivedMethod || baseInvoice.method,
      realisasiStatus: derivedRealisasi || baseInvoice.realisasiStatus,
      billedTo: {
        ...baseInvoice.billedTo,
        name: invoiceOverride?.billedName || billedSource?.namaLengkap || baseInvoice.billedTo.name,
        email: invoiceOverride?.billedEmail || billedSource?.email || baseInvoice.billedTo.email,
        phone: invoiceOverride?.billedPhone || billedSource?.noHP || baseInvoice.billedTo.phone,
      },
      subtotal,
      grandTotal,
      ticketCount: ticketRows.length,
      tickets: ticketRows,
      byCategory: Array.from(byCategoryMap.values()).sort((a, b) => b.total - a.total),
      notes: invoiceOverride?.notes,
    };
  }, [baseInvoice, invoiceOverride]);

  const isApprovalPending = useMemo(() => {
    if (approvalParam === 'pending') return true;
    return Boolean(invoice?.tickets?.some((ticket) => ticket.approvalStatus === 'menunggu'));
  }, [approvalParam, invoice]);

  const toDateTimeLocal = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const fromDateTimeLocal = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString();
  };

  const openEditDialog = () => {
    if (!invoice) return;
    setEditForm({
      invoiceNo: invoice.invoiceNo || '',
      issuedAt: toDateTimeLocal(invoice.issuedAt),
      paymentStatus: invoice.paymentStatus === 'campuran' ? 'belum_bayar' : invoice.paymentStatus,
      method: normalizeEditablePaymentMethod(
        invoice.method === 'campuran' ? '' : invoice.method,
        invoice,
      ),
      paidAt: toDateTimeLocal(invoice.tickets?.[0]?.paidAt || ''),
      billedName: invoice.billedTo?.name || '',
      billedEmail: invoice.billedTo?.email || '',
      billedPhone: invoice.billedTo?.phone || '',
      notes: invoice.notes || '',
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    const normalizedMethod = normalizeEditablePaymentMethod(editForm.method, invoice);
    const normalizedPaidAt = fromDateTimeLocal(editForm.paidAt);
    const normalizedPaymentStatus = editForm.paymentStatus;
    const isPaidOrRefunded = [
      'sudah_bayar',
      'refund_diajukan',
      'refund_diproses',
      'refund_selesai',
    ].includes(normalizedPaymentStatus);
    const nextRealisasiStatus = isPaidOrRefunded ? 'sudah_terealisasi' : 'belum_terealisasi';

    lines.forEach((line) => {
      saveInvoiceLineOverride(invoice.invoiceId, line.ticketId, {
        paymentStatus: normalizedPaymentStatus,
        method: normalizedMethod,
        paidAt: isPaidOrRefunded ? normalizedPaidAt : '',
        refundFlag: normalizedPaymentStatus.startsWith('refund_'),
        realisasiStatus: nextRealisasiStatus,
      });

      if (getTicketById(line.ticketId)) {
        saveTicketOverride(line.ticketId, {
          paymentStatus: normalizedPaymentStatus,
          paidAt: isPaidOrRefunded ? normalizedPaidAt : '',
          realisasiStatus: nextRealisasiStatus,
          qrActive: isPaidOrRefunded,
        });
      }
    });

    setInvoiceOverride({
      invoiceNo: editForm.invoiceNo,
      issuedAt: fromDateTimeLocal(editForm.issuedAt),
      paymentStatus: normalizedPaymentStatus,
      method: normalizedMethod,
      paidAt: normalizedPaidAt,
      billedName: editForm.billedName,
      billedEmail: editForm.billedEmail,
      billedPhone: editForm.billedPhone,
      notes: editForm.notes,
    });
    setShowEditDialog(false);
  };

  useEffect(() => {
    if (!shouldAutoPrint) return;
    const timer = setTimeout(() => window.print(), 250);
    return () => clearTimeout(timer);
  }, [shouldAutoPrint]);

  useEffect(() => {
    setInvoiceOverride(null);
    setShowEditDialog(false);
    setShowDocumentsDialog(false);
    setSelectedDocCategory(null);
    setSelectedDocTicketId('');
  }, [invoiceId]);

  if (!invoice || !lines.length) {
    return (
      <AdminLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Invoice Tidak Ditemukan</h2>
            <p className="text-sm text-muted-foreground mb-4">ID: {invoiceId || '-'}</p>
            <Link to={backToHref}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {isFromApproval ? 'Kembali ke Antrian Persetujuan' : 'Kembali ke Invoice'}
              </Button>
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const paymentMethodSummary = Array.from(
    new Set(
      invoice.tickets.map((ticket) => {
        const sourceTicket = getTicketById(ticket.ticketId);
        return formatPaymentMethod(ticket.method, sourceTicket);
      })
    )
  ).join(', ');

  const researcherInvoiceDetails = invoice.tickets
    .filter((ticket) => isResearcherFeeCategory(ticket.feeCategory))
    .map((ticket) => buildResearcherInvoiceDetail(getTicketById(ticket.ticketId), ticket));

  const hasResearcherTicket = invoice.tickets.some((ticket) =>
    isResearcherFeeCategory(ticket.feeCategory),
  );
  const docCategorySource = hasResearcherTicket
    ? invoice.byCategory.filter((item) => isResearcherFeeCategory(item.feeCategory))
    : invoice.byCategory;

  const supportingDocsByCategory = docCategorySource.flatMap((item) => {
    const ticketsInCategory = invoice.tickets.filter((ticket) => ticket.feeCategory === item.feeCategory);
    const ownerNames = Array.from(
      new Set(
        ticketsInCategory
          .map((ticket) => ticket.namaLengkap)
          .filter(Boolean),
      ),
    );
    const ownerLabel =
      ownerNames.length <= 2
        ? ownerNames.join(', ')
        : `${ownerNames[0]} +${ownerNames.length - 1} lainnya`;

    if (isResearcherFeeCategory(item.feeCategory)) {
      const researcherDocCards = [
        {
          id: `${item.feeCategory}-surat-izin`,
          ownerLabel: DOCUMENT_LABELS.surat_izin_penelitian,
          docs: ['Dokumen terpisah per tiket peneliti'],
          docKeys: ['surat_izin_penelitian'],
        },
        {
          id: `${item.feeCategory}-surat-permohonan`,
          ownerLabel: DOCUMENT_LABELS.surat_permohonan_penelitian,
          docs: ['Dokumen terpisah per tiket peneliti'],
          docKeys: ['surat_permohonan_penelitian'],
        },
        {
          id: `${item.feeCategory}-foto-identitas-penanggung-jawab`,
          ownerLabel: DOCUMENT_LABELS.foto_identitas_penanggung_jawab,
          docs: ['Dokumen terpisah per tiket peneliti'],
          docKeys: ['foto_identitas_penanggung_jawab'],
        },
        {
          id: `${item.feeCategory}-foto-identitas-peneliti`,
          ownerLabel: DOCUMENT_LABELS.foto_identitas_peneliti,
          docs: ['Klik untuk melihat banyak data identitas peneliti'],
          docKeys: ['foto_identitas_peneliti'],
        },
      ];

      return researcherDocCards.map((card) => ({
        feeCategory: item.feeCategory,
        feeLabel: item.feeLabel,
        ownerLabel: card.ownerLabel,
        docs: card.docs,
        tickets: ticketsInCategory,
        ticketCount: ticketsInCategory.length,
        docKeys: card.docKeys,
        id: card.id,
      }));
    }

    return [{
      id: item.feeCategory,
      feeCategory: item.feeCategory,
      feeLabel: item.feeLabel,
      ownerLabel: ownerLabel || item.feeLabel,
      docs: getRequiredDocumentLabels(item.feeCategory),
      tickets: ticketsInCategory,
      ticketCount: ticketsInCategory.length,
      docKeys: null,
    }];
  });

  const selectedDocTicket = selectedDocTicketId ? getTicketById(selectedDocTicketId) : null;
  const shouldShowAllResearcherIdentityDocs = Boolean(
    selectedDocCategory?.docKeys?.length === 1 &&
    selectedDocCategory?.docKeys?.[0] === 'foto_identitas_peneliti',
  );
  const researcherIdentityPreviewItems = shouldShowAllResearcherIdentityDocs
    ? selectedDocCategory.tickets
      .flatMap((ticketRow) => {
        const sourceTicket = getTicketById(ticketRow.ticketId);
        const docMeta = getDocumentItemsForTicket(
          sourceTicket,
          selectedDocCategory.feeCategory,
          selectedDocCategory.docKeys,
        )[0] || {
          key: 'foto_identitas_peneliti',
          label: DOCUMENT_LABELS.foto_identitas_peneliti,
        };
        return getResearcherIdentityParticipants(sourceTicket, ticketRow).map((participant) => ({
          ...docMeta,
          ticketId: ticketRow.ticketId,
          ticketName: participant.name,
          participantId: participant.id,
          url: participant.url,
        }));
      })
      .filter(Boolean)
    : [];
  const selectedDocItems = selectedDocCategory
    ? getDocumentItemsForTicket(
      selectedDocTicket,
      selectedDocCategory.feeCategory,
      selectedDocCategory.docKeys,
    )
    : [];

  const openDocumentsDialog = (categoryGroup) => {
    setSelectedDocCategory(categoryGroup);
    setSelectedDocTicketId(categoryGroup?.tickets?.[0]?.ticketId || '');
    setShowDocumentsDialog(true);
  };

  const handleDocumentDownload = (url, filename = 'document') => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = filename;
    link.rel = 'noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isApprovalRelatedTicket = (ticket) =>
    APPROVAL_REQUIRED_FEE_CATEGORIES.has(ticket.feeCategory);

  const isPaymentPendingForApproval = (ticket) =>
    isApprovalRelatedTicket(ticket) && ticket.approvalStatus !== 'disetujui';

  const hasRefundForTicket = (ticket) =>
    String(ticket.paymentStatus || '').startsWith('refund_');

  const isChildInvoiceTicket = (ticket) => {
    const sourceTicket = getTicketById(ticket?.ticketId);
    return Boolean(
      sourceTicket?.isChildVisitor ||
      sourceTicket?.relationshipToParent === 'anak' ||
      sourceTicket?.parentTicketId,
    );
  };

  const getInvoiceTicketIdDisplay = (ticket) =>
    isChildInvoiceTicket(ticket) ? '-' : ticket?.ticketId || '-';

  const handleExportJSON = () => {
    if (!canExport) return;
    exportJSON(invoice, `invoice_${invoice.invoiceNo}.json`);
  };

  const handleExportTicketsExcel = () => {
    if (!canExport) return;
    exportExcel(
      invoice.tickets.map((t) => ({
        invoice_id: invoice.invoiceId,
        invoice_no: invoice.invoiceNo,
        ticket_id: isChildInvoiceTicket(t) ? '' : t.ticketId,
        nama: t.namaLengkap,
        email: t.email,
        phone: t.noHP,
        domisili: getCountryForTicket(t.ticketId),
        booking_type: t.bookingType,
        category: t.feeCategory,
        unit_price: t.unitPrice,
        amount: t.amount,
        approval_status: t.approvalStatus,
        payment_status: t.paymentStatus,
        method: formatPaymentMethod(t.method, getTicketById(t.ticketId)),
        paid_at: t.paidAt || '',
          created_at: t.createdAt,
        })),
      `invoice_${invoice.invoiceNo}_tickets.xlsx`,
      { sheetName: 'Tickets' }
    );
  };

  return (
    <AdminLayout>
      <AdminHeader
        title={`Invoice ${invoice.invoiceNo}`}
        subtitle={invoice.invoiceType === 'group' ? 'Invoice Grup (multi tiket)' : 'Invoice Perorangan'}
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        <style>{`
          @media print {
            .no-print { display: none !important; }
            .print-wrap { padding: 0 !important; }
            .card-ocean { box-shadow: none !important; border: 1px solid #ddd !important; }
            table { width: 100% !important; }
          }
        `}</style>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
          <Link to={backToHref}>
            <Button variant="ghost" className="gap-2 w-full sm:w-auto justify-start">
              <ArrowLeft className="w-4 h-4" />
              {isFromApproval ? 'Kembali ke Antrian Persetujuan' : 'Kembali'}
            </Button>
          </Link>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={openEditDialog}>
              <Edit className="w-4 h-4" />
              Edit Invoice
            </Button>
            <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </Button>

            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={handleExportJSON}
              disabled={!canExport}
              title={!canExport ? 'Hanya Admin Utama yang bisa export' : 'Export JSON'}
            >
              <Download className="w-4 h-4" />
              Export JSON
            </Button>

            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={handleExportTicketsExcel}
              disabled={!canExport}
                title={!canExport ? 'Hanya Admin Utama yang bisa export' : 'Export tiket XLS'}
              >
                <Download className="w-4 h-4" />
              Export Tiket (XLS)
              </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print-wrap">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Detail Invoice
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{invoice.invoiceType === 'group' ? 'Grup' : 'Perorangan'}</Badge>
                    {invoice.paymentStatus === 'campuran'
                      ? <Badge variant="outline">Pembayaran Campuran</Badge>
                      : <PaymentStatusChip status={invoice.paymentStatus} />
                    }
                    {isApprovalPending && (
                      <Badge
                        variant="outline"
                        className="border-status-pending text-status-pending"
                      >
                        Pending Persetujuan
                      </Badge>
                    )}
                    {invoice.refundFlag && <Badge variant="outline">Refund</Badge>}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">No. Invoice</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono font-medium text-primary">{invoice.invoiceNo}</p>
                      <Button className="h-7 w-7 no-print" variant="ghost" size="icon" onClick={() => copyToClipboard(invoice.invoiceNo)}>
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tanggal</p>
                    <p className="text-sm font-medium">{formatDateTime(invoice.issuedAt)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Jumlah Tiket</p>
                    <p className="text-sm font-medium">{invoice.ticketCount}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Metode</p>
                    <p className="text-sm font-medium">{paymentMethodSummary || '-'}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Ditagihkan Kepada</p>
                  <p className="text-sm font-medium">{invoice.billedTo.name}</p>
                  <p className="text-xs text-muted-foreground">{invoice.billedTo.email} {invoice.billedTo.phone}</p>
                </div>
                {isApprovalPending && (
                  <p className="mt-3 text-xs text-status-pending">
                    Invoice dikirim ke email pengaju setelah tiket disetujui.
                  </p>
                )}
              </CardContent>
            </Card>

            {researcherInvoiceDetails.length > 0 && (
              <Card className="card-ocean">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Detail Peneliti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {researcherInvoiceDetails.map((detail) => {
                    const formItems = [
                      { label: 'Lokasi KKPN', value: detail.lokasiKkpn },
                      { label: 'Nama Institusi', value: detail.namaInstitusi },
                      { label: 'Asal Institusi', value: detail.asalInstitusi },
                      { label: 'Alamat Institusi', value: detail.alamatInstitusi },
                      { label: 'Provinsi', value: detail.provinsi },
                      { label: 'Kabupaten/Kota', value: detail.kabupatenKota },
                      { label: 'Nomor Telepon Institusi Peneliti', value: detail.teleponInstitusi },
                      { label: 'Email Institusi Peneliti', value: detail.emailInstitusi },
                      { label: 'Judul Penelitian', value: detail.judulPenelitian },
                      { label: 'Tujuan Penelitian', value: detail.tujuanPenelitian },
                      { label: 'Uraian Singkat Penelitian', value: detail.uraianSingkatPenelitian },
                      { label: 'Tanggal Mulai Kegiatan', value: detail.tanggalMulaiKegiatan },
                      { label: 'Tanggal Selesai Kegiatan', value: detail.tanggalSelesaiKegiatan },
                      { label: 'Nama Lengkap Penanggung Jawab', value: detail.penanggungJawabNama },
                      { label: 'Kewarganegaraan Penanggung Jawab', value: detail.penanggungJawabKewarganegaraan },
                      { label: 'Nomor Seluler Penanggung Jawab', value: detail.penanggungJawabNomorSeluler },
                    ];

                    return (
                      <div key={detail.ticketId} className="rounded-lg border border-border p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{detail.ticketName}</p>
                            <p className="text-xs text-muted-foreground">
                              {detail.ticketId} - {detail.feeLabel}
                            </p>
                          </div>
                          <Badge variant="outline">Form Peneliti</Badge>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          {formItems.map((item) => (
                            <div key={`${detail.ticketId}-${item.label}`}>
                              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                              <p className="text-sm font-medium whitespace-pre-wrap break-words">
                                {item.value || '-'}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-xs text-muted-foreground mb-2">Sarana Penelitian yang Digunakan</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-md bg-muted/40 p-3">
                              <p className="text-xs text-muted-foreground mb-1">Sarana</p>
                              <p className="text-sm font-medium whitespace-pre-wrap break-words">
                                {detail.saranaPenelitian || '-'}
                              </p>
                            </div>
                            <div className="rounded-md bg-muted/40 p-3">
                              <p className="text-xs text-muted-foreground mb-1">
                                Kapal Penelitian - Ekspedisi Berbendera Indonesia
                              </p>
                              <p className="text-sm font-medium">
                                Jumlah: {detail.kapalPenelitianIndonesiaJumlah ?? '-'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap break-words">
                                Nama Kapal: {detail.kapalPenelitianIndonesiaNama || '-'}
                              </p>
                            </div>
                            <div className="rounded-md bg-muted/40 p-3 md:col-span-2">
                              <p className="text-xs text-muted-foreground mb-1">
                                Kapal Penelitian - Ekspedisi Berbendera Asing
                              </p>
                              <p className="text-sm font-medium">
                                Jumlah: {detail.kapalPenelitianAsingJumlah ?? '-'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap break-words">
                                Nama Kapal: {detail.kapalPenelitianAsingNama || '-'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* TICKETS TABLE */}
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Daftar Tiket dalam Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID Tiket</th>
                        <th>Nama</th>
                        <th>Domisili (Negara)</th>
                        {/* <th>Tipe Tiket</th> */}
                        <th>Kategori</th>
                        <th className="text-right">Jumlah Rp</th>
                        {/* <th>Approval</th> */}
                        <th>Pembayaran</th>
                        <th>Pengembalian</th>
                        <th className="text-center no-print">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.tickets.map((t) => (
                        <tr key={t.ticketId}>
                          <td className="whitespace-nowrap font-mono text-sm">{getInvoiceTicketIdDisplay(t)}</td>
                          <td>
                            <div>
                              <p className="text-sm font-medium">{t.namaLengkap}</p>
                              <p className="text-xs text-muted-foreground">{t.email}</p>
                            </div>
                          </td>
                          <td className="text-sm">{getCountryForTicket(t.ticketId)}</td>
                          {/* <td>
                            <Badge variant="secondary">{t.bookingType === 'group' ? 'Grup' : 'Perorangan'}</Badge>
                          </td> */}
                          <td className="text-sm">{t.feeLabel}</td>
                          <td className="text-right text-sm font-semibold">{formatNominal(t.amount)}</td>
                          {/* <td><ApprovalStatusChip status={t.approvalStatus} /></td> */}
                            <td>
                              {isPaymentPendingForApproval(t) ? (
                                <Badge
                                  variant="outline"
                                  className="border-status-pending text-status-pending"
                                >
                                  Pending
                                </Badge>
                              ) : (
                                <PaymentStatusChip status={t.paymentStatus} />
                              )}
                            </td>
                            <td className="text-sm">{hasRefundForTicket(t) ? 'Ya' : 'Tidak'}</td>
                            <td className="text-center no-print">
                              <Link
                                to={`/tickets/${t.ticketId}?from=invoice&invoiceId=${encodeURIComponent(invoice.invoiceId)}`}
                              >
                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Detail tiket">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/40 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Ringkasan per Kategori</p>
                    <div className="space-y-2">
                      {invoice.byCategory.map((c) => (
                        <div key={c.feeCategory} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{c.feeLabel} {c.qty} tiket</span>
                          <span className="font-semibold">{formatNominal(c.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/40 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Total Invoice</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal Rp</span>
                        <span>{formatNominal(invoice.subtotal)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Grand Total Rp</span>
                        <span className="text-xl font-bold text-primary">{formatNominal(invoice.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <p className="text-xs text-muted-foreground mt-4">
                  Role kamu: <span className="font-medium text-foreground">{role}</span>. Export hanya untuk <span className="font-medium text-foreground">Admin Utama</span>.
                </p> */}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <Card className="card-ocean">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Dokumen Pendukung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {supportingDocsByCategory.map((group) => (
                  <div key={group.id} className="rounded-lg border border-border p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">
                      {group.ownerLabel}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {group.docs.join(', ')}
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
          </div>
        </div>
      </div>

      <Dialog open={showDocumentsDialog} onOpenChange={setShowDocumentsDialog}>
        <DialogContent className="bg-card border-border max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dokumen Pendukung Invoice</DialogTitle>
            <DialogDescription>
              {selectedDocCategory
                ? shouldShowAllResearcherIdentityDocs
                  ? `${selectedDocCategory.ownerLabel} - pratinjau per peneliti`
                  : `${selectedDocCategory.ownerLabel} - pilih tiket untuk melihat dokumen`
                : 'Pilih kategori dokumen'}
            </DialogDescription>
          </DialogHeader>

          {selectedDocCategory && (
            <div className="space-y-4">
              {selectedDocCategory.tickets.length > 1 && !shouldShowAllResearcherIdentityDocs && (
                <div className="space-y-2">
                  <Label>Pilih Tiket</Label>
                  <Select value={selectedDocTicketId} onValueChange={setSelectedDocTicketId}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border max-h-72">
                      {selectedDocCategory.tickets.map((ticket) => (
                        <SelectItem key={ticket.ticketId} value={ticket.ticketId}>
                          {getInvoiceTicketIdDisplay(ticket)} - {ticket.namaLengkap}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {shouldShowAllResearcherIdentityDocs ? (
                researcherIdentityPreviewItems.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {researcherIdentityPreviewItems.map((doc) => (
                      <div key={`${doc.ticketId}-${doc.participantId}-${doc.key}`} className="space-y-2 rounded-lg border border-border p-3">
                        <p className="text-xs font-medium text-foreground">{doc.ticketName}</p>
                        <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                          <img
                            src={doc.url || '/placeholder.svg'}
                            alt={`Pratinjau identitas ${doc.ticketName}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}>
                            Preview
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDocumentDownload(doc.url, `${doc.ticketId}-${doc.key}`)}
                          >
                            Unduh
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Dokumen belum tersedia untuk tiket peneliti.
                  </div>
                )
              ) : selectedDocItems.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDocItems.map((doc) => (
                    <div key={`${selectedDocTicketId}-${doc.key}`} className="space-y-2 rounded-lg border border-border p-3">
                      <p className="text-xs font-medium text-foreground">{doc.label}</p>
                      <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={doc.url || '/placeholder.svg'}
                          alt={`Pratinjau ${doc.label}`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}>
                          Preview
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleDocumentDownload(doc.url, `${selectedDocTicketId}-${doc.key}`)}
                        >
                          Unduh
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Dokumen belum tersedia untuk tiket ini.
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentsDialog(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Ubah manual data invoice jika sistem otomatis bermasalah.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="space-y-2">
              <Label>No. Invoice</Label>
              <Input
                value={editForm.invoiceNo}
                onChange={(e) => setEditForm((prev) => ({ ...prev, invoiceNo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tanggal Invoice</Label>
              <Input
                type="datetime-local"
                value={editForm.issuedAt}
                onChange={(e) => setEditForm((prev) => ({ ...prev, issuedAt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Status Pembayaran</Label>
              <Select
                value={editForm.paymentStatus}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, paymentStatus: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="belum_bayar">Belum Bayar</SelectItem>
                  <SelectItem value="sudah_bayar">Sudah Bayar</SelectItem>
                  <SelectItem value="tidak_bayar">Tidak Bayar (lebih dari 24 jam)</SelectItem>
                  <SelectItem value="refund_diajukan">Refund Diajukan</SelectItem>
                  <SelectItem value="refund_diproses">Refund Diproses</SelectItem>
                  <SelectItem value="refund_selesai">Refund Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Metode Pembayaran</Label>
              <Select
                value={editForm.method}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, method: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="doku_credit_card">Doku - Credit Card</SelectItem>
                  <SelectItem value="doku_bank_va">Doku - Transfer Bank (VA)</SelectItem>
                  <SelectItem value="doku_qris">Doku - QRIS</SelectItem>
                  <SelectItem value="doku_e_wallet">Doku - E-Wallet</SelectItem>
                  <SelectItem value="doku_minimarket">Doku - Minimarket</SelectItem>
                  <SelectItem value="doku_paylater">Doku - PayLater</SelectItem>
                  <SelectItem value="doku_bank_direct">Doku - Bank Langsung</SelectItem>
                  <SelectItem value="doku_bank_digital">Doku - Bank Digital</SelectItem>
                  <SelectItem value="blud_bank_va">BLUD R4 - Transfer Bank (VA)</SelectItem>
                  <SelectItem value="blud_qris">BLUD R4 - QRIS</SelectItem>
                  <SelectItem value="blud_bank_direct">BLUD R4 - Bank Langsung</SelectItem>
                  <SelectItem value="blud_cash">BLUD R4 - Tunai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Bayar</Label>
              <Input
                type="datetime-local"
                value={editForm.paidAt}
                onChange={(e) => setEditForm((prev) => ({ ...prev, paidAt: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Nama Tagihan</Label>
              <Input
                value={editForm.billedName}
                onChange={(e) => setEditForm((prev) => ({ ...prev, billedName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.billedEmail}
                onChange={(e) => setEditForm((prev) => ({ ...prev, billedEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>No. HP</Label>
              <Input
                value={editForm.billedPhone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, billedPhone: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Catatan Koreksi</Label>
            <Textarea
              placeholder="Tambahkan alasan perubahan manual..."
              value={editForm.notes}
              onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button className="btn-ocean gap-2" onClick={handleSaveEdit}>
              <Upload className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

