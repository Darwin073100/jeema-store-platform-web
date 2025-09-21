import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { PaymentMethodFetchRepository } from "../repositories/sale-payment-fetch.repository";

export class PaymentMethodRepositoryFactory {
    static create(){
        const httpClient = DependencyFactory.getHttpClient();
        const apiConfig = DependencyFactory.getApiConfig();

        return new PaymentMethodFetchRepository(httpClient, apiConfig);
    }
}