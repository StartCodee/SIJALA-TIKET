import React from "react";
const _jsxFileName = "src\\pages\\TicketDetailPage.tsx";import { useParams, Link } from 'react-router-dom';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import {
  ApprovalStatusChip,
  PaymentStatusChip,
  GateStatusChip,
  RealisasiStatusChip,
  RefundStatusChip,
} from '@/components/StatusChip';
import {
  dummyTickets,
  dummyRefunds,
  formatRupiah,
  formatDateTime,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
  DOMISILI_LABELS,
  REFUND_TYPE_LABELS,
} from '@/data/dummyData';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  ZoomIn,
  QrCode,
  CreditCard,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const ticket = dummyTickets.find((t) => t.id === ticketId);
  const ticketRefunds = dummyRefunds.filter((r) => r.ticketId === ticketId);

  if (!ticket) {
    return (
      React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
        , React.createElement('div', { className: "flex-1 flex items-center justify-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
          , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}
            , React.createElement(AlertTriangle, { className: "w-16 h-16 text-muted-foreground/30 mx-auto mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}} )
            , React.createElement('h2', { className: "text-xl font-semibold text-foreground mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}, "Tiket Tidak Ditemukan"  )
            , React.createElement('p', { className: "text-sm text-muted-foreground mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}, "ID: "
               , ticketId ? formatShortId(ticketId) : '-'
            )
            , React.createElement(Link, { to: "/tickets", __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
              , React.createElement(Button, { variant: "outline", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}
                , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}} ), "Kembali ke Daftar Tiket"

              )
            )
          )
        )
      )
    );
  }

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
      , React.createElement(AdminHeader, {
        title: `Tiket ${formatShortId(ticket.id)}`,
        subtitle: ticket.namaLengkap,
        showSearch: false,
        showDateFilter: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
        /* Back Button & Actions */
        , React.createElement('div', { className: "flex items-center justify-between mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
          , React.createElement(Link, { to: "/tickets", __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
              , React.createElement(Button, { variant: "ghost", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
                , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}} ), "Kembali"

              )
          )
          , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
            , ticket.needsApproval && ticket.approvalStatus === 'menunggu' && (
              React.createElement(React.Fragment, null
                , React.createElement(Button, { className: "gap-2 bg-status-approved hover:bg-status-approved/90 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
                  , React.createElement(CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}} ), "Setujui"

                )
                , React.createElement(Button, { variant: "outline", className: "gap-2 border-status-rejected text-status-rejected"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
                  , React.createElement(XCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} ), "Tolak"

                )
              )
            )
            , ticket.paymentStatus === 'sudah_bayar' && ticket.gateStatus === 'belum_masuk' && (
              React.createElement(Button, { variant: "outline", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
                , React.createElement(RotateCcw, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} ), "Mulai Pengembalian Dana"

              )
            )
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
          /* Left Column - Main Info */
          , React.createElement('div', { className: "lg:col-span-2 space-y-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
            /* Summary Card */
            , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
              , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
                , React.createElement(CardTitle, { className: "text-base font-semibold flex items-center justify-between"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, "Ringkasan"

                  , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
                    , React.createElement(ApprovalStatusChip, { status: ticket.approvalStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}} )
                    , React.createElement(PaymentStatusChip, { status: ticket.paymentStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}} )
                    , React.createElement(GateStatusChip, { status: ticket.gateStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}} )
                    , React.createElement(RealisasiStatusChip, { status: ticket.realisasiStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}} )
                  )
                )
              )
              , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
                , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                    , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}, "Nama Lengkap" )
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}, ticket.namaLengkap)
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
                    , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, "Email")
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}, ticket.email)
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
                    , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "No. HP" )
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}, ticket.noHP)
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
                    , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Tipe Pemesanan" )
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, BOOKING_TYPE_LABELS[ticket.bookingType])
                  )
                )
                , ticket.approvedBy && (
                  React.createElement('div', { className: "mt-4 pt-4 border-t border-border"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
                    , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}, "Disetujui Oleh" )
                    , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
                      , ticket.approvedBy, " • "  , formatDateTime(ticket.approvedAt)
                    )
                  )
                )
              )
            )
            /* Dokumen KTP */
            , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
              , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
                , React.createElement(CardTitle, { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}, "Dokumen KTP" )
              )
              , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
                , React.createElement('div', { className: "w-full aspect-video max-h-[320px] bg-muted rounded-lg overflow-hidden relative group"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
                  , React.createElement('img', {
                    src: ticket.ktmUrl,
                    alt: "Pratinjau KTP" ,
                    className: "w-full h-full object-contain"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                  )
                  , React.createElement('div', { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}
                    , React.createElement(Button, { size: "icon", variant: "secondary", className: "h-8 w-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}
                      , React.createElement(ZoomIn, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}} )
                    )
                    , React.createElement(Button, { size: "icon", variant: "secondary", className: "h-8 w-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}
                      , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}} )
                    )
                  )
                )
              )
            )

            /* Hasil OCR */
            , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
              , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                , React.createElement(CardTitle, { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "Hasil OCR" )
              )
              , React.createElement(CardContent, { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
                , React.createElement('div', { className: "p-4 bg-muted/50 rounded-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}, "Domisili")
                  , React.createElement('p', { className: "text-base font-semibold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}
                    , DOMISILI_LABELS[ticket.domisiliOCR]
                  )
                )
                , React.createElement('div', { className: "p-4 bg-accent/30 rounded-lg border border-accent"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, "Teks Terdeteksi" )
                  , React.createElement('p', { className: "text-sm font-mono text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}, "NIK: 9201****00001234"

                    , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 191}} ), "Provinsi: Papua Barat Daya"

                    , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 193}} ), "Kabupaten: Raja Ampat"

                  )
                )
              )
            )
          )

          /* Right Column - Pricing, QR, Payment */
          , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
            /* Pricing Card */
            , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
              , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}, "Rincian Biaya" )
              )
              , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}
                , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}
                  , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
                    , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}, "Kategori")
                    , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}, FEE_PRICING[ticket.feeCategory].label)
                  )
                  , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
                    , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}, "Harga/orang")
                    , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}, formatRupiah(ticket.hargaPerOrang))
                  )
                  , ticket.bookingType === 'group' && (
                    React.createElement(React.Fragment, null
                      , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 220}} )
                      , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
                        , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}, "Jumlah Domestik" )
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}, ticket.jumlahDomestik || 0, " orang" )
                      )
                      , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
                        , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}, "Jumlah Mancanegara" )
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 227}}, ticket.jumlahMancanegara || 0, " orang" )
                      )
                    )
                  )
                  , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 231}} )
                  , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
                    , React.createElement('span', { className: "font-semibold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}, "Total")
                    , React.createElement('span', { className: "text-xl font-bold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}, formatRupiah(ticket.totalBiaya))
                  )
                )
              )
            )

            /* QR Status Card */
            , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
              , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
                , React.createElement(CardTitle, { className: "text-base font-semibold flex items-center gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
                  , React.createElement(QrCode, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}} ), "QR Tiket"

                )
              )
              , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
                , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}
                  , React.createElement('div', {
                    className: cn(
                      'w-32 h-32 mx-auto rounded-lg flex items-center justify-center mb-3',
                      ticket.qrActive ? 'bg-muted' : 'bg-muted/50'
                    ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}

                    , React.createElement(QrCode, {
                      className: cn('w-20 h-20', ticket.qrActive ? 'text-foreground' : 'text-muted-foreground/30'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
                    )
                  )
                  , React.createElement(Badge, { variant: ticket.qrActive ? 'default' : 'secondary', className: "mb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}
                    , ticket.qrActive ? 'Aktif' : 'Nonaktif'
                  )
                  , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
                    , ticket.qrActive
                      ? 'QR dapat dipindai di gerbang'
                      : 'QR belum aktif. Selesaikan pembayaran.'
                  )
                )
              )
            )

            /* Payment & Refund Card */
            , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
              , React.createElement(CardHeader, { className: "pb-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}
                , React.createElement(CardTitle, { className: "text-base font-semibold flex items-center gap-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}
                  , React.createElement(CreditCard, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}} ), "Info Pembayaran"

                )
              )
              , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
                , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}
                  , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
                    , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}, "Status")
                    , React.createElement(PaymentStatusChip, { status: ticket.paymentStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}} )
                  )
                  , ticket.paidAt && (
                    React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
                      , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}, "Dibayar")
                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}, formatDateTime(ticket.paidAt))
                    )
                  )
                  , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
                    , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}, "Realisasi")
                    , React.createElement(RealisasiStatusChip, { status: ticket.realisasiStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}} )
                  )
                )

                /* Refund Info */
                , ticketRefunds.length > 0 && (
                  React.createElement(React.Fragment, null
                    , React.createElement(Separator, { className: "my-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}} )
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
                      , React.createElement('h4', { className: "text-sm font-semibold mb-3 flex items-center gap-2"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
                        , React.createElement(RotateCcw, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}} ), "Riwayat Pengembalian Dana"

                      )
                      , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
                        , ticketRefunds.map((refund) => (
                          React.createElement('div', { key: refund.id, className: "p-3 bg-muted/50 rounded-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
                            , React.createElement('div', { className: "flex items-center justify-between mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
                              , React.createElement('span', { className: "font-mono text-xs text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}
                                , formatShortId(refund.id)
                              )
                              , React.createElement(RefundStatusChip, { status: refund.status, __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}} )
                            )
                            , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}
                              , formatRupiah(refund.refundAmount), ' '
                              , React.createElement('span', { className: "text-muted-foreground font-normal" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}, "("
                                , REFUND_TYPE_LABELS[refund.type], ")"
                              )
                            )
                            , React.createElement('p', { className: "text-xs text-muted-foreground mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}, refund.reason)
                          )
                        ))
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}
