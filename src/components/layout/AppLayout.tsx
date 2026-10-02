import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine dynamic title from location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/app') return 'Dashboard';
    if (path.startsWith('/app/profile')) return 'User Profile';
    if (path.startsWith('/app/admin')) return 'Administration';
    if (path.startsWith('/app/faculty')) return 'Faculty Portal';
    if (path.startsWith('/app/student')) return 'Student Portal';
    if (path.startsWith('/app/warden')) return 'Warden Portal';
    if (path.startsWith('/app/technician')) return 'Technician Portal';
    return 'KKDGMS CORE';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuToggle={() => setIsSidebarOpen(true)} title={getPageTitle()} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
