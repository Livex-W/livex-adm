'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
    label: string;
    placeholder?: string;
    value: string[]; // Array of items
    onChange: (items: string[]) => void;
    className?: string;
    error?: string;
}

export function TagInput({
    label,
    placeholder = 'Agregar item...',
    value = [],
    onChange,
    className,
    error,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const addItem = useCallback(() => {
        const trimmed = inputValue.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
            setInputValue('');
        }
    }, [inputValue, value, onChange]);

    const removeItem = useCallback((index: number) => {
        const newItems = [...value];
        newItems.splice(index, 1);
        onChange(newItems);
    }, [value, onChange]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addItem();
        }
    };

    return (
        <div className={cn("w-full", className)}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {label}
            </label>

            {/* Tags Display */}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {value.map((item, index) => (
                        <span
                            key={index}
                            className="
                                inline-flex items-center gap-1.5 px-2.5 py-1
                                bg-indigo-100 dark:bg-indigo-900/40
                                text-indigo-700 dark:text-indigo-300
                                text-sm rounded-full
                            "
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="
                                    p-0.5 rounded-full
                                    hover:bg-indigo-200 dark:hover:bg-indigo-800
                                    transition-colors
                                "
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={cn(
                        `
                        flex-1 px-4 py-2.5 rounded-lg
                        bg-white dark:bg-slate-900
                        border border-slate-300 dark:border-slate-700
                        text-slate-900 dark:text-slate-100
                        placeholder:text-slate-400
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                        text-sm
                        `,
                        error && 'border-red-500 focus:ring-red-500'
                    )}
                />
                <button
                    type="button"
                    onClick={addItem}
                    disabled={!inputValue.trim()}
                    className="
                        px-3 py-2.5 rounded-lg
                        bg-indigo-600 text-white
                        hover:bg-indigo-700
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors
                    "
                >
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            <p className="mt-1 text-xs text-slate-500">
                Presiona Enter o + para agregar
            </p>

            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}

// Helper to convert array to comma-separated string
export function tagsToString(tags: string[]): string {
    return tags.join(', ');
}

// Helper to convert comma-separated string to array
export function stringToTags(str: string): string[] {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}
