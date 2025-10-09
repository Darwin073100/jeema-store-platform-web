import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { SaleEntity } from "../../domain/entities/sale-entity";
import { SaleRepository } from "../../domain/repositories/sale.repository";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { SaleMapper } from "../mappers/sale.mapper";
import { AddDetailToSaleDto } from "../../application/dtos/add-detail-to-sale.dto";
import { SaleDetailEntity } from "../../domain/entities/sale-detail-entity";
import { FinishSaleDto } from "../../application/dtos/finish-sale.dto";
import { RegisterSalePaymentDto } from "../../application/dtos/register-sale-payment.dto";
import { SalePaymentEntity } from "../../domain/entities/sale-payment-entity";
import { FinalizeSaleDto } from "../../application/dtos/finalize-sale.dto";

export class SaleFetchRepository implements SaleRepository {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}
    
    async save(dto: RegisterSaleDto): Promise<Result<SaleEntity, ErrorEntity>> {
        try {
            const httpDto = SaleMapper.toHttpRegisterSaleDTO(dto);

            const response = await this.httpClient.post<SaleEntity>(
                this.apiConfig.getEndpointUrl('/sales'),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Register Sale');
        }    
    }

    async addDetailToSale(saleId: bigint, dto: AddDetailToSaleDto): Promise<Result<SaleDetailEntity, ErrorEntity>> {
        try {
            let httpDto = SaleMapper.toHttpAddDetailToSaleDTO(dto);    
            const response = await this.httpClient.patch<SaleDetailEntity>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/details`),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Add detail to sale');
        }    
    }

    async findSaleWithDetails(saleId: bigint): Promise<Result<SaleEntity, ErrorEntity>> {
        try {

            const response = await this.httpClient.get<SaleEntity>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/details`)
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Find sale with details');
        }    
    }

    async findSaleInfoById(saleId: bigint): Promise<Result<SaleEntity, ErrorEntity>> {
        try {

            const response = await this.httpClient.get<SaleEntity>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/info`)
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Find sale information with details');
        }    
    }
    async findAllByBranchOffice(branchOfficeId: bigint): Promise<Result<{sales:SaleEntity[]}, ErrorEntity>> {
        try {

            const response = await this.httpClient.get<{sales:SaleEntity[]}>(
                this.apiConfig.getEndpointUrl(`/sales/all/branchOffices/${branchOfficeId.toString()}`)
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Find sale with details');
        }    
    }

    async finishSale(saleId: bigint, dto: FinishSaleDto): Promise<Result<SaleEntity, ErrorEntity>> {
        try {
            let httpDto = SaleMapper.toHttpFinishSale(dto);    
            const response = await this.httpClient.patch<SaleEntity>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/finish`),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Finish sale');
        }
    }
    async finalizeSale(saleId: bigint, dto: FinalizeSaleDto): Promise<Result<SaleEntity, ErrorEntity>> {
        try {
            let httpDto = SaleMapper.toHttpFinalizeSale(dto);    
            const response = await this.httpClient.patch<SaleEntity>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/finalize`),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Finalize sale');
        }
    }

    async paidSale(saleId: bigint, dto: RegisterSalePaymentDto): Promise<Result<{ payments: SalePaymentEntity[]; }, ErrorEntity>> {
        try {
            let httpDto = SaleMapper.toHttpRegisterSalePaymentDTO(dto);    
            const response = await this.httpClient.patch<{payments: SalePaymentEntity[]}>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/paid`),
                httpDto
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Paid sale');
        }
    }
    async physicalDeleteSaleDetail(saleId: bigint, detailId: bigint): Promise<Result<any, ErrorEntity>> {
        try {  
            const response = await this.httpClient.delete<any>(
                this.apiConfig.getEndpointUrl(`/sales/${saleId.toString()}/details/${detailId.toString()}`)
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Delete detail to Sale');
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