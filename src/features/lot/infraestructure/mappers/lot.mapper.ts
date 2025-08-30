import { RegisterLotDTO } from "../../application/dtos/register-lot.dto";
import { UpdateLotDTO } from "../../application/dtos/update-lot.dto";
import { RegisterLotHttpDTO } from "../dtos/register-lot-http.dto";
import { UpdateLotHttpDTO } from "../dtos/update-lot-http.dto";

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
            expirationDate: dto.expirationDate?.toJSON(),
            manufacturingDate: dto.manufacturingDate?.toJSON()
        }

        return httpDto;
    }
}