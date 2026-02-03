import React from "react";
const _jsxFileName = "src\\pages\\RefundCenterPage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { RefundStatusChip } from '@/components/StatusChip';
import {
  dummyRefunds,
  formatRupiah,
  formatDateTime,
  formatShortId,
  REFUND_TYPE_LABELS,

} from '@/data/dummyData';
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function RefundCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [actionNotes, setActionNotes] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  // Filter refunds
  const filteredRefunds = dummyRefunds.filter((refund) => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.ticketName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = {
    menunggu: dummyRefunds.filter((r) => r.status === 'requested').length,
    diterima: dummyRefunds.filter((r) => r.status === 'completed').length,
    ditolak: dummyRefunds.filter((r) => r.status === 'rejected').length,
    totalRefunded: dummyRefunds
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.refundAmount, 0),
  };

  const refundsByStatus = {
    menunggu: filteredRefunds.filter((refund) => refund.status === 'requested'),
    diterima: filteredRefunds.filter((refund) => refund.status === 'completed'),
    ditolak: filteredRefunds.filter((refund) => refund.status === 'rejected'),
  };

  const handleApprove = (refundId) => {
    console.log(`Aksi: terima pengembalian ${refundId}`);
  };

  const handleReject = (refundId) => {
    console.log(`Aksi: tolak pengembalian ${refundId}`);
  };

  const renderTable = (refunds, showActions) => {
    return (
      React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
        , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
          , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
            , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
              , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}, "ID Pengembalian" )
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "ID Tiket" )
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}, "Nama")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}, "Status")
                , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, "Diajukan")
                , showActions && (
                  React.createElement('th', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
                    , React.createElement('div', { className: "flex items-center justify-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "Aksi")
                  )
                )
              )
            )
            , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
              , refunds.map((refund) => (
                React.createElement('tr', { key: refund.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
                  , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
                    , React.createElement('button', {
                      onClick: () => openDetail(refund),
                      className: "font-mono text-sm font-medium text-primary hover:underline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}

                      , formatShortId(refund.id)
                    )
                  )
                  , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
                    , React.createElement(Link, {
                      to: `/tickets/${refund.ticketId}`,
                      className: "font-mono text-sm text-muted-foreground hover:text-primary hover:underline"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}

                      , formatShortId(refund.ticketId)
                    )
                  )
                  , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, refund.ticketName)
                  , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
                    , React.createElement(RefundStatusChip, { status: refund.status, __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}} )
                  )
                  , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
                    , formatDateTime(refund.requestedAt)
                  )
                  , showActions && (
                    React.createElement('td', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                      , React.createElement('div', { className: "flex items-center justify-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
                        , React.createElement(Button, {
                          onClick: () => handleApprove(refund.id),
                          size: "sm",
                          className: "gap-2 bg-status-approved hover:bg-status-approved/90 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}

                          , React.createElement(CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}} ), "Diterima"

                        )
                        , React.createElement(Button, {
                          onClick: () => handleReject(refund.id),
                          size: "sm",
                          variant: "outline",
                          className: "gap-2 border-status-rejected text-status-rejected hover:bg-status-rejected-bg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}

                          , React.createElement(XCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}} ), "Ditolak"

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
    );
  };

  const openDetail = (refund) => {
    setSelectedRefund(refund);
    setShowDetailDialog(true);
  };

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
      , React.createElement(AdminHeader, {
        title: "Pengembalian Dana" ,
        subtitle: "Kelola permintaan pengembalian dana tiket"    ,
        showSearch: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
        /* Stats Cards */
        , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
              , React.createElement('div', { className: "p-2.5 rounded-xl bg-status-pending-bg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
                , React.createElement(Clock, { className: "w-5 h-5 text-status-pending"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}} )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
                , React.createElement('p', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}, stats.menunggu)
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "Menunggu")
              )
            )
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}
              , React.createElement('div', { className: "p-2.5 rounded-xl bg-status-approved-bg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
                , React.createElement(CheckCircle, { className: "w-5 h-5 text-status-approved"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}} )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                , React.createElement('p', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, stats.diterima)
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}, "Diterima")
              )
            )
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
              , React.createElement('div', { className: "p-2.5 rounded-xl bg-status-rejected-bg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                , React.createElement(XCircle, { className: "w-5 h-5 text-status-rejected"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}} )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                , React.createElement('p', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}, stats.ditolak)
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "Ditolak")
              )
            )
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
              , React.createElement('div', { className: "p-2.5 rounded-xl bg-primary/10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
                , React.createElement(FileText, { className: "w-5 h-5 text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}} )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}
                , React.createElement('p', { className: "text-lg font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}, formatRupiah(stats.totalRefunded))
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}, "Total Dikembalikan" )
              )
            )
          )
        )

        /* Search & Filter */
        , React.createElement('div', { className: "flex items-center gap-4 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}
          , React.createElement('div', { className: "relative flex-1 max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}} )
            , React.createElement(Input, {
              placeholder: "Cari ID Pengembalian, ID Tiket, atau nama..."      ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
            )
          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
            , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}} ), "Ekspor"

          )
        )

        , React.createElement(Tabs, { defaultValue: "menunggu", className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}
          , React.createElement(TabsList, { className: "grid w-full grid-cols-3 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
            , React.createElement(TabsTrigger, { value: "menunggu", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
              , React.createElement(Clock, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}} ), "Menunggu ("
               , refundsByStatus.menunggu.length, ")"
            )
            , React.createElement(TabsTrigger, { value: "diterima", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
              , React.createElement(CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}} ), "Diterima ("
               , refundsByStatus.diterima.length, ")"
            )
            , React.createElement(TabsTrigger, { value: "ditolak", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
              , React.createElement(XCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}} ), "Ditolak ("
               , refundsByStatus.ditolak.length, ")"
            )
          )

          , React.createElement(TabsContent, { value: "menunggu", __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
            , renderTable(refundsByStatus.menunggu, true)
          )
          , React.createElement(TabsContent, { value: "diterima", __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}
            , renderTable(refundsByStatus.diterima, false)
          )
          , React.createElement(TabsContent, { value: "ditolak", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
            , renderTable(refundsByStatus.ditolak, false)
          )
        )
      )

      /* Refund Detail Dialog */
      , React.createElement(Dialog, { open: showDetailDialog, onOpenChange: setShowDetailDialog, __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
        , React.createElement(DialogContent, { className: "bg-card border-border max-w-2xl"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
          , selectedRefund && (
            React.createElement(React.Fragment, null
              , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}
                , React.createElement(DialogTitle, { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}
                  , React.createElement('span', { className: "font-mono", __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, formatShortId(selectedRefund.id))
                  , React.createElement(RefundStatusChip, { status: selectedRefund.status, __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}} )
                )
                , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}, "Detail permintaan pengembalian dana"   )
              )

              , React.createElement('div', { className: "grid grid-cols-2 gap-4 py-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}, "ID Tiket" )
                  , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}, formatShortId(selectedRefund.ticketId))
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}, "Nama")
                  , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}, selectedRefund.ticketName)
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}, "Nominal Awal" )
                  , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}, formatRupiah(selectedRefund.originalAmount))
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}, "Nominal Pengembalian" )
                  , React.createElement('p', { className: "text-lg font-bold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
                    , formatRupiah(selectedRefund.refundAmount)
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}, "Tipe")
                  , React.createElement(Badge, { variant: "outline", className: "capitalize", __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}
                    , REFUND_TYPE_LABELS[selectedRefund.type]
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 300}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}, "Diajukan Pada" )
                  , React.createElement('p', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}, formatDateTime(selectedRefund.requestedAt))
                )
                , React.createElement('div', { className: "col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
                  , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}, "Alasan")
                  , React.createElement('p', { className: "text-sm p-3 bg-muted/50 rounded-lg"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}, selectedRefund.reason)
                )
                , selectedRefund.referenceNumber && (
                  React.createElement('div', { className: "col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
                    , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}, "Nomor Referensi" )
                    , React.createElement('p', { className: "text-sm font-mono" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}, selectedRefund.referenceNumber)
                  )
                )
                , selectedRefund.notes && (
                  React.createElement('div', { className: "col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
                    , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}, "Catatan Internal" )
                    , React.createElement('p', { className: "text-sm p-3 bg-muted/50 rounded-lg italic"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}, selectedRefund.notes)
                  )
                )
              )

              /* Action Form for Processing */
              , selectedRefund.status === 'processing' && (
                React.createElement('div', { className: "border-t border-border pt-4 space-y-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}}
                  , React.createElement('h4', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}, "Selesaikan Pengembalian" )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}
                    , React.createElement('label', { className: "text-xs text-muted-foreground mb-1.5 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, "Nomor Referensi" )
                    , React.createElement(Input, {
                      placeholder: "TRF-YYYYMMDD-XXX",
                      value: referenceNumber,
                      onChange: (e) => setReferenceNumber(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
                    )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 334}}
                    , React.createElement('label', { className: "text-xs text-muted-foreground mb-1.5 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 335}}, "Unggah Bukti Transfer"  )
                    , React.createElement('div', { className: "border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}
                      , React.createElement(Upload, { className: "w-6 h-6 text-muted-foreground mx-auto mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}} )
                      , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}, "Klik atau tarik file"   )
                    )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
                    , React.createElement('label', { className: "text-xs text-muted-foreground mb-1.5 block"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}, "Catatan")
                    , React.createElement(Textarea, {
                      placeholder: "Catatan internal..." ,
                      value: actionNotes,
                      onChange: (e) => setActionNotes(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
                    )
                  )
                )
              )

              , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
                , React.createElement(Button, { variant: "outline", onClick: () => setShowDetailDialog(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, "Tutup"

                )
                , selectedRefund.status === 'processing' && (
                  React.createElement(Button, { className: "bg-status-approved hover:bg-status-approved/90 text-white gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
                    , React.createElement(CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}} ), "Selesaikan Pengembalian"

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
