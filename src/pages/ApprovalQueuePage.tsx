import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { ApprovalStatusChip } from '@/components/StatusChip';
import {
  dummyTickets,
  formatRupiah,
  formatDateTime,
  FEE_PRICING,
  DOMISILI_LABELS,
} from '@/data/dummyData';
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  FileText,
  ZoomIn,
  Download,
  AlertTriangle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function ApprovalQueuePage() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revision'>('approve');

  // Only tickets that need approval
  const pendingTickets = dummyTickets.filter(
    (t) => t.needsApproval && (t.approvalStatus === 'menunggu' || t.approvalStatus === 'revisi')
  );

  const handleAction = (ticketId: string, action: 'approve' | 'reject' | 'revision') => {
    setSelectedTicket(ticketId);
    setActionType(action);
    setShowActionDialog(true);
  };

  const confirmAction = () => {
    // In real app, this would call API
    console.log(`Action: ${actionType} on ticket ${selectedTicket} with notes: ${actionNotes}`);
    setShowActionDialog(false);
    setActionNotes('');
    setSelectedTicket(null);
  };

  const actionConfig = {
    approve: {
      title: 'Setujui Tiket',
      description: 'Tiket akan disetujui dan pengunjung dapat melanjutkan ke pembayaran.',
      buttonLabel: 'Setujui',
      buttonClass: 'bg-status-approved hover:bg-status-approved/90 text-white',
      icon: CheckCircle,
    },
    reject: {
      title: 'Tolak Tiket',
      description: 'Tiket akan ditolak. Mohon berikan alasan penolakan.',
      buttonLabel: 'Tolak',
      buttonClass: 'bg-status-rejected hover:bg-status-rejected/90 text-white',
      icon: XCircle,
    },
    revision: {
      title: 'Minta Revisi',
      description: 'Pengunjung akan diminta untuk melengkapi atau memperbaiki dokumen.',
      buttonLabel: 'Minta Revisi',
      buttonClass: 'bg-status-revision hover:bg-status-revision/90 text-white',
      icon: RotateCcw,
    },
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Approval Queue"
        subtitle="Tiket yang membutuhkan persetujuan admin"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-pending animate-pulse" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {pendingTickets.filter((t) => t.approvalStatus === 'menunggu').length}
              </span>{' '}
              menunggu review
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-status-revision" />
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {pendingTickets.filter((t) => t.approvalStatus === 'revisi').length}
              </span>{' '}
              revisi pending
            </span>
          </div>
        </div>

        {pendingTickets.length === 0 ? (
          <Card className="card-ocean">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <CheckCircle className="w-16 h-16 text-status-approved/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">Semua Tiket Sudah Di-review</h3>
              <p className="text-sm text-muted-foreground">
                Tidak ada tiket yang membutuhkan persetujuan saat ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pendingTickets.map((ticket) => (
              <Card key={ticket.id} className="card-ocean overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* KTM Preview */}
                    <div className="w-[200px] bg-muted/30 border-r border-border p-4 flex flex-col items-center justify-center gap-3">
                      <div className="w-full aspect-[3/4] bg-muted rounded-lg overflow-hidden relative group">
                        <img
                          src={ticket.ktmUrl}
                          alt="KTM Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="secondary" className="h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">OCR Confidence</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            'mt-1',
                            ticket.ocrConfidence >= 90
                              ? 'border-status-approved text-status-approved'
                              : ticket.ocrConfidence >= 80
                              ? 'border-status-pending text-status-pending'
                              : 'border-status-rejected text-status-rejected'
                          )}
                        >
                          {ticket.ocrConfidence}%
                        </Badge>
                      </div>
                    </div>

                    {/* Ticket Info */}
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="font-mono text-lg font-semibold text-primary hover:underline"
                            >
                              {ticket.id}
                            </Link>
                            <ApprovalStatusChip status={ticket.approvalStatus} />
                            {ticket.needsApproval && (
                              <Badge variant="outline" className="text-[10px] border-status-revision text-status-revision">
                                Butuh Approval
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-medium text-foreground">{ticket.namaLengkap}</h3>
                          <p className="text-sm text-muted-foreground">{ticket.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">{formatRupiah(ticket.totalBiaya)}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Dibuat {formatDateTime(ticket.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-5">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Kategori</p>
                          <p className="text-sm font-medium">{FEE_PRICING[ticket.feeCategory].label}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Domisili OCR</p>
                          <p className="text-sm font-medium">{DOMISILI_LABELS[ticket.domisiliOCR]}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Tipe</p>
                          <p className="text-sm font-medium capitalize">{ticket.bookingType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">No. HP</p>
                          <p className="text-sm font-medium">{ticket.noHP}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <Button
                          onClick={() => handleAction(ticket.id, 'approve')}
                          className="gap-2 bg-status-approved hover:bg-status-approved/90 text-white"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Setujui
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAction(ticket.id, 'reject')}
                          className="gap-2 border-status-rejected text-status-rejected hover:bg-status-rejected-bg"
                        >
                          <XCircle className="w-4 h-4" />
                          Tolak
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAction(ticket.id, 'revision')}
                          className="gap-2 border-status-revision text-status-revision hover:bg-status-revision-bg"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Minta Revisi
                        </Button>
                        <div className="flex-1" />
                        <Link to={`/tickets/${ticket.id}`}>
                          <Button variant="ghost" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Lihat Detail
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType && (() => {
                const IconComponent = actionConfig[actionType].icon;
                return (
                  <>
                    <IconComponent
                      className={cn(
                        'w-5 h-5',
                        actionType === 'approve' && 'text-status-approved',
                        actionType === 'reject' && 'text-status-rejected',
                        actionType === 'revision' && 'text-status-revision'
                      )}
                    />
                    {actionConfig[actionType].title}
                  </>
                );
              })()}
            </DialogTitle>
            <DialogDescription>{actionType && actionConfig[actionType].description}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Catatan Internal</label>
            <Textarea
              placeholder="Tambahkan catatan atau alasan..."
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionDialog(false)}>
              Batal
            </Button>
            <Button onClick={confirmAction} className={actionType && actionConfig[actionType].buttonClass}>
              {actionType && actionConfig[actionType].buttonLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
