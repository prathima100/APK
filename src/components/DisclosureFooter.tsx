import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const DisclosureFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xs py-3 px-6 text-center text-xs text-slate-400 dark:text-slate-500">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Arohak MDM · Admin access is audited · India (IT Act) + US (NIST 800-53) disclosure compliant</span>
        </div>
        <div className="text-[11px] font-mono flex items-center gap-2">
          <span>Cadence & telemetry only</span>
          <span>·</span>
          <span>Zero keystroke logging</span>
          <span>·</span>
          <span>90-day retention purge</span>
        </div>
      </div>
    </footer>
  );
};
