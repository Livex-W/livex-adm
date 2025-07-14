'use client';

import { Experience, useExperiencesStore } from '@/stores/useExperiencesStore';

export default function ExperienceRow({ exp }: { exp: Experience }) {
    const selectedId = useExperiencesStore((s) => s.selectedId);
    const setSelected = useExperiencesStore((s) => s.setSelected);

    const isSelected = selectedId === exp.id;

    return (
        <tr
            onClick={() => setSelected(exp.id)}
            className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
        >
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                {exp.title}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                {exp.resort}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                ${exp.price.toFixed(2)}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                {exp.createdAt}
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-right">
                <button
                    className={`rounded-md px-3 py-1 text-sm font-medium ${isSelected
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                >
                    {isSelected ? 'Reviewing' : 'Review'}
                </button>
            </td>
        </tr>
    );
}
