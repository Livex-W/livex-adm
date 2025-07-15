import {
    Category,
    Experience,
    ExperienceImage,
    ExperienceCategory,
    ExperienceIncludedItem,
    ExperienceNotIncludedItem,
    ExperienceRequirement,
    ExperienceLocation
} from '../types/experience';

export const mockCategories: Category[] = [
    {
        categoryId: "c1a2b3c4-d5e6-7890-abcd-ef1234567890",
        name: "Tours acuáticos",
        description: "Experiencias en el mar, islas y actividades acuáticas",
        icon: "waves",
        image: "https://storage.livex.com/categories/water-tours.jpg",
        displayOrder: 1,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        categoryId: "d2c3b4a5-e6f7-8901-2345-67890abcdef1",
        name: "Islas",
        description: "Tours a las islas cercanas a Cartagena",
        icon: "terrain",
        image: "https://storage.livex.com/categories/islands.jpg",
        displayOrder: 2,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        categoryId: "e3d4c5b6-a7b8-9012-3456-789012bcdef2",
        name: "Cultura",
        description: "Tours culturales e históricos por Cartagena",
        icon: "museum",
        image: "https://storage.livex.com/categories/culture.jpg",
        displayOrder: 3,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        categoryId: "f4e5d6c7-b8a9-0123-4567-890123cdef34",
        name: "Gastronomía",
        description: "Experiencias culinarias y tours gastronómicos",
        icon: "restaurant",
        image: "https://storage.livex.com/categories/gastronomy.jpg",
        displayOrder: 4,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    },
    {
        categoryId: "a5f6e7d8-c9b0-1234-5678-901234def456",
        name: "Aventura",
        description: "Deportes extremos y actividades de aventura",
        icon: "hiking",
        image: "https://storage.livex.com/categories/adventure.jpg",
        displayOrder: 5,
        isActive: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01")
    }
];

export const mockExperiences: Experience[] = [
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        title: "Paseo en catamarán por las Islas del Rosario",
        description: "Disfruta de un día inolvidable navegando por las cristalinas aguas del Caribe colombiano. Visitaremos las hermosas Islas del Rosario, donde podrás nadar, hacer snorkel y relajarte en playas paradisíacas. Incluye almuerzo típico isleño y bebidas.",
        shortDescription: "Tour de día completo por las Islas del Rosario en catamarán con almuerzo incluido",
        durationValue: 8,
        durationUnit: "hours",
        regularPrice: 150000,
        vipPrice: 135000,
        currency: "COP",
        minCapacity: 4,
        maxCapacity: 20,
        cancellationPolicy: "Cancelación gratuita hasta 48 horas antes. Entre 24-48 horas se cobra 50%. Menos de 24 horas no hay reembolso.",
        rating: 4.8,
        reviewCount: 127,
        status: "active",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-05-10")
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        resortId: "09876543-21fe-dcba-0987-6543210fedcba",
        title: "Bautismo de Buceo en Islas del Rosario",
        description: "Descubre el fascinante mundo submarino del Caribe. No necesitas experiencia previa. Nuestros instructores certificados PADI te guiarán en esta aventura submarina segura y emocionante.",
        shortDescription: "Primera experiencia de buceo con instructores certificados",
        durationValue: 3,
        durationUnit: "hours",
        regularPrice: 250000,
        vipPrice: 225000,
        currency: "COP",
        minCapacity: 2,
        maxCapacity: 8,
        cancellationPolicy: "Cancelación gratuita hasta 24 horas antes. No hay reembolso después.",
        rating: 4.9,
        reviewCount: 89,
        status: "active",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-05-12")
    },
    {
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        resortId: "12345678-abcd-ef01-2345-6789abcdef01",
        title: "Tour Gastronómico Nocturno por Cartagena",
        description: "Explora los sabores de Cartagena en este tour culinario nocturno. Visitaremos los mejores lugares locales para probar comida típica cartagenera, desde arepas de huevo hasta cocadas.",
        shortDescription: "Tour culinario por los mejores spots gastronómicos de la ciudad",
        durationValue: 4,
        durationUnit: "hours",
        regularPrice: 120000,
        vipPrice: 108000,
        currency: "COP",
        minCapacity: 4,
        maxCapacity: 12,
        cancellationPolicy: "Cancelación gratuita hasta 12 horas antes.",
        rating: 4.7,
        reviewCount: 64,
        status: "active",
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-05-08")
    }
];

