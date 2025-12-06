import { Result } from "@/shared/features/result";
import { SaleEntity } from "../entities/sale-entity";
import { ErrorEntity } from "@/shared/features/error.entity";
import { RegisterSaleDto } from "../../application/dtos/register-sale.dto";
import { AddDetailToSaleDto } from "../../application/dtos/add-detail-to-sale.dto";
import { SaleDetailEntity } from "../entities/sale-detail-entity";
import { FinishSaleDto } from "../../application/dtos/finish-sale.dto";
import { RegisterSalePaymentDto } from "../../application/dtos/register-sale-payment.dto";
import { SalePaymentEntity } from "../entities/sale-payment-entity";
import { FinalizeSaleDto } from "../../application/dtos/finalize-sale.dto";

export interface SaleRepository {
    save(dto: RegisterSaleDto):Promise<Result<SaleEntity, ErrorEntity>>;
    /**
     * Este metodo busca una venta, con todo los detalles(productos) en esta misma venta.
     * @param { bigint } saleId 
     * @returns { Promise<Result<SaleEntity, ErrorEntity>> }
     */
    findSaleWithDetails(saleId: bigint): Promise<Result<SaleEntity, ErrorEntity>>;
    /**
     * Este metodo agrega detalles(productos) a una ventas.
     * @param saleId 
     * @param dto 
     * @returns 
     */
    addDetailToSale(saleId: bigint, dto: AddDetailToSaleDto): Promise<Result<SaleDetailEntity, ErrorEntity>>;
    /**
     * Este metodo finaliza una venta, actualizando la informacion como:
     * - Total de la venta.
     * - El cliente al que se le vente.
     * - Notas adicionales de la venta.
     * @param { bigint } saleId 
     * @param { FinishSaleDto } dto 
     * @returns { Promise<Result<SaleEntity, ErrorEntity>> }
     */
    finishSale(saleId: bigint, dto: FinishSaleDto): Promise<Result<SaleEntity, ErrorEntity>>;
    /**
     * Este metodo finaliza una venta, actualizando la informacion como:
     * - Total de la venta.
     * - El cliente al que se le vente.
     * - Notas adicionales de la venta.
     * Adicionalmente, pide el status, para decidir si queda completada o cancelada la venta.
     * @param { bigint } saleId 
     * @param { FinalizeSaleDto } dto 
     * @returns { Promise<Result<SaleEntity, ErrorEntity>> }
     */
    finalizeSale(saleId: bigint, dto: FinalizeSaleDto): Promise<Result<SaleEntity, ErrorEntity>>;
    /**
     * Este metodo registra los metodos de pago utilizados en la venta y el monto pagado por cada metodo.
     * Ej:
     * - Total: $100.00
     * - Pago por Transferencia: $50.00
     * - Pago en Efectivo:  $50.00 
     * @param {bigint} saleId 
     * @param { RegisterSalePaymentDto } dto
     * @returns { Promise<Result<{payments: SalePaymentEntity[]}, ErrorEntity>> } 
     */
    paidSale(saleId: bigint, dto: RegisterSalePaymentDto): Promise<Result<{payments: SalePaymentEntity[]}, ErrorEntity>>;
    /**
     * Este metodo elimina toda la cantidad de producto de una venta.
     * @param {bigint} saleId 
     * @param {bigint} detailId
     * @returns {Promise<Result<any, ErrorEntity>>}
     */
    physicalDeleteSaleDetail(saleId: bigint, detailId: bigint): Promise<Result<any, ErrorEntity>>;
    /**
     * Este metodo busca todas las ventas de una sucursal.
     * @param {bigint} branchOfficeId 
     * @returns {Promise<Result<{sales:SaleEntity[]}, ErrorEntity>>}
     */
    findAllByBranchOffice(branchOfficeId: bigint): Promise<Result<{sales:SaleEntity[]}, ErrorEntity>>
    /**
     * Este metodo es para buscar una venta y traer la informacion a detalle
     * @param saleId 
     */
    findSaleInfoById(saleId: bigint): Promise<Result<SaleEntity, ErrorEntity>>;
    /**
     * Este metodo retorna un ticket de venta.
     * @param saleId 
     */
    findTickedBySaleId(saleId: bigint): Promise<Result<Blob | any, ErrorEntity>>;
}