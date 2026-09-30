import React from 'react';
import { MouseCadence, KeyboardCadence } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { MousePointer, Keyboard, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface MouseActivityCardProps {
  mouse: MouseCadence;
  keyboard: KeyboardCadence;
}

export const MouseActivityCard: React.FC<MouseActivityCardProps> = ({ mouse, keyboard }) => {
  const isOrganic = mouse.entropy_score > 0.4 && !mouse.jiggler_detected;
  const entropyPct = Math.round(mouse.entropy_score * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Mouse Cadence & Entropy */}
      <Card>
        <CardHead>
          <CardTitle>
            <MousePointer className="h-4 w-4 text-indigo-500" />
            <span>Mouse Cadence & Entropy Engine</span>
          </CardTitle>
          <Badge tone={isOrganic ? 'ok' : 'danger'}>
            {isOrganic ? 'Organic Movement' : 'Synthetic / Jiggler Flagged'}
          </Badge>
        </CardHead>

        <CardBody className="space-y-5">
          {/* Counters Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Clicks</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {mouse.mouse_clicks.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Scroll Ticks</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {mouse.mouse_scroll_ticks.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Distance</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {Math.round(mouse.mouse_movement_px / 1000)}k px
              </p>
            </div>
          </div>

          {/* Entropy Gauge */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Trajectory Directional Entropy:
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {entropyPct}% ({mouse.entropy_score.toFixed(2)})
              </span>
            </div>

            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOrganic ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${entropyPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0% (Synthetic Linear Loops)</span>
              <span>Threshold: 40%</span>
              <span>100% (High Human Entropy)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 font-mono">
            {mouse.jiggler_detected ? (
              <p className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                <span>Zero-variance vectors detected. Repetitive linear sweeps match software jiggler.</span>
              </p>
            ) : (
              <p className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Curved trajectories and velocity decay correspond to authentic human physics.</span>
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 2. Keyboard Cadence & Non-Keylogger Assurance */}
      <Card>
        <CardHead>
          <CardTitle>
            <Keyboard className="h-4 w-4 text-indigo-500" />
            <span>Passive Keyboard Rhythm & Cadence</span>
          </CardTitle>
          <Badge tone={keyboard.held_key_detected ? 'danger' : 'ok'}>
            {keyboard.held_key_detected ? 'Held Key Flagged' : 'Authentic Cadence'}
          </Badge>
        </CardHead>

        <CardBody className="space-y-5">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Volume (Keystrokes)</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {keyboard.keystrokes.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500">Speed (KPM)</span>
              <p className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                {keyboard.keys_per_minute.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Continuous Held Key Duration:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                {keyboard.held_key_duration_sec}s
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Stuck Key / Physical Weight Flag:</span>
              <span className="font-mono font-bold">
                {keyboard.held_key_detected ? (
                  <span className="text-rose-500">TRIGGERED (180s continuous spacebar)</span>
                ) : (
                  <span className="text-emerald-500">NOMINAL (0s)</span>
                )}
              </span>
            </div>
          </div>

          {/* Privacy Guarantee Box */}
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40 text-[11px] text-indigo-950 dark:text-indigo-200">
            <p className="font-bold">Strict Privacy Architecture:</p>
            <p className="mt-1 opacity-80 leading-relaxed font-mono">
              Agent captures timing deltas only. No character codes, passwords, or typed text are ever processed or recorded.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
