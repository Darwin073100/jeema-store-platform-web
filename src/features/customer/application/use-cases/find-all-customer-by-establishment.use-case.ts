import { CustomerRepository } from "../../domain/repositories/customer.repository";

export class FindAllCustomerByEstablishmentUseCase {
    constructor(
        private readonly repository: CustomerRepository
    ){}

    async execute(establishmentId: bigint){
        const result = await this.repository.findAllCustomerByEstablishment(establishmentId);
        return result;
    }
}