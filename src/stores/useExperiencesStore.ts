import { create } from 'zustand'

/* ---------- Tipos ---------- */
export type StatusFilter = 'All' | 'Draft' | 'Active'

export interface Experience {
    id: string
    title: string
    resort: string
    price: number
    createdAt: string
    status: 'Draft' | 'Active'
    description: string
}

interface ExperiencesStore {
    /* estado */
    experiences: Experience[]
    statusFilter: StatusFilter
    resortFilter: string          // 'All' o nombre del resort
    filteredExperiences: Experience[]
    selectedId: string | null

    /* acciones */
    setStatusFilter: (s: StatusFilter) => void
    setResortFilter: (r: string) => void
    setSelected: (id: string | null) => void
}

const mockExperiences: Experience[] = [
    {
        id: 'exp-1',
        title: 'Sunset Yoga Retreat',
        resort: 'Serenity Resort',
        price: 150,
        createdAt: '2023-08-15',
        status: 'Draft',
        description:
            'Relax and unwind with a guided yoga session as the sun sets over tranquil waters.',
    },
    {
        id: 'exp-2',
        title: 'Mountain Hiking Adventure',
        resort: 'Alpine Lodge',
        price: 200,
        createdAt: '2023-08-16',
        status: 'Active',
        description:
            'Embark on a breathtaking journey through scenic mountain trails, suitable for all skill levels.',
    },
    {
        id: 'exp-3',
        title: 'Coastal Kayaking Tour',
        resort: 'Oceanview Resort',
        price: 120,
        createdAt: '2023-08-17',
        status: 'Draft',
        description:
            'Explore vibrant coastal ecosystems by kayak with an experienced local guide.',
    },
    {
        id: 'exp-4',
        title: 'Wine Tasting Experience',
        resort: 'Vineyard Estate',
        price: 180,
        createdAt: '2023-08-18',
        status: 'Draft',
        description:
            'Sample award-winning wines and learn about viticulture from our resident sommelier.',
    },
    {
        id: 'exp-5',
        title: 'City Walking Tour',
        resort: 'Urban Oasis Hotel',
        price: 80,
        createdAt: '2023-08-19',
        status: 'Draft',
        description:
            'Discover hidden architectural gems and cultural landmarks on a guided city walk.',
    },
];

/* ---------- Auxiliar ---------- */
function applyFilters(
    data: Experience[],
    status: StatusFilter,
    resort: string
) {
    return data.filter((e) => {
        const okStatus = status === 'All' ? true : e.status === status
        const okResort = resort === 'All' ? true : e.resort === resort
        return okStatus && okResort
    })
}

/* ---------- Store ---------- */
export const useExperiencesStore = create<ExperiencesStore>()((set) => ({
    experiences: mockExperiences,
    statusFilter: 'All',
    resortFilter: 'All',
    filteredExperiences: mockExperiences,
    selectedId: mockExperiences[1].id, // fila azul inicial

    setStatusFilter: (status) =>
        set((state) => ({
            statusFilter: status,
            filteredExperiences: applyFilters(state.experiences, status, state.resortFilter),
        })),

    setResortFilter: (resort) =>
        set((state) => ({
            resortFilter: resort,
            filteredExperiences: applyFilters(state.experiences, state.statusFilter, resort),
        })),

    setSelected: (id) => set({ selectedId: id }),
}))