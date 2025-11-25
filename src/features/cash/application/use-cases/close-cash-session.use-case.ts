import { ErrorEntity } from "@/shared/features/error.entity";
import { CashRepository } from "../../domain/repositories/cash.repository";
import { Result } from "@/shared/features/result";
import { CloseCashSessionDTO } from "../dtos/close-cash-session.dto";

export class CloseCashSessionUseCase {
    constructor(
        private readonly repository: CashRepository
    ){}

    async execute(cashSessionId: bigint, dto: CloseCashSessionDTO){
        if(dto.branchOfficeId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'No pudimos otener informacion de la sucursal.',
                message: 'Ha ocurrido un error inesperado.',
                path: 'OpenCashSessionUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        if(dto.employeeId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'Error con el empleado',
                message: 'Ha ocurrido un error inesperado.',
                path: 'OpenCashSessionUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        if(cashSessionId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                error: 'Error con la caja',
                message: 'Ha ocurrido un error inesperado.',
                path: 'CloseCashSessionUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        const result = await this.repository.closeCashSession(cashSessionId, dto);
        return result;
    }
}