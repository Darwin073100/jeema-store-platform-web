import { LotRepository } from "../../domain/repositories/lot.repository";
import { RegisterLotDto } from "../dtos/register-lot.dto";
import { LotEntity } from "../../domain/entities/lot.entity";
import { AddInventoryItemUseCase } from "@/contexts/inventory-management/inventory-item/application/use-case/add-inventory-item.use-case";

export class RegisterLotWithInventoryItemUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
        private readonly addInventoryItemUseCase: AddInventoryItemUseCase
    ) { }

    async execute(dto: RegisterLotDto, itemId: bigint) {
        const lot = LotEntity.reconstitute(
            BigInt(0),
            dto.productId,
            dto.suplierId,
            dto.lotNumber,
            dto.purchasePrice,
            dto.initialQuantity,
            dto.purchaseUnit,
            dto.receivedDate,
            dto.expirationDate,
            dto.manufacturingDate,
            new Date(),
            null,
            null,
            null,
            null,
            null
        );
        const result = await this.lotRepository.save(lot);

        if (itemId !== BigInt(0)) {
            await this.addInventoryItemUseCase.execute(itemId, dto.initialQuantity);
        }

        return result;
    }
}