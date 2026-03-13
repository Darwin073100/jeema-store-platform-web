import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SeasonNotFoundException extends DomainException {
    constructor( message: string){
        super(message)
        this.name = 'SeasonNotFoundException';
    }
}