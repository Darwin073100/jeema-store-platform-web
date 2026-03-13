import { DataSource, Repository } from "typeorm";
import { ReturnsOrmEntity } from "../entities/returns.orm-entity";
import { ReturnsRepository } from "../../domain/repositories/returns.repository";
import { ReturnsEntity } from "../../domain/entities/returns.entity";
import { ReturnsMapper } from "../mappers/returns.mapper";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { getDataSource } from "@/configuration/databases/typeorm/config";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";

export class TypeormReturnsRepository implements ReturnsRepository {
    private readonly repository: Repository<ReturnsOrmEntity>;
    
    constructor( 
        private readonly datasource: DataSource,
        private readonly transactionDB: TransactionDBRepository
    ){
        this.repository = this.datasource.getRepository(ReturnsOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormReturnsRepository> {
        const dataSource = await getDataSource();
        const transactionDBRepo = await TypeormTransactionDBRepository.create();
        return new TypeormReturnsRepository(dataSource, transactionDBRepo);
    }

    async save(entity: ReturnsEntity): Promise<ReturnsEntity> {
        try {
            let entityExist = await this.repository.findOneBy({returnsId: entity.returnsId});
            if(entityExist){
                entityExist = {
                    ...entityExist,
                    amountReturn: entity.amountReturn,
                    quantityReturn: entity.quantityReturn,
                    notes: entity.notes
                }
                const upResult = await this.repository.save(entityExist);
                return ReturnsMapper.toDomain(upResult);
            }
            const ormEntity = ReturnsMapper.toOrm(entity);
            const result = await this.repository.save(ormEntity);
            return ReturnsMapper.toDomain(result);
        } catch (error) {
          throw error;  
        }
    }
    async saveAll(entities: ReturnsEntity[]): Promise<ReturnsEntity[]> {
        try {
            const ormEntities = entities.map(item => ReturnsMapper.toOrm(item));
            const result = await this.transactionDB.getManager().getRepository(ReturnsOrmEntity).save(ormEntities);
            return result.map((item:any)=> ReturnsMapper.toDomain(item));
        } catch (error) {
          throw error;  
        }
    }
    findById(entityId: bigint): Promise<ReturnsEntity | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<[] | ReturnsEntity[]> {
        throw new Error("Method not implemented.");
    }
    async findAllBySaleDetailId(saleDetailId: bigint): Promise<ReturnsEntity[]> {
        const result = await this.repository.findBy({
            saleDetailId
        });
        return result.map(item => ReturnsMapper.toDomain(item));
    }
    async findAllByBranchOfficeId(branchOfficeId: bigint): Promise<ReturnsEntity[]> {
        const result = await this.repository.find({
            where: {
                saleDetail:{
                    sale:{
                        branchOfficeId
                    }
                }
            },
            relations:{
                employee: true,
                saleDetail: true
            }
        });
        return result.map(item => ReturnsMapper.toDomain(item));
    }
    delete(entityId: bigint): Promise<ReturnsEntity | null> {
        throw new Error("Method not implemented.");
    }
}