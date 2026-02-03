import React from "react";
const _jsxFileName = "src\\pages\\FinanceReportsPage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { KPICard } from '@/components/KPICard';
import {
  financeReportSummary,
  formatRupiah,

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
} from 'recharts';

const COLORS = [
  'hsl(213 70% 35%)',
  'hsl(213 65% 45%)',
  'hsl(213 60% 55%)',
  'hsl(213 60% 65%)',
  'hsl(213 70% 75%)',
];

const CHART_COLORS = {
  saldo: 'hsl(var(--primary))',
  potensi: 'hsl(213 70% 52%)',
  refund: 'hsl(6 80% 55%)',
};

export default function FinanceReportsPage() {
  const [showSettings, setShowSettings] = useState(false);
  const [realisasiRule, setRealisasiRule] = useState('masuk');
  const [realisasiDays, setRealisasiDays] = useState(3);

  const {
    period,
    totalPaid,
    totalRealized,
    totalUnrealized,
    totalRefunds,
    breakdown,
    dailyTrend,
  } = financeReportSummary;
  const totalSaldoPemasukan = totalPaid;

  // Chart data
  const trendData = dailyTrend.map((d) => ({
    date: new Date(d.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    saldo: d.total / 1000000,
    potensi: d.realized / 1000000,
    refund: (d.refunds || 0) / 1000000,
  }));

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
      , React.createElement(AdminHeader, {
        title: "Laporan Keuangan" ,
        subtitle: `Laporan Keuangan - ${period}`,
        showSearch: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
        /* Actions */
        , React.createElement('div', { className: "flex items-center justify-between mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
            , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
              , React.createElement(Calendar, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}} )
              , period
            )
          )
          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
            , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", onClick: () => setShowSettings(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
              , React.createElement(Settings, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}} ), "Pengaturan Laporan"

            )
            , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
              , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}} ), "Ekspor CSV"

            )
            , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
              , React.createElement(FileText, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}} ), "Ekspor PDF"

            )
            , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
              , React.createElement(Printer, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}} ), "Cetak"

            )
          )
        )

        /* Summary KPIs */
        , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
          , React.createElement(KPICard, {
            title: "Total Saldo Pemasukan" ,
            value: formatRupiah(totalPaid),
            icon: Wallet,
            variant: "brand", __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
          )
          , React.createElement(KPICard, {
            title: "Total Potensi Pemasukan" ,
            value: formatRupiah(totalRealized),
            icon: TrendingUp,
            variant: "brand", __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
          )
          , React.createElement(KPICard, {
            title: "Total Belum Terealisasi"  ,
            value: formatRupiah(totalUnrealized),
            icon: TrendingDown,
            variant: "brand", __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
          )
          , React.createElement(KPICard, {
            title: "Total Pengembalian Dana" ,
            value: formatRupiah(totalRefunds),
            icon: RotateCcw,
            variant: "brand", __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
          )
        )

        /* Charts */
        , React.createElement('div', { className: "grid grid-cols-1 gap-6 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
          /* Trend Chart */
          , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
              , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "Tren Harian: Total Saldo Pemasukan, Total Potensi Pemasukan, dan Total Pengembalian Dana"    )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
              , React.createElement('div', { className: "h-[300px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
                , React.createElement(ResponsiveContainer, { width: "100%", height: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
                  , React.createElement(ComposedChart, { data: trendData, __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
                    , React.createElement('defs', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                      , React.createElement('linearGradient', { id: "colorSaldo", x1: "0", y1: "0", x2: "0", y2: "1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
                        , React.createElement('stop', { offset: "5%", stopColor: CHART_COLORS.saldo, stopOpacity: 0.35, __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}} )
                        , React.createElement('stop', { offset: "95%", stopColor: CHART_COLORS.saldo, stopOpacity: 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}} )
                      )
                      , React.createElement('linearGradient', { id: "colorPotensi", x1: "0", y1: "0", x2: "0", y2: "1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                        , React.createElement('stop', { offset: "5%", stopColor: CHART_COLORS.potensi, stopOpacity: 0.35, __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}} )
                        , React.createElement('stop', { offset: "95%", stopColor: CHART_COLORS.potensi, stopOpacity: 0, __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}} )
                      )
                    )
                    , React.createElement(CartesianGrid, { strokeDasharray: "3 3" , stroke: "hsl(var(--border))", __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}} )
                    , React.createElement(XAxis, {
                      dataKey: "date",
                      tick: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                      axisLine: { stroke: 'hsl(var(--border))' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}
                    )
                    , React.createElement(YAxis, {
                      yAxisId: "left",
                      tick: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                      axisLine: { stroke: 'hsl(var(--border))' },
                      tickFormatter: (v) => `${v}jt`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
                    )
                    , React.createElement(YAxis, {
                      yAxisId: "right",
                      orientation: "right",
                      tick: { fontSize: 11, fill: 'hsl(var(--muted-foreground))' },
                      axisLine: { stroke: 'hsl(var(--border))' },
                      tickFormatter: (v) => `${v}jt`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}
                    )
                    , React.createElement(Tooltip, {
                      contentStyle: {
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      },
                      formatter: (value, name) => [formatRupiah(value * 1000000), name], __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
                    )
                    , React.createElement(Legend, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 211}} )
                    , React.createElement(Area, {
                      yAxisId: "left",
                      type: "monotone",
                      dataKey: "saldo",
                      stroke: CHART_COLORS.saldo,
                      strokeWidth: 2,
                      fill: "url(#colorSaldo)",
                      name: "Total Saldo Pemasukan" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
                    )
                    , React.createElement(Area, {
                      yAxisId: "left",
                      type: "monotone",
                      dataKey: "potensi",
                      stroke: CHART_COLORS.potensi,
                      strokeWidth: 2,
                      fill: "url(#colorPotensi)",
                      name: "Total Potensi Pemasukan", __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}
                    )
                    , React.createElement(Line, {
                      yAxisId: "right",
                      type: "monotone",
                      dataKey: "refund",
                      stroke: CHART_COLORS.refund,
                      strokeWidth: 2,
                      dot: { r: 3 },
                      name: "Total Pengembalian Dana", __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                    )
                  )
                )
              )
            )
          )
        )

        /* Breakdown Tables */
        , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
          /* By Category */
          , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
            , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}, "Detail per Kategori Layanan"   )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
              , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
                , breakdown.byCategory.map((item, i) => (
                  React.createElement('div', { key: item.category, className: "flex items-center justify-between py-2 border-b border-border last:border-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}
                    , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
                      , React.createElement('div', { 
                        className: "w-3 h-3 rounded-full"  , 
                        style: { backgroundColor: COLORS[i % COLORS.length] }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}} 
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
                        , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}, item.category)
                        , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}, item.count, " tiket" )
                      )
                    )
                    , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}
                      , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}, formatRupiah(item.amount))
                      , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
                        , totalSaldoPemasukan
                          ? `${((item.amount / totalSaldoPemasukan) * 100).toFixed(1)}%`
                          : '0%'
                      )
                    )
                  )
                ))
                , React.createElement('div', { className: "flex items-center justify-between pt-3 border-t border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}
                  , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}, "Total Saldo Pemasukan")
                  , React.createElement('p', { className: "text-sm font-semibold text-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}, formatRupiah(totalSaldoPemasukan))
                )
              )
            )
          )

          /* By Country */
          , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 308}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
              , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}, "Detail per Negara"  )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}
              , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}
                , breakdown.byCountry.map((item, i) => (
                  React.createElement('div', { key: item.country, className: "flex items-center justify-between py-2 border-b border-border last:border-0"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
                    , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}
                      , React.createElement('div', { 
                        className: "w-3 h-3 rounded-full"  , 
                        style: { backgroundColor: COLORS[i % COLORS.length] }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}} 
                      )
                      , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, item.country)
                    )
                    , React.createElement('span', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}, formatRupiah(item.amount))
                  )
                ))
                , React.createElement('div', { className: "flex items-center justify-between pt-3 border-t border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}
                  , React.createElement('p', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}, "Total Saldo Pemasukan")
                  , React.createElement('p', { className: "text-sm font-semibold text-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, formatRupiah(totalSaldoPemasukan))
                )
              )
            )
          )
        )
      )

      /* Settings Dialog */
      , React.createElement(Dialog, { open: showSettings, onOpenChange: setShowSettings, __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
        , React.createElement(DialogContent, { className: "bg-card border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 334}}
          , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 335}}
            , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}, "Pengaturan Laporan" )
            , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}, "Konfigurasi aturan realisasi pendapatan"   )
          )
          , React.createElement('div', { className: "space-y-6 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}
              , React.createElement(Label, { className: "text-sm font-semibold mb-3 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}, "Aturan Realisasi" )
              , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}
                , React.createElement('label', { className: "flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
                  , React.createElement('input', {
                    type: "radio",
                    name: "realisasi",
                    checked: realisasiRule === 'masuk',
                    onChange: () => setRealisasiRule('masuk'),
                    className: "accent-primary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}, "Saat Gerbang = Masuk"   )
                    , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, "Pendapatan terealisasi ketika pengunjung memindai di gerbang masuk"       )
                  )
                )
                , React.createElement('label', { className: "flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}
                  , React.createElement('input', {
                    type: "radio",
                    name: "realisasi",
                    checked: realisasiRule === 'bayar',
                    onChange: () => setRealisasiRule('bayar'),
                    className: "accent-primary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}, "Saat Sudah Bayar"  )
                    , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}, "Pendapatan langsung terealisasi setelah pembayaran"    )
                  )
                )
                , React.createElement('label', { className: "flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}
                  , React.createElement('input', {
                    type: "radio",
                    name: "realisasi",
                    checked: realisasiRule === 'days',
                    onChange: () => setRealisasiRule('days'),
                    className: "accent-primary", __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}
                  )
                  , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}, "Setelah X Hari dari Pembayaran"    )
                    , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}, "Pendapatan terealisasi setelah periode tunggu"    )
                  )
                )
                , realisasiRule === 'days' && (
                  React.createElement('div', { className: "pl-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}
                    , React.createElement(Label, { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}, "Jumlah hari" )
                    , React.createElement(Input, {
                      type: "number",
                      value: realisasiDays,
                      onChange: (e) => setRealisasiDays(parseInt(e.target.value)),
                      className: "w-24 mt-1" ,
                      min: 1,
                      max: 30, __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}
                    )
                  )
                )
              )
            )
            , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 397}} )
            , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
              , React.createElement(Label, { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}, "Pengaturan Lain" )
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 401}}
                  , React.createElement('p', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}, "Batas Waktu" )
                  , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}, "Waktu penutupan laporan harian"   )
                )
                , React.createElement(Select, { defaultValue: "23:59", __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
                  , React.createElement(SelectTrigger, { className: "w-[100px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}
                    , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 407}} )
                  )
                  , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
                    , React.createElement(SelectItem, { value: "17:00", __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, "17:00")
                    , React.createElement(SelectItem, { value: "23:59", __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}, "23:59")
                  )
                )
              )
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}
                  , React.createElement('p', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}, "Zona Waktu" )
                  , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "Zona waktu laporan"  )
                )
                , React.createElement(Select, { defaultValue: "WIT", __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}
                  , React.createElement(SelectTrigger, { className: "w-[100px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}
                    , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 422}} )
                  )
                  , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                    , React.createElement(SelectItem, { value: "WIB", __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}, "WIB")
                    , React.createElement(SelectItem, { value: "WITA", __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}}, "WITA")
                    , React.createElement(SelectItem, { value: "WIT", __self: this, __source: {fileName: _jsxFileName, lineNumber: 427}}, "WIT")
                  )
                )
              )
            )
          )
          , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}
            , React.createElement(Button, { variant: "outline", onClick: () => setShowSettings(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}}, "Batal"

            )
            , React.createElement(Button, { className: "btn-ocean", onClick: () => setShowSettings(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}, "Simpan Pengaturan"

            )
          )
        )
      )
    )
  );
}
