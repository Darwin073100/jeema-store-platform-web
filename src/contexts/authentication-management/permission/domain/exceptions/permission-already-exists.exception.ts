import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class PermissionAlreadyExistsException extends DomainException {
    constructor(message: string){
        super(message);
    }
}