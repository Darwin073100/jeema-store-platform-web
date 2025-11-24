import { CashRepository } from "../../domain/repositories/cash.repository";

export class FindCashSessionWithTransactionsUseCase {
    constructor(
        private readonly repository: CashRepository
    ){}

    async execute(cashSessionId: bigint){
        const result = await this.repository.findCashSessionWithTransactions(cashSessionId);
        return result;
    }
}