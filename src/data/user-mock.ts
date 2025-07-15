import {
    UserModel,
    UserPreferencesModel,
    UserPreferredCategoryModel,
    UserFavoriteLocationModel,
    UserProfileModel
} from '../types/user';

export const mockUsers: UserModel[] = [
    {
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        email: "juan.perez@ejemplo.com",
        firstName: "Juan",
        lastName: "Pérez",
        profilePicture: "https://storage.livex.com/users/juan-perez-avatar.jpg",
        phoneNumber: "+573001234567",
        dateOfBirth: new Date("1985-06-15"),
        nationality: "Colombia",
        language: "es",
        isVerified: true,
        isVip: false,
        createdAt: new Date("2024-01-10"),
        lastLogin: new Date("2024-05-14T10:30:00")
    },
    {
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        email: "maria.gonzalez@ejemplo.com",
        firstName: "María",
        lastName: "González",
        profilePicture: "https://storage.livex.com/users/maria-gonzalez-avatar.jpg",
        phoneNumber: "+573012345678",
        dateOfBirth: new Date("1990-03-22"),
        nationality: "Colombia",
        language: "es",
        isVerified: true,
        isVip: true,
        createdAt: new Date("2023-11-05"),
        lastLogin: new Date("2024-05-13T14:22:00")
    },
    {
        userId: "c3d4e5f6-a7b8-9012-cdef-a12345678902",
        email: "carlos.rodriguez@ejemplo.com",
        firstName: "Carlos",
        lastName: "Rodríguez",
        phoneNumber: "+573023456789",
        dateOfBirth: new Date("1978-12-10"),
        nationality: "Colombia",
        language: "es",
        isVerified: true,
        isVip: false,
        createdAt: new Date("2024-02-20"),
        lastLogin: new Date("2024-05-12T09:15:00")
    },
    {
        userId: "d4e5f6a7-b8c9-0123-defa-b12345678903",
        email: "sarah.johnson@example.com",
        firstName: "Sarah",
        lastName: "Johnson",
        profilePicture: "https://storage.livex.com/users/sarah-johnson-avatar.jpg",
        phoneNumber: "+14155552671",
        dateOfBirth: new Date("1988-09-05"),
        nationality: "United States",
        language: "en",
        isVerified: true,
        isVip: true,
        createdAt: new Date("2024-03-15"),
        lastLogin: new Date("2024-05-14T08:45:00")
    }
];

export const mockUserPreferences: UserPreferencesModel[] = [
    {
        preferenceId: "pref-001",
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        minPrice: 50000,
        maxPrice: 300000,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-05-01")
    },
    {
        preferenceId: "pref-002",
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        minPrice: 100000,
        maxPrice: 500000,
        createdAt: new Date("2023-11-05"),
        updatedAt: new Date("2024-04-20")
    },
    {
        preferenceId: "pref-003",
        userId: "c3d4e5f6-a7b8-9012-cdef-a12345678902",
        minPrice: 0,
        maxPrice: 200000,
        createdAt: new Date("2024-02-20"),
        updatedAt: new Date("2024-02-20")
    },
    {
        preferenceId: "pref-004",
        userId: "d4e5f6a7-b8c9-0123-defa-b12345678903",
        minPrice: 200000,
        maxPrice: 1000000,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15")
    }
];

export const mockUserPreferredCategories: UserPreferredCategoryModel[] = [
    // Juan Pérez
    {
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        categoryName: "Tours acuáticos"
    },
    {
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        categoryName: "Islas"
    },
    {
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        categoryName: "Aventura"
    },
    // María González (VIP)
    {
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        categoryName: "Gastronomía"
    },
    {
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        categoryName: "Cultura"
    },
    {
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        categoryName: "Tours acuáticos"
    },
    // Carlos Rodríguez
    {
        userId: "c3d4e5f6-a7b8-9012-cdef-a12345678902",
        categoryName: "Islas"
    },
    {
        userId: "c3d4e5f6-a7b8-9012-cdef-a12345678902",
        categoryName: "Tours acuáticos"
    },
    // Sarah Johnson (VIP)
    {
        userId: "d4e5f6a7-b8c9-0123-defa-b12345678903",
        categoryName: "Aventura"
    },
    {
        userId: "d4e5f6a7-b8c9-0123-defa-b12345678903",
        categoryName: "Cultura"
    }
];

export const mockUserFavoriteLocations: UserFavoriteLocationModel[] = [
    // Juan Pérez
    {
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        locationName: "Islas del Rosario"
    },
    {
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        locationName: "Playa Blanca"
    },
    // María González
    {
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        locationName: "Centro Histórico"
    },
    {
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        locationName: "Getsemaní"
    },
    {
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        locationName: "Islas del Rosario"
    },
    // Carlos Rodríguez
    {
        userId: "c3d4e5f6-a7b8-9012-cdef-a12345678902",
        locationName: "Barú"
    },
    // Sarah Johnson
    {
        userId: "d4e5f6a7-b8c9-0123-defa-b12345678903",
        locationName: "Centro Histórico"
    },
    {
        userId: "d4e5f6a7-b8c9-0123-defa-b12345678903",
        locationName: "La Boquilla"
    }
];

// Helper function para construir perfiles completos
export function buildUserProfile(userId: string): UserProfileModel | null {
    const user = mockUsers.find(u => u.userId === userId);
    if (!user) return null;

    const preferences = mockUserPreferences.find(p => p.userId === userId);
    const preferredCategories = mockUserPreferredCategories.filter(c => c.userId === userId);
    const favoriteLocations = mockUserFavoriteLocations.filter(l => l.userId === userId);

    return {
        user,
        preferences: preferences || {
            preferenceId: `pref-${userId}`,
            userId,
            minPrice: 0,
            maxPrice: 1000000,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        preferredCategories,
        favoriteLocations
    };
}

// Perfiles completos pre-construidos
export const mockUserProfiles: UserProfileModel[] = mockUsers
    .map(user => buildUserProfile(user.userId))
    .filter((profile): profile is UserProfileModel => profile !== null);
