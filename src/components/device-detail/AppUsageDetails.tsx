import React, { useState } from 'react';
import { DeviceTelemetry } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { formatDuration, formatBytes } from '../../lib/utils';
import { FileCode2, ChevronDown, ChevronRight, Globe } from 'lucide-react';

export interface AppUsageDetailsProps {
  device: DeviceTelemetry;
}

export const AppUsageDetails: React.FC<AppUsageDetailsProps> = ({ device }) => {
  const [expandedApp, setExpandedApp] = useState<string | null>(device.top_apps[0]?.app || null);

  return (
    <Card className="mt-6">
      <CardHead>
        <CardTitle>
          <FileCode2 className="h-4 w-4 text-indigo-500" />
          <span>Comprehensive Application Usage & Document History</span>
        </CardTitle>
        <span className="text-xs text-slate-500 font-mono">
          Privacy-Preserved Document Titles (Tokens Scrubbed)
        </span>
      </CardHead>

      <CardBody className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Application Executable</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Cumulative Time</th>
                <th className="py-3 px-4 font-medium">Bandwidth Consumed</th>
                <th className="py-3 px-4 font-medium text-right">Window History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {device.top_apps.map((app) => {
                const isExpanded = expandedApp === app.app;
                return (
                  <React.Fragment key={app.app}>
                    <tr
                      onClick={() => setExpandedApp(isExpanded ? null : app.app)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                        <span>{app.app}</span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {app.category}
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-slate-100">
                        {formatDuration(app.duration_sec)}
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-500">
                        {formatBytes(app.bytes)}
                      </td>

                      <td className="py-3 px-4 text-right text-indigo-600 dark:text-indigo-400 font-medium">
                        {app.window_samples.length} titles recorded →
                      </td>
                    </tr>

                    {/* Window Titles Dropdown Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                        <td colSpan={5} className="py-3 px-8">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                              Document / Tab Titles captured via OS Titlebar Probes:
                            </span>
                            <div className="space-y-1">
                              {app.window_samples.map((win, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs font-mono text-slate-700 dark:text-slate-300 flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800"
                                >
                                  <Globe className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  <span className="truncate">{win}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};
