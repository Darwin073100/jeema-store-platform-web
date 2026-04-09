import { Brackets, DataSource, Like, QueryFailedError, Repository } from 'typeorm';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductTypeOrmMapper } from '../mappers/product.mapper';
import { ProductRepository } from 'src/contexts/product-management/product/domain/repositories/product.repository';
import { ProductEntity } from 'src/contexts/product-management/product/domain/entities/product.entity';
import { LotOrmEntity } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot.orm-entity';
import { InventoryOrmEntity } from 'src/contexts/inventory-management/inventory/infraestructure/persistence/typeorm/entities/inventory.orm-entity';
import { ProductValidateException } from 'src/contexts/product-management/product/domain/exceptions/product-validate.exception';
import { LotAlreadyExistsException } from 'src/contexts/purchase-management/lot/domain/exceptions/lot-already-exists.exception';
import { LotUnitPurchaseOrmEntity } from 'src/contexts/purchase-management/lot/infraestructura/persistence/typeorm/entities/lot-unit-purchase.orm-entity';
import { ProductNotFoundException } from 'src/contexts/product-management/product/domain/exceptions/product-not-found.exception';
import { InventoryItemOrmEntity } from 'src/contexts/inventory-management/inventory-item/infraestructure/persistence/typeorm/entities/inventory-item.orm-entity';
import { SaleStatusEnum } from 'src/contexts/sale-management/sale/domain/enums/sale-status.enum';
import { getDataSource } from '@/configuration/databases/typeorm/config';
import { PaginationDTO } from '@/shared/application/dtos/pagination.dto';
import { typeormPagination } from '@/shared/infrastructure/typeorm/typeorm-pagination';
import { FilterProductListDTO } from '@/contexts/product-management/product/application/dtos/filter-product-list.dto';

export class TypeOrmProductRepository implements ProductRepository {
  private readonly productRepository: Repository<ProductOrmEntity>;

  constructor(
    private readonly datasource: DataSource
  ) {
    this.productRepository = this.datasource.getRepository(ProductOrmEntity);
  }
   /**
     * Crea una instancia del repositorio (factory)
     * Uso: const repo = await TypeOrmProductRepository.create();
     */
    static async create(): Promise<TypeOrmProductRepository> {
      const dataSource = await getDataSource();
      return new TypeOrmProductRepository(dataSource);
    }

  async findByEstablishmentAndSku(establishmentId: bigint, sku: string): Promise<ProductEntity | null> {
    const orm = await this.productRepository.findOne({ where: { establishmentId: establishmentId, sku } });
    return orm ? ProductTypeOrmMapper.toDomain(orm) : null;
  }

  async findByEstablishmentAndUniversalBarCode(establishmentId: bigint, barCode: string): Promise<ProductEntity | null> {
    const orm = await this.productRepository.findOne({ where: { establishmentId: establishmentId, universalBarCode: barCode } });
    return orm ? ProductTypeOrmMapper.toDomain(orm) : null;
  }

