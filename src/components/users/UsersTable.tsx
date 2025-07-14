'use client';

import { useUsersStore } from '@/stores/useUsersStore';
import UserRow from './UserRow';

export default function UsersTable() {
    const paged = useUsersStore((s) => s.paged);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-[var(--text-secondary)]">
                <thead className="text-xs uppercase bg-gray-50 text-[var(--text-secondary)]">
                    <tr>
                        {['User', 'Nationality', 'Created At', 'VIP Status', ''].map((h) => (
                            <th key={h} className="px-6 py-3 font-semibold">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {paged.map((u) => (
                        <UserRow key={u.id} u={u} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
