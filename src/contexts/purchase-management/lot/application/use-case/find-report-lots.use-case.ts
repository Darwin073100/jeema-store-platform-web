import { LotRepository } from "../../domain/repositories/lot.repository";
import { FindReportLotsDTO } from "../dtos/find-report-lots.dto";

export class FindReportLotsUseCase {
    constructor(
        private readonly lotRepository: LotRepository,
    ) { }

    async execute(branchOfficeId: bigint,  dto: FindReportLotsDTO) {
        const result = await this.lotRepository.findReport(branchOfficeId, dto.dateInit, dto.dateFinish);
        return result;
    }
}