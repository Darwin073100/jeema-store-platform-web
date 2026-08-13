import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { FetchHttpClient } from "@/shared/infrastructure/http/fetch-http-client.impl";
import { ApiConfig } from "@/shared/domain/repositories/api-config";
import { ApiCloudTransferConfigImpl } from "../config/api-cloud-transfer.config";
import { ImageStoragePort } from "@/shared/domain/ports/image-storage.port";
import { LocalFilesystemImageStorageAdapter } from "@/shared/infrastructure/storage/local-filesystem-image-storage.adapter";
import { CloudImageStorageAdapter } from "@/shared/infrastructure/storage/cloud-image-storage.adapter";
import { ImageOwnerType } from "@/contexts/image-management/image/domain/enums/image-owner-type.enum";
import { ImageOwnerGatewayPort } from "@/contexts/image-management/image/domain/ports/out/image-owner-gateway.port";
import { ProductImageOwnerGatewayAdapter } from "@/contexts/image-management/image/infraestructura/adapters/product-image-owner-gateway.adapter";
import { EmployeeImageOwnerGatewayAdapter } from "@/contexts/image-management/image/infraestructura/adapters/employee-image-owner-gateway.adapter";
import { EstablishmentImageOwnerGatewayAdapter } from "@/contexts/image-management/image/infraestructura/adapters/establishment-image-owner-gateway.adapter";
import { TypeOrmProductRepository } from "@/contexts/product-management/product/infraestructure/persistence/typeorm/repositories/typeorm-product.repository";
import { TypeOrmEmployeeRepository } from "@/contexts/employee-management/employee/infraestruture/persistence/typeorm/repositories/typeorm-employee.repository";
import { TypeOrmEstablishmentRepository } from "@/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/repositories/typeorm-establishment.repository";

/**
 * Factory para crear instancias de dependencias
 * Este es un patrón simple de DI sin framework externo
 */
export class DependencyFactory {
    private static httpClientInstance: HttpClient | null = null;
    private static apiConfigInstance: ApiConfig | null = null;
    private static imageStorageInstance: ImageStoragePort | null = null;

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
     * Singleton para ImageStoragePort.
     * Decide el adaptador local/cloud en runtime:
     * - Si IMAGE_STORAGE_MODE está definida ('local' | 'cloud'), se respeta.
     * - Si no, se autodetecta: existe process.env.VERCEL -> cloud, si no -> local.
     * Misma filosofía que ApiCloudTransferConfigImpl ("env var con fallback razonable").
     */
    static getImageStorage(): ImageStoragePort {
        if (!this.imageStorageInstance) {
            const mode = process.env.IMAGE_STORAGE_MODE;
            const useCloud = mode ? mode === 'cloud' : !!process.env.VERCEL;
            this.imageStorageInstance = useCloud
                ? new CloudImageStorageAdapter()
                : new LocalFilesystemImageStorageAdapter();
        }
        return this.imageStorageInstance;
    }

    /**
     * Resuelve el adaptador de `ImageOwnerGatewayPort` correcto según el tipo
     * de dueño. Los use-cases de `image-management` nunca hacen este switch
     * ellos mismos; lo reciben ya resuelto.
     *
     * Es async (a diferencia de `getImageStorage()`) porque los repositorios
     * de cada contexto se construyen con su factory `static async create()`,
     * que a su vez espera a `getDataSource()`.
     */
    static async getImageOwnerGateway(ownerType: ImageOwnerType): Promise<ImageOwnerGatewayPort> {
        switch (ownerType) {
            case ImageOwnerType.PRODUCT: {
                const repository = await TypeOrmProductRepository.create();
                return new ProductImageOwnerGatewayAdapter(repository);
            }
            case ImageOwnerType.EMPLOYEE: {
                const repository = await TypeOrmEmployeeRepository.create();
                return new EmployeeImageOwnerGatewayAdapter(repository);
            }
            case ImageOwnerType.ESTABLISHMENT: {
                const repository = await TypeOrmEstablishmentRepository.create();
                return new EstablishmentImageOwnerGatewayAdapter(repository);
            }
            default: {
                const exhaustiveCheck: never = ownerType;
                throw new Error(`ImageOwnerType no soportado: ${String(exhaustiveCheck)}`);
            }
        }
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
     * Para testing - permite inyectar un storage mock
     */
    static setImageStorage(imageStorage: ImageStoragePort): void {
        this.imageStorageInstance = imageStorage;
    }

    /**
     * Resetear las instancias (útil para testing)
     */
    static reset(): void {
        this.httpClientInstance = null;
        this.apiConfigInstance = null;
        this.imageStorageInstance = null;
    }
}
