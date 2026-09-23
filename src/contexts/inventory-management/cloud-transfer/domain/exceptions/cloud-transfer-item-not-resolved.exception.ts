import { DomainException } from "src/shared/domain/exceptions/domain.exceptions";

/** Lanzada por `ApproveCloudTransferUseCase` si queda algún item con `resolutionStatus === PENDING`. */
export class CloudTransferItemNotResolvedException extends DomainException {
    constructor(message: string) {
        super(message, 409);
        this.name = 'CloudTransferItemNotResolvedException';
    }
}
