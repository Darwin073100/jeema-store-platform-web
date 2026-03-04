import { Result } from "@/shared/features/result";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { ManyFilterTransactionsDTO } from "../dtos/many-filter-transactions.dto";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { formatDateForInput, formatDateTimeForInput } from "@/shared/lib/utils/date-formatter";

export class findAllManyFilterTransactionsUseCase {
    constructor(
        private readonly repository: TransactionRepository
    ){}

    async execute(dto: ManyFilterTransactionsDTO){
        if (dto.branchOfficeId && dto.branchOfficeId <= BigInt(0)) {
            return Result.success<{transactions: TransactionEntity[]}>({transactions: []});
        }
        // Optener año actual
        let getYear = new Date().getFullYear();
        let getMonth = new Date(formatDateTimeForInput(new Date())).getMonth();
        // Generamos la fecha de inicio, desde el primer dia del año
        let currentDateInit = new Date(`${getYear}-${getMonth}-01`);
        if(dto.dateInit){
            currentDateInit = dto.dateInit;
        }
        const currentDto = {
            ...dto,
            dateInit: currentDateInit,
        }
        const result = await this.repository.findAllManyFilter(currentDto);
        return result;
    }
}