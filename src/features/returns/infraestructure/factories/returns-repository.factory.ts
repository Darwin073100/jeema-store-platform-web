import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { ReturnsRepository } from "../../domain/repositories/returns.repository";
import { FetchReturnsRepository } from "../repositories/fetch-returns-repository";

export class ReturnsRepositoryFactory {
    static create():ReturnsRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();

        return new FetchReturnsRepository(httpClient, apiConfig);
    }
}