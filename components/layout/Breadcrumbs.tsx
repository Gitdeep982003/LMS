'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

const pathNameMap: Record<string, string> = {
  dashboard: 'Dashboard',
  leads: 'Leads Management',
  assignments: 'Lead Assignment',
  properties: 'Properties',
  'follow-ups': 'Follow-ups',
  'site-visits': 'Site Visits',
  pipeline: 'Sales Pipeline',
  bookings: 'Bookings',
  customers: 'Customers',
  team: 'Sales Team',
  reports: 'Reports & Analytics',
  settings: 'Settings',
  login: 'Authentication',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
    return null;
  }

  return (
    <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-4 px-1" aria-label="Breadcrumb">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-[#C59B63] transition-colors">
        <Home className="w-3.5 h-3.5 text-[#C59B63]" />
        <span>Home</span>
      </Link>
      {segments.map((seg, idx) => {
        const href = `/${segments.slice(0, idx + 1).join('/')}`;
        const isLast = idx === segments.length - 1;
        const name = pathNameMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-3 h-3 text-[#E5D0A6]" />
            {isLast ? (
              <span className="font-semibold text-[#0C141F]">{name}</span>
            ) : (
              <Link href={href} className="hover:text-[#C59B63] transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
