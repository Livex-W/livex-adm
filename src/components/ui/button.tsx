import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseStyles = `
      cursor-pointer inline-flex items-center justify-center gap-2
      font-medium rounded-lg transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-indigo-600 to-indigo-500
        text-white shadow-md
        hover:from-indigo-700 hover:to-indigo-600
        focus:ring-indigo-500
      `,
            secondary: `
        bg-slate-100 text-slate-900
        hover:bg-slate-200
        focus:ring-slate-500
        dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700
      `,
            outline: `
        border-2 border-slate-300 bg-transparent text-slate-700
        hover:bg-slate-50 hover:border-slate-400
        focus:ring-slate-500
        dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800
      `,
            ghost: `
        bg-transparent text-slate-600
        hover:bg-slate-100 hover:text-slate-900
        focus:ring-slate-500
        dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100
      `,
            danger: `
        bg-red-500 text-white
        hover:bg-red-600
        focus:ring-red-500
      `,
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2 text-sm',
            lg: 'px-6 py-3 text-base',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
