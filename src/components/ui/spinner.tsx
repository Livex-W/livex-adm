import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };

    return (
        <Loader2
            className={cn('animate-spin text-indigo-500', sizes[size], className)}
        />
    );
}

interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = 'Cargando...' }: LoadingOverlayProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 z-10">
            <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
            </div>
        </div>
    );
}

interface PageLoaderProps {
    message?: string;
}

export function PageLoader({ message = 'Cargando...' }: PageLoaderProps) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" />
                <p className="text-slate-500 dark:text-slate-400">{message}</p>
            </div>
        </div>
    );
}
