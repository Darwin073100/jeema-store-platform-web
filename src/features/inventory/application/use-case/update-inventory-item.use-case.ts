import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { UpdateInventoryItemDTO } from "../dtos/update-inventory-item.dto";

export class UpdateInventoryItemUseCase{
    constructor(
        private readonly repository: InventoryItemRepository
    ){}

    async execute(dto: UpdateInventoryItemDTO){
        const result = await this.repository.update(dto);
        return result;
    }
}