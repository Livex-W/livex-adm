export enum ResortStatus {
    pending = 'Pending',
    active = 'Active',
    inactive = 'Inactive',
}

export enum DayOfWeek {
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday',
    sunday = 'sunday',
}

export interface Resort {
    resortId: string;
    name: string;
    description: string;
    logo: string;              // URL
    email: string;
    phone: string;
    website?: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone?: string;
    commissionRate: number;    // Porcentaje (ej: 10.00)
    status: ResortStatus;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ResortAddress {
    addressId: string;
    resortId: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ResortImage {
    resortId: string;
    imageUrl: string;
    isCover: boolean;
    displayOrder: number;
}

export interface ResortBusinessHours {
    resortId: string;
    dayOfWeek: DayOfWeek;
    openTime?: string;         // HH:MM formato
    closeTime?: string;        // HH:MM formato
    isClosed: boolean;
}

export interface ResortBankInfo {
    bankInfoId: string;
    resortId: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
    bankCode?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Tipo completo que agrupa toda la información del resort
export interface ResortProfile {
    resort: Resort;
    address: ResortAddress;
    images: ResortImage[];
    businessHours: ResortBusinessHours[];
    bankInfo?: ResortBankInfo;
}
