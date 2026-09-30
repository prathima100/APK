import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHead, CardTitle, CardBody } from '../components/ui/card';
import { TabsList, TabTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { StatusDot } from '../components/StatusDot';
import { ArrowLeft, Laptop, Calendar, Clock, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

export const PersonDetailPage: React.FC = () => {
  const { selectedPerson, people, devices, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'annual'>('overview');

  const person = selectedPerson || people[0];
  const linkedDevices = devices.filter(d => person.linked_device_ids.includes(d.id));

  // Benchmark max
  const maxMonthlyHours = Math.max(...person.monthly_history.map(m => Math.max(m.active_hours, m.benchmark_avg_hours)), 180);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigateTo('/people')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer w-fit"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to All People</span>
      </button>

      {/* Profile Header Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white font-mono font-bold text-xl flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
              {person.avatar_initials}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {person.full_name}
                </h1>
                <Badge
                  tone={person.engagement_verdict === 'genuine' ? 'ok' : 'danger'}
                  size="sm"
                  className="capitalize"
                >
                  {person.engagement_verdict} Engagement
                </Badge>
              </div>

              <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-mono">
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-sans">{person.role}</span>
                <span>·</span>
                <span>{person.email}</span>
                <span>·</span>
                <span>Shift: {person.shift}</span>
                <span>·</span>
                <span>Manager: {person.manager}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Daily Average</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{person.daily_active_avg_hours}h</p>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Linked Laptops</p>
              <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{linkedDevices.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <TabsList>
          <TabTrigger
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Activity Overview & Endpoints</span>
          </TabTrigger>

          <TabTrigger
            active={activeTab === 'annual'}
            onClick={() => setActiveTab('annual')}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Annual Review History (12-Month)</span>
          </TabTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Linked Devices Card */}
            <Card>
              <CardHead>
                <CardTitle>
                  <Laptop className="h-4 w-4 text-indigo-500" />
                  <span>Enrolled Hardware Endpoints ({linkedDevices.length})</span>
                </CardTitle>
                <span className="text-xs text-slate-500 font-mono">
                  Activity aggregates automatically across laptop replacements
                </span>
              </CardHead>

              <CardBody className="divide-y divide-slate-100 dark:divide-slate-800/60 p-0">
                {linkedDevices.map((dev) => (
                  <div
                    key={dev.id}
                    onClick={() => navigateTo(`/devices/${dev.id}`, { deviceId: dev.id })}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <StatusDot status={dev.verdict.flags.length > 0 ? 'flagged' : dev.status} />
                      <div>
                        <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {dev.hostname} <span className="font-mono font-normal text-slate-400">({dev.os_version})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-md">
                          Current Focus: {dev.current_app} · "{dev.current_window}"
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono">
                      <span className="text-indigo-600 dark:text-indigo-400 font-medium">Inspect Forensics →</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Last seen: {formatRelativeTime(dev.last_seen)}</p>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* Recent Days Rollup */}
            <Card>
              <CardHead>
                <CardTitle>
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>Recent Days Activity Rollup</span>
                </CardTitle>
                <span className="text-xs text-slate-500 font-mono">Past 5 Working Days</span>
              </CardHead>

              <CardBody className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 text-[11px] uppercase">
                        <th className="py-2.5 px-4">Date</th>
                        <th className="py-2.5 px-4">Active Hours</th>
                        <th className="py-2.5 px-4">Idle Ratio</th>
                        <th className="py-2.5 px-4">App Sessions</th>
                        <th className="py-2.5 px-4 text-right">Anomalies</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {person.recent_days_rollup.map((r) => (
                        <tr key={r.date} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                            {r.date}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                            {r.active_hours.toFixed(2)} hrs
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {r.idle_ratio_pct.toFixed(1)}%
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            {r.sessions_count} sessions
                          </td>
                          <td className="py-3 px-4 text-right">
                            {r.flags.length > 0 ? (
                              <Badge tone="danger" size="sm">
                                ⚠ {r.flags.join(', ')}
                              </Badge>
                            ) : (
                              <Badge tone="ok" size="sm">
                                Nominal
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Tab 2: Annual Review History */}
        {activeTab === 'annual' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 12-Month Bar Chart with Benchmark Line */}
            <Card>
              <CardHead>
                <CardTitle>
                  <Award className="h-4 w-4 text-indigo-500" />
                  <span>12-Month Engagement History & Benchmark (Oct 2025 — Sep 2026)</span>
                </CardTitle>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-xs bg-indigo-600" />
                    <span>Active Hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-xs bg-slate-300 dark:bg-slate-600" />
                    <span>Company Benchmark</span>
                  </div>
                </div>
              </CardHead>

              <CardBody className="space-y-6">
                <div className="h-48 flex items-end gap-2 pt-6 pb-2">
                  {person.monthly_history.map((m) => {
                    const activePct = Math.round((m.active_hours / maxMonthlyHours) * 100);
                    const benchmarkPct = Math.round((m.benchmark_avg_hours / maxMonthlyHours) * 100);
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                        {/* Tooltip */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10 shadow-xs">
                          <p>{m.month}: {m.active_hours}h active</p>
                          <p className="text-slate-400">Benchmark: {m.benchmark_avg_hours}h</p>
                        </div>

                        {/* Comparative Bars */}
                        <div className="w-full flex items-end justify-center gap-0.5 h-full">
                          <div
                            className="w-1/2 rounded-xs bg-indigo-600 dark:bg-indigo-500 transition-all"
                            style={{ height: `${activePct}%` }}
                          />
                          <div
                            className="w-1/2 rounded-xs bg-slate-200 dark:bg-slate-700 transition-all"
                            style={{ height: `${benchmarkPct}%` }}
                          />
                        </div>

                        <span className="text-[10px] text-slate-400 font-mono mt-2 select-none whitespace-nowrap">
                          {m.month.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Non-punitive metric framing disclaimer */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Non-Punitive Metric Framing Notice:</span>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed">
                    This timeline records system engagement and presence for transparent workflow planning. It is not an employee performance grade. All metrics comply with international workplace privacy covenants.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
