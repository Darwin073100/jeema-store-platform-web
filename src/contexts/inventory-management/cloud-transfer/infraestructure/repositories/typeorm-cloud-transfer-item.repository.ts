import { DataSource, Repository } from "typeorm";
import { getDataSource } from "@/configuration/databases/typeorm/config";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { CloudTransferItemRepository } from "../../domain/repositories/cloud-transfer-item.repository";
import { CloudTransferItemEntity } from "../../domain/entities/cloud-transfer-item.entity";
import { CloudTransferItemOrmEntity } from "../entities/cloud-transfer-item.orm-entity";
import { CloudTransferItemMapper } from "../mappers/cloud-transfer-item.mapper";

export class TypeormCloudTransferItemRepository implements CloudTransferItemRepository {
    private readonly repository: Repository<CloudTransferItemOrmEntity>;

    constructor(
        private readonly dataSource: DataSource,
        private readonly transactionDB: TransactionDBRepository,
    ) {
        this.repository = this.dataSource.getRepository(CloudTransferItemOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormCloudTransferItemRepository> {
        const dataSource = await getDataSource();
        const transactionDB = await TypeormTransactionDBRepository.create();
        return new TypeormCloudTransferItemRepository(dataSource, transactionDB);
    }

    async save(entity: CloudTransferItemEntity): Promise<CloudTransferItemEntity> {
        const ormEntity = CloudTransferItemMapper.toOrmEntity(entity);
        const saved = await this.repository.save(ormEntity);
        return CloudTransferItemMapper.toDomain(saved);
    }

    /**
     * Ver la nota en `TypeormCloudTransferRepository.saveTransactional`: el repositorio transaccional se
     * resuelve DENTRO del método, en cada llamada, no cacheado en el constructor.
     */
    async updateTransactional(entity: CloudTransferItemEntity): Promise<CloudTransferItemEntity> {
        const transactionalRepository = this.transactionDB.getManager().getRepository(CloudTransferItemOrmEntity);
        const ormEntity = CloudTransferItemMapper.toOrmEntity(entity);
        const saved = await transactionalRepository.save(ormEntity);
        return CloudTransferItemMapper.toDomain(saved);
    }

    async findById(entityId: bigint): Promise<CloudTransferItemEntity | null> {
        const result = await this.repository.findOneBy({ cloudTransferItemId: entityId });
        return result ? CloudTransferItemMapper.toDomain(result) : null;
    }

    findAll(): Promise<CloudTransferItemEntity[]> {
        throw new Error('Método no implementado.');
    }

    delete(): Promise<CloudTransferItemEntity | null> {
        throw new Error('Método no implementado.');
    }

    async findAllByCloudTransferId(cloudTransferId: bigint): Promise<CloudTransferItemEntity[]> {
        const result = await this.repository.find({
            where: { cloudTransferId },
            order: { lineNumber: 'ASC' },
        });
        return result.map(item => CloudTransferItemMapper.toDomain(item));
    }
}
