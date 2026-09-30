import React, { useState } from 'react';
import { FirewallRule } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Search, Trash2, Shield, Globe, Terminal, Network } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface PoliciesTableProps {
  rules: FirewallRule[];
}

export const PoliciesTable: React.FC<PoliciesTableProps> = ({ rules }) => {
  const { toggleFirewallRule, deleteFirewallRule, currentUser, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'WEB' | 'APPLICATION' | 'NETWORK'>('ALL');

  const filteredRules = rules.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.targets.some(t => t.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (typeFilter !== 'ALL' && r.layer !== typeFilter) return false;
    return true;
  });

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'WEB': return Globe;
      case 'APPLICATION': return Terminal;
      case 'NETWORK': return Network;
      default: return Shield;
    }
  };

  const handleToggle = (id: string) => {
    if (currentUser.role === 'viewer') {
      showToast('Viewer role cannot modify firewall policies');
      return;
    }
    toggleFirewallRule(id);
  };

  const handleDelete = (id: string) => {
    if (currentUser.role === 'viewer') {
      showToast('Viewer role cannot delete policies');
      return;
    }
    if (confirm('Are you sure you want to delete this firewall policy rule?')) {
      deleteFirewallRule(id);
    }
  };

  return (
    <Card>
      {/* Filter Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search policies by domain, process, or port..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        {/* Type pills */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs">
          {(['ALL', 'WEB', 'APPLICATION', 'NETWORK'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTypeFilter(type)}
              className={`px-2.5 py-1 font-medium rounded-md transition-all cursor-pointer ${
                typeFilter === type
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Rules Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-medium">Policy Name & Scope</th>
              <th className="py-3 px-4 font-medium">Layer</th>
              <th className="py-3 px-4 font-medium">Target Entities</th>
              <th className="py-3 px-4 font-medium">Action</th>
              <th className="py-3 px-4 font-medium">Priority</th>
              <th className="py-3 px-4 font-medium">Enforce</th>
              <th className="py-3 px-4 font-medium text-right">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredRules.map((rule) => {
              const LayerIcon = getLayerIcon(rule.layer);
              return (
                <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Name & Desc */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {rule.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate" title={rule.description}>
                      {rule.description}
                    </div>
                  </td>

                  {/* Layer */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      <LayerIcon className="h-3.5 w-3.5 text-slate-400" />
                      <span>{rule.layer}</span>
                    </div>
                  </td>

                  {/* Targets */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="flex items-center gap-1 flex-wrap">
                      {rule.targets.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                      {rule.targets.length > 3 && (
                        <span className="text-[10px] font-mono text-slate-400">
                          +{rule.targets.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge
                      tone={
                        rule.action === 'BLOCK'
                          ? 'danger'
                          : rule.action === 'QUARANTINE'
                          ? 'warn'
                          : 'ok'
                      }
                      size="sm"
                    >
                      {rule.action}
                    </Badge>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    p={rule.priority}
                  </td>

                  {/* Enforce Switch */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleToggle(rule.id)}
                      className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                        rule.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          rule.enabled ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      title="Delete rule"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
