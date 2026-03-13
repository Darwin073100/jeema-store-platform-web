import { BranchOfficeEntity } from "src/contexts/establishment-management/branch-office/domain/entities/branch-office.entity";
import { AddressOrmEntity } from "src/shared/infraestructure/typeorm/address.orm-entity";
import { DataSource, Repository } from "typeorm";
import { BranchOfficeOrmEntity } from "../entities/branch-office.orm-entity";
import { BranchOfficeRepository } from "src/contexts/establishment-management/branch-office/domain/repositories/branch-office.repository";
import { Injectable, NotFoundException } from "@nestjs/common";
import { BranchOfficeMapper } from "../mappers/branch-office.mapper";
import { EstablishmentOrmEntity } from "src/contexts/establishment-management/establishment/infraestruture/persistence/typeorm/entities/establishment-orm-entity";
import { BranchOfficeNotFoundException } from "src/contexts/establishment-management/branch-office/domain/exceptions/branch-office-not-found.exception";

@Injectable()
export class TypeOrmBranchOfficeRepository implements BranchOfficeRepository {
  private ormBranchOfficeRepository: Repository<BranchOfficeOrmEntity>;
  private ormEstablishmentRepository: Repository<EstablishmentOrmEntity>;
  // Ya no necesitamos ormAddressRepository aquí, TypeORM lo maneja con cascade

  constructor(private readonly dataSource: DataSource) {
    this.ormBranchOfficeRepository = this.dataSource.getRepository(BranchOfficeOrmEntity);
    this.ormEstablishmentRepository = this.dataSource.getRepository(EstablishmentOrmEntity);
  }

  async save(branchOffice: BranchOfficeEntity): Promise<BranchOfficeEntity> {
    // 1. Mapear el Value Object de dominio Address a AddressOrmEntity
    // Si la BranchOffice ya existe (tiene un ID), su AddressOrmEntity asociada
    // debería haber sido cargada por 'eager: true'.
    // Si es una nueva BranchOffice, se crea una nueva AddressOrmEntity.
    const isEstablishment = await this.ormEstablishmentRepository.findBy({establishmentId: branchOffice.establishmentId});
    // ...removed console.log...
    
    if(!isEstablishment){
      throw new NotFoundException('Debe ser un id de un establecimeinto existente.');
    }

    let addressOrmEntity: AddressOrmEntity | null = null;
    if (branchOffice.branchOfficeId) {
      // Intentamos cargar la entidad ORM existente para BranchOffice
      const existingBranchOrm = await this.ormBranchOfficeRepository.findOne({
        where: { branchOfficeId: branchOffice.branchOfficeId },
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
    const branchOrmEntity = BranchOfficeMapper.toOrmEntity(branchOffice);
    
    
    // Guardar la entidad
    const resp = await this.ormBranchOfficeRepository.save(branchOrmEntity); // El cascade se encargará de guardar/actualizar la dirección
    
    // Convertir una entidad de Typeorm a una entidad de dominio
    const entity = BranchOfficeMapper.toDomainEntity(resp);

    return entity;
  }
  async update(branchOffice: BranchOfficeEntity): Promise<BranchOfficeEntity>{
    try {
      let branchExist = await this.ormBranchOfficeRepository.findOneBy({ branchOfficeId: branchOffice.branchOfficeId });
      
      if(!branchExist){
        throw new BranchOfficeNotFoundException('No se encontró la sucursal a editar.');
      }

      branchExist = {
        ...branchExist,
        name: branchOffice.name
      }

      const save = await this.ormBranchOfficeRepository.save(branchExist);

      return BranchOfficeMapper.toDomainEntity(save);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: bigint): Promise<BranchOfficeEntity | null> {
    const branchOrmEntity = await this.ormBranchOfficeRepository.findOne({
      where: { branchOfficeId: id },
      relations: ['address'], // 'eager: true' en la entidad ya debería cargarla, pero es buena práctica indicarlo
    });

    if (!branchOrmEntity) {
      return null;
    }

    const branchOfficeEntity = BranchOfficeMapper.toDomainEntity(branchOrmEntity);
    return branchOfficeEntity;
  }
  
  async existById(branchOfficeId: bigint): Promise<BranchOfficeEntity | null> {
    const result = await this.ormBranchOfficeRepository.findOneBy({
      branchOfficeId
    });
    return result? BranchOfficeMapper.toDomainEntity(result): null;
  }
}