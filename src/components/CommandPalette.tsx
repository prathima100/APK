import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Laptop, 
  Package, 
  Users, 
  ShieldAlert, 
  ShieldCheck, 
  Smartphone,
  Sun,
  Moon,
  ArrowRight,
  ArrowDownToLine
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusDot } from './StatusDot';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    navigateTo, 
    devices, 
    people,
    assets,
    theme,
    toggleTheme,
    setIsMdmSimulatorOpen
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredDevices = devices.filter(d => 
    d.hostname.toLowerCase().includes(cleanQuery) || 
    d.id.toLowerCase().includes(cleanQuery) ||
    d.serial_number.toLowerCase().includes(cleanQuery) ||
    d.owner_name.toLowerCase().includes(cleanQuery) ||
    d.owner_email.toLowerCase().includes(cleanQuery)
  );

  const filteredPeople = people.filter(p =>
    p.full_name.toLowerCase().includes(cleanQuery) ||
    p.id.toLowerCase().includes(cleanQuery) ||
    p.email.toLowerCase().includes(cleanQuery) ||
    p.role.toLowerCase().includes(cleanQuery)
  );

  const filteredAssets = assets.filter(a =>
    a.device_name.toLowerCase().includes(cleanQuery) ||
    a.id.toLowerCase().includes(cleanQuery) ||
    a.serial_number.toLowerCase().includes(cleanQuery) ||
    a.model.toLowerCase().includes(cleanQuery) ||
    a.assigned_owner.toLowerCase().includes(cleanQuery)
  );

  const handleSelectPage = (route: string) => {
    navigateTo(route);
    setIsCommandPaletteOpen(false);
  };

  const handleSelectDevice = (id: string) => {
    navigateTo(`/devices/${id}`, { deviceId: id });
    setIsCommandPaletteOpen(false);
  };

  const handleSelectPerson = (id: string) => {
    navigateTo(`/people/${id}`, { personId: id });
    setIsCommandPaletteOpen(false);
  };

  const handleSelectAsset = (id: string) => {
    navigateTo('/assets');
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCommandPaletteOpen(false)} 
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-4 w-4 text-blue-500 dark:text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search devices, users, assets by name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none"
          />
          <kbd className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Quick Navigation Pages */}
          {!query && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Workspace Pages
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {[
                  { label: 'Devices Fleet', route: '/devices', icon: Laptop },
                  { label: 'File Transfers', route: '/transfers', icon: ArrowDownToLine },
                  { label: 'Hardware Assets', route: '/assets', icon: Package },
                  { label: 'People & Teams', route: '/people', icon: Users },
                  { label: 'Network Firewall', route: '/firewall', icon: ShieldAlert },
                  { label: 'Compliance & Audit', route: '/admin', icon: ShieldCheck }
                ].map(item => (
                  <button
                    key={item.route}
                    onClick={() => handleSelectPage(item.route)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    <item.icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Devices */}
          {filteredDevices.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Devices</span>
                <span className="font-mono text-[10px]">{filteredDevices.length} matched</span>
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredDevices.slice(0, 4).map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleSelectDevice(d.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <StatusDot status={d.status} />
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{d.hostname}</span>
                        <span className="text-[10px] font-mono text-slate-400 ml-1.5 px-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{d.id}</span>
                        <span className="text-slate-400 ml-2">({d.owner_name})</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{d.platform}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick People */}
          {filteredPeople.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>People & Users</span>
                <span className="font-mono text-[10px]">{filteredPeople.length} matched</span>
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredPeople.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPerson(p.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-5 w-5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-semibold flex items-center justify-center">
                        {p.avatar_initials}
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{p.full_name}</span>
                        <span className="text-[10px] font-mono text-slate-400 ml-1.5 px-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{p.id}</span>
                        <span className="text-slate-400 ml-2">· {p.role}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Assets */}
          {filteredAssets.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Hardware Assets</span>
                <span className="font-mono text-[10px]">{filteredAssets.length} matched</span>
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredAssets.slice(0, 4).map(a => (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAsset(a.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <div>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{a.device_name}</span>
                        <span className="text-[10px] font-mono text-slate-400 ml-1.5 px-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{a.id}</span>
                        <span className="text-slate-400 ml-2">· {a.assigned_owner}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{a.token_state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preferences & Utilities */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Quick Actions
            </div>
            <div className="space-y-0.5 mt-1">
              <button
                onClick={() => {
                  toggleTheme();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-blue-500" />}
                  <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMdmSimulatorOpen(true);
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Smartphone className="h-4 w-4 text-blue-500" />
                  <span>Launch Android MDM Simulator</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Shortcut Guide */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">esc</kbd> Dismiss
            </span>
          </div>
          <span className="font-mono text-[10px]">Arohak MDM Index</span>
        </div>
      </div>
    </div>
  );
};
