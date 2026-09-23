import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/**
 * Evita re-resolver un item ya `MATCHED`/`NEW_PRODUCT`/`REJECTED` sin pasar explícitamente por una acción
 * de "deshacer" (no incluida en el alcance de v1).
 */
export class CloudTransferItemAlreadyResolvedException extends DomainException {
    constructor(message: string) {
        super(message, 409);
        this.name = 'CloudTransferItemAlreadyResolvedException';
    }
}
