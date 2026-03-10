import { CashRepository } from "../../domain/repositories/cash.repository";
import { FindCashMovementsByBranchOfficeHttpDTO } from "../../infraestructure/dtos/find-cash-movements-by-branch-office-http.dto";
import { FindCashMovementsByBranchOfficeDTO } from "../dtos/find-cash-movements-by-branch-office.dto";

export class FindTicketCashSessionListUseCase {
    constructor(
        private readonly cashRepository: CashRepository
    ) { }

    async execute(branchOfficeId: bigint, dto: FindCashMovementsByBranchOfficeDTO) {
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
        const result = await this.cashRepository.findTicketCashSessionList(branchOfficeId, {
            dateInit: currentDateInit.toISOString(),
            dateFinish: currentDateFinish.toISOString()
        });
        return result;
    }
}