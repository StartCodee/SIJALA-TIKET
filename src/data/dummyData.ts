// Dummy data for Raja Ampat Conservation Fee Ticketing Admin Dashboard

export type ApprovalStatus = 'menunggu' | 'disetujui' | 'ditolak' | 'revisi';
export type PaymentStatus = 'belum_bayar' | 'sudah_bayar' | 'refund_diproses' | 'refund_selesai';
export type GateStatus = 'belum_masuk' | 'masuk' | 'keluar';
export type RealisasiStatus = 'belum_terealisasi' | 'sudah_terealisasi';
export type RefundStatus = 'requested' | 'processing' | 'completed' | 'rejected' | 'cancelled';
export type RefundType = 'full' | 'partial';
export type BookingType = 'perorangan' | 'group';
export type UserRole = 'super_admin' | 'finance_admin' | 'approver_admin' | 'viewer';

export type FeeCategory = 
  | 'wisatawan_domestik_pbd'
  | 'wisatawan_domestik_papua'
  | 'wisatawan_domestik_luar_papua'
  | 'wisatawan_mancanegara'
  | 'peneliti_domestik'
  | 'peneliti_mancanegara'
  | 'mooring'
  | 'sport_fishing';

export type DomisiliOCR = 'pbd' | 'tanah_papua' | 'luar_papua' | 'mancanegara';

export interface Ticket {
  id: string;
  bookingType: BookingType;
  feeCategory: FeeCategory;
  domisiliOCR: DomisiliOCR;
  ocrConfidence: number;
  
  // Pemesan info
  namaLengkap: string;
  email: string;
  noHP: string;
  ktmUrl: string;
  
  // Group specific
  jumlahDomestik?: number;
  jumlahMancanegara?: number;
  
  // Pricing
  hargaPerOrang: number;
  totalBiaya: number;
  
  // Status
  approvalStatus: ApprovalStatus;
  paymentStatus: PaymentStatus;
  gateStatus: GateStatus;
  realisasiStatus: RealisasiStatus;
  needsApproval: boolean;
  
  // Admin info
  approvedBy?: string;
  approvedAt?: string;
  lastActionBy: string;
  lastActionAt: string;
  
  // Timestamps
  createdAt: string;
  paidAt?: string;
  enteredAt?: string;
  exitedAt?: string;
  
  // QR
  qrActive: boolean;
}

export interface Refund {
  id: string;
  ticketId: string;
  ticketName: string;
  originalAmount: number;
  refundAmount: number;
  type: RefundType;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  requestedBy: string;
  processedBy?: string;
  processedAt?: string;
  completedAt?: string;
  referenceNumber?: string;
  proofUrl?: string;
  notes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'disabled';
  lastLogin: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  adminRole: UserRole;
  actionType: string;
  entityType: 'Ticket' | 'Payment' | 'Refund' | 'User' | 'Settings';
  entityId: string;
  beforeValue?: string;
  afterValue?: string;
  note?: string;
}

export interface Invoice {
  id: string;
  ticketId: string;
  amount: number;
  method: 'bank_transfer' | 'credit_card' | 'qris' | 'e_wallet';
  paidAt?: string;
  paymentStatus: PaymentStatus;
  realisasiStatus: RealisasiStatus;
  refundFlag: boolean;
}

// Fee pricing constants
export const FEE_PRICING: Record<FeeCategory, { label: string; price: number; needsApproval: boolean }> = {
  wisatawan_domestik_pbd: { label: 'Wisatawan Domestik (PBD)', price: 150000, needsApproval: false },
  wisatawan_domestik_papua: { label: 'Wisatawan Domestik (Tanah Papua)', price: 250000, needsApproval: false },
  wisatawan_domestik_luar_papua: { label: 'Wisatawan Domestik (Luar Papua)', price: 500000, needsApproval: false },
  wisatawan_mancanegara: { label: 'Wisatawan Mancanegara', price: 1000000, needsApproval: false },
  peneliti_domestik: { label: 'Peneliti Domestik', price: 500000, needsApproval: true },
  peneliti_mancanegara: { label: 'Peneliti Mancanegara', price: 1000000, needsApproval: true },
  mooring: { label: 'Mooring (Kapal Wisata/Phinisi)', price: 75000000, needsApproval: true },
  sport_fishing: { label: 'Sport Fishing', price: 2500000, needsApproval: true },
};

