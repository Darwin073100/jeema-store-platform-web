import { InventoryRepository } from "../../domain/repositories/inventory.repository";
import { InventoryNotFoundException } from "src/contexts/inventory-management/inventory/domain/exceptions/inventory-not-found.exception";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { FilterProductListDTO } from "@/contexts/product-management/product/application/dtos/filter-product-list.dto";

export class FindSellableInventoriesWithoutItemsUseCase {
    constructor(
        private readonly branchRepository: BranchOfficeRepository,
        private readonly inventoryRepository: InventoryRepository,
    ){}

    async execute(branchOfficeId: bigint, dto: FilterProductListDTO){
        try {
            let currentProductSearch: undefined | string = dto.product;
            if(!dto.product){
                return [];
            }
            if(dto.product.trim() === '*'){
                currentProductSearch = undefined;
            }

            const branchOfficeExist = await this.branchRepository.existById(branchOfficeId);
            if(!branchOfficeExist){
                throw new InventoryNotFoundException(`La sucursal con ID(${branchOfficeId}) no existe.`);
            }

            const result = await this.inventoryRepository.findSellableWithoutItemsByBranchOffice(branchOfficeId, { product: currentProductSearch });
            return result;
        } catch (error) {
            throw error;
        }
    }
}
