import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { LotRepository } from "../../domain/repositories/lot.repository";
import { LotFetchRepositoryImpl } from "../lot-fetch-repository.impl";

export class LotRepositoryFactory{
    static create(): LotRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();

        return new LotFetchRepositoryImpl(httpClient, apiConfig);
    }
}