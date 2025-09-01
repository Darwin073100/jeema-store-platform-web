import { Result } from "@/shared/features/result";
import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { UpdateInventoryDTO } from "../dtos/update-inventory.dto";

export class UpdateInventoryUseCase{
    constructor(
        private readonly repository: InventoryRepository,
    ){}

    async execute(dto: UpdateInventoryDTO): Promise<Result<InventoryEntity, ErrorEntity>>{
        const result = await this.repository.update(dto);
        return result;
    }
}