import { create } from 'zustand';
import apiClient from './api-client';
import { Agent, CreateAgentDto, PaginatedResult } from '@/types';

interface AgentsState {
    agents: Agent[];
    isLoading: boolean;
    error: string | null;
    fetchAgents: (resortId: string) => Promise<void>;
    createAgent: (dto: CreateAgentDto) => Promise<Agent>;
    createAgreement: (resortId: string, userId: string, commissionBps: number, commissionFixedCents?: number) => Promise<Agent>;
    updateCommission: (resortId: string, userId: string, commissionBps: number) => Promise<void>;
    searchUnassignedAgents: (resortId: string, search: string, page?: number, limit?: number) => Promise<PaginatedResult<{ id: string, email: string, full_name: string, avatar?: string }>>;
    clearAgents: () => void;
}

export const useAgentsStore = create<AgentsState>()((set) => ({
    agents: [],
    isLoading: false,
    error: null,

    fetchAgents: async (resortId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get<Agent[]>(`/api/v1/agents/resorts/${resortId}`);
            set({ agents: response.data, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar agentes';
            set({ error: errorMessage, isLoading: false });
        }
    },

    createAgent: async (dto: CreateAgentDto) => {
        const response = await apiClient.post<Agent>('/api/v1/agents', dto);
        return response.data;
    },

    createAgreement: async (resortId: string, userId: string, commissionBps: number, commissionFixedCents?: number) => {
        const response = await apiClient.post<Agent>(`/api/v1/agents/resorts/${resortId}`, {
            userId,
            commissionBps,
            commissionFixedCents
        });
        return response.data;
    },

    searchUnassignedAgents: async (resortId: string, search: string, page = 1, limit = 10) => {
        const response = await apiClient.get<PaginatedResult<{ id: string, email: string, full_name: string, avatar?: string }>>(
            '/api/v1/agents/search-unassigned',
            { params: { resortId, search, page, limit } }
        );
        return response.data;
    },

    updateCommission: async (resortId: string, userId: string, commissionBps: number) => {
        await apiClient.patch(`/api/v1/agents/resorts/${resortId}/users/${userId}`, {
            commissionBps,
        });
        // Update local state
        set((state) => ({
            agents: state.agents.map((agent) =>
                agent.user_id === userId ? { ...agent, commission_bps: commissionBps } : agent
            ),
        }));
    },

    clearAgents: () => set({ agents: [], error: null }),
}));
