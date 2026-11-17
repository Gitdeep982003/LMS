import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'emerald';
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
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]',
          // Variants
          variant === 'primary' &&
            'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm shadow-blue-500/20',
          variant === 'emerald' &&
            'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm shadow-emerald-500/20',
          variant === 'secondary' &&
            'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-400',
          variant === 'outline' &&
            'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-blue-500',
          variant === 'ghost' &&
            'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400',
          variant === 'destructive' &&
            'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs gap-1.5',
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
