/**
 * Interfaz de plantilla para repositorios CRUD
 * Todo repositorio debe implementar al menos estas operaciones básicas
 */
export interface TemplateRepository<T> {
  /**
   * Guarda una entidad (crear o actualizar)
   */
  save(entity: T): Promise<T>;

  /**
   * Busca una entidad por su ID
   */
  findById(entityId: bigint): Promise<T | null>;

  /**
   * Obtiene todas las entidades
   */
  findAll(): Promise<T[] | []>;

  /**
   * Elimina una entidad por su ID
   */
  delete(entityId: bigint): Promise<T | null>;
}
