import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";
import { FindCashMovementsByBranchOfficeDTO } from "../dtos/find-cash-movements-by-branch-office.dto";

export class FindCashSessionAllByBranchOfficeUseCase {
    constructor(
        private readonly repository: CashSessionRepository
    ){}

    async execute(branhcOfficeId: bigint, dto: FindCashMovementsByBranchOfficeDTO){
        // Optener año actual
        let getYear = new Date().getFullYear();
        // Generamos la fecha de inicio, desde el primer dia del año
        let currentDateInit = new Date(`${getYear}-01-01`);
        // Generamos la fecha final, hasta el ultimo dia del año
        let currentDateFinish = new Date(`${getYear}-12-31`);
        if (dto.dateInit) {
            currentDateInit = dto.dateInit;
        }
        if (dto.dateFinish) {
            currentDateFinish = dto.dateFinish;
        }

        const result = await this.repository.findAllByBranchOffice(branhcOfficeId, currentDateInit, currentDateFinish);
        if(!result){
            throw new CashSessionNotFoundException('No se encontró una caja aperturada.');
        }
        return result;
    }
}