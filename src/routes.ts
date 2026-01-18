/**
 * Centralized route definitions for the application.
 * Use these constants instead of hardcoded strings.
 */

export const BASE_PATH = '/adm';

export const ROUTES = {
    // Authentication Pages
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
    },

    // Dashboard Pages (Admin)
    DASHBOARD: {
        HOME: '/',
        RESORTS: {
            LIST: '/resorts',
            DETAIL: (id: string) => `/resorts/${id}`,
        },
        BOOKINGS: '/bookings',
        CALENDAR: '/calendar',
        EXPERIENCES: {
            LIST: '/experiences',
            NEW: '/experiences/new',
        },
        AGENTS: {
            LIST: '/agents',
            NEW: '/agents/new',
        },
        USERS: '/users',
        FINANCES: '/finances',
        REVIEWS: '/reviews',
        SETTINGS: '/settings',
    },
} as const;

/**
 * Helper to check if a path matches a route, useful for active state in navigation
 */
export const isRouteActive = (currentPath: string, route: string): boolean => {
    // Exact match for home routes to avoid false positives with child routes
    if (route === ROUTES.DASHBOARD.HOME) {
        return currentPath === route;
    }
    return currentPath.startsWith(route);
};
