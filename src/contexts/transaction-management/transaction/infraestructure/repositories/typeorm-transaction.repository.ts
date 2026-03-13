import { DataSource, Not, Repository } from "typeorm";
import { TransactionEntity } from "../../domain/entities/transaction.entity";
import { TransactionRepository } from "../../domain/repositories/transaction.repository";
import { TransactionOrmEntity } from "../entities/transaction.orm-entity";
import { Inject, Injectable } from "@nestjs/common";
import { TransactionMapper } from "../mappers/transaction.mapper";
import { ManyFilterTransactionsDTO } from "../../application/dtos/many-filter-transactions.dto";
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from "src/config/database/typeorm/connection/domain/repositories/connection-repository";

@Injectable()
export class TypeormTransactionRepository implements TransactionRepository{
    private readonly repository: Repository<TransactionOrmEntity>;
    
    constructor(
        private readonly datasource: DataSource,
        @Inject(CONNECTION_DB_REPOSITORIO)
        private readonly connection: ConnectionDBRepository,
    ){
        this.repository = this.datasource.getRepository(TransactionOrmEntity);
    }

    async save(entity: TransactionEntity): Promise<TransactionEntity> {
        try {
            let transactionExist = await this.repository.findOneBy({
                transactionId: entity.transactionId
            });
            if(transactionExist){
                transactionExist = {
                    ...transactionExist,
                    amount: entity.amount,
                    description: entity.description,
                    transactionTypeId: entity.transactionTypeId,
                }
                const updateResult = await this.connection.getManager().getRepository(TransactionOrmEntity).save(transactionExist);
                return TransactionMapper.toDomain(updateResult);
            }
            const ormEntity = TransactionMapper.toOrm(entity);
            const result = await this.connection.getManager().getRepository(TransactionOrmEntity).save(ormEntity);
            return TransactionMapper.toDomain(result);
        } catch (error) {
            throw error;
        }
    }
    findById(entityId: bigint): Promise<TransactionEntity | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<TransactionEntity[] | []> {
        throw new Error("Method not implemented.");
    }
    async findAllByManyFilter(dto: ManyFilterTransactionsDTO): Promise<TransactionEntity[]> {
        // Construir una consulta dinámica con QueryBuilder según los campos del DTO
        const qb = this.repository.createQueryBuilder('t')
            .leftJoinAndSelect('t.transactionType', 'tt')
            .leftJoinAndSelect('t.branchOffice', 'bo')
            .leftJoinAndSelect('bo.address', 'addr')
            .leftJoinAndSelect('t.sale', 's')
            .leftJoinAndSelect('t.employee', 'e')
            .leftJoinAndSelect('t.cashSession', 'cs');

        // Filtros condicionales
        if (dto.establishmentId) {
            qb.andWhere('bo.establishmentId = :establishmentId', { establishmentId: dto.establishmentId });
        }
        if (dto.branchOfficeId) {
            qb.andWhere('t.branchOfficeId = :branchOfficeId', { branchOfficeId: dto.branchOfficeId });
        }
        if (dto.employeeId) {
            qb.andWhere('t.employeeId = :employeeId', { employeeId: dto.employeeId });
        }
        if (dto.cashSessionId) {
            qb.andWhere('t.cashSessionId = :cashSessionId', { cashSessionId: dto.cashSessionId });
        }
        if (dto.saleId) {
            qb.andWhere('t.saleId = :saleId', { saleId: dto.saleId });
        }
        if (dto.transactionType) {
            // Comparación case-insensitive por nombre de tipo de transacción
            qb.andWhere('LOWER(tt.name) = LOWER(:transactionType)', { transactionType: dto.transactionType });
        }
        if (dto.dateInit) {
            qb.andWhere('t.createdAt >= :dateInit', { dateInit: dto.dateInit });
        }
        if (dto.dateEnd) {
            qb.andWhere('t.createdAt <= :dateEnd', { dateEnd: dto.dateEnd });
        }

        const result = await qb.orderBy('t.createdAt', 'DESC').getMany();
        return result.map(item => TransactionMapper.toDomain(item));
    }
    findAllTransactionByBranchOffice(branchOfficeId: bigint): Promise<TransactionEntity[] | []> {
        throw new Error("Method not implemented.");
    }
    delete(entityId: bigint): Promise<TransactionEntity | null> {
        throw new Error("Method not implemented.");
    }

}