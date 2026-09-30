import React from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { FirewallEvent } from '../../types';
import { ShieldAlert, Terminal, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface PacketInspectorModalProps {
  event: FirewallEvent | null;
  onClose: () => void;
}

export const PacketInspectorModal: React.FC<PacketInspectorModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <Dialog
      open={!!event}
      onClose={onClose}
      title="Deep Packet & Payload Forensics"
      description={`Packet intercept logged from ${event.device_name}`}
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs font-mono">
        {/* Summary Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 font-sans">
              <ShieldAlert className="h-4 w-4 text-rose-500" />
              <span>Verdict: {event.decision}</span>
            </span>
            <Badge tone={event.severity === 'CRITICAL' ? 'danger' : 'warn'} size="sm">
              {event.severity} SEVERITY
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
            <p>Matched Policy: <span className="text-slate-900 dark:text-slate-200">{event.rule_name}</span></p>
            <p>Inspection Layer: <span className="text-slate-900 dark:text-slate-200">{event.matched_layer}</span></p>
            <p>Target Endpoint: <span className="text-slate-900 dark:text-slate-200">{event.target}</span></p>
            <p>OS Socket Teardown: <span className="text-emerald-500 font-bold">{event.teardown_executed ? 'EXECUTED (MIB_TCP_STATE_DELETE_TCB)' : 'NOT REQUIRED'}</span></p>
          </div>
        </div>

        {/* Payload / SNI Analysis */}
        <div className="space-y-1.5">
          <label className="block font-sans font-semibold text-slate-700 dark:text-slate-300">
            Raw Socket Signal & Ingress Analysis
          </label>
          <div className="p-3.5 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
            {event.payload_summary || 'Ingress packet matched zero-trust policy. TCP connection severed before handshake completion.'}
          </div>
        </div>

        {/* JSON Dump */}
        <div className="space-y-1.5">
          <label className="block font-sans font-semibold text-slate-700 dark:text-slate-300">
            Normalized Event Record (signal_events table)
          </label>
          <pre className="p-3.5 rounded-xl bg-slate-950 text-indigo-300 border border-slate-800 text-[10px] overflow-x-auto">
            {JSON.stringify(event, null, 2)}
          </pre>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
