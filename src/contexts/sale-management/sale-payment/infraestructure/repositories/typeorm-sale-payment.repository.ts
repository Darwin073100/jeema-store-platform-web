import { DataSource, Repository } from "typeorm";
import { SalePaymentEntity } from "../../domain/entities/sale-payment.entity";
import { SalePaymentRepository } from "../../domain/repositories/sale-payment.repository";
import { SalePaymentOrmEntity } from "../entities/sale-payment.orm-entity";
import { SalePaymentMapper } from "../mappers/sale-payment.mapper";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormSalePaymentRepository implements SalePaymentRepository {
    private readonly repository: Repository<SalePaymentOrmEntity>;

    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(SalePaymentOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormSalePaymentRepository> {
        const dataSource = await getDataSource();
        return new TypeormSalePaymentRepository(dataSource);
    }

    async save(entity: SalePaymentEntity): Promise<SalePaymentEntity> {
        let salePaymentExist = await this.repository.findOne({
            where: {
                salePaymentId: entity.salePaymentId
            }
        });

        if(salePaymentExist){
            salePaymentExist = {
                ...salePaymentExist,
                amountPaid: entity.amountPaid.value,
                referenceNumber: entity.referenceNumber?.value
            }
            const updatedResult = await this.repository.save(salePaymentExist);
            return SalePaymentMapper.toDomain(updatedResult);
        }

        const ormEntity = SalePaymentMapper.toOrm(entity);
        const savedResult = await this.repository.save(ormEntity);
        return SalePaymentMapper.toDomain(savedResult   ); 
    }
    async saveAll(entities: SalePaymentEntity[]): Promise<SalePaymentEntity[]> {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let ormEntities = entities.map( item => SalePaymentMapper.toOrm(item));

            for(let i = 0; i < ormEntities.length; i++){
                let salePaymentExist = await queryRunner.manager.findOne(SalePaymentOrmEntity,{
                    where: {
                        salePaymentId: ormEntities[i].salePaymentId
                    }
                });
        
                if(salePaymentExist){
                    ormEntities[i] = {
                        ...ormEntities[i],
                        paymentMethodId: entities[i].paymentMethodId,
                        amountPaid: entities[i].amountPaid.value,
                        referenceNumber: entities[i].referenceNumber?.value
                    }
                }
            }

            const savedResults = await this.repository.save(ormEntities);
            await queryRunner.commitTransaction();
            await queryRunner.release();
            const domainEntities = savedResults.map(item => SalePaymentMapper.toDomain(item));
            return domainEntities; 
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw error;
        }
    }
    findById(entityId: bigint): Promise<SalePaymentEntity | null> {
        throw new Error("Method not implemented.");
    }
    async existById(entityId: bigint): Promise<SalePaymentEntity | null> {
        const result = await this.repository.findOneBy({
            salePaymentId: entityId
        })
        return result? SalePaymentMapper.toDomain(result): null;
    }
    findAll(): Promise<[] | SalePaymentEntity[]> {
        throw new Error("Method not implemented.");
    }
    async findAllBySaleId(saleId: bigint): Promise<SalePaymentEntity[]> {
        const result = await this.repository.find({
            where: {
                saleId
            }
        });

        return result.map( item => SalePaymentMapper.toDomain(item))
    }
    delete(entityId: bigint): Promise<SalePaymentEntity | null> {
        throw new Error("Method not implemented.");
    }
    
}