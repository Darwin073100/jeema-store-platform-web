import { CustomerRepository } from "../../domain/repositories/customer.repository";

export class FindOneCustomerByEstablishmentUseCase {
    constructor(
        private readonly repository: CustomerRepository
    ){}

    async execute(customerId: bigint, establishmentId: bigint){
        const result = await this.repository.findOneCustomerByEstablishment(customerId, establishmentId);
        return result;
    }
}