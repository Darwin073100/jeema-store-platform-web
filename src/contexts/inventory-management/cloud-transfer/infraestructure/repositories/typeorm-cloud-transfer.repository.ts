import { DataSource, FindOptionsWhere, IsNull, Repository } from "typeorm";
import { getDataSource } from "@/configuration/databases/typeorm/config";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";
import { CloudTransferRepository } from "../../domain/repositories/cloud-transfer.repository";
import { CloudTransferEntity } from "../../domain/entities/cloud-transfer.entity";
import { CloudTransferOrmEntity } from "../entities/cloud-transfer.orm-entity";
import { CloudTransferItemOrmEntity } from "../entities/cloud-transfer-item.orm-entity";
import { CloudTransferMapper } from "../mappers/cloud-transfer.mapper";
import { CloudTransferDirectionEnum } from "../../domain/enums/cloud-transfer-direction.enum";
import { CloudTransferStatusEnum } from "../../domain/enums/cloud-transfer-status.enum";
import { CloudTransferItemResolutionStatusEnum } from "../../domain/enums/cloud-transfer-item-resolution-status.enum";

export class TypeormCloudTransferRepository implements CloudTransferRepository {
    private readonly repository: Repository<CloudTransferOrmEntity>;

    constructor(
        private readonly dataSource: DataSource,
        private readonly transactionDB: TransactionDBRepository,
    ) {
        this.repository = this.dataSource.getRepository(CloudTransferOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormCloudTransferRepository> {
        const dataSource = await getDataSource();
        const transactionDB = await TypeormTransactionDBRepository.create();
        return new TypeormCloudTransferRepository(dataSource, transactionDB);
    }

    async save(entity: CloudTransferEntity): Promise<CloudTransferEntity> {
        const saved = await this.saveHeaderAndItems(
            this.repository,
            this.dataSource.getRepository(CloudTransferItemOrmEntity),
            entity,
        );
        const found = await this.repository.findOne({
            where: { cloudTransferId: saved.cloudTransferId },
            relations: { items: true },
        });
        return CloudTransferMapper.toDomain(found ?? saved);
    }

    /**
     * Guarda cabecera + items en dos fases explícitas (no delega en `{cascade:true}` de TypeORM para el
     * INSERT inicial): para una cabecera nueva, `entity.cloudTransferId`/cada `item.cloudTransferItemId`
     * valen `0n` (placeholder), y dejar que TypeORM intente resolver el FK de los items vía cascade en el
     * mismo `save()` que inserta la cabecera confunde su detección insert-vs-update (intenta un UPDATE con
     * `cloud_transfer_id = null`). Mismo patrón manual de dos fases que ya usa
     * `TypeOrmProductRepository.saveCompleteProduct` para Product+Lot+Inventory+InventoryItem.
     */
    private async saveHeaderAndItems(
        headerRepository: Repository<CloudTransferOrmEntity>,
        itemsRepository: Repository<CloudTransferItemOrmEntity>,
        entity: CloudTransferEntity,
    ): Promise<CloudTransferOrmEntity> {
        const ormEntity = CloudTransferMapper.toOrmEntity(entity);
        const { items: itemsOrm, ...headerOnlyOrm } = ormEntity;
        const savedHeader = await headerRepository.save(headerOnlyOrm);

        if (itemsOrm && itemsOrm.length > 0) {
            const itemsToSave = itemsOrm.map((item) => ({ ...item, cloudTransferId: savedHeader.cloudTransferId }));
            await itemsRepository.save(itemsToSave);
        }

        return savedHeader;
    }

    /**
     * Variante transaccional. IMPORTANTE: el repositorio transaccional (`transactionDB.getManager()
     * .getRepository(...)`) se resuelve AQUÍ DENTRO, en cada llamada — nunca cacheado en el constructor.
     * Ver spect/08_cloud_transfer_spect.md sección 5.5 para el razonamiento completo: cachearlo en el
     * constructor (como hace `TypeOrmBranchOfficeRepository.branchTransactionRepository`) captura el
     * manager global no-transaccional vigente en el momento en que la Server Action construye el
     * repositorio (antes de entrar a `runInTransaction`), por lo que las escrituras nunca participan
     * realmente de la transacción activa.
     */
    async saveTransactional(entity: CloudTransferEntity): Promise<CloudTransferEntity> {
        const transactionalRepository = this.transactionDB.getManager().getRepository(CloudTransferOrmEntity);
        const transactionalItemsRepository = this.transactionDB.getManager().getRepository(CloudTransferItemOrmEntity);
        const saved = await this.saveHeaderAndItems(transactionalRepository, transactionalItemsRepository, entity);
        const found = await transactionalRepository.findOne({
            where: { cloudTransferId: saved.cloudTransferId },
            relations: { items: true },
        });
        return CloudTransferMapper.toDomain(found ?? saved);
    }

    async findById(entityId: bigint): Promise<CloudTransferEntity | null> {
        const result = await this.repository.findOne({
            where: { cloudTransferId: entityId },
            relations: { items: true },
        });
        return result ? CloudTransferMapper.toDomain(result) : null;
    }

    findAll(): Promise<CloudTransferEntity[]> {
        throw new Error('Método no implementado.');
    }

    delete(): Promise<CloudTransferEntity | null> {
        throw new Error('Método no implementado.');
    }

    async findByRemoteCloudTransferId(remoteCloudTransferId: bigint, direction: CloudTransferDirectionEnum): Promise<CloudTransferEntity | null> {
        const result = await this.repository.findOne({
            where: { remoteCloudTransferId, direction },
            relations: { items: true },
        });
        return result ? CloudTransferMapper.toDomain(result) : null;
    }

    /**
     * Idempotencia local: el traspaso más reciente aún PENDING sin enviar (`remoteCloudTransferId IS NULL`)
     * de esta sucursal. `shipmentNotesHash` queda como parámetro reservado (no usado en v1: con un único
     * traspaso "sin enviar" abierto por sucursal a la vez, el filtro por branch + PENDING + sin remoteId ya
     * es suficiente para el guard de idempotencia que necesita `CreateAndSendCloudTransferUseCase`).
     */
    async findByFromBranchOfficeIdUnsent(fromBranchOfficeId: bigint): Promise<CloudTransferEntity | null> {
        const result = await this.repository.findOne({
            where: {
                fromBranchOfficeId,
                remoteCloudTransferId: IsNull(),
                status: CloudTransferStatusEnum.PENDING,
                direction: CloudTransferDirectionEnum.OUTGOING,
            },
            relations: { items: true },
            order: { createdAt: 'DESC' },
        });
        return result ? CloudTransferMapper.toDomain(result) : null;
    }

    async findAllByBranchOffice(branchOfficeId: bigint, direction?: CloudTransferDirectionEnum): Promise<CloudTransferEntity[]> {
        let where: FindOptionsWhere<CloudTransferOrmEntity> | FindOptionsWhere<CloudTransferOrmEntity>[];
        if (direction === CloudTransferDirectionEnum.OUTGOING) {
            where = { fromBranchOfficeId: branchOfficeId, direction };
        } else if (direction === CloudTransferDirectionEnum.INCOMING) {
            where = { toBranchOfficeId: branchOfficeId, direction };
        } else {
            where = [
                { fromBranchOfficeId: branchOfficeId },
                { toBranchOfficeId: branchOfficeId },
            ];
        }
        const result = await this.repository.find({
            where,
            relations: { items: true },
            order: { createdAt: 'DESC' },
        });
        return result.map(item => CloudTransferMapper.toDomain(item));
    }

    /**
     * Traspasos INCOMING de la sucursal, en un estado en el que aún se puede/debe resolver líneas
     * (IN_TRANSIT o RECEIVED), que tengan al menos un item con resolutionStatus = PENDING.
     */
    async findAllPendingResolutionByBranchOffice(branchOfficeId: bigint): Promise<CloudTransferEntity[]> {
        const result = await this.repository.createQueryBuilder('cloud_transfer')
            .leftJoinAndSelect('cloud_transfer.items', 'items')
            .where('cloud_transfer.toBranchOfficeId = :branchOfficeId', { branchOfficeId })
            .andWhere('cloud_transfer.direction = :direction', { direction: CloudTransferDirectionEnum.INCOMING })
            .andWhere('cloud_transfer.status IN (:...statuses)', {
                statuses: [CloudTransferStatusEnum.IN_TRANSIT, CloudTransferStatusEnum.RECEIVED],
            })
            .andWhere((qb) => {
                const subQuery = qb.subQuery()
                    .select('1')
                    .from(CloudTransferItemOrmEntity, 'pending_item')
                    .where('pending_item.cloudTransferId = cloud_transfer.cloudTransferId')
                    .andWhere('pending_item.resolutionStatus = :pendingResolutionStatus')
                    .getQuery();
                return `EXISTS ${subQuery}`;
            })
            .setParameter('pendingResolutionStatus', CloudTransferItemResolutionStatusEnum.PENDING)
            .orderBy('cloud_transfer.createdAt', 'DESC')
            .getMany();

        return result.map(item => CloudTransferMapper.toDomain(item));
    }
}
