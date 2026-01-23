import { createContext, useContext } from 'react';








export const AdminSidebarContext = createContext(null);

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error('useAdminSidebar must be used within AdminSidebarContext.Provider.');
  }
  return context;
}
