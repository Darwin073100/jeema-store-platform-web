import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { InventoryRepository } from "../../domain/repositories/inventory-repository";
import { InventoryFetchRepository } from "../repositories/inventory-fetch.repository";

export class InventoryRepositoryFactory{
    static create(): InventoryRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const getApiConfig = DependencyFactory.getApiConfig();

        return new InventoryFetchRepository(httpClient, getApiConfig);
    }
}