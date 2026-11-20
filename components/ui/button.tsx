import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'emerald' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]',
          // Variants
          variant === 'primary' &&
            'bg-[#0C141F] text-[#C59B63] hover:bg-[#16202E] hover:text-[#D4AF77] border border-[#C59B63]/30 shadow-xs focus:ring-[#C59B63]/30',
          variant === 'gold' &&
            'bg-[#C59B63] text-white hover:bg-[#B88A44] shadow-xs focus:ring-[#C59B63]/40',
          variant === 'emerald' &&
            'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-xs',
          variant === 'secondary' &&
            'bg-[#FAF5EC] text-[#8C6228] border border-[#E5D0A6] hover:bg-[#F2E6CE] focus:ring-[#C59B63]/30',
          variant === 'outline' &&
            'border border-[#C59B63] bg-transparent text-[#0C141F] hover:bg-[#FAF5EC] focus:ring-[#C59B63]/30',
          variant === 'ghost' &&
            'bg-transparent text-stone-600 hover:bg-[#FAF5EC] hover:text-[#0C141F] focus:ring-[#C59B63]/30',
          variant === 'destructive' &&
            'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-xs',
          // Sizes
          size === 'sm' && 'h-8 px-3.5 text-xs gap-1.5',
          size === 'md' && 'h-9 px-4 text-sm gap-2',
          size === 'lg' && 'h-11 px-6 text-base gap-2.5',
          size === 'icon' && 'h-9 w-9 p-0',
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
