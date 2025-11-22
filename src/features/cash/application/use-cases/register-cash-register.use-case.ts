import { Result } from "@/shared/features/result";
import { CashRepository } from "../../domain/repositories/cash.repository";
import { RegisterCashRegisterDTO } from "../dtos/register-cash-register.dto";
import { ErrorEntity } from "@/shared/features/error.entity";

export class RegisterCashRegisterUseCase {
    constructor(
        private readonly repository: CashRepository
    ){}

    async execute(dto: RegisterCashRegisterDTO){
        if(dto.branchOfficeId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'No pudimos otener informacion de la sucursal.',
                message: 'Ha ocurrido un error inesperado.',
                path: 'RegisterCashRegisterUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        const result = await this.repository.registerCashRegister(dto);
        return result;
    }
}