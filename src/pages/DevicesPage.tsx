import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeviceFilters } from '../components/devices/DeviceFilters';
import { DevicesTable } from '../components/devices/DevicesTable';
import { FleetActivityChart } from '../components/devices/FleetActivityChart';
import { Stat } from '../components/ui/stat';
import { Card } from '../components/ui/card';
import { Laptop, AlertTriangle, Clock } from 'lucide-react';
import { StatusDot } from '../components/StatusDot';

export const DevicesPage: React.FC = () => {
  const { devices, onlineCount, flaggedCountToday, totalFleetHours } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [flaggedOnly, setFlaggedOnly] = useState(false);

  // Filter devices
  const filteredDevices = devices.filter(d => {
    // Search
    const matchesSearch = 
      d.hostname.toLowerCase().includes(search.toLowerCase()) ||
      d.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      d.owner_email.toLowerCase().includes(search.toLowerCase()) ||
      d.os_version.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    // Status
    if (statusFilter === 'online' && d.status !== 'online') return false;
    if (statusFilter === 'offline' && d.status !== 'offline') return false;

    // Flagged
    if (flaggedOnly && d.verdict.flags.length === 0) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Section 1: Fleet Headline Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
          Fleet · Today
        </div>
        <div className="mt-1 flex items-center gap-3">
          <StatusDot status={flaggedCountToday > 0 ? 'flagged' : 'online'} />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {flaggedCountToday > 0
              ? `${flaggedCountToday} device${flaggedCountToday > 1 ? 's' : ''} flagged today for cadence review`
              : 'All clear across the fleet'}
          </h1>
        </div>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
          {onlineCount} of {devices.length} endpoints online · {totalFleetHours} cumulative active hours today · telemetry streaming
        </p>
      </div>

      {/* Section 2: Fleet KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Stat
          label="Online Devices"
          value={`${onlineCount}`}
          suffix={`/ ${devices.length}`}
          hint={`${Math.round((onlineCount / devices.length) * 100)}% of fleet connected`}
          icon={<Laptop className="h-4 w-4" />}
          trend={{ value: 'Nominal', isPositive: true }}
        />

        <Stat
          label="Flagged Today"
          value={`${flaggedCountToday}`}
          hint={flaggedCountToday > 0 ? 'Review anti-cheat incident in Dev-Flagged-08' : 'No synthetic or held-key signals'}
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={{ 
            value: flaggedCountToday > 0 ? 'Action Needed' : '0 Anomalies', 
            isPositive: flaggedCountToday === 0 
          }}
        />

        <Stat
          label="Fleet Active Hours"
          value={`${totalFleetHours}h`}
          hint="Calculated across OS active screen states"
          icon={<Clock className="h-4 w-4" />}
          trend={{ value: '+4.2% vs yesterday', isPositive: true }}
        />
      </div>

      {/* Section 3 & 4: Filter Toolbar & Devices Table */}
      <Card>
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <DeviceFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            flaggedOnly={flaggedOnly}
            onFlaggedOnlyChange={setFlaggedOnly}
          />
        </div>
        <DevicesTable devices={filteredDevices} />
      </Card>

      {/* Section 5: Fleet Hourly Distribution Chart */}
      <FleetActivityChart />
    </div>
  );
};
