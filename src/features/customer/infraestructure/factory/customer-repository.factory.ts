import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { CustomerFetchRepository } from "../repositories/customer-fetch.repository";

export class CustomerRepositoryFactory {
    /**
     * Crea una instancia del repositorio de clientes con todas sus dependencias
     */
    static create(): CustomerRepository {
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();
        
        return new CustomerFetchRepository(httpClient, apiConfig);
    }
}