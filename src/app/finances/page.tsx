import CommissionStats from '@/components/commissions/CommissionStats';
import CommissionFilters from '@/components/commissions/CommissionFilters';
import CommissionTable from '@/components/commissions/CommissionTable';

export default function CommissionReportPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Commission Report</h2>
            <CommissionStats />
            <CommissionFilters />
            <CommissionTable />
        </div>
    );
}
