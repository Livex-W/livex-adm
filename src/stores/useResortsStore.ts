import { create } from 'zustand';
import { mockResorts } from '@/data/resort-mock';
import { ResortStatus } from '@/types/resort';
import { Resort } from '@/types/resort';
import { ResortAddress } from '@/types/resort';
import { mockResortAddresses } from '@/data/resort-mock';

export type StatusFilter = 'All' | ResortStatus;

interface ResortsStore {
    resorts: Resort[];
    filter: StatusFilter;
    setFilter: (status: StatusFilter) => void;
    setResorts: (resorts: Resort[]) => void;
    filteredResorts: Resort[];
    getAddresses: (resortId: string) => ResortAddress[];
}

export const useResortsStore = create<ResortsStore>((set) => ({
    resorts: mockResorts,
    filter: 'All',
    setFilter: (status) => {
        const filteredResorts = status === 'All' ? mockResorts : mockResorts.filter((r) => r.status === status);
        set({ filter: status, filteredResorts });
    },
    setResorts: (resorts) =>
        set((state) => ({
            resorts,
            filteredResorts:
                state.filter === 'All' ? resorts : resorts.filter((r) => r.status === state.filter),
        })),
    filteredResorts: mockResorts,
    getAddresses: (resortId) => mockResortAddresses.filter((a) => a.resortId === resortId),
}));
