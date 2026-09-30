import React from 'react';
import { 
  Sun, 
  Moon, 
  LogOut, 
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { GlobalSearch } from './search/GlobalSearch';

export const Topbar: React.FC = () => {
  const { 
    theme, 
    setTheme,
    logout, 
    setIsMdmSimulatorOpen,
    onlineCount,
    devices
  } = useApp();

  return (
    <header className="h-14 border-b border-blue-100/90 bg-white/90 dark:border-slate-800/80 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Global Search Component: Search Devices, Users, Assets by Name or ID */}
      <GlobalSearch />

      {/* Right Action Utilities */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Live Ingest Status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 text-xs text-blue-700 dark:text-blue-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400" />
          </span>
          <span className="text-[11px] font-mono font-medium">Arohak MDM · {onlineCount}/{devices.length} Online</span>
        </div>

        {/* Android MDM Button */}
        <button
          onClick={() => setIsMdmSimulatorOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-slate-700"
          title="Open Android MDM Mobile Companion Simulator"
        >
          <Smartphone className="h-3.5 w-3.5 text-blue-600 dark:text-emerald-500" />
          <span className="hidden md:inline">Android Client</span>
        </button>

        {/* Dark & Light Theme Toggle (Blue & White Light Theme) */}
        <div className="flex items-center p-0.5 rounded-lg border border-blue-200/80 dark:border-slate-800 bg-blue-50/60 dark:bg-slate-800/80">
          <button
            onClick={() => setTheme('light')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
              theme === 'light'
                ? 'bg-white text-blue-600 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            )}
            title="Light Mode (Blue & White Combo)"
          >
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Light</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
              theme === 'dark'
                ? 'bg-slate-900 text-blue-400 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-200'
            )}
            title="Dark Mode"
          >
            <Moon className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Dark</span>
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Sign out of Arohak MDM console"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
