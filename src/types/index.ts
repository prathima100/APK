export type Platform = 'macos' | 'windows';

export type DeviceState = 'online' | 'offline';

export type SessionVerdict = 'genuine' | 'automated-looking' | 'idle' | 'review';

export type ThreatSensorType = 
  | 'ip_spoof'
  | 'hotspot'
  | 'proxy'
  | 'jailbreak_root'
  | 'device_attestation'
  | 'payload_integrity'
  | 'data_leak';

export interface AppSession {
  id: string;
  type: 'app_session';
  app: string;
  window: string;
  start_time: string;
  duration_sec: number;
  keystrokes: number;
  mouse_clicks: number;
  mouse_movement_px: number;
  mouse_scroll_ticks: number;
  idle_sec: number;
  bytes_transferred?: number;
  flags: string[];
}

export interface ScreenSession {
  type: 'screen_session';
  state: 'ACTIVE' | 'LOCKED' | 'SLEEP';
  start_time: string;
  duration_sec: number;
  boot_time: string;
  system_uptime_seconds: number;
  wifi_ssid: string;
}

export interface AntiCheatVerdict {
  verdict: SessionVerdict;
  confidence: number;
  flags: ('mouse_jiggler' | 'held_key' | 'scripted_input' | 'remote_access_tool' | 'outside_shift_window')[];
  reasons: string[];
}

export interface MouseCadence {
  mouse_clicks: number;
  mouse_movement_px: number;
  mouse_scroll_ticks: number;
  jiggler_detected: boolean;
  entropy_score: number; // 0.0 to 1.0 (high is organic, <0.15 is synthetic)
  variance: number;
}

export interface KeyboardCadence {
  keystrokes: number;
  keys_per_minute: number;
  held_key_duration_sec: number;
  held_key_detected: boolean;
}

export interface NetworkEvent {
  id: string;
  type: 'network_event';
  remote_domain: string;
  remote_ip: string;
  remote_port: number;
  bytes_sent: number;
  bytes_recv: number;
  process_name: string;
  timestamp: string;
  status?: 'ALLOWED' | 'BLOCKED' | 'QUARANTINED';
}

export interface UsbEvent {
  id: string;
  type: 'usb_event';
  action: 'INSERTED' | 'REMOVED';
  device_name: string;
  vendor_id: string;
  product_id: string;
  serial_number: string;
  is_mass_storage: boolean;
  mount_point?: string;
  timestamp: string;
  risk_level: 'OK' | 'WARNING' | 'ALERT';
}

export type FileDestinationType = 'USB_STORAGE' | 'CLOUD_SYNC' | 'BROWSER_UPLOAD' | 'NETWORK_SHARE' | 'DOWNLOAD_INBOUND';

export interface FileTransferEvent {
  id: string;
  type: 'file_transfer_event';
  file_name: string;
  file_extension: string;
  file_size_bytes: number;
  file_hash_sha256: string;
  source_path: string;
  destination_target: string;
  destination_type: FileDestinationType;
  reporting_device_id: string;
  reporting_device_name: string;
  owner_name: string;
  owner_email: string;
  timestamp: string;
  action_decision: 'BLOCKED' | 'QUARANTINED' | 'ALLOWED';
  dlp_violation_rule?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  initiating_process: string;
}

export interface ThreatDetectorInfo {
  id: ThreatSensorType;
  name: string;
  tag: string;
  status: 'ACTIVE' | 'WARNING' | 'ALERT';
  summary: string;
  technical_probe: string;
  detections_24h: number;
  last_probe_event: string;
}

export interface FirewallRule {
  id: string;
  name: string;
  description: string;
  layer: 'IDENTITY' | 'PAYLOAD' | 'NETWORK' | 'APPLICATION' | 'WEB' | 'POLICY_PRIORITY';
  targets: string[];
  action: 'ALLOW' | 'BLOCK' | 'QUARANTINE';
  priority: number;
  enabled: boolean;
  blocks_today: number;
  category: 'ai' | 'media' | 'social' | 'p2p' | 'ports' | 'custom';
}

export interface FirewallEvent {
  id: string;
  type: 'firewall_event';
  decision: 'BLOCK' | 'ALLOW' | 'QUARANTINE';
  rule_id: string;
  rule_name: string;
  device_id: string;
  device_name: string;
  target: string;
  matched_layer: 'IDENTITY' | 'PAYLOAD' | 'NETWORK' | 'APPLICATION' | 'WEB';
  teardown_executed: boolean;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  payload_summary?: string;
}

export interface DeviceTelemetry {
  id: string;
  hostname: string;
  platform: Platform;
  os_version: string;
  serial_number: string;
  agent_version: string;
  owner_name: string;
  owner_email: string;
  owner_id: string;
  status: DeviceState;
  is_afk: boolean;
  afk_since?: string;
  raw_idle_sec: number;
  last_seen: string;
  wifi_ssid: string;
  uptime_sec: number;
  boot_time: string;
  current_app: string;
  current_window: string;
  active_screen_sec: number;
  locked_sec: number;
  sleep_sec: number;
  shift_adherence_pct: number;
  verdict: AntiCheatVerdict;
  mouse: MouseCadence;
  keyboard: KeyboardCadence;
  hourly_active_minutes: number[]; // 24 entries (0h - 23h)
  top_apps: {
    app: string;
    duration_sec: number;
    share_pct: number;
    category: string;
    bytes: number;
    window_samples: string[];
  }[];
  sessions: AppSession[];
  usb_events: UsbEvent[];
  network_events: NetworkEvent[];
  file_transfers: FileTransferEvent[];
}

export interface AssetRecord {
  id: string;
  device_name: string;
  serial_number: string;
  model: string;
  type: 'Laptop' | 'Desktop' | 'Workstation';
  assigned_owner: string;
  owner_email: string;
  owner_phone: string;
  token_state: 'Active' | 'Pending' | 'Revoked';
  token: string;
  device_status: 'Active' | 'Retired';
  enrolled_at: string;
  last_seen_at: string;
}

export interface MonthlyEngagement {
  month: string;
  active_hours: number;
  idle_ratio_pct: number;
  sessions_count: number;
  flags_count: number;
  benchmark_avg_hours: number;
}

export interface PersonRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  shift: string; // e.g. "09:00–18:00 IST"
  manager: string;
  avatar_initials: string;
  linked_device_ids: string[];
  daily_active_avg_hours: number;
  engagement_verdict: SessionVerdict;
  monthly_history: MonthlyEngagement[];
  recent_days_rollup: {
    date: string;
    active_hours: number;
    idle_ratio_pct: number;
    sessions_count: number;
    flags: string[];
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_email: string;
  action: string;
  target_resource_id: string;
  client_ip: string;
  status: 'SUCCESS' | 'REVOKED' | 'WARNING';
  details: string;
}
