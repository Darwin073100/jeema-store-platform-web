import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InventoryItemAlreadyExistException extends DomainException {
    constructor( message: string){
        super(message);
    }
}