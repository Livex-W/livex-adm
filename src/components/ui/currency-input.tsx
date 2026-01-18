'use client';

import { forwardRef, useState, useCallback, useRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    value: number;
    onChange: (value: number) => void;
}

// Format number with thousands separators (Colombian format: 1.000.000)
function formatNumber(num: number): string {
    if (isNaN(num) || num === 0) return '';
    return num.toLocaleString('es-CO');
}

// Parse formatted string back to number
function parseFormattedNumber(str: string): number {
    // Remove all dots (thousand separators) and parse
    const cleaned = str.replace(/\./g, '').replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            leftIcon,
            value,
            onChange,
            disabled,
            ...props
        },
        ref
    ) => {
        // Track if the input is being edited - if so, use local state for display
        const [localValue, setLocalValue] = useState<string | null>(null);
        const isEditing = useRef(false);

        // Display value: use local value when editing, otherwise format from prop
        const displayValue = localValue !== null ? localValue : formatNumber(value);

        const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value;
            const numericValue = parseFormattedNumber(input);

            // Store formatted value locally while typing
            setLocalValue(formatNumber(numericValue));

            // Update parent immediately
            onChange(numericValue);
        }, [onChange]);

        const handleFocus = useCallback(() => {
            isEditing.current = true;
            // Initialize local state with current value
            setLocalValue(formatNumber(value));
        }, [value]);

        const handleBlur = useCallback(() => {
            isEditing.current = false;
            // Clear local state, revert to controlled mode
            setLocalValue(null);
        }, []);

        return (
            <div className={cn("w-full", className)}>
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type="text"
                        inputMode="numeric"
                        value={displayValue}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        className={cn(
                            `
                            w-full px-4 py-2.5 rounded-lg
                            bg-white dark:bg-slate-900
                            border border-slate-300 dark:border-slate-700
                            text-slate-900 dark:text-slate-100
                            placeholder:text-slate-400
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                            disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800
                            `,
                            leftIcon && 'pl-10',
                            error && 'border-red-500 focus:ring-red-500'
                        )}
                        {...props}
                    />
                </div>

                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
                )}

                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
