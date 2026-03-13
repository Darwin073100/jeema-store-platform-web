import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class EmployeeNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
        this.name = 'EmployeeNotFoundException';
    }
}