import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ResortProfile, Booking, PaginatedResult } from '@/types';
import { ExperienceListItem } from './useExperience';

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

export interface AdminAgent {
    id: string;
    email: string;
    full_name: string;
    is_active?: boolean;
    avatar?: string;
    phone?: string;
    document_type?: string;
    document_number?: string;
    created_at: string;
    resort_count: number;
    booking_count: number;
    total_commission_cents: number;
}

interface Partner {
    id: string;
    email: string;
    full_name: string;
    is_active?: boolean;
    phone: string | null;
    created_at: string;
    codes_count: number;
    total_revenue_cents: number;
}

interface PartnerReferralCode {
    id: string;
    code: string;
    code_type: string;
    agent_commission_type: string;
    agent_commission_cents: number;
    discount_type: string | null;
    discount_value: number;
    is_active: boolean;
    usage_count: number;
    usage_limit: number | null;
    expires_at: string | null;
    description: string | null;
    created_at: string;
    revenue_cents: number;
    bookings_count: number;
}

interface PartnerDetail {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    created_at: string;
    referralCodes: PartnerReferralCode[];
    stats: {
        total_revenue: number;
        total_bookings: number;
        confirmed_bookings: number;
    };
}

interface CreatePartnerData {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
}

interface CreatePartnerCodeData {
    code: string;
    commissionType: 'percentage' | 'fixed';
    commissionValue: number;
    discountType?: 'percentage' | 'fixed' | 'none';
    discountValue?: number;
    description?: string;
}

export interface BookingDetail {
    id: string;
    code?: string;
    adults: number;
    children: number;
    total_cents: number;
    resort_net_cents: number;
    agent_commission_cents: number;
    agent_payment_type: string;
    amount_paid_to_agent_cents: number;
    amount_paid_to_resort_cents: number;
    currency: string;
    status: string;
    booking_source: string;
    created_at: string;
    experience_title: string;
    experience_description?: string;
    experience_category?: string;
    experience_image?: string;
    resort_id: string;
    resort_name: string;
    resort_city?: string;
    resort_phone?: string;
    slot_start_time: string;
    slot_end_time: string;
    slot_capacity?: number;
    client_name: string;
    client_email: string;
    client_phone: string;
    agent_name?: string;
    agent_email?: string;
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
    bookingDetail: (id: string) => [...adminQueryKeys.bookings(), 'detail', id] as const,
    experiences: () => [...adminQueryKeys.all, 'experiences'] as const,
    experiencesList: (params: QueryParams) => [...adminQueryKeys.experiences(), 'list', params] as const,
    agents: () => [...adminQueryKeys.all, 'agents'] as const,
    agentsList: (params: QueryParams) => [...adminQueryKeys.agents(), 'list', params] as const,
    partners: () => [...adminQueryKeys.all, 'partners'] as const,
    partnersList: (params: QueryParams) => [...adminQueryKeys.partners(), 'list', params] as const,
    partnerDetail: (id: string) => [...adminQueryKeys.partners(), 'detail', id] as const,
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

async function fetchAdminExperiences(params: QueryParams): Promise<PaginatedResult<ExperienceListItem>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResult<ExperienceListItem>>(
        `/api/v1/experiences/management?${queryParams.toString()}`
    );
    return response.data;
}

async function fetchAdminAgents(params: QueryParams): Promise<PaginatedResult<AdminAgent>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResult<AdminAgent>>(
        `/api/v1/admin/agents?${queryParams.toString()}`
    );
    return response.data;
}

async function fetchAdminPartners(params: QueryParams): Promise<PaginatedResult<Partner>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResult<Partner>>(
        `/api/v1/admin/partners?${queryParams.toString()}`
    );
    return response.data;
}

async function fetchPartnerById(id: string): Promise<PartnerDetail> {
    const response = await apiClient.get<PartnerDetail>(`/api/v1/admin/partners/${id}`);
    return response.data;
}

async function fetchBookingById(id: string): Promise<BookingDetail> {
    const response = await apiClient.get<BookingDetail>(`/api/v1/admin/bookings/${id}`);
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

async function createPartner(data: CreatePartnerData): Promise<Partner> {
    const response = await apiClient.post<Partner>('/api/v1/admin/partners', data);
    return response.data;
}

async function createPartnerCode(partnerId: string, data: CreatePartnerCodeData): Promise<PartnerReferralCode> {
    const response = await apiClient.post<PartnerReferralCode>(
        `/api/v1/admin/partners/${partnerId}/referral-codes`,
        data
    );
    return response.data;
}

async function deactivateUser(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/admin/users/${id}`);
}

// Hooks

/**
 * Hook for admin dashboard stats - cached for 5 minutes
 */
export function useAdminStats() {
    return useQuery({
        queryKey: adminQueryKeys.stats(),
        queryFn: fetchAdminStats,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

/**
 * Hook for admin resorts list with filtering - cached for 2 minutes
 */
export function useAdminResorts(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.resortsList(params),
        queryFn: () => fetchAdminResorts(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

/**
 * Hook for admin bookings list with filtering - cached for 2 minutes
 */
export function useAdminBookings(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.bookingsList(params),
        queryFn: () => fetchAdminBookings(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

/**
 * Hook for single booking detail - cached for 5 minutes
 */
export function useAdminBookingDetail(id: string) {
    return useQuery({
        queryKey: adminQueryKeys.bookingDetail(id),
        queryFn: () => fetchBookingById(id),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!id,
    });
}

/**
 * Hook for admin experiences list with filtering - cached for 2 minutes
 */
export function useAdminExperiences(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.experiencesList(params),
        queryFn: () => fetchAdminExperiences(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

/**
 * Hook for admin agents list with filtering - cached for 2 minutes
 */
export function useAdminAgents(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.agentsList(params),
        queryFn: () => fetchAdminAgents(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

/**
 * Hook for admin partners list with filtering - cached for 2 minutes
 */
export function useAdminPartners(params: QueryParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.partnersList(params),
        queryFn: () => fetchAdminPartners(params),
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

/**
 * Hook for single partner detail - cached for 5 minutes
 */
export function usePartnerDetail(id: string) {
    return useQuery({
        queryKey: adminQueryKeys.partnerDetail(id),
        queryFn: () => fetchPartnerById(id),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!id,
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
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.stats() });
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.resorts() });
        },
    });
}

/**
 * Hook for creating a partner
 */
export function useCreatePartner() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePartnerData) => createPartner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.partners() });
        },
    });
}

/**
 * Hook for creating a partner referral code
 */
export function useCreatePartnerCode(partnerId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePartnerCodeData) => createPartnerCode(partnerId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.partnerDetail(partnerId) });
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.partners() });
        },
    });
}

/**
 * Hook for deactivating a user (agent, partner, etc.)
 */
export function useDeactivateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deactivateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.agents() });
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.partners() });
            queryClient.invalidateQueries({ queryKey: adminQueryKeys.resorts() });
        },
    });
}
