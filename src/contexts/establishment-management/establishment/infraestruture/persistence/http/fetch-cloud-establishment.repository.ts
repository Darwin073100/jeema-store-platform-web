import { ApiConfig } from "@/shared/domain/repositories/api-config";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { CloudEstablishmentRepository } from "../../../domain/repositories/cloud-establishment.repository";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { Result } from "@/shared/lib/utils/result";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { FetchHttpClient } from "@/shared/infrastructure/http/fetch-http-client.impl";
import { ApiCloudTransferConfigImpl } from "@/shared/infrastructure/config/api-cloud-transfer.config";

export class FetchCloudEstablishmentRepository implements CloudEstablishmentRepository {
    private constructor(
        private readonly apiConfig: ApiConfig,
        private readonly httpClient: HttpClient
    ) { }

    // Metodo factory para crear la instancia de esta clase. 
    public static create(){
        const http = new FetchHttpClient()
        const transfer = new ApiCloudTransferConfigImpl();
        return new FetchCloudEstablishmentRepository(transfer, http);
    }

    async generateEnrollmentKey(): Promise<Result<{ enrollmentKey: string; }, ErrorEntity>> {
        try {
            const response = await this.httpClient.get<{ enrollmentKey: string; }>(
                `${this.apiConfig.baseUrl}/cloud-establishments/enrollment-keys`
            );

            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'generateEnrollmentKey');
        }
    }
    async deletePhisical(entityId: bigint): Promise<Result<void, ErrorEntity>> {
        try {
            const response = await this.httpClient.delete<void>(
                `${this.apiConfig.baseUrl}/cloud-establishments/${entityId}`
            );

            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'deletePhisical');
        }
    }
}