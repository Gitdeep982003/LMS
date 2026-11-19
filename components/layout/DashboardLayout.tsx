'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Breadcrumbs } from './Breadcrumbs';
import { ToastProvider } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main Content Area */}
        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300 min-w-0',
            collapsed ? 'lg:pl-20' : 'lg:pl-64'
          )}
        >
          <Header onMenuClick={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto min-w-0">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
