import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { KPICard } from "@/components/KPICard";
import { PaymentStatusChip, GateStatusChip } from "@/components/StatusChip";
import {
  dummyTickets,
  dummyRefunds,
  financeReportSummary,
  formatRupiah,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
  GENDER_LABELS,
  OPERATOR_TYPE_LABELS,
} from "@/data/dummyData";
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
  Users,
  GripVertical,
  Check,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  ComposedChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// Calculate KPIs from dummy data
const kpis = {
  pendingApproval: dummyTickets.filter((t) => t.approvalStatus === "menunggu")
    .length,
  unpaid: dummyTickets.filter((t) => t.paymentStatus === "belum_bayar").length,
  paid: dummyTickets.filter((t) => t.paymentStatus === "sudah_bayar").length,
  gateMasuk: dummyTickets.filter((t) => t.gateStatus === "masuk").length,
  gateKeluar: dummyTickets.filter((t) => t.gateStatus === "keluar").length,
  revenueUnrealized: financeReportSummary.totalUnrealized,
  revenueRealized: financeReportSummary.totalRealized,
  refundRequested: dummyRefunds.filter((r) => r.status === "requested").length,
  refundCompleted: dummyRefunds.filter((r) => r.status === "completed").length,
};

// Chart data
const baseTrendData = financeReportSummary.dailyTrend.map((d) => ({
  date: new Date(d.date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  }),
  dateRaw: new Date(d.date),
  total: d.total / 1000000,
  realized: d.realized / 1000000,
}));
const PIE_COLORS = [
  "hsl(213 70% 35%)",
  "hsl(213 65% 45%)",
  "hsl(213 60% 55%)",
  "hsl(213 60% 65%)",
  "hsl(213 70% 75%)",
];
const CHART_COLORS = {
  total: "hsl(var(--primary))",
  realized: "hsl(213 70% 52%)",
  previous: "hsl(210 8% 70%)",
};
const trendFilterOptions = [
  {
    label: "Hari Ini",
    value: "today",
    days: 1,
  },
  {
    label: "Minggu Ini",
    value: "week",
    days: 7,
  },
  {
    label: "Bulan Ini",
    value: "month",
    days: 30,
  },
  {
    label: "Tahun Ini",
    value: "year",
    days: 365,
  },
  {
    label: "Kustom",
    value: "custom",
    days: 30,
  },
];
const defaultSummarySelection = [
  "payment_success",
  "payment_pending",
  "payment_failed",
  "visitor_active",
  "visitor_due",
  "failed_payment_amount",
  "refund_requested",
  "refund_success",
  "approval_wait",
  "visitor_registered",
  "revenue_in",
  "revenue_pending",
  "revenue_total",
  "approval_approved",
];
const defaultSummaryOrder = [
  "payment_success",
  "payment_pending",
  "payment_failed",
  "visitor_active",
  "visitor_due",
  "failed_payment_amount",
  "refund_requested",
  "refund_success",
  "approval_wait",
  "visitor_registered",
  "revenue_in",
  "revenue_pending",
  "revenue_total",
  "approval_approved",
];
export default function OverviewPage() {
  const isAdmin = true;
  const [summarySelection, setSummarySelection] = useState(
    defaultSummarySelection,
  );
  const [showSummaryConfig, setShowSummaryConfig] = useState(false);
  const [trendFilter, setTrendFilter] = useState("today");
  const recentTickets = [...dummyTickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);
  const pendingApprovalTickets = dummyTickets.filter(
    (t) => t.approvalStatus === "menunggu",
  );
  const maxTrendDate = baseTrendData.length
    ? new Date(Math.max(...baseTrendData.map((d) => d.dateRaw.getTime())))
    : new Date();
  const activeTrendFilter =
    trendFilterOptions.find((option) => option.value === trendFilter) ||
    trendFilterOptions[0];
  const trendStart = new Date(maxTrendDate);
  trendStart.setDate(trendStart.getDate() - (activeTrendFilter.days - 1));
  const trendData = baseTrendData
    .filter((item) => item.dateRaw >= trendStart)
    .map((item) => ({
      ...item,
      lastYearTotal: Number((item.total * 0.85).toFixed(2)),
      lastYearRealized: Number((item.realized * 0.85).toFixed(2)),
    }));
  const countryCounts = dummyTickets.reduce((acc, ticket) => {
    const key = ticket.countryOCR || "Tidak diketahui";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const countryTrendData = topCountries.map((item) => ({
    name: item.name,
    current: item.count,
    lastYear: Math.max(0, Math.round(item.count * 0.85)),
  }));
  const genderCounts = dummyTickets.reduce((acc, ticket) => {
    const key = ticket.genderOCR || "U";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const genderData = Object.keys(GENDER_LABELS).map((key) => ({
    name: GENDER_LABELS[key],
    value: genderCounts[key] || 0,
  }));
  const genderLastYearData = genderData.map((item) => ({
    ...item,
    value: Math.max(0, Math.round(item.value * 0.85)),
  }));
  const operatorCounts = dummyTickets.reduce((acc, ticket) => {
    const key = ticket.operatorType || "loket";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const operatorTrendData = Object.keys(OPERATOR_TYPE_LABELS).map((key) => ({
    name: OPERATOR_TYPE_LABELS[key],
    current: operatorCounts[key] || 0,
    lastYear: Math.max(0, Math.round((operatorCounts[key] || 0) * 0.85)),
  }));
  const bookingCounts = dummyTickets.reduce((acc, ticket) => {
    const key = ticket.bookingType || "perorangan";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const bookingTrendData = Object.keys(BOOKING_TYPE_LABELS).map((key) => ({
    name: BOOKING_TYPE_LABELS[key],
    current: bookingCounts[key] || 0,
    lastYear: Math.max(0, Math.round((bookingCounts[key] || 0) * 0.85)),
  }));
  const categoryData = financeReportSummary.breakdown.byCategory
    .map((item) => ({
      name: item.category.replace("Wisatawan ", "").replace("Domestik ", ""),
      value: item.amount,
    }))
    .filter((item) => item.value > 0);
  const summaryOptions = [
    {
      id: "payment_success",
      label: "Pembayaran Sukses",
    },
    {
      id: "payment_pending",
      label: "Pembayaran Pending",
    },
    {
      id: "payment_failed",
      label: "Pembayaran Gagal",
    },
    {
      id: "visitor_active",
      label: "Pengunjung aktif",
    },
    {
      id: "visitor_due",
      label: "Pengunjung jatuh tempo",
    },
    {
      id: "visitor_registered",
      label: "Pengunjung Terdaftar",
    },
    {
      id: "revenue_in",
      label: "Pendapatan masuk Rp.",
      adminOnly: true,
    },
    {
      id: "revenue_pending",
      label: "Pendapatan pending Rp.",
      adminOnly: true,
    },
    {
      id: "revenue_total",
      label: "Pendapatan total",
      adminOnly: true,
    },
    {
      id: "failed_payment_amount",
      label: "Gagal bayar Rp.",
      adminOnly: true,
    },
    {
      id: "refund_requested",
      label: "Pengembalian diajukan",
    },
    {
      id: "refund_success",
      label: "Pengembalian Sukses",
    },
    {
      id: "approval_wait",
      label: "Menunggu persetujuan",
    },
    {
      id: "approval_approved",
      label: "Persetujuan Disetujui",
    },
  ];
  const [summaryOrder, setSummaryOrder] = useState(defaultSummaryOrder);
  const isSelected = (id) => summarySelection.includes(id);
  const showSummary = (id) => {
    setSummarySelection((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const hideSummary = (id) => {
    setSummarySelection((prev) => prev.filter((item) => item !== id));
  };
  const handleDragStart = (event, id) => {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (event, targetId) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === targetId) return;
    setSummaryOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(draggedId);
      const to = next.indexOf(targetId);
      if (from === -1 || to === -1) return prev;
      next.splice(from, 1);
      next.splice(to, 0, draggedId);
      return next;
    });
  };
  const resetSummaryDefaults = () => {
    setSummarySelection([...defaultSummarySelection]);
    setSummaryOrder([...defaultSummaryOrder]);
  };
  const summaryKpis = [
    // Row 1
    {
      id: "payment_success",
      title: "Pembayaran Sukses",
      value: kpis.paid,
      icon: Wallet,
      variant: "success",
      trend: {
        value: 12,
        label: "vs minggu lalu",
      },
    },
    {
      id: "payment_pending",
      title: "Pembayaran Pending",
      value: kpis.unpaid,
      icon: CreditCard,
      variant: "danger",
      subtitle: "Tiket menunggu pembayaran",
    },
    {
      id: "payment_failed",
      title: "Pembayaran Gagal",
      value: dummyTickets.filter((t) => t.paymentStatus === "gagal").length,
      icon: CreditCard,
      variant: "danger",
      subtitle: "Transaksi gagal",
    },
    {
      id: "visitor_active",
      title: "Pengunjung Aktif",
      value: kpis.gateMasuk,
      icon: DoorOpen,
      variant: "primary",
      subtitle: "Saat ini di area",
    },
    {
      id: "visitor_due",
      title: "Pengunjung Jatuh Tempo",
      value: kpis.gateKeluar,
      icon: DoorClosed,
      variant: "default",
    },
    // Row 2
    {
      id: "failed_payment_amount",
      title: "Gagal Bayar Rp.",
      value: formatRupiah(0),
      icon: TrendingDown,
      variant: "danger",
      subtitle: "Nominal gagal bayar",
      adminOnly: true,
    },
    {
      id: "refund_requested",
      title: "Pengembalian diajukan",
      value: kpis.refundRequested,
      icon: RotateCcw,
      variant: "warning",
      subtitle: "Menunggu proses",
    },
    {
      id: "refund_success",
      title: "Pengembalian Sukses",
      value: kpis.refundCompleted,
      icon: RotateCcw,
      variant: "default",
      subtitle: formatRupiah(750000),
    },
    {
      id: "approval_wait",
      title: "Menunggu persetujuan",
      value: kpis.pendingApproval,
      icon: ClipboardCheck,
      variant: "warning",
      subtitle: "Menunggu tinjauan",
    },
    {
      id: "visitor_registered",
      title: "Pengunjung Terdaftar",
      value: dummyTickets.length,
      icon: Users,
      variant: "default",
    },
    // Row 3
    {
      id: "revenue_in",
      title: "Pendapatan Masuk Rp.",
      value: formatRupiah(kpis.revenueRealized),
      icon: TrendingUp,
      variant: "success",
      trend: {
        value: 8,
        label: "vs bulan lalu",
      },
      adminOnly: true,
    },
    {
      id: "revenue_pending",
      title: "Pendapatan Pending Rp.",
      value: formatRupiah(kpis.revenueUnrealized),
      icon: TrendingDown,
      variant: "warning",
      subtitle: "Belum masuk gerbang",
      adminOnly: true,
    },
    {
      id: "revenue_total",
      title: "Pendapatan Total",
      value: formatRupiah(kpis.revenueRealized + kpis.revenueUnrealized),
      icon: TrendingUp,
      variant: "brand",
      subtitle: "Akumulasi pendapatan",
      adminOnly: true,
    },
    {
      id: "approval_approved",
      title: "Persetujuan Disetujui",
      value: dummyTickets.filter((t) => t.approvalStatus === "disetujui")
        .length,
      icon: ClipboardCheck,
      variant: "success",
      subtitle: "Sudah disetujui",
    },
  ];
  const summaryKpiMap = summaryKpis.reduce((acc, kpi) => {
    acc[kpi.id] = kpi;
    return acc;
  }, {});
  const orderedKpis = summaryOrder
    .map((id) => summaryKpiMap[id])
    .filter(Boolean);
  const editableKpis = orderedKpis.filter((kpi) =>
    kpi.adminOnly ? isAdmin : true,
  );
  const visibleKpis = editableKpis.filter((kpi) => isSelected(kpi.id));
  const kpiRows = [];
  for (let i = 0; i < visibleKpis.length; i += 5) {
    kpiRows.push(visibleKpis.slice(i, i + 5));
  }
  return (
    <AdminLayout>
      <AdminHeader
        title="Ringkasan Dashboard"
        subtitle="Pantau aktivitas dan performa sistem tiket"
      />
      <div className="flex-1 overflow-auto p-6">
        <Card className="card-ocean mb-6">
          <CardHeader className="">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base font-semibold">
                Pengaturan Ringkasan
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  className={
                    showSummaryConfig
                      ? "h-8 text-xs bg-status-revision-bg text-status-revision hover:bg-status-revision-bg/80 border border-status-revision/30"
                      : "h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                  }
                  onClick={() => setShowSummaryConfig((prev) => !prev)}
                >
                  {showSummaryConfig ? "Tutup Ringkasan" : "Edit Ringkasan"}
                </Button>
                {showSummaryConfig && (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-status-pending-bg text-status-pending hover:bg-status-pending-bg/80 border border-status-pending/30"
                    onClick={resetSummaryDefaults}
                  >
                    Edit Default
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Cetak
                </Button>
              </div>
            </div>
          </CardHeader>
          {showSummaryConfig && (
            <CardContent className="pt-0">
              <p className="mb-3 text-xs text-muted-foreground">
                Geser kartu untuk ubah urutan.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {editableKpis.map((kpi, index) => {
                  const active = isSelected(kpi.id);
                  return (
                    <div
                      key={kpi.id}
                      draggable
                      onDragStart={(event) => handleDragStart(event, kpi.id)}
                      onDragOver={handleDragOver}
                      onDrop={(event) => handleDrop(event, kpi.id)}
                      className={`relative pt-[40px] rounded-2xl border border-border bg-card p-4 transition cursor-grab active:cursor-grabbing kpi-config-wiggle ${active ? "shadow-sm" : "opacity-60 grayscale"}`}
                      style={{
                        animationDelay: `${index * 0.08}s`,
                      }}
                    >
                      <div className="absolute left-3 top-3 flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="absolute right-2 top-2 flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 ${active ? "text-status-approved" : "text-muted-foreground"}`}
                          title="Tampilkan"
                          onClick={() => showSummary(kpi.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 ${!active ? "text-status-rejected" : "text-muted-foreground"}`}
                          title="Sembunyikan"
                          onClick={() => hideSummary(kpi.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <KPICard
                        title={kpi.title}
                        value={kpi.value}
                        icon={kpi.icon}
                        variant={kpi.variant}
                        subtitle={kpi.subtitle}
                        trend={kpi.trend}
                        className="pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Drag & drop kartu untuk mengatur urutan. Centang untuk tampil,
                silang untuk sembunyikan.
              </p>
            </CardContent>
          )}
        </Card>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 xl:hidden">
          {visibleKpis.map((kpi) => (
            <KPICard
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              variant={kpi.variant}
              subtitle={kpi.subtitle}
              trend={kpi.trend}
            />
          ))}
        </div>

        <div className="hidden xl:flex xl:flex-col xl:gap-4 xl:mb-6">
          {kpiRows.map((row, rowIndex) => (
            <div
              key={`kpi-row-${rowIndex}`}
              className="grid auto-rows-fr gap-4"
              style={{
                gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
              }}
            >
              {row.map((kpi) => (
                <KPICard
                  key={kpi.id}
                  title={kpi.title}
                  value={kpi.value}
                  icon={kpi.icon}
                  variant={kpi.variant}
                  subtitle={kpi.subtitle}
                  trend={kpi.trend}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 card-ocean">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Tren Transaksi
                </CardTitle>
                <div className="flex items-center gap-2">
                  <select
                    value={trendFilter}
                    onChange={(event) => setTrendFilter(event.target.value)}
                    className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground"
                  >
                    {trendFilterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-muted-foreground">
                    dengan tahun lalu
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <defs>
                      <linearGradient
                        id="colorTotal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={CHART_COLORS.total}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={CHART_COLORS.total}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorRealized"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={CHART_COLORS.realized}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={CHART_COLORS.realized}
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
                      formatter={(value) => [`Rp ${value}jt`, ""]}
                    />
                    <Legend
                      iconType="line"
                      wrapperStyle={{
                        fontSize: "11px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke={CHART_COLORS.total}
                      strokeWidth={2}
                      fill="url(#colorTotal)"
                      name="Total"
                    />
                    <Line
                      type="monotone"
                      dataKey="lastYearTotal"
                      stroke="#b9bec7"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="4 4"
                      name="Total tahun lalu"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="card-ocean">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Distribusi Transaksi
              </CardTitle>
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
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value) => [formatRupiah(value), ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {categoryData.slice(0, 5).map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[index],
                        }}
                      />
                      <span className="text-muted-foreground truncate max-w-[160px]">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-medium">
                      {formatRupiah(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="card-ocean">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Top 5 Asal Negara
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "11px",
                      }}
                    />
                    <Bar
                      dataKey="current"
                      name="Tahun ini"
                      fill="hsl(213 70% 45%)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="lastYear"
                      name="Tahun lalu"
                      fill="hsl(213 30% 70%)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="card-ocean">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Jenis Kelamin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Tahun ini
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  Tahun lalu
                </span>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="value"
                      nameKey="name"
                      cx="30%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={2}
                    >
                      {genderData.map((entry, index) => (
                        <Cell
                          key={`gender-current-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Pie
                      data={genderLastYearData}
                      dataKey="value"
                      nameKey="name"
                      cx="75%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={2}
                    >
                      {genderLastYearData.map((entry, index) => (
                        <Cell
                          key={`gender-last-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          opacity={0.5}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "11px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="card-ocean">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Jenis Operator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={operatorTrendData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "11px",
                      }}
                    />
                    <Bar
                      dataKey="current"
                      name="Tahun ini"
                      fill="hsl(213 70% 45%)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="lastYear"
                      name="Tahun lalu"
                      fill="hsl(213 30% 70%)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="card-ocean mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">
              Perbandingan Pengunjung (Grup vs Individu)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />
                  <Bar
                    dataKey="current"
                    name="Tahun ini"
                    fill="hsl(213 70% 45%)"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="lastYear"
                    name="Tahun lalu"
                    fill="hsl(213 30% 70%)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-ocean">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Tiket Terbaru
                </CardTitle>
                <Link to="/tickets">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1 text-primary hover:text-primary"
                  >
                    Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium text-primary">
                          {formatShortId(ticket.id)}
                        </span>
                        <span className="text-xs text-muted-foreground">�</span>
                        <span className="text-sm text-foreground truncate">
                          {ticket.namaLengkap}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {FEE_PRICING[ticket.feeCategory].label} �{" "}
                        {BOOKING_TYPE_LABELS[ticket.bookingType]}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1 text-primary hover:text-primary"
                  >
                    Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingApprovalTickets.length > 0 ? (
                <div className="divide-y divide-border">
                  {pendingApprovalTickets.slice(0, 5).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-primary">
                            {formatShortId(ticket.id)}
                          </span>
                        </div>
                        <p className="text-sm text-foreground truncate">
                          {ticket.namaLengkap}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {FEE_PRICING[ticket.feeCategory].label}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatRupiah(ticket.totalBiaya)}
                        </p>
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
                  <p className="text-sm text-muted-foreground">
                    Tidak ada tiket menunggu persetujuan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
