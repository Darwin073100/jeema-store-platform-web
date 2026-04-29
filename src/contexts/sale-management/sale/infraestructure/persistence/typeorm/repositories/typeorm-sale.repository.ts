import { Brackets, DataSource, Repository } from "typeorm";
import { SaleOrmEntity } from "../entities/sale.orm-entity";
import { SaleMapper } from "../mappers/sale.mapper";
import { PaymentMethodNotFoundException } from "src/contexts/sale-management/payment-method/domain/exceptions/payment-method-not-found.exception";
import { SaleRepository } from "src/contexts/sale-management/sale/domain/repositories/sale.repository";
import { SaleEntity } from "src/contexts/sale-management/sale/domain/entities/sale.entity";
import { TransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/domain/repositories/transaction-db-repository";
import { getDataSource } from "@/configuration/databases/typeorm/config";
import { TypeormTransactionDBRepository } from "@/configuration/databases/typeorm/transaction-db/infraestructure/repositories/TypeormTransactionDBRepository";

export class TypeormSaleRepository implements SaleRepository{
    private readonly typeormRepository: Repository<SaleOrmEntity>;
    constructor(
        private readonly datasource: DataSource,
        private readonly transactionDB: TransactionDBRepository
    ){
        this.typeormRepository = this.transactionDB.getManager().getRepository(SaleOrmEntity);
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
        const ormEntity = await this.typeormRepository.findOne({
            where: {
                saleId: saleId
            },
            relations:{
                saleDetails: true,
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return SaleMapper.toDomainEntity(ormEntity);
    }
    async findFinishSaleById(saleId: bigint): Promise<SaleEntity | null> {
        const ormEntity = await this.typeormRepository.findOne({
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
                    paymentMethod: true
                },
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return SaleMapper.toDomainEntity(ormEntity);
    }
    async findSaleTicketById(saleId: bigint): Promise<SaleEntity | null> {
        const ormEntity = await this.typeormRepository.findOne({
            where: {
                saleId: saleId
            },
            relations:{
                saleDetails: true,
                customer: true,
                employee: true,
                salePayments: {
                    paymentMethod: true
                },
                branchOffice:{
                    address: true,
                    establishment: true
                }
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return SaleMapper.toDomainEntity(ormEntity);
    }


    async existById(saleId: bigint): Promise<boolean> {
        return await this.typeormRepository.existsBy({
            saleId
        });    
    }

    async findAll(): Promise<SaleEntity[]> {
        const result = await this.typeormRepository.find({
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
        const result = await this.typeormRepository.find({
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
        const query = await this.typeormRepository.createQueryBuilder('sale')
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
                query.andWhere(new Brackets((qb)=>{
                    qb.where('employee.firstName ILIKE :textSearch', {textSearch: `%${search}%`})
                    .orWhere('employee.lastName ILIKE :textSearch', {textSearch: `%${search}%`})
                    .orWhere('customer.firstName ILIKE :textSearch', {textSearch: `%${search}%`})
                    .orWhere('customer.lastName ILIKE :textSearch', {textSearch: `%${search}%`})
                    // .orWhere('sale.saleId = :numSearch', {numSearch: BigInt(search)})
                }));
            }
        const result = await query.orderBy('sale.createdAt', 'DESC').getMany();

        return result.map(item => SaleMapper.toDomainEntity(item));
    }

    // Metodo para guardar un metodo de pago y para actualizarla
    async save(entity: SaleEntity): Promise<SaleEntity> {
        try {
            let ormEntity = await this.typeormRepository.findOne({
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
                ormEntity.status = entity.status;
                ormEntity.notes = entity.notes;
                ormEntity.createdAt = entity.createdAt;
            } else {
                ormEntity = SaleMapper.toTypeOrmEntity(entity);
            }

            const savedOrmEntity = await this.typeormRepository.save(ormEntity);
            const currentSale = await this.typeormRepository.findOne({
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