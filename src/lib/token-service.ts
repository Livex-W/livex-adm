import { secureLocalStorage } from '@/utils/secure-storage';
import { STORAGE_KEYS } from './constants';

interface TokenPayload {
    sub: string;
    email: string;
    role: string;
    exp: number;
    iat: number;
}

/**
 * Token Service
 * Manages access and refresh tokens with secure storage
 */
class TokenService {
    private refreshPromise: Promise<boolean> | null = null;

    /**
     * Save both tokens to secure storage
     */
    setTokens(accessToken: string, refreshToken: string): void {
        secureLocalStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        secureLocalStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }

    /**
     * Get access token from secure storage
     */
    getAccessToken(): string | null {
        return secureLocalStorage.getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
    }

    /**
     * Get refresh token from secure storage
     */
    getRefreshToken(): string | null {
        return secureLocalStorage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
    }

    /**
     * Clear all tokens from secure storage
     */
    clearTokens(): void {
        secureLocalStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        secureLocalStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    /**
     * Check if tokens exist
     */
    hasTokens(): boolean {
        return secureLocalStorage.hasItem(STORAGE_KEYS.ACCESS_TOKEN) && secureLocalStorage.hasItem(STORAGE_KEYS.REFRESH_TOKEN);
    }

    /**
     * Decode JWT payload (without verification)
     */
    decodeToken(token: string): TokenPayload | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload) as TokenPayload;
        } catch {
            return null;
        }
    }

    /**
     * Check if access token is expired
     */
    isAccessTokenExpired(): boolean {
        const token = this.getAccessToken();
        if (!token) return true;

        const payload = this.decodeToken(token);
        if (!payload) return true;

        // Token expired if exp time is in the past
        return payload.exp * 1000 < Date.now();
    }

    /**
     * Check if token should be refreshed (expires in less than 5 minutes)
     */
    shouldRefresh(): boolean {
        const token = this.getAccessToken();
        if (!token) return false;

        const payload = this.decodeToken(token);
        if (!payload) return false;

        const expiresIn = payload.exp * 1000 - Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        return expiresIn < fiveMinutes && expiresIn > 0;
    }

    /**
     * Get current refresh promise to avoid multiple simultaneous refreshes
     */
    getRefreshPromise(): Promise<boolean> | null {
        return this.refreshPromise;
    }

    /**
     * Set current refresh promise
     */
    setRefreshPromise(promise: Promise<boolean> | null): void {
        this.refreshPromise = promise;
    }
}

export const tokenService = new TokenService();
