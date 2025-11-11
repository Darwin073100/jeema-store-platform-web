import { Result } from "@/shared/features/result";
import { SeasonEntity } from "../../domain/entities/season.entity";
import { SeasonRepository } from "../../domain/repositories/season.repository";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterSeasonDTO } from "../../application/dtos/register-season.dto";
import { SeasonMapper } from "../mappers/season.mapper";
import { UpdateSeasonDTO } from "../../application/dtos/update-season.dto";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";

export class SeasonFetchRepositoryImpl implements SeasonRepository{
    
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async save(dto: RegisterSeasonDTO): Promise<Result<SeasonEntity, ErrorEntity>> {
        try {
            const dtoHttp = SeasonMapper.toHttpDto(dto);
            const url = this.apiConfig.getEndpointUrl('/seasons');
            
            const response = await this.httpClient.post<SeasonEntity>(url, dtoHttp);
            
            return Result.success(response.data);
        } catch (error: any) {
            // Si es un HttpError, extraer información del servidor
            if (error.status && error.data) {
                return Result.failure(error.data);
            }
            
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al backend',
                statusCode: 500,
                path: '/seasons',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
    async update(dto: UpdateSeasonDTO): Promise<Result<SeasonEntity, ErrorEntity>> {
        try {
            const dtoHttp = SeasonMapper.toHttpUpdateDto(dto);
            const url = this.apiConfig.getEndpointUrl('/seasons');
            
            const response = await this.httpClient.patch<SeasonEntity>(url, dtoHttp);
            
            return Result.success(response.data);
        } catch (error: any) {
            // Si es un HttpError, extraer información del servidor
            if (error.status && error.data) {
                return Result.failure(error.data);
            }
            
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al servidor.',
                statusCode: 500,
                path: '/seasons',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async delete(seasonId: bigint): Promise<Result<boolean, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl(`/seasons/${seasonId}`);
            
            const response = await this.httpClient.delete<boolean>(url);
            
            return Result.success(true);
        } catch (error: any) {
            // Si es un HttpError, extraer información del servidor
            if (error.status && error.data) {
                return Result.failure(error.data);
            }
            
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al servidor.',
                statusCode: 500,
                path: '/seasons',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async findAll(): Promise<Result<{ seasons: SeasonEntity[]; }, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl('/seasons');
            
            const response = await this.httpClient.get<{ seasons: SeasonEntity[] }>(url);
            
            return Result.success(response.data);
        } catch (error: any) {
            // Si es un HttpError, extraer información del servidor
            if (error.status && error.data) {
                return Result.failure(error.data);
            }
            
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al backend',
                statusCode: 500,
                path: '/seasons',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
    async findAllSeasonsByEstablishment(establishmentId: bigint): Promise<Result<{ seasons: SeasonEntity[]; }, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl(`/seasons/establishments/${establishmentId.toString()}`);
            
            const response = await this.httpClient.get<{ seasons: SeasonEntity[] }>(url);
            
            return Result.success(response.data);
        } catch (error: any) {
            // Si es un HttpError, extraer información del servidor
            if (error.status && error.data) {
                return Result.failure(error.data);
            }
            
            return Result.failure({
                error: error?.message || error,
                message: 'No se pudo conectar al backend',
                statusCode: 500,
                path: '/seasons',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
}