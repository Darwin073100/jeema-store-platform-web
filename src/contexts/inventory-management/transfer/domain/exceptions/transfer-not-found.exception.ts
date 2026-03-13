import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class TransferNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
        this.name = 'TransferNotFoundException';
    }
}