import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";

export class FindCashSessionWithTransactionsUseCase {
    constructor(
        private readonly repository: CashSessionRepository
    ){}

    async execute(cashSessionId: bigint){
        const result = await this.repository.findCashSessionWitTransactions(cashSessionId);
        if(!result){
            throw new CashSessionNotFoundException('No se encontró una caja aperturada.');
        }
        return result;
    }
}