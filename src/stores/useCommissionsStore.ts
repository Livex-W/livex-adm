import { create } from 'zustand';

export type CommissionStatus = 'Paid' | 'Pending';

export interface Commission {
    id: string;
    resort: string;
    experienceDate: string;
    total: number;
    rate: number; // %
    amount: number;
    paymentDate: string | null;
    status: CommissionStatus;
}

interface CommissionsState {
    commissions: Commission[];

    /* filtros */
    resortFilter: string;   // 'All' ó nombre de resort
    dateRange: string;      // texto libre, demo
    setResortFilter: (r: string) => void;
    setDateRange: (d: string) => void;

    /* acciones */
    markPaid: (id: string) => void;

    /* derivado */
    filtered: Commission[];
    pendingSum: number;
    paidSum: number;
}

const mock: Commission[] = [
    {
        id: '#12345',
        resort: 'Mountain View Resort',
        experienceDate: '2024-03-15',
        total: 500,
        rate: 10,
        amount: 50,
        paymentDate: '2024-03-20',
        status: 'Paid',
    },
    {
        id: '#67890',
        resort: 'Ocean Breeze Resort',
        experienceDate: '2024-03-16',
        total: 750,
        rate: 12,
        amount: 90,
        paymentDate: null,
        status: 'Pending',
    },
    /* …otros 3 elementos … */
];

function derive(state: CommissionsState) {
    const filtered = state.commissions.filter((c) => {
        const okResort =
            state.resortFilter === 'All' || c.resort === state.resortFilter;
        // aquí podrías aplicar rango de fechas real; demo -> siempre true
        const okDate = true;
        return okResort && okDate;
    });

    const pendingSum = filtered
        .filter((c) => c.status === 'Pending')
        .reduce((a, c) => a + c.amount, 0);
    const paidSum = filtered
        .filter((c) => c.status === 'Paid')
        .reduce((a, c) => a + c.amount, 0);

    return { filtered, pendingSum, paidSum };
}

export const useCommissionsStore = create<CommissionsState>((set) => ({
    commissions: mock,

    resortFilter: 'All',
    dateRange: '',

    setResortFilter: (resortFilter) =>
        set((s) => ({ resortFilter, ...derive({ ...s, resortFilter }) })),
    setDateRange: (dateRange) =>
        set((s) => ({ dateRange, ...derive({ ...s, dateRange }) })),

    markPaid: (id) =>
        set((s) => {
            // 👇 declaramos explícitamente que el resultado es Commission[]
            const commissions: Commission[] = s.commissions.map((c) =>
                c.id === id
                    ? {
                        ...c,
                        status: 'Paid' as const, // <- literal se mantiene en el tipo
                        paymentDate: new Date().toISOString().slice(0, 10),
                    }
                    : c,
            );

            return { commissions, ...derive({ ...s, commissions }) };
        }),

    ...derive({
        commissions: mock,
        resortFilter: 'All',
        dateRange: '',
    } as CommissionsState),
}));
