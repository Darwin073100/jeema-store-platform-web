/**
 * Registro global de entidades de TypeORM
 * Se usa para mantener un registro centralizado de todas las entidades
 * que serán cargadas en el DataSource
 */
class EntityRegistry {
  private entities: Set<Function> = new Set();

  /**
   * Registra una entidad
   */
  register(entity: Function): void {
    this.entities.add(entity);
  }

  /**
   * Registra múltiples entidades
   */
  registerBulk(entities: Function[]): void {
    entities.forEach((entity) => this.register(entity));
  }

  /**
   * Obtiene todas las entidades registradas
   */
  getAll(): Function[] {
    return Array.from(this.entities);
  }

  /**
   * Limpia el registro (útil para testing)
   */
  clear(): void {
    this.entities.clear();
  }
}

export const entityRegistry = new EntityRegistry();

/**
 * Decorador para registrar automáticamente una entidad
 * Uso: @RegisterEntity()
 */
export function RegisterEntity() {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    entityRegistry.register(constructor);
    return constructor;
  };
}