export const DOMISILI_LABELS: Record<DomisiliOCR, string> = {
  pbd: 'Papua Barat Daya',
  tanah_papua: 'Tanah Papua (selain PBD)',
  luar_papua: 'Luar Pulau Papua',
  mancanegara: 'Mancanegara',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  finance_admin: 'Finance Admin',
  approver_admin: 'Approver Admin',
  viewer: 'Viewer/Auditor',
};

// Dummy Tickets
export const dummyTickets: Ticket[] = [
  {
    id: 'RA-2024-001',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_pbd',
    domisiliOCR: 'pbd',
    ocrConfidence: 95,
    namaLengkap: 'Budi Santoso',
    email: 'budi@gmail.com',
    noHP: '081234567890',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 150000,
    totalBiaya: 150000,
    approvalStatus: 'disetujui',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'System',
    lastActionAt: '2024-01-15T10:30:00',
    createdAt: '2024-01-15T10:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-002',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_luar_papua',
    domisiliOCR: 'luar_papua',
    ocrConfidence: 88,
    namaLengkap: 'Siti Rahayu',
    email: 'siti@gmail.com',
    noHP: '081234567891',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 500000,
    totalBiaya: 500000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'System',
    lastActionAt: '2024-01-16T14:00:00',
    createdAt: '2024-01-16T12:00:00',
    paidAt: '2024-01-16T14:00:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-003',
    bookingType: 'group',
    feeCategory: 'wisatawan_domestik_luar_papua',
    domisiliOCR: 'luar_papua',
    ocrConfidence: 92,
    namaLengkap: 'Ahmad Wijaya',
    email: 'ahmad@gmail.com',
    noHP: '081234567892',
    ktmUrl: '/placeholder.svg',
    jumlahDomestik: 5,
    jumlahMancanegara: 2,
    hargaPerOrang: 500000,
    totalBiaya: 4500000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'masuk',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Gate Scanner',
    lastActionAt: '2024-01-17T08:30:00',
    createdAt: '2024-01-16T18:00:00',
    paidAt: '2024-01-16T20:00:00',
    enteredAt: '2024-01-17T08:30:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-004',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    ocrConfidence: 99,
    namaLengkap: 'John Smith',
    email: 'john@email.com',
    noHP: '+61412345678',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'keluar',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Gate Scanner',
    lastActionAt: '2024-01-18T16:00:00',
    createdAt: '2024-01-15T09:00:00',
    paidAt: '2024-01-15T11:00:00',
    enteredAt: '2024-01-16T07:00:00',
    exitedAt: '2024-01-18T16:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-005',
    bookingType: 'perorangan',
    feeCategory: 'peneliti_domestik',
    domisiliOCR: 'luar_papua',
    ocrConfidence: 87,
    namaLengkap: 'Dr. Maria Putri',
    email: 'maria.putri@univ.ac.id',
    noHP: '081234567895',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 500000,
    totalBiaya: 500000,
    approvalStatus: 'menunggu',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    lastActionBy: 'System',
    lastActionAt: '2024-01-18T10:00:00',
    createdAt: '2024-01-18T10:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-006',
    bookingType: 'perorangan',
    feeCategory: 'peneliti_mancanegara',
    domisiliOCR: 'mancanegara',
    ocrConfidence: 96,
    namaLengkap: 'Dr. James Wilson',
    email: 'jwilson@oxford.edu',
    noHP: '+44123456789',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 1000000,
    totalBiaya: 1000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'masuk',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: true,
    approvedBy: 'Dewi Anggraini',
    approvedAt: '2024-01-10T09:00:00',
    lastActionBy: 'Gate Scanner',
    lastActionAt: '2024-01-12T07:30:00',
    createdAt: '2024-01-09T15:00:00',
    paidAt: '2024-01-10T10:00:00',
    enteredAt: '2024-01-12T07:30:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-007',
    bookingType: 'perorangan',
    feeCategory: 'mooring',
    domisiliOCR: 'luar_papua',
    ocrConfidence: 91,
    namaLengkap: 'PT. Phinisi Jaya',
    email: 'info@phinisijaya.com',
    noHP: '021234567890',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 75000000,
    totalBiaya: 75000000,
    approvalStatus: 'ditolak',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    approvedBy: 'Rudi Hartono',
    approvedAt: '2024-01-14T11:00:00',
    lastActionBy: 'Rudi Hartono',
    lastActionAt: '2024-01-14T11:00:00',
    createdAt: '2024-01-13T14:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-008',
    bookingType: 'perorangan',
    feeCategory: 'sport_fishing',
    domisiliOCR: 'luar_papua',
    ocrConfidence: 89,
    namaLengkap: 'Fishing Club Indonesia',
    email: 'club@fishingindo.com',
    noHP: '081234567898',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 2500000,
    totalBiaya: 2500000,
    approvalStatus: 'revisi',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    lastActionBy: 'Dewi Anggraini',
    lastActionAt: '2024-01-17T16:00:00',
    createdAt: '2024-01-17T10:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-009',
    bookingType: 'group',
    feeCategory: 'wisatawan_domestik_papua',
    domisiliOCR: 'tanah_papua',
    ocrConfidence: 94,
    namaLengkap: 'Kelompok Wisata Papua',
    email: 'kwp@gmail.com',
    noHP: '081234567899',
    ktmUrl: '/placeholder.svg',
    jumlahDomestik: 8,
    jumlahMancanegara: 0,
    hargaPerOrang: 250000,
    totalBiaya: 2000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'masuk',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Gate Scanner',
    lastActionAt: '2024-01-19T09:00:00',
    createdAt: '2024-01-18T08:00:00',
    paidAt: '2024-01-18T12:00:00',
    enteredAt: '2024-01-19T09:00:00',
    qrActive: true,
  },
  {
    id: 'RA-2024-010',
    bookingType: 'perorangan',
    feeCategory: 'mooring',
    domisiliOCR: 'mancanegara',
    ocrConfidence: 97,
    namaLengkap: 'Coral Explorer Yacht',
    email: 'charter@coralexplorer.com',
    noHP: '+6281234567800',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 75000000,
    totalBiaya: 75000000,
    approvalStatus: 'menunggu',
    paymentStatus: 'belum_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: true,
    lastActionBy: 'System',
    lastActionAt: '2024-01-19T11:00:00',
    createdAt: '2024-01-19T11:00:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-011',
    bookingType: 'perorangan',
    feeCategory: 'wisatawan_domestik_pbd',
    domisiliOCR: 'pbd',
    ocrConfidence: 93,
    namaLengkap: 'Yohanes Wambrauw',
    email: 'yohanes@gmail.com',
    noHP: '085234567801',
    ktmUrl: '/placeholder.svg',
    hargaPerOrang: 150000,
    totalBiaya: 150000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'keluar',
    realisasiStatus: 'sudah_terealisasi',
    needsApproval: false,
    lastActionBy: 'Gate Scanner',
    lastActionAt: '2024-01-14T17:30:00',
    createdAt: '2024-01-12T09:00:00',
    paidAt: '2024-01-12T10:00:00',
    enteredAt: '2024-01-13T08:00:00',
    exitedAt: '2024-01-14T17:30:00',
    qrActive: false,
  },
  {
    id: 'RA-2024-012',
    bookingType: 'group',
    feeCategory: 'wisatawan_mancanegara',
    domisiliOCR: 'mancanegara',
    ocrConfidence: 98,
    namaLengkap: 'European Divers Group',
    email: 'tour@eudivers.eu',
    noHP: '+49123456789',
    ktmUrl: '/placeholder.svg',
    jumlahDomestik: 0,
    jumlahMancanegara: 12,
    hargaPerOrang: 1000000,
    totalBiaya: 12000000,
    approvalStatus: 'disetujui',
    paymentStatus: 'sudah_bayar',
    gateStatus: 'belum_masuk',
    realisasiStatus: 'belum_terealisasi',
    needsApproval: false,
    lastActionBy: 'System',
    lastActionAt: '2024-01-19T16:00:00',
    createdAt: '2024-01-19T14:00:00',
    paidAt: '2024-01-19T16:00:00',
    qrActive: true,
  },
];

