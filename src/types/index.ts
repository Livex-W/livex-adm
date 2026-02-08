// API Types aligned with NestJS backend

// ==================== User & Auth ====================
export interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'user' | 'resort' | 'agent' | 'admin' | 'partner';
    avatar?: string; // changed from avatar_url to match backend DTO likely or null
    phone?: string;
    isVip?: boolean;
    createdAt: string;
    updatedAt: string;
    documentType?: string;
    documentNumber?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt?: string;
    refreshTokenExpiresAt?: string;
}

export interface AuthResponse {
    tokens: AuthTokens;
    user: User;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    fullName: string;
    nit?: string;
    rnt?: string;
    role?: 'resort';
}

// ==================== Resort ====================
export type ResortDocType = 'camara_comercio' | 'rut_nit' | 'rnt' | 'other';
export type DocumentStatus = 'uploaded' | 'under_review' | 'approved' | 'rejected';
export type ResortStatus = 'draft' | 'under_review' | 'approved' | 'rejected';

export interface OperatingHours {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    open_time: string;  // HH:mm
    close_time: string; // HH:mm
    is_closed: boolean;
}

// Resort related data types
export interface ResortDocument {
    id: string;
    doc_type: ResortDocType;
    file_url: string;
    status: DocumentStatus;
    rejection_reason?: string;
    reviewed_at?: string;
    uploaded_at: string;
    created_at: string;
    updated_at: string;
}

export interface ResortBankInfo {
    id: string;
    bank_name: string;
    account_holder: string;
    account_number: string;
    account_type?: string;
    tax_id?: string;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface ResortAgent {
    id: string;
    resort_id?: string;
    user_id: string;
    commission_bps: number;
    is_active: boolean;
    agent_email?: string;
    agent_name?: string;
    created_at: string;
    updated_at: string;
}

// Complete Resort Profile with all related data
export interface ResortProfile {
    id: string;
    name: string;
    description?: string;
    website?: string;
    contact_email?: string;
    contact_phone?: string;
    address_line?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    nit?: string;
    rnt?: string;
    owner_user_id: string;
    is_active: boolean;
    status: ResortStatus;
    approved_by?: string;
    approved_at?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;

    // Related data
    documents: ResortDocument[];
    bank_info: ResortBankInfo[];
    agents: ResortAgent[];
}

// Legacy Resort type (basic)
export interface Resort {
    id: string;
    owner_id: string;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    website?: string;
    email?: string;
    phone?: string;

    // Location
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;

    // Legal & Banking
    owner_name?: string;
    owner_email?: string;
    owner_phone?: string;
    bank_name?: string;
    bank_account_type?: string;
    bank_account_number?: string;

    // Operation
    operating_hours?: OperatingHours[];
    commission_rate: number; // Default 10%

    // Status
    status: ResortStatus;
    rejection_reason?: string;
    approved_at?: string;
    approved_by?: string;

    created_at: string;
    updated_at: string;
}


export interface CreateResortDto {
    name: string;
    description?: string;
    city?: string;
    email?: string;
    phone?: string;
}

export interface UpdateResortDto extends Partial<CreateResortDto> {
    logo_url?: string;
    website?: string;
    address?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    owner_name?: string;
    owner_email?: string;
    owner_phone?: string;
    bank_name?: string;
    bank_account_type?: string;
    bank_account_number?: string;
    operating_hours?: OperatingHours[];
}

// ==================== Experience ====================
export type ExperienceStatus = 'draft' | 'pending_review' | 'active' | 'inactive' | 'rejected';
export type DurationType = 'minutes' | 'hours' | 'days';

export interface ExperienceImage {
    id: string;
    experience_id: string;
    image_url: string;
    image_type: 'main' | 'gallery';
    sort_order: number;
    created_at: string;
}

export interface Experience {
    id: string;
    code?: string;
    resort_id: string;
    title: string;
    slug: string;
    short_description?: string;
    long_description?: string;
    description?: string;

    // Pricing (legacy - use display_price_* instead)
    regular_price_cents?: number;
    vip_price_cents?: number;
    currency: string;

    // Display pricing from availability slots (in cents)
    display_price_per_adult?: number;
    display_price_per_child?: number;
    display_commission_per_adult?: number;
    display_commission_per_child?: number;
    display_currency?: string;

    // Capacity
    min_capacity?: number;
    max_capacity?: number;

    // Duration
    duration_value?: number;
    duration_type?: DurationType;
    duration_minutes?: number;

