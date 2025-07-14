'use client';

import { useExperiencesStore } from '@/stores/useExperiencesStore';

export default function ExperienceFilters() {
    const statusFilter = useExperiencesStore((s) => s.statusFilter);
    const resortFilter = useExperiencesStore((s) => s.resortFilter);
    const setStatusFilter = useExperiencesStore((s) => s.setStatusFilter);
    const setResortFilter = useExperiencesStore((s) => s.setResortFilter);

    /* Resorts para el 2.º <select> */
    const resorts = [
        'All Resorts',
        ...new Set(useExperiencesStore.getState().experiences.map((e) => e.resort)),
    ];

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <h2 className="text-lg font-semibold">Pending Experiences</h2>

            <div className="ml-auto flex items-center gap-2">
                {/* STATUS */}
                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value as Parameters<typeof setStatusFilter>[0])
                    }
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-auto"
                >
                    <option value="All">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                </select>

                {/* RESORT */}
                <select
                    value={resortFilter}
                    onChange={(e) => setResortFilter(e.target.value)}
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm leading-tight text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-auto"
                >
                    {resorts.map((r) => (
                        <option key={r} value={r === 'All Resorts' ? 'All' : r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