export const mockExperienceImages: ExperienceImage[] = [
    // Catamarán
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        imageUrl: "https://storage.livex.com/experiences/catamaran-main.jpg",
        displayOrder: 1
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        imageUrl: "https://storage.livex.com/experiences/catamaran-beach.jpg",
        displayOrder: 2
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        imageUrl: "https://storage.livex.com/experiences/catamaran-lunch.jpg",
        displayOrder: 3
    },
    // Buceo
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        imageUrl: "https://storage.livex.com/experiences/diving-underwater.jpg",
        displayOrder: 1
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        imageUrl: "https://storage.livex.com/experiences/diving-equipment.jpg",
        displayOrder: 2
    }
];

export const mockExperienceCategories: ExperienceCategory[] = [
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        categoryId: "c1a2b3c4-d5e6-7890-abcd-ef1234567890" // Tours acuáticos
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        categoryId: "d2c3b4a5-e6f7-8901-2345-67890abcdef1" // Islas
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        categoryId: "c1a2b3c4-d5e6-7890-abcd-ef1234567890" // Tours acuáticos
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        categoryId: "a5f6e7d8-c9b0-1234-5678-901234def456" // Aventura
    },
    {
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        categoryId: "f4e5d6c7-b8a9-0123-4567-890123cdef34" // Gastronomía
    },
    {
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        categoryId: "e3d4c5b6-a7b8-9012-3456-789012bcdef2" // Cultura
    }
];

export const mockExperienceIncludedItems: ExperienceIncludedItem[] = [
    // Catamarán
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Transporte marítimo ida y vuelta en catamarán"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Almuerzo típico isleño (pescado, arroz con coco, patacones)"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Bebidas no alcohólicas ilimitadas"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Guía bilingüe (español/inglés)"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Equipo de snorkel"
    },
    // Buceo
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        itemDescription: "Todo el equipo de buceo profesional"
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        itemDescription: "Instructor certificado PADI"
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        itemDescription: "Transporte marítimo al sitio de buceo"
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        itemDescription: "Snacks y bebidas"
    }
];

export const mockExperienceNotIncludedItems: ExperienceNotIncludedItem[] = [
    // Catamarán
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Impuesto de entrada al Parque Nacional (aprox. 25.000 COP)"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Bebidas alcohólicas"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        itemDescription: "Propinas"
    },
    // Buceo
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        itemDescription: "Certificación PADI (disponible por costo adicional)"
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        itemDescription: "Fotos y videos submarinos"
    }
];

export const mockExperienceRequirements: ExperienceRequirement[] = [
    // Catamarán
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        requirementDescription: "Llevar ropa de baño y ropa de cambio"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        requirementDescription: "Protector solar biodegradable"
    },
    {
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        requirementDescription: "Documento de identidad"
    },
    // Buceo
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        requirementDescription: "Edad mínima: 10 años"
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        requirementDescription: "Saber nadar"
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        requirementDescription: "No tener problemas cardíacos o respiratorios"
    },
    {
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        requirementDescription: "Completar formulario médico"
    }
];

export const mockExperienceLocations: ExperienceLocation[] = [
    {
        locationId: "loc-001",
        experienceId: "f7e6d5c4-b3a2-1098-7654-321fedcba098",
        name: "Muelle de la Bodeguita",
        address: "Av. Blas de Lezo, Centro Histórico",
        city: "Cartagena",
        latitude: 10.4227,
        longitude: -75.5480,
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-01-20")
    },
    {
        locationId: "loc-002",
        experienceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        name: "Marina de Manga",
        address: "Cra 21 #25-92, Manga",
        city: "Cartagena",
        latitude: 10.4167,
        longitude: -75.5333,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-01")
    },
    {
        locationId: "loc-003",
        experienceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        name: "Plaza de los Coches",
        address: "Plaza de los Coches, Centro Histórico",
        city: "Cartagena",
        latitude: 10.4238,
        longitude: -75.5511,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15")
    }
];
