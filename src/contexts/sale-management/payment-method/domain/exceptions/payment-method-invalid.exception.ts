import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

export class PaymentMethodInvalidException extends DomainException{
  constructor(message: string){
    super(message);
  }  
}