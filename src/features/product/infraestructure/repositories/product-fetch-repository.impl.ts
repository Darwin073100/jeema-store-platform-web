import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { ProductEntity } from "../../domain/entities/product.entity";
import { ProductRepository } from "../../domain/repositories/product.repository";
import { RegisterProductDTO } from "../../application/dtos/register-product.dto";
import { RegisterInitialProductDTO } from "../../application/dtos/register-initial-product.dto";
import { ProductMapper } from "../mappers/product.mapper";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { UpdateProductDTO } from "../../application/dtos/update-product.dto";

export class ProductFetchRepositoryImpl implements ProductRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}
    
    async findAll(): Promise<Result<{products: ProductEntity[]}, ErrorEntity>> {
        try {
            const response = await this.httpClient.get<{products: ProductEntity[]}>(
                this.apiConfig.getEndpointUrl('/products')
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'findAll products');
        }
    }

    async save(dto: RegisterProductDTO): Promise<Result<ProductEntity, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<ProductEntity>(
                this.apiConfig.getEndpointUrl('/products'),
                dto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'save product');
        }
    }

    async update(dto: UpdateProductDTO): Promise<Result<ProductEntity, ErrorEntity>> {
        try {
            const httpDto = ProductMapper.toUpdateProductHttpDTO(dto);
            const response = await this.httpClient.patch<ProductEntity>(
                this.apiConfig.getEndpointUrl('/products'),
                httpDto,
            );
            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'update product');
        }
    }
    async delete(productId: bigint): Promise<Result<any, ErrorEntity>|undefined> {
        try {
            const httpId = productId.toString();
            const response = await this.httpClient.delete<any>(
                this.apiConfig.getEndpointUrl(`/products/${httpId}`)
            );
            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Delete product');
        }
    }
    
    async saveProductWithLotAndInventory(dto: RegisterInitialProductDTO): Promise<Result<ProductEntity, ErrorEntity>> {
        try {
            const dtoHttp = ProductMapper.toHttpMany(dto);
            const response = await this.httpClient.post<ProductEntity>(
                this.apiConfig.getEndpointUrl('/products/with-lot-and-inventory-item'),
                dtoHttp
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'save product with lot and inventory');
        }  
    }

    /**
     * Manejo centralizado de errores
     */
    private handleError(error: any, operation: string): Result<any, ErrorEntity> {
        // Si es un error HTTP (del servidor)
        if (error.status && error.data) {
            return Result.failure(error.data as ErrorEntity);
        }

        // Si es un error de red o conexión
        return Result.failure({
            error: error?.message || error,
            message: `No se pudo conectar al servidor durante: ${operation}`,
            statusCode: error?.status || 500,
            path: operation,
            timestamp: new Date().toDateString()
        } satisfies ErrorEntity);
    }
}
