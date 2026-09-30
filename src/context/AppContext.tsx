import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DeviceTelemetry, 
  FirewallRule, 
  FirewallEvent, 
  ThreatDetectorInfo, 
  AssetRecord, 
  PersonRecord, 
  AuditLogEntry,
  FileTransferEvent
} from '../types';
import { 
  initialDevices, 
  initialFirewallRules, 
  initialFirewallEvents, 
  initialThreatSensors, 
  initialAssets, 
  initialPeople, 
  initialAuditLogs 
} from '../mock/initialData';
import { initialFileTransfers } from '../mock/transfersData';

export type UserRole = 'admin' | 'viewer';

export type ColorPaletteType = 
  | 'corporate-indigo'
  | 'emerald-security'
  | 'cobalt-cyber'
  | 'titanium-monochrome'
  | 'amber-sentinel'
  | 'crimson-sentinel';

export interface ColorPaletteConfig {
  id: ColorPaletteType;
  name: string;
  description: string;
  accentHex: string;
  dotColor: string;
}

export const availableColorPalettes: ColorPaletteConfig[] = [
  {
    id: 'corporate-indigo',
    name: 'Corporate Indigo',
    description: 'Executive standard: deep slate canvas with sapphire and indigo accents.',
    accentHex: '#4f46e5',
    dotColor: 'bg-indigo-500'
  },
  {
    id: 'cobalt-cyber',
    name: 'Cobalt Cyber',
    description: 'Cyber telemetry: navy canvas with electric cobalt & blue intelligence accents.',
    accentHex: '#2563eb',
    dotColor: 'bg-blue-500'
  },
  {
    id: 'emerald-security',
    name: 'Emerald Zero-Trust',
    description: 'SecOps defense: charcoal canvas with high-compliance emerald green highlights.',
    accentHex: '#059669',
    dotColor: 'bg-emerald-500'
  },
  {
    id: 'crimson-sentinel',
    name: 'Crimson Sentinel',
    description: 'Incident response: urgent ruby & crimson accents for high-security alert mode.',
    accentHex: '#dc2626',
    dotColor: 'bg-rose-500'
  },
  {
    id: 'titanium-monochrome',
    name: 'Titanium Minimal',
    description: 'Minimalist forensic: neutral graphite canvas with crisp titanium and ice tones.',
    accentHex: '#475569',
    dotColor: 'bg-slate-400'
  },
  {
    id: 'amber-sentinel',
    name: 'Amber Sentinel',
    description: 'SOC operations: warm dark carbon canvas with high-vigilance amber accents.',
    accentHex: '#d97706',
    dotColor: 'bg-amber-500'
  }
];

interface AppContextType {
  // Navigation & Routing
  currentRoute: string;
  navigateTo: (route: string, params?: { deviceId?: string; personId?: string }) => void;
  selectedDeviceId: string;
  selectedPersonId: string;
  
