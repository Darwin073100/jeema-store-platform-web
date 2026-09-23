import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { LotEntity } from "../entities/lot.entity";

export const LOT_REPOSITORY = Symbol('LOT_REPOSITORY');

export interface LotRepository extends TemplateRepository<LotEntity>{
    saveWithItems(entity: LotEntity): Promise<LotEntity>;
    findReport(branchOfficeId: bigint, dateInit: Date, dateFinish: Date): Promise<LotEntity[]>;
    existById(id: bigint): Promise<LotEntity | null>;
    /**
     * Lotes comprados de un producto, opcionalmente acotado por fecha de recepción
     * @param {bigint} productId
     * @param {Date} [dateInit]
     * @param {Date} [dateFinish]
     * @returns {Promise<LotEntity[]>}
     */
    findAllByProductId(productId: bigint, dateInit?: Date, dateFinish?: Date): Promise<LotEntity[]>;
    /**
     * Inserta un lote nuevo (sin `lotUnitPurchases`) participando de la transacción activa. Añadido para
     * `ApproveCloudTransferUseCase` (contexts/inventory-management/cloud-transfer): el manager transaccional
     * se resuelve DENTRO del cuerpo del método en cada llamada, no cacheado en el constructor — ver
     * spect/08_cloud_transfer_spect.md sección 5.5.
     * @param entity
     */
    saveTransactional(entity: LotEntity): Promise<LotEntity>;
}