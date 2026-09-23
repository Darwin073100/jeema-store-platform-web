import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferItemRepository } from "../../domain/repositories/cloud-transfer-item.repository";
import { CloudTransferApiRepository } from "../../domain/repositories/cloud-transfer-api.repository";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { EmployeeRepository } from "src/contexts/employee-management/employee/domain/repositories/employee.repository";
import { ProductRepository } from "src/contexts/product-management/product/domain/repositories/product.repository";
import { CategoryRepository } from "src/contexts/product-management/category/domain/repositories/category.repository";
import { BrandRepository } from "src/contexts/product-management/brand/domain/repositories/brand.repository";
import { LotRepository } from "src/contexts/purchase-management/lot/domain/repositories/lot.repository";
import { LotEntity } from "src/contexts/purchase-management/lot/domain/entities/lot.entity";
import { InventoryRepository } from "src/contexts/inventory-management/inventory/domain/repositories/inventory.repository";
import { InventoryItemRepository } from "src/contexts/inventory-management/inventory-item/domain/repositories/inventory-item.repository";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { DiscountInventoryItemUseCase } from "src/contexts/inventory-management/inventory-item/application/use-case/discount-inventory-item.use-case";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferItemEntity } from "../../domain/entities/cloud-transfer-item.entity";
import { CreateCloudTransferDto } from "../dtos/create-cloud-transfer.dto";
import { InvalidCloudTransferException } from "../../domain/exceptions/invalid-cloud-transfer.exception";
import { CloudTransferItemNotFoundException } from "../../domain/exceptions/cloud-transfer-item-not-found.exception";
import { CloudTransferApiMapper } from "../../infraestructure/http/mappers/cloud-transfer-api.mapper";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";

export interface CreateAndSendCloudTransferResult {
    transfer: CloudTransferEntity;
    sendResult: Result<void, ErrorEntity>;
}

/**
 * Crea la cabecera + items localmente (descontando stock de origen en la misma transacción) y luego intenta
 * enviarla a EDYOF. Si el POST falla, el traspaso queda persistido localmente con `remoteCloudTransferId =
 * null` — la UI puede reintentar vía `RetrySendCloudTransferUseCase`. Ver
 * spect/08_cloud_transfer_spect.md sección 5.1 (incluida la nota de orden invertido respecto al patrón
 * copiado de `RegisterCloudBranchAndCloudEstablishmentUseCase`: aquí se persiste local PRIMERO porque la
 * clave de idempotencia `localTransferId` es nuestro propio PK autogenerado).
 */
export class CreateAndSendCloudTransferUseCase {
    constructor(
        private readonly cloudTransferRepository: CloudTransferRepository,
        private readonly cloudTransferItemRepository: CloudTransferItemRepository,
        private readonly cloudTransferApiRepository: CloudTransferApiRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly employeeRepository: EmployeeRepository,
        private readonly productRepository: ProductRepository,
        private readonly categoryRepository: CategoryRepository,
        private readonly brandRepository: BrandRepository,
        private readonly lotRepository: LotRepository,
        private readonly inventoryRepository: InventoryRepository,
        private readonly inventoryItemRepository: InventoryItemRepository,
        private readonly transactionDB: TransactionDBRepository,
    ) { }

