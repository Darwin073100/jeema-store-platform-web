import { Result } from "@/shared/features/result";
import { ReturnsRepository } from "../../domain/repositories/returns.repository";

export class FindReturnsByBranchOfficeUseCase {
    constructor(
        private readonly repository: ReturnsRepository,
    ) { }

    async execute(branchOfficeId: bigint) {
        if (branchOfficeId <= BigInt(0)) {
            return Result.success({returns:[]})
        }        
        const result = await this.repository.findAllByBranchOfficeId(branchOfficeId);
        return result;
    }
}