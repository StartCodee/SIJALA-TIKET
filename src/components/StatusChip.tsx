import { cn } from '@/lib/utils';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  CreditCard, 
  RefreshCw, 
  DoorOpen, 
  DoorClosed,
  LogIn,
  LogOut,
  CircleDot
} from 'lucide-react';

type ChipVariant = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'revision' 
  | 'info'
  | 'warning'
  | 'success';

interface StatusChipProps {
  variant: ChipVariant;
  label: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  pending: 'status-chip-pending',
  approved: 'status-chip-approved',
  rejected: 'status-chip-rejected',
  revision: 'status-chip-revision',
  info: 'status-chip-info',
  warning: 'status-chip-pending',
  success: 'status-chip-approved',
};

const variantIcons: Record<ChipVariant, React.ElementType> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
  revision: AlertCircle,
  info: CircleDot,
  warning: AlertCircle,
  success: CheckCircle,
};

export function StatusChip({ 
  variant, 
  label, 
  showIcon = true, 
  size = 'md',
  className 
}: StatusChipProps) {
  const Icon = variantIcons[variant];
  
  return (
    <span 
      className={cn(
        'status-chip',
        variantStyles[variant],
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        className
      )}
    >
      {showIcon && <Icon className={cn('w-3 h-3', size === 'sm' && 'w-2.5 h-2.5')} />}
      {label}
    </span>
  );
}

// Approval Status Chip
export function ApprovalStatusChip({ status }: { status: string }) {
  const config: Record<string, { variant: ChipVariant; label: string }> = {
    menunggu: { variant: 'pending', label: 'Menunggu' },
    disetujui: { variant: 'approved', label: 'Disetujui' },
    ditolak: { variant: 'rejected', label: 'Ditolak' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return <StatusChip variant={variant} label={label} />;
}

// Payment Status Chip
export function PaymentStatusChip({ status }: { status: string }) {
  const config: Record<string, { variant: ChipVariant; label: string; icon?: React.ElementType }> = {
    belum_bayar: { variant: 'pending', label: 'Belum Bayar', icon: CreditCard },
    sudah_bayar: { variant: 'approved', label: 'Sudah Bayar', icon: CheckCircle },
    refund_diproses: { variant: 'revision', label: 'Pengembalian Diproses', icon: RefreshCw },
    refund_selesai: { variant: 'info', label: 'Pengembalian Selesai', icon: CheckCircle },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return <StatusChip variant={variant} label={label} />;
}

// Gate Status Chip
export function GateStatusChip({ status }: { status: string }) {
  const config: Record<string, { variant: ChipVariant; label: string }> = {
    belum_masuk: { variant: 'pending', label: 'Belum Masuk' },
    masuk: { variant: 'approved', label: 'Masuk' },
    keluar: { variant: 'info', label: 'Keluar' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return <StatusChip variant={variant} label={label} />;
}

// Realisasi Status Chip
export function RealisasiStatusChip({ status }: { status: string }) {
  const config: Record<string, { variant: ChipVariant; label: string }> = {
    belum_terealisasi: { variant: 'pending', label: 'Belum Terealisasi' },
    sudah_terealisasi: { variant: 'approved', label: 'Sudah Terealisasi' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return <StatusChip variant={variant} label={label} />;
}

// Refund Status Chip
export function RefundStatusChip({ status }: { status: string }) {
  const config: Record<string, { variant: ChipVariant; label: string }> = {
    requested: { variant: 'pending', label: 'Diajukan' },
    processing: { variant: 'revision', label: 'Diproses' },
    completed: { variant: 'approved', label: 'Selesai' },
    rejected: { variant: 'rejected', label: 'Ditolak' },
    cancelled: { variant: 'info', label: 'Dibatalkan' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return <StatusChip variant={variant} label={label} />;
}

// User Status Chip
export function UserStatusChip({ status }: { status: 'active' | 'disabled' }) {
  const config = {
    active: { variant: 'approved' as ChipVariant, label: 'Aktif' },
    disabled: { variant: 'rejected' as ChipVariant, label: 'Nonaktif' },
  };
  
  const { variant, label } = config[status];
  return <StatusChip variant={variant} label={label} />;
}

// Role Badge
export function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { variant: ChipVariant; label: string }> = {
    super_admin: { variant: 'rejected', label: 'Admin Utama' },
    finance_admin: { variant: 'approved', label: 'Admin Keuangan' },
    approver_admin: { variant: 'revision', label: 'Admin Persetujuan' },
    viewer: { variant: 'info', label: 'Peninjau' },
  };
  
  const { variant, label } = config[role] || { variant: 'info', label: role };
  return <StatusChip variant={variant} label={label} showIcon={false} />;
}
