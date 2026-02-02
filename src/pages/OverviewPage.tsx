import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { KPICard } from '@/components/KPICard';
import { 
  PaymentStatusChip, 
  GateStatusChip 
} from '@/components/StatusChip';
import { 
  dummyTickets, 
  dummyRefunds,
  financeReportSummary,
  formatRupiah,
  formatShortId,
  FEE_PRICING
} from '@/data/dummyData';
import {
  ClipboardCheck,
  CreditCard,
  Wallet,
  DoorOpen,
  DoorClosed,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

// Calculate KPIs from dummy data
const kpis = {
  pendingApproval: dummyTickets.filter(t => t.approvalStatus === 'menunggu').length,
  unpaid: dummyTickets.filter(t => t.paymentStatus === 'belum_bayar').length,
  paid: dummyTickets.filter(t => t.paymentStatus === 'sudah_bayar').length,
  gateMasuk: dummyTickets.filter(t => t.gateStatus === 'masuk').length,
  gateKeluar: dummyTickets.filter(t => t.gateStatus === 'keluar').length,
  revenueUnrealized: financeReportSummary.totalUnrealized,
  revenueRealized: financeReportSummary.totalRealized,
  refundRequested: dummyRefunds.filter(r => r.status === 'requested').length,
  refundCompleted: dummyRefunds.filter(r => r.status === 'completed').length,
};

// Chart data
const trendData = financeReportSummary.dailyTrend.map(d => ({
  date: new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
  total: d.total / 1000000,
  realized: d.realized / 1000000,
}));

const categoryData = financeReportSummary.breakdown.byCategory.map(c => ({
  name: c.category.replace('Wisatawan ', '').replace('Domestik ', ''),
  value: c.amount / 1000000,
  count: c.count,
}));

const COLORS = [
  'hsl(213 70% 35%)',
  'hsl(213 65% 45%)',
  'hsl(213 60% 55%)',
  'hsl(213 60% 65%)',
  'hsl(213 70% 75%)',
];

const CHART_COLORS = {
  total: 'hsl(var(--primary))',
  realized: 'hsl(213 70% 52%)',
};

export default function OverviewPage() {
  const recentTickets = [...dummyTickets]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const pendingApprovalTickets = dummyTickets.filter(t => t.approvalStatus === 'menunggu');

  return (
    <AdminLayout>
      <AdminHeader 
        title="Ringkasan Dasbor" 
        subtitle="Pantau aktivitas dan performa sistem tiket"
      />
      
      <div className="flex-1 overflow-auto p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols- md:grid-cols-4 lg:grid-cols-3 gap-4 mb-6">
          <KPICard
            title="Menunggu Persetujuan"
            value={kpis.pendingApproval}
            icon={ClipboardCheck}
            variant="warning"
            subtitle="Menunggu tinjauan"
          />
          <KPICard
            title="Belum Bayar"
            value={kpis.unpaid}
            icon={CreditCard}
            variant="danger"
            subtitle="Tiket menunggu pembayaran"
          />
          <KPICard
            title="Sudah Bayar"
            value={kpis.paid}
            icon={Wallet}
            variant="success"
            trend={{ value: 12, label: 'vs minggu lalu' }}
          />
          {/* <KPICard
            title="Gerbang Masuk"
            value={kpis.gateMasuk}
            icon={DoorOpen}
            variant="primary"
            subtitle="Saat ini di area"
          />
          <KPICard
            title="Gerbang Keluar"
            value={kpis.gateKeluar}
            icon={DoorClosed}
            variant="default"
          /> */}
        </div>

        {/* Revenue KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Pendapatan Belum Terealisasi"
            value={formatRupiah(kpis.revenueUnrealized)}
            icon={TrendingDown}
            variant="warning"
            subtitle="Belum masuk gerbang"
          />
          <KPICard
            title="Pendapatan Terealisasi"
            value={formatRupiah(kpis.revenueRealized)}
            icon={TrendingUp}
            variant="success"
            trend={{ value: 8, label: 'vs bulan lalu' }}
          />
          <KPICard
            title="Pengembalian Diajukan"
            value={kpis.refundRequested}
            icon={RotateCcw}
            variant="warning"
            subtitle="Menunggu proses"
          />
          <KPICard
            title="Pengembalian Selesai"
            value={kpis.refundCompleted}
            icon={RotateCcw}
            variant="default"
            subtitle={formatRupiah(750000)}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Trend Chart */}
          <Card className="lg:col-span-2 card-ocean">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Tren Transaksi Harian</CardTitle>
                <span className="text-xs text-muted-foreground">Januari 2024</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.total} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={CHART_COLORS.total} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRealized" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.realized} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={CHART_COLORS.realized} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickFormatter={(v) => `${v}jt`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`Rp ${value}jt`, '']}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={CHART_COLORS.total}
                      strokeWidth={2}
                      fill="url(#colorTotal)"
                      name="Total"
                    />
                    <Area
                      type="monotone"
                      dataKey="realized"
                      stroke={CHART_COLORS.realized}
                      strokeWidth={2}
                      fill="url(#colorRealized)"
                      name="Terealisasi"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="card-ocean">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Rincian Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`Rp ${value}jt`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {categoryData.slice(0, 4).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }} 
                      />
                      <span className="text-muted-foreground truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <span className="font-medium">{formatRupiah(item.value * 1000000)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <Card className="card-ocean">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Tiket Terbaru</CardTitle>
                <Link to="/tickets">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary hover:text-primary">
                    Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-primary">
                          {formatShortId(ticket.id)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-sm text-foreground truncate">{ticket.namaLengkap}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {FEE_PRICING[ticket.feeCategory].label}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <PaymentStatusChip status={ticket.paymentStatus} />
                      <GateStatusChip status={ticket.gateStatus} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approval */}
          <Card className="card-ocean">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Menunggu Persetujuan
                  <span className="ml-2 px-2 py-0.5 bg-status-pending-bg text-status-pending text-xs font-medium rounded-full">
                    {pendingApprovalTickets.length}
                  </span>
                </CardTitle>
                <Link to="/approval">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 text-primary hover:text-primary">
                    Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingApprovalTickets.length > 0 ? (
                <div className="divide-y divide-border">
                  {pendingApprovalTickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-primary">
                            {formatShortId(ticket.id)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground truncate">{ticket.namaLengkap}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {FEE_PRICING[ticket.feeCategory].label}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{formatRupiah(ticket.totalBiaya)}</p>
                      </div>
                      <Link to={`/tickets/${ticket.id}`}>
                        <Button size="sm" className="btn-ocean text-xs">
                          Tinjau
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ClipboardCheck className="w-12 h-12 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">Tidak ada tiket menunggu persetujuan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
