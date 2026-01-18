// Custom error types for the application

/**
 * Base error interface for API errors
 */
export interface ApiError extends Error {
    message: string;
    statusCode?: number;
}

/**
 * Authentication-specific error
 */
export interface AuthError extends Error {
    message: string;
    statusCode?: number;
    code?: 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'EMAIL_EXISTS' | 'WEAK_PASSWORD' | 'SESSION_EXPIRED';
}

/**
 * Form validation error
 */
export interface ValidationError extends Error {
    message: string;
    field?: string;
    errors?: Record<string, string[]>;
}

/**
 * Network/Connection error
 */
export interface NetworkError extends Error {
    message: string;
    isTimeout?: boolean;
    isOffline?: boolean;
}

/**
 * Type guard to check if error is an AuthError
 */
export function isAuthError(error: Error): error is AuthError {
    return 'message' in error;
}

/**
 * Type guard to check if error is an ApiError
 */
export function isApiError(error: Error): error is ApiError {
    return 'message' in error && ('statusCode' in error || error instanceof Error);
}

/**
 * Extract error message from various error types
 */
export function getErrorMessage(error: Error): string {
    if (isAuthError(error)) {
        return error.message;
    }
    if (isApiError(error)) {
        return error.message;
    }
    return 'Ha ocurrido un error inesperado';
}
