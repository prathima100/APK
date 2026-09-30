import React from 'react';
import { DeviceTelemetry } from '../../types';
import { AlertTriangle, ShieldAlert, Cpu } from 'lucide-react';

export interface SuspiciousListProps {
  device: DeviceTelemetry;
}

export const SuspiciousList: React.FC<SuspiciousListProps> = ({ device }) => {
  if (device.verdict.flags.length === 0) return null;

  return (
    <div className="rounded-2xl border border-rose-200 dark:border-rose-900/80 bg-rose-50/50 dark:bg-rose-950/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950 dark:text-rose-200">
              Anti-Cheat & Heuristics Alert Triggered ({device.verdict.flags.length} Anomaly Vectors)
            </h3>
            <p className="text-xs text-rose-700/80 dark:text-rose-400/80">
              Confidence score: {(device.verdict.confidence * 100).toFixed(0)}% · Autonomous verification flag
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-rose-600 text-white font-semibold">
          ACTION REQUIRED
        </span>
      </div>

      <div className="space-y-2.5">
        {device.verdict.reasons.map((reason, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200/60 dark:border-rose-900/40 flex items-start gap-3"
          >
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-rose-900 dark:text-rose-200">
                Vector #{idx + 1}:{' '}
              </span>
              <span className="text-slate-700 dark:text-slate-300 font-mono">{reason}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] text-rose-700 dark:text-rose-400 pt-1 font-mono">
        <span>Non-punitive flag for operational audit · India/US labor transparency compliant</span>
        <span>Sensor: agent/anti_cheat.py</span>
      </div>
    </div>
  );
};
