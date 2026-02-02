import React from "react";
const _jsxFileName = "src\\components\\AdminSidebar.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Ticket,
  ClipboardCheck,
  CreditCard,
  Tag,
  DoorOpen,
  BarChart3,
  RotateCcw,
  Users,
  History,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from 'lucide-react';
import logoRajaAmpat from '@/assets/image/KKP-RajaAmpat.png';
import tribbleImage from '@/assets/image/tribble.png';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Ringkasan' },
  { to: '/tickets', icon: Ticket, label: 'Daftar Tiket' },
  { to: '/approval', icon: ClipboardCheck, label: 'Antrian Persetujuan' },
  { to: '/payments', icon: CreditCard, label: 'Pembayaran' },
  { to: '/tarif', icon: Tag, label: 'Tarif Layanan' },
  { to: '/gate', icon: DoorOpen, label: 'Monitor Gerbang' },
  { to: '/reports', icon: BarChart3, label: 'Laporan Keuangan' },
  { to: '/refunds', icon: RotateCcw, label: 'Pengembalian Dana' },
];

const adminItems = [
  { to: '/users', icon: Users, label: 'Manajemen Pengguna' },
  { to: '/logs', icon: History, label: 'Log Aktivitas' },
];







export function AdminSidebar({ className, mobileOpen = false, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const isCollapsed = collapsed && !mobileOpen;

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;
      if (mobileOpen) {
        _optionalChain([onMobileClose, 'optionalCall', _ => _()]);
      }
    }
  }, [location.pathname, mobileOpen, onMobileClose]);

  const handleMobileClose = () => {
    _optionalChain([onMobileClose, 'optionalCall', _2 => _2()]);
  };

  return (
    React.createElement(React.Fragment, null
      , React.createElement('div', {
        className: cn(
          'fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity md:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        ),
        onClick: handleMobileClose,
        'aria-hidden': "true", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
      )
      , React.createElement('aside', {
        className: cn(
          'relative flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-[width,transform] duration-300',
          'fixed inset-y-0 left-0 z-50 shadow-2xl md:static md:z-auto md:shadow-none',
          'w-[82vw] max-w-[320px] md:w-[260px]',
          isCollapsed && 'md:w-[72px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        ),
        style: { background: 'var(--gradient-sidebar)' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}

        /* Logo Section */
        , React.createElement('div', { className: "flex items-center gap-3 p-4 border-b border-sidebar-border"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
          , React.createElement('div', { className: cn('flex items-center gap-3 flex-1 min-w-0', isCollapsed && 'md:justify-center md:gap-0'), __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
            , React.createElement('div', {
              className: cn(
                'rounded-xl bg-white/95 ring-1 ring-white/25 p-1 shadow-sm',
                'h-12 w-12 md:h-12 md:w-12',
                isCollapsed && 'md:h-10 md:w-10 md:p-1'
              ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}

              , React.createElement('img', {
                src: logoRajaAmpat,
                alt: "Konservasi Raja Ampat"  ,
                className: "h-full w-full object-contain drop-shadow-sm"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
              )
            )
            , !isCollapsed && (
              React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                , React.createElement('h1', { className: "text-base font-bold text-white truncate leading-tight"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}, "KKP Raja Ampat"  )
                , React.createElement('p', { className: "text-[11px] text-sidebar-foreground/70 truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "Marine Park Fee"  )
              )
            )
          )
          , React.createElement('button', {
            type: "button",
            onClick: handleMobileClose,
            className: "md:hidden rounded-lg p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"     ,
            'aria-label': "Tutup sidebar" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}

            , React.createElement(X, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}} )
          )
        )

        , React.createElement('img', {
          src: tribbleImage,
          alt: "Tribble",
          className: "pointer-events-none absolute bottom-[-5px] w-[150px]" ,
          __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
        )

        /* Navigation */
        , React.createElement('nav', { className: "relative z-10 flex-1 overflow-y-auto custom-scrollbar py-4 px-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
          /* Main Nav */
          , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
            , !isCollapsed && (
              React.createElement('p', { className: "text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-4 mb-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Menu Utama"

              )
            )
            , navItems.map((item) => (
              React.createElement(NavLink, {
                key: item.to,
                to: item.to,
                className: ({ isActive }) => cn(
                  'nav-item',
                  isActive && 'active',
                  isCollapsed && 'justify-center px-2'
                ),
                title: isCollapsed ? item.label : undefined,
                onClick: handleMobileClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}

                , React.createElement(item.icon, { className: "w-5 h-5 flex-shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}} )
                , !isCollapsed && React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, item.label)
              )
            ))
          )

          /* Admin Section */
          , React.createElement('div', { className: "mt-6 space-y-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}
            , !isCollapsed && (
              React.createElement('p', { className: "text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-4 mb-2"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}, "Administrasi"

              )
            )
            , adminItems.map((item) => (
              React.createElement(NavLink, {
                key: item.to,
                to: item.to,
                className: ({ isActive }) => cn(
                  'nav-item',
                  isActive && 'active',
                  isCollapsed && 'justify-center px-2'
                ),
                title: isCollapsed ? item.label : undefined,
                onClick: handleMobileClose, __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}

                , React.createElement(item.icon, { className: "w-5 h-5 flex-shrink-0"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}} )
                , !isCollapsed && React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, item.label)
              )
            ))
          )
        )

        /* Collapse Toggle */
        , React.createElement('button', {
          type: "button",
          onClick: () => setCollapsed(!collapsed),
          className: "absolute -right-3 top-24 hidden md:flex bg-sidebar border border-sidebar-border rounded-full p-1.5 hover:bg-sidebar-accent transition-colors"           ,
          'aria-label': isCollapsed ? 'Perluas sidebar' : 'Perkecil sidebar', __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}

          , isCollapsed ? (
            React.createElement(ChevronRight, { className: "w-3.5 h-3.5 text-sidebar-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}} )
          ) : (
            React.createElement(ChevronLeft, { className: "w-3.5 h-3.5 text-sidebar-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}} )
          )
        )

        /* Logout Section */
        , React.createElement('div', { className: cn(
          'relative p-4 border-t border-sidebar-border',
          isCollapsed && 'md:flex md:justify-center'
        ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
          , React.createElement('button', {
            type: "button",
            className: cn(
              'relative z-10 flex w-full items-center gap-3 rounded-xl bg-white px-4 py-2.5 text-[#E53935] shadow-sm transition-colors hover:bg-white/90',
              isCollapsed && 'justify-center px-2'
            ),
            onClick: handleMobileClose,
            'aria-label': "Logout", __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}

            , React.createElement(LogOut, { className: "w-4 h-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}} )
            , !isCollapsed && React.createElement('span', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}, "Logout")
          )
        )
      )
    )
  );
}
