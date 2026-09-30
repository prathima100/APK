import React, { useState } from 'react';
import { 
  X, 
  Home, 
  Laptop, 
  Activity, 
  ShieldAlert, 
  Wifi, 
  Smartphone, 
  AlertTriangle,
  HardDrive,
  Cpu,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  FolderGit2,
  Download,
  Copy,
  ExternalLink,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusDot } from '../StatusDot';
import { formatDuration, formatBytes, cn } from '../../lib/utils';

export const AndroidMdmSimulator: React.FC = () => {
  const { 
    isMdmSimulatorOpen, 
    setIsMdmSimulatorOpen, 
    devices, 
    threatSensors, 
    firewallEvents, 
    fileTransfers,
    onlineCount, 
    flaggedCountToday, 
    totalFleetHours,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'home' | 'devices' | 'activity' | 'security' | 'transfers'>('home');
  const [selectedMobileDevice, setSelectedMobileDevice] = useState(devices[0]);
  const [searchDevice, setSearchDevice] = useState('');
  const [showApkInfo, setShowApkInfo] = useState(false);

  if (!isMdmSimulatorOpen) return null;

  const filteredDevices = devices.filter(d => 
    d.hostname.toLowerCase().includes(searchDevice.toLowerCase()) ||
    d.owner_name.toLowerCase().includes(searchDevice.toLowerCase())
  );

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      {/* Container with dismissal */}
      <div className="relative flex flex-col items-center">
        {/* Top Controls: APK Folder & Dismiss */}
        <div className="absolute -top-12 right-0 left-0 flex items-center justify-between w-[360px]">
          <button
            onClick={() => setShowApkInfo(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-blue-500/20"
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            <span>📁 APK Folder Info</span>
          </button>

          <button
            onClick={() => setIsMdmSimulatorOpen(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Close</span>
          </button>
        </div>

        {/* Android Device Frame */}
        <div className="w-[360px] h-[720px] rounded-[44px] bg-slate-900 border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-700/50">
          {/* Status Bar */}
          <div className="h-8 bg-slate-950 px-6 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-20">
            <span>09:41</span>
            {/* Camera Hole Punch */}
            <div className="h-3.5 w-3.5 rounded-full bg-slate-900 ring-2 ring-slate-800" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 border border-slate-400 rounded-2xs p-0.5 flex items-center">
                <div className="w-2.5 h-full bg-slate-400 rounded-3xs" />
              </div>
            </div>
          </div>

          {/* App Header (com.arohak.mdm) */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold">
                A
              </div>
              <div>
                <h1 className="text-xs font-bold text-white tracking-tight">Arohak MDM</h1>
                <p className="text-[9px] font-mono text-emerald-400">v2.4-android · enrolled</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400">Sync OK</span>
            </div>
          </div>

          {/* Fragment Content Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-950 text-slate-100 text-xs">
            {/* 1. HOME FRAGMENT */}
            {activeTab === 'home' && (
              <div className="space-y-3 animate-in fade-in duration-100">
                {/* Fleet Health Card */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Fleet Health</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">98% Secure</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <p className="text-[10px] text-slate-400">Online</p>
                      <p className="text-base font-bold font-mono text-emerald-400 mt-0.5">{onlineCount}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <p className="text-[10px] text-slate-400">Offline</p>
                      <p className="text-base font-bold font-mono text-slate-300 mt-0.5">{devices.length - onlineCount}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/60">
                      <p className="text-[10px] text-slate-400">Flagged</p>
                      <p className="text-base font-bold font-mono text-rose-400 mt-0.5">{flaggedCountToday}</p>
                    </div>
                  </div>
                </div>

                {/* Threat Banner */}
                {flaggedCountToday > 0 ? (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold text-rose-300">1 Device Flagged Today</p>
                      <p className="text-[10px] text-rose-400/80 mt-0.5">Dev-Flagged-08: Synthetic cadence (mouse jiggler detected).</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/50 flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-emerald-300">All 42 fleet endpoints nominal</span>
                  </div>
                )}

                {/* Fleet Screen Time */}
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-300">Total Active Hours</span>
                    <span className="text-xs font-mono font-bold text-indigo-400">{totalFleetHours}h</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-mono">Real-time aggregate across all enrolled OS agents</p>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono text-slate-500 px-1">Quick Telemetry Jump</span>
                  {devices.slice(0, 3).map(d => (
                    <div 
                      key={d.id}
                      onClick={() => {
                        setSelectedMobileDevice(d);
                        setActiveTab('activity');
                      }}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <StatusDot status={d.verdict.flags.length > 0 ? 'flagged' : d.status} />
                        <div>
                          <p className="text-[11px] font-medium text-white">{d.hostname}</p>
                          <p className="text-[9px] text-slate-400 truncate max-w-[170px]">{d.current_app} · {d.owner_name}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. DEVICES FRAGMENT */}
            {activeTab === 'devices' && (
              <div className="space-y-3 animate-in fade-in duration-100">
                <input
                  type="text"
                  placeholder="Search laptops..."
                  value={searchDevice}
                  onChange={(e) => setSearchDevice(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                />

                <div className="space-y-2">
                  {filteredDevices.map(d => (
                    <div
                      key={d.id}
                      onClick={() => setSelectedMobileDevice(d)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedMobileDevice.id === d.id 
                          ? 'bg-slate-800/90 border-indigo-500/60 shadow-xs' 
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusDot status={d.verdict.flags.length > 0 ? 'flagged' : d.status} />
                          <span className="font-semibold text-[11px] text-white">{d.hostname}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{d.platform}</span>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400 space-y-0.5">
                        <p><span className="text-slate-500">Owner:</span> {d.owner_name}</p>
                        <p className="truncate"><span className="text-slate-500">Focus:</span> {d.current_app}</p>
                        <p><span className="text-slate-500">Uptime:</span> {formatDuration(d.uptime_sec)}</p>
                      </div>

                      {d.verdict.flags.length > 0 && (
                        <div className="mt-2 text-[9px] font-mono text-rose-300 bg-rose-950/60 border border-rose-900 px-2 py-0.5 rounded-md inline-block">
                          ⚠ Flagged: {d.verdict.flags.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. ACTIVITY FRAGMENT */}
            {activeTab === 'activity' && (
              <div className="space-y-3 animate-in fade-in duration-100">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-white">{selectedMobileDevice.hostname}</p>
                      <p className="text-[10px] text-slate-400">{selectedMobileDevice.owner_name}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {selectedMobileDevice.verdict.verdict.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Screen Time breakdown */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="text-[10px] font-mono uppercase text-slate-400">Screen Time Breakdown</p>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <div className="p-1.5 bg-slate-800/60 rounded-lg">
                      <p className="text-[9px] text-slate-400">Active</p>
                      <p className="text-[11px] font-mono font-bold text-emerald-400">
                        {formatDuration(selectedMobileDevice.active_screen_sec)}
                      </p>
                    </div>
                    <div className="p-1.5 bg-slate-800/60 rounded-lg">
                      <p className="text-[9px] text-slate-400">Locked</p>
                      <p className="text-[11px] font-mono font-bold text-slate-300">
                        {formatDuration(selectedMobileDevice.locked_sec)}
                      </p>
                    </div>
                    <div className="p-1.5 bg-slate-800/60 rounded-lg">
                      <p className="text-[9px] text-slate-400">Idle</p>
                      <p className="text-[11px] font-mono font-bold text-amber-400">
                        {selectedMobileDevice.raw_idle_sec}s
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top Apps List */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="text-[10px] font-mono uppercase text-slate-400">Top Applications</p>
                  <div className="space-y-2">
                    {selectedMobileDevice.top_apps.map((app, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-medium text-slate-200 truncate">{app.app}</span>
                          <span className="font-mono text-slate-400">{formatDuration(app.duration_sec)}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${app.share_pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SECURITY FRAGMENT */}
            {activeTab === 'security' && (
              <div className="space-y-3 animate-in fade-in duration-100">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] font-semibold text-white">7 Endpoint Threat Sensors</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Autonomous Zero-Trust OS Probes</p>
                </div>

                <div className="space-y-1.5">
                  {threatSensors.map(sensor => (
                    <div key={sensor.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="text-[10px] font-semibold text-slate-200">{sensor.name}</p>
                          <p className="text-[9px] font-mono text-slate-500">{sensor.tag}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>

                {/* Firewall Block Log */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-slate-400">Recent Intercepted Blocks</p>
                  {firewallEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} className="p-2 rounded-lg bg-slate-800/50 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-rose-400 font-semibold">{ev.decision}</span>
                        <span className="text-slate-500 font-mono">13:42</span>
                      </div>
                      <p className="text-slate-300 font-mono mt-0.5 truncate">{ev.target}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. NETWORK & TRANSFERS FRAGMENT */}
            {activeTab === 'transfers' && (
              <div className="space-y-3 animate-in fade-in duration-100">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-mono uppercase text-slate-400">File Transfers & Downloads</p>
                    <span className="text-[9px] font-mono text-emerald-400">DLP Active</span>
                  </div>
                  <div className="space-y-1.5">
                    {fileTransfers.slice(0, 3).map(f => (
                      <div key={f.id} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200 truncate max-w-[140px]">{f.file_name}</span>
                          <span className={cn(
                            'font-mono text-[9px] px-1 py-0.2 rounded',
                            f.action_decision === 'BLOCKED' ? 'bg-rose-500/20 text-rose-400' :
                            f.action_decision === 'QUARANTINED' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                          )}>
                            {f.action_decision}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[9px] text-slate-400 font-mono">
                          <span>{f.destination_type}</span>
                          <span>{f.reporting_device_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="text-[10px] font-mono uppercase text-slate-400">USB & Mass Storage Sentinel</p>
                  <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/50 flex items-start gap-2">
                    <HardDrive className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-semibold text-amber-300">SanDisk Ultra USB 3.0</p>
                      <p className="text-[9px] text-amber-400/80">Mass Storage Device attached to Sec-ThinkPad-Hopper (Drive E:\). Flagged.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="text-[10px] font-mono uppercase text-slate-400">Live Socket Connections</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] p-2 bg-slate-800/50 rounded-lg">
                      <span className="font-mono text-slate-300">api.github.com:443</span>
                      <span className="text-emerald-400 font-mono">ALLOWED</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] p-2 bg-slate-800/50 rounded-lg">
                      <span className="font-mono text-slate-300">chatgpt.com:443</span>
                      <span className="text-rose-400 font-mono">BLOCKED (TCP Teardown)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Android Bottom Navigation Bar */}
          <div className="h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 z-20 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-medium transition-colors ${
                activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('devices')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-medium transition-colors ${
                activeTab === 'devices' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Laptop className="h-4 w-4" />
              <span>Devices</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-medium transition-colors ${
                activeTab === 'activity' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Activity</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-medium transition-colors ${
                activeTab === 'security' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Security</span>
            </button>

            <button
              onClick={() => setActiveTab('transfers')}
              className={`flex flex-col items-center gap-0.5 text-[9px] font-medium transition-colors ${
                activeTab === 'transfers' ? 'text-emerald-400' : 'text-slate-400'
              }`}
            >
              <Wifi className="h-4 w-4" />
              <span>Network</span>
            </button>
          </div>

          {/* Android Home Navigation Pill Indicator */}
          <div className="h-3 bg-slate-950 flex items-center justify-center shrink-0">
            <div className="w-24 h-1 rounded-full bg-slate-600/70" />
          </div>
        </div>

        {/* APK Folder & Build Specs Modal */}
        {showApkInfo && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-200 text-xs">
              <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <FolderGit2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Arohak MDM — Android APK Project</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Location: /android</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApkInfo(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Project Specs */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Package ID</span>
                    <span className="font-mono font-semibold text-blue-400">com.arohak.mdm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Target SDK</span>
                    <span className="font-mono font-semibold text-emerald-400">Android 14 (API 34)</span>
                  </div>
                </div>

                {/* Scaffolding Files */}
                <div>
                  <span className="font-semibold text-white block mb-1.5">Generated Android Project Files:</span>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] space-y-1 text-slate-300">
                    <div>📁 <strong className="text-blue-400">/android</strong>/</div>
                    <div className="pl-4">├── 📄 build.gradle & settings.gradle</div>
                    <div className="pl-4">├── 📁 app/</div>
                    <div className="pl-8">├── 📄 build.gradle (Dependencies & Proguard)</div>
                    <div className="pl-8">├── 📁 src/main/</div>
                    <div className="pl-12">├── 📄 AndroidManifest.xml (MDM Permissions)</div>
                    <div className="pl-12">├── 📁 java/com/arohak/mdm/</div>
                    <div className="pl-16">├── 📄 MainActivity.kt (WebView Client)</div>
                    <div className="pl-16">└── 📄 ArohakDeviceAdminReceiver.kt</div>
                    <div className="pl-4">└── 📄 README.md (Complete Step-by-Step Guide)</div>
                  </div>
                </div>

                {/* Build Command */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">Compile APK Command:</span>
                    <button
                      onClick={() => copyToClipboard('cd android && ./gradlew assembleDebug', 'Build Command')}
                      className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-blue-300 flex items-center justify-between">
                    <code>cd android && ./gradlew assembleDebug</code>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Output: <code className="text-slate-300">android/app/build/outputs/apk/debug/app-debug.apk</code>
                  </p>
                </div>

                {/* Instant Online Generator */}
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white text-xs">Want an APK without Android Studio?</h4>
                      <p className="text-[11px] text-blue-300/80 mt-0.5">Use PWABuilder to generate signed APK/AAB in 1 click.</p>
                    </div>
                    <a
                      href="https://www.pwabuilder.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Included in the project ZIP download</span>
                <button
                  onClick={() => setShowApkInfo(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
