/* ============================================================================
 * bookings.mock.ts – Reservas, pagos, reembolsos y comisiones de ejemplo
 * 1. Tipos y enums
 * 2. Datos simulados
 * 3. Funciones helper (in-memory)
 * ==========================================================================*/

import { mockExperiences } from '@/types/experience';

/* --------------------------------------------------------------------------
 * 1. Tipos / Enums
 * ------------------------------------------------------------------------ */

type TimeOfDay = `${number}${number}:${number}${number}`;

export enum BookingStatus {
    pending = 'pending',
    confirmed = 'confirmed',
    completed = 'completed',
    cancelled = 'cancelled',
    refunded = 'refunded',
}

export interface Booking {
    bookingId: string;
    experienceId: string;
    userId: string;
    resortId: string;
    bookingDate: Date;
    experienceDate: Date;
    startTime: TimeOfDay;
    endTime: TimeOfDay;
    adultParticipants: number;
    childParticipants: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
    subtotal: number;
    tax: number;
    commission: number;
    total: number;
    currency: string;
    status: BookingStatus;
    cancellationReason?: string;
    refundAmount?: number;
    createdAt: Date;
    updatedAt: Date;
}

export enum PaymentStatus {
    pending = 'pending',
    completed = 'completed',
    refunded = 'refunded',
    failed = 'failed',
}

