import { InventoryRepository } from "@/features/inventory/domain/repositories/inventory-repository";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { RegisterLotDTO } from "../dtos/register-lot.dto";
import { Result } from "@/shared/features/result";
import { ErrorEntity } from "@/shared/features/error.entity";

export class RegisterLotWithInventoryItemUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
        private readonly inventoryRepository: InventoryRepository
    ) { }

    async execute(dto: RegisterLotDTO, itemId: bigint) {
        const result = await this.lotRepository.save(dto);

        if (itemId !== BigInt(0)) {
            if (result.ok) {
                const resultInv = await this.inventoryRepository.addStockItem(itemId, dto.initialQuantity);
                if (!resultInv.ok) {
                    return Result.failure<ErrorEntity>({
                        error: resultInv.error?.error ?? '',
                        message: resultInv.error?.message ?? '',
                        path: resultInv.error?.path ?? '',
                        statusCode: resultInv.error?.statusCode ?? 500,
                        timestamp: resultInv.error?.timestamp ?? new Date().toString()
                    });
                }
            }
        }

        return result;
    }
}