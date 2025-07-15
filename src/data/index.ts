// ===========================
// INTERFACES
// ===========================

// User interfaces
export * from '../types/user';

// Experience interfaces
export * from '../types/experience';

// Booking interfaces
export * from '../types/booking';

// Review interfaces
// export * from '../types/review';

// Resort interfaces
export * from '../types/resort';

// Admin interfaces
export * from '../types/admin';

// Availability interfaces
export * from '../types/availability';

// ===========================
// MOCK DATA
// ===========================

// User mock data
export * from './user-mock';

// Experience mock data
// export * from './experience-mock';

// Booking and Review mock data
// export * from './booking-review-mock';

// Resort mock data (from resort.ts)
export {
    mockResorts,
    mockResortAddresses,
    mockResortImages,
    mockResortBusinessHours,
    mockResortBankInfo
} from './resort-mock';

// Admin mock data (from admin.ts)
export {
    mockAdmins,
    mockAdminPermissions
} from './admin-mock';

// Availability mock data (from availability.ts)
export {
    mockAvailability
} from './availability-mock';

// ===========================
// COMPLETE DATA STRUCTURE EXAMPLE
// ===========================

import { mockExperiences } from './experience-mock';
import { mockResorts } from './resort-mock';
import { mockUsers } from './user-mock';
import { mockBookings } from './booking-review-mock';
import { mockReviews } from './booking-review-mock';

// Example: Get a complete experience with all related data
export function getCompleteExperience(experienceId: string) {
    const experience = mockExperiences.find(e => e.experienceId === experienceId);
    if (!experience) return null;

    const resort = mockResorts.find(r => r.resortId === experience.resortId);
    const bookings = mockBookings.filter(b => b.experienceId === experienceId);
    const reviews = mockReviews.filter(r => r.experienceId === experienceId);

    return {
        experience,
        resort,
        bookings,
        reviews,
        totalBookings: bookings.length,
        averageRating: experience.rating
    };
}

// Example: Get user booking history
export function getUserBookingHistory(userId: string) {
    const user = mockUsers.find(u => u.userId === userId);
    if (!user) return null;

    const bookings = mockBookings.filter(b => b.userId === userId);
    const bookingsWithDetails = bookings.map(booking => {
        const experience = mockExperiences.find(e => e.experienceId === booking.experienceId);
        const resort = experience ? mockResorts.find(r => r.resortId === experience.resortId) : null;
        const review = mockReviews.find(r => r.bookingId === booking.bookingId);

        return {
            booking,
            experience,
            resort,
            review
        };
    });

    return {
        user,
        bookings: bookingsWithDetails,
        totalSpent: bookings.reduce((sum, b) => sum + b.total, 0),
        experiencesCount: bookings.filter(b => b.status === 'completed').length
    };
}