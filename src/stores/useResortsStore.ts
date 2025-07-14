import { create } from 'zustand';
import { Resort } from '@/components/resorts/ResortTableRow';

export type StatusFilter = 'All' | 'Pending' | 'Active' | 'Inactive';

interface ResortsStore {
    resorts: Resort[];
    filter: StatusFilter;
    setFilter: (status: StatusFilter) => void;
    filteredResorts: Resort[];
}

// 🔹 Datos simulados ampliados
const mockResorts: Resort[] = [
    {
        id: '1',
        name: 'Mountain View Resort',
        logo:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAAY_MFAaAxlKaCHrbuZuZuAl3zrbGPt9adBXhq8K-Q0_wYqvOTENoOjxnjLrisEw_SxiKbH5Xo9XcmqsUISeCHYTA--twQHMQpVQnqZmGObn16VXGPP69UbxnLwmjjbQjTuDUyTR2_0ThAuLgKv28MGZUd1vR7pOe8nLtLAiAI-IUSiTAduu5qrJI2TAm52tdfVuojGXtW0aR-gezykUuD0EsjCyL9fbFADBfIaxur--sC3eRjWEuWeYu1Ogre6HYxOdIa9BWVkQ',
        owner: 'Ethan Carter',
        contact: 'ethan.carter@email.com',
        city: 'Aspen',
        status: 'Pending',
        createdAt: '01/15/2024',
    },
    {
        id: '2',
        name: 'Ocean Breeze Resort',
        logo:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCUE7Vtfot_-f7Sf7Oov_F297ajrshTZH1PMYy0ylo92UCqvbWJwp56cPEEFEo0J37KtDpCqCtw6qswLRC43tY1bc-pGrLV-ouQMG2UKsqQ08c49cOSR77b_lHmbl1eBxnwo22_D1pXzrQiECk7cJGD8uul2V3bmJ7YxZdZ3V-RtfPp5CudmJM2ZdUXgsy32VW3-9aYJHd_wP3tgJaaptVtNYXdrO1_2qV5sIgVtnAVAz8e-_WhEiYLmUBuCb71CuJf9cesrZNmkg',
        owner: 'Olivia Bennett',
        contact: 'olivia.bennett@email.com',
        city: 'Miami',
        status: 'Active',
        createdAt: '02/20/2024',
    },
    {
        id: '3',
        name: 'Forest Retreat',
        logo:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDXjWw3u2mkYrZYDXd9z3WVA8YZRTKDDK9LdB3hOnpI8yqrS7U6hwOeDyiFR-Yaa36nZlxK4vsHnlHQQctqAgtY4DDWu0CCWXdkB-FD5Y1Q6hQeHCzdj-fmRwf_3hjeNl0grukQUva1MVIiQ-yRj_UEcCEfJIkWTGzHi6qDnjxDWucdhsbzNZHnKL9pBVqDqnRn8M6lBsj02hJjhfIFrOB5fPjhzxx9syfKxqI-Lx4CXpviWsF_Puv5-v19HCv18dWttRvaaw3GNw',
        owner: 'Noah Thompson',
        contact: 'noah.thompson@email.com',
        city: 'Lake Tahoe',
        status: 'Inactive',
        createdAt: '03/10/2024',
    },
    {
        id: '4',
        name: 'Desert Oasis Resort',
        logo:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAqk_RKrCEXU7k2YKIKc8qWkE5efHNbMmkLdc4tv-KDAI4YFn4npqNmJyVSCewoLeo01hzqECvPJRELq-U_1HnB3a4DOzQrWBqV5pAJtIrCUQTEoJdoF4J1lp80Q6XbW5iyZNBiHVuCvgT-1lnmEIEAKZze2FyNEVP7EEhJa5pNjxXUEpR3BBQXGMdyk_g8i5C_0J-RlWe37kZ5DGjQubUEqmeKqikB1FTv9PzKb9W11qnflhjnvLDcIh6DfPJHMwjNvqb0UAIvUg',
        owner: 'Ava Martinez',
        contact: 'ava.martinez@email.com',
        city: 'Scottsdale',
        status: 'Active',
        createdAt: '04/05/2024',
    },
    {
        id: '5',
        name: 'Coastal Escape',
        logo:
            'https://source.unsplash.com/random/80x80?hotel,sea',
        owner: 'Liam Walker',
        contact: 'liam.walker@example.com',
        city: 'San Diego',
        status: 'Pending',
        createdAt: '04/18/2024',
    },
    {
        id: '6',
        name: 'Skyline Suites',
        logo:
            'https://source.unsplash.com/random/80x80?hotel,city',
        owner: 'Emma Harris',
        contact: 'emma.harris@example.com',
        city: 'New York',
        status: 'Inactive',
        createdAt: '05/02/2024',
    },
    {
        id: '7',
        name: 'Island Paradise',
        logo:
            'https://source.unsplash.com/random/80x80?resort,island',
        owner: 'William Clark',
        contact: 'will.clark@example.com',
        city: 'Honolulu',
        status: 'Active',
        createdAt: '05/25/2024',
    },
    {
        id: '8',
        name: 'Northern Lights Lodge',
        logo:
            'https://source.unsplash.com/random/80x80?hotel,snow',
        owner: 'Sophia Davis',
        contact: 'sophia.davis@example.com',
        city: 'Fairbanks',
        status: 'Pending',
        createdAt: '06/10/2024',
    },
    {
        id: '9',
        name: 'Countryside Inn',
        logo:
            'https://source.unsplash.com/random/80x80?hotel,countryside',
        owner: 'James Brown',
        contact: 'james.brown@example.com',
        city: 'Nashville',
        status: 'Active',
        createdAt: '06/22/2024',
    },
    {
        id: '10',
        name: 'Riverfront Hotel',
        logo:
            'https://source.unsplash.com/random/80x80?hotel,river',
        owner: 'Mia Wilson',
        contact: 'mia.wilson@example.com',
        city: 'Portland',
        status: 'Inactive',
        createdAt: '07/05/2024',
    },
];


export const useResortsStore = create<ResortsStore>((set) => ({
    resorts: mockResorts,
    filter: 'All',
    setFilter: (status) => {
        const filteredResorts = status === 'All' ? mockResorts : mockResorts.filter((r) => r.status === status);
        set({ filter: status, filteredResorts });
    },
    filteredResorts: mockResorts,
}));
