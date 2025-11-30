import { Result } from "@/shared/features/result";
import { RegisterInventoryDTO } from "../../application/dtos/register-inventory.dto";
import { UpdateInventoryDTO } from "../../application/dtos/update-inventory.dto";
import { InventoryEntity } from "../entities/inventory.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { InventoryItemEntity } from "../entities/inventory-item.entity";
import { LocationEnum } from "../enums/location.enum";
import { EditInventoryItemDTO } from "../../application/dtos/edit-inventory-item.dto";

export interface InventoryRepository{
    save(dto: RegisterInventoryDTO):Promise<Result<InventoryEntity, ErrorEntity>>;
    update(dto: UpdateInventoryDTO):Promise<Result<InventoryEntity, ErrorEntity>>;
    findByBarCode(barCode: string):Promise<Result<InventoryEntity, ErrorEntity>>;
    findAllByLocationAndBranchOffice(branchOfficeId: bigint, location: LocationEnum): Promise<Result<{items:InventoryItemEntity[]}, ErrorEntity>>;
    editItem(dto: EditInventoryItemDTO):Promise<Result<InventoryEntity, ErrorEntity>>;
    addStockItem(itemId: bigint, addQuantity: number):Promise<Result<InventoryItemEntity, ErrorEntity>>;
    findBarcodeByInventoryId(inventoryId: bigint): Promise<Result<Blob, ErrorEntity>>;
}