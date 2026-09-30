import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Users, Link2, ChevronRight, Laptop } from 'lucide-react';
import { StatusDot } from '../components/StatusDot';

export const PeoplePage: React.FC = () => {
  const { people, reconcilePeople, navigateTo, devices } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            People Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Activity & engagement grouped per employee. History follows the person across hardware upgrades.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={reconcilePeople}
          className="cursor-pointer"
        >
          <Link2 className="h-3.5 w-3.5 text-indigo-500" />
          <span>Link Devices to People</span>
        </Button>
      </div>

      {/* People Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Person</th>
                <th className="py-3 px-4 font-medium">Assigned Shift</th>
                <th className="py-3 px-4 font-medium">Linked Laptops</th>
                <th className="py-3 px-4 font-medium">Daily Active Avg</th>
                <th className="py-3 px-4 font-medium">Cadence Verdict</th>
                <th className="py-3 px-4 font-medium text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {people.map((person) => {
                const linkedDevices = devices.filter(d => person.linked_device_ids.includes(d.id));
                return (
                  <tr
                    key={person.id}
                    onClick={() => navigateTo(`/people/${person.id}`, { personId: person.id })}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    {/* Person */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold font-mono flex items-center justify-center text-xs">
                          {person.avatar_initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {person.full_name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {person.email} · {person.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Shift */}
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {person.shift}
                    </td>

                    {/* Linked Hardware */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {linkedDevices.map(d => (
                          <div
                            key={d.id}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/70 text-[11px] font-mono border border-slate-200/60 dark:border-slate-700/60"
                          >
                            <StatusDot status={d.verdict.flags.length > 0 ? 'flagged' : d.status} />
                            <span>{d.hostname}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Daily Avg */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {person.daily_active_avg_hours.toFixed(1)} hrs/day
                    </td>

                    {/* Cadence Verdict */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        tone={
                          person.engagement_verdict === 'genuine'
                            ? 'ok'
                            : person.engagement_verdict === 'automated-looking'
                            ? 'danger'
                            : 'warn'
                        }
                        size="sm"
                        className="capitalize"
                      >
                        {person.engagement_verdict}
                      </Badge>
                    </td>

                    {/* Arrow */}
                    <td className="py-3.5 px-4 text-right">
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all inline-block" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