// Dummy Refunds
export const dummyRefunds: Refund[] = [
  {
    id: 'REF-2024-001',
    ticketId: 'RA-2024-002',
    ticketName: 'Siti Rahayu',
    originalAmount: 500000,
    refundAmount: 500000,
    type: 'full',
    reason: 'Perubahan jadwal perjalanan',
    status: 'requested',
    requestedAt: '2024-01-19T10:00:00',
    requestedBy: 'Customer',
  },
  {
    id: 'REF-2024-002',
    ticketId: 'RA-2024-003',
    ticketName: 'Ahmad Wijaya (Group)',
    originalAmount: 4500000,
    refundAmount: 1000000,
    type: 'partial',
    reason: '2 peserta membatalkan',
    status: 'processing',
    requestedAt: '2024-01-18T14:00:00',
    requestedBy: 'Customer',
    processedBy: 'Rudi Hartono',
    processedAt: '2024-01-18T16:00:00',
  },
  {
    id: 'REF-2024-003',
    ticketId: 'RA-2024-005',
    ticketName: 'Dr. Maria Putri',
    originalAmount: 500000,
    refundAmount: 500000,
    type: 'full',
    reason: 'Penelitian dibatalkan',
    status: 'completed',
    requestedAt: '2024-01-10T09:00:00',
    requestedBy: 'Customer',
    processedBy: 'Dewi Anggraini',
    processedAt: '2024-01-10T11:00:00',
    completedAt: '2024-01-11T10:00:00',
    referenceNumber: 'TRF-20240111-001',
    proofUrl: '/placeholder.svg',
  },
  {
    id: 'REF-2024-004',
    ticketId: 'RA-2024-007',
    ticketName: 'PT. Phinisi Jaya',
    originalAmount: 75000000,
    refundAmount: 75000000,
    type: 'full',
    reason: 'Izin operasi ditolak',
    status: 'rejected',
    requestedAt: '2024-01-15T10:00:00',
    requestedBy: 'Customer',
    processedBy: 'Rudi Hartono',
    processedAt: '2024-01-15T14:00:00',
    notes: 'Tiket belum dibayar, tidak eligible untuk refund',
  },
  {
    id: 'REF-2024-005',
    ticketId: 'RA-2024-009',
    ticketName: 'Kelompok Wisata Papua',
    originalAmount: 2000000,
    refundAmount: 250000,
    type: 'partial',
    reason: '1 anggota sakit tidak bisa ikut',
    status: 'completed',
    requestedAt: '2024-01-17T08:00:00',
    requestedBy: 'Customer',
    processedBy: 'Dewi Anggraini',
    processedAt: '2024-01-17T10:00:00',
    completedAt: '2024-01-17T15:00:00',
    referenceNumber: 'TRF-20240117-002',
    proofUrl: '/placeholder.svg',
  },
  {
    id: 'REF-2024-006',
    ticketId: 'RA-2024-012',
    ticketName: 'European Divers Group',
    originalAmount: 12000000,
    refundAmount: 2000000,
    type: 'partial',
    reason: '2 peserta membatalkan di last minute',
    status: 'cancelled',
    requestedAt: '2024-01-19T18:00:00',
    requestedBy: 'Customer',
    notes: 'Dibatalkan oleh customer',
  },
];

