import React, { useState } from 'react';
import { DeviceTelemetry, AppSession } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { formatDuration } from '../../lib/utils';
import { Activity, Clock } from 'lucide-react';

export interface TimelineProps {
  device: DeviceTelemetry;
}

export const Timeline: React.FC<TimelineProps> = ({ device }) => {
  const [hoveredSession, setHoveredSession] = useState<AppSession | null>(null);

  // Fallback demo sessions if device has empty sessions
  const sessions: AppSession[] = device.sessions.length > 0 ? device.sessions : [
    {
      id: 'sess_def_01',
      type: 'app_session',
      app: device.current_app || 'Development Tool',
      window: device.current_window || 'Active workspace',
      start_time: '2026-09-30T09:00:00Z',
      duration_sec: 10800,
      keystrokes: 2400,
      mouse_clicks: 620,
      mouse_movement_px: 12000,
      mouse_scroll_ticks: 180,
      idle_sec: 40,
      flags: []
    },
    {
      id: 'sess_def_02',
      type: 'app_session',
      app: 'Google Chrome',
      window: 'Company Portal / Documentation',
      start_time: '2026-09-30T12:00:00Z',
      duration_sec: 5400,
      keystrokes: 480,
      mouse_clicks: 190,
      mouse_movement_px: 8200,
      mouse_scroll_ticks: 110,
      idle_sec: 25,
      flags: []
    },
    {
      id: 'sess_def_03',
      type: 'app_session',
      app: device.current_app || 'Terminal',
      window: 'Project compilation & unit test runner',
      start_time: '2026-09-30T13:30:00Z',
      duration_sec: 7200,
      keystrokes: 1950,
      mouse_clicks: 410,
      mouse_movement_px: 9500,
      mouse_scroll_ticks: 150,
      idle_sec: 30,
      flags: []
    }
  ];

  const appColors: Record<string, string> = {
    'Visual Studio Code': 'bg-blue-500 hover:bg-blue-400',
    'Google Chrome': 'bg-amber-500 hover:bg-amber-400',
    'Slack': 'bg-emerald-500 hover:bg-emerald-400',
    'Windows Terminal': 'bg-purple-500 hover:bg-purple-400',
    'Microsoft Excel': 'bg-teal-500 hover:bg-teal-400',
    'Obsidian': 'bg-violet-500 hover:bg-violet-400',
    'Alacritty': 'bg-cyan-500 hover:bg-cyan-400',
    'Notepad': 'bg-rose-500 hover:bg-rose-400'
  };

  const totalDuration = sessions.reduce((acc, s) => acc + s.duration_sec, 0);

  return (
    <Card>
      <CardHead>
        <CardTitle>
          <Activity className="h-4 w-4 text-indigo-500" />
          <span>Interactive Session Timeline</span>
        </CardTitle>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>Shift: 09:00 — 18:00</span>
          </span>
          <span>·</span>
          <span>{sessions.length} recorded contiguous sessions</span>
        </div>
      </CardHead>

      <CardBody className="space-y-4">
        {/* Timeline Bar Strip */}
        <div className="relative">
          <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 flex gap-1 overflow-hidden shadow-inner">
            {sessions.map((sess) => {
              const widthPct = Math.max(10, Math.round((sess.duration_sec / totalDuration) * 100));
              const colorClass = appColors[sess.app] || 'bg-indigo-500 hover:bg-indigo-400';
              return (
                <div
                  key={sess.id}
                  onMouseEnter={() => setHoveredSession(sess)}
                  onMouseLeave={() => setHoveredSession(null)}
                  className={`h-full rounded-lg transition-all cursor-pointer flex items-center justify-center text-[11px] font-semibold text-white px-2 truncate shadow-xs ${colorClass}`}
                  style={{ width: `${widthPct}%` }}
                >
                  <span className="truncate">{sess.app}</span>
                </div>
              );
            })}
          </div>

          {/* Time axis scale ticks */}
          <div className="mt-2 flex justify-between text-[10px] font-mono text-slate-400 px-1">
            <span>09:00</span>
            <span>11:00</span>
            <span>13:00 (Lunch)</span>
            <span>15:00</span>
            <span>17:00</span>
            <span>18:00</span>
          </div>
        </div>

        {/* Hovered / Active Session Inspector Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 transition-all min-h-[90px] flex flex-col justify-center">
          {hoveredSession ? (
            <div className="space-y-1.5 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {hoveredSession.app}
                </span>
                <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  Duration: {formatDuration(hoveredSession.duration_sec)}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate" title={hoveredSession.window}>
                Document / Window: "{hoveredSession.window}"
              </p>
              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
                <span>Keystrokes: {hoveredSession.keystrokes}</span>
                <span>·</span>
                <span>Clicks: {hoveredSession.mouse_clicks}</span>
                <span>·</span>
                <span>Cursor Move: {Math.round(hoveredSession.mouse_movement_px)}px</span>
                <span>·</span>
                <span>Idle in Session: {hoveredSession.idle_sec}s</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-400 py-1 font-mono">
              Hover over any timeline segment above to inspect foreground window title and micro-cadence data.
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
