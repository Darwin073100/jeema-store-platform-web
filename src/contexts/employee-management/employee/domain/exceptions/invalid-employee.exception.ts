import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/**
 * InvalidNameException representa una excepción de dominio cuando el nombre
 * de un centro educativo no cumple con las reglas de negocio (ej. vacío, muy largo).
 */
export class InvalidEmployeeException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}