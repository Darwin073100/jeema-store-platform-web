import TimeMaster from "@/shared/lib/utils/TimeMaster";
import { SaleEntity } from "../../domain/entities/sale.entity";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { SaleFilterDTO } from "../dtos/sale-filter.dto";

export class FindAllByBranchOfficeSaleAndFilterUseCase{
    constructor(
        private readonly repository: SaleRepository
    ){}

    async execute(dto: SaleFilterDTO):Promise<SaleEntity[]>{
        try {
            const date = new TimeMaster('America/Mexico_City');
            let currentSearch:string | undefined = undefined;
            let currentDateStart = dto.dateStart;
            if(!currentDateStart){
                currentDateStart = date.getCurrentMonthRange().start;
            }
            let currentDateEnd = dto.dateEnd;
            if(!currentDateEnd){
                currentDateEnd = date.getCurrentMonthRange().end;
            }

            if(dto.search && dto.search.trim().length > 0){
                currentDateStart = undefined;
                currentDateEnd = undefined;
                if(dto.search.trim().toUpperCase() === '*'.toUpperCase()){
                    currentSearch = undefined;
                } else {
                    currentSearch = dto.search;
                }
            }
            const result = await this.repository.findAllByBranchOfficeAndFilter(dto.branchOfficeId, currentDateStart, currentDateEnd, currentSearch);
            if(!result || result.length === 0){
                return []
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}