import React from "react";
const _jsxFileName = "src\\pages\\OverviewPage.tsx";import { AdminLayout } from '@/components/AdminLayout';
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
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
      , React.createElement(AdminHeader, { 
        title: "Ringkasan Dasbor" , 
        subtitle: "Pantau aktivitas dan performa sistem tiket"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
        /* KPI Cards */
        , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
          , React.createElement(KPICard, {
            title: "Menunggu Persetujuan" ,
            value: kpis.pendingApproval,
            icon: ClipboardCheck,
            variant: "warning",
            subtitle: "Menunggu tinjauan" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
          )
          , React.createElement(KPICard, {
            title: "Belum Bayar" ,
            value: kpis.unpaid,
            icon: CreditCard,
            variant: "danger",
            subtitle: "Tiket menunggu pembayaran"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
          )
          , React.createElement(KPICard, {
            title: "Sudah Bayar" ,
            value: kpis.paid,
            icon: Wallet,
            variant: "success",
            trend: { value: 12, label: 'vs minggu lalu' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          )
          , React.createElement(KPICard, {
            title: "Gerbang Masuk" ,
            value: kpis.gateMasuk,
            icon: DoorOpen,
            variant: "primary",
            subtitle: "Saat ini di area"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
          )
          , React.createElement(KPICard, {
            title: "Gerbang Keluar" ,
            value: kpis.gateKeluar,
            icon: DoorClosed,
            variant: "default", __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
          )
        )

        /* Revenue KPIs */
        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
          , React.createElement(KPICard, {
            title: "Pendapatan Belum Terealisasi"  ,
            value: formatRupiah(kpis.revenueUnrealized),
            icon: TrendingDown,
            variant: "warning",
            subtitle: "Belum masuk gerbang"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
          )
          , React.createElement(KPICard, {
            title: "Pendapatan Terealisasi" ,
            value: formatRupiah(kpis.revenueRealized),
            icon: TrendingUp,
            variant: "success",
            trend: { value: 8, label: 'vs bulan lalu' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
          )
          , React.createElement(KPICard, {
            title: "Pengembalian Diajukan" ,
            value: kpis.refundRequested,
            icon: RotateCcw,
            variant: "warning",
            subtitle: "Menunggu proses" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
          )
          , React.createElement(KPICard, {
            title: "Pengembalian Selesai" ,
            value: kpis.refundCompleted,
            icon: RotateCcw,
            variant: "default",
            subtitle: formatRupiah(750000), __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}
          )
        )

        /* Charts Row */
        , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
          /* Trend Chart */
          , React.createElement(Card, { className: "lg:col-span-2 card-ocean" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
            , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
                , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "Tren Transaksi Harian"  )
                , React.createElement('span', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}, "Januari 2024" )
              )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
              , React.createElement('div', { className: "h-[260px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
                , React.createElement(ResponsiveContainer, { width: "100%", height: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                  , React.createElement(AreaChart, { data: trendData, __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
                    , React.createElement('defs', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}
                      , React.createElement('linearGradient', { id: "colorTotal", x1: "0", y1: "0", x2: "0", y2: "1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
                        , React.createElement('stop', { offset: "5%", stopColor: CHART_COLORS.total, stopOpacity: 0.35, __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}} )
                        , React.createElement('stop', { offset: "95%", stopColor: CHART_COLORS.total, stopOpacity: 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}} )
                      )
                      , React.createElement('linearGradient', { id: "colorRealized", x1: "0", y1: "0", x2: "0", y2: "1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
                        , React.createElement('stop', { offset: "5%", stopColor: CHART_COLORS.realized, stopOpacity: 0.35, __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}} )
                        , React.createElement('stop', { offset: "95%", stopColor: CHART_COLORS.realized, stopOpacity: 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}} )
                      )
                    )
                    , React.createElement(CartesianGrid, { strokeDasharray: "3 3" , stroke: "hsl(var(--border))", __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}} )
                    , React.createElement(XAxis, { 
                      dataKey: "date", 
                      tick: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                      axisLine: { stroke: 'hsl(var(--border))' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
                    )
                    , React.createElement(YAxis, { 
                      tick: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                      axisLine: { stroke: 'hsl(var(--border))' },
                      tickFormatter: (v) => `${v}jt`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
                    )
                    , React.createElement(Tooltip, { 
                      contentStyle: { 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      },
                      formatter: (value) => [`Rp ${value}jt`, ''], __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                    )
                    , React.createElement(Area, {
                      type: "monotone",
                      dataKey: "total",
                      stroke: CHART_COLORS.total,
                      strokeWidth: 2,
                      fill: "url(#colorTotal)",
                      name: "Total", __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}
                    )
                    , React.createElement(Area, {
                      type: "monotone",
                      dataKey: "realized",
                      stroke: CHART_COLORS.realized,
                      strokeWidth: 2,
                      fill: "url(#colorRealized)",
                      name: "Terealisasi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
                    )
                  )
                )
              )
            )
          )

          /* Category Breakdown */
          , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
            , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
              , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}, "Rincian Kategori" )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
              , React.createElement('div', { className: "h-[180px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
                , React.createElement(ResponsiveContainer, { width: "100%", height: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
                  , React.createElement(PieChart, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
                    , React.createElement(Pie, {
                      data: categoryData,
                      cx: "50%",
                      cy: "50%",
                      innerRadius: 50,
                      outerRadius: 75,
                      paddingAngle: 2,
                      dataKey: "value", __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}

                      , categoryData.map((entry, index) => (
                        React.createElement(Cell, { key: `cell-${index}`, fill: COLORS[index % COLORS.length], __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}} )
                      ))
                    )
                    , React.createElement(Tooltip, {
                      contentStyle: {
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      },
                      formatter: (value) => [`Rp ${value}jt`, ''], __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}
                    )
                  )
                )
              )
              , React.createElement('div', { className: "space-y-2 mt-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}
                , categoryData.slice(0, 4).map((item, index) => (
                  React.createElement('div', { key: item.name, className: "flex items-center justify-between text-xs"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
                    , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
                      , React.createElement('div', { 
                        className: "w-2.5 h-2.5 rounded-full"  , 
                        style: { backgroundColor: COLORS[index] }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}} 
                      )
                      , React.createElement('span', { className: "text-muted-foreground truncate max-w-[120px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}, item.name)
                    )
                    , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}, formatRupiah(item.value * 1000000))
                  )
                ))
              )
            )
          )
        )

        /* Bottom Row */
        , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}
          /* Recent Tickets */
          , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
            , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
                , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}, "Tiket Terbaru" )
                , React.createElement(Link, { to: "/tickets", __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
                  , React.createElement(Button, { variant: "ghost", size: "sm", className: "text-xs gap-1 text-primary hover:text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}, "Lihat Semua "
                      , React.createElement(ArrowRight, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}} )
                  )
                )
              )
            )
            , React.createElement(CardContent, { className: "p-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}
              , React.createElement('div', { className: "divide-y divide-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
                , recentTickets.map((ticket) => (
                  React.createElement('div', { key: ticket.id, className: "flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                    , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}
                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}
                        , React.createElement('span', { className: "font-mono text-sm font-medium text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
                          , formatShortId(ticket.id)
                        )
                        , React.createElement('span', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}, "•")
                        , React.createElement('span', { className: "text-sm text-foreground truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}, ticket.namaLengkap)
                      )
                      , React.createElement('p', { className: "text-xs text-muted-foreground mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}
                        , FEE_PRICING[ticket.feeCategory].label
                      )
                    )
                    , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
                      , React.createElement(PaymentStatusChip, { status: ticket.paymentStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}} )
                      , React.createElement(GateStatusChip, { status: ticket.gateStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}} )
                    )
                  )
                ))
              )
            )
          )

          /* Pending Approval */
          , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
            , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 329}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 330}}
                , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}, "Menunggu Persetujuan"

                  , React.createElement('span', { className: "ml-2 px-2 py-0.5 bg-status-pending-bg text-status-pending text-xs font-medium rounded-full"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
                    , pendingApprovalTickets.length
                  )
                )
                , React.createElement(Link, { to: "/approval", __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}
                  , React.createElement(Button, { variant: "ghost", size: "sm", className: "text-xs gap-1 text-primary hover:text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}, "Lihat Semua "
                      , React.createElement(ArrowRight, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}} )
                  )
                )
              )
            )
            , React.createElement(CardContent, { className: "p-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
              , pendingApprovalTickets.length > 0 ? (
                React.createElement('div', { className: "divide-y divide-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
                  , pendingApprovalTickets.slice(0, 5).map((ticket) => (
                    React.createElement('div', { key: ticket.id, className: "flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}
                      , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}
                        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}
                          , React.createElement('span', { className: "font-mono text-sm font-medium text-primary"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
                            , formatShortId(ticket.id)
                          )
                        )
                        , React.createElement('p', { className: "text-sm text-foreground truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}, ticket.namaLengkap)
                        , React.createElement('p', { className: "text-xs text-muted-foreground mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}
                          , FEE_PRICING[ticket.feeCategory].label
                        )
                      )
                      , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}}
                        , React.createElement('p', { className: "text-sm font-semibold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}, formatRupiah(ticket.totalBiaya))
                      )
                      , React.createElement(Link, { to: `/tickets/${ticket.id}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}
                        , React.createElement(Button, { size: "sm", className: "btn-ocean text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}, "Tinjau"

                        )
                      )
                    )
                  ))
                )
              ) : (
                React.createElement('div', { className: "flex flex-col items-center justify-center py-12 text-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
                  , React.createElement(ClipboardCheck, { className: "w-12 h-12 text-muted-foreground/30 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}} )
                  , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}, "Tidak ada tiket menunggu persetujuan"    )
                )
              )
            )
          )
        )
      )
    )
  );
}
