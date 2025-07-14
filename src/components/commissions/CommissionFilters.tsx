'use client';

import { useCommissionsStore } from '@/stores/useCommissionsStore';
import { FunnelIcon } from '@heroicons/react/24/outline';

export default function CommissionFilters() {
    const dateRange = useCommissionsStore((s) => s.dateRange);
    const setDateRange = useCommissionsStore((s) => s.setDateRange);
    const resortFilter = useCommissionsStore((s) => s.resortFilter);
    const setResortFilter = useCommissionsStore((s) => s.setResortFilter);

    return (
        <div className="bg-[var(--card-background-color)] rounded-lg shadow-sm mt-8 p-6">
            <h3 className="text-lg font-semibold">Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Date range (texto demo) */}
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-[var(--text-secondary-color)] pb-1.5">
                        Date Range
                    </span>
                    <input
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        type="text"
                        placeholder="Select Date Range"
                        className="form-input rounded-md border-[var(--border-color)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-opacity-50"
                    />
                </label>

                {/* Resort (texto demo) */}
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-[var(--text-secondary-color)] pb-1.5">
                        Resort
                    </span>
                    <input
                        value={resortFilter === 'All' ? '' : resortFilter}
                        onChange={(e) =>
                            setResortFilter(e.target.value === '' ? 'All' : e.target.value)
                        }
                        type="text"
                        placeholder="Select Resort"
                        className="form-input rounded-md border-[var(--border-color)] focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] focus:ring-opacity-50"
                    />
                </label>
            </div>

            {/* Icono adorno */}
            <FunnelIcon className="hidden md:block h-5 w-5 text-[var(--text-secondary-color)] mt-4" />
        </div>
    );
}
