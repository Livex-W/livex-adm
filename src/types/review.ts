/* ============================================================================
 * reviews.mock.ts – Mock de reseñas, fotos y experiencias guardadas
 * 1. Modelos & enums
 * 2. Datos de ejemplo
 * 3. Utilidades para consultar / mutar el mock in-memory
 * ==========================================================================*/

/* --------------------------------------------------------------------------
 * 1. Interfaces / Enums
 * ------------------------------------------------------------------------ */

export enum ReviewStatus {
    pending = 'pending',
    published = 'published',
    rejected = 'rejected',
}

export interface ReviewPhoto {
    reviewId: string;
    photoUrl: string;
    displayOrder: number;
}

export interface Review {
    reviewId: string;
    experienceId: string;
    userId: string;
    bookingId: string;
    rating: number;                // 1-5
    title?: string;
    content: string;
    resortResponseContent?: string;
    resortResponseDate?: Date;
    likes: number;
    status: ReviewStatus;
    createdAt: Date;
    updatedAt: Date;
    photos?: ReviewPhoto[];
}

export interface SavedExperience {
    savedExperienceId: string;
    userId: string;
    experienceId: string;
    savedAt: Date;
}

/* --------------------------------------------------------------------------
 * 2. Datos simulados
 * ------------------------------------------------------------------------ */

import { mockExperiences } from '@/types/experience';  // Ajusta la ruta según tu setup

/* IDs de usuarios usados en los mocks */
export const currentUserId = 'user-current-001';
export const otherUserId = 'user-other-002';

/* Helpers para fechas coherentes (mismo patrón que experiences.mock) */
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);
// const daysAhead = (d: number) => new Date(Date.now() + d * 86_400_000);

// const now = new Date();
const yesterday = daysAgo(1);
const lastWeek = daysAgo(7);
const lastMonth = daysAgo(30);

/* ----------------------- Reseñas ---------------------------------------- */
export const mockReviews: Review[] = [
    /* review-001 – publicada, con respuesta */
    {
        reviewId: 'review-001',
        experienceId: mockExperiences[2].experienceId,
        userId: currentUserId,
        bookingId: 'booking-003',
        rating: 5,
        title: 'Experiencia increíble',
        content:
            'Fue una experiencia maravillosa. La comida estaba deliciosa y el servicio fue excepcional. Definitivamente lo recomendaría a cualquiera que visite Cartagena.',
        resortResponseContent:
            'Muchas gracias por sus amables palabras. Estamos encantados de que haya disfrutado de la experiencia. Esperamos verlo de nuevo pronto.',
        resortResponseDate: new Date(),
        likes: 3,
        status: ReviewStatus.published,
        createdAt: new Date(),
        updatedAt: new Date(),
        photos: [
            { reviewId: 'review-001', photoUrl: 'assets/images/reviews/sunset_dinner1.jpg', displayOrder: 1 },
            { reviewId: 'review-001', photoUrl: 'assets/images/reviews/sunset_dinner2.jpg', displayOrder: 2 },
        ],
    },

    /* review-002 – publicada, sin respuesta */
    {
        reviewId: 'review-002',
        experienceId: mockExperiences[0].experienceId,
        userId: otherUserId,
        bookingId: 'booking-old-001',
        rating: 4,
        title: 'Muy buena experiencia',
        content:
            'El tour fue muy informativo y divertido. El guía fue excelente explicando la historia de Cartagena. Lo único que podría mejorar es que incluyan agua durante el recorrido.',
        likes: 1,
        status: ReviewStatus.published,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45),
    },

    /* review-003 – publicada, con respuesta del resort */
    {
        reviewId: 'review-003',
        experienceId: mockExperiences[1].experienceId,
        userId: otherUserId,
        bookingId: 'booking-old-002',
        rating: 2,
        title: 'Servicio deficiente',
        content:
            'El snorkel fue decepcionante. El equipo estaba en mal estado y el guía no prestaba suficiente atención al grupo. No recomendaría esta experiencia.',
        resortResponseContent:
            'Lamentamos que su experiencia no haya sido satisfactoria. Hemos tomado nota de sus comentarios para mejorar nuestro servicio. Nos gustaría ofrecerle un 20% de descuento en su próxima visita.',
        resortResponseDate: daysAgo(25),
        likes: 0,
        status: ReviewStatus.published,
        createdAt: daysAgo(27),
        updatedAt: daysAgo(25),
    },

    /* review-004 – pendiente */
    {
        reviewId: 'review-004',
        experienceId: mockExperiences[3].experienceId,
        userId: currentUserId,
        bookingId: 'booking-old-003',
        rating: 5,
        title: 'Excelente recorrido histórico',
        content:
            'El tour por la ciudad amurallada fue fascinante. Aprendí mucho sobre la historia de Cartagena y sus defensas coloniales. El guía era muy conocedor y contestó todas mis preguntas con detalles.',
        likes: 0,
        status: ReviewStatus.pending,
        createdAt: daysAgo(0.2),           // hace ~5h
        updatedAt: daysAgo(0.2),
        photos: [
            { reviewId: 'review-004', photoUrl: 'assets/images/reviews/historic_tour1.jpg', displayOrder: 1 },
        ],
    },

    /* review-005 – rechazada */
    {
        reviewId: 'review-005',
        experienceId: mockExperiences[4].experienceId,
        userId: otherUserId,
        bookingId: 'booking-old-004',
        rating: 1,
        title: 'Pésimo servicio',
        content: '[Contenido removido por violar las normas de la comunidad]',
        likes: 0,
        status: ReviewStatus.rejected,
        createdAt: daysAgo(9),
        updatedAt: daysAgo(8),
    },
];

