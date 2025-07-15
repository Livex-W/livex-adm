import { mockResorts } from '@/data/resort-mock';
import { Resort } from '@/types/resort';
import { BaseRepository } from './BaseRepository';

/**
 * ResortsRepository – encapsula operaciones (mock) sobre resorts.
 * Por ahora solo expone `getResorts()`, pero está preparado para agregar
 * endpoints CRUD o de filtrado en el futuro.
 */
export class ResortsRepository extends BaseRepository {
    /** Devuelve la lista de resorts (mock) con una latencia artificial. */
    async getResorts(): Promise<Resort[]> {
        return this.simulateRequest<Resort[]>(mockResorts);
    }

    // Otros métodos (patch, getById, etc.) se pueden añadir aquí.
}
