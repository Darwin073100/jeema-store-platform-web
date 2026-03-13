import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { ManyFilterTransactionsDTO } from "../dtos/many-filter-transactions.dto";

export class FindAllManyFilterTransactionsUseCase {
    constructor(
        private readonly repository: TransactionRepository
    ){}

    async execute(dto: ManyFilterTransactionsDTO){
        try {
            const result = await this.repository.findAllByManyFilter(dto);
            return result;
        } catch (error) {
            throw error;
        }
    }
}