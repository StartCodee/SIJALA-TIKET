import { ReactNode, useCallback, useMemo, useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/lib/utils';
import { AdminSidebarContext } from './AdminSidebarContext';

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);
  const contextValue = useMemo(
    () => ({
      mobileOpen,
      openMobile,
      closeMobile,
      toggleMobile,
    }),
    [mobileOpen, openMobile, closeMobile, toggleMobile]
  );

  return (
    <AdminSidebarContext.Provider value={contextValue}>
      <div className="flex h-screen w-full overflow-hidden bg-background ocean-pattern">
        <AdminSidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />
        <main className={cn('flex-1 flex min-h-0 min-w-0 flex-col overflow-hidden', className)}>
          {children}
        </main>
      </div>
    </AdminSidebarContext.Provider>
  );
}
