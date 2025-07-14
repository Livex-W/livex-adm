interface Bar {
    name: string;
    pct: number; // 0-100
    highlight?: boolean;
}

const data: Bar[] = [
    { name: 'Adventure', pct: 20 },
    { name: 'Relaxation', pct: 60, highlight: true },
    { name: 'Cultural', pct: 80 },
    { name: 'Culinary', pct: 60 },
    { name: 'Wellness', pct: 90 },
];

export default function CategoryBar() {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Bookings by Category</h2>
            <p className="text-sm text-[var(--text-secondary)]">This Month</p>

            <div className="mt-4 grid h-80 grid-flow-col items-end justify-items-center gap-4 px-2">
                {data.map(({ name, pct, highlight }) => (
                    <div
                        key={name}
                        className="flex h-full w-full flex-col items-center justify-end gap-2"
                    >
                        <div
                            className={`w-full rounded-t-md ${highlight
                                    ? 'bg-[var(--primary-color)]'
                                    : 'bg-[var(--secondary-color)]'
                                }`}
                            style={{ height: `${pct}%` }}
                        />
                        <p className="text-xs font-medium text-[var(--text-secondary)]">
                            {name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