// Dummy Admin Users
export const dummyAdminUsers: AdminUser[] = [
  {
    id: 'ADM-001',
    name: 'Rudi Hartono',
    email: 'rudi.hartono@rajaampat.go.id',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2024-01-19T08:30:00',
    createdAt: '2023-01-01T00:00:00',
  },
  {
    id: 'ADM-002',
    name: 'Dewi Anggraini',
    email: 'dewi.anggraini@rajaampat.go.id',
    role: 'approver_admin',
    status: 'active',
    lastLogin: '2024-01-19T09:15:00',
    createdAt: '2023-03-15T00:00:00',
  },
  {
    id: 'ADM-003',
    name: 'Bambang Susilo',
    email: 'bambang.susilo@rajaampat.go.id',
    role: 'finance_admin',
    status: 'active',
    lastLogin: '2024-01-18T16:45:00',
    createdAt: '2023-06-01T00:00:00',
  },
  {
    id: 'ADM-004',
    name: 'Rina Marlina',
    email: 'rina.marlina@rajaampat.go.id',
    role: 'viewer',
    status: 'active',
    lastLogin: '2024-01-17T10:00:00',
    createdAt: '2023-09-01T00:00:00',
  },
  {
    id: 'ADM-005',
    name: 'Agus Setiawan',
    email: 'agus.setiawan@rajaampat.go.id',
    role: 'approver_admin',
    status: 'disabled',
    lastLogin: '2024-01-05T14:30:00',
    createdAt: '2023-04-20T00:00:00',
  },
];

