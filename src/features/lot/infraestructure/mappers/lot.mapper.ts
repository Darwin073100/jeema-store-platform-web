import { AddLotUnitPurchaseDTO } from "../../application/dtos/add-lot-unit-purchase.dto";
import { RegisterLotDTO } from "../../application/dtos/register-lot.dto";
import { UpdateLotUnitPurchaseDTO } from "../../application/dtos/update-lot-unit-purchase.dto";
import { UpdateLotDTO } from "../../application/dtos/update-lot.dto";
import { AddLotUnitPurchaseHttpDTO } from "../dtos/add-lot-unit-purchase-http.dto";
import { RegisterLotHttpDTO } from "../dtos/register-lot-http.dto";
import { UpdateLotHttpDTO } from "../dtos/update-lot-http.dto";
import { UpdateLotUnitPurchaseHttpDTO } from "../dtos/update-lot-unit-purchase-http.dto";

export class LotMapper {
    static toUpdateLotHttpRequest(dto: UpdateLotDTO){
        const httpDto: UpdateLotHttpDTO = {
            lotId: dto.lotId.toString(),
            productId: dto.productId.toString(),
            lotNumber: dto.lotNumber,
            initialQuantity: dto.initialQuantity,
            purchasePrice: dto.purchasePrice,
            purchaseUnit: dto.purchaseUnit,
            receivedDate: dto.receivedDate.toJSON(),
            expirationDate: dto.expirationDate?.toJSON(),
            manufacturingDate: dto.manufacturingDate?.toJSON()
        }

        return httpDto;
    }
    static toRegisterLotHttpRequest(dto: RegisterLotDTO){
        const httpDto: RegisterLotHttpDTO = {
            productId: dto.productId.toString(),
            lotNumber: dto.lotNumber,
            initialQuantity: dto.initialQuantity,
            purchasePrice: dto.purchasePrice,
            purchaseUnit: dto.purchaseUnit,
            receivedDate: dto.receivedDate.toJSON(),
            expirationDate: dto.expirationDate? dto.expirationDate?.toJSON(): undefined,
            manufacturingDate: dto.manufacturingDate? dto.manufacturingDate?.toJSON(): undefined,
        }

        return httpDto;
    }

    static toAddLotUnitPurchaseHttpDTO(dto: AddLotUnitPurchaseDTO){
        const httpDto: AddLotUnitPurchaseHttpDTO = {
            lotId: dto.lotId.toString(),
            purchasePrice: dto.purchasePrice,
            purchaseQuantity: dto.purchaseQuantity,
            unit: dto.unit,
            unitsInPurchaseUnit: dto.unitsInPurchaseUnit
        }

        return httpDto;
    }
    static toUpdateLotUnitPurchaseHttpDTO(dto: UpdateLotUnitPurchaseDTO){
        const httpDto: UpdateLotUnitPurchaseHttpDTO = {
            lotUnitPurchaseId: dto.lotUnitPurchaseId.toString(),
            lotId: dto.lotId.toString(),
            purchasePrice: dto.purchasePrice,
            purchaseQuantity: dto.purchaseQuantity,
            unit: dto.unit,
            unitsInPurchaseUnit: dto.unitsInPurchaseUnit
        }

        return httpDto;
    }
}