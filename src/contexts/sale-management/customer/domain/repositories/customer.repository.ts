import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { CustomerEntity } from "../entities/customer.entity";

// Define el token de inyección para esta interfaz.
export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');

export interface CustomerRepository extends TemplateRepository<CustomerEntity> {
  findAllByEstablishment(establishmentId: bigint): Promise<CustomerEntity[]>
  findByEmail(email: string):Promise<CustomerEntity| null>;
  findByRfc(rfc: string):Promise<CustomerEntity| null>;
  findOneByEstablishment(customerId: bigint, establishmentId: bigint): Promise<CustomerEntity| null>;
  findSaleDefault(establishmentId: bigint): Promise<CustomerEntity| null>;
  existById(id: bigint): Promise<CustomerEntity | null>;
}
  