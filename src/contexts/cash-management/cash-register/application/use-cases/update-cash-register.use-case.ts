import { CashRegisterRepository } from "../../domain/repositories/cash-register.repository";
import { UpdateCashRegisterDTO } from "../dtos/update-cash-register.dto";
import { CashRegisterNotFoundException } from "../../domain/exceptions/cash-register-not-found.exception";

export class UpdateCashRegisterUseCase {
    constructor(
        private readonly repository: CashRegisterRepository,
    ){}

    async execute(command: UpdateCashRegisterDTO){
        const entity = await this.repository.findById(command.cashRegisterId);

        if(!entity){
            throw new CashRegisterNotFoundException('La caja que intenta editar no existe.');
        }

        entity.updateName(command.name);
        const result = await this.repository.save(entity);
        return result;
    }
}
