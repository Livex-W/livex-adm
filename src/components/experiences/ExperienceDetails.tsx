'use client';

import { useExperiencesStore } from '@/stores/useExperiencesStore';

export default function ExperienceDetails() {
    const exp = useExperiencesStore((s) =>
        s.experiences.find((e) => e.id === s.selectedId)
    );

    if (!exp)
        return (
            <div className="p-6 text-sm text-gray-500">
                Select an experience to see details
            </div>
        );

    const fields = [
        { label: 'Title', value: exp.title },
        { label: 'Resort Name', value: exp.resort },
        { label: 'Regular Price', value: `$${exp.price.toFixed(2)}` },
        { label: 'Created At', value: exp.createdAt },
        { label: 'Description', value: exp.description },
    ];

    return (
        <>
            {/* Encabezado */}
            <div className="p-6">
                <h2 className="text-lg font-semibold">Experience Details</h2>
                <p className="mt-1 text-sm text-gray-500">Read-only view for auditing.</p>
            </div>

            {/* Campos */}
            <div className="border-t p-6 space-y-6">
                {fields.map(({ label, value }) => (
                    <div key={label}>
                        <label className="block text-sm font-medium text-gray-700">
                            {label}
                        </label>
                        <p className="mt-1 text-base text-gray-900">{value}</p>
                    </div>
                ))}
            </div>

            {/* Botones */}
            <div className="border-t bg-gray-50 px-6 py-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button className="flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Publish Experience
                    </button>
                    <button className="flex w-full items-center justify-center rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                        Request Changes
                    </button>
                </div>
            </div>
        </>
    );
}
