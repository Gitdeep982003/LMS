import React from 'react';
import { cn } from '@/lib/utils';
import { LeadStatus, PropertyStatus, LeadPriority } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary';
  status?: LeadStatus | PropertyStatus | LeadPriority | string;
}

export function StatusBadge({ status, className }: { status: LeadStatus | string; className?: string }) {
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'New':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
    case 'Assigned':
      colorClasses = 'bg-indigo-50 text-indigo-700 border-indigo-200';
      break;
    case 'Contacted':
      colorClasses = 'bg-cyan-50 text-cyan-700 border-cyan-200';
      break;
    case 'Interested':
      colorClasses = 'bg-teal-50 text-teal-700 border-teal-200';
      break;
    case 'Follow-up':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Site Visit Scheduled':
      colorClasses = 'bg-purple-50 text-purple-700 border-purple-200';
      break;
    case 'Site Visited':
      colorClasses = 'bg-violet-50 text-violet-700 border-violet-200';
      break;
    case 'Negotiation':
      colorClasses = 'bg-orange-50 text-orange-700 border-orange-200';
      break;
    case 'Booked':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      break;
    case 'Converted':
      colorClasses = 'bg-green-100 text-green-800 border-green-300 font-semibold';
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
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'Available':
      colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;
    case 'Booked':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Sold':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Under Offer':
      colorClasses = 'bg-blue-50 text-blue-700 border-blue-200';
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
  let colorClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (priority) {
    case 'High':
      colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
      break;
    case 'Medium':
      colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
      break;
    case 'Low':
      colorClasses = 'bg-slate-50 text-slate-600 border-slate-200';
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

export function Badge({ children, className, variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'outline' | 'secondary' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'default' && 'bg-blue-50 text-blue-700 border border-blue-200',
        variant === 'secondary' && 'bg-slate-100 text-slate-700 border border-slate-200',
        variant === 'outline' && 'border border-slate-300 text-slate-700',
        className
      )}
    >
      {children}
    </span>
  );
}
