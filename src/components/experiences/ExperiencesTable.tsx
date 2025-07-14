'use client';

import { useExperiencesStore } from '@/stores/useExperiencesStore';
import ExperienceRow from './ExperienceRow';

export default function ExperiencesTable() {
    const data = useExperiencesStore((s) => s.filteredExperiences);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {['Title', 'Resort', 'Price', 'Created', ''].map((h) => (
                            <th
                                key={h}
                                className={`px-6 py-3 font-medium text-gray-500 ${h ? 'text-left' : 'text-right'
                                    }`}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((exp) => (
                        <ExperienceRow key={exp.id} exp={exp} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
