import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerAlreadyExistsException } from "../../domain/exceptions/customer-already-exists.exception";
import { UpdateCustomerDto } from "../dtos/update-customer.dto";
import { CustomerNotFountException } from "../../domain/exceptions/customer-not-found.exception";

export class UpdateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customerExist = await this.customerRepository.existById(dto.customerId);
    if(!customerExist){
      throw new CustomerNotFountException('Cliente no encontrado.')
    }
    
    // Verificamso que no haya otro cliente con el mismo correo.
    if(!!dto.email){
      const emailExist = await this.customerRepository.findByEmail(dto.email);
      if(emailExist){
        if(emailExist.customerId !== dto.customerId){
          throw new CustomerAlreadyExistsException('Ya hay un cliente con el mismo correo electrónico.');
        }
      }
    }
    // Verificamso que no haya otro cliente con el mismo rfc.
    if(!!dto.rfc){
      const rfcExist = await this.customerRepository.findByRfc(dto.rfc);
      if(rfcExist){
        if(rfcExist.customerId !== dto.customerId){
          throw new CustomerAlreadyExistsException('Ya hay un cliente con el mismo RFC.');
        }
      }
    }

    if(dto.firstName){
      customerExist.updateFirstName(dto.firstName);
    }
    if(dto.lastName){
      customerExist.updateLastName(dto.lastName);
    }
    if(dto.email !== undefined){
      customerExist.updateEmail(dto.email);
    }
    if(dto.rfc !== undefined){
      customerExist.updateRFC(dto.rfc);
    }
    if(dto.saleDefault !== undefined){
      customerExist.updateSaleDefault(dto.saleDefault);
    }
    if(dto.customerType !== undefined){
      customerExist.updateCustomerType(dto.customerType);
    }
    if(dto.companyName !== undefined){
      customerExist.updateCompanyName(dto.companyName);
    }
    if(dto.phoneNumber !== undefined){
      customerExist.updatePhoneNumber(dto.phoneNumber);
    }

    const resp = await this.customerRepository.save(customerExist);

    return resp;
  }
}