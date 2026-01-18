import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from './api-client';
import { STORAGE_KEYS } from './constants';
import { security } from '@/utils/security';

export interface BusinessDocument {
    id: string;
    doc_type: 'camara_comercio' | 'rut_nit' | 'rnt' | 'other';
    file_url: string;
    status: 'uploaded' | 'under_review' | 'approved' | 'rejected';
    rejection_reason?: string;
    reviewed_at?: string;
    uploaded_at: string;
}

export interface AgentProfile {
    user_id: string;
    business_profile_id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    nit?: string;
    rnt?: string;
    business_status?: 'draft' | 'under_review' | 'approved' | 'rejected';
    documents?: BusinessDocument[];
}

export interface AgentStats {
    total_sales: number;
    total_earnings_cents: number;
    pending_earnings_cents: number;
    paid_earnings_cents: number;
}

export interface AgentCommission {
    id: string;
    agent_id: string;
    booking_id: string;
    resort_id: string;
    resort_name: string;
    amount_cents: number;
    booking_total_cents: number;
    status: 'pending' | 'paid' | 'cancelled';
    created_at: string;
}

export interface ReferralCode {
    id: string;
    owner_user_id: string;
    code: string;
    code_type: 'discount' | 'commission' | 'both';
    discount_type?: 'percentage' | 'fixed';
    discount_value: number;
    commission_override_bps?: number;
    usage_count: number;
    usage_limit?: number;
    is_active: boolean;
    expires_at?: string;
    description?: string;
    created_at: string;
}

interface AgentProfileState {
    profile: AgentProfile | null;
    stats: AgentStats | null;
    commissions: AgentCommission[];
    referralCodes: ReferralCode[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchAgentProfile: () => Promise<void>;
    fetchAgentStats: () => Promise<void>;
    fetchCommissions: () => Promise<void>;
    fetchReferralCodes: () => Promise<void>;
    updateProfile: (data: Partial<AgentProfile>) => Promise<void>;
    clearAgent: () => void;
}

export const useAgentProfileStore = create<AgentProfileState>()(
    persist(
        (set, get) => ({
            profile: null,
            stats: null,
            commissions: [],
            referralCodes: [],
            isLoading: false,
            error: null,

            fetchAgentProfile: async () => {
                set({ isLoading: true, error: null });
                try {
                    const response = await apiClient.get<AgentProfile>('/api/v1/agents/profile');
                    set({ profile: response.data, isLoading: false });
                } catch (error) {
                    // Profile may not exist yet, that's okay
                    set({ profile: null, isLoading: false });
                }
            },

            fetchAgentStats: async () => {
                try {
                    const response = await apiClient.get<AgentStats>('/api/v1/agents/stats');
                    set({ stats: response.data });
                } catch (error) {
                    console.error('Failed to fetch agent stats:', error);
                }
            },

            fetchCommissions: async () => {
                set({ isLoading: true });
                try {
                    const response = await apiClient.get<AgentCommission[]>('/api/v1/agents/commissions');
                    set({ commissions: response.data, isLoading: false });
                } catch (error) {
                    set({ error: 'Error al cargar comisiones', isLoading: false });
                }
            },

            fetchReferralCodes: async () => {
                set({ isLoading: true });
                try {
                    const response = await apiClient.get<ReferralCode[]>('/api/v1/agents/referral-codes');
                    set({ referralCodes: response.data, isLoading: false });
                } catch (error) {
                    set({ error: 'Error al cargar códigos', isLoading: false });
                }
            },

            updateProfile: async (data: Partial<AgentProfile>) => {
                try {
                    const response = await apiClient.post<AgentProfile>('/api/v1/agents/profile', data);
                    set({ profile: response.data });
                } catch (error) {
                    throw error;
                }
            },

            clearAgent: () => set({
                profile: null,
                stats: null,
                commissions: [],
                referralCodes: [],
                error: null,
            }),
        }),
        {
            name: security.IllegibleName(STORAGE_KEYS.AGENT_STORAGE || 'agent-storage'),
            partialize: (state) => security.AES.encrypt({
                profile: state.profile,
                stats: state.stats,
            }),
        }
    )
);
