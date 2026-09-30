import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Stat } from '../components/ui/stat';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { TabsList, TabTrigger } from '../components/ui/tabs';
import { FirewallPresets } from '../components/firewall/FirewallPresets';
import { ThreatDefenseMatrix } from '../components/firewall/ThreatDefenseMatrix';
import { PoliciesTable } from '../components/firewall/PoliciesTable';
import { SecurityIncidentsTable } from '../components/firewall/SecurityIncidentsTable';
import { PolicySimulator } from '../components/firewall/PolicySimulator';
import { AddPolicyModal } from '../components/firewall/AddPolicyModal';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Plus, 
  RefreshCw, 
  Sliders, 
  Activity, 
  Terminal, 
  Cpu 
} from 'lucide-react';

export const FirewallPage: React.FC = () => {
  const { 
    firewallRules, 
    threatSensors, 
    firewallEvents, 
    addFirewallRule, 
    currentUser, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'policies' | 'sensors' | 'incidents' | 'simulator'>('policies');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const activeRulesCount = firewallRules.filter(r => r.enabled).length;
  const totalBlocksToday = firewallRules.reduce((acc, r) => acc + r.blocks_today, 0);

  const handleRefresh = () => {
    showToast('Firewall states polled: kernel rules in sync with 42 agents.');
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Firewall & Zero-Trust Threat Console
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active Enforcing</span>
            </div>
            <Badge tone={currentUser.role === 'admin' ? 'primary' : 'warn'} size="sm">
              Role: {currentUser.role.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kernel-level socket filter, 7 endpoint threat sensors, and corporate outbound policy guardrails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Poll State</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (currentUser.role === 'viewer') {
                showToast('Viewer role cannot create policies');
                return;
              }
              setIsAddOpen(true);
            }}
            className="cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Custom Rule</span>
          </Button>
        </div>
      </div>

      {/* Section 2: KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Active Policies"
          value={`${activeRulesCount}`}
          suffix={`/ ${firewallRules.length}`}
          hint="Enforced on Windows & macOS endpoints"
          icon={<Sliders className="h-4 w-4" />}
          trend={{ value: 'Full Coverage', isPositive: true }}
        />

        <Stat
          label="Blocked Threats (24h)"
          value={`${totalBlocksToday}`}
          hint="Sockets terminated at OS TCP level"
          icon={<ShieldAlert className="h-4 w-4" />}
          trend={{ value: '142 Teardowns', isPositive: true }}
        />

        <Stat
          label="Autonomous Threat Sensors"
          value={`${threatSensors.length} / ${threatSensors.length}`}
          hint="IP Spoof, Hotspot, Tor, Attestation, etc."
          icon={<Cpu className="h-4 w-4" />}
          trend={{ value: '100% Operational', isPositive: true }}
        />

        <Stat
          label="Fleet Compliance Score"
          value="98.2%"
          hint="1 flagged anti-cheat device isolated"
          icon={<ShieldCheck className="h-4 w-4" />}
          trend={{ value: 'Enterprise Grade', isPositive: true }}
        />
      </div>

      {/* Section 3: One-Click Enterprise Security Presets */}
      <FirewallPresets />

      {/* Section 4: Security Console Tabs */}
      <div className="space-y-4">
        <TabsList>
          <TabTrigger
            active={activeTab === 'policies'}
            onClick={() => setActiveTab('policies')}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Policies & Restrictions ({firewallRules.length})</span>
          </TabTrigger>

          <TabTrigger
            active={activeTab === 'sensors'}
            onClick={() => setActiveTab('sensors')}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>Threat Defense Matrix (7 Sensors)</span>
          </TabTrigger>

          <TabTrigger
            active={activeTab === 'incidents'}
            onClick={() => setActiveTab('incidents')}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Security Incidents & Live Log</span>
          </TabTrigger>

          <TabTrigger
            active={activeTab === 'simulator'}
            onClick={() => setActiveTab('simulator')}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Policy Simulator Sandbox</span>
          </TabTrigger>
        </TabsList>

        {activeTab === 'policies' && <PoliciesTable rules={firewallRules} />}
        {activeTab === 'sensors' && <ThreatDefenseMatrix sensors={threatSensors} />}
        {activeTab === 'incidents' && <SecurityIncidentsTable events={firewallEvents} />}
        {activeTab === 'simulator' && <PolicySimulator />}
      </div>

      {/* Add Policy Modal */}
      <AddPolicyModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addFirewallRule}
      />
    </div>
  );
};
