import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class BrandAlreadyExistsException extends DomainException{
    constructor(message: string){
        super(message);
    }
}