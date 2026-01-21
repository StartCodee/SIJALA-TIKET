import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { UserStatusChip, RoleBadge } from '@/components/StatusChip';
import { dummyAdminUsers, formatDateTime, ROLE_LABELS, type AdminUser } from '@/data/dummyData';
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
import { cn } from '@/lib/utils';

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
        title="User Management"
        subtitle="Kelola akun admin dan role permissions"
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
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
              <Shield className="w-8 h-8 text-primary/30" />
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-status-approved">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <UserCheck className="w-8 h-8 text-status-approved/30" />
            </div>
          </Card>
          <Card className="card-ocean p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-status-rejected">{stats.disabled}</p>
                <p className="text-xs text-muted-foreground">Disabled</p>
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
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="finance_admin">Finance Admin</SelectItem>
              <SelectItem value="approver_admin">Approver Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Button className="btn-ocean gap-2" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* User Table */}
        <Card className="card-ocean overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Created</th>
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
                          <p className="text-xs text-muted-foreground">{user.id}</p>
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
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Key className="w-4 h-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === 'active' ? (
                              <DropdownMenuItem className="gap-2 cursor-pointer text-status-rejected">
                                <UserX className="w-4 h-4" />
                                Disable User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="gap-2 cursor-pointer text-status-approved">
                                <UserCheck className="w-4 h-4" />
                                Enable User
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

        {/* Permission Matrix */}
        <Card className="card-ocean mt-6">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium">Permission</th>
                    <th className="text-center py-2 font-medium">Super Admin</th>
                    <th className="text-center py-2 font-medium">Finance Admin</th>
                    <th className="text-center py-2 font-medium">Approver Admin</th>
                    <th className="text-center py-2 font-medium">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { perm: 'View Dashboard', super: true, finance: true, approver: true, viewer: true },
                    { perm: 'View Tickets', super: true, finance: true, approver: true, viewer: true },
                    { perm: 'Approve/Reject Tickets', super: true, finance: false, approver: true, viewer: false },
                    { perm: 'Process Refunds', super: true, finance: true, approver: false, viewer: false },
                    { perm: 'View Finance Reports', super: true, finance: true, approver: false, viewer: true },
                    { perm: 'Export Data', super: true, finance: true, approver: true, viewer: false },
                    { perm: 'Manage Users', super: true, finance: false, approver: false, viewer: false },
                    { perm: 'View Audit Logs', super: true, finance: true, approver: true, viewer: true },
                    { perm: 'Override OCR', super: true, finance: false, approver: true, viewer: false },
                    { perm: 'Change Settings', super: true, finance: false, approver: false, viewer: false },
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
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Tambahkan admin user baru ke sistem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="john@rajaampat.go.id" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="finance_admin">Finance Admin</SelectItem>
                  <SelectItem value="approver_admin">Approver Admin</SelectItem>
                  <SelectItem value="viewer">Viewer/Auditor</SelectItem>
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
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit informasi user</DialogDescription>
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
                <Label>Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="finance_admin">Finance Admin</SelectItem>
                    <SelectItem value="approver_admin">Approver Admin</SelectItem>
                    <SelectItem value="viewer">Viewer/Auditor</SelectItem>
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
