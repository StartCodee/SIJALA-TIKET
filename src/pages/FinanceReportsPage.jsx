import React from "react";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { KPICard } from "@/components/KPICard";
import {
  financeReportSummary,
  formatRupiah,
  formatNominal,
  dummyRefunds,
  getTicketById,
  FEE_PRICING,
} from "@/data/dummyData";
import { Download, TrendingUp, TrendingDown, Wallet, RotateCcw, Settings, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  Legend,
} from "recharts";
const COLORS = [
  "hsl(213 70% 35%)",
  "hsl(213 65% 45%)",
  "hsl(213 60% 55%)",
  "hsl(213 60% 65%)",
  "hsl(213 70% 75%)",
];
const CHART_COLORS = {
  saldo: "hsl(var(--primary))",
  potensi: "hsl(213 70% 52%)",
  refund: "hsl(6 80% 55%)",
};

export default function FinanceReportsPage() {
  const defaultDateFrom = "2026-01-01";
  const defaultDateTo = "2027-01-02";
  const [showSettings, setShowSettings] = useState(false);
  const [realisasiRule, setRealisasiRule] = useState("masuk");
  const [realisasiDays, setRealisasiDays] = useState(3);
  const [reportDateFrom, setReportDateFrom] = useState(defaultDateFrom);
  const [reportDateTo, setReportDateTo] = useState(defaultDateTo);
  const {
    totalPaid,
    totalRealized,
    totalUnrealized,
    totalRefunds,
    breakdown,
    dailyTrend,
  } = financeReportSummary;
  const totalSaldoPemasukan = totalPaid;
  const reportSubtitle = (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span>Periode Waktu</span>
      <Input
        type="date"
        value={reportDateFrom}
        onChange={(event) => {
          const value = event.target.value;
          setReportDateFrom(value);
          if (reportDateTo && value && reportDateTo < value) {
            setReportDateTo(value);
          }
        }}
        max={reportDateTo || undefined}
        className="h-7 w-[136px] shrink-0 bg-transparent py-0 pr-8 text-xs"
        aria-label="Tanggal mulai laporan"
      />
      <span>s/d</span>
      <Input
        type="date"
        value={reportDateTo}
        onChange={(event) => setReportDateTo(event.target.value)}
        min={reportDateFrom || undefined}
        className="h-7 w-[148px] shrink-0 bg-transparent py-0 pr-8 text-xs"
        aria-label="Tanggal akhir laporan"
      />
    </span>
  );

  // Chart data
  const trendData = useMemo(() => {
    const from = reportDateFrom ? new Date(`${reportDateFrom}T00:00:00`) : null;
    const to = reportDateTo ? new Date(`${reportDateTo}T23:59:59`) : null;

    return dailyTrend
      .filter((item) => {
        const current = new Date(`${item.date}T00:00:00`);
        if (Number.isNaN(current.getTime())) return false;
        if (from && current < from) return false;
        if (to && current > to) return false;
        return true;
      })
      .map((d) => ({
        date: new Date(d.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        }),
        saldo: d.total / 1000000,
        potensi: d.realized / 1000000,
        refund: (d.refunds || 0) / 1000000,
      }));
  }, [dailyTrend, reportDateFrom, reportDateTo]);

  const refundBreakdown = useMemo(() => {
    const completedRefunds = dummyRefunds.filter((refund) => refund.status === "completed");
    const byCategoryMap = new Map();
    const byCountryMap = new Map();

    completedRefunds.forEach((refund) => {
      const ticket = getTicketById(refund.ticketId);
      const refundAmount = Number(refund.refundAmount) || 0;

      const categoryLabel = ticket
        ? FEE_PRICING[ticket.feeCategory]?.label || ticket.feeCategory
        : "Tidak diketahui";
      const countryLabel = ticket?.countryOCR || "Tidak diketahui";

      byCategoryMap.set(categoryLabel, (byCategoryMap.get(categoryLabel) || 0) + refundAmount);
      byCountryMap.set(countryLabel, (byCountryMap.get(countryLabel) || 0) + refundAmount);
    });

    const byCategory = Array.from(byCategoryMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
    const byCountry = Array.from(byCountryMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
    const totalAmount = byCategory.reduce((acc, item) => acc + item.amount, 0);

    return { byCategory, byCountry, totalAmount };
  }, []);

  return (
    <AdminLayout>
      <AdminHeader
        title="Laporan Keuangan"
        subtitle={reportSubtitle}
        showSearch={false}
        showDateFilter={false}
        actions={
          <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:flex-wrap md:items-center md:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full justify-center md:w-auto"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4" />
              Pengaturan Laporan
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full justify-center md:w-auto"
            >
              <Download className="w-4 h-4" />
              Export XLS
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full justify-center md:w-auto"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full justify-center md:w-auto"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </Button>
          </div>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-4 mb-6 xl:grid-cols-4">
          <KPICard
            title="Total Saldo Pemasukan Rp."
            value={formatNominal(totalPaid)}
            icon={Wallet}
            variant="brand"
          />
          <KPICard
            title="Total Potensi Pemasukan Rp."
            value={formatNominal(totalRealized)}
            icon={TrendingUp}
            variant="brand"
          />
          <KPICard
            title="Total Belum Terealisasi Rp."
            value={formatNominal(totalUnrealized)}
            icon={TrendingDown}
            variant="brand"
          />
          <KPICard
            title="Total Pengembalian Dana Rp."
            value={formatNominal(totalRefunds)}
            icon={RotateCcw}
            variant="brand"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Tren Harian: Total Saldo Pemasukan, Total Potensi Pemasukan, dan
                Total Pengembalian Dana
              </CardTitle>
            </CardHeader>
            <CardContent>
              {trendData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData}>
                      <defs>
                        <linearGradient
                          id="colorSaldo"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.saldo}
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.saldo}
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPotensi"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.potensi}
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.potensi}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{
                          fontSize: 11,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={{
                          stroke: "hsl(var(--border))",
                        }}
                      />
                      <YAxis
                        yAxisId="left"
                        tick={{
                          fontSize: 11,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={{
                          stroke: "hsl(var(--border))",
                        }}
                        tickFormatter={(v) => `${v}jt`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{
                          fontSize: 11,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                        axisLine={{
                          stroke: "hsl(var(--border))",
                        }}
                        tickFormatter={(v) => `${v}jt`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value, name) => [
                          formatRupiah(value * 1000000),
                          name,
                        ]}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="saldo"
                        stroke={CHART_COLORS.saldo}
                        strokeWidth={2}
                        fill="url(#colorSaldo)"
                        name="Total Saldo Pemasukan"
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="potensi"
                        stroke={CHART_COLORS.potensi}
                        strokeWidth={2}
                        fill="url(#colorPotensi)"
                        name="Total Potensi Pemasukan"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="refund"
                        stroke={CHART_COLORS.refund}
                        strokeWidth={2}
                        dot={{
                          r: 3,
                        }}
                        name="Total Pengembalian Dana"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
                  Tidak ada data pada rentang tanggal ini.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Detail Pemasukan per Kategori Layanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breakdown.byCategory.map((item, i) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium">{item.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.count} tiket
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {formatRupiah(item.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {totalSaldoPemasukan
                          ? `${((item.amount / totalSaldoPemasukan) * 100).toFixed(1)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="text-sm font-semibold">Total Saldo Pemasukan</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatRupiah(totalSaldoPemasukan)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Detail Pemasukan per Negara
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {breakdown.byCountry.map((item, i) => (
                  <div
                    key={item.country}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                      <p className="text-sm font-medium">{item.country}</p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatRupiah(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="text-sm font-semibold">Total Saldo Pemasukan</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatRupiah(totalSaldoPemasukan)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Detail Pengembalian per Kategori Layanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {refundBreakdown.byCategory.length > 0 ? (
                <div className="space-y-3">
                  {refundBreakdown.byCategory.map((item, i) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                        <p className="text-sm font-medium">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{formatRupiah(item.amount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {refundBreakdown.totalAmount
                            ? `${((item.amount / refundBreakdown.totalAmount) * 100).toFixed(1)}%`
                            : "0%"}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <p className="text-sm font-semibold">Total Pengembalian Dana</p>
                    <p className="text-sm font-semibold text-primary">
                      {formatRupiah(refundBreakdown.totalAmount)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada data pengembalian.</p>
              )}
            </CardContent>
          </Card>
          <Card className="card-ocean">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Detail Pengembalian per Kategori Negara
              </CardTitle>
            </CardHeader>
            <CardContent>
              {refundBreakdown.byCountry.length > 0 ? (
                <div className="space-y-3">
                  {refundBreakdown.byCountry.map((item, i) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[i % COLORS.length],
                          }}
                        />
                        <p className="text-sm font-medium">{item.name}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatRupiah(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <p className="text-sm font-semibold">Total Pengembalian Dana</p>
                    <p className="text-sm font-semibold text-primary">
                      {formatRupiah(refundBreakdown.totalAmount)}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada data pengembalian.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Pengaturan Laporan</DialogTitle>
            <DialogDescription>
              Konfigurasi aturan realisasi pendapatan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label className="text-sm font-semibold mb-3 block">
                Aturan Realisasi
              </Label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="realisasi"
                    checked={realisasiRule === "bayar"}
                    onChange={() => setRealisasiRule("bayar")}
                    className="accent-primary"
                  />
                  <div>
                    <p className="text-sm font-medium">Saat Sudah Bayar</p>
                    <p className="text-xs text-muted-foreground">
                      Pendapatan langsung terealisasi setelah pembayaran
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="realisasi"
                    checked={realisasiRule === "days"}
                    onChange={() => setRealisasiRule("days")}
                    className="accent-primary"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Setelah X Hari dari Pembayaran
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pendapatan terealisasi setelah periode tunggu
                    </p>
                  </div>
                </label>
                {realisasiRule === "days" && (
                  <div className="pl-8">
                    <Label className="text-xs text-muted-foreground">
                      Jumlah hari
                    </Label>
                    <Input
                      type="number"
                      value={realisasiDays}
                      onChange={(e) =>
                        setRealisasiDays(parseInt(e.target.value))
                      }
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
                  <p className="text-xs text-muted-foreground">
                    Waktu penutupan laporan harian
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    Zona waktu laporan
                  </p>
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
            <Button
              className="btn-ocean"
              onClick={() => setShowSettings(false)}
            >
              Simpan Pengaturan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
