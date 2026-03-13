/**
 * Tipos de errores personalizados para la capa de datos
 */

export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class EntityNotFoundError extends RepositoryError {
  constructor(entityName: string, id: string | number) {
    super(`${entityName} with id ${id} not found`);
    this.name = 'EntityNotFoundError';
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string, public errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends RepositoryError {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}
