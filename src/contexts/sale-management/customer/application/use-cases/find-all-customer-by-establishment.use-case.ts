import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { CustomerEntity } from "../../domain/entities/customer.entity";

export class FindAllCustomerByEstablishmentUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(establishmentId:bigint): Promise<CustomerEntity[]> {
       const result = await this.customerRepository.findAllByEstablishment(establishmentId);
       return result;
  }
}