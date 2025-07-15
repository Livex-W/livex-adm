import {
    Booking,
    BookingStatus,
    Payment,
    PaymentStatus,
    Refund,
    RefundStatus,
    Commission
} from '../types/booking';

import {
    Review,
    ReviewStatus,
    ReviewPhoto,
    SavedExperience
} from '../types/review';

// Mock Bookings
export const mockBookings: Booking[] = [
    {
        bookingId: "12345678-90ab-cdef-1234-567890abcdef",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        bookingDate: new Date("2024-05-10T14:30:00"),
        experienceDate: new Date("2024-05-15"),
        startTime: "08:00",
        endTime: "16:00",
        adultParticipants: 2,
        childParticipants: 1,
        customerName: "Juan Pérez",
        customerEmail: "juan@ejemplo.com",
        customerPhone: "+573001234567",
        specialRequests: "Preferimos un guía que hable español",
        subtotal: 450000,  // 3 personas x 150000
        tax: 85500,        // 19%
        commission: 45000, // 10%
        total: 535500,
        currency: "COP",
        status: BookingStatus.confirmed,
        createdAt: new Date("2024-05-10T14:30:00"),
        updatedAt: new Date("2024-05-10T14:35:00")
    },
    {
        bookingId: "23456789-01bc-defa-2345-678901bcdef0",
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        bookingDate: new Date("2024-05-08T10:15:00"),
        experienceDate: new Date("2024-05-12"),
        startTime: "09:00",
        endTime: "12:00",
        adultParticipants: 2,
        childParticipants: 0,
        customerName: "María González",
        customerEmail: "maria@ejemplo.com",
        customerPhone: "+573012345678",
        subtotal: 500000,  // 2 personas x 250000
        tax: 95000,
        commission: 50000,
        total: 595000,
        currency: "COP",
        status: BookingStatus.completed,
        createdAt: new Date("2024-05-08T10:15:00"),
        updatedAt: new Date("2024-05-12T12:30:00")
    },
    {
        bookingId: "34567890-12cd-efab-3456-789012cdef01",
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        userId: "c3d4e5f6-a7b8-9012-cdef-a12345678902",
        resortId: "12345678-abcd-ef01-2345-6789abcdef01",
        bookingDate: new Date("2024-05-05T16:45:00"),
        experienceDate: new Date("2024-05-10"),
        startTime: "18:00",
        endTime: "22:00",
        adultParticipants: 4,
        childParticipants: 0,
        customerName: "Carlos Rodríguez",
        customerEmail: "carlos@ejemplo.com",
        customerPhone: "+573023456789",
        subtotal: 480000,  // 4 personas x 120000
        tax: 91200,
        commission: 48000,
        total: 571200,
        currency: "COP",
        status: BookingStatus.cancelled,
        cancellationReason: "Cambio de planes del usuario",
        refundAmount: 456960,  // 80% de reembolso
        createdAt: new Date("2024-05-05T16:45:00"),
        updatedAt: new Date("2024-05-08T09:00:00")
    }
];

// Mock Payments
export const mockPayments: Payment[] = [
    {
        paymentId: "98765432-10fe-dcba-9876-543210fedcba",
        bookingId: "12345678-90ab-cdef-1234-567890abcdef",
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        amount: 535500,
        paymentMethod: "credit_card",
        cardLast4: "4321",
        cardBrand: "Visa",
        transactionId: "txn_123456789",
        status: PaymentStatus.completed,
        receiptUrl: "https://payments.livex.com/receipts/txn_123456789",
        paymentDate: new Date("2024-05-10T14:35:00"),
        createdAt: new Date("2024-05-10T14:35:00"),
        updatedAt: new Date("2024-05-10T14:35:00")
    },
    {
        paymentId: "87654321-09ed-cba9-8765-432109edcba9",
        bookingId: "23456789-01bc-defa-2345-678901bcdef0",
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        amount: 595000,
        paymentMethod: "debit_card",
        cardLast4: "5678",
        cardBrand: "Mastercard",
        transactionId: "txn_987654321",
        status: PaymentStatus.completed,
        receiptUrl: "https://payments.livex.com/receipts/txn_987654321",
        paymentDate: new Date("2024-05-08T10:20:00"),
        createdAt: new Date("2024-05-08T10:20:00"),
        updatedAt: new Date("2024-05-08T10:20:00")
    },
    {
        paymentId: "76543210-98dc-ba98-7654-321098dcba98",
        bookingId: "34567890-12cd-efab-3456-789012cdef01",
        userId: "c3d4e5f6-a7b8-9012-cdef-a12345678902",
        amount: 571200,
        paymentMethod: "credit_card",
        cardLast4: "9012",
        cardBrand: "Visa",
        transactionId: "txn_456789123",
        status: PaymentStatus.refunded,
        receiptUrl: "https://payments.livex.com/receipts/txn_456789123",
        paymentDate: new Date("2024-05-05T16:50:00"),
        createdAt: new Date("2024-05-05T16:50:00"),
        updatedAt: new Date("2024-05-08T09:05:00")
    }
];

