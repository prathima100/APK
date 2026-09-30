import React from 'react';
import { DeviceTelemetry } from '../../types';
import { StatusDot } from '../StatusDot';
import { Badge } from '../ui/badge';
import { formatRelativeTime } from '../../lib/utils';
import { Laptop, Monitor, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface DevicesTableProps {
  devices: DeviceTelemetry[];
}

export const DevicesTable: React.FC<DevicesTableProps> = ({ devices }) => {
  const { navigateTo } = useApp();

  if (devices.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs">
        No devices match the specified filter criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider">
            <th className="py-3 px-4 font-medium">Device & Owner</th>
            <th className="py-3 px-4 font-medium">Platform</th>
            <th className="py-3 px-4 font-medium">Current Active Focus</th>
            <th className="py-3 px-4 font-medium">Status & Flags</th>
            <th className="py-3 px-4 font-medium text-right">Last Seen</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {devices.map((device) => {
            const hasFlags = device.verdict.flags.length > 0;
            return (
              <tr
                key={device.id}
                onClick={() => navigateTo(`/devices/${device.id}`, { deviceId: device.id })}
                className="group hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer"
              >
                {/* Device & Owner */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {device.platform === 'macos' ? (
                        <Laptop className="h-4 w-4" />
                      ) : (
                        <Monitor className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {device.hostname}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {device.owner_name} <span className="opacity-60">({device.owner_email})</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Platform */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {device.os_version}
                  </span>
                </td>

                {/* Current Active App & Window */}
                <td className="py-3.5 px-4 max-w-xs xl:max-w-md">
                  {device.status === 'online' ? (
                    <div>
                      <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                        {device.current_app}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate" title={device.current_window}>
                        {device.current_window}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic font-mono text-[11px]">System Sleep / Offline</span>
                  )}
                </td>

                {/* Status & Flags */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <StatusDot
                      status={hasFlags ? 'flagged' : device.is_afk ? 'afk' : device.status}
                    />
                    <span className="font-medium capitalize text-slate-700 dark:text-slate-300">
                      {hasFlags ? 'Anomaly Flagged' : device.is_afk ? 'Away' : device.status}
                    </span>

                    {hasFlags && (
                      <Badge tone="danger" size="sm" className="ml-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>{device.verdict.flags[0].replace('_', ' ')}</span>
                      </Badge>
                    )}
                  </div>
                </td>

                {/* Last Seen */}
                <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatRelativeTime(device.last_seen)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
