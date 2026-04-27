import TimeMaster from "@/shared/lib/utils/TimeMaster";
import { CashSessionNotFoundException } from "../../domain/exceptions/cash-session-not-found.exception";
import { CashSessionRepository } from "../../domain/repositories/cash-session.repository";
import { FindCashMovementsByBranchOfficeDTO } from "../dtos/find-cash-movements-by-branch-office.dto";

export class FindCashSessionAllByBranchOfficeUseCase {
    constructor(
        private readonly repository: CashSessionRepository
    ){}

    async execute(branhcOfficeId: bigint, dto: FindCashMovementsByBranchOfficeDTO){
        // Utilizamos nuestra libreria local para fechas.
        const date = new TimeMaster('America/Mexico_City');

        // Generamos la fecha de inicio, desde el primer dia del mes actual.
        let currentDateInit = date.getCurrentMonthRange().start;
        // Generamos la fecha final, hasta el ultimo dia del mes actual.
        let currentDateFinish = date.getCurrentMonthRange().end;
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