import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/**
 * Lanzada por los verbos de `CloudTransferEntity` cuando se intenta una transición fuera de la máquina de
 * estados (p. ej. `approve()` sobre algo `PENDING`).
 */
export class CloudTransferInvalidStatusTransitionException extends DomainException {
    constructor(message: string) {
        super(message, 409);
        this.name = 'CloudTransferInvalidStatusTransitionException';
    }
}
