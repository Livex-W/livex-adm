'use client';

import { Commission, useCommissionsStore } from '@/stores/useCommissionsStore';

export default function CommissionRow({ c }: { c: Commission }) {
    const markPaid = useCommissionsStore((s) => s.markPaid);

    const badge =
        c.status === 'Paid' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium badge-paid">
                Paid
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium badge-pending">
                Pending
            </span>
        );

    return (
        <tr className="divide-y divide-[var(--border-color)]">
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[var(--text-primary-color)] sm:pl-6">
                {c.id}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--text-secondary-color)]">
                {c.resort}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--text-secondary-color)]">
                {c.experienceDate}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--text-secondary-color)]">
                ${c.total.toFixed(2)}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--text-secondary-color)]">
                {c.rate}%
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-[var(--text-primary-color)]">
                ${c.amount.toFixed(2)}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-[var(--text-secondary-color)]">
                {c.paymentDate ?? '-'}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm">{badge}</td>
            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {c.status === 'Pending' ? (
                    <button
                        onClick={() => markPaid(c.id)}
                        className="text-[var(--primary-color)] hover:cursor-pointer"
                    >
                        Mark as Paid
                    </button>
                ) : (
                    <button className="text-slate-400 cursor-not-allowed" disabled>
                        Paid
                    </button>
                )}
            </td>
        </tr>
    );
}
