import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeviceHeader } from '../components/device-detail/DeviceHeader';
import { ScreenTimeStats } from '../components/device-detail/ScreenTimeStats';
import { SuspiciousList } from '../components/device-detail/SuspiciousList';
import { Timeline } from '../components/device-detail/Timeline';
import { ActiveHoursChart } from '../components/device-detail/ActiveHoursChart';
import { TopAppsChart } from '../components/device-detail/TopAppsChart';
import { AppUsageDetails } from '../components/device-detail/AppUsageDetails';
import { MouseActivityCard } from '../components/device-detail/MouseActivityCard';
import { UsbActivityCard } from '../components/device-detail/UsbActivityCard';
import { NetworkActivityCard } from '../components/device-detail/NetworkActivityCard';
import { DeviceTransfersTab } from '../components/device-detail/DeviceTransfersTab';
import { TabsList, TabTrigger } from '../components/ui/tabs';
import { Activity, Cpu, AlertTriangle, ArrowDownToLine } from 'lucide-react';

export const DeviceDetailPage: React.FC = () => {
  const { selectedDevice, devices } = useApp();
  const [selectedDate, setSelectedDate] = useState('2026-09-30');
  const [activeTab, setActiveTab] = useState<'activity' | 'peripherals' | 'transfers'>('activity');

  const device = selectedDevice || devices[0];

  return (
    <div className="space-y-6">
      {/* Section 1: Navigation & Device Header */}
      <DeviceHeader
        device={device}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Section 2: Screen Time & Productivity Stats */}
      <ScreenTimeStats device={device} />

      {/* Section 3: Suspicious Anti-Cheat Alerts (Shown if flags present) */}
      <SuspiciousList device={device} />

      {/* Section 4: Deep-Dive Tabs */}
      <div className="space-y-4">
        {/* Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <TabsList>
            <TabTrigger
              active={activeTab === 'activity'}
              onClick={() => setActiveTab('activity')}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Activity & Cadence</span>
            </TabTrigger>

            <TabTrigger
              active={activeTab === 'peripherals'}
              onClick={() => setActiveTab('peripherals')}
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Peripherals & Hardware</span>
            </TabTrigger>

            <TabTrigger
              active={activeTab === 'transfers'}
              onClick={() => setActiveTab('transfers')}
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>File Transfers & Downloads</span>
            </TabTrigger>
          </TabsList>

          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Active Endpoint: {device.hostname} ({device.os_version})
          </span>
        </div>

        {/* Tab 1: Activity & Cadence */}
        {activeTab === 'activity' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Session Timeline */}
            <Timeline device={device} />

            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ActiveHoursChart device={device} />
              <TopAppsChart device={device} />
            </div>

            {/* App Usage Details Drilldown */}
            <AppUsageDetails device={device} />
          </div>
        )}

        {/* Tab 2: Peripherals & Hardware Forensics */}
        {activeTab === 'peripherals' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Mouse & Keyboard Cadence Analysis */}
            <MouseActivityCard mouse={device.mouse} keyboard={device.keyboard} />

            {/* USB Peripheral & Mass Storage Sentinel */}
            <UsbActivityCard events={device.usb_events} />

            {/* Outbound Network Activity & Remote Domains */}
            <NetworkActivityCard events={device.network_events} />
          </div>
        )}

        {/* Tab 3: File Transfers & Downloads */}
        {activeTab === 'transfers' && (
          <DeviceTransfersTab device={device} />
        )}
      </div>
    </div>
  );
};
