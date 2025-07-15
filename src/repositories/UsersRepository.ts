import { mockUsers } from '@/data/user-mock';
import { UserModel } from '@/types/user';
import { BaseRepository } from './BaseRepository';

/**
 * UsersRepository – Encapsula todas las operaciones (mock) relacionadas con
 * usuarios.  Para el momento solo expone `getUsers()` pero en el futuro se
 * pueden añadir `getById`, `create`, `update`, etc.
 */
export class UsersRepository extends BaseRepository {
    /**
     * Obtiene la lista de usuarios de la data mock.
     * @returns Promise<UserModel[]> – Resuelve con la data después de un retardo
     * automático de 300 ms para simular latencia de red.
     */
    async getUsers(): Promise<UserModel[]> {
        // En proyectos reales se llamaría a fetch/axios aquí.
        return this.simulateRequest<UserModel[]>(mockUsers);
    }

    /**
     * Aplica un PATCH sobre el usuario indicado.
     * @param userId   Identificador del usuario.
     * @param partial  Campos a actualizar.
     */
    async patchUser(userId: string, partial: Partial<UserModel>): Promise<UserModel> {
        const idx = mockUsers.findIndex((u) => u.userId === userId);
        if (idx === -1) throw new Error('User not found');
        mockUsers[idx] = { ...mockUsers[idx], ...partial };
        return this.simulateRequest<UserModel>(mockUsers[idx]);
    }
}
