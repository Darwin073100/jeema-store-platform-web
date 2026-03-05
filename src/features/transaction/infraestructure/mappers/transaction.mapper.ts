import { ManyFilterTransactionsDTO } from "../../application/dtos/many-filter-transactions.dto";
import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";
import { ManyFilterTransactionsHttpDTO } from "../dtos/many-filter-transactions-http.dto";
import { RegisterTransactionHttpDTO } from "../dtos/register-transaction-http.dto";

export class TransactionMapper {
    public static toRegisterTransactionHttpDTO(dto: RegisterTransactionDTO){
        const httpDto: RegisterTransactionHttpDTO = {
            transactionTypeId: dto.transactionTypeId.toString(),
            branchOfficeId: dto.branchOfficeId.toString(),
            saleId: dto.saleId?.toString() ?? undefined,
            purchaseId: dto.purchaseId?.toString() ?? undefined,
            cashSessionId: dto.cashSessionId?.toString() ?? undefined,
            employeeId: dto.employeeId.toString(),
            amount: dto.amount,
            description: dto.description,
        }
        return httpDto;
    }

    public static toManyFilterTransactionsHttp(dto: ManyFilterTransactionsDTO){
        const httpDTO: ManyFilterTransactionsHttpDTO = {
            establishmentId: dto.establishmentId.toString(),
            branchOfficeId: dto.branchOfficeId? dto.branchOfficeId.toString(): undefined,
            employeeId: dto.employeeId? dto.employeeId.toString(): undefined,
            cashSessionId: dto.cashSessionId? dto.cashSessionId.toString(): undefined,
            saleId: dto.saleId? dto.saleId.toString(): undefined,
            dateInit: dto.dateInit? dto.dateInit.toISOString(): undefined,
            dateEnd: dto.dateEnd? dto.dateEnd.toISOString(): undefined,
            transactionType: dto.transactionType? dto.transactionType: undefined,
        }
        return httpDTO;
    }
}