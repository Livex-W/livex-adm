/* ============================================================================
 * user.mock.ts – Datos simulados de usuario y preferencias
 * (solo data, sin clases ni funciones)
 * ==========================================================================*/

/* ============================================================================
 * profile.interfaces.ts – Definición de modelos de usuario y preferencias
 * ==========================================================================*/

/** Información básica y estado del usuario en la plataforma */
export interface UserModel {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    /** Contraseña almacenada (hashed en producción). Opcional para mocks sin auth. */
    password?: string;
    /** Ruta/URL al avatar o foto de perfil */
    profilePicture?: string;
    phoneNumber: string;
    dateOfBirth: Date;
    nationality: string;
    /** Código ISO-639-1: “es”, “en”, etc. */
    language: string;
    isVerified: boolean;
    isVip: boolean;
    createdAt: Date;
    lastLogin: Date;
}

/** Preferencias de precios y filtros generales del usuario */
export interface UserPreferencesModel {
    preferenceId: string;
    userId: string;
    /** Precio mínimo aceptado por el usuario (en la moneda local) */
    minPrice: number;
    /** Precio máximo aceptado por el usuario */
    maxPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

/** Categorías favoritas seleccionadas por el usuario */
export interface UserPreferredCategoryModel {
    userId: string;
    /** Nombre legible de la categoría (ej. “Beach”, “Culture”) */
    categoryName: string;
}

/** Ubicaciones guardadas o de interés para el usuario */
export interface UserFavoriteLocationModel {
    userId: string;
    /** Ej. “Cartagena, Colombia” */
    locationName: string;
}

/** Perfil completo que agrupa toda la información del usuario */
export interface UserProfileModel {
    user: UserModel;
    preferences: UserPreferencesModel;
    preferredCategories: UserPreferredCategoryModel[];
    favoriteLocations: UserFavoriteLocationModel[];
}


/* Helpers ----------------------------------------------------------------- */
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000);
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);

const AVATAR_PATH = '/assets/images/avatar.png';

/* --------------------------------------------------------------------------
 * Objetos individuales
 * ------------------------------------------------------------------------ */

export const sampleUser: UserModel = {
    userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'sofia.martinez@example.com',
    firstName: 'Sofia',
    lastName: 'Martinez',
    password: 'password123',
    phoneNumber: '+573001234567',
    dateOfBirth: new Date('1992-05-15'),
    nationality: 'Colombian',
    language: 'es',
    isVerified: true,
    isVip: true,
    profilePicture: AVATAR_PATH,
    createdAt: new Date('2023-03-10'),
    lastLogin: daysAgo(2),
};

export const samplePreferences: UserPreferencesModel = {
    preferenceId: 'pref1234-5678-90ab-cdef-123456789012',
    userId: sampleUser.userId,
    minPrice: 50_000,
    maxPrice: 350_000,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-11-05'),
};

export const samplePreferredCategories: UserPreferredCategoryModel[] = [
    { userId: sampleUser.userId, categoryName: 'Beach' },
    { userId: sampleUser.userId, categoryName: 'Culture' },
    { userId: sampleUser.userId, categoryName: 'Gastronomy' },
];

export const sampleFavoriteLocations: UserFavoriteLocationModel[] = [
    { userId: sampleUser.userId, locationName: 'Cartagena, Colombia' },
    { userId: sampleUser.userId, locationName: 'San Andrés, Colombia' },
    { userId: sampleUser.userId, locationName: 'Santa Marta, Colombia' },
];

export const sampleUserProfile: UserProfileModel = {
    user: sampleUser,
    preferences: samplePreferences,
    preferredCategories: samplePreferredCategories,
    favoriteLocations: sampleFavoriteLocations,
};

/* --------------------------------------------------------------------------
 * Lista de usuarios
 * ------------------------------------------------------------------------ */

export const sampleUsers: UserModel[] = [
    sampleUser,
    {
        userId: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
        email: 'carlos.rodriguez@example.com',
        password: 'password123',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        profilePicture: AVATAR_PATH,
        phoneNumber: '+573109876543',
        dateOfBirth: new Date('1988-09-23'),
        nationality: 'Colombian',
        language: 'es',
        isVerified: true,
        isVip: false,
        createdAt: new Date('2023-05-20'),
        lastLogin: hoursAgo(5),
    },
    {
        /* Duplicado intencional, igual a sampleUser */
        userId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        email: 'sofia.martinez@example.com',
        firstName: 'Sofia',
        lastName: 'Martinez',
        profilePicture: AVATAR_PATH,
        phoneNumber: '+573001234567',
        dateOfBirth: new Date('1992-05-15'),
        nationality: 'Colombian',
        language: 'es',
        isVerified: true,
        isVip: true,
        createdAt: new Date('2023-03-10'),
        lastLogin: daysAgo(2),
    },
    {
        userId: 'd4e5f6a7-b8c9-0123-def4-56789012abcd',
        email: 'john.smith@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Smith',
        profilePicture: AVATAR_PATH,
        phoneNumber: '+13051234567',
        dateOfBirth: new Date('1985-11-30'),
        nationality: 'American',
        language: 'en',
        isVerified: true,
        isVip: true,
        createdAt: new Date('2023-02-05'),
        lastLogin: hoursAgo(12),
    },
    {
        userId: 'e5f6a7b8-c9d0-1234-ef56-789012abcdef',
        email: 'maria.fernandez@example.com',
        password: 'password123',
        firstName: 'Maria',
        lastName: 'Fernandez',
        profilePicture: AVATAR_PATH,
        phoneNumber: '+573158765432',
        dateOfBirth: new Date('1990-07-07'),
        nationality: 'Colombian',
        language: 'es',
        isVerified: false,
        isVip: false,
        createdAt: new Date('2023-08-12'),
        lastLogin: minutesAgo(30),
    },
];
