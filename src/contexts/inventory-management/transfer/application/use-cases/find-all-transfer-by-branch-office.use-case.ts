import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { TransferRepository } from "../../domain/repositories/transfer.repository";
import { TransferNotFoundException } from "../../domain/exceptions/transfer-not-found.exception";

export class FindAllTransferByBranchOfficeUseCase {
    constructor(
        private readonly transfer: TransferRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
    ){}

    async execute(branchOfficeId: bigint){
        const branchExist = await this.branchOfficeRepository.existById(branchOfficeId);
        if(!branchExist){
            throw new TransferNotFoundException(`No se encontro una sucursal con id ${branchOfficeId}.`);
        }
        
        const result = await this.transfer.findAllByBranchOffice(branchOfficeId);
        return result;
    }
}