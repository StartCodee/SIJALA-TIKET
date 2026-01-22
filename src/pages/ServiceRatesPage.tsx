import { useMemo, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

type FeeItem = {
  id: string;
  label: string;
  price: number;
};

export default function ServiceRatesPage() {
  const initialItems = useMemo<FeeItem[]>(
    () =>
      Object.entries(FEE_PRICING).map(([key, value]) => ({
        id: key,
        label: value.label,
        price: value.price,
      })),
    []
  );

  const [items, setItems] = useState<FeeItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [editItem, setEditItem] = useState<FeeItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<FeeItem | null>(null);
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

  const openEdit = (item: FeeItem) => {
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

  const generateId = (label: string) => {
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
    const nextItem: FeeItem = {
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
    <AdminLayout>
      <AdminHeader
        title="Tarif Layanan"
        subtitle="Daftar harga layanan konservasi"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Button className="btn-ocean gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" />
            Tambah Tarif
          </Button>
        </div>

        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kategori Layanan</th>
                  <th className="text-right">Harga</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="text-sm font-medium">{item.label}</span>
                    </td>
                    <td className="text-right">
                      <span className="text-sm font-semibold">{formatRupiah(item.price)}</span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="gap-2 bg-status-pending hover:bg-status-pending/90 text-white"
                          onClick={() => openEdit(item)}
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2 bg-status-rejected hover:bg-status-rejected/90 text-white"
                          onClick={() => setDeleteItem(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-sm text-muted-foreground py-8">
                      Belum ada tarif yang tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Ubah Tarif Layanan</DialogTitle>
            <DialogDescription>Perbarui nama layanan dan harga tarif.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Layanan</label>
              <Input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga</label>
              <Input
                type="text"
                inputMode="numeric"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="Contoh: 150000"
              />
              <p className="text-xs text-muted-foreground">
                Format tampilan: {editPrice ? formatRupiah(Number(editPrice.replace(/[^\d]/g, ''))) : '-'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Batal
            </Button>
            <Button className="btn-ocean" onClick={saveEdit}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Tambah Tarif Layanan</DialogTitle>
            <DialogDescription>Masukkan nama layanan dan harga tarif.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Layanan</label>
              <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Harga</label>
              <Input
                type="text"
                inputMode="numeric"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Contoh: 150000"
              />
              <p className="text-xs text-muted-foreground">
                Format tampilan: {newPrice ? formatRupiah(Number(newPrice.replace(/[^\d]/g, ''))) : '-'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button className="btn-ocean" onClick={handleAdd}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Tarif</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus tarif layanan dari daftar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-status-rejected hover:bg-status-rejected/90 text-white" onClick={confirmDelete}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
