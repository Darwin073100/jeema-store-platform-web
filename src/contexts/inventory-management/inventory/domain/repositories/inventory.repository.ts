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
}