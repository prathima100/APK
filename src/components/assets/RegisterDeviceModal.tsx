import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { AssetRecord } from '../../types';

export interface RegisterDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (data: {
    device_name: string;
    serial_number: string;
    model: string;
    type: 'Laptop' | 'Desktop' | 'Workstation';
    assigned_owner: string;
    owner_email: string;
    owner_phone: string;
  }) => void;
}

export const RegisterDeviceModal: React.FC<RegisterDeviceModalProps> = ({
  open,
  onClose,
  onRegister
}) => {
  const [deviceName, setDeviceName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [type, setType] = useState<'Laptop' | 'Desktop' | 'Workstation'>('Laptop');
  const [assignedOwner, setAssignedOwner] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+1 (555) ');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName || !serialNumber || !assignedOwner || !ownerEmail) return;

    onRegister({
      device_name: deviceName,
      serial_number: serialNumber,
      model: model || 'Enterprise Workstation',
      type,
      assigned_owner: assignedOwner,
      owner_email: ownerEmail,
      owner_phone: ownerPhone
    });

    // Reset
    setDeviceName('');
    setModel('');
    setSerialNumber('');
    setAssignedOwner('');
    setOwnerEmail('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Register New Hardware Endpoint"
      description="Assign hardware to an employee and provision a permanent enrollment token."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
            Device Hostname / Label *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Eng-MacBook-M3"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Hardware Model
            </label>
            <input
              type="text"
              placeholder="e.g. MacBook Pro 16"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Hardware Serial Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. C02G90LKMD6T"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
            Chassis Form Factor
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
          >
            <option value="Laptop">Laptop (Portable Endpoint)</option>
            <option value="Desktop">Desktop</option>
            <option value="Workstation">Dedicated Rack / Tower Workstation</option>
          </select>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
            Assigned Employee Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Margaret Hamilton"
            value={assignedOwner}
            onChange={(e) => setAssignedOwner(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Employee Email *
            </label>
            <input
              type="email"
              required
              placeholder="margaret@corp.com"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Employee Phone
            </label>
            <input
              type="text"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Generate Token & Register
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
