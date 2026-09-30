import { 
  DeviceTelemetry, 
  FirewallRule, 
  FirewallEvent, 
  ThreatDetectorInfo, 
  AssetRecord, 
  PersonRecord, 
  AuditLogEntry 
} from '../types';
import { initialFileTransfers } from './transfersData';

export const initialThreatSensors: ThreatDetectorInfo[] = [
  {
    id: 'ip_spoof',
    name: 'IP Spoofing & Network Anomaly',
    tag: 'ip_spoof_detector.py',
    status: 'ACTIVE',
    summary: 'Monitors non-routable Bogon ranges, impossible geographic travel deltas, and OS socket header discrepancies.',
    technical_probe: 'Kernel raw socket ingress probe + MaxMind GeoIP delta velocity check (< 500mph threshold).',
    detections_24h: 3,
    last_probe_event: '2026-09-30T13:40:12Z'
  },
  {
    id: 'hotspot',
    name: 'Wi-Fi Hotspot & Rogue Tethering Guard',
    tag: 'hotspot_detector.py',
    status: 'ACTIVE',
    summary: 'Detects mobile cellular hotspot tethering, rogue AP spoofing, and IP packet TTL single-hop decrements.',
    technical_probe: 'SSID OUI fingerprinting + IP header TTL delta inspection (detects NAT hops from mobile hotspots).',
    detections_24h: 1,
    last_probe_event: '2026-09-30T13:38:00Z'
  },
  {
    id: 'proxy',
    name: 'Proxy, VPN & Tor Tunneling Guard',
    tag: 'proxy_detector.py',
    status: 'ACTIVE',
    summary: 'Flags unauthorized virtual network interfaces (TUN/TAP, WireGuard), open SOCKS proxies, and known Tor consensus nodes.',
    technical_probe: 'psutil.net_if_addrs() virtual interface inspection + Tor Directory consensus relay list verification.',
    detections_24h: 4,
    last_probe_event: '2026-09-30T13:39:00Z'
  },
  {
    id: 'jailbreak_root',
    name: 'Jailbreak, Root & Kernel Integrity',
    tag: 'jailbreak_root_detector.py',
    status: 'ACTIVE',
    summary: 'Continuously validates OS root privileges, detects Frida/Xposed hooking frameworks, and identifies unauthorized sudo bin escalations.',
    technical_probe: 'Check for /usr/bin/su, Magisk mounts, modified system binaries, and dynamic linker injection hooks (LD_PRELOAD).',
    detections_24h: 0,
    last_probe_event: '2026-09-30T13:45:00Z'
  },
  {
    id: 'device_attestation',
    name: 'Hardware Attestation & Anti-VM Sentinel',
    tag: 'device_attestation_detector.py',
    status: 'ACTIVE',
    summary: 'Validates hardware TPM 2.0 endorsement keys, Secure Boot enablement, and hypervisor CPUID signatures (QEMU/VirtualBox).',
    technical_probe: 'Windows WMI Win32_Tpm check / Apple SEP verification + CPUID hypervisor bit evaluation.',
    detections_24h: 0,
    last_probe_event: '2026-09-30T13:44:20Z'
  },
  {
    id: 'payload_integrity',
    name: 'Payload Integrity & Reverse Shell Guard',
    tag: 'payload_integrity_detector.py',
    status: 'ACTIVE',
    summary: 'Catches outbound reverse shells (nc, bash -i), command replay attacks, and unauthorized PowerShell encoded payloads.',
    technical_probe: 'Process parent-child execution graph tracking + standard descriptor socket binding analysis.',
    detections_24h: 2,
    last_probe_event: '2026-09-30T13:12:05Z'
  },
  {
    id: 'data_leak',
    name: 'Data Exfiltration & Mass Storage DLP',
    tag: 'data_leak_detector.py',
    status: 'ACTIVE',
    summary: 'Intercepts large file copies to unapproved USB flash drives, rapid clipboard dump sequences, and shadow cloud synchronization.',
    technical_probe: 'Hardware SetupAPI & IOKit USB class 08h intercept + filesystem drop listener on removable drive mounts.',
    detections_24h: 5,
    last_probe_event: '2026-09-30T13:05:44Z'
  }
];

export const initialFirewallRules: FirewallRule[] = [
  {
    id: 'rule_ai_block',
    name: 'Block Gen AI & LLM Portals',
    description: 'Enforces corporate Zero-Trust data governance by preventing source code and IP leakage to public LLMs.',
    layer: 'WEB',
    targets: ['chatgpt.com', 'claude.ai', 'perplexity.ai', 'copilot.microsoft.com'],
    action: 'BLOCK',
    priority: 10,
    enabled: true,
    blocks_today: 42,
    category: 'ai'
  },
  {
    id: 'rule_media_streaming',
    name: 'Block Video & Media Streaming',
    description: 'Preserves enterprise network pipe bandwidth during shift hours.',
    layer: 'WEB',
    targets: ['youtube.com', 'netflix.com', 'twitch.tv', 'disneyplus.com'],
    action: 'BLOCK',
    priority: 20,
    enabled: false,
    blocks_today: 0,
    category: 'media'
  },
  {
    id: 'rule_social_media',
    name: 'Block Social Media Portals',
    description: 'Workstation distraction guardrail preventing access to unapproved consumer networks.',
    layer: 'WEB',
    targets: ['facebook.com', 'instagram.com', 'tiktok.com', 'x.com', 'reddit.com'],
    action: 'BLOCK',
    priority: 25,
    enabled: true,
    blocks_today: 18,
    category: 'social'
  },
  {
    id: 'rule_p2p_torrents',
    name: 'Block P2P & Torrent Applications',
    description: 'Immediate OS socket termination for peer-to-peer file transfer protocols and clients.',
    layer: 'APPLICATION',
    targets: ['utorrent.exe', 'bittorrent.exe', 'qbittorrent.exe', 'Transmission'],
    action: 'BLOCK',
    priority: 5,
    enabled: true,
    blocks_today: 0,
    category: 'p2p'
  },
  {
    id: 'rule_insecure_ports',
    name: 'Block Insecure Network Ports',
    description: 'Drops unencrypted legacy cleartext protocols (FTP 21, Telnet 23, SMB 445).',
    layer: 'NETWORK',
    targets: ['21/tcp', '23/tcp', '445/tcp'],
    action: 'BLOCK',
    priority: 2,
    enabled: true,
    blocks_today: 82,
    category: 'ports'
  },
  {
    id: 'rule_tor_relays',
    name: 'Tor Exit Node Quarantine',
    description: 'Zero-trust quarantine of all outbound traffic attempting connection to public Tor directory IPs.',
    layer: 'NETWORK',
    targets: ['Tor-Consensus-Feed'],
    action: 'QUARANTINE',
    priority: 1,
    enabled: true,
    blocks_today: 4,
    category: 'custom'
  }
];

