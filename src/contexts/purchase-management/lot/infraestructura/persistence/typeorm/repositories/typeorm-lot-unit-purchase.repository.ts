import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LotUnitPurchaseOrmEntity } from "../entities/lot-unit-purchase.orm-entity";
import { LotUnitPurchaseRepository } from "src/contexts/purchase-management/lot/domain/repositories/lot-unit-purchase.repository";
import { LotUnitPurchaseEntity } from "src/contexts/purchase-management/lot/domain/entities/lot-unit-purchase.entity";
import { LotUnitPurchaseMapper } from "../mappers/lot-unit-purchase.mapper";
import { LotAlreadyExistsException } from "src/contexts/purchase-management/lot/domain/exceptions/lot-already-exists.exception";
import { LotNotFoundException } from "src/contexts/purchase-management/lot/domain/exceptions/lot-not-found.exception";

@Injectable()
export class TypeormLotUnitPurchaseRepository implements LotUnitPurchaseRepository{
    private readonly repository: Repository<LotUnitPurchaseOrmEntity>;

    constructor(
        private readonly datasource: DataSource
    ){
        this.repository = this.datasource.getRepository(LotUnitPurchaseOrmEntity)
    }

    /**
     * - Este metodo Crea un registro de compra de unidad de lote 
     * - En caso de encontrar una unidad de lote existente, se actualiza
     * @param {LotUnitPurchaseEntity} entity - Entidad de compra de unidad de lote
     * @returns {Promise<LotUnitPurchaseEntity>} - Entidad de compra de unidad de lote guardada
     */
    async save(entity: LotUnitPurchaseEntity): Promise<LotUnitPurchaseEntity> {
        try {
            // Verificar si existe una unidad de lote por el id
            let existLotUnitPurchase = await this.repository.findOne({
                where:{
                    lotUnitPurchaseId: entity.lotUnitPurchaseId,
                 lotId: entity.lotId
               }
            });
            
            
            // Verifica que si se haya encontrado la unidad del lote para actualizarlo, caso contrario lo crea
            if(existLotUnitPurchase){
                existLotUnitPurchase.purchasePrice = entity.purchasePrice.value;
                existLotUnitPurchase.purchaseQuantity = entity.purchaseQuantity.value;
                existLotUnitPurchase.unit = entity.unit;
                existLotUnitPurchase.unitsInPurchaseUnit = entity.unitsInPurchaseUnit.value;
                
                const updateResult = await this.repository.save(existLotUnitPurchase);
                return LotUnitPurchaseMapper.toDomain(updateResult); 
            }

            const existLotUnitPurchaseWithUNit = await this.repository.exists({where:{
                unit: entity.unit,
                lotId: entity.lotId
            }});

            if(existLotUnitPurchaseWithUNit){
               throw new LotAlreadyExistsException('Ya existe una unidad de lote con la misma unidad.'); 
            }

            const ormEntity = LotUnitPurchaseMapper.toOrmEntity(entity);
            const saveResult = await this.repository.save(ormEntity);
            return LotUnitPurchaseMapper.toDomain(saveResult); 
        } catch (error) {
            throw error;
        }
    }
    findById(entityId: bigint): Promise<LotUnitPurchaseEntity | null> {
        throw new Error('This method is not implements');
    }
    
    async findAll(): Promise<[] | LotUnitPurchaseEntity[]> {
        const result = await this.repository.find();
        return result.map(LotUnitPurchaseMapper.toDomain);
    }

    /**
     * Metodología de eliminacion: Soft Delete
     * Elimina una entidad de compra de unidad de lote por su ID
     * @param {bigint} entityId 
     * @returns {Promise<LotUnitPurchaseEntity | null>}
     */
    async delete(entityId: bigint): Promise<LotUnitPurchaseEntity | null> {
        let existLotUnitPurchase = await this.repository.findOneBy({
            lotUnitPurchaseId: entityId
        });

        if (!existLotUnitPurchase) {
            throw new LotNotFoundException('La unidad no fue encontrada.');
        }

        await this.repository.query(`UPDATE lot_unit_purchase SET deleted_at = NOW() WHERE lot_unit_purchase_id = ${entityId};`);
        return LotUnitPurchaseMapper.toDomain(existLotUnitPurchase);
    }
}