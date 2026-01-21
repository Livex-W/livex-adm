import { create } from 'zustand';
import apiClient from './api-client';

interface PartnerDashboard {
    totalRevenue: number;
    totalCommissions: number;
    totalUses: number;
    activeCodesCount: number;
    confirmedBookingsCount: number;
    pendingBookingsCount: number;
}

interface ReferralCode {
    id: string;
    code: string;
    codeType: string;
    referralType: string;
    agentCommissionType: string;
    agentCommissionCents: number;
    discountType: string | null;
    discountValue: number;
    isActive: boolean;
    usageCount: number;
    usageLimit: number | null;
    expiresAt: string | null;
    description: string | null;
    createdAt: string;
}

interface ReferralCodeStats {
    code: ReferralCode;
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    totalCommissions: number;
    conversionRate: number;
    firstUse: string | null;
    lastUse: string | null;
}

interface PartnerBooking {
    id: string;
    status: string;
    adults: number;
    children: number;
    totalCents: number;
    currency: string;
    createdAt: string;
    experienceTitle: string;
    experienceId: string;
    resortName: string;
    referralCode: string;
    referralCodeId: string;
    userFullName: string;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface PartnerState {
    // Dashboard
    dashboard: PartnerDashboard | null;
    dashboardLoading: boolean;

    // Referral Codes
    referralCodes: ReferralCode[];
    referralCodesLoading: boolean;
    referralCodesPagination: PaginationMeta | null;

    // Selected Code Stats
    selectedCodeStats: ReferralCodeStats | null;
    selectedCodeStatsLoading: boolean;

    // Bookings
    bookings: PartnerBooking[];
    bookingsLoading: boolean;
    bookingsPagination: PaginationMeta | null;

    // Actions
    fetchDashboard: () => Promise<void>;
    fetchReferralCodes: (params?: { page?: number; limit?: number }) => Promise<void>;
    fetchReferralCodeStats: (codeId: string) => Promise<ReferralCodeStats>;
    fetchBookings: (params?: {
        page?: number;
        limit?: number;
        status?: string;
        codeId?: string;
        startDate?: string;
        endDate?: string;
    }) => Promise<void>;
}

export const usePartnerStore = create<PartnerState>()((set) => ({
    dashboard: null,
    dashboardLoading: false,

    referralCodes: [],
    referralCodesLoading: false,
    referralCodesPagination: null,

    selectedCodeStats: null,
    selectedCodeStatsLoading: false,

    bookings: [],
    bookingsLoading: false,
    bookingsPagination: null,

    fetchDashboard: async () => {
        set({ dashboardLoading: true });
        try {
            const response = await apiClient.get<PartnerDashboard>('/api/v1/partner/dashboard');
            set({ dashboard: response.data, dashboardLoading: false });
        } catch (error) {
            console.error('Error fetching partner dashboard:', error);
            set({ dashboardLoading: false });
            throw error;
        }
    },

    fetchReferralCodes: async (params = {}) => {
        set({ referralCodesLoading: true });
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());

            const response = await apiClient.get<{ data: ReferralCode[]; meta: PaginationMeta }>(
                `/api/v1/partner/referral-codes?${queryParams.toString()}`
            );

            set({
                referralCodes: response.data.data,
                referralCodesPagination: response.data.meta,
                referralCodesLoading: false
            });
        } catch (error) {
            console.error('Error fetching referral codes:', error);
            set({ referralCodesLoading: false });
            throw error;
        }
    },

    fetchReferralCodeStats: async (codeId: string) => {
        set({ selectedCodeStatsLoading: true });
        try {
            const response = await apiClient.get<ReferralCodeStats>(
                `/api/v1/partner/referral-codes/${codeId}/stats`
            );
            set({ selectedCodeStats: response.data, selectedCodeStatsLoading: false });
            return response.data;
        } catch (error) {
            console.error('Error fetching referral code stats:', error);
            set({ selectedCodeStatsLoading: false });
            throw error;
        }
    },

    fetchBookings: async (params = {}) => {
        set({ bookingsLoading: true });
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.status) queryParams.append('status', params.status);
            if (params.codeId) queryParams.append('code_id', params.codeId);
            if (params.startDate) queryParams.append('start_date', params.startDate);
            if (params.endDate) queryParams.append('end_date', params.endDate);

            const response = await apiClient.get<{ data: PartnerBooking[]; meta: PaginationMeta }>(
                `/api/v1/partner/bookings?${queryParams.toString()}`
            );

            set({
                bookings: response.data.data,
                bookingsPagination: response.data.meta,
                bookingsLoading: false
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
            set({ bookingsLoading: false });
            throw error;
        }
    },
}));
