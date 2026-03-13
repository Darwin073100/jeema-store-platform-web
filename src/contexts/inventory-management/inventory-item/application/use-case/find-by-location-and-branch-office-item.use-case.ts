import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { LocationEnum } from "../../domain/enums/location.enum";
import { InventoryNotFoundException } from "src/contexts/inventory-management/inventory/domain/exceptions/inventory-not-found.exception";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";

export class FindByLocationAndBranchOfficeItemUseCase {
    constructor(
        private readonly branchRepository: BranchOfficeRepository,
        private readonly itemRepository: InventoryItemRepository,
    ){}

    async execute(branchOfficeId: bigint, location: string ){
        try {

            const objLocation = Object.values(LocationEnum);
            const locationExist = await objLocation.find(item => item.trim().toLocaleLowerCase() === location.trim().toLowerCase());
            
            if(!locationExist){
                throw new InventoryNotFoundException(`La localizacion no existe, las opciones deben ser (${objLocation}).`);
            }

            const branchOfficeExist = await this.branchRepository.existById(branchOfficeId);
            if(!branchOfficeExist){
                throw new InventoryNotFoundException(`La sucursal con ID(${branchOfficeId}) no existe.`);
            }

            const result = await this.itemRepository.findByLocationAndBranchOffice(branchOfficeId, location as LocationEnum);
            if(!result){
                throw new InventoryNotFoundException(`La sucursal con ID(${branchOfficeId}) no tiene items en la ubicacion (${location}).`);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}