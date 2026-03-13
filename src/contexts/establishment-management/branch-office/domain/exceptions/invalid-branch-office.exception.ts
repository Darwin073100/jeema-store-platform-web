import { DomainException } from 'src/shared/domain/exceptions/domain.exceptions';

export class InvalidBranchOfficeException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
