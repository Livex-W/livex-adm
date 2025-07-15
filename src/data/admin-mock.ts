import { Admin, AdminPermission, AdminPermissionRecord, AdminRole, AdminStatus } from "@/types/admin";

export const mockAdmins: Admin[] = [
    {
        adminId: "admin-001",
        email: "superadmin@livex.com",
        firstName: "Juan",
        lastName: "Pérez",
        role: AdminRole.superadmin,
        status: AdminStatus.active,
        lastLogin: new Date("2024-05-14T10:30:00"),
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2024-05-14")
    },
    {
        adminId: "admin-002",
        email: "maria.admin@livex.com",
        firstName: "María",
        lastName: "González",
        role: AdminRole.admin,
        status: AdminStatus.active,
        lastLogin: new Date("2024-05-13T14:22:00"),
        createdAt: new Date("2023-06-15"),
        updatedAt: new Date("2024-05-13")
    },
    {
        adminId: "admin-003",
        email: "carlos.support@livex.com",
        firstName: "Carlos",
        lastName: "Ramírez",
        role: AdminRole.support,
        status: AdminStatus.active,
        lastLogin: new Date("2024-05-14T08:15:00"),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-05-14")
    }
];

export const mockAdminPermissions: AdminPermissionRecord[] = [
    // Superadmin - Todos los permisos
    ...Object.values(AdminPermission).map(permission => ({
        adminId: "admin-001",
        permission: permission as AdminPermission
    })),
    
    // Admin - Permisos completos excepto sistema
    {
        adminId: "admin-002",
        permission: AdminPermission.APPROVE_RESORTS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.EDIT_RESORTS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.VIEW_RESORTS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.APPROVE_EXPERIENCES
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.EDIT_EXPERIENCES
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.VIEW_EXPERIENCES
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.MANAGE_USERS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.VIEW_USERS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.ASSIGN_VIP
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.VIEW_FINANCIAL_REPORTS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.MANAGE_COMMISSIONS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.MANAGE_CATEGORIES
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.MODERATE_REVIEWS
    },
    {
        adminId: "admin-002",
        permission: AdminPermission.VIEW_ANALYTICS
    },
    
    // Support - Permisos limitados
    {
        adminId: "admin-003",
        permission: AdminPermission.VIEW_RESORTS
    },
    {
        adminId: "admin-003",
        permission: AdminPermission.VIEW_EXPERIENCES
    },
    {
        adminId: "admin-003",
        permission: AdminPermission.VIEW_USERS
    },
    {
        adminId: "admin-003",
        permission: AdminPermission.MODERATE_REVIEWS
    }
];

// Helper function para obtener permisos por rol
export function getDefaultPermissionsByRole(role: AdminRole): AdminPermission[] {
    switch (role) {
        case AdminRole.superadmin:
            return Object.values(AdminPermission);
            
        case AdminRole.admin:
            return Object.values(AdminPermission).filter(
                p => p !== AdminPermission.SYSTEM_SETTINGS
            );
            
        case AdminRole.support:
            return [
                AdminPermission.VIEW_RESORTS,
                AdminPermission.VIEW_EXPERIENCES,
                AdminPermission.VIEW_USERS,
                AdminPermission.MODERATE_REVIEWS
            ];
            
        default:
            return [];
    }
}
