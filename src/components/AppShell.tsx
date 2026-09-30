import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DisclosureFooter } from './DisclosureFooter';
import { CommandPalette } from './CommandPalette';
import { AndroidMdmSimulator } from './android-mdm/AndroidMdmSimulator';
import { useApp } from '../context/AppContext';
import { LoginPage } from './auth/LoginPage';
import { CheckCircle2 } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, toastMessage } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex bg-[#f4f8fe] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Fixed Left Navigation Rail */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pl-[232px]">
        {/* Sticky Header Topbar */}
        <Topbar />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 p-6 md:p-8 max-w-[1280px] w-full mx-auto">
          {children}
        </main>

        {/* Global Compliance Footer */}
        <DisclosureFooter />
      </div>

      {/* Overlaid Command Palette (⌘K) */}
      <CommandPalette />

      {/* Android MDM Mobile Companion Simulator */}
      <AndroidMdmSimulator />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xl border border-slate-800 dark:border-slate-200 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
