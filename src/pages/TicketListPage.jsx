import React from "react";
const _jsxFileName = "src\\pages\\TicketListPage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import {
  ApprovalStatusChip,
  PaymentStatusChip,
  GateStatusChip,
  RealisasiStatusChip,
} from '@/components/StatusChip';
import {
  dummyTickets,
  formatRupiah,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
  DOMISILI_LABELS,

} from '@/data/dummyData';
import {
  Search,
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  User,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TicketListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [gateFilter, setGateFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(true);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  // Filter tickets
  const filteredTickets = dummyTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApproval = approvalFilter === 'all' || ticket.approvalStatus === approvalFilter;
    const matchesPayment = paymentFilter === 'all' || ticket.paymentStatus === paymentFilter;
    const matchesGate = gateFilter === 'all' || ticket.gateStatus === gateFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.feeCategory === categoryFilter;
    return matchesSearch && matchesApproval && matchesPayment && matchesGate && matchesCategory;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      React.createElement(ChevronUp, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}} )
    ) : (
      React.createElement(ChevronDown, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}} )
    );
  };
  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
      , React.createElement(AdminHeader, { 
        title: "Daftar Tiket" , 
        subtitle: "Data master semua tiket biaya konservasi"     ,
        showSearch: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
        /* Search & Actions Bar */
        , React.createElement('div', { className: "flex items-center gap-4 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
          , React.createElement('div', { className: "relative flex-1 max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}} )
            , React.createElement(Input, {
              placeholder: "Cari ID Tiket, nama, atau email..."     ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
            )
          )
          , React.createElement(Button, {
            variant: "outline",
            size: "sm",
            onClick: () => setShowFilters(!showFilters),
            className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}

            , React.createElement(Filter, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}} ), "Filter"

            , showFilters ? React.createElement(ChevronUp, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} ) : React.createElement(ChevronDown, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} )
          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
            , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}} ), "Ekspor"

          )
        )

        /* Filters */
        , showFilters && (
          React.createElement(Card, { className: "mb-4 card-ocean animate-fade-in"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
            , React.createElement(CardContent, { className: "p-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
              , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
                  , React.createElement('label', { className: "text-xs font-medium text-muted-foreground mb-1.5 block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "Status Persetujuan"

                  )
                  , React.createElement(Select, { value: approvalFilter, onValueChange: setApprovalFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
                    , React.createElement(SelectTrigger, { className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
                      , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 138}} )
                    )
                    , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
                      , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "Semua")
                      , React.createElement(SelectItem, { value: "menunggu", __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}, "Menunggu")
                      , React.createElement(SelectItem, { value: "disetujui", __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}, "Disetujui")
                      , React.createElement(SelectItem, { value: "ditolak", __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, "Ditolak")
                    )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
                  , React.createElement('label', { className: "text-xs font-medium text-muted-foreground mb-1.5 block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}, "Status Pembayaran"

                  )
                  , React.createElement(Select, { value: paymentFilter, onValueChange: setPaymentFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                    , React.createElement(SelectTrigger, { className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
                      , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 154}} )
                    )
                    , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
                      , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, "Semua")
                      , React.createElement(SelectItem, { value: "belum_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}, "Belum Bayar" )
                      , React.createElement(SelectItem, { value: "sudah_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}, "Sudah Bayar" )
                      , React.createElement(SelectItem, { value: "refund_diproses", __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}, "Pengembalian Diproses" )
                      , React.createElement(SelectItem, { value: "refund_selesai", __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}, "Pengembalian Selesai" )
                    )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
                  , React.createElement('label', { className: "text-xs font-medium text-muted-foreground mb-1.5 block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}, "Status Gerbang"

                  )
                  , React.createElement(Select, { value: gateFilter, onValueChange: setGateFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
                    , React.createElement(SelectTrigger, { className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
                      , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 171}} )
                    )
                    , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
                      , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}, "Semua")
                      , React.createElement(SelectItem, { value: "belum_masuk", __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "Belum Masuk" )
                      , React.createElement(SelectItem, { value: "masuk", __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}, "Masuk")
                      , React.createElement(SelectItem, { value: "keluar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}, "Keluar")
                    )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                  , React.createElement('label', { className: "text-xs font-medium text-muted-foreground mb-1.5 block"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}, "Kategori Biaya"

                  )
                  , React.createElement(Select, { value: categoryFilter, onValueChange: setCategoryFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                    , React.createElement(SelectTrigger, { className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                      , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}} )
                    )
                    , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
                      , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}, "Semua")
                      , Object.entries(FEE_PRICING).map(([key, value]) => (
                        React.createElement(SelectItem, { key: key, value: key, __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}
                          , value.label
                        )
                      ))
                    )
                  )
                )
                , React.createElement('div', { className: "flex items-end" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
                  , React.createElement(Button, {
                    variant: "ghost",
                    size: "sm",
                    onClick: () => {
                      setApprovalFilter('all');
                      setPaymentFilter('all');
                      setGateFilter('all');
                      setCategoryFilter('all');
                    },
                    className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}
, "Atur Ulang Filter"

                  )
                )
              )
            )
          )
        )

        /* Results Info */
        , React.createElement('div', { className: "flex items-center justify-between mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}
          , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}, "Menampilkan "
             , React.createElement('span', { className: "font-medium text-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}, sortedTickets.length), " dari" , ' '
            , React.createElement('span', { className: "font-medium text-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}, dummyTickets.length), " tiket"
          )
        )

        /* Table */
        , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
          , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
            , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
                  , React.createElement('th', { 
                    className: "cursor-pointer hover:bg-muted/70 transition-colors"  ,
                    onClick: () => handleSort('id'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}

                    , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}, "ID Tiket "
                        , React.createElement(SortIcon, { field: "id", __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}} )
                    )
                  )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}, "Tipe")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}, "Domisili")
                  , React.createElement('th', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}, "Total Biaya" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}, "Persetujuan")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}, "Pembayaran")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}, "Gerbang")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}, "Realisasi")
                  , React.createElement('th', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}, "Aksi")
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
                , sortedTickets.map((ticket) => (
                  React.createElement('tr', { key: ticket.id, className: "group", __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}
                    , React.createElement('td', { className: "whitespace-nowrap", __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}
                      , React.createElement(Link, { 
                        to: `/tickets/${ticket.id}`,
                        className: "font-mono text-sm font-medium text-primary hover:underline whitespace-nowrap"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}

                        , formatShortId(ticket.id)
                      )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}
                      , React.createElement('div', { className: "flex items-center gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
                        , ticket.bookingType === 'group' ? (
                          React.createElement(Users, { className: "w-3.5 h-3.5 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}} )
                        ) : (
                          React.createElement(User, { className: "w-3.5 h-3.5 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}} )
                        )
                        , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, BOOKING_TYPE_LABELS[ticket.bookingType])
                      )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
                      , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}, DOMISILI_LABELS[ticket.domisiliOCR])
                    )
                    , React.createElement('td', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}
                      , React.createElement('span', { className: "font-medium text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}, formatRupiah(ticket.totalBiaya))
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
                      , React.createElement(ApprovalStatusChip, { status: ticket.approvalStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 279}} )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}
                      , React.createElement(PaymentStatusChip, { status: ticket.paymentStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}} )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                      , React.createElement(GateStatusChip, { status: ticket.gateStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}} )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
                      , React.createElement(RealisasiStatusChip, { status: ticket.realisasiStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}} )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
                      , React.createElement('div', { className: "flex items-center justify-center gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
                        , React.createElement(Link, { to: `/tickets/${ticket.id}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
                          , React.createElement(Button, { variant: "ghost", size: "icon", className: "h-8 w-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}}
                            , React.createElement(Eye, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}} )
                          )
                        )
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
