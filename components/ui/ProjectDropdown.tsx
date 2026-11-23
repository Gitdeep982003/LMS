'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
  dotColor?: string;
}

interface ProjectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  align?: 'left' | 'right';
  disabled?: boolean;
}

export function ProjectDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  className,
  triggerClassName,
  align = 'left',
  disabled = false,
}: ProjectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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

  return (
    <div className={cn('relative inline-block w-full text-left', className)} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full h-9 px-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 transition-all shadow-xs cursor-pointer select-none outline-none',
          isOpen
            ? 'bg-[#FAF5EC] border-[#C59B63] text-[#0C141F] ring-1 ring-[#C59B63]/30'
            : 'bg-white border-[#EAE4D9] text-[#0C141F] hover:bg-[#FAF8F5] hover:border-[#C59B63]/60',
          disabled && 'opacity-50 cursor-not-allowed bg-stone-100',
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <span
            className={cn(
              'w-2 h-2 rounded-full shrink-0',
              selectedOption ? (selectedOption.dotColor || 'bg-[#C59B63]') : 'bg-stone-300'
            )}
          />
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-stone-500 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute mt-1.5 w-full min-w-[190px] max-h-60 overflow-y-auto bg-white rounded-2xl border border-[#EAE4D9] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 scrollbar-thin',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer select-none text-left',
                  isSelected
                    ? 'bg-[#FAF5EC] text-[#0C141F] font-bold'
                    : 'text-stone-700 hover:bg-[#FAF8F5] hover:text-[#0C141F] font-medium'
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={cn(
                      'w-2.5 h-2.5 rounded-full shrink-0',
                      isSelected
                        ? (option.dotColor || 'bg-[#C59B63]')
                        : 'bg-stone-300'
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-[#C59B63] shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
