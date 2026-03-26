import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";

export class FindTicketCashSessionUseCase{
    constructor(
        private readonly cashSessionRepository: CashSessionRepository
    ){}

    async execute(cashSessionId: bigint){
        const result = await this.cashSessionRepository.findCashSessionTicket(cashSessionId);
        if (!result) {
            throw new CashSessionNotFoundException('Ticket no encontrado.');
        }
        return result;
    }
}