import React from 'react';
import { DeviceTelemetry } from '../../types';
import { StatusDot } from '../StatusDot';
import { Badge } from '../ui/badge';
import { Laptop, Monitor, ArrowLeft, ShieldCheck, Wifi, Cpu, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration } from '../../lib/utils';

export interface DeviceHeaderProps {
  device: DeviceTelemetry;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const DeviceHeader: React.FC<DeviceHeaderProps> = ({ device, selectedDate, onDateChange }) => {
  const { navigateTo } = useApp();
  const hasFlags = device.verdict.flags.length > 0;

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigateTo('/devices')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Devices</span>
        </button>

        {/* Global Date Picker */}
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-mono">Date:</span>
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-2.5 py-1 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="2026-09-30">2026-09-30 (Today)</option>
            <option value="2026-09-29">2026-09-29 (Yesterday)</option>
            <option value="2026-09-28">2026-09-28</option>
          </select>
        </div>
      </div>

      {/* Main Header Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Identity & Status */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
              {device.platform === 'macos' ? (
                <Laptop className="h-6 w-6" />
              ) : (
                <Monitor className="h-6 w-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {device.hostname}
                </h1>

                {/* Status Dot & State Badge */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                  <StatusDot status={hasFlags ? 'flagged' : device.is_afk ? 'afk' : device.status} />
                  <span className="capitalize text-slate-700 dark:text-slate-300">
                    {hasFlags ? 'Flagged Anomaly' : device.is_afk ? 'Idle / Away' : device.status}
                  </span>
                  {device.is_afk && (
                    <span className="text-[11px] font-mono text-amber-500">({device.raw_idle_sec}s)</span>
                  )}
                </div>

                <Badge tone={device.platform === 'macos' ? 'primary' : 'neutral'} size="sm">
                  {device.platform.toUpperCase()}
                </Badge>
              </div>

              {/* Owner link & metadata */}
              <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                <span>
                  Assigned to:{' '}
                  <button
                    onClick={() => navigateTo(`/people/${device.owner_id}`, { personId: device.owner_id })}
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    {device.owner_name}
                  </button>
                  <span className="opacity-60 ml-1">({device.owner_email})</span>
                </span>
                <span>·</span>
                <span className="font-mono text-[11px]">Serial: {device.serial_number}</span>
                <span>·</span>
                <span className="font-mono text-[11px]">{device.os_version}</span>
              </div>
            </div>
          </div>

          {/* Quick Hardware Telemetry Pill Group */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 flex-wrap">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-slate-400" />
              <span>{device.wifi_ssid}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-slate-400" />
              <span>Uptime: {formatDuration(device.uptime_sec)}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Agent: {device.agent_version}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
