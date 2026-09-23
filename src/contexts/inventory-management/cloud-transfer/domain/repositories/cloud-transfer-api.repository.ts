import { Result } from "@/shared/lib/utils/result";
import { ErrorEntity } from "@/shared/lib/utils/error.entity";
import { CreateCloudTransferHttpDto } from "../../application/dtos/create-cloud-transfer-http.dto";
import { ICloudTransferApiResponse } from "../../application/dtos/cloud-transfer-api-response.dto";

/**
 * Puerto HTTP hacia los 8 endpoints de EDYOF (`cloud-transfers`). Retorna `Promise<Result<T, ErrorEntity>>`
 * — nunca lanza — siguiendo `CloudBranchOfficeRepository`.
 */
export interface CloudTransferApiRepository {
    create(dto: CreateCloudTransferHttpDto): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
    findPendingByToCloudBranchId(toCloudBranchId: bigint): Promise<Result<ICloudTransferApiResponse[], ErrorEntity>>;
    findById(remoteCloudTransferId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
    startProcessing(remoteCloudTransferId: bigint, actingBranchId: bigint): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
    receive(remoteCloudTransferId: bigint, actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
    approve(remoteCloudTransferId: bigint, actingBranchId: bigint, notes?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
    reportError(remoteCloudTransferId: bigint, actingBranchId: bigint, errorMessage: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
    cancel(remoteCloudTransferId: bigint, actingBranchId: bigint, reason?: string): Promise<Result<ICloudTransferApiResponse, ErrorEntity>>;
}
