import StatusBadge from './StatusBadge';

export interface Resort {
    id: string;
    name: string;
    logo: string;
    owner: string;
    contact: string;
    city: string;
    status: 'Pending' | 'Active' | 'Inactive';
    createdAt: string;
}

export default function ResortTableRow({
    resort,
}: {
    resort: Resort;
}) {
    return (
        <tr className="hover:bg-gray-50">
            <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-3">
                    <img
                        src={resort.logo}
                        alt={`${resort.name} logo`}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{resort.name}</span>
                </div>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {resort.owner}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {resort.contact}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {resort.city}
            </td>
            <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={resort.status} />
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {resort.createdAt}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    View
                </a>
            </td>
        </tr>
    );
}