    // Details
    includes?: string[] | string;
    excludes?: string[] | string;
    requirements?: string[];

    // Categorization
    category_ids?: string[];
    category?: string;

    // Media
    images?: ExperienceImage[];
    main_image_url?: string;

    // Location
    locations?: ExperienceLocation[];

    // Status
    status: ExperienceStatus;

    // Children
    allows_children?: boolean;

    // Stats
    average_rating?: number;
    rating_avg?: number;
    review_count?: number;
    rating_count?: number;

    created_at: string;
    updated_at: string;
}

export interface ExperienceLocation {
    id: string;
    experience_id: string;
    name?: string;
    address_line?: string;
    latitude?: number;
    longitude?: number;
    meeting_instructions?: string;
}

export interface CreateExperienceDto {
    resort_id: string;
    title: string;
    short_description?: string;
    long_description?: string;
    regular_price_cents: number;
    vip_price_cents?: number;
    currency?: string;
    min_capacity?: number;
    max_capacity: number;
    duration_value: number;
    duration_type: DurationType;
    includes?: string[];
    excludes?: string[];
    requirements?: string[];
    category_ids?: string[];
    status?: ExperienceStatus;
}

export type UpdateExperienceDto = Partial<CreateExperienceDto>;

// ==================== Availability ====================
export interface AvailabilitySlot {
    id: string;
    experience_id: string;
    date: string; // YYYY-MM-DD
    start_time: string; // HH:mm
    end_time: string; // HH:mm
    capacity: number;
    spots_available: number;
    is_sold_out: boolean;
    created_at: string;
}

export interface CreateAvailabilitySlotDto {
    experience_id?: string;
    date: string;
    start_time: string;
    end_time: string;
    capacity: number;
}

export interface BulkCreateAvailabilityDto {
    experience_id?: string;
    start_date: string;
    end_date: string;
    slots: {
        start_time: string;
        end_time: string;
        capacity: number;
        days_of_week?: number[]; // 0=Sunday, 1=Monday, etc.
    }[];
}

// ==================== Booking ====================
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'expired';

export interface Booking {
    id: string;
    code?: string;
    user_id: string;
    experience_id: string;
    slot_id: string;

    // Participants
    adults: number;
    children: number;

    // Financials (in cents)
    subtotal_cents: number;
    tax_cents: number;
    commission_cents: number;
    resort_net_cents: number;
    total_cents: number;
    currency: string;

    // Status
    status: BookingStatus;
    cancel_reason?: string;

    // Metadata
    notes?: string;
    paid_to_resort: boolean;

    // Relations
    user?: User;
    experience?: Experience;
    slot?: AvailabilitySlot;

    created_at: string;
    updated_at: string;
}

// ==================== Review ====================
export interface Review {
    id: string;
    experience_id: string;
    user_id: string;
    booking_id: string;
    rating: number; // 1-5
    content?: string;
    photos?: string[];

    // Resort response
    resort_response_content?: string;
    resort_response_at?: string;

    user?: User;

    created_at: string;
    updated_at: string;
}

export interface CreateReviewResponseDto {
    content: string;
}

// ==================== Agents ====================
export interface Agent {
    resort_id: string;
    user_id: string;
    email: string;
    full_name: string;
    created_at: string;
    updated_at?: string;
}

export interface CreateAgentDto {
    email: string;
    fullName: string;
    password: string;
    phone: string;
    documentType: 'CC' | 'NIT' | 'CE' | 'PASSPORT';
    documentNumber: string;
    nit?: string;
    rnt?: string;
    resortId?: string;
}

// ==================== Category ====================
export interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
}

// ==================== Pagination ====================
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ==================== API Response ====================
export interface ApiError {
    statusCode: number;
    message: string | string[];
    error?: string;
}

// ==================== Agent Bookings ====================

export enum AgentPaymentType {
    FULL_AT_RESORT = 'full_at_resort',
    DEPOSIT_TO_AGENT = 'deposit_to_agent',
    COMMISSION_TO_AGENT = 'commission_to_agent',
}

export interface CreateAgentBookingDto {
    slotId: string;
    experienceId: string;
    adults: number;
    children: number;
    agentCommissionPerAdultCents: number;
    agentCommissionPerChildCents: number;
    agentPaymentType: AgentPaymentType;
    amountPaidToAgentCents: number;
    clientUserId?: string;
    clientName?: string;
    clientPhone?: string;
    clientEmail?: string;
}
