import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/** Errores genéricos de los VO del agregado (notas muy largas, cantidad <= 0, etc). */
export class InvalidCloudTransferException extends DomainException {
    constructor(message: string) {
        super(message, 400);
        this.name = 'InvalidCloudTransferException';
    }
}
