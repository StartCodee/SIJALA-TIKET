import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { RefundStatusChip, StatusChip } from '@/components/StatusChip';
import {
  dummyRefunds,
  formatRupiah,
  formatDateTime,
  type Refund,
} from '@/data/dummyData';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  FileText,
  Upload,
  ChevronDown,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function RefundCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  // Filter refunds
  const filteredRefunds = dummyRefunds.filter((refund) => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.ticketName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    requested: dummyRefunds.filter((r) => r.status === 'requested').length,
    processing: dummyRefunds.filter((r) => r.status === 'processing').length,
    completed: dummyRefunds.filter((r) => r.status === 'completed').length,
    totalRefunded: dummyRefunds
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.refundAmount, 0),
  };

  const openDetail = (refund: Refund) => {
    setSelectedRefund(refund);
    setShowDetailDialog(true);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Refund Center"
        subtitle="Kelola permintaan refund tiket"
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-pending-bg">
                <Clock className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.requested}</p>
                <p className="text-xs text-muted-foreground">Requested</p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-revision-bg">
                <RefreshCw className="w-5 h-5 text-status-revision" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.processing}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-status-approved-bg">
                <CheckCircle className="w-5 h-5 text-status-approved" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">{formatRupiah(stats.totalRefunded)}</p>
                <p className="text-xs text-muted-foreground">Total Refunded</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari Refund ID, Ticket ID, atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Refund Table */}
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Refund ID</th>
                  <th>Ticket ID</th>
                  <th>Nama</th>
                  <th className="text-right">Original</th>
                  <th className="text-right">Refund Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Processed By</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id}>
                    <td>
                      <button
                        onClick={() => openDetail(refund)}
                        className="font-mono text-sm font-medium text-primary hover:underline"
                      >
                        {refund.id}
                      </button>
                    </td>
                    <td>
                      <Link
                        to={`/tickets/${refund.ticketId}`}
                        className="font-mono text-sm text-muted-foreground hover:text-primary hover:underline"
                      >
                        {refund.ticketId}
                      </Link>
                    </td>
                    <td className="text-sm">{refund.ticketName}</td>
                    <td className="text-right text-sm">{formatRupiah(refund.originalAmount)}</td>
                    <td className="text-right">
                      <span className="text-sm font-medium">{formatRupiah(refund.refundAmount)}</span>
                    </td>
                    <td>
                      <Badge variant="outline" className="capitalize text-xs">
                        {refund.type}
                      </Badge>
                    </td>
                    <td>
                      <RefundStatusChip status={refund.status} />
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {formatDateTime(refund.requestedAt)}
                    </td>
                    <td className="text-sm">
                      {refund.processedBy || <span className="text-muted-foreground">-</span>}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openDetail(refund)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {(refund.status === 'requested' || refund.status === 'processing') && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border">
                              {refund.status === 'requested' && (
                                <>
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <RefreshCw className="w-4 h-4 text-status-revision" />
                                    Mark Processing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <XCircle className="w-4 h-4 text-status-rejected" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                              {refund.status === 'processing' && (
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <CheckCircle className="w-4 h-4 text-status-approved" />
                                  Complete Refund
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Refund Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-card border-border max-w-2xl">
          {selectedRefund && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">{selectedRefund.id}</span>
                  <RefundStatusChip status={selectedRefund.status} />
                </DialogTitle>
                <DialogDescription>Detail permintaan refund</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Ticket ID</p>
                  <p className="text-sm font-medium">{selectedRefund.ticketId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Nama</p>
                  <p className="text-sm font-medium">{selectedRefund.ticketName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Original Amount</p>
                  <p className="text-sm font-medium">{formatRupiah(selectedRefund.originalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Refund Amount</p>
                  <p className="text-lg font-bold text-primary">
                    {formatRupiah(selectedRefund.refundAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedRefund.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Requested At</p>
                  <p className="text-sm">{formatDateTime(selectedRefund.requestedAt)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Reason</p>
                  <p className="text-sm p-3 bg-muted/50 rounded-lg">{selectedRefund.reason}</p>
                </div>
                {selectedRefund.referenceNumber && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Reference Number</p>
                    <p className="text-sm font-mono">{selectedRefund.referenceNumber}</p>
                  </div>
                )}
                {selectedRefund.notes && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Internal Notes</p>
                    <p className="text-sm p-3 bg-muted/50 rounded-lg italic">{selectedRefund.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Form for Processing */}
              {selectedRefund.status === 'processing' && (
                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="text-sm font-semibold">Complete Refund</h4>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Reference Number</label>
                    <Input
                      placeholder="TRF-YYYYMMDD-XXX"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Upload Bukti Transfer</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer">
                      <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Click atau drag file</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Notes</label>
                    <Textarea
                      placeholder="Catatan internal..."
                      value={actionNotes}
                      onChange={(e) => setActionNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                  Tutup
                </Button>
                {selectedRefund.status === 'processing' && (
                  <Button className="bg-status-approved hover:bg-status-approved/90 text-white gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Complete Refund
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
