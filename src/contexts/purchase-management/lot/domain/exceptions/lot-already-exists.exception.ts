import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class LotAlreadyExistsException extends DomainException{
    constructor(message: string){
        super(message);
    }
}