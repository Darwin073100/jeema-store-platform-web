import { Result } from "@/shared/features/result";
import { CustomerEntity } from "../entities/customer.entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterCustomerDTO } from "../../application/dtos/register-customer.dto";

export interface CustomerRepository {
    findAllCustomerByEstablishment(establishmentId: bigint):Promise<Result<{customers: CustomerEntity[]}, ErrorEntity>>;
    findOneCustomerByEstablishment(customerId: bigint, establishmentId: bigint): Promise<Result<CustomerEntity, ErrorEntity>>;
    registerCustomer(dto: RegisterCustomerDTO): Promise<Result<CustomerEntity, ErrorEntity>>;
}