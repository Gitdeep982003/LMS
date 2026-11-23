import React from 'react';
import { cn } from '@/lib/utils';
import { LeadStatus, PropertyStatus, LeadPriority } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary';
  status?: LeadStatus | PropertyStatus | LeadPriority | string;
}

export function StatusBadge({ status, className }: { status: LeadStatus | string; className?: string }) {
  let colorClasses = 'bg-[#FAF8F5] text-stone-700 border-[#EAE4D9]';

  switch (status) {
    case 'New':
    case 'Assigned':
      colorClasses = 'bg-[#FAF5EC] text-[#8C6228] border-[#E5D0A6]';
      break;
    case 'Contacted':
    case 'Follow-up':
      colorClasses = 'bg-sky-50 text-sky-800 border-sky-200';
      break;
    case 'Qualified':
    case 'Interested':
      colorClasses = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      break;
    case 'Site Visit':
    case 'Site Visit Scheduled':
    case 'Site Visited':
      colorClasses = 'bg-purple-50 text-purple-800 border-purple-200 font-medium';
      break;
    case 'Negotiation':
      colorClasses = 'bg-amber-50 text-amber-800 border-amber-300 font-medium';
      break;
    case 'Won':
    case 'Booked':
    case 'Converted':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold';
      break;
    case 'Lost':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        colorClasses,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

export function PropertyStatusBadge({ status, className }: { status: PropertyStatus | string; className?: string }) {
  let colorClasses = 'bg-[#FAF8F5] text-stone-700 border-[#EAE4D9]';

  switch (status) {
    case 'Available':
      colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      break;
    case 'Booked':
      colorClasses = 'bg-[#FAF5EC] text-[#8C6228] border-[#E5D0A6]';
      break;
    case 'Sold':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Under Offer':
      colorClasses = 'bg-[#F2EDE4] text-[#0C141F] border-[#EAE4D9]';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colorClasses,
        className
      )}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority, className }: { priority: LeadPriority | string; className?: string }) {
  let colorClasses = 'bg-[#FAF8F5] text-stone-700 border-[#EAE4D9]';

  switch (priority) {
    case 'High':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Medium':
      colorClasses = 'bg-[#FAF5EC] text-[#8C6228] border-[#E5D0A6]';
      break;
    case 'Low':
      colorClasses = 'bg-[#F2EDE4] text-stone-600 border-[#EAE4D9]';
      break;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase border',
        colorClasses,
        className
      )}
    >
      {priority}
    </span>
  );
}

export function Badge({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'outline' | 'secondary' | 'gold' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variant === 'default' && 'bg-[#FAF5EC] text-[#8C6228] border border-[#E5D0A6]',
        variant === 'secondary' && 'bg-[#F2EDE4] text-[#0C141F] border border-[#EAE4D9]',
        variant === 'gold' && 'bg-[#0C141F] text-[#C59B63] border border-[#C59B63]/40',
        variant === 'outline' && 'border border-[#C59B63] text-[#0C141F]',
        className
      )}
    >
      {children}
    </span>
  );
}