  async saveProductWithLotAdnInventoryItem(product: ProductEntity): Promise<ProductEntity> {
    let productOrm = ProductTypeOrmMapper.toOrm(product);
    let lotOrm = productOrm.lots ? productOrm.lots[0] : undefined;
    let inventoryOrm = productOrm.inventory ? productOrm.inventory : null;
    let inventoryItemOrm = inventoryOrm?.inventoryItems ? inventoryOrm.inventoryItems : undefined;
    // let inventoryItemOrm = lotOrm?.inventoryItems ? lotOrm.inventoryItems[0] : undefined;
    let lotUnitPurchaseOrm = lotOrm?.lotUnitPurchases;

    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Guarda el producto
      productOrm = {
        ...productOrm,
        lots: undefined,
        inventory: undefined,
      }
      let savedProduct = await queryRunner.manager.save(ProductOrmEntity, productOrm);

      // Guarda los lots y les asigna el producto guardado
      if (lotOrm) {
        lotOrm = {
          ...lotOrm,
          productId: savedProduct.productId,
          product: null,
          lotUnitPurchases: null,
        }
        let savedLot = await queryRunner.manager.save(LotOrmEntity, lotOrm);
        if (lotUnitPurchaseOrm && lotUnitPurchaseOrm.length > 0) {
          // verificar que no vengan repetidos los unidades de compra, 
          // lanzar un error si es así y hacer rollback de la transacción
          const uniqueUnits = new Set();
          for (const item of lotUnitPurchaseOrm) {
            if (uniqueUnits.has(item.unit)) {
              throw new LotAlreadyExistsException('Las unidades de compra no pueden estar duplicadas');
            }
            uniqueUnits.add(item.lotUnitPurchaseId);
          }
          // Asignar lotId a cada lotUnitPurchase
          lotUnitPurchaseOrm.forEach(item => {
            item.lotId = savedLot.lotId;
          });
          let savedLotUnitPurchase = await queryRunner.manager.save(LotUnitPurchaseOrmEntity, lotUnitPurchaseOrm);
          savedLot = {
            ...savedLot,
            lotUnitPurchases: savedLotUnitPurchase,
          }
        }

        // Guarda los inventoryItems de cada lot, asignando el lot y el producto guardados
        if (inventoryOrm) {
          inventoryOrm = {
            ...inventoryOrm,
            productId: savedLot.productId,
            product: undefined,
            inventoryItems: undefined
          };
          let savedInventory = await queryRunner.manager.save(InventoryOrmEntity, inventoryOrm);
          if (inventoryItemOrm && inventoryItemOrm.length > 0) {
            // verificar que no vengan repetidas las locations, 
            // lanzar un error si es así y hacer rollback de la transacción
            const uniqueLocations = new Set();
            for (const item of inventoryItemOrm) {
              if (uniqueLocations.has(item.location)) {
                throw new ProductValidateException('Las ubicaciones de inventario no pueden estar duplicadas');
              }
              uniqueLocations.add(item.location);
            }
            // Asignar inventoryId a cada inventoryItem
            inventoryItemOrm.forEach(item => {
              item.inventoryId = savedInventory.inventoryId;
            });
            const savedInventoryItem = await queryRunner.manager.save(InventoryItemOrmEntity, inventoryItemOrm);
            savedInventory = {
              ...savedInventory,
              product: savedProduct,
              inventoryItems: savedInventoryItem
            }
          } else {
            throw new ProductValidateException(`Producto no registrado, Error en los datos de item del inventario.`);
          }
        } else {
          throw new ProductValidateException(`Producto no registrado, Error en los datos de inventario.`);
        }
      } else {
        throw new ProductValidateException(`Producto no registrado, Error en los datos del lote.`);
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return ProductTypeOrmMapper.toDomain(savedProduct);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if (error instanceof QueryFailedError) {

        // ...removed console.log...
        throw new ProductValidateException(`Producto no registrado, verifica los datos ingresados.`);
      }
      throw error;
    }
  }
  async saveCompleteProduct(product: ProductEntity): Promise<ProductEntity> {
    let productOrm = ProductTypeOrmMapper.toOrm(product);
    let lotOrm = productOrm.lots ? productOrm.lots[0] : undefined;
    let inventoryOrm = productOrm.inventory ? productOrm.inventory : undefined;
    let inventoryItemOrm = inventoryOrm?.inventoryItems ? inventoryOrm.inventoryItems : undefined;
    let lotUnitPurchaseOrm = lotOrm?.lotUnitPurchases;

    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Guarda el producto
      productOrm = {
        ...productOrm,
        lots: undefined,
        inventory: undefined,
      }
      let savedProduct = await queryRunner.manager.save(ProductOrmEntity, productOrm);

      // Guarda los lots y les asigna el producto guardado
      if (lotOrm) {
        lotOrm = {
          ...lotOrm,
          productId: savedProduct.productId,
          product: null,
          lotUnitPurchases: null,
        }
        let savedLot = await queryRunner.manager.save(LotOrmEntity, lotOrm);
        if (lotUnitPurchaseOrm && lotUnitPurchaseOrm.length > 0) {
          // verificar que no vengan repetidos los unidades de compra, 
          // lanzar un error si es así y hacer rollback de la transacción
          const uniqueUnits = new Set();
          for (const item of lotUnitPurchaseOrm) {
            if (uniqueUnits.has(item.unit)) {
              throw new LotAlreadyExistsException('Las unidades de compra no pueden estar duplicadas');
            }
            uniqueUnits.add(item.lotUnitPurchaseId);
          }
          // Asignar lotId a cada lotUnitPurchase
          lotUnitPurchaseOrm.forEach(item => {
            item.lotId = savedLot.lotId;
          });
          let savedLotUnitPurchase = await queryRunner.manager.save(LotUnitPurchaseOrmEntity, lotUnitPurchaseOrm);
          savedLot = {
            ...savedLot,
            lotUnitPurchases: savedLotUnitPurchase,
          }
        }

      }
      // Guarda los inventoryItems de cada lot, asignando el lot y el producto guardados
      if (inventoryOrm) {
        inventoryOrm = {
          ...inventoryOrm,
          productId: savedProduct.productId,
          product: undefined,
          inventoryItems: undefined
        };
        let savedInventory = await queryRunner.manager.save(InventoryOrmEntity, inventoryOrm);
        if (inventoryItemOrm && inventoryItemOrm.length > 0) {
          // verificar que no vengan repetidas las locations, 
          // lanzar un error si es así y hacer rollback de la transacción
          const uniqueLocations = new Set();
          for (const item of inventoryItemOrm) {
            if (uniqueLocations.has(item.location)) {
              throw new ProductValidateException('Las ubicaciones de inventario no pueden estar duplicadas');
            }
            uniqueLocations.add(item.location);
          }
          // Asignar inventoryId a cada inventoryItem
          inventoryItemOrm.forEach(item => {
            item.inventoryId = savedInventory.inventoryId;
          });
          const savedInventoryItem = await queryRunner.manager.save(InventoryItemOrmEntity, inventoryItemOrm);
          savedInventory = {
            ...savedInventory,
            product: savedProduct,
            inventoryItems: savedInventoryItem
          }
        }
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return ProductTypeOrmMapper.toDomain(savedProduct);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      if (error instanceof QueryFailedError) {

        // ...removed console.log...
        throw new ProductValidateException(`Producto no registrado, verifica los datos ingresados.`);
      }
      throw error;
    }
  }

