import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerNotFountException } from "../../domain/exceptions/customer-not-found.exception";

export class FindOneCustomerByEstablishmentUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(customerId: bigint, establishmentId:bigint): Promise<CustomerEntity> {
       const result = await this.customerRepository.findOneByEstablishment(customerId, establishmentId);
       if(!result){
        throw new CustomerNotFountException('El cliente no fue encontrado.');
       }
       return result;
  }
}