'use client';

import { useUsersStore } from '@/stores/useUsersStore';
import { ChangeEvent } from 'react';

/* Heroicons v2 */
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckIcon,
    ChevronDownIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export default function UsersFilters() {
    const search = useUsersStore((s) => s.search);
    const vipFilter = useUsersStore((s) => s.vipFilter);
    const setSearch = useUsersStore((s) => s.setSearch);
    const setVipFilter = useUsersStore((s) => s.setVipFilter);

    const onSearch = (e: ChangeEvent<HTMLInputElement>) =>
        setSearch(e.target.value);

    return (
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
            {/* ----- Búsqueda ----- */}
            <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={onSearch}
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] transition"
                />
            </div>

            {/* ----- Filtro VIP (funcional) ----- */}
            <button
                onClick={() => setVipFilter(vipFilter === 'VIP' ? 'All' : 'VIP')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                VIP Status
                {vipFilter === 'VIP' ? (
                    <CheckIcon className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
            </button>

            {/* ----- Botón decorativo ----- */}
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition">
                <ShieldCheckIcon className="h-5 w-5 text-gray-500" />
                Verification
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            </button>
        </div>
    );
}
