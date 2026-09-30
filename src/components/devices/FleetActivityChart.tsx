import React from 'react';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { BarChart3 } from 'lucide-react';

export const FleetActivityChart: React.FC = () => {
  // Aggregate 24h fleet active hours distribution
  const hoursData = [
    { hour: '00:00', minutes: 0 },
    { hour: '01:00', minutes: 0 },
    { hour: '02:00', minutes: 0 },
    { hour: '03:00', minutes: 0 },
    { hour: '04:00', minutes: 0 },
    { hour: '05:00', minutes: 12 },
    { hour: '06:00', minutes: 45 },
    { hour: '07:00', minutes: 110 },
    { hour: '08:00', minutes: 280 },
    { hour: '09:00', minutes: 460 },
    { hour: '10:00', minutes: 540 },
    { hour: '11:00', minutes: 580 },
    { hour: '12:00', minutes: 420 }, // Lunch dip
    { hour: '13:00', minutes: 530 },
    { hour: '14:00', minutes: 560 },
    { hour: '15:00', minutes: 520 },
    { hour: '16:00', minutes: 480 },
    { hour: '17:00', minutes: 340 },
    { hour: '18:00', minutes: 180 },
    { hour: '19:00', minutes: 70 },
    { hour: '20:00', minutes: 30 },
    { hour: '21:00', minutes: 10 },
    { hour: '22:00', minutes: 0 },
    { hour: '23:00', minutes: 0 },
  ];

  const maxVal = Math.max(...hoursData.map(h => h.minutes));

  return (
    <Card className="mt-6">
      <CardHead>
        <CardTitle>
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          <span>Fleet Active Hours Distribution (24-Hour Profile)</span>
        </CardTitle>
        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Peak Active Window: 10:00–16:00
        </div>
      </CardHead>
      <CardBody>
        <div className="h-32 flex items-end gap-1.5 pt-4">
          {hoursData.map((d, i) => {
            const heightPct = Math.round((d.minutes / maxVal) * 100);
            const isWorkingHour = i >= 9 && i <= 17;
            return (
              <div key={d.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-10 shadow-xs">
                  {d.hour}: {d.minutes}m
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-xs transition-all duration-300 ${
                    isWorkingHour
                      ? 'bg-indigo-600 dark:bg-indigo-500 group-hover:bg-indigo-400'
                      : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                  }`}
                  style={{ height: `${Math.max(4, heightPct)}%` }}
                />

                {/* Hour label on alternate markers */}
                {i % 3 === 0 && (
                  <span className="text-[10px] text-slate-400 font-mono mt-1 select-none">
                    {d.hour.split(':')[0]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
