import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { CashRepository } from "../../domain/repositories/cash.repository";
import { CashFetchRepository } from "../repositories/cash-fetch.repository";

export class CashFetchRepositoryFactory {
    static create(): CashRepository {
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
        
        return new CashFetchRepository(httpClient, apiConfig);
    }
}