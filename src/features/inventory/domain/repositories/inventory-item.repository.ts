import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { InventoryResponseDTO } from "../entities/inventory-response.dto";
import { RegisterInventoryItemDTO } from "../../application/dtos/register-inventory-item.dto";
import { InventoryItemEntity } from "../entities/inventory-item-response.dto";
import { UpdateInventoryItemDTO } from "../../application/dtos/update-inventory-item.dto";

export interface InventoryItemRepository{
    save(dto: RegisterInventoryItemDTO): Promise<Result<InventoryItemEntity, ErrorEntity>>;
    update(dto: UpdateInventoryItemDTO): Promise<Result<InventoryItemEntity, ErrorEntity>>
    viewAllInventoryItem():Promise<Result<{inventoryItems:InventoryResponseDTO[]},ErrorEntity>>;
    deleteById(inventoryItemId: bigint): Promise<Result<any, ErrorEntity> | undefined>;
}