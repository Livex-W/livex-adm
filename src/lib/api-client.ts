import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiError, AuthResponse } from '@/types';
import { ROUTES, BASE_PATH } from '@/routes';
import { tokenService } from './token-service';
import { API_ENDPOINTS } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Pending requests queue during refresh
let isRefreshing = false;
let pendingRequests: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}> = [];

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Skip token for public endpoints
        if (config.headers?.['X-Public'] === 'true') {
            delete config.headers['X-Public'];
            return config;
        }

        const token = tokenService.getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config;

        // Handle 401 - Unauthorized
        if (error.response?.status === 401 && originalRequest) {
            // If the failing request was the refresh endpoint or login endpoint, returns error directly
            if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
                if (originalRequest.url?.includes('/auth/refresh')) {
                    tokenService.clearTokens();
                    if (typeof window !== 'undefined' && !window.location.pathname.includes(ROUTES.AUTH.LOGIN)) {
                        window.location.href = `${BASE_PATH}${ROUTES.AUTH.LOGIN}`;
                    }
                }
                const message = error.response?.data?.message || error.message;
                const errorMessage = Array.isArray(message) ? message[0] : message;
                return Promise.reject(new Error(errorMessage));
            }

            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingRequests.push({
                        resolve: (token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(apiClient(originalRequest));
                        },
                        reject: (err: Error) => reject(err),
                    });
                });
            }

            // Start refresh process
            isRefreshing = true;

            try {
                const refreshToken = tokenService.getRefreshToken();

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                const response = await axios.post<AuthResponse>(
                    `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
                    { refreshToken },
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );

                const { tokens } = response.data;
                const newAccessToken = tokens.accessToken;
                const newRefreshToken = tokens.refreshToken;

                // Save new tokens
                tokenService.setTokens(newAccessToken, newRefreshToken);

                // Process queued requests
                pendingRequests.forEach((req) => req.resolve(newAccessToken));
                pendingRequests = [];

                // Retry original request
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed
                pendingRequests.forEach((req) => req.reject(refreshError as Error));
                pendingRequests = [];
                tokenService.clearTokens();

                if (typeof window !== 'undefined' && !window.location.pathname.includes(ROUTES.AUTH.LOGIN)) {
                    window.location.href = `${BASE_PATH}${ROUTES.AUTH.LOGIN}`;
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Extract error message
        const message = error.response?.data?.message;
        const errorMessage = Array.isArray(message) ? message[0] : message || 'An error occurred';

        return Promise.reject(new Error(errorMessage));
    }
);

// Legacy token management helpers (for backward compatibility)
export const setAccessToken = (token: string, refreshToken?: string): void => {
    if (refreshToken) {
        tokenService.setTokens(token, refreshToken);
    } else {
        // Only access token (legacy)
        tokenService.setTokens(token, '');
    }
};

export const getAccessToken = (): string | null => {
    return tokenService.getAccessToken();
};

export const clearAccessToken = (): void => {
    tokenService.clearTokens();
};

export const isAuthenticated = (): boolean => {
    return tokenService.hasTokens() && !tokenService.isAccessTokenExpired();
};

export default apiClient;
