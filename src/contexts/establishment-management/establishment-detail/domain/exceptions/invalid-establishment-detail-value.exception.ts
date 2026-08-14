import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/**
 * InvalidEstablishmentDetailValueException representa una excepción de dominio
 * cuando el `value` de un `EstablishmentDetail` no cumple con las reglas de
 * validación de su `type` (ej. correo con formato inválido, teléfono con
 * caracteres no permitidos, slogan demasiado largo).
 */
export class InvalidEstablishmentDetailValueException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
