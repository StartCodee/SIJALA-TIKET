import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Ticket,
  ClipboardCheck,
  FileSearch,
  CreditCard,
  DoorOpen,
  BarChart3,
  RotateCcw,
  Users,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
} from 'lucide-react';
import logoRajaAmpat from '@/assets/logo-raja-ampat.png';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/tickets', icon: Ticket, label: 'Ticket List' },
  { to: '/approval', icon: ClipboardCheck, label: 'Approval Queue' },
  { to: '/payments', icon: CreditCard, label: 'Payments' },
  { to: '/gate', icon: DoorOpen, label: 'Gate Monitor' },
  { to: '/reports', icon: BarChart3, label: 'Finance Reports' },
  { to: '/refunds', icon: RotateCcw, label: 'Refund Center' },
];

const adminItems = [
  { to: '/users', icon: Users, label: 'User Management' },
  { to: '/logs', icon: History, label: 'Activity Logs' },
];

interface AdminSidebarProps {
  className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[260px]',
        className
      )}
      style={{ background: 'linear-gradient(180deg, hsl(210 55% 18%) 0%, hsl(210 60% 12%) 100%)' }}
    >
      {/* Logo Section */}
      <div className={cn(
        'flex items-center gap-3 p-4 border-b border-sidebar-border',
        collapsed && 'justify-center'
      )}>
        <img 
          src={logoRajaAmpat} 
          alt="Raja Ampat Conservation" 
          className={cn('transition-all duration-300', collapsed ? 'w-10 h-10' : 'w-12 h-12')}
        />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">Raja Ampat</h1>
            <p className="text-[10px] text-sidebar-foreground/60 truncate">Conservation Fee Admin</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3">
        {/* Main Nav */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2">
              Main Menu
            </p>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'nav-item',
                isActive && 'active',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {/* Admin Section */}
        <div className="mt-6 space-y-1">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-wider px-3 mb-2">
              Administration
            </p>
          )}
          {adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'nav-item',
                isActive && 'active',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-sidebar border border-sidebar-border rounded-full p-1.5 hover:bg-sidebar-accent transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-sidebar-foreground" />
        )}
      </button>

      {/* User Section */}
      <div className={cn(
        'p-4 border-t border-sidebar-border',
        collapsed && 'flex justify-center'
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-sidebar-primary">RH</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Rudi Hartono</p>
              <p className="text-[10px] text-sidebar-foreground/60">Super Admin</p>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
              <LogOut className="w-4 h-4 text-sidebar-foreground/60" />
            </button>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-sidebar-primary">RH</span>
          </div>
        )}
      </div>
    </aside>
  );
}
