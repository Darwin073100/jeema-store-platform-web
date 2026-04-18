import { BranchOfficeRepository } from "../../domain/repositories/branch-office.repository";

export class FindBranchOfficeByIdUseCase {
    constructor(
        private readonly branchOfficeRepository: BranchOfficeRepository
    ){}

    async execute(branchOfficeId: bigint){
        if(branchOfficeId <= BigInt(0)){
            return null;
        }
        const result = await this.branchOfficeRepository.findById(branchOfficeId);
        return result;
    }
}