'use client';

import { useCommissionsStore } from '@/stores/useCommissionsStore';

export default function CommissionStats() {
    const pendingSum = useCommissionsStore((s) => s.pendingSum);
    const paidSum = useCommissionsStore((s) => s.paidSum);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Pending */}
            <div className="bg-[var(--card-background-color)] rounded-lg shadow-sm p-6">
                <p className="text-sm font-medium text-[var(--text-secondary-color)]">
                    Pending Commissions
                </p>
                <p className="text-3xl font-bold mt-2">
                    {pendingSum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>

            {/* Paid */}
            <div className="bg-[var(--card-background-color)] rounded-lg shadow-sm p-6">
                <p className="text-sm font-medium text-[var(--text-secondary-color)]">
                    Paid Commissions
                </p>
                <p className="text-3xl font-bold mt-2">
                    {paidSum.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </p>
            </div>
        </div>
    );
}
