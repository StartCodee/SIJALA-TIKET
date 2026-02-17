import React, { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHeader } from "@/components/AdminHeader";
import { KPICard } from "@/components/KPICard";
import { PaymentStatusChip, GateStatusChip } from "@/components/StatusChip";
import {
  formatRupiah,
  formatNominal,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
  OVERVIEW_DEFAULT_TREND_DATE_FROM,
  OVERVIEW_DEFAULT_TREND_DATE_TO,
  OVERVIEW_BOOKING_YEAR_OPTIONS,
  OVERVIEW_DEFAULT_BOOKING_YEAR,
  OVERVIEW_DEFAULT_SUMMARY_SELECTION,
  OVERVIEW_DEFAULT_SUMMARY_ORDER,
  OVERVIEW_SUMMARY_OPTIONS,
  getOverviewDashboardData,
} from "@/data/dummyData";
import {
  ClipboardCheck,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  RotateCcw,
  ArrowRight,
  Users,
  FileText,
  Printer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendTransactionCard } from "@/components/overview/TrendTransactionCard";
import { DistributionTransactionCard } from "@/components/overview/DistributionTransactionCard";
import { TopCountryMapCard } from "@/components/overview/TopCountryMapCard";
import { GenderChartCard } from "@/components/overview/GenderChartCard";
import { OperatorChartCard } from "@/components/overview/OperatorChartCard";
import { BookingWaffleCard } from "@/components/overview/BookingWaffleCard";

