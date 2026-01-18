import { create } from 'zustand';
import { CreateAgentBookingDto, Booking } from '@/types';
import apiClient from './api-client';

interface AgentBookingState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    createdBooking: Booking | null;

    createBooking: (dto: CreateAgentBookingDto) => Promise<Booking>;
    reset: () => void;
}

export const useAgentBookingStore = create<AgentBookingState>((set) => ({
    isLoading: false,
    error: null,
    success: false,
    createdBooking: null,

    createBooking: async (dto: CreateAgentBookingDto) => {
        set({ isLoading: true, error: null, success: false });
        try {
            const response = await apiClient.post<Booking>('/api/v1/bookings/agent', dto);
            set({
                isLoading: false,
                success: true,
                createdBooking: response.data
            });
            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al crear la reserva';
            set({
                isLoading: false,
                error: errorMessage,
                success: false
            });
            throw error;
        }
    },

    reset: () => set({
        isLoading: false,
        error: null,
        success: false,
        createdBooking: null
    })
}));
