import React from "react";
const _jsxFileName = "src\\pages\\ApprovalQueuePage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { ApprovalStatusChip } from '@/components/StatusChip';
import {
  dummyTickets,
  formatRupiah,
  formatDateTime,
  formatShortId,
  FEE_PRICING,
  BOOKING_TYPE_LABELS,
  DOMISILI_LABELS,
} from '@/data/dummyData';
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function ApprovalQueuePage() {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectTicketId, setRejectTicketId] = useState(null);
  const [rejectNotes, setRejectNotes] = useState('');

  const approvalTickets = dummyTickets.filter((t) => t.needsApproval);
  const ticketsByStatus = {
    menunggu: approvalTickets.filter((t) => t.approvalStatus === 'menunggu'),
    disetujui: approvalTickets.filter((t) => t.approvalStatus === 'disetujui'),
    ditolak: approvalTickets.filter((t) => t.approvalStatus === 'ditolak'),
  };

  const handleApprove = (ticketId) => {
    console.log(`Aksi: approve pada tiket ${ticketId}`);
  };

  const handleReject = (ticketId) => {
    setRejectTicketId(ticketId);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (!rejectTicketId) return;
    console.log(`Aksi: reject pada tiket ${rejectTicketId} dengan catatan: ${rejectNotes}`);
    setShowRejectDialog(false);
    setRejectTicketId(null);
    setRejectNotes('');
  };

  const renderTicketList = (tickets, showActions) => {
    if (tickets.length === 0) {
      return (
        React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
          , React.createElement(CardContent, { className: "flex flex-col items-center justify-center py-16"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
            , React.createElement(CheckCircle, { className: "w-16 h-16 text-status-approved/30 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}} )
            , React.createElement('h3', { className: "text-lg font-semibold text-foreground mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "Belum Ada Data"  )
            , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, "Tidak ada tiket pada status ini."     )
          )
        )
      );
    }

    return (
      React.createElement('div', { className: "grid gap-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
        , tickets.map((ticket) => (
          React.createElement(Card, { key: ticket.id, className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
            , React.createElement(CardContent, { className: "p-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
              , React.createElement('div', { className: "p-5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
                  , React.createElement('div', { className: "flex items-start justify-between mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
                    , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
                      , React.createElement('div', { className: "flex items-center gap-3 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
                        , React.createElement(Link, {
                          to: `/tickets/${ticket.id}`,
                          className: "font-mono text-lg font-semibold text-primary hover:underline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}

                          , formatShortId(ticket.id)
                        )
                        , React.createElement(ApprovalStatusChip, { status: ticket.approvalStatus, __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} )
                        , showActions && ticket.needsApproval && (
                          React.createElement(Badge, { variant: "outline", className: "text-[10px] border-status-pending text-status-pending"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, "Butuh Persetujuan"

                          )
                        )
                      )
                      , React.createElement('h3', { className: "text-lg font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}, ticket.namaLengkap)
                      , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, ticket.email)
                    )
                    , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
                      , React.createElement('p', { className: "text-2xl font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, formatRupiah(ticket.totalBiaya))
                      , React.createElement('p', { className: "text-xs text-muted-foreground mt-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, "Dibuat "
                         , formatDateTime(ticket.createdAt)
                      )
                    )
                  )

                  , React.createElement('div', { className: "flex flex-col gap-4 mb-5 lg:flex-row lg:items-start"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
                    , React.createElement('div', { className: "grid flex-1 grid-cols-2 md:grid-cols-4 gap-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
                        , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, "Kategori")
                        , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}, FEE_PRICING[ticket.feeCategory].label)
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
                        , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}, "Domisili")
                        , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}, DOMISILI_LABELS[ticket.domisiliOCR])
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
                        , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "Tipe")
                        , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, BOOKING_TYPE_LABELS[ticket.bookingType])
                      )
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                        , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}, "No. HP" )
                        , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}, ticket.noHP)
                      )
                    )
                  )

                  /* Actions */
                  , React.createElement('div', { className: "flex items-center gap-3 pt-4 border-t border-border"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
                    , showActions && (
                      React.createElement(React.Fragment, null
                        , React.createElement(Button, {
                          onClick: () => handleApprove(ticket.id),
                          className: "gap-2 bg-status-approved hover:bg-status-approved/90 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}

                          , React.createElement(CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}} ), "Setujui"

                        )
                        , React.createElement(Button, {
                          variant: "outline",
                          onClick: () => handleReject(ticket.id),
                          className: "gap-2 border-status-rejected text-status-rejected hover:bg-status-rejected-bg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}

                          , React.createElement(XCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}} ), "Tolak"

                        )
                      )
                    )
                    , !showActions && ticket.approvalStatus === 'ditolak' && (
                      React.createElement('div', { className: "max-w-[420px] rounded-lg border border-status-rejected/20 bg-status-rejected-bg px-4 py-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
                        , React.createElement('p', { className: "text-xs font-medium text-status-rejected mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}, "Alasan Ditolak" )
                        , React.createElement('p', { className: "text-sm text-status-rejected" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
                          , ticket.rejectionReason || 'Tidak ada catatan.'
                        )
                      )
                    )
                    , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}} )
                    , React.createElement(Link, { to: `/tickets/${ticket.id}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                      , React.createElement(Button, { variant: "ghost", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
                        , React.createElement(Eye, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}} ), "Lihat Detail"

                      )
                    )
                  )
              )
            )
          )
        ))
      )
    );
  };

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
      , React.createElement(AdminHeader, {
        title: "Antrian Persetujuan" ,
        subtitle: "Tiket yang membutuhkan persetujuan Admin Tiket"    ,
        showSearch: false,
        showDateFilter: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
        , React.createElement(Tabs, { defaultValue: "menunggu", className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
          , React.createElement(TabsList, { className: "grid w-full grid-cols-3 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
            , React.createElement(TabsTrigger, { value: "menunggu", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
              , React.createElement(Clock, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}} ), "Menunggu ("
               , ticketsByStatus.menunggu.length, ")"
            )
            , React.createElement(TabsTrigger, { value: "disetujui", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}
              , React.createElement(CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}} ), "Diterima ("
               , ticketsByStatus.disetujui.length, ")"
            )
            , React.createElement(TabsTrigger, { value: "ditolak", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
              , React.createElement(XCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}} ), "Ditolak ("
               , ticketsByStatus.ditolak.length, ")"
            )
          )

          , React.createElement(TabsContent, { value: "menunggu", __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
            , renderTicketList(ticketsByStatus.menunggu, true)
          )
          , React.createElement(TabsContent, { value: "disetujui", __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
            , renderTicketList(ticketsByStatus.disetujui, false)
          )
          , React.createElement(TabsContent, { value: "ditolak", __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}
            , renderTicketList(ticketsByStatus.ditolak, false)
          )
        )
      )

      , React.createElement(Dialog, { open: showRejectDialog, onOpenChange: setShowRejectDialog, __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
        , React.createElement(DialogContent, { className: "bg-card border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
          , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
            , React.createElement(DialogTitle, { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}
              , React.createElement(XCircle, { className: "w-5 h-5 text-status-rejected"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}} ), "Tolak Tiket"

            )
            , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}, "Berikan alasan penolakan untuk tiket ini."     )
          )
          , React.createElement('div', { className: "py-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
            , React.createElement('label', { className: "text-sm font-medium mb-2 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}, "Alasan Penolakan" )
            , React.createElement(Textarea, {
              placeholder: "Tambahkan alasan penolakan..."  ,
              value: rejectNotes,
              onChange: (e) => setRejectNotes(e.target.value),
              className: "min-h-[100px]", __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
            )
          )
          , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
            , React.createElement(Button, { variant: "outline", onClick: () => setShowRejectDialog(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}, "Batal"

            )
            , React.createElement(Button, {
              onClick: confirmReject,
              className: "bg-status-rejected hover:bg-status-rejected/90 text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
, "Tolak"

            )
          )
        )
      )

    )
  );
}