export default function OverviewPage() {
  const [summarySelection, setSummarySelection] = useState(
    OVERVIEW_DEFAULT_SUMMARY_SELECTION,
  );
  const [showSummaryConfig, setShowSummaryConfig] = useState(false);
  const [trendDateFrom, setTrendDateFrom] = useState(
    OVERVIEW_DEFAULT_TREND_DATE_FROM,
  );
  const [trendDateTo, setTrendDateTo] = useState(
    OVERVIEW_DEFAULT_TREND_DATE_TO,
  );
  const [bookingYearFilter, setBookingYearFilter] = useState(
    OVERVIEW_DEFAULT_BOOKING_YEAR,
  );
  const {
    kpis,
    recentTickets,
    pendingApprovalTickets,
    activeTrendFilter,
    trendData,
    trendYAxisMax,
    topCountries,
    topCountrySeriesData,
    getTopCountryColor,
    genderStackedData,
    operatorTrendData,
    bookingWaffleData,
    bookingTotalPeople,
    bookingGroupPct,
    bookingIndividualPct,
    categoryData,
  } = getOverviewDashboardData({
    trendDateFrom,
    trendDateTo,
    bookingYear: bookingYearFilter,
  });
  const handleTrendDateFromChange = (value) => {
    setTrendDateFrom(value);
    if (trendDateTo && value && trendDateTo < value) {
      setTrendDateTo(value);
    }
  };
  const handleTrendDateToChange = (value) => {
    setTrendDateTo(value);
    if (trendDateFrom && value && value < trendDateFrom) {
      setTrendDateFrom(value);
    }
  };
  const summaryOptions = OVERVIEW_SUMMARY_OPTIONS;
  const isSelected = (id) => summarySelection.includes(id);
  const showSummary = (id) => {
    setSummarySelection((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const hideSummary = (id) => {
    setSummarySelection((prev) => prev.filter((item) => item !== id));
  };
  const resetSummaryDefaults = () => {
    setSummarySelection([...OVERVIEW_DEFAULT_SUMMARY_SELECTION]);
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
      variant: "warning",
      subtitle: "Tiket menunggu pembayaran",
    },
    {
      id: "payment_failed",
      title: "Pembayaran Gagal",
      value: kpis.paymentFailed,
      icon: CreditCard,
      variant: "danger",
      subtitle: "Transaksi gagal",
    },
    {
      id: "visitor_active",
      title: "Pengunjung Aktif",
      value: kpis.gateMasuk,
      icon: UserCheck,
      variant: "success",
      subtitle: "Saat ini di area",
    },
    {
      id: "visitor_due",
      title: "Pengunjung Jatuh Tempo",
      value: kpis.gateKeluar,
      icon: UserX,
      variant: "danger",
    },
    // Row 2
    {
      id: "refund_requested",
      title: "Pengajuan Pengembalian",
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
      subtitle: formatNominal(750000),
    },
    {
      id: "approval_wait",
      title: "Konfirmasi Persetujuan",
      value: kpis.pendingApproval,
      icon: ClipboardCheck,
      variant: "warning",
      subtitle: "Menunggu tinjauan",
    },
    {
      id: "approval_approved",
      title: "Persetujuan Berhasil",
      value: kpis.approvalApproved,
      icon: ClipboardCheck,
      variant: "success",
      subtitle: "Sudah disetujui",
    },
    {
      id: "visitor_registered",
      title: "Pengunjung Terdaftar",
      value: kpis.totalTickets,
      icon: Users,
      variant: "default",
      subtitle: `Saat ini di area: ${kpis.gateMasuk}`,
    },
    // Row 3
    {
      id: "failed_payment_amount",
      title: "Gagal Bayar Rp",
      value: formatNominal(0),
      icon: TrendingDown,
      variant: "danger",
      subtitle: "Nominal gagal bayar",
    },
    {
      id: "revenue_in",
      title: "Pendapatan Masuk Rp",
      value: formatNominal(kpis.revenueRealized),
      icon: TrendingUp,
      variant: "success",
      trend: {
        value: 8,
        label: "vs bulan lalu",
      },
    },
    {
      id: "revenue_pending",
      title: "Pendapatan Pending Rp",
      value: formatNominal(kpis.revenueUnrealized),
      icon: TrendingDown,
      variant: "warning",
      subtitle: "Konfirmasi 1x24 jam",
    },
    {
      id: "revenue_total",
      title: "Potensi Pendapatan Rp",
      value: formatNominal(kpis.revenueRealized + kpis.revenueUnrealized),
      icon: TrendingUp,
      variant: "brand",
      subtitle: "Akumulasi pendapatan",
    },
  ];
  const summaryKpiMap = summaryKpis.reduce((acc, kpi) => {
    acc[kpi.id] = kpi;
    return acc;
  }, {});
  const orderedKpis = OVERVIEW_DEFAULT_SUMMARY_ORDER
    .map((id) => summaryKpiMap[id])
    .filter(Boolean);
  const visibleKpis = orderedKpis.filter((kpi) => isSelected(kpi.id));
  const kpiRows = [];
  for (let i = 0; i < visibleKpis.length; i += 5) {
    kpiRows.push(visibleKpis.slice(i, i + 5));
  }
  const handleExportPdf = () => {
    window.print();
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <AdminLayout>
      <AdminHeader
        title="Ringkasan Dashboard"
        subtitle="Pantau aktivitas dan performa sistem tiket"
        showSearch={false}
        forceSuperAdmin
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={handleExportPdf}
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Cetak
            </Button>
            <Button
              size="sm"
              className={
                showSummaryConfig
                  ? "h-9 bg-status-revision-bg text-status-revision hover:bg-status-revision-bg/80 border border-status-revision/30"
                  : "h-9 bg-primary text-primary-foreground hover:bg-primary/90"
              }
              onClick={() => setShowSummaryConfig((prev) => !prev)}
            >
              {showSummaryConfig ? "Tutup Tampilan" : "Tampilan"}
            </Button>
          </>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        {showSummaryConfig && (
          <Card className="card-ocean mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold">
                  Tampilan Ringkasan
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={resetSummaryDefaults}
                >
                  Reset Default
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {summaryOptions.map((option) => (
                  <label
                    key={option.id}
                    htmlFor={`summary-toggle-${option.id}`}
                    className="flex items-center gap-3 rounded-md border border-border/70 bg-card px-3 py-2 text-sm cursor-pointer hover:bg-muted/40"
                  >
                    <Checkbox
                      id={`summary-toggle-${option.id}`}
                      checked={isSelected(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked === true) {
                          showSummary(option.id);
                          return;
                        }
                        hideSummary(option.id);
                      }}
                    />
                    <span className="text-foreground">{option.label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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
          <TrendTransactionCard
            trendDateFrom={trendDateFrom}
            trendDateTo={trendDateTo}
            onTrendDateFromChange={handleTrendDateFromChange}
            onTrendDateToChange={handleTrendDateToChange}
            trendData={trendData}
            trendYAxisMax={trendYAxisMax}
          />
          <DistributionTransactionCard categoryData={categoryData} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TopCountryMapCard
            topCountries={topCountries}
            topCountrySeriesData={topCountrySeriesData}
            getTopCountryColor={getTopCountryColor}
          />
          <GenderChartCard
            activeTrendFilterLabel={activeTrendFilter.label}
            genderStackedData={genderStackedData}
          />
          <OperatorChartCard operatorTrendData={operatorTrendData} />
        </div>
        <BookingWaffleCard
          activeTrendFilterLabel={activeTrendFilter.label}
          bookingYearFilter={bookingYearFilter}
          onBookingYearChange={setBookingYearFilter}
          bookingYearOptions={OVERVIEW_BOOKING_YEAR_OPTIONS}
          bookingWaffleData={bookingWaffleData}
          bookingTotalPeople={bookingTotalPeople}
          bookingGroupPct={bookingGroupPct}
          bookingIndividualPct={bookingIndividualPct}
        />
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
                        <span className="text-xs text-muted-foreground">-</span>
                        <span className="text-sm text-foreground truncate">
                          {ticket.namaLengkap}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {FEE_PRICING[ticket.feeCategory].label} -{" "}
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
