import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export function Card({ children, className, padding = 'md', hover = false, ...props }: CardProps) {
    const paddingStyles = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={cn(
                `
        bg-white dark:bg-slate-900
        rounded-xl
        border border-slate-200 dark:border-slate-800
        shadow-sm
        `,
                paddingStyles[padding],
                hover && 'transition-shadow duration-200 hover:shadow-md',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
    return (
        <div className={cn('mb-4', className)}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className, as: Tag = 'h3' }: CardTitleProps) {
    return (
        <Tag
            className={cn(
                'text-lg font-semibold text-slate-900 dark:text-slate-100',
                className
            )}
        >
            {children}
        </Tag>
    );
}

interface CardDescriptionProps {
    children: ReactNode;
    className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
    return (
        <p className={cn('text-sm text-slate-500 dark:text-slate-400 mt-1', className)}>
            {children}
        </p>
    );
}

interface CardContentProps {
    children: ReactNode;
    className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
    return <div className={cn('', className)}>{children}</div>;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
    return (
        <div
            className={cn(
                'mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3',
                className
            )}
        >
            {children}
        </div>
    );
}
