import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/**
 * El periodo solicitado para un reporte de ventas no es válido (p. ej. inicio posterior al fin).
 */
export class InvalidSalesPeriodException extends DomainException {
    constructor(message: string) {
        super(message, 400);
    }
}
