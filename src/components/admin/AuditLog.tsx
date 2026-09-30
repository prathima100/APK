import React from 'react';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { Badge } from '../ui/badge';
import { ListChecks, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../lib/utils';

export const AuditLog: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <Card className="mt-6">
      <CardHead>
        <CardTitle>
          <ListChecks className="h-4 w-4 text-indigo-500" />
          <span>Immutable Governance & Operations Audit Ledger</span>
        </CardTitle>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Tamper-Proof Append-Only</span>
        </div>
      </CardHead>

      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Timestamp</th>
                <th className="py-3 px-4 font-medium">Actor</th>
                <th className="py-3 px-4 font-medium">Action Performed</th>
                <th className="py-3 px-4 font-medium">Target Resource</th>
                <th className="py-3 px-4 font-medium">Client IP</th>
                <th className="py-3 px-4 font-medium text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {formatRelativeTime(log.timestamp)}
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 font-sans">
                    {log.actor_email}
                  </td>

                  <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-semibold">
                    {log.action}
                  </td>

                  <td className="py-3 px-4 text-slate-500 truncate max-w-xs font-sans">
                    {log.target_resource_id}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {log.client_ip}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Badge tone={log.status === 'SUCCESS' ? 'ok' : 'warn'} size="sm">
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};