    async execute(dto: CreateCloudTransferDto): Promise<CreateAndSendCloudTransferResult> {
        const fromBranch = await this.branchOfficeRepository.findById(dto.fromBranchOfficeId);
        if (!fromBranch) {
            throw new InvalidCloudTransferException(`La sucursal de origen (${dto.fromBranchOfficeId}) no existe.`);
        }
        const fromCloudBranchOfficeId = fromBranch.cloudBranchOfficeId;
        if (!fromCloudBranchOfficeId) {
            throw new InvalidCloudTransferException('La sucursal de origen no está inscrita en la nube (cloudBranchOfficeId nulo).');
        }

        const requesterExists = await this.employeeRepository.existById(dto.requestedByEmployeeId);
        if (!requesterExists) {
            throw new InvalidCloudTransferException(`El empleado (${dto.requestedByEmployeeId}) que solicita el traspaso no existe.`);
        }

        const discountInventoryItemUseCase = new DiscountInventoryItemUseCase(this.inventoryItemRepository);

        const items: CloudTransferItemEntity[] = [];
        for (let index = 0; index < dto.items.length; index++) {
            const itemDto = dto.items[index];

            const product = await this.productRepository.existById(itemDto.originLocalProductId);
            if (!product) {
                throw new CloudTransferItemNotFoundException(`El producto de origen (${itemDto.originLocalProductId}) no existe.`);
            }
            // El lote es opcional: un producto puede transferirse sin lote registrado (ver
            // spect/08_cloud_transfer_spect.md 3.6 y nota de deviación en el reporte final). Cuando
            // `originLocalLotId` viene null, el snapshot de lote se sintetiza más abajo a partir del
            // producto/inventario en vez de leerlo de un `Lot` real.
            let lot: LotEntity | null = null;
            if (itemDto.originLocalLotId !== null) {
                lot = await this.lotRepository.existById(itemDto.originLocalLotId);
                if (!lot) {
                    throw new CloudTransferItemNotFoundException(`El lote de origen (${itemDto.originLocalLotId}) no existe.`);
                }
            }
            const inventoryItem = await this.inventoryItemRepository.findById(itemDto.originLocalInventoryItemId);
            if (!inventoryItem) {
                throw new CloudTransferItemNotFoundException(`El item de inventario de origen (${itemDto.originLocalInventoryItemId}) no existe.`);
            }
            if (inventoryItem.quantityOnHand.value < itemDto.quantityToTransfer) {
                throw new InvalidCloudTransferException(
                    `No hay suficiente stock para transferir: disponible ${inventoryItem.quantityOnHand.value}, solicitado ${itemDto.quantityToTransfer}.`,
                );
            }

            const category = await this.categoryRepository.existById(product.categoryId);
            if (!category) {
                throw new CloudTransferItemNotFoundException(`La categoría del producto (${product.categoryId}) no existe.`);
            }
            const brand = product.brandId ? await this.brandRepository.existById(product.brandId) : null;
            // NOTA: se usa `findBarcodeById` (relations: ['product']) en vez de `findById` (relations:
            // ['product','product.category','lot']) porque `findById` referencia una relación `lot` que no
            // existe en `InventoryOrmEntity` (bug preexistente, detectado al integrar; fuera de alcance de
            // esta feature arreglar el método compartido — ver reporte final). Ambos devuelven la misma fila
            // de Inventory con sus columnas propias (salePriceOne/salePriceMany/etc.), que es todo lo que se
            // necesita aquí.
            const inventory = await this.inventoryRepository.findBarcodeById(inventoryItem.inventoryId);

            items.push(CloudTransferItemEntity.create({
                cloudTransferId: BigInt(0),
                lineNumber: index + 1,
                originLocalProductId: product.productId,
                originLocalLotId: lot?.lotId ?? null,
                originLocalInventoryItemId: inventoryItem.inventoryItemId,
                productUniversalBarCode: product.universalBarCode.value,
                productName: product.name.value,
                productSku: product.sku.value,
                productCategoryName: category.name,
                productCategoryDescription: category.description,
                productBrandName: brand?.name ?? null,
                productDescription: product.description.value,
                productUnitOfMeasure: product.unitOfMeasure,
                productImageUrl: product.imageUrl,
                // Sin lote real: snapshot sintético a partir del producto (costo promedio como precio de
                // compra) para seguir cumpliendo el contrato de EDYOF, que exige el bloque `lot` completo
                // (ver spect/08_cloud_transfer_spect.md sección 4.3, `TransferItemHttpDto.lot`).
                lotNumber: lot?.lotNumber ?? 'SIN-LOTE',
                lotPurchasePrice: lot?.purchasePrice ?? product.averageCost,
                lotPurchaseUnit: lot?.purchaseUnit ?? product.unitOfMeasure,
                lotTransferredQuantity: itemDto.quantityToTransfer,
                lotExpirationDate: lot?.expirationDate ?? null,
                lotManufacturingDate: lot?.manufacturingDate ?? null,
                lotOriginReceivedDate: lot?.receivedDate ?? null,
                // NOTA: lotSupplierName queda null — SuplierRepository no forma parte del constructor de
                // este use-case per spect/08_cloud_transfer_spect.md sección 5.1 (campo puramente
                // informativo, ver sección 3.6). Ver nota de deviación en el reporte final.
                lotSupplierName: null,
                inventorySuggestedSalePriceOne: inventory?.salePriceOne?.value ?? null,
                inventorySuggestedSalePriceMany: inventory?.salePriceMany?.value ?? null,
                inventorySuggestedSaleQuantityMany: inventory?.saleQuantityMany?.value ?? null,
                inventorySuggestedSalePriceSpecial: inventory?.salePriceSpecial?.value ?? null,
                inventoryOriginQuantityOnHand: inventoryItem.quantityOnHand.value,
                inventorySuggestedLocation: inventoryItem.location,
            }));
        }

        // Inserta cabecera + items localmente, y descuenta el stock de origen, en la MISMA transacción.
        let header = await this.transactionDB.runInTransaction(async () => {
            const newHeader = CloudTransferEntity.create(
                dto.fromBranchOfficeId,
                fromCloudBranchOfficeId,
                dto.toCloudBranchOfficeId,
                dto.requestedByEmployeeId,
                dto.shipmentNotes,
                items,
            );
            const saved = await this.cloudTransferRepository.saveTransactional(newHeader);

            for (const itemDto of dto.items) {
                await discountInventoryItemUseCase.execute(itemDto.originLocalInventoryItemId, itemDto.quantityToTransfer);
            }

            return saved;
        });

        const httpBody = CloudTransferApiMapper.toCreateHttpDto(header);
        const sendResult = await this.cloudTransferApiRepository.create(httpBody);

        if (sendResult.ok && sendResult.value) {
            header.markAsCreatedInCloud(BigInt(sendResult.value.cloudTransferId));
            header = await this.cloudTransferRepository.save(header);
            return { transfer: header, sendResult: Result.success(undefined) };
        }

        return { transfer: header, sendResult: Result.failure(sendResult.error!) };
    }
}
