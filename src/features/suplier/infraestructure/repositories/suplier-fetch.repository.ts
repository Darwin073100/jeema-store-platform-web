import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { SuplierEntity } from "../../domain/entities/suplier.entity";
import { SuplierRepository } from "../../domain/repositories/suplier.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { RegisterSuplierDto } from "../../application/dtos/register-suplier.dto";
import { SuplierMapper } from "../mappers/suplier.mapper";

export class SuplierFetchRepository implements SuplierRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig,
    ){}
    async findAllByEstablishmentId(establishmentId: bigint, isAddress: boolean): Promise<Result<{supliers: SuplierEntity[]}, ErrorEntity>> {
        try {
            const result = await this.httpClient.post<{supliers: SuplierEntity[]}>(
                this.apiConfig.getEndpointUrl('/supliers/all/establishments'),
                {establishmentId: establishmentId.toString(), isAddress}
            );
            const data = result.data;
            return Result.success(data)
        } catch (error) {
            return handleError(error, 'SuplierFetchRepository.findAllByEstablishmentId');
        }
    }
    async registerSuplier(dto: RegisterSuplierDto): Promise<Result<SuplierEntity, ErrorEntity>> {
        try {
            const httpDTO = SuplierMapper.toRegisterSuplierHttp(dto);
            const result = await this.httpClient.post<SuplierEntity>(
                this.apiConfig.getEndpointUrl('/supliers'),
                httpDTO
            );
            const data = result.data;
            return Result.success(data)
        } catch (error) {
            return handleError(error, 'SuplierFetchRepository.registerSuplier');
        }
    }
}