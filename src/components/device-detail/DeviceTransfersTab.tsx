import React, { useState } from 'react';
import { DeviceTelemetry, FileTransferEvent } from '../../types';
import { useApp } from '../../context/AppContext';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  HardDrive, 
  Cloud, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Copy, 
  Terminal,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  FileText
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DeviceTransfersTabProps {
  device: DeviceTelemetry;
}

export const DeviceTransfersTab: React.FC<DeviceTransfersTabProps> = ({ device }) => {
  const { fileTransfers, downloadForensicTransferReport, simulateTransfer, showToast } = useApp();

  const deviceTransfers = fileTransfers.filter(f => f.reporting_device_id === device.id);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const getFileIcon = (ext: string) => {
    const e = ext.toLowerCase();
    if (e === '.xlsx' || e === '.csv') return <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />;
    if (e === '.tar.gz' || e === '.zip') return <FileArchive className="h-4 w-4 text-amber-500 shrink-0" />;
    if (e === '.sql' || e === '.env' || e === '.pem') return <FileCode className="h-4 w-4 text-rose-500 shrink-0" />;
    if (e === '.exe' || e === '.pkg') return <Terminal className="h-4 w-4 text-purple-500 shrink-0" />;
    return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    showToast('SHA-256 copied to clipboard');
  };

  const blockedCount = deviceTransfers.filter(f => f.action_decision === 'BLOCKED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Quick Status Banner */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
              Endpoint Data Loss Prevention (DLP) Status
            </span>
            {blockedCount > 0 ? (
              <Badge tone="danger" size="sm">
                {blockedCount} Violations Intercepted
              </Badge>
            ) : (
              <Badge tone="ok" size="sm">
                Clean · Normal Activity
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Active kernel driver monitors USB mass storage writes, inbound web downloads, and cloud sync operations on {device.hostname}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => simulateTransfer('download')}
            className="text-xs"
          >
            <ArrowDownToLine className="h-3.5 w-3.5 text-rose-500" />
            Test Inbound Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => simulateTransfer('usb')}
            className="text-xs"
          >
            <HardDrive className="h-3.5 w-3.5 text-purple-500" />
            Test USB Egress
          </Button>
        </div>
      </div>

      {/* Transfers Table */}
      <Card className="border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs">
        <CardHead className="py-3 px-5">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <ArrowDownToLine className="h-3.5 w-3.5 text-indigo-500" />
            <span>Intercepted File I/O & Download Events ({deviceTransfers.length})</span>
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-400">
            Immutable SHA-256 Audit Trail
          </span>
        </CardHead>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">File Name</th>
                <th className="py-2.5 px-4">Channel / Destination</th>
                <th className="py-2.5 px-4">SHA-256 Checksum</th>
                <th className="py-2.5 px-4">DLP Decision</th>
                <th className="py-2.5 px-4">Process / PID</th>
                <th className="py-2.5 px-4 text-right">Audit Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {deviceTransfers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No file transfers or download alerts recorded on this machine today.
                  </td>
                </tr>
              ) : (
                deviceTransfers.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getFileIcon(item.file_extension)}
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                            <span>{item.file_name}</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">
                            {formatFileSize(item.file_size_bytes)}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[220px]" title={item.destination_target}>
                        {item.destination_target}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.destination_type}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                          {item.file_hash_sha256.substring(0, 10)}...
                        </code>
                        <button
                          type="button"
                          onClick={() => copyHash(item.file_hash_sha256)}
                          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {item.action_decision === 'BLOCKED' ? (
                          <Badge tone="danger" size="sm">BLOCKED</Badge>
                        ) : item.action_decision === 'QUARANTINED' ? (
                          <Badge tone="warn" size="sm">QUARANTINED</Badge>
                        ) : (
                          <Badge tone="ok" size="sm">ALLOWED</Badge>
                        )}
                        {item.dlp_violation_rule && (
                          <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 truncate max-w-[180px]">
                            {item.dlp_violation_rule}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                        {item.initiating_process}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadForensicTransferReport(item.id)}
                        className="text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" /> Dossier
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
