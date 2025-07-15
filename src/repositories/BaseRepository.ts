/* --------------------------------------------------------------------------
 * BaseRepository – Provee utilidades genéricas para simular peticiones HTTP.
 * Todas las implementaciones concretas (UsersRepository, ExperiencesRepository,
 * etc.) deben extender esta clase para reutilizar lógica común, como el retraso
 * artificial, parseo de errores, logging, etc.
 * -------------------------------------------------------------------------- */

export abstract class BaseRepository {
    /**
     * Simula (mock) una petición HTTP devolviendo los datos proveídos tras un
     * retraso. Permite unificar la experiencia de llamada en los repos de mock
     * y facilitar la migración a un cliente real en el futuro.
     *
     * @param data  Datos a devolver
     * @param delay Milisegundos de espera (por defecto 300 ms)
     */
    protected async simulateRequest<T>(data: T, delay = 300): Promise<T> {
        return new Promise((resolve) => setTimeout(() => resolve(data), delay));
    }
}
