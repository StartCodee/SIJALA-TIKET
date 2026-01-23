import React from "react";
const _jsxFileName = "src\\pages\\GateMonitorPage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { GateStatusChip, PaymentStatusChip } from '@/components/StatusChip';
import {
  dummyTickets,

  formatDateTime,
  formatShortId,
  FEE_PRICING,
} from '@/data/dummyData';
import {
  Search,
  DoorOpen,
  DoorClosed,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GateMonitorPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter by gate status
  const belumMasuk = dummyTickets.filter(
    (t) => t.gateStatus === 'belum_masuk' && t.paymentStatus === 'sudah_bayar'
  );
  const masuk = dummyTickets.filter((t) => t.gateStatus === 'masuk');
  const keluar = dummyTickets.filter((t) => t.gateStatus === 'keluar');

  const filterTickets = (tickets) => {
    return tickets.filter(
      (t) =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
      , React.createElement(AdminHeader, {
        title: "Monitor Gerbang" ,
        subtitle: "Pantau status gerbang masuk/keluar pengunjung"    ,
        showDateFilter: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
        /* Stats */
        , React.createElement('div', { className: "grid grid-cols-3 gap-4 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
          , React.createElement(Card, { className: "card-ocean p-4 border-l-4 border-l-status-pending"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
                , React.createElement('p', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, belumMasuk.length)
                , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}, "Belum Masuk" )
                , React.createElement('p', { className: "text-xs text-muted-foreground mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}, "Tiket sudah bayar, menunggu pemindaian"    )
              )
              , React.createElement(Clock, { className: "w-10 h-10 text-status-pending/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} )
            )
          )
          , React.createElement(Card, { className: "card-ocean p-4 border-l-4 border-l-status-approved"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
                , React.createElement('p', { className: "text-3xl font-bold text-status-approved"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, masuk.length)
                , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, "Sedang di Area"  )
                , React.createElement('p', { className: "text-xs text-muted-foreground mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "Aktif di dalam kawasan"   )
              )
              , React.createElement(DoorOpen, { className: "w-10 h-10 text-status-approved/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}} )
            )
          )
          , React.createElement(Card, { className: "card-ocean p-4 border-l-4 border-l-status-info"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
                , React.createElement('p', { className: "text-3xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}, keluar.length)
                , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}, "Sudah Keluar" )
                , React.createElement('p', { className: "text-xs text-muted-foreground mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}, "Hari ini" )
              )
              , React.createElement(DoorClosed, { className: "w-10 h-10 text-status-info/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )
            )
          )
        )

        /* Search */
        , React.createElement('div', { className: "flex items-center gap-4 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
          , React.createElement('div', { className: "relative flex-1 max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}} )
            , React.createElement(Input, {
              placeholder: "Cari ID Tiket atau nama..."    ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
            )
          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
            , React.createElement(RefreshCw, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} ), "Muat Ulang"

          )
        )

        /* Tabs */
        , React.createElement(Tabs, { defaultValue: "masuk", className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
          , React.createElement(TabsList, { className: "grid w-full grid-cols-3 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
            , React.createElement(TabsTrigger, { value: "belum_masuk", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
              , React.createElement(Clock, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}} ), "Belum Masuk ("
                , belumMasuk.length, ")"
            )
            , React.createElement(TabsTrigger, { value: "masuk", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
              , React.createElement(DoorOpen, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}} ), "Masuk ("
               , masuk.length, ")"
            )
            , React.createElement(TabsTrigger, { value: "keluar", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
              , React.createElement(DoorClosed, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}} ), "Keluar ("
               , keluar.length, ")"
            )
          )

          /* Belum Masuk Tab */
          , React.createElement(TabsContent, { value: "belum_masuk", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
            , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
              , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
                  , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
                    , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}, "ID Tiket" )
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}, "Nama")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}, "Kategori")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, "Pembayaran")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}, "Dibayar Pada" )
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "Status QR" )
                    )
                  )
                  , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
                    , filterTickets(belumMasuk).map((ticket) => (
                      React.createElement('tr', { key: ticket.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
                          , React.createElement(Link, {
                            to: `/tickets/${ticket.id}`,
                            className: "font-mono text-sm font-medium text-primary hover:underline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}

                            , formatShortId(ticket.id)
                          )
                        )
                        , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}, ticket.namaLengkap)
                        , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}, FEE_PRICING[ticket.feeCategory].label)
                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
                          , React.createElement(PaymentStatusChip, { status: ticket.paymentStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}} )
                        )
                        , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                          , ticket.paidAt && formatDateTime(ticket.paidAt)
                        )
                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
                          , React.createElement(Badge, { variant: ticket.qrActive ? 'default' : 'secondary', __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
                            , ticket.qrActive ? 'Aktif' : 'Nonaktif'
                          )
                        )
                      )
                    ))
                  )
                )
              )
            )
          )

          /* Masuk Tab */
          , React.createElement(TabsContent, { value: "masuk", __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
            , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
              , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
                , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
                  , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
                    , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "ID Tiket" )
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}, "Nama")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}, "Kategori")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "Masuk Pada" )
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}, "Status")
                    )
                  )
                  , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
                    , filterTickets(masuk).map((ticket) => (
                      React.createElement('tr', { key: ticket.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                          , React.createElement(Link, {
                            to: `/tickets/${ticket.id}`,
                            className: "font-mono text-sm font-medium text-primary hover:underline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}

                            , formatShortId(ticket.id)
                          )
                        )
                        , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}, ticket.namaLengkap)
                        , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}, FEE_PRICING[ticket.feeCategory].label)
                        , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                          , ticket.enteredAt && formatDateTime(ticket.enteredAt)
                        )
                        , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                          , React.createElement(GateStatusChip, { status: ticket.gateStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}} )
                        )
                      )
                    ))
                  )
                )
              )
            )
          )

          /* Keluar Tab */
          , React.createElement(TabsContent, { value: "keluar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
            , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}
              , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
                , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}
                  , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
                    , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}, "ID Tiket" )
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Nama")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}, "Kategori")
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}, "Masuk Pada" )
                      , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}, "Keluar Pada" )
                    )
                  )
                  , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
                    , filterTickets(keluar).map((ticket) => {
                      return (
                        React.createElement('tr', { key: ticket.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}
                          , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 227}}
                          , React.createElement(Link, {
                            to: `/tickets/${ticket.id}`,
                            className: "font-mono text-sm font-medium text-primary hover:underline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}

                            , formatShortId(ticket.id)
                          )
                        )
                          , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}, ticket.namaLengkap)
                          , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}, FEE_PRICING[ticket.feeCategory].label)
                          , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
                            , ticket.enteredAt && formatDateTime(ticket.enteredAt)
                          )
                          , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
                            , ticket.exitedAt && formatDateTime(ticket.exitedAt)
                          )
                        )
                      );
                    })
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
