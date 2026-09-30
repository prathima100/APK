import React from 'react';
import { cn } from '../../lib/utils';

export interface StatProps {
  label: string;
  value: string | number;
  suffix?: string;
  hint?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const Stat: React.FC<StatProps> = ({
  label,
  value,
  suffix,
  hint,
  icon,
  trend,
  className
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900/90 shadow-xs flex flex-col justify-between',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          {label}
        </span>
        {icon && (
          <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-mono tabular-nums">
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{suffix}</span>
        )}
      </div>

      {(hint || trend) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {hint && <span>{hint}</span>}
          {trend && (
            <span
              className={cn(
                'font-medium tabular-nums ml-auto',
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
