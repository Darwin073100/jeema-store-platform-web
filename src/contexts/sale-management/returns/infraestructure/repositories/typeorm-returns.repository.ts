import { DataSource, Repository } from "typeorm";
import { ReturnsOrmEntity } from "../entities/returns.orm-entity";
import { ReturnsRepository } from "../../domain/repositories/returns.repository";
import { ReturnsEntity } from "../../domain/entities/returns.entity";
import { Inject, Injectable } from "@nestjs/common";
import { ReturnsMapper } from "../mappers/returns.mapper";
import { CONNECTION_DB_REPOSITORIO, ConnectionDBRepository } from "src/config/database/typeorm/connection/domain/repositories/connection-repository";

@Injectable()
export class TypeormReturnsRepository implements ReturnsRepository {
    private readonly repository: Repository<ReturnsOrmEntity>;
    
    constructor( 
        private readonly datasource: DataSource,
        @Inject(CONNECTION_DB_REPOSITORIO)
        private readonly connection: ConnectionDBRepository
    ){
        this.repository = this.datasource.getRepository(ReturnsOrmEntity);
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
            const result = await this.connection.getManager().getRepository(ReturnsOrmEntity).save(ormEntities);
            return result.map(item=> ReturnsMapper.toDomain(item));
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