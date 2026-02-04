import React from "react";
const _jsxFileName = "src\\pages\\ActivityLogsPage.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { RoleBadge } from '@/components/StatusChip';
import { dummyAuditLogs, formatDateTime, formatShortId } from '@/data/dummyData';
import {
  Search,
  Download,
  History,
  User,
  Ticket,
  CreditCard,
  RotateCcw,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const entityIcons = {
  Ticket: Ticket,
  Payment: CreditCard,
  Refund: RotateCcw,
  User: User,
  Settings: Settings,
};

const entityLabels = {
  Ticket: 'Tiket',
  Payment: 'Pembayaran',
  Refund: 'Pengembalian Dana',
  User: 'Pengguna',
  Settings: 'Pengaturan',
};

const actionLabels = {
  ticket_created: 'Tiket dibuat',
  ticket_approved: 'Tiket disetujui',
  ticket_rejected: 'Tiket ditolak',
  payment_received: 'Pembayaran diterima',
  refund_requested: 'Pengembalian diajukan',
  refund_processing: 'Pengembalian diproses',
  refund_completed: 'Pengembalian selesai',
  user_disabled: 'Pengguna dinonaktifkan',
  user_enabled: 'Pengguna diaktifkan',
};

const valueLabels = {
  requested: 'diajukan',
  processing: 'diproses',
  completed: 'selesai',
  rejected: 'ditolak',
  cancelled: 'dibatalkan',
  active: 'aktif',
  disabled: 'nonaktif',
};

const formatLogValue = (value) => (value ? _nullishCoalesce(valueLabels[value], () => ( value)) : value);

const actionColors = {
  ticket_created: 'bg-status-info-bg text-status-info',
  ticket_approved: 'bg-status-approved-bg text-status-approved',
  ticket_rejected: 'bg-status-rejected-bg text-status-rejected',
  revision_requested: 'bg-status-revision-bg text-status-revision',
  payment_received: 'bg-status-approved-bg text-status-approved',
  refund_requested: 'bg-status-pending-bg text-status-pending',
  refund_processing: 'bg-status-revision-bg text-status-revision',
  refund_completed: 'bg-status-approved-bg text-status-approved',
  user_disabled: 'bg-status-rejected-bg text-status-rejected',
  user_enabled: 'bg-status-approved-bg text-status-approved',
};

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  // Get unique action types
  const actionTypes = [...new Set(dummyAuditLogs.map((log) => log.actionType))];

  // Filter logs
  const filteredLogs = dummyAuditLogs.filter((log) => {
    const matchesSearch =
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.note && log.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesEntity = entityFilter === 'all' || log.entityType === entityFilter;
    const matchesAction = actionFilter === 'all' || log.actionType === actionFilter;
    return matchesSearch && matchesEntity && matchesAction;
  });

  // Sort by timestamp desc
  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
      , React.createElement(AdminHeader, {
        title: "Log Aktivitas" ,
        subtitle: "Jejak audit semua aktivitas pengguna"    ,
        showSearch: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}
        /* Search & Filter */
        , React.createElement('div', { className: "flex items-center gap-4 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
          , React.createElement('div', { className: "relative flex-1 max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}} )
            , React.createElement(Input, {
              placeholder: "Cari ID, pengguna, atau catatan..."    ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
            )
          )
          , React.createElement(Select, { value: entityFilter, onValueChange: setEntityFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
            , React.createElement(SelectTrigger, { className: "w-[150px] bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
              , React.createElement(SelectValue, { placeholder: "", __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}} )
            )
            , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
              , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "Semua")
              , React.createElement(SelectItem, { value: "Ticket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}, "Tiket")
              , React.createElement(SelectItem, { value: "Payment", __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}, "Pembayaran")
              , React.createElement(SelectItem, { value: "Refund", __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}, "Pengembalian Dana" )
              , React.createElement(SelectItem, { value: "User", __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Pengguna")
              , React.createElement(SelectItem, { value: "Settings", __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, "Pengaturan")
            )
          )
          , React.createElement(Select, { value: actionFilter, onValueChange: setActionFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
            , React.createElement(SelectTrigger, { className: "w-[180px] bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
              , React.createElement(SelectValue, { placeholder: "Aksi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}} )
            )
            , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}
              , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}, "Semua Aksi" )
              , actionTypes.map((action) => (
                React.createElement(SelectItem, { key: action, value: action, __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
                  , _nullishCoalesce(actionLabels[action], () => ( action.replace(/_/g, ' ')))
                )
              ))
            )
          )
          , React.createElement(Button, { variant: "outline", size: "sm", className: "gap-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
            , React.createElement(Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}} ), "Ekspor"

          )
        )

        /* Results Info */
        , React.createElement('div', { className: "mb-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
          , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}, "Menampilkan "
             , React.createElement('span', { className: "font-medium text-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}, sortedLogs.length), " log"
          )
        )

        /* Logs Timeline */
        , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
          , React.createElement(CardContent, { className: "p-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
            , React.createElement('div', { className: "divide-y divide-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
              , sortedLogs.map((log) => {
                const IconComponent = entityIcons[log.entityType] || History;
                const actionColor = actionColors[log.actionType] || 'bg-muted text-muted-foreground';
                const displayEntityId = formatShortId(log.entityId);

                return (
                  React.createElement('div', { key: log.id, className: "flex gap-4 p-4 hover:bg-muted/30 transition-colors"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                    /* Icon */
                    , React.createElement('div', { className: "flex-shrink-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
                      , React.createElement('div', { className: cn('w-10 h-10 rounded-xl flex items-center justify-center', actionColor), __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
                        , React.createElement(IconComponent, { className: "w-5 h-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}} )
                      )
                    )

                    /* Content */
                    , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
                      , React.createElement('div', { className: "flex items-center gap-2 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                        , React.createElement(Badge, { variant: "outline", className: "text-[10px] font-mono" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
                          , _nullishCoalesce(entityLabels[log.entityType], () => ( log.entityType))
                        )
                        , React.createElement('span', { className: "text-sm font-medium text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}
                          , _nullishCoalesce(actionLabels[log.actionType], () => ( log.actionType.replace(/_/g, ' ')))
                        )
                        , log.entityId && (
                          React.createElement(React.Fragment, null
                            , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}, "•")
                            , log.entityType === 'Ticket' ? (
                              React.createElement(Link, {
                                to: `/tickets/${log.entityId}`,
                                className: "font-mono text-sm text-primary hover:underline"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}

                                , displayEntityId
                              )
                            ) : (
                              React.createElement('span', { className: "font-mono text-sm text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                                , displayEntityId
                              )
                            )
                          )
                        )
                      )

                      /* Value Change */
                      , (log.beforeValue || log.afterValue) && (
                        React.createElement('div', { className: "flex items-center gap-2 text-sm mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
                          , log.beforeValue && (
                            React.createElement('span', { className: "px-2 py-0.5 bg-status-rejected-bg text-status-rejected rounded text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}
                              , formatLogValue(log.beforeValue)
                            )
                          )
                          , log.beforeValue && log.afterValue && (
                            React.createElement(ArrowRight, { className: "w-3.5 h-3.5 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}} )
                          )
                          , log.afterValue && (
                            React.createElement('span', { className: "px-2 py-0.5 bg-status-approved-bg text-status-approved rounded text-xs"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
                              , formatLogValue(log.afterValue)
                            )
                          )
                        )
                      )

                      /* Note */
                      , log.note && (
                        React.createElement('p', { className: "text-sm text-muted-foreground italic"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}, "\"", log.note, "\"")
                      )

                      /* Meta */
                      , React.createElement('div', { className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
                        , React.createElement('span', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}
                          , React.createElement(User, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}} )
                          , log.adminUser
                        )
                        , React.createElement(RoleBadge, { role: log.adminRole, __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}} )
                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}, formatDateTime(log.timestamp))
                      )
                    )
                  )
                );
              })
            )
          )
        )
      )
    )
  );
}
