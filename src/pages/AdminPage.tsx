import React from 'react';
import { useApp } from '../context/AppContext';
import { DeviceTokens } from '../components/admin/DeviceTokens';
import { AuditLog } from '../components/admin/AuditLog';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ShieldCheck, AlertCircle, ShieldAlert } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { currentUser, setRole } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Admin & Governance
            </h1>
            <Badge tone={currentUser.role === 'admin' ? 'primary' : 'warn'} size="sm">
              Current Session: {currentUser.role.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Permanent token lifecycle, immutable administrator audit log, and role permissions governance.
          </p>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Test Role:</span>
          <Button
            variant={currentUser.role === 'admin' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setRole('admin')}
          >
            Admin (Read / Write)
          </Button>
          <Button
            variant={currentUser.role === 'viewer' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setRole('viewer')}
          >
            Viewer (Read-Only)
          </Button>
        </div>
      </div>

      {/* Read-Only Warning Banner if viewer */}
      {currentUser.role === 'viewer' && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            You are viewing the console in <strong>Viewer mode</strong>. Mutating operations (token generation, policy creation, device retirement) are disabled.
          </span>
        </div>
      )}

      {/* Section 2: Device Tokens Card */}
      <DeviceTokens />

      {/* Section 3: Audit Log Card */}
      <AuditLog />
    </div>
  );
};
