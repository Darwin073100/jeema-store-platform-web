import { Result } from "@/shared/lib/utils/result";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { FindReportLotsDTO } from "../dtos/find-report-lots.dto";
import { ILot } from "../../presentation/interfaces/ILot";

export class FindReportLotsUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
    ) { }

    async execute(branchOfficeId: bigint, dto: FindReportLotsDTO) {
        if (branchOfficeId <= BigInt(0)) {
            return [];
        }
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
        const result = await this.lotRepository.findReport(branchOfficeId, currentDateInit, currentDateFinish);
        return result;
    }
}