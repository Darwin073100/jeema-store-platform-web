import { LotRepository } from "../../domain/repositories/lot.repository";
import { FindReportLotsDTO } from "../dtos/find-report-lots.dto";
import TimeMaster from "@/shared/lib/utils/TimeMaster";

export class FindReportLotsUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
    ) { }

    async execute(branchOfficeId: bigint, dto: FindReportLotsDTO) {
        if (branchOfficeId <= BigInt(0)) {
            return [];
        }
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
        const result = await this.lotRepository.findReport(branchOfficeId, currentDateInit, currentDateFinish);
        return result;
    }
}