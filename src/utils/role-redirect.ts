import { ROUTES } from '@/routes';
import { UserRole, USER_ROLES } from '@/types';

export const getRedirectPathByRole = (role: UserRole): string => {

    switch (role) {
        case USER_ROLES.PARTNER:
            return ROUTES.PARTNER.HOME;
        case USER_ROLES.ADMIN:
            return ROUTES.DASHBOARD.HOME;
        default:
            return ROUTES.DASHBOARD.HOME;
    }
};