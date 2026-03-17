import { CategoryEntity } from "src/contexts/product-management/category/domain/entities/category-entity";
import { CategoryRepository } from "src/contexts/product-management/category/domain/repositories/category.repository";
import { DataSource, QueryFailedError, Repository } from "typeorm";
import { CategoryOrmEntity } from "../entities/category.orm-entity";
import { CategoryMapper } from "../mappers/category.mapper";
import { CategoryAlreadyExistsException } from "src/contexts/product-management/category/domain/exceptions/category-already-exists.exception";
import { CategoryNotFoundException } from "src/contexts/product-management/category/domain/exceptions/category-not-found.exception";
import { getDataSource } from "@/configuration/databases/typeorm/config";

export class TypeormCategoryRepository implements CategoryRepository{
    private readonly typeormRepository: Repository<CategoryOrmEntity>;
    constructor(
        readonly datasource: DataSource,
    ){
        this.typeormRepository = this.datasource.getRepository(CategoryOrmEntity);
    }

    /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmAgregadoRepository.create();
     */
    static async create(): Promise<TypeormCategoryRepository> {
        const dataSource = await getDataSource();
        return new TypeormCategoryRepository(dataSource);
    }
    
    async findById(categoryId: bigint): Promise<CategoryEntity | null> {
        const ormEntity = await this.typeormRepository.findOne({
            where: {
                categoryId: categoryId
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return CategoryMapper.toDomainEntity(ormEntity);
    }
    async existById(categoryId: bigint): Promise<CategoryEntity | null> {
        const ormEntity = await this.typeormRepository.findOne({
            where: {
                categoryId: categoryId
            },
        });
        if (!ormEntity) {
            return Promise.resolve(null);
        }
        return CategoryMapper.toDomainEntity(ormEntity);
    }

    async findAll(): Promise<CategoryEntity[]> {
        const result = await this.typeormRepository.find({
            where:{
                deletedAt: undefined
            },
            order: {
                name: 'ASC'
            }
        });
        const categoryList = result.map(item => CategoryMapper.toDomainEntity(item));
        return categoryList;
    }

    // Metodo para guardar una categoría y para actualizarla
    async save(entity: CategoryEntity): Promise<CategoryEntity> {
        try {
            let ormEntity = await this.typeormRepository.findOne({
                where: {categoryId: entity.categoryId},
            });

            if(ormEntity){
                ormEntity.name = entity.name;
                ormEntity.description = entity.description;
                ormEntity.updatedAt = entity.updatedAt;
                ormEntity.deletedAt = entity.deletedAt;
            } else {
                ormEntity = CategoryMapper.toTypeOrmEntity(entity);
            }

            const savedOrmEntity = await this.typeormRepository.save(ormEntity);

            return CategoryMapper.toDomainEntity(savedOrmEntity);
        } catch (error) {
            if(error instanceof QueryFailedError){
                const pgError = error as any;
                if(pgError.code === '23505'){
                    throw new CategoryAlreadyExistsException('Ya existe una categoría con ese nombre.');
                }
            }
            throw error;
        }
    }

    async delete(entityId: bigint): Promise<CategoryEntity | null> {
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const ormEntity = await queryRunner.manager.findOne(CategoryOrmEntity, {
                where: { categoryId: entityId },
            });

            if (!ormEntity) {
                throw new CategoryNotFoundException('Categoría no encontrada');
            }

            // Creacion y ejecución del script
            await queryRunner.manager.query(
                `update category set deleted_at = now() 
                where category_id=${entityId};`
            );
            await queryRunner.commitTransaction();

            return CategoryMapper.toDomainEntity(ormEntity);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async findAllByEstablishment(establishmentId: bigint): Promise<CategoryEntity[]> {
        const result = await this.typeormRepository.find({
          where: {
            establishmentId,
          },
          order: {
            name: 'ASC'
          }
        });
        const categories = result.map(item => CategoryMapper.toDomainEntity(item));
        return categories;
    }
}