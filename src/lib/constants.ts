export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'livex_access_token',
    REFRESH_TOKEN: 'livex_refresh_token',
    AUTH_STORAGE: 'livex-auth-storage',
    RESORT_STORAGE: 'livex-resort-storage',
    AGENT_STORAGE: 'livex-agent-storage',
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
        LOGOUT: '/api/v1/auth/logout',
        REFRESH: '/api/v1/auth/refresh',
        PASSWORD_REQUEST_RESET: '/api/v1/auth/password/request-reset',
        PASSWORD_RESET: '/api/v1/auth/password/reset',
    },
    USER: '/api/v1/user',
} as const;
