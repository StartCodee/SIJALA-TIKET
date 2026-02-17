import React from "react";
const _jsxFileName = "src\\components\\AdminLayout.tsx";import { useCallback, useMemo, useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/lib/utils';
import { AdminSidebarContext } from './AdminSidebarContext';






export function AdminLayout({ children, className }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const contextValue = useMemo(
    () => ({
      mobileOpen,
      openMobile,
      closeMobile,
      toggleMobile,
    }),
    [mobileOpen, openMobile, closeMobile, toggleMobile]
  );

  return (
    React.createElement(AdminSidebarContext.Provider, { value: contextValue, __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
      , React.createElement('div', { className: "flex h-screen w-full overflow-hidden bg-background ocean-pattern"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
        , React.createElement(AdminSidebar, { mobileOpen: mobileOpen, onMobileClose: closeMobile, __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}} )
        , React.createElement('main', { className: cn('flex-1 flex min-h-0 min-w-0 flex-col overflow-hidden', className), __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
          , children
          , React.createElement('footer', { className: "mt-auto px-6 py-3 text-xs text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
            , React.createElement('a', {
              href: "https://lokaspasia.com",
              target: "_blank",
              rel: "noreferrer",
              className: "inline-flex w-full items-center justify-center gap-1 text-[#0d1930] hover:underline"    ,
              __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
              , "\u00A9 2026 BLUD UPTD Kep. Raja Ampat Tiket Ver.1.0 | Loka Spasial Nusantara"
            )
          )
        )
      )
    )
  );
}