export const initialFirewallEvents: FirewallEvent[] = [
  {
    id: 'fwe_001',
    type: 'firewall_event',
    decision: 'BLOCK',
    rule_id: 'rule_ai_block',
    rule_name: 'Block Gen AI & LLM Portals',
    device_id: 'dev_01',
    device_name: 'Ada-MacBook-Pro',
    target: 'chatgpt.com:443',
    matched_layer: 'WEB',
    teardown_executed: true,
    severity: 'MEDIUM',
    timestamp: '2026-09-30T13:42:10Z',
    payload_summary: 'TLS Client Hello SNI matched "chatgpt.com". Connection terminated via kernel TCP teardown.'
  },
  {
    id: 'fwe_002',
    type: 'firewall_event',
    decision: 'QUARANTINE',
    rule_id: 'rule_tor_relays',
    rule_name: 'Tor Exit Node Quarantine',
    device_id: 'dev_02',
    device_name: 'Dev-Win11-Turing',
    target: '185.220.101.5:9001',
    matched_layer: 'NETWORK',
    teardown_executed: true,
    severity: 'CRITICAL',
    timestamp: '2026-09-30T13:39:00Z',
    payload_summary: 'Outbound TCP socket to verified Tor directory relay. Process git.exe proxy override quarantined.'
  },
  {
    id: 'fwe_003',
    type: 'firewall_event',
    decision: 'BLOCK',
    rule_id: 'rule_insecure_ports',
    rule_name: 'Block Insecure Network Ports',
    device_id: 'dev_03',
    device_name: 'Sec-ThinkPad-Hopper',
    target: '192.168.1.100:445',
    matched_layer: 'NETWORK',
    teardown_executed: true,
    severity: 'HIGH',
    timestamp: '2026-09-30T13:15:22Z',
    payload_summary: 'Outbound SMB port 445 probe intercepted. Denied by Zero-Trust local firewall policy.'
  },
  {
    id: 'fwe_004',
    type: 'firewall_event',
    decision: 'BLOCK',
    rule_id: 'rule_social_media',
    rule_name: 'Block Social Media Portals',
    device_id: 'dev_05',
    device_name: 'Lab-MacBookAir-Shannon',
    target: 'x.com:443',
    matched_layer: 'WEB',
    teardown_executed: true,
    severity: 'LOW',
    timestamp: '2026-09-30T12:50:11Z',
    payload_summary: 'Browser domain request to x.com blocked per Corporate Productivity Guardrails.'
  },
  {
    id: 'fwe_005',
    type: 'firewall_event',
    decision: 'BLOCK',
    rule_id: 'rule_ai_block',
    rule_name: 'Block Gen AI & LLM Portals',
    device_id: 'dev_06',
    device_name: 'Cloud-Surface-Johnson',
    target: 'claude.ai:443',
    matched_layer: 'WEB',
    teardown_executed: true,
    severity: 'MEDIUM',
    timestamp: '2026-09-30T11:24:33Z',
    payload_summary: 'TLS Client Hello SNI matched "claude.ai". Zero-Trust drop applied.'
  }
];

