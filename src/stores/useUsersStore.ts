import { create } from 'zustand';

/* ---------- Tipos ---------- */
export type VipStatus = 'All' | 'VIP' | 'Standard';

export interface User {
    id: string;
    name: string;
    email: string;
    nationality: string;
    createdAt: string;
    vip: 'VIP' | 'Standard';
    avatar: string;
}

interface UsersState {
    /* crudo */
    users: User[];
    search: string;
    vipFilter: VipStatus;
    page: number;
    perPage: number;

    /* derivado */
    filtered: User[];
    paged: User[];
    total: number;
    maxPage: number;

    /* acciones */
    setSearch: (s: string) => void;
    setVipFilter: (v: VipStatus) => void;
    goToPage: (p: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setUsers: (u: User[]) => void;
}

const mock: User[] = [
    {
        id: '1',
        name: 'Ethan Carter',
        email: 'ethan.carter@email.com',
        nationality: 'American',
        createdAt: '2023-01-15',
        vip: 'Standard',
        avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBbFbMgKmEiDkqW…',
    },
    {
        id: '2',
        name: 'Olivia Bennett',
        email: 'olivia.bennett@email.com',
        nationality: 'Canadian',
        createdAt: '2023-02-20',
        vip: 'VIP',
        avatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBbFbMgKmEiDkqW…',
    },
    // …otros 3 registros para llegar a 5
];

/* ---------- Helpers ---------- */
function filterUsers(users: User[], search: string, vip: VipStatus) {
    const needle = search.toLowerCase();
    return users.filter((u) => {
        const okVip = vip === 'All' || u.vip === vip;
        const okSearch =
            needle === '' ||
            `${u.name} ${u.email}`.toLowerCase().includes(needle);
        return okVip && okSearch;
    });
}

function getDerived(state: {
    users: User[];
    search: string;
    vipFilter: VipStatus;
    page: number;
    perPage: number;
}) {
    const filtered = filterUsers(state.users, state.search, state.vipFilter);
    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / state.perPage));
    const page = Math.min(state.page, maxPage);
    const paged = filtered.slice(
        (page - 1) * state.perPage,
        page * state.perPage,
    );

    return { filtered, total, maxPage, page, paged };
}

/* ---------- Store ---------- */
export const useUsersStore = create<UsersState>((set, get) => {
    /* estado base inicial */
    const base = {
        users: mock,
        search: '',
        vipFilter: 'All' as VipStatus,
        page: 1,
        perPage: 5,
    };

    return {
        ...base,
        ...getDerived(base),

        /* acciones */
        setSearch: (search) => {
            const next = { ...get(), search, page: 1 };
            set({ ...next, ...getDerived(next) });
        },

        setVipFilter: (vipFilter) => {
            const next = { ...get(), vipFilter, page: 1 };
            set({ ...next, ...getDerived(next) });
        },

        goToPage: (p) => {
            const next = { ...get(), page: p };
            set({ ...next, ...getDerived(next) });
        },

        nextPage: () => {
            const { page, maxPage } = get();
            if (page < maxPage) {
                const next = { ...get(), page: page + 1 };
                set({ ...next, ...getDerived(next) });
            }
        },

        prevPage: () => {
            const { page } = get();
            if (page > 1) {
                const next = { ...get(), page: page - 1 };
                set({ ...next, ...getDerived(next) });
            }
        },

        /**
         * Reemplaza la lista de usuarios con datos externos (p.e. repositorio).
         */
        setUsers: (users) => {
            const next = { ...get(), users, page: 1 };
            set({ ...next, ...getDerived(next) });
        }
    };
});
