import React from 'react';
import { 
  Laptop, 
  Package, 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  ArrowDownToLine
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const Sidebar: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    currentUser, 
    setRole, 
    flaggedCountToday, 
    setIsMdmSimulatorOpen,
    fileTransfers
  } = useApp();

  const navItems = [
    {
      route: '/devices',
      label: 'Devices',
      icon: Laptop,
      shortcut: 'G D',
      badge: flaggedCountToday > 0 ? `${flaggedCountToday}` : undefined,
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
    },
    {
      route: '/transfers',
      label: 'File Transfers',
      icon: ArrowDownToLine,
      shortcut: 'G T',
      badge: `${fileTransfers.length}`,
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
    },
    {
      route: '/assets',
      label: 'Assets',
      icon: Package,
      shortcut: 'G S'
    },
    {
      route: '/people',
      label: 'People',
      icon: Users,
      shortcut: 'G P'
    },
    {
      route: '/firewall',
      label: 'Firewall',
      icon: ShieldAlert,
      shortcut: 'G F',
      badge: 'Enforcing',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    },
    {
      route: '/admin',
      label: 'Admin',
      icon: ShieldCheck,
      shortcut: 'G A'
    }
  ];

  const isCurrentActive = (itemRoute: string) => {
    if (itemRoute === '/devices' && (currentRoute === '/devices' || currentRoute.startsWith('/devices/'))) return true;
    if (itemRoute === '/people' && (currentRoute === '/people' || currentRoute.startsWith('/people/'))) return true;
    return currentRoute === itemRoute;
  };

  return (
    <aside className="w-[232px] shrink-0 border-r border-blue-100/90 bg-white dark:border-slate-800/80 dark:bg-slate-900/90 backdrop-blur-md flex flex-col justify-between h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-14 px-5 flex items-center gap-2.5 border-b border-blue-100/90 dark:border-slate-800/80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs shadow-blue-500/25">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-slate-100">Arohak</span>
              <span className="text-xs font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-sm border border-blue-200/60 dark:border-blue-800/60">MDM</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase">Device Management</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map(item => {
            const active = isCurrentActive(item.route);
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => navigateTo(item.route)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer group text-left relative',
                  active
                    ? 'bg-blue-50/90 text-blue-950 dark:bg-blue-950/50 dark:text-blue-200 font-semibold shadow-2xs border border-blue-200/60 dark:border-blue-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50/40 dark:hover:bg-slate-800/50'
                )}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-600 rounded-r" />
                )}

                <div className="flex items-center gap-2.5">
                  <Icon className={cn('h-4 w-4', active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-slate-300')} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={cn('text-[10px] font-mono px-1.5 py-0.5 rounded-full', item.badgeColor)}>
                      {item.badge}
                    </span>
                  )}
                  <span className="hidden group-hover:inline-block text-[10px] text-slate-400 font-mono">
                    {item.shortcut}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile MDM Highlight */}
        <div className="px-3 pt-2">
          <div className="px-2 py-0.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Mobile MDM
          </div>
          <button
            onClick={() => setIsMdmSimulatorOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border border-blue-100 dark:border-slate-800 bg-blue-50/50 hover:bg-blue-100/60 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 text-blue-700 dark:text-blue-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Android Client</span>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-blue-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* User Identity Footer */}
      <div className="p-3 border-t border-blue-100/90 dark:border-slate-800/80 bg-blue-50/30 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-7 w-7 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center font-mono">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Role Pill Switcher */}
          <button
            onClick={() => setRole(currentUser.role === 'admin' ? 'viewer' : 'admin')}
            title="Click to toggle between Admin and Viewer role"
            className={cn(
              'text-[10px] uppercase font-mono px-2 py-0.5 rounded border tracking-wider transition-colors cursor-pointer',
              currentUser.role === 'admin'
                ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
            )}
          >
            {currentUser.role}
          </button>
        </div>
      </div>
    </aside>
  );
};
