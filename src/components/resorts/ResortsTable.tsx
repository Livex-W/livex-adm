'use client';

import { useResortsStore } from '@/stores/useResortsStore';
import ResortTableRow from './ResortTableRow';

export default function ResortsTable() {
    const resorts = useResortsStore((state) => state.filteredResorts);

    console.log(resorts);

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {['Name', 'Owner', 'Contact', 'City', 'Status', 'Created At', ''].map((h) => (
                            <th
                                key={h}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {resorts.map((r) => (
                        <ResortTableRow key={r.resortId} resort={r} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
