import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { UserStatusChip, RoleBadge } from '@/components/StatusChip';
import { dummyAdminUsers, formatDateTime, formatShortId, type AdminUser } from '@/data/dummyData';
import {
  Search,
  Plus,
  Edit,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  Key,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Filter users
  const filteredUsers = dummyAdminUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: dummyAdminUsers.length,
    active: dummyAdminUsers.filter((u) => u.status === 'active').length,
    disabled: dummyAdminUsers.filter((u) => u.status === 'disabled').length,
  };

  const openEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Manajemen Pengguna"
        subtitle="Kelola akun admin dan izin peran"
        showSearch={false}
        showDateFilter={false}
      />

      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="card-ocean p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Pengguna</p>
              </div>
              <Shield className="w-8 h-8 text-primary/30" />
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-status-approved">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Aktif</p>
              </div>
              <UserCheck className="w-8 h-8 text-status-approved/30" />
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-status-rejected">{stats.disabled}</p>
                <p className="text-xs text-muted-foreground">Nonaktif</p>
              </div>
              <UserX className="w-8 h-8 text-status-rejected/30" />
            </div>
          </Card>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Peran" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua Peran</SelectItem>
              <SelectItem value="super_admin">Admin Utama</SelectItem>
              <SelectItem value="finance_admin">Admin Keuangan</SelectItem>
              <SelectItem value="approver_admin">Admin Persetujuan</SelectItem>
              <SelectItem value="viewer">Peninjau</SelectItem>
            </SelectContent>
          </Select>
          <Button className="btn-ocean gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" />
            Tambah Pengguna
          </Button>
        </div>

        {/* User Table */}
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Email</th>
                  <th>Peran</th>
                  <th>Status</th>
                  <th>Login Terakhir</th>
                  <th>Dibuat Pada</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{formatShortId(user.id)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{user.email}</td>
                    <td>
                      <RoleBadge role={user.role} />
                    </td>
                    <td>
                      <UserStatusChip status={user.status} />
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {formatDateTime(user.lastLogin)}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {formatDateTime(user.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem
                              className="gap-2 cursor-pointer"
                              onClick={() => openEdit(user)}
                            >
                              <Edit className="w-4 h-4" />
                              Ubah Pengguna
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Key className="w-4 h-4" />
                              Atur Ulang Sandi
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <DropdownMenuItem className="gap-2 cursor-pointer text-status-rejected">
                                <UserX className="w-4 h-4" />
                                Nonaktifkan Pengguna
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="gap-2 cursor-pointer text-status-approved">
                                <UserCheck className="w-4 h-4" />
                                Aktifkan Pengguna
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Permission Matrix
        <Card className="card-ocean mt-6">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Matriks Izin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Izin</th>
                    <th className="text-center py-2 font-medium">Admin Utama</th>
                    <th className="text-center py-2 font-medium">Admin Keuangan</th>
                    <th className="text-center py-2 font-medium">Admin Persetujuan</th>
                    <th className="text-center py-2 font-medium">Peninjau</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { perm: 'Lihat Dasbor', super: true, finance: true, approver: true, viewer: true },
                    { perm: 'Lihat Tiket', super: true, finance: true, approver: true, viewer: true },
                    { perm: 'Setujui/Tolak Tiket', super: true, finance: false, approver: true, viewer: false },
                    { perm: 'Proses Pengembalian Dana', super: true, finance: true, approver: false, viewer: false },
                    { perm: 'Lihat Laporan Keuangan', super: true, finance: true, approver: false, viewer: true },
                    { perm: 'Ekspor Data', super: true, finance: true, approver: true, viewer: false },
                    { perm: 'Kelola Pengguna', super: true, finance: false, approver: false, viewer: false },
                    { perm: 'Lihat Log Aktivitas', super: true, finance: true, approver: true, viewer: true },
                    { perm: 'Ubah Hasil OCR', super: true, finance: false, approver: true, viewer: false },
                    { perm: 'Ubah Pengaturan', super: true, finance: false, approver: false, viewer: false },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-2 text-muted-foreground">{row.perm}</td>
                      <td className="text-center py-2">
                        {row.super ? (
                          <span className="text-status-approved">✓</span>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                      <td className="text-center py-2">
                        {row.finance ? (
                          <span className="text-status-approved">✓</span>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                      <td className="text-center py-2">
                        {row.approver ? (
                          <span className="text-status-approved">✓</span>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                      <td className="text-center py-2">
                        {row.viewer ? (
                          <span className="text-status-approved">✓</span>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>Tambahkan admin baru ke sistem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input placeholder="Budi Santoso" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="budi@rajaampat.go.id" />
            </div>
            <div className="space-y-2">
              <Label>Peran</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih peran" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="super_admin">Admin Utama</SelectItem>
                  <SelectItem value="finance_admin">Admin Keuangan</SelectItem>
                  <SelectItem value="approver_admin">Admin Persetujuan</SelectItem>
                  <SelectItem value="viewer">Peninjau/Auditor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Batal
            </Button>
            <Button className="btn-ocean gap-2">
              <Mail className="w-4 h-4" />
              Kirim Undangan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Ubah Pengguna</DialogTitle>
            <DialogDescription>Ubah informasi pengguna</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input defaultValue={selectedUser.name} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={selectedUser.email} />
              </div>
              <div className="space-y-2">
                <Label>Peran</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="super_admin">Admin Utama</SelectItem>
                    <SelectItem value="finance_admin">Admin Keuangan</SelectItem>
                    <SelectItem value="approver_admin">Admin Persetujuan</SelectItem>
                    <SelectItem value="viewer">Peninjau/Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Batal
            </Button>
            <Button className="btn-ocean">Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
