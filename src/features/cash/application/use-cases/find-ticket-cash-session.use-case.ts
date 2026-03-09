import { CashRepository } from "../../domain/repositories/cash.repository";

export class FindTicketCashSessionUseCase {
    constructor(
        private readonly cashRepository: CashRepository
    ){}

    async execute(cashSessionId: bigint){
        const result = await this.cashRepository.findTicketCashSession(cashSessionId);
        return result;
    }
}