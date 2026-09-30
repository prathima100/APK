import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { RegisterDeviceModal } from '../components/assets/RegisterDeviceModal';
import { PermanentTokenModal } from '../components/assets/PermanentTokenModal';
import { Download, Upload, Plus, Key, Archive, Trash2, Laptop, Monitor, Server } from 'lucide-react';
import { formatRelativeTime } from '../lib/utils';

export const AssetsPage: React.FC = () => {
  const { assets, registerAsset, regenerateToken, retireAsset, purgeAsset, currentUser, showToast } = useApp();
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [newTokenModalData, setNewTokenModalData] = useState<{ token: string; deviceName: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRegisterSubmit = (data: any) => {
    const { asset, rawToken } = registerAsset(data);
    setNewTokenModalData({ token: rawToken, deviceName: asset.device_name });
  };

  const handleRegenerate = (id: string, name: string) => {
    if (currentUser.role === 'viewer') {
      showToast('Viewer role cannot regenerate tokens (read-only)');
      return;
    }
    const token = regenerateToken(id);
    setNewTokenModalData({ token, deviceName: name });
  };

  const handleRetire = (id: string) => {
    if (currentUser.role === 'viewer') {
      showToast('Viewer role cannot retire assets');
      return;
    }
    retireAsset(id);
  };

  const handlePurge = (id: string) => {
    if (currentUser.role === 'viewer') {
      showToast('Viewer role cannot purge assets');
      return;
    }
    if (confirm('Are you sure you want to permanently purge this asset?')) {
      purgeAsset(id);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Device Name,Serial Number,Model,Type,Assigned Owner,Email,Token State,Status,Enrolled Date'];
    const rows = assets.map(a => 
      `"${a.device_name}","${a.serial_number}","${a.model}","${a.type}","${a.assigned_owner}","${a.owner_email}","${a.token_state}","${a.device_status}","${a.enrolled_at}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arohak_hardware_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported asset register to CSV');
  };

  // CSV Import simulation
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      showToast(`Imported ${file.name}: 3 new records synchronized`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Global Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Assets Register
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hardware inventory, cryptographic machine binding, and token lifecycle management.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCsv}
            accept=".csv"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import CSV</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Register Device</span>
          </Button>
        </div>
      </div>

      {/* Assets Inventory Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Device & Hardware Serial</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium">Assigned Owner</th>
                <th className="py-3 px-4 font-medium">Token State</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Enrolled</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Device & Model */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {asset.type === 'Laptop' ? (
                          <Laptop className="h-4 w-4" />
                        ) : asset.type === 'Workstation' ? (
                          <Server className="h-4 w-4" />
                        ) : (
                          <Monitor className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {asset.device_name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          SN: {asset.serial_number} · {asset.model}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {asset.type}
                  </td>

                  {/* Owner */}
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {asset.assigned_owner}
                    </div>
                    <div className="text-[11px] text-slate-400">{asset.owner_email}</div>
                  </td>

                  {/* Token State */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge tone={asset.token_state === 'Active' ? 'ok' : 'neutral'} size="sm">
                      {asset.token_state}
                    </Badge>
                  </td>

                  {/* Device Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge tone={asset.device_status === 'Active' ? 'primary' : 'warn'} size="sm">
                      {asset.device_status}
                    </Badge>
                  </td>

                  {/* Enrolled */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {formatRelativeTime(asset.enrolled_at)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerate(asset.id, asset.device_name)}
                        title="Regenerate permanent cryptographic enrollment token"
                      >
                        <Key className="h-3.5 w-3.5 text-indigo-500" />
                        <span className="hidden xl:inline">Regenerate</span>
                      </Button>

                      {asset.device_status === 'Active' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetire(asset.id)}
                          title="Retire asset (preserves 90-day retention logs)"
                        >
                          <Archive className="h-3.5 w-3.5 text-amber-500" />
                          <span className="hidden xl:inline">Retire</span>
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePurge(asset.id)}
                          title="Purge asset and wipe cryptographic records"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                          <span className="hidden xl:inline">Purge</span>
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <RegisterDeviceModal
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegisterSubmit}
      />

      {newTokenModalData && (
        <PermanentTokenModal
          open={!!newTokenModalData}
          onClose={() => setNewTokenModalData(null)}
          token={newTokenModalData.token}
          deviceName={newTokenModalData.deviceName}
        />
      )}
    </div>
  );
};
