import React, { useState } from 'react';
import { FirewallEvent } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ShieldAlert, Eye, Terminal } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import { PacketInspectorModal } from './PacketInspectorModal';

export interface SecurityIncidentsTableProps {
  events: FirewallEvent[];
}

export const SecurityIncidentsTable: React.FC<SecurityIncidentsTableProps> = ({ events }) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [inspectedEvent, setInspectedEvent] = useState<FirewallEvent | null>(null);

  const filtered = events.filter(e => {
    if (severityFilter !== 'ALL' && e.severity !== severityFilter) return false;
    return true;
  });

  return (
    <Card>
      {/* Header with Severity Filter */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            <span>Intercepted Threat Ledger & Kernel Socket Drops</span>
          </h3>
          <p className="text-[11px] text-slate-500 font-mono mt-0.5">
            Streaming live telemetry from OS firewall hooks across the fleet
          </p>
        </div>

        {/* Severity segmented controls */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs">
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 font-medium rounded-md transition-all cursor-pointer ${
                severityFilter === sev
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-medium">Timestamp</th>
              <th className="py-3 px-4 font-medium">Reporting Device</th>
              <th className="py-3 px-4 font-medium">Target / Threat Vector</th>
              <th className="py-3 px-4 font-medium">Severity</th>
              <th className="py-3 px-4 font-medium">Countermeasure</th>
              <th className="py-3 px-4 font-medium text-right">Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                  {formatRelativeTime(ev.timestamp)}
                </td>

                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  {ev.device_name}
                </td>

                <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="font-semibold">{ev.target}</span>
                    <span className="text-[10px] text-slate-400 ml-2 font-sans">({ev.rule_name})</span>
                  </div>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <Badge
                    tone={ev.severity === 'CRITICAL' ? 'danger' : ev.severity === 'HIGH' ? 'warn' : 'neutral'}
                    size="sm"
                  >
                    {ev.severity}
                  </Badge>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    {ev.teardown_executed ? 'TCP Socket Teardown' : 'Packet Drop'}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInspectedEvent(ev)}
                    className="cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Inspect Event</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PacketInspectorModal
        event={inspectedEvent}
        onClose={() => setInspectedEvent(null)}
      />
    </Card>
  );
};
