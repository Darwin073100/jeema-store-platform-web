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
import { RegisterCompleteProductDTO } from "../../application/dtos/register-complete-product.dto";
import { handleError } from "@/shared/infrastructure/http/handlers/handleError";
import { ProductsTopByBranchOfficeResponseDto } from "../../application/dtos/products-top-by-branch-office-response.dto";
import { FilterTopRequestDTO } from "../../application/dtos/filter-top.dto";

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
            return handleError(error, 'findAll products');
        }
    }
    async findAllByEstablishment(establishmentId: bigint): Promise<Result<{products: ProductEntity[]}, ErrorEntity>> {
        try {
            const response = await this.httpClient.get<{products: ProductEntity[]}>(
                this.apiConfig.getEndpointUrl(`/products/all/establishments/${establishmentId.toString()}`)
            );

            return Result.success(response.data);

        } catch (error: any) {
            return handleError(error, 'findAllByEstablishment');
        }
    }
    async findTopProductsByBranchOffice(branchOfficeId: bigint, filter: FilterTopRequestDTO): Promise<Result<{products: ProductsTopByBranchOfficeResponseDto[]}, ErrorEntity>> {
        try {
            const response = await this.httpClient.post<{products: ProductsTopByBranchOfficeResponseDto[]}>(
                this.apiConfig.getEndpointUrl(`/products/all/top-branch/${branchOfficeId.toString()}`),
                filter
            );
            return Result.success(response.data );
        } catch (error: any) {
            return handleError(error, 'findTopProductsByBranchOffice');
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
            return handleError(error, 'save product');
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
            return handleError(error, 'update product');
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
            return handleError(error, 'Delete product');
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
            return handleError(error, 'save product with lot and inventory');
        }  
    }
    async registerCompleteProduct(dto: RegisterCompleteProductDTO): Promise<Result<ProductEntity, ErrorEntity>> {
        try {
            const dtoHttp = ProductMapper.toHttpRegisterCompleteProduct(dto);
            const response = await this.httpClient.post<ProductEntity>(
                this.apiConfig.getEndpointUrl('/products/complete'),
                dtoHttp
            );

            return Result.success(response.data);

        } catch (error: any) {
            return handleError(error, 'save product with lot and inventory');
        }  
    }
}
