import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Laptop, 
  Users, 
  Package, 
  CornerDownLeft, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Monitor,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeviceTelemetry, PersonRecord, AssetRecord } from '../../types';
import { cn } from '../../lib/utils';

type SearchCategory = 'all' | 'devices' | 'users' | 'assets';

interface SearchResultItem {
  id: string;
  type: 'device' | 'user' | 'asset';
  title: string;
  subtitle: string;
  identifier: string; // e.g. ID, serial, or tag
  badgeText?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'info';
  metadata: string;
  original: DeviceTelemetry | PersonRecord | AssetRecord;
}

export const GlobalSearch: React.FC = () => {
  const { 
    devices, 
    people, 
    assets, 
    navigateTo, 
    showToast 
  } = useApp();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  // Global hotkey: Cmd+K / Ctrl+K or '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (
        e.key === '/' && 
        document.activeElement !== inputRef.current && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Compute matched items
  const results = useMemo<SearchResultItem[]>(() => {
    const cleanQuery = query.trim().toLowerCase();

    // Device items
    const matchedDevices: SearchResultItem[] = devices
      .filter(d => {
        if (!cleanQuery) return true;
        return (
          d.hostname.toLowerCase().includes(cleanQuery) ||
          d.id.toLowerCase().includes(cleanQuery) ||
          d.serial_number.toLowerCase().includes(cleanQuery) ||
          d.owner_name.toLowerCase().includes(cleanQuery) ||
          d.owner_email.toLowerCase().includes(cleanQuery) ||
          d.platform.toLowerCase().includes(cleanQuery) ||
          (d.wifi_ssid && d.wifi_ssid.toLowerCase().includes(cleanQuery))
        );
      })
      .map(d => ({
        id: `dev-${d.id}`,
        type: 'device' as const,
        title: d.hostname,
        subtitle: `${d.owner_name} · ${d.owner_email}`,
        identifier: d.id,
        badgeText: d.status === 'online' ? 'Online' : 'Offline',
        badgeVariant: d.status === 'online' ? 'success' : 'default',
        metadata: `${d.platform === 'macos' ? 'macOS' : 'Windows'} · SN: ${d.serial_number}`,
        original: d
      }));

    // Person/User items
    const matchedPeople: SearchResultItem[] = people
      .filter(p => {
        if (!cleanQuery) return true;
        return (
          p.full_name.toLowerCase().includes(cleanQuery) ||
          p.id.toLowerCase().includes(cleanQuery) ||
          p.email.toLowerCase().includes(cleanQuery) ||
          p.role.toLowerCase().includes(cleanQuery) ||
          (p.phone && p.phone.toLowerCase().includes(cleanQuery)) ||
          p.manager.toLowerCase().includes(cleanQuery)
        );
      })
      .map(p => ({
        id: `usr-${p.id}`,
        type: 'user' as const,
        title: p.full_name,
        subtitle: `${p.role} · ${p.email}`,
        identifier: p.id,
        badgeText: p.shift,
        badgeVariant: 'info',
        metadata: `${p.linked_device_ids.length} Linked Device${p.linked_device_ids.length === 1 ? '' : 's'} · Mgr: ${p.manager}`,
        original: p
      }));

    // Asset items
    const matchedAssets: SearchResultItem[] = assets
      .filter(a => {
        if (!cleanQuery) return true;
        return (
          a.device_name.toLowerCase().includes(cleanQuery) ||
          a.id.toLowerCase().includes(cleanQuery) ||
          a.serial_number.toLowerCase().includes(cleanQuery) ||
          a.model.toLowerCase().includes(cleanQuery) ||
          a.assigned_owner.toLowerCase().includes(cleanQuery) ||
          a.owner_email.toLowerCase().includes(cleanQuery) ||
          a.type.toLowerCase().includes(cleanQuery)
        );
      })
      .map(a => ({
        id: `ast-${a.id}`,
        type: 'asset' as const,
        title: a.device_name,
        subtitle: `${a.model} · Owner: ${a.assigned_owner}`,
        identifier: a.id,
        badgeText: a.token_state,
        badgeVariant: a.token_state === 'Active' ? 'success' : a.token_state === 'Pending' ? 'warning' : 'default',
        metadata: `${a.type} · SN: ${a.serial_number}`,
        original: a
      }));

    if (activeCategory === 'devices') return matchedDevices;
    if (activeCategory === 'users') return matchedPeople;
    if (activeCategory === 'assets') return matchedAssets;

    // 'all' category: interleaved or grouped
    return [...matchedDevices, ...matchedPeople, ...matchedAssets];
  }, [query, activeCategory, devices, people, assets]);

  // Counts for tabs
  const counts = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return {
        all: devices.length + people.length + assets.length,
        devices: devices.length,
        users: people.length,
        assets: assets.length
      };
    }

    const dCount = devices.filter(d => 
      d.hostname.toLowerCase().includes(cleanQuery) ||
      d.id.toLowerCase().includes(cleanQuery) ||
      d.serial_number.toLowerCase().includes(cleanQuery) ||
      d.owner_name.toLowerCase().includes(cleanQuery) ||
      d.owner_email.toLowerCase().includes(cleanQuery)
    ).length;

    const uCount = people.filter(p =>
      p.full_name.toLowerCase().includes(cleanQuery) ||
      p.id.toLowerCase().includes(cleanQuery) ||
      p.email.toLowerCase().includes(cleanQuery) ||
      p.role.toLowerCase().includes(cleanQuery)
    ).length;

    const aCount = assets.filter(a =>
      a.device_name.toLowerCase().includes(cleanQuery) ||
      a.id.toLowerCase().includes(cleanQuery) ||
      a.serial_number.toLowerCase().includes(cleanQuery) ||
      a.model.toLowerCase().includes(cleanQuery) ||
      a.assigned_owner.toLowerCase().includes(cleanQuery)
    ).length;

    return {
      all: dCount + uCount + aCount,
      devices: dCount,
      users: uCount,
      assets: aCount
    };
  }, [query, devices, people, assets]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results.length, activeCategory, query]);

  // Handle select / enter
  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    inputRef.current?.blur();

    if (item.type === 'device') {
      const dev = item.original as DeviceTelemetry;
      navigateTo('/devices', { deviceId: dev.id });
      showToast(`Navigated to device ${dev.hostname} (${dev.id})`);
    } else if (item.type === 'user') {
      const person = item.original as PersonRecord;
      navigateTo('/people', { personId: person.id });
      showToast(`Viewing profile for ${person.full_name} (${person.id})`);
    } else if (item.type === 'asset') {
      const asset = item.original as AssetRecord;
      navigateTo('/assets');
      showToast(`Viewing asset registry for ${asset.device_name} (${asset.id})`);
    }
  };

  // Keyboard navigation inside input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
      // scroll into view
      setTimeout(() => {
        const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex + 1}"]`);
        selectedEl?.scrollIntoView({ block: 'nearest' });
      }, 10);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
      setTimeout(() => {
        const selectedEl = listRef.current?.querySelector(`[data-index="${selectedIndex - 1}"]`);
        selectedEl?.scrollIntoView({ block: 'nearest' });
      }, 10);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelectItem(results[selectedIndex]);
      }
    } else if (e.key === 'Tab') {
      // Cycle filter categories
      if (e.shiftKey) {
        if (activeCategory === 'assets') setActiveCategory('users');
        else if (activeCategory === 'users') setActiveCategory('devices');
        else if (activeCategory === 'devices') setActiveCategory('all');
        else setActiveCategory('assets');
      } else {
        if (activeCategory === 'all') setActiveCategory('devices');
        else if (activeCategory === 'devices') setActiveCategory('users');
        else if (activeCategory === 'users') setActiveCategory('assets');
        else setActiveCategory('all');
      }
      e.preventDefault();
    }
  };

  // Substring highlight helper
  const highlightMatch = (text: string, queryStr: string) => {
    if (!queryStr.trim()) return text;
    const regex = new RegExp(`(${queryStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-200 font-semibold rounded-xs px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-72 sm:w-80 md:w-96 lg:w-[420px] text-xs">
      {/* Search Input Bar */}
      <div
        className={cn(
          'flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-150',
          'bg-white dark:bg-slate-900/80',
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
            : 'border-blue-100/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 shadow-2xs'
        )}
      >
        <Search className={cn('h-3.5 w-3.5 shrink-0 transition-colors', isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500 dark:text-slate-400')} />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleInputKeyDown}
          placeholder="Search devices, users, assets by name or ID..."
          className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none text-xs"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-sm cursor-pointer"
            title="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <div className="flex items-center gap-1 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-blue-50 dark:bg-slate-800/80 border border-blue-200/60 dark:border-slate-700/80 px-1.5 py-0.5 rounded text-blue-700 dark:text-slate-300">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Floating Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-white dark:bg-slate-900 border border-blue-100/90 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-98 duration-100">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 p-1.5 border-b border-blue-100/80 dark:border-slate-800 bg-blue-50/40 dark:bg-slate-950/40">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                activeCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-200'
              )}
            >
              <span>All</span>
              <span className="font-mono text-[10px] opacity-75">({counts.all})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('devices')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                activeCategory === 'devices'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-200'
              )}
            >
              <Laptop className="h-3 w-3" />
              <span>Devices</span>
              <span className="font-mono text-[10px] opacity-75">({counts.devices})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('users')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                activeCategory === 'users'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-200'
              )}
            >
              <Users className="h-3 w-3" />
              <span>Users</span>
              <span className="font-mono text-[10px] opacity-75">({counts.users})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('assets')}
              className={cn(
                'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                activeCategory === 'assets'
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-slate-200'
              )}
            >
              <Package className="h-3 w-3" />
              <span>Assets</span>
              <span className="font-mono text-[10px] opacity-75">({counts.assets})</span>
            </button>
          </div>

          {/* Results List */}
          <div ref={listRef} className="max-h-[340px] overflow-y-auto divide-y divide-blue-50/70 dark:divide-slate-800/60 p-1">
            {results.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Search className="h-8 w-8 text-blue-300 dark:text-slate-600 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  No matches for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Try searching by device hostname (e.g. &ldquo;MAC-01&rdquo;), user email, asset model, or ID like <span className="font-mono text-blue-600 dark:text-blue-400">dev_01</span>, <span className="font-mono text-blue-600 dark:text-blue-400">usr_1</span>, or <span className="font-mono text-blue-600 dark:text-blue-400">ast_01</span>.
                </p>
              </div>
            ) : (
              results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    data-index={index}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      'p-2.5 rounded-lg cursor-pointer transition-all flex items-start justify-between gap-3 text-left relative',
                      isSelected
                        ? 'bg-blue-50/90 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-1 ring-blue-500/20'
                        : 'hover:bg-blue-50/40 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                    )}
                  >
                    {/* Active Left Indicator */}
                    {isSelected && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r" />
                    )}

                    <div className="flex items-start gap-2.5 min-w-0 flex-1 pl-1">
                      {/* Category Icon */}
                      <div className={cn(
                        'h-7 w-7 rounded-md shrink-0 flex items-center justify-center mt-0.5',
                        item.type === 'device' && 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
                        item.type === 'user' && 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
                        item.type === 'asset' && 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400'
                      )}>
                        {item.type === 'device' && <Laptop className="h-4 w-4" />}
                        {item.type === 'user' && <Users className="h-4 w-4" />}
                        {item.type === 'asset' && <Package className="h-4 w-4" />}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Title & Identifier */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {highlightMatch(item.title, query)}
                          </span>

                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                            {highlightMatch(item.identifier, query)}
                          </span>

                          {item.badgeText && (
                            <span className={cn(
                              'text-[10px] font-mono px-1.5 py-0.2 rounded-xs shrink-0',
                              item.badgeVariant === 'success' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60',
                              item.badgeVariant === 'warning' && 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60',
                              item.badgeVariant === 'info' && 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60',
                              item.badgeVariant === 'default' && 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            )}>
                              {item.badgeText}
                            </span>
                          )}
                        </div>

                        {/* Subtitle */}
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
                          {highlightMatch(item.subtitle, query)}
                        </p>

                        {/* Metadata Line */}
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate mt-0.5">
                          {highlightMatch(item.metadata, query)}
                        </p>
                      </div>
                    </div>

                    {/* Enter shortcut icon on selected */}
                    <div className="shrink-0 flex items-center gap-1 self-center text-slate-400 dark:text-slate-500">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-1.5 py-0.5 rounded">
                          <span>Open</span>
                          <CornerDownLeft className="h-3 w-3 ml-0.5" />
                        </span>
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-3 py-2 border-t border-blue-100/80 dark:border-slate-800 bg-blue-50/20 dark:bg-slate-950/30 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <kbd className="font-mono text-[9px] bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">↑↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="font-mono text-[9px] bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">↵</kbd>
                <span>Select</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="font-mono text-[9px] bg-white dark:bg-slate-800 px-1 rounded border border-slate-200 dark:border-slate-700">Tab</kbd>
                <span>Filter</span>
              </span>
            </div>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
              Arohak Global Index
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
