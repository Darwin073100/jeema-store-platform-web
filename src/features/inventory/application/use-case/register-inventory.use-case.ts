import { Result } from "@/shared/features/result";
import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { RegisterInventoryDTO } from "../dtos/register-inventory.dto";
import { InventoryEntity } from "../../domain/entities/inventory.entity";
import { ErrorEntity } from "@/shared/features/error.entity";

export class RegisterInventoryUseCase{
    constructor(
        private readonly repository: InventoryRepository,
    ){}

    async execute(dto: RegisterInventoryDTO): Promise<Result<InventoryEntity, ErrorEntity>>{
        if(!dto.salePriceMany || !dto.saleQuantityMany){
            const result = await this.repository.save({
                ...dto,
                salePriceMany: null,
                saleQuantityMany: null
            });
            return result;
        }
        const result = await this.repository.save(dto);
        return result;
    }
}