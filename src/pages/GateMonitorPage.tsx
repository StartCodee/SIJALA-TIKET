import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { GateStatusChip, PaymentStatusChip } from '@/components/StatusChip';
import {
  dummyTickets,
  formatRupiah,
  formatDateTime,
  FEE_PRICING,
} from '@/data/dummyData';
import {
  Search,
  DoorOpen,
  DoorClosed,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function GateMonitorPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by gate status
  const belumMasuk = dummyTickets.filter(
    (t) => t.gateStatus === 'belum_masuk' && t.paymentStatus === 'sudah_bayar'
  );
  const masuk = dummyTickets.filter((t) => t.gateStatus === 'masuk');
  const keluar = dummyTickets.filter((t) => t.gateStatus === 'keluar');

  // Calculate duration for "masuk" tickets
  const calculateDuration = (enteredAt: string) => {
    const entered = new Date(enteredAt);
    const now = new Date();
    const diffMs = now.getTime() - entered.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}j ${diffMinutes}m`;
  };

  const filterTickets = (tickets: typeof dummyTickets) => {
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Gate Monitor"
        subtitle="Pantau status gate masuk/keluar pengunjung"
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="card-ocean p-4 border-l-4 border-l-status-pending">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{belumMasuk.length}</p>
                <p className="text-sm text-muted-foreground">Belum Masuk</p>
                <p className="text-xs text-muted-foreground mt-1">Tiket paid, menunggu scan</p>
              </div>
              <Clock className="w-10 h-10 text-status-pending/30" />
            </div>
          </Card>
          <Card className="card-ocean p-4 border-l-4 border-l-status-approved">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-status-approved">{masuk.length}</p>
                <p className="text-sm text-muted-foreground">Sedang di Area</p>
                <p className="text-xs text-muted-foreground mt-1">Aktif di dalam kawasan</p>
              </div>
              <DoorOpen className="w-10 h-10 text-status-approved/30" />
            </div>
          </Card>
          <Card className="card-ocean p-4 border-l-4 border-l-status-info">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{keluar.length}</p>
                <p className="text-sm text-muted-foreground">Sudah Keluar</p>
                <p className="text-xs text-muted-foreground mt-1">Hari ini</p>
              </div>
              <DoorClosed className="w-10 h-10 text-status-info/30" />
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari Ticket ID atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="masuk" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="belum_masuk" className="gap-2">
              <Clock className="w-4 h-4" />
              Belum Masuk ({belumMasuk.length})
            </TabsTrigger>
            <TabsTrigger value="masuk" className="gap-2">
              <DoorOpen className="w-4 h-4" />
              Masuk ({masuk.length})
            </TabsTrigger>
            <TabsTrigger value="keluar" className="gap-2">
              <DoorClosed className="w-4 h-4" />
              Keluar ({keluar.length})
            </TabsTrigger>
          </TabsList>

          {/* Belum Masuk Tab */}
          <TabsContent value="belum_masuk">
            <Card className="card-ocean overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Nama</th>
                      <th>Kategori</th>
                      <th>Payment</th>
                      <th>Paid At</th>
                      <th>QR Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTickets(belumMasuk).map((ticket) => (
                      <tr key={ticket.id}>
                        <td>
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="font-mono text-sm font-medium text-primary hover:underline"
                          >
                            {ticket.id}
                          </Link>
                        </td>
                        <td className="text-sm">{ticket.namaLengkap}</td>
                        <td className="text-sm">{FEE_PRICING[ticket.feeCategory].label}</td>
                        <td>
                          <PaymentStatusChip status={ticket.paymentStatus} />
                        </td>
                        <td className="text-sm text-muted-foreground">
                          {ticket.paidAt && formatDateTime(ticket.paidAt)}
                        </td>
                        <td>
                          <Badge variant={ticket.qrActive ? 'default' : 'secondary'}>
                            {ticket.qrActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Masuk Tab */}
          <TabsContent value="masuk">
            <Card className="card-ocean overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Nama</th>
                      <th>Kategori</th>
                      <th>Entered At</th>
                      <th>Durasi di Area</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTickets(masuk).map((ticket) => (
                      <tr key={ticket.id}>
                        <td>
                          <Link
                            to={`/tickets/${ticket.id}`}
                            className="font-mono text-sm font-medium text-primary hover:underline"
                          >
                            {ticket.id}
                          </Link>
                        </td>
                        <td className="text-sm">{ticket.namaLengkap}</td>
                        <td className="text-sm">{FEE_PRICING[ticket.feeCategory].label}</td>
                        <td className="text-sm text-muted-foreground">
                          {ticket.enteredAt && formatDateTime(ticket.enteredAt)}
                        </td>
                        <td>
                          <Badge variant="outline" className="font-mono">
                            {ticket.enteredAt && calculateDuration(ticket.enteredAt)}
                          </Badge>
                        </td>
                        <td>
                          <GateStatusChip status={ticket.gateStatus} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Keluar Tab */}
          <TabsContent value="keluar">
            <Card className="card-ocean overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Nama</th>
                      <th>Kategori</th>
                      <th>Entered At</th>
                      <th>Exited At</th>
                      <th>Total Durasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterTickets(keluar).map((ticket) => {
                      let duration = '-';
                      if (ticket.enteredAt && ticket.exitedAt) {
                        const entered = new Date(ticket.enteredAt);
                        const exited = new Date(ticket.exitedAt);
                        const diffMs = exited.getTime() - entered.getTime();
                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                        duration = `${diffHours}j ${diffMinutes}m`;
                      }
                      return (
                        <tr key={ticket.id}>
                          <td>
                            <Link
                              to={`/tickets/${ticket.id}`}
                              className="font-mono text-sm font-medium text-primary hover:underline"
                            >
                              {ticket.id}
                            </Link>
                          </td>
                          <td className="text-sm">{ticket.namaLengkap}</td>
                          <td className="text-sm">{FEE_PRICING[ticket.feeCategory].label}</td>
                          <td className="text-sm text-muted-foreground">
                            {ticket.enteredAt && formatDateTime(ticket.enteredAt)}
                          </td>
                          <td className="text-sm text-muted-foreground">
                            {ticket.exitedAt && formatDateTime(ticket.exitedAt)}
                          </td>
                          <td>
                            <Badge variant="outline" className="font-mono">
                              {duration}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