// Dummy Audit Logs
export const dummyAuditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2024-01-19T16:00:00',
    adminUser: 'System',
    adminRole: 'super_admin',
    actionType: 'payment_received',
    entityType: 'Payment',
    entityId: 'RA-2024-012',
    afterValue: 'Rp 12.000.000',
    note: 'Auto-approved payment via QRIS',
  },
  {
    id: 'LOG-002',
    timestamp: '2024-01-19T11:00:00',
    adminUser: 'System',
    adminRole: 'super_admin',
    actionType: 'ticket_created',
    entityType: 'Ticket',
    entityId: 'RA-2024-010',
    note: 'New mooring ticket pending approval',
  },
  {
    id: 'LOG-003',
    timestamp: '2024-01-18T16:00:00',
    adminUser: 'Rudi Hartono',
    adminRole: 'super_admin',
    actionType: 'refund_processing',
    entityType: 'Refund',
    entityId: 'REF-2024-002',
    beforeValue: 'requested',
    afterValue: 'processing',
    note: 'Started processing partial refund',
  },
  {
    id: 'LOG-004',
    timestamp: '2024-01-17T16:00:00',
    adminUser: 'Dewi Anggraini',
    adminRole: 'approver_admin',
    actionType: 'revision_requested',
    entityType: 'Ticket',
    entityId: 'RA-2024-008',
    beforeValue: 'menunggu',
    afterValue: 'revisi',
    note: 'Dokumen izin fishing tidak lengkap',
  },
  {
    id: 'LOG-005',
    timestamp: '2024-01-17T15:00:00',
    adminUser: 'Dewi Anggraini',
    adminRole: 'approver_admin',
    actionType: 'refund_completed',
    entityType: 'Refund',
    entityId: 'REF-2024-005',
    afterValue: 'Rp 250.000',
    note: 'Transfer completed - TRF-20240117-002',
  },
  {
    id: 'LOG-006',
    timestamp: '2024-01-14T11:00:00',
    adminUser: 'Rudi Hartono',
    adminRole: 'super_admin',
    actionType: 'ticket_rejected',
    entityType: 'Ticket',
    entityId: 'RA-2024-007',
    beforeValue: 'menunggu',
    afterValue: 'ditolak',
    note: 'Dokumen tidak valid, kapal tidak terdaftar',
  },
  {
    id: 'LOG-007',
    timestamp: '2024-01-10T09:00:00',
    adminUser: 'Dewi Anggraini',
    adminRole: 'approver_admin',
    actionType: 'ticket_approved',
    entityType: 'Ticket',
    entityId: 'RA-2024-006',
    beforeValue: 'menunggu',
    afterValue: 'disetujui',
    note: 'Research permit verified',
  },
  {
    id: 'LOG-008',
    timestamp: '2024-01-05T14:30:00',
    adminUser: 'Rudi Hartono',
    adminRole: 'super_admin',
    actionType: 'user_disabled',
    entityType: 'User',
    entityId: 'ADM-005',
    beforeValue: 'active',
    afterValue: 'disabled',
    note: 'Account suspended pending review',
  },
];

