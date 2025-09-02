import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { InventoryItemFetchRepositoryImpl } from "../repositories/inventory-item.fetch.repository.impl";
import { InventoryItemRepository } from "../../domain/repositories/inventory-item.repository";

export class InventoryItemRepositoryFactory{
    static create(): InventoryItemRepository{
        const httpClient = DependencyFactory.getHttpClient();
        const getApiConfig = DependencyFactory.getApiConfig();

        return new InventoryItemFetchRepositoryImpl(httpClient, getApiConfig);
    }
}