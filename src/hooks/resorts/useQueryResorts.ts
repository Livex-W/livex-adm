import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResortsRepository } from '@/repositories/ResortsRepository';
import { useResortsStore } from '@/stores/useResortsStore';
import { Resort } from '@/types/resort';

/**
 * Hook – carga los resorts desde ResortsRepository y actualiza el Zustand store.
 * Devuelve flags de carga/error para controlar UI.
 */
export function useQueryResorts() {
    const setResorts = useResortsStore((s) => s.setResorts);
    const repo = new ResortsRepository();

    const query = useQuery<Resort[], Error>({
        queryKey: ['resorts'],
        queryFn: () => repo.getResorts(),
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (query.data) {
            setResorts(query.data);
        }
    }, [query.data, setResorts]);

    return { isLoading: query.isPending, error: query.error } as const;
}
