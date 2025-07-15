import { useMutation } from '@tanstack/react-query';
import { UsersRepository } from '@/repositories/UsersRepository';
import { useUsersStore, User } from '@/stores/useUsersStore';
import { UserModel } from '@/types/user';

interface ToggleArgs {
    id: string;
    isVip: boolean;
}

export function useToggleVip() {
    const repo = new UsersRepository();
    const users = useUsersStore((s) => s.users);
    const setUsers = useUsersStore((s) => s.setUsers);

    return useMutation({
        mutationFn: ({ id, isVip }: ToggleArgs) => repo.patchUser(id, { isVip }),
        onSuccess: (updated: UserModel) => {
            const mapped = mapToStoreUser(updated);
            const next = users.map((u) => (u.id === mapped.id ? mapped : u));
            setUsers(next);
        },
    });
}

/* -------------------------------------------------------------------------- */
function mapToStoreUser(u: UserModel): User {
    return {
        id: u.userId,
        name: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        nationality: u.nationality,
        createdAt: formatDate(u.createdAt),
        vip: u.isVip ? 'VIP' : 'Standard',
        avatar: u.profilePicture ?? '',
    };
}

function formatDate(date: Date): string {
    if (typeof date === 'string') return date;
    return date.toISOString().split('T')[0];
}
