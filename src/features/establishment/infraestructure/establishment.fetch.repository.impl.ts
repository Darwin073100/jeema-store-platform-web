import { EstablishmentEntity } from "@/features/establishment/domain/entities/establishment.entity";
import { EstablishmentRepository } from "@/features/establishment/domain/repositories/establishment.repository";
import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { CreateEstablishmentDTO } from "../application/dtos/create-establishment.dto";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";

export class EstablishmentFetchRepositoryImpl implements EstablishmentRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ){}
    async save(data:CreateEstablishmentDTO):Promise<Result<EstablishmentEntity,ErrorEntity>>{
        try {
            const response = await this.httpClient.post<EstablishmentEntity>(
                this.apiConfig.getEndpointUrl('/establishments'),
                data
            );
            return Result.success(response.data);
        } catch (error:any) {
            return handleError(error, 'EstablishmentFetchRepositoryImpl.save');
        }
    }
    async findById(establishmentId: bigint):Promise<Result<EstablishmentEntity,ErrorEntity>>{
        try {
            const response = await this.httpClient.get<EstablishmentEntity>(
                this.apiConfig.getEndpointUrl(`/establishments/${establishmentId.toString()}`),
            );
            return Result.success(response.data);
        } catch (error:any) {
            return handleError(error, 'EstablishmentFetchRepositoryImpl.findById');
        }
    }
}