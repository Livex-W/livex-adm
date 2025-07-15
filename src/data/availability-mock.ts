import { Availability } from "@/types/availability";

export const mockAvailability: Availability[] = [
    // Paseo en catamarán - próximos 7 días
    {
        availabilityId: "avail-001",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        date: new Date("2024-05-15"),
        startTime: "08:00",
        endTime: "16:00",
        spotsAvailable: 20,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },
    {
        availabilityId: "avail-002",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        date: new Date("2024-05-16"),
        startTime: "08:00",
        endTime: "16:00",
        spotsAvailable: 20,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },
    {
        availabilityId: "avail-003",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        date: new Date("2024-05-17"),
        startTime: "08:00",
        endTime: "16:00",
        spotsAvailable: 20,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },
    {
        availabilityId: "avail-004",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        date: new Date("2024-05-18"),
        startTime: "09:00",
        endTime: "17:00",
        spotsAvailable: 25,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },

    // Tour de Buceo - varios horarios por día
    {
        availabilityId: "avail-005",
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        date: new Date("2024-05-15"),
        startTime: "09:00",
        endTime: "12:00",
        spotsAvailable: 8,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },
    {
        availabilityId: "avail-006",
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        date: new Date("2024-05-15"),
        startTime: "14:00",
        endTime: "17:00",
        spotsAvailable: 8,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },

    // Tour gastronómico - horario nocturno
    {
        availabilityId: "avail-007",
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        date: new Date("2024-05-15"),
        startTime: "18:00",
        endTime: "22:00",
        spotsAvailable: 12,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },
    {
        availabilityId: "avail-008",
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        date: new Date("2024-05-16"),
        startTime: "18:00",
        endTime: "22:00",
        spotsAvailable: 12,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    },

    // Ejemplo de un slot casi lleno
    {
        availabilityId: "avail-009",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        date: new Date("2024-05-20"),
        startTime: "08:00",
        endTime: "16:00",
        spotsAvailable: 3,
        isSoldOut: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-14")
    },

    // Ejemplo de un slot agotado
    {
        availabilityId: "avail-010",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        date: new Date("2024-05-25"),
        startTime: "08:00",
        endTime: "16:00",
        spotsAvailable: 0,
        isSoldOut: true,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-10")
    }
];

// Helper functions
export function generateAvailabilityForMonth(
    experienceId: string,
    year: number,
    month: number,
    dailySpots: number,
    startTime: string,
    endTime: string,
    excludeDays: number[] = [0] // Por defecto excluye domingos
): Availability[] {
    const availability: Availability[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();

        if (!excludeDays.includes(dayOfWeek)) {
            availability.push({
                availabilityId: `avail-${experienceId}-${year}-${month}-${day}`,
                experienceId,
                date,
                startTime,
                endTime,
                spotsAvailable: dailySpots,
                isSoldOut: false,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }

    return availability;
}

export function checkAvailability(
    availability: Availability,
    requestedSpots: number
): boolean {
    return !availability.isSoldOut &&
        availability.spotsAvailable >= requestedSpots;
}

export function updateAvailabilitySpots(
    availability: Availability,
    bookedSpots: number
): Availability {
    const newSpotsAvailable = availability.spotsAvailable - bookedSpots;

    return {
        ...availability,
        spotsAvailable: newSpotsAvailable,
        isSoldOut: newSpotsAvailable <= 0,
        updatedAt: new Date()
    };
}
