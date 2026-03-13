import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class InventoryNotFoundException extends DomainException{
    constructor(message: string){
        super(message);
        this.name = 'InventoryItemNotFoundException';
    }
}