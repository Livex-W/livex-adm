'use client';

import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import apiClient from '@/lib/api-client';
import { Category, PaginatedResult } from '@/types';

interface CategorySelectProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
}

const CATEGORIES_QUERY_KEY = ['categories'] as const;

// Fallback categories matching backend enum
const FALLBACK_CATEGORIES: Category[] = [
    { id: 'islands', name: 'Islas', slug: 'islands' },
    { id: 'nautical', name: 'Náutico', slug: 'nautical' },
    { id: 'city_tour', name: 'City Tour', slug: 'city_tour' },
];

async function fetchCategories(): Promise<Category[]> {
    try {
        const response = await apiClient.get<PaginatedResult<Category>>('/api/v1/categories');
        return response.data.data.length > 0 ? response.data.data : FALLBACK_CATEGORIES;
    } catch {
        return FALLBACK_CATEGORIES;
    }
}

export function CategorySelect({ value, onChange, error, className }: CategorySelectProps) {
    const { data: categories = FALLBACK_CATEGORIES, isLoading } = useQuery({
        queryKey: CATEGORIES_QUERY_KEY,
        queryFn: fetchCategories,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });

    return (
        <div className={cn("w-full", className)}>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Categoría
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={isLoading}
                className={cn(
                    `
                    w-full px-4 py-2.5 rounded-lg
                    bg-white dark:bg-slate-900
                    border border-slate-300 dark:border-slate-700
                    text-slate-900 dark:text-slate-100
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                    disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800
                    `,
                    error && 'border-red-500 focus:ring-red-500'
                )}
            >
                <option value="">Seleccionar categoría...</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug || cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1.5 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
