import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-muted',
    iconColor: 'text-muted-foreground',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  success: {
    iconBg: 'bg-status-approved-bg',
    iconColor: 'text-status-approved',
  },
  warning: {
    iconBg: 'bg-status-pending-bg',
    iconColor: 'text-status-pending',
  },
  danger: {
    iconBg: 'bg-status-rejected-bg',
    iconColor: 'text-status-rejected',
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: KPICardProps) {
  const styles = variantStyles[variant];
  
  const TrendIcon = trend 
    ? trend.value > 0 
      ? TrendingUp 
      : trend.value < 0 
        ? TrendingDown 
        : Minus
    : null;
  
  const trendColor = trend
    ? trend.value > 0
      ? 'text-status-approved'
      : trend.value < 0
        ? 'text-status-rejected'
        : 'text-muted-foreground'
    : '';

  return (
    <div className={cn('kpi-card group', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {trend && TrendIcon && (
            <div className={cn('flex items-center gap-1 mt-2', trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          'flex-shrink-0 p-3 rounded-xl transition-transform duration-300 group-hover:scale-110',
          styles.iconBg
        )}>
          <Icon className={cn('w-5 h-5', styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}

// Mini KPI for inline stats
interface MiniKPIProps {
  label: string;
  value: string | number;
  className?: string;
}

export function MiniKPI({ label, value, className }: MiniKPIProps) {
  return (
    <div className={cn('text-center', className)}>
      <p className="text-xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
