import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";

/** Lectura local simple (saliente + entrante), sin llamar a la nube. */
export class ListCloudTransfersForBranchUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
    ) { }

    async execute(branchOfficeId: bigint, direction?: CloudTransferDirectionEnum): Promise<CloudTransferEntity[]> {
        return this.cloudTransferRepository.findAllByBranchOffice(branchOfficeId, direction);
    }
}