  // Auth & Permissions
  isAuthenticated: boolean;
  currentUser: { email: string; name: string; role: UserRole };
  login: (email: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;

  // Theme & Appearance Customization
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  colorPalette: ColorPaletteType;
  setColorPalette: (palette: ColorPaletteType) => void;

  // Telemetry Data
  devices: DeviceTelemetry[];
  selectedDevice: DeviceTelemetry | undefined;
  flaggedCountToday: number;
  onlineCount: number;
  totalFleetHours: number;
  
  // Assets
  assets: AssetRecord[];
  registerAsset: (data: Omit<AssetRecord, 'id' | 'token_state' | 'token' | 'device_status' | 'enrolled_at' | 'last_seen_at'>) => { asset: AssetRecord; rawToken: string };
  regenerateToken: (assetId: string) => string;
  retireAsset: (assetId: string) => void;
  purgeAsset: (assetId: string) => void;

  // People
  people: PersonRecord[];
  selectedPerson: PersonRecord | undefined;
  reconcilePeople: () => void;

  // Firewall & Threat Matrix
  firewallRules: FirewallRule[];
  threatSensors: ThreatDetectorInfo[];
  firewallEvents: FirewallEvent[];
  toggleFirewallRule: (ruleId: string) => void;
  togglePresetGuardrail: (category: FirewallRule['category']) => void;
  addFirewallRule: (rule: Omit<FirewallRule, 'id' | 'blocks_today'>) => void;
  deleteFirewallRule: (ruleId: string) => void;
  simulateFirewallDecision: (app: string, domain: string, port: number, protocol: string) => {
    decision: 'BLOCK' | 'ALLOW' | 'QUARANTINE';
    matchedRule?: FirewallRule;
    layer: string;
    teardown: boolean;
    reason: string;
  };

  // File Transfer & DLP Sentinel
  fileTransfers: FileTransferEvent[];
  addFileTransfer: (data: Omit<FileTransferEvent, 'id' | 'timestamp'>) => void;
  downloadForensicTransferReport: (transferId: string) => void;
  simulateTransfer: (type: 'download' | 'usb' | 'cloud') => void;

  // Admin & Audit
  auditLogs: AuditLogEntry[];
  tokens: { deviceId: string; label: string; token: string; status: 'Active' | 'Pending' | 'Revoked'; createdAt: string; lastAuth: string }[];
  revokeToken: (tokenString: string) => void;
  generateStandaloneToken: (label: string) => string;

  // Global Dialogs & Overlays
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isMdmSimulatorOpen: boolean;
  setIsMdmSimulatorOpen: (open: boolean) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<string>('/devices');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('dev_01');
  const [selectedPersonId, setSelectedPersonId] = useState<string>('per_01');
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: UserRole }>({
    email: 'admin@arohak.com',
    name: 'Ada Admin',
    role: 'admin'
  });

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('arohak_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {}
    return 'dark';
  });

  const [colorPalette, setColorPaletteState] = useState<ColorPaletteType>(() => {
    try {
      const stored = localStorage.getItem('arohak_color') as ColorPaletteType;
      if (stored && availableColorPalettes.some(p => p.id === stored)) return stored;
    } catch (e) {}
    return 'corporate-indigo';
  });

  const [devices, setDevices] = useState<DeviceTelemetry[]>(initialDevices);
  const [assets, setAssets] = useState<AssetRecord[]>(initialAssets);
  const [people, setPeople] = useState<PersonRecord[]>(initialPeople);
  const [firewallRules, setFirewallRules] = useState<FirewallRule[]>(initialFirewallRules);
  const [threatSensors, setThreatSensors] = useState<ThreatDetectorInfo[]>(initialThreatSensors);
  const [firewallEvents, setFirewallEvents] = useState<FirewallEvent[]>(initialFirewallEvents);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [fileTransfers, setFileTransfers] = useState<FileTransferEvent[]>(initialFileTransfers);
  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isMdmSimulatorOpen, setIsMdmSimulatorOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Derived state
  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const selectedPerson = people.find(p => p.id === selectedPersonId) || people[0];
  const onlineCount = devices.filter(d => d.status === 'online').length;
  const flaggedCountToday = devices.filter(d => d.verdict.flags.length > 0).length;
  const totalFleetHours = Math.round(devices.reduce((acc, d) => acc + (d.active_screen_sec / 3600), 0) + 160); // combined fleet estimate

  // Helper for toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard shortcut listener for Command Palette (Cmd+K / Ctrl+K) and Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      // G then key shortcuts if not typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsMdmSimulatorOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme & Color Palette effect on HTML and Body elements
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-color', colorPalette);
    root.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      document.body.className = "bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200 min-h-screen";
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      document.body.className = "bg-[#f4f8fe] text-slate-900 font-sans antialiased selection:bg-blue-500/20 selection:text-blue-900 min-h-screen";
      document.body.style.backgroundColor = '#f4f8fe';
      document.body.style.color = '#0f172a';
    }
  }, [theme, colorPalette]);

  // Live telemetry pulse simulation (every 10s updates idle seconds, mouse coordinates, and packets)
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => 
        prev.map(d => {
          if (d.status === 'offline') return d;
          const deltaSec = 10;
          const isAfkNow = d.raw_idle_sec > 60;
          return {
            ...d,
            uptime_sec: d.uptime_sec + deltaSec,
            raw_idle_sec: isAfkNow ? d.raw_idle_sec + deltaSec : (Math.random() > 0.8 ? d.raw_idle_sec + deltaSec : Math.floor(Math.random() * 5)),
            active_screen_sec: isAfkNow ? d.active_screen_sec : d.active_screen_sec + deltaSec,
            mouse: {
              ...d.mouse,
              mouse_movement_px: d.mouse.mouse_movement_px + Math.floor(Math.random() * 80)
            }
          };
        })
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (route: string, params?: { deviceId?: string; personId?: string }) => {
    if (params?.deviceId) setSelectedDeviceId(params.deviceId);
    if (params?.personId) setSelectedPersonId(params.personId);
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (email: string) => {
    setCurrentUser({
      email,
      name: email.split('@')[0],
      role: email.includes('viewer') ? 'viewer' : 'admin'
    });
    setIsAuthenticated(true);
    setCurrentRoute('/devices');
    showToast('Signed in successfully');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentRoute('/login');
    showToast('Signed out of Arohak MDM');
  };

  const setRole = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
    showToast(`Role switched to ${role.toUpperCase()}`);
    // Log in audit
    const newAudit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: currentUser.email,
      action: 'role.switch',
      target_resource_id: currentUser.email,
      client_ip: '10.0.4.12',
      status: 'SUCCESS',
      details: `Switched active session view to ${role}`
    };
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    try {
      localStorage.setItem('arohak_theme', t);
    } catch (e) {}
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  const setColorPalette = (c: ColorPaletteType) => {
    setColorPaletteState(c);
    try {
      localStorage.setItem('arohak_color', c);
    } catch (e) {}
  };

  // Asset management
  const registerAsset = (data: Omit<AssetRecord, 'id' | 'token_state' | 'token' | 'device_status' | 'enrolled_at' | 'last_seen_at'>) => {
    const rawToken = `aro_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    const newAsset: AssetRecord = {
      ...data,
      id: `ast_${Date.now()}`,
      token_state: 'Active',
      token: rawToken,
      device_status: 'Active',
      enrolled_at: new Date().toISOString(),
      last_seen_at: 'Pending enrollment'
    };
    setAssets(prev => [newAsset, ...prev]);
    
    // Add to audit log
    const audit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: currentUser.email,
      action: 'asset.register',
      target_resource_id: newAsset.id,
      client_ip: '10.0.4.12',
      status: 'SUCCESS',
      details: `Registered hardware asset ${newAsset.device_name} for ${newAsset.assigned_owner}`
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast(`Device registered: ${newAsset.device_name}`);
    return { asset: newAsset, rawToken };
  };

  const regenerateToken = (assetId: string) => {
    const rawToken = `aro_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, token: rawToken, token_state: 'Active' } : a));
    
    const audit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: currentUser.email,
      action: 'token.regenerate',
      target_resource_id: assetId,
      client_ip: '10.0.4.12',
      status: 'SUCCESS',
      details: `Regenerated cryptographic enrollment token for asset ${assetId}`
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast('New enrollment token generated');
    return rawToken;
  };

  const retireAsset = (assetId: string) => {
    setAssets(prev => prev.map(a => a.id === assetId ? { ...a, device_status: 'Retired', token_state: 'Revoked' } : a));
    const audit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: currentUser.email,
      action: 'asset.retire',
      target_resource_id: assetId,
      client_ip: '10.0.4.12',
      status: 'SUCCESS',
      details: `Retired asset ${assetId}. Preserved 90-day retention logs in read-only state.`
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast('Asset retired');
  };

  const purgeAsset = (assetId: string) => {
    setAssets(prev => prev.filter(a => a.id !== assetId));
    const audit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: currentUser.email,
      action: 'asset.purge',
      target_resource_id: assetId,
      client_ip: '10.0.4.12',
      status: 'WARNING',
      details: `Permanently purged hardware asset ${assetId} and associated cryptographic tokens.`
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast('Asset permanently purged from register');
  };

  // People
  const reconcilePeople = () => {
    showToast('Auto-reconciliation complete: 8 people verified across 8 endpoints.');
    const audit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: currentUser.email,
      action: 'people.reconciliation',
      target_resource_id: 'people_registry',
      client_ip: '10.0.4.12',
      status: 'SUCCESS',
      details: 'Reconciliation algorithm executed across Active Directory / Okta links.'
    };
    setAuditLogs(prev => [audit, ...prev]);
  };

  // Firewall
  const toggleFirewallRule = (ruleId: string) => {
    setFirewallRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const updated = { ...r, enabled: !r.enabled };
        showToast(`Rule "${r.name}" is now ${updated.enabled ? 'ENFORCING' : 'DISABLED'}`);
        return updated;
      }
      return r;
    }));
  };

  const togglePresetGuardrail = (category: FirewallRule['category']) => {
    setFirewallRules(prev => prev.map(r => {
      if (r.category === category) {
        const nextState = !r.enabled;
        showToast(`${r.name}: ${nextState ? 'Enforced' : 'Disabled'}`);
        return { ...r, enabled: nextState };
      }
      return r;
    }));
  };

  const addFirewallRule = (ruleData: Omit<FirewallRule, 'id' | 'blocks_today'>) => {
    const newRule: FirewallRule = {
      ...ruleData,
      id: `rule_custom_${Date.now()}`,
      blocks_today: 0
    };
    setFirewallRules(prev => [newRule, ...prev]);
    
    const audit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: currentUser.email,
      action: 'firewall.rule.create',
      target_resource_id: newRule.id,
      client_ip: '10.0.4.12',
      status: 'SUCCESS',
      details: `Created custom firewall rule: ${newRule.name} (${newRule.action})`
    };
    setAuditLogs(prev => [audit, ...prev]);
    showToast(`Policy rule created: ${newRule.name}`);
  };

  const deleteFirewallRule = (ruleId: string) => {
    const target = firewallRules.find(r => r.id === ruleId);
    setFirewallRules(prev => prev.filter(r => r.id !== ruleId));
    if (target) {
      const audit: AuditLogEntry = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor_email: currentUser.email,
        action: 'firewall.rule.delete',
        target_resource_id: ruleId,
        client_ip: '10.0.4.12',
        status: 'WARNING',
        details: `Deleted firewall policy: ${target.name}`
      };
      setAuditLogs(prev => [audit, ...prev]);
      showToast(`Policy deleted: ${target.name}`);
    }
  };

  const simulateFirewallDecision = (app: string, domain: string, port: number, protocol: string) => {
    const targetDomain = domain.toLowerCase().trim();
    const targetApp = app.toLowerCase().trim();
    const targetPortStr = `${port}/${protocol.toLowerCase()}`;

    // Check active rules by priority
    const sortedRules = [...firewallRules].filter(r => r.enabled).sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      // Check targets
      const match = rule.targets.some(t => {
        const lowerT = t.toLowerCase();
        if (rule.layer === 'WEB' && (targetDomain.includes(lowerT) || lowerT.includes(targetDomain))) return true;
        if (rule.layer === 'APPLICATION' && (targetApp.includes(lowerT) || lowerT.includes(targetApp))) return true;
        if (rule.layer === 'NETWORK' && (lowerT === targetPortStr || lowerT === `${port}`)) return true;
        return false;
      });

      if (match) {
        return {
          decision: rule.action,
          matchedRule: rule,
          layer: rule.layer,
          teardown: rule.action === 'BLOCK',
          reason: `Matched policy "${rule.name}" on ${rule.layer} layer. Triggered ${rule.action} action with kernel TCP teardown.`
        };
      }
    }

    // Default Zero-Trust evaluation
    return {
      decision: 'ALLOW' as const,
      layer: 'DEFAULT_POLICY',
      teardown: false,
      reason: 'No restrictive corporate security policy matched. Outbound traffic allowed under standard baseline.'
    };
  };

  // Standalone tokens table in Admin
  const tokens = assets.map(a => ({
    deviceId: a.id,
    label: a.device_name,
    token: a.token,
    status: a.token_state,
    createdAt: a.enrolled_at,
    lastAuth: a.last_seen_at
  }));

  const revokeToken = (tokenString: string) => {
    setAssets(prev => prev.map(a => a.token === tokenString ? { ...a, token_state: 'Revoked' } : a));
    showToast('Token revoked. Machine disconnected on next heartbeat.');
  };

  const generateStandaloneToken = (label: string) => {
    const raw = `aro_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    showToast(`Token generated for ${label}`);
    return raw;
  };

  // File Transfers & DLP
  const addFileTransfer = (data: Omit<FileTransferEvent, 'id' | 'timestamp'>) => {
    const newXfer: FileTransferEvent = {
      ...data,
      id: `xfer_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setFileTransfers(prev => [newXfer, ...prev]);

    // Also attach to reporting device
    setDevices(prev => prev.map(d => {
      if (d.id === newXfer.reporting_device_id) {
        return {
          ...d,
          file_transfers: [newXfer, ...d.file_transfers]
        };
      }
      return d;
    }));

    const audit: AuditLogEntry = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor_email: newXfer.owner_email,
      action: `dlp.${newXfer.action_decision.toLowerCase()}`,
      target_resource_id: newXfer.file_name,
      client_ip: '10.0.4.12',
      status: newXfer.action_decision === 'ALLOWED' ? 'SUCCESS' : 'WARNING',
      details: `File transfer intercept: ${newXfer.file_name} -> ${newXfer.destination_target} (${newXfer.action_decision})`
    };
    setAuditLogs(prev => [audit, ...prev]);

    showToast(`DLP ${newXfer.action_decision}: ${newXfer.file_name}`);
  };

  const downloadForensicTransferReport = (transferId: string) => {
    const xfer = fileTransfers.find(x => x.id === transferId);
    if (!xfer) return;

    const reportContent = `AROHAK MDM — FORENSIC FILE TRANSFER AUDIT REPORT
================================================================================
Generated: ${new Date().toISOString()}
Compliance Standard: NIST 800-53 / ISO 27001 DLP Section A.8.2.3
Endpoint Device: ${xfer.reporting_device_name} (ID: ${xfer.reporting_device_id})
Employee Custodian: ${xfer.owner_name} <${xfer.owner_email}>

FILE FORENSIC ARTIFACTS
--------------------------------------------------------------------------------
File Name:        ${xfer.file_name}
File Extension:   ${xfer.file_extension}
Size:             ${xfer.file_size_bytes} bytes (${(xfer.file_size_bytes / (1024*1024)).toFixed(2)} MB)
SHA-256 Hash:     ${xfer.file_hash_sha256}
Source Path:      ${xfer.source_path}
Destination Path: ${xfer.destination_target}
Destination Type: ${xfer.destination_type}
Initiating Proc:  ${xfer.initiating_process}

DLP VERDICT & COUNTERMEASURE
--------------------------------------------------------------------------------
Action Decision:  ${xfer.action_decision}
Severity:         ${xfer.severity}
Matched Rule:     ${xfer.dlp_violation_rule || 'None (Normal Egress Approved)'}
Interception:     Arohak Agent kernel filesystem filter drop listener
================================================================================
Immutable Forensic Fingerprint: ${xfer.file_hash_sha256}
`;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arohak_dlp_forensics_${xfer.file_name.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded forensic report for ${xfer.file_name}`);
  };

  const simulateTransfer = (type: 'download' | 'usb' | 'cloud') => {
    const reportingDevice = devices[0] || initialDevices[0];
    if (type === 'download') {
      addFileTransfer({
        type: 'file_transfer_event',
        file_name: 'suspicious_payload_setup.exe',
        file_extension: '.exe',
        file_size_bytes: 18450000,
        file_hash_sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
        source_path: 'https://malicious-cdn-origin.xyz/payloads/suspicious_payload_setup.exe',
        destination_target: 'C:\\Users\\ada\\Downloads\\suspicious_payload_setup.exe',
        destination_type: 'DOWNLOAD_INBOUND',
        reporting_device_id: reportingDevice.id,
        reporting_device_name: reportingDevice.hostname,
        owner_name: reportingDevice.owner_name,
        owner_email: reportingDevice.owner_email,
        action_decision: 'BLOCKED',
        dlp_violation_rule: 'Inbound Download Sentinel: Untrusted Executable Download',
        severity: 'CRITICAL',
        initiating_process: 'chrome.exe (PID 7812)'
      });
    } else if (type === 'usb') {
      addFileTransfer({
        type: 'file_transfer_event',
        file_name: 'q3_confidential_customer_pii.csv',
        file_extension: '.csv',
        file_size_bytes: 9240000,
        file_hash_sha256: '4f8812c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcde7',
        source_path: 'C:\\CompanyData\\q3_confidential_customer_pii.csv',
        destination_target: 'E:\\SanDisk_FlashDrive\\q3_confidential_customer_pii.csv',
        destination_type: 'USB_STORAGE',
        reporting_device_id: reportingDevice.id,
        reporting_device_name: reportingDevice.hostname,
        owner_name: reportingDevice.owner_name,
        owner_email: reportingDevice.owner_email,
        action_decision: 'BLOCKED',
        dlp_violation_rule: 'Mass Storage DLP: Unencrypted Sensitive Customer PII',
        severity: 'CRITICAL',
        initiating_process: 'explorer.exe (PID 2108)'
      });
    } else {
      addFileTransfer({
        type: 'file_transfer_event',
        file_name: 'prod_database_secret_keys.env',
        file_extension: '.env',
        file_size_bytes: 4890,
        file_hash_sha256: '99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
        source_path: '/Users/ada/Projects/backend/.env.production',
        destination_target: 'https://anonfiles.com/upload/prod_database_secret_keys.env',
        destination_type: 'CLOUD_SYNC',
        reporting_device_id: reportingDevice.id,
        reporting_device_name: reportingDevice.hostname,
        owner_name: reportingDevice.owner_name,
        owner_email: reportingDevice.owner_email,
        action_decision: 'QUARANTINED',
        dlp_violation_rule: 'Critical Key Intercept: Production API & DB Secret Egress',
        severity: 'CRITICAL',
        initiating_process: 'curl / terminal (PID 5120)'
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        selectedDeviceId,
        selectedPersonId,
        isAuthenticated,
        currentUser,
        login,
        logout,
        setRole,
        theme,
        setTheme,
        toggleTheme,
        colorPalette,
        setColorPalette,
        devices,
        selectedDevice,
        flaggedCountToday,
        onlineCount,
        totalFleetHours,
        assets,
        registerAsset,
        regenerateToken,
        retireAsset,
        purgeAsset,
        people,
        selectedPerson,
        reconcilePeople,
        firewallRules,
        threatSensors,
        firewallEvents,
        toggleFirewallRule,
        togglePresetGuardrail,
        addFirewallRule,
        deleteFirewallRule,
        simulateFirewallDecision,
        fileTransfers,
        addFileTransfer,
        downloadForensicTransferReport,
        simulateTransfer,
        auditLogs,
        tokens,
        revokeToken,
        generateStandaloneToken,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isMdmSimulatorOpen,
        setIsMdmSimulatorOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
