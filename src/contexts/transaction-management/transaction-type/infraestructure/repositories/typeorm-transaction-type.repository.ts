import { TransactionTypeRepository } from "../../domain/repositories/transaction-type.repository";
import { TransactionTypeEntity } from "../../domain/entities/transaction-type.entity";
import { DataSource, Repository } from "typeorm";
import { TransactionTypeOrmEntity } from "../entities/transaction-type.orm-entity";
import { TransactionTypeMapper } from "../mappers/transaction-type.mapper";
import { AccountTypeEnum } from "../../domain/enums/account-type.enum";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormTransactionTypeRepository implements TransactionTypeRepository {
    private readonly repository: Repository<TransactionTypeOrmEntity>;

    constructor(private readonly datasource: DataSource) {
        this.repository = this.datasource.getRepository(TransactionTypeOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormTransactionTypeRepository> {
        const dataSource = await getDataSource();
        return new TypeormTransactionTypeRepository(dataSource);
    }

    async save(entity: TransactionTypeEntity): Promise<TransactionTypeEntity> {
        try {
            let transactionExist = await this.repository.findOneBy({
                transactionTypeId: entity.transactionTypeId,
            });

            if (transactionExist) {
                transactionExist = {
                    ...transactionExist,
                    name: entity.name,
                    description: entity.description,
                    accountType: entity.accountType,
                }
                const result = await this.repository.save(transactionExist);
                return TransactionTypeMapper.toDomain(result);
            }
            const ormEntity = TransactionTypeMapper.toOrm(entity);
            const result = await this.repository.save(ormEntity);
            return TransactionTypeMapper.toDomain(result);
        } catch (error) {
            throw error;
        }
    }
    async findById(entityId: bigint): Promise<TransactionTypeEntity | null> {
        const result = await this.repository.findOneBy({transactionTypeId: entityId});
        return result? TransactionTypeMapper.toDomain(result): null;
    }

    async findByName(name: string): Promise<TransactionTypeEntity | null> {
        try {
            const result = await this.repository
                .createQueryBuilder('transactionType')
                .where('LOWER(transactionType.name) = LOWER(:name)', { name })
                .getOne();
            
            return result ? TransactionTypeMapper.toDomain(result) : null;
        } catch (error) {
            throw error;
        }
    }
    async findAllByName(accountType: AccountTypeEnum): Promise<TransactionTypeEntity[]> {
        try {
            const result = await this.repository
                .createQueryBuilder('transactionType')
                .where('transactionType.accountType = :accountType', { accountType })
                .getMany();
            
            return result.map(item => TransactionTypeMapper.toDomain(item));
        } catch (error) {
            throw error;
        }
    }

    async existById(entityId: bigint):Promise<boolean>{
        return await this.repository.existsBy({
            transactionTypeId: entityId
        })
    }

    async findAll(): Promise<[] | TransactionTypeEntity[]> {
        const result = await this.repository.find({});
        return result.map(item => TransactionTypeMapper.toDomain(item));
    }

    delete(entityId: bigint): Promise<TransactionTypeEntity | null> {
        throw new Error("Method not implemented.");
    }

}