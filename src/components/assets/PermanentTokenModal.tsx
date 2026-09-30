import React, { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Copy, Check, AlertTriangle, Terminal } from 'lucide-react';

export interface PermanentTokenModalProps {
  open: boolean;
  onClose: () => void;
  token: string;
  deviceName: string;
}

export const PermanentTokenModal: React.FC<PermanentTokenModalProps> = ({
  open,
  onClose,
  token,
  deviceName
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const command = `uv run arohak-agent enroll --token ${token}`;

  const copyToClipboard = (text: string, isCmd = false) => {
    navigator.clipboard.writeText(text);
    if (isCmd) {
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Permanent Device Enrollment Token"
      description={`Device "${deviceName}" has been added to the asset register.`}
    >
      <div className="space-y-4 text-xs">
        {/* Warning Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Copy this token now</p>
            <p className="opacity-90 mt-0.5 font-mono">
              For security, permanent cryptographic tokens are hashed at rest and will not be displayed in full plaintext again.
            </p>
          </div>
        </div>

        {/* Token Box */}
        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
            Cryptographic Token (X-Device-Token)
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 break-all select-all">
            <span className="flex-1 font-semibold">{token}</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(token, false)}
            >
              {copiedToken ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedToken ? 'Copied' : 'Copy'}</span>
            </Button>
          </div>
        </div>

        {/* Enrollment Terminal Command */}
        <div>
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-slate-400" />
            <span>Agent Enrollment CLI Snippet</span>
          </label>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 font-mono text-xs">
            <span className="flex-1 truncate">{command}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(command, true)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              {copiedCommand ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
              <span>{copiedCommand ? 'Copied' : 'Copy Command'}</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done & Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
