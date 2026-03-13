import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InventoryInsufficientStockException extends DomainException {
    constructor( message: string ){
        super(message);
    }
}