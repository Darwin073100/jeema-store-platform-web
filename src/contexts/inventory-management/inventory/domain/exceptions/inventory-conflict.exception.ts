import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InventoryConflictException extends DomainException {
    constructor(message: string){
        super(message);
    }
}