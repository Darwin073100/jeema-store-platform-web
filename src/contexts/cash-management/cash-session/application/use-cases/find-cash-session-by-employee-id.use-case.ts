import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";

export class FindCashSessionByEmployeeIdUseCase {
    constructor(
        private readonly repository: CashSessionRepository
    ){}

    async execute(employeeId: bigint){
        const result = await this.repository.findByEmployeeId(employeeId);
        if(!result){
            throw new CashSessionNotFoundException('No se encontró una caja aperturada.');
        }
        return result;
    }
}