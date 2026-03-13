import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { InventoryItemEntity } from "../entities/inventory-item.entity";
import { LocationEnum } from "../enums/location.enum";

export const INVENTORY_ITEM_REPOSITORY = Symbol('INVENTORY_ITEM_REPOSITORY');

export interface InventoryItemRepository extends TemplateRepository<InventoryItemEntity> {
    /**
     * Busca un item de inventario por la localización que pertenesca a un id de inventario espesífico.
     * @param inventoryId 
     * @param location 
     */
    findByLocation(inventoryId: bigint, location: LocationEnum):Promise<InventoryItemEntity|null>;
    /**
     * Ver la lista de los productos en diferentes hubicaciones de nuestro inventario.
     * @param branchOfficeId 
     * @param itemId 
     * @param location 
     */
    findByLocationAndBranchOffice(branchOfficeId: bigint, location: LocationEnum):Promise<InventoryItemEntity[]>;
    update(entity: InventoryItemEntity): Promise<InventoryItemEntity>;
    /**
     * Si se desea cambiar de venta a almacen, verifica que no haya otro item en esa localización.
     * @param itemId 
     * @param inventoryId 
     * @param location 
     */
    stockDuplicated(itemId: bigint, inventoryId: bigint, location: LocationEnum):Promise<boolean>;
    existById(entityId: bigint):Promise<boolean>;
}