import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { InventoryEntity } from "../entities/inventory.entity";

export const INVENTORY_REPOSITORY = Symbol('INVENTORY_REPOSITORY');

export interface InventoryRepository extends TemplateRepository<InventoryEntity> {
    findByInternalBarCode(internalBarCode: string): Promise<InventoryEntity | null>
    existById(inventoryId: bigint): Promise<boolean>;
    findBarcodeById(entityId: bigint): Promise<InventoryEntity | null>;
    findByInternalBarCodeInBranchOffice(internalBarCode: string, branchOfficeId: bigint): Promise<InventoryEntity | null>;
}