// Mock Refunds
export const mockRefunds: Refund[] = [
    {
        refundId: "ref-001",
        paymentId: "76543210-98dc-ba98-7654-321098dcba98",
        amount: 456960,  // 80% del total
        reason: "Cancelación por parte del usuario",
        status: RefundStatus.completed,
        refundDate: new Date("2024-05-08T09:05:00"),
        createdAt: new Date("2024-05-08T09:00:00"),
        updatedAt: new Date("2024-05-08T09:05:00")
    }
];

// Mock Commissions
export const mockCommissions: Commission[] = [
    {
        commissionId: "comm-001",
        paymentId: "98765432-10fe-dcba-9876-543210fedcba",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        amount: 45000,
        rate: 10.00,
        paidToResort: false,
        createdAt: new Date("2024-05-10T14:35:00"),
        updatedAt: new Date("2024-05-10T14:35:00")
    },
    {
        commissionId: "comm-002",
        paymentId: "87654321-09ed-cba9-8765-432109edcba9",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        amount: 50000,
        rate: 10.00,
        paidToResort: true,
        paidDate: new Date("2024-05-13T10:00:00"),
        createdAt: new Date("2024-05-08T10:20:00"),
        updatedAt: new Date("2024-05-13T10:00:00")
    }
];

// Mock Reviews
export const mockReviews: Review[] = [
    {
        reviewId: "abcdef12-3456-7890-abcd-ef1234567890",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        bookingId: "12345678-90ab-cdef-1234-567890abcdef",
        rating: 5,
        title: "Experiencia increíble",
        content: "Disfrutamos muchísimo del tour, el guía fue muy amable y conocedor. Las islas son hermosas y el almuerzo estuvo delicioso. Totalmente recomendado.",
        resortResponseContent: "Gracias por sus comentarios. Nos alegra que haya disfrutado de la experiencia. ¡Esperamos verlo pronto nuevamente!",
        resortResponseDate: new Date("2024-05-16T10:00:00"),
        likes: 15,
        status: ReviewStatus.published,
        createdAt: new Date("2024-05-15T18:30:00"),
        updatedAt: new Date("2024-05-16T10:00:00")
    },
    {
        reviewId: "bcdef123-4567-8901-bcde-f12345678901",
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        bookingId: "23456789-01bc-defa-2345-678901bcdef0",
        rating: 5,
        title: "Primera vez buceando - ¡Inolvidable!",
        content: "Nunca había buceado antes y fue una experiencia maravillosa. Los instructores fueron muy pacientes y profesionales. Vi peces de colores increíbles y corales hermosos.",
        likes: 23,
        status: ReviewStatus.published,
        createdAt: new Date("2024-05-12T15:45:00"),
        updatedAt: new Date("2024-05-12T15:45:00")
    },
    {
        reviewId: "cdef1234-5678-9012-cdef-123456789012",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        userId: "user-003",
        bookingId: "booking-003",
        rating: 4,
        title: "Muy bueno pero puede mejorar",
        content: "El tour estuvo muy bien organizado y las islas son paradisíacas. El único detalle fue que el catamarán estaba un poco lleno. De resto, excelente experiencia.",
        likes: 8,
        status: ReviewStatus.published,
        createdAt: new Date("2024-05-10T09:00:00"),
        updatedAt: new Date("2024-05-10T09:00:00")
    }
];

// Mock Review Photos
export const mockReviewPhotos: ReviewPhoto[] = [
    {
        reviewId: "abcdef12-3456-7890-abcd-ef1234567890",
        photoUrl: "https://storage.livex.com/reviews/review1-photo1.jpg",
        displayOrder: 1
    },
    {
        reviewId: "abcdef12-3456-7890-abcd-ef1234567890",
        photoUrl: "https://storage.livex.com/reviews/review1-photo2.jpg",
        displayOrder: 2
    },
    {
        reviewId: "bcdef123-4567-8901-bcde-f12345678901",
        photoUrl: "https://storage.livex.com/reviews/diving-selfie.jpg",
        displayOrder: 1
    }
];

// Mock Saved Experiences
export const mockSavedExperiences: SavedExperience[] = [
    {
        savedExperienceId: "saved-001",
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        savedAt: new Date("2024-05-01T12:00:00")
    },
    {
        savedExperienceId: "saved-002",
        userId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        savedAt: new Date("2024-05-05T14:30:00")
    },
    {
        savedExperienceId: "saved-003",
        userId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        savedAt: new Date("2024-05-08T09:15:00")
    }
];
