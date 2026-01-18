import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginDto, RegisterDto, AuthResponse } from '@/types';
import apiClient from './api-client';
import { tokenService } from './token-service';
import { ROUTES, BASE_PATH } from '@/routes';
import { useResortStore } from './resort-store';
import { useAgentProfileStore } from './agent-profile-store';
import { STORAGE_KEYS, API_ENDPOINTS } from './constants';
import { security } from '@/utils/security';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginDto) => Promise<User>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: tokenService.hasTokens(),

            login: async (credentials: LoginDto) => {
                set({ isLoading: true });
                try {
                    const response = await apiClient.post<AuthResponse>(
                        API_ENDPOINTS.AUTH.LOGIN,
                        credentials
                    );
                    const { tokens, user } = response.data;

                    // Save both tokens securely
                    tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
                    set({ user, isLoading: false });

                    // Load profile data in background (non-blocking)
                    if (user.role === 'agent') {
                        useAgentProfileStore.getState().fetchAgentProfile();
                        useAgentProfileStore.getState().fetchAgentStats();
                    } else if (user.role === 'resort') {
                        useResortStore.getState().fetchMyResort();
                    }

                    return user;
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (data: RegisterDto) => {
                set({ isLoading: true });
                try {
                    // Force role to 'resort' for this portal
                    const registerData = { ...data, role: 'resort' as const };
                    const response = await apiClient.post<AuthResponse>(
                        API_ENDPOINTS.AUTH.REGISTER,
                        registerData
                    );
                    const { tokens, user } = response.data;

                    // Save both tokens securely
                    tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
                    set({ user, isLoading: false });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                // Clear tokens from secure storage
                tokenService.clearTokens();
                useResortStore.getState().clearResort();
                useAgentProfileStore.getState().clearAgent();
                set({ user: null, isLoading: false });
                window.location.href = `${BASE_PATH}${ROUTES.AUTH.LOGIN}`;
            },

            refreshUser: async () => {
                set({ isLoading: true });
                try {
                    const response = await apiClient.get<User>(API_ENDPOINTS.USER);
                    set({ user: response.data, isLoading: false });
                } catch (error) {
                    // Don't logout immediately on error, let the interceptor handle 401s
                    console.error('Failed to refresh user:', error);
                    set({ isLoading: false });
                }
            },

            requestPasswordReset: async (email: string) => {
                await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_REQUEST_RESET, { email });
            },

            resetPassword: async (token: string, password: string) => {
                await apiClient.post(API_ENDPOINTS.AUTH.PASSWORD_RESET, { token, password });
            },

            checkAuth: async () => {
                // Check if we have valid tokens
                if (!tokenService.hasTokens()) {
                    set({ user: null, isLoading: false });
                    return false;
                }

                // If token is expired, try to refresh
                if (tokenService.isAccessTokenExpired()) {
                    const refreshToken = tokenService.getRefreshToken();
                    if (!refreshToken) {
                        tokenService.clearTokens();
                        set({ user: null, isLoading: false });
                        return false;
                    }

                    try {
                        // Trigger a request to force token refresh via interceptor
                        await get().refreshUser();
                        return get().user !== null;
                    } catch {
                        tokenService.clearTokens();
                        set({ user: null, isLoading: false });
                        return false;
                    }
                }

                // Token is valid, refresh user data if needed
                if (!get().user) {
                    await get().refreshUser();
                } else {
                    set({ isLoading: false });
                }

                return get().user !== null;
            },
        }),
        {
            name: security.IllegibleName(STORAGE_KEYS.AUTH_STORAGE),
            partialize: (state) => security.AES.encrypt(({ user: state.user })), // Only persist user object
        }
    )
);
