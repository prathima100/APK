import React, { useState } from 'react';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Key, Plus, Copy, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatRelativeTime } from '../../lib/utils';

export const DeviceTokens: React.FC = () => {
  const { tokens, revokeToken, generateStandaloneToken, currentUser, showToast } = useApp();
  const [newLabel, setNewLabel] = useState('');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel) return;
    if (currentUser.role === 'viewer') {
      showToast('Viewer role cannot generate tokens');
      return;
    }
    const tok = generateStandaloneToken(newLabel);
    setGeneratedToken(tok);
    setNewLabel('');
  };

  const copyToken = (tok: string) => {
    navigator.clipboard.writeText(tok);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>
          <Key className="h-4 w-4 text-indigo-500" />
          <span>Device Tokens & Machine Cryptographic Binding</span>
        </CardTitle>
        <span className="text-xs text-slate-500 font-mono">
          Tokens lock to hardware UUID on first handshake
        </span>
      </CardHead>

      <CardBody className="space-y-6">
        {/* Manual Token Generator for Admin */}
        {currentUser.role === 'admin' && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
              Generate Quick Enrollment Token
            </span>
            <form onSubmit={handleGenerate} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Hardware Label (e.g. Lab-Server-Rack04)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <Button type="submit" variant="primary" size="sm">
                <Plus className="h-3.5 w-3.5" />
                <span>Issue Token</span>
              </Button>
            </form>

            {generatedToken && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 font-mono text-xs text-indigo-900 dark:text-indigo-200 animate-in fade-in duration-100">
                <span className="truncate mr-2 font-bold">{generatedToken}</span>
                <button
                  type="button"
                  onClick={() => copyToken(generatedToken)}
                  className="px-2 py-1 rounded bg-indigo-600 text-white text-[11px] font-sans flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tokens Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-medium">Device Label</th>
                <th className="py-3 px-4 font-medium">Token Prefix</th>
                <th className="py-3 px-4 font-medium">Binding Status</th>
                <th className="py-3 px-4 font-medium">Created</th>
                <th className="py-3 px-4 font-medium">Last Handshake</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {tokens.map((t) => (
                <tr key={t.deviceId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                    {t.label}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">
                    {t.token.substring(0, 16)}••••
                  </td>
                  <td className="py-3 px-4">
                    <Badge tone={t.status === 'Active' ? 'ok' : 'neutral'} size="sm">
                      {t.status === 'Active' ? 'Bound & Active' : t.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {formatRelativeTime(t.createdAt)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {formatRelativeTime(t.lastAuth)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {t.status === 'Active' && currentUser.role === 'admin' ? (
                      <button
                        type="button"
                        onClick={() => revokeToken(t.token)}
                        className="text-rose-500 hover:text-rose-600 font-medium text-xs cursor-pointer"
                      >
                        Revoke
                      </button>
                    ) : (
                      <span className="text-slate-400 font-mono text-[11px]">Read-only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};
