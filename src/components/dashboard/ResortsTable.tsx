interface Resort {
    name: string;
    location: string;
    date: string;
    status: 'Pending' | 'Approved';
}

const resorts: Resort[] = [
    { name: 'Mountain View Retreat', location: 'Aspen, CO', date: '2023-11-15', status: 'Pending' },
    { name: 'Coastal Escape Resort', location: 'Malibu, CA', date: '2023-11-12', status: 'Pending' },
    { name: 'Desert Oasis Spa', location: 'Scottsdale, AZ', date: '2023-11-10', status: 'Pending' },
    { name: 'Urban Getaway Hotel', location: 'New York, NY', date: '2023-11-08', status: 'Pending' },
    { name: 'Tropical Paradise Resort', location: 'Maui, HI', date: '2023-11-05', status: 'Pending' },
];

export default function ResortsTable() {
    return (
        <section className="mt-10">
            <h2 className="text-2xl font-bold tracking-tighter">
                Resorts Awaiting Approval
            </h2>
            <div className="mt-4 overflow-x-auto rounded-xl bg-white shadow-sm">
                <table className="w-full text-left">
                    <thead className="border-b border-[var(--accent-color)]">
                        <tr>
                            {['Resort Name', 'Location', 'Registration Date', 'Status', '']
                                .map((th) => (
                                    <th key={th} className="px-6 py-4 text-sm font-semibold">
                                        {th}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {resorts.map((r) => (
                            <tr
                                key={r.name}
                                className="border-b border-[var(--accent-color)]"
                            >
                                <td className="px-6 py-4 text-sm font-medium">{r.name}</td>
                                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                    {r.location}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                    {r.date}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                                        {r.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a
                                        href="#"
                                        className="font-medium text-[var(--primary-color)] hover:underline"
                                    >
                                        View
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
