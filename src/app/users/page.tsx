import UsersList from '@/components/users/UsersList';
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
            <UsersList />
        </div>
    );
}
