import { Result } from "@/shared/features/result";
import { ReturnsRepository } from "../../domain/repositories/returns.repository";
import { ReturnsProductsDTO } from "../dtos/returns-products.dto";
import { ErrorEntity } from "@/shared/features/error.entity";
import { FindCashSessionByEmployeeIdUseCase } from "@/features/cash/application/use-cases/find-cash-session-by-employee-id.use-case";

export class ReturnsProductsUseCase {
    constructor(
        private readonly repository: ReturnsRepository,
        private readonly findCashSessionByEmployeeIdUseCase: FindCashSessionByEmployeeIdUseCase
    ) { }

    async execute(dto: ReturnsProductsDTO) {
        if (dto.branchOfficeId <= BigInt(0)) {
            return Result.failure<ErrorEntity>({
                error: 'No pudimos realizar la devolución.',
                message: 'Ha ocurrido un error inesperado.',
                path: 'ReturnsProductsUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        if (dto.employeeId <= BigInt(0)) {
            return Result.failure<ErrorEntity>({
                error: 'No pudimos realizar la devolución.',
                message: 'Ha ocurrido un error inesperado.',
                path: 'ReturnsProductsUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        if (dto.saleId <= BigInt(0)) {
            return Result.failure<ErrorEntity>({
                error: 'No pudimos realizar la devolución.',
                message: 'Ha ocurrido un error inesperado.',
                path: 'ReturnsProductsUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        const cashSessionResult  = await this.findCashSessionByEmployeeIdUseCase.execute(dto.employeeId);
        if(!cashSessionResult.ok && !cashSessionResult.value){
            return Result.failure<ErrorEntity>({
                error: 'Caja no aperturada 😢',
                message: 'No haz realizado la apertura de caja.',
                path: 'ReturnsProductsUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
        const currentDTO: ReturnsProductsDTO = {
            ...dto,
            cashSessionId: cashSessionResult.value?.cashSessionId ?? BigInt(0)
        }
        const result = await this.repository.saveAll(currentDTO);
        return result;
    }
}