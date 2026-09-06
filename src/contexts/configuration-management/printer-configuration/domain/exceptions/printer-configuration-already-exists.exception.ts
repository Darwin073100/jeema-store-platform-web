import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class PrinterConfigurationAlreadyExistsException extends DomainException {
    constructor(cashRegisterId?: bigint) {
        const message = cashRegisterId !== undefined
            ? `La caja ${cashRegisterId.toString()} ya tiene una impresora configurada. Edítala en lugar de crear una nueva.`
            : 'La caja ya tiene una impresora configurada. Edítala en lugar de crear una nueva.';
        super(message, 409);
    }
}
