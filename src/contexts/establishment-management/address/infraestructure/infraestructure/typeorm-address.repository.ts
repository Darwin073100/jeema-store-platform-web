import { DataSource, Repository } from "typeorm";
import { AddressEntity } from "../../domain/entities/address.entity";
import { AddressRepository } from "../../domain/repository/address.repository";
import { AddressOrmEntity } from "../entities/address.orm-entity";
import { AddressMapper } from "../mappers/address.mapper";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";

export class TypeormAddressRepository implements AddressRepository {
    private readonly repository: Repository<AddressOrmEntity>;

    constructor(
        // private readonly dataSource: DataSource,
        private readonly transactionDB: TransactionDBRepository
    ) {
        this.repository = this.transactionDB.getManager().getRepository(AddressOrmEntity);
    }

    static async create() {
        // const ds = await getDataSource();
        const tRepository = await TypeormTransactionDBRepository.create();
        return new TypeormAddressRepository(tRepository);
    }

    async save(entity: AddressEntity): Promise<AddressEntity> {
        let addressExist = await this.repository.findOneBy({addressId: entity.addressId})
        if(addressExist){
            addressExist = {
                ...addressExist,
                city: entity.city,
                country: entity.country,
                externalNumber: entity.externalNumber,
                internalNumber: entity.internalNumber,
                municipality: entity.municipality,
                neighborhood: entity.neighborhood,
                reference: entity.reference,
                postalCode: entity.postalCode,
                state: entity.state,
                street: entity.street,
            }
            const result = await this.repository.save(AddressMapper.toOrm(entity));
            return AddressMapper.toDomain(result);
        }
        const result = await this.repository.save(AddressMapper.toOrm(entity));
        return AddressMapper.toDomain(result);
    }

    async findById(entityId: bigint): Promise<AddressEntity | null> {
        const result = await this.repository.findOne({ where:{
            addressId: entityId
        }});
        return result? AddressMapper.toDomain(result): null;
    }
    async existById(entityId: bigint): Promise<AddressEntity | null> {
        const result = await this.repository.findOne({ where:{
            addressId: entityId
        }});
        return result? AddressMapper.toDomain(result): null;
    }

    async findAll(): Promise<[] | AddressEntity[]> {
        throw new Error();
    }

    async delete(entityId: bigint): Promise<AddressEntity | null> {
        const entity = await this.repository.findOneBy({addressId: entityId});
        if (entity) {
            await this.repository.remove(entity);
        }
        return entity? AddressMapper.toDomain(entity): null;
    }
}