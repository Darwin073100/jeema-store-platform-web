import { SaleNotFoundException } from "src/contexts/sale-management/sale/domain/exceptions/sale-not-found.exception";
import { SaleDetailRepository } from "../../domain/repositories/sale-detail.repository";
import { SaleRepository } from "@/contexts/sale-management/sale/domain/repositories/sale.repository";

export class PhysicalDeleteSaleDetailUseCase {
    constructor(
        private readonly repository: SaleDetailRepository,
        private readonly saleRepository: SaleRepository,
    ){}

    async execute( saleId:bigint, detailId: bigint){

        const saleExist = await this.saleRepository.existById(saleId);
        if(!saleExist){
            throw new SaleNotFoundException(`La venta con id ${saleId} no existe.`);
        }

        const result = await this.repository.physicalDelete(detailId);
        if(!result){
            throw new SaleNotFoundException(`No se encontro el detalle de venta por el id ${detailId}`);
        }

        return result;
    }
}