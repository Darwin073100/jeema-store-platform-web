import { RegisterInventoryDTO } from "../../application/dtos/register-inventory.dto";
import { UpdateInventoryDTO } from "../../application/dtos/update-inventory.dto";
import { RegisterInventoryHttpDTO } from "../dtos/register-inventory.http.dto";
import { UpdateInventoryHttpDTO } from "../dtos/update-inventory.http.dto";

/**
 * Esta clase contiene metodos que convierten un DTO de aplicación a un DTO de infraestructura 
 * que se envia en el request de endpoind. 
 */
export class InventoryMapper {
    static toRegisterInventoryHttpDTO(dto: RegisterInventoryDTO){
        const httpDto: RegisterInventoryHttpDTO = {
            lotId: dto.lotId.toString(),
            branchOfficeId: dto.branchOfficeId.toString(),
            productId: dto.productId.toString(),
            isSellable: dto.isSellable,
            maxStockBranch: dto.maxStockBranch,
            minStockBranch: dto.minStockBranch,
            salePriceMany: dto.salePriceMany,
            salePriceOne: dto.salePriceOne,
            salePriceSpecial: dto.salePriceSpecial,
            saleQuantityMany: dto.saleQuantityMany
        }
        return httpDto;
    }
    static toUpdateInventoryHttpDTO(dto: UpdateInventoryDTO){
        const httpDto: UpdateInventoryHttpDTO = {
            inventoryId: dto.inventoryId.toString(),
            lotId: dto.lotId.toString(),
            branchOfficeId: dto.branchOfficeId.toString(),
            productId: dto.productId.toString(),
            isSellable: dto.isSellable,
            internalBarCode: dto.internalBarCode,
            maxStockBranch: dto.maxStockBranch,
            minStockBranch: dto.minStockBranch,
            salePriceMany: dto.salePriceMany,
            salePriceOne: dto.salePriceOne,
            salePriceSpecial: dto.salePriceSpecial,
            saleQuantityMany: dto.saleQuantityMany
        }
        return httpDto;
    }
} 