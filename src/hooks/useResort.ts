import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { useResortStore } from '@/lib/resort-store';
import { ResortProfile } from '@/types';

const RESORT_QUERY_KEY = ['my-resort'] as const;

async function fetchMyResort(): Promise<ResortProfile | null> {
    try {
        const response = await apiClient.get<ResortProfile>('/api/v1/resorts/my-resort');
        return response.data;
    } catch (error) {
        return null;
    }
}

export function useMyResort() {
    const { resort, setResort } = useResortStore();

    const query = useQuery({
        queryKey: RESORT_QUERY_KEY,
        queryFn: fetchMyResort,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
        enabled: !resort, // Only fetch if not already in store
    });

    // Sync query result to store
    useEffect(() => {
        if (query.data && !resort) {
            setResort(query.data);
        }
    }, [query.data, resort, setResort]);

    return {
        resort: resort || query.data,
        resortId: resort?.id || query.data?.id || null,
        isLoading: query.isLoading && !resort,
        error: query.error,
        refetch: query.refetch,
    };
}
