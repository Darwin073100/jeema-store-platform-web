import { CashRepository } from "../../domain/repositories/cash.repository";

export class FindCashMovementsByBranchOfficeIdUseCase {
    constructor(
        private readonly repository: CashRepository
    ){}

    async execute(branchOfficeId: bigint){
        const result = await this.repository.findMovementsByBranchOfficeId(branchOfficeId);
        return result;
    }
}