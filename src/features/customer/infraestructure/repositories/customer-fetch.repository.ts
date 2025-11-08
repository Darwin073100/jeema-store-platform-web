import { ApiConfig } from "@/shared/infrastructure/config/api-config";
import { HttpClient } from "@/shared/infrastructure/http/http-client.interface";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { ErrorEntity } from "@/shared/features/error.entity";
import { Result } from "@/shared/features/result";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { RegisterCustomerDTO } from "../../application/dtos/register-customer.dto";
import { CustomerMapper } from "../mappers/customer.mapper";

export class CustomerFetchRepository implements CustomerRepository{
    constructor(
        private readonly httpClient: HttpClient,
        private readonly apiConfig: ApiConfig
    ) {}

    async findAllCustomerByEstablishment(establishmentId: bigint): Promise<Result<{ customers: CustomerEntity[]; }, ErrorEntity>> {
        try {  
            const response = await this.httpClient.get<{customers: CustomerEntity[]}>(
                this.apiConfig.getEndpointUrl(`/customers/all/establishments/${establishmentId.toString()}`),
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Find All Customer by Establishment');
        }
    }
    async findOneCustomerByEstablishment(customerId: bigint, establishmentId: bigint): Promise<Result<CustomerEntity, ErrorEntity>> {
        try {  
            const response = await this.httpClient.get<CustomerEntity>(
                this.apiConfig.getEndpointUrl(`/customers/${customerId.toString()}/establishments/${establishmentId.toString()}`),
            );

            return Result.success(response.data);

        } catch (error: any) {
            return this.handleError(error, 'Find One Customer by Establishment');
        }
    }

    async registerCustomer(dto: RegisterCustomerDTO): Promise<Result<CustomerEntity, ErrorEntity>>{
        try{
            const httpDTO = CustomerMapper.toRegisterCustomerHttpDTO(dto);
            const response = await this.httpClient.post<CustomerEntity>(
                this.apiConfig.getEndpointUrl('/customers'),
                httpDTO
            );
            return Result.success(response.data);
        } catch(error){
            return this.handleError(error, 'CustomerFetchRepository.registerCustomer');
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