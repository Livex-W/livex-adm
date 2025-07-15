export enum AdminRole {
    superadmin = 'superadmin',
    admin = 'admin',
    support = 'support',
}

export enum AdminStatus {
    active = 'active',
    inactive = 'inactive',
}

export enum AdminPermission {
    // Gestión de resorts
    APPROVE_RESORTS = 'approve_resorts',
    EDIT_RESORTS = 'edit_resorts',
    DELETE_RESORTS = 'delete_resorts',
    VIEW_RESORTS = 'view_resorts',

    // Gestión de experiencias
    APPROVE_EXPERIENCES = 'approve_experiences',
    EDIT_EXPERIENCES = 'edit_experiences',
    DELETE_EXPERIENCES = 'delete_experiences',
    VIEW_EXPERIENCES = 'view_experiences',

    // Gestión de usuarios
    MANAGE_USERS = 'manage_users',
    VIEW_USERS = 'view_users',
    ASSIGN_VIP = 'assign_vip',

    // Gestión financiera
    VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
    MANAGE_COMMISSIONS = 'manage_commissions',
    PROCESS_PAYMENTS = 'process_payments',

    // Gestión de contenido
    MANAGE_CATEGORIES = 'manage_categories',
    MODERATE_REVIEWS = 'moderate_reviews',

    // Sistema
    VIEW_ANALYTICS = 'view_analytics',
    SYSTEM_SETTINGS = 'system_settings',
}

export interface Admin {
    adminId: string;
    email: string;
    password?: string;         // Hashed, opcional para mocks
    firstName: string;
    lastName: string;
    role: AdminRole;
    status: AdminStatus;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminPermissionRecord {
    adminId: string;
    permission: AdminPermission;
}

// Tipo completo con permisos expandidos
export interface AdminProfile {
    admin: Admin;
    permissions: AdminPermission[];
}
