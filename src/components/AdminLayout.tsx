import { ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AdminLayout({ children, className }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background ocean-pattern">
      <AdminSidebar />
      <main className={cn('flex-1 flex flex-col min-w-0 overflow-hidden', className)}>
        {children}
      </main>
    </div>
  );
}
