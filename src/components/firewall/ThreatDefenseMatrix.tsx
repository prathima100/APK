import React from 'react';
import { ThreatDetectorInfo } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { ShieldAlert, ShieldCheck, Terminal, Cpu, Radio, Network, Key, HardDrive } from 'lucide-react';
import { Badge } from '../ui/badge';
import { formatRelativeTime } from '../../lib/utils';

export interface ThreatDefenseMatrixProps {
  sensors: ThreatDetectorInfo[];
}

export const ThreatDefenseMatrix: React.FC<ThreatDefenseMatrixProps> = ({ sensors }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ip_spoof': return Network;
      case 'hotspot': return Radio;
      case 'proxy': return ShieldAlert;
      case 'jailbreak_root': return Terminal;
      case 'device_attestation': return Cpu;
      case 'payload_integrity': return Key;
      case 'data_leak': return HardDrive;
      default: return ShieldCheck;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>7 Autonomous Endpoint Threat Sensors</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kernel-level sensors operating concurrently inside the Arohak endpoint daemon.
          </p>
        </div>
        <Badge tone="ok" size="sm">
          7 of 7 Sensors Online
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => {
          const Icon = getIcon(sensor.id);
          return (
            <Card key={sensor.id} className="flex flex-col justify-between">
              <CardHead className="pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xs font-bold leading-tight">
                      {sensor.name}
                    </CardTitle>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {sensor.tag}
                    </p>
                  </div>
                </div>

                <Badge tone="ok" size="sm">
                  {sensor.status}
                </Badge>
              </CardHead>

              <CardBody className="space-y-3 pt-2 text-xs">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {sensor.summary}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-slate-400 font-semibold block">
                    OS Telemetry Probe:
                  </span>
                  <p className="text-[10px] font-mono text-slate-700 dark:text-slate-300 leading-snug">
                    {sensor.technical_probe}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2">
                  <span>Detections 24h: {sensor.detections_24h}</span>
                  <span>Last heartbeat: {formatRelativeTime(sensor.last_probe_event)}</span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
