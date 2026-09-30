import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/AppShell';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceDetailPage } from './pages/DeviceDetailPage';
import { AssetsPage } from './pages/AssetsPage';
import { PeoplePage } from './pages/PeoplePage';
import { PersonDetailPage } from './pages/PersonDetailPage';
import { FirewallPage } from './pages/FirewallPage';
import { TransfersPage } from './pages/TransfersPage';
import { AdminPage } from './pages/AdminPage';

const AppRoutes: React.FC = () => {
  const { currentRoute } = useApp();

  if (currentRoute === '/devices' || currentRoute === '/') {
    return <DevicesPage />;
  }
  if (currentRoute.startsWith('/devices/')) {
    return <DeviceDetailPage />;
  }
  if (currentRoute === '/assets') {
    return <AssetsPage />;
  }
  if (currentRoute === '/transfers') {
    return <TransfersPage />;
  }
  if (currentRoute === '/people') {
    return <PeoplePage />;
  }
  if (currentRoute.startsWith('/people/')) {
    return <PersonDetailPage />;
  }
  if (currentRoute === '/firewall') {
    return <FirewallPage />;
  }
  if (currentRoute === '/admin') {
    return <AdminPage />;
  }

  return <DevicesPage />;
};

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </AppProvider>
  );
}
