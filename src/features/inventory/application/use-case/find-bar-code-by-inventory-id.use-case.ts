import { Result } from "@/shared/features/result";
import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { ErrorEntity } from "@/shared/features/error.entity";

export class FindBarCodeByInventoryIdUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository
    ) { }

    async execute(inventoryId: bigint): Promise<Result<any, ErrorEntity>> {
        try {
            if (inventoryId === BigInt(0)) {
                const errorEmpty: ErrorEntity = {
                    error: 'No se encontró la etiqueta',
                    message: 'No pudimos encontrar el codigo de barras.',
                    statusCode: 404,
                    path: 'Find Inventory By BarCode',
                    timestamp: new Date().toISOString()
                }
                return Result.failure(errorEmpty);
            }
            const result =  await this.inventoryRepository.findBarcodeByInventoryId(inventoryId);
            return result;
        } catch (error) {
            console.log(error);
            const errorEmpty: ErrorEntity = {
                error: 'No se encontró la etiqueta',
                message: 'No pudimos encontrar el codigo de barras.',
                statusCode: 404,
                path: 'Find Inventory By BarCode',
                timestamp: new Date().toISOString()
            }
            return Result.failure(errorEmpty);
        }
    }
}