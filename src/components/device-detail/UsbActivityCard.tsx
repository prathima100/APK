import React from 'react';
import { UsbEvent } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { HardDrive, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/badge';
import { formatRelativeTime } from '../../lib/utils';

export interface UsbActivityCardProps {
  events: UsbEvent[];
}

export const UsbActivityCard: React.FC<UsbActivityCardProps> = ({ events }) => {
  const hasMassStorage = events.some(e => e.is_mass_storage);

  return (
    <Card className="mt-6">
      <CardHead>
        <CardTitle>
          <HardDrive className="h-4 w-4 text-indigo-500" />
          <span>USB Peripheral & Mass Storage Sentinel</span>
        </CardTitle>
        <Badge tone={hasMassStorage ? 'danger' : 'ok'}>
          {hasMassStorage ? 'Mass Storage Flagged' : 'Only Approved HIDs Connected'}
        </Badge>
      </CardHead>

      <CardBody className="space-y-4">
        {hasMassStorage && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Mass Storage Insertion Detected</p>
              <p className="opacity-90 mt-0.5 font-mono">
                Removable USB flash storage attached. Hardware Class 08h verified via SetupAPI. File exfiltration monitor active.
              </p>
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-6 font-mono">
            No external USB peripheral insertions or removals recorded on this endpoint today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Device Name</th>
                  <th className="py-2.5 px-3">VID / PID</th>
                  <th className="py-2.5 px-3">Serial Number</th>
                  <th className="py-2.5 px-3">Mount</th>
                  <th className="py-2.5 px-3 text-right">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(ev.timestamp)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={ev.action === 'INSERTED' ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-400'}>
                        {ev.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100 font-sans">
                      {ev.device_name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {ev.vendor_id}:{ev.product_id}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-[140px]">
                      {ev.serial_number}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {ev.mount_point || 'None (HID)'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <Badge
                        tone={ev.risk_level === 'ALERT' ? 'danger' : ev.risk_level === 'WARNING' ? 'warn' : 'ok'}
                        size="sm"
                      >
                        {ev.risk_level}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
