import { CloudTransferEntity } from "../../../domain/entities/cloud-transfer.entity";
import { CloudTransferItemEntity } from "../../../domain/entities/cloud-transfer-item.entity";
import { CloudTransferStatusEnum } from "../../../domain/enums/cloud-transfer-status.enum";
import { CreateCloudTransferHttpDto, TransferItemHttpDto } from "../../../application/dtos/create-cloud-transfer-http.dto";
import { ICloudTransferApiResponse } from "../../../application/dtos/cloud-transfer-api-response.dto";
import { ForSaleEnum } from "src/shared/domain/enums/for-sale.enum";
import { LocationEnum } from "src/contexts/inventory-management/inventory-item/domain/enums/location.enum";

/**
 * Dominio/DTO <-> wire shape EDYOF (strings). Ver `ICloudTransferApiResponse` para la nota de deviación
 * respecto al shape inferido originalmente en el spec (confirmado con una llamada real, ver sección 6 del
 * plan de implementación).
 */
export class CloudTransferApiMapper {
    /**
     * Formatea una columna `date` de TypeORM como `YYYY-MM-DD`. Defensivo ante drivers que devuelven `Date`
     * (Postgres real) o `string` (algunos entornos/drivers de test, p. ej. pg-mem, devuelven columnas
     * `date` como texto plano en vez de objetos `Date`).
     */
    private static toDateOnlyString(value: Date | string | null | undefined): string | undefined {
        if (!value) return undefined;
        if (value instanceof Date) return value.toISOString().slice(0, 10);
        return String(value).slice(0, 10);
    }

    /**
     * `product.imageUrl` en modo de almacenamiento local (`LocalFilesystemImageStorageAdapter`, el modo
     * on-premise por defecto de esta tienda) guarda una ruta relativa (`/uploads/...`), servida solo por el
     * propio servidor de ESTA tienda — EDYOF (la nube) no puede resolverla ni validarla como URL. Enviarla
     * tal cual hace que el `ProductBlockCommand.imageUrl` de EDYOF rechace el traspaso completo con 400
     * (visto en producción: falla siempre que el producto tiene imagen, nunca cuando no la tiene). Se omite
     * el campo salvo que ya sea una URL absoluta http(s) real (p. ej. `CloudImageStorageAdapter`/Cloudinary
     * en modo cloud) — mismo tratamiento que un producto sin imagen, en vez de bloquear todo el envío.
     */
    private static toAbsoluteUrlOrUndefined(url: string | null | undefined): string | undefined {
        if (!url) return undefined;
        return /^https?:\/\//i.test(url) ? url : undefined;
    }

    static toCreateHttpDto(header: CloudTransferEntity): CreateCloudTransferHttpDto {
        return {
            fromCloudBranchId: header.fromCloudBranchOfficeId.toString(),
            toCloudBranchId: header.toCloudBranchOfficeId.toString(),
            localTransferId: header.cloudTransferId.toString(),
            shipmentNotes: header.shipmentNotes ?? undefined,
            items: header.items.map(item => this.toTransferItemHttpDto(item)),
        };
    }

    static toTransferItemHttpDto(item: CloudTransferItemEntity): TransferItemHttpDto {
        return {
            originLocalProductId: (item.originLocalProductId ?? BigInt(0)).toString(),
            originLocalLotId: item.originLocalLotId?.toString(),
            originLocalInventoryItemId: item.originLocalInventoryItemId?.toString(),
            product: {
                universalBarCode: item.productUniversalBarCode ?? undefined,
                name: item.productName,
                sku: item.productSku ?? undefined,
                categoryName: item.productCategoryName,
                categoryDescription: item.productCategoryDescription ?? undefined,
                brandName: item.productBrandName ?? undefined,
                description: item.productDescription ?? undefined,
                unitOfMeasure: item.productUnitOfMeasure,
                imageUrl: this.toAbsoluteUrlOrUndefined(item.productImageUrl),
            },
            lot: {
                lotNumber: item.lotNumber,
                purchasePrice: item.lotPurchasePrice.toString(),
                purchaseUnit: item.lotPurchaseUnit,
                transferredQuantity: item.lotTransferredQuantity.toString(),
                expirationDate: this.toDateOnlyString(item.lotExpirationDate),
                manufacturingDate: this.toDateOnlyString(item.lotManufacturingDate),
                originReceivedDate: this.toDateOnlyString(item.lotOriginReceivedDate),
                supplierName: item.lotSupplierName ?? undefined,
            },
            inventory: {
                suggestedSalePriceOne: item.inventorySuggestedSalePriceOne?.toString(),
                suggestedSalePriceMany: item.inventorySuggestedSalePriceMany?.toString(),
                suggestedSaleQuantityMany: item.inventorySuggestedSaleQuantityMany?.toString(),
                suggestedSalePriceSpecial: item.inventorySuggestedSalePriceSpecial?.toString(),
                originQuantityOnHand: item.inventoryOriginQuantityOnHand?.toString(),
                suggestedLocation: item.inventorySuggestedLocation ?? undefined,
            },
        };
    }

