import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ResortProfile, Experience, Booking, PaginatedResult } from '@/types';

// Types
interface AdminStats {
    totalResorts: number;
    resortsApproved: number;
    resortsPending: number;
    resortsUnderReview: number;
    resortsRejected: number;
    resortsDraft: number;
    totalExperiences: number;
    totalBookings: number;
    totalAgents: number;
}

interface QueryParams {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

interface Agent {
    id: string;
    email: string;
    full_name: string;
    avatar?: string;
    phone?: string;
    document_type?: string;
    document_number?: string;
    created_at: string;
    resort_count: number;
    booking_count: number;
    total_commission_cents: number;
}

// Query Keys
export const adminQueryKeys = {
    all: ['admin'] as const,
    stats: () => [...adminQueryKeys.all, 'stats'] as const,
    resorts: () => [...adminQueryKeys.all, 'resorts'] as const,
    resortsList: (params: QueryParams) => [...adminQueryKeys.resorts(), 'list', params] as const,
    resortDetail: (id: string) => [...adminQueryKeys.resorts(), 'detail', id] as const,
    bookings: () => [...adminQueryKeys.all, 'bookings'] as const,
    bookingsList: (params: QueryParams) => [...adminQueryKeys.bookings(), 'list', params] as const,
    experiences: () => [...adminQueryKeys.all, 'experiences'] as const,
    experiencesList: (params: QueryParams) => [...adminQueryKeys.experiences(), 'list', params] as const,
    agents: () => [...adminQueryKeys.all, 'agents'] as const,
    agentsList: (params: QueryParams) => [...adminQueryKeys.agents(), 'list', params] as const,
};

// API Functions
async function fetchAdminStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>('/api/v1/admin/stats');
    return response.data;
}

async function fetchAdminResorts(params: QueryParams): Promise<PaginatedResult<ResortProfile>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResult<ResortProfile>>(
        `/api/v1/admin/resorts?${queryParams.toString()}`
    );
    return response.data;
}

async function fetchAdminBookings(params: QueryParams): Promise<PaginatedResult<Booking>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResult<Booking>>(
        `/api/v1/admin/bookings?${queryParams.toString()}`
    );
    return response.data;
}

async function fetchAdminExperiences(params: QueryParams): Promise<PaginatedResult<Experience>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResult<Experience>>(
        `/api/v1/experiences/management?${queryParams.toString()}`
    );
    return response.data;
}

async function fetchAdminAgents(params: QueryParams): Promise<PaginatedResult<Agent>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResult<Agent>>(
        `/api/v1/admin/agents?${queryParams.toString()}`
    );
    return response.data;
}

async function fetchResortById(id: string): Promise<ResortProfile> {
    const response = await apiClient.get<ResortProfile>(`/api/v1/admin/resorts/${id}`);
    return response.data;
}

async function approveResort(id: string): Promise<void> {
    await apiClient.post(`/api/v1/admin/resorts/${id}/approve`, {});
}

async function rejectResort(id: string, reason: string): Promise<void> {
    await apiClient.post(`/api/v1/admin/resorts/${id}/reject`, { rejection_reason: reason });
}

// Hooks

/**
 * Hook for admin dashboard stats - cached for 5 minutes
 */
export function useAdminStats() {
    return useQuery({
        queryKey: adminQueryKeys.stats(),
        queryFn: fetchAdminStats,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook for admin resorts list with filtering - cached for 2 minutes
 */
export function useAdminResorts(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.resortsList(params),
        queryFn: () => fetchAdminResorts(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook for admin bookings list with filtering - cached for 2 minutes
 */
export function useAdminBookings(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.bookingsList(params),
        queryFn: () => fetchAdminBookings(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook for admin experiences list with filtering - cached for 2 minutes
 */
export function useAdminExperiences(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.experiencesList(params),
        queryFn: () => fetchAdminExperiences(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook for admin agents list with filtering - cached for 2 minutes
 */
export function useAdminAgents(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.agentsList(params),
        queryFn: () => fetchAdminAgents(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook for single resort detail - cached for 5 minutes
 */
export function useResortDetail(id: string) {
    return useQuery({
        queryKey: adminQueryKeys.resortDetail(id),
        queryFn: () => fetchResortById(id),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!id,
    });
}

/**
 * Hook for approving a resort
 */
export function useApproveResort() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => approveResort(id),
        onSuccess: () => {
            // Invalidate relevant queries to refetch
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.resorts() });
        },
    });
}

/**
 * Hook for rejecting a resort
 */
export function useRejectResort() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectResort(id, reason),
        onSuccess: () => {
            // Invalidate relevant queries to refetch
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.resorts() });
        },
    });
}
