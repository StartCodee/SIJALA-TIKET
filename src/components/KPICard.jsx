import React from "react";
const _jsxFileName = "src\\components\\KPICard.tsx";import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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
  brand: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendCompact = false,
  trendUseStatusColor = false,
  variant = 'default',
  className,
}) {
  const styles = variantStyles[variant];
  
  const TrendIcon = trend 
    ? trend.value > 0 
      ? TrendingUp 
      : trend.value < 0 
        ? TrendingDown 
        : Minus
    : null;
  
  const trendColor = trend
    ? trendUseStatusColor
      ? trend.value > 0
        ? 'text-status-approved'
        : trend.value < 0
          ? 'text-status-rejected'
          : 'text-muted-foreground'
      : variant === 'brand'
        ? 'text-primary'
        : trend.value > 0
          ? 'text-status-approved'
          : trend.value < 0
            ? 'text-status-rejected'
            : 'text-muted-foreground'
    : '';

  const trendValueText = trend
    ? trend.display || `${trend.value > 0 ? '+' : ''}${trend.value}%`
    : '';

  return (
    React.createElement('div', { className: cn('kpi-card group min-w-0', className), __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
      , React.createElement('div', { className: "flex items-center justify-between gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
        , React.createElement('p', { className: "text-sm font-medium text-muted-foreground leading-snug break-words"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
          , title
        )
        , React.createElement('div', {
          className: cn(
            'flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center',
            styles.iconBg
          ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}

          , React.createElement(Icon, { className: cn('w-5 h-5', styles.iconColor), strokeWidth: 1.75, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}} )
        )
      )
      , React.createElement('p', { className: "mt-2 text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-tight break-words"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
        , value
      )
      , subtitle && (
        React.createElement('p', { className: "mt-1 text-xs text-muted-foreground break-words"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
          , subtitle
        )
      )
      , trend && TrendIcon && (
        React.createElement('div', { className: cn('flex items-center gap-1 mt-2', trendColor), __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
          , React.createElement(TrendIcon, { className: "w-3.5 h-3.5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}} )
          , React.createElement('span', { className: trendCompact ? "text-[10px] font-medium" : "text-xs font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
            , trendValueText
          )
          , (!trendCompact && trend.label)
            ? React.createElement('span', { className: "text-xs text-muted-foreground ml-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}
              , trend.label
            )
            : null
        )
      )
    )
  );
}

export function MiniKPI({ label, value, className }) {
  return (
    React.createElement('div', { className: cn('text-center', className), __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}
      , React.createElement('p', { className: "text-xl font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, value)
      , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, label)
    )
  );
}
