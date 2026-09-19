import { RegisterEstablishmentDto } from '../dtos/register-establishment.dto';
import { EstablishmentRepository } from '../../domain/repositories/establishment.repository';
import { EstablishmentEntity } from '../../domain/entities/establishment.entity';
import { CustomerRepository } from '@/contexts/sale-management/customer/domain/repositories/customer.repository';
import { CustomerEntity } from '@/contexts/sale-management/customer/domain/entities/customer.entity';
import { CustomerFirstNameVO } from '@/contexts/sale-management/customer/domain/value-objects/customer-first-name.vo';
import { CustomerLastNameVO } from '@/contexts/sale-management/customer/domain/value-objects/customer-last-name.vo';
import { TransactionDBRepository } from '@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository';

export class RegisterEstablishmentUseCase {
  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly transactionDB: TransactionDBRepository,
  ) {}

  public async execute(command: RegisterEstablishmentDto): Promise<EstablishmentEntity> {
    return this.transactionDB.runInTransaction(async () => {
      const newEstablishment = EstablishmentEntity.create(command.name);
      const savedEstablishment = await this.establishmentRepository.save(newEstablishment);

      const defaultCustomer = CustomerEntity.create(
        BigInt(0),
        CustomerFirstNameVO.create('PUBLICO'),
        true,
        null,
        savedEstablishment.establishmentId,
        CustomerLastNameVO.create('EN GENERAL'),
      );
      await this.customerRepository.save(defaultCustomer);

      return savedEstablishment;
    });
  }
}
