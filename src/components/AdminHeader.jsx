import { useState } from 'react';
import { Search, Bell, Calendar, ChevronDown, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAdminSidebar } from '@/components/AdminSidebarContext';

const dateFilters = [
  { label: 'Hari Ini', value: 'today' },
  { label: 'Minggu Ini', value: 'week' },
  { label: 'Bulan Ini', value: 'month' },
  { label: 'Rentang Kustom', value: 'custom' },
];

export function AdminHeader({
  title,
  subtitle,
  showSearch = true,
  showDateFilter = true,
  className,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('month');
  const { toggleMobile } = useAdminSidebar();

  return (
    <header className={cn('bg-card border-b border-border px-6 py-4', className)}>
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={toggleMobile}
            aria-label="Buka sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Global Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari ID Tiket, nama, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[280px] pl-9 h-9 bg-background border-border"
              />
            </div>
          )}

          {/* Date Filter */}
          {showDateFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {dateFilters.find((filter) => filter.value === selectedDateFilter)?.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                {dateFilters.map((filter) => (
                  <DropdownMenuItem
                    key={filter.value}
                    onClick={() => setSelectedDateFilter(filter.value)}
                    className={cn(
                      'cursor-pointer',
                      selectedDateFilter === filter.value && 'bg-accent'
                    )}
                  >
                    {filter.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
