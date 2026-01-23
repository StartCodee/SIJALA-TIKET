import React from "react";
const _jsxFileName = "src\\components\\StatusChip.tsx";import { cn } from '@/lib/utils';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  CreditCard, 
  RefreshCw,




  CircleDot
} from 'lucide-react';


















const variantStyles = {
  pending: 'status-chip-pending',
  approved: 'status-chip-approved',
  rejected: 'status-chip-rejected',
  revision: 'status-chip-revision',
  info: 'status-chip-info',
  warning: 'status-chip-pending',
  success: 'status-chip-approved',
};

const variantIcons = {
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
}) {
  const Icon = variantIcons[variant];
  
  return (
    React.createElement('span', { 
      className: cn(
        'status-chip',
        variantStyles[variant],
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        className
      ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}

      , showIcon && React.createElement(Icon, { className: cn('w-3 h-3', size === 'sm' && 'w-2.5 h-2.5'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}} )
      , label
    )
  );
}

// Approval Status Chip
export function ApprovalStatusChip({ status }) {
  const config = {
    menunggu: { variant: 'pending', label: 'Menunggu' },
    disetujui: { variant: 'approved', label: 'Disetujui' },
    ditolak: { variant: 'rejected', label: 'Ditolak' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return React.createElement(StatusChip, { variant: variant, label: label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}} );
}

// Payment Status Chip
export function PaymentStatusChip({ status }) {
  const config = {
    belum_bayar: { variant: 'pending', label: 'Belum Bayar', icon: CreditCard },
    sudah_bayar: { variant: 'approved', label: 'Sudah Bayar', icon: CheckCircle },
    refund_diproses: { variant: 'revision', label: 'Pengembalian Diproses', icon: RefreshCw },
    refund_selesai: { variant: 'info', label: 'Pengembalian Selesai', icon: CheckCircle },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return React.createElement(StatusChip, { variant: variant, label: label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} );
}

// Gate Status Chip
export function GateStatusChip({ status }) {
  const config = {
    belum_masuk: { variant: 'pending', label: 'Belum Masuk' },
    masuk: { variant: 'approved', label: 'Masuk' },
    keluar: { variant: 'info', label: 'Keluar' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return React.createElement(StatusChip, { variant: variant, label: label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}} );
}

// Realisasi Status Chip
export function RealisasiStatusChip({ status }) {
  const config = {
    belum_terealisasi: { variant: 'pending', label: 'Belum Terealisasi' },
    sudah_terealisasi: { variant: 'approved', label: 'Sudah Terealisasi' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return React.createElement(StatusChip, { variant: variant, label: label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}} );
}

// Refund Status Chip
export function RefundStatusChip({ status }) {
  const config = {
    requested: { variant: 'pending', label: 'Diajukan' },
    processing: { variant: 'revision', label: 'Diproses' },
    completed: { variant: 'approved', label: 'Selesai' },
    rejected: { variant: 'rejected', label: 'Ditolak' },
    cancelled: { variant: 'info', label: 'Dibatalkan' },
  };
  
  const { variant, label } = config[status] || { variant: 'info', label: status };
  return React.createElement(StatusChip, { variant: variant, label: label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}} );
}

// User Status Chip
export function UserStatusChip({ status }) {
  const config = {
    active: { variant: 'approved' , label: 'Aktif' },
    disabled: { variant: 'rejected' , label: 'Nonaktif' },
  };
  
  const { variant, label } = config[status];
  return React.createElement(StatusChip, { variant: variant, label: label, __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}} );
}

// Role Badge
export function RoleBadge({ role }) {
  const config = {
    admin: { variant: 'rejected', label: 'Admin' },
    operator_keuangan: { variant: 'approved', label: 'Operator Keuangan' },
    operator_persetujuan: { variant: 'revision', label: 'Operator Persetujuan' },
  };
  
  const { variant, label } = config[role] || { variant: 'info', label: role };
  return React.createElement(StatusChip, { variant: variant, label: label, showIcon: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}} );
}
