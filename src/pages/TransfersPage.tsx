import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHead, CardTitle, CardBody } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Dialog } from '../components/ui/dialog';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  HardDrive, 
  Cloud, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  FileText, 
  FileCode, 
  FileArchive, 
  FileSpreadsheet, 
  Copy, 
  Download, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  Lock,
  Filter,
  RefreshCw,
  Terminal,
  Radio
} from 'lucide-react';
import { cn } from '../lib/utils';
import { FileTransferEvent, FileDestinationType } from '../types';

export const TransfersPage: React.FC = () => {
  const { 
    fileTransfers, 
    downloadForensicTransferReport, 
    simulateTransfer, 
    navigateTo, 
    showToast 
  } = useApp();

  const [search, setSearch] = useState('');
  const [destFilter, setDestFilter] = useState<'ALL' | FileDestinationType>('ALL');
  const [verdictFilter, setVerdictFilter] = useState<'ALL' | 'BLOCKED' | 'QUARANTINED' | 'ALLOWED'>('ALL');
  const [selectedTransferForModal, setSelectedTransferForModal] = useState<FileTransferEvent | null>(null);

  // Policy toggles state
  const [policies, setPolicies] = useState({
    usbDlp: true,
    inboundExeDrop: true,
    secretsInterception: true,
    cloudSyncThrottle: true
  });

  const togglePolicy = (key: keyof typeof policies, name: string) => {
    setPolicies(prev => {
      const next = !prev[key];
      showToast(`${name}: ${next ? 'Enforced' : 'Disabled (Audit Only)'}`);
      return { ...prev, [key]: next };
    });
  };

  // Metrics
  const totalCount = fileTransfers.length;
  const blockedCount = fileTransfers.filter(f => f.action_decision === 'BLOCKED').length;
  const quarantinedCount = fileTransfers.filter(f => f.action_decision === 'QUARANTINED').length;
  const usbCount = fileTransfers.filter(f => f.destination_type === 'USB_STORAGE').length;
  const totalBytes = fileTransfers.reduce((acc, f) => acc + f.file_size_bytes, 0);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const getFileIcon = (ext: string) => {
    const e = ext.toLowerCase();
    if (e === '.xlsx' || e === '.csv') return <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />;
    if (e === '.tar.gz' || e === '.zip' || e === '.tar') return <FileArchive className="h-4 w-4 text-amber-500 shrink-0" />;
    if (e === '.sql' || e === '.env' || e === '.pem' || e === '.key') return <FileCode className="h-4 w-4 text-rose-500 shrink-0" />;
    if (e === '.exe' || e === '.pkg' || e === '.bat') return <Terminal className="h-4 w-4 text-purple-500 shrink-0" />;
    return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
  };

  const getDestinationBadge = (type: FileDestinationType) => {
    switch (type) {
      case 'USB_STORAGE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            <HardDrive className="h-3 w-3" /> Removable USB
          </span>
        );
      case 'CLOUD_SYNC':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <Cloud className="h-3 w-3" /> Cloud Storage
          </span>
        );
      case 'BROWSER_UPLOAD':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <ArrowUpFromLine className="h-3 w-3" /> Web Egress
          </span>
        );
      case 'DOWNLOAD_INBOUND':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
            <ArrowDownToLine className="h-3 w-3" /> Inbound Download
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            Network Share
          </span>
        );
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    showToast(`Copied SHA-256 hash to clipboard`);
  };

  // Filtered list
  const filteredTransfers = fileTransfers.filter(item => {
    const matchesSearch = 
      item.file_name.toLowerCase().includes(search.toLowerCase()) ||
      item.file_hash_sha256.toLowerCase().includes(search.toLowerCase()) ||
      item.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      item.reporting_device_name.toLowerCase().includes(search.toLowerCase()) ||
      item.initiating_process.toLowerCase().includes(search.toLowerCase()) ||
      (item.dlp_violation_rule && item.dlp_violation_rule.toLowerCase().includes(search.toLowerCase()));

    const matchesDest = destFilter === 'ALL' || item.destination_type === destFilter;
    const matchesVerdict = verdictFilter === 'ALL' || item.action_decision === verdictFilter;

    return matchesSearch && matchesDest && matchesVerdict;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Simulation Trigger Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-800/60">
              Data Loss Prevention · Live Sentinel
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Kernel Hook Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            File Transfers & Download Sentinel
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Continuous kernel monitoring of web browser downloads, mass storage USB transfers, cloud synchronizations, and unapproved data egress. Enforces zero-trust DLP guardrails and captures immutable SHA-256 forensic fingerprints.
          </p>
        </div>

        {/* Live Simulation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => simulateTransfer('download')}
            className="text-xs border-slate-200 dark:border-slate-700 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
            title="Simulate employee attempting to download suspicious executable installer"
          >
            <ArrowDownToLine className="h-3.5 w-3.5 text-rose-500" />
            <span>Simulate Inbound Download</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => simulateTransfer('usb')}
            className="text-xs border-slate-200 dark:border-slate-700 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
            title="Simulate writing confidential customer records to USB flash drive"
          >
            <HardDrive className="h-3.5 w-3.5 text-purple-500" />
            <span>Simulate USB Egress</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => simulateTransfer('cloud')}
            className="text-xs border-slate-200 dark:border-slate-700 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
            title="Simulate uploading production credentials to anonymous cloud"
          >
            <Cloud className="h-3.5 w-3.5 text-amber-500" />
            <span>Simulate Secrets Egress</span>
          </Button>
        </div>
      </div>

      {/* 2. 5-Card Forensic KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="p-4 border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Total Intercepts (24h)</span>
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
            {totalCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            All endpoints reporting
          </p>
        </Card>

        <Card className="p-4 border-rose-200/80 dark:border-rose-900/40 bg-rose-500/5">
          <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 mb-1">
            <span>Blocked by Policy</span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
            {blockedCount}
          </div>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mt-1">
            Immediate kernel drop
          </p>
        </Card>

        <Card className="p-4 border-amber-200/80 dark:border-amber-900/40 bg-amber-500/5">
          <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 mb-1">
            <span>Quarantined Artifacts</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400 tabular-nums">
            {quarantinedCount}
          </div>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">
            Held in sandboxed isolation
          </p>
        </Card>

        <Card className="p-4 border-purple-200/80 dark:border-purple-900/40 bg-purple-500/5">
          <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 mb-1">
            <span>Removable USB Writes</span>
            <HardDrive className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-purple-600 dark:text-purple-400 tabular-nums">
            {usbCount}
          </div>
          <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80 mt-1">
            Mass storage transfers
          </p>
        </Card>

        <Card className="p-4 border-blue-200/80 dark:border-blue-900/40 bg-blue-500/5 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 mb-1">
            <span>Total Volume Monitored</span>
            <Radio className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">
            {formatFileSize(totalBytes)}
          </div>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 mt-1">
            Inbound & outbound payload
          </p>
        </Card>
      </div>

      {/* 3. Active DLP Guardrails & Enforcement Toggles */}
      <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60">
        <CardHead className="py-3 px-5">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-indigo-500" /> Active Endpoint DLP Policies & File Gateways
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-500">
            Real-time enforcement across macOS & Windows
          </span>
        </CardHead>
        <CardBody className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Policy 1: USB Mass Storage */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-purple-500" /> USB Mass Storage DLP
                </span>
                <span className={cn('h-2 w-2 rounded-full', policies.usbDlp ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-400')} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                Block writing unencrypted business spreadsheets, databases, and HR compensation files to USB flash storage.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Policy: DROP_BLOCK</span>
              <button
                type="button"
                onClick={() => togglePolicy('usbDlp', 'USB Mass Storage DLP')}
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors',
                  policies.usbDlp 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                {policies.usbDlp ? 'Enforced' : 'Audit Only'}
              </button>
            </div>
          </div>

          {/* Policy 2: Inbound Executable Sentinel */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ArrowDownToLine className="h-3.5 w-3.5 text-rose-500" /> Inbound Download Drop
                </span>
                <span className={cn('h-2 w-2 rounded-full', policies.inboundExeDrop ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-400')} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                Scan all browser downloads. Intercept unsigned .exe, .pkg, .bat, or malicious scripts from non-approved CDN origins.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Policy: DROP_BLOCK</span>
              <button
                type="button"
                onClick={() => togglePolicy('inboundExeDrop', 'Inbound Download Sentinel')}
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors',
                  policies.inboundExeDrop 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                {policies.inboundExeDrop ? 'Enforced' : 'Audit Only'}
              </button>
            </div>
          </div>

          {/* Policy 3: Secrets & Key Interception */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-amber-500" /> Private Key & Secret Guard
                </span>
                <span className={cn('h-2 w-2 rounded-full', policies.secretsInterception ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-400')} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                Regex inspection for SSH private keys, .pem certs, AWS secrets, and database environment files during egress.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Policy: QUARANTINE</span>
              <button
                type="button"
                onClick={() => togglePolicy('secretsInterception', 'Private Key & Secret Guard')}
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors',
                  policies.secretsInterception 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                {policies.secretsInterception ? 'Enforced' : 'Audit Only'}
              </button>
            </div>
          </div>

          {/* Policy 4: Cloud Sync Throttle */}
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5 text-blue-500" /> Cloud Sync Exfiltration
                </span>
                <span className={cn('h-2 w-2 rounded-full', policies.cloudSyncThrottle ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-400')} />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                Restrict synchronization of proprietary repositories or exports over 200MB to unapproved personal storage services.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">Policy: DROP_BLOCK</span>
              <button
                type="button"
                onClick={() => togglePolicy('cloudSyncThrottle', 'Cloud Sync Exfiltration')}
                className={cn(
                  'text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors',
                  policies.cloudSyncThrottle 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                )}
              >
                {policies.cloudSyncThrottle ? 'Enforced' : 'Audit Only'}
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 4. Filter Toolbar & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search filename, SHA-256 hash, process, owner, or device..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Destination Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setDestFilter('ALL')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium',
                destFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              All Types
            </button>
            <button
              onClick={() => setDestFilter('DOWNLOAD_INBOUND')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium flex items-center gap-1',
                destFilter === 'DOWNLOAD_INBOUND' ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <ArrowDownToLine className="h-3 w-3" /> Downloads
            </button>
            <button
              onClick={() => setDestFilter('USB_STORAGE')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium flex items-center gap-1',
                destFilter === 'USB_STORAGE' ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <HardDrive className="h-3 w-3" /> USB
            </button>
            <button
              onClick={() => setDestFilter('CLOUD_SYNC')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium flex items-center gap-1',
                destFilter === 'CLOUD_SYNC' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Cloud className="h-3 w-3" /> Cloud
            </button>
            <button
              onClick={() => setDestFilter('BROWSER_UPLOAD')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium flex items-center gap-1',
                destFilter === 'BROWSER_UPLOAD' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <ArrowUpFromLine className="h-3 w-3" /> Uploads
            </button>
          </div>

          {/* Verdict Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setVerdictFilter('ALL')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium',
                verdictFilter === 'ALL' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              All Verdicts
            </button>
            <button
              onClick={() => setVerdictFilter('BLOCKED')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium text-rose-600 dark:text-rose-400',
                verdictFilter === 'BLOCKED' ? 'bg-white dark:bg-slate-900 shadow-2xs font-bold ring-1 ring-rose-500/30' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              Blocked
            </button>
            <button
              onClick={() => setVerdictFilter('QUARANTINED')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium text-amber-600 dark:text-amber-400',
                verdictFilter === 'QUARANTINED' ? 'bg-white dark:bg-slate-900 shadow-2xs font-bold ring-1 ring-amber-500/30' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              Quarantine
            </button>
            <button
              onClick={() => setVerdictFilter('ALLOWED')}
              className={cn(
                'px-2 py-1 rounded-md transition-colors cursor-pointer text-[11px] font-medium text-emerald-600 dark:text-emerald-400',
                verdictFilter === 'ALLOWED' ? 'bg-white dark:bg-slate-900 shadow-2xs font-bold ring-1 ring-emerald-500/30' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              Allowed
            </button>
          </div>
        </div>
      </div>

      {/* 5. Interactive Forensic Transfers & Downloads Table */}
      <Card className="border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Artifact / File Name</th>
                <th className="py-3 px-4">Channel / Destination</th>
                <th className="py-3 px-4">SHA-256 Checksum</th>
                <th className="py-3 px-4">Reporting Machine & Custodian</th>
                <th className="py-3 px-4">DLP Verdict & Rule</th>
                <th className="py-3 px-4">Process / PID</th>
                <th className="py-3 px-4 text-right">Forensic Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
              {filteredTransfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No file transfers or download events matching current search parameters.
                  </td>
                </tr>
              ) : (
                filteredTransfers.map((item) => {
                  const isBlocked = item.action_decision === 'BLOCKED';
                  const isQuarantine = item.action_decision === 'QUARANTINED';
                  return (
                    <tr
                      key={item.id}
                      className={cn(
                        'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors',
                        isBlocked && 'bg-rose-500/3'
                      )}
                    >
                      {/* File Name & Size */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {getFileIcon(item.file_extension)}
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <span>{item.file_name}</span>
                              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {item.file_extension}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              {formatFileSize(item.file_size_bytes)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Channel / Destination */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {getDestinationBadge(item.destination_type)}
                          <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate max-w-[200px]" title={item.destination_target}>
                            {item.destination_target}
                          </div>
                        </div>
                      </td>

                      {/* SHA-256 Checksum */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 group">
                          <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/70 px-1.5 py-0.5 rounded max-w-[130px] truncate" title={item.file_hash_sha256}>
                            {item.file_hash_sha256.substring(0, 10)}...{item.file_hash_sha256.substring(item.file_hash_sha256.length - 6)}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyHash(item.file_hash_sha256)}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                            title="Copy full SHA-256 fingerprint"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        </div>
                      </td>

                      {/* Reporting Machine & Custodian */}
                      <td className="py-3 px-4">
                        <div>
                          <button
                            type="button"
                            onClick={() => navigateTo(`/devices/${item.reporting_device_id}`)}
                            className="font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 text-left cursor-pointer"
                          >
                            <Laptop className="h-3 w-3 text-slate-400" />
                            <span>{item.reporting_device_name}</span>
                          </button>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.owner_name}
                          </div>
                        </div>
                      </td>

                      {/* DLP Verdict & Rule */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div>
                            {isBlocked ? (
                              <Badge tone="danger" size="sm">
                                <ShieldAlert className="h-3 w-3 mr-1" /> BLOCKED
                              </Badge>
                            ) : isQuarantine ? (
                              <Badge tone="warn" size="sm">
                                <AlertTriangle className="h-3 w-3 mr-1" /> QUARANTINED
                              </Badge>
                            ) : (
                              <Badge tone="ok" size="sm">
                                <ShieldCheck className="h-3 w-3 mr-1" /> ALLOWED
                              </Badge>
                            )}
                          </div>
                          {item.dlp_violation_rule && (
                            <div className="text-[10px] font-mono text-rose-600 dark:text-rose-400 font-medium truncate max-w-[200px]" title={item.dlp_violation_rule}>
                              {item.dlp_violation_rule}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Process / PID */}
                      <td className="py-3 px-4">
                        <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                          {item.initiating_process}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedTransferForModal(item)}
                            className="px-2 py-1 rounded text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                            title="Inspect complete file forensic dossier"
                          >
                            Inspect
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadForensicTransferReport(item.id)}
                            className="p-1 rounded text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Download cryptographic audit dossier report"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 6. Detailed Forensic Dossier Dialog */}
      {selectedTransferForModal && (
        <Dialog
          open={!!selectedTransferForModal}
          onClose={() => setSelectedTransferForModal(null)}
          title="Cryptographic File Forensic Dossier"
          description={`Immutable audit artifact for ${selectedTransferForModal.file_name}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedTransferForModal.file_extension)}
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {selectedTransferForModal.file_name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-500">
                    {formatFileSize(selectedTransferForModal.file_size_bytes)} · {selectedTransferForModal.file_extension}
                  </p>
                </div>
              </div>

              <div>
                {selectedTransferForModal.action_decision === 'BLOCKED' ? (
                  <Badge tone="danger" size="md">BLOCKED BY KERNEL</Badge>
                ) : selectedTransferForModal.action_decision === 'QUARANTINED' ? (
                  <Badge tone="warn" size="md">SANDBOX QUARANTINE</Badge>
                ) : (
                  <Badge tone="ok" size="md">APPROVED PASS</Badge>
                )}
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-200 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>SHA-256 Cryptographic Checksum</span>
                <button
                  type="button"
                  onClick={() => copyHash(selectedTransferForModal.file_hash_sha256)}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 cursor-pointer"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <div className="break-all text-[11px] text-emerald-400 select-all">
                {selectedTransferForModal.file_hash_sha256}
              </div>
            </div>

            {/* Forensic Metadata Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Local Source Path</span>
                <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all mt-0.5">
                  {selectedTransferForModal.source_path}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Target Destination</span>
                <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all mt-0.5">
                  {selectedTransferForModal.destination_target}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Endpoint Machine</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedTransferForModal.reporting_device_name} ({selectedTransferForModal.reporting_device_id})
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Employee Custodian</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedTransferForModal.owner_name} &lt;{selectedTransferForModal.owner_email}&gt;
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Initiating Process</span>
                <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                  {selectedTransferForModal.initiating_process}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Timestamp</span>
                <p className="font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                  {new Date(selectedTransferForModal.timestamp).toUTCString()}
                </p>
              </div>
            </div>

            {/* Violation & Defense Action */}
            {selectedTransferForModal.dlp_violation_rule && (
              <div className="p-3.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-500/10 text-rose-700 dark:text-rose-300">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                  <span>DLP Policy Triggered: {selectedTransferForModal.dlp_violation_rule}</span>
                </div>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-relaxed">
                  The Arohak MDM kernel driver intercepted this filesystem I/O request. The file transfer was terminated immediately to prevent unauthorized egress. An immutable log entry was recorded in the enterprise SOC audit trail.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                NIST SP 800-53 Rev 5 · Media Protection (MP) Compliant
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadForensicTransferReport(selectedTransferForModal.id)}
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> Export Audit File
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedTransferForModal(null)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
