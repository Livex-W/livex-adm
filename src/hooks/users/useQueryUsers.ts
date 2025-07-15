import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { UsersRepository } from '@/repositories/UsersRepository';
import { useUsersStore, User } from '@/stores/useUsersStore';
import { UserModel } from '@/types/user';

/**
 * Hook – Recupera los usuarios (mock) usando UsersRepository y los vuelca en
 * useUsersStore.  Devuelve flags de carga y error para que los componentes
 * puedan mostrar estados de UX apropiados.
 */
export function useQueryUsers() {
    const setUsers = useUsersStore((s) => s.setUsers);
    const repo = new UsersRepository();

    const query = useQuery<UserModel[], Error>({
        queryKey: ['users'],
        queryFn: () => repo.getUsers(),
        staleTime: 1000 * 60 * 5, // 5 min
    });

    // Cuando los datos llegan, actualiza el store.
    useEffect(() => {
        if (query.data) {
            const adapted = query.data.map(mapToStoreUser);
            setUsers(adapted);
        }
    }, [query.data, setUsers]);

    return { isLoading: query.isPending, error: query.error } as const;
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
