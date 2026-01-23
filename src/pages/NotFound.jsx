import React from "react";
const _jsxFileName = "src\\pages\\NotFound.tsx";import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("Error 404: Pengguna mencoba mengakses rute yang tidak ada:", location.pathname);
  }, [location.pathname]);

  return (
    React.createElement('div', { className: "flex min-h-screen items-center justify-center bg-muted"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
      , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
        , React.createElement('h1', { className: "mb-4 text-4xl font-bold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}, "404")
        , React.createElement('p', { className: "mb-4 text-xl text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}, "Ups! Halaman tidak ditemukan"   )
        , React.createElement('a', { href: "/", className: "text-primary underline hover:text-primary/90"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}, "Kembali ke Beranda"

        )
      )
    )
  );
};

export default NotFound;
