import { DataSource, QueryFailedError, Repository } from "typeorm";
import { PaymentMethodOrmEntity } from "../entities/payment-method.orm-entity";
import { PaymentMethodMapper } from "../mappers/payment-method.mapper";
import { PaymentMethodRepository } from "src/contexts/sale-management/payment-method/domain/repositories/payment-method.repository";
import { PaymentMethodEntity } from "src/contexts/sale-management/payment-method/domain/entities/payment-method-entity";
import { PaymentMethodAlreadyExistsException } from "src/contexts/sale-management/payment-method/domain/exceptions/payment-method-already-exists.exception";
import { PaymentMethodNotFoundException } from "src/contexts/sale-management/payment-method/domain/exceptions/payment-method-not-found.exception";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormPaymentMethodRepository implements PaymentMethodRepository{
    private readonly typeormRepository: Repository<PaymentMethodOrmEntity>;
    constructor( private readonly datasource: DataSource ){
        this.typeormRepository = this.datasource.getRepository(PaymentMethodOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormPaymentMethodRepository> {
        const dataSource = await getDataSource();
        return new TypeormPaymentMethodRepository(dataSource);
    }
    async findById(categoryId: bigint): Promise<PaymentMethodEntity | null> {
        const ormEntity = await this.typeormRepository.findOne({
            where: {
                paymentMethodId: categoryId
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return PaymentMethodMapper.toDomainEntity(ormEntity);
    }
    async existById(entityId: bigint): Promise<PaymentMethodEntity | null> {
        const ormEntity = await this.typeormRepository.findOne({
            where: {
                paymentMethodId: entityId
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return PaymentMethodMapper.toDomainEntity(ormEntity);
    }

    async findAll(): Promise<PaymentMethodEntity[]> {
        try {
            const result = await this.datasource.manager.find(PaymentMethodOrmEntity);
            const categoryList = result.map(item => PaymentMethodMapper.toDomainEntity(item));
            return categoryList;
        } catch (error) {
            throw error;
        }
    }

    // Metodo para guardar un metodo de pago y para actualizarla
    async save(entity: PaymentMethodEntity): Promise<PaymentMethodEntity> {
        try {
            let ormEntity = await this.typeormRepository.findOne({
                where: {paymentMethodId: entity.paymentMethodId},
            });

            if(ormEntity){
                ormEntity.name = entity.name.name;
                ormEntity.requiresReference = entity.requiresReference;
                ormEntity.updatedAt = entity.updatedAt;
                ormEntity.deletedAt = entity.deletedAt;
            } else {
                ormEntity = PaymentMethodMapper.toTypeOrmEntity(entity);
            }

            const savedOrmEntity = await this.typeormRepository.save(ormEntity);

            return PaymentMethodMapper.toDomainEntity(savedOrmEntity);
        } catch (error) {
            if(error instanceof QueryFailedError){
                const pgError = error as any;
                if(pgError.code === '23505'){
                    throw new PaymentMethodAlreadyExistsException('Ya existe un metodo de pago con ese nombre.');
                }
            }
            throw error;
        }
    }

    async delete(entityId: bigint): Promise<PaymentMethodEntity | null> {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ormEntity = await queryRunner.manager.findOne(PaymentMethodOrmEntity, {
                where: { paymentMethodId: entityId },
            });

            if (!ormEntity) {
                throw new PaymentMethodNotFoundException('metodo de pago no encontrada');
            }

            // Creacion y ejecución del script
            await queryRunner.manager.query(
                `update payment_method set deleted_at = now() 
                where payment_method_id=${entityId};`
            );
            await queryRunner.commitTransaction();

            return PaymentMethodMapper.toDomainEntity(ormEntity);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}