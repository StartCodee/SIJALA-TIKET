import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { KPICard } from '@/components/KPICard';
import {
  financeReportSummary,
  formatRupiah,
  DOMISILI_LABELS,
} from '@/data/dummyData';
import {
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  RotateCcw,
  Settings,
  FileText,
  Printer,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  Legend,
} from 'recharts';

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

export default function FinanceReportsPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [realisasiRule, setRealisasiRule] = useState<'masuk' | 'bayar' | 'days'>('masuk');
  const [realisasiDays, setRealisasiDays] = useState(3);

  const { 
    period, 
    totalPaid, 
    totalRealized, 
    totalUnrealized, 
    totalRefunds, 
    netRealized,
    breakdown,
    dailyTrend
  } = financeReportSummary;

  // Chart data
  const trendData = dailyTrend.map(d => ({
    date: new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    total: d.total / 1000000,
    realized: d.realized / 1000000,
    unrealized: (d.total - d.realized) / 1000000,
  }));

  const categoryData = breakdown.byCategory.map((c, i) => ({
    name: c.category.replace('Wisatawan ', '').replace('Domestik ', ''),
    amount: c.amount / 1000000,
    count: c.count,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <AdminLayout>
      <AdminHeader
        title="Laporan Keuangan"
        subtitle={`Laporan Keuangan - ${period}`}
        showSearch={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              {period}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4" />
              Pengaturan Laporan
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Ekspor CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="w-4 h-4" />
              Ekspor PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" />
              Cetak
            </Button>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <KPICard
            title="Total Terbayar"
            value={formatRupiah(totalPaid)}
            icon={Wallet}
            variant="brand"
          />
          <KPICard
            title="Total Terealisasi"
            value={formatRupiah(totalRealized)}
            icon={TrendingUp}
            variant="brand"
          />
          <KPICard
            title="Total Belum Terealisasi"
            value={formatRupiah(totalUnrealized)}
            icon={TrendingDown}
            variant="brand"
          />
          <KPICard
            title="Total Pengembalian"
            value={formatRupiah(totalRefunds)}
            icon={RotateCcw}
            variant="brand"
          />
          <KPICard
            title="Bersih Terealisasi"
            value={formatRupiah(netRealized)}
            icon={TrendingUp}
            variant="brand"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Chart */}
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Tren Harian: Terbayar vs Terealisasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorTotal2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.total} stopOpacity={0.35} />
                        <stop offset="95%" stopColor={CHART_COLORS.total} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRealized2" x1="0" y1="0" x2="0" y2="1">
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
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={CHART_COLORS.total}
                      strokeWidth={2}
                      fill="url(#colorTotal2)"
                      name="Total Terbayar"
                    />
                    <Area
                      type="monotone"
                      dataKey="realized"
                      stroke={CHART_COLORS.realized}
                      strokeWidth={2}
                      fill="url(#colorRealized2)"
                      name="Terealisasi"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Rincian per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                      tickFormatter={(v) => `${v}jt`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number, name, props) => [
                        `${formatRupiah(value * 1000000)} (${props.payload.count} tiket)`,
                        '',
                      ]}
                    />
                    <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Category */}
          <Card className="card-ocean">
            <CardHeader>
            <CardTitle className="text-base font-semibold">Detail per Kategori Biaya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breakdown.byCategory.map((item, i) => (
                  <div key={item.category} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[i % COLORS.length] }} 
                      />
                      <div>
                        <p className="text-sm font-medium">{item.category}</p>
                        <p className="text-xs text-muted-foreground">{item.count} tiket</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{formatRupiah(item.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By Domisili */}
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Detail per Domisili</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breakdown.byDomisili.map((item, i) => (
                  <div key={item.domisili} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[i % COLORS.length] }} 
                      />
                      <p className="text-sm font-medium">{item.domisili}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatRupiah(item.amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Pengaturan Laporan</DialogTitle>
            <DialogDescription>Konfigurasi aturan realisasi pendapatan</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="text-sm font-semibold mb-3 block">Aturan Realisasi</Label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="realisasi"
                    checked={realisasiRule === 'masuk'}
                    onChange={() => setRealisasiRule('masuk')}
                    className="accent-primary"
                  />
                  <div>
                    <p className="text-sm font-medium">Saat Gerbang = Masuk</p>
                    <p className="text-xs text-muted-foreground">Pendapatan terealisasi ketika pengunjung memindai di gerbang masuk</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="realisasi"
                    checked={realisasiRule === 'bayar'}
                    onChange={() => setRealisasiRule('bayar')}
                    className="accent-primary"
                  />
                  <div>
                    <p className="text-sm font-medium">Saat Sudah Bayar</p>
                    <p className="text-xs text-muted-foreground">Pendapatan langsung terealisasi setelah pembayaran</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="realisasi"
                    checked={realisasiRule === 'days'}
                    onChange={() => setRealisasiRule('days')}
                    className="accent-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Setelah X Hari dari Pembayaran</p>
                    <p className="text-xs text-muted-foreground">Pendapatan terealisasi setelah periode tunggu</p>
                  </div>
                </label>
                {realisasiRule === 'days' && (
                  <div className="pl-8">
                    <Label className="text-xs text-muted-foreground">Jumlah hari</Label>
                    <Input
                      type="number"
                      value={realisasiDays}
                      onChange={(e) => setRealisasiDays(parseInt(e.target.value))}
                      className="w-24 mt-1"
                      min={1}
                      max={30}
                    />
                  </div>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Pengaturan Lain</Label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Batas Waktu</p>
                  <p className="text-xs text-muted-foreground">Waktu penutupan laporan harian</p>
                </div>
                <Select defaultValue="23:59">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="17:00">17:00</SelectItem>
                    <SelectItem value="23:59">23:59</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Zona Waktu</p>
                  <p className="text-xs text-muted-foreground">Zona waktu laporan</p>
                </div>
                <Select defaultValue="WIT">
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="WIB">WIB</SelectItem>
                    <SelectItem value="WITA">WITA</SelectItem>
                    <SelectItem value="WIT">WIT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Batal
            </Button>
            <Button className="btn-ocean" onClick={() => setShowSettings(false)}>
              Simpan Pengaturan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
