import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";
import { RegisterTransactionHttpDTO } from "../dtos/register-transaction-http.dto";

export class TransactionMapper {
    public static toRegisterTransactionHttpDTO(dto: RegisterTransactionDTO){
        const httpDto: RegisterTransactionHttpDTO = {
            transactionTypeId: dto.transactionTypeId.toString(),
            branchOfficeId: dto.branchOfficeId.toString(),
            saleId: dto.saleId?.toString() ?? undefined,
            purchaseId: dto.purchaseId?.toString() ?? undefined,
            employeeId: dto.employeeId.toString(),
            amount: dto.amount,
            description: dto.description,
        }
        return httpDto;
    }
}