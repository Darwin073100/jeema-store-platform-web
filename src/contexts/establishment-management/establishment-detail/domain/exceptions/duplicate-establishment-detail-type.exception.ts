import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/**
 * DuplicateEstablishmentDetailTypeException se lanza cuando se intenta
 * agregar un nuevo registro de un `type` "singleton" (todos excepto
 * `PHONE_NUMBER`/`WHATSAPP`) para un establecimiento que ya tiene una fila
 * activa de ese mismo tipo. El caso de uso correcto en ese escenario es
 * editar el registro existente, no crear uno nuevo.
 */
export class DuplicateEstablishmentDetailTypeException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
