"use client";

import Filters from '@/components/resorts/Filters';
import ResortsTable from '@/components/resorts/ResortsTable';

export default function ResortsList() {

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Resort Management
                </h2>

                <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <svg
                        className="mr-2"
                        fill="currentColor"
                        width="16"
                        height="16"
                        viewBox="0 0 256 256"
                    >
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
                    </svg>
                    Add Resort
                </button>
            </div>

            <Filters />
            <ResortsTable />
        </div>
    );
}
