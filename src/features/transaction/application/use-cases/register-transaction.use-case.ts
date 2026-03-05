import { Result } from "@/shared/features/result";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { RegisterTransactionDTO } from "../dtos/register-transaction.dto";
import { ErrorEntity } from "@/shared/features/error.entity";

export class RegisterTransactionUseCase {
    constructor(
        private readonly repository: TransactionRepository
    ) { }

    async execute(dto: RegisterTransactionDTO) {
        try {
            if (dto.branchOfficeId <= BigInt(0)) {
                return Result.failure<ErrorEntity>({
                    error: 'No pudimos realizar el proceso.',
                    message: 'Ha ocurrido un error inesperado.',
                    path: 'ReturnsProductsUseCase',
                    statusCode: 500,
                    timestamp: new Date().toISOString()
                });
            }
            const result = await this.repository.save(dto);
            return result;
        } catch (error) {
            return Result.failure<ErrorEntity>({
                error: 'No pudimos realizar el proceso.',
                message: 'Ha ocurrido un error inesperado.',
                path: 'ReturnsProductsUseCase',
                statusCode: 500,
                timestamp: new Date().toISOString()
            });
        }
    }
}