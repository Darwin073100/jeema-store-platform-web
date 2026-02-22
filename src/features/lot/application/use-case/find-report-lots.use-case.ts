import { Result } from "@/shared/features/result";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { FindReportLotsDTO } from "../dtos/find-report-lots.dto";
import { LotEntity } from "../../domain/entities/lot.entity";

export class FindReportLotsUseCase{
    constructor(
        private readonly repository: LotRepository
    ){}

    async execute(branchOfficeId: bigint, dto: FindReportLotsDTO){
        if (branchOfficeId <= BigInt(0)) {
            return Result.success<{lots: LotEntity[]}>({lots: []});
        }
        // Optener año actual
        let getYear = new Date().getFullYear();
        // Generamos la fecha de inicio, desde el primer dia del año
        let currentDateInit = new Date(`${getYear}-01-01`);
        // Generamos la fecha final, hasta el ultimo dia del año
        let currentDateFinish = new Date(`${getYear}-12-31`);
        if(dto.dateInit){
            currentDateInit = dto.dateInit;
        }
        if(dto.dateFinish){
            currentDateFinish = dto.dateFinish;
        }
        const result = await this.repository.findReportLots(branchOfficeId, currentDateInit, currentDateFinish);
        return result; 
    }
}