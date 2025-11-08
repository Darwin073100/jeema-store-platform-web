import { Result } from "@/shared/features/result";
import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { RegisterCustomerDTO } from "../dtos/register-customer.dto";
import { ErrorEntity } from "@/shared/features/error.entity";

export class RegisterCustomerUseCase {
    constructor(
        private readonly repository: CustomerRepository
    ){}

    async execute(dto: RegisterCustomerDTO){
        if(!dto.establishmentId || dto.establishmentId <= BigInt(0)){
            return Result.failure<ErrorEntity>({
                message: 'Ha ocurrido un error inseperado al registrar el cliente.',
                error: 'INVALID_ESTABLISHMENT_ID',
                statusCode: 400,
                path: 'RegisterCustomerUseCase.execute',
                timestamp: new Date().toJSON(),
            });
        }
        const result = await this.repository.registerCustomer(dto);
        return result;
    }
}