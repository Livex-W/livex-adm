import StatsCard from '@/components/dashboard/StatsCard';
import TrendChart from '@/components/dashboard/TrendChart';
import CategoryBar from '@/components/dashboard/CategoryBar';
import ResortsTable from '@/components/dashboard/ResortsTable';

const stats = [
  { title: 'Resorts Pending Approval', value: 12 },
  { title: 'Experiences Pending Approval', value: 35 },
  { title: 'Total Commission Revenue (Month)', value: '$15,750' },
  { title: 'New Users Registered (Today)', value: 28 },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-4xl font-bold tracking-tighter">Dashboard</h1>

      {/* Métricas */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>

      {/* Gráficos */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <TrendChart />
        <CategoryBar />
      </div>

      {/* Tabla */}
      <ResortsTable />
    </div>
  );
}
