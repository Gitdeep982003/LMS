'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Check, ChevronDown, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadStatus } from '@/types';

interface PipelineFieldFilterProps {
  selectedStage: string;
  onStageChange: (stage: string) => void;
  selectedPriority: string;
  onPriorityChange: (priority: string) => void;
  matchingCount?: number;
  className?: string;
}

const STAGE_OPTIONS: { value: string; label: string; dotColor: string }[] = [
  { value: 'ALL', label: 'All Stages', dotColor: 'bg-stone-400' },
  { value: 'New', label: 'New', dotColor: 'bg-[#C59B63]' },
  { value: 'Contacted', label: 'Contacted', dotColor: 'bg-sky-500' },
  { value: 'Qualified', label: 'Qualified', dotColor: 'bg-indigo-500' },
  { value: 'Site Visit', label: 'Site Visit', dotColor: 'bg-purple-500' },
  { value: 'Negotiation', label: 'Negotiation', dotColor: 'bg-amber-500' },
  { value: 'Won', label: 'Won', dotColor: 'bg-emerald-500' },
  { value: 'Lost', label: 'Lost', dotColor: 'bg-rose-500' },
];

const PRIORITY_OPTIONS: { value: string; label: string; dotColor: string }[] = [
  { value: 'ALL', label: 'All Priorities', dotColor: 'bg-stone-400' },
  { value: 'High', label: 'High Priority', dotColor: 'bg-rose-500' },
  { value: 'Medium', label: 'Medium Priority', dotColor: 'bg-amber-500' },
  { value: 'Low', label: 'Normal / Low Priority', dotColor: 'bg-stone-500' },
];

export function PipelineFieldFilter({
  selectedStage,
  onStageChange,
  selectedPriority,
  onPriorityChange,
  matchingCount,
  className,
}: PipelineFieldFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const hasActiveFilter = selectedStage !== 'ALL' || selectedPriority !== 'ALL';

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

  const handleReset = () => {
    onStageChange('ALL');
    onPriorityChange('ALL');
  };

  const getTriggerLabel = () => {
    if (selectedStage !== 'ALL' && selectedPriority !== 'ALL') {
      return `${selectedStage} • ${selectedPriority}`;
    }
    if (selectedStage !== 'ALL') {
      return `Stage: ${selectedStage}`;
    }
    if (selectedPriority !== 'ALL') {
      return `Priority: ${selectedPriority === 'Low' ? 'Normal' : selectedPriority}`;
    }
    return 'Field Filter';
  };

  return (
    <div className={cn('relative inline-block text-left', className)} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-9 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer select-none whitespace-nowrap',
          isOpen || hasActiveFilter
            ? 'bg-[#FAF5EC] border-[#C59B63] text-[#0C141F] ring-1 ring-[#C59B63]/30'
            : 'bg-white border-[#EAE4D9] text-[#0C141F] hover:bg-[#FAF8F5] hover:border-[#C59B63]/60'
        )}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-[#C59B63]" />
        <span>{getTriggerLabel()}</span>
        {hasActiveFilter && (
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B63]" />
        )}
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-stone-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Popover Card - Two Columns Layout */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-[420px] sm:w-[480px] bg-white rounded-2xl border border-[#EAE4D9] shadow-2xl p-4 sm:p-5 z-50 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#EAE4D9]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C59B63]" />
              <h4 className="font-poppins font-bold text-sm text-[#0C141F] tracking-tight">
                Field Filters
              </h4>
            </div>
            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-semibold text-[#8C6228] hover:text-[#0C141F] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* 2-Column Options Grid */}
          <div className="grid grid-cols-2 gap-3 pt-3.5 divide-x divide-[#EAE4D9]">
            {/* Column 1: Stage Filter */}
            <div className="pr-2">
              <span className="text-[10px] font-bold text-[#8C7A63] uppercase tracking-wider block mb-2">
                STAGE FILTER:
              </span>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {STAGE_OPTIONS.map((opt) => {
                  const isSelected = selectedStage === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onStageChange(opt.value)}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl transition-all cursor-pointer select-none text-left',
                        isSelected
                          ? 'bg-[#FAF5EC] text-[#0C141F] font-bold'
                          : 'text-stone-700 hover:bg-[#FAF8F5] hover:text-[#0C141F] font-medium'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            isSelected ? opt.dotColor : 'bg-stone-300'
                          )}
                        />
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#C59B63] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Priority Filter (Normal, Medium, High) */}
            <div className="pl-3">
              <span className="text-[10px] font-bold text-[#8C7A63] uppercase tracking-wider block mb-2">
                PRIORITY FILTER:
              </span>
              <div className="space-y-1">
                {PRIORITY_OPTIONS.map((opt) => {
                  const isSelected = selectedPriority === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onPriorityChange(opt.value)}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-xl transition-all cursor-pointer select-none text-left',
                        isSelected
                          ? 'bg-[#FAF5EC] text-[#0C141F] font-bold'
                          : 'text-stone-700 hover:bg-[#FAF8F5] hover:text-[#0C141F] font-medium'
                      )}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            isSelected ? opt.dotColor : 'bg-stone-300'
                          )}
                        />
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#C59B63] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#EAE4D9]">
            <span className="text-xs text-stone-500 font-medium">
              {matchingCount !== undefined ? `${matchingCount} matching deals` : 'Filters active'}
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
