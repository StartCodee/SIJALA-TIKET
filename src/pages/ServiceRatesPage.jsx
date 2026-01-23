import React from "react";
const _jsxFileName = "src\\pages\\ServiceRatesPage.tsx";import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Search, Plus } from 'lucide-react';
import { FEE_PRICING, formatRupiah } from '@/data/dummyData';







export default function ServiceRatesPage() {
  const initialItems = useMemo(
    () =>
      Object.entries(FEE_PRICING).map(([key, value]) => ({
        id: key,
        label: value.label,
        price: value.price,
      })),
    []
  );

  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return item.label.toLowerCase().includes(query);
  });

  const openEdit = (item) => {
    setEditItem(item);
    setEditLabel(item.label);
    setEditPrice(item.price.toString());
  };

  const saveEdit = () => {
    if (!editItem) return;
    const nextPrice = Number(editPrice.replace(/[^\d]/g, ''));
    setItems((prev) =>
      prev.map((item) =>
        item.id === editItem.id
          ? {
              ...item,
              label: editLabel.trim() || item.label,
              price: Number.isFinite(nextPrice) && nextPrice > 0 ? nextPrice : item.price,
            }
          : item
      )
    );
    setEditItem(null);
  };

  const generateId = (label) => {
    const base = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    let nextId = base || `tarif_${items.length + 1}`;
    let counter = 1;
    while (items.some((item) => item.id === nextId)) {
      counter += 1;
      nextId = `${base || 'tarif'}_${counter}`;
    }
    return nextId;
  };

  const handleAdd = () => {
    const trimmedLabel = newLabel.trim();
    if (!trimmedLabel) return;
    const nextPrice = Number(newPrice.replace(/[^\d]/g, ''));
    if (!Number.isFinite(nextPrice) || nextPrice <= 0) return;
    const nextItem = {
      id: generateId(trimmedLabel),
      label: trimmedLabel,
      price: nextPrice,
    };
    setItems((prev) => [...prev, nextItem]);
    setShowAddDialog(false);
    setNewLabel('');
    setNewPrice('');
  };
  const confirmDelete = () => {
    if (!deleteItem) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteItem.id));
    setDeleteItem(null);
  };

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
      , React.createElement(AdminHeader, {
        title: "Tarif Layanan" ,
        subtitle: "Daftar harga layanan konservasi"   ,
        showSearch: false,
        showDateFilter: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
        , React.createElement('div', { className: "flex flex-wrap items-center justify-between gap-4 mb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
          , React.createElement('div', { className: "relative flex-1 max-w-md"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}} )
            , React.createElement(Input, {
              placeholder: "Cari nama layanan..."  ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 132}}
            )
          )
          , React.createElement(Button, { className: "btn-ocean gap-2" , onClick: () => setShowAddDialog(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
            , React.createElement(Plus, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}} ), "Tambah Tarif"

          )
        )

        , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}
          , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
            , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}, "Kategori Layanan" )
                  , React.createElement('th', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}, "Harga")
                  , React.createElement('th', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}, "Aksi")
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
                , filteredItems.map((item) => (
                  React.createElement('tr', { key: item.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                      , React.createElement('span', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}, item.label)
                    )
                    , React.createElement('td', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                      , React.createElement('span', { className: "text-sm font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}, formatRupiah(item.price))
                    )
                    , React.createElement('td', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}
                      , React.createElement('div', { className: "flex items-center justify-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
                        , React.createElement(Button, {
                          size: "sm",
                          className: "gap-2 bg-status-pending hover:bg-status-pending/90 text-white"   ,
                          onClick: () => openEdit(item), __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}

                          , React.createElement(Pencil, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}} ), "Edit"

                        )
                        , React.createElement(Button, {
                          size: "sm",
                          className: "gap-2 bg-status-rejected hover:bg-status-rejected/90 text-white"   ,
                          onClick: () => setDeleteItem(item), __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}

                          , React.createElement(Trash2, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}} ), "Hapus"

                        )
                      )
                    )
                  )
                ))
                , filteredItems.length === 0 && (
                  React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                    , React.createElement('td', { colSpan: 3, className: "text-center text-sm text-muted-foreground py-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, "Belum ada tarif yang tersedia."

                    )
                  )
                )
              )
            )
          )
        )
      )

      , React.createElement(Dialog, { open: !!editItem, onOpenChange: (open) => !open && setEditItem(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
        , React.createElement(DialogContent, { className: "bg-card border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}
          , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 201}}
            , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}, "Ubah Tarif Layanan"  )
            , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}, "Perbarui nama layanan dan harga tarif."     )
          )
          , React.createElement('div', { className: "space-y-4 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
              , React.createElement('label', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}, "Nama Layanan" )
              , React.createElement(Input, { value: editLabel, onChange: (e) => setEditLabel(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}} )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
              , React.createElement('label', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}, "Harga")
              , React.createElement(Input, {
                type: "text",
                inputMode: "numeric",
                value: editPrice,
                onChange: (e) => setEditPrice(e.target.value),
                placeholder: "Contoh: 150000" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
              )
              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}, "Format tampilan: "
                  , editPrice ? formatRupiah(Number(editPrice.replace(/[^\d]/g, ''))) : '-'
              )
            )
          )
          , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
            , React.createElement(Button, { variant: "outline", onClick: () => setEditItem(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}, "Batal"

            )
            , React.createElement(Button, { className: "btn-ocean", onClick: saveEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}, "Simpan"

            )
          )
        )
      )

      , React.createElement(Dialog, { open: showAddDialog, onOpenChange: setShowAddDialog, __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
        , React.createElement(DialogContent, { className: "bg-card border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
          , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
            , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}, "Tambah Tarif Layanan"  )
            , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}, "Masukkan nama layanan dan harga tarif."     )
          )
          , React.createElement('div', { className: "space-y-4 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
              , React.createElement('label', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}, "Nama Layanan" )
              , React.createElement(Input, { value: newLabel, onChange: (e) => setNewLabel(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}} )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}
              , React.createElement('label', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}, "Harga")
              , React.createElement(Input, {
                type: "text",
                inputMode: "numeric",
                value: newPrice,
                onChange: (e) => setNewPrice(e.target.value),
                placeholder: "Contoh: 150000" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
              )
              , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}, "Format tampilan: "
                  , newPrice ? formatRupiah(Number(newPrice.replace(/[^\d]/g, ''))) : '-'
              )
            )
          )
          , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}
            , React.createElement(Button, { variant: "outline", onClick: () => setShowAddDialog(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}, "Batal"

            )
            , React.createElement(Button, { className: "btn-ocean", onClick: handleAdd, __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}, "Simpan"

            )
          )
        )
      )

      , React.createElement(AlertDialog, { open: !!deleteItem, onOpenChange: (open) => !open && setDeleteItem(null), __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
        , React.createElement(AlertDialogContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
          , React.createElement(AlertDialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
            , React.createElement(AlertDialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}, "Hapus Tarif" )
            , React.createElement(AlertDialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}, "Tindakan ini akan menghapus tarif layanan dari daftar."

            )
          )
          , React.createElement(AlertDialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
            , React.createElement(AlertDialogCancel, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}, "Batal")
            , React.createElement(AlertDialogAction, { className: "bg-status-rejected hover:bg-status-rejected/90 text-white"  , onClick: confirmDelete, __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}, "Hapus"

            )
          )
        )
      )
    )
  );
}
