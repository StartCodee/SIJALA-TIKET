import React from "react";
const _jsxFileName = "src\\pages\\ProfilePage.tsx";import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Key, Mail, User } from 'lucide-react';

export default function ProfilePage() {
  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
      , React.createElement(AdminHeader, {
        title: "Profil Akun" ,
        subtitle: "Perbarui data profil dan keamanan akun"     ,
        showSearch: false,
        showDateFilter: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
        , React.createElement('form', { className: "space-y-6", onSubmit: (event) => event.preventDefault(), __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
          , React.createElement('div', { className: "grid grid-cols-1 gap-6 xl:grid-cols-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
            , React.createElement(Card, { className: "card-ocean xl:col-span-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
              , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
                , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "Foto Profil" )
                , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 26}}, "Perbarui foto agar akun mudah dikenali."     )
              )
              , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}
                , React.createElement('div', { className: "flex items-center gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
                  , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
                    , React.createElement(Avatar, { className: "h-20 w-20 ring-2 ring-primary/20"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
                      , React.createElement(AvatarFallback, { className: "bg-primary/10 text-primary text-xl font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, "RH")
                    )
                    , React.createElement('div', { className: "absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
                      , React.createElement(Camera, { className: "h-4 w-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} )
                    )
                  )
                  , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}
                    , React.createElement(Label, { htmlFor: "photo", __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}, "Unggah Foto" )
                    , React.createElement(Input, { id: "photo", type: "file", accept: "image/*", className: "mt-2 bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}} )
                    , React.createElement('p', { className: "mt-2 text-xs text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}, "PNG/JPG, maksimal 2MB."  )
                  )
                )
                , React.createElement('div', { className: "rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}, "Pastikan wajah jelas dan latar belakang netral."

                )
              )
            )

            , React.createElement('div', { className: "space-y-6 xl:col-span-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
              , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
                , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
                  , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, "Informasi Akun" )
                  , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Perbarui nama dan email yang digunakan."     )
                )
                , React.createElement(CardContent, { className: "grid gap-4 md:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
                    , React.createElement(Label, { htmlFor: "name", __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, "Nama")
                    , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
                      , React.createElement(User, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} )
                      , React.createElement(Input, { id: "name", defaultValue: "Rudi Hartono" , className: "bg-background pl-9" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}} )
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
                    , React.createElement(Label, { htmlFor: "email", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Email")
                    , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
                      , React.createElement(Mail, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} )
                      , React.createElement(Input, {
                        id: "email",
                        type: "email",
                        defaultValue: "rudi.hartono@kkp.go.id",
                        className: "bg-background pl-9" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
                      )
                    )
                  )
                )
              )

              , React.createElement(Card, { className: "card-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
                , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
                  , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}, "Keamanan")
                  , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, "Ganti password untuk menjaga keamanan akun."     )
                )
                , React.createElement(CardContent, { className: "grid gap-4 md:grid-cols-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
                  , React.createElement('div', { className: "space-y-2 md:col-span-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
                    , React.createElement(Label, { htmlFor: "current-password", __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "Password Saat Ini"  )
                    , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
                      , React.createElement(Key, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}} )
                      , React.createElement(Input, {
                        id: "current-password",
                        type: "password",
                        placeholder: "Masukkan password saat ini"   ,
                        className: "bg-background pl-9" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
                      )
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
                    , React.createElement(Label, { htmlFor: "new-password", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, "Password Baru" )
                    , React.createElement(Input, {
                      id: "new-password",
                      type: "password",
                      placeholder: "Minimal 8 karakter"  ,
                      className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
                    , React.createElement(Label, { htmlFor: "confirm-password", __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, "Konfirmasi Password" )
                    , React.createElement(Input, {
                      id: "confirm-password",
                      type: "password",
                      placeholder: "Ulangi password baru"  ,
                      className: "bg-background", __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
                    )
                  )
                  , React.createElement('div', { className: "rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground md:col-span-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}, "Gunakan kombinasi huruf besar, kecil, angka, dan simbol untuk keamanan lebih baik."

                  )
                )
              )
            )
          )

          , React.createElement('div', { className: "flex items-center justify-end gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
            , React.createElement(Button, { type: "button", variant: "outline", __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, "Batal"

            )
            , React.createElement(Button, { type: "submit", className: "btn-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}, "Simpan Perubahan"

            )
          )
        )
      )
    )
  );
}
