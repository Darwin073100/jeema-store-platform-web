import { DomainException } from 'src/shared/domain/exceptions/domain.exceptions';

export class InvalidSuplierException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
