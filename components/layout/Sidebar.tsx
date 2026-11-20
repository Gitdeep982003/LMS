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
  ChevronsLeft,
  ChevronsRight,
  Building,
} from 'lucide-react';
import { useLmsStore } from '@/store/useLmsStore';
import { cn } from '@/lib/utils';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  collapsed?: boolean;
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>> | ((v: boolean) => void);
}

export function Sidebar({
  mobileOpen,
  setMobileOpen,
  collapsed: controlledCollapsed,
  setCollapsed: controlledSetCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setCollapsed = controlledSetCollapsed || setInternalCollapsed;
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
    },
    {
      name: 'Lead Assignment',
      href: '/assignments',
      icon: UserCheck,
      badge: isManager && unassignedCount > 0 ? `${unassignedCount} Allocate` : undefined,
    },
    { name: 'Properties', href: '/properties', icon: Building2 },
    {
      name: 'Follow-ups',
      href: '/follow-ups',
      icon: CalendarClock,
      badge: pendingFollowupsCount > 0 ? `${pendingFollowupsCount}` : undefined,
    },
    {
      name: 'Site Visits',
      href: '/site-visits',
      icon: MapPin,
      badge: scheduledVisitsCount > 0 ? `${scheduledVisitsCount}` : undefined,
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
          className="fixed inset-0 z-40 bg-[#0C141F]/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#FAF8F5] text-stone-700 transition-all duration-300 border-r border-[#EAE4D9] shadow-xs select-none',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header & Toggle - Luxury Real Estate Emblem */}
        {collapsed ? (
          <div className="flex flex-col items-center justify-center py-3 px-2 border-b border-[#EAE4D9] bg-[#FAF8F5] shrink-0 gap-2">
            <Link href="/dashboard" className="shrink-0 group" title="Kalaivani Real Estate">
              <div className="w-10 h-10 rounded-full bg-[#0C141F] border border-[#C59B63]/60 flex items-center justify-center shadow-xs group-hover:border-[#C59B63] transition-colors">
                <Building className="w-4 h-4 text-[#C59B63]" />
              </div>
            </Link>
            <button
              onClick={() => setCollapsed(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-[#F2EDE4] transition-colors"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between h-16 px-4 border-b border-[#EAE4D9] bg-[#FAF8F5] shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden flex-1 group">
              <div className="w-10 h-10 rounded-full bg-[#0C141F] border border-[#C59B63]/60 flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#C59B63] transition-colors">
                <Building className="w-5 h-5 text-[#C59B63]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-poppins font-bold text-base tracking-wider text-[#0C141F] truncate">
                  KALAIVANI
                </span>
                <span className="text-[9px] text-[#C59B63] font-bold tracking-[0.2em] uppercase truncate">
                  Real Estate
                </span>
              </div>
            </Link>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-[#F2EDE4] transition-colors ml-2 shrink-0"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {!collapsed ? (
            <div className="px-3 pb-2 text-[10px] font-semibold text-[#8C7A63] uppercase tracking-widest">
              Navigation
            </div>
          ) : (
            <div className="w-8 h-px bg-[#EAE4D9] mx-auto my-2" />
          )}

          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={cn(
                  'group flex items-center rounded-xl text-xs sm:text-sm transition-all duration-150 relative',
                  collapsed
                    ? 'w-11 h-11 mx-auto justify-center p-0'
                    : 'gap-3 px-3 py-2.5 w-full',
                  isActive
                    ? 'bg-[#F2EDE4] text-[#8C6228] font-bold shadow-xs border-l-4 border-[#C59B63]'
                    : 'text-stone-700 hover:bg-[#F2EDE4]/70 hover:text-[#0C141F] font-medium'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-[#C59B63]' : 'text-stone-400 group-hover:text-[#C59B63]'
                  )}
                />

                {!collapsed && (
                  <span className="truncate flex-1 font-medium">{item.name}</span>
                )}

                {!collapsed && item.restrictedRole && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF5EC] text-[#8C6228] font-medium border border-[#E5D0A6]">
                    {item.restrictedRole}
                  </span>
                )}

                {!collapsed && item.badge && !item.restrictedRole && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide shrink-0',
                      isActive
                        ? 'bg-[#0C141F] text-[#C59B63] border border-[#C59B63]/30'
                        : 'bg-[#FAF5EC] text-[#8C6228] border border-[#E5D0A6]'
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed dot badge indicator */}
                {collapsed && item.badge && (
                  <span
                    className={cn(
                      'absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-[#FAF8F5]',
                      isActive ? 'bg-[#0C141F]' : 'bg-[#C59B63]'
                    )}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Role Card at Bottom */}
        <div className="p-3 border-t border-[#EAE4D9] bg-[#FAF8F5] shrink-0">
          {collapsed ? (
            <div
              className="flex items-center justify-center py-0.5 cursor-pointer group/profile"
              title={`${currentUser.name} (${currentUser.role})`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E5D0A6] group-hover/profile:ring-[#C59B63] transition-all shadow-xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#C59B63] ring-2 ring-[#FAF8F5]" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl p-2.5 bg-[#F2EDE4]/70 border border-[#E5D0A6]/70 hover:bg-[#F2EDE4] transition-all">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E5D0A6]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#C59B63] ring-2 ring-[#FAF8F5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0C141F] truncate">{currentUser.name}</p>
                <p className="text-[11px] text-[#8C6228] font-medium truncate flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C59B63]" />
                  {currentUser.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
