import { ReturnsProductsDTO } from "../../application/dtos/returns-products.dto";
import { ReturnsProductsHttpDTO } from "../dtos/sale-detail-register-http.dto";

export class ReturnsMapper {
    static toReturnsProductsHttpDTO(dto: ReturnsProductsDTO){
        const httpDTO: ReturnsProductsHttpDTO = {
            branchOfficeId: dto.branchOfficeId.toString(),
            cashSessionId: dto.cashSessionId.toString(),
            employeeId: dto.employeeId.toString(),
            saleId: dto.saleId.toString(),
            products: dto.products.map(item=> ({
                amountReturn: item.amountReturn,
                inventoryId: item.inventoryId.toString(),
                saleDetailId: item.saleDetailId.toString(),
                quantityReturn: item.quantityReturn,
                notes: item.notes? item.notes: undefined
            }))
        }
        return httpDTO;
    }
}