import { Result } from "@/shared/features/result";
import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { ErrorEntity } from "@/shared/features/error.entity";
import { LocationEnum } from "../../domain/enums/location.enum";
import { InventoryItemEntity } from "../../domain/entities/inventory-item.entity";

export class FindAllInventoryItemsByLocationAndBranchOfficeUseCase {
    constructor(
        private readonly inventoryRepository: InventoryRepository
    ) {}

    async execute(branchOffice: bigint, location?: LocationEnum): Promise<Result<{items:InventoryItemEntity[]}, ErrorEntity>> {
        return this.inventoryRepository.findAllByLocationAndBranchOffice(branchOffice, location?? LocationEnum.SALE);
    }
}