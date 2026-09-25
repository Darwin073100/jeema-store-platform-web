import { Brackets, DataSource, In, Repository } from "typeorm";
import { SaleOrmEntity } from "../entities/sale.orm-entity";
import { SaleMapper } from "../mappers/sale.mapper";
import { PaymentMethodNotFoundException } from "src/contexts/sale-management/payment-method/domain/exceptions/payment-method-not-found.exception";
import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { getDataSource } from "@/configuration/databases/typeorm/config";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";

export class TypeormSaleRepository implements SaleRepository{
    private readonly repository: Repository<SaleOrmEntity>;

    constructor(
        private readonly datasource: DataSource,
        private readonly transactionDB: TransactionDBRepository
    ){
        this.repository = this.datasource.getRepository(SaleOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormSaleRepository> {
        const dataSource = await getDataSource();
        const transactionDBRepo = await TypeormTransactionDBRepository.create();
        return new TypeormSaleRepository(dataSource, transactionDBRepo);
    }

    async findById(saleId: bigint): Promise<SaleEntity | null> {
        //* Igual que en save(): usamos el manager transaccional para que, si findById() se llama
        //* dentro de un runInTransaction(...) (p.ej. RegisterSalePaymentUseCase invocado desde
        //* CalculateSaleUseCase), vea los cambios aún no confirmados de esa misma transacción en
        //* vez de leer por this.repository (otra conexión) y obtener el estado viejo.
        const ormEntity = await this.transactionDB.getManager().findOne(SaleOrmEntity, {
            where: {
                saleId: saleId
            },
            relations:{
                saleDetails:{
                    product: true
                },
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return SaleMapper.toDomainEntity(ormEntity);
    }
    async findFinishSaleById(saleId: bigint): Promise<SaleEntity | null> {
        const ormEntity = await this.repository.findOne({
            where: {
                saleId: saleId
            },
            relations:{
                saleDetails: {
                    returns: {
                        employee: true
                    }
                },
                customer: true,
                employee: true,
                salePayments: {
                    paymentMethod: true,
                    employee: true
                },
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return SaleMapper.toDomainEntity(ormEntity);
    }
    async findSaleTicketById(saleId: bigint): Promise<SaleEntity | null> {
        const ormEntity = await this.repository.findOne({
            where: {
                saleId: saleId
            },
            relations:{
                saleDetails: true,
                customer: true,
                employee: true,
                salePayments: {
                    paymentMethod: true,
                    employee: true
                },
                branchOffice:{
                    address: true,
                    establishment: {
                        details: true
                    }
                },
                // Necesario para que ISale.cashSession.cashRegisterId llegue poblado al cliente:
                // el frontend lo usa para resolver la impresora de la caja que hizo la venta
                // (ver spect/06_impresora_por_caja_spect.md).
                cashSession: true,
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return SaleMapper.toDomainEntity(ormEntity);
    }


    async existById(saleId: bigint): Promise<boolean> {
        return await this.repository.existsBy({
            saleId
        });    
    }

    async findAll(): Promise<SaleEntity[]> {
        const result = await this.repository.find({
            where:{
                deletedAt: undefined
            },
            order: {
                createdAt: 'ASC'
            }
        });
        const categoryList = result.map(item => SaleMapper.toDomainEntity(item));
        return categoryList;
    }
    async findAllByBranchOffice(branchOfficeId: bigint): Promise<SaleEntity[]> {
        const result = await this.repository.find({
            where:{
                branchOfficeId
            },
            relations:{
                customer: true,
                employee: true,
            },
            order: {
                createdAt: 'DESC'
            }
        });
        const categoryList = result.map(item => SaleMapper.toDomainEntity(item));
        return categoryList;
    }
    async findAllByBranchOfficeAndFilter(branchOfficeId: bigint, dateStart?: Date, dateEnd?: Date, search?:string): Promise<SaleEntity[]> {
        const query = await this.repository.createQueryBuilder('sale')
            .leftJoinAndSelect('sale.customer', 'customer')
            .leftJoinAndSelect('sale.employee', 'employee')
            .where('sale.branchOfficeId = :branchOfficeId', {branchOfficeId});

            if(dateStart){
                query.andWhere('sale.createdAt >= :dateStart', {dateStart});
            }
            if(dateEnd){
                query.andWhere('sale.createdAt <= :dateEnd', {dateEnd});
            }

            if(search){
                // El folio de venta es el propio saleId (bigint) — BigInt() revienta con texto no
                // numérico, así que la condición por folio solo se agrega si el término de búsqueda
                // es puramente numérico (ver "search por folio").
                const trimmedSearch = search.trim();
                const isNumericSearch = /^\d+$/.test(trimmedSearch);

                query.andWhere(new Brackets((qb)=>{
                    qb.where('employee.firstName ILIKE :textSearch', {textSearch: `%${search}%`})
                    .orWhere('employee.lastName ILIKE :textSearch', {textSearch: `%${search}%`})
                    .orWhere('customer.firstName ILIKE :textSearch', {textSearch: `%${search}%`})
                    .orWhere('customer.lastName ILIKE :textSearch', {textSearch: `%${search}%`});
                    if(isNumericSearch){
                        qb.orWhere('sale.saleId = :numSearch', {numSearch: BigInt(trimmedSearch)});
                    }
                }));
            }
        const result = await query.orderBy('sale.createdAt', 'DESC').getMany();

        return result.map(item => SaleMapper.toDomainEntity(item));
    }

    async findManyWithDetailsByIds(saleIds: bigint[]): Promise<SaleEntity[]> {
        if (saleIds.length === 0) {
            return [];
        }
        const results = await this.repository.find({
            where: {
                saleId: In(saleIds)
            },
            relations: {
                saleDetails: {
                    returns: true,
                },
            },
        });
        return results.map(item => SaleMapper.toDomainEntity(item));
    }

    // Metodo para guardar un metodo de pago y para actualizarla
    async save(entity: SaleEntity): Promise<SaleEntity> {
        try {
            let ormEntity = await this.repository.findOne({
                where: {saleId: entity.saleId},
            });

            if(ormEntity){
                ormEntity.customerId = entity.customerId;
                ormEntity.subTotalAmount = entity.subTotalAmount;
                ormEntity.discountAmount = entity.discountAmount;
                ormEntity.taxAmount = entity.taxAmount;
                ormEntity.totalAmount = entity.totalAmount;
                ormEntity.cashSessionId = entity.cashSessionId;
                ormEntity.inAmount = entity.inAmount;
                ormEntity.outAmount = entity.outAmount;
                ormEntity.paidAmount = entity.paidAmount;
                ormEntity.status = entity.status;
                ormEntity.notes = entity.notes;
                ormEntity.createdAt = entity.createdAt;
            } else {
                ormEntity = SaleMapper.toTypeOrmEntity(entity);
            }

            //* El repositorio transaccional se resuelve DENTRO del método (no en el constructor):
            //* así save() participa en el runInTransaction(...) que envuelve el descuento de
            //* inventario y el registro de pago en CalculateSaleUseCase, en vez de hacer commit
            //* inmediato e independiente (ver TypeormInventoryItemRepository.saveTransactional).
            const transactionRepository = this.transactionDB.getManager().getRepository(SaleOrmEntity);
            const savedOrmEntity = await transactionRepository.save(ormEntity);
            //* Relectura con el MISMO manager transaccional: una consulta por this.repository (otra
            //* conexión) no vería el UPDATE recién hecho hasta que la transacción haga commit.
            const currentSale = await this.transactionDB.getManager().findOne(SaleOrmEntity, {
                where: {
                    saleId: savedOrmEntity.saleId
                },
                relations: {
                    saleDetails: true
                }
            });
            return currentSale? SaleMapper.toDomainEntity(currentSale) :SaleMapper.toDomainEntity(savedOrmEntity);
        } catch (error) {
            throw error;
        }
    }

    async delete(entityId: bigint): Promise<SaleEntity | null> {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ormEntity = await queryRunner.manager.findOne(SaleOrmEntity, {
                where: { saleId: entityId },
            });

            if (!ormEntity) {
                throw new PaymentMethodNotFoundException('Venta no encontrada');
            }

            // Creacion y ejecución del script
            await queryRunner.manager.query(
                `update sale set deleted_at = now() 
                where sale_id=${entityId};`
            );
            await queryRunner.commitTransaction();

            return SaleMapper.toDomainEntity(ormEntity);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}