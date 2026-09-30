import React from 'react';
import { NetworkEvent } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { Wifi, ArrowUpRight, ArrowDownLeft, ShieldCheck, Globe } from 'lucide-react';
import { formatBytes } from '../../lib/utils';
import { Badge } from '../ui/badge';

export interface NetworkActivityCardProps {
  events: NetworkEvent[];
}

export const NetworkActivityCard: React.FC<NetworkActivityCardProps> = ({ events }) => {
  const topDomains = [
    { domain: 'api.github.com', bytes: 145000000, process: 'Code.exe', pct: 65 },
    { domain: 'corp-jira.atlassian.net', bytes: 52000000, process: 'Google Chrome', pct: 24 },
    { domain: 'slack-msgs.slack.com', bytes: 18000000, process: 'Slack', pct: 8 },
    { domain: 'registry.npmjs.org', bytes: 6400000, process: 'node.exe', pct: 3 }
  ];

  return (
    <Card className="mt-6">
      <CardHead>
        <CardTitle>
          <Wifi className="h-4 w-4 text-indigo-500" />
          <span>Outbound Network Activity & Domain Analyzer</span>
        </CardTitle>
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span>Gateway Latency: 12ms</span>
          <span>·</span>
          <span className="text-emerald-500">Zero DNS Leaks</span>
        </div>
      </CardHead>

      <CardBody className="space-y-6">
        {/* Metric Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500">Daily Ingress (Recv)</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">221.4 MB</p>
            </div>
            <ArrowDownLeft className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500">Daily Egress (Sent)</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">38.9 MB</p>
            </div>
            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-500">Active TCP Sockets</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">14 Established</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
        </div>

        {/* Top Destination Domains */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Top Destination Remote Domains
          </span>
          <div className="space-y-2">
            {topDomains.map(d => (
              <div key={d.domain} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{d.domain}</span>
                    <span className="text-[11px] text-slate-400 font-sans">({d.process})</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{formatBytes(d.bytes)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