    /** El string de estado de EDYOF coincide EXACTAMENTE con los valores de `CloudTransferStatusEnum`. */
    static toDomainStatus(wireStatus: string): CloudTransferStatusEnum {
        const status = Object.values(CloudTransferStatusEnum).find(value => value === wireStatus);
        if (!status) {
            throw new Error(`Estado de traspaso desconocido recibido de la nube: ${wireStatus}`);
        }
        return status;
    }

    /**
     * Reconstruye los `CloudTransferItemEntity` (snapshot) a partir de `payload.items` de la respuesta de
     * la nube. Usado por `RefreshPendingCloudTransfersUseCase`/`RefreshCloudTransferFromCloudUseCase` para
     * construir la fila espejo del lado B. Nunca trae ids de resolución (esos son siempre locales a B).
     */
    static toDomainItems(response: ICloudTransferApiResponse, cloudTransferId: bigint): CloudTransferItemEntity[] {
        return response.payload.items.map((item, index) => CloudTransferItemEntity.create({
            cloudTransferId,
            lineNumber: index + 1,
            productUniversalBarCode: item.product.universalBarCode ?? null,
            productName: item.product.name,
            productSku: item.product.sku ?? null,
            productCategoryName: item.product.categoryName,
            productCategoryDescription: item.product.categoryDescription ?? null,
            productBrandName: item.product.brandName ?? null,
            productDescription: item.product.description ?? null,
            productUnitOfMeasure: item.product.unitOfMeasure as ForSaleEnum,
            productImageUrl: item.product.imageUrl ?? null,
            lotNumber: item.lot.lotNumber,
            lotPurchasePrice: Number(item.lot.purchasePrice),
            lotPurchaseUnit: item.lot.purchaseUnit as ForSaleEnum,
            lotTransferredQuantity: Number(item.lot.transferredQuantity),
            lotExpirationDate: item.lot.expirationDate ? new Date(item.lot.expirationDate) : null,
            lotManufacturingDate: item.lot.manufacturingDate ? new Date(item.lot.manufacturingDate) : null,
            lotOriginReceivedDate: item.lot.originReceivedDate ? new Date(item.lot.originReceivedDate) : null,
            lotSupplierName: item.lot.supplierName ?? null,
            inventorySuggestedSalePriceOne: item.inventory.suggestedSalePriceOne ? Number(item.inventory.suggestedSalePriceOne) : null,
            inventorySuggestedSalePriceMany: item.inventory.suggestedSalePriceMany ? Number(item.inventory.suggestedSalePriceMany) : null,
            inventorySuggestedSaleQuantityMany: item.inventory.suggestedSaleQuantityMany ? Number(item.inventory.suggestedSaleQuantityMany) : null,
            inventorySuggestedSalePriceSpecial: item.inventory.suggestedSalePriceSpecial ? Number(item.inventory.suggestedSalePriceSpecial) : null,
            inventoryOriginQuantityOnHand: item.inventory.originQuantityOnHand ? Number(item.inventory.originQuantityOnHand) : null,
            inventorySuggestedLocation: (item.inventory.suggestedLocation as LocationEnum) ?? null,
        }));
    }
}
