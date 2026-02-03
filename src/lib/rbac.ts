export type UserRole = 'administrator' | 'admin' | 'staff' | 'viewer' | 'finance' | string;

export function getUserRole(): UserRole {
  // Sesuaikan dengan sistem auth kamu. Ini fallback yang aman.
  return (localStorage.getItem('role') || 'viewer') as UserRole;
}

export function isAdministrator(role?: UserRole): boolean {
  const r = role || getUserRole();
  return r === 'administrator' || r === 'admin';
}
