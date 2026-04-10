import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";
import { LocationEnum } from "../../domain/enums/location.enum";
import { InventoryNotFoundException } from "src/contexts/inventory-management/inventory/domain/exceptions/inventory-not-found.exception";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { FilterProductListDTO } from "@/contexts/product-management/product/application/dtos/filter-product-list.dto";

export class FindByLocationAndBranchOfficeItemUseCase {
    constructor(
        private readonly branchRepository: BranchOfficeRepository,
        private readonly itemRepository: InventoryItemRepository,
    ){}

    async execute(branchOfficeId: bigint, dto: FilterProductListDTO, location: string | null ){
        console.log(dto);
        try {
            let currentProductSearch:undefined|string = dto.product;
            if(!dto.product){
                return [];
            }
            if(dto.product.trim()==='*'){
                currentProductSearch = undefined;
            }
            const currentLocation = location? location: 'venta'
            const objLocation = Object.values(LocationEnum);
            const locationExist = await objLocation.find(item => item.trim().toLocaleLowerCase() === currentLocation.trim().toLowerCase());
            
            if(!locationExist){
                throw new InventoryNotFoundException(`La localizacion no existe, las opciones deben ser (${objLocation}).`);
            }

            const branchOfficeExist = await this.branchRepository.existById(branchOfficeId);
            if(!branchOfficeExist){
                throw new InventoryNotFoundException(`La sucursal con ID(${branchOfficeId}) no existe.`);
            }

            const result = await this.itemRepository.findByLocationAndBranchOffice(branchOfficeId, {product: currentProductSearch}, currentLocation as LocationEnum);
            if(!result){
                throw new InventoryNotFoundException(`La sucursal con ID(${branchOfficeId}) no tiene items en la ubicacion (${location}).`);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}