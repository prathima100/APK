import React from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DeviceFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: 'all' | 'online' | 'offline';
  onStatusFilterChange: (val: 'all' | 'online' | 'offline') => void;
  flaggedOnly: boolean;
  onFlaggedOnlyChange: (val: boolean) => void;
}

export const DeviceFilters: React.FC<DeviceFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  flaggedOnly,
  onFlaggedOnlyChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter by hostname, model, or employee..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      {/* Segmented Controls & Flagged Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status segmented control */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={cn(
              'px-2.5 py-1 font-medium rounded-md transition-all cursor-pointer',
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('online')}
            className={cn(
              'px-2.5 py-1 font-medium rounded-md transition-all cursor-pointer',
              statusFilter === 'online'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            Online
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('offline')}
            className={cn(
              'px-2.5 py-1 font-medium rounded-md transition-all cursor-pointer',
              statusFilter === 'offline'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            )}
          >
            Offline
          </button>
        </div>

        {/* Flagged Only Checkbox Button */}
        <button
          type="button"
          onClick={() => onFlaggedOnlyChange(!flaggedOnly)}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer',
            flaggedOnly
              ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300 font-semibold'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          <span>Flagged Only</span>
        </button>
      </div>
    </div>
  );
};
