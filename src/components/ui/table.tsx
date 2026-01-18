import { ReactNode, ThHTMLAttributes, TdHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Table Root
interface TableProps {
    children: ReactNode;
    className?: string;
}

export function Table({ children, className }: TableProps) {
    return (
        <div className="w-full overflow-x-auto">
            <table className={cn('w-full text-sm', className)}>
                {children}
            </table>
        </div>
    );
}

// Table Header
interface TableHeaderProps {
    children: ReactNode;
    className?: string;
}

export function TableHeader({ children, className }: TableHeaderProps) {
    return (
        <thead
            className={cn(
                'bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700',
                className
            )}
        >
            {children}
        </thead>
    );
}

// Table Body
interface TableBodyProps {
    children: ReactNode;
    className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
    return <tbody className={cn('divide-y divide-slate-200 dark:divide-slate-800', className)}>{children}</tbody>;
}

// Table Row
interface TableRowProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
}

export function TableRow({ children, className, onClick, hoverable = true }: TableRowProps) {
    return (
        <tr
            className={cn(
                'bg-white dark:bg-slate-900',
                hoverable && 'hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </tr>
    );
}

// Table Head Cell
interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

export function TableHead({ children, className, align = 'left', ...props }: TableHeadProps) {
    const alignments = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    return (
        <th
            className={cn(
                'px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-xs',
                alignments[align],
                className
            )}
            {...props}
        >
            {children}
        </th>
    );
}

// Table Cell
interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
    children?: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
}

export function TableCell({ children, className, align = 'left', ...props }: TableCellProps) {
    const alignments = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    };

    return (
        <td
            className={cn(
                'px-4 py-3 text-slate-700 dark:text-slate-300',
                alignments[align],
                className
            )}
            {...props}
        >
            {children}
        </td>
    );
}

// Empty State
interface TableEmptyProps {
    message?: string;
    colSpan: number;
}

export function TableEmpty({ message = 'No hay datos disponibles', colSpan }: TableEmptyProps) {
    return (
        <tr>
            <td
                colSpan={colSpan}
                className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
            >
                {message}
            </td>
        </tr>
    );
}
