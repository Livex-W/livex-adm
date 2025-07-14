interface StatusBadgeProps {
    status: 'Pending' | 'Active' | 'Inactive';
}

const statusMap = {
    Pending: 'status-pending',
    Active: 'status-active',
    Inactive: 'status-inactive',
} as const;

/**
 * Muestra la “pill” de estado usando utilidades Tailwind + clases personalizadas.
 * Las clases `status-*` se definen en tu `globals.css` (ver abajo).
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusMap[status]}`}
        >
            {status}
        </span>
    );
}