// Dummy Invoices
export const dummyInvoices: Invoice[] = [
  {
    id: 'INV-2024-001',
    ticketId: 'RA-2024-002',
    amount: 500000,
    method: 'bank_transfer',
    paidAt: '2024-01-16T14:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'belum_terealisasi',
    refundFlag: false,
  },
  {
    id: 'INV-2024-002',
    ticketId: 'RA-2024-003',
    amount: 4500000,
    method: 'credit_card',
    paidAt: '2024-01-16T20:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: true,
  },
  {
    id: 'INV-2024-003',
    ticketId: 'RA-2024-004',
    amount: 1000000,
    method: 'qris',
    paidAt: '2024-01-15T11:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },
  {
    id: 'INV-2024-004',
    ticketId: 'RA-2024-006',
    amount: 1000000,
    method: 'bank_transfer',
    paidAt: '2024-01-10T10:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },
  {
    id: 'INV-2024-005',
    ticketId: 'RA-2024-009',
    amount: 2000000,
    method: 'e_wallet',
    paidAt: '2024-01-18T12:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: true,
  },
  {
    id: 'INV-2024-006',
    ticketId: 'RA-2024-011',
    amount: 150000,
    method: 'qris',
    paidAt: '2024-01-12T10:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'sudah_terealisasi',
    refundFlag: false,
  },
  {
    id: 'INV-2024-007',
    ticketId: 'RA-2024-012',
    amount: 12000000,
    method: 'credit_card',
    paidAt: '2024-01-19T16:00:00',
    paymentStatus: 'sudah_bayar',
    realisasiStatus: 'belum_terealisasi',
    refundFlag: false,
  },
];

// Finance Report Summary
export const financeReportSummary = {
  period: 'Januari 2024',
  totalPaid: 21150000,
  totalRealized: 8650000,
  totalUnrealized: 12500000,
  totalRefunds: 750000,
  netRealized: 7900000,
  breakdown: {
    byCategory: [
      { category: 'Wisatawan Domestik (PBD)', amount: 300000, count: 2 },
      { category: 'Wisatawan Domestik (Tanah Papua)', amount: 2000000, count: 1 },
      { category: 'Wisatawan Domestik (Luar Papua)', amount: 5000000, count: 2 },
      { category: 'Wisatawan Mancanegara', amount: 13000000, count: 2 },
      { category: 'Peneliti Mancanegara', amount: 1000000, count: 1 },
    ],
    byDomisili: [
      { domisili: 'Papua Barat Daya', amount: 300000 },
      { domisili: 'Tanah Papua', amount: 2000000 },
      { domisili: 'Luar Papua', amount: 5000000 },
      { domisili: 'Mancanegara', amount: 14000000 },
    ],
  },
  dailyTrend: [
    { date: '2024-01-12', total: 150000, realized: 150000 },
    { date: '2024-01-15', total: 1000000, realized: 1000000 },
    { date: '2024-01-16', total: 5000000, realized: 4500000 },
    { date: '2024-01-18', total: 2000000, realized: 2000000 },
    { date: '2024-01-19', total: 12000000, realized: 0 },
  ],
};

// Helper function to format currency
export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
