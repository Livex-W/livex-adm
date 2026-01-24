import { z } from 'zod';

// Experience category enum matching backend
export const experienceCategoryEnum = z.enum([
    'islands',
    'nautical',
    'city_tour',
    'sun_beach',
    'cultural',
    'adventure',
    'ecotourism',
    'agrotourism',
    'gastronomic',
    'religious',
    'educational'
]);
export type ExperienceCategory = z.infer<typeof experienceCategoryEnum>;

// Time slot configuration for availability
export const timeSlotConfigSchema = z.object({
    start_hour: z.number().min(0).max(23),
    start_minute: z.number().min(0).max(59),
    end_hour: z.number().min(0).max(23),
    end_minute: z.number().min(0).max(59),
    capacity: z.number().min(1).optional(),
    days_of_week: z.array(z.number().min(0).max(6)).optional(), // 0=Sunday, 6=Saturday
});

export type TimeSlotConfig = z.infer<typeof timeSlotConfigSchema>;

// Temporada (bloque de disponibilidad con precios obligatorios)
export const seasonConfigSchema = z.object({
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato: YYYY-MM-DD'),
    capacity: z.number().min(1),
    slots: z.array(timeSlotConfigSchema).min(1, 'Agrega al menos un horario'),
    // Precios de temporada (OBLIGATORIOS)
    price_per_adult: z.number().min(1000, 'Precio adulto obligatorio (mín $1,000)'),
    price_per_child: z.number().min(0).default(0),
    commission_per_adult: z.number().min(0).default(0),
    commission_per_child: z.number().min(0).default(0),
});

export type SeasonConfig = z.infer<typeof seasonConfigSchema>;

// Legacy alias para compatibilidad
export const availabilityConfigSchema = seasonConfigSchema;
export type AvailabilityConfig = SeasonConfig;

// Create experience schema - SIN PRECIOS BASE (van en temporadas)
export const createExperienceSchema = z.object({
    // Basic Info
    title: z.string().min(5, 'Mínimo 5 caracteres').max(200, 'Máximo 200 caracteres'),
    description: z.string().max(2000, 'Máximo 2000 caracteres').optional(),
    category: experienceCategoryEnum,

    // Child config (separado de precios)
    allows_children: z.boolean(),
    child_min_age: z.number().min(0).max(17),
    child_max_age: z.number().min(0).max(17),

    // Currency
    currency: z.string().length(3),

    // Details (arrays that will be converted to comma-separated strings)
    includes: z.array(z.string()),
    excludes: z.array(z.string()),

    // Location (optional for now)
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
});

export type CreateExperienceFormData = z.infer<typeof createExperienceSchema>;

// Transform form data to API payload (sin precios - van en availability)
export function transformToApiPayload(data: CreateExperienceFormData, resortId: string) {
    return {
        resort_id: resortId,
        title: data.title,
        description: data.description,
        category: data.category,
        allows_children: data.allows_children,
        child_min_age: data.child_min_age,
        child_max_age: data.child_max_age,
        currency: data.currency,
        includes: data.includes.join(', '),
        excludes: data.excludes.join(', '),
    };
}
