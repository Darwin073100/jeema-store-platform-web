import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { InventoryEntity } from "../entities/inventory.entity";
import { FilterProductListDTO } from "@/contexts/product-management/product/application/dtos/filter-product-list.dto";

export const INVENTORY_REPOSITORY = Symbol('INVENTORY_REPOSITORY');

export interface InventoryRepository extends TemplateRepository<InventoryEntity> {
    findByInternalBarCode(internalBarCode: string): Promise<InventoryEntity | null>
    existById(inventoryId: bigint): Promise<boolean>;
    findBarcodeById(entityId: bigint): Promise<InventoryEntity | null>;
    findByInternalBarCodeInBranchOffice(internalBarCode: string, branchOfficeId: bigint): Promise<InventoryEntity | null>;
    /**
     * Busca los Inventory vendibles sin control de stock (isSellable = true y sin ningún InventoryItem
     * asociado en ninguna ubicación) de una sucursal, filtrando opcionalmente por texto de búsqueda.
     * @param branchOfficeId
     * @param dto
     */
    findSellableWithoutItemsByBranchOffice(branchOfficeId: bigint, dto: FilterProductListDTO): Promise<InventoryEntity[]>;
    /**
     * Todos los Inventory de un producto en todas las sucursales, con sus InventoryItem cargados.
     * Usado para sumar el quantityOnHand total de un producto (stock global) al recalcular
     * Product.averageCost — el stock es por sucursal pero el promedio de costo es global por producto.
     * @param {bigint} productId
     * @returns {Promise<InventoryEntity[]>}
     */
    findAllByProductId(productId: bigint): Promise<InventoryEntity[]>;
}