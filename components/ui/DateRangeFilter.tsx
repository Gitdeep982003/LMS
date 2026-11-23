'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DatePreset = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'last_month' | 'custom';

export interface DateRangeValue {
  preset: DatePreset;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

interface DateRangeFilterProps {
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  matchingCount?: number;
  matchingLabel?: string;
  className?: string;
  align?: 'left' | 'right';
}

const PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'all', label: 'All Time' },
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
];

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateRangeFromPreset(preset: DatePreset): { startDate?: string; endDate?: string } {
  const now = new Date();
  const todayStr = toLocalDateString(now);

  switch (preset) {
    case 'today':
      return { startDate: todayStr, endDate: todayStr };
    case 'yesterday': {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      const yStr = toLocalDateString(y);
      return { startDate: yStr, endDate: yStr };
    }
    case 'week': {
      const d = new Date(now);
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diffToMonday));
      const mondayStr = toLocalDateString(monday);
      return { startDate: mondayStr, endDate: todayStr };
    }
    case 'month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const firstDayStr = toLocalDateString(firstDay);
      return { startDate: firstDayStr, endDate: todayStr };
    }
    case 'last_month': {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        startDate: toLocalDateString(firstDay),
        endDate: toLocalDateString(lastDay),
      };
    }
    case 'all':
    default:
      return { startDate: undefined, endDate: undefined };
  }
}

export function DateRangeFilter({
  value,
  onChange,
  matchingCount,
  matchingLabel = 'records',
  className,
  align = 'right',
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [localPreset, setLocalPreset] = useState<DatePreset>(value.preset);
  const [fromDate, setFromDate] = useState<string>(value.startDate || '');
  const [toDate, setToDate] = useState<string>(value.endDate || '');

  // Sync internal state when external value changes
  useEffect(() => {
    setLocalPreset(value.preset);
    setFromDate(value.startDate || '');
    setToDate(value.endDate || '');
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectPreset = (preset: DatePreset) => {
    setLocalPreset(preset);
    if (preset === 'all') {
      setFromDate('');
      setToDate('');
      onChange({ preset: 'all', startDate: undefined, endDate: undefined });
    } else {
      const range = getDateRangeFromPreset(preset);
      setFromDate(range.startDate || '');
      setToDate(range.endDate || '');
      onChange({ preset, startDate: range.startDate, endDate: range.endDate });
    }
  };

  const handleCustomDateChange = (from: string, to: string) => {
    setLocalPreset('custom');
    setFromDate(from);
    setToDate(to);
    onChange({ preset: 'custom', startDate: from || undefined, endDate: to || undefined });
  };

  const currentLabel =
    PRESETS.find((p) => p.id === localPreset)?.label ||
    (localPreset === 'custom' && fromDate && toDate
      ? `${fromDate} - ${toDate}`
      : localPreset === 'custom'
      ? 'Custom Range'
      : 'Date Filter');

  return (
    <div className={cn('relative inline-block text-left', className)} ref={containerRef}>
      {/* Trigger Button (Matched to Kalaivani Luxury Project Theme) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-9 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer select-none whitespace-nowrap',
          isOpen || localPreset !== 'all'
            ? 'bg-[#FAF5EC] border-[#C59B63] text-[#0C141F] ring-1 ring-[#C59B63]/30'
            : 'bg-white border-[#EAE4D9] text-[#0C141F] hover:bg-[#FAF8F5] hover:border-[#C59B63]/60'
        )}
      >
        <Calendar className="w-3.5 h-3.5 text-[#C59B63]" />
        <span>{currentLabel}</span>
        <ChevronDown
          className={cn('w-3.5 h-3.5 text-stone-500 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          className={cn(
            'absolute mt-2 w-[340px] sm:w-[380px] bg-white rounded-2xl border border-[#EAE4D9] shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-2 pb-3.5 border-b border-[#EAE4D9]">
            <Calendar className="w-4 h-4 text-[#C59B63]" />
            <h4 className="font-poppins font-bold text-sm text-[#0C141F] tracking-tight">
              Date Range Filter
            </h4>
          </div>

          {/* Quick Presets */}
          <div className="pt-3.5">
            <span className="text-[10px] font-bold text-[#8C7A63] uppercase tracking-wider block mb-2.5">
              QUICK PRESETS:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((preset) => {
                const isSelected = localPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={cn(
                      'py-2 px-2.5 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer select-none',
                      isSelected
                        ? 'bg-[#0C141F] text-[#C59B63] border-[#C59B63]/40 shadow-xs'
                        : 'bg-[#FAF8F5] text-stone-700 border-[#EAE4D9] hover:bg-[#FAF5EC] hover:border-[#C59B63]/50'
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="pt-4">
            <span className="text-[10px] font-bold text-[#8C7A63] uppercase tracking-wider block mb-2.5">
              CUSTOM DATE RANGE:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => handleCustomDateChange(e.target.value, toDate)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white text-[#0C141F] font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => handleCustomDateChange(fromDate, e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#EAE4D9] focus:border-[#C59B63] focus:ring-1 focus:ring-[#C59B63] outline-none bg-white text-[#0C141F] font-medium"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#EAE4D9]">
            <span className="text-xs text-stone-500 font-medium">
              {matchingCount !== undefined ? `${matchingCount} matching ${matchingLabel}` : 'Filter active'}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 rounded-xl bg-[#0C141F] hover:bg-[#16202E] text-[#C59B63] hover:text-[#D4AF77] border border-[#C59B63]/40 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
