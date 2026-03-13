import { DataSource, Repository } from "typeorm";
import { TransferOrmEntity } from "../entities/transfer.orm-entity";
import { TransferRepository } from "../../domain/repositories/transfer.repository";
import { TransferEntity } from "../../domain/entities/transafer.entity";
import { TransferMapper } from "../mappers/transfer.mapper";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormTransferRepository implements TransferRepository {
    private readonly repository: Repository<TransferOrmEntity>;
    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(TransferOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormTransferRepository> {
        const dataSource = await getDataSource();
        return new TypeormTransferRepository(dataSource);
    }
    
    async save(entity: TransferEntity): Promise<TransferEntity> {
        const transferExist = await this.repository.findOneBy({ transferId: entity.transferId});
        const ormEntity = TransferMapper.toOrmEntity(entity);
        if(transferExist){
            const updated = this.repository.merge(transferExist, ormEntity);
            const saved = await this.repository.save(updated);
            return TransferMapper.toDomain(saved);
        }
        const saved = await this.repository.save(ormEntity);
        const find = await this.repository.findOneBy({ transferId: saved.transferId });
        return TransferMapper.toDomain(find ?? saved);
    }
    async findById(entityId: bigint): Promise<TransferEntity | null> {
        const result = await this.repository.findOneBy({ transferId: entityId });
        return result? TransferMapper.toDomain(result) : null;
    }
    findAll(): Promise<[] | TransferEntity[]> {
        throw new Error("Method not implemented.");
    }
    async findAllByBranchOffice(branchOfficeId: bigint): Promise<TransferEntity[]> {
        const result = await this.repository.find({
            where:{
                inventory:{
                    branchOfficeId
                }
            },
            relations:{
                requestedByEmployee: true
            }
        });
        return result.map(item => TransferMapper.toDomain(item));
    }
    delete(entityId: bigint): Promise<TransferEntity | null> {
        throw new Error("Method not implemented.");
    }
}