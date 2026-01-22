import { createContext, useContext } from 'react';

export interface AdminSidebarContextValue {
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

export const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null);

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarContext.Provider.');
  }
  return context;
}
