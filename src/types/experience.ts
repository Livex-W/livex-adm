/* ============================================================================
 * 1. Model interfaces
 * ==========================================================================*/

// import { Availability } from "./availability";

export interface Category {
    categoryId: string;
    name: string;
    description: string;
    icon: string;          // Material-icon name
    image: string;         // URL
    displayOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Experience {
    experienceId: string;
    resortId: string;
    title: string;
    description: string;
    shortDescription: string;
    durationValue: number;
    durationUnit: 'hours' | 'minutes' | string;
    regularPrice: number;
    vipPrice: number;
    currency: string;      // ISO-4217, e.g. “COP”
    minCapacity: number;
    maxCapacity: number;
    cancellationPolicy: string;
    rating: number;        // 0-5
    reviewCount: number;
    status: 'active' | 'inactive' | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExperienceImage {
    experienceId: string;
    imageUrl: string;
    displayOrder: number;
}

export interface ExperienceCategory {
    experienceId: string;
    categoryId: string;
}

export interface ExperienceIncludedItem {
    experienceId: string;
    itemDescription: string;
}

export interface ExperienceNotIncludedItem {
    experienceId: string;
    itemDescription: string;
}

export interface ExperienceRequirement {
    experienceId: string;
    requirementDescription: string;
}

export interface ExperienceLocation {
    locationId: string;
    experienceId: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}

/* ============================================================================
 * 2. Utility helpers for relative dates (optional)
 *    – keeps the mock data fresh every time the file is imported
 * ==========================================================================*/

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);
// const daysAhead = (d: number) => new Date(Date.now() + d * 86_400_000);

/* ============================================================================
 * 3. Mock objects
 * ==========================================================================*/

/* -- Categories ------------------------------------------------------------ */
export const mockCategories: Category[] = [
    {
        categoryId: '5f8d5614-5b5e-4b3c-8c9a-9d6b5a9f5b3c',
        name: 'Playa',
        description: 'Experiencias en las playas más hermosas de Cartagena',
        icon: 'beach_access',
        image:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/67fccceafa7e0ec8cbf8216bc4368e9a.webp',
        displayOrder: 1,
        isActive: true,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(30),
    },
    {
        categoryId: '6c7e6715-6c6f-5d4d-9d8b-8e7c6b8f6c7e',
        name: 'Tour Acuático',
        description: 'Aventuras en el mar caribe y sus alrededores',
        icon: 'sailing',
        image:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/9872fb3f2054eb185c67db942d69c470.webp',
        displayOrder: 2,
        isActive: true,
        createdAt: daysAgo(55),
        updatedAt: daysAgo(25),
    },
    {
        categoryId: '7d8f7816-7d7g-6e5e-8e9c-9f8d7c9g7d8f',
        name: 'Gastronomía',
        description: 'Experiencias culinarias con lo mejor de la región',
        icon: 'restaurant',
        image:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/050d0b280f2e3ff48cc44f15a590fd20.webp',
        displayOrder: 3,
        isActive: true,
        createdAt: daysAgo(50),
        updatedAt: daysAgo(20),
    },
    {
        categoryId: '8e9g8917-8e8h-7f6f-9f0d-0g9e8d0h8e9g',
        name: 'Islas',
        description:
            'Visitas a las islas paradisíacas del Rosario y San Bernardo',
        icon: 'island',
        image:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/e294d2a7a3d2288027aa29531fdc7db5.webp',
        displayOrder: 4,
        isActive: true,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(15),
    },
    {
        categoryId: '9f0h9018-9f9i-8g7g-0g1e-1h0f9e1i9f0h',
        name: 'Vida Nocturna',
        description: 'Fiestas, bares y discotecas para vivir la noche cartagenera',
        icon: 'nightlife',
        image:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/851f0d7139ec14151ada290800ae9756.webp',
        displayOrder: 5,
        isActive: true,
        createdAt: daysAgo(40),
        updatedAt: daysAgo(10),
    },
    {
        categoryId: '0g1i0119-0g0j-9h8h-1h2f-2i1g0f2j0g1i',
        name: 'Historia y Cultura',
        description: 'Recorridos para conocer la historia de Cartagena',
        icon: 'museum',
        image:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/745dcaa6dc11bba6ee1d22c3e6456f13.webp',
        displayOrder: 6,
        isActive: true,
        createdAt: daysAgo(35),
        updatedAt: daysAgo(5),
    },
];

/* -- Experiences ----------------------------------------------------------- */
export const mockExperiences: Experience[] = [
    {
        experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        resortId: 'd4e5f6g7-h8i9-0987-6543-j2k3l4m5n6o7',
        title: 'Paseo en catamarán por las Islas del Rosario',
        description:
            'Disfruta de un día inolvidable navegando por las cristalinas aguas del Caribe colombiano. Nuestro catamarán te llevará a conocer las increíbles Islas del Rosario, donde podrás nadar, hacer snorkel y disfrutar de un almuerzo típico caribeño. Incluye transporte marítimo, guía bilingüe y bebidas refrescantes.',
        shortDescription:
            'Tour de día completo por las Islas del Rosario en catamarán',
        durationValue: 8,
        durationUnit: 'hours',
        regularPrice: 150_000,
        vipPrice: 135_000,
        currency: 'COP',
        minCapacity: 4,
        maxCapacity: 20,
        cancellationPolicy:
            'Cancelación gratuita hasta 48 horas antes. Después de ese tiempo, se aplica un cargo del 50%.',
        rating: 4.8,
        reviewCount: 124,
        status: 'active',
        createdAt: daysAgo(90),
        updatedAt: daysAgo(5),
    },
    {
        experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
        resortId: 'e5f6g7h8-i9j0-0987-6543-k3l4m5n6o7p8',
        title: 'Tour de Snorkel en Playa Blanca',
        description:
            'Explora los arrecifes de coral en Playa Blanca con nuestro tour de snorkel guiado. Te proporcionaremos todo el equipo necesario y tendrás un guía experto que te mostrará los mejores lugares para ver peces tropicales y corales. La experiencia incluye transporte desde tu hotel, equipamiento completo, refrigerios y bebidas hidratantes.',
        shortDescription: 'Descubre el mundo submarino de Playa Blanca',
        durationValue: 5,
        durationUnit: 'hours',
        regularPrice: 90_000,
        vipPrice: 81_000,
        currency: 'COP',
        minCapacity: 2,
        maxCapacity: 12,
        cancellationPolicy:
            'Cancelación gratuita hasta 24 horas antes. Cancelaciones el mismo día no son reembolsables.',
        rating: 4.6,
        reviewCount: 89,
        status: 'active',
        createdAt: daysAgo(85),
        updatedAt: daysAgo(7),
    },
    {
        experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
        resortId: 'f6g7h8i9-j0k1-0987-6543-l4m5n6o7p8q9',
        title: 'Cena Romántica en Velero al Atardecer',
        description:
            'Sorprende a tu pareja con una cena romántica a bordo de un velero exclusivo mientras el sol se pone sobre la bahía de Cartagena. Disfruta de una experiencia íntima con cena gourmet de 3 tiempos preparada por nuestro chef, música ambiental, vino y el impresionante paisaje del atardecer.',
        shortDescription: 'Cena exclusiva en velero al atardecer sobre la bahía',
        durationValue: 3,
        durationUnit: 'hours',
        regularPrice: 280_000,
        vipPrice: 252_000,
        currency: 'COP',
        minCapacity: 2,
        maxCapacity: 2,
        cancellationPolicy:
            'Cancelación gratuita hasta 72 horas antes. Después se aplica cargo del 70%.',
        rating: 4.9,
        reviewCount: 63,
        status: 'active',
        createdAt: daysAgo(75),
        updatedAt: daysAgo(3),
    },
    {
        experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
        resortId: 'g7h8i9j0-k1l2-0987-6543-m5n6o7p8q9r0',
        title: 'Tour Histórico por la Ciudad Amurallada',
        description:
            'Recorre las calles empedradas y conoce la fascinante historia de Cartagena en este tour a pie por la Ciudad Amurallada. Nuestro guía experto te llevará a los sitios más emblemáticos como el Castillo San Felipe, Las Bóvedas, la Catedral y las hermosas plazas coloniales.',
        shortDescription: 'Recorrido cultural por el centro histórico de Cartagena',
        durationValue: 4,
        durationUnit: 'hours',
        regularPrice: 70_000,
        vipPrice: 63_000,
        currency: 'COP',
        minCapacity: 1,
        maxCapacity: 15,
        cancellationPolicy:
            'Cancelación gratuita hasta 24 horas antes. Después no hay reembolso.',
        rating: 4.7,
        reviewCount: 212,
        status: 'active',
        createdAt: daysAgo(120),
        updatedAt: daysAgo(10),
    },
    {
        experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678',
        resortId: 'h8i9j0k1-l2m3-0987-6543-n6o7p8q9r0s1',
        title: 'Clase de Cocina Caribeña Tradicional',
        description:
            'Aprende a preparar auténticos platos del Caribe colombiano en esta clase interactiva de cocina. Nuestro chef te guiará en la preparación de delicias locales como arroz con coco, patacones, ceviche cartagenero y postre de frutas tropicales.',
        shortDescription: 'Aprende a cocinar platos tradicionales del Caribe',
        durationValue: 3,
        durationUnit: 'hours',
        regularPrice: 120_000,
        vipPrice: 108_000,
        currency: 'COP',
        minCapacity: 2,
        maxCapacity: 8,
        cancellationPolicy:
            'Cancelación gratuita hasta 48 horas antes. Después se aplica un cargo del 50%.',
        rating: 4.8,
        reviewCount: 45,
        status: 'active',
        createdAt: daysAgo(60),
        updatedAt: daysAgo(15),
    },
];

/* -- Experience images ----------------------------------------------------- */
export const mockExperienceImages: ExperienceImage[] = [
    /* Paseo en catamarán */
    {
        experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/92263ec9516a5881b1edb8b08503b529.webp',
        displayOrder: 1,
    },
    {
        experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/d20f4a22a901e0c25f0029c34e3100f6.webp',
        displayOrder: 2,
    },
    {
        experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/d20f4a22a901e0c25f0029c34e3100f6.webp',
        displayOrder: 3,
    },

    /* Tour snorkel */
    {
        experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/e294d2a7a3d2288027aa29531fdc7db5.webp',
        displayOrder: 1,
    },
    {
        experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/2376b53f5114b82712a75fe415b24417.webp',
        displayOrder: 2,
    },
    {
        experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/e294d2a7a3d2288027aa29531fdc7db5.webp',
        displayOrder: 3,
    },

    /* Cena romántica */
    {
        experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/851f0d7139ec14151ada290800ae9756.webp',
        displayOrder: 1,
    },
    {
        experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/050d0b280f2e3ff48cc44f15a590fd20.webp',
        displayOrder: 2,
    },
    {
        experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/050d0b280f2e3ff48cc44f15a590fd20.webp',
        displayOrder: 3,
    },

    /* Tour histórico */
    {
        experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/745dcaa6dc11bba6ee1d22c3e6456f13.webp',
        displayOrder: 1,
    },
    {
        experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/745dcaa6dc11bba6ee1d22c3e6456f13.webp',
        displayOrder: 2,
    },
    {
        experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/6b16c97914442180466481df5217510e.webp',
        displayOrder: 3,
    },

    /* Clase de cocina */
    {
        experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/9872fb3f2054eb185c67db942d69c470.webp',
        displayOrder: 1,
    },
    {
        experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/67fccceafa7e0ec8cbf8216bc4368e9a.webp',
        displayOrder: 2,
    },
    {
        experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678',
        imageUrl:
            'https://nabdgzjpwhkjfimljnql.supabase.co/storage/v1/object/public/replicate-cache/9872fb3f2054eb185c67db942d69c470.webp',
        displayOrder: 3,
    },
];

/* -- Experience-category relations ---------------------------------------- */
export const mockExperienceCategories: ExperienceCategory[] = [
    /* Paseo catamarán */
    {
        experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        categoryId: '6c7e6715-6c6f-5d4d-9d8b-8e7c6b8f6c7e', // Tour Acuático
    },
    {
        experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        categoryId: '8e9g8917-8e8h-7f6f-9f0d-0g9e8d0h8e9g', // Islas
    },

    /* Tour snorkel */
    {
        experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
        categoryId: '5f8d5614-5b5e-4b3c-8c9a-9d6b5a9f5b3c', // Playa
    },
    {
        experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
        categoryId: '6c7e6715-6c6f-5d4d-9d8b-8e7c6b8f6c7e', // Tour Acuático
    },

    /* Cena romántica */
    {
        experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
        categoryId: '7d8f7816-7d7g-6e5e-8e9c-9f8d7c9g7d8f', // Gastronomía
    },
    {
        experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
        categoryId: '6c7e6715-6c6f-5d4d-9d8b-8e7c6b8f6c7e', // Tour Acuático
    },

    /* Tour histórico */
    {
        experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
        categoryId: '0g1i0119-0g0j-9h8h-1h2f-2i1g0f2j0g1i', // Historia y Cultura
    },

    /* Clase de cocina */
    {
        experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678',
        categoryId: '7d8f7816-7d7g-6e5e-8e9c-9f8d7c9g7d8f', // Gastronomía
    },
];

/* -- Items incluidos ------------------------------------------------------- */
export const mockIncludedItems: ExperienceIncludedItem[] = [
    /* Paseo catamarán */      { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', itemDescription: 'Transporte marítimo ida y vuelta' },
    { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', itemDescription: 'Almuerzo típico' },
    { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', itemDescription: 'Bebidas no alcohólicas' },
    { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', itemDescription: 'Guía bilingüe' },

    /* Tour snorkel */         { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', itemDescription: 'Transporte desde el hotel' },
    { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', itemDescription: 'Equipo completo de snorkel' },
    { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', itemDescription: 'Refrigerios y bebidas hidratantes' },
    { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', itemDescription: 'Guía experto en snorkel' },

    /* Cena romántica */       { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', itemDescription: 'Cena gourmet de 3 tiempos' },
    { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', itemDescription: 'Botella de vino' },
    { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', itemDescription: 'Música ambiental' },
    { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', itemDescription: 'Servicio exclusivo para 2 personas' },

    /* Tour histórico */       { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', itemDescription: 'Guía experto en historia' },
    { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', itemDescription: 'Entrada a sitios históricos' },
    { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', itemDescription: 'Botella de agua' },

    /* Clase cocina */         { experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678', itemDescription: 'Todos los ingredientes' },
    { experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678', itemDescription: 'Delantal para usar durante la clase' },
    { experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678', itemDescription: 'Recetario impreso para llevar' },
    { experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678', itemDescription: 'Degustación de lo preparado con bebidas' },
];

/* -- Items NO incluidos ---------------------------------------------------- */
export const mockNotIncludedItems: ExperienceNotIncludedItem[] = [
    /* Paseo catamarán */      { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', itemDescription: 'Impuesto de entrada al Parque Nacional (aprox. 25.000 COP)' },
    { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', itemDescription: 'Bebidas alcohólicas' },
    { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', itemDescription: 'Propinas' },

    /* Tour snorkel */         { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', itemDescription: 'Almuerzo' },
    { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', itemDescription: 'Toalla y artículos personales' },
    { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', itemDescription: 'Fotos subacuáticas (disponibles por un costo adicional)' },

    /* Cena romántica */       { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', itemDescription: 'Transporte hacia/desde el puerto' },
    { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', itemDescription: 'Licores adicionales a la botella incluida' },
    { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', itemDescription: 'Sesión fotográfica profesional (disponible por un costo adicional)' },

    /* Tour histórico */       { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', itemDescription: 'Alimentos y bebidas adicionales' },
    { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', itemDescription: 'Transporte hacia/desde el punto de encuentro' },

    /* Clase cocina */         { experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678', itemDescription: 'Transporte hacia/desde la ubicación' },
    { experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678', itemDescription: 'Bebidas alcohólicas adicionales' },
];

/* -- Requisitos ----------------------------------------------------------- */
export const mockRequirements: ExperienceRequirement[] = [
    /* Paseo catamarán */      { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', requirementDescription: 'Llevar ropa de baño' },
    { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', requirementDescription: 'Protector solar' },
    { experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', requirementDescription: 'Documento de identidad' },

    /* Tour snorkel */         { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', requirementDescription: 'Saber nadar' },
    { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', requirementDescription: 'Ropa de baño' },
    { experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345', requirementDescription: 'Protector solar biodegradable' },

    /* Cena romántica */       { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', requirementDescription: 'Ropa semi-formal' },
    { experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456', requirementDescription: 'Avisar con anticipación alergias o restricciones alimentarias' },

    /* Tour histórico */       { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', requirementDescription: 'Calzado cómodo para caminar' },
    { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', requirementDescription: 'Protección solar (gorra, sombrero)' },
    { experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567', requirementDescription: 'Buen estado físico para caminar durante 4 horas' },

    /* Clase cocina */         { experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678', requirementDescription: 'Avisar con anticipación alergias o restricciones alimentarias' },
];

/* -- Locations ------------------------------------------------------------ */
export const mockLocations: ExperienceLocation[] = [
    {
        locationId: 'l1m2n3o4-p5q6-7890-abcd-rs1234567890',
        experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        name: 'Muelle de la Bodeguita',
        address: 'Av. Blas de Lezo, Centro Histórico',
        city: 'Cartagena',
        latitude: 10.4227,
        longitude: -75.5480,
        createdAt: daysAgo(90),
        updatedAt: daysAgo(90),
    },
    {
        locationId: 'm2n3o4p5-q6r7-8901-2345-st2345678901',
        experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
        name: 'Playa Blanca',
        address: 'Isla de Barú',
        city: 'Cartagena',
        latitude: 10.2374,
        longitude: -75.5961,
        createdAt: daysAgo(85),
        updatedAt: daysAgo(85),
    },
    {
        locationId: 'n3o4p5q6-r7s8-9012-3456-tu3456789012',
        experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
        name: 'Marina Club de Pesca',
        address: 'Manga, Fuerte de San Sebastián del Pastelillo',
        city: 'Cartagena',
        latitude: 10.4098,
        longitude: -75.5446,
        createdAt: daysAgo(75),
        updatedAt: daysAgo(75),
    },
    {
        locationId: 'o4p5q6r7-s8t9-0123-4567-uv4567890123',
        experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
        name: 'Plaza de los Coches',
        address: 'Centro Histórico',
        city: 'Cartagena',
        latitude: 10.4249,
        longitude: -75.5516,
        createdAt: daysAgo(120),
        updatedAt: daysAgo(120),
    },
    {
        locationId: 'p5q6r7s8-t9u0-1234-5678-vw5678901234',
        experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678',
        name: 'Escuela de Cocina Cartagenera',
        address: 'Calle del Santísimo #8-15, Getsemaní',
        city: 'Cartagena',
        latitude: 10.4215,
        longitude: -75.5489,
        createdAt: daysAgo(60),
        updatedAt: daysAgo(60),
    },
];

// /* -- Availabilities ------------------------------------------------------- */
// export const mockAvailabilities: Availability[] = [
//     /* Paseo catamarán */      {
//         availabilityId: 'av1b2c3-d4e5-6789-abcd-ef1234567890',
//         experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
//         date: daysAhead(1),
//         startTime: '08:00',
//         endTime: '16:00',
//         spotsAvailable: 12,
//         isSoldOut: false,
//         createdAt: daysAgo(10),
//         updatedAt: daysAgo(2),
//     },
//     {
//         availabilityId: 'av2c3d4-e5f6-7890-bcde-f1234567890a',
//         experienceId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
//         date: daysAhead(2),
//         startTime: '08:00',
//         endTime: '16:00',
//         spotsAvailable: 20,
//         isSoldOut: false,
//         createdAt: daysAgo(10),
//         updatedAt: daysAgo(10),
//     },

//     /* Tour snorkel */         {
//         availabilityId: 'av4e5f6-g7h8-9012-defg-23456789012c',
//         experienceId: 'b2c3d4e5-f6g7-8901-2345-hi6789012345',
//         date: daysAhead(1),
//         startTime: '09:00',
//         endTime: '14:00',
//         spotsAvailable: 8,
//         isSoldOut: false,
//         createdAt: daysAgo(15),
//         updatedAt: daysAgo(5),
//     },

//     /* Cena romántica */       {
//         availabilityId: 'av6g7h8-i9j0-1234-fghi-45678901234e',
//         experienceId: 'c3d4e5f6-g7h8-9012-3456-ij7890123456',
//         date: daysAhead(1),
//         startTime: '17:30',
//         endTime: '20:30',
//         spotsAvailable: 2,
//         isSoldOut: false,
//         createdAt: daysAgo(20),
//         updatedAt: daysAgo(3),
//     },

//     /* Tour histórico */       {
//         availabilityId: 'av8i9j0-k1l2-3456-hijk-67890123456g',
//         experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
//         date: daysAhead(1),
//         startTime: '09:00',
//         endTime: '13:00',
//         spotsAvailable: 10,
//         isSoldOut: false,
//         createdAt: daysAgo(25),
//         updatedAt: daysAgo(1),
//     },
//     {
//         availabilityId: 'av9j0k1-l2m3-4567-ijkl-78901234567h',
//         experienceId: 'd4e5f6g7-h8i9-0123-4567-jk8901234567',
//         date: daysAhead(1),
//         startTime: '15:00',
//         endTime: '19:00',
//         spotsAvailable: 15,
//         isSoldOut: false,
//         createdAt: daysAgo(25),
//         updatedAt: daysAgo(25),
//     },

//     /* Clase cocina */         {
//         availabilityId: 'av0k1l2-m3n4-5678-jklm-89012345678i',
//         experienceId: 'e5f6g7h8-i9j0-1234-5678-kl9012345678',
//         date: daysAhead(2),
//         startTime: '10:00',
//         endTime: '13:00',
//         spotsAvailable: 8,
//         isSoldOut: false,
//         createdAt: daysAgo(30),
//         updatedAt: daysAgo(4),
//     },
// ];
