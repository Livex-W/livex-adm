"use client";

import UsersFilters from "./UsersFilters";
import UsersTable from "./UsersTable";
import { useQueryUsers } from "@/hooks/users/useQueryUsers";

export default function UsersList() {
    const { isLoading } = useQueryUsers();
    return (
        <div className="bg-[var(--container-bg)] rounded-lg shadow-sm border border-gray-200 min-h-[300px]">
            {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading users…</div>
            ) : (
                <>
                    <UsersFilters />
                    <UsersTable />
                </>
            )}
            {/* <UsersPagination /> */}
        </div>
    );
}