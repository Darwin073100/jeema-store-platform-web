import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { TransactionFectchRepository } from "../repositories/transaction-fetch.repository";

export class TransactionRepositoryFactory {
    static create(): TransactionFectchRepository {
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
        
        return new TransactionFectchRepository(httpClient, apiConfig);
    }
}