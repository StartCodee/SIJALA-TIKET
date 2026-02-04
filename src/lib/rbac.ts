export type UserRole =
  | 'administrator'
  | 'admin'
  | 'admin_utama'
  | 'admin_tiket'
  | 'petugas_tiket'
  | 'staff'
  | 'viewer'
  | 'finance'
  | string;

export function getUserRole(): UserRole {
  // Sesuaikan dengan sistem auth kamu. Ini fallback yang aman.
  return (localStorage.getItem('role') || 'viewer') as UserRole;
}

export function isAdministrator(role?: UserRole): boolean {
  const r = role || getUserRole();
  return r === 'administrator' || r === 'admin' || r === 'admin_utama';
}
