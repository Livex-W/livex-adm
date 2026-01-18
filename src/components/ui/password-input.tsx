'use client';

import React, { forwardRef, useState, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: string;
    helperText?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        id={inputId}
                        type={showPassword ? 'text' : 'password'}
                        className={cn(
                            `
              w-full px-4 py-2.5 pr-10 rounded-lg
              bg-white dark:bg-slate-900
              border border-slate-300 dark:border-slate-700
              text-slate-900 dark:text-slate-100
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
            `,
                            error && 'border-red-500 focus:ring-red-500',
                            className
                        )}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
