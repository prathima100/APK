import React from 'react';
import { DeviceTelemetry } from '../../types';
import { Stat } from '../ui/stat';
import { formatDuration } from '../../lib/utils';
import { Monitor, Lock, Moon, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface ScreenTimeStatsProps {
  device: DeviceTelemetry;
}

export const ScreenTimeStats: React.FC<ScreenTimeStatsProps> = ({ device }) => {
  const verdictTones = {
    genuine: 'ok',
    'automated-looking': 'danger',
    idle: 'warn',
    review: 'warn'
  } as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Active Time */}
      <Stat
        label="Active Screen Time"
        value={formatDuration(device.active_screen_sec)}
        hint="Display on & user present"
        icon={<Monitor className="h-4 w-4" />}
        trend={{ value: 'Target: 6–8h', isPositive: true }}
      />

      {/* 2. Locked Duration */}
      <Stat
        label="Locked Duration"
        value={formatDuration(device.locked_sec)}
        hint="Lock screen / screensaver"
        icon={<Lock className="h-4 w-4" />}
      />

      {/* 3. Sleep / Standby */}
      <Stat
        label="Sleep / Standby"
        value={formatDuration(device.sleep_sec)}
        hint="Low-power suspension"
        icon={<Moon className="h-4 w-4" />}
      />

      {/* 4. Shift Adherence */}
      <Stat
        label="Shift Adherence"
        value={`${device.shift_adherence_pct}%`}
        hint="Alignment with 09:00–18:00 window"
        icon={<CheckCircle2 className="h-4 w-4" />}
        trend={{ 
          value: device.shift_adherence_pct >= 90 ? 'High Compliance' : 'Review Window', 
          isPositive: device.shift_adherence_pct >= 90 
        }}
      />

      {/* 5. Engagement Verdict Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900/90 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            Heuristics Verdict
          </span>
          <ShieldCheck className="h-4 w-4 text-slate-400" />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Badge tone={verdictTones[device.verdict.verdict]} size="md" className="capitalize text-xs font-semibold">
            {device.verdict.verdict === 'automated-looking' && <AlertTriangle className="h-3.5 w-3.5" />}
            {device.verdict.verdict.replace('-', ' ')}
          </Badge>
          <span className="text-xs font-mono text-slate-500">
            {Math.round(device.verdict.confidence * 100)}% conf.
          </span>
        </div>

        <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {device.verdict.reasons[0] || 'Cadence matches organic baseline'}
        </div>
      </div>
    </div>
  );
};
