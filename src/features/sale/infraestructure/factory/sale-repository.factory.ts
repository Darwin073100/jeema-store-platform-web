import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { SaleFetchRepository } from "../repositories/sale-fetch.repository";
import { SaleRepository } from "../../domain/repositories/sale.repository";

export class SaleRepositoryFactory {
    /**
     * Crea una instancia del repositorio de productos con todas sus dependencias
     */
    static create(): SaleRepository {
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
        
        return new SaleFetchRepository(httpClient, apiConfig);
    }
}