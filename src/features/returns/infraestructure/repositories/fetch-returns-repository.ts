import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ReturnsRepository } from "../../domain/repositories/returns.repository";
import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { ReturnsEntity } from "../../domain/entities/returns.entity";
import { ReturnsProductsDTO } from "../../application/dtos/returns-products.dto";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ReturnsMapper } from "../mappers/returns.mapper";

export class FetchReturnsRepository implements ReturnsRepository{
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ){}

    async saveAll(dto: ReturnsProductsDTO): Promise<Result<ReturnsEntity[], ErrorEntity>> {
        try {
            const httpDTO = ReturnsMapper.toReturnsProductsHttpDTO(dto);
            const result = await this.httpClient.post<ReturnsEntity[]>(
                this.apiConfig.getEndpointUrl('/returns/all'),
                httpDTO
            );
            return Result.success(result.data);
        } catch (error) {
            return handleError(error, 'return.saveAll');
        }
    }

}