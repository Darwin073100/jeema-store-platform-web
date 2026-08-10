import { CashRegisterRepository } from "../../domain/repositories/cash-register.repository";
import { CashSessionRepository } from "src/contexts/cash-management/cash-session/domain/repositories/cash-session.repository";
import { UpdateCashRegisterStatusDTO } from "../dtos/update-cash-register-status.dto";
import { CashRegisterNotFoundException } from "../../domain/exceptions/cash-register-not-found.exception";
import { CashRegisterInvalidException } from "../../domain/exceptions/cash-register-invalid.exception";

export class UpdateCashRegisterStatusUseCase {
    constructor(
        private readonly repository: CashRegisterRepository,
        private readonly cashSessionRepository: CashSessionRepository,
    ){}

    async execute(command: UpdateCashRegisterStatusDTO){
        const entity = await this.repository.findById(command.cashRegisterId);

        if(!entity){
            throw new CashRegisterNotFoundException('La caja que intenta actualizar no existe.');
        }

        if(!command.isActive){
            const openSession = await this.cashSessionRepository.isClosedCashSession(command.cashRegisterId);
            if(openSession){
                throw new CashRegisterInvalidException('No se puede desactivar una caja con una sesión abierta, primero realiza el corte del día.');
            }
        }

        entity.updateIsActive(command.isActive);
        const result = await this.repository.save(entity);
        return result;
    }
}
