import React from 'react';
import { DeviceTelemetry } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { formatDuration } from '../../lib/utils';
import { Layers } from 'lucide-react';

export interface TopAppsChartProps {
  device: DeviceTelemetry;
}

export const TopAppsChart: React.FC<TopAppsChartProps> = ({ device }) => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHead>
        <CardTitle>
          <Layers className="h-4 w-4 text-indigo-500" />
          <span>Top Applications Usage</span>
        </CardTitle>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Ranked by Duration
        </span>
      </CardHead>

      <CardBody className="space-y-4">
        {device.top_apps.map((app, index) => (
          <div key={app.app} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[11px] font-mono text-slate-400 w-4 font-semibold">
                  {index + 1}.
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {app.app}
                </span>
                <span className="text-[11px] text-slate-400">({app.category})</span>
              </div>
              <div className="flex items-center gap-2 font-mono shrink-0">
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatDuration(app.duration_sec)}
                </span>
                <span className="text-[11px] text-slate-400">
                  {app.share_pct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Progress Meter Bar */}
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
                style={{ width: `${Math.min(100, app.share_pct)}%` }}
              />
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
};
