import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterCategoryDTO } from "../application/dtos/register-category.dto";
import { UpdateCategoryDTO } from "../application/dtos/update-category.dto";
import { CategoryEntity } from "../domain/entities/category.entity";
import { CategoryRepository } from "../domain/repositories/category.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";

export class CategoryFetchRepositoryImpl implements CategoryRepository{
    
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async save(entity: RegisterCategoryDTO): Promise<Result<CategoryEntity, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl('/categories');
            
            const response = await this.httpClient.post<CategoryEntity>(url, entity);
            
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
                path: '/categories',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async update(entity: UpdateCategoryDTO): Promise<Result<CategoryEntity, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl('/categories');
            
            const response = await this.httpClient.patch<CategoryEntity>(url, entity);
            
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
                path: '/categories',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async delete(categoryId: string): Promise<Result<boolean, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl(`/categories/${categoryId}`);
            
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
                path: '/categories',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }

    async findAll(): Promise<Result<{ categories: CategoryEntity[]; }, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl('/categories');
            
            const response = await this.httpClient.get<{ categories: CategoryEntity[] }>(url);
            
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
                path: '/categories',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
    async findAllCategoriesByEstablishment(establishmentId: bigint): Promise<Result<{ categories: CategoryEntity[]; }, ErrorEntity>> {
        try {
            const url = this.apiConfig.getEndpointUrl(`/categories/establishments/${establishmentId.toString()}`);
            
            const response = await this.httpClient.get<{ categories: CategoryEntity[] }>(url);
            
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
                path: '/categories',
                timestamp: new Date().toDateString(),
            } satisfies ErrorEntity);
        }
    }
}