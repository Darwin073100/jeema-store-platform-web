import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class SaleInvalidException extends DomainException{
  constructor(message: string){
    super(message);
  }  
}