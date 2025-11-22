import { CashRepository } from "../../domain/repositories/cash.repository";

export class FindAllCashRegisterByBranchOfficeIdUseCase {
    constructor(
        private readonly repository: CashRepository
    ){}

    async execute(branchOfficeId: bigint){
        const result = await this.repository.findAllCashRegisterByBranchOfficeId(branchOfficeId);
        return result;
    }
}