export const initialDevices: DeviceTelemetry[] = [
  {
    id: 'dev_01',
    hostname: 'Ada-MacBook-Pro',
    platform: 'macos',
    os_version: 'macOS 15.1 (Sequoia)',
    serial_number: 'C02G90LKMD6T',
    agent_version: 'v2.4.12-rc4',
    owner_name: 'Ada Lovelace',
    owner_email: 'ada@corp.com',
    owner_id: 'per_01',
    status: 'online',
    is_afk: false,
    raw_idle_sec: 4.2,
    last_seen: '2026-09-30T13:46:00Z',
    wifi_ssid: 'Corp_Secure_5G',
    uptime_sec: 29800,
    boot_time: '2026-09-30T05:29:20Z',
    current_app: 'Visual Studio Code',
    current_window: 'engine.py — arohak_core/telemetry',
    active_screen_sec: 24300, // 6h 45m
    locked_sec: 4500, // 1h 15m
    sleep_sec: 2700, // 45m
    shift_adherence_pct: 94.2,
    verdict: {
      verdict: 'genuine',
      confidence: 0.98,
      flags: [],
      reasons: ['Organic human mouse trajectory with normal entropy', 'Smooth natural inter-keystroke variance (KPM 64)']
    },
    mouse: {
      mouse_clicks: 1420,
      mouse_movement_px: 24890,
      mouse_scroll_ticks: 380,
      jiggler_detected: false,
      entropy_score: 0.92,
      variance: 0.88
    },
    keyboard: {
      keystrokes: 4210,
      keys_per_minute: 68.4,
      held_key_duration_sec: 0.0,
      held_key_detected: false
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 0, 15, 38, 54, 58, 48, 56, 20, 52, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'Visual Studio Code',
        duration_sec: 15120, // 4h 12m
        share_pct: 62.2,
        category: 'Development',
        bytes: 4892010,
        window_samples: ['engine.py — arohak_core', 'test_cadence.py', 'terminal: pytest -v']
      },
      {
        app: 'Google Chrome',
        duration_sec: 8100, // 2h 15m
        share_pct: 33.3,
        category: 'Web Browser',
        bytes: 145020100,
        window_samples: ['Jira - Sprint Backlog | Atlassian', 'GitHub - PR #128 Cadence Engine', 'RFC 9110 HTTP Semantics']
      },
      {
        app: 'Slack',
        duration_sec: 1080, // 18m
        share_pct: 4.5,
        category: 'Communication',
        bytes: 1205000,
        window_samples: ['#engineering-core', 'Direct Message with Alan Turing']
      }
    ],
    sessions: [
      {
        id: 'sess_01',
        type: 'app_session',
        app: 'Google Chrome',
        window: 'Jira - Sprint Backlog | Atlassian',
        start_time: '2026-09-30T09:00:00Z',
        duration_sec: 1800,
        keystrokes: 320,
        mouse_clicks: 84,
        mouse_movement_px: 6200,
        mouse_scroll_ticks: 140,
        idle_sec: 45,
        flags: []
      },
      {
        id: 'sess_02',
        type: 'app_session',
        app: 'Visual Studio Code',
        window: 'engine.py — arohak_core/telemetry',
        start_time: '2026-09-30T09:30:00Z',
        duration_sec: 7200,
        keystrokes: 1840,
        mouse_clicks: 340,
        mouse_movement_px: 11400,
        mouse_scroll_ticks: 210,
        idle_sec: 110,
        flags: []
      },
      {
        id: 'sess_03',
        type: 'app_session',
        app: 'Slack',
        window: '#engineering-core | Arohak Systems',
        start_time: '2026-09-30T11:30:00Z',
        duration_sec: 1080,
        keystrokes: 410,
        mouse_clicks: 92,
        mouse_movement_px: 2400,
        mouse_scroll_ticks: 80,
        idle_sec: 20,
        flags: []
      },
      {
        id: 'sess_04',
        type: 'app_session',
        app: 'Visual Studio Code',
        window: 'test_cadence.py — unit testing',
        start_time: '2026-09-30T12:00:00Z',
        duration_sec: 6120,
        keystrokes: 1640,
        mouse_clicks: 290,
        mouse_movement_px: 9800,
        mouse_scroll_ticks: 190,
        idle_sec: 90,
        flags: []
      }
    ],
    usb_events: [
      {
        id: 'usb_01',
        type: 'usb_event',
        action: 'INSERTED',
        device_name: 'Logitech MX Master 3S',
        vendor_id: '046D',
        product_id: 'B023',
        serial_number: 'N/A (HID)',
        is_mass_storage: false,
        timestamp: '2026-09-30T08:45:00Z',
        risk_level: 'OK'
      }
    ],
    network_events: [
      {
        id: 'net_01',
        type: 'network_event',
        remote_domain: 'api.github.com',
        remote_ip: '140.82.121.6',
        remote_port: 443,
        bytes_sent: 84200,
        bytes_recv: 942100,
        process_name: 'Code.exe',
        timestamp: '2026-09-30T13:40:00Z',
        status: 'ALLOWED'
      },
      {
        id: 'net_02',
        type: 'network_event',
        remote_domain: 'corp-jira.atlassian.net',
        remote_ip: '104.192.141.1',
        remote_port: 443,
        bytes_sent: 41200,
        bytes_recv: 512000,
        process_name: 'Google Chrome',
        timestamp: '2026-09-30T13:20:00Z',
        status: 'ALLOWED'
      }
    ],
    file_transfers: [initialFileTransfers[3], initialFileTransfers[4]]
  },
  {
    id: 'dev_02',
    hostname: 'Dev-Win11-Turing',
    platform: 'windows',
    os_version: 'Windows 11 Enterprise (23H2)',
    serial_number: 'PF3Z8810K',
    agent_version: 'v2.4.12-rc4',
    owner_name: 'Alan Turing',
    owner_email: 'alan@corp.com',
    owner_id: 'per_02',
    status: 'online',
    is_afk: false,
    raw_idle_sec: 14.1,
    last_seen: '2026-09-30T13:45:50Z',
    wifi_ssid: 'Corp_Secure_5G',
    uptime_sec: 32400,
    boot_time: '2026-09-30T04:46:00Z',
    current_app: 'Google Chrome',
    current_window: 'PR #42 Review — Turing Decryptor Engine',
    active_screen_sec: 25200, // 7h
    locked_sec: 3600,
    sleep_sec: 3600,
    shift_adherence_pct: 96.0,
    verdict: {
      verdict: 'genuine',
      confidence: 0.99,
      flags: [],
      reasons: ['Natural human cadences and active window transitions']
    },
    mouse: {
      mouse_clicks: 1890,
      mouse_movement_px: 31200,
      mouse_scroll_ticks: 520,
      jiggler_detected: false,
      entropy_score: 0.94,
      variance: 0.91
    },
    keyboard: {
      keystrokes: 5800,
      keys_per_minute: 74.2,
      held_key_duration_sec: 0.0,
      held_key_detected: false
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 20, 45, 55, 59, 58, 52, 57, 30, 55, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'Google Chrome',
        duration_sec: 12600,
        share_pct: 50.0,
        category: 'Web Browser',
        bytes: 180200000,
        window_samples: ['PR #42 Review', 'Mathematical Foundations of Computability', 'GitHub']
      },
      {
        app: 'Visual Studio Code',
        duration_sec: 10800,
        share_pct: 42.8,
        category: 'Development',
        bytes: 3900000,
        window_samples: ['turing_machine.ts', 'crypto_benchmark.rs']
      },
      {
        app: 'Slack',
        duration_sec: 1800,
        share_pct: 7.2,
        category: 'Communication',
        bytes: 2400000,
        window_samples: ['#cryptanalysis', '#general']
      }
    ],
    sessions: [
      {
        id: 'sess_11',
        type: 'app_session',
        app: 'Google Chrome',
        window: 'PR #42 Review — Turing Decryptor Engine',
        start_time: '2026-09-30T09:00:00Z',
        duration_sec: 5400,
        keystrokes: 1200,
        mouse_clicks: 310,
        mouse_movement_px: 8900,
        mouse_scroll_ticks: 210,
        idle_sec: 60,
        flags: []
      }
    ],
    usb_events: [],
    network_events: [
      {
        id: 'net_11',
        type: 'network_event',
        remote_domain: '185.220.101.5',
        remote_ip: '185.220.101.5',
        remote_port: 9001,
        bytes_sent: 1200,
        bytes_recv: 0,
        process_name: 'git.exe',
        timestamp: '2026-09-30T13:39:00Z',
        status: 'QUARANTINED'
      }
    ],
    file_transfers: [initialFileTransfers[1]]
  },
  {
    id: 'dev_03',
    hostname: 'Sec-ThinkPad-Hopper',
    platform: 'windows',
    os_version: 'Windows 11 Enterprise (23H2)',
    serial_number: 'TP-X1C-9901A',
    agent_version: 'v2.4.12-rc4',
    owner_name: 'Grace Hopper',
    owner_email: 'grace@corp.com',
    owner_id: 'per_03',
    status: 'online',
    is_afk: false,
    raw_idle_sec: 2.1,
    last_seen: '2026-09-30T13:46:10Z',
    wifi_ssid: 'Corp_Secure_5G',
    uptime_sec: 38200,
    boot_time: '2026-09-30T03:09:00Z',
    current_app: 'Windows Terminal',
    current_window: 'powershell.exe — docker compose up -d compiler',
    active_screen_sec: 23400, // 6h 30m
    locked_sec: 3600,
    sleep_sec: 1800,
    shift_adherence_pct: 98.4,
    verdict: {
      verdict: 'genuine',
      confidence: 0.97,
      flags: [],
      reasons: ['Consistent active terminal typing and compiler execution']
    },
    mouse: {
      mouse_clicks: 840,
      mouse_movement_px: 14200,
      mouse_scroll_ticks: 240,
      jiggler_detected: false,
      entropy_score: 0.89,
      variance: 0.85
    },
    keyboard: {
      keystrokes: 6200,
      keys_per_minute: 82.1,
      held_key_duration_sec: 0.0,
      held_key_detected: false
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 0, 20, 52, 58, 60, 55, 59, 40, 56, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'Windows Terminal',
        duration_sec: 14400,
        share_pct: 61.5,
        category: 'Development',
        bytes: 12800000,
        window_samples: ['powershell.exe — compiler debug', 'bash: cobol-transpiler-ci']
      },
      {
        app: 'Visual Studio Code',
        duration_sec: 6480,
        share_pct: 27.7,
        category: 'Development',
        bytes: 4100000,
        window_samples: ['compiler.rs', 'ast_parser.rs']
      }
    ],
    sessions: [],
    usb_events: [
      {
        id: 'usb_03_1',
        type: 'usb_event',
        action: 'INSERTED',
        device_name: 'SanDisk Ultra USB 3.0 (64GB)',
        vendor_id: '0781',
        product_id: '5581',
        serial_number: '4C530001280321115201',
        is_mass_storage: true,
        mount_point: 'E:\\',
        timestamp: '2026-09-30T13:05:44Z',
        risk_level: 'ALERT'
      }
    ],
    network_events: [],
    file_transfers: [initialFileTransfers[0]]
  },
  {
    id: 'dev_04',
    hostname: 'Workstation-Babbage',
    platform: 'windows',
    os_version: 'Windows 11 Pro',
    serial_number: 'DELL-PWS-4410',
    agent_version: 'v2.4.11',
    owner_name: 'Charles Babbage',
    owner_email: 'charles@corp.com',
    owner_id: 'per_04',
    status: 'offline',
    is_afk: true,
    afk_since: '2026-09-30T11:45:00Z',
    raw_idle_sec: 7200,
    last_seen: '2026-09-30T11:45:00Z',
    wifi_ssid: 'Corp_Secure_5G',
    uptime_sec: 14400,
    boot_time: '2026-09-30T07:45:00Z',
    current_app: 'System Standby',
    current_window: '- (Device in Sleep/Offline mode)',
    active_screen_sec: 10800, // 3h 0m
    locked_sec: 3600,
    sleep_sec: 7200,
    shift_adherence_pct: 71.0,
    verdict: {
      verdict: 'idle',
      confidence: 0.95,
      flags: [],
      reasons: ['Device has been in OS sleep state for > 2 hours']
    },
    mouse: {
      mouse_clicks: 420,
      mouse_movement_px: 5400,
      mouse_scroll_ticks: 90,
      jiggler_detected: false,
      entropy_score: 0.91,
      variance: 0.87
    },
    keyboard: {
      keystrokes: 1100,
      keys_per_minute: 42.0,
      held_key_duration_sec: 0.0,
      held_key_detected: false
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 0, 0, 0, 48, 52, 45, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'AutoCAD / FreeCAD',
        duration_sec: 7200,
        share_pct: 66.7,
        category: 'Design & CAD',
        bytes: 8400000,
        window_samples: ['difference_engine_gear_train.step']
      }
    ],
    sessions: [],
    usb_events: [],
    network_events: [],
    file_transfers: [initialFileTransfers[5]]
  },
  {
    id: 'dev_05',
    hostname: 'Lab-MacBookAir-Shannon',
    platform: 'macos',
    os_version: 'macOS 14.5 (Sonoma)',
    serial_number: 'FVFX90LLP331',
    agent_version: 'v2.4.12-rc4',
    owner_name: 'Claude Shannon',
    owner_email: 'shannon@corp.com',
    owner_id: 'per_05',
    status: 'online',
    is_afk: false,
    raw_idle_sec: 12.0,
    last_seen: '2026-09-30T13:45:10Z',
    wifi_ssid: 'Corp_Guest_Secure',
    uptime_sec: 25400,
    boot_time: '2026-09-30T06:42:00Z',
    current_app: 'Obsidian',
    current_window: 'Entropy & Channel Capacity Notes.md — Research',
    active_screen_sec: 21600, // 6h 0m
    locked_sec: 1800,
    sleep_sec: 2000,
    shift_adherence_pct: 92.5,
    verdict: {
      verdict: 'genuine',
      confidence: 0.96,
      flags: [],
      reasons: ['Human typing pattern and organic note navigation']
    },
    mouse: {
      mouse_clicks: 980,
      mouse_movement_px: 16400,
      mouse_scroll_ticks: 410,
      jiggler_detected: false,
      entropy_score: 0.93,
      variance: 0.89
    },
    keyboard: {
      keystrokes: 5200,
      keys_per_minute: 71.0,
      held_key_duration_sec: 0.0,
      held_key_detected: false
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 0, 0, 32, 54, 52, 56, 48, 42, 54, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'Obsidian',
        duration_sec: 12960,
        share_pct: 60.0,
        category: 'Productivity',
        bytes: 140000,
        window_samples: ['Entropy & Channel Capacity Notes.md']
      },
      {
        app: 'Google Chrome',
        duration_sec: 8640,
        share_pct: 40.0,
        category: 'Web Browser',
        bytes: 64000000,
        window_samples: ['Bell System Technical Journal Archive', 'ArXiv math.IT']
      }
    ],
    sessions: [],
    usb_events: [],
    network_events: [],
    file_transfers: []
  },
  {
    id: 'dev_06',
    hostname: 'Cloud-Surface-Johnson',
    platform: 'windows',
    os_version: 'Windows 11 Pro',
    serial_number: 'MS-SURF-8812B',
    agent_version: 'v2.4.12-rc4',
    owner_name: 'Katherine Johnson',
    owner_email: 'katherine@corp.com',
    owner_id: 'per_06',
    status: 'online',
    is_afk: false,
    raw_idle_sec: 8.5,
    last_seen: '2026-09-30T13:46:02Z',
    wifi_ssid: 'Corp_Secure_5G',
    uptime_sec: 28800,
    boot_time: '2026-09-30T05:46:00Z',
    current_app: 'Microsoft Excel',
    current_window: 'orbital_trajectory_matrix_v4.xlsx',
    active_screen_sec: 23040, // 6h 24m
    locked_sec: 3200,
    sleep_sec: 2560,
    shift_adherence_pct: 95.1,
    verdict: {
      verdict: 'genuine',
      confidence: 0.99,
      flags: [],
      reasons: ['Precise formula input and spreadsheet cell traversal']
    },
    mouse: {
      mouse_clicks: 2100,
      mouse_movement_px: 29400,
      mouse_scroll_ticks: 680,
      jiggler_detected: false,
      entropy_score: 0.95,
      variance: 0.92
    },
    keyboard: {
      keystrokes: 6800,
      keys_per_minute: 78.4,
      held_key_duration_sec: 0.0,
      held_key_detected: false
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 0, 10, 48, 56, 58, 54, 52, 44, 58, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'Microsoft Excel',
        duration_sec: 16128,
        share_pct: 70.0,
        category: 'Finance & Analytics',
        bytes: 1400000,
        window_samples: ['orbital_trajectory_matrix_v4.xlsx', 'reentry_coordinates.csv']
      },
      {
        app: 'Wolfram Mathematica',
        duration_sec: 6912,
        share_pct: 30.0,
        category: 'Science & Math',
        bytes: 4200000,
        window_samples: ['geodesic_integration.nb']
      }
    ],
    sessions: [],
    usb_events: [],
    network_events: [],
    file_transfers: []
  },
  {
    id: 'dev_07',
    hostname: 'Dev-Flagged-08',
    platform: 'windows',
    os_version: 'Windows 11 Enterprise',
    serial_number: 'LEN-T14-FLG99',
    agent_version: 'v2.4.12-rc4',
    owner_name: 'Dev Tester / Subcontractor',
    owner_email: 'contractor08@corp.com',
    owner_id: 'per_07',
    status: 'online',
    is_afk: false,
    raw_idle_sec: 0.2,
    last_seen: '2026-09-30T13:46:12Z',
    wifi_ssid: 'Home_WiFi_Tether',
    uptime_sec: 31000,
    boot_time: '2026-09-30T05:00:00Z',
    current_app: 'Notepad',
    current_window: 'Untitled — Notepad',
    active_screen_sec: 28800, // 8h
    locked_sec: 120,
    sleep_sec: 0,
    shift_adherence_pct: 100.0,
    verdict: {
      verdict: 'automated-looking',
      confidence: 0.96,
      flags: ['mouse_jiggler', 'scripted_input', 'held_key'],
      reasons: [
        'Synthetic mouse trajectory detected: zero entropy (score: 0.04) with constant 100px linear loops',
        'Continuous uniform key intervals flagged: variance < 0.001ms (inhuman script cadence)',
        'Continuous held spacebar scan code recorded for 180s without release'
      ]
    },
    mouse: {
      mouse_clicks: 12,
      mouse_movement_px: 88400,
      mouse_scroll_ticks: 0,
      jiggler_detected: true,
      entropy_score: 0.04, // Extremely low!
      variance: 0.01
    },
    keyboard: {
      keystrokes: 840,
      keys_per_minute: 120.0,
      held_key_duration_sec: 180.0,
      held_key_detected: true
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'Notepad',
        duration_sec: 25200,
        share_pct: 87.5,
        category: 'Utilities',
        bytes: 12000,
        window_samples: ['Untitled — Notepad']
      },
      {
        app: 'AutoClicker / Jiggler.exe',
        duration_sec: 3600,
        share_pct: 12.5,
        category: 'Suspicious Software',
        bytes: 0,
        window_samples: ['Mouse Jiggler v1.8 (Foreground/Background)']
      }
    ],
    sessions: [
      {
        id: 'sess_flg_01',
        type: 'app_session',
        app: 'Notepad',
        window: 'Untitled — Notepad',
        start_time: '2026-09-30T09:00:00Z',
        duration_sec: 14400,
        keystrokes: 240,
        mouse_clicks: 4,
        mouse_movement_px: 44000,
        mouse_scroll_ticks: 0,
        idle_sec: 0,
        flags: ['mouse_jiggler', 'held_key']
      }
    ],
    usb_events: [
      {
        id: 'usb_jiggler_dongle',
        type: 'usb_event',
        action: 'INSERTED',
        device_name: 'USB Mouse Jiggler / Virtual HID Mover',
        vendor_id: '1A86',
        product_id: '7523',
        serial_number: 'CH340-EMULATOR-HID',
        is_mass_storage: false,
        timestamp: '2026-09-30T08:59:12Z',
        risk_level: 'ALERT'
      }
    ],
    network_events: [],
    file_transfers: [initialFileTransfers[2]]
  },
  {
    id: 'dev_08',
    hostname: 'Linus-Laptop-M3',
    platform: 'macos',
    os_version: 'macOS 15.0',
    serial_number: 'C02K9981LLM',
    agent_version: 'v2.4.12-rc4',
    owner_name: 'Linus Torvalds',
    owner_email: 'linus@corp.com',
    owner_id: 'per_08',
    status: 'online',
    is_afk: false,
    raw_idle_sec: 19.4,
    last_seen: '2026-09-30T13:45:30Z',
    wifi_ssid: 'Corp_Secure_5G',
    uptime_sec: 42000,
    boot_time: '2026-09-30T02:06:00Z',
    current_app: 'Alacritty',
    current_window: 'git diff master..next — kernel/sched/fair.c',
    active_screen_sec: 25920, // 7h 12m
    locked_sec: 2800,
    sleep_sec: 1400,
    shift_adherence_pct: 97.2,
    verdict: {
      verdict: 'genuine',
      confidence: 0.99,
      flags: [],
      reasons: ['Fast, authentic terminal git workflow and organic cadence']
    },
    mouse: {
      mouse_clicks: 640,
      mouse_movement_px: 11200,
      mouse_scroll_ticks: 740,
      jiggler_detected: false,
      entropy_score: 0.95,
      variance: 0.93
    },
    keyboard: {
      keystrokes: 7400,
      keys_per_minute: 88.5,
      held_key_duration_sec: 0.0,
      held_key_detected: false
    },
    hourly_active_minutes: [
      0, 0, 0, 0, 0, 15, 45, 58, 60, 56, 58, 54, 45, 56, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ],
    top_apps: [
      {
        app: 'Alacritty',
        duration_sec: 19440,
        share_pct: 75.0,
        category: 'Development',
        bytes: 18400000,
        window_samples: ['git diff master..next', 'make -j16 bzImage']
      },
      {
        app: 'Thunderbird / Mail',
        duration_sec: 6480,
        share_pct: 25.0,
        category: 'Communication',
        bytes: 4200000,
        window_samples: ['LKML Patch Review: scheduler cfs']
      }
    ],
    sessions: [],
    usb_events: [],
    network_events: [],
    file_transfers: []
  }
];

