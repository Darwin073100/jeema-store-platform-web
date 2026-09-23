import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { CloudTransferEntity } from "../entities/cloud-transfer.entity";
import { CloudTransferDirectionEnum } from "../enums/cloud-transfer-direction.enum";

export const CLOUD_TRANSFER_REPOSITORY = Symbol('CLOUD_TRANSFER_REPOSITORY');

export interface CloudTransferRepository extends TemplateRepository<CloudTransferEntity> {
    findByRemoteCloudTransferId(remoteCloudTransferId: bigint): Promise<CloudTransferEntity | null>;
    /** Idempotencia local: evita crear dos cabeceras para el mismo envío si el usuario reintenta el submit. */
    findByFromBranchOfficeIdUnsent(fromBranchOfficeId: bigint, shipmentNotesHash?: string): Promise<CloudTransferEntity | null>;
    findAllByBranchOffice(branchOfficeId: bigint, direction?: CloudTransferDirectionEnum): Promise<CloudTransferEntity[]>;
    findAllPendingResolutionByBranchOffice(branchOfficeId: bigint): Promise<CloudTransferEntity[]>;
    /**
     * Variante que participa en `TransactionDBRepository.runInTransaction(...)`. A diferencia de
     * `TypeormTransferRepository.save()` (que NO threadea el manager transaccional, gap ya detectado en el
     * repo), esta implementación debe resolver `transactionDB.getManager().getRepository(...)` DENTRO del
     * cuerpo del método (en cada llamada), no en el constructor — ver sección 5.5 del spec.
     */
    saveTransactional(entity: CloudTransferEntity): Promise<CloudTransferEntity>;
}
