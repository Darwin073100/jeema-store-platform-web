import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferItemRepository } from "../../domain/repositories/cloud-transfer-item.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { LotRepository } from "src/contexts/purchase-management/lot/domain/repositories/lot.repository";
import { InventoryItemRepository } from "src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { LotEntity } from "src/contexts/purchase-management/lot/domain/entities/lot.entity";
import { InventoryItemEntity } from "src/contexts/inventory-management/inventory-item/domain/entities/inventory-item.entity";
import { InventoryItemQuantityOnHandVO } from "src/contexts/inventory-management/inventory-item/domain/value-objects/inventory-item-quantity-on-hand.vo";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";
import { CloudTransferNotFoundException } from "../../domain/exceptions/cloud-transfer-not-found.exception";
import { CloudTransferInvalidStatusTransitionException } from "../../domain/exceptions/cloud-transfer-invalid-status-transition.exception";
import { CloudTransferItemNotResolvedException } from "../../domain/exceptions/cloud-transfer-item-not-resolved.exception";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

/**
 * La mutación real de stock (`lot`/`inventory_item`) ocurre en `approve()`, no en `start-processing` ni en
 * `receive()`. La creación del PRODUCTO (catálogo, sin stock) para el caso "producto nuevo" ya ocurrió antes,
 * en `ResolveCloudTransferItemAsNewProductUseCase`. Ver spect/08_cloud_transfer_spect.md sección 5.7 para
 * el razonamiento completo de por qué la mutación se ancla aquí y no antes.
 *
 * Es el use-case más complejo del agregado: depende de que todas las líneas ya hayan sido resueltas
 * (MATCHED/NEW_PRODUCT/REJECTED) antes de poder ejecutarse.
 */
export class ApproveCloudTransferUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferItemRepository: CloudTransferItemRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly lotRepository: LotRepository,
        private readonly inventoryItemRepository: InventoryItemRepository,
        private readonly transactionDB: TransactionDBRepository,
    ) { }

    async execute(localCloudTransferId: bigint, actingEmployeeId: bigint, notes?: string | null): Promise<Result<CloudTransferEntity, ErrorEntity>> {
        const header = await this.cloudTransferRepository.findById(localCloudTransferId);
        if (!header) {
            throw new CloudTransferNotFoundException(`No se encontró el traspaso local (${localCloudTransferId}).`);
        }
        if (header.status !== CloudTransferStatusEnum.RECEIVED) {
            throw new CloudTransferInvalidStatusTransitionException(
                `No se puede aprobar: el traspaso está en estado ${header.status}, se esperaba RECEIVED.`,
            );
        }
        const pendingItem = header.items.find(item => item.resolutionStatus === CloudTransferItemResolutionStatusEnum.PENDING);
        if (pendingItem) {
            throw new CloudTransferItemNotResolvedException(
                `No se puede aprobar: el item de línea ${pendingItem.lineNumber} todavía está PENDING de resolución.`,
            );
        }
        if (!header.toBranchOfficeId || !header.remoteCloudTransferId) {
            throw new InvalidCloudTransferException('El traspaso no tiene sucursal destino local o id remoto asignado.');
        }

        const branch = await this.branchOfficeRepository.findById(header.toBranchOfficeId);
        if (!branch || !branch.cloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal destino no existe o no está inscrita en la nube.');
        }

        // Patrón local+cloud: la nube se llama PRIMERO. Si falla, nada local se toca todavía.
        const apiResult = await this.cloudTransferApiRepository.approve(header.remoteCloudTransferId, branch.cloudBranchOfficeId, notes ?? undefined);
        if (!apiResult.ok) {
            return Result.failure(apiResult.error as ErrorEntity);
        }

        const approvedHeader = await this.transactionDB.runInTransaction(async () => {
            for (const item of header.items) {
                if (item.resolutionStatus === CloudTransferItemResolutionStatusEnum.REJECTED) continue;

                const matchedLocalProductId = item.matchedLocalProductId;
                const matchedLocalInventoryId = item.matchedLocalInventoryId;
                if (!matchedLocalProductId || !matchedLocalInventoryId) {
                    throw new InvalidCloudTransferException(
                        `El item de línea ${item.lineNumber} está ${item.resolutionStatus} pero le falta matchedLocalProductId/matchedLocalInventoryId.`,
                    );
                }

                const lot = LotEntity.create(
                    BigInt(0),
                    matchedLocalProductId,
                    null, // suplierId: siempre null en B, ver spect/08 sección 3.6
                    item.lotNumber,
                    item.lotPurchasePrice,
                    item.lotTransferredQuantity,
                    item.lotPurchaseUnit,
                    item.lotOriginReceivedDate ?? new Date(),
                    item.lotExpirationDate,
                    item.lotManufacturingDate,
                );
                const savedLot = await this.lotRepository.saveTransactional(lot);

                const location = item.inventorySuggestedLocation ?? LocationEnum.STOCK;
                const existingInventoryItem = await this.inventoryItemRepository.findByLocation(matchedLocalInventoryId, location);

                let savedInventoryItem: InventoryItemEntity;
                if (existingInventoryItem) {
                    existingInventoryItem.updateQuantityOnHand(existingInventoryItem.quantityOnHand.value + item.lotTransferredQuantity);
                    savedInventoryItem = await this.inventoryItemRepository.saveTransactional(existingInventoryItem);
                } else {
                    const newInventoryItem = InventoryItemEntity.create(
                        matchedLocalInventoryId,
                        location,
                        InventoryItemQuantityOnHandVO.create(item.lotTransferredQuantity),
                    );
                    savedInventoryItem = await this.inventoryItemRepository.saveTransactional(newInventoryItem);
                }

                item.attachApprovedStock(savedLot.lotId, savedInventoryItem.inventoryItemId);
                await this.cloudTransferItemRepository.updateTransactional(item);
            }

            header.approve(actingEmployeeId, notes ?? null);
            return this.cloudTransferRepository.saveTransactional(header);
        });

        // NOTA (gap aceptado, igual que el TODO de RegisterCloudBranchAndCloudEstablishmentUseCase): si la
        // transacción de arriba falla DESPUÉS de que la llamada a la nube (apiResult) ya tuvo éxito, la nube
        // queda en "Aprobada" (terminal) sin compensación automática del lado local. No se intenta resolver
        // aquí — ver spect/08_cloud_transfer_spect.md sección 5.7 punto 6 y sección 9.
        return Result.success(approvedHeader);
    }
}
