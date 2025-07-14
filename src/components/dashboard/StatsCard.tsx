interface StatsCardProps {
    title: string;
    value: string | number;
}

export default function StatsCard({ title, value }: StatsCardProps) {
    return (
        <div className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
                {title}
            </p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
