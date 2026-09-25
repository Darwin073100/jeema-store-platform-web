import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InsufficientInventoryStockException extends DomainException {
    public readonly availableQuantity: number;
    public readonly requestedQuantity: number;

    constructor(availableQuantity: number, requestedQuantity: number){
        super(`Stock insuficiente. Disponible: ${availableQuantity}, solicitado: ${requestedQuantity}.`);
        this.name = 'InsufficientInventoryStockException';
        this.availableQuantity = availableQuantity;
        this.requestedQuantity = requestedQuantity;
    }
}
