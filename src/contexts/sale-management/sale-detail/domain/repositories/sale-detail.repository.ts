import { TemplateRepository } from "src/shared/domain/repositories/template.repository";
import { SaleDetailEntity } from "../entities/sale-detail.entity";

export const SALE_DETAIL_REPOSITORY = Symbol('SALE_DETAIL_REPOSITORY');

export interface SaleDetailRepository extends TemplateRepository<SaleDetailEntity>{
    findByBarCode(saleId: bigint, barCode: string):Promise<SaleDetailEntity|null>;
    physicalDelete(entityId: bigint): Promise<SaleDetailEntity | null>;
    /**
     * Modificar la cantidad de producto en una venta
     * @param {bigint} detailId 
     * @param {number} quantity 
     * @returns {Promise<SaleDetailEntity | null>}
     */
    modifyQuantity(detailId: bigint, quantity: number):Promise<SaleDetailEntity | null>;
    existById(entityId: bigint): Promise<boolean>;
    /**
     * Detalles de venta de un producto, solo de ventas completadas, opcionalmente acotado por fecha
     * @param {bigint} productId
     * @param {Date} [dateInit]
     * @param {Date} [dateFinish]
     * @returns {Promise<SaleDetailEntity[]>}
     */
    findAllByProductId(productId: bigint, dateInit?: Date, dateFinish?: Date): Promise<SaleDetailEntity[]>;
}