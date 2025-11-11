import { Result } from "@/shared/features/result";
import { BrandEntity } from "../domain/entities/brand.entity";
import { BrandRepository } from "../domain/repositories/brand.repository";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterBrandDTO } from "../application/dtos/register-brand.dto";
import { UpdateBrandDTO } from "../application/dtos/update-brand.dto";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";

export class BrandFetchRepositoryImpl implements BrandRepository {
    
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async save(dto: RegisterBrandDTO): Promise<Result<BrandEntity, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl('/brands');
            
            const response = await this.httpClient.post<BrandEntity>(url, {
                name: dto.name,
                establishmentId: dto.establishmentId,
            });
            
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
                path: '/brands',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async update(dto: UpdateBrandDTO): Promise<Result<BrandEntity, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl('/brands');
            
            const response = await this.httpClient.patch<BrandEntity>(url, dto);
            
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
                path: '/brands',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async delete(brandId: string): Promise<Result<boolean, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl(`/brands/${brandId}`);
            
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
                path: '/brands',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async findAll(): Promise<Result<{ brands: BrandEntity[]; }, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl('/brands');
            
            const response = await this.httpClient.get<{ brands: BrandEntity[] }>(url);
            
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
                path: '/brands',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
    async findAllByEstablishment(establishmentId: bigint): Promise<Result<{ brands: BrandEntity[]; }, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl(`/brands/establishments/${establishmentId.toString()}`);
            
            const response = await this.httpClient.get<{ brands: BrandEntity[] }>(url);
            
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
                path: '/brands',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
}