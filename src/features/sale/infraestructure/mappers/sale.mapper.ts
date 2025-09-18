import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
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
}