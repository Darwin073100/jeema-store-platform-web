import TimeMaster from "@/shared/lib/utils/TimeMaster";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { ManyFilterTransactionsDTO } from "../dtos/many-filter-transactions.dto";
import { formatDateForInput } from "@/shared/lib/utils/date-formatter";

export class FindAllManyFilterTransactionsUseCase {
    constructor(
        private readonly repository: TransactionRepository
    ){}

    async execute(dto: ManyFilterTransactionsDTO){
         // Utilizamos nuestra libreria local para fechas.
        const date = new TimeMaster('America/Mexico_City');

        // Generamos la fecha de inicio, desde el primer dia del mes actual.
        let currentDateInit = date.getCurrentMonthRange().start;
        // Generamos la fecha final, hasta el ultimo dia del mes actual.
        let currentDateFinish = date.getCurrentMonthRange().end;
        if (dto.dateInit) {
            currentDateInit = dto.dateInit;
        }
        if (dto.dateEnd) {
            dto.dateEnd.setDate(dto.dateEnd.getDate()+1)
            currentDateFinish = dto.dateEnd;
        }
        
        try {
            const result = await this.repository.findAllByManyFilter({
                ...dto,
                dateInit: currentDateInit,
                dateEnd: currentDateFinish 
            });
            return result;
        } catch (error) {
            throw error;
        }
    }
}