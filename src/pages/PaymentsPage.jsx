import React from "react";
const _jsxFileName = "src\\pages\\PaymentsPage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import {
  dummyInvoices,
  formatRupiah,
  formatDateTime,
  formatShortId,
} from '@/data/dummyData';
import {
  Search,
  Download,
  Edit,
  FileText,
  Printer,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { exportExcel } from '@/lib/exporters';

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentLines, setPaymentLines] = useState(() => dummyInvoices.map((line) => ({ ...line })));
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);
  const [editForm, setEditForm] = useState({
    paymentStatus: 'belum_bayar',
    method: 'bank_transfer',
    paidAt: '',
    amount: '',
  });

  const toDateTimeLocal = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const fromDateTimeLocal = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString();
  };

  // Filter invoices
  const filteredInvoices = paymentLines.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'proses_bayar'
        ? invoice.paymentStatus === 'belum_bayar'
        : invoice.paymentStatus === statusFilter);
    return matchesSearch && matchesStatus;
  });

  // Stats
  const paidInvoices = paymentLines.filter((i) =>
    ['sudah_bayar', 'refund_diproses', 'refund_selesai'].includes(i.paymentStatus)
  );
  const totalPaid = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPotential = paymentLines.reduce((sum, i) => sum + i.amount, 0);
  const unpaidGap = totalPotential - totalPaid;

  const totalRealized = paymentLines
    .filter((i) => i.realisasiStatus === 'sudah_terealisasi')
    .reduce((sum, i) => sum + i.amount, 0);
  const getPaymentStatusLabel = (invoice) => {
    if (['sudah_bayar', 'refund_diproses', 'refund_selesai'].includes(invoice.paymentStatus)) {
      return { label: 'Sudah bayar', className: 'bg-status-approved-bg text-status-approved' };
    }
    if (invoice.paymentStatus === 'belum_bayar') {
      return { label: 'Belum Bayar', className: 'bg-status-pending-bg text-status-pending' };
    }
    return { label: 'Proses Bayar (1x24 jam)', className: 'bg-accent text-accent-foreground' };
  };
  const getRefundStatusLabel = (invoice) => {
    if (invoice.paymentStatus === 'refund_diproses') {
      return { label: 'Pengembalian Diproses', className: 'bg-status-pending-bg text-status-pending' };
    }
    if (invoice.paymentStatus === 'refund_selesai') {
      return { label: 'Pengembalian Selesai', className: 'bg-status-approved-bg text-status-approved' };
    }
    return { label: '-', className: 'bg-muted text-muted-foreground' };
  };

  const openEdit = (line) => {
    setSelectedLine(line);
    setEditForm({
      paymentStatus: line.paymentStatus || 'belum_bayar',
      method: line.method || 'bank_transfer',
      paidAt: toDateTimeLocal(line.paidAt || ''),
      amount: line.amount ?? '',
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedLine) return;
    setPaymentLines((prev) =>
      prev.map((line) =>
        line.id === selectedLine.id && line.ticketId === selectedLine.ticketId
          ? {
              ...line,
              paymentStatus: editForm.paymentStatus,
              method: editForm.method,
              paidAt: fromDateTimeLocal(editForm.paidAt),
              amount: Number(editForm.amount || 0),
            }
          : line
      )
    );
    setShowEditDialog(false);
  };

  const handleExportXls = () => {
    exportExcel(
      filteredInvoices.map((invoice) => ({
        invoice_id: invoice.id,
        ticket_id: invoice.ticketId,
        amount: invoice.amount,
        payment_status: invoice.paymentStatus,
        method: invoice.method,
        paid_at: invoice.paidAt || '',
        realisasi_status: invoice.realisasiStatus || '',
        refund_flag: invoice.refundFlag ? 'yes' : 'no',
      })),
      `payments_export_${new Date().toISOString().slice(0, 10)}.xlsx`,
      { sheetName: 'Payments' }
    );
  };

  const handleExportPdf = () => {
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
      , React.createElement(AdminHeader, {
        title: "Pembayaran & Tagihan"  ,
        subtitle: "Kelola pembayaran dan tagihan tiket"    ,
        showSearch: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
        /* Stats */
        , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "Pembayaran Masuk" )
            , React.createElement('p', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, paidInvoices.length)
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "Total Potensi Terbayar" )
            , React.createElement('p', { className: "text-xl font-bold text-status-approved"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, formatRupiah(totalPotential))
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}, "Total Terealisasi" )
            , React.createElement('p', { className: "text-xl font-bold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, formatRupiah(totalRealized))
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Selisih belum terbayarkan" )
            , React.createElement('p', { className: "text-xl font-bold text-status-pending"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, formatRupiah(unpaidGap))
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
            , React.createElement('p', { className: "text-xs text-muted-foreground mb-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Tanda Pengembalian" )
            , React.createElement('p', { className: "text-2xl font-bold text-status-revision"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
              , paymentLines.filter((i) => i.refundFlag).length
            )
          )
        )

        /* Search & Filter */
        , React.createElement('div', { className: "flex flex-wrap items-center gap-3 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
          , React.createElement('div', { className: "relative flex-1 min-w-[220px] max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}} )
            , React.createElement(Input, {
              placeholder: "Cari ID Invoice atau ID Tiket..."     ,
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
              , React.createElement(SelectItem, { value: "sudah_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}, "Sudah Bayar" )
              , React.createElement(SelectItem, { value: "proses_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, "Proses Bayar (1x24 jam)" )
              , React.createElement(SelectItem, { value: "belum_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Belum Bayar" )
            )
          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", onClick: handleExportXls, __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
            , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}} ), "Ekspor XLS"

          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", onClick: handleExportPdf, __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
            , React.createElement(FileText, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}} ), "Ekspor PDF"

          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", onClick: handlePrint, __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
            , React.createElement(Printer, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}} ), "Print"

          )
        )

        /* Table */
        , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
            , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, "ID Invoice" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "ID Tiket" )
                  , React.createElement('th', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Jumlah")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Dibayar Pada" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, "Status Pembayaran" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}, "Pengembalian")
                  , React.createElement('th', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}, "Aksi" )
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
                      , React.createElement('span', { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusLabel(invoice).className}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}, getPaymentStatusLabel(invoice).label)
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
                      , React.createElement('span', { className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRefundStatusLabel(invoice).className}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, getRefundStatusLabel(invoice).label)
                    )
                    , React.createElement('td', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}
                      , React.createElement(Button, {
                        variant: "ghost",
                        size: "icon",
                        className: "h-8 w-8",
                        title: "Edit pembayaran",
                        onClick: () => openEdit(invoice), __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                        , React.createElement(Edit, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}} )
                      )
                    )
                  )
                ))
              )
            )
          )
        )
        , React.createElement(Dialog, { open: showEditDialog, onOpenChange: setShowEditDialog, __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}
          , React.createElement(DialogContent, { className: "bg-card border-border max-w-2xl" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}
            , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
              , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "Edit Pembayaran" )
              , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}, "Perubahan manual untuk menjaga konsistensi data."  )
              , selectedLine && React.createElement('p', { className: "text-xs text-muted-foreground mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
                , "Invoice ", formatShortId(selectedLine.id), " • Tiket ", formatShortId(selectedLine.ticketId)
              )
            )

            , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 py-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}
                , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}, "Status Pembayaran" )
                , React.createElement(Select, { value: editForm.paymentStatus, onValueChange: (value) => setEditForm((prev) => ({ ...prev, paymentStatus: value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                  , React.createElement(SelectTrigger, { className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                    , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}} )
                  )
                  , React.createElement(SelectContent, { className: "bg-popover border-border", __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
                    , React.createElement(SelectItem, { value: "belum_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}, "Belum Bayar" )
                    , React.createElement(SelectItem, { value: "sudah_bayar", __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}, "Sudah Bayar" )
                    , React.createElement(SelectItem, { value: "refund_diproses", __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}, "Refund Diproses" )
                    , React.createElement(SelectItem, { value: "refund_selesai", __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}, "Refund Selesai" )
                  )
                )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}, "Metode" )
                , React.createElement(Select, { value: editForm.method, onValueChange: (value) => setEditForm((prev) => ({ ...prev, method: value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
                  , React.createElement(SelectTrigger, { className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                    , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 199}} )
                  )
                  , React.createElement(SelectContent, { className: "bg-popover border-border", __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}
                    , React.createElement(SelectItem, { value: "bank_transfer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}, "Bank Transfer" )
                    , React.createElement(SelectItem, { value: "credit_card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}, "Credit Card" )
                    , React.createElement(SelectItem, { value: "qris", __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}, "QRIS" )
                    , React.createElement(SelectItem, { value: "e_wallet", __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}, "E-Wallet" )
                  )
                )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}
                , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}, "Tanggal Bayar" )
                , React.createElement(Input, { type: "datetime-local", value: editForm.paidAt, onChange: (e) => setEditForm((prev) => ({ ...prev, paidAt: e.target.value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}} )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
                , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}, "Nominal" )
                , React.createElement(Input, { type: "number", value: editForm.amount, onChange: (e) => setEditForm((prev) => ({ ...prev, amount: e.target.value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}} )
              )
            )

            , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
              , React.createElement(Button, { variant: "outline", onClick: () => setShowEditDialog(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}, "Batal"

              )
              , React.createElement(Button, { className: "btn-ocean", onClick: handleSaveEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}, "Simpan Perubahan"
              )
            )
          )
        )
      )
    )
  );
}