export const initialAssets: AssetRecord[] = [
  {
    id: 'ast_01',
    device_name: 'Ada-MacBook-Pro',
    serial_number: 'C02G90LKMD6T',
    model: 'Apple MacBook Pro 16" M3 Max',
    type: 'Laptop',
    assigned_owner: 'Ada Lovelace',
    owner_email: 'ada@corp.com',
    owner_phone: '+1 (555) 234-8901',
    token_state: 'Active',
    token: 'aro_live_7e8b91c490a12e34d7',
    device_status: 'Active',
    enrolled_at: '2026-01-15T09:00:00Z',
    last_seen_at: '2026-09-30T13:46:00Z'
  },
  {
    id: 'ast_02',
    device_name: 'Dev-Win11-Turing',
    serial_number: 'PF3Z8810K',
    model: 'Lenovo ThinkPad P1 Gen 6',
    type: 'Laptop',
    assigned_owner: 'Alan Turing',
    owner_email: 'alan@corp.com',
    owner_phone: '+1 (555) 432-1190',
    token_state: 'Active',
    token: 'aro_live_3f1a88b90c144e55a2',
    device_status: 'Active',
    enrolled_at: '2026-02-01T10:30:00Z',
    last_seen_at: '2026-09-30T13:45:50Z'
  },
  {
    id: 'ast_03',
    device_name: 'Sec-ThinkPad-Hopper',
    serial_number: 'TP-X1C-9901A',
    model: 'Lenovo ThinkPad X1 Carbon Gen 11',
    type: 'Laptop',
    assigned_owner: 'Grace Hopper',
    owner_email: 'grace@corp.com',
    owner_phone: '+1 (555) 901-4432',
    token_state: 'Active',
    token: 'aro_live_99d123e44b810f22c1',
    device_status: 'Active',
    enrolled_at: '2026-01-20T11:15:00Z',
    last_seen_at: '2026-09-30T13:46:10Z'
  },
  {
    id: 'ast_04',
    device_name: 'Workstation-Babbage',
    serial_number: 'DELL-PWS-4410',
    model: 'Dell Precision 7960 Tower',
    type: 'Workstation',
    assigned_owner: 'Charles Babbage',
    owner_email: 'charles@corp.com',
    owner_phone: '+1 (555) 881-2299',
    token_state: 'Active',
    token: 'aro_live_12c984ff30e99a88b1',
    device_status: 'Active',
    enrolled_at: '2025-11-10T14:00:00Z',
    last_seen_at: '2026-09-30T11:45:00Z'
  },
  {
    id: 'ast_05',
    device_name: 'Lab-MacBookAir-Shannon',
    serial_number: 'FVFX90LLP331',
    model: 'Apple MacBook Air 15" M3',
    type: 'Laptop',
    assigned_owner: 'Claude Shannon',
    owner_email: 'shannon@corp.com',
    owner_phone: '+1 (555) 772-0044',
    token_state: 'Active',
    token: 'aro_live_55a90123cd44ee8810',
    device_status: 'Active',
    enrolled_at: '2026-03-01T08:20:00Z',
    last_seen_at: '2026-09-30T13:45:10Z'
  },
  {
    id: 'ast_06',
    device_name: 'Cloud-Surface-Johnson',
    serial_number: 'MS-SURF-8812B',
    model: 'Microsoft Surface Laptop Studio 2',
    type: 'Laptop',
    assigned_owner: 'Katherine Johnson',
    owner_email: 'katherine@corp.com',
    owner_phone: '+1 (555) 334-1188',
    token_state: 'Active',
    token: 'aro_live_66b88900ac124fee33',
    device_status: 'Active',
    enrolled_at: '2026-02-14T09:45:00Z',
    last_seen_at: '2026-09-30T13:46:02Z'
  },
  {
    id: 'ast_07',
    device_name: 'Dev-Flagged-08',
    serial_number: 'LEN-T14-FLG99',
    model: 'Lenovo ThinkPad T14 Gen 4',
    type: 'Laptop',
    assigned_owner: 'Dev Tester / Subcontractor',
    owner_email: 'contractor08@corp.com',
    owner_phone: '+1 (555) 998-1234',
    token_state: 'Active',
    token: 'aro_live_88ff110022ee44aa99',
    device_status: 'Active',
    enrolled_at: '2026-04-10T16:00:00Z',
    last_seen_at: '2026-09-30T13:46:12Z'
  },
  {
    id: 'ast_08',
    device_name: 'Linus-Laptop-M3',
    serial_number: 'C02K9981LLM',
    model: 'Apple MacBook Pro 14" M3 Pro',
    type: 'Laptop',
    assigned_owner: 'Linus Torvalds',
    owner_email: 'linus@corp.com',
    owner_phone: '+1 (555) 554-3211',
    token_state: 'Active',
    token: 'aro_live_44dd11223344556677',
    device_status: 'Active',
    enrolled_at: '2026-01-05T12:00:00Z',
    last_seen_at: '2026-09-30T13:45:30Z'
  }
];

