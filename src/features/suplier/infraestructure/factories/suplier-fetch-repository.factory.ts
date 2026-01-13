import { SuplierFetchRepository } from "../repositories/suplier-fetch.repository";
import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { SuplierRepository } from "../../domain/repositories/suplier.repository";

export class SuplierFetchRepositoryFactory {
    public static create(): SuplierRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();

        const repository = new SuplierFetchRepository(httpClient, apiConfig);
        return repository;
    }
}