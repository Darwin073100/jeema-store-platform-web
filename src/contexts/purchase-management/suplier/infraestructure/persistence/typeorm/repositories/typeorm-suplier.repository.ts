import { DataSource, Repository } from "typeorm";
import { SuplierOrmEntity } from "../entities/suplier.orm-entity";
import { SuplierMapper } from "../mappers/suplier.mapper";
import { SuplierRepository } from "src/contexts/purchase-management/suplier/domain/repositories/suplier.repository";
import { SuplierEntity } from "src/contexts/purchase-management/suplier/domain/entities/suplier.entity";
import { AddressOrmEntity } from "@/contexts/establishment-management/address/infraestructure/entities/address.orm-entity";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeOrmSuplierRepository implements SuplierRepository {
  private repository: Repository<SuplierOrmEntity>;
  // Ya no necesitamos ormAddressRepository aquí, TypeORM lo maneja con cascade

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(SuplierOrmEntity);
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmAgregadoRepository.create();
   */
  static async create(): Promise<TypeOrmSuplierRepository> {
    const dataSource = await getDataSource();
    return new TypeOrmSuplierRepository(dataSource);
  }
  async save(suplierEntity: SuplierEntity): Promise<SuplierEntity> {

    let addressOrmEntity: AddressOrmEntity | null = null;
    if (suplierEntity.suplierId) {
      // Intentamos cargar la entidad ORM existente para BranchOffice
      const existingBranchOrm = await this.repository.findOne({
        where: { suplierId: suplierEntity.suplierId },
        relations: ['address'], // Necesitamos cargar la dirección para actualizarla
      });
      if (existingBranchOrm) {
        addressOrmEntity = existingBranchOrm.address;
      }
    }

    if (!addressOrmEntity) {
      addressOrmEntity = new AddressOrmEntity();
    }

  
    // Conversion de una entidad de dominio a una entidad de Typeorm
    const branchOrmEntity = SuplierMapper.toOrmEntity(suplierEntity);
    
    
    // Guardar la entidad
    const resp = await this.repository.save(branchOrmEntity); // El cascade se encargará de guardar/actualizar la dirección
    
    // Convertir una entidad de Typeorm a una entidad de dominio
    const entity = SuplierMapper.toDomainEntity(resp);

    return entity;
  }

  async findById(id: bigint): Promise<SuplierEntity | null> {
    const suplierOrmEntity = await this.repository.findOne({
      where: { suplierId: id },
      relations: ['address'], // 'eager: true' en la entidad ya debería cargarla, pero es buena práctica indicarlo
    });

    if (!suplierOrmEntity) {
      return null;
    }

    const suplierEntity = SuplierMapper.toDomainEntity(suplierOrmEntity);
    return suplierEntity;
  }

  delete(entityId: bigint): Promise<SuplierEntity | null> {
    throw new Error('Este metodo no esta implementado');
  }
  
  findAll(): Promise<[] | SuplierEntity[]> {
    throw new Error('Este metodo no esta implementado');
  }

  async findAllByEstablishmentId(establishmentId: bigint, isAddress: boolean): Promise<SuplierEntity[]> {
    const result = await this.repository.find({
      where: {
        establishmentId
      },
      relations:{
        address: isAddress
      }
    }); 
    return result.map(item=> SuplierMapper.toDomainEntity(item))
  }

  async findByEmail(email: string, establishmentId: bigint): Promise<SuplierEntity | null> {
    const result = await this.repository.findOneBy({email, establishmentId});
    if(!result){
      return null;
    }
    return SuplierMapper.toDomainEntity(result);
  }

  async findByRfc(rfc: string, establishmentId: bigint): Promise<SuplierEntity | null> {
    const result = await this.repository.findOneBy({rfc, establishmentId});
    if(!result){
      return null;
    }
    return SuplierMapper.toDomainEntity(result);
  }
}