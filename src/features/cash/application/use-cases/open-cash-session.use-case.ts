import { ErrorEntity } from "@/shared/features/error.entity";
import { CashRepository } from "../../domain/repositories/cash.repository";
import { OpenCashSessionDTO } from "../dtos/open-cash-session.dto";
import { Result } from "@/shared/features/result";

export class OpenCashSessionUseCase {
    constructor(
        private readonly repository: CashRepository
    ){}

    async execute(dto: OpenCashSessionDTO){
        if(dto.branchOfficeId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'No pudimos otener informacion de la sucursal.',
                message: 'Ha ocurrido un error inesperado.',
                path: 'RegisterCashRegisterUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        if(dto.cashRegisterId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'Error con la caja',
                message: 'Ha ocurrido un error inesperado.',
                path: 'RegisterCashRegisterUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        if(dto.employeeId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'Error con el empleado',
                message: 'Ha ocurrido un error inesperado.',
                path: 'RegisterCashRegisterUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        const result = await this.repository.openCashSession(dto);
        return result;
    }
}