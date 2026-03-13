import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";

export class FindCashMovementsByBranchOfficeUseCase {
    constructor(
        private readonly repository: CashSessionRepository
    ){}

    async execute(branhcOfficeId: bigint){
        const result = await this.repository.findMovementsByBranchOffice(branhcOfficeId);
        if(!result){
            throw new CashSessionNotFoundException('No se encontró una caja aperturada.');
        }
        return result;
    }
}