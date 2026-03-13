import { ReturnsRepository } from "../../domain/repositories/returns.repository";

export class FindReturnsByBranchOfficeUseCase {
    constructor(
        private readonly repository: ReturnsRepository
    ){}

    async execute(branchOfficeId: bigint){
        const result = await this.repository.findAllByBranchOfficeId(branchOfficeId);
        return result;
    }
}