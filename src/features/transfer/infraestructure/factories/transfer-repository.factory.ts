import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { TransferRepository } from "../../domain/repositories/transfer.repository";
import { TransferFetchRepository } from "../repositories/transfer-fetch.repository";

export class TransferRepositoryFactory{
    static create(): TransferRepository {
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
        
        return new TransferFetchRepository(httpClient, apiConfig);
    }
}