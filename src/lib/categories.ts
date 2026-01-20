// Category slug to display name mapping
export const CATEGORY_NAMES: Record<string, string> = {
    // Original categories
    'city_tour': 'City Tour',
    'islands': 'Islas y Playa',
    'nautical': 'Náutica y Vela',
    // New tourism categories
    'sun_beach': 'Sol y Playa',
    'cultural': 'Cultural',
    'adventure': 'Aventura',
    'ecotourism': 'Ecoturismo',
    'agrotourism': 'Agroturismo',
    'gastronomic': 'Gastronómico',
    'religious': 'Religioso',
    'educational': 'Educativo',
};

/**
 * Get the display name for a category slug
 * @param slug - The category slug (e.g., 'sun_beach')
 * @returns The display name (e.g., 'Sol y Playa') or the slug if not found
 */
export function getCategoryName(slug: string | undefined | null): string {
    if (!slug) return 'Sin categoría';
    return CATEGORY_NAMES[slug] || slug;
}
