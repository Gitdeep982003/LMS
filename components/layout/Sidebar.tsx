'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  UserCheck,
  CalendarClock,
  MapPin,
  Kanban,
  CheckCircle,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Layers,
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

  // Dynamic counts for sidebar badges tailored to role (pure counts without long keywords)
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

  // Dropdown state for Activities & Bookings (Follow-ups, Site Visits, Bookings)
  const isActivitiesActive =
    pathname.startsWith('/follow-ups') ||
    pathname.startsWith('/site-visits') ||
    pathname.startsWith('/bookings');

  const [activitiesOpen, setActivitiesOpen] = useState(isActivitiesActive);

  useEffect(() => {
    if (isActivitiesActive) {
      setActivitiesOpen(true);
    }
  }, [isActivitiesActive]);

  const activitySubItems = [
    {
      name: 'Follow-ups',
      href: '/follow-ups',
      icon: CalendarClock,
      badge: pendingFollowupsCount > 0 ? String(pendingFollowupsCount) : undefined,
    },
    {
      name: 'Site Visits',
      href: '/site-visits',
      icon: MapPin,
      badge: scheduledVisitsCount > 0 ? String(scheduledVisitsCount) : undefined,
    },
    {
      name: 'Bookings',
      href: '/bookings',
      icon: CheckCircle,
      badge: bookings.length > 0 ? String(bookings.length) : undefined,
    },
  ];

  const totalActivitiesCount =
    (pendingFollowupsCount > 0 ? pendingFollowupsCount : 0) +
    (scheduledVisitsCount > 0 ? scheduledVisitsCount : 0) +
    (bookings.length > 0 ? bookings.length : 0);

  // Clean navigation items with concise count badges (no "New" or "Allocate" words)
  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    {
      name: 'Lead Management',
      href: '/pipeline',
      icon: Kanban,
    },
    {
      name: 'Lead Assignment',
      href: '/assignments',
      icon: UserCheck,
      badge: isManager && unassignedCount > 0 ? String(unassignedCount) : undefined,
    },
    {
      name: 'All Customers',
      href: '/leads',
      icon: Users2,
      badge: isExecutive
        ? (myAssignedCount > 0 ? String(myAssignedCount) : undefined)
        : (newLeadsCount > 0 ? String(newLeadsCount) : undefined),
    },
  ];

  const bottomNavigation = [
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
        {/* Brand Header */}
        {collapsed ? (
          <div className="flex items-center justify-center h-16 px-2 border-b border-[#EAE4D9] bg-[#FAF8F5] shrink-0">
            <Link href="/dashboard" className="shrink-0 group flex items-center justify-center" title="Kalaivani Real Estate">
              <img
                src="/kalaivani-emblem.png"
                alt="Kalaivani Real Estate"
                className="w-11 h-11 rounded-full object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              />
            </Link>
          </div>
        ) : (
          <div className="flex items-center h-16 px-4 border-b border-[#EAE4D9] bg-[#FAF8F5] shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3 w-full h-full group" title="Kalaivani Real Estate">
              <img
                src="/kalaivani-emblem.png"
                alt="Kalaivani Emblem"
                className="w-11 h-11 rounded-full object-contain shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col min-w-0 justify-center">
                <span className="font-poppins font-extrabold text-[17px] tracking-[0.06em] text-[#0C141F] leading-tight">
                  KALAIVANI
                </span>
                <span className="font-poppins font-bold text-[9.5px] text-[#C59B63] tracking-[0.24em] uppercase leading-tight mt-0.5">
                  REAL ESTATE
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#FAF8F5]">
          {!collapsed ? (
            <div className="px-3 pb-2 text-[10px] font-semibold text-[#8C7A63] uppercase tracking-widest">
              Navigation
            </div>
          ) : (
            <div className="w-8 h-px bg-[#EAE4D9] mx-auto my-2" />
          )}

          {/* Top navigation items (Dashboard, Leads, Lead Assignment) */}
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={cn(
                  'group flex items-center rounded-xl transition-all duration-150 relative',
                  collapsed
                    ? 'w-11 h-11 mx-auto justify-center p-0'
                    : 'gap-3 px-3 py-2.5 w-full text-xs sm:text-sm',
                  collapsed
                    ? isActive
                      ? 'bg-[#0C141F] text-[#C59B63] shadow-md shadow-[#0C141F]/15 border border-[#C59B63]/40'
                      : 'text-[#0C141F] hover:text-[#C59B63] hover:bg-[#F2EDE4]'
                    : isActive
                      ? 'bg-[#F2EDE4] text-[#8C6228] font-bold shadow-xs border-l-4 border-[#C59B63]'
                      : 'text-stone-700 hover:bg-[#F2EDE4]/70 hover:text-[#0C141F] font-medium'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    collapsed
                      ? isActive
                        ? 'text-[#C59B63]'
                        : 'text-[#0C141F] group-hover:text-[#C59B63]'
                      : isActive
                        ? 'text-[#C59B63]'
                        : 'text-stone-500 group-hover:text-[#C59B63]'
                  )}
                />

                {!collapsed && (
                  <span className="truncate flex-1 font-medium">{item.name}</span>
                )}

                {!collapsed && item.badge && (
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
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C59B63] ring-2 ring-[#FAF8F5]" />
                )}
              </Link>
            );
          })}

          {/* Activities & Bookings Dropdown Group (Site Visits, Follow-ups, Bookings) */}
          {collapsed ? (
            <Link
              href="/follow-ups"
              onClick={() => setMobileOpen?.(false)}
              className={cn(
                'group flex items-center rounded-xl transition-all duration-150 relative w-11 h-11 mx-auto justify-center p-0',
                isActivitiesActive
                  ? 'bg-[#0C141F] text-[#C59B63] shadow-md shadow-[#0C141F]/15 border border-[#C59B63]/40'
                  : 'text-[#0C141F] hover:text-[#C59B63] hover:bg-[#F2EDE4]'
              )}
              title="Activities & Bookings"
            >
              <Layers
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  isActivitiesActive ? 'text-[#C59B63]' : 'text-[#0C141F] group-hover:text-[#C59B63]'
                )}
              />
              {totalActivitiesCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C59B63] ring-2 ring-[#FAF8F5]" />
              )}
            </Link>
          ) : (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActivitiesOpen(!activitiesOpen)}
                className={cn(
                  'group flex items-center justify-between rounded-xl px-3 py-2.5 w-full text-xs sm:text-sm font-medium transition-all duration-150',
                  isActivitiesActive
                    ? 'bg-[#FAF5EC]/80 text-[#8C6228] font-semibold'
                    : 'text-stone-700 hover:bg-[#F2EDE4]/70 hover:text-[#0C141F]'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Layers
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActivitiesActive ? 'text-[#C59B63]' : 'text-stone-500 group-hover:text-[#C59B63]'
                    )}
                  />
                  <span className="truncate">Activities & Bookings</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {totalActivitiesCount > 0 && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF5EC] text-[#8C6228] border border-[#E5D0A6]">
                      {totalActivitiesCount}
                    </span>
                  )}
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-stone-400 transition-transform duration-200',
                      activitiesOpen && 'rotate-180 text-[#8C6228]'
                    )}
                  />
                </div>
              </button>

              {/* Sub-menu items (Follow-ups, Site Visits, Bookings) */}
              {activitiesOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150 border-l-2 border-[#EAE4D9] ml-5 my-1">
                  {activitySubItems.map((subItem) => {
                    const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href);
                    const SubIcon = subItem.icon;

                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => setMobileOpen?.(false)}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 group',
                          isSubActive
                            ? 'bg-[#0C141F] text-[#C59B63] font-bold shadow-xs'
                            : 'text-stone-600 hover:bg-[#F2EDE4] hover:text-[#0C141F]'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <SubIcon
                            className={cn(
                              'w-4 h-4 shrink-0 transition-colors',
                              isSubActive ? 'text-[#C59B63]' : 'text-stone-400 group-hover:text-[#C59B63]'
                            )}
                          />
                          <span className="truncate">{subItem.name}</span>
                        </div>
                        {subItem.badge && (
                          <span
                            className={cn(
                              'text-[10px] font-semibold px-1.5 py-0.2 rounded-full shrink-0',
                              isSubActive
                                ? 'bg-black text-[#C59B63] border border-[#C59B63]/40'
                                : 'bg-[#FAF5EC] text-[#8C6228] border border-[#E5D0A6]'
                            )}
                          >
                            {subItem.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Bottom navigation items (Sales Pipeline, Reports, Settings) */}
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={cn(
                  'group flex items-center rounded-xl transition-all duration-150 relative',
                  collapsed
                    ? 'w-11 h-11 mx-auto justify-center p-0'
                    : 'gap-3 px-3 py-2.5 w-full text-xs sm:text-sm',
                  collapsed
                    ? isActive
                      ? 'bg-[#0C141F] text-[#C59B63] shadow-md shadow-[#0C141F]/15 border border-[#C59B63]/40'
                      : 'text-[#0C141F] hover:text-[#C59B63] hover:bg-[#F2EDE4]'
                    : isActive
                      ? 'bg-[#F2EDE4] text-[#8C6228] font-bold shadow-xs border-l-4 border-[#C59B63]'
                      : 'text-stone-700 hover:bg-[#F2EDE4]/70 hover:text-[#0C141F] font-medium'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    collapsed
                      ? isActive
                        ? 'text-[#C59B63]'
                        : 'text-[#0C141F] group-hover:text-[#C59B63]'
                      : isActive
                        ? 'text-[#C59B63]'
                        : 'text-stone-500 group-hover:text-[#C59B63]'
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
              </Link>
            );
          })}
        </div>

        {/* Sidebar Collapse/Expand Toggle at Bottom (Aligned to Right Edge when Opened) */}
        <div
          className={cn(
            'p-3 border-t border-[#EAE4D9] bg-[#FAF8F5] shrink-0 flex items-center',
            collapsed ? 'justify-center' : 'justify-end'
          )}
        >
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="w-11 h-11 rounded-xl bg-white hover:bg-[#F2EDE4] text-[#8C6228] hover:text-[#C59B63] border border-[#EAE4D9] shadow-2xs flex items-center justify-center transition-all active:scale-95 group"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <ChevronsRight className="w-5 h-5 text-[#8C6228] group-hover:text-[#C59B63] group-hover:translate-x-0.5 transition-all" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(true)}
              className="w-11 h-11 rounded-xl bg-white hover:bg-[#F2EDE4] text-[#8C6228] hover:text-[#C59B63] border border-[#EAE4D9] shadow-2xs flex items-center justify-center transition-all active:scale-95 group ml-auto"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronsLeft className="w-5 h-5 text-[#8C6228] group-hover:text-[#C59B63] group-hover:-translate-x-0.5 transition-all" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}