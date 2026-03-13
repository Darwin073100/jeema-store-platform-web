import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InvalidAddressException extends DomainException{
    constructor(message: string){
        super(message);
    }
}