import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryRepository } from "../../domain/repositories/inventory.repository";

export class FindInventoryByIdUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository
    ){}

    async execute(inventoryId: bigint):Promise<InventoryEntity | null>{
        return this.inventoryRepository.findBarcodeById(inventoryId);
    }
}