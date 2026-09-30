import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { FirewallRule } from '../../types';

export interface AddPolicyModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (rule: Omit<FirewallRule, 'id' | 'blocks_today'>) => void;
}

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [layer, setLayer] = useState<FirewallRule['layer']>('WEB');
  const [targetsStr, setTargetsStr] = useState('');
  const [action, setAction] = useState<FirewallRule['action']>('BLOCK');
  const [priority, setPriority] = useState(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetsStr) return;

    const targets = targetsStr.split(',').map(t => t.trim()).filter(Boolean);

    onAdd({
      name,
      description: description || `Custom ${layer} zero-trust policy.`,
      layer,
      targets,
      action,
      priority,
      enabled: true,
      category: 'custom'
    });

    // Reset
    setName('');
    setDescription('');
    setTargetsStr('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Create Custom Zero-Trust Firewall Rule"
      description="Define network, application, or web boundary enforcement policies."
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
            Policy Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Block Unapproved Cloud Storage"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
            Policy Description
          </label>
          <input
            type="text"
            placeholder="Explain corporate compliance justification..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Enforcement Layer
            </label>
            <select
              value={layer}
              onChange={(e) => setLayer(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="WEB">WEB (Domain / SNI Matching)</option>
              <option value="APPLICATION">APPLICATION (Process Binary)</option>
              <option value="NETWORK">NETWORK (IP / CIDR / Port)</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Action Decision
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="BLOCK">BLOCK (Drop + Socket Teardown)</option>
              <option value="QUARANTINE">QUARANTINE (Throttle & Alert)</option>
              <option value="ALLOW">ALLOW (Explicit Whitelist)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 font-mono">
            Target Values (Comma Separated) *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. megasync.com, baidu.com, drop.io"
            value={targetsStr}
            onChange={(e) => setTargetsStr(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 font-mono">
            Evaluation Priority Weight (1 = highest precedence)
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Deploy Policy Rule
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
