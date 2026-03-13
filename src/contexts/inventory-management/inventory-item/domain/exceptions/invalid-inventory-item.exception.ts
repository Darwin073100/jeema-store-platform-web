import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidInventoryItemException extends DomainException{
    constructor(message: string){
        super(message);
    }
}