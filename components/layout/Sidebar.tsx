'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  UserCheck,
  Building2,
  CalendarClock,
  MapPin,
  Kanban,
  CheckCircle,
  Contact2,
  ShieldAlert,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building,
  Lock,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { cn } from '@/lib/utils';

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { leads, followUps, siteVisits, bookings, currentUser } = useLmsStore();

  const isExecutive = currentUser.role === 'Sales Executive';
  const isManager = currentUser.role === 'Sales Manager';

  // Dynamic counts for sidebar badges tailored to role
  const pendingFollowupsCount = followUps.filter(
    (f) =>
      (f.status === 'Pending' || f.status === 'Overdue') &&
      (!isExecutive || f.agentId === currentUser.id)
  ).length;

  const scheduledVisitsCount = siteVisits.filter(
    (v) => v.status === 'Scheduled' && (!isExecutive || v.agentId === currentUser.id)
  ).length;

  const unassignedCount = leads.filter((l) => !l.assignedAgentId).length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const myAssignedCount = leads.filter((l) => l.assignedAgentId === currentUser.id).length;

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: isExecutive ? 'My Assigned Leads' : 'Leads Management',
      href: '/leads',
      icon: Users2,
      badge: isExecutive ? `${myAssignedCount}` : newLeadsCount > 0 ? `${newLeadsCount} New` : undefined,
      badgeColor: isExecutive ? 'bg-blue-600' : 'bg-blue-500',
    },
    {
      name: 'Lead Assignment',
      href: '/assignments',
      icon: UserCheck,
      badge: isManager && unassignedCount > 0 ? `${unassignedCount} Allocate` : undefined,
      badgeColor: 'bg-amber-500',
    },
    { name: 'Properties', href: '/properties', icon: Building2 },
    {
      name: 'Follow-ups',
      href: '/follow-ups',
      icon: CalendarClock,
      badge: pendingFollowupsCount > 0 ? `${pendingFollowupsCount}` : undefined,
      badgeColor: 'bg-amber-500',
    },
    {
      name: 'Site Visits',
      href: '/site-visits',
      icon: MapPin,
      badge: scheduledVisitsCount > 0 ? `${scheduledVisitsCount}` : undefined,
      badgeColor: 'bg-purple-500',
    },
    { name: 'Sales Pipeline', href: '/pipeline', icon: Kanban },
    { name: 'Bookings', href: '/bookings', icon: CheckCircle, badge: bookings.length > 0 ? `${bookings.length}` : undefined },
    { name: 'Customers', href: '/customers', icon: Contact2 },
    { name: 'Sales Team', href: '/team', icon: ShieldAlert },
    { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      restrictedRole: isExecutive ? 'Admin Only' : undefined,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-950 text-slate-200 transition-all duration-300 border-r border-slate-800/80 shadow-xl select-none',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-950/60">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
              <Building className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                  ESTATIFY <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-blue-500/20 text-blue-400 border border-blue-500/30">LMS</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate">Real Estate CRM Platform</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>{!collapsed ? 'Navigation' : 'Menu'}</span>
            {!collapsed && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-blue-400 font-bold">
                {currentUser.role}
              </span>
            )}
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-300 hover:bg-slate-850 hover:text-white hover:bg-slate-800/60'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  )}
                />
                {!collapsed && (
                  <span className="truncate flex-1 font-medium">{item.name}</span>
                )}
                {!collapsed && item.restrictedRole && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold border border-slate-700">
                    {item.restrictedRole}
                  </span>
                )}
                {!collapsed && item.badge && !item.restrictedRole && (
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white tracking-wide shrink-0',
                      item.badgeColor || 'bg-slate-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {/* Collapsed dot badge indicator */}
                {collapsed && item.badge && (
                  <span className={cn('absolute top-2 right-2 w-2 h-2 rounded-full', item.badgeColor || 'bg-blue-500')} />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Role Card at Bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
          <div className={cn('flex items-center gap-3 rounded-xl p-2 bg-slate-800/50 border border-slate-700/50', collapsed && 'justify-center p-1.5')}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30 shrink-0"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-blue-400 font-medium truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {currentUser.role}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
