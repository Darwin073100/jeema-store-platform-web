import { Result } from "@/shared/features/result";
import { CashRepository } from "../../domain/repositories/cash.repository";
import { FindCashMovementsByBranchOfficeDTO } from "../dtos/find-cash-movements-by-branch-office.dto";
import { CashSessionEntity } from "../../domain/entities/cash-session.entity";

export class FindCashMovementsByBranchOfficeIdUseCase {
    constructor(
        private readonly repository: CashRepository
    ) { }

    async execute(branchOfficeId: bigint, dto: FindCashMovementsByBranchOfficeDTO) {
        if (branchOfficeId <= BigInt(0)) {
            return Result.success<{ cashSessions: CashSessionEntity[] }>({ cashSessions: [] });
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
        const result = await this.repository.findMovementsByBranchOfficeId(branchOfficeId, {
            dateInit: currentDateInit.toISOString(),
            dateFinish: currentDateFinish.toISOString()
        });
        return result;
    }
}