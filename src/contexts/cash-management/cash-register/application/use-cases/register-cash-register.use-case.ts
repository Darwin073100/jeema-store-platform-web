import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { CashRegisterEntity } from "../../domain/entities/cash-register.entity";
import { CashRegisterRepository } from "../../domain/repositories/cash-register.repository";
import { RegisterCashRegisterDTO } from "../dtos/register-cash-register.dto";
import { CashRegisterNotFoundException } from "../../domain/exceptions/cash-register-not-found.exception";

export class RegisterCashRegisterUseCase {
    constructor(
        private readonly repository: CashRegisterRepository,
        private readonly branchRepository: BranchOfficeRepository,
    ){}

    async execute(command: RegisterCashRegisterDTO){
        const branchExist = await this.branchRepository.existById(command.branchOfficeId);
        
        if(!branchExist){
            throw new CashRegisterNotFoundException(`La sucursal asignada no existe.`);
        }

        const entity = CashRegisterEntity.create(command.branchOfficeId, command.name);
        const result = await this.repository.save(entity);
        return result;
    }
}