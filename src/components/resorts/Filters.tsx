'use client';

import { useResortsStore } from '@/stores/useResortsStore';
import { ResortStatus } from '@/types/resort';

export default function Filters() {
    const filter = useResortsStore((state) => state.filter);
    const setFilter = useResortsStore((state) => state.setFilter);

    return (
        <div className="mb-4 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex gap-2">
                {Object.values(ResortStatus).map((opt) => {
                    const selected = filter === opt;
                    return (
                        <button
                            key={opt}
                            onClick={() => setFilter(opt)}
                            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${selected
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
