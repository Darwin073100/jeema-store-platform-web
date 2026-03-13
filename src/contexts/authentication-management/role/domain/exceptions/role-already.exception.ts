import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class RoleAlreadyExistException extends DomainException {
    constructor(message: string){
        super(message);
    }
}