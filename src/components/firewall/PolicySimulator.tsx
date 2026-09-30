import React, { useState } from 'react';
import { Card, CardHead, CardTitle, CardBody } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Play, ShieldAlert, CheckCircle2, Terminal } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PolicySimulator: React.FC = () => {
  const { simulateFirewallDecision } = useApp();

  const [testApp, setTestApp] = useState('Google Chrome');
  const [testDomain, setTestDomain] = useState('chatgpt.com');
  const [testPort, setTestPort] = useState(443);
  const [testProto, setTestProto] = useState('TCP');

  const [result, setResult] = useState<any>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = simulateFirewallDecision(testApp, testDomain, testPort, testProto);
    setResult(res);
  };

  const samplePresets = [
    { label: 'ChatGPT TLS', app: 'Google Chrome', domain: 'chatgpt.com', port: 443, proto: 'TCP' },
    { label: 'GitHub API', app: 'Code.exe', domain: 'api.github.com', port: 443, proto: 'TCP' },
    { label: 'Insecure FTP', app: 'FileZilla.exe', domain: 'ftp.legacy.corp', port: 21, proto: 'TCP' },
    { label: 'BitTorrent P2P', app: 'utorrent.exe', domain: 'tracker.openbittorrent.com', port: 6881, proto: 'UDP' }
  ];

  return (
    <Card>
      <CardHead>
        <CardTitle>
          <Terminal className="h-4 w-4 text-indigo-500" />
          <span>Zero-Trust Policy Simulator Sandbox</span>
        </CardTitle>
        <span className="text-xs text-slate-500 font-mono">
          Dry-run firewall rules against synthetic packet headers
        </span>
      </CardHead>

      <CardBody className="space-y-6">
        {/* Sample preset buttons */}
        <div>
          <span className="text-xs font-medium text-slate-500 mb-2 block">
            Quick Simulation Presets:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {samplePresets.map((sp) => (
              <button
                key={sp.label}
                type="button"
                onClick={() => {
                  setTestApp(sp.app);
                  setTestDomain(sp.domain);
                  setTestPort(sp.port);
                  setTestProto(sp.proto);
                }}
                className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSimulate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Process / Executable
            </label>
            <input
              type="text"
              required
              value={testApp}
              onChange={(e) => setTestApp(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Domain or IP
            </label>
            <input
              type="text"
              required
              value={testDomain}
              onChange={(e) => setTestDomain(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Destination Port
            </label>
            <input
              type="number"
              required
              value={testPort}
              onChange={(e) => setTestPort(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Protocol
              </label>
              <select
                value={testProto}
                onChange={(e) => setTestProto(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono cursor-pointer"
              >
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
              </select>
            </div>

            <Button type="submit" variant="primary" size="md" className="cursor-pointer shrink-0">
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simulate</span>
            </Button>
          </div>
        </form>

        {/* Output Console */}
        {result && (
          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 font-mono space-y-3 animate-in fade-in duration-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">Policy Evaluation Engine Result:</span>
              <Badge
                tone={
                  result.decision === 'BLOCK'
                    ? 'danger'
                    : result.decision === 'QUARANTINE'
                    ? 'warn'
                    : 'ok'
                }
                size="md"
              >
                {result.decision}
              </Badge>
            </div>

            <div className="text-xs space-y-1">
              <p>
                <span className="text-slate-500">Verdict:</span>{' '}
                <span className="font-bold text-white">{result.decision}</span>
              </p>
              <p>
                <span className="text-slate-500">Matched Layer:</span>{' '}
                <span className="text-indigo-400">{result.layer}</span>
              </p>
              {result.matchedRule && (
                <p>
                  <span className="text-slate-500">Trigger Rule:</span>{' '}
                  <span className="text-amber-400 font-semibold">{result.matchedRule.name} (ID: {result.matchedRule.id})</span>
                </p>
              )}
              <p>
                <span className="text-slate-500">Kernel Teardown:</span>{' '}
                <span className={result.teardown ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                  {result.teardown ? 'YES (OS TCP socket reset transmitted)' : 'NO'}
                </span>
              </p>
              <p className="pt-2 text-slate-300 font-sans text-xs">
                {result.reason}
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};
