/**
 * Implementación del Repositorio de Producto usando TypeORM
 * Esta clase implementa el contrato (interface) ProductRepository
 * Se puede usar en Server Actions ya que no requiere inyección de dependencias
 */

import { Repository } from 'typeorm';
import { getDataSource } from '@/configuration/databases/typeorm/config/typeorm-connection';
import { ProductEntity } from '@/contexts/product-management/product1/domain/entities/product.entity';
import { ProductRepository } from '@/contexts/product-management/product1/domain/repositories/product.repository';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductMapper } from '@/contexts/product-management/product1/application/mappers/product.mapper';

/**
 * Repositorio TypeORM para Producto
 * Maneja la persistencia del Producto en PostgreSQL
 */
export class TypeOrmProductRepository implements ProductRepository {
  private productRepository: Repository<ProductOrmEntity>;

  constructor(private readonly repository: Repository<ProductOrmEntity>) {
    this.productRepository = repository;
  }

  /**
   * Crea una instancia del repositorio (factory)
   * Uso: const repo = await TypeOrmProductRepository.create();
   */
  static async create(): Promise<TypeOrmProductRepository> {
    const dataSource = await getDataSource();
    const repository = dataSource.getRepository(ProductOrmEntity);
    return new TypeOrmProductRepository(repository);
  }

  /**
   * Guarda una entidad de dominio (crear o actualizar)
   */
  async save(product: ProductEntity): Promise<ProductEntity> {
    const ormEntity = ProductMapper.toORM(product);
    const savedOrmEntity = await this.productRepository.save(ormEntity);
    return ProductMapper.toDomain(savedOrmEntity);
  }

  /**
   * Busca un producto por su ID
   */
  async findById(entityId: bigint): Promise<ProductEntity | null> {
    const ormEntity = await this.productRepository.findOne({
      where: { productId: entityId },
    });
    return ormEntity ? ProductMapper.toDomain(ormEntity) : null;
  }

  /**
   * Obtiene todos los productos
   */
  async findAll(): Promise<ProductEntity[]> {
    const ormEntities = await this.productRepository.find();
    return ProductMapper.toDomainList(ormEntities);
  }

  /**
   * Elimina un producto (soft delete)
   */
  async delete(entityId: bigint): Promise<ProductEntity | null> {
    const product = await this.findById(entityId);
    if (!product) {
      return null;
    }
    product.softDelete();
    return this.save(product);
  }

  /**
   * Encuentra un producto por establecimiento y SKU
   */
  async findByEstablishmentAndSku(
    establishmentId: bigint,
    sku: string
  ): Promise<ProductEntity | null> {
    const ormEntity = await this.productRepository.findOne({
      where: {
        establishmentId,
        sku,
      },
    });
    return ormEntity ? ProductMapper.toDomain(ormEntity) : null;
  }

  /**
   * Encuentra un producto por establecimiento y código de barras
   */
  async findByEstablishmentAndUniversalBarCode(
    establishmentId: bigint,
    barCode: string
  ): Promise<ProductEntity | null> {
    const ormEntity = await this.productRepository.findOne({
      where: {
        establishmentId,
        universalBarCode: barCode,
      },
    });
    return ormEntity ? ProductMapper.toDomain(ormEntity) : null;
  }

  /**
   * Guarda un producto con sus lotes e inventario (operación transaccional)
   * TODO: Implementar cuando estén disponibles Lot y Inventory
   */
  async saveProductWithLotAndInventoryItem(product: ProductEntity): Promise<ProductEntity> {
    // Por ahora, solo guarda el producto
    // Cuando estén disponibles Lot e Inventory, se puede mejorar
    return this.save(product);
  }

  /**
   * Encuentra un producto con todas sus relaciones
   * TODO: Implementar cuando estén disponibles las relaciones
   */
  async findByIdWithRelations(entityId: bigint): Promise<ProductEntity | null> {
    // Por ahora, igual que findById
    // Cuando estén disponibles las relaciones, se puede mejorar con leftJoinAndSelect
    return this.findById(entityId);
  }

  /**
   * Guarda un producto completo con todas sus relaciones
   * TODO: Implementar cuando estén disponibles las relaciones
   */
  async saveCompleteProduct(product: ProductEntity): Promise<ProductEntity> {
    // Por ahora, igual que save
    return this.save(product);
  }

  /**
   * Obtiene todos los productos por establecimiento
   */
  async findAllByEstablishment(establishmentId: bigint): Promise<ProductEntity[]> {
    const ormEntities = await this.productRepository.find({
      where: { establishmentId },
    });
    return ProductMapper.toDomainList(ormEntities);
  }

  /**
   * Obtiene todos los productos por sucursal
   * TODO: Completar cuando esté disponible la relación con BranchOffice
   */
  async findAllByBranchOffice(branchOfficeId: bigint): Promise<ProductEntity[]> {
    // Placeholder - se necesitaría una relación con BranchOffice
    return [];
  }
}
