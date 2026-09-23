import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/domain/repositories/api-config";
import { DependencyFactory } from "@/shared/infrastructure/di/dependency-factory";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { CloudTransferApiRepository } from "../../../domain/repositories/cloud-transfer-api.repository";
import { CreateCloudTransferHttpDto } from "../../../application/dtos/create-cloud-transfer-http.dto";
import { ICloudTransferApiResponse } from "../../../application/dtos/cloud-transfer-api-response.dto";

/**
 * Implementa `CloudTransferApiRepository` (8 métodos), hacia EDYOF. A diferencia de
 * `FetchCloudBranchOffice.create()` (que instancia `new FetchHttpClient()` + `new ApiCloudTransferConfigImpl()`
 * directamente), aquí se usa `DependencyFactory.getHttpClient()`/`getApiConfig()` — mejora deliberada para
 * código nuevo, ver spect/08_cloud_transfer_spect.md sección 8.2. No se toca `FetchCloudBranchOffice`.
 */
export class FetchCloudTransferRepository implements CloudTransferApiRepository {
    private constructor(
        private readonly apiConfig: ApiConfig,
        private readonly httpClient: HttpClient,
    ) { }

    public static create(): FetchCloudTransferRepository {
        return new FetchCloudTransferRepository(
            DependencyFactory.getApiConfig(),
            DependencyFactory.getHttpClient(),
        );
    }

    async create(dto: CreateCloudTransferHttpDto): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<ICloudTransferApiResponse>(
                `${this.apiConfig.baseUrl}/cloud-transfers`,
                dto,
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.create');
        }
    }

    async findPendingByToCloudBranchId(toCloudBranchId: bigint): Promise<Result<ICloudTransferApiResponse[], ErrorEntity>> {
        try {
            const response = await this.httpClient.get<ICloudTransferApiResponse[]>(
                `${this.apiConfig.baseUrl}/cloud-transfers/pending/${toCloudBranchId.toString()}`,
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.findPendingByToCloudBranchId');
        }
    }

    async findById(remoteCloudTransferId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        try {
            const response = await this.httpClient.get<ICloudTransferApiResponse>(
                `${this.apiConfig.baseUrl}/cloud-transfers/${remoteCloudTransferId.toString()}`,
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.findById');
        }
    }

    async startProcessing(remoteCloudTransferId: bigint, actingBranchId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<ICloudTransferApiResponse>(
                `${this.apiConfig.baseUrl}/cloud-transfers/${remoteCloudTransferId.toString()}/start-processing`,
                { actingBranchId: actingBranchId.toString() },
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.startProcessing');
        }
    }

    async receive(remoteCloudTransferId: bigint, actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<ICloudTransferApiResponse>(
                `${this.apiConfig.baseUrl}/cloud-transfers/${remoteCloudTransferId.toString()}/receive`,
                { actingBranchId: actingBranchId.toString(), notes },
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.receive');
        }
    }

    async approve(remoteCloudTransferId: bigint, actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<ICloudTransferApiResponse>(
                `${this.apiConfig.baseUrl}/cloud-transfers/${remoteCloudTransferId.toString()}/approve`,
                { actingBranchId: actingBranchId.toString(), notes },
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.approve');
        }
    }

    async reportError(remoteCloudTransferId: bigint, actingBranchId: bigint, errorMessage: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<ICloudTransferApiResponse>(
                `${this.apiConfig.baseUrl}/cloud-transfers/${remoteCloudTransferId.toString()}/error`,
                { actingBranchId: actingBranchId.toString(), errorMessage },
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.reportError');
        }
    }

    async cancel(remoteCloudTransferId: bigint, actingBranchId: bigint, reason?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<ICloudTransferApiResponse>(
                `${this.apiConfig.baseUrl}/cloud-transfers/${remoteCloudTransferId.toString()}/cancel`,
                { actingBranchId: actingBranchId.toString(), reason },
            );
            return Result.success(response.data);
        } catch (error) {
            return handleError(error, 'FetchCloudTransferRepository.cancel');
        }
    }
}
