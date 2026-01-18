import { create } from 'zustand';
import { Booking } from '@/types';
import apiClient from './api-client';

export interface CreateResortBookingDto {
    slotId: string;
    experienceId: string;
    adults: number;
    children: number;
    clientUserId?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
}

interface ResortBookingState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
    createdBooking: Booking | null;

    createBooking: (dto: CreateResortBookingDto) => Promise<Booking>;
    reset: () => void;
}

export const useResortBookingStore = create<ResortBookingState>((set) => ({
    isLoading: false,
    error: null,
    success: false,
    createdBooking: null,

    createBooking: async (dto: CreateResortBookingDto) => {
        set({ isLoading: true, error: null, success: false });
        try {
            const response = await apiClient.post<Booking>('/api/v1/bookings/resort', dto);
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