export interface Payment {
    paymentId: string;
    bookingId: string;
    userId: string;
    amount: number;
    paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'pending' | string;
    cardLast4?: string;
    cardBrand?: string;
    transactionId?: string;
    status: PaymentStatus;
    receiptUrl?: string;
    paymentDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export enum RefundStatus {
    pending = 'pending',
    completed = 'completed',
    failed = 'failed',
}

export interface Refund {
    refundId: string;
    paymentId: string;
    amount: number;
    reason: string;
    status: RefundStatus;
    refundDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Commission {
    commissionId: string;
    paymentId: string;
    resortId: string;
    amount: number;
    rate: number;          // porcentaje p.e. 10.0
    paidToResort: boolean;
    paidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

/* --------------------------------------------------------------------------
 * 2. Datos simulados
 * ------------------------------------------------------------------------ */

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);
const daysAhead = (d: number) => new Date(Date.now() + d * 86_400_000);

export const now = new Date();
export const yesterday = daysAgo(1);
export const lastWeek = daysAgo(7);
export const nextWeek = daysAhead(7);
export const nextMonth = daysAhead(30);

/* IDs fijos de usuarios y resorts */
export const currentUserId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
export const otherUserId = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';

export const resort1Id = 'resort-001';
export const resort2Id = 'resort-002';
export const resort3Id = 'resort-003';

/* ----------------------- Reservas --------------------------------------- */
export const mockBookings: Booking[] = [
    /* booking-001 – pendiente */
    {
        bookingId: 'booking-001',
        experienceId: mockExperiences[0].experienceId,
        userId: currentUserId,
        resortId: resort1Id,
        bookingDate: now,
        experienceDate: nextWeek,
        startTime: '09:00',
        endTime: '13:00',
        adultParticipants: 2,
        childParticipants: 1,
        customerName: 'Juan Pérez',
        customerEmail: 'juan@example.com',
        customerPhone: '+573001234567',
        specialRequests: 'Preferimos un guía que hable español',
        subtotal: 150_000,
        tax: 28_500,
        commission: 15_000,
        total: 178_500,
        currency: 'COP',
        status: BookingStatus.pending,
        createdAt: daysAgo(0.08),   // hace ~2h
        updatedAt: daysAgo(0.08),
    },

    /* booking-002 – confirmada */
    {
        bookingId: 'booking-002',
        experienceId: mockExperiences[1].experienceId,
        userId: currentUserId,
        resortId: resort2Id,
        bookingDate: lastWeek,
        experienceDate: nextMonth,
        startTime: '14:00',
        endTime: '17:00',
        adultParticipants: 4,
        childParticipants: 0,
        customerName: 'Juan Pérez',
        customerEmail: 'juan@example.com',
        customerPhone: '+573001234567',
        subtotal: 260_000,
        tax: 49_400,
        commission: 26_000,
        total: 309_400,
        currency: 'COP',
        status: BookingStatus.confirmed,
        createdAt: lastWeek,
        updatedAt: new Date(),
    },

    /* booking-003 – completada */
    {
        bookingId: 'booking-003',
        experienceId: mockExperiences[2].experienceId,
        userId: currentUserId,
        resortId: resort3Id,
        bookingDate: daysAgo(14),
        experienceDate: yesterday,
        startTime: '18:00',
        endTime: '21:00',
        adultParticipants: 2,
        childParticipants: 0,
        customerName: 'Juan Pérez',
        customerEmail: 'juan@example.com',
        customerPhone: '+573001234567',
        subtotal: 300_000,
        tax: 57_000,
        commission: 30_000,
        total: 357_000,
        currency: 'COP',
        status: BookingStatus.completed,
        createdAt: daysAgo(14),
        updatedAt: new Date(),
    },

    /* booking-004 – cancelada */
    {
        bookingId: 'booking-004',
        experienceId: mockExperiences[3].experienceId,
        userId: currentUserId,
        resortId: resort1Id,
        bookingDate: daysAgo(10),
        experienceDate: daysAgo(4),
        startTime: '10:00',
        endTime: '14:00',
        adultParticipants: 1,
        childParticipants: 2,
        customerName: 'Juan Pérez',
        customerEmail: 'juan@example.com',
        customerPhone: '+573001234567',
        specialRequests: 'Necesitamos sillas para niños',
        subtotal: 180_000,
        tax: 34_200,
        commission: 18_000,
        total: 214_200,
        currency: 'COP',
        status: BookingStatus.cancelled,
        cancellationReason: 'Cambio de planes de viaje',
        refundAmount: 171_360,
        createdAt: daysAgo(10),
        updatedAt: daysAgo(8),
    },

    /* booking-005 – reembolsada */
    {
        bookingId: 'booking-005',
        experienceId: mockExperiences[4].experienceId,
        userId: currentUserId,
        resortId: resort2Id,
        bookingDate: daysAgo(17),
        experienceDate: daysAgo(9),
        startTime: '11:00',
        endTime: '14:00',
        adultParticipants: 3,
        childParticipants: 1,
        customerName: 'Juan Pérez',
        customerEmail: 'juan@example.com',
        customerPhone: '+573001234567',
        subtotal: 240_000,
        tax: 45_600,
        commission: 24_000,
        total: 285_600,
        currency: 'COP',
        status: BookingStatus.refunded,
        cancellationReason: 'Evento cancelado por mal tiempo',
        refundAmount: 285_600,
        createdAt: daysAgo(17),
        updatedAt: daysAgo(10),
    },
];

/* ----------------------- Pagos ------------------------------------------ */
export const mockPayments: Payment[] = [
    /* payment-001 – pendiente */
    {
        paymentId: 'payment-001',
        bookingId: 'booking-001',
        userId: currentUserId,
        amount: 178_500,
        paymentMethod: 'pending',
        status: PaymentStatus.pending,
        createdAt: daysAgo(0.08),
        updatedAt: daysAgo(0.08),
    },

    /* payment-002 – completado */
    {
        paymentId: 'payment-002',
        bookingId: 'booking-002',
        userId: currentUserId,
        amount: 309_400,
        paymentMethod: 'credit_card',
        cardLast4: '4242',
        cardBrand: 'Visa',
        transactionId: 'txn_123456789',
        status: PaymentStatus.completed,
        receiptUrl: 'https://receipts.livex.com/payment-002.pdf',
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    /* payment-003 – completado */
    {
        paymentId: 'payment-003',
        bookingId: 'booking-003',
        userId: currentUserId,
        amount: 357_000,
        paymentMethod: 'debit_card',
        cardLast4: '0123',
        cardBrand: 'Mastercard',
        transactionId: 'txn_987654321',
        status: PaymentStatus.completed,
        receiptUrl: 'https://receipts.livex.com/payment-003.pdf',
        paymentDate: daysAgo(13.5),
        createdAt: daysAgo(14),
        updatedAt: daysAgo(13.5),
    },

    /* payment-004 – reembolsado */
    {
        paymentId: 'payment-004',
        bookingId: 'booking-004',
        userId: currentUserId,
        amount: 214_200,
        paymentMethod: 'credit_card',
        cardLast4: '5678',
        cardBrand: 'American Express',
        transactionId: 'txn_456789123',
        status: PaymentStatus.refunded,
        receiptUrl: 'https://receipts.livex.com/payment-004.pdf',
        paymentDate: daysAgo(8.8),
        createdAt: daysAgo(10),
        updatedAt: daysAgo(8),
    },

    /* payment-005 – reembolsado */
    {
        paymentId: 'payment-005',
        bookingId: 'booking-005',
        userId: currentUserId,
        amount: 285_600,
        paymentMethod: 'paypal',
        transactionId: 'txn_paypal_123456',
        status: PaymentStatus.refunded,
        receiptUrl: 'https://receipts.livex.com/payment-005.pdf',
        paymentDate: daysAgo(16.3),
        createdAt: daysAgo(17),
        updatedAt: daysAgo(10),
    },
];

/* ----------------------- Reembolsos ------------------------------------- */
export const mockRefunds: Refund[] = [
    {
        refundId: 'refund-001',
        paymentId: 'payment-004',
        amount: 171_360,
        reason: 'Cancelación por parte del cliente',
        status: RefundStatus.completed,
        refundDate: daysAgo(8),
        createdAt: daysAgo(8),
        updatedAt: daysAgo(8),
    },
    {
        refundId: 'refund-002',
        paymentId: 'payment-005',
        amount: 285_600,
        reason: 'Cancelación por parte del proveedor',
        status: RefundStatus.completed,
        refundDate: daysAgo(10),
        createdAt: daysAgo(10),
        updatedAt: daysAgo(10),
    },
];

/* ----------------------- Comisiones ------------------------------------- */
export const mockCommissions: Commission[] = [
    {
        commissionId: 'commission-001',
        paymentId: 'payment-002',
        resortId: resort2Id,
        amount: 26_000,
        rate: 10.0,
        paidToResort: true,
        paidDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        commissionId: 'commission-002',
        paymentId: 'payment-003',
        resortId: resort3Id,
        amount: 30_000,
        rate: 10.0,
        paidToResort: true,
        paidDate: yesterday,
        createdAt: daysAgo(13.5),
        updatedAt: yesterday,
    },
    {
        commissionId: 'commission-003',
        paymentId: 'payment-004',
        resortId: resort1Id,
        amount: 18_000,
        rate: 10.0,
        paidToResort: false,
        createdAt: daysAgo(8.8),
        updatedAt: daysAgo(8),
    },
    {
        commissionId: 'commission-004',
        paymentId: 'payment-005',
        resortId: resort2Id,
        amount: 24_000,
        rate: 10.0,
        paidToResort: false,
        createdAt: daysAgo(16.3),
        updatedAt: daysAgo(10),
    },
];

/* --------------------------------------------------------------------------
 * 3. Funciones helper
 * ------------------------------------------------------------------------ */

export const getBookingsByUserId = (userId: string): Booking[] =>
    mockBookings.filter((b) => b.userId === userId);

export const getPaymentsByUserId = (userId: string): Payment[] =>
    mockPayments.filter((p) => p.userId === userId);

export const getBookingsByExperienceId = (experienceId: string): Booking[] =>
    mockBookings.filter((b) => b.experienceId === experienceId);

export const getBookingsByResortId = (resortId: string): Booking[] =>
    mockBookings.filter((b) => b.resortId === resortId);

export const getPaymentByBookingId = (bookingId: string): Payment | undefined =>
    mockPayments.find((p) => p.bookingId === bookingId);

export const getRefundByPaymentId = (paymentId: string): Refund | undefined =>
    mockRefunds.find((r) => r.paymentId === paymentId);

export const getCommissionByPaymentId = (
    paymentId: string,
): Commission | undefined =>
    mockCommissions.find((c) => c.paymentId === paymentId);
