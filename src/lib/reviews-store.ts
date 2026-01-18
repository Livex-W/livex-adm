import { create } from 'zustand';
import apiClient from './api-client';

export interface ResortReview {
    id: string;
    experience_id: string;
    user_id: string | null;
    booking_id: string | null;
    rating: number;
    comment: string | null;
    created_at: string;
    user_full_name: string | null;
    user_avatar: string | null;
    experience_title: string;
}

export interface ReviewStats {
    average_rating: number;
    total_reviews: number;
    reviews_this_month: number;
}

interface ReviewsState {
    reviews: ResortReview[];
    stats: ReviewStats | null;
    isLoading: boolean;
    error: string | null;
    fetchReviews: (resortId: string) => Promise<void>;
    clearReviews: () => void;
}

export const useReviewsStore = create<ReviewsState>()((set) => ({
    reviews: [],
    stats: null,
    isLoading: false,
    error: null,

    fetchReviews: async (resortId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get<{
                reviews: ResortReview[];
                stats: ReviewStats;
            }>(`/api/v1/resorts/${resortId}/reviews`);
            set({
                reviews: response.data.reviews,
                stats: response.data.stats,
                isLoading: false,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar reseñas';
            set({ error: errorMessage, isLoading: false });
        }
    },

    clearReviews: () => set({ reviews: [], stats: null, error: null }),
}));
