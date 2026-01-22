import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { RoleBadge } from '@/components/StatusChip';
import { dummyAuditLogs, formatDateTime, formatShortId } from '@/data/dummyData';
import {
  Search,
  Download,
  History,
  User,
  Ticket,
  CreditCard,
  RotateCcw,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const entityIcons: Record<string, typeof Ticket> = {
  Ticket: Ticket,
  Payment: CreditCard,
  Refund: RotateCcw,
  User: User,
  Settings: Settings,
};

const entityLabels: Record<string, string> = {
  Ticket: 'Tiket',
  Payment: 'Pembayaran',
  Refund: 'Pengembalian Dana',
  User: 'Pengguna',
  Settings: 'Pengaturan',
};

const actionLabels: Record<string, string> = {
  ticket_created: 'Tiket dibuat',
  ticket_approved: 'Tiket disetujui',
  ticket_rejected: 'Tiket ditolak',
  payment_received: 'Pembayaran diterima',
  refund_requested: 'Pengembalian diajukan',
  refund_processing: 'Pengembalian diproses',
  refund_completed: 'Pengembalian selesai',
  user_disabled: 'Pengguna dinonaktifkan',
  user_enabled: 'Pengguna diaktifkan',
};

const valueLabels: Record<string, string> = {
  requested: 'diajukan',
  processing: 'diproses',
  completed: 'selesai',
  rejected: 'ditolak',
  cancelled: 'dibatalkan',
  active: 'aktif',
  disabled: 'nonaktif',
};

const formatLogValue = (value?: string) => (value ? valueLabels[value] ?? value : value);

const actionColors: Record<string, string> = {
  ticket_created: 'bg-status-info-bg text-status-info',
  ticket_approved: 'bg-status-approved-bg text-status-approved',
  ticket_rejected: 'bg-status-rejected-bg text-status-rejected',
  revision_requested: 'bg-status-revision-bg text-status-revision',
  payment_received: 'bg-status-approved-bg text-status-approved',
  refund_requested: 'bg-status-pending-bg text-status-pending',
  refund_processing: 'bg-status-revision-bg text-status-revision',
  refund_completed: 'bg-status-approved-bg text-status-approved',
  user_disabled: 'bg-status-rejected-bg text-status-rejected',
  user_enabled: 'bg-status-approved-bg text-status-approved',
};

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  // Get unique action types
  const actionTypes = [...new Set(dummyAuditLogs.map((log) => log.actionType))];

  // Filter logs
  const filteredLogs = dummyAuditLogs.filter((log) => {
    const matchesSearch =
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.note && log.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    const matchesAction = actionFilter === 'all' || log.actionType === actionFilter;
    return matchesSearch && matchesEntity && matchesAction;
  });

  // Sort by timestamp desc
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <AdminLayout>
      <AdminHeader
        title="Log Aktivitas"
        subtitle="Jejak audit semua aktivitas admin"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari ID, admin, atau catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[150px] bg-card">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua</SelectItem>
              <SelectItem value="Ticket">Tiket</SelectItem>
              <SelectItem value="Payment">Pembayaran</SelectItem>
              <SelectItem value="Refund">Pengembalian Dana</SelectItem>
              <SelectItem value="User">Pengguna</SelectItem>
              <SelectItem value="Settings">Pengaturan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Aksi" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua Aksi</SelectItem>
              {actionTypes.map((action) => (
                <SelectItem key={action} value={action}>
                  {actionLabels[action] ?? action.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Ekspor
          </Button>
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Menampilkan <span className="font-medium text-foreground">{sortedLogs.length}</span> log
          </p>
        </div>

        {/* Logs Timeline */}
        <Card className="card-ocean">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {sortedLogs.map((log) => {
                const IconComponent = entityIcons[log.entityType] || History;
                const actionColor = actionColors[log.actionType] || 'bg-muted text-muted-foreground';
                const displayEntityId = formatShortId(log.entityId);

                return (
                  <div key={log.id} className="flex gap-4 p-4 hover:bg-muted/30 transition-colors">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', actionColor)}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          {entityLabels[log.entityType] ?? log.entityType}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                          {actionLabels[log.actionType] ?? log.actionType.replace(/_/g, ' ')}
                        </span>
                        {log.entityId && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            {log.entityType === 'Ticket' ? (
                              <Link
                                to={`/tickets/${log.entityId}`}
                                className="font-mono text-sm text-primary hover:underline"
                              >
                                {displayEntityId}
                              </Link>
                            ) : (
                              <span className="font-mono text-sm text-muted-foreground">
                                {displayEntityId}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Value Change */}
                      {(log.beforeValue || log.afterValue) && (
                        <div className="flex items-center gap-2 text-sm mb-1">
                          {log.beforeValue && (
                            <span className="px-2 py-0.5 bg-status-rejected-bg text-status-rejected rounded text-xs">
                              {formatLogValue(log.beforeValue)}
                            </span>
                          )}
                          {log.beforeValue && log.afterValue && (
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                          {log.afterValue && (
                            <span className="px-2 py-0.5 bg-status-approved-bg text-status-approved rounded text-xs">
                              {formatLogValue(log.afterValue)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Note */}
                      {log.note && (
                        <p className="text-sm text-muted-foreground italic">"{log.note}"</p>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.adminUser}
                        </span>
                        <RoleBadge role={log.adminRole} />
                        <span>{formatDateTime(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
