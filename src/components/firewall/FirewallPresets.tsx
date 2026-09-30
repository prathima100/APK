import React from 'react';
import { FirewallRule } from '../../types';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { ShieldCheck, Bot, Video, MessageCircle, DownloadCloud, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FirewallPresets: React.FC = () => {
  const { firewallRules, togglePresetGuardrail, currentUser, showToast } = useApp();

  const presets = [
    {
      category: 'ai' as const,
      name: 'Block Gen AI & LLMs',
      targets: 'chatgpt.com, claude.ai, perplexity.ai',
      icon: Bot,
      color: 'text-indigo-500'
    },
    {
      category: 'media' as const,
      name: 'Block Media Streaming',
      targets: 'youtube.com, netflix.com, twitch.tv',
      icon: Video,
      color: 'text-rose-500'
    },
    {
      category: 'social' as const,
      name: 'Block Social Media',
      targets: 'facebook.com, instagram.com, tiktok.com, x.com',
      icon: MessageCircle,
      color: 'text-blue-500'
    },
    {
      category: 'p2p' as const,
      name: 'Block P2P & Torrents',
      targets: 'utorrent.exe, bittorrent.exe, qbittorrent',
      icon: DownloadCloud,
      color: 'text-amber-500'
    },
    {
      category: 'ports' as const,
      name: 'Block Insecure Ports',
      targets: 'Port 21 (FTP), 23 (Telnet), 445 (SMB)',
      icon: Radio,
      color: 'text-purple-500'
    }
  ];

  const handleToggle = (cat: FirewallRule['category']) => {
    if (currentUser.role === 'viewer') {
      showToast('Viewer role cannot modify firewall policies');
      return;
    }
    togglePresetGuardrail(cat);
  };

  return (
    <Card>
      <CardHead>
        <CardTitle>
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Enterprise Preset Guardrails (One-Click Policy Toggles)</span>
        </CardTitle>
        <span className="text-xs text-slate-500 font-mono">
          Propagates instantly to kernel socket filter
        </span>
      </CardHead>

      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {presets.map((p) => {
            const rule = firewallRules.find(r => r.category === p.category);
            const isEnabled = rule?.enabled ?? false;
            const Icon = p.icon;

            return (
              <div
                key={p.category}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                  isEnabled
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className={`h-4 w-4 ${p.color}`} />
                    <button
                      type="button"
                      onClick={() => handleToggle(p.category)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        isEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                      aria-label={`Toggle ${p.name}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="font-semibold text-xs text-slate-900 dark:text-slate-100 mt-2">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 line-clamp-2" title={p.targets}>
                    {p.targets}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                  <span className={isEnabled ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-400'}>
                    {isEnabled ? 'Active Enforcing' : 'Disabled'}
                  </span>
                  {rule && (
                    <span className="text-slate-500">
                      {rule.blocks_today} drops today
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
};
