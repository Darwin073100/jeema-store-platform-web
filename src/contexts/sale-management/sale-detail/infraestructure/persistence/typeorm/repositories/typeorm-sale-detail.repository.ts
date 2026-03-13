import { Injectable } from "@nestjs/common";
import { SaleDetailEntity } from "src/contexts/sale-management/sale-detail/domain/entities/sale-detail.entity";
import { SaleDetailRepository } from "src/contexts/sale-management/sale-detail/domain/repositories/sale-detail.repository";
import { DataSource, Repository } from "typeorm";
import { SaleDetailOrmEntity } from "../entities/sale-detail.orm-entity";
import { SaleDetailMapper } from "../mappers/sale-detail.mapper";
import { SaleNotFoundException } from "src/contexts/sale-management/sale/domain/exceptions/sale-not-found.exception";

@Injectable()
export class TypeormSaleDetailRepository implements SaleDetailRepository {
    private readonly repository: Repository<SaleDetailOrmEntity>;

    constructor(private readonly datasource: DataSource) {
        this.repository = this.datasource.getRepository(SaleDetailOrmEntity);
    }

    async save(entity: SaleDetailEntity): Promise<SaleDetailEntity> {
        try {
            let saleDetailExists = await this.repository.findOne({
                where: {
                    saleDetailId: entity.saleDetailId
                }
            });

            if (saleDetailExists) {
                saleDetailExists = {
                    ...saleDetailExists,
                    productBarCodeAtSale: entity.productBarCodeAtSale,
                    productNameAtSale: entity.productNameAtSale,
                    productUnitAtSale: entity.productUnitAtSale,
                    quantity: entity.quantity,
                    unitPriceAtSale: entity.unitPriceAtSale,
                    regularPriceAtSale: entity.regularPriceAtSale,
                    discountItem: entity.discountItem,
                    saleFor: entity.saleFor,
                    subtotalItem: entity.subtotalItem,
                    notes: entity.notes,
                    productBrandAtSale: entity.productBrandAtSale,
                    productCategoryAtSale: entity.productCategoryAtSale,
                    productDescriptionAtSale: entity.productDescriptionAtSale,
                }
                const updateResult = await this.repository.save(saleDetailExists);
                return SaleDetailMapper.toDomainEntity(updateResult);
            }

            const ormEntity = SaleDetailMapper.toOrmEntity(entity);
            const result = await this.repository.save(ormEntity);
            return SaleDetailMapper.toDomainEntity(result);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Buasca un detalle de venta por el codigo de barra del producto, sin importar mayuscula o minuscula
     * @param saleId 
     * @param barCode 
     * @returns 
     */
    async findByBarCode(saleId: bigint, barCode: string): Promise<SaleDetailEntity | null> {
        try {
            const result = await this.repository
                .createQueryBuilder('saleDetail')
                .where(`LOWER(saleDetail.productBarCodeAtSale) = LOWER(:barCode)`, {barCode})
                .andWhere('saleDetail.saleId = :saleId', {saleId})
                .getOne();
            
            if( !result ) return Promise.resolve(null);

            return Promise.resolve(SaleDetailMapper.toDomainEntity(result));

        } catch (error) {
            throw error;
        }
    }
    
    async modifyQuantity(detailId: bigint, quantity: number): Promise<SaleDetailEntity | null> {
        try {
            let detailExist = await this.repository.findOneBy({
                saleDetailId: detailId 
            });
            
            if(!detailExist){
                throw new SaleNotFoundException(`No existe el detalle de venta con id ${detailId}`);
            }

            detailExist = {
                ...detailExist,
                quantity
            }

            const result = await this.repository.save(detailExist);
            return SaleDetailMapper.toDomainEntity(result);
        } catch (error) {
            return error;
        }
    }

    async findById(entityId: bigint): Promise<SaleDetailEntity | null> {
        const result = await this.repository.findOneBy({saleDetailId: entityId});
        return result? SaleDetailMapper.toDomainEntity(result): null;
    }
    async existById(entityId: bigint): Promise<boolean> {
        return await this.repository.existsBy({ saleDetailId: entityId});
    }

    async findAll(): Promise<[] | SaleDetailEntity[]> {
        const result = await this.repository.find();
        const domainEntities = result.map(item => SaleDetailMapper.toDomainEntity(item));
        return domainEntities;
    }
    async delete(entityId: bigint): Promise<SaleDetailEntity | null> {
        let entityExist = await this.repository.findOne({
            where: {
                saleDetailId: entityId
            }
        }); 
        if(!entityExist){
            return Promise.resolve(null);
        }
        
        await this.repository.query(`UPDATE sale_detail SET delete_at=NOW() WHERE(sale_detail_id=${entityId});`);

        return SaleDetailMapper.toDomainEntity(entityExist);
    }

    async physicalDelete(entityId: bigint): Promise<SaleDetailEntity | null> {
        let entityExist = await this.repository.findOne({
            where: {
                saleDetailId: entityId
            }
        }); 
        if(!entityExist){
            return Promise.resolve(null);
        }
        
        await this.repository.query(`DELETE FROM sale_detail WHERE(sale_detail_id=${entityId});`);

        return SaleDetailMapper.toDomainEntity(entityExist);
    }

}