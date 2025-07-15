export interface Availability {
    availabilityId: string;
    experienceId: string;
    date: Date;
    startTime: string;         // HH:MM formato
    endTime: string;           // HH:MM formato
    spotsAvailable: number;
    isSoldOut: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Tipo extendido con información calculada
export interface AvailabilityWithBookings extends Availability {
    spotsBooked: number;
    actualSpotsAvailable: number;
}