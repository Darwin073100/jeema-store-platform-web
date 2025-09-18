import { Result } from "@/shared/features/result";
import { RegisterInventoryDTO } from "../../application/dtos/register-inventory.dto";
import { UpdateInventoryDTO } from "../../application/dtos/update-inventory.dto";
import { InventoryEntity } from "../entities/inventory.entity";
import { ErrorEntity } from "@/shared/features/error.entity";

export interface InventoryRepository{
    save(dto: RegisterInventoryDTO):Promise<Result<InventoryEntity, ErrorEntity>>;
    update(dto: UpdateInventoryDTO):Promise<Result<InventoryEntity, ErrorEntity>>;
    findByBarCode(barCode: string):Promise<Result<InventoryEntity, ErrorEntity>>
}