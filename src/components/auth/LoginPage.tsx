import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/button';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('admin@arohak.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] bg-slate-950 text-slate-100">
      {/* Left Brand Panel (Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border-r border-slate-800/80 relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Wordmark Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="12" cy="11" r="3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">Arohak</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-sm">MDM</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Enterprise Device Management & Zero-Trust</p>
          </div>
        </div>

        {/* Center Brand Statement Block */}
        <div className="max-w-md my-auto z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>watching the fleet · 42 endpoints enrolled</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-serif text-white tracking-tight leading-tight">
            Every company laptop, one honest view.
          </h1>

          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Non-invasive cadence analysis, genuine engagement classification, and zero-trust kernel firewall. Never capturing keystrokes or private documents.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-xs font-mono text-slate-400">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-500 uppercase text-[10px]">Cadence Heuristics</p>
              <p className="text-slate-200 font-semibold mt-1">Entropy & Variance</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-slate-500 uppercase text-[10px]">Retention Policy</p>
              <p className="text-slate-200 font-semibold mt-1">90-Day Auto Purge</p>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono z-10">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Admin access is audited · India + US disclosure compliant</span>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Logo (<lg) */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">Arohak MDM</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Sign in</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use your company administrator credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="admin@corp.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
              <span>Enter Fleet Cockpit</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] font-mono text-slate-400 uppercase">One-click Demo Roles</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@arohak.com');
                  login('admin@arohak.com');
                }}
                className="p-2 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100/50 text-xs font-medium text-center transition-colors cursor-pointer"
              >
                Sign in as Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('auditor.viewer@arohak.com');
                  login('auditor.viewer@arohak.com');
                }}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-center transition-colors cursor-pointer"
              >
                Sign in as Viewer
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => login('sso_employee@corp.com')}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Sign in with Corporate Single Sign-On (Entra / Okta) →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
