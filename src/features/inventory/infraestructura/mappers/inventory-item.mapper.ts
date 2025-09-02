import { RegisterInventoryItemDTO } from "../../application/dtos/register-inventory-item.dto";
import { UpdateInventoryItemDTO } from "../../application/dtos/update-inventory-item.dto";
import { RegisterInventoryItemHttpDTO } from "../dtos/register-inventory-item.http.dto";
import { UpdateInventoryItemHttpDTO } from "../dtos/update-inventory-item.http.dto";

export class InventoryItemMapper {
    static toUpdateInventoryItemHttpDTO(dto: UpdateInventoryItemDTO){
        const httpDto: UpdateInventoryItemHttpDTO = {
            inventoryItemId: dto.inventoryItemId.toString(),
            inventoryId: dto.inventoryId.toString(),
            lastStockedAt: dto.lastStockedAt.toJSON(),
            location: dto.location,
            purchasePriceAtStock: dto.purchasePriceAtStock,
            quantityOnHan: dto.quantityOnHan,
            internalBarCode: dto.internalBarCode ?? undefined
        }
        return httpDto;
    }
    static toRegisterInventoryItemHttpDTO(dto: RegisterInventoryItemDTO){
        const httpDto: RegisterInventoryItemHttpDTO = {
            inventoryId: dto.inventoryId.toString(),
            lastStockedAt: dto.lastStockedAt.toJSON(),
            location: dto.location,
            purchasePriceAtStock: dto.purchasePriceAtStock,
            quantityOnHan: dto.quantityOnHan,
            internalBarCode: dto.internalBarCode ?? undefined
        }
        return httpDto;
    }
} 