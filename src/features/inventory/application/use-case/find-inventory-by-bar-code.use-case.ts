import { Result } from "@/shared/features/result";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { ErrorEntity } from "@/shared/features/error.entity";

export class FindInventoryByBarCodeUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository
    ) {}

    async execute(barCode: string): Promise<Result<InventoryEntity, ErrorEntity>> {
        if(barCode.trim() === '') {
            const errorEmpty: ErrorEntity = {
                error: 'El Codigo de barra no puede ir vacío.',
                message: 'El Codigo de barra proporcionado está vacío. Por favor, proporciona un Codigo de barra válido.',
                statusCode: 400,
                path: 'Find Inventory By BarCode',
                timestamp: new Date().toISOString()
            }
            return Result.failure(errorEmpty);
        }
        return this.inventoryRepository.findByBarCode(barCode);
    }
}