/* ------------------ Experiencias guardadas ------------------------------ */
export const mockSavedExperiences: SavedExperience[] = [
    /* del usuario actual */
    { savedExperienceId: 'saved-001', userId: currentUserId, experienceId: mockExperiences[0].experienceId, savedAt: lastWeek },
    { savedExperienceId: 'saved-002', userId: currentUserId, experienceId: mockExperiences[2].experienceId, savedAt: yesterday },
    { savedExperienceId: 'saved-003', userId: currentUserId, experienceId: mockExperiences[4].experienceId, savedAt: daysAgo(0.125) },

    /* de otro usuario */
    { savedExperienceId: 'saved-004', userId: otherUserId, experienceId: mockExperiences[1].experienceId, savedAt: daysAgo(10) },
    { savedExperienceId: 'saved-005', userId: otherUserId, experienceId: mockExperiences[3].experienceId, savedAt: lastMonth },
];

/* --------------------------------------------------------------------------
 * 3. Funciones utilitarias (in-memory)
 * ------------------------------------------------------------------------ */

/* --- consultas ---------------------------------------------------------- */

export const getReviewsByExperienceId = (experienceId: string): Review[] =>
    mockReviews.filter(
        (r) => r.experienceId === experienceId && r.status === ReviewStatus.published,
    );

export const getReviewsByUserId = (userId: string): Review[] =>
    mockReviews.filter((r) => r.userId === userId);

export const getReviewByBookingId = (bookingId: string): Review | undefined =>
    mockReviews.find((r) => r.bookingId === bookingId);

export const getSavedExperiencesByUserId = (userId: string): SavedExperience[] =>
    mockSavedExperiences.filter((s) => s.userId === userId);

export const isExperienceSavedByUser = (experienceId: string, userId: string): boolean =>
    mockSavedExperiences.some((s) => s.experienceId === experienceId && s.userId === userId);

/* --- mutaciones --------------------------------------------------------- */

/**
 * Crea un objeto Review (pendiente) – NO se agrega automáticamente al array.
 * El caller decide si persiste (mockReviews.push(newReview)) o envía al backend.
 */
export function createReview(params: {
    experienceId: string;
    userId: string;
    bookingId: string;
    rating: number;
    title?: string;
    content: string;
    photoUrls?: string[];
}): Review {
    const {
        experienceId,
        userId,
        bookingId,
        rating,
        title,
        content,
        photoUrls = [],
    } = params;

    const reviewId = `review-${Date.now()}`;
    const timestamp = new Date();

    const photos: ReviewPhoto[] = photoUrls.map((url, i) => ({
        reviewId,
        photoUrl: url,
        displayOrder: i + 1,
    }));

    return {
        reviewId,
        experienceId,
        userId,
        bookingId,
        rating,
        title,
        content,
        likes: 0,
        status: ReviewStatus.pending,
        createdAt: timestamp,
        updatedAt: timestamp,
        photos,
    };
}

/**
 * Marca / desmarca una experiencia guardada.
 * Devuelve la SavedExperience creada o `null` si se eliminó.
 */
export function toggleSavedExperience(
    experienceId: string,
    userId: string,
): SavedExperience | null {
    const idx = mockSavedExperiences.findIndex(
        (s) => s.experienceId === experienceId && s.userId === userId,
    );

    // Si existe → eliminar
    if (idx !== -1) {
        mockSavedExperiences.splice(idx, 1);
        return null;
    }

    // Si no existe → agregar
    const newSaved: SavedExperience = {
        savedExperienceId: `saved-${Date.now()}`,
        userId,
        experienceId,
        savedAt: new Date(),
    };

    mockSavedExperiences.push(newSaved);
    return newSaved;
}