  // Metodo para guardar un producto y actualizarlo
  async save(product: ProductEntity): Promise<ProductEntity> {
    try {
      const productExisting = await this.productRepository.findOne({
        where: { productId: product.productId },
      });
      if (productExisting) {
        productExisting.name = product.name.value;
        productExisting.brandId = product.brandId;
        productExisting.categoryId = product.categoryId;
        productExisting.seasonId = product.seasonId;
        productExisting.description = product.description?.value;
        productExisting.sku = product.sku.value;
        productExisting.universalBarCode = product.universalBarCode?.value;
        productExisting.unitOfMeasure = product.unitOfMeasure;
        productExisting.minStockGlobal = product.minStockGlobal.toString();

        const result = await this.productRepository.save(productExisting);
        return ProductTypeOrmMapper.toDomain(result);
      }
      const ormEntity = ProductTypeOrmMapper.toOrm(product);
      const result = await this.productRepository.save(ormEntity);
      return ProductTypeOrmMapper.toDomain(result);

    } catch (error) {
      throw error;
    }
  }

  async delete(entityId: bigint): Promise<ProductEntity | null> {
    const queryRunner = await this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const product = await queryRunner.manager.findOne(ProductOrmEntity, {
        where: { productId: entityId },
      });

      if (!product) {
        throw new ProductNotFoundException('El producto que buscas no existe');
      }

      await queryRunner.manager.query(`UPDATE product SET deleted_at = NOW() WHERE product_id = ${entityId}`);
      await queryRunner.commitTransaction();
      return ProductTypeOrmMapper.toDomain(product);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<[] | ProductEntity[]> {
    const result = await this.productRepository.find({
      relations: ['establishment', 'category', 'brand', 'season', 'lots', 'inventory.inventoryItems']
    });

    if (result.length > 0) {
      return result.map((orm) => ProductTypeOrmMapper.toDomain(orm));
    }

    return Promise.resolve([]);
  }
  async findAllByEstablishment(establishmentId: bigint, dto: PaginationDTO): Promise<ProductEntity[]> {
    const { skip, take } = typeormPagination(dto.page, dto.pageSize);
    const result = await this.productRepository.find({
      where: {
        establishmentId,
      },
      skip,
      take,
      relations: ['category', 'brand', 'season', 'inventory.inventoryItems']
    });
    return result.map((orm) => ProductTypeOrmMapper.toDomain(orm));
  }
  async findAllByEstablishmentAndName(
  establishmentId: bigint, 
  dto: FilterProductListDTO
): Promise<ProductEntity[]> {
  
  const query = this.productRepository.createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .leftJoinAndSelect('product.brand', 'brand')
    .leftJoinAndSelect('product.season', 'season')
    .leftJoinAndSelect('product.inventory', 'inventory')
    .leftJoinAndSelect('inventory.inventoryItems', 'inventoryItems')
    .where('product.establishmentId = :establishmentId', { establishmentId });

  // 1. Filtrado por Nombre (Insensible a mayúsculas)
  if (dto.product) {
    query.andWhere('product.name ILIKE :name', { name: `%${dto.product}%` });
  }

  // 2. Filtrado por Categoría
  if (dto.category) {
    query.andWhere('category.name ILIKE :categoryName', { categoryName: `%${dto.category}%` });
  }

  // 3. Filtrado por Códigos (Lógica OR: si coincide con interno O universal)
  if (dto.internalBarcode || dto.universalBarcode) {
    query.andWhere(
      new Brackets((qb) => {
        qb.where('inventory.internalBarCode ILIKE :barcode', { barcode: `%${dto.internalBarcode}%` })
          .orWhere('product.universalBarCode ILIKE :barcode', { barcode: `%${dto.universalBarcode}%` });
      }),
    );
  }

  const result = await query.getMany();
  
  return result.map((orm) => ProductTypeOrmMapper.toDomain(orm));
}
  // async findAllByEstablishmentAndName(establishmentId: bigint, dto: FilterProductListDTO): Promise<ProductEntity[]> {
  //   const result = await this.productRepository.find({
  //     where: {
  //       establishmentId,
  //       name: dto.product? Like(`%${dto.product}%`): undefined,
  //       category: {
  //         name: dto.category? Like(`%${dto.category}%`): undefined,
  //       },
  //       inventory: {
  //         internalBarCode: dto.internalBarcode? Like(`%${dto.internalBarcode}%`): undefined,
  //       },
  //       universalBarCode: dto.internalBarcode? Like(`%${dto.internalBarcode}%`): undefined,
  //     },
  //     relations: ['category', 'brand', 'season', 'inventory.inventoryItems']
  //   });
  //   return result.map((orm) => ProductTypeOrmMapper.toDomain(orm));
  // }
  async findAllByBranchOffice(branchOfficeId: bigint): Promise<ProductEntity[]> {
    const result = await this.productRepository.find({
      where: {
        establishment: {
          branchOffices: {
            branchOfficeId,
          },
        },
        saleDetails: {
          sale: {
            status: SaleStatusEnum.COMPLETED,
          },
        },
      },
      // Cargamos las relaciones necesarias (incluyendo lots) para poder ordenarlas en memoria
      relations: ['saleDetails'],
    });

    return result.map((orm) => ProductTypeOrmMapper.toDomain(orm));
  }

  async findById(entityId: bigint): Promise<ProductEntity | null> {
    try {
      const result = await this.productRepository.findOne({
        where: { productId: entityId },
        relations: ['establishment', 'category', 'brand', 'season', 'lots','lots.lotUnitPurchases','lots.suplier', 'lots.suplier.address', 'inventory.inventoryItems'],
      });

      if (!result) {
        throw new ProductNotFoundException('El producto que buscas no existe');
      }

      return ProductTypeOrmMapper.toDomain(result);;
    } catch (error) {
      throw error;
    }
  }

  async existById(productId: bigint):Promise<ProductEntity | null>{
    const result = await this.productRepository.findOneBy({ productId });
    return result? ProductTypeOrmMapper.toDomain(result): null
  }
  async findByIdCategoryBrandSeason(entityId: bigint): Promise<ProductEntity | null> {
    try {
      const result = await this.productRepository.findOne({
        where: { productId: entityId },
        relations: [ 'category', 'brand', 'season' ],
      });

      if (!result) {
        throw new ProductNotFoundException('El producto que buscas no existe');
      }

      return ProductTypeOrmMapper.toDomain(result);;
    } catch (error) {
      throw error;
    }
  }
}
