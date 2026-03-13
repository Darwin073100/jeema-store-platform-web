import { CustomerRepository } from "../../domain/repositories/customer.repository";
import { RegisterCustomerDto } from "../dtos/register-customer.dto";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerFirstNameVO } from "../../domain/value-objects/customer-first-name.vo";
import { CustomerPhoneNumberVO } from "../../domain/value-objects/customer-phone-number.vo";
import { CustomerRFCVO } from "../../domain/value-objects/customer-rfc.vo";
import { CustomerEmailVO } from "../../domain/value-objects/customer-email.vo";
import { CustomerTypeVO } from "../../domain/value-objects/customer-customer-type.vo";
import { CustomerAlreadyExistsException } from "../../domain/exceptions/customer-already-exists.exception";
import { CustomerLastNameVO } from "../../domain/value-objects/customer-last-name.vo";
import { CustomerCompanyNameVO } from "../../domain/value-objects/customer-company-name.vo";
import { AddressEntity } from "@/contexts/establishment-management/address/domain/entities/address.entity";

export class RegisterCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(request: RegisterCustomerDto): Promise<CustomerEntity> {
    const establishmentId = request.establishmentId;
    const firstName = CustomerFirstNameVO.create(request.firstName);
    const lastName = request.lastName ? CustomerLastNameVO.create(request.lastName) : undefined;
    const companyName = request.companyName ? CustomerCompanyNameVO.create(request.companyName) : undefined;
    const phoneNumberVo = CustomerPhoneNumberVO.create(request.phoneNumber);const rfcVo = request.rfc? CustomerRFCVO.create(request.rfc): undefined;
    const emailVo = request.email? CustomerEmailVO.create(request.email): undefined;
    const customerType = request.customerType? CustomerTypeVO.create(request.customerType): undefined;
    const address = request.address? AddressEntity.create(
      request.address.country,
      request.address.state,
      request.address.postalCode,
      request.address.municipality,
      request.address.city,
      request.address.neighborhood,
      request.address.street ?? null,
      request.address.externalNumber ?? null,
      request.address.internalNumber ?? null,
      request.address.reference ?? null
    ): null;

    const customerId = BigInt(0);

    if(request.saleDefault){
      const customerDefault = await this.customerRepository.findSaleDefault(establishmentId ?? BigInt(0));
      if(!!customerDefault){
        throw new CustomerAlreadyExistsException('Ya hay un cliente por defecto para ventas.');
      }
    }

    const suplier = CustomerEntity.create(
      customerId,
      firstName,
      request.saleDefault,
      null,
      establishmentId,
      lastName,
      companyName,
      phoneNumberVo,
      address,
      rfcVo,
      emailVo,
      customerType
    );

    if(!!suplier.email?.value){
      const emailExist = await this.customerRepository.findByEmail(suplier.email?.value);
      if(emailExist){
        throw new CustomerAlreadyExistsException('Ya hay un cliente con el mismo correo electrónico.');
      }
    }

    if(!!suplier.rfc?.value){
      const rfcExist = await this.customerRepository.findByRfc(suplier.rfc?.value);
      if(rfcExist){
        throw new CustomerAlreadyExistsException('Ya hay un cliente con el mismo RFC.');
      }
    }

    const resp = await this.customerRepository.save(suplier);

    const domainEvents = suplier.getAndClearEvents();

    return resp;
  }
}