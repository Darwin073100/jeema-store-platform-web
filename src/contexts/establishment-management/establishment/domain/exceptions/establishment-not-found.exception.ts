import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class EstablishmentNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
    }
}