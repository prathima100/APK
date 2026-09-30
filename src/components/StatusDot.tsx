import React from 'react';
import { cn } from '../lib/utils';

export interface StatusDotProps {
  status?: 'online' | 'offline' | 'afk' | 'flagged';
  className?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({ status = 'online', className }) => {
  if (status === 'online') {
    return (
      <span className={cn('relative flex h-2.5 w-2.5 shrink-0', className)} title="Online & Active">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 duration-1000" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-emerald-500/20" />
      </span>
    );
  }

  if (status === 'afk') {
    return (
      <span className={cn('relative flex h-2.5 w-2.5 shrink-0', className)} title="Idle / Away from Keyboard">
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-2 ring-amber-500/20" />
      </span>
    );
  }

  if (status === 'flagged') {
    return (
      <span className={cn('relative flex h-2.5 w-2.5 shrink-0', className)} title="Suspicious Activity Flagged">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-80" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-rose-500/30" />
      </span>
    );
  }

  return (
    <span className={cn('relative flex h-2.5 w-2.5 shrink-0', className)} title="Offline">
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-400 dark:bg-slate-600" />
    </span>
  );
};
