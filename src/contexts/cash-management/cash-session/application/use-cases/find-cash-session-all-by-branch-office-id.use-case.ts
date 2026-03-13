import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";

export class FindCashSessionAllByBranchOfficeUseCase {
    constructor(
        private readonly repository: CashSessionRepository
    ){}

    async execute(branhcOfficeId: bigint, dateInit: Date, dateFinish: Date){
        const result = await this.repository.findAllByBranchOffice(branhcOfficeId, dateInit, dateFinish);
        if(!result){
            throw new CashSessionNotFoundException('No se encontró una caja aperturada.');
        }
        return result;
    }
}