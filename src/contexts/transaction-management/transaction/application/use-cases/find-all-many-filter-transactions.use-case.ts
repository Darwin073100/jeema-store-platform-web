import TimeMaster from "@/shared/lib/utils/TimeMaster";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { ManyFilterTransactionsDTO } from "../dtos/many-filter-transactions.dto";

export class FindAllManyFilterTransactionsUseCase {
    constructor(
        private readonly repository: TransactionRepository
    ){}

    async execute(dto: ManyFilterTransactionsDTO){
        const timeMaster = new TimeMaster('America/Mexico_City');
        let dateInit = dto.dateInit;
        let dateEnd = dto.dateEnd;
        if(!dateInit){
            dateInit = timeMaster.getCurrentMonthRange().start;
        }
        if(dateEnd){
            dateEnd = timeMaster.getCurrentMonthRange().end;
        }
        try {
            const result = await this.repository.findAllByManyFilter({
                ...dto,
                dateInit,
                dateEnd
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}