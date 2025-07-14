import UsersFilters from '@/components/users/UsersFilters';
import UsersTable from '@/components/users/UsersTable';
// import UsersPagination from '@/components/users/UsersPagination';

export default function UsersPage() {
    return (
        <div className="flex flex-col">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                        Platform Users
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Supervise app users and manage their status.
                    </p>
                </div>
            </div>

            {/* Tarjeta */}
            <div className="bg-[var(--container-bg)] rounded-lg shadow-sm border border-gray-200">
                <UsersFilters />
                <UsersTable />
                {/* <UsersPagination /> */}
            </div>
        </div>
    );
}
