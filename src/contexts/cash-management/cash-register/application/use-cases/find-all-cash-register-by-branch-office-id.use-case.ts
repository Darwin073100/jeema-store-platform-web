import { CashRegisterRepository } from "../../domain/repositories/cash-register.repository";

export class FindAllCashRegisterByBranchOfficeIdUseCase{
    constructor(
        private readonly repository: CashRegisterRepository
    ){}

    async execute(branchOfficeId: bigint){
        const result = await this.repository.findAllByBranchOfficeId(branchOfficeId);
        return result;
    }
}