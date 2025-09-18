import { AddDetailToSaleDto } from "../../application/dtos/add-detail-to-sale.dto";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { AddDetailToSaleHttpDto } from "../dtos/add-detail-to-sale-http.dto";
import { RegisterSaleHttpDto } from "../dtos/register-sale-http.dto";

export class SaleMapper {
    static toHttpRegisterSaleDTO(dto: RegisterSaleDto){
        const httpDTO: RegisterSaleHttpDto = {
            branchOfficeId: dto.branchOfficeId.toString(),
            customerId: dto.customerId.toString(),
            employeeId: dto.employeeId.toString(),
        }
        return httpDTO;
    }

    static toHttpAddDetailToSaleDTO(dto: AddDetailToSaleDto){
        const httpDTO: AddDetailToSaleHttpDto = {
            productBarCodeAtSale: dto.productBarCodeAtSale,
            productUnitAtSale: dto.productUnitAtSale,
            quantity: dto.quantity,
            unitPriceAtSale: dto.unitPriceAtSale,
            notes: dto.notes
        }

        return httpDTO;
    }
}