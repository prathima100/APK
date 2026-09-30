import React from 'react';
import { DeviceTelemetry } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { BarChart2 } from 'lucide-react';

export interface ActiveHoursChartProps {
  device: DeviceTelemetry;
}

export const ActiveHoursChart: React.FC<ActiveHoursChartProps> = ({ device }) => {
  const maxMinutes = Math.max(...device.hourly_active_minutes, 60);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHead>
        <CardTitle>
          <BarChart2 className="h-4 w-4 text-indigo-500" />
          <span>Active Hours Distribution</span>
        </CardTitle>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          24h Column Profile
        </span>
      </CardHead>

      <CardBody>
        <div className="h-40 flex items-end gap-1 pt-6 pb-2">
          {device.hourly_active_minutes.map((mins, hour) => {
            const heightPct = Math.round((mins / maxMinutes) * 100);
            const isStandardShift = hour >= 9 && hour <= 18;
            return (
              <div
                key={hour}
                className="flex-1 flex flex-col items-center justify-end h-full group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 shadow-xs">
                  {hour}:00 — {mins}m active
                </div>

                <div
                  className={`w-full rounded-2xs transition-all duration-200 ${
                    mins > 0
                      ? isStandardShift
                        ? 'bg-indigo-600 dark:bg-indigo-500 group-hover:bg-indigo-400'
                        : 'bg-amber-500/80 group-hover:bg-amber-400'
                      : 'bg-slate-100 dark:bg-slate-800'
                  }`}
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                />

                {hour % 4 === 0 && (
                  <span className="text-[9px] text-slate-400 font-mono mt-1 select-none">
                    {hour}h
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-100 dark:border-slate-800 pt-2">
          <span>Active: Blue</span>
          <span>Outside Shift: Amber</span>
          <span>Peak: {Math.max(...device.hourly_active_minutes)}m/hr</span>
        </div>
      </CardBody>
    </Card>
  );
};
