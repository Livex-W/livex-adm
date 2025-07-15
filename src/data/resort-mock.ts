import {
    DayOfWeek,
    Resort,
    ResortAddress,
    ResortBankInfo,
    ResortBusinessHours,
    ResortImage,
    ResortStatus
} from "@/types/resort";

export const mockResorts: Resort[] = [
    {
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        name: "Aventuras Caribe",
        description: "Ofrecemos las mejores experiencias acuáticas en Cartagena con tours personalizados a las Islas del Rosario, clases de buceo y deportes náuticos.",
        logo: "https://storage.livex.com/resorts/aventuras-caribe-logo.png",
        email: "info@aventurascaribe.com",
        phone: "+573001234567",
        website: "https://aventurascaribe.com",
        ownerName: "Carlos Rodríguez",
        ownerEmail: "carlos@aventurascaribe.com",
        ownerPhone: "+573009876543",
        commissionRate: 10.00,
        status: ResortStatus.active,
        verified: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15")
    },
    {
        resortId: "12345678-abcd-ef01-2345-6789abcdef01",
        name: "Playa Blanca Tours",
        description: "Especialistas en tours a Playa Blanca con transporte en lancha rápida, almuerzo típico y actividades de playa.",
        logo: "https://storage.livex.com/resorts/playa-blanca-tours-logo.png",
        email: "reservas@playablancatours.co",
        phone: "+573012345678",
        website: "https://playablancatours.co",
        ownerName: "María Fernanda López",
        ownerEmail: "maria@playablancatours.co",
        ownerPhone: "+573019876543",
        commissionRate: 12.00,
        status: ResortStatus.active,
        verified: true,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10")
    },
    {
        resortId: "98765432-fedc-ba09-8765-432109876543",
        name: "Eco Adventures Cartagena",
        description: "Tours ecológicos por los manglares de la Ciénaga de la Virgen, avistamiento de aves y kayaking.",
        logo: "https://storage.livex.com/resorts/eco-adventures-logo.png",
        email: "contacto@ecoadventures.com.co",
        phone: "+573003456789",
        ownerName: "Andrés Martínez",
        ownerEmail: "andres@ecoadventures.com.co",
        commissionRate: 10.00,
        status: ResortStatus.pending,
        verified: false,
        createdAt: new Date("2024-05-01"),
        updatedAt: new Date("2024-05-01")
    }
];

export const mockResortAddresses: ResortAddress[] = [
    {
        addressId: "addr-001",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        street: "Calle 25 #5-67, Bocagrande",
        city: "Cartagena",
        state: "Bolívar",
        country: "Colombia",
        postalCode: "130001",
        latitude: 10.4118,
        longitude: -75.5513,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15")
    },
    {
        addressId: "addr-002",
        resortId: "12345678-abcd-ef01-2345-6789abcdef01",
        street: "Av. San Martín #14-22, Centro",
        city: "Cartagena",
        state: "Bolívar",
        country: "Colombia",
        postalCode: "130001",
        latitude: 10.4227,
        longitude: -75.5480,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10")
    },
    {
        addressId: "addr-003",
        resortId: "98765432-fedc-ba09-8765-432109876543",
        street: "Av. San Martín #14-22, Centro",
        city: "Cartagena",
        state: "Bolívar",
        country: "Colombia",
        postalCode: "130001",
        latitude: 10.4227,
        longitude: -75.5480,
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10")
    }
];

export const mockResortImages: ResortImage[] = [
    {
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        imageUrl: "https://storage.livex.com/resorts/aventuras-caribe-cover.jpg",
        isCover: true,
        displayOrder: 1
    },
    {
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        imageUrl: "https://storage.livex.com/resorts/aventuras-caribe-boats.jpg",
        isCover: false,
        displayOrder: 2
    },
    {
        resortId: "12345678-abcd-ef01-2345-6789abcdef01",
        imageUrl: "https://storage.livex.com/resorts/playa-blanca-beach.jpg",
        isCover: true,
        displayOrder: 1
    }
];

export const mockResortBusinessHours: ResortBusinessHours[] = [
    // Aventuras Caribe - Lunes a Viernes
    ...Object.values(DayOfWeek).slice(0, 5).map(day => ({
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        dayOfWeek: day as DayOfWeek,
        openTime: "08:00",
        closeTime: "18:00",
        isClosed: false
    })),
    // Aventuras Caribe - Sábado
    {
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        dayOfWeek: DayOfWeek.saturday,
        openTime: "09:00",
        closeTime: "20:00",
        isClosed: false
    },
    // Aventuras Caribe - Domingo
    {
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        dayOfWeek: DayOfWeek.sunday,
        openTime: "09:00",
        closeTime: "16:00",
        isClosed: false
    }
];

export const mockResortBankInfo: ResortBankInfo[] = [
    {
        bankInfoId: "bank-001",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        accountName: "Aventuras Caribe S.A.S",
        accountNumber: "1234567890",
        bankName: "Bancolombia",
        bankCode: "007",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15")
    },
    {
        bankInfoId: "bank-002",
        resortId: "12345678-abcd-ef01-2345-6789abcdef01",
        accountName: "Playa Blanca Tours Ltda",
        accountNumber: "9876543210",
        bankName: "Banco de Bogotá",
        bankCode: "001",
        createdAt: new Date("2024-02-10"),
        updatedAt: new Date("2024-02-10")
    }
];
