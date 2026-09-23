import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/** Guard de idempotencia local antes de llamar a la API (ver sección 5.1 del spec). */
export class CloudTransferDuplicateException extends DomainException {
    constructor(message: string) {
        super(message, 409);
        this.name = 'CloudTransferDuplicateException';
    }
}
