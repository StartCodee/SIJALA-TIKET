import React from "react";
const _jsxFileName = "src\\pages\\PaymentsPage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { PaymentStatusChip, RealisasiStatusChip } from '@/components/StatusChip';
import {
  dummyInvoices,
  formatRupiah,
  formatDateTime,
  formatShortId,
} from '@/data/dummyData';
import {
  Search,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter invoices
  const filteredInvoices = dummyInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalPaid = dummyInvoices
    .filter((i) => ['sudah_bayar', 'refund_diproses', 'refund_selesai'].includes(i.paymentStatus))
    .reduce((sum, i) => sum + i.amount, 0);

  const totalRealized = dummyInvoices
    .filter((i) => i.realisasiStatus === 'sudah_terealisasi')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
      , React.createElement(AdminHeader, {
        title: "Pembayaran & Tagihan"  ,
        subtitle: "Kelola pembayaran dan tagihan tiket"    ,
        showSearch: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
        /* Stats */
        , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "Total Tagihan" )
            , React.createElement('p', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, dummyInvoices.length)
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "Total Terbayar" )
            , React.createElement('p', { className: "text-xl font-bold text-status-approved"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, formatRupiah(totalPaid))
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "Total Terealisasi" )
            , React.createElement('p', { className: "text-xl font-bold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, formatRupiah(totalRealized))
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Tanda Pengembalian" )
            , React.createElement('p', { className: "text-2xl font-bold text-status-revision"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
              , dummyInvoices.filter((i) => i.refundFlag).length
            )
          )
        )

        /* Search & Filter */
        , React.createElement('div', { className: "flex items-center gap-4 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
          , React.createElement('div', { className: "relative flex-1 max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}} )
            , React.createElement(Input, {
              placeholder: "Cari ID Tagihan atau ID Tiket..."     ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
            )
          )
          , React.createElement(Select, { value: statusFilter, onValueChange: setStatusFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
            , React.createElement(SelectTrigger, { className: "w-[180px] bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
              , React.createElement(SelectValue, { placeholder: "Status Pembayaran" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}} )
            )
            , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
              , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}, "Semua Status" )
              , React.createElement(SelectItem, { value: "belum_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Belum Bayar" )
              , React.createElement(SelectItem, { value: "sudah_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}, "Sudah Bayar" )
              , React.createElement(SelectItem, { value: "refund_diproses", __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, "Pengembalian Diproses" )
              , React.createElement(SelectItem, { value: "refund_selesai", __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Pengembalian Selesai" )
            )
          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
            , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}} ), "Ekspor CSV"

          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
            , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}} ), "Ekspor PDF"

          )
        )

        /* Table */
        , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
            , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, "ID Tagihan" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "ID Tiket" )
                  , React.createElement('th', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Jumlah")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Dibayar Pada" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, "Status Pembayaran" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}, "Realisasi")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}, "Pengembalian")
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
                , filteredInvoices.map((invoice) => (
                  React.createElement('tr', { key: invoice.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
                      , React.createElement('span', { className: "font-mono text-sm font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, formatShortId(invoice.id))
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}
                      , React.createElement(Link, {
                        to: `/tickets/${invoice.ticketId}`,
                        className: "font-mono text-sm text-primary hover:underline"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}

                        , formatShortId(invoice.ticketId)
                      )
                    )
                    , React.createElement('td', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
                      , React.createElement('span', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, formatRupiah(invoice.amount))
                    )
                    , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
                      , invoice.paidAt ? formatDateTime(invoice.paidAt) : '-'
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
                      , React.createElement(PaymentStatusChip, { status: invoice.paymentStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}} )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                      , React.createElement(RealisasiStatusChip, { status: invoice.realisasiStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}} )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
                      , invoice.refundFlag ? (
                        React.createElement(Badge, { variant: "outline", className: "text-status-revision border-status-revision" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, "Pengembalian"

                        )
                      ) : (
                        React.createElement('span', { className: "text-muted-foreground text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}, "-")
                      )
                    )
                  )
                ))
              )
            )
          )
        )
      )
    )
  );
}
