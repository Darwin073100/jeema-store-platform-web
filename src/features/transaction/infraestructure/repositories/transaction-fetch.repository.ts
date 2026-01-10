import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterTransactionDTO } from "../../application/dtos/register-transaction.dto";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ManyFilterTransactionsDTO } from "../../application/dtos/many-filter-transactions.dto";

export class TransactionFectchRepository implements TransactionRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async save(dto: RegisterTransactionDTO): Promise<Result<TransactionEntity, ErrorEntity>> {
        try {
            const httpDto = TransactionMapper.toRegisterTransactionHttpDTO(dto);

            const response = await this.httpClient.post<TransactionEntity>(
                this.apiConfig.getEndpointUrl('/transactions'),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return handleError(error, 'save');
        }  
    }
    async findAllManyFilter(dto: ManyFilterTransactionsDTO): Promise<Result<{transactions: TransactionEntity[]}, ErrorEntity>> {
        try {
            const httpDto = TransactionMapper.toManyFilterTransactionsHttp(dto);
            const response = await this.httpClient.post<{transactions: TransactionEntity[]}>(
                this.apiConfig.getEndpointUrl('/transactions/filters'),
                httpDto
            );
            return Result.success(response.data);

        } catch (error: any) {
            return handleError(error, 'findAllManyFilter');
        }  
    }
}