import { CashRepository } from "../../domain/repositories/cash.repository";

export class FindCashSessionByEmployeeIdUseCase {
    constructor(
        private readonly repository: CashRepository
    ){}

    async execute(employeeId: bigint){
        const result = await this.repository.findCashSessionByEmployeeId(employeeId);
        return result;
    }
}