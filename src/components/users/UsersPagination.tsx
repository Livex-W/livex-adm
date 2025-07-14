'use client';

import { useUsersStore } from '@/stores/useUsersStore';

export default function UsersPagination() {
    const { page, maxPage, total, perPage, goToPage, nextPage, prevPage } =
        useUsersStore((s) => ({
            page: s.page,
            maxPage: s.maxPage,
            total: s.total,
            perPage: s.perPage,
            goToPage: s.goToPage,
            nextPage: s.nextPage,
            prevPage: s.prevPage,
        }));

    return (
        <div className="p-4 flex justify-between items-center border-t border-[var(--border-color)]">
            <span className="text-sm text-gray-500">
                Showing {(page - 1) * perPage + 1} to{' '}
                {Math.min(page * perPage, total)} of {total} entries
            </span>

            <div className="inline-flex rounded-md shadow-sm">
                <button
                    onClick={prevPage}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                >
                    Previous
                </button>

                {[...Array(maxPage)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 text-sm font-medium border-t border-b border-gray-300 ${page === i + 1
                                ? 'text-[var(--primary-color)] bg-indigo-50'
                                : 'text-gray-500 bg-white hover:bg-gray-100'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={nextPage}
                    disabled={page === maxPage}
                    className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
