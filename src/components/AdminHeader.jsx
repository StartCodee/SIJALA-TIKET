import React from "react";
const _jsxFileName = "src\\components\\AdminHeader.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useState } from 'react';
import { Search, Bell, Calendar, ChevronDown, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAdminSidebar } from '@/components/AdminSidebarContext';









const dateFilters = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Rentang Kustom', value: 'custom' },
];

export function AdminHeader({
  title,
  subtitle,
  showSearch = true,
  showDateFilter = true,
  className,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('month');
  const { toggleMobile } = useAdminSidebar();

  return (
    React.createElement('header', { className: cn('bg-card border-b border-border px-6 py-4', className), __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}
      , React.createElement('div', { className: "flex items-center justify-between gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
        /* Title */
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
          , React.createElement(Button, {
            variant: "ghost",
            size: "icon",
            className: "h-9 w-9 md:hidden"  ,
            onClick: toggleMobile,
            'aria-label': "Buka sidebar" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}

            , React.createElement(Menu, { className: "w-5 h-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}} )
          )
          , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
            , React.createElement('h1', { className: "text-xl font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, title)
            , subtitle && (
              React.createElement('p', { className: "text-sm text-muted-foreground mt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}, subtitle)
            )
          )
        )

        /* Actions */
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
          /* Global Search */
          , showSearch && (
            React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
              , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} )
              , React.createElement(Input, {
                placeholder: "Cari ID Tiket, nama, email..."    ,
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-[280px] pl-9 h-9 bg-background border-border"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
              )
            )
          )

          /* Date Filter */
          , showDateFilter && (
            React.createElement(DropdownMenu, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
              , React.createElement(DropdownMenuTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
                , React.createElement(Button, { variant: "outline", size: "sm", className: "h-9 gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
                  , React.createElement(Calendar, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}, _optionalChain([dateFilters, 'access', _ => _.find, 'call', _2 => _2(f => f.value === selectedDateFilter), 'optionalAccess', _3 => _3.label]))
                  , React.createElement(ChevronDown, { className: "w-3.5 h-3.5 opacity-50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}} )
                )
              )
              , React.createElement(DropdownMenuContent, { align: "end", className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
                , dateFilters.map((filter) => (
                  React.createElement(DropdownMenuItem, {
                    key: filter.value,
                    onClick: () => setSelectedDateFilter(filter.value),
                    className: cn(
                      'cursor-pointer',
                      selectedDateFilter === filter.value && 'bg-accent'
                    ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}

                    , filter.label
                  )
                ))
              )
            )
          )

          /* Notifications */
          , React.createElement(Button, { variant: "ghost", size: "icon", className: "h-9 w-9 relative"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
            , React.createElement(Bell, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}} )
            , React.createElement('span', { className: "absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "3"

            )
          )
        )
      )
    )
  );
}
