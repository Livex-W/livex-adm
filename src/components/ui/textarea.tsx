import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
        const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <textarea
                        ref={ref}
                        id={textareaId}
                        className={cn(
                            `
                            w-full px-4 py-2.5 rounded-lg
                            bg-white dark:bg-slate-900
                            border border-slate-300 dark:border-slate-700
                            text-slate-900 dark:text-slate-100
                            placeholder:text-slate-400 dark:placeholder:text-slate-500
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                            disabled:cursor-not-allowed 
                            disabled:bg-slate-100 disabled:text-slate-500 
                            dark:disabled:bg-slate-800/50 dark:disabled:text-slate-400
                            min-h-[100px]
                            `,
                            error && 'border-red-500 focus:ring-red-500',
                            className
                        )}
                        {...props}
                    />
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

Textarea.displayName = 'Textarea';

export { Textarea };
