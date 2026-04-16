import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { AddressRepository } from "../../domain/repository/address.repository";
import { RegisterAddressMany } from "../dtos/register-address-many.dto";
import { AddressEntity } from "../../domain/entities/address.entity";
import { EmployeeRepository } from "@/contexts/employee-management/employee/domain/repositories/employee.repository";
import { CustomerRepository } from "@/contexts/sale-management/customer/domain/repositories/customer.repository";
import { SuplierRepository } from "@/contexts/purchase-management/suplier/domain/repositories/suplier.repository";
import { BranchOfficeRepository } from "@/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";

export class RegisterAddressUseCase {
    constructor(
        private readonly addressRepository: AddressRepository,
        private readonly employeeRepository: EmployeeRepository,
        private readonly customerRepository: CustomerRepository,
        private readonly suplierRepository: SuplierRepository,
        private readonly branchOfficeRepository: BranchOfficeRepository,
        private readonly transactionDB: TransactionDBRepository
    ) { }

    async execute(dto: RegisterAddressMany) {
        try {
            const address = AddressEntity.create(
                dto.country,
                dto.state,
                dto.postalCode,
                dto.municipality,
                dto.city,
                dto.street,
                dto.externalNumber,
                dto.internalNumber,
                dto.neighborhood,
                dto.reference
            );

            await this.transactionDB.beginTransaction();
            const addressResult = await this.addressRepository.save(address);

            if (dto.employeeId) {
                const employeeExist = await this.employeeRepository.existById(dto.employeeId);
                if (!employeeExist) {
                    throw new Error('Empleado no encontrado.')
                }
                employeeExist.updateAddressId(addressResult.addressId);
                await this.employeeRepository.update(employeeExist);
                await this.transactionDB.commit();
                return addressResult;
            } else if (dto.customerId) {
                const customerExist = await this.customerRepository.existById(dto.customerId);
                if (!customerExist) {
                    throw new Error('Cliente no encontrado.')
                }
                customerExist.updateAddressId(addressResult.addressId);
                await this.customerRepository.save(customerExist);
                await this.transactionDB.commit();
                return addressResult;
            }else if (dto.suplierId) {
                const suplierExist = await this.suplierRepository.existById(dto.suplierId);
                if (!suplierExist) {
                    throw new Error('Proveedor no encontrado.')
                }
                suplierExist.updateAddressId(addressResult.addressId);
                await this.suplierRepository.save(suplierExist);
                await this.transactionDB.commit();
                return addressResult;
            } else if (dto.branchOfficeId) {
                const branchOfficeExist = await this.branchOfficeRepository.existById(dto.branchOfficeId);
                if (!branchOfficeExist) {
                    throw new Error('Sucursal no encontrado.')
                }
                branchOfficeExist.updateAddressId(addressResult.addressId);
                await this.branchOfficeRepository.save(branchOfficeExist);
                await this.transactionDB.commit();
                return addressResult;
            } else {
                throw new Error();
            }
        } catch (error) {
            await this.transactionDB.rollback();
            throw error;
        }
    }
}