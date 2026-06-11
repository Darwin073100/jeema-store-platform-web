import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { FetchHttpClient } from "@/shared/infrastructure/http/fetch-http-client.impl";
import { ApiConfig } from "@/shared/domain/repositories/api-config";
import { ApiCloudTransferConfigImpl } from "../config/api-cloud-transfer.config";

/**
 * Factory para crear instancias de dependencias
 * Este es un patrón simple de DI sin framework externo
 */
export class DependencyFactory {
    private static httpClientInstance: HttpClient | null = null;
    private static apiConfigInstance: ApiConfig | null = null;

    /**
     * Singleton para HttpClient
     */
    static getHttpClient(): HttpClient {
        if (!this.httpClientInstance) {
            // ✅ No pasamos baseURL porque ya está incluido en getEndpointUrl()
            this.httpClientInstance = new FetchHttpClient();
        }
        return this.httpClientInstance;
    }

    /**
     * Singleton para ApiConfig
     */
    static getApiConfig(): ApiConfig {
        if (!this.apiConfigInstance) {
            this.apiConfigInstance = new ApiCloudTransferConfigImpl();
        }
        return this.apiConfigInstance;
    }

    /**
     * Para testing - permite inyectar mocks
     */
    static setHttpClient(httpClient: HttpClient): void {
        this.httpClientInstance = httpClient;
    }

    /**
     * Para testing - permite inyectar configuración mock
     */
    static setApiConfig(apiConfig: ApiConfig): void {
        this.apiConfigInstance = apiConfig;
    }

    /**
     * Resetear las instancias (útil para testing)
     */
    static reset(): void {
        this.httpClientInstance = null;
        this.apiConfigInstance = null;
    }
}
