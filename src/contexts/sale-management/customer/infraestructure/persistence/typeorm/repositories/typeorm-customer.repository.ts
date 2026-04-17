import { DataSource, Repository } from "typeorm";
import { CustomerOrmEntity } from "../entities/customer.orm-entity";
import { CustomerMapper } from "../mappers/customer.mapper";
import { CustomerRepository } from "src/contexts/sale-management/customer/domain/repositories/customer.repository";
import { CustomerEntity } from "src/contexts/sale-management/customer/domain/entities/customer.entity";
import { AddressOrmEntity } from "@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeOrmCustomerRepository implements CustomerRepository {
  private ormCustomerRepository: Repository<CustomerOrmEntity>;
  // Ya no necesitamos ormAddressRepository aquí, TypeORM lo maneja con cascade

  constructor(private readonly dataSource: DataSource) {
    this.ormCustomerRepository = this.dataSource.getRepository(CustomerOrmEntity);
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmAgregadoRepository.create();
   */
  static async create(): Promise<TypeOrmCustomerRepository> {
    const dataSource = await getDataSource();
    return new TypeOrmCustomerRepository(dataSource);
  }
  async save(customerEntity: CustomerEntity): Promise<CustomerEntity> {

    let addressOrmEntity: AddressOrmEntity | null| undefined;

    if (customerEntity.address) {
      // Intentamos cargar la entidad ORM existente para BranchOffice
      const existingCustomerOrm = await this.ormCustomerRepository.findOne({
        where: { customerId: customerEntity.customerId },
        relations: ['address'], // Necesitamos cargar la dirección para actualizarla
      });
      if (existingCustomerOrm) {
        addressOrmEntity = existingCustomerOrm.address;
      }
    }

    if (!addressOrmEntity) {
      addressOrmEntity = new AddressOrmEntity();
    }
    // Conversion de una entidad de dominio a una entidad de Typeorm
    const branchOrmEntity = CustomerMapper.toOrmEntity(customerEntity); 
    // Guardar la entidad
    const resp = await this.ormCustomerRepository.save(branchOrmEntity); // El cascade se encargará de guardar/actualizar la dirección
    // Convertir una entidad de Typeorm a una entidad de dominio
    const entity = CustomerMapper.toDomainEntity(resp);
    return entity;
  }

  async findById(id: bigint): Promise<CustomerEntity | null> {
    const customerOrmEntity = await this.ormCustomerRepository.findOne({
      where: { customerId: id },
      relations: {
        address: true
      }, // 'eager: true' en la entidad ya debería cargarla, pero es buena práctica indicarlo
    });

    if (!customerOrmEntity) {
      return null;
    }

    const customerEntity = CustomerMapper.toDomainEntity(customerOrmEntity);
    return customerEntity;
  }
  async existById(id: bigint): Promise<CustomerEntity | null> {
    const customerOrmEntity = await this.ormCustomerRepository.findOne({
      where: { customerId: id },
    });
    return customerOrmEntity? CustomerMapper.toDomainEntity(customerOrmEntity): null;
  }

  delete(entityId: bigint): Promise<CustomerEntity | null> {
    throw new Error('Este metodo no esta implementado');
  }
  
  findAll(): Promise<[] | CustomerEntity[]> {
    throw new Error('Este metodo no esta implementado');
  }

  async findAllByEstablishment(establishmentId: bigint): Promise<CustomerEntity[]> {
    const result = await this.ormCustomerRepository.find({
      where:{
        establishmentId
      },
      relations: {
        address: true
      }
    });

    return result.map(item => CustomerMapper.toDomainEntity(item));
  }
  async findOneByEstablishment(customerId: bigint, establishmentId: bigint): Promise<CustomerEntity| null> {
    const result = await this.ormCustomerRepository.findOne({
      where:{
        establishmentId,
        customerId
      },
      relations: {
        establishment: true,
        sales: true,
        address: true,
      }
    });

    return result? CustomerMapper.toDomainEntity(result): null;
  }
  async findSaleDefault(establishmentId: bigint): Promise<CustomerEntity| null> {
    const result = await this.ormCustomerRepository.findOne({
      where:{
        establishmentId,
        saleDefault: true
      }
    });

    return result? CustomerMapper.toDomainEntity(result): null;
  }

  async findByEmail(email: string): Promise<CustomerEntity | null> {
    const result = await this.ormCustomerRepository.findOneBy({email});
    if(!result){
      return null;
    }
    return CustomerMapper.toDomainEntity(result);
  }

  async findByRfc(rfc: string): Promise<CustomerEntity | null> {
    const result = await this.ormCustomerRepository.findOneBy({rfc});
    if(!result){
      return null;
    }
    return CustomerMapper.toDomainEntity(result);
  }
}