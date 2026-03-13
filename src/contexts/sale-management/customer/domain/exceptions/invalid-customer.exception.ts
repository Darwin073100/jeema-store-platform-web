import { DomainException } from 'src/shared/domain/exceptions/domain.exceptions';

export class InvalidCustomerException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
