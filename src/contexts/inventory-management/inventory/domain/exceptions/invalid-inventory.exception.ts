import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidInventoryException extends DomainException{
    constructor(message: string){
        super(message);
    }
}