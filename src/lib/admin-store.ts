import { create } from 'zustand';
import { ResortProfile, Experience, Booking, PaginatedResult } from '@/types';
import apiClient from './api-client';

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

interface AdminState {
    // Stats
    stats: AdminStats | null;
    statsLoading: boolean;

    // Resorts
    resorts: ResortProfile[];
    resortsLoading: boolean;
    resortsPagination: { page: number; limit: number; total: number; total_pages: number } | null;

    // Experiences
    experiences: Experience[];
    experiencesLoading: boolean;

    // Bookings
    bookings: Booking[];
    bookingsLoading: boolean;

    // Actions
    fetchStats: () => Promise<AdminStats>;
    fetchResorts: (params?: { page?: number; limit?: number; status?: string; search?: string }) => Promise<void>;
    fetchResortById: (id: string) => Promise<ResortProfile>;
    approveResort: (id: string) => Promise<void>;
    rejectResort: (id: string, reason: string) => Promise<void>;
    fetchExperiences: (params?: { page?: number; limit?: number; resortId?: string }) => Promise<void>;
    fetchBookings: (params?: { page?: number; limit?: number; resortId?: string }) => Promise<void>;
}

export const useAdminStore = create<AdminState>()((set) => ({
    stats: null,
    statsLoading: false,

    resorts: [],
    resortsLoading: false,
    resortsPagination: null,

    experiences: [],
    experiencesLoading: false,

    bookings: [],
    bookingsLoading: false,

    fetchStats: async () => {
        set({ statsLoading: true });
        try {
            const response = await apiClient.get<AdminStats>('/api/v1/admin/stats');
            set({ stats: response.data, statsLoading: false });
            return response.data;
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            set({ statsLoading: false });
            throw error;
        }
    },

    fetchResorts: async (params = {}) => {
        set({ resortsLoading: true });
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.status) queryParams.append('status', params.status);
            if (params.search) queryParams.append('search', params.search);

            const response = await apiClient.get<PaginatedResult<ResortProfile>>(
                `/api/v1/admin/resorts?${queryParams.toString()}`
            );

            // Map backend camelCase to frontend snake_case for consistency
            const meta = response.data.meta as { total: number; page: number; limit: number; totalPages?: number; total_pages?: number };

            set({
                resorts: response.data.data,
                resortsPagination: {
                    page: meta.page,
                    limit: meta.limit,
                    total: meta.total,
                    total_pages: meta.totalPages || meta.total_pages || 1
                },
                resortsLoading: false
            });
        } catch (error) {
            console.error('Error fetching resorts:', error);
            set({ resortsLoading: false });
            throw error;
        }
    },

    fetchResortById: async (id: string) => {
        const response = await apiClient.get<ResortProfile>(`/api/v1/resorts/${id}`);
        return response.data;
    },

    approveResort: async (id: string) => {
        await apiClient.post(`/api/v1/resorts/${id}/approve`, {});
    },

    rejectResort: async (id: string, reason: string) => {
        await apiClient.post(`/api/v1/resorts/${id}/reject`, { rejection_reason: reason });
    },

    fetchExperiences: async (params = {}) => {
        set({ experiencesLoading: true });
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.resortId) queryParams.append('resort_id', params.resortId);

            const response = await apiClient.get<PaginatedResult<Experience>>(
                `/api/v1/experiences/management?${queryParams.toString()}`
            );

            set({
                experiences: response.data.data,
                experiencesLoading: false
            });
        } catch (error) {
            console.error('Error fetching experiences:', error);
            set({ experiencesLoading: false });
            throw error;
        }
    },

    fetchBookings: async (params = {}) => {
        set({ bookingsLoading: true });
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.resortId) queryParams.append('resort_id', params.resortId);

            // Using resort bookings endpoint - admin should have access to all
            const response = await apiClient.get<PaginatedResult<Booking>>(
                `/api/v1/bookings/resort?${queryParams.toString()}`
            );

            set({
                bookings: response.data.data,
                bookingsLoading: false
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            set({ bookingsLoading: false });
            throw error;
        }
    },
}));
