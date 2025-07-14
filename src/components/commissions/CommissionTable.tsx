'use client';

import { useCommissionsStore } from '@/stores/useCommissionsStore';
import CommissionRow from './CommissionRow';

export default function CommissionTable() {
    const rows = useCommissionsStore((s) => s.filtered);

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-sm ring-1 ring-[var(--border-color)] ring-inset sm:rounded-lg">
                        <table className="min-w-full divide-y divide-[var(--border-color)]">
                            <thead className="bg-slate-50">
                                <tr>
                                    {[
                                        'Booking ID',
                                        'Resort',
                                        'Experience Date',
                                        'Total',
                                        'Rate',
                                        'Amount',
                                        'Payment Date',
                                        'Status',
                                        '',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            scope="col"
                                            className={`py-3.5 px-3 text-left text-sm font-semibold text-[var(--text-primary-color)] ${h === 'Booking ID' ? 'pl-4 sm:pl-6' : ''
                                                } ${h === '' ? 'sr-only' : ''}`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[var(--border-color)] bg-white">
                                {rows.map((c) => (
                                    <CommissionRow key={c.id} c={c} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