export const initialPeople: PersonRecord[] = [
  {
    id: 'per_01',
    full_name: 'Ada Lovelace',
    email: 'ada@corp.com',
    phone: '+1 (555) 234-8901',
    role: 'Principal Systems Architect',
    shift: '09:00–18:00 IST',
    manager: 'Charles Babbage (VP Systems)',
    avatar_initials: 'AL',
    linked_device_ids: ['dev_01'],
    daily_active_avg_hours: 6.8,
    engagement_verdict: 'genuine',
    monthly_history: [
      { month: 'Oct 25', active_hours: 148, idle_ratio_pct: 14, sessions_count: 320, flags_count: 0, benchmark_avg_hours: 142 },
      { month: 'Nov 25', active_hours: 152, idle_ratio_pct: 12, sessions_count: 340, flags_count: 0, benchmark_avg_hours: 142 },
      { month: 'Dec 25', active_hours: 138, idle_ratio_pct: 15, sessions_count: 290, flags_count: 0, benchmark_avg_hours: 135 },
      { month: 'Jan 26', active_hours: 160, idle_ratio_pct: 11, sessions_count: 360, flags_count: 0, benchmark_avg_hours: 144 },
      { month: 'Feb 26', active_hours: 154, idle_ratio_pct: 13, sessions_count: 330, flags_count: 0, benchmark_avg_hours: 140 },
      { month: 'Mar 26', active_hours: 162, idle_ratio_pct: 10, sessions_count: 375, flags_count: 0, benchmark_avg_hours: 145 },
      { month: 'Apr 26', active_hours: 158, idle_ratio_pct: 12, sessions_count: 350, flags_count: 0, benchmark_avg_hours: 144 },
      { month: 'May 26', active_hours: 164, idle_ratio_pct: 11, sessions_count: 380, flags_count: 0, benchmark_avg_hours: 145 },
      { month: 'Jun 26', active_hours: 150, idle_ratio_pct: 14, sessions_count: 320, flags_count: 0, benchmark_avg_hours: 142 },
      { month: 'Jul 26', active_hours: 158, idle_ratio_pct: 13, sessions_count: 340, flags_count: 0, benchmark_avg_hours: 143 },
      { month: 'Aug 26', active_hours: 166, idle_ratio_pct: 10, sessions_count: 390, flags_count: 0, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 162, idle_ratio_pct: 12, sessions_count: 365, flags_count: 0, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 6.75, idle_ratio_pct: 15.6, sessions_count: 14, flags: [] },
      { date: '2026-09-29', active_hours: 7.20, idle_ratio_pct: 12.0, sessions_count: 18, flags: [] },
      { date: '2026-09-28', active_hours: 6.90, idle_ratio_pct: 14.2, sessions_count: 16, flags: [] },
      { date: '2026-09-27', active_hours: 7.10, idle_ratio_pct: 11.5, sessions_count: 15, flags: [] },
      { date: '2026-09-26', active_hours: 6.50, idle_ratio_pct: 16.0, sessions_count: 12, flags: [] }
    ]
  },
  {
    id: 'per_02',
    full_name: 'Alan Turing',
    email: 'alan@corp.com',
    phone: '+1 (555) 432-1190',
    role: 'Lead Cryptanalysis Engineer',
    shift: '09:00–18:00 IST',
    manager: 'Charles Babbage (VP Systems)',
    avatar_initials: 'AT',
    linked_device_ids: ['dev_02'],
    daily_active_avg_hours: 7.0,
    engagement_verdict: 'genuine',
    monthly_history: [
      { month: 'May 26', active_hours: 168, idle_ratio_pct: 9, sessions_count: 410, flags_count: 0, benchmark_avg_hours: 145 },
      { month: 'Jun 26', active_hours: 162, idle_ratio_pct: 10, sessions_count: 390, flags_count: 0, benchmark_avg_hours: 142 },
      { month: 'Jul 26', active_hours: 170, idle_ratio_pct: 8, sessions_count: 420, flags_count: 0, benchmark_avg_hours: 143 },
      { month: 'Aug 26', active_hours: 165, idle_ratio_pct: 11, sessions_count: 385, flags_count: 0, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 168, idle_ratio_pct: 9, sessions_count: 415, flags_count: 0, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 7.00, idle_ratio_pct: 12.5, sessions_count: 19, flags: [] },
      { date: '2026-09-29', active_hours: 7.40, idle_ratio_pct: 10.0, sessions_count: 22, flags: [] }
    ]
  },
  {
    id: 'per_03',
    full_name: 'Grace Hopper',
    email: 'grace@corp.com',
    phone: '+1 (555) 901-4432',
    role: 'Compiler Systems Director',
    shift: '09:00–18:00 IST',
    manager: 'Charles Babbage (VP Systems)',
    avatar_initials: 'GH',
    linked_device_ids: ['dev_03'],
    daily_active_avg_hours: 6.5,
    engagement_verdict: 'genuine',
    monthly_history: [
      { month: 'Jul 26', active_hours: 156, idle_ratio_pct: 12, sessions_count: 330, flags_count: 0, benchmark_avg_hours: 143 },
      { month: 'Aug 26', active_hours: 160, idle_ratio_pct: 11, sessions_count: 345, flags_count: 0, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 155, idle_ratio_pct: 13, sessions_count: 325, flags_count: 0, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 6.50, idle_ratio_pct: 13.3, sessions_count: 16, flags: [] }
    ]
  },
  {
    id: 'per_04',
    full_name: 'Charles Babbage',
    email: 'charles@corp.com',
    phone: '+1 (555) 881-2299',
    role: 'VP Systems & Hardware Engineering',
    shift: '09:00–18:00 IST',
    manager: 'Board of Directors',
    avatar_initials: 'CB',
    linked_device_ids: ['dev_04'],
    daily_active_avg_hours: 5.2,
    engagement_verdict: 'idle',
    monthly_history: [
      { month: 'Aug 26', active_hours: 120, idle_ratio_pct: 22, sessions_count: 210, flags_count: 0, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 115, idle_ratio_pct: 25, sessions_count: 195, flags_count: 0, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 3.00, idle_ratio_pct: 35.0, sessions_count: 6, flags: [] }
    ]
  },
  {
    id: 'per_05',
    full_name: 'Claude Shannon',
    email: 'shannon@corp.com',
    phone: '+1 (555) 772-0044',
    role: 'Staff Research Scientist',
    shift: '10:00–19:00 IST',
    manager: 'Ada Lovelace',
    avatar_initials: 'CS',
    linked_device_ids: ['dev_05'],
    daily_active_avg_hours: 6.2,
    engagement_verdict: 'genuine',
    monthly_history: [
      { month: 'Aug 26', active_hours: 152, idle_ratio_pct: 14, sessions_count: 310, flags_count: 0, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 158, idle_ratio_pct: 12, sessions_count: 320, flags_count: 0, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 6.00, idle_ratio_pct: 12.0, sessions_count: 14, flags: [] }
    ]
  },
  {
    id: 'per_06',
    full_name: 'Katherine Johnson',
    email: 'katherine@corp.com',
    phone: '+1 (555) 334-1188',
    role: 'Principal Orbital Trajectory Specialist',
    shift: '08:30–17:30 IST',
    manager: 'Grace Hopper',
    avatar_initials: 'KJ',
    linked_device_ids: ['dev_06'],
    daily_active_avg_hours: 6.4,
    engagement_verdict: 'genuine',
    monthly_history: [
      { month: 'Aug 26', active_hours: 160, idle_ratio_pct: 11, sessions_count: 350, flags_count: 0, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 164, idle_ratio_pct: 10, sessions_count: 360, flags_count: 0, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 6.40, idle_ratio_pct: 11.0, sessions_count: 15, flags: [] }
    ]
  },
  {
    id: 'per_07',
    full_name: 'Dev Tester / Subcontractor',
    email: 'contractor08@corp.com',
    phone: '+1 (555) 998-1234',
    role: 'External QA Contractor',
    shift: '09:00–18:00 IST',
    manager: 'Ada Lovelace',
    avatar_initials: 'DT',
    linked_device_ids: ['dev_07'],
    daily_active_avg_hours: 8.0,
    engagement_verdict: 'automated-looking',
    monthly_history: [
      { month: 'Aug 26', active_hours: 180, idle_ratio_pct: 1, sessions_count: 120, flags_count: 4, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 184, idle_ratio_pct: 0.5, sessions_count: 110, flags_count: 8, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 8.00, idle_ratio_pct: 0.4, sessions_count: 4, flags: ['mouse_jiggler', 'scripted_input'] }
    ]
  },
  {
    id: 'per_08',
    full_name: 'Linus Torvalds',
    email: 'linus@corp.com',
    phone: '+1 (555) 554-3211',
    role: 'Chief Kernel Fellow',
    shift: 'Flexible / US-Pacific',
    manager: 'Board of Directors',
    avatar_initials: 'LT',
    linked_device_ids: ['dev_08'],
    daily_active_avg_hours: 7.2,
    engagement_verdict: 'genuine',
    monthly_history: [
      { month: 'Aug 26', active_hours: 172, idle_ratio_pct: 9, sessions_count: 430, flags_count: 0, benchmark_avg_hours: 146 },
      { month: 'Sep 26', active_hours: 175, idle_ratio_pct: 8, sessions_count: 440, flags_count: 0, benchmark_avg_hours: 145 }
    ],
    recent_days_rollup: [
      { date: '2026-09-30', active_hours: 7.20, idle_ratio_pct: 9.8, sessions_count: 24, flags: [] }
    ]
  }
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud_01',
    timestamp: '2026-09-30T13:40:02Z',
    actor_email: 'admin@arohak.com',
    action: 'firewall.rule.toggle',
    target_resource_id: 'rule_ai_block',
    client_ip: '10.0.4.12',
    status: 'SUCCESS',
    details: 'Enforced Gen AI & LLM restriction rule across 42 devices.'
  },
  {
    id: 'aud_02',
    timestamp: '2026-09-30T12:15:33Z',
    actor_email: 'admin@arohak.com',
    action: 'token.generate',
    target_resource_id: 'ast_08 (Linus-Laptop-M3)',
    client_ip: '10.0.4.12',
    status: 'SUCCESS',
    details: 'Generated permanent enrollment token aro_live_44dd1122... with hardware UUID lock.'
  },
  {
    id: 'aud_03',
    timestamp: '2026-09-30T11:00:20Z',
    actor_email: 'admin@arohak.com',
    action: 'asset.register',
    target_resource_id: 'ast_07 (Dev-Flagged-08)',
    client_ip: '10.0.4.12',
    status: 'SUCCESS',
    details: 'Registered new contractor hardware asset Lenovo ThinkPad T14.'
  },
  {
    id: 'aud_04',
    timestamp: '2026-09-30T09:42:10Z',
    actor_email: 'system.scheduler',
    action: 'compliance.purge_and_rollup',
    target_resource_id: 'signal_events',
    client_ip: '127.0.0.1',
    status: 'SUCCESS',
    details: 'Nightly retention job completed: purged raw events older than 90 days, rolled 42 devices into daily summaries.'
  },
  {
    id: 'aud_05',
    timestamp: '2026-09-30T08:10:00Z',
    actor_email: 'admin@arohak.com',
    action: 'people.reconciliation',
    target_resource_id: 'people_registry',
    client_ip: '10.0.4.12',
    status: 'SUCCESS',
    details: 'Executed auto-reconciliation algorithm; verified 8 people mapped to 8 active hardware endpoints.'
  }
];
